define(['angular',
		'app',
        'facebook',
        'services/feedService',
        'utils/appUtils',
        'utils/appFilters'],
        function(angular,
        		 bookmarkApp,
                 facebook,
                 feedService,
                 appUtils,
                 appFilters)  {

        	var _self = this;
			'use strict';

			/*
			*	News Feed controller for handling request of searching and saving feeds from Facebook/Google+ page.
			*/
			bookmarkApp.controller('feedCtrl', ['$scope', '$rootScope', '$location', 'feedFactory', 'authFactory', 'checkResponseService',
					 function($scope, $rootScope, $location, feedFactory, authFactory, checkResponseService){
				
		
				$scope.searchQuery = "";
				$rootScope.showLogout = true;
				$scope.userDetails.picUrl = $rootScope.isFBLogin ? authFactory.getUserObj().picture.data.url : authFactory.getUserObj().picture

				/*
				* Search feed event handler.
				* This function will fetch all news feed from mentioned page and render all the posts based on user search criteria
				*/
				$scope.searchFeeds = function(){

					$scope.feedFilter = function(value) {
							angular.forEach(value, function(feed) {
							if(feed && feed.message){
								var feedMessage = feed.message.toLowerCase();
								var query = $rootScope.feedQuery.toLowerCase();
								if(feedMessage.indexOf(query) > -1){
									return feed;
								}					    
							}
						});
					};


					$rootScope.feedQuery = $scope.searchQuery;
					$scope.feedList = [];
					FB.api(
					    "/rapidBizApps",
					    {
					        "fields": "posts{id,message,name,picture,story,created_time}"
					    },
					    function (response) {
					    	if (response && !response.error) {
						       		$scope.feedList = response.posts.data;
						       		$scope.$apply();
						     } else {
							    	$scope.hasError = true;
		                            $scope.errorMsg = "Service is temporarily unavailable";
						    }
					    });
				};
			}]);
});

