'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('financeQueryCtr',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfoTrans = false;
		$scope.cardListDiv = false;
		$scope.transByCardDiv = false;
		$scope.topParams = {};
		//日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#LAY_demorange_zs',
				//min:"2019-03-01",
				done: function(value, date) {
					endDate.config.min = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					endDate.config.start = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
				}
			});
			var endDate = laydate.render({
				elem: '#LAY_demorange_ze',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
		//日期控件end
		//重置
		$scope.reset = function() {
			$scope.externalIdentificationNo = '';
			$scope.idNumber = '';
			$scope.startDate = '';
			$scope.endDate = '';
			$scope.resultInfoTrans = false;
			$scope.cardListDiv = false;
			$scope.transByCardDiv = false;
		};
		//公务卡交易信息======根据外部识别号查询
//		$scope.busCardTransTable = {
//			params: {
//				"activityNo": "X8010",
//				"logLevel": "A",
//				"transProperty": "O"
//			},
//			paging: false,
//			resource: 'billManages.queryFinance',
//			autoQuery: false,
//			callback: function(data) {
//				if (data.returnCode == '000000') {
//					if (!data.returnData.rows || data.returnData.rows.length == 0) {
//						data.returnData.rows = [];
//					}
//					$scope.resultInfoTrans = true;
//					$scope.cardListDiv = false;
//					$scope.transByCardDiv = false;
//				} else {
//					$scope.resultInfoTrans = false;
//					$scope.cardListDiv = false;
//					$scope.transByCardDiv = false;
//				}
//			}
//		};
		//公务卡列表信息======根据预算单位编码查询
		$scope.busCardIdNumTable = {
			params: {
				"activityNo": "X8010",
				"logLevel": "A",
				"transProperty": "O",
				"pageSize": 10,
				"indexNo": 0,
			},
			paging: true,
			resource: 'billManages.queryNum',
			autoQuery: false,
			isTrans: true,
			transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
			transDict: ['idType_idTypeDesc','invalidFlag_invalidFlagDesc'],
			callback: function(data) {
				if (data.returnCode == '000000') {
					if (!data.returnData.rows || data.returnData.rows.length == 0) {
						data.returnData.rows = [];
					}
					$scope.cardListDiv = true;
					$scope.resultInfoTrans = false;
					$scope.transByCardDiv = false;
				} else {
					$scope.resultInfoTrans = false;
					$scope.cardListDiv = false;
					$scope.transByCardDiv = false;
				}
			}
		};
		//查询事件
		$scope.selectList = function() {
			$scope.endDate = $("#LAY_demorange_ze").val();
			$scope.startDate = $("#LAY_demorange_zs").val();
			if (($scope.externalIdentificationNo == '' || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo ==
					null) && ($scope.idNumber == '' || $scope.idNumber == undefined || $scope.idNumber == null)) {
				jfLayer.fail(T.T('F00076')); //'请输入查询条件进行查询！');
				$scope.resultInfoTrans = false;
				$scope.cardListDiv = false;
			} else {
				if (($scope.externalIdentificationNo)) {
                    $scope.queryMainBusCardTrans();
				} else if ($scope.idNumber && ($scope.externalIdentificationNo == '' || $scope.externalIdentificationNo == undefined || $scope
                    .externalIdentificationNo == null)) {
					$scope.busCardIdNumTable.params.idNumber = $scope.idNumber;
					$scope.busCardIdNumTable.params.idType = '7';
					$scope.busCardIdNumTable.params.startDate = $("#LAY_demorange_zs").val();
					$scope.busCardIdNumTable.params.endDate = $("#LAY_demorange_ze").val();
					$scope.busCardIdNumTable.search();
				}
			}
		};
		//根据外部识别号查询公务卡交易信息
		$scope.pageCount = 0;
		$scope.pageNumBus = 1;
		$scope.pageSizeBus = 10;
		$scope.queryMainBusCardTrans = function(){
		    layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#busCardTransTable',
		            tree: {},
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
		                {field: 'externalIdentificationNum', title: T.T('F00111'),width:200},
		                {field: 'transDate', title: T.T('GWH500004')},
		                {field: 'transAmount', title: T.T('GWH500005'),width:60},
		                {field: 'transCurrCde', title: T.T('GWH500006'),width:60},
		                {field: 'transDesc', title: T.T('GWH500007'),width:260},
		                {field: 'reimburseStatusDesc', title: T.T('GWH500008')},
		                {field: 'merchantCde', title: T.T('GWH500009')},
		                {field:'haveChild',align: 'center',  title: T.T('F00017'),templet: function(d){
		                	if(d.haveChild == true){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="viewBusCardTrans">'+T.T("F00009")+'</a>'+
		                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="reimburse">'+T.T("GWH500008")+'</a>';
		                	}else if(d.haveChild == false){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs"  lay-event="viewBusCardTrans">'+T.T("F00009")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="reimburse">'+T.T("GWH500008")+'</a>';
		                	}
		                },}//toolbar templet: '#transHandle',
		            ],
//		            style: 'max-height:200px',
		            reqData: function (data1, callback) {
                        setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.paramsAcc = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
		    					externalIdentificationNo:$scope.externalIdentificationNo,
		    					accFlag : "mainAcc",
		    					globalSerialNumbr : data1.globalSerialNumbr,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
		    					queryType : '2',
		    					eventNo: data1.eventNo
	                		};
                            jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.paramsAcc).then(function(data) {
                				if(data.returnCode == '000000'){
                					$scope.resultInfoTrans = true;
                					if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
                						angular.forEach(data.returnData.rows,function(item,i){
                							item.haveChild = false;
                                            item.mediaUnitCode = data.returnData.mediaUnitCode;
                                            if(item.externalIdentificationNo == null){
            									item.externalIdentificationNum = item.accountId;
	            							}else if(item.externalIdentificationNo != ''){
	            								item.externalIdentificationNum = item.externalIdentificationNo;
	            							}else if(item.externalIdentificationNo == '0000000000000000000'){
	            								item.externalIdentificationNum = item.accountId;
                                            }
                                            if(item.reimburseStatus == 'Y'){
                								item.reimburseStatusDesc = T.T('GWH500010');
                							}else if(item.reimburseStatus == 'N' ||  item.reimburseStatus == '' || item.reimburseStatus == null){
                								item.reimburseStatusDesc = T.T('GWH500011');
                                            }
                                        });
            							callback(data.returnData.rows);
                					}else {
                						$scope.rows = [];
            							callback($scope.rows);
                					}

                				}else {
                					$scope.resultInfoTrans = false;
                                }
                            });
		            	}else {//查主账户
		            		$scope.paramsMain = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
                                externalIdentificationNo:$scope.externalIdentificationNo,
		    					endDate : $scope.endDate,
		    					startDate : $scope.startDate,
		    					pageNum: $scope.pageNumBus,
		    			        pageSize: $scope.pageSizeBus
	                		};
                            jfRest.request('billManages', 'queryFinance', $scope.paramsMain).then(function(data) {
                				if(data.returnCode == '000000'){
                					$scope.resultInfoTrans = true;
                					if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
                						$scope.pageCount = data.returnData.totalCount;
            							pageInit($scope.pageCount,"pageBusCardTrans");//初始化分页
            							angular.forEach(data.returnData.rows,function(item,i){
            								item.haveChild = true;
            								item.mediaUnitCode = data.returnData.mediaUnitCode;
            								if(item.externalIdentificationNo == null){
            									item.externalIdentificationNum = item.accountId;
	            							}else if(item.externalIdentificationNo != ''){
	            								item.externalIdentificationNum = item.externalIdentificationNo;
	            							}else if(item.externalIdentificationNo == '0000000000000000000'){
	            								item.externalIdentificationNum = item.accountId;
                                            }
                                            if(item.reimburseStatus == 'Y'){
                								item.reimburseStatusDesc = T.T('GWH500010');
                							}else if(item.reimburseStatus == 'N' ||  item.reimburseStatus == '' || item.reimburseStatus == null){
                								item.reimburseStatusDesc = T.T('GWH500011');
                                            }
                                        });
            							callback(data.returnData.rows);
            							layui.use(['laypage', 'layer'], function(){
    					                      var laypage = layui.laypage;
    					                      laypage.render({
    					                            elem: 'pageBusCardTrans',
    					                            count: $scope.pageCount,
    					                            limit: $scope.pageSizeBus,
    					                            curr: $scope.pageNumBus,
    					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
    					                            jump: function(obj,first){
    					                             if (!first) {
    					                              $scope.pageNumBus = obj.curr;
    					                              $scope.pageSizeBus = obj.limit;
    					                              $scope.queryMainBusCardTrans();
    					                             }
    					                            }
    					                        });
    					                    });
                					}else {
                						$scope.rows = [];
            							callback($scope.rows);
            							$scope.pageCount = 0;
            							pageInit($scope.pageCount,"pageBusCardTrans");//初始化分页
                					}
                				}else {
                					$scope.resultInfoTrans = false;
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		        });
		        treeTable.on('tool(busCardTransTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'viewBusCardTrans') {
		                $scope.viewBusCardTrans(obj.data);
		            } else if (event == 'reimburse') {
		                $scope.reimburse(obj.data);
                    }
                });
		    });
		};

		//根据预算单位编码查询公务卡列表---查询公务卡交易信息
		$scope.pageCount = 0;
		$scope.pageNumUint = 1;
		$scope.pageSizeUint = 10;
		$scope.queryTransByUintList = function(paramsQuery){
		    layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#transByUintList',
		            tree: {},
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
		                {field: 'externalIdentificationNum', title: T.T('F00111'),width:200},
		                {field: 'transDate', title: T.T('GWH500004')},
		                {field: 'transAmount', title: T.T('GWH500005'),width:60},
		                {field: 'transCurrCde', title: T.T('GWH500006'),width:60},
		                {field: 'transDesc', title: T.T('GWH500007'),width:260},
		                {field: 'reimburseStatusDesc', title: T.T('GWH500008')},
		                {field: 'merchantCde', title: T.T('GWH500009')},
		                {field:'haveChild',align: 'center',  title: T.T('F00017'),templet: function(d){
		                	if(d.haveChild == true){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="viewBusCardTransByUint">'+T.T("F00009")+'</a>'+
		                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="reimburse">'+T.T("GWH500008")+'</a>';
		                	}else if(d.haveChild == false){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs"  lay-event="viewBusCardTransByUint">'+T.T("F00009")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="reimburse">'+T.T("GWH500008")+'</a>';
		                	}
		                },}//toolbar templet: '#transHandle',
		            ],
//		            style: 'max-height:200px',
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.paramsAcc1 = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
		    					externalIdentificationNo:paramsQuery.externalIdentificationNo,
                                mediaUnitCode:paramsQuery.mediaUnitCode,
                                accFlag : "mainAcc",
		    					globalSerialNumbr : data1.globalSerialNumbr,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
		    					queryType : '2',
		    					eventNo: data1.eventNo
	                		};
		            		jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.paramsAcc1).then(function(data) {
                				if(data.returnCode == '000000'){
                					$scope.transByCardDiv = true;
                					if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
                						angular.forEach(data.returnData.rows,function(item,i){
                							item.haveChild = false;
                                            //item.mediaUnitCode = data.returnData.mediaUnitCode;
                                            if(item.externalIdentificationNo == null){
            									item.externalIdentificationNum = item.accountId;
	            							}else if(item.externalIdentificationNo != ''){
	            								item.externalIdentificationNum = item.externalIdentificationNo;
	            							}else if(item.externalIdentificationNo == '0000000000000000000'){
	            								item.externalIdentificationNum = item.accountId;
                                            }
                                            if(item.reimburseStatus == 'Y'){
                								item.reimburseStatusDesc = T.T('GWH500010');
                							}else if(item.reimburseStatus == 'N' ||  item.reimburseStatus == '' || item.reimburseStatus == null){
                								item.reimburseStatusDesc = T.T('GWH500011');
                                            }
                                        });
            							callback(data.returnData.rows);
                					}else {
                						$scope.rows = [];
            							callback($scope.rows);
                					}

                				}else {
                					$scope.transByCardDiv = false;
                                }
                            });
		            	}else {//查主账户
		            		$scope.paramsMainUint = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
		    					externalIdentificationNo:paramsQuery.externalIdentificationNo,
                                mediaUnitCode:paramsQuery.mediaUnitCode,
                                endDate : $scope.endDate,
		    					startDate : $scope.startDate,
		    					pageNum: $scope.pageNumUint,
		    			        pageSize: $scope.pageSizeUint
	                		};
		            		jfRest.request('finacialTrans', 'query', $scope.paramsMainUint).then(function(data) {
                				if(data.returnCode == '000000'){
                					$scope.transByCardDiv = true;
                                    if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
                						$scope.pageCount = data.returnData.totalCount;
            							pageInit($scope.pageCount,"pageTransByUint");//初始化分页
            							angular.forEach(data.returnData.rows,function(item,i){
            								item.haveChild = true;
                                            item.mediaUnitCode = data.returnData.mediaUnitCode;
                                            if(item.externalIdentificationNo == null){
            									item.externalIdentificationNum = item.accountId;
	            							}else if(item.externalIdentificationNo != ''){
	            								item.externalIdentificationNum = item.externalIdentificationNo;
	            							}else if(item.externalIdentificationNo == '0000000000000000000'){
	            								item.externalIdentificationNum = item.accountId;
                                            }
                                            if(item.reimburseStatus == 'Y'){
                								item.reimburseStatusDesc = T.T('GWH500010');
                							}else if(item.reimburseStatus == 'N' ||  item.reimburseStatus == '' || item.reimburseStatus == null){
                								item.reimburseStatusDesc = T.T('GWH500011');
                                            }
                                        });
            							callback(data.returnData.rows);
            							layui.use(['laypage', 'layer'], function(){
    					                      var laypage = layui.laypage;
    					                      laypage.render({
    					                            elem: 'pageTransByUint',
    					                            count: $scope.pageCount,
    					                            limit: $scope.pageSizeUint,
    					                            curr: $scope.pageNumUint,
    					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
    					                            jump: function(obj,first){
    					                             if (!first) {
    					                              $scope.pageNumBus = obj.curr;
    					                              $scope.pageSizeBus = obj.limit;
    					                              $scope.queryTransByUintList();
    					                             }
    					                            }
    					                        });
    					                    });
                					}else {
                						$scope.rows = [];
            							callback($scope.rows);
            							$scope.pageCount = 0;
            							pageInit($scope.pageCount,"pageTransByUint");//初始化分页
                					}
                				}else {
                					$scope.transByCardDiv = false;
                					$scope.rows = [];
        							callback($scope.rows);
        							$scope.pageCount = 0;
        							pageInit($scope.pageCount,"pageTransByUint");//初始化分页
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		        });
		        treeTable.on('tool(transByUintList)', function (obj) {
                    var event = obj.event;
		            if (event == 'viewBusCardTransByUint') {
		                $scope.viewBusCardTransByUint(obj.data);
		            } else if (event == 'reimburse') {
		                $scope.reimburse(obj.data);
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
        // 页面弹出框事件(弹出页面)
		$scope.viewBusCardTrans = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo.excard = 1;
			$scope.modal('/businessCard/billManage/finaciDetailInfo.html', $scope.transDetailInfo, {
				title: T.T('GWH500003'), //'公务卡交易信息详情',
				buttons: [T.T('F00012')],
				size: ['1000px', '660px'],
				callbacks: []
			});
		};
		//预算单位-公务卡-详情
		$scope.viewBusCardTransByUint = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo.uint = 1;
			$scope.modal('/businessCard/billManage/finaciDetailInfo.html',$scope.transDetailInfo, {
				title : T.T('GWH500003'),   //'公务卡交易信息详情',
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
		};
		//报销
		$scope.reimburse = function(item) {
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(item));
			if ($scope.item.reimburseStatus == null || $scope.item.reimburseStatus == undefined || $scope.item.reimburseStatus ==
				"") {
				$scope.item.reimburseStatus = 'N';
            }
            jfRest.request('billManages', 'reimburseBtn', $scope.item).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.selectList();//报销成功后走查询按钮事件
					jfLayer.success(T.T('GWJ500001')); //'报销成功！');
				}
			});
		};
		//预算编码里的查询事件
