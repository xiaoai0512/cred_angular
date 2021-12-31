'use strict';
define(function(require) {
	var webApp = require('app');
	// 记账规则子表（科目类）
	webApp.controller('accRuleSubSubjectListCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/cstSvc/accountHist/i18n_accRepyHistEnqr');
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
                if ($scope.eventList.search('COS.AD.02.0105') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.IQ.02.0120') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0105') != -1) { //修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0063') != -1) { //删除
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
		$scope.accRuleSubSubjectList = {
			params: {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'accountingMag.queryAccRuleSubSubject', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_assetSubTable'],//查找数据字典所需参数
			transDict : ['assetProperty_assetPropertyDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		// 新增
		$scope.accRuleSubSubjectAdd = function(event) {
			$scope.accRuleSubSubjectInf = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/accRuleSubSubjectEst.html', $scope.accRuleSubSubjectInf, {
				title: T.T('YYJ5400026'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1150px', '500px'],
				callbacks: [$scope.accRuleSubSubjectSave]
			});
		};
		//保存
		$scope.accRuleSubSubjectSave = function(result) {
			$scope.accRuleSubSubjectInf = {};
			$scope.accRuleSubSubjectInf = result.scope.accRuleSubSubjectInf;
			jfRest.request('accountingMag', 'saveAccRuleSubSubject', $scope.accRuleSubSubjectInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accRuleSubSubjectInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.accRuleSubSubjectList.search();
				} 
			});
		};
		// 查看
		$scope.checkAccRuleSubSubjecInf = function(event) {
			$scope.accRuleSubSubjectInf = {};
			$scope.accRuleSubSubjectInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccRuleSubSubjec.html',
				$scope.accRuleSubSubjectInf, {
					title: T.T('YYJ5400027'),
					buttons: [T.T('F00012')],
					size: ['1150px', '450px'],
					callbacks: []
				});
		};
		// 修改
		$scope.updateAccRuleSubSubjecInf = function(event) {
			$scope.accRuleSubSubjectInf = {};
			$scope.accRuleSubSubjectInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateAccRuleSubSubject.html',
				$scope.accRuleSubSubjectInf, {
					title: T.T('YYJ5400028'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1150px', '450px'],
					callbacks: [$scope.updateaccRuleSubSubject]
				});
		};
		// 回调函数/确认按钮事件
		$scope.updateaccRuleSubSubject = function(result) {
			$scope.accRuleSubSubject ={};
			$scope.accRuleSubSubject = result.scope.accRuleSubSubjectInf;
			$scope.accRuleSubSubjectInf.accountingStatus = result.scope.updateAccountingStatus;
			$scope.accRuleSubSubjectInf.balanceStatus = result.scope.updateBalanceStatus;
			$scope.accRuleSubSubjectInf.assetProperty = result.scope.upassetProperty;
			$scope.accRuleSubSubjectInf.bindAcctScene = result.scope.bindAcctSceneUpdate;
			$scope.accRuleSubSubjectInf.accountingRuleCode = result.scope.uaccountingRuleCode;
			$scope.accRuleSubSubjectInf.linkedRevenueRuleCode = result.scope.ulinkedRevenueRuleCode;
			$scope.accRuleSubSubjectInf.linkedTaxRuleCode = result.scope.ulinkedTaxRuleCode;
			$scope.accRuleSubSubjectInf.bindingLinkedRevenueRuleCode = result.scope.ubindingLinkedRevenueRuleCode;
			$scope.accRuleSubSubjectInf.bindingLinkedTaxRuleCode = result.scope.ubindingLinkedTaxRuleCode;
			$scope.accRuleSubSubjectInf.linkedRevenueSubCode = result.scope.ulinkedRevenueSubCode;
			$scope.accRuleSubSubjectInf.linkedTaxSubCode = result.scope.ulinkedTaxSubCode;
			$scope.accRuleSubSubjectInf.bindingLinkedRevenueSubCode = result.scope.ubindingLinkedRevenueSubCode;
			$scope.accRuleSubSubjectInf.bindingLinkedTaxSubCode = result.scope.ubindingLinkedTaxSubCode;
			jfRest.request('accountingMag', 'updateAccRuleSubSubject', $scope.accRuleSubSubject).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.accRuleSubSubjectList.search();
				}
			});
		};
		//删除
		$scope.deleteAccRuleSubSubjecInf = function(event) {
			$scope.accRuleSubSubjectInf = {};
			$scope.accRuleSubSubjectInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ5400029"), function() { //确定
				jfRest.request('accountingMag', 'deleteAccRuleSubSubject', $scope.accRuleSubSubjectInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.accRuleSubSubjectList.search();
					} 
				});
			}, function() { //取消
			})
		};
	});
	//新增核算类型定义
	webApp.controller('accRuleSubSubjectEstCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
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
		$scope.accountingRuleCodeArr = {};
		$scope.linkedArr = {};
		var form = layui.form;
		form.on('select(getOperationMode)', function(data) {
			if(data.value){
				$scope.accountingRuleCodeArr = {
					type: "dynamicDesc",
					param: {
						operationMode : data.value,
					}, //默认查询条件 
					text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
					desc: "accountingRuleDesc",
					value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
					callback: function(data) {
					}
				};
				$scope.linkedArr = {
					type: "dynamicDesc",
					param: {
						operationMode : data.value,
						//requestType : 'M',
						accountingObject : 'A'
					}, //默认查询条件 
					text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
					desc: "accountingRuleDesc",
					value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
					callback: function(data) {
					}
				};
			}else{
				$scope.accountingRuleCodeArr = {};
				$scope.linkedArr = {};
			}
		});
		$scope.isHave = true;
		//如果没有绑定核算场景，则“绑定核算场景联动的收入类记账规则码”和“绑定核算场景的税金记账规则码”不可输入。
		form.on('select(getAccountingRuleCode)', function(data) {
			if(data.value){
				$scope.queryParam = {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					requestType : 'M',
					accountingRuleCode : data.value,
				};
				jfRest.request('accountingMag', 'queryBindAccScene', $scope.queryParam)
				.then(function(data) {
					console.log(data);
					if(data.returnCode == '000000'){
						if(data.returnData.totalCount > 0){
							$scope.isHave = true;
						}else{
							$scope.isHave = false;
						}
					}
				});
			}
		});
		//选择主表后筛选子表
		$scope.linkedSub01Arr = {};
		form.on('select(getRule01)', function(data) {
			if(data.value){
				$scope.linkedSub01Arr = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : data.value
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						if(data.length > 0){
							$scope.accRuleSubSubjectInf.linkedRevenueSubCode = data[0].subTableSequence;
						}
					}
				};
			}else{
				$scope.linkedSub01Arr = {};
			}
		});
		$scope.linkedSub02Arr = {};
		form.on('select(getRule02)', function(data) {
			if(data.value){
				$scope.linkedSub02Arr = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : data.value
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						if(data.length > 0){
							$scope.accRuleSubSubjectInf.linkedTaxSubCode = data[0].subTableSequence;
						}
					}
				};
			}else{
				$scope.linkedSub02Arr = {};
			}
		});
		$scope.linkedSub03Arr = {};
		form.on('select(getRule03)', function(data) {
			if(data.value){
				$scope.linkedSub03Arr = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : data.value
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						if(data.length > 0){
							$scope.accRuleSubSubjectInf.bindingLinkedRevenueSubCode = data[0].subTableSequence;
						}
					}
				};
			}else{
				$scope.linkedSub03Arr = {};
			}
		});
		$scope.linkedSub04Arr = {};
		form.on('select(getRule04)', function(data) {
			if(data.value){
				$scope.linkedSub04Arr = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : data.value
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						if(data.length > 0){
							$scope.accRuleSubSubjectInf.bindingLinkedTaxSubCode = data[0].subTableSequence;
						}
					}
				};
			}else{
				$scope.linkedSub04Arr = {};
			}
		});
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
		//资产属性
		$scope.assetPropertyArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_assetSubTable",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//绑定核算场景
