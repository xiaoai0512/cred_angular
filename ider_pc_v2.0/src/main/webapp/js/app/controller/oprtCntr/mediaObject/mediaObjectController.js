'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('mediaObjListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.pcdtypeArray = [{name : '数值' ,id : 'D'},{name : '百分比' ,id : 'P'}] ;
		// 媒介对象列表
		$scope.mediaListTable = {
			params : $scope.queryParam = {}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaObj.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.checkMediaObjElmDtl = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/oprtCntr/mediaObject/checkMediaObject.html', $scope.item, {
				title : '媒介对象及构件详情',
				buttons : ['关闭' ],
				size : [ '1050px', '400px' ],
			 callbacks : []
			});
		};
		//回调
		$scope.callback = function(result){
			//保存媒介对象
			$scope.saveBalanceObj = {
					operationMode : $scope.item.operationMode,
					mediaObjectCode : $scope.item.mediaObjectCode,
					objectDesc : $scope.item.objectDesc,
					objectType : $scope.item.objectType,
					beginDate : $scope.item.beginDate,
					endDate : $scope.item.endDate,
					interestBilledBalanceObject : $scope.item.interestBilledBalanceObject,
					duePriority : $scope.item.duePriority,
				};
			jfRest.request('balObjList', 'updateBalance', $scope.saveBalanceObj)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success("修改成功");
					 //保存媒介对象实例
					 $scope.itemList.search();
				}
			});
			//保存媒介对象构件
	    	$scope.safeApply();
	    	result.cancel();
	    }
	});
	//维护按钮弹出页
	webApp.controller('checkMediaObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.queryParamWay = function(){
			$scope.queryParam = {
					objectCode : $scope.item.mediaObjectCode,
					objectType : "M",// 余额对象构件实例
					pageSize : 10,
					indexNo : 0
			};
			jfRest.request('balObjList', 'queryelmAllInfoList', $scope.queryParam)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$rootScope.treeSelect = data.returnData.rows;
					if (data.returnData.rows == null) {
						$rootScope.treeSelect = [];
					}
				}
			});
		};
		$scope.queryParamWay();
		//修改
		$scope.updateBalObjInfo = function(item){
			//页面弹出框事件(弹出页面)
			$scope.itemBalObj = $.parseJSON(JSON.stringify(item));
			$scope.elementNoUp = $scope.itemBalObj.elementNo;
			  $scope.modal('/oprtCntr/balanceObjArtElePCd/balObjElePcd.html',$scope.itemBalObj,
					  {title :'构件可选元件列表及PCD',
				  buttons : ['保存','关闭'],
				  size : ['1050px','400px'],
				  callbacks : [$scope.selectCorporat5]});
		};
		$scope.selectCorporat5 = function(result){
			//替换元件
			$scope.artEleInf  = result.scope.eleTable.checkedList();
			if($scope.artEleInf!=null){
				$scope.elementNosure = $scope.artEleInf.elementNo;
				$scope.elementDescsure = $scope.artEleInf.elementDesc;
				for(var i=0;i<$scope.treeSelect.length;i++){
					if($scope.treeSelect[i].elementNo == $scope.elementNoUp){
						 $scope.treeSelect[i].elementNo = 	 $scope.elementNosure;
						 $scope.treeSelect[i].elementDesc = 	$scope.elementDescsure;
						 $scope.elementNoUp = $scope.elementNosure;
					}
				}
			}
			$scope.saveBalanceObjArt = {
					operationMode : $scope.item.operationMode,
					objectType : "M",
					objectCode : $scope.item.mediaObjectCode,
					list : $rootScope.treeSelect,
				};
			jfRest.request('productObj', 'updateProductArt', $scope.saveBalanceObjArt)
			.then(function(data) {
				if (data.returnCode == '000000') {
					//保存对象pcd
					if(result.scope.showBalObjInfo){
						$scope.balObjListInfo = result.scope.balObjListInfo;
						$scope.saveParam = {
								operationMode : $scope.item.operationMode,
								objectType : "M",
								objectCode : $scope.item.mediaObjectCode,
								pcdNo : $scope.balObjListInfo.pcdNo,
								currencyCode : $scope.balObjListInfo.currencyCode,
								pcdType : $scope.balObjListInfo.pcdType,
								pcdValue : $scope.balObjListInfo.pcdValue,
								pcdPoint : $scope.balObjListInfo.pcdPoint
							};
						jfRest.request('balObjList', 'updatePcd', $scope.saveParam)
						.then(function(data) {
							if (data.returnCode == '000000') {
								console.log(data.returnData);
								 jfLayer.success("修改成功");
								 $scope.safeApply();
							     result.cancel();
							     $scope.queryParamWay();
							}
						});
					}else{
						 jfLayer.success("修改成功");
						 $scope.safeApply();
					     result.cancel();
					     $scope.queryParamWay();
					}
				}
			});
		};
		//保存对象pcd
		$scope.saveBalObjInfo = function(){
		};
		 //*****************弹框构件列表*****************
	    $scope.newArtWay = function(){
			//页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/mediaObject/checkBalObjArt.html',"",
				  {title :'构件列表',
			  buttons : ['保存','关闭'],
			  size : ['1050px','600px'],
			  callbacks : [$scope.selectCorporat3]});
	    };
	    //回调函数新增构件
	    var newArtBusPat = [];
	    $scope.selectCorporat3 =function (result)  {
	    	var treeSelect = [];
			var Items = [];
			var isTip = false;						//是否提示
			var tipStr = "";
			$scope.gudge = true;
			if (!result.scope.elmListTable.validCheck()) {
				return;
			}
			if (!result.scope.eleTable.validCheck()) {
				return;
			}
			//选中的行对象数组
			var itemsTemp  = result.scope.elmListTable.checkedList();
			var eleChoiced  = result.scope.eleTable.checkedList();
			//此处都为单选
			itemsTemp.elementNo =eleChoiced.elementNo;
			itemsTemp.elementDesc =eleChoiced.elementDesc;
			var items=[];
			items.push(itemsTemp);
				if ($rootScope.treeSelect!=null&&$rootScope.treeSelect.length>0) {
					for (var i = 0; i < items.length; i++) {
						var isExist = false;						//是否存在
						for (var k = 0; k < $rootScope.treeSelect.length; k++) {
							if (items[i].artifactNo == $rootScope.treeSelect[k].artifactNo) {    //判断是否存在
								tipStr = tipStr + items[i].artifactNo + ",";
								isTip = true;
								isExist = true;
								break;
							}
						}
						if(!isExist){
							$rootScope.treeSelect.push(items[i]);	
						}
					}
				}else {
					for (var i = 0; i < items.length; i++) {
						$rootScope.treeSelect.push(items[i]);
					}
				}
				if(isTip){
					jfLayer.alert("构件编号【" + tipStr.substring(0,tipStr.length-1) + "】已存在，不再添加！");
				}else{
					$scope.saveBalanceObjArt = {
							operationMode : $scope.item.operationMode,
							objectType : "M",
							objectCode : $scope.item.mediaObjectCode,
							list : $rootScope.treeSelect,
						};
					jfRest.request('productObj', 'updateProductArt', $scope.saveBalanceObjArt)
					.then(function(data) {
						if (data.returnCode == '000000') {
							if(result.scope.showBalObjInfoCheck){
								result.scope.showBalObjInfoCheck = false;
								itemsTemp.pcdNo = result.scope.balObjListInfoCheck.pcdNo;
								itemsTemp.currencyCode = result.scope.balObjListInfoCheck.currencyCode;
								itemsTemp.pcdValue = result.scope.balObjListInfoCheck.pcdValue;
								itemsTemp.pcdPoint = result.scope.balObjListInfoCheck.pcdPoint;
								itemsTemp.pcdType = result.scope.balObjListInfoCheck.pcdType;
								result.scope.balObjListInfoCheck ={};
								//新增对象pcd
						    	$scope.addPcdParam ={};
								var pcdList =[];
								pcdList.push(itemsTemp);
								$scope.addPcdParam.pcdList = pcdList;
								$scope.addPcdParam.operationMode = $scope.item.operationMode;
								$scope.addPcdParam.objectType = "M";
								$scope.addPcdParam.objectCode = $scope.item.mediaObjectCode;
								jfRest.request('balObjList', 'addPcd', $scope.addPcdParam)
								.then(function(data) {
									if (data.returnCode == '000000') {
											 jfLayer.success("新增成功");
									}
								});
							}else{
								jfLayer.success("新增成功");
							}
						}
					});
				$scope.safeApply();
		    	result.cancel();
				}
	    };
	    // 删除关联构件
		$scope.removeSelect = function(data,index) {
			var checkId = data;
			$rootScope.treeSelect.splice(index, 1);
			//修改对象构件实例
			$scope.saveProductObjArt = {
					operationMode : $scope.item.operationMode,
					objectType : "M",
					objectCode : $scope.item.mediaObjectCode,
					list : $rootScope.treeSelect,
				};
			jfRest.request('productObj', 'updateProductArt', $scope.saveProductObjArt)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					//删除对象pcd
					if(checkId.pcdNo!=null &&checkId.pcdNo!=""){
						$scope.delPcdParam ={};
						$scope.delPcdParam = checkId;
						$scope.delPcdParam.operationMode = $scope.item.operationMode;
						$scope.delPcdParam.objectType = "M";	
						$scope.delPcdParam.objectCode = $scope.item.mediaObjectCode;
						console.log($scope.delPcdParam);
						jfRest.request('balObjList', 'delPcd', $scope.delPcdParam)
						.then(function(data) {
							if (data.returnCode == '000000') {
								console.log(data.returnData);
								 jfLayer.success("删除成功");
							}
						});
					}else{
						jfLayer.success("删除成功");
					}
				}
			});
		}
	});
	webApp.controller('checkMediaObjArtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyArr = [{name:"人民币",id:"CNY"},{name:"美元",id:"USD"},{name:"欧元",id:"978"}];
		//构建列表
		$scope.elmListTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0,
						artifactType : "M"
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'balObjList.queryArtifactList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		$scope.queryElement =function(e){
			$scope.showBalObjInfoCheck = false;
			$scope.eleTable.params.artifactNo = e.item.artifactNo;
			$scope.eleTable.search();
			};
		//元件列表
		$scope.eleTable = {
				checkType : 'radio',
				autoQuery : false,
				params :{},
				paging : true,// 默认true,是否分页
				resource : 'balObjList.queryEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		$scope.showBalObjInfoCheck = false;
		$scope.queryPcd =function(e){
			//查询该元件是否有pcd
			$scope.queryPcdParam ={};
			$scope.queryPcdParam.elementNo = e.item.elementNo;
			jfRest.request('balObjList', 'queryPcd', $scope.queryPcdParam)
			.then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows!=null){
						$scope.balObjListInfoCheck={};
						$scope.balObjListInfoCheck.pcdNo = data.returnData.rows[0].pcdNo;
						$scope.showBalObjInfoCheck = true;
					}
				}else {
					$scope.showBalObjInfoCheck = false;
				}
			});
			}
	});
	webApp.controller('balObjElePcdCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//根据构件编号元件列表
		$scope.eleTable = {
				checkType : 'radio',
				params :{
					elementNo : $scope.itemBalObj.elementNo,
					isSelectFlag : true
				},
				paging : true,// 默认true,是否分页
				resource : 'balObjList.queryEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		$scope.showBalObjInfo = false;
		$scope.balObjListInfo = $.parseJSON(JSON.stringify($scope.itemBalObj));
		if($scope.balObjListInfo.currencyCode == "CNY" || $scope.balObjListInfo.currencyCode == "156"){
			$scope.balObjListInfo.currencyCodeTran ="人民币";
		} else if ($scope.balObjListInfo.currencyCode == "USD" || $scope.balObjListInfo.currencyCode == "840") {
			$scope.balObjListInfo.currencyCodeTran ="美元";
		}
		if($scope.balObjListInfo.pcdNo!=null && $scope.balObjListInfo.pcdNo!=""){
			$scope.showBalObjInfo = true;
		}else{
			$scope.showBalObjInfo = false;
		}
	});
});
