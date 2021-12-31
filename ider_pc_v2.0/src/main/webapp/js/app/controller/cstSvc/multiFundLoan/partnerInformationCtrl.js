'use strict';
	define(function(require) {
	var webApp = require('app');
	// 合作方信息管理
	webApp.controller('partnerInformationCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_partnerInformation');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.organization = $scope.userInfo.organization;
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
				for(var i=0; i < data.returnData.length; i++){
   					$scope.eventList += data.returnData[i].eventNo + ",";
                }
                if($scope.eventList.search('FMS.AD.01.0001') != -1){    //新增
					$scope.addBtnFlag = true;
				}else{
					$scope.addBtnFlag = false;
				}
	   	   		if($scope.eventList.search('FMS.IQ.04.0001') != -1){    //查询
					$scope.selBtnFlag = true;
				} else{
					$scope.selBtnFlag = false;
                }
                if($scope.eventList.search('FMS.UP.01.0001') != -1){    //修改
					$scope.updBtnFlag = true; 
				}else{
					$scope.updBtnFlag = false;
				}
            }
        });
		//法人类型
		$scope.partnerCategoryArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_fundlegalPersonType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//状态
		$scope.statusArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//合作方信息管理--列表
		$scope.partnerInforList = {
			params : {
					pageSize:10,
					indexNo:0,
					status: 1
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'partnersQuery.queryList',// 列表的资源
			isTrans: true,
			transParams: ['dic_fundlegalPersonType','dic_effectiveStatus'],
			transDict: ['partnerCategory_partnerCategoryDesc','status_statusDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.resetChose = function() { 
			$scope.partnerInforList.params.corporationEntityNo = "";
			$scope.partnerInforList.params.corporationEntityName = "";
			$scope.partnerInforList.params.status = "";
		};
		// 查看
		$scope.partnersDetails = function(event) {
			$scope.seeInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/multiFundLoan/viewPartners.html',
			$scope.seeInfo, {
				title : T.T('FQJ700003'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '590px' ],
				callbacks : []
			});
		};
		//新增
		$scope.addCooperationInfo = function(){
			// 页面弹出框事件(弹出页面);
			$scope.modal('/cstSvc/multiFundLoan/addPartners.html','',{
				title : T.T('FQJ700001'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1090px', '590px' ],
				callbacks : [$scope.saveCooperationInfo]
			});
		};
		//新增回调函数
		$scope.saveCooperationInfo = function(result){
			$scope.CooperationInfo = {};
			$scope.CooperationInfo = result.scope.addInfo;
			jfRest.request('partnersQuery', 'queryAdd', $scope.CooperationInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.CooperationInfo = {};
					$scope.partnerInforList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 修改
		$scope.updatePartnerInfo = function(event) {
			$scope.partnerInfo = {};
			$scope.partnerInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/multiFundLoan/updatePartnersInfo.html',$scope.partnerInfo, {
				title : T.T('FQJ700002'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '1050px', '590px' ],
				callbacks : [ $scope.updatePartnerEvent]
			});
		};
		//修改回调函数
		$scope.updatePartnerEvent = function(result) {  
			$scope.updatePartnerItem = result.scope.partnerItem;
			$scope.updatePartnerItem.fundTelType = result.scope.fundTelType;
			$scope.updatePartnerItem.status = result.scope.status;
			$scope.updatePartnerItem.partnerCategory = result.scope.partnerCategory;
			$scope.updatePartnerItem.legalIdType = result.scope.legalIdType;
			$scope.updatePartnerItem.operationMode = result.scope.operationMode;
			$scope.updatePartnerItem.isBankFunds = result.scope.isBankFunds;
			$scope.updatePartnerItem.purposeFunds = result.scope.uppurposeFunds;
			$scope.updatePartnerItem.partnerCategory = result.scope.uppartnerCategory;
			jfRest.request('partnersQuery', 'update', $scope.updatePartnerItem	) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.partnerInforList.search();
				}
			});
		};
	});
	//查询详情
	webApp.controller('viewPartnersCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_partnerInformation');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.seeInfos=$scope.seeInfo;
		//法人代表证件类型
		$scope.legalIdTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_certificateType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.legalIdType = $scope.seeInfo.legalIdType;
			}
		};
		//法人类型
		$scope.fundlegalPersonTypeArray = {
			type:"dictData", 
	        param:{
	        	type: "DROPDOWNBOX",
				groupsCode : "dic_fundlegalPersonType",
				queryFlag : "children"
	        },//默认查询条件 
	        text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.vwpartnerCategory = $scope.seeInfo.partnerCategory;
			}	
		};
		//生效码标识
		$scope.statusArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.status = $scope.seeInfo.status;
			}	
		};
    	//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationMode = $scope.seeInfo.operationMode;
	        }
	    };
		//联系人类型
		$scope.fundTelTypeArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_contactType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.fundTelType = $scope.seeInfo.fundTelType;
			}	
		};
		//是否本行资金
		$scope.isBankFundsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.isBankFunds = $scope.seeInfo.isBankFunds;
			}
		};
		//资金用途
		$scope.purposeFundsArr = {
			type:"dictData", 
	        param:{
	        	type: "DROPDOWNBOX",
				groupsCode : "dic_purposeFunds",
				queryFlag : "children"
	        },//默认查询条件 
	        text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.vwpurposeFunds =  $scope.seeInfo.purposeFunds;
			}	
		};
	});
	//修改
	webApp.controller('updatePartnersInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_partnerInformation');
		$translate.refresh();
		$scope.partnerItem =$scope.partnerInfo;
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.partnerItem=$scope.partnerInfo;
		//法人代表证件类型
		$scope.legalIdTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_certificateType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.legalIdType = $scope.partnerInfo.legalIdType;
			}
		};
		//法人类型
		$scope.fundlegalPersonTypeArray = {
			type:"dictData", 
	        param:{
	        	type: "DROPDOWNBOX",
				groupsCode : "dic_fundlegalPersonType",
				queryFlag : "children"
	        },//默认查询条件 
	        text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.uppartnerCategory = $scope.partnerInfo.partnerCategory;
			}	
		};
		//生效码标识
		$scope.statusArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.status = $scope.partnerInfo.status;
			}	
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationMode = $scope.partnerInfo.operationMode;
	        }
	    };
		//是否本行资金
		$scope.isBankFundsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.isBankFunds = $scope.partnerInfo.isBankFunds;
			}
		};
		//联系人类型
		$scope.fundTelTypeArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_contactType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.fundTelType = $scope.partnerInfo.fundTelType;
			}	
		};
		//资金用途
		$scope.purposeFundsArr = {
			type:"dictData", 
	        param:{
	        	type: "DROPDOWNBOX",
				groupsCode : "dic_purposeFunds",
				queryFlag : "children"
	        },//默认查询条件 
	        text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.uppurposeFunds = $scope.partnerInfo.purposeFunds;
			}	
		};
	});
	//新增合作方信息管理
	webApp.controller('addPartnersCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_partnerInformation');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.addInfo = {};
		//$scope.addInfo.corporationEntityNo=$scope.events;//法人编号
		// 机构号查询
		$scope.institutionIdArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
			}
		};
		//法人代表证件类型
		$scope.legalIdTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_certificateType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//法人类型
		$scope.fundlegalPersonTypeArray = {
			type:"dictData", 
	        param:{
	        	type: "DROPDOWNBOX",
				groupsCode : "dic_fundlegalPersonType",
				queryFlag : "children"
	        },//默认查询条件 
	        text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//资金用途
		$scope.purposeFundsArr = {
			type:"dictData", 
	        param:{
	        	type: "DROPDOWNBOX",
				groupsCode : "dic_purposeFunds",
				queryFlag : "children"
	        },//默认查询条件 
	        text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//生效码标识
		$scope.statusArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.addInfo.status='1';
			}	
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//联系人类型
		$scope.fundTelTypeArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_contactType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//是否本行资金
		$scope.isBankFundsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
	});
});