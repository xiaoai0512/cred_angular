'use strict';
define(function(require) {
	var webApp = require('app');
	// 循环借记交易补录
	webApp.controller('periodTransEntrgCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.rvlDbtTxnSplmtEntrgInfo = {
		};
		$scope.ccy = [{name : '人民币',id : 'CNY'},{name : '美元',id : 'USD'}];
		//交易模式
		$scope.posEntryModeArray = [{name : '普通模式' ,id : '0'},{name : '快捷支付' ,id : '1'},{name : '手机银行' ,id : '2'}] ;
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				type : "period"
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//确认
		$scope.saveRvlDbtTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
			}
			$scope.rvlDbtTxnSplmtEntrgInfo.ecommEventId = $scope.itemList.checkedList().eventNo;
			//$scope.rvlDbtTxnSplmtEntrgInfo.ecommEventId = 'ISS.PT.40.0001';
			//jfRest.request('fncTxnMgt', 'saveRvlDbtTxnSplmtEntrg', $scope.rvlDbtTxnSplmtEntrgInfo).then(function(data) {
			jfRest.request('fncTxnMgt', 'rvlDbtTxnSplmtEntrg', $scope.rvlDbtTxnSplmtEntrgInfo).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success("交易成功");
					 $scope.rvlDbtTxnSplmtEntrgInfo = {};
				}
			});
		}
	});
});
