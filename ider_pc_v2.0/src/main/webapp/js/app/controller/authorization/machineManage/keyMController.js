'use strict';
define(function(require) {
	var webApp = require('app');
	// 密钥管理
	webApp.controller('keyMCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/machineManage/i18n_encryption');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.recordTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cipherType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
		$scope.isShow = false;
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
		 $scope.addBtnFlag = false;
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
	   	   			if($scope.eventList.search('AUS.PM.20.0101') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.20.0102') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.20.0103') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
			//密钥管理列表查询
			$scope.itemList = {
				params : $scope.queryParam = {
						"authDataSynFlag":"1",
						"operationMode":$scope.operationMode,
						"keyType":$scope.keyType,
						"keyId":$scope.keyId,
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : false,
				resource : 'keymanage.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询事件
		$scope.selectList = function(event) {
			if($scope.operationMode){
				$scope.isShow = true;
				$scope.itemList.params.operationMode = $scope.operationMode;
				$scope.itemList.params.keyType = $scope.keyType;
				$scope.itemList.params.keyId = $scope.keyId;
				$scope.itemList.search();
			}else{
				$scope.isShow = false;
				jfLayer.fail(T.T('SQJ3000001'));
			}
		};
		//新增事件
		$scope.addKey = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/machineManage/keyAdd.html', '', {
				title : T.T('SQH3000013'),//'密钥参数新增',
				buttons : [T.T('F00031'),T.T('F00012')],//[ '保存','关闭'],
				size : [ '950px', '520px' ],
				callbacks : [$scope.savekey ]
			});
		};
    	// 保存信息事件
		$scope.savekey = function(result) {
			$scope.keyAdd = $.parseJSON(JSON.stringify(result.scope.keyadd));
			$scope.keyAdd.operationMode = result.scope.operationModeAdd;
			if(result.scope.operationModeAdd){
				if($scope.keyAdd.logIsoMsgInd){
		 			if($scope.keyAdd.logIsoMsgInd == "X"){
		 				if($scope.keyAdd.keyDouble){
		 					jfRest.request('keymanage','save', $scope.keyAdd).then(function(data) {
		 		                if (data.returnMsg == 'OK') {
		 		                	jfLayer.success(T.T('F00058'));
		 		                	$scope.safeApply();
		 			    			result.cancel();
		 			    			$scope.keyAdd = {};
		 			    			$scope.selectList();
		 		                }
		 		            });
		 				}else{
		 					jfLayer.alert(T.T('SQH3000014'));   //"请输入密钥值2 的值");
		 				}
		 			}else if($scope.keyAdd.logIsoMsgInd == "Y"){
		 				if($scope.keyAdd.keyDouble && $scope.keyAdd.keyTriple){
		 					jfRest.request('keymanage','save', $scope.keyAdd).then(function(data) {
		 		                if (data.returnMsg == 'OK') {
		 		                	jfLayer.success(T.T('F00058'));
		 		                	$scope.safeApply();
		 			    			result.cancel();
		 			    			$scope.keyAdd = {};
		 			    			$scope.selectList();
		 		                }
		 		            });
		 				}else{
		 					jfLayer.alert(T.T('SQH3000015'));  //"请输入密钥值2和密钥值3 的值");
		 				}
		 			}else{
		 				jfRest.request('keymanage','save', $scope.keyAdd).then(function(data) {
		 	                if (data.returnMsg == 'OK') {
		 	                	jfLayer.success(T.T('F00058'));
		 	                	$scope.safeApply();
		 		    			result.cancel();
		 		    			$scope.keyAdd = {};
		 		    			$scope.selectList();
		 	                }
		 	            });
		 			}
		 		}else{
		 			jfLayer.alert(T.T('SQJ3000003'));
		 		}
			}else{
				jfLayer.fail(T.T('SQJ3000001'));
			}
		};
		//查询详情事件
		$scope.selInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemInfo = {};
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/machineManage/keyInfo.html', $scope.itemInfo, {
				title : T.T('SQH3000016'),     //'查询详细信息',
				buttons : [T.T('F00012')],
				size : [ '950px', '520px' ],
				callbacks : [ ]
			});
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/machineManage/keyUpdate.html', $scope.itemUpdate, {
				title : T.T('F00087'),   //'维护信息',
				buttons : [T.T('F00031'),T.T('F00012')],//['保存','关闭'],
				size : [ '880px', '580px' ],
				callbacks : [$scope.updateKey]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.updateKey = function(result) {
	 		$scope.itemUpdate.authDataSynFlag = "1";
	 		$scope.itemUpdate.operationMode = result.scope.operationModeInfo;
	 		$scope.itemUpdate.keyType = result.scope.keyTypeU;
	 		$scope.itemUpdate.logIsoMsgInd = result.scope.logIsoMsgIndU;
	 		$scope.itemUpdate.algorithmType = result.scope.algorithmTypeU;
	 		delete $scope.itemUpdate['invalidFlag'];
	 		if($scope.itemUpdate.logIsoMsgInd){
	 			if($scope.itemUpdate.logIsoMsgInd == "X"){
	 				if($scope.itemUpdate.keyDouble){
	 					jfRest.request('keymanage', 'update', $scope.itemUpdate).then(function(data) {
	 						if (data.returnMsg == 'OK') {
	 							jfLayer.success(T.T('F00022'));  //);
	 							$scope.itemUpdate = {};
	 							$scope.safeApply();
	 							result.cancel();
	 							$scope.selectList();
	 						}
	 					});
	 				}else{
	 					jfLayer.alert(T.T('SQH3000014'));
	 				}
	 			}else if($scope.itemUpdate.logIsoMsgInd == "Y"){
	 				if($scope.itemUpdate.keyDouble && $scope.itemUpdate.keyTriple){
	 					jfRest.request('keymanage', 'update', $scope.itemUpdate).then(function(data) {
	 						if (data.returnMsg == 'OK') {
	 							jfLayer.success(T.T('F00022'));  //);
	 							$scope.itemUpdate = {};
	 							$scope.safeApply();
	 							result.cancel();
	 							$scope.selectList();
	 						}
	 						else{
	 		                	jfLayer.fail(T.T('F00023') + data.returnMsg + "(" + data.returnCode + ")");
	 		                }
	 					});
	 				}else{
	 					jfLayer.alert(T.T('SQH3000015'));  //"请输入密钥值2和密钥值3 的值");
	 				}
	 			}else{
	 				jfRest.request('keymanage', 'update', $scope.itemUpdate).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.success(T.T('F00022'));  //"修改成功");
							$scope.itemUpdate = {};
							$scope.safeApply();
							result.cancel();
							$scope.selectList();
						}
					});
	 			}
	 		}else{
	 			jfLayer.alert(T.T('SQJ3000003'));
	 		}
		};
		//删除事件
		$scope.delInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemInfo = {};
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/machineManage/keyDel.html', $scope.itemInfo, {
				title : T.T('F00093'),  //'删除确认信息',
				buttons : [T.T('F00094'),T.T('F00046')],
				size : [ '800px', '400px' ],
				callbacks : [$scope.delList]
			});
		};
		//删除
	 	$scope.delList = function(result){
			jfLayer.confirm(T.T('F00092'),function() {
		 		$scope.itemInfo.authDataSynFlag = "1";
		 		$scope.itemInfo.invalidFlag = "1";
				jfRest.request('keymanage', 'update', $scope.itemInfo).then(function(data) {
					if (data.returnMsg == 'OK') {
						$scope.itemInfo = {};
						jfLayer.success(T.T('F00037'));
						$scope.safeApply();
						result.cancel();
						$scope.selectList();
					}
				});
			},function() {
			});
	 	};
	});
	// 新增
	webApp.controller('keyAddCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.recordTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cipherType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
		$scope.algorithmTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_algorithmType",
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
	        	$scope.operationModeFlag = data[0].operationMode;
	        }
	    };
		 $scope.isOneType = true;
		 $scope.isTwoType = false;
		 $scope.isThreeType = false;
		 $scope.istwoValue = false;
		 $scope.istreeValue = false;
		 $scope.threeArray ={};
		 var form = layui.form;
			form.on('select(getTypeValue)',function(event){
				if($scope.keyadd.keyType == "CVK"){
					 $scope.istwoValue = false;
					 $scope.istreeValue = false;
					 $scope.threeArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_lengthType",
				        	queryFlag: "children"
				        },//默认查询条件 
				        rmData: 'Y',//需要移除的数据
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$timeout(function() {
								Tansun.plugins.render('select');
							});
				        }
					};
					 $scope.keyadd.logIsoMsgInd = "";
					 $scope.keyadd.keySingle = "";
					 $scope.keyadd.keyDouble = "";
					 $scope.keyadd.keyTriple = "";
				}
				else if($scope.keyadd.keyType == "IMK" || $scope.keyadd.keyType == "MAC"){
					 $scope.threeArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_lengthType",
				        	queryFlag: "children"
				        },//默认查询条件 
				        rmData: ['K','Y'],//需要移除的数据
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$timeout(function() {
								Tansun.plugins.render('select');
							});
				        }
					};
					 $scope.istwoValue = false;
					 $scope.istreeValue = false;
					 $scope.keyadd.logIsoMsgInd = "";
					 $scope.keyadd.keySingle = "";
					 $scope.keyadd.keyDouble = "";
					 $scope.keyadd.keyTriple = "";
				}else{
					$scope.threeArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_lengthType",
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
					 $scope.istwoValue = false;
					 $scope.istreeValue = false;
					 $scope.keyadd.logIsoMsgInd = "";
					 $scope.keyadd.keySingle = "";
					 $scope.keyadd.keyDouble = "";
					 $scope.keyadd.keyTriple = "";
				}
			});
			form.on('select(getTypethree)',function(event){
				if($scope.keyadd.logIsoMsgInd == "X"){
					$scope.istwoValue = true;
					$scope.istreeValue = false;
					 $scope.keyadd.keyTriple = "";
				}else if($scope.keyadd.logIsoMsgInd == "K"){
					$scope.istwoValue = false;
					$scope.istreeValue = false;
					$scope.keyadd.keyDouble = "";
					 $scope.keyadd.keyTriple = "";
				}else if($scope.keyadd.logIsoMsgInd == "Y"){
					$scope.istwoValue = true;
					$scope.istreeValue = true;
				}else{
					jfLayer.alert(T.T('SQJ3000003'));
				}
			});
	});
	// 详情
	webApp.controller('keyInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.recordTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cipherType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.keyTypeInfo = $scope.itemInfo.keyType;
		        }
			};
		$scope.threeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_lengthType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logIsoMsgIndInfo = $scope.itemInfo.logIsoMsgInd;
	        }
		};
		$scope.algorithmTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_algorithmType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.algorithmTypeInfo = $scope.itemInfo.algorithmType;
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
	        	$scope.operationModeInfo = $scope.itemInfo.operationMode;
	        }
	    };
		if($scope.itemInfo.logIsoMsgInd == "X"){
			$scope.istwoValue = true;
			$scope.istreeValue = false;
		}else if($scope.itemInfo.logIsoMsgInd == "K"){
			$scope.istwoValue = false;
			$scope.istreeValue = false;
		}else if($scope.itemInfo.logIsoMsgInd == "Y"){
			$scope.istwoValue = true;
			$scope.istreeValue = true;
		}
	});
	// 修改
	webApp.controller('keyUpdateCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.recordTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cipherType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.keyTypeU = $scope.itemUpdate.keyType;
		        }
			};
		$scope.threeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_lengthType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.logIsoMsgIndU = $scope.itemUpdate.logIsoMsgInd;
		        }
			};
		$scope.algorithmTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_algorithmType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.algorithmTypeU = $scope.itemUpdate.algorithmType;
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
	        	$scope.operationModeInfo = $scope.itemUpdate.operationMode;
	        }
	    };
		 $scope.istwoValuep = false;
		 $scope.istreeValuep = false;
		 	if($scope.itemUpdate.logIsoMsgInd == "X"){
				$scope.istwoValuep = true;
				$scope.istreeValuep = false;
			}else if($scope.itemUpdate.logIsoMsgInd == "K"){
				$scope.istwoValuep = false;
				$scope.istreeValuep = false;
			}else if($scope.itemUpdate.logIsoMsgInd == "Y"){
				$scope.istwoValuep = true;
				$scope.istreeValuep = true;
			}
		 var form = layui.form;
			form.on('select(getTypethree)',function(event){
				if(event.value == "X"){
					$scope.istwoValuep = true;
					$scope.istreeValuep = false;
					 $scope.itemUpdate.keyTriple = "";
				}else if(event.value == "K"){
					$scope.istwoValuep = false;
					$scope.istreeValuep = false;
					$scope.itemUpdate.keyDouble = "";
					 $scope.itemUpdate.keyTriple = "";
				}else if(event.value == "Y"){
					$scope.istwoValuep = true;
					$scope.istreeValuep = true;
				}else{
					jfLayer.alert(T.T('SQJ3000003'));
				}
			});
	});
});
