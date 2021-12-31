'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('businessOverpayment', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/businessOverpayment/i18n_businessOverpayment');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.resultInfo = false;
	//重置
	$scope.reset = function(){
		$scope.idNumber= '';
		$scope.resultInfo = false;
	};
	//公务卡溢缴款转出
	$scope.busCardTransTable = {
			params : {
				idType:'7'
			},
			paging : true,
			resource : 'businessOverpayment.businessPayment',
			autoQuery : false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}else if (data.returnData.obj!= null){
						$scope.customerNo = '';
						$scope.operationMode = '';
						$scope.customerNo = data.returnData.obj.customerNo;
						$scope.operationMode = data.returnData.obj.operationMode;
						console.log($scope.customerNo);
					}
					$scope.resultInfo = true;
				}else {
					$scope.resultInfo = false;
				}
			}
	};
	//查询事件
	$scope.selectList = function() {
		if(!$scope.idNumber){
			jfLayer.fail(T.T('F00076'));   //'请输入查询条件进行查询！');
			$scope.resultInfo = false;
		}
		else{
			$scope.busCardTransTable.params.idNumber = $scope.idNumber;
			$scope.busCardTransTable.search();
		}
	};
	// 页面弹出框事件(弹出页面)
	$scope.viewBusCardTrans = function(event) {
		$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
		$scope.modal('/businessCard/businessOverpayment/layerFinaci.html',$scope.transDetailInfo, {
			title : T.T('GWH900007'),  //'溢缴款转出',
			buttons : [T.T('F00107'), T.T('F00012')],
			size : [ '850px', '330px' ],
			callbacks : [$scope.sureViewBusCardTrans]
		});
	};
	//确定按钮回调函数
	$scope.sureViewBusCardTrans = function(result){
		$scope.currencyInf = {};
		$scope.currencyInf.ecommOverflowTransAmount = result.scope.currencyInf.ecommOverflowTransAmount;
		$scope.currencyInf.ecommTransCurr = $scope.transDetailInfo.currencyCode;
		$scope.currencyInf.ecommCustId = $scope.customerNo;
		$scope.currencyInf.ecommOperMode = $scope.operationMode;
		$scope.currencyInf.ecommOverflowAccountNo=$scope.transDetailInfo.accountId;
		$scope.currencyInf.idNumber = $scope.idNumber;
		$scope.currencyInf.idType ='7';
		jfRest.request('businessOverpayment', 'businessPaymentSure', $scope.currencyInf).then(function(data) {
			if (data.returnCode == '000000') {
				jfLayer.success(T.T('GWJ900001'));   //'转账成功');
				$scope.busCardTransTable.search();
				result.cancel();
				$scope.safeApply();
			}
		});		
	 }	
 });
	webApp.controller('layerFinaciCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/businessOverpayment/i18n_businessOverpayment');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translate.refresh();
		$scope.ectypeArray = [{name : T.T('GWJ900003'),id : '0'},{name : T.T('GWJ900004'),id : '1'}];
		$scope.currencyInf = {};
	});
});
