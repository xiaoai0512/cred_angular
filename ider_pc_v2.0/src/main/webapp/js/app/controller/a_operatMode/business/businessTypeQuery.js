'use strict';
define(function(require) {
	var webApp = require('app');
	// 业务类型查询
	webApp.controller('businessTypeQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) { 
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
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
	   	   		if($scope.eventList.search('COS.IQ.02.0020') != -1){    //查询
   					$scope.selBtnFlag = true;
   				}
   				else{
   					$scope.selBtnFlag = false;
   				}
		   	   	if($scope.eventList.search('COS.AD.02.0020') != -1){    //新增
   					$scope.addBtnFlag = true;
   				}
   				else{
   					$scope.addBtnFlag = false;	
   				}
		   	   	if($scope.eventList.search('COS.UP.02.0020') != -1){    //修改
   					$scope.updBtnFlag = true;
   				}
   				else{
   					$scope.updBtnFlag = false;
   				}
			}
		});
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//业务类型列表
		$scope.businessTypeList = {
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
		// 新增
		$scope.busTypeAdd = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/business/businessTypeMgt.html','', {
				title : T.T('YYJ200025'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '600px' ],
				callbacks : [$scope.saveProInstan]
			});
		};
		$scope.saveProInstan = function(result){
			if(!result.scope.S33ListResult){
				jfLayer.fail(T.T("F00086"));
				 return;
			}else if(result.scope.S33ListResult.length == 0){
				jfLayer.fail(T.T("F00086"));
				 return;
			}
			if(!result.scope.sureNext){
				jfLayer.fail(T.T("F00086"));
				 return;
			}
			$rootScope.proObjInstan.instanlist = [];
			for (var i = 0; i < result.scope.queryMODT.data.length; i++) {
				if(result.scope.queryMODT.data[i].pcdList==null && result.scope.queryMODT.data[i].pcdInitList!=null){
					result.scope.queryMODT.data[i].addPcdFlag = "1";
					result.scope.queryMODT.data[i].pcdList = result.scope.queryMODT.data[i].pcdInitList;
				}
				$rootScope.proObjInstan.instanlist.push(result.scope.queryMODT.data[i]);
			}
			$rootScope.proObjInstan.instanCode = $rootScope.proObjInstan.businessTypeCode;
			jfRest.request('businessType', 'save', $rootScope.proObjInstan).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$rootScope.proObjInstan = {};
					$scope.safeApply();
					result.cancel();
					$scope.businessTypeList.search();
				}
			});
		};
		// 查看
		$scope.checkBusinessTypeInf = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.businessTypeInfView = $.parseJSON(JSON.stringify(event));
			$scope.modal('/a_operatMode/business/viewBusinessType.html',$scope.businessTypeInfView, {
				title : T.T('YYJ200018') ,
				buttons : [ T.T('F00012') ],
				size : [ '1150px', '600px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateBusinessTypeInf = function(event) {
			$scope.businessTypeInf = $.parseJSON(JSON.stringify(event));
			$scope.businessTypeInf.deletePcdInstanIdList = [];
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/business/updateBusinessType.html',$scope.businessTypeInf, {
				title : T.T('YYJ200019'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '600px' ],
				callbacks : [ $scope.updateBusinessType ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateBusinessType = function(result) {
			//验证本金利息费用余额对象不能为空
			if(!result.scope.businessTypeInf.defaultPrincipalBalanceObjTemp || result.scope.businessTypeInf.defaultPrincipalBalanceObjTemp == 'null'){//本金余额对象
				jfLayer.fail(T.T("YYJ200036"));
				return;
            }
            if(!result.scope.businessTypeInf.defaultInterestBalanceObjTemp || result.scope.businessTypeInf.defaultInterestBalanceObjTemp == 'null'){//利息余额对象
				jfLayer.fail(T.T("YYJ200037"));
				return;
            }
            if(!result.scope.businessTypeInf.defaultFeeBalanceObjTemp || result.scope.businessTypeInf.defaultFeeBalanceObjTemp == 'null'){//费用余额对象
				jfLayer.fail(T.T("YYJ200038"));
				return;
            }
            $scope.businessTypeInf.artifactInstanList = [];
			$scope.businessTypeInf.transIdNoList = $rootScope.S1ListResult;
			$scope.businessTypeInf.businessForm = $scope.businessTypeInf.businessFormUpdate;
			$scope.businessTypeInf.defaultPrincipalBalanceObj = $scope.businessTypeInf.defaultPrincipalBalanceObjTemp;
			$scope.businessTypeInf.defaultInterestBalanceObj = $scope.businessTypeInf.defaultInterestBalanceObjTemp;
			$scope.businessTypeInf.defaultFeeBalanceObj = $scope.businessTypeInf.defaultFeeBalanceObjTemp;
			$scope.businessTypeInf.businessForm = result.scope.businessFormUpdate;
			$scope.businessTypeInf.businessPurpose = result.scope.businessPurposeUpdate;
			$scope.businessTypeInf.businessDebitCreditCode = result.scope.businessDebitCreditCodeUpdate;
//			if($scope.businessTypeInf.businessForm){
//				if($scope.businessTypeInf.businessForm.indexOf("R") != -1){
//					if($scope.businessTypeInf.transIdNoList.length != 1){
//						jfLayer.fail(T.T("YYJ200029"));
//						return;
//					}
//				}
//			}
			for (var i = 0; i < result.scope.typeBPUpdateChose.length; i++) {
				$scope.businessTypeInf.artifactInstanList.push(result.scope.typeBPUpdateChose[i]);
			}
			for (var j = 0; j < result.scope.typeBTPUpdateChose.length; j++) {
				$scope.businessTypeInf.artifactInstanList.push(result.scope.typeBTPUpdateChose[j]);
			}
			jfRest.request('businessType', 'update', $scope.businessTypeInf) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.businessTypeList.search();
				}
			});
		};
	});
	//查看
	webApp.controller('viewBusinessTypeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.businessNatureArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_businessNature",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.businessDebitCreditCodeView = $scope.businessTypeInfView.businessDebitCreditCode;
			}
		};
		$scope.transIdenArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_transIden",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.transIdentificationCodeView = $scope.businessTypeInfView.transIdentificationCode;
			}
		};
		$scope.businessPurposeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_businessPurpose",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.businessPurposeView = $scope.businessTypeInfView.businessPurpose;
			}
		};
		//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.businessTypeInfView.operationModeTemp = $scope.businessTypeInfView.operationMode;
			        }
			    };
		 //本金余额对象
		 $scope.prinBalanceObject ={ 
			        type:"dynamicDesc", 
			        param:{objectType:'P'},//默认查询条件 
			        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
			        desc: "objectDesc",
			        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"balanceObject.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.businessTypeInfView.defaultPrincipalBalanceObjTemp = $scope.businessTypeInfView.defaultPrincipalBalanceObj;
			        }
			    };
		 //利息余额对象
		 $scope.intBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'I'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.businessTypeInfView.defaultInterestBalanceObjTemp = $scope.businessTypeInfView.defaultInterestBalanceObj;
	        }
	    };
		 //费用余额对象
		 $scope.feeBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'F'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.businessTypeInfView.defaultFeeBalanceObjTemp = $scope.businessTypeInfView.defaultFeeBalanceObj;
	        }
	    };
		 //业务形态
		 $scope.businessFormArray ={ 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"patternDesc", //下拉框显示内容，根据需要修改字段名称 
	        desc: "patternDesc",
	        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessForm.query",//数据源调用的action 
	        callback: function(data){
	        	 $scope.businessTypeInfView.businessFormView = $scope.businessTypeInfView.businessForm;
	        }
	    };
		//***********************交易识别列表***********************
			$scope.transIdenTable = {
				params : $scope.queryParam = {
						operationMode:$scope.businessTypeInfView.operationMode,
						businessTypeCode:$scope.businessTypeInfView.businessTypeCode,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery :true,
				resource : 'busTypeTransIden.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			 //余额对象参数选项
			$scope.typeBPView = {
					params : {
						artifactNo : 8,
						instanCode:$scope.businessTypeInfView.businessTypeCode,
						operationMode:$scope.businessTypeInfView.operationMode,
						"pageSize":10,
						"indexNo":0
					}, // 表格查询时的参数信息
					autoQuery : true,
					paging : true,// 默认true,是否分页
					resource : 'artifactExample.query',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
					}
				};
			//业务类型参数选项
			$scope.typeBTPView = {
				params : {
					artifactNo : 9,
					instanCode:$scope.businessTypeInfView.businessTypeCode,
					operationMode:$scope.businessTypeInfView.operationMode,
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				autoQuery : true,
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			//余额对象构件实例====详情
			$scope.queryArtifactBP = function(item) {
				$scope.itemArtifact = {};
				// 页面弹出框事件(弹出页面)
				$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
					title : T.T('F00041')+$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +T.T('F00156'),
					buttons : [  T.T('F00012')],
					size : [ '1100px', '530px'  ],
					callbacks : []
				});
			};
	});
	//查看
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
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
	//修改
	webApp.controller('updateBusinessTypeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$scope.businessNatureArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_businessNature",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.businessDebitCreditCodeUpdate = $scope.businessTypeInf.businessDebitCreditCode;
			}
		};
		$scope.businessPurposeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_businessPurpose",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.businessPurposeUpdate = $scope.businessTypeInf.businessPurpose;
				}
			};
