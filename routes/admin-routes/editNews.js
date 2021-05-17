const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
var path = require('path');

const app = express();
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views/adminView');
const News = require('../../models/adminModels/NewsModel');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) =>{

	News.find({}).limit(3).sort( {insertTime: -1} ).exec( (err,data)=>{
		console.log(err)

		console.log("news : ", data)
		res.render('editNews', { data })
	})
});

module.exports = router;