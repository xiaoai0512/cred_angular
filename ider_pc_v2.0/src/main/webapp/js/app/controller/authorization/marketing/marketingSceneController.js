'use strict';
define(function(require) {
	var webApp = require('app');
	// 密钥管理
	webApp.controller('marketingSceneCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/marketing/i18n_marketing');
		$translatePartialLoader.addPart('pages/authorization/scenario/i18n_scenario');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.currencyArray = {};
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
	        	//$scope.operationModeInf = data
	        }
	     };
		$scope.isShow = false;
		$scope.eventList = "";
		$scope.addBtnFlag = false;
		$scope.copyBtnFlag = false;
		$scope.compBtnFlag = false;
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
   	   			if($scope.eventList.search('AUS.PM.04.0101') != -1){    //新增
   					$scope.addBtnFlag = true;
   					$scope.copyBtnFlag = true;
   				}
   				else{
   					$scope.addBtnFlag = false;
   					$scope.copyBtnFlag = false;
   				}
	   	   		if($scope.eventList.search('AUS.PM.04.0102') != -1){    //查询
   					$scope.selBtnFlag = true;
   					$scope.compBtnFlag = true;
   				}
   				else{
   					$scope.selBtnFlag = false;
   					$scope.compBtnFlag = false;
   				}
		   	   	if($scope.eventList.search('AUS.PM.04.0103') != -1){    //修改
   					$scope.updBtnFlag = true;
   				}
   				else{
   					$scope.updBtnFlag = false;
   				}
			}
		});
		//营销规则列表查询
		$scope.itemList = {
				params : $scope.queryParam = {
						//"authDataSynFlag":"1",
						"operationMode":$scope.operationModeNG,
						"marketingSceneCode":$scope.marketingSceneCodeNG,
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : false,
				resource : 'marketing.queryRule',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询事件
		$scope.selectList = function(event) {
			if($scope.operationModeNG){
				$scope.isShow = true;
				$scope.itemList.params.operationMode = $scope.operationModeNG;
				$scope.itemList.params.marketingSceneCode = $scope.marketingSceneCodeNG;
				$scope.itemList.search();
			}else{
				$scope.isShow = false;
				if(!$scope.operationModeNG){
					jfLayer.fail(T.T('SQJ310001'));//"请选择运营模式！");

				}
			}
		};
		//新增事件
		$scope.addKey = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/marketing/marketingRuleAdd.html', '', {
				title : T.T('SQJ310009'),   //'营销规则新增',
				buttons : [ T.T('F00031'),T.T('F00012')],   //'保存','关闭'
				size : [ '900px', '600px' ],
				callbacks : [$scope.savekey ]
			});
		};
    	//新增事件 保存信息事件
		$scope.savekey = function(result) {
			//$scope.itemAdd = {};
			$scope.itemAdd = $.parseJSON(JSON.stringify(result.scope.itemAdd));
			$scope.itemAdd.operationMode = result.scope.operationModeAdd;
			if($scope.itemAdd.operationMode && $scope.itemAdd.marketingRule && $scope.itemAdd.marketingCurrencyCode){
				if($scope.itemAdd.marketingRule == '0'){
					if(!(parseInt(result.scope.itemAdd.circleAmt)>=0)){
						jfLayer.fail(T.T('SQJ310010'));  //循环金额不能为空
						return;
					}
					if(!(parseInt($scope.itemAdd.circleDiscountAmt)>=0)){
						jfLayer.fail(T.T('SQJ310011'));
						return;
					}
				}
				if($scope.itemAdd.marketingRule == '1'){
					if(!(parseInt($scope.itemAdd.accumAmtLev1)>=0)){
						jfLayer.fail(T.T('SQJ310012'));
						return;
					}
					if(!(parseInt($scope.itemAdd.accumDiscountAmtLev1)>=0)){
						jfLayer.fail(T.T('SQJ310013'));
						return;
					}
					if(!(parseInt($scope.itemAdd.accumAmtLev2)>=0)){
						jfLayer.fail(T.T('SQJ310014'));
						return;
					}
					if(!(parseInt($scope.itemAdd.accumDiscountAmtLev2)>=0)){
						jfLayer.fail(T.T('SQJ310015'));
						return;
					}
					if(!(parseInt($scope.itemAdd.accumAmtLev3)>=0)){
						jfLayer.fail(T.T('SQJ310016'));
						return;
					}
					if(!(parseInt($scope.itemAdd.accumDiscountAmtLev3)>=0)){
						jfLayer.fail(T.T('SQJ310017'));
						return;
					}
				}
				if($scope.itemAdd.marketingRule == '2'){
					if(!(parseInt($scope.itemAdd.randomAmt)>=0)){
						jfLayer.fail(T.T('SQJ310018'));
						return;
					}
					if(!(parseInt($scope.itemAdd.randomDiscountAmtCeiling)>=0)){
						jfLayer.fail(T.T('SQJ310019'));
						return;
					}
					if(!(parseInt($scope.itemAdd.randomDiscountAmtFloor)>=0)){
						jfLayer.fail(T.T('SQJ310020'));
						return;
					}
				}
		 		jfRest.request('marketing','saveRule', $scope.itemAdd).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success(T.T('F00058'));  //T.T('F00058')
	                	$scope.safeApply();
		    			result.cancel();
		    			$scope.itemAdd = {};
		    			$scope.selectList();
	                }
	            });
			}else if(!result.scope.operationModeAdd){
				jfLayer.fail(T.T('SQJ310001'));
			}else if(!$scope.itemAdd.marketingCurrencyCode){
				jfLayer.fail(T.T('SQJ310022'));
			}else if(!$scope.itemAdd.marketingRule){
				jfLayer.fail(T.T('SQJ310023'));
			}
		};
		//查询详情事件
		$scope.selInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemInfo = {};
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/marketing/marketingRuleInfo.html', $scope.itemInfo, {
				title : T.T('SQJ310024'),   //'查询详细信息',
				buttons : [ T.T('F00012')],
				size : [ '900px', '600px' ],
				callbacks : [ ]
			});
		};
		//场景识别事件
		$scope.compInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/marketing/marketingScenceDistin.html', $scope.itemInfo, {
				title : T.T('SQJ310025'),   //'场景识别详细信息',
				buttons : [T.T('F00012')],
				size : [ '900px', '600px' ],
				callbacks : [ ]
			});
		};
		//复制事件
		$scope.copyInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemCopyAdd = {};
			$scope.itemCopyAdd = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/marketing/marketingRuleInfoCopyAdd.html', $scope.itemCopyAdd, {
				title : T.T('SQJ310026'),  // '复制信息',   
				buttons : [ T.T('F00031'),T.T('F00012')],   //'保存','关闭'
				size : [ '900px', '600px' ],
				callbacks : [$scope.copySavekey ]
			});
		};
		//复制事件 保存信息
		$scope.copySavekey = function(result) {
			$scope.itemCopyAddInfo ={};
			$scope.itemCopyAddInfo = $.parseJSON(JSON.stringify(result.scope.itemCopyAdd));
			$scope.itemCopyAddInfo.operationMode = result.scope.operationModeCopyAdd;
			$scope.itemCopyAddInfo.marketingCurrencyCode = result.scope.marketingCurrencyCodeCopyAddNG;
			$scope.itemCopyAddInfo.marketingRule= result.scope.marketingRuleC;
			if($scope.itemCopyAddInfo.operationMode && $scope.itemCopyAddInfo.marketingRule && $scope.itemCopyAddInfo.marketingCurrencyCode){
				if($scope.itemCopyAddInfo.marketingRule == '0'){
					if(!(parseInt($scope.itemCopyAddInfo.circleAmt)>=0) ){
						jfLayer.fail(T.T('SQJ310010'));  //循环金额不能为空
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.circleDiscountAmt)>=0)){
						jfLayer.fail(T.T('SQJ310011'));
						return;
					}
				}
				if($scope.itemCopyAddInfo.marketingRule == '1'){
					if(!(parseInt($scope.itemCopyAddInfo.accumAmtLev1)>=0)){
						jfLayer.fail(T.T('SQJ310012'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.accumDiscountAmtLev1)>=0)){
						jfLayer.fail(T.T('SQJ310013'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.accumAmtLev2)>=0)){
						jfLayer.fail(T.T('SQJ310014'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.accumDiscountAmtLev2)>=0)){
						jfLayer.fail(T.T('SQJ310015'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.accumAmtLev3)>=0)){
						jfLayer.fail(T.T('SQJ310016'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.accumDiscountAmtLev3)>=0)){
						jfLayer.fail(T.T('SQJ310017'));
						return;
					}
				}
				if($scope.itemCopyAddInfo.marketingRule == '2'){
					console.log($scope.itemCopyAddInfo);
					if(!(parseInt($scope.itemCopyAddInfo.randomAmt)>=0)){
						jfLayer.fail(T.T('SQJ310018'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.randomDiscountAmtCeiling ) >= 0)){
						jfLayer.fail(T.T('SQJ310019'));
						return;
					}
					if(!(parseInt($scope.itemCopyAddInfo.randomDiscountAmtFloor)>=0)){
						jfLayer.fail(T.T('SQJ310020'));
						return;
					}
				}
		 		jfRest.request('marketing','saveRule', $scope.itemCopyAddInfo).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success(T.T('F00058'));   //T.T('F00058')
	                	$scope.safeApply();
		    			result.cancel();
		    			$scope.itemCopyAdd = {};
		    			$scope.selectList();
	                }
	            });
			}else if(!result.scope.operationModeCopyAdd){
				jfLayer.fail(T.T('SQJ310001'));
			}else if(!result.scope.marketingCurrencyCodeCopyAddNG){
				jfLayer.fail(T.T('SQJ310022'));
			}else if(!$scope.itemCopyAddInfo.marketingRule){
				jfLayer.fail(T.T('SQJ310023'));
			}
		};
		//修改事件
		$scope.updateMInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/marketing/marketingRuleUpdate.html', $scope.itemUpdate, {
				title : T.T('F00087'),   //'维护信息',
				buttons : [ T.T('F00031'),T.T('F00012')],   //'保存','关闭'
				size : [ '900px', '600px' ],
				callbacks : [$scope.updateKey]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.updateKey = function(result) {
	 		$scope.itemUpdate.authDataSynFlag = "1";
	 		$scope.itemUpdate.operationMode = result.scope.operationModeUpdate;
	 		$scope.itemUpdate.marketingCurrencyCode = result.scope.marketingCurrencyCodeUpdateNG;
	 		$scope.itemUpdate.marketingRule = result.scope.marketingRuleU;
	 		delete $scope.itemUpdate['invalidFlag'];
			jfRest.request('marketing', 'updateRule', $scope.itemUpdate).then(function(data) {
				if(!$scope.itemUpdate.marketingCurrencyCode){
					jfLayer.fail(T.T('SQJ310022'));
					return;
				}
				if(!result.scope.itemUpdate.marketingRule){
					jfLayer.fail(T.T('SQJ310023'));
					return;
				}
				if(result.scope.itemUpdate.marketingRule == '0'){
					if(!(parseInt(result.scope.itemUpdate.circleAmt)>=0)){
						jfLayer.fail(T.T('SQJ310010'));  //循环金额不能为空
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.circleDiscountAmt)>=0)){
						jfLayer.fail(T.T('SQJ310011'));
						return;
					}
				}
				if(result.scope.itemUpdate.marketingRule == '1'){
					if(!(parseInt(result.scope.itemUpdate.accumAmtLev1)>=0)){
						jfLayer.fail(T.T('SQJ310012'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.accumDiscountAmtLev1)>=0)){
						jfLayer.fail(T.T('SQJ310013'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.accumAmtLev2)>=0)){
						jfLayer.fail(T.T('SQJ310014'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.accumDiscountAmtLev2)>=0)){
						jfLayer.fail(T.T('SQJ310015'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.accumAmtLev3)>=0)){
						jfLayer.fail(T.T('SQJ310016'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.accumDiscountAmtLev3)>=0)){
						jfLayer.fail(T.T('SQJ310017'));
						return;
					}
				}
				if(result.scope.itemUpdate.marketingRule == '2'){
					if(!(parseInt(result.scope.itemUpdate.randomAmt)>=0)){
						jfLayer.fail(T.T('SQJ310018'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.randomDiscountAmtCeiling)>=0)){
						jfLayer.fail(T.T('SQJ310019'));
						return;
					}
					if(!(parseInt(result.scope.itemUpdate.randomDiscountAmtFloor)>=0)){
						jfLayer.fail(T.T('SQJ310020'));
						return;
					}
				}
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022'));
					$scope.itemUpdate = {};
					$scope.safeApply();
					result.cancel();
					$scope.selectList();
				}
				else{
                	jfLayer.fail(T.T('F00023') + data.returnMsg + "(" + data.returnCode + ")");
                }
			});
		};
		//删除事件
		$scope.delMInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemDel = {};
			$scope.itemDel = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/marketing/marketingRuleDel.html', $scope.itemDel, {
				title : T.T('F00093'),
				buttons : [T.T('F00094'),T.T('F00046')],       //['确定删除','取消']
				size : [ '900px', '600px' ],
				callbacks : [$scope.delList]
			});
		};
		//删除
	 	$scope.delList = function(result){
			jfLayer.confirm(T.T('F00092'),function() {
		 		$scope.itemDel.authDataSynFlag = "1";
		 		$scope.itemDel.invalidFlag = "1";
		 		$scope.itemDel.operationMode = result.scope.operationModeNG;
				jfRest.request('marketing', 'updateRule', $scope.itemDel).then(function(data) {
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
	// 新增
	webApp.controller('marketingSceneAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.operationModeFlag = "";
		$scope.ruleArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ruleType",
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
		var form = layui.form;
		form.on('select(getOperationModeAdd)',function(event){
			if($scope.operationModeAdd){
				console.log("----"+$scope.operationModeAdd);
				//营销币种======从beta数据库core_currency查询出来
				$scope.currencyArray ={ 
						type:"dynamic", 
						param:{
							"operationMode":$scope.operationModeAdd,
						},//默认查询条件 
						text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
						value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
						resource:"operatCurrency.query",//数据源调用的action 
						callback: function(data){
							
						}
				};
			}else{
				$scope.currencyArray = {};
			}
		});
		form.on('select(getMarketingRulesAdd)',function(event){
			if(event.value == 0){
				$scope.cycleAmountShowA = true;
				$scope.addUpAmountShowA = false;
				$scope.randomAmountShowA = false;
				$scope.itemAdd.accumAmtLev1 = null;
				$scope.itemAdd.accumDiscountAmtLev1 = null;
				$scope.itemAdd.accumAmtLev2 = null;
				$scope.itemAdd.accumDiscountAmtLev2 = null;
				$scope.itemAdd.accumAmtLev3 = null;
				$scope.itemAdd.accumDiscountAmtLev3 = null;
				$scope.itemAdd.randomAmt = null;
				$scope.itemAdd.randomDiscountAmtCeiling = null;
				$scope.itemAdd.randomDiscountAmtFloor = null;
			}else if(event.value == 1){
				$scope.cycleAmountShowA = false;
				$scope.addUpAmountShowA = true;
				$scope.randomAmountShowA = false;
				$scope.itemAdd.circleAmt = null;
				$scope.itemAdd.circleDiscountAmt = null;
				$scope.itemAdd.randomAmt = null;
				$scope.itemAdd.randomDiscountAmtCeiling = null;
				$scope.itemAdd.randomDiscountAmtFloor = null;
			}else if(event.value == 2){
				$scope.cycleAmountShowA = false;
				$scope.addUpAmountShowA = false;
				$scope.randomAmountShowA = true;
				$scope.itemAdd.circleAmt = null ;
				$scope.itemAdd.circleDiscountAmt = null;
				$scope.itemAdd.accumAmtLev1 = null ;
				$scope.itemAdd.accumDiscountAmtLev1 = null;
				$scope.itemAdd.accumAmtLev2 = null;
				$scope.itemAdd.accumDiscountAmtLev2 = null;
				$scope.itemAdd.accumAmtLev3 = null;
				$scope.itemAdd.accumDiscountAmtLev3 = null;
			}
		});
	});
	// 复制
	webApp.controller('marketingRuleInfoCopyAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.ruleArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ruleType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.marketingRuleC = $scope.itemCopyAdd.marketingRule;
	        }
		};
		$scope.operationModeCopyAdd = "";
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
				$scope.operationModeCopyAdd = data[0].operationMode;
			}
		};
		//$scope.marketingCurrencyCodeCopyAddNG = $scope.itemCopyAdd.marketingCurrencyCode;
		// 营销币种======
		$scope.currencyArray = {
			type : "dynamic",
			param:{
				 "operationMode": $scope.itemCopyAdd.operationMode
			 },//默认查询条件 
			 text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
			 value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			 resource:"operatCurrency.query",
			callback : function(data) {
				$scope.marketingCurrencyCodeCopyAddNG = $scope.itemCopyAdd.marketingCurrencyCode;
			}
		};
		if($scope.itemCopyAdd.marketingRule == 0){
			$scope.cycleAmountShowCA = true;
			$scope.addUpAmountShowCA = false;
			$scope.randomAmountShowCA = false;
		}else if($scope.itemCopyAdd.marketingRule  == 1){
			$scope.cycleAmountShowCA = false;
			$scope.addUpAmountShowCA = true;
			$scope.randomAmountShowCA = false;
		}else if($scope.itemCopyAdd.marketingRule  == 2){
			$scope.cycleAmountShowCA = false;
			$scope.addUpAmountShowCA = false;
			$scope.randomAmountShowCA = true;
		}
		var form = layui.form;
		form.on('select(getOperationModeCopyAdd)',function(event){
			if($scope.operationModeCopyAdd){
				//营销币种======从beta数据库core_currency查询出来
				$scope.currencyArray ={ 
						type:"dynamic", 
						param:{
							"operationMode":event.value,
						},//默认查询条件 
						text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
						value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
						resource:"operatCurrency.query",//数据源调用的action 
						callback: function(data){
							
						}
				};
			}else{
				$scope.currencyArray = { };
			}
		});
		form.on('select(getMarketingRulesCA)',function(event){
			if(event.value == 0){
				$scope.cycleAmountShowCA = true;
				$scope.addUpAmountShowCA = false;
				$scope.randomAmountShowCA = false;
			}else if(event.value == 1){
				$scope.cycleAmountShowCA = false;
				$scope.addUpAmountShowCA = true;
				$scope.randomAmountShowCA = false;
			}else if(event.value == 2){
				$scope.cycleAmountShowCA = false;
				$scope.addUpAmountShowCA = false;
				$scope.randomAmountShowCA = true;
			}
			$scope.itemCopyAdd.circleAmt = null;
			$scope.itemCopyAdd.circleDiscountAmt = null;
			$scope.itemCopyAdd.accumAmtLev1 = null;
			$scope.itemCopyAdd.accumDiscountAmtLev1 = null;
			$scope.itemCopyAdd.accumAmtLev2 = null;
			$scope.itemCopyAdd.accumDiscountAmtLev2 = null;
			$scope.itemCopyAdd.accumAmtLev3 = null;
			$scope.itemCopyAdd.accumDiscountAmtLev3 = null;
			$scope.itemCopyAdd.randomAmt = null;
			$scope.itemCopyAdd.randomDiscountAmtCeiling = null;
			$scope.itemCopyAdd.randomDiscountAmtFloor = null;
		});
	});
	// 详情
	webApp.controller('marketingRuleInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.ruleArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ruleType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.marketingRuleInfo = $scope.itemInfo.marketingRule;
	        }
		};
		// 运营模式======法人实体下默认缺省运营模式
		$scope.coArray = {
			type : "dynamic",
			param : {
				corporationEntityNo : $scope.corporationId,
				requestType : 1,
				resultType : 1,
				adminFlagLogin : $scope.adminFlagAuth
			},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "legalEntity.query",// 数据源调用的action
			callback : function(data) {
				$scope.operationModeInfo = $scope.itemInfo.operationMode;
			}
		};
		// 营销币种======从beta数据库core_currency查询出来
		// 营销币种======
		$scope.currencyArray = {
			type : "dynamic",
			param:{
				 "operationMode": $scope.itemInfo.operationMode
			 },//默认查询条件 
			 text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
			 value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			 resource:"operatCurrency.query",
			callback : function(data) {
                $scope.marketingCurrencyCodeInfoNG = $scope.itemInfo.marketingCurrencyCode;
            }
		};
		if($scope.itemInfo.marketingRule == 0){
			$scope.cycleAmountShow = true;
			$scope.addUpAmountShow = false;
			$scope.randomAmountShow = false;
		}else if($scope.itemInfo.marketingRule  == 1){
			$scope.cycleAmountShow = false;
			$scope.addUpAmountShow = true;
			$scope.randomAmountShow = false;
		}else if($scope.itemInfo.marketingRule  == 2){
			$scope.cycleAmountShow = false;
			$scope.addUpAmountShow = false;
			$scope.randomAmountShow = true;
		}
	});
	// 删除
	webApp.controller('marketingRuleDelCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.currencyArray = {};
		$scope.ruleArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ruleType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.marketingRuleDel = $scope.itemDel.marketingRule;
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
	        	$scope.operationModeDel = $scope.itemDel.operationMode;
	        }
	    };
		// 营销币种======从beta数据库core_currency查询出来
		// 营销币种======
		$scope.currencyArray = {
			type : "dynamic",
			param:{
				 "operationMode": $scope.itemDel.operationMode
			 },//默认查询条件 
			 text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
			 value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			 resource:"operatCurrency.query",
			callback : function(data) {
				$scope.marketingCurrencyCodeDelNG = $scope.itemDel.marketingCurrencyCode;
			}
		};
		if($scope.itemDel.marketingRule == 0){
			$scope.cycleAmountShowD = true;
			$scope.addUpAmountShowD = false;
			$scope.randomAmountShowD = false;
		}else if($scope.itemDel.marketingRule  == 1){
			$scope.cycleAmountShowD = false;
			$scope.addUpAmountShowD = true;
			$scope.randomAmountShowD = false;
		}else if($scope.itemDel.marketingRule  == 2){
			$scope.cycleAmountShowD = false;
			$scope.addUpAmountShowD = false;
			$scope.randomAmountShowD = true;
		}
	});
	// 修改
	webApp.controller('marketingRuleUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.ruleArray = [{name : T.T('SQJ310006') ,id : '0'},{name :T.T('SQJ310007') ,id : '1'},{name : T.T('SQJ310008') ,id : '2'}] ;
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.ruleArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ruleType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.marketingRuleU = $scope.itemUpdate.marketingRule;
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
	        	$scope.operationModeUpdate = $scope.itemUpdate.operationMode;
	        }
	    };
		// 营销币种======从beta数据库core_currency查询出来
		// 营销币种======
		$scope.currencyArray = {
			type : "dynamic",
			param:{
				 "operationMode": $scope.itemUpdate.operationMode
			 },//默认查询条件 
			 text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
			 value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
			 resource:"operatCurrency.query",
			callback : function(data) {
				$scope.marketingCurrencyCodeUpdateNG = $scope.itemUpdate.marketingCurrencyCode;
			}
		};
		if($scope.itemUpdate.marketingRule == 0){
			$scope.cycleAmountShowU = true;
			$scope.addUpAmountShowU = false;
			$scope.randomAmountShowU = false;
		}else if($scope.itemUpdate.marketingRule  == 1){
			$scope.cycleAmountShowU = false;
			$scope.addUpAmountShowU = true;
			$scope.randomAmountShowU = false;
		}else if($scope.itemUpdate.marketingRule  == 2){
			$scope.cycleAmountShowU = false;
			$scope.addUpAmountShowU = false;
			$scope.randomAmountShowU = true;
		}
		var form = layui.form;
		form.on('select(getOperationModeUpdate)',function(event){
			//营销币种======从beta数据库core_currency查询出来
			 $scope.currencyArray ={ 
					 type:"dynamic", 
					 param:{
						 "operationMode":event.value,
					 },//默认查询条件 
					 text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
					 value:"currencyCode", //下拉框对应文本的值，根据需要修改字段名称 
					 resource:"operatCurrency.query",//数据源调用的action 
					 callback: function(data){
						 
					 }
			 };
		});
		form.on('select(getMarketingRulesUpdate)',function(event){
			if(event.value == 0){//循环
				$scope.cycleAmountShowU = true;
				$scope.addUpAmountShowU = false;
				$scope.randomAmountShowU = false;
			}else if(event.value == 1){//累计
				$scope.cycleAmountShowU = false;
				$scope.addUpAmountShowU = true;
				$scope.randomAmountShowU = false;
			}else if(event.value == 2){//随机
				$scope.cycleAmountShowU = false;
				$scope.addUpAmountShowU = false;
				$scope.randomAmountShowU = true;
			}
			$scope.itemUpdate.circleAmt = null;
			$scope.itemUpdate.circleDiscountAmt = null;
			$scope.itemUpdate.accumAmtLev1 = null;
			$scope.itemUpdate.accumDiscountAmtLev1 = null;
			$scope.itemUpdate.accumAmtLev2 = null;
			$scope.itemUpdate.accumDiscountAmtLev2 = null;
			$scope.itemUpdate.accumAmtLev3 = null;
			$scope.itemUpdate.accumDiscountAmtLev3 = null;
			$scope.itemUpdate.randomAmt = null;
			$scope.itemUpdate.randomDiscountAmtCeiling = null;
			$scope.itemUpdate.randomDiscountAmtFloor = null;
		});
	});
	// 营销场景识别查询及维护
	webApp.controller('marketingScenceDistinCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventTwoList = "";
		 $scope.twoBtnAddFlag = false;
		 $scope.twoBtnUpdFlag = false;
		// 运营模式======法人实体下默认缺省运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{
	        	corporationEntityNo:$scope.corporationId,
	        	requestType:1,
	        	resultType:1,
	        	adminFlagLogin:$scope.adminFlagAuth
	        	},// 默认查询条件
	        text:"modeName", // 下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  // 下拉框对应文本的值，根据需要修改字段名称
	        resource:"legalEntity.query",// 数据源调用的action
	        callback: function(data){
	        	$scope.operationModeiden = $scope.item.operationMode;
	        }
	    };
	  // 根据菜单和当前登录者查询有权限的事件编号
 	   $scope.menuNoSel = $scope.menuNo;
	   $scope.paramsNo = {
			 menuNo:$scope.menuNoSel
	   };
	  jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
		  if(data.returnData != null || data.returnData != ""){
			for(var i=0;i<data.returnData.length;i++){
				$scope.eventTwoList += data.returnData[i].eventNo + ",";
			}
   			if($scope.eventTwoList.search('AUS.PM.04.0001') != -1){    // 营销场景识别新增
				$scope.twoBtnAddFlag = true;
			}else{
				$scope.twoBtnAddFlag = false;
			}
	   	   	if($scope.eventTwoList.search('AUS.PM.04.0002') != -1){   // 营销场景识别查询
				$scope.twoBtnSelFlag = true;
			}else{
				$scope.twoBtnSelFlag = false;
			}
	   	   	if($scope.eventTwoList.search('AUS.PM.04.0003') != -1){   // 营销场景识别修改
	   	   	    $scope.twoBtnUpdFlag = true;
	   	   	}else{
	   	   	   $scope.twoBtnUpdFlag = true;
	   	   	}
	   	    if($scope.eventTwoList.search('AUS.PM.04.0003') != -1){   // 营销场景识别删除
	   	   	    $scope.twoBtnDelFlag = true;
	   	   	}else{
	   	   	   $scope.twoBtnDelFlag = true;
	   	   	}
		  }
	     });
	   // 营销清单查询
		$scope.itemList = {
			params : $scope.queryParam = {
				    "marketingSceneCode":$scope.item.marketingSceneCode,
					authDataSynFlag:"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'marketing.queryScenceDistin',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_countries'],//查找数据字典所需参数
			transDict : ['transLocation_transLocationDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	//查询详情事件
	$scope.selectListInfo = function(event) {
		console.log(event);
		// 页面弹出框事件(弹出页面)
		$scope.item = $.parseJSON(JSON.stringify(event));
		$scope.modal('/authorization/marketing/marketingScenceDistinInfo.html', $scope.item, {
			title : T.T('SQJ1700012'),
			buttons : [ T.T('F00012')],
			size : [ '1000px', '530px' ],
			callbacks : [ ]
		});
	};
	// 新增事件交易管控
	$scope.addIdentify = function(event) {
		// 页面弹出框事件(弹出页面)
		$scope.item = $.parseJSON(JSON.stringify(event));
		$scope.modal('/authorization/marketing/marketingScenceDistinAdd.html', '', {
			title : T.T('SQJ310002'),
			buttons : [ T.T('F00031'),T.T('F00012')],
			size : [ '900px', '550px' ],
			callbacks : [$scope.saveDiffInfo ]
		});
	};
	$scope.saveDiffInfo = function(result){
		console.log(result.scope.item);
		$scope.authAdd = $.parseJSON(JSON.stringify(result.scope.item));
		$scope.authAdd.startDate = $("#LAY_start_Add").val();
		$scope.authAdd.endDate = $("#LAY_end_Add").val();
 		$scope.authAdd.authDataSynFlag = "1";
 		jfRest.request('marketing','saveScenceDistin', $scope.authAdd).then(function(data) {
            if (data.returnMsg == 'OK') {
            	jfLayer.success(T.T('F00058'));
            	$scope.safeApply();
    			result.cancel();
    			$scope.authAdd = {};
    			$scope.itemList.search();
            }
        });
	};
	// 删除事件
	$scope.delInfo = function(event) {
		// 页面弹出框事件(弹出页面)
		$scope.item = $.parseJSON(JSON.stringify(event));
		$scope.modal('/authorization/marketing/marketingScenceDistinDel.html', $scope.item, {
			title : T.T('SQJ1700018'),
			buttons : [ T.T('F00016'),T.T('F00108')],
			size : [ '900px', '530px' ],
			callbacks : [ $scope.delControlSure ]
		});
	};
	// 修改弹出页面
	$scope.updateInfo = function(event) {
		// 页面弹出框事件(弹出页面)
		$scope.item = $.parseJSON(JSON.stringify(event));
		$scope.modal('/authorization/marketing/marketingScenceDistinUpdate.html', $scope.item, {
			title : T.T('SQJ1700017'),
			buttons : [ T.T('F00031'),T.T('F00012')],
			size : [ '900px', '550px' ],
			callbacks : [$scope.saveConTrad1]
		});
	};
	// 保存信息事件交易管控
	$scope.saveConTrad1 = function(result) {
		$scope.item = $.parseJSON(JSON.stringify(result.scope.item));
		$scope.item.startDate = $("#LAY_start_Update").val();
		$scope.item.endDate = $("#LAY_end_Update").val();
 		$scope.item.authDataSynFlag = "1";
 		$scope.item.transLocation = result.scope.transLocationU;
 		jfRest.request('marketing','updateScenceDistin', $scope.item).then(function(data) {
            if (data.returnMsg == 'OK') {
            	jfLayer.success(T.T('F00058'));
            	$scope.safeApply();
    			result.cancel();
    			$scope.authAdd = {};
    			$scope.itemList.search();
            }
        });
	 };
	// 保存信息事件交易管控
		$scope.delControlSure = function(result) {
			$scope.item = $.parseJSON(JSON.stringify(result.scope.item));
	 		$scope.item.authDataSynFlag = "1";
	 		$scope.item.invalidFlag = "1";
	 		jfRest.request('marketing','updateScenceDistin', $scope.item).then(function(data) {
	            if (data.returnMsg == 'OK') {
	            	jfLayer.success(T.T('F00037'));
	            	$scope.safeApply();
	    			result.cancel();
	    			$scope.authAdd = {};
	    			$scope.itemList.search();
	            }
	        });
		 };
	});
	// 管控场景建立
	webApp.controller('marketingScenceDistinAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		 $scope.corporationId = sessionStorage.getItem("corporation");
		// 运营模式======法人实体下默认缺省运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{
	        	corporationEntityNo:$scope.corporationId,
	        	requestType:1,
	        	resultType:1,
	        	adminFlagLogin:$scope.adminFlagAuth
	        	},// 默认查询条件
	        text:"modeName", // 下拉框显示内容，根据需要修改字段名称
	        value:"operationMode",  // 下拉框对应文本的值，根据需要修改字段名称
	        resource:"legalEntity.query",// 数据源调用的action
	        callback: function(data){
	        	$scope.item.operationModeiden = $scope.item.operationMode;
	        }
	    };
		// 日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#LAY_start_Add',
					min:Date.now(),
					done: function(value, date) {
						endDate.config.min = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						endDate.config.start = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
					}
				});
				var endDate = laydate.render({
					elem: '#LAY_end_Add',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						}
					}
				});
		});
		$scope.countriesArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_countries",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
	   });
	//查询详情
	webApp.controller('marketingScenceDistinInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		 $scope.listTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_countries",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.transLocationInfo = $scope.item.transLocation;
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
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };
		// 自定义下拉框---------交易地点
		 $scope.listTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_countries",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.transLocationInfo = $scope.item.transLocation;
		        }
			};
	});
	//修改
	webApp.controller('marketingScenceDistinUpdCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		 $scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		 $scope.corporationId = sessionStorage.getItem("corporation");
		 $scope.listTypeArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_countries",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLocationU = $scope.item.transLocation;
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
	        	$scope.item.operationModeUpdate = $scope.item.operationMode;
	        }
	    };
		 if($scope.item.transLocation == "0"){
			 $scope.transLocationInfo = T.T('SQJ310027');
		 }
		 else if($scope.item.transLocation == "1"){
			 $scope.transLocationInfo = T.T('SQJ310028');
		 }else if($scope.item.transLocation == "2"){
			 $scope.transLocationInfo = T.T('SQJ310029');
         }
        // 自定义下拉框---------交易地点
			//日期控件
			layui.use('laydate', function(){
				  var laydate = layui.laydate;
				  var startDate = laydate.render({
						elem: '#LAY_start_Update',
						min:Date.now(),
						done: function(value, date) {
							endDate.config.min = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							endDate.config.start = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
						}
					});
					var endDate = laydate.render({
						elem: '#LAY_end_Update',
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							}
						}
					}); 
			});
			//日期控件end
	});
});
