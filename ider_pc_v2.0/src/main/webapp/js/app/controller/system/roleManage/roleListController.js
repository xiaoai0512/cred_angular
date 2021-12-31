'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易限制维护及查询
	webApp.controller('roleListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		// $scope.departmentStatusArr = [{name : T.T('YWJ5500028'),id : '0'},{name : T.T('YWJ5500029'),id : '1'}] ;
		$scope.departmentStatusArr =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_jobStatus",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
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
		 $scope.addBtnFlag = false;
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
	   	   			if($scope.eventList.search('COS.CS.01.0005') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.CS.01.0004') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0006') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
		//部门查询
		$scope.itemList = {
				params : $scope.queryParam = {
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'roleManage.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_jobStatus'],//查找数据字典所需参数
				transDict : ['departmentStatus_departmentStatusDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//增加部门
		$scope.addRole = function() {
			$scope.modal('/system/roleManage/roleAdd.html', '', {
				title : T.T('YWJ5500026'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '850px', '450px' ],
				callbacks : [$scope.addRoleSure ]
			});
		};
		//确定新增用户
		$scope.addRoleSure = function(result){
			$scope.raddInfo = $.parseJSON(JSON.stringify(result.scope.radd));
			jfRest.request('roleManage', 'add', $scope.raddInfo).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success(T.T("YWJ5500030"));
	                	$scope.raddInfo = {};
	                	$scope.itemList.search();
	                }
	    			$scope.safeApply();
	    			result.cancel();
	            });
		};
		//修改部门
		$scope.updateRole = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/roleManage/roleUpdate.html', $scope.item, {
				title : T.T('YWJ5500027'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '850px', '450px' ],
				callbacks : [$scope.updateRoleSure ]
			});
		};
		//确定修改用户
		$scope.updateRoleSure = function(result){
			$scope.item.departmentStatus = result.scope.updepartmentStatus;
			jfRest.request('roleManage', 'update', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022'));
					$scope.item = {};
					$scope.itemList.search();
				}
				$scope.safeApply();
				result.cancel();
			});
		}
	});
	// 新增部门
	webApp.controller('roleAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.departmentStatusArr =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_jobStatus",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
	});
	// 修改部门
	webApp.controller('roleUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.departmentStatusArr =  {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_jobStatus",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updepartmentStatus = $scope.item.departmentStatus
			}
		};
		//运营模式
		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.operationModeInfo = $scope.item.operationMode;
		        }
		    };
		 //运营机构
		 $scope.operationOrganArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"organName", //下拉框显示内容，根据需要修改字段名称 
		        value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationOrgan.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.operationOrganInfo = $scope.item.operationOrgan;
		        }
		    };
	});
});
