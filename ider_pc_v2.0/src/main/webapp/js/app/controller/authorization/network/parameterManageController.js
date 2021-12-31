'use strict';
define(function(require) {
	var webApp = require('app');
	// 活动清单
	webApp.controller('pManagementCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $timeout,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/network/i18n_parameterManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.resultInfoV = false;
		$scope.resultInfoM = false;
		$scope.resultInfoC = false;
		$scope.cardAssociationsArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData: ['L'],//需要移除的数据
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.macCUPArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_macProcess",
		        	queryFlag: "children"
		        },//默认查询条件 
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
		 $scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
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
		   	   		if($scope.eventList.search('AUS.PM.10.0002') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.10.0102') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.10.0202') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.10.0003') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.10.0103') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
				   	if($scope.eventList.search('AUS.PM.10.0203') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
		//国际组织参数管理
		$scope.selException = function() {
			if($scope.operationMode){
				if($scope.cardAssociations == 'V'){
					$scope.itemV = {};
					$scope.paramV = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
						 jfRest.request('network', 'parameterSelV', $scope.paramV).then(function(data) {
			                if (data.returnCode == '000000') { 
			                	if(data.returnData){
			                		$scope.itemV = data.returnData.rows[0];
				                	if($scope.itemV.logIsoMsgInd == 'Y'){
				                		$scope.logIsoMsgIndInfov = T.T('SQJ2900021');   //保存
				                	}else if($scope.itemV.logIsoMsgInd == 'N'){
				                		$scope.logIsoMsgIndInfov = T.T('SQJ2900022');   //'不保存';   
				                	}
				                	if($scope.itemV.referralRespIn == 'Y'){
				                		$scope.referralRespInInfoV = T.T('SQJ2900023');   //'支持';
				                	}else if($scope.itemV.referralRespIn == 'N'){
				                		$scope.referralRespInInfoV = T.T('SQJ2900024');   //'不支持';
				                	}
				                	if($scope.itemV.cavvOpt == '0'){
				                		$scope.cavvOptInfoV = T.T('SQJ2900025');   //'不支持验证';
				                	}else if($scope.itemV.cavvOpt == '1'){
				                		$scope.cavvOptInfoV = T.T('SQJ2900026');   //'支持VISA验证';
				                	}else if($scope.itemV.cavvOpt == '2'){
				                		$scope.cavvOptInfoV = T.T('SQJ2900027');   //'发卡行验证';
				                	}
				                	if($scope.itemV.avsSupportInd == 'Y'){
				                		$scope.avsSupportIndInfoV = T.T('SQJ2900023');   //'支持';
				                	}else if($scope.itemV.avsSupportInd == 'N'){
				                		$scope.avsSupportIndInfoV = T.T('SQJ2900024');   //'不支持';
				                	}
			                	}
			                	$scope.resultInfoV = true;
			    				$scope.resultInfoM = false;
			    				$scope.resultInfoC = false;
			                }
			            });
				}else if($scope.cardAssociations == 'J'){
					$scope.itemV = {};
					$scope.paramV = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
						 jfRest.request('network', 'parameterSelJ', $scope.paramV).then(function(data) {
			                if (data.returnCode == '000000') { 
			                	if(data.returnData){
			                		$scope.itemV = data.returnData.rows[0];
				                	if($scope.itemV.logIsoMsgInd == 'Y'){
				                		$scope.logIsoMsgIndInfov = T.T('SQJ2900021');   //保存
				                	}else if($scope.itemV.logIsoMsgInd == 'N'){
				                		$scope.logIsoMsgIndInfov = T.T('SQJ2900022');   //'不保存';   
				                	}
				                	if($scope.itemV.referralRespIn == 'Y'){
				                		$scope.referralRespInInfoV = T.T('SQJ2900023');   //'支持';
				                	}else if($scope.itemV.referralRespIn == 'N'){
				                		$scope.referralRespInInfoV = T.T('SQJ2900024');   //'不支持';
				                	}
				                	if($scope.itemV.cavvOpt == '0'){
				                		$scope.cavvOptInfoV = T.T('SQJ2900025');   //'不支持验证';
				                	}else if($scope.itemV.cavvOpt == '1'){
				                		$scope.cavvOptInfoV = T.T('SQJ2900026');   //'支持VISA验证';
				                	}else if($scope.itemV.cavvOpt == '2'){
				                		$scope.cavvOptInfoV = T.T('SQJ2900027');   //'发卡行验证';
				                	}
				                	if($scope.itemV.avsSupportInd == 'Y'){
				                		$scope.avsSupportIndInfoV = T.T('SQJ2900023');   //'支持';
				                	}else if($scope.itemV.avsSupportInd == 'N'){
				                		$scope.avsSupportIndInfoV = T.T('SQJ2900024');   //'不支持';
				                	}
			                	}
			                	$scope.resultInfoV = true;
			    				$scope.resultInfoM = false;
			    				$scope.resultInfoC = false;
			                }
			            });
				}else if($scope.cardAssociations == 'M'){
					$scope.itemM = {};
					$scope.paramM = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
						 jfRest.request('network', 'parameterSelM', $scope.paramM).then(function(data) {
			                if (data.returnCode == '000000') {
			                	if(data.returnData){
			                		$scope.itemM = data.returnData.rows[0];
				                	if($scope.itemM.logIsoMsgInd == 'Y'){
				                		$scope.logIsoMsgIndInfoM = T.T('SQJ2900021');   //'保存';
				                	}else if($scope.itemM.logIsoMsgInd == 'N'){
				                		$scope.logIsoMsgIndInfoM = T.T('SQJ2900022');   //'不保存';
				                	}
				                	if($scope.itemM.referralRespIn == 'Y'){
				                		$scope.referralRespInInfoM = T.T('SQJ2900023');   //'支持';
				                	}else if($scope.itemM.referralRespIn == 'N'){
				                		$scope.referralRespInInfoM = T.T('SQJ2900024');   //'不支持';
				                	}
				                	if($scope.itemM.avsSupportInd == '0'){
				                		$scope.avsSupportIndInfoM = T.T('SQJ2900025');   //'不支持验证';
				                	}else if($scope.itemM.avsSupportInd == '1'){
				                		$scope.avsSupportIndInfoM = T.T('SQJ2900028');   //'验证完整信息';
				                	}else if($scope.itemM.avsSupportInd == '2'){
				                		$scope.avsSupportIndInfoM = T.T('SQJ2900029');   //'验证前5位地址(全数字)';
				                	}else if($scope.itemM.avsSupportInd == '3'){
				                		$scope.avsSupportIndInfoM = T.T('SQJ2900030');   //'验证首字符前5位地址(全数字)';
				                	}else if($scope.itemM.avsSupportInd == '4'){
				                		$scope.avsSupportIndInfoM = T.T('SQJ2900031');   //'验证前5位邮编(全数字)';
				                	}
			                	}
			                	$scope.resultInfoV = false;
								$scope.resultInfoM = true;
								$scope.resultInfoC = false;
			                }
			            });
				}else if($scope.cardAssociations == 'C'){
					$scope.itemC = {};
					$scope.paramC = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
						 jfRest.request('network', 'parameterSelC', $scope.paramC).then(function(data) {
							 $scope.isMac = false;
							 $scope.iscipherMac = false;
			                if (data.returnCode == '000000') {
			                	if(data.returnData){
			                		$scope.itemC = data.returnData.rows[0];
				                	if($scope.itemC.logIsoMsgInd == 'Y'){
				                		$scope.logIsoMsgIndInfoC = T.T('SQJ2900021');   //'保存';
				                	}else if($scope.itemC.logIsoMsgInd == 'N'){
				                		$scope.logIsoMsgIndInfoC = T.T('SQJ2900022');   //'不保存';
				                	}
				            		if($scope.itemC.tranMacProcessInd == "Y"){
				            			$scope.isMac = true;
				            			$scope.tranMacProcessIndInfoC = T.T('F00028');   //'是';
				            		}
				            		else if($scope.itemC.tranMacProcessInd == 'N'){
				            			$scope.isMac = false;
				            			$scope.tranMacProcessIndInfoC = T.T('F00029');   //'否';
				            		}
				            		if($scope.itemC.cipherMacProcessInd == "Y"){
				            			$scope.iscipherMac = true;
				            			$scope.cipherMacProcessIndInfoC = T.T('F00028');   //'是';
				            		}
				            		else if($scope.itemC.cipherMacProcessInd == 'N'){
				            			$scope.iscipherMac = false;
				            			$scope.cipherMacProcessIndInfoC = T.T('F00029');   //'否';
				            		}
			                	}
			                	$scope.resultInfoV = false;
								$scope.resultInfoM = false;
								$scope.resultInfoC = true;
			                }
			            });
				}else{
					jfLayer.fail(T.T('SQJ2900032'));   //"请输入卡组织标识");
					$scope.resultInfoV = false;
					$scope.resultInfoM = false;
					$scope.resultInfoC = false;
				}
			}else{
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
				jfLayer.fail(T.T('SQJ2900033'));   //"请选择营运模式！");
			}
		};
		var form = layui.form;
		form.on('select(getInfoCard)',function(){
			if($scope.cardAssociations == "V"){
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
			}
			else{
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
			}
		});
		//关闭
		$scope.closeInfo = function(){
			$scope.resultInfoV = false;
			$scope.resultInfoM = false;
			$scope.resultInfoC = false;
		};
		//维护
		$scope.updateException = function() {
			if($scope.operationMode){
				if($scope.cardAssociations == 'V'){
					$scope.itemUV = {};
					$scope.paramUV = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelV', $scope.paramUV).then(function(data) {
			                if (data.returnCode == '000000') {
			                	$scope.itemUV = data.returnData.rows[0];
								// 页面弹出框事件(弹出页面)
								$scope.modal('/authorization/network/parameterManageV.html', $scope.itemUV, {
									title : T.T('SQJ2900034'),//'维护VISA参数',
									buttons : [ T.T('F00125'),T.T('F00046')],    //'确认', '取消' 
									size : [ '1100px', '390px' ],
									callbacks : [$scope. saveInfoV]
								});
			                }
			            });
				}else if($scope.cardAssociations == 'J'){
					$scope.itemUV = {};
					$scope.paramUV = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelJ', $scope.paramUV).then(function(data) {
			                if (data.returnCode == '000000') {
			                	$scope.itemUV = data.returnData.rows[0];
								// 页面弹出框事件(弹出页面)
								$scope.modal('/authorization/network/parameterManageV.html', $scope.itemUV, {
									title : T.T('SQJ2900034'),//'维护VISA参数',
									buttons : [ T.T('F00125'),T.T('F00046')],    //'确认', '取消' 
									size : [ '1100px', '390px' ],
									callbacks : [$scope. saveInfoJ]
								});
			                }
			            });
				}else if($scope.cardAssociations == 'M'){
					$scope.itemUM = {};
					$scope.paramUM = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelM', $scope.paramUM).then(function(data) {
			                if (data.returnCode == '000000') {
			                	$scope.itemUM = data.returnData.rows[0];
			                	// 页面弹出框事件(弹出页面)
								$scope.modal('/authorization/network/parameterManageM.html', $scope.itemUM, {
									title : T.T('SQJ2900035'),//    '维护MC参数',
									buttons :[ T.T('F00125'),T.T('F00046')],    //'确认', '取消' 
									size : [ '1100px', '400px' ],
									callbacks : [$scope. saveInfoM]
								});
			                }
			            });
				}else if($scope.cardAssociations == 'C'){
					$scope.itemUC = {};
					$scope.paramUC = {
							"authDataSynFlag":'1',
							"operationMode":$scope.operationMode,
							"cardAssociations":$scope.cardAssociations
						};
					 jfRest.request('network', 'parameterSelC', $scope.paramUC).then(function(data) {
			                if (data.returnCode == '000000') {
			                	$scope.itemUC = data.returnData.rows[0];
			                	// 页面弹出框事件(弹出页面)
								$scope.modal('/authorization/network/parameterManageC.html', $scope.itemUC, {
									title : T.T('SQJ2900036'),//    '维护CUP参数',
									buttons : [ T.T('F00125'),T.T('F00046')],    //'确认', '取消' 
									size : [ '1100px', '580px' ],
									callbacks : [$scope. saveInfoC]
								});
			                }
			            });
				}else{
					jfLayer.fail(T.T('SQJ2900037'));   //"请输入卡组织标识进行维护");  
					$scope.resultInfoV = false;
					$scope.resultInfoM = false;
					$scope.resultInfoC = false;
				}
			}else{
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
				$scope.resultInfoC = false;
				jfLayer.fail(T.T('SQJ2900038'));   //"请选择营运模式进行维护！");
			}
		};
		//维护V
		$scope.saveInfoV = function(result) {
			console.log(result);
			$scope.itemUVInfo = {};
			$scope.itemUVInfo = $.parseJSON(JSON.stringify(result.scope.itemUV));
			$scope.itemUVInfo.authDataSynFlag = "1";
			$scope.itemUVInfo.cavvOpt = result.scope.cavvOptU;
			$scope.itemUVInfo.avsSupportInd = result.scope.avsSupportIndU;
			$scope.itemUVInfo.referralRespIn = result.scope.referralRespInU;
			$scope.itemUVInfo.logIsoMsgInd = result.scope.logIsoMsgIndU;
           jfRest.request('network', 'parameterUpdateV', $scope.itemUVInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('F00089'));   //"维护成功");
                		$scope.safeApply();
            			result.cancel();
            			$scope.selException();
                }
            });
		};
		//维护M
		$scope.saveInfoM = function(result) {
			$scope.itemUMInfo = {};
			$scope.itemUMInfo = $.parseJSON(JSON.stringify(result.scope.itemUM));
			$scope.itemUMInfo.authDataSynFlag = "1";
			$scope.itemUMInfo.avsSupportInd = result.scope.avsSupportIndU;
			$scope.itemUMInfo.logIsoMsgInd = result.scope.logIsoMsgIndU;
			$scope.itemUMInfo.referralRespIn = result.scope.referralRespInU;
           jfRest.request('network', 'parameterUpdateM', $scope.itemUMInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('F00089'));   //"维护成功");
                		$scope.safeApply();
            			result.cancel();
            			$scope.selException();
                }
            });
		};
		//维护J
		$scope.saveInfoJ = function(result) {
			$scope.itemUVInfo = {};
			$scope.itemUVInfo = $.parseJSON(JSON.stringify(result.scope.itemUV));
			$scope.itemUVInfo.authDataSynFlag = "1";
			$scope.itemUVInfo.cavvOpt = result.scope.cavvOptU;
			$scope.itemUVInfo.avsSupportInd = result.scope.avsSupportIndU;
			$scope.itemUVInfo.referralRespIn = result.scope.referralRespInU;
			$scope.itemUVInfo.logIsoMsgInd = result.scope.logIsoMsgIndU;
           jfRest.request('network', 'parameterUpdateJ', $scope.itemUVInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('F00089'));   //"维护成功");
                		$scope.safeApply();
            			result.cancel();
            			$scope.selException();
                }
            });
		};
		//维护C
		$scope.saveInfoC = function(result) {
			$scope.itemUCInfo = {};
			$scope.itemUCInfo = $.parseJSON(JSON.stringify(result.scope.itemUC));
			$scope.itemUCInfo.authDataSynFlag = "1";
			$scope.itemUCInfo.cipherMacProcessField = result.scope.cipherMacProcessFieldU;
			$scope.itemUCInfo.tranMacProcessField = result.scope.tranMacProcessFieldU;
			$scope.itemUCInfo.cipherMacProcessInd = result.scope.cipherMacProcessIndU;
			$scope.itemUCInfo.tranMacProcessInd = result.scope.tranMacProcessIndU;
			$scope.itemUCInfo.logIsoMsgInd = result.scope.logIsoMsgIndU;
           jfRest.request('network', 'parameterUpdateC', $scope.itemUCInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('F00089'));   //"维护成功");
                		$scope.safeApply();
            			result.cancel();
            			$scope.selException();
                }
            });
		};
	});
	webApp.controller('pManagementCtrlV', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.saveArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_saveType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.logIsoMsgIndU = $scope.itemUV.logIsoMsgInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.supportArray01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_standByType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.referralRespInU = $scope.itemUV.referralRespIn;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.supportArray02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_standByType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.avsSupportIndU = $scope.itemUV.avsSupportInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.cavvArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cavvType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.cavvOptU = $scope.itemUV.cavvOpt;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
	});
	webApp.controller('pManagementCtrlM', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.saveArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_saveType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.logIsoMsgIndU = $scope.itemUM.logIsoMsgInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.supportArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_standByType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.referralRespInU = $scope.itemUM.referralRespIn;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.avsArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_avsType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.avsSupportIndU = $scope.itemUM.avsSupportInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
	});
	webApp.controller('pManagementCtrlC', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.saveArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_saveType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.logIsoMsgIndU = $scope.itemUC.logIsoMsgInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.ecommFieldArray01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.tranMacProcessIndU = $scope.itemUC.tranMacProcessInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.ecommFieldArray02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.cipherMacProcessIndU = $scope.itemUC.cipherMacProcessInd;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.macEFArray01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_macProcess",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.tranMacProcessFieldU = $scope.itemUC.tranMacProcessField;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.macEFArray02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_macProcess",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.cipherMacProcessFieldU = $scope.itemUC.cipherMacProcessField;
		        	$timeout(function() {
						Tansun.plugins.render('select');
					});
		        }
			};
		$scope.isMac = false;
		$scope.iscipherMac = false;
		if($scope.itemUC.tranMacProcessInd == "Y"){
			$scope.isMac = true;
		}
		else{
			$scope.isMac = false;
		}
		if($scope.itemUC.cipherMacProcessInd == "Y"){
			$scope.iscipherMac = true;
		}
		else{
			$scope.iscipherMac = false;
		}
		var form = layui.form;
		form.on('select(getMACid)',function(){
			if($scope.itemUC.tranMacProcessInd == "Y"){
				$scope.isMac = true;
			}
			else{
				$scope.isMac = false;
				$scope.itemUC.tranMacProcessField = "";
			}
		});
		var form = layui.form;
		form.on('select(getiscipherId)',function(){
			if($scope.itemUC.cipherMacProcessInd == "Y"){
				$scope.iscipherMac = true;
			}
			else{
				$scope.iscipherMac = false;
				$scope.itemUC.cipherMacProcessField = "";
			}
		});
	});
});
