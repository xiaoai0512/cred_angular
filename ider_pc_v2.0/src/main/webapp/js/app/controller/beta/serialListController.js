'use strict';
define(function(require) {

	var webApp = require('app');

	// 测试
	webApp.controller('serialListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/serialList/i18n_serialList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		// 事件清单列表
		$scope.serialList = {
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'serialList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数

			}
		};
		// 顺序号类型 CUS-客户客户号
		$scope.serialTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ordinalType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
	
			}
		};
	});
});
