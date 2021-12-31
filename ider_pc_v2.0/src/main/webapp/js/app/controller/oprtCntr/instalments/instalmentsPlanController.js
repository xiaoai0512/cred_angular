'use strict';
define(function(require) {

	var webApp = require('app');

	//分期计划查询
	webApp.controller('instalmentsPlanCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.txnCgyAvyLogEnqrInfo = {
				
		};
		
		$scope.instalPlanTable = {
//			checkType : 'radio',
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalPlan.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.instalmentsPlanDetailInfo = function(event){
			$scope.stageId = event;
			$scope.modal('/oprtCntr/instalments/instalmentsPlanDetail.html', $scope.stageId, {
				title : '分期计划明细',
				buttons : [ '关闭' ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
		
	});
	
	//分期计划明细
	webApp.controller('instalmentsPlanDetailCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.paramss ={
			"stageId":$scope.stageId
		};
		
		jfRest.request('instalPlanDetail', 'query', $scope.paramss)
		.then(function(data) {
			if (data.returnCode == '000000') {
				$scope.instalPlanDetailData = JSON.parse(data.returnData);
				if(typeof($scope.instalPlanDetailData) != undefined){
					$scope.instalPlanDetailTable = $scope.instalPlanDetailData.rows;
				}
			}
		});
		
		// 页面弹出框事件(弹出页面)
		$scope.rateOperationInfo = function(event){
			$scope.rateOperaInfo = event;
			$scope.modal('/oprtCntr/instalments/rateOperation.html', $scope.rateOperaInfo, {
				title : '差异化费率维护',
				buttons : [ '确认' , '关闭'],
				size : [ '1000px', '450px' ],
				callbacks : []
			});
		};
		
	});
	
	//差异化费率维护
	webApp.controller('rateOperationCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		
		if(typeof($scope.rateOperaInfo) != undefined){
			$scope.rateOperaTable = $scope.rateOperaInfo.rows;
		}
		
		// 页面弹出框事件(弹出页面)
		$scope.choiceProductInfo = function(event){
			$scope.productInfo = event;
			$scope.modal('/oprtCntr/instalments/choiceProduct.html', $scope.productInfo, {
				title : '分配产品',
				buttons : [ '确认' , '关闭'],
				size : [ '1000px', '300px' ],
				callbacks : []
			});
		};
		
	});
	
	//产品选择
	webApp.controller('choiceProductCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		
		
	});
});
