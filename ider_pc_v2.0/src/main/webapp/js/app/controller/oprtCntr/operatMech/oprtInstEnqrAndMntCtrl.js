'use strict';
define(function(require) {

	var webApp = require('app');

	//运营机构查询及维护
	webApp.controller('oprtInstEnqrAndMntCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		
		//运营机构列表
		$scope.operatMechTable = {
			checkType : false, // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'operatMech.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//修改
		$scope.updateOrganNo = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/oprtCntr/operatMech/oprtInstEnqrAndMntMod.html', $scope.items, {
				title : '运营机构信息',
				buttons : [ '保存', '关闭' ],
				size : [ '900px', '300px' ],
				callbacks : [$scope.saveProInf]
			});
		};
		//保存
		$scope.saveProInf = function (result){
			$scope.warningMsg = "";
			if ($scope.items.organName.length==0) {
				$scope.warningMsg += "请输入机构名称（最长十位）！"
			} 
			if ($scope.items.operationMode.length==0) {
				$scope.warningMsg += "请输入运营模式（最长十位）！"
			}
			if ($scope.warningMsg == "") {
				jfRest.request('operatMech', 'update', $scope.items)//Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success("修改成功！");
						 $scope.safeApply();
						result.cancel();
						$scope.operatMechTable.search();
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('KHJ1300009');//"查询日期失败！";
						jfLayer.fail(returnMsg);
					}
				});
			} else {
				 jfLayer.fail($scope.warningMsg);
			}
			
		}
	});
});
