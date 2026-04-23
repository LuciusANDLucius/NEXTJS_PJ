'use client'

import React, { useEffect, useState } from 'react';

const CACHE_KEY = 'exchange_rate_usd_vnd';
const TTL = 5 * 60 * 1000; // 5 minutes

export default function ExchangeRate({ base = 'USD', target = 'VND' }) {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // check cache
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed?.ts && Date.now() - parsed.ts < TTL && parsed?.rate) {
              setRate(parsed.rate);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore
          }
        }

        const res = await fetch(`/api/exchange?base=${encodeURIComponent(base)}&target=${encodeURIComponent(target)}`);
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Không lấy được tỉ giá');
        }
        const r = Number(data.rate);
        if (isNaN(r)) throw new Error('Rate invalid');
        setRate(r);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: r, ts: Date.now(), raw: data })); } catch (e) {}
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [base, target]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }} className="exchange-rate">
      {loading ? (
        <span style={{ fontSize: 12, color: '#94a3b8' }}>...</span>
      ) : error ? (
        <span style={{ fontSize: 12, color: '#ef4444' }}>err</span>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 5H9.5a3.5 3.5 0 000 7H14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 19h7.5a3.5 3.5 0 000-7H10" />
          </svg>
          <span style={{ fontWeight: 600 }}>1 {base} = {Number(rate).toLocaleString('vi-VN')} {target}</span>
        </>
      )}
    </div>
  );
}
