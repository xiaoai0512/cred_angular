'use strict';
define(function(require) {
	var webApp = require('app');
	//约定扣款设置
	webApp.controller('agreedDeducteSetCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/deducte/i18n_agreedDeducteSet');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
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
 			$scope.itemList.params.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#agreedDeducteSet_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#agreedDeducteSet_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#agreedDeducteSet_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#agreedDeducteSet_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#agreedDeducteSet_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#agreedDeducteSet_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.showItemList = false;
		//重置
		$scope.reset = function() {
			$scope.itemList.params.idNumber= '';
			$scope.itemList.params.externalIdentificationNo= '';
			$scope.itemList.params.idType= '';
			$scope.itemList.params.customerNo= '';
			$scope.showItemList = false;
			$('#agreedDeducteSet_idNumber').attr('validator','noValidator');
			$('#agreedDeducteSet_idNumber').removeClass('waringform');
		};
		$scope.searchCstBsnisItem = function(){
			if(($scope.itemList.params.idType == null || $scope.itemList.params.idType == ''|| $scope.itemList.params.idType == undefined) &&
					($scope.itemList.params.customerNo == null || $scope.itemList.params.customerNo == ''|| $scope.itemList.params.customerNo == undefined) &&
					($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined ) && ( $scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert(T.T('KHJ1000005'));//"请输入证件号码或外部识别号"
			}
			else {
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
					}else {
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
					}else {
						$scope.itemList.search();
					}
				}else {
					$scope.itemList.search();
				}
			}
		};
		//客户业务项目查询
		$scope.itemList = {
//			checkType : 'radio',
			params :{
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstBsnisItem.query',// 列表的资源
			autoQuery : false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_directDebitStatus','dic_directDebitMode','dic_exchangePaymentFlag'],//查找数据字典所需参数
			transDict : ['directDebitStatus_directDebitStatusDesc','directDebitMode_directDebitModeDesc','exchangePaymentFlag_exchangePaymentFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode != "000000"){
					$scope.showItemList = false;
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');//"操作失败！"
					jfLayer.alert(returnMsg);
				}
				else{
					$scope.showItemList = true;
				}
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.updateDeducteInf = function(item){
			$scope.cstBsnisItemInfo = $.parseJSON(JSON.stringify(item));
			$scope.cstBsnisItemInfo.idNumber = $scope.itemList.params.idNumber;
//			$scope.csInfEstbInfo.contacAddress = item.contactAddress;
			$scope.modal('/cstSvc/deducte/updateDeducte.html', $scope.cstBsnisItemInfo, {
				title : T.T('KHJ1000006'),//'约定扣款详细信息',
				buttons : [ T.T('F00107'), T.T('F00108')],//'确认','取消' 
				size : [ '1050px', '400px' ],
				callbacks : [$scope.upDeductHandle]
			});
		};
		// 回调函数/确认按钮事件
		$scope.upDeductHandle = function(result) {
			if (result.scope.cstBsnisItemInfo.directDebitStatus == "1") {
				if((result.scope.cstBsnisItemInfo.directDebitStatus == "" || result.scope.cstBsnisItemInfo.directDebitStatus == undefined || result.scope.cstBsnisItemInfo.directDebitStatus == null) 
				|| (result.scope.cstBsnisItemInfo.directDebitMode == "" || result.scope.cstBsnisItemInfo.directDebitMode == undefined || result.scope.cstBsnisItemInfo.directDebitMode == null) 
				|| (result.scope.cstBsnisItemInfo.directDebitBankNo == "" || result.scope.cstBsnisItemInfo.directDebitBankNo == undefined || result.scope.cstBsnisItemInfo.directDebitBankNo == null) 
				|| (result.scope.cstBsnisItemInfo.directDebitAccountNo == "" || result.scope.cstBsnisItemInfo.directDebitAccountNo == undefined || result.scope.cstBsnisItemInfo.directDebitAccountNo == null) 
				){
					jfLayer.alert(T.T('KHJ3700008'));//"请填写还款信息！"
					return;
				}
            }
            $scope.cstBsnisItemParams = result.scope.cstBsnisItemInfo;
			$scope.cstBsnisItemParams = $.extend($scope.cstBsnisItemParams , $scope.itemList.params);
			$scope.cstBsnisItemParams.exchangePaymentFlag = result.scope.upexchangePaymentFlag;
			$scope.cstBsnisItemParams.directDebitStatus = result.scope.updirectDebitStatus;
			$scope.cstBsnisItemParams.directDebitMode = result.scope.updirectDebitMode;
			jfRest.request('cstBsnisItem', 'update', $scope.cstBsnisItemParams)
					.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success(T.T('F00022'));//"修改成功"
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
						}
			});
		};
	});
	//修改约定扣款
	webApp.controller('updateDeducteCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/deducte/i18n_agreedDeducteSet');
		$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEstb');
		$translate.refresh();
		$scope.debitStatusArr={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_directDebitStatus",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.updirectDebitStatus = $scope.cstBsnisItemInfo.directDebitStatus;
		        	$timeout(function() {
		        		Tansun.plugins.render('select');
		    		});
		        }
	};
		//动态请求下拉框  约定还款方式
		 $scope.debitModeArr  ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_directDebitMode",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.updirectDebitMode = $scope.cstBsnisItemInfo.directDebitMode;
			        	$timeout(function() {
			        		Tansun.plugins.render('select');
			    		});
			        }
		};
		//动态请求下拉框 购汇还款标志
		 $scope.exchangePaymentFlagArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_exchangePaymentFlag",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.upexchangePaymentFlag = $scope.cstBsnisItemInfo.exchangePaymentFlag;
			        	$timeout(function() {
			        		Tansun.plugins.render('select');
			    		});
			        }
		};
//		$scope.cstBsnisItemInfo = $scope.cstBsnisItemInfo;
		if($scope.cstBsnisItemInfo.directDebitStatus == "0"){//未设置
			$(".allInfDiv").find('.red').removeClass("disB").addClass("disN");
		}
		else if($scope.cstBsnisItemInfo.directDebitStatus == "1" ){ //已设置
			$(".allInfDiv").find('.red').removeClass("disN").addClass("disB")
		}
		//约定还款状态选择
		var form = layui.form;
		form.on('select(getdDebitStatusUpdate)',function(event){
			$scope.debitStatus=event.value;
			if($scope.debitStatus == "0"){//未设置
				$(".allInfDiv").find('.red').removeClass("disB").addClass("disN");
			}
			else if($scope.debitStatus == "1" ){ //已设置
				$(".allInfDiv").find('.red').removeClass("disN").addClass("disB")
			}
		});
	});
});
