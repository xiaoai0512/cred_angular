'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易限制维护及查询
	webApp.controller('menuListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.fatherinfut = false;
		//菜单状态
		$scope.menuFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_menuStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//$scope.menuFather = [{name : '运营中心' ,id : '01'},{name : '授权中心' ,id : '02'},{name : '客户服务' ,id : '03'}];
		//所属级别
		$scope.menuLevel = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_subordinateLevel",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		 $scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
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
	   	   			if($scope.eventList.search('COS.CS.01.0001') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.CS.01.0002') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0003') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.CS.01.0025') != -1){    //设置
	   					$scope.setBtnFlag = true;
	   				}
	   				else{
	   					$scope.setBtnFlag = false;
	   				}
   				}
   			});
		//菜单查询
		$scope.itemList = {
				params : $scope.queryParam = {
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页 
				resource : 'menuManage.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_subordinateLevel','dic_menuStatus'],//查找数据字典所需参数
				transDict : ['menuLevel_menuLevelDesc','displayFlag_displayFlagDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//增加菜单
		$scope.addMenu = function() {
			$scope.modal('/system/menuManage/menuAdd.html', '', {
				title : T.T('YWJ5500032'),
				buttons : [ T.T('YWJ5500032'),T.T('F00012')],
				size : [ '900px', '460px' ],
				callbacks : [$scope.addMenuSure ]
			});
		};
		//确定新增菜单
		$scope.addMenuSure = function(result){
			$scope.maddInfo = $.parseJSON(JSON.stringify(result.scope.madd));
			//$scope.maddInfo.baseFlag = "base02";
			if($scope.maddInfo.upperMenuNo == "null"){
				delete $scope.maddInfo['upperMenuNo'];
			}
			jfRest.request('menuManage', 'add', $scope.maddInfo).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success(T.T("YWJ5500033"));
	                	$scope.maddInfo = {};
	                	$scope.itemList.search();
	                }
	    			$scope.safeApply();
	    			result.cancel();
	            });
		};
		//修改菜单
		$scope.updateMenu = function(event) {
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/menuManage/menuUpdate.html', $scope.item, {
				title : T.T('YWJ5500044'),
				buttons : [  T.T('F00107'), T.T('F00012')],
				size : [ '900px', '460px' ],
				callbacks : [$scope.updateMenuSure ]
			});
		};
		//确定修改用户
		$scope.updateMenuSure = function(result){
			$scope.item.upperMenuNo = result.scope.updateUpperMenuNo;
			$scope.item.icon = result.scope.icon; 
			$scope.item.baseFlag = result.scope.baseFlag;
			$scope.item.menuLevel = result.scope.menuLevel;
			$scope.item.lowerMenuFlag = result.scope.lowerMenuFlag;
			$scope.item.displayFlag = result.scope.displayFlag;
			if($scope.item.upperMenuNo == "null"){
				delete $scope.item['upperMenuNo'];
			}
			jfRest.request('menuManage', 'update', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T("F00022"));
					$scope.item = {};
					$scope.itemList.search();
				}
				$scope.safeApply();
				result.cancel();
			});
		};
		//配置事件
		$scope.eventSet = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/menuManage/menuEvent.html', $scope.item, {
				title : T.T('YWJ5500045'),
				buttons : [ T.T('F00107'),T.T('F00108')],
				size : [ '1000px', '580px' ],
				callbacks : [$scope.setEventSure ]
			});
		};
		// 保存按钮事件
		$scope.setEventSure = function(result) {
			$scope.menuEvent = {};
			if($rootScope.treeSelect.length == 0){
				jfLayer.fail(T.T('YWJ5500049'));
			}else{
				for(var i=0;i<$rootScope.treeSelect.length;i++){
					$rootScope.treeSelect[i].menuNo = $rootScope.treeSelect[i].eventNo+$scope.item.menuNo;
					$rootScope.treeSelect[i].menuName= $rootScope.treeSelect[i].eventNo + "(" + $rootScope.treeSelect[i].eventDesc + ")";
				}
				$scope.menuEvent.coreEventMeList =$rootScope.treeSelect;
				//$scope.menuEvent.menuNo =$scope.item.menuNo;
				//$scope.menuEvent.menuName =$scope.item.menuName;
				$scope.menuEvent.upperMenuNo =$scope.item.menuNo;
				$scope.menuEvent.menuLevel =parseInt($scope.item.menuLevel) + 1;
				$scope.menuEvent.flag ='add';
				jfRest.request('menuManage', 'setEvent', $scope.menuEvent).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('YWJ5500050'));
						$rootScope.menuEvent ={};
						$rootScope.treeSelect = [];
					}
					$scope.safeApply();
	    			result.cancel();
				});
			}
		};
	});
	// 新增菜单
	webApp.controller('menuAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.fatherinfut = false;
		$scope.menuDescShow = false;
		//菜单状态
		$scope.menuFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_menuStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//是否有下级菜单标识
		$scope.lowerFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//所属级别
		$scope.menuLevelArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_subordinateLevel",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//是否为基础参数
		$scope.baseFlagArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_basicParameters",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//图标icon
		$scope.iconArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_Icon",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//父级菜单
		 $scope.menuFather ={};
		//根据菜单级别更改显示
		var form = layui.form;
		form.on('select(getLevel)',function(event){
			if(event.value != "1"){
				//父级菜单
				 $scope.menuFather ={ 
			        type:"dynamic", 
			        param:{"nowLevel":event.value},//默认查询条件 
			        text:"menuName", //下拉框显示内容，根据需要修改字段名称 
			        value:"menuNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"menuManage.select",//数据源调用的action 
			        callback: function(data){
			        }
			    };
				 $scope.fatherinfut = true;
				 $scope.menuDescShow = false;
			}
			else{
				$scope.fatherinfut = false;
				$scope.menuDescShow = true;
			}
		});
	});
	// 修改菜单
	webApp.controller('menuUpdateCtrl', function($scope, $stateParams, jfRest, $timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.fatherinfut = true;
		$scope.menuDescShow = false;
		//菜单状态
		$scope.menuFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_menuStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.displayFlag=$scope.item.displayFlag;
			}
		};
		//是否有下级菜单标识
		$scope.lowerFlag = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.lowerMenuFlag=$scope.item.lowerMenuFlag;
			}
		};
		//所属级别
		$scope.menuLevelArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_subordinateLevel",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.menuLevel=$scope.item.menuLevel;
			}
		};
		//是否为基础参数
		$scope.baseFlagArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_basicParameters",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.baseFlag=$scope.item.baseFlag;
			}
		};
		//图标icon
		$scope.iconArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_Icon",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.icon=$scope.item.icon;
			}
		};
		$scope.menuFatherArr ={ };
		if($scope.item.menuLevel != "1"){
			$scope.fatherinfut = true;
			$scope.menuDescShow = false;
			//父级菜单
			 $scope.menuFatherArr ={ 
		        type:"dynamic", 
		        param:{"nowLevel":$scope.item.menuLevel},//默认查询条件 
		        text:"menuName", //下拉框显示内容，根据需要修改字段名称 
		        value:"menuNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"menuManage.select",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateUpperMenuNo = $scope.item.upperMenuNo;
		        }
			};
		}else {
			$scope.fatherinfut = false;
			$scope.menuDescShow = true;
		}
		//根据菜单级别更改显示
		var form = layui.form;
		form.on('select(getLevel2)',function(event){
			if(event.value == "2" || event.value == "3"){
				$scope.fatherinfut = true;
				$scope.menuDescShow = false;
				//父级菜单
				 $scope.menuFatherArr ={ 
			        type:"dynamic", 
			        param:{"nowLevel":event.value},//默认查询条件 
			        text:"menuName", //下拉框显示内容，根据需要修改字段名称 
			        value:"menuNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"menuManage.select",//数据源调用的action 
			        callback: function(data){
			        }
			    };
			}
			else{
				$scope.fatherinfut = false;
				$scope.menuDescShow = true;
			}
		});
	});
	// 事件配置
	webApp.controller('menuEventCtrl', function($scope, $stateParams, jfRest, $timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		// 事件清单列表
		$scope.itemList = {
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			checkType : 'checkbox', // 当为checkbox时为多选
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			autoQuery:true,
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//已关联的事件清单
		$scope.eventList = {
				"menuNo":$scope.item.menuNo,
		}, // 表格查询时的参数信息
		jfRest.request('menuManage', 'selEvent', $scope.eventList).then(function(data) {
			$rootScope.treeSelect = data.returnData;
		});
		//关联
		$rootScope.treeSelect = [];
		$scope.saveSelect = function(event) {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.itemList.validCheck()) {
				return;
			}
			var items = $scope.itemList.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].eventNo == $rootScope.treeSelect[k].eventNo) {    //判断是否存在
						tipStr = tipStr + items[i].eventNo + ",";
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
				jfLayer.alert(T.T('F00162') + tipStr.substring(0,tipStr.length-1) + T.T('YWJ5500055'));
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
		}
	});
});
