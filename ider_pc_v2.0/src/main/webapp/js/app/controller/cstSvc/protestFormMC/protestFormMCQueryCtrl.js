'use strict';
define(function(require) {
	var webApp = require('app');
	//争议数据查询查询
	webApp.controller('protestFormMCQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader,$timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormMC/i18n_applicationFormMC');
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormVisa/i18n_applicationFormVisa');
		$translatePartialLoader.addPart('pages/cstSvc/protestFormVisa/i18n_protestFormVisa');
		$translatePartialLoader.addPart('pages/cstSvc/protestFormVisa/i18n_protestFormVisa');
		$translate.refresh();
		//动态请求下拉框 证件类型
		 $scope.certificateTypeArray = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_certificateType",
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
		form.on('select(getIdType)',function(data){
			$scope.protestFormMCQueryTable.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#protestFormMC_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#protestFormMC_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#protestFormMC_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#protestFormMC_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#protestFormMC_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#protestFormMC_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#protestFormMC_idNumber").attr("validator","noValidator");
				$scope.queryInfForm.$setPristine();
				$("#protestFormMC_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.refact = function() {
			$scope.protestFormMCQueryTable.params={};
			$scope.isShow = false;
		};
	    $scope.queryitemList = function(){
			if(($scope.protestFormMCQueryTable.params.idType == null || $scope.protestFormMCQueryTable.params.idType == ''|| $scope.protestFormMCQueryTable.params.idType == undefined) &&
					($scope.protestFormMCQueryTable.params.idNumber == "" || $scope.protestFormMCQueryTable.params.idNumber == undefined) && 
					($scope.protestFormMCQueryTable.params.externalIdentificationNo == "" || $scope.protestFormMCQueryTable.params.externalIdentificationNo == undefined)){
				jfLayer.fail(T.T('ZYJ200015'));   //"请输入任一查询条件");

			}else {
				if($scope.protestFormMCQueryTable.params["idType"]){
					if($scope.protestFormMCQueryTable.params["idNumber"] == null || $scope.protestFormMCQueryTable.params["idNumber"] == undefined || $scope.protestFormMCQueryTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;

					}else {
						$scope.protestFormMCQueryTable.search();
					}
				}else if($scope.protestFormMCQueryTable.params["idNumber"]){
					if($scope.protestFormMCQueryTable.params["idType"] == null || $scope.protestFormMCQueryTable.params["idType"] == undefined || $scope.protestFormMCQueryTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;

					}else {
						$scope.protestFormMCQueryTable.search();
					}
				}else {
					$scope.protestFormMCQueryTable.search();
				}
			}
		};
		$scope.protestFormMCQueryTable = {
				params : {
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'protestMC.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.isShow = true;
					}else {
						$scope.isShow = false;
					}
				}
		};
		//查询
		$scope.viewProtestFormInf = function(event) {
			$scope.protestMCFormInf = $.parseJSON(JSON.stringify(event));
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/protestFormMC/checkProtestFormMC.html', $scope.protestMCFormInf, {
				title : T.T('ZYJ400013'),
				buttons : [T.T('F00012')],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//维护
		$scope.updateProtestFormInf = function(event) {
			$scope.protestMCFormInf = $.parseJSON(JSON.stringify(event));
			if($scope.protestMCFormInf.protestStatus == "C" || $scope.protestMCFormInf.protestStatus == "O"){
				jfLayer.fail(T.T('FQJ300002'));   //"该拒付请求不允许修改");
				return;
			}
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/protestFormMC/updateProtestFormMC.html', $scope.protestMCFormInf, {
				title : T.T('ZYJ400014'),
				buttons : [T.T('F00125'),T.T('F00012')],//[ "确认","关闭" ],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.saveConfirmProtestForm]
			});
		};
		//保存
		$scope.saveConfirmProtestForm = function (result){
			if($scope.protestMCFormInf.protestStatus == null || $scope.protestMCFormInf.protestStatus == "" ||  $scope.protestMCFormInf.protestStatus == "N"){
				jfLayer.fail(T.T('FQJ300003'));   //"请选择拒付状态");
			}else{
				$scope.parm = $scope.protestMCFormInf;
				$scope.parm.functionCode = result.scope.upfunctionCode;
				$scope.parm.messageReasonCode = result.scope.upmessageReasonCode;
				$scope.parm.protestStatus = result.scope.upprotestStatus;
				jfRest.request('protestMC', 'update', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						$scope.safeApply();
						result.cancel();
						$scope.protestFormMCQueryTable.search();
					}
				});
			}
		};
	});
	//查询MC拒付
	webApp.controller('checkProtestFormMCCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		//消息原因代码
		$scope.typeArray2 = { 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_messageReasonCode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData:['N','O'],
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.vwmessageReasonCode	= $scope.protestMCFormInf.messageReasonCode;
		        }
			};
		//拒付状态
		$scope.typeArray1 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_protestStatus",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwprotestStatus = $scope.protestMCFormInf.protestStatus;
	        }
		};
		//功能码
		$scope.typeArray = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_functionCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwfunctionCode = $scope.protestMCFormInf.functionCode;
	        }
		};
	
	});
	//维护MC拒付
	webApp.controller('updateProtestFormMCCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	
		//消息原因代码
		$scope.typeArray2 = { 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_messageReasonCode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData:['N','O'],
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.upmessageReasonCode	= $scope.protestMCFormInf.messageReasonCode;
		        }
			};
		//拒付状态
		$scope.typeArray1 = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_protestStatus",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData:['N','O'],
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.upprotestStatus = $scope.protestMCFormInf.protestStatus;
	        }
		};
		//功能码
		$scope.typeArray = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_functionCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.upfunctionCode = $scope.protestMCFormInf.functionCode;
	        }
		};
	});
});