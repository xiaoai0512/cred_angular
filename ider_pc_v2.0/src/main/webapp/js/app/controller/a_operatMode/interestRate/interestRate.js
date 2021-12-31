/**
 * 
 */
'use strict';
define(function(require) {
	var webApp = require('app');
	// 产品對象查询
	webApp.controller('interestRateCtrl', function($scope, $stateParams, jfRest,$http,$timeout, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");   
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.userName = "";
		$scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.eventList = "";
		 $scope.updateBtnFlag = false;
		 
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
			   	   	if($scope.eventList.search('COS.AD.02.0160') != -1){    //修改
	   					$scope.updateBtnFlag = true;
	   				}
	   				else{
	   					$scope.updateBtnFlag = false;
	   				}
				}
			});
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
			//根据产品代码和业务类型代码查询
			$scope.differentiationOtherView = {
				params : {
					"operationMode":'A01',
				    "pcdNo":"809AAA01",
				    "artifactNo":"809",
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : true,
				resource : 'interestRate.queryInterest',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//产品
		 $scope.proArray ={};
		 $scope.businessTypeArray ={};
			var form = layui.form;
			form.on('select(getProductObjectCode)',function(data){
				if(data.value == "" || data.value == undefined){
					$("#productObjectCodeId").attr("disabled",true);
					$("#businessTypeCodeId").attr("disabled",true);
					$scope.productObjectCode = "";
					$scope.businessTypeCode = "";
					$scope.operationMode = "";
					$scope.interestRateForm.$setPristine();
				}else {
					//产品代码
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
					 //业务类型
					 $scope.businessTypeArray ={ 
				        type:"dynamicDesc", 
				        param:{operationMode:$scope.operationMode},//默认查询条件 
				        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
				        desc:"businessDesc",
				        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"businessType.query",//数据源调用的action 
				        callback: function(data){
				        }
					};
					 $("#productObjectCodeId").removeAttr("disabled");
					 $("#businessTypeCodeId").removeAttr("disabled");
					 $timeout(function(){
		        		Tansun.plugins.render('select');
					});
				}
			});
			//查询详情===分两种：a选择产品对象，可以修改产品差异化利率；b选择业务类型，可以修改业务类型关联的余额对象809AAA01的利率
			$scope.selInterest= function(){
				if($scope.productObjectCode && $scope.businessTypeCode){
					$scope.differentiationOtherView.params.operationMode = $scope.operationMode;
					$scope.differentiationOtherView.params.instanCode = $scope.productObjectCode;
					$scope.differentiationOtherView.params.businessTypeCode = "";
					$scope.differentiationOtherView.search();
				}else if($scope.productObjectCode){
					$scope.differentiationOtherView.params.operationMode = $scope.operationMode;
					$scope.differentiationOtherView.params.instanCode = $scope.productObjectCode;
					$scope.differentiationOtherView.params.businessTypeCode = "";
					$scope.differentiationOtherView.search();
				}else if($scope.businessTypeCode){
					$scope.differentiationOtherView.params.instanCode = "";
					$scope.differentiationOtherView.params.businessTypeCode = $scope.businessTypeCode;
					$scope.differentiationOtherView.params.operationMode = $scope.operationMode;
					$scope.differentiationOtherView.search();
				}else if($scope.operationMode){
					$scope.differentiationOtherView.params.operationMode = $scope.operationMode;
					$scope.differentiationOtherView.params.instanCode = "";
					$scope.differentiationOtherView.params.businessTypeCode = "";
					$scope.differentiationOtherView.search();
				}else{
					$scope.differentiationOtherView.params.operationMode = "";
					$scope.differentiationOtherView.params.instanCode = "";
					$scope.differentiationOtherView.params.businessTypeCode = "";
					$scope.differentiationOtherView.search();
				}
			};
		//利率变更====详情
		$scope.queryInterestInfo = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/interestRate/interestRateInfo.html', $scope.itemArtifact, {
				title : T.T('F00041')+$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +'的参数信息',
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};	
		//修改利率========产品
		$scope.productObjectUpdate = function(item,$index){
			//弹框查询列表元件
			$scope.itemArtifact = {};
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/interestRate/updateInterest.html', $scope.itemArtifact, {
					title : '变更利率',
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseProductRate]
				}); 
		};
		//根据产品变更利率
		$scope.choseProductRate = function(result) {
			$scope.updateInstanList = {};
			$scope.updateInstanList = result.scope.itemArtifact;	
			$scope.updateInstanList.segmentType = result.scope.segmentType;
			$scope.updateInstanList.pcdList = result.scope.itemArtifact.x0987BO;
			$scope.updateInstanList.addPcdFlag = "1";
			$scope.updateInstanList.baseInstanCode = result.scope.itemArtifact.x0987BO[0].baseInstanCode;
			$scope.updateInstanList.optionInstanCode = result.scope.itemArtifact.x0987BO[0].optionInstanCode;
//			delete $scope.updateInstanList.x0987BO;
			jfRest.request('interestRate', 'update',$scope.updateInstanList).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.differentiationOtherView.search();
				}
			});
		}
	});
	//修改
	webApp.controller('updateInterestCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
				$scope.segmentTypeUpdate = $scope.pcdExampleInf.segmentType;
			}
		};	
		//pcd实例默认不显示
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
        $scope.segmentType = $scope.itemArtifact.segmentType;
        $scope.pcdExampleInf.baseInstanCode = $scope.itemArtifact.baseInstanCode;
        $scope.pcdExampleInf.optionInstanCode = $scope.itemArtifact.optionInstanCode;
        $scope.pcdInstanShow = true;
        if ($scope.itemArtifact.x0987BO.length >0) {
            $scope.pcdInfTable = $scope.itemArtifact.x0987BO;
        } else {
        	$scope.pcdInfTable = [];
        }
	});
	//查看
	webApp.controller('interestRateInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
				$scope.segmentTypeInfo = $scope.pcdExampleInf.segmentType;
			}
		};	
		//pcd实例默认不显示
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
        $scope.segmentTypeInfo = $scope.itemArtifact.segmentType;
        $scope.pcdExampleInf.baseInstanCode = $scope.itemArtifact.baseInstanCode;
        $scope.pcdExampleInf.optionInstanCode = $scope.itemArtifact.optionInstanCode;
        $scope.pcdInstanShow = true;
        if ($scope.itemArtifact.x0987BO.length >0) {
            $scope.pcdInfTable = $scope.itemArtifact.x0987BO;
        } else {
        	$scope.pcdInfTable = [];
        }
	});
});
