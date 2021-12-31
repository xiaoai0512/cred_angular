'use strict';
define(function(require) {
	var webApp = require('app');
	//29产品信息查询及维护
	webApp.controller('productMajViewCtrl', function($scope, $stateParams,$timeout,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEnqrAndMnt');
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.custInf = {};//客户基本信息对象
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
		//动态请求下拉框 密码函领取标志
		 $scope.pinDispatchMethodArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_isYorN",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
		//动态请求下拉框  媒介领取标志
		 $scope.mediaDispatchMethodArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_isYorN",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
		//动态请求下拉框  激活标识
		 $scope.activationFlagArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_activationFlag",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
		//动态请求下拉框  激活方式
		 $scope.activationModeTypeArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_activationMode",
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
			$scope.pDInfEnqrAndMntInfo.idNumber = '';
			if(data.value == "1"){//身份证
				$("#pDInfMnt_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#pDInfMnt_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#pDInfMnt_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#pDInfMnt_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#pDInfMnt_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#pDInfMnt_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#pDInfMnt_idNumber").attr("validator","noValidator");
				$scope.pDInfMntForm.$setPristine();
				$("#pDInfMnt_idNumber").removeClass("waringform ");
            }
        });
		$scope.pDInfEnqrAndMntInfo = {
		};
		//ng-if属性
		$scope.showPDInfEnqrAndMntInfoBtn = false;
		$scope.showMeadiaDiv = false;
		//客户产品信息
		$scope.cstProInfTable = {
			checkType : 'radio',
			params :  {
					"pageSize":10,
					"indexNo":0,
					idNumber : $scope.pDInfEnqrAndMntInfo.idNumber,
					idType : $scope.pDInfEnqrAndMntInfo.idType,
					externalIdentificationNo : $scope.pDInfEnqrAndMntInfo.externalIdentificationNo
			}, // 表格查询时的参数信息
			autoQuery : false,
			paging : true,// 默认true,是否分页
			resource : 'cstProduct.queryProMaj',// 列表的资源quereyProInf
			isTrans: true,
			transParams: ['dic_proState'],
			transDict: ['statusCode_statusCodeDesc'],
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showPDInfEnqrAndMntInfoBtn = true;
					$scope.showMeadiaDiv = false;
					$scope.showMeadiaListDiv = false;
				}else{
					$scope.showPDInfEnqrAndMntInfoBtn = false;
					$scope.showMeadiaDiv = false;
					$scope.showMeadiaListDiv = false;
				}
			}
		};
		//重置
		$scope.reset = function() {
			$scope.pDInfEnqrAndMntInfo.idType= '';
			$scope.pDInfEnqrAndMntInfo.idNumber= '';
			$scope.pDInfEnqrAndMntInfo.externalIdentificationNo= '';
			$scope.pDInfEnqrAndMntInfo.customerNo= '';
			$scope.showPDInfEnqrAndMntInfoBtn = false;
			$scope.showMeadiaDiv = false;
			$scope.showMeadiaListDiv = false;
			$("#pDInfMnt_idNumber").attr("validator","noValidator");
			$("#pDInfMnt_idNumber").removeClass("waringform ");
		};
		//查询客户基本资料
		$scope.searchPDInfEnqrAndMntInfo = function(){
			//参数
			$scope.paramss = {
					idNumber:$scope.pDInfEnqrAndMntInfo.idNumber,
					externalIdentificationNo:$scope.pDInfEnqrAndMntInfo.externalIdentificationNo,
					idType:$scope.pDInfEnqrAndMntInfo.idType,
					customerNo:$scope.pDInfEnqrAndMntInfo.customerNo,
			};
			if(($scope.pDInfEnqrAndMntInfo.idType == "" || $scope.pDInfEnqrAndMntInfo.idType == undefined ) &&
				($scope.pDInfEnqrAndMntInfo.idNumber == "" || $scope.pDInfEnqrAndMntInfo.idNumber == undefined ) &&
				($scope.pDInfEnqrAndMntInfo.externalIdentificationNo == "" || $scope.pDInfEnqrAndMntInfo.externalIdentificationNo == undefined ) ){
				$scope.showPDInfEnqrAndMntInfoBtn = false;
				$scope.showMeadiaDiv = false;
				$scope.showMeadiaListDiv = false;
				jfLayer.alert(T.T('F00076'));//"请输入查询条件"
			}
			else {
				if($scope.pDInfEnqrAndMntInfo["idType"]){
					if($scope.pDInfEnqrAndMntInfo["idNumber"] == null || $scope.pDInfEnqrAndMntInfo["idNumber"] == undefined || $scope.pDInfEnqrAndMntInfo["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showPDInfEnqrAndMntInfoBtn = false;
						$scope.showMeadiaDiv = false;
						$scope.showMeadiaListDiv = false;
					}else {
						$scope.searchHandlee($scope.paramss);
					}
				}else if($scope.pDInfEnqrAndMntInfo["idNumber"]){
					if($scope.pDInfEnqrAndMntInfo["idType"] == null || $scope.pDInfEnqrAndMntInfo["idType"] == undefined || $scope.pDInfEnqrAndMntInfo["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showPDInfEnqrAndMntInfoBtn = false;
						$scope.showMeadiaDiv = false;
						$scope.showMeadiaListDiv = false;
					}else {
						$scope.searchHandlee($scope.paramss);
					}
				}else {
					$scope.searchHandlee($scope.paramss);
				}
			}
		};
		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstProduct', 'viewQueryCstBaseInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showPDInfEnqrAndMntInfoBtn = true;
					$scope.showMeadiaDiv = false;
					$scope.showMeadiaListDiv = false;
					$scope.custInf = data.returnData.rows[0];
					$scope.cstProInfTable.params.idType = params.idType;
					$scope.cstProInfTable.params.idNumber = params.idNumber;
					$scope.cstProInfTable.params.externalIdentificationNo = params.externalIdentificationNo;
					//客户产品信息
					$timeout(function(){
						$scope.cstProInfTable.search();
					},300);
				}else {
					$scope.showPDInfEnqrAndMntInfoBtn = false;
				}
			});
		};
		//媒介列表
		$scope.cstMdTable = {
			checkType : 'radio',
			params :  {
					"pageSize":10,
					"indexNo":0,
					externalIdentificationNo: $scope.pDInfEnqrAndMntInfo.externalIdentificationNo,
					idNumber: $scope.custInf.idNumber,
					idType: $scope.custInf.idType
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery:false,
			resource : 'cstMediaList.queryMedia',// 列表的资源
			isTrans: true,
			transParams: ['dic_mainCharacterCardTable','dic_invalidFlagYN'],
			transDict: ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc'],
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showMeadiaListDiv =true;
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
						$scope.showMeadiaDiv = false;
					}
				}else{
					$scope.showMeadiaListDiv =false;
					$scope.showMeadiaDiv = false;
				}
			}
		};
		//查询媒介列表
		$scope.viewMeadiaList = function(item){
			$scope.showMeadiaListDiv =true;
			$scope.cstMdTable.params.idType = $scope.pDInfEnqrAndMntInfo.idType;
			$scope.cstMdTable.params.idNumber = $scope.pDInfEnqrAndMntInfo.idNumber;
			$scope.cstMdTable.params.externalIdentificationNo = $scope.pDInfEnqrAndMntInfo.externalIdentificationNo;
			$scope.cstMdTable.params.productObjectCode = item.productObjectCode;
			$scope.cstMdTable.params.customerNo = item.customerNo;
			$scope.cstMdTable.search();
			//媒介列表
			/*$scope.cstMdTable = {
				checkType : 'radio',
				params :  {
						"pageSize":10,
						"indexNo":0,
						externalIdentificationNo: $scope.pDInfEnqrAndMntInfo.externalIdentificationNo,
						idNumber: $scope.custInf.idNumber,
						idType: $scope.custInf.idType,
						productObjectCode: item.productObjectCode,
						customerNo : item.customerNo
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMedia',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.showMeadiaListDiv =true;
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}else{
						var returnMsg = data.returnMsg ? data.returnMsg : "操作失败！"
						jfLayer.fail(returnMsg);
					}
				}
			};*/
		};
		//查询媒介详情
		$scope.viewMeadiaInf = function(item){
			$scope.item = item;
			if($scope.item.invalidFlag == 'Y'){
				$scope.item.invalidFlagStr =  T.T('KHH400017');
			}else if($scope.item.invalidFlag == 'N'){
                $scope.item.invalidFlagStr = T.T('KHH400018');
            }
            if ($scope.item.invalidFlag == 'N') {
                $scope.item.invalidFlagStr = T.T('KHH400018');//"无效";
                if ($scope.item.invalidReason == 'TRF') {
					$scope.item.invalidReasonStr = T.T('KHH400019');//"转卡";
				} else if ($scope.item.invalidReason == 'EXP') {
					$scope.item.invalidReasonStr =  T.T('KHH400020');//"到期";
				} else if ($scope.item.invalidReason == 'BRK') {
					$scope.item.invalidReasonStr = T.T('KHH400021KHH400022');//"毁损";
				} else if ($scope.item.invalidReason == 'CLS') {
                    $scope.item.invalidReasonStr = T.T('KHH400022');//"关闭";
                }else if ($scope.item.invalidReason == 'PNA') {
                    $scope.item.invalidReasonStr = T.T('KHH4000047');//"提前续卡";
                }
			} else {
                $scope.item.invalidFlagStr = T.T('KHH300025');//"有效";
            }
            if($scope.item.mainSupplyIndicator == '1'){
                $scope.item.mainSupplyIndicatorStr = T.T('KHJ300005');
            }else if($scope.item.mainSupplyIndicator == '2'){
                $scope.item.mainSupplyIndicatorStr = T.T('KHJ300006');
            }
            $scope.showMeadiaDiv = true;
			$scope.mediaDetailInfo = $scope.item;
		};
		//保存
		$scope.saveProInf = function (result){
			$scope.saveParam = {
					customerNo : $scope.item.customerNo,
					productObjectCode : $scope.item.productObjectCode,
					coBrandedNo :  $scope.item.coBrandedNo,
				};
			if($scope.pDInfEnqrAndMntInfo.externalIdentificationNo){
				$scope.saveParam.externalIdentificationNo =$scope.pDInfEnqrAndMntInfo.externalIdentificationNo;
            }
            if($scope.pDInfEnqrAndMntInfo.idNumber){
				$scope.saveParam.idType =$scope.pDInfEnqrAndMntInfo.idType;
				$scope.saveParam.idNumber =$scope.pDInfEnqrAndMntInfo.idNumber;
			}
			jfRest.request('cstProduct', 'saveProUint', $scope.saveParam)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));//"修改成功！"
					 $scope.safeApply();
					 result.cancel();
					 $scope.cstProInfTable.search();
				}
			});
		};
	});
});
