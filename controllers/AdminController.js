const express = require('express');
const router = express.Router();

var dateFormat = require('dateformat');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const News = require('../models/adminModels/NewsModel');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views/adminView');
app.use(express.static(__dirname+'/public'));

const User = require('../models/adminModels/User_model');

const session = require('express-session');
router.use(session({secret: 'edurekaSecret1', resave: false, saveUninitialized: true}));

// admin addNews API
router.post('/addNews', (req,res) => {

    const token = localStorage.getItem('authtoken')
    
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        
        if (err) res.redirect('/')
        User.findById(decoded.id, { password: 0 }, (err, user) => {
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')}
            

            const d = Date.now();
            const news = new News({...req.body, insertTime: d  })
            
            news.save(
                (err, data) => {
                if(err) return res.status(500).send('There was a problem adding news')
                console.log(`Inserted ... ${data} `)
                //const htmlMsg = encodeURIComponent('Adding News DONE !');
                res.redirect('/admin/dataNews');
            })            
       });
   });
})


router.get('/addNews', (req, res) => {
    const token = localStorage.getItem('authtoken')
    // console.log('cookie: ' + req.);
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {

        if (err) res.redirect('/')
        User.findById(decoded.id, { password: 0 }, (err, user) => {
            if (err) { res.redirect('/') }
            if (!user) { res.redirect('/') }
            //console.log(user);
            res.render('addNews');
        })
    })
    
});

router.get('/dataNews',(req,res)=>{
    const token = localStorage.getItem('authtoken')
    // console.log('cookie: ' + req.);
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {

        if (err) res.redirect('/')
        News.find({}).exec((err,result)=>{
            if(err) throw err;
            res.render('dataNews.ejs',{data:result});
        }) 
    })    
})



// Delete Selected News
router.delete('/newsDelete', (req,res)=>{
    const id = req.body.id
    console.log("/deleteNews : id : ", id)
    News.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err)
        res.send({message: 'deleted ...'})
        console.log(result)
    })
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

// Login User
router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, function (err, user) {
      console.log("/login : user => ", user)
      if (err) return res.status(500).send('Error on the server.');
      //let htmlMsg
      const string = encodeURIComponent("Invalid credentials, please try again");
      if (!user) { 
        // htmlMsg = encodeURIComponent('Email not found, try again ...');
        // res.redirect('/?invalid=' + htmlMsg);
         return res.redirect('/?valid=' + string);
        // res.redirect('/');
      }else{
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
           // return res.status(401).send({ auth: false, token: null });
            return res.redirect('/?valid=' + string);
        }

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        localStorage.setItem('authtoken', token)
        // req.session.isLoggedIn = true;
        // console.log('admin:'+req.session.isLoggedIn)
        res.redirect(`/admin/addNews`);
      }
      //res.render('/admin/addNews',{users:user});
    });
});


// Register without JWT validation
router.post('/register', (req,res) => {
    console.log("/register : req.body ==> ", req.body)
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg
      if(!user){ //add new user
        const hashedPasword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPasword,
        }, (err, user) => {
            if(err) return res.status(500).send('There was a problem registering user')
            htmlMsg = encodeURIComponent('User Registered! Login now');
            res.redirect('/?msg=' + htmlMsg)
        })
      }else{ //duplicate
        htmlMsg = encodeURIComponent('Email is existing, please enter a new one ...');
        res.redirect('/?msg=' + htmlMsg);
      }
    })     
})


router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})




module.exports = router