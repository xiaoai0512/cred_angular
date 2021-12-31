'use strict';
define(function(require) {
	var webApp = require('app');
	//构件实例查询及维护
	webApp.controller('accountingStatusQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translate.refresh();
		$scope.accountingStatusInf = {};
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 $scope.copyBtnFlag =false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0051') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.AD.02.0043') != -1){    //新增
						$scope.addBtnFlag = true;
					}
					else{
						$scope.addBtnFlag = false;
					}
			   	   	if($scope.eventList.search('COS.UP.02.0046') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   					$scope.copyBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   					$scope.copyBtnFlag = false;
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
			 $scope.accountingStatus = [{name:T.T("YYJ5000005"),id:"000"},{name:T.T("YYJ5000006"),id:"001"},{name:T.T("YYJ5000007"),id:"002"}]; //核算状态
			//构件实例列表
			$scope.accountingStatusTable = {
				params : {
						"pageSize":10,
						"indexNo":0,
						Flag:'N'
				}, // 表格查询时的参数信息
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_absStatus','dic_revenueRecognitionStage','dic_revenueRecognitionStage','dic_rollBACK','dic_isYorN'],//查找数据字典所需参数
				transDict : ['subjectStatus_subjectStatusDesc','feeIncomeRecognitionStage_feeIncomeRecognitionStageDesc','intIncomeRecognitionStage_intIncomeRecognitionStageDesc','rollBack_rollBackDesc','nonPerformingAssets_nonPerformingAssetsDesc'],//翻译前后key
				paging : true,// 默认true,是否分页
				resource : 'accountingStatus.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			//查询
			$scope.queryAccountingStatus = function(item) {
				$scope.accountingStatusInf ={};
				// 页面弹出框事件(弹出页面)
				$scope.accountingStatusInf = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/accountingStatus/queryAccountingStatus.html', $scope.accountingStatusInf, {
					title : T.T('YYJ5000002'),
					buttons : [  T.T('F00012')],
					size : [ '1050px', '450px'  ],
					callbacks : []
				});
			};
			//修改
			$scope.updateAccountingStatus = function(item) {
				$scope.accountingUpdate={};
				// 页面弹出框事件(弹出页面)
				$scope.accountingUpdate = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/accountingStatus/updateAccountingStatus.html', $scope.accountingUpdate, {
					title : T.T('YYJ5000003'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1050px', '450px'  ],
					callbacks : [$scope.saveAccountingStatus]
				});
			};
			//新增
			$scope.accountingLayout = function(){
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/accountingStatus/accountingStatusEst.html', '', {
					title : T.T('YYJ5000001'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '1050px', '450px' ],
					callbacks : [$scope.saveAccountStatus ]
				});
			};
			//新增回调函数
			$scope.saveAccountStatus = function(result){
				$scope.accountingStatusInf = {};
				$scope.accountingStatusInf = result.scope.accountingStatusInf;
				if( (result.scope.accountingStatusInf.blockCodeType) &&
						(result.scope.accountingStatusInf.blockCodeScene == "" || result.scope.accountingStatusInf.blockCodeScene == undefined || result.scope.accountingStatusInf.blockCodeScene == null) ){
					jfLayer.alert(T.T("YYJ5000012")) ;
					return;
                }
                jfRest.request('accountingStatus', 'save', $scope.accountingStatusInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00032")) ;
						$scope.accountingStatusInf = {};
						result.scope.accountStatusForm.$setPristine();
						$scope.accountingStatusTable.search();
						$scope.safeApply();
						result.cancel();
					}
				});
			};
			//复制
			$scope.copyAccountingStatus = function(item){
				// 页面弹出框事件(弹出页面)
				$scope.accountingStatuscopy = {};
				$scope.accountingStatuscopy = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/accountingStatus/accountingStatusCopy.html', $scope.accountingStatuscopy, {
					title : T.T('YYJ5000004'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1050px', '450px'  ],
					callbacks : [$scope.saveAccountStatusAdd]
				});
			};
			//复制回调函数
			$scope.saveAccountStatusAdd = function(result){
				$scope.accountingStatusInfCopy = {};
				$scope.accountingStatusInfCopy = result.scope.accountingStatuscopy;
				$scope.accountingStatusInfCopy.feeIncomeRecognitionStage = result.scope.feeIncomeRecognitionStage;
				$scope.accountingStatusInfCopy.intIncomeRecognitionStage = result.scope.intIncomeRecognitionStage;
				$scope.accountingStatusInfCopy.rollBack = result.scope.rollBack;
				$scope.accountingStatusInfCopy.blockCodeType = result.scope.blockCodeType;
				$scope.accountingStatusInfCopy.subjectStatus = result.scope.subjectStatuscopy;
				if( ($scope.accountingStatusInfCopy.blockCodeType) &&
						(result.scope.effectivenessCodeSceneCopy == "" || result.scope.effectivenessCodeSceneCopy == undefined || result.scope.effectivenessCodeSceneCopy == null) ){
					jfLayer.alert(T.T("YYJ5000012")) ;
					return;
                }
                $scope.accountingStatusInfCopy.operationMode = result.scope.copyOperationMode;
				$scope.accountingStatusInfCopy.blockCodeScene = result.scope.effectivenessCodeSceneCopy;
				console.log($scope.accountingStatusInfCopy);
				jfRest.request('accountingStatus', 'save', $scope.accountingStatusInfCopy).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00032")) ;
						 $scope.accountingStatusInfCopy = {};
						 result.scope.accountStatusForm.$setPristine();
						 $scope.accountingStatusTable.search();
						 $scope.safeApply();
						 result.cancel();
					}
				});
			};
			//修改   保存
			$scope.saveAccountingStatus = function (result){
				$scope.accountingStatusUpdate= {};
				$scope.accountingStatusUpdate = result.scope.accountingUpdate;
				$scope.accountingStatusUpdate.feeIncomeRecognitionStage = result.scope.feeIncomeRecognitionStage;
				$scope.accountingStatusUpdate.intIncomeRecognitionStage = result.scope.intIncomeRecognitionStage;
				$scope.accountingStatusUpdate.rollBack = result.scope.rollBack;
				$scope.accountingStatusUpdate.blockCodeType = result.scope.blockCodeType;
				$scope.accountingStatusUpdate.subjectStatus = result.scope.subjectStatusupdate;
				$scope.accountingStatusUpdate.nonPerformingAssets = result.scope.upnonPerformingAssets;
				if( ($scope.accountingStatusUpdate.blockCodeType != "null") && ($scope.accountingStatusUpdate.blockCodeType != "") && ($scope.accountingStatusUpdate.blockCodeType != null) &&
					(result.scope.effectivenessCodeSceneUpdate == "" || result.scope.effectivenessCodeSceneUpdate == undefined || result.scope.effectivenessCodeSceneUpdate == null) ){
					jfLayer.alert(T.T("YYJ5000012")) ;
					return;
                }
                if($scope.accountingStatusUpdate.blockCodeType == "null" || $scope.accountingStatusUpdate.blockCodeType == "" || $scope.accountingStatusUpdate.blockCodeType == null){
					$scope.accountingStatusUpdate.blockCodeType = "";
				}
				if($scope.accountingStatusUpdate.feeIncomeRecognitionStage == "null" || $scope.accountingStatusUpdate.feeIncomeRecognitionStage == "" || $scope.accountingStatusUpdate.feeIncomeRecognitionStage == null){
					$scope.accountingStatusUpdate.feeIncomeRecognitionStage = "";
                }
                if($scope.accountingStatusUpdate.intIncomeRecognitionStage == "null" || $scope.accountingStatusUpdate.intIncomeRecognitionStage == "" || $scope.accountingStatusUpdate.intIncomeRecognitionStage == null){
					$scope.accountingStatusUpdate.intIncomeRecognitionStage = "";
                }
                $scope.accountingStatusUpdate.blockCodeScene = result.scope.effectivenessCodeSceneUpdate;
				jfRest.request('accountingStatus', 'update', $scope.accountingStatusUpdate).then(function(data) {
					if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00022'));
						 $scope.safeApply();
						 result.cancel();
						 $scope.accountingStatusTable.search();
						 $scope.accountingStatusUpdate = {};
					}
				});
			}
	});
	webApp.controller('queryAccountingStatusCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translate.refresh();
		 //科目属性
		$scope.subjectStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_absStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData:'N',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.subjectStatusInfo = $scope.accountingStatusInf.subjectStatus;
			}
		};
		//不良资产
		$scope.nonPerformingAssetsArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.nonPerformingAssets = $scope.accountingStatusInf.nonPerformingAssets;
			}
		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {       
				$scope.blockCodeType = $scope.accountingStatusInf.blockCodeType;
			}
		};
		//是否可回滚
		$scope.rollBackArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_rollBACK",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.rollBack = $scope.accountingStatusInf.rollBack;
			}
		};
		//费用收入确认阶段
		$scope.FeeIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.feeIncomeRecognitionStage = $scope.accountingStatusInf.feeIncomeRecognitionStage;
			}
		};
		//利息收入确认阶段
		$scope.IntIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.intIncomeRecognitionStage = $scope.accountingStatusInf.intIncomeRecognitionStage;
			}
		};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewOperationMode = $scope.accountingStatusInf.operationMode
	        }
	    };
		$scope.blockCodeSceneArr ={ 
	        type:"dynamicDesc", 
	        param:{effectivenessCodeType:$scope.accountingStatusInf.blockCodeType},//默认查询条件 
	        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
	        desc:"effectivenessCodeDesc",
	        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"blockCode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewEffectivenessCodeScene = $scope.accountingStatusInf.blockCodeScene;
	        	$timeout(function(){
	        		Tansun.plugins.render('select');
				});
	        }
		};
	});
	webApp.controller('updateAccountingStatusCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translate.refresh();
		 //科目属性
		$scope.subjectStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_absStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData:'N',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.subjectStatusupdate = $scope.accountingUpdate.subjectStatus;
			}
		};
		//不良资产
		$scope.nonPerformingAssetsArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.upnonPerformingAssets = $scope.accountingUpdate.nonPerformingAssets;
			}
		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.blockCodeType=$scope.accountingUpdate.blockCodeType;
			}
		};
		//是否可回滚
		$scope.rollBackArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_rollBACK",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.rollBack = $scope.accountingUpdate.rollBack;
			}
		}; 
		
		//费用收入确认阶段
		$scope.FeeIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.feeIncomeRecognitionStage = $scope.accountingUpdate.feeIncomeRecognitionStage;
			}
		};
		//利息收入确认阶段
		$scope.IntIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.intIncomeRecognitionStage = $scope.accountingUpdate.intIncomeRecognitionStage;
			}
		};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewOperationMode = $scope.accountingUpdate.operationMode;
	        }
	    };
		$scope.blockCodeSceneArr ={ 
	        type:"dynamicDesc", 
	        param:{effectivenessCodeType:$scope.blockCodeType},//默认查询条件 
	        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
	        desc:"effectivenessCodeDesc",
	        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"blockCode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.effectivenessCodeSceneUpdate = $scope.accountingUpdate.blockCodeScene
	        }
		};
		var form = layui.form;
		form.on('select(getBlockCodeType)',function(data){
			if(data.value == "" || data.value == undefined){//身份证
				$("#blockCodeScene").attr("disabled",true);
				$scope.effectivenessCodeSceneUpdate = "";
			}else {
				//封锁码场景
				 $scope.blockCodeSceneArr ={ 
			        type:"dynamicDesc", 
			        param:{effectivenessCodeType:$scope.blockCodeType},//默认查询条件 
			        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
			        desc:"effectivenessCodeDesc",
			        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"blockCode.query",//数据源调用的action 
			        callback: function(data){
			        }
				};
				 $("#blockCodeScene").removeAttr("disabled");
			}
		});
	});
	webApp.controller('copyAccountingStatusCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translate.refresh();
		 //科目属性
		$scope.subjectStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_absStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData:'N',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.subjectStatuscopy = $scope.accountingStatuscopy.subjectStatus;
			}
		};
		//不良资产
		$scope.nonPerformingAssetsArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.nonPerformingAssets = $scope.accountingStatusInf.nonPerformingAssets;
			}
		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {       
				$scope.blockCodeType = $scope.accountingStatuscopy.blockCodeType;
			}
		};
		//是否可回滚
		$scope.rollBackArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_rollBACK",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.rollBack = $scope.accountingStatuscopy.rollBack;
			}
		};
		//费用收入确认阶段
		$scope.FeeIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.feeIncomeRecognitionStage = $scope.accountingStatuscopy.feeIncomeRecognitionStage;
			}
		};
		//利息收入确认阶段
		$scope.IntIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.intIncomeRecognitionStage = $scope.accountingStatuscopy.intIncomeRecognitionStage;
			}
		};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.copyOperationMode = $scope.accountingStatuscopy.operationMode
	        }
	    };
		$scope.blockCodeSceneArr ={ 
	        type:"dynamicDesc", 
	        param:{effectivenessCodeType:$scope.accountingStatuscopy.blockCodeType},//默认查询条件 
	        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
	        desc:"effectivenessCodeDesc",
	        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"blockCode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.effectivenessCodeSceneCopy = $scope.accountingStatuscopy.blockCodeScene
	        }
		};
		var form = layui.form;
		form.on('select(getBlockCodeType)',function(data){
			if(data.value == "" || data.value == undefined){//身份证
				$("#blockCodeScene").attr("disabled",true);
				$scope.effectivenessCodeSceneCopy = "";
			}else {
				//封锁码场景
				 $scope.blockCodeSceneArr ={ 
			        type:"dynamicDesc", 
			        param:{effectivenessCodeType:$scope.blockCodeType},//默认查询条件 
			        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
			        desc:"effectivenessCodeDesc",
			        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"blockCode.query",//数据源调用的action 
			        callback: function(data){
			        }
				};
				 $("#blockCodeScene").removeAttr("disabled");
			}
		});
	});
	// 业务项目列表新增
	webApp.controller('accountingStatusEstCtrl', function($scope, $stateParams, jfRest,$http,$timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translate.refresh();
		$scope.accountingStatusInf = {};
		//運營模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 //科目属性
		$scope.subjectStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_absStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData:'N',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//不良资产
		$scope.nonPerformingAssetsArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.nonPerformingAssets = $scope.accountingStatusInf.nonPerformingAssets;
			}
		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//是否可回滚
		$scope.rollBackArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_rollBACK",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};     
		//费用收入确认阶段
		$scope.FeeIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//利息收入确认阶段
		$scope.IntIncomeRecognitionStage = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_revenueRecognitionStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		 $scope.accountingStatus = [{name:T.T("YYJ5000005"),id:"000"},{name:T.T("YYJ5000006"),id:"001"},{name:T.T("YYJ5000007"),id:"002"}]; //核算状态
		 //封锁码场景
		 $scope.blockCodeSceneArr ={ 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
	        desc:"effectivenessCodeDesc",
	        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"blockCode.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		var form = layui.form;
		form.on('select(getBlockCodeType)',function(data){
			if(data.value == "" || data.value == undefined){
				$("#blockCodeScene").attr("disabled",true);
				$scope.accountingStatusInf.blockCodeScene = "";
			}else {
				//封锁码场景
				 $scope.blockCodeSceneArr ={ 
				        type:"dynamicDesc", 
				        param:{effectivenessCodeType:$scope.accountingStatusInf.blockCodeType},//默认查询条件 
				        text:"effectivenessCodeScene", //下拉框显示内容，根据需要修改字段名称 
				        desc:"effectivenessCodeDesc",
				        value:"effectivenessCodeScene",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"blockCode.query",//数据源调用的action 
				        callback: function(data){
				        }
				 };
				 $("#blockCodeScene").removeAttr("disabled");
				 $timeout(function(){
	        		Tansun.plugins.render('select');
				});
			}
		});
	});
});