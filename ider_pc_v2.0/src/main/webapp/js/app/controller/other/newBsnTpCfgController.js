'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户产品列表查询
	webApp.controller('newBsnTpCfgCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.transIdentifiNoArray = [{name : '消费类' ,id : 'R001'},{name : '取现类' ,id : 'C001'},
				                       {name : '还款类' ,id : 'P001'},{name : '分期类' ,id : 'L001'},
				                       {name : '消费管理类' ,id : 'D001'},{name : '取现管理类' ,id : 'D002'}];
		var pcdlistBool = false;
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			autoquery : false,
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newBsnTpCfg.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.relElmAndYPtsList = {
		    checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
//					artifactType :'', //构件类型
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newBsnTpCfg.queryRelElmAndYPts',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.showNewBsn = false;// 隐藏
		// 查询
		$scope.pDCfgInfo ={
				operationMode :'',
				businessTypeCode :'',
				businessDesc :'',
		};
		$scope.show = function() {
			if (!$scope.itemList.validCheck()) {
				return;
			}
			$scope.pDCfgInfotemp = $scope.itemList.checkedList();
			$scope.pDCfgInfo.businessPattern = $scope.pDCfgInfotemp.businessPattern;
			$scope.pDCfgInfo.description = $scope.pDCfgInfotemp.description;
			$scope.pDCfgInfo.accountOrganizeTyp = $scope.pDCfgInfotemp.accountOrganizeTyp;
			$scope.showNewBsn = true;// 显示
		};
		//***********************构件可选元件（弹出页面）***********************
		$scope.checklCOvewInfo = function(item,$index){
			$scope.indexNo = $index;
			$scope.viewEle ={
					elementNo : item.elementNo
			};
			$scope.modal('/other/newPDCfg/viewEle.html', $scope.viewEle, {
				title : ' 可选元件',
				buttons : ['确认','关闭' ],
				size : [ '900px', '480px' ],
				callbacks : [$scope.sureEle]
			});
		};
		//确认元件// 回调函数/确认按钮事件
		$scope.sureEle = function(result){
			 $scope.items=result.scope.eleTable.checkedList();//选中列值
			 $scope.relElmAndYPtsList.data[$scope.indexNo].elementNo = 	 $scope.items.elementNo;
			 $scope.relElmAndYPtsList.data[$scope.indexNo].elementDesc = 	 $scope.items.elementDesc;
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
				title : ' 业务类型pcd信息',
				buttons : ['保存','关闭' ],
				size : [ '850px', '320px' ],
				callbacks : [$scope.sureDif]
			});
		};
		//***********************确认修改差异化*********************** 
		$scope.sureDif = function(result){
			 $scope.relElmAndYPtsList.data[$scope.indexNo1].currencyCode = 	 $scope.updatePcd.currencyCode;
			 $scope.relElmAndYPtsList.data[$scope.indexNo1].pcdType = 	 $scope.updatePcd.pcdType;
			 $scope.relElmAndYPtsList.data[$scope.indexNo1].pcdValue = 	 $scope.updatePcd.pcdValue;
			 $scope.relElmAndYPtsList.data[$scope.indexNo1].pcdPoint = 	 $scope.updatePcd.pcdPoint;
			 pcdlistBool = true;
			 $scope.safeApply();
			 result.cancel();
			 jfLayer.success("修改成功");
		};
		// 查看
		$scope.checkBsnTpTpl = function(event) {
			$scope.item = event;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/other/newBsnTpCfg/bsnTpTpl.html', $scope.item, {
				title : '业务类型模板',
				buttons : [ '确定', '关闭' ],
				size : [ '1050px', '520px' ],
				callbacks : [ $scope.selectCorporat ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.selectCorporat = function(result) {
			var items = result.scope.bsnTpList.checkedList();
			if (!items) {
				jfLayer.fail("该操作必须选择一条记录！");
				return;
			}
			$scope.pDCfgInfo.transIdentifiNo=items.transIdentifiNo;//交易识别代码
			$scope.pDCfgInfo.repaymentPriority=items.duePriority;//
			$scope.pDCfgInfo.businessTypeCode=items.businessTypeCode;//业务类型代码
			$scope.pDCfgInfo.businessDesc=items.businessDesc;//业务类型描述
			$scope.safeApply();
			result.cancel();	
		};
		/*
		 * !$scope.bsnTpList. $scope.safeApply(); result.cancel(); };
		 */
		$scope.objTag ={
				operationMode : "",
				objectType:"A",//业务类型
				objectCode: "",
				artifactNo :"",
				elementNo : "",
		};
		$scope.objPCD ={
				operationMode : "",
				objectType : "A",//业务类型
				objectCode:"",
				objectCode2:"",//只有在对象类型为B的时候才会有值，其他情况为空
				pcdNo :"",
				currencyCode : "",
				pcdType :"",
				pcdValue : "",
				pcdPoint :"",
		};
		//关联关联构件及元件
		$scope.treeSelect11 =[];
		// 关联活动
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.relElmAndYPtsList.validCheck()) {
				return;
			}
			var items = $scope.relElmAndYPtsList.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect11.length; k++) {
					if (items[i].elementNo == $scope.treeSelect11[k].elementNo) {    //判断是否存在
							tipStr = tipStr + items[i].elementNo + ",";
							isTip = true;
							isExist = true;
							break;
					}
				}
				if(!isExist){
					$scope.treeSelect11.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert("构件元件【" + tipStr.substring(0,tipStr.length-1) + "】已存在，不在添加！");
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.treeSelect11.splice(checkId, 1);
		};
		// 保存业务类型，关联构件对象构建实例
		$scope.saveBusinessType = function() {
			if(!$scope.relElmAndYPtsList.validCheck()){
				return;
			}
			//对象构件实例request参数
			var listAri = [];
			$scope.objTagList = [];
			listAri = $scope.relElmAndYPtsList.checkedList();
			for(var i=0 ;i < listAri.length;i++){
				$scope.productObjTemp = {};
				$scope.productObjTemp.artifactNo = listAri[i].artifactNo;
				$scope.productObjTemp.elementNo = listAri[i].elementNo;
				$scope.objTagList.push($scope.productObjTemp);
			}
			//$scope.objTag.elList = $scope.objTagList;
			$scope.objTag.elList = $scope.treeSelect11;
			$scope.objTag.objectCode = $scope.pDCfgInfo.businessTypeCode;
			$scope.objTag.operationMode = $scope.pDCfgInfo.operationMode;
			//对象pcd实例
			var listPcd = [];
			$scope.objPcdList = [];
			listPcd = $scope.relElmAndYPtsList.checkedList();
			for(var i=0 ;i < listPcd.length;i++){
				$scope.objPcdEle = {};
				if(listPcd[i].pcdNo!="" && listPcd[i].pcdNo!=null){
					$scope.objPcdEle.pcdNo = listPcd[i].pcdNo;
					$scope.objPcdEle.currencyCode = listPcd[i].currencyCode;
					$scope.objPcdEle.pcdType = listPcd[i].pcdType;
					$scope.objPcdEle.pcdValue = listPcd[i].pcdValue;
					$scope.objPcdEle.pcdPoint = listPcd[i].pcdPoint;
					$scope.objPcdList.push($scope.objPcdEle);
				}
			}
			$scope.objPCD.pcdList = $scope.objPcdList;
			$scope.objPCD.operationMode = $scope.pDCfgInfo.operationMode;
			$scope.objPCD.objectCode = $scope.pDCfgInfo.businessTypeCode;
				$scope.safeApply();
				jfRest.request('newBsnTpCfg', 'saveBusinessType', $scope.pDCfgInfo).then(function(data) {
					if (data.returnCode == '000000') {
						//对象构建实例
						jfRest.request('newBsnTpCfg', 'saveObjTag', $scope.objTag).then(function(data) {
							if (data.returnCode == '000000') {
								if(pcdlistBool){
									//对象pcd实例
									jfRest.request('newBsnTpCfg', 'saveObjPCD', $scope.objPCD).then(function(data) {
										if (data.returnCode == '000000') {
											jfLayer.success("保存成功");
											$scope.turn("/oprtCntr/bsnTpMgt");
										}
									});
								}else{
									jfLayer.success("保存成功");
									$scope.turn("/oprtCntr/bsnTpMgt");
								}
							}
						});
					}
				});
		}
	});
	webApp.controller('balObjPcdCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'}];//币种
		$scope.valTypArray = [{name : 'D-数值' ,id : 'D'},{name : 'P-百分比' ,id : 'P'}] ;
	});
	webApp.controller('bsnTpTplCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.bsnTpList = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'newBsnTpCfg.queryBsnTpTpl',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	webApp.controller('viewEleCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.eleTable = {
				checkType : 'radio',
				params : $scope.queryParam = {
						elementNo : $scope.viewEle.elementNo,
						isSelectFlag : true
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'newPDCfg.queryEle',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
});
