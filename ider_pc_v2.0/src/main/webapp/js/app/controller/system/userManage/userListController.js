'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易限制维护及查询
	webApp.controller('userListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		// $scope.userFlag = [{name : T.T('YWJ5500009'),id : 'A'},{name : T.T('YWJ5500010'),id : 'S'},{name : T.T('YWJ5500011'),id : 'P'}] ;
		$scope.userFlag = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_userState",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		// $scope.adminFlagArry = [{name : T.T('YWJ5500012'),id : '1'},{name : T.T('YWJ5500013'),id : '2'},{name : T.T('YWJ5500014'),id : '3'}] ;
		// $scope.userLanageArr = [{name : T.T('YWJ5500015'),id : 'cn'},{name :T.T('YWJ5500016'),id : 'en'}] ;
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
		 $scope.resBtnFlag = false;
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
	   	   			if($scope.eventList.search('COS.CS.01.0011') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.CS.01.0010') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0012') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0019') != -1){    //重置密码
	   					$scope.resBtnFlag = true;
	   				}
	   				else{
	   					$scope.resBtnFlag = false;
	   				}
   				}
   			});
		//用户查询
		$scope.itemList = {
			params : $scope.queryParam = {
					authDataSynFlag:"1",
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'userManage.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_userState'],//查找数据字典所需参数
			transDict : ['status_statusDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//增加用户
		$scope.addUser = function() {
			$scope.modal('/system/userManage/userAdd.html', '', {
				title : T.T('YWJ5500001'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '800px', '530px' ],
				callbacks : [$scope.addUserSure ]
			});
		};
		//确定新增用户
		$scope.endDate = {min : new Date()};
		$scope.addUserSure = function(result){
			$scope.uaddInfo = $.parseJSON(JSON.stringify(result.scope.uadd));
			$scope.uaddInfo.flag = "1";
			$scope.uaddInfo.password = base64encode(result.scope.password);
			$scope.uaddInfo.passwordConfirm = base64encode(result.scope.equalspassword)
			// 不录入工号，默认工号为0 用于判断是否首次登录
			if(!$scope.uaddInfo.jobNumber) {
				$scope.uaddInfo.jobNumber = 0
			}
//			$scope.uaddInfo.userLanguage = 'cn';
//			$scope.uaddInfo.passwordConfirm = result.scope.equalspassword;
			jfRest.request('userManage', 'add', $scope.uaddInfo).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T("YWJ5500002"));
                	$scope.uaddInfo = {};
                	$scope.itemList.search();
                }
    			$scope.safeApply();
    			result.cancel();
            });
		};
		//修改用户
		$scope.updateUser = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/userManage/userUpdate.html', $scope.item, {
				title : T.T('YWJ5500004'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '800px', '430px' ],
				callbacks : [$scope.updateUserSure]
			});
		};
		//确定修改用户
		$scope.endDate = {min : new Date()};
		$scope.updateUserSure = function(result){
			$scope.item.post = document.getElementById('postId').value;
			$scope.item.department = document.getElementById('departmentId').value;
			$scope.item.flag = "1";
			//$scope.item.userLanguage = 'cn';
			$scope.item.userLanguage = result.scope.upuserLanguage;
			$scope.item.status = result.scope.upstatus;
			$scope.item.adminFlag = result.scope.upadminFlag;
			jfRest.request('userManage', 'update', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T("F00022"));
					$scope.item = {};
					$scope.itemList.search();
				}
				$scope.safeApply();
				result.cancel();
			});
		};
		//重置密码
		$scope.resetPassword = function(event){
			$scope.resetInfo = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YWJ5500005"),function() {
				jfRest.request('userManage', 'pass', $scope.resetInfo).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.success(T.T("YWJ5500006"));
						$scope.itemList.search();
					}
				});
			},function() {
			});
		};
		//用户详情userInfo
		$scope.userInfo = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/userManage/userInfo.html', $scope.item, {
				title : T.T('YWJ5500008'),
				buttons : [T.T('F00012')],
				size : [ '800px', '430px' ],
				callbacks : []
			});
		};
		//设置用户特别事件
		$scope.setBlockEvent = function(event) {
			$scope.setItem = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/userManage/setUserEvent.html', $scope.setItem, {
				title : T.T('YWH5500143'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '560px' ],
				callbacks : [$scope.setUserEventSure]
			});
		};
		//确定设置用户特别事件
		$scope.setUserEventSure = function(result){
			$scope.setEventInfo = {};
			 $scope.setEventInfo.coreUserSpeventList = [];
			$scope.arr2 = [];
			 $("#s54 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($scope.arr2.length >0){
				 for(var i=0; i<$scope.arr2.length;i++){
					 $scope.setEventInfo.coreUserSpeventList.push({"eventNo":$scope.arr2[i]});
				 }
			 }else{
				 $scope.setEventInfo.coreUserSpeventList = [];
			 }

			 $scope.setEventInfo.userNo = result.scope.userNoSet;
			jfRest.request('userManage', 'setUserEventList', $scope.setEventInfo).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T("F00034"));
					$scope.setEventInfo = {};
					$scope.itemList.search();
				}
				else{
					jfLayer.fail(T.T("F00035")+ data.returnMsg);
				}
				$scope.safeApply();
				result.cancel();
			});
		}
	});
	// 新增用户
	webApp.controller('userAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.stopFlag = false;
		// $scope.userFlag = [{name : T.T('YWJ5500009'),id : 'A'},{name :  T.T('YWJ5500010'),id : 'S'},{name :  T.T('YWJ5500011'),id : 'P'}] ;
		// $scope.adminFlagArry = [{name :  T.T('YWJ5500012'),id : '1'},{name :  T.T('YWJ5500013'),id : '2'},{name :  T.T('YWJ5500014'),id : '3'}] ;
		// $scope.userLanageArr = [{name :  T.T('YWJ5500015') ,id : 'cn'},{name :  T.T('YWJ5500016'),id : 'en'}] ;
		$scope.userLanageArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_userLanageType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		$scope.userFlag = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_userState",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		$scope.adminFlagArry = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_adminFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
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
	});
	// 查询用户
		webApp.controller('userInfoCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
			$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
			$translate.use($scope.lang);
			$translatePartialLoader.addPart('pages/system/i18n_userManage');
			$translate.refresh();
			$scope.stopFlag = false;
			$scope.userLanageArr = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_userLanageType",
					queryFlag: "children"
				}, // 默认查询条件
				text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", // 数据源调用的action
				callback: function(data) {
					$scope.viewuserLanguage = $scope.item.userLanguage;
				}
			};
			$scope.userFlag = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_userState",
					queryFlag: "children"
				}, // 默认查询条件
				text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", // 数据源调用的action
				callback: function(data) {
					$scope.viewuserFlag = $scope.item.status;
				}
			};
			$scope.adminFlagArry = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_adminFlag",
					queryFlag: "children"
				}, // 默认查询条件
				text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", // 数据源调用的action
				callback: function(data) {
					$scope.viewadminFlag = $scope.item.adminFlag;
				}
			};
			//关联岗位
			 $scope.authjobArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"postName", //下拉框显示内容，根据需要修改字段名称
		        value:"postNo",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"jobManage.query",//数据源调用的action
		        callback: function(data){
		        	$scope.postInfo = $scope.item.post;
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
		        	$scope.departmentInfo = $scope.item.department;
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
		        	$scope.operationOrganInfo = $scope.item.organization;
		        }
		    };
		});
	// 修改用户
	webApp.controller('userUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.stopFlag = false;
		// $scope.userFlag = [{name : T.T('YWJ5500009') ,id : 'A'},{name : T.T('YWJ5500009'),id : 'S'},{name : T.T('YWJ5500011'),id : 'P'}] ;
		// $scope.adminFlagArry = [{name : T.T('YWJ5500012'),id : '1'},{name : T.T('YWJ5500013'),id : '2'},{name : T.T('YWJ5500014'),id : '3'}] ;
		// $scope.userLanageArr = [{name : T.T('YWJ5500015'),id : 'cn'},{name : T.T('YWJ5500016'),id : 'en'}] ;
		$scope.userLanageArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_userLanageType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.upuserLanguage = $scope.item.userLanguage;
			}
		};
		$scope.userFlag = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_userState",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.upstatus = $scope.item.status;
			}
		};
		$scope.adminFlagArry = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_adminFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.upadminFlag = $scope.item.adminFlag;
			}
		};
		//关联岗位
		 $scope.authjobArray ={
	        type:"dynamic",
	        param:{},//默认查询条件
	        text:"postName", //下拉框显示内容，根据需要修改字段名称
	        value:"postNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"jobManage.query",//数据源调用的action
	        callback: function(data){
	        	$scope.postInfo = $scope.item.post;
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
	        	$scope.departmentInfo = $scope.item.department;
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
	        	$scope.operationOrganInfo = $scope.item.organization;
	        }
	    };
	});
	// 设置特别状况事件
	webApp.controller('setEventCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translate.refresh();
		$scope.userNoSet = $scope.setItem.userNo;
		$("#s53 option").remove();
		$("#s54 option").remove();
		$scope.setparamss = {
				operationMode:$scope.setItem.operationMode,
				spFlag : 1,
				queryType:"E",
				queryFlag:"all"
		};
		jfRest.request('blockCodeMag', 'eventNoQuery', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$scope.queryParam = {
					userNo : $scope.userNoSet,
			};
			jfRest.request('userManage', 'queryUserEvent', $scope.queryParam)
			.then(function(data) {
				if(a!=undefined && a!=null) {
					var n = "";
					if(data.returnData == null){
						n=null;
					}else{
						n =data.returnData.rows;
					}
					 if(n!=undefined && n!=null){
					    	for(var i=0;i<n.length;i++){
					    		angular.element("#s54").append("<option value='"+n[i].eventNo+"'>"+n[i].eventNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].eventDesc+"</option>");
					    	}
							//查找重复数据
						    var isrep;
						    for(var j =0;j<a.length;j++){
						    	isrep = false;
						    	for(var i=0;i<n.length;i++){
							    	if(n[i].eventNo==a[j].eventNo){
							    		isrep = true;
							    		break;
							    	}
							    }
						    	if(!isrep){
						    		angular.element("#s53").append("<option value='"+a[j].eventNo+"'>"+a[j].eventNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].eventDesc+"</option>");
						    	}
	                        }
	                 }else{
							   for(var i=0;i<a.length;i++){
								   angular.element("#s53").append("<option value='"+a[i].eventNo+"'>"+a[i].eventNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].eventDesc+"</option>");
						  }
					   }
				}

			});
		});
		/*----根据事件编号，和描述查询----*/
	 	$scope.queryEventList = function(){
			 $("#s53").empty();
			 $scope.setparamss = {
					 eventId: $scope.eventNoquery,
				   eventDesc: $scope.eventDescquery,
				   operationMode:$scope.setItem.operationMode,
				   spFlag : 1 ,
					queryType:"E",
					queryFlag:"all"
	 		};
			jfRest.request('blockCodeMag', 'eventNoQuery', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s54 option").each(function () {
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
					    	if(n[i]==a[j].eventNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s53").append("<option value='"+a[j].eventNo+"'>"+a[j].eventNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].eventDesc+"</option>");
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s53").append("<option value='"+a[j].eventNo+"'>"+a[j].eventNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].eventDesc+"</option>");
					   }
			      }
			});
		};
		/*----end事件编号，和描述查询 ----*/
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
	});
});
