import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, Bookmark } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';
import { useDebounce } from '../hooks/useDebounce';

const Search: React.FC = () => {
  const { city, setCity, searchCity, savedCities, addSavedCity, currentWeather } = useWeather();
  const [searchTerm, setSearchTerm] = useState(city);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Update search input when city changes from elsewhere
  useEffect(() => {
    if (city !== searchTerm) {
      setSearchTerm(city);
    }
  }, [city]);

  // Perform search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm !== city) {
      searchCity(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchCity(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCity('');
  };

  const saveCurrentCity = useCallback(() => {
    if (currentWeather) {
      addSavedCity({
        id: currentWeather.id,
        name: currentWeather.name,
        country: currentWeather.sys.country
      });
    }
  }, [currentWeather, addSavedCity]);

  const canSaveCity = currentWeather && savedCities.length < 5 && !savedCities.some(city => city.id === currentWeather.id);

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a city..."
          className="w-full py-2 pl-10 pr-10 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          </button>
        )}
      </div>

      {canSaveCity && (
        <button
          type="button"
          onClick={saveCurrentCity}
          className="ml-2 p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors"
          title="Save this city"
        >
          <Bookmark className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
        </button>
      )}
    </form>
  );
};

export default Search;