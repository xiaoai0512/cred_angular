'use strict';
define(function(require) {

	var webApp = require('app');

	webApp.controller('budOutQueryCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_budOutQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfo = false;
		$scope.topParams = {};
		
		//查询详情事件
		$scope.selectList = function() {
			
			if($scope.topParams.idNumber){
				$scope.topParams.idType	= '7';

}
            if( ($scope.topParams.idNumber == "" || $scope.topParams.idNumber == null || $scope.topParams.idNumber == undefined) &&
					($scope.topParams.billDay == "" || $scope.topParams.billDay == null || $scope.topParams.billDay == undefined)){
				$scope.resultInfo = false;
				jfLayer.alert(T.T('F00076'));//"输入查询条件"

			}else {
				if($scope.topParams.idNumber){
					if($scope.topParams.billDay == '' || $scope.topParams.billDay == null || $scope.topParams.billDay == undefined){
						$scope.resultInfo = false;
						jfLayer.alert(T.T('GWJ800001'));  //'请输入账单日期');
						
					}else {
						$scope.resultInfo = true;
						$scope.unitBillOutList.params = $.extend($scope.unitBillOutList.params,$scope.topParams);
						$scope.unitBillOutList.search();
					}
				}else if ($scope.topParams.billDay){
					if($scope.topParams.budgetOrgCode == '' || $scope.topParams.budgetOrgCode == null || $scope.topParams.budgetOrgCode == undefined){
						$scope.resultInfo = false;
						jfLayer.alert(T.T('GWJ800002'));  //'请输入预算单位！');//"输入查询条件"
						
					}else {
						$scope.resultInfo = true;
						$scope.unitBillOutList.params = $.extend($scope.unitBillOutList.params,$scope.topParams);
						$scope.unitBillOutList.search();
					}
				}else {
					$scope.resultInfo = true;
					
					$scope.unitBillOutList.params = $.extend($scope.unitBillOutList.params,$scope.topParams);
					$scope.unitBillOutList.search();
					
				}
			}
				
			
			
		};
		
		
		$scope.peoCollectInfo = {};//个人公务卡账单汇总信息
		$scope.unitCollectInfo = {};//单位公务卡账单汇总信息
		$scope.unitBillOutList = {
				autoQuery:false,
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'billManages.querybudOut',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
					if(data.returnCode == '000000'){
						
						$scope.resultInfo = true;
						if(data.returnData != null || data.returnData != '' || data.returnData != undefined){
							if(!data.returnData.rows || data.returnData.rows.length == 0){
								data.returnData.rows = [];
							}else {
								$scope.peoCollectInfo = data.returnData.obj.peoCollectInfo;
								$scope.unitCollectInfo = data.returnData.obj.unitCollectInfo;
								
							}
						}else {
							data.returnData.rows = [];
						}
						
						
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');//'操作失败！'
						jfLayer.fail(returnMsg);
						$scope.resultInfo = false;
					}
				}
			};
		
		//查询函数
		$scope.checkResult = function(){
			
			
		};
		
		
		//关闭事件
		$scope.closeInfo = function(){
			$scope.resultInfo = false;
			$scope.item = "";
			//$scope.customerNo = "";
			$scope.idNumber = "";
			$scope.budgetOrgCode = "";
			$scope.idType = "";
			$scope.operationModeInfo = "";
			$scope.idTypeInfo = "";
			$scope.customerTypeInfo = "";
			$scope.paymentMarkInfo = "";
			$scope.customerStatusInfo = "";
			$scope.customerBalanceStatusInfo = "";
			$scope.customerAccountingStatusInfo = "";
		}
	});

});
