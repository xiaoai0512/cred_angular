'use strict';
define(function(require) {
	var webApp = require('app');
	//客户业务项目查询
	webApp.controller('cstBsnisItemQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstBsnisItemQuery/i18n_cstBsnisItemQuery');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.cstBsnisForm = {};
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
        	$scope.itemList.params.idNumber = '';
        	if(data.value == "1"){//身份证
        		$("#cstBsnisItem_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#cstBsnisItem_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#cstBsnisItem_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#cstBsnisItem_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#cstBsnisItem_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#cstBsnisItem_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#cstBsnisItem_idNumber").attr("validator","noValidator");
        		$scope.cstBsnisItemForm.$setPristine();
        		$("#cstBsnisItem_idNumber").removeClass("waringform ");
            }
        });
		//约定扣款状态
		//"未设置""已设置"
		$scope.debitStatusArr = [{name:T.T('KHH4800014'), id:"0"},{name:T.T('KHH4800015'), id: "1"}];
		//"最小还款""全额还款"
		$scope.debitModeArr  = [{name:T.T('KHH4800016'), id:"0"},{name:T.T('KHH4800017'), id: "1"}];//约定扣款方式
		$scope.showItemList = false;
		$scope.showUnifiedDateDiv = false; //统一日期div
		//重置
		$scope.reset = function() {
			$scope.cstBsnisForm.idNumber= '';
			$scope.cstBsnisForm.externalIdentificationNo= '';
			$scope.cstBsnisForm.idType= '';
			$scope.showItemList = false;
			$scope.showUnifiedDateDiv = false; 
			$("#cstBsnisItem_idNumber").attr("validator","noValidator");
			$("#cstBsnisItem_idNumber").removeClass("waringform ");
		};
		$scope.searchCstBsnisItem = function(){
			$scope.showUnifiedDateDiv = false;
			if(($scope.cstBsnisForm.idType == null || $scope.cstBsnisForm.idType == ''|| $scope.cstBsnisForm.idType == undefined) &&
					($scope.cstBsnisForm.customerNo == null || $scope.cstBsnisForm.customerNo == ''|| $scope.cstBsnisForm.customerNo == undefined) &&
					($scope.cstBsnisForm.idNumber == "" || $scope.cstBsnisForm.idNumber == undefined ) && ( $scope.cstBsnisForm.externalIdentificationNo == "" || $scope.cstBsnisForm.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert(T.T('F00076'));//"请输入证件号码或外部识别号"
			}
			else {
				if($scope.cstBsnisForm["idType"]){
					if($scope.cstBsnisForm["idNumber"] == null || $scope.cstBsnisForm["idNumber"] == undefined || $scope.cstBsnisForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
						$scope.showUnifiedDateDiv = false; 
					}else {
						$scope.searchHandlee($scope.cstBsnisForm);
					}
				}else if($scope.cstBsnisForm["idNumber"]){
					if($scope.cstBsnisForm["idType"] == null || $scope.cstBsnisForm["idType"] == undefined || $scope.cstBsnisForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
						$scope.showUnifiedDateDiv = false; 
					}else {
						$scope.searchHandlee($scope.cstBsnisForm);
					}
				}else {
					$scope.searchHandlee($scope.cstBsnisForm);
				}
			}
		};
		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showPDInfEnqrAndMntInfoBtn = true;
					$scope.showMeadiaDiv = false;
					$scope.showMeadiaListDiv = false;
					$scope.custInf = data.returnData.rows[0];
					$scope.itemList.params = $.extend($scope.itemList.params,params);
					$scope.itemList.search();
				}else {
					$scope.showItemList = false;
					$scope.showUnifiedDateDiv = false; 
				}
			});
		};
		//客户业务项目查询查询
		$scope.itemList = {
//			checkType : 'radio',
			params :{
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			autoQuery : false,
			paging : true,// 默认true,是否分页
			resource : 'cstBsnisItem.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_cycleModel','dic_directDebitStatus','dic_directDebitMode'],//查找数据字典所需参数
			transDict : ['cycleModel_cycleModelDesc','directDebitStatus_directDebitStatusDesc','directDebitMode_directDebitModeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showItemList = true;
				}
				else{
					$scope.showItemList = false;
				}
			}
		};
		//客户统一日期查询查询
		$scope.unifiedDateList = {
//				checkType : 'radio',
				params :{
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstUnitDate.query',// 列表的资源
				autoQuery : false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						$scope.showItemList = false;
					}else{
						$scope.showItemList = true;
					}
				}
			};
		// 页面弹出框事件(弹出页面)
		$scope.viewCstBsnisItemInfo = function(item){
			/*$scope.cstBsnisItemInfo = $.parseJSON(JSON.stringify(item));
			$scope.cstBsnisItemInfo.idNumber = $scope.itemList.params.idNumber;
//			$scope.csInfEstbInfo.contacAddress = item.contactAddress;
			$scope.modal('/cstSvc/cstBsnisItemQuery/updateBsnisItem.html', $scope.cstBsnisItemInfo, {
				title : '详细信息',
				buttons : [ '确认','取消' ],
				size : [ '800px', '400px' ],
				callbacks : [$scope.upCstBsnisItemHandle]
			});*/
			$scope.showUnifiedDateDiv = true; 
			$scope.unifiedDateList.params.idType = $scope.itemList.params.idType;
			$scope.unifiedDateList.params.idNumber = $scope.itemList.params.idNumber;
			$scope.unifiedDateList.params.externalIdentificationNo = $scope.itemList.params.externalIdentificationNo;
			$scope.unifiedDateList.params.businessProgramNo = item.businessProgramNo;
			$scope.unifiedDateList.search();
		}
		// 回调函数/确认按钮事件
		/*$scope.upCstBsnisItemHandle = function(result) {
			$scope.cstBsnisItemParams = result.scope.cstBsnisItemInfo;
			jfRest.request('cstBsnisItem', 'update', $scope.cstBsnisItemParams)
					.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success("修改成功");
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
						}
						else{
							jfLayer.fail("修改失败");
						}
			});
		};*/
	});
	webApp.controller('updateBsnisItemCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstBsnisItemQuery/i18n_cstBsnisItemQuery');
		$translate.refresh();
		$scope.cstBsnisItemInfo = $scope.cstBsnisItemInfo;
	});
});
