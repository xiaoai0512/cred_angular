'use strict';
define(function(require) {
	var webApp = require('app');
	// 收费项目目录查询
	webApp.controller('payProjectCatalogueCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
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
			   	   	if($scope.eventList.search('COS.AD.02.0027') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
 				}
 			});
		//费用类别
		$scope.feeTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_costCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};	
		//查询类型下拉框
		 $scope.periodArray ={ 
		        type:"dictData", 
		        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
		        text:"codes", //下拉框显示内容，根据需要修改字段名称 
		        desc:"detailDesc",
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//收费目录列表
		$scope.payProList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'feeProject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory','dic_instanceDimension','dic_instanceDimension'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc','instanCode1_instanCode1Desc','instanCode2_instanCode2Desc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkProCatalogue =  function(event) {
			$scope.proCatalogueInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewProjectCatalogue.html',
			$scope.proCatalogueInf, {
				title : T.T('YYJ1200017'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		};
		// 查询事件
		$scope.checkPayPro = function(event) {
			$scope.payProInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/payProjectEvent.html',
			$scope.payProInf, {
				title : T.T('YYJ1200008'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		};
		// 查询实例
		$scope.updateOptModeInf = function(event) {
			$scope.payProInf2 = {};
			$scope.payProInf2 = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/payProjectInstan.html',$scope.payProInf2, {
				title : T.T('YYJ1200009'),
				buttons : [  T.T('F00012') ],
				size : [ '1200px', '580px' ],
				callbacks : [  ]
			});
		};
		// 新增实例
		$scope.addPayProExample = function(event) {
			console.log(event);
			$scope.payProExampleadd = {};
			$scope.payProExampleadd = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/payProExample.html',$scope.payProExampleadd, {
				title : T.T('YYJ1300066'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : [$scope.savePayProExample]
			});
		};
		$scope.savePayProExample = function(result){
			$scope.payProExampleInf = {};
			$scope.payProExampleInf =  Object.assign(result.scope.payProExampleadd , result.scope.payProExampleInf2);
			if($scope.payProExampleInf.feeItemNo == "LCHG025" && (result.scope.payProExampleInf2.feeMatrixApplicationDimension == "" || 
					result.scope.payProExampleInf2.feeMatrixApplicationDimension ==  undefined || result.scope.payProExampleInf2.feeMatrixApplicationDimension ==  "undefined")){
				jfLayer.fail(T.T("YYJ1300042"));
				return;
            }
            if((result.scope.payProExampleInf2.feeMatrixApplicationDimension != "" || result.scope.payProExampleInf2.feeMatrixApplicationDimension !=  undefined ||
					result.scope.payProExampleInf2.feeMatrixApplicationDimension !=  "undefined") && (result.scope.payProExampleInf2.matrixAppMode != "" || 
					result.scope.payProExampleInf2.matrixAppMode !=  undefined || result.scope.payProExampleInf2.matrixAppMode !=  "undefined")){
				if(result.scope.payProExampleInf2.feeMatrixApplicationDimension == "2" && result.scope.payProExampleInf2.matrixAppMode == "P"){
					jfLayer.fail(T.T("YYJ1300043"));
					return;
				}
            }
            if($scope.payProExampleInf.instanDimen1 && $scope.payProExampleInf.instanDimen1 !="null"){
				if($scope.payProExampleInf.instanCode1 =="" || $scope.payProExampleInf.instanCode1 ==  undefined || 
						$scope.payProExampleInf.instanCode1 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300044"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen2  && $scope.payProExampleInf.instanDimen2 !="null"){
				if($scope.payProExampleInf.instanCode2 =="" || $scope.payProExampleInf.instanCode2 ==  undefined || 
						$scope.payProExampleInf.instanCode2 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300045"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen3  && $scope.payProExampleInf.instanDimen3 !="null"){
				if($scope.payProExampleInf.instanCode3 =="" || $scope.payProExampleInf.instanCode3 ==  undefined || 
						$scope.payProExampleInf.instanCode3 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300046"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen4  && $scope.payProExampleInf.instanDimen4 !="null"){
				if($scope.payProExampleInf.instanCode4 =="" || $scope.payProExampleInf.instanCode4 ==  undefined || 
						$scope.payProExampleInf.instanCode4 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300047"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen5 && $scope.payProExampleInf.instanDimen5 !="null"){
				if($scope.payProExampleInf.instanCode5 =="" || $scope.payProExampleInf.instanCode5 ==  undefined || 
						$scope.payProExampleInf.instanCode5 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300048"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen1 == "FTYP" || $scope.payProExampleInf.instanDimen2 == "FTYP" || $scope.payProExampleInf.instanDimen3 == "FTYP"
				|| $scope.payProExampleInf.instanDimen4 == "FTYP" || $scope.payProExampleInf.instanDimen5 == "FTYP"){
				if($scope.payProExampleInf.feeCollectType == "" || $scope.payProExampleInf.feeCollectType ==  undefined || 
						$scope.payProExampleInf.feeCollectType ==  "undefined"){
					jfLayer.fail(T.T("YYJ1300049"));
					return;
				}else{
					if($scope.payProExampleInf.instanDimen1 == "FTYP"){
						if($scope.payProExampleInf.instanCode1 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen2 == "FTYP"){
						if($scope.payProExampleInf.instanCode2 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen3 == "FTYP"){
						if($scope.payProExampleInf.instanCode3 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen4 == "FTYP"){
						if($scope.payProExampleInf.instanCode4 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen5 == "FTYP"){
						if($scope.payProExampleInf.instanCode5 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}
				}
            }
            if($scope.payProExampleInf.feeFlag == 'P'){
				if($scope.payProExampleInf.feeRate1){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate1)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate2){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate2)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate3){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate3)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate4){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate4)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate5){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate5)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
			}
			jfRest.request('feeProExample', 'save', $scope.payProExampleInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.payProExampleInf = {};
					result.scope.payProExampleInfForm.$setPristine();
					$scope.payProList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//查看
	webApp.controller('payProjectEventCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translate.refresh();
		// 事件清单列表
		$scope.itemList = {
			params : $scope.queryParam = {
				"feeItemNo": $scope.payProInf.feeItemNo,	
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	//查看
	webApp.controller('viewProjectCatalogueCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.methodShow = false;
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		//分期费用收取方式 0: 一次性收取，1：分期收取
		//$scope.feeCollectTypeArr = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
		//$scope.feeMatrixApplicationDimension = [{name : T.T('YYJ1300061'),id : '1'},{name : T.T('YYJ1300037'),id : '2'}];
		$scope.proCatalogueInf = $scope.proCatalogueInf;
		//维度取值1 
		$scope.instanDimenArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_instanceDimension",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.instanCode1 = $scope.proCatalogueInf.instanCode1;
				$scope.instanCode2 = $scope.proCatalogueInf.instanCode2;
				$scope.instanCode3 = $scope.proCatalogueInf.instanCode3;
				$scope.instanCode4 = $scope.proCatalogueInf.instanCode4;
				$scope.instanCode5 = $scope.proCatalogueInf.instanCode5;
			}
		};
		//项目用途C: 费用计算，P:费用入账
		 $scope.itemUseArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_projectUse",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.itemUseInfo=$scope.proCatalogueInf.itemUse;
	        }
		};
		//费用类别
		$scope.feeTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_instanceDimension",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.feeType = $scope.proCatalogueInf.feeType;
			}
		};	
		 /*收取频率
		  * O-一次性收取：O,C-按CYCLE收取,Y-按年收取*/
		$scope.chargingFrequencyArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_chargingFrequency",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.chargingFrequency=$scope.proCatalogueInf.chargingFrequency;
	        }
		};
		//查询类型下拉框
		 $scope.periodArray ={ 
		        type:"dictData", 
		        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
		        text:"codes", //下拉框显示内容，根据需要修改字段名称 
		        desc:"detailDesc",
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.periodicFeeIdentifierInfo = $scope.proCatalogueInf.periodicFeeIdentifier;
		        }
		    };
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewPayProExaOperationMode = $scope.proCatalogueInf.operationMode;
	        }
	    };
		//查询收费项目
		$scope.feeItemArr ={ 
	        type:"dynamic", 
	        param:{feeItemNo:$scope.proCatalogueInf.feeItemNo},//默认查询条件 
	        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"feeProject.query",//数据源调用的action 
	        callback: function(data){
	        	if(data!=null && data.length!=0){
	        	$scope.proCatalogueInf.feeType = data[0].feeType;
	        	$scope.proCatalogueInf.assessmentMethod = data[0].assessmentMethod;
	        	$scope.showFee();
	        	}
	        }
	    };
		$scope.showFee = function(){
			if($scope.proCatalogueInf.assessmentMethod =="M" || $scope.proCatalogueInf.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
		 $scope.chargingFrequencyShow =false;
		 if($scope.proCatalogueInf.periodicFeeIdentifier =='C' || $scope.proCatalogueInf.periodicFeeIdentifier=='P'){
			 $scope.chargingFrequencyShow =true;
		}else{
			 $scope.chargingFrequencyShow =false;
		}
	});
	//查询实例
	webApp.controller('payProjectInstanCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		//收费项目实例列表
		$scope.payProExaList = {
			params : {
				"feeItemNo": $scope.payProInf2.feeItemNo,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'feeProExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
		// 查看
		$scope.checkPayProExa = function(event) {
			$scope.payProExampleInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewPayProExa.html',	$scope.payProExampleInf, {
				title : T.T('YYJ1200016'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '520px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updatePayProExaClick = function(event) {
			$scope.payProExampleInf2 = {};
			$scope.payProExampleInf2 = $.parseJSON(JSON.stringify(event));
			$scope.payProExampleInf2.baseFee = $scope.payProExampleInf2.baseFee1;
			$scope.payProExampleInf2.feeItemInstanId  =$scope.payProExampleInf2.id;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/updatePayProExa.html',
			$scope.payProExampleInf2, {
				title : T.T('YYJ1300033'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : [ $scope.updatePayExa]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updatePayExa = function(result) {
			$scope.payProExampleInf2 = {};
			$scope.payProExampleInf2 = result.scope.payProExampleInf2;
			$scope.payProExampleInf2.matchRelation1 = result.scope.matchRelation1;
			$scope.payProExampleInf2.matchRelation2 = result.scope.matchRelation2;
			$scope.payProExampleInf2.matchRelation3 = result.scope.matchRelation3;
			$scope.payProExampleInf2.matchRelation4 = result.scope.matchRelation4;
			$scope.payProExampleInf2.matchRelation5 = result.scope.matchRelation5;
        	$scope.payProExampleInf2.feeMatrixApplicationDimension =  result.scope.feeMatrixApplicationDimension;
        	$scope.payProExampleInf2.matrixAppMode =  result.scope.matrixAppMode;
        	$scope.payProExampleInf2.updateProExaOpr =  result.scope.updateProExaOpr;
        	$scope.payProExampleInf2.assessmentMethod =  result.scope.updateProExaOpr;
        	$scope.payProExampleInf2.feeFlag =  result.scope.feeFlag;
        	$scope.payProExampleInf2.waiveCycle =  result.scope.waiveCycle;
        	$scope.payProExampleInf2.feeCollectType =  result.scope.feeCollectType;
			if($scope.payProExampleInf2.feeItemNo == "LCHG025" && ($scope.payProExampleInf2.feeMatrixApplicationDimension == "" || 
					$scope.payProExampleInf2.feeMatrixApplicationDimension ==  undefined || $scope.payProExampleInf2.feeMatrixApplicationDimension ==  "undefined")){
				jfLayer.fail(T.T("YYJ1300042"));
				return;
            }
            if(($scope.payProExampleInf2.feeMatrixApplicationDimension != "" || $scope.payProExampleInf2.feeMatrixApplicationDimension !=  undefined ||
					$scope.payProExampleInf2.feeMatrixApplicationDimension !=  "undefined") && ($scope.payProExampleInf2.matrixAppMode != "" || 
					$scope.payProExampleInf2.matrixAppMode !=  undefined || $scope.payProExampleInf2.matrixAppMode !=  "undefined")){
				if($scope.payProExampleInf2.feeMatrixApplicationDimension == "2" && $scope.payProExampleInf2.matrixAppMode == "P"){
					jfLayer.fail(T.T("YYJ1300043"));
					return;
				}
            }
            if($scope.payProExampleInf2.feeFlag == 'P'){
				if($scope.payProExampleInf2.feeRate1){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate1)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate2){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate2)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate3){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate3)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate4){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate4)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate5){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate5)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
			}
			jfRest.request('feeProExample', 'update', $scope.payProExampleInf2) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.payProExaList.search();
				}
			});
		};
		// 删除
		$scope.deletePayProExa = function(event) {
			$scope.deleltePayProExaInf = {};
			$scope.deleltePayProExaInf = $.parseJSON(JSON.stringify(event));
			$scope.deleltePayProExaInf.feeItemInstanId = $scope.deleltePayProExaInf.id;
			jfLayer.confirm(T.T('YYJ1300034'),function() {
				jfRest.request('feeProExample', 'delelte', $scope.deleltePayProExaInf).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.items = {};
						$scope.payProExaList.search();
					}
				});
			},function() {
			});
		};
		//查询维度
	});
	//修改
	webApp.controller('updatePayProExaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");      
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.feeMatrixApplicationDimension = [{name : T.T('YYJ1300061'),id : '1'},{name : T.T('YYJ1300037'),id : '2'}];
		$scope.methodShow = false;
		$scope.payProExampleInf2 = $scope.payProExampleInf2;
		//分期费用收取方式 0: 一次性收取，1：分期收取
		$scope.feeCollectTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ecommFeeCollectType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeCollectType = $scope.payProExampleInf2.feeCollectType;
	        }
		};
		//免除周期：
		$scope.waiveCycleArr={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_waiveCycle",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.waiveCycle = $scope.payProExampleInf2.waiveCycle;
	        }
		};
		//费用标识
		$scope.feeFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeFlag = $scope.payProExampleInf2.feeFlag;
	        }
		};
		//计费方式：
		$scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.assessmentMethod = $scope.payProExampleInf2.assessmentMethod;
	        }
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.updateProExaOpr = $scope.payProExampleInf2.operationMode;
	        }
	    };
		//矩阵应用方式
		$scope.matrixAppModeArry ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matrixAppMode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matrixAppMode = $scope.payProExampleInf2.matrixAppMode;
	        }
		};
		//应用维度
		$scope.feeMatrixApplicationDimensionArry  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeMatrixApplicationDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeMatrixApplicationDimension = $scope.payProExampleInf2.feeMatrixApplicationDimension;
	        }
		};
		$scope.matchRelationArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                
	        	$scope.matchRelation1 = $scope.payProExampleInf2.matchRelation1;
	        	$scope.matchRelation2 = $scope.payProExampleInf2.matchRelation2;
	        	$scope.matchRelation3 = $scope.payProExampleInf2.matchRelation3;
	        	$scope.matchRelation4 = $scope.payProExampleInf2.matchRelation4;
	        	$scope.matchRelation5 = $scope.payProExampleInf2.matchRelation5;
	        }
		};
		//查询收费项目
		$scope.feeItemArr ={ 
	        type:"dynamic", 
	        param:{feeItemNo:$scope.payProExampleInf2.feeItemNo},//默认查询条件 
	        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"feeProject.query",//数据源调用的action 
	        callback: function(data){
	        	if(data!=null && data.length!=0){
	        	$scope.feeType = data[0].feeType;
	        	$scope.assessmentMethod = data[0].assessmentMethod;
	        	$scope.showFee();
	        	}
	        }
	    };
		$scope.showFee = function(){
			if($scope.assessmentMethod =="M" || $scope.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
		if($scope.payProExampleInf2.feeItemNo == "LCHG025"){
			$("#feeMatrixApplicationDimension").attr("disabled", false);
		}
		else{
			$("#feeMatrixApplicationDimension").attr("disabled", true);
		}
	});
	//查看
	webApp.controller('viewPayProExaCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.methodShow = false;
		$scope.matrixAppModeArry ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matrixAppMode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matrixAppModeInfo = $scope.payProExampleInf.matrixAppMode;
	        }
		};
		 $scope.matchRelationArr01 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matchRelation1Info = $scope.payProExampleInf.matchRelation1;
	        }
		};
		 $scope.matchRelationArr02 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matchRelation2Info = $scope.payProExampleInf.matchRelation2;
	        }
		};
		 $scope.matchRelationArr03 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matchRelation3Info = $scope.payProExampleInf.matchRelation3;
	        }
		};
		 $scope.matchRelationArr04 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matchRelation4Info = $scope.payProExampleInf.matchRelation4;
	        }
		};
		 $scope.matchRelationArr05 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.matchRelation5Info = $scope.payProExampleInf.matchRelation5;
	        }
		};
		 $scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.assessmentMethodInfo = $scope.payProExampleInf.assessmentMethod;
	        }
		};
		$scope.waiveCycleArr={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_waiveCycle",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.waiveCycleInfo = $scope.payProExampleInf.waiveCycle;
	        }
		};
		 $scope.feeFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeFlagInfo = $scope.payProExampleInf.feeFlag;
	        }
		};
		//费用收取方式
		$scope.feeCollectTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ecommFeeCollectType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeCollectTypeInfo = $scope.payProExampleInf.feeCollectType;
	        }
		};
		//应用维度
		$scope.feeMatrixApplicationDimensionArry  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeMatrixApplicationDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeMatrixApplicationDimensionInfo = $scope.payProExampleInf.feeMatrixApplicationDimension;
	        }
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewPayProExaOperationMode = $scope.payProExampleInf.operationMode;
	        }
	    };
		//查询收费项目
		$scope.feeItemArr ={ 
	        type:"dynamic", 
	        param:{feeItemNo:$scope.payProExampleInf.feeItemNo},//默认查询条件 
	        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"feeProject.query",//数据源调用的action 
	        callback: function(data){
	        	if(data!=null && data.length!=0){
	        	$scope.payProExampleInf.feeType = data[0].feeType;
	        	$scope.payProExampleInf.assessmentMethod = data[0].assessmentMethod;
	        	$scope.showFee();
	        	}
	        }
	    };
		$scope.showFee = function(){
			if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
	});
	// 收费项目实例
	webApp.controller('payProExampleCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");   
		$scope.methodShow = false;
		$scope.isFeeTypeISTF = false;   //费用收取方式
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//计费方式 F：固定金额 M：费用矩阵
		$scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.assessmentMethod = $scope.payProExampleadd.assessmentMethod;
	        }
		};
		//矩阵应用方式 S：全额套档 P：超额累进
		$scope.matrixAppModeArry ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matrixAppMode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//费用矩阵应用维度1：金额 2：延滞天数
		$scope.feeMatrixApplicationDimensionArry  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeMatrixApplicationDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	       }
		};
		 //费用标识 D：数值/金额  P：百分比
		$scope.feeFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 //匹配关系 AND/OR 
		$scope.matchRelationArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                
	        }
		};
		//维度取值1 
		$scope.instanDimenArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_instanceDimension",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.instanDimen1 = $scope.payProExampleadd.instanCode1;
				$scope.instanDimen2 = $scope.payProExampleadd.instanCode2;
				$scope.instanDimen3 = $scope.payProExampleadd.instanCode3;
				$scope.instanDimen4 = $scope.payProExampleadd.instanCode4;
				$scope.instanDimen5 = $scope.payProExampleadd.instanCode5;
				setTimeout(function(){
					$scope.payProExampleadd.instanCode1 = "";
					$scope.payProExampleadd.instanCode2 = "";
					$scope.payProExampleadd.instanCode3 = "";
					$scope.payProExampleadd.instanCode4 = "";
					$scope.payProExampleadd.instanCode5 = "";
			    } ,0.1);//延时3秒后执行 
			}
		};	
		//分期费用收取方式 0: 一次性收取，1：分期收取
		$scope.feeCollectTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ecommFeeCollectType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	         }
		};
		//免除周期
		$scope.waiveCycleArr={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_waiveCycle",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//根据计费方式更改显示
		$scope.payProExampleInf2 ={};
		if($scope.payProExampleadd.assessmentMethod =="M" || $scope.payProExampleadd.feeType =="ANNF" ){
			$scope.methodShow = true;
		}else{
			$scope.methodShow = false;
			$scope.payProExampleInf2 ={};
		}
		if($scope.payProExampleadd.feeType == 'ISTF'){
			$scope.isFeeTypeISTF = true;   //费用收取方式
		}else{
			$scope.isFeeTypeISTF = false;   //费用收取方式
		}
		if($scope.payProExampleadd.feeItemNo == "LCHG025"){
			$("#feeMatrixApplicationDimension ").val(""); 
			$("#feeMatrixApplicationDimension").attr("disabled", false);
		}
		else{
			$("#feeMatrixApplicationDimension").attr("disabled", true);
			$("#feeMatrixApplicationDimension").val(1);
			$scope.payProExampleadd.feeMatrixApplicationDimension = "1";
		}
		//验证收费项目编号
		$scope.checkValidate = function() {
			//Xif($scope.payProExampleadd.feeItemNo == '' || $scope.payProExampleadd.feeItemNo  == undefined){
			if(!$scope.payProExampleadd.feeItemNo ){
				jfLayer.fail(T.T('YYJ1300016'));
			}
		};
		var dataValueCount;
		$scope.choseInstanCode1Btn = function() {
			//获取维度取值1的值
			$scope.checkValidate();
			dataValueCount =1;
			$scope.chosedInstanCode($scope.instanDimen1);
		};
		$scope.choseInstanCode2Btn = function() {
			$scope.checkValidate();
			//获取维度取值2的值
			dataValueCount =2;
			$scope.chosedInstanCode($scope.instanDimen2);
		};
		$scope.choseInstanCode3Btn = function() {
			$scope.checkValidate();
			//获取维度取值3的值
			dataValueCount =3;
			$scope.chosedInstanCode($scope.instanDimen3);
		};
		$scope.choseInstanCode4Btn = function() {
			$scope.checkValidate();
			//获取维度取值4的值
			dataValueCount =4;
			$scope.chosedInstanCode($scope.instanDimen4);
		};
		$scope.choseInstanCode5Btn = function() {
			$scope.checkValidate();
			//获取维度取值5的值
			dataValueCount =5;
			$scope.chosedInstanCode($scope.instanDimen5);
		};
		//分期实例代码
		$scope.choseInstanCode6Btn = function() {
			$scope.checkValidate();
			//获取维度取值6的值
			dataValueCount =6;
			$scope.chosedInstanCode($scope.instanDimen6);
		};
		//dataType维度取值，dataValue第几个实例代码
		$scope.chosedInstanCode = function(dataType) {
			if(!$scope.payProExampleadd.operationMode){
				jfLayer.fail(T.T("YYJ1300067"));
				return;
			}
			if(dataType=="MODT"){//业务类型
				//弹框查询列表
				$scope.params = {
						"operationMode" : $scope.payProExampleadd.operationMode,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseBusinessType.html', $scope.params, {
						title : T.T('YYJ1300017'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBusType]
					});
			}else if(dataType=="MODM"){//媒介对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $scope.payProExampleadd.operationMode,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseMediaObject.html', $scope.params, {
						title : T.T('YYJ1300018'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseMedia]
					});
			}else if(dataType=="MODP"){//产品对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $scope.payProExampleadd.operationMode,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseProductObject.html', $scope.params, {
						title : T.T('YYJ1300019'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductObject]
					});
			}else if(dataType=="CURR"){//币种
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseCurrency.html', $scope.params, {
						title : T.T('YYJ1300020'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseCurrency]
					});
			}else if(dataType =="CHAN"){//渠道
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseChannel.html', $scope.params, {
						title : T.T('YYJ1300021'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '600px' ],
						callbacks : [$scope.choseChannel]
					});
			}else if(dataType =="TERM"){//期数
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseTerm.html', $scope.params, {
						title : T.T('YYJ1300022'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseTerm]
					});
			}else if(dataType=="MODG"){//业务项目
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseProductLine.html', $scope.params, {
						title : T.T('YYJ1300024'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductLine]
					});
			}else if(dataType=="INST"){//分期类型
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseStageType.html', $scope.params, {
						title : T.T('YYJ1300070'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseStageType]
					});
			}else if(dataType=="FTYP"){//费用收取方式
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseFeeType.html', $scope.params, {
						title : T.T('YYJ1300071'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseFeeType]
					});
			}
		};
		//业务类型确定
		$scope.choseBusType = function(result){
			if (!result.scope.businessTypeList.validCheck()) {
				return;
			}
			$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
			$scope.safeApply();
			result.cancel();
		};
		//媒介对象确定
		$scope.choseMedia = function(result){
			if (!result.scope.mediaObjectList.validCheck()) {
				return;
			}
			$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		//产品对象确定
		$scope.choseProductObject = function(result){
			if (!result.scope.proObjectList.validCheck()) {
				return;
			}
			$scope.checkedProObject = result.scope.proObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		//币种确实
		$scope.choseCurrency = function(result){
			if (!result.scope.currencyTable.validCheck()) {
				return;
			}
			$scope.checkedCurrency = result.scope.currencyTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
			$scope.safeApply();
			result.cancel();
		};
		//期数确定
		$scope.choseTerm = function(result){
			if (!result.scope.termTable.validCheck()) {
				return;
			}
			$scope.checkedTerm = result.scope.termTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedTerm.termNo);
			$scope.safeApply();
			result.cancel();
		};
		//延滞层级
		$scope.choseDelv = function(result){
			if (!result.scope.delvTable.validCheck()) {
				return;
			}
			$scope.checkedDelv = result.scope.delvTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.collectionValue);
			$scope.safeApply();
			result.cancel();
		};
		//业务项目
		$scope.choseProductLine = function(result){
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedProLine = result.scope.proLineList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
			$scope.safeApply();
			result.cancel();
		};
		//渠道确定
		$scope.choseChannel= function(result){
			if (!result.scope.channelTable.validCheck()) {
				return;
			}
			$scope.checkedChannel = result.scope.channelTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedChannel.originList);
			$scope.safeApply();
			result.cancel();
		};
		//分期类型确定
		$scope.choseStageType= function(result){
			if (!result.scope.stageTypeTable.validCheck()) {
				return;
			}
			$scope.checkedStageType= result.scope.stageTypeTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedStageType.stageTypeCode);
			$scope.safeApply();
			result.cancel();
		};
		//费用收取方式确定
		$scope.choseFeeType= function(result){
			if (!result.scope.feeTypeTable.validCheck()) {
				return;
			}
			$scope.checkedFeeType= result.scope.feeTypeTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedFeeType.feeTpyeCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.InstanCodeValue = function(dataValue,code) {
			if(dataValue=='1'){
				$scope.payProExampleadd.instanCode1 = code;
			}else if(dataValue=='2'){
				$scope.payProExampleadd.instanCode2 = code;
			}else if(dataValue=='3'){
				$scope.payProExampleadd.instanCode3 = code;
			}else if(dataValue=='4'){
				$scope.payProExampleadd.instanCode4 = code;
			}else if(dataValue=='5'){
				$scope.payProExampleadd.instanCode5 = code;
			}else if(dataValue=='6'){
				$scope.payProExampleadd.instanCode6 = code;
			}
		};
		var form = layui.form;
		form.on('select(method)',function(event){
			if($scope.assessmentMethod =="M" || $scope.payProExampleadd.feeType =="ANNF" ){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
				$scope.payProExampleInf2 ={};
			}
		});
	});	
	//多余的  此js并没有引用页面choseFeeItem.html，以后整理页面时可以删除，暂时注释
