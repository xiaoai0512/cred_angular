'use strict';
define(function(require) {
	var webApp = require('app');
	// 记账规则子表（内部帐类）
	webApp.controller('accRuleSubInterAccountListCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
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
                if ($scope.eventList.search('COS.AD.02.0085') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.IQ.02.0080') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0090') != -1) { //修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0062') != -1) { //删除
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
		$scope.accRuleSubInterAccountList = {
			params: {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息   
			paging: true, // 默认true,是否分页
			resource: 'accountingMag.queryAccRuleSubInterAccount', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_drcrFlag','dic_currencyFlag'],//查找数据字典所需参数
			transDict : ['drcrFlag_drcrFlagDesc','currencyFlag_currencyFlagDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//借贷方向 D - 借记C - 贷记
		/* $scope.drcrFlagArray = [{
			name: T.T('YYH200017'),
			id: 'D'
		}, {
			name: T.T('YYH200018'),
			id: 'C'
		}] */
		//币种标识L - 本币  F - 外币	N- 不适用
		//借贷方向 D - 借记C - 贷记
		/* $scope.drcrFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_drcrFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				console.log(data)
			}
		};
		//币种标识L - 本币  F - 外币	N- 不适用
		$scope.currencyFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				console.log(data)
			}
		}; */
		// 新增
		$scope.accRuleSubInterAccountAdd = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/accRuleSubInterAccountEst.html', {}, {
				title: T.T('YYJ5400030'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1050px', '350px'],
				callbacks: [$scope.accRuleSubInterAccountSave]
			});
		};
		//保存
		$scope.accRuleSubInterAccountSave = function(result) {
			$scope.accRuleSubInterAccountInf = result.scope.accRuleSubInterAccountInf;
			jfRest.request('accountingMag', 'saveAccRuleSubInterAccount', $scope.accRuleSubInterAccountInf).then(function(
				data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accRuleSubInterAccountInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.accRuleSubInterAccountList.search();
				} 
			});
		};
		// 查看
		$scope.checkAccRuleSubInterInf = function(event) {
			$scope.accRuleSubInterAccountInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccRuleSubInterAccount.html',
				$scope.accRuleSubInterAccountInf, {
					title: T.T('YYJ5400031'),
					buttons: [T.T('F00012')],
					size: ['1050px', '350px'],
					callbacks: []
				});
		};
		// 修改
		$scope.updateAccRuleSubInterInf = function(event) {
			$scope.accRuleSubInterAccountInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateAccRuleSubInterAccount.html',
				$scope.accRuleSubInterAccountInf, {
					title: T.T('YYJ5400033'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1050px', '350px'],
					callbacks: [$scope.updateaccRuleSubInterAccount]
				});
		};
		// 回调函数/确认按钮事件
		$scope.updateaccRuleSubInterAccount = function(result) {
			$scope.accRuleSubInterAccount = result.scope.accRuleSubInterAccountInf;
			$scope.accRuleSubInterAccount.drcrFlag = result.scope.updrcrFlag;
			$scope.accRuleSubInterAccount.currencyFlag = result.scope.upcurrencyFlag;
			jfRest.request('accountingMag', 'updateAccRuleSubInterAccount', $scope.accRuleSubInterAccount).then(function(
				data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.accRuleSubInterAccountList.search();
				} 
			});
		};
		//删除
		$scope.deleteAccRuleSubInterInf = function(event) {
			$scope.accRuleSubInterInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ5400032"), function() { //确定
				jfRest.request('accountingMag', 'deleteAccRuleSubInterAccount', $scope.accRuleSubInterInf).then(function(
					data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.accRuleSubInterAccountList.search();
					} 
				});
			}, function() { //取消
			})
		};
	});
	//新增核算类型定义
	webApp.controller('accRuleSubInterAccountEstCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accRuleSubInterAccountInf = {};
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
			}
		};
		//核算状态  =====从库表获取
		$scope.accountingStatusArr ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
		    };
		//借贷方向 D - 借记C - 贷记
		$scope.drcrFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_drcrFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//币种标识L - 本币  F - 外币	N- 不适用
		$scope.currencyFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
	});
	//修改
	webApp.controller('updateAccRuleSubInterAccountCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,$timeout,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accRuleSubInterAccountInfo = {};
		$scope.accRuleSubInterAccountInfo = $scope.accRuleSubInterAccountInf;
		$scope.accRuleSubInterAccountInf = $scope.accRuleSubInterAccountInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.updateOperationMode = $scope.accRuleSubInterAccountInf.operationMode;
			}
		};
		//借贷方向 D - 借记C - 贷记
		$scope.drcrFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_drcrFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updrcrFlag = $scope.accRuleSubInterAccountInfo.drcrFlag;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//币种标识L - 本币  F - 外币	N- 不适用
		$scope.currencyFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.upcurrencyFlag = $scope.accRuleSubInterAccountInf.currencyFlag;
			}
		};
	});
	//查询
	webApp.controller('viewAccRuleSubInterAccountCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accRuleSubInterAccountInf = $scope.accRuleSubInterAccountInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.viewOperationMode = $scope.accRuleSubInterAccountInf.operationMode;
			}
		};
			//借贷方向 D - 借记C - 贷记
		$scope.drcrFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_drcrFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.vwdrcrFlag = $scope.accRuleSubInterAccountInf.drcrFlag;
			}
		};
		//币种标识L - 本币  F - 外币	N- 不适用
		$scope.currencyFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.vwcurrencyFlag = $scope.accRuleSubInterAccountInf.currencyFlag;
			}
		};
	});
});