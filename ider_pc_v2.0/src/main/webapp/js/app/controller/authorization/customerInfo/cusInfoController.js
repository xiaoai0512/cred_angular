'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('cusListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_cusInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfo = false;
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
        	if(data.value == "1"){//身份证
        		$("#cusInfo_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#cusInfo_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#cusInfo_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#cusInfo_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#cusInfo_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#cusInfo_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#cusInfo_idNumber").attr("validator","noValidator");
        		$scope.cusInfoForm.$setPristine();
        		$("#cusInfo_idNumber").removeClass("waringform ");
            }
        });
		$scope.checkResult = function(){
			$scope.cusParams = {
					authDataSynFlag:"1",
					externalIdentificationNo:$scope.externalIdentificationNo,
					idNumber:$scope.idNumber,
//					customerNo:$scope.customerNo,
					idType:$scope.idType
				};
				jfRest.request('cusInfo', 'cusQuery', $scope.cusParams)
			    .then(function(data) {
			    	$scope.item = {};
			    	if(data.returnMsg == 'OK'){
			    		$scope.resultInfo = true;
			    		$scope.item = data.returnData.rows[0];
			    		$scope.operationModeInfo = T.T('SQJ100005');
			    		if($scope.item.idType == "0"){
			    			$scope.idTypeInfo = T.T('SQJ100004');
			    		}else if($scope.item.idType == "1"){
			    			$scope.idTypeInfo = T.T('SQJ100003');
			    		}
			    		if($scope.item.customerType =='1'){
			    			$scope.customerTypeInfo = T.T('SQJ100006');
			    		}else if($scope.item.customerType =='2'){
			    			$scope.customerTypeInfo = T.T('SQJ100007');
			    		}
			    		if($scope.item.paymentMark =='1'){
			    			$scope.paymentMarkInfo = T.T('SQJ100008');
			    		}else if($scope.item.paymentMark =='2'){
			    			$scope.paymentMarkInfo = T.T('SQJ100009');
			    		}
			    		if($scope.item.customerStatus =='0'){
			    			$scope.customerStatusInfo = T.T('SQJ100010');
			    		}else if($scope.item.customerStatus =='1'){
			    			$scope.customerStatusInfo = T.T('F00012');
			    		}
			    		if($scope.item.customerAccountingStatus == '000'){
			    			$scope.customerAccountingStatusInfo = T.T('SQJ100010');
			    		}else if($scope.item.customerAccountingStatus == '001'){
			    			$scope.customerAccountingStatusInfo = T.T('SQJ100011');
			    		}else if($scope.item.customerAccountingStatus == '002'){
			    			$scope.customerAccountingStatusInfo = T.T('SQJ100012');
			    		}
			    		if($scope.item.customerBalanceStatus =='Y'){
			    			$scope.customerBalanceStatusInfo = T.T('SQJ100013');
			    		}else if($scope.item.customerBalanceStatus =='N'){
			    			$scope.customerBalanceStatusInfo = T.T('SQJ100014');
			    		}
			    		if($scope.item.customerAuthStatus != 'N') {
			    			$scope.customerAuthStatusInfo = T.T('SQJ100013');
			    		}else {
			    			$scope.customerAuthStatusInfo = T.T('SQJ100014');
			    		}
			    	}
	            });
		};
		//查询详情事件
		$scope.selectList = function() {
			$scope.operationModeInfo = "";
			$scope.idTypeInfo = "";
			$scope.customerTypeInfo = "";
			$scope.paymentMarkInfo = "";
			$scope.customerStatusInfo = "";
			$scope.customerBalanceStatusInfo = "";
			$scope.customerAccountingStatusInfo = "";
			if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) && ($scope.idType == "" || $scope.idType == null || $scope.idType == undefined) && 
					($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.closeInfo();
			}else{
				if($scope.idNumber && $scope.externalIdentificationNo){
					jfLayer.fail(T.T('SQJ600005'));
					$scope.closeInfo();

				}else if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.fail(T.T('SQJ100002'));

					}
					else{
						$scope.checkResult();
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));

					}
					else{
						$scope.checkResult();
					}
				}
				else{
					$scope.checkResult();
				}
			}
		};
		//关闭事件
		$scope.closeInfo = function(){
			$scope.resultInfo = false;
			$scope.item = "";
			$scope.idNumber = "";
			$scope.externalIdentificationNo = "";
			$scope.idType = "";
			$scope.operationModeInfo = "";
			$scope.idTypeInfo = "";
			$scope.customerTypeInfo = "";
			$scope.paymentMarkInfo = "";
			$scope.customerStatusInfo = "";
			$scope.customerBalanceStatusInfo = "";
			$scope.customerAccountingStatusInfo = "";
		}
	});
});
