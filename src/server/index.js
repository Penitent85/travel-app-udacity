const express = require("express")
const app = express();
const cors = require("cors");

//using body parser
app.use(express.json())

app.use(express.static('dist'))

//dotenv to hide the api keys
require("dotenv").config()

//get the city function which get location from geoNames
const  {getCityLocation} = require("./getCityLocation")
const {getWeatherTemperature} = require("./getWeatherTemperature")
const {getCityPicture} = require("./getCityPicture")

//using cors
app.use(cors())

port = process.env.PORT || 3000

//I had to fix an issue with the env file that it doesn't want to get the integers in my username so i made
// a separate const for them
const WEATHER_KEY = process.env.WEATHER_KEY
const PIXABAY_KEY = process.env.PIXABAY_KEY
const username = process.env.USERNAME

app.get("/", (req, res) => {
  res.render("index.html")
})

app.post("/get-city-location", async (req,res) => {
    const city = req.body.city;
    const Location= await getCityLocation(city, username)
    return res.send(Location)
   
})

app.post("/get-weather-temperature", async (req,res) => {
   const {lng, lat, remainingDays} = req.body
   const getWeather = await getWeatherTemperature(lng, lat, remainingDays, WEATHER_KEY)
   return res.send(getWeather)
})

app.post("/get-city-picture", async (req,res) => {
  const {city_name} = req.body
  const getPicture = await getCityPicture(city_name, PIXABAY_KEY)
  return res.send(getPicture)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})