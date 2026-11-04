// Gentle harmonic chime synthesis using Web Audio API
// Soft, celestial, bell-like tones without needing external MP3 files.

let audioCtx: AudioContext | null = null;

export function playSoftChime(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    // Delicate Pentatonic notes (F5, A5, C6, E6) for a warm, relieving harmony
    const notes = [698.46, 880.0, 1046.5, 1318.51];

    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      // Soft envelope (gentle attack, lingering decay)
      const startTime = now + idx * 0.12;
      const duration = 1.4;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  } catch (err) {
    // Graceful fallback if user environment restricts audio
    console.debug('Audio playback note:', err);
  }
}
