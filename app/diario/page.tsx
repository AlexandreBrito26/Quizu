export const metadata = { title: "Desafio diário · Quizu" };

import Game from "@/components/Game";

export default function Page() {
  return <Game modeSlug="classico" saga="todas" daily />;
}
