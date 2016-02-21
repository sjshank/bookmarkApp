define(['angular',
        'facebook'],
		function(angular,
                 facebook){
                 
return function(bookmarkApp){
            var _self = this;
			'use strict';

            //Defining authentication factory for storing cookies. Depends on $cookieStore
			bookmarkApp.factory('authFactory', ['$cookieStore', function($cookieStore){

                var authFact = {};
                authFact.setToken = function(aToken) {
                    $cookieStore.put('token', aToken);
                };
                authFact.getToken = function() {
                    return $cookieStore.get('token');
                };
                authFact.getUserObj = function() {
                    return $cookieStore.get('userObj');
                };
                authFact.setUserObj = function(uObject) {
                    $cookieStore.put('userObj', uObject);
                };
                authFact.clearCookies = function(){
                    try{
                        $cookieStore.remove('userObj');
                        $cookieStore.remove('token');
                    }catch(e){
                        console.log("cookie objects are empty");
                    }
                };

                return authFact;
            }]);

            //Checking if user is authenticated and authorized to access page. If not then redirect to login page
			bookmarkApp.run(['$rootScope', '$location', 'authFactory', function($rootScope, $location, authFactory){

				$rootScope.$on('$routeChangeStart', function(event, next, current){
					try{
                        if(next.$$route.authenticated){
                            var isAuth = authFactory.getToken();
                            if (!isAuth) {
                                $location.path('/');
                            }
                        }

                    }catch(e){
                        console.log("Routing event is not working as expected");
                    }
				});

			}]);

            // Facebook/Google+ Logout implementation
            bookmarkApp.run([ '$rootScope', 'authFactory',
                             '$location', 'GooglePlus',
                            function($rootScope, authFactory, $location, GooglePlus) {
                $rootScope.logout = function(){
                    try{
                        if(authFactory.getUserObj().isFBLogin){
                            FB.logout(function(response) {
                                authFactory.clearCookies();
                                window.location = '#/login';
                            });
                        }else{
                                gapi.auth.signOut();
                                authFactory.clearCookies();
                                window.location = '#/login';
                        }
                    }catch(e){
                        console.log("Unable to logout");
                    }
                };
            }]);
		};
});