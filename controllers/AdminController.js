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
            

            const d = Date.now();
            const news = new News({...req.body, insertTime: d  })
            
            news.save(
                (err, data) => {
                if(err) return res.status(500).send('There was a problem adding news')
                console.log(`Inserted ... ${data} `)
                //const htmlMsg = encodeURIComponent('Adding News DONE !');
                res.redirect('/editNews');
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

router.get('/login', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/login');
})


router.post('/find_by_id', (req,res)=>{
    const id = req.body.id
    console.log("/find_by_id : id : ", id)
    News.find({_id: id}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("/find_by_id : data : ", data)
            res.send(data)
        }
    })
})

router.put('/updateNews', (req,res)=>{
    const id = req.body.id
    console.log("/updateNews : id : ", id)
    News.findOneAndUpdate({_id: id},{
        $set:{
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            url_to_image: req.body.url_to_image,
            publishedat: req.body.publishedat,
            insertTime: Date.now()
        }
    },{
        upsert: true
    }, (err,result)=>{
        if(err) return res.send(err)
        res.send("Updated ...")
    }) 
})

router.delete('/deleteNews', (req,res)=>{
    const id = req.body.id
    console.log("/deleteNews : id : ", id)
    News.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err)
        res.send({message: 'deleted ...'})
        console.log(result)
    })
})


module.exports = router