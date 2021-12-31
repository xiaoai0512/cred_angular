'use strict';
define(function(require) {
	var webApp = require('app');
	// 利息试算
	webApp.controller('interestCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
	$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
	$translate.refresh();
	$scope.menuName = lodinDataService.getObject("menuName"); 
	$scope.isSelect = false;
	$scope.isResult = false;
	$scope.isShowInterestCalculationDetailsTable = false;
	// 查询方法
	$scope.interestSearch = {};
	//定义隐藏域
	$scope.hide_interestQuery = {};
	//搜索身份证类型
	$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
                                		{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
                                		{name : T.T('F00119'),id : '0'}  ];	//其他
	//联动验证
	var form = layui.form;
	form.on('select(getIdType)',function(data){
		$scope.interestSearch.idNumber = '';
		if(data.value == "1"){//身份证
			$("#interestQuery_idNumber").attr("validator","id_idcard");
		}else if(data.value == "2"){//港澳居民来往内地通行证
			$("#interestQuery_idNumber").attr("validator","id_isHKCard");
		}else if(data.value == "3"){//台湾居民来往内地通行证
			$("#interestQuery_idNumber").attr("validator","id_isTWCard");
		}else if(data.value == "4"){//中国护照
			$("#interestQuery_idNumber").attr("validator","id_passport");
		}else if(data.value == "5"){//外国护照passport
			$("#interestQuery_idNumber").attr("validator","id_passport");
		}else if(data.value == "6"){//外国人永久居留证
			$("#interestQuery_idNumber").attr("validator","id_isPermanentReside");
        }
    });
	// 重置方法
	$scope.refact = function() {
		$scope.interestSearch.idNumber = "";
		$scope.interestSearch.externalIdentificationNo = "";
		$scope.interestSearch.idType= '';
		$scope.interestSearch.customerNo= '';
		$scope.isShowRelation = false;
		$scope.isShowOccurrChain = false;
		$scope.isShowOccurrAmountChain=false;
		$scope.isShowRelatedPartyTransactions=false;
		$scope.isShowInterestCalculationDetailsTable=false;
		$scope.isShowSegmentDetail = false; //分段详情
	};
	$scope.queryitemList = function() {
		$scope.relativeTransTable.params = Object.assign($scope.relativeTransTable.params,$scope.interestSearch);
		if (($scope.interestSearch.idType == null || $scope.interestSearch.idType == ''|| $scope.interestSearch.idType == undefined) &&
				($scope.interestSearch.idNumber == "" || $scope.interestSearch.idNumber == undefined)
				&& ($scope.interestSearch.externalIdentificationNo == "" || $scope.interestSearch.externalIdentificationNo == undefined)) {
			jfLayer.fail(T.T('KHJ2500001'));
		} 
		else {
			if($scope.interestSearch["idType"]){
				if($scope.interestSearch["idNumber"] == null || $scope.interestSearch["idNumber"] == undefined || $scope.interestSearch["idNumber"] == ''){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					$scope.isShowRelation = false;
					$scope.isShowOccurrChain = false;
					$scope.isShowOccurrAmountChain=false;
					$scope.isShowRelatedPartyTransactions=false;
					$scope.isShowInterestCalculationDetailsTable=false;
					$scope.isShowSegmentDetail = false; //分段详情
				}else {
					$scope.relativeTransTable.search();
				}
			}else if($scope.interestSearch["idNumber"]){
				if($scope.interestSearch["idType"] == null || $scope.interestSearch["idType"] == undefined || $scope.interestSearch["idType"] == ''){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					$scope.isShowRelation = false;
					$scope.isShowOccurrChain = false;
					$scope.isShowOccurrAmountChain=false;
					$scope.isShowRelatedPartyTransactions=false;
					$scope.isShowInterestCalculationDetailsTable=false;
					$scope.isShowSegmentDetail = false; //分段详情
				}else {
					$scope.relativeTransTable.search();
				}
			}else {
				$scope.relativeTransTable.search();
			}
		}
	};
	// 结息交易列表
	$scope.relativeTransTable = {
		checkType : 'radio',
		params : {
			"pageSize" : 10,
			"indexNo" : 0
		},
		paging : true,
		resource : 'accBscInf.queryInterest',
		autoQuery : false,
		callback : function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData.rows
						&& data.returnData.rows.length != 0) {
					$scope.relativeTransList = data.returnData.rows;
					$scope.isShowRelation = true;
					$scope.isShowOccurrChain = false;
					$scope.isShowOccurrAmountChain = false;
					$scope.isShowRelatedPartyTransactions = false;
					$scope.isShowInterestCalculationDetailsTable=false;
					$scope.isShowSegmentDetail = false; //分段详情
				} else {
					$scope.isShowRelation = true;
					$scope.isShowOccurrChain = false;
					$scope.isShowOccurrAmountChain = false;
					$scope.isShowRelatedPartyTransactions = false;
					$scope.isShowInterestCalculationDetailsTable=false;
					$scope.isShowSegmentDetail = false; //分段详情
				}
			} 
		}
	};
	// 关联利息贷调交易
	$scope.relativeTransList; //结息交易列表
	$scope.relatedIntLoanTrans = function(item){
		$scope.item = item;
		$scope.relatedIntLoanList = [];//关联利息贷调交易列表
		angular.forEach($scope.relativeTransList, function(ele, index) {
			  if($scope.item.occurrDate == ele.occurrDate && $scope.item.cycleNumber == ele.cycleNumber && $scope.item.eventNo.indexOf('PT.13') != '-1'){
				  $scope.relatedIntLoanList.push(ele);

  }
        } );
		if($scope.relatedIntLoanList.length == 0 ){
			jfLayer.alert(T.T('F00161'));
		}else {
			$scope.isShowRelation = true;//交易历史列表
			$scope.isShowOccurrChain = false;//结息明细查询
			$scope.isShowOccurrAmountChain = false; //发生额节点信息
			$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
			$scope.isShowInterestCalculationDetailsTable=false; //计息过程
			$scope.isShowRelatedIntLoan = true;//关联利息贷调交易
			$scope.isShowSegmentDetail = false; //分段详情
		}
	};
	// 结息明细查询
	$scope.queryInterestContrlChain = function(e) {
		// $scope.occurrChainTable.params.balanceUnitCode =
		// e.entityKey;
		console.log(e);
		if($scope.interestSearch.idType){
			e.idType = $scope.interestSearch.idType;
			e.idNumber = $scope.interestSearch.idNumber;
        }
        if($scope.interestSearch.externalIdentificationNo){
			e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
        }
        if (e.cycleNumber == ""	|| e.cycleNumber == undefined) {
			jfLayer.fail(T.T('KHJ2500002'));
			return;
		} else {
			$scope.occurrChainTable.params.cycleNumber = e.cycleNumber;
		}
		// 余额对象代码
		$scope.paramsObj ={
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceObjectCode: e.balanceObjectCode,
				flag:1,
				accountId: e.accountId,
				currencyCode: e.currencyCode,
		} ;
		$scope.occurrChainTable.params = $.extend($scope.occurrChainTable.params, $scope.paramsObj);
		$scope.occurrChainTable.params.balanceUnitCode = e.entityKey;
		$scope.occurrChainTable.search();
	};
	// 计息控制链
	$scope.occurrChainTable = {
		checkType : 'radio',
		params : {
			"pageSize" : 10,
			"indexNo" : 0
		},
		paging : true,
		resource : 'accBscInf.queryoccurrChain',
		autoQuery : false,
		callback : function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData.rows
						&& data.returnData.rows.length != 0) {
					$scope.isShowRelation = true;
					$scope.isShowOccurrChain = true;
					$scope.isShowOccurrAmountChain = false;
					$scope.isShowRelatedPartyTransactions = false;
					$scope.isShowInterestCalculationDetailsTable=false;
					$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
				} else {
					jfLayer.fail(T.T('KHJ2500003'));
				}
			} else {
				$scope.isShowRelation = true;
				$scope.isShowOccurrChain = false;
				$scope.isShowOccurrAmountChain = false;
				$scope.isShowRelatedPartyTransactions = false;
				$scope.isShowInterestCalculationDetailsTable=false;
				$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
				$scope.isShowSegmentDetail = false; //分段详情
			}
		}
	};
	// 发生额链查询
	$scope.queryOccurrChainList = function(e) {
		if(!$scope.relativeTransTable.validCheck() ){
			return;
        }
        if($scope.interestSearch.idType){
			e.idType = $scope.interestSearch.idType;
			e.idNumber = $scope.interestSearch.idNumber;
        }
        if($scope.interestSearch.externalIdentificationNo){
			e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
        }
        $scope.occurrChainParmasObj ={
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode,
				currencyCode: $scope.relativeTransTable.checkedList().currencyCode
		};
		$scope.occurrChainAmountTable.params = $.extend($scope.occurrChainAmountTable.params, $scope.occurrChainParmasObj );
		$scope.occurrChainAmountTable.search();
	};
	// 发生额链查
	$scope.occurrChainAmountTable = {
		checkType : 'radio',
		params : {
			"pageSize" : 10,
			"indexNo" : 0
		},
		paging : true,
		resource : 'accBscInf.queryOccurrChainAmount',
		autoQuery : false,
		callback : function(data) {
			if (data.returnCode == '000000') {
				$scope.isShowRelation = true;//交易历史列表
				$scope.isShowOccurrChain = true;//结息明细查询
				$scope.isShowOccurrAmountChain = true; //发生额节点信息
				$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
				$scope.isShowInterestCalculationDetailsTable=true; //计息过程
				$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
				$scope.isShowSegmentDetail = false; //分段详情
			} 
		}
	};
	//结息节点信息查看
	$scope.queryDetail =  function(event) {
		$scope.itemInfo = $.parseJSON(JSON
				.stringify(event));
		$scope
				.modal(
						'/cstSvc/interestQuery/layerInerDetail.html',
						$scope.itemInfo, {
							title :T.T('KHJ2500005'),
							buttons : [T.T('F00012')],
							size : [ '1000px', '420px' ],
							callbacks : []
						});
	};
	// 页面弹出框事件(弹出页面)
	$scope.checkInfo = function(event) {
		$scope.transDetailInfo = $.parseJSON(JSON
				.stringify(event));
		$scope
				.modal(
						'/cstSvc/txnInfEnqr/finaciTransDetailInfoHist.html',
						$scope.transDetailInfo, {
							title :T.T('KHJ2500004'),
							buttons : [T.T('F00012')],
							size : [ '1000px', '660px' ],
							callbacks : []
						});
	};
	// 页面弹出框事件(弹出页面)
	$scope.checkCalculationDetails = function(event) {
		$scope.transDetailInfo = $.parseJSON(JSON
				.stringify(event));
		$scope
				.modal(
						'/cstSvc/txnInfEnqr/finaciTransDetailInfoHist.html',
						$scope.transDetailInfo, {
							title : T.T('KHJ2500004'),
							buttons : [ T.T('F00012') ],
							size : [ '1000px', '660px' ],
							callbacks : []
						});
	};
	// 关联交易
	$scope.relatedPartyTransactions = function(e) {
		if($scope.interestSearch.idType){
			e.idType = $scope.interestSearch.idType;
			e.idNumber = $scope.interestSearch.idNumber;
        }
        if($scope.interestSearch.externalIdentificationNo){
			e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
        }
        $scope.relatedParamsObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode, 	// 余额单元代码
				interestStartDate: e.interestStartDate,// 起息日期 yyyy-MM-dd
				nodeTyp: e.nodeTyp // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
		};
		$scope.relatedPartyTransactionsTable.params = $.extend($scope.relatedPartyTransactionsTable.params, $scope.relatedParamsObj);
		$scope.relatedPartyTransactionsTable.search();
	};
	// 发生额链查
	$scope.relatedPartyTransactionsTable = {
		checkType : 'radio',
		params : {
			"pageSize" : 10,
			"indexNo" : 0
		},
		paging : true,
		resource : 'accBscInf.queryRelatedPartyTransactions',
		autoQuery : false,
		callback : function(data) {
			if (data.returnCode == '000000') {
				$scope.isShowRelation = true;//交易历史列表
				$scope.isShowOccurrChain = true;//结息明细查询
				$scope.isShowOccurrAmountChain = false; //发生额节点信息
				$scope.isShowRelatedPartyTransactions = true; //发生额关联交易
				$scope.isShowInterestCalculationDetailsTable= true; //计息过程
				$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
				$scope.isShowSegmentDetail = false; //分段详情
			}
		}
	};
	// 利息计算详情
	$scope.interestCalculationDetails = function(e) {
		if($scope.interestSearch.idType){
			e.idType = $scope.interestSearch.idType;
			e.idNumber = $scope.interestSearch.idNumber;
        }
        if($scope.interestSearch.externalIdentificationNo){
			e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
        }
        e.interestStartDate = e.billingStartDate;
		$scope.interestCalculationDetailsTable.params = $.extend($scope.interestCalculationDetailsTable.params, e);
		$scope.interestCalculationDetailsTable.params.balanceUnitCode = e.balanceUnitCode;
		$scope.interestCalculationDetailsTable.search();
		//s$scope.interestCalculationDetailsTableHand($scope.interestCalculationDetailsTable.params);
	};
	// 计息过程
	$scope.interestCalculationDetailsTable = {
		checkType : 'radio',
		params : {
			"pageSize" : 10,
			"indexNo" : 0,
			"eventNo": 'BSS.IQ.01.0080'
		},
		paging : true,
		resource : 'accBscInf.queryInterestCalculationDetailsTable',
		autoQuery : false,
		callback : function(data) {
			if (data.returnCode == '000000') {
				$scope.isShowRelation = true;//交易历史列表
				$scope.isShowOccurrChain = true;//结息明细查询
				$scope.isShowOccurrAmountChain = false; //发生额节点信息
				$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
				$scope.isShowInterestCalculationDetailsTable=true; //计息过程
				$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
				$scope.isShowSegmentDetail = false; //分段详情
				if (data.returnData == "" || data.returnData == undefined ) {
					data.returnData.rows =[];

				}else {
					if(data.returnData.rows == null || data.returnData.rows == undefined || data.returnData.rows == 'null' 
						|| data.returnData.rows == '' || data.returnData.rows.length==0){
						data.returnData.rows =[];
					}
				}
			} 
		}
	};
	$scope.interestCalculationDetailsTableHand = function(params){
		// 计息过程
		jfRest.request('accBscInf', 'queryInterestCalculationDetailsTable',params).then(function(data) {
			if (data.returnCode == '000000') {//客户存在
				$scope.isShowRelation = true;//交易历史列表
				$scope.isShowOccurrChain = true;//结息明细查询
				$scope.isShowOccurrAmountChain = false; //发生额节点信息
				$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
				$scope.isShowInterestCalculationDetailsTable=true; //计息过程
				$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
				$scope.isShowSegmentDetail = false; //分段详情
				if (data.returnData == "" || data.returnData == undefined ) {
					$scope.interestCalculationDetailsTableList =[];
				}else {
					if (data.returnData.interestProcessBeanList.length == 0 ) {
						$scope.interestCalculationDetailsTableList =[];

					}else{
						$scope.interestCalculationDetailsTableList = data.returnData.interestProcessBeanList;
					}
				}
			}
		});
	};
	//分段详情
	$scope.segmenteDetails = function(item){
		$scope.itemInfo = item;
		$scope.segmentDetailList = $scope.itemInfo.list;
		$scope.isShowRelation = true;//交易历史列表
		$scope.isShowOccurrChain = true;//结息明细查询
		$scope.isShowOccurrAmountChain = false; //发生额节点信息
		$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
		$scope.isShowInterestCalculationDetailsTable=true; //计息过程
		$scope.isShowRelatedIntLoan = false;//关联利息贷调交易
		$scope.isShowSegmentDetail = true; //分段详情
	};
	//发生额详情
	$scope.occureBalanceDetails = function(e){
		if(!$scope.relativeTransTable.validCheck() ){
			return;
        }
        if($scope.interestSearch.idType){
			e.idType = $scope.interestSearch.idType;
			e.idNumber = $scope.interestSearch.idNumber;
        }
        if($scope.interestSearch.externalIdentificationNo){
			e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
        }
        $scope.occurrChainParmasObj ={
				currencyCode: $scope.relativeTransTable.checkedList().currencyCode,
		};
		$scope.itemPrams = $.extend($scope.occurrChainParmasObj,e);
		$scope.modal('/cstSvc/interestQuery/layerOccurDetai.html',$scope.itemPrams, {
			title :T.T('KHJ2500006'),
			buttons : [T.T('F00012')],
			size : [ '1000px', '420px' ],
			callbacks : []
		});
	/*	$scope.occurrChainAmountTable.params = $.extend($scope.occurrChainAmountTable.params, $scope.occurrChainParmasObj );
		$scope.occurrChainAmountTable.search();*/
	};
	//关联交易
	$scope.relatedTrans2 = function(e){
		if($scope.interestSearch.idType){
			e.idType = $scope.interestSearch.idType;
			e.idNumber = $scope.interestSearch.idNumber;
        }
        if($scope.interestSearch.externalIdentificationNo){
			e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
        }
        $scope.relatedParamsObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode, 	// 余额单元代码
				interestStartDate: e.interestStartDate,// 起息日期 yyyy-MM-dd
				nodeTyp: e.nodeTyp // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
		};
		$scope.relatedPartyTransactionsTable.params = $.extend($scope.relatedPartyTransactionsTable.params, $scope.relatedParamsObj);
		$scope.relatedPartyTransactionsTable.search();
	};
});
	//结息明细
	webApp.controller('layerInerDetailCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
			$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translate.refresh();
	});
	//分段明细
	webApp.controller('segmenteDetailCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
			$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translate.refresh();
	});
	//发生额详情
	webApp.controller('layerOccurDetaiCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
			$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translate.refresh();
		//`node_typ` '节点类别 DR-借方节点  CR-贷方节点（包括还款）PY(还款) RV (还款还原)',
		$scope.nodeTypArray = [{
			id: 'DR',
			name : T.T('KHJ2500007')
		},{
			id: 'CR',
			name : T.T('KHJ2500008')
		},{
			id: 'PY',
			name : T.T('KHJ2500009')
		},{
			id: 'RV',
			name : T.T('KHJ2500010')
		}];
		//发生额详情
		jfRest.request('accBscInf', 'queryOccurrChainAmount',$scope.itemPrams).then(function(data) {
			console.log(data);
			if (data.returnCode == '000000') {//客户存在
				 $scope.itemInfo = data.returnData.rows[0];
			}  
		});
	});
	//发生额关联交易
	webApp.controller('finaciTransDetailInfoHistCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
			$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translate.refresh();
	})
});
