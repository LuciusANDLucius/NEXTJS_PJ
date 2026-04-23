'use server'

import { NextResponse } from 'next/server';

// Use fawazahmed0 currency json files via jsDelivr CDN
// Example: https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/vnd.json
export async function GET(req) {
  const url = new URL(req.url);
  const base = (url.searchParams.get('base') || 'USD').toLowerCase();
  const target = (url.searchParams.get('target') || 'VND').toLowerCase();

  try {
    // Try jsDelivr-hosted JSON from fawazahmed0
    const cdnUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${encodeURIComponent(base)}/${encodeURIComponent(target)}.json`;
    const cdnRes = await fetch(cdnUrl, { cache: 'no-store' });
    if (cdnRes.ok) {
      const cdnData = await cdnRes.json();
      // expected shape: { vnd: 24000 }
      const rate = cdnData?.[target];
      if (rate != null) return NextResponse.json({ success: true, source: 'fawazahmed0-cdn', rate, raw: cdnData });
    }

    // Fallback: exchangerate.host convert
    const convUrl = `https://api.exchangerate.host/convert?from=${encodeURIComponent(base.toUpperCase())}&to=${encodeURIComponent(target.toUpperCase())}`;
    const convRes = await fetch(convUrl, { cache: 'no-store' });
    if (convRes.ok) {
      const convData = await convRes.json();
      const rate = convData?.result ?? null;
      if (rate != null) return NextResponse.json({ success: true, source: 'exchangerate.host', rate, raw: convData });
    }

    // Last resort: open.er-api.com
    const erUrl = `https://open.er-api.com/v6/latest/${encodeURIComponent(base.toUpperCase())}`;
    const erRes = await fetch(erUrl, { cache: 'no-store' });
    if (erRes.ok) {
      const erData = await erRes.json();
      const r = erData?.rates?.[target.toUpperCase()] ?? null;
      if (r != null) return NextResponse.json({ success: true, source: 'open.er-api.com', rate: r, raw: erData });
    }

    return NextResponse.json({ success: false, message: 'no rate from fallback providers' }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ success: false, message: e?.message || String(e) }, { status: 500 });
  }
}
