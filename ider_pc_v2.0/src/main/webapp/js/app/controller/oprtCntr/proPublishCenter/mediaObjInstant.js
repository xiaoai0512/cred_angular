'use strict';
define(function(require) {
	var webApp = require('app');
	// 媒介对象实例化
	webApp.controller('mediaObjInstantCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.mediaObjectType1 = [ {name : '实体卡', id : 'R'}, {name : '虚拟卡',id : 'V'} ];//余额类型
		//媒介对象可选构件
		$scope.selAvyList = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params :{
					    artifactNo :"3%"
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'balanceObjInst.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//***********************构件可选元件（弹出页面）***********************
		$scope.checklCOvewInfo = function(item,$index){
			$scope.indexNo = $index;
			$scope.viewEle ={
					elementNo : item.elementNo
			};
			$scope.modal('/oprtCntr/proPublishCenter/replaceMember.html', $scope.viewEle, {
				title : ' 可选元件',
				buttons : ['确认','关闭' ],
				size : [ '800px', '300px' ],
				callbacks : [$scope.sureEle]
			});
		};
		//确认元件// 回调函数/确认按钮事件
		$scope.sureEle = function(result){
			 $scope.items=result.scope.eleTable.checkedList();//选中列值
			 $scope.selAvyList.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			 $scope.selAvyList.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			 $scope.safeApply();
			 result.cancel();
		};
		//***********************修改pcd取值（弹出页面）***********************此处不调后台，修改缓存。
		$scope.updatePcdValue = function(item,$index){
			$scope.indexNo1 = $index;
			if(item != null && item != undefined){
				var itemStr = JSON.stringify(item);
				$scope.updatePcd= $.parseJSON(itemStr);
			}else{
				$scope.updatePcd= {};
			}
			$scope.modal('/oprtCntr/proPublishCenter/balObjPcd.html', $scope.updatePcd, {
				title : ' 媒介对象pcd值添加',
				buttons : ['保存','关闭' ],
				size : [ '800px', '300px' ],
				callbacks : [$scope.sureDif]
			});
		};
		$scope.sureDif = function(result){
			 $scope.selAvyList.data[$scope.indexNo1].currencyCode = $scope.updatePcd.currencyCode;
			 $scope.selAvyList.data[$scope.indexNo1].pcdType = $scope.updatePcd.pcdType;
			 $scope.selAvyList.data[$scope.indexNo1].pcdValue = $scope.updatePcd.pcdValue;
			 $scope.selAvyList.data[$scope.indexNo1].pcdPoint = $scope.updatePcd.pcdPoint;
			 $scope.safeApply();
			 result.cancel();
			 jfLayer.success("保存成功");
		};
		// 保存媒介对象，产品业务，产品构件
		$scope.saveMediaObject = function() {
			if(!$scope.selAvyList.validCheck()){
				return;
			}
			var list = [];
			$scope.objTagList = [];
			$scope.objPcdList = [];
			list = $scope.selAvyList.checkedList();
			for(var i=0 ;i < list.length;i++){
				$scope.mediaObjTemp = {};
				$scope.mediaObjTemp.artifactNo = list[i].artifactNo;
				$scope.mediaObjTemp.elementNo = list[i].elementNo;
				$scope.objTagList.push($scope.mediaObjTemp);
				$scope.objPcdEle = {};
				$scope.objPcdEle.pcdNo = list[i].pcdNo;
				$scope.objPcdEle.currencyCode = list[i].currencyCode;
				$scope.objPcdEle.pcdType = list[i].pcdType;
				$scope.objPcdEle.pcdValue = list[i].pcdValue;
				$scope.objPcdEle.pcdPoint = list[i].pcdPoint;
				$scope.objPcdList.push($scope.objPcdEle);
			}
			$scope.objTag.elList = $scope.objTagList;
			$scope.objTag.operationMode = $scope.mediaObj.operationMode;
			$scope.objTag.objectCode = $scope.mediaObj.balanceObjectCode;
			$scope.objPCD.pcdList = $scope.objPcdList;
			$scope.objPCD.operationMode = $scope.mediaObj.operationMode;
			$scope.objPCD.objectCode = $scope.mediaObj.balanceObjectCode;
			/*//余额对象
			$scope.mediaObj;*/
			jfRest.request('balanceObjInst', 'saveBalObj', $scope.mediaObj)
			.then(function(data) {
				if (data.returnCode == '000000') {
					//对象构件实例
					jfRest.request('balanceObjInst', 'saveObjTag', $scope.objTag)
					.then(function(data) {
						if (data.returnCode == '000000') {
							//对象pcd实例
							jfRest.request('balanceObjInst', 'saveObjPCD', $scope.objPCD)
							.then(function(data) {
								if (data.returnCode == '000000') {
									jfLayer.success("保存成功");
									$scope.turn("/oprtCntr/mediaObject");
								}
							});
						}
					});
				}
			});
		};
	});
	webApp.controller('replaceMemberCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.eleTable = {
				checkType : 'radio',
				params : $scope.queryParam = {
						elementNo : $scope.viewEle.elementNo,
						isSelectFlag : true
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'balanceObjInst.queryEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	webApp.controller('balObjPcdCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'}];//币种
		$scope.valTypArray = [{name : 'D-数值' ,id : 'D'},{name : 'P-百分比' ,id : 'P'}] ;
	});
});
