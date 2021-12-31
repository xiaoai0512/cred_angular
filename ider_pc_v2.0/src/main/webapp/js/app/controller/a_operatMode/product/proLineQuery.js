'use strict';
define(function(require) {
	var webApp = require('app');
	// 业务项目查询
	webApp.controller('proLineQueryCtrl', function($scope, $stateParams,$timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0018') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0018') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0018') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
  		//查看优先级
  			$scope.choseBtnPriority = function() {
  				$scope.params = {
  					"pageSize" : 10,
  					"indexNo" : 0
  				};
  				// 页面弹出框事件(弹出页面)
  				$scope.modal('/a_operatMode/product/viewProPriority.html', $scope.params, {
  					title :  T.T('YYJ100027'),
  					buttons : [ T.T('F00012') ],
  					size : [ '1000px', '500px' ],
  					callbacks : []
  				});
  			};
//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"productLine.queryMode",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//业务项目列表
		$scope.proLineList = {
			params : {
					pageSize:'10',
					indexNo:'0'
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//新增
		$scope.proLineAdd = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/proLineEst.html', '', {
				title : T.T('YYJ100029'),
				//buttons : [T.T('F00012')],
				buttons : [T.T('F00012')],
				size : [ '1150px', '590px' ],
				callbacks : []
			});
		};
		// 查看
		$scope.checkProLineInf = function(event) {
			$scope.proLineInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/viewProLine.html',$scope.proLineInf, {
				title : T.T('YYJ100008'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateProLineInf = function(event) {
			$scope.InfluenceInf = {};
			$scope.InfluenceInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/a_operatMode/product/porLineMod.html',$scope.InfluenceInf, {
				title : T.T('YYJ100031'),
				buttons : [ T.T('F00125'), T.T('F00012') ],
				size : [ '950px', '500px' ],
				callbacks : [ $scope.porLineInfluence ]
			});
		};
		$scope.porLineInfluence = function(result){
			$scope.proLineInf = {};
			$scope.proLineInf = result.scope.InfluenceInf;
			$scope.proLineInf.deletePcdInstanIdList = [];
			$scope.safeApply();
			result.cancel();
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/updateProLine.html',$scope.proLineInf, {
				title : T.T('YYJ100009'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '600px' ],
				callbacks : [ $scope.updateProLine ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateProLine = function(result) {
			var key;
			for (key in  $scope.proLineInf){
				if($scope.proLineInf[key] == "null" ||$scope.proLineInf[key] == null ){
					$scope.proLineInf[key] = '';
                }
            }
            $scope.proLineInf.list = $rootScope.S37ListResult;
			$scope.proLineInf.balanceObjectCodeList = [];
			$scope.proLineInf.defaultBusinessType  = $scope.proLineInf.defaultBusinessType;
			$scope.proLineInf.disputeBusinessType  = $scope.proLineInf.disputeBusinessTypeUpdate;
			$scope.modgInstanList = result.scope.queryUpdateMODG.data;
			$scope.updateBPList = [];
			if($rootScope.busTypeBPList.length>0){
				for(var i=0;i<$rootScope.busTypeBPList.length;i++){
					$scope.proLineInf.balanceObjectCodeList.push($rootScope.busTypeBPList[i].balanceObjectCode);
					for(var j=0;j<$rootScope.busTypeBPList[i].instanList.length;j++){
						for(var k=0;k<$rootScope.busTypeBPList[i].instanList[j].busTypeInstanList.length;k++){
							$scope.updateBPList.push($rootScope.busTypeBPList[i].instanList[j].busTypeInstanList[k]);
						}
					}
				}
			}
			if($scope.modgInstanList.length>0){
				for(var i=0;i<$scope.modgInstanList.length;i++){
					$scope.updateBPList.push($scope.modgInstanList[i]);
				}
			}
			$scope.proLineInf.instanList = $scope.updateBPList;
			$scope.proLineInf.responseType = result.scope.responseTypeUpdate;
			$scope.proLineInf.programType = result.scope.programTypeUpdate;
			if($scope.proLineInf.defaultBusinessType){
				jfRest.request('productLine', 'update', $scope.proLineInf) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						$scope.safeApply();
						result.cancel();
						$scope.proLineList.search();
					}
				});
			}else{
				jfLayer.fail(T.T("YYJ100034"));
			}
		};
	});
	//查看
	webApp.controller('viewProLineCtrl', function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translate.refresh();
		//业务项目已关联的业务类型
		$scope.busListTableView = {
				params : $scope.queryParam = {
						businessProgramNo : $scope.proLineInf.businessProgramNo,
						operationMode : $scope.proLineInf.operationMode,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'productLineBusType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//业务项目已关联的余额对象
		$scope.balanceObjectTableView = {
				params : {
						businessProgramNo : $scope.proLineInf.businessProgramNo,
						operationMode : $scope.proLineInf.operationMode,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'productLineBusType.queryBalanceP',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//已选择收费项目
		$scope.payProList = {
			params : {
				instanCode : $scope.proLineInf.businessProgramNo,
				operationMode : $scope.proLineInf.operationMode,
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'feeProExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
//		运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeInfo = $scope.proLineInf.operationMode;
	        }
	    };
		 $scope.productTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_productType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.programTypeView = $scope.proLineInf.programType;
			}
		};
		 $scope.responseTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_responseType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.responseTypeView = $scope.proLineInf.responseType;
				//针对系统目前存在的承责属性未赋值的业务项目时，系统使用时，默认此项为个人承责。所以当此项为空或null时查询/修改页面显示为“个人承责”。
				if($scope.proLineInf.responseType == null || $scope.proLineInf.responseType == 'null'){
					$scope.responseTypeView = 'PSN';
                }
            }
		};
		//		业务类型
		 $scope.busTypeArr ={ 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"businessDesc",
	        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessType.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.proLineInf.disputeBusinessTypeView  = $scope.proLineInf.disputeBusinessType;
	        }
	    };
//			业务类型
		 $scope.busTypeArrView ={ 
				 	type:"dynamicDesc", 
			        param:{},//默认查询条件 
			        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
			        desc:"businessDesc",
			        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"businessType.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.proLineInf.defaultBusinessTypeView  = $scope.proLineInf.defaultBusinessType;
			        }
	     };
		$scope.queryViewMODG = {
				params : $scope.queryParam = {
						instanCode:$scope.proLineInf.businessProgramNo,
						operationMode : $scope.proLineInf.operationMode,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				//autoQuery: false,
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						if(data.returnData.rows == undefined ||  data.returnData.rows == null  ||data.returnData.rows == ''){
							data.returnData.rows =[];
						}
					}
				}
			};
			//产品实例化时，点击替换参数的方法
			$scope.updateSelectAView = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.itemsNo = {};
				$scope.itemsNo = $.parseJSON(JSON.stringify(item));
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/product/selectElementNoViewMODG.html', $scope.itemsNo, {
						title : T.T('YYJ100030'),
						buttons : [T.T('F00012')  ],
						size : [ '1100px', '520px' ],
						callbacks : []
					});
			};
		 //余额对象实例化信息
			$scope.balanceUpdateInfo = function(item,$index){
				$scope.valueBTInfo = {};
				$scope.valueBTInfo = $.parseJSON(JSON.stringify(item));
				$scope.valueBTInfo.instanListType = [];
				if($scope.valueBTInfo.instanList){
					if($scope.valueBTInfo.instanList.length > 0){
						for(var i=0;i<$scope.valueBTInfo.instanList.length;i++){
							$scope.valueBTInfo.instanListType.push($scope.valueBTInfo.instanList[i].businessTypeCode);
						}
					}
				}
				$scope.modal('/a_operatMode/product/proBalanceObjectInfo.html',$scope.valueBTInfo,{
					title : T.T('YYJ600014'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1150px', '500px' ],
					callbacks : [  ]
				});
			}
	});
	//修改
	webApp.controller('updateProLineCtrl', function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.responseTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_responseType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.responseTypeUpdate = $scope.proLineInf.responseType;
				//针对系统目前存在的承责属性未赋值的业务项目时，系统使用时，默认此项为个人承责。所以当此项为空或null时查询/修改页面显示为“个人承责”。
				if($scope.proLineInf.responseType == null || $scope.proLineInf.responseType == 'null'){
					$scope.responseTypeUpdate = 'PSN';
                }
            }
		};
		//项目类型
		$scope.productTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_productType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.programTypeUpdate = $scope.proLineInf.programType;
			}
		};
