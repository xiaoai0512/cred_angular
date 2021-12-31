'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('tradingNowCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_tradingNow');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaTrad');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//证件类型
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
 				$("#tradingNowP_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#tradingNowP_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#tradingNowP_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#tradingNowP_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#tradingNowP_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#tradingNowP_idNumber").attr("validator","id_isPermanentReside")
            }
        });
 		 $scope.authSceneArray ={ 
 		        type:"dynamicDesc", 
 		        param:{},//默认查询条件 
 		        text:"authSceneCode", //下拉框显示内容，根据需要修改字段名称 
 		        desc:"sceneDesc",
 		        value:"authSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
 		        resource:"scenario.scenarioQuery",//数据源调用的action 
 		        callback: function(data){
 		        }
 		};
 		// 日期控件
 		layui.use('laydate', function(){
 			  var laydate = layui.laydate;
 			  var startDate = laydate.render({
 					elem: '#LAY_start_Add',
 					min:Date.now(),
 					done: function(value, date) {
 						endDate.config.min = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						};
 						endDate.config.start = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						};
 					}
 				});
 				var endDate = laydate.render({
 					elem: '#LAY_end_Add',
 					done: function(value, date) {
 						startDate.config.max = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						}
 					}
 				});
 		});
		$scope.showQuotaTable = false;
		//当日交易查询列表
		$scope.itemList = {
				params : $scope.queryParam = {
						"authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'tradingNowList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_authType'],//查找数据字典所需参数
				transDict : ['transType_transTypeDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						//jfLayer.fail(data.returnMsg + "(" + data.returnCode + ")");
						$scope.showQuotaTable = false;
					}else{
						$scope.showQuotaTable = true;
					}
				}
			};
		$scope.selectList = function() {
			$scope.itemList.params.startDate = $("#LAY_start_Add").val();
			$scope.itemList.params.endDate = $("#LAY_end_Add").val();
			if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined)&&($scope.idType == "" || $scope.idType == null || $scope.idType == undefined)&&($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == null || $scope.itemList.params.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.itemList.data = [] ;
				 $scope.showQuotaTable = false;

			}else{
				if($scope.idNumber && $scope.itemList.params.externalIdentificationNo){
					jfLayer.fail(T.T('SQJ600005'));
					$scope.itemList.data = [] ;
					 $scope.showQuotaTable = false;

				}else if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002')); 

					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));
					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}
				else{
					$scope.itemList.params.idNumber = $scope.idNumber;
					$scope.itemList.params.idType = $scope.idType;
					$scope.itemList.search();
				}
			}
		};
		//查询详情事件
		$scope.selectInfo = function(event) {
			$scope.itemList.search();
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/authorization/tradingList/tradingNowInfo.html', $scope.item, {
				title : T.T('SQJ1100005'),
				buttons : [ T.T('F00012')],
				size : [ '950px', '520px' ],
				callbacks : []
			});
		};
		//查询详情事件
		$scope.selectHistory = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item.customerNo= event.customerNo;
			$scope.item.globalTransSerialNo= event.globalTransSerialNo;
			$scope.item.externalIdentificationNo= event.externalIdentificationNo;
			$scope.item.authDataSynFlag = '1';
			jfRest.request('creditHistory', 'query', $scope.item).then(function(data) {
				if(data.returnCode=='000000') {
					$scope.item = data.returnData;
					$scope.modal('/authorization/tradingList/tradingCreditHistory.html', $scope.item, {
						title : T.T('SQH2700102'),
						buttons : [ T.T('F00012')],
						size : [ '950px', '520px' ],
						callbacks : [$scope.historyInfo ]
					});
				}
			})
			
		};
		$scope.historyInfo = function(result){
			$scope.itemList.search();
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('tradingNowInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.transMessage = JSON.parse($scope.item.transMessage);
		$scope.verifnArea = JSON.parse($scope.item.verifnArea);
		/*if($scope.transMessage.ecommField50 != "" && $scope.transMessage.ecommField50 != null){
			$scope.ecommClearCurr = $scope.transMessage.ecommField50;
		}else{
			$scope.ecommClearCurr = $scope.transMessage.ecommField51;
		}
		if($scope.transMessage.ecommField5 == null || $scope.transMessage.ecommField5 == ""){
			if($scope.transMessage.ecommField5 == null || $scope.transMessage.ecommField5.toString() != "0"){
				$scope.ecommClearAmt = $scope.transMessage.ecommField6;
			} else {
				$scope.ecommClearAmt = $scope.transMessage.ecommField5;
			}
		}else{
			$scope.ecommClearAmt = $scope.transMessage.ecommField5;
		}*/
		//交易处理状态
		if($scope.item.transProcessStatus == '0'){
			$scope.transProcessStatusInfo = T.T('SQJ2700007');
		}else if($scope.item.transProcessStatus == '1'){
			$scope.transProcessStatusInfo = T.T('SQJ2700008');
		}else if($scope.item.transProcessStatus == '2'){
			$scope.transProcessStatusInfo = T.T('SQJ2700009');
		}else if($scope.item.transProcessStatus == '3'){
			$scope.transProcessStatusInfo = T.T('SQJ2700010');
		}
		//入账标志
		if($scope.item.transPostingFlag == 'S'){
			$scope.transPostingInfo = T.T('SQJ2700005');
		}else if($scope.item.transPostingFlag == 'D'){
			$scope.transPostingInfo = T.T('SQJ2700006');
		}
		//授权交易类型
		if($scope.item.transType == 'NM'){
			$scope.transTypeInfo = T.T('SQH2700011');
		}else if($scope.item.transType == 'FR'){
			$scope.transTypeInfo = T.T('SQH2700012');
		}else if($scope.item.transType == 'FV'){
			$scope.transTypeInfo = T.T('SQH2700013');
		}else if($scope.item.transType == 'VR'){
			$scope.transTypeInfo = T.T('SQH2700014');
		}else if($scope.item.transType == 'PA'){
			$scope.transTypeInfo = T.T('SQH2700015');
		}else if($scope.item.transType == 'PR'){
			$scope.transTypeInfo = T.T('SQH2700016');
		}else if($scope.item.transType == 'PV'){
			$scope.transTypeInfo = T.T('SQH2700017');
		}else if($scope.item.transType == 'PW'){
			$scope.transTypeInfo = T.T('SQH2700018');
		}else if($scope.item.transType == 'PC'){
			$scope.transTypeInfo = T.T('SQH2700019');
		}else if($scope.item.transType == 'CR'){
			$scope.transTypeInfo = T.T('SQH27000120');
		}else if($scope.item.transType == 'CV'){
			$scope.transTypeInfo = T.T('SQH2700021');
		}else if($scope.item.transType == 'CW'){
			$scope.transTypeInfo = T.T('SQH2700022');
		}
		//输入来源：
		if($scope.item.inputSource == 'V'){
			$scope.inputSourceInfo = "VISA";
		}else if($scope.item.inputSource == 'M'){
			$scope.inputSourceInfo = "MC";
		}else if($scope.item.inputSource == 'C'){
			$scope.inputSourceInfo = "CUP";
		}else if($scope.item.inputSource == 'L'){
			$scope.inputSourceInfo = T.T('SQJ2700004');
		}
		$scope.forceFlag = false;
		$scope.rvFlag = false;
		if($scope.item.forceAuthFlag == 'Y'){
			$scope.forceFlag = true;
		}else{
			$scope.forceFlag = false;
		}
		if($scope.item.rvTransFlag == 'Y'){
			$scope.rvFlag = true;
		}else{
			$scope.rvFlag = false;
		}
		//授权检查结果
		//cvv
		if($scope.verifnArea.ecommVerifnRsltCvv == 'A'){
			$scope.ecommVerifnRsltCvvInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltCvv == 'B'){
			$scope.ecommVerifnRsltCvvInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltCvv == 'D'){
			$scope.ecommVerifnRsltCvvInfo = T.T('SQJ2700003');
		}
		//cvv2
		if($scope.verifnArea.ecommVerifnRsltCvv2 == 'A'){
			$scope.ecommVerifnRsltCvv2Info = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltCvv2 == 'B'){
			$scope.ecommVerifnRsltCvv2Info = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltCvv2 == 'D'){
			$scope.ecommVerifnRsltCvv2Info = T.T('SQJ2700003');
		}
		//cavv
		if($scope.verifnArea.ecommVerifnRsltCavv == 'A'){
			$scope.ecommVerifnRsltCavvInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltCavv == 'B'){
			$scope.ecommVerifnRsltCavvInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltCavv == 'D'){
			$scope.ecommVerifnRsltCavvInfo = T.T('SQJ2700003');
		}
		//pin
		if($scope.verifnArea.ecommVerifnRsltPin == 'A'){
			$scope.ecommVerifnRsltPinInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltPin == 'B'){
			$scope.ecommVerifnRsltPinInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltPin == 'D'){
			$scope.ecommVerifnRsltPinInfo = T.T('SQJ2700003');
		}
		//ARQC
		if($scope.verifnArea.ecommVerifnRsltArqc == 'A'){
			$scope.ecommVerifnRsltArqcInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltArqc == 'B'){
			$scope.ecommVerifnRsltArqcInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltArqc == 'D'){
			$scope.ecommVerifnRsltArqcInfo = T.T('SQJ2700003');
		}
		//交易有效期
		if($scope.verifnArea.ecommVerifnRsltTransExpDte == 'A'){
			$scope.ecommVerifnRsltTransExpDteInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltTransExpDte == 'B'){
			$scope.ecommVerifnRsltTransExpDteInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltTransExpDte == 'D'){
			$scope.ecommVerifnRsltTransExpDteInfo = T.T('SQJ2700003');
		}
		//卡片有效期
		if($scope.verifnArea.ecommVerifnRsltMediaExpDte == 'A'){
			$scope.ecommVerifnRsltMediaExpDteInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltMediaExpDte == 'B'){
			$scope.ecommVerifnRsltMediaExpDteInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltMediaExpDte == 'D'){
			$scope.ecommVerifnRsltMediaExpDteInfo = T.T('SQJ2700003');
		}
		//卡片制数
		if($scope.verifnArea.ecommVerifnRsltPltNbrs == 'A'){
			$scope.ecommVerifnRsltPltNbrsInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltPltNbrs == 'B'){
			$scope.ecommVerifnRsltPltNbrsInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltPltNbrs == 'D'){
			$scope.ecommVerifnRsltPltNbrsInfo = T.T('SQJ2700003');
		}
		//发卡例外
		if($scope.verifnArea.ecommVerifnRsltExcp == 'A'){
			$scope.ecommVerifnRsltExcpInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltExcp == 'B'){
			$scope.ecommVerifnRsltExcpInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltExcp == 'D'){
			$scope.ecommVerifnRsltExcpInfo = T.T('SQJ2700003');
		}
		//卡片激活
		if($scope.verifnArea.ecommVerifnRsltActv == 'A'){
			$scope.ecommVerifnRsltActvInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltActv == 'B'){
			$scope.ecommVerifnRsltActvInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltActv == 'D'){
			$scope.ecommVerifnRsltActvInfo = T.T('SQJ2700003');
		}
		//国际组织例外
		if($scope.verifnArea.ecommVerifnRsltSpcl == 'A'){
			$scope.ecommVerifnRsltSpclInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltSpcl == 'B'){
			$scope.ecommVerifnRsltSpclInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltSpcl == 'D'){
			$scope.ecommVerifnRsltSpclInfo = T.T('SQJ2700003');
		}
		//欺诈检查
		if($scope.verifnArea.ecommVerifnRsltFraud == 'A'){
			$scope.ecommVerifnRsltFraudInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltFraud == 'B'){
			$scope.ecommVerifnRsltFraudInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltFraud == 'D'){
			$scope.ecommVerifnRsltFraudInfo = T.T('SQJ2700003');
		}
		//交易限制
		if($scope.verifnArea.ecommVerifnRsltVelo == 'A'){
			$scope.ecommVerifnRsltVeloInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltVelo == 'B'){
			$scope.ecommVerifnRsltVeloInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltVelo == 'D'){
			$scope.ecommVerifnRsltVeloInfo = T.T('SQJ2700003');
		}
		//正负面清单
		if($scope.verifnArea.ecommVerifnRsltBwlist == 'A'){
			$scope.ecommVerifnRsltBwlistInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltBwlist == 'B'){
			$scope.ecommVerifnRsltBwlistInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltBwlist == 'D'){
			$scope.ecommVerifnRsltBwlistInfo = T.T('SQJ2700003');
		}
		//额度检查
		if($scope.verifnArea.ecommVerifnRsltLimit == 'A'){
			$scope.ecommVerifnRsltLimitInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltLimit == 'B'){
			$scope.ecommVerifnRsltLimitInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltLimit == 'D'){
			$scope.ecommVerifnRsltLimitInfo = T.T('SQJ2700003');
		}
		//原交易检查
		if($scope.verifnArea.ecommVerifnRsltOriTrans == 'A'){
			$scope.ecommVerifnRsltOriTransInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltOriTrans == 'B'){
			$scope.ecommVerifnRsltOriTransInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltOriTrans == 'D'){
			$scope.ecommVerifnRsltOriTransInfo = T.T('SQJ2700003');
		}
		//授权匹配检查
		if($scope.verifnArea.ecommVerifnRsltAuthMatch == 'A'){
			$scope.ecommVerifnRsltAuthMatchInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltAuthMatch == 'B'){
			$scope.ecommVerifnRsltAuthMatchInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltAuthMatch == 'D'){
			$scope.ecommVerifnRsltAuthMatchInfo = T.T('SQJ2700003');
		}
		//交易验证最终结果
		if($scope.verifnArea.ecommVerifnRsltFinalCheck == 'A'){
			$scope.ecommVerifnRsltFinalCheckInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltFinalCheck == 'B'){
			$scope.ecommVerifnRsltFinalCheckInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltFinalCheck == 'D'){
			$scope.ecommVerifnRsltFinalCheckInfo = T.T('SQJ2700003');
		}
		//账户验证结果
		if($scope.verifnArea.ecommVerifnRsltAccountCheck == 'A'){
			$scope.ecommVerifnRsltAccountCheckInfo = T.T('SQJ2700001');
		}else if($scope.verifnArea.ecommVerifnRsltAccountCheck == 'B'){
			$scope.ecommVerifnRsltAccountCheckInfo = T.T('SQJ2700002');
		}else if($scope.verifnArea.ecommVerifnRsltAccountCheck == 'D'){
			$scope.ecommVerifnRsltAccountCheckInfo = T.T('SQJ2700003');
		}
		$scope.forceInfo = function(){
			$scope.cusParams = {
					authDataSynFlag:'1',
					transMessage:$scope.item.transMessage,
					inputSource:$scope.item.inputSource,
					externalIdentificationNo:$scope.item.externalIdentificationNo,
				};
				jfRest.request('tradingNowList', 'force', $scope.cusParams)
			    .then(function(data) {
			    	if(data.returnCode == '000000'){
			    		$('#forceInfoId').attr('disabled',"true");
						$('#forceInfoId').css('background-color','#ccdfeb');
			    		jfLayer.success(T.T('F00064'));
			    	}
	            });
		};
		$scope.rvInfo = function(){
			$scope.cusParams = {
					authDataSynFlag:'1',
					transMessage:$scope.item.transMessage,
					inputSource:$scope.item.inputSource,
					externalIdentificationNo:$scope.item.externalIdentificationNo,
				};
				jfRest.request('tradingNowList', 'rvTrans', $scope.cusParams)
			    .then(function(data) {
			    	if(data.returnCode == '000000'){
			    		$('#rvInfoId').attr('disabled',"true");
						$('#rvInfoId').css('background-color','#ccdfeb');
			    		jfLayer.success(T.T('F00064'));
			    	}
			    	else{
			    		jfLayer.alert(T.T('F00065')+data.returnMsg);
			    	}
	            });
		};
		//authCreditUseHistorys有值显示或隐藏
		if($scope.item.authCreditUseHistorys && $scope.item.authCreditUseHistorys.length > 0){
			$scope.histDiv = true;
			$scope.histDiv2 = false;
			$scope.authCreditUseHistorys = $scope.item.authCreditUseHistorys;
		}else {
			$scope.histDiv = false;
			$scope.histDiv2 = true;
		}
	});
	webApp.controller('tradingCreditHistoryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lItems = $scope.item.x7604LList;
		$scope.bItems =$scope.item.x7604BList;
	});
});
