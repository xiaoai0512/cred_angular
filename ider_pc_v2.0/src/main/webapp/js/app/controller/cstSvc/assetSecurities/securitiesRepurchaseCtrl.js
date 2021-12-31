'use strict';
define(function(require) {

	var webApp = require('app');

	// 资产证券转让
	webApp.controller('securitiesRepurchaseCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_priceView');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.assignmentForm={};
    	//动态请求下拉框 证件类型
		 $scope.certificateTypeArray1 = { 
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
            		$("#assignment_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#assignment_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#assignment_idNumber").attr("validator","id_isTWCard");

            	}else if(data.value == "4"){//中国护照
            		$("#assignment_idNumber").attr("validator","id_passport");

            	}else if(data.value == "5"){//外国护照passport
            		$("#assignment_idNumber").attr("validator","id_passport");

            	}else if(data.value == "6"){//外国人永久居留证
            		$("#assignment_idNumber").attr("validator","id_isPermanentReside");

            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#assignment_idNumber").attr("validator","noValidator");
            		$scope.assignmentItemForm.$setPristine();
            		
            		$("#assignment_idNumber").removeClass("waringform ");
                }
            });
            //转让方式
            $scope.typeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_type",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.assignmentForm.type = '0';
		        }
			};
          //ABS计划代码
            $scope.planIdArray ={ 
    	        type:"dynamicDesc", 
    	        param:{capitalStage:'PACK'},//默认查询条件 
    	        text:"planId", //下拉框显示内容，根据需要修改字段名称 
    	        desc:"planDesc",
    	        value:"planId",  //下拉框对应文本的值，根据需要修改字段名称 
    	        resource:"assetSecurities.queryABSPlan",//数据源调用的action 
    	        callback: function(data){
    	        	$scope.planIdList = [];
    	        	$scope.planIdList = data;
    	        	console.log($scope.planIdList);
    	        }
    	    };
		// 重置事件
		$scope.reset = function() {
			$scope.assignmentForm.idNumber= '';
			$scope.assignmentForm.externalIdentificationNo= '';
			$scope.assignmentForm.idType= '';
			$scope.isAssignmentShow = false;
			$("#priceView_idNumber").attr("validator","noValidator");
			$("#priceView_idNumber").removeClass("waringform ");
		};
		//查询事件
		$scope.querypriceInf = function(){
			if(($scope.assignmentForm.idType == null || $scope.assignmentForm.idType == ''|| $scope.assignmentForm.idType == undefined) &&
					($scope.assignmentForm.idNumber == "" || $scope.assignmentForm.idNumber == undefined )
					&&( $scope.assignmentForm.externalIdentificationNo == "" || $scope.assignmentForm.externalIdentificationNo == undefined)
				){
				$scope.isAssignmentShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.assignmentForm.idType){
					if($scope.assignmentForm.idNumber == null || $scope.assignmentForm.idNumber == undefined || $scope.assignmentForm.idNumber == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isAssignmentShow = false;
					}else if($scope.assignmentForm.externalIdentificationNo){
						jfLayer.alert(T.T('F00076'));
						$scope.isAssignmentShow = false;
					}else if($scope.assignmentForm.planId == null || $scope.assignmentForm.planId == undefined || $scope.assignmentForm.planId == ''){
						jfLayer.alert(T.T('KHJ6000009'));//'请选择ABS计划代码 '
						$scope.isAssignmentShow = false;
					}else {
						$scope.isShowWindowAcc($scope.assignmentForm);
					}
				}else if($scope.assignmentForm.idNumber){
					if($scope.assignmentForm.idType == null || $scope.assignmentForm.idType == undefined || $scope.assignmentForm.idType == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isAssignmentShow = false;
					}else if($scope.assignmentForm.externalIdentificationNo){
						jfLayer.alert('F00076');
						$scope.isAssignmentShow = false;
					}else if($scope.assignmentForm.planId == null || $scope.assignmentForm.planId == undefined || $scope.assignmentForm.planId == ''){
						jfLayer.alert(T.T('KHJ6000009'));//'请选择ABS计划代码 '
						$scope.isAssignmentShow = false;
					}else {
						$scope.isShowWindowAcc($scope.assignmentForm);
					}
					
				}else if($scope.assignmentForm.externalIdentificationNo){
					if($scope.assignmentForm.planId == null || $scope.assignmentForm.planId == undefined || $scope.assignmentForm.planId == ''){
						jfLayer.alert(T.T('KHJ6000009'));//'请选择ABS计划代码 '
						$scope.isAssignmentShow = false;
					}else{
						$scope.isShowWindowAcc($scope.assignmentForm);
					}
				}
			}
		};
		var form = layui.form;
		 form.on('select(getPlanId)',function(event){
			 $scope.accountTypePage = "";
			if(event.value){
				for(var j=0;j<$scope.planIdList.length;j++){
					if($scope.planIdList[j].planId == event.value){
						$scope.accountTypePage = $scope.planIdList[j].accountType;
					}
				}
			}else{
				$scope.accountTypePage = "";
			}
		 });
		//点击查询，根据返回结果，如果是不良资产显示循环账户信息及交易账户信息，如果是循环账户显示循环账户信息列表，如果是交易账户显示交易账户信息列表
		$scope.isShowWindowAcc = function(params){
			$scope.pageParams = {};
			$scope.pageParams = params;
			$scope.pageParams.accountType = $scope.accountTypePage;
			//R-循环账户 T-交易账户 B-不良资产'
			if($scope.accountTypePage == 'B'){
				$scope.titlePage = T.T('KHH6000038');
			}else if($scope.accountTypePage == 'R'){
				$scope.titlePage = T.T('KHH6000039');
			}else if($scope.accountTypePage == 'T'){
				$scope.titlePage = T.T('KHH6000040');
			}
			$scope.modal('/cstSvc/assetSecurities/secAccountList.html', $scope.pageParams, {
				//title :  T.T('KHJ4700017'),
				title :  $scope.titlePage,
				buttons : [T.T('F00125'), T.T('F00046') ],
				size : [ '1100px', '520px' ],
				callbacks : [ $scope.accDetailSure ]
			});
		};
		//确认
		$scope.accDetailSure = function(result){
			$scope.accSure = {};
			$scope.accSure.accountList = [];
			$scope.accountTransList = [];
			$scope.accountRevoleList = [];
			$scope.resultList = [];
			$scope.accountSureList = [];
			if(result.scope.params.externalIdentificationNo){
				$scope.accSure.externalIdentificationNo = result.scope.params.externalIdentificationNo;
			}
			if(result.scope.params.idType){
				$scope.accSure.idType = result.scope.params.idType;
			}
			if(result.scope.params.idNumber){
				$scope.accSure.idNumber = result.scope.params.idNumber;
			}
			$scope.accSure.planId = result.scope.params.planId;
			$scope.accSure.type = result.scope.params.type;
			$scope.accountTransList = result.scope.transAccList;
			$scope.accountRevoleList = result.scope.revoleAccList;
			if($scope.accountRevoleList.length > 0){
				for(var i=0;i<$scope.accountRevoleList.length;i++){
					$scope.resultList.push($scope.accountRevoleList[i]);
				}
			}
			if($scope.accountTransList.length > 0){
				for(var i=0;i<$scope.accountTransList.length;i++){
					$scope.resultList.push($scope.accountTransList[i]);
				}
			}
			if($scope.resultList.length > 0){
				for(var i=0;i<$scope.resultList.length;i++){
				 	if($scope.resultList[i].LAY_CHECKED == true){
				 		$scope.accountSureList.push($scope.resultList[i]);
				 	}
				}
			}
			$scope.accSure.accountList = $scope.accountSureList;
			jfRest.request('assetSecurities', 'surePack', $scope.accSure).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00034'));
					 $scope.safeApply();
					 result.cancel();
				}
			});
		}
		
		
		
		
		//查询
