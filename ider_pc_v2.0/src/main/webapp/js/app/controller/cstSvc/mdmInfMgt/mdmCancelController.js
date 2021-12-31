'use strict';
define(function(require) {
	var webApp = require('app');
	//32媒介注销
	webApp.controller('mdmCancelCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmCancel');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.isShowCstDiv = false;
    	//动态请求下拉框 证件类型
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
 			$scope.mediaCancelParams.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#mdmCancel_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#mdmCancel_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#mdmCancel_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#mdmCancel_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#mdmCancel_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#mdmCancel_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.mediaCancelParams ={
				idNumber :"",
				externalIdentificationNo :"",
				idType:''
		};
		$scope.customerInfo = {
				mainCustomerCode :"",
				customerName :"",
				credentialNumber:""
		};
		//重置
		$scope.reset  = function() {
			$scope.mediaCancelParams.idNumber = '';
			$scope.mediaCancelParams.externalIdentificationNo = '';
			$scope.mediaCancelParams.idType= '';
			$scope.mediaCancelParams.customerNo= '';
			$scope.isShowCstDiv = false;
			$('#mdmCancel_idNumber').attr('validator','noValidator');
			$('#mdmCancel_idNumber').removeClass('waringform');			
		};
		//查询客户信息
		$scope.queryCstInf  = function(transData) {
		};
		//客户媒介列表
		$scope.cstMdmInfTable = {
			autoQuery:false,
			checkType : 'radio',
			params : {
					"pageSize":10,
					"indexNo":0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaCancel.queryInf',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询执行函数
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.customerInfo.idType = data.returnData.rows[0].idType;
						$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
						$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
						$scope.cstMdmInfTable.params.idNumber = $scope.mdmActvtInfo.idNumber;
						$scope.cstMdmInfTable.params.idType = $scope.mdmActvtInfo.idType;
						$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.mdmActvtInfo.externalIdentificationNo;
						$scope.cstMdmInfTable.params.flag = "2";
						$scope.cstMdmInfTable.search();
						$scope.isShowCstDiv = true;
					}else {
						jfLayer.alert(T.T('KHJ400002'));//"抱歉，不存在此客户！"
						$scope.isShowCstDiv = false;
					}
				}else {
					$scope.isShowCstDiv = false;
				}
			});
		};
		//查询媒介
		$scope.queryMedia = function() {
			$scope.mdmActvtInfo = {
					idNumber :$scope.mediaCancelParams.idNumber,
					externalIdentificationNo :$scope.mediaCancelParams.externalIdentificationNo,
					idType:$scope.mediaCancelParams.idType,
					falg :"2"
			};
			if( ($scope.mediaCancelParams.idType == null || $scope.mediaCancelParams.idType == ''|| $scope.mediaCancelParams.idType == undefined) &&
					($scope.mediaCancelParams.customerNo == null || $scope.mediaCancelParams.customerNo == ''|| $scope.mediaCancelParams.customerNo == undefined) &&
					($scope.mediaCancelParams["idNumber"] == null || $scope.mediaCancelParams["idNumber"] == undefined || $scope.mediaCancelParams["idNumber"] == '')&&
				($scope.mediaCancelParams.externalIdentificationNo=="" ||  $scope.mediaCancelParams.externalIdentificationNo == undefined)){
				jfLayer.alert(T.T('F00076'));//"请输入身份证号外部识别号其中一个！"
			}else {
				if($scope.mediaCancelParams["idType"]){
					if($scope.mediaCancelParams["idNumber"] == null || $scope.mediaCancelParams["idNumber"] == undefined || $scope.mediaCancelParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else if($scope.mediaCancelParams["idNumber"]){
					if($scope.mediaCancelParams["idType"] != null || $scope.mediaCancelParams["idType"] != undefined || $scope.mediaCancelParams["idType"] != ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else {
					$scope.searchHandlee($scope.mdmActvtInfo);
				}
			}
		};
		//注销
		$scope.cancelParam ={
				externalIdentificationNo :""
		};
		$scope.cancelMdm = function() {
			if (!$scope.cstMdmInfTable.validCheck()) {
				return;
            }
            $scope.cancelParam = $.extend($scope.cancelParam, $scope.mediaCancelParams);
			$scope.itemObj = $scope.cstMdmInfTable.checkedList();
			if($scope.itemObj.invalidFlag=='N'){//无效不允许注销
				jfLayer.alert(T.T('KHJ400004'));
				return;
			}else {
				$scope.cancelParam.externalIdentificationNo = $scope.itemObj.externalIdentificationNo;
				$scope.cancelParam.externalIdentificationNoOri = $scope.itemObj.externalIdentificationNo_ori;
				$scope.cancelParam.mediaUnitCode = $scope.itemObj.mediaUnitCode;
				jfRest.request('mediaCancel', 'saveCanel', $scope.cancelParam ).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('KHJ400003'));//"注销成功"
						$scope.isShowCstDiv = false;
					}
				});
            }
        };
	});
});
