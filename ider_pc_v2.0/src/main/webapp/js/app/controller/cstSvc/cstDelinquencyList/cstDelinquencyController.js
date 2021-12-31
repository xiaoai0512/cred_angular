'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('cstDelinquencyListCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstDelinquencyList/i18n_cstDelinquencyList');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	$scope.custInf = {};
    	//动态请求下拉框 证件类型
		 $scope.certificateTypeArray = { 
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
		$scope.isShow = false;
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.custInf.idNumber = '';
			if(data.value == "1"){//身份证
				$("#cstDelin_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstDelin_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstDelin_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#cstDelin_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#cstDelin_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#cstDelin_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#cstDelin_idNumber").attr("validator","noValidator");
				$scope.cstDelinqueryForm.$setPristine();
				$("#cstDelin_idNumber").removeClass("waringform ");
            }
        });
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_delinquencyLevel",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
		function(data) {
			$scope.delinquencyLevelList = [];
			$scope.delinquencyLevelList = data.returnData.rows;
		}); 
		$scope.pageCountDel = 0;
		 $scope.pageNumDel = 1;
		 $scope.pageSizeDel = 10;
		$scope.cstDelinquencyTableList = function(){
			layui.use(['treeTable'], function () {
		        var $ = layui.jquery;
		        var layer = layui.layer;
		        var util = layui.util;
		        var treeTable = layui.treeTable;

		        // 渲染表格
		        var insTb = treeTable.render({
		            elem: '#cstDelinquencyTable',
		            tree: {iconIndex: 1,  // 折叠图标显示在第几列
		            	onlyIconControl: true // 仅允许点击图标折叠
		            	}, 
		            even:true,//是否开启隔行变色
		            cols: [
		                   //	{type: 'radio',title: '选择'},
		                   	{align: 'center',field: 'delinquencyLevelDescp', title: T.T('KHH4100005'),width:'7%'},
		                   	{field: 'levelCode',align: 'center', title: T.T('KHH4100006'), width:'20%'},
		                   	{field: 'productObject',align: 'center', title: T.T('KHH4100007'), width:'15%',singleLine:false,class: 'break-all'},
		                   	{field: 'currency',align: 'center', title: T.T('KHH4100008'), width:'10%',singleLine:false,class: 'break-all'},
		                   	{field: 'cycleNoDesc',align: 'center', title: T.T('KHH4100009'), width:'7%'},
		                   	{field: 'currCyclePaymentMin',align: 'center', title: T.T('KHH4100020'), width:'10%'},
		                   	{field: 'cycleDueDayNum',align: 'center', title: T.T('KHH4100013'), width:'6%'},
		                   	{field: 'cycleDueNum',align: 'center', title: T.T('KHH4100012'), width:'8%'},
		                   	{align: 'center', title: T.T('F00017'), width:'15%',templet: function(d){
		                		return '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="viewInfClick">'+T.T("KHH4100053")+'</a>'+
		                   		'<a class="layui-btn layui-btn-primary layui-btn-xs"  lay-event="viewSummary">'+T.T("F00014")+'</a>'+
		        				'<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="adjustInf">'+T.T("KHH4100052")+'</a>';
			                },}//toolbar , templet: '#cstDelListTableBar'
		            ],
		            reqData: function (data1, callback) {
		            	if(data1){//子账户
		            		$scope.paramsMain = {};
							$scope.paramsMain = {
									idType : $scope.custInf.idType,
									idNumber : $scope.custInf.idNumber,
									externalIdentificationNo:$scope.custInf.externalIdentificationNo,
									accFlag : 'mainAcc',
									globalTransSerialNo:data1.coreAccount.globalTransSerialNo,	
									customerNo: data1.customerNo,         		
									currencyCode: data1.currencyCode,	
									accountOrganForm : data1.coreAccount.accountOrganForm,		
									businessProgramNo : data1.coreAccount.businessProgramNo,		
									productObjectCode : data1.productObjectNo,	
									businessTypeCode : data1.coreAccount.businessTypeCode,
							};
							jfRest.request('cstDelinquencyInfo','queryChild',$scope.paramsMain).then(function(data) {
								if (data.returnCode == '000000' && data.returnData.rows != null) {
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							angular.forEach(data.returnData.rows,function(item,i){
		    								if(item.currencyCode == null){
		    									item.currency = "";
		    								}else if(item.currencyDesc == null){
		    									item.currency = item.currencyCode; 
		    								}else{
		    									item.currency = item.currencyCode + item.currencyDesc; 
		    								}
		    								if(item.productObjectNo == null){
		    									item.productObject = "";
		    								}else if(item.productDesc == null){
		    									item.productObject = item.productObjectNo; 
		    								}else{
		    									item.productObject = item.productObjectNo + item.productDesc; 
		    								}
		    								if(item.cycleNo == '9999'){
		    									item.cycleNoDesc = T.T("KHH4100055");//'汇总'
		    								}else{
		    									item.cycleNoDesc = item.cycleNo; 
		    								}
		        						});
		    							if($scope.delinquencyLevelList.length > 0){
		    								for(var i=0;i<$scope.delinquencyLevelList.length;i++){
		    									for(var j=0;j<data.returnData.rows.length;j++){
		    										if($scope.delinquencyLevelList[i].codes == data.returnData.rows[j].delinquencyLevel){
		    											data.returnData.rows[j].delinquencyLevelDescp = $scope.delinquencyLevelList[i].detailDesc;
		    										}
		    									}
		    								}
		    							}
	        							callback(data.returnData.rows);
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }else {
	                				$scope.rows = [];
	    							callback($scope.rows);
//	                				data.returnData.rows = [];
//	    							callback(data.returnData.rows);
                                }
                            });
		            	}else {//查主账户
							$scope.paramsMain = {};
							$scope.paramsMain = {
									idType : $scope.custInf.idType,
									idNumber : $scope.custInf.idNumber,
									externalIdentificationNo:$scope.custInf.externalIdentificationNo,
									type : '1',
									pageFlag : 'mainPage',
									pageNum: $scope.pageNumDel,
		            		        pageSize: $scope.pageSizeDel
							};
							jfRest.request('cstDelinquencyInfo','queryMain',$scope.paramsMain).then(function(data) {
								if (data.returnCode == '000000' && data.returnData.rows != null) {
									$scope.isShow = true;
	        						if(data.returnData && data.returnData.rows && data.returnData.rows.length >0){
	        							$scope.pageCountDel = data.returnData.totalCount;
	        							angular.forEach(data.returnData.rows,function(item,i){
		    								if(!data1 && item.delinquencyLevel == 'A'){
		    									item.haveChild = true;
		    								}
//		        							item.currency = item.currencyCode + item.currencyDesc;
//		        							item.productObject = item.productObjectNo + item.productDesc; 
		    								if(item.currencyCode == null){
		    									item.currency = "";
		    								}else if(item.currencyDesc == null){
		    									item.currency = item.currencyCode; 
		    								}else{
		    									item.currency = item.currencyCode + item.currencyDesc; 
		    								}
		    								if(item.productObjectNo == null){
		    									item.productObject = "";
		    								}else if(item.productDesc == null){
		    									item.productObject = item.productObjectNo; 
		    								}else{
		    									item.productObject = item.productObjectNo + item.productDesc; 
		    								}
		    								if(item.cycleNo == '9999'){
		    									item.cycleNoDesc = T.T("KHH4100055");//'汇总'
		    								}else{
		    									item.cycleNoDesc = item.cycleNo; 
		    								}
		        						});
		    							if($scope.delinquencyLevelList.length > 0){
		    								for(var i=0;i<$scope.delinquencyLevelList.length;i++){
		    									for(var j=0;j<data.returnData.rows.length;j++){
		    										if($scope.delinquencyLevelList[i].codes == data.returnData.rows[j].delinquencyLevel){
		    											data.returnData.rows[j].delinquencyLevelDescp = $scope.delinquencyLevelList[i].detailDesc;
		    										}
		    									}
		    								}
		    							}
	        							callback(data.returnData.rows);
	        							layui.use(['laypage', 'layer'], function(){
		      			                      var laypage = layui.laypage
		      			                      ,layer = layui.layer;
		      			                      laypage.render({
		      			                            elem: 'cstDelinPage',
		      			                            count: $scope.pageCountDel,
		      			                            limit: $scope.pageSizeDel,
		      			                            curr: $scope.pageNumDel,
		      			                            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
		      			                            jump: function(obj,first){
		      			                             if (!first) {
		      			                              $scope.pageNumDel = obj.curr;
		      			                              $scope.pageSizeDel = obj.limit;
		      			                              $scope.cstDelinquencyTableList();
		      			                             }
		      			                            }
		      			                        });
		      			                    });
	        						}else {
	        							$scope.rows = [];
		    							callback($scope.rows);
                                    }
                                }else {
	                				$scope.isShow = true;
	                			//	data.returnData.rows = [];
	                				$scope.rows = [];
	    							callback($scope.rows);
                                }
                            });
                        }
                    },
		        });
		      //绑定事件
		        treeTable.on('tool(cstDelinquencyTable)', function (obj) {
		        	console.log(obj);
		            var event = obj.event;
		            if (event == 'viewInfClick') {
//		            	console.log(obj.data);
		                $scope.viewInfClick(obj.data);
		            }else if (event == 'viewSummary') {
		            	console.log(obj.data);
		                $scope.viewSummary(obj.data);
		            }else if (event == 'adjustInf') {
		            	console.log(obj.data);
		                $scope.adjustInf(obj.data);
                    }
                });
		    });
		};
		// 重置
		$scope.reset = function() {
			$scope.custInf.idType= '';
			$scope.custInf.idNumber= '';
			$scope.custInf.externalIdentificationNo= '';
			$scope.isShow = false;
			$("#cstDelin_idNumber").attr("validator","noValidator");
			$("#cstDelin_idNumber").removeClass("waringform ");
		};
		$scope.queryList = function(){
			$scope.detailShow = false;
			$scope.isShow = false;
			if(($scope.custInf.idType == "" || $scope.custInf.idType == undefined)  &&
					($scope.custInf.idNumber == "" || $scope.custInf.idNumber == undefined)  &&
					 ($scope.custInf.externalIdentificationNo =="" || $scope.custInf.externalIdentificationNo ==undefined)){
				jfLayer.fail(T.T('F00076'));//"请输入查询条件"
			}
			else {
				if($scope.custInf.idType){
					if($scope.custInf.idNumber == null || $scope.custInf.idNumber == undefined || $scope.custInf.idNumber == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.cstDelinquencyTableList();
					}
				}else if($scope.custInf.idNumber){
					if($scope.custInf.idType == null || $scope.custInf.idType == undefined || $scope.custInf.idType == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.cstDelinquencyTableList();
					}
				}else {
					$scope.cstDelinquencyTableList();
				}
			}
		};
