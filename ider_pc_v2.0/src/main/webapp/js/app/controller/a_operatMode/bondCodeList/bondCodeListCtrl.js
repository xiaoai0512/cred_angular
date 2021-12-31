'use strict';
define(function(require) {
	var webApp = require('app');
	// 债券代码查询
	webApp.controller('bondCodeListCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {   
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/bondCode/i18n_bondCodeList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//生效码标识
		$scope.statusArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				
			}	
		};
		//债券代码--列表
		$scope.bondCodeList = {
			params : {
					pageSize:10,
					indexNo:0,
					status: 1
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'partnersQuery.queryList',// 列表的资源
			isTrans: true,
			transParams: ['dic_fundlegalPersonType','dic_effectiveStatus',"dic_ZorO"],
			transDict: ['partnerCategory_partnerCategoryDesc','status_statusDesc','isBankFunds_isBankFundsDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.resetChose = function() { 
			$scope.bondCodeList.params.operationMode = "";
			$scope.bondCodeList.params.fundNum = "";
			$scope.bondCodeList.params.status = "";
		};
		// 查看
		$scope.checkBondCodeInf = function(event) {
			$scope.items = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/bondCode/viewBondCode.html',
				$scope.items, {
				title : T.T('YYJ2200001'),
				buttons : [  T.T('F00012') ],
				size : [ '900px', '320px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateBondCodeListInf = function(event) {
			$scope.bondCodeItem = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/bondCode/updateBondCode.html',
				$scope.bondCodeItem, {
					title : T.T('YYJ2200002'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '900px', '320px' ],
					callbacks : [ $scope.updateBondCodeListEvent ]
			});
		};
		//修改回调函数
		$scope.updateBondCodeListEvent = function(result) {  
			$scope.item = result.scope.bondCodeInf;
			console.log($scope.item);
			jfRest.request('partnersQuery', 'update', $scope.item) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.bondCodeList.search();
				}
			});
		};
	});
	//查看
	webApp.controller('viewBondCodeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/bondCode/i18n_bondCodeList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.bondCodeInf=$scope.bondCodeItem;
		$scope.bondCodeDetail=$scope.items
	});
	//修改
	webApp.controller('updateBondCodeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, 
			jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/bondCode/i18n_bondCodeList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.bondCodeInf=$scope.bondCodeItem;
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationMode=$scope.bondCodeItem.operationMode;
	        }
	    };
	});
});
