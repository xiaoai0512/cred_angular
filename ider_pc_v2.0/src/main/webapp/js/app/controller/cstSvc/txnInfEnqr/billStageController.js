'use strict';
define(function(require) {

	var webApp = require('app');

	//require('../../cstSvc/txnInfEnqr/txnCgyAvyLogEnqrController.js');
	
	//账单分期
	webApp.controller('billStageCtrl', function($scope, $stateParams,lodinDataService,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.isShowBillingInfo = false;
		
		
		lodinDataService.getObject("billStageInf");
		
		//账单信息列表
		$scope.billingInfoList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		//点击查询
		$scope.billSearch = function() {
			if(($scope.billingInfoList.params.idNumber == undefined || $scope.billingInfoList.params.idNumber == "") && 
					($scope.billingInfoList.params.externalIdentificationNo == undefined || $scope.billingInfoList.params.externalIdentificationNo == null || $scope.billingInfoList.params.externalIdentificationNo == "")){
				$scope.isShowBillingInfo = false;
				jfLayer.alert("请输入证件号码/外部识别号查询");
			}else {
				$scope.isShowBillingInfo = true;
				$scope.billingInfoList.search();
			}
		};
		
		
		//查询业务类型级别
		$scope.checkItem = function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			console.log($scope.itemInf);
			$scope.modal('/cstSvc/txnInfEnqr/viewBill.html', $scope.itemInf, {
				title : '账单信息',
				buttons : [ '关闭' ],
				size : [ '900px', '500px' ],
				callbacks : []
			});
		};

	
	});

});
