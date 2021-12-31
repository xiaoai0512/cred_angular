'use strict';
define(function(require) {

	var webApp = require('app');

	// 会计分录模板管理
	webApp.controller('accountTemplateAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {

		//自定义下拉框---------借贷方向
		$scope.direction = [
		                    {name : '借' ,id : 'D'},
		                    {name : '贷' ,id : 'C'}
		                    ] ;
		//自定义下拉框---------金额符号
		$scope.symbol = [
		                    {name : '+' ,id : '0'},
		                    {name : '-' ,id : '1'}
		                    ] ;
		//自定义下拉框---------摘要配置方式
		$scope.configArray = [
		                    {name : '手工配置' ,id : '0'},
		                    {name : '动态配置' ,id : '1'}
		                    ] ;
		//自定义下拉框---------币种
		$scope.moneyArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'},] ;
		//自定义下拉框---------金额类型
		$scope.typeArray = [
		                    {name : '本金金额' ,id : '1'},
		                    {name : '利息金额' ,id : '2'},
		                    {name : '交易金额' ,id : '3'},
		                    {name : '税后利息' ,id : '4'},
		                    {name : '税金金额' ,id : '5'},
		                    ] ;
		//自定义下拉框---------核算场景
		$scope.tradArray = [
		                    {name : '个人结计利息（非应计户）' ,id : '0'},
		                    {name : '个人结计利息（正常户）' ,id : '1'},
		                    {name : '个人普通还款（核销户）' ,id : '2'},
		                    {name : '个人非应计转核销' ,id : '3'},
		                    {name : '个人借记入账（正常户）' ,id : '4'},
		                    {name : '个人借记购汇入账（正常户）' ,id : '5'},
		                    {name : '个人借记入账（非应计户）' ,id : '6'},
		                    {name : '个人贷记入账（正常户）' ,id : '7'},
		                    {name : '个人贷记购汇入账（正常户）' ,id : '8'},
		                    {name : '个人贷记入账（非应计）' ,id : '9'},
		                    {name : '个人结计利息（核销户）' ,id : '10'},
		                    {name : '个人普通还款（正常户）' ,id : '11'},
		                    {name : '个人约定还款（正常户）' ,id : '12'},
		                    {name : '个人购汇还款（正常户）' ,id : '13'},
		                    {name : '个人普通还款（非应计户）' ,id : '14'},
		                    {name : '个人约定还款（非应计户）' ,id : '15'},
		                    {name : '个人购汇还款（非应计户）' ,id : '16'},
		                    {name : '个人约定还款（核销户）' ,id : '17'},
		                    {name : '个人购汇还款（核销户）' ,id : '18'},
		                    {name : '个人正常转非应计' ,id : '19'}
		                    ] ;
		$scope.tradSelinfo = true;
		var addCancelNew = "";
		$scope.addWweekNewList = [];
		//新增模板配置
		$scope.addEntryInfo = function(event) {
			console.log(event);
			// 页面弹出框事件(弹出页面)
			$scope.modal('/oprtCntr/financeCenter/accountTemplateConAdd.html','', {
				title : '查询详细信息',
				buttons : ['确定', '关闭'],
				size : [ '800px', '480px' ],
				callbacks : [$scope.callbacks ]
			});
		};
		$scope.callbacks = function(result){
			console.log(result);
			console.log(result.scope.items);
			addCancelNew ={amountType:result.scope.items.amountType,businessTyp:result.scope.items.businessTyp,currencyCde:result.scope.items.currencyCde,debitCreditFlag:result.scope.items.debitCreditFlag,fundDirectFlag:result.scope.items.fundDirectFlag,itemId:result.scope.items.itemId,itemNme:result.scope.items.itemNme,summaryConfigTyp:result.scope.items.summaryConfigTyp,summaryContent:result.scope.items.summaryContent};
 			$scope.addWweekNewList.push(addCancelNew);
			jfLayer.success("保存成功");
			$scope.detaillistTable = $scope.addWweekNewList;
			$scope.safeApply();
			result.cancel();
			$scope.tradSelinfo = false;
		};
    	// 保存信息事件
		$scope.saveAccountScene = function() {
			jfLayer.success("保存成功");
			$scope.mdmInfoForm.$setPristine();
			$scope.item = {};
			$scope.detaillistTable = "";
			$scope.tradSelinfo = true;
		};
		//取消事件
		$scope.resetInfo = function(){
			$scope.item = {};
			$scope.detaillistTable = "";
			$scope.tradSelinfo = true;
	}
		
	});
});
