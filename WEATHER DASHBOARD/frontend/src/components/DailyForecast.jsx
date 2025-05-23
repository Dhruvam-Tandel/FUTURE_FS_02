import React, { useContext, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { WeatherContext } from '../contexts/WeatherContext';
import { FaArrowUp, FaArrowDown, FaTint, FaWind } from 'react-icons/fa';

const fixIconCode = (icon, condition) => {
  if (condition.toLowerCase().includes('clear') && icon.endsWith('n')) {
    return icon.replace('n', 'd');
  }
  return icon;
};

const DailyForecast = () => {
  const { forecastData, unit } = useContext(WeatherContext);

  const dailyData = useMemo(() => {
    if (!forecastData || !forecastData.list) return [];

    const today = new Date();
    const result = [];

    for (let i = 1; i <= 5; i++) {
      const targetDate = addDays(today, i).toDateString();

      const dayEntries = forecastData.list.filter(
        item => new Date(item.dt * 1000).toDateString() === targetDate
      );

      if (dayEntries.length > 0) {
        const high = Math.max(...dayEntries.map(item => item.main?.temp_max ?? -Infinity));
        const low = Math.min(...dayEntries.map(item => item.main?.temp_min ?? Infinity));
        const firstEntry = dayEntries[0];
        const entryDate = new Date(firstEntry.dt * 1000);

        result.push({
          day: format(entryDate, 'EEEE'),
          date: format(entryDate, 'MMM d'),
          condition: firstEntry.weather?.[0]?.description || 'N/A',
          icon: fixIconCode(firstEntry.weather?.[0]?.icon || '01d', firstEntry.weather?.[0]?.description),
          high: Math.round(high),
          low: Math.round(low),
          humidity: firstEntry.main?.humidity ?? 0,
          wind: firstEntry.wind?.speed ?? 0,
          rain: Math.round((firstEntry.pop ?? 0) * 100),
        });
      }
    }
    return result;
  }, [forecastData]);

  if (!forecastData || !forecastData.list || dailyData.length === 0) return null;



  
  const minTemp = Math.min(...dailyData.map(day => day.low));
  const maxTemp = Math.max(...dailyData.map(day => day.high));
  const totalRange = maxTemp - minTemp || 1;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="rounded-xl p-2 sm:p-4 mb-6 max-w-screen-2xl mx-auto">
      <div className="space-y-3 sm:space-y-4">
        {dailyData.map((day, index) => {
          const startPercent = ((day.low - minTemp) / totalRange) * 100;
          const widthPercent = ((day.high - day.low) / totalRange) * 100;

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-6 bg-blue-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Day and Date */}
              <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start w-full sm:w-1/5 min-w-[100px] text-center sm:text-left">
                <p className="text-blue-800 font-bold text-sm sm:text-lg md:text-xl truncate">{day.day}</p>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base">{day.date}</p>
              </div>

              {/* Icon + Condition */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-1/4 justify-center sm:justify-start">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.condition}
                  className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16"
                />
                <span className="capitalize font-medium text-gray-800 text-xs sm:text-base md:text-lg max-w-[120px] sm:max-w-[150px] truncate">{day.condition}</span>
              </div>

              {/* Temps */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-1/5 justify-center sm:justify-start text-xs sm:text-base md:text-lg font-semibold">
                <FaArrowUp className="text-red-600" size={12} sm-size={16} />
                <span>{day.high}{unitSymbol}</span>
                <FaArrowDown className="text-blue-600" size={12} sm-size={16} />
                <span>{day.low}{unitSymbol}</span>
              </div>

              {/* Humidity + Wind */}
              <div className="flex items-center gap-4 sm:gap-6 text-gray-700 font-medium w-full sm:w-1/5 justify-center sm:justify-start text-xs sm:text-sm md:text-base">
                <div className="flex items-center gap-1 sm:gap-2">
                  <FaTint className="text-blue-500" size={10} sm-size={14} />
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <FaWind className="text-gray-600" size={10} sm-size={14} />
                  <span>{day.wind} m/s</span>
                </div>
              </div>

              {/* Temp Bar */}
              <div className="flex items-center w-full sm:w-[220px] mt-2 sm:mt-0 justify-center sm:justify-end">
                <span className="text-xs sm:text-sm md:text-base font-bold text-blue-700 w-8 sm:w-10 text-right mr-1 sm:mr-2 shrink-0">
                  {day.low}{unitSymbol}
                </span>
                <div className="relative flex-grow h-2 sm:h-3 md:h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-red-500"
                    style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm md:text-base font-bold text-red-700 w-8 sm:w-10 text-left ml-1 sm:ml-2 shrink-0">
                  {day.high}{unitSymbol}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
