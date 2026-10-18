import { CHARACTERS } from "@/data/characters";
import { FRUITS } from "@/data/fruits";
import type { Mode } from "@/data/modes";
import { QUESTIONS } from "@/data/questions";
import type { Saga, SagaSlug } from "@/data/sagas";
import { STATEMENTS } from "@/data/statements";
import type { Difficulty } from "@/data/types";
import { hashString, mulberry32 } from "./seed";

// Formato único que o componente de jogo entende, independente do modo.
export type Round = {
  id: string;
  saga: Saga;
  difficulty: Difficulty;
  kicker: string; // rótulo curto acima do enunciado
  prompt: string;
  clues?: string[]; // só no "Quem sou eu?"
  options: string[];
  answer: number;
  explanation?: string;
};

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Embaralha as opções e recalcula o índice da resposta certa.
function withShuffledOptions(options: string[], answer: number, rng: () => number = Math.random) {
  const correct = options[answer];
  const shuffled = shuffle(options, rng);
  return { options: shuffled, answer: shuffled.indexOf(correct) };
}

function inSaga<T extends { saga: string }>(items: T[], saga: SagaSlug): T[] {
  return saga === "todas" ? items : items.filter((i) => i.saga === saga);
}

export type DifficultyFilter = Difficulty | "todas";

export function buildRounds(mode: Mode, saga: SagaSlug, difficulty: DifficultyFilter = "todas"): Round[] {
  let pool: Round[] = [];

  switch (mode.slug) {
    case "classico":
    case "duelo":
      pool = inSaga(QUESTIONS, saga).map((q) => ({
        id: q.id,
        saga: q.saga,
        difficulty: q.difficulty,
        kicker: "Pergunta",
        prompt: q.question,
        explanation: q.explanation,
        ...withShuffledOptions(q.options, q.answer),
      }));
      break;

    case "verdadeiro-falso":
      pool = inSaga(STATEMENTS, saga).map((s) => ({
        id: s.id,
        saga: s.saga,
        difficulty: s.difficulty,
        kicker: "Verdadeiro ou falso?",
        prompt: s.text,
        explanation: s.explanation,
        options: ["Verdadeiro", "Falso"],
        answer: s.isTrue ? 0 : 1,
      }));
      break;

    case "quem-sou-eu":
      pool = inSaga(CHARACTERS, saga).map((c) => ({
        id: c.id,
        saga: c.saga,
        difficulty: c.difficulty,
        kicker: "Quem sou eu?",
        prompt: "Descubra o personagem pelas dicas",
        clues: c.clues,
        ...withShuffledOptions(c.options, 0),
      }));
      break;

    case "fruta":
      pool = inSaga(FRUITS, saga).map((f) => ({
        id: f.id,
        saga: f.saga,
        difficulty: f.difficulty,
        kicker: "Qual é a fruta?",
        prompt: f.power,
        ...withShuffledOptions(f.options, 0),
      }));
      break;
  }

  if (difficulty !== "todas") pool = pool.filter((r) => r.difficulty === difficulty);

  // Duelo precisa de número par para os dois jogarem o mesmo tanto de vezes.
  let count = Math.min(mode.rounds, pool.length);
  if (mode.players === 2 && count % 2 === 1) count -= 1;

  return shuffle(pool).slice(0, Math.max(count, 0));
}

export function countRounds(mode: Mode, saga: SagaSlug, difficulty: DifficultyFilter = "todas"): number {
  return buildRounds(mode, saga, difficulty).length;
}

// Desafio diário: 10 perguntas do clássico, iguais para todos no mesmo dia.
export const DAILY_ROUNDS = 10;

export function buildDailyRounds(dateKey: string): Round[] {
  const rng = mulberry32(hashString(`quizu:${dateKey}`));
  const pool = QUESTIONS.map((q) => ({
    id: q.id,
    saga: q.saga,
    difficulty: q.difficulty,
    kicker: "Desafio diário",
    prompt: q.question,
    explanation: q.explanation,
    ...withShuffledOptions(q.options, q.answer, rng),
  }));
  return shuffle(pool, rng).slice(0, DAILY_ROUNDS);
}
