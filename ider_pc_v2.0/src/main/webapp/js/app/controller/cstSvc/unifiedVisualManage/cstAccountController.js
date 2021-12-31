'use strict';
define(function(require) {
	var webApp = require('app');
	// 账户基本信息
	webApp.controller('cstAccountCtr', function($scope, $stateParams, jfRest,
			$http,$timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstAccountList');
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translatePartialLoader.addPart('pages/cstSvc/disputeAccontInfo/i18n_disputeAccontInfo');
		$scope.operationMode = lodinDataService.getObject("operationMode");//运营模式
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.isShow = false;
    	$scope.cstAccForm = {};
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
		$scope.cstAccForm.idNumber = '';  
	  	if(data.value == "1"){//身份证
	  		$("#cstAccItem_idNumber").attr("validator","id_idcard");
	  	}else if(data.value == "2"){//港澳居民来往内地通行证
	  		$("#cstAccItem_idNumber").attr("validator","id_isHKCard");
	  	}else if(data.value == "3"){//台湾居民来往内地通行证
	  		$("#cstAccItem_idNumber").attr("validator","id_isTWCard");
	  	}else if(data.value == "4"){//中国护照
	  		$("#cstAccItem_idNumber").attr("validator","id_passport");
	  	}else if(data.value == "5"){//外国护照passport
	  		$("#cstAccItem_idNumber").attr("validator","id_passport");
	  	}else if(data.value == "6"){//外国人永久居留证
	  		$("#cstAccItem_idNumber").attr("validator","id_isPermanentReside");
	  	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
	  		$("#cstAccItem_idNumber").attr("validator","noValidator");
	  		$scope.cstAccItemForm.$setPristine();
	  		$("#cstAccItem_idNumber").removeClass("waringform ");
        }
      });
		//重置
		$scope.reset = function() {
			$scope.cstAccForm.idNumber= '';
			$scope.cstAccForm.externalIdentificationNo= '';
			$scope.cstAccForm.idType= '';
			$scope.isShowAccountList = false;
			$scope.isShowTransAccountList = false;
			$("#cstAccItem_idNumber").attr("validator","noValidator");
			$("#cstAccItem_idNumber").removeClass("waringform ");
		};
		$scope.queryAccountInf = function(){
			$rootScope.selIdType = "";
			$rootScope.selIdNum = "";
			$rootScope.selexternalIdentificationNo = "";
			if(($scope.cstAccForm.idType == null || $scope.cstAccForm.idType == ''|| $scope.cstAccForm.idType == undefined) &&
					($scope.cstAccForm.idNumber == "" || $scope.cstAccForm.idNumber == undefined )
					&&( $scope.cstAccForm.externalIdentificationNo == "" || $scope.cstAccForm.externalIdentificationNo == undefined)
				){
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
				$scope.isShowAccountList = false;
			}else {
				if($scope.cstAccForm.idType) {
					if($scope.cstAccForm.idNumber == null || $scope.cstAccForm.idNumber == undefined || $scope.cstAccForm.idNumber == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowAccountList = false;
					}else {
						$scope.searchHandlee($scope.cstAccForm);
					}
				}else if($scope.idNumber ) {
					if($scope.idType == null || $scope.idType == undefined || $scope.idType == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowAccountList = false;
					}else {
						$scope.searchHandlee($scope.cstAccForm);
					}
				}else {
					$scope.searchHandlee($scope.cstAccForm);
				}
			}
		};
		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstProduct', 'viewQueryCstBaseInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowAccountList =true;
					$scope.custInf = data.returnData.rows[0];
					$scope.params = {
						idType: $scope.cstAccForm.idType,
						idNumber : $scope.cstAccForm.idNumber,
						externalIdentificationNo : $scope.cstAccForm.externalIdentificationNo
					};
					//溢缴款账户表
					$scope.overdueAccParams = {
							operationMode : $scope.operationMode
					};
					$scope.overdueAccParams = $.extend($scope.overdueAccParams,$scope.params);
					$scope.overdueAccList.params = $scope.overdueAccParams;
					$scope.overdueAccList.search();
					//争议账户表
					$scope.disputeAccList.params = $scope.params;
					$scope.disputeAccList.search();
					$scope.cstAccountQuery($scope.cstAccForm);
					$scope.trandsAccountQuery($scope.cstAccForm);
				}else {
					$scope.isShowAccountList = false;
					$scope.isShowTransAccountList =false;//交易账户列表
				}
			});
		};
		$scope.queryParam01 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_accountOrganForm",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam01).then(function(data) {
				$scope.accountOrganFormList = [];
				$scope.accountOrganFormList = data.returnData.rows;//账户组织形式
			}); 
			$scope.queryParam02 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_businessDebitCreditCode",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam02).then(function(data) {
				$scope.businessDebitCreditCodeList = [];
				$scope.businessDebitCreditCodeList = data.returnData.rows;//账户性质
			});
			$scope.queryParam03 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_accStatusCode",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam03).then(function(data) {
				$scope.accStatusCodeList = [];
				$scope.accStatusCodeList = data.returnData.rows;//状态码
			});
			$scope.queryParam04 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_loanStatus",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam04).then(function(data) {
				$scope.loanStatusList = [];
				$scope.loanStatusList = data.returnData.rows;//状态码
			});
			$scope.queryParam05 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_childAccType",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam05).then(function(data) {
				$scope.childAccTypeList = {};
				$scope.childAccTypeList = data.returnData.rows;//贷款状态
			});
			$scope.pageCountRC = 0;
			 $scope.pageNumRC = 1;
			 $scope.pageSizeRC = 10;
		$scope.cstAccountQuery = function(cstAccPass){
			layui.use(['treeTable'], function () {
				var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 循环账户
		        var insTb = treeTable.render({
		            elem: '#accRevoleTreeTable',
		            tree: {
		            	iconIndex: 0,
		            	onlyIconControl: true // 仅允许点击图标折叠
		            },
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
		                {align: 'center',field: 'accountId', title: T.T('KHH4700004'),width:'17%'},
		                {align: 'center',field: 'currencyDesc', title: T.T('KHH4700014'),width:'6%',templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.currencyDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'top',field: 'businessProgramNo', title: T.T('KHH47000243'),width:'15%',singleLine:false,class: 'break-all',templet: function(d){
		                	if(d.haveChild == true){
			                	if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.businessProgramNo + d.programDesc +'</span>';
			                   // 	return '<div class="tdDivLB">'+ d.businessProgramNo +'&nbsp;</div><div class="tdDivRS">'+ d.programDesc + '</div>';
			                    }else {
			                    	return '<span></span>';
                                }
                            }else if(d.haveChild == false){
		                    	return '<span>'+ d.subAccIdentifyDesc +'</span>';
		                    }
		                }},
		                {field: 'businessTypeCode', title: T.T('KHH47000244'),width:'13%',singleLine:false,class: 'break-all',templet: function(d){
		                	if(d.haveChild == true){
			                	if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.businessTypeCode + d.businessDesc +'</span>';
			                    //	return '<div class="tdDivLB">'+ d.businessTypeCode +'&nbsp;</div><div class="tdDivRS">'+ d.businessDesc + '</div>';
			                    }else {
			                    	return '<span></span>';
                                }
                            }else if(d.haveChild == false){
		                		if(d.subAccIdentify == 'Q'){
			                    	return '<span>'+ d.transIdentifiNo +'</span>';
			                    }else if(d.subAccIdentify == 'L'){
			                    	if(d.fundNum){
			                    		return '<span>'+ d.fundNum +'</span>';
			                    	}else{
			                    		return '<span></span>';
			                    	}
                                }
                            }
		                }},
		                {field: 'productObjectCode', title: T.T('KHH4700048'),width:'13%',singleLine:false,class: 'break-all',templet: function(d){
		                	if(d.haveChild == true){
			                	if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.productObjectCode + d.productDesc +'</span>';
			                    //	return '<div class="tdDivLB">'+ d.productObjectCode +'&nbsp;</div><div class="tdDivRS">'+ d.productDesc + '</div>';
			                    }else {
			                    	return '<span></span>';
                                }
                            }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'center',field: 'accountOrganFormDesc', title: T.T('KHH4700050'),width:'7%',templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.accountOrganFormDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'center',field: 'businessDebitCreditCodeDesc', title: T.T('KHH4700051'),width:'7%',templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.businessDebitCreditCodeDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'center',field: 'statusCodeDesc', title: T.T('KHH4700052'),width:'7%',templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.statusCodeDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'center',field: 'totalBalance', title: T.T('KHH4700005'),width:'7%'},
		                {align: 'center', title: T.T('F00017'),width:'8%',templet: function(d){
	                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="accViewRevoleAccInf">'+T.T("KHH47000224")+'</a>';
		                },}//toolbar templet: '#accRevoleTableBar',
		            ],
		            reqData: function (data1, callback) {
		            	if(data1){//子账户
		            		$scope.params = {
		    					accFlag : "mainAcc",
		    					flag: "N",
		    					idType : cstAccPass.idType,
		    					idNumber : cstAccPass.idNumber,
		    					externalIdentificationNo:  cstAccPass.externalIdentificationNo,
		    					accountOrganForm :  data1.accountOrganForm,
		    					globalTransSerialNo : data1.globalTransSerialNo,
		    					productObjectCode: data1.productObjectCode,
		    					businessProgramNo:  data1.businessProgramNo,
		    					businessTypeCode:  data1.businessTypeCode,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		jfRest.request('accBscInf', 'queryMainAndChildAccList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.isShowAccountList = true;//账户信息表
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
//		        							账户组织形式
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
                                            //子账户类型
	            							for(var t = 0; t < $scope.childAccTypeList.length; t++){
	            								if(item.subAccIdentify == $scope.childAccTypeList[t].codes){
	            									item.subAccIdentifyDesc = $scope.childAccTypeList[t].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }else{
	                				$scope.rows = [];
	    							callback($scope.rows);
//	                				data.returnData.rows = [];
//        							callback(data.returnData.rows);
	                			}
	                		});
		            	}else {//查主账户
		            		$scope.params = {
		    					accountOrganForm: "R",//循环账户
		    					flag:'Y',    //白玉让传     change  输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
		    					pageFlag : "mainPage",
		    					idType : cstAccPass.idType,
		    					idNumber : cstAccPass.idNumber,
		    					externalIdentificationNo : cstAccPass.externalIdentificationNo,
		    					pageNum: $scope.pageNumRC,
	            		        pageSize: $scope.pageSizeRC
	                		};
		            		jfRest.request('accBscInf', 'queryMainAndChildAccList', $scope.params).then(function(data) {
		            			$scope.pageCountRC = 0;
	                			if (data.returnCode == '000000') {
	        						$scope.isShowAccountList = true;//账户信息表
	        						var rows = data.returnData.rows;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCountRC = data.returnData.totalCount;
	        							pageInit($scope.pageCountRC,"cstRevPage");//初始化分页
	        							angular.forEach(rows,function(item,i){
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
	        							layui.use(['laypage', 'layer'], function(){
		      			                      var laypage = layui.laypage
		      			                      ,layer = layui.layer;
		      			                      laypage.render({
		      			                            elem: 'cstRevPage',
		      			                            count: $scope.pageCountRC,
		      			                            limit: $scope.pageSizeRC,
		      			                            curr: $scope.pageNumRC,
		      			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
		      			                            jump: function(obj,first){
		      			                             if (!first) {
		      			                              $scope.pageNumRC = obj.curr;
		      			                              $scope.pageSizeRC = obj.limit;
		      			                              $scope.cstAccountQuery(cstAccPass);
		      			                             }
		      			                            }
		      			                        });
		      			                    });
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
		    							pageInit($scope.pageCountRC,"cstRevPage");//初始化分页
                                    }
                                }else{
	                				$scope.rows = [];
	    							callback($scope.rows);
	    							pageInit($scope.pageCountRC,"cstRevPage");//初始化分页
//	                				data.returnData.rows = [];
//        							callback(data.returnData.rows);
	                			}
	                		});
                        }
                    },
		        });
		      //绑定事件
		        treeTable.on('tool(accRevoleTreeTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'accViewRevoleAccInf') {
		                $scope.viewRevoleAccInf(obj.data);
                    }
                });
			});
		};
		//交易账户
		$scope.pageCountTC = 0;
		 $scope.pageNumTC = 1;
		 $scope.pageSizeTC = 10;
		$scope.trandsAccountQuery = function(trandsAccPass){
			layui.use(['treeTable'], function () {
				var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		        // 交易账户
		        var insTb2 = treeTable.render({
		            elem: '#cstTransAccTreeTable',
		            tree: {
		            	iconIndex: 0,
		            	onlyIconControl: true // 仅允许点击图标折叠
		            },
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
		                {align: 'center',field: 'loanTypeDesc', title: T.T('KHH4600003'), width:'12%'},
		                {align: 'center',field: 'accountId', title: T.T('KHH4600004'), width:'18%'},
		                {align: 'center',field: 'loanAmount', title: T.T('KHH4600005'), width:'8%'},
		                {align: 'center',field: 'remainPrincipalAmount', title: T.T('KHH47000116'), width:'8%'},
		                {align: 'center',field: 'currencyCode', title: T.T('KHH4600006'), width:'8%'},
		                {align: 'center',field: 'loanTerm', title: T.T('KHH4600007'), width:'8%'},
		                {align: 'center',field: 'startIntDate', title: T.T('KHH4600008'), width:'10%'},
		                {align: 'center',field: 'statusDesc', title: T.T('KHH47000117'), width:'8%'},
		                {align: 'center', title: T.T('F00017'), width:'20%',templet: function(d){
	                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="viewTransAcc">'+T.T("F00009")+'</a>'+
	                  		'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="viewRevoleAccInf">'+T.T("KHH47000224")+'</a>';
		                },}//toolbar templet: '#cstTransAccTableBar'
		            ],
		            reqData: function (data1, callback) {
		            	if(data1){//子账户
		            		$scope.params = {
		    					accFlag : "mainAcc",
		    					flag: "N",
		    					idType : trandsAccPass.idType,
		    					idNumber : trandsAccPass.idNumber,
		    					externalIdentificationNo:  trandsAccPass.externalIdentificationNo,
		    					accountOrganForm :  data1.accountOrganForm,
		    					globalTransSerialNo : data1.globalTransSerialNo,
		    					productObjectCode: data1.productObjectCode,
		    					businessProgramNo:  data1.businessProgramCode,
		    					businessTypeCode:  data1.businessTypeCode,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		jfRest.request('instalments', 'queryChild', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.isShowAccountList = true;//账户信息表
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	            							//	贷款状态
	            							for(var k = 0; k < $scope.loanStatusList.length; k++){
	            								if(item.status == $scope.loanStatusList[k].codes){
	            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }else{
	                				$scope.rows = [];
	    							callback($scope.rows);
//	                				data.returnData.rows = [];
//        							callback(data.returnData.rows);
	                			}
	                		});
		            	}else {//查主账户
		            		$scope.params = {
		    					accountOrganForm: "R",//循环账户
		    					flag:'N',    //白玉让传
		    					pageFlag : "mainPage",
		    					idType : trandsAccPass.idType,
		    					idNumber : trandsAccPass.idNumber,
		    					externalIdentificationNo : trandsAccPass.externalIdentificationNo,
		    					pageNum: $scope.pageNumTC,
	            		        pageSize: $scope.pageSizeTC
	                		};
		            		jfRest.request('instalments', 'query', $scope.params).then(function(data) {
		            			$scope.pageCountTC = 0;
	                			if (data.returnCode == '000000') {
	        						$scope.isShowTransAccountList = true;//账户信息表
	        						var rows = data.returnData.rows;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCountTC = data.returnData.totalCount;
	        							pageInit($scope.pageCountTC,"cstTransPage");//初始化分页
	        							angular.forEach(rows,function(item,i){
	            							item.haveChild = true;
//	            							//	贷款状态
	            							for(var k = 0; k < $scope.loanStatusList.length; k++){
	            								if(item.status == $scope.loanStatusList[k].codes){
	            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        							layui.use(['laypage', 'layer'], function(){
	        			                      var laypage = layui.laypage
	        			                      ,layer = layui.layer;
	        			                      laypage.render({
	        			                            elem: 'cstTransPage',
	        			                            count: $scope.pageCountTC,
	        			                            limit: $scope.pageSizeTC,
	        			                            curr: $scope.pageNumTC,
	        			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	        			                            jump: function(obj,first){
	        			                             if (!first) {
	        			                              $scope.pageNumTC = obj.curr;
	        			                              $scope.pageSizeTC = obj.limit;
	        			                              $scope.trandsAccountQuery(trandsAccPass);
	        			                             }
	        			                            }
	        			                        });
	        			                    });
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
		    							pageInit($scope.pageCountTC,"cstTransPage");//初始化分页
                                    }
                                }else{
	                				$scope.rows = [];
	    							callback($scope.rows);
	    							pageInit($scope.pageCountTC,"cstTransPage");//初始化分页
//	                				data.returnData.rows = [];
//        							callback(data.returnData.rows);
	                			}
	                		});
                        }
                    },
		        });
		        //绑定事件
		        treeTable.on('tool(cstTransAccTreeTable)', function (obj) {
		            var event = obj.event;
		            if (event == 'viewTransAcc') {
		                $scope.viewTransAcc(obj.data);
		            }else if (event == 'viewRevoleAccInf') {
		                $scope.viewRevoleAccInf(obj.data);
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
        //转出操作
		$scope.rollOutOperateInfo = function(event){
			$scope.rollOutOperate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/unifiedVisualManage/rollOutOperate.html', $scope.rollOutOperate, {
				title : T.T('KHJ4700049'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.saveRollOutOperate]
			});
		};
		$scope.rollOutOperate1 = {};
		//转出
		$scope.saveRollOutOperate = function(result) {
			$scope.rollOutOperate1.corporation = $scope.params.corporation;	//法人实体
			$scope.rollOutOperate1.ecommPostingAcctNmbr = $scope.rollOutOperate.accountId;	// 账户代码
			$scope.rollOutOperate1.ecommCurrencyCode = $scope.rollOutOperate.currencyCode;	//账户币种
			$scope.rollOutOperate1.ecommTransDate = $scope.rollOutOperate.transDate;	//交易日期
			$scope.rollOutOperate1.ecommTransAmount = $scope.rollOutOperate.transAmount;	// 交易金额
			$scope.rollOutOperate1.ecommTransCurr = $scope.rollOutOperate.currencyCode;	//交易币种
			$scope.rollOutOperate1.ecommClearCurr = $scope.rollOutOperate.currencyCode;	//清算币种
			$scope.rollOutOperate1.ecommClearAmount = $scope.rollOutOperate.transAmount;	//清算金额
			$scope.rollOutOperate1.ecommTransPostingCurr = $scope.rollOutOperate.currencyCode;	//入账币种
			$scope.rollOutOperate1.ecommTransPostingAmount = $scope.rollOutOperate.transAmount;	//入账金额
			$scope.rollOutOperate1.ecommEntryId = $scope.cstAccForm.externalIdentificationNo;//外部识别号
			$scope.rollOutOperate1.idType = $scope.cstAccForm.idType;//证件类型
			$scope.rollOutOperate1.idNumber = $scope.cstAccForm.idNumber;//证件号码
			$scope.rollOutOperate1.ecommEventId = "ISS.RT.80.0001";
			if($scope.rollOutOperate.transAmount>$scope.overdueAccList.data[0].currBalance){
				jfLayer.fail(T.T('KHJ4700050'));
				return;
			}
			jfRest.request('overPayDrawal', 'realTimeTransMoney', $scope.rollOutOperate1).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.rollOutOperate1 = {};
					 $timeout(function(){
						 jfLayer.success(T.T('KHJ4700051'));
							$scope.safeApply();
							result.cancel();
							$scope.queryAccountInf();
						},1500);
				}
			});
		};
		//溢缴款账户表
		$scope.overdueAccList = {
		//	checkType : 'radio',
			params : $scope.queryParam = {},
			paging : true,
			resource : 'accBscInf.queryOverdueAccList',
			autoQuery:false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowAccountList = true;//账户信息表
				}else {
					$scope.isShowAccountList = false;
				}
			}
		};
		//争议账户列表
		$scope.disputeAccList = {
		//		checkType : 'radio',
				params : $scope.queryParam = {},
				paging : true,
				resource : 'accBscInf.queryDisputeAccList',
				autoQuery:false,
				isTrans: true,
				transParams: ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],
				transDict: ['accountOrganForm_accountOrganFormDesc','businessDebitCreditCode_businessDebitCreditCodeDesc','statusCode_statusCodeDesc'],
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.isShowAccountList = true;//账户信息表
					}else {
						$scope.isShowAccountList = false;
					}
				}
			};
		//查询循环账户列表
		$scope.viewRevoleAccInf = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.item.idType = $scope.cstAccForm.idType;
			$scope.item.idNumber = $scope.cstAccForm.idNumber;
			$scope.item.externalIdentificationNo = $scope.externalIdentificationNo;
			$scope.item.operationMode = $scope.operationMode;
			$scope.modal('/cstSvc/unifiedVisualManage/viewAccFinancial.html', $scope.item, {
				title : T.T('KHH4700097'),
				buttons : [T.T('F00108')],//'确认','取消' 
				size : [ '1100px', '600px' ],
				callbacks : [ ]
			});
		};
		//查询溢缴款账户
		$scope.viewOverdueAccInf = function(item){
			$scope.itemInfo = $.parseJSON(JSON.stringify(item));
			$scope.itemInfo.externalIdentificationNo = $scope.externalIdentificationNo;
			// 页面 查询构件(弹出页面)
			$scope.modal('/cstSvc/accInfMgt/viewDepositInf.html', $scope.itemInfo, {
				title : T.T('KHJ4300001'),//'存款账户详细信息',
				buttons : [T.T('F00012')],// '关闭' 
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		//查询交易账户信息详情
		$scope.viewTransAcc = function(item){
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(item));
			$scope.itemDetailInf = $.extend($scope.itemDetailInf, $scope.cstAccForm);
			$scope.modal('/cstSvc/acbaUnitList/layerCreditTradeAcc.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				//buttons : [ T.T('KHJ4600002'),T.T('F00012')],//'提前结清','关闭' 
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
		//查询争议账户表
		$scope.viewDisputeAccInf = function(item){
			$scope.disputeInf = $.parseJSON(JSON.stringify(item));
			$scope.disputeInf.externalIdentificationNo = $scope.externalIdentificationNo;
			$scope.modal('/cstSvc/acbaUnitList/layerDisputeInf.html',$scope.disputeInf, {
					title : T.T('KHH4700098'),
					buttons : [ T.T('KHH4700099'),T.T('KHH47000100'),T.T('KHH47000101'),T.T('KHH47000102'),T.T('F00012') ],
					size : [ '1000px', '550px' ],
					callbacks : [$scope.orginTransInfo,$scope.disputeReleaseCst,$scope.disputeReleaseBank,$scope.searchApp]
				});
		};
		//原交易信息
		$scope.orginTransInfo = function(result){
			$scope.item = result.scope.disputeInf;
			$scope.item.externalIdentificationNo = $scope.externalIdentificationNo;
			$scope.modal('/cstSvc/acbaUnitList/orginTransInfo.html',
					$scope.item, {
						title : T.T('KHJ4700025'),
						buttons : [ T.T('F00012') ],
						size : [ '1000px', '660px' ],
						callbacks : []
					});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(result){
			$scope.params = {
				"ecommEntryId" : result.scope.disputeInf.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : result.scope.disputeInf.oldGlobalSerialNumbr,
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4700026'));
					$scope.safeApply();
					result.cancel();
					$scope.disputeQueryTable.search();
				} else {
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank = function(result){
			$scope.params = {
				"ecommEntryId" : $scope.disputeInf.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : $scope.disputeInf.oldGlobalSerialNumbr,
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4700027'));
					$scope.safeApply();
					result.cancel();
					$scope.disputeQueryTable.search();
				} else {
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//调付申请/拒付管理
		$scope.searchApp = function(result) {
			if($scope.disputeInf.statusCode != "D" && $scope.disputeInf.statusCode != "C"){
				jfLayer.fail(T.T('KHJ4700028'));
				$scope.safeApply();
				result.cancel();
			}else{
				if($scope.disputeInf.statusCode == "D"){
					var cardBin = $scope.disputeInf.externalIdentificationNo.substring(3,9);
					$scope.queryParam = {
							binNo : cardBin,
							idType: $scope.disputeInf.idType,
							idNumber: $scope.disputeInf.idNumber,
							externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
					};
					jfRest.request('productLine','queryBin', $scope.queryParam).then(function(data) {
						if(data.returnCode == '000000'){
							if(data.returnData.rows == null){
								jfLayer.fail(T.T('KHJ4700029'));
								$scope.safeApply();
								result.cancel();
							}else{
								var cardScheme = data.returnData.rows[0].cardScheme;
								if(data.returnData.rows[0].cardScheme == "V" || data.returnData.rows[0].cardScheme == "M"){
									$scope.queryParam1 = {
											globalSerialNumber : $scope.disputeInf.oldGlobalSerialNumbr,
											idType: $scope.disputeInf.idType,
											idNumber: $scope.disputeInf.idNumber,
											externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
									};
									if(data.returnData.rows[0].cardScheme == "V"){
										jfRest.request('visannexTabInf','query', $scope.queryParam1).then(function(data) {
											if(data.returnData == null || data.returnData == ""){
												jfLayer.fail(T.T('KHJ4700030'));
												$scope.safeApply();
												result.cancel();
												//return;
											}
											$scope.data = data.returnData[0];
											$scope.appVisaFormInf = data.returnData[0];
											$scope.appMCFormInf = data.returnData[0];
											$scope.safeApply();
											result.cancel();
										});
									}else if(data.returnData.rows[0].cardScheme == "M"){
										jfRest.request('mcannexTabInf','query', $scope.queryParam1).then(function(data) {
											if(data.returnData == null || data.returnData == ""){
												jfLayer.fail(T.T('KHJ4700031'));
												$scope.safeApply();
												result.cancel();
												//return;
											}
											$scope.data = data.returnData[0];
											$scope.data2 = data.returnData[1][0];
											$scope.appVisaFormInf = data.returnData[0];
											$scope.appMCFormInf = data.returnData[0];
											$scope.safeApply();
											result.cancel();
										});
									}
									$scope.queryParam2 = {
											globalTransSerialNoAuth : $scope.disputeInf.oldGlobalSerialNumbr,
											idType: $scope.disputeInf.idType,
											idNumber: $scope.disputeInf.idNumber,
											externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
									};
									$timeout(function() {
										jfRest.request('clearHitInf','query', $scope.queryParam2).then(function(data) {
											if(data.returnData == null || data.returnData == ""){
												jfLayer.fail(T.T('KHJ4700032'));
												$scope.safeApply();
												result.cancel();
												//return;
											}
											if(cardScheme == "V"){
												$scope.data1 = data.returnData[0];
												$scope.appVisaFormInf = data.returnData[0];
												$scope.appVisaFormInf.acquirerBusinessId = $scope.data.acquirerBusinessId;
												$scope.appVisaFormInf.nationalReimburseFee = $scope.data.nationalReimburseFee;
												$scope.appVisaFormInf.accountSelection = $scope.data.accountSelection;
												$scope.appVisaFormInf.reimburseAttribute = $scope.data.reimburseAttribute;
												$scope.appVisaFormInf.transIdentifier = $scope.data.transIdentifier;
												$scope.appVisaFormInf.settlementFlag =  $scope.data.settlementFlag;
												$scope.appVisaFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
												$scope.appVisaFormInf.transactionCode = "52";
												$scope.appVisaFormInf.retrievalRequestId = "0";
												$scope.typeArray = [{name : T.T('KHJ4700033'),id : '0'}, {name : T.T('KHJ4700034'),id : '1'}];
												$scope.typeArray1 = [{name : T.T('KHJ4700033'),id : '0'}, {name : T.T('KHJ4700035'),id : '1'}];
												$scope.safeApply();
												result.cancel();
												$scope.modal('/cstSvc/disputeAccontInfo/confirmAppVisaForm.html',
														'', {
															title : T.T('KHJ4700035'),
															buttons : [ T.T('F00125'),T.T('F00012') ],
															size : [ '1000px', '600px' ],
															callbacks : [$scope.saveConfirmVisaApp]
														});
											}else if(cardScheme == "M"){
												$scope.data1 = data.returnData[0];
												$scope.appMCFormInf = data.returnData[0];
												$scope.appMCFormInf.processingCode = $scope.data2.processingCode;
												$scope.appMCFormInf.dateAndTime = $scope.data2.dateAndTime;
												$scope.appMCFormInf.posEntryMode = $scope.data2.posEntryMode;
												$scope.appMCFormInf.forwdInstitIdCode = $scope.data2.forwdInstitIdCode;
												$scope.appMCFormInf.retrievalReferNum = $scope.data2.retrievalReferNum;
												$scope.appMCFormInf.cardAcceptorName = $scope.data2.cardAcceptorName;
												$scope.appMCFormInf.settlementIndicator = $scope.data2.settlementIndicator;
												$scope.appMCFormInf.transLifeCycleId = $scope.data2.transLifeCycleId;
												$scope.appMCFormInf.messageNumber = $scope.data2.messageNumber;
												$scope.appMCFormInf.transOriginInstit = $scope.data2.transOriginInstit;
												$scope.appMCFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
												$scope.appMCFormInf.terminalType = $scope.data.P0023;
												$scope.appMCFormInf.messageReversalIndicator = $scope.data.P0025;
												$scope.appMCFormInf.electronicCommerceSecurityLevelIndicator = $scope.data.P0052;
												$scope.appMCFormInf.currencyExponents = $scope.data.P0148;
												$scope.appMCFormInf.currencyCodesAmountsOriginal = $scope.data.P0149;
												$scope.appMCFormInf.businessActivity = $scope.data.P0158;
												$scope.appMCFormInf.settlementIndicator = $scope.data.P0165;
												$scope.appMCFormInf.masterCardAssignedId = $scope.data.P0176;
												$scope.appMCFormInf.retrievalDocumentCode = $scope.data.P0228;
												$scope.appMCFormInf.exclusionRequestCode = 	$scope.data.P0260;
												$scope.appMCFormInf.documentationIndicator = $scope.data.P0262;
												$scope.appMCFormInf.functionCode = "603";
												$scope.appMCFormInf.mti = "1644";
												$scope.safeApply();
												result.cancel();
												$scope.modal('/cstSvc/disputeAccontInfo/confirmMCAppForm.html',
														'', {
															title : T.T('KHJ4700036'),
															buttons : [T.T('F00125'), T.T('F00012') ],
															size : [ '1000px', '600px' ],
															callbacks : [$scope.saveConfirmMCApp]
														});
											}else{
												jfLayer.fail(T.T('KHJ4700037'));
												$scope.safeApply();
												result.cancel();
											}
										});
									},300);
								}else{
									jfLayer.fail(T.T('KHJ4700038'));
									$scope.safeApply();
									result.cancel();
								}
							}
						}
					});
				}else if($scope.disputeInf.statusCode == "C"){
					var cardBin = $scope.disputeInf.externalIdentificationNo.substring(3,9);
					$scope.queryParam = {
							binNo : cardBin,
							idType: $scope.disputeInf.idType,
							idNumber: $scope.disputeInf.idNumber,
							externalIdentificationNo: $scope.disputeInf.externalIdentificationNo
					};
					jfRest.request('productLine','queryBin', $scope.queryParam).then(function(data) {
						if(data.returnCode == '000000'){
							if(data.returnData.rows){
								var cardScheme = data.returnData.rows[0].cardScheme;
								if(data.returnData.rows[0].cardScheme == "V" || data.returnData.rows[0].cardScheme == "M"){
									$scope.queryParam1 = {
											globalSerialNumber : $scope.disputeInf.oldGlobalSerialNumbr
									};
									if(data.returnData.rows[0].cardScheme == "V"){
										jfRest.request('visannexTabInf','query', $scope.queryParam1).then(function(data) {
											if(data.returnCode == '000000'){
												if(data.returnData == null || data.returnData == ""){
													jfLayer.fail(T.T('KHJ4700039'));
													$scope.safeApply();
													result.cancel();
													//return;
												}
												$scope.data = data.returnData[0];
												$scope.protestVisaFormInf = data.returnData[0];
												$scope.protestMCFormInf = data.returnData[0];
												$scope.safeApply();
												result.cancel();
                                            }
                                        });
									}else if(data.returnData.rows[0].cardScheme == "M"){
										jfRest.request('mcannexTabInf','query', $scope.queryParam1).then(function(data) {
											if(data.returnCode == '000000'){
												if(data.returnData == null || data.returnData == ""){
													jfLayer.fail(T.T('KHJ4700040'));
													$scope.safeApply();
													result.cancel();
													//return;
												}
												$scope.data = data.returnData[0];
												$scope.data2 = data.returnData[1][0];
												$scope.protestVisaFormInf = data.returnData[0];
												$scope.protestMCFormInf = data.returnData[0];
												$scope.safeApply();
												result.cancel();
                                            }
                                        });
									}
									$scope.queryParam2 = {
											globalTransSerialNoAuth : $scope.disputeInf.oldGlobalSerialNumbr
									};
									$timeout(function() {
										jfRest.request('clearHitInf','query', $scope.queryParam2).then(function(data) {
											if(data.returnCode == '000000'){
												if(data.returnData == null || data.returnData == ""){
													jfLayer.fail(T.T('KHJ4700032'));
													$scope.safeApply();
													result.cancel();
													//return;
												}
												if(cardScheme == "V"){
													$scope.data1 = data.returnData[0];
													$scope.protestVisaFormInf = data.returnData[0];
													$scope.protestVisaFormInf.acquirerBusinessId = $scope.data.acquirerBusinessId;
													$scope.protestVisaFormInf.nationalReimburseFee = $scope.data.nationalReimburseFee;
													$scope.protestVisaFormInf.reimburseAttribute = $scope.data.reimburseAttribute;
													$scope.protestVisaFormInf.transIdentifier = $scope.data.transIdentifier;
													$scope.protestVisaFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
													$scope.protestVisaFormInf.settlementFlag =  $scope.data.settlementFlag;
													$scope.protestVisaFormInf.requestedPaymentService = $scope.data.requestedPaymentService;
													$scope.protestVisaFormInf.authorizationCharacteristicsIndicator = $scope.data.authorizationCharacteristicsIndicator;
													$scope.protestVisaFormInf.internationalFeeIndicator = $scope.data.internationalFeeIndicator;
													$scope.protestVisaFormInf.feeProgramIndicator = $scope.data.feeProgramIndicator;
													$scope.protestVisaFormInf.mailPhoneElectronicCommerceAndPaymentIndicator = $scope.data.mailPhoneElectronicCommerceAndPaymentIndicator;
													$scope.protestVisaFormInf.prepaidCardIndicator = $scope.data.prepaidCardIndicator;
													$scope.protestVisaFormInf.authorizedAmount = $scope.data.authorizedAmount;
													$scope.protestVisaFormInf.authorizationCurrencyCode = $scope.data.authorizationCurrencyCode;
													$scope.protestVisaFormInf.authorizationResponseCode = $scope.data.authorizationResponseCode;
													$scope.protestVisaFormInf.multipleClearingSequenceNumber = $scope.data.multipleClearingSequenceNumber;
													$scope.protestVisaFormInf.multipleClearingSequenceCount = $scope.data.multipleClearingSequenceCount;
													$scope.protestVisaFormInf.dynamicCurrencyConversionIndicator = $scope.data.dynamicCurrencyConversionIndicator;
													$scope.protestVisaFormInf.transCodeQualifer = $scope.data.transCodeQualifer;
													/*$scope.typeArray = [{name : "15",id : '15'}, {name : "16",id : '16'}, {name : "17",id : '17'}, {name : "35",id : '35'},
													                    {name : "36",id : '36'}, {name : "37",id : '37'}];
													$scope.typeArray1 =  [{name : T.T('KHJ4700041'),id : 'P'}];*/
													//动态请求下拉框 请求完成方式
													$scope.typeArray  ={ 
													        type:"dictData", 
													        param:{
													        	"type":"DROPDOWNBOX",
													        	groupsCode:"dic_requestedFulfllmentMethod",
													        	queryFlag: "children"
													        },//默认查询条件 
													        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
													        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
													        resource:"paramsManage.query",//数据源调用的action 
													        callback: function(data){
													        	
													        }
												};
													//动态请求下拉框 已建立的完成方式
													$scope.typeArray1  ={ 
													        type:"dictData", 
													        param:{
													        	"type":"DROPDOWNBOX",
													        	groupsCode:"dic_establishedFulfllmentMethod",
													        	queryFlag: "children"
													        },//默认查询条件 
													        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
													        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
													        resource:"paramsManage.query",//数据源调用的action 
													        callback: function(data){
													        	
													        }
												};
													$scope.safeApply();
													result.cancel();
													$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestVisaForm.html',
															'', {
																title : T.T('KHJ4700042'),
																buttons : [ T.T('F00125'),T.T('F00012') ],
																size : [ '1000px', '600px' ],
																callbacks : [$scope.saveConfirmVisaProtest]
															});
												}else if(cardScheme == "M"){
													$scope.data1 = data.returnData[0];
													$scope.protestMCFormInf = data.returnData[0];
													$scope.protestMCFormInf.processingCode = $scope.data2.processingCode;
													$scope.protestMCFormInf.dateAndTime = $scope.data2.dateAndTime;
													$scope.protestMCFormInf.posEntryMode = $scope.data2.posEntryMode;
													$scope.protestMCFormInf.dateExpiration = $scope.data2.dateExpiration;
													$scope.protestMCFormInf.forwdInstitIdCode = $scope.data2.forwdInstitIdCode;
													$scope.protestMCFormInf.retrievalReferNum = $scope.data2.retrievalReferNum;
													$scope.protestMCFormInf.serviceCode = $scope.data2.serviceCode;
													$scope.protestMCFormInf.cardAcceptorName = $scope.data2.cardAcceptorName;
													$scope.protestMCFormInf.transLifeCycleId = $scope.data2.transLifeCycleId;
													$scope.protestMCFormInf.messageNumber = $scope.data2.messageNumber;
													$scope.protestMCFormInf.transOriginInstit = $scope.data2.transOriginInstit;
													$scope.protestMCFormInf.oldGlobalSerialNumbr = $scope.disputeInf.oldGlobalSerialNumbr;
													$scope.protestMCFormInf.terminalType = $scope.data.P0023;
													$scope.protestMCFormInf.messageReversalIndicator = $scope.data.P0025;
													$scope.protestMCFormInf.electronicCommerceSecurityLevelIndicator = $scope.data.P0052;
													$scope.protestMCFormInf.currencyExponents = $scope.data.P0148;
													$scope.protestMCFormInf.currencyCodesAmountsOriginal = $scope.data.P0149;
													$scope.protestMCFormInf.businessActivity = $scope.data.P0158;
													$scope.protestMCFormInf.settlementIndicator = $scope.data.P0165;
													$scope.protestMCFormInf.masterCardAssignedId  = $scope.data.P0176;
													$scope.protestMCFormInf.exclusionRequestCode = 	$scope.data.P0260;
													$scope.protestMCFormInf.documentationIndicator = $scope.data.P0262;
//													$scope.typeArray = [{name : T.T('KHJ4700043'),id : '450'},{name : T.T('KHJ4700044'),id : '451'},{name : T.T('KHJ4700045'),id : '453'},{name : T.T('KHJ4700046'),id : '454'}];
													$scope.protestMCFormInf.mti = "1442";
													//动态请求下拉框 功能码
													$scope.typeArray  ={ 
													        type:"dictData", 
													        param:{
													        	"type":"DROPDOWNBOX",
													        	groupsCode:"dic_functionCode",
													        	queryFlag: "children"
													        },//默认查询条件 
													        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
													        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
													        resource:"paramsManage.query",//数据源调用的action 
													        callback: function(data){
													        	
													        }
													};
													$scope.safeApply();
													result.cancel();
													$scope.modal('/cstSvc/disputeAccontInfo/confirmProtestMCForm.html',
															'', {
																title : T.T('KHJ4700047'),
																buttons : [ T.T('F00125'), T.T('F00012')],
																size : [ '1000px', '600px' ],
																callbacks : [$scope.saveConfirmMCProtest]
															});
												}else{
													jfLayer.fail(T.T('KHJ4700037'));
													$scope.safeApply();
													result.cancel();
													//return;
												}
                                            }
                                        });
									},300);
								}else{
									jfLayer.fail(T.T('KHJ4700038'));
									$scope.safeApply();
									result.cancel();
									//return;
								}
							}else {
								jfLayer.fail(T.T('KHJ4700029'));
								$scope.safeApply();
								result.cancel();
                            }
                        }
					});
				}
			}
		};
		//账户信息查询
		$scope.itemList = {
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accBscInf.query',// 列表的资源
			autoQuery:false,
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.isShow = true;
				}else{
					$scope.isShow = false;
				}
			}
		};
		//查询账户金融信息
		$scope.viewAccFinancial = function(item){
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.item.idType = $scope.cstAccForm.idType;
			$scope.item.idNumber = $scope.cstAccForm.idNumber;
			$scope.item.externalIdentificationNo = $scope.cstAccForm.externalIdentificationNo;
			$scope.modal('/cstSvc/unifiedVisualManage/viewAccFinancial.html', $scope.item, {
				title : T.T('KHH4700097'),
				buttons : [T.T('F00108')],//'确认','取消' 
				size : [ '1100px', '600px' ],
				callbacks : [ ]
			});
		};
	});
	//查询账户金融信息
	webApp.controller('viewAccFinancialCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.accInfItem = $scope.item;
		//查询实时余额
		$scope.queryTimeBalance = function(item){
			$scope.balanceParams = {
					authDataSynFlag: "1",
					requestType: "1"
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			$scope.balanceParams.idType = $scope.item.idType;
			$scope.balanceParams.idNumber = $scope.item.idNumber;
			$scope.balanceParams.externalIdentificationNo = $scope.item.externalIdentificationNo;
			jfRest.request('acbaUnitList', 'queryBalance2', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
					$scope.accountId = data.returnData.rows[0].accountId;// 账号
					$scope.totalBalance = data.returnData.rows[0].totalBalance;//交易账户 
					$scope.billCostBalance = data.returnData.rows[0].feeForBill;
					$scope.billPrincipalBalance = data.returnData.rows[0].principalForBill;
					$scope.billInterestBalance = data.returnData.rows[0].interestForBill;
					$scope.currCostBalance = data.returnData.rows[0].feeForCurrent;
					$scope.currPrincipalBalance = data.returnData.rows[0].principalForCurrent;
					$scope.currInterestBalance = data.returnData.rows[0].interestForCurrent;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
					}
				}
			});
		};
		//查询实时余额
		if($scope.accInfItem.subAccIdentify && $scope.accInfItem.subAccIdentify != 'L'){
			$scope.queryTimeBalance($scope.accInfItem);
		}
		
		//账户余额单元信息
		$scope.balObcList = {
				params : $scope.queryParam = {
						idType:$scope.accInfItem.idType,
						idNumber:$scope.accInfItem.idNumber,
						externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
						accountId:$scope.accInfItem.accountId,
						currencyCode:$scope.accInfItem.currencyCode,
						operationMode:$scope.accInfItem.operationMode,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType'],//查找数据字典所需参数
				transDict : ['balanceType_balanceTypeDesc'],
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//账户余额对象信息
		$scope.accBalObjTable = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
			transDict : ['rateChangeFlag_rateChangeFlagDesc','overpayRateChangeFlag_overpayRateChangeFlagDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//账户周期金融信息
		$scope.accCycleFiciList = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,
			resource : 'accCycleFiciList.query',
			callback : function(data) {
			}
		};
		//余额单元弹窗查询  "本金""利息""费用"
		$scope.balanceTypeArray = [{id:"P",name:T.T('KHH4700036')},{id:"I",name:T.T('KHH4700037')},{id:"F",name:T.T('KHH4700038')}];
		$scope.checkAcUint = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/acbaDtlEnqr.html', $scope.item, {
				title : T.T('KHJ4700002'),//'余额单元明细',
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		//账户余额对象信息弹窗查询
		$scope.checkAcBaObj = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/acbaUnitList/layerAcObjDetail.html', $scope.item, {
				title : T.T('KHJ4700003'),//'余额对象明细',
				buttons : [T.T('F00012') ],//'关闭'
				size : [ '900px', '500px' ],
				//callbacks : [ $scope.callback ]
			});
		};
		//账户周期金融明细弹窗
		$scope.checkAcbaDtlEnqr = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/cstSvc/accCycleFiciList/accCycleFiciDetail.html', $scope.item, {
				title : T.T('KHJ4700004'),//'账户周期金融明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '450px' ],
				//callbacks : [ $scope.callback ]
			});
		};
	});
	//交易明细查询  !
	webApp.controller('layerCreditTradeAccCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemInf = $scope.itemDetailInf;
		console.log($scope.itemInf);
		if($scope.itemDetailInf.status == '0'){
			$scope.statusInfo =T.T('KHH47000125');
		}else if($scope.itemDetailInf.status == '1'){
			$scope.statusInfo = T.T('KHH47000127');
		}else if($scope.itemDetailInf.status == '2'){
			$scope.statusInfo = T.T('KHH47000126');
		}else if($scope.itemDetailInf.status == '3'){
			$scope.statusInfo = T.T('KHH47000128');
		}
		else if($scope.itemDetailInf.status == '4'){
			$scope.statusInfo = T.T('KHH47000129');
		}
		if($scope.itemDetailInf.currencyCode == '156'){
			$scope.currencyCodeInfo = T.T('KHH4700020');
		}else if($scope.itemDetailInf.currencyCode == '840'){
			$scope.currencyCodeInfo = T.T('KHH4700021');
		}
		if($scope.itemDetailInf.repayMode == '0'){
			$scope.repayModeInfo = T.T('KHJ4700019');
		}else if($scope.itemDetailInf.repayMode == '2'){
			$scope.repayModeInfo = T.T('KHJ4700020');
		}else if($scope.itemDetailInf.repayMode == '3'){
			$scope.repayModeInfo = T.T('KHJ4700021');
		}else if($scope.itemDetailInf.repayMode == '4'){
			$scope.repayModeInfo = T.T('KHJ4700022');
		}
		else if($scope.itemDetailInf.repayMode == '5'){
			$scope.repayModeInfo = T.T('KHJ4700023');
		}
		else if($scope.itemDetailInf.repayMode == '13'){
			$scope.repayModeInfo = T.T('KHJ4700024');
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
				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo,
				currencyCode:$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.totalBalance = data.returnData.obj.totalBalance;
				}
			}
		};
	});
	//查询账户金融信息
	webApp.controller('layerAccFinancialCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.accInfItem = $scope.item;
		if($scope.accInfItem.businessDesc){
			$scope.accInfItem.businessTypeCodeTrans = $scope.accInfItem.businessTypeCode + $scope.accInfItem.businessDesc;
		}else {
			$scope.accInfItem.businessTypeCodeTrans = $scope.accInfItem.businessTypeCode;
        }
        if($scope.accInfItem.productDesc){
			$scope.accInfItem.productObjectCodeTrans = $scope.accInfItem.productObjectCode + $scope.accInfItem.productDesc;
		}else {
			$scope.accInfItem.productObjectCodeTrans = $scope.accInfItem.productObjectCode;
        }
        if($scope.accInfItem.programDesc){
			$scope.accInfItem.businessProgramNoTrans = $scope.accInfItem.businessProgramNo + $scope.accInfItem.programDesc;
		}else {
			$scope.accInfItem.businessProgramNoTrans = $scope.accInfItem.businessProgramNo;
        }
        //账户状态
		if($scope.accInfItem.statusCode==1){
			$scope.accInfItem.statusCodeTrans = T.T('KHH4700077');//"活跃账户";
		}else if($scope.accInfItem.statusCode==2){
			$scope.accInfItem.statusCodeTrans = T.T('KHH4700056');//"非活跃账户";
		}else if($scope.accInfItem.statusCode==3){
			$scope.accInfItem.statusCodeTrans = T.T('KHH4700057');//"冻结账户";
		}else if($scope.accInfItem.statusCode==8){
			$scope.accInfItem.statusCodeTrans = T.T('KHH4700058');//"关闭账户";
		}else if($scope.accInfItem.statusCode==9){
			$scope.accInfItem.statusCodeTrans = T.T('KHH4700059');//"待删除账户";
        }
        //查询实时余额
		$scope.queryTimeBalance = function(item){
			console.log(item);
			$scope.balanceParams = {
					authDataSynFlag: "1",
					requestType: "1"
			};
			$scope.balanceParams  = Object.assign($scope.balanceParams,item);
			jfRest.request('acbaUnitList', 'queryBalance', $scope.balanceParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.accountInfTrue = true;
					$scope.isShow = true;
					$scope.accountId = data.returnData.rows[0].accountId;
					$scope.totalBalance = data.returnData.rows[0].totalBalance;
					$scope.currPrincipalBalance = data.returnData.rows[0].currPrincipalBalance;
					$scope.billPrincipalBalance = data.returnData.rows[0].billPrincipalBalance;
					$scope.currInterestBalance = data.returnData.rows[0].currInterestBalance;
					$scope.billInterestBalance = data.returnData.rows[0].billInterestBalance;
					$scope.currCostBalance = data.returnData.rows[0].currCostBalance;
					$scope.billCostBalance = data.returnData.rows[0].billCostBalance;
					$scope.accInfItem.customerName = data.returnData.rows[0].customerName;
				}else {
					if(data.returnCode == 'AUTH-00179'){
						$scope.isShow = true ;
					}else{
						$scope.isShow = false ;
					}
				}
			});
		};
		$scope.queryTimeBalance($scope.accInfItem);
		//账户余额单元信息
		$scope.balObcList = {
				params : $scope.queryParam = {
						idType:$scope.accInfItem.idType,
						idNumber:$scope.accInfItem.idNumber,
						externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
						accountId:$scope.accInfItem.accountId,
						currencyCode:$scope.accInfItem.currencyCode,
						operationMode:$scope.accInfItem.operationMode,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'acbaUnitList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType'],//查找数据字典所需参数
				transDict : ['balanceType_balanceTypeDesc'],
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//账户余额对象信息
		$scope.accBalObjTable = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,// 默认true,是否分页
			resource : 'accBalObj.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
			transDict : ['rateChangeFlag_rateChangeFlagDesc','overpayRateChangeFlag_overpayRateChangeFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//账户周期金融信息
		$scope.accCycleFiciList = {
			params : {
				idType:$scope.accInfItem.idType,
				idNumber:$scope.accInfItem.idNumber,
				externalIdentificationNo:$scope.accInfItem.externalIdentificationNo,
				accountId:$scope.accInfItem.accountId,
				currencyCode:$scope.accInfItem.currencyCode,
				operationMode:$scope.accInfItem.operationMode,
			},
			paging : true,
			resource : 'accCycleFiciList.query',
			callback : function(data) {
			}
		};
	});
	//查询争议账户查询 
	webApp.controller('layerDisputeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		/*溢缴款冻结状态 F-已冻结，U-已解冻，N-无冻结
		额度占用标识： 1-占额，0-不占额
		状态码：D-登记未释放，C-已释放利于客户，B-已释放利于银行*/
	/*	//溢缴款冻结状态
		$scope.overpayFreezeStatusArr = [{name : T.T('KHJ4700010'),id : 'F'},{name : T.T('KHJ4700011'),id : 'U'},{name : T.T('KHJ4700012'),id : 'N'}];
		//额度占用标识
		$scope.amtOccFlagArr = [{name : T.T('KHJ4700013'),id : '1'},{name : T.T('KHJ4700014'),id : '0'}];
		//状态码
		$scope.statusCodeArr = [{name : T.T('KHH47000106'),id : 'D'},{name : T.T('KHH47000108'),id : 'C'},{name : T.T('KHH47000107'),id : 'B'}];*/
		//动态请求下拉框 溢缴款冻结状态
		 $scope.overpayFreezeStatusArr ={ 
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
		//动态请求下拉框 额度占用标识
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
		//动态请求下拉框 状态码
		 $scope.statusCodeArr ={ 
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
		//账户组织形式
		if($scope.disputeInf.accountOrganForm == "R"){
			$scope.disputeInf.accountOrganFormTrans = T.T('KHH4700053');//"循环";
		}else if($scope.disputeInf.accountOrganForm == "T"){
			$scope.disputeInf.accountOrganFormTrans = T.T('KHH4700054');//"交易";
        }
        //账户性质
		if($scope.disputeInf.businessDebitCreditCode=='C'){
			$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ4700056');//"贷记";
		}else if($scope.disputeInf.businessDebitCreditCode=='D'){
			$scope.disputeInf.businessDebitCreditCodeTrans = T.T('KHJ4700057');//"借记";
        }
        //账户状态
		if($scope.disputeInf.statusCode==1){
			$scope.disputeInf.statusCodeTrans = T.T('KHH4700077');//"活跃账户";
		}else if($scope.disputeInf.statusCode==2){
			$scope.disputeInf.statusCodeTrans = T.T('KHH4700056');//"非活跃账户";
		}else if($scope.disputeInf.statusCode==3){
			$scope.disputeInf.statusCodeTrans = T.T('KHH4700057');//"冻结账户";
		}else if($scope.disputeInf.statusCode==8){
			$scope.disputeInf.statusCodeTrans = T.T('KHH4700058');//"关闭账户";
		}else if($scope.disputeInf.statusCode==9){
			$scope.disputeInf.statusCodeTrans = T.T('KHH4700059');//"待删除账户";
        }
    });
	//溢缴款查询页面
	webApp.controller('viewDepositCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_depositInf');
		$translate.refresh();
	});
	//原交易信息弹窗
	webApp.controller('orginTransInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
//		$scope.ectypeArray = [{name : T.T('KHJ4700058'),id : '0'},{name : T.T('KHJ4700059'),id : '1'}];
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
		/*问题：根据原交易全局流水号可以定位到唯一的同源交易吗？
		二：事件编号怎么定位，传参需要*/
		//原交易信息 根据原交易全局流水号查询历史表
		$scope.sameSourceTransParams = {
				externalIdentificationNo: $scope.item.externalIdentificationNo,
				"globalSerialNumbr" : $scope.item.oldGlobalSerialNumbr,
				"eventNo" : 'PT.40',//、、目前定位不到事件编号
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "5"
			};
		jfRest.request('finacialTrans', 'query', $scope.sameSourceTransParams).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.orginTransInfo = data.returnData.rows[0];
			} 
		});
		//判断是否有争议登记
		/*$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.disputeFlagInfo = data.returnData.disputeFlag; 
			} else {
				var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035')
				jfLayer.fail(returnMsg);
			}
		});*/
	});
	//周期金融明细
	webApp.controller('accCycleFiciDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		if($scope.item.fullPaymentFlag=='Y'){
			$scope.item.fullPaymentFlagDesc = T.T('KHJ4700005');//"已满足";
		}else if($scope.item.fullPaymentFlag=='N'){
			$scope.item.fullPaymentFlagDesc = T.T('KHJ4700006');//"不满足";
		}
	});
	//余额单元
	webApp.controller('acbaUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
	//余额对象
	webApp.controller('accObjDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
	});
	//转出操作
	webApp.controller('rollOutOperateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = $scope.custInf.systemUnitNo;
//			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.rollOutOperate.transDate = data.returnData.rows[0].nextProcessDate;
                }
            });
		};
		$scope.queryDate();
	});
});
