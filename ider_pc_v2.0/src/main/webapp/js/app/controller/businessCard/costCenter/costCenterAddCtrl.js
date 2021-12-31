'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('costCenterAddCtr', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/costCenter/i18n_costCenter');
		$scope.userName = sessionStorage.getItem("userName"); //用户名
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.costCenterInf = {};
        $scope.costCenterInf.statusCode = "1";
        $scope.costCenterInf.idType = "1";
        $scope.costCenterInf.personalDutyFlag = "Y";
        $scope.costCenterInf.corporationDutyFlg = "Y";
        $scope.costCenterInf.statementFlag = "Y";
        $scope.costCenterInf.corporationVipFlag = "Y";
        $translate.refresh();
        //公司证件类型
        $scope.certificateTypeArray = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_compaIdType",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //公司种类
        $scope.TypeOfCompany = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_corporationCategory",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        // 公司状态
        $scope.companyStatus = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_status",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //是否
        $scope.yesOrNo = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_isYorN",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //行业
        $scope.ndustryList = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_industry",
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
        $scope.itemList = {
            autoQuery: false,
            params: {
                pageSize: 10,
                indexNo: 0,
            }, // 表格查询时的参数信息
            paging: true, // 默认true,是否分页
            resource: 'costCenter.queryOne', // 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_status','dic_isYorN','dic_isYorN'],//查找数据字典所需参数
            transDict : ['statusCode_statusCodeDesc','statementFlag_statementFlagDesc','corporationVipFlag_corporationVipFlagDesc'],//翻译前后key
            callback: function(data) { // 表格查询后的回调函数
                if (data.returnCode == "000000") {
                    if(data.returnData == null){
                        $scope.costCenterInf.socialCreditCode = $scope.itemList.params.socialCreditCode;
                        $scope.showAddItem = true;
                    }else {
                        jfLayer.alert(T.T('GWJ101008'));
                        $scope.showAddItem = false;
                    }
                }
            }
        };
        //重置
        $scope.reset = function(){
            $scope.itemList.params.socialCreditCode = '';
            $scope.showAddItem = false;
        };
		//保存成本中心
		$scope.savecostCenterInfo = function() {
		    jfRest.request('costCenter', 'save', $scope.costCenterInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.costCenterInf = {};
                    $scope.addressInf = {};
                    $scope.showAddItem = false;
                }
			});
		};
        //新增
        $scope.insert = function() {
            if($scope.itemList.params.socialCreditCode == '' ||$scope.itemList.params.socialCreditCode == undefined ||
                $scope.itemList.params.socialCreditCode == null || $scope.itemList.params.socialCreditCode == 'null'
            ){
                jfLayer.alert(T.T('GWJ101009'));
                $scope.showAddItem = false;
            }else {
                $scope.itemList.search();
                //$scope.showAddItem = true;
                //$scope.costCenterInf.socialCreditCode = itemList.params.socialCreditCode;
            }
        };
	});
});
