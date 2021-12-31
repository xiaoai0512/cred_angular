'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('budgetUnitAddCtr', function($scope, $stateParams, jfRest,$window,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translate.refresh();
		$scope.userName = sessionStorage.getItem("userName"); //用户名
		$scope.menuName = lodinDataService.getObject("menuName");
        $scope.budgetUnitInf = {};
		//证件类型
		$scope.certificateTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_busiCardCertificateType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//客户类型
		$scope.customerTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_busiCardCustomerType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		// 地址类型
		$scope.typeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_busiCardAddressType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		// 账单日
		$scope.billDayArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_billDay",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//预算管理层级
		$scope.manageLevelArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_busiCardManageLevel",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		// 机构号查询
		$scope.institutionIdArr = {
			type: "dynamic",
			param: {}, // 默认查询条件
			text: "organName", // 下拉框显示内容，根据需要修改字段名称
			value: "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "coreOrgan.queryCoreOrgan", // 数据源调用的action
			callback: function(data) {
				//	console.log(data);
			}
		};
		//联动证件类型 . 证件类型为预算单位,客户类型同为预算单位
		var form = layui.form;
		form.on('select(getIdType)', function(event) {
			if (event.value == "7") { //
				$scope.budgetUnitInf.customerType = '3'
			}
		});
		$scope.addressObj = {};
		//保存预算单位信息
		$scope.saveBudgetUnitInfo = function() {
			$scope.addressList = [];
			//地址信息放入list中
			if($scope.budgetUnitInf.idNumber.length <6 || $scope.budgetUnitInf.idNumber.length >15){
				jfLayer.fail(T.T('GWJ100009'));
				return;
			}
			$scope.addressObj.type = $scope.addressInf.type;
			$scope.addressObj.contactAddress = $scope.addressInf.contactAddress;
			$scope.addressObj.contactPostCode = $scope.addressInf.contactPostCode;
			$scope.addressObj.contactMobilePhone = $scope.addressInf.contactMobilePhone;
			$scope.addressObj.city = $scope.addressInf.city;
			$scope.addressList.push($scope.addressObj);
			$scope.budgetUnitInf.coreCoreCustomerAddrs = $scope.addressList;
			jfRest.request('budgetUnit', 'save', $scope.budgetUnitInf).then(function(data) {
				if (data.returnCode == '000000') {
                    jfLayer.success(T.T('F00032'));
					$scope.budgetUnitInf = {};
					$scope.addressInf = {};
                    $window.location.reload();
				}
            });
        };
	});
});
