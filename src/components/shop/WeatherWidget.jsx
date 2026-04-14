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
    <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg w-full max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <select 
          className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
          value={selectedProvince.name}
          onChange={(e) => setSelectedProvince(PROVINCES.find(p => p.name === e.target.value))}
        >
          {PROVINCES.map(p => (
            <option key={p.name} value={p.name} className="text-black">{p.name}</option>
          ))}
        </select>
        <span className="text-xs opacity-80">Hiện tại</span>
      </div>

      {loading ? (
        <div className="text-center py-4 text-sm animate-pulse">Đang cập nhật...</div>
      ) : weather ? (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-extrabold">{Math.round(weather.temp)}°C</div>
            <p className="text-sm capitalize mt-1 opacity-90">{weather.description}</p>
          </div>
          <div className="text-right text-xs">
            <p>Ẩm: {weather.humidity}%</p>
            <p>Gió: {weather.wind_speed} m/s</p>
          </div>
        </div>
      ) : (
        <div className="text-xs text-red-200">Không thể kết nối API</div>
      )}
    </div>
  );
}