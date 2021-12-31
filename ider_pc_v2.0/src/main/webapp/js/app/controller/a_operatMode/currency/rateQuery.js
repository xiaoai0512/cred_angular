'use strict';
define(function(require) {
	var webApp = require('app');
	// 查询维护汇率
	webApp.controller('rateQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_rate');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0022') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	 	if($scope.eventList.search('COS.AD.02.0022') != -1){    //查询
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0022') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		//营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.rateList = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'rate.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//新增
		$scope.addExchangeList = function(event){
			// 页面弹出框事件(弹出页面)
			event.preventDefault();//阻止浏览器默认行为，阻止页面被重定向
			$scope.modal('/a_operatMode/currency/rateEst.html','',{
				title : T.T('YYJ1100002'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '950px', '420px' ],
				callbacks : [$scope.saveAddRateList]
			});
		};
		$scope.saveAddRateList = function(result){
			//console.log(result);
			$scope.rateInf={};
			$scope.rateInf = result.scope.rateInf;
			jfRest.request('rate', 'save', $scope.rateInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.rateInf = {};
					result.scope.rateForm.$setPristine();
					$scope.rateList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//复制
		$scope.addRateListCopy = function(event){
			$scope.rateInfCopy = {};
			$scope.rateInfCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/currency/updateRateCopy.html',$scope.rateInfCopy, {
				title : T.T('YYJ1100003'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.addRateListCopyList]
			});
		};
		$scope.addRateListCopyList =function(result){
			$scope.rateCopy={};
			$scope.rateCopy = result.scope.rateInfCopy;
			jfRest.request('rate', 'save', $scope.rateCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.rateCopy = {};
					result.scope.rateForm.$setPristine();
					$scope.rateList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		$scope.checkCurrencyRate = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			//$scope.item = event;
			$scope.modal('/a_operatMode/currency/updateRate.html',
			$scope.item, {
				title : T.T('YYJ1100001'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '950px', '350px' ],
				callbacks : [ $scope.callback ]
			});
		};
		$scope.paramss = {};
		$scope.callback = function(result) {
			$scope.paramss = result.scope.checkCurrencyRateInfo;
			jfRest.request('rate', 'update', $scope.paramss)// Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.rateList.search();
				}
			});
		}
	});
	webApp.controller('updateRateCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.checkCurrencyRateInfo = $scope.item;
		//法人实体编号
		 $scope.corporationEntityNoArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };
	});
	//新增汇率
	webApp.controller('rateEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_rate');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.rateInf = {};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	console.log(data);
	        }
		};
		 //币种
		 $scope.currencyArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"currency.query",//数据源调用的action 
	        callback: function(data){
	        	console.log(data);
	        }
	    };
		//法人实体编号
		 $scope.corporationEntityNoArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        	console.log(data);
	        }
	    };
	});
	//复制页面控制器
	webApp.controller('updateRateCtrlCopy', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_rate');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	
	        }
		};
		 //币种
		 $scope.currencyArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"currency.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };
		//法人实体编号
		 $scope.corporationEntityNoArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };
	});
});
