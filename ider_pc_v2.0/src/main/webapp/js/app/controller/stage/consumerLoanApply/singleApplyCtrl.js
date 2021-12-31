'use strict';
define(function(require) {
	var webApp = require('app');
	//单笔无账期信贷申请
	webApp.controller('singleApplyCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/loanTrial/i18n_loanTrial');
		$translatePartialLoader.addPart('pages/cstSvc/cashStage/i18n_cashStage');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShow = false;
		//申请币种
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
		//客服: 0,网银:1,柜台: 2
		$scope.ecommSourceCdeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_tradingSource",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//用途    消费:0,现金:1
		$scope.purposeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_purpose",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//确定
		$scope.sureSingle = function(){
			if($scope.singleInf.purpose == '1'){
				if($scope.singleInf.receiveAccount && $scope.singleInf.accountBankNo){
					jfRest.request('conApply', 'single', $scope.singleInf).then(function(data) {
		  		    	if(data.returnCode == '000000'){
		  		    		jfLayer.success(T.T('FQJ200013'));    //"申请成功！");
		  		    	}
		  		    });
				}else{
					jfLayer.fail(T.T('FQJ200021'));    //"请输入收款账户和收款账户所属银行");FQJ200021
				}
			}else{
				jfRest.request('conApply', 'single', $scope.singleInf).then(function(data) {
	  		    	if(data.returnCode == '000000'){
	  		    		jfLayer.success(T.T('FQJ200013'));    //"申请成功！");
	  		    	}
	  		    });
			}
		};
	});
});
