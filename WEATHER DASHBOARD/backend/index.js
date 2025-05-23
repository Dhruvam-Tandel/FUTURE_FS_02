const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors());
app.use(express.json());

// Endpoint to get current weather by city
app.get('/api/weather/current', async (req, res) => {
  const { city, units } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units || 'metric'}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data?.message || 'Failed to fetch weather data' });
  }
});

// Endpoint to get 5-day forecast by city
app.get('/api/weather/forecast', async (req, res) => {
  const { city, units } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units || 'metric'}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data?.message || 'Failed to fetch forecast data' });
  }
});

// Endpoint to get weather by geolocation
app.get('/api/weather/location', async (req, res) => {
  const { lat, lon, units } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units || 'metric'}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data?.message || 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});