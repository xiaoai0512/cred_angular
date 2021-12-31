'use strict';
define(function(require) {
	var webApp = require('app');
	//封锁码查询及维护
	webApp.controller('blockCodeQueryCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
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
		   	   		if($scope.eventList.search('COS.IQ.02.0023') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0023') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0023') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
  		//查看还款优先级
		$scope.choseBtnPriority = function() {
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/blockCode/viewBlockPriority.html', $scope.params, {
				title : T.T('YYJ700020'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
  		//運營模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级G:业务项目*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   			}
   		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.blockCodeList = {
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'blockCode.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_effectiveScope'],//查找数据字典所需参数
			transDict : ['effectivenessCodeScope_effectivenessCodeScopeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkBolckCode = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.blockCodeItem = {};
			$scope.blockCodeItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/blockCode/viewBlockCode.html', $scope.blockCodeItem, {
				title : T.T('YYJ700019'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateBolckCode = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.blockCodeItem = {};
			$scope.blockCodeItem = $.parseJSON(JSON.stringify(item));
			$scope.updateOperationMode = item.operationMode;
			$scope.modal('/a_operatMode/blockCode/updateBlockCode.html', $scope.blockCodeItem, {
				title : T.T('YYJ700013'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : [$scope.saveBlockCodeInf]
			});
		};
		//修改回调保存
		$scope.saveBlockCodeInf = function (result){
			if($rootScope.s43ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ700022"));
				 return;
			 }
			$scope.blockCodeUpdate = {};
			$scope.blockCodeUpdate = result.scope.blockCodeItem;
			$scope.blockCodeUpdate.effectivenessCodeScope = result.scope.effectivenessCodeScope;
			$scope.blockCodeUpdate.effectivenessCodeType = result.scope.effectivenessCodeType;
			$scope.blockCodeUpdate.operationMode = result.scope.updateOperationModeInfo;
			$scope.ListPrice = {};
			$scope.ListBlockPrice = [];
			if($rootScope.s43ListResult){
				if($rootScope.s43ListResult.length > 0){
					for(var i=0;i<$rootScope.s43ListResult.length;i++){
						$scope.ListPrice = {operationMode:$rootScope.s43ListResult[i].operationMode,effectivenessCodeType:$rootScope.s43ListResult[i].effectivenessCodeType,effectivenessCodeScene:$rootScope.s43ListResult[i].effectivenessCodeScene,controlProjectNo:$rootScope.s43ListResult[i].controlProjectNo,projectType:0};
						$scope.ListBlockPrice.push($scope.ListPrice);
					}
				}
			}
			if($rootScope.s45ListResult){
				if($rootScope.s45ListResult.length > 0){
					for(var i=0;i<$rootScope.s45ListResult.length;i++){
						$scope.ListPrice = {operationMode:$rootScope.s45ListResult[i].operationMode,effectivenessCodeType:$rootScope.s45ListResult[i].effectivenessCodeType,effectivenessCodeScene:$rootScope.s45ListResult[i].effectivenessCodeScene,controlProjectNo:$rootScope.s45ListResult[i].controlProjectNo,projectType:1};
						$scope.ListBlockPrice.push($scope.ListPrice);
					}
				}
			}
			$scope.blockCodeUpdate.list = $scope.ListBlockPrice;
			jfRest.request('blockCode', 'update', $scope.blockCodeUpdate)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $rootScope.s45ListResult = [];
					 $rootScope.s43ListResult = [];
					 $scope.blockCodeList.search();
				}
			});
		};
		//新增
		$scope.blockCodeAdd = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/blockCode/blockCodeEst.html','', {
				title : T.T('YYJ700018'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '560px' ],
				callbacks : [$scope.saveBlockCode]
			});
		};
		//新增==========保存
		$scope.saveBlockCode = function(result){
			if(!result.scope.isInfo){
				jfLayer.fail(T.T("F00086"));
				 return;
			}
			 $scope.blockCodeInf = {};
			$scope.blockCodeInf = result.scope.blockCodeInf;
			$scope.effectivenessCodeSceneInt = parseInt($scope.blockCodeInf.effectivenessCodeScene); 
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S2ListResult = [];
			 $("#s14 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s13){
				 for(var w=0;w<$rootScope.s13.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s13[w].controlProjectNo == $scope.arr2[t]){
							//$scope.S2List = $rootScope.s13[w];
							$scope.S2List = {operationMode:$rootScope.s13[w].operationMode,effectivenessCodeType:$scope.blockCodeInf.effectivenessCodeType,effectivenessCodeScene:$scope.effectivenessCodeSceneInt,controlProjectNo:$rootScope.s13[w].controlProjectNo,projectType:0};
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			 if($scope.S2ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ700022"));
				 return;
			 }
			 	$scope.arr4 = [];
				$scope.S4List = {};
				 $("#s26 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr4.push(vall);
			    });
				 if($rootScope.s25){
					 for(var w=0;w<$rootScope.s25.length;w++){
						 for(var t=0;t<$scope.arr4.length;t++){
							if($rootScope.s25[w].pricingTag == $scope.arr4[t]){
								//$scope.S4List = $rootScope.s25[w];
								$scope.S4List = {operationMode:$rootScope.s25[w].operationMode,effectivenessCodeType:$scope.blockCodeInf.effectivenessCodeType,effectivenessCodeScene:$scope.effectivenessCodeSceneInt,controlProjectNo:$rootScope.s25[w].pricingTag,projectType:1};
								$scope.S2ListResult.push($scope.S4List);
							}
						 }
					 }
				 }
				 /*if($scope.S4ListResult.length == 0){
					 jfLayer.fail("请关联定价标签！");
					 return;
				 }*/
			$scope.blockCodeInf.operationMode = result.scope.operationMode;
			$scope.blockCodeInf.list = $scope.S2ListResult;
			$scope.blockCodeInf.effectivenessCodeScene = $scope.effectivenessCodeSceneInt;
			console.log($scope.blockCodeInf);
			jfRest.request('blockCode','save', $scope.blockCodeInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.proObjInstan = $scope.blockCodeInf;
					$scope.blockCodeInf = {};
					result.scope.blockCodeInfForm.$setPristine();
					$scope.blockCodeList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	webApp.controller('viewBlockCodeCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewOperationMode = $scope.blockCodeItem.operationMode;
	        }
	    };
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.effectivenessCodeType = $scope.blockCodeItem.effectivenessCodeType;
			}
		};
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   				$scope.effectivenessCodeScope = $scope.blockCodeItem.effectivenessCodeScope;
   			}
   		};
		//构件实例列表
		$scope.artifactTable = {
			params : {
					"operationMode" :$scope.blockCodeItem.operationMode,
					"instanCode" :$scope.blockCodeItem.blockCodeType+$scope.blockCodeItem.blockCodeScene,
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//已关联的管控项目
		$scope.controlProjectList = {
			params : $scope.queryParam = {
					operationMode : $scope.blockCodeItem.operationMode,
					effectivenessCodeType : $scope.blockCodeItem.effectivenessCodeType,
					effectivenessCodeScene : $scope.blockCodeItem.effectivenessCodeScene,
					projectType:0,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'blockCode.queryRelateControlItem',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_controlAndControl'],//查找数据字典所需参数
			transDict : ['controlMode_controlModeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询管控项目关联的事件编号
		$scope.checkBolckCodeEvent = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.blockCodeEvent = {};
			$scope.blockCodeEvent = $.parseJSON(JSON.stringify(item));
			console.log($scope.blockCodeEvent);
			$scope.modal('/a_operatMode/blockCode/viewAssociatedEvents.html', $scope.blockCodeEvent, {
				title : T.T('YYJ700026'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
		//已关联的定价标签
		$scope.controlBlockList = {
			params : $scope.queryParam = {
					operationMode : $scope.blockCodeItem.operationMode,
					effectivenessCodeType : $scope.blockCodeItem.effectivenessCodeType,
					effectivenessCodeScene : $scope.blockCodeItem.effectivenessCodeScene,
					projectType:1,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'blockCode.queryRelateControlItem',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('updateBlockCodeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T,$timeout) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$rootScope.s45ListResult = [];
		$rootScope.s43ListResult = [];
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.effectivenessCodeType = $scope.blockCodeItem.effectivenessCodeType;
			}
		};
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   				$scope.effectivenessCodeScope=$scope.blockCodeItem.effectivenessCodeScope;
   			}
   		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.updateOperationModeInfo = $scope.updateOperationMode;
	        }
	    };
		//***********************管控项目列表***********************
		$("#s43 option").remove();
		 $("#s44 option").remove();
		$scope.setparamss = {
				operationMode : $scope.updateOperationMode,
		};
		jfRest.request('controlProject', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s43 = {};
			$rootScope.s43 = data.returnData.rows;
			console.log(a);
			$scope.queryParam = {
				operationMode : $scope.blockCodeItem.operationMode,
				effectivenessCodeType : $scope.blockCodeItem.effectivenessCodeType,
				effectivenessCodeScene : $scope.blockCodeItem.effectivenessCodeScene,
				projectType:0
			};
			jfRest.request('blockCode', 'queryRelateControlItem', $scope.queryParam)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.s43ListResult = [];
						 for(var t=0;t<n.length;t++){
							$rootScope.s43ListResult.push(n[t]);
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s44").append("<option value='"+n[i].controlProjectNo+"'>"+n[i].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].controlDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].controlProjectNo==a[j].controlProjectNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s43").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s43").append("<option value='"+a[i].controlProjectNo+"'>"+a[i].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].controlDesc+"</option>"); 
					  }
				   }
			});
		});
		 /*----根据修改业务项目，和描述查询----*/
	 	$scope.queryProjectList = function(){
			 $("#s43").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				controlProjectNo: $scope.blockCodeItem.controlProjectNo,
				controlDesc: $scope.blockCodeItem.controlDesc
		 	};
			 jfRest.request('controlProject', 'query', $scope.setparamss).then(function(data) {
			 	var a =data.returnData.rows;
	 			$scope.arr02 = [];
				$("#s44 option").each(function () {
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
					    	if(n[i]==a[j].controlProjectNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s43").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
				    	}
                    }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s43").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
					   }
			      }
			});
 		};
		/*----end修改业务项目，和描述查询 ----*/
		//功能分配菜单
		$("#s43").dblclick(function(){  
			 var alloptions = $("#s43 option");  
			 var so = $("#s43 option:selected");  
			 $("#s44").append(so);
			$scope.arr7 = [];
			$scope.s43List = {};
			$rootScope.s43ListResult = [];
			 $("#s44 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr7.push(vall);
		    });
			 if($rootScope.s43){
				 for(var w=0;w<$rootScope.s43.length;w++){
					 for(var t=0;t<$scope.arr7.length;t++){
						if($rootScope.s43[w].controlProjectNo == $scope.arr7[t]){
							$scope.s43List = {operationMode:$rootScope.s43[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s43[w].controlProjectNo,projectType:0};
							$scope.s43ListResult.push($scope.s43List);
							//$scope.s43List = $rootScope.s43[w];
							//$rootScope.s43ListResult.push($scope.s43List);
						}
					 }
				 }
			 }
		});  
		$("#s44").dblclick(function(){  
			 var alloptions = $("#s44 option");  
			 var so = $("#s44 option:selected");  
			 $("#s43").append(so);  
			 $scope.arr7 = [];
				$scope.s43List = {};
				$rootScope.s43ListResult = [];
				 $("#s44 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr7.push(vall);
			    });
				 if($rootScope.s43){
					 for(var w=0;w<$rootScope.s43.length;w++){
						 for(var t=0;t<$scope.arr7.length;t++){
							if($rootScope.s43[w].controlProjectNo == $scope.arr7[t]){
								$scope.s43List = {operationMode:$rootScope.s43[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s43[w].controlProjectNo,projectType:0};
								$scope.s43ListResult.push($scope.s43List);
							}
						 }
					 }
				 }
		});  
		$("#add43").click(function(){  
			 var alloptions = $("#s43 option");  
			 var so = $("#s43 option:selected");  
			 $("#s44").append(so); 
			 $scope.arr7 = [];
				$scope.s43List = {};
				$rootScope.s43ListResult = [];
				 $("#s44 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr7.push(vall);
			    });
				 if($rootScope.s43){
					 for(var w=0;w<$rootScope.s43.length;w++){
						 for(var t=0;t<$scope.arr7.length;t++){
							if($rootScope.s43[w].controlProjectNo == $scope.arr7[t]){
								$scope.s43List = {operationMode:$rootScope.s43[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s43[w].controlProjectNo,projectType:0};
								$scope.s43ListResult.push($scope.s43List);
							}
						 }
					 }
				 }
		});  
		$("#remove43").click(function(){  
			 var alloptions = $("#s44 option");  
			 var so = $("#s44 option:selected");  
			 $("#s43").append(so);
			 $scope.arr7 = [];
				$scope.s43List = {};
				$rootScope.s43ListResult = [];
				 $("#s44 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr7.push(vall);
			    });
				 if($rootScope.s43){
					 for(var w=0;w<$rootScope.s43.length;w++){
						 for(var t=0;t<$scope.arr7.length;t++){
							if($rootScope.s43[w].controlProjectNo == $scope.arr7[t]){
								$scope.s43List = {operationMode:$rootScope.s43[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s43[w].controlProjectNo,projectType:0};
								$scope.s43ListResult.push($scope.s43List);
							}
						 }
					 }
				 }
		});  
		$("#addall43").click(function(){  
			$("#s44").append($("#s43 option").attr("selected",true));  
			$scope.arr7 = [];
			$scope.s43List = {};
			$rootScope.s43ListResult = [];
			 $("#s44 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr7.push(vall);
		    });
			 if($rootScope.s43){
				 for(var w=0;w<$rootScope.s43.length;w++){
					 for(var t=0;t<$scope.arr7.length;t++){
						if($rootScope.s43[w].controlProjectNo == $scope.arr7[t]){
							$scope.s43List = {operationMode:$rootScope.s43[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s43[w].controlProjectNo,projectType:0};
							$scope.s43ListResult.push($scope.s43List);
						}
					 }
				 }
			 }
		});  
		$("#removeall43").click(function(){  
			$("#s43").append($("#s44 option").attr("selected",true)); 
			$rootScope.s43ListResult = [];
		});	
		//***********************定价标签列表***********************
		$("#s45 option").remove();
		 $("#s46 option").remove();
		$scope.setparamss = {
				operationMode : $scope.updateOperationMode,
		};
		jfRest.request('priceLabel', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s45 = {};
			$rootScope.s45 = data.returnData.rows;
			console.log(a);
			$scope.queryParam = {
				operationMode : $scope.blockCodeItem.operationMode,
				effectivenessCodeType : $scope.blockCodeItem.effectivenessCodeType,
				effectivenessCodeScene : $scope.blockCodeItem.effectivenessCodeScene,
				projectType:1
			};
			jfRest.request('blockCode', 'queryRelateControlItem', $scope.queryParam)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.s45ListResult = [];
						 for(var t=0;t<n.length;t++){
							$rootScope.s45ListResult.push(n[t]);
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s46").append("<option value='"+n[i].controlProjectNo+"'>"+n[i].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].controlDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].controlProjectNo==a[j].pricingTag){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s45").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s45").append("<option value='"+a[i].pricingTag+"'>"+a[i].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].pricingDesc+"</option>"); 
					  }
				   }
			});
		});
		/*----根据修改定价标签，和定价标签描述查询----*/
	 	$scope.queryPricingLabel = function(){
			 $("#s45").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				pricingTag: $scope.blockCodeItem.pricingTag,
				pricingDesc: $scope.blockCodeItem.pricingDesc
		 	};
			 jfRest.request('priceLabel', 'query', $scope.setparamss).then(function(data) {
				 console.log();
					var a =data.returnData.rows;
				 	console.log(a);
					$scope.arr02 = [];
					 $("#s46 option").each(function () {
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
						    	if(n[i]==a[j].pricingTag){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s45").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
					    	}
                        }
                     }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s45").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
						   }
				   }
				});
	 		};
			/*----end修改定价标签，和定价标签描述查询 ----*/
		//功能分配菜单
		$("#s45").dblclick(function(){  
			 var alloptions = $("#s45 option");  
			 var so = $("#s45 option:selected");  
			 $("#s46").append(so);
			$scope.arr5 = [];
			$scope.s45List = {};
			$rootScope.s45ListResult = [];
			 $("#s46 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr5.push(vall);
		    });
			 if($rootScope.s45){
				 for(var w=0;w<$rootScope.s45.length;w++){
					 for(var t=0;t<$scope.arr5.length;t++){
						if($rootScope.s45[w].pricingTag == $scope.arr5[t]){
							$scope.s45List = {operationMode:$rootScope.s45[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s45[w].pricingTag,projectType:1};
							$scope.s45ListResult.push($scope.s45List);
						}
					 }
				 }
			 }
		});  
		$("#s46").dblclick(function(){  
			 var alloptions = $("#s46 option");  
			 var so = $("#s46 option:selected");  
			 $("#s45").append(so);  
			 $scope.arr5 = [];
				$scope.s45List = {};
				$rootScope.s45ListResult = [];
				 $("#s46 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr5.push(vall);
			    });
				 if($rootScope.s45){
					 for(var w=0;w<$rootScope.s45.length;w++){
						 for(var t=0;t<$scope.arr5.length;t++){
							if($rootScope.s45[w].pricingTag == $scope.arr5[t]){
								$scope.s45List = {operationMode:$rootScope.s45[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s45[w].pricingTag,projectType:1};
								$scope.s45ListResult.push($scope.s45List);
							}
						 }
					 }
				 }
		});  
		$("#add45").click(function(){  
			 var alloptions = $("#s45 option");  
			 var so = $("#s45 option:selected");  
			 $("#s46").append(so); 
			 $scope.arr5 = [];
				$scope.s45List = {};
				$rootScope.s45ListResult = [];
				 $("#s46 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr5.push(vall);
			    });
				 if($rootScope.s45){
					 for(var w=0;w<$rootScope.s45.length;w++){
						 for(var t=0;t<$scope.arr5.length;t++){
							if($rootScope.s45[w].pricingTag == $scope.arr5[t]){
								$scope.s45List = {operationMode:$rootScope.s45[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s45[w].pricingTag,projectType:1};
								$scope.s45ListResult.push($scope.s45List);
							}
						 }
					 }
				 }
		});  
		$("#remove45").click(function(){  
			 var alloptions = $("#s46 option");  
			 var so = $("#s46 option:selected");  
			 $("#s45").append(so);
			 $scope.arr5 = [];
				$scope.s45List = {};
				$rootScope.s45ListResult = [];
				 $("#s46 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr5.push(vall);
			    });
				 if($rootScope.s45){
					 for(var w=0;w<$rootScope.s45.length;w++){
						 for(var t=0;t<$scope.arr5.length;t++){
							if($rootScope.s45[w].pricingTag == $scope.arr5[t]){
								$scope.s45List = {operationMode:$rootScope.s45[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s45[w].pricingTag,projectType:1};
								$scope.s45ListResult.push($scope.s45List);
							}
						 }
					 }
				 }
		});  
		$("#addall45").click(function(){  
			$("#s46").append($("#s45 option").attr("selected",true));  
			$scope.arr5 = [];
			$scope.s45List = {};
			$rootScope.s45ListResult = [];
			 $("#s46 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr5.push(vall);
		    });
			 if($rootScope.s45){
				 for(var w=0;w<$rootScope.s45.length;w++){
					 for(var t=0;t<$scope.arr5.length;t++){
						if($rootScope.s45[w].pricingTag == $scope.arr5[t]){
							$scope.s45List = {operationMode:$rootScope.s45[w].operationMode,effectivenessCodeType:$scope.blockCodeItem.effectivenessCodeType,effectivenessCodeScene:$scope.blockCodeItem.effectivenessCodeScene,controlProjectNo:$rootScope.s45[w].pricingTag,projectType:1};
							$scope.s45ListResult.push($scope.s45List);
						}
					 }
				 }
			 }
		});  
		$("#removeall45").click(function(){  
			$("#s45").append($("#s46 option").attr("selected",true));  
			$rootScope.s45ListResult = [];
		});	
	});
	//封锁码建立
	webApp.controller('blockCodeEstbCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   			}
   		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.blockCodeInf = {};
		//運營模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//--------------------------------构件实例--------------start
		$scope.newCodeShow = true;
		$scope.isInfo = false;
		$scope.isInfoPrice = false;
		 //第一步
		 $scope.step1Btn = true;
		 $scope.step2Btn = false;
		 $scope.nextStep1 = function(){
			 $("#s13 option").remove();
			 $("#s14 option").remove();
			$scope.setparamss = {
					operationMode:$scope.operationMode
			};
			jfRest.request('controlProject', 'query', $scope.setparamss)
			.then(function(data) {
				console.log(data);
				if(data.returnData.totalCount == 0){
					jfLayer.fail(T.T("YYJ700023"));
					return;
				}
				$scope.isInfo = true;  //关联显示
				$scope.step2Btn = true;
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
				$rootScope.s13 = {};
				$rootScope.s13 =data.returnData.rows;
				for(var i=0;i<a.length;i++){
					angular.element("#s13").append("<option value='"+a[i].controlProjectNo+"'>"+a[i].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].controlDesc+"</option>"); 
			   }
			});
		 };
		 /*----根据管控项目，和管控项目描述查询----*/
		 	$scope.queryControlProject = function(){
				 $("#s13").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					controlProjectNo: $scope.blockCodeInf.controlProjectNo,
					controlDesc: $scope.blockCodeInf.controlDesc
		 		};
				jfRest.request('controlProject', 'query', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s14 option").each(function () {
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
						    	if(n[i]==a[j].controlProjectNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s13").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
					    	}
                        }
                    }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s13").append("<option value='"+a[j].controlProjectNo+"'>"+a[j].controlProjectNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].controlDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end管控项目，和管控项目描述查询 ----*/
			//点击上一步  回到第一步
			$scope.stepBackOne = function(){
				$scope.isInfo = false;  //第二步内容
				$scope.step1Btn = true;    //第一步按钮   
				$scope.step2Btn = false;
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
			//第二步
			$scope.stepToThree = function(){
				 $("#s25 option").remove();
				 $("#s26 option").remove();
				$scope.paraPrice = {
						operationMode:$scope.operationMode
				};
				jfRest.request('priceLabel', 'query', $scope.paraPrice)
				.then(function(data) {
					console.log(data);
					if(data.returnData.totalCount == 0){
						jfLayer.fail(T.T("YYJ700024"));
						return;
					}
					$scope.isInfoPrice = true;  //定价标签内容
					$scope.step1Btn = false;
					$scope.step2Btn = false;
					var b =data.returnData.rows;
					$rootScope.s25 = {};
					$rootScope.s25 =data.returnData.rows;
					for(var i=0;i<b.length;i++){
						angular.element("#s25").append("<option value='"+b[i].pricingTag+"'>"+b[i].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+b[i].pricingDesc+"</option>"); 
				   }
				});
			};
			/*----根据定价标签，和定价标签描述查询----*/
		 	$scope.queryPricingtagList = function(){
				 $("#s25").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					pricingTag: $scope.proObjInstan.pricingTag,
					pricingDesc: $scope.proObjInstan.pricingDesc
		 		};
				jfRest.request('priceLabel', 'query', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s26 option").each(function () {
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
						    	if(n[i]==a[j].pricingTag){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s25").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
					    	}
                        }
                    }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s25").append("<option value='"+a[j].pricingTag+"'>"+a[j].pricingTag+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].pricingDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end定价标签，和定价标签描述查询 ----*/
			$scope.stepBackTwo = function(){
				$scope.isInfoPrice = false;
				$scope.step2Btn = true;
				 $("#s25 option").remove();
				 $("#s26 option").remove();
			};
			//管控项目
		 $("#s13").dblclick(function(){  
			 var alloptions = $("#s13 option");  
			 var so = $("#s13 option:selected");  
			 $("#s14").append(so);  
		});  
		$("#s14").dblclick(function(){  
			 var alloptions = $("#s14 option");  
			 var so = $("#s14 option:selected");  
			 $("#s13").append(so);  
		});  
		$("#add").click(function(){  
			 var alloptions = $("#s13 option");  
			 var so = $("#s13 option:selected");  
			 $("#s14").append(so); 
		});  
		$("#remove").click(function(){  
			 var alloptions = $("#s14 option");  
			 var so = $("#s14 option:selected");  
			 $("#s13").append(so);
		});  
		$("#addall").click(function(){  
			$("#s14").append($("#s13 option").attr("selected",true));  
		});  
		$("#removeall").click(function(){  
			$("#s13").append($("#s14 option").attr("selected",true));  
		});  
		//定价标签
		$("#s25").dblclick(function(){  
			 var alloptions = $("#s25 option");  
			 var so = $("#s25 option:selected");  
			 $("#s26").append(so);  
		});  
		$("#s26").dblclick(function(){  
			 var alloptions = $("#s26 option");  
			 var so = $("#s26 option:selected");  
			 $("#s25").append(so);  
		});  
		$("#add25").click(function(){  
			 var alloptions = $("#s25 option");  
			 var so = $("#s25 option:selected");  
			 $("#s26").append(so); 
		});  
		$("#remove25").click(function(){  
			 var alloptions = $("#s26 option");  
			 var so = $("#s26 option:selected");  
			 $("#s25").append(so);
		});  
		$("#addall25").click(function(){  
			$("#s26").append($("#s25 option").attr("selected",true));  
		});  
		$("#removeall25").click(function(){  
			$("#s25").append($("#s26 option").attr("selected",true));  
		});  
		//--------------------------构件实例--------------end
	});
	webApp.controller('viewAssociatedEventsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translate.refresh();
		$scope.list=$scope.blockCodeEvent;
		$scope.eventNoBlockCodeList = {
			params : {
					pageSize:10,
					indexNo:0,
					operationMode: $scope.list.operationMode,
					controlProjectNo: $scope.list.controlProjectNo,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			authQuery:true,
			resource : 'limitList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
});
