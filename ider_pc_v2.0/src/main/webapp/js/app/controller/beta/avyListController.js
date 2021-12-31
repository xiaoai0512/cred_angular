'use strict';
define(function(require) {
	var webApp = require('app');
	// 活动清单
	webApp.controller('avyListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/avyList/i18n_avyList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.selgjBtnFlag = false;
		 $scope.selevBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0003') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
	/*		   	   	if($scope.eventList.search('COS.IQ.02.0004') != -1){    //查询构件
	   					$scope.selgjBtnFlag = true;
	   				}
	   				else{
	   					$scope.selgjBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.IQ.02.0002') != -1){    //查询事件
	   					$scope.selevBtnFlag = true;
	   				}
	   				else{
	   					$scope.selevBtnFlag = false;
	   				}*/
			   	   	if($scope.eventList.search('COS.UP.02.0003') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0003') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
		/*日志层级   
		 * C：客户级
		A：账户级
		P：产品级
		R：参数级
		D：客户业务项目级
		B：余额单元级
		O：余额对象级
		T：余额类型级
		M：媒介级
		Y:运维级*/
		$scope.logLevelArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logHierarchy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		/* 日志类型
		 * G：金融G类, S：金融S类, N：非金融类
		 *  P：参数类, * A: 授权类，D: 金融D类
		*/
		 $scope.logTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};	
		/*会计用途标识下拉框   是否*/	
		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};	
		$scope.avyListTable = {
			// checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_logHierarchy','dic_logType'],//查找数据字典所需参数
			transDict : ['logLevel_logLevelDesc','logType_logTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.checkElmInfo = function(event) {
			$scope.componentInfo = $.parseJSON(JSON.stringify(event));
			// 页面 查询构件(弹出页面)
			$scope.modal('/beta/avyList/checkElmList.html', $scope.componentInfo, {
				title : T.T('PZJ200011'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		// 查看
		$scope.checkAvyInfo = function(event) {
			$scope.evtInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/avyList/checkAvyList.html', $scope.evtInfo, {
				title : T.T('PZJ200013'),
				buttons : [ T.T('F00012')],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.changeAvyInfo = function(event) {
			$scope.avyUpdate = {};
			$scope.avyUpdate = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/avyList/avyListMod.html', $scope.avyUpdate, {
				title : T.T('PZJ200012'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.updateCorporat ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateCorporat = function(result) {
			$scope.avyUpdate.logLevel = result.scope.uplogLevel;
			$scope.avyUpdate.logType = result.scope.uplogType;
			$scope.avyUpdate.lifecycleNode= result.scope.upLifecycleNode;
			for(var key in $scope.avyUpdate){
				if($scope.avyUpdate[key] == "null" || $scope.avyUpdate[key] == null){
					$scope.avyUpdate[key] = '';
				}
            }
            $scope.arr54 = [];
			$scope.s54List = {};
			$scope.s54ListResult = [];
			 $("#s54 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr54.push(vall);
		    });
			 if($rootScope.s54){
				 for(var w=0;w<$rootScope.s54.length;w++){
					 for(var t=0;t<$scope.arr54.length;t++){
						if($rootScope.s54[w].artifactNo == $scope.arr54[t]){
							$scope.s54List = $rootScope.s54[w];
							$scope.s54ListResult.push($scope.s54List);
						}
					 }
				 }
			 }
			 $scope.avyUpdate.list= $scope.s54ListResult;
			// 保存事件
			jfRest.request('avyList', 'updateAct', $scope.avyUpdate).then(function(data) {
				if (data.returnCode == '000000') {
					// 保存事件关联活动
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.avyListTable.search();
				} 
			});
		};
		//新增
		$scope.addAvyBtn = function(){
			$scope.avyInfo = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/actConfig/actConfig.html', $scope.avyInfo, {
				title : T.T('PZJ200021'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '1050px', '500px' ],
				callbacks : [$scope.sureAddAvy]
			});
		};
		//确认新增活动
		$scope.sureAddAvy = function(result){
			$scope.arr2 = [];
			$scope.s30List = {};
			$scope.s30ListResult = [];
			 $("#s30 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s30){
				 for(var w=0;w<$rootScope.s30.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s30[w].artifactNo == $scope.arr2[t]){
							$scope.s30List = $rootScope.s30[w];
							$scope.s30ListResult.push($scope.s30List);
						}
					 }
				 }
			 }
			$scope.avyInfo = result.scope.avyInfo;
			$scope.avyInfo.list= $scope.s30ListResult;
			jfRest.request('actConfig', 'saveAct', $scope.avyInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.avyInfo = "";
					$rootScope.treeSelect = [];
					$scope.elmListTableCfg ='';
					$scope.safeApply();
					result.cancel();
					$scope.avyListTable.search();
				}
			});
		};
	});
	webApp.controller('checkAvyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T) {
		// 事件清单列表
		$scope.itemList = {
			params : $scope.queryParam = {
				activityNo : $scope.evtInfo.activityNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.queryEvLstList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data;
			}
		};
		/* 日志类型
		 * G：金融G类
		 * S：金融S类
		 * N：非金融类
		 * P：参数类
		 * A: 授权类
		 * D: 金融D类
		*/		
		 $scope.logTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logType=$scope.evtInfo.logType;
	        	//console.log($scope.logType)
	        }
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
 		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                     
	        	$scope.accountingUseFlag=$scope.evtInfo.accountingUseFlag;
	        }
		};
		/*日志层级   
		 * C：客户级,A：账户级,P：产品级,R：参数级,D：客户业务项目级,B：余额单元级
		O：余额对象级,T：余额类型级,M：媒介级,Y:运维级*/
		$scope.logLevelArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logHierarchy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logLevel=$scope.evtInfo.logLevel;
	        }
		};
	});
	webApp.controller('checkElmCtrl1', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T) {
		// 事件清单列表
		$scope.itemList = {
			params : $scope.queryParam = {
				activityNo : $scope.componentInfo.activityNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.queryActArtiRel',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data;
			}
		};
		/* 日志类型
		 * G：金融G类
		 * S：金融S类
		 * N：非金融类
		 * P：参数类
		 * A: 授权类
		 * D: 金融D类
		*/		
		 $scope.logTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logType=$scope.componentInfo.logType;
	        }
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
 		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                     
	        	$scope.accountingUseFlag=$scope.componentInfo.accountingUseFlag;
	        }
		};
		/*日志层级   
		 * C：客户级,A：账户级,P：产品级,R：参数级,D：客户业务项目级,B：余额单元级
		O：余额对象级,T：余额类型级,M：媒介级,Y:运维级*/
		$scope.logLevelArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logHierarchy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logLevel=$scope.componentInfo.logLevel;
	        }
		};
	});
	webApp.controller('avyListModCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,
			$rootScope, jfLayer, $location,lodinDataService,$translate,T) {
		//生命周期节点
		 $scope.lifecycleNodeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"nodeTypNumbr", //下拉框显示内容，根据需要修改字段名称 
	        value:"nodeTypNumbr",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"actConfig.queryLifecycleNode",//数据源调用的action 
	        callback: function(data){
	        	$scope.upLifecycleNode = $scope.avyUpdate.lifecycleNode;
	        }
	    };
		/* 日志类型, G：金融G类, S：金融S类, N：非金融类
		 * P：参数类, A: 授权类,D: 金融D类*/		
		 $scope.logTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.uplogType=$scope.avyUpdate.logType;
	        }
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
 		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){                                     
	        	$scope.upaccountingUseFlag=$scope.avyUpdate.accountingUseFlag;
	        }
		};
		/*日志层级   
		 * C：客户级,A：账户级,P：产品级,R：参数级,D：客户业务项目级,B：余额单元级
		O：余额对象级,T：余额类型级,M：媒介级,Y:运维级*/
		$scope.logLevelArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logHierarchy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.uplogLevel=$scope.avyUpdate.logLevel;
	        }
		};
		 $("#s53 option").remove();
		 $("#s54 option").remove();
		$scope.setparamss = {};
		jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s54 = {};
			$rootScope.s54 = data.returnData.rows;
			$scope.queryParam = {
					activityNo : $scope.avyUpdate.activityNo,
			};
			jfRest.request('avyList', 'queryActArtiRel', $scope.queryParam).then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
					for(var i=0;i<n.length;i++){
			    		angular.element("#s54").append("<option value='"+n[i].artifactNo+"'>"+n[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].artifactDesc+"</option>"); 
			    	}
					//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i].artifactNo==a[j].artifactNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		angular.element("#s53").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	}
                    }
                 }else{
					   for(var i=0;i<a.length;i++){
					   angular.element("#s53").append("<option value='"+a[i].artifactNo+"'>"+a[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].artifactDesc+"</option>"); 
					  }
			      }
			});
		});
		/*-----根据构件和构件描述查询-----*/
		$scope.queryArtifactUpdate = function(){
			 $("#s53").empty();
			 $scope.setparamss = {
				artifactNo: $scope.artifactNo,
				artifactDesc: $scope.artifactDesc
			};
			jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
				var a =data.returnData.rows;
				$scope.arr53 = [];
				$("#s54 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr53.push(vall);
			    });
				var n =$scope.arr53;
				if(n !=undefined && a !=null){
					//查找重复数据
					 var isrep;
					 for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].artifactNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s53").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	}
                     }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
			    		 $("#s53").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
			    	  }
			      }
			});
		};
		$("#s53").dblclick(function(){  
			 var alloptions = $("#s53 option");  
			 var so = $("#s53 option:selected");  
			 $("#s54").append(so);  
		});  
		$("#s54").dblclick(function(){  
			 var alloptions = $("#s54 option");  
			 var so = $("#s54 option:selected");  
			 $("#s53").append(so);  
		});  
		$("#add53").click(function(){  
			 var alloptions = $("#s53 option");  
			 var so = $("#s53 option:selected");  
			 $("#s54").append(so); 
		});  
		$("#remove53").click(function(){  
			 var alloptions = $("#s54 option");  
			 var so = $("#s54 option:selected");  
			 $("#s53").append(so);
		});  
		$("#addall53").click(function(){  
			$("#s54").append($("#s53 option").attr("selected",true));  
		});  
		$("#removeall53").click(function(){  
			$("#s53").append($("#s54 option").attr("selected",true));  
		});  
	});
	//活动新增
	webApp.controller('actConfigCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/actConfig/i18n_actConfig');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.avyInfo = $scope.avyInfo;
		/* 日志类型
		 * G：金融G类
		 * S：金融S类
		 * N：非金融类
		 * P：参数类
		 * A: 授权类
		 * D: 金融D类
		*/
		 $scope.logTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 /*会计用途标识 
		  * Y:是
		  * N：否*/
 		$scope.accountingUseFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
		};
		/*日志层级   
		 * C：客户级
		A：账户级
		P：产品级
		R：参数级
		D：客户业务项目级
		B：余额单元级
		O：余额对象级
		T：余额类型级
		M：媒介级
		Y:运维级*/
		$scope.logLevelArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logHierarchy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	       }
		};		
		//生命周期节点
		 $scope.lifecycleNodeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"nodeTypNumbr", //下拉框显示内容，根据需要修改字段名称 
			        value:"nodeTypNumbr",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"actConfig.queryLifecycleNode",//数据源调用的action 
			        callback: function(data){
			        }
			    };
