import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// POST endpoint to persist uploaded assets into public and dist
app.post('/api/persist-asset', (req, res) => {
  try {
    const { filename, base64 } = req.body;
    if (!filename || !base64) {
      return res.status(400).json({ error: 'Missing filename or base64' });
    }
    const cleanName = path.basename(filename);
    const publicDir = path.resolve(__dirname, 'public');
    const distDir = path.resolve(__dirname, 'dist');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, cleanName);
    const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Protect trimmed Song 3 from being overwritten
    if (cleanName.toLowerCase().includes('song-3') && buffer.length !== 8474121) {
      console.log(`Skipping invalid Song 3 file write (${buffer.length} bytes)`);
      return res.json({ success: true, skipped: true });
    }

    fs.writeFileSync(filePath, buffer);

    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, cleanName), buffer);
    }

    res.json({ success: true, path: `/${cleanName}` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET endpoint to list persisted assets
app.get('/api/persisted-assets', (req, res) => {
  const publicDir = path.resolve(__dirname, 'public');
  const files = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [];
  res.json({ files });
});

// Serve static assets from dist first, then public
const staticOptions = {
  setHeaders: (res: express.Response, filePath: string) => {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
};

app.use(express.static(path.resolve(__dirname, 'dist'), staticOptions));
app.use(express.static(path.resolve(__dirname, 'public'), staticOptions));

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.resolve(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application build not found. Run npm run build first.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
