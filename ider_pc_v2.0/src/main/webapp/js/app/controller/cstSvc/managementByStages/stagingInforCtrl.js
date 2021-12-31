'use strict';
define(function(require) {
	var webApp = require('app');
	//分期管理
	webApp.controller('stagingInforCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingInfo ={};
		$scope.showXj = true;
		$scope.showZx = false;
		$scope.showJy = false;
		$scope.showZd = false;
		$scope.showDiv=false;
		//币种
		$scope.ccy = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_curreny",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//费用收取方式
		$scope.ectypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ecommFeeCollectType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分期期数
		$scope.termArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_stageTerm",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//交易来源
		$scope.ecommCardAssociationsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ecommSourceCde",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分期方式
		$scope.freeFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_byStages",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				//eventDesc : "指定币种还款",
				queryType:"stage"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryFiniTrans',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
				if(row.eventNo == "ILS.RT.40.0004"){//--现金分期
						$scope.showXj = true;
						$scope.showZx = false;
						$scope.showJy =false;
						$scope.showZd =false;
						$scope.stagingInfo = {}
				}else if(row.eventNo == "ILS.RT.40.0003" ){//--专项分期
						$scope.showXj = true;
						$scope.showZx = true;
						$scope.showJy =false;
						$scope.showZd =false;
						$scope.stagingInfo = {}
				}else if(row.eventNo == "ILS.RT.40.0006"){//--交易分期
					$scope.showXj = false;
					$scope.showZx = false;
					$scope.showJy =true;
					$scope.showZd =true;
					$scope.showDiv=false;
					$scope.stagingInfo = {}
				}else if(row.eventNo == "ILS.RT.40.0005" ){//--账单分期
					$scope.showXj = false;
					$scope.showZx = false;
					$scope.showJy =true;
					$scope.showZd =false;
					$scope.showDiv=true;
					$scope.stagingInfo = {}//入账金额
				}
			}
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            if(!$scope.stagingInfo.ecommEntryId){
				if($scope.showEx == true){
					 jfLayer.alert(T.T('FQJ900002'));//"请输入外部识别号！"
					 return;
				}
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.stagingInfo.eventNo = $scope.itemList.checkedList().eventNo;
			$scope.stagingInfo.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
			$scope.stagingInfo.ecommTransPostingAmount = $scope.stagingInfo.ecommTransAmount;//分期金额
			$scope.stagingInfo.ecommBillAmt = $scope.stagingInfo.billAmt;//最大可分期金额
			$scope.stagingInfo.externalIdentificationNo = $scope.stagingInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingInfo.currBillFlag = '1'; 
			$scope.stagingInfo.ecommSourceCde = 'L';
			if($scope.stagingInfo.eventNo == "ILS.RT.40.0006"){//交易分期
				$scope.stagingInfo.ecommTransPostingAmount = $scope.stagingInfo.newEcommTransAmount;
				delete $scope.stagingInfo.ecommTranAmount;
				delete $scope.stagingInfo.postingAmount; //分期金额
			}
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//选择交易信息账户
		$scope.choseAccBtn = function(){
			if(!$scope.itemList.validCheck()){ //"请选中事件编号！"
				return;
			}else{
				$scope.stagingInfo.eventNo = $scope.itemList.checkedList().eventNo;
			}
			if(!$scope.stagingInfo.ecommEntryId){
				 jfLayer.alert(T.T('KHJ1500003'));//"请输入外部识别号！"
				 return;
            }
            $scope.params = {
				externalIdentificationNo: $scope.stagingInfo.ecommEntryId,//外部识别号
				eventNo: $scope.stagingInfo.eventNo//事件号
			};
			// 页面弹出框事件(弹出页面)
			if($scope.params.eventNo == 'ILS.RT.40.0006'){ //交易分期-交易信息弹框
				$scope.modal('/cstSvc/managementByStages/transactionInfo.html', $scope.params, {
					title : T.T('FQJ900001'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '1000px', '500px' ],
					callbacks : [$scope.sureAccInfo]
				});
			}else if($scope.params.eventNo == 'ILS.RT.40.0005'){//账单分期-交易信息弹框
				$scope.modal('/cstSvc/managementByStages/billStagingInfo.html', $scope.params, {
					title : T.T('FQJ900005'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '1000px', '500px' ],
					callbacks : [$scope.billStage]
				});
			}
		};
		//账单分期交易信息明细2次查询
		$scope.billStage = function(result) {
			if(!result.scope.billDetails.validCheck()){
				return;
			}else {
				$scope.stageInf = result.scope.billDetails.checkedList();
            }
            $scope.paramss = {
				customerNo:$scope.stageInf.customerNo,
				currentCycleNumber:$scope.stageInf.currentCycleNumber,
				businessProgramNo: $scope.stageInf.businessProgramNo,
				businessTypeCode: $scope.stageInf.businessTypeCode,
				postingCurrencyCode: $scope.stageInf.currencyCode,
				externalIdentificationNo: $scope.params.externalIdentificationNo,
				postingAmount: $scope.stageInf.postingAmount
			};
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
				if (data.returnData != null) {
					$scope.itemInf = $scope.stageInf;
					
					if (data.returnData.rows && data.returnData.rows.length > 0 ) {
						$scope.stagingInfo.billAmt = data.returnData.rows[0].billAmt;//入账金额
					}
					
					$scope.stagingInfo.ecommTransPostingCurr = $scope.itemInf.currencyCode;//入账币种
					$scope.stagingInfo.ecommProdObjId = $scope.itemInf.productObjectCode;//产品对象代码
					$scope.stagingInfo.ecommCustId = $scope.itemInf.customerNo;//客户号码
					$scope.stagingInfo.ecommPostingAcctNmbr = $scope.itemInf.currentCycleNumber;//账户号
					$scope.stagingInfo.ecommBusineseType = $scope.itemInf.businessTypeCode;//业务类型
					$scope.stagingInfo.ecommBusinessProgramCode = $scope.itemInf.businessProgramNo;//业务项目  
					$scope.stagingInfo.ecommPostingAcctNmbr=$scope.itemInf.accountId;
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//交易分期-交易信息回调函数
		$scope.sureAccInfo = function(result){
			if(!result.scope.billDetails.validCheck()){
				return;
			}else {
				$scope.itemInf = result.scope.billDetails.checkedList();

}
            if($scope.itemInf.installmentFlag == '0'){
				jfLayer.fail(T.T('FQJ900016'));
				return;
			}
			$scope.paramss = {
					customerNo:$scope.itemInf.customerNo,
					currentCycleNumber:$scope.itemInf.currentCycleNumber,
					businessTypeCode: $scope.itemInf.businessTypeCode,
					postingCurrencyCode: $scope.itemInf.postingCurrencyCode,
					externalIdentificationNo: $scope.params.externalIdentificationNo,
					accountId: $scope.itemInf.accountId,
					postingAmount:  $scope.itemInf.postingAmount,
					balanceObjectCode: $scope.itemInf.balanceObjectCode,
					ecommOrigGlobalSerialNumbr: $scope.itemInf.globalSerialNumbr
				};
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
				if (data.returnData != null) {
					$scope.stagingInfo.postingAmount = $scope.itemInf.postingAmount; //入账金额
					$scope.stagingInfo.ecommTransPostingCurr = $scope.itemInf.transCurrCde;//入账币种
					$scope.stagingInfo.ecommProdObjId = $scope.itemInf.productObjectCode;//产品对象代码
					$scope.stagingInfo.ecommCustId = $scope.itemInf.customerNo;//客户号码
					$scope.stagingInfo.ecommPostingAcctNmbr = $scope.itemInf.accountId;//账户号
					$scope.stagingInfo.ecommBusineseType = $scope.itemInf.businessTypeCode;//业务类型
					$scope.stagingInfo.ecommBusinessProgramCode = $scope.itemInf.businessProgramNo;//业务项目  
					$scope.stagingInfo.newEcommTransAmount=$scope.itemInf.postingAmount;
					$scope.stagingInfo.ecommOrigGlobalSerialNumbr = $scope.itemInf.globalSerialNumbr;//全局事件号
					$scope.safeApply();
					result.cancel();
				}
			})
		};
		/*//交易信息回调函数
		$scope.sureAccInfo = function(result){
			if(!result.scope.billDetails.validCheck()){
				return;
			}else {
				$scope.itemInf = result.scope.billDetails.checkedList();
			};
			$scope.stagingInfo.postingAmount = $scope.itemInf.postingAmount //入账金额
			$scope.stagingInfo.ecommTransPostingCurr = $scope.itemInf.transCurrCde;//入账币种
			$scope.stagingInfo.ecommProdObjId = $scope.itemInf.productObjectCode;//产品对象代码
			$scope.stagingInfo.ecommCustId = $scope.itemInf.customerNo;//客户号码
			$scope.stagingInfo.ecommPostingAcctNmbr = $scope.itemInf.accountId;//账户号
			$scope.stagingInfo.ecommBusineseType = $scope.itemInf.businessTypeCode;//业务类型
			$scope.stagingInfo.ecommBusinessProgramCode = $scope.itemInf.businessProgramNo;//业务项目  
			$scope.stagingInfo.newEcommTransAmount=$scope.itemInf.postingAmount;
			$scope.stagingInfo.ecommOrigGlobalSerialNumbr = $scope.itemInf.globalSerialNumbr;//全局事件号
			$scope.safeApply();
			result.cancel();
		};*/
		//分期试算弹框
		$scope.trialByStagesInfo = function(){
			if(!$scope.itemList.validCheck()){
				return;
            }
            $scope.params = $scope.stagingInfo;
			$scope.params.eventNo = $scope.itemList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
			$scope.params.externalIdentificationNo = $scope.stagingInfo.ecommEntryId;
			if($scope.stagingInfo.eventNo == "ILS.RT.40.0006"){//交易分期
				$scope.params.ecommTransAmount=$scope.stagingInfo.newEcommTransAmount;
				//delete $scope.stagingInfo.postingAmount;
			}
			if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/cstSvc/managementByStages/stagingRounds.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '550px' ],
				callbacks : []
			});
		}
	});
	//选择交易分期交易信息账户弹窗
	webApp.controller('transactionInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.billDetails = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {    
				"pageSize" : 10,
				"indexNo" : 0,
				activityNo:'X8010',
				logLevel:"A",
				transProperty:"O",
				externalIdentificationNo:$scope.params.externalIdentificationNo,
				payFlag : 'Y',
				ifTrans: 'true'//标识查可交易分期的数据
			}, // 表格查询时的参数信息 
			paging : true,// 默认true,是否分页
			resource : 'transaction.query',// 列表的资源
			isTrans: true,
			transParams: ['dic_ecommTransStatus'],
			transDict: ['transState_transStateDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//选择账单分期交易信息账户弹窗billStagingInfoCtrl
	webApp.controller('billStagingInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.showDiv=false;
		$scope.paychoseAccList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				externalIdentificationNo:$scope.params.externalIdentificationNo,
				payFlag : 'Y'
			}, // 表格查询时的参数信息                         
			paging : true,// 默认true,是否分页 
			resource : 'billStaging.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.productObjectListTable = function(){
			$scope.paychoseAccList.params.accountId = '';
			$scope.paychoseAccList.params.businessTypeCode = '';
		};
		//查询账单交易明细
		$scope.checkItem = function(event) {
			$scope.showDiv=true;
			$scope.itemInf=event;
			$scope.itemInf.externalIdentificationNo = $scope.params.externalIdentificationNo;
			$scope.queryParams= {
				externalIdentificationNo:$scope.itemInf.externalIdentificationNo,
				customerNo: $scope.itemInf.customerNo,
				currencyCode: $scope.itemInf.currencyCode,
				billDate: $scope.itemInf.billDate,
				businessProgramNo: $scope.itemInf.businessProgramNo,
				productObjectCode: $scope.itemInf.productObjectCode,
				//businessTypeCode: $scope.itemInf.businessTypeCode,
			};
			$scope.billDetails.params = $scope.queryParams;
			$scope.billDetails.search($scope.queryParams);
		};
		//账单分期交易信息明细
		$scope.billDetails = {
			autoQuery:false,
			checkType : 'radio', // 当为checkbox时为多选
			params :{}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryBsnisType',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
				}
			}
		};
	});
	//分期试算弹窗
	webApp.controller('stagingRoundsCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.trialList = {};
		//分期试算
		$scope.cashTrailList = {
			autoQuery:true,
			params : {
				"pageSize":10,
				"indexNo":0,
				eventNo: $scope.params.eventNo,//事件号
				ecommEntryId: $scope.params.ecommEntryId,//外部识别号
				ecommCustId: $scope.params.ecommCustId,//外部识别号
				ecommFeeCollectType: $scope.params.ecommFeeCollectType,//费用收取方式
				ecommBusineseType: $scope.params.ecommBusineseType,//业务类型
				ecommInstallmentPeriod: $scope.params.ecommInstallmentPeriod,//分期期数
				ecommPostingAcctNmbr: $scope.params.ecommPostingAcctNmbr,
				ecommProdObjId: $scope.params.ecommProdObjId,
				ecommTransAmount: $scope.params.ecommTransAmount,//分期金额
				ecommTransPostingCurr: $scope.params.ecommTransPostingCurr,
				ecommInstallmentBusinessType: $scope.params.ecommInstallmentBusinessType,//分期业务类型
				ecommBusinessProgramCode: $scope.params.ecommBusinessProgramCode,//业务项目
				externalIdentificationNo: $scope.params.ecommEntryId,
				receiveAccount:  $scope.params.receiveAccount,
				ecommSourceCde : $scope.params.ecommSourceCde,
				accountBankNo: $scope.params.accountBankNo,
				freeFlag: $scope.params.freeFlag,
				//installmentAmount: $scope.params.installmentAmount,//已分期金额
				postingAmount: $scope.params.postingAmount,//入账金额
				//transState: $scope.params.transState,//分期状态
				ecommCalInstallmentPeriod: $scope.params.ecommCalInstallmentPeriod,//参考期数
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.stageTrial',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.trialList = data.returnData.obj;
				}
			}
		};
	});
});
