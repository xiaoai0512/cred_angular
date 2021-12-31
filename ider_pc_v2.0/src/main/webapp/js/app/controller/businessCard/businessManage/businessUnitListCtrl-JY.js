'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('businessUnitListCtr-JY', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$scope.userName = sessionStorage.getItem("userName"); //用户名
		$scope.menuName = lodinDataService.getObject("menuName");
		 //外国人永久居留证 */
		$scope.certificateTypeArray =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_IdCardType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {}
		};
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)', function(data) {
			if (data.value == "1") { //身份证
				$("#adjustCustomer_idNumber").attr("validator", "id_idcard");
			} else if (data.value == "2") { //港澳居民来往内地通行证
				$("#adjustCustomer_idNumber").attr("validator", "id_isHKCard");
			} else if (data.value == "3") { //台湾居民来往内地通行证
				$("#adjustCustomer_idNumber").attr("validator", "id_isTWCard");
			} else if (data.value == "4") { //中国护照
				$("#adjustCustomer_idNumber").attr("validator", "id_passport");
			} else if (data.value == "5") { //外国护照passport
				$("#adjustCustomer_idNumber").attr("validator", "id_passport");
			} else if (data.value == "6") { //外国人永久居留证
				$("#adjustCustomer_idNumber").attr("validator", "id_isPermanentReside");
			} else if (data.value == "0" || data.value == null || data.value == undefined || data.value == "") { //其他
				$("#adjustCustomer_idNumber").attr("validator", "noValidator");
				$scope.adjustCustomerForm.$setPristine();
				$("#adjustCustomer_idNumber").removeClass("waringform ");
            }
        });
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
		$scope.adjustTypeArray = [{
				name: '固定额度调升',
				id: '1'
			},
			{
				name: '固定额度调降',
				id: '2'
			},
			{
				name: '临时额度调升',
				id: '3'
			},
			{
				name: '临时额度取消',
				id: '4'
			},
			{
				name: '临时额度调降',
				id: '5'
			}
		];
		$scope.tempInfo = false;
		$scope.permInfo = false;
		$scope.showNodeDatail = false; //应用节点表
		//额度节点
		$scope.quoteArray = {};
		var form = layui.form;
		form.on('select(getoperation)', function(event) {
			$scope.quoteArray = {
				type: "dynamic",
				param: {
					"authDataSynFlag": '1',
					"adjustFlag": 'Y',
					"creditFlag": 'Y',
					"operationMode": event.value
				}, //默认查询条件
				text: "creditDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "creditNodeNo", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "quotatree.queryList", //数据源调用的action 
				callback: function(data) {
					$scope.quoteArrayList = data;
				}
			};
			for (var i = 0; i < $scope.coArrayList.length; i++) {
				if (event.value == $scope.coArrayList[i].operationMode) {
					$scope.operationModeInfo = $scope.coArrayList[i].modeName;
				}
			}
		});
		//获取额度节点描述
		form.on('select(getquote)', function(event) {
			for (var i = 0; i < $scope.quoteArrayList.length; i++) {
				if (event.value == $scope.quoteArrayList[i].creditNodeNo) {
					$scope.creditNodeNoInfo = $scope.quoteArrayList[i].creditDesc;
				}
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
		$scope.resultInfo = false;
		$scope.creditcurrencyArray = {};
		//查询详情事件
		$scope.selectList = function() {
			$scope.showNodeDatail = false; //应用节点表
			if (($scope.operationMode == "" || $scope.operationMode == null || $scope.operationMode == undefined) ||
				($scope.creditNodeNo == "" || $scope.creditNodeNo == null || $scope.creditNodeNo == undefined)) {
				jfLayer.alert("请输入运营模式和额度节点！");
			} else {
				if (($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) && ($scope.idType == "" ||
						$scope.idType == null || $scope.idType == undefined) && ($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo ==
						null || $scope.externalIdentificationNo == undefined)) {
					jfLayer.alert("请输入证件号或者外部识别号！");
				} else if (($scope.idNumber) && ($scope.externalIdentificationNo)) {
					$scope.resultInfo = false;
					jfLayer.alert("证件号和外部识别号只能选择输入一种！");
				} else {
					if ($scope.idType) {
						if ($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) {
							jfLayer.alert(T.T('SQJ100002'));
						} else {
							$scope.cusParams = {
								"authDataSynFlag": '1',
								"idNumber": $scope.idNumber,
								"idType": $scope.idType,
								"operationMode": $scope.operationMode,
								"creditNodeNo": $scope.creditNodeNo,
								"grantAdjustFlag": 'A'
							};
							jfRest.request('quota', 'creditCurrency', $scope.cusParams)
								.then(function(data) {
									if (data.returnMsg == 'OK') {
										if (data.returnData.rows.length == 0) {
											jfLayer.alert("该账户不存在额度币种，请核实客户信息！");
										} else {
											//调额币种
											$scope.creditcurrencyArray = {
												type: "dynamic",
												param: {
													"authDataSynFlag": '1',
													"idNumber": $scope.idNumber,
													"idType": $scope.idType,
													"operationMode": $scope.operationMode,
													"creditNodeNo": $scope.creditNodeNo,
													"grantAdjustFlag": 'A'
												}, //默认查询条件 
												text: "currencyDesc", //下拉框显示内容，根据需要修改字段名称 
												value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
												resource: "quota.creditCurrency", //数据源调用的action 
												callback: function(data) {}
											};
											$scope.customerNoInfo = data.returnData.rows[0].customerNo;
											$scope.accountIdInfo = data.returnData.rows[0].externalIdentificationNo;
											$scope.creditTypeInfo = $scope.creditNodeNoInfo;
											$scope.quotaParams = {
												authDataSynFlag: "1",
												operationMode: $scope.operationMode,
												customerNo: $scope.customerNoInfo,
												externalIdentificationNo: $scope.externalIdentificationNo,
												creditNodeNo: $scope.creditNodeNo,
												adjustFlag: 'Y'
											};
											jfRest.request('cusInfo', 'query', $scope.quotaParams)
												.then(function(data) {
													if (data.returnMsg == 'OK') {
														$scope.resultInfo = true;
														$scope.quotaListB = data.returnData.rows;
													} else {
														$scope.resultInfo = false;
													}
												});
										}
									} else {
										$scope.resultInfo = false;
									}
								});
						}
					} else if ($scope.idNumber) {
						if (!$scope.idType) {
							jfLayer.fail(T.T('F00098'));
						} else {
							$scope.cusParams = {
								"authDataSynFlag": '1',
								"idNumber": $scope.idNumber,
								"idType": $scope.idType,
								"operationMode": $scope.operationMode,
								"creditNodeNo": $scope.creditNodeNo,
								"grantAdjustFlag": 'A'
							};
							jfRest.request('quota', 'creditCurrency', $scope.cusParams)
								.then(function(data) {
									if (data.returnMsg == 'OK') {
										if (data.returnData.rows.length == 0) {
											jfLayer.alert("该账户不存在额度币种，请核实客户信息！");
										} else {
											//调额币种
											$scope.creditcurrencyArray = {
												type: "dynamic",
												param: {
													"authDataSynFlag": '1',
													"idNumber": $scope.idNumber,
													"idType": $scope.idType,
													"operationMode": $scope.operationMode,
													"creditNodeNo": $scope.creditNodeNo,
													"grantAdjustFlag": 'A'
												}, //默认查询条件 
												text: "currencyDesc", //下拉框显示内容，根据需要修改字段名称 
												value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
												resource: "quota.creditCurrency", //数据源调用的action 
												callback: function(data) {}
											};
											$scope.customerNoInfo = $scope.customerNo;
											$scope.accountIdInfo = $scope.externalIdentificationNo;
											$scope.creditTypeInfo = $scope.creditNodeNoInfo;
											$scope.quotaParams = {
												authDataSynFlag: "1",
												operationMode: $scope.operationMode,
												customerNo: $scope.customerNo,
												externalIdentificationNo: $scope.externalIdentificationNo,
												creditNodeNo: $scope.creditNodeNo,
												adjustFlag: 'Y'
											};
											jfRest.request('cusInfo', 'query', $scope.quotaParams)
												.then(function(data) {
													if (data.returnMsg == 'OK') {
														$scope.resultInfo = true;
														$scope.quotaListB = data.returnData.rows;
													} else {
														$scope.resultInfo = false;
													}
												});
										}
									} else {
										$scope.resultInfo = false;
									}
								});
						}
					} else {
						$scope.cusParams = {
							"authDataSynFlag": '1',
							"externalIdentificationNo": $scope.externalIdentificationNo,
							"operationMode": $scope.operationMode,
							"creditNodeNo": $scope.creditNodeNo,
							"grantAdjustFlag": 'A'
						};
						jfRest.request('quota', 'creditCurrency', $scope.cusParams)
							.then(function(data) {
								console.log(data);
								if (data.returnMsg == 'OK') {
									if (data.returnData.rows.length == 0) {
										jfLayer.alert("该账户不存在额度币种，请核实客户信息！");
									} else {
										//调额币种
										$scope.creditcurrencyArray = {
											type: "dynamic",
											param: {
												"authDataSynFlag": '1',
												"externalIdentificationNo": $scope.externalIdentificationNo,
												"operationMode": $scope.operationMode,
												"creditNodeNo": $scope.creditNodeNo,
												"grantAdjustFlag": 'A'
											}, //默认查询条件 
											text: "currencyDesc", //下拉框显示内容，根据需要修改字段名称 
											value: "currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
											resource: "quota.creditCurrency", //数据源调用的action 
											callback: function(data) {}
										};
										$scope.customerNoInfo = $scope.customerNo;
										$scope.accountIdInfo = $scope.externalIdentificationNo;
										$scope.creditTypeInfo = $scope.creditNodeNoInfo;
										$scope.quotaParams = {
											authDataSynFlag: "1",
											operationMode: $scope.operationMode,
											customerNo: $scope.customerNo,
											externalIdentificationNo: $scope.externalIdentificationNo,
											creditNodeNo: $scope.creditNodeNo,
											adjustFlag: 'Y'
										};
										jfRest.request('cusInfo', 'query', $scope.quotaParams)
											.then(function(data) {
												if (data.returnMsg == 'OK') {
													$scope.resultInfo = true;
													$scope.quotaListB = data.returnData.rows;
												} else {
													$scope.resultInfo = false;
												}
											});
									}
								} else {
									$scope.resultInfo = false;
								}
							});
					}
				}
			}
		};
		$scope.nodeTable = {
			checkType: '',
			params: {
				"authDataSynFlag": "1",
			}, // 表格查询时的参数信息
			paging: false, // 默认true,是否分页
			resource: 'cusInfo.query', // 列表的资源
			autoQuery: false,
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//点击应用节点
		$scope.checkElmInfo = function(item) {
			$scope.creditNodeNoInfo = angular.fromJson(item).creditDesc;
			$scope.showNodeDatail = true; //应用节点表
			$scope.nodeTable.params.customerNo = angular.fromJson(item).customerNo;
			$scope.nodeTable.params.creditNodeNo = angular.fromJson(item).creditNodeNo;
			$scope.nodeTable.search();
		};
		//调额确定
		$scope.sureTwoInfo = function() {
			//获取调额类型，根据类型显示额度种类
			$scope.limitEffectvDate = $("#LAY_startDate").val();
			$scope.limitExpireDate = $("#LAY_endDate").val();
			if ($scope.adjustType == '1' || $scope.adjustType == '2') {
				if ($scope.creditLimit) {
					$scope.resInfo = {};
					$scope.resInfo.operationMode = $scope.operationMode;
					$scope.resInfo.operationModesInfo = $scope.operationModeInfo;
					$scope.resInfo.externalIdentificationNo = $scope.externalIdentificationNo;
					$scope.resInfo.customerNo = $scope.customerNoInfo;
					$scope.resInfo.creditNodeNo = $scope.creditNodeNo;
					$scope.resInfo.creditNodeNosInfo = $scope.creditNodeNoInfo;
					$scope.resInfo.tempLimitInfo = $scope.creditLimit;
					$scope.resInfo.startDateInfo = $scope.limitEffectvDate;
					$scope.resInfo.endDataInfo = $scope.limitExpireDate;
					$scope.resInfo.adjustTypeNum = $scope.adjustType;
					if ($scope.currencyCode == '156') {
						$scope.resInfo.currencyCodeInfo = '人民币';
					} else if ($scope.currencyCode == '840') {
						$scope.resInfo.currencyCodeInfo = '美元';
					}
					if ($scope.adjustType == '1') {
						$scope.resInfo.adjustTypeInfo = '永额调升';
					} else if ($scope.adjustType == '2') {
						$scope.resInfo.adjustTypeInfo = '永额调降';
					} else if ($scope.adjustType == '3') {
						$scope.resInfo.adjustTypeInfo = '临额调升';
					} else if ($scope.adjustType == '4') {
						$scope.resInfo.adjustTypeInfo = '临额取消';
					} else if ($scope.adjustType == '5') {
						$scope.resInfo.adjustTypeInfo = '临额调降';
					}
					$scope.adjustParams = {
						authDataSynFlag: "1",
						operationMode: $scope.operationMode, //运营模式
						externalIdentificationNo: $scope.externalIdentificationNo, //外部识别号
						customerNo: $scope.customerNo, //客户号
						creditNodeNo: $scope.creditNodeNo, //调额节点
						adjustType: $scope.adjustType, //调额类型
						currencyCode: $scope.currencyCode, //币种
						creditLimit: $scope.creditLimit, //授信额度
						operatorId: $scope.userName, //操作员
						limitEffectvDate: $scope.limitEffectvDate, //生效日期
						limitExpireDate: $scope.limitExpireDate //失效日期
					};
					jfRest.request('quota', 'adjustCustomer', $scope.adjustParams)
						.then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.resInfo.returnCodeInfo = '成功';
								$scope.modal('/authorization/customerInfo/customerResultAdjust.html', $scope.resInfo, {
									title: '授信结果信息',
									buttons: ['关闭'],
									size: ['1050px', '560px'],
									callbacks: []
								});
							} else {
								$scope.resInfo.returnCodeInfo = '失败';
								$scope.resInfo.returnMsgInfo = data.returnMsg;
								$scope.modal('/authorization/customerInfo/customerResultAdjust.html', $scope.resInfo, {
									title: '授信结果信息',
									buttons: ['关闭'],
									size: ['1050px', '560px'],
									callbacks: []
								});
							}
						});
				} else {
					jfLayer.alert("请输入授信额度！");
				}
			} else if ($scope.adjustType == '3' || $scope.adjustType == '5') {
				if (!$scope.creditLimit) {
					jfLayer.alert("请输入授信额度！");
				} else if (!$scope.limitEffectvDate) {
					jfLayer.alert("请输入临时额度生效日期！");
				} else if (!$scope.limitExpireDate) {
					jfLayer.alert("请输入临时额度失效日期！");
				} else {
					$scope.resInfo = {};
					$scope.resInfo.operationMode = $scope.operationMode;
					$scope.resInfo.operationModesInfo = $scope.operationModeInfo;
					$scope.resInfo.externalIdentificationNo = $scope.externalIdentificationNo;
					$scope.resInfo.customerNo = $scope.customerNoInfo;
					$scope.resInfo.creditNodeNo = $scope.creditNodeNo;
					$scope.resInfo.creditNodeNosInfo = $scope.creditNodeNoInfo;
					$scope.resInfo.tempLimitInfo = $scope.creditLimit;
					$scope.resInfo.startDateInfo = $scope.limitEffectvDate;
					$scope.resInfo.endDataInfo = $scope.limitExpireDate;
					$scope.resInfo.adjustTypeNum = $scope.adjustType;
					if ($scope.currencyCode == '156') {
						$scope.resInfo.currencyCodeInfo = '人民币';
					} else if ($scope.currencyCode == '840') {
						$scope.resInfo.currencyCodeInfo = '美元';
					}
					if ($scope.adjustType == '1') {
						$scope.resInfo.adjustTypeInfo = '永额调升';
					} else if ($scope.adjustType == '2') {
						$scope.resInfo.adjustTypeInfo = '永额调降';
					} else if ($scope.adjustType == '3') {
						$scope.resInfo.adjustTypeInfo = '临额调升';
					} else if ($scope.adjustType == '4') {
						$scope.resInfo.adjustTypeInfo = '临额取消';
					} else if ($scope.adjustType == '5') {
						$scope.resInfo.adjustTypeInfo = '临额调降';
					}
					$scope.adjustParams = {
						authDataSynFlag: "1",
						operationMode: $scope.operationMode, //运营模式
						externalIdentificationNo: $scope.externalIdentificationNo, //外部识别号
						customerNo: $scope.customerNo, //客户号
						creditNodeNo: $scope.creditNodeNo, //调额节点
						adjustType: $scope.adjustType, //调额类型
						currencyCode: $scope.currencyCode, //币种
						creditLimit: $scope.creditLimit, //授信额度
						operatorId: $scope.userName, //操作员
						limitEffectvDate: $scope.limitEffectvDate, //生效日期
						limitExpireDate: $scope.limitExpireDate //失效日期
					};
					jfRest.request('quota', 'adjustCustomer', $scope.adjustParams)
						.then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.resInfo.returnCodeInfo = '成功';
								$scope.modal('/authorization/customerInfo/customerResultAdjust.html', $scope.resInfo, {
									title: '授信结果信息',
									buttons: ['关闭'],
									size: ['1050px', '560px'],
									callbacks: []
								});
							} else {
								$scope.resInfo.returnCodeInfo = '失败';
								$scope.resInfo.returnMsgInfo = data.returnMsg;
								$scope.modal('/authorization/customerInfo/customerResultAdjust.html', $scope.resInfo, {
									title: '授信结果信息',
									buttons: ['关闭'],
									size: ['1050px', '560px'],
									callbacks: []
								});
							}
						});
				}
			} else {
				$scope.resInfo = {};
				$scope.resInfo.operationMode = $scope.operationMode;
				$scope.resInfo.operationModesInfo = $scope.operationModeInfo;
				$scope.resInfo.externalIdentificationNo = $scope.externalIdentificationNo;
				$scope.resInfo.customerNo = $scope.customerNoInfo;
				$scope.resInfo.creditNodeNo = $scope.creditNodeNo;
				$scope.resInfo.creditNodeNosInfo = $scope.creditNodeNoInfo;
				$scope.resInfo.tempLimitInfo = $scope.creditLimit;
				$scope.resInfo.startDateInfo = $scope.limitEffectvDate;
				$scope.resInfo.endDataInfo = $scope.limitExpireDate;
				$scope.resInfo.adjustTypeNum = $scope.adjustType;
				if ($scope.currencyCode == '156') {
					$scope.resInfo.currencyCodeInfo = '人民币';
				} else if ($scope.currencyCode == '840') {
					$scope.resInfo.currencyCodeInfo = '美元';
				}
				if ($scope.adjustType == '1') {
					$scope.resInfo.adjustTypeInfo = '永额调升';
				} else if ($scope.adjustType == '2') {
					$scope.resInfo.adjustTypeInfo = '永额调降';
				} else if ($scope.adjustType == '3') {
					$scope.resInfo.adjustTypeInfo = '临额调升';
				} else if ($scope.adjustType == '4') {
					$scope.resInfo.adjustTypeInfo = '临额取消';
				} else if ($scope.adjustType == '5') {
					$scope.resInfo.adjustTypeInfo = '临额调降';
				}
				$scope.adjustParams = {
					authDataSynFlag: "1",
					operationMode: $scope.operationMode, //运营模式
					externalIdentificationNo: $scope.externalIdentificationNo, //外部识别号
					customerNo: $scope.customerNo, //客户号
					creditNodeNo: $scope.creditNodeNo, //调额节点
					adjustType: $scope.adjustType, //调额类型
					currencyCode: $scope.currencyCode, //币种
					creditLimit: $scope.creditLimit, //授信额度
					operatorId: $scope.userName, //操作员
					limitEffectvDate: $scope.limitEffectvDate, //生效日期
					limitExpireDate: $scope.limitExpireDate //失效日期
				};
				jfRest.request('quota', 'adjustCustomer', $scope.adjustParams)
					.then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.resInfo.returnCodeInfo = '成功';
							$scope.modal('/authorization/customerInfo/customerResultAdjust.html', $scope.resInfo, {
								title: '授信结果信息',
								buttons: ['关闭'],
								size: ['1050px', '560px'],
								callbacks: []
							});
						} else {
							$scope.resInfo.returnCodeInfo = '失败';
							$scope.resInfo.returnMsgInfo = data.returnMsg;
							$scope.modal('/authorization/customerInfo/customerResultAdjust.html', $scope.resInfo, {
								title: '授信结果信息',
								buttons: ['关闭'],
								size: ['1050px', '560px'],
								callbacks: []
							});
						}
					});
			}
		};
		//关闭事件====
		$scope.closeTwoInfo = function() {
			$scope.resultInfo = false;
			$scope.quotaListB = "";
			$scope.nodeTable = "";
			$scope.limitExpireDate = "";
			$scope.limitEffectvDate = "";
			$scope.creditLimit = "";
			$scope.currencyCode = "";
			$scope.adjustType = "";
			$scope.creditTypeInfo = "";
			$scope.accountIdInfo = "";
			$scope.customerNoInfo = "";
			$scope.tempInfo = false;
		}
	});
