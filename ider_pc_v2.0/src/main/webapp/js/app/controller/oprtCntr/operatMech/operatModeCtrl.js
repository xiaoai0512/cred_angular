'use strict';
define(function(require) {
	var webApp = require('app');
	//运营模式
	webApp.controller('operatModeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyArr = [{name:"人民币",id:"CNY"},{name:"美元",id:"USD"},{name:"欧元",id:"978"}];//
		//保存运营模式
		$scope.saveOperatMode = function(){
			$scope.operatModeParams=$scope.operatMode;
			jfRest.request('operatMode','save', $scope.operatModeParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功") ;
					$scope.operatMode = {};
					$scope.balanceForm.$setPristine();
				}
			});
		};
	});
});
