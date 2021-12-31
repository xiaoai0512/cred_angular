'use strict';
define(function(require) {

	var webApp = require('app');

	// 科目配置查询
	webApp.controller('newSubConCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {

		//科目配置查询
		$scope.newSubCon = function(){
			jfLayer.success("新增成功");
			$scope.csInf ={};
			$scope.exrtForm.$setPristine();
		};
	});
});