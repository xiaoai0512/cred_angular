'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('acbaUnitListCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.accountInfTrue = false;
		$scope.isShow = false;
		//重置
		$scope.reset = function() {
			$scope.queryAccountForm={};
			$scope.accountInfTrue = false;
			$scope.isShow = false;
		};
		//查询按钮，查询账户列表
		$scope.searchAccount = function(){
			$scope.idNumber = document.getElementById('idNumber').value;
			$scope.externalIdentificationNo = document.getElementById('externalIdentificationNoId').value;
			if(($scope.queryAccountForm.idNumber== null || $scope.queryAccountForm.idNumber== undefined || $scope.queryAccountForm.idNumber == "") && ($scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == "")){
				jfLayer.fail("请输入证件号码、外部识别号任一查询条件");
			}else{
				$scope.modal('/cstSvc/acbaUnitList/accountList.html', $scope.queryAccountForm, {
					title : '账务选择',
					buttons : ['确认','取消' ],
					size : [ '1100px', '350px' ],
					callbacks : [ $scope.callback ]
				});
			}
		};
		$scope.callback = function(result){
			$scope.accInfo = result.scope.itemList.checkedList();
			$scope.queryTimeBalance($scope.accInfo);
			$scope.balObcList.params.accountId = $scope.accInfo.accountId;
			$scope.balObcList.params.currencyCode = $scope.accInfo.currencyCode;
			$scope.balObcList.search();
			$scope.isShow = true;
			$scope.safeApply();
			result.cancel();
		};
		//查询实时余额
		$scope.queryTimeBalance = function(item){
			console.log(item);
			$scope.balanceParams = {};
			$scope.balanceParams.accountId	 = item.accountId;
			$scope.balanceParams.currencyCode	 = item.currencyCode;
			$scope.balanceParams.authDataSynFlag = "1";
			$scope.balanceParams.customerNo = item.customerNo;
			console.log($scope.balanceParams);
			jfRest.request('acbaUnitList', 'queryBalance', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					console.log("accountId:"+data.returnData.rows[0].accountId);
					$scope.accountId = data.returnData.rows[0].accountId;
					$scope.totalBalance = data.returnData.rows[0].totalBalance;
					$scope.currPrincipalBalance = data.returnData.rows[0].currPrincipalBalance;
					$scope.billPrincipalBalance = data.returnData.rows[0].billPrincipalBalance;
					$scope.currInterestBalance = data.returnData.rows[0].currInterestBalance;
					$scope.billInterestBalance = data.returnData.rows[0].billInterestBalance;
					$scope.currCostBalance = data.returnData.rows[0].currCostBalance;
					$scope.billCostBalance = data.returnData.rows[0].billCostBalance;
				}
			});
		};
		$scope.balObcList = {
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.balanceTypeArray = [{id:"P",name:"本金"},{id:"I",name:"利息"},{id:"F",name:"费用"}];
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/acbaDtlEnqr.html', $scope.item, {
				title : '余额单元明细',
				buttons : ['取消' ],
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
	});
});
