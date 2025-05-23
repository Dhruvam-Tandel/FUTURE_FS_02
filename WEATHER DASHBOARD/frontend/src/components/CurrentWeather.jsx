import React, { useContext } from 'react';
import { WeatherContext } from '../contexts/WeatherContext';
import {
  Sunrise,
  Sunset,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Globe,
  Star,
} from 'lucide-react';

const CurrentWeather = () => {
  const { weatherData, unit, favorites, toggleFavorite } = useContext(WeatherContext);
  if (!weatherData) return null;

  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const condition = weatherData.weather[0].main;
  const iconCode = weatherData.weather[0].icon;
  const weatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const dateTime = new Date().toLocaleString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isFavorite = favorites.some(fav => fav.city === weatherData.name);

  return (
    <div className="max-w-screen-2xl mx-auto rounded-xl shadow-lg p-4 sm:p-8 bg-gradient-to-br from-sky-200 to-sky-100 transition-all text-gray-800">
      {/* Top container: Icon + Location + Date + Favorite + Temp */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-10 mb-8">
        {/* Left side: Icon + Location + Date */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-xs w-full">
          <img
            src={weatherIconUrl}
            alt={condition}
            className="w-16 h-16 sm:w-24 sm:h-24"
          />
          <h2 className="text-lg sm:text-3xl font-bold mt-2 truncate">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">{dateTime}</p>
        </div>

        {/* Right side: Favorite + Temp + Description */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right w-full max-w-xs">
          <button
            onClick={() => toggleFavorite(weatherData.name)}
            className="mb-2 p-1 rounded-full text-yellow-500 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star fill={isFavorite ? "currentColor" : "none"} size={28} />
          </button>
          <p className="text-4xl sm:text-5xl font-extrabold leading-none">{temp}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p className="capitalize text-md sm:text-lg mt-1 max-w-[180px] truncate">{weatherData.weather[0].description}</p>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">
            H: {Math.round(weatherData.main.temp_max)}° | L: {Math.round(weatherData.main.temp_min)}°
          </p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 text-center">
        {[
          { icon: <Thermometer size={20} />, label: 'Feels Like', value: `${feelsLike}°${unit === 'metric' ? 'C' : 'F'}` },
          { icon: <Droplets size={20} />, label: 'Humidity', value: `${weatherData.main.humidity}%` },
          { icon: <Wind size={20} />, label: 'Wind', value: `${weatherData.wind.speed} m/s` },
          { icon: <Gauge size={20} />, label: 'Pressure', value: `${weatherData.main.pressure} hPa` },
          { icon: <Eye size={20} />, label: 'Visibility', value: `${(weatherData.visibility / 1000).toFixed(1)} km` },
          { icon: <Globe size={20} />, label: 'Clouds', value: `${weatherData.clouds.all}%` },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/30 backdrop-blur-md p-3 rounded-lg shadow-md flex flex-col items-center text-xs sm:text-sm select-none"
          >
            {item.icon}
            <p className="mt-1 font-medium">{item.label}</p>
            <p className="font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Sunrise & Sunset */}
      <div className="mt-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-300 p-4 rounded-lg shadow-md text-white text-xs sm:text-sm select-none">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <Sunrise className="text-yellow-300" size={24} />
            <div>
              <p className="font-semibold">Sunrise</p>
              <p className="font-bold text-lg sm:text-xl">{sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Sunset className="text-orange-300" size={24} />
            <div className="text-center sm:text-right">
              <p className="font-semibold">Sunset</p>
              <p className="font-bold text-lg sm:text-xl">{sunset}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
