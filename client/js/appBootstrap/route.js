define(['angular',
		'angularAMD',
		'angRoute'],
	function(angular,
			 angularAMD,
			 angRoute){

	return function(bookmarkApp){
		var _self = this;
		'use strict';

		bookmarkApp.config( function ($routeProvider) {
			 $routeProvider
			 .when("/login", angularAMD.route({
				 templateUrl: 'templates/login.htm', controller: 'loginCtrl', controllerUrl: 'controller/loginController'
			 }))
			 .when("/feed", angularAMD.route({
				 templateUrl: 'templates/newsFeed.htm', controller: 'feedCtrl', controllerUrl: 'controller/feedController', authenticated: true
			 }))
			 .otherwise({redirectTo: "/login"});
			 });
	};
});