'use strict';
define(function(require) {
	var webApp = require('app');
	//争议数据查询查询
	webApp.controller('disputeAccontInfoCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader,$timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/disputeAccontInfo/i18n_disputeAccontInfo');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShow = false;
		$scope.disputeQueryTable = {};
		$scope.hide_disputeQuery = {};
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
		                                 {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		                                 {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		                                 {name : T.T('F00116') ,id : '4'} ,//中国护照
		                                 {name : T.T('F00117') ,id : '5'} ,//外国护照
		                                 {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		$scope.typeArray2 = [{name : "持卡人不同意账单金额",id : '6305'}, {name : "持卡人不承认转帐",id : '6321'}, {name : "请求芯片转码交易证书",id : '6322'},{name : "持卡人请求个人记录信息",id : '6323'},
		                     {name : "欺诈调查",id : '6341'},{name : "需要潜在的退单或合规性文档",id : '6342'},{name : "实时证实审计请求",id : '6343'},{name : "标识语法错误返回",id : '6390'}];
		$scope.typeArray3 = [{name : "硬拷贝原始文件",id : '1'},{name : "原始文件的复印件或图像",id : '2'},{name : "替代汇票",id : '4'}];
		/*溢缴款冻结状态 F-已冻结，U-已解冻，N-无冻结
		额度占用标识： 1-占额，0-不占额
		状态码：D-登记未释放，C-已释放利于客户，B-已释放利于银行*/
		//溢缴款冻结状态
		$scope.overpayFreezeAmountArr = [{name : "已冻结",id : 'F'},{name : "已解冻",id : 'U'},{name : "无冻结",id : 'N'}];
		//额度占用标识
		$scope.amtOccFlagArr = [{name : "占额",id : '1'},{name : "不占额",id : '0'}];
		//状态码
		$scope.statusCodeArr = [{name : "登记未释放",id : 'D'},{name : "已释放利于客户",id : 'C'},{name : "已释放利于银行",id : 'B'}];
		//联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
        	$scope.disputeQueryTable.params.idNumber = '';
        	if(data.value == "1"){//身份证
        		$("#disputeQuery_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#disputeQuery_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#disputeQuery_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#disputeQuery_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#disputeQuery_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#disputeQuery_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#disputeQuery_idNumber").attr("validator","noValidator");
        		$scope.disputeForm.$setPristine();
        		$("#disputeQuery_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.reset = function() {
			$scope.disputeQueryTable.params.idType= '';
			$scope.disputeQueryTable.params.customerNo= '';
			$scope.disputeQueryTable.params.idNumber= '';
			$scope.disputeQueryTable.params.externalIdentificationNo= '';
			$scope.isShow = false;
			$("#disputeQuery_idNumber").attr("validator","noValidator");
			$("#disputeQuery_idNumber").removeClass("waringform ");
		};
	    $scope.instalSel = function(){
			if(($scope.disputeQueryTable.params.idType == null || $scope.disputeQueryTable.params.idType == undefined) &&
					($scope.disputeQueryTable.params.customerNo == null || $scope.disputeQueryTable.params.customerNo == undefined) &&
					($scope.disputeQueryTable.params.idNumber == "" || $scope.disputeQueryTable.params.idNumber == undefined) &&
					($scope.disputeQueryTable.params.externalIdentificationNo == "" || $scope.disputeQueryTable.params.externalIdentificationNo == undefined)){
				jfLayer.fail("请输入任一查询条件");

			}else{
				if($scope.disputeQueryTable.params["idType"]){
					if($scope.disputeQueryTable.params["idNumber"] == null || $scope.disputeQueryTable.params["idNumber"] == undefined || $scope.disputeQueryTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.disputeQueryTable.search();
					}
				}else if($scope.disputeQueryTable.params["idNumber"]){
					if($scope.disputeQueryTable.params["idType"] == null || $scope.disputeQueryTable.params["idType"] == undefined || $scope.disputeQueryTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.disputeQueryTable.search();
					}
				}else {
					$scope.disputeQueryTable.search();
					//$scope.disputeQueryTable.params.businessTypeCollection ="MODT00015,MODT00016";
				}
			}
		};
		/** 证件号码 *//*
		private String idNumber;
		*//** 外部识别号 [19,0] Not NULL *//*
		private String externalIdentificationNo;
		 *//** 客户号 [36,0] *//*
		private String customerNo;*/
		$scope.disputeQueryTable = {
//				checkType : 'radio',
				params : {
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'disputeData.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.hide_disputeQuery = $scope.disputeQueryTable.params;
						$scope.isShow = true;
					}else {
						$scope.isShow = false;
					}
				}
		};
		//c查询
		$scope.viewDisputeInf = function(event){
			$scope.disputeDataInfo = $.parseJSON(JSON.stringify(event));
			$scope.disputeDataInfomation ={};
			var saveDisputeTransEntrg;
			if($scope.disputeDataInfo.businessTypeId=="MODT00016"){//取现有利于客户
				saveDisputeTransEntrg = "saveDisputeTransEntrg1";
			}else{//消费有利于客户
				saveDisputeTransEntrg = "saveDisputeTransEntrg4";
			}
			$scope.disputeDataInfomation.ecommEntryId = document.getElementById('ecommEntryIdId').value;
			$scope.disputeDataInfomation.ecommPostingCurr = $scope.disputeDataInfo.currencyCode;
			$scope.disputeDataInfomation.ecommTransCurr = $scope.disputeDataInfo.currencyCode;
			$scope.disputeDataInfomation.ecommPostingAcctNmbr = $scope.disputeDataInfo.accountId;
			$scope.disputeDataInfomation.ecommTransPostingAmount = $scope.disputeDataInfo.principalBalance/100;
			$scope.disputeDataInfomation.ecommTransAmount = $scope.disputeDataInfo.principalBalance/100;
			$scope.disputeDataInfomation.ecommTransDate = $scope.operateDate;
			$scope.disputeDataInfomation.ecommDisputedReleaseInd = "Y";
			$scope.disputeDataInfomation.idType = $scope.hide_disputeQuery.idType;
			$scope.disputeDataInfomation.idNumber = $scope.hide_disputeQuery.idNumber;
			$scope.disputeDataInfomation.externalIdentificationNo = $scope.hide_disputeQuery.externalIdentificationNo;
			jfRest.request('fncTxnMgt', saveDisputeTransEntrg, $scope.disputeDataInfomation)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("争议已释放");
					$scope.disputeQueryTable.search();
				}
			});
		};
		//查询
		$scope.viewDisputeViewInf =  function(event){
			$scope.disputeInf = $.parseJSON(JSON.stringify(event));
			$scope.disputeInf.idType = $scope.hide_disputeQuery.idType;
			$scope.disputeInf.idNumber = $scope.hide_disputeQuery.idNumber;
			$scope.disputeInf.externalIdentificationNo = $scope.hide_disputeQuery.externalIdentificationNo;
			$scope.modal('/cstSvc/disputeAccontInfo/viewDisputeInf-JY.html',$scope.disputeInf, {
					title : '争议账户详细信息',
					buttons : [ '争议释放有利于客户','争议释放有利于银行','调单申请/拒付管理','关闭' ],
					size : [ '1000px', '600px' ],
					callbacks : [$scope.disputeReleaseCst,$scope.disputeReleaseBank,$scope.searchApp]
				});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(result){
			console.log(result);
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
//											$scope.modal('/cstSvc/disputeAccontInfo/confirmAppVisaForm.html',
//													'', {
//														title : 'VISA调单申请',
//														buttons : [ '确认','关闭' ],
//														size : [ '1000px', '600px' ],
//														callbacks : [$scope.saveConfirmVisaApp]
//													});
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
//											$scope.modal('/cstSvc/disputeAccontInfo/confirmMCAppForm.html',
//													'', {
//														title : 'MC调单申请',
//														buttons : [ '确认','关闭' ],
//														size : [ '1000px', '600px' ],
//														callbacks : [$scope.saveConfirmMCApp]
//													});
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
//										$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestVisaForm.html',
//												'', {
//													title : 'VISA拒付管理',
//													buttons : [ '确认','关闭' ],
//													size : [ '1000px', '600px' ],
//													callbacks : [$scope.saveConfirmVisaProtest]
//												});
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
//										$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestMCForm.html',
//												'', {
//													title : 'MC拒付管理',
//													buttons : [ '确认','关闭' ],
//													size : [ '1000px', '600px' ],
//													callbacks : [$scope.saveConfirmMCProtest]
//												});
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
		//VISA调单申请保存
		$scope.saveConfirmVisaApp = function (result){
			$scope.appVisaFormInf = $scope.appVisaFormInf;
			if($scope.appVisaFormInf.requestReasonCode == null || $scope.appVisaFormInf.requestReasonCode == ""){
				jfLayer.fail("请输入请求原因代码");
			}else{
				$scope.parm = $scope.appVisaFormInf;
				jfRest.request('appVisa', 'save', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success("保存成功");
						$scope.safeApply();
						result.cancel();
					}
				});
			}
		};
		//MC调单申请保存
		$scope.saveConfirmMCApp = function (result){
			$scope.parm = $scope.appMCFormInf;
			jfRest.request('MCAppFormApply', 'save', $scope.parm).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功");
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//VISA拒付管理保存
		$scope.saveConfirmVisaProtest = function (result){
			$scope.protestVisaFormInf = $scope.protestVisaFormInf;
			$scope.parm = $scope.protestVisaFormInf;
			jfRest.request('protestVisa', 'save', $scope.parm).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功");
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//MC拒付管理保存
		$scope.saveConfirmMCProtest = function (result){
			$scope.protestMCFormInf = $scope.protestMCFormInf;
			$scope.parm = $scope.protestMCFormInf;
			jfRest.request('protestMC', 'save', $scope.parm).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功");
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 有利于银行
		$scope.disputeDataDetailsInfo2 = function(event){
			$scope.disputeDataInfo = $.parseJSON(JSON.stringify(event));
			$scope.disputeDataInfomation ={};
			var saveDisputeTransEntrg;
			if($scope.disputeDataInfo.businessTypeId=="MODT00015"){//消费有利于银行
				saveDisputeTransEntrg = "saveDisputeTransEntrg5";
			}else{//取现有利于银行
				saveDisputeTransEntrg = "saveDisputeTransEntrg2";
			}
			$scope.disputeDataInfomation.ecommEntryId = document.getElementById('ecommEntryIdId').value;
			$scope.disputeDataInfomation.ecommPostingCurr = $scope.disputeDataInfo.currencyCode;
			$scope.disputeDataInfomation.ecommTransCurr = $scope.disputeDataInfo.currencyCode;
			$scope.disputeDataInfomation.ecommPostingAcctNmbr = $scope.disputeDataInfo.accountId;
			$scope.disputeDataInfomation.ecommTransPostingAmount = $scope.disputeDataInfo.principalBalance/100;
			$scope.disputeDataInfomation.ecommTransAmount = $scope.disputeDataInfo.principalBalance/100;
			$scope.disputeDataInfomation.ecommTransDate = $scope.operateDate;
			$scope.disputeDataInfomation.ecommDisputedReleaseInd = "Y";
			$scope.disputeDataInfomation.idType = $scope.disputeDataInfo.idType;
			$scope.disputeDataInfomation.idNumber = $scope.disputeDataInfo.idNumber;
			$scope.disputeDataInfomation.externalIdentificationNo = $scope.disputeDataInfo.externalIdentificationNo;
			jfRest.request('fncTxnMgt', saveDisputeTransEntrg, $scope.disputeDataInfomation)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("争议已释放");
					$scope.disputeQueryTable.search();
				}
			});
		};
		$scope.operateDate ="";
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.paramDates ={};
			$scope.paramDates.operationMode = "A01";
			jfRest.request('disputeAccount', 'queryTransDate', $scope.paramDates).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows!=null){
						$scope.operateDate = data.returnData.rows[0].nextProcessDate;
					}
				}
			});
		};
		$scope.queryDate();
	});
	//查询ctrl
	webApp.controller('viewDisputeCtrl-JY', function($scope, $stateParams,
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
});
