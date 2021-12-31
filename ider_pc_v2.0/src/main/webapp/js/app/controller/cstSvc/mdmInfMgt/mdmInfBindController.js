'use strict';
define(function(require) {
	var webApp = require('app');
	// 30媒介信息绑定
webApp.controller('mdmInfBindCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfBind');
	$translate.refresh();
	$scope.userName = lodinDataService.getObject("menuName");//菜单名
	console.log( lodinDataService.getObject("menuName"));
	$scope.mdmCusInfParams = {};
	$scope.showList=false;//点击查询显示列表
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
		$scope.mdmCusInfParams.idNumber = '';
		if(data.value == "1"){//身份证
			$("#mdmInfBind_idNumber").attr("validator","id_idcard");
		}else if(data.value == "2"){//港澳居民来往内地通行证
			$("#mdmInfBind_idNumber").attr("validator","id_isHKCard");
		}else if(data.value == "3"){//台湾居民来往内地通行证
			$("#mdmInfBind_idNumber").attr("validator","id_isTWCard");
		}else if(data.value == "4"){//中国护照
			$("#mdmInfBind_idNumber").attr("validator","id_passport");
		}else if(data.value == "5"){//外国护照passport
			$("#mdmInfBind_idNumber").attr("validator","id_passport");
		}else if(data.value == "6"){//外国人永久居留证
			$("#mdmInfBind_idNumber").attr("validator","id_isPermanentReside")
        }
    });
	$scope.mediaInfDiv = false;
	// 点击查询方法，先验证条件是否满足，如果满足去掉取列表信息
	$scope.searchMdmInfBindInfo = function() {
		if(($scope.mdmCusInfParams.idType == null || $scope.mdmCusInfParams.idType == ''|| $scope.mdmCusInfParams.idType == undefined) &&
				($scope.mdmCusInfParams.idNumber == '' ||$scope.mdmCusInfParams.idNumber == null || $scope.mdmCusInfParams.idNumber == undefined) &&
			($scope.mdmCusInfParams.externalIdentificationNo == '' || $scope.mdmCusInfParams.externalIdentificationNo == undefined || $scope.mdmCusInfParams.externalIdentificationNo == null)  ){
			jfLayer.alert(T.T('F00076'));//"请输入查询条件！"

		}else {
			if($scope.mdmCusInfParams["idType"]){
				if($scope.mdmCusInfParams.idNumber == '' ||$scope.mdmCusInfParams.idNumber == null || $scope.mdmCusInfParams.idNumber == undefined){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
				}else {
					$scope.isShowWindow($scope.mdmCusInfParams);
				}
			}else if($scope.mdmCusInfParams["idNumber"] ){
				if($scope.mdmCusInfParams.idType == null || $scope.mdmCusInfParams.idType == ''|| $scope.mdmCusInfParams.idType == undefined){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
				}else {
					$scope.isShowWindow($scope.mdmCusInfParams);
				}
			}else {
				$scope.isShowWindow($scope.mdmCusInfParams);
			}
		}
	};
	//点击查询方法
	$scope.isShowWindow = function(params){
		$scope.mediaInfDiv = false;
		$scope.searchMdmInfListAll.params.idType = params.idType;
		$scope.searchMdmInfListAll.params.idNumber = params.idNumber;
		$scope.searchMdmInfListAll.params.externalIdentificationNo = params.externalIdentificationNo;
		$scope.searchMdmInfListAll.search();
	};
	//列表信息
	$scope.searchMdmInfListAll ={
		params : $scope.queryParam = {
			"pageSize" : 10,
			"indexNo" : 0,
			'flag' : '5',
			/*idType :  $scope.mdmCusInfParams.idType,
			idNumber :  $scope.mdmCusInfParams.idNumber,
			externalIdentificationNo :  $scope.mdmCusInfParams.externalIdentificationNo*/
		}, // 表格查询时的参数信息
		checkType : 'radio', // 当为checkbox时为多选
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryMedia',// 列表的资源
			autoQuery: false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showList=true;
				}else{
					$scope.showList= false;
				}
			}
		};
		// 2选择媒介信息
