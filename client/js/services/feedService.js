define(['app'],
		function(bookmarkApp){
			
			var _self = this;
			'use strict';

	bookmarkApp.factory('feedFactory', function(){
					var feedFactory = [];
					feedFactory.setFeedObj = function(obj){
						feedFactory = obj;
					}
					feedFactory.getFeedObj = function(){
						return feedFactory;
					}

					return feedFactory;
				});
});