import React, { useContext } from 'react';
import { WeatherContext } from '../contexts/WeatherContext';
import { Trash2 } from 'lucide-react';

const Favorites = () => {
  const {
    weatherData,
    unit,
    favorites,
    toggleFavorite,
    fetchWeatherByCity,
  } = useContext(WeatherContext);

  const getConditionStyle = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('clear') || cond.includes('sun')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    } else if (cond.includes('cloud')) {
      return 'bg-gray-100 border-gray-200 text-gray-800';
    } else if (cond.includes('rain') || cond.includes('drizzle')) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    } else if (cond.includes('snow')) {
      return 'bg-white border-blue-100 text-blue-700';
    } else if (cond.includes('thunder')) {
      return 'bg-purple-50 border-purple-200 text-purple-800';
    } else if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
      return 'bg-slate-100 border-slate-200 text-slate-700';
    } else {
      return 'bg-green-50 border-green-200 text-green-800'; 
    }
  };

  return (
    <div className="rounded-xl p-4 sm:p-6 max-w-full">
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">Favorite Locations</h3>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {favorites.map((fav, index) => (
            <div
              key={index}
              onClick={() => fetchWeatherByCity(fav.city)}
              className={`p-3 sm:p-4 rounded-lg border shadow-sm cursor-pointer transition-transform transform hover:scale-[1.02] ${getConditionStyle(fav.condition)}`}
            >
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold truncate">{fav.city}</h4>
                  <p className="text-xs sm:text-sm capitalize truncate">{fav.condition || '—'}</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold">
                  {fav.temp ?? '--'}°{unit === 'metric' ? 'C' : 'F'}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(fav.city);
                }}
                className="mt-1 sm:mt-2 flex items-center gap-1 text-xs sm:text-sm hover:text-red-500 transition"
                aria-label={`Remove ${fav.city} from favorites`}
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          No favorite locations yet.
        </p>
      )}
    </div>
  );
};

export default Favorites;
