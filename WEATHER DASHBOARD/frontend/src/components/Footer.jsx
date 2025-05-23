import React from 'react';

const Footer = () => {
  return (
    <footer className="text-gray-700 py-4 sm:py-6 mt-12 ">
      <div className="container mx-auto px-2 flex flex-col sm:flex-row sm:justify-between items-center text-center sm:text-left gap-2 sm:gap-0">
        <p className="text-xs sm:text-sm md:text-base">
          Weather Data Provided By <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">OpenWeather API</a>
        </p>
        <p className="text-xs sm:text-sm md:text-base">
          © {new Date().getFullYear()} WeatherNow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
