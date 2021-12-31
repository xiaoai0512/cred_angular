'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易类活动日志查询
webApp.controller('transQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T,$timeout) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
	$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_deleteBlockCode');
	$translate.refresh();
	$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShowRelation = false;
		$scope.isShowSameSource = false;
		$scope.isShowPosting = false;
//		$scope.ectypeArray = [{name : T.T('KHJ1800017'),id : '0'},{name : T.T('KHJ1800018'),id : '1'}];
		$scope.hide_transQuery ={};
		//日期控件
		layui.use('laydate', function(){
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
		//动态请求下拉框交易类型
		 $scope.financialTypeArray ={
	        type:"dictData",
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_financialTransactions",
	        	queryFlag: "children"
	        },//默认查询条件
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action
	        callback: function(data){
	        	//console.log(data)
	        }
		};
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
		$scope.txnCgyAvyLogEnqrTable.params.idNumber = '';
		if(data.value == "1"){//身份证
			$("#transQuery_idNumber").attr("validator","id_idcard");
		}else if(data.value == "2"){//港澳居民来往内地通行证
			$("#transQuery_idNumber").attr("validator","id_isHKCard");
		}else if(data.value == "3"){//台湾居民来往内地通行证
			$("#transQuery_idNumber").attr("validator","id_isTWCard");
		}else if(data.value == "4"){//中国护照
			$("#transQuery_idNumber").attr("validator","id_passport");
		}else if(data.value == "5"){//外国护照passport
			$("#transQuery_idNumber").attr("validator","id_passport");
		}else if(data.value == "6"){//外国人永久居留证
			$("#transQuery_idNumber").attr("validator","id_isPermanentReside");
		};
	});
		$scope.reset = function(){
			$scope.txnCgyAvyLogEnqrTable.params.idNumber = '';
			$scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo = '';
			$scope.txnCgyAvyLogEnqrTable.params.startDate = '';
			$scope.txnCgyAvyLogEnqrTable.params.endDate = '';
			$scope.txnCgyAvyLogEnqrTable.params.idType= '';
			$scope.txnCgyAvyLogEnqrTable.params.customerNo= '';
			$scope.txnCgyAvyLogEnqrTable.params.businessType='';
			$scope.isShowRelation = false;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = false;
			$scope.	isShowDetail = false;
		};
		$scope.queryAccountInf = function() {
			$scope.txnCgyAvyLogEnqrTable.params.startDate = $("#LAY_demorange_zs").val();
			$scope.txnCgyAvyLogEnqrTable.params.endDate = $("#LAY_demorange_ze").val();
			$scope.isShowRelation = false;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = false;
			if (($scope.txnCgyAvyLogEnqrTable.params.idType == null || $scope.txnCgyAvyLogEnqrTable.params.idType == ''|| $scope.txnCgyAvyLogEnqrTable.params.idType == undefined) &&
					($scope.txnCgyAvyLogEnqrTable.params.customerNo == null || $scope.txnCgyAvyLogEnqrTable.params.customerNo == ''|| $scope.txnCgyAvyLogEnqrTable.params.customerNo == undefined) &&
					($scope.txnCgyAvyLogEnqrTable.params.idNumber == "" || $scope.txnCgyAvyLogEnqrTable.params.idNumber == undefined)
					&& ($scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo == "" || $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo == undefined)) {
				jfLayer.alert(T.T('KHJ1800001'));//"请输入任意查询条件！"
			}
			else {
				if($scope.txnCgyAvyLogEnqrTable.params["idType"]){
					if($scope.txnCgyAvyLogEnqrTable.params["idNumber"] == null || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowRelation = false;
						$scope.isShowSameSource = false;
						$scope.isShowPosting = false;
						$scope.isShowDetail = false;
					}else {
//						$scope.txnCgyAvyLogEnqrTable.search();
						$scope.queryMainAcc();//查询主子账户
//						$scope.testPage();//主子账户分页测试
					}
				}else if($scope.txnCgyAvyLogEnqrTable.params["idNumber"]){
					if($scope.txnCgyAvyLogEnqrTable.params["idType"] == null || $scope.txnCgyAvyLogEnqrTable.params["idType"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowRelation = false;
						$scope.isShowSameSource = false;
						$scope.isShowPosting = false;
						$scope.	isShowDetail = false;
					}else {
//						$scope.txnCgyAvyLogEnqrTable.search();
						$scope.queryMainAcc();//查询主子账户
//						$scope.testPage();//主子账户分页测试
					}
				}else {
//					$scope.txnCgyAvyLogEnqrTable.search();
					$scope.queryMainAcc();//查询主子账户
//					$scope.testPage();//主子账户分页测试
				}
			}
		};
		$scope.txnCgyAvyLogEnqrTable = {
			params : {
				"activityNo" : "X8010",
				"logLevel" : "A",
				"transProperty" : "O"
			},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_ecommTransStatus'],//查找数据字典所需参数
			transDict : ['transState_transStateDesc'],//翻译前后key
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowDetail = true;
				}else {
					$scope.isShowDetail = false;
				}
			}
		};


		/*=========================test1111111111111111111111======================*/
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
		//优化后 树形表格：查询主账户和子账户
		$scope.pageCount = 0;
		$scope.pageNumP = 1;
		$scope.pageSizeP = 10;
		$scope.queryMainAcc = function(){
		    layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#transTreeTable',
		            tree: {},
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
//		                {type: 'numbers'},
//		                {type: .'checkbox'},//radio
		                {align: 'left',field: 'accountId', title: T.T('KHH1800005'),width:230,templet: function(d){
		                    if(!d.externalIdentificationNo){
		                    	return '<span>'+ d.accountId+'</span>';
		                    }else if(d.externalIdentificationNo != '' ){
		                    	return '<span>'+ d.externalIdentificationNo+'</span>';
		                    };
		                }},
		                {field: 'transCurrDesc', title: T.T('KHH1800006'), width:60},
		                {field: 'transAmount', title: T.T('KHH1800007'), width:80},
		                {field: 'transDate', title: T.T('KHH1800008'), width:100},
		                {field: 'postingAmount', title: T.T('KHH1800009'), width:80},
		                {field: 'occurrDate', title: T.T('KHH1800084'), width:100},
		                {field: 'occurrTime', title: T.T('KHH1800010'), width:100},
		                {field: 'eventNo', title: T.T('KHH1800011'), width:100},
		                {field: 'transStateDesc', title: T.T('KHH1800030'),width:60},
		                {field: 'transDesc', title: T.T('KHH1800012'), width:200},
		                {field:'haveChild',align: 'center',  title: T.T('F00017'), width:450,templet: function(d){
		                	if(d.haveChild == true){
		                		if(d.buttonShow == true){
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryRelativeTrans">'+T.T("KHH1800124")+'</a>'+
			                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="querySameSourceTrans">'+T.T("KHH1800125")+'</a>'+
			                   		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryPostingInfo">'+T.T("KHH1800015")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryAccProcesseInf">'+T.T("KHH1800075")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryDelayLagInf">'+T.T("KHH1800122")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoIndex">'+T.T("F00014")+'</a>';
		                		}else{
		                			return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryRelativeTrans">'+T.T("KHH1800124")+'</a>'+
			                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="querySameSourceTrans">'+T.T("KHH1800125")+'</a>'+
			                   		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryPostingInfo">'+T.T("KHH1800015")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryAccProcesseInf">'+T.T("KHH1800075")+'</a>'+
			        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoIndex">'+T.T("F00014")+'</a>';
		                		}
		                	}else if(d.haveChild == false){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs"  lay-event="queryPostingInfo">'+T.T("KHH1800015")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryAccProcesseInf">'+T.T("KHH1800075")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="checkInfoIndex">'+T.T("F00014")+'</a>';
		                	}
		                },}//toolbar templet: '#transHandle',
		            ],
