import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function serveImagesPlugin(): Plugin {
  return {
    name: 'serve-images-flexible',
    configureServer(server) {
      // POST endpoint to write client-uploaded assets into public/ directory for permanent server-side retention
      server.middlewares.use('/api/persist-asset', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const filename = parsed.filename;
            const base64 = parsed.base64;
            if (!filename || !base64) {
              res.statusCode = 400;
              return res.end('Missing filename or base64');
            }
            const cleanName = path.basename(filename);
            const publicDir = path.resolve(__dirname, 'public');
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }
            const filePath = path.join(publicDir, cleanName);
            const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(filePath, buffer);

            // Also copy directly to dist/ if dist exists
            const distDir = path.resolve(__dirname, 'dist');
            if (fs.existsSync(distDir)) {
              fs.writeFileSync(path.join(distDir, cleanName), buffer);
            }

            console.log(`[persist-asset] Successfully saved/overwrote ${cleanName} (${buffer.length} bytes) in public/ and dist/`);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, path: `/${cleanName}`, bytes: buffer.length }));
          } catch (e: any) {
            console.error('[persist-asset] Error saving file:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });

      // GET endpoint to inspect persisted public assets
      server.middlewares.use('/api/persisted-assets', (req, res) => {
        const publicDir = path.resolve(__dirname, 'public');
        const files = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ files }));
      });

      // Flexible static file server
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
        const lower = decodedUrl.toLowerCase();
        const isMedia =
          lower.endsWith('.png') ||
          lower.endsWith('.jpg') ||
          lower.endsWith('.jpeg') ||
          lower.endsWith('.webp') ||
          lower.endsWith('.svg') ||
          lower.endsWith('.mp3') ||
          lower.endsWith('.wav') ||
          lower.endsWith('.mp4');

        if (isMedia) {
          const rawFileName = path.basename(decodedUrl);
          const ext = path.extname(rawFileName).toLowerCase();
          let fileName = rawFileName;
          const lName = rawFileName.toLowerCase();

          // Resolve aliases for canonical audio files
          if (lName.endsWith('.mp3')) {
            if (lName.includes('novo') || lName.includes('state line')) fileName = 'song-1.mp3';
            else if (lName.includes('waiting room') || (lName.includes('phoebe') && !lName.includes('scott'))) fileName = 'song-2.mp3';
            else if (lName.includes('seafret') || lName.includes('ocean')) fileName = 'song-3.mp3';
            else if (lName.includes('syml') || lName.includes('where\'s my love') || lName.includes('wheres my love')) fileName = 'song-4.mp3';
            else if (lName.includes('capaldi') || lName.includes('before you go') || lName.includes('tiny desk')) fileName = 'song-5.mp3';
            else if (lName.includes('scott') || lName.includes('polaroid')) fileName = 'song-6.mp3';
            else if (lName.includes('clairo') || lName.includes('bags')) fileName = 'song-7.mp3';
            else if (lName.includes('start') && lName.includes('sound')) fileName = 'start button sound.mp3';
            else if (lName.includes('pause') && lName.includes('sound')) fileName = 'pause button sound.mp3';
          }

          // Resolve aliases for hover images
          if (lName.endsWith('.png')) {
            if (lName.includes('golden comet') || lName.includes('comet hover')) fileName = 'song-1-hover.png';
            else if (lName.includes('ring hover')) fileName = 'song-2-hover.png';
            else if (lName.includes('forget me not') || lName.includes('forget-me-not')) fileName = 'song-3-hover.png';
            else if (lName.includes('crane hover')) fileName = 'song-4-hover.png';
            else if (lName.includes('cupcake hover')) fileName = 'song-5-hover.png';
            else if (lName.includes('polaroid hover')) fileName = 'song-6-hover.png';
            else if (lName.includes('complete tracklist') || lName.includes('tracklist hover')) fileName = 'song-7-hover.png';
            else if (lName.includes('play') && lName.includes('hover')) fileName = 'play-hover.png';
            else if (lName.includes('pause') && lName.includes('hover')) fileName = 'pause-hover.png';
            else if (lName.includes('stop') && lName.includes('hover')) fileName = 'stop-hover.png';
            else if (lName.includes('hover') && lName.includes('mapping')) fileName = 'hover mapping.png';
          }

          const mimeTypes: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
          };
          const contentType = mimeTypes[ext] || 'application/octet-stream';

          const searchDirs = [
            path.resolve(__dirname, 'public'),
            path.resolve(__dirname),
            path.resolve(__dirname, 'src/assets'),
          ];

          for (const dir of searchDirs) {
            if (fs.existsSync(dir)) {
              // Direct match
              const directPath = path.join(dir, fileName);
              if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
                res.setHeader('Content-Type', contentType);
                fs.createReadStream(directPath).pipe(res);
                return;
              }

              // Scan for match with fuzzy/escaped slashes
              const files = fs.readdirSync(dir);
              for (const f of files) {
                const cleanF = f.replace(/^[\\\/]+/, '').replace(/[\\\/]+$/, '');
                if (
                  cleanF.toLowerCase() === fileName.toLowerCase() ||
                  f.toLowerCase().includes(fileName.toLowerCase()) ||
                  fileName.toLowerCase().includes(cleanF.toLowerCase())
                ) {
                  const fullP = path.join(dir, f);
                  if (fs.existsSync(fullP) && fs.statSync(fullP).isFile()) {
                    res.setHeader('Content-Type', contentType);
                    fs.createReadStream(fullP).pipe(res);
                    return;
                  }
                }
              }
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveImagesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
