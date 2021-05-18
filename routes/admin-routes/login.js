const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
var path = require('path');

const app = express();
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './views/adminView');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) =>{
	res.render('login');
});

module.exports = router;