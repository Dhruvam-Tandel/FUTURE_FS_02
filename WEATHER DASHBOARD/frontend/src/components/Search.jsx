import React, { useState, useEffect, useContext, useRef } from 'react';
import { WeatherContext } from '../contexts/WeatherContext';

const Search = () => {
  const { fetchWeatherByCity } = useContext(WeatherContext);
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(savedSearches);
  }, []);

  const api = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchCitySuggestions = async (query) => {
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${api}`
      );
      const data = await res.json();

      const filtered = data.filter(loc => loc.lat && loc.lon);
      setSuggestions(
        filtered.map(loc => ({
          label: `${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country}`,
          value: loc.name
        }))
      );
    } catch (err) {
      console.error('Error fetching city suggestions:', err);
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!search.trim()) return;

      const normalized = search.trim().toLowerCase();
      const updatedSearches = [search.trim(), ...recentSearches.filter(s => s.toLowerCase() !== normalized).slice(0, 4)];

      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      fetchWeatherByCity(search.trim());
      setSearch('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchCitySuggestions(value);
    }, 400);
  };

  const handleSuggestionClick = (city) => {
    setSearch(city);
    fetchWeatherByCity(city);

    const normalized = city.toLowerCase();
    const updatedSearches = [city, ...recentSearches.filter(s => s.toLowerCase() !== normalized).slice(0, 4)];
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    setSuggestions([]);
  };

  return (
    <div className="relative rounded-lg shadow-md p-2 sm:p-3 mb-4 sm:mb-6 max-w-full mx-auto">
      <div className="flex items-center mb-2 sm:mb-3 relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleSearch}
          placeholder="Search city or region..."
          className="w-full h-8 sm:h-9 pl-8 pr-3 rounded-md border border-gray-300 bg-white text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute top-9 sm:top-10 left-0 w-full bg-white text-black border border-gray-300 rounded-b-md z-10 max-h-40 overflow-y-auto shadow-lg text-xs sm:text-sm">
            {suggestions.map((city, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(city.value)}
                className="px-3 py-1 cursor-pointer hover:bg-gray-100"
              >
                {city.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Searches */}
      <div className="flex flex-wrap gap-1 items-center">
        <span className="text-[10px] sm:text-xs font-semibold text-gray-700">Recent Searches:</span>
        {recentSearches.length > 0 ? (
          recentSearches.map((city, index) => (
            <button
              key={index}
              onClick={() => fetchWeatherByCity(city)}
              className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] sm:text-xs text-gray-700 hover:bg-gray-200"
            >
              {city}
            </button>
          ))
        ) : (
          <span className="text-[10px] sm:text-xs text-gray-500">No recent searches</span>
        )}
      </div>
    </div>
  );
};

export default Search;
