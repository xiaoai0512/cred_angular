'use strict';
define(function(require) {
	var webApp = require('app');
	// 清算场景列表
	webApp.controller('clearResultCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearResult/i18n_clearResult');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
  		$scope.channelIdArr = {
			type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        desc:"channelDescription",
	        text:"channelId", //下拉框显示内容，根据需要修改字段名称 
	        value:"channelId",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"channelMag.query",//数据源调用的action 
	        callback: function(data){
	        }	
		};
  		$scope.isOne = false;
  		$scope.isTwo = false;
  		$scope.isThree = false;
  		//处理明细查询
		$scope.clearHandleList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery : false,
			resource : 'clearResult.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isTwo = true;
					//$scope.isOne = false;
					//$scope.isThree = false;
				}
			}
		};
		//交易代码  {id: '1',name : T.T('QFJ300001')}
		$scope.queryFileFlagArr = [{id: '2',name : T.T('QFJ300002')}];
		//清算处理查询事件
		$scope.queryList = function(){
			$scope.clearHandleList.params.queryFileFlag = '1';
			$scope.clearHandleList.params.channelId = $scope.channelId;
			$scope.clearHandleList.params.fileName = $scope.fileName;
			$scope.clearHandleList.params.dateOfFileDelivery = $scope.dateOfFileDelivery;
			$scope.clearHandleList.search();
		};
		//重置
		$scope.resetPar = function(){
			$scope.queryFileFlag = "";
			$scope.channelId = "";
			$scope.fileName = "";
			$scope.dateOfFileDelivery = "";
		};
		//查看处理明细列表弹框事件
		$scope.viewDetails = function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			$scope.itemInf.queryFileFlag= '2';
			$scope.modal('/clearACC/clearResult/viewDetails.html', $scope.itemInf, {
				title : T.T('QFJ300002'),//'查看处理明细',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '1030px', '500px' ],
				callbacks : [],
				/*jfRest.request('clearResult', 'query', $scope.itemInf).then(function(data) {
				if (data.returnCode == '000000') {
						$scope.modal('/clearACC/clearResult/viewDetails.html', $scope.itemInf, {
						title : T.T('QFJ300002'),//'查看处理明细',
						buttons : [T.T('F00012') ],//'关闭'
						size : [ '1030px', '500px' ],
						callbacks : []
					});
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
					jfLayer.fail(returnMsg);
				}*/
			});
		};
		/*//1-文件和批次拒绝查询
		$scope.clearFileList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery : false,
			resource : 'clearResult.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isOne = true;
					$scope.isTwo = false;
					$scope.isThree = false;
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035');
					jfLayer.fail(returnMsg);
				}
			}
		};*/
		/*//拒绝明细信息
		$scope.refuseInfoList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery : false,
			resource : 'clearResult.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isThree = true;
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035');
					jfLayer.fail(returnMsg);
					$scope.isThree = false;
				}
			}	
		};*/
		//拒绝明细查询
		/*$scope.rejectionReasonInfo = function(event){
			$scope.refuseItem = {};
			$scope.refuseItem = $.parseJSON(JSON.stringify(event));
			$scope.refuseInfoList.params.queryFileFlag = '3';
			$scope.refuseInfoList.params.channelId = $scope.refuseItem.channelId;
			$scope.refuseInfoList.params.dateOfFileDelivery = $scope.refuseItem.dateOfFileDelivery;
			$scope.refuseInfoList.params.batchHeader = $scope.refuseItem.batchHeader;
			$scope.refuseInfoList.search();
		}*/
	});
	// 查看处理明细列表
	webApp.controller('viewDetailsCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearResult/i18n_clearResult');
		$translate.refresh();
		$scope.items=$scope.itemInf;
		//处理明细列表
		$scope.liquidationList = {
			autoQuery:true,
			params : {
				"pageSize":10,
				"indexNo":0,
				queryFileFlag: '2',
				adminFlagUser: $scope.items.adminFlagUser,
				channelId: $scope.items.channelId,
				clientToken: $scope.items.clientToken,
				corporation: $scope.items.corporation,
				endProcessDate: $scope.items.endProcessDate,
				endProcessTime: $scope.items.endProcessTime,
				failCount: $scope.items.failCount,
				fileName: $scope.items.fileName,
				id: $scope.items.id,
				operatorId: $scope.items.operatorId,
				processStatus: $scope.items.processStatus,
				queryFileFlag: $scope.items.queryFileFlag,
				stProcessDate: $scope.items.stProcessDate,
				stProcessTime: $scope.items.stProcessTime,
				totalCount: $scope.items.totalCount,
				userLanguage: $scope.items.userLanguage
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'clearResult.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
				     //console.log();
				}
			}
		};
//		// 查看处理明细详细信息
//		$scope.handleInfo = function(event) {
//			$scope.handleItem = {};
//			$scope.handleItem = $.parseJSON(JSON.stringify(event));
//			// 页面弹出框事件(弹出页面)
//			$scope.modal('/clearACC/clearResult/handleResultView.html', $scope.handleItem, {
//				title : T.T('QFJ300005'),   //'明细交易详细信息',
//				buttons : [T.T('F00012') ],
//				size : [ '1020px', '520px' ],
//				callbacks : [ ]
//			});
//		};
	});
	//查看处理明细详细信息
//	webApp.controller('handleViewCtrl', function($scope, $stateParams, jfRest,
//			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
//		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
//		$translate.use($scope.lang);
//		$translatePartialLoader.addPart('pages/clearACC/clearResult/i18n_clearResult');
//		$translate.refresh();
//	});
});
