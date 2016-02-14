/*
*	nodejs app configuration file.
*/
'use strict';
const bodyParser = require("body-parser"),		//Request body parser
	expressHbs = require('express3-handlebars'),  // Handlebarjs view engine
	expressSession = require('express-session'), // Nodejs+Expressjs session 
	cookieParser = require('cookie-parser'),
	mongoose = require("mongoose"),
	connect = require('connect'),	//external module for express session
	morgan = require('morgan'),		//logger
	MongoStore = require('connect-mongo')(expressSession),
	path = require("path");

module.exports = function(express, app){
	app.use(morgan('dev'));
	//static folders
	app.use(express.static('client'));
	app.use(express.static('client/js/'));
	app.use(express.static('node_modules'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

/*
*	Initialize session using express. Used express-session for session controlling.
*/
	app.use(expressSession({
		secret : "bookmarkKey",
		resave : true,
		saveUninitialized : true,
	  	store: new MongoStore({
		    mongooseConnection : mongoose.connection
	  })
}));

	// view engine setup
	app.set('views', path.join(__dirname, 'server/views'));
	app.set('view engine', 'htm');
	app.use(function(req, res, next){
		  res.set('X-Powered-By', 'Social Bookmark Application');
		  next();
		});
}