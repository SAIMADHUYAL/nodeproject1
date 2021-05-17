var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db');
const port = process.env.PORT || 3000;

//const socketio = require('socket.io'); 

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/customer-routes/home');
//var usersRouter = require('./routes/users');
//const WeatherController = require('./controllers/WeatherController');
const AdminController = require('./controllers/AdminController');
const addNews = require('./routes/admin-routes/addNews');
const editNews = require('./routes/admin-routes/editNews');
const News = require('./models/adminModels/NewsModel');


var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('views', [__dirname + '/views', __dirname + '/views/adminView']);
app.set('views',['./views','./views/customerView','./views/adminView']);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
//app.use('/users', usersRouter);
app.use('/addNews' , addNews);
app.use('/addNews' , addNews);

//For Weather Controller routing
//app.use('/getWeather', WeatherController);

//For Admin Controller
app.use('/admin',AdminController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, (err) => {
	if (err)
		throw err;
	console.log(`Listening on port ${port}...`);
});

module.exports = app;
