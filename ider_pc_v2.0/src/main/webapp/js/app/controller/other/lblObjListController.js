'use strict';
define(function(require) {
	var webApp = require('app');
	// 标签对象列表查询
	webApp.controller('lblObjListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.priceAreaArray = [{name : 'D-差异化' ,id : 'D'},{name : 'P-个性化' ,id : 'P'},{name : 'A-活动' ,id : 'A'}] ;
		$scope.lblObjList = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lblObjList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checkLblObjDtlInf = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/other/lblObjList/checkLblObjDtlInf.html', $scope.item, {
				title : '对象标签详细信息',
				buttons : [ '确定','关闭' ],
				size : [ '950px', '410px' ],
				callbacks : [ $scope.selectCorporat ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.selectCorporat = function(result) {
			$scope.paramss = result.scope.checkLblObjList;
			$scope.paramss.evenId = "COS.UP.02.0026";
			jfRest.request('lblObjList', 'updatePricingLabel', $scope.paramss)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功");
					$scope.safeApply();
					result.cancel();
					$scope.lblObjList.search();
				}
			});
		};
	});
	webApp.controller('checklblObjListCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.priceAreaArray = [{name : 'D-差异化' ,id : 'D'},{name : 'P-个性化' ,id : 'P'},{name : 'A-活动' ,id : 'A'}] ;
		$scope.priceModelArray = [{name : 'I-继承' ,id : 'I'},{name : 'O-覆盖' ,id : 'O'}] ;
		$scope.valTypArray = [{name : 'D-数值' ,id : 'D'},{name : 'P-百分比' ,id : 'P'}] ;
		$scope.checkLblObjList = $scope.item;
	});
});
