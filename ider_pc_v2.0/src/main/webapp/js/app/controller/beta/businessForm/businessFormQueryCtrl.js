'use strict';
define(function(require) {
	var webApp = require('app');
	//业务形态查询及维护
	webApp.controller('businessFormQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.businessPatternArr = [{name:"R1",id:"R1"},{name:"R2",id:"R2"},{name:"S1",id:"S1"},{name:"S2",id:"S2"}];
		$scope.businessFormList = {
//			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessForm.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkBusinessForm = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.businessFormItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/businessForm/viewBusinessForm.html', $scope.businessFormItem, {
				title : '业务形态信息',
				buttons : [  '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateBusinessForm= function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.businessFormItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/businessForm/updateBusinessForm.html', $scope.businessFormItem, {
				title : '修改业务形态信息',
				buttons : [ '确定', '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.saveBlockCodeInf]
			});
		};
		//保存
		$scope.saveBlockCodeInf = function (result){
			console.log(result);
			//$scope.businessFormItem.operationMode = result.scope.updateOperationMode;
			jfRest.request('businessForm', 'update', $scope.businessFormItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功！");
					 $scope.safeApply();
					 result.cancel();
					 $scope.businessFormList.search();
				}
			});
		}
	});
	webApp.controller('viewBusinessFormCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
	});
	webApp.controller('updateBusinessFormCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
	});
});
