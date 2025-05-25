import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherData, ForecastData, AirQualityData, TemperatureUnit, ThemeMode, SavedCity } from '../types';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecast, fetchAirQuality } from '../services/weatherService';

interface WeatherContextProps {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  isLoading: boolean;
  error: string | null;
  city: string;
  setCity: (city: string) => void;
  searchCity: (city: string) => Promise<void>;
  savedCities: SavedCity[];
  addSavedCity: (city: SavedCity) => void;
  removeSavedCity: (cityId: number) => void;
  getLocationWeather: () => Promise<void>;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  currentMapPosition: [number, number];
}

const WeatherContext = createContext<WeatherContextProps | null>(null);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('');
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('metric');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [currentMapPosition, setCurrentMapPosition] = useState<[number, number]>([0, 0]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode;
    const savedCitiesData = localStorage.getItem('savedCities');

    if (savedCity) setCity(savedCity);
    if (savedUnit) setTemperatureUnit(savedUnit);
    if (savedTheme) setThemeMode(savedTheme);
    if (savedCitiesData) setSavedCities(JSON.parse(savedCitiesData));

    // If we have a saved city, fetch its weather
    if (savedCity) {
      searchCity(savedCity);
    } else {
      // Otherwise try to get location weather
      getLocationWeather();
    }
  }, []);

  // Apply theme mode to document
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  // Save temperature unit preference
  useEffect(() => {
    localStorage.setItem('temperatureUnit', temperatureUnit);
    
    // Refresh weather data when unit changes
    if (currentWeather) {
      if (city) {
        searchCity(city);
      } else if (currentWeather.coord) {
        fetchWeatherByLocation(currentWeather.coord.lat, currentWeather.coord.lon);
      }
    }
  }, [temperatureUnit]);

  // Save saved cities to localStorage
  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }, [savedCities]);

  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCity(cityName, temperatureUnit);
      setCurrentWeather(weatherData);
      localStorage.setItem('lastCity', cityName);

      // Now fetch the forecast and air quality
      const { lat, lon } = weatherData.coord;
      setCurrentMapPosition([lat, lon]);
      
      const forecastData = await fetchForecast(lat, lon, temperatureUnit);
      setForecast(forecastData);
      
      const airQualityData = await fetchAirQuality(lat, lon);
      setAirQuality(airQualityData);
      
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByLocation = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCoords(lat, lon, temperatureUnit);
      setCurrentWeather(weatherData);
      setCity(weatherData.name);
      localStorage.setItem('lastCity', weatherData.name);
      
      // Update map position
      setCurrentMapPosition([lat, lon]);
      
      // Fetch forecast and air quality
      const forecastData = await fetchForecast(lat, lon, temperatureUnit);
      setForecast(forecastData);
      
      const airQualityData = await fetchAirQuality(lat, lon);
      setAirQuality(airQualityData);
      
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather by location:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationWeather = async () => {
    if (navigator.geolocation) {
      try {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByLocation(latitude, longitude);
          },
          (err) => {
            console.error('Error getting location:', err);
            setError('Could not access your location. Please search for a city manually.');
            setIsLoading(false);
          }
        );
      } catch (err) {
        setError('Something went wrong. Please try again.');
        setIsLoading(false);
      }
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const addSavedCity = (city: SavedCity) => {
    // Limit to 5 saved cities
    if (savedCities.length >= 5) {
      // Remove the oldest city
      setSavedCities([...savedCities.slice(1), city]);
    } else {
      // Check if city already exists
      if (!savedCities.some(savedCity => savedCity.id === city.id)) {
        setSavedCities([...savedCities, city]);
      }
    }
  };

  const removeSavedCity = (cityId: number) => {
    setSavedCities(savedCities.filter(city => city.id !== cityId));
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        airQuality,
        isLoading,
        error,
        city,
        setCity,
        searchCity,
        savedCities,
        addSavedCity,
        removeSavedCity,
        getLocationWeather,
        temperatureUnit,
        toggleTemperatureUnit,
        themeMode,
        toggleThemeMode,
        currentMapPosition,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};