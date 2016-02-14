/*
*	Routing configuration file
*/
'use strict';
const router = require("./init"),
	db = require("./db"),
	userController = require("../controllers/userController");


router.route('/login')
	.post(function(req, res){
		userController.doLogin(req, res);
	});

module.exports = router;