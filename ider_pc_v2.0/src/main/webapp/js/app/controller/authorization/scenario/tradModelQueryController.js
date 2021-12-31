'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易模式
	webApp.controller('tradModelCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/scenario/i18n_tradModel');
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
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.relativeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_relative",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
		$scope.field1Array ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_dimensionalType",
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
	        	//$scope.operationModeFlag = data[0].operationMode;
	        }
	    };
		 //应用范围
		$scope.appArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_applictionrange",
				queryFlag: "children"
			},//默认查询条件
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
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
	   	   			if($scope.eventList.search('AUS.PM.01.0201') != -1){    //授权场景新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.01.0202') != -1){    //授权场景查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.01.0203') != -1){    //授权场景修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
				}
			});
			$scope.isShow = false;
		//交易模式列表查询
		$scope.itemList = {
				params : $scope.queryParam = {
						"authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : false,
				resource : 'tradModel.query',// 列表的资源
			    isTrans: true,//是否需要翻译数据字典
			    transParams : ['dic_applictionrange'],//查找数据字典所需参数
			    transDict : ['applicationRange_applicationRangeDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询
		$scope.selList = function(){
			if($scope.operationMode){
				$scope.isShow = true;
				$scope.itemList.params.operationMode = $scope.operationMode;
				$scope.itemList.params.transSceneCode = $scope.transSceneCode;
				$scope.itemList.search();
			}else{
				$scope.isShow = false;
				jfLayer.fail(T.T('SQJ1600008'));   //请选择营运模式！
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/tradModelInfo.html', $scope.item, {
				title : T.T('SQJ1600001'),
				buttons : [ T.T('F00012')],
				size : [ '1150px', '580px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addTradModeAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/scenario/tradModelAdd.html', '', {
				title : T.T('SQJ1600002'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1150px', '580px' ],
				callbacks : [$scope.saveTradInfoAdd ]
			});
		};
		$scope.tradsAddList = [];
	 	//特店ID--增加
	 	$scope.addTrads = function(){
	 		if($scope.tradsAddList == 0){
	 			$scope.tradsAddList = [{}];
	 		}
	 		else{
	 			$scope.tradsAddList.splice($scope.tradsAddList.length,0,{});
	 		}
	 	};
	 	//删除
	 	$scope.delTrads = function(e,$index){
	 		$scope.tradsAddList.splice($index,1);
	 	};
	 	$scope.trads = {};
    	// 保存信息事件
		$scope.saveTradInfoAdd = function(result) {
			$scope.tradsInfoAdd = $.parseJSON(JSON.stringify(result.scope.trads));
			$scope.tradsListAddNew = result.scope.tradsAddList;
			$scope.tradsInfoAdd.x7220list = [];
			var addnegNew = "";
			if($scope.tradsListAddNew.length == 0){
				jfLayer.fail(T.T('SQJ1600015'));
				return;
			}
			else{
		 		for (var i = 0; i < $scope.tradsListAddNew.length; i++) {
		 			if($scope.tradsListAddNew[i].field1 == ''|| $scope.tradsListAddNew[i].field1 == null || $scope.tradsListAddNew[i].field1 == undefined) {
		 				jfLayer.fail(T.T('SQJ1600011'));
		 				return;
		 			}
		 			if($scope.tradsListAddNew[i].field1Value == ''|| $scope.tradsListAddNew[i].field1Value == null) {
		 				jfLayer.fail(T.T('SQJ1600012'));
		 				return;
		 			}
		 			if($scope.tradsListAddNew[i].field1 == $scope.tradsListAddNew[i].field2) {
		 				jfLayer.fail(T.T('SQJ1600013'));
		 				return;
		 			}
		 			if($scope.tradsListAddNew[i].field2) {
		 				if ($scope.tradsListAddNew[i].field2Value == '' || $scope.tradsListAddNew[i].field2Value == null || $scope.tradsListAddNew[i].field2Value == undefined) {
		 					jfLayer.fail(T.T('SQJ1600014'));
			 				return;
		 				}	
		 			}
		 			addnegNew ={cardAssociations:$scope.tradsListAddNew[i].cardAssociations,relative1:$scope.tradsListAddNew[i].relative1,relative2:$scope.tradsListAddNew[i].relative2,field1:$scope.tradsListAddNew[i].field1,field1Value:$scope.tradsListAddNew[i].field1Value,field2:$scope.tradsListAddNew[i].field2,field2Value:$scope.tradsListAddNew[i].field2Value};
		 			$scope.tradsInfoAdd.x7220list.push(addnegNew);
		 		}
			}
	 		$scope.tradsInfoAdd.authDataSynFlag = "1";
	 		jfRest.request('tradModel', 'save', $scope.tradsInfoAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.tradsInfoAdd = {};
	    			$scope.selList();
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/tradModelUpdate.html', $scope.item, {
				title : T.T('SQJ1600006'),
				buttons : [T.T('F00031'),T.T('F00012')],
				size : [ '1150px', '580px' ],
				callbacks : [$scope.saveTradModel]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveTradModel = function(result) {
			$scope.tradsListAddNew = {};
			delete $scope.item['invalidFlag'];
			$scope.item.x7220list = [];
			var addnegNew = "";
		    $scope.tradModelList = result.scope.tradModelList;
	 		for (var i = 0; i < $scope.tradModelList.length; i++) {
	 			if($scope.tradModelList[i].field2 == "null"){
	 				$scope.tradModelList[i].field2 ="";
	 			}
	 			if($scope.tradModelList[i].field1 == ''|| $scope.tradModelList[i].field1 == null || $scope.tradModelList[i].field1 == undefined) {
	 				jfLayer.fail(T.T('SQJ1600011'));
	 				return;
	 			}
	 			if($scope.tradModelList[i].field1Value == ''|| $scope.tradModelList[i].field1Value == null) {
	 				jfLayer.fail(T.T('SQJ1600012'));
	 				return;
	 			}
	 			if($scope.tradModelList[i].field1 == $scope.tradModelList[i].field2) {
	 				jfLayer.fail(T.T('SQJ1600013'));
	 				return;
	 			}
	 			if($scope.tradModelList[i].field2) {
	 				if ($scope.tradModelList[i].field2Value == '' || $scope.tradModelList[i].field2Value == null || $scope.tradModelList[i].field2Value == undefined) {
	 					jfLayer.fail(T.T('SQJ1600014'));
		 				return;
	 				}	
	 			}
	 			addnegNew ={cardAssociations:$scope.tradModelList[i].cardAssociations,relative1:$scope.tradModelList[i].relative1,relative2:$scope.tradModelList[i].relative2,id:$scope.tradModelList[i].id,field1:$scope.tradModelList[i].field1,field1Value:$scope.tradModelList[i].field1Value,field2:$scope.tradModelList[i].field2,field2Value:$scope.tradModelList[i].field2Value};
	 			$scope.item.x7220list.push(addnegNew);
	 		}
	 		$scope.item.authDataSynFlag = "1";
	 		$scope.item.applicationRange = result.scope.applicationRangeDesc;
			jfRest.request('tradModel', 'update', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.alert(T.T('F00022'));
					$scope.item = {};
					$scope.safeApply();
					result.cancel();
					$scope.selList();
				}
			});
		};
		$scope.closeTradModel = function(result) {
			$scope.safeApply();
			result.cancel();
		}
	});
	// 交易模式
	webApp.controller('tradModelUpdateCtrl', function($scope, $stateParams, jfRest,$timeout,
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
	        	console.log(data);
	        	$scope.operationModeUpdate = $scope.item.operationMode;
	        }
	    };
		 //应用范围
			$scope.appArrayU ={
				type:"dictData",
				param:{
					"type":"DROPDOWNBOX",
					groupsCode:"dic_applictionrange",
					queryFlag: "children"
				},//默认查询条件
				text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
				value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				resource:"paramsManage.query",//数据源调用的action
				callback: function(data){
					$scope.applicationRangeDesc = $scope.item.applicationRange;
				}
			};
		//自定义下拉框
			$scope.cardAssociationsUArray = {};
			 $scope.params = {
				type:"DROPDOWNBOX",
		        groupsCode:"dic_recordType",
		        queryFlag: "children"
			 };
			 jfRest.request('paramsManage', 'query', $scope.params).then(function(data) {
				 $scope.cardAssociationsUArray = data.returnData.rows;
			 });
			$scope.field1UArray = {};
			$scope.params = {
				type:"DROPDOWNBOX",
		        groupsCode:"dic_dimensionalType",
		        queryFlag: "children"
			};
			jfRest.request('paramsManage', 'query', $scope.params).then(function(data) {
				$scope.field1UArray = data.returnData.rows;
			});
			$scope.relativeUArray = {};
			$scope.params = {
				type:"DROPDOWNBOX",
		        groupsCode:"dic_relative",
		        queryFlag: "children"
			};
			jfRest.request('paramsManage', 'query', $scope.params).then(function(data) {
				$scope.relativeUArray = data.returnData.rows;
			});
			//交易模式信息详情查询
			$scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					 "transSceneCode":$scope.item.transSceneCode,
					"pageSize":10,
					"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('tradModel', 'query', $scope.queryParam).then(function(data) {
				$scope.tradModelList = data.returnData.rows;
			});
		 	$scope.updateTradModel = function(){
		 		if($scope.tradModelList == 0){
		 			$scope.tradModelList = [{}];
		 			$timeout(function() {
						Tansun.plugins.render('select');
					});
		 		}
		 		else{
		 			$scope.tradModelList.splice($scope.tradModelList.length,0,{});
		 			$timeout(function() {
						Tansun.plugins.render('select');
					});
		 		}
		 	};
			//删除====单个
		 	$scope.delList = function(e,$index){
		 		$scope.itemd = {};
		 		$scope.itemd.x7220list = [];
				var delnegNew = "";
				jfLayer.confirm(T.T('SQJ1600007'),function() {
			 		for (var i = 0; i < $scope.tradModelList.length; i++) {
			 			if(i == $index){
			 				$scope.itemd.id = $scope.tradModelList[i].id;
			 				delnegNew ={id:$scope.tradModelList[i].id,invalidFlag:"1",cardAssociations:$scope.tradModelList[i].cardAssociations,relative1:$scope.tradModelList[i].relative1,relative2:$scope.tradModelList[i].relative2,field1:$scope.tradModelList[i].field1,field1Value:$scope.tradModelList[i].field1Value,field2:$scope.tradModelList[i].field2,field2Value:$scope.tradModelList[i].field2Value};
				 			$scope.itemd.x7220list.push(delnegNew);
			 				break;
			 			}
			 		}
			 		$scope.itemd.authDataSynFlag = "1";
			 		$scope.itemd.operationMode = e.operationMode;
			 		$scope.itemd.transSceneCode = e.transSceneCode;
			 		$scope.itemd.transSceneDesc = e.transSceneDesc;
			 		if($scope.itemd.id == undefined){
			 			$scope.tradModelList.splice($index,1);
			 			jfLayer.alert(T.T('F00037'));
			 		}
			 		else{
						jfRest.request('tradModel', 'update', $scope.itemd).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.itemd = {};
								$scope.tradModelList.splice($index,1);
								jfLayer.alert(T.T('F00037'));
							}
						});
			 		}
				},function() {
				});
		 	};
		 	//全部删除
		 	$scope.delAllModel =  function(){
		 		$scope.delitem = {};
		 		$scope.delitem.operationMode = $scope.item.operationMode;
		 		$scope.delitem.transSceneCode = $scope.item.transSceneCode;
		 		$scope.delitem.transSceneDesc = $scope.item.transSceneDesc;
		 		$scope.delitem.invalidFlag = "1";
		 		$scope.delitem.authDataSynFlag = "1";
				jfLayer.confirm(T.T('SQJ1600007'),function() {
					jfRest.request('tradModel', 'update', $scope.delitem).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.delitem = {};
							$scope.tradModelList = "";
							jfLayer.alert(T.T('F00037'));   
						}
					});
				},function() {
				});
		 	};
	});
	// 详情列表查询
	webApp.controller('tradModelInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//详情列表查询
		$scope.itemInfoList = {
				params : $scope.queryParam = {
						"operationMode":$scope.item.operationMode,
						 "transSceneCode":$scope.item.transSceneCode,
						 "transSceneDesc": $scope.item.transSceneDesc,
						 "authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_recordType','dic_dimensionalType','dic_relative','dic_dimensionalType','dic_relative'],//查找数据字典所需参数
				transDict : ['cardAssociations_cardAssociationsDesc','field1_field1Desc','relative1_relative1Desc','field2_field2Desc','relative2_relative2Desc'],//翻译前后key
				paging : true,// 默认true,是否分页
				resource : 'tradModel.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
});
