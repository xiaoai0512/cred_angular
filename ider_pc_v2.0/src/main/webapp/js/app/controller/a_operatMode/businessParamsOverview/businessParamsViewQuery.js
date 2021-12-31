/**
 * 
 */
'use strict';
define(function(require) {
	var webApp = require('app');
	// 产品對象查询111
	webApp.controller('proObjQueryCtrl', function($scope, $stateParams, jfRest,$http,$timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");   
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.busProShow = false;
		$scope.userName = "";
		$scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.isShowProView = false;
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
		//产品
		 $scope.proArray ={};
			var form = layui.form;
			form.on('select(getProductObjectCode)',function(data){
				if(data.value == "" || data.value == undefined){
					$("#productObjectCode").attr("disabled",true);
					$scope.productObjectCode = "";
					$scope.operationMode = "";
					$scope.busiViewForm.$setPristine();
				}else {
					//产品
					 $scope.proArray ={ 
						        type:"dynamicDesc", 
						        param:{operationMode:$scope.operationMode},//默认查询条件 
						        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
						        desc:"productDesc",
						        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
						        resource:"proObject.query",//数据源调用的action 
						        callback: function(data){
						        }
					};
					 $("#productObjectCode").removeAttr("disabled");
					 $timeout(function(){
		        		Tansun.plugins.render('select');
					});
				}
			});
		//业务项目
		$scope.busListView = {
				params : $scope.queryParam = {
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				autoQuery : false,
				paging : true,// 默认true,是否分页
				resource : 'proObject.queryProBusScope',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//收费目录列表
		$scope.payProList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : false,
			paging : true,// 默认true,是否分页
			resource : 'feeProject.relatedProObjQuery',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//构件实例列表
		$scope.artifactView = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : false,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//差异化PCD信息
		$scope.differentiationPCDView = {
				params : {
					itemType:1,
					pageSize:10,
					indexNo:0
				}, // 表格查询时的参数信息
				autoQuery : false,
				paging : true,// 默认true,是否分页
				resource : 'pcdExample.pcdDiff',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//收费项目信息
		$scope.payProjectView = {
				params : {
					flag:1,
					itemType:0,
					pageSize:10,
					indexNo:0
				}, // 表格查询时的参数信息
				autoQuery : false,
				paging : true,// 默认true,是否分页
				resource : 'feeProExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		//产品基础收费项目 查询详情
		$scope.queryPayProExample = function(event){
			$scope.payProExampleInf = {};
			$scope.payProExampleInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewPayProExa.html',	$scope.payProExampleInf, {
				title : T.T('YYJ1200016'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '520px' ],
				callbacks : []
			});
		};
		//产品增值服务费  查询详情
		$scope.queryExample = function(event){
			$scope.event = $.parseJSON(JSON.stringify(event));
			//点击增值服务费详情  查询收费项目实例
			$scope.params = {
				instanCode : $scope.event.productObjectCode,
				feeItemNo : $scope.event.feeItemNo
			};
			jfRest.request('feeProExample', 'query', $scope.params).then(function(data) {
				if(data.returnCode == '000000'){
					if(data!=null && data.length!=0 && data.returnData.rows.length){
						$scope.payProExampleInf = data.returnData.rows[0];
                    }
                    // 页面弹出框事件(弹出页面)
					$scope.modal('/a_operatMode/payProject/queryExample.html',	$scope.payProExampleInf, {
						title : T.T('YYJ1200016'),
						buttons : [ T.T('F00012') ],
						size : [ '1050px', '520px' ],
						callbacks : []
					});
				}
			});
		};
		//查询产品详情
		$scope.proObjectViews= function(){
			$scope.busProShow = false;
			var index = 0;
			while(true){
				var buttonBro3 = 'buttonBusPro'+index;
				++index;
				if($scope[buttonBro3]==undefined){
					break;
				}
				$scope[buttonBro3] = false;
			}
			$scope.proObjectInf = {};
			$scope.proParams = {
					"productObjectCode":$scope.productObjectCode,
					"operationMode":$scope.operationMode,
				};
				jfRest.request('proObject', 'query', $scope.proParams)
			    .then(function(data) {
			    	console.log(data);
			    	if(data.returnCode == "000000"){
			    		if(data.returnData.rows != null){
			    			$scope.proObjectInf = data.returnData.rows[0];
				    		$scope.isShowProView = true;
				    		//业务项目列表
							$scope.busListView.params.productObjectCode = $scope.productObjectCode;
							$scope.busListView.params.productTimeLimit = $scope.productTimeLimit;
							$scope.busListView.params.operationMode = $scope.operationMode;
							$scope.busListView.search();
							//构件实例
							$scope.artifactView.params.instanCode = $scope.productObjectCode;
							$scope.artifactView.params.operationMode = $scope.operationMode;
							$scope.artifactView.search();
							//差异化PCD信息
							$scope.differentiationPCDView.params.instanCode = $scope.productObjectCode;
							$scope.differentiationPCDView.params.operationMode = $scope.operationMode;
							$scope.differentiationPCDView.search();
							//收费项目实例列表
							$scope.payProjectView.params.instanCode = $scope.productObjectCode;
							$scope.payProjectView.params.operationMode = $scope.operationMode;
							$scope.payProjectView.search();
							//收费项目列表
							$scope.payProList.params.productObjectCode = $scope.productObjectCode;
							$scope.payProList.params.operationMode = $scope.operationMode;
							$scope.payProList.search();
			    		}else{
			    			jfLayer.alert(T.T('F00161'));
			    		}
			    	}
	            });
		};
		//产品构件实例====详情
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
		//产品构件实例====详情======差异化PCD
		$scope.queryArtifactDiff = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifactDiff.html', $scope.itemArtifact, {
				title : T.T('F00041')+$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +'的参数信息',
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};
		//业务项目=========详情
		$scope.busProShow = false;
		//收起
		$scope.queryProLineBPColse = function(indexNo,event) {
			$scope.busProShow = false;
			var buttonBro = 'buttonBusPro'+indexNo;
			$scope[buttonBro] = false;
		};
		$scope.queryProLineBP = function(indexNo,event) {
			$scope.busProShow = true;
			var buttonBro = 'buttonBusPro'+indexNo;
			while(indexNo>0){
				var buttonBro1 = 'buttonBusPro'+--indexNo;
				$scope[buttonBro1] = false;
			}
			while(true){
				++indexNo;
				var buttonBro2 = 'buttonBusPro'+indexNo;
				if($scope[buttonBro2]==undefined){
					break;
				}
				$scope[buttonBro2] = false;
			}
			$scope[buttonBro] = !$scope[buttonBro];
			$scope.itemProLine = {};
			$scope.itemeventp = $.parseJSON(JSON.stringify(event));
			$scope.plParams = {
					"businessProgramNo":$scope.itemeventp.businessProgramNo,
					"operationMode":$scope.itemeventp.operationMode,
				};
			$scope.busListBPView.params = $scope.plParams;
			$scope.busListBPView.search();
			$scope.caParams = {
					"instanCode":$scope.itemeventp.businessProgramNo,
					"operationMode":$scope.itemeventp.operationMode,
				};
			$scope.ComArtifactView.params = $scope.caParams;
			$scope.ComArtifactView.search();
		};
		//业务项目业务类型列表
		$scope.busListBPView = {
				params :  {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery :false,
				resource : 'productLineBusType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.ComArtifactView = {
				params : {}, // 表格查询时的参数信息
				autoQuery : false,
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//业务类型====详情
		$scope.queryTypeBP = function(item) {
			$scope.itemType = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemInfot = $.parseJSON(JSON.stringify(item));
			$scope.plParams = {
					"businessTypeCode":$scope.itemInfot.businessTypeCode,
					"operationMode":$scope.itemInfot.operationMode,
				};
				jfRest.request('businessType', 'query', $scope.plParams).then(function(data) {
			    	$scope.itemType = data.returnData.rows[0];
			    	$scope.modal('/a_operatMode/businessParamsOverview/busParViewType.html', $scope.itemType, {
						title : T.T('YYJ300015'),
						buttons : [  T.T('F00012')],
						size : [ '1200px', '630px'  ],
						callbacks : []
					});
	            });
		};
	});
	//查看5555555555
	webApp.controller('BPArtifactDiffCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态
		$scope.segmentTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_segmentationType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.segmentTypeInfo=$scope.pcdExampleInf.segmentType;
			}
		};	
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
        $scope.pcdExampleInf.baseInstanCode = $scope.productObjectCode;
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.itemArtifact.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.segmentTypeInfo =  data.returnData.rows[0].segmentType;
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
    	   $scope.queryPcdExample.addPcdFlag = '1';
    	   $scope.queryPcdExample.baseInstanCode = $scope.productObjectCode;
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }
    		   }
    	   });
       }
	});
	//查看333333333333333
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
	//业务项目==构件实例详情2222222222222
	webApp.controller('BPTypeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
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
				$scope.transIdentificationCodeView = $scope.itemType.transIdentificationCode;
			}
		};
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
				$scope.businessDebitCreditCodeView = $scope.itemType.businessDebitCreditCode;
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
			        	$scope.itemType.operationModeTemp = $scope.itemType.operationMode;
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
			        	$scope.itemType.defaultPrincipalBalanceObjTemp = $scope.itemType.defaultPrincipalBalanceObj;
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
			        	$scope.itemType.defaultInterestBalanceObjTemp = $scope.itemType.defaultInterestBalanceObj;
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
			        	$scope.itemType.defaultFeeBalanceObjTemp = $scope.itemType.defaultFeeBalanceObj;
			        }
			    };
