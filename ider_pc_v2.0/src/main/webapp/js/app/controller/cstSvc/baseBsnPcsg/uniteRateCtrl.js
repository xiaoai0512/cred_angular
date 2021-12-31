'use strict';
define(function(require) {
	var webApp = require('app');
	//统一利率
	webApp.controller('uniteRateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.isShow = false;
    	$scope.showList = false;
    	$scope.queryAccountForm = {};
    	//搜索身份证类型
		$scope.certificateTypeArray1 = 
			[ {name : T.T('F00113'),id : '1'},//身份证
			  {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
			  {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
			  {name : T.T('F00116') ,id : '4'} ,//中国护照
			  {name : T.T('F00117') ,id : '5'} ,//外国护照
			  {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
	  //联动验证
	  var form = layui.form;
	  form.on('select(getIdType)',function(data){
		$scope.queryAccountForm.idNumber = '';  
	  	if(data.value == "1"){//身份证
	  		$("#accFina_idNumber").attr("validator","id_idcard");
	  	}else if(data.value == "2"){//港澳居民来往内地通行证
	  		$("#accFina_idNumber").attr("validator","id_isHKCard");
	  	}else if(data.value == "3"){//台湾居民来往内地通行证
	  		$("#accFina_idNumber").attr("validator","id_isTWCard");
	  	}else if(data.value == "4"){//中国护照
	  		$("#accFina_idNumber").attr("validator","id_passport");
	  	}else if(data.value == "5"){//外国护照passport
	  		$("#accFina_idNumber").attr("validator","id_passport");
	  	}else if(data.value == "6"){//外国人永久居留证
	  		$("#accFina_idNumber").attr("validator","id_isPermanentReside");
	  	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
	  		$("#accFina_idNumber").attr("validator","noValidator");
	  		$scope.queryInfForm.$setPristine();
	  		$("#accFina_idNumber").removeClass("waringform ");
        }
      });
		// 重置
		$scope.reset = function() {
			$scope.queryAccountForm.idNumber= '';
			$scope.queryAccountForm.externalIdentificationNo= '';
			$scope.queryAccountForm.idType= '';
			$scope.queryAccountForm.customerNo= '';
			$scope.isShow = false;
			$scope.accountInfTrue = false;
			$scope.showList = false;	
			$("#accFina_idNumber").attr("validator","noValidator");
			$("#accFina_idNumber").removeClass("waringform ");
		};
		//查询按钮，查询账户列表
		$scope.searchAccount = function(){
			if(($scope.queryAccountForm.idType == null || $scope.queryAccountForm.idType == ''|| $scope.queryAccountForm.idType == undefined) &&
				($scope.queryAccountForm.idNumber == null || $scope.queryAccountForm.idNumber == undefined || $scope.queryAccountForm.idNumber == "") &&
				($scope.queryAccountForm.externalIdentificationNo == null || $scope.queryAccountForm.externalIdentificationNo == undefined || $scope.queryAccountForm.externalIdentificationNo == "")){
				jfLayer.fail(T.T('F00076'));//"输入查询条件"
			}
			else {
				if($scope.queryAccountForm["idType"]){
					if($scope.queryAccountForm["idNumber"] == null || $scope.queryAccountForm["idNumber"] == undefined || $scope.queryAccountForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
						$scope.accountInfTrue = false;
					}else {
						$scope.isShowWindow($scope.queryAccountForm);
					}
				}else if($scope.queryAccountForm["idNumber"]){
					if($scope.queryAccountForm["idType"] == null || $scope.queryAccountForm["idType"] == undefined || $scope.queryAccountForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
						$scope.accountInfTrue = false;
					}else {
						$scope.isShowWindow($scope.queryAccountForm);
					}
				}else {
						$scope.isShowWindow($scope.queryAccountForm);
				}
			}
		};
		//点击查询，再正常调取
		$scope.isShowWindow = function(params){
			jfRest.request('accBscInf', 'query', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.showList = true;
						$scope.itemList.params.idType = $scope.queryAccountForm.idType;
						$scope.itemList.params.idNumber = $scope.queryAccountForm.idNumber;
						$scope.itemList.params.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
						$scope.itemList.search();
					}
				}else {
					$scope.showList = false;
				}
			})
		};
		/*查询财务选择列表信息*/
		$scope.itemList = {
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				/*idType :  $scope.queryAccountForm.idType,
				idNumber : $scope.queryAccountForm.idNumber,
				externalIdentificationNo :  $scope.queryAccountForm.externalIdentificationNo*/
			},
			autoQuery: false,
			checkType : 'radio',
			paging : true,
			resource : 'accBscInf.query',
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],//查找数据字典所需参数
			transDict : ['accountOrganForm_accountOrganFormDesc','businessDebitCreditCode_businessDebitCreditCodeDesc','statusCode_statusCodeDesc'],//翻译前后key
			callback : function(data) {
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//
		$scope.accInfo = {};
		$scope.viewBalanceInf = function(item){
			console.log($scope.accInfo.accountId);
			$scope.accInfo=item;
			$scope.isShow = true;
			$scope.accInfo.idType =  $scope.queryAccountForm.idType;
			$scope.accInfo.idNumber =  $scope.queryAccountForm.idNumber;
			$scope.accInfo.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
			$scope.queryParams= {
				idType:$scope.accInfo.idType,
				idNumber:$scope.accInfo.idNumber,
				externalIdentificationNo:$scope.accInfo.externalIdentificationNo,
				accountId:$scope.accInfo.accountId,
				currencyCode:$scope.accInfo.currencyCode,
			};
			$scope.accBalObjTable.params = $scope.queryParams;
			$scope.accBalObjTable.search($scope.queryParams);
			$scope.safeApply();
			//result.cancel();
			};
		//账户余额对象信息
		$scope.accBalObjTable = {
			params : {},
			autoQuery:false,
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.queryUniteRate',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
			transDict : ['rateChangeFlag_rateChangeFlagDesc','overpayRateChangeFlag_overpayRateChangeFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
				}
			}
		};
		//账户余额对象信息弹窗查询
		$scope.checkAcBaObj = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/layerAcObjDetail.html', $scope.item, {
				title : T.T('KHJ4700003'),//'余额对象明细',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '900px', '500px' ],
				callbacks : []
			});
		};
		$scope.saveUinteRate = function(){
			console.log($scope.accInfo);
			$scope.rateInf ={
					interestRate: $scope.accInfo.interestRate,
					accountId: $scope.accInfo.accountId,
					currencyCode: $scope.accInfo.currencyCode,
					idType:$scope.accInfo.idType,
					idNumber:$scope.accInfo.idNumber,
					externalIdentificationNo:$scope.accInfo.externalIdentificationNo,
			};
			jfRest.request('accBalObj', 'saveUniteRate', $scope.rateInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accInfo ={};
					$scope.isShow =false;
				}else{
					$scope.isShow =false;
				}
			});
		};
	});
//	webApp.controller('uniteRateAccCtrl', function($scope, $stateParams, jfRest,
//			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
//		
//		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
//		$translate.use($scope.lang);
//		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
//		$translate.refresh();
//		
//		
//		$scope.itemList = {
//				checkType : 'radio',
//				params : $scope.queryParam = {
//					"pageSize" : 10,
//					"indexNo" : 0,
//					"idType":$scope.queryAccountForm.idType,
//					"idNumber":$scope.queryAccountForm.idNumber,
//					"externalIdentificationNo":$scope.queryAccountForm.externalIdentificationNo,
//				},
//				paging : true,
//				resource : 'accBscInf.query',
//				callback : function(data) {
//					console.log(data);
//					if(data.returnCode == '000000'){
//						if(!data.returnData.rows || data.returnData.rows.length == 0){
//							data.returnData.rows = [];
//						}
//					}else {
//						var returnMsg = data.returnMsg ? data.returnMsg :T.T('F00035');// '操作失败！'
//						jfLayer.fail(returnMsg);
//					}
//				}
//			};
//		
//	});
	//余额对象
	webApp.controller('accObjDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
});
