'use strict';
define(function(require) {
	var webApp = require('app');
	//32公务卡激活
	webApp.controller('businessAactCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mdmActvt');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessActivated');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	//搜索身份证类型
		$scope.certificateTypeArray1 = [
			{name : T.T('GWJ200001') ,id : '7'} //公务卡
		];			
		$scope.isShowCstDiv = false;
		$scope.businessAactParams ={};
		$scope.selPDObjTable = {
				mainCustomerCode :"",
				customerName :"",
				credentialNumber:""
		};
		// 重置
		$scope.reset = function() {
			$scope.businessAactParams.idNumber = '';
			$scope.businessAactParams.externalIdentificationNo = '';
			$scope.businessAactParams.idType= '';
			$scope.businessAactParams.customerNo= '';
			$scope.isShowCstDiv = false;
			$('#mdmActvt_idNumber').attr('validator','noValidator');
			$('#mdmActvt_idNumber').removeClass('waringform');
		};
		$scope.queryBusiness = function() {
			$scope.busictvtInfo = {
					idNumber :$scope.businessAactParams.idNumber,
					externalIdentificationNo :$scope.businessAactParams.externalIdentificationNo,
					flag :"2",
//					idType:'7'
			};
			if(($scope.businessAactParams.idNumber== null ||$scope.businessAactParams.idNumber=="" || $scope.businessAactParams.idNumber== undefined ) &&
					($scope.businessAactParams.externalIdentificationNo== null || $scope.businessAactParams.externalIdentificationNo=="" || $scope.businessAactParams.externalIdentificationNo== undefined )){
				jfLayer.alert(T.T('F00076'));//"请输入预算单位编码或外部识别号其中一个！"
			}else {
				if($scope.businessAactParams["idNumber"]){
					if($scope.businessAactParams["idNumber"] == null || $scope.businessAactParams["idNumber"] == undefined || $scope.businessAactParams["idNumber"] == ''){
						jfLayer.alert(T.T('GWJ200002'));  //'请核对单位预算编码');//"请核对单位预算编码！"
						$scope.isShowCstDiv = false;
					}else{
//						$scope.businessAactParams.idType = '7';
//						$scope.searchHandlee($scope.busictvtInfo);
						$scope.isBusiCard($scope.busictvtInfo);
					}
				}else {
//					$scope.searchHandlee($scope.busictvtInfo);
					$scope.isBusiCard($scope.busictvtInfo)
				}
			}
		};
		//检查是否为公务卡激活，然后在执行搜索函数
		$scope.isBusiCard = function(params){
			jfRest.request('businessManage', 'isBusiCard', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if(data.returnCode == '000000'){
					$scope.searchHandlee(params);
				}
			});
		};
		//搜索执行函数
		$scope.searchHandlee = function(params){
			jfRest.request('cstInfQuery', 'queryInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				//console.log(data)
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.selPDObjTable.mainCustomerCode  = data.returnData.rows[0].customerNo;
						$scope.selPDObjTable.customerName  = data.returnData.rows[0].customerName;
						$scope.selPDObjTable.idNumber  = data.returnData.rows[0].idNumber;
						$scope.busiCardTable.params.customerCode = data.returnData.rows[0].customerNo;
						$scope.busiCardTable.params.idNumber = data.returnData.rows[0].idNumber;
						$scope.busiCardTable.params.idType = data.returnData.rows[0].idType;
						$scope.busiCardTable.params.externalIdentificationNo = $scope.businessAactParams.externalIdentificationNo;
						$scope.busiCardTable.params.flag = "2";
						$scope.busiCardTable.search();
						$scope.isShowCstDiv = true;
					}else {
						jfLayer.alert(T.T('KHJ5700001'));//"抱歉，不存在此客户！"
						$scope.isShowCstDiv = false;
					}
				}else {
					jfLayer.fail( data.returnCode+':'+data.returnMsg);
				}
			});
		};
		//客户媒介列表
		$scope.busiCardTable = {
			autoQuery:false,
			checkType : 'radio',
			params : {
					"customerCode" :"",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'baseBsnPcsg.queryCstMdmInfTable',// 列表的资源
			isTrans: true,
			transParams: ['dic_mainCharacterCardTable','dic_activationStateTable','dic_invalidFlagYN','dic_invalidReason'],
			transDict: ['mainSupplyIndicator_mainSupplyIndicatorDesc','activationFlag_activationFlagDesc',
			            'invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],
			callback : function(data) { // 表格查询后的回调函数
//				$scope.selPDObjTable.mainCustomerCode = data.mainCustomerCode;
			}
		};
		$scope.activeParam ={
				externalIdentificationNo :""
		};
		$scope.activationMdm = function() {
			if (!$scope.busiCardTable.validCheck()) {
				return;
			}
			$scope.itemList = $scope.busiCardTable.checkedList();
			if($scope.itemList.activationFlag=="1"){
				jfLayer.success(T.T('KHJ5700002'));//"该媒介已激活"
				return;
            }
            //externalIdentificationNo 替换为密文 externalIdentificationNo_ori
			$scope.activeParam.externalIdentificationNo = $scope.itemList.externalIdentificationNo;
			$scope.activeParam.externalIdentificationNoOri = $scope.itemList.externalIdentificationNo_ori;
			$scope.activeParam.mediaUnitCode = $scope.itemList.mediaUnitCode;
			$scope.activeParam.operatorId = sessionStorage.getItem("userName");
			$scope.activeParam = $.extend($scope.activeParam, $scope.businessAactParams);
			//debugger;
		//	$scope.safeApply();
			jfRest.request('businessManage', 'busAacCtrl', $scope.activeParam )//Tansun.param($scope.pDCfgInfo)
					.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success(T.T('KHJ5700003'));//"激活成功"
							$scope.busiCardTable.search();
						}
			});
		};
	});
});
