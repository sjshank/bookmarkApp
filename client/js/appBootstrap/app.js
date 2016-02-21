
define(['angular',
        'angRoute',
        'angularAMD',
        'angResource',
        'router',
        'utils/appConstants',
        'utils/appFilters',
        'utils/appDirectives',
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
                 appDirectives,
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

        webApp.config(function() {
                gapi.client.setApiKey('AIzaSyA5Xzmf-O9hxw69GFChQSa-1xzwtKGN2aE'); //set your API KEY
                gapi.client.load('plus', 'v1',function(){});
        });

        //Bootstrapping application using AngularAMD
        return angularAMD.bootstrap(webApp);
});