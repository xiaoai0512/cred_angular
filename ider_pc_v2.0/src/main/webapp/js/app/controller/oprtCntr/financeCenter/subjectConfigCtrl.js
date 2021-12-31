'use strict';
define(function(require) {

	var webApp = require('app');

	// 科目配置查询
	webApp.controller('subjectConfigCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {

		//科目配置查询
		$scope.itemList = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'subjectConfig.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
});