'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易限制维护及查询
	webApp.controller('accessListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		//关联岗位
		 $scope.authjobArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"postName", //下拉框显示内容，根据需要修改字段名称 
		        value:"postNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"jobManage.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
			//关联部门
		 $scope.authroleArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"departmentName", //下拉框显示内容，根据需要修改字段名称 
		        value:"departmentNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"roleManage.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
			//运营模式
/*		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };*/
		// $scope.coArray = [{name : '亚历山大' ,id : 'A01'}] ;
		 //运营机构
		 $scope.operationOrganArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"organName", //下拉框显示内容，根据需要修改字段名称 
		        value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationOrgan.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 $scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.checkBtnFlag = false;
		 $scope.setBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.CS.01.0013') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0016') != -1){    //查看
	   					$scope.checkBtnFlag = true;
	   				}
	   				else{
	   					$scope.checkBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0014') != -1){    //设置
	   					$scope.setBtnFlag = true;
	   				}
	   				else{
	   					$scope.setBtnFlag = false;
	   				}
   				}
   			});
			//设置权限
			$scope.itemList = {
					params : $scope.queryParam = {
							pageSize:10,
							indexNo:0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					autoQuery:false,
					resource : 'accessManage.query',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
					}
				};
		$scope.seachAccess = function(){
			if(($scope.itemList.params.operationOrgan == "" || $scope.itemList.params.operationOrgan == undefined || $scope.itemList.params.operationOrgan == null) 
					|| ($scope.itemList.params.departmentNo == "" || $scope.itemList.params.departmentNo == undefined || $scope.itemList.params.departmentNo == null) 
					|| ($scope.itemList.params.postNo == "" || $scope.itemList.params.postNo == undefined || $scope.itemList.params.postNo == null)){
				jfLayer.alert(T.T("YWJ5500059"));
			}
			else{
				$scope.itemList.search();
			}
		};
		//设置权限
		$scope.setAccess = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/accessManage/setAccess.html', $scope.item, {
				title : T.T('YWJ5500056'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '530px' ],
				callbacks : [$scope.accessSetSure ]
			});
		};
		//确定设置权限
		$scope.accessSetSure = function(result){
			if(result.scope.nodes){
				$scope.nodes = result.scope.nodes;
				$scope.addAccessPar = {};
				$scope.addAccessPar.coreMenuEventList = [];
			   	$scope.addAccessPar.operationMode = '';
				$scope.addAccessPar.operationOrgan = $scope.item.operationOrgan;
				$scope.addAccessPar.departmentNo = $scope.item.departmentNo;
				$scope.addAccessPar.postNo = $scope.item.postNo;
				for( var i = 0; i < $scope.nodes.length; i++){
					if($scope.nodes[i].eventNo == "" || $scope.nodes[i].eventNo == undefined || $scope.nodes[i].eventNo == null){
						$scope.addAccessPar.coreMenuEventList.push({'menuNo':$scope.nodes[i].menuNo,'menuName':$scope.nodes[i].menuName,'upperMenuNo':$scope.nodes[i].upperMenuNo});
					}
					else{
						$scope.addAccessPar.coreMenuEventList.push({'menuNo':$scope.nodes[i].eventNo+$scope.nodes[i].upperMenuNo,'menuName':$scope.nodes[i].menuName,'eventNo':$scope.nodes[i].eventNo,'upperMenuNo':$scope.nodes[i].upperMenuNo});
					}
				}
				 jfRest.request('accessManage', 'addSet', $scope.addAccessPar).then(function(data) {
		                if (data.returnMsg == 'OK') {
		                	jfLayer.success(T.T("YWJ5500057"));
		                	$scope.addSet = {};
		                	$scope.itemList.search();
		                }
		    			$scope.safeApply();
		    			result.cancel();
		            });
			}else {
				$scope.safeApply();
    			result.cancel();
            }
        };
		//确定设置权限
		$scope.accessSetSure1 = function(result){
			$scope.accAdd={};
			var arr = [];
			 $("#s28 option").each(function () {
		        var vall = $(this).val();
		        arr.push(vall);
		    });
			 $scope.accAdd.coreMenuLists = arr;
			 $scope.accAdd.departmentNo = $scope.item.departmentNo;
			 $scope.accAdd.postNo = $scope.item.postNo;
			 $scope.accAdd.operationOrgan = $scope.item.operationOrgan;
			 jfRest.request('accessManage', 'addSet', $scope.accAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T("YWJ5500057"));
                	$scope.addSet = {};
                	$scope.itemList.search();
                }
    			$scope.safeApply();
    			result.cancel();
            });
		};
		//查看权限详情
		$scope.accessInfo = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/accessManage/accessInfo.html', $scope.item, {
				title : T.T('YWJ5500056'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '900px', '530px' ],
				callbacks : [$scope.accessInfoSure ]
			});
		};
		//确定查看权限
		$scope.accessInfoSure = function(result){
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('accessSetCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,T,$translatePartialLoader ) {
	  	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.username = sessionStorage.getItem("userName" );//用户名
    	$scope.password = sessionStorage.getItem("password" );//用户名
		var zTree;
    	//引用树插件
    	Tansun.loadCss($rootScope.global.cssPath + '/zTreeStyle/zTreeStyle.css') ;
		Tansun.loadScript('jquery-ztree', function(script) {
    		   // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
			 var setting = {    
			            check:{
			                enable:true
			            },
			            data:    {
			            	key:
		                   {
		                	   name: 'menuName',//节点名称
		                	   checked: "isChecked"
  						  // children: ''//子节点名
		                   },
			                simpleData:{
			                    enable:true,
			                    idKey: 'menuNo',//节点id
	    						pIdKey: 'upperMenuNo'
			                }
			            },
			            callback:{
			                onCheck:zTreeOnCheck
			            }
			        };
			//勾选已有的快捷菜单
 	        $scope.checkedQucikMenu = function(){
 	        	$scope.departmentNoSel = $scope.item.departmentNo;
 				 $scope.postNoSel = $scope.item.postNo;
 				 $scope.operationOrganSel = $scope.item.operationOrgan;
 				 $scope.params = {
 						postNo:$scope.postNoSel,
 						departmentNo:$scope.departmentNoSel,
 						operationOrgan:$scope.operationOrganSel
 				 };
 		   			jfRest.request('accessManage','queryMenu',$scope.params).then(function(data) {
 	        			if(data.returnCode == '000000'){
 	        				$scope.getMenuListArr = data.returnData.coreGrantsList;
 	        				 $scope.getzTree = $.fn.zTree.getZTreeObj("treeDemoT");
 	        				angular.forEach($scope.getMenuListArr,function(item,index){
 	        					$scope.getzTree.checkNode($scope.getzTree.getNodeByParam("menuNo" ,item.menuNo), true);//反选
// 	        					$scope.getzTree.expandNode($scope.getzTree.getNodeByParam("menuNo" ,item.menuNo), true);  //展开已勾选
 	      					});
 	        			}
 	        		});
 	        };
			 $scope.params = {};
	   			jfRest.request('accessManage','selAllMenu',$scope.params).then(function(data) {
	   				if(data.returnCode == '000000'){
	   					$scope.allMenuList = data.returnData.coreMenuList;
	   					$scope.alleventList = data.returnData.coreMenuEventList;
	   					for(var i=0;i<$scope.allMenuList.length;i++){
	   						if($scope.allMenuList[i].lowerMenuFlag == 0){
	   							for(var j=0;j<$scope.alleventList.length;j++){
	   								if($scope.alleventList[j].upperMenuNo == $scope.allMenuList[i].menuNo){
	   									$scope.allMenuList.push($scope.alleventList[j]);
	   								}
	   							}
	   						}
	   					}
	   					$scope.checkedQucikMenu();
	   					$.fn.zTree.init($("#treeDemoT"), setting, $scope.allMenuList);
	   				}
	   			}); 
    		   //Check  Function
    		   function zTreeOnCheck(event, treeId, treeNode) {
   					$scope.treeObj = $.fn.zTree.getZTreeObj("treeDemoT");
   					$scope.nodes = $scope.treeObj.getCheckedNodes(true);
               }
        });
	});
	//两边都是树状
	webApp.controller('accessSetCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,T,$translatePartialLoader ) {
	  	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.username = sessionStorage.getItem("userName" );//用户名
    	$scope.password = sessionStorage.getItem("password" );//用户名
    	var zTree;
    	//引用树插件
    	Tansun.loadCss($rootScope.global.cssPath + '/zTreeStyle/zTreeStyle.css') ;
		Tansun.loadScript('jquery-ztree', function(script) {
    		   // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
			 var setting = {    
			            check:{
			                enable:true
			            },
			            data:    {
			            	key:
 		                   {
 		                	   name: 'menuName',//节点名称
 		                	   checked: "isChecked"
     						  // children: ''//子节点名
 		                   },
			                simpleData:{
			                    enable:true,
			                    idKey: 'menuNo',//节点id
	    						pIdKey: 'upperMenuNo'
			                }
			            },
			            callback:{
			                onCheck:zTreeOnCheck
			            }
			        };
			 	$scope.params = {
	   	    	};
	   			jfRest.request('accessManage','selAllMenu',$scope.params).then(function(data) {
	   				if(data.returnCode == '000000'){
	   					$scope.allMenuList = data.returnData.coreMenuList;
	   					$scope.alleventList = data.returnData.coreMenuEventList;
	   					for(var i=0;i<$scope.allMenuList.length;i++){
	   						if($scope.allMenuList[i].lowerMenuFlag == 0){
	   							for(var j=0;j<$scope.alleventList.length;j++){
	   								if($scope.alleventList[j].upperMenuNo == $scope.allMenuList[i].menuNo){
	   									$scope.allMenuList.push($scope.alleventList[j]);
	   								}
	   							}
	   						}
	   					}
	   					$.fn.zTree.init($("#roleTree"), setting, $scope.allMenuList);
	   				}
	   			});       
			// $.fn.zTree.init($("#roleTree"), setting, zNodes);
    		 //  $scope.addedRoleTree.pFunction.loadTree(); //加载角色树
    		 //  $scope.roleTree.pFunction.loadTree();
    		   //Check  Function
    		   function zTreeOnCheck(event, treeId, treeNode) {
    			   	$scope.resultTree = '';
   					$scope.treeObj = $.fn.zTree.getZTreeObj("roleTree");
   					$scope.nodes = $scope.treeObj.getCheckedNodes(true);
   					/*for( var i = 0; i < $scope.nodes.length; i++){
   						$scope.resultTree += $scope.nodes[i].branchName + ',';
   					}*/
   					//resultTree = resultTree.substr(0, resultTree.length - 1);
   					//resultTreeA = resultTree;
               }
        });
		//添加角色
		$scope.addRole = function() {
		    //获取被添加节点的树——addedRoleTree
		    $scope.addedRoleObject = $.fn.zTree.getZTreeObj("addedRoleTree");
		    $scope.roleObject = $.fn.zTree.getZTreeObj("roleTree");
		    //nodes是一个array(json)数组，是所有被选中的节点
		    var nodes = $scope.roleObject.getCheckedNodes(true); 
		    //删除未分配角色中选中的节点——roleTree
		    for (var l = nodes.length, i = l - 1; i >= 0; i--) {
		    	//	$scope.roleObject.removeNode(nodes[i]);
		    	//	$scope.addedRoleObject.addNodes(null,nodes);
		    }
		};
		//添加全部角色
		function addRoleAll() {
		    //获取被添加节点的树——addedRoleTree
		    addedRoleObject = $.fn.zTree.getZTreeObj("addedRoleTree");
		    roleObject = $.fn.zTree.getZTreeObj("roleTree");
		    //获取所有的节点信息——roleTree
		    var nodes = roleObject.getNodes(); //nodes是一个array(json)数组，是所有被选中的节点
		    //把选中的节点，添加到已分配的角色中——addedRoleTree
		    addedRoleObject.addNodes(null, nodes);
		    //删除未分配角色中所有的节点——roleTree(i--的删除有效,i++的删除会出现错误)
		    for (var l = nodes.length, i = l-1; i >= 0; i--) {
		        roleObject.removeNode(nodes[i]);
		    }
		}
		//删除角色
		function removeAddedRoleTree() {
		    //获取被添加节点的树——addedRoleTree
		    addedRoleObject = $.fn.zTree.getZTreeObj("addedRoleTree");
		    roleObject = $.fn.zTree.getZTreeObj("roleTree");
		    //获取选中的节点信息——addedRoleTree
		    var nodes = addedRoleObject.getCheckedNodes(true); //nodes是一个array(json)数组，是所有被选中的节点
		    //把选中的节点，添加到可分配的角色中——RoleTree
		    roleObject.addNodes(null, nodes);
		    //删除已分配角色中选中的节点——addedRoleTree
		    for (var l = nodes.length, i = l - 1; i >= 0; i--) {
		        addedRoleObject.removeNode(nodes[i]);
		    }
		}
		//删除全部角色
		function removeAllAddedRole() {
		    //获取被添加节点的树——addedRoleTree
		    addedRoleObject = $.fn.zTree.getZTreeObj("addedRoleTree");
		    roleObject = $.fn.zTree.getZTreeObj("roleTree");
		    //获取所有已分配的角色树中的节点信息——addedRoleTree
		    var nodes = addedRoleObject.getNodes(); //nodes是一个array(json)数组，是所有被选中的节点
		    //把已分配的角色信息，添加到可分配的角色中——RoleTree
		    roleObject.addNodes(null, nodes);
		    //删除已分配角色中的信息——addedRoleTree
		    for (var l = nodes.length, i = l - 1; i >= 0; i--) {
		        addedRoleObject.removeNode(nodes[i]);
		    }
		}
	});
	//设置 ==== 最老形式
	webApp.controller('accessSetCtrl01', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		 $scope.departmentNoSet = $scope.item.departmentNo;
		 $scope.postNoSet = $scope.item.postNo;
		 $scope.operationOrganSet = $scope.item.operationOrgan;
		 $("#s27 option").remove();
		 $("#s28 option").remove();
		$scope.setparamss = {};
		jfRest.request('accessManage', 'queryMenuAll', $scope.setparamss)
		.then(function(data) {
			var a =data.returnData.rows;
			$scope.setbparamss = {
					postNo:$scope.postNoSet,
					departmentNo:$scope.departmentNoSet,
					operationOrgan:$scope.operationOrganSet
			};
			jfRest.request('accessManage', 'queryMenu', $scope.setbparamss)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
				    	for(var i=0;i<n.length;i++){
				    		$("#s28").append("<option value='"+n[i].menuNo+"'>"+n[i].menuName+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].menuNo==a[j].menuNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
								$("#s27").append("<option value='"+a[j].menuNo+"'>"+a[j].menuName+"</option>"); 
					    		}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
					    	 $("#s27").append("<option value='"+a[i].menuNo+"'>"+a[i].menuName+"</option>"); 
					  }
				   }
			});
		});
		//功能分配菜单
