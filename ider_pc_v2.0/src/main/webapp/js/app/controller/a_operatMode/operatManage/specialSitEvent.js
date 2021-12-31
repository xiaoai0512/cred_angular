'use strict';
define(function(require) {
	var webApp = require('app');
	// 特别状况事件
	webApp.controller('specialSitEventCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false;
		//根据菜单和当前登录者查询有权限的事件编号
		$scope.menuNoSel = $scope.menuNo;
		$scope.paramsNo = {
			menuNo: $scope.menuNoSel
		};
		jfRest.request('accessManage', 'selEvent', $scope.paramsNo).then(function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData != null || data.returnData != "") {
					for (var i = 0; i < data.returnData.length; i++) {
						$scope.eventList += data.returnData[i].eventNo + ",";
					}
					if ($scope.eventList.search('COS.IQ.02.0140') != -1) { //查询
						$scope.selBtnFlag = true;
					} else {
						$scope.selBtnFlag = false;
					}
					if ($scope.eventList.search('COS.AD.02.0140') != -1) { //新增
						$scope.addBtnFlag = true;
					} else {
						$scope.addBtnFlag = false;
					}
					if ($scope.eventList.search('COS.UP.02.0001') != -1) { //维护
						$scope.updBtnFlag = true;
					} else {
						$scope.updBtnFlag = false;
					}
				}
			} 
		});
		// 特别状况列表
		$scope.itemList = {
			params: $scope.queryParam = {
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'specialSitEvent.queryEvent', // 列表的资源specialSitEvent.queryEvent
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_scenarioTriggerType'],//查找数据字典所需参数
			transDict : ['sceneTriggerObject_sceneTriggerObjectDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//新增
		$scope.addList = function() {
			$scope.modal('/a_operatMode/optcenter/specialSitEventEst.html', '', {
				title: T.T('PZH100078'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1050px', '500px'],
				callbacks: [$scope.saveListAdd]
			});
		};
		// 保存按钮事件
		$scope.saveListAdd = function(result) {
			if (!result.scope.item.eventNo3 || !result.scope.itemNext.eventNo4) {
				jfLayer.alert(T.T('PZJ100058'));
				return;
            }
            if (!result.scope.item.eventNo4 || !result.scope.itemNext.eventNo4) {
				jfLayer.alert(T.T('PZJ100058'));
				return;
            }
            if (!result.scope.item.eventDesc || !result.scope.itemNext.eventDesc) {
				jfLayer.alert(T.T('PZJ100059'));
				return;
            }
            $scope.saveParams = {
				x0985BOList: []
			};
			$scope.item = result.scope.item;
			$scope.item.effectivenessCodeType = $scope.item.effectivenessInf.substring(0,1);
			$scope.item.effectivenessCodeScene = $scope.item.effectivenessInf.substring(2,4);
			$scope.itemNext = result.scope.itemNext;
			$scope.itemNext.effectivenessCodeType = $scope.itemNext.effectivenessInf.substring(0,1);
			$scope.itemNext.effectivenessCodeScene = $scope.itemNext.effectivenessInf.substring(2,4);
			$scope.item.eventNo = 'BSS.SP.' + result.scope.item.eventNo3 + '.' + result.scope.item.eventNo4;
			$scope.itemNext.eventNo = 'BSS.SP.' + result.scope.itemNext.eventNo3.substring(0,2) + '.' + result.scope.itemNext.eventNo4;
			$scope.itemInf = {
				eventType: 'NMNY',
				eventDesc: $scope.item.eventDesc,
				effectivenessCodeType: $scope.item.effectivenessCodeType,
				sceneTriggerObject: $scope.item.sceneTriggerObject,
				effectivenessCodeScene: $scope.item.effectivenessCodeScene,
				eventNo: $scope.item.eventNo,
			};
			$scope.itemNextInf = {
				eventType: 'NMNY',
				eventDesc: $scope.itemNext.eventDesc,
				effectivenessCodeType: $scope.itemNext.effectivenessCodeType,
				sceneTriggerObject: $scope.itemNext.sceneTriggerObject,
				effectivenessCodeScene: $scope.itemNext.effectivenessCodeScene,
				eventNo: $scope.itemNext.eventNo,
			};
			$scope.saveParams.x0985BOList.push($scope.itemInf);
			$scope.saveParams.x0985BOList.push($scope.itemNextInf);
			jfRest.request('specialSitEvent', 'saveEvent', $scope.saveParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.item = {};
					$scope.itemNext = {};
					$rootScope.treeSelectAdd = [];
					$rootScope.treeSelectAddRes = [];
					$scope.safeApply();
					result.cancel();
				} 
			});
		};
		$scope.checkEvDtlInf = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item1 = {};
			$scope.item1 = $.parseJSON(JSON.stringify(event));
			$scope.modal('/a_operatMode/optcenter/viewSpecialSitEvent.html', $scope.item1, {
				title: T.T('PZH100076'),
				buttons: [T.T('F00012')],
				size: ['1100px', '550px'],
				callbacks: []
			});
		};
		$scope.updateEvDtlInf = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.item.deletePcdInstanIdList = [];
			for (var key in $scope.item) {
				if ($scope.item[key] == "null" || $scope.item[key] == null) {
					$scope.item[key] = '';
				}
            }
            $scope.modal('/a_operatMode/optcenter/updateSpecialSitEvent.html', $scope.item, {
				title: T.T('PZH100077'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1100px', '450px'],
				callbacks: [$scope.saveEventActRel]
			});
		};
		// 回调函数/确认按钮事件
		$scope.saveEventActRel = function(result) {
			$scope.upParams = {
				x0985BOList: [],
				addOrUpdateFlag: 'modify'
			};
			$scope.item = result.scope.itemPos;
			$scope.item.effectivenessCodeType = result.scope.itemPoseffectivenessCodeTypeU1.substring(0,1);
			$scope.item.effectivenessCodeScene = result.scope.itemPoseffectivenessCodeTypeU1.substring(2,4);
			$scope.itemNext = result.scope.itemRes;
			$scope.itemNext.effectivenessCodeType = result.scope.itemReseffectivenessCodeTypeU2.substring(0,1);
			$scope.itemNext.effectivenessCodeScene = result.scope.itemReseffectivenessCodeTypeU2.substring(2,4);
			$scope.itemInf = {
				eventType: 'NMNY',
				eventDesc: $scope.item.eventDesc,
				effectivenessCodeType: $scope.item.effectivenessCodeType,
				sceneTriggerObject: result.scope.itemPossceneTriggerObjectU1,
				effectivenessCodeScene: $scope.item.effectivenessCodeScene,
				eventNo: $scope.item.eventNo,
			};
			$scope.itemNextInf = {
				eventType: 'NMNY',
				eventDesc: $scope.itemNext.eventDesc,
				effectivenessCodeType: $scope.itemNext.effectivenessCodeType,
				sceneTriggerObject: result.scope.itemRessceneTriggerObjectU2,
				effectivenessCodeScene: $scope.itemNext.effectivenessCodeScene,
				eventNo: $scope.itemNext.eventNo,
			};
			$scope.upParams.x0985BOList.push($scope.itemInf);
			$scope.upParams.x0985BOList.push($scope.itemNextInf);
			// 修改事件
			jfRest.request('specialSitEvent', 'saveEvent', $scope.upParams).then(function(data) {
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
	//详情
	webApp.controller('viewSpecialSitEventCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translate.refresh();
		//查询正反特别状况
		$scope.queryEvent = function() {
			$scope.queryParam = {
				spEventUpdateFlag: 'updateQuery',
				eventNo: $scope.item1.eventNo
			};
			jfRest.request('specialSitEvent', 'queryEvent', $scope.queryParam).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData) {
						$scope.itemPos = data.returnData[0]; //正向
						$scope.itemRes = data.returnData[1]; //反向
						//查询下拉框并赋值
						$scope.queryblockTpyeArray(); //管控码类别
						$scope.queryblockCodeRangeArr(); //场景触发对象
						//$scope.queryblockCodeSceneArray(); //封锁码场景序号
					} else {
						$scope.itemPos = {};
						$scope.itemRev = {};
					}
				}
			});
		};
		$scope.queryEvent();
		//管控码类别
		$scope.blockTpyeArray1 = {};
		$scope.blockTpyeArray2 = {};
		$scope.queryblockTpyeArray = function() {
			$scope.blockTpyeArray1 = {
				type: "dynamicDesc",
				param: {}, //默认查询条件 
				text: "effectivenessCodeType", //下拉框显示内容，根据需要修改字段名称 
				desc: "effectivenessCodeScene",
				descThree: "effectivenessCodeDesc",
				value: "effectivenessCodeScene", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "blockCode.query", //数据源调用的action 
				callback: function(data) {
					$scope.itemPoseffectivenessCodeTypeInfo1 = $scope.itemPos.effectivenessCodeType +'-'+$scope.itemPos.effectivenessCodeScene;
				}
			};
			$scope.blockTpyeArray2 = {
				type: "dynamicDesc",
				param: {}, //默认查询条件 
				text: "effectivenessCodeType", //下拉框显示内容，根据需要修改字段名称 
				desc: "effectivenessCodeScene",
				descThree: "effectivenessCodeDesc",
				value: "effectivenessCodeScene", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "blockCode.query", //数据源调用的action 
				callback: function(data) {
					$scope.itemReseffectivenessCodeTypeInfo2 = $scope.itemRes.effectivenessCodeType +'-'+$scope.itemPos.effectivenessCodeScene;
				}
			};
		};
		//场景触发对象：
		$scope.blockCodeRangeArr1 = {};
		$scope.blockCodeRangeArr2 = {};
		$scope.queryblockCodeRangeArr = function() {
			$scope.blockCodeRangeArr1 = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_scenarioTriggerType",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.itemPossceneTriggerObjectInfo1 = $scope.itemPos.sceneTriggerObject;
				}
			};
			$scope.blockCodeRangeArr2 = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_scenarioTriggerType",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.itemRessceneTriggerObjectInfo2 = $scope.itemRes.sceneTriggerObject;
				}
			};
		};
	});
	//修改
	webApp.controller('updateSpecialSitEventCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translate.refresh();
		//查询正反特别状况
		$scope.queryEvent = function() {
			$scope.queryParam = {
				spEventUpdateFlag: 'updateQuery',
				eventNo: $scope.item.eventNo
			};
			jfRest.request('specialSitEvent', 'queryEvent', $scope.queryParam).then(function(data) {
				if (data.returnCode == '000000') {
					//					console.log(data);
					if (data.returnData) {
						$scope.itemPos = data.returnData[0]; //正向
						$scope.itemRes = data.returnData[1]; //反向
						//查询下拉框并赋值
						$timeout(function(){
							$scope.queryblockTpyeArray(); //管控码类别
							$scope.queryblockCodeRangeArr(); //场景触发对象
						});
					} else {
						$scope.itemPos = {};
						$scope.itemRev = {};
					}
				} 
			});
		};
		$scope.queryEvent();
		//管控码类别
		$scope.blockTpyeArrayU1 = {};
		$scope.blockTpyeArrayU2 = {};
		$scope.queryblockTpyeArray = function() {
			$timeout(function(){
			$scope.blockTpyeArrayU1 = {
				type: "dynamicDesc",
				param: {}, //默认查询条件 
				text: "effectivenessCodeType", //下拉框显示内容，根据需要修改字段名称 
				desc: "effectivenessCodeScene",
				descThree: "effectivenessCodeDesc",
				value: "effectivenessCodeScene", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "blockCode.query", //数据源调用的action 
				callback: function(data) {
					$scope.itemPoseffectivenessCodeTypeU1 = $scope.itemPos.effectivenessCodeType +'-'+$scope.itemPos.effectivenessCodeScene;
				}
			};
			$scope.blockTpyeArrayU2 = {
					type: "dynamicDesc",
					param: {}, //默认查询条件 
					text: "effectivenessCodeType", //下拉框显示内容，根据需要修改字段名称 
					desc: "effectivenessCodeScene",
					descThree: "effectivenessCodeDesc",
					value: "effectivenessCodeScene", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "blockCode.query", //数据源调用的action 
					callback: function(data) {
						$scope.itemReseffectivenessCodeTypeU2 = $scope.itemRes.effectivenessCodeType +'-'+$scope.itemRes.effectivenessCodeScene;
					}
				};
			});
		};
		//场景触发对象：
		$scope.blockCodeRangeArrU1 = {};
		$scope.blockCodeRangeArrU2 = {};
		$scope.queryblockCodeRangeArr = function() {
			$timeout(function(){
			$scope.blockCodeRangeArrU1 = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_scenarioTriggerType",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.itemPossceneTriggerObjectU1 = $scope.itemPos.sceneTriggerObject;
				}
			};
			$scope.blockCodeRangeArrU2 = {
					type: "dictData",
					param: {
						"type": "DROPDOWNBOX",
						groupsCode: "dic_scenarioTriggerType",
						queryFlag: "children"
					}, //默认查询条件 
					text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
					value: "codes", //下拉框对应文本的值，根据需要修改字段名称
					resource: "paramsManage.query", //数据源调用的action 
					callback: function(data) {
						$scope.itemRessceneTriggerObjectU2 = $scope.itemRes.sceneTriggerObject;
					}
				};
			});
		};
		//联动封锁码场景序号
		var form = layui.form;
		form.on('select(getBlockTpye)', function(data1) {
			$scope.itemReseffectivenessCodeSceneU2 = '';
			$scope.itemReseffectivenessCodeTypeU2 = data1.value;
		});
		//场景触发对象：正向特别状况调整，反向也调整
		form.on('select(getSceneTriggerObject)', function(data) {
			$scope.itemRessceneTriggerObjectU2 = $scope.itemPossceneTriggerObjectU1;
		});
		//新增管控码
		$scope.updateAddBlockCode = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/blockCode/blockCodeEst.html','', {
				title : T.T('YYJ700018'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '560px' ],
				callbacks : [$scope.saveBlockCodeUpdate]
			});
		};
		//新增==========保存
		$scope.saveBlockCodeUpdate = function(result){
			if(!result.scope.isInfo){
				jfLayer.fail(T.T("F00086"));
				 return;
			}
			 $scope.blockCodeInf = {};
			$scope.blockCodeInf = result.scope.blockCodeInf;
			$scope.effectivenessCodeSceneInt = parseInt($scope.blockCodeInf.effectivenessCodeScene); 
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S2ListResult = [];
			 $("#s14 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s13){
				 for(var w=0;w<$rootScope.s13.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s13[w].controlProjectNo == $scope.arr2[t]){
							//$scope.S2List = $rootScope.s13[w];
							$scope.S2List = {operationMode:$rootScope.s13[w].operationMode,effectivenessCodeType:$scope.blockCodeInf.effectivenessCodeType,effectivenessCodeScene:$scope.effectivenessCodeSceneInt,controlProjectNo:$rootScope.s13[w].controlProjectNo,projectType:0};
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			 if($scope.S2ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ700022"));
				 return;
			 }
			 	$scope.arr4 = [];
				$scope.S4List = {};
				 $("#s26 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr4.push(vall);
			    });
				 if($rootScope.s25){
					 for(var w=0;w<$rootScope.s25.length;w++){
						 for(var t=0;t<$scope.arr4.length;t++){
							if($rootScope.s25[w].pricingTag == $scope.arr4[t]){
								//$scope.S4List = $rootScope.s25[w];
								$scope.S4List = {operationMode:$rootScope.s25[w].operationMode,effectivenessCodeType:$scope.blockCodeInf.effectivenessCodeType,effectivenessCodeScene:$scope.effectivenessCodeSceneInt,controlProjectNo:$rootScope.s25[w].pricingTag,projectType:1};
								$scope.S2ListResult.push($scope.S4List);
							}
						 }
					 }
				 }
			$scope.blockCodeInf.operationMode = result.scope.operationMode;
			$scope.blockCodeInf.list = $scope.S2ListResult;
			$scope.blockCodeInf.effectivenessCodeScene = $scope.effectivenessCodeSceneInt;
			console.log($scope.blockCodeInf);
			jfRest.request('blockCode','save', $scope.blockCodeInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.blockCodeInf = {};
					result.scope.blockCodeInfForm.$setPristine();
					$scope.blockTpyeArray ={};
					$scope.queryblockTpyeArray();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	// 新建事件
	webApp.controller('specialSitEventEstCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.item = {}; //这个对象不能删，否则报错
		$scope.itemNext = {}; //这个对象不能删，否则报错 下一步
		//正向事件编号
		$scope.item = {
			eventNo1: 'BSS',
			eventNo2: 'SP',
			eventType: 'NMNY',
			operatorId: sessionStorage.getItem("userName"),
			corporation: sessionStorage.getItem("corporation"), //法人实体ID
			adminFlagUser: sessionStorage.getItem("adminFlag"), //用户管理员标示
			list: [{
				activityNo: null,
				activityDesc: null,
				accountingUsrFlag: null
			}]
		};
		$scope.firstStepDiv = true; //第一步div
		$scope.nextStepDiv = false; //下一步div
		$scope.nextBtnBlock = true; //下一步按钮
		//封锁码类别dic_effectiveCodeType
		$scope.blockTpyeArray ={};
		$scope.queryBlockTpye = function(){
			$timeout(function(){
        		Tansun.plugins.render('select');
        		$scope.blockTpyeArray  = {
    				type: "dynamicDesc",
    				param: {}, //默认查询条件 
    				text: "effectivenessCodeType", //下拉框显示内容，根据需要修改字段名称 
    				desc: "effectivenessCodeScene",
    				descThree: "effectivenessCodeDesc",
    				value: "effectivenessCodeScene", //下拉框对应文本的值，根据需要修改字段名称 
    				resource: "blockCode.query", //数据源调用的action 
    				callback: function(data) {}
    			};
			});
		};
		$scope.queryBlockTpye();
		//场景触发对象：
		$scope.blockCodeRangeArr  = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_scenarioTriggerType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		}; 
		//第3段事件编号
		$scope.eventNo3Arr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_specialPosiEvent3",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		}; 
		//点击下一步
		$scope.nextStepBtn = function() {
			var adom1I = document.getElementsByClassName('step2I');
			for (var i = 0; i < adom1I.length; i++) {
				adom1I[i].setAttribute('readonly', true);
			}
			var adom1S = document.getElementsByClassName('step2S');
			for (var i = 0; i < adom1S.length; i++) {
				adom1S[i].setAttribute('disabled', 'disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.nextStepDiv = -true; //下一步详情
			$scope.nextBtnBlock = false; //下一步按钮
			$scope.backBtn = true; //上一步按钮
			//确定反向事件第二段编号
			$scope.sureSecReverse();
		};
		//点击上一步
		$scope.backStepBtn = function() {
			var adom1I = document.getElementsByClassName('step2I');
			for (var i = 0; i < adom1I.length; i++) {
				adom1I[i].removeAttribute('readonly');
			}
			var adom1S = document.getElementsByClassName('step2S');
			for (var i = 0; i < adom1S.length; i++) {
				adom1S[i].removeAttribute('disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.nextStepDiv = -false; //下一步详情
			$scope.nextBtnBlock = true; //下一步按钮
			$scope.backBtn = false; //上一步按钮
			$scope.itemNext = {}; //下一步 反向事件清空
		};
		//反向事件第二段编号
		var form = layui.form;
		form.on('select(getEventNoF3)', function(data) {
			if (data.value == '01') {
				$scope.itemNext.eventNo3 = '11 手工类解除';
			} else if (data.value == '80') {
				$scope.itemNext.eventNo3 = '81 延滞自动解除';
			} else if (data.value == '86') {
				$scope.itemNext.eventNo3 = '87 核算自动解除';
			}
		});
		//确定反向事件信息 除了事件藐视和事件第三段信息， 其他都一样
		$scope.sureSecReverse = function() {
			console.log($scope.item);
			//反向事件编号item.effectivenessCodeType
			$scope.itemNext = {
				eventNo1: 'BSS',
				eventNo2: 'SP',
				eventType: 'NMNY',
				operatorId: sessionStorage.getItem("userName"),
				corporation: sessionStorage.getItem("corporation"), //法人实体ID
				adminFlagUser: sessionStorage.getItem("adminFlag"), //用户管理员标示
				//				ongoingProcessFlag: $scope.item.ongoingProcessFlag,//7*24小时标识
				effectivenessInf: $scope.item.effectivenessInf, //场景触发对象
				sceneTriggerObject: $scope.item.sceneTriggerObject, //场景触发对象
				list: [{
					activityNo: null,
					activityDesc: null,
					accountingUsrFlag: null
				}]
			};
			if ($scope.item.eventNo3 == '01') {
				$scope.itemNext.eventNo3 = '11 手工类解除';
			} else if ($scope.item.eventNo3 == '80') {
				$scope.itemNext.eventNo3 = '81 延滞自动解除';
			} else if ($scope.item.eventNo3 == '86') {
				$scope.itemNext.eventNo3 = '87 核算自动解除';
            }
            $scope.itemNext.eventNo4 = $scope.item.eventNo4;
		};
		//新增管控码
		$scope.addBlockCode = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/blockCode/blockCodeEst.html','', {
				title : T.T('YYJ700018'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '560px' ],
				callbacks : [$scope.saveBlockCode]
			});
		};
		//新增==========保存
		$scope.saveBlockCode = function(result){
			if(!result.scope.isInfo){
				jfLayer.fail(T.T("F00086"));
				 return;
			}
			 $scope.blockCodeInf = {};
			$scope.blockCodeInf = result.scope.blockCodeInf;
			$scope.effectivenessCodeSceneInt = parseInt($scope.blockCodeInf.effectivenessCodeScene); 
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S2ListResult = [];
			 $("#s14 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s13){
				 for(var w=0;w<$rootScope.s13.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s13[w].controlProjectNo == $scope.arr2[t]){
							//$scope.S2List = $rootScope.s13[w];
							$scope.S2List = {operationMode:$rootScope.s13[w].operationMode,effectivenessCodeType:$scope.blockCodeInf.effectivenessCodeType,effectivenessCodeScene:$scope.effectivenessCodeSceneInt,controlProjectNo:$rootScope.s13[w].controlProjectNo,projectType:0};
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			 if($scope.S2ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ700022"));
				 return;
			 }
			 	$scope.arr4 = [];
				$scope.S4List = {};
				 $("#s26 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr4.push(vall);
			    });
				 if($rootScope.s25){
					 for(var w=0;w<$rootScope.s25.length;w++){
						 for(var t=0;t<$scope.arr4.length;t++){
							if($rootScope.s25[w].pricingTag == $scope.arr4[t]){
								//$scope.S4List = $rootScope.s25[w];
								$scope.S4List = {operationMode:$rootScope.s25[w].operationMode,effectivenessCodeType:$scope.blockCodeInf.effectivenessCodeType,effectivenessCodeScene:$scope.effectivenessCodeSceneInt,controlProjectNo:$rootScope.s25[w].pricingTag,projectType:1};
								$scope.S2ListResult.push($scope.S4List);
							}
						 }
					 }
				 }
			$scope.blockCodeInf.operationMode = result.scope.operationMode;
			$scope.blockCodeInf.list = $scope.S2ListResult;
			$scope.blockCodeInf.effectivenessCodeScene = $scope.effectivenessCodeSceneInt;
			console.log($scope.blockCodeInf);
			jfRest.request('blockCode','save', $scope.blockCodeInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.blockCodeInf = {};
					result.scope.blockCodeInfForm.$setPristine();
					$scope.blockTpyeArray ={};
					$scope.queryBlockTpye();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//封锁码建立
	webApp.controller('blockCodeEstbCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
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
		$scope.blockCodeInf = {};
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
		//--------------------------------构件实例--------------start
		$scope.newCodeShow = true;
		$scope.isInfo = false;
		$scope.isInfoPrice = false;
		 //第一步
		 $scope.step1Btn = true;
		 $scope.step2Btn = false;
		 $scope.nextStep1 = function(){
			 $("#s13 option").remove();
			 $("#s14 option").remove();
			$scope.setparamss = {
					operationMode:$scope.operationMode
			};
			jfRest.request('controlProject', 'query', $scope.setparamss)
			.then(function(data) {
				console.log(data);
				if(data.returnData.totalCount == 0){
					jfLayer.fail(T.T("YYJ700023"));
					return;
				}
				$scope.isInfo = true;  //关联显示
				$scope.step2Btn = true;
				 $scope.step1Btn = false;
				 var adom1I = document.getElementsByClassName('step1I');
	  			for(var i=0;i<adom1I.length;i++){
	  				adom1I[i].setAttribute('readonly',true);
	  				adom1I[i].classList.add('bnone');
	  			}
	  			var adom1S = document.getElementsByClassName('step1S');
				for(var i=0;i<adom1S.length;i++){
					adom1S[i].setAttribute('disabled','disabled');
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
				var a =data.returnData.rows;
				$rootScope.s13 = {};
				$rootScope.s13 =data.returnData.rows;
				for(var i=0;i<a.length;i++){
					angular.element("#s13").append("<option value='"+a[i].controlProjectNo+"'>"+a[i].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].controlDesc+"</option>"); 
			   }
			});
		 };
		 /*----根据管控项目，和管控项目描述查询----*/
		 	$scope.queryControlProject = function(){
				 $("#s13").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					controlProjectNo: $scope.blockCodeInf.controlProjectNo,
					controlDesc: $scope.blockCodeInf.controlDesc
		 		};
				jfRest.request('controlProject', 'query', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s14 option").each(function () {
				        var vall = $(this).val();
				        $scope.arr02.push(vall);
				    });
					var n =$scope.arr02;
					if(n !=undefined && a !=null){
							//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i]==a[j].controlProjectNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s13").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
					    	}
                        }
                    }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s13").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end管控项目，和管控项目描述查询 ----*/
			//点击上一步  回到第一步
			$scope.stepBackOne = function(){
				$scope.isInfo = false;  //第二步内容
				$scope.step1Btn = true;    //第一步按钮   
				$scope.step2Btn = false;
				var adom1I = document.getElementsByClassName('step1I');
	  			for(var i=0;i<adom1I.length;i++){
	  				adom1I[i].removeAttribute('readonly');
	  				adom1I[i].classList.remove('bnone');
	  			}
	      		var adom1S = document.getElementsByClassName('step1S');
	  			for(var i=0;i<adom1S.length;i++){
	  				adom1S[i].removeAttribute('disabled');
	  			}
	  			$timeout(function() {
					Tansun.plugins.render('select');
				});
			};
			//第二步
			$scope.stepToThree = function(){
				 $("#s25 option").remove();
				 $("#s26 option").remove();
				$scope.paraPrice = {
						operationMode:$scope.operationMode
				};
				jfRest.request('priceLabel', 'query', $scope.paraPrice)
				.then(function(data) {
					console.log(data);
					if(data.returnData.totalCount == 0){
						jfLayer.fail(T.T("YYJ700024"));
						return;
					}
					$scope.isInfoPrice = true;  //定价标签内容
					$scope.step1Btn = false;
					$scope.step2Btn = false;
					var b =data.returnData.rows;
					$rootScope.s25 = {};
					$rootScope.s25 =data.returnData.rows;
					for(var i=0;i<b.length;i++){
						angular.element("#s25").append("<option value='"+b[i].pricingTag+"'>"+b[i].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+b[i].pricingDesc+"</option>"); 
				   }
				});
			};
			/*----根据定价标签，和定价标签描述查询----*/
		 	$scope.queryPricingtagList = function(){
				 $("#s25").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					pricingTag: $scope.proObjInstan.pricingTag,
					pricingDesc: $scope.proObjInstan.pricingDesc
		 		};
				jfRest.request('priceLabel', 'query', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s26 option").each(function () {
				        var vall = $(this).val();
				        $scope.arr02.push(vall);
				    });
					var n =$scope.arr02;
					if(n !=undefined && a !=null){
							//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i]==a[j].pricingTag){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s25").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
					    	}
                        }
                    }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s25").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end定价标签，和定价标签描述查询 ----*/
			$scope.stepBackTwo = function(){
				$scope.isInfoPrice = false;
				$scope.step2Btn = true;
				 $("#s25 option").remove();
				 $("#s26 option").remove();
			};
			//管控项目
		 $("#s13").dblclick(function(){  
			 var alloptions = $("#s13 option");  
			 var so = $("#s13 option:selected");  
			 $("#s14").append(so);  
		});  
		$("#s14").dblclick(function(){  
			 var alloptions = $("#s14 option");  
			 var so = $("#s14 option:selected");  
			 $("#s13").append(so);  
		});  
		$("#add").click(function(){  
			 var alloptions = $("#s13 option");  
			 var so = $("#s13 option:selected");  
			 $("#s14").append(so); 
		});  
		$("#remove").click(function(){  
			 var alloptions = $("#s14 option");  
			 var so = $("#s14 option:selected");  
			 $("#s13").append(so);
		});  
		$("#addall").click(function(){  
			$("#s14").append($("#s13 option").attr("selected",true));  
		});  
		$("#removeall").click(function(){  
			$("#s13").append($("#s14 option").attr("selected",true));  
		});  
		//定价标签
		$("#s25").dblclick(function(){  
			 var alloptions = $("#s25 option");  
			 var so = $("#s25 option:selected");  
			 $("#s26").append(so);  
		});  
		$("#s26").dblclick(function(){  
			 var alloptions = $("#s26 option");  
			 var so = $("#s26 option:selected");  
			 $("#s25").append(so);  
		});  
		$("#add25").click(function(){  
			 var alloptions = $("#s25 option");  
			 var so = $("#s25 option:selected");  
			 $("#s26").append(so); 
		});  
		$("#remove25").click(function(){  
			 var alloptions = $("#s26 option");  
			 var so = $("#s26 option:selected");  
			 $("#s25").append(so);
		});  
		$("#addall25").click(function(){  
			$("#s26").append($("#s25 option").attr("selected",true));  
		});  
		$("#removeall25").click(function(){  
			$("#s25").append($("#s26 option").attr("selected",true));  
		});  
		//--------------------------构件实例--------------end
	});
});
