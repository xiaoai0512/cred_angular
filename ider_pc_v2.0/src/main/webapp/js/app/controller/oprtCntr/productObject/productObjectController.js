'use strict';
define(function(require) {
	var webApp = require('app');
	//业务类型管理
	webApp.controller('productObjectListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.bsnTpMgtInfo = {
		};
		$scope.demoArray = [ {
			name : 'P-本金',
			id : '1'
		}, {
			name : 'I-利息',
			id : '2'
		}, {
			name : 'F-费用',
			id : '3'
		} ];
		 $scope.pcdtypeArray = [{name : '数值' ,id : 'D'},{name : '百分比' ,id : 'P'}] ;
		$scope.avyListTable = {
//			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize :10,
					indexNo :0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productObj.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//详情
		$scope.checkBalObjElmDtl = function(event){
			$scope.item = $.parseJSON(JSON.stringify(event));
			//页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/productObject/checkProductObject.html',
				  $scope.item,
				  {title :'详情',buttons : ['保存','关闭'],size : ['1050px','500px'],callbacks : [$scope.selectCorporat]});
		};
		//回调函数/确认按钮事件
		$scope.selectCorporat =function (result)  {
			//保存产品对象
			$scope.saveProductObj = {
					operationMode : $scope.item.operationMode,
					productObjectCode : $scope.item.productObjectCode,
					productDesc : $scope.item.productDesc,
					issueCardOrgan : $scope.item.issueCardOrgan,
					cardBin : $scope.item.cardBin,
					repaymentPriority : $scope.item.repaymentPriority,
				};
			jfRest.request('productObj', 'updateProduct', $scope.saveProductObj)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("修改成功");
				}
			});
			//保存产品对象构件
	    	$scope.safeApply();
	    	result.cancel();
	    };
	});
	webApp.controller('checkProductObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'},{name : '人民币' ,id : '156'},{name : '人民币' ,id : '840'}];//币种
		$scope.showtablelist = false;
		$scope.showBalObjInfo = false;
		$scope.queryParamWay = function(){
		 $scope.queryParam = {
					objectCode : $scope.item.productObjectCode,
					objectType : "P",
					"pageSize" : 10,
					"indexNo" : 0	
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
		//根据构件编号元件列表
		$scope.eleTable = {
//					checkType : 'radio',
				autoQuery : false,
				params : $scope.queryParam = {
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'newPDCfg.queryEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.updateAriEle = function(item){
			$scope.proObjArtEleInfo = $.parseJSON(JSON.stringify(item));
			$scope.elementNosure = $scope.proObjArtEleInfo.elementNo;
			$scope.elementDescsure = $scope.proObjArtEleInfo.elementDesc;
			for(var i=0;i<$scope.treeSelect.length;i++){
				if($scope.treeSelect[i].elementNo == $scope.elementNoUp){
					 $scope.treeSelect[i].elementNo = 	 $scope.elementNosure;
					 $scope.treeSelect[i].elementDesc = 	$scope.elementDescsure;
					 $scope.elementNoUp = $scope.elementNosure;
				}
			}
			jfLayer.success("替换成功");
			$scope.showtablelist = false;
		};
		  // 删除关联构件
		$scope.removeSelect = function(data,index) {
			var checkId = data;
			$rootScope.treeSelect.splice(index, 1);
			//修改对象构件实例
			$scope.saveProductObjArt = {
					operationMode : $scope.item.operationMode,
					objectType : "P",
					objectCode : $scope.item.productObjectCode,
					list : $rootScope.treeSelect,
				};
			jfRest.request('productObj', 'updateProductArt', $scope.saveProductObjArt)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					//删除对象pcd
					if(data.pcdNo!=null &&data.pcdNo!=""){
						$scope.delPcdParam ={};
						$scope.delPcdParam = data;
						$scope.delPcdParam.operationMode = $scope.item.operationMode;
						$scope.delPcdParam.objectType = "P";	
						$scope.delPcdParam.objectCode = $scope.item.balanceObjectCode;
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
			/*
			 * var arrId=treeSelect.indexOf(data); treeSelect.splice(arrId,1);
			 * $scope.checkedList=treeSelect;
			 */
		};
//		$scope.elmListTable = {
//				// checkType : 'radio', // 当为checkbox时为多选
//				params : $scope.queryParam = {
//					objectCode : $scope.item.productObjectCode,
//					objectType : "P",// 余额对象构件实例
//					pageSize : 10,
//					indexNo : 0
//				}, // 表格查询时的参数信息
//				paging : true,// 默认true,是否分页
//				resource : 'balObjList.queryelmAllInfoList',// 列表的资源
//				callback : function(data) { // 表格查询后的回调函数
//				}
//			};
		$scope.differentTable = {
//				checkType : 'checkbox', // 当为checkbox时为多选
				autoQuery:true,//不自动查询，
				params : $scope.queryParam = {
						objectCode2 : $scope.item.productObjectCode,
						objectType :"B",
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'productObj.queryDif',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//***********************修改差异化（弹出页面）***********************
		$scope.updateDif = function(item){
			if(item != null && item != undefined){
				//复制对象(item和$scope.actiBalaPositionModify)互不影响
				var itemStr = JSON.stringify(item);
				$scope.updateDiff= $.parseJSON(itemStr);
			}else{
				$scope.updateDiff= {};
			}
			$scope.modal('/other/newPDCfg/updateDif.html', $scope.updateDiff, {
				title : ' 产品差异化修改',
				buttons : ['确认','关闭' ],
				size : [ '800px', '300px' ],
				callbacks : [$scope.sureDif]
			});
		};
		//***********************确认修改差异化*********************** 
		$scope.sureDif = function(result){
			jfRest.request('productObj','updateDif', $scope.updateDiff).then(function(data) {
			if (data.returnCode == '000000') {
				jfLayer.success("修改成功",function(){
					result.cancel();
					//刷新列表数据
					$scope.differentTable.search();
				});
			}
			});
		};
		//修改
		$scope.balObjListInfo = {};
		$scope.updateBalObjInfo = function(item){
			$scope.itemBalObj = $.parseJSON(JSON.stringify(item));
			$scope.elementNoUp = $scope.itemBalObj.elementNo;
			  $scope.modal('/oprtCntr/productObject/proObjElePcd.html',$scope.itemBalObj,
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
			//修改对象构件实例
			$scope.saveProductObjArt = {
					operationMode : $scope.item.operationMode,
					objectType : "P",
					objectCode : $scope.item.productObjectCode,
					list : $scope.treeSelect,
				};
			jfRest.request('productObj', 'updateProductArt', $scope.saveProductObjArt)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					//保存对象pcd
					if(result.scope.showBalObjInfo){
						$scope.balObjListInfo = result.scope.balObjListInfo;
						$scope.saveParam = {
								operationMode : $scope.item.operationMode,
								objectType : "P",
								objectCode : $scope.item.productObjectCode,
								objectCode2 : $scope.balObjListInfo.objectCode2,
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
		//保存
		$scope.saveBalObjInfo = function(){
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
			jfRest.request('balObjList', 'updatePcd', $scope.saveParam)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					console.log(data.returnData);
					 jfLayer.success("修改成功");
				}
			});
			$scope.showBalObjInfo = false;
		};
		//关闭
		$scope.closeBtnTab = function(){
			$scope.showtablelist = false;
		};
		$scope.closeBtnObj = function(){
			$scope.showBalObjInfo = false;
		};
		 //*****************弹框构件列表*****************
	    $scope.newArtWay = function(){
			//页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/productObject/checkProObjArt.html',"",
				  {title :'构件列表',
			  buttons : ['保存','关闭'],
			  size : ['1050px','600px'],
			  callbacks : [$scope.selectCorporat3]});
	    };
	    //回调函数新增构件
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
			console.log(items);
			//选中的行对象数组
//			var items  = result.scope.elmListTable.checkedList();
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
					//新增对象构件实例
					$scope.saveProductObjArt = {
							operationMode : $scope.item.operationMode,
							objectType : "P",
							objectCode : $scope.item.productObjectCode,
							elList : items,
						};
					jfRest.request('productObj', 'AddProductArt', $scope.saveProductObjArt)//Tansun.param($scope.pDCfgInfo)
					.then(function(data) {
						if (data.returnCode == '000000') {
							//新增对象pcd
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
								$scope.addPcdParam.objectType = "P";
								$scope.addPcdParam.objectCode = $scope.item.productObjectCode;
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
				}
			$scope.safeApply();
	    	result.cancel();
	    };
	});
	webApp.controller('updateDiffCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'}];//币种
		$scope.valTypArray = [{name : 'D-数值' ,id : 'D'},{name : 'P-百分比' ,id : 'P'}] ;
	});
	webApp.controller('checkProObjArtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyArr = [{name:"人民币",id:"CNY"},{name:"美元",id:"USD"},{name:"欧元",id:"978"}];
		//构建列表
		$scope.elmListTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0,
						artifactType : "P"
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
	webApp.controller('proObjElePcdCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//根据构件编号元件列表
		$scope.eleTable = {
				checkType : 'radio',
//				autoQuery : false,
				params :{
					elementNo:$scope.itemBalObj.elementNo,
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
