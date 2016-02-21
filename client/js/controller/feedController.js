define(['angular',
		'app',
        'facebook',
        'services/feedService',
        'utils/appUtils',
        'utils/appFilters',
        'utils/appDirectives',
        'utils/appConstants'],
        function(angular,
        		 bookmarkApp,
                 facebook,
                 feedService,
                 appUtils,
                 appFilters,
                 appDirectives,
                 appConstants)  {

        	var _self = this;
			'use strict';
			var activityFeeds = [];

			/*
			*	News Feed controller for handling request of searching and saving feeds from Facebook/Google+ page.
			*/
			bookmarkApp.controller('feedCtrl', ['$scope', '$rootScope', '$location', 'feedFactory', 'authFactory',
										 'checkResponseService', 'feedService', 'appConstants',
					 function($scope, $rootScope, $location, feedFactory, authFactory, checkResponseService, feedService, appConstants){
				
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
				$scope.searchFeeds = function(){
					$scope.showLeftBorder = false;
					$scope.showRightBorder = true;
					$scope.showSuccessAlert = false;
					$scope.hasError = false;
					$scope.feedList = [];
					feedFactory.clearFeedObj();

				// Search all public feeds from Facebook social page (rapidBizApps)
				if(authFactory.getUserObj().isFBLogin){
						FB.api(
						    "/rapidBizApps",
						    {
						        "fields": "posts.limit(50){id,message,name,picture,from,likes,created_time}"
						    },
						    function (response) {
						    	if (response && !response.error) {
						    		if(typeof response.posts != undefined || response.posts !== ""){
						    			activityFeeds.push({
							  				id : response.posts.data['id'],
							  				message : response.posts.data['message'],
							  				likes : response.posts.data['likes']['data'].length,
							  				picture : response.posts.data['picture'],
							  				name : response.posts.data['name'],
							  				publishedOn : response.posts.data['created_time'],
							  				from : response.posts.data['from'],
							  				isFBPost : true
						  				});

							       		$scope.feedList = getFilteredFeed(activityFeeds, $scope, feedFactory);
							       		if($scope.feedList.length < 1){
							       			$scope.isDisabled = false;
							       			$scope.hasError = true;
			                           		$scope.errorMsg = appConstants.NO_RECORDS;
							       		}
							       		$scope.$apply();
							       		
							       	}else{
							       		$scope.isDisabled = false;
							       		$scope.hasError = true;
			                            $scope.errorMsg = appConstants.NO_RECORDS;
							       	}
							     } else {
							     		$scope.hasError = true;
			                            $scope.errorMsg = appConstants.SERVICE_ERROR;
							    }
						    });
					}else{
					// Search all public feeds from Google+ social page (NodeJSFan)
						var request = gapi.client.plus.activities.list({
							'userId': '+NodeJSFan',
							'collection' : 'public',
							'fields' : 'items(actor(clientSpecificActorInfo,displayName,id,image,name,url),id,object,published)'
						});

						request.execute(function(response) {
							activityFeeds = [];
						  	if(response){
						  		response.items.forEach(function(val, index, item){
						  			var picURL  = "";
						  			var n = "";
						  			if(val['object']['attachments'] && val['object']['attachments'][0]
						  				&& val['object']['attachments'][0]['image'])
						  			{
						  				picURL = val['object']['attachments'][0]['image']['url']
						  				n = val['object']['attachments'][0]['displayName'];
						  			}
						  			activityFeeds.push({
						  				id : val['id'],
						  				message : val['object']['content'],
						  				likes : val['object']['plusoners']['totalItems'],
						  				picture : picURL,
						  				name : n,
						  				publishedOn : val['published'],
						  				from : val['actor']['displayName'],
						  				isFBPost : false
						  			});
						  		});
						  		$scope.feedList = getFilteredFeed(activityFeeds, $scope, feedFactory);
						  		if($scope.feedList.length < 1){
							       			$scope.isDisabled = false;
							       			$scope.hasError = true;
			                           		$scope.errorMsg = appConstants.NO_RECORDS;
							       	}
							    $scope.$apply();
						  	}else{
						  		$scope.hasError = true;
			                    $scope.errorMsg = appConstants.SERVICE_ERROR;
						  	}
						});						
					}
				};

				// Save searched feeds, from social page, into mongodb 
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

				// Search feeds mongodb and display on screen
				$scope.searchSavedFeeds = function(event){
					$scope.showLeftBorder = true;
					$scope.showRightBorder = false;
					$scope.showSuccessAlert = false;
					$scope.savedFeedList = [];
					feedService.getFeeds(
                        {
                           searchQuery : $scope.savedFeedQuery,
                           isFBPost : authFactory.getUserObj().isFBLogin
                        }).$promise.then(function(response){
                            if(checkResponseService.checkResponse(response, $scope, true)){
                               
                               if(response.data.length < 1){
                               		$scope.hasError = true;
			                        $scope.errorMsg = appConstants.NO_RECORDS;
			                        return;
                               }
                               $scope.hasError = false;
                               response.data.forEach(function(val, index, array){
                               		$scope.savedFeedList.push(val['feeds']);
                               	});
                        }
                        }, function(err){
                            checkResponseService.checkResponse(err, $scope, false);
                        });

				};
					
			}]);

		// Registering directive
		appDirectives(bookmarkApp); 

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
		        $scope.errorMsg = appConstants.NO_RECORDS;
			}
		}
});

