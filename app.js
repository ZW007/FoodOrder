var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');

var methodOveride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var menusRouter = require('./routes/menus');

var mongoose = require('mongoose'); 
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var app = express();


// view engine setup EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//log the development enviroment
app.use(logger('dev'));
app.use(express.json());

//body parser
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//express session middleware
app.use(session({ secret: 'this-is-a-secret-token' }));

//connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOveride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/menus', menusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose db connection
mongoose.connect('mongodb://localhost:27017/restaurant');

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