/*		$scope.assignmentList = {
			//checkType : 'radio',
			params : {
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'assetSecurities.queryAssignment',// 列表的资源
			autoQuery: false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_assetSubTable','dic_capitalStage'],//查找数据字典所需参数
			transDict : ['absStatus_absStatusDesc','capitalStage_capitalStageDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.isShow = true;
					if( !data.returnData.rows ){
						data.returnData.rows = [];
					}
				}else{
					$scope.isShow = false;
				}
			}
		};*/
		/*//转让弹出框
		$scope.checkInfo = function(event){
			$scope.params = {};
			$scope.params = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/assetSecurities/assignMent.html',
				$scope.params, {
				title : T.T('KHJ6000002'),
				buttons : [T.T('F00107'), T.T('F00012')],
				size : [ '900px', '350px' ],
				callbacks : [$scope.assignmentBtn]
			});
		};
		//转让接口
		$scope.ishide=true;
		$scope.assignmentBtn = function (result){
			$scope.capitalinfo = {};
			$scope.capitalinfo = result.scope.items;
			$scope.capitalinfo.idType = $scope.assignmentForm.idType;
			$scope.capitalinfo.idNumber = $scope.assignmentForm.idNumber;
			$scope.capitalinfo.externalIdentificationNo = $scope.assignmentForm.externalIdentificationNo;
			if($scope.capitalinfo.capitalOrganizationCode==null || $scope.capitalinfo.capitalOrganizationName==null){
				jfLayer.success(T.T("KHJ6000003"));
				return;
			}
			jfRest.request('assetSecurities', 'alreadyAssignmentList', $scope.capitalinfo)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T("KHJ6000004"));
					 $scope.safeApply();
					 result.cancel();
					 $scope.assignmentList.params.idType= $scope.assignmentForm.idType;
					 $scope.assignmentList.params.idNumber= $scope.assignmentForm.idNumber;
					 $scope.assignmentList.params.externalIdentificationNo=$scope.assignmentForm.externalIdentificationNo;
					 $scope.assignmentList.search();
					 $scope.ishide=false;
				}
			});
		}*/
	});
	//转让
