'use strict';
define(function(require) {
	var webApp = require('app');
	//现金分期
	webApp.controller('cashStageCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingInfo ={};
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
		$scope.cashList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				stageType:3,
				queryType:"stage"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.cashList.validCheck()) {
				return;
            }
            if(!$scope.stagingInfo.ecommEntryId){
				if($scope.showEx == true){
					 jfLayer.alert(T.T('FQJ900002'));//"请输入外部识别号！"
					 return;
				}
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.cashList.checkedList().eventNo;
			$scope.stagingInfo.eventNo = $scope.cashList.checkedList().eventNo;
			$scope.stagingInfo.ecommInstallmentBusinessType = $scope.cashList.checkedList().installType;
			$scope.stagingInfo.ecommTransPostingAmount = $scope.stagingInfo.ecommTransAmount;//分期金额
			//$scope.stagingInfo.ecommBillAmt = $scope.stagingInfo.billAmt;//最大可分期金额
			$scope.stagingInfo.externalIdentificationNo = $scope.stagingInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingInfo.currBillFlag = '1'; 
			$scope.stagingInfo.ecommSourceCde = 'L';
			if($scope.stagingInfo.eventNo == "ILS.RT.40.0006"){//交易分期
				$scope.stagingInfo.ecommTransPostingAmount = $scope.stagingInfo.newEcommTransAmount;
				delete $scope.stagingInfo.ecommTranAmount;
				delete $scope.stagingInfo.postingAmount; //分期金额
			}
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//现金分期试算弹框
		$scope.trialByStagesInfo = function(){
			if(!$scope.cashList.validCheck()){
				return;
            }
            $scope.params = $scope.stagingInfo;
			$scope.params.eventNo = $scope.cashList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.cashList.checkedList().installType;
			$scope.params.externalIdentificationNo = $scope.stagingInfo.ecommEntryId;
			// 页面弹出框事件(弹出页面)现金分期试算弹框
			$scope.modal('/cstSvc/cashStage/cashTrial.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
	});
	//现金分期试算弹窗
	webApp.controller('cashTrialCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.trialList = {};
		//现金分期试算
		$scope.cashTrialInfo = {
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
					$scope.trialList = data.returnData.obj;
				}
			}
		};
	});
});
