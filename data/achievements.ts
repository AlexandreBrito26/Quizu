import type { Profile } from "@/lib/progress";

export type GameInfo = { correct: number; total: number; streak: number; ratio: number; daily: boolean };

export type Achievement = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  reward: number; // pontos extras na carteira
  test: (p: Profile, g?: GameInfo) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "primeira", name: "Primeira viagem", desc: "Termine seu primeiro jogo.", emoji: "⛵", reward: 10, test: (p) => p.games >= 1 },
  { id: "dedicado", name: "Marujo dedicado", desc: "Termine 10 jogos.", emoji: "⚓", reward: 30, test: (p) => p.games >= 10 },
  { id: "veterano", name: "Lobo do mar", desc: "Termine 50 jogos.", emoji: "🌊", reward: 100, test: (p) => p.games >= 50 },
  { id: "sem-erros", name: "Mira perfeita", desc: "Acerte tudo em um jogo de 8 rodadas ou mais.", emoji: "🎯", reward: 50, test: (_, g) => !!g && g.total >= 8 && g.correct === g.total },
  { id: "chamas", name: "Em chamas", desc: "Faça 5 acertos seguidos.", emoji: "🔥", reward: 20, test: (p) => p.bestStreak >= 5 },
  { id: "imparavel", name: "Imparável", desc: "Faça 10 acertos seguidos.", emoji: "⚡", reward: 60, test: (p) => p.bestStreak >= 10 },
  { id: "rei", name: "Rei dos Piratas", desc: "Alcance 95% de acertos ou mais (8 rodadas ou mais).", emoji: "👑", reward: 80, test: (_, g) => !!g && g.total >= 8 && g.ratio >= 0.95 },
  { id: "grand-line", name: "Grand Line completa", desc: "Jogue uma saga de cada: East Blue, Arabasta, Skypiea, Water 7 e Enies Lobby.", emoji: "🗺️", reward: 100, test: (p) => ["east-blue", "arabasta", "skypiea", "water-7", "enies-lobby"].every((s) => p.sagas.includes(s)) },
  { id: "tesouro", name: "Tesouro escondido", desc: "Junte 1.000 pontos no total.", emoji: "💰", reward: 50, test: (p) => p.earned >= 1000 },
  { id: "compra", name: "Cliente da loja", desc: "Compre algo na loja.", emoji: "🛒", reward: 10, test: (p) => p.bought >= 1 },
  { id: "colecionador", name: "Colecionador", desc: "Tenha todos os navios da loja.", emoji: "🏴‍☠️", reward: 100, test: (p) => ["rubro", "dourado", "fantasma", "aurora"].every((s) => p.owned.includes(s)) },
  { id: "diario-1", name: "Missão cumprida", desc: "Complete o desafio diário.", emoji: "📅", reward: 20, test: (p) => Object.keys(p.daily.results).length >= 1 },
  { id: "diario-3", name: "Constância", desc: "Complete o desafio diário 3 dias seguidos.", emoji: "🔁", reward: 50, test: (p) => p.daily.best >= 3 },
  { id: "diario-7", name: "Semana de ouro", desc: "Complete o desafio diário 7 dias seguidos.", emoji: "🏆", reward: 150, test: (p) => p.daily.best >= 7 },
];
