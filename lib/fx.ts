// Efeitos de som e vibração. Tudo gerado com Web Audio, sem arquivos de áudio.
const KEY = "quizu:mudo";
let ac: AudioContext | null = null;
let muted: boolean | null = null;

export function isMuted(): boolean {
  if (muted === null) {
    try {
      muted = localStorage.getItem(KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    // sem armazenamento, só vale nesta sessão
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, vol: number) {
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

export type Sfx = "correct" | "wrong" | "streak" | "tick" | "tap" | "win";

export function play(kind: Sfx, level = 0) {
  if (isMuted() || typeof window === "undefined") return;
  try {
    ac ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ac.state === "suspended") void ac.resume();
    switch (kind) {
      case "correct":
        tone(660, 0, 0.12, "triangle", 0.18);
        tone(880, 0.09, 0.2, "triangle", 0.18);
        break;
      case "streak": {
        // sobe um pouco a cada acerto seguido
        const base = 523 * Math.pow(1.0595, Math.min(level, 6) * 2);
        [1, 1.25, 1.5, 2].forEach((m, i) => tone(base * m, i * 0.07, 0.18, "triangle", 0.16));
        break;
      }
      case "wrong":
        tone(196, 0, 0.28, "sawtooth", 0.12);
        tone(147, 0.12, 0.35, "sawtooth", 0.12);
        break;
      case "tick":
        tone(1200, 0, 0.04, "square", 0.05);
        break;
      case "tap":
        tone(420, 0, 0.05, "sine", 0.08);
        break;
      case "win":
        [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.3, "triangle", 0.18));
        break;
    }
  } catch {
    // áudio é só um extra
  }
}
