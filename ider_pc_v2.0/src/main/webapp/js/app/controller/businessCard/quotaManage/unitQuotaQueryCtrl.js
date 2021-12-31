'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('unitQuotaQueryCtr', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_cusInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaQuery');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_customerAdjust');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/quotaManage/i18n_unitQuotaQuery');
		$translate.refresh();
		$scope.userName = sessionStorage.getItem("userName"); //用户名
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfo = false;
		$scope.showNodeDatail = false; //应用节点表
		//单位公务卡额度
		$scope.unitQuotaTable = {
			autoQuery: false,
			//checkType : 'radio',
			params: {
				pageSize: 10,
				indexNo: 0,
				idType: '7'
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'quotaManage.unitQuoQuery', // 列表的资源
			isTrans: true,
			transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
			transDict: ['idType_idTypeDesc','invalidFlag_invalidFlagDesc'],
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					$scope.unitInfo = {};
					if (!data.returnData.obj || data.returnData.obj.length == 0) {
						$scope.unitInfo = {};
					} else {
						$scope.unitInfo = data.returnData.obj;
					}
					$scope.resultInfo = true;
				} else {
					$scope.resultInfo = false;
				}
			}
		};
		//查询
		$scope.selectList = function(item) {
			if ($scope.idNumber) {
				$scope.unitQuotaTable.params.idNumber = $scope.idNumber;
				$scope.unitQuotaTable.search();
//				$scope.resultInfo = true;
			} else {
//				$scope.resultInfo = false;
				jfLayer.fail(T.T('GWJ400001')); //"请输入预算单位编码进行查询！");
			}
		};
		//重置
		$scope.reset = function() {
			$scope.idNumber = '';
			$scope.resultInfo = false;
		};
		//授信
		$scope.getCredit = function(item) {
			$scope.resInfo = {};
			$scope.resInfo = $.parseJSON(JSON.stringify(item));
			$scope.resInfo.customerNo = $scope.unitInfo.customerNo;
			$scope.modal('/businessCard/quotaManage/unitCreditInfo.html', $scope.resInfo, {
				title: T.T('GWH400003'), //'授信',
				buttons: [T.T('F00107'), T.T('F00012')], //[ '确定','关闭'],
				size: ['1000px', '380px'],
				callbacks: [$scope.sureTwoInfo]
			});
		};
		//专项授信确定
		$scope.sureTwoInfo = function(result) {
			$scope.resTwoInfo = {};
			if (result.scope.creditTwoType == 'P') { //永久
				$scope.resTwoInfo.operationMode = result.scope.operationModeInfo;
				$scope.resTwoInfo.externalIdentificationNo = $scope.resInfo.externalIdentificationNo;
				$scope.resTwoInfo.customerNo = $scope.resInfo.customerNo;
				$scope.resTwoInfo.creditLimit = result.scope.creditTwoquotaN;
				if (result.scope.creditTwocurrency == '156') {
					$scope.resTwoInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
				} else if (result.scope.creditTwocurrency == '840') {
					$scope.resTwoInfo.currencyCodeInfo = T.T('F00095'); // '美元';
				}
				if (result.scope.creditTwoType == 'P') {
					$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600001'); //  '永久额度';
				} else if (result.scope.creditTwoType == 'T') {
					$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600002'); //  '临时额度';
				}
				$scope.cusParams = {
					operationMode: result.scope.operationMode, //运营模式
					externalIdentificationNo: $scope.resInfo.externalIdentificationNo, //外部识别号
					customerNo: $scope.resInfo.customerNo, //客户号
					creditType: result.scope.creditTwoType, //授信类型
					currencyCode: result.scope.creditTwocurrency, //币种
					creditNodeNo: result.scope.creditNodeNo, //授信节点
					creditLimit: result.scope.creditTwoquotaN, //授信钱
					budgetOrgCode: $scope.resInfo.budgetOrgCode //预算单位编码
				};
				jfRest.request('quotaManage', 'creditUnit', $scope.cusParams)
					.then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.resTwoInfo.codeKey = '0';
							$scope.resTwoInfo.returnCodeInfo = T.T('GWJ400005'); //'成功';
						} else {
							$scope.resTwoInfo.codeKey = '1';
							$scope.resTwoInfo.returnCodeInfo = T.T('GWJ400006'); //'失败';
							$scope.resTwoInfo.returnMsgInfo = data.returnMsg;
						}
						/*$scope.modal('/businessCard/quotaManage/unitCreditResultInfo.html', $scope.resTwoInfo, {
							title: T.T('SQJ600009'), //'授信结果信息',
							buttons: [T.T('F00012')],
							size: ['900px', '450px'],
							callbacks: []
						});*/
						$scope.safeApply();
						result.cancel();
					});
			} else if (result.scope.creditTwoType == 'T') { //临时
				$scope.startDate = {};
				$scope.endDate = {};
				$scope.startDate = $("#LAY_startDate").val();
				$scope.endDate = $("#LAY_endDate").val();
				if ($scope.startDate && $scope.endDate) {
					$scope.resTwoInfo.operationMode = result.scope.operationModeInfo;
					$scope.resTwoInfo.externalIdentificationNo = $scope.resInfo.externalIdentificationNo;
					$scope.resTwoInfo.customerNo = $scope.resInfo.customerNo;
					$scope.resTwoInfo.creditLimit = result.scope.creditTwoquotaN;
					$scope.resTwoInfo.creditNodeNo = result.scope.creditNodeNo,
						$scope.resTwoInfo.startDateInfo = $scope.startDate;
					$scope.resTwoInfo.endDataInfo = $scope.endDate;
					if (result.scope.creditTwocurrency == '156') {
						$scope.resTwoInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
					} else if (result.scope.creditTwocurrency == '840') {
						$scope.resTwoInfo.currencyCodeInfo = T.T('F00095'); //'美元';
					}
					if (result.scope.creditTwoType == 'P') {
						$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600001'); //  '永久额度';
					} else if (result.scope.creditTwoType == 'T') {
						$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600002'); //  '临时额度';
					}
					$scope.cusParams = {
						operationMode: result.scope.operationMode, //运营模式
						externalIdentificationNo: $scope.resInfo.externalIdentificationNo, //外部识别号
						customerNo: $scope.resInfo.customerNo, //客户号
						creditType: result.scope.creditTwoType, //授信类型
						currencyCode: result.scope.creditTwocurrency, //币种
						creditNodeNo: result.scope.creditNodeNo, //授信节点
						creditLimit: result.scope.creditTwoquotaN, //授信钱
						budgetOrgCode: $scope.resInfo.budgetOrgCode, //预算单位编码
						limitEffectvDate: $scope.startDate,
						limitExpireDate: $scope.endDate
					};
					jfRest.request('quotaManage', 'creditUnit', $scope.cusParams)
						.then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.resTwoInfo.codeKey = '0';
								$scope.resTwoInfo.returnCodeInfo = T.T('GWJ400005'); //'成功';
							} else {
								$scope.resTwoInfo.codeKey = '1';
								$scope.resTwoInfo.returnCodeInfo = T.T('GWJ400006'); //'失败';
								$scope.resTwoInfo.returnMsgInfo = data.returnMsg;
							}
							/*$scope.modal('/businessCard/quotaManage/unitCreditResultTwoInfo.html', $scope.resTwoInfo, {
								title: T.T('SQJ600009'), //'授信结果信息',
								buttons: [T.T('F00012')],
								size: ['900px', '450px'],
								callbacks: []
							});*/
							$scope.safeApply();
							result.cancel();
						});
				} else {
					jfLayer.fail(T.T('GWJ400002')); //"请输入生效日期和失效日期！");
				}
			}
		};
		//调额
		$scope.adjustQuota = function(item) {
			$scope.adjustInfo = {};
			$scope.adjustInfo = $.parseJSON(JSON.stringify(item));
			$scope.adjustInfo.customerNo = $scope.unitInfo.customerNo;
			$scope.modal('/businessCard/quotaManage/unitAdjustInfo.html', $scope.adjustInfo, {
				title: T.T('GWH400004'), //'调额',
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1000px', '380px'],
				callbacks: [$scope.sureAdjust]
			});
		};
		//调额确定
		$scope.sureAdjust = function(result) {
			//获取调额类型，根据类型显示额度种类
			$scope.limitEffectvDate = {};
			$scope.limitExpireDate = {};
			$scope.limitEffectvDate = $("#LAY_startDate").val();
			$scope.limitExpireDate = $("#LAY_endDate").val();
			if (result.scope.adjustType == '1' || result.scope.adjustType == '2') {
				if (result.scope.creditLimit) {
					$scope.resInfo = {};
					$scope.resInfo.operationModesInfo = result.scope.operationModeInfo;
					$scope.resInfo.externalIdentificationNo = $scope.adjustInfo.externalIdentificationNo; //外部识别号
					$scope.resInfo.customerNo = $scope.adjustInfo.customerNoInfo; //客户号
					$scope.resInfo.creditNodeNosInfo = result.scope.creditNodeNoInfo;
					$scope.resInfo.tempLimitInfo = result.scope.creditLimit;
					$scope.resInfo.startDateInfo = result.scope.limitEffectvDate;
					$scope.resInfo.endDataInfo = result.scope.limitExpireDate;
					if (result.scope.currencyCode == '156') {
						$scope.resInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
					} else if (result.scope.currencyCode == '840') {
						$scope.resInfo.currencyCodeInfo = T.T('F00095'); //'美元';
					}
					if (result.scope.adjustType == '1') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400007'); //'永额调升';
					} else if (result.scope.adjustType == '2') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400008'); //'永额调降';
					} else if (result.scope.adjustType == '3') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400009'); //'临额调升';
					} else if (result.scope.adjustType == '4') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400010'); //'临额取消';
					} else if (result.scope.adjustType == '5') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400011'); //'临额调降';
					}
					$scope.adjustParams = {
						operationMode: result.scope.operationMode, //运营模式
						externalIdentificationNo: $scope.adjustInfo.externalIdentificationNo, //外部识别号
						customerNo: $scope.adjustInfo.customerNo, //客户号
						creditNodeNo: result.scope.creditNodeNo, //调额节点
						adjustType: result.scope.adjustType, //调额类型
						currencyCode: result.scope.currencyCode, //币种
						creditLimit: result.scope.creditLimit, //授信额度
						limitEffectvDate: result.scope.limitEffectvDate, //生效日期
						limitExpireDate: result.scope.limitExpireDate, //失效日期
						budgetOrgCode: $scope.adjustInfo.budgetOrgCode,
						adjusClass: result.scope.adjusClass
					};
					jfRest.request('quotaManage', 'adjustUnit', $scope.adjustParams)
						.then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.resInfo.returnCodeInfo = T.T('GWJ400005'); //'成功';
								$scope.modal('/businessCard/quotaManage/unitResultAdjust.html', $scope.resInfo, {
									title: T.T('SQJ600009'), //'授信结果信息',
									buttons: [T.T('F00012')],
									size: ['1050px', '560px'],
									callbacks: []
								});
							} else {
								$scope.resInfo.returnCodeInfo = T.T('GWJ400006'); //'失败';
								$scope.resInfo.returnMsgInfo = data.returnMsg;
								$scope.modal('/businessCard/quotaManage/unitResultAdjust.html', $scope.resInfo, {
									title: T.T('SQJ600009'), //'授信结果信息',
									buttons: [T.T('F00012')],
									size: ['1050px', '560px'],
									callbacks: []
								});
							}
						});
				} else {
					jfLayer.alert(T.T('GWJ400003')); //"请输入授信额度！");
				}
			} else if (result.scope.adjustType == '3' || result.scope.adjustType == '5') {
				if (!result.scope.creditLimit) {
					jfLayer.alert(T.T('GWJ400012')); //"请输入授信额度！");
				} else if (!result.scope.limitEffectvDate) {
					jfLayer.alert(T.T('GWJ400013')); //"请输入临时额度生效日期！");
				} else if (!result.scope.limitExpireDate) {
					jfLayer.alert(T.T('GWJ400014')); //"请输入临时额度失效日期！");
				} else {
					$scope.resInfo = {};
					$scope.resInfo.operationModesInfo = result.scope.operationModeInfo;
					$scope.resInfo.externalIdentificationNo = $scope.adjustInfo.externalIdentificationNo; //外部识别号
					$scope.resInfo.customerNo = $scope.adjustInfo.customerNoInfo; //客户号
					$scope.resInfo.creditNodeNosInfo = result.scope.creditNodeNoInfo;
					$scope.resInfo.tempLimitInfo = result.scope.creditLimit;
					$scope.resInfo.startDateInfo = result.scope.limitEffectvDate;
					$scope.resInfo.endDataInfo = result.scope.limitExpireDate;
					if (result.scope.currencyCode == '156') {
						$scope.resInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
					} else if (result.scope.currencyCode == '840') {
						$scope.resInfo.currencyCodeInfo = T.T('F00095'); //'美元';
					}
					if (result.scope.adjustType == '1') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400007'); //'永额调升';
					} else if (result.scope.adjustType == '2') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400008'); //'永额调降';
					} else if (result.scope.adjustType == '3') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400009'); //'临额调升';
					} else if (result.scope.adjustType == '4') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400010'); //'临额取消';
					} else if (result.scope.adjustType == '5') {
						$scope.resInfo.adjustTypeInfo = T.T('GWJ400011'); //'临额调降';
					}
					$scope.adjustParams = {
						operationMode: result.scope.operationMode, //运营模式
						externalIdentificationNo: $scope.adjustInfo.externalIdentificationNo, //外部识别号
						customerNo: $scope.adjustInfo.customerNo, //客户号
						creditNodeNo: result.scope.creditNodeNo, //调额节点
						adjustType: result.scope.adjustType, //调额类型
						currencyCode: result.scope.currencyCode, //币种
						creditLimit: result.scope.creditLimit, //授信额度
						limitEffectvDate: result.scope.limitEffectvDate, //生效日期
						limitExpireDate: result.scope.limitExpireDate, //失效日期
						budgetOrgCode: $scope.adjustInfo.budgetOrgCode
					};
					jfRest.request('quotaManage', 'adjustUnit', $scope.adjustParams)
						.then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.resInfo.returnCodeInfo = T.T('GWJ400005'); //'成功';
								$scope.modal('/businessCard/quotaManage/unitResultAdjust.html', $scope.resInfo, {
									title: T.T('GWJ400015'), //'调额结果信息',
									buttons: [T.T('F00012')],
									size: ['1050px', '560px'],
									callbacks: []
								});
							} else {
								$scope.resInfo.returnCodeInfo = T.T('GWJ400006'); //'失败';
								$scope.resInfo.returnMsgInfo = data.returnMsg;
								$scope.modal('/businessCard/quotaManage/unitResultAdjust.html', $scope.resInfo, {
									title: T.T('GWJ400015'), //'调额结果信息',
									buttons: [T.T('F00012')],
									size: ['1050px', '560px'],
									callbacks: []
								});
							}
						});
				}
			} else {
				$scope.resInfo = {};
				$scope.resInfo.operationModesInfo = result.scope.operationModeInfo;
				$scope.resInfo.externalIdentificationNo = $scope.adjustInfo.externalIdentificationNo; //外部识别号
				$scope.resInfo.customerNo = $scope.adjustInfo.customerNoInfo; //客户号
				$scope.resInfo.creditNodeNosInfo = result.scope.creditNodeNoInfo;
				$scope.resInfo.tempLimitInfo = result.scope.creditLimit;
				$scope.resInfo.startDateInfo = result.scope.limitEffectvDate;
				$scope.resInfo.endDataInfo = result.scope.limitExpireDate;
				if (result.scope.currencyCode == '156') {
					$scope.resInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
				} else if (result.scope.currencyCode == '840') {
					$scope.resInfo.currencyCodeInfo = T.T('F00095'); //'美元';
				}
				if (result.scope.adjustType == '1') {
					$scope.resInfo.adjustTypeInfo = T.T('GWJ400007'); //'永额调升';
				} else if (result.scope.adjustType == '2') {
					$scope.resInfo.adjustTypeInfo = T.T('GWJ400008'); //'永额调降';
				} else if (result.scope.adjustType == '3') {
					$scope.resInfo.adjustTypeInfo = T.T('GWJ400009'); //'临额调升';
				} else if (result.scope.adjustType == '4') {
					$scope.resInfo.adjustTypeInfo = T.T('GWJ400010'); //'临额取消';
				} else if (result.scope.adjustType == '5') {
					$scope.resInfo.adjustTypeInfo = T.T('GWJ400011'); //'临额调降';
				}
				$scope.adjustParams = {
					operationMode: result.scope.operationMode, //运营模式
					externalIdentificationNo: $scope.adjustInfo.externalIdentificationNo, //外部识别号
					customerNo: $scope.adjustInfo.customerNo, //客户号
					creditNodeNo: result.scope.creditNodeNo, //调额节点
					adjustType: result.scope.adjustType, //调额类型
					currencyCode: result.scope.currencyCode, //币种
					creditLimit: result.scope.creditLimit, //授信额度
					limitEffectvDate: result.scope.limitEffectvDate, //生效日期
					limitExpireDate: result.scope.limitExpireDate, //失效日期
					budgetOrgCode: $scope.adjustInfo.budgetOrgCode
				};
				jfRest.request('quotaManage', 'adjustUnit', $scope.adjustParams)
					.then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.resInfo.returnCodeInfo = T.T('GWJ400005'); //'成功';
							$scope.modal('/businessCard/quotaManage/unitResultAdjust.html', $scope.resInfo, {
								title: T.T('GWJ400015'), //'调额结果信息',
								buttons: [T.T('F00012')],
								size: ['1050px', '560px'],
								callbacks: []
							});
						} else {
							$scope.resInfo.returnCodeInfo = T.T('GWJ400006'); //'失败';
							$scope.resInfo.returnMsgInfo = data.returnMsg;
							$scope.modal('/businessCard/quotaManage/unitResultAdjust.html', $scope.resInfo, {
								title: T.T('GWJ400015'), //'调额结果信息',
								buttons: [T.T('F00012')],
								size: ['1050px', '560px'],
								callbacks: []
							});
						}
					});
			}
		};
		$scope.nodeTable = {
			checkType: '',
			params: {
				authDataSynFlag: "1",
				pageSize: 10,
				indexNo: 0,
			}, // 表格查询时的参数信息
			paging: false, // 默认true,是否分页
			resource: 'quotaManage.nodeQuery', // 列表的资源
			autoQuery: false,
			callback: function(data) { // 表格查询后的回调函数
				
			}
		};
		//点击应用节点
		$scope.checkElmInfo = function(item) {
			$scope.showNodeDatail = true; //应用节点表
			$scope.nodeTable.params.externalIdentificationNo = angular.fromJson(item).externalIdentificationNo;
			$scope.nodeTable.search();
		};
	});
	//授信
	webApp.controller('creditInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translate.refresh();
		//授信额度类型   P： 永久额度   T：临时额度*/
		$scope.creditTypeArray = [{
			name: T.T('SQJ600001'),
			id: 'P'
		}, {
			name: T.T('SQJ600002'),
			id: 'T'
		}];
		//日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#LAY_startDate',
				min: Date.now(),
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
				elem: '#LAY_endDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
		//日期控件end
		//运营模式
		$scope.coArray = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.query", //数据源调用的action 
			callback: function(data) {
				$scope.coArrayList = data
			}
		};
		$scope.isT = false;
		//额度节点
		$scope.quoteArray = {};
		var form = layui.form;
		form.on('select(getoperation)', function(event) {
			$scope.operationMode = event.value;
			$scope.quoteArray = {
				type: "dynamic",
				param: {
					"authDataSynFlag": '1',
					"creditFlag": 'Y',
					"operationMode": $scope.operationMode
				}, //默认查询条件
				text: "creditDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "creditNodeNo", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "quotatree.queryList", //数据源调用的action 
				callback: function(data) {
				}
			};
			for (var i = 0; i < $scope.coArrayList.length; i++) {
				if ($scope.operationMode == $scope.coArrayList[i].operationMode) {
					$scope.operationModeInfo = $scope.coArrayList[i].modeName;
				}
			}
		});
		// 授信类型默认为P
		$scope.creditTwoType = 'P';
		$scope.creditcurrencyArray = {};
		form.on('select(getcreditNodeNoS)', function(event) {
			if ($scope.operationMode) {
				//授信币种
				$scope.creditcurrencyArray = {
					type: "dynamic",
					param: {
						authDataSynFlag: '1',
						externalIdentificationNo: $scope.resInfo.externalIdentificationNo,
						operationMode: $scope.operationMode,
						creditNodeNo: event.value,
						grantAdjustFlag: 'G'
					}, //默认查询条件 
					text: "currencyDesc", //下拉框显示内容，根据需要修改字段名称 
					value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "quota.creditCurrency", //数据源调用的action 
					callback: function(data) {
						if (null != data) {
							if (data[0].creditType == "P") {
								$scope.isT = false;
								$scope.startDate = "";
								$scope.endDate = "";
								$scope.creditTwoType = 'P';
							} else if (data[0].creditType == "T") {
								$scope.isT = true;
								$scope.creditTwoType = 'T';
							}
						}
					}
				};
			} else {
				jfLayer.fail(T.T('GWJ400004')); //"请输入运营模式");
			}
		});
	});
	//调额
	webApp.controller('adjustInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translate.refresh();
		//日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#LAY_startDate',
				min: Date.now(),
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
				elem: '#LAY_endDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
		//日期控件end
		//运营模式
		$scope.coArray = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.query", //数据源调用的action 
			callback: function(data) {
				$scope.coArrayList = data
			}
		};
		//调整种类
		$scope.adjusClassArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_adjusType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//调额类型
		$scope.adjustTypeArray =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_adjustQuoteType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		$scope.tempInfo = false;
		$scope.permInfo = false;
		//额度节点
		$scope.quoteArray = {};
		var form = layui.form;
		form.on('select(getoperation)', function(event) {
			$scope.operationMode = event.value;
			$scope.quoteArray = {
				type: "dynamic",
				param: {
					"authDataSynFlag": '1',
					"adjustFlag": 'Y',
					"creditFlag": 'Y',
					"operationMode": $scope.operationMode
				}, //默认查询条件
				text: "creditDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "creditNodeNo", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "quotatree.queryList", //数据源调用的action 
				callback: function(data) {
					$scope.quoteArrayList = data;
				}
			};
			for (var i = 0; i < $scope.coArrayList.length; i++) {
				if ($scope.operationMode == $scope.coArrayList[i].operationMode) {
					$scope.operationModeInfo = $scope.coArrayList[i].modeName;
				}
			}
		});
		$scope.creditcurrencyArray = {};
		//获取额度节点描述
		form.on('select(getquote)', function(event) {
			$scope.creditNodeNo = event.value;
			if ($scope.operationMode) {
				for (var i = 0; i < $scope.quoteArrayList.length; i++) {
					if ($scope.creditNodeNo == $scope.quoteArrayList[i].creditNodeNo) {
						$scope.creditNodeNoInfo = $scope.quoteArrayList[i].creditDesc;
					}
				}
				//授信币种
				$scope.creditcurrencyArray = {
					type: "dynamic",
					param: {
						"authDataSynFlag": '1',
						"operationMode": $scope.operationMode,
						"creditNodeNo": $scope.creditNodeNo,
						"externalIdentificationNo": $scope.adjustInfo.externalIdentificationNo,
						"grantAdjustFlag": 'A'
					}, //默认查询条件 
					text: "currencyDesc", //下拉框显示内容，根据需要修改字段名称 
					value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
					resource: "quota.creditCurrency", //数据源调用的action 
					callback: function(data) {
						
					}
				};
			} else {
				jfLayer.fail(T.T('GWJ400004')); //"请选择运营模式！");
			}
		});
		//获取调额类型，根据类型显示额度种类
		form.on('select(getcurrencyType)', function(event) {
			if (event.value == '1' || event.value == '2') {
				$scope.tempInfo = false;
				$scope.permInfo = true;
			} else if (event.value == '3' || event.value == '5') {
				$scope.tempInfo = true;
				$scope.permInfo = true;
			} else if (event.value == '4') {
				$scope.tempInfo = false;
				$scope.permInfo = false;
				$scope.creditLimit = 0;
				$scope.limitEffectvDate = "";
				$scope.limitExpireDate = "";
			}
		});
	});
	webApp.controller('unitResultInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.showNodeResult = false; //应用节点表
		$scope.isNO = false;
		$scope.tempResult = false;
		if ($scope.resInfo.returnCodeInfo == '失败' || $scope.resInfo.returnCodeInfo == 'Fail') {
			$scope.isNO = true;
		} else {
			$scope.isNO = false;
		}
		if ($scope.resInfo.adjustTypeNum == '1' || $scope.resInfo.adjustTypeNum == '2' || $scope.resInfo.adjustTypeNum ==
			'4') {
			$scope.tempResult = false;
		} else if ($scope.resInfo.adjustTypeNum == '3' || $scope.resInfo.adjustTypeNum == '5') {
			$scope.tempResult = true;
		}
	});
	webApp.controller('unitCreditResultInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T) {
		$scope.isNO = false;
		if ($scope.resTwoInfo.codeKey = '1') {
			$scope.isNO = true;
		} else {
			$scope.isNO = false;
		}
	});
	webApp.controller('unitCreditResultTwoInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T) {
		$scope.isNO = false;
		if ($scope.resTwoInfo.codeKey = '1') {
			$scope.isNO = true;
		} else {
			$scope.isNO = false;
		}
	});
});
