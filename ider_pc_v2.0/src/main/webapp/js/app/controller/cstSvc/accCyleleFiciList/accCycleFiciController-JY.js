'use strict';
define(function(require) {

	var webApp = require('app');
	//账户周期金融信息
	webApp.controller('accCycleFiciListCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.isShow = false;
		
		// 重置
		$scope.reset = function() {
			$scope.queryAccountForm={};
			$scope.isShow = false;
		};
		
		
		//查询按钮，查询账户列表
		$scope.searchAccount = function(){
			$scope.idNumber = document.getElementById('idNumber').value;
			$scope.externalIdentificationNo = document.getElementById('externalIdentificationNoId').value;
			if(($scope.queryAccountForm.idNumber == null || $scope.queryAccountForm.idNumber == undefined || $scope.queryAccountForm.idNumber == "") &&
					($scope.queryAccountForm.externalIdentificationNo == null || $scope.queryAccountForm.externalIdentificationNo == undefined || $scope.queryAccountForm.externalIdentificationNo == "")){
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
			$scope.accCycleFiciList.params.accountId = $scope.accInfo.accountId;
			$scope.accCycleFiciList.params.currencyCode = $scope.accInfo.currencyCode;
//			$scope.accCycleFiciList.params.currentCycleNumber = $scope.accInfo.currentCycleNumber;
			$scope.accCycleFiciList.search();
			$scope.safeApply();
			result.cancel();
			$scope.isShow = true;
		};
		$scope.accCycleFiciList = {
				params : {},
				paging : true,
				resource : 'accCycleFiciList.query',
				autoQuery:false,
				callback : function(data) {
				}
			};
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/accCycleFiciList/accCycleFiciDetail.html', $scope.item, {
				title : '账户周期金融明细',
				buttons : ['取消' ],
				size : [ '900px', '450px' ],
				//callbacks : [ $scope.callback ]
			});
		};
	});
});
