'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易管控建立
	webApp.controller('entryAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_entryAdd');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.operationMode = lodinDataService.getObject("operationMode");//
				//自定义下拉框---------交易来源
			$scope.codeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_codeType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//交易机构
			$scope.transOrganiArr = { 
			        type:"dynamic", 
			        param:{
			        },//默认查询条件 
			        text:"organName", //下拉框显示内容，根据需要修改字段名称 
			        value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"principalDebitTrans.queryTransOrgani",//数据源调用的action 
			        callback: function(data){
			        }
				};
			//交易币种
			var list = [];
			list[0]="156";
			list[1]="840";
			list[2]="978";
			list[3]="392";
			list[4]="344";
			$scope.billingCurrency = { 
			        type:"dynamic", 
			        param:{
			        	"priorityCurrencyList":list 
		        	} ,//默认查询条件 
			        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operatCurrency.queryCurrency",//数据源调用的action 
			        callback: function(data){
			        		
			        }
			};
			// 交易场景下拉框
			$scope.transSceneArray = {
				type: "dynamicDesc",
				param: {
					operationMode: $scope.operationMode,
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
			//入账币种
			$scope.billingFigure = { 
			        type:"dynamic", 
			        param:{
			        	"queryCurrencyDesc":true,
				        "operationMode" : $scope.operationMode
			        	} ,//默认查询条件 
			        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operatCurrency.query",//数据源调用的action 
			        callback: function(data){
			        	console.log(data);
			        	
			        }
			};
			$scope.flagArray ={ 
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
		        }
			};
			// 事件清单列表
			$scope.itemList = {
				checkType : 'radio',
				params : $scope.queryParam = {
						"pageSize" : 10,
						"indexNo" : 0,
						queryType : "AUTH"
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'evLstList.queryFiniTrans',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
//			//根据入账币种判断入账金额
//			var form = layui.form;
//			form.on('select(getrpyTxnCurr)',function(event){
//				if(($scope.ent.ecommField49 == null || $scope.ent.ecommField49 == undefined || $scope.ent.ecommField49 == "") ||
//						($scope.ent.ecommField4 == null || $scope.ent.ecommField49 == undefined || $scope.ent.ecommField49 == "")){
//					jfLayer.fail(T.T('KHJ1500005'));
//					$scope.ent.ecommField49 = "";
//				}else{
//					if($scope.ent.ecommField51 == $scope.ent.ecommField49){
//						$scope.ent.ecommField6 = $scope.ent.ecommField4;
//					}else{
//						$scope.rpyTxnSplmtEntrgInfo.ent.ecommField6 = "";
//					}
//				}
//			});
//			//根据交易币种判断入账金额 交易金额
//			form.on('select(getTransCur)',function(event){
//				if($scope.ent.ecommField49 == $scope.ent.ecommField51){
//					$scope.ent.ecommField4 = $scope.ent.ecommField6;
//				}else{
//					$scope.ent.ecommField6 = "";
//				}
//			});
//			$("#transAmoun").on("keyup", function() {
//				if($scope.ent.ecommField49 == $scope.ent.ecommField51){
//					$scope.ent.ecommField6 = $scope.ent.ecommField4;
//				}else{
//					$scope.ent.ecommField6 = "";
//				}
//			});
			//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
			$scope.queryDate =function(){
				$scope.params ={};
				$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
				jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						$scope.ecommTransDate = data.returnData.rows[0].nextProcessDate;
					}
				});
			};
			$scope.queryDate();
        	// 保存信息事件
			$scope.saveEntryInfo = function() {
			    if (!$scope.itemList.validCheck()) {
					return;
				}
				$scope.eventNoTrends = "";
				$scope.eventNoTrends = "/authService/" + $scope.itemList.checkedList().eventNo;
				$scope.saveEntryInfo.ecommEventId = $scope.itemList.checkedList().eventNo;
				$scope.saveEntryInfo.eventId = $scope.itemList.checkedList().eventNo;
				$scope.ent.ecommCardAssociations = 'L';
			    $scope.ent.corporationEntityNo = sessionStorage.getItem("corporation");
			    $scope.transArr = [];
			    $scope.transArr.push($scope.ent);
			    $scope.entList = {};
			    $scope.entList = {transList:$scope.transArr};
				//$scope.ent.authDataSynFlag = "1";
				jfRest.request('fncTxnMgt', 'trends', $scope.entList,'',$scope.eventNoTrends).then(function(data) {
  	                if (data.returnCode == '000000') {
  	                	 	jfLayer.success(T.T('F00064'));
      	                	$scope.ent={};
      	                	$scope.mdmInfoForm.$setPristine();
  	                	
  	                }
  	            });
			};
	});
});
