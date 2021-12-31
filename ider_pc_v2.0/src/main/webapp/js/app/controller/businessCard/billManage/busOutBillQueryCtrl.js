'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('busOutBillQueryCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfoTrans = false;
		$scope.resultInfoNum = false;
		$scope.busBillInf= {};
		//查询
		$scope.viewDetail = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.item= Object.assign($scope.item,$scope.busCardBillTable.params);
			$scope.modal('/businessCard/billManage/layerBusBill.html',$scope.item, {
					title : T.T('GWJ600001'),  //'公务卡账单周期详情',
					buttons : [ T.T('F00012') ],//'关闭'
					size : [ '1100px', '550px' ],
					callbacks : []
			});
		};
		$scope.reset = function(){
			$scope.busBillInf.externalIdentificationNo = '';
			$scope.idNumber = '';
			$scope.resultInfo = false;
			$scope.resultInfoNum = false;
			 $scope.resultList = false;
			$scope.resultInfoTrans= false;
		};
		//交易
		$scope.transHandle = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.item= Object.assign($scope.item,$scope.busCardBillTable.params);
			$scope.modal('/businessCard/billManage/layerBusTrans.html',$scope.item, {
				title : T.T('GWJ600002'),  //'公务卡交易列表',
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '1100px', '550px' ],
				callbacks : []
			});
		};
		//公务卡账单信息=====外部识别号
		$scope.busCardBillTable = {
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
			},
			paging : true,
			resource : 'billManages.querybusOut',
			//resource : 'billingInfoEnqr.query',
			autoQuery : false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					// if(!data.returnData.rows || data.returnData.rows.length == 0){
					// 	data.returnData.rows = [];
					// }
					$scope.resultInfoTrans = true;
					$scope.resultInfoNum = false;
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035');
					jfLayer.fail(returnMsg);
					$scope.resultInfoTrans = false;
					$scope.resultInfoNum = false;
				}
			}
		};
		//公务卡账单信息=====idnumber
		$scope.busCardBillTableNum = {
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
			},
			paging : true,
			resource : 'billManages.queryNum',
			//resource : 'billingInfoEnqr.query',
			isTrans: true,
			transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
			transDict: ['idType_idTypeDesc','invalidFlag_invalidFlagDesc'],
			autoQuery : false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
					$scope.resultInfoTrans = false;
					$scope.resultInfoNum = true;
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035');
					jfLayer.fail(returnMsg);
					$scope.resultInfoTrans = false;
					$scope.resultInfoNum = false;
				}
			}
		};

		//查询事件
		$scope.selectList = function() {
			if(($scope.busBillInf.externalIdentificationNo=='' || $scope.busBillInf.externalIdentificationNo==undefined || $scope.busBillInf.externalIdentificationNo == null) && ($scope.idNumber == '' || $scope.idNumber == undefined || $scope.idNumber == null)){
				jfLayer.fail(T.T('F00076'));   //'请输入查询条件进行查询！');
				$scope.resultInfoTrans = false;
				$scope.resultInfoNum = false;
			}
			else{
				if(($scope.busBillInf.externalIdentificationNo)){
                    $scope.busCardBillTable.params.externalIdentificationNo = $scope.busBillInf.externalIdentificationNo;
                    $scope.busCardBillTable.search();
				}else if($scope.idNumber && ($scope.busBillInf.externalIdentificationNo == '' || $scope.busBillInf.externalIdentificationNo == undefined || $scope
                    .busBillInf.externalIdentificationNo == null)){
					$scope.busCardBillTableNum.params.idNumber = $scope.idNumber;
					$scope.busCardBillTableNum.params.idType = '7';
					$scope.busCardBillTableNum.search();
				}
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.viewBusCardTrans = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/businessCard/billManage/finaciDetailInfo.html',$scope.transDetailInfo, {
				title : T.T('GWJ600003'),  //'公务卡交易信息详情',
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
		};
		//报销
		$scope.reimburse = function(item){
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(item));
			jfRest.request('billManages', 'reimburseBtn', $scope.item ).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('GWJ500001'));
					$scope.busCardTransTable.search();
				}
			});
		};
		//预算编码里的查询事件
		$scope.nodeTables = {
            checkType : '',
             params : {
            	 'pageSize':'10',
				 'indexNo':'0',
				 'logLevel' :'A',
				 'transProperty' :'O'
             }, // 表格查询时的参数信息
             paging : false,// 默认true,是否分页
             resource : 'billManages.searchBtn',// 列表的资源
             autoQuery : false,
             callback : function(data) { // 表格查询后的回调函数

             }
        };
		//点击应用节点
		$scope.checkElmInfo = function(item){
			 $scope.resultList = true;
             $scope.nodeTables.params.externalIdentificationNo = angular.fromJson(item).externalIdentificationNo;
             $scope.nodeTables.search();
		};
        //查询业务类型级别 用外部识别号查询
        $scope.checkItemNo = function(event) {
            $scope.itemInf = $.parseJSON(JSON.stringify(event));
            if($scope.busBillInf.externalIdentificationNo == '' || $scope.busBillInf.externalIdentificationNo == undefined || $scope.busBillInf.externalIdentificationNo == null){
                $scope.itemInf.externalIdentificationNo = $scope.nodeTables.params.externalIdentificationNo;
            }else{
                $scope.itemInf = Object.assign($scope.itemInf,  $scope.busBillInf);
            }
            $scope.modal('/cstSvc/txnInfEnqr/viewBill.html', $scope.itemInf, {
                title : T.T('KHJ4500001'),//'账单摘要(产品级)',
                buttons : [T.T('F00012') ],//'关闭'
                size : [ '1030px', '500px' ],
                callbacks : []
            });
        };
	});
	//查询
	webApp.controller('layerBusBillCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translate.refresh();
		$scope.ectypeArray = [{name : T.T('GWJ500003'),id : '0'},{name : T.T('GWJ500004'),id : '1'}];
		//延滞信息
		$scope.delayInf  = $scope.item.page.rows;
		// 业务类型级别账单list
		$scope.billSummList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
				"idType": $scope.item.idType,
				"idNumber": $scope.item.idNumber,
				"externalIdentificationNo": $scope.item.externalIdentificationNo,
				"customerNo": $scope.item.customerNo,
				"currencyCode": $scope.item.currencyCode,
				"billDate": $scope.item.billDate,
				"businessProgramNo": $scope.item.businessProgramNo,
				"productObjectCode": $scope.item.productObjectCode,
				"businessTypeCode": $scope.item.businessTypeCode,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryBsnisType',// 列表的资源

			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.billSummList.params.customerNo = $scope.item.customerNo;
		//$scope.billSummList.search();
		//查询交易明细
		$scope.checkBsTypeItems = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.itemDetailInf.idType = $scope.item.idType;
			$scope.itemDetailInf.idNumber = $scope.item.idNumber;
			$scope.itemDetailInf.externalIdentificationNo = $scope.item.externalIdentificationNo;
			$scope.modal('/businessCard/billManage/newViewTradeDetail.html', $scope.itemDetailInf, {
				title : T.T('KHJ4500009'),//'账单信息'
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '1150px', '500px' ],
				callbacks : []
			});
		};
		//账单分期
		$scope.billStage = function(item) {
			$scope.stageInf = $.parseJSON(JSON.stringify(item));
			$scope.stageInf.idType = $scope.item.idType;
			$scope.stageInf.idNumber = $scope.item.idNumber;
			$scope.stageInf.externalIdentificationNo = $scope.item.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/billStage.html', $scope.stageInf, {
				title :T.T('KHJ4500010'),// '账单分期信息'
				buttons : [T.T('KHJ4500013'), T.T('F00012')],//'账单分期''关闭'
				size : [ '1030px', '500px' ],
				callbacks : [$scope.sureStage]
			});
		};
		//确认分期
		$scope.sureStage = function(result){
			$scope.stageInfo1 = result.scope.stageInf;
			$scope.stageParams = {
				ecommPostingAcctNmbr: $scope.stageInfo1.accountId,
				ecommCustId: $scope.stageInfo1.ecommCustId,//
				ecommTransPostingAmount: $scope.stageInfo1.loanAmt,//分期金额
				ecommTransPostingCurr: $scope.stageInfo1.currencyCode,
				ecommFeeCollectType: $scope.stageInfo1.ecommFeeCollectType,
				currBillFlag: '1',
				ecommSourceCde: 'L',
				ecommInstallmentPeriod: $scope.stageInfo1.term,
				ecommEntryId : $scope.busBillInf.externalIdentificationNo
			};
			if($scope.stageInfo1.idType){
				$scope.stageParams.idType = $scope.stageInfo1.idType;
            }
            if($scope.stageInfo1.idNumber){
				$scope.stageParams.idNumber = $scope.stageInfo1.idNumber;
            }
            if($scope.stageInfo1.externalIdentificationNo){
				$scope.stageParams.externalIdentificationNo = $scope.stageInfo1.externalIdentificationNo;
            }
            jfRest.request('billingInfoEnqr', 'sureStage', $scope.stageParams).then(function(data) {
  		    	if(data.returnCode == '000000'){
  		    		jfLayer.success(T.T('KHJ4500014'));//"分期成功"
  		    //		$scope.safeApply();
  		  	//		 result.cancel();
  		    		$scope.isShowBillingInfo = false;
	  		  		$scope.isShowbillStageInfo = false;//账单分期信息
	  		  		$scope.isShowStageResultInfo = false; //分期试算结果
  		    	}
  		    });
		};
	});
	//交易
	webApp.controller('layerBusTransCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translate.refresh();
		$scope.itemDetailInf = $scope.item.page.rows;
		// 交易明细账单list
		$scope.billTransList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
				"idType": $scope.item.idType,
				"idNumber": $scope.item.idNumber,
				"externalIdentificationNo": $scope.item.externalIdentificationNo,
				"currencyCode": $scope.item.currencyCode ,
				"billDate": $scope.item.billDate ,
				"businessProgramNo": $scope.item.businessProgramNo ,
				"productObjectCode": $scope.item.productObjectCode ,
				"businessTypeCode": $scope.item.businessTypeCode ,
				"customerNo": $scope.item.customerNo ,
				"currentCycleNumber": $scope.item.currentCycleNumber
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryTradeDetal',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询
		$scope.checkItem = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.modal('/businessCard/billManage/layerOutBillDetail.html', $scope.item, {
				title :  T.T('GWJ600004'),  //'公务卡账单明细信息',//
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '1150px', '500px' ],
				callbacks : []
			});
		};
	});
	//账单分期
	webApp.controller('billStageCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
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
		$translate.refresh();
		$scope.isShowStageResultInfo = false; //分期试算结果
		$scope.stageInf=$scope.stageInf;
		/*$scope.paramss = {
				customerNo:$scope.stageInf.customerNo,
				businessProgramNo: $scope.stageInf.businessProgramNo,
				businessTypeCode: $scope.stageInf.businessTypeCode,
				//idType: '7',
				//idNumber: $scope.idNumber,
				externalIdentificationNo: $scope.busBillInf.externalIdentificationNo!=''?$scope.busBillInf.externalIdentificationNo:$scope.nodeTables.params.externalIdentificationNo
		};
		jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
			$scope.stageInf.billAmt = data.returnData.billAmt;
		});*/
		//"3期""6期""9期""12期""24期"
		//$scope.termArr =[{name: T.T('KHJ4500002'),id:"3"},{name: T.T('KHJ4500003'),id:"6"},{name: T.T('KHJ4500004'),id:"9"},{name: T.T('KHJ4500005'),id:"12"},{name: T.T('KHJ4500006'),id:"24"}];
		if($scope.stageInf.currencyCode == "156"){
			$scope.stageInf.currencyCodeTrans = T.T('KHH4500012');//"人民币";
		}else if($scope.stageInf.currencyCode == "840"){
			$scope.stageInf.currencyCodeTrans = T.T('KHH4500013');//"美元";
		}
		//账单分期列表
		$scope.billStageInfoList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0,
					idType: $scope.stageInf.idType,
					idNumber: $scope.stageInf.idNumber,
					externalIdentificationNo: $scope.busBillInf.externalIdentificationNo!=''?$scope.busBillInf.externalIdentificationNo:$scope.nodeTables.params.externalIdentificationNo
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.stageTrial',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.isShowStageResultInfo = true; //分期试算结果
					$scope.stageInf.accountId =  data.returnData.obj.accountId;
					$scope.stageInf.customerNo =  data.returnData.obj.ecommCustId;
					$scope.stageInf.ecommBusineseType = data.returnData.obj.ecommBusineseType;
					$scope.stageInf.loanAmt = data.returnData.obj.loanAmt;
					$scope.stageInf.feeRate = data.returnData.obj.feeRate;
					$scope.stageInf.allFeeAmt = data.returnData.obj.allFeeAmt;
					$scope.stageInf.ecommCustId =  data.returnData.obj.ecommCustId;
					$scope.stageInf.loanRate = data.returnData.obj.loanRate;
				}
			}
		};
		//分期试算
		$scope.stageTrial = function() {
			if($scope.stageInf.billAmt <  Number($scope.stageInf.loanAmt) ){
				jfLayer.alert(T.T('KHJ4500007'));//"分期金额不能大于可分期最大额度！"
				return;
            }
            if($scope.stageInf.term  == undefined || $scope.stageInf.term  == null || $scope.stageInf.term  == ''){
				jfLayer.alert(T.T('KHJ4500008'));//"分期期数不能为空！"
				return;
            }
            $scope.isShowStageResultInfo = true;
			$scope.trialParams= {
				//idType: $scope.stageInf.idType,
				//idNumber: $scope.stageInf.idNumber,
				externalIdentificationNo: $scope.busBillInf.externalIdentificationNo!=''?$scope.busBillInf.externalIdentificationNo:$scope.nodeTables.params.externalIdentificationNo, //传外部识别号查询
				ecommEntryId:$scope.stageInf.externalIdentificationNo,
				ecommFeeCollectType: $scope.stageInf.ecommFeeCollectType,
				ecommBusinessProgramCode: $scope.stageInf.businessProgramNo,// 业务项目
				ecommBusineseType: $scope.stageInf.businessTypeCode,
				ecommProdObjId:  $scope.stageInf.productObjectCode,
				ecommCustId: $scope.stageInf.customerNo,
				ecommTransPostingCurr: $scope.stageInf.currencyCode,//币种
				ecommInstallmentPeriod: $scope.stageInf.term,
				ecommTransAmount :$scope.stageInf.loanAmt,
				ecommInstallmentBusinessType: 'STMT'
			};
			$scope.billStageInfoList.params = $scope.trialParams;
			$scope.billStageInfoList.search();
		};
	});
	//业务类型级别查询
	webApp.controller('viewBillCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translate.refresh();
		$scope.ectypeArray = [{name : T.T('GWJ500003'),id : '0'},{name : T.T('GWJ500004'),id : '1'}];
		//延滞信息
		$scope.delayInf  = $scope.itemInf.page.rows;
		// 业务类型级别账单list
		$scope.billSummList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				//idType:'7',
				//idNumber: $scope.idNumber,
				externalIdentificationNo: ($scope.busBillInf.externalIdentificationNo == '' || $scope.busBillInf.externalIdentificationNo == undefined ) ? $scope.nodeTables.params.externalIdentificationNo : $scope.busBillInf.externalIdentificationNo, //传外部识别号查询
				customerNo: $scope.itemInf.customerNo,
				currencyCode: $scope.itemInf.currencyCode,
				billDate: $scope.itemInf.billDate,
				businessProgramNo: $scope.itemInf.businessProgramNo,
				productObjectCode: $scope.itemInf.productObjectCode,
				businessTypeCode: $scope.itemInf.businessTypeCode,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryBsnisType',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.billSummList.params.customerNo = $scope.itemInf.customerNo;
		//$scope.billSummList.search();
		//查询交易明细
		$scope.checkBsTypeItem = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			//$scope.itemDetailInf.idType = $scope.itemInf.idType;
			//$scope.itemDetailInf.idNumber = $scope.itemInf.idNumber;
			$scope.itemDetailInf.externalIdentificationNo = $scope.busBillInf.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/viewTradeDetail.html', $scope.itemDetailInf, {
				title : T.T('KHJ4500009'),//'账单摘要详情(业务类型级)'
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '1150px', '500px' ],
				callbacks : []
			});
		};
		//账单分期
		$scope.billStageTwo = function(item) {
			$scope.stageInf = $.parseJSON(JSON.stringify(item));
			//$scope.stageInf.idType = $scope.itemInf.idType;
			//$scope.stageInf.idNumber = $scope.itemInf.idNumber;
			$scope.stageInf.externalIdentificationNo = $scope.busBillInf.externalIdentificationNo;
			$scope.paramss = {
				customerNo:$scope.stageInf.customerNo,
				businessProgramNo: $scope.stageInf.businessProgramNo,
				businessTypeCode: $scope.stageInf.businessTypeCode,
				currentCycleNumber: $scope.stageInf.currentCycleNumber,
				postingCurrencyCode: $scope.stageInf.currencyCode,
				//idType: '7',
				//idNumber: $scope.idNumber,
				externalIdentificationNo: $scope.busBillInf.externalIdentificationNo!=''?$scope.busBillInf.externalIdentificationNo:$scope.nodeTables.params.externalIdentificationNo
			};
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.stageInf.billAmt = data.returnData.billAmt;
					$scope.modal('/cstSvc/txnInfEnqr/billStage.html', $scope.stageInf, {
						title :T.T('KHJ4500010'),// '账单分期信息'
						buttons : [T.T('KHJ4500013'), T.T('F00012')],//'账单分期''关闭'
						size : [ '1030px', '500px' ],
						callbacks : [$scope.sureStage]
					});
				}
			});
		};
		//确认分期
		$scope.sureStage = function(result){
			$scope.stageInfo1 = result.scope.stageInf;
			$scope.stageParams = {
				ecommEntryId : $scope.busBillInf.externalIdentificationNo!=''?$scope.busBillInf.externalIdentificationNo:$scope.nodeTables.params.externalIdentificationNo,
				ecommPostingAcctNmbr: $scope.stageInfo1.accountId,
				ecommCustId: $scope.stageInfo1.ecommCustId,//
				ecommTransPostingAmount: $scope.stageInfo1.loanAmt,//分期金额
				ecommTransPostingCurr: $scope.stageInfo1.currencyCode,
				ecommFeeCollectType: $scope.stageInfo1.ecommFeeCollectType,
				currBillFlag: '1',
				ecommSourceCde: 'L',
				ecommInstallmentPeriod: $scope.stageInfo1.term
			};
			if($scope.stageInfo1.idType){
				$scope.stageParams.idType = $scope.stageInfo1.idType;
            }
            if($scope.stageInfo1.idNumber){
				$scope.stageParams.idNumber = $scope.stageInfo1.idNumber;
            }
            if($scope.stageInfo1.externalIdentificationNo){
				$scope.stageParams.externalIdentificationNo = $scope.busBillInf.externalIdentificationNo;
            }
            jfRest.request('billingInfoEnqr', 'sureStage', $scope.stageParams).then(function(data) {
  		    	if(data.returnCode == '000000'){
  		    		jfLayer.success(T.T('KHJ4500014'));//"分期成功"
  		    //		$scope.safeApply();
  		  	//		 result.cancel();
  		    		$scope.isShowBillingInfo = false;
	  		  		$scope.isShowbillStageInfo = false;//账单分期信息
	  		  		$scope.isShowStageResultInfo = false; //分期试算结果
  		    	}
  		    });
		};
	});
	//交易明细查询
	webApp.controller('viewTradeDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translate.refresh();
		//研制信息
		$scope.delayInf = $scope.itemDetailInf.page.rows;
		// 交易明细账单list
		$scope.billTradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				idType: '7',
				idNumber: $scope.idNumber,
				externalIdentificationNo: $scope.busBillInf.externalIdentificationNo!=''?$scope.busBillInf.externalIdentificationNo:$scope.nodeTables.params.externalIdentificationNo, //传外部识别号查询
				currencyCode: $scope.itemDetailInf.currencyCode ,
				billDate: $scope.itemDetailInf.billDate ,
				businessProgramNo: $scope.itemDetailInf.businessProgramNo ,
				productObjectCode: $scope.itemDetailInf.productObjectCode ,
				businessTypeCode: $scope.itemDetailInf.businessTypeCode ,
				customerNo: $scope.itemDetailInf.customerNo ,
				currentCycleNumber: $scope.itemDetailInf.currentCycleNumber
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.queryTradeDetal',// 列表的资源
			isTrans: true,
			transParams: ['dic_ecommTransStatus'],
			transDict: ['transState_transStateDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		if($scope.itemDetailInf.accountOrganForm == 'R'){
			$scope.itemDetailInf.accountOrganFormTrans = T.T('KHJ4500015');//"循环";
		}else if($scope.itemDetailInf.accountOrganForm == 'T'){
			$scope.itemDetailInf.accountOrganFormTrans = T.T('KHJ4500016');//"交易";
		}
		//查询交易明细
	/*	$scope.checkItem = function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/viewTradeDetail.html', $scope.itemInf, {
				title : '账单信息',
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '900px', '500px' ],
				callbacks : []
			});
		};*/
	});
	//点击交易中的查询时触发的页面
	webApp.controller('layerOutBillDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translate.refresh();
		$scope.ectypeArray = [{name : T.T('GWJ500003'),id : '0'},{name : T.T('GWJ500004'),id : '1'}];
		// 退货
		$scope.returnedPurchase = function(e) {
			console.log(e.globalSerialNumbr);
			var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				//"idType" : e.idType,
				//"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
//				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
//				"ecommEntryId" : e.externalIdentificationNo,
//				"ecommOrigEventId" : e.eventNo,
//				"ecommTransCurr" : e.transCurrCde,
//				"ecommTransAmount" : e.transAmount,
//				"ecommTransDate" : e.transDate,
//				"ecommTransPostingCurr" : e.postingCurrencyCode,
//				"ecommTransPostingAmount" : e.postingAmount,
//				"ecommTransStatus" : e.transState,
//				"ecommOriTransDate" : e.transDate,
//				"ecommClearAmount" : e.settlementAmount,
//				"ecommPostingAcctNmbr": e.accountId,
//				"ecommBalType": e.balanceType,
//				"ecommCustId" : e.customerNo,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00054'));
				}
			});
		};
		//部分退货按钮
		$scope.partReturnedPurchase = function(){
			$scope.modal('/businessCard/billManage/busPartReturned.html',
				{}, {
					title :  T.T('F00191'),
					buttons : [ T.T('F00191'),T.T('F00012') ],
					size : [ '1100px', '300px' ],
					callbacks : [$scope.surePartReturned]
				});
		};
		//确定部分退货
		$scope.surePartReturned = function(result){
			var e = result.scope.e;
			//部分退货金额
			$scope.ecommTransPostingAmount = result.scope.partReturnedInf.ecommTransPostingAmount;
			//输入退货金额+已退货金额 小于等于 退货金额
			if($scope.transDetailInfo.rejectedAmount){
				$scope.transDetailInfo.rejectedAmount = $scope.transDetailInfo.rejectedAmount
			}else{
				$scope.transDetailInfo.rejectedAmount = 0;
            }
            $scope.flag = Number($scope.ecommTransPostingAmount)+Number($scope.transDetailInfo.rejectedAmount) <= $scope.transDetailInfo.actualPostingAmount ? true : false;
			if(!$scope.flag){
				jfLayer.alert(T.T('F00193'));
				return;
            }
            var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : $scope.ecommTransPostingAmount,
				"ecommTransDate" : $scope.ecommTransDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" :  e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				"ecommTransPostingAmount": $scope.ecommTransPostingAmount,
				ecommRejectStatus: 'PRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00054'));
				}
			});
		};
	});
	//部分退货金额
	webApp.controller('busPartReturnedCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.partReturnedInf = $scope.e;
	});
});
