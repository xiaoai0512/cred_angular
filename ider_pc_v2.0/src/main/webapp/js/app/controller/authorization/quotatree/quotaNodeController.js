'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('quotaNodeCtrl', function($scope, $stateParams,  jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotaNode');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		 //运营模式
		 $scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        }
	    };
		$scope.isShow = false;
		$scope.isprompt = true;
		 $scope.eventList = "";
		 $scope.addBtnFlag01 = false;
		 $scope.selBtnFlag01 = false;
		 $scope.updBtnFlag01 = false;
		 $scope.delBtnFlag01 = false;
		 $scope.addBtnFlag02 = false;
		 $scope.selBtnFlag02 = false;
		 $scope.updBtnFlag02 = false;
		 $scope.delBtnFlag02 = false;
		 $scope.selBtnFlag03 = false;
		 $scope.updBtnFlag03 = false;
		 $scope.addBtnNodeFlag = false;
		 $scope.delBtnFlag02 = false;
		 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
   			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
   				if(data.returnData != null || data.returnData != ""){
   					for(var i=0;i<data.returnData.length;i++){
   	   					$scope.eventList += data.returnData[i].eventNo + ",";
   	   				}
	   	   			if($scope.eventList.search('LMS.PM.01.0001') != -1){    //新增额度节点
	   					$scope.addBtnNodeFlag = true;
	   				}
	   				else{
	   					$scope.addBtnNodeFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.03.0002') != -1){    //查询
	   					$scope.selBtnFlag01 = true;
	   				}
	   				else{
	   					$scope.selBtnFlag01 = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.03.0003') != -1){    //修改
	   					$scope.updBtnFlag01 = true;
	   				}
	   				else{
	   					$scope.updBtnFlag01 = false;
	   				}
		   	   		if($scope.eventList.search('LMS.PM.01.0004') != -1){    //删除额度节点
	   					$scope.delBtnFlag02 = true;
	   				}
	   				else{
	   					$scope.delBtnFlag02 = false;
	   				}
			   	   	if($scope.eventList.search('LMS.PM.01.0007') != -1){    //额度关系查询
	   					$scope.selBtnFlag02 = true;
	   				}
	   				else{
	   					$scope.selBtnFlag02 = false;
	   				}
			   	   	if($scope.eventList.search('LMS.PM.01.0016') != -1){    //交易识别查询
	   					$scope.selBtnFlag03 = true;
	   				}
	   				else{
	   					$scope.selBtnFlag03 = false;
	   				}
			   	   	if($scope.eventList.search('LMS.PM.01.0017') != -1){    //交易识别维护
	   					$scope.updBtnFlag03 = true;
	   				}
	   				else{
	   					$scope.updBtnFlag03 = false;
	   				}
			   	   	if($scope.eventList.search('LMS.PM.01.0006') != -1){    //额度关系新增
	   					$scope.addBtnFlag02 = true;
	   				}
	   				else{
	   					$scope.addBtnFlag02 = false;
	   				}
				   	if($scope.eventList.search('LMS.PM.01.0008') != -1){    //额度关系维护
	   					$scope.updBtnFlag02 = true;
	   				}
	   				else{
	   					$scope.updBtnFlag02 = false;
	   				}
				   	if($scope.eventList.search('LMS.PM.01.0009') != -1){    //额度关系删除
	   					$scope.delBtnFlag02 = true;
	   				}
	   				else{
	   					$scope.delBtnFlag02 = false;
	   				}
   				}
   			});
		//额度节点查询
		$scope.itemList = {
				params : $scope.queryParam = {
						"authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'quotatree.queryList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.itemList.params.operationMode == "" || $scope.itemList.params.operationMode == undefined || $scope.itemList.params.operationMode == null){
				$scope.isShow = false;
				$scope.isprompt = true;
				jfLayer.alert(T.T('SQJ2000002'));
			}
			else{
				$scope.itemList.search();
				$scope.isShow = true;
				$scope.isprompt = false;
			}
		};
		//新增额度节点
		$scope.addControl = function() {
			//$scope.itemAdd
			if($scope.itemList.params.operationMode){
				$scope.itemAdd = {};
				$scope.itemAdd.operationMode = $scope.itemList.params.operationMode;
				$scope.modal('/authorization/quotatree/quotaTreeNodeAdd.html', "$scope.itemAdd", {
					title : T.T('SQJ2000017'),   //新增额度节点
					buttons : [ T.T('F00107'),T.T('F00012')],   //['确定','关闭'],
					size : [ '1000px', '530px'],
					callbacks : [$scope.addQuotaSure]
				});
			}else{
				jfLayer.fail('请选择运营模式！');
				return;
            }
        };
		//确定新增事件（整体的）
		$scope.quotaInfoAdd = {};
		$scope.quotaInfoAdd.message = [];
		$scope.instanQuotaShow == false;
		$scope.addQuotaSure = function(result){
			/*if( result.scope.quota.upperNodeNo == null || result.scope.quota.upperNodeNo == undefined ||result.scope.quota.upperNodeNo == ''){
                jfLayer.fail(T.T('SQJ2100011'));
                return;
            }*/
			if(result.scope.quota.creditNodeTyp != "B"){
				$scope.quotaInfoAdd = result.scope.quota;
				$scope.quotaInfoAdd.authDataSynFlag = "1";
				$scope.quotaInfoAdd.message = [];
				$scope.quotaInfo = $.parseJSON(JSON.stringify($scope.quotaInfoAdd));
				$scope.quotaInfoAdd.message.push($scope.quotaInfo);
				jfRest.request('quotatree', 'save', $scope.quotaInfoAdd).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00058'));
						$scope.quataInstanse = $scope.quotaInfoAdd;
						$scope.quotaInfoAdd = {};
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
					}
					else{
						$scope.quotaInfoAdd.message = [];
					}
				});
			}else{
				if(!result.scope.instanQuotaShow){
					jfLayer.fail(T.T('F00086'));
					return;
				}
				for (var i = 0; i < result.scope.queryMODP.data.length; i++) {
					if(result.scope.queryMODP.data[i].pcdList==null && result.scope.queryMODP.data[i].pcdInitList!=null){
						result.scope.queryMODP.data[i].addPcdFlag = 	"1";
						result.scope.queryMODP.data[i].pcdList = result.scope.queryMODP.data[i].pcdInitList;
					}
					result.scope.queryMODP.data[i].creditNodeNo = result.scope.quataInstanse.message[0].creditNodeNo;
					result.scope.queryMODP.data[i].operationMode = result.scope.quataInstanse.message[0].operationMode;
				}
				$scope.quataInstanse={};
				$scope.quataInstanse.message = result.scope.quataInstanse.message;
				$scope.quataInstanse.instanlist =result.scope.queryMODP.data;
				$scope.quataInstanse.operationMode = result.scope.queryMODP.operationMode;
				jfRest.request('quotatree', 'save', $scope.quataInstanse).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						$scope.proObjInstan = {};
						$scope.quataInstanse = [];
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
					}
				});
			}
		};


