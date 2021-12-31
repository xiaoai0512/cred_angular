'use strict';
define(function(require) {
	var webApp = require('app');
	//运营入账币种建立
	webApp.controller('operatCurrencyEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.optCurrencyInf= {};
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
		//保存
		$scope.saveOptCcyForm = function(){
			jfRest.request('operatCurrency','save', $scope.optCurrencyInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功") ;
					$scope.optCurrencyInf = {};
					$scope.optCcyFormInfForm.$setPristine();
				}
			});
		}
	});
});
