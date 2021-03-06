var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var studyRouter = require('./routes/study');

var app = express();

var mongoose = require('mongoose');
var mongoDB = process.env.DB_PATH;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var auth = require('./myMiddleware/auth')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);
app.use((req, res, next) => {
  if(req.url == '/signup') {
    next();
  } else if(req.url !== '/login' && req.url.split("/")[1] !== 'api' && req.secret.loggedin == false) {
    res.redirect(req.baseUrl + '/login');
  } else {
    next();
  }
 
})

app.use('/', indexRouter);
app.use('/study', studyRouter);

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