/*		//新增事件（整体的）
		$scope.addQuota = function() {
			$scope.modal('/authorization/quotatree/quotaNodeAdd.html', '', {
				title : T.T('SQJ2000017'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.addQuotaSure ]
			});
		};
		//确定新增事件（整体的）
		$scope.quotaInfoAdd = {};
		$scope.quotaInfoAdd.message = [];
		$scope.addQuotaSure = function(result){
			$scope.quotaInfo = $.parseJSON(JSON.stringify(result.scope.quota));
			$scope.quotaInfo.creditTreeId = result.scope.quotaTreeNoInfo;
			if($scope.quotaInfo.creditNodeTyp == "B"){
				if(($scope.quotaInfo.creditProperty == "" ||  $scope.quotaInfo.creditProperty == undefined) ||
						($scope.quotaInfo.creditCategory == "" ||  $scope.quotaInfo.creditCategory == undefined)){
					jfLayer.fail(T.T('SQJ2000018'));
				}
				else{
					$scope.quotaInfoAdd.authDataSynFlag = "1";
					delete $scope.quotaInfo['creditComputeMode'];
					$scope.quotaInfoAdd.message.push($scope.quotaInfo);
	            	  jfRest.request('quotatree', 'save', $scope.quotaInfoAdd).then(function(data) {
	      	                if (data.returnCode == '000000') {
	      	                	jfLayer.success(T.T('F00058'));
	      	                	$scope.quotaInfoAdd.message = [];
	      	                	$scope.safeApply();
								result.cancel();
	      	                	//$scope.mdmInfoForm.$setPristine();
	      	                }
	      	            });
				}
			}
			else{
				if($scope.quotaInfo.creditComputeMode == "" ||  $scope.quotaInfo.creditComputeMode == undefined){
					jfLayer.fail(T.T('SQJ2000019'));
				}else{
					$scope.quotaInfoAdd.authDataSynFlag = "1";
					$scope.quotaInfoAdd.message.push($scope.quotaInfo);
					jfRest.request('quotatree', 'save', $scope.quotaInfoAdd).then(function(data) {
	      	                if (data.returnCode == '000000') {
	      	                	jfLayer.alert(T.T('SQJ2000020'));
	      	                	$scope.quotaInfoAdd.message = [];
	      	                	$scope.safeApply();
								result.cancel();
	      	                }
	      	            });
				}
			}
		}
		//新增事件（单个的）
		$scope.addControl = function(event) {
			$scope.itemAdd = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/quotaNodeAddOne.html', $scope.itemAdd, {
				title : T.T('SQJ2000017'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.addQuotaOneSure ]
			});
		};
		//新增事件（单个的）
		$scope.quotaInfoAddOne = {};
		$scope.quotaInfoAddOne.message = [];
		$scope.addQuotaOneSure = function(result){
			$scope.quotaOne = {};
			$scope.quotaOne = $.parseJSON(JSON.stringify(result.scope.qAddOne));
			$scope.quotaOne.operationMode = $scope.itemAdd.operationMode;
			$scope.quotaOne.creditTreeId = $scope.itemAdd.creditTreeId;
			$scope.quotaOne.upperNodeNo = $scope.itemAdd.creditNodeNo;
			if($scope.quotaOne.creditNodeTyp == "B"){
				if(($scope.quotaOne.creditProperty == "" ||  $scope.quotaOne.creditProperty == undefined) ||
						($scope.quotaOne.creditCategory == "" ||  $scope.quotaOne.creditCategory == undefined)){
					jfLayer.fail(T.T('SQJ2000018'));
				}else{
					$scope.quotaInfoAddOne.authDataSynFlag = "1";
					delete $scope.quotaOne['creditComputeMode'];
					$scope.quotaInfoAddOne.message.push($scope.quotaOne);
					jfRest.request('quotatree', 'save', $scope.quotaInfoAddOne).then(function(data) {
      	                if (data.returnCode == '000000') {
      	                	jfLayer.success(T.T('F00058'));
      	                	$scope.quotaInfoAddOne.message = [];
      	                	$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
      	                	//$scope.mdmInfoForm.$setPristine();
      	                }
      	            });
				}
			}else{
				$scope.quotaInfoAddOne.authDataSynFlag = "1";
				if($scope.quotaOne.creditComputeMode == "" ||  $scope.quotaOne.creditComputeMode == undefined){
					jfLayer.fail(T.T('SQJ2000021'));
				}else{
					$scope.quotaInfoAddOne.message.push($scope.quotaOne);
					jfRest.request('quotatree', 'save', $scope.quotaInfoAddOne).then(function(data) {
      	                if (data.returnCode == '000000') {
      	                	jfLayer.success(T.T('SQJ2000020'));
      	                	$scope.quotaInfoAdd.message = [];
      	                	$scope.safeApply();
      	                	result.cancel();
      	                	$scope.itemList.search();
      	                }
      	            });
				}
			}
		}*/
		//查询详情事件
		$scope.authCreditNodeInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/quotaNodeInfo.html', $scope.item, {
				title : T.T('SQJ2000001'),
				buttons : [ T.T('F00012')],
				size : [ '1100px', '580px' ],
				callbacks : [ ]
			});
		};
		//额度网
		$scope.selectCreditMeshList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/creditMeshList.html', $scope.item, {
				title : T.T('SQJ2000001'),
				buttons : [ T.T('F00012')],
				size : [ '1100px', '580px' ],
				callbacks : [ ]
			});
		};
		//交易识别按钮
		$scope.identifyConList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemIden = {};
			$scope.itemIden = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/identifyConList.html', $scope.itemIden, {
				title : T.T('SQH2000080'),
				buttons : [T.T('F00125'),T.T('F00108')],
				size : [ '1000px', '620px' ],
				callbacks : []
			});
		};
		//修改弹出页面
		$scope.authCreditNodeUpdate = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.item.authDataSynFlag = "1";
			$scope.modal('/authorization/quotatree/quotaNodeUpdate.html', $scope.item, {
				title : T.T('SQJ2000003'),
				buttons : [T.T('F00107'),T.T('F00108')],
				size : [ '1100px', '620px' ],
				callbacks : [$scope.saveQuotaInfo]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveQuotaInfo = function(result) {
			delete $scope.item['invalidFlag'];
			//pcd实例化
			$scope.item.artifactInstanList= $rootScope.queryMODP.data;
			//删除pcd实例
			/*$scope.item.deletePcdInstanIdList = $rootScope.deletePcdInstanIdList;
			$scope.item.creditNodeTyp=result.scope.creditNodeTyp;
			$scope.item.creditCategory=result.scope.creditCategory;
			$scope.item.creditProperty=result.scope.creditProperty;
			$scope.item.creditComputeMode=result.scope.creditComputeMode;
			$scope.item.creditCheckFlag=result.scope.creditCheckFlag;*/
			if($scope.item.creditNodeTyp == "B"){
				//$scope.item.transIdentifiNo = result.scope.transIdentifiNoInfo;
				if(($scope.item.creditProperty == "" ||  $scope.item.creditProperty == undefined) ||
						($scope.item.creditCategory == "" ||  $scope.item.creditCategory == undefined)){
					jfLayer.fail(T.T('SQJ2000018'));
				} else {
					//$scope.item.doubleCheckNodeCode = result.scope.doubleCheckNodeCodeUpdate;
					//$scope.item.upperNodeNo = result.scope.upperNodeNoUpdate;
					$scope.item.contrlSceneCode = result.scope.contrlSceneCodeU;
					delete $scope.item['creditComputeMode'];
					jfRest.request('quotatree', 'update', $scope.item).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success(T.T('F00022'));
							 $scope.item = {};
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
						}
						else if(data.returnCode.search('AUTH-') != -1){
							jfLayer.fail(T.T('F00023')+data.returnMsg );
						}
					});
				}
			}else{
				/*if($scope.item.creditComputeMode == "" ||  $scope.item.creditComputeMode == undefined){
					jfLayer.fail(T.T('SQJ2000021'));
				}else{*/
					//$scope.item.doubleCheckNodeCode = result.scope.doubleCheckNodeCodeUpdate;
					//$scope.item.upperNodeNo = result.scope.upperNodeNoUpdate;
					//$scope.item.transIdentifiNo = result.scope.transIdentifiNoInfo;
				$scope.item.contrlSceneCode = result.scope.contrlSceneCodeU;
				jfRest.request('quotatree', 'update', $scope.item)
				.then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						 $scope.item = {};
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
					}
					else if(data.returnCode.search('AUTH-') != -1){
						jfLayer.fail(T.T('F00023')+data.returnMsg );
					}
				});
				//}
			}
		};

		//删除额度节点按钮
		$scope.authCreditNodeDelete = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/quotaTreeNodeDel.html', $scope.item, {
				title : T.T('SQJ2000004'),
				buttons : [T.T('F00016'),T.T('F00108')],
				size : [ '1000px', '580px' ],
				callbacks : [$scope.delCreditNodeSure ]
			});
		};
		//删除
		$scope.delCreditNodeSure = function(result){
			$scope.delItem = result.scope.item;
			jfLayer.confirm(T.T('SQJ2000004'),function() {
				$scope.delItem.authDataSynFlag = "1";
				$scope.delItem.invalidFlag = "1";
				jfRest.request('quotatree', 'del', $scope.delItem).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.delItem = {};
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
					}
				});
			},function() {
			});
		}



	});
	//在额度节点中展示业务项目
	webApp.controller('identifyListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.twoBtnAddFlag = true;
		$scope.twoBtnUpdFlag = true;
		//运营模式
		 $scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeiden = $scope.itemIden.operationMode;
	        }
	    };
		//授权场景识别码查询
		$scope.idenList = {
			params : $scope.queryParam = {
					"operationMode":$scope.itemIden.operationMode,
					"creditNodeNo":$scope.itemIden.creditNodeNo,
					"authFlag":"0",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'quotatree.identifyList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		 //新增
		$scope.addIdentify = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/quotatree/identifyConAdd.html',  $scope.itemIden, {
				title : T.T('SQJ2000025'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.addPro]
			});
		};
		$scope.addPro =  function(result){
			jfRest.request('quotatree', 'linesproUpd', $scope.itemIden).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00058'));
					$scope.safeApply();
					result.cancel();
					$scope.idenList.search();
				}
			});
		};
		$scope.updateIdentify = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/identifyConUpdate.html', $scope.item, {
				title : T.T('SQJ2000026'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.updPro]
			});
		};
		$scope.updPro =  function(result){
			$scope.item.transIdentifiNoN = result.scope.transIdentifiNoN;
			$scope.item.businessProgramNoN =result.scope.businessProgramNoN;
			$scope.item.authFlag = "1";
			jfRest.request('quotatree', 'linesproUpd', $scope.item).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.idenList.search();
				}
			});
		};
		$scope.delIdentify = function(event){
			// 页面弹出框事件(弹出页面)
			$scope.itemdel = {};
			$scope.itemdel = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T('SQJ2000027'),function() {
				$scope.itemdel.creditNodeNo = null;
				jfRest.request('quotatree', 'linesproUpd', $scope.itemdel).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00037'));
						$scope.idenList.search();
					}
				});
			});
		};
		$scope.delAllIdentify = function(event){
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm('确定删除此额度节点下所有业务项目吗',function() {
				$scope.item.authFlag = "1";
				jfRest.request('quotatree', 'linesproUpd', $scope.item).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						 $scope.item = {};
						$scope.safeApply();
						result.cancel();
						$scope.idenList.search();
					}
				});
			});
		}
	});
	//在额度节点中新增业务项目
	webApp.controller('identifyAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.twoBtnAddFlag = true;
		$scope.twoBtnUpdFlag = true;
		//运营模式
		 $scope.coArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.query",//数据源调用的action
		        callback: function(data){
		        	$scope.operationModeAa = $scope.itemIden.operationMode;
		        }
		    };
			//业务项目
		 $scope.businessArray ={
		        type:"dynamicDesc",
		        param:{
		        	operationMode : $scope.itemIden.operationMode
		        },//默认查询条件
		        text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称
		        desc:"programDesc",
		        value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"productLine.query",//数据源调用的action
		        callback: function(data){
		        }
		    };
		 //联动验证
		 var form = layui.form;
		 $scope.transArray = {};
		 form.on('select(businessProgramNoAdd)',function(event){
			 if(event.value){
		//获取业务项目代码
		 $scope.transArray = {
			type:"dynamic",
			param:{
			 "operationMode":$scope.itemIden.operationMode,
			 "businessProgramNo":event.value,
			 "authFlag":"0",
		    },//默认查询条件
			text:"transIdentifiDesc",
			value:"transIdentifiNo",
			resource : 'quotatree.linesproUpd',
			callback:function(data){
		    }
		 }
			 }
		 });
	});
	//额度网新增
	webApp.controller('creditNodeMeshAddCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.twoBtnAddFlag = true;
		$scope.twoBtnUpdFlag = true;
		$scope.queryDate();
		//运营模式
		 $scope.coArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.query",//数据源调用的action
		        callback: function(data){
		        	$scope.operationModeAa = $scope.itemMeshAdd.operationMode;
		        }
		    };
		 //节点关联类型
		 $scope.relativeTypArray = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_creditRelativeNodeTyp",
					queryFlag: "children"
				}, //默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback: function(data) {

				}
			};
		 //关联节点
		 var form = layui.form;
		 $scope.relativeNodeNoArray={};
		 form.on('select(getRelativeNodeTyps)',function(event){
			 $scope.itemMeshAdd.relativeNodeNo = "";
			 if(event.value != 'S'){
				 $scope.shareRelativeIndShow = false;
			 }else{
				 $scope.shareRelativeIndShow = true;
				//共享交易场景
				 $scope.shareRelativeCodeArray ={
					type:"dynamicDesc",
			        param:{operationMode:$scope.itemMeshAdd.operationMode,pageSize:10,indexNo:0,applicationRange: "A"
			        	   },//默认查询条件
			        text: "transSceneCode", //下拉框显示内容，根据需要修改字段名称
			   		desc: "transSceneDesc",
			   		value: "transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"tradModel.query",//数据源调用的action
			        callback: function(data){

			        }
			    };
			 }
			//关联节点
			 $scope.relativeNodeNoArray ={
				type:"dynamic",
		        param:{"operationMode":$scope.itemMeshAdd.operationMode,
		        	   "creditTreeId":$scope.itemMeshAdd.creditTreeId,
		        	   "creditNodeNo":$scope.itemMeshAdd.creditNodeNo,
		        	   "relativeNodeType":event.value,
		        	   "authDataSynFlag":"1",},//默认查询条件
		        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
		        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"quotatree.queryList",//数据源调用的action
		        callback: function(data){
		        }
		    };
			//节点可用额度独立
			 $scope.shareAvailIndArray = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_shareAvailInd",
					queryFlag: "children"
				}, //默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback: function(data) {

				}
			};
		});
	});

	//额度网详情查询
	webApp.controller('creditNodeMeshInfoCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");

		if($scope.itemInfo.relativeNodeTyp == 'R' || $scope.itemInfo.relativeNodeTyp == 'O'){
			$('#relativeNodeTypId').attr('disabled','true');
			$timeout(function(){
    			Tansun.plugins.render('select');
			});
		}else{
			$('#relativeNodeTypId').removeAttr('disabled');
			$timeout(function(){
    			Tansun.plugins.render('select');
			});
		}
		//运营模式
		$scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeAa = $scope.itemInfo.operationMode;
	        }
	    };
		//节点关联类型
		 $scope.relativeTypArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_creditRelativeNodeTyp",
				queryFlag: "children"
			}, //默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback: function(data) {
				$scope.relativeNodeTypN = $scope.itemInfo.relativeNodeTyp;
			}
		};
		//共享标识
		 $scope.shareRelativeIndArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_shareRelativeInd",
				queryFlag: "children"
			}, //默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback: function(data) {
				$scope.shareRelativeIndN = $scope.itemInfo.shareRelativeInd;
			}
		};

		 $scope.shareRelativeCodeArrayInfo = {};
		 $scope.shareAvailIndArrayInfo = {};
		 if($scope.itemInfo.relativeNodeTyp != 'S'){
			 $scope.shareRelativeIndShowInfo = false;
		 }else{
			 if($scope.itemInfo.shareRelativeInd == "0"){
				 $scope.shareRelativeIndShowInfo = false;
			 }else if($scope.itemInfo.shareRelativeInd == "1"){
				 $scope.shareRelativeIndShowInfo = true;
				 //共享交易场景
				 $scope.shareRelativeCodeArrayInfo ={
					 type:"dynamicDesc",
					 param:{operationMode:$scope.itemInfo.operationMode,pageSize:10,indexNo:0,applicationRange: "A"
					 },//默认查询条件
					 text: "transSceneCode", //下拉框显示内容，根据需要修改字段名称
					 desc: "transSceneDesc",
					 value: "transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
					 resource:"tradModel.query",//数据源调用的action tradScenario.query
					 callback: function(data){
						 $scope.shareRelativeCodeN = $scope.itemInfo.shareRelativeCode;
					 }
				 };
				 //可用额度独立
				 $scope.shareAvailIndArrayInfo = {
					 type: "dictData",
					 param: {
						 "type": "DROPDOWNBOX",
						 groupsCode: "dic_shareAvailInd",
						 queryFlag: "children"
					 }, //默认查询条件
					 text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					 value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					 resource : "paramsManage.query",// 数据源调用的action
					 callback: function(data) {
						 $scope.shareAvailIndN = $scope.itemInfo.shareAvailInd;
					 }
				 };
			 }
		 }

		$scope.relativeNodeNoArray = {};
		//关联节点
		 $scope.relativeNodeNoArray ={
				type:"dynamic",
		        param:{"operationMode":$scope.itemInfo.operationMode,
		        	   "creditTreeId":$scope.itemInfo.creditTreeId,
		        	   "relativeNodeType":$scope.itemInfo.relativeNodeTyp,
		        	   "creditNodeNo":$scope.itemInfo.creditNodeNo,
		        	   "authDataSynFlag":"1",},//默认查询条件
		        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
		        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"quotatree.queryList",//数据源调用的action
		        callback: function(data){
		        	$scope.relativeNodeNoN = $scope.itemInfo.relativeNodeNo;
		        }
		    };
	});

	//额度网修改
	webApp.controller('creditNodeMeshUpdateCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.shareRelativeCodeArrayU = {};
		$scope.shareAvailIndArrayU = {};
		if($scope.itemUpdate.relativeNodeTyp == 'R' || $scope.itemUpdate.relativeNodeTyp == 'O'){
			$('#relativeNodeTypId').attr('disabled','true');
			$timeout(function(){
    			Tansun.plugins.render('select');
			});
		}else{
			$('#relativeNodeTypId').removeAttr('disabled');
			$timeout(function(){
    			Tansun.plugins.render('select');
			});
		}
		//运营模式
		$scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeAa = $scope.itemUpdate.operationMode;
	        }
	    };
		//节点关联类型
		 $scope.relativeTypArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_creditRelativeNodeTyp",
				queryFlag: "children"
			}, //默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback: function(data) {
				$scope.relativeNodeTypU = $scope.itemUpdate.relativeNodeTyp;
				if($scope.itemUpdate.relativeNodeTyp == 'S'){
					$scope.shareRelativeIndShowU = true;
				}else if($scope.itemUpdate.relativeNodeTyp != 'S'){
					$scope.shareRelativeIndShowU = false;
				}
			}
		};
		$scope.relativeNodeNoArrayU = {};
		//关联节点
		 $scope.relativeNodeNoArrayU ={
			type:"dynamic",
	        param:{"operationMode":$scope.itemUpdate.operationMode,
	        	   "creditTreeId":$scope.itemUpdate.creditTreeId,
	        	   "relativeNodeType":$scope.itemUpdate.relativeNodeTyp,
	        	   "creditNodeNo":$scope.itemUpdate.creditNodeNo,
	        	   "authDataSynFlag":"1",},//默认查询条件
	        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
	        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"quotatree.queryList",//数据源调用的action
	        callback: function(data){
	        	$scope.relativeNodeNoU = $scope.itemUpdate.relativeNodeNo;
	        }
	    };
		 var form = layui.form;
		 form.on('select(getRelativeNodeTypU)',function(event){
			if(event.value == 'S'){
				$scope.shareRelativeIndShowU = true;
				 if($scope.itemUpdate.shareRelativeInd == "0"){
					 $scope.shareRelativeIndShowU = false;
				 }else if($scope.itemUpdate.shareRelativeInd == "1"){
					 $scope.shareRelativeIndShowU = true;
					 $scope.shareRelativeCodeArrayU ={
						type: "dynamicDesc",
						param: {
							operationMode: $scope.itemUpdate.operationMode,
							applicationRange: 'A',
							pageSize:10,
							indexNo:0
						},
						text:"transSceneCode", //下拉框显示内容，根据需要修改字段名称
						desc: "transSceneDesc",
						value:"transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
						resource: "tradModel.query",//数据源调用的action
						callback: function (data) {
						}
				    };

					//可用额度独立
					 $scope.shareAvailIndArrayU = {
						 type: "dictData",
						 param: {
							 "type": "DROPDOWNBOX",
							 groupsCode: "dic_shareAvailInd",
							 queryFlag: "children"
						 }, //默认查询条件
						 text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						 value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						 resource : "paramsManage.query",// 数据源调用的action
						 callback: function(data) {

						 }
					 };
				 }
			}else{
				$scope.shareRelativeIndShowU = false;
				$scope.shareRelativeCodeUpdate = "";
				$scope.shareAvailIndUpdate = "";
			}
			//根据关联类型获取关联节点
			 $scope.relativeNodeNoArrayU ={
				type:"dynamic",
				param:{"operationMode":$scope.itemUpdate.operationMode,
					   "creditTreeId":$scope.itemUpdate.creditTreeId,
					   "creditNodeNo":$scope.itemUpdate.creditNodeNo,
					   "relativeNodeType":event.value,
					   "authDataSynFlag":"1",},//默认查询条件
				text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
				value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
				resource:"quotatree.queryList",//数据源调用的action
				callback: function(data){
				}
			};
		 });

		 //共享交易场景
		 $scope.shareRelativeCodeArrayU ={
        	type: "dynamicDesc",
   			param: {
   				operationMode: $scope.itemUpdate.operationMode,
   				applicationRange: 'A',
   				pageSize:10,
   				indexNo:0
   			},
   			text:"transSceneCode", //下拉框显示内容，根据需要修改字段名称
   			desc: "transSceneDesc",
   			value:"transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
   			resource: "tradModel.query",//数据源调用的action
   			callback: function (data) {
   				$scope.shareRelativeCodeUpdate = $scope.itemUpdate.shareRelativeCode;
   			}
	    };
		//可用额度独立
		 $scope.shareAvailIndArrayU = {
			 type: "dictData",
			 param: {
				 "type": "DROPDOWNBOX",
				 groupsCode: "dic_shareAvailInd",
				 queryFlag: "children"
			 }, //默认查询条件
			 text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			 value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			 resource : "paramsManage.query",// 数据源调用的action
			 callback: function(data) {
				 $scope.shareAvailIndUpdate = $scope.itemUpdate.shareAvailInd;
			 }
		 };
		 form.on('select(getShareRelativeCodeU)',function(event){
			 if(event.value){
				 $scope.shareRelativeCodeUpdate = event.value;
			 }
		 });
		 form.on('select(getShareAvailIndU)',function(event){
			 if(event.value){
				 $scope.shareAvailIndUpdate = event.value;
			 }
		 });
	});
	//在额度节点中修改业务项目
	webApp.controller('identifyUpdCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.businessProgramNo = $scope.item.businessProgramNo;
		//运营模式
		 $scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeAa = $scope.item.operationMode;
	        }
	    };
		//获取交易识别码
		 $scope.transArray = {
			type:"dynamic",
			param:{
			 "operationMode":$scope.item.operationMode,
			 "authFlag":"0",
		    },//默认查询条件
			text:"transIdentifiDesc",
			value:"transIdentifiNo",
			resource : 'quotatree.linesproUpd',
			callback:function(data){
		    	$scope.transIdentifiNoN = $scope.item.transIdentifiNo;
		    }
		 };
		 $scope.businessArray = {
			 type:"dynamicDesc",
			 param:{
				 operationMode:$scope.item.operationMode,
	         },
			 text:"businessProgramNo",
			 desc:"programDesc",
			 value:"businessProgramNo",
			 resource : 'productLine.query',
			 callback:function(data){
	        	 $scope.businessProgramNoN =$scope.item.businessProgramNo;
			 }
		 };
		 //联动验证
		 var form = layui.form;
		 form.on('select(businessProgramNoNAdd)',function(event){
			 if(event.value){
				//获取业务项目代码
				 $scope.transArray = {
					type:"dynamic",
					param:{
					 "operationMode":$scope.item.operationMode,
					 "businessProgramNo":event.value,
					 "authFlag":"0",
				    },//默认查询条件
					text:"transIdentifiDesc",
					value:"transIdentifiNo",
					resource : 'quotatree.linesproUpd',
					callback:function(data){
				    }
				 }
			 }
	    });
	});
	//新增节点（整体）
	webApp.controller('quotaAddACtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.isL = true;
		$scope.isb = true;
		//自定义下拉框---------额度计算方式
		$scope.sumArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaCalculationMethod",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//运营模式
		 $scope.coArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.query",//数据源调用的action
		        callback: function(data){
		        }
		    };
		 	//$scope.upperArray={};
		 	var form = layui.form;
			form.on('select(getoperation)',function(event){
				$scope.aryparamss = {"authDataSynFlag":"1","operationMode":$scope.quota.operationMode};
				jfRest.request('quotatree', 'queryTree', $scope.aryparamss)
				.then(function(data) {
					if(data.returnData.rows.length == 0 || data.returnData.rows == ""){
						jfLayer.fail(T.T('SQJ2000022'));
						$scope.quota.operationMode = "";
						$scope.quotaTreeNoInfo = "";
					}
					else{
						$scope.quotaTreeNoInfo = data.returnData.rows[0].creditTreeId;
					}
				});
				//上层节点
				 /*$scope.upperArray ={
				        type:"dynamic",
				        param:{"operationMode":$scope.quota.operationMode,
				        	"authDataSynFlag":"1",
				        	},//默认查询条件
				        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
				        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"quotatree.queryList",//数据源调用的action
				        callback: function(data){
				        }
				    };*/
			});
		//自定义下拉框---------节点类型
		$scope.nodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_node",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//自定义下拉框---------额度种类
		$scope.typeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeOfQuota",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//自定义下拉框---------额度性质
		$scope.natureArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaNature",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//额度检查标志
		$scope.creditCheckFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaCheckMark",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		var form = layui.form;
		form.on('select(getRiskLimits)',function(event){
			if($scope.quota.creditNodeTyp == "B"){
				$scope.isL = false;
				$scope.isb = true;
				$scope.quota.creditComputeMode = "";          //额度计算方式
			}
			else{
				$scope.isL = true;
				$scope.isb = false;
				$scope.quota.doubleCheckNodeCode = "";   //双重检查节点编号
				$scope.quota.creditCategory = "";       // 额度种类
				$scope.quota.creditProperty = "";         //  额度性质
			}
		});
	});
	//新增节点（单个）
	webApp.controller('quotaAddOneACtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//自定义下拉框---------额度计算方式
		$scope.sumArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaCalculationMethod",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.isL = true;
		$scope.isb = true;
		//运营模式
		$scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        }
	    };
		//上层节点
		 /*$scope.upperArray ={
	        type:"dynamic",
	        param:{"operationMode":$scope.itemAdd.operationMode,
	        	"authDataSynFlag":"1",
	        	},//默认查询条件
	        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
	        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"quotatree.queryList",//数据源调用的action
	        callback: function(data){
	        	$scope.upperNodeNoInfo = $scope.itemAdd.creditNodeNo;
	        }
	    };*/
		//自定义下拉框---------节点类型
		$scope.nodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_node",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//自定义下拉框---------额度种类
		$scope.typeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeOfQuota",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//自定义下拉框---------额度性质
		$scope.natureArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaNature",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//额度检查标志
		$scope.creditCheckFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaCheckMark",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//交易识别代码
		/* $scope.transIdentifiNoArray ={
	        type:"dynamic",
	        param:{authDataSynFlag:"1"},//默认查询条件
	        text:"transIdentifiDesc", //下拉框显示内容，根据需要修改字段名称
	        value:"transIdentifiNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"transIdenty.query",//数据源调用的action
	        callback: function(data){
	        }
	    };*/
		var form = layui.form;
		form.on('select(getRiskLimits)',function(event){
			if($scope.qAddOne.creditNodeTyp == "B"){
				$scope.isL = false;
				$scope.isb = true;
				$scope.qAddOne.creditComputeMode = "";          //额度计算方式
			}else{
				$scope.isL = true;
				$scope.isb = false;
				$scope.qAddOne.doubleCheckNodeCode = "";   //双重检查节点编号
				$scope.qAddOne.creditCategory = "";       // 额度种类
				$scope.qAddOne.creditProperty = "";         //  额度性质
				//$scope.qAddOne.transIdentifiNo = "";          // 交易识别
			}
		});
	});
	//查询详情
	webApp.controller('quotaNodeViewCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//节点类型 下拉框
		$scope.nodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_node",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditNodeTyp = $scope.item.creditNodeTyp;
			}
		};
		//自定义下拉框---------额度个性化标志
		 /*$scope.creditDiffFlagArray ={
		        type:"dictData",
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_creditDiffFlag",
		        	queryFlag: "children"
		        },//默认查询条件
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action
		        callback: function(data){
		        	$scope.creditDiffFlag = $scope.item.creditDiffFlag;
		        }
			};*/
		//额度种类下拉框
		$scope.typeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeOfQuota",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditCategory = $scope.item.creditCategory;
			}
		};
		//额度性质下拉框
		$scope.natureArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaNature",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditProperty = $scope.item.creditProperty;
			}
		};
		 $scope.contrlSceneCodeInfoArray ={
	        type:"dynamicDesc",
	        param:{
	        	operationMode:$scope.item.operationMode,
	        	differentCode:"",
	        	independentFlag:'1',
	        	differentType:'0',
	        	pageSize:10,
				indexNo:0
	        },//默认查询条件
	        text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称
	        desc:"contrlSceneDesc",
	        value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"diffQueryb.query",//数据源调用的action
	        callback: function(data){
	        	$scope.contrlSceneCodeInfo = $scope.item.contrlSceneCode;
	        }
	    };
		//运营模式
		 $scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };
		//自定义下拉框---------额度计算方式
		 $scope.sumArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaCalculationMethod",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditComputeMode = $scope.item.creditComputeMode;
			}
		};
		$scope.isL = true;
		$scope.isb = true;
		//上层节点
		/*$scope.upperArray ={
	        type:"dynamic",
	        param:{"operationMode":$scope.item.operationMode,
	        	"authDataSynFlag":"1",
	        	},//默认查询条件
	        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称
	        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"quotatree.queryList",//数据源调用的action
	        callback: function(data){
	        	$scope.upperNodeNoUpdate = $scope.item.upperNodeNo;
	        	$scope.doubleCheckNodeCodeUpdate = $scope.item.doubleCheckNodeCode;
	        }
	    };*/
	     $scope.artInfo = true;
	     $scope.isS = false;
		 if($scope.item.creditNodeTyp == 'B'){
			 $scope.isL = false;
			 $scope.isb = true;
			 $scope.isS = true;
		 }else{
			 $scope.isL = true;
			 $scope.isb = false;
			 $scope.artInfo = false;
			 $scope.isS = false;
		 }
		 //构件实例列表
		$scope.artifactView = {
			params : {
					"pageSize":10,
					"indexNo":0,
					"instanCode":$scope.item.creditNodeNo,
					"artifactNo":'26',
					"operationMode":$scope.item.operationMode
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) {// 表格查询后的回调函数
			}
		};
		$scope.saveProInfo = function(){
    	   $scope.scenarioInfo = true;
    	   $scope.artInfo = true;
    	   $scope.artifactView.params.instanCode = $scope.item.creditNodeNo;
    	   $scope.artifactView.params.operationMode = $scope.item.operationMode;
		   $scope.artifactView.search();
		};
	     //产品构件实例====详情
		$scope.queryArtifactBP = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
				title : T.T('YYH500008'),
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};
	});
	//查看
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件
			text: "codes", //下拉框显示内容，根据需要修改字段名称
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
			$scope.segmentTypeInfoD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.itemArtifact.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.segmentTypeInfoD =  data.returnData.rows[0].segmentType;
					$scope.pcdInstanList = [];
					$scope.pcdInstanList.push(data.returnData.rows[0].pcdInitList);
					$scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}else{
				jfLayer.fail(T.T('YYJ400042'));
			}
		});
      //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	 //pcd差异列表
           $scope.pcdInfTable = [];
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.itemArtifact.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.itemArtifact.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.itemArtifact.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.itemArtifact.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.itemArtifact.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.itemArtifact.instanCode5;
    	   $scope.queryPcdExample.addPcdFlag = '2';
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }else if($scope.pcdInstanList.length > 0){
    				   $scope.pcdInfTable = $scope.pcdInstanList[0];
    			   }
    		   }
    	   });
       }
	});
	//修改
	webApp.controller('quotatreeUpdateCtrl', function($scope, $stateParams, $timeout,jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//自定义下拉框---------额度个性化标志
		/*$scope.creditDiffFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_creditDiffFlag",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditDiffFlag= $scope.item.creditDiffFlag;
			}
		};*/
		$scope.contrlSceneCodeArray ={
	        type:"dynamicDesc",
	        param:{
	        	operationMode:$scope.item.operationMode,
	        	differentCode:"",
	        	independentFlag:'1',
	        	differentType:'0',
	        	pageSize:10,
				indexNo:0
	        },//默认查询条件
	        text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称
	        desc:"contrlSceneDesc",
	        value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"diffQueryb.query",//数据源调用的action
	        callback: function(data){
	        	$scope.contrlSceneCode = $scope.item.contrlSceneCode;
	        }
	    };
		$scope.isL = true;
		$scope.isS = true;
		$scope.isb = true;
		//运营模式
		 $scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };

		 if($scope.item.creditNodeTyp == 'B'){
			 $scope.isL = false;
			 $scope.isb = true;
			 $scope.isS = true;
		 }else{
			 $scope.isL = true;
			 $scope.isb = false;
			 $scope.isS = false;
		 }
			//自定义下拉框---------节点类型
			$scope.nodeArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_node",
					queryFlag : "children"
				},// 默认查询条件
				rmData: '840',
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.creditNodeTyp= $scope.item.creditNodeTyp;
				}
			};
			//自定义下拉框---------额度种类
			$scope.typeArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_typeOfQuota",
					queryFlag : "children"
				},// 默认查询条件
				rmData: '840',
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.creditCategory= $scope.item.creditCategory;
				}
			};
			//自定义下拉框---------额度性质
			$scope.natureArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_quotaNature",
					queryFlag : "children"
				},// 默认查询条件
				rmData: '840',
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.creditProperty= $scope.item.creditProperty;
				}
			};
			var form = layui.form;
			form.on('select(getUpdateNode)',function(event){
				if($scope.creditNodeTyp == "B"){
					$scope.isL = false;
					 $scope.isb = true;
				}
				else{
					$scope.isL = true;
					$scope.isb = false;
					$scope.creditCategory = "";       // 额度种类
					$scope.creditProperty = "";    //  额度性质
					$scope.instanSceneShow = false
				}
			  });  //构件实例列表
			  $rootScope.queryMODP = {
					params : $scope.queryParam = {
						instanCode:$scope.item.creditNodeNo,
						artifactNo : 26,
						operationMode : $scope.item.operationMode
					}, // 表格查询时的参数信息
				//autoQuery: false,
				paging : false,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						//$scope.isshow99 = false;//隐藏 下一步按钮
						if($scope.creditNodeTyp == "B"){
						$scope.instanSceneShow = true;//显示实例化
						}
						if(data.returnData){
							if(data.returnData.rows == undefined ||  data.returnData.rows == null  ||data.returnData.rows == ''){
								data.returnData.rows =[];
							}else {
								$rootScope.queryMODP.data = data.returnData.rows;
								for(var i =0; i < data.returnData.rows.length; i++){
									//data.returnData.rows[i].segmentNumber = $scope.proObjectInf.segmentNumber;
                                }
                            }
						}
					}
				}
			};
			$timeout(function(){
		   },500);
			//产品实例化时，点击设置参数值的方法
			$scope.setSelectAUpdate = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.itemsPCD = {};
				$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdate.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdate]
				});
			};
			$scope.choseSelectTwoUpdate = function(result) {
			$scope.items = {};
			$rootScope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			//$rootScope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$rootScope.queryMODP.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$rootScope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		//产品实例化时，点击替换参数的方法
		$scope.updateSelectAUpdate = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectElementNoUpdate.html', $scope.itemsNo, {
				title : T.T('F00138'),//'选择替换参数项',
				buttons : [  T.T('F00107'), T.T('F00012')  ],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.choseSelectAUpdate]
			});
		};
		$scope.choseSelectAUpdate = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$rootScope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$rootScope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$rootScope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			if (result.scope.pcdInstanShow) {
				//$rootScope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$rootScope.queryMODP.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
				$rootScope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			}
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('viewProductObjectCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.productObjectListTable = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('selectPCD2Ctrl',function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdExampleInf ={};
		$scope.pcdDifExampleInf = {};
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件
			text: "codes", //下拉框显示内容，根据需要修改字段名称
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.pcdTypeUpdateP = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdateP)',function(event){
			 $scope.pcdTypeUpdateP = event.value;
		 });
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件
			text: "codes", //下拉框显示内容，根据需要修改字段名称
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.segmentTypeUpdateP = $scope.pcdExampleInf.segmentType;
			}
		};
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		$scope.updateSaveFlag = false;//记录是否修改或新增
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.pcdExampleInfUpdate = {};
			$scope.updateSaveFlag = false;//新增
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	$scope.pcdDifExampleInf.pcdDiffSerialNo = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
		}else{
			$scope.showNewPcdInfoUpdate = true;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
			if(item.id != null && item.id != undefined && item.id != '' && item.id){
				$rootScope.deletePcdInstanIdList.push(item.id);
            }
        };
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
			$scope.updateSaveFlag = true;//修改
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdExampleInfUpdate.pcdPoint|| null== $scope.pcdExampleInfUpdate.pcdType
    			 || null== $scope.pcdExampleInfUpdate.pcdValue
    			  ) {
				  jfLayer.fail(T.T('YYJ400049'));
				  return;
	    	   }
				var pcdInfTableInfoU = {};
				//pcdInfTableInfoU = $(pcdInfTableInfoU,$scope.pcdExampleInf);
				pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
				pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
				pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
				pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
				pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
				pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
				pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeUpdateP;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.updateSaveFlag){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInfUpdate.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeUpdateP;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInfUpdate.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInfUpdate.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
					$scope.pcdExampleInfUpdate = {};
				}
				$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
				$scope.showNewPcdInfoUpdate = false;
	       };
		  //
		  var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
						title : T.T('YYJ400021'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBusType]
					});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
						title : T.T('YYJ400022'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseMedia]
					});
				}else if(dataType=="MODB"){//余额对象
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
						title : T.T('YYJ400023'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBalanceObject]
					});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
						title : T.T('YYJ400024'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductObject]
					});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
						title : T.T('YYJ400025'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductLine]
					});
				}else if(dataType=="ACST"){//核算状态
					//弹框查询列表
					$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
						title : T.T('YYJ400026'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseAcst]
					});
				}else if(dataType=="EVEN"){//事件
					//弹框查询列表
					$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
						title : T.T('YYJ400027'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseEvent]
					});
				}else if(dataType=="BLCK"){//封锁码
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
						title : T.T('YYJ400028'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBlockCode]
					});
				}else if(dataType=="AUTX"){//授权场景
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
						title : T.T('YYJ400029'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseScenarioList]
					});
				}else if(dataType=="LMND"){//额度节点
					//弹框查询列表
					$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
						title : T.T('YYJ400030'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseQuotaTree]
					});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
						title : T.T('YYJ400027'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseCurrency]
					});
				}else if(dataType=="DELQ"){//延滞层级
					//弹框查询列表
					$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
						title : T.T('YYJ400031'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseDelv]
					});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				//if (!result.scope.itemList.validCheck()) {
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
				//$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.artifactExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.artifactExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.artifactExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.artifactExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.artifactExampleInf.instanCode5 = code;
				}else if(dataValue=='base'){
					$scope.pcdExampleInf.baseInstanCode = code;
				}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseInstanCode1Btn = function() {
				$scope.checkValidate();
				//获取维度取值1的值
				dataValueCount =1;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen1);
			};
			$scope.choseInstanCode2Btn = function() {
				$scope.checkValidate();
				//获取维度取值2的值
				dataValueCount =2;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen2);
			};
			$scope.choseInstanCode3Btn = function() {
				$scope.checkValidate();
				//获取维度取值3的值
				dataValueCount =3;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen3);
			};
			$scope.choseInstanCode4Btn = function() {
				$scope.checkValidate();
				//获取维度取值4的值
				dataValueCount =4;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen4);
			};
			$scope.choseInstanCode5Btn = function() {
				$scope.checkValidate();
				//获取维度取值5的值
				dataValueCount =5;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen5);
			};
			$scope.choseBaseInstanCodeBtnUpdate = function() {
				//获取基础维度的值
				dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtnUpdate = function() {
				//获取可选维度的值
				dataValueCount ='option';
				$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
			};
	});
	//******************************替换参数***************
	webApp.controller('selectElementNo2Ctrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.artifactInfo = {};
		$scope.artifactInfo = $scope.itemsNo;
		// 元件
		$scope.elementNoTableUpdate = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});

	/*************************************************** 额度网 *****************************************************/
	//额度网列表
	webApp.controller('creditMeshListCtrl', function($scope, $stateParams, jfRest, $timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.twoBtnAddFlag = true;
		$scope.twoBtnUpdFlag = true;
		$scope.showNewMeshTable = false;//新网默认不显示
		$scope.updateMeshBtnFlag = true;//旧网修改/删除 按钮，默认显示
		$scope.delMeshBtnFlag = true;//旧网修改/删除 按钮，默认显示
		//运营模式
		 $scope.coArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"operationMode.query",//数据源调用的action
	        callback: function(data){
	        	$scope.operationModeiden = $scope.item.operationMode;
	        }
	    };

		 //查询 配置参数：节点关联关系、节点关联类型
		 $scope.queryParam01 = {
				 type: "DROPDOWNBOX",
				 groupsCode : "dic_creditRelativeNodeTyp",
				 queryFlag : "children"
		 };
		 jfRest.request('paramsManage', 'query',$scope.queryParam01).then(function(data) {
			 $scope.creditRelativeNodeList = [];
			 $scope.creditRelativeNodeList = data.returnData.rows;//
		 });
		 $scope.queryParam02 = {
				 type: "DROPDOWNBOX",
				 groupsCode : "dic_creditRelativeTyp",
				 queryFlag : "children"
		 };
		 jfRest.request('paramsManage', 'query',$scope.queryParam02).then(function(data) {
			 $scope.creditRelativeList = [];
			 $scope.creditRelativeList = data.returnData.rows;//
		 });

		 //查询节点已生效额度关系（关联+被关联）
		$scope.isrelativeList = false;
		$scope.isrelativeedList = false;
		$scope.creditMeshList = function(){// 执行增加、修改、删除之后， 查询生效额度关系
			$scope.paramsMeshList={
				"operationMode":$scope.item.operationMode,
				"creditTreeId":$scope.item.creditTreeId,
				"creditNodeNo":$scope.item.creditNodeNo,
				"meshEffectiveTyp":"Y",
				"authFlag":"0",
				"methodType":"selectFlag"
			};
			jfRest.request('quotatree', 'creditMeshQuery', $scope.paramsMeshList).then(function(data) {
				$scope.relativeList = [];
				$scope.relativeedList = [];
				if(data.returnCode == '000000'){
					if(data.returnData.rows.length > 0){//有返回数据

						for(var i=0;i<data.returnData.rows.length;i++){
							for(var k = 0; k < $scope.creditRelativeNodeList.length; k++){
								if(data.returnData.rows[i].relativeNodeTyp == $scope.creditRelativeNodeList[k].codes){
									data.returnData.rows[i].relativeNodeTypDesc = $scope.creditRelativeNodeList[k].detailDesc;
                                }
                            }
                            for(var k = 0; k < $scope.creditRelativeList.length; k++){
								if(data.returnData.rows[i].relativeTyp == $scope.creditRelativeList[k].codes){
									data.returnData.rows[i].relativeTypDesc = $scope.creditRelativeList[k].detailDesc;
                                }
                            }
                            if(data.returnData.rows[i].creditNodeRelativeType == "relative"){
								$scope.relativeList.push(data.returnData.rows[i]);
							}else{
								$scope.relativeedList.push(data.returnData.rows[i]);
							}
						}
						if($scope.relativeedList.length>0){
							$scope.isrelativeedList = false;
						}else{
							$scope.isrelativeedList = true;
						}
						if($scope.relativeList.length>0){
							$scope.isrelativeList = false;
						}else{
							$scope.isrelativeList = true;
						}
					}else{//无数据
						$scope.isrelativeedList = true;
						$scope.isrelativeList = true;
					}
                }
            });
		};
		$timeout(function() {
			$scope.creditMeshList();
		},300);


		//查询节点已生效额度关系（关联+被关联）
		$scope.isrelativeNewList = false;
		$scope.isrelativeedNewList = false;
		$scope.creditMeshNewList = function(){// 执行增加、修改、删除之后， 查询生效额度关系
			$scope.paramsNewMeshList={
				"operationMode":$scope.item.operationMode,
				"creditTreeId":$scope.item.creditTreeId,
				"creditNodeNo":$scope.item.creditNodeNo,
				"meshEffectiveTyp":"N",
				"authFlag":"0",
				"methodType":"selectFlag"
			};
			jfRest.request('quotatree', 'creditMeshQuery', $scope.paramsNewMeshList).then(function(data) {
				$scope.relativeNewList = [];
				$scope.relativeedNewList = [];
				if(data.returnCode == '000000'){
					if(data.returnData.rows.length > 0){//有返回数据
						for(var i=0;i<data.returnData.rows.length;i++){
							for(var k = 0; k < $scope.creditRelativeNodeList.length; k++){
								if(data.returnData.rows[i].relativeNodeTyp == $scope.creditRelativeNodeList[k].codes){
									data.returnData.rows[i].relativeNodeTypDesc = $scope.creditRelativeNodeList[k].detailDesc;
                                }
                            }
                            for(var k = 0; k < $scope.creditRelativeList.length; k++){
								if(data.returnData.rows[i].relativeTyp == $scope.creditRelativeList[k].codes){
									data.returnData.rows[i].relativeTypDesc = $scope.creditRelativeList[k].detailDesc;
                                }
                            }
                            if(data.returnData.rows[i].creditNodeRelativeType == "relative"){
								$scope.relativeNewList.push(data.returnData.rows[i]);
							}else{
								$scope.relativeedNewList.push(data.returnData.rows[i]);
							}
						}
						if($scope.relativeedNewList.length>0){
							$scope.isrelativeedNewList = false;
						}else{
							$scope.isrelativeedNewList = true;
						}
						if($scope.relativeNewList.length>0){
							$scope.isrelativeNewList = false;
						}else{
							$scope.isrelativeNewList = true;
						}
					}else{//无数据
						$scope.isrelativeedNewList = true;
						$scope.isrelativeNewList = true;
					}
                }
            });
		};
		$timeout(function() {
			$scope.creditMeshNewList();
		},310);


		$scope.selectAllNewMesh = function(){// 执行增加、修改、删除之后， 查询未生效额度关系
			$scope.paramsSel={};
			$scope.paramsSel.operationMode = $scope.item.operationMode;
			$scope.paramsSel.creditTreeId = $scope.item.creditTreeId;
			$scope.paramsSel.meshEffectiveTyp = 'N';
			$scope.paramsSel.authFlag = '0';
			$scope.paramsSel.methodType = 'selectFlag';
			jfRest.request('quotatree', 'creditMeshQuery', $scope.paramsSel).then(function(data) {
				if(data.returnCode == '000000'){
					if(data.returnData.rows.length > 0){
						$scope.showNewMeshTable = true;
						$scope.updBtnFlag02 = false;
						$scope.delBtnFlag02 = false;
					}else if(data.returnData.rows.length == 0){
						$scope.showNewMeshTable = false;
						$scope.updBtnFlag02 = true;
						$scope.delBtnFlag02 = true;
					}
				}
			});
		};
		$timeout(function() {
			$scope.selectAllNewMesh();
		},320);

		 //新增关系
		$scope.addCreditNodeMesh = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemMeshAdd = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/quotatree/creditNodeMeshAdd.html', $scope.itemMeshAdd, {
				title : T.T('SQJ2000025'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.addCreditNodeMeshInfo]
			});
		};
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.ecommTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.addCreditNodeMeshInfo =  function(result){
			$scope.itemMeshAdd.methodType = "insertFlag";
			//如果关联关系为共享关系，默认：shareRelativeInd(共享关系标识) 置为1（1：按交易场景共享）,shareAvailInd(可用额度独立使用)置为Y
			if($scope.itemMeshAdd.relativeNodeTyp == "S"){
				$scope.itemMeshAdd.shareRelativeInd = "1";
				//$scope.itemMeshAdd.shareAvailInd = "Y";
			}

			jfRest.request('quotatree', 'creditMeshAdd', $scope.itemMeshAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00058'));
					$scope.safeApply();
					result.cancel();
					$scope.creditMeshList();
					$scope.creditMeshNewList();
					$scope.selectAllNewMesh();
				}

			});
		};
		//查询详情
		$scope.getCreditNodeMeshInfo= function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemInfo = {};
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			$scope.itemInfo.creditDesc = $scope.itemInfo.creditNodeDesc;
			$scope.modal('/authorization/quotatree/creditNodeMeshInfo.html', $scope.itemInfo, {
				title : T.T('SQJ2000001'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateCreditNodeMeshInfo= function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemUpdate = {};
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.itemUpdate.creditDesc = $scope.item.creditDesc;
			$scope.modal('/authorization/quotatree/creditNodeMeshUpdate.html', $scope.itemUpdate, {
				title : T.T('SQJ2000031'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.upddateCreditNodeMesh]
			});
		};
		$scope.upddateCreditNodeMesh =  function(result){
			$scope.itemUpdate.methodType = "updateFlag";
			$scope.itemUpdate.relativeNodeTyp = result.scope.relativeNodeTypU;
			if($scope.itemUpdate.relativeNodeTyp != "S"){
				$scope.itemUpdate.shareRelativeInd = null;
				//$scope.itemUpdate.shareAvailInd = null;
			}else if($scope.itemUpdate.relativeNodeTyp == "S"){
				$scope.itemUpdate.shareRelativeInd = "1";
				//$scope.itemUpdate.shareAvailInd = "Y";
			}
			$scope.itemUpdate.relativeNodeNo = result.scope.relativeNodeNoU;
			$scope.itemUpdate.shareRelativeCode = result.scope.shareRelativeCodeUpdate;
			$scope.itemUpdate.shareAvailInd = result.scope.shareAvailIndUpdate;
			jfRest.request('quotatree', 'creditMeshUpdate', $scope.itemUpdate).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.creditMeshList();
					$scope.creditMeshNewList();
					$scope.selectAllNewMesh();
				}

			});
		};
		//删除
		$scope.delCreditNodeMesh = function(event){
			// 页面弹出框事件(弹出页面)
			$scope.itemDel = {};
			$scope.itemDel = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T('SQJ2000030'),function() {
				$scope.paramsNo = {
						 "methodType":"deleteFlag",
						 "operationMode":$scope.itemDel.operationMode,
						 "creditTreeId":$scope.itemDel.creditTreeId,
						 "creditNodeNo":$scope.itemDel.creditNodeNo,
						 "relativeNodeNo":$scope.itemDel.relativeNodeNo,
						 "relativeNodeTyp":$scope.itemDel.relativeNodeTyp,
						 "effectiveDate":$scope.itemDel.effectiveDate,
						 "id":$scope.itemDel.id
				 };
				jfRest.request('quotatree', 'creditMeshDel', $scope.paramsNo).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00037'));
						$scope.creditMeshList();
						$scope.creditMeshNewList();
						$scope.selectAllNewMesh();
					}

				});
			});
		}
	});
	//******************************替换参数***************
	webApp.controller('selectElementNoCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTable = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	//******************************替换参数end***************
	//******************************余额对象设置参数值pcd修改***************
	webApp.controller('selectPCDCtrl',function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.pcdExampleInf ={};
		$scope.pcdDifExampleInf = {};
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
		$scope.businessValueArr01= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.baseInstanDimenAddD = $scope.pcdExampleInf.baseInstanDimen;
			}
		};
		$scope.businessValueArr02= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.optionInstanDimenAddD = $scope.pcdExampleInf.optionInstanDimen;
			}
		};
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.segmentTypeAddD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件
			text: "codes", //下拉框显示内容，根据需要修改字段名称
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.pcdTypeAdd = $scope.pcdExampleInf.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeAdd)',function(event){
			 $scope.pcdTypeAdd = event.value;
		 });
		//新增pcd差异化不显示
		$scope.showNewPcdInfo = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtn = function() {
            $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
            if($scope.showNewPcdInfo){
            	$scope.pcdDifExampleInf.pcdDiffSerialNo = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null){//分段类型不为空
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShow = true;
		}else{
			$scope.addButtonShow = false;
		}
		if($scope.itemsPCD.pcdInitList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInitList;
		}else{
			$scope.showNewPcdInfo = true;
		}
		if($scope.itemsPCD.pcdList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdList;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDif =  function(data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
        };
        //修改pcd实例列表某行
        $scope.updateInstan = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfo = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInf = $scope.updateInstanTemp;
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfo = function() {
			  if(null== $scope.pcdExampleInf.pcdPoint|| null== $scope.pcdTypeAdd|| null== $scope.pcdExampleInf.pcdValue) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   }
				var pcdInfTableInfoU = {};
				pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeAdd;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInf.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeAdd;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInf.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInf.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInf.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
				}
				$scope.pcdDifExampleInf = {};
				$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
				$scope.showNewPcdInfo = false;
	       };
		  //
		  var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
							title : T.T('YYJ400021'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBusType]
						});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
							title : T.T('YYJ400022'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseMedia]
						});
				}else if(dataType=="MODB"){//余额对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
							title : T.T('YYJ400023'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBalanceObject]
						});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
							title : T.T('YYJ400024'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductObject]
						});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
							title : T.T('YYJ400025'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductLine]
						});
				}else if(dataType=="ACST"){//核算状态
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
							title : T.T('YYJ400026'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseAcst]
						});
				}else if(dataType=="EVEN"){//事件
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseEvent]
						});
				}else if(dataType=="BLCK"){//封锁码
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
							title : T.T('YYJ400028'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBlockCode]
						});
				}else if(dataType=="AUTX"){//授权场景
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
							title : T.T('YYJ400029'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseScenarioList]
						});
				}else if(dataType=="LMND"){//额度节点
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
							title : T.T('YYJ400030'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseQuotaTree]
						});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseCurrency]
						});
				}else if(dataType=="DELQ"){//延滞层级
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
							title : T.T('YYJ400031'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.artifactExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.artifactExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.artifactExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.artifactExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.artifactExampleInf.instanCode5 = code;
				}else if(dataValue=='base'){
					$scope.pcdExampleInf.baseInstanCode = code;
				}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseBaseInstanCodeBtn = function() {
				//获取基础维度的值
				dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtn = function() {
				//获取可选维度的值
				dataValueCount ='option';
				$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
			};
	});
	//******************************设置参数值pcd修改end***************

	//******************************删除额度节点 start***************
	//删除额度节点
	webApp.controller('quotaNodeDelCtrl', function($scope, $stateParams, jfRest,$timeout,
												   $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//自定义下拉框---------节点类型
		$scope.nodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_node",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditNodeTyp = $scope.item.creditNodeTyp;
			}
		};
		//自定义下拉框---------额度种类
		$scope.typeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeOfQuota",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditCategory = $scope.item.creditCategory;
			}
		};
		//自定义下拉框---------额度性质
		$scope.natureArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaNature",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.creditProperty = $scope.item.creditProperty;
			}
		};
		//运营模式
		$scope.coArray ={
			type:"dynamic",
			param:{},//默认查询条件
			text:"modeName", //下拉框显示内容，根据需要修改字段名称
			value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"operationMode.query",//数据源调用的action
			callback: function(data){
				$scope.operationModeInfo = $scope.item.operationMode;
			}
		};
		$scope.contrlSceneCodeDelArray ={
			type:"dynamicDesc",
			param:{
				operationMode:$scope.item.operationMode,
				differentCode:"",
				independentFlag:'1',
				differentType:'0',
				pageSize:10,
				indexNo:0
			},//默认查询条件
			text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称
			desc:"contrlSceneDesc",
			value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"diffQueryb.query",//数据源调用的action
			callback: function(data){
				$scope.contrlSceneCode = $scope.item.contrlSceneCode;
			}
		};
		$scope.isL = true;
		$scope.isb = true;
		$scope.isS = true;
		//上层节点
		if($scope.item.creditNodeTyp == 'B'){
			$scope.isL = false;
			$scope.isb = true;
			$scope.isS = true;
		}else if($scope.item.creditNodeTyp == 'L'){
			$scope.isL = true;
			$scope.isb = false;
			$scope.isS = false;
		}
	});
	//新增节点（整体）
	webApp.controller('quotaNodeAddACtrl', function($scope, $stateParams, jfRest,$timeout,
													$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.isL = true;
		$scope.isb = true;
		$scope.isQ = true;
		$scope.isc = true;
		$scope.isd = true;
		$scope.isCsc = true;
		$scope.isShare = true;
		$scope.isSeq = true;
		$scope.isCheck = true;
		$scope.quotaShow = true;  //基本信息
		$scope.instanQuotaShow = false;//实例化
		//运营模式
		$scope.coArray ={
			type:"dynamic",
			param:{},//默认查询条件
			text:"modeName", //下拉框显示内容，根据需要修改字段名称
			value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"operationMode.query",//数据源调用的action
			callback: function(data){
				$scope.itemAdd.creditTreeId = data[0].creditTreeId;
				$scope.itemAdd.operationModeN = $scope.itemAdd.operationMode;
			}
		};
		$scope.quota = {};
		$scope.quota = $scope.itemAdd;
		$scope.quota.creditTreeId = $scope.itemAdd.creditTreeId;
		$scope.quotaTreeNoInfo = $scope.itemAdd.creditTreeId;
		//自定义下拉框---------节点类型
		$scope.nodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_node",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				console.log(data);
			}
		};
		//自定义下拉框---------额度种类
		$scope.typeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typeOfQuota",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//自定义下拉框---------额度性质
		$scope.natureArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_quotaNature",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//差异化管控场景
		$scope.contrlSceneCodeArray ={
			type:"dynamicDesc",
			param:{
				operationMode:$scope.itemAdd.operationMode,
				differentCode:"",
				independentFlag:'1',
				differentType:'0',
				pageSize:10,
				indexNo:0
			},//默认查询条件
			text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称
			desc:"contrlSceneDesc",
			value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"diffQueryb.query",//数据源调用的action
			callback: function(data){
			}
		};
		var form = layui.form;
		form.on('select(getRiskLimits)',function(event){
			$scope.isc = true;
			$scope.isd = true;
			if($scope.quota.creditNodeTyp == "B"){
				$scope.isL = false;
				$scope.isQ = true;
				$scope.isCsc = true;
				$scope.isShare = true;
				$scope.isSeq = true;
			}
			else{
				$scope.isQ = false;
				$scope.isL = true;
				$scope.isc = false;
				$scope.isd = false;
				$scope.isCsc = false;
				$scope.isShare = false;
				$scope.isSeq = false;
				$scope.quota.creditCategory = "";       // 额度种类
				$scope.quota.creditProperty = "";         //  额度性质
			}
		});
		//实例化保存
		$scope.quotaInfoAdd = {};
		$scope.quotaInfoAdd.message = [];
		$scope.saveQuoInstan = function(result){
			$scope.quotaInfo = $.parseJSON(JSON.stringify($scope.quota));
			$scope.quotaInfo.operationMode = $scope.itemAdd.operationModeN;
			$scope.quotaInfo.creditTreeId = $scope.itemAdd.creditTreeId;
			if($scope.quotaInfo.creditNodeTyp == "B"){
				if(($scope.quotaInfo.creditProperty == "" ||  $scope.quotaInfo.creditProperty == undefined) ||
					($scope.quotaInfo.creditCategory == "" ||  $scope.quotaInfo.creditCategory == undefined)){
					jfLayer.fail(T.T('SQJ2000018'));
				}
				else{
					$scope.quotaInfoAdd.authDataSynFlag = "1";
					delete $scope.quotaInfo['creditComputeMode'];
					$scope.quotaInfoAdd.message = [];
					$scope.quotaInfoAdd.message.push($scope.quotaInfo);
					/* jfRest.request('quotatree', 'save', $scope.quotaInfoAdd).then(function(data) {
      	                if (data.returnCode == '000000') {
      	                	jfLayer.success(T.T('F00058'));*/
					$scope.quataInstanse = $scope.quotaInfoAdd;
					$scope.quotaInfoAdd = {};
					$scope.safeApply();
					$scope.nextInstanQuota();
					/*   }
                      else{
                          jfLayer.fail(T.T('F00059') +data.returnMsg );
                          $scope.quotaInfoAdd.message = [];
                      }
                  });*/
				}
			}
			else{
				if($scope.quotaInfo.creditComputeMode == "" ||  $scope.quotaInfo.creditComputeMode == undefined){
					jfLayer.fail(T.T('SQJ2000019'));
				}else{r;
					$scope.quotaInfoAdd.authDataSynFlag = "1";
					$scope.quotaInfoAdd.message = [];
					$scope.quotaInfoAdd.message.push($scope.quotaInfo);
					$scope.quataInstanse = $scope.quotaInfoAdd;
					$scope.quotaInfoAdd = {};
					$scope.safeApply();
					$scope.nextInstanQuota();
				}
			}
		};
		//******************额度节点实例化start********************
		$scope.instanQuotaShow = false;
		//进入额度节点实例化
		$scope.nextInstanQuota = function (){
			$scope.instanQuotaShow = true;//显示实例化
			$scope.quotaShow = false;
			$scope.queryMODP.params.instanCode=$scope.quataInstanse.message[0].creditNodeNo;
			$scope.queryMODP.params.operationMode=$scope.quataInstanse.message[0].operationMode;
			$scope.queryMODP.operationMode =$scope.quataInstanse.message[0].operationMode;
			$scope.queryMODP.search();
		};
		//查询产品实例构件
		$scope.queryMODP = {
			params : $scope.queryParam = {
				instanDimen1 : "LMND"
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			autoQuery :true,
			resource : 'artifactExample.querySelectArtifact',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//产品实例化时，点击替换参数的方法
		$scope.updateSelectA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
				title : T.T('F00138'),   //'选择替换参数项',
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.choseSelectA]
			});
		};
		//产品实例化时，点击设置参数值的方法
		$scope.setSelectA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
				title :  T.T('F00083') +$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc + T.T('F00139'),
				buttons : [ T.T('F00012')],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.choseSelectTwo]
			});
		};
		$scope.choseSelectA = function(result) {
			if (!result.scope.elementNoTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTable.checkedList();
			$scope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			}
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseSelectTwo = function(result) {
			$scope.items = {};
			$scope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		//保存产品实例化
		$scope.saveProInstan = function(){
			for (var i = 0; i < $scope.queryMODP.data.length; i++) {
				if($scope.queryMODP.data[i].pcdList==null && $scope.queryMODP.data[i].pcdInitList!=null){
					$scope.queryMODP.data[i].addPcdFlag = 	"1";
					$scope.queryMODP.data[i].pcdList = $scope.queryMODP.data[i].pcdInitList;
				}
				$scope.queryMODP.data[i].creditNodeNo = $scope.quataInstanse.message[0].creditNodeNo;
				$scope.queryMODP.data[i].operationMode = $scope.quataInstanse.message[0].operationMode;
			}
			$scope.quataInstanse.instanlist = $scope.queryMODP.data;
			$scope.quataInstanse.operationMode = $scope.quataInstanse.message[0].operationMode;
			jfRest.request('artifactExample', 'saveMore', $scope.quataInstanse).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstan = {};
					$scope.queryMODP.data = [];
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		$scope.backBrn = function(){
			$scope.quotaShow = true;
			$scope.instanQuotaShow = false;
		}
		//******************额度节点实例化end********************
	});
});