//		$scope.cstDelinquencyList = {
//			params : {
//				type: 1,//汇总
//				pageSize:10,
//				indexNo:0,
//			},
//			autoQuery:false,
//			paging : true,
//			resource : 'cstDelinquencyInfo.query',
//			isTrans: true,//是否需要翻译数据字典
//			transParams : ['dic_delinquencyLevel'],//查找数据字典所需参数
//			transDict : ['delinquencyLevel_delinquencyLevelDesc'],//翻译前后key
//			callback : function(data) {
//				if(data.returnCode == '000000'){
//					$scope.isShow = true;
//				}else {
//					$scope.isShow = false;
//				}
//			}
//		};
		//明细
		$scope.viewInfoList = {
			params : {
				type: 0,//明细
				pageSize:10,
				indexNo:0,
			},
			paging : true,
			resource : 'cstDelinquencyInfo.query',
			autoQuery:false,
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.detailShow = true;
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}else {
					$scope.detailShow = false;
				}
			}
		};
		//查询明细列表
		$scope.viewInfClick = function(item){
			$scope.viewInfo = {};
			$scope.viewInfo = $.parseJSON(JSON.stringify(item));
//			$scope.modal('/cstSvc/cstDelinquencyList/viewDelinquency.html', $scope.viewInfo, {
//				title : T.T('KHJ4100002'),
//				buttons : [T.T('F00108')],//'确认','取消' 
//				size : [ '1100px', '550px' ],
//				callbacks : [ ]
//			});
			$scope.viewInfoList.params.accountingStatusCode = $scope.viewInfo.accountingStatusCode;
			$scope.viewInfoList.params.blockCode = $scope.viewInfo.blockCode;
			$scope.viewInfoList.params.currencyCode = $scope.viewInfo.currencyCode;
			$scope.viewInfoList.params.customerNo = $scope.viewInfo.customerNo;
			$scope.viewInfoList.params.cycleDueDayNum = $scope.viewInfo.cycleDueDayNum;
			$scope.viewInfoList.params.cycleDueNum = $scope.viewInfo.cycleDueNum;
			$scope.viewInfoList.params.cycleNo = $scope.viewInfo.cycleNo;
			$scope.viewInfoList.params.delinquencyLevel = $scope.viewInfo.delinquencyLevel;
			$scope.viewInfoList.params.id = $scope.viewInfo.id;
			$scope.viewInfoList.params.status = $scope.viewInfo.status,
			$scope.viewInfoList.params.idType = $scope.custInf.idType;
			$scope.viewInfoList.params.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
			$scope.viewInfoList.params.idNumber = $scope.custInf.idNumber;
			$scope.viewInfoList.search();
		};
		//查询循环账户列表
		/*$scope.viewInf = function(item){
			$scope.viewItem = {};
			$scope.viewItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/cstDelinquencyList/viewDelinquency.html', $scope.viewItem, {
				title : T.T('KHJ4100002'),
				buttons : [T.T('F00108')],//'确认','取消' 
				size : [ '1100px', '550px' ],
				callbacks : [ ]
			});
		};*/
		
		//查询循环账户列表
		$scope.viewSummary = function(item){
			$scope.viewItem = {};
			$scope.viewItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/cstDelinquencyList/viewSummaryDetails.html', $scope.viewItem, {
				title : T.T('KHJ4100005'),
				buttons : [T.T('F00108')],//'确认','取消' 
				size : [ '1100px', '550px' ],
				callbacks : [ ]
			});
		};
		//调整
		$scope.adjustInf = function(item){
			$scope.adjustItem = {};
			$scope.adjustItem = $.parseJSON(JSON.stringify(item));
			$scope.adjustItem.idType = $scope.custInf.idType;
			$scope.adjustItem.idNumber = $scope.custInf.idNumber;
			$scope.adjustItem.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
			$scope.modal('/cstSvc/cstDelinquencyList/adjustDelinquency.html', $scope.adjustItem, {
				title : T.T('KHJ4100005'),
				buttons : [T.T('F00107'),T.T('F00108')],//'确认','取消' 
				size : [ '900px', '250px' ],
				callbacks : [ $scope.sureAdjust]
			});
		};
		$scope.sureAdjust = function(result){
			//现在后台只能支持总金额的方式调整,不支持0，1
			//判断输入的调整金额不大于最低应缴金额
/*			$scope.adjustList = result.scope.adjustList;
			$scope.adjustItem = result.scope.adjustItem;
			angular.forEach($scope.adjustList, function(it,i){
				if(it.adjustedAmount > it.currCyclePaymentMin){
					jfLayer.alert(T.T('KHJ4100006'));//调整金额不能大于最低应缴金额
					return;
				};
			});
			if(result.scope.adjustItem.adjustType == 0){//按比例
				$scope.adjustParams = {
					adjustType: result.scope.adjustItem.adjustType,
					proportion: result.scope.adjustItem.proportion,
				};
			}else if(result.scope.adjustItem.adjustType == 1){//按金额
				$scope.adjustParams = {
					adjustType: result.scope.adjustItem.adjustType,
					customerDelinquencyLists: result.scope.adjustList
				};
			};*/
			if($scope.adjustItem.adjustedAmoun > $scope.adjustItem.currCyclePaymentMin){
				jfLayer.alert(T.T('KHJ4100006'));//调整金额不能大于最低应缴金额
				$scope.item.adjustedAmount = '';
				return;
            }
            $scope.adjustParams = {};
			$scope.adjustParams.adjustType = result.scope.adjustItem.adjustType;
			$scope.adjustParams.ecommTransAmount = result.scope.adjustItem.adjustedAmoun;
			$scope.adjustParams.ecommCustId = $scope.adjustItem.customerNo;
			$scope.adjustParams.ecommProdObjId = $scope.adjustItem.productObjectNo;
			$scope.adjustParams.ecommLevelCode = $scope.adjustItem.levelCode;
			$scope.adjustParams.ecommCurrentCycle = $scope.adjustItem.cycleNo;
			$scope.adjustParams.ecommOperMode = lodinDataService.getObject("operationMode");
			$scope.adjustParams.institutionId = lodinDataService.getObject("corporation");
			console.log($scope.adjustParams);
			jfRest.request('cstDelinquencyInfo', 'adjust', $scope.adjustParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ4100007'));//调整成功
					$scope.safeApply();
		  			result.cancel();
                }
            });
		};
	});
	//查询  !
	webApp.controller('viewDelinquencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//暂时没用
	});
	//明细查询  !
	webApp.controller('viewSummaryDetailsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		if($scope.viewItem.delinquencyLevel == 'A'){
			$scope.delinquencyLevelInfo = T.T('KHH4100045');
		}else if($scope.viewItem.delinquencyLevel == 'P'){
			$scope.delinquencyLevelInfo = T.T('KHH4100046');
		}else if($scope.viewItem.delinquencyLevel == 'G'){
			$scope.delinquencyLevelInfo = T.T('KHH4100046');
		}
		if($scope.viewItem.status == 'N'){
			$scope.statusInfo = T.T('KHJ4100003');
		}else if($scope.viewItem.status == 'Y'){
			$scope.statusInfo = T.T('KHJ4100004');
		}
	});
	//调整 弹窗
	webApp.controller('adjustDelinquencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstDelinquencyList/i18n_cstDelinquencyList');
		$translate.refresh();
		$scope.adjustItem = $scope.adjustItem;
		$scope.amountSum = false;//按照总金额调整模块
		$scope.ratioDiv = false;//按照百分比调整模块
		$scope.amountDiv = false;//按照金额调整模块
		//调整方式（现在后台只能支持总金额的方式调整：2）
		$scope.adjustTypeArr = { 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_adjustType",
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
		form.on('select(getAdjustType)',function(data){
			if(data.value == 0){//按比例
				$scope.adjustList = [];
				$scope.adjustItem.adjustedAmoun = '';
				$scope.ratioDiv = true;
				$scope.amountDiv = false;
				$scope.amountSum = false;//按照总金额调整模块
			}else if(data.value == 1){//按金额
				$scope.adjustItem.proportion = '';
				$scope.adjustItem.adjustedAmoun = '';
				$scope.ratioDiv = false;
				$scope.amountDiv = true;
				$scope.amountSum = false;//按照总金额调整模块
				$scope.queryAdjustList();
			}else if(data.value == 2){//按总金额
				$scope.adjustList = [];
				$scope.adjustItem.proportion = '';
				$scope.ratioDiv = false;
				$scope.amountDiv = false;
				$scope.amountSum = true;//按照总金额调整模块
            }
        });
		//调整列表 
		$scope.queryAdjustList = function(){
			$scope.params = {
				idType: $scope.adjustItem.idType,
				idNumber: $scope.adjustItem.idNumber,
				externalIdentificationNo: $scope.adjustItem.externalIdentificationNo
			};
			$scope.adjustList = [];
			jfRest.request('cstDelinquencyInfo', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.ratioDiv = false;
					$scope.amountDiv = true;
					if(data.returnData && data.returnData.rows){
						$scope.adjustList = data.returnData.rows;
                    }
                }
            });
		};
		//判断输入的调整金额不大于最低应缴金额
		$scope.checkAdjust = function(index,item){
			$scope.item = item;
			if($scope.item.adjustedAmount > $scope.item.currCyclePaymentMin){
				jfLayer.alert(T.T('KHJ4100006'));//调整金额不能大于最低应缴金额
				$scope.item.adjustedAmount = '';
				return;
            }
        };
	});
});
