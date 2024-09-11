 axios = require("axios")


const picture = async(nameOfCity, key) => {
    const data = await axios.get(`https://pixabay.com/api/?key=${key}&q=${nameOfCity}&image_type=photo`)
    const image = data.data.hits[0].webformatURL
    console.log(image)
    if(image){
    return {image}
    }
}

module.exports = {
    picture
}
