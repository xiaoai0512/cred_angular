'use strict';
define(function(require) {
	var webApp = require('app');
	//交易分期
	webApp.controller('transactionListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.transactionInfo ={};
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
		$scope.transactionList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				stageType:0,
				queryType:"stage"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.transactionList.validCheck()) {
				return;
            }
            if(!$scope.transactionInfo.ecommEntryId){
				if($scope.showEx == true){
					 jfLayer.alert(T.T('FQJ900002'));//"请输入外部识别号！"
					 return;
				}
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.transactionList.checkedList().eventNo;
			$scope.transactionInfo.eventNo = $scope.transactionList.checkedList().eventNo;
			$scope.transactionInfo.ecommInstallmentBusinessType = $scope.transactionList.checkedList().installType;
			$scope.transactionInfo.ecommTransPostingAmount = $scope.transactionInfo.ecommTransAmount;//分期金额
			$scope.transactionInfo.ecommBillAmt = $scope.transactionInfo.billAmt;//最大可分期金额
			$scope.transactionInfo.externalIdentificationNo = $scope.transactionInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.transactionInfo.currBillFlag = '1'; 
			$scope.transactionInfo.ecommSourceCde = 'L';
			$scope.transactionInfo.ecommTransPostingAmount = $scope.transactionInfo.newEcommTransAmount;
			delete $scope.transactionInfo.ecommTranAmount;
			delete $scope.transactionInfo.postingAmount; //分期金额
			jfRest.request('fncTxnMgt', 'trends', $scope.transactionInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.transactionInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//选择交易信息账户
		$scope.choseAccBtn = function(){
			if(!$scope.transactionList.validCheck()){ //"请选中事件编号！"
				return;
			}else{
				$scope.transactionInfo.eventNo = $scope.transactionList.checkedList().eventNo;
			}
			if(!$scope.transactionInfo.ecommEntryId){
				 jfLayer.alert(T.T('KHJ1500003'));//"请输入外部识别号！"
				 return;
            }
            $scope.params = {
				externalIdentificationNo: $scope.transactionInfo.ecommEntryId,//外部识别号
				eventNo: $scope.transactionInfo.eventNo//事件号
			};
			// 页面弹出框事件(弹出页面)
			//交易分期-交易信息弹框
			$scope.modal('/stage/transactionStaging/transactionInfoBox.html', $scope.params, {
				title : T.T('FQJ900001'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '500px' ],
				callbacks : [$scope.sureAccInfo]
			});
		};
		//交易信息回调函数
		$scope.sureAccInfo = function(result){
			if(!result.scope.billDetails.validCheck()){
				return;
			}else {
				$scope.itemInf = result.scope.billDetails.checkedList();
            }
            if($scope.itemInf.installmentFlag == '0'){
				jfLayer.fail(T.T('FQJ900016'));
				return;
			}
			$scope.transactionInfo.postingAmount = $scope.itemInf.postingAmount; //入账金额
			$scope.transactionInfo.ecommTransPostingCurr = $scope.itemInf.transCurrCde;//入账币种
			$scope.transactionInfo.ecommProdObjId = $scope.itemInf.productObjectCode;//产品对象代码
			$scope.transactionInfo.ecommCustId = $scope.itemInf.customerNo;//客户号码
			$scope.transactionInfo.ecommPostingAcctNmbr = $scope.itemInf.accountId;//账户号
			$scope.transactionInfo.ecommBusineseType = $scope.itemInf.businessTypeCode;//业务类型
			$scope.transactionInfo.ecommBusinessProgramCode = $scope.itemInf.businessProgramNo;//业务项目  
			$scope.transactionInfo.newEcommTransAmount=$scope.itemInf.postingAmount;
			$scope.transactionInfo.ecommOrigGlobalSerialNumbr = $scope.itemInf.globalSerialNumbr;//全局事件号
			$scope.safeApply();
			result.cancel();
		};
		//分期试算弹框
		$scope.trialByStagesInfo = function(){
			if(!$scope.transactionList.validCheck()){
				return;
            }
            $scope.params = $scope.transactionInfo;
			$scope.params.eventNo = $scope.transactionList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.transactionList.checkedList().installType;
			$scope.params.externalIdentificationNo = $scope.transactionInfo.ecommEntryId;
			$scope.params.ecommTransAmount=$scope.transactionInfo.newEcommTransAmount;
			if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/stage/transactionStaging/tradeStagesTrial.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
	});
	//选择交易分期交易信息账户弹窗
	webApp.controller('transactionInfoBoxCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.billDetails = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {    
				"pageSize" : 10,
				"indexNo" : 0,
				activityNo:'X8010',
				logLevel:"A",
				transProperty:"O",
				externalIdentificationNo:$scope.params.externalIdentificationNo,
				payFlag : 'Y',
				ifTrans: 'true'//标识查可交易分期的数据
			}, // 表格查询时的参数信息 
			paging : true,// 默认true,是否分页
			resource : 'transaction.query',// 列表的资源
			isTrans: true,
			transParams: ['dic_ecommTransStatus'],
			transDict: ['transState_transStateDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//分期试算弹窗
	webApp.controller('tradeStagesTrialCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.tradeTrialItem = {};
		//分期试算
		$scope.tradeTrialList = {
			autoQuery:true,
			params : {
				"pageSize":10,
				"indexNo":0,
				eventNo: $scope.params.eventNo,//事件号
				ecommEntryId: $scope.params.ecommEntryId,//外部识别号
				ecommCustId: $scope.params.ecommCustId,//外部识别号
				ecommFeeCollectType: $scope.params.ecommFeeCollectType,//费用收取方式
				ecommBusineseType: $scope.params.ecommBusineseType,//业务类型
				ecommInstallmentPeriod: $scope.params.ecommInstallmentPeriod,//分期期数
				ecommPostingAcctNmbr: $scope.params.ecommPostingAcctNmbr,
				ecommProdObjId: $scope.params.ecommProdObjId,
				ecommTransAmount: $scope.params.ecommTransAmount,//分期金额
				ecommTransPostingCurr: $scope.params.ecommTransPostingCurr,
				ecommInstallmentBusinessType: $scope.params.ecommInstallmentBusinessType,//分期业务类型
				ecommBusinessProgramCode: $scope.params.ecommBusinessProgramCode,//业务项目
				externalIdentificationNo: $scope.params.ecommEntryId,
				receiveAccount:  $scope.params.receiveAccount,
				ecommSourceCde : $scope.params.ecommSourceCde,
				accountBankNo: $scope.params.accountBankNo,
				freeFlag: $scope.params.freeFlag,
				postingAmount: $scope.params.postingAmount,//入账金额
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.stageTrial',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.tradeTrialItem = data.returnData.obj;
				}
			}
		};
	});
});
