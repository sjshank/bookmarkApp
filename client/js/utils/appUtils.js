	define(['app'],
		function(bookmarkApp){

			var _self = this;
			'use strict';

			bookmarkApp.service('checkResponseService', ['$http', '$rootScope', 'appConstants',
						function($http, $rootScope, appConstants){

				function checkSuccessResponse(data, scope) {
					var success = false;
					if (!data || data == null, data == undefined) {
						scope.errorMsg = appConstants.SERVICE_ERROR;
						scope.hasError = true;
					} else if (data.errMsg) {
						scope.errorMsg = data.errMsg;
						scope.hasError = true;
					} else if (data.validationMsg) {
						scope.errorMsg = data.validationMsg;
						scope.hasError = true;
					} else {
						scope.hasError = false;
						success = true;
					}
					return success;
				};
				function checkErrorResponse(scope) {
					scope.errorMsg = appConstants.SERVICE_ERROR;
					scope.hasError = true;
				};

				this.checkResponse = function(data, scope, flag){
					if (flag) {
						return checkSuccessResponse(data, scope);
					} else{
						checkErrorResponse(scope);
					}
				};

			}]);
});



