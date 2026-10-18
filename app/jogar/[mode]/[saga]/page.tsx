import { notFound } from "next/navigation";
import Game from "@/components/Game";
import { MODES, getMode } from "@/data/modes";
import { SAGA_PAGES, getSagaPage } from "@/data/sagas";

// Todas as combinações são conhecidas, então viram páginas estáticas (ideal para a Vercel).
export const dynamicParams = false;

export function generateStaticParams() {
  return MODES.flatMap((mode) => SAGA_PAGES.map((saga) => ({ mode: mode.slug, saga: saga.slug })));
}

export default async function PlayPage({ params }: { params: Promise<{ mode: string; saga: string }> }) {
  const { mode, saga } = await params;
  const foundMode = getMode(mode);
  const foundSaga = getSagaPage(saga);
  if (!foundMode || !foundSaga) notFound();
  return <Game modeSlug={foundMode.slug} saga={foundSaga.slug} />;
}
