import React, { useContext } from 'react';
import { WeatherContext } from './contexts/WeatherContext';
import Search from './components/Search';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import Favorites from './components/Favorites';
import Footer from './components/Footer';

const App = () => {
  const { unit, loading, error, toggleUnit } = useContext(WeatherContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-gray-800 transition-colors duration-300">
      <div className="container mx-auto p-4">
        {/* Header with Unit Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-3xl font-bold text-blue-600">W</span>eather
            <span className="text-3xl font-bold text-sky-400">Now</span>
          </h1>
          <button
            onClick={toggleUnit}
            className="p-2 rounded border-0 hover:bg-sky-100 "
          >
            {unit === 'metric' ? '°C' : '°F'}
          </button>
        </div>

        {/* Search Component */}
        <Search />

        {loading && <p className="text-center text-gray-700">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Weather Display */}
        <div className="space-y-6">
          <CurrentWeather />
          <HourlyForecast />
          <DailyForecast />
          <Favorites />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
