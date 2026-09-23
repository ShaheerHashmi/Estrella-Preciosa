// Web Audio API harmonic crystal chime synthesizer for stained glass reveals

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playGlassChime(panelNumber: number = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Scale frequency based on panel (pentatonic harmonic ladder)
    const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    const base = baseFreqs[(panelNumber - 1) % baseFreqs.length] * (panelNumber > 10 ? 1.5 : 1.0);

    // Fundamental tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(base, now);

    // Harmonic crystalline overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(base * 2.76, now); // Metallic glass overtone

    // Sparkle shimmer
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(base * 4.2, now);

    // Envelope
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    gain3.gain.setValueAtTime(0.001, now);
    gain3.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);
    gain3.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 1.7);
    osc2.stop(now + 1.3);
    osc3.stop(now + 0.9);
  } catch {
    // Gracefully handle browser autoplay restrictions
  }
}

export function playFullCelebrationChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, i) => {
      setTimeout(() => {
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.6);
      }, i * 110);
    });
  } catch {
    // Ignore autoplay restriction
  }
}

// Fallback mechanical Walkman cassette button press sounds (heavy tactile latching click)
export function playMechanicalButtonClick(type: 'play' | 'pause' | 'stop') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Fast burst noise buffer for initial transient "thunk / snap"
    const bufferSize = ctx.sampleRate * 0.04;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(type === 'play' ? 1200 : type === 'stop' ? 800 : 900, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);

    // Deep resonant metallic chassis resonance
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    const basePitch = type === 'play' ? 240 : type === 'stop' ? 160 : 180;
    osc.frequency.setValueAtTime(basePitch, now);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.4, now + 0.06);

    oscGain.gain.setValueAtTime(0.28, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Gracefully handle browser policy
  }
}

