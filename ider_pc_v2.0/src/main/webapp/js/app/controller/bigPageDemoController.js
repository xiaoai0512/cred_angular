'use strict';
define(function (require){
	var angular = require('angular') ;
	Tansun.controller('userAddCtrl',function($scope,jfLayer){
		$scope.demoArray= [{name : '男' ,id : '1'},{name : '女' ,id : '2'}] ;
		$scope.user={};
		$scope.save=function(){
			var params=$scope.user;
			$scope.toParent(params) ;
			jfLayer.success('保存成功');
		}
		
	}) ;
	Tansun.controller('userOrgRelManageCtrl',function($scope){
		$scope.grid = {
				checkType : 'radio', //当为checkbox时为多选
				params : $scope.queryParam, //表格查询时的参数信息
				paging : true ,//默认true,是否分页
				resource : 'tableDemo.query' ,//列表的资源
				callback : function() { //表格查询后的回调函数
				}
			};	
	}) ;
	Tansun.controller('userAndDeptRelManageCtrl',function($scope,jfRest){
		$scope.grid = {
				checkType : 'radio', //当为checkbox时为多选
				params : $scope.queryParam, //表格查询时的参数信息
				paging : true ,//默认true,是否分页
				resource : 'tableDemo.query' ,//列表的资源
				callback : function() { //表格查询后的回调函数
				}
			};

	}) ;
	Tansun.controller('userAndRoleManageCtrl',function($scope,jfRest){
		$scope.grid = {
				checkType : 'radio', //当为checkbox时为多选
				params : $scope.queryParam, //表格查询时的参数信息
				paging : true ,//默认true,是否分页
				resource : 'tableDemo.query' ,//列表的资源
				callback : function() { //表格查询后的回调函数
				}
			};
	
	}) ;
});