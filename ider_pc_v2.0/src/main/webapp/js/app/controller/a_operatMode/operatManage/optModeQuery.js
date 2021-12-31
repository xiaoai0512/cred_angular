'use strict';
define(function(require) {
	var webApp = require('app');
	// 运营模式查询
	webApp.controller('optModeQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		//法人实体编号
		 $scope.corporationEntityNoArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };
		//根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
  			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnData != null || data.returnData != ""){
  					for(var i=0;i<data.returnData.length;i++){
  	   					$scope.eventList += data.returnData[i].eventNo + ",";
  	   				}
		   	   		if($scope.eventList.search('COS.IQ.02.0006') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0006') != -1){    //查询
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0006') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		$scope.optModeInf = {};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//运营模式列表
		$scope.optModeList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页     
			resource : 'operationMode.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_dateFormat','dic_isYorN','dic_dateProcessingMethod'],//查找数据字典所需参数
			transDict : ['dateType_dateTypeDesc','defaultFlag_defaultFlagDesc','batchDateProcessType_batchDateProcessTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checkOptModeInf = function(event) {
			$scope.optModeInf1 = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/viewOptMode.html',
				$scope.optModeInf1, {
					title : T.T('YYJ900005'),
					buttons : [ T.T('F00012') ],
					size : [ '1050px', '600px' ],
					callbacks : []
			});
		};
		// 修改
		$scope.updateOptModeInf = function(event) {
			$scope.optModeInf2 = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/updateOptMode.html',
					$scope.optModeInf2, {
						title : T.T('YYJ900004'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1050px', '600px' ],
						callbacks : [ $scope.updateOptMode ]
					});
		};
		// 回调函数/确认按钮事件
		$scope.updateOptMode = function(result) {
			var key;
			for (key in  $scope.optModeInf2){
				if($scope.optModeInf2[key] == "null" ||$scope.optModeInf2[key] == null ){
					$scope.optModeInf2[key] = '';
                }
            }
            $scope.optModeInf2.currencyList = $rootScope.S1ListResult;
			$scope.optModeInf2.corporationEntityNo = $scope.optModeInf2.updateCorporationEntityNo;
			$scope.optModeInf2.overpayBusinessType = $scope.optModeInf2.overpayBusinessTypeUpdate;
			$scope.optModeInf2.accountCurrency = result.scope.updateAccountCurrency;
			$scope.optModeInf2.batchDateProcessType = result.scope.batchDateProcessType;
			$scope.optModeInf2.defaultFlag = result.scope.defaultFlag;
			$scope.optModeInf2.dateType = result.scope.dateType;
			jfRest.request('operationMode', 'update', $scope.optModeInf2) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.optModeList.search();
				}
			});
		};
		// 新增
		$scope.optModeAdd = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/optModeEst.html','', {
				title : T.T('YYJ900006'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : [$scope.saveOptModeAdd]
			});
		};
		$scope.saveOptModeAdd = function(result){
			if(!result.scope.isInfo){
				jfLayer.fail(T.T('F00086'));
				 return;
			}
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S2ListResult = [];
			 $("#s20 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s5){
				 for(var w=0;w<$rootScope.s5.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s5[w].currencyCode == $scope.arr2[t]){
							$scope.S2List = $rootScope.s5[w];
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			 if($scope.S2ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ900007"));
				 return;
			 }
			 for(var j=0;j<$scope.S2ListResult.length;j++){
				 for(var k=0;k<$rootScope.crryPaymentPriorityList.length;k++){
					 if($scope.S2ListResult[j].currencyCode == $rootScope.crryPaymentPriorityList[k].currencyCode){
						 $scope.S2ListResult[j].paymentPriority = $rootScope.crryPaymentPriorityList[k].paymentPriority;
						 $scope.S2ListResult[j].creditProportion = $rootScope.crryPaymentPriorityList[k].creditProportion;
					 }
				 }
			 }
			$scope.optModeInf = {};
			$scope.optModeInf = result.scope.optModeInf;
			$scope.optModeInf.currencyList = $scope.S2ListResult;
			jfRest.request('operationMode', 'save', $scope.optModeInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.optModeInfForm.$setPristine();
					$scope.optModeList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//查看
	webApp.controller('viewOptModeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.viewOperationDate = $scope.optModeInf1.operationDate;
		$scope.viewLastProcessDate = $scope.optModeInf1.lastProcessDate;
		//日期格式
		$scope.dataTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateFormat",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dateType = $scope.optModeInf1.dateType;
			}
		};
		//法人缺省运营模式标识
		$scope.defaultFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.defaultFlag = $scope.optModeInf1.defaultFlag;
			}
		};
		//批量日期处理方式
		$scope.batchDateProcessTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateProcessingMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.batchDateProcessType = $scope.optModeInf1.batchDateProcessType;
			}
		};
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewOperationMode = $scope.optModeInf1.operationMode;
		        }
		    };
		//法人实体编号
		 $scope.corporationEntityNoArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
			        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"legalEntity.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.viewCorporationEntityNo = $scope.optModeInf1.corporationEntityNo;
			        }
			    };
		//业务类型
		 $scope.busTypeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"businessType.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.overpayBusinessTypeView = $scope.optModeInf1.overpayBusinessType;
			        }
			    };
		//入账货币列表
			$scope.operationCurrencyTable = {
//				checkType : 'checkbox', // 当为checkbox时为多选
				params : {
						"operationMode":$scope.optModeInf1.operationMode,
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'operatCurrency.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//修改
	webApp.controller('updateOptModeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
		$translate.refresh();
		//货币列表
		/*$scope.currencyTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};*/
		//日期格式
		$scope.dataTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateFormat",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.dateType = $scope.optModeInf2.dateType;
			}
		};
		//法人缺省运营模式标识
		$scope.defaultFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.defaultFlag = $scope.optModeInf2.defaultFlag;
			}
		};
		//批量日期处理方式
		$scope.batchDateProcessTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateProcessingMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.batchDateProcessType = $scope.optModeInf2.batchDateProcessType;
			}
		};
		//法人实体编号
		$scope.corporationEntityNoArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.optModeInf2.updateCorporationEntityNo = $scope.optModeInf2.corporationEntityNo;
	        }
		 };
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.updateOperationMode = $scope.optModeInf2.operationMode;
	        }
		 };
		 //币种
		 $scope.currencyArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"currency.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.updateAccountCurrency = $scope.optModeInf2.accountCurrency;
	        }
	    };
		//业务类型
		 $scope.busTypeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessType.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.optModeInf2.overpayBusinessTypeUpdate = $scope.optModeInf2.overpayBusinessType;
	        }
	    };
		 $("#s15 option").remove();
		 $("#s16 option").remove();
		$scope.setparamss = {
			operationMode : $scope.updateOperationMode,
		};
		jfRest.request('currency', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s1 = {};
			$rootScope.s1 = data.returnData.rows;
			//console.log(a);
			$scope.queryParam = {
				operationMode : $scope.optModeInf2.operationMode,
			};
			jfRest.request('operatCurrency', 'query', $scope.queryParam).then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
					 $rootScope.S1ListResult = [];
					 for(var t=0;t<n.length;t++){
						 $scope.curryPriUpdate={};
						$scope.curryPriUpdate = {currencyCode:n[t].currencyCode,paymentPriority:n[t].paymentPriority,creditProportion:n[t].creditProportion,operationMode:n[t].operationMode};
						$rootScope.S1ListResult.push($scope.curryPriUpdate);
					 }
					for(var i=0;i<n.length;i++){
			    		angular.element("#s16").append("<option value='"+n[i].currencyCode+"'>"+n[i].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].currencyDesc+"</option>"); 
			    	}
					//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i].currencyCode==a[j].currencyCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		angular.element("#s15").append("<option value='"+a[j].currencyCode+"'>"+a[j].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].currencyDesc+"</option>"); 
				    	}
                    }
                 }else{
					   for(var i=0;i<a.length;i++){
					   angular.element("#s15").append("<option value='"+a[i].currencyCode+"'>"+a[i].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].currencyDesc+"</option>"); 
					  }
			      }
			});
		});
		/*----根据 入账币种，和入账币种描述查询----*/
	 	$scope.queryCurrency = function(){
			 $("#s15").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				currencyCode: $scope.optModeInf2.currencyCode,
				currencyDesc: $scope.optModeInf2.currencyDesc
	 		};
			jfRest.request('currency', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 console.log(a);
				 $scope.arr02 = [];
				 $("#s16 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				 console.log(n);
				 if(n !=undefined && a !=null){
					//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].currencyCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s15").append("<option value='"+a[j].currencyCode+"'>"+a[j].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].currencyDesc+"</option>"); 
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s15").append("<option value='"+a[j].currencyCode+"'>"+a[j].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].currencyDesc+"</option>"); 
					   }
			      }
			});
		};
		/*----end卡板面，和描述查询 ----*/
		//功能分配菜单
		$("#s15").dblclick(function(){  
			 var alloptions = $("#s15 option");  
			 var so = $("#s15 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $scope.priorityCurUpdateVal= "";
				 $scope.priorityCurUpdateVal= $("#s15 option:selected").val();
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurUpdateVal,{
					title : T.T('YYH900013'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '800px', '300px' ],
					callbacks : [ $scope.saveUpdatePaymentPriority ]
				});
				 $("#s16").append(so);
//				 $scope.arr1 = [];
//				 $scope.S1List = {};
//				 $rootScope.S1ListResult = [];
//				 $("#s16 option").each(function () {
//					 var vall = $(this).val();
//					 $scope.arr1.push(vall);
//				 });
//				 if($rootScope.s1){
//					 for(var w=0;w<$rootScope.s1.length;w++){
//						 for(var t=0;t<$scope.arr1.length;t++){
//							 if($rootScope.s1[w].currencyCode == $scope.arr1[t]){
//								 $scope.S1List = $rootScope.s1[w];
//								 $scope.S1List.operationMode = $scope.updateOperationMode;
//								 $rootScope.S1ListResult.push($scope.S1List);
//							 }
//						 }
//					 }
//				 }
			 }
		});  
		//存优先级
		$scope.saveUpdatePaymentPriority = function(result) {
			$scope.curryPriUpdate={};
			$scope.curryPriUpdate = {currencyCode:$scope.priorityCurUpdateVal,paymentPriority:result.scope.paymentPriority,creditProportion:result.scope.creditProportion,operationMode:$scope.updateOperationMode};
			$rootScope.S1ListResult.push($scope.curryPriUpdate);
			$scope.safeApply();
			result.cancel();
		};
		$("#s16").click(function(){  
			 var so = $("#s16 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				//币种
				 var priorityCurUpdateVal = $("#s16 option:selected").val();
				 $scope.priorityCurUpdateVal= "";
				 if(priorityCurUpdateVal){
					 $scope.priorityCurUpdateVal = priorityCurUpdateVal;
				 }
			 }
		}); 
		$("#s16").dblclick(function(){  
			 var alloptions = $("#s16 option");  
			 var so = $("#s16 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $scope.priorityUpdateCurVal= "";
				 $scope.priorityUpdateCurVal= $("#s16 option:selected").val();
				 if($rootScope.S1ListResult){
						if($rootScope.S1ListResult.length > 0){
							for(var i=0;i<$rootScope.S1ListResult.length;i++){
								if($rootScope.S1ListResult[i].currencyCode == $scope.priorityUpdateCurVal){
									$rootScope.S1ListResult.splice(i, 1);
								}
							}
						}
					}
				 $("#s15").append(so);  
//				 $scope.arr1 = [];
//					$scope.S1List = {};
//					$rootScope.S1ListResult = [];
//					 $("#s16 option").each(function () {
//				        var vall = $(this).val();
//				        $scope.arr1.push(vall);
//				    });
//					 if($rootScope.s1){
//						 for(var w=0;w<$rootScope.s1.length;w++){
//							 for(var t=0;t<$scope.arr1.length;t++){
//								if($rootScope.s1[w].currencyCode == $scope.arr1[t]){
//									$scope.S1List = $rootScope.s1[w];
//									$scope.S1List.operationMode = $scope.updateOperationMode;
//									$rootScope.S1ListResult.push($scope.S1List);
//								}
//							 }
//						 }
//					 }
			 }
		});  
		$("#add15").click(function(){  
			 var alloptions = $("#s15 option");  
			 var so = $("#s15 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $scope.priorityCurUpdateVal= "";
				 $scope.priorityCurUpdateVal= $("#s15 option:selected").val();
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurUpdateVal,{
					title : T.T('YYH900013'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '800px', '300px' ],
					callbacks : [ $scope.saveUpdatePaymentPriority ]
				});
				 $("#s16").append(so); 
//				 $scope.arr1 = [];
//				 $scope.S1List = {};
//				 $rootScope.S1ListResult = [];
//				 $("#s16 option").each(function () {
//					 var vall = $(this).val();
//					 $scope.arr1.push(vall);
//				 });
//				 if($rootScope.s1){
//					 for(var w=0;w<$rootScope.s1.length;w++){
//						 for(var t=0;t<$scope.arr1.length;t++){
//							 if($rootScope.s1[w].currencyCode == $scope.arr1[t]){
//								 $scope.S1List = $rootScope.s1[w];
//								 $scope.S1List.operationMode = $scope.updateOperationMode;
//								 $rootScope.S1ListResult.push($scope.S1List);
//							 }
//						 }
//					 }
//				 }
			 }
		});  
		$("#remove15").click(function(){  
			 var alloptions = $("#s16 option");  
			 var so = $("#s16 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $scope.priorityUpdateCurVal= "";
				 $scope.priorityUpdateCurVal= $("#s16 option:selected").val();
				 if($rootScope.S1ListResult){
						if($rootScope.S1ListResult.length > 0){
							for(var i=0;i<$rootScope.S1ListResult.length;i++){
								if($rootScope.S1ListResult[i].currencyCode == $scope.priorityUpdateCurVal){
									$rootScope.S1ListResult.splice(i, 1);
								}
							}
						}
					}
				 $("#s15").append(so);
//				 $scope.arr1 = [];
//				 $scope.S1List = {};
//				 $rootScope.S1ListResult = [];
//				 $("#s16 option").each(function () {
//					 var vall = $(this).val();
//					 $scope.arr1.push(vall);
//				 });
//				 if($rootScope.s1){
//					 for(var w=0;w<$rootScope.s1.length;w++){
//						 for(var t=0;t<$scope.arr1.length;t++){
//							 if($rootScope.s1[w].currencyCode == $scope.arr1[t]){
//								 $scope.S1List = $rootScope.s1[w];
//								 $scope.S1List.operationMode = $scope.updateOperationMode;
//								 $rootScope.S1ListResult.push($scope.S1List);
//							 }
//						 }
//					 }
//				 }
			 }
		});  
		$("#addall15").click(function(){  
			$("#s16").append($("#s15 option").attr("selected",true));  
			$scope.arr1 = [];
			$scope.S1List = {};
			$rootScope.S1ListResult = [];
			 $("#s16 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr1.push(vall);
		    });
			 if($rootScope.s1){
				 for(var w=0;w<$rootScope.s1.length;w++){
					 for(var t=0;t<$scope.arr1.length;t++){
						if($rootScope.s1[w].currencyCode == $scope.arr1[t]){
							$scope.S1List = $rootScope.s1[w];
							$scope.S1List.operationMode = $scope.updateOperationMode;
							$rootScope.S1ListResult.push($scope.S1List);
						}
					 }
				 }
			 }
		});  
		$("#removeall15").click(function(){  
			$("#s15").append($("#s16 option").attr("selected",true));  
			$rootScope.S1ListResult = [];
		});
