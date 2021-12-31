'use strict';
define(function(require) {

	var webApp = require('app');

	//账户余额对象信息
	webApp.controller('acBaObjInfCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.isShow = false;
		
		// 重置
		$scope.reset = function() {
			$scope.queryAccountBalanceForm={};
			$scope.isShow = false;
		};
		
		//查询按钮，查询账户列表
		$scope.searchAccount = function(){
			
			if(JSON.stringify($scope.queryAccountBalanceForm) == "{}" ||$scope.queryAccountBalanceForm == null 
					|| $scope.queryAccountBalanceForm.idNumber =="" 
						|| $scope.queryAccountBalanceForm.externalIdentificationNo ==""){
				jfLayer.fail("请输入证件号码、外部识别号任一查询条件");
			}else{
				$scope.modal('/cstSvc/acbaUnitList/accountListObj-JY.html', $scope.queryAccountBalanceForm, {
					title : '账务选择',
					buttons : ['确认','取消' ],
					size : [ '1100px', '350px' ],
					callbacks : [ $scope.callback ]
				});
			}
		};
		$scope.callback = function(result){
			$scope.accInfo = result.scope.itemList.checkedList();
			$scope.accBalObjTable.params.accountId = $scope.accInfo.accountId;
			$scope.accBalObjTable.params.currencyCode = $scope.accInfo.currencyCode;
			$scope.accBalObjTable.search();
			$scope.safeApply();
			result.cancel();
			$scope.isShow = true;
		};
		
		$scope.accBalObjTable = {
			params : {},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			autoQuery:false,
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
		
	});
	
	webApp.controller('queryAccountObjCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.itemList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"idNumber":$scope.queryAccountBalanceForm.idNumber,
					"externalIdentificationNo":$scope.queryAccountBalanceForm.externalIdentificationNo,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'accBscInf.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
		
	});
	
});
