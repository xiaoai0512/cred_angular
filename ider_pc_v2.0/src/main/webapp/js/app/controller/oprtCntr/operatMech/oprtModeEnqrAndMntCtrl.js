'use strict';
define(function(require) {

	var webApp = require('app');

	//运营模式查询及维护
	webApp.controller('oprtModeEnqrAndMntCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		$scope.currencyArr = [{name:"人民币",id:"CNY"},{name:"美元",id:"USD"},{name:"欧元",id:"978"}];//
		
		//运营模式列表
		$scope.operatModeTable = {
			checkType : false, // 当为checkbox时为多选
			params : $scope.queryParam = {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'operatMode.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		//活动余额对象定位修改（弹出页面）
		$scope.updateOperatMode = function(item){
			if(item != null && item != undefined){
				//复制对象(item和$scope.actiBalaPositionModify)互不影响
				var itemStr = JSON.stringify(item);
				$scope.operatModeModify = $.parseJSON(itemStr);
			}else{
				$scope.operatModeModify = {};
			}
			
			$scope.modal('/oprtCntr/operatMech/operatModeModify.html', $scope.operatModeModify, {
				title : '运营模式修改',
				buttons : [ '修改','关闭' ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.sureUpdateOperatMode]
			});
		};
		
		//活动余额对象定位修改（弹出页面）- 回调函数
		$scope.sureUpdateOperatMode = function(result){
			jfRest.request('operatMode','update', $scope.operatModeModify).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功",function(){
						 $scope.safeApply();
							result.cancel();
						//刷新列表数据
						$scope.operatModeTable.search();
					});
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : '修改失败' ;
					jfLayer.fail(returnMsg) ;
				}
			});
		};
		//查看
		$scope.checkOperatMode = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/oprtCntr/operatMech/viewOperatMode.html', $scope.item, {
				title : '运营模式信息',
				buttons : [ '关闭' ],
				size : [ '1000px', '350px' ],
				callbacks : []
			});
		};
		
		
	});
	

});
