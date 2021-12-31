'use strict';
define(function(require) {
	var webApp = require('app');
	//账单分期
	webApp.controller('stagingBillsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingItem ={};
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
		//交易来源
		$scope.ecommCardAssociationsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ecommSourceCde",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分期方式
		$scope.freeFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_byStages",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件清单列表
		$scope.stagingBillsList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				stageType:1,
				queryType:"stage"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.stagingBillsList.validCheck()) {
				return;
            }
            if(!$scope.stagingBillsList.ecommEntryId){
				if($scope.showEx == true){
					 jfLayer.alert(T.T('FQJ900002'));//"请输入外部识别号！"
					 return;
				}
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.stagingBillsList.checkedList().eventNo;
			$scope.stagingItem.eventNo = $scope.stagingBillsList.checkedList().eventNo;
			$scope.stagingItem.ecommInstallmentBusinessType = $scope.stagingBillsList.checkedList().installType;
			$scope.stagingItem.ecommTransPostingAmount = $scope.stagingItem.ecommTransAmount;//分期金额
			$scope.stagingItem.ecommBillAmt = $scope.stagingItem.billAmt;//最大可分期金额
			$scope.stagingItem.externalIdentificationNo = $scope.stagingItem.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingItem.currBillFlag = '1'; 
			$scope.stagingItem.ecommSourceCde = 'L';
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingItem,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingItem = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//选择交易信息账户
		$scope.choseAccBtn = function(){
			if(!$scope.stagingBillsList.validCheck()){ //"请选中事件编号！"
				return;
			}else{
				$scope.stagingItem.eventNo = $scope.stagingBillsList.checkedList().eventNo;
			}
			if(!$scope.stagingItem.ecommEntryId){
				 jfLayer.alert(T.T('KHJ1500003'));//"请输入外部识别号！"
				 return;
            }
            $scope.params = {
				externalIdentificationNo: $scope.stagingItem.ecommEntryId,//外部识别号
				eventNo: $scope.stagingItem.eventNo//事件号
			};
			$scope.modal('/stage/stagingBills/billStagingDetail.html', $scope.params, {
				title : T.T('FQJ900005'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '500px' ],
				callbacks : [$scope.billStage]
			});
		};
		//账单分期交易信息明细2次查询
		$scope.billStage = function(result) {
			if(!result.scope.billDetails.validCheck()){
				return;
			}else {
				$scope.stageInf = result.scope.billDetails.checkedList();
            }
            $scope.paramss = {
				customerNo:$scope.stageInf.customerNo,
				currentCycleNumber:$scope.stageInf.currentCycleNumber,
				businessProgramNo: $scope.stageInf.businessProgramNo,
				businessTypeCode: $scope.stageInf.businessTypeCode,
				postingCurrencyCode: $scope.stageInf.currencyCode,
				externalIdentificationNo: $scope.stagingItem.ecommEntryId,
				postingAmount: $scope.stageInf.postingAmount
			};
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
				if (data.returnData != null) {
					$scope.itemInf = $scope.stageInf;
					
					if (data.returnData.rows && data.returnData.rows.length > 0 ) {
						$scope.stagingItem.billAmt = data.returnData.rows[0].billAmt//入账金额
					}
					
					$scope.stagingItem.ecommTransPostingCurr = $scope.itemInf.currencyCode;//入账币种
					$scope.stagingItem.ecommProdObjId = $scope.itemInf.productObjectCode;//产品对象代码
					$scope.stagingItem.ecommCustId = $scope.itemInf.customerNo;//客户号码
					$scope.stagingItem.ecommPostingAcctNmbr = $scope.itemInf.currentCycleNumber;//账户号
					$scope.stagingItem.ecommBusineseType = $scope.itemInf.businessTypeCode;//业务类型
					$scope.stagingItem.ecommBusinessProgramCode = $scope.itemInf.businessProgramNo;//业务项目  
					$scope.stagingItem.ecommPostingAcctNmbr=$scope.itemInf.accountId;
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//交易信息回调函数
		$scope.sureAccInfo = function(result){
			if(!result.scope.billDetails.validCheck()){
				return;
			}else {
				$scope.itemInf = result.scope.billDetails.checkedList();
            }
            $scope.stagingItem.postingAmount = $scope.itemInf.postingAmount; //入账金额
			$scope.stagingItem.ecommTransPostingCurr = $scope.itemInf.transCurrCde;//入账币种
			$scope.stagingItem.ecommProdObjId = $scope.itemInf.productObjectCode;//产品对象代码
			$scope.stagingItem.ecommCustId = $scope.itemInf.customerNo;//客户号码
			$scope.stagingItem.ecommPostingAcctNmbr = $scope.itemInf.accountId;//账户号
			$scope.stagingItem.ecommBusineseType = $scope.itemInf.businessTypeCode;//业务类型
			$scope.stagingItem.ecommBusinessProgramCode = $scope.itemInf.businessProgramNo;//业务项目  
			$scope.stagingItem.newEcommTransAmount=$scope.itemInf.postingAmount;
			$scope.stagingItem.ecommOrigGlobalSerialNumbr = $scope.itemInf.globalSerialNumbr;//全局事件号
			$scope.safeApply();
			result.cancel();
		};
		//分期试算弹框
		$scope.trialByStagesInfo = function(){
			if(!$scope.stagingBillsList.validCheck()){
				return;
            }
            $scope.params = $scope.stagingItem;
			$scope.params.eventNo = $scope.stagingBillsList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.stagingBillsList.checkedList().installType;
			$scope.params.externalIdentificationNo = $scope.stagingItem.ecommEntryId;
			if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/stage/stagingBills/billTrialIofo.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
	});
	//选择账单分期交易信息账户弹窗billStagingDetailCtrl
	webApp.controller('billStagingDetailCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.showDiv=false;
		$scope.paychoseAccList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				externalIdentificationNo:$scope.params.externalIdentificationNo,
				payFlag : 'Y'
			}, // 表格查询时的参数信息                         
			paging : true,// 默认true,是否分页 
			resource : 'billStaging.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.productObjectListTable = function(){
			$scope.paychoseAccList.params.accountId = '';
			$scope.paychoseAccList.params.businessTypeCode = '';
		};
		//查询账单交易明细
		$scope.checkItem = function(event) {
			$scope.showDiv=true;
			$scope.itemInf=event;
			$scope.itemInf.externalIdentificationNo = $scope.params.externalIdentificationNo;
			$scope.queryParams= {
				externalIdentificationNo:$scope.itemInf.externalIdentificationNo,
				customerNo: $scope.itemInf.customerNo,
				currencyCode: $scope.itemInf.currencyCode,
				billDate: $scope.itemInf.billDate,
				businessProgramNo: $scope.itemInf.businessProgramNo,
				productObjectCode: $scope.itemInf.productObjectCode,
				//businessTypeCode: $scope.itemInf.businessTypeCode,
			};
			$scope.billDetails.params = $scope.queryParams;
			$scope.billDetails.search($scope.queryParams);
		};
		//账单分期交易信息明细
		$scope.billDetails = {
			autoQuery:false,
			checkType : 'radio', // 当为checkbox时为多选
			params :{}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryBsnisType',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
				}
			}
		};
	});
	//分期试算弹窗
	webApp.controller('billTrialIofoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.billTrial = {};
		//分期试算
		$scope.billTrialList = {
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
				//installmentAmount: $scope.params.installmentAmount,//已分期金额
				postingAmount: $scope.params.postingAmount,//入账金额
				//transState: $scope.params.transState,//分期状态
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.stageTrial',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.billTrial = data.returnData.obj;
				}
			}
		};
	});
});
