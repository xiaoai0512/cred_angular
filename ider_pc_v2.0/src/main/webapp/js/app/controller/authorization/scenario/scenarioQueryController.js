'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('scenarioListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/scenario/i18n_scenario');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
      $scope.tableInfo = false;
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
		 $scope.authSceneArray ={ 
			        type:"dynamicDesc", 
			        param:{},//默认查询条件 
			        text:"authSceneCode", //下拉框显示内容，根据需要修改字段名称 
			        desc:"sceneDesc",
			        value:"authSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"scenario.scenarioQuery",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//交易识别代码
		 $scope.transIdentifiNoArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"transIdentifiDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"transIdentifiNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"transIdenty.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 $scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.delBtnFlag = false;
		 $scope.selTwoBtnFlag = false;
		 $scope.scenarioShow = true;
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
	   	   			if($scope.eventList.search('AUS.PM.01.0001') != -1){    //授权场景新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.01.0002') != -1){    //授权场景查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.01.0003') != -1){    //授权场景修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.01.0003') != -1){    //授权场景删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.01.0102') != -1){    //授权场景-场景识别查询
	   					$scope.selTwoBtnFlag = true;
	   				}
	   				else{
	   					$scope.selTwoBtnFlag = false;
	   				}
   				}
   			});
		$scope.itemList = {
				params : $scope.queryParam = {
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : false,
				resource : 'scenario.scenarioQuery',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//查询事件
		$scope.selList = function(event) {
			if($scope.operationMode){
				$scope.isShow = true;
				$scope.itemList.params.operationMode = $scope.operationMode;
				$scope.itemList.params.authSceneCode = $scope.authSceneCode;
				$scope.itemList.search();
			}else{
				$scope.isShow = false;
				jfLayer.fail(T.T('SQJ1500025'));  //"请选择营运模式进行查询！"
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/scenarioInfo.html', $scope.item, {
				title : T.T('SQJ1500018'),
				buttons : [  T.T('F00012')],
				size : [ '1200px', '630px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addScenarioAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/scenario/scenarioAdd.html', '', {
				title : T.T('SQJ1500019'),
				buttons : [T.T('F00107'),T.T('F00012')],  //'确定','关闭'
				size : [ '1100px', '620px' ],
				callbacks : [$scope.saveProInstan]
			});
		};
		//确定按钮点击事件
		$scope.proObjInstan ={};
		$scope.instanScenarioShow = false;
		$scope.saveProInstan = function(result){
			if( result.scope.sce.authType == 'NM' || result.scope.sce.authType == 'PA'){
				if( result.scope.sce.transRetainDays == null || result.scope.sce.transRetainDays == undefined ||result.scope.sce.transRetainDays == ''){
				jfLayer.fail(T.T('SQJ1500026')); //"请先输入交易保留日期"
				return;
			   }
			}
			if(!result.scope.instanScenarioShow){
				jfLayer.fail(T.T('SQJ1500027'));  //"请先下一步实例化"
				return;
			}
			for (var i = 0; i < result.scope.queryMODP.data.length; i++) {
				if(result.scope.queryMODP.data[i].pcdList==null && result.scope.queryMODP.data[i].pcdInitList!=null){
					result.scope.queryMODP.data[i].addPcdFlag = 	"1";
					result.scope.queryMODP.data[i].pcdList = result.scope.queryMODP.data[i].pcdInitList;
				}
				result.scope.queryMODP.data[i].operationMode = result.scope.scenarioInstanse.operationMode;
			}
			$scope.scenarioInstanse =  {};
			$scope.scenarioInstanse.sce = result.scope.sce;
			$scope.scenarioInstanse.instanlist = result.scope.queryMODP.data;
			$scope.scenarioInstanse.operationMode = result.scope.scenarioInstanse.operationMode;
			$scope.scenarioInstanse = Object.assign($scope.scenarioInstanse , result.scope.sce);
			jfRest.request('scesave', 'scenarioSave', $scope.scenarioInstanse).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.scenarioInstanse = {};
					/*$scope.queryMODP.data = [];*/
					$scope.safeApply();
	    			result.cancel();
	    			$scope.itemList.search();
				}
			});
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/scenarioUpdate.html', $scope.item, {
				title : T.T('SQJ1500020'),
				buttons : [  T.T('F00031'), T.T('F00012')],
				size : [ '1050px', '620px' ],
				callbacks : [$scope.saveScenario]
			});
		};
		//场景识别查询
		$scope.scenarioInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemscen = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/scenario/identifyList.html', $scope.itemscen, {
				title : T.T('SQJ1500021'),
				buttons : [  T.T('F00012')],
				size : [ '1050px', '540px' ],
				callbacks : []
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveScenario = function(result) {
			if( result.scope.item.authType == 'NM' || result.scope.item.authType == 'PA'){
				if( result.scope.item.transRetainDays == null || result.scope.item.transRetainDays == undefined ||result.scope.item.transRetainDays == ''){
				jfLayer.fail(T.T('SQJ1500026'));//"请先输入交易保留日期"
				return;
			   }
			}
			$scope.item.operationMode = result.scope.operationModeInfo;
			$scope.item.transIdentifiNo = result.scope.transIdentifiNoInfo;
			//pcd实例化
			$scope.item.artifactInstanList= $rootScope.queryMODP.data;
			$scope.item.transSource = result.scope.transSourceU;
			//删除pcd实例
			$scope.item.deletePcdInstanIdList = $rootScope.deletePcdInstanIdList;
			$scope.item.authType = result.scope.authTypeU;
        	$scope.item.postingRetainFlag = result.scope.postingRetainFlagU;
        	$scope.item.authCodeFlag = result.scope.authCodeFlagU;
        	$scope.item.rvTransFlag = result.scope.rvTransFlagU;
        	$scope.item.forceAuthFlag = result.scope.forceAuthFlagU;
        	$scope.item.transPostingFlag = result.scope.transPostingFlagU;
        	$scope.item.creditOccupyMode = result.scope.creditOccupyModeU;
			$scope.item.sceneType = result.scope.sceneTypeU;
			delete $scope.item['invalidFlag'];
			jfRest.request('scesave', 'scenarioUpdate', $scope.item).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.success(T.T('F00022'));
							$scope.item = {};
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
						}
			});
		};
		//删除授权场景
		$scope.delSceneInfo = function(item){
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.delScenItem = $scope.items;
			jfLayer.confirm(T.T('SQJ1500022'),function() {
				$scope.paramsId = {
						authSceneCode:$scope.delScenItem.authSceneCode,
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				 };
	 			jfRest.request('scenario','identifyQuery',$scope.paramsId).then(function(data) {
	 				if(data.returnData.rows == null || data.returnData.rows == ""){
	 					$scope.delScenItem.authDataSynFlag = "1";
	 					$scope.delScenItem.invalidFlag = "1";
	 					jfRest.request('scesave', 'scenarioUpdate', $scope.delScenItem).then(function(data) {
	 						if (data.returnMsg == 'OK') {
	 							jfLayer.alert(T.T('F00037'));
	 							$scope.delScenItem = {};
	 							$scope.safeApply();
	 							result.cancel();
	 							$scope.itemList.search();
	 						}
	 					});
	 				}else{
	 					jfLayer.alert(T.T('SQJ1500028'));  //   请先删除场景识别信息
	 				}
	 			});	
			},function() {
			});
		}
	});
	//授权场景详情
	webApp.controller('scenarioInfoCtrl', function($scope, $stateParams, jfRest,
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
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };
		 $scope.creditArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_credit",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.creditOccupyModeInfo = $scope.item.creditOccupyMode;
		        }
			};
		$scope.sceneTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_scenetype",
				queryFlag: "children"
			},//默认查询条件
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
				$scope.sceneType = $scope.item.sceneType;
			}
		};
			//交易来源
			$scope.transSourcArr = { 
		        type:"dynamic", 
		        param:{
		        	"flag":"Y"
		        },//默认查询条件 
		        text:"originDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"transOrigin",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"principalDebitTrans.queryTransSource",//数据源调用的action 
		        callback: function(data){
		        	$scope.transSourceInfo = $scope.item.transSource;
		        }
			};
			 $scope.transPostingArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_transPosting",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.transPostingFlagInfo = $scope.item.transPostingFlag;
		        }
			};
			 $scope.YNArray01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.forceAuthFlagInfo = $scope.item.forceAuthFlag;
		        }
			};
			 $scope.YNArray02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.rvTransFlagInfo = $scope.item.rvTransFlag;
		        }
			};
			 $scope.YNArray03 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.authCodeFlagInfo = $scope.item.authCodeFlag;
		        }
			};
			 $scope.YNArray04 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.postingRetainFlagInfo = $scope.item.postingRetainFlag;
		        }
			};
			 $scope.authTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_authType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.authTypeInfo = $scope.item.authType;
		        }
			};
			//交易识别代码
			 $scope.transIdentifiNoArray ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"transIdentifiDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"transIdentifiNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"transIdenty.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transIdentifiNoInfo = $scope.item.transIdentifiNo;
			        }
			    };
		       $scope.scenarioInfo = true;
		       $scope.artInfo = true;
		     //构件实例列表
				$scope.artifactView = {
					params : {
							"pageSize":10,
							"indexNo":0,
							"instanCode":$scope.item.authSceneCode,
							"operationMode":$scope.item.operationMode
					}, // 表格查询时的参数信息
					autoQuery : true,
					paging : true,// 默认true,是否分页
					resource : 'artifactExample.query',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
					}
				};
		       $scope.saveProInfo = function(){
		    	   $scope.scenarioInfo = true;
		    	   $scope.artInfo = true;
		    	   $scope.artifactView.params.instanCode = $scope.item.authSceneCode;
		    	   $scope.artifactView.params.operationMode = $scope.item.operationMode;
				   $scope.artifactView.search();
		       };
		     //产品构件实例====详情
				$scope.queryArtifactBP = function(item) {
					$scope.itemArtifact = {};
					// 页面弹出框事件(弹出页面)
					$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
					$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
						title : T.T('F00041') +$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +T.T('F00156'),
						buttons : [  T.T('F00012')],
						size : [ '1100px', '530px'  ],
						callbacks : []
					});
				};
				$scope.retainDaysInfo = true;
				 if($scope.item.authType == 'NM' || $scope.item.authType == 'PA'){
					 $scope.retainDaysInfo = true; 
				 }else{
					 $scope.retainDaysInfo = false; 
				 }
	});
	//查看
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeInfoD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.itemArtifact.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.segmentTypeInfoD =  data.returnData.rows[0].segmentType;
					$scope.pcdInstanList = [];
					$scope.pcdInstanList.push(data.returnData.rows[0].pcdInitList);
					$scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
      //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	 //pcd差异列表
           $scope.pcdInfTable = [];
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.itemArtifact.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.itemArtifact.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.itemArtifact.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.itemArtifact.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.itemArtifact.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.itemArtifact.instanCode5;
    	   $scope.queryPcdExample.addPcdFlag = '2';
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }else if($scope.pcdInstanList.length > 0){
    				   $scope.pcdInfTable = $scope.pcdInstanList[0];
    			   }
    		   }
    	   });
       }
	});
	//授权场景新增
	webApp.controller('scenarioAddCtrl', function($scope, $stateParams, jfRest,
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
		 $scope.creditArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_credit",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.sceneTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_scenetype",
				queryFlag: "children"
			},//默认查询条件
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
			}
		};
		 $scope.transPostingArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_transPosting",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 $scope.YNArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 $scope.authTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_authType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
			//交易来源
			$scope.transSourcArr = { 
		        type:"dynamic", 
		        param:{
		        	"flag":"Y"
		        },//默认查询条件 
		        text:"originDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"transOrigin",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"principalDebitTrans.queryTransSource",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//交易识别代码
			 $scope.transIdentifiNoArray ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"transIdentifiDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"transIdentifiNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"transIdenty.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
			 $scope.sce = {};
			 $scope.retainDaysInfo = true;
			 if($scope.sce.authType == 'NM' || $scope.sce.authType == 'PA'){
				 $scope.retainDaysInfo = true; 
			 }else{
				 $scope.retainDaysInfo = false; 
			 }
			 var form = layui.form;
				form.on('select(gettype)',function(event){
					if($scope.sce.authType == 'NM' || $scope.sce.authType == 'PA'){
						 $scope.retainDaysInfo = true; 
					 }else{
						 $scope.retainDaysInfo = false; 
					 }
				});
				//下一步实例化保存
				$scope.proObjInstan ={};
				$scope.proObjInstan.message = [];
				//$scope.instanScenarioShow = false;
				$scope.saveProInfo = function(result) {
					$scope.sce.authDataSynFlag = "1";
					if($scope.operationModeAdd){
						$scope.sce.operationMode = $scope.operationModeAdd;
				            	$scope.sce.message = [];
				            	$scope.scenarioInstanse = $scope.sce;
		  	                	$scope.nextInstanScenario();
					}else{
						jfLayer.fail(T.T('SQJ1500029'));  //  请选择营运模式
					}
				};
				//******************额度节点实例化start********************
				//进入授权场景实例化
				$scope.scenarioInstanse ={};
				$scope.nextInstanScenario = function (){
					$scope.instanScenarioShow = true;//显示实例化
					$scope.scenarioShow = false;
					$scope.queryMODP.params.instanCode = $scope.scenarioInstanse.authSceneCode;
					$scope.queryMODP.params.opertionMode = $scope.scenarioInstanse.opertionMode;
					$scope.queryMODP.search();
				};
				//查询产品实例构件
				$scope.queryMODP = {
						params : $scope.queryParam = {
								instanDimen1 : "AUTX"
						}, // 表格查询时的参数信息
						paging : false,// 默认true,是否分页
						autoQuery :true,
						resource : 'artifactExample.querySelectArtifact',// 列表的资源
						callback : function(data) { // 表格查询后的回调函数
							
						}
					};
				//产品实例化时，点击替换参数的方法
				$scope.updateSelectA = function(item,$index){
					$scope.indexNo = '';
					$scope.indexNo = $index;
					//弹框查询列表元件
					$scope.itemsNo = {};
					$scope.itemsNo = $.parseJSON(JSON.stringify(item));
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
							title : T.T('F00138'),   // '选择替换参数项',F00138
							buttons : [T.T('F00012')  ],
							size : [ '1100px', '500px' ],
							callbacks : [$scope.choseSelectA]
						});
				};
				//产品实例化时，点击设置参数值的方法
				$scope.setSelectA = function(item,$index){
					$scope.indexNo = '';
					$scope.indexNo = $index;
					//弹框查询列表元件
					$scope.itemsPCD = {};
					$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
							title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),  //F00139'的参数值'
							buttons : [ T.T('F00012')],
							size : [ '1100px', '500px' ],
							callbacks : [$scope.choseSelectTwo]
						});
				};
				$scope.choseSelectA = function(result) {
					if (!result.scope.elementNoTable.validCheck()) {
						return;
					}
					$scope.items = {};
					$scope.items = result.scope.elementNoTable.checkedList();
					$scope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
					$scope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
					$scope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
					$scope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
					$scope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
					if (result.scope.pcdInstanShow) {
						$scope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
						$scope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
					} 
					$scope.safeApply();
					result.cancel();
				};
				$scope.choseSelectTwo = function(result) {
					$scope.items = {};
					$scope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
					$scope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
					$scope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
					$scope.safeApply();
					result.cancel();
				};
				$scope.BackBrn = function(){
					$scope.scenarioShow = true;
					$scope.instanScenarioShow = false;
				}
	});
	//授权场景修改
	webApp.controller('scenarioUpdateCtrl', function($scope, $stateParams,  $timeout,jfRest,
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
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };
			//交易来源
			$scope.transSourcArr = { 
		        type:"dynamic", 
		        param:{
		        	"flag":"Y"
		        },//默认查询条件 
		        text:"originDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"transOrigin",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"principalDebitTrans.queryTransSource",//数据源调用的action 
		        callback: function(data){
		        	$scope.transSourceU = $scope.item.transSource;
		        }
			};
		 $scope.creditArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_credit",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.creditOccupyModeU = $scope.item.creditOccupyMode;
		        }
			};
		$scope.sceneTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_scenetype",
				queryFlag: "children"
			},//默认查询条件
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
				$scope.sceneTypeU = $scope.item.sceneType;
			}
		};
			 $scope.transPostingArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_transPosting",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.transPostingFlagU = $scope.item.transPostingFlag;
		        }
			};
			 $scope.YNArray01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.forceAuthFlagU = $scope.item.forceAuthFlag;
		        }
			};
			 $scope.YNArray02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.rvTransFlagU = $scope.item.rvTransFlag;
		        }
			};
			 $scope.YNArray03 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.authCodeFlagU = $scope.item.authCodeFlag;
		        }
			};
			 $scope.YNArray04 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.postingRetainFlagU = $scope.item.postingRetainFlag;
		        }
			};
			 $scope.authTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_authType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.authTypeU = $scope.item.authType;
		        }
			};
			//交易识别代码
			 $scope.transIdentifiNoArray ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"transIdentifiDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"transIdentifiNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"transIdenty.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transIdentifiNoInfo = $scope.item.transIdentifiNo;
			        }
			    };
			 $scope.retainDaysInfo = true;
			   //构件实例列表
				$rootScope.queryMODP = {
					params : $scope.queryParam = {
						instanCode:$scope.item.authSceneCode,
						operationMode : $scope.item.operationMode
				}, // 表格查询时的参数信息
				//autoQuery: false,
				paging : false,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						//$scope.isshow99 = false;//隐藏 下一步按钮
                        $scope.instanSceneShow = true;//显示实例化
                        if(data.returnData){
							if(data.returnData.rows == undefined ||  data.returnData.rows == null  ||data.returnData.rows == ''){
								data.returnData.rows =[];
							}else {
								$rootScope.queryMODP.data = data.returnData.rows;
								for(var i =0; i < data.returnData.rows.length; i++){
									//data.returnData.rows[i].segmentNumber = $scope.proObjectInf.segmentNumber;
                                }
                            }
						}
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');   //操作失败
						jfLayer.fail(returnMsg);
					}
				}
			};
		   //产品实例化时，点击设置参数值的方法
		$scope.setSelectAUpdate = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdate.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdate]
				});
		};
		$scope.choseSelectTwoUpdate = function(result) {
			$scope.items = {};
			$rootScope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			//$rootScope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$rootScope.queryMODP.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$rootScope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		//产品实例化时，点击替换参数的方法
		$scope.updateSelectAUpdate = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdate.html', $scope.itemsNo, {
					title : T.T('F00138'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectAUpdate]
				});
		};
		$scope.choseSelectAUpdate = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$rootScope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$rootScope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$rootScope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			if (result.scope.pcdInstanShow) {
				//$rootScope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$rootScope.queryMODP.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
				$rootScope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		};
			 if($scope.item.authType == 'NM' || $scope.item.authType == 'PA'){
				 $scope.retainDaysInfo = true; 
			 }else{
				 $scope.retainDaysInfo = false; 
			 }
			 var form = layui.form;
				form.on('select(gettype)',function(event){
					console.log($scope.authTypeArray);
					if($scope.item.authType == 'NM' || $scope.item.authType == 'PA'){
						 $scope.retainDaysInfo = true; 
					 }else{
						 $scope.retainDaysInfo = false; 
					 }
				});
	});
	webApp.controller('viewProductObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.productObjectListTable = {
//				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'proObject.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	webApp.controller('selectPCD2Ctrl',function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdExampleInf ={};
		$scope.pcdDifExampleInf = {};
		var count = 0;
		$scope.artifactInfo = $scope.itemsPCD;
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.pcdTypeUpdateP = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdateP)',function(event){
			 $scope.pcdTypeUpdateP = event.value;
		 });
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeUpdateP = $scope.pcdExampleInf.segmentType;
			}
		};
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		$scope.updateSaveFlag = false;//记录是否修改或新增
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
			count = $scope.pcdInfTable.length;
		}else{
			$scope.showNewPcdInfoUpdate = true;
			count = 0;
		}
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.pcdExampleInfUpdate = {};
			$scope.updateSaveFlag = false;//新增
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
            }
        };
        $rootScope.deletePcdInstanIdList = [];
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
			if(item.id != null && item.id != undefined && item.id != '' && item.id){
				$rootScope.deletePcdInstanIdList.push(item.id);
            }
        };
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
			$scope.updateSaveFlag = true;//修改
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdTypeUpdateP || null== $scope.pcdExampleInfUpdate.pcdValue) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				//pcdInfTableInfoU = $(pcdInfTableInfoU,$scope.pcdExampleInf);
				pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
				pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
				pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
				pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
				pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
				pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
				pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeUpdateP;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.updateSaveFlag){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInfUpdate.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeUpdateP;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInfUpdate.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInfUpdate.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
					$scope.pcdExampleInfUpdate = {};
				}
				$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
				$scope.showNewPcdInfoUpdate = false;
	       };
		  //
		  var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
							title : T.T('YYJ400021'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBusType]
						});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
							title : T.T('YYJ400022'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseMedia]
						});
				}else if(dataType=="MODB"){//余额对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
							title : T.T('YYJ400023'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBalanceObject]
						});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
							title : T.T('YYJ400024'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductObject]
						});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
							title : T.T('YYJ400025'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductLine]
						});
				}else if(dataType=="ACST"){//核算状态
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
							title : T.T('YYJ400026'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseAcst]
						});
				}else if(dataType=="EVEN"){//事件
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseEvent]
						});
				}else if(dataType=="BLCK"){//封锁码
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
							title : T.T('YYJ400028'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBlockCode]
						});
				}else if(dataType=="AUTX"){//授权场景
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
							title : T.T('YYJ400029'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseScenarioList]
						});
				}else if(dataType=="LMND"){//额度节点
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
							title : T.T('YYJ400030'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseQuotaTree]
						});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseCurrency]
						});
				}else if(dataType=="DELQ"){//延滞层级
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
							title : T.T('YYJ400031'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				//if (!result.scope.itemList.validCheck()) {
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
//				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.artifactExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.artifactExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.artifactExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.artifactExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.artifactExampleInf.instanCode5 = code;
				}else if(dataValue=='base'){
					$scope.pcdExampleInf.baseInstanCode = code;
				}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseInstanCode1Btn = function() {
				$scope.checkValidate();
				//获取维度取值1的值
				dataValueCount =1;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen1);
			};
			$scope.choseInstanCode2Btn = function() {
				$scope.checkValidate();
				//获取维度取值2的值
				dataValueCount =2;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen2);
			};
			$scope.choseInstanCode3Btn = function() {
				$scope.checkValidate();
				//获取维度取值3的值
				dataValueCount =3;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen3);
			};
			$scope.choseInstanCode4Btn = function() {
				$scope.checkValidate();
				//获取维度取值4的值
				dataValueCount =4;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen4);
			};
			$scope.choseInstanCode5Btn = function() {
				$scope.checkValidate();
				//获取维度取值5的值
				dataValueCount =5;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen5);
			};
			$scope.choseBaseInstanCodeBtnUpdate = function() {
				//获取基础维度的值
				dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtnUpdate = function() {
				//获取可选维度的值
				dataValueCount ='option';
				$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
			};
	});
	//******************************替换参数2222222222***************
	webApp.controller('selectElementNo2Ctrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.artifactInfo = {};
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTableUpdate = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	// 授权场景识别码查询
	webApp.controller('identifyListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.reentryArray = [{name:T.T('PZJ900004'),id:'Y'},{name: T.T('PZJ900003'),id:'N'}];
		$scope.eventTwoList = "";
		 $scope.twoBtnAddFlag = false;
		 $scope.twoBtnUpdFlag = false;
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
	        	$scope.operationModeiden = $scope.itemscen.operationMode;
	        }
	    };
		 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
  			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnData != null || data.returnData != ""){
  					for(var i=0;i<data.returnData.length;i++){
  	   					$scope.eventTwoList += data.returnData[i].eventNo + ",";
  	   				}
	   	   			if($scope.eventTwoList.search('AUS.PM.01.0101') != -1){    //新增
	   					$scope.twoBtnAddFlag = true;
	   				}
	   				else{
	   					$scope.twoBtnAddFlag = false;
	   				}
			   	   	if($scope.eventTwoList.search('AUS.PM.01.0103') != -1){   
	   					$scope.twoBtnUpdFlag = true;
	   				}
	   				else{
	   					$scope.twoBtnUpdFlag = false;
	   				}
  				}
  			});
		//授权场景识别码查询
		$scope.idenList = {
				params : $scope.queryParam = {
						"authSceneCode":$scope.itemscen.authSceneCode,
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'scenario.identifyQuery',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//新增场景识别码
		$scope.addIdentify = function(event) {
			$scope.itemCode = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/scenario/identifyAdd.html', $scope.itemCode, {
				title : T.T('SQJ1500023'),
				buttons : [  T.T('F00031'), T.T('F00012')],
				size : [ '1050px', '540px' ],
				callbacks : [$scope.addIdentifyInfo]
			});
		};
		//修改场景识别码
		$scope.updateIdentify = function(event) {
			console.log(event);
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.item.sceneDesc = $scope.itemscen.sceneDesc;
			$scope.modal('/authorization/scenario/identifyUpdate.html', $scope.item, {
				title :  T.T('SQJ1500024'),
				buttons : [  T.T('F00031'), T.T('F00012')],
				size : [ '1050px', '540px' ],
				callbacks : [$scope.saveIdentify]
			});
		};
		// 新增弹出页面==============回调函数/确认按钮事件
		$scope.addIdentifyInfo = function(result) {
	 		$scope.itemIde = $.parseJSON(JSON.stringify(result.scope.itemIde));
	 		$scope.itemIde.authSceneCode = $scope.itemCode.authSceneCode;
	 		$scope.itemIde.transSceneCode = result.scope.transSceneCodeAdd;
	 		$scope.itemIde.authDataSynFlag = "1";
	 			if(result.scope.operationModeAa){
					$scope.itemIde.operationMode = result.scope.operationModeAa;
					jfRest.request('scesave', 'identifySave', $scope.itemIde).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.success(T.T('F00058'));
							$scope.itemIde = {};
							$scope.safeApply();
							result.cancel();
							$scope.idenList.search();
						}
					});
				}else{
					jfLayer.fail(T.T('SQJ1500029'));   //SQJ1500029  请选择营运模式！"
				}
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveIdentify = function(result) {
			$scope.item.authDataSynFlag = "1";
			$scope.item.operationMode = result.scope.operationModeiden;
			$scope.item.transSceneCode = result.scope.transSceneCodeIden;
			delete $scope.item['invalidFlag'];
			jfRest.request('scesave', 'identifyUpdate', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022'));
					$scope.item = {};
					$scope.safeApply();
					result.cancel();
					$scope.idenList.search();
				}
			});
		};
		//单个删除
		$scope.delIdentify = function(delItem){
			$scope.delItem = delItem;
			jfLayer.confirm(T.T('SQJ1500022'),function() {
				$scope.delItem.authDataSynFlag = "1";
				$scope.delItem.invalidFlag = "1";
				jfRest.request('scesave', 'identifyUpdate', $scope.delItem).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.delItem = {};
						$scope.idenList.search();
					}
				});
			},function() {
			});
		};
		//全部删除
		$scope.delAllIdentify = function(delAllInfo){
			$scope.delSAllItem = {};
			$scope.delSAllItem.authSceneCode = delAllInfo.authSceneCode;
			$scope.delSAllItem.authDataSynFlag = "1";
			jfLayer.confirm(T.T('SQJ1500022'),function() {
				jfRest.request('scesave', 'identifyUpdate', $scope.delSAllItem).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.delSAllItem = {};
						$scope.idenList.search();
					}
				});
			},function() {
			});
		}
	});
	//
	webApp.controller('identifyAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.reentryArray = [{name:T.T('PZJ900004'),id:'Y'},{name: T.T('PZJ900003'),id:'N'}];
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
	        	$scope.operationModeAa = $scope.itemCode.operationMode;
	        }
	    };
		// 交易场景下拉框
		$scope.transSceneArray = {
			type: "dynamicDesc",
			param: {
				operationMode: $scope.itemCode.operationMode,
				applicationRange: 'A',
				pageSize:10,
				indexNo:0
			},
			text:"transSceneCode", //下拉框显示内容，根据需要修改字段名称
			desc: "transSceneDesc",
			value:"transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
			resource: "tradModel.query",//数据源调用的action
			callback: function (data) {
			}
		};
	});
	webApp.controller('identifyUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.reentryArray = [{name:T.T('PZJ900004'),id:'Y'},{name: T.T('PZJ900003'),id:'N'}];
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
	        	$scope.operationModeIden = $scope.item.operationMode;
	        }
	    };
		// 交易场景下拉框
		$scope.transSceneArray = {
			type: "dynamicDesc",
			param: {
				operationMode: $scope.item.operationMode,
				applicationRange: 'A',
				pageSize:10,
				indexNo:0
			},
			text: "transSceneCode", //下拉框显示内容，根据需要修改字段名称
			desc: "transSceneDesc",
			value: "transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
			resource: "tradModel.query",//数据源调用的action
			callback: function (data) {
				$scope.transSceneCodeIden = $scope.item.transSceneCode;
			}
		};
	});
			//******************************替换参数***************
	webApp.controller('selectElementNoCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTable = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
			//******************************替换参数end***************
			//******************************余额对象设置参数值pcd修改***************
		webApp.controller('selectPCDCtrl',function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
				$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
				$translate.refresh();
			$scope.pcdExampleInf ={};
			$scope.pcdDifExampleInf = {};
			var count = 1;
			$scope.artifactInfo = $scope.itemsPCD;
			$scope.businessValueArr01= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.baseInstanDimenAddD = $scope.pcdExampleInf.baseInstanDimen;
				}
			};
			$scope.businessValueArr02= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.optionInstanDimenAddD = $scope.pcdExampleInf.optionInstanDimen;
				}
			};
			//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
			$scope.segmentTypeArray = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_segmentationType",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.segmentTypeAddD = $scope.pcdExampleInf.segmentType;
				}
			};
			//pcd实例化取值类型
			$scope.pcdtypeArray = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_valueType",
					queryFlag: "children"
				}, //默认查询条件 
				text: "codes", //下拉框显示内容，根据需要修改字段名称 
				desc: "detailDesc",
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.pcdTypeAdd = $scope.pcdExampleInf.pcdType;
					$timeout(function() {
						Tansun.plugins.render('select');
					});
				}
			};
			//获取修改后的取值类型
	        var form = layui.form;
			 form.on('select(getPcdTypeAdd)',function(event){
				 $scope.pcdTypeAdd = event.value;
			 });
			//新增pcd差异化不显示
			$scope.showNewPcdInfo = false;
			$scope.pcdInfTable = [];
			// pcd差异化实例 新增按钮
			$scope.newPcdBtn = function() {
			    $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
			    if($scope.showNewPcdInfo){
			    	$scope.pcdDifExampleInf.pcdDiffSerialNo = count++;
			    }
			};
			$scope.pcdInstanShow = true;
			$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
			if($scope.itemsPCD.segmentType!=null){//分段类型不为空
				$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
				$scope.addButtonShow = true;
			}else{
				$scope.addButtonShow = false;
			}
			if($scope.itemsPCD.pcdInitList!=null){
				$scope.pcdInfTable = $scope.itemsPCD.pcdInitList;
			}else{
				$scope.showNewPcdInfo = true;
			}
			if($scope.itemsPCD.pcdList!=null){
				$scope.pcdInfTable = $scope.itemsPCD.pcdList;
			}
			 //删除pcd实例列表某行
			$scope.deletePcdDif =  function(data){
				if($scope.pcdInfTable.length==1){
					jfLayer.fail(T.T('YYJ400048'));
					return;
				}
				var checkId = data;
				$scope.pcdInfTable.splice(checkId, 1);
			};
			//修改pcd实例列表某行
			$scope.updateInstan = function(event,$index){
				$scope.indexNoTemp = '';
				$scope.indexNoTemp = $index;
				$scope.showNewPcdInfo = true;
				$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
				$scope.pcdExampleInf = $scope.updateInstanTemp;
			};
			//保存pcd实例============余额对象实例化设置参数值
			  $scope.saveNewAdrInfo = function() {
				  if(null== $scope.pcdExampleInf.pcdPoint|| null== $scope.pcdTypeAdd|| null== $scope.pcdExampleInf.pcdValue) {
					   jfLayer.fail(T.T('YYJ400049'));
					   return;
				   } 
					var pcdInfTableInfoU = {};
					pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
					pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
					pcdInfTableInfoU.pcdType = $scope.pcdTypeAdd;
					pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
					pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
					pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
					pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
					pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
						$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInf.segmentSerialNum;
						$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeAdd;
						$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInf.segmentValue;
						$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInf.pcdValue;
						$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInf.pcdPoint;
						$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
						$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
						$scope.indexNo = null;
					}else{
						$scope.pcdInfTable.push(pcdInfTableInfoU);
					}
					$scope.pcdDifExampleInf = {};
					$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
					$scope.showNewPcdInfo = false;
			   };
			  //
			  var dataValueCount ;
				//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
						title : T.T('YYJ400021'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBusType]
					});
			}else if(dataType=="MODM"){//媒介对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
						title : T.T('YYJ400022'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseMedia]
					});
			}else if(dataType=="MODB"){//余额对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
						title : T.T('YYJ400023'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBalanceObject]
					});
			}else if(dataType=="MODP"){//产品对象
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
						title : T.T('YYJ400024'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductObject]
					});
			}else if(dataType=="MODG"){//业务项目
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
						title : T.T('YYJ400025'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseProductLine]
					});
			}else if(dataType=="ACST"){//核算状态
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
						title : T.T('YYJ400026'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseAcst]
					});
			}else if(dataType=="EVEN"){//事件
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
						title : T.T('YYJ400027'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseEvent]
					});
			}else if(dataType=="BLCK"){//封锁码
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
						title : T.T('YYJ400028'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseBlockCode]
					});
			}else if(dataType=="AUTX"){//授权场景
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
						title : T.T('YYJ400029'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseScenarioList]
					});
			}else if(dataType=="LMND"){//额度节点
				//弹框查询列表
				$scope.params = {
						"operationMode" : $rootScope.operationMods,
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
						title : T.T('YYJ400030'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseQuotaTree]
					});
			}else if(dataType=="CURR"){//币种
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
						title : T.T('YYJ400027'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
						callbacks : [$scope.choseCurrency]
					});
			}else if(dataType=="DELQ"){//延滞层级
				//弹框查询列表
				$scope.params = {
						"pageSize" : 10,
						"indexNo" : 0
					};
					// 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
						title : T.T('YYJ400031'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				console.log(result);
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
				$scope.artifactExampleInf.instanCode1 = code;
			}else if(dataValue=='2'){
				$scope.artifactExampleInf.instanCode2 = code;
			}else if(dataValue=='3'){
				$scope.artifactExampleInf.instanCode3 = code;
			}else if(dataValue=='4'){
				$scope.artifactExampleInf.instanCode4 = code;
			}else if(dataValue=='5'){
				$scope.artifactExampleInf.instanCode5 = code;
			}else if(dataValue=='base'){
				$scope.pcdExampleInf.baseInstanCode = code;
			}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseBaseInstanCodeBtn = function() {
				//获取基础维度的值
			dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtn = function() {
				//获取可选维度的值
			dataValueCount ='option';
					$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
				};
			});
			//******************************设置参数值pcd修改end***************
			//***************查看业务项目详情end***************
			//业务类型
			webApp.controller('choseBusinessTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
				$translate.refresh();
				//业务类型列表
				$scope.businessTypeList = {
					checkType : 'radio', // 当为checkbox时为多选
					params : {
							pageSize:10,
							indexNo:0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'businessType.query',// 列表的资源
					isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_businessNature'],//查找数据字典所需参数
					transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
					callback : function(data) { // 表格查询后的回调函数
					}
				};
			});
			//媒介对象
			webApp.controller('choseMediaObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
				$translate.refresh();
				//媒介对象列表
				$scope.mediaObjectList = {
					checkType: 'radio', // 当为checkbox时为多选
					params: {
						"operationMode": $scope.params.operationMode,
						pageSize: 10,
						indexNo: 0
					}, // 表格查询时的参数信息
					paging: true, // 默认true,是否分页
					resource: 'mediaObject.query', // 列表的资源
					isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_mediaType'],//查找数据字典所需参数
					transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
					callback: function(data) { // 表格查询后的回调函数

					}
				};
			});
			//余额对象
			webApp.controller('choseBalanceObjectCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
				$translate.refresh();
				//余额类型====P本金   I利息    F费用
				$scope.objectTypeArr = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_balanceType",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						callback : function(data) {}
					};
				// 余额对象列表
				$scope.balanceObjectList = {
					checkType : 'radio', // 当为checkbox时为多选
					params : {
						"operationMode" : $rootScope.operationMods,
						pageSize : 10,
						indexNo : 0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'balanceObject.query',// 列表的资源
					isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_balanceType'],//查找数据字典所需参数
					transDict : ['objectType_objectTypeDesc'],//翻译前后key
					callback : function(data) { // 表格查询后的回调函数
					}
				};
			});
			//产品对象
			webApp.controller('choseProductObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			//产品對象列表
			$scope.proObjectList = {
				checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				}
			};
			});
			//业务项目
			webApp.controller('choseProductLineCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			//业务项目列表
			$scope.proLineList = {
				checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				}
			};
			});
			//事件
			webApp.controller('choseEventCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			// 事件清单列表
			$scope.itemList = {
				checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
			"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				}
			};
			});
			//币种
			webApp.controller('choseCurrencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
				$translate.refresh();
				//货币列表
			$scope.currencyTable = {
				checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				}
			};
			});
			//核算状态
			webApp.controller('choseAcstCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.accountStateTable = {
					checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountState.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
						
					}
				};
			});
			//授权场景
			webApp.controller('choseScenarioCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.scenarioList = {
					checkType : 'radio', // 当为checkbox时为多选
			params : {
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'authScene.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
					
					}
				};
			});
			//额度节点
			webApp.controller('choseQuotaTreeCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.quotaTreeList = {
					checkType : 'radio', // 当为checkbox时为多选
			params : {
					"operationMode" :$rootScope.operationMods,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'quotaNode.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
						
					}
				};
			});
			//延滞层级
			webApp.controller('choseDelvCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
			$scope.delvTable = {
					checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'delv.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
						
					}
				};
			});
			//封锁码
			webApp.controller('choseBlockCodeCtrl', function($scope, $stateParams, jfRest,
				$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
				/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级G:业务项目*/
				$scope.blockCodeRangeArr = {
		   			type : "dictData",
		   			param : {
		   				"type" : "DROPDOWNBOX",
		   			    groupsCode : "dic_effectiveScope",
		   				queryFlag : "children"
		   			},// 默认查询条件
		   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
		   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
		   			resource : "paramsManage.query",// 数据源调用的action
		   			callback : function(data) {
		   			}
		   		};
				//管控码类别
				$scope.blockTypeArr = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_effectiveCodeType",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					callback : function(data) {
					}
				};
				//封锁码列表
				$scope.blockCDScnMgtTable = {
					checkType: 'radio', // 当为checkbox时为多选
					params: {
						"operationMode": $scope.params.operationMode,
						"pageSize": 10,
						"indexNo": 0
					}, // 表格查询时的参数信息
					paging: true, // 默认true,是否分页
					resource: 'blockCode.query', // 列表的资源
					isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_effectiveScope'],//查找数据字典所需参数
					transDict : ['effectivenessCodeScope_effectivenessCodeScopeDesc'],//翻译前后key
					callback: function(data) { // 表格查询后的回调函数
					}
				};
			});		
});
