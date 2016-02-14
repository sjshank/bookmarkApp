define(['angular'],
	function(angular){

	return function(webApp){
		var _self = this;
		'use strict';

		webApp.constant('appConstants', {
			SERVICE_ERROR : "Service is temporarily unavailable"
		});

		webApp.run(['$rootScope', function($rootScope) {
			$rootScope.feedQuery = "";
			$rootScope.isFBLogin = false;
			$rootScope.showLogout = false;
			$rootScope.userDetails = {
				picUrl : ""
			};
		}]);
	};
});

