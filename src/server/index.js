const express = require("express")
const app = express();
//  for cross origin allowance
const cors = require("cors");

//using body parser
app.use(express.json())

app.use(express.static('dist'))

//dotenv to hide the api keys
require("dotenv").config()

//get the city function which get location from geoNames
const  {getCityLocation} = require("./getCityLocation")
// get the weather temperature  
const {getWeatherTemperature} = require("./getWeatherTemperature")
//get the city picture
const {picture} = require("./getCityPicture")

//using cors
app.use(cors())

port = process.env.PORT || 3000

//api keys
const WEATHER_KEY = process.env.WEATHER_KEY
const PIXABAY_KEY = process.env.PIXABAY_KEY
const username = process.env.USERNAME

app.get("/", (req, res) => {
  res.render("index.html")
})

app.post("/get-city-location", async (req,res) => {
    const {location} = req.body;
    const Location= await getCityLocation(location, username)
    return res.send(Location)
   
})

app.post("/get-weather-temperature", async (req,res) => {
   const {lat, lng, remainingDays} = req.body
   const getWeather = await getWeatherTemperature(lat, lng, remainingDays, WEATHER_KEY)
   return res.send(getWeather)
})

app.post("/get-city-picture", async (req,res) => {
  const {nameOfCity} = req.body
  const getPicture = await picture(nameOfCity, PIXABAY_KEY)
  return res.send(getPicture)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})