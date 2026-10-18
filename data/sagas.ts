export type Saga = "east-blue" | "arabasta" | "skypiea" | "water-7" | "enies-lobby";
export type SagaSlug = Saga | "todas";

export type SagaPage = {
  slug: SagaSlug;
  name: string;
  description: string;
  emoji: string;
};

// Só arcos até Enies Lobby, nada depois.
export const SAGA_PAGES: SagaPage[] = [
  { slug: "todas", name: "Grand Line completa", description: "Todas as sagas misturadas", emoji: "🏴‍☠️" },
  { slug: "east-blue", name: "East Blue", description: "De Romance Dawn a Loguetown", emoji: "🌊" },
  { slug: "arabasta", name: "Arabasta", description: "De Whiskey Peak ao deserto", emoji: "🏜️" },
  { slug: "skypiea", name: "Skypiea", description: "Jaya e a ilha do céu", emoji: "☁️" },
  { slug: "water-7", name: "Water 7", description: "A cidade da água e a CP9", emoji: "🚢" },
  { slug: "enies-lobby", name: "Enies Lobby", description: "A guerra contra o Governo", emoji: "⚖️" },
];

export function getSagaPage(slug: string): SagaPage | undefined {
  return SAGA_PAGES.find((s) => s.slug === slug);
}
