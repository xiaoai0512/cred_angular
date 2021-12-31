'use strict';
define(function(require) {
	var webApp = require('app');
	//还款交易补录
	webApp.controller('rpyTxnSplmtEntrgCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rpyTxnSplmt');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.rpyTxnSplmtEntrgInfo ={};
		$scope.showEx = true;
		$scope.showAc = false;
		//动态请求下拉框 
		 $scope.currenyArr ={ 
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
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				//eventDesc : "指定币种还款",
				queryType:"P"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryFiniTrans',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
				if(row.eventNo == "ISS.RT.20.0001"){//显示外部识别号
					$scope.showEx = true;
					$scope.showAc = false;
					$('#disS').attr("disabled", false);
				}else if(row.eventNo == "ISS.RT.20.0002" ){ //显示账户
					$scope.showEx = false;
					$scope.showAc = true;
					$('#disS').attr("disabled", true);
				}
			}
		};
		//选择账户
		$scope.choseAccBtn = function(){
			if(!$scope.rpyTxnSplmtEntrgInfo.ecommEntryId){
				 jfLayer.alert(T.T('KHJ1500003'));//"请输入外部识别号！"
				 return;
            }
            $scope.params = {
					externalIdentificationNo: $scope.rpyTxnSplmtEntrgInfo.ecommEntryId
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/fncTxnMgt/payChoseAcc.html', $scope.params, {
				title : T.T('KHH1500013'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1100px', '480px' ],
				callbacks : [$scope.sureAccInfo]
			});
		};
		$scope.sureAccInfo = function(result){
			$scope.checkedItem = {};
			if(!result.scope.paychoseAccList.validCheck()){
				return;
			}else {
				$scope.checkedItem = result.scope.paychoseAccList.checkedList();
            }
            $scope.rpyTxnSplmtEntrgInfo.ecommPostingAcctNmbr = $scope.checkedItem.accountId;
			$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingCurr = $scope.checkedItem.currencyCode;
			$scope.rpyTxnSplmtEntrgInfo.ecommTransCurr = $scope.checkedItem.currencyCode;
			$scope.safeApply();
			result.cancel();
		};
		//获取小数位
		var i = 0;
		$scope.queryMoneyPoint = function(currencyCode){
			$scope.params.currencyCode = item.currencyCode;
			jfRest.request('disputeAccount', 'queryPoint', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					i = data.returnData.decimalPlaces;
				}
			});
		};
		//根据入账币种判断入账金额
		var form = layui.form;
		form.on('select(getrpyTxnCurr)',function(event){
			if(($scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == null || $scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == undefined || $scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == "") ||
					($scope.rpyTxnSplmtEntrgInfo.ecommTransAmount == null || $scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == undefined || $scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == "")){
				jfLayer.fail(T.T('KHJ1500005'));
				$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingCurr = "";

			}else{
				if($scope.rpyTxnSplmtEntrgInfo.ecommTransPostingCurr == $scope.rpyTxnSplmtEntrgInfo.ecommTransCurr){
					$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount = $scope.rpyTxnSplmtEntrgInfo.ecommTransAmount;
				}else{
					$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount = "";
				}
			}
		});
		//根据交易币种判断入账金额 交易金额
		form.on('select(getTransCur)',function(event){
			if($scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == $scope.rpyTxnSplmtEntrgInfo.ecommTransPostingCurr){
				$scope.rpyTxnSplmtEntrgInfo.ecommTransAmount = $scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount;
			}else{
				$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount = "";
			}
		});
		$("#transAmoun").on("keyup", function() {
			if($scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == $scope.rpyTxnSplmtEntrgInfo.ecommTransPostingCurr){
				$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount = $scope.rpyTxnSplmtEntrgInfo.ecommTransAmount;
			}else{
				$scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount = "";
			}
		});
		//确认
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            if(!$scope.rpyTxnSplmtEntrgInfo.ecommEntryId && !$scope.rpyTxnSplmtEntrgInfo.ecommPostingAcctNmbr){
				if($scope.showEx == true){
					 jfLayer.alert(T.T('KHJ1500003'));//"请输入外部识别号！"
					 return;
				}else if($scope.showAc == true){
					 jfLayer.alert(T.T('KHJ1500004'));//"请输入账户代码！"
					 return;
                }
            }
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.rpyTxnSplmtEntrgInfo.eventId = $scope.itemList.checkedList().eventNo;
			//交易金额 poc暂不获取后台小数位，默认乘100 poc暂前端处理
