"use client";

import { useEffect, useRef } from "react";

type Props = { theme: string };

type Look = { sail: string; hull: string; flag: string };

// Navio genérico (caravela pirata de desenho próprio); só a vela muda por saga.
const LOOKS: Record<string, Look> = {
  todas: { sail: "#f6ecd2", hull: "#6b3f1d", flag: "#111" },
  "east-blue": { sail: "#ffffff", hull: "#8a4b1f", flag: "#111" },
  arabasta: { sail: "#fff0cf", hull: "#6e3a17", flag: "#111" },
  skypiea: { sail: "#ffffff", hull: "#9b6a2c", flag: "#f2b705" },
  "water-7": { sail: "#f7ead7", hull: "#5a3417", flag: "#111" },
  "enies-lobby": { sail: "#d9d4c8", hull: "#2b1a12", flag: "#c1121f" },
};

function wave(ctx: CanvasRenderingContext2D, w: number, base: number, amp: number, len: number, speed: number, t: number, color: string, bottom: number) {
  ctx.beginPath();
  ctx.moveTo(0, bottom);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, base + Math.sin((x / len) + t * speed) * amp);
  ctx.lineTo(w, bottom);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, a: number) {
  ctx.fillStyle = `rgba(255,255,255,${a})`;
  ctx.beginPath();
  ctx.arc(x, y, 14 * s, 0, 7);
  ctx.arc(x + 16 * s, y - 8 * s, 18 * s, 0, 7);
  ctx.arc(x + 34 * s, y, 14 * s, 0, 7);
  ctx.rect(x, y, 34 * s, 14 * s);
  ctx.fill();
}

