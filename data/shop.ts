export type Look = { sail: string; hull: string; flag: string };
export type Skin = { id: string; name: string; emoji: string; price: number; look: Look | null };

// Preço em pontos (cada ponto vale 100 mil berries). Um jogo bom rende cerca de 150 a 250 pontos.
export const SKINS: Skin[] = [
  { id: "padrao", name: "Navio da saga", emoji: "⛵", price: 0, look: null },
  { id: "rubro", name: "Velas Rubras", emoji: "🟥", price: 150, look: { sail: "#e0463b", hull: "#4a1f12", flag: "#111111" } },
  { id: "dourado", name: "Casco Dourado", emoji: "🟨", price: 300, look: { sail: "#ffd966", hull: "#7a4a10", flag: "#ffffff" } },
  { id: "fantasma", name: "Navio Fantasma", emoji: "👻", price: 450, look: { sail: "#cfe8e8", hull: "#26394a", flag: "#7fe7ff" } },
  { id: "aurora", name: "Aurora", emoji: "🌌", price: 700, look: { sail: "#c79bff", hull: "#2a1747", flag: "#ff6bd6" } },
];

export const FIFTY_PRICE = 30;

export function getSkin(id: string): Skin {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}
