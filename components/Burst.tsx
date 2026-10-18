"use client";

import { useEffect, useRef } from "react";

type Props = { id: number; kind: "win" | "miss"; power: number };

// Explosão de partículas (moedas e confete) em canvas; roda ~1s e some.
export default function Burst({ id, kind, power }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || id === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const accent = getComputedStyle(canvas).getPropertyValue("--c-accent").trim() || "#e0a526";
    const colors = kind === "win" ? ["#ffd23f", accent, "#ffffff", "#2e8b57", "#ff7b54"] : ["#7a7a7a", "#4a4a4a", "#c1121f"];
    const count = kind === "win" ? 26 + power * 8 : 12;
    const originY = h * 0.45;
    const parts = Array.from({ length: count }, () => {
      const a = kind === "win" ? -Math.PI / 2 + (Math.random() - 0.5) * 2.4 : Math.random() * Math.PI * 2;
      const v = (kind === "win" ? 5 + Math.random() * 7 : 1.5 + Math.random() * 3);
      return {
        x: w / 2, y: originY, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        r: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        c: colors[Math.floor(Math.random() * colors.length)], coin: kind === "win" && Math.random() < 0.3,
      };
    });

    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const age = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.vy += kind === "win" ? 0.28 : 0.12;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - age / 1.1);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        if (p.coin) { ctx.beginPath(); ctx.arc(0, 0, p.r + 1, 0, 7); ctx.fill(); ctx.fillStyle = "#a87412"; ctx.fillRect(-1, -p.r / 2, 2, p.r); }
        else ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      }
      if (age < 1.1) raf = requestAnimationFrame(step);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [id, kind, power]);

  return <canvas ref={ref} className="burst" aria-hidden="true" />;
}