//			$scope.queryMoneyPoint($scope.rpyTxnSplmtEntrgInfo.ecommTransCurr);
//			$scope.rpyTxnSplmtEntrgInfo.ecommTransAmount = $scope.rpyTxnSplmtEntrgInfo.ecommTransAmount *100 ;
			//入账金额
//			$scope.queryMoneyPoint($scope.rpyTxnSplmtEntrgInfo.ecommPostingCurr);
//			$scope.rpyTxnSplmtEntrgInfo.ecommTranssPostingAmount = $scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount *100;
//			var str = $scope.itemList.checkedList().eventNo.split(".").join("");
//			var url = "saveRpyTxn"+str;
			if($scope.rpyTxnSplmtEntrgInfo.ecommTransCurr == $scope.rpyTxnSplmtEntrgInfo.ecommTransPostingCurr){
				if($scope.rpyTxnSplmtEntrgInfo.ecommTransAmount != $scope.rpyTxnSplmtEntrgInfo.ecommTransPostingAmount){
					jfLayer.fail(T.T('KHJ1500006'));
					return;
				}
            }
            jfRest.request('fncTxnMgt', 'trends', $scope.rpyTxnSplmtEntrgInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.rpyTxnSplmtEntrgInfo = {};
					 $scope.rpyTxnForm.$setPristine();
					 $scope.queryDate();
				}
			});
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.rpyTxnSplmtEntrgInfo.ecommTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
	});
	//选择账户弹窗payChoseAccCtrl
	webApp.controller('payChoseAccCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rpyTxnSplmt');
		$translate.refresh();
