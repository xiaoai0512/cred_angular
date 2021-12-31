'use strict';
define(function(require) {

	var webApp = require('app');

	//交易类争议交易查询
	webApp.controller('disputedTradeQueryCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_txnCgyAvyLogEnqr');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.isShowDiv =  {};
		$scope.isShowDiv.isShowActivityLogList = false;
		
		
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},
		{name : T.T('PZJ100021'),id : '0'} ];	
		//重置
		$scope.reset = function() {
			$scope.txnCgyAvyLogEnqrTable.params.idNumber = '';
			$scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo = '';
			$scope.txnCgyAvyLogEnqrTable.params.idType= '';
			$scope.txnCgyAvyLogEnqrTable.params.customerNo= '';
			
			$scope.isShowDiv.isShowActivityLogList = false;
		};
		
		$scope.activityLogSearch = function(){
			if(($scope.txnCgyAvyLogEnqrTable.params["idType"] == null || $scope.txnCgyAvyLogEnqrTable.params["idType"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idType"] == '') && 
        			($scope.txnCgyAvyLogEnqrTable.params["idNumber"] == null || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == '')){
				$scope.txnCgyAvyLogEnqrTable.search();
				$scope.isShowDiv.isShowActivityLogList = true;
			}
			else {
				if($scope.txnCgyAvyLogEnqrTable.params["idType"]){
					if($scope.txnCgyAvyLogEnqrTable.params["idNumber"] == null || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowDiv.isShowActivityLogList = false;
					}else {
						$scope.txnCgyAvyLogEnqrTable.search();	
					}
				}else if($scope.txnCgyAvyLogEnqrTable.params["idNumber"]){
					if($scope.txnCgyAvyLogEnqrTable.params["idType"] == null || $scope.txnCgyAvyLogEnqrTable.params["idType"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowDiv.isShowActivityLogList = false;
					}else {
						$scope.txnCgyAvyLogEnqrTable.search();
					}
				}else {
					$scope.txnCgyAvyLogEnqrTable.search();
				}
			}
			
		};
		
		$scope.txnCgyAvyLogEnqrTable = {
			//checkType : 'radio',
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'txnCgyAvyLogEnqr.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShowDiv.isShowActivityLogList = true;
				}else {
					$scope.isShowDiv.isShowActivityLogList = false;
				}
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.checkTxnCgyAvyLogEnqrInfo = function(event){
			$scope.txnCgyAvyLogEnqrInfo = $.parseJSON(JSON.stringify(event));
//			$scope.modal('/cstSvc/txnInfEnqr/checkTxnCgyAvyLogEnqr.html', $scope.txnCgyAvyLogEnqrInfo, {
//				title : T.T('KHJ2400001'),
//				buttons : [ T.T('F00012') ],
//				size : [ '1000px', '580px' ],
//				callbacks : []
//			});
		};
	});
});
