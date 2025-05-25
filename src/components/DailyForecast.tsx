import React from 'react';
import { format } from 'date-fns';
import { useWeather } from '../contexts/WeatherContext';
import { getWeatherIconUrl } from '../services/weatherService';
import { Droplets, Wind } from 'lucide-react';

const DailyForecast: React.FC = () => {
  const { forecast, temperatureUnit, isLoading } = useWeather();

  if (isLoading || !forecast) return null;

  // Group forecast data by day (OpenWeather provides 3-hour interval forecasts)
  const groupedForecasts = forecast.list.reduce<Record<string, typeof forecast.list[0][]>>((acc, item) => {
    const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get daily forecasts (using noon forecast as representative)
  const dailyForecasts = Object.entries(groupedForecasts).map(([date, items]) => {
    // Find the forecast closest to noon for each day
    const noonForecast = items.reduce((closest, item) => {
      const itemHour = new Date(item.dt * 1000).getHours();
      const closestHour = new Date(closest.dt * 1000).getHours();
      return Math.abs(itemHour - 12) < Math.abs(closestHour - 12) ? item : closest;
    }, items[0]);
    
    return {
      date,
      forecast: noonForecast
    };
  }).slice(0, 5); // Limit to 5 days

  const tempSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
  const windUnit = temperatureUnit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="rounded-xl shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20 p-6 transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        5-Day Forecast
      </h3>
      
      <div className="space-y-4">
        {dailyForecasts.map(({ date, forecast }) => {
          const weather = forecast.weather[0];
          const dateObj = new Date(date);
          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
          
          return (
            <div 
              key={date}
              className={`grid grid-cols-3 md:grid-cols-5 gap-2 p-3 rounded-lg backdrop-blur-sm ${
                isToday 
                  ? 'bg-blue-100/40 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30' 
                  : 'bg-white/20 dark:bg-gray-700/20'
              } hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors`}
            >
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {isToday ? 'Today' : format(dateObj, 'EEE')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {format(dateObj, 'MMM d')}
                </p>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={getWeatherIconUrl(weather.icon, '2x')} 
                  alt={weather.description}
                  className="w-10 h-10 mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {weather.description}
                </span>
              </div>
              
              <div className="flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {Math.round(forecast.main.temp)}{tempSymbol}
                </span>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {forecast.main.humidity}%
                </span>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <Wind className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {Math.round(forecast.wind.speed)} {windUnit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;