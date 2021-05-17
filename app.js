var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db');
const port = process.env.PORT || 3000;


var indexRouter = require('./routes/index');
var homeRouter = require('./routes/customer-routes/home');

const AdminController = require('./controllers/AdminController');
const addNews = require('./routes/admin-routes/addNews');
const News = require('./models/adminModels/NewsModel');
const contactController = require('./controllers/ContactController');


var app = express();


//Chat box working

const http = require('http').Server(app);
const io = require('socket.io')(http);


app.set('views',['./views','./views/customerView','./views/adminView']);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);

app.use('/addNews' , addNews);


//For Admin Controller
app.use('/admin',AdminController);

app.use('/contactus',contactController);


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


//chat box working
http.listen(port, (err) => {
	if (err)
		throw err;
	console.log(`Listening on port ${port}...`);
});

// app.listen(port, (err) => {
// 	if (err)
// 		throw err;
// 	console.log(`Listening on port ${port}...`);
// });

// Event handler that is emitted when client connects.
io.on('connection', (socket) => {
    console.log('A client has connected to the server!');

    // Event handler that is emitted when a message is sent.
    socket.on('msg', (data) => {
        // Send a new message to everyone in the chat room.
        io.sockets.emit('newmsg', data);
    });

    // Event handler that is emitted when client is disconnected.
    socket.on('disconnect', () => {
        console.log('A client has disconnected from the server!');
    });
});



module.exports = app;
