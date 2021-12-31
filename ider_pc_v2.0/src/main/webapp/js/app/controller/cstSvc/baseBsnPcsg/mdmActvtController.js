'use strict';
define(function(require) {
	var webApp = require('app');
	//32媒介激活
	webApp.controller('mdmActvtCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mdmActvt');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
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
			$scope.mediaActivatyParams.idNumber = '';
			if(data.value == "1"){//身份证
				$("#mdmActvt_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#mdmActvt_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#mdmActvt_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#mdmActvt_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#mdmActvt_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#mdmActvt_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.isShowCstDiv = false;
		$scope.mediaActivatyParams ={
//				idNumber :"",
//				externalIdentificationNo :""
		};
		$scope.selPDObjTable = {
				mainCustomerCode :"",
				customerName :"",
				credentialNumber:""
		};
		// 重置
		$scope.reset = function() {
			$scope.mediaActivatyParams.idNumber = '';
			$scope.mediaActivatyParams.externalIdentificationNo = '';
			$scope.mediaActivatyParams.idType= '';
			$scope.mediaActivatyParams.customerNo= '';
			$scope.isShowCstDiv = false;
			$('#mdmActvt_idNumber').attr('validator','noValidator');
			$('#mdmActvt_idNumber').removeClass('waringform');
		};
		$scope.queryMedia = function() {
			$scope.mdmActvtInfo = {
					idType :$scope.mediaActivatyParams.idType,
					idNumber :$scope.mediaActivatyParams.idNumber,
					externalIdentificationNo :$scope.mediaActivatyParams.externalIdentificationNo,
					falg :"2"
			};
			if(($scope.mediaActivatyParams.idType == null || $scope.mediaActivatyParams.idType == ''|| $scope.mediaActivatyParams.idType == undefined) &&
					($scope.mediaActivatyParams.idNumber== null ||$scope.mediaActivatyParams.idNumber=="" || $scope.mediaActivatyParams.idNumber== undefined ) &&
					($scope.mediaActivatyParams.externalIdentificationNo== null || $scope.mediaActivatyParams.externalIdentificationNo=="" || $scope.mediaActivatyParams.externalIdentificationNo== undefined )){
				jfLayer.alert(T.T('F00076'));//"请输入身份证号外部识别号其中一个！"
			}else {
				if($scope.mediaActivatyParams["idType"]){
					if($scope.mediaActivatyParams["idNumber"] == null || $scope.mediaActivatyParams["idNumber"] == undefined || $scope.mediaActivatyParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else if($scope.mediaActivatyParams["idNumber"]){
					if($scope.mediaActivatyParams["idType"] == null || $scope.mediaActivatyParams["idType"] == undefined || $scope.mediaActivatyParams["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstDiv = false;
					}else{
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else {
					$scope.searchHandlee($scope.mdmActvtInfo);
				}
			}
		};
		//搜索执行函数
		$scope.searchHandlee = function(params){
			jfRest.request('cstInfQuery', 'queryInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.selPDObjTable.mainCustomerCode  = data.returnData.rows[0].customerNo;
						$scope.selPDObjTable.customerName  = data.returnData.rows[0].customerName;
						$scope.selPDObjTable.idNumber  = data.returnData.rows[0].idNumber;
						$scope.selPDObjTable.idType  = data.returnData.rows[0].idType;
						$scope.cstMdmInfTable.params.customerCode = data.returnData.rows[0].customerNo;
						$scope.cstMdmInfTable.params.idNumber = data.returnData.rows[0].idNumber;
						$scope.cstMdmInfTable.params.idType = data.returnData.rows[0].idType;
						$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.mediaActivatyParams.externalIdentificationNo;
						$scope.cstMdmInfTable.params.flag = "2";
						$scope.cstMdmInfTable.search();
						$scope.isShowCstDiv = true;
					}else {
						jfLayer.alert(T.T('KHJ5700001'));//"抱歉，不存在此客户！"
						$scope.isShowCstDiv = false;
					}
				}else {
					$scope.isShowCstDiv = false;
				}
			});
		};
		//客户媒介列表
		$scope.cstMdmInfTable = {
			autoQuery:false,
			checkType : 'radio',
			params : {
					"customerCode" :"",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'baseBsnPcsg.queryCstMdmInfTable',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainAttachedFlag','dic_activationStateTable','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','activationFlag_activationFlagDesc', 'invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
//				$scope.selPDObjTable.mainCustomerCode = data.mainCustomerCode;
			}
		};
		$scope.activeParam ={
				externalIdentificationNo :""
		};
		$scope.activationMdm = function() {
			if (!$scope.cstMdmInfTable.validCheck()) {
				return;
			}
			$scope.itemList = $scope.cstMdmInfTable.checkedList();
			if($scope.itemList.activationFlag=="1"){
				jfLayer.alert(T.T('KHJ5700002'));//"该媒介已激活"
				return;
            }
            $scope.activeParam = $.extend($scope.activeParam, $scope.mediaActivatyParams);
			//externalIdentificationNo 替换为密文 externalIdentificationNo_ori
			$scope.activeParam.externalIdentificationNo = $scope.itemList.externalIdentificationNo;
			$scope.activeParam.externalIdentificationNoOri = $scope.itemList.externalIdentificationNo_ori;
			$scope.activeParam.mediaUnitCode = $scope.itemList.mediaUnitCode;
			$scope.activeParam.operatorId = sessionStorage.getItem("userName");
			$scope.activeParam.invalidFlag = $scope.itemList.invalidFlag;
			$scope.activeParam.invalidReason = $scope.itemList.invalidReason;
			//debugger;
		//	$scope.safeApply();
			jfRest.request('baseBsnPcsg', 'activationMdm', $scope.activeParam )//Tansun.param($scope.pDCfgInfo)
					.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success(T.T('KHJ5700003'));//"激活成功"
							$scope.cstMdmInfTable.search();
						}
			});
		};
	});
});
