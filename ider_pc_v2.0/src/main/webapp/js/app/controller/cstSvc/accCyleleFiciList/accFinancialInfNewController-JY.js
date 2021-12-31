'use strict';
define(function(require) {
	var webApp = require('app');
	//账户金融交易查询
	webApp.controller('accFinancialInfNewCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.operationMode = lodinDataService.getObject("operationMode");//运营模式
//    	console.log( lodinDataService.getObject("menuName"));
		$scope.isShow = false;
    	//搜索身份证类型
		$scope.certificateTypeArray1 = 
			[ {name : T.T('F00113'),id : '1'},//身份证
			  {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
			  {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
			  {name : T.T('F00116') ,id : '4'} ,//中国护照
			  {name : T.T('F00117') ,id : '5'} ,//外国护照
			  {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
	  //联动验证
	  var form = layui.form;
	  form.on('select(getIdType)',function(data){
		$scope.queryAccountForm.idNumber = '';  
	  	if(data.value == "1"){//身份证
	  		$("#accFina_idNumber").attr("validator","id_idcard");
	  	}else if(data.value == "2"){//港澳居民来往内地通行证
	  		$("#accFina_idNumber").attr("validator","id_isHKCard");
	  	}else if(data.value == "3"){//台湾居民来往内地通行证
	  		$("#accFina_idNumber").attr("validator","id_isTWCard");
	  	}else if(data.value == "4"){//中国护照
	  		$("#accFina_idNumber").attr("validator","id_passport");
	  	}else if(data.value == "5"){//外国护照passport
	  		$("#accFina_idNumber").attr("validator","id_passport");
	  	}else if(data.value == "6"){//外国人永久居留证
	  		$("#accFina_idNumber").attr("validator","id_isPermanentReside");
	  	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
	  		$("#accFina_idNumber").attr("validator","noValidator");
	  		$scope.accFinaForm.$setPristine();
	  		$("#accFina_idNumber").removeClass("waringform ");
        }
      });
		// 重置
		$scope.reset = function() {
			$scope.queryAccountForm.idNumber= '';
			$scope.queryAccountForm.externalIdentificationNo= '';
			$scope.queryAccountForm.idType= '';
			$scope.isShowAccountList =false;
			$("#accFina_idNumber").attr("validator","noValidator");
			$("#accFina_idNumber").removeClass("waringform ");
		};
		//查询按钮，查询账户列表
		$scope.searchAccount = function(){
			if(($scope.queryAccountForm.idType == null || $scope.queryAccountForm.idType == ''|| $scope.queryAccountForm.idType == undefined) &&
					($scope.queryAccountForm.idNumber == null || $scope.queryAccountForm.idNumber == undefined || $scope.queryAccountForm.idNumber == "") &&
					($scope.queryAccountForm.externalIdentificationNo == null || $scope.queryAccountForm.externalIdentificationNo == undefined || $scope.queryAccountForm.externalIdentificationNo == "")){
				jfLayer.fail(T.T('F00076'));//"输入查询条件"
			}
			else {
				if($scope.queryAccountForm["idType"]){
					if($scope.queryAccountForm["idNumber"] == null || $scope.queryAccountForm["idNumber"] == undefined || $scope.queryAccountForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
						$scope.accountInfTrue = false;
					}else {
						$scope.isShowWindow($scope.queryAccountForm);
					}
				}else if($scope.queryAccountForm["idNumber"]){
					if($scope.queryAccountForm["idType"] == null || $scope.queryAccountForm["idType"] == undefined || $scope.queryAccountForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
						$scope.accountInfTrue = false;
					}else {
						$scope.isShowWindow($scope.queryAccountForm);
					}
				}else {
					$scope.isShowWindow($scope.queryAccountForm);
				}
			}
		};
		//循环账户信息表
		$scope.revoleAccList = {
				//checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					"accountOrganForm": "R"//循环账户
				},
				paging : true,
				resource : 'accBscInf.queryRevoleAccList',
				autoQuery:false,
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.isShowAccountList = true;//账户信息表
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
		//溢缴款账户表
		$scope.overdueAccList = {
		//	checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				operationMode : $scope.operationMode
			},
			paging : true,
			resource : 'accBscInf.queryOverdueAccList',
			autoQuery:false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowAccountList = true;//账户信息表
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//交易账户列表
		$scope.transAccList = {
		//		checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					//"accountOrganForm": "S"//单笔账户
				},
				paging : true,
				resource : 'accBscInf.queryTransAccList',
				autoQuery:false,
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.isShowAccountList = true;//账户信息表
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
		//争议账户列表
		$scope.disputeAccList = {
		//		checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				},
				paging : true,
				resource : 'accBscInf.queryDisputeAccList',
				autoQuery:false,
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.isShowAccountList = true;//账户信息表
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
		//点击查询，根据返回结果，弹窗他、，然后弹窗中，再正常调取
		$scope.isShowWindow = function(params){
			//循环账户表
			$scope.revoleAccList.params = $.extend($scope.revoleAccList.params,params);
			$scope.revoleAccList.search();
			//溢缴款账户表
			$scope.overdueAccList.params = $.extend($scope.overdueAccList.params,params);
			$scope.overdueAccList.search();
			//交易账户表
			$scope.transAccList.params = $.extend($scope.transAccList.params,params);
			$scope.transAccList.search();
			//争议账户表
			$scope.disputeAccList.params = $.extend($scope.disputeAccList.params,params);
			$scope.disputeAccList.search();
		};
		//查询循环账户列表
		$scope.viewRevoleAccInf = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.item.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
			$scope.item.operationMode = $scope.operationMode;
			$scope.modal('/cstSvc/acbaUnitList/layerAccFinancial.html', $scope.item, {
				title : "账户金融信息",
				buttons : [T.T('F00108')],//'确认','取消' 
				size : [ '1100px', '600px' ],
				callbacks : [ ]
			});
		};
		//查询溢缴款账户
		$scope.viewOverdueAccInf = function(item){
			$scope.itemInfo = $.parseJSON(JSON.stringify(item));
			$scope.itemInfo.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
			// 页面 查询构件(弹出页面)
			$scope.modal('/cstSvc/accInfMgt/viewDepositInf.html', $scope.itemInfo, {
				title : T.T('KHJ4300001'),//'存款账户详细信息',
				buttons : [T.T('F00012')],// '关闭' 
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//查询交易账户信息详情
		$scope.viewTransAcc = function(item){
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(item));
			$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.queryAccountForm);
			$scope.modal('/cstSvc/acbaUnitList/layerCreditTradeAcc.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]  
			});
		};
		//查询争议账户表
		$scope.viewDisputeAccInf = function(item){
			$scope.disputeInf = $.parseJSON(JSON.stringify(item));
			$scope.disputeInf.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
			$scope.modal('/cstSvc/acbaUnitList/layerDisputeInf.html',$scope.disputeInf, {
					title : '争议账户详细信息',
					buttons : [ '原交易信息','争议释放有利于客户','争议释放有利于银行','调单申请/拒付管理','关闭' ],
					size : [ '1000px', '430px' ],
					callbacks : [$scope.orginTransInfo,$scope.disputeReleaseCst,$scope.disputeReleaseBank,$scope.searchApp]
				});
		};
		//原交易信息
		$scope.orginTransInfo = function(result){
			$scope.item = result.scope.disputeInf;
			$scope.item.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
			$scope.modal('/cstSvc/acbaUnitList/orginTransInfo.html',
					$scope.item, {
						title : '原交易信息详情',
						buttons : [ T.T('F00012') ],
						size : [ '1000px', '660px' ],
						callbacks : []
					});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(result){
			$scope.params = {
				"ecommEntryId" : result.scope.disputeInf.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : result.scope.disputeInf.oldGlobalSerialNumbr,
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success('争议释放有利于客户成功!');
					$scope.safeApply();
					result.cancel();
					$scope.disputeQueryTable.search();
				} else {
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank = function(result){
			$scope.params = {
				"ecommEntryId" : $scope.disputeInf.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : $scope.disputeInf.oldGlobalSerialNumbr,
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success('争议释放有利于银行成功!');
					$scope.safeApply();
					result.cancel();
					$scope.disputeQueryTable.search();
				} else {
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//调付申请/拒付管理
		$scope.searchApp = function(result) {
			if($scope.disputeInf.statusCode != "D" && $scope.disputeInf.statusCode != "C"){
				jfLayer.fail("当前争议账户状态不允许此操作");
				$scope.safeApply();
				result.cancel();
			}else{
				if($scope.disputeInf.statusCode == "D"){
					var cardBin = $scope.disputeInf.externalIdentificationNo.substring(3,9);
					$scope.queryParam = {
							binNo : cardBin,
							idType: $scope.disputeInf.idType,
							idNumber: $scope.disputeInf.idNumber,
							externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
					};
					jfRest.request('productLine','queryBin', $scope.queryParam).then(function(data) {
						if(data.returnData.rows == null){
							jfLayer.fail("未查询到有效数据！");
							$scope.safeApply();
							result.cancel();
							//return;
						}else{
							var cardScheme = data.returnData.rows[0].cardScheme;
							if(data.returnData.rows[0].cardScheme == "V" || data.returnData.rows[0].cardScheme == "M"){
								$scope.queryParam1 = {
										globalSerialNumber : $scope.disputeInf.oldGlobalSerialNumbr,
										idType: $scope.disputeInf.idType,
										idNumber: $scope.disputeInf.idNumber,
										externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
								};
								if(data.returnData.rows[0].cardScheme == "V"){
									jfRest.request('visannexTabInf','query', $scope.queryParam1).then(function(data) {
										if(data.returnData == null || data.returnData == ""){
											jfLayer.fail("VISA附加表不存在该交易信息");
											$scope.safeApply();
											result.cancel();
											//return;
										}
										$scope.data = data.returnData[0];
										$scope.appVisaFormInf = data.returnData[0];
										$scope.appMCFormInf = data.returnData[0];
										$scope.safeApply();
										result.cancel();
									});
								}else if(data.returnData.rows[0].cardScheme == "M"){
									jfRest.request('mcannexTabInf','query', $scope.queryParam1).then(function(data) {
										if(data.returnData == null || data.returnData == ""){
											jfLayer.fail("MC附加表不存在该交易信息");
											$scope.safeApply();
											result.cancel();
											//return;
										}
										$scope.data = data.returnData[0];
										$scope.data2 = data.returnData[1][0];
										$scope.appVisaFormInf = data.returnData[0];
										$scope.appMCFormInf = data.returnData[0];
										$scope.safeApply();
										result.cancel();
									});
								}
								$scope.queryParam2 = {
										globalTransSerialNoAuth : $scope.disputeInf.oldGlobalSerialNumbr,
										idType: $scope.disputeInf.idType,
										idNumber: $scope.disputeInf.idNumber,
										externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
								};
								$timeout(function() {
									jfRest.request('clearHitInf','query', $scope.queryParam2).then(function(data) {
										if(data.returnData == null || data.returnData == ""){
											jfLayer.fail("清算历史表不存在该交易信息");
											$scope.safeApply();
											result.cancel();
											//return;
										}
										if(cardScheme == "V"){
											$scope.data1 = data.returnData[0];
											$scope.appVisaFormInf = data.returnData[0];
											$scope.appVisaFormInf.acquirerBusinessId = $scope.data.acquirerBusinessId;
											$scope.appVisaFormInf.nationalReimburseFee = $scope.data.nationalReimburseFee;
											$scope.appVisaFormInf.accountSelection = $scope.data.accountSelection;
											$scope.appVisaFormInf.reimburseAttribute = $scope.data.reimburseAttribute;
											$scope.appVisaFormInf.transIdentifier = $scope.data.transIdentifier;
											$scope.appVisaFormInf.settlementFlag =  $scope.data.settlementFlag;
											$scope.appVisaFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
											$scope.appVisaFormInf.transactionCode = "52";
											$scope.appVisaFormInf.retrievalRequestId = "0";
											$scope.typeArray = [{name : "人工",id : '0'}, {name : "自动",id : '1'}];
											$scope.typeArray1 = [{name : "人工",id : '0'}, {name : "自动",id : '1'}];
											$scope.safeApply();
											result.cancel();
											$scope.modal('/cstSvc/disputeAccontInfo/confirmAppVisaForm.html',
													'', {
														title : 'VISA调单申请',
														buttons : [ '确认','关闭' ],
														size : [ '1000px', '600px' ],
														callbacks : [$scope.saveConfirmVisaApp]
													});
										}else if(cardScheme == "M"){
											$scope.data1 = data.returnData[0];
											$scope.appMCFormInf = data.returnData[0];
											$scope.appMCFormInf.processingCode = $scope.data2.processingCode;
											$scope.appMCFormInf.dateAndTime = $scope.data2.dateAndTime;
											$scope.appMCFormInf.posEntryMode = $scope.data2.posEntryMode;
											$scope.appMCFormInf.forwdInstitIdCode = $scope.data2.forwdInstitIdCode;
											$scope.appMCFormInf.retrievalReferNum = $scope.data2.retrievalReferNum;
											$scope.appMCFormInf.cardAcceptorName = $scope.data2.cardAcceptorName;
											$scope.appMCFormInf.settlementIndicator = $scope.data2.settlementIndicator;
											$scope.appMCFormInf.transLifeCycleId = $scope.data2.transLifeCycleId;
											$scope.appMCFormInf.messageNumber = $scope.data2.messageNumber;
											$scope.appMCFormInf.transOriginInstit = $scope.data2.transOriginInstit;
											$scope.appMCFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
											$scope.appMCFormInf.terminalType = $scope.data.P0023;
											$scope.appMCFormInf.messageReversalIndicator = $scope.data.P0025;
											$scope.appMCFormInf.electronicCommerceSecurityLevelIndicator = $scope.data.P0052;
											$scope.appMCFormInf.currencyExponents = $scope.data.P0148;
											$scope.appMCFormInf.currencyCodesAmountsOriginal = $scope.data.P0149;
											$scope.appMCFormInf.businessActivity = $scope.data.P0158;
											$scope.appMCFormInf.settlementIndicator = $scope.data.P0165;
											$scope.appMCFormInf.masterCardAssignedId = $scope.data.P0176;
											$scope.appMCFormInf.retrievalDocumentCode = $scope.data.P0228;
											$scope.appMCFormInf.exclusionRequestCode = 	$scope.data.P0260;
											$scope.appMCFormInf.documentationIndicator = $scope.data.P0262;
											$scope.appMCFormInf.functionCode = "603";
											$scope.appMCFormInf.mti = "1644";
											$scope.safeApply();
											result.cancel();
											$scope.modal('/cstSvc/disputeAccontInfo/confirmMCAppForm.html',
													'', {
														title : 'MC调单申请',
														buttons : [ '确认','关闭' ],
														size : [ '1000px', '600px' ],
														callbacks : [$scope.saveConfirmMCApp]
													});
										}else{
											jfLayer.fail("不允许调单申请");
											$scope.safeApply();
											result.cancel();
										}
									});
								},300);
							}else{
								jfLayer.fail("卡片不属VISA或Mastercard卡");
								$scope.safeApply();
								result.cancel();
							}
						}
					});
				}else if($scope.disputeInf.statusCode == "C"){
					var cardBin = $scope.disputeInf.externalIdentificationNo.substring(3,9);
					$scope.queryParam = {
							binNo : cardBin,
							idType: $scope.disputeInf.idType,
							idNumber: $scope.disputeInf.idNumber,
							externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
					};
					jfRest.request('productLine','queryBin', $scope.queryParam).then(function(data) {
						var cardScheme = data.returnData.rows[0].cardScheme;
						if(data.returnData.rows[0].cardScheme == "V" || data.returnData.rows[0].cardScheme == "M"){
							$scope.queryParam1 = {
									globalSerialNumber : $scope.disputeInf.oldGlobalSerialNumbr
							};
							if(data.returnData.rows[0].cardScheme == "V"){
								jfRest.request('visannexTabInf','query', $scope.queryParam1).then(function(data) {
									if(data.returnData == null || data.returnData == ""){
										jfLayer.fail("VISA附加表不存在该交易信息");
										$scope.safeApply();
										result.cancel();
										//return;
									}
									$scope.data = data.returnData[0];
									$scope.protestVisaFormInf = data.returnData[0];
									$scope.protestMCFormInf = data.returnData[0];
									$scope.safeApply();
									result.cancel();
								});
							}else if(data.returnData.rows[0].cardScheme == "M"){
								jfRest.request('mcannexTabInf','query', $scope.queryParam1).then(function(data) {
									if(data.returnData == null || data.returnData == ""){
										jfLayer.fail("MC附加表不存在该交易信息");
										$scope.safeApply();
										result.cancel();
										//return;
									}
									$scope.data = data.returnData[0];
									$scope.data2 = data.returnData[1][0];
									$scope.protestVisaFormInf = data.returnData[0];
									$scope.protestMCFormInf = data.returnData[0];
									$scope.safeApply();
									result.cancel();
								});
							}
							$scope.queryParam2 = {
									globalTransSerialNoAuth : $scope.disputeInf.oldGlobalSerialNumbr
							};
							$timeout(function() {
								jfRest.request('clearHitInf','query', $scope.queryParam2).then(function(data) {
									if(data.returnData == null || data.returnData == ""){
										jfLayer.fail("清算历史表不存在该交易信息");
										$scope.safeApply();
										result.cancel();
										//return;
									}
									if(cardScheme == "V"){
										$scope.data1 = data.returnData[0];
										$scope.protestVisaFormInf = data.returnData[0];
										$scope.protestVisaFormInf.acquirerBusinessId = $scope.data.acquirerBusinessId;
										$scope.protestVisaFormInf.nationalReimburseFee = $scope.data.nationalReimburseFee;
										$scope.protestVisaFormInf.reimburseAttribute = $scope.data.reimburseAttribute;
										$scope.protestVisaFormInf.transIdentifier = $scope.data.transIdentifier;
										$scope.protestVisaFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
										$scope.protestVisaFormInf.settlementFlag =  $scope.data.settlementFlag;
										$scope.protestVisaFormInf.requestedPaymentService = $scope.data.requestedPaymentService;
										$scope.protestVisaFormInf.authorizationCharacteristicsIndicator = $scope.data.authorizationCharacteristicsIndicator;
										$scope.protestVisaFormInf.internationalFeeIndicator = $scope.data.internationalFeeIndicator;
										$scope.protestVisaFormInf.feeProgramIndicator = $scope.data.feeProgramIndicator;
										$scope.protestVisaFormInf.mailPhoneElectronicCommerceAndPaymentIndicator = $scope.data.mailPhoneElectronicCommerceAndPaymentIndicator;
										$scope.protestVisaFormInf.prepaidCardIndicator = $scope.data.prepaidCardIndicator;
										$scope.protestVisaFormInf.authorizedAmount = $scope.data.authorizedAmount;
										$scope.protestVisaFormInf.authorizationCurrencyCode = $scope.data.authorizationCurrencyCode;
										$scope.protestVisaFormInf.authorizationResponseCode = $scope.data.authorizationResponseCode;
										$scope.protestVisaFormInf.multipleClearingSequenceNumber = $scope.data.multipleClearingSequenceNumber;
										$scope.protestVisaFormInf.multipleClearingSequenceCount = $scope.data.multipleClearingSequenceCount;
										$scope.protestVisaFormInf.dynamicCurrencyConversionIndicator = $scope.data.dynamicCurrencyConversionIndicator;
										$scope.protestVisaFormInf.transCodeQualifer = $scope.data.transCodeQualifer;
										$scope.typeArray = [{name : "15",id : '15'}, {name : "16",id : '16'}, {name : "17",id : '17'}, {name : "35",id : '35'},
										                    {name : "36",id : '36'}, {name : "37",id : '37'}];
										$scope.typeArray1 =  [{name : "部分金额退款-仅对美国有效",id : 'P'}];
										$scope.safeApply();
										result.cancel();
										$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestVisaForm.html',
												'', {
													title : 'VISA拒付管理',
													buttons : [ '确认','关闭' ],
													size : [ '1000px', '600px' ],
													callbacks : [$scope.saveConfirmVisaProtest]
												});
									}else if(cardScheme == "M"){
										$scope.data1 = data.returnData[0];
										$scope.protestMCFormInf = data.returnData[0];
										$scope.protestMCFormInf.processingCode = $scope.data2.processingCode;
										$scope.protestMCFormInf.dateAndTime = $scope.data2.dateAndTime;
										$scope.protestMCFormInf.posEntryMode = $scope.data2.posEntryMode;
										$scope.protestMCFormInf.dateExpiration = $scope.data2.dateExpiration;
										$scope.protestMCFormInf.forwdInstitIdCode = $scope.data2.forwdInstitIdCode;
										$scope.protestMCFormInf.retrievalReferNum = $scope.data2.retrievalReferNum;
										$scope.protestMCFormInf.serviceCode = $scope.data2.serviceCode;
										$scope.protestMCFormInf.cardAcceptorName = $scope.data2.cardAcceptorName;
										$scope.protestMCFormInf.transLifeCycleId = $scope.data2.transLifeCycleId;
										$scope.protestMCFormInf.messageNumber = $scope.data2.messageNumber;
										$scope.protestMCFormInf.transOriginInstit = $scope.data2.transOriginInstit;
										$scope.protestMCFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
										$scope.protestMCFormInf.terminalType = $scope.data.P0023;
										$scope.protestMCFormInf.messageReversalIndicator = $scope.data.P0025;
										$scope.protestMCFormInf.electronicCommerceSecurityLevelIndicator = $scope.data.P0052;
										$scope.protestMCFormInf.currencyExponents = $scope.data.P0148;
										$scope.protestMCFormInf.currencyCodesAmountsOriginal = $scope.data.P0149;
										$scope.protestMCFormInf.businessActivity = $scope.data.P0158;
										$scope.protestMCFormInf.settlementIndicator = $scope.data.P0165;
										$scope.protestMCFormInf.masterCardAssignedId  = $scope.data.P0176;
										$scope.protestMCFormInf.exclusionRequestCode = 	$scope.data.P0260;
										$scope.protestMCFormInf.documentationIndicator = $scope.data.P0262;
										$scope.typeArray = [{name : "全第一",id : '450'},{name : "完全仲裁",id : '451'},{name : "第一部分",id : '453'},{name : "部分仲裁",id : '454'}];
										$scope.protestMCFormInf.mti = "1442";
										$scope.safeApply();
										result.cancel();
										$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestMCForm.html',
												'', {
													title : 'MC拒付管理',
													buttons : [ '确认','关闭' ],
													size : [ '1000px', '600px' ],
													callbacks : [$scope.saveConfirmMCProtest]
												});
									}else{
										jfLayer.fail("不允许调单申请");
										$scope.safeApply();
										result.cancel();
										//return;
									}
								});
							},300);
						}else{
							jfLayer.fail("卡片不属VISA或Mastercard卡");
							$scope.safeApply();
							result.cancel();
							//return;
						}
					});
				}
			}
		};
		$scope.accBlanInfo = {};
		$scope.callback = function(result){
			if(!result.scope.itemList.validCheck()){
				return;
			}else {
				$scope.accInfo = result.scope.itemList.checkedList();
				$scope.accInfo.idType = $scope.queryAccountForm.idType;
				$scope.accInfo.idNumber = $scope.queryAccountForm.idNumber;
				$scope.accInfo.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
				$scope.accBlanInfo.accountId = $scope.accInfo.accountId;
				$scope.accBlanInfo.customerName = $scope.accInfo.customerName;
				$scope.accBlanInfo.statusCode = $scope.accInfo.statusCode;
				$scope.accBlanInfo.productObjectCode = $scope.accInfo.productObjectCode;
				$scope.accBlanInfo.nextBillDate = $scope.accInfo.nextBillDate;
				$scope.accBlanInfo.currencyCode = $scope.accInfo.currencyCode;
				$scope.accBlanInfo.currentCycleNumber = $scope.accInfo.currentCycleNumber;
				if($scope.accInfo.businessDesc){
					$scope.accBlanInfo.businessTypeCodeTrans = $scope.accInfo.businessTypeCode + $scope.accInfo.businessDesc;
				}else {
					$scope.accBlanInfo.businessTypeCodeTrans = $scope.accInfo.businessTypeCode;
                }
                if($scope.accInfo.productDesc){
					$scope.accBlanInfo.productObjectCodeTrans = $scope.accInfo.productObjectCode + $scope.accInfo.productDesc;
				}else {
					$scope.accBlanInfo.productObjectCodeTrans = $scope.accInfo.productObjectCode;
                }
                if($scope.accInfo.programDesc){
					$scope.accBlanInfo.businessProgramNoTrans = $scope.accInfo.businessProgramNo + $scope.accInfo.programDesc;
				}else {
					$scope.accBlanInfo.businessProgramNoTrans = $scope.accInfo.businessProgramNo;
                }
                $scope.accBlanInfo.organNo = $scope.accInfo.organNo;
				$scope.accBlanInfo.statusCode = $scope.accInfo.statusCode;
				//账户状态
				if($scope.accBlanInfo.statusCode==1){
					$scope.accBlanInfo.statusCodeTrans = "活跃账户";//"活跃账户";
				}else if($scope.accBlanInfo.statusCode==2){
					$scope.accBlanInfo.statusCodeTrans = "非活跃账户";//"非活跃账户";
				}else if($scope.accBlanInfo.statusCode==3){
					$scope.accBlanInfo.statusCodeTrans = "冻结账户";//"冻结账户";
				}else if($scope.accBlanInfo.statusCode==8){
					$scope.accBlanInfo.statusCodeTrans = "关闭账户";//"关闭账户";
				}else if($scope.accBlanInfo.statusCode==9){
					$scope.accBlanInfo.statusCodeTrans = "待删除账户";//"待删除账户";
                }
                $scope.queryParams= {
						idType:$scope.accInfo.idType,
						idNumber:$scope.accInfo.idNumber,
						externalIdentificationNo:$scope.accInfo.externalIdentificationNo,
						accountId:$scope.accInfo.accountId,
						currencyCode:$scope.accInfo.currencyCode,
						operationMode:$scope.accInfo.operationMode,
				};
				$scope.accCycleFiciList.params = $scope.queryParams;
				$scope.accCycleFiciList.search();
				$scope.queryTimeBalance($scope.accInfo);
				$scope.balObcList.params = $scope.queryParams;
				$scope.balObcList.search();
				$scope.accBalObjTable.params = $scope.queryParams;
				$scope.accBalObjTable.search();
				$scope.safeApply();
				result.cancel();
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
		//查询实时余额
		$scope.queryTimeBalance = function(item){
			//console.log(item);
			$scope.balanceParams = {
					authDataSynFlag: "1"
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			jfRest.request('acbaUnitList', 'queryBalance', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
					$scope.accBlanInfo.totalBalance = data.returnData.rows[0].totalBalance;
					$scope.accBlanInfo.currPrincipalBalance = data.returnData.rows[0].currPrincipalBalance;
					$scope.accBlanInfo.billPrincipalBalance = data.returnData.rows[0].billPrincipalBalance;
					$scope.accBlanInfo.currInterestBalance = data.returnData.rows[0].currInterestBalance;
					$scope.accBlanInfo.billInterestBalance = data.returnData.rows[0].billInterestBalance;
					$scope.accBlanInfo.currCostBalance = data.returnData.rows[0].currCostBalance;
					$scope.accBlanInfo.billCostBalance = data.returnData.rows[0].billCostBalance;
					$scope.accBlanInfo.customerName = data.returnData.rows[0].customerName;
					$scope.accBlanInfo.nextBillDate = data.returnData.rows[0].nextBillDate;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
					}
				}
			});
		};
		//账户余额单元信息
		$scope.balObcList = {
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
		};
		//账户余额对象信息
		$scope.accBalObjTable = {
			params : {},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			autoQuery:false,
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//账户周期金融信息
		$scope.accCycleFiciList = {
			params : {},
			paging : true,
			resource : 'accCycleFiciList.query',
			autoQuery:false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//余额单元弹窗查询  "本金""利息""费用"
		$scope.balanceTypeArray = [{id:"P",name:T.T('KHH4700036')},{id:"I",name:T.T('KHH4700037')},{id:"F",name:T.T('KHH4700038')}];
		$scope.checkAcUint = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/acbaDtlEnqr.html', $scope.item, {
				title : T.T('KHJ4700002'),//'余额单元明细',
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		//账户余额对象信息弹窗查询
		$scope.checkAcBaObj = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/layerAcObjDetail.html', $scope.item, {
				title : T.T('KHJ4700003'),//'余额对象明细',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		//账户周期金融明细弹窗
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/accCycleFiciList/accCycleFiciDetail.html', $scope.item, {
				title : T.T('KHJ4700004'),//'账户周期金融明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '450px' ],
				//callbacks : [ $scope.callback ]
			});
		};
	});
	webApp.controller('queryAccountCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.itemList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					"idType":$scope.queryAccountForm.idType,
					"idNumber":$scope.queryAccountForm.idNumber,
					"externalIdentificationNo":$scope.queryAccountForm.externalIdentificationNo,
				},
				paging : true,
				resource : 'accBscInf.query2',
				callback : function(data) {
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
	});
	//周期金融明细
	webApp.controller('accCycleFiciDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		if($scope.item.fullPaymentFlag=='Y'){
			$scope.item.fullPaymentFlagDesc = T.T('KHJ4700005');//"已满足";
		}else if($scope.item.fullPaymentFlag=='N'){
			$scope.item.fullPaymentFlagDesc = T.T('KHJ4700006');//"不满足";
		}
	});
	//余额单元
	webApp.controller('acbaUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
	//余额对象
	webApp.controller('accObjDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
	//交易明细查询  !
	webApp.controller('layerCreditTradeAccCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo = '撤銷';
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = '正常';
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = '逾期';
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = '结清';
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = '全额退货';
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = '人民币';
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = '美元';
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = '期末本息一次付清';
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = '按固定周期付息、到期还本';
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = '等额本息';
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = '等额本金';
		}
		else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = '等本等息';
		}
		else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = '首期一次性付息分期还本';
		}
		if($scope.itemDetailInf.loanType == 'MERH'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600009');//"商户分期";
		}else if($scope.itemDetailInf.loanType == 'TXAT'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600010');//"自动分期";
		}else if($scope.itemDetailInf.loanType == 'CASH'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600011');//"现金分期";
		}else if($scope.itemDetailInf.loanType == 'STMT'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600012');//"账单分期";
		}else if($scope.itemDetailInf.loanType == 'TRAN'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600013');//"交易分期";
		}else if($scope.itemDetailInf.loanType == 'LOAN'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600054');//"消费信贷";
		}else if($scope.itemDetailInf.loanType == 'APAY'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600155');//"随借随还";
        }
        $scope.paramsObj ={
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
		};
		jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.obj){
					$scope.totalBalance = data.returnData.obj.totalBalance;
				}else {
					$scope.totalBalance = 0;
				}
			}
		});
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
//				console.log(data);
			}
		};
	});
	//查询账户金融信息
	webApp.controller('layerAccFinancialCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.accInfItem = $scope.item;
		if($scope.accInfItem.businessDesc){
			$scope.accInfItem.businessTypeCodeTrans = $scope.accInfItem.businessTypeCode + $scope.accInfItem.businessDesc;
		}else {
			$scope.accInfItem.businessTypeCodeTrans = $scope.accInfItem.businessTypeCode;
        }
        if($scope.accInfItem.productDesc){
			$scope.accInfItem.productObjectCodeTrans = $scope.accInfItem.productObjectCode + $scope.accInfItem.productDesc;
		}else {
			$scope.accInfItem.productObjectCodeTrans = $scope.accInfItem.productObjectCode;
        }
        if($scope.accInfItem.programDesc){
			$scope.accInfItem.businessProgramNoTrans = $scope.accInfItem.businessProgramNo + $scope.accInfItem.programDesc;
		}else {
			$scope.accInfItem.businessProgramNoTrans = $scope.accInfItem.businessProgramNo;
        }
        //账户状态
		if($scope.accInfItem.statusCode==1){
			$scope.accInfItem.statusCodeTrans = "活跃账户";//"活跃账户";
		}else if($scope.accInfItem.statusCode==2){
			$scope.accInfItem.statusCodeTrans = "非活跃账户";//"非活跃账户";
		}else if($scope.accInfItem.statusCode==3){
			$scope.accInfItem.statusCodeTrans = "冻结账户";//"冻结账户";
		}else if($scope.accInfItem.statusCode==8){
			$scope.accInfItem.statusCodeTrans = "关闭账户";//"关闭账户";
		}else if($scope.accInfItem.statusCode==9){
			$scope.accInfItem.statusCodeTrans = "待删除账户";//"待删除账户";
        }
        //查询实时余额
		$scope.queryTimeBalance = function(item){
//			console.log(item);
			$scope.balanceParams = {
					authDataSynFlag: "1"
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			jfRest.request('acbaUnitList', 'queryBalance', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
//					console.log("accountId:"+data.returnData.rows[0].accountId);
					$scope.accountId = data.returnData.rows[0].accountId;
					$scope.totalBalance = data.returnData.rows[0].totalBalance;
					$scope.currPrincipalBalance = data.returnData.rows[0].currPrincipalBalance;
					$scope.billPrincipalBalance = data.returnData.rows[0].billPrincipalBalance;
					$scope.currInterestBalance = data.returnData.rows[0].currInterestBalance;
					$scope.billInterestBalance = data.returnData.rows[0].billInterestBalance;
					$scope.currCostBalance = data.returnData.rows[0].currCostBalance;
					$scope.billCostBalance = data.returnData.rows[0].billCostBalance;
					$scope.accInfItem.customerName = data.returnData.rows[0].customerName;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
					}
				}
			});
		};
		$scope.queryTimeBalance($scope.accInfItem);
		//账户余额单元信息
		$scope.balObcList = {
				params : $scope.queryParam = {
						idType:$scope.accInfItem.idType,
						idNumber:$scope.accInfItem.idNumber,
						externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
						accountId:$scope.accInfItem.accountId,
						currencyCode:$scope.accInfItem.currencyCode,
						operationMode:$scope.accInfItem.operationMode,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType'],//查找数据字典所需参数
				transDict : ['balanceType_balanceTypeDesc'],
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//账户余额对象信息
		$scope.accBalObjTable = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
			transDict : ['rateChangeFlag_rateChangeFlagDesc','overpayRateChangeFlag_overpayRateChangeFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//账户周期金融信息
		$scope.accCycleFiciList = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,
			resource : 'accCycleFiciList.query',
			callback : function(data) {
			}
		};
	});
	//查询争议账户查询 
	webApp.controller('layerDisputeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		/*溢缴款冻结状态 F-已冻结，U-已解冻，N-无冻结
		额度占用标识： 1-占额，0-不占额
		状态码：D-登记未释放，C-已释放利于客户，B-已释放利于银行*/
		//溢缴款冻结状态
		$scope.overpayFreezeStatusArr = [{name : "已冻结",id : 'F'},{name : "已解冻",id : 'U'},{name : "无冻结",id : 'N'}];
		//额度占用标识
		$scope.amtOccFlagArr = [{name : "占额",id : '1'},{name : "不占额",id : '0'}];
		//状态码
		$scope.statusCodeArr = [{name : "登记未释放",id : 'D'},{name : "已释放利于客户",id : 'C'},{name : "已释放利于银行",id : 'B'}];
		//账户组织形式
		if($scope.disputeInf.accountOrganForm == "R"){
			$scope.disputeInf.accountOrganFormTrans = "循环";//"循环";
		}else if($scope.disputeInf.accountOrganForm == "T"){
			$scope.disputeInf.accountOrganFormTrans = "交易";//"交易";
        }
        //账户性质
		if($scope.disputeInf.businessDebitCreditCode=='C'){
			$scope.disputeInf.businessDebitCreditCodeTrans = "贷记";//"贷记";
		}else if($scope.disputeInf.businessDebitCreditCode=='D'){
			$scope.disputeInf.businessDebitCreditCodeTrans = "借记";//"借记";
        }
        //账户状态
		if($scope.disputeInf.statusCode==1){
			$scope.disputeInf.statusCodeTrans = "活跃账户";//"活跃账户";
		}else if($scope.disputeInf.statusCode==2){
			$scope.disputeInf.statusCodeTrans = "非活跃账户";//"非活跃账户";
		}else if($scope.disputeInf.statusCode==3){
			$scope.disputeInf.statusCodeTrans = "冻结账户";//"冻结账户";
		}else if($scope.disputeInf.statusCode==8){
			$scope.disputeInf.statusCodeTrans = "关闭账户";//"关闭账户";
		}else if($scope.disputeInf.statusCode==9){
			$scope.disputeInf.statusCodeTrans = "待删除账户";//"待删除账户";
        }
    });
	//溢缴款查询页面
	webApp.controller('viewDepositCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_depositInf');
		$translate.refresh();
	});
	//原交易信息弹窗
	webApp.controller('orginTransInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.ectypeArray = [{name : '一次性收取',id : '0'},{name : '分期收取',id : '1'}];
		/*问题：根据原交易全局流水号可以定位到唯一的同源交易吗？
		二：事件编号怎么定位，传参需要*/
		//原交易信息 根据原交易全局流水号查询历史表
		$scope.sameSourceTransParams = {
				externalIdentificationNo: $scope.item.externalIdentificationNo,
				"globalSerialNumbr" : $scope.item.oldGlobalSerialNumbr,
				"eventNo" : 'PT.40',//、、目前定位不到事件编号
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "5"
			};
		jfRest.request('finacialTrans', 'query', $scope.sameSourceTransParams).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.orginTransInfo = data.returnData.rows[0];
			}
		});
		//判断是否有争议登记
		/*$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.disputeFlagInfo = data.returnData.disputeFlag; 
			} else {
				var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035')
				jfLayer.fail(returnMsg);
			}
		});*/
	});
});
