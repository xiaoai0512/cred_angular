'use strict';
define(function(require) {

	var webApp = require('app');
	//信贷交易账户信息
	webApp.controller('instalQueryAccountCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
		//搜索身份证类型
		/*$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},
		{name : T.T('PZJ100021'),id : '0'} ];*/	
		$scope.isButtonLoan = true;
		$scope.isShowCreditTrade = false;
		//重置
		$scope.reset = function() {
			$scope.externalIdentificationNo= '';
			$scope.beginDate= '';
			$scope.endDate= '';
			$scope.isShowCreditTrade = false;
		};
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAY_startDate',
				//min:Date.now(),
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
				elem: '#LAY_endDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
//		 $scope.queryParam01 = {
//			type: "DROPDOWNBOX",
//			groupsCode : "dic_loanType",
//			queryFlag : "children"
//		};
//		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
//		function(data) {
//			$scope.loanTypeList = [];
//			$scope.loanTypeList = data.returnData.rows;
//		}); 
		$scope.queryParam02 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_loanAccStatus",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam02).then(
		function(data) {
			$scope.statusList = [];
			$scope.statusList = data.returnData.rows;
		});
		$scope.checkedList = [];
		$scope.pageCountIns = 0;
		 $scope.pageNumIns = 1;
		 $scope.pageSizeIns = 10;
		$scope.creditList = function(){
			layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var layer = layui.layer;
		        var util = layui.util;
		        var treeTable = layui.treeTable;

		        // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#creditTradeTable',
		            tree: {iconIndex: 1,  // 折叠图标显示在第几列
		            	onlyIconControl: true // 仅允许点击图标折叠
		            	}, 
		            checkFlag:false,//子账户不需要复选框
		            even:true,//是否开启隔行变色
		            cols: [
		                {type: 'checkbox'},
		                {field: 'loanTypeDesc',align: 'center', title: T.T("KHH4600224"), width:160},
		                {field: 'subAccIdentify',align: 'center', title: T.T("KHH4600156"), width:100,templet:function(d){
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
		                {align: 'center',field: 'accountId', title: T.T("KHH4600004"),width:230},
		                {align: 'left',field: '', title: T.T("KHH4600234"),width:150,templet: function(d){
		                	if(d.haveChild == true){
		                		return '<span>-</span>';
		                	}else if(d.haveChild == false){
		                		if(d.subAccIdentify == 'Q'){
			                    	return '<span>'+ d.transIdentifiNo +'</span>';
			                    }else if(d.subAccIdentify == 'L'){
			                    	return '<span>'+ d.fundNum +'</span>';
                                }
                            }
		                }},
		                {align: 'left',field: '', title: T.T("KHH4600235"),width:160,templet: function(d){
		                	if(d.haveChild == true){
		                		return '<span>-</span>';
		                	}else if(d.haveChild == false){
		                		if(d.subAccIdentify == 'Q'){
			                    	return '<span>'+ d.transIdentifiDesc +'</span>';
			                    }else if(d.subAccIdentify == 'L'){
			                    	return '<span>'+ d.fundName +'</span>';
                                }
                            }
		                }},
		                {field: 'loanAmount',align: 'center', title: T.T("KHH4600157"), width:70},
		                {field: 'remainPrincipalAmount',align: 'center', title: T.T("KHH4600062"), width:70},
		                {field: 'currencyCode',align: 'center', title: T.T("KHH4600006"), width:70},
		                {field: '',align: 'center', title: T.T("KHH4600036"), width:70,templet: function(d){
		                	if(d.haveChild == true){
		                		return '<span>'+ d.loanTerm +'</span>';
		                	}else if(d.haveChild == false){
		                		return '<span>-</span>';
		                    }
		                }},
		                {field: '',align: 'center', title: T.T("KHH4600008"), width:100,templet: function(d){
		                	if(d.haveChild == true){
		                		return '<span>'+ d.startIntDate +'</span>';
		                	}else if(d.haveChild == false){
		                		return '<span>-</span>';
		                    }
		                }},
		                {field: '', title: T.T("KHH4600158"),align: 'center', width:70,templet: function(d){
		                	if(d.haveChild == true){
		                		return '<span>'+ d.statusDescp +'</span>';
		                	}else if(d.haveChild == false){
		                		return '<span>-</span>';
		                    }
		                }},
		                {align: 'center', title: T.T("F00017"), width:550, templet: function(d){
		                	if(d.stageType == '0'){//交易分期
		                		if( d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                      		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="returnedPurchase">'+T.T("F00149")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="orginTransInfBtn">'+T.T("KHH4600232")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '1'){//余额分期
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '2'){//非现金实物分期
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
			                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="returnedPurchase">'+T.T("F00149")+'</a>'+
			                   	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '3' ){//现金分期
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '4' ){//消贷分期
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="loanChange">'+T.T("KHH4600057")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="prepayment">'+T.T("KHH4600081")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '5' ){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokeTranApay">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="creditS2Payment">'+T.T("KHH4600233")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(!d.stageType){
		                		return '';
                            }
                                //商戶分期次
		                	/*if(d.stageType == '2'){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
			                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="returnedPurchase">'+T.T("F00149")+'</a>'+
			                   	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                		//
		                	}
		                	else if(d.stageType  == '2'){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
			                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="returnedPurchase">'+T.T("F00149")+'</a>'+
			                   	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                		//現金分期
		                	}
		                	else if(d.stageType == '3' ){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                		//賬單分期
		                	}else if(d.stageType == '1'){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '0'){
		                		if( d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                      		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="returnedPurchase">'+T.T("F00149")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="orginTransInfBtn">'+T.T("KHH4600232")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}
		                	else ifd.stageType == 'SPCL'){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                      		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="returnedPurchase">'+T.T("F00149")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="preHandler">'+T.T("KHH4600228")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="deferredStage">'+T.T("KHH4600229")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH4600230")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}
		                else if(d.stageType == '4' ){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokePurchase">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="loanChange">'+T.T("KHH4600057")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="prepayment">'+T.T("KHH4600081")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.stageType == '5' ){
		                		if(d.haveChild == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>'+
		                       	 	'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="revokeTranApay">'+T.T("KHH4600055")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="creditS2Payment">'+T.T("KHH4600233")+'</a>'+
		            				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="relationInfo">'+T.T("KHH4600231")+'</a>';
		                		}else if(d.haveChild == false){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoCash">'+T.T("F00014")+'</a>';
		                		}
		                	};*/
		                	
		                }}// templet: '#treeTableBar1'
		            ],
		            reqData: function (data1, callback) {
		            	if(data1){//子账户
							$scope.params = {};
							$scope.params = {
									globalTransSerialNo:data1.globalTransSerialNo,
									externalIdentificationNo:$scope.externalIdentificationNo,

							};
							jfRest.request('instalments','queryChild',$scope.params).then(function(data) {
        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
        							angular.forEach(data.returnData.rows,function(item,i){
            							item.haveChild = false;
            						});
//        							if($scope.loanTypeList.length > 0){
//        								for(var i=0;i<$scope.loanTypeList.length;i++){
//        									for(var j=0;j<data.returnData.rows.length;j++){
//        										if($scope.loanTypeList[i].codes == data.returnData.rows[j].loanType){
//        											data.returnData.rows[j].loanTypeDescp = $scope.loanTypeList[i].detailDesc;
//        										}
//        									}
//        								}
//        							}
        							if($scope.statusList.length > 0){
        								for(var i=0;i<$scope.statusList.length;i++){
        									for(var j=0;j<data.returnData.rows.length;j++){
        										if($scope.statusList[i].codes == data.returnData.rows[j].status){
        											data.returnData.rows[j].statusDescp = $scope.statusList[i].detailDesc;
        										}
        									}
        								}
        							}
        							callback(data.returnData.rows);
        						}else {
        							$scope.rows = [];
	    							callback($scope.rows);
//	                				data.returnData.rows = [];
//	    							callback(data.returnData.rows);
                                }
                            });
		            	}else {//查主账户
		            		$scope.beginDate = $("#LAY_startDate").val();
							$scope.endDate = $("#LAY_endDate").val();
							$scope.params = {};
							$scope.params = {
									externalIdentificationNo:$scope.externalIdentificationNo,
									beginDate:$scope.beginDate,
									endDate:$scope.endDate,
									pageNum: $scope.pageNumIns,
		            		        pageSize: $scope.pageSizeIns
							};
							jfRest.request('instalments','query',$scope.params).then(function(data) {
								if (data.returnCode == '000000') {
	        						$scope.isShowCreditTrade = true;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCountIns = data.returnData.totalCount;
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = true;
	            						});
//	        							if($scope.loanTypeList.length > 0){
//	        								for(var i=0;i<$scope.loanTypeList.length;i++){
//	        									for(var j=0;j<data.returnData.rows.length;j++){
//	        										if($scope.loanTypeList[i].codes == data.returnData.rows[j].loanType){
//	        											data.returnData.rows[j].loanTypeDescp = $scope.loanTypeList[i].detailDesc;
//	        										}
//	        									}
//	        								}
//	        							}
	        							if($scope.statusList.length > 0){
	        								for(var i=0;i<$scope.statusList.length;i++){
	        									for(var j=0;j<data.returnData.rows.length;j++){
	        										if($scope.statusList[i].codes == data.returnData.rows[j].status){
	        											data.returnData.rows[j].statusDescp = $scope.statusList[i].detailDesc;
	        										}
	        									}
	        								}
	        							}
		        						$scope.creditTradeTableAll =  data.returnData.rows;
	        							callback(data.returnData.rows);
	        							layui.use(['laypage', 'layer'], function(){
		      			                      var laypage = layui.laypage
		      			                      ,layer = layui.layer;
		      			                      laypage.render({
		      			                            elem: 'instalTransPage',
		      			                            count: $scope.pageCountIns,
		      			                            limit: $scope.pageSizeIns,
		      			                            curr: $scope.pageNumIns,
		      			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
		      			                            jump: function(obj,first){
		      			                             if (!first) {
		      			                              $scope.pageNumIns = obj.curr;
		      			                              $scope.pageSizeIns = obj.limit;
		      			                              $scope.creditList();
		      			                             }
		      			                            }
		      			                        });
		      			                    });
	        						}else {
	        							$scope.rowDatas = [];
	        							callback($scope.rowDatas);
                                    }
                                }else {
	                				$scope.isShowCreditTrade = false;
	                				$scope.rows = [];
	    							callback($scope.rows);
//	                				data.returnData.rows = [];
//	    							callback(data.returnData.rows);
                                }
                            });
                        }
                    },
		        });
		        //绑定事件
		        treeTable.on('tool(creditTradeTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'checkInfoCash') {
		                $scope.checkInfoCash(obj.data);
		            } else if (event == 'returnedPurchase') {
		                $scope.returnedPurchase(obj.data);
		            }else if(event == 'revokePurchase'){
		            	 $scope.revokePurchase(obj.data);
		            }else if(event == 'preHandler'){
		            	 $scope.preHandler(obj.data);
		            }else if(event == 'deferredStage'){
		            	 $scope.deferredStage(obj.data);
		            }else if(event == 'pauseStage'){
		            	 $scope.pauseStage(obj.data);
		            }else if(event == 'relationInfo'){
		            	 $scope.relationInfo(obj.data);
		            }else if(event == 'orginTransInfBtn'){     
		            	 $scope.orginTransInfBtn(obj.data);
		            }else if(event == 'loanChange'){
		            	 $scope.loanChange(obj.data);
		            }else if(event == 'prepayment'){
		            	 $scope.prepayment(obj.data);
		            }else if(event == 'creditS2Payment'){
		            	 $scope.creditS2Payment(obj.data);
                    }
                });
		        //监听复选框选择
		        treeTable.on('checkbox(creditTradeTable)', function(obj){
	        		// 选中行的相关数据
		        	if(obj.type == 'all'){//全选
		        		$scope.checkedList = $scope.creditTradeTableAll;
		        	}else {
		        		$scope.checkedList.push(obj.data);	
		        	}

					if($scope.checkedList.length == 0){
						$(".repayment").attr("normalRepayment","normalRepayment");
						$(".repayment").addClass("layui-btn-normalRepayment");
                    }
                    if($scope.checkedList.length > 0){
						if($scope.isAllTrans($scope.checkedList)){//都为信贷分期
							
							$(".repayment").removeAttr("normalRepayment");
							$(".repayment").removeClass("layui-btn-normalRepayment");
						}else {
							$(".repayment").attr("normalRepayment","normalRepayment");
							$(".repayment").addClass("layui-btn-normalRepayment");
						}
					}
		        });
		    });
		};
		//信贷交易账户信息列表
