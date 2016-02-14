/*
*   Requirejs based configuration. Defining modules and their dependencies.
*/
require.config({
	baseUrl : "/",
	paths : {
		angular : "angular/angular.min",
		anGoogleplus : "angular-google-plus/dist/angular-google-plus.min",
		angularAMD : "angular-amd/angularAMD.min",
		angRoute : "angular-route/angular-route.min",
		angResource : "js/lib/angular-resource",
		angCookies : "angular-cookies/angular-cookies.min",
		controller : "js/controller",
		services  : "js/services",
		app : "js/appBootstrap/app",
		router : "js/appBootstrap/route",
		utils : "js/utils",
		facebook: 'js/lib/fb/all'
	},
	shim : {
        "angular": {
            exports: "angular"
        },
        'anGoogleplus' : {
    		deps: ["angular"],
      		exports: 'googleplus'
    	},
        "angResource": {
            deps: ["angular"],
            exports : "angResource"
        },
        "angCookies": {
            deps: ["angular"],
            exports : "angCookies"
        },
		"angRoute" :  ["angular"],
		"angularAMD" : ["angular"]
		},
		'facebook' : {
      		exports: 'FB'
    	},
	deps: ["app"]
	
});
