'use strict';
define(function(require) {
	var webApp = require('app');
	// 会计分录模板管理
	webApp.controller('accountTemplateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//自定义下拉框---------借贷方向
		$scope.direction = [
		                    {name : '借' ,id : 'D'},
		                    {name : '贷' ,id : 'C'},
		                    {name : '收' ,id : 'R'},
		                    {name : '付' ,id : 'P'}
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
		//会计分录模板管理
		$scope.itemList = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'accountTemplate.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
		//查询模板详情
		$scope.selectInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/oprtCntr/financeCenter/accountTemplateInfo.html', $scope.item, {
				title : '会计分录详细信息',
				buttons : [ '关闭'],
				size : [ '1100px', '500px' ],
				callbacks : [ ]
			});
		};
		//维护模板
		$scope.updateControl = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/oprtCntr/financeCenter/accountTemplateUpdate.html', $scope.item, {
				title : '修改会计分录信息',
				buttons : [ '确定','关闭'],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.callbacksTemp]
			});
		};
		$scope.callbacksTemp = function(result){
			jfRest.request('accountTemplate', 'update', $scope.item)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功");
					$scope.itemList.search();
					$scope.safeApply();
					result.cancel();	
				}
			});
		} 
	});
	//查询详情
	webApp.controller('accountTemplateInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.tradSelinfo = false;
        if($scope.item.accountScene == "0"){
        	$scope.item.accountScene = "个人结计利息（非应计户）";
        }else if($scope.item.accountScene == "1"){
        	$scope.item.accountScene = "个人结计利息（正常户）";
        }else if($scope.item.accountScene == "2"){
        	$scope.item.accountScene = "个人普通还款（核销户）";
        }else if($scope.item.accountScene == "3"){
        	$scope.item.accountScene = "个人非应计转核销";
        }else if($scope.item.accountScene == "4"){
        	$scope.item.accountScene = "个人借记入账（正常户）";
        }else if($scope.item.accountScene == "5"){
        	$scope.item.accountScene = "个人借记购汇入账（正常户）";
        }else if($scope.item.accountScene == "6"){
        	$scope.item.accountScene = "个人借记入账（非应计户）";
        }else if($scope.item.accountScene == "7"){
        	$scope.item.accountScene = "个人贷记入账（正常户）";
        }else if($scope.item.accountScene == "8"){
        	$scope.item.accountScene = "个人贷记购汇入账（正常户）";
        }else if($scope.item.accountScene == "9"){
        	$scope.item.accountScene = "个人贷记入账（非应计）";
        }else if($scope.item.accountScene == "10"){
        	$scope.item.accountScene = "个人结计利息（核销户）";
        }else if($scope.item.accountScene == "11"){
        	$scope.item.accountScene = "个人普通还款（正常户）";
        }else if($scope.item.accountScene == "12"){
        	$scope.item.accountScene = "个人约定还款（正常户）";
        }else if($scope.item.accountScene == "13"){
        	$scope.item.accountScene = "个人购汇还款（正常户）";
        }else if($scope.item.accountScene == "14"){
        	$scope.item.accountScene = "个人普通还款（非应计户）";
        }else if($scope.item.accountScene == "15"){
        	$scope.item.accountScene = "个人约定还款（非应计户）";
        }else if($scope.item.accountScene == "16"){
        	$scope.item.accountScene = "个人购汇还款（非应计户）";
        }else if($scope.item.accountScene == "17"){
        	$scope.item.accountScene = "个人约定还款（核销户）";
        }else if($scope.item.accountScene == "18"){
        	$scope.item.accountScene = "个人购汇还款（核销户）";
        }else if($scope.item.accountScene == "19"){
        	$scope.item.accountScene = "个人正常转非应计";
        }
		if($scope.item.detaillist != null){
			$scope.tradSelinfo = false;
			$scope.detaillistTable = $scope.item.detaillist;
		}
		else{
			$scope.tradSelinfo = true;
		}
	});
	//维护详情
	webApp.controller('accountTemplateUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
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
		$scope.tradSelinfo = false;
		$scope.accountSceneUpdate = $scope.item.accountScene;
		//自定义下拉框---------金额类型
		$scope.typeArray = [
		                    {name : '本金金额' ,id : '1'},
		                    {name : '利息金额' ,id : '2'},
		                    {name : '交易金额' ,id : '3'},
		                    {name : '税后利息' ,id : '4'},
		                    {name : '税金金额' ,id : '5'},
		                    ] ;
		if($scope.item.detaillist != null){
			$scope.tradSelinfo = false;
			$scope.detaillistTable = $scope.item.detaillist;
		}
		else{
			$scope.tradSelinfo = true;
		}
		//模板详情查询
		//修改模板配置
		$scope.updateConfig = function(result) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(result));
			$scope.modal('/oprtCntr/financeCenter/accountTemplateConfigAdd.html',$scope.items, {
				title : '修改配置信息',
				buttons : [ '确定','关闭'],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.callbacks]
			});
		};
		$scope.callbacks = function(result){
			jfRest.request('accountTemplate', 'updateDetail', $scope.items)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功");
					console.log($scope.accountSceneUpdate);
					$scope.aryparamss = {
							"accountScene":$scope.accountSceneUpdate
					};
					jfRest.request('accountTemplate', 'query', $scope.aryparamss)
					.then(function(data) {
						if (data.returnCode == '000000') {
							if(data.returnData.rows[0].detaillist != null){
								$scope.tradSelinfo = false;
								$scope.detaillistTable = data.returnData.rows[0].detaillist;
							}
							else{
								$scope.tradSelinfo = true;
							}
						}
					});
					$scope.safeApply();
					result.cancel();
				}else{
					jfLayer.fail("修改失败");
				}
			});
		} 
	});
});
