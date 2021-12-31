'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('occurrAmtTransCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_occurrAmtTrans');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
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
			$scope.accListForm.idNumber = '';
			if(data.value == "1"){//身份证
				$("#occurrAmtTrans_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#occurrAmtTrans_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#occurrAmtTrans_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#occurrAmtTrans_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#occurrAmtTrans_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#occurrAmtTrans_idNumber").attr("validator","id_isPermanentReside");
            }
        });
		$scope.accListForm =  {};
		//
		$scope.reset = function(){
			$scope.accListForm.idNumber = '';
			$scope.accListForm.externalIdentificationNo = '';
			$scope.accListForm.idType= '';
			$scope.accListForm.customerNo= '';
			$scope.showQueryInfoBtn = false;
		};
		$scope.searchAccountList = function(){
			if( ($scope.accListForm.idType == null || $scope.accListForm.idType == '' || $scope.accListForm.idType == undefined) &&
					($scope.accListForm.idNumber == null || $scope.accListForm.idNumber == "" || $scope.accListForm.idNumber == undefined)
					&& ($scope.accListForm.externalIdentificationNo == null || $scope.accListForm.externalIdentificationNo == "" || $scope.accListForm.externalIdentificationNo == undefined) ){
				jfLayer.alert(T.T('KHJ2000001') );
			}
			else {
				if($scope.accListForm["idType"]){
					if($scope.accListForm["idNumber"] == null || $scope.accListForm["idNumber"] == undefined || $scope.accListForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showQueryInfoBtn = false;
					}else {
						$scope.idTypeQuery = $scope.accListForm.idType;
						$scope.idNumberQuery = $scope.accListForm.idNumber;
						$scope.queryHadleFun($scope.accListForm);
					}
				}else if($scope.accListForm["idNumber"]){
					if($scope.accListForm["idType"] == null || $scope.accListForm["idType"] == undefined || $scope.accListForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showQueryInfoBtn = false;
					}else {
						$scope.idTypeQuery = $scope.accListForm.idType;
						$scope.idNumberQuery = $scope.accListForm.idNumber;
						$scope.queryHadleFun($scope.accListForm);
					}
				}else {
					$scope.externalIdentificationNoQuery = $scope.accListForm.externalIdentificationNo;
					$scope.queryHadleFun($scope.accListForm);
				}
			}
		};
		//根据接口返回正确，弹窗
		$scope.queryHadleFun = function(params){
			$scope.paramsArr = {};
			$scope.paramsArr = params;
			jfRest.request('accBscInf', 'query', $scope.paramsArr).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/txnInfEnqr/occurrAccountList.html', params, {
						title : T.T('KHJ2000002'),
						buttons : [ T.T('F00107') ,T.T('F00046')  ],
						size : [ '1300px', '550px' ],
						callbacks : [$scope.callbackquery]
					});
				}else {
					$scope.showQueryInfoBtn = false
				}
			});
		};
		$scope.queryOccurrAmtTable = {
				params : {}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'occurrAmtTrans.query',// 列表的资源
					autoQuery:false,
					callback : function(data) { // 表格查询后的回调函数
					}
		};
		$scope.interestCtrlChainTable = {
				params : {}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'occurrAmtTrans.queryInterestCtrlChain',// 列表的资源
					autoQuery:false,
					callback : function(data) { // 表格查询后的回调函数
					}
		};
		$scope.callbackquery = function(result){
			if(result.scope.balanceUnitTable.data.length == 0){
				jfLayer.fail(T.T('KHJ2000003'));
			}else {
				if (!result.scope.balanceUnitTable.validCheck()) {
					return;
                }
                $scope.balanceUnitInfo = result.scope.balanceUnitTable.checkedList();
				$scope.showQueryInfoBtn = true;
				console.log($scope.balanceUnitInfo);
				$scope.interestCtrlChainTable.params.balanceUnitCode = $scope.balanceUnitInfo.balanceUnitCode;
				$scope.interestCtrlChainTable.params.currencyCode = $scope.balanceUnitInfo.currencyCode;
				//$scope.interestCtrlChainTable.params.cycleNumber = $scope.balanceUnitInfo.cycleNumber;
				$scope.interestCtrlChainTable.params.accountId = $scope.balanceUnitInfo.accountId;
				$scope.interestCtrlChainTable.params.externalIdentificationNo = $scope.externalIdentificationNoQuery;
				$scope.interestCtrlChainTable.params.idType = $scope.idTypeQuery;
				$scope.interestCtrlChainTable.params.idNumber = $scope.idNumberQuery;
				//$scope.interestCtrlChainTable.params = $.extend($scope.queryOccurrAmtTable.params, $scope.accListForm);
				$scope.interestCtrlChainTable.search();
				$scope.queryOccurrAmtTable.params.balanceUnitCode = $scope.balanceUnitInfo.balanceUnitCode;
				$scope.queryOccurrAmtTable.params.externalIdentificationNo = $scope.externalIdentificationNoQuery;
				$scope.queryOccurrAmtTable.params.idType = $scope.idTypeQuery;
				$scope.queryOccurrAmtTable.params.idNumber = $scope.idNumberQuery;
				$scope.queryOccurrAmtTable.search();
				$scope.safeApply();
				result.cancel();
			}
		}
	});
	webApp.controller('searchAccountCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $scope.balanceUnitTableShow	= false
	    $scope.queryParam01 = {
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
			$scope.pageCountOcc = 0;
			 $scope.pageNumOcc = 1;
			 $scope.pageSizeOcc = 10;
		$scope.accList = function(){
			layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var layer = layui.layer;
		        var util = layui.util;
		        var treeTable = layui.treeTable;

		        // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#accListTable',
		            tree: {iconIndex: 0,  // 折叠图标显示在第几列
		            	onlyIconControl: true // 仅允许点击图标折叠
		            	},
		           // checkFlag:false,//子账户不需要复选框
		            even:true,//是否开启隔行变色
		            cols: [
		                   //	{type: 'radio',title: '选择'},
		                   	{align: 'center',field: 'accountId', title: T.T('KHH2000029'),width:'20%'},
		                   	{field: 'currency',align: 'center', title: T.T('KHH2000007'), width:'10%'},
		                   	{field: 'businessType',align: 'center', title: T.T('KHH2000030'), width:'15%',singleLine:false,class: 'break-all'},
		                   	{field: 'productObjectCode',align: 'center', title: T.T('KHH2000031'), width:'15%',singleLine:false,class: 'break-all'},
		                   	{field: 'accountOrganFormDescp',align: 'center', title: T.T('KHH2000032'), width:'10%'},
		                   	{field: 'businessDebitCreditCodeDescp',align: 'center', title: T.T('KHH2000033'), width:'10%'},
		                   	{field: 'statusCodeDescp',align: 'center', title: T.T('KHH2000034'), width:'10%'},
		                   	{align: 'center', title: T.T('F00017'), width:'10%',templet: function(d){
			                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="queryBalanceUnitList">'+T.T("F00047")+'</a>';
			                },}//toolbar templet: '#accListTableBar'
		            ],
		            reqData: function (data1, callback) {
		            	if(data1){//子账户
		            		$scope.paramsMain = {};
							$scope.paramsMain = {
									idType : $scope.paramsArr.idType,
									idNumber : $scope.paramsArr.idNumber,
									externalIdentificationNo:$scope.paramsArr.externalIdentificationNo,
									accFlag : 'mainAcc',
									accountOrganForm:data1.accountOrganForm,
									globalTransSerialNo:data1.globalTransSerialNo,
									productObjectCode: data1.productObjectCode,
									businessProgramCode: data1.businessProgramCode,
									businessTypeCode: data1.businessTypeCode,
									customerNo: data1.customerNo,
									currencyCode: data1.currencyCode,
							}
		            	}else {//查主账户
							$scope.paramsMain = {};
							$scope.paramsMain = {
									idType : $scope.paramsArr.idType,
									idNumber : $scope.paramsArr.idNumber,
									externalIdentificationNo:$scope.paramsArr.externalIdentificationNo,
									pageFlag : 'mainPage',
									pageNum: $scope.pageNumOcc,
		            		        pageSize: $scope.pageSizeOcc
							}
                        }
                        jfRest.request('accountView','queryMain',$scope.paramsMain).then(function(data) {
							if (data.returnCode == '000000' && data.returnData.rows != null) {
        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
        							if(!data1){//主账户
        								$scope.pageCountOcc = data.returnData.totalCount;
        							}
        							angular.forEach(data.returnData.rows,function(item,i){
        								if(!data1){
        									item.haveChild = true;
        								}
            							item.currency = item.currencyCode + item.currencyDesc;
            							item.businessType = item.businessTypeCode + item.businessDesc;
            							//item.productObject = item.productObjectCode + item.productDesc;  没返回描述
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
	      			                            elem: 'occurrPage',
	      			                            count: $scope.pageCountOcc,
	      			                            limit: $scope.pageSizeOcc,
	      			                            curr: $scope.pageNumOcc,
	      			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	      			                            jump: function(obj,first){
	      			                             if (!first) {
	      			                              $scope.pageNumOcc = obj.curr;
	      			                              $scope.pageSizeOcc = obj.limit;
	      			                              $scope.accList();
	      			                             }
	      			                            }
	      			                        });
	      			                    });
        						}else {
        							$scope.rows = [];
        							callback($scope.rows);
                                }
                            }else {
                				$scope.rows = [];
    							callback($scope.rows);
//                				data.returnData.rows = [];
//    							callback(data.returnData.rows);
                            }
                        });
		            },
		        });
		      //绑定事件
		        treeTable.on('tool(accListTable)', function (obj) {
		        	console.log(obj);
		            var event = obj.event;
		            if (event == 'queryBalanceUnitList') {
		            	console.log(obj.data);
		                $scope.queryBalanceUnitList(obj.data);
                    }
                });
		        //监听复选框选择
