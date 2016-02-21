define(['app'],
		function(bookmarkApp){
			
			var _self = this;
			'use strict';

		bookmarkApp.factory('feedFactory', function(){
					var feedFactory = [];
					feedFactory.setFeedObj = function(obj){
						feedFactory.push({
		                    	id : obj['id'],
		                    	message : obj['message'] || " ",
		                    	name : obj['name'] || " ",
		                    	picture : obj['picture'] || " ",
		                    	from : obj['from'] || " ",
		                    	likes : obj['likes'] || 0,
		                    	publishedOn : (new Date(obj['publishedOn'].toString())).toDateString() || " ",
		                    	isFBPost : obj['isFBPost']
		                    });
					}
					feedFactory.clearFeedObj = function(){
						feedFactory = [];
					}
					feedFactory.getFeedObj = function(){
						return feedFactory;
					}

					return feedFactory;
				});

		// Defining login facory named as loginService returning login resource for storing authenticated data in db.
		bookmarkApp.factory('feedService', ['$resource', function($resource){
				return $resource('/api/feeds', {}, {
				 	saveFeeds: {
				 			   method: 'POST'
				 		  },
				 	getFeeds: {
						  			method: 'GET',
						  			isArray: false
						  		}
				  });
			}]);
});