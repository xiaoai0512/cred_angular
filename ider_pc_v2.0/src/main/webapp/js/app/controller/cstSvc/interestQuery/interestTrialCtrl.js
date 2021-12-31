'use strict';
define(function(require) {
	var webApp = require('app');
	// 利息试算
	webApp.controller('interestTrialCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestTrial');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.interestSearch = {};
		$scope.isShowRelation = false;
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
			$scope.interestSearch.idNumber ='';
			if(data.value == "1"){//身份证
				$("#interestTrial_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#interestTrial_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#interestTrial_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#interestTrial_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#interestTrial_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#interestTrial_idNumber").attr("validator","id_isPermanentReside");
            }
        });
		$scope.reset = function(){
			$scope.interestSearch.idType = '';
			$scope.interestSearch.idNumber = '';
			$scope.interestSearch.externalIdentificationNo = '';
			$scope.interestSearch.interestStartDate = '';
			$scope.isShowRelation = false;
		};
		//查询
		$scope.queryitemList = function() {
			if (($scope.interestSearch.idType == null || $scope.interestSearch.idType == ''|| $scope.interestSearch.idType == undefined) &&
					($scope.interestSearch.idNumber == "" || $scope.interestSearch.idNumber == undefined) &&
					($scope.interestSearch.interestStartDate == null || $scope.interestSearch.interestStartDate == "" || $scope.interestSearch.interestStartDate == undefined) &&
					 ($scope.interestSearch.externalIdentificationNo == "" || $scope.interestSearch.externalIdentificationNo == undefined)) {
				jfLayer.alert(T.T('KHJ2500001'));
				$scope.isShowRelation = false;
			} 
			else {
				if($scope.interestSearch.interestStartDate == null || $scope.interestSearch.interestStartDate == "" || $scope.interestSearch.interestStartDate == undefined){
					jfLayer.alert(T.T('KHJ2600001'));
					$scope.isShowRelation = false;
					return;
                }
                if($scope.interestSearch["idType"]){
					if($scope.interestSearch["idNumber"] == null || $scope.interestSearch["idNumber"] == undefined || $scope.interestSearch["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowRelation = false;
					}else {
						$scope.queryFun($scope.interestSearch);
					}
				}else if($scope.interestSearch["idNumber"]){
					if($scope.interestSearch["idType"] == null || $scope.interestSearch["idType"] == undefined || $scope.interestSearch["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowRelation = false;
					}else {
						$scope.queryFun($scope.interestSearch);
					}
				}else {
					$scope.queryFun($scope.interestSearch);
				}
			}
		};
		$scope.queryFun = function(params){
			jfRest.request('accBscInf', 'query', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/interestQuery/accountInfLayer.html', params, {
						title : T.T('KHJ4200008'),//'账户基本信息',
						buttons : [T.T('KHJ2600002'), T.T('F00012') ],//'关闭
						size : [ '1000px', '420px' ],
						callbacks : [$scope.interestTrailSure]
					});
					}else{
						$scope.isShowRelation = false;
					}
			});
		};
		//利息试算
		$scope.params ={};
		$scope.interestTrailSure = function(result){
			/*if(!result.scope.itemList.validCheck()){
				return;
			};*/
			if(!result.scope.accListTreeTableChecked){
				jfLayer.alert('请至少选中一条记录');
            }
//			$scope.interestTrailInf = result.scope.itemList.checkedList();
			$scope.interestTrailInf = result.scope.accListTreeTableChecked;
			$scope.interestTrailInf.interestStartDate = $scope.interestSearch.interestStartDate;
			console.log($scope.interestTrailInf );
			$scope.params.interestStartDate = $scope.interestTrailInf.interestStartDate;
			$scope.params.accountId = $scope.interestTrailInf.accountId;
			$scope.params.accountCurrency = $scope.interestTrailInf.currencyCode;
			$scope.params = $.extend($scope.params , $scope.interestSearch);
			jfRest.request('interest', 'trail', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
				//	jfLayer.success("试算成功");
					$scope.safeApply();
					result.cancel();
					$scope.isShowRelation = true;
					$scope.coreAccountBean = data.returnData.coreAccountBean;// 账户信息
					$scope.listcoreBalanceBean = data.returnData.listCoreBalanceBean;//余额单元信息
				}
			});
		};
		//试算结果
		$scope.interestTrailResultList = {
				autoQuery: false,
				params : $scope.queryParam = {
						"pageSize" : 10,
						"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'interest.trail',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
							$scope.isShowRelation = true;
						}
					}else {
						$scope.isShowRelation = false;
					}
				}
			};
	});
	webApp.controller('accountInfTrialCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_accBscInf');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		//查询
		/*=========================test1111111111111111111111======================*/
		//翻译
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_accountOrganForm",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(function(data) {
			$scope.accountOrganFormList = data.returnData.rows;//账户组织形式
		}); 
		$scope.queryParam02 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_businessDebitCreditCode",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam02).then(function(data) {
			$scope.businessDebitCreditCodeList = data.returnData.rows;//账户性质
		});
		$scope.queryParam03 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_accStatusCode",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam03).then(function(data) {
			$scope.accStatusCodeList = data.returnData.rows;//状态码
		});
		$scope.queryParam03 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_loanStatus",
			queryFlag : "children"
		};
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
		            elem: '#accListTreeTable',
		            tree: {
		            	iconIndex: 1,
		            },
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
//		                {type: 'numbers'},
		                {type: 'radio'},//radio
		                {align: 'left',field: 'accountId', title: T.T('KHH2600004'),width:230},
		                {field: 'transCurrDesc', title: T.T('KHH2600044'), width:100,templet: function(d){
		                	if(d.currencyCode){
		                    	return '<span>'+ d.currencyCode + d.currencyDesc +'</span>';
		                    }else {
		                    	return '<span></span>';
                            }
                            }},
		                {field: 'transAmount', title: T.T('KHH2600054'), width:180,templet: function(d){
		                	if(d.businessTypeCode ||d.businessDesc){
		                    	return '<span>'+ d.businessTypeCode + d.businessDesc +'</span>';
		                    }else {
		                    	return '<span></span>';
                            }
                            }},
		                {field: 'productObjectCode', title: T.T('KHH2600055'),width:100},
		                {field: 'productDesc', title: T.T('KHH2600056'),width:100},
		                {field: 'accountOrganFormDesc', title: T.T('KHH2600057'), width:100},
		                {field: 'businessDebitCreditCodeDesc', title: T.T('KHH2600058'), width:100},
		                {field: 'statusCodeDesc', title: T.T('KHH2600059'), width:100},
		            ],
