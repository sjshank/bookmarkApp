/*
*	Configuring and creating mongodb connection using mongoose
*/
'use strict';
const mongoose = require("mongoose"),
	URL = "mongodb://127.0.0.1:27017/bookmarkApp";

mongoose.connect(URL, callback);

function callback(err) {
	if(err){
		console.log("Unable to connect database " + err);
		process.exit(1);
	}else{
		console.log("Connection established !");
	}
};

module.exports = mongoose;