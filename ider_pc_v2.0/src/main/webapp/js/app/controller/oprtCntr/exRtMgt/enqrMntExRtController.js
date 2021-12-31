'use strict';
define(function(require) {
	var webApp = require('app');
	// 查询维护汇率
	webApp.controller('enqrMntExRtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.curRatListTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newCuRt.queryCurrencyRate',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.checkCurrencyRate = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
//			$scope.item = event;
			$scope.modal('/oprtCntr/exRtMgt/checkCurrencyRate.html',
					$scope.item, {
						title : '汇率详情',
						buttons : [ '确定', '关闭' ],
						size : [ '950px', '350px' ],
						callbacks : [ $scope.callback ]
					});
		};
		$scope.paramss = {
			};
		$scope.callback = function(result) {
			$scope.paramss = result.scope.checkCurrencyRateInfo;
			$scope.paramss.evenId = "COS.UP.02.0022";
			jfRest.request('newCuRt', 'updateCurrencyRate', $scope.paramss)// Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功");
					$scope.safeApply();
					result.cancel();
					$scope.curRatListTable.search();
				}
			});
		}
	});
	webApp.controller('checkCurrencyRateCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.checkCurrencyRateInfo = $scope.item;
	});
});
