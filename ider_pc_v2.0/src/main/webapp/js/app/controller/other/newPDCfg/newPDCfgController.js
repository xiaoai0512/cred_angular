'use strict';
define(function(require) {
	var webApp = require('app');
	// 新产品配置
	webApp.controller('newPDCfgCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.pDCfgInfo = {
		};
		$scope.showInfo = false;
		$scope.demoArray = [{name : 'MODX00001' ,bsnMdltyCd : '1'},{name : 'MODX00002' ,bsnMdltyCd : '2'},{name : 'MODX00003' ,bsnMdltyCd : '3'}];
		//*******************发卡行列表***********************
		$scope.itemListTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newPDCfg.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//***********************运营列表***********************
		$scope.oprtListTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newPDCfg.queryOprtList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//***********************显示按钮***********************
		$scope.showInfoBtn = function(){
			if($scope.pDCfgInfo.operationMode == null){
				jfLayer.fail("请填入运营模式") ;
				return;
			}
			$scope.oprtListTable.params.operationMode = $scope.pDCfgInfo.operationMode;
			if(!$scope.itemListTable.validCheck()){
				return;
			}
			$scope.temp = $scope.itemListTable.checkedList();
			$scope.pDCfgInfo.cardBin = $scope.temp.bin;
			$scope.pDCfgInfo.issueCardOrgan = $scope.temp.organizeTyp;
//			$scope.temp2 = $scope.oprtListTable.checkedList();
//			$scope.pDCfgInfo.repaymentPriority = $scope.temp2.duePriority;
			$scope.showInfo = true;
		};
		//***********************差异化表***********************
		$scope.differentDiv = false;
		$scope.differentTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			autoQuery:false,//不自动查询，
			params : $scope.queryParam = {
					operationMode : $scope.pDCfgInfo.operationMode,
					objectType :"B",
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newPDCfg.queryDif',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//***********************显示并查询差异化表***********************
		$scope.different = function(){
			$scope.differentTable.autoQuery = true;
			$scope.differentTable.search();
			$scope.differentDiv = true;
		};
		//***********************查看差异化信息***********************
		$scope.viewDifferent = function(item){
			if(item != null && item != undefined){
				//复制对象(item和$scope.actiBalaPositionModify)互不影响
				var itemStr = JSON.stringify(item);
				$scope.viewDif= $.parseJSON(itemStr);
			}else{
				$scope.viewDif= {};
			}
			$scope.modal('/other/newPDCfg/viewDif.html', $scope.viewDif, {
				title : ' 产品差异化查看',
				buttons : ['关闭' ],
				size : [ '800px', '300px' ],
				callbacks : []
			});
		};
		//***********************构件可选元件（弹出页面）***********************
		$scope.checklCOvewInfo = function(item,$index){
			$scope.indexNo = $index;
			$scope.objTag.artifactNo  = item.artifactNo;
			$scope.viewEle ={
					elementNo : item.elementNo,
			};
			$scope.modal('/other/newPDCfg/viewEle.html', $scope.viewEle, {
				title : ' 可选元件',
				buttons : ['确认','关闭' ],
				size : [ '800px', '300px' ],
				callbacks : [$scope.sureEle]
			});
		};
		//确认元件// 回调函数/确认按钮事件
		$scope.sureEle = function(result){
			 $scope.items=result.scope.eleTable.checkedList();//选中列值
			 $scope.pDOptElmTable.data[$scope.indexNo].elementNo = 	 $scope.items.elementNo;
			 $scope.pDOptElmTable.data[$scope.indexNo].elementDesc = 	 $scope.items.elementDesc;
			 $scope.safeApply();
			 result.cancel();
		};
		//***********************修改差异化（弹出页面）***********************此处不调后台，修改缓存。
		$scope.updateDif = function(item,$index){
			$scope.indexNoDif = $index;
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
			 $scope.differentTable.data[$scope.indexNoDif].pcdType = 	 $scope.updateDiff.pcdType;
			 $scope.differentTable.data[$scope.indexNoDif].pcdValue = 	 $scope.updateDiff.pcdValue;
			 $scope.differentTable.data[$scope.indexNoDif].pcdPoint = 	 $scope.updateDiff.pcdPoint;
			 result.cancel();
			 jfLayer.success("修改成功");
//			jfRest.request('newPDCfg','updateDif', $scope.sureDifParams).then(function(data) {
//				if (data.returnCode == '000000') {
//					jfLayer.success("修改成功",function(){
//						result.cancel();
//						//刷新列表数据
//						$scope.differentTable.search();
//					});
//				}else{
//					var returnMsg = data.returnMsg ? data.returnMsg : '修改失败' ;
//					jfLayer.fail(returnMsg) ;
//				}
//			});
		};
		//**********************保存产品对象，业务范围，对象实例，pcd实例************************
		$scope.ProBusScp = {
				operationMode : "",
				productObjectCode : "",
		};
		$scope.objTag ={
				operationMode : "",
				objectType:"P",//产品对象
				objectCode: "",
				artifactNo :"",
				elementNo : "",
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
		$scope.saveDif = function(){
			//产品业务范围request参数
			if(!$scope.oprtListTable.validCheck()){
				return;
			}
			if(!$scope.pDOptElmTable.validCheck()){
				return;
			}
			var list = [];
			var listobjPcd =[];
			$scope.ProBusScpList = [];
			list = $scope.oprtListTable.checkedList();
			for(var i=0 ;i < list.length;i++){
				$scope.businessTypeL = {};
				$scope.businessTypeL.businessTypeCode = list[i].businessTypeCode;
				$scope.ProBusScpList.push($scope.businessTypeL);
			}
			$scope.ProBusScp.list = $scope.ProBusScpList;
			$scope.ProBusScp.operationMode = $scope.pDCfgInfo.operationMode;
			$scope.ProBusScp.productObjectCode = $scope.pDCfgInfo.productObjectCode;
			//对象构件实例request参数
			var listAri = [];
			$scope.objTagList = [];
			listAri = $scope.pDOptElmTable.checkedList();
			for(var i=0 ;i < listAri.length;i++){
				$scope.productObjTemp = {};
				$scope.productObjTemp.artifactNo = listAri[i].artifactNo;
				$scope.productObjTemp.elementNo = listAri[i].elementNo;
				$scope.objTagList.push($scope.productObjTemp);
			}
			$scope.objTag.elList = $scope.objTagList;
			$scope.objTag.objectCode = $scope.pDCfgInfo.productObjectCode;
			$scope.objTag.operationMode = $scope.pDCfgInfo.operationMode;
			//对象pcd实例
			var listPcd = [];
			$scope.objPcdList = [];
			listPcd = $scope.differentTable.checkedList();
			for(var i=0 ;i < listPcd.length;i++){
				$scope.objPcdEle = {};
				$scope.objPcdEle.objectCode = listPcd[i].objectCode;
				$scope.objPcdEle.pcdNo = listPcd[i].pcdNo;
				$scope.objPcdEle.currencyCode = listPcd[i].currencyCode;
				$scope.objPcdEle.pcdType = listPcd[i].pcdType;
				$scope.objPcdEle.pcdValue = listPcd[i].pcdValue;
				$scope.objPcdEle.pcdPoint = listPcd[i].pcdPoint;
				$scope.objPcdList.push($scope.objPcdEle);
			}
			$scope.objPCD.pcdList = $scope.objPcdList;
			$scope.objPCD.operationMode = $scope.pDCfgInfo.operationMode;
			$scope.objPCD.objectCode2 = $scope.pDCfgInfo.productObjectCode;
			//产品对象
				$scope.safeApply();
				jfRest.request('newPDCfg', 'saveNewPDCfg', $scope.pDCfgInfo).then(function(data) {
					if (data.returnCode == '000000') {
						//产品业务范围
						jfRest.request('newPDCfg', 'saveProBusScp', $scope.ProBusScp).then(function(data) {
							if (data.returnCode == '000000') {
								//对象构建实例
								jfRest.request('newPDCfg', 'saveObjTag', $scope.objTag).then(function(data) {
									if (data.returnCode == '000000') {
										//对象pcd实例
										jfRest.request('newPDCfg', 'saveObjPCD', $scope.objPCD).then(function(data) {
											if (data.returnCode == '000000') {
												jfLayer.success("保存成功");
												$scope.turn("/oprtCntr/productObject");
											}
										});
									}
								});
							}
					});
				}
			});
		};
		//***********************业务范围信息***********************
		$scope.bsnScopInfoTable = {
//			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newPDCfg.queryBsnScopInfo',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//***********************产品可选构件***********************
		$scope.pDOptElmTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
//					A：账户类构件B：余额类构件T：技术类构件P：产品类构件X：非对象类构件M：媒介类构件
					artifactNo : "5%",
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'newPDCfg.queryPDOptElm',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
//				for(var i=0;i< data.returnData.rows.length; i++){
//					$scope.data.returnData.rows[i].indexNo =data.returnData.indexNo;
//				}
			}
		};
	});
	webApp.controller('viewDifCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'}];//币种
		$scope.valTypArray = [{name : 'D-数值' ,id : 'D'},{name : 'P-百分比' ,id : 'P'}] ;
	});
	webApp.controller('updateDiffCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.currencyTypeArray = [{name : '人民币' ,id : 'CNY'},{name : '美元' ,id : 'USD'}];//币种
		$scope.valTypArray = [{name : 'D-数值' ,id : 'D'},{name : 'P-百分比' ,id : 'P'}] ;
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
