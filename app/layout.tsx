import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Quizu · One Piece até Enies Lobby",
  description:
    "Quiz de fã de One Piece sem spoilers além de Enies Lobby: modo clássico, quem sou eu, verdadeiro ou falso, fruta do diabo e duelo local.",
  applicationName: "Quizu",
  appleWebApp: { capable: true, title: "Quizu", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // usa a tela toda em celulares com notch
  themeColor: "#0b4a82",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
