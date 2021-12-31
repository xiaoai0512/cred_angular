'use strict';
define(function(require) {
	var webApp = require('app');
	// ABS计划管理
	webApp.controller('ABSplanManageCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.menuNo = lodinDataService.getObject("menuNo");
    	$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false;
		$scope.deleBtnFlag = false;
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
   	   		if($scope.eventList.search('COS.IQ.02.0180') != -1){    //查询
				$scope.selBtnFlag = true;
			}
			else{
				$scope.selBtnFlag = false;
			}
	   	   	if($scope.eventList.search('COS.IQ.02.1320') != -1){    //新增
				$scope.addBtnFlag = true;
			}
			else{
				$scope.addBtnFlag = false;
			}
	   	   	if($scope.eventList.search('COS.IQ.02.1325') != -1){    //修改
				$scope.updBtnFlag = true;
			}
			else{
				$scope.updBtnFlag = false;
			}
	   	   	if($scope.eventList.search('COS.IQ.02.4095') != -1){    //删除
				$scope.deleBtnFlag = true;
			}
			else{
				$scope.deleBtnFlag = false;
			}
			}
		});
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//资产转变阶段
		$scope.capitalStageArraySel = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalStage",
				queryFlag : "children"
			},// 默认查询条件
			rmData:['TRS1','TRS2'],
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//查询事件
		$scope.queryABSplanInf = function(){
			$scope.itemList.params.type = $scope.packetForm.type;
			if(($scope.packetForm.idType == null || $scope.packetForm.idType == ''|| $scope.packetForm.idType == undefined) &&
					($scope.packetForm.idNumber == "" || $scope.packetForm.idNumber == undefined )
					&&( $scope.packetForm.externalIdentificationNo == "" || $scope.packetForm.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.packetForm.idType){
					if($scope.packetForm.idNumber == null || $scope.packetForm.idNumber == undefined || $scope.packetForm.idNumber == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else if($scope.packetForm.externalIdentificationNo){
						jfLayer.alert('F00076');
						$scope.isShow = false;
					}else {
						$scope.itemList.params.idType = $scope.packetForm.idType;
						$scope.itemList.params.idNumber = $scope.packetForm.idNumber;
						$scope.itemList.search();
					}
				}else if($scope.packetForm.idNumber){
					if($scope.packetForm.idType == null || $scope.packetForm.idType == undefined || $scope.packetForm.idType == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else if($scope.packetForm.externalIdentificationNo){
						jfLayer.alert('F00076');
						$scope.isShow = false;
					}else {
						$scope.itemList.params.idType = $scope.packetForm.idType;
						$scope.itemList.params.idNumber = $scope.packetForm.idNumber;
						$scope.itemList.search();
					}
				}else if($scope.packetForm.externalIdentificationNo){
					$scope.itemList.params.externalIdentificationNo = $scope.packetForm.externalIdentificationNo;
					$scope.itemList.search();
				}
			}
		};
		//查询列表的接口
		$scope.ABSplanList = {
			params : {
				pageSize : 10,
				indexNo : 0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
//			autoQuery: false,
			resource : 'assetSecurities.queryABSPlan',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_capitalStage','dic_assetAccType'],//查找数据字典所需参数
			transDict : ['capitalStage_capitalStageDesc','accountType_accountTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.isShow = true;
				}else{
					$scope.isShow = false;
				}
			}
		};
		//查询详情
		$scope.viewPlanInfBtn = function(event){
			$scope.viewPlanInf = event;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/assetSecurities/viewABSplan.html',
				$scope.viewPlanInf, {
					title : T.T('KHJ6000005') ,
					buttons : [ T.T('F00012') ],
					size : [ '1050px', '450px' ],
					callbacks : []
			});
		};
		//新增
		$scope.ABSplanAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/assetSecurities/ABSplanEst.html','', {
				title : T.T('KHJ6000006'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '450px' ],
				callbacks : [$scope.saveABSplanAdd]
			});
		};
		$scope.saveABSplanAdd = function(result){
			$scope.ABSplanEstInf = result.scope.ABSplanEstInf;
			if($scope.ABSplanEstInf.triggerTrs1<$scope.ABSplanEstInf.effectiveDate || $scope.ABSplanEstInf.triggerTrs1>$scope.ABSplanEstInf.expirationDate){
				jfLayer.alert(T.T('KHJ6000010') );
				return;
			}
			if($scope.ABSplanEstInf.triggerTrs2<$scope.ABSplanEstInf.effectiveDate || $scope.ABSplanEstInf.triggerTrs2>$scope.ABSplanEstInf.expirationDate){
				jfLayer.alert(T.T('KHJ6000010'));
				return;
			}
			if($scope.ABSplanEstInf.triggerTrsf<$scope.ABSplanEstInf.effectiveDate || $scope.ABSplanEstInf.triggerTrsf>$scope.ABSplanEstInf.expirationDate){
				jfLayer.alert(T.T('KHJ6000010'));
				return;
			}
			if($scope.ABSplanEstInf.triggerRepo<$scope.ABSplanEstInf.effectiveDate || $scope.ABSplanEstInf.triggerRepo>$scope.ABSplanEstInf.expirationDate){
				jfLayer.alert(T.T('KHJ6000010'));
				return;
			}
			/*if($scope.ABSplanEstInf.triggerTrs1 > $scope.ABSplanEstInf.triggerTrs2 || $scope.ABSplanEstInf.triggerTrs2 > $scope.ABSplanEstInf.triggerRepo || $scope.ABSplanEstInf.triggerTrs1 > $scope.ABSplanEstInf.triggerRepo){
				jfLayer.alert(T.T('KHJ6000011'));
				return;
			}
			if($scope.ABSplanEstInf.triggerTrsf > $scope.ABSplanEstInf.triggerRepo){
				jfLayer.alert(T.T('KHJ6000011'));
				return;
			}*/
			if($scope.ABSplanEstInf.planType=='R'){
				if($scope.ABSplanEstInf.triggerTrs1 >= $scope.ABSplanEstInf.triggerTrs2 || $scope.ABSplanEstInf.triggerTrs2 >= $scope.ABSplanEstInf.triggerRepo || $scope.ABSplanEstInf.triggerTrs1 >= $scope.ABSplanEstInf.triggerRepo){
					jfLayer.alert(T.T("KHJ6000011"));
					return;
				}
			}
			if($scope.ABSplanEstInf.planType!='R'){
				if($scope.ABSplanEstInf.triggerTrs1 >=$scope.ABSplanEstInf.triggerTrsf || $scope.ABSplanEstInf.triggerTrs1 >= $scope.ABSplanEstInf.triggerRepo || $scope.ABSplanEstInf.triggerTrsf >= $scope.ABSplanEstInf.triggerRepo){
					jfLayer.alert(T.T("KHJ6000011"));
					return;
				}
			}
			jfRest.request('assetSecurities', 'addABSPlan', $scope.ABSplanEstInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.ABSplanEstInfForm.$setPristine();
					$scope.ABSplanList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//查询资产转变阶段 以传描述
		 $scope.params1 = {
			type : "DROPDOWNBOX",
			groupsCode : "dic_capitalStage",
			queryFlag : "children" 
		 };
		jfRest.request('paramsManage', 'query', $scope.params1) .then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData && data.returnData.rows.length > 0){
					$rootScope.capitalStageList = data.returnData.rows;
                }
            }
		});
		//修改
		$scope.updatePlanInfBtn = function(event) {
			$scope.updatePlanInf = event;
			console.log(event);
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/assetSecurities/updateABSplan.html',$scope.updatePlanInf , {
				title :  T.T('KHJ6000007'),
				buttons : [T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '450px' ],
				callbacks : [$scope.sureUpdateABSplan]
			});
		};
		$scope.sureUpdateABSplan = function(result){
			//验证
			if(result.scope.upcapitalStage == 'TRSF' && result.scope.upaccountType == 'R'){
				if(!result.scope.upcapitalSubStage){
					jfLayer.alert(T.T('KHJ6000008') );
					return;
                }
            }
            angular.forEach($rootScope.capitalStageList,function(item,i){
				if(item.codes == result.scope.upcapitalStage){
					result.scope.updatePlanInf.capitalStageDesc = item.detailDesc;
                }
            });
			$scope.upABSplan = {};
			$scope.upABSplan = result.scope.updatePlanInf;
			$scope.upABSplan.capitalStage = result.scope.upcapitalStage;
			$scope.upABSplan.accountType = result.scope.upaccountType;
			$scope.upABSplan.capitalSubStage = result.scope.upcapitalSubStage;
			$scope.effectiveDate = $("#LAYCI_effectiveDateU").val();
			$scope.expirationDate = $("#LAYCI_expirationDateU").val();
			$scope.upABSplan.effectiveDate = $scope.effectiveDate;
			$scope.upABSplan.expirationDate = $scope.expirationDate;
			$scope.upABSplan.capitalOrganizationCode = result.scope.upcapitalOrganizationCode;
			$scope.upABSplan.planType = result.scope.planType;//计划类型
			//已下是触发日期
			$scope.triggerTrs1 = $("#LAYCI_triggerTrs1").val();
			$scope.triggerTrs2 = $("#LAYCI_triggerTrs2").val();
			$scope.triggerRepo = $("#LAYCI_triggerRepo").val();
			$scope.triggerTrsf = $("#LAYCI_triggerTrsf").val();
			$scope.triggerRepo2 = $("#LAYCI_triggerRepo2").val();
			$scope.upABSplan.triggerTrs1 = $scope.triggerTrs1;
			$scope.upABSplan.triggerTrs2 = $scope.triggerTrs2;
			$scope.upABSplan.triggerRepo = $scope.triggerRepo;
			$scope.upABSplan.triggerTrsf = $scope.triggerTrsf;
			$scope.upABSplan.triggerRepo2 = $scope.triggerRepo2;
			if(!$scope.upABSplan.triggerTrs1<$scope.upABSplan.effectiveDate || $scope.upABSplan.triggerTrs1>$scope.upABSplan.expirationDate){
				jfLayer.alert(T.T('KHJ6000010') );
				return;
			}
			if(!$scope.upABSplan.triggerTrs2<$scope.upABSplan.effectiveDate || $scope.upABSplan.triggerTrs2>$scope.upABSplan.expirationDate){
				jfLayer.alert(T.T('KHJ6000010'));
				return;
			}
			if(!$scope.upABSplan.triggerTrsf<$scope.upABSplan.effectiveDate || $scope.upABSplan.triggerTrsf>$scope.upABSplan.expirationDate){
				jfLayer.alert(T.T('KHJ6000010'));
				return;
			}
			if(!$scope.upABSplan.triggerRepo<$scope.upABSplan.effectiveDate || $scope.upABSplan.triggerRepo>$scope.upABSplan.expirationDate){
				jfLayer.alert(T.T('KHJ6000010'));
				return;
			}
			if($scope.upABSplan.planType=='R'){
				if($scope.upABSplan.triggerTrs1 >= $scope.upABSplan.triggerTrs2 || $scope.upABSplan.triggerTrs2 >= $scope.upABSplan.triggerRepo || $scope.upABSplan.triggerTrs1 >= $scope.upABSplan.triggerRepo){
					jfLayer.alert(T.T("KHJ6000011"));
					return;
				}
			}
			if($scope.upABSplan.planType!='R'){
				if($scope.upABSplan.triggerTrs1 >=$scope.upABSplan.triggerTrsf || $scope.upABSplan.triggerTrs1 >= $scope.upABSplan.triggerRepo2 || $scope.upABSplan.triggerTrsf >= $scope.upABSplan.triggerRepo2){
					jfLayer.alert(T.T("KHJ6000011"));
					return;
				}else{
					$scope.upABSplan.triggerRepo = $scope.upABSplan.triggerRepo2;
				}
			}
			delete $scope.upABSplan.triggerRepo2;
			jfRest.request('assetSecurities', 'updateABSPlan', $scope.upABSplan) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.ABSplanList.search();
				}
			});
		};
		//删除
		$scope.delePlanInfBtn = function(item){
			jfLayer.confirm( T.T('F00092'),function(){//yes
				$scope.params ={
					planId:item.planId,
					_CART: "A",
					pageSize : 10,
					pageNum : 1
				};
				jfRest.request('assetSecurities', 'deleABSPlan', $scope.params) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00037'));
						$scope.safeApply();
						$scope.ABSplanList.search();
					}
				});
			},function(){//no
				
			})
		};
	});
	//新增
	webApp.controller('ABSplanEstCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer,
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
//		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.ABSplanEstInf = {};
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_effectiveDate',
				min:Date.now(),
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
					$scope.ABSplanEstInf.effectiveDate = $("#LAYCI_effectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#LAYCI_expirationDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.ABSplanEstInf.expirationDate = $("#LAYCI_expirationDate").val();
				}
			});
		});
		//触发日期1
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerTrs1',
				min:Date.now(),
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
					$scope.ABSplanEstInf.triggerTrs1 = $("#LAYCI_triggerTrs1").val();
				}
			});
			  var endDate = laydate.render({
					elem: '#expirationDate',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
					}
				});
		});
		//触发日期2
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerTrs2',
				min:Date.now(),
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
					$scope.ABSplanEstInf.triggerTrs2 = $("#LAYCI_triggerTrs2").val();
				}
			});
			  var endDate = laydate.render({
					elem: '#expirationDate',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
					}
				});
		});
		//触发日期3
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerTrsf',
				min:Date.now(),
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
					$scope.ABSplanEstInf.triggerTrsf = $("#LAYCI_triggerTrsf").val();
				}
			});
			  var endDate = laydate.render({
					elem: '#expirationDate',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
					}
				});
		});
		//触发日期4
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerRepo',
				min:Date.now(),
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
					$scope.ABSplanEstInf.triggerRepo = $("#LAYCI_triggerRepo").val();
				}
			});
		  	var endDate = laydate.render({
				elem: '#expirationDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		//
		//触发日期5
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerRepo2',
				min:Date.now(),
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
					$scope.ABSplanEstInf.triggerRepo = $("#LAYCI_triggerRepo2").val();
				}
			});
		  	var endDate = laydate.render({
				elem: '#expirationDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//转出机构代码
		$scope.capitalOrganizationCodeArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	status : '1',
	        	isBankFunds : '1',
	        	purposeFunds : '1',
	        	partnerCategory : '1'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//转出机构代码
		jfRest.request('partnersQuery', 'queryList', {}) .then(function(data) {
			if(data.returnCode == '000000'){
        		if(data.returnData && data.returnData.rows.length > 0){
        			$scope.capitalOrganizationCodeList = data.returnData.rows;
        		}else {
        			$scope.capitalOrganizationCodeList = [];
        		}
            }
        });
		//资产类型
		$scope.accountTypeArray = {};
		//资产转变子阶段(循环账户专用)
		$scope.capitalSubStageArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalSubStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//表内回购法人代码
		$scope.corporationEntityNoOnArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	partnerCategory: '0'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.querySel",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//表外回购法人代码
		$scope.corporationEntityNoOffArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	partnerCategory : '1',
        		purposeFunds: '1',
        		isBankFunds: '0'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		// 联动 转出机构代码
		var form = layui.form;
		form.on('select(getCapitalOrganizationCode)', function(data1) {
			angular.forEach($scope.capitalOrganizationCodeList, function(item,i ){
				if(data1.value == item.corporationEntityNo){
					$scope.ABSplanEstInf.capitalOrganizationName = item.corporationEntityName;
                }
            });
		});
		//资产转变阶段
		$scope.capitalStageArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			rmData:['REPO','TRSF','TRS1','TRS2'],
			callback : function(data) {
			}
		};
		//*计划类型
		$scope.planTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_planType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		var form = layui.form;
		form.on('select(gatPlanTypeArray)', function(data1) {
			if(data1.value=='R'){
				$scope.accountTypeArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_assetAccType",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						rmData:['B','T'],
						callback : function(data) {
						}
					};
			}else if(data1.value=='S'){
				$scope.accountTypeArray = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_assetAccType",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					rmData:'R',
					callback : function(data) {
					}
				};
			}
		});
	});
	//查询
	webApp.controller('viewABSplanCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.vwoperationMode = $scope.viewPlanInf.operationMode;
	        }
	    };
		//资产转变阶段
		$scope.capitalStageArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.vwcapitalStage = $scope.viewPlanInf.capitalStage;
			}
		};
		//账户类型
		$scope.accountTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_assetAccType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.vwaccountType = $scope.viewPlanInf.accountType;
			}
		};
		
		//资产转变子阶段(循环账户专用)
		$scope.capitalSubStageArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalSubStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.vwcapitalSubStage = $scope.viewPlanInf.capitalSubStage;
			}
		};
		//资产转变子阶段
		if($scope.viewPlanInf.capitalStage == 'TRSF' && $scope.viewPlanInf.accountType == 'R'){
			$scope.subDiv = true;//显示
		}else {
			$scope.subDiv = false;//不显示
        }
        //表内回购法人代码
		$scope.corporationEntityNoOnArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	partnerCategory: '0'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.querySel",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//表外回购法人代码
		$scope.corporationEntityNoOffArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	partnerCategory : '1',
        		purposeFunds: '1',
        		isBankFunds: '0'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//*计划类型
		$scope.planTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_planType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.planType = $scope.viewPlanInf.planType;
			}
		};
		//触发日期判断R
		if($scope.viewPlanInf.planType=='R'){
			$scope.showTime1v=true;
			$scope.showTime2v=true;
			$scope.showTime3v=true;
			$scope.showTime4v=false;
			$scope.showTime5v=false;
        }
        //触发日期判断S
		if($scope.viewPlanInf.planType=='S'){
			$scope.showTime1v=false;
			$scope.showTime2v=false;
			$scope.showTime3v=false;
			$scope.showTime4v=true;
			$scope.showTime5v=true;
        }
    });
	//修改
	webApp.controller('updateABSplanCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
//		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_effectiveDateU',
				min:Date.now(),
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
				}
			});
			var endDate = laydate.render({
				elem: '#LAYCI_expirationDateU',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.upoperationMode = $scope.updatePlanInf.operationMode;
	        }
	    };
		//转出机构代码
		$scope.capitalOrganizationCodeArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	status : '1',
	        	isBankFunds : '1',
	        	purposeFunds : '1',
	        	partnerCategory : '1'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        	$scope.upcapitalOrganizationCode = $scope.updatePlanInf.capitalOrganizationCode;
	        }
	    };
		//转出机构代码
		jfRest.request('partnersQuery', 'queryList', {}) .then(function(data) {
			if(data.returnCode == '000000'){
        		if(data.returnData && data.returnData.rows.length > 0){
        			$scope.capitalOrganizationCodeList = data.returnData.rows;
        		}else {
        			$scope.capitalOrganizationCodeList = [];
        		}
            }
        });
		// 联动 转出机构代码
		var form = layui.form;
		form.on('select(getCapitalOrganizationCode)', function(data1) {
			angular.forEach($scope.capitalOrganizationCodeList, function(item,i ){
				if(data1.value == item.corporationEntityNo){
					$scope.updatePlanInf.capitalOrganizationName = item.corporationEntityName;
                }
            });
		});
		//账户类型
		$scope.accountTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_assetAccType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.upaccountType = $scope.updatePlanInf.accountType;
			}
		};
		//*原资产转变阶段
		$scope.oldcapitalStageArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.oldcapitalStage = $scope.updatePlanInf.capitalStage;
			}
		};
		//*计划类型
		$scope.planTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_planType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.planType = $scope.updatePlanInf.planType;
			}
		};
		//触发日期1
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerTrs1',
				min:Date.now(),
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
					//$scope.ABSplanEstInf.triggerTrs1 = $("#LAYCI_triggerTrs1").val();
				}
			});
			  var endDate = laydate.render({
					elem: '#expirationDate',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						//$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
					}
				});
		});
		//触发日期2
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerTrs2',
				min:Date.now(),
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
					//$scope.ABSplanEstInf.triggerTrs2 = $("#LAYCI_triggerTrs2").val();
				}
			});
			  var endDate = laydate.render({
					elem: '#expirationDate',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						//$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
					}
				});
		});
		//触发日期3
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerTrsf',
				min:Date.now(),
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
					//$scope.ABSplanEstInf.triggerTrsf = $("#LAYCI_triggerTrsf").val();
				}
			});
			  var endDate = laydate.render({
					elem: '#expirationDate',
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						//$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
					}
				});
		});
		//触发日期4
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerRepo',
				min:Date.now(),
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
					//$scope.ABSplanEstInf.triggerRepo = $("#LAYCI_triggerRepo").val();
				}
			});
		  	var endDate = laydate.render({
				elem: '#expirationDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					//$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		//
		//触发日期5
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_triggerRepo2',
				min:Date.now(),
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
					//$scope.ABSplanEstInf.triggerRepo = $("#LAYCI_triggerRepo2").val();
				}
			});
		  	var endDate = laydate.render({
				elem: '#expirationDate',
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					//$scope.ABSplanEstInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		var form = layui.form;
		form.on('select(gatPlanTypeArray)', function(data1) {
			//console.log(data1)
			if(data1.value=='R'){
				$scope.accountTypeArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_assetAccType",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						rmData:['B','T'],
						callback : function(data) {
						}
					};
			}else if(data1.value=='S'){
				$scope.accountTypeArray = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_assetAccType",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					rmData:'R',
					callback : function(data) {
					}
				};
			}
		});
		//表内回购法人代码
		$scope.corporationEntityNoOnArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	partnerCategory: '0'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.querySel",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//表外回购法人代码
		$scope.corporationEntityNoOffArray ={ 
	        type:"dynamicDesc", 
	        param:{
	        	partnerCategory : '1',
        		purposeFunds: '1',
        		isBankFunds: '0'
	        },//默认查询条件 
	        desc:"corporationEntityName",
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		
		//触发日期判断R,显示循环
		if($scope.updatePlanInf.planType=='R'){
			$scope.showTime1=true;
			$scope.showTime2=true;
			$scope.showTime3=true;
			$scope.showTime4=false;
			$scope.showTime5=false;
		}
		if($scope.updatePlanInf.planType=='R' && $scope.updatePlanInf.capitalStage=='PACK'){
			angular.element("#LAYCI_triggerTrs1").removeAttr('disabled');
			angular.element("#LAYCI_triggerTrs2").removeAttr('disabled');
			angular.element("#LAYCI_triggerRepo").removeAttr('disabled');
		}else if($scope.updatePlanInf.planType=='R' && $scope.updatePlanInf.capitalStage=='TRSF' && $scope.updatePlanInf.capitalStage=='TRS1'){
			angular.element("#LAYCI_triggerTrs1").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerTrs2").removeAttr('disabled');
			angular.element("#LAYCI_triggerRepo").removeAttr('disabled');
		}else if($scope.updatePlanInf.planType=='R' && $scope.updatePlanInf.capitalStage=='TRSF' && $scope.updatePlanInf.capitalStage=='TRS2'){
			angular.element("#LAYCI_triggerTrs1").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerTrs2").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerRepo").removeAttr('disabled');
		}else if($scope.updatePlanInf.planType=='R' && $scope.updatePlanInf.capitalStage=='REPO'){
			angular.element("#LAYCI_triggerTrs1").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerTrs2").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerRepo").attr('disabled', 'disabled');
		}
		//触发日期判断S
		if($scope.updatePlanInf.planType=='S'){
			$scope.showTime1=false;
			$scope.showTime2=false;
			$scope.showTime3=false;
			$scope.showTime4=true;
			$scope.showTime5=true;
		}else if($scope.updatePlanInf.planType=='S' && $scope.updatePlanInf.capitalStage=='PACK'){
			angular.element("#LAYCI_triggerTrsf").removeAttr('disabled');
			angular.element("#LAYCI_triggerRepo2").removeAttr('disabled');
		}else if($scope.updatePlanInf.planType=='S' && $scope.updatePlanInf.capitalStage=='TRSF'){
			angular.element("#LAYCI_triggerTrsf").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerRepo2").removeAttr('disabled');
		}else if($scope.updatePlanInf.planType=='S' && $scope.updatePlanInf.capitalStage=='REPO'){
			angular.element("#LAYCI_triggerTrsf").attr('disabled', 'disabled');
			angular.element("#LAYCI_triggerRepo2").attr('disabled', 'disabled');
		}
		//end
		// 原资产转变子阶段(循环账户专用)
		$scope.oldcapitalSubStageArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_capitalSubStage",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.oldcapitalSubStage = $scope.updatePlanInf.capitalSubStage;
			}
		};
		$scope.curcapitalStageArray = {};//现资产转变阶段
		$scope.curcapitalSubStageArray = {};//现资产转变子阶段
		if($scope.updatePlanInf.capitalStage == 'PACK'){
			$scope.curCapDiv = true;//现资产转变阶段
			$scope.curcapitalStageArray = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_capitalStage",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.upcapitalStage = 'TRSF';
				}
			};
			if($scope.updatePlanInf.accountType == 'R'){
				$scope.subDiv = true;
				$scope.curcapitalSubStageArray = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_capitalSubStage",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					callback : function(data) {
						$scope.upcapitalSubStage = 'TRS1';
					}
				}
				
			}else {
				$scope.subDiv = false;
			}
		}else if($scope.updatePlanInf.capitalStage == 'TRSF'){
			$scope.curCapDiv = true;//现资产转变阶段
			if($scope.updatePlanInf.accountType == 'B' || $scope.updatePlanInf.accountType == 'T'){
				$scope.curcapitalStageArray = {
					type : "dictData",
					param : {
						"type" : "DROPDOWNBOX",
						groupsCode : "dic_capitalStage",
						queryFlag : "children"
					},// 默认查询条件
					text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "paramsManage.query",// 数据源调用的action
					callback : function(data) {
						$scope.upcapitalStage = 'REPO';
					}
				};
				$scope.subDiv = false;
			}else if($scope.updatePlanInf.accountType == 'R'){
				$scope.subDiv = true;
				if($scope.updatePlanInf.capitalSubStage != 'TRS1' && $scope.updatePlanInf.capitalSubStage != 'TRS2'){
					$scope.curcapitalStageArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_capitalStage",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						callback : function(data) {
							$scope.upcapitalStage = 'TRSF';
						}
					};
					$scope.curcapitalSubStageArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_capitalSubStage",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						callback : function(data) {
							$scope.upcapitalSubStage = 'TRS1';
						}
					}
				}else if($scope.updatePlanInf.capitalSubStage == 'TRS1'){
					$scope.curcapitalStageArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_capitalStage",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						callback : function(data) {
							$scope.upcapitalStage = 'TRSF';
						}
					};
					$scope.curcapitalSubStageArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_capitalSubStage",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						callback : function(data) {
							$scope.upcapitalSubStage = 'TRS2';
						}
					}
				}else if($scope.updatePlanInf.capitalSubStage == 'TRS2' ){
					$scope.curcapitalStageArray = {
						type : "dictData",
						param : {
							"type" : "DROPDOWNBOX",
							groupsCode : "dic_capitalStage",
							queryFlag : "children"
						},// 默认查询条件
						text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "paramsManage.query",// 数据源调用的action
						callback : function(data) {
							$scope.upcapitalStage = 'REPO';
							$scope.subDiv = false;
							$scope.upcapitalSubStage ='';
						}
					};
				}
			}
		}else if($scope.updatePlanInf.capitalStage == 'REPO'){
			$scope.curCapDiv = false;
			$scope.upcapitalStage = 'REPO';
        }
    });
});
