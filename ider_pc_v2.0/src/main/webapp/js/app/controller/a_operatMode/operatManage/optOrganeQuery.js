'use strict';
define(function(require) {
	var webApp = require('app');
	// 运营机构查询
	webApp.controller('optOrganQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {   
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optOrgan');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0005') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0005') != -1){    //查询
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0005') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
			$scope.optOrganInf = {};
			$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 	var form = layui.form;
			form.on('select(organl)',function(event){
				if(event.value=="B0"){
					$scope.operationModeShow = true;
					$scope.optOrganInf.operationModeLevel ="";
				}else{
					$scope.operationModeShow = false;
					$scope.optOrganInf.operationModeLevel ="";
				}
				//上级机构下拉框
				$scope.upperOrganNoQuery ={ 
			           type:"dynamic", 
			           param:{"organLevel":event.value},//默认查询条件 
			           text:"organName", //下拉框显示内容，根据需要修改字段名称 
			           value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
			           resource:"operationOrgan.query",//数据源调用的action 
			           callback:function(data){
			           }
			      };
			});
		$scope.userName = sessionStorage.getItem("userName");   //获取登陆人员
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		/*if($scope.adminFlag !="1" && $scope.adminFlag != "2"){
			$scope.organization = $scope.userInfo.organization;  //获取组织机构
			$("#organNo").attr("disabled",true);
		}
		$scope.resetChose = function(){
			if($scope.adminFlag !="1" && $scope.adminFlag != "2"){
				$scope.optOrganList.params={"organNo":$scope.organization};
			}else{
				$scope.optOrganList.params={};
			}
		}*/
		//运营机构列表
		$scope.optOrganList = {
			params : {
					"organNo":$scope.organization,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'operationOrgan.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checkOptOrganInf = function(event) {
			$scope.optOrganInf = $.parseJSON(JSON.stringify(event));
			$scope.operationModeShow =false;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/viewOptOrgan.html',
				$scope.optOrganInf, {
				title : T.T('YYJ1000002'),
				buttons : [  T.T('F00012') ],
				size : [ '900px', '320px' ],
				callbacks : []
			});
			//上级机构下拉框
			$scope.upperOrganNoQuery ={ 
		           type:"dynamic", 
		           param:{},//默认查询条件 
		           text:"organName", //下拉框显示内容，根据需要修改字段名称 
		           value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
		           resource:"operationOrgan.query",//数据源调用的action 
		           callback:function(data){
		        	   $scope.optOrganInf.upperOrganNoView = $scope.optOrganInf.upperOrganNo;
		           }
		      };
			//机构层级为B0显示运营模式层级
			if($scope.optOrganInf.organLevel == "B0"){
				$scope.operationModeShow =true;
			}
		};
		//新增
		$scope.addOptOrganList = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/optOrganEst.html', '', {
				title : T.T('YYJ1000004'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [$scope.saveOptOrgan]
			});
		};
		//新增按钮回调函数		
		$scope.saveOptOrgan = function(result){
			$scope.optOrganInf={};
			$scope.optOrganInf= result.scope.optOrganInf;
			if($scope.optOrganInf.organLevel=="B0"){
				if($scope.optOrganInf.operationModeLevel ==""){
					jfLayer.alert(T.T('YYJ1000001'));
					return;
				}
			}
			jfRest.request('operationOrgan', 'save', $scope.optOrganInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.optOrganInf ="";
					result.scope.optOrganInfoForm.$setPristine();
					$scope.optOrganList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//复制
		$scope.checkOptOrganInfCopy = function(event){
			$scope.optOrganInfCopy = {};
			$scope.optOrganInfCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/optOrganEstCopy.html',$scope.optOrganInfCopy, {
				title : T.T('YYJ1000005'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.addcheckOptOrganListCopy]
			});
		};
		//复制回调函数
		$scope.addcheckOptOrganListCopy = function(result){
			$scope.optOrganCopy={};
			$scope.optOrganCopy= result.scope.optOrganInfCopy;
			$scope.optOrganCopy.operationModeLevel = result.scope.operationModeLevel;
			$scope.optOrganCopy.organLevel = result.scope.organLevel;
			if($scope.optOrganCopy.organLevel=="B0"){
				if($scope.optOrganCopy.operationModeLevel ==""){
					jfLayer.alert(T.T('YYJ1000001'));
					return;
				}
			}
			jfRest.request('operationOrgan', 'save', $scope.optOrganCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.optOrganCopy ={};
					result.scope.optOrganInfoForm.$setPristine();
					$scope.optOrganList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 修改
		$scope.updateOptOrganInf = function(event) {
			$scope.operationModeShow = false;
			$scope.optOrganInf = $.parseJSON(JSON.stringify(event));
			//机构层级为B0显示运营模式层级
			if($scope.optOrganInf.organLevel == "B0"){
				$scope.operationModeShow =true;
			}else{
				$scope.operationModeShow = false;
		}
		// 页面弹出框事件(弹出页面)
		$scope.modal('/a_operatMode/optcenter/updateOptOrgan.html',
			$scope.optOrganInf, {
				title : T.T('YYJ1000003'),
				buttons : [ T.T('F00107'), T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [ $scope.updateProObject ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateProObject = function(result) {
			var key;
			for (key in  $scope.proObjectInf){
				if($scope.proObjectInf[key] == "null" ||$scope.proObjectInf[key] == null ){
					$scope.proObjectInf[key] = '';
                }
            }
            $scope.optOrganInf.upperOrganNo	=  $scope.optOrganInf.upperOrganNoUpdate;
			$scope.optOrganInf.corporationEntityNo =  $scope.optOrganInf.corporationEntityNoUpdate;
			$scope.optOrganInf.operationMode = result.scope.updateOperationMode;
			$scope.optOrganInf.operationModeLevel = result.scope.operationModeLevel;
			$scope.optOrganInf.organLevel = result.scope.organLevel;
			jfRest.request('operationOrgan', 'update', $scope.optOrganInf) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.optOrganList.search();
				}
			});
		};
	});
	//查看
	webApp.controller('viewOptOrganCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		//机构层级
		$scope.organlevelArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_institutionalHierarchy",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {            
				$scope.operationModeLevel = $scope.optOrganInf.operationModeLevel;
				$scope.organLevel = $scope.optOrganInf.organLevel;
			}
		};
		//法人实体下拉框
		$scope.legalEntityQuery ={ 
	           type:"dynamic", 
	           param:{},//默认查询条件 
	           text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	           value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	           resource:"legalEntity.query",//数据源调用的action 
	           callback:function(data){
	        	   $scope.optOrganInf.corporationEntityNoView =  $scope.optOrganInf.corporationEntityNo;
	           }
	      };
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewOperationMode =  $scope.optOrganInf.operationMode;
		        }
		    };
	});
	//修改
	webApp.controller('updateOptOrganCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, 
			jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//机构层级
		$scope.organlevelArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_institutionalHierarchy",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.organLevel = $scope.optOrganInf.organLevel;
				$scope.operationModeLevel = $scope.optOrganInf.operationModeLevel;
			}
		};
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	$scope.updateOperationMode =  $scope.optOrganInf.operationMode;
		        }
		    };
		//法人实体下拉框
		$scope.legalEntityQuery ={ 
	           type:"dynamic", 
	           param:{},//默认查询条件 
	           text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	           value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	           resource:"legalEntity.query",//数据源调用的action 
	           callback:function(data){
	        	   $scope.optOrganInf.corporationEntityNoUpdate =  $scope.optOrganInf.corporationEntityNo;
	           }
	      };
		//上级机构下拉框 
		$scope.upperOrganNoQuery ={ 
	           type:"dynamic", 
	           param:{"organLevel":$scope.organLevel},//默认查询条件 
	           text:"organName", //下拉框显示内容，根据需要修改字段名称 
	           value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
	           resource:"operationOrgan.query",//数据源调用的action 
	           callback:function(data){
	        	   $scope.optOrganInf.upperOrganNoUpdate = $scope.optOrganInf.upperOrganNo;	        	   
	           }
	      };
		var form = layui.form;
		form.on('select(organl)',function(event){
			if(event.value == "B0"){
				$scope.operationModeShow = true;
				$scope.operationModeLevel ="";
			}else{
				$scope.operationModeShow = false;
				$scope.operationModeLevel ="";
			}
		});
	});
	// 运营机构表查询 新增页面
	webApp.controller('optOrganEstCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optOrgan');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.optOrganInf = {};
		$scope.operationModeShow =false;
		//机构层级
		$scope.organlevelArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_institutionalHierarchy",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//法人实体下拉框
		$scope.legalEntityQuery ={ 
	           type:"dynamic", 
	           param:{},//默认查询条件 
	           text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
	           value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	           resource:"legalEntity.query",//数据源调用的action 
	           callback:function(data){
	        	//   console.log(data);
	           }
	      };
		//上级机构下拉框
		$scope.upperOrganNoQuery ={ 
	           type:"dynamic", 
	           param:{"organLevel":$scope.optOrganInf.organLevel},//默认查询条件 
	           text:"organName", //下拉框显示内容，根据需要修改字段名称 
	           value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
	           resource:"operationOrgan.query",//数据源调用的action 
	           callback:function(data){
	        	//   console.log(data);
	           }
	      };
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.queryParam = {
				organNo : $scope.organization 
		};
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			if($scope.adminFlag !="1" && $scope.adminFlag != "2"){
					$scope.optOrganInf.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporationEntityNo").attr("disabled",true);
			}
			});
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		var form = layui.form;
			form.on('select(organl)',function(event){
				if(event.value == "B0"){
					$scope.operationModeShow = true;
					$scope.optOrganInf.operationModeLevel ="";
					$('#operationMode').attr("disabled", false)
				}else{
					$scope.operationModeShow = false;
					$scope.optOrganInf.operationModeLevel ="";
					$('#operationMode').attr("disabled", true)
				}
				//上级机构下拉框
				$scope.upperOrganNoQuery ={ 
			           type:"dynamic", 
			           param:{"organLevel":event.value},//默认查询条件 
			           text:"organName", //下拉框显示内容，根据需要修改字段名称 
			           value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
			           resource:"operationOrgan.query",//数据源调用的action 
			           callback:function(data){
			           }
			      };
			});
	});
	// 运营机构表查询复制页面控制器
	webApp.controller('optOrganEstCtrlCopy', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optOrgan');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.operationModeShow =false;
		//机构层级
		$scope.organlevelArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_institutionalHierarchy",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {            
				$scope.operationModeLevel = $scope.optOrganInfCopy.operationModeLevel;
				$scope.organLevel = $scope.optOrganInfCopy.organLevel;
			}
		};
		//法人实体下拉框
		$scope.legalEntityQuery ={ 
           type:"dynamic", 
           param:{},//默认查询条件 
           text:"corporationEntityName", //下拉框显示内容，根据需要修改字段名称 
           value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
           resource:"legalEntity.query",//数据源调用的action 
           callback:function(data){
        	//   console.log(data);
           }
		};
		//上级机构下拉框
		$scope.upperOrganNoQuery ={ 
           type:"dynamic", 
           param:{"organLevel":$scope.organLevel},//默认查询条件 
           text:"organName", //下拉框显示内容，根据需要修改字段名称 
           value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
           resource:"operationOrgan.query",//数据源调用的action 
           callback:function(data){
        	//   console.log(data);
           }
		};
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.queryParam = {
				organNo : $scope.organization
		};
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			//console.log(data);
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			if($scope.adminFlag !="1" && $scope.adminFlag != "2"){
				$scope.optOrganInfCopy.corporationEntityNo = $scope.corporationEntityNo;
				$("#corporationEntityNo").attr("disabled",true);
			}
		});
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 var form = layui.form;
			form.on('select(organl)',function(event){
				if(event.value=="B0"){
					$scope.operationModeShow = true;
					$scope.operationModeLevel ="";
					$('#operationMode').attr("disabled", false)
				}else{
					$scope.operationModeShow = false;
					$scope.operationModeLevel ="";
					$('#operationMode').attr("disabled", true)
				}
			});
		});
});
