'use strict';
define(function(require) {

	var webApp = require('app');

	webApp.controller('custInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {

	});

	webApp.controller('financingInfoCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {

	});

	// 交易账户信息
	webApp.controller('tnAcInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.tnAcListTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstCprsvInfEnqr.queryTnAcList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data.data;
			}
		};

		// 明细
		$scope.detailCstCprsvInfEnqr = function(event) {
			$scope.cstCprsvInfEnqrInfo = event;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstCprsvInfEnqr/detailCstCprsvInfEnqr.html',
					$scope.avyInfo, {
						title : '交易账户明细信息',
						buttons : [ '取消' ],
						size : [ '1340px', '500px' ],
						callbacks : [ $scope.selectCorporat ]
					});
		};

		// 回调函数/确认按钮事件
		$scope.selectCorporat = function(result) {
			// var item=result.scope.selectCorporatgrid.checkedList();//选中列值
			// $scope.queryParam.cstNumb=item.cstNumb;
			$scope.safeApply();
			result.cancel();
		};

	});

	// 账户余额信息
	webApp.controller('acBaListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.acBaListTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstCprsvInfEnqr.queryacBaList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data.data;
			}
		};

	});

});
