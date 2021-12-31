/**
 * 
 */
'use strict';
define(function(require) {
	var webApp = require('app');
	// 产品對象查询
	webApp.controller('proObjectQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");   
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.userName = "";
		$scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
			//	运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
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
		   	   		if($scope.eventList.search('COS.IQ.02.0013') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0013') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		//产品對象列表
		$scope.proObjectList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查看优先级
		$scope.choseBtnPriority = function() {
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/viewProductObject.html', $scope.params, {
				title : T.T('YYJ300019'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
		 //查询法人实体
    	$scope.userInfo = lodinDataService.getObject("userInfo");
 		$scope.adminFlag = $scope.userInfo.adminFlag;
 		$scope.organization = $scope.userInfo.organization;
        $scope.queryCorEntityNo = function(){
 			$scope.queryParam = {
 					organNo : $scope.organization
 			};
 			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
 				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
 				if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
 					$scope.corporationEntityNo = $scope.corporationEntityNo;
 					$("#corporationEntityNo").attr("disabled",true);
 				}
 			});
        };        
        $scope.queryCorEntityNo ();   
		// 查看
		$scope.checkProObjectInf = function(event) {
			$scope.proObjectInf = $.parseJSON(JSON.stringify(event));
			$scope.proObjectInf.corporationEntityNo  = $scope.corporationEntityNo;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/viewProObject.html',$scope.proObjectInf, {
						title : T.T('YYJ300018'),
						buttons : [ T.T('F00012')  ],
						size : [ '1050px', '600px' ],
						callbacks : []
					});
		};
		// 修改
		$scope.updateProObjectInf = function(event) {
			$scope.proObjectInf = $.parseJSON(JSON.stringify(event));
			$scope.proObjectInf.corporationEntityNo  = $scope.corporationEntityNo;
			$rootScope.deletePcdInstanIdList = [];
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/updateProObject.html',$scope.proObjectInf, {
				title : T.T('YYJ300020'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : [ $scope.updateProObject ]
			});
		};
		//放 pcd删除id
		$rootScope.deletePcdInstanIdList = [];
		// 回调函数/确认按钮事件
		$scope.updateProObject = function(result) {
			$scope.params = {
					busProList : $rootScope.S71ListResult,    //关联业务项目信息
					list : $rootScope.S6ListResult,      //关联卡版面信息
					artifactInstanList : $rootScope.queryMODP.data, //$rootScope.queryMODP.data
					deletePcdInstanIdList: $rootScope.deletePcdInstanIdList
			};
			$scope.proObjectInf.binNo= $scope.proObjectInf.binNoUpdate;
			$scope.proObjectInf.segmentNumber = result.scope.segmentNumber;
			$scope.params = Object.assign($scope.params , $scope.proObjectInf);
			$scope.params.productCodeSet = result.scope.productCodeSetUpdate;
			$scope.params.feeItemlist = [];
			if(result.scope.arr12){
				if(result.scope.arr12.length > 0){
					for(var i=0;i<result.scope.arr12.length;i++){
						$scope.feeItemNovar = {'feeItemNo':result.scope.arr12[i]};
						$scope.params.feeItemlist.push($scope.feeItemNovar);
					}
				}
			}
			jfRest.request('proObject', 'update', $scope.params) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.proObjectList.search();
				}
			});
		};
	});
	//查看4444444444444
	webApp.controller('viewProObjectCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.busListTableView = {
				params : $scope.queryParam = {
						productObjectCode : $scope.proObjectInf.productObjectCode,
						operationMode : $scope.proObjectInf.operationMode,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'proObject.queryProBusScope',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//收费项目列表
		$scope.payProList = {
			params : {
					productObjectCode : $scope.proObjectInf.productObjectCode,
					operationMode : $scope.proObjectInf.operationMode,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'feeProject.relatedProObjQuery',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory','dic_instanceDimension','dic_instanceDimension'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc','instanCode1_instanCode1Desc','instanCode2_instanCode2Desc'],//翻译前后key
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
	        	$scope.operationModeInfo = $scope.proObjectInf.operationMode;
	        }
	    };
		//产品
		 $scope.proArray ={ 
			        type:"dynamicDesc", 
			        param:{operationMode:$scope.proObjectInf.operationMode},//默认查询条件 
			        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
			        desc:"productDesc",
			        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"proObject.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.productCodeSetInfo = $scope.proObjectInf.productCodeSet;
			        }
		};
		//可选卡版面
		$scope.cardLayoutList = {
			params : {
				productObjectCode : $scope.proObjectInf.productObjectCode,
				operationMode : $scope.proObjectInf.operationMode,
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cardLayoutMag.relatedProObjQuery',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.segmentNumberArr = {};
		//查询特殊段号
		if($scope.proObjectInf.binNo){
			 $scope.isShowSeg = true;
			 //特殊号码段号
	        $scope.segmentNumberArr = {
	    		type:"dynamic", 
		        param:{
		        	cardBin :  $scope.proObjectInf.binNo,
		        	corporationEntityNo : $scope.proObjectInf.corporationEntityNo
		        },//默认查询条件 
		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"resSpecialNoRule.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.segmentNumberInfo = $scope.proObjectInf.segmentNumber;
		        }	
	        };
        }
        //构件实例列表
		$scope.artifactView = {
			params : {
				operationMode:$scope.proObjectInf.operationMode,
				instanCode:$scope.proObjectInf.productObjectCode,
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//产品构件实例====详情
		$scope.queryArtifactBP = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
				title : T.T('F00041')+$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +T.T('F00156'),
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};
	});
	//查看5555555555555
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
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
	//修改11111111111111
	webApp.controller('updateProObjectCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.segmentNumberArr = {};
		$scope.firstDiv = true;
		$scope.isshow99 = true;
		$scope.instanProductShow = true;
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
				$scope.feeTypeInfo = $scope.proObjectInf.feeType;
			}
		};
		//	运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeInfo = $scope.proObjectInf.operationMode;
	        }
	    };
		 $scope.proArray ={ 
			        type:"dynamicDesc", 
			        param:{operationMode:$scope.proObjectInf.operationMode},//默认查询条件 
			        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
			        desc:"productDesc",
			        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"proObject.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.productCodeSetUpdate = $scope.proObjectInf.productCodeSet;
			        }
		};
		//卡bin
		 $scope.cardBinArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryBin",//数据源调用的action 
	        callback: function(data){
	        	$scope.proObjectInf.binNoUpdate = $scope.proObjectInf.binNo;
	        }
	    };
			//查询特殊段号
		if($scope.proObjectInf.binNo){
			$scope.isShowSeg = true;
			 //特殊号码段号
	        $scope.segmentNumberArr = {
	    		type:"dynamic", 
		        param:{
		        	cardBin :  $scope.proObjectInf.binNo,
		        	corporationEntityNo : $scope.proObjectInf.corporationEntityNo
		        },//默认查询条件 
		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"resSpecialNoRule.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.segmentNumber = $scope.proObjectInf.segmentNumber;
		        }	
	        };
        }
        var form = layui.form;
		form.on('select(getbinNoUpdate)',function(event){
			$scope.isShowSeg = true;
			 //特殊号码段号
	        $scope.segmentNumberArr = {
	    		type:"dynamic", 
		        param:{
		        	cardBin :  event.value,
		        	corporationEntityNo : $scope.proObjectInf.corporationEntityNo
		        },//默认查询条件 
		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"resSpecialNoRule.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.segmentNumber = $scope.proObjectInf.segmentNumber;
		        }	
	        };
		});
		//***********************业务类型列表***********************
		 $("#s71 option").remove();
		 $("#s72 option").remove();
		$scope.setparamss = {
				operationMode : $scope.proObjectInf.operationMode,
		};
		jfRest.request('productLine', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s71 = {};
			$rootScope.s71 = data.returnData.rows;
			$scope.queryParam = {
					productObjectCode : $scope.proObjectInf.productObjectCode,
					operationMode : $scope.proObjectInf.operationMode,
			};
			jfRest.request('proObject', 'queryProBusScope', $scope.queryParam)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.S71ListResult = [];
						 for(var t=0;t<n.length;t++){
							$rootScope.S71ListResult.push(n[t]);
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s72").append("<option value='"+n[i].businessProgramNo+"'>"+n[i].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].businessDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].businessProgramNo==a[j].businessProgramNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s71").append("<option value='"+a[j].businessProgramNo+"'>"+a[j].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].programDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s71").append("<option value='"+a[i].businessProgramNo+"'>"+a[i].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].programDesc+"</option>"); 
					  }
				   }
			});
		});
		/*-----选择业务项目根据 业务项目和描述查询-----*/
		$scope.queryModifyList = function(){
			$("#s71").empty();
			$scope.setparamss = {
				operationMode : $rootScope.operationMods,
				businessProgramNo: $scope.proObjectInf.businessProgramNo,
				programDesc: $scope.proObjectInf.programDesc
		 	};
			jfRest.request('productLine', 'query', $scope.setparamss).then(function(data) {
				 console.log();
				var a =data.returnData.rows;
			 	$scope.arr02 = [];
				 $("#s72 option").each(function () {
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
					    	if(n[i]==a[j].businessProgramNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s71").append("<option value='"+a[j].businessProgramNo+"'>"+a[j].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].programDesc+"</option>"); 
				    	}
                    }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s71").append("<option value='"+a[j].businessProgramNo+"'>"+a[j].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].programDesc+"</option>"); 
			    	  }
			      }
			});
 		};
		/*-----end选择业务项目根据 业务项目和描述查询-----*/
		//功能分配菜单
		$("#s71").dblclick(function(){  
			 var alloptions = $("#s71 option");  
			 var so = $("#s71 option:selected");  
			 $("#s72").append(so);
			$scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S71ListResult = [];
			 $("#s72 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s71){
				 for(var w=0;w<$rootScope.s71.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s71[w].businessProgramNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s71[w];
							$rootScope.S71ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#s72").dblclick(function(){  
			 var alloptions = $("#s72 option");  
			 var so = $("#s72 option:selected");  
			 $("#s71").append(so);  
			 $scope.arr2 = [];
				$scope.S2List = {};
				$rootScope.S71ListResult = [];
				 $("#s72 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s71){
					 for(var w=0;w<$rootScope.s71.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s71[w].businessProgramNo == $scope.arr2[t]){
								$scope.S2List = $rootScope.s71[w];
								$scope.S2ListResult.push($scope.S2List);
							}
						 }
					 }
				 }
		});  
		$("#add71").click(function(){  
			 var alloptions = $("#s71 option");  
			 var so = $("#s71 option:selected");  
			 $("#s72").append(so); 
			 $scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S71ListResult = [];
			 $("#s72 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s71){
				 for(var w=0;w<$rootScope.s71.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s71[w].businessProgramNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s71[w];
							$rootScope.S71ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#remove71").click(function(){  
			 var alloptions = $("#s72 option");  
			 var so = $("#s72 option:selected");  
			 $("#s71").append(so);
			 $scope.arr2 = [];
				$scope.S2List = {};
				$rootScope.S71ListResult = [];
				 $("#s72 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s71){
					 for(var w=0;w<$rootScope.s71.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s71[w].businessProgramNo == $scope.arr2[t]){
								$scope.S2List = $rootScope.s71[w];
								$scope.S2ListResult.push($scope.S2List);
							}
						 }
					 }
				 }
		});  
		$("#addall71").click(function(){  
			$("#s72").append($("#s71 option").attr("selected",true));  
			$scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S71ListResult = [];
			 $("#s72 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s71){
				 for(var w=0;w<$rootScope.s71.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s71[w].businessProgramNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s71[w];
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#removeall71").click(function(){  
			$("#s71").append($("#s72 option").attr("selected",true));  
			$rootScope.S71ListResult = [];
		});
		//卡版面信息
		 $("#s9 option").remove();
		 $("#s10 option").remove();
		$scope.kparamss = {
				operationMode : $scope.proObjectInf.operationMode,
		};
		jfRest.request('cardLayoutMag', 'query', $scope.kparamss).then(function(data) {
			var k =data.returnData.rows;
			console.log(k);
			$rootScope.s6 = {};
			$rootScope.s6 = data.returnData.rows;
			$scope.querysParam = {
					productObjectCode : $scope.proObjectInf.productObjectCode,
					operationMode : $scope.proObjectInf.operationMode,
			};
			jfRest.request('cardLayoutMag', 'relatedProObjQuery', $scope.querysParam).then(function(data) {
				console.log(data);
				if(data.returnData){
					 var m =data.returnData.rows;
					 console.log(m);
					 if(m!=undefined){
						 $rootScope.S6ListResult = [];
						 for(var z=0;z<m.length;z++){
							$rootScope.S6ListResult.push(m[z]);
						 }
					    	for(var i=0;i<m.length;i++){
					    		$("#s10").append("<option value='"+m[i].formatCode+"'>"+m[i].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+m[i].formatDescribe+"</option>"); 
					    	}
							//查找重复数据
						    var isrep;
						    for(var j =0;j<k.length;j++){
						    	isrep = false;
						    	for(var i=0;i<m.length;i++){
							    	if(m[i].formatCode==k[j].formatCode){
							    		isrep = true;
							    		break;
							    	}
							    }
						    	if(!isrep){
									$("#s9").append("<option value='"+k[j].formatCode+"'>"+k[j].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+k[j].formatDescribe+"</option>"); 
						    		}
                            }
                     }else{
							   for(var i=0;i<k.length;i++){
						    	 $("#s9").append("<option value='"+k[i].formatCode+"'>"+k[i].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+k[i].formatDescribe+"</option>"); 
						  }
					   }
				}
			});
		}); 
		/*-----选择卡版面，卡面和卡描述的查询方法-----*/
		$scope.queryCardList = function(){
			 $("#s9").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				formatCode: $scope.proObjectInf.formatCode,
				formatDescribe: $scope.proObjectInf.formatDescribe
		 	};
			 jfRest.request('cardLayoutMag', 'query', $scope.setparamss).then(function(data) {
				 console.log();
					var a =data.returnData.rows;
				 	console.log(a);
					$scope.arr02 = [];
					$("#s10 option").each(function () {
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
						    	if(n[i]==a[j].formatCode){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s9").append("<option value='"+a[j].formatCode+"'>"+a[j].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].formatDescribe+"</option>"); 
					    	}
                        }
                     }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s9").append("<option value='"+a[j].formatCode+"'>"+a[j].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].formatDescribe+"</option>"); 
						   }
				   }
				});
	 		};
		/*-----end选择卡版面，卡面和卡描述的查询方法-----*/
		//选择卡版面
		$("#s9").dblclick(function(){  
			 var alloptions = $("#s9 option");  
			 var so = $("#s9 option:selected");  
			 $("#s10").append(so); 
			 $scope.arr6 = [];
			$scope.S6List = {};
			$rootScope.S6ListResult = [];
			 $("#s10 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr6.push(vall);
		    });
			 if($rootScope.s6){
				 for(var w=0;w<$rootScope.s6.length;w++){
					 for(var t=0;t<$scope.arr6.length;t++){
						if($rootScope.s6[w].formatCode == $scope.arr6[t]){
							$scope.S6List = $rootScope.s6[w];
							$rootScope.S6ListResult.push($scope.S6List);
						}
					 }
				 }
			 }
		});  
		$("#s10").dblclick(function(){  
			 var alloptions = $("#s10 option");  
			 var so = $("#s10 option:selected");  
			 $("#s9").append(so);  
			 $scope.arr6 = [];
				$scope.S6List = {};
				$rootScope.S6ListResult = [];
				 $("#s10 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr6.push(vall);
			    });
				 if($rootScope.s6){
					 for(var w=0;w<$rootScope.s6.length;w++){
						 for(var t=0;t<$scope.arr6.length;t++){
							if($rootScope.s6[w].formatCode == $scope.arr6[t]){
								$scope.S6List = $rootScope.s6[w];
								$rootScope.S6ListResult.push($scope.S6List);
							}
						 }
					 }
				 }
		});  
		$("#add9").click(function(){  
			 var alloptions = $("#s9 option");  
			 var so = $("#s9 option:selected");  
			 $("#s10").append(so); 
			 $scope.arr6 = [];
				$scope.S6List = {};
				$rootScope.S6ListResult = [];
				 $("#s10 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr6.push(vall);
			    });
				 if($rootScope.s6){
					 for(var w=0;w<$rootScope.s6.length;w++){
						 for(var t=0;t<$scope.arr6.length;t++){
							if($rootScope.s6[w].formatCode == $scope.arr6[t]){
								$scope.S6List = $rootScope.s6[w];
								$rootScope.S6ListResult.push($scope.S6List);
							}
						 }
					 }
				 }
		});  
		$("#remove9").click(function(){  
			 var alloptions = $("#s10 option");  
			 var so = $("#s10 option:selected");  
			 $("#s9").append(so);
			 $scope.arr6 = [];
				$scope.S6List = {};
				$rootScope.S6ListResult = [];
				 $("#s10 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr6.push(vall);
			    });
				 if($rootScope.s6){
					 for(var w=0;w<$rootScope.s6.length;w++){
						 for(var t=0;t<$scope.arr6.length;t++){
							if($rootScope.s6[w].formatCode == $scope.arr6[t]){
								$scope.S6List = $rootScope.s6[w];
								$rootScope.S6ListResult.push($scope.S6List);
							}
						 }
					 }
				 }
		});  
		$("#addall9").click(function(){  
			$("#s10").append($("#s9 option").attr("selected",true));  
			$scope.arr6 = [];
			$scope.S6List = {};
			$rootScope.S6ListResult = [];
			 $("#s10 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr6.push(vall);
		    });
			 if($rootScope.s6){
				 for(var w=0;w<$rootScope.s6.length;w++){
					 for(var t=0;t<$scope.arr6.length;t++){
						if($rootScope.s6[w].formatCode == $scope.arr6[t]){
							$scope.S6List = $rootScope.s6[w];
							$rootScope.S6ListResult.push($scope.S6List);
						}
					 }
				 }
			 }
		});  
		$("#removeall9").click(function(){  
			$("#s9").append($("#s10 option").attr("selected",true));  
			$rootScope.S6ListResult = [];
		});   
		//收费项目信息
		 $("#s11 option").remove();
		 $("#s12 option").remove();
		$scope.kparamss = {
				operationMode : $scope.proObjectInf.operationMode,
				periodicFeeIdentifier :"P"
		};
		jfRest.request('feeProject', 'query', $scope.kparamss).then(function(data) {
			var k =data.returnData.rows;
			console.log(k);
			$rootScope.s12 = {};
			$rootScope.s12 = data.returnData.rows;
			$scope.querysParam = {
					productObjectCode : $scope.proObjectInf.productObjectCode,
					operationMode : $scope.proObjectInf.operationMode,
			};
			jfRest.request('feeProject', 'relatedProObjQuery', $scope.querysParam).then(function(data) {
				if(data.returnData){
					 var m =data.returnData.rows;
					 if(m!=undefined){
						 $rootScope.S12ListResult = [];
						 for(var z=0;z<m.length;z++){
							$rootScope.S12ListResult.push(m[z]);
						 }
					    	for(var i=0;i<m.length;i++){
					    		$("#s12").append("<option value='"+m[i].feeItemNo+"'>"+m[i].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+m[i].feeDesc+"</option>"); 
					    	}
							//查找重复数据
						    var isrep;
						    for(var j =0;j<k.length;j++){
						    	isrep = false;
						    	for(var i=0;i<m.length;i++){
							    	if(m[i].feeItemNo==k[j].feeItemNo){
							    		isrep = true;
							    		break;
							    	}
							    }
						    	if(!isrep){
									$("#s11").append("<option value='"+k[j].feeItemNo+"'>"+k[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+k[j].feeDesc+"</option>"); 
						    		}
                            }
                     }else{
							   for(var i=0;i<k.length;i++){
						    	 $("#s11").append("<option value='"+k[i].feeItemNo+"'>"+k[i].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+k[i].feeDesc+"</option>"); 
						  }
					   }
				}
			});
		}); 
		/*-----选择收费项目，收费项目和收费项目描述的查询方法-----*/
		$scope.queryFeeItemList = function(){
			 $("#s11").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				feeItemNo: $scope.proObjectInf.feeItemNo,
				feeType: $scope.proObjectInf.feeType,
				periodicFeeIdentifier :"P"
		 	};
			 jfRest.request('feeProject', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 	$scope.arr02 = [];
					$("#s12 option").each(function () {
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
						    	if(n[i]==a[j].feeItemNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s11").append("<option value='"+a[j].feeItemNo+"'>"+a[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].feeDesc+"</option>"); 
					    	}
                        }
                     }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s11").append("<option value='"+a[j].feeItemNo+"'>"+a[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].feeDesc+"</option>"); 
						   }
				   }
				});
	 		};
		/*-----end选择收费项目，收费项目和卡描述的查询方法-----*/
		//选择收费项目
		$("#s11").dblclick(function(){  
			 var alloptions = $("#s11 option");  
			 var so = $("#s11 option:selected");  
			 $("#s12").append(so); 
			 $scope.arr12 = [];
			$scope.S12List = {};
			$rootScope.S12ListResult = [];
			 $("#s12 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr12.push(vall);
		    });
			 if($rootScope.s12){
				 for(var w=0;w<$rootScope.s12.length;w++){
					 for(var t=0;t<$scope.arr12.length;t++){
						if($rootScope.s12[w].feeItemNo == $scope.arr12[t]){
							$scope.S12List = $rootScope.s12[w];
							$rootScope.S12ListResult.push($scope.S12List);
						}
					 }
				 }
			 }
		});  
		$("#s12").dblclick(function(){  
			 var alloptions = $("#s12 option");  
			 var so = $("#s12 option:selected");  
			 $("#s11").append(so);  
			 $scope.arr12 = [];
				$scope.S12List = {};
				$rootScope.S12ListResult = [];
				 $("#s12 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr12.push(vall);
			    });
				 if($rootScope.s12){
					 for(var w=0;w<$rootScope.s12.length;w++){
						 for(var t=0;t<$scope.arr12.length;t++){
							if($rootScope.s12[w].feeItemNo == $scope.arr12[t]){
								$scope.S12List = $rootScope.s12[w];
								$rootScope.S12ListResult.push($scope.S12List);
							}
						 }
					 }
				 }
		});  
		$("#add11").click(function(){  
			 var alloptions = $("#s11 option");  
			 var so = $("#s11 option:selected");  
			 $("#s12").append(so); 
			 $scope.arr12 = [];
				$scope.S12List = {};
				$rootScope.S12ListResult = [];
				 $("#s12 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr12.push(vall);
			    });
				 if($rootScope.s12){
					 for(var w=0;w<$rootScope.s12.length;w++){
						 for(var t=0;t<$scope.arr12.length;t++){
							if($rootScope.s12[w].feeItemNo == $scope.arr12[t]){
								$scope.S12List = $rootScope.s12[w];
								$rootScope.S12ListResult.push($scope.S12List);
							}
						 }
					 }
				 }
		});  
		$("#remove11").click(function(){  
			 var alloptions = $("#s12 option");  
			 var so = $("#s12 option:selected");  
			 $("#s11").append(so);
			 $scope.arr12 = [];
				$scope.S12List = {};
				$rootScope.S12ListResult = [];
				 $("#s12 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr12.push(vall);
			    });
				 if($rootScope.s12){
					 for(var w=0;w<$rootScope.s12.length;w++){
						 for(var t=0;t<$scope.arr12.length;t++){
							if($rootScope.s12[w].feeItemNo == $scope.arr12[t]){
								$scope.S12List = $rootScope.s12[w];
								$rootScope.S12ListResult.push($scope.S12List);
							}
						 }
					 }
				 }
		});  
		$("#addall11").click(function(){  
			$("#s12").append($("#s11 option").attr("selected",true));  
			$scope.arr12 = [];
			$scope.S12List = {};
			$rootScope.S12ListResult = [];
			 $("#s12 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr12.push(vall);
		    });
			 if($rootScope.s12){
				 for(var w=0;w<$rootScope.s12.length;w++){
					 for(var t=0;t<$scope.arr12.length;t++){
						if($rootScope.s12[w].feeItemNo == $scope.arr12[t]){
							$scope.S12List = $rootScope.s12[w];
							$rootScope.S12ListResult.push($scope.S12List);
						}
					 }
				 }
			 }
		});  
		$("#removeall11").click(function(){  
			$("#s11").append($("#s12 option").attr("selected",true));  
			$rootScope.S12ListResult = [];
		});  
		//查询产品实例构件
		$rootScope.queryMODP = {
				params : $scope.queryParam = {
						//operationMode: $scope.proObjectInf.operationMode,
						instanCode:$scope.proObjectInf.productObjectCode,
						operationMode : $scope.proObjectInf.operationMode
				}, // 表格查询时的参数信息
				//autoQuery: false,
				paging : false,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						//$scope.isshow99 = false;//隐藏 下一步按钮
						$scope.instanProductShow = true;//显示实例化
						if(data.returnData){
							if(data.returnData.rows == undefined ||  data.returnData.rows == null  ||data.returnData.rows == ''){
								data.returnData.rows =[];
							}else {
								$rootScope.queryMODP.data = data.returnData.rows;
								for(var i =0; i < data.returnData.rows.length; i++){
									data.returnData.rows[i].segmentNumber = $scope.proObjectInf.segmentNumber;
                                }
                            }
						}
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
				$scope.modal('/a_operatMode/product/selectPCDUpdate.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdate]
				});
		};
		$scope.choseSelectTwoUpdate = function(result) {
			$scope.items = {};
			$rootScope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			//$rootScope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$rootScope.queryMODP.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$rootScope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
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
				$scope.modal('/a_operatMode/product/selectElementNoUpdate.html', $scope.itemsNo, {
					title : T.T('F00138'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectAUpdate]
				});
		};
		$scope.choseSelectAUpdate = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$rootScope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$rootScope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$rootScope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			if (result.scope.pcdInstanShow) {
				//$rootScope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$rootScope.queryMODP.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
				$rootScope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		}
	});
	//******************************余额对象设置参数值pcd修改3333333333333***************
	webApp.controller('selectPCD2Ctrl',function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
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
				$scope.pcdTypeUpdateP = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdateP)',function(event){
			 $scope.pcdTypeUpdateP = event.value;
		 });
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
			$scope.segmentTypeUpdateP = $scope.pcdExampleInf.segmentType;
			}
		};
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		$scope.updateSaveFlag = false;//记录是否修改或新增
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.indexNoTemp = '';
			$scope.updateSaveFlag = false;//新增
			$scope.pcdExampleInfUpdate = {};
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
		}else{
			$scope.showNewPcdInfoUpdate = true;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
			if(item.id != null && item.id != undefined && item.id != '' && item.id){
				$rootScope.deletePcdInstanIdList.push(item.id);
            }
        };
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
			$scope.updateSaveFlag = true;  //删除
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdExampleInfUpdate.pcdPoint|| (null== $scope.pcdExampleInfUpdate.pcdType &&  $scope.pcdTypeUpdateP == null)
	    			 || null== $scope.pcdExampleInfUpdate.pcdValue 
	    			  ) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
				pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
				pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
				pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
				pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
				pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
				pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeUpdateP;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.updateSaveFlag){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInfUpdate.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeUpdateP;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInfUpdate.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInfUpdate.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
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
			$scope.choseInstanCode1Btn = function() {
				$scope.checkValidate();
				//获取维度取值1的值
				dataValueCount =1;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen1);
			};
			$scope.choseInstanCode2Btn = function() {
				$scope.checkValidate();
				//获取维度取值2的值
				dataValueCount =2;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen2);
			};
			$scope.choseInstanCode3Btn = function() {
				$scope.checkValidate();
				//获取维度取值3的值
				dataValueCount =3;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen3);
			};
			$scope.choseInstanCode4Btn = function() {
				$scope.checkValidate();
				//获取维度取值4的值
				dataValueCount =4;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen4);
			};
			$scope.choseInstanCode5Btn = function() {
				$scope.checkValidate();
				//获取维度取值5的值
				dataValueCount =5;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen5);
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
	//******************************替换参数22222222222222***************
	webApp.controller('selectElementNo2Ctrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
});
