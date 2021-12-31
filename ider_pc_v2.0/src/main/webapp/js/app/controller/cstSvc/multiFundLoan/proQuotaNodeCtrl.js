'use strict';
	define(function(require) {
	var webApp = require('app');
	// 产品额度节点
	webApp.controller('proQuotaNodeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.organization = $scope.userInfo.organization;
		//根据菜单和当前登录者查询有权限的事件编号
	 	$scope.menuNoSel = $scope.menuNo;
		
		//产品额度节点--列表
		$scope.quotaNodeList = {
			params : {
					pageSize:10,
					indexNo:0,
					status: 1
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'fundcreation.queryList',// 列表的资源
			isTrans: true,
			transParams: ['dic_fundAgreementType','dic_ZorO','dic_ZorO','dic_typesOfContribution','dic_effectiveStatus'],
			transDict: ['trustType_trustTypeDesc','isMulitTrust_isMulitTrustDesc','isAutoTrun_isAutoTrunDesc',
			            'fundsType_fundsTypeDesc','status_statusDesc'],
			callback : function(data) { // 表格查询后的回调函数
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
				//$scope.quotaNodeList.params.status= '1';
			}	
		};
		//重置
		$scope.resetChose = function() {
			$scope.quotaNodeList.params.trustNum= "";
			$scope.quotaNodeList.params.trustName = "";
			$scope.quotaNodeList.params.operationMode = "";
			$scope.quotaNodeList.params.status = "";
		};
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#effectiveDate',
				//min:"2019-03-01",
				done: function(value, date) {
					endDate.config.min = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					endDate.config.start = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.effectiveDate = $("#effectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#expirationDate',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		// 查看
		$scope.quotaDetails = function(event) {
			$scope.seeInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/multiFundLoan/productQuotaNode/viewProductQuota.html',
			$scope.seeInfo, {
				title : T.T('FQJ800015'),
				buttons : [T.T('F00012') ],
				size : [ '1050px', '590px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateQuotaDetails = function(event) {
			$scope.updateCapitalInfo = {};
			$scope.updateCapitalInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/multiFundLoan/productQuotaNode/updateProductQuota.html',$scope.updateCapitalInfo, {
				title : T.T('FQH800093'),
				buttons : [ T.T('F00107'), T.T('F00012')],
				size : [ '1050px', '590px' ],
				callbacks : [$scope.preservationInfo]
			});
		};
		//修改回调
		$scope.preservationInfo=function(result){
			$scope.productQuote={
				operationMode: result.scope.operationMode,
				clearMode: result.scope.clearMode,
				cooperatModel: result.scope.cooperatModel,
				isMulitTrust: result.scope.isMulitTrust,
				isAutoTrun: result.scope.isAutoTrun,
				fundsType: result.scope.fundsType,
				trustType: result.scope.trustType,
				orgNum: result.scope.orgNum,
				accountCcy: result.scope.accountCcy,
				trustNum: result.scope.trustNum
			};
			$scope.productQuote.productObjectCodeList = [];
			$scope.productQuote.productObjectCodeList = $rootScope.treeSelectPro;
			jfRest.request('productquota', 'query', $scope.productQuote).then(function(data) {
				 if (data.returnCode == '000000') {
					 jfLayer.success(T.T("FQJ800016"));
					 $scope.safeApply();
					 result.cancel();
				}
			});
		}
	});
	//查看-1
	webApp.controller('viewProductQuotaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.detailsList = $scope.seeInfo;
		$scope.showDiv =false;
		$scope.viewQuotaNodeTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0,
					trustNum: $scope.seeInfo.trustNum,
			}, // 表格查询时的参数信息productquota.details
			paging : true,// 默认true,是否分页
			resource : 'productquota.details',// 列表的资源
			checkBack: function(row) { //点击单行执行函数
				$scope.itemsList= row.creditNodeNoList;
				$scope.showDiv =true;
			},
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					if(data.returnData!=null){
						$scope.list={};
						$scope.list=data.returnData.rows;
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
							$scope.showDiv = false;
						}
					}
				}else{
					$scope.showDiv =false;
				}
			}
		};
		$scope.seeDetails = function(item){
				$scope.showDiv =true;
				$scope.viewQuotaNodeTable.search();
			};
			$scope.accountCcyArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_RMB",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.accountCcy= $scope.seeInfo.currencyCode;
				}
			};
			// 机构号查询
			$scope.institutionIdArr = {
				type : "dynamic",
				param : {},// 默认查询条件
				text : "organName", // 下拉框显示内容，根据需要修改字段名称
				value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
				callback : function(data) {
					$scope.orgNum = $scope.seeInfo.orgNum;
				}
			};
			//资金协议类型
			$scope.fundAgreementArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_fundAgreementType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.trustType= $scope.seeInfo.trustType;
				}
			};
			//出资类型
			$scope.capitalContributionArray={
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_typesOfContribution",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.fundsType= $scope.seeInfo.fundsType;
				}	
			};
			//是否自动回转
			$scope.isAutoTranArray = {
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
					$scope.isAutoTrun= $scope.seeInfo.isAutoTrun;
				}
			};
			//是否多方
			$scope.isMultitrustArray={
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
					$scope.isMulitTrust = $scope.seeInfo.isMulitTrust;
				}	
			};
			//合作模式
			$scope.cooperatModelArray={
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_cooperationMode",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.cooperatModel = $scope.seeInfo.cooperatModel;
				}	
			};
			//清算模式   
			$scope.liquidationModeArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_liquidationMode",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.clearMode = $scope.seeInfo.clearMode;
				}
			};
			//运营模式
			 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.coArrayList = data;
		        	$scope.operationMode = $scope.seeInfo.operationMode;
		       }
		    };
			
	});
	//修改-2
	webApp.controller('updateProductQuotaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.detailsList = $scope.updateCapitalInfo;
		$rootScope.trustNum = $scope.updateCapitalInfo.trustNum;
		$scope.updateQuotaNodeTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.saveSelect = function(event) {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.updateQuotaNodeTable.validCheck()) {
				return;
			}
			var items = $scope.updateQuotaNodeTable.checkedList();
			
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].productObjectCode == $rootScope.treeSelect[k].productObjectCode) { // 判断是否存在
						tipStr = tipStr + items[i].productObjectCode
								+ ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$rootScope.treeSelect.push(items[i]);
					$rootScope.treeSelectPro.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('PZJ100033')+ tipStr.substring(0,tipStr.length - 1)+ T.T('PZJ100032'));
			}
		};
		$scope.queryParam = {
			eventNo : $scope.updateCapitalInfo.eventNo,// $scope.item.eventNo,
			trustNum: $scope.updateCapitalInfo.trustNum
		};
		jfRest.request('productquota', 'details',$scope.queryParam).then(
			function(data) {
			if (data.returnCode == '000000') {
				$rootScope.treeSelect = [];
				$rootScope.treeSelectPro = [];
				$scope.selPro = {};
				if (data.returnData.rows == null) {
					$rootScope.treeSelect = [];
				}else {
					$rootScope.treeSelect = data.returnData.rows;
					for(var i =0; i < $rootScope.treeSelect.length; i++){
						$scope.creditNodeNoList = $rootScope.treeSelect[i].creditNodeNoList;
						for(var j =0; j< $scope.creditNodeNoList.length; j++){
							//获取接口返回的额度节点，因为接口返回的是list修改后只需传额度所以要单独获取
							$scope.creditNodeNo += $scope.creditNodeNoList[j].code + ",";
							//拼接数据训循环到页面
							$scope.selPro={productDesc:$rootScope.treeSelect[i].productDesc,productObjectCode:$rootScope.treeSelect[i].productObjectCode,creditNodeNo:$scope.creditNodeNoList[j].code};
                        }
                        $rootScope.treeSelectPro.push($scope.selPro);
                    }
                }
			}
		});
		//跳转额度节点弹框
		$scope.updateQuotaNode = function(item,index){
			if(item==''){
				jfLayer.alert(T.T('FQJ800017'));
				return;
			}
			$scope.quotaNodeInfo=item;
			$scope.quotaNodeInfo.operationMode = $scope.updateCapitalInfo.operationMode;
			$scope.quotaNodeInfo.trustNum = $scope.updateCapitalInfo.trustNum;
			$scope.indexNo=index;
			$scope.modal('/cstSvc/multiFundLoan/productQuotaNode/newQuotaNode.html',
				$scope.quotaNodeInfo, {
				title : T.T('FQJ800015'),
				buttons : [ T.T('F00107') , T.T('F00012') ],
				size : [ '1050px', '590px' ],
				callbacks : [$scope.addQno]
			});
		};
		$rootScope.quoteSelected = [];//已关联的额度节点存储，关联后再次点击修改，需要展示上次关联还未入库的额度节点
		//额度节点确定回调
		$scope.addQno=function(result){
			$scope.itemList={};
			$scope.itemList=result.scope.quotaNodeInfo;
			$scope.creditNodeNo = "";
			$scope.arr02 = [];
			$scope.selQuote={};//存储已关联的额度节点对象
			$scope.selQuoteArr = [];
			$scope.selProQuote = {};
			$scope.isArr = false;
			$("#s56 option").each(function () {
				var vall = $(this).val();
				$scope.arr02.push(vall);
			});	
			for(var j=0;j<$scope.arr02.length;j++){
				$scope.creditNodeNo += $scope.arr02[j]+",";
			}
			$scope.quotaNodeInfo.creditNodeNo = $scope.creditNodeNo;
			if($rootScope.quoteAll){
				for(var k=0;k<$rootScope.quoteAll.length;k++){
					for(var h=0;h<$scope.arr02.length;h++){
						if($rootScope.quoteAll[k].creditNodeNo == $scope.arr02[h]){
							$scope.selQuote={code:$rootScope.quoteAll[k].creditNodeNo,desc:$rootScope.quoteAll[k].creditDesc};
							$scope.selQuoteArr.push($scope.selQuote);
							$scope.selProQuote = {productObjectCode:$scope.itemList.productObjectCode,creditNodeNoList:$scope.selQuoteArr};
							if($rootScope.quoteSelected.length>0){
								for(var j=0;j<$rootScope.quoteSelected.length;j++){
									if($rootScope.quoteSelected[j].productObjectCode != $scope.itemList.productObjectCode){
										$scope.isArr = true;
									}else{
										$scope.isArr = false;
										$rootScope.quoteSelected[j].creditNodeNoList = $scope.selQuoteArr;
									}
								}
								if($scope.isArr){
									$rootScope.quoteSelected.push($scope.selProQuote);
								}
							}else{
								$rootScope.quoteSelected.push($scope.selProQuote);
							}
						}
					}
				}
			}
			
			$scope.treeSelectPro[$scope.indexNo].creditNodeNo = $scope.creditNodeNo;
			$scope.safeApply();
			result.cancel();
		};
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
			$rootScope.treeSelectPro.splice(checkId, 1);
		};
		$scope.accountCcyArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_RMB",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.accountCcy= $scope.updateCapitalInfo.currencyCode;
				}
			};
			// 机构号查询
			$scope.institutionIdArr = {
				type : "dynamic",
				param : {},// 默认查询条件
				text : "organName", // 下拉框显示内容，根据需要修改字段名称
				value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
				callback : function(data) {
					$scope.orgNum = $scope.updateCapitalInfo.orgNum;
				}
			};
			//资金协议类型
			$scope.fundAgreementArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_fundAgreementType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.trustType= $scope.updateCapitalInfo.trustType;
				}
			};
			//出资类型
			$scope.capitalContributionArray={
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_typesOfContribution",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.fundsType= $scope.updateCapitalInfo.fundsType;
				}	
			};
			//是否自动回转
			$scope.isAutoTranArray = {
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
					$scope.isAutoTrun = $scope.updateCapitalInfo.isAutoTrun;
				}
			};
			//是否多方
			$scope.isMultitrustArray={
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
					$scope.isMulitTrust = $scope.updateCapitalInfo.isMulitTrust;
				}	
			};
			//合作模式
			$scope.cooperatModelArray={
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_cooperationMode",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.cooperatModel = $scope.updateCapitalInfo.cooperatModel;
				}	
			};
			//清算模式   
			$scope.liquidationModeArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_liquidationMode",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.clearMode = $scope.updateCapitalInfo.clearMode;
					
				}
			};
			
	});
	// 额度节点修改-3
    webApp.controller('newQuotaNodeCtrl',function($scope, $stateParams,jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
        $translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
        $translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
        $translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
        $translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
        $translate.refresh();
        $scope.proLineInf = {};
        $scope.quotaNodeInfolist=$scope.quotaNodeInfo;
         //第一步
		 $("#s55 option").remove();
		 $("#s56 option").remove();
		$scope.setparamss = {
				operationMode: $scope.quotaNodeInfo.operationMode
		};
		jfRest.request('quotaNode', 'query', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;//左边框展示全部用
			$rootScope.quoteAll = data.returnData.rows;//获取所有额度节点，备用
			$scope.queryParam = {
					operationMode : $scope.quotaNodeInfo.operationMode,
					trustNum: $scope.quotaNodeInfo.trustNum,
					productObjectCode:$scope.quotaNodeInfo.productObjectCode,
				};
				jfRest.request('productquota', 'details', $scope.queryParam).then(function(data) {
					if(data.returnData.rows){
						for(var f=0;f<data.returnData.rows.length;f++){
							if(data.returnData.rows[f].productObjectCode == $scope.quotaNodeInfo.productObjectCode){
								var n =data.returnData.rows[f].creditNodeNoList;
								 console.log($rootScope.quoteSelected);
								 console.log(data.returnData.rows[f].creditNodeNoList);
								 //首先判断页面缓存是否有值
								 if($rootScope.quoteSelected.length > 0){
									 for(var y=0;y<$rootScope.quoteSelected.length;y++){
										//判断对应的产品修改，若是页面再次修改，直接取页面缓存
										 if($rootScope.quoteSelected[y].productObjectCode == $scope.quotaNodeInfo.productObjectCode){
											 for(var i=0;i<$rootScope.quoteSelected[y].creditNodeNoList.length;i++){
										    		angular.element("#s56").append("<option value='"+$rootScope.quoteSelected[y].creditNodeNoList[i].code+"'>"+$rootScope.quoteSelected[y].creditNodeNoList[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+$rootScope.quoteSelected[y].creditNodeNoList[i].desc+"</option>"); 
										    	}
												//查找重复数据
											    var isrep;
											    for(var j =0;j<a.length;j++){
											    	isrep = false;
											    	for(var i=0;i<$rootScope.quoteSelected[y].creditNodeNoList.length;i++){
												    	if($rootScope.quoteSelected[y].creditNodeNoList[i].code==a[j].creditNodeNo){
												    		isrep = true;
												    		break;
												    	}
												    }
											    	if(!isrep){
											    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
											    	}
                                                }
                                         }else{
											 //如果不是修改页面已缓存的产品，是新产品，则需要从数据库获取
											 if(n!=undefined){
												for(var i=0;i<n.length;i++){
										    		angular.element("#s56").append("<option value='"+n[i].code+"'>"+n[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].desc+"</option>"); 
										    	}
												//查找重复数据
											    var isrep;
											    for(var j =0;j<a.length;j++){
											    	isrep = false;
											    	for(var i=0;i<n.length;i++){
												    	if(n[i].code==a[j].creditNodeNo){
												    		isrep = true;
												    		break;
												    	}
												    }
											    	if(!isrep){
											    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
											    	}
                                                }
                                             }else{
												   for(var i=0;i<a.length;i++){
												   angular.element("#s55").append("<option value='"+a[i].creditNodeNo+"'>"+a[i].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].creditDesc+"</option>"); 
												  }
										      } 
										 } 
									 }
									 break;
								 }else{
									 if(n!=undefined){
										for(var i=0;i<n.length;i++){
								    		angular.element("#s56").append("<option value='"+n[i].code+"'>"+n[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].desc+"</option>"); 
								    	}
										//查找重复数据
									    var isrep;
									    for(var j =0;j<a.length;j++){
									    	isrep = false;
									    	for(var i=0;i<n.length;i++){
										    	if(n[i].code==a[j].creditNodeNo){
										    		isrep = true;
										    		break;
										    	}
										    }
									    	if(!isrep){
									    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
									    	}
                                        }
                                     }else{
										   for(var i=0;i<a.length;i++){
										   angular.element("#s55").append("<option value='"+a[i].creditNodeNo+"'>"+a[i].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].creditDesc+"</option>"); 
										  }
								      }
									 break;
								 }
							}else{
								if(n!=undefined){
									for(var i=0;i<n.length;i++){
							    		angular.element("#s56").append("<option value='"+n[i].code+"'>"+n[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].desc+"</option>"); 
							    	}
									//查找重复数据
								    var isrep;
								    for(var j =0;j<a.length;j++){
								    	isrep = false;
								    	for(var i=0;i<n.length;i++){
									    	if(n[i].code==a[j].creditNodeNo){
									    		isrep = true;
									    		break;
									    	}
									    }
								    	if(!isrep){
								    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
								    	}
                                    }
                                }else{
									   for(var i=0;i<a.length;i++){
									   angular.element("#s55").append("<option value='"+a[i].creditNodeNo+"'>"+a[i].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].creditDesc+"</option>"); 
									  }
							      }
							}
							break;
						}
					}else{
						if($rootScope.quoteSelected.length > 0){
							$scope.isY = false;
							 for(var y=0;y<$rootScope.quoteSelected.length;y++){
								//判断对应的产品修改，若是页面再次修改，直接取页面缓存
								 if($rootScope.quoteSelected[y].productObjectCode == $scope.quotaNodeInfo.productObjectCode){
									 $scope.isY = false;
									 for(var i=0;i<$rootScope.quoteSelected[y].creditNodeNoList.length;i++){
								    		angular.element("#s56").append("<option value='"+$rootScope.quoteSelected[y].creditNodeNoList[i].code+"'>"+$rootScope.quoteSelected[y].creditNodeNoList[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+$rootScope.quoteSelected[y].creditNodeNoList[i].desc+"</option>"); 
								    	}
										//查找重复数据
									    var isrep;
									    for(var j =0;j<a.length;j++){
									    	isrep = false;
									    	for(var i=0;i<$rootScope.quoteSelected[y].creditNodeNoList.length;i++){
										    	if($rootScope.quoteSelected[y].creditNodeNoList[i].code==a[j].creditNodeNo){
										    		isrep = true;
										    		break;
										    	}
										    }
									    	if(!isrep){
									    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
									    	}
                                        }
                                     break;
								 } else{
									 $scope.isY = true;
								 }
							 }
							 if($scope.isY){
								 //如果不是修改页面已缓存的产品，是新产品，则需要从数据库获取
								 if(n!=undefined){
									for(var i=0;i<n.length;i++){
							    		angular.element("#s56").append("<option value='"+n[i].code+"'>"+n[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].desc+"</option>"); 
							    	}
									//查找重复数据
								    var isrep;
								    for(var j =0;j<a.length;j++){
								    	isrep = false;
								    	for(var i=0;i<n.length;i++){
									    	if(n[i].code==a[j].creditNodeNo){
									    		isrep = true;
									    		break;
									    	}
									    }
								    	if(!isrep){
								    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
								    	}
                                    }
                                 }else{
									   for(var i=0;i<a.length;i++){
									   angular.element("#s55").append("<option value='"+a[i].creditNodeNo+"'>"+a[i].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].creditDesc+"</option>"); 
									  }
							      } 
							 }
						 }else{
							 if(n!=undefined){
									for(var i=0;i<n.length;i++){
							    		angular.element("#s56").append("<option value='"+n[i].code+"'>"+n[i].code+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].desc+"</option>"); 
							    	}
									//查找重复数据
								    var isrep;
								    for(var j =0;j<a.length;j++){
								    	isrep = false;
								    	for(var i=0;i<n.length;i++){
									    	if(n[i].code==a[j].creditNodeNo){
									    		isrep = true;
									    		break;
									    	}
									    }
								    	if(!isrep){
								    		angular.element("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
								    	}
                                    }
                             }else{
									   for(var i=0;i<a.length;i++){
									   angular.element("#s55").append("<option value='"+a[i].creditNodeNo+"'>"+a[i].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].creditDesc+"</option>"); 
									  }
							      } 
						 }
					}
				});
		});
		/*----根据额度节点，和额度节点描述查询----*/
	 	$scope.queryBusinessList = function(){
			 $("#s55").empty();
			 $scope.setparamss = {
				operationMode : $scope.quotaNodeInfo.operationMode,
				creditNodeNo: $scope.proLineInf.creditNodeNo,
				creditDesc: $scope.proLineInf.creditDesc
	 		};
			jfRest.request('quotaNode', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s56 option").each(function () {
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
					    	if(n[i]==a[j].creditNodeNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
				    	}
                    }
                  }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
					   }
			      }
			});
		};
		$("#s55").dblclick(function(){  
			 var alloptions = $("#s55 option");  
			 var so = $("#s55 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				$("#s56").append(so);  
			 }
		});  
		$("#s56").dblclick(function(){  
			 var alloptions = $("#s56 option");  
			 var so = $("#s56 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $("#s55").append(so);  
			 }
		});  
		$("#add55").click(function(){  
			 var alloptions = $("#s55 option");  
			 var so = $("#s55 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{		
				$("#s56").append(so); 
			 }
		});  
		$("#remove55").click(function(){  
			 var alloptions = $("#s56 option");  
			 var so = $("#s56 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				$("#s55").append(so);
			 }
		}); 
		$("#s56").click(function(){  
			var so = $("#s56 option:selected");
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }
		});
		$("#addall55").click(function(){  
			$("#s56").append($("#s55 option").attr("selected",true));  
		});  
		$("#removeall55").click(function(){  
			$("#s55").append($("#s56 option").attr("selected",true));  
		}); 
	});	
});