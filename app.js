// libraries used
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
// configured to use dotenv
require('dotenv').config({path: './.env'})


// connect to monogoDB
try {
	mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	mongoose.set('useCreateIndex', true);
} catch (error) {
	handleError(error);
}

// express router paths
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let newUsers = require('./routes/newUser');
let findMedia = require('./routes/findMedia');
let addMedia = require('./routes/addMedia');
let favoriteMedia = require('./routes/favoriteMedia')
let removeMediaWatchlist = require('./routes/removeMedia')
let removeFavorite = require('./routes/removeFavorite')

// inititalize express
var app = express();

let users = require('./models/user');

app.use(auth(config));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// main index route
// note: this leads to the standard express intro page
app.use('/', indexRouter);

// users route to get user information
app.use('/users', usersRouter);
// new user route to create new user
app.use('/newUser', newUsers);

// search route to find media using TMDB API
app.use('/search', findMedia);

// watchlist route to add media to watchlist's 
app.use('/watchlist', addMedia);
// route to remove media from watchlist
app.use('/removeFromWatchlist', removeMediaWatchlist)

// favorite route to add media to favorites
app.use('/favorites', favoriteMedia);
// route to remove media from favorites
app.use('/removeFavorite', removeFavorite)


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

module.exports = app;
