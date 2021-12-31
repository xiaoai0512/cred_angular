'use strict';
define(function(require) {
	var webApp = require('app');
	// 营销清单查询及维护
	webApp.controller('marketingListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/marketing/i18n_marketing');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.isTableInfo = false;
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
			//自定义下拉框---------清单类型 'CH'渠道，MH'特店列表，PD产品对象
		 $scope.listTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_listTypeFive",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData:['TM','MN','MC','CN'],
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
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
	   	   			if($scope.eventList.search('AUS.PM.04.0201') != -1){    //营销清单新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.04.0202') != -1){    //营销清单查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.04.0203') != -1){    //营销清单修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
		//营销清单查询
		$scope.itemListb = {
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'marketing.queryList',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_listTypeFive'],//查找数据字典所需参数
				transDict : ['listTyp_listTypDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.isTableInfo = true;
					}else{
						$scope.isTableInfo = false;
					}
				}
			};
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.operationMode){
				$scope.itemListb.params.operationMode = $scope.operationMode;
				$scope.itemListb.params.listTyp = $scope.listTyp;
				$scope.itemListb.params.listCode = $scope.listCode;
				$scope.itemListb.search();
			}else{
				jfLayer.fail(T.T('SQJ310001'));  //请选择营运模式进行查询！
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			$scope.itemEvent = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/marketing/marketingListInfo.html', $scope.item, {
				title : T.T('SQJ310002'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '440px' ],
				callbacks : []
			});
		};
		//新增事件
		$scope.addLimitcon = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/marketing/marketingListAdd.html', '', {
				title : T.T('SQJ310003'),  //营销清单新增
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '600px' ],
				callbacks : [$scope.saveNegaInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveNegaInfo = function(result) {
			$scope.authAdd = $.parseJSON(JSON.stringify(result.scope.listadd));
			if(result.scope.tradList.length == 0){
				jfLayer.fail(T.T('SQJ310004'));  //必须要加一个清单项目
				return;
			}
			$scope.authAdd.listProject = result.scope.tradList;
	 		$scope.authAdd.authDataSynFlag = "1";
	 		jfRest.request('marketing','saveList', $scope.authAdd).then(function(data) {
                if (data.returnMsg == 'OK') {
                	jfLayer.success(T.T('F00058'));  //建立成功
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.authAdd = {};
	    			$scope.seachQuota();
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			$scope.item = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			console.log($scope.item);
			$scope.modal('/authorization/marketing/marketingListUpdate.html', $scope.item, {
				title : T.T('SQH310026'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.saveNega ]
			});
		};
	// 保存信息事件
	$scope.saveNega = function(result) {
		$scope.item = $.parseJSON(JSON.stringify(result.scope.item));
		$scope.item.listProject ={};
		/*$scope.item.listProject = result.scope.tradUpdateList;*/
		$scope.item.listProject = result.scope.tradUpdateList;
		$scope.item.listTyp = result.scope.listTypUpdate;
		/*if($scope.item.listProject.length == 0 ){
			jfLayer.fail(T.T('SQJ310004'));
			return;
		}*/
 		$scope.item.authDataSynFlag = "1";
 		jfRest.request('marketing','updateList', $scope.item).then(function(data) {
            if (data.returnMsg == 'OK') {
            	jfLayer.success(T.T('F00058'));
            	$scope.safeApply();
    			result.cancel();
    			$scope.authAdd = {};
    			$scope.seachQuota();
            }
        });
	};
	});
	// 营销清单详情查询
	webApp.controller('marketingListInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		 $scope.listTypArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_listTypeFive",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData:['TM','MN','MC','CN'],
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.listTypInfo = $scope.item.listTyp;
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
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };
			//自定义下拉框---------清单类型 
			$scope.itemInfoList = {
				params : $scope.queryParam = {
						"operationMode":$scope.item.operationMode,
						 "listCode":$scope.item.listCode,
						 "listTyp": $scope.item.listTyp,
						 "listSerialNumbr": $scope.item.listSerialNumbr,
						 "authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'marketing.queryList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	// 正负面清单新增
	webApp.controller('marketingListAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		//自定义下拉框---------清单类型 
		 $scope.listTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_listTypeFive",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData:['TM','MN','MC','CN'],
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
		//定义清單項目模式信息--------默认值
			$scope.tradList = "";
	 	//清單項目
	 	$scope.tradTypeAdd = function(){
	 		if($scope.tradList == 0){
	 			$scope.tradList = [{}];
	 		}
	 		else{
	 			$scope.tradList.splice($scope.tradList.length,0,{});
	 		}
	 	};
	 	//删除交易模式
	 	$scope.tradDel = function(e,$index){
	 		$scope.tradList.splice($index,1);
	 	}
	});
	// 营销清单维护
	webApp.controller('marketingListUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.listTypArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_listTypeFive",
	        	queryFlag: "children"
	        },//默认查询条件 
	        rmData:['TM','MN','MC','CN'],
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.listTypUpdate = $scope.item.listTyp;
	        }
		};
		//自定义下拉框---------清单类型 
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
	        	$scope.operationModeUpdate = $scope.item.operationMode;
	        }
	    };
		 $scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					 "listCode":$scope.item.listCode,
					 "listTyp": $scope.item.listTyp,
					 "listSerialNumbr": $scope.item.listSerialNumbr,
					 "authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('marketing', 'queryList', $scope.queryParam).then(function(data) {
				$scope.tradUpdateList = data.returnData.rows;
			});
		 $scope.tradUpdateList = $scope.item.listProject;
		 $scope.addNega = function(){
		 		if($scope.tradUpdateList == 0 || $scope.tradUpdateList == "" || $scope.tradUpdateList == null){
		 			$scope.tradUpdateList = [{}];
		 		}
		 		else{
		 			$scope.tradUpdateList.splice($scope.tradUpdateList.length,0,{});
		 		}
		 	};
		 	//删除
		 	$scope.tradDel = function(e,$index){
		 		console.log($scope.item);
		 		$scope.itemd = {};
		 		$scope.itemd.listProject = [];
				var delnegNew = "";
				jfLayer.confirm(T.T('F00092'),function() {
					/*if($scope.tradUpdateList.length == 1){
						jfLayer.fail('SQJ310005');
						return;
					}*/
			 		for (var i = 0; i < $scope.tradUpdateList.length; i++) {
			 			if(i == $index){
			 				$scope.itemd.id = $scope.tradUpdateList[i].id;
			 				delnegNew ={id:$scope.tradUpdateList[i].id,invalidFlag:"1",listSerialNumbr:$scope.tradUpdateList[i].listSerialNumbr,listProject1:$scope.tradUpdateList[i].listProject1,listProject2:$scope.tradUpdateList[i].listProject2,listProject3:$scope.tradUpdateList[i].listProject3,listProject4:$scope.tradUpdateList[i].listProject4,listProject5:$scope.tradUpdateList[i].listProject5,listProject6:$scope.tradUpdateList[i].listProject6,listProject7:$scope.tradUpdateList[i].listProject7,listProject8:$scope.tradUpdateList[i].listProject8,listProject9:$scope.tradUpdateList[i].listProject9,listProject10:$scope.tradUpdateList[i].listProject10};
				 			$scope.itemd.listProject.push(delnegNew);
			 				break;
			 			}
			 		}
			 		$scope.itemd.operationMode = $scope.item.operationMode;
			 		$scope.itemd.listCode = $scope.item.listCode;
			 		$scope.itemd.listDesc = $scope.item.listDesc;
			 		$scope.itemd.listTyp = $scope.item.listTyp;
			 		//$scope.itemd.listSerialNumbr = e.listSerialNumbr;
			 		if($scope.itemd.id == undefined){
			 			$scope.tradUpdateList.splice($index,1);
			 			jfLayer.alert(T.T('F00037'));
			 		}
			 		else{
			 			jfRest.request('marketing', 'updateList', $scope.itemd).then(function(data) {
			 		    	if (data.returnMsg == 'OK') {
									$scope.itemd = {};
									$scope.tradUpdateList.splice($index,1);
									jfLayer.alert(T.T('F00037'));
								}
							});
			 		}
				},function() {
				});
		 	};
		 	//全部删除
		 	$scope.delAllNeg =  function(){
		 		$scope.delitem = {};
		 		$scope.delitem.operationMode = $scope.item.operationMode;
		 		$scope.delitem.listCode = $scope.item.listCode;
		 		$scope.delitem.listDesc = $scope.item.listDesc;
		 		$scope.delitem.listTyp = $scope.item.listTyp;
		 		$scope.delitem.listSerialNumbr= $scope.item.listSerialNumbr;
		 		$scope.delitem.invalidFlag = "1";
		 		jfLayer.confirm(T.T('F00092'),function() {
		 				jfRest.request('marketing', 'updateList', $scope.delitem).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.delitem = {};
								$scope.negasList = "";
								jfLayer.alert(T.T('F00037'));   
							}
						});
		 			});
		 	}
	});
});
