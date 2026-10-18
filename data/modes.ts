export type ModeSlug = "classico" | "quem-sou-eu" | "verdadeiro-falso" | "fruta" | "duelo";

export type Mode = {
  slug: ModeSlug;
  name: string;
  description: string;
  emoji: string;
  rounds: number; // quantas rodadas no máximo
  seconds: number; // tempo por rodada (0 = sem tempo)
  players: 1 | 2;
};

export const MODES: Mode[] = [
  {
    slug: "classico",
    name: "Clássico",
    description: "10 perguntas de múltipla escolha, com tempo e bônus de sequência",
    emoji: "📜",
    rounds: 10,
    seconds: 20,
    players: 1,
  },
  {
    slug: "quem-sou-eu",
    name: "Quem sou eu?",
    description: "As dicas aparecem aos poucos. Quanto menos dicas, mais pontos",
    emoji: "🕵️",
    rounds: 8,
    seconds: 0,
    players: 1,
  },
  {
    slug: "verdadeiro-falso",
    name: "Verdadeiro ou falso",
    description: "Rápido e ótimo para jogar com amigos: 10 segundos por frase",
    emoji: "⚡",
    rounds: 12,
    seconds: 10,
    players: 1,
  },
  {
    slug: "fruta",
    name: "Fruta do Diabo",
    description: "Leia o poder e descubra qual fruta é",
    emoji: "🍇",
    rounds: 8,
    seconds: 20,
    players: 1,
  },
  {
    slug: "duelo",
    name: "Duelo local",
    description: "Dois jogadores no mesmo aparelho, alternando as perguntas",
    emoji: "⚔️",
    rounds: 10,
    seconds: 15,
    players: 2,
  },
];

export function getMode(slug: string): Mode | undefined {
  return MODES.find((m) => m.slug === slug);
}
