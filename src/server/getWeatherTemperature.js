const axios = require('axios');

const getWeatherTemperature = async (lon, lat, remainingDays, key) => {
  if (remainingDays < 0) {
    const errMessage = {
      message: 'Date cannot be in the past',
      error: true,
    };
    return errMessage;
  }

  if (remainingDays > 0 && remainingDays <= 7) {
    const { data } = await axios.get(
      `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&units=M&key=${key}`
    );

    const { weather, temp } = data.data[data.data.length - 1];
    const { description } = weather;
    const weather_data = { description, temp };
    return weather_data;
  } else if (remainingDays > 7) {
    const { data } = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&units=M&days=${remainingDays}&key=${key}`
    );
    const { weather, temp, app_max_temp, app_min_temp } =
      data.data[data.data.length - 1];
    const { description } = weather;
    const weather_data = { description, temp, app_max_temp, app_min_temp };
    return weather_data;
  }
};

module.exports = {
  getWeatherTemperature,
};
