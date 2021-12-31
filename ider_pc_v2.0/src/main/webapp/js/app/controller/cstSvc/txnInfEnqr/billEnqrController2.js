'use strict';
define(function(require) {
	var webApp = require('app');
	//账单信息
	webApp.controller('billEnqrCtrl2', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
				$translate.refresh();
		    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
		    	$scope.ectypeArray = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
				//动态请求下拉框 证件类型
				 $scope.certificateTypeArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_certificateType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	//console.log(data)
			        }
				};
            //联动验证
            var form = layui.form;
            form.on('select(getIdType)',function(data){
            	$scope.billingInfoList.params.idNumber = '';
            	if(data.value == "1"){//身份证
            		$("#billEnqr_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#billEnqr_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#billEnqr_idNumber").attr("validator","id_isTWCard");
            	}else if(data.value == "4"){//中国护照
            		$("#billEnqr_idNumber").attr("validator","id_passport");
            	}else if(data.value == "5"){//外国护照passport
            		$("#billEnqr_idNumber").attr("validator","id_passport");
            	}else if(data.value == "6"){//外国人永久居留证
            		$("#billEnqr_idNumber").attr("validator","id_isPermanentReside");
            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#billEnqr_idNumber").attr("validator","noValidator");
            		$scope.billQueryForm.$setPristine();
            		$("#billEnqr_idNumber").removeClass("waringform ");
                }
            });
		$scope.isShowBillingInfo = false;
		//重置
		$scope.reset = function() {
			$scope.billingInfoList.params.idNumber= '';
			$scope.billingInfoList.params.externalIdentificationNo= '';
			$scope.billingInfoList.params.idType= '';
			$scope.billingInfoList.params.customerNo= '';
			$scope.isShowBillingInfo = false;
			$("#billEnqr_idNumber").attr("validator","noValidator");
			$("#billEnqr_idNumber").removeClass("waringform ");
		};
		//账单信息列表
		$scope.billingInfoList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					//存客户信息
					$rootScope.custInfo ={
							idType: $scope.billingInfoList.params.idType,
							idNumber: $scope.billingInfoList.params.idNumber,
							externalIdentificationNo: $scope.billingInfoList.params.externalIdentificationNo,
					};
					$scope.isShowBillingInfo = true;
				}else {
					$scope.isShowBillingInfo = false;
				}
			}
		};
		//点击查询
		$scope.billSearch = function() {
			if(($scope.billingInfoList.params.idType == null || $scope.billingInfoList.params.idType == undefined) &&
					($scope.billingInfoList.params.idNumber == undefined || $scope.billingInfoList.params.idNumber == "") && 
					($scope.billingInfoList.params.externalIdentificationNo == undefined || $scope.billingInfoList.params.externalIdentificationNo == null || $scope.billingInfoList.params.externalIdentificationNo == "")){
				$scope.isShowBillingInfo = false;
				jfLayer.alert(T.T('F00076'));//"请输入证件号码/外部识别号查询"
			}
			else {
				if($scope.billingInfoList.params["idType"] ){
					if($scope.billingInfoList.params["idNumber"] == null || $scope.billingInfoList.params["idNumber"] == undefined || $scope.billingInfoList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowBillingInfo = false;
					}else {
						$scope.billingInfoList.search();
					}
				}else if($scope.billingInfoList.params["idNumber"] ){
					if($scope.billingInfoList.params["idType"] == null || $scope.billingInfoList.params["idType"] == undefined || $scope.billingInfoList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowBillingInfo = false;
					}else {
						$scope.billingInfoList.search();
					}
				}else {
					$scope.billingInfoList.search();
				}
			}
		};
		//查询业务类型级别
		$scope.checkItem = function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			$scope.itemInf = Object.assign($scope.itemInf,  $scope.billingInfoList.params);
			$scope.modal('/cstSvc/txnInfEnqr/viewBill2.html', $scope.itemInf, {
				title : T.T('KHJ4500001'),//'账单摘要(产品级)',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '1030px', '500px' ],
				callbacks : []
			});
		};
	});
	//账单分期
	webApp.controller('billStageCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingInfo =$scope.paramss;
		//币种
		$scope.ccy = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_curreny",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//费用收取方式
		$scope.ectypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ecommFeeCollectType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分期期数
		$scope.termArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_stageTerm",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				queryType:"stage",
				 stageType:1
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
			}
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.stagingParams = {};
			$scope.stagingParams.eventNo = $scope.itemList.checkedList().eventNo;//事件号
			$scope.stagingParams.ecommTransPostingAmount = $scope.stagingInfo.transAmount;//分期金额
			$scope.stagingParams.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingParams.currBillFlag = '1'; 
			$scope.stagingParams.ecommSourceCde = 'L';
			//$scope.stagingParams.postingAmount = $scope.stagingInfo.postingAmount;//入账金额      分期管理中的账单分期就没有传此字段，否则报错
			$scope.stagingParams.ecommTransPostingCurr = $scope.stagingInfo.postingCurrencyCode;
			$scope.stagingParams.ecommProdObjId = $scope.stagingInfo.productObjectCode;//产品对象代码
			$scope.stagingParams.ecommCustId = $scope.stagingInfo.customerNo;//客户号码
			$scope.stagingParams.ecommPostingAcctNmbr = $scope.stagingInfo.accountId;////账户号
			$scope.stagingParams.ecommBusineseType = $scope.stagingInfo.businessTypeCode;//业务类型
		    $scope.stagingParams.installmentAmount= $scope.stagingInfo.installmentAmount;//已分期金额
			$scope.stagingParams.transState = $scope.stagingInfo.transState;
			$scope.stagingParams.ecommOrigGlobalSerialNumbr = $scope.stagingInfo.globalSerialNumbr;
			$scope.stagingParams.ecommInstallmentPeriod = $scope.stagingInfo.ecommInstallmentPeriod;//分期期数
		    $scope.stagingParams.ecommFeeCollectType = $scope.stagingInfo.ecommFeeCollectType;//费用收取方式
			$scope.stagingParams.ecommInstallmentBusinessType = $scope.stagingInfo.ecommInstallmentBusinessType;//分期业务类型
			$scope.stagingParams.billAmt = $scope.stagingInfo.billAmt;//最大可分期金额
			//黄亚运修改
			$scope.stagingParams.ecommBusinessProgramCode = $scope.stagingInfo.businessProgramNo;//业务项目
			$scope.stagingParams.ecommTransAmount = $scope.stagingInfo.transAmount;//分期金额
			$scope.stagingParams.ecommBillAmt = $scope.stagingInfo.billAmt;//最大可分期金额
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingParams,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//账单分期试算弹框
		$scope.trialByStagesInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.params = $scope.stagingInfo;
			$scope.params.eventNo = $scope.itemList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
			$scope.params.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;
			$scope.params.ecommTransAmount=$scope.stagingInfo.transAmount;
			$scope.params.billAmt = $scope.stagingInfo.billAmt;
			$scope.params.ecommTransPostingCurr = $scope.stagingInfo.postingCurrencyCode;
			if(!$scope.itemList.validCheck()){
				return;
            }
            if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/cstSvc/txnInfEnqr/billInstallmentTrial.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
});
	//账单分期试算弹窗"billInstallmentTrialCtrl"
	webApp.controller('billInstallmentTrialCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.trialList = {};
		//分期试算
		$scope.cashTrailList = {
			autoQuery:true,
			params : {
				"pageSize":10,
				"indexNo":0,
				eventNo: $scope.params.eventNo,//事件号
				ecommEntryId: $scope.params.ecommEntryId,//外部识别号
				ecommFeeCollectType: $scope.params.ecommFeeCollectType,//费用收取方式
				ecommBusineseType: $scope.params.ecommBusineseType,//业务类型
				ecommInstallmentPeriod: $scope.params.ecommInstallmentPeriod,//分期期数
				ecommPostingAcctNmbr: $scope.params.ecommPostingAcctNmbr,
				ecommProdObjId: $scope.params.ecommProdObjId,
				ecommTransAmount: $scope.params.ecommTransAmount,//分期金额
				ecommTransPostingCurr: $scope.params.ecommTransPostingCurr,
				ecommInstallmentBusinessType: $scope.params.ecommInstallmentBusinessType,//分期业务类型
				ecommBusinessProgramCode: $scope.params.ecommBusinessProgramCode,//业务项目
				receiveAccount:  $scope.params.receiveAccount,
				ecommSourceCde : $scope.params.ecommSourceCde,
				accountBankNo: $scope.params.accountBankNo,
				freeFlag: $scope.params.freeFlag,
				billAmt: $scope.params.billAmt
				
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.stageTrial',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.trialList = data.returnData.obj;
				}
			}
		};
	});
	//业务类型级别查询
	webApp.controller('viewBillCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/cstSvc/cstDelinquencyList/i18n_cstDelinquencyList');
		$translate.refresh();
		//$scope.ectypeArray = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
		//动态请求下拉框 费用收取方式
		 $scope.ectypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ecommFeeCollectType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
		};
		//延滞信息
		$scope.delayInf  = $scope.itemInf.page.rows;
		// 业务类型级别账单list
		$scope.billSummList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				idType: $scope.itemInf.idType,
				idNumber: $scope.itemInf.idNumber,
				externalIdentificationNo: $scope.itemInf.externalIdentificationNo,
				customerNo: $scope.itemInf.customerNo,
				currencyCode: $scope.itemInf.currencyCode,
				billDate: $scope.itemInf.billDate,
				businessProgramNo: $scope.itemInf.businessProgramNo,
				productObjectCode: $scope.itemInf.productObjectCode,
				businessTypeCode: $scope.itemInf.businessTypeCode,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryBsnisType',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.billSummList.params.customerNo = $scope.itemInf.customerNo;
		//$scope.billSummList.search();
		//查询交易明细
		$scope.checkBsTypeItem = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.itemDetailInf.idType = $scope.itemInf.idType;
			$scope.itemDetailInf.idNumber = $scope.itemInf.idNumber;
			$scope.itemDetailInf.externalIdentificationNo = $scope.itemInf.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/viewTradeDetail2.html', $scope.itemDetailInf, {
				title : T.T('KHJ4500009'),//'账单摘要详情(业务类型级)'
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '1150px', '500px' ],
				callbacks : []
			});
		};
		//账单分期
		$scope.billStage = function(item) {
			$scope.stageInf = $.parseJSON(JSON.stringify(item));
			$scope.stageInf.idType = $scope.itemInf.idType;
			$scope.stageInf.idNumber = $scope.itemInf.idNumber;
			$scope.stageInf.externalIdentificationNo = $scope.itemInf.externalIdentificationNo;
			$scope.paramss = {
				customerNo:$scope.stageInf.customerNo,
				currentCycleNumber:$scope.stageInf.currentCycleNumber,
				businessProgramNo: $scope.stageInf.businessProgramNo,
				businessTypeCode: $scope.stageInf.businessTypeCode,
				idType: $scope.stageInf.idType,
				idNumber: $scope.stageInf.idNumber,
				postingCurrencyCode: $scope.stageInf.currencyCode,
				externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
				postingAmount: $scope.stageInf.postingAmount
			};
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows && data.returnData.rows.length > 0 ) {
						$scope.paramss.billAmt = data.returnData.rows[0].billAmt;
						$scope.modal('/cstSvc/txnInfEnqr/billStage2.html', $scope.paramss, {
							title :T.T('KHJ4500010'),// '账单分期信息'
							buttons : [T.T('F00012')],//'账单分期''关闭'
							size : [ '1030px', '500px' ],
							callbacks : []
						});
					}
				}
			});
		};
		//确认分期
		$scope.sureStage = function(result){
			if($scope.stageInf.billAmt <  Number($scope.stageInf.loanAmt) ){
				jfLayer.alert(T.T('KHJ4500007'));//"分期金额不能大于可分期最大额度！"
				return;
            }
            if($scope.stageInf.term  == undefined || $scope.stageInf.term  == null || $scope.stageInf.term  == ''){
				jfLayer.alert(T.T('KHJ4500008'));//"分期期数不能为空！"
				return;
            }
            $scope.stageInfo1 = result.scope.stageInf;
			console.log($scope.stageInfo1);
			$scope.stageParams = {
				ecommPostingAcctNmbr: $scope.stageInfo1.accountId,
				ecommCustId: $scope.stageInfo1.customerNo,//
				ecommTransPostingAmount: $scope.stageInfo1.loanAmt,//分期金额
				ecommTransPostingCurr: $scope.stageInfo1.currencyCode,
				ecommFeeCollectType: $scope.stageInfo1.ecommFeeCollectType,
				ecommBusinessProgramCode: $scope.stageInf.businessProgramNo,// 业务项目
				ecommBusineseType: $scope.stageInf.businessTypeCode,
				ecommProdObjId:  $scope.stageInf.productObjectCode,
				currBillFlag: '1',
				ecommSourceCde: 'L',
				ecommInstallmentPeriod: $scope.stageInfo1.term,
				ecommEntryId : $scope.stageInfo1.externalIdentificationNo,
				ecommBillAmt : $scope.stageInfo1.billAmt
			};
			if($scope.stageInfo1.idType){
				$scope.stageParams.idType = $scope.stageInfo1.idType;
            }
            if($scope.stageInfo1.idNumber){
				$scope.stageParams.idNumber = $scope.stageInfo1.idNumber;
            }
            if($scope.stageInfo1.externalIdentificationNo){
				$scope.stageParams.externalIdentificationNo = $scope.stageInfo1.externalIdentificationNo;
            }
            jfRest.request('billingInfoEnqr', 'sureStage', $scope.stageParams).then(function(data) {
  		    	if(data.returnCode == '000000'){
  		    		jfLayer.success(T.T('KHJ4500014'));//"分期成功"
  		    		$scope.safeApply();
  		  			result.cancel();
  		    		$scope.isShowBillingInfo = false;
	  		  		$scope.isShowbillStageInfo = false;//账单分期信息
	  		  		$scope.isShowStageResultInfo = false; //分期试算结果
  		    	}
  		    });
		};
	});
	//交易明细查询
	webApp.controller('viewTradeDetailCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		//延滞信息
		$scope.delayInf = $scope.itemDetailInf.page.rows;
		//账单摘要明细(业务类型级)
		$scope.txnCgyAvyLogEnqrTable = {
			params : {
				"activityNo" : "X8010",
				"logLevel" : "A",
				"transProperty" : "O",
			/*idType: $rootScope.custInfo.idType,
				idNumber: $rootScope.custInfo.idNumber,
				externalIdentificationNo: $rootScope.custInfo.externalIdentificationNo,*/
				idType: $scope.itemDetailInf.idType,
				idNumber: $scope.itemDetailInf.idNumber,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode: $scope.itemDetailInf.currencyCode ,
				billDate: $scope.itemDetailInf.billDate ,
				businessProgramNo: $scope.itemDetailInf.businessProgramNo ,
				productObjectCode: $scope.itemDetailInf.productObjectCode ,
				businessTypeCode: $scope.itemDetailInf.businessTypeCode ,
				customerNo: $scope.itemDetailInf.customerNo ,
				currentCycleNumber: $scope.itemDetailInf.currentCycleNumber 
			},
			paging : true,
			resource : 'billingInfoEnqr.queryTradeDetal',
			//resource : 'finacialTrans.query',
			//autoQuery : false,
			isTrans: true,
			transParams: ['dic_ecommTransStatus'],
			transDict: ['transStateDesc_transStateDesc'],
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.hide_transQuery = {};
					$scope.hide_transQuery.idType = $rootScope.custInfo.idType;
					$scope.hide_transQuery.idNumber = $rootScope.custInfo.idNumber;
					$scope.hide_transQuery.externalIdentificationNo = $rootScope.custInfo.externalIdentificationNo;
					$scope.isShowDetail = true;
				}else {
					$scope.isShowDetail = false;
				}
			}
		};
		
		
		/*=========================test1111111111111111111111======================*/
		//翻译
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_ecommTransStatus",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
			function(data) {
				$scope.transStateList = data.returnData.rows;
		}); 
		//优化后 树形表格：查询主账户和子账户
		$scope.pageCount = 0;
		$scope.pageNumP = 1;
		$scope.pageSizeP = 10;
		$scope.queryMainAcc = function(){
		    layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#transBillTable',
		            tree: {},
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
//		                {type: 'numbers'},
//		                {type: .'checkbox'},//radio
		                {align: 'left',field: 'accountId', title: T.T('KHH1800005'),width:230,templet: function(d){
		                    if(!d.externalIdentificationNo){
		                    	return '<span>'+ d.accountId+'</span>';
		                    }else if(d.externalIdentificationNo != '' ){
		                    	return '<span>'+ d.externalIdentificationNo+'</span>';
                            }
                            }},
		                {field: 'transCurrDesc', title: T.T('KHH1800006'), width:60},
		                {field: 'transAmount', title: T.T('KHH1800007'), width:80},
		                {field: 'transDate', title: T.T('KHH1800008'), width:100},
		                {field: 'postingAmount', title: T.T('KHH1800009'), width:80},
		                {field: 'occurrDate', title: T.T('KHH1800084'), width:100},
		                {field: 'occurrTime', title: T.T('KHH1800010'), width:100},
		                {field: 'eventNo', title: T.T('KHH1800011'), width:100},
		                {field: 'transStateDesc', title: T.T('KHH1800030'),width:60},
		                {field: 'transDesc', title: T.T('KHH1800012'), width:200},
		                {field:'haveChild',align: 'center',  title: T.T('F00017'), width:400,templet: function(d){
		                	if(d.haveChild == true){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryRelativeTrans">'+T.T("KHH1800114")+'</a>'+
		                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="querySameSourceTrans">'+T.T("KHH1800115")+'</a>'+
		                   		'<a class="layui-btn layui-btn-primary layui-btn-xs"  lay-event="queryPostingInfo">'+T.T("KHH1800015")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryAccProcesseInf">'+T.T("KHH1800075")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoIndex">'+T.T("F00041")+'</a>';
		                	}else if(d.haveChild == false){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs"  lay-event="queryPostingInfo">'+T.T("KHH1800015")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryAccProcesseInf">'+T.T("KHH1800075")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoIndex">'+T.T("F00041")+'</a>';
		                	}
		                },}//toolbar templet: '#transHandle',
		            ],
		            style: 'margin-top: 180px;',
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
		    					queryType : '2',
		    					eventNo : data1.eventNo,
		    					externalIdentificationNo:  $scope.itemDetailInf.externalIdentificationNo,
		    					idType:  $scope.itemDetailInf.idType,
		    					idNumber:  $scope.itemDetailInf.idNumber,
		    					businessTypeCode:data1.businessTypeCode,
		    					accFlag : "mainAcc",
		    					globalSerialNumbr : data1.globalSerialNumbr,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		if($scope.params.pageFlag){
		            			delete $scope.params.pageFlag;
                            }
                        }else {//查主账户
		            		$scope.params = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
		    					externalIdentificationNo:  $scope.itemDetailInf.externalIdentificationNo,
		    					idType:  $scope.itemDetailInf.idType,
		    					idNumber:  $scope.itemDetailInf.idNumber,
		    					businessTypeCode:$scope.itemDetailInf.businessTypeCode,
		    					pageFlag : "mainPage",
		    					pageNum: $scope.pageNumP,
		    			        pageSize: $scope.pageSizeP
	                		};
		            		if($scope.params.accFlag){
		            			delete $scope.params.accFlag;
                            }
                        }
                            jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.params).then(function(data) {
                			if (data.returnCode == '000000') {
        						$scope.isShowDetail = true;
        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
        							$scope.pageCount = data.returnData.totalCount;
        							pageInit($scope.pageCount,"transBillPage");//初始化分页
        							angular.forEach(data.returnData.rows,function(item,i){
        								if(data1){//子账户
        									item.haveChild = false;
        								}else {//主账户
        									item.haveChild = true;
                                        }
                                        for(var k = 0; k < $scope.transStateList.length; k++){
            								if(item.transState == $scope.transStateList[k].codes){
            									item.transStateDesc = $scope.transStateList[k].detailDesc;
                                            }
                                        }
                                    });
        							callback(data.returnData.rows);
        							
        							if(!data1){//主账户
        								layui.use(['laypage', 'layer'], function(){
  					                      var laypage = layui.laypage
  					                      ,layer = layui.layer;
  					                      laypage.render({
  					                            elem: 'transBillPage',
  					                            count: $scope.pageCount,
  					                            limit: $scope.pageSizeP,
  					                            curr: $scope.pageNumP,
  					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
  					                            jump: function(obj,first){
  					                             if (!first) {
  					                              $scope.pageNumP = obj.curr;
  					                              $scope.pageSizeP = obj.limit;
  					                              $scope.queryMainAcc();
  					                             }
  					                            }
  					                        });
  					                    });
        								
        							}
        						}else {
        							$scope.rows = [];
        							callback($scope.rows);
        							$scope.pageCount = 0;
        							pageInit($scope.pageCount,"transBillPage");//初始化分页
                                }
                            }else {
                				$scope.isShowDetail = false;
                            }
                        });
		            	
		            }, 300);//setTimeout
		            },
		        });
		        treeTable.on('tool(transBillTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'queryRelativeTrans') {
		                $scope.queryRelativeTrans(obj.data);
		            } else if (event == 'querySameSourceTrans') {
		                $scope.querySameSourceTrans(obj.data);
		            }else if(event == 'queryPostingInfo'){
		            	 $scope.queryPostingInfo(obj.data);
		            }else if(event == 'queryAccProcesseInf'){
		            	 $scope.queryAccProcesseInf(obj.data);
		            }else if(event == 'checkInfoIndex'){
		            	 $scope.checkInfoIndex(obj.data);
                    }
                });
		    });
		};
		//暂无数据 分页隐藏
		function pageInit(pageCount,pageDivId){
			if(pageCount > 0 ){
				$("#"+ pageDivId).css("display","block");
			}else {
				$("#"+ pageDivId).css("display","none");
            }
        }
        $scope.queryMainAcc();
		
		
		// 关联交易按钮
		$scope.queryRelativeTrans = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = false;
			$scope.transRelativeParams = $.parseJSON(JSON.stringify(event));
			$scope.relativeTransTable.params = {
				globalSerialNumbr : $scope.transRelativeParams.globalSerialNumbr,
				globalSerialNumbrRelative:$scope.transRelativeParams.globalSerialNumbrRelative,
				idType: $scope.txnCgyAvyLogEnqrTable.params.idType,
				idNumber: $scope.txnCgyAvyLogEnqrTable.params.idNumber,
				externalIdentificationNo : $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
				eventNo:"ISS.PT.60.0002",
				queryType: "6"
			};
			$scope.relativeTransTable.search();
		};
		//<!-- 关联交易 -->
		$scope.relativeTransTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.queryRelativeTransEvent',
			autoQuery : false,
			callback : function(data) {
			}
		};
		// 同源交易按钮
		$scope.querySameSourceTrans = function(event) {
			$scope.isShowRelation = false;
			$scope.isShowSameSource = true;
			$scope.isShowPosting = false;
			$scope.transSameSourceParams = $.parseJSON(JSON
					.stringify(event));
			$scope.sameSourceTransTable.params = {
				"globalSerialNumbr" : $scope.transSameSourceParams.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "1"
			};
			//如果列表返回外部识别号直接获取，没有返回用查询条件的
			if($scope.transSameSourceParams.externalIdentificationNo){
				$scope.sameSourceTransTable.params.externalIdentificationNo = $scope.transSameSourceParams.externalIdentificationNo;
			}else{
				$scope.sameSourceTransTable.params.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			}
			$scope.sameSourceTransTable.params.idType =  $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.sameSourceTransTable.params.idNumber =  $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.sameSourceTransTable.search();
		};
		//同源交易
		$scope.sameSourceTransTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : false,
			callback : function(data) {
			}
		};
		// 入账情况按钮,查询余额类型入账情况
		$scope.queryPostingInfo = function(event) {
			$scope.isShowRelation = false;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = true;
			$scope.transPostingParams = $.parseJSON(JSON.stringify(event));
			$scope.postingInfoTable.params = {
				"globalSerialNumbr" : $scope.transPostingParams.globalSerialNumbr,
				"accountId" : $scope.transPostingParams.accountId,
				"currencyCode" : $scope.transPostingParams.currencyCode,
				"logLevel" : "T"
			};
			$scope.postingInfoTable.params = $.extend($scope.postingInfoTable.params, $scope.hide_transQuery);
			$scope.postingInfoTable.params.externalIdentificationNo = $scope.transPostingParams.externalIdentificationNo;
			$scope.postingInfoTable.params.idType =  $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.postingInfoTable.params.idNumber =  $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.postingInfoTable.search();
		};
		//入账情况
		$scope.postingInfoTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : false,
			isTrans: true,
			transParams: ['dic_balanceType'],
			transDict: ['balanceType_balanceTypeDesc'],
			callback : function(data) {
			}
		};
		// 查看按钮
		$scope.checkInfoIndex = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.transDetailInfo.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.transDetailInfo.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/finaciTransDetailInfo.html',$scope.transDetailInfo, {
				title : T.T('KHJ1800003'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
		};
		//核算处理按钮
		$scope.queryAccProcesseInf = function(event) {
			$scope.accProcesseInf = $.parseJSON(JSON.stringify(event));
			$scope.accProcesseInf.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.accProcesseInf.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.modal('/cstSvc/txnInfEnqr/layerAccProcesse.html',$scope.accProcesseInf, {
				title : T.T('KHJ1800023'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
		// 余额单元入账情况查询
		$scope.queryBalUnitInfo = function(event) {
			$scope.balUnitPostingParams = $.parseJSON(JSON.stringify(event));
			$scope.balUnitPostingParams.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.balUnitPostingParams.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.balUnitPostingParams.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/balUnitPostingInfo.html',
			$scope.balUnitPostingParams, {
				title : T.T('KHJ1800002'),
				buttons : [ T.T('F00012') ],
				size : [ '1100px', '550px' ],
				callbacks : []
			});
		};
		// 关联交易列表中的同源交易按钮
		$scope.querySameSourceTrans2 = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = true;
			$scope.isShowPosting = false;
			$scope.transSameSourceParams2 = $.parseJSON(JSON
					.stringify(event));
			$scope.sameSourceTransTable.params = {
				"globalSerialNumbr" : $scope.transSameSourceParams2.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams2.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "1"
			};
			//$scope.sameSourceTransTable.params = $.extend($scope.sameSourceTransTable.params, $scope.hide_transQuery);
			$scope.sameSourceTransTable.search();
		};
		// 关联交易列表中的入账情况按钮
		$scope.queryPostingInfo2 = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = true;
			$scope.transPostingParams2 = $.parseJSON(JSON
					.stringify(event));
			$scope.postingInfoTable.params = {
					"globalSerialNumbr" : $scope.transPostingParams2.globalSerialNumbr,
					"accountId" : $scope.transPostingParams2.accountId,
					"currencyCode" : $scope.transPostingParams2.currencyCode,
					"logLevel" : "T"
			};
			//$scope.postingInfoTable.params = $.extend($scope.postingInfoTable.params, $scope.hide_transQuery);
			$scope.postingInfoTable.search();
		}
	});
	//金融交易查看
	webApp.controller('transDetailCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.ectypeArray = [{name : T.T('KHJ1800017'),id : '0'},{name : T.T('KHJ1800018'),id : '1'}];
		$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				if( data.returnData){
					$scope.disputeFlagInfo = data.returnData.disputeFlag; 
				}
			} 
		});
		// 退货
		$scope.returnedPurchase = function(e) {
			console.log(e.globalSerialNumbr);
			var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//部分退货按钮
		$scope.partReturnedPurchase = function(e){
			$scope.e = e;
			$scope.modal('/cstSvc/txnInfEnqr/layerPartReturned.html',
					$scope.e, {
					title :  T.T('F00191'),
					buttons : [ T.T('F00191'),T.T('F00012') ],
					size : [ '1100px', '300px' ],
					callbacks : [$scope.surePartReturned]
				});
		};
		//确定部分退货
		$scope.surePartReturned = function(result){
			var e = result.scope.e;
			//部分退货金额
			$scope.ecommTransPostingAmount = result.scope.partReturnedInf.ecommTransPostingAmount;
			//输入退货金额+已退货金额 小于等于 退货金额
			if($scope.transDetailInfo.rejectedAmount){
				$scope.transDetailInfo.rejectedAmount = $scope.transDetailInfo.rejectedAmount
			}else{
				$scope.transDetailInfo.rejectedAmount = 0;
            }
            $scope.flag = Number($scope.ecommTransPostingAmount)+Number($scope.transDetailInfo.rejectedAmount) <= $scope.transDetailInfo.actualPostingAmount ? true : false;
			if(!$scope.flag){
				jfLayer.alert(T.T('F00193'));
				return;
            }
            var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : $scope.ecommTransPostingAmount,
				"ecommTransDate" : $scope.ecommTransDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" :  e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				"ecommTransPostingAmount": $scope.ecommTransPostingAmount,
				ecommRejectStatus: 'PRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//争议登记
		$scope.disputeRegist = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommOrigTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo
			};
			jfRest.request('finacialTrans', 'disputeRegist', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800013'));
				}
			});
		};
		//交易分期
		$scope.transStageDetail = function(event){
			$scope.params=$scope.transDetailInfo;
			$scope.stageInf = $.parseJSON(JSON.stringify(event));
			$scope.items = {
					idType: $scope.stageInf.idType,
					idNumber: $scope.stageInf.idNumber,
					externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
					accountId: $scope.stageInf.accountId,
					balanceObjectCode: $scope.stageInf.balanceObjectCode,
					postingCurrencyCode: $scope.stageInf.postingCurrencyCode,
					occurrDate: $scope.stageInf.occurrDate,
					postingAmount: $scope.stageInf.postingAmount,
					customerNo:$scope.stageInf.customerNo,
					businessTypeCode: $scope.stageInf.businessTypeCode,
					ecommOrigGlobalSerialNumbr : $scope.stageInf.globalSerialNumbr,
			};
			//获取可分期金额
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.items).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/txnInfEnqr/transactionDetail/layerTradeStage1.html',$scope.params, {
						title : T.T('KHJ1800014'),
						buttons : [T.T('F00012') ],
						size : [ '1100px', '550px' ],
						callbacks : []
					});
				}
			});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800019'));
				} 
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800020'));
				} 
			});
		};
		//争议账户查询 弹窗
		$scope.disputeAccQuery = function(e){
			$scope.disputeItem = $.parseJSON(JSON.stringify(e));
			$scope.modal('/cstSvc/txnInfEnqr/transDisputeAccDetail.html',$scope.disputeItem, {
				title : T.T('KHJ1800024'),
				buttons : [  T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : []
			});
		};
		//分期账户信息查询
		$scope.stagingAccInfoBtn = function(event){
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/stagingAccInfoLayer.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
	});
	//核算处理查询
	webApp.controller('layerAccProcesseCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.accProcesseInf = $scope.accProcesseInf;
		//根据外部识别号，全部流水号查询核算处理查询
		$scope.accProcesseList = {
			params : {
				pageSize:10,
				indexNo:0,
				externalIdentificationNo : $scope.accProcesseInf.externalIdentificationNo,
				idType: $scope.accProcesseInf.idType,
				idNumber: $scope.accProcesseInf.idNumber,
				globalSerialNumber : $scope.accProcesseInf.globalSerialNumbr
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			//autoQuery: false,
			resource : 'accountingMag.queryAccProcesse',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
				}
			}
		};
		//查询
		$scope.checkAccProcesseDetail = function(event){
			$scope.accProcesseInfo = $.parseJSON(JSON.stringify(event));
			$scope.accProcesseInfo.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.accProcesseInfo.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.accProcesseInfo.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/accProcesseDetail.html',$scope.accProcesseInfo, {
				title : T.T('KHJ1800023'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
	});
	//核算处理查询详情
	webApp.controller('accProcesseDetailCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	//$scope.updateOperationMode = $scope.optModeInf2.operationMode;
	        	$scope.viewOperationMode = $scope.accProcesseInfo.operationMode;
	        }
	    };
		$scope.accProcesseInfo = $scope.accProcesseInfo;
		//'记账标识 I：内部帐 L：科目',
		if($scope.accProcesseInfo.accountingFlag == 'I') {
			$scope.accProcesseInfo.accountingFlagTrans = T.T('KHJ1800025');	
		}else if($scope.accProcesseInfo.accountingFlag == 'L'){
			$scope.accProcesseInfo.accountingFlagTrans = T.T('KHJ1800026');
		}
		//'借贷方向 D：借方 C：贷方',
		if($scope.accProcesseInfo.drcrFlag == 'D') {
			$scope.accProcesseInfo.drcrFlagTrans = T.T('KHJ1800027');	
		}else if($scope.accProcesseInfo.drcrFlag == 'C'){
			$scope.accProcesseInfo.drcrFlagTrans = T.T('KHJ1800028');
        }
    });
	//查询争议账户查询 
	webApp.controller('transDisputeAccDetailCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		/*溢缴款冻结状态 F-已冻结，U-已解冻，N-无冻结
		额度占用标识： 1-占额，0-不占额
		状态码：D-登记未释放，C-已释放利于客户，B-已释放利于银行*/
		//溢缴款冻结状态
		//$scope.overpayFreezeStatusArr = [{name : T.T('KHJ1800029'),id : 'F'},{name : T.T('KHJ1800030'),id : 'U'},{name : T.T('F00109'),id : 'N'}];
		//额度占用标识
		//amtOccFlagArr = [{name : T.T('KHJ1800031'),id : '1'},{name : T.T('KHJ1800033'),id : '0'}];
		//状态码
		//$scope.statusCodeArr = [{name : T.T('KHJ1800033'),id : 'D'},{name : T.T('KHJ1800034'),id : 'C'},{name : T.T('KHJ1800035'),id : 'B'}];
		//溢缴款冻结状态
		$scope.overpayFreezeStatusArr  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_overpayFreezeStatus",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//额度占用标识
		$scope.amtOccFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_amtOccFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//状态码
		$scope.statusCodeArr={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_statusCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//查询争议账户详情
		$scope.queryDisputeInf = function(){
			$scope.params = {
				customerNo : $scope.disputeItem.customerNo,
				currencyCode: $scope.disputeItem.postingCurrencyCode,//入账币种
				externalIdentificationNo : $scope.disputeItem.externalIdentificationNo,
				oldGlobalSerialNumbr: $scope.disputeItem.globalSerialNumbr,
			};
			jfRest.request('accBscInf', 'queryDisputeAccList', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData){
						if(data.returnData.rows){
							$scope.disputeInf = data.returnData.rows[0];
							//账户组织形式
							if($scope.disputeInf.accountOrganForm == "R"){
								$scope.disputeInf.accountOrganFormTrans = T.T('KHJ1800036');//"循环";
							}else if($scope.disputeInf.accountOrganForm == "T"){
								$scope.disputeInf.accountOrganFormTrans = T.T('KHJ1800037');//"交易";
                            }
                            //账户性质
							if($scope.disputeInf.businessDebitCreditCode=='C'){
								$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ1800038');//"贷记";
							}else if($scope.disputeInf.businessDebitCreditCode=='D'){
								$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ1800039');//"借记";
                            }
                            //账户状态
							if($scope.disputeInf.statusCode==1){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800040');//"活跃账户";
							}else if($scope.disputeInf.statusCode==2){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800041');//"非活跃账户";
							}else if($scope.disputeInf.statusCode==3){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800042');//"冻结账户";
							}else if($scope.disputeInf.statusCode==8){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800043');//"关闭账户";
							}else if($scope.disputeInf.statusCode==9){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800044');//"待删除账户";
                            }
                        }
					}
				} 
			});
		};
		$scope.queryDisputeInf();
	});
	//分期账户信息查询
	webApp.controller('stagingAccInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemDetailInf = $scope.itemDetailInf;
		$scope.paramsObj ={
			oldGlobalSerialNumbr :$scope.itemDetailInf.globalSerialNumbr,
			//accountId: $scope.itemDetailInf.accountId,
			externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo
		};
		jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.obj){
					$scope.totalBalance = data.returnData.obj.totalBalance;
					$scope.itemInf = data.returnData.obj;
					if($scope.itemInf.status == '0'){
						$scope.statusInfo = T.T('KHJ1800045');
					}else if($scope.itemInf.status == '1'){
						$scope.statusInfo = T.T('KHJ1800046');
					}else if($scope.itemInf.status == '2'){
						$scope.statusInfo = T.T('KHJ1800047');
					}else if($scope.itemInf.status == '3'){
						$scope.statusInfo = T.T('KHJ1800048');
					}
					else if($scope.itemInf.status == '4'){
						$scope.statusInfo = T.T('KHJ1800049');
					}
					if($scope.itemInf.currencyCode == '156'){
						$scope.currencyCodeInfo = T.T('KHJ1800050');
					}else if($scope.itemInf.currencyCode == '840'){
						$scope.currencyCodeInfo = T.T('KHJ1800051');
					}
					if($scope.itemInf.repayMode == '0'){
						$scope.repayModeInfo = T.T('KHJ1800052');
					}else if($scope.itemInf.repayMode == '2'){
						$scope.repayModeInfo = T.T('KHJ1800053');
					}else if($scope.itemInf.repayMode == '3'){
						$scope.repayModeInfo = T.T('KHJ1800054');
					}else if($scope.itemInf.repayMode == '4'){
						$scope.repayModeInfo = T.T('KHJ1800055');
					}
					else if($scope.itemInf.repayMode == '5'){
						$scope.repayModeInfo = T.T('KHJ1800056');
					}
					else if($scope.itemInf.repayMode == '13'){
						$scope.repayModeInfo = T.T('KHJ1800057');
					}
					if($scope.itemInf.loanType == 'MERH'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600009');//"商户分期";
					}else if($scope.itemInf.loanType == 'TXAT'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600010');//"自动分期";
					}else if($scope.itemInf.loanType == 'CASH'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600011');//"现金分期";
					}else if($scope.itemInf.loanType == 'STMT'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600012');//"账单分期";
					}else if($scope.itemInf.loanType == 'TRAN'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600013');//"交易分期";
					}else if($scope.itemInf.loanType == 'LOAN'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600054');//"消费信贷";
					}else if($scope.itemInf.loanType == 'APAY'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600155');//"随借随还";
                    }
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
				//'accountId': $scope.itemDetailInf.accountId,
				oldGlobalSerialNumbr :$scope.itemDetailInf.globalSerialNumbr,
				'externalIdentificationNo' : $scope.itemDetailInf.externalIdentificationNo,
				'currencyCode':$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//余额单元入账情况查询  弹窗
	webApp.controller('balUnitPostingQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.balUnitInfoTable = {
			params : {
				"idType" : $scope.balUnitPostingParams.idType,
				"idNumber" : $scope.balUnitPostingParams.idNumber,
				"externalIdentificationNo" : $scope.balUnitPostingParams.externalIdentificationNo,
				"globalSerialNumbr" : $scope.balUnitPostingParams.globalSerialNumbr,
				"accountId" : $scope.balUnitPostingParams.accountId,
				"currencyCode" : $scope.balUnitPostingParams.currencyCode,
				"logLevel" : "B",
				"queryType" : "4",
				"balanceType":$scope.balUnitPostingParams.balanceType
			},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : true,
			isTrans: true,
			transParams: ['dic_balanceType'],
			transDict: ['balanceType_balanceTypeDesc'],
			callback : function(data) {
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.checkInfoModal = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo = $.extend($scope.transDetailInfo, $scope.balUnitPostingParams);
			$scope.modal('/cstSvc/txnInfEnqr/finaciTransDetailInfo.html',
			$scope.transDetailInfo, {
				title : T.T('KHJ1800003'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
		};
	});
	//部分退货金额
	webApp.controller('layerPartReturnedCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.partReturnedInf = $scope.e;
	});
	//2020/4/26  交易分期 
	webApp.controller('layerTradeStage1Ctrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingInfo =$scope.params;
		//币种
		$scope.ccy = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_curreny",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//费用收取方式
		$scope.ectypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ecommFeeCollectType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分期期数
		$scope.termArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_stageTerm",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				queryType:"stage",
				 stageType:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
			}
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.stagingParams = {};
			$scope.stagingParams.eventNo = $scope.itemList.checkedList().eventNo;//事件号
			$scope.stagingParams.ecommTransPostingAmount = $scope.stagingInfo.transAmount;//分期金额
			$scope.stagingParams.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingParams.currBillFlag = '1'; 
			$scope.stagingParams.ecommSourceCde = 'L';
			$scope.stagingParams.postingAmount = $scope.stagingInfo.postingAmount;//入账金额
			$scope.stagingParams.ecommTransPostingCurr = $scope.stagingInfo.transCurrCde;
			$scope.stagingParams.ecommProdObjId = $scope.stagingInfo.productObjectCode;//产品对象代码
			$scope.stagingParams.ecommCustId = $scope.stagingInfo.customerNo;//客户号码
			$scope.stagingParams.ecommPostingAcctNmbr = $scope.stagingInfo.accountId;////账户号
			$scope.stagingParams.ecommBusineseType = $scope.stagingInfo.businessTypeCode;//业务类型
		    $scope.stagingParams.installmentAmount= $scope.stagingInfo.installmentAmount;//已分期金额
			$scope.stagingParams.transState = $scope.stagingInfo.transState;
			$scope.stagingParams.ecommOrigGlobalSerialNumbr = $scope.stagingInfo.globalSerialNumbr;
			$scope.stagingParams.ecommInstallmentPeriod = $scope.stagingInfo.ecommInstallmentPeriod;//分期期数
		    $scope.stagingParams.ecommFeeCollectType = $scope.stagingInfo.ecommFeeCollectType;//费用收取方式
			$scope.stagingParams.ecommInstallmentBusinessType = $scope.stagingInfo.ecommInstallmentBusinessType;//分期业务类型
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingParams,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//交易分期试算弹框
		$scope.trialByStagesInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.params = $scope.stagingInfo;
			$scope.params.eventNo = $scope.itemList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
			$scope.params.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;
			$scope.params.ecommTransAmount=$scope.stagingInfo.transAmount;
			if(!$scope.itemList.validCheck()){
				return;
            }
            if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/cstSvc/txnInfEnqr/transactionDetail/stagingRoundsDetail.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
	});
});
