"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getMode, type ModeSlug } from "@/data/modes";
import type { SagaSlug } from "@/data/sagas";
import { DIFFICULTY_LABEL } from "@/data/types";
import { SAGA_CREW, getCrewRole, getRank, toBerries } from "@/lib/ranks";
import type { DifficultyFilter } from "@/lib/rounds";
import { longestStreak, type Outcome } from "@/lib/scoring";
import { getBest, saveBest } from "@/lib/storage";

type Props = {
  modeSlug: ModeSlug;
  saga: SagaSlug;
  difficulty: DifficultyFilter;
  total: number;
  outcomes: Outcome[];
  onRestart: () => void;
};

export default function Result({ modeSlug, saga, difficulty, total, outcomes, onRestart }: Props) {
  const mode = getMode(modeSlug)!;
  const isDuel = mode.players === 2;

  const correct = outcomes.filter((o) => o.correct).length;
  const score = outcomes.reduce((sum, o) => sum + o.points, 0);
  const rank = getRank(correct, total);
  const crew = getCrewRole(correct, total);

  // Bando ideal: as sagas em que o jogador foi melhor viram tripulantes.
  const bySaga = new Map<string, { hits: number; total: number }>();
  for (const o of outcomes) {
    const cur = bySaga.get(o.saga) ?? { hits: 0, total: 0 };
    cur.total += 1;
    if (o.correct) cur.hits += 1;
    bySaga.set(o.saga, cur);
  }
  const mates = [...bySaga.entries()]
    .filter(([, v]) => v.hits > 0)
    .sort((a, b) => b[1].hits / b[1].total - a[1].hits / a[1].total || b[1].hits - a[1].hits)
    .slice(0, 3)
    .map(([saga, v]) => ({ ...SAGA_CREW[saga], pct: Math.round((v.hits / v.total) * 100) }));

  const [record, setRecord] = useState<{ best: number; isNew: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  const saved = useRef(false);

  useEffect(() => {
    if (isDuel || saved.current) return;
    saved.current = true;
    const key = `${modeSlug}:${saga}${difficulty === "todas" ? "" : `:${difficulty}`}`;
    const previous = getBest(key);
    const isNew = saveBest(key, score);
    setRecord({ best: Math.max(previous, score), isNew });
  }, [isDuel, modeSlug, saga, difficulty, score]);

  async function share() {
    const text = isDuel
      ? "Joguei um duelo no Quiz One Piece! Vem encarar."
      : `Fiz ${correct}/${total} no Quiz One Piece e virei ${rank.title}! Recompensa: ${toBerries(score)}.`;
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Quiz One Piece", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // o jogador cancelou o compartilhamento
    }
  }

  const actions = (
    <div className="actions">
      <button type="button" className="btn" onClick={onRestart}>
        Jogar de novo
      </button>
      <button type="button" className="btn-ghost" onClick={share}>
        {copied ? "Copiado!" : "Compartilhar"}
      </button>
      <Link className="btn-ghost" href="/">
        Menu
      </Link>
    </div>
  );

  // ---------- Duelo ----------
  if (isDuel) {
    const stats = ([0, 1] as const).map((p) => {
      const mine = outcomes.filter((o) => o.player === p);
      return {
        player: p,
        hits: mine.filter((o) => o.correct).length,
        rounds: mine.length,
        points: mine.reduce((s, o) => s + o.points, 0),
      };
    });
    const [a, b] = stats;
    const winner = a.points === b.points ? null : a.points > b.points ? a : b;

    return (
      <section className="result">
        <div className="wanted">
          <p className="wanted__sub">Fim do duelo</p>
          <div className="wanted__emoji" aria-hidden="true">
            {winner ? "🏆" : "🤝"}
          </div>
          <p className="wanted__rank">{winner ? `Capitão ${winner.player + 1} venceu!` : "Empate!"}</p>
          <p className="wanted__blurb">
            {winner ? "A recompensa mais alta leva a glória." : "Dois capitães à altura um do outro."}
          </p>
        </div>

        <div className="versus">
          {stats.map((s) => (
            <div key={s.player} className={`versus__p${winner?.player === s.player ? " is-winner" : ""}`}>
              <strong>Capitão {s.player + 1}</strong>
              <div className="versus__score">{toBerries(s.points)}</div>
              <span>
                {s.hits} de {s.rounds} acertos
              </span>
            </div>
          ))}
        </div>
        {actions}
      </section>
    );
  }

  // ---------- Solo ----------
  return (
    <section className="result">
      <div className="wanted">
        <p className="wanted__sub">
          Procurado{difficulty !== "todas" ? ` · ${DIFFICULTY_LABEL[difficulty]}` : ""}
        </p>
        <h1 className="wanted__label">{rank.title}</h1>
        <div className="wanted__emoji" aria-hidden="true">
          {rank.emoji}
        </div>
        <p className="wanted__blurb">{rank.blurb}</p>
        <p className="wanted__bounty">
          <small>Recompensa</small>
          {toBerries(score)}
        </p>
      </div>

      {record && (
        <p className="record">
          {record.isNew ? "🎉 Novo recorde nesta combinação!" : `Seu recorde aqui: ${toBerries(record.best)}`}
        </p>
      )}

      <div className="stats">
        <div className="stat">
          <strong>
            {correct}/{total}
          </strong>
          <span>acertos</span>
        </div>
        <div className="stat">
          <strong>{Math.round((correct / total) * 100)}%</strong>
          <span>de precisão</span>
        </div>
        <div className="stat">
          <strong>{longestStreak(outcomes)}</strong>
          <span>maior sequência</span>
        </div>
      </div>

      <div className="crew">
        <p className="crew__label">Seu lugar no bando</p>
        <p className="crew__role">{crew.name}</p>
        <p>{crew.why}</p>
        {mates.length > 1 && (
          <>
            <p className="crew__label crew__label--mates">Seu bando ideal</p>
            <ul className="mates">
              {mates.map((m) => (
                <li key={m.name}>
                  <strong>{m.name}</strong> <span>{m.pct}% na saga dele(a)</span>
                  <br />
                  {m.why}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {actions}
    </section>
  );
}
