'use strict';
define(function(require) {
	var webApp = require('app');
	//争议数据查询查询
	webApp.controller('protestFormVisaQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader,$timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormMC/i18n_applicationFormMC');
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormVisa/i18n_applicationFormVisa');
		$translatePartialLoader.addPart('pages/cstSvc/protestFormVisa/i18n_protestFormVisa');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.typeArray = [{name : "15",id : '15'}, 
		                    {name : "16",id : '16'}, 
		                    {name : "17",id : '17'}, 
		                    {name : "35",id : '35'},
		                    {name : "36",id : '36'}, 
		                    {name : "37",id : '37'}];
		/*{name : "新增",id : 'N'}, 
        {name : "确认",id : 'C'},
        {name : "已经发出",id : 'O'}*/
		$scope.typeArray1 = [{name : T.T('ZYJ200001'),id : 'N'}, 
		                     {name : T.T('ZYJ200002'),id : 'C'},
		                     {name : T.T('ZYJ200003'),id : 'O'}];
		$scope.typeArray2 = [{name : T.T('ZYJ200002'),id : 'C'}];
		/*{name : "部分金额退款-仅对美国有效",id : 'P'}*/
		$scope.typeArray3 = [{name : T.T('FQJ300001'),id : 'P'}];
		//搜索身份证类型
		  $scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
	                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
	                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
	                                		{name : T.T('F00118') ,id : '6'} ];	//其他//外国人永久居留证
		//重置
		$scope.refact = function() {
			$scope.protestFormVisaQueryTable.params.externalIdentificationNo='';
			$scope.protestFormVisaQueryTable.params.idNumber='';
			$scope.protestFormVisaQueryTable.params.idType='';
			$scope.protestFormVisaQueryTable.params.customerNo='';
			$scope.isShow = false;
			$("#protestFormVisa_idNumber").attr("validator","noValidator");
			$("#protestFormVisa_idNumber").removeClass("waringform ");
		};
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.protestFormVisaQueryTable.params.idNumber ='';
			if(data.value == "1"){//身份证
				$("#protestFormVisa_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#protestFormVisa_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#protestFormVisa_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#protestFormVisa_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#protestFormVisa_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#protestFormVisa_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#protestFormVisa_idNumber").attr("validator","noValidator");
				$scope.queryInfForm.$setPristine();
				$("#protestFormVisa_idNumber").removeClass("waringform ");
            }
        });
	    $scope.queryitemList = function(){
			if(($scope.protestFormVisaQueryTable.params.idType == null || $scope.protestFormVisaQueryTable.params.idType == ''|| $scope.protestFormVisaQueryTable.params.idType == undefined) &&
					($scope.protestFormVisaQueryTable.params.customerNo == null || $scope.protestFormVisaQueryTable.params.customerNo == ''|| $scope.protestFormVisaQueryTable.params.customerNo == undefined) &&
					($scope.protestFormVisaQueryTable.params.idNumber == "" || $scope.protestFormVisaQueryTable.params.idNumber == undefined) && 
					($scope.protestFormVisaQueryTable.params.externalIdentificationNo == "" || $scope.protestFormVisaQueryTable.params.externalIdentificationNo == undefined)){
				jfLayer.fail(T.T('ZYJ200015'));   //"请输入任一查询条件");
				return;
			}else {
				if($scope.protestFormVisaQueryTable.params["idType"]){
					if($scope.protestFormVisaQueryTable.params["idNumber"] == null || $scope.protestFormVisaQueryTable.params["idNumber"] == undefined || $scope.protestFormVisaQueryTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
						return;
					}else {
						$scope.protestFormVisaQueryTable.search();
					}
				}else if($scope.protestFormVisaQueryTable.params["idNumber"]){
					if($scope.protestFormVisaQueryTable.params["idType"] == null || $scope.protestFormVisaQueryTable.params["idType"] == undefined || $scope.protestFormVisaQueryTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
						return;
					}else {
						$scope.protestFormVisaQueryTable.search();
					}
				}else {
					$scope.protestFormVisaQueryTable.search();
				}
            }
        };
		$scope.protestFormVisaQueryTable = {
//				checkType : 'radio',
				params : {
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'protestVisa.query',// 列表的资源
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
			$scope.protestVisaFormInf = $.parseJSON(JSON.stringify(event));
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/protestFormVisa/checkProtestFormVisa.html', $scope.protestVisaFormInf, {
				title : T.T('FQJ300005'),  //VISA拒付查询页面
				buttons : [T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//维护
		$scope.updateProtestFormInf = function(event) {
			$scope.protestVisaFormInf = $.parseJSON(JSON.stringify(event));
			if($scope.protestVisaFormInf.protestStatus == "C" || $scope.protestVisaFormInf.protestStatus == "O"){
				jfLayer.fail(T.T('FQJ300002'));   //"该拒付请求不允许修改");
				return;
			}
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/protestFormVisa/updateProtestFormVisa.html', $scope.protestVisaFormInf, {
				title :T.T('FQJ300004'),   // ('VISA拒付维护页面'),
				buttons : [T.T('F00125'),T.T('F00012')],//[ "确认","关闭" ],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.saveConfirmProtestForm]
			});
		};
		//保存
		$scope.saveConfirmProtestForm = function (result){
			if($scope.protestVisaFormInf.protestStatus == null || $scope.protestVisaFormInf.protestStatus == "" ||  $scope.protestVisaFormInf.protestStatus == "N"){
				jfLayer.fail(T.T('FQJ300003'));   //"请选择拒付状态");
			}else{
				$scope.parm = $scope.protestVisaFormInf;
				$scope.parm.transactionCode = result.scope.uptransactionCode;
				$scope.parm.specialChargebackIndicator = result.scope.upspecialChargebackIndicator;
				$scope.parm.protestStatus = result.scope.upprotestStatus;
				jfRest.request('protestVisa', 'update', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032') );
						$scope.safeApply();
						result.cancel();
						$scope.protestFormVisaQueryTable.search();
					}
				});
			}
		};
	});
	//查询VISA调单申请
	webApp.controller('checkProtestFormVisaCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	
		//visa拒付交易代码
		$scope.typeArray = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_transactionCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwtransactionCode = $scope.protestVisaFormInf.transactionCode;
	        }
		};
		//特殊退单标识
		$scope.typeArray3 = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_specialChargebackIndicator",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwspecialChargebackIndicator = $scope.protestVisaFormInf.specialChargebackIndicator;
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
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwprotestStatus = $scope.protestMCFormInf.protestStatus;
	        }
		};
	});
	//维护VISA调单申请
	webApp.controller('updateProtestFormVisaCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	
		//visa拒付交易代码
		$scope.typeArray = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_transactionCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.uptransactionCode = $scope.protestVisaFormInf.transactionCode;
	        }
		};
		//特殊退单标识
		$scope.typeArray3 = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_specialChargebackIndicator",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.upspecialChargebackIndicator = $scope.protestVisaFormInf.specialChargebackIndicator;
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
	});
});
	