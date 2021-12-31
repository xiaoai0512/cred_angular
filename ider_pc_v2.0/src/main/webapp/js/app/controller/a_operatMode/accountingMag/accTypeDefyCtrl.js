'use strict';
define(function(require) {
	var webApp = require('app');
	// 核算类型定义
	webApp.controller('accTypeDefyCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		//$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
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
				if ($scope.eventList.search('COS.AD.02.0060') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.IQ.02.0066') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0053') != -1) { //修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0060') != -1) { //删除
					$scope.delBtnFlag = true;
				} else {
					$scope.delBtnFlag = false;
				}
			}
		});
		//映射维度 MODP（产品对象）MODT（业务类型）
		// $scope.instanDimenArr = [{name : T.T('YYJ5400007') ,id : 'MODP'},{name : T.T('YYJ5400008'),id : 'MODT'}] ;
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
		$scope.accTypeDefyList = {
			params: {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'accountingMag.queryAccTypeDefy', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		// 新增
		$scope.accTypeDefyAdd = function(event) {
			$scope.accTypeDefyInf = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/accTypeDefyEst.html', $scope.accTypeDefyInf, {
				title: T.T('YYJ5400001'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1050px', '350px'],
				callbacks: [$scope.accTypeDefySave]
			});
		};
		//保存
		$scope.accTypeDefySave = function(result) {
			$scope.accTypeDefyInf = result.scope.accTypeDefyInf;
			jfRest.request('accountingMag', 'saveAccTypeDefy', $scope.accTypeDefyInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accTypeDefyInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.accTypeDefyList.search();
				}
			});
		};
		// 查看
		$scope.checkAccTypeDefyInf = function(event) {
			$scope.accTypeDefyInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccTypeDefy.html',
				$scope.accTypeDefyInf, {
					title: T.T('YYJ5400002'),
					buttons: [T.T('F00012')],
					size: ['1050px', '350px'],
					callbacks: []
				});
		};
		// 修改
		$scope.updateAccTypeDefyInf = function(event) {
			$scope.accTypeDefyInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateAccTypeDefy.html',
				$scope.accTypeDefyInf, {
					title: T.T('YYJ5400003'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1050px', '350px'],
					callbacks: [$scope.updateAccTypeDefy]
				});
		};
		// 回调函数/确认按钮事件
		$scope.updateAccTypeDefy = function(result) {
			$scope.accTypeDefy = result.scope.accTypeDefyInfo;
			$scope.accTypeDefy.operationMode = result.scope.updateOperationMode;
			jfRest.request('accountingMag', 'updateAccTypeDefy', $scope.accTypeDefy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.accTypeDefyList.search();
				} 
			});
		};
		//删除
		$scope.deleteAccTypeDefyInf = function(event) {
			$scope.accTypeDefyInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ5400004"), function() { //确定
				jfRest.request('accountingMag', 'deleteAccTypeDefy', $scope.accTypeDefyInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.accTypeDefyList.search();
					}
				});
			}, function() { //取消
			})
		};
	});
	//新增核算类型定义
	webApp.controller('accTypeDefyEstCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer,
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
		//映射维度
		$scope.instanDimenArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mapDimension",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.count = 0;
		//新增映射维度
		$scope.instanDimenAdd = function() {
			if ($scope.count == 0) {
				$scope.isShowInstan1 = true;
				$scope.isShowInstan2 = false;
				$scope.isShowInstan3 = false;
				$scope.isShowInstan4 = false;
				$scope.isShowInstan5 = false;
				$scope.count++;
			} else if ($scope.count == 1) {
				$scope.isShowInstan1 = true;
				$scope.isShowInstan2 = true;
				$scope.isShowInstan3 = false;
				$scope.isShowInstan4 = false;
				$scope.isShowInstan5 = false;
				$scope.count++;
			} else if ($scope.count == 2) {
				$scope.isShowInstan1 = true;
				$scope.isShowInstan2 = true;
				$scope.isShowInstan3 = true;
				$scope.isShowInstan4 = false;
				$scope.isShowInstan5 = false;
				$scope.count++;
			} else if ($scope.count == 3) {
				$scope.isShowInstan1 = true;
				$scope.isShowInstan2 = true;
				$scope.isShowInstan3 = true;
				$scope.isShowInstan4 = true;
				$scope.isShowInstan5 = false;
				$scope.count++;
			} else if ($scope.count == 4) {
				$scope.isShowInstan1 = true;
				$scope.isShowInstan2 = true;
				$scope.isShowInstan3 = true;
				$scope.isShowInstan4 = true;
				$scope.isShowInstan5 = true;
				$scope.count++;
			} else if ($scope.count == 5) {
				jfLayer.alert(T.T('YYJ5400005'));
            }
        };
		//新增维度跟已增加的维度如果一样，则提示报错
		var form = layui.form;
		form.on('select(getInstanDimen2)', function(data) {
			if (data.value == $scope.accTypeDefyInf.instanDimen1) {
				jfLayer.alert(T.T('YYJ5400006'));
				$scope.accTypeDefyInf.instanDimen2 = '';
				return;
            }
        });
		form.on('select(getInstanDimen3)', function(data) {
			if (data.value == $scope.accTypeDefyInf.instanDimen1 || data.value == $scope.accTypeDefyInf.instanDimen2) {
				jfLayer.alert(T.T('YYJ5400006'));
				$scope.accTypeDefyInf.instanDimen3 = '';

			}
		});
		form.on('select(getInstanDimen4)', function(data) {
			if (data.value == $scope.accTypeDefyInf.instanDimen1 || data.value == $scope.accTypeDefyInf.instanDimen2 ||
				data.value == $scope.accTypeDefyInf.instanDimen3) {
				jfLayer.alert(T.T('YYJ5400006'));
				$scope.accTypeDefyInf.instanDimen4 = '';

			}
		});
		form.on('select(getInstanDimen5)', function(data) {
			if (data.value == $scope.accTypeDefyInf.instanDimen1 || data.value == $scope.accTypeDefyInf.instanDimen2 ||
				data.value == $scope.accTypeDefyInf.instanDimen3 || data.value == $scope.accTypeDefyInf.instanDimen4) {
				jfLayer.alert(T.T('YYJ5400006'));
				$scope.accTypeDefyInf.instanDimen5 = '';

			}
		});
	});
	//修改
	webApp.controller('updateAccTypeDefyCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accTypeDefyInfo = {};
		$scope.accTypeDefyInfo.accountingType = $scope.accTypeDefyInf.accountingType;
		$scope.accTypeDefyInfo.accountingDesc = $scope.accTypeDefyInf.accountingDesc;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "operationMode", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.updateOperationMode = $scope.accTypeDefyInf.operationMode;
			}
		};
		//映射维度 MODP（产品对象）MODT（业务类型）
		// $scope.instanDimenArr = [{name : T.T('YYJ5400007') ,id : 'MODP'},{name : T.T('YYJ5400008'),id : 'MODT'}] ;
		$scope.instanDimenArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mapDimension",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.accTypeDefyInfo.instanDimen1 = $scope.accTypeDefyInf.instanDimen1;
				$scope.accTypeDefyInfo.instanDimen2 = $scope.accTypeDefyInf.instanDimen2;
				$scope.accTypeDefyInfo.instanDimen3 = $scope.accTypeDefyInf.instanDimen3;
				$scope.accTypeDefyInfo.instanDimen4 = $scope.accTypeDefyInf.instanDimen4;
				$scope.accTypeDefyInfo.instanDimen5 = $scope.accTypeDefyInf.instanDimen5;
			}
		};
		if ($scope.accTypeDefyInf.instanDimen1) {
			$scope.isShowInstan1 = true;
		} else {
			$scope.isShowInstan1 = false;
        }
        if ($scope.accTypeDefyInf.instanDimen2) {
			$scope.isShowInstan2 = true;
		} else {
			$scope.isShowInstan2 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen3) {
			$scope.isShowInstan3 = true;
		} else {
			$scope.isShowInstan3 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen4) {
			$scope.isShowInstan4 = true;
		} else {
			$scope.isShowInstan4 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen5) {
			$scope.isShowInstan5 = true;
		} else {
			$scope.isShowInstan5 = false;
        }
        $scope.count = 0;
		//新增映射维度
		$scope.instanDimenAdd = function() {
			for (var key in $scope.accTypeDefyInf) {
				if ($scope.accTypeDefyInf[key] != null && $scope.accTypeDefyInf[key] != undefined && $scope.accTypeDefyInf[key] !=
					'null') {
					if (key.search("instanDimen") != -1) {
						$scope.count++;
                    }
                }
			}
			if ($scope.count >= 5) {
				jfLayer.alert(T.T('YYJ5400005'));
			} else {
				if ($scope.count == 0) {
					$scope.isShowInstan1 = true;
					$scope.isShowInstan2 = false;
					$scope.isShowInstan3 = false;
					$scope.isShowInstan4 = false;
					$scope.isShowInstan5 = false;
				} else if ($scope.count == 1) {
					$scope.isShowInstan1 = true;
					$scope.isShowInstan2 = true;
					$scope.isShowInstan3 = false;
					$scope.isShowInstan4 = false;
					$scope.isShowInstan5 = false;
				} else if ($scope.count == 2) {
					$scope.isShowInstan1 = true;
					$scope.isShowInstan2 = true;
					$scope.isShowInstan3 = true;
					$scope.isShowInstan4 = false;
					$scope.isShowInstan5 = false;
				} else if ($scope.count == 3) {
					$scope.isShowInstan1 = true;
					$scope.isShowInstan2 = true;
					$scope.isShowInstan3 = true;
					$scope.isShowInstan4 = true;
					$scope.isShowInstan5 = false;
				} else if ($scope.count == 4) {
					$scope.isShowInstan1 = true;
					$scope.isShowInstan2 = true;
					$scope.isShowInstan3 = true;
					$scope.isShowInstan4 = true;
					$scope.isShowInstan5 = true;
				}
			}
		};
	});
	//详情
	webApp.controller('viewAccTypeDefyCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "operationMode", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				//$scope.updateOperationMode = $scope.optModeInf2.operationMode;
				$scope.viewOperationMode = $scope.accTypeDefyInf.operationMode;
			}
		};
		$scope.accTypeDefyInfo = {};
		$scope.accTypeDefyInfo.accountingType = $scope.accTypeDefyInf.accountingType;
		$scope.accTypeDefyInfo.accountingDesc = $scope.accTypeDefyInf.accountingDesc;
		//映射维度 MODP（产品对象）MODT（业务类型）
		// $scope.instanDimenArr = [{name : T.T('YYJ5400007') ,id : 'MODP'},{name : T.T('YYJ5400008'),id : 'MODT'}] ;
		$scope.instanDimenArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mapDimension",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.accTypeDefyInfo.instanDimen1 = $scope.accTypeDefyInf.instanDimen1;
				$scope.accTypeDefyInfo.instanDimen2 = $scope.accTypeDefyInf.instanDimen2;
				$scope.accTypeDefyInfo.instanDimen3 = $scope.accTypeDefyInf.instanDimen3;
				$scope.accTypeDefyInfo.instanDimen4 = $scope.accTypeDefyInf.instanDimen4;
				$scope.accTypeDefyInfo.instanDimen5 = $scope.accTypeDefyInf.instanDimen5;
			}
		};
		if ($scope.accTypeDefyInf.instanDimen1 != null && $scope.accTypeDefyInf.instanDimen1 != undefined &&
			$scope.accTypeDefyInf.instanDimen1 != 'null' && $scope.accTypeDefyInf.instanDimen1 != '') {
			$scope.isShowInstan1 = true;
		} else {
			$scope.isShowInstan1 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen2 != null && $scope.accTypeDefyInf.instanDimen2 != undefined &&
			$scope.accTypeDefyInf.instanDimen2 != 'null' && $scope.accTypeDefyInf.instanDimen2 != '') {
			$scope.isShowInstan2 = true;
		} else {
			$scope.isShowInstan2 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen3 != null && $scope.accTypeDefyInf.instanDimen3 != undefined &&
			$scope.accTypeDefyInf.instanDimen3 != 'null' && $scope.accTypeDefyInf.instanDimen3 != '') {
			$scope.isShowInstan3 = true;
		} else {
			$scope.isShowInstan3 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen4 != null && $scope.accTypeDefyInf.instanDimen4 != undefined &&
			$scope.accTypeDefyInf.instanDimen4 != 'null' && $scope.accTypeDefyInf.instanDimen4 != '') {
			$scope.isShowInstan4 = true;
		} else {
			$scope.isShowInstan4 = false;
		}
		if ($scope.accTypeDefyInf.instanDimen5 != null && $scope.accTypeDefyInf.instanDimen5 != undefined &&
			$scope.accTypeDefyInf.instanDimen5 != 'null' && $scope.accTypeDefyInf.instanDimen5 != '') {
			$scope.isShowInstan5 = true;
		} else {
			$scope.isShowInstan5 = false;
		}
	})
});
