var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var auth = require('./Auth');

var app = express();
mongoose.connect('mongodb://localhost:27017/fqmsDBSecond');
var db = mongoose.connection;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
//added for pug
app.use("/public/images", express.static(path.join(__dirname, '/public/images')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

auth(app);

var index = require('./routes/index');
app.use('/', index);

// var farmer = require('./routes/farmer');
// app.use('/farmer', farmer);

// var expert = require('./routes/expert');
// app.use('/expert', expert);

module.exports = app;