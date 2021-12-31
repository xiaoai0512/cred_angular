'use strict';
define(function(require) {
	var webApp = require('app');
	// 绑定核算场景
	webApp.controller('bindAccSceneListCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = true;
		 $scope.updBtnFlag = true;
		 $scope.addBtnFlag = true;
		 $scope.delBtnFlag = true;
		 //根据菜单和当前登录者查询有权限的事件编号
		 $scope.queryAuth = function(){
			 $scope.paramsNo = {
				menuNo:$scope.menuNo
			 };
			 jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnData != null || data.returnData != ""){
  					for(var i=0;i<data.returnData.length;i++){
  	   					$scope.eventList += data.returnData[i].eventNo + ",";
  	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0100') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   		if($scope.eventList.search('COS.IQ.02.0095') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   		if($scope.eventList.search('COS.UP.02.0095') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   		if($scope.eventList.search('COS.UP.02.0065') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
  				}
  			});
		 };
		 //$scope.queryAuth();//查询权限
  			/**/
		//运营模式
		 $scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//绑定核算场景列表
		$scope.bindAccSceneList = {
			params : {
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			//autoQuery:false,
			resource : 'accountingMag.queryBindAccScene',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 新增
		$scope.bindAccSceneAdd = function(event) {
			$scope.bindAccSceneInf = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/bindAccSceneEst.html',$scope.bindAccSceneInf, {
				title : '新增核算场景事件',
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '350px' ],
				callbacks : [$scope.saveBindAccScene]
			});
		};
		//保存 绑定核算场景事件
		$scope.saveBindAccScene = function(result){
			$scope.bindAccSceneEstInf = result.scope.bindAccSceneEstInf;
			jfRest.request('accountingMag', 'saveBindAccScene', $scope.bindAccSceneEstInf) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.bindAccSceneEstInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.bindAccSceneList.search();
				}
			});
		};
		// 查看
		$scope.checkBindAccSceneInf = function(event) {
			$scope.viewBindAccSceneInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewBindAccScene.html',
				$scope.viewBindAccSceneInf, {
					title : T.T('YYJ5400048'),
					buttons : [ T.T('F00012') ],
					size : [ '1050px', '350px' ],
					callbacks : []
				});
		};
	/*	// 修改
		$scope.updateAccSubSceneInf = function(event) {
			$scope.upBindAccSceneInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateBindAccScene.html',$scope.upBindAccSceneInf, 
				{
				title : T.T('YYJ5400049'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '350px' ],
				callbacks : [ $scope.sureUpdateaccScene ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.sureUpdateaccScene = function(result) {
			$scope.upBindAccSceneInf = result.scope.upBindAccSceneInf;
			jfRest.request('accountingMag', 'updateBindAccScene', $scope.upBindAccSceneInf) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.bindAccSceneList.search();
				}
			});
		};*/
		//删除
		$scope.deleteAccSubSceneInf =  function(event) {
			$scope.accSceneInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm('确定删除核算场景事件？',function(){//确定
				jfRest.request('accountingMag', 'deleteBindAccScene', $scope.accSceneInf) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.bindAccSceneList.search();
					}
				});
			},function(){//取消
			})
		};
	});
	//新增核算类型定义
	webApp.controller('bindAccSceneEstCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translate.refresh();
		$scope.bindAccSceneEstInf = {};
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
		//查询事件
		$scope.queryBindAccEvent = function(){
			$scope.modal('/a_operatMode/accountingMag/queryBindAccEvent.html',{}, 
				{
				title : '选择事件',
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '450px' ],
				callbacks : [ $scope.sureAccSceneEv]
			});
		};
		//确定核算场景事件
		$scope.sureAccSceneEv = function(result){
			if(!result.scope.accEventListTable.validCheck()){
				return;
            }
            $scope.bindAccSceneEstInf.sceneSequence = result.scope.accEventListTable.checkedList().eventNo;
			$scope.bindAccSceneEstInf.sceneSequenceDesc = result.scope.accEventListTable.checkedList().eventDesc;
			$scope.safeApply();
			result.cancel();
		};
	});
	//修改
	webApp.controller('updateBindAccSceneCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translate.refresh();
		$scope.accSubSceneInf = $scope.upBindAccSceneInf;
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.updateOperationMode = $scope.upBindAccSceneInf.operationMode;
	        }
	    };
		//查询事件
		$scope.queryBindAccEvent = function(){
			$scope.modal('/a_operatMode/accountingMag/queryBindAccEvent.html',{}, 
				{
				title : '选择事件',
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '450px' ],
				callbacks : [ $scope.sureUpAccSceneEv]
			});
		};
		//确定核算场景事件
		$scope.sureUpAccSceneEv = function(result){
			if(!result.scope.accEventListTable.validCheck()){
				return;
            }
            $scope.upBindAccSceneInf.sceneSequence = result.scope.accEventListTable.checkedList().eventNo;
			$scope.upBindAccSceneInf.sceneSequenceDesc = result.scope.accEventListTable.checkedList().eventDesc;
			$scope.safeApply();
			result.cancel();
		};
	});
	//详情
	webApp.controller('viewBindAccSceneCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translate.refresh();	
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.vwoperationMode = $scope.viewBindAccSceneInf.operationMode;
		        }
		    };
	});
	//查询核算事件
	webApp.controller('queryBindAccEventCtrl', function($scope, $stateParams, jfRest,$timeout, 
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translate.refresh();
		$scope.accEventListTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountingMag.queryAccEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
});
