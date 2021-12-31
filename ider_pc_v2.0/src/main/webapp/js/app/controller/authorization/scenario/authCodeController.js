'use strict';
define(function(require) {
	var webApp = require('app');
	// 密钥管理
	webApp.controller('authCodeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/scenario/i18n_authCode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
		 $scope.recordTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.isShow = false;
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
	   	   			if($scope.eventList.search('AUS.PM.01.0012') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.01.0011') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.01.0013') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
			//授权响应码查询
			$scope.itemList = {
					params : $scope.queryParam = {
							"authDataSynFlag":"1",
							"operationMode":$scope.operationMode,
							"externalResponseCode":$scope.externalResponseCode,
							"cardAssociations":$scope.cardAssociations,
							"pageSize":10,
							"indexNo":0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					autoQuery : false,
					resource : 'authmanage.query',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
					}
				};
		//查询事件
		$scope.selectList = function(event) {
			if($scope.operationMode){
				$scope.isShow = true;
				$scope.itemList.params.operationMode = $scope.operationMode;
				$scope.itemList.params.externalResponseCode = $scope.externalResponseCode;
				$scope.itemList.params.cardAssociations = $scope.cardAssociations;
				$scope.itemList.search();
			}else{
				$scope.isShow = false;
				jfLayer.fail(T.T('SQJ2500003'));   //"请选择营运模式！"
			}
		};
		//新增事件
		$scope.addKey = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/scenario/authCodeAdd.html', '', {
				title : T.T('SQJ2500004'), //'授权响应码新增',
				buttons : [ T.T('F00031'),T.T('F00012')],  //'保存','关闭'
				size : [ '850px', '480px' ],
				callbacks : [$scope.savekey ]
			});
		};
    	// 保存信息事件
		$scope.savekey = function(result) {
			$scope.authAdd = $.parseJSON(JSON.stringify(result.scope.authcadd));
	 		$scope.authAdd.authDataSynFlag = "1";
	 		jfRest.request('authmanage','save', $scope.authAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));  //建立成功
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.authAdd = {};
	    			$scope.selectList();
                }
            });
		};
		//查询详情事件
		$scope.selInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemInfo = {};
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/authCodeInfo.html', $scope.itemInfo, {
				title : T.T('SQJ2500006'),  //SQJ2500006'查询详细信息'
				buttons : [ T.T('F00012')],//关闭
				size : [ '850px', '450px' ],
				callbacks : [ ]
			});
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/authCodeUpdate.html', $scope.itemUpdate, {
				title : T.T('SQJ2500005'),  //'维护信息'
				buttons : [T.T('F00031'),T.T('F00012')],  //'保存','关闭'
				size : [ '850px', '450px' ],
				callbacks : [$scope.updateKey]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.updateKey = function(result) {
	 		$scope.itemUpdate.authDataSynFlag = "1";
	 		$scope.itemUpdate.operationMode = result.scope.operationModeInfo;
	 		delete $scope.itemUpdate['invalidFlag'];
	 		$scope.itemUpdate.cardAssociations = result.scope.cardAssociationsU;
			jfRest.request('authmanage', 'update', $scope.itemUpdate).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022'));
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
			$scope.itemDel = {};
			$scope.itemDel = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/authCodeDel.html', $scope.itemDel, {
				title : T.T('SQJ2500007'),   //'删除确认信息' 7
				buttons : [T.T('SQJ2500007'),T.T('F00046')],   //'确定删除','取消' 
				size : [ '850px', '450px' ],
				callbacks : [$scope.delList]
			});
		};
		//删除
	 	$scope.delList = function(result){
			jfLayer.confirm(T.T('SQJ2500007'),function() {    //"确定是否删除" 
		 		$scope.itemDel.authDataSynFlag = "1";
		 		$scope.itemDel.invalidFlag = "1";
		 		$scope.itemDel.operationMode = result.scope.operationModeInfo;
				jfRest.request('authmanage', 'update', $scope.itemDel).then(function(data) {
					if (data.returnMsg == 'OK') {
						$scope.itemDel = {};
						jfLayer.success(T.T('SQJ2500010'));   //"删除成功"
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
	webApp.controller('authCodeAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		 $scope.recordTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
	});
	// 详情
	webApp.controller('authCodeInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.recordTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.cardAssociationsInfo = $scope.itemInfo.cardAssociations;
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
	});
	// 详情
	webApp.controller('authCodeDelCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.recordTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.cardAssociationsDel = $scope.itemDel.cardAssociations;
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
	        	$scope.operationModeInfo = $scope.itemDel.operationMode;
	        }
	    };
	});
	// 修改
	webApp.controller('authCodeUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.recordTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_recordType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.cardAssociationsU = $scope.itemUpdate.cardAssociations;
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
});
