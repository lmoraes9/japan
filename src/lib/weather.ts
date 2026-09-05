'use client';

import { useEffect, useState } from 'react';
import type { StageId } from '@/data/types';
import { STAGE_COORDS } from './sun';

/** previsão de um dia (Open-Meteo, sem chave) */
export interface DayForecast {
  date: string;
  code: number;
  tMax: number;
  tMin: number;
  /** probabilidade máxima de chuva no dia, % */
  rain: number;
}

interface Cache {
  fetchedAt: number;
  days: DayForecast[];
}

const KEY = (stage: StageId) => `japao2026:tempo:${stage}`;
const TTL = 3 * 60 * 60 * 1000;

/** código WMO → emoji + texto curto */
export function describe(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'céu limpo' };
  if (code <= 2) return { icon: '🌤️', label: 'sol entre nuvens' };
  if (code === 3) return { icon: '☁️', label: 'nublado' };
  if (code <= 48) return { icon: '🌫️', label: 'neblina' };
  if (code <= 57) return { icon: '🌦️', label: 'garoa' };
  if (code <= 67) return { icon: '🌧️', label: 'chuva' };
  if (code <= 77) return { icon: '🌨️', label: 'neve' };
  if (code <= 82) return { icon: '🌧️', label: 'pancadas' };
  if (code <= 86) return { icon: '🌨️', label: 'neve' };
  return { icon: '⛈️', label: 'tempestade' };
}

function readCache(stage: StageId): Cache | null {
  try {
    const raw = localStorage.getItem(KEY(stage));
    return raw ? (JSON.parse(raw) as Cache) : null;
  } catch {
    return null;
  }
}

async function fetchForecast(stage: StageId): Promise<DayForecast[]> {
  const c = STAGE_COORDS[stage];
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=Asia%2FTokyo&forecast_days=16`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`open-meteo ${res.status}`);
  const j = (await res.json()) as {
    daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: (number | null)[] };
  };
  return j.daily.time.map((date, i) => ({
    date,
    code: j.daily.weather_code[i],
    tMax: Math.round(j.daily.temperature_2m_max[i]),
    tMin: Math.round(j.daily.temperature_2m_min[i]),
    rain: j.daily.precipitation_probability_max[i] ?? 0,
  }));
}

/**
 * Previsão para a cidade da etapa. Usa cache local (3 h) e só busca com
 * internet; sem cache e sem internet devolve vazio. A Open-Meteo prevê 16
 * dias, então durante a viagem o dia seguinte sempre está coberto.
 */
export function useForecast(stage: StageId | undefined): { days: DayForecast[]; fetchedAt: number | null } {
  const [data, setData] = useState<Cache | null>(null);

  useEffect(() => {
    if (!stage) return;
    const cached = readCache(stage);
    if (cached) setData(cached);
    const stale = !cached || Date.now() - cached.fetchedAt > TTL;
    if (!stale || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
    let alive = true;
    fetchForecast(stage)
      .then((days) => {
        const next = { fetchedAt: Date.now(), days };
        try {
          localStorage.setItem(KEY(stage), JSON.stringify(next));
        } catch {}
        if (alive) setData(next);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [stage]);

  return { days: data?.days ?? [], fetchedAt: data?.fetchedAt ?? null };
}

export const forecastFor = (days: DayForecast[], date: string) => days.find((d) => d.date === date);
