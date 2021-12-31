'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易类活动日志查询
webApp.controller('busNoOutBillQueryCtr',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
	$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
	$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
	$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busNoOutBillQuery');
	$translate.refresh();
	$scope.menuName = lodinDataService.getObject("menuName");
	$scope.topParams = {};
	$scope.topParams1 = {};
	$scope.topParams2 = {};
	$scope.currencyObj = {};//币种对象
	$scope.isShowMoneyType = false;//币种模块
	$scope.isShowDate = false; //账单日期模块
	$scope.isShowBusUnitBillDetail = false; //根据预算单位查询 表
	$scope.isShowExternaBillDetail = false; //根据外部识别号查询 表
	$scope.ectypeArray = [{name : T.T('GWJ500003'),id : '0'},{name :  T.T('GWJ500004'),id : '1'}];
	$scope.reset = function(){
		$scope.topParams1.idNumber = '';
		$scope.topParams1.idType = '';
		$scope.topParams2.externalIdentificationNo = '';
		$scope.isShowMoneyType = false;
		$scope.isShowBusUnitBillDetail = false; //根据预算单位查询 表
		$scope.isShowExternaBillDetail = false; //根据外部识别号查询 表
		$scope.isShowPosting = false;
	};
	//预算单位查询表
	$scope.busUnitBillTable =  {
		params : {
			"pageSize" : 10,
			"indexNo" : 0
		},
		paging : true,
		resource : 'billManages.queryNum',
		autoQuery : false,
		isTrans: true,
		transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
		transDict: ['idType_idTypeDesc','invalidFlag_invalidFlagDesc'],
		callback : function(data) {
			if(data.returnCode == '000000'){
				if(!data.returnData.rows || data.returnData.rows.length == 0){
					data.returnData.rows = [];
				}
			}else {
				$scope.isShowBusUnitBillDetail = false;
            }
        }
	};
	//根据外部识别号 查询账单表
	$scope.externaBillTable =  {
		params : {
			"pageSize" : 10,
			"indexNo" : 0
		},
		paging : true,
		resource : 'billManages.querybusNoOut',
		autoQuery : false,
		callback : function(data) {
			if(data.returnCode == '000000'){
				//如果总汇字段为空类型
                if(data.returnData.obj == null){
                    $scope.externaBillTable.params.actualPostingAmount = '';
                }else{
                    $scope.externaBillTable.params.actualPostingAmount = data.returnData.obj.actualPostingAmount;//定义页面上的总汇展示
                }
				if(!data.returnData.rows || data.returnData.rows.length == 0){
					data.returnData.rows = [];
				}
			}else {
				var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035');
				jfLayer.fail(returnMsg);
				$scope.isShowExternaBillDetail = false;
            }
        }
	};
	//下拉框查询币种
	$scope.moneyType = {};
	$scope.queryMoney = function(params){
		$scope.moneyType ={
		        type:"dynamic",
		        param:{
		        	externalIdentificationNo: params.externalIdentificationNo
		        },
		        text:"currencyName", //下拉框显示内容，根据需要修改字段名称
		        value:'currencyCode',  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"unsettledList.query",//数据源调用的action
		        callback : function(data) {

		        }
	    };
	};
	//下拉框 查询业务项目
	$scope.businessProgramNArr = {};
	$scope.queryBusinessPro = function(params){
		$scope.businessProgramNArr ={
		        type:"dynamic",
		        param:{
		        		queryBusinessProgramNo : true,
		        		externalIdentificationNo: params.externalIdentificationNo//默认查询条件
		        	} ,//默认查询条件
		        text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称
		        value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"unsettledList.query",//数据源调用的action
		        callback: function(data){

		        }
		};
	};
	//联动 选择业务项目 查询账单日期
	var form = layui.form;
	form.on('select(getBusinessProgramNo)',function(event){
		$scope.queryDateParams = {
				idType: $scope.topParams1.idType,
				idNumber: $scope.topParams1.idNumber,
				externalIdentificationNo: $scope.topParams2.externalIdentificationNo,
				queryDate:true,
				businessProgramNo:event.value
		};
		jfRest.request('unsettledList', 'query', $scope.queryDateParams).then(function(data) {
			if(data.returnCode == '000000'){
				if(data.returnData.obj){
					$scope.isShowDate = true;
					$scope.currencyObj.startDate = data.returnData.obj.startDate;
					$scope.currencyObj.endDate = data.returnData.obj.endDate;
                }
            }
		});
	});
	//查询按钮
	$scope.queryBillBtn = function() {
		if($scope.topParams1.idNumber && ($scope.topParams2.externalIdentificationNo == '' || $scope.topParams2.externalIdentificationNo == undefined ||
            $scope.topParams2.externalIdentificationNo == null || $scope.topParams2.externalIdentificationNo == 'null')){
			$scope.topParams1.idType = '7';
            	//根据预算单位查询 一堆表
				$scope.isShowBusUnitBillDetail = true;
				$scope.busUnitBillTable.params = $.extend($scope.busUnitBillTable.params,$scope.topParams1);
				$scope.busUnitBillTable.search();

		}else if($scope.topParams2.externalIdentificationNo){
				//币种
				$scope.isShowMoneyType = true;
				//下拉框查询币种
				$scope.queryMoney($scope.topParams2);
				//下拉框 查询业务项目
				$scope.queryBusinessPro($scope.topParams2);
				/*$scope.externaBillTable.params = $.extend($scope.externaBillTable.params,$scope.topParams2);
				$scope.externaBillTable.search();*/
		}else {
			jfLayer.fail(T.T('F00076'));  //'输入一种查询条件即可！');
        }
    };
	//查询未出账单
	$scope.queryNoOutBill = function(){
		$scope.queryParams = {
			externalIdentificationNo : $scope.topParams2.externalIdentificationNo,
			currencyCode: $scope.currencyObj.currencyCode,
			businessProgramNo: $scope.currencyObj.businessProgramNo,
			startDate: $scope.currencyObj.startDate,
			endDate: $scope.currencyObj.endDate,
		};
		$scope.isShowExternaBillDetail = true;
		$scope.isShowDate = true;
		$scope.externaBillTable.params = $.extend($scope.externaBillTable.param,$scope.queryParams);
		$scope.externaBillTable.search();
	};
	//点击 预算单位列表 查询按钮
	$scope.queryRelativeExterna = function(item){
		$scope.item = $.parseJSON(JSON.stringify(item));
		$scope.isShowBusUnitBillDetail = false;
		$scope.isShowMoneyType = true;
		$scope.topParams2.externalIdentificationNo =  $scope.item.externalIdentificationNo;
		$scope.topParams1.idNumber = '';
		$scope.topParams1.idType = '';
		$scope.currencyObj = {};
		//下拉框查询币种
		$scope.queryMoney($scope.topParams2);
		//下拉框 查询业务项目
		$scope.queryBusinessPro($scope.topParams2);
	};
	// 关联交易列表
	$scope.queryRelativeTrans = function(event) {
		$scope.isShowRelation = true;
		$scope.isShowSameSource = false;
		$scope.isShowPosting = false;
		$scope.transRelativeParams = $.parseJSON(JSON.stringify(event));
		$scope.relativeTransTable.params = {
			"globalSerialNumbr" : $scope.transRelativeParams.globalSerialNumbrRelative
		};
		//$scope.relativeTransTable.params = $.extend($scope.relativeTransTable.params, $scope.hide_transQuery);
		$scope.relativeTransTable.search();
	};
	$scope.relativeTransTable = {
		params : {},
		paging : true,
		resource : 'finacialTrans.query',
		autoQuery : false,
		callback : function(data) {
		}
	};
	// 同源交易列表
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
			"queryType" : "1",
			"externalIdentificationNo":$scope.topParams2.externalIdentificationNo
		};
		$scope.sameSourceTransTable.params = $.extend($scope.sameSourceTransTable.params, $scope.hide_transQuery);
		$scope.sameSourceTransTable.search();
	};
	$scope.sameSourceTransTable = {
		params : {},
		paging : true,
		resource : 'finacialTrans.query',
		autoQuery : false,
		callback : function(data) {
		}
	};
	// 入账情况列表,查询余额类型入账情况
	$scope.queryPostingInfo = function(event) {
		$scope.isShowRelation = false;
		$scope.isShowSameSource = false;
		$scope.isShowPosting = true;
		$scope.transPostingParams = $.parseJSON(JSON.stringify(event));
		$scope.postingInfoTable.params = {
				"globalSerialNumbr" : $scope.transPostingParams.globalSerialNumbr,
				"accountId" : $scope.transPostingParams.accountId,
				"currencyCode" : $scope.transPostingParams.currencyCode,
				"logLevel" : "T",
				"externalIdentificationNo":$scope.topParams2.externalIdentificationNo
		};
		$scope.postingInfoTable.params = $.extend($scope.postingInfoTable.params, $scope.hide_transQuery);
		$scope.postingInfoTable.search();
	};
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
	// 关联交易列表中的同源交易按钮
	$scope.querySameSourceTrans2 = function(event) {
		$scope.isShowRelation = true;
		$scope.isShowSameSource = ture;
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
	};
	// 余额单元入账情况查询
	$scope.queryBalUnitInfo = function(event) {
		$scope.balUnitPostingParams = $.parseJSON(JSON.stringify(event));
		$scope.balUnitPostingParams = $.extend($scope.balUnitPostingParams, $scope.hide_transQuery);
		$scope.modal('/cstSvc/txnInfEnqr/balUnitPostingInfo.html',
			$scope.balUnitPostingParams, {
				title : T.T('KHJ1800002'),
				buttons : [ T.T('F00012') ],
				size : [ '1100px', '550px' ],
				callbacks : []
			});
	};
	// 页面弹出框事件(弹出页面)
	$scope.checkInfo = function(event) {
		$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
		$scope.transDetailInfo = $.extend($scope.transDetailInfo, $scope.hide_transQuery);
		$scope.modal(
			'/cstSvc/txnInfEnqr/finaciTransDetailInfo.html',
			$scope.transDetailInfo, {
				title : T.T('KHJ1800003'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
	};
});
//交易分期
webApp.controller('transStageCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
	$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
	$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
	$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busNoOutBillQuery');
	$translate.refresh();
//	$scope.ectypeArray = [{name : T.T('GWJ500003'),id : '0'},{name : T.T('GWJ500004'),id : '1'}];
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
	$scope.stageInf.loanAmt = $scope.stageInf.billAmt;
/*	  *//** 账户代码 *//*
    private String accountId;
    *//** 余额对象代码 *//*
    private String balanceObjectCode;
    *//** 入账币种 *//*
    private String postingCurrencyCode;
    *//** 入账日期 *//*
    private String occurrDate;
    *//** 入账金额 *//*
    private BigDecimal postingAmount;*/
	//获得可分期最大金额
	$scope.paramss = {
			idType: $scope.stageInf.idType,
			idNumber: $scope.stageInf.idNumber,
			externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
			accountId: $scope.stageInf.accountId,
			balanceObjectCode: $scope.stageInf.balanceObjectCode,
			postingCurrencyCode: $scope.stageInf.postingCurrencyCode,
			occurrDate: $scope.stageInf.occurrDate,
			postingAmount: $scope.stageInf.postingAmount,
			customerNo:$scope.stageInf.customerNo,
		//	businessProgramNo: $scope.stageInf.businessProgramNo,
		//	businessProgramNo: 'MODG00020',
			businessTypeCode: $scope.stageInf.businessTypeCode,
			ecommOrigGlobalSerialNumbr : $scope.stageInf.globalSerialNumbr,
	};
	//Tansun.param($scope.pDCfgInfo)
	jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
		if(data.returnCode == '000000'){
			$scope.stageInf.billAmt = data.returnData.billAmt;

		}
	});
