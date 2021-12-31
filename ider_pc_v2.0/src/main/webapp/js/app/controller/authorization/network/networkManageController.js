'use strict';
define(function(require) {
	var webApp = require('app');
	// 活动清单
	webApp.controller('nManagementCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $timeout,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/network/i18n_network');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.resultInfoV = false;
		$scope.resultInfoM = false;
		$scope.resultInfoC = false;
		$scope.resultInfoJ = false;
		$scope.cardAssociationsArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData: 'L',//需要移除的数据
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.keyTypeArrayC ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_keyType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.encryptTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_encryptType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.keyTypeArrayM ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_keyType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData: '2',//需要移除的数据
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{
	        	corporationEntityNo:$scope.corporationId,
	        	requestType:1,
	        	resultType:1,
	        	adminFlagLogin:$scope.adminFlagAuth
	        	},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 $scope.functionArray ={};
		$scope.isPassCInfo = false;
		$scope.isPassMInfo = false;
		$scope.isPassJInfo = false;
		//国际组织网络管理
		$scope.selException = function() {
			if($scope.operationMode){
				if($scope.cardAssociations == 'V'){
					$scope.itemV = {};
					$scope.paramV = {
							"authDataSynFlag":'1',
							"authFlag":'0',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelV', $scope.paramV).then(function(data) {
		                if (data.returnCode == '000000') {
		                	if(data.returnData){
		                		$scope.itemV = data.returnData.rows[0];
			                	if($scope.itemV.procStatus == '1'){
			                		$scope.itemV.procStatus = T.T('SQJ2300001');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        rmData: '1',//需要移除的数据
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemV.procStatus == '2'){
			                		$scope.itemV.procStatus = T.T('SQJ2300002');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        rmData: ['2','3','4'],//需要移除的数据
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemV.procStatus == '3'){
			                		$scope.itemV.procStatus = T.T('SQJ2300003');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemV.procStatus == '4'){
			                		$scope.itemV.procStatus = T.T('SQJ2300004');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}
		                	}
		                	$scope.resultInfoV = true;
							$scope.resultInfoM = false;
							$scope.resultInfoC = false;
							$scope.resultInfoJ = false;
							$scope.mdmInfoFormV.$setPristine();
		                }
		            });
				}else if($scope.cardAssociations == 'M'){
					$scope.itemM = {};
					$scope.paramM = {
							"authDataSynFlag":'1',
							"authFlag":'0',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelM', $scope.paramM).then(function(data) {
		                if (data.returnCode == '000000') {
		                	if(data.returnData){
		                		$scope.itemM = data.returnData.rows[0];
			                	if($scope.itemM.procStatus == '1'){
			                		$scope.itemM.procStatus = T.T('SQJ2300001');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        rmData: '1',//需要移除的数据
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemM.procStatus == '2'){
			                		$scope.itemM.procStatus = T.T('SQJ2300002');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        rmData: ['2','3','4'],//需要移除的数据
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemM.procStatus == '3'){
			                		$scope.itemM.procStatus = T.T('SQJ2300003');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemM.procStatus == '4'){
			                		$scope.itemM.procStatus = T.T('SQJ2300004');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}
		                	}
		                	$scope.resultInfoV = false;
							$scope.resultInfoM = true;
							$scope.resultInfoC = false;
							$scope.resultInfoJ = false;
							$scope.mdmInfoFormM.$setPristine();
		                }
		            });
				}else if($scope.cardAssociations == 'C'){
					$scope.itemC = {};
					$scope.paramC = {
							"authDataSynFlag":'1',
							"authFlag":'0',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelC', $scope.paramC).then(function(data) {
		                if (data.returnCode == '000000') {
		                	if(data.returnData){
		                		$scope.itemC = data.returnData.rows[0];
			                	if($scope.itemC.procStatus == '1'){
			                		$scope.itemC.procStatus = T.T('SQJ2300001');
			                		$scope.functionArray ={ 
		                		        type:"dictData", 
		                		        param:{
		                		        	"type":"DROPDOWNBOX",
		                		        	groupsCode:"dic_functionArray",
		                		        	queryFlag: "children"
		                		        },//默认查询条件 
		                		        rmData: '1',//需要移除的数据
		                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		                		        resource:"paramsManage.query",//数据源调用的action 
		                		        callback: function(data){
		                		        	$timeout(function() {
		        								Tansun.plugins.render('select');
		        							});
		                		        }
		                			};
			                	}else if($scope.itemC.procStatus == '2'){
			                		$scope.itemC.procStatus = T.T('SQJ2300002');
			                		$scope.functionArray ={ 
		                		        type:"dictData", 
		                		        param:{
		                		        	"type":"DROPDOWNBOX",
		                		        	groupsCode:"dic_functionArray",
		                		        	queryFlag: "children"
		                		        },//默认查询条件 
		                		        rmData: ['2','3','4'],//需要移除的数据
		                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		                		        resource:"paramsManage.query",//数据源调用的action 
		                		        callback: function(data){
		                		        	$timeout(function() {
		        								Tansun.plugins.render('select');
		        							});
		                		        }
		                			};
			                	}else if($scope.itemC.procStatus == '3'){
			                		$scope.itemC.procStatus = T.T('SQJ2300003');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemC.procStatus == '4'){
			                		$scope.itemC.procStatus = T.T('SQJ2300004');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}
		                	}
		                	$scope.resultInfoV = false;
							$scope.resultInfoM = false;
							$scope.resultInfoC = true;
							$scope.resultInfoJ = false;
							$scope.mdmInfoFormC.$setPristine();
		                }
		            });
				}else if($scope.cardAssociations == 'J'){
					$scope.itemJ = {};
					$scope.paramJ = {
							"authDataSynFlag":'1',
							"authFlag":'0',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelJ', $scope.paramJ).then(function(data) {
		                if (data.returnCode == '000000') {
		                	if(data.returnData){
		                		$scope.itemJ = data.returnData.rows[0];
			                	if($scope.itemJ.procStatus == '1'){
			                		$scope.itemJ.procStatus = T.T('SQJ2300001');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        rmData: '1',//需要移除的数据
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemJ.procStatus == '2'){
			                		$scope.itemJ.procStatus = T.T('SQJ2300002');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        rmData: ['2','3','4'],//需要移除的数据
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemJ.procStatus == '3'){
			                		$scope.itemJ.procStatus = T.T('SQJ2300003');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}else if($scope.itemJ.procStatus == '4'){
			                		$scope.itemJ.procStatus = T.T('SQJ2300004');
			                		$scope.functionArray ={ 
			                		        type:"dictData", 
			                		        param:{
			                		        	"type":"DROPDOWNBOX",
			                		        	groupsCode:"dic_functionArray",
			                		        	queryFlag: "children"
			                		        },//默认查询条件 
			                		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			                		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			                		        resource:"paramsManage.query",//数据源调用的action 
			                		        callback: function(data){
			                		        	$timeout(function() {
			        								Tansun.plugins.render('select');
			        							});
			                		        }
			                			};
			                	}
		                	}
		                	$scope.resultInfoV = false;
							$scope.resultInfoM = false;
							$scope.resultInfoC = false;
							$scope.resultInfoJ = true;
							$scope.mdmInfoFormJ.$setPristine();
		                }
		            });
				}else{
					jfLayer.fail(T.T('SQJ2300005'));
					$scope.resultInfoV = false;
					$scope.resultInfoM = false;
					$scope.resultInfoC = false;
					$scope.resultInfoJ = false;
				}
			}else{
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
				$scope.resultInfoJ = false;
				jfLayer.fail(T.T('SQJ2300010'));  //SQJ2300010  "请选择营运模式！"
			}
		};
		var form = layui.form;
		form.on('select(getInfoCard)',function(){
			if($scope.cardAssociations == "V"){
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
				$scope.resultInfoJ = false;
				$scope.mdmInfoFormV.$setPristine();
				$scope.mdmInfoFormM.$setPristine();
				$scope.mdmInfoFormC.$setPristine();
				$scope.mdmInfoFormJ.$setPristine();
			}
			else{
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
				$scope.resultInfoJ = false;
				$scope.mdmInfoFormV.$setPristine();
				$scope.mdmInfoFormM.$setPristine();
				$scope.mdmInfoFormC.$setPristine();
				$scope.mdmInfoFormJ.$setPristine();
			}
		});
		form.on('select(getTempCStatus)',function(event){
			if($scope.itemC.tempStatus == "4"){
				$scope.isPassCInfo = true;
			}
			else{
				$scope.isPassCInfo = false;
				$scope.itemC.keyType = "";
				$scope.itemC.encryptType = "";
			}
		});
		form.on('select(getTempMStatus)',function(event){
			if($scope.itemM.tempStatus == "4"){
				$scope.isPassMInfo = true;
			}
			else{
				$scope.isPassMInfo = false;
				$scope.itemM.keyType = "";
				$scope.itemM.encryptType = "";
			}
		});
		form.on('select(getTempJStatus)',function(event){
			if($scope.itemJ.tempStatus == "4"){
				$scope.isPassJInfo = true;
			}
			else{
				$scope.isPassJInfo = false;
				$scope.itemJ.keyType = "";
				$scope.itemJ.encryptType = "";
			}
		});
		//关闭
		$scope.closeInfo = function(){
			$scope.resultInfoV = false;
			$scope.resultInfoM = false;
			$scope.resultInfoC = false;
			$scope.resultInfoJ = false;
			$scope.mdmInfoFormV.$setPristine();
			$scope.mdmInfoFormM.$setPristine();
			$scope.mdmInfoFormC.$setPristine();
			$scope.mdmInfoFormJ.$setPristine();
		};
		//维护V
		$scope.updateInfoV = function() {
			$scope.itemUV = {};
			$scope.itemUV.authDataSynFlag = "1";
			$scope.itemUV.authFlag = "1";
			$scope.itemUV.operationMode = $scope.operationMode;
			$scope.itemUV.cardAssociations = $scope.cardAssociations;
			$scope.itemUV.tempStatus = $scope.itemV.tempStatus;
			$scope.itemUV.id = $scope.itemV.id;
			$scope.itemUV._2ssc = 'auth';
			$scope.itemUV._2rt = '001';
           jfRest.request('network', 'updateNetworkV', $scope.itemUV).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('F00099'));
            			$scope.selException();
            			$scope.mdmInfoFormV.$setPristine();
                }
            });
		};
		//维护M
		$scope.updateInfoM = function() {
			$scope.itemUM = {};
			$scope.itemUM.authDataSynFlag = "1";
			$scope.itemUM.authFlag = "1";
			$scope.itemUM.operationMode = $scope.operationMode;
			$scope.itemUM.cardAssociations = $scope.cardAssociations;
			$scope.itemUM.tempStatus = $scope.itemM.tempStatus;
			$scope.itemUM.id = $scope.itemM.id;
			$scope.itemUM._2ssc = 'auth';
			$scope.itemUM._2rt = '001';
			if($scope.itemM.tempStatus == "4"){
				if($scope.itemM.keyType && $scope.itemM.encryptType){
					$scope.itemUM.keyType = $scope.itemM.keyType;
					$scope.itemUM.encryptType = $scope.itemM.encryptType;
					jfRest.request('network', 'updateNetworkM', $scope.itemUM).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00099'));
		            			$scope.selException();
		            			$scope.mdmInfoFormM.$setPristine();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ2300011'));   //"请输入加密类型和加密算法"
				}
			}
			else{
	           jfRest.request('network', 'updateNetworkM', $scope.itemUM).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00099'));
	            			$scope.selException();
	            			$scope.mdmInfoFormM.$setPristine();
	                }
	            });
			}
		};
		//维护J
		$scope.updateInfoJ = function() {
			$scope.itemUJ = {};
			$scope.itemUJ.authDataSynFlag = "1";
			$scope.itemUJ.authFlag = "1";
			$scope.itemUJ.operationMode = $scope.operationMode;
			$scope.itemUJ.cardAssociations = $scope.cardAssociations;
			$scope.itemUJ.tempStatus = $scope.itemJ.tempStatus;
			$scope.itemUJ.id = $scope.itemJ.id;
			$scope.itemUJ._2ssc = 'auth';
			$scope.itemUJ._2rt = '001';
			if($scope.itemJ.tempStatus == "4"){
				if($scope.itemJ.keyType && $scope.itemJ.encryptType){
					$scope.itemUJ.keyType = $scope.itemJ.keyType;
					$scope.itemUJ.encryptType = $scope.itemJ.encryptType;
					jfRest.request('network', 'updateNetworkJ', $scope.itemUJ).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00099'));
		            			$scope.selException();
		            			$scope.mdmInfoFormJ.$setPristine();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ2300011'));
				}
			}
			else{
	           jfRest.request('network', 'updateNetworkJ', $scope.itemUJ).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00099'));
	            			$scope.selException();
	            			$scope.mdmInfoFormJ.$setPristine();
	                }
	            });
			}
		};
		//维护C
		$scope.updateInfoC = function() {
			$scope.itemUC = {};
			$scope.itemUC.authDataSynFlag = "1";
			$scope.itemUC.authFlag = "1";
			$scope.itemUC.operationMode = $scope.operationMode;
			$scope.itemUC.cardAssociations = $scope.cardAssociations;
			$scope.itemUC.tempStatus = $scope.itemC.tempStatus;
			$scope.itemUC.id = $scope.itemC.id;
			$scope.itemUC._2ssc = 'auth';
			$scope.itemUC._2rt = '001';
			if($scope.itemC.tempStatus == "4"){
				if($scope.itemC.keyType && $scope.itemC.encryptType){
					$scope.itemUC.keyType = $scope.itemC.keyType;
					$scope.itemUC.encryptType = $scope.itemC.encryptType;
					jfRest.request('network', 'updateNetworkC', $scope.itemUC).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00099'));
		            			$scope.selException();
		            			$scope.mdmInfoFormC.$setPristine();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ2300011'));
				}
			}
			else{
				jfRest.request('network', 'updateNetworkC', $scope.itemUC).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00099'));
	            			$scope.selException();
	            			$scope.mdmInfoFormC.$setPristine();
	                }
	            });
			}
		};
	});
});
