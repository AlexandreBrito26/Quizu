// localStorage pode falhar (modo privado, bloqueio de dados), então tudo vai em try/catch.
const PREFIX = "onepiece-quiz:best:";

export function getBest(key: string): number {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    const value = raw ? Number(raw) : 0;
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

// Devolve true se bateu o recorde.
export function saveBest(key: string, score: number): boolean {
  try {
    const previous = getBest(key);
    if (score > previous) {
      window.localStorage.setItem(PREFIX + key, String(score));
      return true;
    }
  } catch {
    // sem armazenamento: o jogo segue normalmente
  }
  return false;
}