//		        treeTable.on('checkbox(accListTable)', function(obj){
//		        	$rootScope.accListCheckedList = {};
//		            $rootScope.accListCheckedList = obj.data;
//		        });
		    });
		};
		$timeout(function() {
			$scope.accList();
		},200);
/*		$scope.accListTable = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"idNumber":$scope.accListForm.idNumber,
					"idType":$scope.accListForm.idType,
					"externalIdentificationNo":$scope.accListForm.externalIdentificationNo,
				},
				paging : true,
				resource : 'accBscInf.query',
				callback : function(data) {
				}
			};*/
		$scope.queryBalanceUnitList = function(e){
            $scope.balanceUnitTableShow	= true
			$scope.balanceUnitTable.params.operationMode = e.operationMode;
			$scope.balanceUnitTable.params.accountId = e.accountId;
			$scope.balanceUnitTable.params.currencyCode = e.currencyCode;
			$scope.balanceUnitTable.search();
		};
		$scope.balanceUnitTable = {
				checkType : 'radio',
				params : $scope.queryParam = {
						"idNumber":$scope.accListForm.idNumber,
						"idType":$scope.accListForm.idType,
						"externalIdentificationNo":$scope.accListForm.externalIdentificationNo,
				},
					paging : true,
					resource : 'acbaUnitList.query',
					isTrans: true,
					transParams: ['dic_balanceType'],
					transDict: ['balanceType_balanceTypeDesc'],
					autoQuery:false,
					callback : function(data) {
					}
		}
	});
});
