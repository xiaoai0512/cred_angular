'use strict';
define(function(require) {
	var webApp = require('app');
	// 卡版面查询及维护
	webApp.controller('cardLayoutListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/oprtCntr/cardLayoutMag/i18n_cardLayoutMag');
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		//$translatePartialLoader.addPart('pages/a_operatMode/cardLayout/i18n_CardLayout');
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0054') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0046') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0049') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
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
		$scope.cardLayoutList = {
			params : {
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cardLayoutMag.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//新增
		$scope.addCardLayout = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/oprtCntr/cardLayoutMag/cardLayoutBuild.html', '', {
				title : T.T('YYJ5200001'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [$scope.savecardLayoutInf ]
			});
		};
		//保存
		$scope.savecardLayoutInf = function(result){
			$scope.cardLayoutAdd = {};
			$scope.cardLayoutAdd = result.scope.cardLayoutInf;
				jfRest.request('cardLayoutMag', 'save', $scope.cardLayoutAdd).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032')) ;
						$scope.cardLayoutAdd = {};
						result.scope.cardLayoutInfForm.$setPristine();
						$scope.safeApply();
						result.cancel();
						$scope.cardLayoutList.search();
					}
				});
		};
		// 查看
		$scope.queryCardLayout = function(event) {
			$scope.cardLayoutInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/oprtCntr/cardLayoutMag/viewCardLayout.html', $scope.cardLayoutInf, {
				title : T.T("YYJ5200002"),
				buttons : [T.T('F00012') ],
				size : [ '900px', '350px' ],
				callbacks : [ ]
			});
		};
		// 修改
		$scope.updateCardLayout = function(event) {
			$scope.cardLayoutInf = {};
			$scope.cardLayoutInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/oprtCntr/cardLayoutMag/updateCardLayout.html', $scope.cardLayoutInf, {
				title :  T.T("YYJ5200003"),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.sureCardLayout]
			});
		};
		//复制
		$scope.CopyCardLayout = function(event){
			$scope.cardLayoutInfCopy = {};
			$scope.cardLayoutInfCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/oprtCntr/cardLayoutMag/copyCardLayout.html', $scope.cardLayoutInfCopy, {
				title :  T.T("YYJ5200004"),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.saveCopycardLayoutInf]
			});				
		};
		$scope.saveCopycardLayoutInf = function(result){
			$scope.cardLayoutCopy = {};
			$scope.cardLayoutCopy = result.scope.cardLayoutInfCopy;
				jfRest.request('cardLayoutMag', 'save', $scope.cardLayoutCopy).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032')) ;
						$scope.cardLayoutCopy = {};
						result.scope.cardLayoutInfForm.$setPristine();
						$scope.safeApply();
						result.cancel();
						$scope.cardLayoutList.search();
					}
				});
		};
		// 回调函数/确认按钮事件
		$scope.sureCardLayout = function(result) {
			$scope.paramss = result.scope.cardLayoutInf;
			jfRest.request('cardLayoutMag', 'update', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.cardLayoutList.search();
				}
			});
		};
	});
	webApp.controller('updateCardLayoutCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/oprtCntr/cardLayoutMag/i18n_cardLayoutMag');
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$scope.cardLayoutInf = $scope.cardLayoutInf;
		console.log($scope.cardLayoutInf);
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.cardLayoutInf.operationModeUp = $scope.cardLayoutInf.operationMode;
	        }
	    };
	});
	webApp.controller('viewCardLayoutCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/oprtCntr/cardLayoutMag/i18n_cardLayoutMag');
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$scope.cardLayoutInf = $scope.cardLayoutInf;
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.cardLayoutInf.operationModeVw = $scope.cardLayoutInf.operationMode;
	        }
	    };
	});
	//卡版面建立
	webApp.controller('cardLayoutBuildCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/oprtCntr/cardLayoutMag/i18n_cardLayoutMag');
		$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.cardLayoutInf = {}; 
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };		
	});
	//复制页面控制器
	//卡版面建立
	webApp.controller('cardLayoutBuildCtrlCopy', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/oprtCntr/cardLayoutMag/i18n_cardLayoutMag');
		$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.cardLayoutInf = {}; 
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };		
	});
});
