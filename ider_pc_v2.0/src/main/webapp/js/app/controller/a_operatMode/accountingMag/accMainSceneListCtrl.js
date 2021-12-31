'use strict';
define(function(require) {
	var webApp = require('app');
	// 核算主场景表
	webApp.controller('accMainSceneListCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
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
			menuNo: $scope.menuNoSel
		};
		jfRest.request('accessManage', 'selEvent', $scope.paramsNo).then(function(data) {
			if (data.returnData != null || data.returnData != "") {
				for (var i = 0; i < data.returnData.length; i++) {
					$scope.eventList += data.returnData[i].eventNo + ",";
                }
                if ($scope.eventList.search('COS.AD.02.0066') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.IQ.02.0063') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0055') != -1) { //修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0064') != -1) { //删除
					$scope.delBtnFlag = true;
				} else {
					$scope.delBtnFlag = false;
				}
			}
		});
		//运营模式
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {}
		};
		//运营模式列表
		$scope.accMainSceneList = {
			params: {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'accountingMag.queryAccMainScene', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		// 新增
		$scope.accMainSceneAdd = function(event) {
			$scope.accMainSceneInf = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/accMainSceneEst.html', $scope.accMainSceneInf, {
				title: T.T('YYJ5400036'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1050px', '350px'],
				callbacks: [$scope.accMainSceneSave]
			});
		};
		//保存
		$scope.accMainSceneSave = function(result) {
			$scope.accMainSceneInf = result.scope.accMainSceneInf;
			//判断是否有相同的记账规则代码
			var arr = [];
			if ($scope.accMainSceneInf.accountingRuleCode1) {
				arr[0] = $scope.accMainSceneInf.accountingRuleCode1;
            }
            if ($scope.accMainSceneInf.accountingRuleCode2) {
				arr[1] = $scope.accMainSceneInf.accountingRuleCode2;
            }
            if ($scope.accMainSceneInf.accountingRuleCode3) {
				arr[2] = $scope.accMainSceneInf.accountingRuleCode3;
            }
            if ($scope.accMainSceneInf.accountingRuleCode4) {
				arr[3] = $scope.accMainSceneInf.accountingRuleCode4;
            }
            if ($scope.accMainSceneInf.accountingRuleCode5) {
				arr[4] = $scope.accMainSceneInf.accountingRuleCode5;
            }
            for (var i = 0; i < arr.length; i++) {
				if (arr[i] == arr[i + 1]) {
					jfLayer.alert(T.T('YYJ5400040'));
					return;
				}
            }
            jfRest.request('accountingMag', 'saveAccMainScene', $scope.accMainSceneInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accMainSceneInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.accMainSceneList.search();
				}
			});
		};
		// 查看
		$scope.checkAccMainSceneInf = function(event) {
			$scope.accMainSceneInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccMainScene.html',
				$scope.accMainSceneInf, {
					title: T.T('YYJ5400037'),
					buttons: [T.T('F00012')],
					size: ['1100px', '350px'],
					callbacks: []
				});
		};
		// 修改
		$scope.updateAccMainSceneInf = function(event) {
			$scope.accMainSceneInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateAccMainScene.html',
				$scope.accMainSceneInf, {
					title: T.T('YYJ5400041'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1050px', '350px'],
					callbacks: [$scope.updateaccMainScene]
				});
		};
		// 回调函数/确认按钮事件
		$scope.updateaccMainScene = function(result) {
			$scope.accMainScene = result.scope.accMainSceneInf;
			$scope.accMainScene.redAccountingFlag = result.scope.updateredAccountingFlag;
			$scope.accMainScene.accountingRuleCode1 = result.scope.updateAccountingRuleCode1;
			$scope.accMainScene.accountingRuleCode2 = result.scope.updateAccountingRuleCode2;
			$scope.accMainScene.accountingRuleCode3 = result.scope.updateAccountingRuleCode3;
			$scope.accMainScene.accountingRuleCode4 = result.scope.updateAccountingRuleCode4;
			$scope.accMainScene.accountingRuleCode5 = result.scope.updateAccountingRuleCode5;
			jfRest.request('accountingMag', 'updateAccMainScene', $scope.accMainScene).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.accMainSceneList.search();
				} 
			});
		};
		//删除
		$scope.deleteAccMainSceneInf = function(event) {
			$scope.accMainSceneyInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ5400042"), function() { //确定
				jfRest.request('accountingMag', 'deleteAccMainScene', $scope.accMainSceneyInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.accMainSceneList.search();
					}
				});
			}, function() { //取消
			})
		};
	});
	//新增核算类型定义
	webApp.controller('accMainSceneEstCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
			}
		};
		//记账规则代码
		$scope.accountingRuleCodeArray = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {}
		};
		//红字记账法标识 	R-红字 N-蓝字',
		$scope.redAccountingFlagArray ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_redAccountingFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//核算子场景
		$scope.subTableSequenceArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "subTableSequenceDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccSubScene", //数据源调用的action 
			callback: function(data) {}
		};
		$scope.accMainSceneInf = $scope.accMainSceneInf;
		$scope.count = 0;
		//新增记账规则代码
		$scope.acctRuleCodeAdd = function() {
			if ($scope.count == 0) {
				$scope.isShowRule1 = true;
				$scope.isShowRule2 = false;
				$scope.isShowRule3 = false;
				$scope.isShowRule4 = false;
				$scope.isShowRule5 = false;
				$scope.count++;
			} else if ($scope.count == 1) {
				$scope.isShowRule1 = true;
				$scope.isShowRule2 = true;
				$scope.isShowRule3 = false;
				$scope.isShowRule4 = false;
				$scope.isShowRule5 = false;
				$scope.count++;
			} else if ($scope.count == 2) {
				$scope.isShowRule1 = true;
				$scope.isShowRule2 = true;
				$scope.isShowRule3 = true;
				$scope.isShowRule4 = false;
				$scope.isShowRule5 = false;
				$scope.count++;
			} else if ($scope.count == 3) {
				$scope.isShowRule1 = true;
				$scope.isShowRule2 = true;
				$scope.isShowRule3 = true;
				$scope.isShowRule4 = true;
				$scope.isShowRule5 = false;
				$scope.count++;
			} else if ($scope.count == 4) {
				$scope.isShowRule1 = true;
				$scope.isShowRule2 = true;
				$scope.isShowRule3 = true;
				$scope.isShowRule4 = true;
				$scope.isShowRule5 = true;
				$scope.count++;
			} else if ($scope.count == 5) {
				jfLayer.alert(T.T('YYJ5400043'));
            }
        };
		$scope.choseBtn = function() {
			//弹框查询列表
			$scope.params = {
				"pageSize": 10,
				"indexNo": 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/choseEvent_accMag.html', $scope.params, {
				title: T.T('YYJ400027'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1000px', '400px'],
				callbacks: [$scope.choseEvent]
			});
		};
		$scope.choseEvent = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.accMainSceneInf.masterSceneSequence = $scope.checkedEvent.eventNo;
			$scope.accMainSceneInf.masterSceneDesc = $scope.checkedEvent.eventDesc;
			$scope.safeApply();
			result.cancel();
		};
	});
	//修改
	webApp.controller('updateAccMainSceneCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accMainSceneInf = $scope.accMainSceneInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "operationMode", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.updateOperationMode = $scope.accMainSceneInf.operationMode;
			}
		};
		//红字记账法标识 	R-红字 N-蓝字',
		$scope.redAccountingFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_redAccountingFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updateredAccountingFlag = $scope.accMainSceneInf.redAccountingFlag;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//记账规则代码
		$scope.accountingRuleCodeArray1 = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.updateAccountingRuleCode1 = $scope.accMainSceneInf.accountingRuleCode1;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		$scope.accountingRuleCodeArray2 = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.updateAccountingRuleCode2 = $scope.accMainSceneInf.accountingRuleCode2;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		$scope.accountingRuleCodeArray3 = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.updateAccountingRuleCode3 = $scope.accMainSceneInf.accountingRuleCode3;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		$scope.accountingRuleCodeArray4 = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.updateAccountingRuleCode4 = $scope.accMainSceneInf.accountingRuleCode4;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		$scope.accountingRuleCodeArray5 = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.updateAccountingRuleCode5 = $scope.accMainSceneInf.accountingRuleCode5;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		$scope.choseBtn = function() {
			//弹框查询列表
			$scope.params = {
				"pageSize": 10,
				"indexNo": 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/choseEvent_accMagup.html', $scope.params, {
				title: T.T('YYJ400027'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1000px', '400px'],
				callbacks: [$scope.choseEvent]
			});
		};
		$scope.choseEvent = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.accMainSceneInf.masterSceneSequence = $scope.checkedEvent.eventNo;
			$scope.accMainSceneInf.masterSceneDesc = $scope.checkedEvent.eventDesc;
			$scope.safeApply();
			result.cancel();
		};
		if ($scope.accMainSceneInf.accountingRuleCode1) {
			$scope.isShowRule1 = true;
		} else {
			$scope.isShowRule1 = false;
        }
        if ($scope.accMainSceneInf.accountingRuleCode2) {
			$scope.isShowRule2 = true;
		} else {
			$scope.isShowRule2 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode3) {
			$scope.isShowRule3 = true;
		} else {
			$scope.isShowRule3 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode4) {
			$scope.isShowRule4 = true;
		} else {
			$scope.isShowRule4 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode5) {
			$scope.isShowRule5 = true;
		} else {
			$scope.isShowRule5 = false;
        }
        $scope.count = 0;
		//新增记账规则代码
		$scope.acctRuleCodeAdd = function() {
			for (var key in $scope.accMainSceneInf) {
				if ($scope.accMainSceneInf[key] != null && $scope.accMainSceneInf[key] != undefined && $scope.accMainSceneInf[
						key] != 'null') {
					if (key.search("accountingRuleCode") != -1) {
						$scope.count++;
                    }
                }
			}
			if ($scope.count >= 5) {
				jfLayer.alert(T.T("YYJ5400005"));
			} else {
				if ($scope.count == 0) {
					$scope.isShowRule1 = true;
					$scope.isShowRule2 = false;
					$scope.isShowRule3 = false;
					$scope.isShowRule4 = false;
					$scope.isShowRule5 = false;
				} else if ($scope.count == 1) {
					$scope.isShowRule1 = true;
					$scope.isShowRule2 = true;
					$scope.isShowRule3 = false;
					$scope.isShowRule4 = false;
					$scope.isShowRule5 = false;
				} else if ($scope.count == 2) {
					$scope.isShowRule1 = true;
					$scope.isShowRule2 = true;
					$scope.isShowRule3 = true;
					$scope.isShowRule4 = false;
					$scope.isShowRule5 = false;
				} else if ($scope.count == 3) {
					$scope.isShowRule1 = true;
					$scope.isShowRule2 = true;
					$scope.isShowRule3 = true;
					$scope.isShowRule4 = true;
					$scope.isShowRule5 = false;
				} else if ($scope.count == 4) {
					$scope.isShowRule1 = true;
					$scope.isShowRule2 = true;
					$scope.isShowRule3 = true;
					$scope.isShowRule4 = true;
					$scope.isShowRule5 = true;
				}
			}
		};
	});
	//事件
	webApp.controller('choseEvent_accMagCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		// 事件清单列表
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.itemList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: $scope.queryParam = {
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'evLstList.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					if (data.returnData != null || data.returnData != undefined || data.returnData != 'null') {
						if (data.returnData.rows != null || data.returnData.rows != undefined || data.returnData.rows != 'null') {
							/*$scope.rowsList =[];
							angular.forEach(data.returnData.rows,function(item,index){
								if(item.eventNo.search('ISS') > -1){
									data.returnData.rows.splice(1,index);
								}else {
									$scope.rowsList.push(item);
								}
							});
							data.returnData.rows = $scope.rowsList;*/
						} else {
							data.returnData.rows = [];
						}
                    }
                }
			}
		};
	});
	//修改中 选择事件
	webApp.controller('choseEvent_accMagUpCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		// 事件清单列表
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.itemList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: $scope.queryParam = {
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'evLstList.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					if (data.returnData != null || data.returnData != undefined || data.returnData != 'null') {
						if (data.returnData.rows != null || data.returnData.rows != undefined || data.returnData.rows != 'null') {
							/*$scope.rowsList =[];
							angular.forEach(data.returnData.rows,function(item,index){
								if(item.eventNo.search('ISS') > -1){
									data.returnData.rows.splice(1,index);
								}else {
									$scope.rowsList.push(item);
								}
							});
							data.returnData.rows = $scope.rowsList;*/
						} else {
							data.returnData.rows = [];
						}
                    }
                }
			}
		};
	});
	//查询
	webApp.controller('viewAccMainSceneCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accMainSceneInf = $scope.accMainSceneInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "operationMode", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.viewOperationMode = $scope.accMainSceneInf.operationMode;
			}
		};
		//红字记账法标识 	R-红字 N-蓝字',
		$scope.redAccountingFlagArray ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_redAccountingFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.viewredAccountingFlag = $scope.accMainSceneInf.redAccountingFlag;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//记账规则代码
		$scope.accountingRuleCodeArray = {
			type: "dynamicDesc",
			param: {}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			desc: 'accountingRuleDesc',
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.viewAccountingRuleCode1 = $scope.accMainSceneInf.accountingRuleCode1;
				$scope.viewAccountingRuleCode2 = $scope.accMainSceneInf.accountingRuleCode2;
				$scope.viewAccountingRuleCode3 = $scope.accMainSceneInf.accountingRuleCode3;
				$scope.viewAccountingRuleCode4 = $scope.accMainSceneInf.accountingRuleCode4;
				$scope.viewAccountingRuleCode5 = $scope.accMainSceneInf.accountingRuleCode5;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		if ($scope.accMainSceneInf.accountingRuleCode1 != null && $scope.accMainSceneInf.accountingRuleCode1 != undefined &&
			$scope.accMainSceneInf.accountingRuleCode1 != 'null' && $scope.accMainSceneInf.accountingRuleCode1 != '') {
			$scope.isShowRule1 = true;
		} else {
			$scope.isShowRule1 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode2 != null && $scope.accMainSceneInf.accountingRuleCode2 != undefined &&
			$scope.accMainSceneInf.accountingRuleCode2 != 'null' && $scope.accMainSceneInf.accountingRuleCode2 != '') {
			$scope.isShowRule2 = true;
		} else {
			$scope.isShowRule2 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode3 != null && $scope.accMainSceneInf.accountingRuleCode3 != undefined &&
			$scope.accMainSceneInf.accountingRuleCode3 != 'null' && $scope.accMainSceneInf.accountingRuleCode3 != '') {
			$scope.isShowRule3 = true;
		} else {
			$scope.isShowRule3 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode4 != null && $scope.accMainSceneInf.accountingRuleCode4 != undefined &&
			$scope.accMainSceneInf.accountingRuleCode4 != 'null' && $scope.accMainSceneInf.accountingRuleCode4 != '') {
			$scope.isShowRule4 = true;
		} else {
			$scope.isShowRule4 = false;
		}
		if ($scope.accMainSceneInf.accountingRuleCode5 != null && $scope.accMainSceneInf.accountingRuleCode5 != undefined &&
			$scope.accMainSceneInf.accountingRuleCode5 != 'null' && $scope.accMainSceneInf.accountingRuleCode5 != '') {
			$scope.isShowRule5 = true;
		} else {
			$scope.isShowRule5 = false;
		}
	});
});