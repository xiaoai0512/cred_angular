'use strict';
define(function(require) {

	var webApp = require('app');
	//信贷交易账户信息
	webApp.controller('creditTradeCardCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		
		//搜索身份证类型
				$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},
				{name : T.T('PZJ100021'),id : '0'} ];	
		
		
    	$scope.isButtonLoan = true;
		$scope.isShowCreditTrade = false;
		//重置
		$scope.reset = function() {
			$scope.creditTradeList.params.externalIdentificationNo= '';
			
			$scope.isShowCreditTrade = false;
		};
		
		//信贷交易账户信息列表
		$scope.creditTradeList = {
			//checkType : 'checkbox',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalmentsCard.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShowCreditTrade = true;
				}else {
					$scope.isShowCreditTrade = false;
				}
			}
		};
		$scope.searchBtn = function() {
			if($scope.creditTradeList.params.externalIdentificationNo == null || $scope.creditTradeList.params.externalIdentificationNo == "" || $scope.creditTradeList.params.externalIdentificationNo == undefined){
				jfLayer.alert(T.T('F00076'));//"输入查询条件"
			}
			else {
				$scope.creditTradeList.search();
			}
		};
		
		//分期调整弹窗
		$scope.stageAdjust = function(event) {
			$scope.stageAdjustItem= $.parseJSON(JSON.stringify(event));
			console.log($scope.stageAdjustItem);
			$scope.modal('/cstSvc/instalmentsQuery/viewStageAdjust-JY.html', $scope.stageAdjustItem, {
				title : '分期调整',
				buttons : [ '分期调整','关闭' ],
				size : [ '900px', '500px' ],
				callbacks : [$scope.stageAdjustHandle]
			});
		};
		//确定分期调整
		$scope.stageAdjustHandle = function(result){
			$scope.stageAdjustInfo = result.scope.stageAdjustItem;
			console.log($scope.stageAdjustInfo);
			$scope.params ={
					    ecommPostingAcctNmbr : $scope.stageAdjustInfo.accountId,//账户
					    ecommInstallmentPeriod : $scope.stageAdjustItem.loanTerm,//期数
					    ecommEntryId : $scope.stageAdjustItem.externalIdentificationNo,//外部识别号
					    ecommTransPostingCurr : $scope.stageAdjustItem.currencyCode,//币种
					    ecommFeeRate :$scope.stageAdjustItem.feeRate//费率
			};
			
			jfRest.request('instalmentsCard', 'stageAjust', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("分期调整成功！");
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		
		// 退货
		$scope.returnedPurchase = function(item) {
			console.log(item);
			/*var url;
			if(item.loanType == 'TXAT' || item.loanType == 'TRAN'){
				url = 'returnedPurchase3';
			};*/
			$scope.params = {
				//"idType" : item.idType,
				//"idNumber" : item.idNumber,
				"externalIdentificationNo" : item.externalIdentificationNo,
				//"ecommOrigGlobalSerialNumbr" : item.globalSerialNumbr,
				//"ecommEntryId" : item.externalIdentificationNo,
				//"ecommOrigEventId" : item.eventNo,
				//"ecommTransCurr" : item.transCurrCde,
				//"ecommTransAmount" : item.loanAmount,
				//"ecommTransDate" : item.transDate,
				"ecommTransPostingCurr" : item.currencyCode,
				//"ecommTransPostingAmount" : item.loanAmount,
				//"ecommTransStatus" : item.transState,
				//"ecommOriTransDate" : item.payDate,
				//"ecommClearAmount" : item.loanAmount,
				"ecommPostingAcctNmbr": item.accountId,
				//"ecommBalType": item.balanceType,
				"ecommCustId" : item.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			
			
			jfRest.request('finacialTrans', 'returnedPurchase3', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00054'));
				} 
			});

		};
		
		// 提前结清
		$scope.preHandler = function(item) {
			console.log(item);
			$scope.params = {
				"externalIdentificationNo" : item.externalIdentificationNo,
				"ecommTransPostingCurr" : item.currencyCode,
				"ecommPostingAcctNmbr": item.accountId,
				"ecommCustId" : item.customerNo,
				"ecommTriggerFlag" : "pageTrigger",//因为批量提前结清也是调用了这个事件，为了在活动中进行区分，在这里加一个“页面触发”的标识
			};
			
			
			jfRest.request('fncTxnMgtTest', 'triggerILSRT408001', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00064'));
				}
			});

		};
		
		//详情
		$scope.checkInfo = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			console.log($scope.itemDetailInf);
			$scope.modal('/cstSvc/txnInfEnqr/viewCreditTradeCard.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				//callbacks : [$scope.sureHandle]
				callbacks : [ ]
			});
		};
		
		//确定提前结清
		$scope.sureHandle = function(result) {
			console.log(result);
			$scope.itemInfo = result.scope.itemInf;
			$scope.params ={
					ecommPostingAcctNmbr: $scope.itemInfo.accountId,
					ecommCustId: $scope.itemInfo.customerNo,
					ecommTransPostingCurr:$scope.itemInfo.currencyCode
			};
			jfRest.request('instalmentsCard', 'earlySettle', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		
		//确定还款
		$scope.sureRepayment = function(result) {
			$scope.itemInfo = result.scope.itemInf;
			$scope.params ={
					ecommPostingAcctNmbr: $scope.itemInfo.accountId,
					ecommCustId: $scope.itemInfo.customerNo,
					ecommTransPostingCurr:$scope.itemInfo.currencyCode
			};
			jfRest.request('instalmentsCard', 'earlySettle', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		$scope.batchrquery = {};
		//批量提前还款按钮
		$scope.batchRepayment = function() {
			$scope.treeSelect = [];
			//$scope.selectStr = "";
			if (!$scope.creditTradeList.validCheck()) {
				return;
			}
			var itemBatchs = $scope.creditTradeList.checkedList();
			for (var i = 0; i < itemBatchs.length; i++) {
				//$scope.selectStr += itemBatchs[i].accountId + ',';	
				$scope.treeSelect.push(itemBatchs[i].accountId);
			}
			//$scope.selectStr = $scope.selectStr.substring(0, $scope.selectStr.length-1);
			$scope.batchrquery.ecommEntryId = $scope.creditTradeList.params.externalIdentificationNo;
			$scope.batchrquery.ecommPostingAcctNmbrs = $scope.treeSelect;
			console.log($scope.batchrquery);
			$scope.modal('/cstSvc/instalmentsQuery/batchRepayment.html', $scope.batchrquery, {
				title :T.T('KHJ4600004'),// '还款明细'
				buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : []
			});
		};
		//批量逾期还款试算
		$scope.overduequery = {};
		$scope.overdueRepayment = function(){
			$scope.treeSeloverdue = [];
			//$scope.selStrOverdue = "";
			if (!$scope.creditTradeList.validCheck()) {
				return;
			}
			var itemOverdue = $scope.creditTradeList.checkedList();
			for (var i = 0; i < itemOverdue.length; i++) {
				//$scope.selStrOverdue += itemOverdue[i].accountId + ',';
				$scope.treeSeloverdue.push(itemOverdue[i].accountId);
			}
			//$scope.selStrOverdue = $scope.selStrOverdue.substring(0, $scope.selStrOverdue.length-1);
			//$scope.treeSeloverdue.push($scope.selStrOverdue);
			$scope.overduequery.ecommEntryId = $scope.creditTradeList.params.externalIdentificationNo;
			$scope.overduequery.ecommPostingAcctNmbrs = $scope.treeSeloverdue;
			$scope.modal('/cstSvc/instalmentsQuery/overdueRepayment.html', $scope.overduequery, {
				title :T.T('KHJ4600004'),// '还款明细'
				buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : []
			});
		}
	});
});
