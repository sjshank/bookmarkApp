/*
*	Routing configuration file
*/
'use strict';
const router = require("./init"),
	db = require("./db"),
	feedController = require("../controllers/feedController"),
	userController = require("../controllers/userController");


router.route('/login')
	.post(function(req, res){
		userController.doLogin(req, res);
	});

router.route('/feeds')
	.post(function(req, res){
		feedController.saveFeeds(req, res);
	})
	.get(function(req, res){
		feedController.getFeeds(req, res);
	});

module.exports = router;