//		            style: 'max-height:200px',
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					// transProperty  : "O",
		    					externalIdentificationNo:  $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
		    					idType:  $scope.txnCgyAvyLogEnqrTable.params.idType,
		    					idNumber:  $scope.txnCgyAvyLogEnqrTable.params.idNumber,
                                startDate:  $scope.txnCgyAvyLogEnqrTable.params.startDate,
                                endDate:  $scope.txnCgyAvyLogEnqrTable.params.endDate,
                                businessType:  $scope.txnCgyAvyLogEnqrTable.params.businessType,
                                accFlag : "mainAcc",
		    					globalSerialNumbr : data1.globalSerialNumbr,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
		    					queryType : '2',
		    					eventNo: data1.eventNo
	                		};
		            		if($scope.params.pageFlag){
		            			delete $scope.params.pageFlag;
		            		};
		            	}else {//查主账户
		            		$scope.params = {
		    					activityNo : "X8010",
		    					logLevel : "A",
		    					transProperty  : "O",
		    					externalIdentificationNo:  $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
		    					idType:  $scope.txnCgyAvyLogEnqrTable.params.idType,
		    					idNumber:  $scope.txnCgyAvyLogEnqrTable.params.idNumber,
                                startDate:  $scope.txnCgyAvyLogEnqrTable.params.startDate,
                                endDate:  $scope.txnCgyAvyLogEnqrTable.params.endDate,
                                businessType:  $scope.txnCgyAvyLogEnqrTable.params.businessType,
                                pageFlag : "mainPage",
		    					pageNum: $scope.pageNumP,
		    			        pageSize: $scope.pageSizeP
	                		};
		            		if($scope.params.accFlag){
		            			delete $scope.params.accFlag;
		            		};
		            	};
		            	jfRest.request('finacialTrans', 'queryMainnAndChildAcc', $scope.params).then(function(data) {
                			if(data1){//子账户
                				if(data.returnCode == '000000'){
                					$scope.isShowDetail = true;
                					if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
                						angular.forEach(data.returnData.rows,function(item,i){
                							item.haveChild = false;
                							for(var k = 0; k < $scope.transStateList.length; k++){
                								if(item.transState == $scope.transStateList[k].codes){
                									item.transStateDesc = $scope.transStateList[k].detailDesc;
    	            							};
                							};
            							});
            							callback(data.returnData.rows);
                					}else {
                						$scope.rows = [];
            							callback($scope.rows);
                					}

                				}else {
                					$scope.isShowDetail = false;
                				};
                			}else {//主账户
                				if(data.returnCode == '000000'){
                					$scope.isShowDetail = true;
                					if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
                						$scope.pageCount = data.returnData.totalCount;
                						console.log(data);

            							pageInit($scope.pageCount,"pageDemo");//初始化分页
            							angular.forEach(data.returnData.rows,function(item,i){
            								item.haveChild = true;
            								if(item.eventNo.search('PT.20') > 0 || item.eventNo.search('PT.13') > 0 || item.eventNo.search('PT.41') > 0 || item.eventNo.search('PT.43') > 0 || item.eventNo.search('PT.61') > 0){
                    							console.log(2);
                    							item.buttonShow = true;
                    						}else{
                    							console.log(3);
                    							item.buttonShow = false;
                    						}
            								for(var k = 0; k < $scope.transStateList.length; k++){
                								if(item.transState == $scope.transStateList[k].codes){
                									item.transStateDesc = $scope.transStateList[k].detailDesc;
    	            							};
                							};
            							});
            							console.log(data.returnData.rows);
            							callback(data.returnData.rows);
            							layui.use(['laypage', 'layer'], function(){
    					                      var laypage = layui.laypage;
    					                      laypage.render({
    					                            elem: 'pageDemo',
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
                					}else {
                						$scope.rows = [];
            							callback($scope.rows);
            							$scope.pageCount = 0;
            							pageInit($scope.pageCount,"pageDemo");//初始化分页
                					}
                				}else {
                					$scope.isShowDetail = false;
                				};
                			};
                		});
		            }, 800);//setTimeout
		            },
		        });
		        treeTable.on('tool(transTreeTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'queryRelativeTrans') {
		                $scope.queryRelativeTrans(obj.data);
		            } else if (event == 'querySameSourceTrans') {
		                $scope.querySameSourceTrans(obj.data);
		            }else if(event == 'queryPostingInfo'){
		            	 $scope.queryPostingInfo(obj.data);
		            }else if(event == 'queryAccProcesseInf'){
		            	 $scope.queryAccProcesseInf(obj.data);
		            }else if(event == 'checkInfoIndex'){
		            	 $scope.checkInfoIndex(obj.data);
		            }else if(event == 'queryDelayLagInf'){
		            	$scope.queryDelayLagInf(obj.data);
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
		/*=========================test1111111111111111111111end======================*/
		// 关联交易按钮
		$scope.queryRelativeTrans = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = false;
			$scope.transRelativeParams = $.parseJSON(JSON
					.stringify(event));
			$scope.relativeTransTable.params = {
				globalSerialNumbr : $scope.transRelativeParams.globalSerialNumbr,
				globalSerialNumbrRelative:$scope.transRelativeParams.globalSerialNumbrRelative,
				idType: $scope.txnCgyAvyLogEnqrTable.params.idType,
				idNumber: $scope.txnCgyAvyLogEnqrTable.params.idNumber,
				externalIdentificationNo : $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
				businessType:$scope.txnCgyAvyLogEnqrTable.params.businessType,
				eventNo:"ISS.PT.60.0002",
				queryType: "6"
			};
			$scope.relativeTransTable.search();
		};
		//<!-- 关联交易 -->
		$scope.relativeTransTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.queryRelativeTransEvent',
			autoQuery : false,
			callback : function(data) {
			}
		}
		// 同源交易按钮
		$scope.querySameSourceTrans = function(event) {
			$scope.isShowRelation = false;
			$scope.isShowSameSource = true;
			$scope.isShowPosting = false;
			$scope.transSameSourceParams = $.parseJSON(JSON.stringify(event));
			$scope.sameSourceTransTable.params = {
				"globalSerialNumbr" : $scope.transSameSourceParams.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010|X8011",
				"queryType" : "1"
			}
			$scope.sameSourceTransTable.params.externalIdentificationNo = $scope.transSameSourceParams.externalIdentificationNo;
			$scope.sameSourceTransTable.params.idType =  $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.sameSourceTransTable.params.idNumber =  $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.sameSourceTransTable.params.businessType=$scope.txnCgyAvyLogEnqrTable.params.businessType;
			$scope.sameSourceTransTable.search();
		}
		//同源交易
		$scope.sameSourceTransTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : false,
			callback : function(data) {
			}
		}
		// 入账情况按钮,查询余额类型入账情况
		$scope.queryPostingInfo = function(event) {
			$scope.isShowRelation = false;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = true;
//			$scope.transPostingParams = $.parseJSON(JSON.stringify(event));
			$scope.transPostingParams = event;
			$scope.postingInfoTable.params = {
					"globalSerialNumbr" : $scope.transPostingParams.globalSerialNumbr,
					"accountId" : $scope.transPostingParams.accountId,
					"currencyCode" : $scope.transPostingParams.currencyCode,
					"logLevel" : "T"
			};
			//入账情况，主张和和子账户标识
			if(event.haveChild){//主账户
				delete $scope.postingInfoTable.params.accFlag;
				$scope.postingInfoTable.params.pageFlag = "mainPage";
			}else {//子账户
				delete $scope.postingInfoTable.params.pageFlag;
				$scope.postingInfoTable.params.accFlag = "mainAcc";
			};
			$scope.postingInfoTable.params.externalIdentificationNo = $scope.transPostingParams.externalIdentificationNo;
			$scope.postingInfoTable.params.idType =  $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.postingInfoTable.params.idNumber =  $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.postingInfoTable.params.businessType=$scope.txnCgyAvyLogEnqrTable.params.businessType;
			$scope.postingInfoTable.search();
		};
		//入账情况
		$scope.postingInfoTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.queryMainnAndChildAcc',// 'finacialTrans.query'
			autoQuery : false,
			isTrans: true,
			transParams: ['dic_balanceType'],
			transDict: ['balanceType_balanceTypeDesc'],
			callback : function(data) {
			}
		}
		// 关联交易列表中的同源交易按钮
		$scope.querySameSourceTrans2 = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = true;
			$scope.isShowPosting = false;
			$scope.transSameSourceParams2 = $.parseJSON(JSON
					.stringify(event));
			$scope.sameSourceTransTable.params = {
				"globalSerialNumbr" : $scope.transSameSourceParams2.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams2.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "1",
				idType : $scope.txnCgyAvyLogEnqrTable.params.idType,
				idNumber : $scope.txnCgyAvyLogEnqrTable.params.idNumber,
				externalIdentificationNo : $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
				businessType:$scope.txnCgyAvyLogEnqrTable.params.businessType,
			};
			$scope.sameSourceTransTable.search();
		}
		// 关联交易列表中的入账情况按钮
		$scope.queryPostingInfo2 = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = true;
			$scope.transPostingParams2 = $.parseJSON(JSON
					.stringify(event));
			$scope.postingInfoTable.params = {
					"globalSerialNumbr" : $scope.transPostingParams2.globalSerialNumbr,
					"accountId" : $scope.transPostingParams2.accountId,
					"currencyCode" : $scope.transPostingParams2.currencyCode,
					"logLevel" : "T",
					idType : $scope.txnCgyAvyLogEnqrTable.params.idType,
					idNumber : $scope.txnCgyAvyLogEnqrTable.params.idNumber,
					externalIdentificationNo : $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
					businessType:$scope.txnCgyAvyLogEnqrTable.params.businessType,
			}
			$scope.postingInfoTable.search();
		};
		// 余额单元入账情况查询
		$scope.queryBalUnitInfo = function(event) {
			$scope.balUnitPostingParams = $.parseJSON(JSON.stringify(event));
			$scope.balUnitPostingParams.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.balUnitPostingParams.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.balUnitPostingParams.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			$scope.balUnitPostingParams.businessType = $scope.txnCgyAvyLogEnqrTable.params.businessType;
			$scope.modal('/cstSvc/txnInfEnqr/balUnitPostingInfo.html',
				$scope.balUnitPostingParams, {
					title : T.T('KHJ1800002'),
					buttons : [ T.T('F00012') ],
					size : [ '1100px', '550px' ],
					callbacks : []
				});
		};
		// 页面弹出框事件(弹出页面)
		$scope.checkInfoIndex = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.transDetailInfo.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.transDetailInfo.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			$scope.transDetailInfo.businessType=$scope.txnCgyAvyLogEnqrTable.params.businessType;
			$scope.modal(
				'/cstSvc/txnInfEnqr/finaciTransDetailInfo.html',
				$scope.transDetailInfo, {
					title : T.T('KHJ1800003'),
					buttons : [ T.T('F00012') ],
					size : [ '1050px', '580px' ],
					callbacks : []
				});
		};
		//核算处理查询
		$scope.queryAccProcesseInf = function(event) {
			$scope.accProcesseInf = $.parseJSON(JSON.stringify(event));
			$scope.accProcesseInf.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.accProcesseInf.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			if($scope.accProcesseInf.haveChild){
				$scope.accProcesseInf.accountId = "";
			}
			$scope.modal('/cstSvc/txnInfEnqr/layerAccProcesse.html',$scope.accProcesseInf, {
					title : T.T('KHJ1800023'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '500px' ],
					callbacks : []
			});
		};
		//延滞冲减查询
		$scope.queryDelayLagInf= function(event) {
			$scope.delayLagInf = $.parseJSON(JSON.stringify(event));
			$scope.delayLagInf.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.delayLagInf.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.modal('/cstSvc/txnInfEnqr/layerDelayLag.html',$scope.delayLagInf, {
					title : T.T('KHJ1800059'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '500px' ],
					callbacks : []
			});
		};
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
		};
		$scope.eventNoTrends = "";
		$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
		$scope.stagingParams = {};
		$scope.stagingParams.eventNo = $scope.itemList.checkedList().eventNo;//事件号
		$scope.stagingParams.ecommTransPostingAmount = $scope.stagingInfo.transAmount;//分期金额
		$scope.stagingParams.ecommEntryId = $scope.stagingInfo.externalIdentificationNo//页面输入的外部识别号
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
	}
	//交易分期试算弹框
	$scope.trialByStagesInfo = function(){
		if (!$scope.itemList.validCheck()) {
			return;
		};
		$scope.params = $scope.stagingInfo;
		$scope.params.eventNo = $scope.itemList.checkedList().eventNo;
		$scope.params.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
		$scope.params.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;
		$scope.params.ecommTransAmount=$scope.stagingInfo.transAmount;
		$scope.params.ecommTransPostingCurr=$scope.stagingInfo.currencyCode;
		if(!$scope.itemList.validCheck()){
			return;
		};
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
//交易分期试算弹窗stagingRoundsDetailCtrl
    webApp.controller('stagingRoundsDetailCtrl', function($scope, $stateParams, jfRest,
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
			ecommFeeCollectType: $scope.params.ecommFeeCollectType,//费用收取方式
			ecommBusineseType: $scope.params.ecommBusineseType,//业务类型
			ecommInstallmentPeriod: $scope.params.ecommInstallmentPeriod,//分期期数
			ecommPostingAcctNmbr: $scope.params.ecommPostingAcctNmbr,
			ecommProdObjId: $scope.params.ecommProdObjId,
			ecommTransAmount: $scope.params.ecommTransAmount,//分期金额
			ecommTransPostingCurr: $scope.params.ecommTransPostingCurr,
			ecommInstallmentBusinessType: $scope.params.ecommInstallmentBusinessType,//分期业务类型
			ecommBusinessProgramCode: $scope.params.ecommBusinessProgramCode,//业务项目
			receiveAccount:  $scope.params.receiveAccount,
			ecommSourceCde : $scope.params.ecommSourceCde,
			accountBankNo: $scope.params.accountBankNo,
			freeFlag: $scope.params.freeFlag,
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

/*交易分期end*/
//余额单元入账情况查询  弹窗
webApp.controller('balUnitPostingQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
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
				"balanceType":$scope.balUnitPostingParams.balanceType
			},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : true,
			isTrans: true,
			transParams: ['dic_balanceType'],
			transDict: ['balanceType_balanceTypeDesc'],
			callback : function(data) {
			}
		}
		// 页面弹出框事件(弹出页面)
		$scope.checkInfoModal = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.transDetailInfo.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.modal('/cstSvc/txnInfEnqr/finaciTransDetailInfo.html',
				$scope.transDetailInfo, {
					title : T.T('KHJ1800003'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '660px' ],
					callbacks : []
				});
		};
	});
	//查看弹窗
	webApp.controller('transDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
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
					$scope.custSystemUnitNo = data.returnData.systemUnitNo;
					$scope.queryTransDate($scope.custSystemUnitNo);//将下一处理时间赋值交易时间
				};
			});
		};
		//获得查询客户的系统单元，非登录用户====代码重复
