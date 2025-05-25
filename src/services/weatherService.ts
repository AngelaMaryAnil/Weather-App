import axios from 'axios';
import { WeatherData, ForecastData, AirQualityData, TemperatureUnit } from '../types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherByCity = async (
  city: string,
  units: TemperatureUnit = 'metric'
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number,
  units: TemperatureUnit = 'metric'
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

export const fetchForecast = async (
  lat: number,
  lon: number,
  units: TemperatureUnit = 'metric'
): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const fetchAirQuality = async (
  lat: number,
  lon: number
): Promise<AirQualityData> => {
  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    throw error;
  }
};

export const getWeatherIconUrl = (iconCode: string, size: '2x' | '4x' = '4x'): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const getAirQualityLabel = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'Good';
    case 2:
      return 'Fair';
    case 3:
      return 'Moderate';
    case 4:
      return 'Poor';
    case 5:
      return 'Very Poor';
    default:
      return 'Unknown';
  }
};

export const getAirQualityColor = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'text-green-500';
    case 2:
      return 'text-green-300';
    case 3:
      return 'text-yellow-500';
    case 4:
      return 'text-orange-500';
    case 5:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getUVIndexLabel = (uvi: number): string => {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
};

export const getUVIndexColor = (uvi: number): string => {
  if (uvi <= 2) return 'text-green-500';
  if (uvi <= 5) return 'text-yellow-500';
  if (uvi <= 7) return 'text-orange-500';
  if (uvi <= 10) return 'text-red-500';
  return 'text-purple-500';
};

export const getWeatherBackground = (weatherId: number, isDay: boolean): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  
  // Clear sky
  if (weatherId === 800) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-400 to-blue-300' 
      : 'bg-gradient-to-b from-blue-900 to-indigo-900';
  }
  
  // Few clouds, scattered clouds
  if (weatherId >= 801 && weatherId <= 802) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-400 to-blue-200' 
      : 'bg-gradient-to-b from-blue-800 to-indigo-900';
  }
  
  // Broken clouds, overcast
  if (weatherId >= 803 && weatherId <= 804) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-300 to-gray-300' 
      : 'bg-gradient-to-b from-blue-800 to-gray-900';
  }
  
  // Rain, drizzle
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-400 to-gray-400' 
      : 'bg-gradient-to-b from-blue-800 to-gray-900';
  }
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return 'bg-gradient-to-b from-gray-700 to-gray-900';
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-100 to-gray-100' 
      : 'bg-gradient-to-b from-blue-200 to-gray-800';
  }
  
  // Atmosphere (mist, fog, etc)
  if (weatherId >= 700 && weatherId < 800) {
    return isDay 
      ? 'bg-gradient-to-b from-gray-300 to-gray-400' 
      : 'bg-gradient-to-b from-gray-700 to-gray-900';
  }
  
  // Default
  return isDay 
    ? 'bg-gradient-to-b from-blue-400 to-blue-300' 
    : 'bg-gradient-to-b from-blue-900 to-indigo-900';
};