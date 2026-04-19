'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherData } from '@/services/OtherAPI/OpenWeatherService';

const PROVINCES = [
  { name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
  { name: "TP. Hồ Chí Minh", lat: 10.8231, lon: 106.6297 },
  { name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 }
];

export default function WeatherWidget() {
  const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWeatherLoad = async (province) => {
    setLoading(true);
    const data = await fetchWeatherData(province.lat, province.lon);
    if (data) {
      setWeather(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleWeatherLoad(selectedProvince);
  }, [selectedProvince]);

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '8px', 
      fontSize: '13px', color: 'var(--muted)', background: 'var(--bg)', 
      border: '1.5px solid var(--border)', borderRadius: '10px', padding: '4px 10px',
      height: '42px', transition: 'var(--transition)'
    }} className="weather-widget">
      <select 
        style={{ 
          border: 'none', background: 'transparent', outline: 'none', 
          fontWeight: '500', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px',
          maxWidth: '85px', textOverflow: 'ellipsis'
        }}
        value={selectedProvince.name}
        onChange={(e) => setSelectedProvince(PROVINCES.find(p => p.name === e.target.value))}
      >
        {PROVINCES.map(p => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
      
      {loading ? (
        <span style={{ fontSize: '12px' }}>...</span>
      ) : weather ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: 'var(--accent-600)' }} title={weather.description}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>{Math.round(weather.temp)}°C</span>
        </div>
      ) : (
        <span style={{ fontSize: '12px', color: 'var(--danger)' }}>Lỗi</span>
      )}
    </div>
  );
}