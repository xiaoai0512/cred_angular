'use strict';
define(function(require) {

	var webApp = require('app');
	require('../cstSvc/checkCstCprsvInfEnqrController.js');
	// 账户列表查询
	webApp.controller('cstCprsvInfEnqrCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.cstCprsvInfEnqrTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstCprsvInfEnqr.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data.data;
			}
		};
		
		$scope.currencyList = [{name : '人民币' ,id : '1'},{name : '美元' ,id : '2'}] ;
		$scope.accountType = [{name : '账户类型1' ,id : '1'},{name : '账户类型2' ,id : '2'}] ;
		$scope.businessType = [{name : '资产业务' ,id : '1'},{name : '负债业务' ,id : '2'}] ;

		$scope.check = function(event) {
			$scope.avyInfo = event;
			$scope.modal('/cstSvc/cstCprsvInfEnqr/checkCstCprsvInfEnqr.html', $scope.avyInfo, {
				title : '账户明细查询',
				buttons : [ '取消' ],
				size : [ '1340px', '500px' ],
				callbacks : [ $scope.selectCorporat ]
			});
		};
		/*
		 * //修改 $scope.changeAvyInfo = function(event){ $scope.avyInfo = event;
		 * //页面弹出框事件(弹出页面)
		 * $scope.modal('/beta/avyList/checkAvyList.html',$scope.avyInfo,{title
		 * :'活动详情信息',buttons : ['保存','取消'],size : ['1050px','400px'],callbacks :
		 * [$scope.selectCorporat]}); }
		 */

		// 查看
		$scope.checkAvyInfo = function(event) {
			$scope.avyInfo = event;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstCprsvInfEnqr/checkAvyList.html',
					$scope.avyInfo, {
						title : '活动详情信息',
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

	webApp.controller('checkAvyListCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {

	});

});