//		业务形态
		 $scope.businessFormArray ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"patternDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"businessForm.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.businessFormUpdate = $scope.businessTypeInf.businessForm;
			        }
			    };
		//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.businessTypeInf.operationModeTemp = $scope.businessTypeInf.operationMode;
			        }
			    };
		 //本金余额对象
		 $scope.prinBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'P'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.businessTypeInf.defaultPrincipalBalanceObjTemp = $scope.businessTypeInf.defaultPrincipalBalanceObj;
	        }
	    };
		 //利息余额对象
		 $scope.intBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'I'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.businessTypeInf.defaultInterestBalanceObjTemp = $scope.businessTypeInf.defaultInterestBalanceObj;
	        }
	    };
		 //费用余额对象
		 $scope.feeBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'F'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.businessTypeInf.defaultFeeBalanceObjTemp = $scope.businessTypeInf.defaultFeeBalanceObj;
	        }
	    };
			//***********************交易识别列表***********************
		 $("#s31 option").remove();
		 $("#s32 option").remove();
		$scope.setparamss = {
			operationMode:$scope.businessTypeInf.operationMode,
		};
		jfRest.request('transIdenty', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s1 = {};
			$rootScope.s1 = data.returnData.rows;
			$scope.queryParam = {
					operationMode:$scope.businessTypeInf.operationMode,
					businessTypeCode:$scope.businessTypeInf.businessTypeCode,
			};
			jfRest.request('busTypeTransIden', 'query', $scope.queryParam)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
						 $rootScope.S1ListResult = [];
						 for(var t=0;t<n.length;t++){
							$rootScope.S1ListResult.push(n[t]);
						 }
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s32").append("<option value='"+n[i].transIdentifiNo+"'>"+n[i].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].transIdentifiDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].transIdentifiNo==a[j].transIdentifiNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s31").append("<option value='"+a[j].transIdentifiNo+"'>"+a[j].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].transIdentifiDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s31").append("<option value='"+a[i].transIdentifiNo+"'>"+a[i].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].transIdentifiDesc+"</option>"); 
					  }
				   }
			});
		});
		 /*----根据修改交易识别，和交易识别描述查询 ----*/
	 	$scope.queryModifyList = function(){
			 $("#s31").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				transIdentifiNo: $scope.businessTypeInf.transIdentifiNo,
				transIdentifiDesc: $scope.businessTypeInf.transIdentifiDesc
	 		};
			jfRest.request('transIdenty', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 console.log(a);
				 $scope.arr02 = [];
				 $("#s32 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				 console.log(n);
				 if(n !=undefined && a !=null){
						//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].transIdentifiNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s31").append("<option value='"+a[j].transIdentifiNo+"'>"+a[j].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].transIdentifiDesc+"</option>"); 
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s31").append("<option value='"+a[j].transIdentifiNo+"'>"+a[j].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].transIdentifiDesc+"</option>"); 
					   }
			      }
			});
		};
		/*----end修改交易识别，和交易识别描述查询 ----*/
		//功能分配菜单
		$("#s31").dblclick(function(){  
			 var alloptions = $("#s31 option");  
			 var so = $("#s31 option:selected");  
			 $("#s32").append(so);
			$scope.arr1 = [];
			$scope.S1List = {};
			$rootScope.S1ListResult = [];
			 $("#s32 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr1.push(vall);
		    });
			 if($rootScope.s1){
				 for(var w=0;w<$rootScope.s1.length;w++){
					 for(var t=0;t<$scope.arr1.length;t++){
						if($rootScope.s1[w].transIdentifiNo == $scope.arr1[t]){
							$scope.S1List = $rootScope.s1[w];
							$rootScope.S1ListResult.push($scope.S1List);
						}
					 }
				 }
             }
            $scope.valueTransIdentifiNo= "";
		});  
		$("#s32").dblclick(function(){  
			 var alloptions = $("#s32 option");  
			 var so = $("#s32 option:selected");  
			 $("#s31").append(so);  
			 $scope.arr1 = [];
				$scope.S1List = {};
				$rootScope.S1ListResult = [];
				 $("#s32 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr1.push(vall);
			    });
				 if($rootScope.s1){
					 for(var w=0;w<$rootScope.s1.length;w++){
						 for(var t=0;t<$scope.arr1.length;t++){
							if($rootScope.s1[w].transIdentifiNo == $scope.arr1[t]){
								$scope.S1List = $rootScope.s1[w];
								$rootScope.S1ListResult.push($scope.S1List);
							}
						 }
					 }
                 }
            $scope.valueTransIdentifiNo= "";
		});  
		$("#add31").click(function(){  
			 var alloptions = $("#s31 option");  
			 var so = $("#s31 option:selected");  
			 $("#s32").append(so); 
			 $scope.arr1 = [];
				$scope.S1List = {};
				$rootScope.S1ListResult = [];
				 $("#s32 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr1.push(vall);
			    });
				 if($rootScope.s1){
					 for(var w=0;w<$rootScope.s1.length;w++){
						 for(var t=0;t<$scope.arr1.length;t++){
							if($rootScope.s1[w].transIdentifiNo == $scope.arr1[t]){
								$scope.S1List = $rootScope.s1[w];
								$rootScope.S1ListResult.push($scope.S1List);
							}
						 }
					 }
                 }
            $scope.valueTransIdentifiNo= "";
		});  
		$("#remove31").click(function(){  
			 var alloptions = $("#s32 option");  
			 var so = $("#s32 option:selected");  
			 $("#s31").append(so);
			 $scope.arr1 = [];
				$scope.S1List = {};
				$rootScope.S1ListResult = [];
				 $("#s32 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr1.push(vall);
			    });
				 if($rootScope.s1){
					 for(var w=0;w<$rootScope.s1.length;w++){
						 for(var t=0;t<$scope.arr1.length;t++){
							if($rootScope.s1[w].transIdentifiNo == $scope.arr1[t]){
								$scope.S1List = $rootScope.s1[w];
								$rootScope.S1ListResult.push($scope.S1List);
							}
						 }
					 }
                 }
            $scope.valueTransIdentifiNo= "";
		});  
		$("#addall31").click(function(){  
			$("#s32").append($("#s31 option").attr("selected",true));  
			$scope.arr1 = [];
			$scope.S1List = {};
			$rootScope.S1ListResult = [];
			 $("#s32 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr1.push(vall);
		    });
			 if($rootScope.s1){
				 for(var w=0;w<$rootScope.s1.length;w++){
					 for(var t=0;t<$scope.arr1.length;t++){
						if($rootScope.s1[w].transIdentifiNo == $scope.arr1[t]){
							$scope.S1List = $rootScope.s1[w];
							$rootScope.S1ListResult.push($scope.S1List);
						}
					 }
				 }
             }
            $scope.valueTransIdentifiNo= "";
		});  
		$("#s32").click(function(){  
			//默认类型
			 var valueTypes = $("#s32 option:selected").val();
			 $scope.valueTransIdentifiNo= "";
			 if(valueTypes){
				 $scope.valueTransIdentifiNo = valueTypes;
			 }
		});
		$("#removeall31").click(function(){  
			$("#s31").append($("#s32 option").attr("selected",true));  
			$rootScope.S1ListResult = [];
		}); 
		//设置默认交易识别
		$("#setDefaultId31").click(function(){ 
			 if($scope.valueTransIdentifiNo != "" && $scope.valueTransIdentifiNo != undefined && $scope.valueTransIdentifiNo != null){
				 $scope.businessTypeInf.defaultTransIdentifiNo = $scope.valueTransIdentifiNo;
			 }else{
				 jfLayer.fail(T.T('YYH200036'));
			 }
		});
		 //余额对象参数选项
		$scope.typeBPUpdate = {
				params : {
					artifactNo : 8,
					instanCode:$scope.businessTypeInf.businessTypeCode,
					operationMode:$scope.businessTypeInf.operationMode,
					pageSize:10,
					indexNo:0
				}, // 表格查询时的参数信息
				autoQuery : true,
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//业务类型参数选项
		$scope.typeBTPUpdate = {
				params : {
					artifactNo : 9,
					instanCode:$scope.businessTypeInf.businessTypeCode,
					operationMode:$scope.businessTypeInf.operationMode,
					pageSize:10,
					indexNo:0
				}, // 表格查询时的参数信息
				autoQuery : true,
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//余额对象实例化时，点击替换参数的方法
		$scope.selectAUpdateBP = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP]
				});
		};
		$scope.isChoseTypeBP = false;
		$scope.typeBPUpdateChose = [];
		$scope.choseSelectAUpdateBP = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.typeBPUpdate.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.typeBPUpdate.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if($scope.typeBPUpdateChose.length > 0 ){
				var isExist = false;						//是否存在
				for(var i=0;i<$scope.typeBPUpdateChose.length;i++){
					if($scope.typeBPUpdateChose[i].artifactNo === $scope.typeBPUpdate.data[$scope.indexNo].artifactNo && 
					$scope.typeBPUpdateChose[i].instanCode1 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode1 && 
					$scope.typeBPUpdateChose[i].instanCode2 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode2 && 
					$scope.typeBPUpdateChose[i].instanCode3 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode3 && 
					$scope.typeBPUpdateChose[i].instanCode4 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode4 && 
					$scope.typeBPUpdateChose[i].instanCode5 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode5){
						$scope.typeBPUpdateChose.splice(i,1);
						$scope.typeBPUpdateChose.push($scope.typeBPUpdate.data[$scope.indexNo]);
						isExist = true;						//是否存在
						break;
					}else{
						isExist = false;						//是否存在
					}
				}
				if(!isExist){
					$scope.typeBPUpdateChose.push($scope.typeBPUpdate.data[$scope.indexNo]);
					$scope.isChoseTypeBP = true;
				}
			}else{
				$scope.typeBPUpdateChose.push($scope.typeBPUpdate.data[$scope.indexNo]);
				$scope.isChoseTypeBP = true;
			}
			$scope.safeApply();
			result.cancel();
		};
		//余额对象实例化时，点击设置参数值的方法
		$scope.setSelectAUpdateBP = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateBP.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdateBP]
				}); 
		};
		$scope.choseSelectTwoUpdateBP = function(result) {
			$scope.items = {};
			//$scope.typeBPUpdate.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.typeBPUpdate.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.typeBPUpdate.data[$scope.indexNo].addPcdFlag = 	"1";
			if($scope.typeBPUpdateChose.length > 0 ){
				var isExist = false;						//是否存在
				for(var i=0;i<$scope.typeBPUpdateChose.length;i++){
					if($scope.typeBPUpdateChose[i].artifactNo === $scope.typeBPUpdate.data[$scope.indexNo].artifactNo && 
					$scope.typeBPUpdateChose[i].instanCode1 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode1 && 
					$scope.typeBPUpdateChose[i].instanCode2 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode2 && 
					$scope.typeBPUpdateChose[i].instanCode3 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode3 && 
					$scope.typeBPUpdateChose[i].instanCode4 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode4 && 
					$scope.typeBPUpdateChose[i].instanCode5 === $scope.typeBPUpdate.data[$scope.indexNo].instanCode5){
						$scope.typeBPUpdateChose.splice(i,1);
						$scope.typeBPUpdateChose.push($scope.typeBPUpdate.data[$scope.indexNo]);
						isExist = true;						//是否存在
						break;
					}else{
						isExist = false;						//是否存在
					}
				}
				if(!isExist){
					$scope.typeBPUpdateChose.push($scope.typeBPUpdate.data[$scope.indexNo]);
					$scope.isChoseTypeBP = true;
				}
			}else{
				$scope.typeBPUpdateChose.push($scope.typeBPUpdate.data[$scope.indexNo]);
				$scope.isChoseTypeBP = true;
			}
			$scope.safeApply();
			result.cancel();
		};
		//余额对象实例化时，点击替换参数的方法
		$scope.selectAUpdateBPchose = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBPchose]
				});
		};
		$scope.choseSelectAUpdateBPchose = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.typeBPUpdateChose[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.typeBPUpdateChose[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		//余额对象实例化时，点击设置参数值的方法
		$scope.setSelectAUpdateBPchose = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateBP.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdateBPchose]
				}); 
		};
		$scope.choseSelectTwoUpdateBPchose = function(result) {
			$scope.items = {};
			$scope.typeBPUpdateChose[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.typeBPUpdateChose[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		 //删除余额对象已修改的信息
        $scope.deleteTypeBPUpdate =  function(data){
        	var checkId = data;
			$scope.typeBPUpdateChose.splice(checkId, 1);
        };
		//业务类型实例化时，点击替换参数的方法
		$scope.selectAUpdateBTP = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
				title : T.T('YYJ600015'),
				buttons : [  T.T('F00107'), T.T('F00012')  ],
				size : [ '1100px', '320px' ],
				callbacks : [$scope.choseSelectAUpdateBTP]
			});
		};
		$scope.isChoseTypeBTP = false;
		$scope.typeBTPUpdateChose = [];
		$scope.choseSelectAUpdateBTP = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.typeBTPUpdate.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.typeBTPUpdate.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if($scope.typeBTPUpdateChose.length > 0 ){
				var isExist = false;						//是否存在
				for(var i=0;i<$scope.typeBTPUpdateChose.length;i++){
					if($scope.typeBTPUpdateChose[i].artifactNo === $scope.typeBTPUpdate.data[$scope.indexNo].artifactNo && 
					$scope.typeBTPUpdateChose[i].elementNo === $scope.typeBTPUpdate.data[$scope.indexNo].elementNo && 
					$scope.typeBTPUpdateChose[i].instanCode1 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode1 && 
					$scope.typeBTPUpdateChose[i].instanCode2 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode2 && 
					$scope.typeBTPUpdateChose[i].instanCode3 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode3 && 
					$scope.typeBTPUpdateChose[i].instanCode4 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode4 && 
					$scope.typeBTPUpdateChose[i].instanCode5 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode5){
						$scope.typeBTPUpdateChose.splice(i,1);
						$scope.typeBTPUpdateChose.push($scope.typeBTPUpdate.data[$scope.indexNo]);
						isExist = true;						//是否存在
						break;
					}else{
						isExist = false;						//是否存在
					}
				}
				if(!isExist){
					$scope.typeBTPUpdateChose.push($scope.typeBTPUpdate.data[$scope.indexNo]);
					$scope.isChoseTypeBTP = true;
				}
			}else{
				$scope.typeBTPUpdateChose.push($scope.typeBTPUpdate.data[$scope.indexNo]);
				$scope.isChoseTypeBTP = true;
			}
			$scope.safeApply();
			result.cancel();
		};
		//业务类型实例化时，点击设置参数值的方法
		$scope.setSelectAUpdateBTP = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateBTP.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdateBPT]
				});
		};
		$scope.choseSelectTwoUpdateBPT = function(result) {
			$scope.items = {};
			//$scope.typeBPUpdate.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.typeBTPUpdate.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.typeBTPUpdate.data[$scope.indexNo].addPcdFlag = 	"1";
			if($scope.typeBTPUpdateChose.length > 0 ){
				var isExist = false;						//是否存在
				for(var i=0;i<$scope.typeBTPUpdateChose.length;i++){
					if($scope.typeBTPUpdateChose[i].artifactNo === $scope.typeBTPUpdate.data[$scope.indexNo].artifactNo && 
					$scope.typeBTPUpdateChose[i].instanCode1 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode1 && 
					$scope.typeBTPUpdateChose[i].instanCode2 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode2 && 
					$scope.typeBTPUpdateChose[i].instanCode3 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode3 && 
					$scope.typeBTPUpdateChose[i].instanCode4 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode4 && 
					$scope.typeBTPUpdateChose[i].instanCode5 === $scope.typeBTPUpdate.data[$scope.indexNo].instanCode5){
						$scope.typeBTPUpdateChose.splice(i,1);
						$scope.typeBTPUpdateChose.push($scope.typeBTPUpdate.data[$scope.indexNo]);
						isExist = true;						//是否存在
						break;
					}else{
						isExist = false;						//是否存在
					}
				}
				if(!isExist){
					$scope.typeBTPUpdateChose.push($scope.typeBTPUpdate.data[$scope.indexNo]);
					$scope.isChoseTypeBTP = true;
				}
			}else{
				$scope.typeBTPUpdateChose.push($scope.typeBTPUpdate.data[$scope.indexNo]);
				$scope.isChoseTypeBTP = true;
			}
			$scope.safeApply();
			result.cancel();
		};
		//业务类型实例化时，点击替换参数的方法
		$scope.selectAUpdateBTPchose = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBTPchose]
				});
		};
		$scope.choseSelectAUpdateBTPchose = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.typeBTPUpdateChose[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.typeBTPUpdateChose[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		//业务类型实例化时，点击设置参数值的方法
		$scope.setSelectAUpdateBTPchose = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateBTP.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdateBPTchose]
				}); 78
		};
		$scope.choseSelectTwoUpdateBPTchose = function(result) {
			$scope.items = {};
			$scope.typeBTPUpdateChose[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.typeBTPUpdateChose[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		 //删除业务类型已修改的信息
        $scope.deleteTypeBTPUpdate =  function(data){
        	var checkId = data;
			$scope.typeBTPUpdateChose.splice(checkId, 1);
        }
	});
	// 业务类型建立111
	webApp.controller('businessTypeMgtCtrl', function($scope, $stateParams, jfRest,$http,$timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.businessNatureArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_businessNature",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {}
		};
		$scope.businessPurposeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_businessPurpose",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {}
		};
		$scope.busTypeInfo = {};
		//	运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //	业务形态
		 $scope.businessFormArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"patternDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessForm.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //本金余额对象
		 $scope.prinBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'P'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //利息余额对象
		 $scope.intBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'I'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //费用余额对象
		 $scope.feeBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'F'},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc: "objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //查看优先级
		$scope.choseBtnPriority = function() {
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/business/viewBusTypePriority.html', $scope.params, {
				title : T.T('YYJ200028'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
		 //第一步
		 $scope.step1Btn = true;
		 $scope.nextStep1 = function(){
			 $("#s33 option").remove();
			 $("#s34 option").remove();
			$scope.setparamss = {
					operationMode:$scope.busTypeInfo.operationMode
			};
			jfRest.request('transIdenty', 'query', $scope.setparamss)
			.then(function(data) {
				if(data.returnData.totalCount == 0){
					jfLayer.fail(T.T("YYJ200030"));
					return;
				}
				$scope.elementNoShow = true;  //关联显示
				 $scope.step1Btn = false;
				 var adom1I = document.getElementsByClassName('step1I');
	  			for(var i=0;i<adom1I.length;i++){
	  				adom1I[i].setAttribute('readonly',true);
	  				adom1I[i].classList.add('bnone');
	  			}
	  			var adom1S = document.getElementsByClassName('step1S');
				for(var i=0;i<adom1S.length;i++){
					adom1S[i].setAttribute('disabled','disabled');
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
				var a =data.returnData.rows;
				$rootScope.s5 = {};
				$rootScope.s5 =data.returnData.rows;
				for(var i=0;i<a.length;i++){
					angular.element("#s33").append("<option value='"+a[i].transIdentifiNo+"'>"+a[i].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].transIdentifiDesc+"</option>"); 
			   }
			});
		 };
		 /*----根据选择交易识别代码，和交易识别描述查询----*/
		 	$scope.queryTransactionList = function(){
				 $("#s33").empty();
				 $scope.setparamss = {
					operationMode : $rootScope.operationMods,
					transIdentifiNo: $scope.busTypeInfo.transIdentifiNo,
					transIdentifiDesc: $scope.busTypeInfo.transIdentifiDesc
		 		};
				jfRest.request('transIdenty', 'query', $scope.setparamss).then(function(data) {
					 var a =data.returnData.rows;
					 $scope.arr02 = [];
					 $("#s34 option").each(function () {
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
						    	if(n[i]==a[j].transIdentifiNo){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s33").append("<option value='"+a[j].transIdentifiNo+"'>"+a[j].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].transIdentifiDesc+"</option>"); 
					    	}
                        }
                     }else if(a!=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s33").append("<option value='"+a[j].transIdentifiNo+"'>"+a[j].transIdentifiNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].transIdentifiDesc+"</option>"); 
						   }
				      }
				});
			};
			/*----end选择交易识别代码，和交易识别描述查询 ----*/
		//点击上一步  回到第一步
		$scope.stepBackOne = function(){
			$scope.elementNoShow = false;  //第二步内容
			$scope.step1Btn = true;    //第一步按钮   
			var adom1I = document.getElementsByClassName('step1I');
  			for(var i=0;i<adom1I.length;i++){
  				adom1I[i].removeAttribute('readonly');
  				adom1I[i].classList.remove('bnone');
  			}
      		var adom1S = document.getElementsByClassName('step1S');
  			for(var i=0;i<adom1S.length;i++){
  				adom1S[i].removeAttribute('disabled');
  			}
  			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
        $("#s33").dblclick(function(){  
			 var alloptions = $("#s33 option");  
			 var so = $("#s33 option:selected");  
			 $("#s34").append(so);  
			 $scope.setTransIdentifiNo= "";
		});  
		$("#s34").dblclick(function(){  
			 var alloptions = $("#s34 option");  
			 var so = $("#s34 option:selected");  
			 $("#s33").append(so);  
			 $scope.setTransIdentifiNo= "";
		});  
		$("#add33").click(function(){  
			 var alloptions = $("#s33 option");  
			 var so = $("#s33 option:selected");  
			 $("#s34").append(so); 
			 $scope.setTransIdentifiNo= "";
		});  
		$("#remove33").click(function(){  
			 var alloptions = $("#s34 option");  
			 var so = $("#s34 option:selected");  
			 $("#s33").append(so);
			 $scope.setTransIdentifiNo= "";
		});  
		$("#addall33").click(function(){  
			$("#s34").append($("#s33 option").attr("selected",true)); 
			$scope.setTransIdentifiNo= "";
		});  
		$("#removeall33").click(function(){  
			$("#s33").append($("#s34 option").attr("selected",true));
			$scope.setTransIdentifiNo= "";
		});
		$("#s34").click(function(){  
			//默认类型
			 var valueTypes = $("#s34 option:selected").val();
			 $scope.setTransIdentifiNo= "";
			 if(valueTypes){
				 $scope.setTransIdentifiNo = valueTypes;
			 }
		});
		//设置默认交易识别
		$("#setDefaultId33").click(function(){ 
			 if($scope.setTransIdentifiNo != "" && $scope.setTransIdentifiNo != undefined && $scope.setTransIdentifiNo != null){
				 $scope.busTypeInfo.defaultTransIdentifiNo = $scope.setTransIdentifiNo;
			 }else{
				 jfLayer.fail(T.T('YYH200036'));
			 }
		});
		//下一步实例化
		$rootScope.proObjInstan ={};
		$scope.sureNext = false;
		$scope.saveBusinessType = function(){
			$scope.sureNext = false;
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S33ListResult = [];
			 $("#s34 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s5){
				 for(var w=0;w<$rootScope.s5.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s5[w].transIdentifiNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s5[w];
							$scope.S33ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			 if($scope.S33ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ200031"));
				 return;
			 }
			$scope.busTypeInfo.businessTypeCode = 'MODT'+$scope.busTypeInfo.businessTypeCodeHalf;
			$scope.busTypeInfo.transIdNoList = $scope.S33ListResult;
			$rootScope.proObjInstan = $scope.busTypeInfo;
			$scope.businessTypeForm.$setPristine();
//			if($scope.busTypeInfo.businessForm){
//				 if($scope.busTypeInfo.businessForm.indexOf("R") != -1){
//					if($scope.busTypeInfo.transIdNoList.length != 1){
//						jfLayer.fail(T.T("YYJ200029"));
//						return;
//					}
//				}
//			}
			$scope.nextStep12();
			/*jfRest.request('businessType', 'save', $scope.busTypeInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$rootScope.proObjInstan = $scope.busTypeInfo;
					$scope.busTypeInfo = {};
					$scope.businessTypeForm.$setPristine();
					$scope.nextStep12();
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033') ;
					jfLayer.fail(data.returnMsg);
				}
			});*/
		};
        $scope.stepBackTwo = function(){
        	$scope.elementNoShow = true;
			$scope.newCodeShow = true;
			$scope.instanCodeShow = false;
			$scope.step1Btn = false;
			$scope.step12 = false;
			$scope.backShow = false;
			$scope.sureNext = false;
        };
		//余额对象列表
		$scope.queryBalanceObject = {
			params : {
				instanFlag:1
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			autoQuery:false,
			resource : 'balanceObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//-----------------------------构件实例--------------start
		$scope.newCodeShow = true;
		$scope.instanCodeShow = false;
		//进入余额对象信息
		$scope.nextStep12 = function (){
			$scope.elementNoShow = false;  //第二步内容
			$scope.instanCodeShow = true;//显示实例化
			$scope.newCodeShow = false;
			$scope.step12 = false;//显示余额对象实例化
			$scope.backShow = false;
			$scope.sureNext = true;
			$scope.queryMODT.params.instanCode=$rootScope.proObjInstan.businessTypeCode;
			$scope.queryMODT.search();
		};
		//返回建立业务类型基本信息
		$scope.stepBack1 = function(){
			$scope.elementNoShow = true;
			$scope.newCodeShow = true;
			$scope.step1Btn = false;
			$scope.step12 = false;
			$scope.backShow = false;
			$scope.sureNext = false;
		};
		//点击配置参数==========余额对象实例化
		$scope.setBalanceA = function(item,$index){
			$scope.indexNob = '';
			$scope.indexNob = $index;
			//弹框查询列表元件
			$scope.proObjInstan = {};
			$scope.proObjInstan = $.parseJSON(JSON.stringify(item));
			$scope.proObjInstan.instanBCode1 = $scope.busTypeInfo.businessTypeCodeHalf;
			// 页面弹出框事件(弹出页面)
			console.log($scope.proObjInstan);
			$scope.modal('/a_operatMode/publicMode/balanceObjectOneEstBusinessTQ.html', $scope.proObjInstan, {
				title : T.T("YYJ200023"),
				buttons : [ T.T("F00107"), T.T('F00012')],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.saveElementInfo]
			});
		};
		//配置参数确定事件
		$scope.saveElementInfo = function(result){
			for (var i = 0; i < result.scope.queryMODB.length; i++) {
				if(result.scope.queryMODB[i].pcdList==null && result.scope.queryMODB[i].pcdInitList!=null){
					result.scope.queryMODB[i].addPcdFlag = "1";
					result.scope.queryMODB[i].pcdList = result.scope.queryMODB[i].pcdInitList;
				}
			}
			$scope.queryBalanceObject.data[$scope.indexNob].instanlist = result.scope.queryMODB;
			$scope.safeApply();
			result.cancel();
		};
		//进入产品信息
		$scope.stepTo3 = function (){
			$scope.elementNoShow = false;  //第二步内容
			$scope.instanCodeShow = true;//显示实例化
			$scope.newCodeShow = false;
			$scope.step12 = false;//显示余额对象实例化
			$scope.backShow = false;
			$scope.sureNext = true;
			$scope.queryMODT.params.instanCode=$rootScope.proObjInstan.businessTypeCode;
			$scope.queryMODT.search();
		};
		//查询业务类型实例构件
		$scope.queryMODT = {
				params : $scope.queryParam = {
						instanDimen1 : "MODT",
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'artifactExample.querySelectArtifact',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//替换参数
		$scope.updateTypeEstA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title : T.T('F00138'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTypeEst]
				});
		};
		//设置参数值
		$scope.setTypeEstA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc + T.T('F00139'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTypeEstTwo]
				});
		};
		$scope.choseElementTypeEst = function(result) {
			if (!result.scope.elementNoTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTable.checkedList();
			$scope.queryMODT.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODT.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODT.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODT.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODT.data[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseElementTypeEstTwo = function(result) {
			$scope.queryMODT.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODT.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODT.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		//-------------------------------构件实例--------------end
		//***********************交易识别列表***********************
		var form = layui.form;
		form.on('select(getLevel)',function(event){
			//查询运营模式下的余额对象
			 //本金余额对象
			 $scope.prinBalanceObject ={ 
		        type:"dynamicDesc", 
		        param:{objectType:'P',operationMode:$scope.busTypeInfo.operationMode},//默认查询条件 
		        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc: "objectDesc",
		        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"balanceObject.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
			 //利息余额对象
			 $scope.intBalanceObject ={ 
		        type:"dynamicDesc", 
		        param:{objectType:'I',operationMode:$scope.busTypeInfo.operationMode},//默认查询条件 
		        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc: "objectDesc",
		        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"balanceObject.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
			 //费用余额对象
			 $scope.feeBalanceObject ={ 
		        type:"dynamicDesc", 
		        param:{objectType:'F',operationMode:$scope.busTypeInfo.operationMode},//默认查询条件 
		        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc: "objectDesc",
		        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"balanceObject.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		});
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
	webApp.controller('selectPCDCtrl',function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
			  if(null== $scope.pcdExampleInf.pcdPoint|| null== $scope.pcdTypeAdd || null== $scope.pcdExampleInf.pcdValue) {
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
	webApp.controller('viewBusTypePriorityCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.balanceObjectListTable = {
//				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'businessType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//******************************替换参数***************
	webApp.controller('selectElementNoBTCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
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
						if(data.returnData.rows[i].elementNo == $scope.itemsNo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	//****************** 余额对象实例化start***************
	// 余额对象列表查询
	webApp.controller('balanceObjectOneEstBusinessTQCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.objectTypeArr = [{name:T.T('YYJ600001'),id:"P"},{name:T.T('YYJ600002'),id:"I"},{name:T.T('YYJ600003'),id:"F"}];//
		 //利息入账余额对象
		 $scope.interestPostingBalanceObjectArr ={ 
	        type:"dynamic", 
	        param:{objectType:'I',operationMode:$rootScope.operationMods},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//查询余额对象实例构件
		 $scope.queryMODB = {};
		 $scope.queryMODB = $scope.proObjInstan.balanceInstanList;
		//新建余额对象实例化时，点击替换参数的方法
		$scope.updateElementA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
				title : T.T('F00138'),
				buttons : [  T.T('F00107'), T.T('F00012')  ],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.choseElement]
			});
		};
		//新建余额对象实例化时，点击设置参数值的方法
		$scope.setElementA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
				title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
				buttons : [  T.T('F00107'), T.T('F00012')  ],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.choseElementTwo]
			});
		};
		$scope.choseElement = function(result) {
			if (!result.scope.elementNoTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTable.checkedList();
			$scope.queryMODB[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODB[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.queryMODB[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODB[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODB[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODB[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODB[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseElementTwo = function(result) {
			$scope.items = {};
			$scope.queryMODB[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODB[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODB[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		}
	});
	//****************** 余额对象实例化end***************
	webApp.controller('selectPCDUpdateBPCtrl',function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
		var count = 1;
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
				$scope.pcdTypeUpdate = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
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
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeUpdateD = $scope.pcdExampleInf.segmentType;
			}
		};
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.indexNoTemp = '';
			$scope.pcdExampleInfUpdate = {};
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.addButtonShowUpdate = false;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null && $scope.itemsPCD.segmentType!=""){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
		}else{
			$scope.showNewPcdInfoUpdate = true;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
        };
        //获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdate)',function(event){
			 $scope.pcdTypeUpdate = event.value;
		 });
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdExampleInfUpdate.pcdPoint|| null== $scope.pcdTypeUpdate
	    			 || null== $scope.pcdExampleInfUpdate.pcdValue 
	    			  ) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
				pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
				pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
				pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
				pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
				pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
				pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeUpdate;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInfUpdate.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeUpdate;
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
	webApp.controller('selectPCDUpdateBTPCtrl',function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
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
				$scope.segmentTypeUpdateTD = $scope.pcdExampleInf.segmentType;
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
				$scope.pcdTypeUpdateT = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdateT)',function(event){
			 $scope.pcdTypeUpdateT = event.value;
		 });
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.indexNoTemp = '';
			$scope.pcdExampleInfUpdate = {};
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.addButtonShowUpdate = false;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null && $scope.itemsPCD.segmentType!=""){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
		}else{
			$scope.showNewPcdInfoUpdate = true;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
			if(item.id != null && item.id != undefined && item.id != '' && item.id){
				$scope.businessTypeInf.deletePcdInstanIdList.push(item.id);
            }
        };
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdExampleInfUpdate.pcdPoint|| null== $scope.pcdTypeUpdateT 
	    			 || null== $scope.pcdExampleInfUpdate.pcdValue 
	    			  ) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
				pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
				pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
				pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
				pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
				pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
				pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeUpdateT;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInfUpdate.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeUpdateT;
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
				//$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
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
});
