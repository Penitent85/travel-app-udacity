const axios = require('axios');

const getWeatherTemperature = async (lat, lon, remainingDays, key) => {
  if (remainingDays < 0) {
    const errMessage = {
      message: 'Date cannot be in the past',
      error: true,
    }; 
    return errMessage;
  }

  const { data } = await axios.get(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&units=M&days=${remainingDays}&key=${key}`
  );
  const { weather, temp } = data.data[data.data.length - 1];
  const { description } = weather;
  const weatherData = { description, temp };
  return weatherData;
};

module.exports = {
  getWeatherTemperature,
};
