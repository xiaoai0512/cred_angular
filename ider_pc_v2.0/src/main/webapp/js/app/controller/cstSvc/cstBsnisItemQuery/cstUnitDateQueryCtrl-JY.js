'use strict';
define(function(require) {
	var webApp = require('app');
	//客户业务项目查询
	webApp.controller('cstUnitDateQueryCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$scope.showItemList = false;
		//重置
		$scope.reset = function() {
			$scope.itemList.params={};
			$scope.showItemList = false;
		};
		$scope.searchCstUnitDate = function(){
			if(($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined ) && ( $scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert("请输入证件号码或外部识别号");
			}
			else{
				$scope.itemList.search();
			}
		};
		//查询
		$scope.itemList = {
//			checkType : 'radio',
			params :{
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstUnitDate.query',// 列表的资源
			autoQuery : false,
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode != "000000"){
					$scope.showItemList = false;
				}
				else{
					$scope.showItemList = true;
				}
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.updateCstBsnisItemInfo = function(item){
			$scope.cstUnitDateInf = $.parseJSON(JSON.stringify(item));
//			$scope.csInfEstbInfo.contacAddress = item.contactAddress;
			$scope.modal('/cstSvc/cstBsnisItemQuery/updateUnitDate.html', $scope.cstUnitDateInf, {
				title : '详细信息',
				buttons : [ '确认','取消' ],
				size : [ '800px', '400px' ],
				callbacks : [$scope.updateCstUnitDate]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateCstUnitDate = function(result) {
			$scope.cstUnitDateInfParams = result.scope.cstUnitDateInf;
			jfRest.request('cstUnitDate', 'update', $scope.cstUnitDateInfParams)
					.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success("修改成功");
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
						}
			});
		};
	});
	webApp.controller('updateUnitDateCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.cstUnitDateInf = $scope.cstUnitDateInf;
	});
});
