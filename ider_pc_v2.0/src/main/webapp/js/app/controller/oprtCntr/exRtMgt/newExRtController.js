'use strict';
define(function(require) {
	var webApp = require('app');
	 //新增汇率
	webApp.controller('newExRtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.newExRtInfo = function(){
				jfRest.request('newCuRt', 'saveCurrencyRate', $scope.csInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success("保存成功") ;
						$scope.csInf = {};
					}
				});
		}
	});
});
