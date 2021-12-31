'use strict';
define(function(require) {
	var webApp = require('app');
	//账户金融交易查询
	webApp.controller('accFinancialInfThreeCtrl', function($scope, $stateParams, jfRest,
			$http, $timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_depositInf');
		$translatePartialLoader.addPart('pages/cstSvc/disputeAccontInfo/i18n_disputeAccontInfo');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.operationMode = lodinDataService.getObject("operationMode");//运营模式
    	//console.log( lodinDataService.getObject("menuName"));
		$scope.isShowRevoleAccDetail = false;//循环账户详情
    	$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
    	$scope.isShowTransAccDetail = false;//交易账户详情
    	$scope.isShowDisputeAccDetail = false;//争议账户详情 
    	$scope.isShowOrginTransDetail = false;//原交易信息
    	//资产转变阶段 (PACK-封包，TRSF-转让，REPO-回购
		/*$scope.capitalStageArr = [{name : T.T('KHH47000227'),id : 'PACK'},
		     			  {name : T.T('KHH47000228'),id : 'TRSF'} ,
		    			  {name : T.T('KHH47000229') ,id : 'REPO'}];*/
		//动态请求下拉框 证件类型
		 $scope.capitalStageArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_capitalStage",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"codes", //下拉框显示内容，根据需要修改字段名称 
	        desc:"detailDesc",
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
		};
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
		//动态请求下拉框 溢缴款冻结状态
		 $scope.overpayFreezeStatusArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_overpayFreezeStatus",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//币种
		 $scope.currencyCodeArr = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_curreny",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//动态请求下拉框 额度占用标识
		 $scope.amtOccFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_amtOccFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//动态请求下拉框 状态码
		 $scope.statusCodeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_statusCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 //循环账户状态码：
		 $scope.loopStatusCodeArr = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_accStatusCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//交易账户 账户状态码：
		$scope.transAccStatusCodeArr = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_accStatusCode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//交易账户 ：还款方式
		$scope.transRepayModeArr = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_repaymentMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//交易账户：贷款状态
		$scope.transLoanStatusArr = { 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_loanStatus",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		
		 // 重置
		$scope.reset = function() {
			$scope.queryAccountForm.idNumber= '';
			$scope.queryAccountForm.externalIdentificationNo= '';
			$scope.queryAccountForm.idType= '';
			$scope.isShowRevoleAccDetail = false;//循环账户详情
	    	$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
	    	$scope.isShowTransAccDetail = false;//交易账户详情
	    	$scope.isShowDisputeAccDetail = false;//争议账户详情 
	    	$scope.isShowOrginTransDetail = false;//原交易信息
    		$("#accFina_idNumber").attr("validator","noValidator");
			$("#accFina_idNumber").removeClass("waringform ");
		};
		//查询按钮，查询账户列表
		$scope.searchAccount = function(){
			if(($scope.queryAccountForm.idType == null || $scope.queryAccountForm.idType == ''|| $scope.queryAccountForm.idType == undefined) &&
					($scope.queryAccountForm.idNumber == null || $scope.queryAccountForm.idNumber == undefined || $scope.queryAccountForm.idNumber == "") &&
					($scope.queryAccountForm.externalIdentificationNo == null || $scope.queryAccountForm.externalIdentificationNo == undefined || $scope.queryAccountForm.externalIdentificationNo == "")){
				jfLayer.fail(T.T('F00076'));//"输入查询条件"
			}else {
				if($scope.queryAccountForm["idType"]){
					if($scope.queryAccountForm["idNumber"] == null || $scope.queryAccountForm["idNumber"] == undefined || $scope.queryAccountForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowRevoleAccDetail = false;//循环账户详情
				    	$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
				    	$scope.isShowTransAccDetail = false;//交易账户详情
				    	$scope.isShowDisputeAccDetail = false;//争议账户详情 
				    	$scope.isShowOrginTransDetail = false;//原交易信息
					}else {
						$scope.isShowWindow($scope.queryAccountForm);
					}
				}else if($scope.queryAccountForm["idNumber"]){
					if($scope.queryAccountForm["idType"] == null || $scope.queryAccountForm["idType"] == undefined || $scope.queryAccountForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowRevoleAccDetail = false;//循环账户详情
				    	$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
				    	$scope.isShowTransAccDetail = false;//交易账户详情
				    	$scope.isShowDisputeAccDetail = false;//争议账户详情 
				    	$scope.isShowOrginTransDetail = false;//原交易信息
					}else {
						$scope.isShowWindow($scope.queryAccountForm);
					}
				}else {
					$scope.isShowWindow($scope.queryAccountForm);
                }
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
		//核算状态  =====从库表获取
		$scope.accountingStatusArr ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 //资产属性
		 //$scope.absStatusArr = [{name: T.T('KHJ4700015'), id:'00'},{name: T.T('KHJ4700016'), id:'01'}];
		//动态请求下拉框 资产属性
		 $scope.absStatusArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_assetSubTable",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//点击查询，根据返回结果，弹窗他、，然后弹窗中，再正常调取
		$scope.isShowWindow = function(params){
			//查询客户是否存在
			$scope.params = {
				externalIdentificationNo : params.externalIdentificationNo	
			};
			jfRest.request('cstInfQuery', 'queryInf', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.customerName = data.returnData.rows[0].customerName;
					$scope.modal('/cstSvc/acbaUnitList/allAccountList.html', params, {
						title :  T.T('KHJ4700017'),
						buttons : [T.T('F00125'), T.T('F00046') ],
						size : [ '1100px', '500px' ],
						callbacks : [ $scope.accDetailSure ]
					});
				}else{
					$scope.isShowRevoleAccDetail = false;//循环账户详情
			    	$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
			    	$scope.isShowTransAccDetail = false;//交易账户详情
			    	$scope.isShowDisputeAccDetail = false;//争议账户详情 
			    	$scope.isShowOrginTransDetail = false;//原交易信息
				}
			});
		};
		$scope.accBlanInfo = {};
		//账户详情
		$scope.accDetailSure = function(result){
			//循环账户
			if(result.scope.revoleAccTreeTableChecked){
				$scope.isShowRevoleAccDetail = true;//循环账户详情
				$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
				$scope.isShowTransAccDetail = false;//交易账户详情 
				$scope.isShowDisputeAccDetail = false;//争议账户详情
				$scope.isShowOrginTransDetail = false;//原交易信息
				
				$scope.loopAccItemInf = result.scope.revoleAccTreeTableChecked;
				$scope.loopAccItemInf.customerName = $scope.customerName;
				$scope.loopAccItemInf.externalIdentificationNo = result.scope.externalIdentificationNo;
				/*===============================拼接数据=======================*/
				if($scope.loopAccItemInf.businessDesc){//业务类型
					$scope.loopAccItemInf.businessTypeCodeTrans = $scope.loopAccItemInf.businessTypeCode + $scope.loopAccItemInf.businessDesc;
				}else {
					$scope.loopAccItemInf.businessTypeCodeTrans = $scope.loopAccItemInf.businessTypeCode;
                }
                if($scope.loopAccItemInf.productDesc){//产品代码：
					$scope.loopAccItemInf.productObjectCodeTrans = $scope.loopAccItemInf.productObjectCode + $scope.loopAccItemInf.productDesc;
				}else {
					$scope.loopAccItemInf.productObjectCodeTrans = $scope.loopAccItemInf.productObjectCode;
                }
                if($scope.loopAccItemInf.programDesc){//业务项目
					$scope.loopAccItemInf.businessProgramNoTrans = $scope.loopAccItemInf.businessProgramNo + $scope.loopAccItemInf.programDesc;
				}else {
					$scope.loopAccItemInf.businessProgramNoTrans = $scope.loopAccItemInf.businessProgramNo;
                }
                /*===============================拼接数据 end=======================*/
				//查询3个表格  账户余额利率信息、账户余额明细信息、账户发生额明细信息
				$scope.queryRevoleAccDetail($scope.loopAccItemInf);
				$scope.safeApply();
				result.cancel();
			}else if(result.scope.overdueAccList.checkedList()){//溢缴款账户
				$scope.isShowRevoleAccDetail = false;//循环账户详情
				$scope.isShowOverdueAccDetail = true;//溢缴款账户详情
				$scope.isShowTransAccDetail = false;//交易账户详情 
				$scope.isShowDisputeAccDetail = false;//争议账户详情
				$scope.isShowOrginTransDetail = false;//原交易信息
				$scope.itemInfo = result.scope.overdueAccList.checkedList();
				$scope.safeApply();
				result.cancel();
				//拼接数据
				if($scope.itemInfo.currencyDesc){
					$scope.itemInfo.currencyCodeTrans = $scope.itemInfo.currencyCode + $scope.itemInfo.currencyDesc;
				}else{
					$scope.itemInfo.currencyCodeTrans = $scope.itemInfo.currencyCode;
				}
			}else if(result.scope.transAccTreeTableChecked){//交易账户信息表
				$scope.isShowRevoleAccDetail = false;//循环账户详情
				$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
				$scope.isShowTransAccDetail = true;//交易账户详情 
				$scope.isShowDisputeAccDetail = false;//争议账户详情
				$scope.isShowOrginTransDetail = false;//原交易信息
				//交易账户详情
				$scope.transAccItemInf = result.scope.transAccTreeTableChecked;
				$scope.transAccItemInf.externalIdentificationNo = result.scope.externalIdentificationNo;
				
				//查询已抛账欠款金额
//				$scope.queryTotalBalance($scope.transAccItemInf);
				$scope.queryParam = {
					accountId: $scope.transAccItemInf.accountId,
					externalIdentificationNo: $scope.transAccItemInf.externalIdentificationNo,
					currencyCode : $scope.transAccItemInf.currencyCode
				};
				//账户余额利率信息
				$scope.tradeDetailList.params = $.extend($scope.tradeDetailList.params,$scope.queryParam);
				$scope.tradeDetailList.search();
				//账户金融信息   同步循环账户中
				$scope.transAccItemInf = result.scope.transAccTreeTableChecked;
				$scope.transAccItemInf.operationMode = $scope.operationMode;
				$scope.transAccItemInf.customerName = $scope.customerName;
				/*===============================拼接数据=======================*/
				if($scope.transAccItemInf.businessDesc){//业务类型
					$scope.transAccItemInf.businessTypeCodeTrans = $scope.transAccItemInf.businessTypeCode + $scope.transAccItemInf.businessDesc;
				}else {
					$scope.transAccItemInf.businessTypeCodeTrans = $scope.transAccItemInf.businessTypeCode;
                }
                if($scope.transAccItemInf.productDesc){//产品代码：
					$scope.transAccItemInf.productObjectCodeTrans = $scope.transAccItemInf.productObjectCode + $scope.transAccItemInf.productDesc;
				}else {
					$scope.transAccItemInf.productObjectCodeTrans = $scope.transAccItemInf.productObjectCode;
                }
                if($scope.transAccItemInf.programDesc){//业务项目：
					$scope.transAccItemInf.businessProgramNoTrans = $scope.transAccItemInf.businessProgramNo + $scope.transAccItemInf.programDesc;
				}else {
					$scope.transAccItemInf.businessProgramNoTrans = $scope.transAccItemInf.businessProgramNo;
                }
                /*===============================拼接数据 end=======================*/
				//查询3个表  账户余额利率信息、账户余额明细信息、账户发生额明细信息
				$scope.queryRevoleAccDetail($scope.transAccItemInf);
				$scope.safeApply();
				result.cancel();
			}else if(result.scope.disputeAccList.checkedList()){//争议账户信息表
				$scope.isShowRevoleAccDetail = false;//循环账户详情
				$scope.isShowOverdueAccDetail = false;//溢缴款账户详情
				$scope.isShowTransAccDetail = false;//交易账户详情 
				$scope.isShowDisputeAccDetail = true;//争议账户详情
				$scope.isShowOrginTransDetail = false;//原交易信息
				
				$scope.disputeInf = result.scope.disputeAccList.checkedList();
				$scope.disputeInf.externalIdentificationNo = result.scope.externalIdentificationNo;
				$scope.disputeInf.operationMode = $scope.operationMode;
				$scope.safeApply();
				result.cancel();
				/*=================================拼接数据 开始=======================*/
				if($scope.disputeInf.programDesc){//业务项目
					$scope.disputeInf.businessProgramNoTrans = $scope.disputeInf.businessProgramNo + $scope.disputeInf.programDesc;
				}else{
					$scope.disputeInf.businessProgramNoTrans = $scope.disputeInf.businessProgramNo;
                }
                if($scope.disputeInf.businessDesc){//业务类型
					$scope.disputeInf.businessTypeCodeTrans = $scope.disputeInf.businessTypeCode + $scope.disputeInf.businessDesc;	
				}else {
					$scope.disputeInf.businessTypeCodeTrans = $scope.disputeInf.businessTypeCode;
                }
                if($scope.disputeInf.organName){
					$scope.disputeInf.organNoTrans = $scope.disputeInf.organNo + $scope.disputeInf.organName;
				}else {
					$scope.disputeInf.organNoTrans = $scope.disputeInf.organNo ;

}
                /*=================================翻译 end=======================*/
			}else {
				jfLayer.alert( T.T('F00126'));
            }
        };
		/*==================循环账户详情    账户金融信息查询 ========================*/
		//obj 为result中带入的单个账户信息
		$scope.queryRevoleAccDetail = function(obj){
			//查询实时余额
			/*if(obj.subAccIdentify && obj.subAccIdentify != 'L'){
				$scope.queryTimeBalance(obj);
			};*/
			$scope.queryTimeBalance(obj);
			//账户余额单信息、账户余额对象信息、账户周期金融信息查询条件
			$scope.queryParam = {
				idType: obj.idType,
				idNumber: obj.idNumber,
				externalIdentificationNo: obj.externalIdentificationNo,
				accountId: obj.accountId,
				currencyCode: obj.currencyCode,
				operationMode: obj.operationMode,
			};
			//账户余额利率信息
			$scope.accBalObjTable.params = $.extend($scope.accBalObjTable.params,$scope.queryParam);
			$scope.accBalObjTable.search();
			//账户余额明细信息
			$scope.balObcList.params = $.extend($scope.balObcList.params,$scope.queryParam);
			$scope.balObcList.search();
			//账户发生额明细信息
			$scope.accCycleFiciList.params = $.extend($scope.accCycleFiciList.params,$scope.queryParam);
			$scope.accCycleFiciList.search();
		};
		//查询账户余额汇总信息
		$scope.loopAccBalanceSum = {};//循环账户余额汇总信息
		$scope.transAccBalanceSum = {};//交易账户余额汇总信息
		$scope.queryTimeBalance = function(item){
			$scope.balanceParams = {
					authDataSynFlag: "1",
					requestType: '1',
					externalIdentificationNo: $scope.queryAccountForm.externalIdentificationNo
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			jfRest.request('acbaUnitList', 'queryBalance2', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
					//循环账户余额汇总信息
					$scope.loopAccBalanceSum.accountId = data.returnData.rows[0].accountId;//交易账户 账号
					$scope.loopAccBalanceSum.totalBalance = data.returnData.rows[0].totalBalance;//交易账户 
					$scope.loopAccBalanceSum.billCostBalance = data.returnData.rows[0].feeForBill;
					$scope.loopAccBalanceSum.billPrincipalBalance = data.returnData.rows[0].principalForBill;
					$scope.loopAccBalanceSum.billInterestBalance = data.returnData.rows[0].interestForBill;
					$scope.loopAccBalanceSum.currCostBalance = data.returnData.rows[0].feeForCurrent;
					$scope.loopAccBalanceSum.currPrincipalBalance = data.returnData.rows[0].principalForCurrent;
					$scope.loopAccBalanceSum.currInterestBalance = data.returnData.rows[0].interestForCurrent;
					//交易账户 余额汇总信息
					$scope.transAccBalanceSum.accountId = data.returnData.rows[0].accountId;//交易账户 账号
					$scope.transAccBalanceSum.totalBalance = data.returnData.rows[0].totalBalance;//交易账户 
					$scope.transAccBalanceSum.billCostBalance = data.returnData.rows[0].feeForBill;
					$scope.transAccBalanceSum.billPrincipalBalance = data.returnData.rows[0].principalForBill;
					$scope.transAccBalanceSum.billInterestBalance = data.returnData.rows[0].interestForBill;
					$scope.transAccBalanceSum.currCostBalance = data.returnData.rows[0].feeForCurrent;
					$scope.transAccBalanceSum.currPrincipalBalance = data.returnData.rows[0].principalForCurrent;
					$scope.transAccBalanceSum.currInterestBalance = data.returnData.rows[0].interestForCurrent;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
					}
				}
			});
		};
		//账户余额利率信息
		$scope.accBalObjTable = {
			params : {},
			autoQuery: false,
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
			transDict : ['rateChangeFlag_rateChangeFlagDesc','overpayRateChangeFlag_overpayRateChangeFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//账户余额明细信息
		$scope.balObcList = {
				params :{}, // 表格查询时的参数信息
				autoQuery: false,
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType','dic_assetSubTable'],//查找数据字典所需参数
				transDict : ['balanceType_balanceTypeDesc','assetProperties_assetPropertiesDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//账户发生额明细信息
		$scope.accCycleFiciList = {
			params : {},
			autoQuery: false,
			paging : true,
			resource : 'accCycleFiciList.query',
			callback : function(data) {
			}
		};
		/*==================循环账户详情end    ========================*/
		/*==================交易账户详情 开始   ========================*/
		//查询已抛账欠款金额
		$scope.queryTotalBalance = function(obj){
			$scope.paramsObj ={
				accountId:  obj.accountId,
				externalIdentificationNo: obj.externalIdentificationNo,
				currencyCode:obj.currencyCode,
				"pageSize" : 10,
				"indexNo" : 0,
			};
			jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.obj){
						$scope.tossedAmount = data.returnData.obj.totalBalance;
					}else {
						$scope.totalBalance = 0;
					}
				}
			});
		};
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
			}, // 表格查询时的参数信息
			autoQuery: false,
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				//console.log(data);
				if(data.returnCode == '000000'){
					$scope.tossedAmount = data.returnData.obj.totalBalance;
				}
			}
		};
		//动态请求下拉框 余额类型
		 $scope.balanceTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_balanceType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		$scope.checkAcUint = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/acbaDtlEnqr.html', $scope.item, {
				title : T.T('KHJ4700002'),//'余额单元明细',
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [  ]
			});
		};
		//账户余额对象信息弹窗查询
		/*$scope.checkAcBaObj = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/layerAcObjDetail.html', $scope.item, {
				title : T.T('KHJ4700003'),//'余额对象明细',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '900px', '500px' ],
				//callbacks : [  ]
			});
		};*/
		//账户周期金融明细弹窗
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/accCycleFiciList/accCycleFiciDetail.html', $scope.item, {
				title : T.T('KHJ4700004'),//'账户周期金融明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '450px' ],
				callbacks : [  ]
			});
		};
		/*==================交易账户详情 end   ========================*/
		/*=================争议账户详情 开始   ========================*/
		//原交易信息 obj 为争议账户一条信息
		$scope.orginTransInfBtn= function(){
			$scope.item = $scope.disputeInf;
			$scope.item.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
			$scope.modal('/cstSvc/acbaUnitList/orginTransInfo.html',$scope.item, {
				title : T.T('KHJ4700025'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst= function(){
			$scope.params = {
				ecommEntryId : $scope.disputeInf.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : $scope.disputeInf.oldGlobalSerialNumbr,
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success( T.T('KHJ4700026'));
//						$scope.disputeQueryTable.search();
				}
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank= function(){
			$scope.params = {
				ecommEntryId : $scope.disputeInf.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : $scope.disputeInf.oldGlobalSerialNumbr,
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4700027'));
//						$scope.disputeQueryTable.search();
				} 
			});
		};
		//调单申请/拒付管理
		$scope.searchApp= function(){
			if($scope.disputeInf.statusCode != "D" && $scope.disputeInf.statusCode != "C"){
				jfLayer.fail(T.T('KHJ4700028'));
			}else{
				if($scope.disputeInf.statusCode == "D"){
					var cardBin = $scope.disputeInf.externalIdentificationNo.substring(3,9);
					$scope.queryParam = {
						binNo : cardBin,
						idType: $scope.disputeInf.idType,
						idNumber: $scope.disputeInf.idNumber,
						externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
					};
					jfRest.request('productLine','queryBin', $scope.queryParam).then(function(data) {
						if(data.returnData.rows == null){
							jfLayer.fail(T.T('KHJ4700029'));
//							$scope.safeApply();
//							result.cancel();
							//return;
						}else{
							var cardScheme = data.returnData.rows[0].cardScheme;
							if(data.returnData.rows[0].cardScheme == "V" || data.returnData.rows[0].cardScheme == "M"){
								$scope.queryParam1 = {
										globalSerialNumber : $scope.disputeInf.oldGlobalSerialNumbr,
										idType: $scope.disputeInf.idType,
										idNumber: $scope.disputeInf.idNumber,
										externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
								};
								if(data.returnData.rows[0].cardScheme == "V"){
									jfRest.request('visannexTabInf','query', $scope.queryParam1).then(function(data) {
										if(data.returnData == null || data.returnData == ""){
//											jfLayer.fail( T.T('KHJ4700030'));
											jfLayer.fail(data.returnCode+':'+data.returnMsg);
//											$scope.safeApply();
//											result.cancel();
											//return;
										}
										$scope.data = data.returnData[0];
										$scope.appVisaFormInf = data.returnData[0];
										$scope.appMCFormInf = data.returnData[0];
//										$scope.safeApply();
//										result.cancel();
									});
								}else if(data.returnData.rows[0].cardScheme == "M"){
									jfRest.request('mcannexTabInf','query', $scope.queryParam1).then(function(data) {
										if(data.returnData == null || data.returnData == ""){
											jfLayer.fail(data.returnCode+':'+data.returnMsg);
//											jfLayer.fail(T.T('KHJ4700031'));
//											$scope.safeApply();
//											result.cancel();
											//return;
										}
										$scope.data = data.returnData[0];
										$scope.data2 = data.returnData[1][0];
										$scope.appVisaFormInf = data.returnData[0];
										$scope.appMCFormInf = data.returnData[0];
//										$scope.safeApply();
//										result.cancel();
									});
								}
								$scope.queryParam2 = {
										globalTransSerialNoAuth : $scope.disputeInf.oldGlobalSerialNumbr,
										idType: $scope.disputeInf.idType,
										idNumber: $scope.disputeInf.idNumber,
										externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
								};
								$timeout(function() {
									jfRest.request('clearHitInf','query', $scope.queryParam2).then(function(data) {
										if(data.returnData == null || data.returnData == ""){
											jfLayer.fail(data.returnCode+':'+data.returnMsg);
//											jfLayer.fail( T.T('KHJ4700032'));
//											$scope.safeApply();
//											result.cancel();
											//return;
										}
										if(cardScheme == "V"){
											$scope.data1 = data.returnData[0];
											$scope.appVisaFormInf = data.returnData[0];
											$scope.appVisaFormInf.acquirerBusinessId = $scope.data.acquirerBusinessId;
											$scope.appVisaFormInf.nationalReimburseFee = $scope.data.nationalReimburseFee;
											$scope.appVisaFormInf.accountSelection = $scope.data.accountSelection;
											$scope.appVisaFormInf.reimburseAttribute = $scope.data.reimburseAttribute;
											$scope.appVisaFormInf.transIdentifier = $scope.data.transIdentifier;
											$scope.appVisaFormInf.settlementFlag =  $scope.data.settlementFlag;
											$scope.appVisaFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
											$scope.appVisaFormInf.transactionCode = "52";
											$scope.appVisaFormInf.retrievalRequestId = "0";
											$scope.typeArray = [{name :  T.T('KHJ4700033'),id : '0'}, {name :  T.T('KHJ4700034'),id : '1'}];
											$scope.typeArray1 = [{name :  T.T('KHJ4700033'),id : '0'}, {name :  T.T('KHJ4700034'),id : '1'}];
//											$scope.safeApply();
//											result.cancel();
											$scope.modal('/cstSvc/disputeAccontInfo/confirmAppVisaForm.html',
													'', {
														title : T.T('KHJ4700035'),
														buttons : [  T.T('F00125'), T.T('F00012') ],
														size : [ '1000px', '600px' ],
														callbacks : [$scope.saveConfirmVisaApp]
													});
										}else if(cardScheme == "M"){
											$scope.data1 = data.returnData[0];
											$scope.appMCFormInf = data.returnData[0];
											$scope.appMCFormInf.processingCode = $scope.data2.processingCode;
											$scope.appMCFormInf.dateAndTime = $scope.data2.dateAndTime;
											$scope.appMCFormInf.posEntryMode = $scope.data2.posEntryMode;
											$scope.appMCFormInf.forwdInstitIdCode = $scope.data2.forwdInstitIdCode;
											$scope.appMCFormInf.retrievalReferNum = $scope.data2.retrievalReferNum;
											$scope.appMCFormInf.cardAcceptorName = $scope.data2.cardAcceptorName;
											$scope.appMCFormInf.settlementIndicator = $scope.data2.settlementIndicator;
											$scope.appMCFormInf.transLifeCycleId = $scope.data2.transLifeCycleId;
											$scope.appMCFormInf.messageNumber = $scope.data2.messageNumber;
											$scope.appMCFormInf.transOriginInstit = $scope.data2.transOriginInstit;
											$scope.appMCFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
											$scope.appMCFormInf.terminalType = $scope.data.P0023;
											$scope.appMCFormInf.messageReversalIndicator = $scope.data.P0025;
											$scope.appMCFormInf.electronicCommerceSecurityLevelIndicator = $scope.data.P0052;
											$scope.appMCFormInf.currencyExponents = $scope.data.P0148;
											$scope.appMCFormInf.currencyCodesAmountsOriginal = $scope.data.P0149;
											$scope.appMCFormInf.businessActivity = $scope.data.P0158;
											$scope.appMCFormInf.settlementIndicator = $scope.data.P0165;
											$scope.appMCFormInf.masterCardAssignedId = $scope.data.P0176;
											$scope.appMCFormInf.retrievalDocumentCode = $scope.data.P0228;
											$scope.appMCFormInf.exclusionRequestCode = 	$scope.data.P0260;
											$scope.appMCFormInf.documentationIndicator = $scope.data.P0262;
											$scope.appMCFormInf.functionCode = "603";
											$scope.appMCFormInf.mti = "1644";
//											$scope.safeApply();
//											result.cancel();
											$scope.modal('/cstSvc/disputeAccontInfo/confirmMCAppForm.html',
													'', {
														title :  T.T('KHJ4700036'),
														buttons : [  T.T('F00125'), T.T('KHH500061') ],
														size : [ '1000px', '600px' ],
														callbacks : [$scope.saveConfirmMCApp]
													});
										}else{
											jfLayer.fail(data.returnCode+':'+data.returnMsg);
//											jfLayer.fail(T.T('KHJ4700026'));
//											$scope.safeApply();
//											result.cancel();
										}
									});
								},300);
							}else{
								jfLayer.fail(data.returnCode+':'+data.returnMsg);
//								jfLayer.fail( T.T('KHJ4700037'));
//								$scope.safeApply();
//								result.cancel();
							}
						}
					});
				}else if($scope.disputeInf.statusCode == "C"){
					var cardBin = $scope.disputeInf.externalIdentificationNo.substring(3,9);
					$scope.queryParam = {
							binNo : cardBin,
							idType: $scope.disputeInf.idType,
							idNumber: $scope.disputeInf.idNumber,
							externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
					};
					jfRest.request('productLine','queryBin', $scope.queryParam).then(function(data) {
						var cardScheme = data.returnData.rows[0].cardScheme;
						if(data.returnData.rows[0].cardScheme == "V" || data.returnData.rows[0].cardScheme == "M"){
							$scope.queryParam1 = {
									globalSerialNumber : $scope.disputeInf.oldGlobalSerialNumbr
							};
							if(data.returnData.rows[0].cardScheme == "V"){
								jfRest.request('visannexTabInf','query', $scope.queryParam1).then(function(data) {
									if(data.returnData == null || data.returnData == ""){
										jfLayer.fail(data.returnCode+':'+data.returnMsg);
//										jfLayer.fail(T.T('KHJ4700039'));
//										$scope.safeApply();
//										result.cancel();
										//return;
									}
									$scope.data = data.returnData[0];
									$scope.protestVisaFormInf = data.returnData[0];
									$scope.protestMCFormInf = data.returnData[0];
									$scope.safeApply();
									result.cancel();
								});
							}else if(data.returnData.rows[0].cardScheme == "M"){
								jfRest.request('mcannexTabInf','query', $scope.queryParam1).then(function(data) {
									if(data.returnData == null || data.returnData == ""){
										jfLayer.fail(data.returnCode+':'+data.returnMsg);
//										jfLayer.fail(T.T('KHJ4700040'));
//										$scope.safeApply();
//										result.cancel();
										//return;
									}
									$scope.data = data.returnData[0];
									$scope.data2 = data.returnData[1][0];
									$scope.protestVisaFormInf = data.returnData[0];
									$scope.protestMCFormInf = data.returnData[0];
//									$scope.safeApply();
//									result.cancel();
								});
							}
							$scope.queryParam2 = {
									globalTransSerialNoAuth : $scope.disputeInf.oldGlobalSerialNumbr
							};
							$timeout(function() {
								jfRest.request('clearHitInf','query', $scope.queryParam2).then(function(data) {
									if(data.returnData == null || data.returnData == ""){
										jfLayer.fail(data.returnCode+':'+data.returnMsg);
//										jfLayer.fail(T.T('KHJ4700032'));
//										$scope.safeApply();
//										result.cancel();
										//return;
									}
									if(cardScheme == "V"){
										$scope.data1 = data.returnData[0];
										$scope.protestVisaFormInf = data.returnData[0];
										$scope.protestVisaFormInf.acquirerBusinessId = $scope.data.acquirerBusinessId;
										$scope.protestVisaFormInf.nationalReimburseFee = $scope.data.nationalReimburseFee;
										$scope.protestVisaFormInf.reimburseAttribute = $scope.data.reimburseAttribute;
										$scope.protestVisaFormInf.transIdentifier = $scope.data.transIdentifier;
										$scope.protestVisaFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
										$scope.protestVisaFormInf.settlementFlag =  $scope.data.settlementFlag;
										$scope.protestVisaFormInf.requestedPaymentService = $scope.data.requestedPaymentService;
										$scope.protestVisaFormInf.authorizationCharacteristicsIndicator = $scope.data.authorizationCharacteristicsIndicator;
										$scope.protestVisaFormInf.internationalFeeIndicator = $scope.data.internationalFeeIndicator;
										$scope.protestVisaFormInf.feeProgramIndicator = $scope.data.feeProgramIndicator;
										$scope.protestVisaFormInf.mailPhoneElectronicCommerceAndPaymentIndicator = $scope.data.mailPhoneElectronicCommerceAndPaymentIndicator;
										$scope.protestVisaFormInf.prepaidCardIndicator = $scope.data.prepaidCardIndicator;
										$scope.protestVisaFormInf.authorizedAmount = $scope.data.authorizedAmount;
										$scope.protestVisaFormInf.authorizationCurrencyCode = $scope.data.authorizationCurrencyCode;
										$scope.protestVisaFormInf.authorizationResponseCode = $scope.data.authorizationResponseCode;
										$scope.protestVisaFormInf.multipleClearingSequenceNumber = $scope.data.multipleClearingSequenceNumber;
										$scope.protestVisaFormInf.multipleClearingSequenceCount = $scope.data.multipleClearingSequenceCount;
										$scope.protestVisaFormInf.dynamicCurrencyConversionIndicator = $scope.data.dynamicCurrencyConversionIndicator;
										$scope.protestVisaFormInf.transCodeQualifer = $scope.data.transCodeQualifer;
										/*$scope.typeArray = [{name : "15",id : '15'}, {name : "16",id : '16'}, {name : "17",id : '17'}, {name : "35",id : '35'},
										                    {name : "36",id : '36'}, {name : "37",id : '37'}];
										$scope.typeArray1 =  [{name :  T.T('KHJ4700041'),id : 'P'}];*/
										//动态请求下拉框 请求完成方式
										$scope.typeArray  ={ 
										        type:"dictData", 
										        param:{
										        	"type":"DROPDOWNBOX",
										        	groupsCode:"dic_requestedFulfllmentMethod",
										        	queryFlag: "children"
										        },//默认查询条件 
										        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
										        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
										        resource:"paramsManage.query",//数据源调用的action 
										        callback: function(data){
										        	console.log(data)
										        }
									};
										//动态请求下拉框 已建立的完成方式
										$scope.typeArray1  ={ 
										        type:"dictData", 
										        param:{
										        	"type":"DROPDOWNBOX",
										        	groupsCode:"dic_establishedFulfllmentMethod",
										        	queryFlag: "children"
										        },//默认查询条件 
										        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
										        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
										        resource:"paramsManage.query",//数据源调用的action 
										        callback: function(data){
										        	
										        }
									};
//										$scope.safeApply();
//										result.cancel();
										$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestVisaForm.html',
												'', {
													title : T.T('KHJ4700042'),
													buttons : [  T.T('F00125'), T.T('F00012') ],
													size : [ '1000px', '600px' ],
													callbacks : [$scope.saveConfirmVisaProtest]
												});
									}else if(cardScheme == "M"){
										$scope.data1 = data.returnData[0];
										$scope.protestMCFormInf = data.returnData[0];
										$scope.protestMCFormInf.processingCode = $scope.data2.processingCode;
										$scope.protestMCFormInf.dateAndTime = $scope.data2.dateAndTime;
										$scope.protestMCFormInf.posEntryMode = $scope.data2.posEntryMode;
										$scope.protestMCFormInf.dateExpiration = $scope.data2.dateExpiration;
										$scope.protestMCFormInf.forwdInstitIdCode = $scope.data2.forwdInstitIdCode;
										$scope.protestMCFormInf.retrievalReferNum = $scope.data2.retrievalReferNum;
										$scope.protestMCFormInf.serviceCode = $scope.data2.serviceCode;
										$scope.protestMCFormInf.cardAcceptorName = $scope.data2.cardAcceptorName;
										$scope.protestMCFormInf.transLifeCycleId = $scope.data2.transLifeCycleId;
										$scope.protestMCFormInf.messageNumber = $scope.data2.messageNumber;
										$scope.protestMCFormInf.transOriginInstit = $scope.data2.transOriginInstit;
										$scope.protestMCFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
										$scope.protestMCFormInf.terminalType = $scope.data.P0023;
										$scope.protestMCFormInf.messageReversalIndicator = $scope.data.P0025;
										$scope.protestMCFormInf.electronicCommerceSecurityLevelIndicator = $scope.data.P0052;
										$scope.protestMCFormInf.currencyExponents = $scope.data.P0148;
										$scope.protestMCFormInf.currencyCodesAmountsOriginal = $scope.data.P0149;
										$scope.protestMCFormInf.businessActivity = $scope.data.P0158;
										$scope.protestMCFormInf.settlementIndicator = $scope.data.P0165;
										$scope.protestMCFormInf.masterCardAssignedId  = $scope.data.P0176;
										$scope.protestMCFormInf.exclusionRequestCode = 	$scope.data.P0260;
										$scope.protestMCFormInf.documentationIndicator = $scope.data.P0262;
//										$scope.typeArray = [{name :  T.T('KHJ4700043'),id : '450'},{name : T.T('KHJ4700044'),id : '451'},{name : T.T('KHJ4700045'),id : '453'},{name :  T.T('KHJ4700046'),id : '454'}];
										$scope.protestMCFormInf.mti = "1442";
										//动态请求下拉框 功能码
										$scope.functionCodeArray  ={ 
										        type:"dictData", 
										        param:{
										        	"type":"DROPDOWNBOX",
										        	groupsCode:"dic_functionCode",
										        	queryFlag: "children"
										        },//默认查询条件 
										        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
										        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
										        resource:"paramsManage.query",//数据源调用的action 
										        callback: function(data){
										        	
										        }
									};
										$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestMCForm.html',
												'', {
													title :  T.T('KHJ4700047'),
													buttons : [ T.T('F00125'),T.T('F00012') ],
													size : [ '1000px', '600px' ],
													callbacks : [$scope.saveConfirmMCProtest]
												});
									}else{
										jfLayer.fail(data.returnCode+':'+data.returnMsg);
									}
								});
							},300);
						}else{
							jfLayer.fail(data.returnCode+':'+data.returnMsg);
						}
					});
				}
			}
		};
		/*=================争议账户详情 end   ========================*/
	});
	//账户列表
	webApp.controller('allAccountListCtrl', function($scope, $stateParams, jfRest,
			$http, $timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.operationMode = lodinDataService.getObject("operationMode");//运营模式
		$scope.externalIdentificationNo = $scope.queryAccountForm.externalIdentificationNo;
		
		/**
		 * 格式化金额
		 * @param strData
		 * @param n保留几位小数
		 */
		function _formatAmount(strData, n) {
			var CurrencyAndAmountRegExp = /^(\d{1,18})|(\d{1,18}\.)|(\d{1,17}\.\d{0,1})|(\d{1,16}\.\d{0,2})|(\.\d{1,2})$/;
			var _result = CurrencyAndAmountRegExp.test(strData);
			if(_result == false){
				return strData;
			}
			// 一般来说最多就6位吧，当然如果有特殊需求可自行更改(｀・∀・´)
			n = n > 0 && n <= 6 ? n : 2;
			var formatData = parseFloat((strData + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
			var l = formatData.split('.')[0].split('').reverse();
			var r = formatData.split('.')[1];
			var t = '';
			for(var i = 0; i < l.length; i ++ ) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
			}
			return t.split('').reverse().join('') + '.' + r;
        }
        //循环账户信息表
		//翻译
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_accountOrganForm",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(function(data) {
			$scope.accountOrganFormList = {};
			$scope.accountOrganFormList = data.returnData.rows;//账户组织形式
		}); 
		$scope.queryParam02 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_businessDebitCreditCode",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam02).then(function(data) {
			$scope.businessDebitCreditCodeList = {};
			$scope.businessDebitCreditCodeList = data.returnData.rows;//账户性质
		});
		$scope.queryParam03 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_accStatusCode",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam03).then(function(data) {
			$scope.accStatusCodeList = {};
			$scope.accStatusCodeList = data.returnData.rows;//状态码
		});
		$scope.queryParam05 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_loanStatus",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam05).then(function(data) {
			$scope.loanStatusList = {};
			$scope.loanStatusList = data.returnData.rows;//贷款状态
		});
		$scope.queryParam04 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_childAccType",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam04).then(function(data) {
			$scope.childAccTypeList = {};
			$scope.childAccTypeList = data.returnData.rows;//贷款状态
		});
		//查询主子账户11111111111111111111
		layui.use(['treeTable'], function () {
			var $ = layui.jquery;
	        var treeTable = layui.treeTable;
		     // 循环账户
	        $scope.pageCount1 = 0;
			$scope.pageNumP1 = 1;
			$scope.pageSizeP1 = 10;
			$scope.revoleAccQuery = function(){
		        var insTb = treeTable.render({
		            elem: '#revoleAccTreeTable',
		            tree: {
		            	iconIndex: 1,
		            },
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
	//	                {type: 'numbers'},
		                {type: 'radio'},//radio
		                {align: 'left',field: 'accountId', title: T.T('KHH4700013'),width:240},
		                {field: 'currencyDesc', title: T.T('KHH4700014'), width:60,templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.currencyDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'businessProgramNo', title: T.T('KHH47000243'), width:180,templet: function(d){
		                	if(d.haveChild == true){
			                    if(d.businessProgramNo ||d.programDesc){
			                    	return '<span>'+ d.businessProgramNo + d.programDesc +'</span>';
			                    }else {
			                    	return '<span></span>';
                                }
                            }else if(d.haveChild == false){
		                    	return '<span>'+ d.subAccIdentifyDesc +'</span>';
		                    }
		                }},
		                {field: 'businessTypeCode', title: T.T('KHH47000244'), width:180,templet: function(d){
		                	if(d.haveChild == true){
			                    if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.businessTypeCode + d.businessDesc +'</span>';
			                    }else {
			                    	return '<span></span>';
                                }
                            }else if(d.haveChild == false){
		                		if(d.subAccIdentify == 'Q'){
			                    	return '<span>'+ d.transIdentifiNo + d.transIdentifiDesc +'</span>';
			                    }else if(d.subAccIdentify == 'L'){
			                    	if(d.fundNum){
			                    		return '<span>'+ d.fundNum + d.fundName +'</span>';
			                    	}else{
			                    		return '<span></span>';
			                    	}
                                }
                            }
		                }},
		                {field: 'productObjectCode', title: T.T('KHH4700048'), width:180,templet: function(d){
		                	if(d.haveChild == true){
			                    if(d.productObjectCode || d.productDesc){
			                    	if(d.productObjectCode == '0'){
			                    		return '<span>'+ d.productObjectCode + '集中核算' +'</span>';
			                    	}else{
			                    		return '<span>'+ d.productObjectCode + d.productDesc +'</span>';
			                    	}
			                    }else {
			                    	return '<span></span>';
                                }
                            }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'accountOrganFormDesc', title: T.T('KHH4700050'), width:100,templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.accountOrganFormDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'businessDebitCreditCodeDesc', title: T.T('KHH4700051'), width:100,templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.businessDebitCreditCodeDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'statusCodeDesc', title: T.T('KHH4700052'),width:60,templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.statusCodeDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'totalBalance', title: T.T('KHH4700005'), width:100,templet: function(d){
		                	var totalBalance = _formatAmount(d.totalBalance,2);//金额格式化
		                    	return '<span>'+totalBalance+'<span />';
		                }},
		            ],
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					accFlag : "mainAcc",
		    					flag: "N",
		    					externalIdentificationNo:  $scope.externalIdentificationNo,
		    					accountOrganForm :  data1.accountOrganForm,
		    					globalTransSerialNo : data1.globalTransSerialNo,
		    					productObjectCode: data1.productObjectCode,
		    					businessProgramNo:  data1.businessProgramNo,
		    					businessTypeCode:  data1.businessTypeCode,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		jfRest.request('accBscInf', 'queryMainAndChildAccList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.isShowAccountList = true;//账户信息表
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	            							//	账户组织形式
	            							for(var k = 0; k < $scope.accountOrganFormList.length; k++){
	            								if(item.accountOrganForm == $scope.accountOrganFormList[k].codes){
	            									item.accountOrganFormDesc = $scope.accountOrganFormList[k].detailDesc;
                                                }
                                            }
                                            //账户性质
	            							for(var m = 0; m < $scope.businessDebitCreditCodeList.length; m++){
	            								if(item.businessDebitCreditCode == $scope.businessDebitCreditCodeList[m].codes){
	            									item.businessDebitCreditCodeDesc = $scope.businessDebitCreditCodeList[m].detailDesc;
                                                }
                                            }
                                            //状态码
	            							for(var n = 0; n < $scope.accStatusCodeList.length; n++){
	            								if(item.statusCode == $scope.accStatusCodeList[n].codes){
	            									item.statusCodeDesc = $scope.accStatusCodeList[n].detailDesc;
                                                }
                                            }
                                            //子账户类型
	            							for(var t = 0; t < $scope.childAccTypeList.length; t++){
	            								if(item.subAccIdentify == $scope.childAccTypeList[t].codes){
	            									item.subAccIdentifyDesc = $scope.childAccTypeList[t].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        						}else {
	        							data.returnData.rows = [];
	        							callback(data.returnData.rows);
                                    }
                                }
                            });
		            	}else {//查主账户
		            		$scope.params = {
		    					accountOrganForm: "R",//循环账户
		    					flag:'N',    //白玉让传
		    					pageFlag : "mainPage",
		    					externalIdentificationNo : $scope.externalIdentificationNo,
		    					pageNum: $scope.pageNumP1,
		    			        pageSize: $scope.pageSizeP1
	                		};
		            		jfRest.request('accBscInf', 'queryMainAndChildAccList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	        						$scope.isShowAccountList = true;//账户信息表
	        						var rows = data.returnData.rows;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCount1 = data.returnData.totalCount;
	        							angular.forEach(rows,function(item,i){
	            							item.haveChild = true;
	//            							账户组织形式
	            							for(var k = 0; k < $scope.accountOrganFormList.length; k++){
	            								if(item.accountOrganForm == $scope.accountOrganFormList[k].codes){
	            									item.accountOrganFormDesc = $scope.accountOrganFormList[k].detailDesc;
                                                }
                                            }
                                            //账户性质
	            							for(var m = 0; m < $scope.businessDebitCreditCodeList.length; m++){
	            								if(item.businessDebitCreditCode == $scope.businessDebitCreditCodeList[m].codes){
	            									item.businessDebitCreditCodeDesc = $scope.businessDebitCreditCodeList[m].detailDesc;
                                                }
                                            }
                                            //状态码
	            							for(var n = 0; n < $scope.accStatusCodeList.length; n++){
	            								if(item.statusCode == $scope.accStatusCodeList[n].codes){
	            									item.statusCodeDesc = $scope.accStatusCodeList[n].detailDesc;
                                                }
                                            }
                                        });
	        							
	        							callback(data.returnData.rows);
	        							if(!data1){//主账户
	        								layui.use(['laypage', 'layer'], function(){
	  					                      var laypage = layui.laypage
	  					                      ,layer = layui.layer;
	  					                      laypage.render({
	  					                            elem: 'revoleAccPageDemo',
	  					                            count: $scope.pageCount1,
	  					                            limit: $scope.pageSizeP1,
	  					                            curr: $scope.pageNumP1,
	  					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	  					                            jump: function(obj,first){
	  					                             if (!first) {
	  					                              $scope.pageNumP1 = obj.curr;
	  					                              $scope.pageSizeP1 = obj.limit;
	  					                              $scope.revoleAccQuery();
	  					                             }
	  					                            }
	  					                        });
	  					                    });
	        								
	        							}
	        						}else {
	        							data.returnData.rows = [];
	        							callback(data.returnData.rows);
                                    }
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		        });
		        
		        //循环账户监听单选
		        treeTable.on('checkbox(revoleAccTreeTable)', function(obj){
		        	$scope.revoleAccTreeTableChecked = obj.data;
		        });
		        treeTable.on('row(revoleAccTreeTable)', function(obj){
					$scope.revoleAccTreeTableChecked = obj.data;
					insTb.setChecked([obj.data.id]);
				});
			};//循环账户信息表end
			
	      
	        
	        // 交易账户
