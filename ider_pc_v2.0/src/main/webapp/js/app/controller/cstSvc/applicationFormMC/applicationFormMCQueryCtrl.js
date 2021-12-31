'use strict';
define(function(require) {
	var webApp = require('app');
	//争议数据查询查询
	webApp.controller('appFormMCQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader,$timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormMC/i18n_applicationFormMC');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShow = false;
		$scope.appFormMCQueryTable = {};
		/*{name : "新增",id : 'N'}, 
        {name : "确认",id : 'C'}, 
        {name : "已经发出",id : 'O'}*/
		$scope.typeArray = [{name : T.T('ZYJ200001'),id : 'N'}, 
		                    {name : T.T('ZYJ200002'),id : 'C'}, 
		                    {name : T.T('ZYJ200003'),id : 'O'}];
		/*{name : "确认",id : 'C'}*/
		$scope.typeArray1 = [{name : T.T('ZYJ200002'),id : 'C'}];
		/*{name : "持卡人不同意账单金额",id : '6305'}, 
        {name : "持卡人不承认转帐",id : '6321'}, 
        {name : "请求芯片转码交易证书",id : '6322'},
        {name : "持卡人请求个人记录信息",id : '6323'},
        {name : "欺诈调查",id : '6341'},
        {name : "需要潜在的退单或合规性文档",id : '6342'},
        {name : "实时证实审计请求",id : '6343'},
        {name : "标识语法错误返回",id : '6390'}*/
		$scope.typeArray2 = [{name : T.T('ZYJ200004'),id : '6305'}, 
		                     {name : T.T('ZYJ200005'),id : '6321'}, 
		                     {name : T.T('ZYJ200006'),id : '6322'},
		                     {name : T.T('ZYJ200007'),id : '6323'},
		                     {name : T.T('ZYJ200008'),id : '6341'},
		                     {name : T.T('ZYJ200009'),id : '6342'},
		                     {name : T.T('ZYJ200010'),id : '6343'},
		                     {name : T.T('ZYJ200011'),id : '6390'}];
		/*{name : "硬拷贝原始文件",id : '1'},
        {name : "原始文件的复印件或图像",id : '2'},
        {name : "替代汇票",id : '4'}*/
		$scope.typeArray3 = [{name : T.T('ZYJ200012'),id : '1'},
		                     {name : T.T('ZYJ200013'),id : '2'},
		                     {name : T.T('ZYJ200014'),id : '4'}];
		/*{name : "新增",id : 'N'}, 
        {name : "确认",id : 'C'}, 
        {name : "已经发出",id : 'O'}*/
		$scope.typeArray4 = [{name : T.T('ZYJ200001'),id : 'N'}, 
		                     {name : T.T('ZYJ200002'),id : 'C'}, 
		                     {name : T.T('ZYJ200003'),id : 'O'}];
		/*{name : "确认",id : 'C'}*/
		$scope.typeArray5 = [{name : T.T('ZYJ200002'),id : 'C'}];
		//搜索身份证类型
		/*$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
	                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
	                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
	                                		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
*/		
		//动态请求身份证下拉框
		 $scope.certificateTypeArray ={ 
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
			$scope.appFormMCQueryTable.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#applicationFormMC_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#applicationFormMC_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#applicationFormMC_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#applicationFormMC_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#applicationFormMC_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#applicationFormMC_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#csInfEnqr_idNumber").attr("validator","noValidator");
				$scope.queryInfForm.$setPristine();
				$("#csInfEnqr_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.refact = function() {
			$scope.appFormMCQueryTable.params.idType='';
			$scope.appFormMCQueryTable.params.idNumber='';
			$scope.appFormMCQueryTable.params.externalIdentificationNo='';
			$scope.appFormMCQueryTable.params.customerNo='';
			$scope.isShow = false;
			$("#applicationFormMC_idNumber").attr("validator","noValidator");
			$("#applicationFormMC_idNumber").removeClass("waringform ");
		};
	    $scope.queryitemList = function(){
			if(($scope.appFormMCQueryTable.params.idType == null || $scope.appFormMCQueryTable.params.idType == ''|| $scope.appFormMCQueryTable.idType == undefined) &&
					($scope.appFormMCQueryTable.params.customerNo == null || $scope.appFormMCQueryTable.params.customerNo == ''|| $scope.appFormMCQueryTable.params.customerNo == undefined) &&
					($scope.appFormMCQueryTable.params.idNumber == "" || $scope.appFormMCQueryTable.params.idNumber == undefined) && ($scope.appFormMCQueryTable.params.externalIdentificationNo == "" || $scope.appFormMCQueryTable.params.externalIdentificationNo == undefined)){
				jfLayer.fail(T.T('ZYJ200015'));   //"请输入任一查询条件");

			}else {
				if($scope.appFormMCQueryTable.params["idType"]){
					if($scope.appFormMCQueryTable.params["idNumber"] == null || $scope.appFormMCQueryTable.params["idNumber"] == undefined || $scope.appFormMCQueryTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;

					}else {
						$scope.isShow = true;
						$scope.appFormMCQueryTable.search();
					}
				}else if($scope.appFormMCQueryTable.params["idNumber"]){
					if($scope.appFormMCQueryTable.params["idType"] == null || $scope.appFormMCQueryTable.params["idType"] == undefined || $scope.appFormMCQueryTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;

					}else {
						$scope.isShow = true;
						$scope.appFormMCQueryTable.search();
					}
				}else {
					$scope.isShow = true;
					$scope.appFormMCQueryTable.search();
				}
			}
		};
		$scope.appFormMCQueryTable = {
//				checkType : 'radio',
				params : {
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'MCAppFormApply.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
                    }
                }
		};
		//查询
		$scope.viewAppFormInf = function(event) {
			$scope.appMCFormInf = $.parseJSON(JSON.stringify(event));
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/applicationFormMC/checkApplicationFormMC.html', $scope.appMCFormInf, {
				title : T.T('ZYJ200016'),   //('MC调单申请查询页面'),
				buttons : [ T.T('F00012') ],   //关闭
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//维护
		$scope.updateAppFormInf = function(event) {
			$scope.appMCFormInf = $.parseJSON(JSON.stringify(event));
			if($scope.appMCFormInf.retrievalStatus == "C" || $scope.appMCFormInf.retrievalStatus == "O"){
				jfLayer.fail(T.T('ZYJ200017'));   //"改调单申请不允许修改");
				return;
			}
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/applicationFormMC/updateApplicationFormMC.html', $scope.appMCFormInf, {
				title : T.T('ZYJ200018'),   //('MC调单申请维护页面'),
				buttons : [T.T('F00125'),T.T('F00012')],//[ "确认","关闭" ],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.saveConfirmAppForm]
			});
		};
		//保存
		$scope.saveConfirmAppForm = function (result){
			console.log($scope.appMCFormInf.retrievalStatus);
			if($scope.appMCFormInf.retrievalStatus == null || $scope.appMCFormInf.retrievalStatus == "" ||  $scope.appMCFormInf.retrievalStatus == "N"){
				jfLayer.fail(T.T('ZYJ200019'));   //"请选择调单状态");
			}else{
				$scope.parm = $scope.appMCFormInf;
				jfRest.request('MCAppFormApply', 'update', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));   //"保存成功");
						$scope.safeApply();
						result.cancel();
						$scope.appFormMCQueryTable.search();
					}
				});
			}
		};
	});
	//查询MC调单申请
	webApp.controller('checkApplicationFormMCCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	});
	//维护MC调单申请
	webApp.controller('updateApplicationFormMCCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	});
});