define(['angular'],
	function(angular){

  	return function(bookmarkApp){
  		var _self = this;
		'use strict';

		// Directive for convert ISO date into Date String
		 bookmarkApp.directive("ngconvertedDate", function() {
			    return  {
			        link : function(scope, element, attrs, controller) {
			        	var conDate = (new Date(scope.feed.publishedOn)).toDateString();
			        	element.text("Published On :  " + conDate);
			        }
			    };
		});
  	};
});