import { NextResponse } from 'next/server';

export const revalidate = 3600;

/** Cotação JPY→BRL via frankfurter.app (grátis, sem chave) */
export async function GET() {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=JPY&to=BRL',
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      rates?: { BRL?: number };
      date?: string;
    };
    const rate = data.rates?.BRL;
    if (!rate) throw new Error('no rate');
    return NextResponse.json(
      { rate, date: data.date ?? new Date().toISOString().slice(0, 10) },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ error: 'rate unavailable' }, { status: 502 });
  }
}
