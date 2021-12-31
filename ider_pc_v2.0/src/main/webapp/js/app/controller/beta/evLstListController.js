'use strict';
define(function(require) {
	var webApp = require('app');
	// 测试
	webApp.controller('evLstListCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		// ,{name : '分期类' ,id : 'L001'}, {name : '消费管理类' ,id :
		// 'D001'},{name : '取现管理类' ,id : 'D002'}
		// 交易识别代码
		$scope.transIdentificationCodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.userName = "";
		$scope.userName = sessionStorage.getItem("userName");// 用户名
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false;
		// 根据菜单和当前登录者查询有权限的事件编号
		$scope.menuNoSel = $scope.menuNo;
		$scope.paramsNo = {
			menuNo : $scope.menuNoSel
		};
		jfRest.request('accessManage', 'selEvent',$scope.paramsNo).then(
			function(data) {
				if (data.returnData != null
						|| data.returnData != "") {
					for (var i = 0; i < data.returnData.length; i++) {
						$scope.eventList += data.returnData[i].eventNo+ ",";
					}
					if ($scope.eventList.search('COS.IQ.02.0001') != -1) { // 查询
						$scope.selBtnFlag = true;
					} else {
						$scope.selBtnFlag = false;
					}
					if ($scope.eventList.search('COS.AD.02.0001') != -1) { // 新增
						$scope.addBtnFlag = true;
					} else {
						$scope.addBtnFlag = false;
					}
					if ($scope.eventList.search('COS.UP.02.0001') != -1) { // 维护
						$scope.updBtnFlag = true;
					} else {
						$scope.updBtnFlag = false;
					}
				}
			});
			// 事件清单列表
			$scope.itemList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'evLstList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			// 收费项目下拉框
			$scope.feeItemArr = {
				type : "dynamic",
				param : {},// 默认查询条件
				text : "itemNoDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "feeItemNo", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "feeProject.query",// 数据源调用的action
				callback : function(data) {
				}
			};
			// 动态请求事件记账方向
			$scope.eventBookKeepingDirecArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_bookkeepingType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
				}
			};
			/* 7*24小时标识 N */
			$scope.ongoingProcessFlagArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_timeIdentification",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
				}
			};
		// 授权场景
		$scope.scenarioList = {
			type : "dynamicDesc",
			param : {
				"authDataSynFlag" : "1"
			},// 默认查询条件
			text : "authSceneCode", // 下拉框显示内容，根据需要修改字段名称
			desc : "sceneDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "authSceneCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "authScene.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data);
			}
		};
		/* 循环类型 C-客户,M-媒介单元,D-客户延滞,A-账户 P-产品,O-Online
		 */
		$scope.cycleTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cycleType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		// 新增
		$scope.addList = function() {
			$scope.modal('/beta/eventConfig/eventConfig.html','', {
				title : T.T('PZJ100037'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.saveListAdd ]
			});
		};
		// 保存按钮事件
		$scope.saveListAdd = function(result) {
			$scope.item = {};
			$scope.item = result.scope.item;
			$scope.item.eventNo = result.scope.eventNo1 + '.'+ result.scope.eventNo2 + '.'+ result.scope.eventNo3 + '.'+ result.scope.eventNo4;
			// 保存事件
			// 保存处理时增加事件编号第二段和事件类别的检查
			// if($scope.item.eventType =="MONY" &&
			// !(result.scope.eventNo2 =="RT" ||
			// result.scope.eventNo2 =="PT")){
			// jfLayer.alert(T.T('PZJ400018'));
			// }else if($scope.item.eventType =="NMNY" &&
			// !(result.scope.eventNo2 =="AD" ||
			// result.scope.eventNo2 =="CS"
			// || result.scope.eventNo2 =="IQ" ||
			// result.scope.eventNo2 =="OP"
			// || result.scope.eventNo2 =="UP" ||
			// result.scope.eventNo2 =="PM")){
			// jfLayer.alert(T.T('PZJ400019'));
			// }else if($scope.item.eventType =="AUTH" &&
			// $scope.eventNo1 !="AUS" ){
			// jfLayer.alert(T.T('PZJ400020'));
			// }else if($scope.item.eventType =="OTHR" &&
			// !(result.scope.eventNo2 =="BH" ||
			// result.scope.eventNo2 =="AP")){
			// jfLayer.alert(T.T('PZJ400021'));
			// }else{
			// }
			if ($rootScope.treeSelectAdd.length == 0) {
				jfLayer.fail(T.T('PZJ100038'));
				return;
			}
			$scope.item.List = $rootScope.treeSelectAdd;
			//console.log($scope.item);
			jfRest.request('eventConfig', 'saveEvent',$scope.item).then(
			function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T
							.T('F00032'));
					$scope.item = {};
					$rootScope.treeSelectAdd = [];
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		$scope.checkEvDtlInf = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item1 = {};
			$scope.item1 = $.parseJSON(JSON.stringify(event));
			$scope.modal('/beta/evList/evDtlInf.html',
			$scope.item1, {
				title : T.T('PZJ100001'),
				buttons : [ T.T('F00012') ],
				size : [ '1100px', '550px' ],
				callbacks : []
			});
		};
		$scope.updateEvDtlInf = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = event;
			$scope.item.deletePcdInstanIdList = [];
		/*	for ( var key in $scope.item) {
				if ($scope.item[key] == "null"
						|| $scope.item[key] == null) {
					$scope.item[key] = '';
				}
			}
			;*/
			$scope.modal('/beta/evList/evDtlInfMod.html', $scope.item, {
				title : T.T('F00021'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1100px', '620px' ],
				callbacks : [ $scope.saveEventActRel ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.saveEventActRel = function(result) {
			for ( var key in $scope.item) {
				if ($scope.item[key] == "null"
						|| $scope.item[key] == null) {
					$scope.item[key] = '';
				}
            }
            $scope.params = {
				list : $rootScope.treeSelect
			};
			$scope.item.transIdentificationCode = result.scope.transIdentificationCode;
			$scope.item.eventBalanceType = result.scope.eventBalanceType;
			$scope.item.paymentType = result.scope.paymentType;
			$scope.item.ongoingProcessFlag = result.scope.ongoingProcessFlag;
			$scope.item.eventType = result.scope.eventType;
			$scope.item.effectivenessCodeType = result.scope.effectivenessCodeType;
			$scope.item.cycleType = result.scope.cycleType;
			$scope.item.eventBookKeepingDirec = result.scope.eventBookKeepingDirec;
			$scope.item.transType = result.scope.transType;
			$scope.item.authSceneCode = $scope.item.authSceneCodeUpdate;
			$scope.item.eventBalanceObject = $scope.item.eventBalanceObjectUpdate;
			$scope.item.sceneTriggerObject = result.scope.sceneTriggerObject;
			$scope.item.effectivenessCodeScene = result.scope.upeffectivenessCodeScene;
			$scope.item.accountSceneIdentify = result.scope.upaccountSceneIdentify;
			$scope.params = Object.assign($scope.params,$scope.item);
			$scope.params.feeItemNo = $scope.item.feeItemNoTemp;
			$scope.params.artifactInstanList = result.scope.queryUpdateEvent.data;
			$scope.params.manualSupplementFlag = result.scope.manualSupplementFlag;
			$scope.params.installType = result.scope.upinstallType;
			// 保存事件
			jfRest.request('evLstList', 'updateEvent',$scope.params).then(
				function(data) {
					if (data.returnCode == '000000') {
						// 保存事件关联活动
						jfLayer.success(T.T('F00022'));
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
					} 
			});
		};
	});
	webApp.controller('evLstViewCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,
			$translate, T, $translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translate.refresh();
		$scope.isAuthShow = true;
		if ($scope.item1.eventNo.indexOf("AUS") > -1) {
			$scope.isAuthShow = false;
		} else {
			$scope.isAuthShow = true;
		}
		// 动态请求手工补录标识
		$scope.manualSupplementFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_manualSupplement",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.manualSupplementFlag = $scope.item1.manualSupplementFlag
			}
		};
		// 收费项目下拉框
		$scope.feeItemArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "itemNoDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "feeItemNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "feeProject.query",// 数据源调用的action
			callback : function(data) {
				$scope.item1.feeItemNoTemp = $scope.item1.feeItemNo;
			}
		};
		$scope.queryActTrigger = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemActivity = $.parseJSON(JSON.stringify(event));
			$scope.modal('/beta/evList/activityTriggerEvent.html',
			$scope.itemActivity, {
				title : T.T('PZJ100001'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '550px' ],
				callbacks : []
			});
		};
		/*
		 * 交易类型'PZJ100012'-P,'PZJ100013'-R,'PZJ100014'-D,
		 * 'PZJ100015'-C,PZJ100016'-Y,'PZJ100017'-X
		 */
		$scope.tranTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_transactionType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.paymentType = $scope.item1.paymentType;
			}
		};
		/*
		 * 事件类别下拉框 金融类-MONY,非金融类-NMNY 授权类-AUTH,其他类-OTHR,批量类-BTCH
		 */
		$scope.eventTypeArrays = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_eventCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.eventType = $scope.item1.eventType;
			}
		};
		// 动态请求事件记账方向
		$scope.eventBookKeepingDirecArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.eventBookKeepingDirec = $scope.item1.eventBookKeepingDirec;
			}
		};
		// 交易识别代码
		$scope.transIdentificationCodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transIdentificationCode = $scope.item1.transIdentificationCode;
			}
		};
		// 对应余额类型 ,/*'PZJ100009'-
		// P,'PZJ100010'-I,'PZJ100011'-F*/
		$scope.balanceObjectArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_balanceType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.eventBalanceType = $scope.item1.eventBalanceType;
			}
		};
		/* 7*24小时标识 N */
		$scope.ongoingProcessFlagArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_timeIdentification",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.ongoingProcessFlag = $scope.item1.ongoingProcessFlag;
			}
		};
		/*
		 * 循环类型 C-客户,M-媒介单元,D-客户延滞,A-账户 P-产品,O-Online
		 */
		$scope.cycleTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cycleType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.cycleType = $scope.item1.cycleType;
			}
		};
		/*
		 * 管控码类别 A-A，B-B,C-C,D-D,E-E,F-F,G-G,H-H,R-R,G-G,K-K,
		 * L-L,M-M,N-N,O-O,P-P,Q-Q,R-R,S-S,T-T,U-U,V-V,W-W
		 * X-X,Y-Y,Z-Z
		 */
		$scope.blockTpyeArray = {
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
				$scope.effectivenessCodeType = $scope.item1.effectivenessCodeType;
			}
		};
		$scope.accountSceneIdentifyArray  = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_accountSceneIdentify",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.accountSceneIdentify = $scope.item1.accountSceneIdentify;
			}
		};
		// 分期类型
		/*
		 * MERH：商户分期 TXAT：自动分期 CASH：现金分期 SPCL：专项分期 STMT：账单分期
		 * TRAN：交易分期 LOAN：消费信贷
		 */
		$scope.installTypeArray = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "stageTypeDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "stageTypeCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "stagTypePara.query",// 数据源调用的action
			callback : function(data) {
				$scope.installType = $scope.item1.installType;
			}
		};
		/*
		 * 场景触发对象下拉 C-客户级,A-业务类型级,P-产品级,M-媒介级,G-业务项目
		 */
		$scope.blockCodeRangeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_scenarioTriggerType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.sceneTriggerObject = $scope.item1.sceneTriggerObject;
			}
		};
		// 管控码场景序号
		$scope.blockCodeSceneArray = {
			type : "dynamicDesc",
			param : {},// 默认查询条件
			text : "effectivenessCodeScene", // 下拉框显示内容，根据需要修改字段名称
			desc : "effectivenessCodeDesc",
			value : "effectivenessCodeScene", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "blockCodeMag.query",// 数据源调用的action
			callback : function(data) {
				$scope.effectivenessCodeScene = $scope.item1.effectivenessCodeScene;
			}
		};
		$scope.avyListTable = {
			params : $scope.queryParam = {
				eventNo : $scope.item1.eventNo,
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryEvRelAvy',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_typeTriggerMode','dic_dimensionalOrder','dic_ interactionType'],//查找数据字典所需参数
			transDict : ['triggerTyp_triggerTypDesc','triggerEventRecogDimen_triggerEventRecogDimenDesc','triggerEventInteractMode_triggerEventInteractModeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 下拉框
		$scope.eventBalanceObjectArr = {
			type : "dynamicDesc",
			param : {},// 默认查询条件
			text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
			desc : "objectDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "evLstList.queryBalanceObject",// 数据源调用的action
			callback : function(data) {
				$scope.item1.eventBalanceObjectUpdate = $scope.item1.eventBalanceObject
			}
		};
		// 查询实例构件
		$scope.queryViewEvent = {
			params : {
				instanCode : $scope.item1.eventNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			// autoQuery: false,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				//console.log(data);
				if (data.returnCode == "000000") {
					if (data.returnData.rows == undefined
							|| data.returnData.rows == null
							|| data.returnData.rows == '') {
						data.returnData.rows = [];
					}
				} 
			}
		};
		// 查询详细参数
		$scope.selectAView = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectElementNoView.html',
			$scope.itemsNo, {
				title : T.T('PZJ1600006'),
				buttons : [ T.T('F00012') ],
				size : [ '1100px', '520px' ],
				callbacks : []
			});
		};
	});
	webApp.controller('selectElementNoViewCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService,
		$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdInstanShow = false;
		$scope.pcdExampleInf = {};
		$scope.pcdDifExampleInf = {};
		$scope.artifactInfoShow = false;
		var count = 1;
		$scope.artifactInfo = $scope.itemsNo;
		$scope.businessValueArr01= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.baseInstanDimenViewD = $scope.pcdExampleInf.baseInstanDimen;
				}
			};
			$scope.businessValueArr02= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.optionInstanDimenViewD = $scope.pcdExampleInf.optionInstanDimen;
				}
			};
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.segmentTypeViewD = $scope.pcdExampleInf.segmentType;
			}
		};
		$scope.pcdInfTable = [];
		if (null != $scope.itemsNo.pcdNo) {
			$scope.pcdInstanShow = true;
			$scope.pcdExampleInf.pcdNo = $scope.itemsNo.pcdNo
					.substring(0, 8);
			if ($scope.itemsNo.segmentType != null) {// 分段类型不为空
				$scope.pcdExampleInf.segmentType = $scope.itemsNo.segmentType;
				$scope.addButtonShow = true;
			} else {
				$scope.addButtonShow = false;
			}
			if ($scope.itemsNo.pcdInstanList != null) {
				$scope.pcdInfTable = $scope.itemsNo.pcdInstanList;
			} else {
				$scope.showNewPcdInfo = true;
			}
		} else {
			$scope.pcdInstanShow = false;
		}
	});
	/* 修改 */
	webApp.controller('evDtlInfModCtrl',function($scope, $stateParams, jfRest, $timeout, $http,
		jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate, T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translate.refresh();
		var form = layui.form;
		$scope.isAuthShow = true;
		if ($scope.item.eventNo.indexOf("AUS") > -1) {
			$scope.isAuthShow = false;
		} else {
			$scope.isAuthShow = true;
        }
        // 动态请求手工补录标识
		$scope.manualSupplementFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_manualSupplement",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.manualSupplementFlag = $scope.item.manualSupplementFlag
			}
		};
		// 动态请求事件记账方向
		$scope.eventBookKeepingDirecArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.eventBookKeepingDirec = $scope.item.eventBookKeepingDirec;
			}
		};
		// 交易识别代码
		$scope.transIdentificationCodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transIdentificationCode = $scope.item.transIdentificationCode;
			}
		};
		// 对应余额类型 ,/*'PZJ100009'-
		// P,'PZJ100010'-I,'PZJ100011'-F*/
		$scope.balanceObjectArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_balanceType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.eventBalanceType = $scope.item.eventBalanceType;
			}
		};
		/*
		 * 交易类型'PZJ100012'-P,'PZJ100013'-R,'PZJ100014'-D,
		 * 'PZJ100015'-C,PZJ100016'-Y,'PZJ100017'-X
		 */
		$scope.tranTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_transactionType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.paymentType = $scope.item.paymentType;
				$scope.transType = $scope.item.transType;
			}
		};
		/* 7*24小时标识 N */
		$scope.ongoingProcessFlagArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_timeIdentification",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.ongoingProcessFlag = $scope.item.ongoingProcessFlag;
			}
		};
		/*
		 * 循环类型 C-客户,M-媒介单元,D-客户延滞,A-账户 P-产品,O-Online
		 */
		$scope.cycleTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cycleType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.cycleType = $scope.item.cycleType;
			}
		};
		/*
		 * 管控码类别 A-A，B-B,C-C,D-D,E-E,F-F,G-G,H-H,R-R,G-G,K-K,
		 * L-L,M-M,N-N,O-O,P-P,Q-Q,R-R,S-S,T-T,U-U,V-V,W-W
		 * X-X,Y-Y,Z-Z
		 */
		$scope.blockTpyeArray = {
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
				$scope.effectivenessCodeType = $scope.item.effectivenessCodeType;
			}
		};
		/*
		 * 事件类别下拉框 金融类-MONY,非金融类-NMNY 授权类-AUTH,其他类-OTHR,批量类-BTCH
		 */
		$scope.eventTypeArrays = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_eventCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.eventType = $scope.item.eventType;
			}
		};
		$scope.accountSceneIdentifyArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_accountSceneIdentify",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.upaccountSceneIdentify = $scope.item.accountSceneIdentify;
			}
		};
		// 授权场景
		$scope.scenarioList = {
			type : "dynamicDesc",
			param : {
				"authDataSynFlag" : "1"
			},// 默认查询条件
			text : "authSceneCode", // 下拉框显示内容，根据需要修改字段名称
			desc : "sceneDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "authSceneCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "authScene.query",// 数据源调用的action
			callback : function(data) {
				$scope.item.authSceneCodeUpdate = $scope.item.authSceneCode;
			}
		};
		// 分期类型
		/*
		 * MERH：商户分期 TXAT：自动分期 CASH：现金分期 SPCL：专项分期 STMT：账单分期
		 * TRAN：交易分期 LOAN：消费信贷
		 */
		/*$scope.installTypeArray = [ {
			name : T.T('PZJ100039'),
			id : 'MERH'
		}, {
			name : T.T('PZJ100040'),
			id : 'TXAT'
		}, {
			name : T.T('PZJ100041'),
			id : 'CASH'
		}, {
			name : T.T('PZJ100042'),
			id : 'SPCL'
		}, {
			name : T.T('PZJ100043'),
			id : 'STMT'
		}, {
			name : T.T('PZJ100044'),
			id : 'TRAN'
		}, {
			name : T.T('PZJ100045'),
			id : 'LOAN'
		}, {
			name : T.T('PZJ100046'),
			id : 'APAY'
		} ];*/
		$scope.installTypeArray = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "stageTypeDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "stageTypeCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "stagTypePara.query",// 数据源调用的action
			callback : function(data) {
				$scope.upinstallType = $scope.item.installType;
			}
		};
		// 分期类型
		form.on('select(getInstallType)', function(data1) {
			$scope.upinstallType = data1.value;
		});
		/*
		 * 场景触发对象下拉 C-客户级,A-业务类型级,P-产品级,M-媒介级,G-业务项目
		 */
		$scope.blockCodeRangeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_scenarioTriggerType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.sceneTriggerObject = $scope.item.sceneTriggerObject;
			}
		};
		// 封锁码场景序号
		$scope.blockCodeSceneArray = {
			type : "dynamicDesc",
			param : {
				effectivenessCodeType: $scope.item.effectivenessCodeType,
			},// 默认查询条件
			text : "effectivenessCodeScene", // 下拉框显示内容，根据需要修改字段名称
			desc : "effectivenessCodeDesc",
			value : "effectivenessCodeScene", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "blockCodeMag.query",// 数据源调用的action
			callback : function(data) {
				//$scope.item.blockTpye = $scope.item.blockTpye;
				$scope.upeffectivenessCodeScene = $scope.item.effectivenessCodeScene;
			}
		};
		// 联动封锁码场景序号
		form.on('select(getBlockTpye)', function(event) {
			// 根据封锁码类别定位封锁码场景序号
			$scope.blockCodeSceneArray = {
				type : "dynamicDesc",
				param : {
					effectivenessCodeType : event.value
				},// 默认查询条件
				text : "effectivenessCodeScene", // 下拉框显示内容，根据需要修改字段名称
				desc : "effectivenessCodeDesc",
				value : "effectivenessCodeScene", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "blockCodeMag.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data);
				}
			};
		});
		// 根据序号定位封锁码场景描述
		// form.on('select(getBlockCodeDesc)',function(data1){
		// $scope.param = {
		// effectivenessCodeType:
		// $scope.item.effectivenessCodeType,
		// effectivenessCodeScene:data1.value,
		// }
		// jfRest.request('blockCodeMag', 'query',
		// $scope.param).then(function(data) {
		// if(data.returnCode == '000000'){
		// if(data.returnData.rows.length){
		// $scope.item.effectivenessCodeDesc =
		// data.returnData.rows[0].effectivenessCodeDesc;
		// };
		// }else{
		// var returnMsg = data.returnMsg ? data.returnMsg :
		// T.T('F00033') ;
		// jfLayer.fail(returnMsg);
		// }
		//					
		//					
		// });
		//				
		// });
		// 事件配置的选择活动列表
		$scope.selAvyList = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 5,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 收费项目下拉框
		$scope.feeItemArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "itemNoDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "feeItemNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "feeProject.query",// 数据源调用的action
			callback : function(data) {
				$scope.item.feeItemNoTemp = $scope.item.feeItemNo;
			}
		};
		// 下拉框渲染
		$scope.eventBalanceObjectArr = {
			type : "dynamicDesc",
			param : {},// 默认查询条件
			text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
			desc : "objectDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "evLstList.queryBalanceObject",// 数据源调用的action
			callback : function(data) {
				$scope.item.eventBalanceObjectUpdate = $scope.item.eventBalanceObject;
			}
		};
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_typeTriggerMode",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
		function(data) {
			$scope.triggerTyList = [];
			$scope.triggerTyList = data.returnData.rows;
		});
		$scope.queryParam02 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_dimensionalOrder",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam02).then(
		function(data) {
			$scope.triggerEventRecogDimenList = [];
			$scope.triggerEventRecogDimenList = data.returnData.rows;
		});
		$scope.queryParam03 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_ interactionType",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam03).then(
		function(data) {
			$scope.triggerEventInteractModeList = [];
			$scope.triggerEventInteractModeList = data.returnData.rows;
		});
		$scope.queryParam = {
			eventNo : $scope.item.eventNo
		};
		jfRest.request('evLstList', 'queryEvRelAvy',$scope.queryParam).then(
		function(data) {
			if (data.returnCode == '000000') {
				 setTimeout(function () {  // 故意延迟一下
				$rootScope.treeSelect = [];
				if (data.returnData.rows == null) {
					$rootScope.treeSelect = [];
				} else {
					$rootScope.treeSelect = data.returnData.rows;
					if($scope.triggerTyList.length > 0){
						for(var i=0;i<$scope.triggerTyList.length;i++){
							for(var j=0;j<$rootScope.treeSelect.length;j++){
								if($scope.triggerTyList[i].codes == $rootScope.treeSelect[j].triggerTyp){
									$rootScope.treeSelect[j].triggerTypDesc = $scope.triggerTyList[i].detailDesc;
								}
							}
						}
					}
					if($scope.triggerEventRecogDimenList.length > 0){
						for(var i=0;i<$scope.triggerEventRecogDimenList.length;i++){
							for(var j=0;j<$rootScope.treeSelect.length;j++){
								if($scope.triggerEventRecogDimenList[i].codes == $rootScope.treeSelect[j].triggerEventRecogDimen){
									$rootScope.treeSelect[j].triggerEventRecogDimenDesc = $scope.triggerEventRecogDimenList[i].detailDesc;
								}
							}
						}
					}
					if($scope.triggerEventInteractModeList.length > 0){
						for(var i=0;i<$scope.triggerEventInteractModeList.length;i++){
							for(var j=0;j<$rootScope.treeSelect.length;j++){
								if($scope.triggerEventInteractModeList[i].codes == $rootScope.treeSelect[j].triggerEventInteractMode){
									$rootScope.treeSelect[j].triggerEventInteractModeDesc = $scope.triggerEventInteractModeList[i].detailDesc;
								}
							}
						}
					}
				}
				 }, 800);//setTimeout
			}
		});
		$scope.saveSelect = function(event) {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.selAvyList.validCheck()) {
				return;
			}
			var items = $scope.selAvyList.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].activityNo == $rootScope.treeSelect[k].activityNo) { // 判断是否存在
						tipStr = tipStr + items[i].activityNo
								+ ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$rootScope.treeSelect.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('PZJ100033')+ tipStr.substring(0,tipStr.length - 1)+ T.T('PZJ100032'));
			}
		};
		// 上移
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i - 1];
					$rootScope.treeSelect[i - 1] = dataMap;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == $rootScope.treeSelect.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i + 1];
					$rootScope.treeSelect[i + 1] = dataMap;
					break;
				}
			}
		};
		$scope.queryParam01 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_typeTriggerMode",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
			function(data) {
				$scope.triggerTyList = [];
				$scope.triggerTyList = data.returnData.rows;
			});
			$scope.queryParam02 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_dimensionalOrder",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam02).then(
			function(data) {
				$scope.triggerEventRecogDimenList = [];
				$scope.triggerEventRecogDimenList = data.returnData.rows;
			});
			$scope.queryParam03 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_ interactionType",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam03).then(
			function(data) {
				$scope.triggerEventInteractModeList = [];
				$scope.triggerEventInteractModeList = data.returnData.rows;
			});
		// 修改关联活动
		$scope.updateSelect = function(event, $index) {
			$scope.indexNo = $index;
			// 页面弹出框事件(弹出页面)
			$scope.itemContactAct = {};
			$scope.itemContactAct = $.parseJSON(JSON.stringify(event));
			$scope.itemContactAct.eventNo = $scope.item.eventNo;
			$scope.modal('/beta/evList/updateContactActivity.html',$scope.itemContactAct, {
				title : T.T('F00021'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1050px', '620px' ],
				callbacks : [ $scope.updateActive ]
			});
		};
		$scope.updateActive = function(result) {
		/*	$scope.items = result.scope.updateCA;
			$rootScope.treeSelect[$scope.indexNo].triggerNo = $scope.items.triggerNo;
			$rootScope.treeSelect[$scope.indexNo].triggerTyp = $scope.items.triggerTyp;
			$rootScope.treeSelect[$scope.indexNo].triggerEventRecogDimen = $scope.items.triggerEventRecogDimen;
			$rootScope.treeSelect[$scope.indexNo].triggerEventInteractMode = $scope.items.triggerEventInteractMode;*/
			$scope.items = result.scope.updateCA;
			if($scope.triggerTyList.length > 0){
				for(var i=0;i<$scope.triggerTyList.length;i++){
					if($scope.triggerTyList[i].codes == result.scope.triggerTyp){
						$rootScope.treeSelect[$scope.indexNo].triggerTypDesc = $scope.triggerTyList[i].detailDesc;
					}
				}
			}
			if($scope.triggerEventRecogDimenList.length > 0){
				for(var i=0;i<$scope.triggerEventRecogDimenList.length;i++){
					if($scope.triggerEventRecogDimenList[i].codes == result.scope.triggerEventRecogDimen){
						$rootScope.treeSelect[$scope.indexNo].triggerEventRecogDimenDesc = $scope.triggerEventRecogDimenList[i].detailDesc;
					}
				}
			}
			if($scope.triggerEventInteractModeList.length > 0){
				for(var i=0;i<$scope.triggerEventInteractModeList.length;i++){
					if($scope.triggerEventInteractModeList[i].codes == result.scope.triggerEventInteractMode){
						$rootScope.treeSelect[$scope.indexNo].triggerEventInteractModeDesc = $scope.triggerEventInteractModeList[i].detailDesc;
					}
				}
			}
			$rootScope.treeSelect[$scope.indexNo].triggerNo =  $scope.items.triggerNo;
			$rootScope.treeSelect[$scope.indexNo].triggerTyp =  result.scope.triggerTyp;
			$rootScope.treeSelect[$scope.indexNo].accountingUseFlag =  result.scope.upaccountingUseFlag;
			$rootScope.treeSelect[$scope.indexNo].triggerEventRecogDimen =  result.scope.triggerEventRecogDimen;
			$rootScope.treeSelect[$scope.indexNo].triggerEventInteractMode =  result.scope.triggerEventInteractMode;
			if ($scope.items.triggerNo != ""
					&& $scope.items.triggerNo != "null"
					&& $scope.items.triggerNo != undefined) {
				if (result.scope.triggerTyp == ""
						|| result.scope.triggerTyp == "null") {
					jfLayer.alert(T.T('PZJ100047'));
					return;
				}
			}
			if (result.scope.triggerEventRecogDimen != ""
					&& result.scope.triggerEventRecogDimen != "null"
					&& result.scope.triggerEventRecogDimen != undefined) {
				if (result.scope.triggerEventInteractMode == ""
						|| result.scope.triggerEventInteractMode == "null") {
					jfLayer.alert(T.T('PZJ100048'));
					return;
				}
			}
			if ($rootScope.treeSelect1.length > 0) {
				$scope.isTipInfo = false; // 是否提示
				$scope.isGo = false; // 是否继续
				var itemInfo = $rootScope.treeSelect1;
				$scope.tipInfoStr = [];
				for (var i = 0; i < itemInfo.length; i++) {
					if (itemInfo[i].recogDimenCode) {
						$scope.tipInfoStr
								.push(itemInfo[i].recogDimenCode);
						$scope.isGo = true; // 是否继续
					} else {
						jfLayer.alert(T.T('PZJ100049'));
						$scope.isGo = false; // 是否继续
						break;
					}
				}
				if ($scope.isGo) {
					var s = $scope.tipInfoStr.join(",") + ",";
					for (var i = 0; i < $scope.tipInfoStr.length; i++) {
						if (s.replace($scope.tipInfoStr[i] + ",", "").indexOf($scope.tipInfoStr[i]+ ",") > -1) {
							jfLayer.alert(T.T('PZJ100050'));
							$scope.isTipInfo = true; // 是否提示
							break;
						} else {
							$scope.isTipInfo = false; // 是否提示
						}
					}
					if (!$scope.isTipInfo) {
						$rootScope.treeSelect[$scope.indexNo].eventTriggerList = $rootScope.treeSelect1;
						$scope.safeApply();
						result.cancel();
					}
				} else {
				}
			} else {
				$rootScope.treeSelect[$scope.indexNo].eventTriggerList = $rootScope.treeSelect1;
				$scope.safeApply();
				result.cancel();
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
			/*
			 * var arrId=treeSelect.indexOf(data);
			 * treeSelect.splice(arrId,1);
			 * $scope.checkedList=treeSelect;
			 */
		};
		// 查询产品实例构件
		$scope.queryUpdateEvent = {
			params : {
				instanCode : $scope.item.eventNo,
			}, // 表格查询时的参数信息
			// autoQuery: false,
			paging : false,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					// $scope.instanProductShow = true;//显示实例化
					if (data.returnData.rows == undefined
							|| data.returnData.rows == null
							|| data.returnData.rows == '') {
						data.returnData.rows = [];
					}
				} else {
				}
			}
		};
		// 产品实例化时，点击设置参数值的方法
		$scope.setSelectAUpdate = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectPCDUpdateEvent.html',$scope.itemsPCD,
			{title : T.T('F00083')+ $scope.itemsPCD.pcdNo+ ':'+ $scope.itemsPCD.pcdDesc+ T.T('F00139'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.choseSelectTwoUpdate ]
			});
		};
		$scope.choseSelectTwoUpdate = function(result) {
			console.log(result);
			$scope.items = {};
			$scope.queryUpdateEvent.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryUpdateEvent.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.queryUpdateEvent.data[$scope.indexNo].addPcdFlag = "1";
			$scope.safeApply();
			result.cancel();
		};
		// 产品实例化时，点击替换参数的方法
		$scope.updateSelectAUpdate = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectElementNoUpdateEvent.html',$scope.itemsNo,
			{
				title : T.T('PZJ100051'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1100px', '320px' ],
				callbacks : [ $scope.choseSelectAUpdate ]
			});
		};
		$scope.choseSelectAUpdate = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.queryUpdateEvent.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryUpdateEvent.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('updateContactActivityCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $timeout, $location,
		lodinDataService, $translate,
		$translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translate.refresh();
		$scope.updateCA = $scope.itemContactAct;
		$rootScope.treeSelect1 = [];
		$scope.eventListShowU = false;
		/* 触发方式 活动自身触发-A,通过总控触发-G,交易登记-T*/
		$scope.acTriggerTyp = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeTriggerMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.triggerTyp = $scope.updateCA.triggerTyp;
			}
		};
		/*
		 * 触发事件识别维度
		 * 业务类型-MODT,延滞状况-DELQ,余额对象-MODB,业务项目-MODG,元件编号-ELE
		 */
		$scope.dimenArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dimensionalOrder",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.triggerEventRecogDimen = $scope.updateCA.triggerEventRecogDimen;
			}
		};
		/*
		 * 触发事件交互方式下拉框 同步触发（HTTP）-SYNC,异步触发-ASYNC
		 */
		$scope.wayArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ interactionType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.triggerEventInteractMode = $scope.updateCA.triggerEventInteractMode;
			}
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                     
	        	$scope.upaccountingUseFlag=$scope.updateCA.accountingUseFlag;
	        }
		};
		// 事件类别
		$scope.eventTypeArrays = [ {
			name : T.T('PZJ100018'),
			id : 'MONY'
		}, {
			name : T.T('PZJ100019'),
			id : 'NMNY'
		}, {
			name : T.T('PZJ100020'),
			id : 'AUTH'
		}, {
			name : T.T('PZJ100021'),
			id : 'OTHR'
		}, {
			name : T.T('PZJ100022'),
			id : 'BTCH'
		} ];
		$scope.choseEvent = function() {
			// 弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/choseEvent.html',$scope.params, {
				title : T.T('PZJ100023'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseEventFee ]
			});
		};
		$scope.choseEventFee = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.updateCA.triggerNo = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		// 事件列表
		$scope.eventList = {
			autoQuery : false,
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.triggerMode = true;
		$scope.queryTriggerTyp = function() {
			if ($scope.triggerTyp == "T") {
				$scope.triggerEventInteractMode = "ASYNC";
				$scope.triggerMode = false;
			} else {
				// $scope.triggerEventInteractMode ="";
				$scope.triggerMode = true;
			}
		};
		$scope.queryTriggerTyp();
		var form = layui.form;
		form.on('select(triggTyp)', function(event) {
			if (event.value == "T") {
				$scope.triggerEventInteractMode = "ASYNC";
				$scope.triggerMode = false;
			} else {
				$scope.triggerMode = true;
			}
		});
		// 查询已关联事件
		$scope.queryActivityEvent = function() {
			$scope.queryParam = {
				eventNo : $scope.item.eventNo,
				activityNo : $scope.updateCA.activityNo,
			};
			jfRest.request('activityEvent', 'query',$scope.queryParam).then(
			function(data) {
				if (data.returnCode == '000000') {
					$rootScope.treeSelect1 = [];
					if (undefined != $scope.itemContactAct.eventTriggerList
							&& null != $scope.itemContactAct.eventTriggerList) {
						$rootScope.treeSelect1 = $scope.itemContactAct.eventTriggerList;
					} else {
						if (data.returnData.rows == null) {
							if (null == $rootScope.treeSelect1) {
								$rootScope.treeSelect1 = [];
							}
						} else {
							$rootScope.treeSelect1 = data.returnData.rows;
						}
					}
				}
			});
		};
						// 维度判断
		$scope.checkActivityEvent = function() {
			if ($scope.updateCA.triggerEventRecogDimen == "MODT") {
				$scope.resultStr = [];
				$rootScope.treeSelect1 = [];
				// 业务类型
				$scope.queryselParam = {};
				jfRest.request('businessType', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].businessDesc,
									id : $rootScope.treeSelect2[j].businessTypeCode
								};
								$scope.resultStr.push(str);
							}
							$scope.queryActivityEvent();
							$scope.eventListShowU = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
			} else if ($scope.updateCA.triggerEventRecogDimen == "DELQ") {
				// 延滞状况
				$rootScope.treeSelect1 = [];
				$scope.resultStr = [];
				$scope.queryselParam = {};
				jfRest.request('delayState', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].delayDesc,
									id : $rootScope.treeSelect2[j].delayState
								};
								$scope.resultStr.push(str);
							}
							$scope
									.queryActivityEvent();
							$scope.eventListShowU = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
			} else if ($scope.updateCA.triggerEventRecogDimen == "MODB") {
				$scope.resultStr = [];
				$scope.queryselParam = {};
				$rootScope.treeSelect1 = [];
				jfRest.request('balanceObject', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].objectDesc,
									id : $rootScope.treeSelect2[j].balanceObjectCode
								};
								$scope.resultStr.push(str);
							}
							$scope.queryActivityEvent();
							$scope.eventListShowU = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				// 余额对象
				// 识别维度代码下拉框
			} else if ($scope.updateCA.triggerEventRecogDimen == "MODG") {
				$scope.resultStr = [];
				$scope.queryselParam = {};
				$rootScope.treeSelect1 = [];
				jfRest.request('productLine', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].programDesc,
									id : $rootScope.treeSelect2[j].businessProgramNo
								};
								$scope.resultStr.push(str);
							}
							$scope.queryActivityEvent();
							$scope.eventListShowU = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				// 业务项目
				// 识别维度代码下拉框
			} else if ($scope.updateCA.triggerEventRecogDimen == "ELE") {
				$scope.resultStr = [];
				$scope.queryselParam = {};
				$rootScope.treeSelect1 = [];
				jfRest.request('elementDimen', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].elementDesc,
									id : $rootScope.treeSelect2[j].elementNo
								};
								$scope.resultStr.push(str);
							}
							$scope.queryActivityEvent();
							$scope.eventListShowU = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				// 元件编号
				// 识别维度代码下拉框
			}else if ($scope.updateCA.triggerEventRecogDimen == "TRID") {
				$scope.resultStr = [];
				$scope.queryselParam = {};
				$rootScope.treeSelect1 = [];
				jfRest.request('transIdenty', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						console.log(data);
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].transIdentifiDesc,
									id : $rootScope.treeSelect2[j].transIdentifiNo
								};
								$scope.resultStr.push(str);
							}
							$scope.queryActivityEvent();
							$scope.eventListShowU = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				// 元件编号
				// 识别维度代码下拉框
			} else if ($scope.updateCA.triggerEventRecogDimen == "SEQN") {
				$rootScope.treeSelect1 = [];
				$scope.resultStr = [ {
					name : '1',
					id : '1'
				}, {
					name : '2',
					id : '2'
				}, {
					name : '3',
					id : '3'
				}, {
					name : '4',
					id : '4'
				}, {
					name : '5',
					id : '5'
				} ];
				$scope.queryselParam = {};
				$scope.queryActivityEvent();
				$scope.eventListShowU = true;
			} else {
				$scope.eventListShowU = false;
				$scope.updateCA.recogDimenCode = "";
				$rootScope.treeSelect1 = [];
			}
		};
		$scope.checkActivityEvent();
		var form = layui.form;
		form.on('select(dimenUpdate)', function(event) {
				if (event.value == "MODT") {
					$scope.resultStr = [];
					$rootScope.treeSelect1 = [];
					// 业务类型
					$scope.queryselParam = {};
					jfRest.request('businessType', 'query',$scope.queryselParam).then(
					function(data) {
						if (data.returnCode == '000000') {
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].businessDesc,
										id : $rootScope.treeSelect2[j].businessTypeCode
									};
									$scope.resultStr.push(str);
								}
								$scope.queryActivityEvent();
								$scope.eventListShowU = true;
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
							}
						}
					});
				} else if (event.value == "DELQ") {
					// 延滞状况
					$rootScope.treeSelect1 = [];
					$scope.resultStr = [];
					$scope.queryselParam = {};
					jfRest.request('delayState', 'query',$scope.queryselParam).then(
					function(data) {
						if (data.returnCode == '000000') {
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].delayDesc,
										id : $rootScope.treeSelect2[j].delayState
									};
									$scope.resultStr.push(str);
								}
								$scope
										.queryActivityEvent();
								$scope.eventListShowU = true;
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
							}
						}
					});
				} else if (event.value == "MODB") {
					$rootScope.treeSelect1 = [];
					$scope.resultStr = [];
					$scope.queryselParam = {};
					jfRest.request('balanceObject', 'query',$scope.queryselParam).then(
					function(data) {
						if (data.returnCode == '000000') {
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].objectDesc,
										id : $rootScope.treeSelect2[j].balanceObjectCode
									};
									$scope.resultStr.push(str);
								}
								$scope.queryActivityEvent();
								$scope.eventListShowU = true;
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
							}
						}
					});
					// 余额对象
					// 识别维度代码下拉框
				} else if (event.value == "MODG") {
					$rootScope.treeSelect1 = [];
					$scope.resultStr = [];
					$scope.queryselParam = {};
					jfRest.request('productLine', 'query',$scope.queryselParam).then(
					function(data) {
						if (data.returnCode == '000000') {
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].programDesc,
										id : $rootScope.treeSelect2[j].businessProgramNo
									};
									$scope.resultStr.push(str);
								}
								$scope.queryActivityEvent();
								$scope.eventListShowU = true;
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
							}
						}
					});
					// 业务项目
					// 识别维度代码下拉框
				} else if (event.value == "ELE") {
					$rootScope.treeSelect1 = [];
					$scope.resultStr = [];
					$scope.queryselParam = {};
					jfRest.request('elementDimen', 'query',$scope.queryselParam).then(
					function(data) {
						if (data.returnCode == '000000') {
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].elementDesc,
										id : $rootScope.treeSelect2[j].elementNo
									};
									$scope.resultStr.push(str);
								}
								$scope.queryActivityEvent();
								$scope.eventListShowU = true;
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
							}
						}
					});
					// 交易识别
					// 识别维度代码下拉框
				}else if (event.value == "TRID") {
					$rootScope.treeSelect1 = [];
					$scope.resultStr = [];
					$scope.queryselParam = {};
					jfRest.request('transIdenty', 'query',$scope.queryselParam).then(function(data) {
						if (data.returnCode == '000000') {
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].transIdentifiDesc,
										id : $rootScope.treeSelect2[j].transIdentifiNo
									};
									$scope.resultStr.push(str);
								}
								$scope.queryActivityEvent();
								$scope.eventListShow = true;
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
							}
						}
					});
				}  else if (event.value == "SEQN") {
					$rootScope.treeSelect1 = [];
					$scope.resultStr = [ {
						name : '1',
						id : '1'
					}, {
						name : '2',
						id : '2'
					}, {
						name : '3',
						id : '3'
					}, {
						name : '4',
						id : '4'
					}, {
						name : '5',
						id : '5'
					} ];
					$scope.queryselParam = {};
					$scope.queryActivityEvent();
					$scope.eventListShowU = true;
				} else {
					$scope.eventListShowU = false;
					$scope.updateCA.recogDimenCode = "";
					$rootScope.treeSelect1 = [];
				}
		});
		// 已关联事件选择识别维度
		form.on('select(getRecogDim)',function(data) {
			if (data.value) {
				for (var i = 0; i < $rootScope.treeSelect1.length; i++) {
					if (i != data.elem.parentElement.id) {
						if (data.value == $rootScope.treeSelect1[i].recogDimenCode) {
							$rootScope.treeSelect1[data.elem.parentElement.id].recogDimenCode = "";
							jfLayer.fail(T.T('PZJ100050'));
							return;
						}
					}
				}
            }
        });
		$scope.saveSelect = function(event) {
			var isTip = false; // 是否提示
			var isBeyond = false; // 是否超出限制个数
			var tipStr = "";
			if (!$scope.eventList.validCheck()) {
				return;
			}
			var items = $scope.eventList.checkedList();
			for (var i = 0; i < items.length; i++) {
				if ($scope.triggerEventRecogDimen == "SEQN") {
					if (items.length > 5) {
						isBeyond = true;
						isExist = true;
						break;
					}
				}
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.treeSelect1.length; k++) {
					if (false) { // 判断是否存在
						tipStr = tipStr + items[i].eventNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$scope.tempList = {};
					$scope.tempList.eventNo = $scope.updateCA.eventNo;
					$scope.tempList.activityNo = $scope.updateCA.activityNo;
					$scope.tempList.triggerNo = items[i].eventNo;
					$rootScope.treeSelect1.push($scope.tempList);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('PZJ100031')+ tipStr.substring(0,tipStr.length - 1) + T.T('PZJ100032'));
			}
			if (isBeyond) {
				jfLayer.alert(T.T('PZJ1600008'));
			}
		};
			// 上移
			$scope.exchangeSeqNoUp = function(data) {
				for (var i = 0; i < $rootScope.treeSelect1.length; i++) {
					if ($rootScope.treeSelect1[i] == data) {
						if (i == 0) {
							jfLayer.fail(T.T('F00024'));
							break;
						}
						var dataMap = $rootScope.treeSelect1[i];
						$rootScope.treeSelect1[i] = $rootScope.treeSelect1[i - 1];
						$rootScope.treeSelect1[i - 1] = dataMap;
						break;
					}
				}
			};
			// 下移
			$scope.exchangeSeqNoDown = function(data) {
				for (var i = 0; i < $rootScope.treeSelect1.length; i++) {
					if ($rootScope.treeSelect1[i] == data) {
						if (i == $rootScope.treeSelect1.length - 1) {// 判断第几条数据
							jfLayer.fail(T.T('F00025'));
							break;
						}
						var dataMap = $rootScope.treeSelect1[i];
						$rootScope.treeSelect1[i] = $rootScope.treeSelect1[i + 1];
						$rootScope.treeSelect1[i + 1] = dataMap;
						break;
					}
				}
			};
			// 删除关联活动
			$scope.removeSelect = function(data) {
				var checkId = data;
				$rootScope.treeSelect1.splice(checkId, 1);
				console.log($rootScope.treeSelect1);
			}
		});
	// 事件
	webApp.controller('choseEventFeeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('activityTriggerEventCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService,
		$translate, T, $translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translate.refresh();
		$scope.viewItemActivity = $scope.itemActivity;
		$rootScope.treeSelect1 = [];
		$scope.eventListShow = false;
		$rootScope.treeSelect1 = $scope.viewItemActivity.eventTriggerList;
		/*
		 * 触发方式 活动自身触发-A,通过总控触发-G,交易登记-T
		 */
		$scope.acTriggerTyp = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeTriggerMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.triggerTyp = $scope.viewItemActivity.triggerTyp;
			}
		};
		/*
		 * 触发事件识别维度 业务类型-MODT,延滞状况-DELQ,余额对象-MODB,业务项目-MODG,
		 * 元件编号-ELE,顺序号-SEQN,
		 */
		$scope.dimenArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dimensionalOrder",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.triggerEventRecogDimen = $scope.viewItemActivity.triggerEventRecogDimen;
			}
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                     
	        	$scope.vwaccountingUseFlag=$scope.viewItemActivity.accountingUseFlag;
	        }
		};
		/*
		 * 触发事件交互方式下拉框 同步触发（HTTP）-SYNC,异步触发-ASYNC
		 */
		$scope.wayArray = {};
		console.log($scope.viewItemActivity);
		if ($scope.viewItemActivity.triggerTyp == "T") {
			$scope.triggerModeT = true;
			$scope.triggerMode = false;
			$scope.wayArray = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_ interactionType",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					callback : function(data) {
						$scope.triggerEventInteractMode = $scope.viewItemActivity.triggerEventInteractMode;
						
					}
				};
		} else {
			$scope.triggerMode = true;
			$scope.triggerModeT = false;
			$scope.wayArray = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_ interactionType",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					callback : function(data) {
						$scope.triggerEventInteractMode = $scope.viewItemActivity.triggerEventInteractMode;
						
					}
				};
		}