//		$scope.getCustSystemUnitNo =  function(){
//			$scope.custSystemUnitNo = '';
//			$scope.custParams = {
//				idType: $scope.transDetailInfo.idType,
//				idNumber : $scope.transDetailInfo.idNumber,
//				externalIdentificationNo :$scope.transDetailInfo.externalIdentificationNo,
//			};
//			jfRest.request('cstInfQuery', 'queryInf', $scope.custParams).then(function(data) {
//				if (data.returnCode == '000000') {
//					$scope.custSystemUnitNo = data.returnData.systemUnitNo;
//					$scope.queryTransDate($scope.custSystemUnitNo);//将下一处理时间赋值交易时间
//				};
//			});
//		};
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
		//$scope.getCustSystemUnitNo();//获取下一处理日作为交易时间====代码重复
		$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				if( data.returnData){
					//判断是否可做争议登记，disputeFlag==‘Y’ 时可争议
					$scope.disputeFlagInfo = data.returnData.disputeFlag;
				}
			}
		});
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
			};
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
				"ecommClearAmount" : e.settlementAmount,
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
		  			jfLayer.success(T.T('F00054'));
//		  			$scope.txnCgyAvyLogEnqrTable.search();
		  			$scope.queryMainAcc();;
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
			};
			$scope.flag = Number($scope.ecommTransPostingAmount)+Number($scope.transDetailInfo.rejectedAmount) <= $scope.transDetailInfo.actualPostingAmount ? true : false;
			if(!$scope.flag){
				jfLayer.alert(T.T('F00193'));
				return;
			};
			var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
			};
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
					jfLayer.success(T.T('F00054'));