//			业务形态
		 $scope.businessFormArray ={ 
			        type:"dynamicDesc", 
			        param:{},//默认查询条件 
			        text:"businessPattern", //下拉框显示内容，根据需要修改字段名称 
			        desc:"patternDesc",
			        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"businessForm.query",//数据源调用的action 
			        callback: function(data){
			        	 $scope.itemType.businessFormView = $scope.itemType.businessForm;
			        }
			    };
		 //余额对象参数选项
			$scope.typeBPView = {
					params : {
							artifactNo : 8,
							businessProgramNo:$scope.itemeventp.businessProgramNo,
							//instanCode:$scope.itemType.businessTypeCode,
							instanCode2:$scope.itemType.businessTypeCode,
							operationMode:$scope.itemType.operationMode,
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
							instanCode:$scope.itemType.businessTypeCode,
							operationMode:$scope.itemType.operationMode,
							"pageSize":10,
							"indexNo":0
					}, // 表格查询时的参数信息
					autoQuery : true,
					paging : true,// 默认true,是否分页
					resource : 'artifactExample.query',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
						
					}
				};
			//业务类型构件实例====详情
			$scope.queryArtifactType = function(item) {
				$scope.itemArtifact = {};
				// 页面弹出框事件(弹出页面)
				$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
					title : T.T('YYJ400040'),
					buttons : [  T.T('F00012')],
					size : [ '1100px', '530px'  ],
					callbacks : []
				});
			};
	});
	//查看4444444444444
	webApp.controller('viewPayProExaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.methodShow = false;
		$scope.matrixAppModeArry ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matrixAppMode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matrixAppModeInfo = $scope.payProExampleInf.matrixAppMode;
		        }
			};
		$scope.matchRelationArr01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation1Info = $scope.payProExampleInf.matchRelation1;
		        }
			};
			 $scope.matchRelationArr02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation2Info = $scope.payProExampleInf.matchRelation2;
		        }
			};
			 $scope.matchRelationArr03 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation3Info = $scope.payProExampleInf.matchRelation3;
		        }
			};
			 $scope.matchRelationArr04 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation4Info = $scope.payProExampleInf.matchRelation4;
		        }
			};
			 $scope.matchRelationArr05 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation5Info = $scope.payProExampleInf.matchRelation5;
		        }
			};
			 $scope.assessmentMethodArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_billingMethod",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.assessmentMethodInfo = $scope.payProExampleInf.assessmentMethod;
		        }
			};
			$scope.waiveCycleArr={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_waiveCycle",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.waiveCycleInfo = $scope.payProExampleInf.waiveCycle;
		        }
			};
			 $scope.feeFlagArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_feeFlag",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeFlagInfo = $scope.payProExampleInf.feeFlag;
		        }
			};
			//费用收取方式
			$scope.feeCollectTypeArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ecommFeeCollectType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeCollectTypeInfo = $scope.payProExampleInf.feeCollectType;
		        }
			};
			//应用维度
			$scope.feeMatrixApplicationDimensionArry  ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_feeMatrixApplicationDimension",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.feeMatrixApplicationDimensionInfo = $scope.payProExampleInf.feeMatrixApplicationDimension;
			        }
			};
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewPayProExaOperationMode = $scope.payProExampleInf.operationMode;
		        }
		    };
		//查询收费项目
		$scope.feeItemArr ={ 
		        type:"dynamic", 
		        param:{feeItemNo:$scope.payProExampleInf.feeItemNo},//默认查询条件 
		        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"feeProject.query",//数据源调用的action 
		        callback: function(data){
		        	if(data!=null && data.length!=0){
		        	$scope.payProExampleInf.feeType = data[0].feeType;
		        	$scope.payProExampleInf.assessmentMethod = data[0].assessmentMethod;
		        	$scope.showFee();
		        	}
		        }
		    };
		$scope.showFee = function(){
			if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
	});
	//产品增值服务费 查看
	webApp.controller('queryExampleCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.methodShow = false;
		$scope.matrixAppModeArry ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matrixAppMode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matrixAppModeInfo = $scope.payProExampleInf.matrixAppMode;
		        }
			};
			 $scope.matchRelationArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation1Info =  $scope.payProExampleInf.matchRelation1;
		        	$scope.matchRelation2Info =  $scope.payProExampleInf.matchRelation2;
		        	$scope.matchRelation3Info =  $scope.payProExampleInf.matchRelation3;
		        	$scope.matchRelation4Info =  $scope.payProExampleInf.matchRelation4;
		        	$scope.matchRelation5Info =  $scope.payProExampleInf.matchRelation5;
		        }
			};
			 $scope.assessmentMethodArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_billingMethod",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.assessmentMethodInfo = $scope.payProExampleInf.assessmentMethod;
		        }
			};
			$scope.waiveCycleArr={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_waiveCycle",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.waiveCycleInfo = $scope.payProExampleInf.waiveCycle;
		        }
			};
			 $scope.feeFlagArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_feeFlag",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeFlagInfo = $scope.payProExampleInf.feeFlag;
		        }
			};
			//费用收取方式
			$scope.feeCollectTypeArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ecommFeeCollectType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeCollectTypeInfo =  $scope.payProExampleInf.feeCollectType;
		        }
			};
			//应用维度
			$scope.feeMatrixApplicationDimensionArry  ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_feeMatrixApplicationDimension",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.feeMatrixApplicationDimensionInfo = $scope.payProExampleInf.feeMatrixApplicationDimension;
			        }
			};
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewPayProExaOperationMode = $scope.payProExampleInf.operationMode;
		        }
		    };
		$scope.showFee = function(){
			if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
	
	});
});
