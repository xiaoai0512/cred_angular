'use strict';
define(function(require) {
	var webApp = require('app');
	// 网络连接状态
	webApp.controller('pStatusCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $timeout,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/network/i18n_networkStatus');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		 $scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.delBtnFlag = false;
		 $scope.networkStatus = false;
		 $scope.selBtnFlag = true;
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
	   	   			if($scope.eventList.search('AUS.PM.30.0001') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.30.0002') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.30.0003') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.30.0003') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
   				}
   			});
		//运营模式======法人实体下默认缺省运营模式
		//国际组织网络管理
		//营销清单查询
		$scope.itemList = {
			params: $scope.queryParam ={
					"authDataSynFlag":'1',
					"authFlag":'0',
					"remoteSystemInd":$scope.remoteSystemInd,
					"pageSize":10,
					"indexNo":0
		          },// 表格查询时的参数信息
		     paging : true,// 默认true,是否分页
		     autoQuery:true,
		     resource : 'network.parameterSelStatus',// 列表的资源
		     isTrans: true,//是否需要翻译数据字典
		     transParams : ['dic_connctModel','dic_serverClientInd','dic_connStatus'],//查找数据字典所需参数
			 transDict : ['connModel_connModelDesc','serverClientInd_serverClientIndDesc','connStatus_connStatusDesc'],//翻译前后key
		     callback : function(data) { // 表格查询后的回调函数
		   }
		};
		//新增事件
		$scope.addException = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/network/parameterStatusAdd.html', '', {
				title : T.T('SQJ3200019'),  //网络连接状态新增
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '600px' ],
				callbacks : [$scope.saveNegaInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveNegaInfo = function(result) {
			$scope.authAdd = {};
			$scope.authAdd = $.parseJSON(JSON.stringify(result.scope.pStatus));
	 		jfRest.request('network','addStatus', $scope.authAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));  //建立成功
                	$scope.safeApply();
	    			result.cancel();
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			  $scope.item = {};
			  // 页面弹出框事件(弹出页面)
			  $scope.item = $.parseJSON(JSON.stringify(event));
			  $scope.modal('/authorization/network/parameterStatusUpdate.html', $scope.item, {
					title : T.T('SQJ3200020'),  //网络连接状态新增
					buttons : [ T.T('F00031'),T.T('F00012')],
					size : [ '1100px', '600px' ],
					callbacks : [$scope.updateNegaInfo ]
				});
			};
		// 修改信息事件
		$scope.updateNegaInfo = function(result) {
				$scope.authAdd = {};
				$scope.authAdd = $.parseJSON(JSON.stringify(result.scope.item));
				$scope.authAdd.connModel = result.scope.connModelU;
				$scope.authAdd.includeHeaderInd = result.scope.includeHeaderIndU;
				$scope.authAdd.charCode = result.scope.charCodeU;
				$scope.authAdd.remoteSystemInd = result.scope.remoteSystemIndU;
		 		jfRest.request('network','updateStatus', $scope.authAdd).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success(T.T('F00022'));  //修改成功
	                	$scope.safeApply();
		    			result.cancel();
		    			$scope.itemList.search();
	                }
	            });
			};
			//查询详情事件
			$scope.selInfo = function(event) {
				  $scope.item = {};
				  // 页面弹出框事件(弹出页面)
				  $scope.item = $.parseJSON(JSON.stringify(event));
				  $scope.modal('/authorization/network/parameterStatusInfo.html', $scope.item, {
						title : T.T('SQJ3200022'),  //网络连接状态新增
						size : [ '1100px', '600px' ],
					});
				};
	      //删除事件
		  $scope.delInfo= function(event) {
			  $scope.item = {};
			  // 页面弹出框事件(弹出页面)
			  $scope.item = $.parseJSON(JSON.stringify(event));
			  $scope.modal('/authorization/network/parameterStatusInfo.html', $scope.item, {
					title : T.T('SQJ3200021'),  //网络连接状态新增
					size : [ '1100px', '600px' ],
					callbacks : [$scope.delNegaInfo ]
				});
			};
			// 删除信息事件
			$scope.delNegaInfo = function(result) {
					$scope.authAdd = {};
					$scope.authAdd = $.parseJSON(JSON.stringify(result.scope.item));
					$scope.authAdd.invalidFlag = "1";
			 		jfRest.request('network','updateStatus', $scope.authAdd).then(function(data) {
		                if (data.returnMsg == 'OK') {
		                	jfLayer.success(T.T('F00037'));  //删除成功
		                	$scope.safeApply();
			    			result.cancel();
			    			$scope.itemList.search();
		                }
		            });
				};
	       //启动
		   $scope.updateStatusY = function(event){
			   $scope.authAdd = {};
			   $scope.authAdd = $.parseJSON(JSON.stringify(event));
			   $scope.authAdd.connStatus = "1";
			   jfLayer.confirm(T.T('SQJ3200017'),function() {  
				   if($scope.authAdd.remoteSystemInd == 'V') {
					   jfRest.request('network','queryV', $scope.authAdd).then(function(data) {
			                if (data.returnMsg == 'OK') {
			                	jfLayer.success(T.T('SQJ3200015'));  //启动成功
			                	$scope.safeApply();
				    			$scope.itemList.search();
			                }
			            });
					   }else if($scope.authAdd.remoteSystemInd == 'C') {
						   jfRest.request('network','queryC', $scope.authAdd).then(function(data) {
				                if (data.returnMsg == 'OK') {
				                	jfLayer.success(T.T('SQJ3200015'));  //删除成功
				                	$scope.safeApply();
					    			$scope.itemList.search();
				                }
				            });  
					   }else if($scope.authAdd.remoteSystemInd == 'M') {
						   jfRest.request('network','queryM', $scope.authAdd).then(function(data) {
				                if (data.returnMsg == 'OK') {
				                	jfLayer.success(T.T('SQJ3200015'));  //删除成功
				                	$scope.safeApply();
					    			$scope.itemList.search();
				                }
				            }); 
					   }else if($scope.authAdd.remoteSystemInd == 'J') {
						   jfRest.request('network','queryJ', $scope.authAdd).then(function(data) {
				                if (data.returnMsg == 'OK') {
				                	jfLayer.success(T.T('SQJ3200015'));  //删除成功
				                	$scope.safeApply();
					    			$scope.itemList.search();
				                }
				            }); 
					   }
		   });
		   };
		    //  中止
		   $scope.updateStatusN = function(event){
			   $scope.authAdd = {};
			   $scope.authAdd = $.parseJSON(JSON.stringify(event));
			   $scope.authAdd.connStatus = "0";
			   jfLayer.confirm(T.T('SQJ3200018'),function() {
				   if($scope.authAdd.remoteSystemInd == 'V') {
				   jfRest.request('network','queryV', $scope.authAdd).then(function(data) {
		                if (data.returnMsg == 'OK') {
		                	jfLayer.success(T.T('SQJ3200016'));  //中止成功
		                	$scope.safeApply();
			    			$scope.itemList.search();
		                }
		            });
				   }else if($scope.authAdd.remoteSystemInd == 'C') {
					   jfRest.request('network','queryC', $scope.authAdd).then(function(data) {
			                if (data.returnMsg == 'OK') {
			                	jfLayer.success(T.T('SQJ3200016'));  //中止成功
			                	$scope.safeApply();
				    			$scope.itemList.search();
			                }
			            });  
				   }else if($scope.authAdd.remoteSystemInd == 'M') {
					   jfRest.request('network','queryM', $scope.authAdd).then(function(data) {
			                if (data.returnMsg == 'OK') {
			                	jfLayer.success(T.T('SQJ3200016'));  //终止成功
			                	$scope.safeApply();
				    			$scope.itemList.search();
			                }
			            }); 
				   }else if($scope.authAdd.remoteSystemInd == 'J') {
					   jfRest.request('network','queryJ', $scope.authAdd).then(function(data) {
			                if (data.returnMsg == 'OK') {
			                	jfLayer.success(T.T('SQJ3200016'));  //中止成功
			                	$scope.safeApply();
				    			$scope.itemList.search();
			                }
			            }); 
				   }
		   });
		   }
	});
	// 网络连接状态
		webApp.controller('pStatusAddCtrl', function($scope, $stateParams, jfRest,$timeout,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
			$scope.corporationId = sessionStorage.getItem("corporation");
			$scope.cardAssociationsArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_recordType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData: 'L',//需要移除的数据
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//当卡组标识为VMJ，编码为E，客户端标识为c/s
			$scope.connctModelArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_connctModel",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//联动验证
			$scope.charCodeArray = {};
			$scope.headArray = {};
			$scope.localN = true;
			$scope.remoteN = true;
			$scope.timeN = true;
	        var form = layui.form;
	        form.on('select(getInfoCard)',function(event){
	        	$scope.headerLength = '';
	        	if(event.value == 'C') {
	        		$scope.charCodeArray ={ 
        		        type:"dictData", 
        		        param:{
        		        	"type":"DROPDOWNBOX",
        		        	groupsCode:"dic_charCodeType",
        		        	queryFlag: "children"
        		        },//默认查询条件 
        		        rmData: 'E',//需要移除的数据
        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
        		        resource:"paramsManage.query",//数据源调用的action 
        		        callback: function(data){
        		        	$timeout(function() {
        						Tansun.plugins.render('select');
        					});	
        		        }
        			};
	        		$scope.headArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_headYN",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'N',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        		$scope.headLength4 = true;
	        	}else if(event.value == 'V'){
	        		$scope.charCodeArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_charCodeType",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'A',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        		$scope.headArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_headYN",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'N',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        		$scope.headLength4 = true;
	        	}else if(event.value == 'M') {
		        	$scope.charCodeArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_charCodeType",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'A',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        		$scope.headArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_headYN",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'Y',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        	}else if(event.value == 'J'){
	        		$scope.charCodeArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_charCodeType",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'A',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        		$scope.headArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_headYN",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        rmData: 'Y',//需要移除的数据
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$timeout(function() {
	        						Tansun.plugins.render('select');
	        					});	
	        		        }
	        			};
	        	}
	        });
	        form.on('select(getHeaderLength)',function(event){
	        	if(event.value == 'Y') {
	        		if($scope.pStatus.remoteSystemInd == 'V') {
	        			$scope.pStatus.headerLength = '22';
	        		}else if($scope.pStatus.remoteSystemInd == 'C') {
	        			$scope.pStatus.headerLength = '46';
	        		}
	        	}else if(event.value == 'N'){
	        		$scope.pStatus.headerLength = '';
	        	}
	        });
	        form.on('select(getInfoServer)',function(event){
	             if($scope.pStatus.connModel == 'DI') {
	            	 $scope.remoteN = false;
	            	 $scope.localN = true;
	            	 $scope.timeN = false;
	             }else if($scope.pStatus.connModel == 'DA') {
	            	 $scope.localN = false;
	            	 $scope.remoteN = true;
	            	 $scope.timeN = true;
	             }else if($scope.pStatus.connModel == 'SI' ||$scope.pStatus.connModel == 'SA') {
	            	 $scope.localN = true;
	     			$scope.remoteN = true;
	     			$scope.timeN = true;
	             }
	        });
		});
		// 网络连接状态修改
		webApp.controller('pStatusUpdateCtrl', function($scope, $stateParams, jfRest,
						$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
					$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
					$scope.corporationId = sessionStorage.getItem("corporation");
					$scope.cardAssociationsArray ={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_recordType",
					        	queryFlag: "children"
					        },//默认查询条件 
					        rmData: 'L',//需要移除的数据
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.remoteSystemIndU = $scope.item.remoteSystemInd;
					        }
						};
					//当卡组标识为VMJ，编码为E，客户端标识为c/s
					$scope.charCodeAllArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_charCodeType",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$scope.charCodeU = $scope.item.charCode;
	        		        }
	        			};
					$scope.headArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_headYN",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$scope.includeHeaderIndU = $scope.item.includeHeaderInd;
	        		        }
	        			};
					$scope.connctModelArray ={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_connctModel",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.connModelU = $scope.item.connModel;
					        }
						};
					$scope.localN = true;
					$scope.localY = false;
					$scope.remoteN = true;
					$scope.remoteY= false;
					$scope.timeN = true;
					if($scope.item.serverClientInd == 'C') {
						$scope.localN = false;
						$scope.localY = true;
						$scope.remoteN = false;
						$scope.remoteY= true;
						$scope.timeN = true;
					}else if($scope.item.serverClientInd == 'S') {
						$scope.localN = true;
						$scope.localY = false;
						$scope.remoteN = true;
						$scope.remoteY= false;
						$scope.timeN = false;
					}
				});
		// 网络连接状态修改
		webApp.controller('pStatusInfoCtrl', function($scope, $stateParams, jfRest,
							$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
					$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
					$scope.corporationId = sessionStorage.getItem("corporation");
					$scope.cardAssociationsArray ={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_recordType",
					        	queryFlag: "children"
					        },//默认查询条件 
					        rmData: 'L',//需要移除的数据
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.remoteSystemIndInfo = $scope.item.remoteSystemInd;
					        }
						};
					//当卡组标识为VMJ，编码为E，客户端标识为c/s
					$scope.charCodeAllArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_charCodeType",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$scope.charCodeInfo = $scope.item.charCode;
	        		        }
	        			};
					$scope.headArray ={ 
	        		        type:"dictData", 
	        		        param:{
	        		        	"type":"DROPDOWNBOX",
	        		        	groupsCode:"dic_headYN",
	        		        	queryFlag: "children"
	        		        },//默认查询条件 
	        		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        		        resource:"paramsManage.query",//数据源调用的action 
	        		        callback: function(data){
	        		        	$scope.includeHeaderIndInfo = $scope.item.includeHeaderInd;
	        		        }
	        			};
					$scope.connctModelArray ={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_connctModel",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.connModelInfo = $scope.item.connModel;
					        }
						};
							$scope.localN = true;
							$scope.remoteN = true;
							$scope.timeN = true;
							if($scope.item.reconnInterval == null) {
								$scope.timeN = false;	
							}else {
								$scope.timeN = true;
							}
						});
});
