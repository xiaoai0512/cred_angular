'use strict';
define(function(require) {
	var webApp = require('app');
	// 正负面清单查询及维护
	webApp.controller('contrlContCtrl', function($scope, $stateParams, jfRest,
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
	   	   			if($scope.eventList.search('AUS.PM.02.0221') != -1){    //管控清单新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.02.0222') != -1){    //管控清单查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.02.0223') != -1){    //管控清单修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
   			$scope.isshowC = false;
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
		//管控清单查询
		$scope.itemListc = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'contrlCont.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_listTypeFive'],//查找数据字典所需参数
				transDict : ['listTyp_listTypDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.operationMode){
				$scope.itemListc.params.operationMode = $scope.operationMode;
				$scope.itemListc.params.listCode = $scope.listCode;
				$scope.itemListc.search();
	   			$scope.isshowc = true;
			}else{
				$scope.isshowc = false;
				jfLayer.fail(T.T('SQJ2200010'));  //"请选择营运模式进行查询！"
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			$scope.item = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/contrlContInfo.html', $scope.item, {
				title : T.T('SQJ2200001'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '440px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addContrl = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/contrlContAdd.html', '', {
				title : T.T('SQJ2200013'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '600px' ],
				callbacks : [$scope.saveConInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveConInfo = function(result) {
			$scope.conInfoAdd = $.parseJSON(JSON.stringify(result.scope.conadd));
			$scope.conListAddNew = result.scope.conAddList;
			$scope.conInfoAdd.authContrlContList = [];
			var addconNew = "";
			if($scope.conListAddNew.length == 0){
				$scope.conInfoAdd.authContrlContList = [{}];
			}else{
				for (var i = 0; i < $scope.conListAddNew.length; i++) {
		 			addconNew ={listProject1:$scope.conListAddNew[i].listProject1,listProject2:$scope.conListAddNew[i].listProject2,listProject3:$scope.conListAddNew[i].listProject3,listProject4:$scope.conListAddNew[i].listProject4,listProject5:$scope.conListAddNew[i].listProject5,listProject6:$scope.conListAddNew[i].listProject6,listProject7:$scope.conListAddNew[i].listProject7,listProject8:$scope.conListAddNew[i].listProject8,listProject9:$scope.conListAddNew[i].listProject9,listProject10:$scope.conListAddNew[i].listProject10};
		 			$scope.conInfoAdd.authContrlContList.push(addconNew);
		 		}
			}
	 		$scope.conInfoAdd.listTyp = result.scope.listTypInfo;
				jfRest.request('contrlCont', 'save', $scope.conInfoAdd).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00058'));
	                	$scope.safeApply();
		    			result.cancel();
		    			$scope.conInfoAdd = {};
		    			$scope.operationMode = $scope.conInfoAdd.operationMode;
		    			$scope.listCode = $scope.conInfoAdd.listCode;
		    			$scope.itemListc.params.operationMode = $scope.conInfoAdd.operationMode;
						$scope.itemListc.params.listCode = $scope.conInfoAdd.listCode;
						$scope.itemListc.search();
			   			$scope.isshowc = true;
	                }
	            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			$scope.item = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/contrlContUpdate.html', $scope.item, {
				title : T.T('SQJ2200008'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.saveContrlUpdate ]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveContrlUpdate = function(result) {
			delete $scope.item['invalidFlag'];
			$scope.item.authContrlContList = [];
			var updateconNew = "";
		    $scope.contrlList = result.scope.contrlList;
		    if($scope.contrlList){
		    	for (var i = 0; i < $scope.contrlList.length; i++) {
		 			updateconNew ={id:$scope.contrlList[i].id,listSerialNumbr:$scope.contrlList[i].listSerialNumbr,listProject1:$scope.contrlList[i].listProject1,listProject2:$scope.contrlList[i].listProject2,listProject3:$scope.contrlList[i].listProject3,listProject4:$scope.contrlList[i].listProject4,listProject5:$scope.contrlList[i].listProject5,listProject6:$scope.contrlList[i].listProject6,listProject7:$scope.contrlList[i].listProject7,listProject8:$scope.contrlList[i].listProject8,listProject9:$scope.contrlList[i].listProject9,listProject10:$scope.contrlList[i].listProject10};
		 			$scope.item.authContrlContList.push(updateconNew);
		 		}
		    }else{
		    	$scope.item.authContrlContList = [];
		    }
 			jfRest.request('contrlCont', 'update', $scope.item).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.alert(T.T('F00022'));
					$scope.item = {};
					$scope.safeApply();
					result.cancel();
					$scope.itemListc.params.operationMode = $scope.item.operationMode;
					$scope.itemListc.params.listCode = $scope.item.listCode;
					$scope.itemListc.search();
		   			$scope.isshowc = true;
				}
			});
		};
	});
	// 管控清单查询
	webApp.controller('contrlListInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.itemInfoList = {
			params : $scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					 "flag":"F",
					 "listCode":$scope.item.listCode,
					 "listTyp": $scope.item.listTyp,
					 "authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'contrlCont.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 管控清单新增
	webApp.controller('contrlAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		//清单类型
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
		 $scope.conAddList = [];
	 	//特店ID--增加
	 	$scope.addConAdd = function(){
		   if($scope.conAddList == 0){
	 			$scope.conAddList = [{}];
	 		}
	 		else{
	 			$scope.conAddList.splice($scope.conAddList.length,0,{});
	 		}
	 	};
	 	//删除
	 	$scope.delContrlAdd = function(e,$index){
	 		$scope.conAddList.splice($index,1);
	 	}
	});
	// 正负面清单维护
	webApp.controller('conUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
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
				"pageSize":10,
				"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('contrlCont', 'query', $scope.queryParam).then(function(data) {
				$scope.contrlList = data.returnData.rows;
			});
		 $scope.addContrlU = function(){
	 		if($scope.contrlList == 0 || $scope.contrlList == "" || $scope.contrlList == null){
	 			$scope.contrlList = [{}];
	 		}
	 		else{
	 			$scope.contrlList.splice($scope.contrlList.length,0,{});
	 		}
	 	};
		//删除
	 	$scope.delList = function(e,$index){
	 		$scope.itemd = {};
	 		$scope.itemd.authContrlContList = [];
			var delnegNew = "";
			jfLayer.confirm(T.T('SQJ2200009'),function() {
		 		for (var i = 0; i < $scope.contrlList.length; i++) {
		 			if(i == $index){
		 				$scope.itemd.id = $scope.contrlList[i].id;
		 				delnegNew ={id:$scope.contrlList[i].id,invalidFlag:"1",listSerialNumbr:$scope.contrlList[i].listSerialNumbr,listProject1:$scope.contrlList[i].listProject1,listProject2:$scope.contrlList[i].listProject2,listProject3:$scope.contrlList[i].listProject3,listProject4:$scope.contrlList[i].listProject4,listProject5:$scope.contrlList[i].listProject5,listProject6:$scope.contrlList[i].listProject6,listProject7:$scope.contrlList[i].listProject7,listProject8:$scope.contrlList[i].listProject8,listProject9:$scope.contrlList[i].listProject9,listProject10:$scope.contrlList[i].listProject10};
			 			$scope.itemd.authContrlContList.push(delnegNew);
		 				break;
		 			}
		 		}
		 		$scope.itemd.operationMode = e.operationMode;
		 		$scope.itemd.listCode = e.listCode;
		 		$scope.itemd.listDesc = e.listDesc;
		 		$scope.itemd.listTyp = e.listTyp;
		 		if($scope.itemd.id == undefined){
		 			$scope.contrlList.splice($index,1);
		 			jfLayer.alert(T.T('F00037'));
		 		}
		 		else{
	 				jfRest.request('contrlCont', 'update', $scope.itemd).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.itemd = {};
							$scope.contrlList.splice($index,1);
							jfLayer.alert(T.T('F00037'));
						}
					});
		 		}
			},function() {
			});
	 	};
	 	//全部删除
	 	$scope.delAllCon =  function(){
	 		$scope.delitem = {};
	 		$scope.delitem.operationMode = $scope.item.operationMode;
	 		$scope.delitem.listCode = $scope.item.listCode;
	 		$scope.delitem.listDesc = $scope.item.listDesc;
	 		$scope.delitem.listTyp = $scope.item.listTyp;
	 		$scope.delitem.invalidFlag = "1";
	 		jfLayer.confirm(T.T('SQJ2200009'),function() {
 				jfRest.request('contrlCont', 'update', $scope.delitem).then(function(data) {
					if (data.returnCode == '000000') {
						$scope.delitem = {};
						$scope.contrlList = "";
						jfLayer.alert(T.T('F00037'));   
					}
				});
			},function() {
			});
	 	};
	});
});
