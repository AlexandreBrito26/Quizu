import type { Saga } from "@/data/sagas";
import type { Difficulty } from "@/data/types";

export type Outcome = {
  correct: boolean;
  points: number; // cada ponto vale 100 mil berries (ver toBerries)
  player: 0 | 1;
  saga: Saga;
};

const BASE: Record<Difficulty, number> = { facil: 10, medio: 15, dificil: 25 };

type PointsInput = {
  difficulty: Difficulty;
  correct: boolean;
  secondsLeft: number;
  seconds: number; // 0 = sem tempo
  streak: number; // acertos seguidos do jogador, contando este
  cluesShown: number;
  cluesTotal: number; // 0 fora do "Quem sou eu?"
};

export function roundPoints(input: PointsInput): number {
  if (!input.correct) return 0;
  let points = BASE[input.difficulty];

  if (input.cluesTotal > 0) {
    // Quanto menos dicas usadas, mais pontos.
    points += Math.max(0, input.cluesTotal - input.cluesShown) * 4;
  } else if (input.seconds > 0) {
    // Bônus de velocidade: até +5.
    points += Math.round((input.secondsLeft / input.seconds) * 5);
  }

  // Bônus de sequência: +2 por acerto seguido a partir do segundo, até +10.
  points += Math.min(Math.max(input.streak - 1, 0), 5) * 2;
  return points;
}

// Acertos seguidos do jogador no fim da lista (sem contar a rodada atual).
export function trailingStreak(outcomes: Outcome[], player: 0 | 1): number {
  let streak = 0;
  for (let i = outcomes.length - 1; i >= 0; i--) {
    if (outcomes[i].player !== player) continue;
    if (!outcomes[i].correct) break;
    streak++;
  }
  return streak;
}

export function longestStreak(outcomes: Outcome[], player?: 0 | 1): number {
  let best = 0;
  let current = 0;
  for (const o of outcomes) {
    if (player !== undefined && o.player !== player) continue;
    current = o.correct ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}
