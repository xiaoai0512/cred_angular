'use strict';
define(function(require) {
	var webApp = require('app');
	//业务形态管理
	webApp.controller('busPatManCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.busPatManInfo = {
		};
		$scope.busPatManTable = {
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'busPatMan.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//详情
		$scope.changeAvyInfo = function(event){
			$scope.avyInfo = $.parseJSON(JSON.stringify(event));
			//翻译
			if($scope.avyInfo.accountOrganizeTyp == "R"){
				$scope.avyInfo.accountOrganizeTypTrans = "循环";
			}else if($scope.avyInfo.accountOrganizeTyp == "T"){
				$scope.avyInfo.accountOrganizeTypTrans = "交易";
            }
            if($scope.avyInfo.accountBookKeepingDirec == "C"){
				$scope.avyInfo.accountBookKeepingDirecTrans = "贷记";
			}else if($scope.avyInfo.accountBookKeepingDirec == "D"){
				$scope.avyInfo.accountBookKeepingDirecTrans = "借记";
            }
            //页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/busPatMan/checkBusPatMan.html',$scope.avyInfo,{title :'业务形态构件详情',buttons : ['保存','关闭'],size : ['1050px','500px'],callbacks : [$scope.selectCorporat]});
		};
		//回调函数/确认按钮事件
		$scope.selectCorporat =function (result)  {
			var treeSelect = [];
			$scope.busPatArtSave = {};
			treeSelect = $rootScope.treeSelect;
			$scope.busPatArtSave.operationMode = document.getElementById('operationMode').value;
			$scope.busPatArtSave.businessPattern = document.getElementById('businessPatternId').value;
			$scope.busPatArtSave.accountOrganizeTyp = document.getElementById('accountOrganizeTyp').value;
			$scope.busPatArtSave.accountBookKeepingDirec = document.getElementById('accountBookKeepingDirec').value;
			$scope.busPatArtSave.description = document.getElementById('description').value;
			jfRest.request('busPatMan', 'update', $scope.busPatArtSave)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.paramssRel = {
							operationMode : $scope.avyInfo.operationMode,
							list : $rootScope.treeSelect,
							businessPattern:$scope.avyInfo.businessPattern
						};
						jfRest.request('busPatMan', 'updateBusinessTypeRel', $scope.paramssRel)
						.then(function(data) {
								if (data.returnCode == '000000') {
									jfLayer.success("保存成功");
									$scope.safeApply();
								}
						});
				}
			});
	    	$scope.safeApply();
	    	result.cancel();
	    };
	});
	/*webApp.controller('checkbusPatManCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
	});*/
	webApp.controller('checkbusPatManCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.operationMode1 = [ {name : 'A01', id : 'A01'}, {name : 'A02', id : 'A02'} ];//账户组织形式
		$scope.businessNatureArr = [ {name : '贷记', id : 'C'}, {name : '借记',id : 'D'} ];//账户组织形式
		$scope.accountOrgArr = [ {name : '循环', id : 'R'}, {name : '交易',id : 'T'} ];//账户组织形式
		$scope.busPatArt = $scope.avyInfo;
		//*****************元件列表基础元件   可选元件*****************
		$scope.checkElmInfo = function(event){
	    	$scope.avyInfo = event;
		//页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/busPatMan/checkArtifactEleInf.html',$scope.avyInfo,
				  {title :'构件关联元件列表',
			  buttons : ['关闭'],
			  size : ['1050px','500px'],
			  callbacks : [$scope.selectCorporat2]});
		};
		//回调函数/确认按钮事件
		$scope.selectCorporat2 =function (result)  {
			$scope.safeApply();
	    	result.cancel();
	    };
	    //*****************弹框构件列表*****************
	    $scope.newArtWay = function(){
			//页面弹出框事件(弹出页面)
		  $scope.modal('/oprtCntr/busPatMan/checkBusPatArt.html',"",
				  {title :'构件列表',
			  buttons : ['保存','关闭'],
			  size : ['1050px','500px'],
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
			//选中的行对象数组
			var items  = result.scope.elmListTable.checkedList();
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
				}
			$scope.safeApply();
	    	result.cancel();
	    };
		/*$scope.artifactTypeArry = [
		 {name : '账户类构件' ,id : 'A'},{name : '余额类构件' ,id : 'B'}
		,{name : '技术类构件' ,id : 'T'},{name : '产品类构件' ,id : 'P'}
		,{name : '非对象类构件' ,id : 'X'},{name : '媒介类构件' ,id : 'M'}
		] ;*/
	    //*****************已关联构件列表*****************
	    console.log($scope.avyInfo);
//	    $scope.alreadyelmListTable = {
//				checkType : 'checkbox', // 当为checkbox时为多选
//				params : $scope.queryParam = {
//						"pageSize":10,
//						"indexNo":0,
//						"businessPattern" :$scope.avyInfo.businessPattern,
//						"operationMode":$scope.avyInfo.operationMode
//						
//				}, // 表格查询时的参数信息
//				paging : true,// 默认true,是否分页
//				resource : 'busPatMan.queryManageList',// 列表的资源
//				callback : function(data) { // 表格查询后的回调函数
//				}
//		};
	    $scope.queryParam = {
				operationMode:$scope.avyInfo.operationMode,
				businessPattern:$scope.avyInfo.businessPattern,
				"pageSize" : 10,
				"indexNo" : 0	
		};
		jfRest.request('busPatMan', 'queryManageList', $scope.queryParam)
		.then(function(data) {
			if (data.returnCode == '000000') {
				$rootScope.treeSelect = data.returnData.rows;
				if (data.returnData.rows == null) {
					$rootScope.treeSelect = [];
				}
			}
		});
	    // 删除关联构件
		$scope.removeSelect = function(data,$index) {
			var checkId = data;
			console.log($index);
			$rootScope.treeSelect.splice($index, 1);
			/*
			 * var arrId=treeSelect.indexOf(data); treeSelect.splice(arrId,1);
			 * $scope.checkedList=treeSelect;
			 */
		}
	});
	webApp.controller('checkArtifactEleInfCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.itemList = {
//				checkType : 'radio',
				params : $scope.queryParam = {
						"artifactNo" : $scope.avyInfo.artifactNo,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'busPatMan.queryArtEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.itemChoiceList = {
//				checkType : 'radio',
				params : $scope.queryParam = {
						"artifactNo" : $scope.avyInfo.artifactNo,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'busPatMan.queryEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	webApp.controller('checkbusPatArtCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//构建列表
		$scope.elmListTable = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0,
						artifactType : "A"
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'elmList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
	});
});
