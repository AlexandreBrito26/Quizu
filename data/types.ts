import type { Saga } from "./sagas";

export type Difficulty = "facil" | "medio" | "dificil";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

// Pergunta de múltipla escolha (modos Clássico e Duelo)
export type Question = {
  id: string;
  saga: Saga;
  difficulty: Difficulty;
  question: string;
  options: string[]; // sempre 4
  answer: number; // índice da opção correta
  explanation?: string;
};

// Sem id: ele é gerado a partir da saga + posição.
export type QuestionInput = Omit<Question, "id" | "saga">;

export type Statement = {
  id: string;
  saga: Saga;
  difficulty: Difficulty;
  text: string;
  isTrue: boolean;
  explanation?: string;
};

export type Character = {
  id: string;
  saga: Saga;
  difficulty: Difficulty;
  name: string;
  clues: string[]; // da mais difícil para a mais fácil
  options: string[]; // 4 nomes, incluindo o correto
};

export type Fruit = {
  id: string;
  saga: Saga;
  difficulty: Difficulty;
  name: string;
  power: string;
  options: string[]; // 4 nomes de frutas, incluindo a correta
};
