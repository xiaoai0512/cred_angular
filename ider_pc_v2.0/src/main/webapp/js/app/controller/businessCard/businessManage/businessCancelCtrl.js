'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('businessCancelCtr', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mdmActvt');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translate.refresh();
		$scope.userName = sessionStorage.getItem("userName"); //用户名
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfo = false;
		$scope.params = {};
		$scope.detailInf = {};
		$scope.cancelBtnFlag = false;
		$scope.menuNo = lodinDataService.getObject("menuNo");
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
					if ($scope.eventList.search('OCS.OP.01.0002') != -1) { //注销
						$scope.cancelBtnFlag = true;
					} else {
						$scope.cancelBtnFlag = false;
					}
				}
			}
		});
		//激活标识
		$scope.activationFlag = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_activationFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {}
		};
		//激活方式
		$scope.activationModeType = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_activationMode",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {}
		};
		//查询
		$scope.selectList = function() {
            if (($scope.params.externalIdentificationNo == '' || $scope.params.externalIdentificationNo == undefined || $scope.params.externalIdentificationNo ==
                null) && ($scope.params.idNumber == '' || $scope.params.idNumber == undefined || $scope.params.idNumber == null)) {
                jfLayer.fail(T.T('F00076')); //'请输入查询条件进行查询！');
                $scope.resultInfoTrans = false;
                $scope.cardListDiv = false;
            }else {
                if ($scope.params.externalIdentificationNo) {
                    jfRest.request('businessManage', 'queryCancelList', $scope.params).then(function (data) {
                        if (data.returnCode == '000000') {
                            console.log(data);
                            $scope.resultInfo = false;
                            $scope.detailDiv = true;
                            $scope.detailInf = data.returnData.rows[0];
                        }
                    });
                } else if ($scope.params.idNumber && ($scope.params.externalIdentificationNo == '' || $scope.params.externalIdentificationNo == undefined || $scope
                    .params.externalIdentificationNo == null)) { //只输预算单位编码，
                    $scope.businessCardTable.params.idType = '7';
                    $scope.businessCardTable.params.idNumber = $scope.params.idNumber;
                    $scope.businessCardTable.search();
                }
            }
        };
		$scope.reset = function() {
			$scope.resultInfo = false;
			$scope.detailDiv = false;
			$scope.params.idNumber = '';
			$scope.params.idType = '';
			$scope.params.externalIdentificationNo = '';
		};
		//注销
		$scope.cancelBusinessBtn = function() {
			$scope.cancelParams = {
				externalIdentificationNo: $scope.detailInf.externalIdentificationNo,
				mediaUnitCode: $scope.detailInf.mediaUnitCode
			};
			jfRest.request('businessManage', 'busCancel', $scope.cancelParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00071'));
				}
			});
		};
		//公务卡信息列表
		$scope.businessCardTable = {
			autoQuery: false,
			checkType: 'radio',
			params: {
				"pageSize": 10,
				"indexNo": 0,
				idNumber: $scope.params.idNumber,
				externalIdentificationNo: $scope.params.externalIdentificationNo
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'businessManage.busUnitList', // 列表的资源
			isTrans: true,
			transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
			transDict: ['idType_idTypeDesc','invalidFlag_invalidFlagDesc'],
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					$scope.resultInfo = true;
					$scope.detailDiv = false;
					if (!data.returnData.rows || data.returnData.rows.length == 0) {
						data.returnData.rows = [];
					}
				} else {

					$scope.resultInfo = false;
					$scope.detailDiv = false;
				}
			}
		};
		//注销
		$scope.cancelBusinessInf = function(item) {
			jfLayer.confirm(T.T('GWJ300001'), function() { //yes
				$scope.cancelParams = {
					externalIdentificationNo: item.externalIdentificationNo,
					mediaUnitCode: item.mediaUnitCode
				};
				jfRest.request('businessManage', 'busCancel', $scope.cancelParams).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00071'));
					}
				});
			}, function() { //no
			});
		};
	});
	//公务卡详情
	webApp.controller('layerViewBusinessCard1Ctr', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		//客户媒介列表
		$scope.cstMdmInfTable = {
			checkType: 'radio',
			params: {
				"pageSize": 10,
				"indexNo": 0,
				externalIdentificationNo: $scope.item.externalIdentificationNo
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'mediaCancel.queryInf', // 列表的资源
			isTrans: true,
			transParams: ['dic_documentTypeTable','dic_invalidFlagYN','dic_invalidReason'],
			transDict: ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		jfRest.request('cstInfQuery', 'queryInf', $scope.item.externalIdentificationNo).then(function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData != null) {
					$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
					$scope.customerInfo.mainCustomerCode = data.returnData.rows[0].customerNo;
					$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
					$scope.customerInfo.customerNo = data.returnData.rows[0].customerNo;
					$scope.cstMdmInfTable.params.idNumber = $scope.mdmActvtInfo.idNumber;
					$scope.cstMdmInfTable.params.idType = $scope.mdmActvtInfo.idType;
					$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.mdmActvtInfo.externalIdentificationNo;
					$scope.cstMdmInfTable.params.flag = "2";
					$scope.cstMdmInfTable.search();
					$scope.isShowCstDiv = true;
				} else {
					jfLayer.alert(T.T('KHJ400002')); //"抱歉，不存在此客户！"
					$scope.isShowCstDiv = false;
				}
			}
		});
	});
});
