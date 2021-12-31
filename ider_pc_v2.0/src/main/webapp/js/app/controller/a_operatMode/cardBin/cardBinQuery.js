'use strict';
define(function(require) {
	var webApp = require('app');
	//卡bin查询及维护
	webApp.controller('cardBinMaintCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
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
				if ($scope.eventList.search('COS.IQ.02.0011') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.AD.02.0011') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0011') != -1) { //修改
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
				if(data.returnData && data.returnData.rows && data.returnData.rows.length>0){
					$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				}else {
					jfLayer.fail(T.T('F00161'));
                }
            }
		});
		$scope.resetChose = function() {
			if ($scope.adminFlag != "1" && $scope.adminFlag != "2") {
				$scope.cardBinTable.params = {
					"corporationEntityNo": $scope.corporationEntityNo
				};
			} else {
				$scope.cardBinTable.params = {};
			}
		};
		$scope.cardBinTable = {
			params: {
				autoQuery: false,
				"corporationEntityNo": $scope.corporationEntityNo,
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
		//卡类型
		$scope.cardTypeArrary  ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
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
		$scope.addCardBinTable = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/cardBin/cardBinEst.html', '', {
				title: T.T('PZJ1000008'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['900px', '320px'],
				callbacks: [$scope.saveAddCardBin]
			});
		};
		//新增回调函数
		$scope.saveAddCardBin = function(result) {
			$scope.cardBin = {};
			$scope.cardBin = result.scope.cardBin;
			if ($scope.cardBin.binNo.length != 6) {
				jfLayer.fail(T.T('PZJ1000006'));
				return;
			}
			jfRest.request('cardBin', 'save', $scope.cardBin).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.cardBin = {};
					$scope.cardBinTable.search();
					result.scope.cardBinForm.$setPristine();
					$scope.safeApply();
					result.cancel();
				} 
			});
		};
		//复制
		$scope.copyCardBin = function(event) {
			$scope.copyCardBinParams = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/cardBin/copyCardBin.html', $scope.copyCardBinParams, {
				title: T.T('PZJ1000010'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['900px', '320px'],
				callbacks: [$scope.saveCopyCardBin]
			});
		};
		//复制回调函数
		$scope.saveCopyCardBin = function(result) {
			$scope.cardBinParams = {};
			$scope.cardBinParams = result.scope.copyCardBinParams;
			$scope.cardBinParams.cardScheme = result.scope.copyecardScheme;
			$scope.cardBinParams.cardTyp = result.scope.copyecardTyp;
			$scope.cardBinParams.settlementCurrency = result.scope.copyesettlementCurrency;
			if (String($scope.cardBinParams.binNo).length != 6) {
				jfLayer.fail(T.T('PZJ1000006'));
				return;
			}
			jfRest.request('cardBin', 'save', $scope.cardBinParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.cardBinParams = {};
					$scope.cardBinTable.search();
					result.scope.cardBinForm.$setPristine();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//修改
		$scope.updateCardBin = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/cardBin/updateCardBin.html', $scope.items, {
				title: T.T('PZJ1000009'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['850px', '380px'],
				callbacks: [$scope.saveCardBinInf]
			});
		};
		//保存
		$scope.saveCardBinInf = function(result) {
			$scope.items.settlementCurrency = result.scope.updateSettlementCurrency;
			$scope.items.cardTyp = result.scope.updatecardTyp;
			$scope.items.cardScheme = result.scope.updatecardScheme;
			jfRest.request('cardBin', 'update', $scope.items) //Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						$scope.safeApply();
						result.cancel();
						$scope.cardBinTable.search();
					} 
				});
		}
	});
	webApp.controller('updateCardBinCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		//卡组织
		$scope.cardSchemeArrary ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardScheme",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updatecardScheme = $scope.items.cardScheme;
			}
		};
		//卡类型
		$scope.cardTypeArrary  ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			rmData:['2','3'],
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updatecardTyp = $scope.items.cardTyp;
			}
		};
		//币种
		$scope.currencyArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "currencyCode", //下拉框显示内容，根据需要修改字段名称 
			value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "currency.query", //数据源调用的action 
			callback: function(data) {
				$scope.updateSettlementCurrency = $scope.items.settlementCurrency;
			}
		};
	});
	//新增
	//货币建立
	webApp.controller('cardBinEstCtrl', function($scope, $stateParams, jfRest,
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
		$scope.queryParam = {
			organNo: $scope.organization
		};
		jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			//			if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
			//				$scope.cardBin.corporationEntityNo = $scope.corporationEntityNo;
			//				$("#corporationEntityNo").attr("disabled",true);
			//			}
		});
		//卡组织
		$scope.cardSchemeArrary ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardScheme",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//卡类型
		$scope.cardTypeArrary  ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			rmData:['2','3'],
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//币种
		$scope.currencyArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "currencyCode", //下拉框显示内容，根据需要修改字段名称 
			value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "currency.query", //数据源调用的action 
			callback: function(data) {
				console.log(data);
			}
		};
		//用户查询
		$scope.itemList = {
			params: $scope.queryParam = {
				authDataSynFlag: "1",
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'userManage.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				console.log(data);
			}
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
			$scope.cardBin.corporationEntityNo = $scope.checkedEvent.corporationEntityNo;
			$scope.safeApply();
			result.cancel();
		};
		$scope.cardBin = {};
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
	//复制
	//货币建立
	webApp.controller('cardBinEstCtrlCopy', function($scope, $stateParams, jfRest,
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
		$scope.queryParam = {
			organNo: $scope.organization
		};
		jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			//			if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
			//				$scope.cardBin.corporationEntityNo = $scope.corporationEntityNo;
			//				$("#corporationEntityNo").attr("disabled",true);
			//			}
		});
		//卡组织
		$scope.cardSchemeArrary ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardScheme",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.copyecardScheme = $scope.copyCardBinParams.cardScheme;
			}
		};
		//卡类型
		$scope.cardTypeArrary  ={
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_cardType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			rmData:['2','3'],
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.copyecardTyp = $scope.copyCardBinParams.cardTyp;
			}
		};
		//币种
		$scope.currencyArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "currencyCode", //下拉框显示内容，根据需要修改字段名称 
			value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "currency.query", //数据源调用的action 
			callback: function(data) {
				$scope.copyesettlementCurrency = $scope.copyCardBinParams.settlementCurrency;
			}
		};
		//用户查询
		$scope.itemList = {
			params: $scope.queryParam = {
				authDataSynFlag: "1",
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'userManage.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
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
			$scope.copyCardBinParams.corporationEntityNo = $scope.checkedEvent.corporationEntityNo;
			$scope.safeApply();
			result.cancel();
		};
		$scope.cardBinParams = {};
	});
});
