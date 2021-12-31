'use strict';
define(function(require) {
	var webApp = require('app');
	// 渠道查询及维护
	webApp.controller('channelListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
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
		   	   		if($scope.eventList.search('MIS.IQ.01.0001') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('MIS.AD.01.0001') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('MIS.UP.01.0001') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   		if($scope.eventList.search('MIS.UP.01.0002') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
  				}
  			});
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
		$scope.channelList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery: false,
			resource : 'channelMag.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		/*D:每日接收
		W:工作日接收
		S:不定期接收
		数据接收模式*/
		$scope.dataReceivingModeArr = [{
			id: 'D',
			name : T.T('QFH100006')
		},{
			id: 'W',
			name : T.T('QFH100007')
		},{
			id: 'S',
			name : T.T('QFH100008')
		}];
		// 新增
		$scope.channelAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/channelMag/channelBuild.html','', {
				title : T.T('QFJ100001'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '320px' ],
				callbacks : [$scope.saveChannelInf]
			});
		};
		//保存
		$scope.saveChannelInf = function(result){
			$scope.channelInf = {};
			$scope.channelInf = result.scope.channelInf;
			jfRest.request('channelMag', 'save', $scope.channelInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.channelInf = {};
					result.scope.channelInfForm.$setPristine();
					$scope.channelList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//复制
		$scope.copyChannel = function(event){
			$scope.channelCopy = {};
			$scope.channelCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/channelMag/channelCopy.html',$scope.channelCopy, {
				title : T.T('QFJ100002'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '320px' ],
				callbacks : [ $scope.sureCopychannel]
			});
		};
		//保存=========复制
		$scope.sureCopychannel = function(result){
			$scope.channelInfCopy = {};
			$scope.channelInfCopy = result.scope.channelCopy;
			$scope.channelInfCopy.operationMode = result.scope.copyOperationMode;
			$scope.channelInfCopy.dataReceivingMode=result.scope.dataReceivingMode;
			jfRest.request('channelMag', 'save', $scope.channelInfCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.channelCopy = {};
					result.scope.channelCopyForm.$setPristine();
					$scope.channelList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 查看
		$scope.queryChannelInf = function(event) {
			$scope.channelInf = {};
			$scope.channelInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/channelMag/viewChannel.html', $scope.channelInf, {
				title : T.T('QFJ100004'),
				buttons : [T.T('F00012') ],
				size : [ '1000px', '320px' ],
				callbacks : [ ]
			});
		};
		// 修改
		$scope.updateChannelInf = function(event) {
			$scope.channelInf = {};
			$scope.channelInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/channelMag/updateChannel.html', $scope.channelInf, {
				title : T.T('QFJ100003'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '320px' ],
				callbacks : [ $scope.upChannel]
			});
		};
		// 修改回调函数/确认按钮事件
		$scope.upChannel = function(result) {
			$scope.paramss = result.scope.channelInf;
			$scope.paramss.operationMode = result.scope.updateOperationMode;
			$scope.paramss.dataReceivingMode=result.scope.dataReceivingMode;
			jfRest.request('channelMag', 'update', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));   //修改成功
					$scope.safeApply();
					result.cancel();
					$scope.channelList.search();
				}
			});
		};
		//删除
		$scope.deleteChannelInf = function(item) {
			$scope.items = $.parseJSON(JSON.stringify(item));
			jfLayer.confirm(T.T('F00092'),function() {
				jfRest.request('channelMag', 'deleteMa', $scope.items).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.items = {};
						$scope.channelList.search();
					}
				});
			},function() {
			});
		};
	});
	//渠道修改
	webApp.controller('updateChannelCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
		$translate.refresh();
		/* 数据接收模式   D:每日接收，W:工作日接收，S:不定期接收*/
		$scope.dataReceivingModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dataReceivingMode",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dataReceivingMode=$scope.channelInf.dataReceivingMode;
			}
		};
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateOperationMode = $scope.channelInf.operationMode;
		        }
		    };
	});
	//渠道复制
	webApp.controller('channelCopyCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
		$translate.refresh();
		/* 数据接收模式   D:每日接收，W:工作日接收，S:不定期接收*/
		$scope.dataReceivingModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dataReceivingMode",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dataReceivingMode=$scope.channelCopy.dataReceivingMode;
			}
		};
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.copyOperationMode = $scope.channelCopy.operationMode;
		        }
		    };
	});
	//渠道查询
	webApp.controller('viewChannelCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
		$translate.refresh();
		/*数据接收模式  D:每日接收,W:工作日接收,S:不定期接收*/
		$scope.dataReceivingModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dataReceivingMode",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dataReceivingMode=$scope.channelInf.dataReceivingMode;
			}
		};
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.infoOperationMode = $scope.channelInf.operationMode;
		        }
		    };
	});
	//渠道定义
	webApp.controller('channelBulidCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.channelInf = {}; 
		/*D:每日接收
		W:工作日接收
		S:不定期接收
		数据接收模式*/
		$scope.dataReceivingModeArr = [{
			id: 'D',
			name : T.T('QFH100006')
		},{
			id: 'W',
			name : T.T('QFH100007')
		},{
			id: 'S',
			name : T.T('QFH100008')
		}];
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        }
		    };
	});
});
