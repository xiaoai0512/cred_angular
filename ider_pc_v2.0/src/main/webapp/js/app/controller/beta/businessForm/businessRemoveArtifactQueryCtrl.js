'use strict';
define(function(require) {
	var webApp = require('app');
	//业务形态排除构件查询及维护
	webApp.controller('businessRemoveArtifactQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/businessForm/i18n_businessForm');
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
		   	   		if($scope.eventList.search('COS.IQ.02.0035') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0034') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0030') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
		//$scope.businessPattern = [{name:"R1",id:"R1"},{name:"R2",id:"R2"},{name:"S1",id:"S1"},{name:"S2",id:"S2"}];
		$scope.businessPatternArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"businessPattern", //下拉框显示内容，根据需要修改字段名称 
		        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"businessRemoveArtifact.queryBsForm",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//查询业务形态
		$scope.businessFormList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessRemoveArtifact.queryBsForm',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkBsRemArti = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.bsRemArtifItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/businessForm/viewBsRemArtif.html', $scope.bsRemArtifItem, {
				title : T.T('PZJ1400003'),
				buttons : [  T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateBsRemArti= function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.removebusArtiItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/businessForm/updateBsRemArtif.html', $scope.removebusArtiItem, {
				title : T.T('PZJ1400004'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.saveBusArtiInf]
			});
		};
		//保存
		$scope.saveBusArtiInf = function (result){
			$scope.rmBsAtrInfo = {};
			$scope.rmBsAtrInfo = Object.assign($scope.rmBsAtrInfo, $scope.removebusArtiItem);
			$scope.rmBsAtrInfo.artifactList = $rootScope.S2ListResult;
			//if($scope.rmBsAtrInfo.artifactList.length == 0){
			//jfLayer.fail("至少排除一个构件");
			//return;
			//}else{
				jfRest.request('businessForm', 'update', $scope.rmBsAtrInfo)//Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00022'));
						 $scope.safeApply();
						 result.cancel();
						 $scope.businessFormList.search();
					}
				});
			//}
		};
		//新增
		$scope.addBusiness = function(){
			$scope.businessProInf = {};
			$scope.modal('/beta/businessForm/businessRemoveArtifactEst.html', $scope.businessProInf, {
				title : T.T('PZJ1400005'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.sureAddBusArtiInf]
			});
		};
		//确定增加
		$scope.sureAddBusArtiInf = function(result){
			//保存事件
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S2ListResult = [];
			 $("#s42 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s42){
				 for(var w=0;w<$rootScope.s42.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s42[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s42[w];
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			$scope.removeArtifactInf = result.scope.removeArtifactInf;
			$scope.removeArtifactInf.artifactList = $scope.S2ListResult;
				// if($scope.removeArtifactInf.artifactList.length==0){
				//jfLayer.fail("至少排除一个构件");
				//return;
				//}else{
				jfRest.request('businessForm', 'save', $scope.removeArtifactInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						$scope.removeArtifactInf = {};
						$scope.artifactSelect =[];
						$scope.safeApply();
						 result.cancel();
						 $scope.businessFormList.search();
					}
				});
			//}
		};
	});
	//查询业务形态排除构件，
	webApp.controller('viewBsRemArtifCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//查询业务形态排除构件
		$scope.bsRemArtifList = {
			params : {
					"businessPattern" :$scope.bsRemArtifItem.businessPattern,
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessRemoveArtifact.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//修改业务形态排除构件
	webApp.controller('updateBsRemArtifCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/businessForm/i18n_businessForm');
		$translate.refresh();
		$("#s49 option").remove();
		 $("#s50 option").remove();
		$scope.setparamss = {};
		jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s49 = {};
			$rootScope.s49 = data.returnData.rows;
			jfRest.request('businessRemoveArtifact', 'query', $scope.removebusArtiItem).then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.S2ListResult = [];
						 for(var t=0;t<n.length;t++){
							$rootScope.S2ListResult.push(n[t]);
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s50").append("<option value='"+n[i].artifactNo+"'>"+n[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].artifactDesc+"</option>"); 
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
					    		angular.element("#s49").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s49").append("<option value='"+a[i].artifactNo+"'>"+a[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].artifactDesc+"</option>"); 
					  }
				   }
			});
		});
		/*-----根据修改排除构件和构件描述查询-----*/
		$scope.queryModify = function(){
			 $("#s49").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				artifactNo: $scope.removebusArtiItem.artifactNo,
				artifactDesc: $scope.removebusArtiItem.artifactDesc
			};
			jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
				var a =data.returnData.rows;
				$scope.arr02 = [];
				$("#s50 option").each(function () {
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
				    		$("#s49").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	}
                     }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
			    		 $("#s49").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
			    	  }
			      }
			});
		};
		/*-----end 修改排除构件和构件描述查询-----*/
		//功能分配菜单
		$("#s49").dblclick(function(){  
			 var alloptions = $("#s49 option");  
			 var so = $("#s49 option:selected");  
			 $("#s50").append(so);
			$scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S2ListResult = [];
			 $("#s50 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s49){
				 for(var w=0;w<$rootScope.s49.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s49[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s49[w];
							$rootScope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#s50").dblclick(function(){  
			 var alloptions = $("#s50 option");  
			 var so = $("#s50 option:selected");  
			 $("#s49").append(so);  
			 $scope.arr2 = [];
				$scope.S2List = {};
				$rootScope.S2ListResult = [];
				 $("#s50 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s49){
					 for(var w=0;w<$rootScope.s49.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s49[w].artifactNo == $scope.arr2[t]){
								$scope.S2List = $rootScope.s49[w];
								$rootScope.S2ListResult.push($scope.S2List);
							}
						 }
					 }
				 }
		});  
		$("#add49").click(function(){  
			 var alloptions = $("#s49 option");  
			 var so = $("#s49 option:selected");  
			 $("#s50").append(so); 
			 $scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S2ListResult = [];
			 $("#s50 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s49){
				 for(var w=0;w<$rootScope.s49.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s49[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s49[w];
							$rootScope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#remove49").click(function(){  
			 var alloptions = $("#s50 option");  
			 var so = $("#s50 option:selected");  
			 $("#s49").append(so);
			 $scope.arr2 = [];
				$scope.S2List = {};
				$rootScope.S2ListResult = [];
				 $("#s50 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s49){
					 for(var w=0;w<$rootScope.s49.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s49[w].artifactNo == $scope.arr2[t]){
								$scope.S2List = $rootScope.s49[w];
								$rootScope.S2ListResult.push($scope.S2List);
							}
						 }
					 }
				 }
		});  
		$("#addall49").click(function(){  
			$("#s50").append($("#s49 option").attr("selected",true));  
			$scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S2ListResult = [];
			 $("#s50 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s49){
				 for(var w=0;w<$rootScope.s49.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s49[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s49[w];
							$rootScope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#removeall49").click(function(){  
			$("#s49").append($("#s50 option").attr("selected",true));  
			$rootScope.S2ListResult = [];
		});
	});
	//业务形态排除构件建立
	webApp.controller('businessRemoveArtifactEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/businessForm/i18n_businessForm');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.removeArtifactInf = {};
		//新增业务状态下拉R1、R2、S1、S2
		$scope.businessPatternArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_businessStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 构件配置的选择元件列表
			$("#s41 option").remove();
			 $("#s42 option").remove();
			$scope.setparamss = {};
			jfRest.request('elmList', 'query', $scope.setparamss)
			.then(function(data) {
				var a =data.returnData.rows;
				$rootScope.s42 = {};
				$rootScope.s42 =data.returnData.rows;
				for(var i=0;i<a.length;i++){
					$("#s41").append("<option value='"+a[i].artifactNo+"'>"+a[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].artifactDesc+"</option>"); 
			   }
			});
			/*-----根据排除构件和排除构件描述查询-----*/
			$scope.queryAddComponent = function(){
				 $("#s41").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					artifactNo: $scope.removeArtifactInf.artifactNo,
					artifactDesc: $scope.removeArtifactInf.artifactDesc
				};
				jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
					var a =data.returnData.rows;
					$scope.arr02 = [];
					$("#s42 option").each(function () {
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
					    		$("#s41").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
					    	}
                         }
                    }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
				    		 $("#s41").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	  }
				      }
				});
			};
			/*-----end 排除构件和排除构件描述查询-----*/	
			$("#s41").dblclick(function(){  
				 var alloptions = $("#s41 option");  
				 var so = $("#s41 option:selected");  
				 $("#s42").append(so);  
			});  
			$("#s42").dblclick(function(){  
				 var alloptions = $("#s42 option");  
				 var so = $("#s42 option:selected");  
				 $("#s41").append(so);  
			});  
			$("#add41").click(function(){  
				 var alloptions = $("#s41 option");  
				 var so = $("#s41 option:selected");  
				 $("#s42").append(so); 
			});  
			$("#remove41").click(function(){  
				 var alloptions = $("#s42 option");  
				 var so = $("#s42 option:selected");  
				 $("#s41").append(so);
			});  
			$("#addall41").click(function(){  
				$("#s42").append($("#s41 option").attr("selected",true));  
			});  
			$("#removeall41").click(function(){  
				$("#s41").append($("#s42 option").attr("selected",true));  
			});  
	});
});