//			$("#s27 option:first,#s28 option:first").attr("selected",true);  
			$("#s27").dblclick(function(){  
				 var alloptions = $("#s27 option");  
				 var so = $("#s27 option:selected");  
//				 so.get(so.length-1).index == alloptions.length-1?so.prev().attr("selected",true):so.next().attr("selected",true);  
				 $("#s28").append(so);  
			});  
			$("#s28").dblclick(function(){  
				 var alloptions = $("#s28 option");  
				 var so = $("#s28 option:selected");  
//				 so.get(so.length-1).index == alloptions.length-1?so.prev().attr("selected",true):so.next().attr("selected",true);  
				 $("#s27").append(so);  
			});  
			$("#add27").click(function(){  
				 var alloptions = $("#s27 option");  
				 var so = $("#s27 option:selected");  
//				 so.get(so.length-1).index == alloptions.length-1?so.prev().attr("selected",true):so.next().attr("selected",true);  
				 $("#s28").append(so); 
			});  
			$("#remove27").click(function(){  
				 var alloptions = $("#s28 option");  
				 var so = $("#s28 option:selected");  
//				 so.get(so.length-1).index == alloptions.length-1?so.prev().attr("selected",true):so.next().attr("selected",true);  
				 $("#s27").append(so);
			});  
			$("#addall27").click(function(){  
				$("#s28").append($("#s27 option").attr("selected",true));  
			});  
			$("#removeall27").click(function(){  
				$("#s27").append($("#s28 option").attr("selected",true));  
			});  
		/*	$("#s1up").click(function(){  
				 var so = $("#s27 option:selected");  
				 if(so.get(0).index!=0){  
				   so.each(function(){  
				       $(this).prev().before($(this));  
				   });  
				 }  
			});  
			$("#s1down").click(function(){  
				 var alloptions = $("#s27 option");  
				 var so = $("#s27 option:selected");  
				 if(so.get(so.length-1).index!=alloptions.length-1){  
					   for(var i=so.length-1;i>=0;i--)  
					   {  
					     var item = $(so.get(i));  
					     item.insertAfter(item.next());  
					   }  
				 }  
			}); */ 
			$('#s27up').unbind('click').click(function () {
				 var so = $("#s28 option:selected");  
				 if(so.get(0).index!=0){  
				   so.each(function(){  
				       $(this).prev().before($(this));  
				   });  
				 }  
			});  
			$('#s27down').unbind('click').click(function () {
				 var alloptions = $("#s28 option");  
				 var so = $("#s28 option:selected");  
				 if(so.get(so.length-1).index!=alloptions.length-1){  
					   for(var i=so.length-1;i>=0;i--)  
					   {  
					     var item = $(so.get(i));  
					     item.insertAfter(item.next());  
					   }  
				 }  
			});  
	});
	//详情
	webApp.controller('accessInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
/*		 $scope.departmentNoSel = $scope.item.departmentNo;
		 $scope.postNoSel = $scope.item.postNo;
		 $scope.operationOrganSel = $scope.item.operationOrgan;
		$scope.infoList = {
				params : $scope.queryParam = {
						postNo:$scope.postNoSel,
						departmentNo:$scope.departmentNoSel,
						operationOrgan:$scope.operationOrganSel,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:true,
				resource : 'accessManage.queryMenu',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};*/
	  	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
    	//引用树插件
    	Tansun.loadCss($rootScope.global.cssPath + '/zTreeStyle/zTreeStyle.css') ;
		Tansun.loadScript('jquery-ztree', function(script) {
    		   // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
			 var setting = {    
			            check:{
			                enable:false
			            },
			            data:    {
			            	key:
		                   {
		                	   name: 'menuName'//节点名称
  						  // children: ''//子节点名
		                   },
			                simpleData:{
			                    enable:true,
			                    idKey: 'menuNo',//节点id
	    						pIdKey: 'upperMenuNo'
			                }
			            }
			        };
			 $scope.departmentNoSel = $scope.item.departmentNo;
			 $scope.postNoSel = $scope.item.postNo;
			 $scope.operationOrganSel = $scope.item.operationOrgan;
			 $scope.params = {
					postNo:$scope.postNoSel,
					departmentNo:$scope.departmentNoSel,
					operationOrgan:$scope.operationOrganSel
			 };
	   			jfRest.request('accessManage','queryMenu',$scope.params).then(function(data) {
	   				if(data.returnCode == '000000'){
	   					$.fn.zTree.init($("#treeDemoInfo"), setting, data.returnData.coreGrantsList);
	   				}
	   			}); 
    	});
	});
});
