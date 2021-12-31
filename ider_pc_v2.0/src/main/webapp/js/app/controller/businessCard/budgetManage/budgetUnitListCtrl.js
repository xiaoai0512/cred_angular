'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('budgetUnitListCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translate.refresh();
		$scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfo = false;
		$scope.topParams = {};
		$scope.topParams1 = {};
		$scope.topParams2 = {};
		
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
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
			//	console.log(data);
			}
		};
		//重置
		$scope.reset = function(){
			$scope.topParams1.idNumber = '';
			$scope.topParams2.externalIdentificationNo = '';
			$scope.resultInfo = false;
		};
		//查询
		$scope.selectList = function(){
			if($scope.topParams1.idNumber){
				if($scope.topParams2.externalIdentificationNo == '' ||$scope.topParams2.externalIdentificationNo == undefined || 
						$scope.topParams2.externalIdentificationNo == null || $scope.topParams2.externalIdentificationNo == 'null'	
				){
					$scope.topParams1.idType = '7';//预算单位类型
					$scope.weiHuBudgetUnit($scope.topParams1);
				}else {
					jfLayer.alert(T.T('GWJ100008'));  //'查询条件，输入一个即可！');
                }
            }else if($scope.topParams2.externalIdentificationNo){
				if($scope.topParams1.idNumber == '' ||$scope.topParams1.idNumber == undefined || 
						$scope.topParams1.idNumber == null || $scope.topParams1.idNumber == 'null'){
					$scope.weiHuBudgetUnit($scope.topParams2);
				}else {
					jfLayer.alert(T.T('GWJ100008'));  //'查询条件，输入一个即可！');
				}
			}else {
				jfLayer.alert(T.T('GWJ100008'));  //'查询条件，输入一个即可！');
            }
        };
		//查询预算单位
		$scope.weiHuBudgetUnit = function(params){
			jfRest.request('budgetUnit', 'query', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.budgetUnitInf = data.returnData.rows[0];
					$scope.addressInf = data.returnData.rows[0].coreCoreCustomerAddrs[0];
					$scope.resultInfo = true;
				} 
			});
		};
		$scope.addressList = [];
		$scope.addressObj = {};
		//保存预算单位信息
		$scope.saveBudgetUnitInfo = function() {
			//地址信息放入list中
			$scope.addressObj.type = $scope.addressInf.type;
			$scope.addressObj.contactAddress = $scope.addressInf.contactAddress;
			$scope.addressObj.contactPostCode = $scope.addressInf.contactPostCode;
			$scope.addressObj.contactMobilePhone = $scope.addressInf.contactMobilePhone;
			$scope.addressObj.city = $scope.addressInf.city;
			$scope.addressList.push($scope.addressObj);
			$scope.budgetUnitInf.coreCoreCustomerAddrs = $scope.addressList;
			jfRest.request('budgetUnit', 'update', $scope.budgetUnitInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.resultInfo = false;
				}
			});
		};
		//返回
		$scope.goback = function(){
			$scope.resultInfo = false;
		};
	});
});
