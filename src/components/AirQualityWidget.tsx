import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { getAirQualityLabel, getAirQualityColor } from '../services/weatherService';

const AirQualityWidget: React.FC = () => {
  const { airQuality, isLoading } = useWeather();

  if (isLoading || !airQuality || !airQuality.list || !airQuality.list.length) {
    return null;
  }

  const airData = airQuality.list[0];
  const aqi = airData.main.aqi;
  const label = getAirQualityLabel(aqi);
  const colorClass = getAirQualityColor(aqi);

  // Components of air quality
  const components = [
    { name: 'PM2.5', value: airData.components.pm2_5, unit: 'μg/m³' },
    { name: 'PM10', value: airData.components.pm10, unit: 'μg/m³' },
    { name: 'O₃', value: airData.components.o3, unit: 'μg/m³' },
    { name: 'NO₂', value: airData.components.no2, unit: 'μg/m³' },
  ];

  return (
    <div className="rounded-xl shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20 p-6 transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Air Quality
      </h3>
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Air Quality Index</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {label}
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={aqi === 1 ? '#10b981' : aqi === 2 ? '#34d399' : aqi === 3 ? '#fbbf24' : aqi === 4 ? '#f97316' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${aqi * 20}, 100`}
                  className="transition-all duration-1000 ease-in-out"
                />
                <text x="18" y="20.5" textAnchor="middle" fontSize="10" fill="currentColor" className="font-bold">
                  {aqi}/5
                </text>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {components.map((component) => (
            <div 
              key={component.name}
              className="p-3 rounded-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400">{component.name}</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {Math.round(component.value * 10) / 10} {component.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirQualityWidget;