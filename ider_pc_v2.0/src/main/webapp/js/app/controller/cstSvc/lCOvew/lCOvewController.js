'use strict';
define(function(require) {

	var webApp = require('app');

	// 生命周期概览
	webApp.controller('lCOvewCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		// 生命周期概览
		$scope.lCOvewTable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lCOvew.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};

		$scope.showLCOvewInfo = false;

		$scope.showBtn = function() {
			$scope.showLCOvewInfo = true;
		};

		$scope.checklCOvewInfo = function(event) {
			var str = event.pDCd;
			var ccy = event.ccy;
			var pDCd = str.split("", 4);
			if (null != pDCd) {
				pDCd = pDCd[3];
			}
			if (pDCd == "T") {
				$scope.temp1 = event;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/cstSvc/lCOvew/accLC.html', $scope.temp, {
					title : '账户生命周期',
					buttons : [ '关闭' ],
					size : [ '1300px', '600px' ],
					callbacks : []
				});
				
				// 回调函数/确认按钮事件
				$scope.selectCorporat = function(result) {
					$scope.safeApply();
					result.cancel();
				};
				
				//$scope.turn("/lCOvew/accLC?str=" + str + "&ccy", event);
			} else if (pDCd == "P") {
				$scope.temp1 = event;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/cstSvc/lCOvew/pDLC.html', $scope.temp, {
					title : '产品生命周期',
					buttons : [ '关闭' ],
					size : [ '1300px', '600px' ],
					callbacks : []
				});
				
				// 回调函数/确认按钮事件
				$scope.selectCorporat = function(result) {
					$scope.safeApply();
					result.cancel();
				};
				
				//$scope.turn("/lCOvew/pDLC?str=" + str + "&ccy", event);
			}
		};
		
		
		//=============================账户生命周期=================================
		// 账户生命周期
		$scope.accLCTable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lCOvew.queryAccLC',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		
		// 生命周期信息
		$scope.YTable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lCOvew.queryYTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		$scope.checkAccLCInfo = function(event) {
			$scope.temp = event;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/lCOvew/checkAccLC.html', $scope.temp, {
				title : '余额单元生命周期',
				buttons : [ '关闭' ],
				size : [ '1050px', '450px' ],
				callbacks : [ ]
			});
		};
		
		//=============================产品生命周期=================================
		
		// 账户生命周期
		$scope.lCTable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lCOvew.queryLCTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		
		// 生命周期信息
		$scope.STable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lCOvew.querySTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		$scope.checkLCInfo = function(event) {
			$scope.temp = event;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/lCOvew/checkLC.html', $scope.temp, {
				title : '媒介生命周期',
				buttons : [ '关闭' ],
				size : [ '1050px', '450px' ],
				callbacks : [ ]
			});
		}

	});

	webApp.controller('accLCCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {

		$scope.accLCInfo = {
				pDCd : $stateParams.str,
				ccy : $stateParams.ccy
		}

	});
	
	
	webApp.controller('pDLCCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {

		$scope.accLCInfo = {
				pDCd : $stateParams.str,
				ccy : $stateParams.ccy
		}

	});
});
