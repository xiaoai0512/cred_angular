'use strict';
define(function(require) {
	var webApp = require('app');
	// 产品對象查询
	webApp.controller('transIdentyQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 $scope.copyBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0044') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0038') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0041') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   					$scope.copyBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   					$scope.copyBtnFlag = false;
	   				}
  				}
  			});
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//交易识别列表
		$scope.tranIdentyList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'transIdenty.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checTransIdentyInf = function(event) {
			$scope.transIdentyInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/trans/viewTransIdenty.html',
			$scope.transIdentyInf, {
				title : T.T('YYJ1500003'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '320px' ],
				callbacks : []
			});
		};
		//新增
		$scope.addTranIdentyLayout = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/trans/transIdentyMgt.html', '', {
				title : T.T('YYJ1500005'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [$scope.savetransIdenty]
			});
		};
		//新增回调函数
		$scope.savetransIdenty = function(result){
			$scope.transIdentyInfoAdd = {};
			$scope.transIdentyInfoAdd = result.scope.transIdentyInfo;
			$scope.transIdentyInfoAdd.operationMode = result.scope.operationMode;
			$scope.transIdentyInfoAdd.transIdentifiNo = result.scope.transIdentyInfo.transIdentifiNoHalf;
			jfRest.request('transIdenty', 'save', $scope.transIdentyInfoAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.transIdentyInfoAdd = {};
					result.scope.transIdentyAddForm.$setPristine();
					$scope.tranIdentyList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//复制			
		$scope.copyTransIdentyInf = function(event){	
			$scope.transCopy = {};
			$scope.transCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/trans/transIdentyCopy.html',$scope.transCopy, {
				title : T.T('YYJ1500006'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.transIdentyCopy]
			});
		};	
		//复制回调函数		
		$scope.transIdentyCopy = function(result){
			$scope.transIdentyCopy = {};
			$scope.transIdentyCopy = result.scope.transCopy;
			$scope.transIdentyCopy.operationMode = result.scope.operationModeTemp;
			jfRest.request('transIdenty', 'save', $scope.transIdentyCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.transIdentyCopy = {};
					result.scope.transIdentyCopyForm.$setPristine();
					$scope.tranIdentyList.search();
					result.cancel();
					$scope.safeApply();
				}
			});
		};
		// 修改
		$scope.updateTransIdentyInf = function(event) {
			$scope.transIdentyInf = {};
			$scope.transIdentyInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/trans/updateTransIdenty.html',$scope.transIdentyInf, {
				title : T.T('YYJ1500004'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '1050px', '320px' ],
				callbacks : [ $scope.updateTransIdenty ]
			});
		};
		$scope.updateTransIdenty = function(result) {
			$scope.transIdentyInf.operationMode = result.scope.operationModeTemp;
			jfRest.request('transIdenty', 'update', $scope.transIdentyInf) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.tranIdentyList.search();
				}
			});
		};
	});
	//查看
	webApp.controller('viewTransIdentyCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.transIdentyInf.operationModeTemp = $scope.transIdentyInf.operationMode;
	        }
	    };
	});
	//修改
	webApp.controller('updateTransIdentyCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeTemp = $scope.transIdentyInf.operationMode;
	        }
    	};
	});
	//复制
	webApp.controller('copyTransIdentyCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeTemp = $scope.transCopy.operationMode;
	        }
	    };
	});
	// 业务识别建立
	webApp.controller('transIdentyMgtCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.transIdentyInfo = {};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
	 	$scope.newCodeShow = true;
	});
});