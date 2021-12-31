'use strict';
define(function(require) {
	var webApp = require('app');
	//二次识别参数维护
	webApp.controller("twoDisParamsQueryCtrl", function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
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
		   	   		if($scope.eventList.search('COS.IQ.02.0043') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0037') != -1){    //新增
			   	   		$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0040') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
  			//查看还款优先级
  			$scope.choseBtnPriority = function() {
  				$scope.params = {
  					"pageSize" : 10,
  					"indexNo" : 0
  				};
  				// 页面弹出框事件(弹出页面)
  				$scope.modal('/cstSvc/twoDisParams/viewTwoDisParamsPriority.html', $scope.params, {
  					title : T.T('YYJ1400027'),
  					buttons : [ T.T('F00012') ],
  					size : [ '1000px', '500px' ],
  					callbacks : []
  				});
  			};
		//運營模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 $scope.recogTypeArr = [{name:T.T('YYJ1400001'),id:"T"},{name:T.T('YYJ1400002'),id:"P"}];
		 $scope.statusArr = [{name:T.T('YYJ1400003'),id:"A"},{name:T.T('YYJ1400004'),id:"I"},{name:T.T('YYJ1400015'),id:"P"}];
		 $scope.dateConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];
		 $scope.mccConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];
		 $scope.transCurrCodeConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];
		 $scope.transCountryConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];
		 $scope.transTypeConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];
		 $scope.transSourceConditionArr =[{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];
		 $scope.blockCodeRangeArr = [{name:T.T('YYJ1400016'),id:"C"},{name:T.T('YYJ1400017'),id:"A"},{name:T.T('YYJ1400018'),id:"P"},{name:T.T('YYJ1400019'),id:"M"}];
		 $scope.blockTypeArr = [{name:"A",id:"A"},{name:"B",id:"B"},{name:"C",id:"C"},{name:"D",id:"D"},{name:"E",id:"E"},
			                       {name:"F",id:"F"},{name:"G",id:"G"},{name:"H",id:"H"},{name:"I",id:"I"},{name:"J",id:"J"},
			                       {name:"K",id:"K"},{name:"L",id:"L"},{name:"M",id:"M"},{name:"N",id:"N"},{name:"O",id:"O"},{name:"P",id:"P"},
			                       {name:"Q",id:"Q"},{name:"R",id:"R"},{name:"S",id:"S"},{name:"T",id:"T"},{name:"U",id:"U"},
			                       {name:"V",id:"V"},{name:"W",id:"W"},{name:"X",id:"X"},{name:"Y",id:"Y"},{name:"Z",id:"Z"} ];//
		$scope.twoDisParamsList = {
//			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'twoDisParams.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_recognitionCategory','dic_state'],//查找数据字典所需参数
			transDict : ['recogType_recogTypeDesc','status_statusDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkTwoDisParams = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.twoDisParamsItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/twoDisParams/viewTwoDisParams.html', $scope.twoDisParamsItem, {
				title : T.T('YYJ1400028'),
				buttons : [T.T('F00012') ],
				size : [ '900px', '580px' ],
				callbacks :[]
			});
		};
		//新增
		$scope.addTwoDisParamsList = function(){		
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/twoDisParams/twoDisParamsEst.html', '', {
				title : T.T('YYJ1400026'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '580px' ],
				callbacks : [$scope.saveAddTwoDisParams]
			});
		};
		//保存新增回调函数
		$scope.saveAddTwoDisParams = function(result){
			$scope.blockCodeInf = {};
			$scope.blockCodeInf = result.scope.blockCodeInf;
			if($scope.blockCodeInf.startDate>$scope.blockCodeInf.endDate){
				jfLayer.fail(T.T('YYJ1400009'));
				return;
			}
			if($scope.blockCodeInf.dateStartSegment1>$scope.blockCodeInf.dateEndSegment1){
				jfLayer.fail(T.T('YYJ1400010'));
				return;
			}
			if($scope.blockCodeInf.dateStartSegment2>$scope.blockCodeInf.dateEndSegment2){
				jfLayer.fail(T.T('YYJ1400011'));
				return;
			}
			if($scope.blockCodeInf.dateStartSegment3>$scope.blockCodeInf.dateEndSegment3){
				jfLayer.fail(T.T('YYJ1400012'));
				return;
			}
			if($scope.blockCodeInf.dateStartSegment4>$scope.blockCodeInf.dateEndSegment4){
				jfLayer.fail(T.T('YYJ1400013'));
				return;
			}
			if($scope.blockCodeInf.dateStartSegment5>$scope.blockCodeInf.dateEndSegment5){
				jfLayer.fail(T.T('YYJ1400014'));
				return;
			}
			jfRest.request('twoDisParams','save', $scope.blockCodeInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					result.scope.twoDisParamsInfForm.$setPristine();
					$scope.blockCodeInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.twoDisParamsList.search();
				}
			});
		};
		//复制
		$scope.updateTwoDisParamsCopy = function(event){
			$scope.blockCodeInfCopy={};
			$scope.blockCodeInfCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)                                                     
			$scope.modal('/cstSvc/twoDisParams/twoDisParamsCopy.html', $scope.blockCodeInfCopy, {
				title :  T.T("YYJ1400029"),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '580px' ],
				callbacks : [ $scope.saveTwoDisParamsCopy]
			});				
		};
		//复制回调函数
		$scope.saveTwoDisParamsCopy = function(result){
			$scope.blockCodeCopy = {};
			$scope.blockCodeCopy = result.scope.blockCodeInfCopy;
			$scope.blockCodeCopy.transSourceCondition = result.scope.transSourceCondition;
			$scope.blockCodeCopy.transCountryCondition = result.scope.transCountryCondition;
			$scope.blockCodeCopy.transCurrCodeCondition = result.scope.transCurrCodeCondition;
			$scope.blockCodeCopy.mccCondition = result.scope.mccCondition;
			$scope.blockCodeCopy.dateCondition = result.scope.dateCondition;
			$scope.blockCodeCopy.status = result.scope.status;
			$scope.blockCodeCopy.recogType = result.scope.recogType;
			$scope.blockCodeCopy.merchantCdeCondition = result.scope.merchantCdeCondition;
			if($scope.blockCodeCopy.startDate>$scope.blockCodeCopy.endDate){
				jfLayer.fail(T.T('YYJ1400009'));
				return;
			}
			if($scope.blockCodeCopy.dateStartSegment1>$scope.blockCodeCopy.dateEndSegment1){
				jfLayer.fail(T.T('YYJ1400010'));
				return;
			}
			if($scope.blockCodeCopy.dateStartSegment2>$scope.blockCodeCopy.dateEndSegment2){
				jfLayer.fail(T.T('YYJ1400011'));
				return;
			}
			if($scope.blockCodeCopy.dateStartSegment3>$scope.blockCodeCopy.dateEndSegment3){
				jfLayer.fail(T.T('YYJ1400012'));
				return;
			}
			if($scope.blockCodeCopy.dateStartSegment4>$scope.blockCodeCopy.dateEndSegment4){
				jfLayer.fail(T.T('YYJ1400013'));
				return;
			}
			if($scope.blockCodeCopy.dateStartSegment5>$scope.blockCodeCopy.dateEndSegment5){
				jfLayer.fail(T.T('YYJ1400014'));
				return;
			}
			jfRest.request('twoDisParams','save', $scope.blockCodeCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					result.scope.twoDisParamsInfForm.$setPristine();
					$scope.blockCodeCopy = {};
					$scope.safeApply();
					result.cancel();
					$scope.twoDisParamsList.search();
				}
			});
		};
		//修改
		$scope.updateTwoDisParams = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.upTwoDisParamsItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/twoDisParams/updateTwoDisParams.html', $scope.upTwoDisParamsItem, {
				title : T.T('YYJ1400030'),
				buttons : [T.T('F00107'), T.T('F00012')  ],
				size : [ '1000px', '580px' ],
				callbacks : [$scope.saveTwoDisParamsInf]
			});
		};
		//保存
		$scope.saveTwoDisParamsInf = function (result){
			if($scope.upTwoDisParamsItem.startDate>$scope.upTwoDisParamsItem.endDate){
				jfLayer.fail(T.T('YYJ1400009'));
				return;
			}
			if($scope.upTwoDisParamsItem.dateStartSegment1>$scope.upTwoDisParamsItem.dateEndSegment1){
				jfLayer.fail(T.T('YYJ1400010'));
				return;
			}
			if($scope.upTwoDisParamsItem.dateStartSegment2>$scope.upTwoDisParamsItem.dateEndSegment2){
				jfLayer.fail(T.T('YYJ1400011'));
				return;
			}
			if($scope.upTwoDisParamsItem.dateStartSegment3>$scope.upTwoDisParamsItem.dateEndSegment3){
				jfLayer.fail(T.T('YYJ1400012'));
				return;
			}
			if($scope.upTwoDisParamsItem.dateStartSegment4>$scope.upTwoDisParamsItem.dateEndSegment4){
				jfLayer.fail(T.T('YYJ1400013'));
				return;
			}
			if($scope.upTwoDisParamsItem.dateStartSegment5>$scope.upTwoDisParamsItem.dateEndSegment5){
				jfLayer.fail(T.T('YYJ1400014'));
				return;
			}
			$scope.upTwoDisParamsItem.operationMode = result.scope.updateOperationMode;
			$scope.upTwoDisParamsItem.recogType = result.scope.recogType;
			$scope.upTwoDisParamsItem.status = result.scope.status;
			$scope.upTwoDisParamsItem.dateCondition = result.scope.dateCondition;
			$scope.upTwoDisParamsItem.mccCondition = result.scope.mccCondition;
			$scope.upTwoDisParamsItem.transCurrCodeCondition = result.scope.transCurrCodeCondition;
			$scope.upTwoDisParamsItem.transCountryCondition = result.scope.transCountryCondition;
			$scope.upTwoDisParamsItem.transSourceCondition = result.scope.transSourceCondition;
			$scope.upTwoDisParamsItem.merchantCdeCondition=result.scope.merchantCdeCondition;
			jfRest.request('twoDisParams', 'update', $scope.upTwoDisParamsItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.twoDisParamsList.search();
				}
			});
		}
	});
	//查询二次识别参数
	webApp.controller('viewTwoDisParamsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
		$translate.refresh();
		//识别类别
	    $scope.recogTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_recognitionCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.recogType=$scope.twoDisParamsItem.recogType;
			}
		};
	    //状态
		$scope.statusArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_state",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.status=$scope.twoDisParamsItem.status;
			}
		};
		//日期条件 
		$scope.dateConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dateCondition=$scope.twoDisParamsItem.dateCondition;
			}
		};
		//MCC条件 I:包含 E:不包含 N:无效
		$scope.mccConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.mccCondition=$scope.twoDisParamsItem.mccCondition;
			}
		};
		//交易币种条件 I:包含 E:不包含 N:无效
		$scope.transCurrCodeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transCurrCodeCondition=$scope.twoDisParamsItem.transCurrCodeCondition;
			}
		};
		//交易国家条件I:包含 E:不包含 N:无效
		$scope.transCountryConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transCountryCondition=$scope.twoDisParamsItem.transCountryCondition
			}
		};
		//交易来源条件
		$scope.transSourceConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transSourceCondition=$scope.twoDisParamsItem.transSourceCondition;
			}
		};
		//商户代码条件
		$scope.merchantCdeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.merchantCdeCondition=$scope.twoDisParamsItem.merchantCdeCondition;
			}
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewOperationMode = $scope.twoDisParamsItem.operationMode;
	        }
	    };
		//构件实例列表
		$scope.artifactTable = {
			params : {
				"operationMode" :$scope.twoDisParamsItem.operationMode,
				"instanCode" :$scope.twoDisParamsItem.blockCodeType+$scope.twoDisParamsItem.blockCodeScene,
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//修改二次识别参数
	webApp.controller('updateTwoDisParamsCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
		$translate.refresh();
		//识别类别
	    $scope.recogTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_recognitionCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.recogType=$scope.upTwoDisParamsItem.recogType;
			}
		};
	    //状态
		$scope.statusArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_state",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.status=$scope.upTwoDisParamsItem.status;
			}
		};
		//日期条件 
		$scope.dateConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dateCondition=$scope.upTwoDisParamsItem.dateCondition;
			}
		};
		//MCC条件 I:包含 E:不包含 N:无效
		$scope.mccConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.mccCondition=$scope.upTwoDisParamsItem.mccCondition;
			}
		};
		//交易币种条件 I:包含 E:不包含 N:无效
		$scope.transCurrCodeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transCurrCodeCondition=$scope.upTwoDisParamsItem.transCurrCodeCondition;
			}
		};
		//交易国家条件I:包含 E:不包含 N:无效
		$scope.transCountryConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transCountryCondition=$scope.upTwoDisParamsItem.transCountryCondition;
			}
		};
		//交易来源条件
		$scope.transSourceConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transSourceCondition=$scope.upTwoDisParamsItem.transSourceCondition;
			}
		};
		//商户代码条件
		$scope.merchantCdeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.merchantCdeCondition=$scope.upTwoDisParamsItem.merchantCdeCondition;
			}
		};
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateOperationMode = $scope.upTwoDisParamsItem.operationMode
		        }
		    };
		if($scope.upTwoDisParamsItem.status == "P"){
			$("#status").attr("disabled",true);
		}
	});
	//复制页面控制器
	webApp.controller('updateTwoDisParamsCtrlCopy', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		//识别类别
	    $scope.recogTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_recognitionCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.recogType = $scope.blockCodeInfCopy.recogType;
			}
		};
	    //状态
		$scope.statusArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_state",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.status = $scope.blockCodeInfCopy.status;
			}
		};
		//日期条件 
		$scope.dateConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dateCondition=$scope.blockCodeInfCopy.dateCondition;
			}
		};
		//MCC条件 I:包含 E:不包含 N:无效
		$scope.mccConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.mccCondition=$scope.blockCodeInfCopy.mccCondition;
			}
		};
		//交易币种条件 I:包含 E:不包含 N:无效
		$scope.transCurrCodeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transCurrCodeCondition=$scope.blockCodeInfCopy.transCurrCodeCondition;
			}
		};
		//交易国家条件I:包含 E:不包含 N:无效
		$scope.transCountryConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transCountryCondition = $scope.blockCodeInfCopy.transCountryCondition;
			}
		};
		//交易来源条件
		$scope.transSourceConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transSourceCondition = $scope.blockCodeInfCopy.transSourceCondition;
			}
		};
		//商户代码条件
		$scope.merchantCdeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.merchantCdeCondition=$scope.blockCodeInfCopy.merchantCdeCondition;
			}
		};
		//交易类型条件
		//$scope.transTypeConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];//交易类型条件
		var form = layui.form;
			form.on('select(recogType)',function(event){
				if(event.value == "T"){
					$("#activityTagNo").attr("disabled",true);
					$("#targetActivity").attr("disabled",false);
					$("#targetBussType").attr("disabled",false);
					$("#targetBalanceObject").attr("disabled",false);
				}
				else if(event.value == "P"){
					$("#activityTagNo").attr("disabled",false);
					$("#targetActivity").attr("disabled",true);
					$("#targetBussType").attr("disabled",true);
					$("#targetBalanceObject").attr("disabled",true);
				}
				else{
					$("#activityTagNo").attr("disabled",false);
					$("#targetActivity").attr("disabled",false);
					$("#targetBussType").attr("disabled",false);
					$("#targetBalanceObject").attr("disabled",false);
				}
			});
		$scope.choseeventNo = function(){
			//弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/twoDisParams/choseEvLstList.html', $scope.params, {
				title : T.T('YYJ1400008'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseEvLstList]
			});
		};
		$scope.choseEvLstList = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.blockCodeInfCopy.eventNo  = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		 //運營模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeCopy = $scope.blockCodeInfCopy.operationMode;
	        }
	    };
	});
	//新增
	//二次识别参数建立
	webApp.controller('twoDisParamsEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		//识别类别
	    $scope.recogTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_recognitionCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};	   
		//状态
		$scope.statusArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_state",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//日期条件 
		$scope.dateConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//MCC条件 I:包含 E:不包含 N:无效
		$scope.mccConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//交易币种条件 I:包含 E:不包含 N:无效
		$scope.transCurrCodeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//交易国家条件I:包含 E:不包含 N:无效
		$scope.transCountryConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//交易类型条件
		//$scope.transTypeConditionArr = [{name:T.T('YYJ1400005'),id:"I"},{name:T.T('YYJ1400006'),id:"E"},{name:T.T('YYJ1400007'),id:"N"}];//交易类型条件
		//交易来源条件
		$scope.transSourceConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateConditions",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//商户代码条件
		$scope.merchantCdeConditionArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_merchantCodeCondition",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		 var form = layui.form;
			form.on('select(recogType)',function(event){
				if(event.value == "T"){
					$("#activityTagNo").attr("disabled",true);
					$("#targetActivity").attr("disabled",false);
					$("#targetBussType").attr("disabled",false);
					$("#targetBalanceObject").attr("disabled",false);
				}
				else if(event.value == "P"){
					$("#activityTagNo").attr("disabled",false);
					$("#targetActivity").attr("disabled",true);
					$("#targetBussType").attr("disabled",true);
					$("#targetBalanceObject").attr("disabled",true);
				}
				else{
					$("#activityTagNo").attr("disabled",false);
					$("#targetActivity").attr("disabled",false);
					$("#targetBussType").attr("disabled",false);
					$("#targetBalanceObject").attr("disabled",false);
				}
			});
		$scope.blockCodeInf = {};
		$scope.choseeventNo = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/cstSvc/twoDisParams/choseEvLstList.html', $scope.params, {
					title : T.T('YYJ1400008'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.choseEvLstList]
				});
		};
		$scope.choseEvLstList = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.blockCodeInf.eventNo  = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		 //運營模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
			    };
	});
	//事件
	webApp.controller('evLstListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('viewTwoDisParamsPriorityCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/twoDisParams/i18n_twoDisParams');
		$translate.refresh();
		$scope.twoDisParamsTable = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'twoDisParams.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_recognitionCategory'],//查找数据字典所需参数
			transDict : ['recogType_recogTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
});
