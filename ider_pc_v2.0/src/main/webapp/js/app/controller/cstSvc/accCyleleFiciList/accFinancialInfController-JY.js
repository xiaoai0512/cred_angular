'use strict';
define(function(require) {
	var webApp = require('app');
	//账户金融交易查询-第二版（禁用）
	webApp.controller('accFinancialInfCtrl-jy', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.isShow = false;
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
	  		$scope.accFinaForm.$setPristine();
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
		//点击查询，根据返回结果，弹窗他、，然后弹窗中，再正常调取
		$scope.isShowWindow = function(params){
			jfRest.request('accBscInf', 'query2', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/acbaUnitList/accountList.html', params, {
						title : T.T('KHJ4700001'),//'账务选择',
						buttons : [T.T('F00107'),T.T('F00108')],//'确认','取消' 
						size : [ '1250px', '450px' ],
						callbacks : [ $scope.callback ]
					});
				}
			});
		};
		$scope.accBlanInfo = {};
		$scope.callback = function(result){
			if(!result.scope.itemList.validCheck()){
				return;
			}else {
				$scope.accInfo = result.scope.itemList.checkedList();
				$scope.accInfo.idType = $scope.queryAccountForm.idType;
				$scope.accInfo.idNumber = $scope.queryAccountForm.idNumber;
				$scope.accInfo.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
				$scope.accBlanInfo.accountId = $scope.accInfo.accountId;
				$scope.accBlanInfo.customerName = $scope.accInfo.customerName;
				$scope.accBlanInfo.statusCode = $scope.accInfo.statusCode;
				$scope.accBlanInfo.productObjectCode = $scope.accInfo.productObjectCode;
				$scope.accBlanInfo.nextBillDate = $scope.accInfo.nextBillDate;
				$scope.accBlanInfo.currencyCode = $scope.accInfo.currencyCode;
				$scope.accBlanInfo.currentCycleNumber = $scope.accInfo.currentCycleNumber;
				if($scope.accInfo.businessDesc){
					$scope.accBlanInfo.businessTypeCodeTrans = $scope.accInfo.businessTypeCode + $scope.accInfo.businessDesc;
				}else {
					$scope.accBlanInfo.businessTypeCodeTrans = $scope.accInfo.businessTypeCode;
                }
                if($scope.accInfo.productDesc){
					$scope.accBlanInfo.productObjectCodeTrans = $scope.accInfo.productObjectCode + $scope.accInfo.productDesc;
				}else {
					$scope.accBlanInfo.productObjectCodeTrans = $scope.accInfo.productObjectCode;
                }
                if($scope.accInfo.programDesc){
					$scope.accBlanInfo.businessProgramNoTrans = $scope.accInfo.businessProgramNo + $scope.accInfo.programDesc;
				}else {
					$scope.accBlanInfo.businessProgramNoTrans = $scope.accInfo.businessProgramNo;
                }
                $scope.accBlanInfo.organNo = $scope.accInfo.organNo;
				$scope.accBlanInfo.statusCode = $scope.accInfo.statusCode;
				//账户状态
				if($scope.accBlanInfo.statusCode==1){
					$scope.accBlanInfo.statusCodeTrans = "活跃账户";//"活跃账户";
				}else if($scope.accBlanInfo.statusCode==2){
					$scope.accBlanInfo.statusCodeTrans = "非活跃账户";//"非活跃账户";
				}else if($scope.accBlanInfo.statusCode==3){
					$scope.accBlanInfo.statusCodeTrans = "冻结账户";//"冻结账户";
				}else if($scope.accBlanInfo.statusCode==8){
					$scope.accBlanInfo.statusCodeTrans = "关闭账户";//"关闭账户";
				}else if($scope.accBlanInfo.statusCode==9){
					$scope.accBlanInfo.statusCodeTrans = "待删除账户";//"待删除账户";
                }
                $scope.queryParams= {
						idType:$scope.accInfo.idType,
						idNumber:$scope.accInfo.idNumber,
						externalIdentificationNo:$scope.accInfo.externalIdentificationNo,
						accountId:$scope.accInfo.accountId,
						currencyCode:$scope.accInfo.currencyCode,
						operationMode:$scope.accInfo.operationMode,
				};
				$scope.accCycleFiciList.params = $scope.queryParams;
				$scope.accCycleFiciList.search();
				$scope.queryTimeBalance($scope.accInfo);
				$scope.balObcList.params = $scope.queryParams;
				$scope.balObcList.search();
				$scope.accBalObjTable.params = $scope.queryParams;
				$scope.accBalObjTable.search();
				$scope.safeApply();
				result.cancel();
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
		//查询实时余额
		$scope.queryTimeBalance = function(item){
			//console.log(item);
			$scope.balanceParams = {
					authDataSynFlag: "1"
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			jfRest.request('acbaUnitList', 'queryBalance', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
					$scope.accBlanInfo.totalBalance = data.returnData.rows[0].totalBalance;
					$scope.accBlanInfo.currPrincipalBalance = data.returnData.rows[0].currPrincipalBalance;
					$scope.accBlanInfo.billPrincipalBalance = data.returnData.rows[0].billPrincipalBalance;
					$scope.accBlanInfo.currInterestBalance = data.returnData.rows[0].currInterestBalance;
					$scope.accBlanInfo.billInterestBalance = data.returnData.rows[0].billInterestBalance;
					$scope.accBlanInfo.currCostBalance = data.returnData.rows[0].currCostBalance;
					$scope.accBlanInfo.billCostBalance = data.returnData.rows[0].billCostBalance;
					$scope.accBlanInfo.customerName = data.returnData.rows[0].customerName;
					$scope.accBlanInfo.nextBillDate = data.returnData.rows[0].nextBillDate;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');//"操作失败！"
						jfLayer.fail(returnMsg);
					}
				}
			});
		};
		//账户余额单元信息
		$scope.balObcList = {
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
		};
		//账户余额对象信息
		$scope.accBalObjTable = {
			params : {},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			autoQuery:false,
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//账户周期金融信息
		$scope.accCycleFiciList = {
			params : {},
			paging : true,
			resource : 'accCycleFiciList.query',
			autoQuery:false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//余额单元弹窗查询  "本金""利息""费用"
		$scope.balanceTypeArray = [{id:"P",name:T.T('KHH4700036')},{id:"I",name:T.T('KHH4700037')},{id:"F",name:T.T('KHH4700038')}];
		$scope.checkAcUint = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/acbaDtlEnqr.html', $scope.item, {
				title : T.T('KHJ4700002'),//'余额单元明细',
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		//账户余额对象信息弹窗查询
		$scope.checkAcBaObj = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/layerAcObjDetail.html', $scope.item, {
				title : T.T('KHJ4700003'),//'余额对象明细',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		//账户周期金融明细弹窗
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/accCycleFiciList/accCycleFiciDetail.html', $scope.item, {
				title : T.T('KHJ4700004'),//'账户周期金融明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '450px' ],
				//callbacks : [ $scope.callback ]
			});
		};
	});
	webApp.controller('queryAccountCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.itemList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					"idType":$scope.queryAccountForm.idType,
					"idNumber":$scope.queryAccountForm.idNumber,
					"externalIdentificationNo":$scope.queryAccountForm.externalIdentificationNo,
				},
				paging : true,
				resource : 'accBscInf.query2',
				callback : function(data) {
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
	});
	//周期金融明细
	webApp.controller('accCycleFiciDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		if($scope.item.fullPaymentFlag=='Y'){
			$scope.item.fullPaymentFlagDesc = T.T('KHJ4700005');//"已满足";
		}else if($scope.item.fullPaymentFlag=='N'){
			$scope.item.fullPaymentFlagDesc = T.T('KHJ4700006');//"不满足";
		}
	});
	//余额单元
	webApp.controller('acbaUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
	//余额对象
	webApp.controller('accObjDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
});