//		$scope.creditTradeList = {
//			checkType : 'checkbox',
//			autoQuery:false,
//			params : {
//					"pageSize":10,
//					"indexNo":0
//			}, // 表格查询时的参数信息
//			paging : true,// 默认true,是否分页
//			resource : 'instalments.query',// 列表的资源
//			isTrans: true,
//			transParams: ['dic_loanType','dic_loanAccStatus'],
//			transDict: ['loanType1_loanTypeDesc','status_statusDesc'],
//			callback : function(data) { // 表格查询后的回调函数
//				if(data.returnCode == '000000'){
//					if(data.returnData && data.returnData.rows.length > 0){
//						angular.forEach(data.returnData.rows, function(item,k){
//							item.loanType1 = item.loanType.substring(0,4)
//						});
//					};
//					$scope.isShowCreditTrade = true;
//				}else {
//					$scope.isShowCreditTrade = false;
//				}
//			},
//			checkBack:function(row){
//				$scope.checkedList = $scope.creditTradeList.checkedList();
//				if($scope.checkedList.length == 0){
//					$(".repayment").attr("normalRepayment","normalRepayment");
//					$(".repayment").addClass("layui-btn-normalRepayment");
//				};
//				
//				if($scope.checkedList.length > 0){
//					if($scope.isAllTrans($scope.checkedList)){//都为信贷分期
//						
//						$(".repayment").removeAttr("normalRepayment");
//						$(".repayment").removeClass("layui-btn-normalRepayment");
//					}else {
//						$(".repayment").attr("normalRepayment","normalRepayment");
//						$(".repayment").addClass("layui-btn-normalRepayment");
//					}
//				}
//				
//			}
//		};
		
		//判断选中的是否都为信贷分期
		$scope.isAllTrans = function(data){
			var count = 0;
			angular.forEach(data,function(item,index){
				if(item.stageType == '4'){
					count++;
                }
            });
			
			if(count == data.length){
				return true;
			}else {
				return false;
			}
		};
		$scope.searchBtn = function() {
			if($scope.externalIdentificationNo == null || $scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined){
				jfLayer.alert(T.T('F00076'));//"输入查询条件"
			}
			else {
				//$scope.creditTradeList.params.businessPattern = "S1";
//				$scope.startDate = $("#LAY_startDate").val();
//				$scope.endDate = $("#LAY_endDate").val();
//				$scope.creditTradeList.params.startDate = $scope.startDate;
//				$scope.creditTradeList.params.endDate = $scope.endDate;
//				$scope.creditTradeList.search();
				$scope.creditList();
			}
		};
		//查看详情
		$scope.checkInfo = function(event) {
			$scope.itemDetailInf = {};
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
		//	$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/txnInfEnqr/ ', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
		
		/*暂停分期*/
		$scope.pauseStage = function(item){
			$scope.itemDetailInf = {};
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(item));
			//$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/instalmentsQuery/layerPauseStage.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600025'),// '暂停分期详情'
				buttons : [T.T('F00152'),T.T('F00012') ],//'暂停分期','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : [$scope.pauseStageSure]
			});
		};
		//确定暂停
		$scope.pauseStageSure = function(result){
			$scope.itemInf = result.scope.itemInf;
			 $scope.pauseStageparams = {
				 externalIdentificationNo:$scope.itemInf.externalIdentificationNo,
				 ecommPostingAcctNmbr : $scope.itemInf.accountId,
				 ecommCustId : $scope.itemInf.customerNo,
				 ecommTransPostingCurr : $scope.itemInf.currencyCode,
				 suspendCycle : result.scope.pauseInf.suspendCycle,
			 };
			jfRest.request('instalments', 'pauseStage', $scope.pauseStageparams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4600026'));
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		/*暂停分期 end*/
		//撤销
		$scope.revokeTran = function(result) {
			$scope.delItem = result;
			jfLayer.confirm(T.T('KHJ4600006'),function() {   //KHJ4600006  '确定撤销此笔贷款吗？'
 				$scope.paramsId = {
 					ecommPostingAcctNmbr:$scope.delItem.accountId,
 					ecommTransPostingCurr:$scope.delItem.currencyCode,
 					externalIdentificationNo:$scope.delItem.externalIdentificationNo
				 };
 				//$scope.paramsId = $.extend($scope.paramsId,  $scope.creditTradeList.params.externalIdentificationNo);
 				jfRest.request('instalments','revoke',$scope.paramsId).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00124'));   //'撤销成功');
						$scope.delItem = {};
						//$scope.creditTradeList.search();
						$scope.creditList();
					}
	 			});
			},function() {
				
			});
		};
		//信贷贷款变更事件
		$scope.loanChange = function(event) {
			$scope.loanquery = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/instalmentsQuery/loanChangePage.html', $scope.loanquery, {
				title :T.T('KHJ4600008'),   //'贷款变更详情'
				buttons : [T.T('F00125'),T.T('F00012') ],//'确认','关闭' 
				size : [ '1100px', '620px' ],
				callbacks : [$scope.loansSure]
			});
		};
		$scope.loansSure = function(result){
			//选择贷款变更方式 不可为空
			if(result.scope.loanquery.changeType == '1'){
				if(result.scope.loanquery.changeTermNo == '' || result.scope.loanquery.changeTermNo == null ||
					result.scope.loanquery.changeTermNo == undefined ){
					jfLayer.alert(T.T('KHJ4600009'));     //'请核实贷款期次！');
					return;
                }
            }
            if(result.scope.loanquery.changeType  == '2'){
				if(result.scope.loanquery.changeLoanRate == '' || result.scope.loanquery.changeLoanRate == null ||
					result.scope.loanquery.changeLoanRate == undefined ){
					jfLayer.alert(T.T('KHJ4600010'));     //'请核实贷款利率！');
					return;
                }
            }
            if(result.scope.loanquery.changeType == '3'){
				if(result.scope.loanquery.changeRepayMode == '' || result.scope.loanquery.changeRepayMode == null ||
					result.scope.loanquery.changeRepayMode == undefined ){
					jfLayer.alert(T.T('KHJ4600011'));    //'请核实贷款还款方式！');
					return;
                }
            }
            $scope.paramsLoan = {};
			$scope.paramsLoan.changeRepayMode=result.scope.loanquery.changeRepayMode;
			$scope.paramsLoan.changeLoanRate=result.scope.loanquery.changeLoanRate;
			$scope.paramsLoan.changeTermNo=result.scope.loanquery.changeTermNo;
			$scope.paramsLoan.ecommPostingAcctNmbr=result.scope.loanquery.accountId;
			$scope.paramsLoan.ecommTransPostingCurr=result.scope.loanquery.currencyCode;
			$scope.paramsLoan.ecommEntryId=result.scope.loanquery.ecommEntryId;
			$scope.paramsLoan.externalIdentificationNo=result.scope.loanquery.externalIdentificationNo;
			jfRest.request('creditLoanInfo', 'changeLoan', $scope.paramsLoan).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4600012'));//"贷款变更成功"
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
			
		};
		
		//部分提前还款
		$scope.prepayment = function(event) {
			$scope.prepayInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/instalmentsQuery/layerPrepayment.html', $scope.prepayInf, {
				title :T.T('KHJ4600014'),  //'提前部分还款详情',
				buttons : [T.T('F00125'),T.T('F00012') ],//'确认','关闭' 
				size : [ '1100px', '620px' ],
				callbacks : [$scope.prepaySSure]
			});
		};
		
		//部分提前还款试算
		$scope.prepaySSure= function(result){
			$scope.prepayInfparams = {};
			$scope.prepayInfparams.partRepayAmt = result.scope.partRepayAmt;//提前还款金额
			$scope.prepayInfparams.ecommPostingAcctNmbr = result.scope.prepayInf.accountId,//入账账户号
			$scope.prepayInfparams.ecommTransPostingCurr = result.scope.prepayInf.currencyCode,//币种
			$scope.prepayInfparams.ecommEntryId = result.scope.prepayInf.externalIdentificationNo,//外部识别号
			jfRest.request('instalments', 'halfRepayment', $scope.prepayInfparams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4600015'));
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		//批量信贷提前还款按钮
		$scope.batchRepayment = function() {
			$scope.treeSelect = [];
			$scope.batchrquery = {};
			//$scope.selectStr = "";
			if ($scope.checkedList.length == 0) {
				return;
			}
			var itemBatchs = $scope.checkedList;
			for (var i = 0; i < itemBatchs.length; i++) {
				//$scope.selectStr += itemBatchs[i].accountId + ',';	
				$scope.treeSelect.push(itemBatchs[i].accountId);
			}
			//$scope.selectStr = $scope.selectStr.substring(0, $scope.selectStr.length-1);
			$scope.batchrquery.ecommEntryId = $scope.externalIdentificationNo;
			$scope.batchrquery.ecommPostingAcctNmbrs = $scope.treeSelect;
			$scope.params ={
					ecommEntryId:$scope.batchrquery.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.batchrquery.ecommPostingAcctNmbrs 
			};
			//$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'batchTrial', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.batchrquery.batchInfoListPage = data.returnData;
					$scope.modal('/cstSvc/instalmentsQuery/batchRepayment.html', $scope.batchrquery, {
						title :T.T('KHJ4600004'),// '还款明细'
						buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
						size : [ '1100px', '620px' ],
						callbacks : [$scope.batchSure]
					});
				}
			});
		};
		//提前还款按钮事件
		$scope.batchSure = function(result){
			$scope.batchrepay = result.scope.itembatchInf;
			$scope.params ={
					ecommEntryId: $scope.batchrepay.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.batchrepay.ecommPostingAcctNmbrs
			};
			//$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			
			jfRest.request('instalments', 'batchRepayment', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		//批量信贷逾期还款试算
		$scope.overdueRepayment = function(){
        	$scope.overduequery = {};
			$scope.treeSeloverdue = [];
			//$scope.selStrOverdue = "";
			if ($scope.checkedList.length == 0) {
				return;
			}
			var itemOverdue = $scope.checkedList;
			for (var i = 0; i < itemOverdue.length; i++) {
				//$scope.selStrOverdue += itemOverdue[i].accountId + ',';
				$scope.treeSeloverdue.push(itemOverdue[i].accountId);
			}
			//$scope.selStrOverdue = $scope.selStrOverdue.substring(0, $scope.selStrOverdue.length-1);
			//$scope.treeSeloverdue.push($scope.selStrOverdue);
			$scope.overduequery.ecommEntryId = $scope.externalIdentificationNo;
			$scope.overduequery.ecommPostingAcctNmbrs = $scope.treeSeloverdue;
			$scope.params ={
					ecommEntryId:$scope.overduequery.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.overduequery.ecommPostingAcctNmbrs 
			};
			//$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'overTrial', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.overduequery.overdueInfoListPage = data.returnData;
					$scope.overduequery.externalIdentificationNo = $scope.externalIdentificationNo;
					$scope.modal('/cstSvc/instalmentsQuery/overdueRepayment.html', $scope.overduequery, {
						title :T.T('KHJ4600004'),// '还款明细'
						buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
						size : [ '1000px', '580px' ],
						callbacks : [$scope.overdueSure]
					});
				}
			});
		};
		//逾期还款按钮事件
		$scope.overdueSure = function(result){
			$scope.overduerepay = result.scope.itemoverdueInf;
			$scope.params ={
					ecommEntryId: $scope.overduerepay.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.overduerepay.ecommPostingAcctNmbrs
			};
			//$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'overRepayment', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		//批量信贷正常还款试算
		$scope.normalRepayment = function(){
			$scope.normalquery = {};
			$scope.treeSelnormal = [];
			if ($scope.checkedList.length == 0) {
				return;
			}
			var itemNormal = $scope.checkedList;
			for (var i = 0; i < itemNormal.length; i++) {
				$scope.treeSelnormal.push(itemNormal[i].accountId);
			}
			$scope.normalquery.ecommEntryId = $scope.externalIdentificationNo;
			$scope.normalquery.ecommPostingAcctNmbrs = $scope.treeSelnormal;
			$scope.params ={
					ecommEntryId:$scope.normalquery.ecommEntryId,
					ecommPostingAcctNmbrs: $scope.normalquery.ecommPostingAcctNmbrs
			};
			//$scope.params = $.extend($scope.params, $scope.creditTradeList.params);
			jfRest.request('instalments', 'normalTrial', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.normalquery.normalInfoListPage = data.returnData;
					$scope.modal('/cstSvc/instalmentsQuery/normalRepayment.html', $scope.normalquery, {
						title :T.T('KHJ4600004'),// '还款明细'
						buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
						size : [ '1000px', '580px' ],
						callbacks : [ $scope.normalSure]
					});
				}
			});
		};
		//正常还款按钮事件
		$scope.normalSure = function(result){
			$scope.normalrepay = result.scope.itemnormalInf;
			var accountRepayment = [];
			$scope.ecommPostingAcctNmbrsList = [];
			for(var i =0; i < $scope.normalrepay.normalInfoListPage.rows.length; i++){
				var obj={};
				obj['accountId'] = $scope.normalrepay.normalInfoListPage.rows[i].accountId;
				obj['partRepayAmt'] = $scope.normalrepay.normalInfoListPage.rows[i].partRepayAmt;
				accountRepayment.push(obj);
				$scope.ecommPostingAcctNmbrsList.push($scope.normalrepay.normalInfoListPage.rows[i].accountId);
				//检测选中这一条数据里是否有提前部分还款字段，如为空或者是undefined的赋值为0；
				/*if(!accountRepayment[i].hasOwnProperty("partRepayAmt") || accountRepayment[i].partRepayAmt=="" || accountRepayment[i].partRepayAmt==undefined){
					accountRepayment[i].partRepayAmt = 0;
				}*/ 
				/*if(!$scope.normalrepay.normalInfoListPage.rows[i].hasOwnProperty("partRepayAmt") || $scope.normalrepay.normalInfoListPage.rows[i].partRepayAmt=="" 
					|| $scope.normalrepay.normalInfoListPage.rows[i].partRepayAmt==undefined){
					$scope.normalrepay.normalInfoListPage.rows[i].partRepayAmt =0;
				}*/
				if(accountRepayment[i].partRepayAmt=="" || accountRepayment[i].partRepayAmt==undefined){
					jfLayer.alert(T.T('KHJ4600055'));
				}
				if($scope.normalrepay.normalInfoListPage.rows[i].partRepayAmt=="" || $scope.normalrepay.normalInfoListPage.rows[i].partRepayAmt==undefined){
					jfLayer.alert(T.T('KHJ4600055'));
				}
            }
            $scope.params ={
					ecommEntryId: $scope.normalrepay.ecommEntryId,
					partRepayAmtmap:accountRepayment,
					ecommPostingAcctNmbrs:$scope.ecommPostingAcctNmbrsList,
					//ecommPostingAcctNmbrs:$scope.normalrepay.normalInfoListPage.rows
			};
			jfRest.request('instalments', 'normalRepayment', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00034'));//"操作成功！"
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		//============除了信贷分期LOAN和随借随还APAY 现金分期  start=============
		//撤销
		$scope.revokePurchase = function(item) {
			jfLayer.confirm(T.T('KHJ4600048'),function() {
				/*var url;
				if(item.loanType == 'TXAT' || item.loanType == 'TRAN'){
					url = 'returnedPurchase3';
				};*/
				$scope.params = {
					//"idType" : item.idType,
					//"idNumber" : item.idNumber,
					"externalIdentificationNo" : item.externalIdentificationNo,
					//"ecommOrigGlobalSerialNumbr" : item.globalSerialNumbr,
					//"ecommEntryId" : item.externalIdentificationNo,
					//"ecommOrigEventId" : item.eventNo,
					//"ecommTransCurr" : item.transCurrCde,
					//"ecommTransAmount" : item.loanAmount,
					//"ecommTransDate" : item.transDate,
					"ecommTransPostingCurr" : item.currencyCode,
					//"ecommTransPostingAmount" : item.loanAmount,
					//"ecommTransStatus" : item.transState,
					//"ecommOriTransDate" : item.payDate,
					//"ecommClearAmount" : item.loanAmount,
					"ecommPostingAcctNmbr": item.accountId,
					//"ecommBalType": item.balanceType,
					"ecommCustId" : item.customerNo
				};
				jfRest.request('finacialTrans', 'returnedPurchase4', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00124'));
						//$scope.creditTradeList.search();
						$scope.creditList();
					} 
				});
			},function() {
				
			});

		};
		
		//退货
		$scope.returnedPurchase = function(item) {
			jfLayer.confirm(T.T('KHJ4600047'),function() {
				/*var url;
				if(item.loanType == 'TXAT' || item.loanType == 'TRAN'){
					url = 'returnedPurchase3';
				};*/
				$scope.params = {
					//"idType" : item.idType,
					//"idNumber" : item.idNumber,
					"externalIdentificationNo" : item.externalIdentificationNo,
					//"ecommOrigGlobalSerialNumbr" : item.globalSerialNumbr,
					//"ecommEntryId" : item.externalIdentificationNo,
					//"ecommOrigEventId" : item.eventNo,
					//"ecommTransCurr" : item.transCurrCde,
					//"ecommTransAmount" : item.loanAmount,
					//"ecommTransDate" : item.transDate,
					"ecommTransPostingCurr" : item.currencyCode,
					//"ecommTransPostingAmount" : item.loanAmount,
					//"ecommTransStatus" : item.transState,
					//"ecommOriTransDate" : item.payDate,
					//"ecommClearAmount" : item.loanAmount,
					"ecommPostingAcctNmbr": item.accountId,
					//"ecommBalType": item.balanceType,
					"ecommCustId" : item.customerNo
				};
				jfRest.request('finacialTrans', 'returnedPurchase3', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00054'));
						$scope.creditList();
					} 
				});
			},function() {
				
			});
		};
		// 提前结清
		$scope.preHandler = function(item) {
			$scope.earlyInf = {};
			$scope.earlyInf = $.parseJSON(JSON.stringify(item));
			//$scope.earlyInf = $.extend($scope.earlyInf, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/instalmentsQuery/earlySettlement.html', $scope.earlyInf, {
				title : T.T('KHH4600159'),// '提前结清试算'
				buttons : [T.T('KHJ4600002'),T.T('F00012') ],//'提前结清','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : [$scope.earlySure]
			});
		};
		//确定提前结清
		$scope.earlySure = function(result){
			$scope.params = {
				externalIdentificationNo : result.scope.earlyInf.externalIdentificationNo,
				ecommTransPostingCurr : result.scope.earlyInf.currencyCode,
				ecommPostingAcctNmbr: result.scope.earlyInf.accountId,
				ecommCustId : result.scope.earlyInf.customerNo,
				ecommTriggerFlag : "pageTrigger"//因为批量提前结清也是调用了这个事件，为了在活动中进行区分，在这里加一个“页面触发”的标识
			};
			jfRest.request('fncTxnMgtTest', 'triggerILSRT408001', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00064'));
					//$scope.creditTradeList.search();
					$scope.creditList();
					$scope.safeApply();
					result.cancel();
				} 
			});
		};
		//详情
		$scope.checkInfoCash = function(event) {
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/viewCreditTradeCard.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				//callbacks : [$scope.sureHandle]
				callbacks : [ ]
			});
		};
		//============除了信贷分期LOAN和随借随还APAY 现金分期  end=============
		/* ====================交易分期 ===============*/
		//原交易信息  与账户金融信息查询中原交易信息共用页面
		$scope.orginTransInfBtn = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/acbaUnitList/orginTransInfo.html',$scope.item, {
				title : T.T('KHJ4600017'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
			
		};
		/*================S2随贷随还  按钮展示 start=============*/
		//查看详情
		$scope.checkInfoApay = function(event) {
			$scope.itemDetailInf = {};
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			//$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/txnInfEnqr/viewCreditTradeAccS2.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
		//撤销
		$scope.revokeTranApay = function(result) {
			$scope.delItem = result;
			jfLayer.confirm(T.T('KHJ4600006'),function() {
 				$scope.paramsId = {
 					ecommPostingAcctNmbr:$scope.delItem.accountId,
 					ecommTransPostingCurr:$scope.delItem.currencyCode,
 					externalIdentificationNo:$scope.delItem.externalIdentificationNo
				 };
 				
 				//$scope.paramsId = $.extend($scope.paramsId,  $scope.creditTradeList.params.externalIdentificationNo);
 				
	 			jfRest.request('instalments','revokeS2Pay',$scope.paramsId).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00124'));
						$scope.delItem = {};
						//$scope.creditTradeList.search();
						$scope.creditList();
					}
	 			});
			},function() {
				
			});
		};
		//信贷还款
		$scope.creditS2Payment = function(event) {
			$scope.prepayInf = $.parseJSON(JSON.stringify(event));
			
			$scope.itemInfPay = {
					ecommEntryId : 	$scope.prepayInf.externalIdentificationNo,
					ecommPostingAcctNmbr : 	$scope.prepayInf.accountId,
					ecommTransPostingCurr : 	$scope.prepayInf.currencyCode,
			};
			jfRest.request('instalments', 'creditS2PaymentTrial', $scope.itemInfPay).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData != null && data.returnData != 'null' && data.returnData != undefined){
							$scope.prepayInf.normalrepaymentList = data.returnData.interPriBeanByaccount;
							$scope.prepayInf = $.extend($scope.prepayInf,data.returnData);
							$scope.modal('/cstSvc/instalmentsQuery/layerCreditS2PaymentS2.html', $scope.prepayInf, {
								title :T.T('KHJ4600018'),
								buttons : [T.T('KHJ4600005'),T.T('F00012') ],//'还款','关闭' 
								size : [ '1100px', '620px' ],
								callbacks : [$scope.creditS2PaymentSure]
							});
					}else {
						$scope.prepayInf.normalrepaymentList =[];
					}
				}
				
			});
		};
		//还款试算
		$scope.creditS2PaymentSure= function(result){
			$scope.credtitpayInfparams = {};
			$scope.credtitpayInfparams.repayAmt = result.scope.prepayInf.repayAmt;//还款金额
			$scope.credtitpayInfparams.ecommEntryId = result.scope.prepayInf.externalIdentificationNo;//外部识别号
			$scope.credtitpayInfparams.ecommPostingAcctNmbr = result.scope.prepayInf.accountId;//入账账户号
			$scope.credtitpayInfparams.externalIdentificationNo = result.scope.prepayInf.externalIdentificationNo;//外部识别号
			$scope.credtitpayInfparams.ecommTransPostingCurr = result.scope.prepayInf.currencyCode;//币种
			
			if($scope.credtitpayInfparams.repayAmt == null || $scope.credtitpayInfparams.repayAmt == undefined ||
					$scope.credtitpayInfparams.repayAmt == 'null' || $scope.credtitpayInfparams.repayAmt == ''){
				jfLayer.alert(T.T('KHJ4600019'));
				return;
            }
            jfRest.request('instalments', 'creditS2Payment', $scope.credtitpayInfparams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4600020'));
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		/*================S2随贷随还  按钮展示 end=============*/
		/*延期分期*/
		$scope.deferredStage = function(item){
			$scope.itemDetailInf = {};
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(item));
			//$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/instalmentsQuery/layerDeferredStage.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600022'),// '延期分期详情'
				buttons : [T.T('F00151'),T.T('F00012') ],//'延期分期','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : [$scope.deferredStageSure]
			});
		};
		//确定延期
		$scope.deferredStageSure = function(result){
			$scope.itemInf = result.scope.itemInf;
			 $scope.deferredStageparams = {
				 externalIdentificationNo:$scope.itemInf.externalIdentificationNo,
				 ecommPostingAcctNmbr : $scope.itemInf.accountId,
				 ecommCustId : $scope.itemInf.customerNo,
				 ecommTransPostingCurr : $scope.itemInf.currencyCode,
				 changePeriod : result.scope.deferredInf.changePeriod,
			 };
			jfRest.request('instalments', 'deferredStage', $scope.deferredStageparams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4600023'));
					$scope.safeApply();
					result.cancel();
					//$scope.creditTradeList.search();
					$scope.creditList();
				}
			});
		};
		/*延期分期 end*/

		//关联交易查询
		$scope.relationInfo = function(item){
			$scope.itemInstalICInfo = {};
			$scope.itemInstalICInfo = $.parseJSON(JSON.stringify(item));
			$scope.itemInstalICInfo.externalIdentificationNo = $scope.externalIdentificationNo;
			$scope.itemInstalICInfo.beginDate = $scope.beginDate;
			$scope.itemInstalICInfo.endDate = $scope.endDate;
			//$scope.itemInstalICInfo = $.extend($scope.itemInstalInfo, $scope.creditTradeList.params);
			$scope.modal('/cstSvc/instalmentsQuery/relatedTransactions.html', $scope.itemInstalICInfo, {
				title : T.T('KHH4600220'),// '关联交易详情'
				buttons : [T.T('F00012') ],//'关闭' 
				size : [ '1100px', '580px' ],
				callbacks : []
			});	
		}
	});
	//交易明细查询
	webApp.controller('viewCreditsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		$scope.isTypeTrans = true;
		if($scope.itemDetailInf.loanType=='SPCL'){
			$scope.isTypeTrans = false;
		}else{
			$scope.isTypeTrans = true;
        }
        //多资方显示
		if($scope.itemInf.subAccIdentify == 'L'){
			$scope.dzfDiv = true;
		}else {
			$scope.dzfDiv = false;
        }
        if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo =  T.T('F00144');   //'撤銷';
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = T.T('F00146');   //'正常';
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = T.T('F00145');   //'逾期';
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = T.T('F00147');   //'结清';
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = T.T('F00148');   //'全额退货';
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('F00088');   //'人民币';
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('F00095');   //'美元';
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4600028');   //'期末本息一次付清';
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4600029');   //'按固定周期付息、到期还本';
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4600030');   //'等额本息';
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4600031');   //'等额本金';
		}else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4600032');   //'等本等息';
		}else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4600033');   //'首期一次性付息分期还本';
		}else if($scope.itemDetailInf.repayMode == '14'){
			$scope.repayModeInfo = T.T('KHJ4600053');   //"气球贷(等额本息)",
		}else if($scope.itemDetailInf.repayMode == '15'){
			$scope.repayModeInfo = T.T('KHJ4600054');   //"气球贷(等额本金)",
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
        if($scope.itemDetailInf.feeCollectType == '0'){
			$scope.feeCollectType = T.T('KHJ4600036');//一次性收取
		}else if($scope.itemDetailInf.feeCollectType == '1'){
			$scope.feeCollectType = T.T('KHJ4600037');//分期收取
		}
		/*$scope.paramsObj ={
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
		};
		//$scope.tradeDetailList.search($scope.paramsObj);
		jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
			if (data.returnCode == '000000') {
				
				if(data.returnData.obj){
					$scope.totalBalance = data.returnData.obj.totalBalance;
				}else {
					$scope.totalBalance = 0;
				}
			}
		});*/
		//账户类型
		 $scope.subAccIdentifyArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_accType",
		        	queryFlag: "children"
		         },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.vwsubAccIdentify = $scope.itemDetailInf.subAccIdentify;
		        }
			};
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				'accountId': $scope.itemDetailInf.accountId,
				'externalIdentificationNo' : $scope.itemDetailInf.externalIdentificationNo,
				'currencyCode':$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					
					if(data.returnData.obj){
						$scope.totalBalance = data.returnData.obj.totalBalance;
					}else {
						$scope.totalBalance = 0;
					}
				}
			}
		};
	});
	//交易明细查询
	webApp.controller('viewCreditTradeAccCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo = T.T('F00144');   //'撤銷';
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = T.T('F00146');   //'正常';
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = T.T('F00145');   //'逾期';
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = T.T('F00147');   //'结清';
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = T.T('F00148');   //'全额退货';
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('F00088');   //'人民币';
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('F00095');   //'美元';
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4600028');   //'期末本息一次付清';
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4600029');   //'按固定周期付息、到期还本';
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4600030');   //'等额本息';
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4600031');   //'等额本金';
		}else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4600032');   //'等本等息';
		}else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4600033');   //'首期一次性付息分期还本';
		}else if($scope.itemDetailInf.repayMode == '14'){
			$scope.repayModeInfo = T.T('KHJ4600053');   //"气球贷(等额本息)";
		}else if($scope.itemDetailInf.repayMode == '15'){
			$scope.repayModeInfo = T.T('KHJ4600054');   //"气球贷(等额本金)"
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
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		
	});
	
	//批量信贷逾期还款明细1
	webApp.controller('overdueRepaymentCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.overInfList = {};
		$scope.itemoverdueInf = {};
		$scope.itemoverdueInf = $scope.overduequery;
		$scope.overInfList = $scope.overduequery.overdueInfoListPage;
		$scope.ORepaymentList = $scope.overduequery.overdueInfoListPage.interPriBeanByaccount;
		$scope.selectInfo = function(result){
			$scope.ORepaymentListInfo = result;
			$scope.ORepaymentListInfo.externalIdentificationNo = $scope.overduequery.externalIdentificationNo;
			
			$scope.modal('/cstSvc/instalmentsQuery/overdueInfo.html', $scope.ORepaymentListInfo, {
				title :T.T('KHJ4600004'),// '还款明细'
				buttons : [T.T('F00012') ],//'还款','关闭' 
				size : [ '1000px', '580px' ],
				callbacks : []
			});
		}
	});
	//批量信贷逾期还款明细2
	webApp.controller('overInfosCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.overdueList = {};
		$scope.overdueList = $scope.ORepaymentListInfo;
		$scope.ORepaymentListInfos = $scope.overdueList.interPriBeanByaccount;
		$scope.infoIShave = false;
		$scope.infoIsShow = false;
		if($scope.ORepaymentListInfos.length == 0){
			$scope.infoIShave = false;
			$scope.infoIsShow = true;
		}else{
			$scope.infoIShave = true;
			$scope.infoIsShow = false;
		}
		
	});
	//批量贷款变更
	webApp.controller('loanChangeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.loanquery = $scope.loanquery;
		//变更贷款方式
		$scope.loanArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_changeloanMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		}; 
		//还款方式
		$scope.repayModeListAll = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_repaymentMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//还款方式
		$scope.repayModeList = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_repaymentMethod",
				queryFlag : "children"
			},// 默认查询条件
			rmData: ['5','13','14','15'],
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//变更贷款方式联动验证
		var form = layui.form;
		form.on('select(getChangeType)',function(event){
			
			if(event.value == "1"){//期次变更
				$scope.isShowTermNo = true;
				$scope.isShowLoanRate = false;
				$scope.isShowRepayMode = false;
				$scope.loanquery.changeLoanRate = "";
				$scope.loanquery.changeRepayMode = "";
			}else if(event.value == "2"){//利率变更
				$scope.isShowTermNo = false;
				$scope.isShowLoanRate = true;
				$scope.isShowRepayMode = false;
				$scope.loanquery.changeTermNo = "";
				$scope.loanquery.changeRepayMode = "";
			}else if(event.value == "3"){//还款方式变更
				$scope.isShowTermNo = false;
				$scope.isShowLoanRate = false;
				$scope.isShowRepayMode = true;
				$scope.loanquery.changeTermNo = "";
				$scope.loanquery.changeLoanRate = "";
            }
        });
		//试算
		$scope.trialLoan = function(){
			if( ($scope.loanquery.changeRepayMode == '' || $scope.loanquery.changeRepayMode == undefined || $scope.loanquery.changeRepayMode == null) && 
					($scope.loanquery.changeLoanRate == '' || $scope.loanquery.changeLoanRate == undefined || $scope.loanquery.changeLoanRate == null) && 	
					($scope.loanquery.changeTermNo == '' || $scope.loanquery.changeTermNo == undefined || $scope.loanquery.changeTermNo == null)  ){
				jfLayer.alert(T.T('KHJ4600034'));
				return;
            }
            $scope.trailLoanTable.params.changeRepayMode=$scope.loanquery.changeRepayMode;
			$scope.trailLoanTable.params.changeLoanRate=$scope.loanquery.changeLoanRate;
			$scope.trailLoanTable.params.changeTermNo=$scope.loanquery.changeTermNo;
			$scope.trailLoanTable.search();
		};
		// 试算列表
		$scope.trailLoanTable = {
			params : {
				ecommPostingAcctNmbr: $scope.loanquery.accountId,
				ecommTransPostingCurr: $scope.loanquery.currencyCode,
				ecommEntryId: $scope.loanquery.ecommEntryId,
				externalIdentificationNo:$scope.externalIdentificationNo,
				pageSize : 10,
				indexNo : 0
			},
			paging : true,
			resource : 'creditLoanInfo.loanTrail',
			autoQuery : false,
			callback : function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowTrialLoan = true;
				} else {
					$scope.isShowTrialLoan = false;
				}
			}
		};
	});
	//批量提前还款试算明细
	webApp.controller('batchRepaymentCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itembatchInf = {};
		$scope.itembatchInf = $scope.batchrquery;
		$scope.batchInfList = $scope.itembatchInf.batchInfoListPage;
		$scope.batchrepaymentList = $scope.itembatchInf.batchInfoListPage.interPriBeanByaccount;
	});
	//批量信贷正常还款试算明细
	webApp.controller('normalRepaymentCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemnormalInf = {};    
		$scope.itemnormalInf = $scope.normalquery;
		$scope.normalInfList = $scope.itemnormalInf.normalInfoListPage.obj;
		$scope.normalrepaymentList = $scope.itemnormalInf.normalInfoListPage.rows;
		
	});
	//单个提前还款
	webApp.controller('layerPrepaymentCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInfPay = {};
		$scope.itemInfPay = $scope.prepayInf;
		$scope.isShowTrialLoans = false;
		if($scope.prepayInf.status == '0'){
			$scope.statusInfo = T.T('F00144');   //'撤銷';
		}else if($scope.prepayInf.status == '1'){
			$scope.statusInfo = T.T('F00146');   //'正常';
		}else if($scope.prepayInf.status == '2'){
			$scope.statusInfo = T.T('F00145');   //'逾期';
		}else if($scope.prepayInf.status == '3'){
			$scope.statusInfo = T.T('F00147');   //'结清';
		}
		else if($scope.prepayInf.status == '4'){
			$scope.statusInfo = T.T('F00148');   //'全额退货';
		}
		if($scope.prepayInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('F00088');   //'人民币';
		}else if($scope.prepayInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('F00095');   //'美元';
		}
		if($scope.prepayInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4600028');   //'期末本息一次付清';
		}else if($scope.prepayInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4600029');   //'按固定周期付息、到期还本';
		}else if($scope.prepayInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4600030');   //'等额本息';
		}else if($scope.prepayInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4600031');   //'等额本金';
		}else if($scope.prepayInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4600032');   //"等本等息";
		}else if($scope.prepayInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4600033');   //"首期一次性付息分期还本";
		}else if($scope.prepayInf.repayMode == '14'){
			$scope.repayModeInfo = T.T('KHJ4600053');   //"气球贷(等额本息)"
		}else if($scope.prepayInf.repayMode == '15'){
			$scope.repayModeInfo = T.T('KHJ4600054');   //"气球贷(等额本金)"
		}
		
		if($scope.prepayInf.loanType == 'MERH'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600009');//"商户分期";
		}else if($scope.prepayInf.loanType == 'TXAT'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600010');//"自动分期";
		}else if($scope.prepayInf.loanType == 'CASH'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600011');//"现金分期";
		}else if($scope.prepayInf.loanType == 'STMT'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600012');//"账单分期";
		}else if($scope.prepayInf.loanType == 'TRAN'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600013');//"交易分期";
		}else if($scope.prepayInf.loanType == 'LOAN'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600054');//"消费信贷";
		}else if($scope.prepayInf.loanType == 'APAY'){
			$scope.prepayInf.loanTypeTrans = T.T('KHH4600155');//"随借随还";
        }
        $scope.repaymentList =  {
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'creditLoanInfo.payMoney',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.trailResult = data.returnData.obj;
					$scope.isShowTrialLoans = true;
				}
			}
		};
		$scope.trailResult = {};
		//试算
		$scope.perpayTrial = function(){
			if($scope.partRepayAmt == '' || $scope.partRepayAmt == undefined || $scope.partRepayAmt == null){
				jfLayer.alert(T.T('KHJ4600035'));   //'请填写提前还款金额！');
				return;
            }
            $scope.repaymentList.params = {
					//"pageSize":10,
					"indexNo":0,
					partRepayAmt:	$scope.partRepayAmt,
					ecommPostingAcctNmbr: $scope.prepayInf.accountId,
					ecommTransPostingCurr: $scope.prepayInf.currencyCode,
					ecommEntryId: $scope.prepayInf.externalIdentificationNo,
			};
			$scope.repaymentList.search();
			/*jfRest.request('creditLoanInfo', 'payMoney', $scope.paramsPay).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowTrialLoans = true;
					//$scope.repaymentList = data.returnData.interPriBeanByaccount;
					//$scope.trailResult = data.returnData.obj;
					$scope.repaymentList.params = $.extend($scope.repaymentList.params,$scope.paramsPay);
					$scope.repaymentList.search();
				}else{
					$scope.isShowTrialLoans = false;
					var returnMsg = data.returnMsg ? data.returnMsg  : T.T('F00035');
					jfLayer.fail(returnMsg);//"交易失败"
				}
			});*/
		};
	});
	//现金分期 查询  交易明细查询
	webApp.controller('viewCreditTradeCardCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo = T.T('F00144');   //'撤銷';
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = T.T('F00146');   //'正常';
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = T.T('F00145');   //'逾期';
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = T.T('F00147');   //'结清';
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = T.T('F00148');   //'全额退货';
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('F00088');   //'人民币';
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('F00095');   //'美元';
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4600028');   //'期末本息一次付清';
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4600029');   //'按固定周期付息、到期还本';
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4600030');   //'等额本息';
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4600031');   //'等额本金';
		}else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4600032');   //'等本等息';
		}else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4600033');   //'首期一次性付息分期还本';
		}else if($scope.itemDetailInf.repayMode == '14'){
			$scope.repayModeInfo = T.T('KHJ4600053');   //"气球贷(等额本息)"
		}else if($scope.itemDetailInf.repayMode == '15'){
			$scope.repayModeInfo = T.T('KHJ4600054');   //"气球贷(等额本金)"
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
        // 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				'accountId': $scope.itemDetailInf.accountId,
				'externalIdentificationNo' : $scope.itemDetailInf.externalIdentificationNo,
				'currencyCode':$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData){
					if(data.returnData.obj){
						$scope.totalBalance = data.returnData.obj.totalBalance;
					}else {
						$scope.totalBalance = 0;
					}
				}
			}
		};
	});
	//S2 随借随还交易明细查询
	webApp.controller('viewCreditTradeAccS2Ctrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo = T.T('F00144');   //'撤銷';
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = T.T('F00146');   //'正常';
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = T.T('F00145');   //'逾期';
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = T.T('F00147');   //'结清';
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = T.T('F00148');   //'全额退货';
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('F00088');   //'人民币';
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('F00095');   //'美元';
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4600028');   //'期末本息一次付清';
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4600029');   //'按固定周期付息、到期还本';
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4600030');   //'等额本息';
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4600031');   //'等额本金';
		}else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4600032');   //'等本等息';
		}else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4600033');   //'首期一次性付息分期还本';
		}else if($scope.itemDetailInf.repayMode == '14'){
			$scope.repayModeInfo = T.T('KHJ4600053');   //"气球贷(等额本息)"
		}else if($scope.itemDetailInf.repayMode == '15'){
			$scope.repayModeInfo = T.T('KHJ4600054');   //"气球贷(等额本金)"
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
        //查询 已抛出金额
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
			autoQuery: false,
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	
	//信贷还款
	webApp.controller('layercreditS2PaymentS2Ctrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.prepayInf = $scope.prepayInf;
		$scope.normalrepaymentList =$scope.prepayInf.normalrepaymentList;
		
	});
	//原交易信息弹窗
	webApp.controller('orginTransInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		//$scope.ectypeArray = [{name : T.T('KHJ4600036'),id : '0'},{name : T.T('KHJ4600037'),id : '1'}];
		/*问题：根据原交易全局流水号可以定位到唯一的同源交易吗？
		二：事件编号怎么定位，传参需要*/
		//原交易信息 根据原交易全局流水号查询历史表
		$scope.sameSourceTransParams = {
			externalIdentificationNo: $scope.item.externalIdentificationNo,
			"globalSerialNumbr" : $scope.item.oldGlobalSerialNumbr,
			//"eventNo" : 'PT.40',//、、目前定位不到事件编号
			"logLevel" : "A",
			"activityNo" : "X8010",
			//"queryType" : "5"
			"transProperty":"O",	
		};
		jfRest.request('finacialTrans', 'query', $scope.sameSourceTransParams).then(function(data) {
			if (data.returnCode == '000000') {
				
				$scope.orginTransInfo = data.returnData.rows[0];
				
			} 
		});
	});
	//延期分期
	webApp.controller('layerDeferredStageCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		//延期期数 "3期""6期""9期""12期"
		$scope.termArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_delayPeriod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};

		$scope.itemInf = $scope.itemDetailInf;
		$scope.deferredInf = $scope.itemDetailInf;
		//延期分期试算
		$scope.deferredTrial = function() {
			if($scope.deferredInf.changePeriod  == undefined || $scope.deferredInf.changePeriod  == null || $scope.deferredInf.changePeriod  == ''){
				jfLayer.alert(T.T('KHJ4500008'));//"分期期数不能为空！"
				return;
            }
            $scope.trialParams= {
					/*idType: $scope.deferredInf.idType,
					idNumber: $scope.deferredInf.idNumber,
					externalIdentificationNo: $scope.deferredInf.externalIdentificationNo,
					ecommEntryId:$scope.deferredInf.externalIdentificationNo,
					ecommFeeCollectType: $scope.deferredInf.ecommFeeCollectType,
					ecommBusinessProgramCode: $scope.deferredInf.businessProgramNo,// 业务项目
					ecommBusineseType: $scope.deferredInf.businessTypeCode,
					ecommProdObjId:  $scope.deferredInf.productObjectCode,
					ecommCustId: $scope.deferredInf.customerNo,
					ecommTransPostingCurr: $scope.deferredInf.currencyCode,//币种
					ecommInstallmentPeriod: $scope.deferredInf.term,
					ecommTransAmount :$scope.deferredInf.loanAmt,*/
					ecommPostingAcctNmbr : $scope.itemInf.accountId,
					ecommCustId: $scope.itemInf.customerNo,
					ecommTransPostingCurr: $scope.itemInf.currencyCode,
					changePeriod: $scope.deferredInf.changePeriod,
					externalIdentificationNo: $scope.itemInf.externalIdentificationNo,
			};
			$scope.deferredTrailList.params = $scope.trialParams;
			$scope.deferredTrailList.search();
		};
		//延期分期试算
		$scope.deferredTrailList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.deferredTrail',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					if(data.returnData){
						$scope.deferredInf.term = data.returnData.obj.term;//延期总期数
						$scope.deferredInf.noThrowTerm = data.returnData.obj.noThrowTerm;//延期后未抛期次
						$scope.deferredInf.delayFee = data.returnData.obj.delayFee;//延期费用
						
						$scope.isShowStageResultInfo = true;
						
					}else {
						jfLayer.alert(T.T('KHH4600118'));
					}
				}else {
					$scope.isShowStageResultInfo = false;
				}
			}
		};
	});
	//暂停分期
	webApp.controller('layerPauseStageCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		//暂停期限"1期"2期""3期""4期""5期""6期"
		$scope.termArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_suspensionPeriod",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
				}
			};	
		
		$scope.itemInf = $scope.itemDetailInf;
		$scope.deferredInf = $scope.itemDetailInf;
		$scope.pauseInf = {};
		//暂停延期分期试算
		$scope.pauseTrial = function() {
		
			if($scope.pauseInf.suspendCycle  == undefined || $scope.pauseInf.suspendCycle  == null || $scope.pauseInf.suspendCycle  == ''){
				jfLayer.alert(T.T('KHJ4500008'));//"分期期数不能为空！"
				return;
            }
            $scope.trialParams= {
					ecommPostingAcctNmbr : $scope.itemInf.accountId,
					ecommCustId: $scope.itemInf.customerNo,
					ecommTransPostingCurr: $scope.itemInf.currencyCode,
					suspendCycle: $scope.pauseInf.suspendCycle,
					externalIdentificationNo: $scope.itemInf.externalIdentificationNo,
			};
			$scope.pauseTrailList.params = $scope.trialParams;
			$scope.pauseTrailList.search();
		};
		//暂停延期试算
		$scope.pauseTrailList = {
			//checkType : 'radio',
			autoQuery:false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'instalments.pauseTrail',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					if(data.returnData){
						$scope.pauseInf.suspendStartDate = data.returnData.obj.suspendStartDate;//暂停后开始时间
						$scope.pauseInf.suspendEndDate = data.returnData.obj.suspendEndDate;//暂停后开始时间
						$scope.pauseInf.suspendFee = data.returnData.obj.suspendFee;//暂停后开始时间
						
						$scope.isShowStageResultInfo = true;
					}else {
						jfLayer.alert(T.T('KHH4600118'));
					}
				}else {
					$scope.isShowStageResultInfo = false;
				}
			}
		};
	});
	//提前结清试算
	webApp.controller('earlySettlementCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();

		$scope.isResultTrail = false;
		//提前结清试算
		$scope.settleTrail = function(){
			$scope.trailParams = {};
			$scope.trailParams.ecommPostingAcctNmbr = $scope.earlyInf.accountId;
			$scope.trailParams.ecommTransPostingCurr = $scope.earlyInf.currencyCode;
			$scope.trailParams.ecommInstallmentBusinessType = $scope.earlyInf.loanType;
			$scope.trailParams.ecommTriggerFlag = "pageTrigger";
			$scope.trailParams.externalIdentificationNo = $scope.externalIdentificationNo;
			jfRest.request('creditLoanInfo', 'trailsettle', $scope.trailParams)
			    .then(function(data) {
			    	$scope.settleTrailInf = {};
			    	if(data.returnMsg == 'OK'){
			    		$scope.isResultTrail = true;
			    		$scope.settleTrailInf = data.returnData;
			    	}
			    	else{
			    		 jfLayer.fail(data.returnMsg);
			    	}
	            });
		};		
	});
	//关联交易
	webApp.controller('relatedTransactionsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.relativeTransicTable = {
			params : {
				"activityNo" : "X8010",
				"logLevel" : "A",
				"transProperty" : "O",
				externalIdentificationNo : $scope.itemInstalICInfo.externalIdentificationNo,
				accountId:$scope.itemInstalICInfo.accountId
			},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : true,
			isTrans: true,
			transParams: ['dic_ecommTransStatus'],
			transDict: ['transState_transStateDesc'],
			callback : function(data) {
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.checkInfoIC = function(event) {
			$scope.transDetailICInfo = {};
			$scope.transDetailICInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailICInfo = $.extend($scope.transDetailICInfo, $scope.balUnitPostingParams);
			$scope.modal('/cstSvc/instalmentsQuery/finaciTransICInfo.html',
				$scope.transDetailICInfo, {
					title : T.T('KHJ1800003'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '660px' ],
					callbacks : []
				});
		};
	});
	//查看弹窗
	webApp.controller('transDetailICCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		
	});
});
