'use strict';
define(function(require) {
	var webApp = require('app');
	// 清算场景列表
	webApp.controller('clearAbnormalListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translatePartialLoader.addPart('pages/clearACC/clearAbnormal/i18n_clearAbnormal');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 $scope.delBtnFlag = false;
  		$scope.cScene = {};		
		$scope.clearAbnormalList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery: false,
			resource : 'clearAbnormal.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 日期控件
 		layui.use('laydate', function(){
 			  var laydate = layui.laydate;
 			  var startDate = laydate.render({
 					elem: '#LAY_start_CAdd',
 					min:Date.now(),
 					done: function(value, date) {
 						endDate.config.min = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						};
 						endDate.config.start = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						};
 					}
 				});
 				var endDate = laydate.render({
 					elem: '#LAY_end_CAdd',
 					done: function(value, date) {
 						startDate.config.max = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						}
 					}
 				});
 		});
		$scope.queryList = function() {
				$scope.clearAbnormalList.params.stPurchaseDate = $("#LAY_start_CAdd").val();
				$scope.clearAbnormalList.params.endPurchaseDate = $("#LAY_end_CAdd").val();
				$scope.clearAbnormalList.search();
		};
		// 查看
		$scope.queryCsceneInf = function(event) {
			$scope.cSceneItem = {};
			$scope.cSceneItem = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/clearAbnormal/clearAbnormalView.html', $scope.cSceneItem, {
				title : T.T('QFJ200003'),   //'清算场景查询',
				buttons : [T.T('F00012') ],
				size : [ '950px', '520px' ],
				callbacks : [ ]
			});
		};
		// 修改
		$scope.updateClearScene = function(event) {
			$scope.cSceneUpdate = {};
			$scope.cSceneUpdate = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/clearACC/clearAbnormal/clearAbnormalUpdate.html', $scope.cSceneUpdate, {
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
			$scope.sceneUpdate.repostingInd = '1';
			$scope.sceneUpdate.purchaseDate =$("#LAY_end_UCLEARAdd").val();
			jfRest.request('clearAbnormal', 'update', $scope.sceneUpdate).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.clearAbnormalList.search();
				}
			});
		};
	}); 
	//清算场景详情
		webApp.controller('clearAbnormalViewCtrl', function($scope, $stateParams,
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
			if($scope.cSceneItem.transactionProcessingCode == '40') {
				//40消费QFJ400001
				$scope.transactionProcessingCodeInfo = T.T('QFJ400001');
			}else if($scope.cSceneItem.transactionProcessingCode == '43') {
				//43消费贷调QFJ400002
				$scope.transactionProcessingCodeInfo = T.T('QFJ400002');
			}else if($scope.cSceneItem.transactionProcessingCode == '30') {
				//30取现QFJ400003
				$scope.transactionProcessingCodeInfo = T.T('QFJ400003');
			}else if($scope.cSceneItem.transactionProcessingCode == '33') {
				//33取现贷调QFJ400004
				$scope.transactionProcessingCodeInfo = T.T('QFJ400004');
			}else if($scope.cSceneItem.transactionProcessingCode == '20') {
				//20还款QFJ400005
				$scope.transactionProcessingCodeInfo = T.T('QFJ400005');
			}else if($scope.cSceneItem.transactionProcessingCode == '27') {
				//27还款还原QFJ400006,
				$scope.transactionProcessingCodeInfo = T.T('QFJ400006');
			}else if($scope.cSceneItem.transactionProcessingCode == '41') {
				//41退货QFJ400007,
				$scope.transactionProcessingCodeInfo = T.T('QFJ400007');
			}
		});	
		//清算场景详情
		webApp.controller('clearAbnormalUpdCtrl', function($scope, $stateParams,
				jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
			$translate.use($scope.lang);
			$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
			$translate.refresh();
			// 日期控件
	 		layui.use('laydate', function(){
	 			  var laydate = layui.laydate;
	 			  var startDate = laydate.render({
	 					elem: '#LAY_end_UCLEARAdd',
	 					min:Date.now(),
	 					done: function(value, date) {
	 						endDate.config.min = {
	 							year: date.year,
	 							month: date.month - 1,
	 							date: date.date,
	 						};
	 						endDate.config.start = {
	 							year: date.year,
	 							month: date.month - 1,
	 							date: date.date,
	 						};
	 					}
	 				});	  
	 		});
			if($scope.cSceneUpdate.transactionProcessingCode == '40') {
				//40消费QFJ400001
				$scope.transactionProcessingCodeInfo = T.T('QFJ400001');
			}else if($scope.cSceneUpdate.transactionProcessingCode == '43') {
				//43消费贷调QFJ400002
				$scope.transactionProcessingCodeInfo = T.T('QFJ400002');
			}else if($scope.cSceneUpdate.transactionProcessingCode == '30') {
				//30取现QFJ400003
				$scope.transactionProcessingCodeInfo = T.T('QFJ400003');
			}else if($scope.cSceneUpdate.transactionProcessingCode == '33') {
				//33取现贷调QFJ400004
				$scope.transactionProcessingCodeInfo = T.T('QFJ400004');
			}else if($scope.cSceneUpdate.transactionProcessingCode == '20') {
				//20还款QFJ400005
				$scope.transactionProcessingCodeInfo = T.T('QFJ400005');
			}else if($scope.cSceneUpdate.transactionProcessingCode == '27') {
				//27还款还原QFJ400006,
				$scope.transactionProcessingCodeInfo = T.T('QFJ400006');
			}else if($scope.cSceneUpdate.transactionProcessingCode == '41') {
				//41退货QFJ400007,
				$scope.transactionProcessingCodeInfo = T.T('QFJ400007');
			}
		});	
});