//   因用同一个页面  暂时注释   如果启用    重新写
//	webApp.controller('adjustResultInfoCtrl', function($scope, $stateParams, jfRest,
//		$http, jfGlobal, $rootScope, jfLayer, $location) {
//		$scope.showNodeResult = false; //应用节点表
//		$scope.isNO = false;
//		$scope.tempResult = false;
//		if ($scope.resInfo.returnCodeInfo == '失败') {
//			$scope.isNO = true;
//		} else {
//			$scope.isNO = false;
//		}
//		if ($scope.resInfo.adjustTypeNum == '1' || $scope.resInfo.adjustTypeNum == '2' || $scope.resInfo.adjustTypeNum ==
//			'4') {
//			$scope.tempResult = false;
//		} else if ($scope.resInfo.adjustTypeNum == '3' || $scope.resInfo.adjustTypeNum == '5') {
//			$scope.tempResult = true;
//		}
//
//		$scope.quotaPs = {
//			authDataSynFlag: "1",
//			customerNo: $scope.resInfo.customerNo,
//			externalIdentificationNo: $scope.resInfo.externalIdentificationNo,
//			operationMode: $scope.resInfo.operationMode,
//			creditNodeNo: $scope.resInfo.creditNodeNo,
//			adjustFlag: 'Y'
//		}
//		jfRest.request('cusInfo', 'query', $scope.quotaPs)
//			.then(function(data) {
//				if (data.returnMsg == 'OK') {
//					$scope.quotaResultListB = data.returnData.rows;
//				} else {
//					jfLayer.alert("额度信息有误！" + data.returnMsg);
//				}
//			});
//
//		/*$scope.quotaResultListB = {
//                checkType : '',
//                 params : {
//                	authDataSynFlag:"1",
//     				customerNo:$scope.resInfo.customerNo,
//     				externalIdentificationNo:$scope.resInfo.externalIdentificationNo,
//     				operationMode:$scope.resInfo.operationMode,
//     				creditNodeNo:$scope.resInfo.creditNodeNo,
//     				adjustFlag:'Y'
//                 }, // 表格查询时的参数信息
//                 paging : false,// 默认true,是否分页
//                 resource : 'cusInfo.query',// 列表的资源
//                 autoQuery : false,
//                 callback : function(data) { // 表格查询后的回调函数
//                 }
//            };*/
//		$scope.nodeTables = {
//			checkType: '',
//			params: {
//				"authDataSynFlag": "1",
//			}, // 表格查询时的参数信息
//			paging: false, // 默认true,是否分页
//			resource: 'cusInfo.query', // 列表的资源
//			autoQuery: false,
//			callback: function(data) { // 表格查询后的回调函数
//			}
//		};
//		//点击应用节点
//		$scope.resultElmInfo = function(item) {
//			$scope.creditNodeNoInfo = angular.fromJson(item).creditDesc;
//			$scope.showNodeResult = true; //应用节点表
//			$scope.nodeTables.params.customerNo = angular.fromJson(item).customerNo;
//			$scope.nodeTables.params.creditNodeNo = angular.fromJson(item).creditNodeNo;
//			$scope.nodeTables.search();
//		}
//	});
});
