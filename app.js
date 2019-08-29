const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const cookieRouter = require('./routes/cookie');

const mongoose = require('mongoose');

const ConnectmongoDB = async ()=>{
  try{
    mongoose.connect('mongodb://localhost:27017/social', {useNewUrlParser: true});
    console.log("connect scuressful !");
    }catch(err){
      console.log("connect mongoDB has err :"+ err);
    }
};
ConnectmongoDB();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('images',__dirname, 'public')));
app.use('/media', express.static('media'))
app.use(express.static(path.join(__dirname , 'media')));
console.log(path.join(__dirname , 'media'));
app.use('/', indexRouter);
app.use('/users', usersRouter.router);
app.use('/posts', postsRouter);
app.use('/cookie',cookieRouter);

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
