import React, { createContext, useState, useEffect } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'metric');
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchInitialWeather = async () => {
      setLoading(true);
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              await fetchWeatherByLocation(latitude, longitude);
            },
            async (geoError) => {
              console.warn('Geolocation error:', geoError.message);
              await fetchWeatherByCity('Surat'); 
            }
          );
        } else {
          await fetchWeatherByCity('Surat'); 
        }
      } catch (err) {
        console.error('Initial fetch error:', err.message);
        setError('Failed to fetch initial weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialWeather();
  }, []);

  
  useEffect(() => {
    if (weatherData?.coord) {
      fetchWeatherByLocation(weatherData.coord.lat, weatherData.coord.lon);
    }
  }, [unit]);

  
  const refreshFavoritesWeather = async () => {
    const updatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        try {
          const res = await fetch(`${apiUrl}/weather/current?city=${fav.city}&units=${unit}`);
          const data = await res.json();
          if (data.cod !== 200) throw new Error(data.message);
          return {
            city: data.name,
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
          };
        } catch (err) {
          console.error('Failed to refresh favorite:', err.message);
          return fav; // fallback to old data
        }
      })
    );

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Fetch by city name
  const fetchWeatherByCity = async (city, fetchUnit = unit) => {
    setLoading(true);
    setError(null);
    try {
      const weatherRes = await fetch(`${apiUrl}/weather/current?city=${city}&units=${fetchUnit}`);
      const forecastRes = await fetch(`${apiUrl}/weather/forecast?city=${city}&units=${fetchUnit}`);
      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();

      if (weather.cod !== 200) throw new Error(weather.message);
      if (forecast.cod !== '200') throw new Error(forecast.message);

      setWeatherData(weather);
      setForecastData(forecast);

      await refreshFavoritesWeather();
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch by coordinates
  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const weatherRes = await fetch(`${apiUrl}/weather/location?lat=${lat}&lon=${lon}&units=${unit}`);
      const weather = await weatherRes.json();
      if (weather.cod !== 200) throw new Error(weather.message);

      setWeatherData(weather);

      const forecastRes = await fetch(`${apiUrl}/weather/forecast?city=${weather.name}&units=${unit}`);
      const forecast = await forecastRes.json();
      if (forecast.cod !== '200') throw new Error(forecast.message);

      setForecastData(forecast);

      await refreshFavoritesWeather();
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Toggle metric/imperial unit
  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);

    refreshFavoritesWeather();
  };

  // Add or remove from favorites
  const toggleFavorite = async (city) => {
    let updatedFavorites;
    const isFavorite = favorites.some(fav => fav.city === city);

    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.city !== city);
    } else {
      try {
        const res = await fetch(`${apiUrl}/weather/current?city=${city}&units=${unit}`);
        const data = await res.json();
        if (data.cod !== 200) throw new Error(data.message);
        updatedFavorites = [
          ...favorites,
          {
            city: data.name,
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
          },
        ];
      } catch (err) {
        console.error('Failed to add favorite:', err.message);
        return;
      }
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        forecastData,
        unit,
        favorites,
        loading,
        error,
        fetchWeatherByCity,
        toggleUnit,
        toggleFavorite,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
