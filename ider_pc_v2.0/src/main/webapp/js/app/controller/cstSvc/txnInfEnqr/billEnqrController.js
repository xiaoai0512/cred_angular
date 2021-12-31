'use strict';
define(function(require) {
	var webApp = require('app');
	//require('../../cstSvc/txnInfEnqr/txnCgyAvyLogEnqrController.js');
	//账单信息
	webApp.controller('billEnqrCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
				$translate.refresh();
		    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
		    	$scope.ectypeArray = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
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
            	$scope.billingInfoList.params.idNumber = '';
            	if(data.value == "1"){//身份证
            		$("#billEnqr_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#billEnqr_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#billEnqr_idNumber").attr("validator","id_isTWCard");
            	}else if(data.value == "4"){//中国护照
            		$("#billEnqr_idNumber").attr("validator","id_passport");
            	}else if(data.value == "5"){//外国护照passport
            		$("#billEnqr_idNumber").attr("validator","id_passport");
            	}else if(data.value == "6"){//外国人永久居留证
            		$("#billEnqr_idNumber").attr("validator","id_isPermanentReside");
            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#billEnqr_idNumber").attr("validator","noValidator");
            		$scope.billQueryForm.$setPristine();
            		$("#billEnqr_idNumber").removeClass("waringform ");
                }
            });
		$scope.isShowBillingInfo = false;
		//重置
		$scope.reset = function() {
			$scope.billingInfoList.params.idNumber= '';
			$scope.billingInfoList.params.externalIdentificationNo= '';
			$scope.billingInfoList.params.idType= '';
			$scope.billingInfoList.params.customerNo= '';
			$scope.isShowBillingInfo = false;
			$("#billEnqr_idNumber").attr("validator","noValidator");
			$("#billEnqr_idNumber").removeClass("waringform ");
		};
		//账单信息列表
		$scope.billingInfoList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'billingInfoEnqr.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShowBillingInfo = true;
				}else {
					$scope.isShowBillingInfo = false;
				}
			}
		};
		//点击查询
		$scope.billSearch = function() {
			if(($scope.billingInfoList.params.idType == null || $scope.billingInfoList.params.idType == undefined) &&
					($scope.billingInfoList.params.idNumber == undefined || $scope.billingInfoList.params.idNumber == "") && 
					($scope.billingInfoList.params.externalIdentificationNo == undefined || $scope.billingInfoList.params.externalIdentificationNo == null || $scope.billingInfoList.params.externalIdentificationNo == "")){
				$scope.isShowBillingInfo = false;
				jfLayer.alert(T.T('F00076'));//"请输入证件号码/外部识别号查询"
			}
			else {
				if($scope.billingInfoList.params["idType"] ){
					if($scope.billingInfoList.params["idNumber"] == null || $scope.billingInfoList.params["idNumber"] == undefined || $scope.billingInfoList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowBillingInfo = false;
					}else {
						$scope.billingInfoList.search();
					}
				}else if($scope.billingInfoList.params["idNumber"] ){
					if($scope.billingInfoList.params["idType"] == null || $scope.billingInfoList.params["idType"] == undefined || $scope.billingInfoList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowBillingInfo = false;
					}else {
						$scope.billingInfoList.search();
					}
				}else {
					$scope.billingInfoList.search();
				}
			}
		};
		//查询业务类型级别
		$scope.checkItem = function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			$scope.itemInf = Object.assign($scope.itemInf,  $scope.billingInfoList.params);
			$scope.modal('/cstSvc/txnInfEnqr/viewBill.html', $scope.itemInf, {
				title : T.T('KHJ4500001'),//'账单摘要(产品级)',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '1030px', '500px' ],
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
		$translate.refresh();
		$scope.isShowStageResultInfo = false; //分期试算结果
		$scope.paramss = {
				customerNo:$scope.stageInf.customerNo,
				currentCycleNumber:$scope.stageInf.currentCycleNumber,
				businessProgramNo: $scope.stageInf.businessProgramNo,
				businessTypeCode: $scope.stageInf.businessTypeCode,
				idType: $scope.stageInf.idType,
				postingCurrencyCode: $scope.stageInf.currencyCode,
				idNumber: $scope.stageInf.idNumber,
				externalIdentificationNo: $scope.stageInf.externalIdentificationNo
		};
		jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.stageInf.billAmt = data.returnData.billAmt;
			}
		});
		//"3期""6期""9期""12期""24期"
