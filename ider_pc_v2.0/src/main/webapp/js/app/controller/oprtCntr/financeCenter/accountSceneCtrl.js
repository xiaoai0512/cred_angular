'use strict';
define(function(require) {
	var webApp = require('app');
	//核算场景
	webApp.controller('accountSceneCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.PCflagArr = [{name : '个人' ,id : 'P'},{name : '公司' ,id : 'C'}] ;
		$scope.tradeStateArray = [{name : '正常' ,id : 'NN'},{name : '拒绝' ,id : 'NR'},{name : '拒绝重入' ,id : 'RN'}] ;
		$scope.accountStateArray = [{name : '正常' ,id : '0'},{name : '非应计' ,id : '1'},{name : '核销' ,id : '2'}] ;
		$scope.assetAttributeArray = [{name : '正常' ,id : '0'},{name : '证券化' ,id : '1'}] ;
		$scope.repayTypeArray = [{name : '正常还款' ,id : '0'},{name : '购汇还款' ,id : '1'},{name : '约定还款' ,id : '2'}] ;
		$scope.clearSignArray = [{name : '入账币种清算' ,id : '0'},{name : '非入账币种清算' ,id : '1'}] ;
		//核算场景查询
		$scope.accountSceneTable = {
				params : {},
				paging : true,
				resource : 'accountScene.query',
				autoQuery:false,
				callback : function(data) {
				}
			};
		$scope.updateScene = function(e){
			$scope.accountSceneObj = $.parseJSON(JSON.stringify(e));
			$scope.modal('/oprtCntr/financeCenter/accountSceneUpdate.html', $scope.accountSceneObj, {
				title : '核算场景修改',
				buttons : [ '保存','关闭'],
				size : [ '900px', '400px' ],
				callbacks : [$scope.saveAccountScene]
			});
		};
    	// 保存信息事件
		$scope.saveAccountScene = function(result) {
            jfRest.request('accountScene', 'update', $scope.accountSceneObj).then(function(data) {
                if (data.returnCode == "000000") {
                	jfLayer.success("修改成功");
    				$scope.accountSceneTable.search();
    				$scope.safeApply();
					result.cancel();	
                }
            });
		};
		webApp.controller('accountSceneUpdateCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location) {
		});
	});
});
