'use strict';
define(function(require) {
	var webApp = require('app');
	// 核算子场景表
	webApp.controller('accSubSceneListCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
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
		//运营模式列表
		$scope.accSubSceneList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountingMag.queryAccSubScene',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//记账规则代码
		$scope.accountingRuleCodeArray = { 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingRuleDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingRuleCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingMag.queryAccRuleMaster",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//红字记账法标识 	R-红字 N-蓝字',
		$scope.redAccountingFlagArray = [{name:T.T('YYJ5400038'),id:'R'},{name:T.T('YYJ5400039'),id:'N'}];
		// 新增
		$scope.accSubSceneAdd = function(event) {
			$scope.accSubSceneInf = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/accSubSceneEst.html',$scope.accSubSceneInf, {
				title : T.T('YYJ5400047'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '380px' ],
				callbacks : [$scope.accSubSceneSave]
			});
		};
		//保存
		$scope.accSubSceneSave = function(result){
			$scope.accSubSceneInf = result.scope.accSubSceneInf;
			if($scope.accSubSceneInf.enableLogo=="S"){
				delete $scope.accSubSceneInf.startAssetTransitionPhase;
				delete $scope.accSubSceneInf.targetAssetTransitionPhase;
				delete $scope.accSubSceneInf.sameCurrency;
			}else if($scope.accSubSceneInf.enableLogo=="A"){
				delete $scope.accSubSceneInf.lastSettleState;
				delete $scope.accSubSceneInf.settleState;
				delete $scope.accSubSceneInf.sameCurrency;
			}else if($scope.accSubSceneInf.enableLogo=="C"){
				delete $scope.accSubSceneInf.lastSettleState;//原核算状态
				delete $scope.accSubSceneInf.settleState;//目标核算状态
				delete $scope.accSubSceneInf.startAssetTransitionPhase;//原资产转变阶段
				delete $scope.accSubSceneInf.targetAssetTransitionPhase;//目标资产转变阶段
			}
			jfRest.request('accountingMag', 'saveAccSubScene', $scope.accSubSceneInf) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accSubSceneInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.accSubSceneList.search();
				}
			});
		};
		// 查看
		$scope.checkAccSubSceneInf = function(event) {
			$scope.accSubSceneInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccSubScene.html',
			$scope.accSubSceneInf, {
				title : T.T('YYJ5400048'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '350px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateAccSubSceneInf = function(event) {
			$scope.accSubSceneUp = {};
			$scope.accSubSceneUp = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateAccSubScene.html',
			$scope.accSubSceneUp, {
				title : T.T('YYJ5400049'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '350px' ],
				callbacks : [ $scope.updateaccSubScene ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateaccSubScene = function(result) {
			$scope.accSubScene = result.scope.accSubSceneUp;
			$scope.accSubScene.enableLogo = result.scope.dataEnableLogo;//启用核算状态
			$scope.accSubScene.lastSettleState = result.scope.uplastSettleState;//原核算状态
			$scope.accSubScene.settleState = result.scope.upsettleState;//目标核算状态
			$scope.accSubScene.startAssetTransitionPhase = result.scope.upstartAssetTransitionPhase;//原资产转变阶段
			$scope.accSubScene.targetAssetTransitionPhase = result.scope.uptargetAssetTransitionPhase;//目标资产转变阶段
			$scope.accSubScene.sameCurrency = result.scope.updateSameCurrency;//目标资产转变阶段
			if($scope.accSubScene.enableLogo=="S"){
				delete $scope.accSubScene.startAssetTransitionPhase;
				delete $scope.accSubScene.targetAssetTransitionPhase;
				delete $scope.accSubScene.sameCurrency;
			}else if($scope.accSubScene.enableLogo=="A"){
				delete $scope.accSubScene.lastSettleState;
				delete $scope.accSubScene.settleState;
				delete $scope.accSubScene.sameCurrency;
			}else if($scope.accSubScene.enableLogo=="C"){
				delete $scope.accSubScene.lastSettleState;//原核算状态
				delete $scope.accSubScene.settleState;//目标核算状态
				delete $scope.accSubScene.startAssetTransitionPhase;//原资产转变阶段
				delete $scope.accSubScene.targetAssetTransitionPhase;//目标资产转变阶段
			}
			jfRest.request('accountingMag', 'updateAccSubScene', $scope.accSubScene) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.accSubSceneList.search();
				}
			});
		};
		//删除
		$scope.deleteAccSubSceneInf =  function(event) {
			$scope.accSubSceneInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ5400044"),function(){//确定
				jfRest.request('accountingMag', 'deleteAccSubScene', $scope.accSubSceneInf) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.accSubSceneList.search();
					}
				});
			},function(){//取消
			})
		};
	});
	//新增核算类型定义
	webApp.controller('accSubSceneEstCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//启用核算状态
		$scope.stateUseFlagArray = [{name:T.T('YYH5400118'),id:"S"},{name:T.T('YYH5400101'),id:"A"},{name:T.T('YYH5400097'),id:"C"}];
		//清算与入账币种相同/清算与入账币种不相同
		$scope.sameCurrencyArray = [{name:T.T('YYJ5400050'),id:"Y"},{name:T.T('YYJ5400051'),id:"N"}];
		$scope.stateDiv=false;
		$scope.showDiv=false;
		$scope.currencyDiv=false;
		//监听核算状态单选
		var form = layui.form;
		form.on('radio(enableRadio)', function(data) {
			var data=data;
			if(data.value == 'C') {
				$scope.stateDiv = false;
				$scope.showDiv=false;
				$scope.currencyDiv=true;
				$scope.accSubSceneInf.lastSettleState = '';
				$scope.accSubSceneInf.settleState = '';
				$scope.accSubSceneInf.startAssetTransitionPhase = '';
				$scope.accSubSceneInf.targetAssetTransitionPhase = '';
			}else if(data.value == 'S') {
				$scope.stateDiv = true;
				$scope.showDiv=false;
				$scope.currencyDiv=false;
				$scope.accSubSceneInf.startAssetTransitionPhase = "";
				$scope.accSubSceneInf.targetAssetTransitionPhase = "";
				$scope.accSubSceneInf.sameCurrency = "";
			}else if(data.value == 'A') {
				$scope.showDiv=true;
				$scope.stateDiv = false;
				$scope.currencyDiv=false;
				$scope.accSubSceneInf.lastSettleState = '';
				$scope.accSubSceneInf.settleState = '';
				$scope.accSubSceneInf.sameCurrency = "";
            }
        });
		//原核算状态  //目标核算状态
		$scope.lastSettleStateArr = { 
			type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingStatus.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//原资产转变阶段
		$scope.OriginalAssetsArr = { 
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_capitalStage",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				
			}
		};
		//目标资产转变阶段
		$scope.targetAssetsArr = { 
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_capitalStage",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				
			}
	    };
		$scope.operationModeArr = { 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//核算状态  =====从库表获取
		$scope.accountingStatusArr = { 
			type:"dynamicDesc", 
	        param:{Flag:'Y'},//默认查询条件 
	        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
	        desc: "accountingDesc", 
	        resource:"accountingStatus.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		$scope.accSubSceneInf  = $scope.accSubSceneInf ;
		$scope.choseBtn = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/choseEvent_accMag.html', $scope.params, {
				title : T.T('YYJ400027'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseEvent]
			});
		};
		$scope.choseEvent = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.accSubSceneInf.masterSceneSequence = $scope.checkedEvent.eventNo;
			$scope.accSubSceneInf.masterSceneDesc = $scope.checkedEvent.eventDesc;
			$scope.safeApply();
			result.cancel();
		};
	});
	//修改
	webApp.controller('updateAccSubSceneCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.stateUseFlagArray = [{name:T.T('YYH5400118'),id:"S"},{name:T.T('YYH5400101'),id:"A"},{name:T.T('YYH5400097'),id:"C"}];
		//清算与入账币种相同/清算与入账币种不相同
		$scope.sameCurrencyArrayU = [{name:T.T('YYJ5400050'),id:"Y"},{name:T.T('YYJ5400051'),id:"N"}];
		$scope.upenableLogo = $scope.accSubSceneUp.enableLogo;
		$scope.updateSameCurrency = $scope.accSubSceneUp.sameCurrency;
		$scope.currencyDivU = false;
		//console.log( $scope.accSubSceneUp.enableLogo)
		if($scope.accSubSceneUp.enableLogo == 'C') {
			$scope.stateDiv = false;
			$scope.showDiv = false;
			$scope.currencyDivU = true;
		}else if($scope.accSubSceneUp.enableLogo == 'S') {
			$scope.stateDiv = true;
			$scope.showDiv = false;
			$scope.currencyDivU = false;
		}else if($scope.accSubSceneUp.enableLogo == 'A') {
			$scope.showDiv = true;
			$scope.stateDiv = false;
			$scope.currencyDivU = false;
		}
		//监听核算状态单选
		var form = layui.form;
		form.on('radio(enableRadio)', function(data) {
			var data=data;
			$scope.dataEnableLogo=data.value;
			if(data.value == 'C') {
				$scope.stateDiv = false;
				$scope.showDiv=false;
				$scope.currencyDivU = true;
				$scope.upsettleState = '';
				$scope.uplastSettleState = '';
				$scope.upstartAssetTransitionPhase = '';
				$scope.uptargetAssetTransitionPhase = '';
			}else if(data.value == 'S') {
				$scope.stateDiv = true;
				$scope.showDiv=false;
				$scope.currencyDivU = false;
				$scope.upstartAssetTransitionPhase = '';
				$scope.uptargetAssetTransitionPhase = '';
				$scope.updateSameCurrency = '';
			}else if(data.value == 'A') {
				$scope.showDiv=true;
				$scope.stateDiv = false;
				$scope.currencyDivU = false;
				$scope.upsettleState = '';
				$scope.uplastSettleState = '';
				$scope.updateSameCurrency = '';
            }
        });
		//原核算状态
		$scope.lastSettleStateArr = { 
			type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingStatus.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.uplastSettleState = $scope.accSubSceneUp.lastSettleState;
	        }
		};
		//目标核算状态
		$scope.settleStateArr = { 
			type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingStatus.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.upsettleState = $scope.accSubSceneUp.settleState;
	        }
	    };
		//原资产转变阶段
		$scope.OriginalAssetsArr = { 
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_capitalStage",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.upstartAssetTransitionPhase = $scope.accSubSceneUp.startAssetTransitionPhase;
			}
		};
		//目标资产转变阶段
		$scope.targetAssetsArr = { 
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_capitalStage",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.uptargetAssetTransitionPhase = $scope.accSubSceneUp.targetAssetTransitionPhase;
			}
	    };
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateOperationMode = $scope.accSubSceneUp.operationMode;
		        }
		    };
		$scope.choseBtn = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/choseEvent_accMagup.html', $scope.params, {
				title : T.T('YYJ400027'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseEvent]
			});
		};
		$scope.choseEvent = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.accSubSceneUp.masterSceneSequence = $scope.checkedEvent.eventNo;
			$scope.accSubSceneUp.masterSceneDesc = $scope.checkedEvent.eventDesc;
			$scope.safeApply();
			result.cancel();
		};
	});
	//详情
	webApp.controller('viewAccSubSceneCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();	
		$scope.accSubSceneInf = $scope.accSubSceneInf;
		//启用核算状态
		$scope.stateUseFlagArray = [{name:T.T('YYH5400118'),id:"S"},{name:T.T('YYH5400101'),id:"A"},{name:T.T('YYH5400097'),id:"C"}];
		//清算与入账币种相同/清算与入账币种不相同
		$scope.sameCurrencyArrayI = [{name:T.T('YYJ5400050'),id:"Y"},{name:T.T('YYJ5400051'),id:"N"}];
		$scope.vwenableLogo = $scope.accSubSceneInf.enableLogo;
		$scope.sameCurrencyview = $scope.accSubSceneInf.sameCurrency;
		$scope.currencyDivI = false;
		if($scope.accSubSceneInf.enableLogo == 'C') {
			$scope.stateDiv = false;
			$scope.showDiv = false;
			$scope.currencyDivI = true;
		}else if($scope.accSubSceneInf.enableLogo == 'S') {
			$scope.stateDiv = true;
			$scope.showDiv = false;
			$scope.currencyDivI = false;
		}else if($scope.accSubSceneInf.enableLogo == 'A') {
			$scope.showDiv = true;
			$scope.stateDiv = false;
			$scope.currencyDivI = false;
		}
		//原核算状态
		$scope.lastSettleStateArr = { 
			type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingStatus.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwlastSettleState = $scope.accSubSceneInf.lastSettleState;
	        }
		};
		//目标核算状态
		$scope.settleStateArr = { 
			type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingStatus.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwsettleState = $scope.accSubSceneInf.settleState;
	        }
	    };
		//原资产转变阶段
		$scope.OriginalAssetsArr = { 
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_capitalStage",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.vwstartAssetTransitionPhase= $scope.accSubSceneInf.startAssetTransitionPhase;
			}
		};
		//目标资产转变阶段
		$scope.targetAssetsArr = { 
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_capitalStage",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.vwtargetAssetTransitionPhase = $scope.accSubSceneInf.targetAssetTransitionPhase;
			}
	    };
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	//$scope.updateOperationMode = $scope.optModeInf2.operationMode;
		        	$scope.updateOperationMode = $scope.accSubSceneInf.operationMode;
		        }
		    };
		//记账规则代码
		$scope.accountingRuleCodeArray = { 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"accountingRuleDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"accountingRuleCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"accountingMag.queryAccRuleMaster",//数据源调用的action 
	        callback: function(data){
	        	$scope.upodateAccountingRuleCode = $scope.accSubSceneInf.accountingRuleCode;
	        }
	    };
	});
});
