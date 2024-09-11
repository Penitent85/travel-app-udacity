import axios from 'axios';
const form = document.querySelector('form');
const location = document.getElementById('location');
const date = document.getElementById('date');
const locationError = document.getElementById('location-error');
const dateError = document.getElementById('date-error');

const handleSubmit = async (e) => {
  e.preventDefault();
  //  check if the inputs are valid
  if (!validate()) {
    return;
  }

  // get location of the city from geonames api and return the data , lan and lat
  const Location = await getCityLocation();

  // if the location is not found
  if (Location && Location.error) {
    locationError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${Location.message}`;
    locationError.style.display = 'block';
    return;
  }
  // location is found and we can get the weather data
  else if (Location && !Location.error) {
    const { lng, lat, name } = await Location;
    if (!date.value) {
      dateError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>Please enter the date`;
      dateError.style.display = 'block';
      return;
    }

    if (lng && lat) {
      const weather = await getWeatherTemperature(
        lng,
        lat,
        getRemainingDays(date.value)
      );

      if (weather && weather.error) {
        dateError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${weather.message}`;
        dateError.style.display = 'block';
        return;
      }
      const pic = await getCityPicture(name);
      updateUI(getRemainingDays(date.value), name, pic, weather);
    }
  }
};

const validate = () => {
  locationError.style.display = 'none';
  dateError.style.display = 'none';
  if (!location.value) {
    locationError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>Please enter your destination`;
    locationError.style.display = 'block';
    return;
  }
  if (!date.value) {
    dateError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>Please enter the date of your trip`;
    dateError.style.display = 'block';
    return;
  }
  if (getRemainingDays(date.value) < 0) {
    dateError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>Date cannot be before ${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
    dateError.style.display = 'block';
    return;
  }
  locationError.style.display = 'none';
  dateError.style.display = 'none';
  return true;
};

const getCityLocation = async () => {
  if (location.value) {
    const { data } = await axios.post(
      'http://localhost:3000/get-city-location',
      form,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  } else {
    locationError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>This field cannot be left empty`;
    locationError.style.display = 'block';
  }
};

const getWeatherTemperature = async (lng, lat, remainingDays) => {
  const { data } = await axios.post(
    'http://localhost:3000/get-weather-temperature',
    {
      lng,
      lat,
      remainingDays,
    }
  );

  return data;
};

const getRemainingDays = (date) => {
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
};

const getCityPicture = async (nameOfCity) => {
  const { data } = await axios.post('http://localhost:3000/get-city-picture', {
    nameOfCity,
  });
  const { image } = await data;
  return image;
};

const updateUI = (remainingDays, city, pic, weather) => {
  document.getElementById('remaining-days').innerHTML = `
  Your trip starts in ${remainingDays} days from now
  `;
  document.querySelector('.city-name').innerHTML = `Location: ${city}`;
  document.querySelector(
    '.temperature'
  ).innerHTML = `Temperature is: ${weather.temp}°C`;
  document.querySelector(
    '.weather'
  ).innerHTML = `Weather is: ${weather.description}`;
  document.querySelector('.city-picture').innerHTML = `
   <image 
   src="${pic}" 
   alt="city picture"
   >
   `;
  document.querySelector('#information').style.display = 'block';
};

export { handleSubmit };
