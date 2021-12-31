'use strict';
define(function(require) {
	var webApp = require('app');
	// 加密机参数管理
	webApp.controller('encryptionMCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/machineManage/i18n_encryption');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
		$scope.cipherTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cipherType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData: 'L',//需要移除的数据
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
	   	   			if($scope.eventList.search('AUS.PM.20.0001') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.20.0002') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.20.0003') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
			//加密机参数列表查询
			$scope.itemList = {
					params : $scope.queryParam = {
							"authDataSynFlag":"1",
							"operationMode":$scope.operationMode,
							"recordType":$scope.recordType,
							"pageSize":10,
							"indexNo":0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					autoQuery : false,
					resource : 'encryption.query',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
					}
				};
		//查询事件
		$scope.selectList = function(event) {
			if($scope.operationMode){
				$scope.isShow = true;
				$scope.itemList.params.operationMode = $scope.operationMode;
				$scope.itemList.params.cardAssociations = $scope.cardAssociations;
				$scope.itemList.params.cipherType = $scope.cipherType;
				$scope.itemList.search();
			}else{
				$scope.isShow = false;
				jfLayer.fail(T.T('SQJ3000001'));   //"请选择营运模式！"
			}
		};
		//新增事件
		$scope.addEncryption = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/machineManage/encryptionAdd.html', '', {
				title : T.T('SQJ3000002'),   //'加密机参数新增'
				buttons : [ T.T('F00031'),T.T('F00012')],    //'保存','关闭'
				size : [ '880px', '380px' ],
				callbacks : [$scope.saveEncryption ]
			});
		};
    	// 保存信息事件
		$scope.saveEncryption = function(result) {
			$scope.encryAdd = {};
			$scope.encryAdd = $.parseJSON(JSON.stringify(result.scope.encry));
	 		$scope.encryAdd.authDataSynFlag = "1";
 			$scope.encryAdd.operationMode = result.scope.operationModeAdd;
 			jfRest.request('encryption','save', $scope.encryAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));  //建立成功
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.encryAdd = {};
	    			$scope.selectList();
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/machineManage/encryptionUpdate.html', $scope.itemUpdate, {
				title : T.T('F00087'),   //'维护信息'
				buttons : [ T.T('F00031'),T.T('F00012')],    //'保存','关闭'
				size : [ '880px', '380px' ],
				callbacks : [$scope.updateEncryption]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.updateEncryption = function(result) {
	 		$scope.itemUpdate.authDataSynFlag = "1";
	 		$scope.itemUpdate.operationMode = result.scope.operationModeInfo;
	 		$scope.itemUpdate.cardAssociations = result.scope.cardAssociationsU;
	 		$scope.itemUpdate.cipherType = result.scope.cipherTypeU;
	 		jfRest.request('encryption', 'update', $scope.itemUpdate).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022'));   //修改成功
					$scope.itemUpdate = {};
					$scope.safeApply();
					result.cancel();
					$scope.selectList();
				}
			});
		};
		//删除事件
		$scope.delInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemDel = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/machineManage/encryptionDel.html', $scope.itemDel, {
				title : T.T('F00093'),    //'删除确认信息',
				buttons : [T.T('F00069')],  //确定删除','取消'
				size : [ '880px', '380px' ],
				callbacks : [$scope.delList]
			});
		};
		//删除
	 	$scope.delList = function(result){
			jfLayer.confirm(T.T('F00092'),function() {
		 		$scope.itemDel.authDataSynFlag = "1";
		 		$scope.itemDel.invalidFlag = "1";
				jfRest.request('encryption', 'update', $scope.itemDel).then(function(data) {
					if (data.returnMsg == 'OK') {
						$scope.itemDel = {};
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
	// 修改
	webApp.controller('encryptionUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
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
		        	$scope.cardAssociationsU = $scope.itemUpdate.cardAssociations;
		        }
			};
		$scope.cipherTypeArray ={ 
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
		        	$scope.cipherTypeU = $scope.itemUpdate.cipherType;
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
	});
	// 删除
	webApp.controller('encryptionMDelCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
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
		        	$scope.cardAssociationsD = $scope.itemDel.cardAssociations;
		        }
			};
		$scope.cipherTypeArray ={ 
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
		        	$scope.cipherTypeD = $scope.itemDel.cipherType;
		        }
			};
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
		        	$scope.operationModeInfo = $scope.itemDel.operationMode;
		        }
		    };
	});
});
