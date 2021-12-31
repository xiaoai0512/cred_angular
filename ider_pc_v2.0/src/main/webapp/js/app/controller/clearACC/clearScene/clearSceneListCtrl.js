'use strict';
define(function(require) {
	var webApp = require('app');
	// 清算场景列表
	webApp.controller('clearSceneListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 $scope.delBtnFlag = false;
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
		   	   		if($scope.eventList.search('MIS.IQ.01.0005') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('MIS.AD.01.0005') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('MIS.UP.01.0005') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   		if($scope.eventList.search('MIS.UP.01.0006') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
  				}
  			});
  			$scope.cScene = {};
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
  			var form = layui.form;
  			form.on('select(getChannelSelId)',function(event){
  			//渠道ID
			});
		$scope.clearSceneList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery: false,
			resource : 'clearScene.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		 //交易代码  00 20 27 30 33 40 43 
		$scope.clearCodeArr = [{id: '00',name : '00'},{id: '20',name : '20'},{id: '27',name : '27'},
		                       {id: '30',name : '30'},{id: '33',name : '33'},{id: '40',name : '40'},{id: '43',name : '43'}
		                       ,{id: '60',name : '60'},{id: '61',name : '61'}];
		//原交易代码
		//$scope.originalClearCodeArr = [{id: 'D',name : '每日接收'},{id: 'W',name : '工作日接收'},{id: 'S',name : '不定期接收'}];
		// 新增
		$scope.clearSceneAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/clearScene/clearSceneBuild.html','', {
				title : T.T('QFJ200001'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '380px' ],
				callbacks : [$scope.saveClearScene]
			});
		};
		//保存
		$scope.saveClearScene = function(result){
			$scope.cSceneInf = {};
			$scope.cSceneInf = result.scope.cScene;
			jfRest.request('clearScene','save', $scope.cSceneInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.cSceneInf = {};
					result.scope.cSceneInfForm.$setPristine();
					$scope.clearSceneList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//复制
		$scope.copyClearScene = function(event){
			$scope.cSceneCopy = {};
			$scope.cSceneCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/clearScene/clearSceneCopy.html',$scope.cSceneCopy, {
				title : T.T('QFJ200002'),  //"渠道信息复制",
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '330px' ],
				callbacks : [ $scope.sureCopyScene]
			});
		};
		//保存=========复制
		$scope.sureCopyScene = function(result){
			$scope.sceneInfCopy = {};
			$scope.sceneInfCopy = result.scope.cSceneCopy;
			$scope.sceneInfCopy.operationMode = result.scope.copyOperationMode;
//			$scope.sceneInfCopy.channelId = result.scope.copyChannelId;
			jfRest.request('clearScene', 'save', $scope.sceneInfCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.sceneInfCopy = {};
					$scope.clearSceneList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 查看
		$scope.queryCsceneInf = function(event) {
			$scope.cSceneItem = {};
			$scope.cSceneItem = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/clearScene/clearSceneView.html', $scope.cSceneItem, {
				title : T.T('QFJ200003'),   //'清算场景查询',
				buttons : [T.T('F00012') ],
				size : [ '1000px', '320px' ],
				callbacks : [ ]
			});
		};
		// 修改
		$scope.updateClearScene = function(event) {
			$scope.cSceneUpdate = {};
			$scope.cSceneUpdate = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/clearScene/clearSceneUpdate.html', $scope.cSceneUpdate, {
				title : T.T('QFJ200004'),   //'维护清算场景',
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.sureClearScene]
			});
		};
		// 回调函数/确认按钮事件
		$scope.sureClearScene = function(result) {
			$scope.sceneUpdate = {};
			$scope.sceneUpdate = result.scope.cSceneUpdate;
			$scope.sceneUpdate.operationMode = result.scope.updateOperationMode;
//			$scope.sceneUpdate.channelId = result.scope.updateChannelId;
			jfRest.request('clearScene', 'update', $scope.sceneUpdate).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.clearSceneList.search();
				}
			});
		};
		//删除
		$scope.deleteClearScene = function(item) {
			$scope.items = $.parseJSON(JSON.stringify(item));
			jfLayer.confirm(T.T('F00092'),function() {
				jfRest.request('clearScene', 'deleteCl', $scope.items).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.items = {};
						$scope.clearSceneList.search();
					}
				});
			},function() {
			});
		};
	});
	//清算场景修改
	webApp.controller('clearSceneUpdateCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {//运营模式
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translate.refresh();
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateOperationMode = $scope.cSceneUpdate.operationMode;
		        }
		    };
		//渠道ID
			$scope.channelIdArr = {
				type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        desc:"channelDescription",
		        text:"channelId", //下拉框显示内容，根据需要修改字段名称 
		        value:"channelId",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"channelMag.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateChannelId = $scope.cSceneUpdate.channelId;
		        }	
  			};
			//交易代码  00 20 27 30 33 40 43 
			$scope.clearCodeArr = [{id: '00',name : '00'},{id: '20',name : '20'},{id: '27',name : '27'},
			                       {id: '30',name : '30'},{id: '33',name : '33'},{id: '40',name : '40'},{id: '43',name : '43'}
			                       ,{id: '60',name : '60'},{id: '61',name : '61'}];
			//关联事件编号
			$scope.updateEventNo = function(event) {
				$scope.paramEvent = {};
				$scope.paramEvent.sceneEventNo = $.parseJSON(JSON.stringify(event));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/clearACC/clearScene/clearSceneEvent.html', $scope.paramEvent, {
					title : T.T('QFJ200005'),   //'选择触发事件编号' ,
					buttons : [T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '560px' ],
					callbacks : [$scope.sureUpdateEventNo]
				});
			};
			$scope.sureUpdateEventNo = function(result){
				$scope.cSceneUpdate.triggerNo = result.scope.eventListTable.checkedList().eventNo;
				$scope.safeApply();
				result.cancel();
			}	
	});
	//清算场景复制
	webApp.controller('clearSceneCopyCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translate.refresh();
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.copyOperationMode = $scope.cSceneCopy.operationMode;
		        }
		    };
			var form = layui.form;
			form.on('select(getChannelIdCopy)',function(event){
				//渠道ID
			});
			//交易代码  00 20 27 30 33 40 43 
			$scope.clearCodeArr = [{id: '00',name : '00'},{id: '20',name : '20'},{id: '27',name : '27'},
			                       {id: '30',name : '30'},{id: '33',name : '33'},{id: '40',name : '40'},{id: '43',name : '43'}
			                       ,{id: '60',name : '60'},{id: '61',name : '61'}];
			//关联事件编号
			$scope.copyEventNo = function(event) {
				$scope.paramEvent = {};
				$scope.paramEvent.sceneEventNo = $.parseJSON(JSON.stringify(event));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/clearACC/clearScene/clearSceneEvent.html', $scope.paramEvent, {
					title : T.T('QFJ200005'),   //'选择触发事件编号' ,
					buttons : [T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '560px' ],
					callbacks : [$scope.sureCopyEventNo]
				});
			};
			$scope.sureCopyEventNo = function(result){
				console.log(result.scope.eventListTable.checkedList().eventNo);
				$scope.cSceneCopy.triggerNo = result.scope.eventListTable.checkedList().eventNo;
				$scope.safeApply();
				result.cancel();
			}
	});
	//清算场景详情
	webApp.controller('clearSceneViewCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translate.refresh();
		//运营模式
		$scope.operationModeArr = { 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeInfo = $scope.cSceneItem.operationMode;
	        }
	    };
		//渠道ID