//		transDict: ['accountOrganForm_accountOrganFormDesc','businessDebitCreditCode_businessDebitCreditCodeDesc','statusCode_statusCodeDesc'],
		/*$scope.queryParam01 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_accountOrganForm",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
			function(data) {
				$scope.accountOrganList = [];
				$scope.accountOrganList = data.returnData.rows;
			}); 
			$scope.queryParam02 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_businessDebitCreditCode",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam02).then(
			function(data) {
				$scope.businessDebitCreditCodeList = [];
				$scope.businessDebitCreditCodeList = data.returnData.rows;
			});
			$scope.queryParam03 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_accStatusCode",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam03).then(
			function(data) {
				$scope.statusCodeList = [];
				$scope.statusCodeList = data.returnData.rows;
			});
			$scope.pageCountRpy = 0;
			 $scope.pageNumRpy = 1;
			 $scope.pageSizeRpy = 10;
			$scope.paychoseAccList = function(){
				layui.use(['treeTable'], function () {
			        var $ = layui.jquery;
			        var layer = layui.layer;
			        var util = layui.util;
			        var treeTable = layui.treeTable;
	
			        // 渲染表格
			        var insTb = treeTable.render({
			            elem: '#paychoseAccTable',
			            tree: {iconIndex: 1,  // 折叠图标显示在第几列
			            	onlyIconControl: true // 仅允许点击图标折叠
			            	}, 
			           // checkFlag:false,//子账户不需要复选框
			            even:true,//是否开启隔行变色
			            cols: [
			                   	{type: 'radio',title: '选择'},
			                   	{align: 'center',field: 'accountId', title: '账户代码',width:230},
			                   	{field: 'currencyDesc',align: 'center', title: '币种 ', width:70},
			                   	{field: 'businessProgram',align: 'center', title: '业务项目 ', width:150,singleLine:false,class: 'break-all'},
			                   	{field: 'businessType',align: 'center', title: '业务类型 ', width:150,singleLine:false,class: 'break-all'},
			                   	{field: 'productObject',align: 'center', title: '产品对象代码 ', width:150,singleLine:false,class: 'break-all'},
			                   	{field: 'accountOrganFormDescp',align: 'center', title: '组织形式 ', width:70},
			                   	{field: 'businessDebitCreditCodeDescp',align: 'center', title: '账户性质', width:70},
			                   	{field: 'statusCodeDescp',align: 'center', title: '账户状态码', width:70},
			                   	{field: 'totalBalance',align: 'center', title: '当前总余额 ', width:100},
			            ],
			            reqData: function (data1, callback) {
			            	if(data1){//子账户
			            		$scope.paramsMain = {};
								$scope.paramsMain = {
										externalIdentificationNo:$scope.params.externalIdentificationNo,
										accFlag : 'mainAcc',
										payFlag : 'Y',
										flag: 'N',
										accountOrganForm:data1.accountOrganForm,
										globalTransSerialNo:data1.globalTransSerialNo,	
										productObjectCode: data1.productObjectCode,	
										businessProgramNo: data1.businessProgramNo,	
										businessTypeCode: data1.businessTypeCode,		
										customerNo: data1.customerNo,         		
										currencyCode: data1.currencyCode,			
								}
			            	}else {//查主账户
								$scope.paramsMain = {};
								$scope.paramsMain = {
										externalIdentificationNo:$scope.params.externalIdentificationNo,
										pageFlag : 'mainPage',
										payFlag : 'Y',
										flag: 'N',
										pageNum: $scope.pageNumRpy,
			            		        pageSize: $scope.pageSizeRpy
								}
			            	};
			            	jfRest.request('accountView','queryMain',$scope.paramsMain).then(function(data) {
								if (data.returnCode == '000000' && data.returnData.rows != null) {
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCountRpy = data.returnData.totalCount;
	        							angular.forEach(data.returnData.rows,function(item,i){
		    								if(!data1){
		    									item.haveChild = true;
		    								}
		        							item.businessProgram = item.businessProgramNo + item.programDesc;
		        							item.businessType = item.businessTypeCode + item.businessDesc;
		        							item.productObject = item.productObjectCode + item.productDesc;
		        						});
		    							if($scope.accountOrganList.length > 0){
		    								for(var i=0;i<$scope.accountOrganList.length;i++){
		    									for(var j=0;j<data.returnData.rows.length;j++){
		    										if($scope.accountOrganList[i].codes == data.returnData.rows[j].accountOrganForm){
		    											data.returnData.rows[j].accountOrganFormDescp = $scope.accountOrganList[i].detailDesc;
		    										}
		    									}
		    								}
		    							}
		    							if($scope.businessDebitCreditCodeList.length > 0){
		    								for(var i=0;i<$scope.businessDebitCreditCodeList.length;i++){
		    									for(var j=0;j<data.returnData.rows.length;j++){
		    										if($scope.businessDebitCreditCodeList[i].codes == data.returnData.rows[j].businessDebitCreditCode){
		    											data.returnData.rows[j].businessDebitCreditCodeDescp = $scope.businessDebitCreditCodeList[i].detailDesc;
		    										}
		    									}
		    								}
		    							}
		    							if($scope.statusCodeList.length > 0){
		    								for(var i=0;i<$scope.statusCodeList.length;i++){
		    									for(var j=0;j<data.returnData.rows.length;j++){
		    										if($scope.statusCodeList[i].codes == data.returnData.rows[j].statusCode){
		    											data.returnData.rows[j].statusCodeDescp = $scope.statusCodeList[i].detailDesc;
		    										}
		    									}
		    								}
		    							}
	        							callback(data.returnData.rows);
	        							layui.use(['laypage', 'layer'], function(){
		      			                      var laypage = layui.laypage
		      			                      ,layer = layui.layer;
		      			                      laypage.render({
		      			                            elem: 'rpyTxnPage',
		      			                            count: $scope.pageCountRpy,
		      			                            limit: $scope.pageSizeRpy,
		      			                            curr: $scope.pageNumRpy,
		      			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
		      			                            jump: function(obj,first){
		      			                             if (!first) {
		      			                              $scope.pageNumRpy = obj.curr;
		      			                              $scope.pageSizeRpy = obj.limit;
		      			                              $scope.paychoseAccList();
		      			                             }
		      			                            }
		      			                        });
		      			                    });
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
	        						};
	                			}else {
	                				$scope.rows = [];
	    							callback($scope.rows);
//	                				data.returnData.rows = [];
//	    							callback(data.returnData.rows);
	                			};
				 			});
			            },
			        });
			        //监听复选框选择
			        treeTable.on('checkbox(paychoseAccTable)', function(obj){
			        	$rootScope.checkedList = {};
			            $rootScope.checkedList = obj.data;
			        });
			        //查询
			        $('#paychoseAccListSearch').click(function () {
			            if ($scope.accountId) {
			            	insTb.filterData($scope.accountId);
			            }else if($scope.businessTypeCode){
			            	insTb.filterData($scope.businessTypeCode);
			            }else {
			            	insTb.clearFilter();
			            }
			        });
			    });
			};
			$timeout(function(){
				$scope.paychoseAccList();
			},300);*/
		$scope.paychoseAccList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					pageFlag : 'mainPage',
					flag: 'N',
					externalIdentificationNo:$scope.params.externalIdentificationNo,
					payFlag : 'Y'
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountView.queryMain',// 列表的资源
			isTrans: true,
			transParams: ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],
			transDict: ['accountOrganForm_accountOrganFormDesc','businessDebitCreditCode_businessDebitCreditCodeDesc','statusCode_statusCodeDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
});