//		            style: 'max-height:200px',
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
		    					productObjectCode : data1.productObjectCode,
		    					businessProgramNo : data1.businessProgramNo,
		    					businessTypeCode : data1.businessTypeCode,
		    					productObjectCode : data1.productObjectCode,
	                		};
		            		jfRest.request('accBscInf', 'queryMainAndChildAccList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	        						$scope.isShowDetail = true;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	            							//账户组织形式
	            							for(var k = 0; k < $scope.accountOrganFormList.length; k++){
	            								if(item.accountOrganForm == $scope.accountOrganFormList[k].codes){
	            									item.accountOrganFormDesc = $scope.accountOrganFormList[k].detailDesc;
                                                }
                                            }
                                            //账户性质
	            							for(var m = 0; m < $scope.businessDebitCreditCodeList.length; m++){
	            								if(item.businessDebitCreditCode == $scope.businessDebitCreditCodeList[m].codes){
	            									item.businessDebitCreditCodeDesc = $scope.businessDebitCreditCodeList[m].detailDesc;
                                                }
                                            }
                                            //状态码
	            							for(var n = 0; n < $scope.accStatusCodeList.length; n++){
	            								if(item.statusCode == $scope.accStatusCodeList[n].codes){
	            									item.statusCodeDesc = $scope.accStatusCodeList[n].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        						}else {
	        							data.returnData.rows = [];
	        							callback(data.returnData.rows);
                                    }
                                }else {
	                				$scope.isShowDetail = false;
                                }
                            });
		            	}else {//查主账户
		            		$scope.params = {
		    					externalIdentificationNo:  $scope.interestSearch.externalIdentificationNo,
		    					idType:  $scope.interestSearch.idType,
		    					idNumber:  $scope.interestSearch.idNumber,
		    					pageFlag : "mainPage",
		    					pageNum: $scope.pageNumP,
		    			        pageSize: $scope.pageSizeP
	                		};
		            		//finacialTrans,queryMainnAndChildAcc
		            		jfRest.request('accBscInf', 'queryMainAndChildAccList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	        						$scope.isShowDetail = true;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCount = data.returnData.totalCount;
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = true;
	            							//账户组织形式
	            							for(var k = 0; k < $scope.accountOrganFormList.length; k++){
	            								if(item.accountOrganForm == $scope.accountOrganFormList[k].codes){
	            									item.accountOrganFormDesc = $scope.accountOrganFormList[k].detailDesc;
                                                }
                                            }
                                            //账户性质
	            							for(var m = 0; m < $scope.businessDebitCreditCodeList.length; m++){
	            								if(item.businessDebitCreditCode == $scope.businessDebitCreditCodeList[m].codes){
	            									item.businessDebitCreditCodeDesc = $scope.businessDebitCreditCodeList[m].detailDesc;
                                                }
                                            }
                                            //状态码
	            							for(var n = 0; n < $scope.accStatusCodeList.length; n++){
	            								if(item.statusCode == $scope.accStatusCodeList[n].codes){
	            									item.statusCodeDesc = $scope.accStatusCodeList[n].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        							if(!data1){//主账户
	        								layui.use(['laypage', 'layer'], function(){
	  					                      var laypage = layui.laypage
	  					                      ,layer = layui.layer;
	  					                      laypage.render({
	  					                            elem: 'accPageDemo',
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
                                    }
                                }else {
	                				$scope.isShowDetail = false;
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		        });
		      //点击 选中当前行
		        treeTable.on('checkbox(accListTreeTable)', function(obj){
		        	$scope.accListTreeTableChecked = obj.data;
		        });
				treeTable.on('row(accListTreeTable)', function(obj){
					$scope.accListTreeTableChecked = obj.data;
				    insTb.setChecked([obj.data.id]);
				});
		    });
		};
		$scope.queryMainAcc();
		
		
		/*$scope.itemList = {
			checkType: "radio",
			params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					"idNumber": $scope.interestSearch.idNumber,
					"idType": $scope.interestSearch.idType,
					"externalIdentificationNo": $scope.interestSearch.externalIdentificationNo
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accBscInf.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],//查找数据字典所需参数
			transDict : ['accountOrganForm_accountOrganFormDesc','businessDebitCreditCode_businessDebitCreditCodeDesc','statusCode_statusCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					for(var i =0; i < data.returnData.rows.length; i++){
						if(data.returnData.rows[i].businessTypeCode == '' || data.returnData.rows[i].businessTypeCode == undefined || data.returnData.rows[i].businessTypeCode == null){
							data.returnData.rows.splice(i,1)
						}else {
							if(data.returnData.rows[i].businessTypeCode == 'MODT99999'){
								data.returnData.rows.splice(i,1)
							};
						}
					}
				}
			}
		};*/
	});
});
