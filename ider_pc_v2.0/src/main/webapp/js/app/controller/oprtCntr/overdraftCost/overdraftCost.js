'use strict';
define(function(require) {

	var webApp = require('app');
	
	//交易费用设置
	webApp.controller('overdraftCostSettingCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//下拉框数据
		//本地交易费用标识
		$scope.costSingCashArray = [{name : '非本地交易' ,id : 'N'},{name : '本地交易' ,id : 'Y'}] ;
		//交易来源
		$scope.transChannelArray = [{name : 'ATM类' ,id : '1'},{name : '柜台类' ,id : '2'},{name : '其他类' ,id : '9'}] ;
		$scope.currencyArr = [{name:"人民币",id:"CNY"},{name:"美元",id:"USD"},{name:"欧元",id:"978"}];//
		//保存
		$scope.saveOverdraftCost = function(){
			jfRest.request('overdraftCost', 'save', $scope.addOverdraftCost).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功") ;
					$scope.addOverdraftCost = {};
					$scope.overdraftCostForm.$setPristine();
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : '保存失败' ;
					jfLayer.fail(returnMsg) ;
				}
			});
		}

	});
	
	//交易费用管理
	webApp.controller('overdraftCostMgtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//下拉框数据
		//本地交易费用标识
		$scope.costSingCashArray = [{name : '非本地交易' ,id : 'N'},{name : '本地交易' ,id : 'Y'}] ;
		//交易来源
		$scope.transChannelArray = [{name : 'ATM类' ,id : '1'},{name : '柜台类' ,id : '2'},{name : '其他类' ,id : '9'}] ;
		$scope.currencyArr = [{name:"人民币",id:"156"},{name:"美元",id:"840"},{name:"欧元",id:"978"}];//
		//交易费用列表
		$scope.overdraftCostTable = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'overdraftCost.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		//交易费用修改 （弹出页面）
		$scope.updateOverdraftCost = function(item){
			if(item != null && item != undefined){
				//复制对象互不影响
				var itemStr = JSON.stringify(item);
				$scope.overdraftCostModify = $.parseJSON(itemStr);
			}else{
				$scope.overdraftCostModify = {};
			}
			
			$scope.modal('/oprtCntr/overdraftCost/overdraftCostModify.html', $scope.overdraftCostModify, {
				title : '交易费用修改',
				buttons : [ '修改','关闭' ],
				size : [ '1000px', '600px' ],
				callbacks : [$scope.sureUpdateOverdraftCost]
			});
		};
		
		//交易费用修改（弹出页面）- 回调函数
		$scope.sureUpdateOverdraftCost = function(result){
			jfRest.request('overdraftCost','modify', $scope.overdraftCostModify).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功",function(){
						$scope.safeApply();
						result.cancel();
						//刷新列表数据
						$scope.overdraftCostTable.search();
					});
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : '修改失败' ;
					jfLayer.fail(returnMsg) ;
				}
			});
		};
		
		//交易费用查看（弹出页面）
		$scope.lookOverdraftCost = function(item){
			if(item != null && item != undefined){
				//复制对象(item和$scope.actiBalaPositionModify)互不影响
				var itemStr = JSON.stringify(item);
				$scope.overdraftCostModify = $.parseJSON(itemStr);
			}else{
				$scope.overdraftCostModify = {};
			}
			
			$scope.modal('/oprtCntr/overdraftCost/overdraftCostLook.html', $scope.overdraftCostModify, {
				title : '交易费用详情',
				buttons : [ '关闭' ],
				size : [ '1000px', '600px' ],
				callbacks : []
			});
		}
	});
	
	//交易费用修改-弹出框
	webApp.controller('overdraftCostModifyCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyArr = [{name:"人民币",id:"156"},{name:"美元",id:"840"},{name:"欧元",id:"978"}];//
	});
	
	//交易费用查看-弹出框
	webApp.controller('overdraftCostLookCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyArr = [{name:"人民币",id:"156"},{name:"美元",id:"840"},{name:"欧元",id:"978"}];//
	});
});
