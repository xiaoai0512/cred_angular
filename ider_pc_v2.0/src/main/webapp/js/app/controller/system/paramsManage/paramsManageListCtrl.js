'use strict';
define(function(require) {
	var webApp = require('app');
	// 参数管理
	webApp.controller('paramsManageListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$rootScope.isCustomerNo = false;
		$rootScope.isExterNo = false;
		$rootScope.isriskLevelNo = false;
		$rootScope.productDimensionNoAdd = false;
		$scope.searchObj = {};
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{
	        	corporationEntityNo:$scope.corporationId,
	        	requestType:1,
	        	resultType:1,
	        	adminFlagLogin:$scope.adminFlagAuth
	        	},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 $scope.listCodeArr ={};
		 $scope.certificateTypeArray = [ {name : T.T('F00113'),id : '1'},//身份证
			                                {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
			                                {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
			                                {name : T.T('F00116') ,id : '4'} ,//中国护照
			                                {name : T.T('F00117') ,id : '5'} ,//外国护照
			                                {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		//差异化类型  [{name:'无',id:'0'},{name:'风险组别',id:'1'},{name:'客户',id:'2'},{name:'媒介',id:'3'}];
		 $scope.differentTypeArray = [{name:T.T('SQH1700084'),id:'0'},{name:T.T('SQH1700085'),id:'1'},{name:T.T('SQH1700086'),id:'2'},{name:T.T('SQH1700087'),id:'3'},{name:'SQJ1700029',id:'4'}];
		 $scope.eventList = "";
		 $scope.addBtnFlag = true;
		 $scope.selBtnFlag = true;
		 $scope.updBtnFlag = true;
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
	   	   			/*if($scope.eventList.search('AUS.PM.02.0201') != -1){    //授权场景新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.02.0202') != -1){    //授权场景查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.02.0203') != -1){    //授权场景修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}*/
   				}
   			});
   			$scope.isshowa = false;
   			$scope.isshowb = false;  		
		//查询
		$scope.itemList = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0,
						"type":"DROPDOWNBOX"
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
//				autoQuery:false,
				resource : 'paramsManage.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.selIdType = "";
		$scope.selIdNum = "";
		$scope.selDifferentCode = "";
		//查询按钮事件
		$scope.seachList = function(){
			$scope.itemList.params.groupsCodeDesc = $scope.searchObj.groupsCodeDesc;
			$scope.itemList.params.groupsCode = $scope.searchObj.groupsCode;
			$scope.itemList.params.type = 'DROPDOWNBOX';
			$scope.itemList.search();
		};
		//查询详情事件
		$scope.selectDetail = function(event) {
			$scope.itemEvent = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/paramsManage/paramsView.html', $scope.item, {
				title : T.T('SQJ2200001'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '440px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addList = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/system/paramsManage/paramsAdd.html', '', {
				title : "新增参数",
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '450px' ],
				callbacks : [$scope.saveParamsInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveParamsInfo = function(result) {
			$scope.paramsAddPa = {};
			$scope.paramsAddPa = $.parseJSON(JSON.stringify(result.scope.paramsadd));
			$scope.paramsAddPa.langList =  result.scope.paramsAddList;
			$scope.paramsAddPa.type='DROPDOWNBOX';
			console.log($scope.paramsAddPa);
			jfRest.request('paramsManage', 'save', $scope.paramsAddPa).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.paramsadd = {};
	    			result.scope.paramsAddList = [];
	    			$scope.itemList.search();
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			$scope.itemEvent = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/paramsManage/paramsUpdate.html', $scope.item, {
				title : T.T('SQJ2200008'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.updateParams ]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.updateParams = function(result) {
			$scope.paramsUpPa = {};
			$scope.paramsUpPa = $.parseJSON(JSON.stringify(result.scope.upitemInf));
			$scope.paramsUpPa.langList =  result.scope.paramsAddList;
			$scope.paramsUpPa.type='DROPDOWNBOX';
			jfRest.request('paramsManage', 'update', $scope.paramsUpPa).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.itemList.search();
				}
			});
		};
		//删除
		$scope.deleteInfo =  function(event) {
			$scope.itemInf = $.parseJSON(JSON.stringify(event));
			$scope.itemInf.type='DROPDOWNBOX';
			jfLayer.confirm('确定删除？',function(){//确定
				jfRest.request('paramsManage', 'deletePa', $scope.itemInf) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.itemList.search();
					}
				});
			},function(){//取消
			})
		};
	});
	// 参数查询
	webApp.controller('paramsViewCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		console.log($scope.item);
		$scope.itemInfo = $scope.item;
		//查询
		$scope.itemParams = {
				queryFlag: 'children',
				type: $scope.itemInfo.type,
				groupsCode: $scope.itemInfo.groupsCode,
		};
		jfRest.request('paramsManage', 'query', $scope.itemParams) .then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData){
					if(data.returnData.rows){
						$scope.paramsAddList = data.returnData.rows;
					}else {
						$scope.paramsAddList  = [];
					}
				}else {
					$scope.paramsAddList  = [];
				}
			}
		});
	});
	// 参数新增
	webApp.controller('paramsAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		 $scope.paramsAddList = [];
	 	//参数信息增加
	 	$scope.addParamsInfo = function(){
		   if($scope.paramsAddList == 0){
	 			$scope.paramsAddList = [{}];
	 		}
	 		else{
	 			$scope.paramsAddList.splice($scope.paramsAddList.length,0,{});
	 		}
	 	};
	 	//删除
	 	$scope.delParamsAdd = function(e,$index){
	 		$scope.paramsAddList.splice($index,1);
	 	};
	});
	// 参数维护
	webApp.controller('paramsUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		 $scope.upitemInf =  $scope.item;
		//查询
			$scope.itemParams = {
					queryFlag: 'children',
					type: $scope.upitemInf.type,
					groupsCode: $scope.upitemInf.groupsCode,
			};
			jfRest.request('paramsManage', 'query', $scope.itemParams) .then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData){
						if(data.returnData.rows){
							$scope.paramsAddList = data.returnData.rows;
						}else {
							$scope.paramsAddList  = [];
						}
					}else {
						$scope.paramsAddList  = [];
					}
				}
			});
//		 $scope.paramsAddList = [];
		 	//参数信息增加
		 	$scope.addParamsInfo = function(){
			   if($scope.paramsAddList == 0){
		 			$scope.paramsAddList = [{}];
		 		}
		 		else{
		 			$scope.paramsAddList.splice($scope.paramsAddList.length,0,{});
		 		}
		 	};
		 	//删除
		 	$scope.delParamsAdd = function(e,$index){
		 		$scope.paramsAddList.splice($index,1);
		 	};
	});
});
