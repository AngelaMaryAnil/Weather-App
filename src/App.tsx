import React from 'react';
import { WeatherProvider } from './contexts/WeatherContext';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import AirQualityWidget from './components/AirQualityWidget';
import SavedCities from './components/SavedCities';
import WeatherMap from './components/WeatherMap';

function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 dark:from-blue-900 dark:to-indigo-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
        <Header />
        
        <main className="container mx-auto px-4 py-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <CurrentWeather />
              <HourlyForecast />
              <DailyForecast />
            </div>
            
            <div className="space-y-6">
              <SavedCities />
              <AirQualityWidget />
              <WeatherMap />
            </div>
          </div>
        </main>
        
        <footer className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>AetherCast &copy; {new Date().getFullYear()} - Built with React</p>
        </footer>
      </div>
    </WeatherProvider>
  );
}

export default App;