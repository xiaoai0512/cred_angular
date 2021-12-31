'use strict';
define(function(require) {
	var webApp = require('app');
	// 收费项目查询
	webApp.controller('payProExampleQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");      
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.delBtnFlag = false;
		 $scope.addBtnFlag = false;
			//费用矩阵应用维度1：金额 2：延滞天数				
		$scope.feeMatrixApplicationDimension = [{name : T.T('YYJ1300061'),id : '1'},{name : T.T('YYJ1300037'),id : '2'}];
		 	//免除周期
		$scope.waiveCycleArr = [{name : T.T('YYJ1300052'),id : 'Y'},{name : T.T('YYJ1300053'),id : 'S'},{name : T.T('YYJ1300054'),id : 'M'},{name : T.T('YYJ1300055'),id : 'A'},{name : T.T('YYJ1300056'),id : 'N'}];
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
		   	   		if($scope.eventList.search('COS.IQ.02.0032') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0030') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0027') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0031') != -1){    //刪除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
  				}
  			});
		//费用类别
		$scope.feeTypeArr = [ {name : T.T('YYJ1300025') ,id : 'ANNF'}, {name : T.T('YYJ1300026'),id : 'LCHG'}, 
		                      {name : T.T('YYJ1300027'),id : 'OVRF'} , {name : T.T('YYJ1300028'),id : 'CSHF'} ,
		                      {name : T.T('YYJ1300029'),id : 'TXNF'} , {name : T.T('YYJ1300030'),id : 'SVCF'},
		                      {name : T.T('YYJ1300031'),id : 'ISTF'} , {name : "制卡费",id : 'ISSF'}];
		//维度取值1
		$scope.instanDimenArr = [ {name : T.T('YYJ1300007'),id : 'MODT'}, {name : T.T('YYJ1300008'),id : 'MODP'}, 
		                          {name : T.T('YYJ1300009'),id : 'MODM'},{name : T.T('YYJ1300010'),id : 'CURR'},{name : T.T('YYJ1300011'),id : 'CHAN'} ,{
		                  			name : T.T('YYJ1300012'),id : 'TERM'}];
		//匹配关系 AND/OR 
		 $scope.matchRelationArr =  [{name : 'AND',id : 'AND'},{name : 'OR ',id : 'OR'}];
		 //费用标识 D：数值/金额  P：百分比
		 $scope.feeFlagArr =  [{name : T.T('YYJ1300005'),id : 'D'},{name : T.T('YYJ1300006'),id : 'P'}];
		//矩阵应用方式 S：全额套档 P：超额累进
		 $scope.matrixAppMode = [{name : T.T('YYJ1300003'),id : 'S'},{name : T.T('YYJ1300004'),id : 'P'}];
		//计费方式 F：固定金额 M：费用矩阵
		 $scope.assessmentMethodArr = [{name : T.T('YYJ1300001'),id : 'F'},{name : T.T('YYJ1300002'),id : 'M'}];
			//费用矩阵应用维度1：金额 2：延滞天数
		 $scope.feeMatrixApplicationDimension = [{name : T.T('YYJ1300061'),id : '1'},{name : T.T('YYJ1300037'),id : '2'}];
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
		//收费项目实例列表
		$scope.payProExaList = {
			params : {
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
			$scope.payProExampleInf.baseFee = $scope.payProExampleInf.baseFee1;
			//查询收费项目获取计费方式
//			jfRest.request('feeProject', 'query', $scope.payProExampleInf).then(function(data) {
//				if (data.returnCode == '000000') {
//					if(data.returnData.rows!=null){
//						$scope.payProExampleInf.assessmentMethod = data.returnData.rows[0].assessmentMethod;
//					}
//				}
//			});
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewPayProExa.html',
					$scope.payProExampleInf, {
						title : T.T('YYJ1300032'),
						buttons : [ T.T('F00012') ],
						size : [ '1050px', '600px' ],
						callbacks : []
					});
		};
		// 修改
		$scope.updatePayProExa = function(event) {
			$scope.payProExampleInf2 = $.parseJSON(JSON.stringify(event));
			$scope.payProExampleInf2.baseFee = $scope.payProExampleInf2.baseFee1;
			//查询收费项目获取计费方式
//			jfRest.request('feeProject', 'query', $scope.payProExampleInf2).then(function(data) {
//				if (data.returnCode == '000000') {
//					if(data.returnData.rows!=null){
//						$scope.payProExampleInf2.assessmentMethod = data.returnData.rows[0].assessmentMethod;
//					}
//				}
//			});
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
		// 回调函数/确认按钮事件
		$scope.updatePayExa = function(result) {
			$scope.payProExampleInf2 = result.scope.payProExampleInf2;
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
            //$scope.payProInf2.accountCurrency = result.scope.updateAccountCurrency;
			if($scope.payProExampleInf2.feeFlag == 'P'){
				if($scope.payProExampleInf2.feeRate1){
					var pattern = /^[0-1](\.\d{1,4})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate1)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate2){
					var pattern = /^[0-1](\.\d{1,4})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate2)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate3){
					var pattern = /^[0-1](\.\d{1,4})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate3)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate4){
					var pattern = /^[0-1](\.\d{1,4})?$/ ;
					if (!pattern.test($scope.payProExampleInf2.feeRate4)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf2.feeRate5){
					var pattern = /^[0-1](\.\d{1,4})?$/ ;
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
		// 新增
		$scope.payProExaAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/payProExample.html','', {
				title : T.T('YYJ1300066'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : [$scope.savePayProExample]
			});
		};
		$scope.savePayProExample = function(result){
			$scope.payProExampleInf = {};
			$scope.payProExampleInf =  Object.assign(result.scope.payProExampleInf , result.scope.payProExampleInf2);
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
            if($scope.payProExampleInf.instanDimen1 == "CNMD" || $scope.payProExampleInf.instanDimen2 == "CNMD" || $scope.payProExampleInf.instanDimen3 == "CNMD"
				|| $scope.payProExampleInf.instanDimen4 == "CNMD" || $scope.payProExampleInf.instanDimen5 == "CNMD"){
				if($scope.payProExampleInf.feeCollectType == "" || $scope.payProExampleInf.feeCollectType ==  undefined || 
						$scope.payProExampleInf.feeCollectType ==  "undefined"){
					jfLayer.fail(T.T("YYJ1300049"));
					return;
				}else{
					if($scope.payProExampleInf.instanDimen1 == "CNMD"){
						if($scope.payProExampleInf.instanCode1 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen2 == "CNMD"){
						if($scope.payProExampleInf.instanCode2 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen3 == "CNMD"){
						if($scope.payProExampleInf.instanCode3 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen4 == "CNMD"){
						if($scope.payProExampleInf.instanCode4 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen5 == "CNMD"){
						if($scope.payProExampleInf.instanCode5 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}
				}
            }
            jfRest.request('feeProExample', 'save', $scope.payProExampleInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.payProExampleInf = {};
					result.scope.payProExampleInfForm.$setPristine();
					$scope.payProExaList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//查看
	webApp.controller('viewPayProExaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
	//修改
	webApp.controller('updatePayProExaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");      
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.feeMatrixApplicationDimension = [{name : T.T('YYJ1300061'),id : '1'},{name : T.T('YYJ1300037'),id : '2'}];
		$scope.methodShow = false;
		$scope.payProExampleInf2 = $scope.payProExampleInf2;
		//分期费用收取方式 0: 一次性收取，1：分期收取
		$scope.feeCollectTypeArr = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
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
		//查询收费项目
		$scope.feeItemArr ={ 
		        type:"dynamic", 
		        param:{feeItemNo:$scope.payProExampleInf2.feeItemNo},//默认查询条件 
		        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"feeProject.query",//数据源调用的action 
		        callback: function(data){
		        	if(data!=null && data.length!=0){
		        	$scope.payProExampleInf2.feeType = data[0].feeType;
		        	$scope.payProExampleInf2.assessmentMethod = data[0].assessmentMethod;
		        	$scope.showFee();
		        	}
		        }
		    };
		$scope.showFee = function(){
			if($scope.payProExampleInf2.assessmentMethod =="M" || $scope.payProExampleInf2.feeType =="ANNF"){
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
	/*	$scope.choseEvent = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				}
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/payProject/choseEvent.html', $scope.params, {
					title : '选择事件',
					buttons : [ '确定', '关闭' ],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.choseEventFee]
				});
		}*/
		/*$scope.choseEventFee = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.payProInf2.feeEventNo  = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		}*/
	});
	//事件
	/*webApp.controller('choseEventFeeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
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
	});*/
	// 收费项目实例
	webApp.controller('payProExampleCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");   
		$scope.payProExampleInf = {};
		$scope.payProExampleInf2 = {};
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
		 $scope.assessmentMethodArr = [{name : T.T('YYJ1300001'),id : 'F'},{name : T.T('YYJ1300002'),id : 'M'}];
		//矩阵应用方式 S：全额套档 P：超额累进
		 $scope.matrixAppMode = [{name : T.T('YYJ1300003'),id : 'S'},{name : T.T('YYJ1300004'),id : 'P'}];
		//费用矩阵应用维度1：金额 2：延滞天数
		 $scope.feeMatrixApplicationDimension = [{name : T.T('YYJ1300061'),id : '1'},{name : T.T('YYJ1300037'),id : '2'}];
		 //费用标识 D：数值/金额  P：百分比
		 $scope.feeFlagArr =  [{name : T.T('YYJ1300005'),id : 'D'},{name : T.T('YYJ1300006'),id : 'P'}];
		 //匹配关系 AND/OR 
		 $scope.matchRelationArr =  [{name : 'AND',id : 'AND'},{name : 'OR ',id : 'OR '}];
		//维度取值1
			$scope.instanDimenArr = [ {
				name : T.T('YYJ1300007'),
				id : 'MODT'
			}, {
				name : T.T('YYJ1300008'),
				id : 'MODP'
			}, {
				name : T.T('YYJ1300009'),
				id : 'MODM'
			},{
				name : T.T('YYJ1300010'),
				id : 'CURR'
			},{
				name : T.T('YYJ1300011'),
				id : 'CHAN'
			} ,{
				name : T.T('YYJ1300012'),
				id : 'TERM'
			},{
				name : T.T('YYJ1300039'),
				id : 'CNMD'
			},{
				name : T.T('YYJ1300014'),
				id : 'MODG'
			},{
				name : T.T('YYJ1300039'),
				id : 'INST'
			},{
				name : T.T('YYJ1300063'),
				id : 'FTYP'
			}];
			//分期费用收取方式 0: 一次性收取，1：分期收取
			$scope.feeCollectTypeArr = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
			//免除周期
			$scope.waiveCycleArr = [{name : T.T('YYJ1300052'),id : 'Y'},{name : T.T('YYJ1300053'),id : 'S'},{name : T.T('YYJ1300054'),id : 'M'},{name : T.T('YYJ1300055'),id : 'A'},{name : T.T('YYJ1300056'),id : 'N'}];
			//分期类型
			/*$scope.stageTypeArr = [{name : '商户分期',id : 'MERH'},
			                       {name : '自动分期',id : 'TXAT'},
			                       {name : '现金分期',id : 'CASH'},
			                       {name : '专项分期',id : 'SPCL'},
			                       {name : '账单分期',id : 'STMT'},
			                       {name : '交易分期',id : 'TRAN'},
			                       {name : '消贷分期',id : 'LOAN'}];*/
			//根据计费方式更改显示
			var form = layui.form;
			form.on('select(method)',function(event){
				if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF" ){
					$scope.methodShow = true;
				}else{
					$scope.methodShow = false;
					$scope.payProExampleInf2 ={};
				}
			});
		//选择收费项目编号
			$scope.choseBtn = function() {
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/payProject/choseFeeItem.html', $scope.params, {
					title : T.T('YYJ1300015'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.chosedFeeItem]
				});
			};
			$scope.chosedFeeItem = function(result) {
				if (!result.scope.feeListTable.validCheck()) {
					return;
                }
                $scope.checkedFeeItemInf = result.scope.feeListTable.checkedList();
				console.log($scope.checkedFeeItemInf);
				$scope.payProExampleInf.feeItemNo  = $scope.checkedFeeItemInf.feeItemNo;
				$scope.payProExampleInf.instanDimen1 = $scope.checkedFeeItemInf.instanCode1;
				$scope.payProExampleInf.instanDimen2 = $scope.checkedFeeItemInf.instanCode2;
				$scope.payProExampleInf.instanDimen3 = $scope.checkedFeeItemInf.instanCode3;
				$scope.payProExampleInf.instanDimen4 = $scope.checkedFeeItemInf.instanCode4;
				$scope.payProExampleInf.instanDimen5 = $scope.checkedFeeItemInf.instanCode5;
				$scope.payProExampleInf.feeType = $scope.checkedFeeItemInf.feeType;
				$scope.payProExampleInf.assessmentMethod = $scope.checkedFeeItemInf.assessmentMethod;
				console.log($scope.payProExampleInf);
				if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF" ){
					$scope.methodShow = true;
				}else{
					$scope.methodShow = false;
					$scope.payProExampleInf2 ={};
				}
				if($scope.payProExampleInf.feeType == 'ISTF'){
					$scope.isFeeTypeISTF = true;   //费用收取方式
				}else{
					$scope.isFeeTypeISTF = false;   //费用收取方式
				}
				$scope.safeApply();
				result.cancel();
				if($scope.payProExampleInf.feeItemNo == "LCHG025"){
					$("#feeMatrixApplicationDimension ").val(""); 
					$("#feeMatrixApplicationDimension").attr("disabled", false);
				}
				else{
					$("#feeMatrixApplicationDimension").attr("disabled", true);
					$("#feeMatrixApplicationDimension").val(1);
					$scope.payProExampleInf.feeMatrixApplicationDimension = "1";
				}
			};
			//验证收费项目编号
			$scope.checkValidate = function() {
//				if($scope.payProExampleInf.feeItemNo == '' || $scope.payProExampleInf.feeItemNo  == undefined){
				if(!$scope.payProExampleInf.feeItemNo ){
					jfLayer.fail(T.T('YYJ1300016'));
				}
			};
			var dataValueCount;
			$scope.choseInstanCode1Btn = function() {
				//获取维度取值1的值
				$scope.checkValidate();
				dataValueCount =1;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen1);
			};
			$scope.choseInstanCode2Btn = function() {
				$scope.checkValidate();
				//获取维度取值2的值
				dataValueCount =2;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen2);
			};
			$scope.choseInstanCode3Btn = function() {
				$scope.checkValidate();
				//获取维度取值3的值
				dataValueCount =3;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen3);
			};
			$scope.choseInstanCode4Btn = function() {
				$scope.checkValidate();
				//获取维度取值4的值
				dataValueCount =4;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen4);
			};
			$scope.choseInstanCode5Btn = function() {
				$scope.checkValidate();
				//获取维度取值5的值
				dataValueCount =5;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen5);
			};
			//分期实例代码
			$scope.choseInstanCode6Btn = function() {
				$scope.checkValidate();
				//获取维度取值6的值
				dataValueCount =6;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen6);
			};
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $scope.payProExampleInf.operationMode,
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
							"operationMode" : $scope.payProExampleInf.operationMode,
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
							"operationMode" : $scope.payProExampleInf.operationMode,
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
				}else if(dataType=="CNMD"){//收取方式
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseDelv.html', $scope.params, {
							title : '选择收取方式',
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
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
			/*$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.payProExampleInf.instanDimen1 = code;
				}else if(dataValue=='2'){
					$scope.payProExampleInf.instanDimen2 = code;
				}else if(dataValue=='3'){
					$scope.payProExampleInf.instanDimen3 = code;
				}else if(dataValue=='4'){
					$scope.payProExampleInf.instanDimen4 = code;
				}else if(dataValue=='5'){
					$scope.payProExampleInf.instanDimen5 = code;
				}else if(dataValue=='6'){
					$scope.payProExampleInf.instanDimen6 = code;
				}
			}*/
			//渠道确定
			$scope.choseChannel= function(result){
				if (!result.scope.channelTable.validCheck()) {
					return;
				}
				$scope.checkedChannel = result.scope.channelTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedChannel.channelCode);
				$scope.safeApply();
				result.cancel();
			};
			//分期类型确定
			$scope.choseStageType= function(result){
				if (!result.scope.stageTypeTable.validCheck()) {
					return;
				}
				$scope.checkedStageType= result.scope.stageTypeTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedStageType.stageTpyeCode);
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
					$scope.payProExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.payProExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.payProExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.payProExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.payProExampleInf.instanCode5 = code;
				}else if(dataValue=='6'){
					$scope.payProExampleInf.instanCode6 = code;
				}
			}
	});
	webApp.controller('choseFeeItemCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.feeListTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'feeProject.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
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
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'channel.query',// 列表的资源
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
		$scope.stageTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'stageType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
	//分期类型
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
