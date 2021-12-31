'use strict';
define(function(require) {

	var webApp = require('app');

	//会计分录查询
	webApp.controller('accountEntryQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		//会计分录列表
		$scope.accountEntryTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountEntry.query',// 列表的资源
			autoQuery:false,
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	/*	//修改
		$scope.updateCurrency = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/oprtCntr/currency/currencyMod.html', $scope.items, {
				title : 'BIN信息',
				buttons : [ '确定', '关闭' ],
				size : [ '850px', '280px' ],
				callbacks : [$scope.saveCurrency]
			});
		};
		//保存
		$scope.saveCurrency = function (result){
			jfRest.request('currency', 'update', $scope.items)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					console.log(data.returnData);
					 jfLayer.success("修改成功！");
					 $scope.safeApply();
						result.cancel();
					 $scope.currencyTable.search();
					 
				}else {
					 var returnMsg = data.returnMsg ? data.returnMsg : T.T('KHJ1300009');//"查询日期失败！";
					jfLayer.fail(returnMsg);
				}
			});
		}*/
	});
	

});