//		$rootScope.viewCurryPList = [];
//		$scope.optModeInf4 = {};
//		$scope.optModeInf4.operationMode = $scope.optModeInf2.operationMode;
//		jfRest.request('operatCurrency', 'query', $scope.optModeInf4) .then(function(data) {
//			if (data.returnCode == '000000') {
//				if(data.returnData.totalCount > 0){
//					for(var i=0;i<data.returnData.rows.length;i++){
//						$scope.curryPriUpdate={};
//						$scope.curryPriUpdate = {currencyCode:data.returnData.rows[i].currencyCode,paymentPriority:data.returnData.rows[i].paymentPriority,creditProportion:data.returnData.rows[i].creditProportion};
//						$rootScope.viewCurryPList.push($scope.curryPriUpdate);
//					}
//				}
//				console.log($rootScope.viewCurryPList);
//			}else{
//				var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035') ;
//				jfLayer.fail(returnMsg);
//			}
//		});
		//查看优先级
		$("#paymentPriorityCurryUpdate").click(function(){
			if($scope.priorityCurUpdateVal != "" && $scope.priorityCurUpdateVal != undefined && $scope.priorityCurUpdateVal != null){
				$scope.optModeInf3 = {};
				$scope.optModeInf3.operationMode = $scope.optModeInf2.operationMode;
				$scope.optModeInf3.currencyCode = $scope.priorityCurUpdateVal;
				$scope.modal('/a_operatMode/optcenter/updateOptModeCurrency.html',
					$scope.optModeInf3, {
						title : T.T('YYJ900003'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1050px', '400px' ],
						callbacks : [ $scope.updateCurrency ]
					});
			 }else{
				 jfLayer.fail(T.T('YYH900026'));    //'请点击右侧余额对象实例化!');
			 }
		});
		$scope.updateCurrency = function(result){
			 $scope.items=result.scope.optModeInf3;
			 for(var i=0;i<$rootScope.S1ListResult.length;i++){
					if($rootScope.S1ListResult[i].currencyCode == $scope.items.currencyCode){
						$rootScope.S1ListResult[i].paymentPriority = $scope.items.paymentPriority;
						$rootScope.S1ListResult[i].creditProportion = $scope.items.creditProportion;
					}
				}
			 $scope.safeApply();
			 result.cancel();
			
		};
		//关联
			/*$scope.treeSelect =[];
			$scope.saveSelect = function() {
				var isTip = false;						//是否提示
				var tipStr = "";
				if (!$scope.currencyTable.validCheck()) {
					return;
				}
				var items = $scope.currencyTable.checkedList();
				for (var i = 0; i < items.length; i++) {
					var isExist = false;						//是否存在
					for (var k = 0; k < $scope.treeSelect.length; k++) {
						if (items[i].currencyCode  == $scope.treeSelect[k].currencyCode ) {    //判断是否存在
							tipStr = tipStr + items[i].currencyCode + ",";
							isTip = true;
							isExist = true;
							break;
						}
					}
					if(!isExist){
						items[i].operationMode = $scope.optModeInf2.operationMode;
						$scope.treeSelect.push(items[i]);	
					}
				}
				if(isTip){
					jfLayer.alert(T.T('YYJ900001') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ900002'));
				}
			}
			// 删除关联活动
			$scope.removeSelect = function(data) {
				var checkId = data;
				$scope.treeSelect.splice(checkId, 1);
			}*/
			// 修改关联活动
			$scope.updateSelect = function(data,$index) {
				$scope.indexNo = $index;
				$scope.optModeInf3 = $.parseJSON(JSON.stringify(data));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/optcenter/updateOptModeCurrency.html',
						$scope.optModeInf3, {
							title : T.T('YYJ900003'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1050px', '400px' ],
							callbacks : [ $scope.updateOptModeCurrency ]
						});
			};
			$scope.updateOptModeCurrency = function(result){
				 $scope.items=result.scope.optModeInf3;
				 $scope.treeSelect[$scope.indexNo].operationMode = 	 $scope.items.operationMode;
				 $scope.treeSelect[$scope.indexNo].currencyCode = 	 $scope.items.currencyCode;
				 $scope.treeSelect[$scope.indexNo].paymentPriority = 	 $scope.items.paymentPriority;
				 $scope.safeApply();
				 result.cancel();
			}
			//关联入账币种查询
/*			$scope.queryParam = {
					operationMode : $scope.optModeInf2.operationMode,
			};
			jfRest.request('operatCurrency', 'query', $scope.queryParam)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.treeSelect = data.returnData.rows;
					if (data.returnData.rows == null) {
						$scope.treeSelect = [];
					} else {
						$scope.treeSelect = data.returnData.rows;
					}
				}
			});*/
	});
	// 标签对象列表查询
	webApp.controller('optModeEstCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.optModeInf = {};
		$rootScope.crryPaymentPriorityList = [];
		//日期格式
		$scope.dataTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateFormat",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//法人缺省运营模式标识
		$scope.defaultFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//批量日期处理方式
		$scope.batchDateProcessTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_dateProcessingMethod",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        	console.log(data);
			        }
			    };
		//法人实体编号
		 $scope.corporationEntityNoArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
			        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"legalEntity.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//业务类型
		 $scope.busTypeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"businessType.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
			    };
		 //币种
		 $scope.currencyArr ={ 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"currencyCode", //下拉框显示内容，根据需要修改字段名称
	        desc:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"currency.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };
		 //第一步
		 $scope.step1Btn = true;
		 $scope.nextStep1 = function(){
			 $("#s19 option").remove();
			 $("#s20 option").remove();
			$scope.setparamss = {
					operationMode:$scope.optModeInf.operationMode,
			};
			jfRest.request('currency', 'query', $scope.setparamss)
			.then(function(data) {
			if(data.returnData.totalCount == 0){
					jfLayer.fail("运营模式下无可选入账币种！");
					return;
				}
				$scope.isInfo = true;  //关联显示
				 $scope.step1Btn = false;
				 var adom1I = document.getElementsByClassName('step1I');
	  			for(var i=0;i<adom1I.length;i++){
	  				adom1I[i].setAttribute('readonly',true);
	  				adom1I[i].classList.add('bnone');
	  			}
	  			var adom1S = document.getElementsByClassName('step1S');
				for(var i=0;i<adom1S.length;i++){
					adom1S[i].setAttribute('disabled','disabled');
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
				var a =data.returnData.rows;
				$rootScope.s5 = {};
				$rootScope.s5 =data.returnData.rows;
				for(var i=0;i<a.length;i++){
					angular.element("#s19").append("<option value='"+a[i].currencyCode+"'>"+a[i].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].currencyDesc+"</option>"); 
			   }
			});
		 };
		 /*----根据币种码，和币种描述查询----*/
		 	$scope.queryAddCurrencyList = function(){
				 $("#s19").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					currencyCode: $scope.optModeInf.currencyCode,
					currencyDesc: $scope.optModeInf.currencyDesc
		 		};
				jfRest.request('currency', 'query', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s20 option").each(function () {
				        var vall = $(this).val();
				        $scope.arr02.push(vall);
				    });
					var n =$scope.arr02;
					  if(n !=undefined && a !=null){
							//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i]==a[j].currencyCode){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s19").append("<option value='"+a[j].currencyCode+"'>"+a[j].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].currencyDesc+"</option>"); 
					    	}
                        }
                      }else if(a!=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s19").append("<option value='"+a[j].currencyCode+"'>"+a[j].currencyCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].currencyDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end币种码，和币种描述查询 ----*/
		//点击上一步  回到第一步
			$scope.stepBackOne = function(){
				$scope.isInfo = false;  //第二步内容
				$scope.step1Btn = true;    //第一步按钮   
				var adom1I = document.getElementsByClassName('step1I');
	  			for(var i=0;i<adom1I.length;i++){
	  				adom1I[i].removeAttribute('readonly');
	  				adom1I[i].classList.remove('bnone');
	  			}
	      		var adom1S = document.getElementsByClassName('step1S');
	  			for(var i=0;i<adom1S.length;i++){
	  				adom1S[i].removeAttribute('disabled');
	  			}
	  			$timeout(function() {
					Tansun.plugins.render('select');
				});
			};
	        $("#s19").dblclick(function(){  
				 var alloptions = $("#s19 option");  
				 var so = $("#s19 option:selected");  
				 if(so.length != 1){
					 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

				 }else{
					 $scope.priorityCurVal= "";
					 $scope.priorityCurVal= $("#s19 option:selected").val();
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurVal,{
						title : T.T('YYH900013'),   //'余额对象实例化',
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '800px', '300px' ],
						callbacks : [ $scope.savePaymentPriority ]
					});
					 $("#s20").append(so);  
				 }
			});  
			$("#s20").dblclick(function(){  
				 var alloptions = $("#s20 option");  
				 var so = $("#s20 option:selected"); 
				 if(so.length != 1){
					 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

				 }else{
					 $scope.priorityCurVal= "";
					 $scope.priorityCurVal= $("#s20 option:selected").val();
					// 页面弹出框事件(弹出页面)
//					$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurVal,{
//						title : T.T('YYH900013'),   //'余额对象实例化',
//						buttons : [ T.T('F00107'), T.T('F00012') ],
//						size : [ '800px', '300px' ],
//						callbacks : [ $scope.removePaymentPriority ]
//					});
					 if($rootScope.crryPaymentPriorityList){
							if($rootScope.crryPaymentPriorityList.length > 0){
								for(var i=0;i<$rootScope.crryPaymentPriorityList.length;i++){
									if($rootScope.crryPaymentPriorityList[i].currencyCode == $scope.priorityCurVal){
										$rootScope.crryPaymentPriorityList.splice(i, 1);
									}
								}
							}
						}
					 $("#s19").append(so);  
				 }
			});  
			$("#add19").click(function(){  
				 var alloptions = $("#s19 option");  
				 var so = $("#s19 option:selected");  
				 if(so.length != 1){
					 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

				 }else{		
					 $scope.priorityCurVal= "";
					 $scope.priorityCurVal= $("#s19 option:selected").val();
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurVal,{
						title : T.T('YYH900013'),   //'余额对象实例化',
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '800px', '300px' ],
						callbacks : [ $scope.savePaymentPriority ]
					});
					 $("#s20").append(so); 
				 }
			});  
			$("#remove19").click(function(){  
				 var alloptions = $("#s20 option");  
				 var so = $("#s20 option:selected"); 
				 if(so.length != 1){
					 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

				 }else{
					 $scope.priorityCurVal= "";
					 $scope.priorityCurVal= $("#s20 option:selected").val();
					// 页面弹出框事件(弹出页面)
//					$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurVal,{
//						title : T.T('YYH900013'),   //'余额对象实例化',
//						buttons : [ T.T('F00107'), T.T('F00012') ],
//						size : [ '800px', '300px' ],
//						callbacks : [ $scope.removePaymentPriority ]
//					});
					 if($rootScope.crryPaymentPriorityList){
						if($rootScope.crryPaymentPriorityList.length > 0){
							for(var i=0;i<$rootScope.crryPaymentPriorityList.length;i++){
								if($rootScope.crryPaymentPriorityList[i].currencyCode == $scope.priorityCurVal){
									$rootScope.crryPaymentPriorityList.splice(i, 1);
								}
							}
						}
					}
					 $("#s19").append(so);
				 }
			}); 
			$("#s20").click(function(){  
				var so = $("#s20 option:selected");
				 if(so.length != 1){
					 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

				 }else{
					//币种
					 var priorityCurVal = $("#s20 option:selected").val();
					 $scope.priorityCurVal= "";
					 if(priorityCurVal){
						 $scope.priorityCurVal = priorityCurVal;
					 }
				 }
			});
			$("#paymentPriorityCurry").click(function(){  
				 if($scope.priorityCurVal != "" && $scope.priorityCurVal != undefined && $scope.priorityCurVal != null){
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/optcenter/paymentPriority.html',$scope.priorityCurVal,{
						title : T.T('YYH900013'),   //'余额对象实例化',
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '800px', '300px' ],
						callbacks : [ $scope.savePaymentPriority ]
					});
				 }else{
					 jfLayer.fail(T.T('YYH900026'));    //'请点击右侧余额对象实例化!');
				 }
			}); 
			//存优先级
			$scope.savePaymentPriority = function(result) {
				$scope.curryPri={};
				$scope.curryPri = {currencyCode:$scope.priorityCurVal,paymentPriority:result.scope.paymentPriority,creditProportion:result.scope.creditProportion};
				$rootScope.crryPaymentPriorityList.push($scope.curryPri);
				console.log($rootScope.crryPaymentPriorityList);
				$scope.safeApply();
				result.cancel();
			};
			//删优先级
			$scope.removePaymentPriority = function(result) {
				if($rootScope.crryPaymentPriorityList){
					if($rootScope.crryPaymentPriorityList.length > 0){
						for(var i=0;i<$rootScope.crryPaymentPriorityList.length;i++){
							if($rootScope.crryPaymentPriorityList[i].currencyCode == $scope.priorityCurVal){
								$rootScope.crryPaymentPriorityList.splice(i, 1);
							}
						}
					}
				}
				$scope.safeApply();
				result.cancel();
			};
			$("#addall19").click(function(){  
				$("#s20").append($("#s19 option").attr("selected",true));  
			});  
			$("#removeall19").click(function(){  
				$("#s19").append($("#s20 option").attr("selected",true));  
			});  
		//货币列表
