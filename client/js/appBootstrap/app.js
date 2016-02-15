
define(['angular',
        'angRoute',
        'angularAMD',
        'angResource',
        'router',
        'utils/appConstants',
        'utils/appFilters',
        'utils/auth',
        'anGoogleplus',
        'angCookies'],
        function(angular,
                 angRoute,
                 angularAMD,
                 angResource,
                 router,
                 appConstants,
                 appFilters,
                 auth,
                 anGoogleplus,
                 angCookies) {

        var _self = this;
        'use strict';

        // Creating apllication module and defining dependencies
        var webApp = angular.module("bookmarkApp", ["ngRoute", "ngResource", "googleplus", "ngCookies"], function($httpProvider){});
        router(webApp); // Defining routing
        auth(webApp);   // Authentication module. Cookies handler
        appConstants(webApp);   // Defining all application constants
        appFilters(webApp);     // Defining all custom app filters

        // Configuring Googleplus login provider
        webApp.config(['GooglePlusProvider', function(GooglePlusProvider) {
                GooglePlusProvider.init({
                        clientId: '915767291352-ecpictdg9a7v815i2k1l3rmcsr7op8qd.apps.googleusercontent.com',
                        apiKey: 'AIzaSyCEW06Qv-mD1RRswAgwVqmMSEfuhGT5MVk'
                 });
        }]);

        webApp.filter('feedFilter', ['$rootScope','$scope', function($rootScope, $scope) {
                                                return function(input) {
                                                        angular.forEach(input, function(feed) {
                                                                if(feed && feed.message){
                                                                        var feedMessage = feed.message.toLowerCase();
                                                                        var query = $rootScope.feedQuery.toLowerCase();
                                                                        if(feedMessage.indexOf(query) > -1){
                                                                                console.log(feed);
                                                                                $scope.$apply();
                                                                                return feed;
                                                                        }                                           
                                                                }
                                                        });
                                                };
                                        }]);

        //Bootstrapping application using AngularAMD
        return angularAMD.bootstrap(webApp);
});