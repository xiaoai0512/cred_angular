'use strict';
define(function(require) {

	var webApp = require('app');

	//客户产品列表查询
	webApp.controller('cstPDListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.cstPDInfo = {
				
		};
		$scope.cstPDListTable = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstPDList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.showCstPDList = false;//隐藏
		//查询
		$scope.cstPDListTableSearch = function(){
			$scope.showCstPDList = true;//显示
		};
		//查看
		$scope.checkcstPDInfo = function(event){
		$scope.avyInfo = event;
		
			//页面弹出框事件(弹出页面)
		  $scope.modal('/beta/avyList/checkAvyList.html',$scope.avyInfo,{title :'活动详情信息',buttons : ['取消'],size : ['1050px','400px'],callbacks : [$scope.selectCorporat]});
		};

		//回调函数/确认按钮事件
		$scope.selectCorporat =function (result)  {
//			var item=result.scope.selectCorporatgrid.checkedList();//选中列值
//			$scope.queryParam.cstNumb=item.cstNumb;
	    	$scope.safeApply();
	    	result.cancel();
	    };

	});
	
});
