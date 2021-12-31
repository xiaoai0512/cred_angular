'use strict';
define(function(require) {
	var webApp = require('app');
	// 正负面清单查询及维护
	webApp.controller('exceptionInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_exceptionManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
	   	   			if($scope.eventList.search('AUS.PM.02.0211') != -1){    //例外清单新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.02.0212') != -1){    //例外清单查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.02.0213') != -1){    //例外清单修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
   			$scope.isEshow = false;
  			var form = layui.form;
  			form.on('select(getOperationMode)',function(event){
  				if(event.value){
  			  		//管控场景码
  		  			 $scope.listCodeArr ={ 
  		  		        type:"dynamicDesc", 
  		  		        param:{
  		  		        	operationMode:event.value,
  		  		        	differentType:'0',
  		  		        	},//默认查询条件 
  		  		        text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称 
  		  		        desc:"contrlSceneDesc",
  		  		        value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
  		  		        resource:"diffQueryb.query",//数据源调用的action 
  		  		        callback: function(data){
  		  		        	
  		  		        }
  		  		    };
  				}
  			});
		//正负面清单查询
		$scope.exceptionMList = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'exceptionList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_listTypeFive'],//查找数据字典所需参数
				transDict : ['listTyp_listTypDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.isEshow = true;
					}else{
						$scope.isEshow = false;
					}
				}
			};
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.operationMode){
				$scope.exceptionMList.params.operationMode = $scope.operationMode;
				$scope.exceptionMList.params.listCode = $scope.listCode;
				$scope.exceptionMList.search();
			}else{
				$scope.isEshow = false;
				jfLayer.fail(T.T('SQJ2200010'));  //"请选择营运模式进行查询！"
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			$scope.item = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/exceptionManageInfo.html', $scope.item, {
				title : T.T('SQH3500003'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '440px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addException = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/exceptionManageAdd.html', '', {
				title : T.T('SQH3500001'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '600px' ],
				callbacks : [$scope.saveExcepInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveExcepInfo = function(result) {
			$scope.exceptionAdd = $.parseJSON(JSON.stringify(result.scope.exception));
			$scope.excepAddNew = result.scope.excepAddList;
			$scope.exceptionAdd.authContrlExcplist = [];
			var addnegNew = "";
			if($scope.excepAddNew.length == 0){
				$scope.exceptionAdd.authContrlExcplist = [{}];
			}
			else{
				for (var i = 0; i < $scope.excepAddNew.length; i++) {
		 			addnegNew ={listProject1:$scope.excepAddNew[i].listProject1,listProject2:$scope.excepAddNew[i].listProject2,listProject3:$scope.excepAddNew[i].listProject3,listProject4:$scope.excepAddNew[i].listProject4,listProject5:$scope.excepAddNew[i].listProject5,listProject6:$scope.excepAddNew[i].listProject6,listProject7:$scope.excepAddNew[i].listProject7,listProject8:$scope.excepAddNew[i].listProject8,listProject9:$scope.excepAddNew[i].listProject9,listProject10:$scope.excepAddNew[i].listProject10};
		 			$scope.exceptionAdd.authContrlExcplist.push(addnegNew);
		 		}
			}
	 		$scope.exceptionAdd.listTyp = result.scope.listTypInfo;
	 		$scope.exceptionAdd.differentType = 0;
	 		jfRest.request('exceptionList', 'add', $scope.exceptionAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.exceptionAdd = {};
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			$scope.itemEvent = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemEvent = $.parseJSON(JSON.stringify(event));
			$scope.item = {};
			$scope.item.id = $scope.itemEvent.id;
			$scope.item.listCode = $scope.itemEvent.listCode;
			$scope.item.listTyp = $scope.itemEvent.listTyp;
			$scope.item.operationMode = $scope.itemEvent.operationMode;
			$scope.item.listDesc = $scope.itemEvent.listDesc;
			$scope.item.listProperties = $scope.itemEvent.listProperties;
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			if($scope.item.listTyp == 'CN'){
				$scope.listTypInfo = T.T('SQJ2200005');
			}else if($scope.item.listTyp == 'MH'){
				$scope.listTypInfo = T.T('SQJ2200006');
			}else if($scope.item.listTyp == 'TM'){
				$scope.listTypInfo = T.T('SQJ2200007');
			}else if($scope.item.listTyp == 'PD'){
				$scope.listTypInfo = T.T('SQJ1700029');
			}else if($scope.item.listTyp == 'MC'){
				$scope.listTypInfo = T.T('SQJ2200011');
			}else if($scope.item.listTyp == 'MN'){
				$scope.listTypInfo = T.T('SQJ2200012');
			}
			if($scope.item.listProperties == 'P'){
				$scope.listPropertiesInfo = T.T('SQJ2200003');
			}else if($scope.item.listProperties == 'N'){
				$scope.listPropertiesInfo = T.T('SQJ2200004');
			}
			$scope.modal('/authorization/controltrading/exceptionManageUpdate.html', $scope.item, {
				title : T.T('SQH3500002'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.saveNega ]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveNega = function(result) {
			delete $scope.item['invalidFlag'];
			$scope.item.authContrlExcplist = [];
			var updateExcNew = "";
		    $scope.exceptionUList = result.scope.exceptionUList;
		    if($scope.exceptionUList){
		    	for (var i = 0; i < $scope.exceptionUList.length; i++) {
		 			updateExcNew ={id:$scope.exceptionUList[i].id,listSerialNumbr:$scope.exceptionUList[i].listSerialNumbr,listProject1:$scope.exceptionUList[i].listProject1,listProject2:$scope.exceptionUList[i].listProject2,listProject3:$scope.exceptionUList[i].listProject3,listProject4:$scope.exceptionUList[i].listProject4,listProject5:$scope.exceptionUList[i].listProject5,listProject6:$scope.exceptionUList[i].listProject6,listProject7:$scope.exceptionUList[i].listProject7,listProject8:$scope.exceptionUList[i].listProject8,listProject9:$scope.exceptionUList[i].listProject9,listProject10:$scope.exceptionUList[i].listProject10};
		 			$scope.item.authContrlExcplist.push(updateExcNew);
		 		}
		    }else{
		    	$scope.item.authContrlExcplist = [];
		    }
		    $scope.item.differentType = 0;
		    jfRest.request('exceptionList', 'update', $scope.item).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
		};
	});
	// 正负面清单查询
	webApp.controller('excepListInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		console.log($scope.item);
		$scope.itemInfoList = {
				params : $scope.queryParam = {
						"operationMode":$scope.item.operationMode,
						 "differentCode":$scope.item.differentCode,
						 "differentType":$scope.item.differentType,
						 "flag":"F",
						 "listCode":$scope.item.listCode,
						 "listTyp": $scope.item.listTyp,
						 "listProperties": $scope.item.listProperties,
						 "authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'exceptionList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
	});
	// 正负面清单新增
	webApp.controller('excepAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		 $scope.listCodeAddArr ={ };
	        //联动验证
	        var form = layui.form;
  			form.on('select(getOperationModeAdd)',function(event){
  				if(event.value){
  			  		//管控场景码
  		  			 $scope.listCodeAddArr ={ 
  		  		        type:"dynamicDesc", 
  		  		        param:{
  		  		        	operationMode:event.value,
  		  		        	differentType:'0',
  		  		        	},//默认查询条件 
  		  		        text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称 
  		  		        desc:"contrlSceneDesc",
  		  		        value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
  		  		        resource:"diffQueryb.query",//数据源调用的action 
  		  		        callback: function(data){
  		  		        }
  		  		    };
  				}
  			});
		//自定义下拉框---------清单类型 
  			$scope.listTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_listTypeFive",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData:['PD','CH'],
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
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
		 $scope.excepAddList = [];
	 	//特店ID--增加
	 	$scope.addExcepAdd = function(){
		   if($scope.excepAddList == 0){
	 			$scope.excepAddList = [{}];
	 		}
	 		else{
	 			$scope.excepAddList.splice($scope.excepAddList.length,0,{});
	 		}
	 	};
	 	//删除
	 	$scope.delExcepAdd = function(e,$index){
	 		$scope.excepAddList.splice($index,1);
	 	}
	});
	// 正负面清单维护
	webApp.controller('exceptionUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
		 $scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					 "flag":"F",
					 "listCode":$scope.item.listCode,
					 "listTyp": $scope.item.listTyp,
					 "listProperties": $scope.item.listProperties,
					"pageSize":10,
					"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('exceptionList', 'query', $scope.queryParam).then(function(data) {
				$scope.exceptionUList = data.returnData.rows;
			});
		 $scope.addExceptionU = function(){
	 		if($scope.exceptionUList == 0 || $scope.exceptionUList == "" || $scope.exceptionUList == null){
	 			$scope.exceptionUList = [{}];
	 		}
	 		else{
	 			$scope.exceptionUList.splice($scope.exceptionUList.length,0,{});
	 		}
	 	};
		//删除
	 	$scope.delList = function(e,$index){
	 		$scope.itemd = {};
	 		$scope.itemd.authContrlExcplist = [];
			var delnegNew = "";
			jfLayer.confirm(T.T('SQJ2200009'),function() {
		 		for (var i = 0; i < $scope.exceptionUList.length; i++) {
		 			if(i == $index){
		 				$scope.itemd.id = $scope.exceptionUList[i].id;
		 				delnegNew ={id:$scope.exceptionUList[i].id,invalidFlag:"1",listSerialNumbr:$scope.exceptionUList[i].listSerialNumbr,listProject1:$scope.exceptionUList[i].listProject1,listProject2:$scope.exceptionUList[i].listProject2,listProject3:$scope.exceptionUList[i].listProject3,listProject4:$scope.exceptionUList[i].listProject4,listProject5:$scope.exceptionUList[i].listProject5,listProject6:$scope.exceptionUList[i].listProject6,listProject7:$scope.exceptionUList[i].listProject7,listProject8:$scope.exceptionUList[i].listProject8,listProject9:$scope.exceptionUList[i].listProject9,listProject10:$scope.exceptionUList[i].listProject10};
			 			$scope.itemd.authContrlExcplist.push(delnegNew);
		 				break;
		 			}
		 		}
		 		$scope.itemd.operationMode = e.operationMode;
		 		$scope.itemd.listCode = e.listCode;
		 		$scope.itemd.listDesc = e.listDesc;
		 		$scope.itemd.listTyp = e.listTyp;
		 		$scope.itemd.listProperties = e.listProperties;
		 		if($scope.itemd.id == undefined){
		 			$scope.exceptionUList.splice($index,1);
		 			jfLayer.alert(T.T('F00037'));
		 		}
		 		else{
	 				jfRest.request('exceptionList', 'update', $scope.itemd).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.itemd = {};
							$scope.exceptionUList.splice($index,1);
							jfLayer.alert(T.T('F00037'));
						}
					});
		 		}
			},function() {
			});
	 	};
	 	//全部删除
	 	$scope.delAllExceptionU =  function(){
	 		$scope.delitem = {};
	 		$scope.delitem.operationMode = $scope.item.operationMode;
	 		$scope.delitem.listCode = $scope.item.listCode;
	 		$scope.delitem.listDesc = $scope.item.listDesc;
	 		$scope.delitem.listTyp = $scope.item.listTyp;
	 		$scope.delitem.listProperties = $scope.item.listProperties;
	 		$scope.delitem.invalidFlag = "1";
	 		jfLayer.confirm(T.T('SQJ2200009'),function() {
 				jfRest.request('exceptionList', 'update', $scope.delitem).then(function(data) {
					if (data.returnMsg == 'OK') {
						$scope.delitem = {};
						$scope.exceptionUList = "";
						jfLayer.alert(T.T('F00037'));   
					}
				});
			},function() {
			});
	 	};
	});
});
