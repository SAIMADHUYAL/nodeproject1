const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views/customerView');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const News = require('../../models/adminModels/NewsModel');

function fetchJSON(url) {
	return new Promise((resolve, reject) => {
	  request(url, function(err, res, body) {
		if (err) {
		  reject(err);
		} else if (res.statusCode !== 200) {
		  reject(new Error('Failed with status code ' + res.statusCode));
		} else {
		  resolve(JSON.parse(body));
		}
	  });
	});
}

router.get('/', (req, res) =>{
	//req.session.isLoggedIn = false;
	//console.log('rout:'+req.session.isLoggedIn)
	weatherData = fetchJSON('http://localhost:3000/getWeather/weatherwithoutpromise');
	var d1,d2 ;
	Promise.all([weatherData, weatherData]).then((data) => {
		console.log(data)
		d1 = data[0];
		d2 = data[1];

       News.find((err, news) => {
			if (err) throw err;
			news.sort((a,b) => {
				return b.publishedOn-a.publishedOn;
			})
			news = news.slice(0,3) ;
			res.render('home', { newsList: news, result: d1, data_two: d2 });
		});
      }).catch(err => console.error('There was a problem', err));
	 
    //res.render('home');
});






// 		res.render("home", {
// 		  result: data[0],
// 		  data_two: data[1]
// 		});
// 	  }).catch(err => console.error('There was a problem', err));
// 	//res.render('home');
// });


module.exports = router;