//	$scope.termArr =[{name: T.T('KHJ1800004'),id:"3"},{name: T.T('KHJ1800005'),id:"6"},{name: T.T('KHJ1800006'),id:"9"},{name: T.T('KHJ1800007'),id:"12"},{name: T.T('KHJ1800009'),id:"24"}]
	$scope.termArr ={
        type:"dictData",
        param:{
        	"type":"DROPDOWNBOX",
        	groupsCode:"dic_stageTerm",
        	queryFlag: "children"
        },//默认查询条件
        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
        resource:"paramsManage.query",//数据源调用的action
        callback: function(data){
        }
	};
	if($scope.stageInf.currencyCode == "156"){
		$scope.stageInf.currencyCodeTrans = T.T('KHJ1800009');
	}else if($scope.stageInf.currencyCode == "840"){
		$scope.stageInf.currencyCodeTrans = T.T('KHJ1800010');
	}
	//账单分期列表
	$scope.billStageInfoList = {
		autoQuery:false,
		params : {
				"pageSize":10,
				"indexNo":0
		}, // 表格查询时的参数信息
		paging : true,// 默认true,是否分页
		resource : 'billingInfoEnqr.stageTrial',// 列表的资源
		callback : function(data) { // 表格查询后的回调函数
			console.log(data);
			if (data.returnCode == '000000') {
				$scope.isShowStageResultInfo = true; //分期试算结果
				//$scope.stageInf.accountId =  data.returnData.obj.accountId;
				$scope.stageInf.customerNo =  data.returnData.obj.ecommCustId;
				$scope.stageInf.ecommBusineseType = data.returnData.obj.ecommBusineseType;
				$scope.stageInf.loanAmt = data.returnData.obj.loanAmt;
				$scope.stageInf.feeRate = data.returnData.obj.feeRate;
				$scope.stageInf.allFeeAmt = data.returnData.obj.allFeeAmt;
				$scope.stageInf.ecommCustId =  data.returnData.obj.ecommCustId;
				$scope.stageInf.loanRate = data.returnData.obj.loanRate;
			}
		}
	};
	//分期试算
	$scope.stageTrial = function() {
		if($scope.stageInf.billAmt <  Number($scope.stageInf.loanAmt) ){
			jfLayer.alert(T.T('KHJ1800011'));
			return;
        }
        if($scope.stageInf.term  == '' || $scope.stageInf.term  == undefined || $scope.stageInf.term  == null ){
			jfLayer.alert(T.T('KHJ1800012'));
			return;
        }
        $scope.isShowStageResultInfo = true;
		$scope.trialParams= {
				idType: $scope.stageInf.idType,
				idNumber: $scope.stageInf.idNumber,
				externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
				ecommEntryId:$scope.stageInf.externalIdentificationNo,
				ecommFeeCollectType:$scope.stageInf.ecommFeeCollectType,
				ecommBusinessProgramCode: $scope.stageInf.businessProgramNo,// 业务项目
				ecommBusineseType: $scope.stageInf.businessTypeCode,
				ecommProdObjId:  $scope.stageInf.productObjectCode,
				ecommCustId: $scope.stageInf.customerNo,
				ecommTransPostingCurr: $scope.stageInf.currencyCode,//币种
				ecommInstallmentPeriod: $scope.stageInf.term,
				ecommTransAmount :$scope.stageInf.loanAmt,
				ecommInstallmentBusinessType: 'STMT',
				ecommPostingAcctNmbr :$scope.stageInf.accountId
		};
		$scope.billStageInfoList.params = $scope.trialParams;
		$scope.billStageInfoList.search();
	};
});
webApp.controller('balUnitPostingQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
	$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
	$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
	$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busNoOutBillQuery');
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
	webApp.controller('transDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busNoOutBillQuery');
		$translate.refresh();
//		$scope.ectypeArray = [{name : T.T('GWJ500003'),id : '0'},{name : T.T('GWJ500004'),id : '1'}];
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
		// 退货
		$scope.returnedPurchase = function(e) {
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
				"ecommTransDate" : $scope.ecommTransDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" : $scope.transStateParam,
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
		  			$scope.externaBillTable.search();
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
		  			$scope.externaBillTable.search();
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
		  			$scope.externaBillTable.search();
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
		  			$scope.externaBillTable.search();
					jfLayer.success(T.T('GWJ700001'));  //'争议释放有利于客户成功！');
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
		  			$scope.externaBillTable.search();
					jfLayer.success(T.T('GWJ700002'));  //'争议释放有利于银行成功！');
				}
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
    //交易分期试算弹窗stagingRoundsDetailCtrl
    webApp.controller('stagingRoundsDetailCtrl', function($scope, $stateParams, jfRest,
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


});
