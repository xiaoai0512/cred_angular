'use strict';
define(function(require) {
	var webApp = require('app');
	//消费贷放款申请
	webApp.controller('accFinancialInfCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translatePartialLoader.addPart('pages/cstSvc/cashStage/i18n_cashStage');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.isShow = false;
		//还款方式
		$scope.repayModeList = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_repaymentMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//还款日类型
		$scope.repaymentDateTypeList = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_repaymentDateType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//交易来源***name:审批系统 id:s   
		$scope.associArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_transactionApproval",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.cstInf = {};//客户信息对象
		$scope.loanInf = {
			freeDays: 0, //免息期天数默认为0
			//penaltyUp: 0, //罚息上浮 默认为0
		}; //申请放款信息对象
		$scope.proInf = {}; // 产品信息对象
		// 重置
		$scope.reset = function() {
			$scope.queryProForm.idNumber= '';
			$scope.isShow = false;
		};
		//利率类型
		$scope.rateIndArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_interestRateType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//还款间隔单位  按月：M
		$scope.repayPrincipalUnitArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_repaymentFrequencyUnit",
				queryFlag : "children"
			},// 默认查询条件
			rmData: ['D','H','Q','W','Y'],
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//贷款币种
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
			}
		};
		//查询按钮，查询账户列表
		$scope.searchProiList = function(){
			if(($scope.queryProForm.ecommEntryId == null || $scope.queryProForm.ecommEntryId == undefined || $scope.queryProForm.ecommEntryId == "") ){
				jfLayer.fail(T.T('F00076'));   //"请输入查询条件");
				$scope.isShow = false;

			}else{
				$scope.querysParams ={
					'ecommEntryId': $scope.queryProForm.ecommEntryId,
					'externalIdentificationNo': $scope.queryProForm.ecommEntryId
				};
				jfRest.request('conApply', 'queryCusInfo', $scope.querysParams).then(function(data) {
					if (data.returnCode == '000000') {
						$scope.isShow = true;
						$scope.proInf.ecommCustName = data.returnData.ecommCustName;
						$scope.ecommEntryId = data.returnData.ecommEntryId;
						$scope.proInf.ecommCustId = data.returnData.ecommCustId;
						if (data.returnData.idType == '1') {
							$scope.proInf.idType = T.T('F00113');         //'身份证';
						}else if(data.returnData.idType == '2') {
							$scope.proInf.idType = T.T('F00114');         //'港澳居民来往内地通行证';
						}else if(data.returnData.idType == '3') {
							$scope.proInf.idType = T.T('F00115');         //'台湾居民来往内地通行证';
						}else if(data.returnData.idType == '4') {
							$scope.proInf.idType = T.T('F00116');         //'中国护照';
						}else if(data.returnData.idType == '5') {
							$scope.proInf.idType = T.T('F00117');         //'外国护照';
						}else if(data.returnData.idType == '6') {
							$scope.proInf.idType = T.T('F00118');         //'外国人永久居留证';
						}else if(data.returnData.idType == '7') {
							$scope.proInf.idType = T.T('FQJ200012');         //'预算单位';
						}
						//$scope.proInf.idType = data.returnData.idType;
						$scope.proInf.idNumber = data.returnData.idNumber;    // 证件号
						$scope.proInf.productObjectCode = data.returnData.ecommProdObjId;   // 产品Id
						//$scope.proInf.productDesc = data.returnData.ecommProdObjDesc;
						$scope.loanInf.repayDay = data.returnData.repayDay;    //还款日
					}else {
						$scope.isShow = false;
					}
				});
			}
		};
		$scope.callback = function(result){
			//查询客户信息
			//$scope.queryCstInf($scope.ecommEntryId);
			$scope.proItem = result.scope.proList.checkedList();
			$scope.proInf = $scope.proItem;
			$scope.isShow = true;
			$scope.safeApply();
			result.cancel();
		};
		$scope.stageTrialClick = function(result){
			if($scope.loanInf.rateInd=='0' || $scope.loanInf.rateInd =='1' || $scope.loanInf.rateInd =='2'){
				if($scope.loanInf.loanRate ==undefined){
					jfLayer.alert(T.T('FQJ200042'));
					return;
				}
			}
			//还款方式  为 气球贷时，
			if($scope.loanInf.repayMode == 14 || $scope.loanInf.repayMode == 15){
				if($scope.loanInf.monthSupplyPeriod == $scope.loanInf.balloonPeriod){
					jfLayer.alert(T.T('FQJ200040'));
					return;
                }
                if(Number($scope.loanInf.monthSupplyPeriod) > Number($scope.loanInf.balloonPeriod)){
					jfLayer.alert(T.T('FQJ200041'));
					return;
                }
            }
            $scope.loanInf.ecommEntryId = $scope.ecommEntryId;
			$scope.loanInf.repayPrincipalUnit = 'M';
			if(!$scope.loanInf.repayPrincipal){
				delete $scope.loanInf['repayPrincipal'];
			}
			if(!$scope.loanInf.freeDays){
				delete $scope.loanInf['freeDays'];
			}
			if(!$scope.loanInf.repayDay){
				delete $scope.loanInf['repayDay'];
			}
			if(!$scope.loanInf.penaltyUp){
				delete $scope.loanInf['penaltyUp'];
			}
			if(!$scope.loanInf.ecommPenaltyInterestRate){
				delete $scope.loanInf['ecommPenaltyInterestRate'];
			}
			
			if($scope.loanInf.paymentPlan=='3'){
	 			$scope.loanInf.paymentPlanList=$scope.dateAmount;
				//支付计划为PPL2时，支付方式必须为ONLINE
 				$scope.paymentAmountCount = 0;
				for(var i = 0; i < $scope.loanInf.paymentPlanList.length; i++){
					if(JSON.stringify($scope.loanInf.paymentPlanList[i]) == '{}'){
						jfLayer.fail(T.T('FQJ200037'));
						return;
					}
					// 循环检查每组的 日期字段 或 金额字段 必须存在
					if(!$scope.loanInf.paymentPlanList[i].hasOwnProperty("paymentAmount") || !$scope.loanInf.paymentPlanList[i].hasOwnProperty("paymentDate"))
					{
						jfLayer.fail(T.T('FQJ200037'));
					}
					// 循环检查每组的 日期字段 或 金额字段 不能为空 或 不能为 undefined
					if($scope.loanInf.paymentPlanList[i].paymentDate == '' || $scope.loanInf.paymentPlanList[i].paymentDate == 'undefined')
					{
						jfLayer.fail(T.T('FQJ200034'));
					}
					if($scope.loanInf.paymentPlanList[i].paymentAmount == '' || $scope.loanInf.paymentPlanList[i].paymentAmount == 'undefined')
					{
						jfLayer.fail(T.T('FQJ200033'));
					}
					$scope.paymentAmountCount += parseInt($scope.loanInf.paymentPlanList[i].paymentAmount);
				}
					//console.log($scope.paymentAmountCount);
						// 此处判断每组金额总和 与 总金额 是否相等
				if($scope.paymentAmountCount!=$scope.loanInf.ecommTransAmount){
					jfLayer.fail(T.T('FQJ200030'));
					return;
				}
			}
			$scope.modal('/stage/consumerLoanApply/stageTrialResult.html', $scope.loanInf, {
				title : T.T('KHH4600074'),   //'试算结果',
				buttons : [T.T('F00012') ],    //'关闭'
				size : [ '1100px', '350px' ],
				callbacks : []
			});
		};
		/*---3. 支付计划信息---*/
		//支付方式
		$scope.paymentPlan = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_paymentMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//支付日期&&支付金额--增加
		//支付日期&&支付金额--------默认值
		$scope.dateAmount = [{paymentDate:'',paymentAmount:''}];
		$scope.tradTypeAdd = function(){
			$scope.dateAmount.push({paymentDate:'',paymentAmount:''})
		};
	 	//支付日期&&支付金额
	 	$scope.dateAmountDel = function(e,$index){
	 		$scope.dateAmount.splice($index,1);
	 	};
		//确认申请
	 	$scope.sureHanle = function(){
			if($scope.loanInf.paymentPlan=='3'){
	 			$scope.loanInf.paymentPlanList=$scope.dateAmount;
				//支付计划为PPL2时，支付方式必须为ONLINE
 				$scope.paymentAmountCount = 0;
				for(var i = 0; i < $scope.loanInf.paymentPlanList.length; i++){
					if(JSON.stringify($scope.loanInf.paymentPlanList[i]) == '{}'){
						jfLayer.fail(T.T('FQJ200037'));
						return;
					}
					// 循环检查每组的 日期字段 或 金额字段 必须存在
					if(!$scope.loanInf.paymentPlanList[i].hasOwnProperty("paymentAmount") || !$scope.loanInf.paymentPlanList[i].hasOwnProperty("paymentDate"))
					{
						jfLayer.fail(T.T('FQJ200037'));
					}
					// 循环检查每组的 日期字段 或 金额字段 不能为空 或 不能为 undefined
					if($scope.loanInf.paymentPlanList[i].paymentDate == '' || $scope.loanInf.paymentPlanList[i].paymentDate == 'undefined')
					{
						jfLayer.fail(T.T('FQJ200034'));
					}
					if($scope.loanInf.paymentPlanList[i].paymentAmount == '' || $scope.loanInf.paymentPlanList[i].paymentAmount == 'undefined')
					{
						jfLayer.fail(T.T('FQJ200033'));
					}
					$scope.paymentAmountCount += parseInt($scope.loanInf.paymentPlanList[i].paymentAmount);
				}
				// 此处判断每组金额总和 与 总金额 是否相等
				if($scope.paymentAmountCount!=$scope.loanInf.ecommTransAmount){
					jfLayer.fail(T.T('FQJ200030'));
					return;
				}
			}
	 		$scope.loanInf.ecommEntryId = $scope.ecommEntryId;
			$scope.loanInf.externalIdentificationNo = $scope.ecommEntryId;
			$scope.loanInf.repayPrincipalUnit = 'M';
			if($scope.loanInf.repaymentDateType == "1"){
				$scope.isShowrepay = true;
				if($scope.loanInf.repayDay){
					jfRest.request('conApply', 'tlsAjust', $scope.loanInf).then(function(data) {
						if (data.returnCode == '000000') {
							$scope.isShow = false;
							jfLayer.success(T.T('FQJ200013'));   //"申请成功！");
								
						}
					});
				}else{
					jfLayer.fail(T.T('FQJ200015'));   //"请输入还款日！");
				}
			}else{
				jfRest.request('conApply', 'tlsAjust', $scope.loanInf).then(function(data) {
					if (data.returnCode == '000000') {
						$scope.isShow = false;
						jfLayer.success(T.T('FQJ200013'));   //"申请成功！");

					}
				});
			}
		};
	});
	
	//贷款试算
	webApp.controller('stageTrialsCtrl', function($scope, $stateParams,
		jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translatePartialLoader.addPart('pages/cstSvc/cashStage/i18n_cashStage');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		//账单分期试算列表
		$scope.cashTrailList = {
			autoQuery:true,
			params : {
				"accountBankNo":$scope.loanInf.accountBankNo,
				"ecommEntryId":$scope.loanInf.ecommEntryId,
				'externalIdentificationNo':$scope.loanInf.ecommEntryId,
				"ecommSourceCde":$scope.loanInf.ecommSourceCde,
				"ecommTransAmount":$scope.loanInf.ecommTransAmount,
				"ecommTransPostingCurr":$scope.loanInf.ecommTransPostingCurr,
				"firstRepayDate":$scope.loanInf.firstRepayDate,
				"freeDays":$scope.loanInf.freeDays,
				"loanEndDate":$scope.loanInf.loanEndDate,
				"loanNum":$scope.loanInf.loanNum,
				"loanRate":$scope.loanInf.loanRate,
				"monthSupplyPeriod":$scope.loanInf.monthSupplyPeriod,
				"payLoanDate":$scope.loanInf.payLoanDate,
				"penaltyUp":$scope.loanInf.penaltyUp,
				"rateInd":$scope.loanInf.rateInd,
				"repayDay":$scope.loanInf.repayDay,
				"receiveAccount":$scope.loanInf.receiveAccount,
				"repayMode":$scope.loanInf.repayMode,
				"repayPrincipal":$scope.loanInf.repayPrincipal,
				"repaymentDateType":$scope.loanInf.repaymentDateType,
				"ecommPenaltyInterestRate":$scope.loanInf.ecommPenaltyInterestRate,
				"paymentAmount1" : $scope.loanInf.paymentAmount1,
				"paymentAmount2" :$scope.loanInf.paymentAmount2,
				"paymentAmount3": $scope.loanInf.paymentAmount3,
				"paymentAmount4" : $scope.loanInf.paymentAmount4,
				"paymentAmount5": $scope.loanInf.paymentAmount5,
				"paymentDate1" : $scope.loanInf.paymentDate1,
				"paymentDate2" : $scope.loanInf.paymentDate2,
				"paymentDate3" : $scope.loanInf.paymentDate3,
				"paymentDate4" : $scope.loanInf.paymentDate4,
				"paymentDate5" : $scope.loanInf.paymentDate5,
				"paymentPlan" : $scope.loanInf.paymentPlan,
				"balloonPeriod":$scope.loanInf.balloonPeriod,
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'conApply.querysTs',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.stageInf = data.returnData.obj;
					$scope.isShow = true;
				}
			}
		};
	});
});
