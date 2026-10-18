"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Shell from "./Shell";
import { MODES } from "@/data/modes";
import { SAGA_PAGES, type SagaSlug } from "@/data/sagas";
import { DIFFICULTY_LABEL } from "@/data/types";
import { toBerries } from "@/lib/ranks";
import { countRounds, type DifficultyFilter } from "@/lib/rounds";

const LEVELS: DifficultyFilter[] = ["todas", "facil", "medio", "dificil"];
import { getBest } from "@/lib/storage";

export default function Menu() {
  const [saga, setSaga] = useState<SagaSlug>("todas");
  const [level, setLevel] = useState<DifficultyFilter>("todas");
  const [best, setBest] = useState<Record<string, number>>({});

  // Recordes ficam no localStorage, então só dá para ler depois de montar.
  useEffect(() => {
    const next: Record<string, number> = {};
    for (const mode of MODES) next[mode.slug] = getBest(`${mode.slug}:${saga}${level === "todas" ? "" : `:${level}`}`);
    setBest(next);
  }, [saga, level]);

  const current = SAGA_PAGES.find((s) => s.slug === saga) ?? SAGA_PAGES[0];

  return (
    <Shell theme={saga}>
      <header className="hero">
        <p className="hero__eyebrow">Quizu · One Piece até Enies Lobby</p>
        <h1 className="hero__title">Rumo à Grand Line</h1>
        <p className="hero__sub">
          Escolha uma saga, escolha um modo e mostre que você conhece cada canto do mar. Cada saga muda o visual do jogo.
        </p>
      </header>

      <h2 className="section-title">1. Escolha a saga</h2>
      <div className="chips" role="group" aria-label="Saga">
        {SAGA_PAGES.map((s) => (
          <button
            key={s.slug}
            type="button"
            className="chip"
            aria-pressed={s.slug === saga}
            onClick={() => setSaga(s.slug)}
          >
            <span aria-hidden="true">{s.emoji}</span>
            {s.name}
          </button>
        ))}
      </div>
      <p className="saga-note">{current.description}</p>

      <h2 className="section-title">2. Escolha o nível</h2>
      <div className="chips" role="group" aria-label="Nível de dificuldade">
        {LEVELS.map((l) => (
          <button key={l} type="button" className="chip" aria-pressed={l === level} onClick={() => setLevel(l)}>
            {l === "todas" ? "Todos os níveis" : DIFFICULTY_LABEL[l]}
          </button>
        ))}
      </div>

      <h2 className="section-title">3. Escolha o modo</h2>
      <ul className="modes">
        {MODES.map((mode) => {
          const rounds = countRounds(mode, saga, level);
          const disabled = rounds < 2;
          const record = best[mode.slug] ?? 0;
          return (
            <li key={mode.slug}>
              <Link
                className="mode"
                href={`/jogar/${mode.slug}/${saga}${level === "todas" ? "" : `?d=${level}`}`}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : undefined}
              >
                <span className="mode__emoji" aria-hidden="true">
                  {mode.emoji}
                </span>
                <span>
                  <span className="mode__name">{mode.name}</span>
                  <span className="mode__desc">{mode.description}</span>
                  <span className="mode__meta">
                    {disabled ? "Poucas rodadas assim. Tente outra saga ou nível." : `${rounds} rodadas`}
                    {!disabled && mode.players === 1 && record > 0 ? ` · Recorde ${toBerries(record)}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