//		$scope.channelIdArr = {
//				type:"dynamicDesc", 
//		        param:{},//默认查询条件 
//		        desc:"channelDescription",
//		        text:"channelId", //下拉框显示内容，根据需要修改字段名称 
//		        value:"channelId",  //下拉框对应文本的值，根据需要修改字段名称 
//		        resource:"channelMag.query",//数据源调用的action 
//		        callback: function(data){
//		        	$scope.channelIdInfo = $scope.cSceneItem.channelId;
//		        }	
//  			};
		//交易代码  00 20 27 30 33 40 43 
		$scope.clearCodeArr = [{id: '00',name : '00'},{id: '20',name : '20'},{id: '27',name : '27'},
		                       {id: '30',name : '30'},{id: '33',name : '33'},{id: '40',name : '40'},{id: '43',name : '43'}
		                       ,{id: '60',name : '60'},{id: '61',name : '61'}];
		//原交易代码
		//$scope.originalClearCodeArr = [{id: 'D',name : '每日接收'},{id: 'W',name : '工作日接收'},{id: 'S',name : '不定期接收'}];
	});
	//清算场景建立
	webApp.controller('clearSceneBulidCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.cScene = {};
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
		//渠道ID
		var form = layui.form;
		form.on('select(getChannelId)',function(event){
			//渠道ID
		});
		//交易代码  00 20 27 30 33 40 43 
		$scope.clearCodeArr = [{id: '00',name : '00'},{id: '20',name : '20'},{id: '27',name : '27'},
		                       {id: '30',name : '30'},{id: '33',name : '33'},{id: '40',name : '40'},{id: '43',name : '43'}
		                       ,{id: '60',name : '60'},{id: '61',name : '61'}];  
  		//关联事件编号
			$scope.choseEventNo = function() {
				$scope.paramEvent = {};
				$scope.paramEvent.sceneEventNo = '';
				// 页面弹出框事件(弹出页面)
				$scope.modal('/clearACC/clearScene/clearSceneEvent.html', $scope.paramEvent, {
					title : T.T('QFJ200005'),   //'选择触发事件编号' ,
					buttons : [T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '560px' ],
					callbacks : [$scope.sureEventNo]
				});
			};
			$scope.sureEventNo = function(result){
				$scope.cScene.triggerNo = result.scope.eventListTable.checkedList().eventNo;
				$scope.safeApply();
				result.cancel();
			}
	});
	//清算场景触发事件编号
	webApp.controller('clearSceneEventCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translate.refresh();
		$scope.eventListTable = {
			checkType : 'radio',
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.sceneEventNo = $scope.paramEvent.sceneEventNo;
	});
});
