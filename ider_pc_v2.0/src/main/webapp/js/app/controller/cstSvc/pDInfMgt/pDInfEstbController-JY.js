'use strict';
define(function(require) {
	var webApp = require('app');
	// 28产品信息建立
webApp.controller('pDInfEstbCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEstb');
	$translate.refresh();
	$scope.userName = lodinDataService.getObject("menuName");//菜单名
	$scope.isShowBudge = false;//预算单位
		//搜索身份证类型
		$scope.certificateTypeArray1 =[ {name : T.T('F00113'),id : '1'},//身份证
		                                {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		                                {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		                                {name : T.T('F00116') ,id : '4'} ,//中国护照
		                                {name : T.T('F00117') ,id : '5'} ,//外国护照
		                                {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		$scope.pDInfEstbInfo = { };
		$scope.pDInfEnqrAndMntInfo = { };
		// 自定义下拉框
		$scope.directDebitStatusArray = [ {
			name : T.T('KHJ3700001'),//'未设置',
			id : '0'
		}, {
			name : T.T('KHJ3700002'),//'已设置',
			id : '1'
		} ];// 约定扣款状态
		$scope.directDebitModeArray = [ {
			name : T.T('KHJ3700003'),//'最小还款',
			id : '0'
		}, {
			name : T.T('KHJ3700004'),//'全额还款',
			id : '1'
		} ];// 约定扣款方式
		$scope.exchangePaymentFlagArray = [ {
			name : T.T('KHJ3700005'),//'购汇还款',
			id : 'Y'
		}, {
			name : T.T('KHJ3700006'),//'无购汇还款',
			id : 'N'
		} ];// 购汇还款标志
		// ng-if属性
		$scope.showPDInfEstbInfoBtn = false;
		// 已有客户产品信息
		$scope.cstPDInfTable = {
			// checkType : 'radio',
				autoQuery: false,
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
				idNumber : $scope.pDInfEstbInfo.idNumber,
				idType : $scope.pDInfEstbInfo.idType
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstProduct.quereyProInf',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.pDInfEstbInfo.idNumber= '';
			if(data.value == "1"){//身份证
				$("#pDInfEstb_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#pDInfEstb_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#pDInfEstb_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#pDInfEstb_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#pDInfEstb_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#pDInfEstb_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#pDInfEstb_idNumber").attr("validator","noValidator");
				$scope.pDInfEstbQuForm.$setPristine();
				$("#pDInfEstb_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.reset = function(){
			$scope.pDInfEstbInfo.idNumber= '';
			$scope.pDInfEstbInfo.idType= '';
			$scope.showPDInfEstbInfoBtn = false;
			$("#pDInfEstb_idNumber").attr("validator","noValidator");
			$("#pDInfEstb_idNumber").removeClass("waringform ");
		};
		//约定还款状态选择
		var form = layui.form;
		form.on('select(getdDebitStatus)',function(event){
			$scope.debitStatus=event.value;
			if($scope.debitStatus == "0"){//未设置
				$(".allInfDiv").find('.red').removeClass("disB").addClass("disN");
			}
			else if($scope.debitStatus == "1" ){ //已设置
				$(".allInfDiv").find('.red').removeClass("disN").addClass("disB")
			}
		});
		//查询预算单位
		 $scope.budgetInf = {};
		$scope.searBudgetOrg = function(){
			if($scope.budgetInf.budgetOrgCode == '' || $scope.budgetInf.budgetOrgCode == undefined){
				jfLayer.fail('请填写预算单位编码!');
				return;
            }
            $scope.paramss = {
				idType : '7',
				idNumber : $scope.budgetInf.budgetOrgCode
			};
			jfRest.request('budgetUnit', 'query',$scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowBudge = true;
					$scope.budgetInf.budgetOrgName = data.returnData.rows[0].customerName;
					$scope.budgetInf.billDay = data.returnData.rows[0].billDay;
				} else if (data.returnMsg != "OK") {
					$scope.isShowBudge = false;
				}
			});
		};
		//重置预算单位
		$scope.resetBudgetOrg = function(){
			$scope.budgetInf.budgetOrgCode = '';
			$scope.budgetInf.budgetOrgName = '';
			$scope.budgetInf.billDay = '';
			$scope.isShowBudge = false;
		};
		// 选择产品对象
		$scope.selPDObjTable = {
			 autoQuery:false,
			checkType : 'radio', // 
			params : {
				pageSize : 10,
				indexNo : 0,
				idNumber : $scope.pDInfEstbInfo.idNumber,
				idType : $scope.pDInfEstbInfo.idType
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'pDInfEstb.queryProd',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
				/*if(row.productType == "RLN"){//显示外部识别号
					$(".allInfDiv").find('.red').removeClass("disN").addClass("disB")
				}else { //显示账户
					$(".allInfDiv").find('.red').removeClass("disB").addClass("disN");
				}*/
			}
		};
		// 查询
		$scope.searchPDInfEstbInfo = function() {
			// 掉后台后显示 BSS.IQ.01.0001客户信息
			// COS.IQ.02.0013产品对象查询
			if($scope.pDInfEstbInfo.idNumber == "" || $scope.pDInfEstbInfo.idNumber == null || $scope.pDInfEstbInfo.idNumber == undefined){
				jfLayer.alert(T.T('KHJ3900008'));//"请输入证件号！"
				return;
            }
            if($scope.pDInfEstbInfo.idType == "" || $scope.pDInfEstbInfo.idType == null || $scope.pDInfEstbInfo.idType == undefined){
				jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
				return;
            }
            $scope.paramss = {
				idNumber : $scope.pDInfEstbInfo.idNumber,
				idType : $scope.pDInfEstbInfo.idType
			};
			$scope.cstPDInfTable.params = Object.assign($scope.cstPDInfTable.params, $scope.paramss);
			$scope.selPDObjTable.params = Object.assign($scope.selPDObjTable.params, $scope.paramss);
			jfRest.request('cstInfQuery', 'queryInf',$scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows[0].customerNo == null || data.returnData.rows[0].customerNo == undefined) {
						jfLayer.alert(T.T('KHJ3700007'));//"抱歉，没有此用户！"
					} else {
						$scope.showPDInfEstbInfoBtn = true;
						$scope.idNumber = data.returnData.rows[0].idNumber;
						$scope.mobilePhone = data.returnData.rows[0].mobilePhone;
						$scope.customerName = data.returnData.rows[0].customerName;
						$scope.operationMode = data.returnData.rows[0].operationMode;
						$scope.customerNo = data.returnData.rows[0].customerNo;
						$scope.billDay = data.returnData.rows[0].billDay;
						$scope.cstPDInfTable.params.customerNo = data.returnData.rows[0].customerNo;
						$scope.cstPDInfTable.params.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
						$scope.cstPDInfTable .search();
						$scope.selPDObjTable.params.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
						$scope.selPDObjTable.search();
					}
				} 
			});
			$scope.showPDInfEstbInfoBtn = true;
		};
		// 保存 客户产品单元新建
		$scope.payInf = {
			directDebitStatus : "",
			directDebitMode : "",
			exchangePaymentFlag : "",
			directDebitBankNo : "",
			directDebitAccountNo : "",
			coBrandedNo : ""
		};
		$scope.saveCustomerProduct = function() {
			$scope.sparamss = {
				idType: $scope.pDInfEstbInfo.idType,
				idNumber : $scope.idNumber,
				customerName : $scope.customerName,
				customerNo : $scope.customerNo,
				billDay : $scope.billDay
			};
			if(!$scope.selPDObjTable.validCheck()){
				return;
			}
			var checkedItem = $scope.selPDObjTable.checkedList();
			if ($scope.payInf.directDebitStatus == "1") {
				if(($scope.payInf.directDebitStatus == "" || $scope.payInf.directDebitStatus == undefined || $scope.payInf.directDebitStatus == null) 
				|| ($scope.payInf.directDebitMode == "" || $scope.payInf.directDebitMode == undefined || $scope.payInf.directDebitMode == null) 
				|| ($scope.payInf.directDebitBankNo == "" || $scope.payInf.directDebitBankNo == undefined || $scope.payInf.directDebitBankNo == null) 
				|| ($scope.payInf.directDebitAccountNo == "" || $scope.payInf.directDebitAccountNo == undefined || $scope.payInf.directDebitAccountNo == null) 
				|| ($scope.payInf.exchangePaymentFlag == "" || $scope.payInf.exchangePaymentFlag == undefined || $scope.payInf.exchangePaymentFlag == null) 
				){
					jfLayer.alert(T.T('KHJ3700008'));//"请填写还款信息！"
					return;
				}
            }
            $scope.sparamss = Object.assign($scope.sparamss,
					$scope.payInf);
			$scope.saveparamss = Object.assign($scope.sparamss,
					checkedItem);
			$scope.saveparamss.operatorId = sessionStorage.getItem("userName");
			$scope.saveparamss.budgetOrgCode = $scope.budgetInf.budgetOrgCode;
			jfRest.request('cstProduct', 'saveCstProduct',$scope.saveparamss).then(
				function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));//"保存成功"
						$scope.isShowBudge = false;
						$scope.payInf.budgetOrgName ='';
						$scope.cstPDInfTable.search();
					}
				});
		}
	});
});
