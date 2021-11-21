var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const MongoClient = require("mongodb").MongoClient;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// db connection init
const db_user = "";
const db_pw = "";
const db_server = "";
const db_port = "";
let db_url = `mongodb://${db_user}:${db_pw}@${db_server}:${db_port}/${db_user}`;
const db_collection = "recipes";

MongoClient.connect(db_url, { useUnifiedTopology: true}, (err, client) => {
  if (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1);  // non zero value indicates an error
  } else {
    console.log("Connected to the database");
    app.locals.mongo = client;
    app.locals.db = client.db(db_user);
    app.locals.db_collection = db_collection;
  }
});

//let collection = await db.collection(db_collection);  // recipe collection
//const projection = {_id: true, name: true};  // limit output to id and name

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// express.static --> responsible for sending back the static resources
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
