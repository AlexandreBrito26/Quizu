import type { MetadataRoute } from "next";

// Permite "Adicionar à tela inicial" no celular e abrir em tela cheia.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quizu",
    short_name: "Quizu",
    description: "Quiz de fã de One Piece, sem spoilers além de Enies Lobby.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#06182e",
    theme_color: "#0b4a82",
    lang: "pt-BR",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