//		运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeInfo = $scope.proLineInf.operationMode;
	        }
	    };
		//		业务类型
		 $scope.busTypeArr ={ 
				type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"businessDesc",
		        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"businessType.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.proLineInf.disputeBusinessTypeUpdate  = $scope.proLineInf.disputeBusinessType;
		        }
		    };
		//***********************业务类型列表***********************
		 $("#s37 option").remove();
		 $("#s38 option").remove();
		$scope.setparamss = {
				operationMode : $scope.proLineInf.operationMode,
		};
		jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s37 = {};
			$rootScope.s37 = data.returnData.rows;
			$scope.queryParam = {
					businessProgramNo : $scope.proLineInf.businessProgramNo,
					operationMode : $scope.proLineInf.operationMode,
			};
			jfRest.request('productLineBusType', 'query', $scope.queryParam)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.S37ListResult = [];
						 $scope.oldType = "";
						 for(var t=0;t<n.length;t++){
							$rootScope.S37ListResult.push(n[t]);
							$scope.oldType += n[t].businessTypeCode + ",";
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s38").append("<option value='"+n[i].businessTypeCode+"'>"+n[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].businessDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].businessTypeCode==a[j].businessTypeCode){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s37").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
					    	}
                        }
                 }else{
				    	  $rootScope.S37ListResult = [];
						  $scope.oldType = "";
						   for(var i=0;i<a.length;i++){
							   angular.element("#s37").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
					  }
				   }
			});
		});
		/*----修改业务类型，和描述查询----*/
	 	$scope.queryModifyList = function(){
			 $("#s37").empty();
			 $scope.setparamss = {
				operationMode : $scope.proLineInf.operationMode,
				businessTypeCode: $scope.businessTypeCodeSel,
				businessDesc: $scope.businessDescSel
	 		};
			jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s38 option").each(function () {
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
					    	if(n[i]==a[j].businessTypeCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s37").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s37").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
					   }
			      }
			});
		};
		/*----end修改业务类型，和描述查询 ----*/
		//功能分配菜单
		$("#s37").dblclick(function(){  
			 var alloptions = $("#s37 option");  
			 var so = $("#s37 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $scope.typeVal = [];
				 $scope.typeVal.push($("#s37 option:selected").val());
				 $("#s38").append(so);
				$scope.arr1 = [];
				$scope.S1List = {};
				$rootScope.S37ListResult = [];
				 $("#s38 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr1.push(vall);
			    });
				 if($rootScope.s37){
					 for(var w=0;w<$rootScope.s37.length;w++){
						 for(var t=0;t<$scope.arr1.length;t++){
							if($rootScope.s37[w].businessTypeCode == $scope.arr1[t]){
								$scope.S1List = $rootScope.s37[w];
								$rootScope.S37ListResult.push($scope.S1List);
							}
						 }
					 }
                 }
                 if($scope.proLineInf.defaultBusinessType){
					$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
				}else{
					$rootScope.vals38= "";
				}
				 $scope.balanceObjectCodeListPage = [];
				 $("#s24 option").each(function () {
			        var valbalance = $(this).val();
			        $scope.balanceObjectCodeListPage.push(valbalance);
			    });
				 $scope.paramBP = {
					operationMode : $scope.proLineInf.operationMode,
					instanFlag : 1,
					balanceObjectCodeList:$scope.balanceObjectCodeListPage,
					businessProgramNo: $scope.proLineInf.businessProgramNo,
					businessTypeCodeList: $scope.typeVal,
		 		};
				jfRest.request('businessType', 'query', $scope.paramBP).then(function(data) {
					$scope.busTypeBPListNew = [];
					$scope.busTypeBPListNew = data.returnData.rows;
					//此处避免修改时先增加余额对象，后增加业务类型，数据重复现象，将原有的数据集$rootScope.busTypeBPList与刚查出来的$scope.busTypeBPListNew做对比
					//如果元件编号elementNo一致，instanCode1和instanCode2相同则不添加，不同则加入
					//若改此处代码，请记得还有一处选择处理方法click
					if($scope.busTypeBPListNew.length > 0){
						if($rootScope.busTypeBPList.length > 0){
							for(var i=0;i<$rootScope.busTypeBPList.length;i++){
								if($rootScope.busTypeBPList[i].instanList.length > 0){
									for(var t=0;t<$rootScope.busTypeBPList[i].instanList.length;t++){
										if($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList.length > 0){
											for(var k=0;k<$rootScope.busTypeBPList[i].instanList[t].busTypeInstanList.length;k++){
												for(var m=0;m<$scope.busTypeBPListNew.length;m++){
													if($scope.busTypeBPListNew[m].busTypeInstanList.length>0){
														for(var n=0;n<$scope.busTypeBPListNew[m].busTypeInstanList.length;n++){
															if($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList[k].elementNo == $scope.busTypeBPListNew[m].busTypeInstanList[n].elementNo){
																if(($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList[k].instanCode1 != $scope.busTypeBPListNew[m].busTypeInstanList[n].instanCode1) 
																		&& ($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList[k].instanCode2 != $scope.busTypeBPListNew[m].busTypeInstanList[n].instanCode2)){
																	$rootScope.busTypeBPList[i].instanList[t].busTypeInstanList.push($scope.busTypeBPListNew[m].busTypeInstanList[n]);
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				});
			 }
		});  
//		$("#s38").dblclick(function(){  
//			 var alloptions = $("#s38 option");  
//			 var so = $("#s38 option:selected"); 
//			 if(so.length != 1){
//				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');
//				 return;
//			 }else{
//				 $("#s37").append(so);  
//				 $scope.arr1 = [];
//					$scope.S1List = {};
//					$rootScope.S37ListResult = [];
//					 $("#s38 option").each(function () {
//				        var vall = $(this).val();
//				        $scope.arr1.push(vall);
//				    });
//					 if($rootScope.s37){
//						 for(var w=0;w<$rootScope.s37.length;w++){
//							 for(var t=0;t<$scope.arr1.length;t++){
//								if($rootScope.s37[w].businessProgramNo == $scope.arr1[t]){
//									$scope.S1List = $rootScope.s37[w];
//									$rootScope.S37ListResult.push($scope.S1List);
//								}
//							 }
//						 }
//					 };
//					 if($scope.proLineInf.defaultBusinessType){
//						$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
//					}else{
//						$rootScope.vals38= "";
//					}
//			 }
//		});  
		$("#add37").click(function(){  
			 var alloptions = $("#s37 option");  
			 var so = $("#s37 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $scope.typeVal = [];
				 $scope.typeVal.push($("#s37 option:selected").val());
				 $("#s38").append(so); 
				 $scope.arr1 = [];
					$scope.S1List = {};
					$rootScope.S37ListResult = [];
					 $("#s38 option").each(function () {
				        var vall = $(this).val();
				        $scope.arr1.push(vall);
				    });
					 if($rootScope.s37){
						 for(var w=0;w<$rootScope.s37.length;w++){
							 for(var t=0;t<$scope.arr1.length;t++){
								if($rootScope.s37[w].businessTypeCode == $scope.arr1[t]){
									$scope.S1List = $rootScope.s37[w];
									$rootScope.S37ListResult.push($scope.S1List);
								}
							 }
						 }
                     }
                 if($scope.proLineInf.defaultBusinessType){
						$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
					}else{
						$rootScope.vals38= "";
					}
					 $scope.balanceObjectCodeListPage = [];
					 $("#s24 option").each(function () {
				        var valbalance = $(this).val();
				        $scope.balanceObjectCodeListPage.push(valbalance);
				    });
					 $scope.paramBP = {
						operationMode : $scope.proLineInf.operationMode,
						instanFlag : 1,
						balanceObjectCodeList:$scope.balanceObjectCodeListPage,
						businessProgramNo: $scope.proLineInf.businessProgramNo,
						businessTypeCodeList: $scope.typeVal,
			 		};
					jfRest.request('businessType', 'query', $scope.paramBP).then(function(data) {
						$scope.busTypeBPListNew = [];
						$scope.busTypeBPListNew = data.returnData.rows;
						//此处避免修改时先增加余额对象，后增加业务类型，数据重复现象，将原有的数据集$rootScope.busTypeBPList与刚查出来的$scope.busTypeBPListNew做对比
						//如果元件编号elementNo一致，instanCode1和instanCode2相同则不添加，不同则加入
						//若改此处代码，请记得还有一处双击处理方法dbclick
						if($scope.busTypeBPListNew.length > 0){
							if($rootScope.busTypeBPList.length > 0){
								for(var i=0;i<$rootScope.busTypeBPList.length;i++){
									if($rootScope.busTypeBPList[i].instanList.length > 0){
										for(var t=0;t<$rootScope.busTypeBPList[i].instanList.length;t++){
											if($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList.length > 0){
												for(var k=0;k<$rootScope.busTypeBPList[i].instanList[t].busTypeInstanList.length;k++){
													for(var m=0;m<$scope.busTypeBPListNew.length;m++){
														if($scope.busTypeBPListNew[m].busTypeInstanList.length>0){
															for(var n=0;n<$scope.busTypeBPListNew[m].busTypeInstanList.length;n++){
																if($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList[k].elementNo == $scope.busTypeBPListNew[m].busTypeInstanList[n].elementNo){
																	if(($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList[k].instanCode1 != $scope.busTypeBPListNew[m].busTypeInstanList[n].instanCode1) 
																			&& ($rootScope.busTypeBPList[i].instanList[t].busTypeInstanList[k].instanCode2 != $scope.busTypeBPListNew[m].busTypeInstanList[n].instanCode2)){
																		$rootScope.busTypeBPList[i].instanList[t].busTypeInstanList.push($scope.busTypeBPListNew[m].busTypeInstanList[n]);
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					});
			 }
		});  
		$("#remove37").click(function(){  
			 var alloptions = $("#s38 option");  
			 var so = $("#s38 option:selected");  
			 $scope.typeCode = $("#s38 option:selected").val();
			 if($scope.oldType.search($scope.typeCode) != -1){    //存在
				 jfLayer.alert(T.T('YYJ100039')); 
			}else{
				$("#s37").append(so);
				 $scope.arr1 = [];
					$scope.S1List = {};
					$rootScope.S37ListResult = [];
					 $("#s38 option").each(function () {
				        var vall = $(this).val();
				        $scope.arr1.push(vall);
				    });
					 if($rootScope.s37){
						 for(var w=0;w<$rootScope.s37.length;w++){
							 for(var t=0;t<$scope.arr1.length;t++){
								if($rootScope.s37[w].businessTypeCode == $scope.arr1[t]){
									$scope.S1List = $rootScope.s37[w];
									$rootScope.S37ListResult.push($scope.S1List);
								}
							 }
						 }
                     }
                 if($scope.proLineInf.defaultBusinessType){
						$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
					}else{
						$rootScope.vals38= "";
					}
					 if($rootScope.busTypeBPList.length > 0){
						 for (var i = 0; i < $rootScope.busTypeBPList.length; i++) {
							 for (var j = 0; j < $rootScope.busTypeBPList[i].instanList.length; j++) {
								 if( $rootScope.busTypeBPList[i].instanList[j].businessTypeCode ==  $scope.typeCode){
										$rootScope.busTypeBPList[i].instanList.splice(j, 1);
									}
							 }
						}
					 }
			}
		});  
//		$("#addall37").click(function(){  
//			$("#s38").append($("#s37 option").attr("selected",true));  
//			$scope.arr1 = [];
//			$scope.S1List = {};
//			$rootScope.S37ListResult = [];
//			 $("#s38 option").each(function () {
//		        var vall = $(this).val();
//		        $scope.arr1.push(vall);
//		    });
//			 if($rootScope.s37){
//				 for(var w=0;w<$rootScope.s37.length;w++){
//					 for(var t=0;t<$scope.arr1.length;t++){
//						if($rootScope.s37[w].businessProgramNo == $scope.arr1[t]){
//							$scope.S1List = $rootScope.s37[w];
//							$rootScope.S37ListResult.push($scope.S1List);
//						}
//					 }
//				 }
//			 };
//			 if($scope.proLineInf.defaultBusinessType){
//				$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
//			}else{
//				$rootScope.vals38= "";
//			}
//		});  
//		$("#removeall37").click(function(){  
//			$("#s37").append($("#s38 option").attr("selected",true));  
//			if($scope.proLineInf.defaultBusinessType){
//				$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
//			}else{
//				$rootScope.vals38= "";
//			}
//			$rootScope.S37ListResult = [];
//		});
		if($scope.proLineInf.defaultBusinessType){
			$rootScope.vals38= $scope.proLineInf.defaultBusinessType;
		}else{
			$rootScope.vals38= "";
		}
		 $rootScope.vals38= $scope.proLineInf.defaultBusinessType;
		$("#s38").click(function(){  
			var so = $("#s38 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 var values8 = $("#s38 option:selected").val();
				 $rootScope.vals38= "";
				 if(values8){
					 $rootScope.vals38 = values8;
				 }
			 }
		});   
		$("#rsetDefaultId37").click(function(){ 
			 if($rootScope.vals38 != "" && $rootScope.vals38 != undefined && $rootScope.vals38 != null){
				 $scope.proLineInf.defaultBusinessType = $rootScope.vals38;
			 }else{
				 jfLayer.fail(T.T('YYJ100020'));
			 }
		});
		//查询产品实例构件
		$scope.queryUpdateMODG = {
				params : $scope.queryParam = {
						instanCode:$scope.proLineInf.businessProgramNo,
						operationMode : $scope.proLineInf.operationMode
				}, // 表格查询时的参数信息
				//autoQuery: false,
				paging : false,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						//$scope.instanProductShow = true;//显示实例化
						if(data.returnData.rows == undefined ||  data.returnData.rows == null  ||data.returnData.rows == ''){
							data.returnData.rows =[];
						}
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
						jfLayer.fail(returnMsg);
					}
				}
			};
		//产品实例化时，点击设置参数值的方法
		$scope.setSelectAUpdate = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateMODG.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00156'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdate]
				}); 
		};
		$scope.choseSelectTwoUpdate = function(result) {
			$scope.items = {};
			$scope.queryUpdateMODG.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryUpdateMODG.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.queryUpdateMODG.data[$scope.indexNo].pcdInitList = result.scope.pcdInfTable;
			$scope.queryUpdateMODG.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryUpdateMODG.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		//产品实例化时，点击替换参数的方法
		$scope.updateSelectAUpdate = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateMODG.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdate]
				});
		};
		$scope.choseSelectAUpdate = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.queryUpdateMODG.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryUpdateMODG.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
        $scope.addBusTypeUpdate = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/businessTypePramsMgtPorLine.html', '', {
				title : T.T('YYJ100012'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '630px' ],
				callbacks : [ $scope.saveBusinessTypeUpdate ]
			});
		};
		$scope.saveBusinessTypeUpdate = function(result){
			if(!$rootScope.sure){
				jfLayer.fail(T.T('F00086'));
				return;
			}
			$scope.busTypeInfoEst = result.scope.busTypeInfo;
			$scope.busTypeInfoEst.instanlist = [];
			$scope.busTypeInfoEst.businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
			$scope.busTypeInfoEst.operationMode = result.scope.operationModeInfo;
//			if(result.scope.queryBalanceObject.data){
//				for(var i=0;i<result.scope.queryBalanceObject.data.length;i++){
//					if(result.scope.queryBalanceObject.data[i].instanlist){
//						for(var k=0;k<result.scope.queryBalanceObject.data[i].instanlist.length;k++){
//							result.scope.queryBalanceObject.data[i].instanlist[k].businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							result.scope.queryBalanceObject.data[i].instanlist[k].instanCode2 = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							$scope.busTypeInfoEst.instanlist.push(result.scope.queryBalanceObject.data[i].instanlist[k]);
//						}
//					}else{
//						for(var h=0;h<result.scope.queryBalanceObject.data[i].balanceInstanList.length;h++){
//							result.scope.queryBalanceObject.data[i].balanceInstanList[h].businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							result.scope.queryBalanceObject.data[i].balanceInstanList[h].instanCode2 = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							$scope.busTypeInfoEst.instanlist.push(result.scope.queryBalanceObject.data[i].balanceInstanList[h]);
//						}
//					}
//				}
//				for (var j = 0; j < $scope.busTypeInfoEst.instanlist.length; j++) {
//					if($scope.busTypeInfoEst.instanlist[j].pcdList==null && $scope.busTypeInfoEst.instanlist[j].pcdInitList!=null){
//						$scope.busTypeInfoEst.instanlist[j].addPcdFlag = "1";
//						$scope.busTypeInfoEst.instanlist[j].pcdList = $scope.busTypeInfoEst.instanlist[j].pcdInitList;
//					}
//				}
//			}
			for (var i = 0; i < result.scope.queryMODT.data.length; i++) {
				if(result.scope.queryMODT.data[i].pcdList==null && result.scope.queryMODT.data[i].pcdInitList!=null){
					result.scope.queryMODT.data[i].addPcdFlag = "1";
					result.scope.queryMODT.data[i].pcdList = result.scope.queryMODT.data[i].pcdInitList;
				}
				$scope.busTypeInfoEst.instanlist.push(result.scope.queryMODT.data[i]);
			}
			jfRest.request('businessType', 'save', $scope.busTypeInfoEst).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.businessTypesForm.$setPristine();
					 $("#s37 option").remove();
					 $scope.setparamss = {
							operationMode : $scope.proLineInf.operationMode
					};
					 jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
						if(data.returnData.totalCount == 0){
							jfLayer.fail(T.T("YYJ100032"));
							return;
						}
						var a =data.returnData.rows;
						$rootScope.s37 = {};
						$rootScope.s37 = data.returnData.rows;
						for(var i=0;i<a.length;i++){
							$("#s37").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
					   }
					});
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		$scope.queryParam02 = {
				type: "DROPDOWNBOX",
				groupsCode : "dic_businessNature",
				queryFlag : "children"
			};
			jfRest.request('paramsManage', 'query',$scope.queryParam02).then(
			function(data) {
				$scope.businessDebitCreditCodeList = [];
				$scope.businessDebitCreditCodeList = data.returnData.rows;
			});
		 $("#s23 option").remove();
		 $("#s24 option").remove();
		$scope.setbpparams = {
				operationMode : $scope.proLineInf.operationMode,
		};
		jfRest.request('balanceObject', 'query', $scope.setbpparams).then(function(data) {
			var a =data.returnData.rows;
			$scope.queryParam = {
					businessProgramNo : $scope.proLineInf.businessProgramNo,
					operationMode : $scope.proLineInf.operationMode,
			};
			jfRest.request('productLineBusType', 'queryBalanceP', $scope.queryParam).then(function(data) {
				 var n =data.returnData.rows;
				 $rootScope.busTypeBPList = [];
				 if(n!=undefined){
					 if($scope.businessDebitCreditCodeList.length > 0){
							for(var i=0;i<$scope.businessDebitCreditCodeList.length;i++){
								for(var j=0;j<n.length;j++){
									for(var k=0;k<n[j].instanList.length;k++){
										if($scope.businessDebitCreditCodeList[i].codes ==n[j].instanList[k].businessDebitCreditCode){
											n[j].instanList[k].businessDebitCreditCodeDesc = $scope.businessDebitCreditCodeList[i].detailDesc;
										}
									}
								}
							}
						}
					 $scope.oldBusiness = "";
						 for(var t=0;t<n.length;t++){
							 $rootScope.busTypeBPList.push(n[t]);
							 $scope.oldBusiness += n[t].balanceObjectCode + ",";
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s24").append("<option value='"+n[i].balanceObjectCode+"'>"+n[i].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].objectDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].balanceObjectCode==a[j].balanceObjectCode){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s23").append("<option value='"+a[j].balanceObjectCode+"'>"+a[j].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].objectDesc+"</option>"); 
					    	}
                        }
                 }else{
				    	  $scope.oldBusiness = "";
						   for(var i=0;i<a.length;i++){
							   angular.element("#s23").append("<option value='"+a[i].balanceObjectCode+"'>"+a[i].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].objectDesc+"</option>"); 
					  }
				   }
			});
		});
		/*----根据余额对象，和描述查询----*/
	 	$scope.queryBalanceObjectSelecList = function(){
			 $("#s23").empty();
			 $scope.setparamBP = {
				operationMode : $scope.proLineInf.operationMode,
				balanceObjectCode: $scope.balanceObjectCodeSel,
				objectDesc: $scope.objectDescSel
	 		};
			jfRest.request('balanceObject', 'query', $scope.setparamBP).then(function(data) {
				 var ab =data.returnData.rows;
				 $scope.arr24 = [];
				 $("#s24 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr24.push(vall);
			    });
				var nb =$scope.arr24;
				 if(nb !=undefined && ab !=null){
						//查找重复数据
				    var isrep;
				    for(var j =0;j<ab.length;j++){
				    	isrep = false;
				    	for(var i=0;i<nb.length;i++){
					    	if(nb[i]==ab[j].balanceObjectCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s23").append("<option value='"+ab[j].balanceObjectCode+"'>"+ab[j].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+ab[j].objectDesc+"</option>"); 
				    	}
                    }
                 }else if(ab!=null){
			    	  for(var i=0;i<ab.length;i++){
							$("#s23").append("<option value='"+ab[j].balanceObjectCode+"'>"+ab[j].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+ab[j].objectDesc+"</option>"); 
					   }
			      }
			});
		};
		//双击余额对象进行实例化
		$("#s23").dblclick(function(){  
			 var alloptions = $("#s23 option");  
			 var so = $("#s23 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				var bOCodeSelected = $("#s23 option:selected").val();
				var objectDescMsg = $("#s23 option:selected").html();
				$("#s24").append(so); 
				$scope.valueBTUpdate = {};
				$scope.valueBTUpdate.businessTypeCodeList = [];
				$scope.valueBTUpdate.balanceObjectCodelist = [];
				console.log($scope.proLineInf);
				$scope.valueBTUpdate.operationMode = $scope.proLineInf.operationMode;
				$scope.valueBTUpdate.balanceObjectCode = bOCodeSelected;
				$scope.valueBTUpdate.balanceObjectCodelist.push(bOCodeSelected);
				$scope.balanceObjectDesc = objectDescMsg.substring(33,objectDescMsg.length);
				$scope.valueBTUpdate.businessProgramNo = $scope.proLineInf.businessProgramNo;
				$scope.valueBTUpdate.objectDesc = $scope.balanceObjectDesc;
				var ssd = $("#s38 option");
				for(var k=0;k<ssd.length;k++){
					$scope.valueBTUpdate.businessTypeCodeList.push(ssd[k].value);
				}
				console.log($scope.valueBTUpdate);
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/proBalanceObjectUpdateAdd.html',$scope.valueBTUpdate,{
					title : T.T('YYJ600014'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [  ]
				});
			 }
		});
		//单击余额对象进行实例化
		$("#add23").click(function(){  
			 var so = $("#s23 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				var bOCodeSelected = $("#s23 option:selected").val();
				var objectDescMsg = $("#s23 option:selected").html();
				$("#s24").append(so); 
				$scope.valueBTUpdate = {};
				$scope.valueBTUpdate.balanceObjectCode = bOCodeSelected;
				$scope.valueBTUpdate.businessTypeCodeList = [];
				$scope.valueBTUpdate.balanceObjectCodelist = [];
				$scope.valueBTUpdate.operationMode = $scope.proLineInf.operationMode;
				$scope.valueBTUpdate.balanceObjectCodelist.push(bOCodeSelected);
				$scope.balanceObjectDesc = objectDescMsg.substring(33,objectDescMsg.length);
				$scope.valueBTUpdate.businessProgramNo = $scope.proLineInf.businessProgramNo;
				$scope.valueBTUpdate.objectDesc = $scope.balanceObjectDesc;
				var ssd = $("#s38 option");
				for(var k=0;k<ssd.length;k++){
					$scope.valueBTUpdate.businessTypeCodeList.push(ssd[k].value);
				}
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/proBalanceObjectUpdateAdd.html',$scope.valueBTUpdate,{
					title : T.T('YYJ600014'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [  ]
				});
			 }
		});
		$("#remove23").click(function(){  
				 var so = $("#s24 option:selected");
				 if(so.length != 1){
					 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

				 }else{
					 var bOCodeRemove = $("#s24 option:selected").val();
					 if($scope.oldBusiness.search(bOCodeRemove) != -1){    //存在
						 jfLayer.alert(T.T('YYJ100040')); 
					}else{
						 $("#s23").append(so);
						 if($rootScope.busTypeBPList.length > 0){
							 for (var i = 0; i < $rootScope.busTypeBPList.length; i++) {
								if($rootScope.busTypeBPList[i].balanceObjectCode == bOCodeRemove){
									$rootScope.busTypeBPList.splice(i, 1);
								}
							}
						 }
					}
				 }
			});
		$("#s24").click(function(){  
			var so = $("#s24 option:selected");
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');

			 }else{
				//余额对象
				 var BPUpdate = $("#s24 option:selected").val();
				 $scope.BPUpdateKey= "";
				 if(BPUpdate){
					 $scope.BPUpdateKey = BPUpdate;
				 }
			 }
		});
		//修改业务项目时 查看余额对象实例化
		$("#BPinstantiationUpdate").click(function(){ 
			 if($scope.BPUpdateKey != "" && $scope.BPUpdateKey != undefined && $scope.BPUpdateKey != null){
				 $scope.valueBTUpdate = {};
				 if($rootScope.busTypeBPList.length > 0){
					 for (var i = 0; i < $rootScope.busTypeBPList.length; i++) {
						if($rootScope.busTypeBPList[i].balanceObjectCode == $scope.BPUpdateKey){
							$scope.valueBTUpdate = $rootScope.busTypeBPList[i];
						}
					}
				 }
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/proBalanceObjectUpdateInfo.html',$scope.valueBTUpdate,{
					title : T.T('YYJ600014'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [  ]
				});
			 }else{
				 jfLayer.fail(T.T('YYJ100035'));   //'请点击右侧余额对象实例化!');
			 }
		});
		//修改业务项目时 新增余额对象（单纯的余额对象，不包含实例化信息）
		$scope.balanceObjectTypeAddUpdate = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/balanceObjectEst.html','',{
				title : T.T('YYJ200032'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.saveBalanceObjectUpdate ]
			});
		};
		// 新增
		$scope.saveBalanceObjectUpdate = function(result) {
			$scope.balanceObjInfEst = {};
			$scope.balanceObjInfEst = result.scope.balanceObjInf;
			$scope.balanceObjInfEst.balanceObjectCode = 'MODB'+result.scope.balanceObjInf.balanceObjectCodeHalf;
			$scope.balanceObjInfEst.beginDate = $("#LAY_start_Obj").val();
		    $scope.balanceObjInfEst.endDate = $("#LAY_end_Obj").val();
			jfRest.request('balanceObject', 'save',$scope.balanceObjInfEst).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.balanceObjForm.$setPristine();
					$("#s23 option").remove();
					$scope.set2paramss = {
							operationMode : $scope.proLineInf.operationMode
					};
					 jfRest.request('balanceObject', 'query', $scope.set2paramss).then(function(data) {
						if(data.returnData.totalCount == 0){
							jfLayer.fail(T.T('YYJ100036'));    //'改运营模式下暂无可选余额对象');
							return;
						}
						var bp =data.returnData.rows;
						for(var i=0;i<bp.length;i++){
							$("#s23").append("<option value='"+bp[i].balanceObjectCode+"'>"+bp[i].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+bp[i].objectDesc+"</option>"); 
					   }
					});
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
    // 业务项目列表建立11111111111111
    webApp.controller('proLineEstCtrl',function($scope, $stateParams,jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
        $translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
        $translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
        $translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
        $translate.refresh();
        $scope.proLineInf = {};
		$scope.responseTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_responseType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.productTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_productType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
        // 运营模式
        $scope.operationModeArr = {
            type: "dynamic",
            param: {},
            // 默认查询条件
            text: "modeName",
            // 下拉框显示内容，根据需要修改字段名称
            value: "operationMode",
            // 下拉框对应文本的值，根据需要修改字段名称
            resource: "productLine.queryMode",
            // 数据源调用的action
            callback: function(data) {
            }
        };
        var form = layui.form;
		form.on('select(getOperationModeAdd)',function(event){
			$scope.operationModsAdd = $scope.proLineInf.operationMode;
		});
        // 业务类型
        $scope.busTypeArr = {
    		type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"businessDesc",
            value: "businessTypeCode",
            // 下拉框对应文本的值，根据需要修改字段名称
            resource: "businessType.query",
            // 数据源调用的action
            callback: function(data) {
            }
        };
		 //第一步
        $scope.selInfo = false;
		 $scope.step1Btn = true;
		 $scope.step2Btn =false;
         $scope.step3Btn =false;
		 $scope.nextStep1 = function(){
			 $("#s35 option").remove();
			 $("#s36 option").remove();
			 $scope.setparamss = {
					operationMode : $scope.proLineInf.operationMode
			};
			 jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
				if(data.returnData.totalCount == 0){
					jfLayer.fail(T.T("YYJ100032"));
					return;
				}
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
				 $scope.selInfo = true;
				 $scope.step1Btn = false;
				 $scope.step2Btn =true;
		         $scope.step3Btn =true;
				var a =data.returnData.rows;
				$rootScope.s2 = {};
				$rootScope.s2 =data.returnData.rows;
				for(var i=0;i<a.length;i++){
					$("#s35").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
			   }
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			});
		 };
		 	/*----根据业务类型，和描述查询----*/
		 	$scope.queryBusinessList = function(){
				 $("#s35").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMode,
					businessTypeCode: $scope.proLineInf.businessTypeCode,
					businessDesc: $scope.proLineInf.businessDesc
		 		};
				jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s36 option").each(function () {
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
						    	if(n[i]==a[j].businessTypeCode){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s35").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
					    	}
                        }
                     }else if(a!=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s35").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----根据余额对象，和描述查询----*/
		 	$scope.queryBPList = function(){
				 $("#s21").empty();
				 $scope.setparamBP = {
					operationMode : $scope.proLineInf.operationMode,
					balanceObjectCode: $scope.bpInf.balanceObjectCode,
					objectDesc: $scope.bpInf.objectDesc
		 		};
				jfRest.request('balanceObject', 'query', $scope.setparamBP).then(function(data) {
					 var ab =data.returnData.rows;
					 $scope.arr04 = [];
					 $("#s22 option").each(function () {
				        var vall = $(this).val();
				        $scope.arr04.push(vall);
				    });
					var nb =$scope.arr04;
					 if(nb !=undefined && ab !=null){
							//查找重复数据
					    var isrep;
					    for(var j =0;j<ab.length;j++){
					    	isrep = false;
					    	for(var i=0;i<nb.length;i++){
						    	if(nb[i]==ab[j].balanceObjectCode){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s21").append("<option value='"+ab[j].balanceObjectCode+"'>"+ab[j].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+ab[j].objectDesc+"</option>"); 
					    	}
                        }
                     }else if(ab!=null){
				    	  for(var i=0;i<ab.length;i++){
								$("#s21").append("<option value='"+ab[j].balanceObjectCode+"'>"+ab[j].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+ab[j].objectDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end业务类型，和描述查询 ----*/
			//点击上一步  回到第一步
			$scope.stepBackOne = function(){
				$scope.selInfo = false;  //第二步内容
				$scope.step1Btn = true;    //第一步按钮 
				$scope.step2Btn =false;
		         $scope.step3Btn =false;
				$scope.proLineInf.defaultBusinessType = "";
				$rootScope.valueType = "";
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
			//下一步
//			$scope.stepTo2 = function(){
//				if(!$scope.proLineInf.defaultBusinessType){
//					jfLayer.fail("请选择默认业务类型");
//					return;
//				}
//				$("#s51 option").remove();
//				$("#s52 option").remove();
//				 $scope.parquery = {
//						 querybusinessTypeArtifact :true
//				};
//				 jfRest.request('artifactExample', 'queryArtifactNo', $scope.parquery).then(function(data) {
//					$scope.selInfoTwo = true;  
//					$scope.step2Btn = false;
//					$scope.step3Btn = false;
//					var b =data.returnData.rows;
//					$rootScope.s10 = {};
//					$rootScope.s10 =data.returnData.rows;
//					for(var i=0;i<b.length;i++){
//						$("#s51").append("<option value='"+b[i].artifactNo+"'>"+b[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+b[i].artifactDesc+"</option>"); 
//				   }
//				});
//			};
			/*----根据构件类型，和构件描述查询----*/
//		 	$scope.queryComponentList = function(){
//				 $("#s51").empty();
//				 $scope.setparamss = {
//					operationMode : $rootScope.operationMods,
//					artifactNo: $scope.proLineInf.artifactNo,
//					artifactDesc: $scope.proLineInf.artifactDesc
//		 		};
//				jfRest.request('artifactExample', 'queryArtifactNo', $scope.setparamss).then(function(data) {
//					 var a =data.returnData.rows;
//					 $scope.arr02 = [];
//					 $("#s52 option").each(function () {
//				        var vall = $(this).val();
//				        $scope.arr02.push(vall);
//				    });
//					var n =$scope.arr02;
//					 if(n !=undefined && a !=null){
//							//查找重复数据
//					    var isrep;
//					    for(var j =0;j<a.length;j++){
//					    	isrep = false;
//					    	for(var i=0;i<n.length;i++){
//						    	if(n[i]==a[j].artifactNo){
//						    		isrep = true;
//						    		break;
//						    	}
//						    }
//					    	if(!isrep){
//					    		$("#s51").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
//					    	}
//					    };
//				      }else if(a!=null){
//				    	  for(var i=0;i<a.length;i++){
//								$("#s51").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
//						   }
//				      }
//				});
//			};
			/*----end构件类型，和构件描述查询 ----*/
//			$scope.stepBackThree = function(){
//				//$scope.selInfoTwo = false;
//				 $scope.step2Btn =true;
//		          $scope.step3Btn =true;
//			}
//	        $("#s51").dblclick(function(){  
//				 var alloptions = $("#s51 option");  
//				 var so = $("#s51 option:selected");  
//				 $("#s52").append(so);  
//			});  
//			$("#s52").dblclick(function(){  
//				 var alloptions = $("#s52 option");  
//				 var so = $("#s52 option:selected");  
//				 $("#s51").append(so);  
//			});  
//			$("#add51").click(function(){  
//				 var alloptions = $("#s51 option");  
//				 var so = $("#s51 option:selected");  
//				 $("#s52").append(so); 
//			});  
//			$("#remove51").click(function(){  
//				 var alloptions = $("#s52 option");  
//				 var so = $("#s52 option:selected");  
//				 $("#s51").append(so);
//			});  
//			$("#addall51").click(function(){  
//				$("#s52").append($("#s51 option").attr("selected",true)); 
//			});  
//			$("#removeall51").click(function(){  
//				$("#s51").append($("#s52 option").attr("selected",true));  
//			});
        var form = layui.form;
        form.on('select(getLevel)',function(event) {
            if (event.value) {
                // 查询运营模式下的业务类型
                // 业务类型
                $scope.busTypeArr = {
                    type: "dynamicDesc",
                    param: {
                        operationMode: event.value
                    },
                    // 默认查询条件
                    text: "businessTypeCode",
                    // 下拉框显示内容，根据需要修改字段名称
                    desc:"businessDesc",
                    value: "businessTypeCode",
                    // 下拉框对应文本的值，根据需要修改字段名称
                    resource: "businessType.query",
                    // 数据源调用的action
                    callback: function(data) {
                    }
                };
            }
        });
        $rootScope.valueType= "";
//        $("#s35").dblclick(function(){  
//			 var alloptions = $("#s35 option");  
//			 var so = $("#s35 option:selected");  
//			 $("#s36").append(so);  
//			 $rootScope.valueInfo = "";
//			 $rootScope.valueType= "";
//		});  
//		$("#s36").dblclick(function(){  
//			 var alloptions = $("#s36 option");  
//			 var so = $("#s36 option:selected");  
//			 $("#s35").append(so);  
//			 $rootScope.valueInfo = "";
//			 $rootScope.valueType= "";
//		});  
		$("#add35").click(function(){  
			 var alloptions = $("#s35 option");  
			 var so = $("#s35 option:selected");  
			 $("#s36").append(so); 
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
		});  
		$("#remove35").click(function(){  
			 var alloptions = $("#s36 option");  
			 var so = $("#s36 option:selected");  
			 $("#s35").append(so);
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
		});  
		$("#addall35").click(function(){  
			$("#s36").append($("#s35 option").attr("selected",true)); 
			 $rootScope.valueInfo = "";
			$rootScope.valueType= "";
		});  
		$("#removeall35").click(function(){  
			$("#s35").append($("#s36 option").attr("selected",true));  
			 $rootScope.valueInfo = "";
			$rootScope.valueType= "";
		});  
		$("#s35").click(function(){  
			 var valueInfo = $("#s35 option:selected").val();
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
			 if(valueInfo){
				 $rootScope.valueInfo = valueInfo;
			 }
		});  
		$("#s36").click(function(){  
			 var valueInfo = $("#s36 option:selected").val();
			 $rootScope.valueType= "";
			 $rootScope.valueInfo = "";
			 if(valueInfo){
				 $rootScope.valueInfo = valueInfo;
			 }
			//默认类型
			 var valueTypes = $("#s36 option:selected").val();
			 $rootScope.valueType= "";
			 if(valueTypes){
				 $rootScope.valueType = valueTypes;
			 }
		});   
		$("#setDefaultId351").click(function(){ 
			 if($rootScope.valueType != "" && $rootScope.valueType != undefined && $rootScope.valueType != null){
				 $scope.proLineInf.defaultBusinessType = $rootScope.valueType;
			 }else{
				 jfLayer.fail(T.T('YYJ100020'));
			 }
		});
		$rootScope.valueType="";
		$("#transIdenty35").click(function(){ 
			$rootScope.valueType= "";
			 if($rootScope.valueInfo != "" && $rootScope.valueInfo != undefined && $rootScope.valueInfo != null){
				 $scope.soItem = {};
				 $scope.soItem.businessTypeCode = $rootScope.valueInfo;
				 $scope.soItem.operationMode = $scope.proLineInf.operationMode;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/transIdentyMode.html', $scope.soItem, {
					title : T.T('YYJ100018'),
					buttons : [ T.T('F00012') ],
					size : [ '700px', '350px' ],
					callbacks : []
				});
			 }else{
				 jfLayer.fail(T.T('YYJ100019'));
			 }
		});
        // ***********************业务类型列表***********************
        $scope.saveProLine = function() {
            $scope.arr2 = [];
            //  $scope.arr8 = [];
  			$scope.S2List = {};
  			$scope.S2ListResult = [];
  			 $("#s36 option").each(function () {
  		        var vall = $(this).val();
  		        $scope.arr2.push(vall);
  		    });
  			 if($rootScope.s2){
  				 for(var w=0;w<$rootScope.s2.length;w++){
  					 for(var t=0;t<$scope.arr2.length;t++){
  						if($rootScope.s2[w].businessTypeCode == $scope.arr2[t]){
  							$scope.S2List = $rootScope.s2[w];
  							$scope.S2ListResult.push($scope.S2List);
  						}
  					 }
  				 }
  			 }
        	 if($scope.S2ListResult.length == 0){
				 jfLayer.fail(T.T('YYJ100021'));
				 return;
			 }
			if(!$scope.proLineInf.defaultBusinessType){
				jfLayer.fail(T.T('YYJ100033'));
				return;
			}
			 $scope.proLineInf.list = $scope.S2ListResult;
            $scope.proLineInf.businessProgramNo = 'MODG' + $scope.proLineInf.businessProgramNoHalf;
            $scope.proObjInstan = $scope.proLineInf;
            $scope.nextInstan2();
        };
        //新增时 增加 新增业务类型
        $scope.addBusTypeNew = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/businessTypePramsMgtPorLine.html', '', {
				title : T.T('YYJ100012'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '630px' ],
				callbacks : [ $scope.saveBusinessTypeNew ]
			});
		};
		$scope.saveBusinessTypeNew = function(result){
			if(!$rootScope.sure){
				jfLayer.fail(T.T('F00086'));
				return;
			}
			$scope.busTypeInfoEst = result.scope.busTypeInfo;
			$scope.busTypeInfoEst.instanlist = [];
			$scope.busTypeInfoEst.businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
			$scope.busTypeInfoEst.operationMode = result.scope.operationModsAdd;
//新建业务类型去掉对余额对象的实例化，在关联那做实例化处理
//			if(result.scope.queryBalanceObject.data){
//				for(var i=0;i<result.scope.queryBalanceObject.data.length;i++){
//					if(result.scope.queryBalanceObject.data[i].instanlist){
//						for(var k=0;k<result.scope.queryBalanceObject.data[i].instanlist.length;k++){
//							result.scope.queryBalanceObject.data[i].instanlist[k].businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							result.scope.queryBalanceObject.data[i].instanlist[k].instanCode2 = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							$scope.busTypeInfoEst.instanlist.push(result.scope.queryBalanceObject.data[i].instanlist[k]);
//						}
//					}else{
//						for(var h=0;h<result.scope.queryBalanceObject.data[i].balanceInstanList.length;h++){
//							result.scope.queryBalanceObject.data[i].balanceInstanList[h].businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							result.scope.queryBalanceObject.data[i].balanceInstanList[h].instanCode2 = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
//							$scope.busTypeInfoEst.instanlist.push(result.scope.queryBalanceObject.data[i].balanceInstanList[h]);
//						}
//					}
//				}
//				for (var j = 0; j < $scope.busTypeInfoEst.instanlist.length; j++) {
//					if($scope.busTypeInfoEst.instanlist[j].pcdList==null && $scope.busTypeInfoEst.instanlist[j].pcdInitList!=null){
//						$scope.busTypeInfoEst.instanlist[j].addPcdFlag = "1";
//						$scope.busTypeInfoEst.instanlist[j].pcdList = $scope.busTypeInfoEst.instanlist[j].pcdInitList;
//					}
//				}
//			}
			for (var i = 0; i < result.scope.queryMODT.data.length; i++) {
//				if(result.scope.queryMODT.data[i].pcdList==null && result.scope.queryMODT.data[i].pcdInitList!=null){
//					result.scope.queryMODT.data[i].addPcdFlag = "1";
//					result.scope.queryMODT.data[i].pcdList = result.scope.queryMODT.data[i].pcdInitList;
//				}
				$scope.busTypeInfoEst.instanlist.push(result.scope.queryMODT.data[i]);
			}
			for (var i = 0; i < $scope.busTypeInfoEst.instanlist.length; i++) {
				if($scope.busTypeInfoEst.instanlist[i].pcdList==null && $scope.busTypeInfoEst.instanlist.pcdInitList!=null){
					$scope.busTypeInfoEst.instanlist[i].addPcdFlag = "1";
					$scope.busTypeInfoEst.instanlist[i].pcdList = $scope.busTypeInfoEst.instanlist[i].pcdInitList;
				}
			}
			jfRest.request('businessType', 'save', $scope.busTypeInfoEst).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.businessTypesForm.$setPristine();
					 $("#s35 option").remove();
					 $("#s36 option").remove();
					 $scope.setparamss = {
							operationMode : $scope.proLineInf.operationMode
					};
					 jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
						if(data.returnData.totalCount == 0){
							jfLayer.fail(T.T("YYJ100032"));
							return;
						}
						var a =data.returnData.rows;
						$rootScope.s2 = {};
						$rootScope.s2 =data.returnData.rows;
						for(var i=0;i<a.length;i++){
							$("#s35").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
					   }
					});
					$scope.safeApply();
					result.cancel();
				}
			});
		};
        // 构件实例--------------start
        $scope.newCodeShow = true;
        $scope.instanCodeShow = false;
        // ************授权业务交易识别码表*****************
        $scope.authBusTransShow = false; // 默认不显示
        $scope.nextInstan2 = function() {
			$("#s21 option").remove();
			$("#s22 option").remove();
			$scope.set2paramss = {
					operationMode : $scope.proLineInf.operationMode
			};
			 jfRest.request('balanceObject', 'query', $scope.set2paramss).then(function(data) {
				if(data.returnData.totalCount == 0){
					jfLayer.fail(T.T('YYJ100036'));    //'改运营模式下暂无可选余额对象');
					return;
				}
				$scope.BPInfo = true;
	        	$scope.step2Btn =false;
	        	$("#add35").attr("disabled","disabled");
				$("#add35").addClass("layui-btn-disabled");
				$("#addall35").attr("disabled","disabled");
				$("#addall35").addClass("layui-btn-disabled");
				$("#remove35").attr("disabled","disabled");
				$("#remove35").addClass("layui-btn-disabled");
				$("#removeall35").attr("disabled","disabled");
				$("#removeall35").addClass("layui-btn-disabled");
				$("#transIdenty35").attr("disabled","disabled");
				$("#transIdenty35").addClass("layui-btn-disabled");
				$("#setDefaultId35").attr("disabled","disabled");
				$("#setDefaultId35").addClass("layui-btn-disabled");
				$("#addBusTypeNewId").attr("disabled","disabled");
				$("#addBusTypeNewId").addClass("layui-btn-disabled");
				var bp =data.returnData.rows;
				$rootScope.proBPInstanListPage = [];
				for(var i=0;i<bp.length;i++){
					$("#s21").append("<option value='"+bp[i].balanceObjectCode+"'>"+bp[i].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+bp[i].objectDesc+"</option>"); 
			   }
			});
        };
		$("#add21").click(function(){  
			var alloptions = $("#s21 option");  
			var so = $("#s21 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				var bOCodeSelected = $("#s21 option:selected").val();
				var objectDescMsg = $("#s21 option:selected").html();
				$("#s22").append(so); 
				$scope.valueBT = {};
				$scope.valueBT.balanceObjectCode = bOCodeSelected;
				$scope.valueBT.businessTypeCodeList = [];
				$scope.valueBT.balanceObjectCodelist = [];
				$scope.valueBT.operationMode = $scope.proLineInf.operationMode;
				$scope.valueBT.balanceObjectCodelist.push(bOCodeSelected);
				$scope.balanceObjectDesc = objectDescMsg.substring(33,objectDescMsg.length);
				$scope.valueBT.businessProgramNo = 'MODG' + $scope.proLineInf.businessProgramNoHalf;
				$scope.valueBT.objectDesc = $scope.balanceObjectDesc;
				var ssd = $("#s36 option");
				for(var k=0;k<ssd.length;k++){
					$scope.valueBT.businessTypeCodeList.push(ssd[k].value);
				}
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/proBalanceObject.html',$scope.valueBT,{
					title : T.T('YYJ600014'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [  ]
				});
			 }
		});  
		$("#remove21").click(function(){  
			 var alloptions = $("#s22 option");  
			 var so = $("#s22 option:selected");
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 var bOCodeRemove = $("#s22 option:selected").val();
				 $("#s21").append(so);
				 $scope.BPinstantiationKey = "";
				 if($rootScope.proBPInstanListPage.length > 0){
					 for (var i = 0; i < $rootScope.proBPInstanListPage.length; i++) {
						if($rootScope.proBPInstanListPage[i].balanceObjectCode == bOCodeRemove){
							$rootScope.proBPInstanListPage.splice(i, 1);
						}
					}
				 }
			 }
		});
		$("#s22").click(function(){  
			var so = $("#s22 option:selected");
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				//余额对象
				 var BPinstantiation = $("#s22 option:selected").val();
				 $scope.BPinstantiationKey= "";
				 if(BPinstantiation){
					 $scope.BPinstantiationKey = BPinstantiation;
				 }
			 }
		});
		$("#BPinstantiationInf").click(function(){
			 if($scope.BPinstantiationKey != "" && $scope.BPinstantiationKey != undefined && $scope.BPinstantiationKey != null){
				 $scope.valueBTInfo = {};
				 if($rootScope.proBPInstanListPage.length > 0){
					 for (var i = 0; i < $rootScope.proBPInstanListPage.length; i++) {
						if($rootScope.proBPInstanListPage[i].balanceObjectCode == $scope.BPinstantiationKey){
							$scope.valueBTInfo = $rootScope.proBPInstanListPage[i];
						}
					}
				 }
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/proBalanceObjectUpdate.html',$scope.valueBTInfo,{
					title : T.T('YYJ600014'),   //'余额对象实例化',
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px'],
					callbacks : [  ]
				});
			 }else{
				 jfLayer.fail(T.T('YYJ100035'));    //'请点击右侧余额对象实例化!');
			 }
		});
		//选择收费项目
		$("#s7").dblclick(function(){  
			 var alloptions = $("#s7 option");  
			 var so = $("#s7 option:selected");  
			 $("#s8").append(so);  
		});  
		$("#s8").dblclick(function(){  
			 var alloptions = $("#s8 option");  
			 var so = $("#s8 option:selected");  
			 $("#s7").append(so);  
		});  
	/*	$("#add7").click(function(){  
			 var alloptions = $("#s7 option");  
			 var so = $("#s7 option:selected");  
			 $("#s8").append(so); 
		});  */
		$("#remove7").click(function(){  
			 var alloptions = $("#s8 option");  
			 var so = $("#s8 option:selected");
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');
				 return;
			 }else{
				 var bOCodeRemove = $("#s8 option:selected").val();
				 $("#s7").append(so);
				 if($scope.feeProExampleList.length > 0 ){
					for(var i = 0; i < $scope.feeProExampleList.length; i++){
						$scope.feeProExampleList.splice(i, 1);
                    }
                 }
             }
        });
		$("#addall7").click(function(){  
			$("#s8").append($("#s7 option").attr("selected",true));  
		});  
		$("#removeall7").click(function(){  
			$("#s7").append($("#s8 option").attr("selected",true));  
		});
		$("#add7").click(function(){  
			var alloptions = $("#s7 option");  
			var so = $("#s7 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');
				 return;
			 }else{
				var bOCodeSelected = $("#s7 option:selected").val();
				var objectDescMsg = $("#s7 option:selected").html();
				$("#s8").append(so); 
				$scope.ktparamss = {
					operationMode : lodinDataService.getObject('operationMode'),
//					periodicFeeIdentifier :"P",
					instanCode: "MODG"
				};
				jfRest.request('feeProject', 'query', $scope.ktparamss).then(function(data) {
					if(data.returnData.rows){
						var rows = data.returnData.rows;
						for(var i = 0; i < rows.length; i++){
							if(bOCodeSelected == rows[i].feeItemNo){
								$scope.payProExampleadd = rows[i];
								if($scope.payProExampleadd.instanCode1 == 'MODG'){
									$scope.payProExampleadd.businessProgramNo = $scope.proLineInf.businessProgramNo;
                                }
                            }
                        }
                        $scope.modal('/a_operatMode/product/busiLayerProExample.html',$scope.payProExampleadd, {
							title : T.T('YYJ1300066'),
							buttons : [T.T('F00107'), T.T('F00012') ],
							size : [ '1050px', '600px' ],
							callbacks : [$scope.savePayProExample]//$scope.closeFeePro 
						});
                    }
                });
             }
        });
		// 新增收费项实例
		$scope.feeProExampleList = [];//收费项目 list
		$scope.savePayProExample = function(result){
			$scope.payProExampleInf = {};
			$scope.payProExampleInf =  Object.assign(result.scope.payProExampleadd , result.scope.payProExampleInf2);
			if($scope.payProExampleInf.feeItemNo == "LCHG025" && (result.scope.payProExampleInf2.feeMatrixApplicationDimension == "" || 
					result.scope.payProExampleInf2.feeMatrixApplicationDimension ==  undefined || result.scope.payProExampleInf2.feeMatrixApplicationDimension ==  "undefined")){
				jfLayer.fail(T.T("YYJ1300042"));
				return;
            }
            if((result.scope.payProExampleInf2.feeMatrixApplicationDimension != "" || result.scope.payProExampleInf2.feeMatrixApplicationDimension !=  undefined ||
					result.scope.payProExampleInf2.feeMatrixApplicationDimension !=  "undefined") && (result.scope.payProExampleInf2.matrixAppMode != "" || 
					result.scope.payProExampleInf2.matrixAppMode !=  undefined || result.scope.payProExampleInf2.matrixAppMode !=  "undefined")){
				if(result.scope.payProExampleInf2.feeMatrixApplicationDimension == "2" && result.scope.payProExampleInf2.matrixAppMode == "P"){
					jfLayer.fail(T.T("YYJ1300043"));
					return;
				}
            }
            if($scope.payProExampleInf.instanDimen1 && $scope.payProExampleInf.instanDimen1 !="null"){
				if($scope.payProExampleInf.instanCode1 =="" || $scope.payProExampleInf.instanCode1 ==  undefined || 
						$scope.payProExampleInf.instanCode1 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300044"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen2  && $scope.payProExampleInf.instanDimen2 !="null"){
				if($scope.payProExampleInf.instanCode2 =="" || $scope.payProExampleInf.instanCode2 ==  undefined || 
						$scope.payProExampleInf.instanCode2 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300045"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen3  && $scope.payProExampleInf.instanDimen3 !="null"){
				if($scope.payProExampleInf.instanCode3 =="" || $scope.payProExampleInf.instanCode3 ==  undefined || 
						$scope.payProExampleInf.instanCode3 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300046"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen4  && $scope.payProExampleInf.instanDimen4 !="null"){
				if($scope.payProExampleInf.instanCode4 =="" || $scope.payProExampleInf.instanCode4 ==  undefined || 
						$scope.payProExampleInf.instanCode4 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300047"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen5 && $scope.payProExampleInf.instanDimen5 !="null"){
				if($scope.payProExampleInf.instanCode5 =="" || $scope.payProExampleInf.instanCode5 ==  undefined || 
						$scope.payProExampleInf.instanCode5 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300048"));
							return;
				}
            }
            if($scope.payProExampleInf.instanDimen1 == "FTYP" || $scope.payProExampleInf.instanDimen2 == "FTYP" || $scope.payProExampleInf.instanDimen3 == "FTYP"
				|| $scope.payProExampleInf.instanDimen4 == "FTYP" || $scope.payProExampleInf.instanDimen5 == "FTYP"){
				if($scope.payProExampleInf.feeCollectType == "" || $scope.payProExampleInf.feeCollectType ==  undefined || 
						$scope.payProExampleInf.feeCollectType ==  "undefined"){
					jfLayer.fail(T.T("YYJ1300049"));
					return;
				}else{
					if($scope.payProExampleInf.instanDimen1 == "FTYP"){
						if($scope.payProExampleInf.instanCode1 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen2 == "FTYP"){
						if($scope.payProExampleInf.instanCode2 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen3 == "FTYP"){
						if($scope.payProExampleInf.instanCode3 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen4 == "FTYP"){
						if($scope.payProExampleInf.instanCode4 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if($scope.payProExampleInf.instanDimen5 == "FTYP"){
						if($scope.payProExampleInf.instanCode5 != $scope.payProExampleInf.feeCollectType){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}
				}
            }
            if($scope.payProExampleInf.feeFlag == 'P'){
				if($scope.payProExampleInf.feeRate1){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate1)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate2){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate2)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate3){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate3)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate4){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate4)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
				if($scope.payProExampleInf.feeRate5){
					var pattern = /^[0-1](\.\d{1,9})?$/ ;
					if (!pattern.test($scope.payProExampleInf.feeRate5)) {
						jfLayer.fail(T.T("YYJ1300069"));
						return;
					}
				}
            }
            //push 收费项目list
			$scope.payProExampleInf = result.scope.payProExampleInf;//实例化后的收费项目
			$scope.feeProExampleList.push($scope.payProExampleInf);
			$scope.safeApply();
			result.cancel();
		};
		//关闭收费项目实例化 必须实例化
		/*$scope.closeFeePro = function(result){
			if(($rootScope.payProExampleaddInf.instanCode1 == '' || $rootScope.payProExampleaddInf.instanCode1 == null || $rootScope.payProExampleaddInf.instanCode1 == undefined || $rootScope.payProExampleaddInf.instanCode1 == 'null') &&
			($rootScope.payProExampleaddInf.instanCode2 == '' || $rootScope.payProExampleaddInf.instanCode2 == null || $rootScope.payProExampleaddInf.instanCode2 == undefined || $rootScope.payProExampleaddInf.instanCode2 == 'null') &&
			($rootScope.payProExampleaddInf.instanCode3 == '' || $rootScope.payProExampleaddInf.instanCode3 == null || $rootScope.payProExampleaddInf.instanCode3 == undefined || $rootScope.payProExampleaddInf.instanCode3 == 'null') &&
			($rootScope.payProExampleaddInf.instanCode4 == '' || $rootScope.payProExampleaddInf.instanCode4 == null || $rootScope.payProExampleaddInf.instanCode4 == undefined || $rootScope.payProExampleaddInf.instanCode4 == 'null') &&
			($rootScope.payProExampleaddInf.instanCode5 == '' || $rootScope.payProExampleaddInf.instanCode5 == null || $rootScope.payProExampleaddInf.instanCode5 == undefined || $rootScope.payProExampleaddInf.instanCode5 == 'null') ){
				jfLayer.fail('请建立收费项目实例化！');
				return;
				setTimeout(function(){
					$("#"+result.content[0].id).css('display','block');
				},300)
			};
			
			setTimeout(function(){
				$("#"+result.content[0].id).css('display','block');
			},300)
		};*/
		
		
		
		
		
		
		//选择余额对象后 去收费项目
		 //点击下一步，选择收费项目
		$scope.step4Info = false;
		$scope.nextAndFeeItem = function(){
			 if(!$("#s22 option:selected").val()){
        		jfLayer.alert('请选择余额对象');
        		return;
             }
            $scope.step3Btn = false;//第三步按钮 余额对象中按钮
        	$scope.step4Info = true;//收费项目 模块
        	$scope.step4Btn =true;//第四部按钮 收费项目中按钮
        	//余额对象按钮禁用
        	$("#add21").attr("disabled","disabled");
			$("#add21").addClass("layui-btn-disabled");
        	$("#remove21").attr("disabled","disabled");
			$("#remove21").addClass("layui-btn-disabled");
        	$("#BPinstantiationInf").attr("disabled","disabled");
			$("#BPinstantiationInf").addClass("layui-btn-disabled");
			$("#s7 option").remove();
			$("#s8 option").remove();
			$scope.ktparamss = {
				operationMode : $rootScope.operationMods,
//				periodicFeeIdentifier :"P",
				instanCode: "MODG"
			};
			jfRest.request('feeProject', 'query', $scope.ktparamss).then(function(data) {
				if(data.returnData.rows){
					var c =data.returnData.rows;
					$rootScope.s8 = {};
					$rootScope.s8 = data.returnData.rows;
					for(var i=0;i<c.length;i++){
						$("#s7").append("<option value='"+c[i].feeItemNo+"'>"+c[i].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+c[i].feeDesc+"</option>"); 
				   }
                }
            });
		 };
		 //返回第三部 收费项目--》余额对象
		 $scope.stepBackBP = function(){
			 $scope.step4Info = false;//收费项目
			 $scope.step3Btn = true;//第三部按钮 余额对象按钮
			 $scope.step4Info = false;//收费项目模块
			//余额对象 中间按钮可用
			$("#add21").removeAttr("disabled","disabled");
			$("#add21").removeClass("layui-btn-disabled");
        	$("#remove21").removeAttr("disabled","disabled");
			$("#remove21").removeClass("layui-btn-disabled");
        	$("#BPinstantiationInf").removeAttr("disabled","disabled");
			$("#BPinstantiationInf").removeClass("layui-btn-disabled");
		 };
		 //费用类别dic_costCategory
		 $scope.feeTypeArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_costCategory",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		 /* [ {
			name : T.T('YYJ1200001'),
			id : 'ANNF'
		}, {
			name : T.T('YYJ1200002'),
			id : 'LCHG'
		}, {
			name : T.T('YYJ1200003'),
			id : 'OVRF'
		} , {
			name : T.T('YYJ1200004'),
			id : 'CSHF'
		} , {
			name : T.T('YYJ1200005'),
			id : 'TXNF'
		} , {
			name : T.T('YYJ1200006'),
			id : 'SVCF'
		}  , {
			name : T.T('YYJ1200007'),
			id : 'ISTF'
		} , {
			name : T.T("YYJ1200018"),
			id : 'ISSF'
		} ];*/
		 /*----根据收费项目编号，和费用类别查询----*/
	 	$scope.queryFeeItemList = function(){
			 $("#s7").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				feeItemNo: $scope.proObjBusInsInf.feeItemNo,
				feeType: $scope.proObjBusInsInf.feeType,
				periodicFeeIdentifier :"P"
	 		};
			jfRest.request('feeProject', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s8 option").each(function () {
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
					    	if(n[i]==a[j].formatCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s7").append("<option value='"+a[j].feeItemNo+"'>"+a[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].feeDesc+"</option>"); 
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s7").append("<option value='"+a[j].feeItemNo+"'>"+a[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].feeDesc+"</option>"); 
					   }
			      }
			});
		};
		
		//收费项目进入项目实例化 下一步
		$scope.nextAndBusInstan = function(){
        	/*if(!$("#s8 option:selected").val()){
        		jfLayer.alert('请选择收费项目');
        		return;
        	};*/
        	$scope.newCodeShow =  false;//基本信息
        	$scope.selInfo =  false;//业务类型
        	$scope.BPInfo = false;//余额对象
        	$scope.step4Info = false;//收费项目模块
        	$scope.instanCodeShow = true;//项目实例化模块
        	$scope.authBusTransShow = false;//授权业务交易识别码表
            $scope.queryMODG.params.instanCode = $scope.proObjInstan.businessProgramNo;
            $scope.queryMODG.search();
		};
		//从项目实例化返回 收费项目
		$scope.stepBackFeePro = function(){
			$scope.newCodeShow =  true;//基本信息
        	$scope.selInfo =  true;//业务类型
        	$scope.BPInfo = true;//余额对象
        	$scope.step4Info = true;//收费项目模块
        	$scope.instanCodeShow = false;//项目实例化模块
        	$scope.authBusTransShow = false;//授权业务交易识别码表
        	
		};
		//从选择余额对象返回选择业务类型
        $scope.stepBackTwo = function(){
        	$scope.BPInfo = false;
        	$scope.step2Btn =true;
        	$("#add35").removeAttr("disabled","disabled");
			$("#add35").removeClass("layui-btn-disabled");
			$("#addall35").removeAttr("disabled","disabled");
			$("#addall35").removeClass("layui-btn-disabled");
			$("#remove35").removeAttr("disabled","disabled");
			$("#remove35").removeClass("layui-btn-disabled");
			$("#removeall35").removeAttr("disabled","disabled");
			$("#removeall35").removeClass("layui-btn-disabled");
			$("#transIdenty35").removeAttr("disabled","disabled");
			$("#transIdenty35").removeClass("layui-btn-disabled");
			$("#setDefaultId35").removeAttr("disabled","disabled");
			$("#setDefaultId35").removeClass("layui-btn-disabled");
			$("#addBusTypeNewId").removeAttr("disabled","disabled");
			$("#addBusTypeNewId").removeClass("layui-btn-disabled");
        };
        //从业务项目实例化返回选择余额对象这块
        /*$scope.stepBackThree = function(){
        	$scope.instanCodeShow = false; // 显示实例化
            $scope.newCodeShow = true;
            $scope.selInfo = true;
            $scope.step2Btn =false;
            $scope.step1Btn =false;
            $scope.step3Btn =false;
            $scope.BPInfo =true;
          //  $scope.selInfoTwo = true;
        };
        //选择余额对象后去实例化业务项目
        $scope.stepToThree = function() {
         	if(!$("#s22 option:selected").val()){
         		jfLayer.alert('请选择余额对象');
         		return;
         	};
         	//未关联业务类型则直接实例化
         	$scope.authBusTransShow = false; // 不显示授权业务交易识别码表
             $scope.instanCodeShow = true; // 显示实例化
             $scope.newCodeShow = false;
             $scope.selInfo = false;
             $scope.step1Btn =false;
             $scope.step2Btn =false;
             $scope.step3Btn =false;
             $scope.BPInfo = false;
             $scope.queryMODG.params.instanCode = $scope.proObjInstan.businessProgramNo;
             $scope.queryMODG.search();
         };*/
        // 授权业务交易识别码表
        $scope.queryAuthBusTrans = {
            params: $scope.queryParam = {
                "authFlag": '0',
                "pageSize": 10,
                "indexNo": 0
            },
            // 表格查询时的参数信息
            paging: true,
            // 默认true,是否分页
            autoQuery: false,
            resource: 'quotatree.linesproQuery',
            // 列表的资源
            callback: function(data) { // 表格查询后的回调函数
            }
        };
        // 新增余额对象（单纯的余额对象，不包含实例化信息）
		$scope.balanceObjectTypeAdd = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/balanceObjectEst.html','',{
				title : T.T('YYJ200032'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.saveBalanceObject ]
			});
		};
		// 新增
		$scope.saveBalanceObject = function(result) {
			$scope.balanceObjInfEst = {};
			$scope.balanceObjInfEst = result.scope.balanceObjInf;
			$scope.balanceObjInfEst.balanceObjectCode = 'MODB'+result.scope.balanceObjInf.balanceObjectCodeHalf;
			$scope.balanceObjInfEst.beginDate = $("#LAY_start_Obj").val();
		    $scope.balanceObjInfEst.endDate = $("#LAY_end_Obj").val();
			jfRest.request('balanceObject', 'save',$scope.balanceObjInfEst).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.balanceObjForm.$setPristine();
					$("#s21 option").remove();
					// $("#s22 option").remove();
					$scope.set2paramss = {
							operationMode : $scope.proLineInf.operationMode
					};
					 jfRest.request('balanceObject', 'query', $scope.set2paramss).then(function(data) {
						if(data.returnData.totalCount == 0){
							jfLayer.fail(T.T('YYJ100036'));    //'改运营模式下暂无可选余额对象');
							return;
						}
						var bp =data.returnData.rows;
					//	$rootScope.proBPInstanListPage = [];
						for(var i=0;i<bp.length;i++){
							$("#s21").append("<option value='"+bp[i].balanceObjectCode+"'>"+bp[i].balanceObjectCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+bp[i].objectDesc+"</option>"); 
					   }
					});
					$scope.safeApply();
					result.cancel();
				} 
			});
		};
        // 删除按钮
        $scope.delControl = function(event) {
            // 页面弹出框事件(弹出页面)
            $scope.itemd = $.parseJSON(JSON.stringify(event));
            $scope.modal('/authorization/quotatree/linesProductDel.html', $scope.itemd, {
                title: T.T('SQJ2000004'),
                buttons: [T.T('F00016'), T.T('F00108')],
                size: ['800px', '420px'],
                callbacks: [$scope.delControlSure]
            });
        };
        // 删除
        $scope.delControlSure = function(result) {
            $scope.itemd = $scope.itemd;
            jfLayer.confirm(T.T('SQJ2000004'),
            function() {
                $scope.itemd.authFlag = '3';
                jfRest.request('quotatree', 'linesproDel', $scope.itemd).then(function(data) {
                    if (data.returnMsg == 'OK') {
                        jfLayer.alert(T.T('F00037'));
                        $scope.itemd = {};
                        $scope.safeApply();
                        result.cancel();
                        $scope.queryAuthBusTrans.search();
                    } 
                });
            },
            function() {
            });
        };
        // 修改弹出页面
        $scope.updateControl = function(event) {
            $scope.itemUpdate = $.parseJSON(JSON.stringify(event));
            $scope.itemUpdate.authDataSynFlag = "1";
            $scope.modal('/authorization/quotatree/linesProductUpdate_busPro.html', $scope.itemUpdate, {
                title: T.T('SQJ2000003'),
                buttons: [T.T('F00107'), T.T('F00108')],
                size: ['900px', '480px'],
                callbacks: [$scope.savelinesPInfo]
            });
        };
        // 修改弹出页面==============回调函数/确认按钮事件
        $scope.savelinesPInfo = function(result) {
            $scope.itemUpdate.authFlag = '2';
            $scope.itemUpdate.creditNodeNo = result.scope.creditNodeNoInfos;
            jfRest.request('quotatree', 'linesproUpdate', $scope.itemUpdate).then(function(data) {
                if (data.returnCode == '000000') {
                    jfLayer.success(T.T('F00022'));
                    $scope.itemUpdate = {};
                    $scope.safeApply();
                    result.cancel();
                    $scope.queryAuthBusTrans.search();
                }
            });
        };
        // ************授权业务交易识别码表end*****************
        // 进入交易识别码表
        $scope.nextInstan3 = function() {
        	$scope.authBusTransShow = true; // 显示授权业务交易识别码表
    		$scope.instanCodeShow = false; // 不显示实例化
    		$scope.newCodeShow = false;//基本信息
    		$scope.selInfo = false;// 业务类型
    		$scope.queryAuthBusTrans.params.businessProgramNo = $scope.proObjInstan.businessProgramNo;
    		$scope.queryAuthBusTrans.params.operationMode = $scope.proObjInstan.operationMode;
    		$scope.queryAuthBusTrans.search();
        };
        // 查询业务项目实例构件
        $scope.queryMODG = {
            // checkType : 'checkbox', // 当为checkbox时为多选
            params: $scope.queryParam = {
                instanDimen1: "MODG"
            },
            // 表格查询时的参数信息
            paging: false,
            // 默认true,是否分页
            autoQuery: true,
            resource: 'artifactExample.querySelectArtifact',
            // 列表的资源
            callback: function(data) { // 表格查询后的回调函数
            }
        };
        // 业务项目实例化时，点击替换参数的方法
        $scope.updateBusProB = function(item, $index) {
            $scope.indexNo = '';
            $scope.indexNo = $index;
            // 弹框查询列表元件
            $scope.itemsNo = {};
            $scope.itemsNo = $.parseJSON(JSON.stringify(item));
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
                title: T.T('F00138'),
                buttons: [T.T('F00107'), T.T('F00012')],
                size: ['1100px', '500px'],
                callbacks: [$scope.choseBusPro]
            });
        };
        // 新建余额对象实例化时，点击设置参数值的方法
        $scope.setBusProB = function(item, $index) {
            $scope.indexNo = '';
            $scope.indexNo = $index;
            // 弹框查询列表元件
            $scope.itemsPCD = {};
            $scope.itemsPCD = $.parseJSON(JSON.stringify(item));
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
                title: T.T('F00083') + $scope.itemsPCD.pcdNo + ':' + $scope.itemsPCD.pcdDesc +  T.T('F00139'),
                buttons: [T.T('F00107'), T.T('F00012')],
                size: ['1100px', '500px'],
                callbacks: [$scope.choseBusProTwo]
            });
        };
        $scope.choseBusPro = function(result) {
            if (!result.scope.elementNoTable.validCheck()) {
                return;
            }
            $scope.items = {};
            $scope.items = result.scope.elementNoTable.checkedList();
            $scope.queryMODG.data[$scope.indexNo].elementNo = $scope.items.elementNo;
            $scope.queryMODG.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
            $scope.queryMODG.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
            $scope.queryMODG.data[$scope.indexNo].elementNo = $scope.items.elementNo;
            $scope.queryMODG.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
            if (result.scope.pcdInstanShow) {
                $scope.queryMODG.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
                $scope.queryMODG.data[$scope.indexNo].addPcdFlag = "1";
            }
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseBusProTwo = function(result) {
            $scope.items = {};
            $scope.queryMODG.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
            $scope.queryMODG.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
            $scope.queryMODG.data[$scope.indexNo].addPcdFlag = "1";
            $scope.safeApply();
            result.cancel();
        };
        //保存业务项目，基本信息，关联信息及实例化，一起入库
        $scope.nextInstanSave = function() {
        	$scope.proObjInstanAdd = {};
        	$scope.proObjInstanAdd.balanceObjectCodeList = [];//
        	$scope.instanlistModg = [];
        	$scope.balanceObjectPcd = [];
            for (var i = 0; i < $scope.queryMODG.data.length; i++) {
                if ($scope.queryMODG.data[i].pcdList == null && $scope.queryMODG.data[i].pcdInitList != null) {
                    $scope.queryMODG.data[i].addPcdFlag = "1";
                    $scope.queryMODG.data[i].pcdList = $scope.queryMODG.data[i].pcdInitList;
                }
            }
            //余额对象的pcd实例
            $scope.instanlistModg = $scope.queryMODG.data;
            for (var k = 0; k < $rootScope.proBPInstanListPage.length; k++) {
            	$scope.proObjInstanAdd.balanceObjectCodeList.push($rootScope.proBPInstanListPage[k].balanceObjectCode);
            	for(var n=0;n< $rootScope.proBPInstanListPage[k].balanceObjectInstan.length;n++){
            		for(var m=0;m< $rootScope.proBPInstanListPage[k].balanceObjectInstan[n].busTypeInstanList.length;m++){
            			$scope.balanceObjectPcd.push($rootScope.proBPInstanListPage[k].balanceObjectInstan[n].busTypeInstanList[m]);
                    }
                }
            }
            //业务项目的pcd实例
            for(var f=0;f<$scope.instanlistModg.length;f++){
            	$scope.balanceObjectPcd.push($scope.instanlistModg[f]);
            }
            //pcd有值传1，pcdList无值，pcdInitList有值，pcdInitList 赋给pcdList
			if($scope.balanceObjectPcd.length>0){
				for(var i=0;i<$scope.balanceObjectPcd.length;i++){
					if($scope.balanceObjectPcd[i].pcdList != null || $scope.balanceObjectPcd[i].pcdInitList != null){
						$scope.balanceObjectPcd[i].addPcdFlag = '1';
					}
					if($scope.balanceObjectPcd[i].pcdList==null && $scope.balanceObjectPcd[i].pcdInitList!=null){
						$scope.balanceObjectPcd[i].pcdList = $scope.balanceObjectPcd[i].pcdInitList;
					}
				}
			}
            $scope.proObjInstanAdd.instanlist = $scope.balanceObjectPcd;
            $scope.proObjInstanAdd.instanCode = $scope.proObjInstan.businessProgramNo;
            $scope.proObjInstanAdd.businessProgramNo =  $scope.proObjInstan.businessProgramNo;
            $scope.proObjInstanAdd.list =  $scope.proObjInstan.list;
            $scope.proObjInstanAdd.businessProgramNoHalf =  $scope.proObjInstan.businessProgramNoHalf; 
            $scope.proObjInstanAdd.defaultBusinessType =  $scope.proObjInstan.defaultBusinessType; 
            $scope.proObjInstanAdd.deletePcdInstanIdList =  $scope.proObjInstan.deletePcdInstanIdList; 
            $scope.proObjInstanAdd.operationMode =  $scope.proObjInstan.operationMode; 
            $scope.proObjInstanAdd.programDesc =  $scope.proObjInstan.programDesc; 
            $scope.proObjInstanAdd.programType =  $scope.proObjInstan.programType; 
            $scope.proObjInstanAdd.paymentPriority = $scope.proObjInstan.paymentPriority;
            $scope.proObjInstanAdd.feeInstanList = $scope.feeProExampleList;//收费项目
            if($scope.proObjInstanAdd.defaultBusinessType){
            	jfRest.request('productLine', 'save', $scope.proObjInstanAdd).then(function(data) {
                    if (data.returnCode == '000000') {
                        jfLayer.success(T.T('F00032'));
                        $scope.proObjInstan = $scope.proLineInf;
                        $scope.proLineInfoForm.$setPristine();
                        $scope.nextInstan3();
                        //初始化
                        $scope.feeProExampleList = [];//收费项目初始化
                        $scope.balanceObjectPcd = [];//余额对象PCD实例化
                        $scope.proObjInstan.list = [];//pcd的list初始化
                        $scope.proObjInstan.deletePcdInstanIdList = [];//记录删除pcd 初始化
                    } 
                });
            }else{
            	 jfLayer.fail(T.T('YYJ510004'));
            }
        };
        // 构件实例--------------end
    });
    //余额对象实例化 替换参数33333333333333
    webApp.controller('selectElementNoCtrl',
    function($scope, $stateParams, jfRest, $http, jfGlobal, $timeout, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTable = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
    });
    // ******************************替换参数end***************
    // ******************************业务类型设置参数值pcd修改44444444444444444***************
    webApp.controller('selectPCDCtrl',function($scope, $stateParams,$timeout,  jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
    	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
    	$scope.pcdExampleInf = {};
        $scope.pcdDifExampleInf = {};
        var count = 1;
        $scope.artifactInfo = $scope.itemsPCD;
		$scope.businessValueArr01= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.baseInstanDimenAddD = $scope.pcdExampleInf.baseInstanDimen;
			}
		};
		$scope.businessValueArr02= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.optionInstanDimenAddD = $scope.pcdExampleInf.optionInstanDimen;
			}
		};
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.segmentTypeAddD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.pcdTypeAdd = $scope.pcdExampleInf.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeAdd)',function(event){
			 $scope.pcdTypeAdd = event.value;
		 });
        // 新增pcd差异化不显示
        $scope.showNewPcdInfo = false;
        $scope.pcdInfTable = [];
        // pcd差异化实例 新增按钮
        $scope.newPcdBtn = function() {
        	$scope.indexNoTemp = '';
            $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
            if ($scope.showNewPcdInfo) {
                if($scope.pcdInfTable.length < 1){
    				var count = 0;
    				$scope.pcdExampleInf.segmentSerialNum = count;
    			}else{
    				var count = $scope.pcdInfTable.length;
    				count++;
    				$scope.pcdExampleInf.segmentSerialNum = count;
    			}
            }
        };
        $scope.pcdInstanShow = true;
        $scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0, 8);
        if ($scope.itemsPCD.segmentType != null) { // 分段类型不为空
            $scope.pcdExampleInf.segmentType = $scope.itemsPCD.segmentType;
            $scope.addButtonShow = true;
        } else {
            $scope.addButtonShow = false;
        }
        if ($scope.itemsPCD.pcdInitList != null) {
            $scope.pcdInfTable = $scope.itemsPCD.pcdInitList;
        } else {
            $scope.showNewPcdInfo = true;
        }
        if ($scope.itemsPCD.pcdList != null) {
            $scope.pcdInfTable = $scope.itemsPCD.pcdList;
        }
        // 删除pcd实例列表某行
        $scope.deletePcdDif = function(data) {
            if ($scope.pcdInfTable.length == 1) {
                jfLayer.fail(T.T('YYJ400048'));
                return;
            }
            var checkId = data;
            $scope.pcdInfTable.splice(checkId, 1);
        };
        // 修改pcd实例列表某行
        $scope.updateInstan = function(event, $index) {
            $scope.indexNoTemp = '';
            $scope.indexNoTemp = $index+1;
            $scope.showNewPcdInfo = true;
            $scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
            $scope.pcdExampleInf = $scope.updateInstanTemp;
        };
        // 保存pcd实例============余额对象实例化设置参数值
        $scope.saveNewAdrInfo = function() {
            if (null == $scope.pcdExampleInf.pcdPoint || null == $scope.pcdTypeAdd || null == $scope.pcdExampleInf.pcdValue) {
                jfLayer.fail(T.T('YYJ400049'));
                return;
            }
            var pcdInfTableInfoU = {};
            pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
            pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
            pcdInfTableInfoU.pcdType = $scope.pcdTypeAdd;
            pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
            pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
            pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
            pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
            pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
            if ($scope.indexNoTemp != undefined && $scope.indexNoTemp != null && $scope.indexNoTemp != "") {
                $scope.pcdInfTable[$scope.indexNoTemp-1].segmentSerialNum = $scope.indexNoTemp;
                $scope.pcdInfTable[$scope.indexNoTemp-1].pcdType = $scope.pcdTypeAdd;
                $scope.pcdInfTable[$scope.indexNoTemp-1].segmentValue = $scope.pcdExampleInf.segmentValue;
                $scope.pcdInfTable[$scope.indexNoTemp-1].pcdValue = $scope.pcdExampleInf.pcdValue;
                $scope.pcdInfTable[$scope.indexNoTemp-1].pcdPoint = $scope.pcdExampleInf.pcdPoint;
                $scope.pcdInfTable[$scope.indexNoTemp-1].optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
                $scope.pcdInfTable[$scope.indexNoTemp-1].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
                $scope.indexNo = null;
            } else {
                $scope.pcdInfTable.push(pcdInfTableInfoU);
            }
            $scope.pcdDifExampleInf = {};
            $scope.pcdDifExampleInf.pcdNo = pcdInfTableInfoU.pcdNo;
            $scope.showNewPcdInfo = false;
        };
        //
        var dataValueCount;
        // dataType维度取值，dataValue第几个实例代码
        $scope.chosedInstanCode = function(dataType) {
            if (dataType == "MODT") { // 业务类型
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
                    title: T.T('YYJ400021'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseBusType]
                });
            } else if (dataType == "MODM") { // 媒介对象
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
                    title: T.T('YYJ400022'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseMedia]
                });
            } else if (dataType == "MODB") { // 余额对象
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
                    title: T.T('YYJ400023'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseBalanceObject]
                });
            } else if (dataType == "MODP") { // 产品对象
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
                    title: T.T('YYJ400024'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseProductObject]
                });
            } else if (dataType == "MODG") { // 业务项目
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
                    title: T.T('YYJ400025'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseProductLine]
                });
            } else if (dataType == "ACST") { // 核算状态
                // 弹框查询列表
                $scope.params = {
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
                    title: T.T('YYJ400026'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseAcst]
                });
            } else if (dataType == "EVEN") { // 事件
                // 弹框查询列表
                $scope.params = {
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
                    title: T.T('YYJ400027'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseEvent]
                });
            } else if (dataType == "BLCK") { // 封锁码
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
                    title: T.T('YYJ400028'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseBlockCode]
                });
            } else if (dataType == "AUTX") { // 授权场景
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
                    title: T.T('YYJ400029'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseScenarioList]
                });
            } else if (dataType == "LMND") { // 额度节点
                // 弹框查询列表
                $scope.params = {
                    "operationMode": $rootScope.operationMods,
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
                    title: T.T('YYJ400030'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseQuotaTree]
                });
            } else if (dataType == "CURR") { // 币种
                // 弹框查询列表
                $scope.params = {
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
                    title: T.T('YYJ400027'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseCurrency]
                });
            } else if (dataType == "DELQ") { // 延滞层级
                // 弹框查询列表
                $scope.params = {
                    "pageSize": 10,
                    "indexNo": 0
                };
                // 页面弹出框事件(弹出页面)
                $scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
                    title: T.T('YYJ400031'),
                    buttons: [T.T('F00107'), T.T('F00012')],
                    size: ['1000px', '400px'],
                    callbacks: [$scope.choseDelv]
                });
            }
        };
        $scope.choseCurrency = function(result) {
            if (!result.scope.currencyTable.validCheck()) {
                return;
            }
            $scope.checkedCurrency = result.scope.currencyTable.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedCurrency.currencyCode);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseBlockCode = function(result) {
            if (!result.scope.blockCDScnMgtTable.validCheck()) {
                return;
            }
            $scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedBlockCode.blockCodeType + $scope.checkedBlockCode.blockCodeScene);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseEvent = function(result) {
            if (!result.scope.itemList.validCheck()) {
                return;
            }
            $scope.checkedEvent = result.scope.itemList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedEvent.eventNo);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseBusType = function(result) {
            if (!result.scope.businessTypeList.validCheck()) {
                return;
            }
            $scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedBusinessType.businessTypeCode);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseAcst = function(result) {
            // if (!result.scope.itemList.validCheck()) {
            if (!result.scope.accountStateTable.validCheck()) {
                return;
            }
            $scope.checkedAccountState = result.scope.accountStateTable.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedAccountState.accountingStatus);
            // $scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseProductLine = function(result) {
            if (!result.scope.proLineList.validCheck()) {
                return;
            }
            $scope.checkedProLine = result.scope.proLineList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedProLine.businessProgramNo);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseMedia = function(result) {
            if (!result.scope.mediaObjectList.validCheck()) {
                return;
            }
            $scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedMediaObject.mediaObjectCode);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseBalanceObject = function(result) {
            if (!result.scope.balanceObjectList.validCheck()) {
                return;
            }
            $scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedBalanceObject.balanceObjectCode);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseProductObject = function(result) {
            if (!result.scope.proObjectList.validCheck()) {
                return;
            }
            $scope.checkedProObject = result.scope.proObjectList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedProObject.productObjectCode);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseScenarioList = function(result) {
            if (!result.scope.scenarioList.validCheck()) {
                return;
            }
            $scope.checkedScenario = result.scope.scenarioList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedScenario.authSceneCode);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseQuotaTree = function(result) {
            if (!result.scope.quotaTreeList.validCheck()) {
                return;
            }
            $scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedQuotaTree.creditNodeNo);
            $scope.safeApply();
            result.cancel();
        };
        $scope.choseDelv = function(result) {
            if (!result.scope.delvTable.validCheck()) {
                return;
            }
            $scope.checkedDelv = result.scope.delvTable.checkedList();
            $scope.InstanCodeValue(dataValueCount, $scope.checkedDelv.delinquencyLevel);
            $scope.safeApply();
            result.cancel();
        };
        $scope.InstanCodeValue = function(dataValue, code) {
            if (dataValue == '1') {
                $scope.artifactExampleInf.instanCode1 = code;
            } else if (dataValue == '2') {
                $scope.artifactExampleInf.instanCode2 = code;
            } else if (dataValue == '3') {
                $scope.artifactExampleInf.instanCode3 = code;
            } else if (dataValue == '4') {
                $scope.artifactExampleInf.instanCode4 = code;
            } else if (dataValue == '5') {
                $scope.artifactExampleInf.instanCode5 = code;
            } else if (dataValue == 'base') {
                $scope.pcdExampleInf.baseInstanCode = code;
            } else if (dataValue == 'option') {
                $scope.pcdExampleInf.optionInstanCode = code;
            }
        };
        $scope.choseBaseInstanCodeBtn = function() {
            // 获取基础维度的值
            dataValueCount = 'base';
            $scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
        };
        $scope.choseOptionInstanCodeBtn = function() {
            // 获取可选维度的值
            dataValueCount = 'option';
            $scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
        };
    });
    // 修改
    webApp.controller('linesProductUpdate_busProCtrl',
    function($scope, $stateParams, jfRest, $http, jfGlobal,$timeout,  $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
    	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_linesProduct');
		$translate.refresh();
    	// 额度节点
        $scope.quotaArray = {
            type: "dynamic",
            param: {
                'authDataSynFlag': "1",
                'operationMode': $scope.itemUpdate.operationMode
            },
            // 默认查询条件
            text: "creditDesc",
            // 下拉框显示内容，根据需要修改字段名称
            value: "creditNodeNo",
            // 下拉框对应文本的值，根据需要修改字段名称
            resource: "quotatree.queryList",
            // 数据源调用的action
            callback: function(data) {
                $scope.creditNodeNoInfos = $scope.itemUpdate.creditNodeNo;
            }
        };
    });
	webApp.controller('viewProPriorityCtrl', function($scope, $stateParams, jfRest,$timeout, 
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.balanceObjectListTable = {
//				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'productLine.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	// 交易识别列表55555555555555555
	webApp.controller('transIdentyModeCtrl', function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$rootScope.valueInfo = "";
		//交易识别列表
		$scope.tranIdentyModeList = {
				params : $scope.queryParam = {
						operationMode:$scope.soItem.operationMode,
						businessTypeCode:$scope.soItem.businessTypeCode
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'busTypeTransIden.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	webApp.controller('linesProductCtrl', function($scope, $stateParams, jfRest,$timeout, 
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_linesProduct');
		$translate.refresh();
		//运营模式
		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//产品额度映射查询
		$scope.itemList = {
				params : $scope.queryParam = {
						"authFlag":'0',
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:true,
				resource : 'quotatree.identifyList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//******************************新建业务项目时余额对象设置参数值pcd修改111111111111111***************
	webApp.controller('selectPCDUpdateMODGCtrl',function($scope, $stateParams,$timeout,jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdExampleInf ={};
		$scope.pcdDifExampleInf = {};
		$scope.artifactInfo = $scope.itemsPCD;
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.segmentTypeAddB = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.pcdTypeAddB = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeAddB)',function(event){
			 $scope.pcdTypeAddB = event.value;
		 });
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.indexNoTemp = '';
			$scope.pcdExampleInfUpdate = {};
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	if($scope.pcdInfTable.length < 1){
    				var count = 0;
    				$scope.pcdExampleInfUpdate.segmentSerialNum = count;
    			}else{
    				var count = $scope.pcdInfTable.length;
    				count++;
    				$scope.pcdExampleInfUpdate.segmentSerialNum = count;
    			}
            }
        };
		$scope.pcdInstanShow = true;
		$scope.addButtonShowUpdate = false;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null && $scope.itemsPCD.segmentType!=""){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			if($scope.itemsPCD.pcdInstanList.length < 1){
				$scope.pcdExampleInfUpdate = {};
				$scope.showNewPcdInfoUpdate = true;
			}else{
				$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
			}
		}else if($scope.itemsPCD.pcdInitList!=null){
			if($scope.itemsPCD.pcdInitList.length < 1){
				if($scope.itemsPCD.pcdList!=null){
					if($scope.itemsPCD.pcdList.length < 1){
						$scope.pcdExampleInfUpdate = {};
						$scope.showNewPcdInfoUpdate = true;
					}else{
						$scope.pcdInfTable = $scope.itemsPCD.pcdList;
					}
				}
			}else{
				$scope.pcdInfTable = $scope.itemsPCD.pcdInitList;
			}
		}else if($scope.itemsPCD.pcdList!=null && $scope.itemsPCD.pcdInitList==null && $scope.itemsPCD.pcdInstanList==null){
			if($scope.itemsPCD.pcdList.length < 1){
				$scope.pcdExampleInfUpdate = {};
				$scope.showNewPcdInfoUpdate = true;
			}else{
				$scope.pcdInfTable = $scope.itemsPCD.pcdList;
			}
		}
		else{
			$scope.pcdExampleInfUpdate = {};
			$scope.showNewPcdInfoUpdate = true;
		}
		$scope.proLineInf.deletePcdInstanIdList = [];
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
			//count--;
			if(item.id != null && item.id != undefined && item.id != '' && item.id){
				$scope.proLineInf.deletePcdInstanIdList.push(item.id);
            }
        };
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index+1;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdExampleInfUpdate.pcdPoint|| null== $scope.pcdTypeAddB 
	    			 || null== $scope.pcdExampleInfUpdate.pcdValue 
	    			  ) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				//pcdInfTableInfoU = $(pcdInfTableInfoU,$scope.pcdExampleInf);
				pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
				pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
				pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
				pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
				pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
				pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
				pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeAddB;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				//pcdInfTableInfoU.segmentSerialNum = $scope.indexNoTemp;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;  
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null && $scope.indexNoTemp != ""){
					$scope.pcdInfTable[$scope.indexNoTemp-1].segmentSerialNum = 	$scope.indexNoTemp;
					$scope.pcdInfTable[$scope.indexNoTemp-1].pcdType = 	 $scope.pcdTypeAddB;
					$scope.pcdInfTable[$scope.indexNoTemp-1].segmentValue = 	 $scope.pcdExampleInfUpdate.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp-1].pcdValue = 	 $scope.pcdExampleInfUpdate.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp-1].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp-1].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp-1].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
					$scope.pcdExampleInfUpdate = {};
				}
				$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
				$scope.showNewPcdInfoUpdate = false;
	       };
		  //
		  var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
							title : T.T('YYJ400021'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBusType]
						});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
							title : T.T('YYJ400022'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseMedia]
						});
				}else if(dataType=="MODB"){//余额对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
							title : T.T('YYJ400023'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBalanceObject]
						});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
							title : T.T('YYJ400024'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductObject]
						});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
							title : T.T('YYJ400025'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductLine]
						});
				}else if(dataType=="ACST"){//核算状态
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
							title : T.T('YYJ400026'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseAcst]
						});
				}else if(dataType=="EVEN"){//事件
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseEvent]
						});
				}else if(dataType=="BLCK"){//封锁码
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
							title : T.T('YYJ400028'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBlockCode]
						});
				}else if(dataType=="AUTX"){//授权场景
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
							title : T.T('YYJ400029'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseScenarioList]
						});
				}else if(dataType=="LMND"){//额度节点
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
							title : T.T('YYJ400030'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseQuotaTree]
						});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseCurrency]
						});
				}else if(dataType=="DELQ"){//延滞层级
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
							title : T.T('YYJ400031'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				//if (!result.scope.itemList.validCheck()) {
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
//				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.artifactExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.artifactExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.artifactExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.artifactExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.artifactExampleInf.instanCode5 = code;
				}else if(dataValue=='base'){
					$scope.pcdExampleInf.baseInstanCode = code;
				}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseBaseInstanCodeBtnUpdate = function() {
				//获取基础维度的值
				dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtnUpdate = function() {
				//获取可选维度的值
				dataValueCount ='option';
				$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
			};
	});
	//******************************替换参数100000000***************
	webApp.controller('selectElementNoMODGCtrl',function($scope, $stateParams, $timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.artifactInfo = {};
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTableUpdate = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.itemsNo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	//******************************替换参数***************
	webApp.controller('selectElementNoViewMODGCtrl',function($scope, $stateParams, $timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdInstanShow = false;
		$scope.pcdExampleInf ={};
		var count = 1;
		$scope.artifactInfo = $scope.itemsNo;
		$scope.businessValueArr01= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.baseInstanDimenViewD = $scope.pcdExampleInf.baseInstanDimen;
				}
			};
			$scope.businessValueArr02= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.optionInstanDimenViewD = $scope.pcdExampleInf.optionInstanDimen;
				}
			};		
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeInfoT = $scope.pcdExampleInf.segmentType;
			}
		};
		//新增pcd差异化不显示
		$scope.pcdInfTable = [];
		if(null!=$scope.itemsNo.pcdNo){
			$scope.pcdInstanShow = true;
			$scope.pcdExampleInf.pcdNo = $scope.itemsNo.pcdNo.substring(0,8);
			if($scope.itemsNo.segmentType!=null){//分段类型不为空
				$scope.segmentTypeInfoT =  $scope.itemsNo.segmentType;
				$scope.addButtonShow = true;
			}else{
				$scope.addButtonShow = false;
			}
			if($scope.itemsNo.pcdInstanList!=null){
				$scope.pcdInfTable = $scope.itemsNo.pcdInstanList;
			}else{
				$scope.showNewPcdInfo = true;
			}
		}else{
			$scope.pcdInstanShow = false;
		}
	});
	//****************** 业务类型建立***************
	//业务类型建立2222222222222222222222
	webApp.controller('businessTypePramsMgtProLineCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.transIdenArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_transIden",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.businessNatureArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_businessNature",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		 //	业务形态
		 $scope.businessFormArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"patternDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessForm.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //本金余额对象
		 $scope.prinBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'P',operationMode:$rootScope.operationMods},//默认查询条件 
	        text:"balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //利息余额对象
		 $scope.intBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'I',operationMode:$rootScope.operationMods},//默认查询条件 
	        text: "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //费用余额对象
		 $scope.feeBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'F',operationMode:$rootScope.operationMods},//默认查询条件 
	        text: "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//余额对象列表
		$scope.queryBalanceObject = {
			params : {
				instanFlag:1,
				operationMode:$rootScope.operationMods
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'balanceObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.step1 = true;
		$scope.step2 = false;
		$scope.btnStep1 = true;
		$rootScope.sure = false;
		//点击第一步
		$scope.stepTo2 = function(){
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
  			$scope.step1 = false;
  			$scope.btnStep1 = false;
  			$scope.step2 = true;
  			$scope.busEstN={};
			$scope.busEstN.businessTypeCode = 'MODT'+ $scope.busTypeInfo.businessTypeCodeHalf;
			$scope.busEstN.businessDesc = $scope.busTypeInfo.businessDesc;
			$scope.queryMODT.params.instanDimen1 = "MODT";
			$scope.queryMODT.params.instanCode = $scope.busEstN.businessTypeCode;
			$scope.queryMODT.search();	
			$rootScope.sure = true;
		};
		$scope.stepBack2 = function(){
			$scope.step1 = true;
			$scope.step2 = false;
			$scope.btnStep1 = true;
			$rootScope.sure = false;
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
		//新建余额对象
		$scope.addBalanceObjectb = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/balanceObjectOne.html', ' ', {
				title : T.T('YYJ600013'),
				buttons : [ T.T('F00107'), T.T('F00012')],
				size : [ '1000px', '380px' ],
				callbacks : [$scope.saveBalanceObject]
			});
		};
		$scope.balanceObjInf = {};
		$scope.saveBalanceObject = function(result){
			$scope.balanceObjInf.balanceObjectCode = "MODB"+result.scope.balanceObjInf.balanceObjectCodeHalf;
			$scope.balanceObjInf.operationMode = $rootScope.operationMods;
			$scope.balanceObjInf.beginDate = $("#beginDateId").val();
			$scope.balanceObjInf.endDate = $("#endDateId").val();
			jfRest.request('balanceObject', 'save', $scope.balanceObjInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstan = {};
					$scope.proObjInstan = $scope.balanceObjInf;
					$scope.balanceObjInf = {};
					result.scope.balanceObjOneForm.$setPristine();
					$scope.safeApply();
					result.cancel();
					$scope.queryBalanceObject.search();
				}
			});
		};
		$scope.busTypeInfo = {};
		//查询业务类型实例构件
		$scope.queryMODT = {
				params : $scope.queryParam = {
						instanDimen1 : "MODT",
						//instanCode:$scope.proObjInstanBusTypeInstan.businessTypeCode,
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'artifactExample.querySelectArtifact',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//替换参数
		$scope.updateTypeEstA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title :  T.T('F00138'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTypeEst]
				});
		};
		//设置参数值
		$scope.setTypeEstA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTypeEstTwo]
				});
		};
		$scope.choseElementTypeEst = function(result) {
			if (!result.scope.elementNoTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTable.checkedList();
			$scope.queryMODT.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODT.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODT.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODT.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODT.data[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseElementTypeEstTwo = function(result) {
			$scope.queryMODT.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODT.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODT.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		}
	});
	//****************** 业务类型建立***************
	//****************** 余额对象实例化start***************
	// 余额对象列表查询9999999999999999999
	webApp.controller('balanceObjectOneEstProLQCtrl', function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
			//查询余额对象实例构件
		 $scope.queryMODB = {};
		 $scope.queryMODB = $scope.proObjInstan.busTypeInstanList;
			//产品实例化时，点击设置参数值的方法
			$scope.setSelectAaddPLQ = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.itemsPCD = {};
				$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/product/selectPCDUpdateMODG.html', $scope.itemsPCD, {
						title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00156'),
						buttons : [  T.T('F00107'), T.T('F00012')  ],
						size : [ '1100px', '500px' ],
						callbacks : [$scope.choseSelectTwoAdd]
					}); 
			};
			$scope.choseSelectTwoAdd = function(result) {
				$scope.items = {};
				$scope.queryMODB[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryMODB[$scope.indexNo].pcdInitList = result.scope.pcdInfTable;
				$scope.queryMODB[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				if($rootScope.proBPInstanListPage.length > 0){
					for (var i = 0; i < $rootScope.proBPInstanListPage.length; i++) {
						if($rootScope.proBPInstanListPage[i].balanceObjectCode == $scope.proObjInstan.balanceObjectCode){
							for(var j=0;j<$rootScope.proBPInstanListPage[i].balanceObjectInstan.length;j++){
								if($rootScope.proBPInstanListPage[i].balanceObjectInstan[j].businessTypeCode == $scope.proObjInstan.businessTypeCode){
									$rootScope.proBPInstanListPage[i].balanceObjectInstan[j].busTypeInstanList = $scope.queryMODB;
								}
							}
						}
					}
				}else{
					jfLayer.fail(T.T('YYJ100038'));   //'请刷新页面重新操作！');
				}
				$scope.safeApply();
				result.cancel();
			};
			//产品实例化时，点击替换参数的方法
			$scope.addSelectAUpdate = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.itemsNo = {};
				$scope.itemsNo = $.parseJSON(JSON.stringify(item));
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/product/selectElementNoUpdateMODG.html', $scope.itemsNo, {
						title : T.T('YYJ600015'),
						buttons : [  T.T('F00107'), T.T('F00012')  ],
						size : [ '1100px', '320px' ],
						callbacks : [$scope.choseSelectAadd]
					});
			};
			$scope.choseSelectAadd = function(result) {
				if (!result.scope.elementNoTableUpdate.validCheck()) {
					return;
				}
				$scope.items = {};
				$scope.items = result.scope.elementNoTableUpdate.checkedList();
				$scope.queryMODB[$scope.indexNo].elementNo = $scope.items.elementNo;
				$scope.queryMODB[$scope.indexNo].elementDesc = $scope.items.elementDesc;
				$scope.safeApply();
				result.cancel();
			}
	});
	//****************** 余额对象实例化end***************
	//****************** 业务项目修改时余额对象实例化start***************
	webApp.controller('balanceObjectOneEstUpdateCtrl', function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.objectTypeArr = [{name:T.T('YYJ600001'),id:"P"},{name:T.T('YYJ600002'),id:"I"},{name:T.T('YYJ600003'),id:"F"}];//
		 //利息入账余额对象
		 $scope.interestPostingBalanceObjectArr ={ 
			        type:"dynamic", 
			        param:{objectType:'I',operationMode:$rootScope.operationMods},//默认查询条件 
			        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
			        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"balanceObject.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
			//查询余额对象实例构件
		 $scope.queryMODBUpdate = {};
		 $scope.queryMODBUpdate = $scope.proObjInstan.busTypeInstanList;
		 $scope.queryMODB = {};
		 $scope.queryMODB = $scope.proObjInstan.busTypeInstanList;
			//产品实例化时，点击设置参数值的方法
			$scope.setSelectAadd = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.itemsPCD = {};
				$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/product/selectPCDUpdateMODG.html', $scope.itemsPCD, {
						title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00156'),
						buttons : [  T.T('F00107'), T.T('F00012')  ],
						size : [ '1100px', '500px' ],
						callbacks : [$scope.choseSelectTwoUpdateAdd]
					}); 
			};
			$scope.choseSelectTwoUpdateAdd = function(result) {
				$scope.items = {};
				$scope.queryMODBUpdate[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryMODBUpdate[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
//				$scope.queryMODBUpdate[$scope.indexNo].pcdInitList = result.scope.pcdInfTable;
				$scope.queryMODBUpdate[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODBUpdate[$scope.indexNo].addPcdFlag = "1";
				if($rootScope.busTypeBPList.length > 0){
					for (var i = 0; i < $rootScope.busTypeBPList.length; i++) {
						if($rootScope.busTypeBPList[i].balanceObjectCode == $scope.proObjInstan.balanceObjectCode){
							for(var j=0;j<$rootScope.busTypeBPList[i].instanList.length;j++){
								if($rootScope.busTypeBPList[i].instanList[j].businessTypeCode == $scope.proObjInstan.businessTypeCode){
									$rootScope.busTypeBPList[i].instanList[j].busTypeInstanList = $scope.queryMODBUpdate;
								}
							}
						}
					}
				}else{
					jfLayer.fail('请刷新页面重新操作！');
				}
				$scope.safeApply();
				result.cancel();
			};
			//产品实例化时，点击替换参数的方法
			$scope.addSelectAUpdate = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.itemsNo = {};
				$scope.itemsNo = $.parseJSON(JSON.stringify(item));
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/product/selectElementNoUpdateMODG.html', $scope.itemsNo, {
						title : T.T('YYJ600015'),
						buttons : [  T.T('F00107'), T.T('F00012')  ],
						size : [ '1100px', '320px' ],
						callbacks : [$scope.choseSelectAadd]
					});
			};
			$scope.choseSelectAadd = function(result) {
				if (!result.scope.elementNoTableUpdate.validCheck()) {
					return;
				}
				$scope.items = {};
				$scope.items = result.scope.elementNoTableUpdate.checkedList();
				$scope.queryMODBUpdate[$scope.indexNo].elementNo = $scope.items.elementNo;
				$scope.queryMODBUpdate[$scope.indexNo].elementDesc = $scope.items.elementDesc;
				if($rootScope.busTypeBPList.length > 0){
					for (var i = 0; i < $rootScope.busTypeBPList.length; i++) {
						if($rootScope.busTypeBPList[i].balanceObjectCode == $scope.proObjInstan.balanceObjectCode){
							for(var j=0;j<$rootScope.busTypeBPList[i].instanList.length;j++){
								if($rootScope.busTypeBPList[i].instanList[j].businessTypeCode == $scope.proObjInstan.businessTypeCode){
									$rootScope.busTypeBPList[i].instanList[j].busTypeInstanList = $scope.queryMODBUpdate;
								}
							}
						}
					}
				}else{
					jfLayer.fail('请刷新页面重新操作！');
				}
				$scope.safeApply();
				result.cancel();
			}
	});
	//****************** 余额对象实例化end1222222222222***************
	//业务类型建立
	webApp.controller('porLineModCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translate.refresh();
		//查询业务类型实例构件
		$scope.influenceList = {
			params : $scope.queryParam = {
					businessProgramNo : $scope.InfluenceInf.businessProgramNo,
					operationMode : $scope.InfluenceInf.operationMode,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery :true,
			resource : 'productLine.influence',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});	
	//余额对象实例化(新增时)7777777777777777
	webApp.controller('proBalanceObjectCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		// 余额对象实例列表（业务类型）
		$scope.queryProBalanceObject = {
			params : {
				instanFlag : 1,
				balanceObjectCodelist:$scope.valueBT.balanceObjectCodelist,
				businessProgramNo: $scope.valueBT.businessProgramNo,
				businessTypeCodeList: $scope.valueBT.businessTypeCodeList,
				operationMode: $scope.valueBT.operationMode
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			autoQuery : true,
			resource : 'businessType.query',// 列表的资源 
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				$scope.proBPInstanList = {};
				$scope.proBPInstanList.balanceObjectInstan = data.returnData.rows;
				$scope.proBPInstanList.balanceObjectCode = $scope.valueBT.balanceObjectCode;
				$scope.proBPInstanList.objectDesc = $scope.valueBT.objectDesc;
				$rootScope.proBPInstanListPage.push($scope.proBPInstanList);
				console.log($rootScope.proBPInstanListPage);
			}
		};
		//点击配置参数==========余额对象实例化
		$scope.setBalanceSelectA = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.proObjInstan = {};
				$scope.proObjInstan = $scope.queryProBalanceObject.data[$index];
				$scope.proObjInstan.balanceObjectCode = $scope.valueBT.balanceObjectCode;
				$scope.proObjInstan.objectDesc = $scope.valueBT.objectDesc;
				$scope.proObjInstan.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/publicMode/balanceObjectOneEstProLQ.html', $scope.proObjInstan, {
					title : T.T('YYJ600014'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.saveElementInfo]
				});
		};
		$scope.saveElementInfo = function(result){
			$scope.safeApply();
			result.cancel();
		};
	});	
	//余额对象实例化(查看时可以修改)8888888888888888888
	webApp.controller('proBalanceObjectUpdateCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.queryProBalanceObjectInfo = [];
		// 余额对象实例列表（业务类型）
		$scope.queryProBalanceObjectInfo = $scope.valueBTInfo.balanceObjectInstan;
		//点击配置参数==========余额对象实例化
		$scope.setBalanceUpdateA = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.proObjInstan = {};
				$scope.proObjInstan = $.parseJSON(JSON.stringify(item));
				$scope.proObjInstan.balanceObjectCode = $scope.valueBTInfo.balanceObjectCode;
				$scope.proObjInstan.objectDesc = $scope.valueBTInfo.objectDesc;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/publicMode/balanceObjectOneEstProLQ.html', $scope.proObjInstan, {
					title : T.T('YYJ600014'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.saveElementInfo]
				});
		};
		$scope.saveElementInfo = function(result){
			$scope.safeApply();
			result.cancel();
		};
	});	
	//余额对象实例化(修改时的新增时)
	webApp.controller('proBalanceObjectUpdateAddCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.queryParam01 = {
			type: "DROPDOWNBOX",
			groupsCode : "dic_businessNature",
			queryFlag : "children"
		};
		jfRest.request('paramsManage', 'query',$scope.queryParam01).then(
		function(data) {
			$scope.businessDebitCreditCodeList = [];
			$scope.businessDebitCreditCodeList = data.returnData.rows;
		});
		// 余额对象实例列表（业务类型）
		$scope.queryPBObAParams = {};
		$scope.queryPBObAParams.instanFlag = 1;
		$scope.queryPBObAParams.balanceObjectCodelist = $scope.valueBTUpdate.balanceObjectCodelist;
		$scope.queryPBObAParams.businessProgramNo = $scope.valueBTUpdate.businessProgramNo;
		$scope.queryPBObAParams.businessTypeCodeList = $scope.valueBTUpdate.businessTypeCodeList;
		$scope.queryPBObAParams.operationMode = $scope.valueBTUpdate.operationMode;
		jfRest.request('businessType', 'query', $scope.queryPBObAParams).then(function(data) {
            if (data.returnCode == '000000') {
            	$scope.proBPNewInstanList = {};
				$scope.proBPNewInstanList.instanList = data.returnData.rows;
				if($scope.businessDebitCreditCodeList.length > 0){
					for(var i=0;i<$scope.businessDebitCreditCodeList.length;i++){
						for(var j=0;j<$scope.proBPNewInstanList.instanList.length;j++){
							if($scope.businessDebitCreditCodeList[i].codes == $scope.proBPNewInstanList.instanList[j].businessDebitCreditCode){
								$scope.proBPNewInstanList.instanList[j].businessDebitCreditCodeDesc = $scope.businessDebitCreditCodeList[i].detailDesc;
							}
						}
					}
				}
				$scope.proBPNewInstanList.balanceObjectCode = $scope.valueBTUpdate.balanceObjectCode;
				$scope.proBPNewInstanList.objectDesc = $scope.valueBTUpdate.objectDesc;
				$scope.proBPNewInstanList.businessProgramNo = $scope.valueBTUpdate.businessProgramNo;
				$scope.proBPNewInstanList.operationMode = $scope.valueBTUpdate.operationMode;
				$rootScope.busTypeBPList.push($scope.proBPNewInstanList);
				for(var i=0;i<$rootScope.busTypeBPList.length;i++){
					if($rootScope.busTypeBPList[i].balanceObjectCode == $scope.valueBTUpdate.balanceObjectCode){
						$scope.queryProBalanceObjectAdd = $rootScope.busTypeBPList[i].instanList;
					}
				}
            }
        });
		//点击配置参数==========余额对象实例化
		$scope.setBalanceAdd = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.proObjInstan = {};
				$scope.proObjInstan = $.parseJSON(JSON.stringify(item));
				$scope.proObjInstan.balanceObjectCode = $scope.valueBTUpdate.balanceObjectCode;
				$scope.proObjInstan.objectDesc = $scope.valueBTUpdate.objectDesc;
				//$scope.proObjInstan.instanBCode1 = $scope.busTypeInfo.businessTypeCodeHalf;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/balanceObjectOneEstUpdate.html', $scope.proObjInstan, {
					title : T.T('YYJ600014'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.saveElementInfo]
				});
		};
		$scope.saveElementInfo = function(result){
			$scope.safeApply();
			result.cancel();
		};
	});	
	//余额对象实例化(修改时查看余额对象实例化时可以修改)
	webApp.controller('proBalanceObjectUpdateInfoCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		// 余额对象实例列表（业务类型）
		$scope.queryProBalanceObjectInfoUpdate = $scope.valueBTUpdate.instanList;
		//点击配置参数==========余额对象实例化
		$scope.setBalanceUpdateInfoA = function(item,$index){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.proObjInstan = {};
				$scope.proObjInstan = $.parseJSON(JSON.stringify(item));
				$scope.proObjInstan.balanceObjectCode = $scope.valueBTUpdate.balanceObjectCode;
				$scope.proObjInstan.objectDesc = $scope.valueBTUpdate.objectDesc;
				//$scope.proObjInstan.instanBCode1 = $scope.busTypeInfo.businessTypeCodeHalf;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/balanceObjectOneEstUpdate.html', $scope.proObjInstan, {
					title : T.T('YYJ600014'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.saveElementInfo]
				});
		};
		$scope.saveElementInfo = function(result){
			$scope.queryProBalanceObjectInfoUpdate[$scope.indexNo].busTypeInstanList = result.scope.queryMODBUpdate;
			$scope.safeApply();
			result.cancel();
		};
	});	
	//余额对象实例化(查询详情)
	webApp.controller('proBalanceObjectInfoCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		 //余额对象参数选项
		$scope.balanceObjectInfo = {
			params : {
				instanCode:$scope.valueBTInfo.balanceObjectCode,
				operationMode:$scope.valueBTInfo.operationMode,
				instanCodeList:$scope.valueBTInfo.instanListType,
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//余额对象构件实例====详情
		$scope.queryArtifactBP = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
				title : T.T('F00041') +$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +T.T('F00156'),
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};
	});
	// 余额对象建立6666666666666666666666
	webApp.controller('balanceObjectEstCtrl',function($scope, $stateParams,jfRest, $http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate,$translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.balanceObjInf = {};
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {}
			};
		// 运营模式
		$scope.operationModeArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "operationMode.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//利息入账余额对象 
		$scope.PostingBalanceObjectArr = {};
		var form = layui.form;
		form.on('select(getOperationModeBOEAdd)',function(event){
			//查询运营模式下的余额对象
			 //利息入账余额对象 
			$scope.PostingBalanceObjectArr = {
				type : "dynamicDesc",
				param : {
					operationMode : event.value
				},// 默认查询条件
				text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
				desc : "objectDesc",
				value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "balanceObject.query",// 数据源调用的action
				callback : function(data) {
				}
			};
		});
		// 日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem : '#LAY_start_Obj',
				min : Date.now(),
				done : function(value, date) {
					endDate.config.min = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					endDate.config.start = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
				}
			});
			var endDate = laydate.render({
				elem : '#LAY_end_Obj',
				// min:Date.now(),
				done : function(value, date) {
					startDate.config.max = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					}
				}
			});
		});
		// 日期控件end
	});
	//查看余额对象实例化pcd信息
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeInfoD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.itemArtifact.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.segmentTypeInfoD =  data.returnData.rows[0].segmentType;
					$scope.pcdInstanList = [];
					$scope.pcdInstanList.push(data.returnData.rows[0].pcdInitList);
					$scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
      //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	 //pcd差异列表
           $scope.pcdInfTable = [];
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.itemArtifact.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.itemArtifact.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.itemArtifact.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.itemArtifact.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.itemArtifact.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.itemArtifact.instanCode5;
    	   $scope.queryPcdExample.addPcdFlag = '2';
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }else if($scope.pcdInstanList.length > 0){
    				   $scope.pcdInfTable = $scope.pcdInstanList[0];
    			   }
    		   }
    	   });
       }
	});
	
	
	// 收费项目实例
	webApp.controller('busiLayerProExampleCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, 
	jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");   
		$scope.methodShow = false;
		$scope.isFeeTypeISTF = false;   //费用收取方式
		
		$rootScope.payProExampleaddInf = $scope.payProExampleadd;
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//计费方式 F：固定金额 M：费用矩阵
		$scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.assessmentMethod = $scope.payProExampleadd.assessmentMethod;
	        }
		};
		//矩阵应用方式 S：全额套档 P：超额累进
		$scope.matrixAppModeArry ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matrixAppMode",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//费用矩阵应用维度1：金额 2：延滞天数
		$scope.feeMatrixApplicationDimensionArry  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeMatrixApplicationDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	       }
		};
		 //费用标识 D：数值/金额  P：百分比
		$scope.feeFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_feeFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 //匹配关系 AND/OR 
		$scope.matchRelationArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_matchRelation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                
	        }
		};
		//维度取值1 
		$scope.instanDimenArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_instanceDimension",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.instanDimen1 = $scope.payProExampleadd.instanCode1;
				$scope.instanDimen2 = $scope.payProExampleadd.instanCode2;
				$scope.instanDimen3 = $scope.payProExampleadd.instanCode3;
				$scope.instanDimen4 = $scope.payProExampleadd.instanCode4;
				$scope.instanDimen5 = $scope.payProExampleadd.instanCode5;
				setTimeout(function(){
					$scope.payProExampleadd.instanCode1 = "";
					$scope.payProExampleadd.instanCode2 = "";
					$scope.payProExampleadd.instanCode3 = "";
					$scope.payProExampleadd.instanCode4 = "";
					$scope.payProExampleadd.instanCode5 = "";
					$scope.payProExampleadd.instanCode1 = $scope.payProExampleadd.businessProgramNo;
			    } ,0.1);//延时3秒后执行 
				
				
			}
		};	
		//分期费用收取方式 0: 一次性收取，1：分期收取
		$scope.feeCollectTypeArr ={ 
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
		//免除周期
		$scope.waiveCycleArr={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_waiveCycle",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//根据计费方式更改显示
		$scope.payProExampleInf2 ={};
		if($scope.payProExampleadd.assessmentMethod =="M" || $scope.payProExampleadd.feeType =="ANNF" ){
			$scope.methodShow = true;
		}else{
			$scope.methodShow = false;
			$scope.payProExampleInf2 ={};
		}
		if($scope.payProExampleadd.feeType == 'ISTF'){
			$scope.isFeeTypeISTF = true;   //费用收取方式
		}else{
			$scope.isFeeTypeISTF = false;   //费用收取方式
		}
		if($scope.payProExampleadd.feeItemNo == "LCHG025"){
			$("#feeMatrixApplicationDimension ").val(""); 
			$("#feeMatrixApplicationDimension").attr("disabled", false);
		}
		else{
			$("#feeMatrixApplicationDimension").attr("disabled", true);
			$("#feeMatrixApplicationDimension").val(1);
			$scope.payProExampleadd.feeMatrixApplicationDimension = "1";
		}
		//验证收费项目编号
		$scope.checkValidate = function() {
			//Xif($scope.payProExampleadd.feeItemNo == '' || $scope.payProExampleadd.feeItemNo  == undefined){
			if(!$scope.payProExampleadd.feeItemNo ){
				jfLayer.fail(T.T('YYJ1300016'));
			}
		};
		var dataValueCount;
		$scope.choseInstanCode1Btn = function() {
			//获取维度取值1的值
			$scope.checkValidate();
			dataValueCount =1;
			$scope.chosedInstanCode($scope.instanDimen1);
		};
		$scope.choseInstanCode2Btn = function() {
			$scope.checkValidate();
			//获取维度取值2的值
			dataValueCount =2;
			$scope.chosedInstanCode($scope.instanDimen2);
		};
		$scope.choseInstanCode3Btn = function() {
			$scope.checkValidate();
			//获取维度取值3的值
			dataValueCount =3;
			$scope.chosedInstanCode($scope.instanDimen3);
		};
		$scope.choseInstanCode4Btn = function() {
			$scope.checkValidate();
			//获取维度取值4的值
			dataValueCount =4;
			$scope.chosedInstanCode($scope.instanDimen4);
		};
		$scope.choseInstanCode5Btn = function() {
			$scope.checkValidate();
			//获取维度取值5的值
			dataValueCount =5;
			$scope.chosedInstanCode($scope.instanDimen5);
		};
		//分期实例代码
		$scope.choseInstanCode6Btn = function() {
			$scope.checkValidate();
			//获取维度取值6的值
			dataValueCount =6;
			$scope.chosedInstanCode($scope.instanDimen6);
		};
		//dataType维度取值，dataValue第几个实例代码
		$scope.chosedInstanCode = function(dataType) {
			if(!$scope.payProExampleadd.operationMode){
				jfLayer.fail(T.T("YYJ1300067"));
				return;
			}
			if(dataType=="MODT"){//业务类型
				//弹框查询列表
				$scope.params = {
						"operationMode" : $scope.payProExampleadd.operationMode,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseBusinessType_busPro.html', $scope.params, {
						title : T.T('YYJ1300017'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBusType]
					});
			}else if(dataType=="MODM"){//媒介对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $scope.payProExampleadd.operationMode,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseMediaObject_busPro.html', $scope.params, {
						title : T.T('YYJ1300018'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseMedia]
					});
			}else if(dataType=="MODP"){//产品对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $scope.payProExampleadd.operationMode,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseProductObject_busPro.html', $scope.params, {
						title : T.T('YYJ1300019'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductObject]
					});
			}else if(dataType=="CURR"){//币种
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseCurrency_busPro.html', $scope.params, {
						title : T.T('YYJ1300020'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseCurrency]
					});
			}else if(dataType =="CHAN"){//渠道
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseChannel_busPro.html', $scope.params, {
						title : T.T('YYJ1300021'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '600px' ],
						callbacks : [$scope.choseChannel]
					});
			}else if(dataType =="TERM"){//期数
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseTerm_busPro.html', $scope.params, {
						title : T.T('YYJ1300022'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseTerm]
					});
			}else if(dataType=="MODG"){//业务项目
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseProductLine_busPro.html', $scope.params, {
						title : T.T('YYJ1300024'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductLine]
					});
			}else if(dataType=="INST"){//分期类型
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseStageType_busPro.html', $scope.params, {
						title : T.T('YYJ1300070'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseStageType]
					});
			}else if(dataType=="FTYP"){//费用收取方式
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/choseFeeType_busPro.html', $scope.params, {
						title : T.T('YYJ1300071'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseFeeType]
					});
			}
		};
		//业务类型确定
		$scope.choseBusType = function(result){
			if (!result.scope.businessTypeList.validCheck()) {
				return;
			}
			$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
			$scope.safeApply();
			result.cancel();
		};
		//媒介对象确定
		$scope.choseMedia = function(result){
			if (!result.scope.mediaObjectList.validCheck()) {
				return;
			}
			$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		//产品对象确定
		$scope.choseProductObject = function(result){
			if (!result.scope.proObjectList.validCheck()) {
				return;
			}
			$scope.checkedProObject = result.scope.proObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		//币种确实
		$scope.choseCurrency = function(result){
			if (!result.scope.currencyTable.validCheck()) {
				return;
			}
			$scope.checkedCurrency = result.scope.currencyTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
			$scope.safeApply();
			result.cancel();
		};
		//期数确定
		$scope.choseTerm = function(result){
			if (!result.scope.termTable.validCheck()) {
				return;
			}
			$scope.checkedTerm = result.scope.termTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedTerm.termNo);
			$scope.safeApply();
			result.cancel();
		};
		//延滞层级
		$scope.choseDelv = function(result){
			if (!result.scope.delvTable.validCheck()) {
				return;
			}
			$scope.checkedDelv = result.scope.delvTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.collectionValue);
			$scope.safeApply();
			result.cancel();
		};
		//业务项目
		$scope.choseProductLine = function(result){
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedProLine = result.scope.proLineList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
			$scope.safeApply();
			result.cancel();
		};
		//渠道确定
		$scope.choseChannel= function(result){
			if (!result.scope.channelTable.validCheck()) {
				return;
			}
			$scope.checkedChannel = result.scope.channelTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedChannel.transOrigin);
			$scope.safeApply();
			result.cancel();
		};
		//分期类型确定
		$scope.choseStageType= function(result){
			if (!result.scope.stageTypeTable.validCheck()) {
				return;
			}
			$scope.checkedStageType= result.scope.stageTypeTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedStageType.stageTpyeCode);
			$scope.safeApply();
			result.cancel();
		};
		//费用收取方式确定
		$scope.choseFeeType= function(result){
			if (!result.scope.feeTypeTable.validCheck()) {
				return;
			}
			$scope.checkedFeeType= result.scope.feeTypeTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedFeeType.feeTpyeCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.InstanCodeValue = function(dataValue,code) {
			if(dataValue=='1'){
				$scope.payProExampleadd.instanCode1 = code;
			}else if(dataValue=='2'){
				$scope.payProExampleadd.instanCode2 = code;
			}else if(dataValue=='3'){
				$scope.payProExampleadd.instanCode3 = code;
			}else if(dataValue=='4'){
				$scope.payProExampleadd.instanCode4 = code;
			}else if(dataValue=='5'){
				$scope.payProExampleadd.instanCode5 = code;
			}else if(dataValue=='6'){
				$scope.payProExampleadd.instanCode6 = code;
			}
		};
		var form = layui.form;
		form.on('select(method)',function(event){
			if($scope.assessmentMethod =="M" || $scope.payProExampleadd.feeType =="ANNF" ){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
				$scope.payProExampleInf2 ={};
			}
		});
	});//收费项目实例
	
	webApp.controller('choseFeeItem_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.feeListTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'feeProject.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//业务类型
	webApp.controller('choseBusinessType_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//业务类型列表
		$scope.businessTypeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessType.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//业务项目
	webApp.controller('choseProductLine_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		//业务项目列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//媒介对象
	webApp.controller('choseMediaObject_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translate.refresh();
		//媒介对象列表
		$scope.mediaObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//产品对象
	webApp.controller('choseProductObject_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translate.refresh();
		//产品對象列表
		$scope.proObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//币种
	webApp.controller('choseCurrency_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//货币列表
		$scope.currencyTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//渠道
	webApp.controller('choseChannl_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//货币列表
		$scope.channelTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0,
					flag:  'N',
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'tradingSourceInterface.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//期数
	webApp.controller('choseTerm_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//货币列表
		$scope.termTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'term.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//延滞层级
	webApp.controller('choseDelv_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.delvTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'delv.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
	//分期类型
	webApp.controller('choseStageType_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.stageTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'stageType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
	//费用收取方式
	webApp.controller('choseFeeType_busProCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.feeTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'feeType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
});
