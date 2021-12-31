'use strict';
define(function(require) {
	var webApp = require('app');
	//卡号池请求
	webApp.controller('cardNoPoolAskListCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardNoPoolAsk/i18n_cardNumPoolReq');
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
			if (data.returnData != null || data.returnData != "") {
				for (var i = 0; i < data.returnData.length; i++) {
					$scope.eventList += data.returnData[i].eventNo + ",";
				}
				if ($scope.eventList.search('COS.IQ.02.0121') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.AD.02.0106') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0106') != -1) { //修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
			}
		});
		$scope.userName = sessionStorage.getItem("userName"); //获取登陆人员
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		$scope.organization = $scope.userInfo.organization; //获取组织机构
		$scope.queryParam = {
			organNo: $scope.organization
		};
		jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData && data.returnData.rows && data.returnData.rows.length > 0) {
					$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				} else {
					jfLayer.fail(T.T('F00161'));
                }
            }
		});
		$scope.resetChose = function() {
			if ($scope.adminFlag != "1" && $scope.adminFlag != "2") {
				$scope.cardNumPoolReqList.params = {
					"corporationEntityNo": $scope.corporationEntityNo
				};
			} else {
				$scope.cardNumPoolReqList.params = {};
			}
		};
		$scope.cardNumPoolReqList = {
			params: {
				autoQuery: false,
				"corporationEntityNo": $scope.corporationEntityNo,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'cardNoPoolAskList.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_automaticGenerateFlag','dic_enableFlag'],//查找数据字典所需参数
			transDict : ['automaticGenerateFlag_automaticGenerateFlagDesc','enableIdentification_enableIdentificationDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//卡bin列表
		$scope.currencyArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "currencyCode", //下拉框显示内容，根据需要修改字段名称 
			value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "currency.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//新增 
		$scope.addCardNumPoolReq = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/cardNoPoolAsk/addCardNumPoolReq.html', '', {
				title: T.T('YYJ1700001'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['900px', '400px'],
				callbacks: [$scope.saveAddCardNumPoolReq]
			});
		};
		//新增回调函数
		$scope.saveAddCardNumPoolReq = function(result) {
			$scope.addCardNumPoolReq = {};
			$scope.addCardNumPoolReq = result.scope.addCardNumPoolReq;
			jfRest.request('cardNoPoolAskList', 'save', $scope.addCardNumPoolReq).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.addCardNumPoolReq = {};
					$scope.cardNumPoolReqList.search();
					result.scope.addCardNumPoolReqForm.$setPristine();
					$scope.safeApply();
					result.cancel();
				} 
			});
		};
		//查询
		$scope.viewCardNumPoolReq = function(event) {
			$scope.viewCardNumPoolReqInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/cardNoPoolAsk/viewCardNumPoolReq.html', $scope.viewCardNumPoolReqInf, {
				title: T.T('YYJ1700002'),
				buttons: [T.T('F00012')],
				size: ['900px', '400px'],
				callbacks: []
			});
		};
		//修改
		$scope.updateCardNumPoolReq = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.upCardNumPoolReqInf = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/cardNoPoolAsk/updateCardNumPoolReq.html', $scope.upCardNumPoolReqInf, {
				title: T.T('YYJ1700003'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['900px', '400px'],
				callbacks: [$scope.saveUpdateCardNumPoolReq]
			});
		};
		//保存
		$scope.saveUpdateCardNumPoolReq = function(result) {
			$scope.upCardNumPoolReqItem = result.scope.upCardNumPoolReq;
			$scope.upCardNumPoolReqItem.automaticGenerateFlag = result.scope.upautomaticGenerateFlag;
			$scope.upCardNumPoolReqItem.enableIdentification = result.scope.upenableIdentification;
			jfRest.request('cardNoPoolAskList', 'update', $scope.upCardNumPoolReqItem) //Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						$scope.safeApply();
						result.cancel();
						$scope.cardNumPoolReqList.search();
					}
				});
		}
	});
	//新增 卡号池请求
	webApp.controller('addCardNumPoolReqCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.addCardNumPoolReq = {};
		$scope.queryParam = {
			organNo: $scope.organization
		};
		jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
		});
		//自动生成标识
		$scope.automaticGenerateFlagArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_automaticGenerateFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {}
		};
		//是否启用标识
		$scope.enableIdentificationArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_enableFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {}
		};
		$scope.chosecorporation = function() {
			//弹框查询列表
			$scope.params = {
				"pageSize": 10,
				"indexNo": 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/cardBin/chosecorporation.html', $scope.params, {
				title: T.T('PZJ1000005'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1000px', '400px'],
				callbacks: [$scope.chosecorpEntityNo]
			});
		};
		$scope.chosecorpEntityNo = function(result) {
			if (!result.scope.legalEntityList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.legalEntityList.checkedList();
			$scope.addCardNumPoolReq.corporationEntityNo = $scope.checkedEvent.corporationEntityNo;
			$scope.safeApply();
			result.cancel();
		};
		//选择卡bin
		$scope.choseCardBin = function() {
			//弹框查询列表
			$scope.params = {
				"pageSize": 10,
				"indexNo": 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/cardBin/choseCardBin.html', $scope.params, {
				title: T.T('PZJ1000005'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1000px', '400px'],
				callbacks: [$scope.savechoseCardBin]
			});
		};
		$scope.savechoseCardBin = function(result) {
			if (!result.scope.cardBinTable.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.cardBinTable.checkedList();
			$scope.addCardNumPoolReq.binNo = $scope.checkedEvent.binNo;
			$scope.safeApply();
			result.cancel();
		};
		//日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#date_prevDate',
				//min:"2019-03-01",
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
					$scope.addCardNumPoolReq.prevDate = $("#date_prevDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#date_nextDate',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.addCardNumPoolReq.nextDate = $("#date_nextDate").val();
				}
			});
		});
		//日期控件end
	});
	//选择法人实体
	webApp.controller('legalEntityCardBinCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		// 事件清单列表
		$scope.legalEntityList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: $scope.queryParam = {
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'legalEntity.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
	});
	//选择卡bin 
	webApp.controller('choseCardBinCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location, $translate, $translatePartialLoader, T) {
			$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
			$translate.use($scope.lang);
			$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
			$translate.refresh();
			// kabin
			$scope.cardBinTable = {
				checkType: 'radio', // 当为checkbox时为多选
				params: $scope.queryParam = {
					"pageSize": 10,
					"indexNo": 0
				}, // 表格查询时的参数信息
				paging: true, // 默认true,是否分页
				resource: 'cardBin.query', // 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_cardScheme','dic_cardType'],//查找数据字典所需参数
				transDict : ['cardScheme_cardSchemeDesc','cardTyp_cardTypDesc'],//翻译前后key
				callback: function(data) { // 表格查询后的回调函数
				}
			};
	});
	//查询 卡号池请求
	webApp.controller('viewCardNumPoolReqCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.viewCardNumPoolReq = $scope.viewCardNumPoolReqInf;
		$scope.queryParam = {
			organNo: $scope.organization
		};
		jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
		});
		//自动生成标识
		$scope.automaticGenerateFlagArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_automaticGenerateFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {}
		};
		//是否启用标识
		$scope.enableIdentificationArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_enableFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {}
		};
	});
	// 修改 卡号池请求
	webApp.controller('updateCardNumPoolReqCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.upCardNumPoolReq = $scope.upCardNumPoolReqInf;
		//自动生成标识
		$scope.automaticGenerateFlagArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_automaticGenerateFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.upautomaticGenerateFlag = $scope.upCardNumPoolReqInf.automaticGenerateFlag;
			}
		};
		//是否启用标识
		$scope.enableIdentificationArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_enableFlag",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.upenableIdentification = $scope.upCardNumPoolReqInf.enableIdentification;
			}
		};
		//日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#update_prevDate',
				//					min: $scope.upCardNumPoolReq.prevDate,
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
				elem: '#update_nextDate',
				min: $scope.upCardNumPoolReq.prevDate,
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.upCardNumPoolReq.nextDate = $("#update_nextDate").val();
				}
			});
		});
		//日期控件end
	});
});
