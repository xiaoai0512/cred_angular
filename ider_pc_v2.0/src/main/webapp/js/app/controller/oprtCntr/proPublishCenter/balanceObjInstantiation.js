'use strict';
define(function(require) {
	var webApp = require('app');
	// 余额对象实例化
	webApp.controller('balanceObjInstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.balanceTypeArr = [ {name : '本金', id : 'P'}, {name : '利息',id : 'I'}, {name : '费用',id : 'F'}  ];//余额类型
		//余额对象可选构件
		$scope.selArtifact = "8%";
		$scope.balanceObjAri = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params :{
				    artifactNo :$scope.selArtifact,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'balanceObjInst.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.balanceObjAri.params={};
			}
		};
		$scope.treeSelect1 =[];
		// 关联活动
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.balanceObjAri.validCheck()) {
				return;
			}
			var items = $scope.balanceObjAri.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect1.length; k++) {
					console.log(items[i].elementNo.substring(0,8));
					console.log($scope.treeSelect1[k].elementNo.substring(0,8));
					if (items[i].elementNo.substring(0,8)  == $scope.treeSelect1[k].elementNo.substring(0,8) ) {    //判断是否存在
						tipStr = tipStr + items[i].elementNo.substring(0,8) + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.treeSelect1.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert("元件【" + tipStr.substring(0,tipStr.length-1) + "】已存在，不在添加！");
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.treeSelect1.splice(checkId, 1);
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
			 $scope.balanceObjAri.data[$scope.indexNo].elementNo = 	 $scope.items.elementNo;
			 $scope.balanceObjAri.data[$scope.indexNo].elementDesc = 	 $scope.items.elementDesc;
			 $scope.safeApply();
			 result.cancel();
		};
		//***********************修改pcd取值（弹出页面）***********************此处不调后台，修改缓存。
		$scope.updatePcdValue = function(item,$index){
			$scope.indexNo1 = $index;
			if(item != null && item != undefined){
				//复制对象(item和$scope.actiBalaPositionModify)互不影响
				var itemStr = JSON.stringify(item);
				$scope.updatePcd= $.parseJSON(itemStr);
			}else{
				$scope.updatePcd= {};
			}
			$scope.modal('/oprtCntr/proPublishCenter/balObjPcd.html', $scope.updatePcd, {
				title : ' 余额对象pcd值添加',
				buttons : ['保存','关闭' ],
				size : [ '800px', '300px' ],
				callbacks : [$scope.sureDif]
			});
		};
		//***********************确认修改差异化*********************** 
		$scope.sureDif = function(result){
			 $scope.balanceObjAri.data[$scope.indexNo1].currencyCode = 	 $scope.updatePcd.currencyCode;
			 $scope.balanceObjAri.data[$scope.indexNo1].pcdType = 	 $scope.updatePcd.pcdType;
			 $scope.balanceObjAri.data[$scope.indexNo1].pcdValue = 	 $scope.updatePcd.pcdValue;
			 $scope.balanceObjAri.data[$scope.indexNo1].pcdPoint = 	 $scope.updatePcd.pcdPoint;
			 $scope.safeApply();
			 result.cancel();
			 jfLayer.success("保存成功");
		};
		//************************保存余额对象***********************对象 构建实例  对象pcd实例
		$scope.objTag ={
				operationMode : "",
				objectType:"B",//余额对象
				objectCode: "",
		};
		$scope.objPCD ={
				operationMode : "",
				objectType : "B",
				objectCode:"",//余额对象
				objectCode2:"",//只有在对象类型为B的时候才会有值，其他情况为空
				pcdNo :"",
				currencyCode : "",
				pcdType :"",
				pcdValue : "",
				pcdPoint :"",
		};
		$scope.saveBalanceObj = function(){
			var list = [];
			$scope.objTagList = [];
			$scope.objPcdList = [];
			list = $scope.treeSelect1;
			for(var i=0 ;i < list.length;i++){
				$scope.balanceObjTemp = {};
				$scope.balanceObjTemp.artifactNo = list[i].artifactNo;
				$scope.balanceObjTemp.elementNo = list[i].elementNo;
				$scope.objTagList.push($scope.balanceObjTemp);
				if(list[i].pcdNo!=null && list[i].pcdNo!=""){
					$scope.objPcdEle = {};
					$scope.objPcdEle.pcdNo = list[i].pcdNo;
					if(list[i].currencyCode!=null){
						$scope.objPcdEle.currencyCode = list[i].currencyCode;
					}else{
						$scope.objPcdEle.currencyCode = "";
					}
					if(list[i].pcdType!=null){
						$scope.objPcdEle.pcdType = list[i].pcdType;
					}else{
						$scope.objPcdEle.pcdType = "0";//因数据库设置pcdtype必填，默认给值0，下拉框反显不会显示
					}
					$scope.objPcdEle.pcdValue = list[i].pcdValue;
					$scope.objPcdEle.pcdPoint = list[i].pcdPoint;
					$scope.objPcdList.push($scope.objPcdEle);
				}
			}
			$scope.objTag.elList = $scope.objTagList;
			$scope.objTag.operationMode = $scope.balanceObj.operationMode;
			$scope.objTag.objectCode = $scope.balanceObj.balanceObjectCode;
			$scope.objPCD.pcdList = $scope.objPcdList;
			$scope.objPCD.operationMode = $scope.balanceObj.operationMode;
			$scope.objPCD.objectCode = $scope.balanceObj.balanceObjectCode;
			//余额对象
			$scope.balanceObj;
			jfRest.request('balanceObjInst', 'saveBalObj', $scope.balanceObj)
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
									$scope.turn("/oprtCntr/balObjList");
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
