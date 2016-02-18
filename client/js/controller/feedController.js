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
			bookmarkApp.controller('feedCtrl', ['$scope', '$rootScope', '$location', 'feedFactory', 'authFactory',
										 'checkResponseService', 'feedService',
					 function($scope, $rootScope, $location, feedFactory, authFactory, checkResponseService, feedService){
				
				$rootScope.showLogout = true;
				$scope.savedFeedQuery = "";
				$scope.showLeftBorder = false;
				$scope.showRightBorder = true;
				$scope.showSuccessAlert = false;
				$scope.hasError = false;
				$scope.userDetails.picUrl = authFactory.getUserObj().isFBLogin ? authFactory.getUserObj().picture.data.url : authFactory.getUserObj().picture


				/*
				* Search feed event handler.
				* This function will fetch all news feed from mentioned page and render all the posts based on user search criteria
				*/
				$scope.searchFeeds = function(vendor){
					$scope.showLeftBorder = false;
					$scope.showRightBorder = true;
					$scope.showSuccessAlert = false;
					$scope.hasError = false;
					$scope.feedList = [];
					feedFactory.clearFeedObj();
				if(vendor === 'fb'){
						FB.api(
						    "/rapidBizApps",
						    {
						        "fields": "posts{id,message,name,picture,story,created_time}"
						    },
						    function (response) {
						    	if (response && !response.error) {
						    		if(typeof response.posts != undefined || response.posts !== ""){
							       		$scope.feedList = getFilteredFeed(response.posts.data, $scope, feedFactory);
							       		if($scope.feedList.length < 1){
							       			$scope.isDisabled = false;
							       			$scope.hasError = true;
			                           		$scope.errorMsg = "No records found.";
							       		}
							       		$scope.$apply();
							       		
							       	}else{
							       		$scope.isDisabled = false;
							       		$scope.hasError = true;
			                            $scope.errorMsg = "No records found.";
							       	}
							     } else {
							     		$scope.hasError = true;
			                            $scope.errorMsg = "Service is temporarily unavailable";
							    }
						    });
					}else{
						//TO-DO
						$scope.hasError = true;
			            $scope.errorMsg = "Service is temporarily unavailable";
					}
				};

				$scope.saveFeeds = function(event){
					$scope.showSuccessAlert = false;
					$scope.hasError = false;
					if(feedFactory.getFeedObj().length < 1){
						return;
					}
					
					feedService.saveFeeds(
                        {
                           feeds : feedFactory.getFeedObj(),
                           userObj : authFactory.getUserObj()
                        }).$promise.then(function(response){
                            if(checkResponseService.checkResponse(response, $scope, true)){
                               $scope.hasError = false;
                               $scope.showSuccessAlert = true;
                               $scope.successMsg = "News Feed has been saved successfully ";
                        }
                        }, function(err){
                            checkResponseService.checkResponse(err, $scope, false);
                        });

				};

				$scope.searchSavedFeeds = function(event){
					$scope.showLeftBorder = true;
					$scope.showRightBorder = false;
					$scope.showSuccessAlert = false;
					$scope.savedFeedList = [];
					feedService.getFeeds(
                        {
                           searchQuery : $scope.savedFeedQuery
                        }).$promise.then(function(response){
                            if(checkResponseService.checkResponse(response, $scope, true)){
                               
                               if(response.data.length < 1){
                               		$scope.hasError = true;
			                        $scope.errorMsg = "No records found.";
			                        return;
                               }
                               $scope.hasError = false;
                               $scope.savedFeedList = response.data[0].feeds;
                        }
                        }, function(err){
                            checkResponseService.checkResponse(err, $scope, false);
                        });

				};
					
			}]);

		function getFilteredFeed(feeds, $scope, feedFactory){
			if(typeof feeds != undefined || feeds !== ""){
				for(var i = 0; i<= feeds.length - 1; i++){
					if(typeof feeds[i].message !== 'undefined'){
						var feedMessage = feeds[i].message.toLowerCase();
	                    var query = $scope.searchQuery.toLowerCase();
	                    if(feedMessage.indexOf(query) > -1){
		                    feedFactory.setFeedObj(feeds[i]);
		            	} 
		            }
				}
				return feedFactory.getFeedObj(); 
			}else{
				$scope.isDisabled = false;
				$scope.hasError = true;
		        $scope.errorMsg = "No records found.";
			}
		}
});

