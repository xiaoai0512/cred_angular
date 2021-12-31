'use strict';
define(function(require) {
	var webApp = require('app');
	//VISA调单申请及维护appFormVisaQueryCtrl
	webApp.controller('appFormVisaQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader,$timeout) {
		$scope.isShow = false;
		$scope.appFormVisaQueryTable = {};
		$scope.typeArray = [{name : "人工",id : '0'}, {name : "自动",id : '1'}];
		$scope.typeArray1 = [{name : "人工",id : '0'}, {name : "自动",id : '1'}];
		$scope.typeArray2 = [{name : "新增",id : 'N'}, {name : "确认",id : 'C'}, {name : "已经发出",id : 'O'}];
		$scope.typeArray3 = [{name : "确认",id : 'C'}];
		//重置
		$scope.refact = function() {
			$scope.appFormVisaQueryTable.params={};
			$scope.isShow = false;
		};
	    $scope.queryitemList = function(){
			if(($scope.appFormVisaQueryTable.params.idNumber == "" || $scope.appFormVisaQueryTable.params.idNumber == undefined) && ($scope.appFormVisaQueryTable.params.externalIdentificationNo == "" || $scope.appFormVisaQueryTable.params.externalIdentificationNo == undefined)){
				jfLayer.fail("请输入任一查询条件");

			}else{
				$scope.isShow = true;
				$scope.appFormVisaQueryTable.search();
			}
		};
		$scope.appFormVisaQueryTable = {
//				checkType : 'radio',
				params : {
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'appVisa.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
		};
		//查询
		$scope.viewAppFormInf = function(event) {
			$scope.appFormInf = $.parseJSON(JSON.stringify(event));
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/applicationForm/checkApplicationFormVisa.html', $scope.appFormInf, {
				title : ('VISA调单申请查询页面'),
				buttons : [ "关闭" ],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//维护
		$scope.updateAppFormInf = function(event) {
			$scope.appFormInf = $.parseJSON(JSON.stringify(event));
			if($scope.appFormInf.retrievalStatus == "C" || $scope.appFormInf.retrievalStatus == "O"){
				jfLayer.fail("改调单申请不允许修改");
				return;
			}
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/applicationForm/updateApplicationFormVisa.html', $scope.appFormInf, {
				title : ('VISA调单申请维护页面'),
				buttons : [ "确认","关闭" ],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.saveConfirmAppForm]
			});
		};
		//保存
		$scope.saveConfirmAppForm = function (result){
			console.log($scope.appFormInf.retrievalStatus);
			if($scope.appFormInf.requestReasonCode == null || $scope.appFormInf.requestReasonCode == ""){
				jfLayer.fail("请输入请求原因代码");
			}else if($scope.appFormInf.retrievalStatus == null || $scope.appFormInf.retrievalStatus == "" ||  $scope.appFormInf.retrievalStatus == "N"){
				jfLayer.fail("请选择调单状态");
			}else{
				$scope.parm = $scope.appFormInf;
				jfRest.request('appVisa', 'update', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success("保存成功");
						$scope.safeApply();
						result.cancel();
						$scope.appFormVisaQueryTable.search();
					}
				});
			}
		};
	});
	//查询VISA调单申请
	webApp.controller('checkApplicationFormVisaCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	});
	//维护VISA调单申请
	webApp.controller('updateApplicationFormVisaCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	});
});