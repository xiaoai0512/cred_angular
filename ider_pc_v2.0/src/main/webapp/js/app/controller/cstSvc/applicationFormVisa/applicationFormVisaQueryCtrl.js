'use strict';
define(function(require) {
	var webApp = require('app');
	//争议数据查询查询
	webApp.controller('appFormVisaQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader,$timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormMC/i18n_applicationFormMC');
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormVisa/i18n_applicationFormVisa');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShow = false;
		$scope.appFormVisaQueryTable = {};
		//搜索身份证类型
		$scope.certificateTypeArray1 =[ {name : T.T('F00113'),id : '1'},//身份证
                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
                                		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		/*{name : "人工",id : '0'},
        {name : "自动",id : '1'}*/
		$scope.typeArray = [{name : T.T('ZYJ100001'),id : '0'},
		                    {name : T.T('ZYJ100002'),id : '1'}];
		/*{name : "人工",id : '0'},
        {name : "自动",id : '1'}*/
		$scope.typeArray1 = [{name : T.T('ZYJ100001'),id : '0'},
			                 {name : T.T('ZYJ100002'),id : '1'}];
		/*{name : "新增",id : 'N'},
        {name : "确认",id : 'C'},
        {name : "已经发出",id : 'O'}*/
		$scope.typeArray2 = [{name : T.T('ZYJ200001'),id : 'N'},
		                     {name : T.T('ZYJ200002'),id : 'C'},
		                     {name : T.T('ZYJ200003'),id : 'O'}];
		/*{name : "确认",id : 'C'}*/
		$scope.typeArray3 = [{name : T.T('ZYJ200002'),id : 'C'}];
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.appFormVisaQueryTable.params.idNumber= '';
			if(data.value == "1"){//身份证
				$("#appliFormVisa_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#appliFormVisa_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#appliFormVisa_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#appliFormVisa_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#appliFormVisa_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#appliFormVisa_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#appliFormVisa_idNumber").attr("validator","noValidator");
				$scope.queryInfForm.$setPristine();
				$("#appliFormVisa_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.reset = function() {
			$scope.appFormVisaQueryTable.params.externalIdentificationNo = '';
			$scope.appFormVisaQueryTable.params.idNumber = '';
			$scope.appFormVisaQueryTable.params.idType = '';
			$scope.appFormVisaQueryTable.params.customerNo = '';
			$scope.isShow = false;
			$("#appliFormVisa_idNumber").attr("validator","noValidator");
			$("#appliFormVisa_idNumber").removeClass("waringform ");
		};
	    $scope.queryitemList = function(){
			if(($scope.appFormVisaQueryTable.params.idType == null || $scope.appFormVisaQueryTable.params.idType == ''|| $scope.appFormVisaQueryTable.params.idType == undefined) &&
					($scope.appFormVisaQueryTable.params.idNumber == "" || $scope.appFormVisaQueryTable.params.idNumber == undefined) && 
					($scope.appFormVisaQueryTable.params.externalIdentificationNo == "" || $scope.appFormVisaQueryTable.params.externalIdentificationNo == undefined)){
				jfLayer.fail(T.T('ZYJ200015'));    //"请输入任一查询条件");
				return;
			}
			else {
				if($scope.appFormVisaQueryTable.params["idType"]){
					if($scope.appFormVisaQueryTable.params["idNumber"] == null || $scope.appFormVisaQueryTable.params["idNumber"] == undefined || $scope.appFormVisaQueryTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.appFormVisaQueryTable.search();
					}
				}else if($scope.appFormVisaQueryTable.params["idNumber"]){
					if($scope.appFormVisaQueryTable.params["idType"] == null || $scope.appFormVisaQueryTable.params["idType"] == undefined || $scope.appFormVisaQueryTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.appFormVisaQueryTable.search();
					}
				}else {
					$scope.appFormVisaQueryTable.search();
				}
            }
        };
		$scope.appFormVisaQueryTable = {
				params : {
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'appVisa.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.isShow = true;
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
		};
		//查询
		$scope.viewAppFormInf = function(event) {
			$scope.appFormInf = $.parseJSON(JSON.stringify(event));
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/applicationFormVisa/checkApplicationFormVisa.html', $scope.appFormInf, {
				title : T.T('ZYJ100005'),    //('VISA调单申请查询页面'),
				buttons : [ T.T('F00012')],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//维护
		$scope.updateAppFormInf = function(event) {
			$scope.appFormInf = $.parseJSON(JSON.stringify(event));
			if($scope.appFormInf.retrievalStatus == "C" || $scope.appFormInf.retrievalStatus == "O"){
				jfLayer.fail(T.T('ZYJ200017'));    //"改调单申请不允许修改");
				return;
			}
			// 页面 查询调单申请(弹出页面)
			$scope.modal('/cstSvc/applicationFormVisa/updateApplicationFormVisa.html', $scope.appFormInf, {
				title : T.T('ZYJ100004'),    //'VISA调单申请维护页面
				buttons :[T.T('F00125'),T.T('F00012')],//[ "确认","关闭" ],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.saveConfirmAppForm]
			});
		};
		//保存
		$scope.saveConfirmAppForm = function (result){
			console.log($scope.appFormInf.retrievalStatus);
			if($scope.appFormInf.requestReasonCode == null || $scope.appFormInf.requestReasonCode == ""){
				jfLayer.fail(T.T('ZYJ100003'));    //"请输入请求原因代码");
			}else if($scope.appFormInf.retrievalStatus == null || $scope.appFormInf.retrievalStatus == "" ||  $scope.appFormInf.retrievalStatus == "N"){
				jfLayer.fail(T.T('ZYJ200019'));    //"请选择调单状态");
			}else{
				$scope.parm = $scope.appFormInf;
				jfRest.request('appVisa', 'update', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						$scope.safeApply();
						result.cancel();
						$scope.appFormVisaQueryTable.search();
					}
				});
			}
		};
	});
	//查询VISA调单申请
	webApp.controller('checkApplicationFormVisaCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	});
	//维护VISA调单申请
	webApp.controller('updateApplicationFormVisaCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	});
});