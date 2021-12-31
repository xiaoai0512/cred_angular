'use strict';
define(function(require) {
	var webApp = require('app');
	//货币查询及维护
	webApp.controller('currencyQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0012') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0012') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0012') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
 				}
 			});
		/*非自由兑换标识下拉框  Y-自由，N-非自由*/
		 $scope.freeExchangeFlagArrays ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_exchangeMark",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//货币列表
		$scope.currencyTable = {
//			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_exchangeMark'],//查找数据字典所需参数
			transDict : ['freeExchangeFlag_freeExchangeFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//修改
		$scope.updateCurrency = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/currency/updateCurrency.html', $scope.items, {
				title : T.T('PZH900007'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '330px' ],
				callbacks : [$scope.sureUpdateCurrency]
			});
		};
		//确认修改
		$scope.sureUpdateCurrency = function (result){
			$scope.items.freeExchangeFlag=result.scope.freeExchangeFlag;
			$scope.items = result.scope.items;
			if( 'N' == $scope.items.freeExchangeFlag && null == $scope.items.countryCode){
				jfLayer.fail(T.T('PZJ900007'));
				return;
			}
			jfRest.request('currency', 'update', $scope.items)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
						result.cancel();
					 $scope.currencyTable.search();
				}
			});
		};
		//新增
		$scope.addCurrency = function(){
			$scope.currencyInf = {};
			$scope.modal('/a_operatMode/currency/currencyEst.html', $scope.currencyInf, {
				title : T.T('PZH900007'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '330px' ],
				callbacks : [$scope.sureAddCurrency]
			});
		};
		$scope.sureAddCurrency = function(result){
			// 页面弹出框事件(弹出页面)
			$scope.currencyInf = result.scope.currencyInf;
			if( 'N' == $scope.currencyInf.freeExchangeFlag && null == $scope.currencyInf.countryCode){
				jfLayer.fail(T.T('PZJ900007'));
				return;
			}
			jfRest.request('currency', 'save', $scope.currencyInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					 $scope.safeApply();
						result.cancel();
					 $scope.currencyTable.search();
				}
			});
		};
	});
	webApp.controller('currencyUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		/*非自由兑换标识下拉框  Y-自由，N-非自由*/
		 $scope.freeExchangeFlagArrays ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_exchangeMark",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.freeExchangeFlag=$scope.items.freeExchangeFlag;
	        }
		};
	});
	// 货币新建
	webApp.controller('currencyEstCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.currencyInf = {};
		/*非自由兑换标识下拉框  Y-自由，N-非自由*/
		 $scope.freeExchangeFlagArrays ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_exchangeMark",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};		
		$scope.currencyInf = $scope.currencyInf;
	});
});
