import React from 'react';
import { Sun, CloudSun, Moon, Thermometer, MapPin } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';
import Search from './Search';

const Header: React.FC = () => {
  const { 
    temperatureUnit, 
    toggleTemperatureUnit, 
    themeMode, 
    toggleThemeMode,
    getLocationWeather
  } = useWeather();

  return (
    <header className="relative z-10 py-4 px-4 md:px-6 transition-all duration-300 backdrop-blur-md bg-white/20 dark:bg-gray-900/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <CloudSun className="h-10 w-10 text-yellow-500 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              AetherCast
            </h1>
          </div>
          
          <div className="w-full md:w-96">
            <Search />
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={getLocationWeather}
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
              aria-label="Get current location weather"
              title="Get current location weather"
            >
              <MapPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <button 
              onClick={toggleTemperatureUnit}
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
              aria-label={`Switch to ${temperatureUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
              title={`Switch to ${temperatureUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
            >
              <Thermometer className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {temperatureUnit === 'metric' ? '°C' : '°F'}
              </span>
            </button>
            
            <button 
              onClick={toggleThemeMode}
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
              aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
            >
              {themeMode === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;