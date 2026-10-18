"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Result from "./Result";
import Shell from "./Shell";
import { getMode, type ModeSlug } from "@/data/modes";
import type { SagaSlug } from "@/data/sagas";
import { DIFFICULTY_LABEL } from "@/data/types";
import { toBerries } from "@/lib/ranks";
import { buildRounds, type DifficultyFilter, type Round } from "@/lib/rounds";
import { roundPoints, trailingStreak, type Outcome } from "@/lib/scoring";

const KEYS = ["A", "B", "C", "D"];

type Props = { modeSlug: ModeSlug; saga: SagaSlug };

export default function Game({ modeSlug, saga }: Props) {
  const mode = getMode(modeSlug)!;
  const isDuel = mode.players === 2;

  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [index, setIndex] = useState(0);
  // undefined = ainda não respondeu · null = tempo esgotado · número = opção escolhida
  const [picked, setPicked] = useState<number | null | undefined>(undefined);
  const [cluesShown, setCluesShown] = useState(1);
  const [left, setLeft] = useState(mode.seconds);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [finished, setFinished] = useState(false);

  const [difficulty, setDifficulty] = useState<DifficultyFilter>("todas");
  const startedAt = useRef(0);
  const answered = useRef(false);

  // O sorteio só acontece no cliente, senão o HTML do servidor não bate com o do navegador.
  const start = useCallback(() => {
    answered.current = false;
    // A dificuldade vem da URL (?d=facil|medio|dificil), escolhida no menu.
    const d = new URLSearchParams(window.location.search).get("d");
    const level: DifficultyFilter = d === "facil" || d === "medio" || d === "dificil" ? d : "todas";
    setDifficulty(level);
    setRounds(buildRounds(mode, saga, level));
    setIndex(0);
    setPicked(undefined);
    setCluesShown(1);
    setOutcomes([]);
    setFinished(false);
  }, [mode, saga]);

  useEffect(() => {
    start();
  }, [start]);

  const round = rounds?.[index];
  const player = (index % 2) as 0 | 1;

  useEffect(() => {
    if (!round) return;
    startedAt.current = performance.now();
    setLeft(mode.seconds);
  }, [round, mode.seconds]);

  const answer = useCallback(
    (choice: number | null) => {
      if (!round || answered.current) return;
      answered.current = true;

      const secondsLeft =
        mode.seconds > 0 ? Math.max(0, mode.seconds - (performance.now() - startedAt.current) / 1000) : 0;
      const correct = choice !== null && choice === round.answer;
      const points = correct
        ? roundPoints({
            difficulty: round.difficulty,
            correct,
            secondsLeft,
            seconds: mode.seconds,
            streak: trailingStreak(outcomes, player) + 1,
            cluesShown,
            cluesTotal: round.clues?.length ?? 0,
          })
        : 0;

      setPicked(choice);
      setOutcomes((prev) => [...prev, { correct, points, player, saga: round.saga }]);

      try {
        navigator.vibrate?.(correct ? 30 : [60, 40, 60]);
      } catch {
        // vibração é só um extra
      }
    },
    [round, mode.seconds, outcomes, player, cluesShown],
  );

  // Cronômetro
  useEffect(() => {
    if (!round || mode.seconds === 0 || picked !== undefined) return;
    const id = window.setInterval(() => {
      const remaining = mode.seconds - (performance.now() - startedAt.current) / 1000;
      if (remaining <= 0) {
        setLeft(0);
        answer(null);
      } else {
        setLeft(remaining);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [round, mode.seconds, picked, answer]);

  const next = useCallback(() => {
    if (!rounds) return;
    if (index + 1 >= rounds.length) {
      setFinished(true);
      return;
    }
    answered.current = false;
    setIndex((i) => i + 1);
    setPicked(undefined);
    setCluesShown(1);
  }, [rounds, index]);

  // Atalhos de teclado para quem joga no computador: 1 a 4 respondem, Enter avança.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!round || finished) return;
      if (picked === undefined) {
        const n = Number(e.key);
        if (n >= 1 && n <= round.options.length) answer(n - 1);
      } else if (e.key === "Enter" && !(e.target as HTMLElement).closest("button, a")) {
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [round, finished, picked, answer, next]);

  // ---------- telas ----------
  if (!rounds) {
    return (
      <Shell theme={saga}>
        <p className="loading">Preparando as velas…</p>
      </Shell>
    );
  }

  if (rounds.length === 0) {
    return (
      <Shell theme={saga}>
        <article className="card">
          <h1 className="card__prompt">Sem rodadas para esta combinação</h1>
          <p>Tente outra saga ou outro modo.</p>
        </article>
        <div className="dock">
          <Link className="btn" href="/">
            Voltar ao menu
          </Link>
        </div>
      </Shell>
    );
  }

  if (finished) {
    return (
      <Shell theme={saga}>
        <Result modeSlug={modeSlug} saga={saga} difficulty={difficulty} total={rounds.length} outcomes={outcomes} onRestart={start} />
      </Shell>
    );
  }

  if (!round) return null;

  // No modo "todas", o tema acompanha a saga da pergunta atual.
  const theme = saga === "todas" ? round.saga : saga;
  const total = outcomes.reduce((sum, o) => sum + o.points, 0);
  const cluesTotal = round.clues?.length ?? 0;
  const hasAnswered = picked !== undefined;
  const last = outcomes[outcomes.length - 1];
  const duelScore = (p: 0 | 1) => outcomes.filter((o) => o.player === p).reduce((s, o) => s + o.points, 0);
  const progress = ((index + (hasAnswered ? 1 : 0)) / rounds.length) * 100;
  const lastRound = index + 1 >= rounds.length;

  let nextLabel = lastRound ? "Ver resultado" : "Próxima →";
  if (isDuel && !lastRound) nextLabel = `Vez do Capitão ${player === 0 ? 2 : 1} →`;

  return (
    <Shell theme={theme}>
      <header className="hud">
        <Link className="hud__back" href="/" aria-label="Voltar ao menu">
          ←
        </Link>
        <div className="hud__center">
          <span className="hud__mode">
            <span aria-hidden="true">{mode.emoji}</span> {mode.name}
          </span>
          <span className="hud__count">
            Rodada {index + 1} de {rounds.length}
          </span>
        </div>
        {!isDuel && <div className="hud__score">{toBerries(total)}</div>}
      </header>

      <div
        className="bar"
        role="progressbar"
        aria-label="Progresso"
        aria-valuemin={0}
        aria-valuemax={rounds.length}
        aria-valuenow={index + (hasAnswered ? 1 : 0)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      {mode.seconds > 0 && (
        <div className={`bar bar--timer${left <= 5 && !hasAnswered ? " is-low" : ""}`} aria-hidden="true">
          <span style={{ width: `${(left / mode.seconds) * 100}%` }} />
        </div>
      )}
      {mode.seconds > 0 && <p className="sr-only">Tempo restante: {Math.ceil(left)} segundos</p>}

      {isDuel && (
        <div className="duel">
          {([0, 1] as const).map((p) => (
            <div key={p} className={`duel__p${p === player ? " is-turn" : ""}`}>
              <div className="duel__name">
                Capitão {p + 1}
                {p === player ? " · sua vez" : ""}
              </div>
              <div className="duel__score">{toBerries(duelScore(p))}</div>
            </div>
          ))}
        </div>
      )}

      <article className="card" key={round.id}>
        <p className="card__kicker">
          {round.kicker} · {DIFFICULTY_LABEL[round.difficulty]}
        </p>
        <h1 className="card__prompt">{round.prompt}</h1>

        {round.clues && (
          <ol className="clues" aria-label="Dicas">
            {round.clues.slice(0, hasAnswered ? cluesTotal : cluesShown).map((clue, i) => (
              <li className="clue" key={i}>
                <strong>Dica {i + 1}:</strong> {clue}
              </li>
            ))}
          </ol>
        )}

        <ul className="options">
          {round.options.map((option, i) => {
            let state = "";
            if (hasAnswered) {
              if (i === round.answer) state = " is-correct";
              else if (i === picked) state = " is-wrong";
              else state = " is-dim";
            }
            return (
              <li key={option}>
                <button
                  type="button"
                  className={`option${state}`}
                  disabled={hasAnswered}
                  onClick={() => answer(i)}
                >
                  <span className="option__key" aria-hidden="true">
                    {KEYS[i]}
                  </span>
                  <span>{option}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {hasAnswered && last && (
          <div className={`feedback ${last.correct ? "is-right" : "is-miss"}`} role="status" aria-live="polite">
            <strong>
              {last.correct
                ? `Isso aí! +${toBerries(last.points)}`
                : picked === null
                  ? "Tempo esgotado!"
                  : "Não foi dessa vez."}
            </strong>
            {!last.correct && <span>Resposta certa: {round.options[round.answer]}. </span>}
            {round.explanation && <span>{round.explanation}</span>}
          </div>
        )}
      </article>

      <div className="dock">
        {!hasAnswered && cluesTotal > 0 && cluesShown < cluesTotal && (
          <button type="button" className="btn-ghost" onClick={() => setCluesShown((c) => c + 1)}>
            💡 Mais uma dica
          </button>
        )}
        {hasAnswered && (
          <button type="button" className="btn" onClick={next} autoFocus>
            {nextLabel}
          </button>
        )}
      </div>
    </Shell>
  );
}
