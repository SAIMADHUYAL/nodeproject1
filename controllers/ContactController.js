const express = require('express');
const router = express.Router();

var dateFormat = require('dateformat');


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


const Query = require('../models/customer-models/contactus');


const app = express();
app.set('view engine', 'ejs');
app.set('views', './views/customerView');
app.use(express.static(__dirname+'/public'));



router.post('/', (req,res) => {           
            const query = new Query({...req.body })
            
            query.save(
                (err, data) => {
                if(err) return res.status(500).send('There was a problem adding news')
                console.log(`Inserted ... ${data} `)
                //alert('Your Query has been Submitted');
                res.redirect('/contactus');
            })         
})

module.exports = router