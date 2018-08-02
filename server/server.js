
'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var app = express();


 app.set('view engine', 'pug'); 
 app.set('views', path.join(__dirname, '../www/pug'));

// this session will be used to save the oAuth token
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy - HTTPS on Heroku 
app.use(session({
  secret: 'kidsforge',
  cookie: {
    httpOnly: true,
    secure: (process.env.NODE_ENV === 'production'),
    maxAge: 1000 * 60 * 60 * 24 * 31// 1 hours to expire the session and avoid memory leak
  },
  resave: false,
  saveUninitialized: true
}));

// prepare server routing
app.use('/', express.static(__dirname + '/../www')); // redirect static calls
app.use('/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js')); // redirect static calls
app.use('/js', express.static(__dirname + '/../node_modules/jquery/dist')); // redirect static calls
app.use('/js', express.static(__dirname + '/../node_modules/jstree/dist')); // redirect static calls
app.use('/js', express.static(__dirname + '/../node_modules/moment/min')); // redirect static calls
app.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css')); // redirect static calls
app.use('/css/jstree', express.static(__dirname + '/../node_modules/jstree/dist/themes/default')); // redirect static calls (jstree use 'style.css', which is very generic, so let's use an extra folder)
app.use('/fonts', express.static(__dirname + '/../node_modules/bootstrap/dist/fonts')); // redirect static calls
app.set('port', process.env.PORT || 3000); // main port

// prepare our API endpoint routing
var addChoice = require('./addChoice');
var email = require('./email');
var grant = require('./grant');
//var document = require('./document.js');
app.use('/wish', addChoice); 
app.use('/email', email);
app.use('/grant', grant)
//app.use('/', datamanagement); // redirect our custom API calls
//app.use('/qr', document);
module.exports = app;
