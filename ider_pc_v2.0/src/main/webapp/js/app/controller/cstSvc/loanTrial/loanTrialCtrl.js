'use strict';
define(function(require) {
	var webApp = require('app');
	//贷款试算
	webApp.controller('cashStageCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/loanTrial/i18n_loanTrial');
		$translatePartialLoader.addPart('pages/cstSvc/cashStage/i18n_cashStage');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.trailInf = {};
		$scope.isShow = false;
		//还款频率单位
		$scope.repayPrincipalUnitArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_repaymentFrequencyUnit",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//還款日類型
		$scope.repaymentDateTypeArr = {
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
		//还款方式
		$scope.repayModeArr = {
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
		//利率类型     0:年利率，1：月利率 2：日利率*/
		$scope.RateIndArr = {
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
		//首期计息方式 
		$scope.firstInterestModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_interestBearingMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//末期计息方式  endInterestModeArr    0-按日计息
		$scope.endInterestModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_finalCalculationTrial",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//计息方式
		$scope.interestModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_interestBearingMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//计息基数
		$scope.loanRateModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_interestBase",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 首期还款日计算方式    
		//'最近一个还款日',id : '0','跨过最近一个还款日',id : '1','根据天数确定是否跨过最近一个还款日',id : '2'
		$scope.firstRepayDayModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_initialRepaymentTrial",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//贷款到期日计算方式   
		$scope.calLoanEndDateTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_loanMaturityCalculation",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.IntervalDaysShow = false;    // 首期还款日计算方式间隔天数
		$scope.firstRepayDayModeShow = false;   //首期还款日计算方式
		$scope.repayDayShow = false;    //指定还款日
		$scope.interestModeShow = false;
		$scope.isrepayMode = false;
		var form = layui.form;
		form.on('select(getoperation)',function(event){
			if(event.value == '2'){
				$scope.IntervalDaysShow = true;
			}else{
				$scope.IntervalDaysShow = false;
				$scope.trailInf.IntervalDays = "";
			}
		});
		form.on('select(getrepayMode)',function(event){
			if(event.value == "2"){
				$scope.isrepayMode = true;
			}
			else{
				$scope.isrepayMode = false;
			}
		});
		form.on('select(getrepaymentDateType)',function(event){
			if(event.value == '1'){
				$scope.firstRepayDayModeShow = true; 
				$scope.repayDayShow = true;  
			}else{
				$scope.firstRepayDayModeShow = false; 
				$scope.repayDayShow = false;  
				$scope.IntervalDaysShow = false;
				$scope.trailInf.IntervalDays = "";
				$scope.trailInf.firstRepayDayMode = "";
				$scope.trailInf.repayDay = "";
			}
		});
		form.on('select(getinterestMode)',function(event){
			if(event.value == '1'){
				$scope.interestModeShow = true;
			}else{
				$scope.interestModeShow = false;
				$scope.trailInf.firstInterestMode = "";
				$scope.trailInf.endInterestMode = "";
			}
		});
		//账单分期试算列表
		$scope.cashTrailList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'loanTrail.stageTrial',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.stageInf = data.returnData.obj;
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
                }
            }
		};
		//返回
		$scope.back = function(){
			$scope.isShow = false;
		};
		//分期试算
		$scope.stageTrialHandle  = function(){
		/*if($scope.trailInf.ecommInstallNum  == undefined || $scope.trailInf.ecommInstallNum  == null || $scope.trailInf.ecommInstallNum  == ''){
				jfLayer.alert("分期期数不能为空！");
				return;
			};*/
			/*$scope.isShow = true;*/
			/*$scope.trialParams= {
					ecommBusinessProgramCode: $scope.trailInf.businessProgramNo,// 业务项目
					ecommBusineseType: $scope.trailInf.businessTypeCode,
					ecommProdObjId:  $scope.trailInf.productObjectCode,
					ecommCustId: $scope.trailInf.customerNo,
					ecommTransPostingCurr: $scope.trailInf.currencyCode,//币种
					ecommInstallmentPeriod: $scope.trailInf.term,
					ecommTransAmount :$scope.trailInf.loanAmt,
					ecommInstallmentBusinessType: 'STMT'
			};*/
			if($scope.trailInf.repayMode==14 || $scope.trailInf.repayMode==15){
				if($scope.trailInf.balloonPeriod == null || $scope.trailInf.balloonPeriod == "" || $scope.trailInf.balloonPeriod == undefined){
					jfLayer.alert(T.T('FQJ300015')); 
					return;
				}
			}
			if($scope.trailInf.repaymentDateType == '1' || $scope.trailInf.interestMode == '1'){
				if($scope.trailInf.repaymentDateType == '1'){
					if($scope.trailInf.repayDay && $scope.trailInf.firstRepayDayMode){
						if($scope.trailInf.firstRepayDayMode == '2'){
							if($scope.trailInf.IntervalDays){
								if($scope.trailInf.interestMode == '1'){
									if($scope.trailInf.firstInterestMode && $scope.trailInf.endInterestMode){
										$scope.cashTrailList.params = $scope.trailInf;
										$scope.cashTrailList.search();
									}else{
										jfLayer.fail(T.T('FQJ300008'));   //"请输入首期计息方式和末期计息方式");
									}
								}else{
									$scope.cashTrailList.params = $scope.trailInf;
									$scope.cashTrailList.search();
								}
							}else{
								jfLayer.fail(T.T('FQJ300009'));   //"请输入首期还款日计算方式间隔天数");
							}
						}else{
							if($scope.trailInf.interestMode == '1'){
								if($scope.trailInf.firstInterestMode && $scope.trailInf.endInterestMode){
									$scope.cashTrailList.params = $scope.trailInf;
									$scope.cashTrailList.search();
								}else{
									jfLayer.fail(T.T('FQJ300010'));   //"请输入首期计息方式和末期计息方式");
								}
							}else{
								$scope.cashTrailList.params = $scope.trailInf;
								$scope.cashTrailList.search();
							}
						}
					}else{
						jfLayer.fail(T.T('FQJ300011'));   //"请输入指定还款日和首期还款日计算方式");
					}
				}else{
					if($scope.trailInf.interestMode == '1'){
						if($scope.trailInf.firstInterestMode && $scope.trailInf.endInterestMode){
							$scope.cashTrailList.params = $scope.trailInf;
							$scope.cashTrailList.search();
						}else{
							jfLayer.fail(T.T('FQJ300012'));   //"请输入首期计息方式和末期计息方式");
						}
					}else{
						$scope.cashTrailList.params = $scope.trailInf;
						$scope.cashTrailList.search();
					}
				}
			}else{
				$scope.cashTrailList.params = $scope.trailInf;
				$scope.cashTrailList.search();
			}
		};
		$scope.queryList = function(){
			if(($scope.cstDelinquencyList.params.idNumber == "" || $scope.cstDelinquencyList.params.idNumber == undefined) 
					&& ($scope.cstDelinquencyList.params.externalIdentificationNo =="" || $scope.cstDelinquencyList.params.externalIdentificationNo ==undefined)){
				$scope.isShow = false;
				jfLayer.fail(T.T('FQJ100006'));    //"请输入证件号码或外部识别号任一查询条件");
			}else{
				$scope.isShow = true;
				$scope.cstDelinquencyList.search();
			}
		};
		$scope.cstDelinquencyList = {
			params : {},
			paging : true,
			resource : 'cstDelinquencyInfo.query',
			autoQuery:false,
			callback : function(data) {
			}
		};
		//交易模式
		/*$scope.posEntryModeArray = [{name : T.T('FQJ100001') ,id : '0'},
		                            {name : T.T('FQJ100002') ,id : '1'},
		                            {name : T.T('FQJ100003') ,id : '2'}];*/
		//交易输入来源V-VISA、M-MC、C-银联、L-本行
		/*$scope.associArray = [{name : 'VISA',id : 'V'},{name : 'MC',id : 'M'}
							 ,{name : T.T('FQJ100004'),id : 'L'},{name : T.T('FQJ100005'),id : 'C'}];*/
		/*$scope.termArr =[{name: T.T('KHJ4600038'),id:"3"},
		                 {name: T.T('KHJ4600039'),id:"6"},
		                 {name: T.T('KHJ4600040'),id:"9"},
		                 {name: T.T('KHJ4600041'),id:"12"},
		                 {name: T.T('KHJ4600042'),id:"24"}];*/
		/*$scope.ecommCardAssociationsArr =[{name : 'VISA',id : 'V'},{name : 'MC',id : 'M'}
		 ,{name : T.T('FQJ100004'),id : 'L'},{name : T.T('FQJ100005'),id : 'C'}];*/
		
		//现金分期
		/*$scope.sureStage = function(){
			外部识别号 ecommField2 字符型 19   必填 
			交易币种 ecommField49 字符型 3   必填 
			交易金额 ecommField4 数值型 17   必填 
			入账币种 ecommField51 字符型 3   必填 
			入账金额 ecommField6 数值型 17   必填 
			期数 ecommInstallNum 数值型 4   必填 
			交易来源 ecommCardAssociations 字符型 1   必填 //
			交易描述   字符型 50    
			$scope.trailInf.ecommField6 = $scope.trailInf.ecommField4;
			$scope.trailInf.ecommField51 =$scope.trailInf.ecommField49;
			console.log($scope.trailInf);
			
			debugger;
			  jfRest.request('cashStage', 'sureStage', $scope.trailInf).then(function(data) {
 		    	if(data.returnCode == '000000'){
 		    		
 		    		jfLayer.success("现金分期成功！");
 		    		
 		    		
 		    		$scope.isShow = false;
 		    	}else {
 		    		var returnMsg = data.returnMsg ? data.returnMsg :"操作失败！";
 		    		jfLayer.fail(returnMsg);
 		    	}
 		    	
 		    });
		};*/
	});
});
