define(['app',
        'facebook',
        'services/loginService',
        'utils/appUtils'],
        function(bookmarkApp,
                 facebook,
                 loginService,
                 appUtils) {

            var _self = this;
            'use strict';

            /*
            *   Defining Login controller which will handle facebook/google+ login and based on authentication result, 
            *   user basic info  will be saved in mongodb.
            */

            bookmarkApp.controller('loginCtrl', ['$scope', '$rootScope', '$location', 'authFactory', 'GooglePlus',
                                     '$cookieStore', 'loginService', 'checkResponseService',
                                 function($scope, $rootScope, $location, authFactory, GooglePlus, $cookieStore,
                                             loginService, checkResponseService){
                console.log("Login controller");
                $scope.hasError = false;
                $rootScope.showLogout = false;

                // Initialize facebook api
                FB.init({
                      appId      : '1551906885119402',
                      status     : true,
                      cookie     : true,
                      xfbml      : true,
                      version    : 'v2.5'
                });

                // Login event handler
                $scope.doLogin = function(vendor){
                    try{
                        if(vendor === 'fb'){
                            //If user selects facebook login
                            if(!FB.getAuthResponse()){
                                FB.login(function(response) {
                                    if (response.authResponse && response.status === 'connected'){

                                           FB.api(
                                                '/me',
                                                'GET',
                                                {"fields":"id,name,picture{url},first_name,last_name,email"},
                                                function(response) {
                                                    authFactory.setUserObj(response);
                                                    $rootScope.isFBLogin = true;
                                                    $rootScope.showLogout = true;
                                                    authFactory.setToken(FB.getAuthResponse().accessToken);
                                                    processLogin(authFactory, loginService, $scope, $location,checkResponseService);
                                                   
                                            });
                                    }
                                    else if (response.authResponse && response.status === 'not_authorized'){
                                            $scope.hasError = true;
                                            $scope.errorMsg = "Not authorized to access. Please log in."
                                    }else{
                                            $scope.hasError = true;
                                            $scope.errorMsg = "Service is temporarily unavailable."
                                    }  
                                });
                            }else{
                                $location.path('/feed');
                            }
                        }else{
                            //If user selects google+ login
                                GooglePlus.login().then(function (authResult) {
                                            if(authResult && authResult.status.signed_in){
                                                authFactory.setToken(authResult.access_token);
                                                GooglePlus.getUser().then(function (user) {
                                                    authFactory.setUserObj(user);
                                                    $rootScope.isFBLogin = false;
                                                    $rootScope.showLogout = true;
                                                    processLogin(authFactory, loginService, $scope, $location, checkResponseService);
                                                });
                                            } else if (authResult && !authResult.status.signed_in){
                                                $scope.hasError = true;
                                                $scope.errorMsg = "Not authorized to access. Please log in."
                                            }else{
                                                $scope.hasError = true;
                                                $scope.errorMsg = "Service is temporarily unavailable."
                                            } 
                                        }, function (err) {
                                            $scope.hasError = true;
                                            $scope.errorMsg = "Service is temporarily unavailable."
                                });
                        }
                    }catch(e){
                        console.log('Exception occurred while logging');
                    }
                };
        }]);

    // private function to process authenticated login data and store in database
    function processLogin(authFactory, loginService, $scope, $location, checkResponseService){
        loginService.doLogin(
                        {
                           userObj : authFactory.getUserObj(),
                           token : authFactory.getToken()
                        }).$promise.then(function(response){
                            if(checkResponseService.checkResponse(response, $scope, true)){
                               $scope.hasError = false;
                                $location.path('/feed');
                               
                        }
                        }, function(err){
                            checkResponseService.checkResponse(err, $scope, false);
                        });
    };

});