'use strict';
define(function(require) {
	var webApp = require('app');
	//业务形态排除构件查询及维护
	webApp.controller('projectTypeQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/projectType/i18n_projectType');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
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
			   	   	if($scope.eventList.search('COS.UP.02.0018') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		//查询项目类型
		$scope.projectTypeList = {
			params : {
				findCRDAndRLNMark:'true',
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'projectType.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
		//查询详情
		$scope.checkBsRemArti = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.projectTypeItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/projectType/projectTypeView.html', $scope.projectTypeItem, {
				title : T.T('PZJ1700001'),
				buttons : [  T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateBsRemArti= function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.Influencept = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/projectType/projectTypeMod.html',$scope.Influencept, {
				title : T.T('PZJ1700002'),
				buttons : [ T.T('F00125'), T.T('F00012') ],
				size : [ '950px', '500px' ],
				callbacks : [ $scope.projectTypeInfluence ]
			});
		};
		$scope.projectTypeInfluence = function(result){
			$scope.projectTypeUpdate = "";
			$scope.projectTypeUpdate = result.scope.Influencept;
			$scope.safeApply();
			 result.cancel();
			$scope.modal('/beta/projectType/projectTypeUpdate.html', $scope.projectTypeUpdate, {
				title : T.T('PZJ1700003'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.saveProjectType]
			});
		};
		//保存
		$scope.saveProjectType = function (result){
			$scope.projectTypeUInfo = {};
			$scope.projectTypeUInfo.businessPattern = result.scope.projectTypeUpdate;
			$scope.projectTypeUInfo.artifactList = $rootScope.S2ListResult;
			jfRest.request('projectType', 'update', $scope.projectTypeUInfo).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
				}
			});
		};
	});
	//查询业务形态排除构件，
	webApp.controller('viewProjectTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/projectType/i18n_projectType');
		$translate.refresh();
		if($scope.projectTypeItem == 'CRD'){
			$scope.businessPattern = 'CRD';
            $scope.patternDesc = T.T('PZJ1700004');
        }else if($scope.projectTypeItem == 'RLN'){
			$scope.businessPattern = 'RLN';
			$scope.patternDesc = T.T('PZJ1700005');
		}
		//查询业务形态排除构件
		$scope.bsProjectTypeList = {
			params : {
					businessPattern :$scope.projectTypeItem,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'projectType.bsquery',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//修改业务形态排除构件
	webApp.controller('updateProjectTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/projectType/i18n_projectType');
		$translate.refresh();
		if($scope.projectTypeUpdate == 'CRD'){
			$scope.businessPattern = 'CRD';
			$scope.patternDesc = T.T('PZJ1700004');
		}else if($scope.projectTypeUpdate == 'RLN'){
			$scope.businessPattern = 'RLN';
			$scope.patternDesc = T.T('PZJ1700005');
		}
		 $("#s47 option").remove();
		 $("#s48 option").remove();
		$scope.setparamss = {};
		jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s47 = {};
			$rootScope.s47 = data.returnData.rows;
			$scope.projectTypebs = {};
			$scope.projectTypebs.businessPattern = $scope.projectTypeUpdate;
			jfRest.request('projectType', 'bsquery', $scope.projectTypebs).then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.S2ListResult = [];
						 for(var t=0;t<n.length;t++){
							$rootScope.S2ListResult.push(n[t]);
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s48").append("<option value='"+n[i].artifactNo+"'>"+n[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].artifactDesc+"</option>"); 
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
					    		angular.element("#s47").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s47").append("<option value='"+a[i].artifactNo+"'>"+a[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].artifactDesc+"</option>"); 
					  }
				   }
			});
		});
		/*-----根据修改排除构件和构件描述查询-----*/
		$scope.queryModify = function(){
			 $("#s47").empty();
			 $scope.setparamss = {
				artifactNo: $scope.removebusArtiItem.artifactNo,
				artifactDesc: $scope.removebusArtiItem.artifactDesc
			};
			jfRest.request('elmList', 'query', $scope.setparamss).then(function(data) {
				var a =data.returnData.rows;
				$scope.arr02 = [];
				$("#s48 option").each(function () {
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
				    		$("#s47").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	}
                     }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
			    		 $("#s47").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
			    	  }
			      }
			});
		};
		/*-----end 修改排除构件和构件描述查询-----*/
		//功能分配菜单
		$("#s47").dblclick(function(){  
			 var alloptions = $("#s47 option");  
			 var so = $("#s47 option:selected");  
			 $("#s48").append(so);
			$scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S2ListResult = [];
			 $("#s48 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s47){
				 for(var w=0;w<$rootScope.s47.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s47[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s47[w];
							$rootScope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#s48").dblclick(function(){  
			 var alloptions = $("#s48 option");  
			 var so = $("#s48 option:selected");  
			 $("#s47").append(so);  
			 $scope.arr2 = [];
				$scope.S2List = {};
				$rootScope.S2ListResult = [];
				 $("#s48 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s47){
					 for(var w=0;w<$rootScope.s47.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s47[w].artifactNo == $scope.arr2[t]){
								$scope.S2List = $rootScope.s47[w];
								$rootScope.S2ListResult.push($scope.S2List);
							}
						 }
					 }
				 }
		});  
		$("#add47").click(function(){  
			 var alloptions = $("#s47 option");  
			 var so = $("#s47 option:selected");  
			 $("#s48").append(so); 
			 $scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S2ListResult = [];
			 $("#s48 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s47){
				 for(var w=0;w<$rootScope.s47.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s47[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s47[w];
							$rootScope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#remove47").click(function(){  
			 var alloptions = $("#s48 option");  
			 var so = $("#s48 option:selected");  
			 $("#s47").append(so);
			 $scope.arr2 = [];
				$scope.S2List = {};
				$rootScope.S2ListResult = [];
				 $("#s48 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s47){
					 for(var w=0;w<$rootScope.s47.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s47[w].artifactNo == $scope.arr2[t]){
								$scope.S2List = $rootScope.s47[w];
								$rootScope.S2ListResult.push($scope.S2List);
							}
						 }
					 }
				 }
		});  
		$("#addall47").click(function(){  
			$("#s48").append($("#s47 option").attr("selected",true));  
			$scope.arr2 = [];
			$scope.S2List = {};
			$rootScope.S2ListResult = [];
			 $("#s48 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s47){
				 for(var w=0;w<$rootScope.s47.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s47[w].artifactNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s47[w];
							$rootScope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
		});  
		$("#removeall47").click(function(){  
			$("#s47").append($("#s48 option").attr("selected",true));  
			$rootScope.S2ListResult = [];
		});
	});
	//受影响的产品列表
	webApp.controller('projectTypeModCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
					programType : $scope.Influencept,
				//	operationMode : $scope.InfluenceInf.operationMode,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery :true,
			resource : 'projectType.influence',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});	
});
