"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getMode, type ModeSlug } from "@/data/modes";
import type { SagaSlug } from "@/data/sagas";
import { DIFFICULTY_LABEL } from "@/data/types";
import { SAGA_CREW, getCrewRole, getRank, toBerries } from "@/lib/ranks";
import type { DifficultyFilter } from "@/lib/rounds";
import { longestStreak, type Outcome } from "@/lib/scoring";
import Toasts from "./Toasts";
import { loadProfile, markSent, recordGame, setNick, type GameReport } from "@/lib/progress";
import { getBest, saveBest } from "@/lib/storage";

type Props = {
  modeSlug: ModeSlug;
  saga: SagaSlug;
  difficulty: DifficultyFilter;
  daily?: string; // data do desafio diário (AAAA-MM-DD)
  total: number;
  outcomes: Outcome[];
  onRestart: () => void;
};

export default function Result({ modeSlug, saga, difficulty, daily, total, outcomes, onRestart }: Props) {
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
  const [report, setReport] = useState<GameReport | null>(null);
  const [nick, setNickText] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendMsg, setSendMsg] = useState("");

  useEffect(() => {
    if (isDuel || saved.current) return;
    saved.current = true;
    const key = `${modeSlug}:${saga}${difficulty === "todas" ? "" : `:${difficulty}`}`;
    const previous = getBest(key);
    const isNew = saveBest(key, score);
    setRecord({ best: Math.max(previous, score), isNew });
    setReport(recordGame({ outcomes, total, saga, daily }));
    const p = loadProfile();
    setNickText(p.nick);
    if (daily && p.daily.sent[daily]) setSendState("sent");
  }, [isDuel, modeSlug, saga, difficulty, score, outcomes, total, daily]);

  async function sendToRanking() {
    if (!daily || !report) return;
    setSendState("sending");
    try {
      const res = await fetch("/api/ranking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device: loadProfile().device, nick, score: report.score, date: daily }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Não foi possível enviar.");
      setNick(nick.trim());
      markSent(daily);
      setSendState("sent");
      setSendMsg("Pontuação enviada!");
    } catch (e) {
      setSendState("error");
      setSendMsg(e instanceof Error ? e.message : "Não foi possível enviar.");
    }
  }

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

  const rewards = report && (
    <>
      <p className="record">
        {report.practice
          ? "Treino: o desafio de hoje já valeu, então esta tentativa não paga berries."
          : `💰 +${toBerries(report.earned + report.bonus)} na carteira${report.bonus ? ` (bônus diário ${toBerries(report.bonus)})` : ""}`}
        {daily && !report.practice && report.streak > 1 ? ` · 🔥 ${report.streak} dias seguidos` : ""}
      </p>
      <Toasts items={report.unlocked} />
    </>
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

      {rewards}

      {daily && report && !report.practice && (
        <form
          className="send"
          onSubmit={(e) => {
            e.preventDefault();
            void sendToRanking();
          }}
        >
          <label htmlFor="nick">Entrar no ranking de hoje</label>
          <div className="send__row">
            <input
              id="nick"
              value={nick}
              maxLength={16}
              minLength={2}
              placeholder="Seu apelido"
              disabled={sendState === "sent" || sendState === "sending"}
              onChange={(e) => setNickText(e.target.value)}
              autoComplete="nickname"
            />
            <button type="submit" className="btn" disabled={sendState === "sent" || sendState === "sending" || nick.trim().length < 2}>
              {sendState === "sent" ? "Enviado ✓" : sendState === "sending" ? "Enviando…" : "Enviar"}
            </button>
          </div>
          {sendMsg && <small role="status">{sendMsg}</small>}
          {sendState === "sent" && (
            <Link className="send__link" href="/ranking">
              Ver o ranking →
            </Link>
          )}
        </form>
      )}

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
