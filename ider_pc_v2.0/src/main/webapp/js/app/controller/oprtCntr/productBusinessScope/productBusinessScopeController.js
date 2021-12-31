'use strict';
define(function(require) {

	var webApp = require('app');

	//业务类型管理
	webApp.controller('productBusinessScopeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.avyListTable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productBusinessScope.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		

	});
	
});
