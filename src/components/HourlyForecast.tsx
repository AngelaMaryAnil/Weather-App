import React from 'react';
import { format } from 'date-fns';
import { useWeather } from '../contexts/WeatherContext';
import { getWeatherIconUrl } from '../services/weatherService';

const HourlyForecast: React.FC = () => {
  const { forecast, temperatureUnit, isLoading } = useWeather();

  if (isLoading || !forecast) return null;

  // Get the next 12 hours from the forecast (3-hour intervals in the API, so 4 items)
  const hourlyData = forecast.list.slice(0, 4);
  const tempSymbol = temperatureUnit === 'metric' ? '°C' : '°F';

  return (
    <div className="rounded-xl shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20 p-6 transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        12-Hour Forecast
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {hourlyData.map((item) => {
          const weather = item.weather[0];
          const dateTime = new Date(item.dt * 1000);
          
          return (
            <div 
              key={item.dt}
              className="flex flex-col items-center p-3 rounded-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {format(dateTime, 'h a')}
              </p>
              
              <img 
                src={getWeatherIconUrl(weather.icon, '2x')} 
                alt={weather.description}
                className="w-12 h-12 my-1"
              />
              
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {Math.round(item.main.temp)}{tempSymbol}
              </p>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {weather.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;