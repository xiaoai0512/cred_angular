'use strict';
define(function(require) {
	var webApp = require('app');
	//运营机构
	webApp.controller('operatMechCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//保存运营机构
		$scope.saveOperatMech = function(){
			$scope.operatMechParams=$scope.operatMech;
			console.log($scope.operatMechParams);
			jfRest.request('operatMech','save', $scope.operatMechParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功") ;
					$scope.operatMech = {};
					$scope.balanceForm.$setPristine();
				}
			});
		}
	});
});
