'use strict';
define(function(require) {

	var webApp = require('app');

	// 业务类型管理
	webApp.controller('productObjectListCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {

		$scope.bsnTpMgtInfo = {

		};
		$scope.mediaObjectTypeArray = [ {
			/* :R实体卡,V虚拟卡 : 媒介类型:R实体卡,V虚拟卡 */
			name : 'R-实体卡',
			id : 'R'
		}, {
			name : 'V-虚拟卡',
			id : 'V'
		} ];
		$scope.pcdtypeArray = [ {
			name : '数值',
			id : 'D'
		}, {
			name : '百分比',
			id : 'P'
		} ];
		$scope.avyListTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				pageSize : 10,
				indexNo : 0,

			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaObj.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 详情
		$scope.checkBalObjElmDtl = function(event) {
			$scope.item = event;
			if ($scope.item.mediaObjectType == "R") {
				$scope.item.mediaObjectTypeTran = "实体卡";
			} else if ($scope.item.mediaObjectType == "V") {
				$scope.item.mediaObjectTypeTran = "虚拟卡";
			}

			$scope.modal('/oprtCntr/mediaObject/checkMediaObject.html',
					$scope.item, {
						title : '详情',
						buttons : [ '保存','关闭' ],
						size : [ '1050px', '400px' ],
						callbacks : [ $scope.updateObjArtifact ]
					});
		};
		$scope.updateObjArtifact = function(result){
			
		};

		// 新增构件按钮
		$scope.addArtifact = function(result) {
			$scope.modal('/oprtCntr/mediaObject/addObjectArtifact.html',
					$scope.item, {
						title : '详情',
						buttons : [ '新增构件','关闭' ],
						size : [ '1050px', '400px' ],
						callbacks : [ $scope.addArtifact ]
					});
		};

	});
	webApp.controller('checkProductObjectCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.balObjListInfo = {

		};
		$scope.showBalObjInfo = false;
		$scope.elmListTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				objectCode : $scope.item.mediaObjectCode,
				objectType : "M",// 余额对象构件实例
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'balObjList.queryelmAllInfoList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 修改
		$scope.updateBalObjInfo = function(item) {
			$scope.balObjListInfo = $.parseJSON(JSON.stringify(item));
			if ($scope.balObjListInfo.currencyCode == "156") {
				$scope.balObjListInfo.currencyCodeTran = "人民币";
			} else if ($scope.balObjListInfo.currencyCode == "840") {
				$scope.balObjListInfo.currencyCodeTran = "美元";
			}
			$scope.showBalObjInfo = true;
		};
		// 保存
		$scope.saveBalObjInfo = function() {

			$scope.saveParam = {
				operationMode : $scope.balObjListInfo.operationMode,
				objectType : $scope.balObjListInfo.objectType,
				objectCode : $scope.balObjListInfo.objectCode,
				objectCode2 : $scope.balObjListInfo.objectCode2,
				pcdNo : $scope.balObjListInfo.pcdNo,
				currencyCode : $scope.balObjListInfo.currencyCode,
				pcdType : $scope.balObjListInfo.pcdType,
				pcdValue : $scope.balObjListInfo.pcdValue,
				pcdPoint : $scope.balObjListInfo.pcdPoint
			};
			jfRest.request('balObjList', 'updatePcd', $scope.saveParam)// Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					console.log(data.returnData);
					jfLayer.success("修改成功");
				}
			});
			$scope.elmListTable.search();
		};
		// 关闭
		$scope.closeBtn = function() {
			$scope.showBalObjInfo = false;
		}
	});
	
	
	
	webApp.controller('artiEleCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.artiEleTable = {
				// checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					objectCode : $scope.item.mediaObjectCode,
					objectType : "M",// 余额对象构件实例
					pageSize : 10,
					indexNo : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'balObjList.queryelmAllInfoList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});

});