//		$scope.bindAcctSceneArr = {
//			type: "dictData",
//			param: {
//				"type": "DROPDOWNBOX",
//				groupsCode: "dic_matchYN",
//				queryFlag: "children"
//			}, //默认查询条件 
//			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
//			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
//			resource: "paramsManage.query", //数据源调用的action 
//			callback: function(data) {
//			}
//		};
		$scope.accRuleSubSubjectInf = $scope.accRuleSubSubjectInf;
	});
	//修改
	webApp.controller('updateAccRuleSubSubjectCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T, $timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accRuleSubSubjectInf = $scope.accRuleSubSubjectInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.updateOperationMode = $scope.accRuleSubSubjectInf.operationMode;
			}
		};
		//核算状态  =====从库表获取
		$scope.accountingStatusArrU ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateAccountingStatus = $scope.accRuleSubSubjectInf.accountingStatus;
		        }
		    };
		$scope.balanceStatusArrU ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
					$scope.updateBalanceStatus = $scope.accRuleSubSubjectInf.balanceStatus;
		        }
		    };
		//资产属性
		$scope.assetPropertyArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_assetSubTable",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.upassetProperty = $scope.accRuleSubSubjectInf.assetProperty;
			}
		};
		//绑定核算场景
//		$scope.bindAcctSceneArr = {
//			type: "dictData",
//			param: {
//				"type": "DROPDOWNBOX",
//				groupsCode: "dic_matchYN",
//				queryFlag: "children"
//			}, //默认查询条件 
//			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
//			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
//			resource: "paramsManage.query", //数据源调用的action 
//			callback: function(data) {
//				$scope.bindAcctSceneUpdate = $scope.accRuleSubSubjectInf.bindAcctScene;
//			}
//		};
		$scope.accountingRuleCodeArrU = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
				}, //默认查询条件 
				text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
				desc: "accountingRuleDesc",
				value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
				callback: function(data) {
					$scope.uaccountingRuleCode = $scope.accRuleSubSubjectInf.accountingRuleCode;
					$timeout(function() {
						Tansun.plugins.render('select');
					});
				}
			};
		$scope.linkedArr01u = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					accountingObject : 'A'
				}, //默认查询条件 
				text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
				desc: "accountingRuleDesc",
				value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
				callback: function(data) {
					$scope.ulinkedRevenueRuleCode = $scope.accRuleSubSubjectInf.linkedRevenueRuleCode;
				}
			};
			$scope.linkedArr02u = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingObject : 'A'
					}, //默认查询条件 
					text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
					desc: "accountingRuleDesc",
					value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
					callback: function(data) {
						$scope.ulinkedTaxRuleCode = $scope.accRuleSubSubjectInf.linkedTaxRuleCode;
					}
				};
			$scope.linkedArr03u = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingObject : 'A'
					}, //默认查询条件 
					text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
					desc: "accountingRuleDesc",
					value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
					callback: function(data) {
						$scope.ubindingLinkedRevenueRuleCode = $scope.accRuleSubSubjectInf.bindingLinkedRevenueRuleCode;
					}
				};
			$scope.linkedArr04u = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingObject : 'A'
					}, //默认查询条件 
					text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
					desc: "accountingRuleDesc",
					value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
					callback: function(data) {
						$scope.ubindingLinkedTaxRuleCode = $scope.accRuleSubSubjectInf.bindingLinkedTaxRuleCode;
					}
				};
			//子表下拉显示
			$scope.linkedSubArr01u = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : $scope.accRuleSubSubjectInf.linkedRevenueRuleCode
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						$scope.ulinkedRevenueSubCode = $scope.accRuleSubSubjectInf.linkedRevenueSubCode;
					}
				};
				$scope.linkedSubArr02u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : $scope.accRuleSubSubjectInf.linkedTaxRuleCode
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							$scope.ulinkedTaxSubCode = $scope.accRuleSubSubjectInf.linkedTaxSubCode;
						}
					};
				$scope.linkedSubArr03u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : $scope.accRuleSubSubjectInf.bindingLinkedRevenueRuleCode
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							$scope.ubindingLinkedRevenueSubCode = $scope.accRuleSubSubjectInf.bindingLinkedRevenueSubCode;
						}
					};
				$scope.linkedSubArr04u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : $scope.accRuleSubSubjectInf.bindingLinkedTaxRuleCode
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							$scope.ubindingLinkedTaxSubCode = $scope.accRuleSubSubjectInf.bindingLinkedTaxSubCode;
						}
					};
				
			$scope.isHaveU = true;
			if($scope.accRuleSubSubjectInf.operationMode && $scope.accRuleSubSubjectInf.accountingRuleCode){
				$scope.queryParam = {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						requestType : 'M',
						accountingRuleCode : $scope.accRuleSubSubjectInf.accountingRuleCode,
					};
					jfRest.request('accountingMag', 'queryBindAccScene', $scope.queryParam)
					.then(function(data) {
						if(data.returnCode == '000000'){
							if(data.returnData.totalCount > 0){
								$scope.isHaveU = true;
							}else{
								$scope.isHaveU = false;
							}
						}
					});
			}
			//选择主表后筛选子表
			var form = layui.form;
			form.on('select(getRule01u)', function(data) {
				if(data.value){
					$scope.linkedSubArr01u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : data.value
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							if(data.length > 0){
								$scope.ulinkedRevenueSubCode = data[0].subTableSequence;
							}
						}
					};
				}else{
					$scope.linkedSubArr01u = {};
				}
			});
			form.on('select(getRule02u)', function(data) {
				if(data.value){
					$scope.linkedSubArr02u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : data.value
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							if(data.length > 0){
								$scope.ulinkedTaxSubCode = data[0].subTableSequence;
							}
						}
					};
				}else{
					$scope.linkedSubArr02u = {};
				}
			});
			form.on('select(getRule03u)', function(data) {
				if(data.value){
					$scope.linkedSubArr03u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : data.value
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							if(data.length > 0){
								$scope.ubindingLinkedRevenueSubCode = data[0].subTableSequence;
							}
						}
					};
				}else{
					$scope.linkedSubArr03u = {};
				}
			});
			form.on('select(getRule04u)', function(data) {
				if(data.value){
					$scope.linkedSubArr04u = {
						type: "dynamicDesc",
						param: {
							operationMode : $scope.accRuleSubSubjectInf.operationMode,
							accountingRuleCode : data.value
						}, //默认查询条件 
						text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
						desc: "subDesc",
						value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
						resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
						callback: function(data) {
							if(data.length > 0){
								$scope.ubindingLinkedTaxSubCode = data[0].subTableSequence;
							}
						}
					};
				}else{
					$scope.linkedSubArr04u = {};
				}
			});
	});
	//查询
	webApp.controller('viewAccRuleSubSubjecCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T, $timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accRuleSubSubjectInf = $scope.accRuleSubSubjectInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.viewOperationMode = $scope.accRuleSubSubjectInf.operationMode;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		$scope.accountingRuleCodeArrI = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
				}, //默认查询条件 
				text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
				desc: "accountingRuleDesc",
				value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
				callback: function(data) {
					$scope.viewaccountingRuleCode = $scope.accRuleSubSubjectInf.accountingRuleCode;
					$timeout(function() {
						Tansun.plugins.render('select');
					});
				}
			};
		//核算状态  =====从库表获取
		$scope.accountingStatusArrI ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewAccountingStatus = $scope.accRuleSubSubjectInf.accountingStatus;
		        }
		    };
		$scope.balanceStatusArrI ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
					$scope.viewBalanceStatus = $scope.accRuleSubSubjectInf.balanceStatus
		        }
		    };
		//资产属性
		$scope.assetPropertyArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_assetSubTable",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.vwassetProperty = $scope.accRuleSubSubjectInf.assetProperty;
			}
		};
		//绑定核算场景
