'use strict';
define(function(require) {
	var webApp = require('app');
	//封锁码建立
	webApp.controller('businessFormEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.bsInf = {};
		//R1、R2、S1、S2
		$scope.businessPatternArr = [{name:"R1",id:"R1"},{name:"R2",id:"R2"},{name:"S1",id:"S1"},{name:"S2",id:"S2"}];//
		//保存
		$scope.saveBsForm = function(){
			jfRest.request('businessForm','save', $scope.bsInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功") ;
					$scope.bsInf = {};
					$scope.bsFormInfForm.$setPristine();
				}
			});
		}
	});
});
