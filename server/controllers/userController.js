/*
*	User controller for saving user authenticated data in user model
*/
'use strict';
var UserModel = require("../models/userModel"),
	bCrypt = require('bcrypt-nodejs');

//save authenticated data
exports.doLogin = function(req, res) {
	
	if(typeof req.body != undefined || req.body !== ""){
		if(typeof req.body.userObj == undefined || req.body.userObj === ""
				 || typeof req.body.token == undefined || req.body.token === ""){

			res.json({validationMsg : "User details are empty"});
		}else{
			var userObj = req.body.userObj;
			userObj.hashToken = generateHash(req.body.token);
			UserModel.findOneAndUpdate(
				{ email: userObj.email },
				{
				 	$set: userObj
				 	},
				{
					upsert: true,
			    	new : true
			    }, function(err, result){
						if(err){
							console.log(err);
							res.json({errMsg : "Something went wrong in backend. We are working hard to resolve."});
						}else{
							res.json({result : "success"});
						}
			});
		}
	}else{
		res.json({validationMsg : "Request is empty"});
	}
};

//Generating has value of token to store in database
function generateHash(token){
	if(typeof token != undefined && typeof token != undefined){
	 	return bCrypt.hashSync(token, bCrypt.genSaltSync(10), null);
	}
};

