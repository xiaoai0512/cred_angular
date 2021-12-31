'use strict';
define(function(require) {
	var webApp = require('app');
	//消费信贷申请
	webApp.controller('consumerLoanApplyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.loanApplyDiv = false;
		$scope.queryParams = {};
		$scope.cstmerInf = {};//客户信息
		//查询按钮,弹窗
		$scope.searchHandle = function(){
			//查询客户基本信息
			jfRest.request('cstInfQuery', 'queryInf', $scope.queryParams).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.cstmerInf.customerName = data.returnData.rows[0].customerName;//客户姓名
					$scope.cstmerInf.customerNo = data.returnData.rows[0].customerNo;//客户代码
					$scope.cstmerInf.idNumber = data.returnData.rows[0].idNumber;//客户证件号码
					$scope.modal('/stage/layerProList.html', $scope.queryParams, {
						title : '产品列表',
						buttons : ['确认','取消' ],
						size : [ '1100px', '350px' ],
						callbacks : [ $scope.callback ]
					});
				}
			});
		};
		//重置
		$scope.reset  = function(){
			$scope. loanApplyDiv = false;
			$scope.queryParams = {};
		};
		$scope.cstproInf = {}; //产品信息
		$scope.callback = function(result){
			$scope.loanApplyDiv = true;
			$scope.proInfo = result.scope.proList.checkedList();
			$scope.cstproInf.productObjectCode = $scope.proInfo.productObjectCode;
			$scope.cstproInf.productDesc = $scope.proInfo.productDesc;
			$scope.safeApply();
			result.cancel();
		};
		//确认申请
		$scope.sureApply = function(){
			jfRest.request('consumerCredit', 'sureApply', $scope.proInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("申请成功！");
				}
			});
		};
	});
	//產品列表信息
	webApp.controller('layerProlistCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.proList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"idNumber":$scope.queryParams.idNumber,
				},
				paging : true,
				resource : 'consumerCredit.queryProList',
				callback : function(data) {
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
	});
});
