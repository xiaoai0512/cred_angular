'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('businessStopCtr', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translate.refresh();
		$scope.userName = sessionStorage.getItem("userName"); //用户名
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.resultInfo = false;
		$scope.params = {};
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
					if ($scope.eventList.search('OCS.AD.01.0002') != -1) { //注销
						$scope.stBtnFlag = true;
					} else {
						$scope.stBtnFlag = false;
					}
				}
			}
		});
		//激活标识
		$scope.activationFlag =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_activationFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//激活方式
		$scope.activationModeType =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_activationMode",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//停用
		$scope.stopBusinessBtn = function() {
			$scope.stopParams = {
				externalIdentificationNo: $scope.detailInf.externalIdentificationNo,
				eventNo: "OCS.SP.01.3001",
			};
			jfRest.request('businessManage', 'busStop', $scope.stopParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('GWJ300002')); //'停用成功！');
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
					if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows.length == 0) {
						data.returnData.rows = [];
					}
				}
			}
		};
		//查询
		$scope.selectList = function() {
			if (($scope.params.idNumber == '' || $scope.params.idNumber == undefined || $scope.params.idNumber == null) &&
				($scope.params.externalIdentificationNo == '' || $scope.params.externalIdentificationNo == undefined || $scope
					.params.externalIdentificationNo == null)) {
				jfLayer.alert(T.T('F00076')); //'请输入查询条件！');
			} else {
				if ($scope.params.idNumber && ($scope.params.externalIdentificationNo == '' || $scope.params.externalIdentificationNo == undefined || $scope
                    .params.externalIdentificationNo == null)) { //只输预算单位编码，
					if (!$scope.params.externalIdentificationNo) {
						$scope.businessCardTable.params.idType = '7';
						$scope.businessCardTable.params.idNumber = $scope.params.idNumber;
						$scope.businessCardTable.search();
					}
                }
                if ($scope.params.externalIdentificationNo) { //只输入外部识别号
						jfRest.request('businessManage', 'queryCancelList', $scope.params).then(function(data) {
							if (data.returnCode == '000000') {
								console.log(data);
								$scope.resultInfo = false;
								$scope.detailDiv = true;
								$scope.detailInf = data.returnData.rows[0];
                            }
                        });
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
		//停用
		$scope.stopBusinessInf = function(item) {
			$scope.item = item;
			$scope.item.eventNo = 'OCS.SP.01.3001';
			$scope.item.levelCode = 'C'; //对选定外部识别号上封锁码，默认封锁码的管控层级为产品级
			jfLayer.confirm(T.T('GWJ300004'), function() { //yes
				jfRest.request('businessManage', 'busStop', $scope.item).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('GWJ300002')); //'停用成功！');
					}
				});
			}, function() { //no
			});
		};
	});
});