//		$scope.wayArray = {
//			type : "dictData",
//			param : {
//				"type" : "DROPDOWNBOX",
//				groupsCode : "dic_ interactionType",
//				queryFlag : "children"
//			},// 默认查询条件
//			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
//			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
//			resource : "paramsManage.query",// 数据源调用的action
//			callback : function(data) {
//				$scope.triggerEventInteractMode = $scope.viewItemActivity.triggerEventInteractMode;
//				console.log($scope.triggerEventInteractMode);
//			}
//		};
//		$scope.wayArray = [ {
//			name : T.T('PZJ100029'),
//			id : 'SYNC'
//		}, {
//			name : T.T('PZJ100030'),
//			id : 'ASYNC'
//		} ];
		// 活动触发事件清单列表
		$scope.activityTriList = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"eventNo" : $scope.itemActivity.eventNo,
				"activityNo" : $scope.itemActivity.activityNo,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'activityEvent.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnData.totalCount != 0) {
					$scope.eventListShow = true;
				}
			}
		};
	});
	// 事件新增
	webApp.controller('evnetConfigCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService,
		$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
			// 这个对象不能删，否则报错
			$scope.item = {};
			$scope.isAuthShow = true;// 事件类型为授权，这块不显示
			// 动态请求手工补录标识
			$scope.manualSupplementFlagArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_manualSupplement",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		// 动态请求事件记方向
		$scope.eventBookKeepingDirecArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		/*
		 * 事件类别下拉框 金融类-MONY,非金融类-NMNY 授权类-AUTH,其他类-OTHR,批量类-BTCH
		 */
		$scope.eventTypeArrays = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_eventCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		// ,{name : '分期类' ,id : 'L001'}, {name : '消费管理类' ,id :
		// 'D001'},{name : '取现管理类' ,id : 'D002'}
		// 交易识别代码
		$scope.transIdentificationCodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bookkeepingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 分期类型
		/*
		 * MERH：商户分期 TXAT：自动分期 CASH：现金分期 SPCL：专项分期 STMT：账单分期
		 * TRAN：交易分期 LOAN：消费信贷
		 */
		$scope.installTypeArray = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "stageTypeDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "stageTypeCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "stagTypePara.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 管控码类别
		$scope.blockTpyeArray = {
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
				//console.log(data)
			}
		};
		// 场景触发对象
		$scope.blockCodeRangeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_scenarioTriggerType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		/*
		 * 循环类型 C-客户,M-媒介单元,D-客户延滞,A-账户 P-产品,O-Online
		 */
		$scope.cycleTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cycleType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		// 授权场景
		$scope.scenarioList = {
			type : "dynamicDesc",
			param : {
				"authDataSynFlag" : "1"
			},// 默认查询条件
			text : "authSceneCode", // 下拉框显示内容，根据需要修改字段名称
			desc : "sceneDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "authSceneCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "authScene.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data);
			}
		};
		// 封锁码场景序号
		$scope.blockCodeSceneArray = {
			type : "dynamicDesc",
			param : {},// 默认查询条件
			text : "effectivenessCodeScene", // 下拉框显示内容，根据需要修改字段名称
			desc : "effectivenessCodeDesc",
			value : "effectivenessCodeScene", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "blockCodeMag.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 联动封锁码场景序号
		var form = layui.form;
		form.on('select(getBlockTpye)', function(event) {
			// 封锁码场景序号
			$scope.blockCodeSceneArray = {
				type : "dynamicDesc",
				param : {
					effectivenessCodeType : event.value,
				},// 默认查询条件
				text : "effectivenessCodeScene", // 下拉框显示内容，根据需要修改字段名称
				desc : "effectivenessCodeDesc",
				value : "effectivenessCodeScene", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "blockCodeMag.query",// 数据源调用的action
				callback : function(data) {
				}
			};
		});
		// 封锁码场景描述 
		$scope.blockCodeDescArray = {
			type : "dynamic",                      
			param : {
				effectivenessCodeType : $scope.item.effectivenessCodeType,
				effectivenessCodeScene : $scope.item.effectivenessCodeScene,
			},// 默认查询条件
			text : "effectivenessCodeDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "effectivenessCodeScene", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "blockCodeMag.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data);
			}
		};
		// 交易识别码是否显示
		$scope.tranIdenShow = false;
		// 事件记账方向是否显示
		$scope.eventKeepShow = true;
		// 对应余额对象下拉框
		$scope.eventBalanceObjectArr = {
			type : "dynamicDesc",
			param : {},// 默认查询条件
			text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
			desc : "objectDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "evLstList.queryBalanceObject",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件类别下拉框事件
		var form = layui.form;
		form.on('select(event)', function(event) {
			if (event.value == "MONY") {
				$scope.eventKeepShow = false;
				$scope.item.eventBookKeepingDirec = "";
			} else {
				$scope.eventKeepShow = true;
				$scope.item.eventBookKeepingDirec = "";
			}
		});
		// 在事件编号第二段为'BH','BN’,'RT'时才允许设置批量处理循环类型
		// 第二段为XT时，分期类型，分期起分金额，分期最大金额才可以输入
		$scope.cycleTypeShow = true;
		form.on('select(eventNo2)', function(event) {
			if (event.value == "BH" || event.value == "BN" || event.value == "RT") {
				$scope.cycleTypeShow = false;
			} else {
				$scope.cycleTypeShow = true;
				$scope.item.cycleType = "";
            }
            /*if (event.value == 'XT') {
                angular.element("#installType").removeAttr("disabled");
                angular.element("#minimumInstalmentAmount").removeAttr("readonly");
                angular.element("#maximumInstalmentAmount").removeAttr("readonly");
            } else {
                angular.element("#installType").attr("disabled", true);
                angular.element("#minimumInstalmentAmount").attr("readonly", "readonly");
                angular.element("#maximumInstalmentAmount").attr("readonly", "readonly");
            }*/
		// 金融类----  RT，PT, XT, 
		// 非金融类--- IQ，AD，OP，UP，CS, PM, SP
		// 批量类---  BH,BN
		// 授权类---  CU,VI,MC,AU,IS,IL， MI,JC
		// 其他类---  其他
		if (event.value == "RT"|| event.value == "PT"|| event.value == "XT") {
			$scope.item.eventType = 'MONY';
		} else if (event.value == "IQ" || event.value == "AD"|| event.value == "OP"|| event.value == "UP"|| event.value == "CS"
				|| event.value == "PM" || event.value == "SP") {
			$scope.item.eventType = 'NMNY';
		} else if (event.value == "BH" || event.value == "BN") {
			$scope.item.eventType = 'BTCH';
		} else if (event.value == "CU"|| event.value == "VI"
				|| event.value == "MC"|| event.value == "AU"
				|| event.value == "IS"|| event.value == "IL"
				|| event.value == "MI"|| event.value == "JC") {
			$scope.item.eventType = 'AUTH';
		} else {
			$scope.item.eventType = 'OTHR';
		}
		// mis.op显示交易识别码
		if (event.value == "OP"
				&& $scope.eventNo1 == "LMS") {
			$scope.tranIdenShow = true;
			$scope.item.transIdentificationCode = "";
		} else {
			$scope.tranIdenShow = false;
			$scope.item.transIdentificationCode = "";
		}
	});
		// 事件编号---
		/*
		 * $scope.eventNo1Arr = [{id : 'ISS',name : 'ISS'},{id :
		 * 'COS',name : 'COS'},{id : 'BSS',name : 'BSS'}, {id :
		 * 'MIS',name : 'MIS'},{id : 'ILS',name : 'ILS'},{id :
		 * 'AUS',name : 'AUS'}, {id : 'LMS',name : 'LMS'}, {id :
		 * 'OCS',name : 'OCS'}];
		 */
		// 动态请求事件编号
		$scope.eventNo1Arr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_eventType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 动态请求事件编号2 默认加载
		$scope.eventNo2Arr0 = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_eventTypeCode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		// $scope.eventNo2Arr = [];
		$scope.isShowEventNo2Arr0 = true;
		$scope.eventNo2Arr1 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_ISS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		/*$scope.eventNo2Arr2 = [ {name : 'AD',id : 'AD'}, 
	                        {name : 'BN',id : 'BN'}, 
	                        {name : 'CS',id : 'CS'},
	                        {name : 'IQ',id : 'IQ'}, 
	                        {name : 'UP',id : 'UP'}, 
	                        {name : 'SP',id : 'SP'} ];*/
		$scope.eventNo2Arr2 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_COS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		$scope.eventNo2Arr3 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_BSS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		$scope.eventNo2Arr4 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_MIS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		$scope.eventNo2Arr5 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_ILS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		/*$scope.eventNo2Arr6 = [ {name : 'IQ',id : 'IQ'}, {name : 'OP',id : 'OP'}, 
		                        {name : 'PM',id : 'PM'}, {name : 'CU',id : 'CU'}, 
		                        {name : 'VI',id : 'VI'}, {name : 'MC',id : 'MC'}, 
		                        {name : 'AU',id : 'AU'}, {name : 'IS',id : 'IS'}, 
		                        {name : 'IL',id : 'IL'}, {name : 'BH',id : 'BH'}, 
		                        {name : 'MI',id : 'MI'},{name : 'JC',id : 'JC'} ];*/
		$scope.eventNo2Arr6 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_AUS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		/*$scope.eventNo2Arr7 = [ {name : 'IQ',id : 'IQ'}, {name : 'OP',id : 'OP'}, 
		                        {name : 'PM',id : 'PM'} ];*/
		$scope.eventNo2Arr7 =  {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_eventNO2_LMS",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					//console.log(data)
				}
			};
		/*$scope.eventNo2Arr8 = [ {name : 'AD',id : 'AD'}, {name : 'IQ',id : 'IQ'}, 
		                        {name : 'UP',id : 'UP'}, {name : 'RT',id : 'RT'}, 
		                        {name : 'PT',id : 'PT'}, {name : 'BH',id : 'BH'} ];*/
		$scope.eventNo2Arr8 =  {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_eventNO2_OCS",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				//console.log(data)
			}
		};
		form.on('select(eventNo1)', function(event) {
			if (event.value == 'AUS') {// 授权事件，显示
				$scope.isAuthShow = false;
			} else {
				$scope.isAuthShow = true;
            }
            $scope.eventNo2 = '';
			$scope.item.eventType = '';
			if (event.value == 'ISS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = true;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'COS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = true;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'BSS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = true;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'MIS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = true;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'ILS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = true;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'AUS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = true;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'LMS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = true;
				$scope.isShowEventNo2Arr8 = false;
			} else if (event.value == 'OCS' || event.value == 'FMS') {
				$scope.isShowEventNo2Arr0 = false;
				$scope.isShowEventNo2Arr1 = false;
				$scope.isShowEventNo2Arr2 = false;
				$scope.isShowEventNo2Arr3 = false;
				$scope.isShowEventNo2Arr4 = false;
				$scope.isShowEventNo2Arr5 = false;
				$scope.isShowEventNo2Arr6 = false;
				$scope.isShowEventNo2Arr7 = false;
				$scope.isShowEventNo2Arr8 = true;
			}
		});
		// 收费项目下拉框
		$scope.feeItemArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "itemNoDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "feeItemNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "feeProject.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件配置的选择活动列表
		$scope.selAvyList = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.query',// 列表的资源
			autoQuery : false,
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		//关联
		$scope.pageCount = 0;
		$scope.pageNumP = 1;
		$scope.pageSizeP = 10;
		$rootScope.treeSelectAdd = [];
		$scope.saveSelect = function(event) {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.selAvyList.validCheck()) {
				return;
			}
			var items = $scope.selAvyList.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.treeSelectAdd.length; k++) {
					if (items[i].activityNo == $rootScope.treeSelectAdd[k].activityNo) { // 判断是否存在
						tipStr = tipStr + items[i].activityNo
								+ ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$rootScope.treeSelectAdd.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('PZJ400022')+ tipStr.substring(0,tipStr.length - 1)+ T.T('PZJ400023'));
            }
            // 分页
			pageInit();
		};
		//初始化分页函数
		function pageInit(){
			layui.use(['laypage'], function(){
	           var laypage = layui.laypage;
	           laypage.render({
                  elem: 'pageDemo',
                  count: $rootScope.treeSelectAdd.length,
                  limit: $scope.pageSizeP,
                  curr: $scope.pageNumP,
                  layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                  jump: function(obj,first){
                	  $scope.pageSizeP = obj.limit;
                	  $scope.pageNumP = obj.curr;
                	  jumpPage(obj.curr,obj.limit);
                  }
              });
          });
        }
        //跳转分页函数
		/*currPage: 当前页数
		 * pageSize： 每页条数
		*/
		function jumpPage(currPage, pageSize){
			$scope.dataList = [];
			if(currPage != 1){
				var indexNo = (currPage-1) * pageSize;
				if(currPage == Math.ceil($rootScope.treeSelectAdd.length / pageSize)){//末页
					var lastPageDataNum = $rootScope.treeSelectAdd.length % pageSize;
					if(lastPageDataNum){//末页不足一页
						for(var n = indexNo ; n < indexNo+lastPageDataNum ; n++){
							$scope.dataList.push($rootScope.treeSelectAdd[n]);
						}
						$scope.curPageData = $scope.dataList;
					}else {
						for(var n = indexNo ; n < indexNo+pageSize ; n++){
							$scope.dataList.push($rootScope.treeSelectAdd[n]);
						}
						$scope.curPageData = $scope.dataList;
                    }
                }else {//非第一页非末页
					for(var k = indexNo ; k < indexNo+pageSize ; k++){
						$scope.dataList.push($rootScope.treeSelectAdd[k]);
                    }
                    $scope.curPageData = $scope.dataList;
				}
			}else if(currPage == 1){
				if($rootScope.treeSelectAdd.length < pageSize){
					for(var n = 0 ; n < $rootScope.treeSelectAdd.length; n++){
						$scope.dataList.push($rootScope.treeSelectAdd[n]);
					}
					$scope.curPageData = $scope.dataList;
				}else {
					for(var j = 0 ; j < pageSize; j++){
						$scope.dataList.push($rootScope.treeSelectAdd[j]);
                    }
                    $scope.curPageData = $scope.dataList;
				}
			}
        }
        /*==================分页结束*/
		
		// 上移
		/*$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $rootScope.treeSelectAdd.length; i++) {
				if ($rootScope.treeSelectAdd[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $rootScope.treeSelectAdd[i];
					$rootScope.treeSelectAdd[i] = $rootScope.treeSelectAdd[i - 1];
					$rootScope.treeSelectAdd[i - 1] = dataMap;
					break;
				}
			}
		};*/
		
		//分页后 上移下移 排序函数
		/* order: 'up'/'down';上移/下移
		 * $thisItem: 当前的一条数据对象
		 * allData: 要对比的所有数据组
		 * key: 对比的key
		 * 
		*/
		$scope.orderUpFun = function(order,$thisItem,allData,key) {
			if(order == 'up'){
				for(var i =0 ; i < allData.length; i++){
					if($thisItem[key] && $thisItem[key] == allData[i][key]){
						var dataMap = allData[i];
						allData[i] = allData[i - 1];
						allData[i - 1] = dataMap;
						break;
                    }
                }
            }else if(order == 'down'){
				for(var m =0 ; m < allData.length; m++){
					if($thisItem[key] && $thisItem[key] == allData[m][key]){
						var dataMap = allData[m];
						allData[m] = allData[m + 1];
						allData[m + 1] = dataMap;
						break;
                    }
                }
            }
        };
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $scope.curPageData.length; i++) {
				if ($scope.curPageData[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $scope.curPageData[i];
					$scope.curPageData[i] = $scope.curPageData[i - 1];
					$scope.curPageData[i - 1] = dataMap;
					$scope.orderUpFun('up',data,$rootScope.treeSelectAdd,"activityNo");//总数据排序
					break;
				}
            }
        };
		// 下移
		/*$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $rootScope.treeSelectAdd.length; i++) {
				if ($rootScope.treeSelectAdd[i] == data) {
					if (i == $rootScope.treeSelectAdd.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $rootScope.treeSelectAdd[i];
					$rootScope.treeSelectAdd[i] = $rootScope.treeSelectAdd[i + 1];
					$rootScope.treeSelectAdd[i + 1] = dataMap;
					break;
				}
			}
		}*/
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $scope.curPageData.length; i++) {
				if ($scope.curPageData[i] == data) {
					if (i == $scope.curPageData.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $scope.curPageData[i];
					$scope.curPageData[i] = $scope.curPageData[i + 1];
					$scope.curPageData[i + 1] = dataMap;
					$scope.orderUpFun('down',data,$rootScope.treeSelectAdd,"activityNo");//总数据排序
					break;
				}
            }
        };
		$scope.queryParam01 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_typeTriggerMode",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
			function(data) {
				$scope.triggerTyList = [];
				$scope.triggerTyList = data.returnData.rows;
			});
			$scope.queryParam02 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_dimensionalOrder",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam02).then(
			function(data) {
				$scope.triggerEventRecogDimenList = [];
				$scope.triggerEventRecogDimenList = data.returnData.rows;
			});
			$scope.queryParam03 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_ interactionType",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam03).then(
			function(data) {
				$scope.triggerEventInteractModeList = [];
				$scope.triggerEventInteractModeList = data.returnData.rows;
			});
		// 修改关联活动
		$scope.updateSelectEvent = function(event, $index) {
			$scope.indexNo = $index;
			// 页面弹出框事件(弹出页面)
			$scope.itemContactAct = {};
			$scope.itemContactAct = $.parseJSON(JSON.stringify(event));
			$scope.itemContactAct.eventNo = $scope.eventNo1+ '.' + $scope.eventNo2 + '.'+ $scope.eventNo3 + '.' + $scope.eventNo4;
			$scope.modal('/beta/evList/addContactActivity.html',$scope.itemContactAct, {
				title : T.T('PZJ400024'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1050px', '400px' ],
				callbacks : [ $scope.updateActive ]
			});
		};
		$scope.updateActive = function(result) {
			$scope.items = result.scope.updateCA;
			if($scope.triggerTyList.length > 0){
				for(var i=0;i<$scope.triggerTyList.length;i++){
					if($scope.triggerTyList[i].codes == $scope.items.triggerTyp){
						$rootScope.treeSelectAdd[$scope.indexNo].triggerTypDesc = $scope.triggerTyList[i].detailDesc;
					}
				}
			}
			if($scope.triggerEventRecogDimenList.length > 0){
				for(var i=0;i<$scope.triggerEventRecogDimenList.length;i++){
					if($scope.triggerEventRecogDimenList[i].codes == $scope.items.triggerEventRecogDimen){
						$rootScope.treeSelectAdd[$scope.indexNo].triggerEventRecogDimenDesc = $scope.triggerEventRecogDimenList[i].detailDesc;
					}
				}
			}
			if($scope.triggerEventInteractModeList.length > 0){
				for(var i=0;i<$scope.triggerEventInteractModeList.length;i++){
					if($scope.triggerEventInteractModeList[i].codes == $scope.items.triggerEventInteractMode){
						$rootScope.treeSelectAdd[$scope.indexNo].triggerEventInteractModeDesc = $scope.triggerEventInteractModeList[i].detailDesc;
					}
				}
			}
			$rootScope.treeSelectAdd[$scope.indexNo].triggerNo = $scope.items.triggerNo;
			$rootScope.treeSelectAdd[$scope.indexNo].triggerTyp = $scope.items.triggerTyp;
			$rootScope.treeSelectAdd[$scope.indexNo].upaccountingUseFlag = $scope.items.upaccountingUseFlag;
			$rootScope.treeSelectAdd[$scope.indexNo].triggerEventRecogDimen = $scope.items.triggerEventRecogDimen;
			$rootScope.treeSelectAdd[$scope.indexNo].triggerEventInteractMode = $scope.items.triggerEventInteractMode;
			$rootScope.treeSelectAdd[$scope.indexNo].eventTriggerList = $rootScope.treeSelectAddUpdae;
			$scope.safeApply();
			result.cancel();
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			for (var i =0 ; i < $rootScope.treeSelectAdd.length; i++) {
				if($scope.curPageData[checkId].activityNo == $rootScope.treeSelectAdd[i].activityNo){
					$rootScope.treeSelectAdd.splice(checkId, 1);
				}
            }
            $scope.curPageData.splice(checkId, 1);
			pageInit();//分页刷新
		}
	});
	webApp.controller('addContactActivityCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService,$timeout,
		$translate, T, $translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translate.refresh();
		$scope.updateCA = $scope.itemContactAct;
		$rootScope.treeSelectAddUpdae = [];
		$scope.eventListShow = false;
		/* 触发方式 活动自身触发-A,通过总控触发-G,交易登记-T */
		$scope.acTriggerTyp = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeTriggerMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		/*
		 * 触发事件识别维度
		 * 业务类型-MODT,延滞状况-DELQ,余额对象-MODB,业务项目-MODG,元件编号-ELE
		 */
		$scope.dimenArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dimensionalOrder",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		/* 触发事件交互方式下拉框 同步触发（HTTP）-SYNC,异步触发-ASYNC
		 */
		$scope.wayArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ interactionType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                     
	        }
		};
		$scope.choseEventAdd = function() {
			// 弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/choseEvent.html',$scope.params, {
				title : T.T('PZJ100023'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseEventFeeAdd ]
			});
		};
		$scope.choseEventFeeAdd = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.updateCA.triggerNo = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		// 事件列表
		$scope.eventList = {
			autoQuery : false,
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 维度判断
		$scope.checkActivityEvent = function() {
			if ($scope.updateCA.triggerEventRecogDimen == "MODT") {
				$scope.demoArr = {};
				$scope.resultStrArr = [];
				$rootScope.treeSelect2 = [];
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				// 业务类型
				$scope.queryselParam = {};
				jfRest.request('businessType', 'query',$scope.queryselParam).then(
					function(data) {
						if (data.returnCode == '000000') {	
							var str = {};
							if (data.returnData.rows) {
								$rootScope.treeSelect2 = data.returnData.rows;
								for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
									str = {
										name : $rootScope.treeSelect2[j].businessDesc,
										id : $rootScope.treeSelect2[j].businessTypeCode
									};
									$scope.resultStrArr.push(str);
									$scope.demoArr = $scope.builder.option($scope.resultStrArr);
								}
								$scope.eventListShow = true;
								$timeout(function(){
					        		Tansun.plugins.render('select');
								});
							} else {
								jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
			} else if ($scope.updateCA.triggerEventRecogDimen == "DELQ") {
				// 延滞状况
				$rootScope.treeSelect2 = [];
				$scope.demoArr = {};
				$scope.resultStrArr = [];
				$scope.queryselParam = {};
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				jfRest.request('delayState', 'query',
				$scope.queryselParam).then(function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].delayDesc,
									id : $rootScope.treeSelect2[j].delayState
								};
								$scope.resultStrArr.push(str);
								$scope.demoArr = $scope.builder.option($scope.resultStrArr);
							}
							$timeout(function(){
				        		Tansun.plugins.render('select');
							});
							$scope.eventListShow = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
			} else if ($scope.updateCA.triggerEventRecogDimen == "MODB") {
				$scope.demoArr = {};
				$scope.resultStrArr = [];
				$rootScope.treeSelect2 = [];
				$scope.queryselParam = {};
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				jfRest.request('balanceObject', 'query',$scope.queryselParam).then(function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].objectDesc,
									id : $rootScope.treeSelect2[j].balanceObjectCode
								};
								$scope.resultStrArr.push(str);
								$scope.demoArr = $scope.builder.option($scope.resultStrArr);
							}
							$timeout(function(){
				        		Tansun.plugins.render('select');
							});
							$scope.eventListShow = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				// 余额对象
				// 识别维度代码下拉框
			} else if ($scope.updateCA.triggerEventRecogDimen == "MODG") {
				$scope.demoArr = {};
				$scope.resultStrArr = [];
				$rootScope.treeSelect2 = [];
				$scope.queryselParam = {};
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				jfRest.request('productLine', 'query',$scope.queryselParam).then(
				function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].programDesc,
									id : $rootScope.treeSelect2[j].businessProgramNo
								};
								$scope.resultStrArr.push(str);
								$scope.demoArr = $scope.builder.option($scope.resultStrArr);
							}
							$timeout(function(){
				        		Tansun.plugins.render('select');
							});
							$scope.eventListShow = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				// 业务项目
				// 识别维度代码下拉框
			} else if ($scope.updateCA.triggerEventRecogDimen == "ELE") {
				$scope.demoArr = {};
				$scope.resultStrArr = [];
				$rootScope.treeSelect2 = [];
				$scope.queryselParam = {};
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				jfRest.request('elementDimen', 'query',$scope.queryselParam).then(function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].elementDesc,
									id : $rootScope.treeSelect2[j].elementNo
								};
								$scope.resultStrArr.push(str);
								$scope.demoArr = $scope.builder.option($scope.resultStrArr);
							}
							$timeout(function(){
				        		Tansun.plugins.render('select');
							});
							$scope.eventListShow = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				//交易识别--- 识别维度代码下拉框
			}else if ($scope.updateCA.triggerEventRecogDimen == "TRID") {
				$scope.demoArr = {};
				$scope.resultStrArr = [];
				$scope.queryselParam = {};
				$rootScope.treeSelect2 = [];
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				jfRest.request('transIdenty', 'query',$scope.queryselParam).then(function(data) {
					if (data.returnCode == '000000') {
						var str = {};
						if (data.returnData.rows) {
							$rootScope.treeSelect2 = data.returnData.rows;
							for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
								str = {
									name : $rootScope.treeSelect2[j].transIdentifiDesc,
									id : $rootScope.treeSelect2[j].transIdentifiNo
								};
								$scope.resultStrArr.push(str);
								$scope.demoArr = $scope.builder.option($scope.resultStrArr);
							}
							$timeout(function(){
				        		Tansun.plugins.render('select');
							});
							$scope.eventListShow = true;
						} else {
							jfLayer.fail(T.T('KHJ2500003'));
						}
					}
				});
				//顺序号
			} else if ($scope.updateCA.triggerEventRecogDimen == "SEQN") {
				$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
				$scope.resultStrArr = [ {
					name : '1',
					id : '1'
				}, {
					name : '2',
					id : '2'
				}, {
					name : '3',
					id : '3'
				}, {
					name : '4',
					id : '4'
				}, {
					name : '5',
					id : '5'
				} ];
				$scope.demoArr = $scope.builder.option($scope.resultStrArr);
				$timeout(function(){
	        		Tansun.plugins.render('select');
				});
				$scope.eventListShow = true;
			} else {
				$scope.eventListShow = false;
				$scope.updateCA.recogDimenCode = "";
				$rootScope.treeSelectAddUpdae = [];
			}
		};
		$scope.checkActivityEvent();
			var form = layui.form;
			form.on('select(dimen)', function(event) {
					if (event.value == "MODT") {
						$scope.demoArr = {};
						$scope.resultStrArr = [];
						$rootScope.treeSelect2 = [];
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						// 业务类型
						$scope.queryselParam = {};
						jfRest.request('businessType', 'query',$scope.queryselParam).then(
							function(data) {
								if (data.returnCode == '000000') {	
									var str = {};
									if (data.returnData.rows) {
										$rootScope.treeSelect2 = data.returnData.rows;
										for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
											str = {
												name : $rootScope.treeSelect2[j].businessDesc,
												id : $rootScope.treeSelect2[j].businessTypeCode
											};
											$scope.resultStrArr.push(str);
											$scope.demoArr = $scope.builder.option($scope.resultStrArr);
										}
										$timeout(function(){
							        		Tansun.plugins.render('select');
										});
										$scope.eventListShow = true;
									} else {
										jfLayer.fail(T.T('KHJ2500003'));
								}
							}
						});
					} else if (event.value == "DELQ") {
						// 延滞状况
						$scope.demoArr = {};
						$scope.resultStrArr = [];
						$rootScope.treeSelect2 = [];
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						$scope.queryselParam = {};
						jfRest.request('delayState', 'query',
						$scope.queryselParam).then(function(data) {
							if (data.returnCode == '000000') {
								var str = {};
								if (data.returnData.rows) {
									$rootScope.treeSelect2 = data.returnData.rows;
									for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
										str = {
											name : $rootScope.treeSelect2[j].delayDesc,
											id : $rootScope.treeSelect2[j].delayState
										};
										$scope.resultStrArr.push(str);
										$scope.demoArr = $scope.builder.option($scope.resultStrArr);
									}
									$timeout(function(){
						        		Tansun.plugins.render('select');
									});
									$scope.eventListShow = true;
								} else {
									jfLayer.fail(T.T('KHJ2500003'));
								}
							}
						});
					} else if (event.value == "MODB") {
						$scope.demoArr = {};
						$scope.resultStrArr = [];
						$rootScope.treeSelect2 = [];
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						$scope.queryselParam = {};
						jfRest.request('balanceObject', 'query',$scope.queryselParam).then(function(data) {
							if (data.returnCode == '000000') {
								var str = {};
								if (data.returnData.rows) {
									$rootScope.treeSelect2 = data.returnData.rows;
									for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
										str = {
											name : $rootScope.treeSelect2[j].objectDesc,
											id : $rootScope.treeSelect2[j].balanceObjectCode
										};
										$scope.resultStrArr.push(str);
										$scope.demoArr = $scope.builder.option($scope.resultStrArr);
									}
									$timeout(function(){
						        		Tansun.plugins.render('select');
									});
									$scope.eventListShow = true;
								} else {
									jfLayer.fail(T.T('KHJ2500003'));
								}
							}
						});
						// 余额对象
						// 识别维度代码下拉框
					} else if (event.value == "MODG") {
						$scope.demoArr = {};
						$scope.resultStrArr = [];
						$rootScope.treeSelect2 = [];
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						$scope.queryselParam = {};
						jfRest.request('productLine', 'query',$scope.queryselParam).then(
						function(data) {
							if (data.returnCode == '000000') {
								var str = {};
								if (data.returnData.rows) {
									$rootScope.treeSelect2 = data.returnData.rows;
									for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
										str = {
											name : $rootScope.treeSelect2[j].programDesc,
											id : $rootScope.treeSelect2[j].businessProgramNo
										};
										$scope.resultStrArr.push(str);
										$scope.demoArr = $scope.builder.option($scope.resultStrArr);
									}
									$timeout(function(){
						        		Tansun.plugins.render('select');
									});
									$scope.eventListShow = true;
								} else {
									jfLayer.fail(T.T('KHJ2500003'));
								}
							}
						});
						// 业务项目
						// 识别维度代码下拉框
					} else if (event.value == "ELE") {
						$scope.demoArr = {};
						$scope.resultStrArr = [];
						$rootScope.treeSelect2 = [];
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						$scope.queryselParam = {};
						jfRest.request('elementDimen', 'query',$scope.queryselParam).then(function(data) {
							if (data.returnCode == '000000') {
								var str = {};
								if (data.returnData.rows) {
									$rootScope.treeSelect2 = data.returnData.rows;
									for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
										str = {
											name : $rootScope.treeSelect2[j].elementDesc,
											id : $rootScope.treeSelect2[j].elementNo
										};
										$scope.resultStrArr.push(str);
										$scope.demoArr = $scope.builder.option($scope.resultStrArr);
									}
									$timeout(function(){
						        		Tansun.plugins.render('select');
									});
									$scope.eventListShow = true;
								} else {
									jfLayer.fail(T.T('KHJ2500003'));
								}
							}
						});
						// 交易识别
						// 识别维度代码下拉框
					}else if (event.value == "TRID") {
						$scope.demoArr = {};
						$scope.resultStrArr = [];
						$rootScope.treeSelect2 = [];
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						$scope.queryselParam = {};
						jfRest.request('transIdenty', 'query',$scope.queryselParam).then(function(data) {
							if (data.returnCode == '000000') {
								var str = {};
								if (data.returnData.rows) {
									$rootScope.treeSelect2 = data.returnData.rows;
									for (var j = 0; j < $rootScope.treeSelect2.length; j++) {
										str = {
											name : $rootScope.treeSelect2[j].transIdentifiDesc,
											id : $rootScope.treeSelect2[j].transIdentifiNo
										};
										$scope.resultStrArr.push(str);
										$scope.demoArr = $scope.builder.option($scope.resultStrArr);
									}
									$timeout(function(){
						        		Tansun.plugins.render('select');
									});
									$scope.eventListShow = true;
								} else {
									jfLayer.fail(T.T('KHJ2500003'));
								}
							}
						});
					}else if (event.value == "SEQN") {
						$scope.demoArr = {};
						if($scope.itemContactAct.eventTriggerList){
							$rootScope.treeSelectAddUpdae = $scope.itemContactAct.eventTriggerList; 
						}else{
							$rootScope.treeSelectAddUpdae = [];
						}
						$scope.resultStrArr = [ {
							name : '1',
							id : '1'
						}, {
							name : '2',
							id : '2'
						}, {
							name : '3',
							id : '3'
						}, {
							name : '4',
							id : '4'
						}, {
							name : '5',
							id : '5'
						} ];
						$scope.demoArr = $scope.builder.option($scope.resultStrArr);
						$timeout(function(){
			        		Tansun.plugins.render('select');
						});
						$scope.eventListShow = true;
					}  else {
						$scope.eventListShow = false;
						$scope.updateCA.recogDimenCode = "";
						$rootScope.treeSelectAddUpdae = [];
					}
			});
			// 触发方式为交易登记，触发事件交互方式为异步
			$scope.triggerMode = true;
			form.on('select(triggTyp)',function(event) {
				if (event.value == "T") {
					$scope.updateCA.triggerEventInteractMode = "ASYNC";
					$scope.triggerMode = false;
				} else {
					$scope.updateCA.triggerEventInteractMode = "";
					$scope.triggerMode = true;
				}
			});
			// 已关联事件选择识别维度
			form.on('select(getRecogDimAdd)',function(data) {
				if (data.value) {
					for (var i = 0; i < $rootScope.treeSelectAddUpdae.length; i++) {
						if (i != data.elem.parentElement.id) {
							if (data.value == $rootScope.treeSelectAddUpdae[i].recogDimenCode) {
								$rootScope.treeSelectAddUpdae[data.elem.parentElement.id].recogDimenCode = "";
								jfLayer.fail(T.T('PZJ100050'));
								return;
							}
						}
					}
                }
            });
			$scope.saveSelectAdd = function(event) {
				var isTip = false; // 是否提示
				var tipStr = "";
				if (!$scope.eventList.validCheck()) {
					return;
				}
				var items = $scope.eventList.checkedList();
				for (var i = 0; i < items.length; i++) {
					var isExist = false; // 是否存在
					for (var k = 0; k < $rootScope.treeSelectAddUpdae.length; k++) {
						// items[i].eventNo ==
						// $rootScope.treeSelect1[k].triggerNo
						if (false) { // 判断是否存在
							tipStr = tipStr + items[i].eventNo+ ",";
							isTip = true;
							isExist = true;
							break;
						}
					}
					if (!isExist) {
						$scope.tempList = {};
						$scope.tempList.eventNo = $scope.updateCA.eventNo;
						$scope.tempList.activityNo = $scope.updateCA.activityNo;
						$scope.tempList.triggerNo = items[i].eventNo;
						$rootScope.treeSelectAddUpdae.push($scope.tempList);
					}
				}
				if (isTip) {
					jfLayer.alert(T.T('PZJ100031')+ tipStr.substring(0,tipStr.length - 1)+ T.T('PZJ100032'));
				}
			};
			// 上移
			$scope.exchangeSeqNoUp = function(data) {
				for (var i = 0; i < $rootScope.treeSelectAddUpdae.length; i++) {
					if ($rootScope.treeSelectAddUpdae[i] == data) {
						if (i == 0) {
							jfLayer.fail(T.T('F00024'));
							break;
						}
						var dataMap = $rootScope.treeSelectAddUpdae[i];
						$rootScope.treeSelectAddUpdae[i] = $rootScope.treeSelectAddUpdae[i - 1];
						$rootScope.treeSelectAddUpdae[i - 1] = dataMap;
						break;
					}
				}
			};
			// 下移
			$scope.exchangeSeqNoDown = function(data) {
				for (var i = 0; i < $rootScope.treeSelectAddUpdae.length; i++) {
					if ($rootScope.treeSelectAddUpdae[i] == data) {
						if (i == $rootScope.treeSelectAddUpdae.length - 1) {// 判断第几条数据
							jfLayer.fail(T.T('F00025'));
							break;
						}
						var dataMap = $rootScope.treeSelectAddUpdae[i];
						$rootScope.treeSelectAddUpdae[i] = $rootScope.treeSelectAddUpdae[i + 1];
						$rootScope.treeSelectAddUpdae[i + 1] = dataMap;
						break;
					}
				}
			};
			// 删除关联活动
			$scope.removeSelect = function(data) {
				var checkId = data;
				$rootScope.treeSelectAddUpdae.splice(checkId, 1);
			}
		});
	// ******************************余额对象设置参数值pcd修改***************
	webApp.controller('selectPCDEventCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,
		$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdExampleInf = {};
		$scope.pcdDifExampleInf = {};
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
		//console.log($scope.artifactInfo);
		$scope.businessValueArr = [ {name : T.T('YYJ400001'),id : 'MODT'}, {name : T.T('YYJ400002'),id : 'MODM'}, 
		                            {name : T.T('YYJ400003'),id : 'MODB'}, {name : T.T('YYJ400004'),id : 'MODG'}, 
		                            {name : T.T('YYJ400005'),id : 'ACST'}, {name : T.T('YYJ400006'),id : 'EVEN'}, 
		                            {name : T.T('YYJ400007'),id : 'BLCK'}, {name : T.T('YYJ400008'),id : 'AUTX'}, 
		                            {name : T.T('YYJ400009'),id : 'LMND'}, {name : T.T('YYJ400010'),id : 'CURR'}, 
		                            {name : T.T('YYJ400011'),id : 'MODP'}, {name : T.T('YYJ400012'),id : 'DELQ'} ];// 业务性质
	// pcd实例化取值类型
	$scope.pcdtypeArray = [ {name : T.T('YYJ400013'),id : 'D'}, {name : T.T('YYJ400014'),id : 'P'}, 
	                        {name : T.T('YYJ400043'),id : 'O'} ];
	// 分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态
	/*
	 * 空-无分段 DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态 ACT-核算状态
	 * CUR-币种
	 */
	$scope.segmentTypeArray = [ {name : T.T('YYJ400044'),id : 'DAY'},{name : T.T('YYJ400045'),id : 'MTH'}, 
	                            {name : T.T('YYJ400046'),id : 'CYC'},{name : T.T('YYJ400047'),id : 'DLQ'}, 
	                            {name : T.T('YYJ400050'),id : 'ACT'},{name : T.T('YYJ400051'),id : 'CUR'} ];
	// 新增pcd差异化不显示
	$scope.showNewPcdInfoUpdate = false;
	$scope.pcdInfTable = [];
	// pcd差异化实例 新增按钮
	$scope.newPcdBtnUpdate = function() {
		$scope.pcdExampleInfUpdate = {};
		$scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
		if ($scope.showNewPcdInfoUpdate) {
			$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
		}
	};
	$scope.pcdInstanShow = true;
	$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0, 8);
	if ($scope.itemsPCD.segmentType != null) {// 分段类型不为空segmentNumber
		$scope.pcdExampleInf.segmentType = $scope.itemsPCD.segmentType;
		$scope.addButtonShowUpdate = true;
	} else {
		$scope.addButtonShowUpdate = false;
	}
	if ($scope.itemsPCD.pcdInstanList != null) {
		$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
	} else {
		$scope.showNewPcdInfoUpdate = true;
	}
	/*
	 * if($scope.itemsPCD.pcdList!=null){ $scope.pcdInfTable =
	 * $scope.itemsPCD.pcdList; }
	 */
	$scope.item.deletePcdInstanIdList = [];
	// 删除pcd实例列表某行
	$scope.deletePcdDifUpdate = function(item, data) {
		if ($scope.pcdInfTable.length == 1) {
			jfLayer.fail(T.T('YYJ400048'));
			return;
		}
		var checkId = data;
		$scope.pcdInfTable.splice(checkId, 1);
		if (item.id != null && item.id != undefined
				&& item.id != '' && item.id) {
			$scope.item.deletePcdInstanIdList.push(item.id);
        }
    };
	// 修改pcd实例列表某行
	$scope.updateInstanUpdate = function(event, $index) {
		$scope.indexNoTemp = '';
		$scope.indexNoTemp = $index;
		$scope.showNewPcdInfoUpdate = true;
		$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
		$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
	};
	// 保存pcd实例============余额对象实例化设置参数值
	$scope.saveNewAdrInfoUpdate = function() {
		if (null == $scope.pcdExampleInfUpdate.pcdPoint
				|| null == $scope.pcdExampleInfUpdate.pcdType
				|| null == $scope.pcdExampleInfUpdate.pcdValue) {
			jfLayer.fail(T.T('YYJ400049'));
			return;
		}
		var pcdInfTableInfoU = {};
		// pcdInfTableInfoU =
		// $(pcdInfTableInfoU,$scope.pcdExampleInf);
		pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
		pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
		pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
		pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
		pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
		pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
		pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
		pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
		pcdInfTableInfoU.pcdType = $scope.pcdExampleInfUpdate.pcdType;
		pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
		pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
		pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
		pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
		pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
		if ($scope.indexNoTemp != undefined && $scope.indexNoTemp != null) {
			$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
			$scope.pcdInfTable[$scope.indexNoTemp].pcdType = $scope.pcdExampleInfUpdate.pcdType;
			$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
			$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
			$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
			$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
			$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
			$scope.indexNo = null;
		}else {
			$scope.pcdInfTable.push(pcdInfTableInfoU);
			$scope.pcdExampleInfUpdate = {};
		}
		$scope.pcdDifExampleInf.pcdNo = pcdInfTableInfoU.pcdNo;
		$scope.showNewPcdInfoUpdate = false;
	};
	//
	var dataValueCount;
	// dataType维度取值，dataValue第几个实例代码
	$scope.chosedInstanCode = function(dataType) {
		if (dataType == "MODT") {// 业务类型
			// 弹框查询列表
			$scope.params = {
				"operationMode" : $rootScope.operationMods,
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/choseBusinessType.html',$scope.params,{
				title : T.T('YYJ400021'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseBusType ]
			});
		} else if (dataType == "MODM") {// 媒介对象
			// 弹框查询列表
			$scope.params = {
				"operationMode" : $rootScope.operationMods,
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/choseMediaObject.html',$scope.params,{
				title : T.T('YYJ400022'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseMedia ]
			});
		} else if (dataType == "MODB") {// 余额对象
		// 弹框查询列表
			$scope.params = {
				"operationMode" : $rootScope.operationMods,
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/choseBalanceObject.html',$scope.params,
			{
				title : T.T('YYJ400023'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseBalanceObject ]
			});
		} else if (dataType == "MODP") {// 产品对象
			// 弹框查询列表
			$scope.params = {
				"operationMode" : $rootScope.operationMods,
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/choseProductObject.html',$scope.params,{
				title : T.T('YYJ400024'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseProductObject ]
			});
		} else if (dataType == "MODG") {// 业务项目
			// 弹框查询列表
			$scope.params = {
				"operationMode" : $rootScope.operationMods,
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/choseProductLine.html',$scope.params,{
				title : T.T('YYJ400025'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseProductLine ]
			});
		} else if (dataType == "ACST") {// 核算状态
			// 弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/choseAcst.html',$scope.params, {
				title : T.T('YYJ400026'),
				buttons : [ T.T('F00107'),
						T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [ $scope.choseAcst ]
			});
	} else if (dataType == "EVEN") {// 事件
		// 弹框查询列表
		$scope.params = {
			"pageSize" : 10,
			"indexNo" : 0
		};
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/example/choseEvent.html',$scope.params,{
			title : T.T('YYJ400027'),
			buttons : [ T.T('F00107'),
					T.T('F00012') ],
			size : [ '1000px', '400px' ],
			callbacks : [ $scope.choseEvent ]
		});
	} else if (dataType == "BLCK") {// 封锁码
		// 弹框查询列表
		$scope.params = {
			"operationMode" : $rootScope.operationMods,
			"pageSize" : 10,
			"indexNo" : 0
		};
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/example/choseBlockCode.html',$scope.params,{
			title : T.T('YYJ400028'),
			buttons : [ T.T('F00107'),
					T.T('F00012') ],
			size : [ '1000px', '400px' ],
			callbacks : [ $scope.choseBlockCode ]
		});
	} else if (dataType == "AUTX") {// 授权场景
		// 弹框查询列表
		$scope.params = {
			"operationMode" : $rootScope.operationMods,
			"pageSize" : 10,
			"indexNo" : 0
		};
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/example/choseScenarioList.html',$scope.params,{
			title : T.T('YYJ400029'),
			buttons : [ T.T('F00107'),
					T.T('F00012') ],
			size : [ '1000px', '400px' ],
			callbacks : [ $scope.choseScenarioList ]
		});
	} else if (dataType == "LMND") {// 额度节点
		// 弹框查询列表
		$scope.params = {
			"operationMode" : $rootScope.operationMods,
			"pageSize" : 10,
			"indexNo" : 0
		};
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/example/choseQuotaTree.html',$scope.params,{
			title : T.T('YYJ400030'),
			buttons : [ T.T('F00107'),
					T.T('F00012') ],
			size : [ '1000px', '400px' ],
			callbacks : [ $scope.choseQuotaTree ]
		});
	} else if (dataType == "CURR") {// 币种
		// 弹框查询列表
		$scope.params = {
			"pageSize" : 10,
			"indexNo" : 0
		};
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/example/choseCurrency.html',$scope.params,{
			title : T.T('YYJ400027'),
			buttons : [ T.T('F00107'),
					T.T('F00012') ],
			size : [ '1000px', '400px' ],
			callbacks : [ $scope.choseCurrency ]
		});
	} else if (dataType == "DELQ") {// 延滞层级
		// 弹框查询列表
		$scope.params = {
			"pageSize" : 10,
			"indexNo" : 0
		};
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/example/choseDelv.html',$scope.params, {
			title : T.T('YYJ400031'),
			buttons : [ T.T('F00107'),
					T.T('F00012') ],
			size : [ '1000px', '400px' ],
			callbacks : [ $scope.choseDelv ]
		});
	}
};
		$scope.choseCurrency = function(result) {
			if (!result.scope.currencyTable.validCheck()) {
				return;
			}
			$scope.checkedCurrency = result.scope.currencyTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBlockCode = function(result) {
			if (!result.scope.blockCDScnMgtTable.validCheck()) {
				return;
			}
			$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+ $scope.checkedBlockCode.blockCodeScene);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseEvent = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBusType = function(result) {
			if (!result.scope.businessTypeList.validCheck()) {
				return;
			}
			$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseAcst = function(result) {
			console.log(result);
			// if (!result.scope.itemList.validCheck()) {
			if (!result.scope.accountStateTable.validCheck()) {
				return;
			}
			$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
			// $scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseProductLine = function(result) {
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedProLine = result.scope.proLineList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseMedia = function(result) {
			if (!result.scope.mediaObjectList.validCheck()) {
				return;
			}
			$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBalanceObject = function(result) {
			if (!result.scope.balanceObjectList.validCheck()) {
				return;
			}
			$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseProductObject = function(result) {
			if (!result.scope.proObjectList.validCheck()) {
				return;
			}
			$scope.checkedProObject = result.scope.proObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseScenarioList = function(result) {
			if (!result.scope.scenarioList.validCheck()) {
				return;
			}
			$scope.checkedScenario = result.scope.scenarioList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseQuotaTree = function(result) {
			if (!result.scope.quotaTreeList.validCheck()) {
				return;
			}
			$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseDelv = function(result) {
			if (!result.scope.delvTable.validCheck()) {
				return;
			}
			$scope.checkedDelv = result.scope.delvTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
			$scope.safeApply();
			result.cancel();
		};
		$scope.InstanCodeValue = function(dataValue, code) {
			if (dataValue == '1') {
				$scope.artifactExampleInf.instanCode1 = code;
			} else if (dataValue == '2') {
				$scope.artifactExampleInf.instanCode2 = code;
			} else if (dataValue == '3') {
				$scope.artifactExampleInf.instanCode3 = code;
			} else if (dataValue == '4') {
				$scope.artifactExampleInf.instanCode4 = code;
			} else if (dataValue == '5') {
				$scope.artifactExampleInf.instanCode5 = code;
			} else if (dataValue == 'base') {
				$scope.pcdExampleInf.baseInstanCode = code;
			} else if (dataValue == 'option') {
				$scope.pcdExampleInf.optionInstanCode = code;
			}
		};
		$scope.choseInstanCode1Btn = function() {
			$scope.checkValidate();
			// 获取维度取值1的值
			dataValueCount = 1;
			$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen1);
		};
		$scope.choseInstanCode2Btn = function() {
			$scope.checkValidate();
			// 获取维度取值2的值
			dataValueCount = 2;
			$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen2);
		};
		$scope.choseInstanCode3Btn = function() {
			$scope.checkValidate();
			// 获取维度取值3的值
			dataValueCount = 3;
			$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen3);
		};
		$scope.choseInstanCode4Btn = function() {
			$scope.checkValidate();
			// 获取维度取值4的值
			dataValueCount = 4;
			$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen4);
		};
		$scope.choseInstanCode5Btn = function() {
			$scope.checkValidate();
			// 获取维度取值5的值
			dataValueCount = 5;
			$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen5);
		};
		$scope.choseBaseInstanCodeBtnUpdate = function() {
			// 获取基础维度的值
			dataValueCount = 'base';
			$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
		};
		$scope.choseOptionInstanCodeBtnUpdate = function() {
			// 获取可选维度的值
			dataValueCount = 'option';
			$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
		};
	});
	// ******************************替换参数***************
	webApp.controller('selectElementNoEventCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService,
		$translate, $translatePartialLoader, T) {$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+ "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.artifactInfo = {};
		$scope.artifactInfo = $scope.itemsNo;
						// 元件
		$scope.elementNoTableUpdate = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0, 8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnData.rows != ""
						&& data.returnData.rows != undefined
						&& data.returnData.rows != null) {
					for (var i = 0; i < data.returnData.rows.length; i++) {
						if (data.returnData.rows[i].elementNo == $scope.itemsNo.elementNo) {
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
});