//		  			$scope.txnCgyAvyLogEnqrTable.search();
		  			$scope.queryMainAcc();;
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
					jfLayer.success(T.T('KHJ1800013'));
//		  			$scope.txnCgyAvyLogEnqrTable.search();
		  			$scope.queryMainAcc();;
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
					jfLayer.success(T.T('KHJ1800019'));
//		  			$scope.txnCgyAvyLogEnqrTable.search();
		  			$scope.queryMainAcc();;
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
					jfLayer.success(T.T('KHJ1800020'));
//		  			$scope.txnCgyAvyLogEnqrTable.search();
		  			$scope.queryMainAcc();;
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
			$scope.paramsInstal = {
				oldGlobalSerialNumbr:$scope.itemDetailInf.globalSerialNumbr,
				externalIdentificationNo:$scope.itemDetailInf.externalIdentificationNo,
				idType : $scope.itemDetailInf.idType,
				idNumber : $scope.itemDetailInf.idNumber,
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
	//核算处理查询
	webApp.controller('layerAccProcesseCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.accProcesseInf = $scope.accProcesseInf;
		//根据外部识别号，全部流水号查询核算处理查询
		$scope.accProcesseList = {
			params : {
					pageSize:10,
					indexNo:0,
					modifyType: 'ALL',
					accountId : $scope.accProcesseInf.accountId,
					externalIdentificationNo : $scope.accProcesseInf.externalIdentificationNo,
					idType: $scope.accProcesseInf.idType,
					idNumber: $scope.accProcesseInf.idNumber,
					globalSerialNumber : $scope.accProcesseInf.globalSerialNumbr
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			//autoQuery: false,
			resource : 'accountingMag.queryAccProcesse',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
				}
			}
		};
		//查询
		$scope.checkAccProcesseDetail = function(event){
			$scope.accProcesseInfo = $.parseJSON(JSON.stringify(event));
			$scope.accProcesseInfo.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			$scope.accProcesseInfo.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			$scope.accProcesseInfo.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			$scope.accProcesseInfo.businessType=$scope.txnCgyAvyLogEnqrTable.params.businessType;
			$scope.modal('/cstSvc/txnInfEnqr/accProcesseDetail.html',$scope.accProcesseInfo, {
					title : T.T('KHJ1800023'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '550px' ],
					callbacks : []
			});
		};
	})
	//核算处理查询详情
	webApp.controller('accProcesseDetailCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.operationModeArr ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.queryMode",//数据源调用的action
		        callback: function(data){
		        	//$scope.updateOperationMode = $scope.optModeInf2.operationMode;
		        	$scope.viewOperationMode = $scope.accProcesseInfo.operationMode;
		        }
		    };
		$scope.accProcesseInfo = $scope.accProcesseInfo;
		//'记账标识 I：内部帐 L：科目',
		if($scope.accProcesseInfo.accountingFlag == 'I') {
			$scope.accProcesseInfo.accountingFlagTrans = T.T('KHJ1800025');
		}else if($scope.accProcesseInfo.accountingFlag == 'L'){
			$scope.accProcesseInfo.accountingFlagTrans = T.T('KHJ1800026');
		}
		 //'借贷方向 D：借方 C：贷方',
		if($scope.accProcesseInfo.drcrFlag == 'D') {
			$scope.accProcesseInfo.drcrFlagTrans = T.T('KHJ1800027');
		}else if($scope.accProcesseInfo.drcrFlag == 'C'){
			$scope.accProcesseInfo.drcrFlagTrans = T.T('KHJ1800028');
		};
	});
	//查询争议账户查询
	webApp.controller('transDisputeAccDetailCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		/*溢缴款冻结状态 F-已冻结，U-已解冻，N-无冻结
		额度占用标识： 1-占额，0-不占额
		状态码：D-登记未释放，C-已释放利于客户，B-已释放利于银行*/
		//溢缴款冻结状态
		/*$scope.overpayFreezeStatusArr = [{name : T.T('KHJ1800029'),id : 'F'},{name : T.T('KHJ1800030'),id : 'U'},{name : T.T('F00109'),id : 'N'}];
		//额度占用标识
		$scope.amtOccFlagArr = [{name : T.T('KHJ1800031'),id : '1'},{name : T.T('KHJ1800033'),id : '0'}];
		//状态码
		$scope.statusCodeArr = [{name : T.T('KHJ1800033'),id : 'D'},{name : T.T('KHJ1800034'),id : 'C'},{name : T.T('KHJ1800035'),id : 'B'}];*/
		$scope.overpayFreezeStatusArr  ={
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
	$scope.statusCodeArr={
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
		//查询争议账户详情
		$scope.queryDisputeInf = function(){
			$scope.params = {
					customerNo : $scope.disputeItem.customerNo,
					currencyCode: $scope.disputeItem.postingCurrencyCode,//入账币种
					externalIdentificationNo : $scope.disputeItem.externalIdentificationNo,
					oldGlobalSerialNumbr: $scope.disputeItem.globalSerialNumbr,
			};
			jfRest.request('accBscInf', 'queryDisputeAccList', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData){
						if(data.returnData.rows){
							$scope.disputeInf = data.returnData.rows[0];
							//账户组织形式
							if($scope.disputeInf.accountOrganForm == "R"){
								$scope.disputeInf.accountOrganFormTrans = T.T('KHJ1800036');//"循环";
							}else if($scope.disputeInf.accountOrganForm == "T"){
								$scope.disputeInf.accountOrganFormTrans = T.T('KHJ1800037');//"交易";
							};
							//账户性质
							if($scope.disputeInf.businessDebitCreditCode=='C'){
								$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ1800038');//"贷记";
							}else if($scope.disputeInf.businessDebitCreditCode=='D'){
								$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ1800039');//"借记";
							};
							//账户状态
							if($scope.disputeInf.statusCode==1){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800040');//"活跃账户";
							}else if($scope.disputeInf.statusCode==2){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800041');//"非活跃账户";
							}else if($scope.disputeInf.statusCode==3){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800042');//"冻结账户";
							}else if($scope.disputeInf.statusCode==8){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800043');//"关闭账户";
							}else if($scope.disputeInf.statusCode==9){
								$scope.disputeInf.statusCodeTrans = T.T('KHJ1800044');//"待删除账户";
							};
						}
					}
				}
			});
		};
		$scope.queryDisputeInf();
	});
	//分期账户信息查询
	webApp.controller('stagingAccInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemDetailInf = $scope.itemDetailInf;
		$scope.paramsObj ={
				oldGlobalSerialNumbr :$scope.itemDetailInf.globalSerialNumbr,
//				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo
		};
		jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.obj){
					$scope.totalBalance = data.returnData.obj.totalBalance;
					$scope.itemInf = data.returnData.obj;
					if($scope.itemInf.status == '0'){
						$scope.statusInfo = T.T('KHJ1800045');
					}else if($scope.itemInf.status == '1'){
						$scope.statusInfo = T.T('KHJ1800046');
					}else if($scope.itemInf.status == '2'){
						$scope.statusInfo = T.T('KHJ1800047');
					}else if($scope.itemInf.status == '3'){
						$scope.statusInfo = T.T('KHJ1800048');
					}
					else if($scope.itemInf.status == '4'){
						$scope.statusInfo = T.T('KHJ1800049');
					}
					if($scope.itemInf.currencyCode == '156'){
						$scope.currencyCodeInfo = T.T('F00088');
					}else if($scope.itemInf.currencyCode == '840'){
						$scope.currencyCodeInfo = T.T('F00095');
					}else if($scope.itemInf.currencyCode == '392'){
						$scope.currencyCodeInfo = T.T('F00186');
					}else if($scope.itemInf.currencyCode == '344'){
						$scope.currencyCodeInfo = T.T('F00187');
					}
					if($scope.itemInf.repayMode == '0'){
						$scope.repayModeInfo = T.T('KHJ1800052');
					}else if($scope.itemInf.repayMode == '2'){
						$scope.repayModeInfo = T.T('KHJ1800053');
					}else if($scope.itemInf.repayMode == '3'){
						$scope.repayModeInfo = T.T('KHJ1800054');
					}else if($scope.itemInf.repayMode == '4'){
						$scope.repayModeInfo = T.T('KHJ1800055');
					}
					else if($scope.itemInf.repayMode == '5'){
						$scope.repayModeInfo = T.T('KHJ1800056');
					}
					else if($scope.itemInf.repayMode == '13'){
						$scope.repayModeInfo = T.T('KHJ1800057');
					}
					if($scope.itemInf.loanType == 'MERH'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600009');//"商户分期";
					}else if($scope.itemInf.loanType == 'TXAT'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600010');//"自动分期";
					}else if($scope.itemInf.loanType == 'CASH'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600011');//"现金分期";
					}else if($scope.itemInf.loanType == 'STMT'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600012');//"账单分期";
					}else if($scope.itemInf.loanType == 'TRAN'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600013');//"交易分期";
					}else if($scope.itemInf.loanType == 'LOAN'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600054');//"消费信贷";
					}else if($scope.itemInf.loanType == 'APAY'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600155');//"随借随还";
					};
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
//				'accountId': $scope.itemDetailInf.accountId,
				oldGlobalSerialNumbr :$scope.itemDetailInf.globalSerialNumbr,
				'externalIdentificationNo' : $scope.itemDetailInf.externalIdentificationNo,
				'currencyCode':$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//分期账户信息查询
	webApp.controller('transInstalQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		//信贷交易账户信息列表
		$scope.creditTradeInstalList = {
			autoQuery:true,
			params : {
				oldGlobalSerialNumbr:$scope.itemDetailInf.globalSerialNumbr,
				externalIdentificationNo:$scope.itemDetailInf.externalIdentificationNo,
				idType : $scope.itemDetailInf.idType,
				idNumber : $scope.itemDetailInf.idNumber,
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row){
			}
		};
		//查看
		$scope.checkInfoInstalTrans = function(event){
			$scope.itemDetailInf = {};
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			console.log($scope.itemDetailInf);
			$scope.modal('/cstSvc/txnInfEnqr/transStagingAccInfoLayer.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				buttons : [T.T('F00012')],//'关闭'
				size : [ '1050px', '580px' ],
				callbacks : [ ]
			});
		}
	});
	//分期账户信息查询
	webApp.controller('transStagingAccInfoLayerCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			params : $scope.queryParam = {
				pageSize : 10,
				indexNo : 0,
				accountId: $scope.itemInf.accountId,
				externalIdentificationNo : $scope.itemInf.externalIdentificationNo,
				currencyCode:$scope.itemInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//延滞冲减表
	webApp.controller('layerDelayLagCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/cstDelinquencyList/i18n_cstDelinquencyList');
		$translate.refresh();
		$scope.delayLagItem = $scope.delayLagInf;
		//根据外部识别号，全部流水号查询核算处理查询
		$scope.delayLagList = {
			params : {
					pageSize:10,
					indexNo:0,
					externalIdentificationNo : $scope.delayLagItem.externalIdentificationNo,
					idType: $scope.delayLagItem.idType,
					idNumber: $scope.delayLagItem.idNumber,
					globalSerialNumbr : $scope.delayLagItem.globalSerialNumbr,
					customerNo : $scope.delayLagItem.customerNo
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			//autoQuery: false,
			resource : 'delayLag.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
				}
			}
		};
		//查询
		$scope.checkDelayLagDetail = function(event){
			$scope.delayLagInfo = $.parseJSON(JSON.stringify(event));
			$scope.delayLagInfo.idType = $scope.delayLagItem.idType;
			$scope.delayLagInfo.idNumber = $scope.delayLagItem.idNumber;
			$scope.delayLagInfo.externalIdentificationNo = $scope.delayLagItem.externalIdentificationNo;
			$scope.delayLagInfo.businessType=$scope.delayLagItem.businessType;
			$scope.modal('/cstSvc/txnInfEnqr/delayLagDetail.html',$scope.delayLagInfo, {
					title : T.T('KHJ1800058') ,
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '460px' ],
					callbacks : []
			});
		};
	});
	//延滞冲减详情
	webApp.controller('delayLagDetailCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.delayLagItemInfo = $scope.delayLagInfo;
		$scope.operationModeArr ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.queryMode",//数据源调用的action
		        callback: function(data){
		        	//$scope.updateOperationMode = $scope.optModeInf2.operationMode;
		        	$scope.viewOperationMode = $scope.delayLagItemInfo.operationMode;
		        }
		    };
	});
	//部分退货金额
	webApp.controller('layerPartReturnedCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.partReturnedInf = $scope.e;
	});
});
