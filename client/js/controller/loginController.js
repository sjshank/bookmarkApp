define(['app',
        'facebook',
        'services/loginService',
        'utils/appUtils',
        'utils/appConstants'],
        function(bookmarkApp,
                 facebook,
                 loginService,
                 appUtils,
                 appConstants) {

            var _self = this;
            'use strict';

            /*
            *   Defining Login controller which will handle facebook/google+ login and based on authentication result, 
            *   user basic info  will be saved in mongodb.
            */

            bookmarkApp.controller('loginCtrl', ['$scope', '$rootScope', '$location', 'authFactory', 'GooglePlus',
                                     '$cookieStore', 'loginService', 'checkResponseService', 'appConstants',
                                 function($scope, $rootScope, $location, authFactory, GooglePlus, $cookieStore,
                                             loginService, checkResponseService, appConstants){
               
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


                 $scope.signInCallback = function(authResult) {
                   if(authResult['status']['signed_in'])
                    {
                        authFactory.setToken(authResult.access_token);
                        var request = gapi.client.plus.people.get(
                        {
                            'userId': 'me'
                        });
                        request.execute(function (response)
                        {
                            if(response.name){    
                                var userDetails = {
                                    id : response.id || " ",
                                    name : response['displayName'],
                                    first_name : response['name']['givenName'],
                                    last_name : response['name']['familyName'],
                                    picture : response['image']['url'],
                                    email : response['emails'][0]['value']
                                }
                                userDetails.isFBLogin = false;
                                authFactory.setUserObj(userDetails);
                                processLogin(authFactory, loginService, $scope, $rootScope, $location,checkResponseService);
                            }else{
                                $scope.hasError = true;
                                $scope.errorMsg = "Not authorized to access. Please log in."
                            }
                        });
                    }else{
                            $scope.hasError = true;
                            $scope.errorMsg = "Not authorized to access. Please log in."
                    }
                };

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
                                                    response.isFBLogin = true;
                                                    authFactory.setUserObj(response);
                                                    authFactory.setToken(FB.getAuthResponse().accessToken);
                                                    processLogin(authFactory, loginService, $scope, $rootScope, $location,checkResponseService);
                                                   
                                            });
                                    }
                                    else if (response.authResponse && response.status === 'not_authorized'){
                                            $scope.hasError = true;
                                            $scope.errorMsg = "Not authorized to access. Please log in."
                                    } 
                                });
                            }else{
                                $location.path('/feed');
                            }
                        }else{

                            gapi.auth.signIn({
                                'callback': $scope.signInCallback, // Function handling the callback.
                                'clientid': '915767291352-ecpictdg9a7v815i2k1l3rmcsr7op8qd.apps.googleusercontent.com',
                                'requestvisibleactions': 'http://schemas.google.com/AddActivity',
                                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                                'cookiepolicy': 'single_host_origin'
                            });
                        }
                    }catch(e){
                        console.log('Exception occurred while logging');
                    }
                };
        }]);

                // private function to process authenticated login data and store in database
                function processLogin(authFactory, loginService, $scope, $rootScope, $location, checkResponseService){
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