/*	webApp.controller('assignMentCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translate.refresh();
		$scope.items={};
		$scope.items = $scope.params;
	});*/
	//账户列表
	webApp.controller('secAccountListCtrl', function($scope, $stateParams, jfRest,
			$http, $timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translate.refresh();
		$scope.operationMode = lodinDataService.getObject("operationMode");//运营模式
		$scope.revoleTable = false;  //循环账户
		$scope.transTable = false;  // 交易账户
		$scope.externalIdentificationNo = $scope.pageParams.externalIdentificationNo;
		//查询账户信息
//		$scope.queryParams = {};
//		$scope.queryParams = {
//			externalIdentificationNo : params.externalIdentificationNo,	
//			idType : params.idType,
//			idNumber : params.idNumber,
//			accountType : $scope.accountTypePage,
//			planId : params.planId,
//			type : params.type
//		};
//		jfRest.request('assetSecurities', 'querySelect', $scope.queryParams).then(function(data) {
//			if (data.returnCode == '000000') {
//				
//			}else{
//			}
//		});
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
		//查询循环主子账户11111111111111111111
		 $scope.pageCountR = 0;
		 $scope.pageNumR = 1;
		 $scope.pageSizeR = 10;
		// $scope.revoleQuery = function(){
			//循环账户监听单选
		        
				layui.use(['treeTable'], function () {
					$scope.revoleAccList = [];
					var $ = layui.jquery;
			        var treeTable = layui.treeTable;
			     // 循环账户
			        var insTb = treeTable.render({
			            elem: '#revoleAccTreeTableSec',
			            tree: {
			            	iconIndex: 1,
			            },
			            checkFlag:false,//子账户不需要复选框
			            height: 'auto',
			            even:true,//是否开启隔行变色
			            cols: [
			                {type: 'checkbox'},//radio
			                {align: 'left',field: 'accountId', title: T.T('KHH4700004'),width:230},
			                {field: 'currencyDesc', align: 'center',title: T.T('KHH4700014'), width:50},
			                {field: 'businessProgramNo', title:  T.T('KHJ4700007'), width:210,templet: function(d){
			                    if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.businessProgramNo + d.programDesc +'</span>';
			                    }else {
			                    	return '<span></span>';
                                }
                                }},
			                {field: 'businessTypeCode', title: T.T('KHH4700047'), width:180,templet: function(d){
			                    if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.businessTypeCode + d.businessDesc +'</span>';
			                    }else {
			                    	return '<span></span>';
                                }
                                }},
			                {field: 'productObjectCode', title: T.T('KHH4700048'), width:180,templet: function(d){
			                    if(d.businessTypeCode ||d.businessDesc){
			                    	return '<span>'+ d.productObjectCode + d.productDesc +'</span>';
			                    }else {
			                    	return '<span></span>';
                                }
                                }},
			                {field: 'accountOrganFormDesc', align: 'center', title: T.T('KHH4700050'), width:100},
			                {field: 'businessDebitCreditCodeDesc', align: 'center', title: T.T('KHH4700051'), width:100},
			                {field: 'accountingStatusCode', align: 'center', title: T.T('KHH6000029'),width:60},
			                {field: 'fundNum', align: 'center', title: T.T('KHH6000030'), width:100},
			                {field: 'planId', align: 'center', title: T.T('KHH6000023'), width:100},
			            ],
			            reqData: function (data1, callback) {
			            	setTimeout(function () {  // 故意延迟一下
			            	if(data1){//子账户
			            		$scope.params = {
			    					accFlag : "mainAcc",
			    					flag: "N",
			    					externalIdentificationNo : $scope.pageParams.externalIdentificationNo,	
		            				idType : $scope.pageParams.idType,
		            				idNumber : $scope.pageParams.idNumber,
		            				accountType : $scope.pageParams.accountType,
		            				planId : $scope.pageParams.planId,
		            				type : $scope.pageParams.type,
			    					accountOrganForm :  data1.accountOrganForm,
			    					globalTransSerialNo : data1.globalTransSerialNo,
			    					productObjectCode: data1.productObjectCode,
			    					businessProgramNo:  data1.businessProgramNo,
			    					businessTypeCode:  data1.businessTypeCode,
			    					customerNo : data1.customerNo,
			    					currencyCode : data1.currencyCode,
		                		};
			            		jfRest.request('assetSecurities', 'querySelect', $scope.params).then(function(data) {
		                			if (data.returnCode == '000000') {
		                				$scope.operationListRChild = [];
		        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
		        							angular.forEach(data.returnData.rows,function(item,i){
		            							item.haveChild = false;
		            							item.planId = $scope.pageParams.planId;
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
                                            });
		        							callback(data.returnData.rows);
		        							$scope.childRevoleList = {};
		        							$scope.childRevoleList = data.returnData.rows;
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
		            				externalIdentificationNo : $scope.pageParams.externalIdentificationNo,	
		            				idType : $scope.pageParams.idType,
		            				idNumber : $scope.pageParams.idNumber,
		            				accountType : $scope.pageParams.accountType,
		            				planId : $scope.pageParams.planId,
		            				type : $scope.pageParams.type,
		            				pageFlag: "mainPage",
		            				accountOrganForm : 'R',
		            				flag:'N',
		            				pageNum: $scope.pageNumR,
		            		        pageSize: $scope.pageSizeR
		                		};
			            		jfRest.request('assetSecurities', 'querySelect', $scope.params).then(function(data) {
		                			if (data.returnCode == '000000') {
		        						var rows = data.returnData.rows;
		        						$scope.operationListR = [];
		        						if(data.returnData && data.returnData.rows && rows.length >0){
		        							$scope.pageCountR = data.returnData.totalCount;
		        							angular.forEach(rows,function(item,i){
		            							item.haveChild = true;
		            							item.planId = $scope.pageParams.planId;
		            							if(item.operation == "true"){
		            								$scope.operationListR.push(item.id);
		            							}
//		            							账户组织形式
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
			       treeTable.on('checkbox(revoleAccTreeTableSec)', function(obj){
					   //R-循环账户 T-交易账户 B-不良资产'
			    	   if($scope.pageParams.accountType == 'B'){
						   if(obj.type == 'all'){
							   if(obj.checked){
								   $scope.revoleAccList = [];
								   $scope.revoleAccList = $scope.childRevoleList;
								   $scope.transAccList = [];
							   }else{
								   $scope.transAccList = [];
								   $scope.revoleAccList = [];
							   }
						   }else{
							   if(obj.checked){
								   $scope.revoleAccList.push(obj.data);
								   //$scope.transAccList = [];
							   }else{
								   for(var i=0;i<$scope.revoleAccList.length;i++){
									   if($scope.revoleAccList[i].accountId == obj.data.accountId){
										   $scope.revoleAccList.splice(i,1);
									   }
								   }
								   //$scope.transAccList = [];
							   }
						   }
					   }else if($scope.pageParams.accountType == 'R'){
						   if(obj.type == 'all'){
							   if(obj.checked){
								   $scope.revoleAccList = [];
								   $scope.revoleAccList = $scope.childRevoleList;
								   $scope.transAccList = [];
							   }else{
								   $scope.transAccList = [];
								   $scope.revoleAccList = [];
							   }
						   }else{
							   if(obj.checked){
								   $scope.revoleAccList.push(obj.data);
								   $scope.transAccList = [];
							   }else{
								   for(var i=0;i<$scope.revoleAccList.length;i++){
									   if($scope.revoleAccList[i].accountId == obj.data.accountId){
										   $scope.revoleAccList.splice(i,1);
									   }
								   }
								   $scope.transAccList = [];
							   }
						   }
					   }else if($scope.pageParams.accountType == 'T'){
						   $scope.revoleAccList = [];
					   }

			       });
				});
				
		 //}
		 // 交易账户
//	        $scope.queryParam05 = {
//	 			type: "DROPDOWNBOX",
//	 			groupsCode : "dic_loanType",
//	 			queryFlag : "children"
//	 		};
//	 		jfRest.request('paramsManage', 'query',$scope.queryParam05).then(
//	 		function(data) {
//	 			$scope.loanTypeList = data.returnData.rows;
//	 		});
		 $scope.pageCountT = 0;
		 $scope.pageNumT = 1;
		 $scope.pageSizeT = 10;
		// $scope.transQuery = function(){
			
				layui.use(['treeTable'], function () {
					 $scope.transAccList = [];
					var $ = layui.jquery;
			        var treeTable = layui.treeTable;
			       
			        var insTb2 = treeTable.render({
			            elem: '#transAccTreeTableSec',
			            tree: {
			            	iconIndex: 1,
			            	onlyIconControl: true // 仅允许点击图标折叠
			            },
			            height: 'auto',
			            even:true,//是否开启隔行变色
			            cols: [
//			                {type: 'numbers'},
			                {type: 'checkbox'},//radio  
			                {field: 'businessTypeCode', title: T.T('KHH4700047'), width:150},
			                {align: 'center',field: 'accountId', title: T.T('KHH4600004'),width: 200},
			                {align: 'center',field: 'loanAmount', title: T.T('KHH4600005')},
			                {align: 'center',field: 'remainPrincipalAmount', title: T.T('KHH47000116')},
			                {align: 'center',field: 'currentTotalBalance', title: T.T('KHH6000007')},
			                {align: 'center',field: 'currencyCode', title: T.T('KHH4600006')},
			                {align: 'center',field: 'loanTerm', title: T.T('KHH4600007')},
			                {align: 'center',field: 'startIntDate', title: T.T('KHH4600008')},
			                {align: 'center',field: 'accountingStatusCode', title: T.T('KHH6000029')},
			                {align: 'center',field: 'fundNum', title: T.T('KHH6000030')},
			                {align: 'center',field: 'planId', title: T.T('KHH6000023')},
			            ],
			            reqData: function (data1, callback) {
			            	setTimeout(function () {  // 故意延迟一下
			            	if(data1){//子账户
			            		$scope.params = {
			    					accFlag : "mainAcc",
			    					flag: "N",
			    					externalIdentificationNo : $scope.pageParams.externalIdentificationNo,	
		            				idType : $scope.pageParams.idType,
		            				idNumber : $scope.pageParams.idNumber,
		            				accountType : $scope.pageParams.accountType,
		            				planId : $scope.pageParams.planId,
		            				type : $scope.pageParams.type,
			    					accountOrganForm :  data1.accountOrganForm,
			    					globalTransSerialNo : data1.globalTransSerialNo,
			    					productObjectCode: data1.productObjectCode,
			    					businessProgramCode:  data1.businessProgramCode,
			    					businessTypeCode:  data1.businessTypeCode,
			    					customerNo : data1.customerNo,
			    					currencyCode : data1.currencyCode,
		                		};
			            		jfRest.request('assetSecurities', 'queryChildTrand', $scope.params).then(function(data) {
		                			if (data.returnCode == '000000') {
		                				$scope.operationListChild = [];
		        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
		        							angular.forEach(data.returnData.rows,function(item,i){
		            							item.haveChild = false;
		            							item.planId = $scope.pageParams.planId;
		            							if(item.operation == "true"){
		            								$scope.operationListChild.push(item.id);
		            							}
//		            							//信贷类型
//		            							for(var m = 0; m < $scope.loanTypeList.length; m++){
//		            								if(item.loanType == $scope.loanTypeList[m].codes){
//		            									item.loanTypeDesc = $scope.loanTypeList[m].detailDesc;
//			            							};
//		            							};
		            							//	贷款状态
		            							for(var k = 0; k < $scope.loanStatusList.length; k++){
		            								if(item.status == $scope.loanStatusList[k].codes){
		            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
                                                    }
                                                }
                                            });
		        							callback(data.returnData.rows);
		        							$scope.childList = {};
		        							$scope.childList = data.returnData.rows;
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
			            				externalIdentificationNo : $scope.pageParams.externalIdentificationNo,	
			            				idType : $scope.pageParams.idType,
			            				idNumber : $scope.pageParams.idNumber,
			            				accountType : $scope.pageParams.accountType,
			            				planId : $scope.pageParams.planId,
			            				type : $scope.pageParams.type,
			            				accountOrganForm : 'R',
			            				flag:'N',
			            				pageNum: $scope.pageNumT,
			            		        pageSize: $scope.pageSizeT
		                		};
			            		jfRest.request('assetSecurities', 'querySelectTrand', $scope.params).then(function(data) {
		                			if (data.returnCode == '000000') {
		        						var rows = data.returnData.rows;
		        						$scope.operationList = [];
		        						if(data.returnData && data.returnData.rows && rows.length >0){
		        							$scope.pageCountT = data.returnData.totalCount;
		        							angular.forEach(rows,function(item,i){
		            							item.haveChild = true;
		            							item.planId = $scope.pageParams.planId;
		            							if(item.operation == "true"){
		            								$scope.operationList.push(item.id);
		            							}
		            							//信贷类型
//		            							for(var m = 0; m < $scope.loanTypeList.length; m++){
//		            								if(item.loanType == $scope.loanTypeList[m].codes){
//		            									item.loanTypeDesc = $scope.loanTypeList[m].detailDesc;
//			            							};
//		            							};
//		            							//	贷款状态
		            							for(var k = 0; k < $scope.loanStatusList.length; k++){
		            								if(item.status == $scope.loanStatusList[k].codes){
		            									item.statusDesc = $scope.loanStatusList[k].detailDesc;
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
			      //交易账户监听单选
		 	       treeTable.on('checkbox(transAccTreeTableSec)', function(obj){
					   //R-循环账户 T-交易账户 B-不良资产'
					   if($scope.pageParams.accountType == 'B'){
						   if(obj.type == 'all'){
							   if(obj.checked){
								   $scope.transAccList = [];
								   $scope.transAccList = $scope.childList;
								   $scope.revoleAccList = [];
							   }else{
								   $scope.transAccList = [];
								   $scope.revoleAccList = [];
							   }
						   }else{
							   if(obj.checked){
								   $scope.transAccList.push(obj.data);
								   //$scope.revoleAccList = [];
							   }else{
								   for(var i=0;i<$scope.transAccList.length;i++){
									   if($scope.transAccList[i].accountId == obj.data.accountId){
										   $scope.transAccList.splice(i,1);
									   }
								   }
								   //$scope.revoleAccList = [];
							   }
						   }
					   }else if($scope.pageParams.accountType == 'R'){
						   $scope.transAccList = [];
					   }else if($scope.pageParams.accountType == 'T'){
						   if(obj.type == 'all'){
							   if(obj.checked){
								   $scope.transAccList = [];
								   $scope.transAccList = $scope.childList;
								   $scope.revoleAccList = [];
							   }else{
								   $scope.transAccList = [];
								   $scope.revoleAccList = [];
							   }
						   }else{
							   if(obj.checked){
								   $scope.transAccList.push(obj.data);
								   $scope.revoleAccList = [];
							   }else{
								   for(var i=0;i<$scope.transAccList.length;i++){
									   if($scope.transAccList[i].accountId == obj.data.accountId){
										   $scope.transAccList.splice(i,1);
									   }
								   }
								   $scope.revoleAccList = [];
							   }
						   }
					   }

		 	       });
				});
		// };
		//R-循环账户 T-交易账户 B-不良资产'
		if($scope.pageParams.accountType == 'B'){
			$scope.revoleTable = true;  //循环账户
			$scope.transTable = true;  // 交易账户
			//$scope.transQuery();
			// $scope.revoleQuery();
		}else if($scope.pageParams.accountType == 'R'){
			$scope.revoleTable = true;  //循环账户
			$scope.transTable = false;  // 交易账户
			// $scope.revoleQuery();
		}else if($scope.pageParams.accountType == 'T'){
			$scope.revoleTable = false;  //循环账户
			$scope.transTable = true;  // 交易账户
			//$scope.transQuery();
		}
/*		//转出操作
		$scope.rollOutOperateInfo = function(event){
			$scope.rollOutOperate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/unifiedVisualManage/rollOutOperate.html', $scope.rollOutOperate, {
				title : T.T('KHJ4700049'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '1100px', '550px' ],
				callbacks : [$scope.saveRollOutOperate]
			});
		};
		$scope.rollOutOperate2 = {};
		//转出
		$scope.saveRollOutOperate = function(result) {
			$scope.rollOutOperate2.corporation = $scope.params.corporation;	//法人实体
			$scope.rollOutOperate2.ecommPostingAcctNmbr = $scope.rollOutOperate.accountId;	// 账户代码
			$scope.rollOutOperate2.ecommCurrencyCode = $scope.rollOutOperate.currencyCode;	//账户币种
			$scope.rollOutOperate2.ecommTransDate = $scope.rollOutOperate.transDate;	//交易日期
			$scope.rollOutOperate2.ecommTransAmount = $scope.rollOutOperate.transAmount;	// 交易金额
			$scope.rollOutOperate2.ecommTransCurr = $scope.rollOutOperate.currencyCode;	//交易币种
			$scope.rollOutOperate2.ecommClearCurr = $scope.rollOutOperate.currencyCode;	//清算币种
			$scope.rollOutOperate2.ecommClearAmount = $scope.rollOutOperate.transAmount;	//清算金额
			$scope.rollOutOperate2.ecommTransPostingCurr = $scope.rollOutOperate.currencyCode;	//入账币种
			$scope.rollOutOperate2.ecommTransPostingAmount = $scope.rollOutOperate.transAmount;	//入账金额
			$scope.rollOutOperate2.ecommEntryId = $scope.queryAccountForm.externalIdentificationNo;//外部识别号
			$scope.rollOutOperate2.ecommEventId = "ISS.RT.80.0001";
			if($scope.rollOutOperate.transAmount>$scope.overdueAccList.data[0].currBalance){
				jfLayer.fail(T.T('KHJ4700050'));
				return;
			}
			jfRest.request('overPayDrawal', 'realTimeTransMoney', $scope.rollOutOperate2).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('KHJ4700051'));
					$scope.rollOutOperate2 = {};
					 $timeout(function(){
						 $scope.safeApply();
						 result.cancel();
						 $scope.overdueAccList.search();
						 },1500);
				}
			});
		};*/
	});
});
