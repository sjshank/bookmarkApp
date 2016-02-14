define(['app'],
		function(bookmarkApp){

			var _self = this;
			'use strict';

			// Defining login facory named as loginService returning login resource for storing authenticated data in db.
			bookmarkApp.factory('loginService', ['$resource', function($resource){
				return $resource('/auth/login', {}, {
				 doLogin: {
				 			   method: 'POST'
				 		  }
				  });
			}]);
});