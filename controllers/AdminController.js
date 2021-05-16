const express = require('express');
const router = express.Router();

var dateFormat = require('dateformat');


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const News = require('../models/adminModels/NewsModel');

//var list = require('../models/adminModels/NewsModel');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views/adminView');
app.use(express.static(__dirname+'/public'));



// admin addNews API
router.post('/addNews', (req,res) => {

    // const token = localStorage.getItem('authtoken')
    
    // if (!token) {
    //     res.redirect('/')
    // }
    // jwt.verify(token, config.secret, (err, decoded) => {
        
    //     if (err) res.redirect('/')
    //     User.findById(decoded.id, { password: 0 }, (err, user) => {
    //         if (err) {res.redirect('/')}
    //         if (!user) {res.redirect('/')}
            

            const d = new Date();
            const news = new News({...req.body, publishedOn: dateFormat(d) })
            
            news.save(
                (err, data) => {
                if(err) return res.status(500).send('There was a problem adding news')
                console.log(`Inserted ... ${data} `)
                //const htmlMsg = encodeURIComponent('Adding News DONE !');
                res.redirect('/');
            })            
       // });
   // });
})


router.get('/addNews', (req, res) => {
    // const token = localStorage.getItem('authtoken')
    // // console.log('cookie: ' + req.);
    // if (!token) {
    //     res.redirect('/')
    // }
    // jwt.verify(token, config.secret, (err, decoded) => {

    //     if (err) res.redirect('/')
    //     User.findById(decoded.id, { password: 0 }, (err, user) => {
    //         if (err) { res.redirect('/') }
    //         if (!user) { res.redirect('/') }
    //     })
    // })
    res.render('addNews');
});



module.exports = router