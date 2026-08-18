import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { emptySyncedState, type SyncedState } from '@/data/types';

const TRIP_RE = /^[a-z0-9-]{4,32}$/;

interface Mutation {
  path: string;
  value: { updatedAt?: number } & Record<string, unknown>;
  updatedAt: number;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function loadState(redis: Redis, trip: string): Promise<SyncedState> {
  const raw = await redis.get<SyncedState>(`trip:${trip}`);
  if (!raw) return emptySyncedState();
  return { ...emptySyncedState(), ...raw };
}

export async function GET(req: NextRequest) {
  const trip = req.nextUrl.searchParams.get('trip') ?? '';
  if (!TRIP_RE.test(trip)) {
    return NextResponse.json({ error: 'invalid trip code' }, { status: 400 });
  }
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'sync not configured' }, { status: 503 });
  }
  const state = await loadState(redis, trip);
  return NextResponse.json({ state, serverTime: Date.now() });
}

export async function POST(req: NextRequest) {
  let body: { trip?: string; mutations?: Mutation[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const trip = body.trip ?? '';
  if (!TRIP_RE.test(trip)) {
    return NextResponse.json({ error: 'invalid trip code' }, { status: 400 });
  }
  const mutations = Array.isArray(body.mutations) ? body.mutations : [];
  if (mutations.length > 500) {
    return NextResponse.json({ error: 'too many mutations' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'sync not configured' }, { status: 503 });
  }

  const state = await loadState(redis, trip);
  const sections = ['checklist', 'favorites', 'notes', 'expenses'] as const;

  for (const m of mutations) {
    if (!m?.path || typeof m.path !== 'string') continue;
    const dot = m.path.indexOf('.');
    if (dot < 0) continue;
    const section = m.path.slice(0, dot) as (typeof sections)[number];
    const key = m.path.slice(dot + 1);
    if (!sections.includes(section) || !key || key.length > 128) continue;

    const bucket = state[section] as Record<string, { updatedAt: number }>;
    const existing = bucket[key];
    const incomingAt = Number(m.value?.updatedAt ?? m.updatedAt ?? 0);
    if (!existing || incomingAt > existing.updatedAt) {
      bucket[key] = { ...(m.value as object), updatedAt: incomingAt } as {
        updatedAt: number;
      };
    }
  }

  if (mutations.length > 0) {
    await redis.set(`trip:${trip}`, state);
  }
  return NextResponse.json({ state, serverTime: Date.now() });
}
