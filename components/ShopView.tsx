"use client";

import { useEffect, useState } from "react";
import Hub from "./Hub";
import Toasts from "./Toasts";
import type { Achievement } from "@/data/achievements";
import { FIFTY_PRICE, SKINS } from "@/data/shop";
import { buyItem, equipSkin, loadProfile, type Profile } from "@/lib/progress";
import { play } from "@/lib/fx";
import { toBerries } from "@/lib/ranks";

export default function ShopView() {
  const [p, setP] = useState<Profile | null>(null);
  const [msg, setMsg] = useState("");
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => setP(loadProfile()), [tick]);

  function buy(id: string) {
    const r = buyItem(id);
    setMsg(r.message);
    setUnlocked(r.unlocked);
    play(r.ok ? "correct" : "wrong");
    setTick((t) => t + 1);
  }

  return (
    <Hub title="Loja do Porto" active="/loja" refreshKey={tick}>
      <p className="hub__note">Gaste os berries que você ganha jogando. Os navios aparecem no mar de todas as telas.</p>
      {msg && (
        <p className="hub__msg" role="status">
          {msg}
        </p>
      )}
      <Toasts items={unlocked} />

      <h2 className="section-title">Navios</h2>
      <ul className="shop">
        {SKINS.map((s) => {
          const owned = p?.owned.includes(s.id);
          const equipped = p?.skin === s.id;
          return (
            <li key={s.id} className="shop__item">
              <span className="shop__swatch" aria-hidden="true" style={{ background: s.look?.sail ?? "linear-gradient(135deg,#fff,#7bd)", boxShadow: `inset 0 -10px 0 ${s.look?.hull ?? "#6b3f1d"}` }}>
                {s.emoji}
              </span>
              <span className="shop__info">
                <strong>{s.name}</strong>
                <small>{s.price === 0 ? "Grátis" : toBerries(s.price)}</small>
              </span>
              {owned ? (
                <button type="button" className="btn-ghost shop__btn" disabled={equipped} onClick={() => { equipSkin(s.id); setTick((t) => t + 1); }}>
                  {equipped ? "Em uso" : "Equipar"}
                </button>
              ) : (
                <button type="button" className="btn shop__btn" disabled={!p || p.points < s.price} onClick={() => buy(s.id)}>
                  Comprar
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="section-title">Itens</h2>
      <ul className="shop">
        <li className="shop__item">
          <span className="shop__swatch" aria-hidden="true">✂️</span>
          <span className="shop__info">
            <strong>50/50 extra</strong>
            <small>
              {toBerries(FIFTY_PRICE)} · você tem {p?.fifty ?? 0}
            </small>
            <small>Use depois da cota grátis de cada jogo. Custa 40% dos pontos da rodada.</small>
          </span>
          <button type="button" className="btn shop__btn" disabled={!p || p.points < FIFTY_PRICE} onClick={() => buy("fifty")}>
            Comprar
          </button>
        </li>
      </ul>
    </Hub>
  );
}
