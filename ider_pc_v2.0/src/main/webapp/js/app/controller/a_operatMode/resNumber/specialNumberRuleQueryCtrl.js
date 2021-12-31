'use strict';
define(function(require) {
	var webApp = require('app');
	//特殊号码规则建立
	webApp.controller('specialNumberListsCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.menuNo = lodinDataService.getObject("menuNo");$scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 
		 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
				jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
					if(data.returnData != null || data.returnData != ""){
						for(var i=0;i<data.returnData.length;i++){
		   					$scope.eventList += data.returnData[i].eventNo + ",";
		   				}
	  	   			if($scope.eventList.search('COS.AD.02.0039') != -1){    //新增
	  					$scope.addBtnFlag = true;
	  				}
	  				else{
	  					$scope.addBtnFlag = false;
	  				}
		   	   		if($scope.eventList.search('COS.IQ.02.0045') != -1){    //查询
	  					$scope.selBtnFlag = true;
	  				}
	  				else{
	  					$scope.selBtnFlag = false;
	  				}
			   	   	if($scope.eventList.search('COS.UP.02.0042') != -1){    //修改
	  					$scope.updBtnFlag = true;
	  				}
	  				else{
	  					$scope.updBtnFlag = false;
	  				}
					}
				});
		
		$scope.specNoRuleObj = {};
		$scope.ruleList = [];
		//查询法人实体
		$scope.queryCorEntityNo = function() {
			$scope.queryParam = {
				organNo: $scope.organization
			};
			jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if ($scope.adminFlag != "1" && $scope.adminFlag != "2") {
					$scope.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporationEntityNo").attr("disabled", true);
				}
			});
		};
		$scope.queryCorEntityNo();
		//特殊号码方式
		$scope.numberTypeArry = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_numberType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc:"detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//卡bin
		$scope.cardBinArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "binNo", //下拉框显示内容，根据需要修改字段名称 
			value: "binNo", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "productLine.queryBin", //数据源调用的action 
			callback: function(data) {}
		};
		//根据选择卡BIN的条件筛选特殊号码段
		$scope.segmentNumberArr = {};
		var form = layui.form;
		form.on('select(getCardBin)', function(data) {
			//特殊号码段下拉
			$scope.segmentNumberArr = {
				type: "dynamic",
				param: {
					cardBin: data.value
				}, //默认查询条件 
				text: "segmentNumber", //下拉框显示内容，根据需要修改字段名称 
				value: "segmentNumber", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "resSpecialNoRule.query", //数据源调用的action 
				callback: function(data) {
					$scope.specNoListTable.params.segmentNumber = "";
				}
			};
		});
		//查询已有预留号规则表
		$scope.specNoListTable = {
			params: {
				"corporationEntityNo": $scope.corporationEntityNo,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			autoQuery: true,
			paging: true, // 默认true,是否分页
			resource: 'resSpecialNoRule.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.resetChose = function() {
			$scope.specNoListTable.params.cardBin = "";
			$scope.specNoListTable.params.segmentNumber = "";
			$scope.specNoListTable.params.numberType = "";
		};
		//查询号码详情
		$scope.selectInfo = function(event) {
			$scope.itemInfo = {};
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			jfRest.request('resSpecialNoRule', 'queryInfo', $scope.itemInfo).then(function(data) {
				if (data.returnMsg == 'OK') {
					console.log(data.returnData);
					$scope.itemInfo.ruleItemList = data.returnData.rows;
					$scope.modal('/a_operatMode/resNumber/specialNumInfo.html', $scope.itemInfo, {
						title: T.T('YYJ5300023'),
						buttons: [T.T('F00012')],
						size: ['950px', '500px'],
						callbacks: []
					});
				}
			});
		};
		//新增
		$scope.addSpecNoListTable = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/resNumber/specialNumberRuleEst.html', '', {
				title: T.T('YYJ5300001'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1050px', '520px'],
				callbacks: [$scope.saveSpecNoListTable]
			});
		};
		//前端保存新增预留号规则
		//保存规则
		$scope.saveSpecNoListTable = function(result) {
			$scope.resSpecialNoRulePrams = {};
			$scope.resSpecialNoRulePrams.rules = result.scope.ruleList;
			jfRest.request('resSpecialNoRule', 'save', $scope.resSpecialNoRulePrams) //Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00058'));
						$scope.specNoListTable.search();
						$scope.ruleList = [];
						result.cancel(); //成功后关闭弹窗
					} 
				});
		};
		//维护号码
		$scope.updateInfo = function(event) {
			$scope.itemUpdate = {};
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.orderNumber = '';
			$scope.itemUpdate = Object.assign($scope.itemUpdate, $scope.orderNumber);
			jfRest.request('resSpecialNoRule', 'queryInfo', $scope.itemUpdate).then(function(data) {
				if (data.returnMsg == 'OK') {
					$scope.itemUpdate.ruleItemUpdateList = data.returnData.rows;
					$scope.modal('/a_operatMode/resNumber/specialNumUpdate.html', $scope.itemUpdate, {
						title: T.T('YYJ5300003'),
						buttons: [T.T('F00107'), T.T('F00012')],
						size: ['950px', '500px'],
						callbacks: [$scope.sureUpdate]
					});
				} 
			});
		};
		//判断修改特殊号是否重复在
		$scope.isRepeat = function(arr) {
			var hash = {};
			for (var i in arr) {
				if (hash[arr[i].cardNumber]) //hash 哈希
					return true;
				hash[arr[i].cardNumber] = true;
			}
			return false;
		};
		$scope.sureUpdate = function(result) {
			$scope.newBit = $scope.itemUpdate.numberBit;
			$scope.ruleUpdateListSure = result.scope.ruleUpdateList;
			$scope.ruleInfo = {};
			$scope.ruleList = {};
			var newRules = new RegExp("^[0-9]{" + $scope.newBit + "}$");
			//特殊号码字段修改校验
			$scope.itemArranges = $scope.ruleUpdateListSure; //修改特殊号获取数组复值临时变量
			if ($scope.isRepeat($scope.itemArranges)) {
				jfLayer.alert(T.T('YYJ5300008'));
				return;
            }
            for (var i = 0; i < $scope.ruleUpdateListSure.length; i++) {
				if ($scope.ruleUpdateListSure[i].cardNumber == '') {
					jfLayer.fail(T.T('YYJ5300009'));
					return;
				} else if (!newRules.test($scope.ruleUpdateListSure[i].cardNumber) || ($scope.ruleUpdateListSure[i].cardNumber
						.length != $scope.newBit)) {
					jfLayer.fail(T.T('YYJ5300010') + $scope.newBit + T.T('YYJ5300011'));
					return;
				}
			}
			if ($scope.ruleUpdateListSure) {
				for (var i = 0; i < $scope.ruleUpdateListSure.length; i++) {
					$scope.ruleUpdateListSure[i].corporationEntityNo = $scope.itemUpdate.corporationEntityNo;
					$scope.ruleUpdateListSure[i].cardBin = $scope.itemUpdate.cardBin;
					$scope.ruleUpdateListSure[i].segmentNumber = $scope.itemUpdate.segmentNumber;
					$scope.ruleUpdateListSure[i].orderNumber = $scope.itemUpdate.orderNumber;
				}
			}
			$scope.ruleList.corporationEntityNo = $scope.itemUpdate.corporationEntityNo;
			$scope.ruleList.cardBin = $scope.itemUpdate.cardBin;
			$scope.ruleList.segmentNumber = $scope.itemUpdate.segmentNumber;
			$scope.ruleList.numberType = $scope.itemUpdate.numberType;
			$scope.ruleList.numberBit = $scope.itemUpdate.numberBit;
			$scope.ruleList.id = $scope.itemUpdate.id;
			$scope.ruleList.orderNumber = $scope.itemUpdate.orderNumber;
			$scope.ruleList.numberRange = $scope.itemUpdate.numberRange;
			$scope.ruleList.criticalFlag = result.scope.updatecriticalFlag;//紧急号段标识
			$scope.ruleList.arranges = $scope.ruleUpdateListSure;
			$scope.ruleInfo.rule = $scope.ruleList;
			jfRest.request('resSpecialNoRule', 'queryUpdate', $scope.ruleInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.specNoListTable.search();
					$scope.ruleInfo = {};
					$scope.safeApply();
					result.cancel();
				} 
			});
		}
	});
	webApp.controller('specialNumInfoCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.ruleList = $scope.itemInfo.ruleItemList;
		$scope.numberType = $scope.itemInfo.numberType;
		//紧急号段标识
		$scope.criticalFlagArry  = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_isYorN",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.newNumberText = '';
		switch ($scope.numberType) {
			case 'S':
				$scope.newNumberText = T.T("YYJ5300004");
				break;
			case 'B':
				$scope.newNumberText = T.T("YYJ5300006");
				break;
			case 'L':
				$scope.newNumberText = T.T("YYJ5300007");
				break;
			case 'D':
				$scope.newNumberText = T.T("YYJ5300005");
				break;
        }
    });
	webApp.controller('specialNumUpdateCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.ruleUpdateList = $scope.itemUpdate.ruleItemUpdateList;
		//紧急号段标识
		$scope.criticalFlagArry  = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_isYorN",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updatecriticalFlag = $scope.itemUpdate.criticalFlag;
			}
		};
		//新增特殊号
		$scope.addSpecNumUpdate = function() {
			if ($scope.ruleUpdateList == '' || $scope.ruleUpdateList == undefined || $scope.ruleUpdateList == null) {
				$scope.ruleUpdateList = [];
				$scope.ruleUpdateList.push({
					cardNumber: ''
				})
			} else {
				$scope.ruleUpdateList.push({
					cardNumber: ''
				})
			}
		};
		$scope.delcardNumUpdate = function(e, $index) {
			$scope.ruleUpdateList.splice($index, 1);
		}
	});
	//特殊号码规则建立
	webApp.controller('specialNumberRuleEstCtrl', function($scope, $stateParams, jfRest, $timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.menuNo = lodinDataService.getObject("menuNo");
		//特殊号码方式
		$scope.numberTypeArry = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_numberType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		//紧急号段标识
		$scope.criticalFlagArry  = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_isYorN",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.specNoRuleObj = {};
		$scope.resSpecialNoRulePrams = {};
		//查询法人实体
		$scope.queryCorEntityNo = function() {
			$scope.queryParam = {
				organNo: $scope.organization
			};
			jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if ($scope.adminFlag != "1" && $scope.adminFlag != "2") {
					$scope.resSpecialNoRulePrams.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporationNo").attr("readonly", true);
				}
			});
		};
		$scope.queryCorEntityNo();
		//卡bin
		$scope.cardBinArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "binNo", //下拉框显示内容，根据需要修改字段名称 
			value: "binNo", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "productLine.queryBin", //数据源调用的action 
			callback: function(data) {}
		};
		//根据选择卡BIN的条件筛选特殊号码段
		var form = layui.form;
		$scope.segmentNumberArr = {};
		form.on('select(getCardBin)', function(data) {
			//特殊号码段下拉
			$scope.segmentNumberArr = {
				type: "dynamic",
				param: {
					cardBin: data.value
				}, //默认查询条件 
				text: "segmentNumber", //下拉框显示内容，根据需要修改字段名称 
				value: "segmentNumber", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "resSpecialNoRule.query", //数据源调用的action 
				callback: function(data) {
				}
			};
		});
		$scope.chosecorporation = function() {
			//弹框查询列表
			$scope.params = {
				"pageSize": 10,
				"indexNo": 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/specNoRuleObjber/chosecorporation.html', $scope.params, {
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
			$scope.ruleObj.corporationEntityNo = $scope.checkedEvent.corporationEntityNo;
			$scope.safeApply();
			result.cancel();
		};
		//查询已有预留号规则表
		$scope.specNoRuleTable = {
			params: {
				"corporationEntityNo": $scope.corporationEntityNo,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'resSpecialNoRule.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//新增预留号规则list
		$scope.ruleList = [];
		$scope.specRuleItem = {}; //接受弹窗中内容
		$scope.ruleObj = {}; //单个规则
		//前端保存新增预留号规则
		$scope.jsSaveSpecNoRuleObj = function() {
			if ($scope.compare() == false) {
				jfLayer.fail(T.T('YYJ5300012'));
				return;
			}
			$scope.ruleList.push({
				cardBin: $scope.resSpecialNoRulePrams.cardBin,
				corporationEntityNo: $scope.resSpecialNoRulePrams.corporationEntityNo,
				segmentNumber: $scope.resSpecialNoRulePrams.segmentNumber,
				numberType: $scope.resSpecialNoRulePrams.numberType,
				numberBit: $scope.resSpecialNoRulePrams.numberBit,
				numberRange: $scope.resSpecialNoRulePrams.numberRange,
				criticalFlag: $scope.resSpecialNoRulePrams.criticalFlag,
				arranges: [{
					cardNumber: ''
				}]
			});
			$scope.saveRuleBtn = true;
			$scope.specNoRuleObjForm.$setPristine();
			$scope.queryCorEntityNo(); //查询法人实体
		};
		//保存特殊号规则建立，保存特殊号码规则不能重复
		$scope.compare = function() {
			$scope.isRepeat = function(arr) {
				var hash = {};
				for (var i in arr) {
					if (hash[arr[i].cardNumber]) //hash 哈希
						return true;
					hash[arr[i].cardNumber] = true;
				}
				return false;
			};
			/*for (var i = 0; i < $scope.ruleList.length; i++) {
	       $scope.tempVar = $scope.ruleList[i];
	       delete $scope.tempVar.arranges;
		   $scope.isUnique = angular.equals($scope.resSpecialNoRulePrams, $scope.tempVar);
		   if($scope.isUnique == true){
		   		return false;
		   		break;
		   }
		}*/
		};
		//新增特殊号码
		$scope.addCardBtn = function(event, $index) {
			$scope.ruleItem = {};
			$scope.ruleItem = $.parseJSON(JSON.stringify(event));
			$scope.ruleItem.index = $index;
			$scope.modal('/a_operatMode/resNumber/addSpecialNum.html', $scope.ruleItem, {
				title: T.T("YYJ5300002"),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1000px', '380px'],
				callbacks: [$scope.sureAddResSpecNum]
			});
		};
		//保存特殊号规则建立里面的新增特殊号码第二层弹窗，判断特殊号是否重复
		$scope.isRepeat = function(arr) {
			var hash = {};
			for (var i in arr) {
				if (hash[arr[i].cardNumber]) //hash 哈希
					return true;
				hash[arr[i].cardNumber] = true;
			}
			return false;
		};
		//确认新增特殊号
		$scope.sureAddResSpecNum = function(result) {
			$scope.ruleItem = result.scope.ruleItem;
			$scope.cardNumItem = {};
			$scope.newBit = $scope.ruleItem.numberBit; //特殊号码位数
			//$scope.newRules = '';
			var newRules = new RegExp("^[0-9]{" + $scope.newBit + "}$");
			//alert(newRules.test("12345s"));		
			$scope.itemArranges = $scope.ruleItem.arranges;
			for (var i = 0; i < $scope.ruleItem.arranges.length; i++) {
				$scope.cardNumItem.cardNumber = $scope.ruleItem.arranges[i].cardNumber; //需要循环取到每一个新增input的值
				if ($scope.isRepeat($scope.itemArranges)) {
					jfLayer.alert(T.T('YYJ5300008'));
					return;
                }
                if ($scope.ruleItem.arranges[i].cardNumber == '') {
					jfLayer.fail(T.T('YYJ5300009'));
					return;
				} else if (!newRules.test($scope.cardNumItem.cardNumber) || ($scope.cardNumItem.cardNumber.length != $scope.newBit)) {
					jfLayer.fail(T.T('YYJ5300010') + $scope.newBit + T.T('YYJ5300011'));
					return;
				}
			}
			angular.forEach($scope.ruleItem.arranges, function(item, index) {
				item.corporationEntityNo = $scope.ruleItem.corporationEntityNo;
				item.cardBin = $scope.ruleItem.cardBin;
				item.segmentNumber = $scope.ruleItem.segmentNumber;
				//item.numberType = $scope.ruleItem.numberType;
				//item.numberBit = $scope.ruleItem.numberBit;
			});
			//规则表中，替换对象的单个规则
			$scope.ruleList[$scope.ruleItem.index] = $scope.ruleItem;
			$scope.safeApply();
			result.cancel();
		};
		//删除
		$scope.removeSpeNumRule = function(data) {
			var checkId = data;
			$scope.ruleList.splice(checkId, 1);
		};
	});
	//新增特殊号
	webApp.controller('addSpecialNumCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.ruleItem = $scope.ruleItem;
		//判断是新增还是查看修改
		if ($scope.ruleItem.arranges.length == 1 && !$scope.ruleItem.arranges[0].cardNumber) { //特殊号只有一条，不为空
			$scope.cardNumItem = {
				cardNumber: $scope.ruleItem.arranges[0].cardNumber
			};
			$scope.cardNumItem.cardNumber = $scope.ruleItem.arranges[0].cardNumber;
		} else if ($scope.ruleItem.arranges.length == 1 && ($scope.ruleItem.arranges[0].cardNumber == '' ||
				$scope.ruleItem.arranges[0].cardNumber == undefined ||
				$scope.ruleItem.arranges[0].cardNumber == null)) { //特殊号只有一条，为空
			$scope.cardNumItem = {
				cardNumber: ''
			};
			$scope.ruleItem.arranges[0].cardNumber = $scope.cardNumItem.cardNumber;
		} else if ($scope.ruleItem.arranges.length > 1) {
			$scope.ruleItem.arranges = $scope.ruleItem.arranges;
		}
		//新增特殊号
		$scope.addSpecNum = function() {
			$scope.ruleItem.arranges.push({
				cardNumber: ''
			})
		};
		$scope.delcardNum = function(e, $index) {
			$scope.ruleItem.arranges.splice($index, 1);
		}
	});
});
