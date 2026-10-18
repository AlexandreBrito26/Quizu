"use client";

import { useEffect, useState } from "react";
import Hub from "./Hub";
import { loadProfile } from "@/lib/progress";

type Entry = { nick: string; score: number };

export default function RankingView() {
  const [scope, setScope] = useState<"dia" | "geral">("dia");
  const [state, setState] = useState<{ loading: boolean; available: boolean; entries: Entry[] }>({ loading: true, available: true, entries: [] });
  const [nick, setNick] = useState("");

  useEffect(() => setNick(loadProfile().nick), []);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    fetch(`/api/ranking?scope=${scope}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => alive && setState({ loading: false, available: !!d.available, entries: d.entries ?? [] }))
      .catch(() => alive && setState({ loading: false, available: false, entries: [] }));
    return () => {
      alive = false;
    };
  }, [scope]);

  return (
    <Hub title="Ranking" active="/ranking">
      <div className="chips" role="group" aria-label="Período">
        <button type="button" className="chip" aria-pressed={scope === "dia"} onClick={() => setScope("dia")}>
          📅 Hoje
        </button>
        <button type="button" className="chip" aria-pressed={scope === "geral"} onClick={() => setScope("geral")}>
          🌍 Geral
        </button>
      </div>
      <p className="hub__note">
        {scope === "dia" ? "Pontuação do desafio diário de hoje." : "Soma de todos os desafios diários."} Só a primeira tentativa de cada dia conta.
      </p>

      {state.loading ? (
        <p className="loading">Buscando a tripulação…</p>
      ) : !state.available ? (
        <p className="hub__msg">O ranking online está indisponível agora. Seus pontos continuam salvos no aparelho.</p>
      ) : state.entries.length === 0 ? (
        <p className="hub__msg">Ninguém no ranking ainda. Jogue o desafio diário e seja o primeiro!</p>
      ) : (
        <ol className="board">
          {state.entries.map((e, i) => (
            <li key={`${e.nick}-${i}`} className={`board__row${nick && e.nick === nick ? " is-me" : ""}`}>
              <span className="board__pos">{["🥇", "🥈", "🥉"][i] ?? i + 1}</span>
              <span className="board__nick">{e.nick}</span>
              <span className="board__score">{e.score}</span>
            </li>
          ))}
        </ol>
      )}
    </Hub>
  );
}
