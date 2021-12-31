'use strict';
define(function(require) {
	var webApp = require('app');
	// 费用信息查询
	webApp.controller('costInfQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/costInfMage/i18n_costInf');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.costSearch = {};
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
			$scope.costSearch.idNumber ='';
			if(data.value == "1"){//身份证
				$("#costInfQuery_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#costInfQuery_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#costInfQuery_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#costInfQuery_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#costInfQuery_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#costInfQuery_idNumber").attr("validator","id_isPermanentReside");
				$scope.costInfForm.$setPristine();
            }
        });
		//重置
		$scope.reset = function(){
			$scope.costSearch.idType = '';
			$scope.costSearch.idNumber = '';
			$scope.costSearch.externalIdentificationNo = '';
			$scope.resultDiv =false;
		};
		$scope.queryCostList = function(){
			if(($scope.costSearch.idType == null || $scope.costSearch.idType == ''|| $scope.costSearch.idType == undefined) &&
					($scope.costSearch.customerNo == null || $scope.costSearch.customerNo == ''|| $scope.costSearch.customerNo == undefined) &&
					($scope.costSearch.idNumber == "" || $scope.costSearch.idNumber == undefined ) && ( $scope.costSearch.externalIdentificationNo == "" || $scope.costSearch.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert(T.T('F00076'));//"请输入证件号码或外部识别号"
			}
			else {
				if($scope.costSearch["idType"]){
					if($scope.costSearch["idNumber"] == null || $scope.costSearch["idNumber"] == undefined || $scope.costSearch["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
						$scope.showUnifiedDateDiv = false; 
					}else {
						$scope.searchHandlee($scope.costSearch);
					}
				}else if($scope.costSearch["idNumber"]){
					if($scope.costSearch["idType"] == null || $scope.costSearch["idType"] == undefined || $scope.costSearch["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
						$scope.showUnifiedDateDiv = false; 
					}else {
						$scope.searchHandlee($scope.costSearch);
					}
				}else {
					$scope.searchHandlee($scope.costSearch);
				}
			}
		};
		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.resultDiv = true;
					$scope.costListarams = {
						idType: $scope.costSearch.idType,
						idNumber: $scope.costSearch.idNumber,
						externalIdentificationNo: $scope.costSearch.externalIdentificationNo,
						pageSize : 10,
						indexNo : 0,
						logLevel: 'A',
						activityNo: 'x8010',
						flag:'Y',
//					    eventNoList:['ISS.PT.60.0001','ISS.PT.60.0002','ISS.PT.60.1001','ISS.PT.60.1002']
						queryType: '1',
						eventNoLikeStr: 'PT.60',
						eventNo: 'ISS.PT.60.9999'
					};
					$scope.costInfList.params = $scope.costListarams;
					$scope.costInfList.search();
				}else {
					$scope.resultDiv = false;
				}
			});
		};
		//费用列表
		$scope.costInfList = {
				params : {
					"pageSize" : 10,
					"indexNo" : 0
				},
				autoQuery : false,
				paging : true,
				resource : 'costInfMag.query',
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_ecommTransStatus'],//查找数据字典所需参数
				transDict : ['transState_transStateDesc'],//翻译前后key
				callback : function(data) {
				}
			};
		//调整金额
		$scope.adjustAmtBtn = function(item){
			$scope.item =$.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/costInfMage/creditAdjustAmount.html', $scope.item, {
				title :  T.T('KHJ6100001'),
				buttons : [T.T('F00125'), T.T('F00046')],
				size : [ '1100px', '300px' ],
				callbacks : [ $scope.sureAdjustAmt ]
			});
		};
		//确定贷记调整金额
		$scope.sureAdjustAmt = function(result){
			$scope.item = result.scope.item;
			//调整金额不可为空和0
			if($scope.item.adjustAmount == 0 || $scope.item.adjustAmount == null || $scope.item.adjustAmount == undefined || $scope.item.adjustAmount == ""){
				jfLayer.alert(T.T('KHJ6100004'));
				return;
            }
            if($scope.item.adjustedAmount == null || $scope.item.adjustedAmount == undefined){
				$scope.item.adjustedAmount = 0;
            }
            $scope.item.adjustAmtSum = $scope.item.adjustedAmount + Number($scope.item.adjustAmount);
			if($scope.item.adjustAmtSum > $scope.item.transAmount){
				jfLayer.alert(T.T('KHJ6100002'));
				return;
            }
            $scope.adjustParams = {
				idType : $scope.costSearch.idType,
				idNumber : $scope.costSearch.idNumber,
				externalIdentificationNo : $scope.costSearch.externalIdentificationNo,
				ecommCoreTransHistId: $scope.item.id,//交易历史id
				ecommAdjustedAmount: $scope.item.adjustAmtSum,//调整金额
				ecommTransAmount: $scope.item.transAmount,//交易金额
//				ecommEntryId:	$scope.item.externalIdentificationNo,
				ecommEventId:	$scope.item.eventNo,
				ecommTransAmount:	$scope.item.adjustAmount, 
				ecommTransCurr:	$scope.item.transCurrCde, 
				ecommOriTransDate:	$scope.item.transDate,
				ecommOrigGlobalSerialNumbr:	$scope.item.globalSerialNumbr,
				ecommTransPostingAmount: $scope.item.adjustAmount,	
				ecommTransPostingCurr:	$scope.item.postingCurrencyCode,
				ecommCoreTransHistId : $scope.item.id,
				ecommAdjustedDesc : $scope.item.ecommAdjustedDesc,
				ecommSubAccIdentify: "P",
			};
			if($scope.costSearch.idNumber && ($scope.costSearch.externalIdentificationNo == '' ||
			$scope.costSearch.externalIdentificationNo == null || $scope.costSearch.externalIdentificationNo == undefined
			)){
				$scope.adjustParams.ecommPostingAcctNmbr = $scope.item.accountId;
			}else if($scope.costSearch.externalIdentificationNo && ($scope.costSearch.idNumber == '' ||
					$scope.costSearch.idNumber == null || $scope.costSearch.idNumber == undefined	
			)){
				//$scope.adjustParams.ecommEntryId = $scope.item.externalIdentificationNo;
				//取查询条件的外部识别号===因为列表没有返回外部识别号 报错=====如果有问题改时说一声
				$scope.adjustParams.ecommEntryId = $scope.costSearch.externalIdentificationNo;
            }
            $scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.item.eventNo;
			//消费杂费实时贷调事件
			jfRest.request('costInfMag','changeEv',$scope.adjustParams,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ6100003'));
					$scope.safeApply();
					result.cancel();
					$scope.costInfList.params = $scope.costListarams;
					$scope.costInfList.search();
				}
			});
		};
	});
	//贷记调整金额
	webApp.controller('creditAdjustAmountCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/costInfMage/i18n_costInf');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.item = $scope.item;
		if($scope.item.adjustedAmount == null || $scope.item.adjustedAmount == undefined){
			$scope.item.adjustedAmount = 0;
		}
	});
});
