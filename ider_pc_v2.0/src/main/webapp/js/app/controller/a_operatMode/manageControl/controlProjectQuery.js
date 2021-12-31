'use strict';
define(function(require) {
	var webApp = require('app');
	//封锁码查询及维护
	webApp.controller('controlProjectQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false; 
		$scope.copyBtnFlag = false;
		$scope.controlProjectInfDiv = false;
		var form = layui.form;
		form.on('select(getControlMode)',function(data){
			if(data.value == "E"){
				$scope.controlProjectInfDiv = true;
			}else{
				$scope.controlProjectInfDiv = false;
			}
		});
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
		   	   		if($scope.eventList.search('COS.IQ.02.0047') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
				   	if($scope.eventList.search('COS.AD.02.0041') != -1){    //查询
						$scope.addBtnFlag = true;
						$scope.copyBtnFlag = true;
						}
					else{
						$scope.addBtnFlag = false;
						$scope.copyBtnFlag = false;
					}
			   	   	if($scope.eventList.search('COS.UP.02.0044') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
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
		$scope.controlProjectList = {
					params : {
							"pageSize":10,
							"indexNo":0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页 
					resource : 'controlProject.query',// 列表的资源
					isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_controlAndControl'],//查找数据字典所需参数
					transDict : ['controlMode_controlModeDesc'],//翻译前后key
					callback : function(data) { // 表格查询后的回调函数
					}
				};
		//查询详情
		$scope.checkControlProjectInf = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.controlProjectInf = {};
			$scope.controlProjectInf = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/manageControl/viewControlProject.html', $scope.controlProjectInf, {
				title : T.T("YYJ4900002"),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '480px' ],
				callbacks : []
			});
		};
		//新增
		$scope.addControlProject = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/manageControl/controlProjectEst.html', '', {
				title : T.T('YYJ4900001'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '480px' ],
				callbacks : [$scope.saveControlProject ]				
			});
		};
		//新增回调函数
		$scope.saveControlProject = function(result){
			$scope.controlProjectEstAdd = {};
			$scope.controlProjectEstAdd = result.scope.controlProjectEst;
			$scope.controlProjectEstAdd.CoreEvent = result.scope.treeSelect;
			if($scope.controlProjectEstAdd.controlMode == "S" && ($scope.controlProjectEstAdd.preControlCategory == "" || $scope.controlProjectEstAdd.preControlCategory == undefined 
					|| $scope.controlProjectEstAdd.preControlCategory == null || $scope.controlProjectEstAdd.preControlCategory == "null")){
				jfLayer.fail(T.T("YYJ4900015"));
				return;
			}
			if($scope.controlProjectEstAdd.preControlCategory == "A" && ($scope.controlProjectEstAdd.authDenyIdentify == "" || $scope.controlProjectEstAdd.authDenyIdentify == undefined 
					|| $scope.controlProjectEstAdd.authDenyIdentify == null || $scope.controlProjectEstAdd.authDenyIdentify == "null")){
				jfLayer.fail(T.T("YYJ4900016"));
				return;
			}
			if($scope.controlProjectEstAdd.controlMode == "E" && ($scope.controlProjectEstAdd.controlField == "" || $scope.controlProjectEstAdd.controlField == undefined 
					|| $scope.controlProjectEstAdd.controlField == null || $scope.controlProjectEstAdd.controlField == "null")){
				jfLayer.fail(T.T("YYJ4900017"));
				return;
			}
			jfRest.request('controlProject','save', $scope.controlProjectEstAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					result.scope.proObjInstan = $scope.controlProjectEstAdd;
					$scope.controlProjectEstAdd = {};
					result.scope.controlProjectForm.$setPristine();
					 $scope.safeApply();
					 result.cancel();
					 $scope.controlProjectList.search();
				}
			});
		};
		//复制
		$scope.copyControlProjectInf = function(event){		
			$scope.controlProjectInfCopy =  $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/manageControl/updateControlProjectCopy.html', $scope.controlProjectInfCopy, {
				title : T.T('YYJ4900004'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '480px' ],
				callbacks : [$scope.saveControlProjectCopy ]				
			});
		};
		$scope.saveControlProjectCopy = function(result){
			$scope.controlProjectCopy = {};
			$scope.controlProjectCopy = result.scope.controlProjectInfCopy;
			$scope.controlProjectCopy.CoreEvent = result.scope.treeSelect;
			$scope.controlProjectCopy.controlField = result.scope.controlField;
            $scope.controlProjectCopy.authDenyIdentify = result.scope.authDenyIdentify;
            $scope.controlProjectCopy.preControlCategory = result.scope.preControlCategory;
			$scope.controlProjectCopy.controlMode = result.scope.controlMode;
			if($scope.controlProjectCopy.controlMode == "S" && ($scope.controlProjectCopy.preControlCategory == "" || $scope.controlProjectCopy.preControlCategory == undefined 
					|| $scope.controlProjectCopy.preControlCategory == null || $scope.controlProjectCopy.preControlCategory == "null")){
				jfLayer.fail(T.T("YYJ4900015"));
				return;
			}
			if($scope.controlProjectCopy.preControlCategory == "A" && ($scope.controlProjectCopy.authDenyIdentify == "" || $scope.controlProjectCopy.authDenyIdentify == undefined 
					|| $scope.controlProjectCopy.authDenyIdentify == null || $scope.controlProjectCopy.authDenyIdentify == "null")){
				jfLayer.fail(T.T("YYJ4900016"));
				return;
			}
			if($scope.controlProjectCopy.controlMode == "E" && ($scope.controlProjectCopy.controlField == "" || $scope.controlProjectCopy.controlField == undefined 
					|| $scope.controlProjectCopy.controlField == null || $scope.controlProjectCopy.controlField == "null")){
				jfLayer.fail(T.T("YYJ4900017"));
				return;
			}
			jfRest.request('controlProject','save', $scope.controlProjectCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.controlProjectCopy = {};
					result.scope.controlProjectForm.$setPristine();
					 $scope.safeApply();
					 result.cancel();
					 $scope.controlProjectList.search();
				}
			});
		};
		//修改
		$scope.updateControlProjectInf = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.controlProjectInf = {};
			$scope.controlProjectInf = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/manageControl/updateControlProject.html', $scope.controlProjectInf, {
				title : T.T("YYJ4900003"),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '480px' ],
				callbacks : [$scope.saveControlProjectInf]
			});
		};
		//保存
		$scope.saveControlProjectInf = function (result){
			$scope.controlProjectInf.controlField = result.scope.controlField;
			$scope.controlProjectInf.authDenyIdentify = result.scope.authDenyIdentify;
			$scope.controlProjectInf.preControlCategory = result.scope.preControlCategory;
			$scope.controlProjectInf.controlMode = result.scope.controlMode;
			if($scope.controlProjectInf.controlMode == "S" && ($scope.controlProjectInf.preControlCategory == "" || $scope.controlProjectInf.preControlCategory == undefined 
					|| $scope.controlProjectInf.preControlCategory == null || $scope.controlProjectInf.preControlCategory == "null")){
				jfLayer.fail(T.T("YYJ4900015"));
				return;
			}
			if($scope.controlProjectInf.preControlCategory == "A" && ($scope.controlProjectInf.authDenyIdentify == "" || $scope.controlProjectInf.authDenyIdentify == undefined 
					|| $scope.controlProjectInf.authDenyIdentify == null || $scope.controlProjectInf.authDenyIdentify == "null")){
				jfLayer.fail(T.T("YYJ4900016"));
				return;
			}
			if($scope.controlProjectInf.controlMode == "E" && ($scope.controlProjectInf.controlField == "" || $scope.controlProjectInf.controlField == undefined 
					|| $scope.controlProjectInf.controlField == null || $scope.controlProjectInf.controlField == "null")){
				jfLayer.fail(T.T("YYJ4900017"));
				return;
			}
			$scope.controlProjectInf.operationMode = result.scope.updateOperationMode;
			if($scope.controlProjectInf.controlMode == "E"){
				$scope.controlProjectInf.CoreEvent = result.scope.treeSelect;
			}
			jfRest.request('controlProject', 'update', $scope.controlProjectInf)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.controlProjectList.search();
				}
			});
		}
	});
	webApp.controller('viewControlProjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
		$translate.refresh();
		//管控模式
		$scope.controlModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAndControl",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.controlMode=$scope.controlProjectInf.controlMode;
			}
		};
		//预定义管控类别
		$scope.preControlCategoryArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.preControlCategory = $scope.controlProjectInf.preControlCategory;
			}
		};
		//授权拒绝标识
		$scope.authDenyIdentifyArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_authorizationSign",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.authDenyIdentify = $scope.controlProjectInf.authDenyIdentify;
			}
		}; 
		//管控动作
		$scope.controlFieldArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAction",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.controlField = $scope.controlProjectInf.controlField;
			}
		};
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewOperationMode = $scope.controlProjectInf.operationMode;
		        }
		    };
		$scope.preControlCategoryDiv = false;
		$scope.authDenyIdentifyDiv = false;
		$scope.controlFieldDiv = false;
		if($scope.controlProjectInf.controlMode == "S"){
			if($scope.controlProjectInf.preControlCategory != "" && $scope.controlProjectInf.preControlCategory != undefined 
					&& $scope.controlProjectInf.preControlCategory != null && $scope.controlProjectInf.preControlCategory != "null"){
				$scope.preControlCategoryDiv = true;
			}
			if($scope.controlProjectInf.authDenyIdentify != "" && $scope.controlProjectInf.authDenyIdentify != undefined 
					&& $scope.controlProjectInf.authDenyIdentify != null && $scope.controlProjectInf.authDenyIdentify != "null"){
				$scope.authDenyIdentifyDiv = true;
			}
		}
		if($scope.controlProjectInf.controlMode == "E"){
			$scope.controlFieldDiv = true;
		}
		//事件列表
		$scope.evLstListTable = {
//			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					operationMode:$scope.controlProjectInf.operationMode,
					controlProjectNo:$scope.controlProjectInf.controlProjectNo,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'limitList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('updateControlProjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
		$translate.refresh();
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateOperationMode = $scope.controlProjectInf.operationMode
		        }
	    };
		//管控模式
		$scope.controlModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAndControl",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.controlMode=$scope.controlProjectInf.controlMode;
			}
		};
		//预定义管控类别
		$scope.preControlCategoryArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.preControlCategory = $scope.controlProjectInf.preControlCategory;
			}
		};
		//授权拒绝标识
		$scope.authDenyIdentifyArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_authorizationSign",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.authDenyIdentify = $scope.controlProjectInf.authDenyIdentify;
			}
		};   
		//管控动作
		$scope.controlFieldArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAction",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.controlField = $scope.controlProjectInf.controlField;
			}
		};
		$scope.controlProjectInfDiv = false;
		$scope.preControlCategoryDiv = false;
		$scope.authDenyIdentifyDiv = false;
		$scope.controlFieldDiv = false;
		if($scope.controlProjectInf.controlMode == "E"){
			$scope.controlProjectInfDiv = true;
			$scope.preControlCategoryDiv = false;
			$scope.authDenyIdentifyDiv = false;
			$scope.controlFieldDiv = true;
		}else if($scope.controlProjectInf.controlMode == "S"){
			$scope.preControlCategoryDiv = true;
			$scope.controlProjectInfDiv = false;
			if($scope.controlProjectInf.authDenyIdentify != "" && $scope.controlProjectInf.authDenyIdentify != undefined 
					&& $scope.controlProjectInf.authDenyIdentify != null && $scope.controlProjectInf.authDenyIdentify != "null"){
				$scope.authDenyIdentifyDiv = true;
			}else{
				$scope.authDenyIdentifyDiv = false;
			}
			$scope.controlFieldDiv = false;
		}else{
			$scope.controlProjectInfDiv = false;
			$scope.preControlCategoryDiv = false;
			$scope.authDenyIdentifyDiv = false;
			$scope.controlFieldDiv = false;
		}
		var form = layui.form;
		form.on('select(getControlModeU)',function(data){
			if(data.value == "E"){
				$scope.controlProjectInfDiv = true;
				$scope.preControlCategoryDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlProjectInf.controlFieldDiv = true;
				$scope.preControlCategory = "";
				$scope.authDenyIdentify = "";
				$scope.controlField = "";
				$scope.controlProjectInf.transIdentifiNo = "";
			}else if(data.value == "S"){
				$scope.preControlCategoryDiv = true;
				$scope.controlProjectInfDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = false;
				$scope.preControlCategory = "";
				$scope.authDenyIdentify = "";
				$scope.controlProjectInf.controlField = "";
				$scope.controlProjectInf.transIdentifiNo = "";
			}else{
				$scope.controlProjectInfDiv = false;
				$scope.preControlCategoryDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = false;
				$scope.preControlCategory = "";
				$scope.authDenyIdentify = "";
				$scope.controlProjectInf.controlField = "";
				$scope.controlProjectInf.transIdentifiNo = "";
			}
		});
		form.on('select(getpreControlCategory)',function(data){
			if(data.value == "A"){
				$scope.authDenyIdentifyDiv = true;
			}else{
				$scope.authDenyIdentifyDiv = false;
			}
		});
		//关联
		$scope.treeSelect =[];
		$scope.queryParam = {
				operationMode:$scope.controlProjectInf.operationMode,
				controlProjectNo:$scope.controlProjectInf.controlProjectNo,
		};
		jfRest.request('limitList', 'query', $scope.queryParam)
		.then(function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData.rows == null) {
					$scope.treeSelect = [];
				} else {
					$scope.treeSelect = data.returnData.rows;
				}
			}
		});
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.evLstListTable.validCheck()) {
				return;
			}
			var items = $scope.evLstListTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect.length; k++) {
					if (items[i].eventNo  == $scope.treeSelect[k].eventNo) {    //判断是否存在
						tipStr = tipStr + items[i].eventNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.treeSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('YYJ100001') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ100002'));
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.treeSelect.splice(checkId, 1);
		};
		//事件列表
		$scope.evLstListTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					operationMode:$scope.controlProjectInf.operationMode,
					businessTypeCode:$scope.controlProjectInf.businessTypeCode,
					eventCircleType:"1",
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//管控项目建立
	webApp.controller('controlProjectEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
		$translate.refresh();
		//管控模式
		$scope.controlModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAndControl",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//预定义管控类别
		$scope.preControlCategoryArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//授权拒绝标识
		$scope.authDenyIdentifyArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_authorizationSign",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		}; 
		//管控动作
		$scope.controlFieldArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAction",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.controlProjectInfDiv = false;
		$scope.preControlCategoryDiv = false;
		$scope.authDenyIdentifyDiv = false;
		$scope.controlFieldDiv = false;	
		var form = layui.form;
		form.on('select(getControlModeA)',function(data){
			if(data.value == "E"){
				$scope.controlProjectInfDiv = true;
				$scope.preControlCategoryDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = true;
				$scope.controlProjectEst.preControlCategory = "";
				$scope.controlProjectEst.authDenyIdentify = "";
				$scope.controlProjectEst.controlField = "";
			}else if(data.value == "S"){
				$scope.preControlCategoryDiv = true;
				$scope.controlProjectInfDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = false;
				$scope.controlProjectEst.preControlCategory = "";
				$scope.controlProjectEst.authDenyIdentify = "";
				$scope.controlProjectEst.controlField = "";
			}else{
				$scope.controlProjectInfDiv = false;
				$scope.preControlCategoryDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = false;
				$scope.controlProjectEst.preControlCategory = "";
				$scope.controlProjectEst.authDenyIdentify = "";
				$scope.controlProjectEst.controlField = "";
			}
		});
		form.on('select(getpreControlCategory)',function(data){
			if(data.value == "A"){
				$scope.authDenyIdentifyDiv = true;
			}else{
				$scope.authDenyIdentifyDiv = false;
			}
		});
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
			//关联
			$scope.treeSelect =[];
			$scope.saveSelect = function() {
				var isTip = false;						//是否提示
				var tipStr = "";
				if (!$scope.evLstListTable.validCheck()) {
					return;
				}
				var items = $scope.evLstListTable.checkedList();
				for (var i = 0; i < items.length; i++) {
					var isExist = false;						//是否存在
					for (var k = 0; k < $scope.treeSelect.length; k++) {
						if (items[i].eventNo  == $scope.treeSelect[k].eventNo) {    //判断是否存在
							tipStr = tipStr + items[i].eventNo + ",";
							isTip = true;
							isExist = true;
							break;
						}
					}
					if(!isExist){
						$scope.treeSelect.push(items[i]);	
					}
				}
				if(isTip){
					jfLayer.alert(T.T('YYJ100001') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ100002'));
				}
			};
			// 删除关联活动
			$scope.removeSelect = function(data) {
				var checkId = data;
				$scope.treeSelect.splice(checkId, 1);
			};
			//事件列表
			$scope.evLstListTable = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params : {
						eventCircleType:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'evLstList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//复制页面控制器
	webApp.controller('copyControlProjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
		$translate.refresh();
		//管控模式
		$scope.controlModeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAndControl",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.controlMode=$scope.controlProjectInfCopy.controlMode;
			}
		};
		//预定义管控类别
		$scope.preControlCategoryArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlCategory",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.preControlCategory = $scope.controlProjectInfCopy.preControlCategory;
			}
		};
		//授权拒绝标识
		$scope.authDenyIdentifyArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_authorizationSign",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.authDenyIdentify = $scope.controlProjectInfCopy.authDenyIdentify;
			}
		}; 
		//管控动作
		$scope.controlFieldArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_controlAction",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.controlField = $scope.controlProjectInfCopy.controlField;
			}
		};
		$scope.controlProjectInfDiv = false;
		$scope.preControlCategoryDiv = false;
		$scope.authDenyIdentifyDiv = false;
		$scope.controlFieldDiv = false;
		var form = layui.form;
		form.on('select(getControlModeC)',function(data){
			if(data.value == "E"){
				$scope.controlProjectInfDiv = true;
				$scope.preControlCategoryDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = true;
				$scope.preControlCategory = "";
				$scope.authDenyIdentify = "";
				$scope.controlField = "";
			}else if(data.value == "S"){
				$scope.preControlCategoryDiv = true;
				$scope.controlProjectInfDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = false;
				$scope.preControlCategory = "";
				$scope.authDenyIdentify = "";
				$scope.controlField = "";
			}else{
				$scope.controlProjectInfDiv = false;
				$scope.preControlCategoryDiv = false;
				$scope.authDenyIdentifyDiv = false;
				$scope.controlFieldDiv = false;
				$scope.preControlCategory = "";
				$scope.authDenyIdentify = "";
				$scope.controlField = "";
			}
		});
		form.on('select(getpreControlCategory)',function(data){
			if(data.value == "A"){
				$scope.authDenyIdentifyDiv = true;
			}else{
				$scope.authDenyIdentifyDiv = false;
			}
		});
		if($scope.controlProjectInfCopy.controlMode == "S"){
			if($scope.controlProjectInfCopy.preControlCategory != "" && $scope.controlProjectInfCopy.preControlCategory != undefined 
					&& $scope.controlProjectInfCopy.preControlCategory != null && $scope.controlProjectInfCopy.preControlCategory != "null"){
				$scope.preControlCategoryDiv = true;
			}
			if($scope.controlProjectInfCopy.authDenyIdentify != "" && $scope.controlProjectInfCopy.authDenyIdentify != undefined 
					&& $scope.controlProjectInfCopy.authDenyIdentify != null && $scope.controlProjectInfCopy.authDenyIdentify != "null"){
				$scope.authDenyIdentifyDiv = true;
			}
		}
		if($scope.controlMode == "E"){
			$scope.controlFieldDiv = true;
		}
		form.on('select(getpreControlCategory)',function(data){
			if(data.value == "A"){
				$scope.authDenyIdentifyDiv = true;
			}else{
				$scope.authDenyIdentifyDiv = false;
			}
		});
		if($scope.controlMode == "E"){
			$scope.controlProjectInfDiv = true;
		}
		 //運營模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.updateOperationMode = $scope.controlProjectInfCopy.operationMode
	        }
	    };
		//关联
		$scope.treeSelect =[];
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.evLstListTable.validCheck()) {
				return;
			}
			var items = $scope.evLstListTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect.length; k++) {
					if (items[i].eventNo  == $scope.treeSelect[k].eventNo) {    //判断是否存在
						tipStr = tipStr + items[i].eventNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.treeSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('YYJ100001') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ100002'));
			}
		};
			// 删除关联活动
			$scope.removeSelect = function(data) {
				var checkId = data;
				$scope.treeSelect.splice(checkId, 1);
			};
			//事件列表
			$scope.evLstListTable = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params : {
						eventCircleType:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'evLstList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
});