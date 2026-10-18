import { ACHIEVEMENTS, type Achievement, type GameInfo } from "@/data/achievements";
import { FIFTY_PRICE, SKINS, getSkin } from "@/data/shop";
import { dailyKey, previousDay } from "./seed";
import { longestStreak, type Outcome } from "./scoring";

// Perfil do jogador: carteira, compras, conquistas e desafio diário. Tudo no aparelho.
const KEY = "quizu:perfil";

export type Profile = {
  points: number; // carteira (1 ponto = 100 mil berries)
  earned: number; // total ganho na vida
  owned: string[];
  skin: string;
  fifty: number; // 50/50 extras no estoque
  bought: number;
  ach: Record<string, string>; // id -> data
  games: number;
  correct: number;
  bestStreak: number;
  sagas: string[];
  nick: string;
  device: string;
  daily: { last: string; streak: number; best: number; results: Record<string, number>; sent: Record<string, boolean> };
};

function uid(): string {
  try {
    if (crypto.randomUUID) return crypto.randomUUID();
  } catch {
    // cai no sorteio simples
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function empty(): Profile {
  return {
    points: 0, earned: 0, owned: ["padrao"], skin: "padrao", fifty: 0, bought: 0, ach: {}, games: 0, correct: 0,
    bestStreak: 0, sagas: [], nick: "", device: uid(),
    daily: { last: "", streak: 0, best: 0, results: {}, sent: {} },
  };
}

export function loadProfile(): Profile {
  const base = empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<Profile>;
    return { ...base, ...saved, device: saved.device || base.device, daily: { ...base.daily, ...saved.daily } };
  } catch {
    return base;
  }
}

export function saveProfile(p: Profile) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // sem armazenamento: o jogo segue, só não guarda
  }
}

// Desbloqueia o que já foi cumprido, paga a recompensa e devolve as novas conquistas.
export function checkAchievements(p: Profile, g?: GameInfo): Achievement[] {
  const unlocked: Achievement[] = [];
  let again = true;
  while (again) {
    again = false;
    for (const a of ACHIEVEMENTS) {
      if (p.ach[a.id] || !a.test(p, g)) continue;
      p.ach[a.id] = dailyKey();
      p.points += a.reward;
      p.earned += a.reward;
      unlocked.push(a);
      again = true; // a recompensa pode liberar outra (ex.: tesouro)
    }
  }
  return unlocked;
}

export type GameReport = {
  score: number;
  earned: number;
  bonus: number;
  practice: boolean; // repetição do desafio diário: não paga nem vale no ranking
  streak: number; // dias seguidos de desafio diário
  unlocked: Achievement[];
};

export function recordGame(input: { outcomes: Outcome[]; total: number; saga: string; daily?: string }): GameReport {
  const p = loadProfile();
  const { outcomes, total, saga, daily } = input;
  const score = outcomes.reduce((s, o) => s + o.points, 0);
  const correct = outcomes.filter((o) => o.correct).length;
  const streak = longestStreak(outcomes);

  let practice = false;
  let bonus = 0;
  if (daily) {
    if (p.daily.results[daily] !== undefined) {
      practice = true;
    } else {
      p.daily.streak = p.daily.last === previousDay(daily) ? p.daily.streak + 1 : 1;
      p.daily.best = Math.max(p.daily.best, p.daily.streak);
      p.daily.last = daily;
      p.daily.results[daily] = score;
      bonus = 10 + Math.min(p.daily.streak, 7) * 3;
    }
  }

  const earned = practice ? 0 : score;
  p.points += earned + bonus;
  p.earned += earned + bonus;
  p.games += 1;
  p.correct += correct;
  p.bestStreak = Math.max(p.bestStreak, streak);
  if (!daily && saga !== "todas" && !p.sagas.includes(saga)) p.sagas.push(saga);

  const unlocked = checkAchievements(p, { correct, total, streak, ratio: total ? correct / total : 0, daily: !!daily });
  saveProfile(p);
  return { score, earned, bonus, practice, streak: p.daily.streak, unlocked };
}

export type BuyResult = { ok: boolean; message: string; unlocked: Achievement[] };

export function buyItem(id: string): BuyResult {
  const p = loadProfile();
  if (id === "fifty") {
    if (p.points < FIFTY_PRICE) return { ok: false, message: "Pontos insuficientes.", unlocked: [] };
    p.points -= FIFTY_PRICE;
    p.fifty += 1;
  } else {
    const skin = SKINS.find((s) => s.id === id);
    if (!skin || p.owned.includes(id)) return { ok: false, message: "Você já tem este item.", unlocked: [] };
    if (p.points < skin.price) return { ok: false, message: "Pontos insuficientes.", unlocked: [] };
    p.points -= skin.price;
    p.owned.push(id);
    p.skin = id; // já equipa ao comprar
  }
  p.bought += 1;
  const unlocked = checkAchievements(p);
  saveProfile(p);
  return { ok: true, message: "Compra feita!", unlocked };
}

export function equipSkin(id: string) {
  const p = loadProfile();
  if (p.owned.includes(id)) {
    p.skin = id;
    saveProfile(p);
  }
}

export function consumeFifty(): boolean {
  const p = loadProfile();
  if (p.fifty <= 0) return false;
  p.fifty -= 1;
  saveProfile(p);
  return true;
}

export function currentLook() {
  return getSkin(loadProfile().skin).look;
}

export function setNick(nick: string) {
  const p = loadProfile();
  p.nick = nick;
  saveProfile(p);
}

export function markSent(date: string) {
  const p = loadProfile();
  p.daily.sent[date] = true;
  saveProfile(p);
}
