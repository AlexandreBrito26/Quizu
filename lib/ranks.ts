export type Rank = {
  title: string;
  emoji: string;
  blurb: string;
};

const RANKS: { min: number; rank: Rank }[] = [
  { min: 0.95, rank: { title: "Rei dos Piratas", emoji: "👑", blurb: "Você conhece cada canto da Grand Line!" } },
  { min: 0.8, rank: { title: "Yonkou", emoji: "🔥", blurb: "Poucos chegam tão longe. Respeito de imperador." } },
  { min: 0.6, rank: { title: "Supernova", emoji: "⭐", blurb: "Uma nova estrela está nascendo nos mares." } },
  { min: 0.35, rank: { title: "Pirata", emoji: "🏴‍☠️", blurb: "Já tem recompensa na cabeça. Falta só treinar mais." } },
  { min: 0, rank: { title: "Grumete", emoji: "⚓", blurb: "Todo grande pirata começou esfregando o convés." } },
];

export function getRank(correct: number, total: number): Rank {
  const ratio = total > 0 ? correct / total : 0;
  return (RANKS.find((r) => ratio >= r.min) ?? RANKS[RANKS.length - 1]).rank;
}

// Cada ponto vale 100 mil berries.
export function toBerries(score: number): string {
  return `฿ ${(score * 100_000).toLocaleString("pt-BR")}`;
}

// O bando ideal sai do desempenho (e do arco, quando o jogador escolhe um só).
const CREW: { min: number; name: string; why: string }[] = [
  { min: 0.9, name: "Capitão", why: "Visão de líder: você não erra o rumo." },
  { min: 0.75, name: "Navegador", why: "Você lê o mapa (e as perguntas) com facilidade." },
  { min: 0.6, name: "Espadachim", why: "Firme e direto: quando acerta, acerta forte." },
  { min: 0.45, name: "Cozinheiro", why: "Sabe o básico e ainda tem muito para temperar." },
  { min: 0.3, name: "Atirador", why: "Algumas respostas foram tiros de longe, outras bateram na trave." },
  { min: 0, name: "Médico", why: "Ainda aprendendo, mas ninguém fica para trás." },
];

export function getCrewRole(correct: number, total: number) {
  const ratio = total > 0 ? correct / total : 0;
  return CREW.find((c) => ratio >= c.min) ?? CREW[CREW.length - 1];
}

// Tripulante que combina com a saga em que o jogador foi melhor.
export const SAGA_CREW: Record<string, { name: string; why: string }> = {
  "east-blue": { name: "Zoro", why: "Você domina as origens da jornada: leal, direto e firme desde o começo." },
  arabasta: { name: "Nami", why: "Você lê o terreno e as pistas como uma navegadora de primeira." },
  skypiea: { name: "Usopp", why: "Você acredita nas lendas e ainda lembra de cada detalhe da aventura." },
  "water-7": { name: "Franky", why: "Você entende o que move a cidade, e o que a faz funcionar." },
  "enies-lobby": { name: "Robin", why: "Você guarda a história inteira e não solta nem sob pressão." },
};
