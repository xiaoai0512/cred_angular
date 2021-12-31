'use strict';
define(function(require) {
	var webApp = require('app');
	//贷款支付信息
	webApp.controller('loanPaymentInfoCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/loanPayment/i18n_loanPayment');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
		//搜索身份证类型
		/*$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},
		{name : T.T('PZJ100021'),id : '0'} ];	*/
		$scope.isButtonLoan = true;
		$scope.isShowloanList = false;
		//重置
		$scope.reset = function() {
			$scope.loanList.params.externalIdentificationNo= '';
			$scope.isShowloanList = false;
		};
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAY_startDate',
				//min:Date.now(),
				done: function(value, date) {
					endDate.config.min = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					endDate.config.start = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
				}
			});
			var endDate = laydate.render({
				elem: '#LAY_endDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
		//贷款支付信息列表
		$scope.loanList = {
			checkType : 'checkbox',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'loanPayment.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_loanType','dic_loanAccStatus'],//查找数据字典所需参数
			transDict : ['loanType_loanTypeDesc','status_statusDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShowloanList = true;
				}else {
					$scope.isShowloanList = false;
				}
			},
		};
		$scope.searchBtn = function() {
			if($scope.loanList.params.externalIdentificationNo == null || $scope.loanList.params.externalIdentificationNo == "" || $scope.loanList.params.externalIdentificationNo == undefined){
				jfLayer.alert(T.T('F00076'));//"输入查询条件"
			}
			else {
				//$scope.creditTradeList.params.businessPattern = "S1";
				$scope.startDate = $("#LAY_startDate").val();
				$scope.endDate = $("#LAY_endDate").val();
				$scope.loanList.params.startDate = $scope.startDate;
				$scope.loanList.params.endDate = $scope.endDate;
				$scope.loanList.search();
			}
		};
		//查询详情
		$scope.checkInfo = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.loanList.params);
			$scope.modal('/cstSvc/loanPayment/viewPaymentDetails.html', $scope.itemDetailInf, {
				title : T.T('FQJ500001'),//'贷款支付详情'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
		//贷款支付
		$scope.loanPaymentClick = function(event) {
			$scope.params ={
				accountId: event.accountId,
				externalIdentificationNo: event.externalIdentificationNo,
				currencyCode: event.currencyCode,
				loanAmount: event.loanAmount
			};
			jfRest.request('loanPayment', 'queryPaymentInfo', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.loanItem = {};
					$scope.loanItem = data.returnData;
					$scope.loanItem.loanAmount=event.loanAmount;
					$scope.loanItem.currencyCode=event.currencyCode;
					$scope.modal('/cstSvc/loanPayment/viewLoanPaymentList.html', $scope.loanItem, {
						title :T.T('KHJ4600052'),  //'提前部分还款详情',
						buttons : [T.T('F00125'),T.T('F00012') ],//'确认','关闭' 
						size : [ '900px', '520px' ],
						callbacks : [$scope.loanPaymentInquire]
					});
				}
			});
		};
		//贷款支付回调函数
		$scope.loanPaymentInquire=function(result){
			$scope.loanPayment = result.scope.loanPayment;
			$scope.loanPayment.currencyCode=result.scope.currencyCode;
			$scope.params ={
				ecommPostingAcctNmbr: $scope.loanPayment.accountId,
				loanAmount: $scope.loanPayment.loanAmount,
				ecommTransPostingCurr:$scope.loanPayment.currencyCode,
				payableAmount:$scope.loanPayment.payableAmount,
				paymentDate:$scope.loanPayment.paymentDate,
				paymentAmount:$scope.loanPayment.paymentAmount
			};
			$scope.params = $.extend($scope.params, $scope.loanList.params);
				jfRest.request('loanPayment', 'loanConfirmation', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('KHJ4600012'));//"贷款变更成功"
						$scope.safeApply();
						result.cancel();
						$scope.loanList.search();
					}
			})
		};
	//贷款支付明细查询
	webApp.controller('viewPaymentDetailsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/loanPayment/i18n_loanPayment');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		if($scope.itemDetailInf.paymentPlan == '0'){
			$scope.itemInf.paymentPlan = T.T('FQJ500002');   
		}else if($scope.itemDetailInf.paymentPlan == '1'){
			$scope.itemInf.paymentPlan = T.T('FQJ500003');   
		}else if($scope.itemDetailInf.paymentPlan == '2'){
			$scope.itemInf.paymentPlan = T.T('FQJ500004');   
		}else if($scope.itemDetailInf.paymentPlan == '3'){
			$scope.itemInf.paymentPlan = T.T('FQJ500005');   
		}
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo = T.T('F00144');   //'撤銷';
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = T.T('F00146');   //'正常';
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = T.T('F00145');   //'逾期';
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = T.T('F00147');   //'结清';
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = T.T('F00148');   //'全额退货';
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('F00088');   //'人民币';
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('F00095');   //'美元';
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4600028');   //'期末本息一次付清';
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4600029');   //'按固定周期付息、到期还本';
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4600030');   //'等额本息';
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4600031');   //'等额本金';
		}else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4600032');   //'等本等息';
		}else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4600033');   //'首期一次性付息分期还本';
		}else if($scope.itemDetailInf.repayMode == '14'){
			$scope.repayModeInfo = T.T('KHJ4600053');   //"气球贷(等额本息)";
		}else if($scope.itemDetailInf.repayMode == '15'){
			$scope.repayModeInfo = T.T('KHJ4600054');   //"气球贷(等额本金)"
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
				currencyCode: $scope.itemDetailInf.currencyCode
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
		// 贷款详情明细列表查询
		$scope.paymentDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode: $scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'loanPayment.queryList',// 列表的资源
			isTrans: true,
			transParams: ['dic_paymentDateTable','dic_paymentStatusTable'],
			transDict: ['paymentMode_paymentModeDesc','paymentStatus_paymentStatusDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	});
	//贷款支付
	webApp.controller('viewLoanPaymentListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	$scope.loanPayment = $scope.loanItem;//上页列表传过来的参数
    	//币种
		$scope.ccy = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_curreny",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.currencyCode=$scope.loanPayment.currencyCode;
			}
		};
		//$scope.paymentPlan = [{name : T.T('KHJ4600050'),id : 'PPL2'}];//支付计划
		//$scope.paymentMode = [{name : T.T('KHJ4600051'),id : 'ONLINE'}];//支付方式
	});
});
