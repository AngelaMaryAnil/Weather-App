import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';

const SavedCities: React.FC = () => {
  const { savedCities, searchCity, removeSavedCity } = useWeather();

  if (!savedCities.length) {
    return null;
  }

  return (
    <div className="rounded-xl shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20 p-4 transition-all duration-300">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Saved Cities
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {savedCities.map((city) => (
          <div 
            key={city.id}
            className="flex items-center bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm"
          >
            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
            
            <button
              onClick={() => searchCity(`${city.name},${city.country}`)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {city.name}
            </button>
            
            <button
              onClick={() => removeSavedCity(city.id)}
              className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
              aria-label={`Remove ${city.name} from saved cities`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCities;