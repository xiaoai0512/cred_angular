'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('accRepyHistEnqrCtrl', function($scope, $stateParams,$timeout,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accountHist/i18n_accRepyHistEnqr');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.hide_accRepyHistEnqr = {};
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#LAY_demorange_zs',
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
			$scope.accRepayHisTable.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#accRepyHistEnqr_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#accRepyHistEnqr_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#accRepyHistEnqr_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#accRepyHistEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#accRepyHistEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#accRepyHistEnqr_idNumber").attr("validator","id_isPermanentReside");
			};
		});
		$scope.isShowDiv = false;//还款历史列表
		$scope.isShowSameSource = false;//还款分配列表
		$scope.isShowDistributeOrder = false;//账户间分配顺序表
		$scope.isShowBalanceOrder = false;//余额单元分配顺序
		$scope.isBalTypePosting = false;  //余额类型入账情况查询列表
		$scope.isShowBalUnit = false;  //余额单元分配情况
		$scope.isShowtrad = false;  //交易级分配
		//重置
		$scope.reset = function() {
			$scope.accRepayHisTable.params.idNumber = '';
			$scope.accRepayHisTable.params.externalIdentificationNo = '';
			$scope.accRepayHisTable.params.idType= '';
			$scope.accRepayHisTable.params.customerNo= '';
			$scope.accRepayHisTable.params.startDate= '';
			$scope.accRepayHisTable.params.endDate= '';
			$scope.isShowDiv = false;//还款历史列表
			$scope.isShowSameSource = false;//还款分配列表
			$scope.isShowDistributeOrder = false;//账户间分配顺序表
			$scope.isShowBalanceOrder = false;//余额单元分配顺序
		};
		$scope.queryBalanceUnitHis = function(){
			$scope.accRepayHisTable.params.startDate = $("#LAY_demorange_zs").val();
			$scope.accRepayHisTable.params.endDate = $("#LAY_demorange_ze").val();
			 if(	($scope.accRepayHisTable.params["externalIdentificationNo"] == null || $scope.accRepayHisTable.params["externalIdentificationNo"] == undefined || $scope.accRepayHisTable.params["externalIdentificationNo"] == '') &&
					($scope.accRepayHisTable.params["idType"] == null || $scope.accRepayHisTable.params["idType"] == undefined || $scope.accRepayHisTable.params["idType"] == '') &&
        			($scope.accRepayHisTable.params["idNumber"] == null || $scope.accRepayHisTable.params["idNumber"] == undefined || $scope.accRepayHisTable.params["idNumber"] == '')
			){
			/*	$scope.accRepayHisTable.params.eventNo = "ISS.PT.20.9999";
				$scope.accRepayHisTable.params.queryType = "3";
				$scope.accRepayHisTable.search();
				$scope.isShowDiv = true;*/
				 jfLayer.alert(T.T('F00076'));//'请核对证件号码'
				$scope.isShowSameSource = false;
				$scope.isShowDiv = false;//还款历史列表
				$scope.isShowDistributeOrder = false;//账户间分配顺序表
				$scope.isShowBalanceOrder = false;//余额单元分配顺序
			}
			 else {
					if($scope.accRepayHisTable.params["idType"]){
						if($scope.accRepayHisTable.params["idNumber"] == null || $scope.accRepayHisTable.params["idNumber"] == undefined || $scope.accRepayHisTable.params["idNumber"] == ''){
							jfLayer.alert(T.T('F00110'));//'请核对证件号码'
							$scope.isShowDiv = false;
							$scope.isShowSameSource = false;
							$scope.isShowDistributeOrder = false;//账户间分配顺序表
							$scope.isShowBalanceOrder = false;//余额单元分配顺序
						}else {
							$scope.accRepayHisTable.search();
							$scope.isShowDiv = true;
							$scope.isShowSameSource = false;
						}
					}else if($scope.accRepayHisTable.params["idNumber"]){
						if($scope.accRepayHisTable.params["idType"] == null || $scope.accRepayHisTable.params["idType"] == undefined || $scope.accRepayHisTable.params["idType"] == ''){
							jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
							$scope.isShowDiv = false;
							$scope.isShowSameSource = false;
							$scope.isShowDistributeOrder = false;//账户间分配顺序表
							$scope.isShowBalanceOrder = false;//余额单元分配顺序
						}else {
							$scope.accRepayHisTable.search();
						}
					}else {
						$scope.accRepayHisTable.search();
					}
				}
		}
		//账户基本信息历史列表
		$scope.accRepayHisTable = {
			params : {
				eventNo: "PT.20.9999",
				queryType: "3"
			}, // 表格查询时的参数信息
			autoQuery:false,
			paging : true,// 默认true,是否分页
			resource : 'accRepyHistEnqr.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_ecommTransStatus'],//查找数据字典所需参数
			transDict : ['transState_transStateDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShowDiv = true;//还款历史列表
					$scope.isShowSameSource = false;//
					$scope.isShowDistributeOrder = false;//账户间分配顺序表
					$scope.isShowBalanceOrder = false;//余额单元分配顺序
					$scope.hide_accRepyHistEnqr = $scope.accRepayHisTable.params;
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}else {
					$scope.isShowDiv = false;//还款历史列表
					$scope.isShowSameSource = false;//还款分配列表
					$scope.isShowDistributeOrder = false;//账户间分配顺序表
					$scope.isShowBalanceOrder = false;//余额单元分配顺序
				}
			}
		};
		//明细按钮
		$scope.viewRepayHisSameTransList = function(e){
			$scope.isShowSameSource = true;
			$scope.isShowBalanceOrder = false;//余额单元分配顺序
			$scope.isShowDistributeOrder = false;//账户间分配顺序表
			$scope.transSameSourceParams = $.parseJSON(JSON.stringify(e));
			$scope.sameSourceTransTable.params = {
				"idType" : $scope.hide_accRepyHistEnqr.idType,
				"idNumber" : $scope.hide_accRepyHistEnqr.idNumber,
				"externalIdentificationNo" : $scope.hide_accRepyHistEnqr.externalIdentificationNo,
				"globalSerialNumbr" : $scope.transSameSourceParams.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "1"
			}
			$scope.sameSourceTransTable.search();
		}
		$scope.sameSourceTransTable = {
				params : {},
				paging : true,
				resource : 'finacialTrans.query',
				autoQuery : false,
				callback : function(data) {
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}else {
						jfLayer.fail(data.returnMsg);
					}
				}
		}
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryTransDate =function(){
			$scope.params ={};
			$scope.ecommTransDate = '';
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.ecommTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		}
		$scope.queryTransDate();
		//撤销按钮
		$scope.revocation = function(item){
			$scope.params = {
				idType: $scope.hide_accRepyHistEnqr.idType,
				idNumber: $scope.hide_accRepyHistEnqr.idNumber,
				externalIdentificationNo: $scope.hide_accRepyHistEnqr.externalIdentificationNo,
				ecommEntryId:  item.externalIdentificationNo,
				ecommTransCurr:  item.transCurrCde,
				ecommTransAmount: item.transAmount,
				ecommTransPostingCurr:  item.postingCurrencyCode,
				ecommTransPostingAmount:  item.postingAmount,
//				ecommTransPostingDate:  $scope.ecommTransDate,
				ecommOrigGlobalSerialNumbr:  item.globalSerialNumbr,
				ecommTransStatus:item.transState,
				ecommOrigEventId: item.eventNo,
				ecommTransProperty: item.transProperty,
//				ecommTransDate : $scope.ecommTransDate,
				ecommOriTransDate: item.transDate,
				ecommCustId : item.customerNo,
				ecommClearAmount : item.settlementAmount,//清算金额
				ecommClearCurr : item.settlementCurrencyCode,//清算币种
				ecommOriOccurrDate : item.occurrDate,//入账日期
			};
			jfRest.request('accRepyHistEnqr', 'revocationTxn', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ1900002'));
					$timeout(function(){
						$scope.accRepayHisTable.search();
					},1500);
				}
			});
		}
		//查看按钮
		$scope.viewRepaymentHisDetail = function(e){
			$scope.accountHisDetailInfo = $.parseJSON(JSON.stringify(e));
			if($scope.hide_accRepyHistEnqr.idNumber){
				$scope.accountHisDetailInfo.idType = $scope.hide_accRepyHistEnqr.idType;
				$scope.accountHisDetailInfo.idNumber = $scope.hide_accRepyHistEnqr.idNumber;
			};
			if($scope.hide_accRepyHistEnqr.externalIdentificationNo){
				$scope.accountHisDetailInfo.externalIdentificationNo = $scope.hide_accRepyHistEnqr.externalIdentificationNo;
			};
			$scope.modal('/cstSvc/accountHist/accountHisDetail.html', $scope.accountHisDetailInfo, {
				title : T.T('KHJ1900003'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '580px' ],
				callbacks : []
			});
		};
		//账户间分配顺序按钮
		$scope.distributeOrder = function(item){
			$scope.accDistributeOrderTable.params.idType = $scope.accRepayHisTable.params.idType;
			$scope.accDistributeOrderTable.params.idNumber = $scope.accRepayHisTable.params.idNumber;
			$scope.accDistributeOrderTable.params.externalIdentificationNo = $scope.accRepayHisTable.params.externalIdentificationNo;
			$scope.accDistributeOrderTable.params.customerNo = item.customerNo;
			$scope.accDistributeOrderTable.params.ecommOriGlobalTransSerialNo = item.globalSerialNumbr;
			$scope.accDistributeOrderTable.params.operationMode = item.operationMode;
			$scope.accDistributeOrderTable.search();
			$scope.operationMode = item.operationMode;//运营模式
			$scope.isBalTypePosting = false;  //余额类型入账情况查询列表
			$scope.isShowBalUnit = false;  //余额单元分配情况
			$scope.isShowtrad = false;  //交易级分配
		};
		//账户间分配顺序
		$scope.accDistributeOrderTable = {
				params : {
					"authDataSynFlag": "1"
				},
				autoQuery : false,
				paging : true,
				resource : 'finacialTrans.accRepayAllocateOrder',
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_ctdStmtFlag','dic_balanceType'],//查找数据字典所需参数
				transDict : ['currBillFlag_currBillFlagDesc','balanceType_balanceTypeDesc'],//翻译前后key
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.isShowDiv = true;//还款历史列表
						$scope.isShowDistributeOrder = true;//账户间分配顺序表
						$scope.isShowSameSource = false;//还款分配列表
						$scope.isShowBalanceOrder = false;//余额单元分配顺序
					}else {
						$scope.isShowDiv = false;//还款历史列表
						$scope.isShowSameSource = false;//还款分配列表
						$scope.isShowDistributeOrder = false;//账户间分配顺序表
						$scope.isShowBalanceOrder = false;//还款分配列表序
					};
				}
			};
		//余额单元分配顺序
		$scope.viewBalanceOrder = function(item){
			$scope.balanceOrderTable.params.idType = $scope.accRepayHisTable.params.idType;
			$scope.balanceOrderTable.params.idNumber = $scope.accRepayHisTable.params.idNumber;
			$scope.balanceOrderTable.params.externalIdentificationNo = $scope.accRepayHisTable.params.externalIdentificationNo;
			$scope.balanceOrderTable.params.customerNo = item.customerNo;
			$scope.balanceOrderTable.params.globalSerialNumbr = item.ecommOriGlobalTransSerialNo;
			$scope.balanceOrderTable.params.accountId = item.accountId;
			$scope.balanceOrderTable.params.currencyCode = item.currencyCode;
			$scope.balanceOrderTable.params.balanceType = item.balanceType;
			$scope.balanceOrderTable.params.operationMode = $scope.operationMode;
			$scope.balanceOrderTable.params.ctdStmtFlag = item.currBillFlag;
			$scope.balanceOrderTable.params.transIdentifiNo = item.transIdentifiNo;
			$scope.balanceOrderTable.search();
		};
		$scope.balanceOrderTable = {
			params : { },
			paging : true,
			resource : 'finacialTrans.balanceUnitAllocateOrder',
			autoQuery : false,
			isTrans: true,
			transParams: ['dic_balanceType'],
			transDict: ['balanceType_balanceTypeDesc'],
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowDiv = true;//还款历史列表
					$scope.isShowDistributeOrder = true;//账户间分配顺序表
					$scope.isShowSameSource = false;//还款分配列表
					$scope.isShowBalanceOrder = true;//余额单元分配顺序表
				}else {
					$scope.isShowDiv = false;//还款历史列表
					$scope.isShowSameSource = false;//还款分配列表
					$scope.isShowDistributeOrder = false;//账户间分配顺序表
					$scope.isShowBalanceOrder = false;//余额单元分配顺序表
				};
			}
		};
		//查询主账户和子账户 111111111111111111111111111111
		$scope.pageCount = 0;
		$scope.pageNumP = 1;
		$scope.pageSizeP = 10;
		$scope.queryMainAndChildAcc = function(item){
			$scope.item = item;
			layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#repayDistributeTreeTable',
		            tree: {},
//		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
//		                {type: 'numbers'},
//		                {type: .'checkbox'},//radio
		                {align: 'left',field: 'accountId', title: T.T('KHH1900014'),width:230},
		                {field: 'businessTypeCode', title: T.T('KHH1900045'), width:150, templet: function(d){
		                    if(d.businessTypeCode ||d.businessDesc){
		                    	return '<span>'+ d.businessTypeCode + d.businessDesc +'</span>';
		                    }else {
		                    	return '<span></span>';
		                    };
		                }},
		                {field: 'transCurrCde', title: T.T('KHH1900008'), width:100, templet: function(d){
		                    return '<span>'+ d.transCurrCde + d.transCurrDesc +'</span>';
		                }},
		                {field: 'transAmount', title: T.T('KHH1900009'), width:100},
		                {field: 'transDate', title: T.T('KHH1900007'), width:100,},
		                {field: 'currencyCode', title: T.T('KHH1900047'), width:100},
		                {field: 'postingAmount', title: T.T('KHH1900015'), width:100},
		                {field: 'occurrDate', title: T.T('KHH1900010'), width:100},
		                {field: 'transDesc', title: T.T('KHH1900012'), width:150},
		                {field:'haveChild',align: 'center', width:260, title: T.T('F00017'),templet: function(d){
		                	return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="balanceOrder">'+T.T("F00051")+'</a>'+
		        			'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="view">'+T.T("F00041")+'</a>';
		                }}//toolbar: '#distributionOrderHandle',
		            ],
//		            style: 'min-height:100px',
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					externalIdentificationNo: $scope.item.externalIdentificationNo,
		    					customerNo: $scope.item.customerNo,
		    					globalSerialNumbr: $scope.item.globalSerialNumbr,
		    					eventNo: $scope.item.eventNo,
		    					queryType : '1',
		    					accFlag : "mainAcc"
	                		};
		            		delete $scope.params.pageFlag;
		            	}else {//查主账户
		            		$scope.params = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					externalIdentificationNo: $scope.item.externalIdentificationNo,
		    					customerNo: $scope.item.customerNo,
		    					globalSerialNumbr: $scope.item.globalSerialNumbr,
		    					eventNo: $scope.item.eventNo,
		    					queryType : '1',
		    					pageFlag: "mainPage",
		    					pageNum: $scope.pageNumP,
		    			        pageSize: $scope.pageSizeP,
	                		};
		            		delete $scope.params.accFlag;
		            	};
                		jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.params).then(function(data) {
                			if (data.returnCode == '000000') {
                				$scope.isShowSameSource = true;
                				$scope.isShowBalanceOrder = false;//余额单元分配顺序
                				$scope.isShowDistributeOrder = false;//账户间分配顺序表
        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
        							$scope.pageCount = data.returnData.totalCount;
        							pageInit($scope.pageCount,"repayPage");//初始化分页
        							if(!data1){
            							angular.forEach(data.returnData.rows,function(item,i){
                							item.haveChild = true;
                						});
            						};
        							callback(data.returnData.rows);
        							if(!data1){//主账户
        								layui.use(['laypage', 'layer'], function(){
  					                      var laypage = layui.laypage;
  					                      laypage.render({
  					                            elem: 'repayPage',
  					                            count: $scope.pageCount,
  					                            limit: $scope.pageSizeP,
  					                            curr: $scope.pageNumP,
  					                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
  					                            jump: function(obj,first){
  					                             if (!first) {
  					                              $scope.pageNumP = obj.curr;
  					                              $scope.pageSizeP = obj.limit;
  					                              $scope.queryMainAndChildAcc($scope.item);
  					                             }
  					                            }
  					                        });
  					                    });

        							}
        						}else {
        							$scope.rows = [];
        							callback($scope.rows);
        							$scope.pageCount = 0;
        							pageInit($scope.pageCount,"repayPage");//初始化分页
        						};
                			}else {
                				$scope.isShowDiv = false;//还款历史列表
    							$scope.isShowSameSource = false;//还款分配列表
    							$scope.isShowDistributeOrder = false;//账户间分配顺序表
    							$scope.isShowBalanceOrder = false;//还款分配列表序
                			};
                		});
		            	}, 800);//setTimeout
		            },
		        });
		        //按钮
		        treeTable.on('tool(repayDistributeTreeTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'balanceOrder') {//余额单元
                         $scope.isBalTypePosting = false;  //余额类型入账情况查询列表

                        $scope.balTypePostingParams =  obj.data;
                        if($scope.hide_accRepyHistEnqr.idNumber){
                            $scope.balTypePostingTable.params.idType = $scope.hide_accRepyHistEnqr.idType;
                            $scope.balTypePostingTable.params.idNumber = $scope.hide_accRepyHistEnqr.idNumber;
                        };
                        if($scope.hide_accRepyHistEnqr.externalIdentificationNo){
                            $scope.balTypePostingTable.params.externalIdentificationNo = $scope.hide_accRepyHistEnqr.externalIdentificationNo;
                        };
                        $scope.balTypePostingTable.params.globalSerialNumbr = $scope.balTypePostingParams.globalSerialNumbr;
                        $scope.balTypePostingTable.params.accountId = $scope.balTypePostingParams.accountId;
                        $scope.balTypePostingTable.params.currencyCode = $scope.balTypePostingParams.currencyCode;
                        $scope.balTypePostingTable.params.subLogLevel = $scope.balTypePostingParams.subLogLevel;
                        $scope.balTypePostingTable.search();
                        $scope.isBalTypePosting = true;  //余额类型入账情况查询列表
		            }else if(event == 'view'){
		            	$scope.viewRepaymentHisDetail(obj.data);
		            };
		        });
		    });
		};
		//暂无数据 分页隐藏
		function pageInit(pageCount,pageDivId){
			if(pageCount > 0 ){
				$("#"+ pageDivId).css("display","block");
			}else {
				$("#"+ pageDivId).css("display","none");
			};
		};

        $scope.balTypePostingTable = {
            params : {
                "logLevel" : "T",
            },
            autoQuery : false,
            paging : true,
            resource : 'finacialTrans.query',
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_balanceType'],//查找数据字典所需参数
            transDict : ['balanceType_balanceTypeDesc'],//翻译前后key
            callback : function(data) {
                console.log(data)
            }
        };
			// 余额单元分配情况查询
			$scope.queryBalUnitInfo = function(event) {
				$scope.isShowBalUnit = true;
				$scope.balUnitParams = $.parseJSON(JSON.stringify(event));
				$scope.balUnitInfoTable.params = {
					"idType" : $scope.balUnitParams.idType,
					"idNumber" : $scope.balUnitParams.idNumber,
					"externalIdentificationNo" : $scope.balUnitParams.externalIdentificationNo,
					"globalSerialNumbr" : $scope.balUnitParams.globalSerialNumbr,
					"accountId" : $scope.balUnitParams.accountId,
					"currencyCode" : $scope.balUnitParams.currencyCode,
					"logLevel" : "B",
					"queryType" : "4",
					"changeCycleNumberMark" : true,
					"balanceType":$scope.balUnitParams.balanceType,
					subLogLevel :  $scope.balTypePostingParams.subLogLevel,
				}
				$scope.balUnitInfoTable.search();
			}
			$scope.balUnitInfoTable = {
				params : {},
				autoQuery : false,
				paging : true,
				resource : 'finacialTrans.query',
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType'],//查找数据字典所需参数
				transDict : ['balanceType_balanceTypeDesc'],//翻译前后key
				callback : function(data) {
				}
			}
			//查看按钮
			$scope.checkInfo = function(e){
				$scope.accountHisDetailInfo = $.parseJSON(JSON.stringify(e));
				if($scope.hide_accRepyHistEnqr.idNumber){
					$scope.accountHisDetailInfo.idType = $scope.hide_accRepyHistEnqr.idType;
					$scope.accountHisDetailInfo.idNumber = $scope.hide_accRepyHistEnqr.idNumber;
				};
				if($scope.hide_accRepyHistEnqr.externalIdentificationNo){
					$scope.accountHisDetailInfo.externalIdentificationNo = $scope.hide_accRepyHistEnqr.externalIdentificationNo;
				};
				$scope.modal('/cstSvc/accountHist/accountHisDetail.html', $scope.accountHisDetailInfo, {
					title : T.T('KHJ1900003'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '580px' ],
					callbacks : []
				});
			}
			//交易级分配
			$scope.tradInfo = function(e){
				console.log(e);
				$scope.tradTable.params.balanceUnitCode = e.entityKey;
				$scope.tradTable.params.globalTransSerialNo = e.globalSerialNumbr;
				$scope.tradTable.search();
			}
			$scope.tradTable = {
					params : {
						idType: $scope.hide_accRepyHistEnqr.idType,
						idNumber: $scope.hide_accRepyHistEnqr.idNumber,
						externalIdentificationNo: $scope.hide_accRepyHistEnqr.externalIdentificationNo
					},
					paging : true,
					resource : 'accRepyHistEnqr.tradallot',
					autoQuery : false,
					callback : function(data) {
						if(data.returnCode == '000000'){
							if(!data.returnData.rows || data.returnData.rows.length == 0){
								data.returnData.rows = [];
							}
							$scope.isShowtrad = true;
						}else {
							$scope.isShowtrad = false;
						}
					}
				}
	});
	webApp.controller('balTypePostingCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accountHist/i18n_accRepyHistEnqr');
		$translate.refresh();


	});
	webApp.controller('accRepayTransDetailCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	});
});