//		$scope.termArr =[{name: T.T('KHJ4500002'),id:"3"},{name: T.T('KHJ4500003'),id:"6"},{name: T.T('KHJ4500004'),id:"9"},{name: T.T('KHJ4500005'),id:"12"},{name: T.T('KHJ4500006'),id:"24"}];
		//动态请求下拉框 分期期数
		 $scope.termArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_stageTerm",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
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
					externalIdentificationNo: $scope.stageInf.externalIdentificationNo
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
				}else {
					$scope.isShowStageResultInfo = false; //分期试算结果
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
					idType: $scope.stageInf.idType,
					idNumber: $scope.stageInf.idNumber,
					externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
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
		$translate.refresh();
//		$scope.ectypeArray = [{name : T.T('YYJ1300035'),id : '0'},{name : T.T('YYJ1300036'),id : '1'}];
		//动态请求下拉框 费用收取方式
		 $scope.ectypeArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_ecommFeeCollectType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        
			        }
		};
		//延滞信息
		$scope.delayInf  = $scope.itemInf.page.rows;
		// 业务类型级别账单list
		$scope.billSummList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				idType: $scope.itemInf.idType,
				idNumber: $scope.itemInf.idNumber,
				externalIdentificationNo: $scope.itemInf.externalIdentificationNo,
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
			$scope.itemDetailInf.idType = $scope.itemInf.idType;
			$scope.itemDetailInf.idNumber = $scope.itemInf.idNumber;
			$scope.itemDetailInf.externalIdentificationNo = $scope.itemInf.externalIdentificationNo;
			$scope.modal('/cstSvc/txnInfEnqr/viewTradeDetail.html', $scope.itemDetailInf, {
				title : T.T('KHJ4500009'),//'账单摘要详情(业务类型级)'
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '1150px', '500px' ],
				callbacks : []
			});
		};
		//账单分期
		$scope.billStage = function(item) {
			$scope.stageInf = $.parseJSON(JSON.stringify(item));
			$scope.stageInf.idType = $scope.itemInf.idType;
			$scope.stageInf.idNumber = $scope.itemInf.idNumber;
			$scope.stageInf.externalIdentificationNo = $scope.itemInf.externalIdentificationNo;
			$scope.paramss = {
					customerNo:$scope.stageInf.customerNo,
					currentCycleNumber:$scope.stageInf.currentCycleNumber,
					businessProgramNo: $scope.stageInf.businessProgramNo,
					businessTypeCode: $scope.stageInf.businessTypeCode,
					postingCurrencyCode: $scope.stageInf.currencyCode,
					idType: $scope.stageInf.idType,
					idNumber: $scope.stageInf.idNumber,
					externalIdentificationNo: $scope.stageInf.externalIdentificationNo
			};
			//判断是否逾期，逾期不弹窗
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
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
			if($scope.stageInf.billAmt <  Number($scope.stageInf.loanAmt) ){
				jfLayer.alert(T.T('KHJ4500007'));//"分期金额不能大于可分期最大额度！"
				return;
            }
            if($scope.stageInf.term  == undefined || $scope.stageInf.term  == null || $scope.stageInf.term  == ''){
				jfLayer.alert(T.T('KHJ4500008'));//"分期期数不能为空！"
				return;
            }
            $scope.stageInfo1 = result.scope.stageInf;
			$scope.stageParams = {
					ecommPostingAcctNmbr: $scope.stageInfo1.accountId,
					ecommCustId: $scope.stageInfo1.customerNo,//
					ecommTransPostingAmount: $scope.stageInfo1.loanAmt,//分期金额
					ecommTransPostingCurr: $scope.stageInfo1.currencyCode,
					ecommFeeCollectType: $scope.stageInfo1.ecommFeeCollectType,
					ecommBusinessProgramCode: $scope.stageInf.businessProgramNo,// 业务项目
					ecommBusineseType: $scope.stageInf.businessTypeCode,
					ecommProdObjId:  $scope.stageInf.productObjectCode,
					currBillFlag: '1',
					ecommSourceCde: 'L',
					ecommInstallmentPeriod: $scope.stageInfo1.term,
					ecommEntryId : $scope.stageInfo1.externalIdentificationNo,
					ecommBillAmt : $scope.stageInfo1.billAmt
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
  		    		$scope.safeApply();
  		  			result.cancel();
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
		$translate.refresh();
		//研制信息
		$scope.delayInf = $scope.itemDetailInf.page.rows;
		// 交易明细账单list
		$scope.billTradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				idType: $scope.itemDetailInf.idType,
				idNumber: $scope.itemDetailInf.idNumber,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
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
				buttons : [ '关闭' ],
				size : [ '900px', '500px' ],
				callbacks : []
			});
		};*/
	});
});
