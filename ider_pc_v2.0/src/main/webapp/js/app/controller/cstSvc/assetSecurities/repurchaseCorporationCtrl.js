'use strict';
define(function(require) {
	var webApp = require('app');
	// 回购法人标志维护
	webApp.controller('repurchaseCorporationCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_priceView');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.basicInfo = {};
    	$scope.isDiv = false;
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
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
        	$scope.idNumber = '';
        	if(data.value == "1"){//身份证
        		$("#packet_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#packet_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#packet_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#packet_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#packet_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#packet_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#packet_idNumber").attr("validator","noValidator");
        		$scope.packetItemForm.$setPristine();
        		$("#packet_idNumber").removeClass("waringform ");
            }
        });
        
	// 重置事件
	$scope.reset = function() {
		$scope.basicInfo.idNumber= '';
		$scope.basicInfo.externalIdentificationNo= '';
		$scope.basicInfo.idType= '';
		$scope.basicInfo.operationMode = '';
		//$scope.isShow = false;
		$("#packet_idNumber").attr("validator","noValidator");
		$("#packet_idNumber").removeClass("waringform ");
	};
	//查询事件
	$scope.queryPacketInf = function(){
		if(($scope.basicInfo.idType == null || $scope.basicInfo.idType == ''|| $scope.basicInfo.idType == undefined) &&
				($scope.basicInfo.idNumber == "" || $scope.basicInfo.idNumber == undefined )
				&&( $scope.basicInfo.externalIdentificationNo == "" || $scope.basicInfo.externalIdentificationNo == undefined)
				
			){
			jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
		}{
			if($scope.basicInfo.idType){
				if($scope.basicInfo.idNumber == null || $scope.basicInfo.idNumber == undefined || $scope.basicInfo.idNumber == ''){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
				}else if($scope.basicInfo.externalIdentificationNo){
					jfLayer.alert('F00076');
				}else {
					$scope.isDiv = true;
					$scope.revoleQuery();
					$scope.transQuery();
				}
			}else if($scope.basicInfo.idNumber){
				if($scope.basicInfo.idType == null || $scope.basicInfo.idType == undefined || $scope.basicInfo.idType == ''){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
				}else if($scope.basicInfo.externalIdentificationNo){
					jfLayer.alert('F00076');
				}else {
					$scope.isDiv = true;
					$scope.revoleQuery();
					$scope.transQuery();
				}
			}else if($scope.basicInfo.externalIdentificationNo){
				$scope.isDiv = true;
				$scope.revoleQuery();
				$scope.transQuery();
			}
		}
	};
	/*开始*/
	//循环账户信息表
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
	$scope.queryParam04 = {
		type: "DROPDOWNBOX",
		groupsCode : "dic_loanStatus",
		queryFlag : "children"
	};
	jfRest.request('paramsManage', 'query',$scope.queryParam04).then(function(data) {
		$scope.loanStatusList = data.returnData.rows;//贷款状态
	});
	$scope.queryParam05 = {
		type: "DROPDOWNBOX",
		groupsCode : "dic_assetAccType",
		queryFlag : "children"
	};
	jfRest.request('paramsManage', 'query',$scope.queryParam05).then(function(data) {
		$scope.assetAccTypeList = data.returnData.rows;//贷款状态
	});
	$scope.queryParam06 = {
		type: "DROPDOWNBOX",
		groupsCode : "dic_childAccType",
		queryFlag : "children"
	};
	jfRest.request('paramsManage', 'query',$scope.queryParam06).then(function(data) {
		$scope.childAccTypeList = {};
		$scope.childAccTypeList = data.returnData.rows;//贷款状态
	});
	$scope.queryParam07 = {
		type: "DROPDOWNBOX",
		groupsCode : "dic_repurchaseMark",
		queryFlag : "children"
	};
	jfRest.request('paramsManage', 'query',$scope.queryParam07).then(function(data) {
		$scope.absRepoIndicatorList = data.returnData.rows;//账户组织形式
	}); 
	//查询循环主子账户
	 $scope.pageCountR = 0;
	 $scope.pageNumR = 1;
	 $scope.pageSizeR = 10;
	 $scope.revoleQuery = function(){
		 $scope.revoleAccList = [];
			layui.use(['treeTable'], function () {
				var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		     // 循环账户
		        var insTb = treeTable.render({
		            elem: '#revoleAccTreeTableRep',
		            tree: {
		            	iconIndex: 0,
		            },
		            checkFlag:false,//子账户不需要复选框
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
		                //{type: 'checkbox'},//radio
		                {align: 'center',field: 'accountId', title: T.T('KHH4700004'),width:230},
		                {field: 'currencyDesc', align: 'center',title: T.T('KHH4700014'), width:100,templet: function(d){
		                    if(d.haveChild == true){
		                    	return '<span>'+ d.currencyDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'businessProgramNo', title:  T.T('KHH47000243'), width:210,templet: function(d){
		                  if(d.haveChild == true){
		                    	if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.businessProgramNo + d.programDesc +'</span>';
			                    }else {
			                    	return '<span></span>';
                                }
                          }else if(d.haveChild == false){
		                		return '<span>'+ d.subAccIdentifyDesc +'</span>';
		                    }
		                }},
		               {field: 'productObjectCode', title: T.T('KHH47000244'), width:180,templet: function(d){
		            	   if(d.haveChild == true){
		            		   if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.productObjectCode + d.productDesc +'</span>';
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
		                {field: 'accountOrganFormDesc', align: 'center', title: T.T('KHH4700050'), width:100,templet: function(d){
		                	 if(d.haveChild == true){
			                    	return '<span>'+ d.accountOrganFormDesc +'</span>';
			                    }else if(d.haveChild == false){
			                    	return '<span>-</span>';
			                    }
		                }},
		               {field: 'businessDebitCreditCodeDesc', align: 'center', title: T.T('KHH4700051'), width:100,templet: function(d){
		                	if(d.haveChild == true){
		                    	return '<span>'+ d.businessDebitCreditCodeDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {field: 'accountingStatusCode', align: 'center', title: T.T('KHH6000029'),width:100},
		                {field: 'fundNum', align: 'center', title: T.T('KHH6000030'), width:100},
		                {field: 'capitalOrganizationName', align: 'center', title: T.T('KHH6000044'),width:100},
		                {field: 'absPlanId', align: 'center', title: T.T('KHH6000023'), width:100},
		                {field: 'capitalStage', align: 'center', title: T.T('KHH6000043'), width:100},
		                {field: 'accountTypeDesc', align: 'center', title: T.T('KHH6000045'), width:100},
		                {field: 'absRepoIndicatorListDesc', align: 'center', title: T.T('KHH6000060'), width:100,templet: function(d){
		                	if(d.haveChild == true){
		                    	return '<span>'+ d.absRepoIndicatorListDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'center', title: T.T("F00017"), width:200, templet: function(d){
			                return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="pauseStage">'+T.T("KHH6000058")+'</a>';
		                	
		                }}
		            ],
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					accFlag : "mainAcc",
		    					flag: "N",
		    					externalIdentificationNo : $scope.basicInfo.externalIdentificationNo,	
	            				idType : $scope.basicInfo.idType,
	            				idNumber : $scope.basicInfo.idNumber,
	            				operationMode: $scope.basicInfo.operationMode,
	            				absPlanId : data1.absPlanId,
	            				accountOrganForm :  data1.accountOrganForm,
		    					globalTransSerialNo : data1.globalTransSerialNo,
		    					productObjectCode: data1.productObjectCode,
		    					businessProgramNo:  data1.businessProgramNo,
		    					businessTypeCode:  data1.businessTypeCode,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		jfRest.request('assetSecurities', 'queryABSList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.operationListRChild = [];
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	            							//item.absPlanId = $scope.absPlanId;
	            							if(item.operation == "true"){
	            								$scope.operationListRChild.push(item.id);
	            							}
	            							//	账户组织形式
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
                                            //ABS资产类型
	            							for(var m = 0; m < $scope.assetAccTypeList.length; m++){
	            								if(item.accountType == $scope.assetAccTypeList[m].codes){
	            									item.accountTypeDesc = $scope.assetAccTypeList[m].detailDesc;
                                                }
                                            }
                                            //子账户类型
	            							for(var t = 0; t < $scope.childAccTypeList.length; t++){
	            								if(item.subAccIdentify == $scope.childAccTypeList[t].codes){
	            									item.subAccIdentifyDesc = $scope.childAccTypeList[t].detailDesc;
                                                }
                                            }
                                            //回购标志
	            							for(var d = 0; d < $scope.absRepoIndicatorList.length; d++){
	            								if(item.absRepoIndicator){
	            									if(item.absRepoIndicator == $scope.absRepoIndicatorList[d].codes){
	            										item.absRepoIndicatorListDesc = $scope.absRepoIndicatorList[d].detailDesc;
                                                    }
                                                }else{
	            									item.absRepoIndicatorListDesc = "";
	            								}
                                            }
                                        });
	        							callback(data.returnData.rows);
	        							//反显被选中的数据
	        							//insTb.setChecked($scope.operationListRChild);
	        							//复选框不可编辑
	        							//insTb.setCheckedDis();
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }
                            });
		            	}else {//查主账户
		            		$scope.params = {
	            				externalIdentificationNo : $scope.basicInfo.externalIdentificationNo,	
	            				idType : $scope.basicInfo.idType,
	            				idNumber : $scope.basicInfo.idNumber,
	            				operationMode: $scope.basicInfo.operationMode,
	            				pageFlag: "mainPage",
	            				accountOrganForm : 'R',
	            				flag:'N',
	            				pageNum: $scope.pageNumR,
	            		        pageSize: $scope.pageSizeR
		            		};
		            		jfRest.request('assetSecurities', 'queryABSList', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	        						var rows = data.returnData.rows;
	        						$scope.operationListR = [];
	        						if(data.returnData && data.returnData.rows && rows.length >0){
	        							$scope.pageCountR = data.returnData.totalCount;
	        							angular.forEach(rows,function(item,i){
	            							item.haveChild = true;
	            							if(item.operation == "true"){
	            								$scope.operationListR.push(item.id);
	            							}
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
                                            //ABS资产类型
	            							for(var m = 0; m < $scope.assetAccTypeList.length; m++){
	            								if(item.accountType == $scope.assetAccTypeList[m].codes){
	            									item.accountTypeDesc = $scope.assetAccTypeList[m].detailDesc;
                                                }
                                            }
                                            //子账户类型
	            							for(var t = 0; t < $scope.childAccTypeList.length; t++){
	            								if(item.subAccIdentify == $scope.childAccTypeList[t].codes){
	            									item.subAccIdentifyDesc = $scope.childAccTypeList[t].detailDesc;
                                                }
                                            }
                                            //回购标志
	            							for(var d = 0; d < $scope.absRepoIndicatorList.length; d++){
	            								if(item.absRepoIndicator == $scope.absRepoIndicatorList[d].codes){
	            									item.absRepoIndicatorListDesc = $scope.absRepoIndicatorList[d].detailDesc;
                                                }
                                            }
                                        });
	        							callback(data.returnData.rows);
	        							//反显被选中的数据
	        							insTb.setChecked($scope.operationListR);
	        							$scope.revoleAccList = insTb.checkStatus(false);
	        							//复选框不可编辑
	        							//insTb.setCheckedDis();
	        							layui.use(['laypage', 'layer'], function(){
	      			                      var laypage = layui.laypage
	      			                      ,layer = layui.layer;
	      			                      laypage.render({
	      			                            elem: 'secRevPage',
	      			                            count: $scope.pageCountR,
	      			                            limit: $scope.pageSizeR,
	      			                            curr: $scope.pageNumR,
	      			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	      			                            jump: function(obj,first){
	      			                             if (!first) {
	      			                              $scope.pageNumR = obj.curr;
	      			                              $scope.pageSizeR = obj.limit;
	      			                              $scope.revoleQuery();
	      			                             }
	      			                            }
	      			                        });
	      			                    });
	        							//insTb.refresh();
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		        });
		        //循环账户监听单选
		       /*treeTable.on('checkbox(revoleAccTreeTableRep)', function(obj){
		    	 //R-循环账户 T-交易账户 B-不良资产'
				   if($scope.pageParams.accountType == 'B'){
					   if(obj.checked){
						   $scope.revoleAccList.push(obj.data);
					   }else{
						  // $scope.revoleAccList.splice(obj.data, 1);
					   }
				   }else if($scope.pageParams.accountType == 'R'){
					   if(obj.checked){
						   $scope.revoleAccList.push(obj.data);
						   $scope.transAccList = [];
					   }
					   else{
						  // $scope.revoleAccList.splice(obj.data, 1);
						   $scope.transAccList = [];
					   }
				   }else if($scope.pageParams.accountType == 'T'){
					   $scope.revoleAccList = [];
				   }
		       });*/
		     //绑定事件
	        treeTable.on('tool(revoleAccTreeTableRep)', function (obj) {
        	var event = obj.event;
        	$scope.pauseStage(obj.data);
           });
		});
			
	 };
	 /*循环账户信息表回购维护*/
	$scope.pauseStage = function(item){
		$scope.info = {};
		$scope.info = $.parseJSON(JSON.stringify(item));
		$scope.info.externalIdentificationNo = $scope.basicInfo.externalIdentificationNo,
		$scope.modal('/cstSvc/assetSecurities/repurchaseMark.html', $scope.info, {
			title : T.T('KHH6000059'),// '回购法人维护标志'
			buttons : [T.T('F00125'),T.T('F00012') ],//'确认','关闭' 
			size : [ '900px', '580px' ],
			callbacks : [$scope.pauseStageInfo]
		});
	};
	//确认
	$scope.pauseStageInfo = function(result){
		$scope.items = result.scope.info;
		$scope.params = {
			accountId:$scope.items.accountId,
			absRepoIndicator : $scope.items.absRepoIndicator,
			externalIdentificationNo: $scope.items.externalIdentificationNo,
			currencyCode: $scope.items.currencyCode,
		};
		jfRest.request('assetSecurities', 'logoMaintenanceQuery', $scope.params).then(function(data) {
			if (data.returnCode == '000000') {
				jfLayer.success(T.T('KHJ6000012'));
				$scope.safeApply();
				result.cancel();
				$scope.revoleQuery();
			}
		});
	};
	 // 交易账户信息表
	 $scope.pageCountT = 0;
	 $scope.pageNumT = 1;
	 $scope.pageSizeT = 10;
	 $scope.transQuery = function(){
		 $scope.transAccList = [];
			layui.use(['treeTable'], function () {
				var $ = layui.jquery;
		        var treeTable = layui.treeTable;
		        var insTb2 = treeTable.render({
		            elem: '#transAccTreeTableRep',
		            tree: {
		            	iconIndex: 0,
		            	onlyIconControl: true // 仅允许点击图标折叠
		            },
		            height: 'auto',
		            even:true,//是否开启隔行变色
		            cols: [
	                   	//{type: 'numbers'},
		               // {type: 'checkbox'},//radio  
		                {align: 'center',field: 'businessTypeCode', title: T.T('KHH4700047'), width:150},
		                {align: 'center',field: 'accountId', title: T.T('KHH4600004'),width: 200},
		                {align: 'center',field: 'loanAmount', title: T.T('KHH4600005')},
		                {align: 'center',field: 'remainPrincipalAmount', title: T.T('KHH47000116')},
		                {align: 'center',field: 'currentTotalBalance', title: T.T('KHH6000007')},
		                {align: 'center',field: 'currencyCode', title: T.T('KHH4600006')},
		                {align: 'center',field: 'loanTerm', title: T.T('KHH4600007')},
		                {align: 'center',field: 'startIntDate', title: T.T('KHH4600008')},
		                {align: 'center',field: 'accountingStatusCode', title: T.T('KHH6000029')},
		                {align: 'center',field: 'fundNum', title: T.T('KHH6000030')},
		                {field: 'capitalOrganizationName', align: 'center', title: T.T('KHH6000044'),width:100},
		                {field: 'absPlanId', align: 'center', title: T.T('KHH6000023'), width:100},
		                {field: 'capitalStage', align: 'center', title: T.T('KHH6000043'), width:100},
		                {field: 'accountTypeDesc', align: 'center', title: T.T('KHH6000022'), width:100},
		                {field: 'absRepoIndicatorListDesc', align: 'center', title: T.T('KHH6000060'), width:100,templet: function(d){
		                	if(d.haveChild == true){
		                    	return '<span>'+ d.absRepoIndicatorListDesc +'</span>';
		                    }else if(d.haveChild == false){
		                    	return '<span>-</span>';
		                    }
		                }},
		                {align: 'center', title: T.T("F00017"), width:200, templet: function(d){
			                return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="logoMaintenance">'+T.T("KHH6000058")+'</a>';
		                	
		                }}
	                ],
		            reqData: function (data1, callback) {
		            	setTimeout(function () {  // 故意延迟一下
		            	if(data1){//子账户
		            		$scope.params = {
		    					accFlag : "mainAcc",
		    					flag: "N",
		    					externalIdentificationNo : $scope.basicInfo.externalIdentificationNo,	
	            				idType : $scope.basicInfo.idType,
	            				idNumber : $scope.basicInfo.idNumber,
	            				operationMode: $scope.basicInfo.operationMode,
	            				absPlanId : data1.absPlanId,
	            				accountOrganForm :  data1.accountOrganForm,
		    					globalTransSerialNo : data1.globalTransSerialNo,
		    					productObjectCode: data1.productObjectCode,
		    					businessProgramCode:  data1.businessProgramCode,
		    					businessTypeCode:  data1.businessTypeCode,
		    					customerNo : data1.customerNo,
		    					currencyCode : data1.currencyCode,
	                		};
		            		jfRest.request('assetSecurities', 'subAccount', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	                				$scope.operationListChild = [];
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
	            							item.haveChild = false;
	            							if(item.operation == "true"){
	            								$scope.operationListChild.push(item.id);
	            							}
	            							/*//信贷类型
	            							for(var m = 0; m < $scope.loanTypeList.length; m++){
	            								if(item.loanType == $scope.loanTypeList[m].codes){
	            									item.loanTypeDesc = $scope.loanTypeList[m].detailDesc;
		            							};
	            							};*/
	            							//	贷款状态
	            							for(var k = 0; k < $scope.loanStatusList.length; k++){
	            								if(item.status == $scope.loanStatusList[k].codes){
	            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                }
                                            }
                                            //ABS资产类型
	            							for(var m = 0; m < $scope.assetAccTypeList.length; m++){
	            								if(item.accountType == $scope.assetAccTypeList[m].codes){
	            									item.accountTypeDesc = $scope.assetAccTypeList[m].detailDesc;
                                                }
                                            }
                                            //回购标志
	            							for(var d = 0; d < $scope.absRepoIndicatorList.length; d++){
	            								if(item.absRepoIndicator){
	            									if(item.absRepoIndicator == $scope.absRepoIndicatorList[d].codes){
		            									item.absRepoIndicatorListDesc = $scope.absRepoIndicatorList[d].detailDesc;
                                                    }
                                                }else{
	            									item.absRepoIndicatorListDesc = "";
	            								}
                                            }
                                        });
	        							callback(data.returnData.rows);
	        							//反显被选中的数据
	        							insTb2.setChecked($scope.operationListChild);
	        							//复选框不可编辑
	        							//insTb2.setCheckedDis();
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }
                            });
		            	}else {//查主账户
		            		$scope.params = {
		            				externalIdentificationNo : $scope.basicInfo.externalIdentificationNo,	
		            				idType : $scope.basicInfo.idType,
		            				idNumber : $scope.basicInfo.idNumber,
		            				operationMode: $scope.basicInfo.operationMode,
		            				accountOrganForm : 'R',
		            				flag:'N',
		            				pageNum: $scope.pageNumT,
		            		        pageSize: $scope.pageSizeT
	                		}; 
		            		jfRest.request('assetSecurities', 'queryTradingAccount', $scope.params).then(function(data) {
	                			if (data.returnCode == '000000') {
	        						var rows = data.returnData.rows;
	        						$scope.operationList = [];
	        						if(data.returnData && data.returnData.rows && rows.length >0){
	        					 		$scope.pageCountT = data.returnData.totalCount;
	        							angular.forEach(rows,function(item,i){
	            							item.haveChild = true;
	            							if(item.operation == "true"){
	            								$scope.operationList.push(item.id);
	            							}
	            							/*//信贷类型
	            							for(var m = 0; m < $scope.loanTypeList.length; m++){
	            								if(item.loanType == $scope.loanTypeList[m].codes){
	            									item.loanTypeDesc = $scope.loanTypeList[m].detailDesc;
		            							};
	            							};*/
	            							//	贷款状态
	            							for(var k = 0; k < $scope.loanStatusList.length; k++){
	            								if(item.status == $scope.loanStatusList[k].codes){
	            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                }
                                            }
                                            //ABS资产类型
	            							for(var m = 0; m < $scope.assetAccTypeList.length; m++){
	            								if(item.accountType == $scope.assetAccTypeList[m].codes){
	            									item.accountTypeDesc = $scope.assetAccTypeList[m].detailDesc;
                                                }
                                            }
                                            //回购标志
	            							for(var d = 0; d < $scope.absRepoIndicatorList.length; d++){
	            								if(item.absRepoIndicator){
	            									if(item.absRepoIndicator == $scope.absRepoIndicatorList[d].codes){
		            									item.absRepoIndicatorListDesc = $scope.absRepoIndicatorList[d].detailDesc;
                                                    }
                                                }else{
	            									item.absRepoIndicatorListDesc = "";
	            								}
                                            }
                                        });
	        							callback(data.returnData.rows);
	        							//反显被选中的数据
	        							insTb2.setChecked($scope.operationList);
	        							$scope.transAccList = insTb2.checkStatus(false);
	        							layui.use(['laypage', 'layer'], function(){
	        			                      var laypage = layui.laypage
	        			                      ,layer = layui.layer;
	        			                      laypage.render({
	        			                            elem: 'secTransPage',
	        			                            count: $scope.pageCountT,
	        			                            limit: $scope.pageSizeT,
	        			                            curr: $scope.pageNumT,
	        			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
	        			                            jump: function(obj,first){
	        			                             if (!first) {
	        			                              $scope.pageNumT = obj.curr;
	        			                              $scope.pageSizeT = obj.limit;
	        			                              $scope.transQuery();
	        			                             }
	        			                            }
	        			                        });
	        			                    });
	        							//复选框不可编辑
	        							//insTb2.setCheckedDis();
	        							//insTb.refresh();
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }
                            });
                        }
                        }, 800);//setTimeout
		            },
		        });
		        //绑定事件
		        treeTable.on('tool(transAccTreeTableRep)', function (obj) {
		        	console.log(obj);
		            var event = obj.event;
		            $scope.logoMaintenance(obj.data);
			   });
			});
	 	};
	 	/*end*/
	 	/*子表回购标志维护*/
		$scope.logoMaintenance = function(item){
			$scope.itemDetails = {};
			$scope.itemDetails = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/assetSecurities/subRepurchaseMark.html', $scope.itemDetails, {
				title : T.T('KHH6000059'),// 
				buttons : [T.T('F00125'),T.T('F00012')],//'确认','关闭'
				size : [ '900px', '580px' ],
				callbacks : [$scope.logoMaintenanceInfo]
			});
		};
		//确认
		$scope.logoMaintenanceInfo = function(result){
			$scope.itemInf = result.scope.itemDetails;
			$scope.pauseStageparams = {
				accountId:$scope.itemInf.accountId,
				absRepoIndicator : $scope.itemInf.absRepoIndicator,
				externalIdentificationNo: $scope.itemInf.externalIdentificationNo,
				currencyCode: $scope.itemInf.currencyCode,
			};
			jfRest.request('assetSecurities', 'logoMaintenanceQuery', $scope.pauseStageparams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ6000012'));
					$scope.safeApply();
					result.cancel();
					$scope.transQuery();
					
				}
			});
		};
	});
	//循环账户信息表的回购标志
	webApp.controller('repurchaseMarkCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translate.refresh();
		//回购法人标志维护
		$scope.absRepoIndicatorArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_repurchaseMark",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					
				}
			};		
	});
	//交易账户信息表的回购标志
	webApp.controller('subRepurchaseMarkCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translate.refresh();
		//	回购法人标志维护
		$scope.absRepoIndicatorArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_repurchaseMark",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					
				}
			};		
	});
	
});