//	        $scope.queryParam01 = {
//    			type: "DROPDOWNBOX",
//    			groupsCode : "dic_loanType",
//    			queryFlag : "children"
//    		};
//    		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
//    		function(data) {
//    			$scope.loanTypeList = data.returnData.rows;
//    		});
    		// 交易账户信息表
    		$scope.pageCount2 = 0;
    		$scope.pageNumP2 = 1;
    		$scope.pageSizeP2 = 10;
    		$scope.transAccQuery = function(){
		        var insTb2 = treeTable.render({
		            elem: '#transAccTreeTable',
		            tree: {
		            	iconIndex: 1,
		            	onlyIconControl: true // 仅允许点击图标折叠
		            },
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
	//	                {type: 'numbers'},
		                {type: 'radio'},//radio
		                {align: 'left',field: 'loanTypeDesc', title: T.T('KHH4600003'),width:'15%'},
		                {align: 'left',field: 'accountId', title: T.T('KHH4600004'),width: 200},
		                {field: 'loanAmount', title: T.T('KHH4600005')},
		                {field: 'remainPrincipalAmount', title: T.T('KHH4600062')},
		                {field: '', title: T.T('KHH47000261'),width:150,templet: function(d){
		                	var subAccIdentifyDesc = '';
		                	if(d.subAccIdentify == 'P' || d.subAccIdentify=='S'){
		                		subAccIdentifyDesc = T.T("KHH4600225");//'主账户'
		                	}else if(d.subAccIdentify == 'Q'){
		                		subAccIdentifyDesc = T.T("KHH4600226");//'额度子账户'
		                	}else if(d.subAccIdentify == 'L'){
		                		subAccIdentifyDesc = T.T("KHH4600227");//'资方子账户'
                            }
                                return '<span>'+ subAccIdentifyDesc +'</span>';
		                }},
		                {field: '', title: T.T('KHH47000262'),width:240,templet: function(d){
		                	if(d.haveChild == true){
			                    return '<span>-</span>';
		                	}else if(d.haveChild == false){
		                		if(d.subAccIdentify == 'Q'){
			                    	return '<span>'+ d.transIdentifiNo + d.transIdentifiDesc +'</span>';
			                    }else if(d.subAccIdentify == 'L'){
			                    	if(d.fundNum){
			                    		return '<span>'+ d.fundNum + d.fundName +'</span>';
			                    	}else{
			                    		return '<span></span>';
			                    	}
                                }
                            }
		                }},
		                {field: 'currencyCode', title: T.T('KHH4600006')},
		                {field: 'loanTerm', title: T.T('KHH4600007')},
		                {field: 'startIntDate', title: T.T('KHH4600008')},
		                {field: 'statusDesc', title: T.T('KHH4600063')},
		            ],
	//	            style: 'max-height:200px',
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					accFlag : "mainAcc",
		    					flag: "N",
		    					externalIdentificationNo:  $scope.externalIdentificationNo,
		    					accountOrganForm :  data1.accountOrganForm,
		    					globalTransSerialNo : data1.globalTransSerialNo,
		    					productObjectCode: data1.productObjectCode,
		    					businessProgramCode:  data1.businessProgramCode,
		    					businessTypeCode:  data1.businessTypeCode,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		jfRest.request('instalments', 'queryChild', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.isShowAccountList = true;//账户信息表
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	//            							//信贷类型
//	            							for(var m = 0; m < $scope.loanTypeList.length; m++){
//	            								if(item.loanType == $scope.loanTypeList[m].codes){
//	            									item.loanTypeDesc = $scope.loanTypeList[m].detailDesc;
//		            							};
//	            							};
	            							//	贷款状态
	            							for(var k = 0; k < $scope.loanStatusList.length; k++){
	            								if(item.status == $scope.loanStatusList[k].codes){
	            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        						}else {
	        							data.returnData.rows = [];
	        							callback(data.returnData.rows);
                                    }
                                }
                            });
		            	}else {//查主账户
		            		$scope.params = {
		    					accountOrganForm: "R",//循环账户
		    					flag:'N',    //白玉让传
		    					pageFlag : "mainPage",
		    					pageNum: $scope.pageNumP2,
		    			        pageSize: $scope.pageSizeP2,
		    					externalIdentificationNo : $scope.externalIdentificationNo,
	                		};
		            		jfRest.request('instalments', 'query', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	        						$scope.isShowAccountList = true;//账户信息表
	        						var rows = data.returnData.rows;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCount2 = data.returnData.totalCount;
	        							angular.forEach(rows,function(item,i){
	            							item.haveChild = true;
	            							//信贷类型
//	            							for(var m = 0; m < $scope.loanTypeList.length; m++){
//	            								if(item.loanType == $scope.loanTypeList[m].codes){
//	            									item.loanTypeDesc = $scope.loanTypeList[m].detailDesc;
//		            							};
//	            							};
	//            							//	贷款状态
	            							for(var k = 0; k < $scope.loanStatusList.length; k++){
	            								if(item.status == $scope.loanStatusList[k].codes){
	            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);

	        							if(!data1){//主账户
	        								layui.use(['laypage', 'layer'], function(){
	  					                      var laypage = layui.laypage
	  					                      ,layer = layui.layer;
	  					                      laypage.render({
	  					                            elem: 'transAccPageDemo',
	  					                            count: $scope.pageCount2,
	  					                            limit: $scope.pageSizeP2,
	  					                            curr: $scope.pageNumP2,
	  					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	  					                            jump: function(obj,first){
	  					                             if (!first) {
	  					                              $scope.pageNumP2 = obj.curr;
	  					                              $scope.pageSizeP2 = obj.limit;
	  					                              $scope.transAccQuery();
	  					                             }
	  					                            }
	  					                        });
	  					                    });
	        								
	        							}
	        						}else {
	        							data.returnData.rows = [];
	        							callback(data.returnData.rows);
                                    }
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		      });
		      //交易账户监听单选
		        treeTable.on('checkbox(transAccTreeTable)', function(obj){
		        	$scope.transAccTreeTableChecked = obj.data;
		        });
		      //交易账户 监听单选选中当前行
				treeTable.on('row(transAccTreeTable)', function(obj){
					$scope.transAccTreeTableChecked = obj.data;
					insTb2.setChecked([obj.data.id]);
				});
				
    		};//交易账户end
			
			$scope.revoleAccQuery();//循环账户
			$scope.transAccQuery();//交易账户
		});
		
		
		
		/*$scope.revoleAccList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize : 10,
				indexNo : 0,
				accountOrganForm: "R",//循环账户
				flag:'N',    //白玉让传
				externalIdentificationNo : $scope.externalIdentificationNo,
			},
			paging : true,
			resource : 'accBscInf.queryRevoleAccList',
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],//查找数据字典所需参数
			transDict : ['accountOrganForm_accountOrganFormDesc','businessDebitCreditCode_businessDebitCreditCodeDesc','statusCode_statusCodeDesc'],//翻译前后key
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowAccountList = true;//账户信息表
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};*/
		//溢缴款账户表
		$scope.overdueAccList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				operationMode : $scope.operationMode,
				externalIdentificationNo : $scope.externalIdentificationNo,
			},
			paging : true,
			resource : 'accBscInf.queryOverdueAccList',
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowAccountList = true;//账户信息表
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		//交易账户列表
		/*$scope.transAccList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				externalIdentificationNo : $scope.externalIdentificationNo,
			},
			paging : true,
			resource : 'accBscInf.queryTransAccList',
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_typesOfStages','dic_loanStatus'],//查找数据字典所需参数
			transDict : ['loanType_loanTypeDesc','status_statusDesc'],//翻译前后key
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowAccountList = true;//账户信息表
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};*/
		//争议账户列表
		$scope.disputeAccList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					externalIdentificationNo : $scope.externalIdentificationNo,
				},
				paging : true,
				resource : 'accBscInf.queryDisputeAccList',
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_accStatusCode'],//查找数据字典所需参数
				transDict : ['status_statusDesc'],//翻译前后key
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.isShowAccountList = true;//账户信息表
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
		//转出操作
		$scope.rollOutOperateInfo = function(event){
			$scope.rollOutOperate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/unifiedVisualManage/rollOutOperate.html', $scope.rollOutOperate, {
				title : T.T('KHJ4700049'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '1100px', '550px' ],
				callbacks : [$scope.saveRollOutOperate]
			});
		};
		$scope.rollOutOperate2 = {};
		//转出
		$scope.saveRollOutOperate = function(result) {
			$scope.rollOutOperate2.corporation = $scope.params.corporation;	//法人实体
			$scope.rollOutOperate2.ecommPostingAcctNmbr = $scope.rollOutOperate.accountId;	// 账户代码
			$scope.rollOutOperate2.ecommCurrencyCode = $scope.rollOutOperate.currencyCode;	//账户币种
			$scope.rollOutOperate2.ecommTransDate = $scope.rollOutOperate.transDate;	//交易日期
			$scope.rollOutOperate2.ecommTransAmount = $scope.rollOutOperate.transAmount;	// 交易金额
			$scope.rollOutOperate2.ecommTransCurr = $scope.rollOutOperate.currencyCode;	//交易币种
			$scope.rollOutOperate2.ecommClearCurr = $scope.rollOutOperate.currencyCode;	//清算币种
			$scope.rollOutOperate2.ecommClearAmount = $scope.rollOutOperate.transAmount;	//清算金额
			$scope.rollOutOperate2.ecommTransPostingCurr = $scope.rollOutOperate.currencyCode;	//入账币种
			$scope.rollOutOperate2.ecommTransPostingAmount = $scope.rollOutOperate.transAmount;	//入账金额
			$scope.rollOutOperate2.ecommEntryId = $scope.queryAccountForm.externalIdentificationNo;//外部识别号
			$scope.rollOutOperate2.ecommEventId = "ISS.RT.80.0001";
			if($scope.rollOutOperate.transAmount>$scope.overdueAccList.data[0].currBalance){
				jfLayer.fail(T.T('KHJ4700050'));
				return;
			}
			jfRest.request('overPayDrawal', 'realTimeTransMoney', $scope.rollOutOperate2).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('KHJ4700051'));
					$scope.rollOutOperate2 = {};
					 $timeout(function(){
						 $scope.safeApply();
						 result.cancel();
						 $scope.overdueAccList.search();
						 },1500);
				}
			});
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
	webApp.controller('acbaUnitCtrl', function($scope, $stateParams, jfRest, $timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		if($scope.item.balanceType=='P'){
			$scope.balanceType =  T.T('KHH4700036');
		}else if($scope.item.balanceType=='I'){
			$scope.balanceType =  T.T('KHH4700037');
		}else if($scope.item.balanceType=='F'){
			$scope.balanceType =  T.T('KHH4700038');
		}
		//余额单元核算状态
		if($scope.item.accountingStatusCode=='000'){
			$scope.accountingStatusCode =  T.T('KHH4700036');
		}else if($scope.item.accountingStatusCode=='001'){
			$scope.accountingStatusCode =  T.T('KHH47000237');
		}else if($scope.item.accountingStatusCode=='002'){
			$scope.accountingStatusCode =  T.T('KHH47000238');
		}
		//余额单元资产属性
		if($scope.item.assetProperties =='00'){
			$scope.assetProperties =  T.T('KHH47000232');
		}else if($scope.item.assetProperties=='01'){
			$scope.assetProperties =  T.T('KHH47000233');
		}
	});
	//余额对象
	/*webApp.controller('accObjDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});*/
	//交易明细查询  !
	webApp.controller('layerCreditTradeAccCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo =  T.T('KHH47000125');
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo =  T.T('KHH47000127');
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo =  T.T('KHH47000126');
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo =  T.T('KHH47000128');
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo =  T.T('KHH47000129');
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo =  T.T('KHH4700020');
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo =  T.T('KHH4700021');
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo =  T.T(KHJ4700019);
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo =  T.T('KHJ4700020');
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo =  T.T('KHJ4700021');
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo =  T.T('KHJ4700022');
		}
		else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo =  T.T(KHJ4700023);
		}
		else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo =  T.T('KHJ4700024');
        }
        if($scope.itemDetailInf.loanType == 'MERH'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600009');//"商户分期";
		}else if($scope.itemDetailInf.loanType == 'TXAT'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600010');//"自动分期";
		}else if($scope.itemDetailInf.loanType == 'CASH'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600011');//"现金分期";
		}else if($scope.itemDetailInf.loanType == 'STMT'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600012');//"账单分期";
		}else if($scope.itemDetailInf.loanType == 'TRAN'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600013');//"交易分期";
		}else if($scope.itemDetailInf.loanType == 'LOAN'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600054');//"消费信贷";
		}else if($scope.itemDetailInf.loanType == 'APAY'){
			$scope.itemDetailInf.loanTypeTrans = T.T('KHH4600155');//"随借随还";
        }
        $scope.paramsObj ={
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
		};
		jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.obj){
					$scope.totalBalance = data.returnData.obj.totalBalance;
				}else {
					$scope.totalBalance = 0;
				}
			}
		});
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
				//debugger
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
//				console.log(data);
			}
		};
	});
	//查询账户金融信息
	/*webApp.controller('layerAccFinancialCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.accInfItem = $scope.item;
		if($scope.accInfItem.businessDesc){
			$scope.accInfItem.businessTypeCodeTrans = $scope.accInfItem.businessTypeCode + $scope.accInfItem.businessDesc;
		}else {
			$scope.accInfItem.businessTypeCodeTrans = $scope.accInfItem.businessTypeCode;
		};
		if($scope.accInfItem.productDesc){
			$scope.accInfItem.productObjectCodeTrans = $scope.accInfItem.productObjectCode + $scope.accInfItem.productDesc;
		}else {
			$scope.accInfItem.productObjectCodeTrans = $scope.accInfItem.productObjectCode;
		};
		if($scope.accInfItem.programDesc){
			$scope.accInfItem.businessProgramNoTrans = $scope.accInfItem.businessProgramNo + $scope.accInfItem.programDesc;
		}else {
			$scope.accInfItem.businessProgramNoTrans = $scope.accInfItem.businessProgramNo;
		};
		//账户状态
		if($scope.accInfItem.statusCode==1){
			$scope.accInfItem.statusCodeTrans =  T.T('KHH4700077');//"活跃账户";
		}else if($scope.accInfItem.statusCode==2){
			$scope.accInfItem.statusCodeTrans =  T.T('KHH4700056');//"非活跃账户";
		}else if($scope.accInfItem.statusCode==3){
			$scope.accInfItem.statusCodeTrans =  T.T('KHH4700057');//"冻结账户";
		}else if($scope.accInfItem.statusCode==8){
			$scope.accInfItem.statusCodeTrans =  T.T('KHH4700058');//"关闭账户";
		}else if($scope.accInfItem.statusCode==9){
			$scope.accInfItem.statusCodeTrans = T.T('KHH4700059');//"待删除账户";
		};
		//查询实时余额
		$scope.queryTimeBalance = function(item){
//			console.log(item);
			$scope.balanceParams = {
					authDataSynFlag: "1",
					requetType: '1',
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			jfRest.request('acbaUnitList', 'queryBalance', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
//					console.log("accountId:"+data.returnData.rows[0].accountId);
					$scope.accountId = data.returnData.rows[0].accountId;
					$scope.totalBalance = data.returnData.rows[0].totalBalance;
					$scope.currPrincipalBalance = data.returnData.rows[0].currPrincipalBalance;
					$scope.billPrincipalBalance = data.returnData.rows[0].billPrincipalBalance;
					$scope.currInterestBalance = data.returnData.rows[0].currInterestBalance;
					$scope.billInterestBalance = data.returnData.rows[0].billInterestBalance;
					$scope.currCostBalance = data.returnData.rows[0].currCostBalance;
					$scope.billCostBalance = data.returnData.rows[0].billCostBalance;
					$scope.accInfItem.customerName = data.returnData.rows[0].customerName;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
					}
				}
			});
		};
		$scope.queryTimeBalance($scope.accInfItem);
		//账户余额单元信息
		$scope.balObcList = {
				params : $scope.queryParam = {
						idType:$scope.accInfItem.idType,
						idNumber:$scope.accInfItem.idNumber,
						externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
						accountId:$scope.accInfItem.accountId,
						currencyCode:$scope.accInfItem.currencyCode,
						operationMode:$scope.accInfItem.operationMode,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType'],//查找数据字典所需参数
				transDict : ['balanceType_balanceTypeDesc'],
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//账户余额利率信息
		$scope.accBalObjTable = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
			transDict : ['rateChangeFlag_rateChangeFlagDesc','overpayRateChangeFlag_overpayRateChangeFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//账户周期金融信息
		$scope.accCycleFiciList = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,
			resource : 'accCycleFiciList.query',
			callback : function(data) {
			}
		};
	});*/
	//查询争议账户查询 
	webApp.controller('layerDisputeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		//账户组织形式
		if($scope.disputeInf.accountOrganForm == "R"){
			$scope.disputeInf.accountOrganFormTrans =  T.T('KHH4700053');//"循环";
		}else if($scope.disputeInf.accountOrganForm == "T"){
			$scope.disputeInf.accountOrganFormTrans =  T.T('KHH4700054');//"交易";
        }
        //账户性质
		if($scope.disputeInf.businessDebitCreditCode=='C'){
			$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ4700056');//"贷记";
		}else if($scope.disputeInf.businessDebitCreditCode=='D'){
			$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ4700057');//"借记";
        }
        //账户状态
		if($scope.disputeInf.statusCode==1){
			$scope.disputeInf.statusCodeTrans =  T.T('KHH4700077');//"活跃账户";
		}else if($scope.disputeInf.statusCode==2){
			$scope.disputeInf.statusCodeTrans =  T.T('KHH4700056');//"非活跃账户";
		}else if($scope.disputeInf.statusCode==3){
			$scope.disputeInf.statusCodeTrans =  T.T('KHH4700057');//"冻结账户";
		}else if($scope.disputeInf.statusCode==8){
			$scope.disputeInf.statusCodeTrans =  T.T('KHH4700058');//"关闭账户";
		}else if($scope.disputeInf.statusCode==9){
			$scope.disputeInf.statusCodeTrans =  T.T('KHH4700059');//"待删除账户";
		}
	});
	//溢缴款查询页面
	webApp.controller('viewDepositCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_depositInf');
		$translate.refresh();
	});
	//原交易信息弹窗
	webApp.controller('orginTransInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.ectypeArray = [{name :  T.T('KHJ4700058'),id : '0'},{name :  T.T('KHJ4700059'),id : '1'}];
		/*问题：根据原交易全局流水号可以定位到唯一的同源交易吗？
		二：事件编号怎么定位，传参需要*/
		//原交易信息 根据原交易全局流水号查询历史表
		$scope.sameSourceTransParams = {
				externalIdentificationNo: $scope.item.externalIdentificationNo,
				"globalSerialNumbr" : $scope.item.oldGlobalSerialNumbr,
				"eventNo" : 'PT.40',//、、目前定位不到事件编号
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "5"
			};
		jfRest.request('finacialTrans', 'query', $scope.sameSourceTransParams).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.orginTransInfo = data.returnData.rows[0];
				//拼接数据
				if($scope.orginTransInfo.objectDesc){
					$scope.orginTransInfo.balanceObjectCodeTrans = $scope.orginTransInfo.balanceObjectCode + $scope.orginTransInfo.objectDesc;
				}else {
					$scope.orginTransInfo.balanceObjectCodeTrans = $scope.orginTransInfo.balanceObjectCode;
                }
                if($scope.orginTransInfo.businessDesc){
					$scope.orginTransInfo.businessTypeCodeTrans = $scope.orginTransInfo.businessTypeCode + $scope.orginTransInfo.businessDesc;
				}else {
					$scope.orginTransInfo.businessTypeCodeTrans = $scope.orginTransInfo.businessTypeCode;
                }
                orginTransInfo.businessTypeCodeTrans
			} 
		});
		//判断是否有争议登记
		/*$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.disputeFlagInfo = data.returnData.disputeFlag; 
			} else {
				jfLayer.fail(data.returnCode+':'+data.returnMsg);
			}
		});*/
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
	//余额对象
	webApp.controller('accObjDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
	//转出操作
	webApp.controller('rollOutOperateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.rollOutOperate.transDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
	});
});
