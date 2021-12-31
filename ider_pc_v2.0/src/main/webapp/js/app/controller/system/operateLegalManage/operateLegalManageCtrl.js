'use strict';
define(function(require) {
	var webApp = require('app');
	// 运营模式法人管理
	webApp.controller('optLegalMageCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.userFlag = [{name : '正常用户' ,id : 'A'},{name : '停用' ,id : 'S'},{name : '已注销' ,id : 'P'}] ;
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
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
	   	   			if($scope.eventList.search('COS.AD.02.0130') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.IQ.02.0130') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0120') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		//运营模式
		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"legalPerson.queryMode",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 //法人查询
		 $scope.legalArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
		        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"legalPerson.queryLegal",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//法人查询
		$scope.itemList = {
				params : $scope.queryParam = {
						authDataSynFlag:"1",
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'legalPerson.queryLegalPerson',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//增加法人
		$scope.addLegal = function() {
			$scope.modal('/system/operateLegalManage/addLegal.html', '', {
				title : '新增法人',
				buttons : [ '确定','关闭'],
				size : [ '800px', '530px' ],
				callbacks : [$scope.addLegalSure ]
			});
		};
		//确定新增用户
		$scope.addLegalSure = function(result){
			$scope.legalAddInfo = $.parseJSON(JSON.stringify(result.scope.legalAdd));
			jfRest.request('legalPerson', 'addLegalPerson', $scope.legalAddInfo).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success("新增法人成功");
	                	$scope.legalAddInfo = {};
	                	$scope.itemList.search();
	                }
	    			$scope.safeApply();
	    			result.cancel();
	            });
		};
		//修改用户
		$scope.updateLegal = function(event) {
			$scope.itemLegal = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/operateLegalManage/updateLegal.html', $scope.itemLegal, {
				title : '修改法人信息',
				buttons : [ '确定','关闭'],
				size : [ '800px', '430px' ],
				callbacks : [$scope.updateLegalSure ]
			});
		};
		//确定修改用户
		$scope.updateLegalSure = function(result){
			$scope.itemParams = result.scope.itemUpdate;
			$scope.itemParams.operationMode = result.scope.itemUpdate.upOperationMode;
			$scope.itemParams.corporationEntityNo = result.scope.itemUpdate.upCorporationEntityNo;
			jfRest.request('legalPerson', 'updateLegalPerson', $scope.itemParams).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success("修改成功");
					$scope.itemLegal = {};
					$scope.itemList.search();
				}
				$scope.safeApply();
				result.cancel();
			});
		};
		//法人详情userInfo
		$scope.viewLegal = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/system/operateLegalManage/viewLegal.html', $scope.item, {
				title : '用户详细信息',
				buttons : ['关闭'],
				size : [ '800px', '430px' ],
				callbacks : []
			});
		};
	});
	// 新增法人
	webApp.controller('addLegalCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.legalAdd ={};
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
		 //法人查询
		 $scope.legalArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
		        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"legalPerson.queryLegal",//数据源调用的action 
		        callback: function(data){
		        }
		    };
	});
	//法人详情
	webApp.controller('viewLegalCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.viewLegal = {};
		//运营模式
		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	 $scope.operationMode =  $scope.item.operationMode;
		        }
		    };
		 //法人查询
		 $scope.legalArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
		        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"legalPerson.queryLegal",//数据源调用的action 
		        callback: function(data){
		        	$scope.corporationEntityNo =  $scope.item.corporationEntityNo;
		        }
		    };
	});
	// 修改用户
	webApp.controller('updateLegalCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.itemUpdate = $scope.itemLegal;
		//运营模式
		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.itemUpdate.upOperationMode = $scope.itemLegal.operationMode;
		        }
		    };
		 //法人查询
		 $scope.legalArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
		        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"legalPerson.queryLegal",//数据源调用的action 
		        callback: function(data){
		        	$scope.itemUpdate.upCorporationEntityNo = $scope.itemLegal.corporationEntityNo;
		        }
		    };
	});
});