function scenery(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, theme: string) {
  const horizon = h * 0.55;
  switch (theme) {
    case "east-blue": {
      ctx.fillStyle = "rgba(255,240,200,.9)";
      ctx.beginPath(); ctx.arc(w * 0.82, horizon - 40, 26, 0, 7); ctx.fill();
      for (let i = 0; i < 3; i++) cloud(ctx, ((t * 6 + i * w * 0.4) % (w + 120)) - 60, 30 + i * 22, 0.9, 0.55);
      // gaivotas
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.6;
      for (let i = 0; i < 3; i++) {
        const gx = ((t * 18 + i * 90) % (w + 60)) - 30, gy = 50 + i * 16 + Math.sin(t * 3 + i) * 3;
        ctx.beginPath(); ctx.moveTo(gx - 6, gy); ctx.quadraticCurveTo(gx - 3, gy - 5, gx, gy); ctx.quadraticCurveTo(gx + 3, gy - 5, gx + 6, gy); ctx.stroke();
      }
      break;
    }
    case "arabasta": {
      ctx.fillStyle = "rgba(255,210,120,.95)";
      ctx.beginPath(); ctx.arc(w * 0.2, horizon - 18, 38, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(122,58,20,.75)";
      ctx.beginPath(); ctx.moveTo(0, horizon + 4);
      for (let x = 0; x <= w; x += 8) ctx.lineTo(x, horizon - 18 - Math.sin(x / 70) * 12 - Math.sin(x / 23) * 3);
      ctx.lineTo(w, horizon + 4); ctx.fill();
      // pirâmide
      ctx.fillStyle = "rgba(96,44,14,.85)";
      ctx.beginPath(); ctx.moveTo(w * 0.7, horizon - 4); ctx.lineTo(w * 0.7 + 34, horizon - 44); ctx.lineTo(w * 0.7 + 68, horizon - 4); ctx.fill();
      break;
    }
    case "skypiea": {
      for (let i = 0; i < 5; i++) cloud(ctx, ((t * (5 + i) + i * w * 0.28) % (w + 140)) - 70, 18 + (i % 3) * 30, 1 + (i % 2) * 0.5, 0.8);
      // sino dourado ao longe
      ctx.fillStyle = "#f2b705";
      ctx.beginPath(); ctx.arc(w * 0.78, horizon - 28, 14, Math.PI, 0); ctx.lineTo(w * 0.78 + 17, horizon - 14); ctx.lineTo(w * 0.78 - 17, horizon - 14); ctx.fill();
      break;
    }
    case "water-7": {
      let x = 0, i = 0;
      while (x < w) {
        const bw = 28 + ((i * 17) % 22), bh = 34 + ((i * 29) % 46);
        ctx.fillStyle = "rgba(20,60,70,.55)";
        ctx.fillRect(x, horizon - bh, bw, bh + 6);
        ctx.fillStyle = "rgba(255,214,120,.8)";
        for (let wy = horizon - bh + 8; wy < horizon - 6; wy += 14)
          for (let wx = x + 6; wx < x + bw - 6; wx += 12) ctx.fillRect(wx, wy, 4, 5);
        x += bw + 4; i++;
      }
      break;
    }
    case "enies-lobby": {
      const gx = w * 0.5;
      const pulse = 0.5 + Math.sin(t * 1.6) * 0.15;
      const g = ctx.createRadialGradient(gx, horizon - 50, 10, gx, horizon - 50, 130);
      g.addColorStop(0, `rgba(193,18,31,${0.5 * pulse})`); g.addColorStop(1, "rgba(193,18,31,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(10,2,4,.95)";
      ctx.fillRect(gx - 78, horizon - 56, 52, 62);
      ctx.fillRect(gx + 26, horizon - 56, 52, 62);
      ctx.fillRect(gx - 26, horizon - 70, 52, 12);
      ctx.fillRect(gx - 14, horizon - 98, 28, 28);
      ctx.fillStyle = `rgba(255,70,60,${0.6 * pulse + 0.2})`;
      ctx.fillRect(gx - 8, horizon - 90, 16, 6);
      break;
    }
    default: {
      ctx.fillStyle = "rgba(255,255,255,.8)";
      for (let i = 0; i < 18; i++) {
        const sx = (i * 97) % w, sy = (i * 41) % (horizon - 20);
        ctx.globalAlpha = 0.4 + 0.4 * Math.abs(Math.sin(t + i));
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,240,200,.95)";
      ctx.beginPath(); ctx.arc(w * 0.84, 40, 16, 0, 7); ctx.fill();
    }
  }
}

function ship(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, look: Look, t: number) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 1.8) * 2.5);
  ctx.rotate(Math.sin(t * 1.8 + 1) * 0.04);
  ctx.scale(s, s);
  // casco
  ctx.fillStyle = look.hull;
  ctx.beginPath(); ctx.moveTo(-34, -10); ctx.lineTo(36, -10); ctx.lineTo(26, 8); ctx.lineTo(-24, 8); ctx.closePath(); ctx.fill();
  ctx.fillRect(-38, -16, 8, 8); // popa
  // mastro
  ctx.fillStyle = "#3b2412"; ctx.fillRect(-2, -62, 4, 54);
  // velas (inflam com o vento)
  const puff = 4 + Math.sin(t * 2) * 1.5;
  ctx.fillStyle = look.sail;
  ctx.beginPath(); ctx.moveTo(4, -58); ctx.quadraticCurveTo(4 + 26 + puff, -36, 4, -14); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-4, -50); ctx.quadraticCurveTo(-4 - 14 - puff / 2, -34, -4, -18); ctx.closePath(); ctx.fill();
  // bandeira
  ctx.fillStyle = look.flag;
  const fl = Math.sin(t * 5) * 2;
  ctx.beginPath(); ctx.moveTo(0, -66); ctx.lineTo(14, -63 + fl); ctx.lineTo(0, -58); ctx.closePath(); ctx.fill();
  ctx.restore();
}

export default function SeaScene({ theme }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const look = LOOKS[theme] ?? LOOKS.todas;
    let w = 0, h = 0, raf = 0, start = performance.now(), waveA = "", waveB = "";

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      waveA = cs.getPropertyValue("--c-wave").trim() || "rgba(31,111,139,.55)";
      waveB = cs.getPropertyValue("--c-wave-2").trim() || "rgba(11,37,69,.85)";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = still ? 2 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      scenery(ctx, w, h, t, theme);
      wave(ctx, w, h * 0.62, 5, 38, 1.1, t, waveA, h);
      const sx = still ? w * 0.35 : ((t * 22 + w * 0.3) % (w + 160)) - 80;
      ship(ctx, sx, h * 0.62, w < 480 ? 0.8 : 1, look, t);
      wave(ctx, w, h * 0.74, 7, 52, -1.4, t, waveB, h);
    };

    const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(loop);
    };

    readColors(); resize(); draw(performance.now());
    if (!still) raf = requestAnimationFrame(loop);
    const onResize = () => { resize(); draw(performance.now()); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    // As cores de tema mudam com a transição do [data-theme]; relê logo depois.
    const tid = window.setTimeout(readColors, 450);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(tid);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [theme]);

  return <canvas ref={ref} className="sea-scene" aria-hidden="true" />;
}
