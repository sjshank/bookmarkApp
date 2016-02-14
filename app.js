/*
*	app.js is an entry pooint of nodejs based application.
*	
*/
'use strict';
const express = require('express'),
	route = require('./server/middlewares/router'),
	app = express();

const server = require('./server')(app);
const appConfig = require('./server/middlewares/appConfig')(express, app);

/*
*	Routing the request coming from client side
*/
	app.use('/api', route);
	app.use('/auth', route);
	//Displaying landing page
	app.use('/', function(req, res){
		res.sendFile(__dirname + '/server/views/landingPage.htm')
	});