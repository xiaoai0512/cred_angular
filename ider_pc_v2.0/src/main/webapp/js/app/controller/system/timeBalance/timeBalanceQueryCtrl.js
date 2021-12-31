'use strict';
define(function(require) {
	var webApp = require('app');
	//实时余额平衡查询
	webApp.controller('timeBalanceQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.operationMode = lodinDataService.getObject("operationMode");
    	$scope.basicInf = {};
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
        	$scope.timeBalanceForm.idNumber = '';
        	if(data.value == "1"){//身份证
        		$("#timeBalanceForm_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#timeBalanceForm_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#timeBalanceForm_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#timeBalanceForm_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#timeBalanceForm_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#timeBalanceForm_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#timeBalanceForm_idNumber").attr("validator","noValidator");
        		$scope.timeBalanceForm.$setPristine();
        		$("#timeBalanceForm_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.reset = function() {
			$scope.basicInf.idNumber = '';
			$scope.basicInf.externalIdentificationNo = '';
			$scope.basicInf.idType = '';
			$scope.showItemList = false; 
			$("#timeBalanceForm_idNumber").attr("validator","noValidator");
			$("#timeBalanceForm_idNumber").removeClass("waringform ");
		};
		$scope.searchBtn = function(){
			$scope.showUnifiedDateDiv = false;
			/*if(($scope.basicInf.idType == null || $scope.basicInf.idType == ''|| $scope.basicInf.idType == undefined) &&
					($scope.basicInf.idNumber == "" || $scope.basicInf.idNumber == undefined ) &&
					( $scope.basicInf.externalIdentificationNo == "" || $scope.basicInf.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert(T.T('F00076'));//"请输入证件号码或外部识别号"
			}
			else {*/
			$scope.timeBalanceList.params.idType = $scope.basicInf.idType;
			$scope.timeBalanceList.params.idNumber = $scope.basicInf.idNumber;
			$scope.timeBalanceList.params.externalIdentificationNo = $scope.basicInf.externalIdentificationNo;
			if(($scope.basicInf.idType && $scope.basicInf.idNumber) || $scope.basicInf.externalIdentificationNo){
				$scope.timeBalanceList.params._CART = "";
            }
            if($scope.basicInf["idType"]){
				if($scope.basicInf["idNumber"] == null || $scope.basicInf["idNumber"] == undefined || $scope.basicInf["idNumber"] == ''){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					$scope.showItemList = false;
				}else {
					$scope.timeBalanceList.search();
				}
			}else if($scope.basicInf["idNumber"]){
				if($scope.basicInf["idType"] == null || $scope.basicInf["idType"] == undefined || $scope.basicInf["idType"] == ''){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					$scope.showItemList = false; 
				}else {
					$scope.timeBalanceList.search();
				}
			}else {
				$scope.timeBalanceList.search();
			}
//			}
		};
		//查询客户基本信息
		$scope.searchHandlee = function(params) {
			$scope.params = {
				idType : params.idType,
				idNumber : params.idNumber,
				externalIdentificationNo : params.externalIdentificationNo,	
			};
			jfRest.request('cstInfQuery', 'queryInf', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showItemList = true;
					$scope.custInf = data.returnData.rows[0];
				}else {
					$scope.baseInfoDiv = false;
					$scope.timeBaDiv = false;
					$scope.showItemList = false;
				}
			});
		};
		//详情
		$scope.viewInfo = function(event){
			$scope.itemInfo = event;
			$scope.modal('/system/timeBalance/viewInfo.html', $scope.itemInfo, {
				title : '实时余额平衡详情',
				buttons : [T.T('F00012')  ],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//客户业务项目查询查询
		$scope.timeBalanceList = {
			params :{
				"pageSize" : 10,
				"indexNo" : 0,
				operationMode :$scope.operationMode,
				_CART: "A",
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'timeBalance.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showItemList = true;
					$scope.timeBaDiv = true;
					if(($scope.basicInf.idType && $scope.basicInf.idNumber) || $scope.basicInf.externalIdentificationNo){
						$scope.baseInfoDiv = true;
						$scope.searchHandlee($scope.basicInf);
					}else {
						$scope.baseInfoDiv = false;
						$scope.timeBaDiv = false;
					}
				}
				else{
					$scope.showItemList = false;
				}
			}
		};
	});
	//详情
	webApp.controller('viewTimeInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.lang = window.localStorage['lang'];
			$translate.use($scope.lang);
			$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
			$translate.refresh();
			$scope.specialList = {};
	});
});