//		// 保存按钮事件
//		$scope.saveActArtiRel = function() {
//			//保存事件
//			$scope.arr2 = [];
//			$scope.s30List = {};
//			$rootScope.s30ListResult = [];
//			 $("#s30 option").each(function () {
//		        var vall = $(this).val();
//		        $scope.arr2.push(vall);
//		    });
//			 if($rootScope.s30){
//				 for(var w=0;w<$rootScope.s30.length;w++){
//					 for(var t=0;t<$scope.arr2.length;t++){
//						if($rootScope.s30[w].artifactNo == $scope.arr2[t]){
//							$scope.s30List = $rootScope.s30[w];
//							$rootScope.s30ListResult.push($scope.s30List);
//						}
//					 }
//				 }
//			 }
//			 $scope.avyInfo.list= $scope.s30ListResult;
//			jfRest.request('actConfig', 'saveAct', $scope.avyInfo).then(function(data) {
//				if (data.returnCode == '000000') {
//					jfLayer.success(T.T('F00032'));
//					$scope.avyInfo = "";
//					$rootScope.treeSelect = [];
//					$scope.elmListTableCfg ='';
//					$scope.turn("/beta/actConfig");
//				}else{
////					jfLayer.fail("保存失败");
//					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033') ;
//					jfLayer.fail(data.returnMsg);
//				}
//			});
//		};
		//构建列表
		$("#s29 option").remove();
		 $("#s30 option").remove();
		$scope.setparamss = {};
		jfRest.request('elmList', 'query', $scope.setparamss)
		.then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s30 = {};
			$rootScope.s30 =data.returnData.rows;
			for(var i=0;i<a.length;i++){
				$("#s29").append("<option value='"+a[i].artifactNo+"'>"+a[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].artifactDesc+"</option>"); 
		   }
		});
		/*-----根据构件和构件描述查询-----*/
		$scope.queryAddComponent = function(){
			 $("#s29").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				artifactNo: $scope.avyInfo.artifactNo,
				artifactDesc: $scope.avyInfo.artifactDesc
			};
			jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
				var a =data.returnData.rows;
				$scope.arr02 = [];
				$("#s30 option").each(function () {
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
					    	if(n[i]==a[j].artifactNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s29").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	}
                     }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
			    		 $("#s29").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
			    	  }
			      }
			});
		};
		/*-----end 构件和构件描述查询-----*/
		$("#s29").dblclick(function(){  
			 var alloptions = $("#s29 option");  
			 var so = $("#s29 option:selected");  
			 $("#s30").append(so);  
			 $rootScope.valueInfoPro = "";
		});  
		$("#s30").dblclick(function(){  
			 var alloptions = $("#s30 option");  
			 var so = $("#s30 option:selected");  
			 $("#s29").append(so);  
			 $rootScope.valueInfoPro = "";
		});  
		$("#add29").click(function(){  
			 var alloptions = $("#s29 option");  
			 var so = $("#s29 option:selected");  
			 $("#s30").append(so); 
			 $rootScope.valueInfoPro = "";
		});  
		$("#remove29").click(function(){  
			 var alloptions = $("#s30 option");  
			 var so = $("#s30 option:selected");  
			 $("#s29").append(so);
			 $rootScope.valueInfoPro = "";
		});  
		$("#addall29").click(function(){  
			$("#s30").append($("#s29 option").attr("selected",true));  
			$rootScope.valueInfoPro = "";
		});  
		$("#removeall29").click(function(){  
			$("#s29").append($("#s30 option").attr("selected",true));  
			$rootScope.valueInfoPro = "";
		});  
		$scope.elmListTableCfg = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'elmList.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		$rootScope.treeSelect = [];
		// 关联活动
		$scope.saveSelect = function(event) {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.elmListTableCfg.validCheck()) {
				return;
			}
			var items = $scope.elmListTableCfg.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].artifactNo == $rootScope.treeSelect[k].artifactNo) {    //判断是否存在
						tipStr = tipStr + items[i].artifactNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$rootScope.treeSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('PZJ500012') + tipStr.substring(0,tipStr.length-1) + T.T('PZJ500013'));
			}
		};
		// 上移
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i - 1];
					$rootScope.treeSelect[i - 1] = dataMap;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == $rootScope.treeSelect.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i + 1];
					$rootScope.treeSelect[i + 1] = dataMap;
					break;
				}
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
			/*
			 * var arrId=treeSelect.indexOf(data); treeSelect.splice(arrId,1);
			 * $scope.checkedList=treeSelect;
			 */
		}
	});
});
