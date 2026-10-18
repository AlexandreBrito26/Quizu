"use client";

import { useEffect, useState } from "react";
import Hub from "./Hub";
import { ACHIEVEMENTS } from "@/data/achievements";
import { loadProfile, type Profile } from "@/lib/progress";
import { toBerries } from "@/lib/ranks";

export default function AchievementsView() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => setP(loadProfile()), []);
  const done = p ? ACHIEVEMENTS.filter((a) => p.ach[a.id]).length : 0;

  return (
    <Hub title="Conquistas" active="/conquistas">
      <p className="hub__note">
        {done} de {ACHIEVEMENTS.length} desbloqueadas. Cada uma paga uma recompensa em berries.
      </p>
      <ul className="achs">
        {ACHIEVEMENTS.map((a) => {
          const on = !!p?.ach[a.id];
          return (
            <li key={a.id} className={`ach${on ? " is-on" : ""}`}>
              <span className="ach__emoji" aria-hidden="true">{on ? a.emoji : "🔒"}</span>
              <span>
                <strong>{a.name}</strong>
                <small>{a.desc}</small>
                <small className="ach__reward">{on ? "Desbloqueada" : `Recompensa: ${toBerries(a.reward)}`}</small>
              </span>
            </li>
          );
        })}
      </ul>
    </Hub>
  );
}
