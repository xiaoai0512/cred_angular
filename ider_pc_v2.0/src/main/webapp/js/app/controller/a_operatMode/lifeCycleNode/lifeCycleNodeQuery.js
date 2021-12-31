'use strict';
define(function(require) {
	var webApp = require('app');
	//封锁码查询及维护
	webApp.controller('lifeCycleNodeQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/lifeCycleNode/i18n_lifeCycleNode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
			 //节点类型
			 $scope.nodeTypArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_periodicNodeType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
				}
			};
			 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
  			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnData != null || data.returnData != ""){
  					for(var i=0;i<data.returnData.length;i++){
  	   					$scope.eventList += data.returnData[i].eventNo + ",";
  	   				}
		   	   		if($scope.eventList.search('COS.IQ.02.0024') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0024') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0024') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
		$scope.lifeCycleNodeList = {
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'lifeCycleNode.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_periodicNodeType'],//查找数据字典所需参数
			transDict : ['nodeTyp_nodeTypDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkLifeCycleNode = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.lifeCycleNodeItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/lifeCycleNode/viewLifeCycleNode.html', $scope.lifeCycleNodeItem, {
				title : T.T('PZJ800007'),
				buttons : [ T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateLifeCycleNode = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.lifeCycleNodeItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/lifeCycleNode/updateLifeCycleNode.html', $scope.lifeCycleNodeItem, {
				title : T.T('PZJ800008'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureUpLifeCycleNode]
			});
		};
		//修改
		$scope.sureUpLifeCycleNode = function (result){
			$scope.lifeCycleNodeItem.operationMode = result.scope.updateOperationMode;
			$scope.lifeCycleNodeItem.nodeTyp = result.scope.nodeTyp;
			jfRest.request('lifeCycleNode', 'update', $scope.lifeCycleNodeItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.lifeCycleNodeList.search();
				}
			});
		};
		//新增
		$scope.addLifeCycleNode = function (){
			$scope.lifeCycleNodeInf = {};
			$scope.modal('/a_operatMode/lifeCycleNode/lifeCycleNodeEst.html', $scope.lifeCycleNodeInf, {
				title : T.T('PZJ800009'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureAddlifeCycleNodeInf]
			});
		};
		$scope.sureAddlifeCycleNodeInf = function (result){
			$scope.lifeCycleNodeInf = result.scope.lifeCycleNodeInf;
			jfRest.request('lifeCycleNode','save', $scope.lifeCycleNodeInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.lifeCycleNodeInf = {};
					$scope.safeApply();
					 result.cancel();
					 $scope.lifeCycleNodeList.search();
				}
			});
		};
	});
	webApp.controller('viewLifeCycleNodeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		/*	CP：客户生命周期
		PP：产品生命周期
		MP：媒介生命周期
		AP：账户生命周期
		OP：余额对象生命周期
		UP：余额单元生命周期
		*/
		$scope.nodeTypArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_periodicNodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.nodeTyp=$scope.lifeCycleNodeItem.nodeTyp;
			}
		};
	});
	webApp.controller('updateLifeCycleNodeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		/*	CP：客户生命周期
		PP：产品生命周期
		MP：媒介生命周期
		AP：账户生命周期
		OP：余额对象生命周期
		UP：余额单元生命周期
		*/
		$scope.nodeTypArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_periodicNodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.nodeTyp=$scope.lifeCycleNodeItem.nodeTyp;
			}
		};
	});
	//新增
	webApp.controller('lifeCycleNodeEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/lifeCycleNode/i18n_lifeCycleNode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.lifeCycleNodeInf = {};
		/*	CP：客户生命周期
		PP：产品生命周期
		MP：媒介生命周期
		AP：账户生命周期
		OP：余额对象生命周期
		UP：余额单元生命周期
		*/
		$scope.nodeTypArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_periodicNodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.lifeCycleNodeInf = $scope.lifeCycleNodeInf;
	});
});
