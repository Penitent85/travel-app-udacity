const axios = require("axios")


const getCityLocation = async(city, username) => {
    const {data} = await axios.get(`https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`)
    
    if(!data.geonames.length){
        const errMessage = {
            message: "No city with that name. Please make sure of your spelling",
            error: true
        }
        return errMessage
    }
    return data.geonames[0]
}

module.exports =  {getCityLocation}