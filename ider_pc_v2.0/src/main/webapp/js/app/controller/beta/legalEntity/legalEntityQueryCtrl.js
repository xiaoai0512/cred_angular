'use strict';
define(function(require) {
	var webApp = require('app');
	//法人实体查询及维护
	webApp.controller('legalEntityQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/legalEntity/i18n_legalEntity');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0037') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0036') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	 	if($scope.eventList.search('COS.AD.02.0032') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
		$scope.legalEntityList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'legalEntity.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkBusinessForm = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.legalEntityItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/legalEntity/viewLegalEntity.html', $scope.legalEntityItem, {
				title : T.T('PZJ1200001'),
				buttons : [  T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateBusinessForm= function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.legalEntityItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/legalEntity/updateLegalEntity.html', $scope.legalEntityItem, {
				title : T.T('PZJ1200002'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.updateBlockCodeInf]
			});
		};
		//修改
		$scope.updateBlockCodeInf = function (result){
			$scope.legalEntityItem.operationMode = $scope.legalEntityItem.operationModeUpdate;
			$scope.legalEntityItem.systemUnitNo = $scope.legalEntityItem.systemUnitNoUpdate;
			jfRest.request('legalEntity', 'update', $scope.legalEntityItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.legalEntityList.search();
				}
			});
		};
		//新增
		$scope.addLegalEntity = function(){
			$scope.legalEntityBsf = {};
			$scope.modal('/beta/legalEntity/legalEntityEst.html', $scope.legalEntityBsf, {
				title :T.T('PZJ1200004'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureAddLegalEntity]
			});
		};
		//确定新增
		$scope.sureAddLegalEntity = function(result){
			$scope.legalEntityBsf = result.scope.legalEntityBsf;
			jfRest.request('legalEntity','save', $scope.legalEntityBsf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.legalEntityBsf = {};
					 $scope.safeApply();
					 result.cancel();
					 $scope.legalEntityList.search();
				}
			});
		};
		//copy复制
		$scope.copyLegalEntity= function(item){
			$scope.legalEntityItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/legalEntity/copyLegalEntity.html', $scope.legalEntityItem, {
				title : T.T('PZJ1200005'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureCopyLegalEntity]
			});
		};
		//确定复制
		$scope.sureCopyLegalEntity = function(result){
			$scope.legalEntityItem = result.scope.legalEntityItem;
			$scope.legalEntityItem.operationMode = $scope.legalEntityItem.operationModeCopy;
			$scope.legalEntityItem.systemUnitNo = $scope.legalEntityItem.systemUnitNoCopy;
			jfRest.request('legalEntity','save', $scope.legalEntityItem).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.legalEntityBsf = {};
					 $scope.safeApply();
					 result.cancel();
					 $scope.legalEntityList.search();
				}
			});
		};
	});
	webApp.controller('viewLegalEntityCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//系统单元
		 $scope.systemUnitArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"systemUnitName", //下拉框显示内容，根据需要修改字段名称 
	        value:"systemUnitNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"systemUnit.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.legalEntityItem.systemUnitNoView = $scope.legalEntityItem.systemUnitNo;
	        }
	    };
		 //运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.legalEntityItem.operationModeView = $scope.legalEntityItem.operationMode;
	        }
	    };
	});
	webApp.controller('updateLegalEntityCtrl', function($scope, $stateParams, jfRest,
		 $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		  //运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.legalEntityItem.operationModeUpdate = $scope.legalEntityItem.operationMode;
	        }
	    };
		 //系统单元
		 $scope.systemUnitArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"systemUnitName", //下拉框显示内容，根据需要修改字段名称 
	        value:"systemUnitNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"systemUnit.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.legalEntityItem.systemUnitNoUpdate = $scope.legalEntityItem.systemUnitNo;
	        }
	    };
	});
	//复制
	webApp.controller('copyLegalEntityCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/legalEntity/i18n_legalEntity');
		$translate.refresh();
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.legalEntityItem.operationModeCopy = $scope.legalEntityItem.operationMode;
	        }
	    };
		 //系统单元
		 $scope.systemUnitArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"systemUnitName", //下拉框显示内容，根据需要修改字段名称 
	        value:"systemUnitNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"systemUnit.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.legalEntityItem.systemUnitNoCopy = $scope.legalEntityItem.systemUnitNo;
	        }
	    };
	});
	//法人实体建立
	webApp.controller('legalEntityEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/legalEntity/i18n_legalEntity');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //系统单元
		 $scope.systemUnitArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"systemUnitName", //下拉框显示内容，根据需要修改字段名称 
	        value:"systemUnitNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"systemUnit.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
	})
});
