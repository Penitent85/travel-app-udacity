const axios = require("axios")


const getCityLocation = async(location, username) => {
    const {data} = await axios.get(`https://secure.geonames.org/searchJSON?q=${location}&maxRows=1&username=${username}`)
    
    if(!data.geonames.length){
        const errMessage = {
            message: "Please make sure of your spelling , or try another city",
            error: true
        }
        return errMessage
    }
    return data.geonames[0]
}

module.exports =  {getCityLocation}