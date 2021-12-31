'use strict';
define(function(require) {

	var webApp = require('app');

	//核算状态维护
	webApp.controller('acctStatusMaintCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translatePartialLoader.addPart('pages/cstSvc/cstDelinquencyList/i18n_cstDelinquencyList');
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translate.use($scope.lang);
		$translate.refresh();
		$scope.menuNo = lodinDataService.getObject("menuNo");
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	
    	$scope.operationMode = lodinDataService.getObject("operationMode");
    	
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
		   	   		/*if($scope.eventList.search('COS.UP.02.0046') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}*/
			   	 /*	if($scope.eventList.search('COS.AD.02.0140') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}*/
			   	  	if($scope.eventList.search('COS.UP.02.0046') != -1){    //维护
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
 				}
 			});
    	
		
		$scope.isShowCstDiv = false;
    	
		//动态请求下拉框 证件类型
		 $scope.certificateTypeArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_certificateType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
//			        	console.log(data)
			        }
		};
    	//联动验证
 		var form = layui.form;
 		form.on('select(getIdType)',function(data){
 			
 			$scope.acctStatusMaintParams.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#acctStatusMaint_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#acctStatusMaint_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#acctStatusMaint_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#acctStatusMaint_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#acctStatusMaint_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#acctStatusMaint_idNumber").attr("validator","id_isPermanentReside")
 			};
 			
 		});
    	
		$scope.acctStatusMaintParams ={
				idNumber :"",
				externalIdentificationNo :"",
				idType:''
		}
		
		$scope.customerInfo = {
				mainCustomerCode :"",
				customerName :"",
				credentialNumber:""
		};
		
		
		//核算状态  =====从库表获取
		$scope.accountingStatusArr ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
		    };
		
		
		//重置
		$scope.reset  = function() {
			$scope.acctStatusMaintParams.idNumber = '';
			$scope.acctStatusMaintParams.externalIdentificationNo = '';
			$scope.acctStatusMaintParams.idType= '';
			$scope.acctStatusMaintParams.customerNo= '';
			
			$scope.isShowCstDiv = false;
			$('#acctStatusMaint_idNumber').attr('validator','noValidator');
			$('#acctStatusMaint_idNumber').removeClass('waringform');			
		};
		
		
		//查询客户信息
		$scope.queryCstInf  = function(transData) {
			
		};
		//客户媒介列表
		$scope.cstMdmInfTable = {
			autoQuery:false,
			checkType : 'radio',
			params : {
					"pageSize":10,
					"indexNo":0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accStatusMaint.queryList',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_delinquencyLevel'],//查找数据字典所需参数
			transDict : ['delinquencyLevel_delinquencyLevelDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					if(data.returnData == null || data.returnData == undefined ){
						data.returnData = {
								rows:[]
						};
					}
					
				}
			}
		};

		//查询执行函数
	
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
						$scope.customerInfo.mainCustomerCode = data.returnData.rows[0].customerNo;
						$scope.customerInfo.idType = data.returnData.rows[0].idType;
						$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
						$scope.customerInfo.customerNo = data.returnData.rows[0].customerNo;
						
						$scope.cstMdmInfTable.params.idNumber = $scope.acctStatusMaintParams.idNumber;
						$scope.cstMdmInfTable.params.idType = $scope.acctStatusMaintParams.idType;
						$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.acctStatusMaintParams.externalIdentificationNo;
						$scope.cstMdmInfTable.params.accountingStatus =  $scope.acctStatusMaintParams.accountingStatus;
						$scope.cstMdmInfTable.search();
						$scope.isShowCstDiv = true;
					}else {
						jfLayer.alert(T.T('KHJ400002'));//"抱歉，不存在此客户！"
						$scope.isShowCstDiv = false;
					}
				}else {
					$scope.isShowCstDiv = false;
				}
			});
			
			
		};
		
		
		//查询媒介
		$scope.queryList = function() {
			$scope.params = {
					idNumber :$scope.acctStatusMaintParams.idNumber,
					externalIdentificationNo :$scope.acctStatusMaintParams.externalIdentificationNo,
					idType: $scope.acctStatusMaintParams.idType,
					//accountingStatus : $scope.acctStatusMaintParams.accountingStatus
			};
			
			if( ($scope.acctStatusMaintParams.idType == null || $scope.acctStatusMaintParams.idType == ''|| $scope.acctStatusMaintParams.idType == undefined) &&
					($scope.acctStatusMaintParams.customerNo == null || $scope.acctStatusMaintParams.customerNo == ''|| $scope.acctStatusMaintParams.customerNo == undefined) &&
					($scope.acctStatusMaintParams["idNumber"] == null || $scope.acctStatusMaintParams["idNumber"] == undefined || $scope.acctStatusMaintParams["idNumber"] == '')&&
				($scope.acctStatusMaintParams.externalIdentificationNo=="" ||  $scope.acctStatusMaintParams.externalIdentificationNo == undefined)){
				jfLayer.alert(T.T('F00076'));//"请输入身份证号外部识别号其中一个！"
			}else {
				if($scope.acctStatusMaintParams["idType"]){
					if($scope.acctStatusMaintParams["idNumber"] == null || $scope.acctStatusMaintParams["idNumber"] == undefined || $scope.acctStatusMaintParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.params);
					}
				}else if($scope.acctStatusMaintParams["idNumber"]){
					if($scope.acctStatusMaintParams["idType"] != null || $scope.acctStatusMaintParams["idType"] != undefined || $scope.acctStatusMaintParams["idType"] != ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.params);
					}
				}else {
					$scope.searchHandlee($scope.params);
				}
			}
			
		}
		
		
		//核算状态维护 弹窗
		$scope.updateAccStatusBtn = function(item){
			// 页面弹出框事件(弹出页面)
			$scope.accStatusInf = $.parseJSON(JSON.stringify(item));
			$scope.accStatusInf.idType = $scope.acctStatusMaintParams.idType;
			$scope.accStatusInf.idNumber = $scope.acctStatusMaintParams.idNumber;
			$scope.accStatusInf.externalIdentificationNo = $scope.acctStatusMaintParams.externalIdentificationNo;
			$scope.modal('/cstSvc/baseBsnPcsg/layerAccStatusMaint.html', $scope.accStatusInf, {
				title : T.T('YYJ5000013'),
				buttons : [ T.T('F00107'),T.T('F00108')],
				size : [ '1050px', '500px'  ],
				callbacks : [$scope.accStatusSure]
			});
			
			
		};
		
		
		//核算状态维护
		$scope.accStatusSure = function(result) {
			
			$scope.accStatusInf = result.scope.accStatusInf;
			
			$scope.accStatusParam = $scope.accStatusInf;
			
			$scope.addParams = {
					 ecommCustId: $scope.accStatusInf.customerNo,
					 ecommOperMode : $scope.operationMode,
					 ecommDelinquencyLevel: $scope.accStatusInf.delinquencyLevel,
					 ecommDelinquencyLevelCode: $scope.accStatusInf.levelCode,
					 ecommCheckStatusCode: $scope.accStatusInf.oldAccountingStatus,
					 ecommTransCurr:  $scope.accStatusInf.currencyCode,
					 ecommProdObjId : $scope.accStatusInf.productObjectNo,
//					 ecommToBeCheckStatusCode: $scope.accStatusInf.newAccountingStatus1,
			};
			
			$scope.accStatusParam = $.extend($scope.accStatusParam, $scope.addParams);
			
			if($scope.accStatusInf.newAccountingStatus1){
				
				$scope.accStatusParam.ecommToBeCheckStatusCode = $scope.accStatusInf.newAccountingStatus1;
			};
			
			if($scope.accStatusInf.newAccountingStatus2){
				
				$scope.accStatusParam.ecommToBeCheckStatusCode = $scope.accStatusInf.newAccountingStatus2;
			};
			
			
			jfRest.request('acctStatusMaint', 'update', $scope.accStatusParam ).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.isShowCstDiv = true;
					
					$scope.safeApply();
					result.cancel();
					
					$scope.cstMdmInfTable.params.idNumber = $scope.acctStatusMaintParams.idNumber;
					$scope.cstMdmInfTable.params.idType = $scope.acctStatusMaintParams.idType;
					$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.acctStatusMaintParams.externalIdentificationNo;
					//$scope.cstMdmInfTable.params.accountingStatus =  $scope.acctStatusMaintParams.accountingStatus;
					$scope.cstMdmInfTable.search();
					
				}else{
					$scope.isShowCstDiv = false;
				}
			});
		};
		
	});
	
	
	
	//核算状态弹窗
	webApp.controller('layerAccStatusMaintCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	
		$scope.accStatusInf = $scope.accStatusInf;
		//核算状态  =====从库表获取
		$scope.oldAccountingStatusArr ={ 
				type:"dynamicDesc", 
		        param:{Flag:'Y'},//默认查询条件 
		        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
		        desc: "accountingDesc", 
		        resource:"accountingStatus.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.accStatusInf.oldAccountingStatus = $scope.accStatusInf.accountingStatusCode;
		        }
		    };
		
		 //前续
		if(($scope.accStatusInf.prevAccountingStatus!= "" ||  $scope.accStatusInf.prevAccountingStatus!= null)&& ($scope.accStatusInf.nextAccountingStatus == '' || $scope.accStatusInf.nextAccountingStatus == null)){//只有前续核算状态
				 $scope.newStatusDiv1 = true;
        		 $scope.newStatusDiv2 = false;
        		 
        		 var option1 = $("<option value = "+$scope.accStatusInf.prevAccountingStatus+">"+$scope.accStatusInf.prevAccountingStatus+""+$scope.accStatusInf.prevAccountingStatusDesc+"</option>"); 
        		 $("#newAccountingStatus1").append(option1); 
			
		}else if(($scope.accStatusInf.nextAccountingStatus != "" || $scope.accStatusInf.nextAccountingStatus != null) && ($scope.accStatusInf.prevAccountingStatus == '' || $scope.accStatusInf.prevAccountingStatus == null)){//只有后续核算状态
			 //后续
				 
				 $scope.newStatusDiv1 = true;
        		 $scope.newStatusDiv2 = false;
        		 
        		 var option1 = $("<option value = "+$scope.accStatusInf.nextAccountingStatus+">"+$scope.accStatusInf.nextAccountingStatus+""+$scope.accStatusInf.nextAccountingStatusDesc+"</option>"); 
        		 $("#newAccountingStatus1").append(option1); 
			 
		 }else {//前续后续都有
			 
					
			 $scope.newStatusDiv1 = false;
			 $scope.newStatusDiv2 = true;
			 $scope.newAccountingStatusArr = {};
			 
			 if($scope.accStatusInf.prevAccountingStatus && $scope.accStatusInf.nextAccountingStatus){
				 
				var option1 = $("<option value = "+$scope.accStatusInf.prevAccountingStatus+">"+$scope.accStatusInf.prevAccountingStatus+""+$scope.accStatusInf.prevAccountingStatusDesc+"</option>");
				var option2 = $("<option value = "+$scope.accStatusInf.nextAccountingStatus+">"+$scope.accStatusInf.nextAccountingStatus+""+$scope.accStatusInf.nextAccountingStatusDesc+"</option>");
					 
				$("#newAccountingStatus2").append(option1).append(option2); 
				 
			 };
			 
			 
		 };
		
		 
		 
		 var form = layui.form;
	 		form.on('select(getProObjCodeNew)',function(event){
	 			jfRest.request('proObject', 'query', {operationMode:$scope.proLiftingInf.operationMode})//Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					
					if (data.returnCode == '000000') {
						if(data.returnData){
							if(data.returnData.rows){
								
								for(var i = 0; i < data.returnData.rows.length ; i++){
									
									if(event.value == data.returnData.rows[i].productObjectCode){
										 $scope.proLiftingInf.binNoNew = data.returnData.rows[i].binNo;
										
									}
									
								};
								
								
							}
						}
						
					}
					
				});
	 			
	 		});
		 
		
	
	});
	
});