//	webApp.controller('choseFeeItemCtrl', function($scope, $stateParams, jfRest,
//			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
//		$scope.feeListTable = {
//				checkType : 'radio', // 当为checkbox时为多选
//				params : $scope.queryParam = {
//					"pageSize" : 10,
//					"indexNo" : 0
//				}, // 表格查询时的参数信息
//				paging : true,// 默认true,是否分页
//				resource : 'feeProject.query',// 列表的资源
//				callback : function(data) { // 表格查询后的回调函数
//				}
//			};
//	});
	//业务类型
	webApp.controller('choseBusinessTypeCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		//业务类型列表
		$scope.businessTypeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessType.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//业务项目
	webApp.controller('choseProductLineCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//业务项目列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//媒介对象
	webApp.controller('choseMediaObjectCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translate.refresh();
		//媒介对象列表
		$scope.mediaObjectList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'mediaObject.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数

			}
		};
	});
	//产品对象
	webApp.controller('choseProductObjectCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translate.refresh();
		//产品對象列表
		$scope.proObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//币种
	webApp.controller('choseCurrencyCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		//货币列表
		$scope.currencyTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//渠道
	webApp.controller('choseChannlCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translate.refresh();
		//货币列表
		$scope.channelTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0,
					flag:  'N',
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'SourceDirectoryEvent.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//期数
	webApp.controller('choseTermCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translate.refresh();
		//货币列表
		$scope.termTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'term.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//延滞层级
	webApp.controller('choseDelvCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.delvTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'delv.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
	//分期类型
	webApp.controller('choseStageTypeCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.stageTypeTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	//费用收取方式
	webApp.controller('choseFeeTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.feeTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'feeType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
});