//		$scope.bindAcctSceneArr = {
//			type: "dictData",
//			param: {
//				"type": "DROPDOWNBOX",
//				groupsCode: "dic_matchYN",
//				queryFlag: "children"
//			}, //默认查询条件 
//			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
//			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
//			resource: "paramsManage.query", //数据源调用的action 
//			callback: function(data) {
//				$scope.bindAcctSceneInfo = $scope.accRuleSubSubjectInf.bindAcctScene;
//			}
//		};
		$scope.linkedArr01 = {
			type: "dynamicDesc",
			param: {
				operationMode : $scope.accRuleSubSubjectInf.operationMode,
				accountingObject : 'A'
			}, //默认查询条件 
			text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
			desc: "accountingRuleDesc",
			value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
			callback: function(data) {
				$scope.viewlinkedRevenueRuleCode = $scope.accRuleSubSubjectInf.linkedRevenueRuleCode;
			}
		};
		$scope.linkedArr02 = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					accountingObject : 'A'
				}, //默认查询条件 
				text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
				desc: "accountingRuleDesc",
				value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
				callback: function(data) {
					$scope.viewlinkedTaxRuleCode = $scope.accRuleSubSubjectInf.linkedTaxRuleCode;
				}
			};
		$scope.linkedArr03 = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					accountingObject : 'A'
				}, //默认查询条件 
				text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
				desc: "accountingRuleDesc",
				value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
				callback: function(data) {
					$scope.viewbindingLinkedRevenueRuleCode = $scope.accRuleSubSubjectInf.bindingLinkedRevenueRuleCode;
				}
			};
		$scope.linkedArr04 = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					accountingObject : 'A'
				}, //默认查询条件 
				text: "accountingRuleCode", //下拉框显示内容，根据需要修改字段名称 
				desc: "accountingRuleDesc",
				value: "accountingRuleCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleMaster", //数据源调用的action 
				callback: function(data) {
					$scope.viewbindingLinkedTaxRuleCode = $scope.accRuleSubSubjectInf.bindingLinkedTaxRuleCode;
				}
			};
		$scope.linkedSubArr01 = {
				type: "dynamicDesc",
				param: {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					accountingRuleCode : $scope.accRuleSubSubjectInf.linkedRevenueRuleCode,
				}, //默认查询条件 
				text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
				desc: "subDesc",
				value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
				callback: function(data) {
					$scope.viewlinkedRevenueSubCode = $scope.accRuleSubSubjectInf.linkedRevenueSubCode;
				}
			};
			$scope.linkedSubArr02 = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : $scope.accRuleSubSubjectInf.linkedTaxRuleCode,
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						$scope.viewlinkedTaxSubCode = $scope.accRuleSubSubjectInf.linkedTaxSubCode;
					}
				};
			$scope.linkedSubArr03 = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : $scope.accRuleSubSubjectInf.bindingLinkedRevenueRuleCode,
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						$scope.viewbindingLinkedRevenueSubCode = $scope.accRuleSubSubjectInf.bindingLinkedRevenueSubCode;
					}
				};
			$scope.linkedSubArr04 = {
					type: "dynamicDesc",
					param: {
						operationMode : $scope.accRuleSubSubjectInf.operationMode,
						accountingRuleCode : $scope.accRuleSubSubjectInf.bindingLinkedTaxRuleCode,
					}, //默认查询条件 
					text: "subTableSequence", //下拉框显示内容，根据需要修改字段名称 
					desc: "subDesc",
					value: "subTableSequence", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "accountingMag.queryAccRuleSubSubject", //数据源调用的action 
					callback: function(data) {
						$scope.viewbindingLinkedTaxSubCode = $scope.accRuleSubSubjectInf.bindingLinkedTaxSubCode;
					}
				};
		$scope.isHaveI = true;
		if($scope.accRuleSubSubjectInf.operationMode && $scope.accRuleSubSubjectInf.accountingRuleCode){
			$scope.queryParam = {
					operationMode : $scope.accRuleSubSubjectInf.operationMode,
					requestType : 'M',
					accountingRuleCode : $scope.accRuleSubSubjectInf.accountingRuleCode,
				};
				jfRest.request('accountingMag', 'queryBindAccScene', $scope.queryParam)
				.then(function(data) {
					if(data.returnCode == '000000'){
						if(data.returnData.totalCount > 0){
							$scope.isHaveI = true;
						}else{
							$scope.isHaveI = false;
						}
					}
				});
		}
	});
});
