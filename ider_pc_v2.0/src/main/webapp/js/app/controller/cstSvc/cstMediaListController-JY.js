'use strict';
define(function(require) {

	var webApp = require('app');

	// 活动清单
	webApp.controller('cstMediaListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//余额对象列表
		$scope.cstMediaList = {
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstInfQuery.queryInf',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.cstMediaListList = {
				checkType : 'radio',
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstInfQuery.queryInf',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/cstMediaList/mediaDtlInf.html', $scope.item, {
				title : '媒介详细信息',
				buttons : [ '确认', '取消' ],
				size : [ '800px', '400px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		$scope.checkPdListInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/cstMediaList/pdListInfo.html', $scope.item, {
				title : '产品列表信息',
				buttons : [ '确认', '取消' ],
				size : [ '900px', '400px' ],
				callbacks : [ $scope.callback ]
			});
		};
	});
	
});
