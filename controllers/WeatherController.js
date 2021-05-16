const express = require('express');
const router = express.Router();
const request = require('request');
const weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=charlotte&mode=json&units=metric&cnt=4&appid=fbf712a5a83d7305c3cda4ca8fe7ef29";


function getWeather(url) {
    console.log(url+"weathercontroller");
    // Setting URL and headers for request
    var options = {
        url: weatherUrl,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

// Weather Api Route
router.get('/promise',(req,res) => {
    var dataPromise = getWeather();
    // Get user details after that get followers from URL
    dataPromise.then(JSON.parse)
               .then(function(result) {
                    res.render('customerView/home',{result})
                })
})

//Weather Api Without promise
router.get('/weatherwithoutpromise',(req,res) => {
    // console.log("weatherwithoutpromise")
    request(weatherUrl, (err,response,body) =>{
        if(err){
            // console.log(err);
        } else {
           
            const output = JSON.parse(body);
            console.log(output);
            res.send(output);
        }
    });
});

module.exports = router;