'use strict';
define(function(require) {
	var webApp = require('app');
	//运营入账币种查询及维护
	webApp.controller('operatCurrencyQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		 //運營模式
		 $scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
		    };
		//人民币
		$scope.currencyCodeArr = [{name:"人民币",id:"156"},{name:"美元",id:"840"}];//
		$scope.optCcyList = {
//			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'operatCurrency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkOptCurrency = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.vwOptCurrencyItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/operatCurrency/viewOptCurrency.html', $scope.vwOptCurrencyItem, {
				title : '业务形态信息',
				buttons : [  '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateOptCurrency= function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.upOptCurrencyItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/operatCurrency/updateOptCurrency.html', $scope.upOptCurrencyItem, {
				title : '修改业务形态信息',
				buttons : [ '确定', '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.saveOptCcy]
			});
		};
		//保存
		$scope.saveOptCcy = function (result){
			console.log(result);
			//$scope.businessFormItem.operationMode = result.scope.updateOperationMode;
			jfRest.request('operatCurrency', 'update', $scope.upOptCurrencyItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					console.log(data.returnData);
					 jfLayer.success("修改成功！");
					 $scope.safeApply();
					 result.cancel();
					 $scope.optCcyList.search();
				}
			});
		}
	});
	webApp.controller('viewOptCurrencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
	});
	webApp.controller('updateOptCurrencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
	});
});