//		$scope.queryTransByUintList = {
//			checkType: '',
//			params: {
//				'activityNo': 'X8010',
//				'pageSize': '10',
//				'indexNo': '0',
//				'logLevel': 'A',
//				'transProperty': 'O'
//			}, // 表格查询时的参数信息
//			paging: false, // 默认true,是否分页
//			resource: 'finacialTrans.query', // 列表的资源
//			autoQuery: false,
//			callback: function(data) { // 表格查询后的回调函数
//				 if(data.returnCode == '000000'){
//            		 $scope.transByCardDiv = true;
//            	 }else {
//            		 $scope.transByCardDiv = false;
//            	 };
//			}
//		};
		//点击公务卡列表查询按钮
//		$scope.checkElmInfo = function(item) {
//			$scope.queryTransByUintList.params.externalIdentificationNo = angular.fromJson(item).externalIdentificationNo;
//			$scope.queryTransByUintList.params.startDate = $("#LAY_demorange_zs").val(); //用预算编码查询出的表格里 再点查询传开始日期
//			$scope.queryTransByUintList.params.endDate = $("#LAY_demorange_ze").val(); //用预算编码查询出的表格里 再点查询传结束日期
//			$scope.queryTransByUintList.search();
//			$scope.queryTransByUintList
//		};
	});
	webApp.controller('finaciDetailInfoCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.ectypeArray = [{
			name: T.T('GWJ500003'),
			id: '0'
		}, {
			name: T.T('GWJ500004'),
			id: '1'
		}];
		// 退货
		$scope.returnedPurchase = function(e) {
			var url;
			if (e.eventNo == 'ISS.PT.40.0001') {
				url = 'returnedPurchase';
			} else if (e.eventNo == 'ISS.PT.40.0002') {
				url = 'returnedPurchase2';
			} else if (e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e
				.eventNo == 'ILS.XT.00.0005' ||
				e.eventNo == 'ILS.XT.00.0006') {
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType": e.idType,
				"idNumber": e.idNumber,
				"externalIdentificationNo": e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr": e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo,
				"ecommOrigEventId": e.eventNo,
				"ecommTransCurr": e.transCurrCde,
				"ecommTransAmount": e.transAmount,
				"ecommTransDate": e.transDate,
				"ecommTransPostingCurr": e.postingCurrencyCode,
				"ecommTransPostingAmount": e.postingAmount,
				"ecommTransStatus": e.transState,
				"ecommOriTransDate": e.transDate,
				"ecommClearAmount": e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId": e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('businessManage', 'busfinacialTrans', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
/*					if($scope.transDetailInfo.excard == 1){//根据识别号
//						$scope.busCardTransTable.params.externalIdentificationNo = $scope.transDetailInfo.externalIdentificationNo;
//						$scope.busCardTransTable.search();
						$scope.queryMainBusCardTrans();
						jfLayer.success(T.T('F00054'));
					}else if($scope.transDetailInfo.uint == 1){//根据预算单位，然后识别号
//						$scope.queryTransByUintList.params.externalIdentificationNo = $scope.transDetailInfo.externalIdentificationNo;
//						$scope.queryTransByUintList.search();
						$scope.queryMainBusCardTrans();
						jfLayer.success(T.T('F00054'));
					}*/
					jfLayer.success(T.T('F00054'));
					$scope.selectList();//退货成功后走查询按钮事件
				}
			});
		};
		//部分退货按钮
		$scope.partReturnedPurchase = function(e) {
			$scope.e = e;
			$scope.modal('/businessCard/billManage/busPartReturned.html', $scope.e, {
				title: T.T('F00191'),
				buttons: [T.T('F00191'), T.T('F00012')],
				size: ['1100px', '300px'],
				callbacks: [$scope.surePartReturned]
			});
		};
		//确定部分退货
		$scope.surePartReturned = function(result) {
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
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
/*					if($scope.transDetailInfo.excard == 1){//根据识别号
//						$scope.busCardTransTable.params.externalIdentificationNo = $scope.transDetailInfo.externalIdentificationNo;
//						$scope.busCardTransTable.search();
						$scope.queryMainBusCardTrans();
						jfLayer.success(T.T('F00054'));
					}else if($scope.transDetailInfo.uint == 1){//根据预算单位，然后识别号
//						$scope.queryTransByUintList.params.externalIdentificationNo = $scope.transDetailInfo.externalIdentificationNo;
//						$scope.queryTransByUintList.search();
						$scope.queryMainBusCardTrans();
						jfLayer.success(T.T('F00054'));
					}*/
					jfLayer.success(T.T('F00054'));
					$scope.selectList();//退货成功后走查询按钮事件
				}
			});
		};
	});
	//部分退货
	webApp.controller('busPartReturnedCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.partReturnedInf = $scope.e;
	});
});
