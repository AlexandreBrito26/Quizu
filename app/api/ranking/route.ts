import { NextResponse } from "next/server";
import { dailyKey } from "@/lib/seed";

// Ranking online guardado no Upstash Redis (integração gratuita da Vercel).
// Sem as variáveis de ambiente, a API responde "indisponível" e o jogo segue normal.
export const dynamic = "force-dynamic";

const MAX_DAILY_SCORE = 450; // 10 rodadas × (25 base + 5 velocidade + 10 sequência) + folga

async function redis(command: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("sem-banco");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("falha-banco");
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error("falha-banco");
  return json.result;
}

function cleanNick(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/[^\p{L}\p{N} _-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 16);
}

async function top(key: string) {
  const flat = (await redis(["ZRANGE", key, 0, 19, "REV", "WITHSCORES"])) as string[];
  const devices: string[] = [];
  const scores: number[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    devices.push(flat[i]);
    scores.push(Number(flat[i + 1]));
  }
  if (devices.length === 0) return [];
  const names = (await redis(["HMGET", "quizu:nicks", ...devices])) as (string | null)[];
  return devices.map((_, i) => ({ nick: names[i] ?? "Pirata", score: scores[i] }));
}

export async function GET(request: Request) {
  const scope = new URL(request.url).searchParams.get("scope") === "geral" ? "geral" : "dia";
  const date = dailyKey();
  try {
    const entries = await top(scope === "geral" ? "quizu:geral" : `quizu:dia:${date}`);
    return NextResponse.json({ available: true, scope, date, entries });
  } catch {
    return NextResponse.json({ available: false, scope, date, entries: [] });
  }
}

export async function POST(request: Request) {
  let body: { device?: unknown; nick?: unknown; score?: unknown; date?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Pedido inválido." }, { status: 400 });
  }
  const device = typeof body.device === "string" && /^[a-z0-9-]{8,64}$/i.test(body.device) ? body.device : "";
  const nick = cleanNick(body.nick);
  const score = Number(body.score);
  if (!device || nick.length < 2 || !Number.isInteger(score) || score < 0 || score > MAX_DAILY_SCORE) {
    return NextResponse.json({ ok: false, error: "Apelido (2 a 16 letras) ou pontuação inválidos." }, { status: 400 });
  }
  // Só vale o desafio de hoje, para ninguém enviar pontuação de outro dia.
  const date = dailyKey();
  if (body.date !== date) return NextResponse.json({ ok: false, error: "Esse desafio já acabou." }, { status: 400 });

  try {
    await redis(["HSET", "quizu:nicks", device, nick]);
    // NX: só a primeira pontuação do dia conta. Se entrou, soma no ranking geral.
    const added = Number(await redis(["ZADD", `quizu:dia:${date}`, "NX", score, device]));
    if (added === 1) await redis(["ZINCRBY", "quizu:geral", score, device]);
    return NextResponse.json({ ok: true, counted: added === 1 });
  } catch {
    return NextResponse.json({ ok: false, error: "Ranking indisponível no momento." }, { status: 503 });
  }
}
