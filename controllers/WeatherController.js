const express = require('express');
const router = express.Router();
const request = require('request');
const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=charlotte&mode=json&units=metric&cnt=4&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";

const iplocate = require("node-iplocate")
const publicIp = require('public-ip')



// const userloc = async ()=>{
//     try{
//         const ip = await publicIp.v4()
//         console.log("ip : ", ip)
//         return await iplocate(ip)    
//     }catch(err){
//         console.log(err)
//     }
// }

// const getWeather = async (lon, lat) =>{
//     const apikey = 'fbf712a5a83d7305c3cda4ca8fe7ef29'
//     const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apikey}&units=metric`
//     console.log("getWeather : apiUrl : ", apiUrl)
//     try{
//         return await axios.get(apiUrl)
//     }catch(err){
//         console.log(err)
//     }
// }
// router.get('/getWeather', (req,res)=>{

//     userloc().then((loc)=>{  
//         const lon = loc.longitude
//         const lat = loc.latitude
//         console.log(`lon: ${lon}, lat: ${lat}`)

//         getWeather(lon,lat).then((response)=>{
//             const weather = {
//                 description: response.data.weather[0].main,
//                 icon: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
//                 temperature: response.data.main.temp,
//                 temp_min: response.data.main.temp_min,
//                 temp_max: response.data.main.temp_max,
//                 city: response.data.name
//             }
//             console.log("weather: ", weather)
//             res.render('home', {
//                 weather
//             })
//         })
//     })
// })

module.exports = router;