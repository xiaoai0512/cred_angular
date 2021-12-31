'use strict';
define(function(require) {
	var webApp = require('app');
	// 33实时制卡
	webApp.controller('rlTmMkCrdCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_rlTmMkCrd');
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
			$scope.searchParams.idNumber = '';
			if(data.value == "1"){//身份证
				$("#rlTmMkCrd_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#rlTmMkCrd_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#rlTmMkCrd_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#rlTmMkCrd_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#rlTmMkCrd_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#rlTmMkCrd_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		//客户信息
		$scope.rlTmMkCrdInfo = { };
		//查询参数
		$scope.searchParams = {
			evnetId:'ISS.OP.01.0012',
		};
		$scope.showProductInfo = false;//隐藏产品信息
		$scope.showCstMdmInfTable = false;//隐藏媒介列表
		$scope.disCredentialNumber = false;//证件号码只读
		$scope.cstProductTable = {
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
			}, // 表格查询时的参数信息
			autoQuery:false,
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryProduct',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainAttachedFlag', 'dic_productionCode'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc', 'productionCode_productionCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 客户媒介信息
		$scope.cstMdmInfTable = {
			checkType : 'radio',
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryMedia',// 列表的资源
			autoQuery : false,
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					if(data.returnData.rows.length > 0){
						var arr1 =[], arr2 = [];
						for(var i=0; i < data.returnData.rows.length; i ++){
								if(data.returnData.rows[i].productionCode && data.returnData.rows[i].productionCode != '0'){
									arr1.push(data.returnData.rows[i]);
								}else {
									arr2.push(data.returnData.rows[i]);
								}
                        }
                        data.returnData.rows = arr1;
					}
				}
			}
		};
		//查询执行函数
		$scope.searchHandlee = function(params){
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows[0].customerNo){
						$scope.rlTmMkCrdInfo = data.returnData.rows[0];
						$scope.disCredentialNumber = true;
						//$scope.searchParams.idNumber = $scope.rlTmMkCrdInfo.idNumber;
						$scope.searchParams.evnetId =  "ISS.IQ.01.0010";
						jfRest.request('cstMediaList', 'queryMedia', $scope.searchParams).then(function(data) {
							if (data.returnCode == '000000') {
								//直接显示客户制卡信息，不显示产品
								$scope.showProductInfo = true;
								$scope.showCstMdmInfTable = true;
								$scope.cstMdmInfTable.params.customerCode = $scope.rlTmMkCrdInfo.customerNo;
								$scope.cstMdmInfTable.params.idNumber = $scope.rlTmMkCrdInfo.idNumber;
								$scope.cstMdmInfTable.params.idType = $scope.rlTmMkCrdInfo.idType;
								$scope.cstMdmInfTable.search();
							}
						});
					}else {
						jfLayer.alert(T.T('KHJ900002'));//"抱歉，没有此用户！"
						$scope.showProductInfo = false;
						$scope.showCstMdmInfTable = false;
					}
				}else{
					$scope.showProductInfo = false;
					$scope.showCstMdmInfTable = false;
				}
			});
		};
		//查询
		$scope.searchCstProductTableInfo = function(){
			if(($scope.searchParams.idType == null || $scope.searchParams.idType == ''|| $scope.searchParams.idType == undefined) &&
					($scope.searchParams.customerNo == null || $scope.searchParams.customerNo == ''|| $scope.searchParams.customerNo == undefined) &&
					($scope.searchParams.idNumber == "" || $scope.searchParams.idNumber == undefined )
					&&( $scope.searchParams.externalIdentificationNo == "" || $scope.searchParams.externalIdentificationNo == undefined)
				){
				jfLayer.alert(T.T('KHJ900001'));//"请输入任意查询条件！"
				$scope.showProductInfo = false;
			}
			else {
				if($scope.searchParams["idType"]){
					if($scope.searchParams["idNumber"] == null || $scope.searchParams["idNumber"] == undefined || $scope.searchParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showProductInfo = false;
						$scope.showCstMdmInfTable = false;
					}else {
						$scope.searchHandlee($scope.searchParams);
					}
				}else if($scope.searchParams["idNumber"] ){
					if($scope.searchParams["idType"] == null || $scope.searchParams["idType"] == undefined || $scope.searchParams["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showProductInfo = false;
						$scope.showCstMdmInfTable = false;
					}else {
						$scope.searchHandlee($scope.searchParams);
					}
				}else {
					$scope.searchHandlee($scope.searchParams);
				}
			}
		};
		//重置
		$scope.reset = function(){
			$scope.searchParams = {evnetId:'ISS.OP.01.0012'};
			$scope.searchParams.idNumber = '';
			$scope.searchParams.externalIdentificationNo = '';
			$scope.searchParams.idType= '';
			$scope.searchParams.customerNo= '';
			$('#rlTmMkCrd_idNumber').attr('validator','noValidator');
			$('#rlTmMkCrd_idNumber').removeClass('waringform');
			$scope.showProductInfo = false;
			$scope.showCstMdmInfTable = false;
			$scope.disCredentialNumber = false;//证件号码只读
		};
		//产品选择
		$scope.selectMediaList = function(item){
			$scope.showCstMdmInfTable = true;
			$scope.cstMdmInfTable.params.productObjectCode = item.productObjectCode;
			$scope.cstMdmInfTable.params.mainCustomerCode = $scope.rlTmMkCrdInfo.customerNo;
			$scope.cstMdmInfTable.params.idNumber = $scope.rlTmMkCrdInfo.idNumber;
			$scope.cstMdmInfTable.search();
		};
		$scope.submitParams = {};
		$scope.submitRlTmMkCrd = function(){
			if (!$scope.cstMdmInfTable.validCheck()) {
				return;
			}
			$scope.submitParams.externalIdentificationNo = $scope.cstMdmInfTable.checkedList().externalIdentificationNo;
			$scope.submitParams.externalIdentificationNoOri = $scope.cstMdmInfTable.checkedList().externalIdentificationNo_ori;
			$scope.submitParams.mediaUnitCode = $scope.cstMdmInfTable.checkedList().mediaUnitCode;
			$scope.submitParams = $.extend($scope.submitParams , $scope.searchParams);
			jfRest.request('cstMediaList', 'submitRlTmMkCrd1', $scope.submitParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ900003'));//"制卡成功"
					$scope.cstMdmInfTable.search();
				}
			});
		}
	});
});
