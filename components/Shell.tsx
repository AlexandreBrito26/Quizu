import type { ReactNode } from "react";
import SeaScene from "./SeaScene";

type Props = {
  theme: string; // slug da saga: define as cores via [data-theme]
  children: ReactNode;
};

export default function Shell({ theme, children }: Props) {
  return (
    <div className="shell" data-theme={theme}>
      <div className="shell__content">{children}</div>
      <SeaScene theme={theme} />
      <footer className="shell__footer">
        Projeto de fã, sem fins lucrativos. One Piece © Eiichiro Oda / Shueisha / Toei Animation. Sem spoilers além de
        Enies Lobby.
      </footer>
    </div>
  );
}
