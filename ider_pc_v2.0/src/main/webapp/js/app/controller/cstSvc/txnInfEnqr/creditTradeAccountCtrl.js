'use strict';
define(function(require) {

	var webApp = require('app');

	//require('../../cstSvc/txnInfEnqr/txnCgyAvyLogEnqrController.js');
	
	//信贷交易账户信息
	webApp.controller('creditTradeAccountCtrl', function($scope, $stateParams,lodinDataService,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.isShowCreditTrade = false;
	
		
		//信贷交易账户信息列表
		$scope.creditTradeList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'creditTradeAccount.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
		
		//查询
		$scope.checkInfo = function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			console.log($scope.itemInf);
			$scope.modal('/cstSvc/txnInfEnqr/viewCreditTradeInfo.html', $scope.itemInf, {
				title : '信贷交易账户明细',
				buttons : [ '提前结清','关闭' ],
				size : [ '900px', '500px' ],
				callbacks : [$scope.sureHandle]
			});
		};
		
		//确定提前结清
		$scope.sureHandle = function(result) {
			console.log(result);
			if (!result.scope.billSummList.validCheck()) {
				return;
            }
            $scope.safeApply();
			result.cancel();
			$scope.isShowBillingInfo = false;
			$scope.isShowbillStageInfo =true;
			$scope.billStageInfo = result.scope.billSummList.checkedList();
			if($scope.billStageInfo.currencyCode == "156"){
				$scope.billStageInfo.currencyCodeTrans = "人民币";
			}else if($scope.billStageInfo.currencyCode == "840") {
				$scope.billStageInfo.currencyCodeTrans = "美元";
			}
			
			$scope.creditTradeList.search();
		
		};
		
	});
	
	//交易明细查询
	webApp.controller('viewCreditTradeInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				currencyCode: $scope.itemDetailInf.currencyCode ,
				billDate: $scope.itemDetailInf.billDate ,
				businessProgramNo: $scope.itemDetailInf.businessProgramNo ,
				productObjectCode: $scope.itemDetailInf.productObjectCode ,
				businessTypeCode: $scope.itemDetailInf.businessTypeCode ,
				customerNo: $scope.itemDetailInf.customerNo ,
				currentCycleNumber: $scope.itemDetailInf.currentCycleNumber 
				
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'creditTradeAccount.queryDetail',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
});
