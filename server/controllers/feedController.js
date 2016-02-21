/*
*	Feed controller for saving news need from social page in feed model
*/
'use strict';
var FeedModel = require("../models/feedModel");

//Save all the news feed based on search criteria. No duplication
exports.saveFeeds = function(req, res) {
	
	if(typeof req.body != undefined || req.body !== ""){
		if(typeof req.body.userObj == undefined || req.body.userObj === ""
				 || typeof req.body.feeds == undefined || req.body.feeds === ""){

			res.json({validationMsg : "There is no news feed to save"});
		}else{
			var userObj = req.body.userObj;
			var feedList = req.body.feeds;
				for(var i =0; i <= feedList.length - 1; i++){
					var id = feedList[i]['id'];

					FeedModel.update(
						{ 'feeds.id' : id},
						{
						 	$set: {
							 	feeds : feedList[i],
							 	email : userObj.email,
							 	saved_by : userObj.name
						 	}
						},
						{
							upsert: true,
					    	new : true
					    }, function(err, result){
								if(err){
									console.log(err);
									res.json({errMsg : "Something went wrong in backend. We are working hard to resolve."});
								}
					});
			}

			res.json({result : "success"});
			
		}
	}else{
		res.json({validationMsg : "Request is empty"});
	}
};

//Retrieve all the saved news feed
exports.getFeeds = function(req, res) {

	if(typeof req.query != undefined || req.query !== ""){
			var queryParm = req.query;
			var searchQuery = queryParm.searchQuery.toString();
			var isFBPost = queryParm.isFBPost;
			FeedModel.find(
			{
				'feeds.message' : { $regex : new RegExp(searchQuery, "i")},
				'feeds.isFBPost' : isFBPost 
			}, function(err, result){
				if (err) {
					console.log(err);
					res.json({errMsg : "Something went wrong in backend. We are working hard to resolve."});
				} else{
					res.json({data : result});
				}
			});
	}else{
		res.json({validationMsg : "Request is empty"});
	}
};


