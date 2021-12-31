'use strict';
define(function(require) {

	var webApp = require('app');

	//核算场景
	webApp.controller('accountSceneAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		
		$scope.PCflagArr = [{name : '个人' ,id : 'P'},{name : '公司' ,id : 'C'}] ;
		$scope.tradeStateArray = [{name : '正常' ,id : 'NN'},{name : '拒绝' ,id : 'NR'},{name : '拒绝重入' ,id : 'RN'}] ;
		$scope.accountStateArray = [{name : '正常' ,id : '0'},{name : '非应计' ,id : '1'},{name : '核销' ,id : '2'}] ;
		$scope.assetAttributeArray = [{name : '正常' ,id : '0'},{name : '证券化' ,id : '1'}] ;
		$scope.repayTypeArray = [{name : '正常还款常' ,id : '0'},{name : '购汇还款' ,id : '1'},{name : '约定还款' ,id : '2'}] ;
		$scope.clearSignArray = [{name : '入账币种清算' ,id : '0'},{name : '非入账币种清算' ,id : '1'}] ;
		
		$scope.accountSceneObj ={};
    	// 保存信息事件
		$scope.saveAccountScene = function() {
			console.log($scope.accountSceneObj);
			jfLayer.success("新增成功");
			$scope.accountSceneObj = {};
			$scope.AsaForm.$setPristine();
		
		};
		
	});
	

});