/*			$scope.currencyTable = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'currency.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};*/
/*		//关联
		$scope.treeSelect =[];
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.currencyTable.validCheck()) {
				return;
			}
			var items = $scope.currencyTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect.length; k++) {
					if (items[i].currencyCode  == $scope.treeSelect[k].currencyCode ) {    //判断是否存在
						tipStr = tipStr + items[i].currencyCode + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.treeSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('YYJ900001') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ900002'));
			}
		}
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.treeSelect.splice(checkId, 1);
		}*/
		// 修改关联活动
		$scope.updateSelect = function(data,$index) {
			$scope.indexNo = $index;
			$scope.optModeInf3 = $.parseJSON(JSON.stringify(data));
			$scope.optModeInf3.operationMode = $scope.optModeInf.operationMode;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/updateOptModeCurrency.html',
			$scope.optModeInf3, {
				title : T.T('YYJ900003'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '400px' ],
				callbacks : [ $scope.updateOptModeCurrency ]
			});
		};
		$scope.updateOptModeCurrency = function(result){
			 $scope.items=result.scope.optModeInf3;
			 $scope.treeSelect[$scope.indexNo].operationMode = 	 $scope.items.operationMode;
			 $scope.treeSelect[$scope.indexNo].currencyCode = 	 $scope.items.currencyCode;
			 $scope.treeSelect[$scope.indexNo].paymentPriority = 	 $scope.items.paymentPriority;
			 $scope.safeApply();
			 result.cancel();
		}
	});
	webApp.controller('paymentPriorityCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		if($rootScope.crryPaymentPriorityList){
			if($rootScope.crryPaymentPriorityList.length > 0){
				for(var i=0;i<$rootScope.crryPaymentPriorityList.length;i++){
					if($rootScope.crryPaymentPriorityList[i].currencyCode == $scope.priorityCurVal){
						$scope.paymentPriority = $rootScope.crryPaymentPriorityList[i].paymentPriority;
						$scope.creditProportion = $rootScope.crryPaymentPriorityList[i].creditProportion;
					}
				}
			}
		}
	});
	webApp.controller('updateOptModeCurrencyCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//入账货币列表
		$scope.operationCurrencyTable = {
//			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					"operationMode":$scope.optModeInf3.operationMode,
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'operatCurrency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		for(var i=0;i<$rootScope.S1ListResult.length;i++){
			if($rootScope.S1ListResult[i].currencyCode == $scope.optModeInf3.currencyCode){
				$scope.optModeInf3.paymentPriority = $rootScope.S1ListResult[i].paymentPriority;
				$scope.optModeInf3.creditProportion = $rootScope.S1ListResult[i].creditProportion;
			}
		}
	});
});
