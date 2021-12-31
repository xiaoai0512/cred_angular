'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户信息建立
	webApp.controller('fastBuildCardCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);			
		//客户信息对象
						$scope.cstInfDiv = true;// 客户信息建立
						$scope.proInfDiv = false;// 产品信息建立
						$scope.mediaInfDiv = false;// 产品信息建立
						// 客户基本信息:客户地址
						$scope.cstAddrList = [];
						$scope.cstAddrObj = {};
						//客户基本信息: 备注
						$scope.cstRmrkList = [];
						$scope.cstRmrkObj = {};
						// 机构号查询
						$scope.institutionIdArr = {
							type : "dynamic",
							param : {},// 默认查询条件
							text : "organName", // 下拉框显示内容，根据需要修改字段名称
							value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
							resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
							callback : function(data) {
							}
						};
						// 运营模式
						$scope.operationModeArr = {
							type : "dynamic",
							param : {},// 默认查询条件
							text : "modeName", // 下拉框显示内容，根据需要修改字段名称
							value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
							resource : "operationMode.query",// 数据源调用的action
							callback : function(data) {
							}
						};
						// 住宅性质
						$scope.ResidenceeArray = [ {name : '自购',id : '1'}, {name : '借住',id : '2'}, {name : '租用',id : '3'} ];
						// 证件类型
						$scope.certificateTypeArray = [ {name : '身份证',id : '1'} ];
						// 职称级别
						$scope.jobLevelCodeArray = [ {name : '高',id : '1'}, {name : '中',id : '2'}, {name : '初',id : '3'} ];
						// 担保人标识
						$scope.guarantorLogoArray = [ {name : '无担保',id : '1'}, {name : '已存在',id : '2'}, {name : '有潜在',id : '3'} ];
						// 婚姻
						$scope.maritalStatusArray = [ {name : '未婚',id : '1'}, {name : '已婚',id : '2'}, {name : '离异',id : '3'}, {name : '未知',id : '4'} ];
						// 性别
						$scope.genderArray = [ {name : '女',id : '1'}, {name : '男',id : '2'}, {name : '未知',id : '3'} ];
						// 地址场景
						$scope.typeArray = [ {name : '邮寄地址',id : '1'}, {name : '家庭地址',id : '2'}, {name : '单位地址',id : '3'} ];
						// 全额罚息标志
						$scope.fullPenaltySign = [ {name : '全额罚息',id : 'Y'}, {name : '非全额罚息',id : 'N'} ];
						// 个人公司标识
						$scope.personalCompanyType = [ {name : '个人客户',id : '1'}, {name : '公司客户',id : '2'} ];
						// 购汇还款标志
						//$scope.purchRemittSign = [ {name : '无购汇还款',id : 'N'}, {name : '购汇还款',id : 'Y'} ];
						// 约定扣款方式
						$scope.achFlag = [ {name : '无约定扣款',id : '0'}, {name : '账单余额',id : '1'}, {name : '最低还款额',id : '2'} ];
						// 本行他行标识
						$scope.ddType = [ {name : '本行',id : '0'}, {name : '他行',id : '1'} ];
						// 购汇还款标志
						$scope.exchangePaymentFlagArray = [ {name : '购汇还款',id : 'Y'}, {name : '无购汇还款',id : 'N'} ];
						// 还款选项
						$scope.paymentMarkArray = [ {name : '统一还款',id : '1'}, {name : '单独还款',id : '2'} ];
						// 账单日
						$scope.statementDateArr = [ {
							name : '01',id : '01'}, {name : '02',id : '02'},{name : '03',id : '03'}, {name : '04',id : '04'}, {name : '05',id : '05'}, 
							{name : '06',id : '06'}, {name : '07',id : '07'}, {name : '08',id : '08'}, {name : '09',id : '09'}, {name : '10',id : '10'}, 
							{name : '11',id : '11'}, {name : '12',id : '12'}, {name : '13',id : '13'}, {name : '14',id : '14'}, {name : '15',id : '15'}, 
							{name : '16',id : '16'}, {name : '17',id : '17'}, {name : '18',id : '18'}, {name : '19',id : '19'}, {name : '20',id : '20'},
							{name : '21',id : '21'}, {name : '22',id : '22'}, {name : '23',id : '23'}, {name : '24',id : '24'}, {name : '25',id : '25'},
							{name : '26',id : '26'}, {name : '27',id : '27'}, {name : '28',id : '28'}, {name : '29',id : '29'}, {name : '30',id : '30'}, 
							{name : '31',id : '31'} ];
						$scope.showNewAdrInfo = true;// 客户地址信息新增 默认显示新增地址
						$scope.showCstRmrkInfo = false;// 客户备注信息新增
						$scope.showCstPrcgLblInfo = false;// 客户定价标签信息新增
						// 客户地址信息 保存
						$scope.adrlInfTable = [];
						$scope.adrlInfTableInfoObj = {};
						$scope.saveNewAdrInfo = function() {
							var adrlInfTableInfoU = {};
							adrlInfTableInfoU.type = $scope.adrlInfTableInfoObj.type;
							adrlInfTableInfoU.contactAddress = $scope.adrlInfTableInfoObj.contactAddress;
							adrlInfTableInfoU.contactPostCode = $scope.adrlInfTableInfoObj.contactPostCode;
							adrlInfTableInfoU.contactMobilePhone = $scope.adrlInfTableInfoObj.contactMobilePhone;
							adrlInfTableInfoU.city = $scope.adrlInfTableInfoObj.city;
							// 翻译
							if (adrlInfTableInfoU.type == 1) {
								adrlInfTableInfoU.typeTrans = "邮寄地址";
							} else if (adrlInfTableInfoU.type == 2) {
								adrlInfTableInfoU.typeTrans = "家庭地址";
							} else if (adrlInfTableInfoU.type == 3) {
								adrlInfTableInfoU.typeTrans = "单位地址";
							}
							$scope.adrlInfTable.push(adrlInfTableInfoU);
							$scope.adrlInfTableInfoObj = {};
							$scope.showNewAdrInfo = false;
						};
						// 客户备注信息模块 保存
						$scope.cstRmrkInfoTable = [];
						$scope.cstRmrkInfoObj = {};
						$scope.saveCstRmk = function() {
							var cstRmrkInfoObjU = {};
							cstRmrkInfoObjU.remarkInfo = $scope.cstRmrkInfoObj.remarkInfo;
							cstRmrkInfoObjU.lastUpdateUserid = $scope.cstRmrkInfoObj.lastUpdateUserid;
							cstRmrkInfoObjU.createRemarksTime = $scope.cstRmrkInfoObj.createRemarksTime;
							$scope.cstRmrkInfoTable.push(cstRmrkInfoObjU);
							$scope.cstRmrkInfoObj = {};
							$scope.showCstRmrkInfo = false;
						};
						/*
						 * //客户定价信息模块 保存 $scope.cstPrcgLblTable = [];
						 * $scope.cstPrcgLblInfoObj = {}; $scope.saveCstPrice =
						 * function() { var cstPrcgLblInfObjU = new Object();
						 * cstPrcgLblInfObjU.productLineCode =
						 * $scope.cstPrcgLblInfoObj.productLineCode;
						 * cstPrcgLblInfObjU.pricingObject =
						 * $scope.cstPrcgLblInfoObj.pricingObject;
						 * cstPrcgLblInfObjU.pricingObjectCode =
						 * $scope.cstPrcgLblInfoObj.pricingObjectCode;
						 * cstPrcgLblInfObjU.pricingTag =
						 * $scope.cstPrcgLblInfoObj.pricingTag;
						 * cstPrcgLblInfObjU.custTagEffectiveDate =
						 * $scope.cstPrcgLblInfoObj.custTagEffectiveDate;
						 * cstPrcgLblInfObjU.custTagExpirationDate =
						 * $scope.cstPrcgLblInfoObj.custTagExpirationDate; //翻译
						 * if(cstPrcgLblInfObjU.currency == "CNY"){
						 * cstPrcgLblInfObjU.currencyTrans = "人民币"; }else
						 * if(cstPrcgLblInfObjU.currency == "USD"){
						 * cstPrcgLblInfObjU.currencyTrans = "美元"; }
						 * $scope.cstPrcgLblTable.push(cstPrcgLblInfObjU);
						 * $scope.cstPrcgLblInfoObj = {};
						 * 
						 * $scope.showCstPrcgLblInfo = false;
						 *  }
						 */
						// 提交;
						//业务类型
						$scope.cstBaseInf = {businessType:'0'};
						$scope.subCsInfParams = {};
						$scope.submitHandle = function() {
							if ($scope.adrlInfTable && $scope.adrlInfTable.length > 0) {
								$scope.subCsInfParams.coreCoreCustomerAddrs = $scope.adrlInfTable;// 地址信息list
								if ($scope.cstRmrkInfoTable && $scope.cstRmrkInfoTable.length > 0) {
									$scope.subCsInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;// 备注信息list
								} else {
									$scope.cstRmrkInfoTable = null;
									$scope.subCsInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;
								}
								$scope.subCsInfParams = Object.assign($scope.subCsInfParams, $scope.cstBaseInf);
								jfRest.request('cstInfBuild', 'save',$scope.subCsInfParams).then(function(data) {
									if (data.returnCode == '000000') {
										$rootScope.idNumber = data.returnData.rows[0].idNumber;
										$rootScope.customerNo = data.returnData.rows[0].customerNo;
										jfLayer.success("保存成功");
										//按钮样式
										$("#nextBtn1").css({backgroundColor : "#2998DC"});
										$('#nextBtn1').attr("disabled",false);
									}
								});
							} else {
								jfLayer.fail("请至少输入一种地址信息");// 地址必输入一条
                            }
                        };
						// 地址 新增按钮
						$scope.newAdrBtn = function() {
							$scope.showNewAdrInfo = !$scope.showNewAdrInfo;
						};
						// 备注 新增按钮
						$scope.cstRmrkInfoBtn = function() {
							$scope.showCstRmrkInfo = !$scope.showCstRmrkInfo;
						};
						/* 上一步，下一步 */
						// 进入客户基本信息
						$scope.pre = function() {
							$scope.cstInfDiv = true;// 客户信息建立
							$scope.proInfDiv = false;// 产品信息建立
							$scope.chooseProList.params.customerNo = $rootScope.customerNo;
							$scope.chooseProList.search();// 查询所有产品
							$scope.searchProCstInfo($rootScope.idNumber);// 查询客户信息
							$("#nextBtn1").css({
								backgroundColor : "#2998DC"
							});
							$('#nextBtn1').attr("disabled", false);
						};
						// 进入产品信息
						$scope.pre2 = function() {
							$scope.proInfDiv = true;// 产品信息建立
							$scope.mediaInfDiv = false;// 媒介信息建立
							$scope.searchMdmInfEstbInfo($rootScope.idNumber);
							$scope.chooseProList.params.customerNo = $rootScope.customerNo;
							$scope.chooseProList.search();// 查询所有产品
							$("#nextBtn2").css({backgroundColor : "#2998DC"});
							$('#nextBtn2').attr("disabled", false);
						};
						// 进入产品信息
						$scope.next = function() {
							$scope.cstInfDiv = false;// 客户信息建立
							$scope.proInfDiv = true;// 产品信息建立
							$scope.searchProCstInfo($rootScope.idNumber);
						};
						// 进入媒介信息
						$scope.next2 = function() {
							$scope.proInfDiv = false;// 产品信息建立
							$scope.mediaInfDiv = true;// 媒介信息建立
							// $scope.CSTidNumber = $scope.csInf.idNumber;
							$scope.searchMdmInfEstbInfo($rootScope.idNumber);
						};
						/* =========================产品信息建立============== */
						// 自定义下拉框
						$scope.directDebitStatusArray = [ {name : '未设置',id : '0'}, {name : '已设置',id : '1'} ];// 约定扣款状态
						$scope.directDebitModeArray = [ {name : '最小还款',id : '0'}, {name : '全额还款',id : '1'} ];// 约定扣款方式
						// $scope.showPDInfEstbInfoBtn = false;
						// 客户已有产品信息
						$scope.havedProList = {
							params : {
								"pageSize" : 10,
								"indexNo" : 0,
								customerNo : ''
							}, // 表格查询时的参数信息
							paging : true,// 默认true,是否分页
							resource : 'cstProduct.quereyProInf',// 列表的资源
							callback : function(data) { // 表格查询后的回调函数
							}
						};
						// 产品中选择产品对象
						$scope.chooseProList = {
							checkType : 'radio', // 
							params : {
								pageSize : 10,
								indexNo : 0,
							}, // 表格查询时的参数信息
							paging : true,// 默认true,是否分页
							resource : 'pDInfEstb.queryProd',// 列表的资源
							callback : function(data) { // 表格查询后的回调函数
							}
						};
						// 媒介中已有产品对象
						$scope.mediahavedProList = {
							checkType : 'radio', // 
							params : {
								pageSize : 10,
								indexNo : 0,
							}, // 表格查询时的参数信息
							paging : true,// 默认true,是否分页
							resource : 'cstMediaList.queryProduct',// 列表的资源
							callback : function(data) { // 表格查询后的回调函数
							}
						};
						// 进入产品建立页面，先查询客户基本信息，然后客户已有产品，然后再建立新产品
						$scope.searchProCstInfo = function(idNumber) {
							$scope.paramss = {
								idNumber : idNumber,
							};
							// 查询客户信息
							jfRest.request('cstInfQuery', 'queryInf',$scope.paramss).then(function(data) {
								if (data.returnCode == '000000') {
									if (data.returnData.rows[0].customerNo == null || data.returnData.rows[0].customerNo == undefined) {
										jfLayer.alert("抱歉，用户创建失败！");
									} else {
										$scope.proInf.idNumber = data.returnData.rows[0].idNumber;
										$scope.proInf.mobilePhone = data.returnData.rows[0].mobilePhone;
										$scope.proInf.customerName = data.returnData.rows[0].customerName;
										$scope.proInf.operationMode = data.returnData.rows[0].operationMode;
										$scope.proInf.customerNo = data.returnData.rows[0].customerNo;
										$scope.havedProList.params.customerNo = data.returnData.rows[0].customerNo;
										$scope.havedProList.search();// 查询已有产品
										$scope.chooseProList.params.customerNo = data.returnData.rows[0].customerNo;
										$scope.chooseProList.search();// 查询所有产品
									}
								}
							});
						};
						// 保存 客户产品单元新建
						$scope.proInf = {
							directDebitStatus : "",
							directDebitMode : "",
							exchangePaymentFlag : "",
							directDebitBankNo : "",
							directDebitAccountNo : "",
							coBrandedNo : ""
						};
						//保存产品信息
						$scope.saveCustomerProduct = function() {
							var jointNameCode = document.getElementById('coBrandedNo').value;
							if ($scope.havedProList.data) {
								if ($scope.havedProList.data.length >= 1) {
									jfLayer.alert("抱歉，一键制卡不能选择多种产品！");
									return;
                                }
                            }
                            $scope.sparamss = $scope.proInf;
							var	checkedItem = $scope.chooseProList.checkedList();
							$scope.saveparamss = Object.assign($scope.sparamss,checkedItem);
							jfRest.request('cstProduct', 'saveCstProduct',$scope.saveparamss).then(function(data) {
								if (data.returnCode == '000000') {
									jfLayer.success("保存成功");
									$scope.havedProList.search();// 产品信息建立中，查询已有产品
									$("#nextBtn2").css({backgroundColor : "#2998DC"});
									$('#nextBtn2').attr("disabled", false);
								}
							});
						};
						/* ============================媒介信息建立========================= */
						$scope.mediaOtherDiv = true;// 媒介建立中，基本信息以外内容
						// 主附标识
						$scope.mainAttachmentArray = [ {name : '主卡',id : '1'}, {name : '附属卡',id : '2'} ];
						$scope.mediaObjectCodeList = [ {name : '磁条卡',id : 'MODM00001'}, {name : '芯片卡',id : 'MODM00002'}, {name : '虚拟卡',id : 'MODM00010'} ];
						$scope.cardMakingResult = [ {name : '是',id : '1'}, {name : '否',id : ' '} ];
						// 媒介基本信息与制卡信息
						$scope.mdmInfEstbInfo = {};
						// 客户基本信息对象
						$scope.csInf = {};
						// 查询基本信息对象
						$scope.csInfParams = {};
						$scope.showCardNo = false;// 卡号隐藏
						$scope.showLblInfo = false;// 隐藏新增标签信息
						// 查询客户基本信息查询
						$scope.mediaCstInf = {};
						$scope.searchMdmInfEstbInfo = function(idNumber) {
							$scope.csInfParams = {
								idNumber : idNumber
							};
							// 媒介列表查询客户基本信息
							jfRest.request('cstInfQuery', 'queryInf',$scope.csInfParams).then(function(data) {
									if (data.returnCode == '000000') {
										$scope.mediaCstInf.customerNo = data.returnData.rows[0].customerNo;
										$scope.mediaCstInf.customerName = data.returnData.rows[0].customerName;
										$scope.mediaCstInf.idNumber = data.returnData.rows[0].idNumber;
										$scope.mdmInfEstbInfo.mainCustomerCode = data.returnData.rows[0].customerNo;
										// ===========================查询产品对象信息===============================
										//$scope.existProParams.selPDObjTableInd = "1";
										//媒介信息中，查询已有产品
										$scope.mediahavedProList.params.idNumber = data.returnData.rows[0].idNumber;
										$scope.mediahavedProList.params.selPDObjTableInd = '1';
										$scope.mediahavedProList.search();
									} 
								});
						};
						// 媒介对象控制制卡请求
						layui.form.on('select(getRiskLimits)',function(event) {
							if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00001") {
								$scope.mdmInfEstbInfo.requestCardMaking = "1";
							} else if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00002") {
								$scope.mdmInfEstbInfo.requestCardMaking = "1";
							} else {
								$scope.mdmInfEstbInfo.requestCardMaking = " ";
							}
						});
						//地址类型 新增
						$scope.newAdrBtn = function() {
							$scope.showNewAdrInfo = !$scope.showNewAdrInfo;
						};
						// 新增客户定价标签信息按钮
						$scope.lblInfBtn = function() {
							$scope.showLblInfo = !$scope.showLblInfo;
						};
						$scope.lblInfTable = [];
						$scope.lblInfTableInfo = {};
						$scope.coreMediaLabelInfos = [];
						//标签信息保存
						$scope.savelblInf = function() {
							var lblInfTableInfo = {};
							lblInfTableInfo.labelNumber = $scope.lblInfTableInfo.labelNumber;
							lblInfTableInfo.mediaTagEffectiveDate = $scope.lblInfTableInfo.mediaTagEffectiveDate;
							lblInfTableInfo.mediaTagEffectiveDate = $scope.lblInfTableInfo.mediaTagEffectiveDate;
							$scope.coreMediaLabelInfos.push(lblInfTableInfo);
							$scope.lblInfTableInfo = {};
							$scope.showLblInfo = false;
						};
						//媒介提交
						$scope.submitMediaInf = function() {
							if ($scope.mdmInfEstbInfo.mainAttachment == 2) {
								if (!$scope.mdmInfEstbInfo.subCustomerNo) {
									jfLayer.alert("请填写副客户代码！");
									return;
								}
                            }
                            if(!$scope.mediahavedProList.validCheck() ){//选择已有产品
								return;
                            }
                            if ($scope.lblInfTable.length != 0) {//标签
								$scope.mdmInfEstbInfo.CoreMediaLabelInformations = $scope.lblInfTable;
							}
							$scope.havedProObj = $scope.mediahavedProList.checkedList();
							$scope.mdmInfEstbInfo = Object.assign($scope.mdmInfEstbInfo, $scope.mediaCstInf);
							$scope.mdmInfEstbInfo = Object.assign($scope.mdmInfEstbInfo, $scope.havedProObj);
							$scope.mdmInfEstbInfo.mainCustomerNo = $scope.mediaCstInf.customerNo;
							jfRest.request('cstMediaList', 'submitMdmInfo',$scope.mdmInfEstbInfo).then(function(data) {
									if (data.returnCode == '000000') {
										$scope.csInfParams.externalIdentificationNo = data.returnData.rows[0].externalIdentificationNo;
										$scope.csInfParams.mediaObjectCode = data.returnData.rows[0].mediaObjectCode;
										$scope.csInfParams.mediaUnitCode = data.returnData.rows[0].mediaUnitCode;
										$scope.mdmInfEstbInfo = {};
										$scope.lblInfTable = [];
										$scope.showLblInfo = false;//隐藏新增标签信息
										$scope.showCardNo = true;
										jfLayer.success("媒介信息建立成功!");
										$scope.mediaOtherDiv = false;//媒介建立中，基本信息以外内容
										$scope.mdmInfEstbInfo = {};
									} 
								});
						};
					});
});
