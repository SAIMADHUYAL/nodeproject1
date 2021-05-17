const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const iplocate = require("node-iplocate")
const publicIp = require('public-ip')

const axios = require('axios');

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views/customerView');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const News = require('../../models/adminModels/NewsModel');


const userloc = async ()=>{
    try{
        const ip = await publicIp.v4()
        console.log("ip : ", ip)
        return await iplocate(ip)    
    }catch(err){
        console.log(err)
    }
}

const getWeather = async (lon, lat) =>{
    const apikey = 'f443d734d889d6c735762b5fedab80b1'
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apikey}&units=metric`
    console.log("getWeather : apiUrl : ", apiUrl)
    try{
        return await axios.get(apiUrl)
    }catch(err){
        console.log(err)
    }
}


router.get('/', (req, res) =>{

	userloc().then((loc)=>{  
        const lon = loc.longitude
        const lat = loc.latitude
        console.log(`lon: ${lon}, lat: ${lat}`)

        getWeather(lon,lat).then((response)=>{
            const weather = {
                description: response.data.weather[0].main,
                icon: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
                temperature: response.data.main.temp,
                temp_min: response.data.main.temp_min,
                temp_max: response.data.main.temp_max,
                city: response.data.name
            }
            console.log("weather: ", weather)

            News.find({}).limit(3).sort( {insertTime: -1} ).exec( (err,data)=>{
                console.log(err)
                const newsList = data

                console.log("news : ", newsList)
                res.render('home', {
                    weather,
                    newsList
                })
            })
    
        })
    })
});

router.get('/about', function (req, res) {
	res.render('about', { title: 'About' });
});

router.get('/contactus', function (req, res) {
	res.render('contactus', { title: 'contactus' });
});

module.exports = router;