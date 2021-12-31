'use strict';
define(function(require) {
	var webApp = require('app');
	//提前续卡
	webApp.controller('advanceRenewCardCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu');
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.mediaSearch = {};
		$scope.showMdmInfEstbInfoBtn = false;  // 设置默认不显示
		//媒介领取标志
//		$scope.mediaDispatchMethodArr = [{name :T.T('F00159'),id : 'Y'},{name :  T.T('F00160'),id : 'N'}];
		//密码函领取标志
//		$scope.pinDispatchMethodArr = [{name :T.T('F00159'),id : 'Y'},{name :  T.T('F00160'),id : 'N'}];
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
		$scope.convertibleCardArr = [ {
			name : T.T('KHH5800037'),//"是",
			id : "Y"
		}, {
			name : T.T('KHH5800038'),//"否",
			id : "N"
		} ];
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
		//查询
		$scope.mediaSearch = {};
		$scope.searchBtn = function(){
			$scope.showMdmInfEstbInfoBtn = false;
			if(($scope.mediaSearch.idType == null || $scope.mediaSearch.idType == ''|| $scope.mediaSearch.idType == undefined) &&
					($scope.mediaSearch.customerNo == null || $scope.mediaSearch.customerNo == ''|| $scope.mediaSearch.customerNo == undefined) &&
					($scope.mediaSearch.idNumber == "" || $scope.mediaSearch.idNumber == undefined )
					&&( $scope.mediaSearch.externalIdentificationNo == "" || $scope.mediaSearch.externalIdentificationNo == undefined)
				){
				jfLayer.alert(T.T('F00076'));//"请输入任意查询条件！"
			}
			else {
				if($scope.mediaSearch["idType"]){
					if($scope.mediaSearch["idNumber"] == null || $scope.mediaSearch["idNumber"] == undefined || $scope.mediaSearch["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showMdmInfEstbInfoBtn = false;
					}else {
						$scope.queryFun($scope.mediaSearch);
					}
				}else if($scope.mediaSearch["idNumber"]){
					if($scope.mediaSearch["idType"] == null || $scope.mediaSearch["idType"] == undefined || $scope.mediaSearch["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showMdmInfEstbInfoBtn = false;
					}else {
						$scope.queryFun($scope.mediaSearch);
					}
				}else {
					$scope.queryFun($scope.mediaSearch);
				}
			}
		};
		//查询媒介信息
		$scope.itemList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					'flag' : 1,
					"idType":$scope.mediaSearch.idType,
					"idNumber":$scope.mediaSearch.idNumber,
					"externalIdentificationNo":$scope.mediaSearch.externalIdentificationNo
				}, // 表格查询时的参数信息
				checkType : 'radio', // 当为checkbox时为多选
				autoQuery: false,
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMedia',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_mainAttachedFlag','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
				transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						if(data.returnData.rows!=null){
							$scope.itemList.params.idNumber = data.returnData.rows[0].idNumber;
						}
					}
				},
				checkBack: function(row){
					$scope.viewMediaInf(row);
				}
			};
		//运营模式
		 $scope.operationModeArr = { 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		// 机构号查询
		$scope.institutionIdArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
			//	console.log(data);
			}
		};
		//查询媒介基本信息
		$scope.queryMedaiBaseInf = function(params){
			jfRest.request('mediaLoss', 'queryMedaiBaseInf',params).then(function(data) {
				if(data.returnCode == "000000"){
					$scope.mInfo = data.returnData.rows[0];
					$scope.mInfo.productionCode = '3';//毁损补发制卡
					$("#productionCode").attr("disabled","disabled");
					//上一次制卡请求 码值翻译
					if($scope.mInfo.previousProductionCode==1){
						$scope.mInfo.firstCardRequestTran = T.T('KHJ300002');//"新发卡制卡";
					}else if($scope.mInfo.previousProductionCode==2){
						$scope.mInfo.firstCardRequestTran = T.T('KHJ300003');//"到期续卡制卡";
					}else if($scope.mInfo.previousProductionCode==3){
						$scope.mInfo.firstCardRequestTran = T.T('KHJ300001');//"毁损补发制卡";
					}else if($scope.mInfo.previousProductionCode==4){
						$scope.mInfo.firstCardRequestTran = T.T('KHJ300004');//"挂失换卡制卡";
					}else {
						$scope.mInfo.firstCardRequestTran = '';
                    }
                    if($scope.mInfo.invalidFlag == 'Y'){
						$scope.mInfo.invalidFlagStr = T.T('KHH300025');
					}else if($scope.mInfo.invalidFlag == 'N'){
						$scope.mInfo.invalidFlagStr = T.T('KHH300026');
                    }
                    if ($scope.mInfo.invalidFlag == 'N') {
						$scope.mInfo.invalidFlagStr = T.T('KHH300026');//"无效";
						if ($scope.mInfo.invalidReason == 'TRF') {
							$scope.mInfo.invalidReasonStr = T.T('KHH300027');//"转卡";
						} else if ($scope.mInfo.invalidReason == 'EXP') {
							$scope.mInfo.invalidReasonStr = T.T('KHH300028');//"到期";
						} else if ($scope.mInfo.invalidReason == 'BRK') {
							$scope.mInfo.invalidReasonStr = T.T('KHH300029');//"毁损";
						} else if ($scope.mInfo.invalidReason == 'CLS') {
							$scope.mInfo.invalidReasonStr = T.T('KHH300030');//"关闭";
						}else if ($scope.mInfo.invalidReason == 'PNA') {
							$scope.mInfo.invalidReasonStr = T.T('KHH300037');//"提前续卡";
						}
					} else {
						$scope.mInfo.invalidFlagStr = T.T('KHH300025');//"有效";
                    }
                    if($scope.mInfo.mainSupplyIndicator == '1'){
						$scope.mInfo.mainSupplyIndicatorStr = T.T('KHJ300005');
					}else if($scope.mInfo.mainSupplyIndicator == '2'){
						$scope.mInfo.mainSupplyIndicatorStr = T.T('KHJ300006');
                    }
                    //媒介对象代码
					$scope.mInfo.mediaObjectCodeTrans = $scope.mInfo.mediaObjectCode + $scope.mInfo.mediaObjectDesc;
					//产品对象代码
					$scope.mInfo.productObjectCodeTrans = $scope.mInfo.productObjectCode + $scope.mInfo.productDesc;
				}
			});
		};
		//查询功能函数，查询媒介成功后，弹窗
		$scope.queryFun = 	function(params){
			$scope.customerInfo = {};
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowMediaList = true;//媒介列表
					$scope.isShowMedaiDetail = false;//媒介详情
					if(data.returnData!=null){
						$scope.customerInfo.idType = data.returnData.rows[0].idType;
						$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
						$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
						$scope.itemList.params.idType = $scope.mediaSearch.idType;
						$scope.itemList.params.idNumber = $scope.mediaSearch.idNumber;
						$scope.itemList.params.externalIdentificationNo = $scope.mediaSearch.externalIdentificationNo;
						$scope.itemList.search();
					}
				}else {
					$scope.isShowMediaList = false;//媒介列表
					$scope.isShowMedaiDetail = false;//媒介详情
				}
			});
			/*jfRest.request('cstMediaList', 'queryMedia', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/baseBsnPcsg/layerAdvanceCard.html', params, {
						title : T.T('KHH300020'),//'媒介信息',
						buttons : [ T.T('F00107'),T.T('F00012')],//'确认','关闭' 
						size : [ '1100px', '420px' ],
						callbacks : [$scope.callbackFun]
					});
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');//'操作失败';
					jfLayer.fail(returnMsg);
				}
			});*/
		};
		//点击弹窗确定后调用函数
		$scope.viewMediaInf = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.mediaDetailInfo = $scope.item;
			if($scope.mediaDetailInfo.invalidFlag== 'N' ){
				if ($scope.mediaDetailInfo.invalidReason == "TRF") {
					jfLayer.fail(T.T('KHJ5800003'));//"该卡已经转卡!"
				}else if ($scope.mediaDetailInfo.invalidReason == "EXP") {
					jfLayer.fail(T.T('KHJ5800004'));//"该卡已经到期!"
				}else if ($scope.mediaDetailInfo.invalidReason == "BRK") {
					jfLayer.fail(T.T('KHJ5800005'));//"该卡已经毁损!"
				}else if ($scope.mediaDetailInfo.invalidReason == "CLS") {
					jfLayer.fail(T.T('KHJ5800006'));//"该卡已经关闭!"
				}else if ($scope.mediaDetailInfo.invalidReason == "PNA") {
					jfLayer.fail(T.T('KHJ300023'));//"该卡已经提前续卡!"
				}
			}else {
			$scope.paramss = {};
			$scope.paramss.idType = $scope.mediaDetailInfo.idType;
			$scope.paramss.idNumber = $scope.mediaDetailInfo.idNumber;
			$scope.paramss.externalIdentificationNo = $scope.mediaDetailInfo.externalIdentificationNo;
			$scope.paramss.mediaObjectCode = $scope.mediaDetailInfo.mediaObjectCode;
			$scope.methodShow = false;
			jfRest.request('mediaLoss','queryMediaInfo',$scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showMdmInfEstbInfoBtn = true;  
					$scope.mediaDetailInfo.mainCustomerNo = data.returnData.rows[0].mainCustomerNo;
					$scope.mediaDetailInfo.institutionId = data.returnData.rows[0].institutionId;
					$scope.mediaDetailInfo.operationMode = data.returnData.rows[0].operationMode;
					$scope.mediaDetailInfo.mediaUserName = data.returnData.rows[0].mediaUserName;
					$scope.mediaDetailInfo.expirationDate = data.returnData.rows[0].expirationDate;
					$scope.mediaDetailInfo.isTransferCard = data.returnData.rows[0].isTransferCard;
					$scope.mediaDetailInfo.productObjectCode = data.returnData.rows[0].productObjectCode;
					$scope.mediaDetailInfo.mediaObjectCode = data.returnData.rows[0].mediaObjectCode;
					$scope.mediaDetailInfo.externalIdentificationNo = data.returnData.rows[0].externalIdentificationNo;
					$scope.mediaDetailInfo.mediaUnitCode = data.returnData.rows[0].mediaUnitCode;
					$scope.mediaDetailInfo.externalIdentificationNoNew = data.returnData.rows[0].externalIdentificationNoNew;
					$scope.mediaDetailInfo.mediaObjectCodeNew = data.returnData.rows[0].mediaObjectCodeNew;
					$scope.mediaDetailInfo.externalIdentificationNoNew = data.returnData.rows[0].externalIdentificationNoNew;
					$scope.mediaDetailInfo.productObjectCodeNew = data.returnData.rows[0].productObjectCodeNew;
					$scope.mediaDetailInfo.mainCustomerCodeNew = data.returnData.rows[0].mainCustomerCodeNew;
					$scope.mediaDetailInfo.mediaUserNameNew = data.returnData.rows[0].mediaUserNameNew;
					$scope.mediaDetailInfo.termValidityNew = data.returnData.rows[0].termValidityNew;
					//查询媒介基本信息
					$scope.queryMedaiBaeParams={
							idType:	$scope.customerInfo.idType,	
							idNumber: $scope.customerInfo.idNumber,
							externalIdentificationNo:$scope.item.externalIdentificationNo,
							mediaUnitCode: $scope.item.mediaUnitCode
					};
					$scope.queryMedaiBaseInf($scope.queryMedaiBaeParams);
					// 查询新媒介
					if ($scope.mediaDetailInfo.invalidFlag == "N"
							&& $scope.mediaDetailInfo.invalidReason == "TRF") {
						angular.element("#isTransferCard").attr("disabled","disabled");
						angular.element("#sureLossBtn").attr("disabled","disabled");
						angular.element("#sureLossBtn").css({"background-color" : "#D1D1D1"});
						$scope.showNewMediaDiv = true;
						$scope.methodShow = false;
					} else {
						angular.element("#isTransferCard").attr("disabled",false);
						angular.element("#sureLossBtn").attr("disabled",false);
						angular.element("#sureLossBtn").css({"background-color" : "#2998DC"});
						$scope.showNewMediaDiv = false;
						$scope.methodShow = false;
					}
					$scope.showMdmInfEstbInfoBtn = true;
					$scope.methodShow = false;
				} 
			});
		}
	};
	$scope.submitRlTmMkCrd = function(){
		$scope.advanceCard = {};
		$scope.advanceCard.externalIdentificationNo = $scope.mediaDetailInfo.externalIdentificationNo;
		jfRest.request('advanceRenewCard', 'save', $scope.advanceCard).then(function(data) {
			if (data.returnCode == '000000') {
				jfLayer.success(T.T('KHJ300024'));
			}
		});
	};
		//查询客户信息
		$scope.queryCustomer = function(obj){
			$scope.paramsss = {};
			//debugger;
			$scope.paramsss = {
					idNumber : obj.idNumber,
					externalIdentificationNo : obj.externalIdentificationNo,
					externalIdentificationNoOri : obj.externalIdentificationNo_ori,
					customerNo : obj.mainCustomerNo
			};
			jfRest.request('cstInfQuery', 'queryInf', $scope.paramsss).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.mobilePhone = data.returnData.rows[0].mobilePhone;
						$scope.customerName = data.returnData.rows[0].customerName;
						$scope.customerNo = data.returnData.rows[0].customerNo;
					}
				}
			});
		};
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
			$scope.mediaSearch.idNumber = '';
			if(data.value == "1"){//身份证
				$("#advanceCard_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#advanceCard_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#advanceCard_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#advanceCard_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#advanceCard_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#advanceCard_idNumber").attr("validator","id_isPermanentReside");
			}
		});
		//重置
		$scope.reset = function(){
			$scope.mediaSearch.idType = '';
			$scope.mediaSearch.idNumber = '';
			$scope.mediaSearch.externalIdentificationNo = '';
			$scope.isShowMediaList = false;
			$scope.showMdmInfEstbInfoBtn = false;
			$("#advanceCard_idNumber").attr("validator","noValidator");
			$("#advanceCard_idNumber").removeClass("waringform ");
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.operationMode = "A01";
			jfRest.request('disputeAccount', 'queryTransDate', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows!=null){
						$scope.mInfo.dateproductionCode = data.returnData.rows[0].nextProcessDate;
					}
				}
			});
		}
	});
	webApp.controller('layeradvanceCardCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu'); 
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translate.refresh();
		//查询媒介信息
		$scope.itemList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					'flag' : 1,
					"idType":$scope.mediaSearch.idType,
					"idNumber":$scope.mediaSearch.idNumber,
					"externalIdentificationNo":$scope.mediaSearch.externalIdentificationNo
				}, // 表格查询时的参数信息
				checkType : 'radio', // 当为checkbox时为多选
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMedia',// 列表的资源
				//autoQuery: false,
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
				transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
					if(data.returnCode == "000000"){
						if(data.returnData.rows!=null){
							$scope.itemList.params.idNumber = data.returnData.rows[0].idNumber;
						}
					}
				}
			};
	});
});
