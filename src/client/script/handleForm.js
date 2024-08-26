import axios from 'axios';
const form = document.querySelector('form');
const cityInp = document.querySelector('#city');
const dateInp = document.querySelector('#flightDate');

const city_error = document.querySelector('#city_error');
const date_error = document.querySelector('#date_error');

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('I am working fine');

  if (!validate_inputs()) {
    return;
  }

  const Location = await getCityLocation();
  if (Location && Location.error) {
    city_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${Location.message}`;
    city_error.style.display = 'block';
    return;
  } else if (Location && !Location.error) {
    const { lng, lat, name } = await Location;

    const date = dateInp.value;

    if (!date) {
      console.log('please enter the date');
      date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
      date_error.style.display = 'block';
      return;
    }

    if (lng && lat) {
      const remainingDays = getRemainingDays(date);

      const weather = await getWeatherTemperature(lng, lat, remainingDays);
      if (weather && weather.error) {
        date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
        date_error.style.display = 'block';
        return;
      }
      //get the picture of the place
      const pic = await getCityPicture(name);
      updateUI(remainingDays, name, pic, weather);
    }
  }
};

const validate_inputs = () => {
  city_error.style.display = 'none';
  date_error.style.display = 'none';
  if (!cityInp.value) {
    city_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>You need to enter the city`;
    city_error.style.display = 'block';
    return;
  }
  if (!dateInp.value) {
    date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
    date_error.style.display = 'block';
    return;
  }
  if (getRemainingDays(dateInp.value) < 0) {
    date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Date cannot be in the past`;
    date_error.style.display = 'block';
    return;
  }
  city_error.style.display = 'none';
  date_error.style.display = 'none';

  return true;
};

const getCityLocation = async () => {
  if (cityInp.value) {
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
    city_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> This field cannot be left empty`;
    city_error.style.display = 'block';
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
  const startDate = new Date();
  const endDate = new Date(date);

  const timeDiff = endDate.getTime() - startDate.getTime();

  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

const getCityPicture = async (city_name) => {
  const { data } = await axios.post('http://localhost:3000/get-city-picture', {
    city_name,
  });
  const { image } = await data;
  return image;
};

const updateUI = (remainingDays, city, pic, weather) => {
  document.querySelector('#Rdays').innerHTML = `
  Your trip starts in ${remainingDays} days from now
  `;
  document.querySelector('.cityName').innerHTML = `Location: ${city}`;
  document.querySelector('.weather').innerHTML =
    remainingDays > 7
      ? `Weather is: ${weather.description}`
      : `Weather is expected to be: ${weather.description}`;
  document.querySelector('.temp').innerHTML =
    remainingDays > 7
      ? `Forecast: ${weather.temp}&degC`
      : `Temperature: ${weather.temp} &deg C`;
  document.querySelector('.max-temp').innerHTML =
    remainingDays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : '';
  document.querySelector('.min-temp').innerHTML =
    remainingDays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : '';
  document.querySelector('.cityPic').innerHTML = `
   <image 
   src="${pic}" 
   alt="an image that describes the city nature"
   >
   `;
  document.querySelector('.flight_data').style.display = 'block';
};

export { handleSubmit };
