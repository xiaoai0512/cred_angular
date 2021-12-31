'use strict';
define(function(require) {
	var webApp = require('app');
	//require('../../cstSvc/txnInfEnqr/txnCgyAvyLogEnqrController.js');
	//信贷交易账户信息
	webApp.controller('creditTradeAccountS2Ctrl-JY', function($scope, $stateParams,
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
			checkType : 'checkbox',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryCreditS2',// 列表的资源
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
				$scope.creditTradeList.params.businessPattern = "S2";
				$scope.creditTradeList.search();
			}
		};
		//查看详情
		$scope.checkInfo = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			console.log($scope.itemDetailInf);
			$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/txnInfEnqr/viewCreditTradeAccS2.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
		//撤销
		$scope.revokeTran = function(result) {
			$scope.delItem = result;
			jfLayer.confirm('确定撤销此笔贷款吗？',function() {
 				$scope.paramsId = {
 					ecommPostingAcctNmbr:$scope.delItem.accountId,
 					ecommTransPostingCurr:$scope.delItem.currencyCode,
 					externalIdentificationNo:$scope.delItem.externalIdentificationNo
				 };
 				$scope.paramsId = $.extend($scope.paramsId,  $scope.creditTradeList.params.externalIdentificationNo);
	 			jfRest.request('instalments','revokeS2Pay',$scope.paramsId).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert('撤销成功');
						$scope.delItem = {};
						$scope.creditTradeList.search();
					}
	 			});
			},function() {
			});
		};
		//信贷贷款变更事件
		$scope.loanChange = function(event) {
			$scope.loanquery = $.parseJSON(JSON.stringify(event));
			console.log($scope.loanquery);
			$scope.modal('/cstSvc/instalmentsQuery/loanChangePageS2-JY.html', $scope.loanquery, {
				title :'贷款变更详情',
				buttons : ["确认",T.T('F00012') ],//'还款','关闭' 
				size : [ '1100px', '620px' ],
				callbacks : [$scope.loansSure]
			});
		};
		//
		$scope.loansSure = function(result){
			$scope.paramsLoan = {};
			$scope.paramsLoan.changeRepayMode=result.scope.loanquery.changeRepayMode;
			$scope.paramsLoan.changeLoanRate=result.scope.loanquery.changeLoanRate;
			$scope.paramsLoan.changeTermNo=result.scope.loanquery.changeTermNo;
			$scope.paramsLoan.ecommPostingAcctNmbr=result.scope.loanquery.accountId;
			$scope.paramsLoan.ecommTransPostingCurr=result.scope.loanquery.currencyCode;
			$scope.paramsLoan.ecommEntryId=result.scope.loanquery.ecommEntryId;
			$scope.paramsLoan.externalIdentificationNo=result.scope.loanquery.externalIdentificationNo;
			jfRest.request('creditLoanInfo', 'changeLoan', $scope.paramsLoan).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("贷款变更成功");//"操作成功！"
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		//信贷还款
		$scope.creditS2Payment = function(event) {
			$scope.prepayInf = $.parseJSON(JSON.stringify(event));
			$scope.itemInfPay = {
					ecommEntryId : 	$scope.prepayInf.externalIdentificationNo,
					ecommPostingAcctNmbr : 	$scope.prepayInf.accountId,
			};
			jfRest.request('instalments', 'creditS2PaymentTrial', $scope.itemInfPay).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData != null && data.returnData != 'null' && data.returnData != undefined){
							$scope.prepayInf.normalrepaymentList = data.returnData.interPriBeanByaccount;
							$scope.prepayInf = $.extend($scope.prepayInf,data.returnData);
							$scope.modal('/cstSvc/instalmentsQuery/layerCreditS2PaymentS2.html', $scope.prepayInf, {
								title :'还款详情',
								buttons : ["还款",T.T('F00012') ],//'还款','关闭' 
								size : [ '1100px', '620px' ],
								callbacks : [$scope.creditS2PaymentSure]
							});
					}else {
						$scope.prepayInf.normalrepaymentList =[];
					}
				}
			});
		};
		//还款试算
		$scope.creditS2PaymentSure= function(result){
			$scope.credtitpayInfparams = {};
			$scope.credtitpayInfparams.repayAmt = result.scope.prepayInf.repayAmt;//还款金额
			$scope.credtitpayInfparams.ecommEntryId = result.scope.prepayInf.externalIdentificationNo;//外部识别号
			$scope.credtitpayInfparams.ecommPostingAcctNmbr = result.scope.prepayInf.accountId;//入账账户号
			$scope.credtitpayInfparams.externalIdentificationNo = result.scope.prepayInf.externalIdentificationNo;//外部识别号
			$scope.credtitpayInfparams.ecommTransPostingCurr = result.scope.prepayInf.currencyCode;//币种
			if($scope.credtitpayInfparams.repayAmt == null || $scope.credtitpayInfparams.repayAmt == undefined ||
					$scope.credtitpayInfparams.repayAmt == 'null' || $scope.credtitpayInfparams.repayAmt == ''){
				jfLayer.alert('请核对填写还款金额');
				return;
            }
            jfRest.request('instalments', 'creditS2Payment', $scope.credtitpayInfparams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success('还款成功！');
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		//批量信贷提前还款按钮
		$scope.batchRepayment = function() {
			$scope.treeSelect = [];
			$scope.batchrquery = {};
			//$scope.selectStr = "";
			if (!$scope.creditTradeList.validCheck()) {
				return;
			}
			var itemBatchs = $scope.creditTradeList.checkedList();
			for (var i = 0; i < itemBatchs.length; i++) {
				//$scope.selectStr += itemBatchs[i].accountId + ',';	
				$scope.treeSelect.push(itemBatchs[i].accountId);
			}
			console.log($scope.treeSelect);
			//$scope.selectStr = $scope.selectStr.substring(0, $scope.selectStr.length-1);
			$scope.batchrquery.ecommEntryId = $scope.creditTradeList.params.externalIdentificationNo;
			$scope.batchrquery.ecommPostingAcctNmbrs = $scope.treeSelect;
			$scope.params ={
					ecommEntryId:$scope.batchrquery.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.batchrquery.ecommPostingAcctNmbrs 
			};
			$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'batchTrial', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.batchrquery.batchInfoListPage = data.returnData;
					$scope.modal('/cstSvc/instalmentsQuery/batchRepaymentS2-JY.html', $scope.batchrquery, {
						title :T.T('KHJ4600004'),// '还款明细'
						buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
						size : [ '1100px', '620px' ],
						callbacks : [$scope.batchSure]
					});
				}
			});
		};
		//提前还款按钮事件
		$scope.batchSure = function(result){
			console.log(result);
			$scope.batchrepay = result.scope.itembatchInf;
			$scope.params ={
					ecommEntryId: $scope.batchrepay.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.batchrepay.ecommPostingAcctNmbrs
			};
			$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'batchRepayment', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		//批量信贷逾期还款试算
		$scope.overdueRepayment = function(){
        	$scope.overduequery = {};
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
			console.log($scope.treeSeloverdue);
			//$scope.selStrOverdue = $scope.selStrOverdue.substring(0, $scope.selStrOverdue.length-1);
			//$scope.treeSeloverdue.push($scope.selStrOverdue);
			$scope.overduequery.ecommEntryId = $scope.creditTradeList.params.externalIdentificationNo;
			$scope.overduequery.ecommPostingAcctNmbrs = $scope.treeSeloverdue;
			$scope.params ={
					ecommEntryId:$scope.overduequery.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.overduequery.ecommPostingAcctNmbrs 
			};
			$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'overTrial', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.overduequery.overdueInfoListPage = data.returnData;
					$scope.overduequery.externalIdentificationNo = $scope.creditTradeList.params.externalIdentificationNo;
					$scope.modal('/cstSvc/instalmentsQuery/overdueRepaymentS2-JY.html', $scope.overduequery, {
						title :T.T('KHJ4600004'),// '还款明细'
						buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
						size : [ '1000px', '580px' ],
						callbacks : [$scope.overdueSure]
					});
				}
			});
		};
		//逾期还款按钮事件
		$scope.overdueSure = function(result){
			$scope.overduerepay = result.scope.itemoverdueInf;
			$scope.params ={
					ecommEntryId: $scope.overduerepay.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.overduerepay.ecommPostingAcctNmbrs
			};
			$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'overRepayment', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		};
		//批量信贷正常还款试算
		$scope.normalRepayment = function(){
			$scope.normalquery = {};
			$scope.treeSelnormal = [];
			if (!$scope.creditTradeList.validCheck()) {
				return;
			}
			var itemNormal = $scope.creditTradeList.checkedList();
			for (var i = 0; i < itemNormal.length; i++) {
				$scope.treeSelnormal.push(itemNormal[i].accountId);
			}
			console.log($scope.treeSelnormal);
			$scope.normalquery.ecommEntryId = $scope.creditTradeList.params.externalIdentificationNo;
			$scope.normalquery.ecommPostingAcctNmbrs = $scope.treeSelnormal;
			$scope.params ={
					ecommEntryId:$scope.normalquery.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.normalquery.ecommPostingAcctNmbrs
			};
			$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'normalTrial', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.normalquery.normalInfoListPage = data.returnData;
					$scope.modal('/cstSvc/instalmentsQuery/normalRepaymentS2-JY.html', $scope.normalquery, {
						title :T.T('KHJ4600004'),// '还款明细'
						buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
						size : [ '1000px', '580px' ],
						callbacks : [ $scope.normalSure]
					});
				}
			});
		};
		//正常还款按钮事件
		$scope.normalSure = function(result){
			$scope.normalrepay = result.scope.itemnormalInf;
			$scope.params ={
					ecommEntryId: $scope.normalrepay.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.normalrepay.ecommPostingAcctNmbrs
			};
			$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'normalRepayment', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					$scope.creditTradeList.search();
				}
			});
		}
	});
	//交易明细查询------原名：viewCreditTradeAccS2Ctrl，，，，因菜单禁用，这个页面instalQueryController.js也有调用，
	//所以如果本js复用请改名viewCreditTradeAccS2Ctrl
	webApp.controller('viewCreditTradeAccS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		console.log($scope.itemInf);
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
        // 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			autoQuery: false,
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
			}
		};
	});
	//批量信贷逾期还款明细1
	webApp.controller('overdueRepaymentS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.overInfList = {};
		$scope.itemoverdueInf = {};
		$scope.itemoverdueInf = $scope.overduequery;
		$scope.overInfList = $scope.overduequery.overdueInfoListPage;
		$scope.ORepaymentList = $scope.overduequery.overdueInfoListPage.interPriBeanByaccount;
		$scope.selectInfo = function(result){
			console.log(result);
			$scope.ORepaymentListInfo = result;
			$scope.ORepaymentListInfo.externalIdentificationNo = $scope.overduequery.externalIdentificationNo;
			$scope.modal('/cstSvc/instalmentsQuery/overdueInfoS2-JY.html', $scope.ORepaymentListInfo, {
				title :T.T('KHJ4600004'),// '还款明细'
				buttons : [T.T('F00012') ],//'还款','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : []
			});
		}
	});
	//批量信贷逾期还款明细2
	webApp.controller('overInfosS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.overdueList = {};
		$scope.overdueList = $scope.ORepaymentListInfo;
		console.log($scope.overdueList);
		$scope.ORepaymentListInfos = $scope.overdueList.interPriBeanByaccount;
		console.log($scope.ORepaymentListInfos);
		$scope.infoIShave = false;
		$scope.infoIsShow = false;
		if($scope.ORepaymentListInfos.length == 0){
			$scope.infoIShave = false;
			$scope.infoIsShow = true;
		}else{
			$scope.infoIShave = true;
			$scope.infoIsShow = false;
		}
	});
	//批量贷款变更
	webApp.controller('loanChangeS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.loanquery = $scope.loanquery;
		//变更贷款方式
		$scope.loanArray = [{
			id: '1',
			name: '期次变更'
		},{
			id: '2',
			name: '利率变更'
		},{
			id: '3',
			name: '还款方式变更'
		}];
		//还款方式
		$scope.repayModeList = [{name : '期末本息一次付清' ,id : '0'},{name : '按固定周期付息、到期还本' ,id : '2'},
		                        {name : '等额本息' ,id : '3'},{name : '等额本金' ,id : '4'}] ;
		//变更贷款方式联动验证
		var form = layui.form;
		form.on('select(getChangeType)',function(event){
			if(event.value == "1"){//期次变更
				$scope.isShowTermNo = true;
				$scope.isShowLoanRate = false;
				$scope.isShowRepayMode = false;
				$scope.loanquery.changeLoanRate = "";
				$scope.loanquery.changeRepayMode = "";
			}else if(event.value == "2"){//利率变更
				$scope.isShowTermNo = false;
				$scope.isShowLoanRate = true;
				$scope.isShowRepayMode = false;
				$scope.loanquery.changeTermNo = "";
				$scope.loanquery.changeRepayMode = "";
			}else if(event.value == "3"){//还款方式变更
				$scope.isShowTermNo = false;
				$scope.isShowLoanRate = false;
				$scope.isShowRepayMode = true;
				$scope.loanquery.changeTermNo = "";
				$scope.loanquery.changeLoanRate = "";
            }
        });
		//试算
		$scope.trialLoan = function(){
			if( ($scope.loanquery.changeRepayMode == '' || $scope.loanquery.changeRepayMode == undefined || $scope.loanquery.changeRepayMode == null) && 
					($scope.loanquery.changeLoanRate == '' || $scope.loanquery.changeLoanRate == undefined || $scope.loanquery.changeLoanRate == null) && 	
					($scope.loanquery.changeTermNo == '' || $scope.loanquery.changeTermNo == undefined || $scope.loanquery.changeTermNo == null)  ){
				jfLayer.alert('请填写变更变更贷款具体内容！');
				return;
            }
            $scope.trailLoanTable.params.changeRepayMode=$scope.loanquery.changeRepayMode;
			$scope.trailLoanTable.params.changeLoanRate=$scope.loanquery.changeLoanRate;
			$scope.trailLoanTable.params.changeTermNo=$scope.loanquery.changeTermNo;
			$scope.trailLoanTable.search();
		};
		// 试算列表
		$scope.trailLoanTable = {
			params : {
				ecommPostingAcctNmbr: $scope.loanquery.accountId,
				ecommTransPostingCurr: $scope.loanquery.currencyCode,
				ecommEntryId: $scope.loanquery.ecommEntryId,
				externalIdentificationNo:$scope.creditTradeList.params.externalIdentificationNo,
				pageSize : 10,
				indexNo : 0
			},
			paging : true,
			resource : 'creditLoanInfo.loanTrail',
			autoQuery : false,
			callback : function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowTrialLoan = true;
				} else {
					$scope.isShowTrialLoan = false;
				}
			}
		};
	});
	//批量提前还款试算明细
	webApp.controller('batchRepaymentS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itembatchInf = {};
		$scope.itembatchInf = $scope.batchrquery;
		$scope.batchInfList = $scope.itembatchInf.batchInfoListPage;
		$scope.batchrepaymentList = $scope.itembatchInf.batchInfoListPage.interPriBeanByaccount;
	});
	//批量信贷正常还款试算明细
	webApp.controller('normalRepaymentS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemnormalInf = {};
		$scope.itemnormalInf = $scope.normalquery;
		$scope.normalInfList = $scope.itemnormalInf.normalInfoListPage.obj;
		$scope.normalrepaymentList = $scope.itemnormalInf.normalInfoListPage.rows;
	});
	//信贷还款-------原名：layercreditS2PaymentS2Ctrl，，，，因菜单禁用，这个页面instalQueryController.js也有调用，
	//所以如果本js复用请改名layercreditS2PaymentS2Ctrl
	webApp.controller('layercreditS2PaymentS2Ctrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.prepayInf = $scope.prepayInf;
		$scope.normalrepaymentList =$scope.prepayInf.normalrepaymentList;
	});
});
