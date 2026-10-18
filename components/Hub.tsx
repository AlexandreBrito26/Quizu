"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import Shell from "./Shell";
import { loadProfile } from "@/lib/progress";
import { toBerries } from "@/lib/ranks";

const TABS = [
  { href: "/loja", label: "🛒 Loja" },
  { href: "/conquistas", label: "🏅 Conquistas" },
  { href: "/ranking", label: "🏆 Ranking" },
];

type Props = { title: string; active: string; children: ReactNode; refreshKey?: number };

// Moldura comum da loja, das conquistas e do ranking: título, carteira e abas.
export default function Hub({ title, active, children, refreshKey = 0 }: Props) {
  const [points, setPoints] = useState<number | null>(null);
  useEffect(() => setPoints(loadProfile().points), [refreshKey]);

  return (
    <Shell theme="todas">
      <header className="hub__head">
        <Link className="hud__back" href="/" aria-label="Voltar ao menu">
          ←
        </Link>
        <h1 className="hub__title">{title}</h1>
        <div className="hud__score" aria-label="Carteira">
          {points === null ? "…" : toBerries(points)}
        </div>
      </header>
      <nav className="hub__tabs" aria-label="Seções">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className="chip" aria-current={t.href === active ? "page" : undefined} aria-pressed={t.href === active}>
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </Shell>
  );
}