//		$scope.searchMdmInfList = {
//			checkType : 'radio',
//			params : {
//				"pageSize" : 10,
//				"indexNo" : 0,
//				idType :  $scope.mdmCusInfParams.idType,
//				idNumber :  $scope.mdmCusInfParams.idNumber,
//				externalIdentificationNo :  $scope.mdmCusInfParams.externalIdentificationNo
//			}, // 表格查询时的参数信息
//			paging : true,// 默认true,是否分页
//			resource : 'mediaBind.queryMdmInf',// 列表的资源
//			callback : function(data) { // 表格查询后的回调函数
//				//console.log(data);
//			}
//		};
		// 重置
		$scope.reset = function() {
			$scope.mdmCusInfParams.idNumber = '';
			$scope.mdmCusInfParams.externalIdentificationNo = '';
			$scope.mdmCusInfParams.idType= '';
			$scope.mdmCusInfParams.customerNo= '';
			$scope.showList=false;
			$scope.mediaInfDiv = false;
			$scope.mediaBindInf = {};
			$('#mdmInfBind_idNumber').attr('validator','noValidator');
			$('#mdmInfBind_idNumber').removeClass('waringform');				
		};
		//确定handle
		$scope.mediaDetailInf = {} ;
		$scope.mediaBindInf = {} ;//绑定的信息
		// 主附标识
		/*$scope.mainAttachmentArray = [ {
			name : T.T('KHJ5600002'),//'主卡',
			id : '1'
		}, {
			name : T.T('KHJ5600003'),//'附属卡',
			id : '2'
		} ];*/
		$scope.mainAttachmentArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_mainAttachedFlag",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
	};
		//$scope.callbackquery = function(result){
		$scope.viewMediaInf = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.mediaDetailInf = $scope.item;
			//if (!item.searchMdmInfListAll.checkedList()) {
			//return;
			//};
			//$scope.mediaDetailInf = item.searchMdmInfListAll.checkedList();
			$scope.mediaBindInf.externalIdentificationNo = $scope.mediaDetailInf.externalIdentificationNo;
			$scope.mediaBindInf.externalIdentificationNoOri = $scope.mediaDetailInf.externalIdentificationNo_ori;
			$scope.mediaBindInf.mediaUnitCode = $scope.mediaDetailInf.mediaUnitCode;
			$scope.mediaBindInf.mediaObjectCode = $scope.mediaDetailInf.mediaObjectCode;
			$scope.mediaBindInf.expirationDate = $scope.mediaDetailInf.expirationDate;
			$scope.mediaBindInf.mainSupplyIndicator = $scope.mediaDetailInf.mainSupplyIndicator;
			$scope.mediaBindInf.invalidFlag = $scope.mediaDetailInf.invalidFlag;
			$scope.mediaBindInf.bindId = '';
			//$("#mainSupplyIndicator").attr("disabled","disabled");
			$scope.mediaInfDiv = true ;
			$scope.safeApply();
			$scope.mdmInfoBindForm.$setPristine();			
		};
		$scope.saveMdmBind = function(mainSupplyIndicator) {
			$scope.mdmBindParams = {
					mediaObjectCode : $scope.mediaBindInf.mediaObjectCode,
					mediaUnitCode : $scope.mediaBindInf.mediaUnitCode,
					externalIdentificationNo : $scope.mediaBindInf.externalIdentificationNo,
					externalIdentificationNoOri : $scope.mediaBindInf.externalIdentificationNo_ori,
			};
			$scope.mdmBindParams = $.extend($scope.mdmBindParams, $scope.mediaDetailInf);
			$scope.mdmBindParams.bindId = $scope.mediaBindInf.bindId;
			jfRest.request('mediaBind', 'saveBind', $scope.mdmBindParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));//"保存成功"
					$scope.mediaInfDiv = false;
					//$scope.mediaBindInf = {};
				}
			});
		}
	});
//	webApp.controller('searchMediaInfCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
//		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
//		$translate.use($scope.lang);
//		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfBind');
//		$translate.refresh();
//		$scope.searchMdmInfListAll = {
//			checkType : 'radio',
//			params : {
//				"pageSize" : 10,
//				"indexNo" : 0,
//				idType :  $scope.mdmCusInfParams.idType,
//				idNumber :  $scope.mdmCusInfParams.idNumber,
//				externalIdentificationNo :  $scope.mdmCusInfParams.externalIdentificationNo
//			}, // 表格查询时的参数信息
//			paging : true,// 默认true,是否分页
//			resource : 'cstMediaList.queryMedia',// 列表的资源
//			callback : function(data) { // 表格查询后的回调函数
//				console.log(data);
//			}
//		};
//	});
});
