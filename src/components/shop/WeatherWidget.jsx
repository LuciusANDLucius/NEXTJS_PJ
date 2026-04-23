'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherData } from '@/services/OtherAPI/OpenWeatherService';

const PROVINCES = [
  // Miền Bắc
  { name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
  { name: "Hải Phòng", lat: 20.8449, lon: 106.6881 },
  { name: "Quảng Ninh", lat: 21.0063, lon: 107.2925 },
  { name: "Bắc Giang", lat: 21.2819, lon: 106.1975 },
  { name: "Bắc Kạn", lat: 22.1477, lon: 105.8348 },
  { name: "Bắc Ninh", lat: 21.1861, lon: 106.0763 },
  { name: "Cao Bằng", lat: 22.6657, lon: 106.2638 },
  { name: "Điện Biên", lat: 21.3860, lon: 103.0230 },
  { name: "Hà Giang", lat: 22.8026, lon: 104.9784 },
  { name: "Hà Nam", lat: 20.5835, lon: 105.9230 },
  { name: "Hải Dương", lat: 20.9373, lon: 106.3147 },
  { name: "Hòa Bình", lat: 20.6881, lon: 105.3133 },
  { name: "Hưng Yên", lat: 20.6464, lon: 106.0511 },
  { name: "Lai Châu", lat: 22.3862, lon: 103.4586 },
  { name: "Lạng Sơn", lat: 21.8537, lon: 106.7615 },
  { name: "Lào Cai", lat: 22.4800, lon: 103.9750 },
  { name: "Nam Định", lat: 20.4388, lon: 106.1621 },
  { name: "Ninh Bình", lat: 20.2539, lon: 105.9745 },
  { name: "Phú Thọ", lat: 21.3989, lon: 105.2281 },
  { name: "Sơn La", lat: 21.3256, lon: 103.9188 },
  { name: "Thái Bình", lat: 20.4464, lon: 106.3365 },
  { name: "Thái Nguyên", lat: 21.5942, lon: 105.8480 },
  { name: "Tuyên Quang", lat: 21.8234, lon: 105.2180 },
  { name: "Vĩnh Phúc", lat: 21.3609, lon: 105.5474 },
  { name: "Yên Bái", lat: 21.7228, lon: 104.9113 },

  // Miền Trung
  { name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
  { name: "Bình Định", lat: 13.7757, lon: 109.2235 },
  { name: "Đắk Lắk", lat: 12.7100, lon: 108.2378 },
  { name: "Đắk Nông", lat: 12.0046, lon: 107.6876 },
  { name: "Gia Lai", lat: 13.9830, lon: 108.0000 },
  { name: "Hà Tĩnh", lat: 18.3560, lon: 105.8877 },
  { name: "Khánh Hòa", lat: 12.2388, lon: 109.1967 },
  { name: "Kon Tum", lat: 14.3497, lon: 108.0005 },
  { name: "Lâm Đồng", lat: 11.5753, lon: 108.1429 },
  { name: "Nghệ An", lat: 19.2342, lon: 104.9200 },
  { name: "Ninh Thuận", lat: 11.5645, lon: 108.9885 },
  { name: "Phú Yên", lat: 13.0882, lon: 109.0929 },
  { name: "Quảng Bình", lat: 17.4689, lon: 106.5998 },
  { name: "Quảng Nam", lat: 15.5394, lon: 108.0191 },
  { name: "Quảng Ngãi", lat: 15.1214, lon: 108.8044 },
  { name: "Quảng Trị", lat: 16.7403, lon: 107.1854 },
  { name: "Thanh Hóa", lat: 19.8078, lon: 105.7759 },
  { name: "Thừa Thiên Huế", lat: 16.4637, lon: 107.5909 },
  { name: "Bình Thuận", lat: 11.0904, lon: 108.0721 },

  // Miền Nam
  { name: "TP. Hồ Chí Minh", lat: 10.8231, lon: 106.6297 },
  { name: "An Giang", lat: 10.3860, lon: 105.4350 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.5417, lon: 107.2429 },
  { name: "Bạc Liêu", lat: 9.2940, lon: 105.7216 },
  { name: "Bến Tre", lat: 10.2433, lon: 106.3753 },
  { name: "Bình Dương", lat: 11.3254, lon: 106.4770 },
  { name: "Bình Phước", lat: 11.7512, lon: 106.7235 },
  { name: "Cà Mau", lat: 9.1527, lon: 105.1960 },
  { name: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
  { name: "Đồng Nai", lat: 10.9455, lon: 106.8345 },
  { name: "Đồng Tháp", lat: 10.4938, lon: 105.6882 },
  { name: "Hậu Giang", lat: 9.7579, lon: 105.6413 },
  { name: "Kiên Giang", lat: 10.0125, lon: 105.0809 },
  { name: "Long An", lat: 10.6956, lon: 106.2431 },
  { name: "Sóc Trăng", lat: 9.6025, lon: 105.9739 },
  { name: "Tây Ninh", lat: 11.3351, lon: 106.0985 },
  { name: "Tiền Giang", lat: 10.3599, lon: 106.3600 },
  { name: "Trà Vinh", lat: 9.9477, lon: 106.3419 },
  { name: "Vĩnh Long", lat: 10.2395, lon: 105.9571 },
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
    <div suppressHydrationWarning style={{ 
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