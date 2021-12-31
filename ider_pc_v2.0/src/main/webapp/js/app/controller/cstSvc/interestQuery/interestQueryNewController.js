'use strict';
define(function(require) {
	var webApp = require('app');
	// 利息试算
	webApp.controller('interestQueryNewCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isSelect = false;
		$scope.isResult = false;
		$scope.isShowInterestCalculationDetailsTable = false;
		// 查询方法
		$scope.interestSearch = {};
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
		form.on('select(getIdType)', function(data) {
			$scope.interestSearch.idNumber = '';
			if (data.value == "1") { //身份证
				$("#interestQuery_idNumber").attr("validator", "id_idcard");
			} else if (data.value == "2") { //港澳居民来往内地通行证
				$("#interestQuery_idNumber").attr("validator", "id_isHKCard");
			} else if (data.value == "3") { //台湾居民来往内地通行证
				$("#interestQuery_idNumber").attr("validator", "id_isTWCard");
			} else if (data.value == "4") { //中国护照
				$("#interestQuery_idNumber").attr("validator", "id_passport");
			} else if (data.value == "5") { //外国护照passport
				$("#interestQuery_idNumber").attr("validator", "id_passport");
			} else if (data.value == "6") { //外国人永久居留证
				$("#interestQuery_idNumber").attr("validator", "id_isPermanentReside");
            }
        });
		// 重置方法
		$scope.refact = function() {
			$scope.interestSearch.idNumber = "";
			$scope.interestSearch.externalIdentificationNo = "";
			$scope.interestSearch.idType = '';
			$scope.interestSearch.customerNo = '';
			$scope.isShowRelation = false;
			$scope.isShowOccurrChain = false;
			$scope.isShowOccurrAmountChain = false;
			$scope.isShowRelatedPartyTransactions = false;
			$scope.isShowInterestCalculationDetailsTable = false;
			$scope.isShowSegmentDetail = false; //分段详情
		};
		$scope.queryitemList = function() {
			if (($scope.interestSearch.idType == null || $scope.interestSearch.idType == '' || $scope.interestSearch.idType ==
					undefined) &&
				($scope.interestSearch.idNumber == "" || $scope.interestSearch.idNumber == undefined) &&
				($scope.interestSearch.externalIdentificationNo == "" || $scope.interestSearch.externalIdentificationNo ==
					undefined)) {
				jfLayer.fail(T.T('KHJ2500001'));
			} else {
				if ($scope.interestSearch["idType"]) {
					if ($scope.interestSearch["idNumber"] == null || $scope.interestSearch["idNumber"] == undefined || $scope.interestSearch[
							"idNumber"] == '') {
						jfLayer.alert(T.T('F00110')); //'请核对证件号码'
						$scope.isShowRelation = false;
						$scope.isShowOccurrChain = false;
						$scope.isShowOccurrAmountChain = false;
						$scope.isShowRelatedPartyTransactions = false;
						$scope.isShowInterestCalculationDetailsTable = false;
						$scope.isShowSegmentDetail = false; //分段详情
					} else {
						$scope.queryMainAcc();
					}
				} else if ($scope.interestSearch["idNumber"]) {
					if ($scope.interestSearch["idType"] == null || $scope.interestSearch["idType"] == undefined || $scope.interestSearch[
							"idType"] == '') {
						jfLayer.alert(T.T('F00109')); //"请核对证件类型！"
						$scope.isShowRelation = false;
						$scope.isShowOccurrChain = false;
						$scope.isShowOccurrAmountChain = false;
						$scope.isShowRelatedPartyTransactions = false;
						$scope.isShowInterestCalculationDetailsTable = false;
						$scope.isShowSegmentDetail = false; //分段详情
					} else {
						$scope.queryMainAcc();
					}
				} else {
					$scope.queryMainAcc();
				}
			}
		};
		// 结息交易列表 查询主账户
		//翻译
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_ecommTransStatus",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
			function(data) {
				$scope.transStateList = data.returnData.rows;
		}); 
		//查询主子账户11111111111111111111
		$scope.pageCount = 0;
		$scope.pageNumP = 1;
		$scope.pageSizeP = 10;
		$scope.queryMainAcc = function(){
			layui.use(['treeTable'], function () {
				  var $ = layui.jquery;
				  var treeTable = layui.treeTable;
				  var insTb = treeTable.render({
		            elem: '#settlementTreeTable',
		            tree: {},
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
		                {align: 'left',field: 'accountId', title: T.T("KHH2500004"),width:230},
		                {field: 'productObjectCode', title: T.T("KHH2500106"),width:180,templet: function(d){
		                    if(d.productObjectCode ||d.productDesc){
		                    	return '<span>'+ d.productObjectCode + d.productDesc +'</span>';
		                    }else {
		                    	return '<span></span>';
                            }
                            }},
		                {field: 'businessTypeCode', title: T.T("KHH2500062"),width:180,templet: function(d){
		                	if(d.businessTypeCode ||d.businessDesc){
		                    	return '<span>'+ d.businessTypeCode + d.businessDesc +'</span>';
		                    }else {
		                    	return '<span></span>';
                            }
                            }},
		                {field: 'transDate', title: T.T("KHH2500005"),width:100,templet: function(d){
		                	if(d.postingCurrencyCode ||d.postingCurrencyDesc){
		                    	return '<span>'+ d.postingCurrencyCode + d.postingCurrencyDesc +'</span>';
		                    }else {
		                    	return '<span></span>';
                            }
                            }},
		                {field: 'postingAmount', title: T.T("KHH2500006"), },
		                {field: 'occurrDate', title:  T.T("KHH2500008")},
		                {field: 'transDesc', title:  T.T("KHH2500009"),width:180},
		                {field:'haveChild',align: 'center', templet: '#settlementHandle', title: T.T("F00017"), width:200}//toolbar
		            ],
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					externalIdentificationNo:  $scope.interestSearch.externalIdentificationNo,
		    					idType:  $scope.interestSearch.idType,
		    					idNumber:  $scope.interestSearch.idNumber,
		    					accFlag : "mainAcc",
		    					globalSerialNumbr : data1.globalSerialNumbr,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
		    					queryType : '7',//结息查询主子账户标识
	                		};
		            		jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.isShowRelation = true;
	        						$scope.isShowOccurrChain = false;
	        						$scope.isShowOccurrAmountChain = false;
	        						$scope.isShowRelatedPartyTransactions = false;
	        						$scope.isShowInterestCalculationDetailsTable = false;
	        						$scope.isShowSegmentDetail = false; //分段详情
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	            							for(var k = 0; k < $scope.transStateList.length; k++){
	            								if(item.transState == $scope.transStateList[k].codes){
	            									item.transStateDesc = $scope.transStateList[k].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        						}else {
	        							data.returnData.rows = [];
	        							callback(data.returnData.rows);
                                    }
                                }else {
	                				$scope.isShowRelation = false;
	        						$scope.isShowOccurrChain = false;
	        						$scope.isShowOccurrAmountChain = false;
	        						$scope.isShowRelatedPartyTransactions = false;
	        						$scope.isShowInterestCalculationDetailsTable = false;
	        						$scope.isShowSegmentDetail = false; //分段详情
                                }
                            });
		            	}else {//查主账户
		            		$scope.params = {
		    					externalIdentificationNo:  $scope.interestSearch.externalIdentificationNo,
		    					idType:  $scope.interestSearch.idType,
		    					idNumber:  $scope.interestSearch.idNumber,
		    					pageFlag : "mainPage",
		    					queryType : '7',//结息查询主子账户标识
		    					pageNum: $scope.pageNumP,
		    			        pageSize: $scope.pageSizeP,
	                		};
		            		jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.isShowRelation = true;
	        						$scope.isShowOccurrChain = false;
	        						$scope.isShowOccurrAmountChain = false;
	        						$scope.isShowRelatedPartyTransactions = false;
	        						$scope.isShowInterestCalculationDetailsTable = false;
	        						$scope.isShowSegmentDetail = false; //分段详情
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCount = data.returnData.totalCount;
	        							pageInit($scope.pageCount,"settlementPageDemo");//初始化分页
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = true;
	            							for(var k = 0; k < $scope.transStateList.length; k++){
	            								if(item.transState == $scope.transStateList[k].codes){
	            									item.transStateDesc = $scope.transStateList[k].detailDesc;
                                                }
                                            }
	            						});
	        							callback(data.returnData.rows);
	        							if(!data1){//主账户
	        								layui.use(['laypage', 'layer'], function(){
	  					                      var laypage = layui.laypage
	  					                      ,layer = layui.layer;
	  					                      laypage.render({
	  					                            elem: 'settlementPageDemo',
	  					                            count: $scope.pageCount,
	  					                            limit: $scope.pageSizeP,
	  					                            curr: $scope.pageNumP,
	  					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	  					                            jump: function(obj,first){
	  					                             if (!first) {
	  					                              $scope.pageNumP = obj.curr;
	  					                              $scope.pageSizeP = obj.limit;
	  					                              $scope.queryMainAcc();
	  					                             }
	  					                            }
	  					                        });
	  					                    });
	        								
	        							}
	        						}else {
	        							$scope.rows = [];
	        							callback($scope.rows);
	        							$scope.pageCount = 0;
	        							pageInit($scope.pageCount,"settlementPageDemo");//初始化分页
                                    }
                                }else {
	                				$scope.isShowRelation = false;
	        						$scope.isShowOccurrChain = false;
	        						$scope.isShowOccurrAmountChain = false;
	        						$scope.isShowRelatedPartyTransactions = false;
	        						$scope.isShowInterestCalculationDetailsTable = false;
	        						$scope.isShowSegmentDetail = false; //分段详情
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
				  });
				  //操作按钮
				treeTable.on('tool(settlementTreeTable)', function (obj) {
					var event = obj.event;
					if (event == 'queryInterestContrlChain') {
						$scope.settlementTreeTableChenked = obj.data;
					    $scope.queryInterestContrlChain(obj.data);
					} else if (event == 'queryRelativeTrans') {
					    $scope.queryRelativeTrans(obj.data);
					}else if(event == 'checkInfo'){
						 $scope.checkInfo(obj.data);
                    }
                });
			});
		};
		//暂无数据 分页隐藏
		function pageInit(pageCount,pageDivId){
			if(pageCount > 0 ){
				$("#"+ pageDivId).css("display","block");
			}else {
				$("#"+ pageDivId).css("display","none");
            }
        }
        // 关联利息贷调交易
		$scope.relativeTransList; //结息交易列表
		$scope.relatedIntLoanTrans = function(item) {
			$scope.item = item;
			$scope.relatedIntLoanList = []; //关联利息贷调交易列表
			angular.forEach($scope.relativeTransList, function(ele, index) {
				if ($scope.item.occurrDate == ele.occurrDate && $scope.item.cycleNumber == ele.cycleNumber && $scope.item.eventNo
					.indexOf('PT.13') != '-1') {
					$scope.relatedIntLoanList.push(ele);
                }
            });
			if ($scope.relatedIntLoanList.length == 0) {
				jfLayer.alert(T.T("F00161"));
			} else {
				$scope.isShowRelation = true; //交易历史列表
				$scope.isShowOccurrChain = false; //结息明细查询
				$scope.isShowOccurrAmountChain = false; //发生额节点信息
				$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
				$scope.isShowInterestCalculationDetailsTable = false; //计息过程
				$scope.isShowRelatedIntLoan = true; //关联利息贷调交易
				$scope.isShowSegmentDetail = false; //分段详情
			}
		};
		// 结息明细查询
		$scope.queryInterestContrlChain = function(e) {
			if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            if (e.cycleNumber == "" || e.cycleNumber == undefined) {
				jfLayer.fail(T.T('KHJ2500002'));
				return;
			} else {
				$scope.occurrChainTable.params.cycleNumber = e.cycleNumber;
			}
			// 余额对象代码
			$scope.paramsObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceObjectCode: e.balanceObjectCode,
				flag: 1,
				accountId: e.accountId,
				currencyCode: e.currencyCode,
			};
			$scope.occurrChainTable.params = $.extend($scope.occurrChainTable.params, $scope.paramsObj);
			$scope.occurrChainTable.params.balanceUnitCode = e.entityKey;
			$scope.occurrChainTable.search();
		};
		//结息交易列表 关联交易
		$scope.queryRelativeTrans = function(e){
			$scope.balUnitPostingParams = $.parseJSON(JSON.stringify(e));
			$scope.balUnitPostingParams.idType = $scope.interestSearch.idType;
			$scope.balUnitPostingParams.idNumber = $scope.interestSearch.idNumber;
			$scope.balUnitPostingParams.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
			$scope.balUnitPostingParams.businessType = $scope.balUnitPostingParams.businessTypeCode;
			$scope.modal('/cstSvc/txnInfEnqr/relatedInfor.html',
				$scope.balUnitPostingParams, {
					title : T.T('KHJ1800002'),
					buttons : [ T.T('F00012') ],
					size : [ '1100px', '550px' ],
					callbacks : []
				});
		};
		// 计息控制链
		$scope.occurrChainTable = {
			checkType: 'radio',
			params: {
				"pageSize": 10,
				"indexNo": 0
			},
			paging: true,
			resource: 'accBscInf.queryoccurrChain',
			autoQuery: false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_assetSubTable'],//查找数据字典所需参数
			transDict : ['assetProperties_assetPropertiesDesc'],//翻译前后key
			callback: function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows &&
						data.returnData.rows.length != 0) {
						$scope.isShowRelation = true;
						$scope.isShowOccurrChain = true;
						$scope.isShowOccurrAmountChain = false;
						$scope.isShowRelatedPartyTransactions = false;
						$scope.isShowInterestCalculationDetailsTable = false;
						$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
						$scope.isShowSegmentDetail = false; //分段详情
					} else {
						jfLayer.fail(T.T('KHJ2500003'));
						$scope.isShowRelation = true;
						$scope.isShowOccurrChain = false;
						$scope.isShowOccurrAmountChain = false;
						$scope.isShowRelatedPartyTransactions = false;
						$scope.isShowInterestCalculationDetailsTable = false;
						$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
						$scope.isShowSegmentDetail = false; //分段详情
					}
				} else {
						jfLayer.fail(data.returnMsg);
				}
			}
		};
		// 发生额链查询
		$scope.queryOccurrChainList = function(e) {
			if (!$scope.relativeTransTable.validCheck()) {//$scope.queryMainAcc();
				return;
            }
            if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            $scope.occurrChainParmasObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode,
				currencyCode: $scope.relativeTransTable.checkedList().currencyCode
			};
			$scope.occurrChainAmountTable.params = $.extend($scope.occurrChainAmountTable.params, $scope.occurrChainParmasObj);
			$scope.occurrChainAmountTable.search();
		};
		// 发生额链查
		$scope.occurrChainAmountTable = {
			checkType: 'radio',
			params: {
				"pageSize": 10,
				"indexNo": 0
			},
			paging: true,
			resource: 'accBscInf.queryOccurrChainAmount',
			autoQuery: false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_nodeType'],//查找数据字典所需参数
			transDict : ['nodeTyp_nodeTypDesc'],//翻译前后key
			callback: function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowRelation = true; //交易历史列表
					$scope.isShowOccurrChain = true; //结息明细查询
					$scope.isShowOccurrAmountChain = true; //发生额节点信息
					$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
					$scope.isShowInterestCalculationDetailsTable = true; //计息过程
					$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
				} else {
					var returnMsg = data.returnMsg ? data.returnMsg :
						T.T('F00035');
						jfLayer.fail(data.returnMsg);
				}
			}
		};
		//结息节点信息查看
		$scope.queryDetail = function(event) {
			$scope.itemInfo = $.parseJSON(JSON
				.stringify(event));
			$scope
				.modal(
					'/cstSvc/interestQuery/layerInerDetail.html',
					$scope.itemInfo, {
						title: T.T('KHJ2600004'),
						buttons: [T.T('F00012')],
						size: ['1000px', '420px'],
						callbacks: []
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
						title: T.T('KHJ2500004'),
						buttons: [T.T('F00012')],
						size: ['1000px', '560px'],
						callbacks: []
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
						title: T.T('KHJ2500004'),
						buttons: [T.T('F00012')],
						size: ['1000px', '560px'],
						callbacks: []
					});
		};
		// 关联交易
		$scope.relatedPartyTransactions = function(e) {
			if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            $scope.relatedParamsObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode, // 余额单元代码
				interestStartDate: e.interestStartDate, // 起息日期 yyyy-MM-dd
				nodeTyp: e.nodeTyp // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
			};
			$scope.relatedPartyTransactionsTable.params = $.extend($scope.relatedPartyTransactionsTable.params, $scope.relatedParamsObj);
			$scope.relatedPartyTransactionsTable.search();
		};
		// 关联交易链查
		$scope.relatedPartyTransactionsTable = {
			checkType: 'radio',
			params: {
				"pageSize": 10,
				"indexNo": 0
			},
			paging: true,
			resource: 'accBscInf.queryRelatedPartyTransactions',
			autoQuery: false,
			callback: function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowRelation = true; //交易历史列表
					$scope.isShowOccurrChain = true; //结息明细查询
					$scope.isShowOccurrAmountChain = false; //发生额节点信息
					$scope.isShowRelatedPartyTransactions = true; //发生额关联交易
					$scope.isShowInterestCalculationDetailsTable = true; //计息过程
					$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
				} else {
						jfLayer.fail(data.returnMsg);
				}
			}
		};
		// 点击计息过程
		$scope.interestCalculationDetails = function(e) {
			if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            e.interestStartDate = e.billingStartDate;
			//点击计息过程，展示3层表格， 子表的子表等
			$scope.interestParams = {
				"pageSize": 10,
				"indexNo": 0,
				"eventNo": 'BSS.IQ.01.0080',
				idType: $scope.interestSearch.idType,
				idNumber: $scope.interestSearch.idNumber,
				externalIdentificationNo: $scope.interestSearch.externalIdentificationNo,
			};
			e.interestStartDate = e.billingStartDate;
			$scope.interestParams = $.extend($scope.interestParams, e);
			jfRest.request('accBscInf', 'queryInterestCalculationDetailsTable', $scope.interestParams).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowRelation = true; //交易历史列表
					$scope.isShowOccurrChain = true; //结息明细查询
					$scope.isShowOccurrAmountChain = false; //发生额节点信息
					$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
					$scope.isShowInterestCalculationDetailsTable = true; //计息过程
					$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
					if (data.returnData) {
						var firstList = data.returnData.rows;
						layui.use(['form', 'table','tableChild'], function () {
							var table = layui.table,
								form = layui.form,
								tableChild = layui.tableChild;
							var myTable = table.render({
								elem: '#myTable',
								data: firstList,
								height: 'auto',
								page: false,
								cols: [
									[{
											title: '#',
											width: 50,
											children: function(row) {
												return [
													{
														title: 	T.T('KHJ2500011'),
														data: function(row) {
															// d 为当前行数据
															return row.occureAmountList;
														},
														height: 'auto',
														page: false,
														cols: [
															[{
																	title: '#',
																	show: '1',
																	width: 50,
																	children: [{
																		title: T.T('KHH2500044'),
																		data: function(row) {
																			return row.list;
																		},
																		height: 'auto',
																		page: false,
																		cols: [
																			[{
																					title: '#',
																					width: 50,
																				},
																				{
																					field: 'pricipal',
																					title: T.T('KHJ2500012'),
																					width: 112,
																				}, {
																					field: 'rate',
																					title: T.T('KHH2500049'),
																					width: 112,
																				}, {
																					field: 'dayFactory',
																					title: 'DAY-FACTOR',
																					width: 150,
																				}, {
																					field: 'startDate',
																					title: T.T('KHH2500076'),
																					width: 165,
																				}, {
																					field: 'endDate',
																					title: T.T('KHH2500077'),
																					width: 150,
																				},
																				{
																					field: 'interestDays',
																					title: T.T('KHH2500078'),
																					width: 123,
																				},
																				{
																					field: 'interest',
																					title: T.T('KHH2500079'),
																					width: 165,
																				},
																			]
																		],
																		done: function() {
																			tableChild.render(this);
																		},
																		toolEvent: function(obj) {
																			console.log(obj);
																			if (obj.event == 'threeChildEdit') {} else if (obj.event === 'threeChildDel') {
																			}
																		}
																	}]
																},
																{
																	field: 'pricipal',
																	title: T.T('KHH2500074'),
																	width: 165,
																}, {
																	field: 'nodeTyp',
																	title: T.T('KHH2500075'),
																	width: 112,
																	templet: function(d) {
																		if (d.nodeTyp == "DR") {
																			return '<span>'+T.T('KHH2500039')+'</span>'
																		} else if (d.nodeTyp == "CR") {
																			return '<span>'+T.T('KHH2500081')+'</span>'
																		} else if (d.nodeTyp == "PY") {
																			return '<span>'+T.T('KHH2500082')+'</span>'
																		} else if (d.nodeTyp == "RV") {
																			return '<span>'+T.T('KHH2500083')+'</span>'
																		} else if (d.nodeTyp == "NI") {
																			return '<span>'+T.T('KHH2500084')+'</span>'
																		} else if (d.nodeTyp == "NO") {
																			return '<span>'+T.T('KHH2500085')+'</span>'
																		} else if (d.nodeTyp == "CB") {
																			return '<span>'+T.T('KHH2500086')+'</span>'
																		}
																	},
																},
																{
																	field: 'interest',
																	title: T.T('KHH2500079'),
																	width: 165,
																}, {
																	field: 'balanceUnitCode',
																	title: T.T('KHH2500096'),
																	width: 180,
																},
																{
																	width: 260,
																	title: T.T('F00017'),
																	align: 'center',
																	templet: function(d){
																		return '<a class="layui-btn layui-btn-xs" lay-event="occurAmountEvent">发生额详情</a>'+
																    	'<a class="layui-btn layui-btn-xs" lay-event="relatedTransEvent">关联交易</a>';
																	}
																}//toolbar: '#childBar'
															]
														],
														done: function() {
															tableChild.render(this);
														},
														toolEvent: function(obj) {
															console.log(obj);
															if (obj.event == 'occurAmountEvent') {
																$scope.occureBalanceDetails(obj.data);
															} else if (obj.event === 'relatedTransEvent') {
																//$scope.relatedTrans2(obj.data);//关联交易 列表展示
																$scope.relatedTransLayer(obj.data);//关联交易 弹窗展示
															}
														}
													}
												];
											},
										},
										{
											field: 'pricipal',
											title: T.T('KHJ2500013'),
											width: 200,
										},
										{
											field: 'startDate',
											title: T.T('KHH2500076'),
											width: 165,
										},
										{
											field: 'endDate',
											title: T.T('KHH2500077'),
											width: 123,
										},
										{
											field: 'interestDays',
											title: T.T('KHH2500078'),
											width: 112,
										},
										{
											field: 'interest',
											title: T.T('KHH2500079'),
											width: 112,
										},
									]
								],
								done: function() {
									tableChild.render(this);
								}
							});
							table.on('tool(myTable)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
								console.log(obj);
								if (obj.event === 'edit') {
									//						        alert("edit");
								} else if (obj.event === 'del') {
									//						          alert("del");
								}
							})
						})
                    }
                } else {
					$scope.isShowRelation = true; //交易历史列表
					$scope.isShowOccurrChain = true; //结息明细查询
					$scope.isShowOccurrAmountChain = false; //发生额节点信息
					$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
					$scope.isShowInterestCalculationDetailsTable = false; //计息过程
					$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
				}
			});
		};
		// 计息过程
		$scope.interestCalculationDetailsTable = {
			checkType: 'radio',
			params: {
				"pageSize": 10,
				"indexNo": 0,
				"eventNo": 'BSS.IQ.01.0080'
			},
			paging: true,
			resource: 'accBscInf.queryInterestCalculationDetailsTable',
			autoQuery: false,
			callback: function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowRelation = true; //交易历史列表
					$scope.isShowOccurrChain = true; //结息明细查询
					$scope.isShowOccurrAmountChain = false; //发生额节点信息
					$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
					$scope.isShowInterestCalculationDetailsTable = true; //计息过程
					$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
					if (data.returnData == "" || data.returnData == undefined) {
						data.returnData.rows = [];

					} else {
						if (data.returnData.rows == null || data.returnData.rows == undefined || data.returnData.rows == 'null' ||
							data.returnData.rows == '' || data.returnData.rows.length == 0) {
							data.returnData.rows = [];
						}
					}
				}
			}
		};
		$scope.interestCalculationDetailsTableHand = function(params) {
			// 计息过程
			jfRest.request('accBscInf', 'queryInterestCalculationDetailsTable', params).then(function(data) {
				if (data.returnCode == '000000') { //客户存在
					$scope.isShowRelation = true; //交易历史列表
					$scope.isShowOccurrChain = true; //结息明细查询
					$scope.isShowOccurrAmountChain = false; //发生额节点信息
					$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
					$scope.isShowInterestCalculationDetailsTable = true; //计息过程
					$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
					$scope.isShowSegmentDetail = false; //分段详情
					if (data.returnData == "" || data.returnData == undefined) {
						$scope.interestCalculationDetailsTableList = [];
					} else {
						if (data.returnData.interestProcessBeanList.length == 0) {
							$scope.interestCalculationDetailsTableList = [];

						} else {
							$scope.interestCalculationDetailsTableList = data.returnData.interestProcessBeanList;
						}
					}
				}
			});
		};
		//分段详情
		$scope.segmenteDetails = function(item) {
			$scope.itemInfo = item;
			$scope.segmentDetailList = $scope.itemInfo.list;
			$scope.isShowRelation = true; //交易历史列表
			$scope.isShowOccurrChain = true; //结息明细查询
			$scope.isShowOccurrAmountChain = false; //发生额节点信息
			$scope.isShowRelatedPartyTransactions = false; //发生额关联交易
			$scope.isShowInterestCalculationDetailsTable = true; //计息过程
			$scope.isShowRelatedIntLoan = false; //关联利息贷调交易
			$scope.isShowSegmentDetail = true; //分段详情
		};
		//发生额详情
		$scope.occureBalanceDetails = function(e) {
			if (!$scope.settlementTreeTableChenked) {
				jfLayer.alert(T.T('F00126'));
            }
            if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            $scope.occurrChainParmasObj = {
				currencyCode: $scope.settlementTreeTableChenked.currencyCode,
			};
			$scope.itemPrams = $.extend($scope.occurrChainParmasObj, e);
			$scope.modal('/cstSvc/interestQuery/layerOccurDetai.html', $scope.itemPrams, {
				title: T.T('KHH2500088'),
				buttons: [T.T('F00012')],
				size: ['1000px', '420px'],
				callbacks: []
			});
		};
		//关联交易      列表类型
		$scope.relatedTrans2 = function(e) {
			if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            $scope.relatedParamsObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode, // 余额单元代码
				interestStartDate: e.interestStartDate, // 起息日期 yyyy-MM-dd
				nodeTyp: e.nodeTyp // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
			};
			$scope.relatedPartyTransactionsTable.params = $.extend($scope.relatedPartyTransactionsTable.params, $scope.relatedParamsObj);
			$scope.relatedPartyTransactionsTable.search();
		};
		//关联交易 弹窗类型
		$scope.relatedTransLayer = function(e) {
			if ($scope.interestSearch.idType) {
				e.idType = $scope.interestSearch.idType;
				e.idNumber = $scope.interestSearch.idNumber;
            }
            if ($scope.interestSearch.externalIdentificationNo) {
				e.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
            }
            $scope.relatedParamsObj = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				balanceUnitCode: e.balanceUnitCode, // 余额单元代码
				interestStartDate: e.interestStartDate, // 起息日期 yyyy-MM-dd
				nodeTyp: e.nodeTyp // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
			};
			$scope.itemInfo = e;
			$scope
			.modal(
				'/cstSvc/interestQuery/relatedTransLayer.html',
				$scope.itemInfo, {
					title: T.T('KHJ2500015'),
					buttons: [T.T('F00012')],
					size: ['1000px', '420px'],
					callbacks: []
				});
		};
	});
	//结息明细
	webApp.controller('layerInerDetailCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
	});
	//分段明细
	webApp.controller('segmenteDetailCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
	});
	//发生额详情
	webApp.controller('layerOccurDetaiCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,$timeout,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
		//`node_typ` '节点类别 DR-借方节点  CR-贷方节点（包括还款）PY(还款) RV (还款还原)',
		 $scope.itemInfo = $scope.itemPrams;
		$scope.nodeTypArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_nodeType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"codes", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        desc:'detailDesc',
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.vwnodeTyp = $scope.itemInfo.nodeTyp;
		        	$timeout(function() {
	            		Tansun.plugins.render('select');
					});
		        }
	};
		//发生额详情
		jfRest.request('accBscInf', 'queryOccurrChainAmount', $scope.itemPrams).then(function(data) {
			if (data.returnCode == '000000') { //客户存在
				$scope.itemInfo = data.returnData.rows[0];
				$scope.nodeTypArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_nodeType",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"codes", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        desc:'detailDesc',
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.vwnodeTyp = $scope.itemInfo.nodeTyp;
				        	$timeout(function() {
			            		Tansun.plugins.render('select');
							});
				        }
			};
			} 
		});
	});
	//
	webApp.controller('finaciTransDetailInfoHistCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
	});
	//关联交易
	webApp.controller('relatedTransLayerCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal,
		$rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
		//关联交易
		$scope.relatedPartyTransactionsTable = {
				checkType: 'radio',
				params: {
					"pageSize": 10,
					"indexNo": 0,
					idType: $scope.itemInfo.idType,
					idNumber: $scope.itemInfo.idNumber,
					externalIdentificationNo: $scope.itemInfo.externalIdentificationNo,
					balanceUnitCode: $scope.itemInfo.balanceUnitCode, // 余额单元代码
					interestStartDate: $scope.itemInfo.interestStartDate, // 起息日期 yyyy-MM-dd
					nodeTyp: $scope.itemInfo.nodeTyp, // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
					serialNumber : $scope.itemInfo.serialNo 
				},
				paging: true,
				resource: 'accBscInf.queryRelatedPartyTransactions',
				callback: function(data) {
				}
			}
	});
	//查看弹窗
	webApp.controller('transDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
		$('#returnedPurchaseId').removeAttr('disabled');
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
		$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				if( data.returnData){
					$scope.disputeFlagInfo = data.returnData.disputeFlag; 
				}
			}
		});
		//获得查询客户的系统单元，非登录用户
		$scope.getCustSystemUnitNo =  function(){
			$scope.custSystemUnitNo = '';
			$scope.custParams = {
				idType: $scope.transDetailInfo.idType,
				idNumber : $scope.transDetailInfo.idNumber,
				externalIdentificationNo :$scope.transDetailInfo.externalIdentificationNo,
			};
			jfRest.request('cstInfQuery', 'queryInf', $scope.custParams).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.custSystemUnitNo = data.returnData.rows[0].systemUnitNo;
					$scope.queryTransDate($scope.custSystemUnitNo);//将下一处理时间赋值交易时间
                }
            });
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryTransDate =function(systemUnitNo){
			$scope.ecommTransDate = "";
			$scope.params = {
					systemUnitNo : systemUnitNo	
				}; //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.ecommTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.getCustSystemUnitNo();//获取下一处理日作为交易时间
		// 退货
		$scope.returnedPurchase = function(e) {
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
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : $scope.ecommTransDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					//$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//部分退货按钮
		$scope.partReturnedPurchase = function(e){
			$scope.e = e;
			$scope.modal('/cstSvc/txnInfEnqr/layerPartReturned.html',
					$scope.e, {
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
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//争议登记
		$scope.disputeRegist = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommOrigTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo
			};
			jfRest.request('finacialTrans', 'disputeRegist', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			//$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800013'));
				}
			});
		};
		//交易分期
		$scope.transStageDetail = function(event){
			$scope.params=$scope.transDetailInfo;
			$scope.stageInf = $.parseJSON(JSON.stringify(event));
			$scope.items = {
					idType: $scope.stageInf.idType,
					idNumber: $scope.stageInf.idNumber,
					externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
					accountId: $scope.stageInf.accountId,
					balanceObjectCode: $scope.stageInf.balanceObjectCode,
					postingCurrencyCode: $scope.stageInf.postingCurrencyCode,
					occurrDate: $scope.stageInf.occurrDate,
					postingAmount: $scope.stageInf.postingAmount,
					customerNo:$scope.stageInf.customerNo,
					businessTypeCode: $scope.stageInf.businessTypeCode,
					ecommOrigGlobalSerialNumbr : $scope.stageInf.globalSerialNumbr,
			};
			//获取可分期金额
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.items).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/txnInfEnqr/transactionDetail/layerTradeStage1.html',$scope.params, {
						title : T.T('KHJ1800014'),
						buttons : [T.T('F00012') ],
						size : [ '1100px', '550px' ],
						callbacks : []
					});
				}
			});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					//$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800019'));
				} 
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank = function(e){
			$scope.params = {
					"idType" : e.idType,
					"idNumber" : e.idNumber,
					"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			//$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800020'));
				} 
			});
		};
		//争议账户查询 弹窗
		$scope.disputeAccQuery = function(e){
			$scope.disputeItem = $.parseJSON(JSON.stringify(e));
			$scope.modal('/cstSvc/txnInfEnqr/transDisputeAccDetail.html',$scope.disputeItem, {
				title : T.T('KHJ1800024'),
				buttons : [  T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : []
			});
		};
		//分期账户信息查询
		$scope.stagingAccInfoBtn = function(event){
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			console.log($scope.itemDetailInf);
			$scope.paramsInstal = {
				oldGlobalSerialNumbr:$scope.itemDetailInf.globalSerialNumbr,
				externalIdentificationNo:$scope.itemDetailInf.externalIdentificationNo
			 };
 			jfRest.request('instalments','query',$scope.paramsInstal).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/txnInfEnqr/transInstalQuery.html', $scope.itemDetailInf, {
						title : T.T('KHJ4600001'),//'信贷交易账户明细'
						buttons : [T.T('F00012')],//'关闭' 
						size : [ '1050px', '520px' ],
						callbacks : [ ]
					});
				}
 			});
		};
	});
	//关联交易查询  弹窗
	webApp.controller('relatedInforCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
			$translate.use($scope.lang);
			$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
			$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
			$translate.refresh();
			$scope.globalNum = false;
			$scope.balanceObjectFlag = false;
			$scope.dataFlag = false;
			if($scope.balUnitPostingParams.globalSerialNumbrRelative != "" && $scope.balUnitPostingParams.globalSerialNumbrRelative != undefined && $scope.balUnitPostingParams.globalSerialNumbrRelative != null) {
				$scope.globalNum = true;
				$scope.balanceObjectFlag = false;
				$scope.dataFlag = false;
				$scope.balUnitInfoTable = {
						params : {
							"idType" : $scope.balUnitPostingParams.idType,
							"idNumber" : $scope.balUnitPostingParams.idNumber,
							"externalIdentificationNo" : $scope.balUnitPostingParams.externalIdentificationNo,
							"globalSerialNumbr" : $scope.balUnitPostingParams.globalSerialNumbr,
							"accountId" : $scope.balUnitPostingParams.accountId,
							"currencyCode" : $scope.balUnitPostingParams.currencyCode,
							"logLevel" : "B",
							"queryType" : "4",
							"balanceType":$scope.balUnitPostingParams.balanceType,
							"globalSerialNumbrRelative":$scope.balUnitPostingParams.globalSerialNumbrRelative
						},
						paging : true,
						resource : 'finacialTrans.interestRelatedTrans',
						autoQuery : true,
						isTrans: true,//是否需要翻译数据字典
						transParams : ['dic_balanceType'],//查找数据字典所需参数
						transDict : ['balanceType_balanceTypeDesc'],//翻译前后key
						callback : function(data) {
						}
					};
			}else {
				$scope.globalNum = false;
				$scope.balanceObjectFlag = false;
				$scope.dataFlag = false;
				if(($scope.balUnitPostingParams.oriBalanceUnitCode != null && $scope.balUnitPostingParams.oriBalanceUnitCode != "" && $scope.balUnitPostingParams.oriBalanceUnitCode != undefined) && 
						($scope.balUnitPostingParams.oriIntSettleDate != null && $scope.balUnitPostingParams.oriIntSettleDate != "" && $scope.balUnitPostingParams.oriIntSettleDate != undefined)) {
					$scope.dataInfo = {};
					$scope.dataInfo.balanceUnitCode = $scope.balUnitPostingParams.oriBalanceUnitCode;
					$scope.dataInfo.occurrDate = $scope.balUnitPostingParams.oriIntSettleDate;
					$scope.dataInfo.nodeType = 'BI';
					$scope.dataInfo.accountId = $scope.balUnitPostingParams.accountId;
					$scope.dataInfo.currencyCode = $scope.balUnitPostingParams.currencyCode;
					jfRest.request('occurrAmtTrans', 'queryInterestCtrlChain', $scope.dataInfo).then(function(data) {
						if (data.returnCode == '000000') {
							if(data.returnData) {
								$scope.dataFlag = true;
								$scope.balanceObjectFlag = false;
								$scope.dataInfoObj = {};
								$scope.dataInfoObj = data.returnData.rows[0];
							}else {
								$scope.dataFlag = false;
								$scope.balanceObjectFlag = true;
								$scope.dataInfoObj = {};
								$scope.balInfoTable = {
										params : {
											"idType" : $scope.balUnitPostingParams.idType,
											"idNumber" : $scope.balUnitPostingParams.idNumber,
											"externalIdentificationNo" : $scope.balUnitPostingParams.externalIdentificationNo,
											"balanceUnitCode" : $scope.balUnitPostingParams.oriBalanceUnitCode,
											"postingDate" : $scope.balUnitPostingParams.occurrDate,
											"billingEndDate" : ''
										},
										paging : true,
										resource : 'occurrAmtTrans.queryBla',
										autoQuery : true,
										isTrans: true,//是否需要翻译数据字典
										transParams : ['dic_balanceType'],//查找数据字典所需参数
										transDict : ['balanceType_balanceTypeDesc'],//翻译前后key
										callback : function(data) {
										}
									};
							}
						}
					});
				}
			};
			//关联交易详细信息
			$scope.queryBalInfo = function(dataEvent){
				$scope.dataInfoEvent = $.parseJSON(JSON.stringify(dataEvent));
				$scope.balanceObjectFlag = true;
				$scope.balInfoTable = {
						params : {
							"idType" : $scope.balUnitPostingParams.idType,
							"idNumber" : $scope.balUnitPostingParams.idNumber,
							"externalIdentificationNo" : $scope.balUnitPostingParams.externalIdentificationNo,
							"balanceUnitCode" : $scope.dataInfoEvent.balanceUnitCode,
							"postingDate" : $scope.balUnitPostingParams.occurrDate,
							"billingEndDate" : $scope.dataInfoEvent.billingEndDate
						},
						paging : true,
						resource : 'occurrAmtTrans.queryBla',
						autoQuery : true,
						isTrans: true,//是否需要翻译数据字典
						transParams : ['dic_balanceType'],//查找数据字典所需参数
						transDict : ['balanceType_balanceTypeDesc'],//翻译前后key
						callback : function(data) {
						}
					};
			}
			// 页面弹出框事件(弹出页面)
			$scope.checkInfo = function(event) {
				$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
				$scope.transDetailInfo.idType = $scope.interestSearch.idType;
				$scope.transDetailInfo.idNumber = $scope.interestSearch.idNumber;
				$scope.transDetailInfo.externalIdentificationNo = $scope.interestSearch.externalIdentificationNo;
				$scope.modal('/cstSvc/txnInfEnqr/viewTransactionDetails.html',//关联交易详情信息弹窗
					$scope.transDetailInfo, {
						title : T.T('KHJ1800003'),
						buttons : [ T.T('F00012') ],
						size : [ '1000px', '660px' ],
						callbacks : []
					});
			};
	});
	//关联交易详情信息弹窗
	webApp.controller('viewTransactionDetailsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
	});
	//部分退货金额
	webApp.controller('layerPartReturnedCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
		$scope.partReturnedInf = $scope.e;
	});
	//2020/4/26  交易分期 
	webApp.controller('layerTradeStage1Ctrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingInfo =$scope.params;
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
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				queryType:"stage",
				 stageType:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
			}
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.stagingParams = {};
			$scope.stagingParams.eventNo = $scope.itemList.checkedList().eventNo;//事件号
			$scope.stagingParams.ecommTransPostingAmount = $scope.stagingInfo.transAmount;//分期金额
			$scope.stagingParams.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingParams.currBillFlag = '1'; 
			$scope.stagingParams.ecommSourceCde = 'L';
			$scope.stagingParams.postingAmount = $scope.stagingInfo.postingAmount;//入账金额
			$scope.stagingParams.ecommTransPostingCurr = $scope.stagingInfo.transCurrCde;
			$scope.stagingParams.ecommProdObjId = $scope.stagingInfo.productObjectCode;//产品对象代码
			$scope.stagingParams.ecommCustId = $scope.stagingInfo.customerNo;//客户号码
			$scope.stagingParams.ecommPostingAcctNmbr = $scope.stagingInfo.accountId;////账户号
			$scope.stagingParams.ecommBusineseType = $scope.stagingInfo.businessTypeCode;//业务类型
		    $scope.stagingParams.installmentAmount= $scope.stagingInfo.installmentAmount;//已分期金额
			$scope.stagingParams.transState = $scope.stagingInfo.transState;
			$scope.stagingParams.ecommOrigGlobalSerialNumbr = $scope.stagingInfo.globalSerialNumbr;
			$scope.stagingParams.ecommInstallmentPeriod = $scope.stagingInfo.ecommInstallmentPeriod;//分期期数
		    $scope.stagingParams.ecommFeeCollectType = $scope.stagingInfo.ecommFeeCollectType;//费用收取方式
			$scope.stagingParams.ecommInstallmentBusinessType = $scope.stagingInfo.ecommInstallmentBusinessType;//分期业务类型
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingParams,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//交易分期试算弹框
		$scope.trialByStagesInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.params = $scope.stagingInfo;
			$scope.params.eventNo = $scope.itemList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
			$scope.params.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;
			$scope.params.ecommTransAmount=$scope.stagingInfo.transAmount;
			if(!$scope.itemList.validCheck()){
				return;
            }
            if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/cstSvc/txnInfEnqr/transactionDetail/stagingRoundsDetail.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
	});
});
