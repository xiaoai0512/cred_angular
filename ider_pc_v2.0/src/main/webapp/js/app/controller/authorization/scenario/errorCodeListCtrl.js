'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('errorCodeListCtrl', function($scope, $stateParams, jfRest,
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
		$scope.itemList = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'errorCodeList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询事件
		$scope.selList = function(event) {
			if($scope.operationMode){
				$scope.itemList.params.operationMode = $scope.operationMode;
				$scope.itemList.params.responseDesc = $scope.responseDesc;
				$scope.itemList.search();
			}else{
				jfLayer.fail(T.T('SQJ1500025'));  //"请选择营运模式进行查询！"
			}
		};
		//新增事件
		$scope.addScenarioAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/scenario/errorCodeAdd.html', '', {
				title : '授权错误码新增',
				buttons : [T.T('F00107'),T.T('F00012')],  //'确定','关闭'
				size : [ '900px', '400px' ],
				callbacks : [$scope.saveErrorCode]
			});
		};
		//确定按钮点击事件
		$scope.saveErrorCode = function(result){
			$scope.errorCodeAddInfo =  {};
			$scope.errorCodeAddInfo = result.scope.errorCodeAdd;
			jfRest.request('errorCodeList', 'save', $scope.errorCodeAddInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.errorCodeAddInfo = {};
					$scope.safeApply();
	    			result.cancel();
	    			$scope.itemList.search();
				}
			});
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.errorCodeUpdate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/errorCodeUpdate.html', $scope.errorCodeUpdate, {
				title : '授权错误码修改',
				buttons : [  T.T('F00031'), T.T('F00012')],
				size : [ '850px', '450px' ],
				callbacks : [$scope.updateErrorCode]
			});
		};
		//交易识别按钮
		$scope.responseRelInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemIden = {};
			$scope.itemIden = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/responseRelList.html', $scope.itemIden, {
				title : "内外部授权码响应",
				buttons : [T.T('F00125'),T.T('F00108')],
				size : [ '1000px', '620px' ],
				callbacks : []
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.updateErrorCode = function(result) {
			$scope.itemUpdateInfo = result.scope.errorCodeUpdate;
			$scope.itemUpdateInfo.responseDesc = result.scope.updateresponseDesc;
			jfRest.request('errorCodeList', 'update', $scope.itemUpdateInfo).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.success(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
					}
			});
		};
	});
	//授权错误码新增
	webApp.controller('errorCodeAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
		$scope.errorCodeAdd = {};
	});
	//授权错误码修改
	webApp.controller('errorCodeUpdateCtrl', function($scope, $stateParams,  $timeout,jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
	        	$scope.operationModeInfo = $scope.errorCodeUpdate.operationMode;
	        }
	    };
		$scope.updateresponseDesc = $scope.errorCodeUpdate.responseDesc;
	});
	//响应码查询
	webApp.controller('responseRelListCtrl', function($scope, $stateParams,  $timeout,jfRest,
													  $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
		//授权内外部响应码查询
		$scope.idenList = {
			params : $scope.queryParam = {
				"operationMode":$scope.itemIden.operationMode,
				"internalResponseCode":$scope.itemIden.internalResponseCode,
				"authFlag":"0",
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'responseRel.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_recordType'],//查找数据字典所需参数
			transDict : ['cardAssociations_cardAssociationsDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}

		};
		//新增内外部授权错误响应码
		$scope.addIdentify = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/scenario/responseRelAdd.html',  $scope.itemIden, {
				title :"内外部授权码响应",
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.addPro]
			});
		};
		$scope.addPro =  function(result){
			$scope.itemIden.flag = "0";
			jfRest.request('responseRel', 'update', $scope.itemIden).then(function(data) {
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
			$scope.modal('/authorization/scenario/responseRelUpdate.html', $scope.item, {
				title : "内外部授权码响应",
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '515px' ],
				callbacks : [$scope.updPro]
			});
		};
		$scope.updPro =  function(result){
			$scope.item.externalResponseCode = result.scope.externalResponseCodeN;
			$scope.item.cardAssociations = result.scope.cardAssociationsN;
			$scope.item.flag = "2";
			jfRest.request('responseRel', 'update', $scope.item).then(function(data) {
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
			jfLayer.confirm("是否删除此内外部错误响应码",function() {
				$scope.itemdel.flag = "1";
				$scope.itemdel.invalidFlag = "1";
				jfRest.request('responseRel', 'update', $scope.itemdel).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00037'));
						$scope.idenList.search();
					}
				});
			});
		}
	});
	//在额度节点中新增业务项目
	webApp.controller('responseRelAddCtrl', function($scope, $stateParams, jfRest,
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
		//联动验证
		var form = layui.form;
		$scope.authmanageArray = {};
		form.on('select(businessProgramNoAdd)',function(event){
			if(event.value){
				//获取业务项目代码
				$scope.authmanageArray = {
					type:"dynamicDesc",
					param:{
						"operationMode":$scope.itemIden.operationMode,
						"cardAssociations":event.value,
						"authFlag":"0",
					},//默认查询条件
					text:"externalResponseCode",
					desc: "responseDesc",
					value:"externalResponseCode",
					resource : 'authmanage.query',
					callback:function(data){
					}
				}
			}
		});

	});
	//在额度节点中修改业务项目
	webApp.controller('responseRelUpdCtrl', function($scope, $stateParams, jfRest,
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
		$scope.authmanageArrays = {
			type:"dynamicDesc",
			param:{
				"operationMode":$scope.item.operationMode,
				"cardAssociations":$scope.item.cardAssociations,
				"authFlag":"0",
			},//默认查询条件
			text:"externalResponseCode",
			desc: "responseDesc",
			value:"externalResponseCode",
			resource : 'authmanage.query',
			callback:function(data){
				$scope.externalResponseCodeN = $scope.item.externalResponseCode;
			}
		};
		$scope.recordTypeArrays ={
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
				$scope.cardAssociationsN = $scope.item.cardAssociations;
			}
		};
		//联动验证
		var form = layui.form;
		form.on('select(businessProgramNoNUpd)',function(event){
			if(event.value){
				//获取业务项目代码
				$scope.authmanageArrays = {
					type:"dynamicDesc",
					param:{
						"operationMode":$scope.itemIden.operationMode,
						"cardAssociations":event.value,
						"authFlag":"0",
					},//默认查询条件
					text:"externalResponseCode",
					desc: "responseDesc",
					value:"externalResponseCode",
					resource : 'authmanage.query',
					callback:function(data){
					}
				}
			}
		});
	});

});
