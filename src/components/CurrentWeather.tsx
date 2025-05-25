import React from 'react';
import { format } from 'date-fns';
import { Droplets, Wind, Sunrise, Sunset } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';
import { getWeatherIconUrl } from '../services/weatherService';
import WeatherAnimation from './WeatherAnimation';

const CurrentWeather: React.FC = () => {
  const { currentWeather, temperatureUnit, isLoading, error } = useWeather();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400">Search for a city to see the weather</p>
      </div>
    );
  }

  const weatherCondition = currentWeather.weather[0];
  const tempSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
  const windUnit = temperatureUnit === 'metric' ? 'm/s' : 'mph';
  
  // Calculate if it's day or night based on sunrise/sunset
  const now = Date.now() / 1000; // Current time in seconds
  const isDay = now > currentWeather.sys.sunrise && now < currentWeather.sys.sunset;

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20 p-6 transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
        <WeatherAnimation weatherId={weatherCondition.id} isDay={isDay} />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {currentWeather.name}
              <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-300">
                {currentWeather.sys.country}
              </span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM do, yyyy')} | 
              Updated: {format(new Date(currentWeather.dt * 1000), 'h:mm a')}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <img 
                src={getWeatherIconUrl(weatherCondition.icon)} 
                alt={weatherCondition.description}
                className="w-16 h-16"
              />
              <span className="text-4xl font-bold text-gray-800 dark:text-white">
                {Math.round(currentWeather.main.temp)}{tempSymbol}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 capitalize">
              {weatherCondition.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400">Feels Like</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {Math.round(currentWeather.main.feels_like)}{tempSymbol}
            </p>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm">
            <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Droplets className="w-4 h-4 mr-1 text-blue-500" />
              Humidity
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {currentWeather.main.humidity}%
            </p>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm">
            <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Wind className="w-4 h-4 mr-1 text-blue-500" />
              Wind
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {Math.round(currentWeather.wind.speed)} {windUnit}
            </p>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pressure</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {currentWeather.main.pressure} hPa
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sunrise className="w-5 h-5 mr-2 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sunrise</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {format(new Date(currentWeather.sys.sunrise * 1000), 'h:mm a')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Sunset className="w-5 h-5 mr-2 text-orange-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sunset</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {format(new Date(currentWeather.sys.sunset * 1000), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;