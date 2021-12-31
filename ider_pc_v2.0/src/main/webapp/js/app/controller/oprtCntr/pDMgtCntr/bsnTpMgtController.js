'use strict';
define(function(require) {
	var webApp = require('app');
	//业务类型管理
	webApp.controller('bsnTpMgtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.bsnTpMgtInfo = {
		};
		$scope.pcdtypeArray = [{name : '数值' ,id : 'D'},{name : '百分比' ,id : 'P'}] ;
		$scope.transTypeArray = [{name : '消费类' ,id : 'R001'},{name : '取现类' ,id : 'C001'},
		                       {name : '还款类' ,id : 'P001'},{name : '分期类' ,id : 'L001'},
		                       {name : '消费管理类' ,id : 'D001'},{name : '取现管理类' ,id : 'D002'}] ;
		$scope.avyListTable = {
//			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize :10,
					indexNo :0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'bsnTpMgt.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//详情
		$scope.changeAvyInfo = function(event){
			$scope.item = $.parseJSON(JSON.stringify(event));
			//页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/pDMgtCntr/checkBsnTpMgt.html',$scope.item,{title :'详情',buttons : ['保存','关闭'],size : ['1050px','600px'],callbacks : [$scope.selectCorporat]});
		};
		//回调函数/确认按钮事件
		$scope.selectCorporat =function (result)  {
			//保存业务类型
			jfRest.request('bsnTpMgt', 'update', $scope.item)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
						$scope.listProArt = [];
						$scope.objAriTemp ={};
						$scope.objAri = result.scope.elmListTable.checkedList();
						console.log($scope.objAri);
						if($scope.objAri!=null || $scope.objAri!=undefined){
							//因此处单条修改不做循环
							$scope.proArt ={};
							$scope.proArt.elementNo =$scope.objAri.elementNo;
							$scope.proArt.artifactNo =$scope.objAri.artifactNo;
							$scope.objAriTemp.id =$scope.objAri.id;
							$scope.listProArt.push($scope.proArt);
							$scope.objAriTemp.list = $scope.listProArt;
							$scope.objAriTemp.operationMode =$scope.item.operationMode;
							$scope.objAriTemp.objectType ="A";
							$scope.objAriTemp.objectCode =$scope.item.businessTypeCode;
							console.log($scope.objAriTemp);
							$scope.balObjListInfo = result.scope.balObjListInfo;
							//对象构件实例修改
							jfRest.request('bsnTpMgt', 'updateObjAri', $scope.objAriTemp)
							.then(function(data) {
								if (data.returnCode == '000000') {
									if($scope.objAri.pcdNo!=null && $scope.objAri.pcdNo!=""){
										jfRest.request('balObjList', 'updatePcd', $scope.balObjListInfo)//Tansun.param($scope.pDCfgInfo)
										.then(function(data) {
											if (data.returnCode == '000000') {
												console.log(data.returnData);
												 jfLayer.success("修改成功");
												 $scope.avyListTable.search();
											}
										});
									}else{
										jfLayer.success("修改成功");
										$scope.avyListTable.search();
									}
								}
							});
						}else{
							jfLayer.success("修改成功");
							$scope.avyListTable.search();
						}
				}
			});
	    	$scope.safeApply();
	    	result.cancel();
	    };
	});
	webApp.controller('checkBsnTpMgtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'},{name : '人民币' ,id : '156'},{name : '人民币' ,id : '840'}];//币种
		$scope.showtablelist = false;
		$scope.showBalObjInfo = false;
		$scope.txnCgyAvyLogEnqrInfo =$scope.avyInfo;
		$scope.balObjListInfo = {
		};
		//对象构件实例
		$scope.elmListTable = {
				 checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					objectCode : $scope.item.businessTypeCode,
					objectType : "A",// 余额对象构件实例
					pageSize : 10,
					indexNo : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'balObjList.queryelmAllInfoList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//修改
		$scope.updateBalObjInfo = function(item){
			$scope.itemBalObj = $.parseJSON(JSON.stringify(item));
			$scope.elementNoUp = $scope.itemBalObj.elementNo;
			  $scope.modal('/oprtCntr/pDMgtCntr/pDMgtElePcd.html',$scope.itemBalObj,
					  {title :'构件可选元件列表及PCD',
				  buttons : ['保存','关闭'],
				  size : ['1050px','400px'],
				  callbacks : [$scope.updateAriEle]});
		};
		$scope.updateAriEle = function(result){
			$scope.BusTypeArtInfo = result.scope.eleTable.checkedList();
			if($scope.BusTypeArtInfo!=null){
				$scope.elementNosure = $scope.BusTypeArtInfo.elementNo;
				$scope.elementDescsure = $scope.BusTypeArtInfo.elementDesc;
				for(var i=0;i<$scope.elmListTable.data.length;i++){
					if($scope.elmListTable.data[i].elementNo == $scope.elementNoUp){
						$scope.elmListTable.data[i].elementNo = 	 $scope.elementNosure;
						$scope.elmListTable.data[i].elementDesc = 	$scope.elementDescsure;
						$scope.elementNoUp = $scope.elementNosure;
					}
				}
			}
			if(result.scope.showBalObjInfo){
				$scope.balObjListInfo = result.scope.balObjListInfo;
			}
			$scope.safeApply();
	    	result.cancel();
		}
//		//保存
//		$scope.saveBalObjInfo = function(){
//			$scope.saveParam = {
//					operationMode : $scope.balObjListInfo.operationMode,
//					objectType : $scope.balObjListInfo.objectType,
//					objectCode : $scope.balObjListInfo.objectCode,
//					objectCode2 : $scope.balObjListInfo.objectCode2,
//					pcdNo : $scope.balObjListInfo.pcdNo,
//					currencyCode : $scope.balObjListInfo.currencyCode,
//					pcdType : $scope.balObjListInfo.pcdType,
//					pcdValue : $scope.balObjListInfo.pcdValue,
//					pcdPoint : $scope.balObjListInfo.pcdPoint
//				};
//			jfRest.request('balObjList', 'updatePcd', $scope.saveParam)//Tansun.param($scope.pDCfgInfo)
//			.then(function(data) {
//				if (data.returnCode == '000000') {
//					console.log(data.returnData);
//					 jfLayer.success("修改成功");
//				}else {
//					 jfLayer.fail(data.returnMsg);
//				}
//			});
//			$scope.elmListTable.search();
//		}
	});
	webApp.controller('pDMgtElePcdCtrl', function($scope, $stateParams, jfRest,
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
