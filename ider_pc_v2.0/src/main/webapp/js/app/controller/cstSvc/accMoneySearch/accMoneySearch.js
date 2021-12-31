'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易类活动日志查询
webApp.controller('accMoneySearch',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
	$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
	$translate.refresh();
	$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.isShowRelation = false;
		$scope.isShowSameSource = false;
		$scope.isShowPosting = false;
		$scope.ectypeArray = [{name : T.T('KHJ1800017'),id : '0'},{name : T.T('KHJ1800018'),id : '1'}];
		$scope.hide_transQuery ={};
		$scope.isShowMoneyType = false;
		$scope.isStartDate = false;
		$scope.isEndDate = false;
		$scope.ExternalIdentificationNo = '';
		$scope.businessProgramNo = '';
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#LAY_demorange_zs',
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
					}
				});
				var endDate = laydate.render({
					elem: '#LAY_demorange_ze',
					//min:Date.now(),
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						}
					}
				});
		});
		//日期控件end
		//搜索身份证类型
		$scope.certificateTypeArray1 =[ {name : T.T('F00113'),id : '1'},//身份证
                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
                                		{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
                                		{name : T.T('F00119'),id : '0'}  ];	//其他
	//联动验证
	var form = layui.form;
	form.on('select(getIdType)',function(data){
		$scope.txnCgyAvyLogEnqrTable.params.idNumber = '';
		if(data.value == "1"){//身份证
			$("#transQuery_idNumber").attr("validator","id_idcard");
		}else if(data.value == "2"){//港澳居民来往内地通行证
			$("#transQuery_idNumber").attr("validator","id_isHKCard");
		}else if(data.value == "3"){//台湾居民来往内地通行证
			$("#transQuery_idNumber").attr("validator","id_isTWCard");
		}else if(data.value == "4"){//中国护照
			$("#transQuery_idNumber").attr("validator","id_passport");
		}else if(data.value == "5"){//外国护照passport
			$("#transQuery_idNumber").attr("validator","id_passport");
		}else if(data.value == "6"){//外国人永久居留证
			$("#transQuery_idNumber").attr("validator","id_isPermanentReside");
        }
    });
	form.on('select(getBusinessProgramNo)',function(event){
		$scope.queryDateParams = {
				idType: $scope.txnCgyAvyLogEnqrTable.params.idType,
				idNumber: $scope.txnCgyAvyLogEnqrTable.params.idNumber,
				externalIdentificationNo: $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
				queryDate:true,
				businessProgramNo:event.value
		};
		jfRest.request('unsettledList', 'query', $scope.queryDateParams).then(function(data) {
			if(data.returnCode == '000000'){
				if(data.returnData.obj){
					$scope.isShowDate = true;
					$scope.txnCgyAvyLogEnqrTable.params.startDate = data.returnData.obj.startDate;
					$scope.txnCgyAvyLogEnqrTable.params.endDate = data.returnData.obj.endDate;
                }
            }
		});
	});
	$scope.queryDate = function(params){
		jfRest.request('unsettledList', 'query', params).then(function(data) {
			if(data.returnCode == '000000'){
				if(data.returnData.obj){
					$scope.isShowDate = true;
					$scope.txnCgyAvyLogEnqrTable.params.startDate = data.returnData.obj.startDate;
					$scope.txnCgyAvyLogEnqrTable.params.endDate = data.returnData.obj.endDate;
                }
            }
		});
	};
	$scope.reset = function(){
		$scope.txnCgyAvyLogEnqrTable.params.idNumber = '';
		$scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo = '';
		//$scope.txnCgyAvyLogEnqrTable.params.startDate = '';
		//$scope.txnCgyAvyLogEnqrTable.params.endDate = '';
		$scope.txnCgyAvyLogEnqrTable.params.idType= '';
		$scope.txnCgyAvyLogEnqrTable.params.customerNo= '';
		$scope.isShowRelation = false;
		$scope.isShowSameSource = false;
		$scope.isShowPosting = false;
		$scope.	isShowDetail = false;
		$scope.isShowMoneyType = false;
		$scope.isStartDate = false;
		$scope.isEndDate = false;
		$scope.isShowDate = false;
	};
	$scope.queryAccountInf = function() {
		$scope.isShowDetail = false;
		$scope.isShowRelation = false;
		$scope.isShowSameSource = false;
		$scope.isShowPosting = false;
		$scope.isShowDate = false;
		$scope.changeType.currencyCode = '';
		$scope.changeType.businessProgramNo = '';
		if (($scope.txnCgyAvyLogEnqrTable.params.idType == null || $scope.txnCgyAvyLogEnqrTable.params.idType == ''|| $scope.txnCgyAvyLogEnqrTable.params.idType == undefined) &&
				($scope.txnCgyAvyLogEnqrTable.params.customerNo == null || $scope.txnCgyAvyLogEnqrTable.params.customerNo == ''|| $scope.txnCgyAvyLogEnqrTable.params.customerNo == undefined) &&
				($scope.txnCgyAvyLogEnqrTable.params.idNumber == "" || $scope.txnCgyAvyLogEnqrTable.params.idNumber == undefined)
				&& ($scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo == "" || $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo == undefined)) {
			jfLayer.alert(T.T('KHJ900001'));//"请输入任意查询条件！"
		} 
		else {
			if($scope.txnCgyAvyLogEnqrTable.params["idType"]){
				if($scope.txnCgyAvyLogEnqrTable.params["idNumber"] == null || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == ''){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					$scope.isShowRelation = false;
					$scope.isShowSameSource = false;
					$scope.isShowPosting = false;
					$scope.	isShowDetail = false;
					$scope.isShowDate = false;
				}else {
					// $scope.queryCurr($scope.txnCgyAvyLogEnqrTable.params);//查询币种
					// $scope.txnCgyAvyLogEnqrTable.search();
					
					$scope.queryCuur() // 查询币种和业务项目
				}
			}else if($scope.txnCgyAvyLogEnqrTable.params["idNumber"]){
				if($scope.txnCgyAvyLogEnqrTable.params["idType"] == null || $scope.txnCgyAvyLogEnqrTable.params["idType"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idType"] == ''){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					$scope.isShowRelation = false;
					$scope.isShowSameSource = false;
					$scope.isShowPosting = false;
					$scope.	isShowDetail = false;
					$scope.isShowDate = false;
				}else {
					// $scope.queryCurr($scope.txnCgyAvyLogEnqrTable.params);//查询币种
					// $scope.txnCgyAvyLogEnqrTable.search();
					
					$scope.queryCuur() // 查询币种和业务项目
				}
			}else {
				// $scope.queryCurr($scope.txnCgyAvyLogEnqrTable.params);//查询币种
				// $scope.txnCgyAvyLogEnqrTable.search();
				
				$scope.queryCuur() // 查询币种和业务项目
			}
		}
	};
	
	
	
	
	
	// 查询币种 
	$scope.changeType = {}
	$scope.moneyType ={};
	$scope.queryCuur = function() {
		$scope.moneyType ={
			type:"dynamic", 
			param:{
				externalIdentificationNo: $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo
			},
			text:"currencyName", //下拉框显示内容，根据需要修改字段名称 
			value:'currencyCode',  //下拉框对应文本的值，根据需要修改字段名称 
			resource:"unsettledList.query",//数据源调用的action 
			callback : function(data) {
				//console.log(data);、
				$scope.isShowMoneyType = true
				$scope.queryBusPro() //查询业务项目 
				
			}
		};
	};
	// 查询业务项目
	$scope.businessProgramNArr = {};
	$scope.queryBusPro = function() {
		$scope.businessProgramNArr ={
			type:"dynamic", 
			param:{
					queryBusinessProgramNo : true,
					externalIdentificationNo: $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
				} ,//默认查询条件 
				text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称 
				value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称 
				resource:"unsettledList.query",//数据源调用的action 
				callback: function(data){
					if(data){
						if(data.length == 1 ){
							$scope.changeType.businessProgramNo = data[0].businessProgramNo;
							 // $scope.params = {
								// 	externalIdentificationNo: $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
								// 	queryDate:true,
								// 	businessProgramNo:data[0].businessProgramNo
							 // };
							 // $scope.queryDate($scope.params)
						}else {
							$scope.changeType.businessProgramNo = '';
						}
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : "操作失败";
						jfLayer.fail(returnMsg);
					}
				}
		};
	};
	// 查询未出账单 起始结束时间和列表
	// $scope.txnCgyAvyLogEnqrTable = {
	// 	params: {}
	// };
	$scope.txnCgyAvyLogEnqrTable = {
		params : {
			pageSize : 10,
			indexNo : 0,
		},
		paging : true,
		resource : 'unsettledList.query',
		autoQuery : false,
		callback : function(data) {
			if(data.returnCode == '000000'){
				$scope.isShowMoneyType = true;//显示币种切换的select
				$scope.isShowDetail = true
				$scope.isShowDate = true;
				//定义下拉框
				//如果总汇字段为空类型
				if(data.returnData.obj == null){
					$scope.txnCgyAvyLogEnqrTable.params.totalPostingAmount = '0';//金额
				 }else{
					$scope.txnCgyAvyLogEnqrTable.params.startDate = data.returnData.obj.startDate;
					$scope.txnCgyAvyLogEnqrTable.params.endDate = data.returnData.obj.endDate;
					$scope.txnCgyAvyLogEnqrTable.params.totalPostingAmount = data.returnData.obj.totalPostingAmount;//定义页面上的总汇展示
				}
				if(!data.returnData.rows || data.returnData.rows.length == 0){
					data.returnData.rows = [];
				}
			}
		}
	};
	$scope.queryDateAndList = function() {
		$scope.txnCgyAvyLogEnqrTable.params.businessProgramNo = $scope.changeType.businessProgramNo
		$scope.txnCgyAvyLogEnqrTable.params.currencyCode = $scope.changeType.currencyCode
		$scope.txnCgyAvyLogEnqrTable.params.queryDate = true
		$scope.txnCgyAvyLogEnqrTable.search()
	};
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		$scope.queryAccountInf1 = function() {
			$scope.queryDateAndList() // 查询起始结束时间和未出账单列表
			// $scope.txnCgyAvyLogEnqrTable.search()
			// if (($scope.txnCgyAvyLogEnqrTable.params.idType == null || $scope.txnCgyAvyLogEnqrTable.params.idType == ''|| $scope.txnCgyAvyLogEnqrTable.params.idType == undefined) &&
			// 		($scope.txnCgyAvyLogEnqrTable.params.customerNo == null || $scope.txnCgyAvyLogEnqrTable.params.customerNo == ''|| $scope.txnCgyAvyLogEnqrTable.params.customerNo == undefined) &&
			// 		($scope.txnCgyAvyLogEnqrTable.params.idNumber == "" || $scope.txnCgyAvyLogEnqrTable.params.idNumber == undefined)
			// 		&& ($scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo == "" || $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo == undefined)) {
			// 	jfLayer.alert(T.T('KHJ900001'));//"请输入任意查询条件！"
			// } 
			// else {
			// 	if($scope.txnCgyAvyLogEnqrTable.params["idType"]&&($scope.txnCgyAvyLogEnqrTable.params["idNumber"] == null || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idNumber"] == '')){
			// 			jfLayer.alert(T.T('F00110'));//'请核对证件号码'
			// 			$scope.isShowRelation = false;
			// 			$scope.isShowSameSource = false;
			// 			$scope.isShowPosting = false;
			// 			$scope.	isShowDetail = false;
			// 			$scope.isShowDate = false;
			// 			return;
			// 	}else if($scope.txnCgyAvyLogEnqrTable.params["idNumber"]&&($scope.txnCgyAvyLogEnqrTable.params["idType"] == null || $scope.txnCgyAvyLogEnqrTable.params["idType"] == undefined || $scope.txnCgyAvyLogEnqrTable.params["idType"] == '')){
			// 			jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
			// 			$scope.isShowRelation = false;
			// 			$scope.isShowSameSource = false;
			// 			$scope.isShowPosting = false;
			// 			$scope.	isShowDetail = false;
			// 			$scope.isShowDate = false;
			// 			return;
			// 	}
			// 	if($scope.changeType.currencyCode == null || $scope.changeType.currencyCode == undefined || $scope.changeType.currencyCode == ''){
			// 		jfLayer.alert(T.T('KHJ1800021'));
			// 		return;
			// 	}
			// 	if($scope.changeType.businessProgramNo == null || $scope.changeType.businessProgramNo == undefined || $scope.changeType.businessProgramNo == ''){
			// 		jfLayer.alert(T.T('KHJ1800022'));
			// 		return;
			// 	}
			// 	$scope.txnCgyAvyLogEnqrTable.params.businessProgramNo = $scope.changeType.businessProgramNo;
			// 	$scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo = $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo;
			// 	$scope.txnCgyAvyLogEnqrTable.params.idType = $scope.txnCgyAvyLogEnqrTable.params.idType;
			// 	$scope.txnCgyAvyLogEnqrTable.params.idNumber = $scope.txnCgyAvyLogEnqrTable.params.idNumber;
			// 	$scope.txnCgyAvyLogEnqrTable.params.currencyCode = $scope.changeType.currencyCode;
			// 	$scope.txnCgyAvyLogEnqrTable.search();
			// 	$scope.isShowDetail = true;
			// 	$scope.isStartDate = true;
			// 	$scope.isEndDate = true;
			// 	$scope.isShowDate = true;	
			// }
		};
		
		
		
		//定义显示业务项目需要传递的参数
		// $scope.changeType = {
		// 	"queryBusinessProgramNo":true
		// };
		// $scope.txnCgyAvyLogEnqrTable = {				
		// 	params : {	
		// 		 businessProgramNo:$scope.changeType.businessProgramNo,
		// 		 /*externalIdentificationNo:$scope.moneyType.param.externalIdentificationNo,
		// 		 currencyCode:$scope.changeType.currencyCode*/
		// 	},
		// 	paging : true,
		// 	resource : 'unsettledList.query',
		// 	autoQuery : false,
		// 	callback : function(data) {
		// 		if(data.returnCode == '000000'){
		// 			$scope.isShowMoneyType = true;//显示币种切换的select					
		// 			//定义下拉框
		// 			//如果总汇字段为空类型
  //                   if(data.returnData.obj == null){
  //                   	$scope.txnCgyAvyLogEnqrTable.params.totalPostingAmount = '0';//金额
  //               	 }else{
  //                       $scope.txnCgyAvyLogEnqrTable.params.totalPostingAmount = data.returnData.obj.totalPostingAmount;//定义页面上的总汇展示
  //                   }
		// 			if(!data.returnData.rows || data.returnData.rows.length == 0){
		// 				data.returnData.rows = [];
		// 			}
		// 			//$scope.isShowDetail = false;
		// 		}
		// 	}
		// };
		// //查询币种
		// $scope.moneyType ={};	
		// $scope.queryCurr = function(params){
		// 	$scope.moneyType ={ 
		// 	        type:"dynamic", 
		// 	        param:{
		// 	        	externalIdentificationNo: params.externalIdentificationNo,
		// 	        	idType: params.idType,
		// 	        	idNumber: params.idNumber,
		// 	        },
		// 	        text:"currencyName", //下拉框显示内容，根据需要修改字段名称 
		// 	        value:'currencyCode',  //下拉框对应文本的值，根据需要修改字段名称 
		// 	        resource:"unsettledList.query",//数据源调用的action 
		// 	        callback : function(data) {
		// 	        	//console.log(data);
		// 	        }
		//     };
		// };
		// //查下业务项目
		// $scope.businessProgramNArr = {};
		// $scope.querybusinessProgram = function(params){
		// 	$scope.businessProgramNArr ={ 
		//         type:"dynamic", 
		//         param:{
		//         		queryBusinessProgramNo : true,
		//         		externalIdentificationNo: params.externalIdentificationNo,//默认查询条件 
		//         		idType: params.idType,
		// 	        	idNumber: params.idNumber,
		//         	} ,//默认查询条件 
		// 	        text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称 
		// 	        value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称 
		// 	        resource:"unsettledList.query",//数据源调用的action 
		// 	        callback: function(data){
		// 	        	if(data){
		// 	        		if(data.length == 1 ){
	 //        					 $scope.changeType.businessProgramNo = data[0].businessProgramNo;
	 //        					 $scope.params = {
	 //        							 idType: $scope.txnCgyAvyLogEnqrTable.params.idType,
  //       								idNumber: $scope.txnCgyAvyLogEnqrTable.params.idNumber,
  //       								externalIdentificationNo: $scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
  //       								queryDate:true,
  //       								businessProgramNo:data[0].businessProgramNo
	 //        					 };
	 //        					 $scope.queryDate($scope.params)
	 //        				}else {
	 //        					$scope.changeType.businessProgramNo = '';
	 //        				}
	 //        			}else {
		// 	        		var returnMsg = data.returnMsg ? data.returnMsg : "操作失败";
		//         			jfLayer.fail(returnMsg);
		// 	        	}
		// 	        }
		// 	};
		// };
		// var form = layui.form;
		// form.on('select(getMoneyType)',function(event){
		// 	if(event.value != '' && event.value != null){
		// 		$scope.querybusinessProgram($scope.txnCgyAvyLogEnqrTable.params);//查下业务项目
		// 	}else {
		// 		$scope.changeType.businessProgramNo = '';
		// 	}
		// });
		
		
		
		
		
		
		
		// 关联交易列表
		$scope.queryRelativeTrans = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = false;
			$scope.transRelativeParams = $.parseJSON(JSON
					.stringify(event));
			$scope.relativeTransTable.params = {
				"globalSerialNumbr" : $scope.transRelativeParams.globalSerialNumbrRelative
			};
			$scope.relativeTransTable.params = $.extend($scope.relativeTransTable.params, $scope.hide_transQuery);
			$scope.relativeTransTable.search();
		};
		$scope.relativeTransTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : false,
			callback : function(data) {
			}
		};
		// 同源交易列表
		$scope.querySameSourceTrans = function(event) {
			$scope.isShowRelation = false;
			$scope.isShowSameSource = true;
			$scope.isShowPosting = false;
			$scope.transSameSourceParams = $.parseJSON(JSON
					.stringify(event));
			$scope.sameSourceTransTable.params = {
				"globalSerialNumbr" : $scope.transSameSourceParams.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "1",
				"idNumber":$scope.txnCgyAvyLogEnqrTable.params.idNumber,
				"externalIdentificationNo":$scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
				"idType":$scope.txnCgyAvyLogEnqrTable.params.idType
			};
			$scope.sameSourceTransTable.params = $.extend($scope.sameSourceTransTable.params, $scope.hide_transQuery);
			$scope.sameSourceTransTable.search();
		};
		$scope.sameSourceTransTable = {
			params : {},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : false,
			callback : function(data) {
			}
		};
		// 入账情况列表,查询余额类型入账情况
		$scope.queryPostingInfo = function(event) {
			$scope.isShowRelation = false;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = true;
			$scope.transPostingParams = $.parseJSON(JSON
					.stringify(event));
			$scope.postingInfoTable.params = {
					"globalSerialNumbr" : $scope.transPostingParams.globalSerialNumbr,
					"accountId" : $scope.transPostingParams.accountId,
					"currencyCode" : $scope.transPostingParams.currencyCode,
					"logLevel" : "T",
					"idNumber":$scope.txnCgyAvyLogEnqrTable.params.idNumber,
					"externalIdentificationNo":$scope.txnCgyAvyLogEnqrTable.params.externalIdentificationNo,
					"idType":$scope.txnCgyAvyLogEnqrTable.params.idType
			};
			$scope.postingInfoTable.params = $.extend($scope.postingInfoTable.params, $scope.hide_transQuery);
			$scope.postingInfoTable.search();
		};
		$scope.postingInfoTable = {
			params : {
				pageSize: 10,
				indexNo: 0
			},
			autoQuery : false,
			paging : true,
			resource : 'finacialTrans.query',
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_balanceType'],//查找数据字典所需参数
			transDict : ['balanceType_balanceTypeDesc'],//翻译前后key
			callback : function(data) {
			}
		};
		// 关联交易列表中的同源交易按钮
		$scope.querySameSourceTrans2 = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = true;
			$scope.isShowPosting = false;
			$scope.transSameSourceParams2 = $.parseJSON(JSON
					.stringify(event));
			$scope.sameSourceTransTable.params = {
				"globalSerialNumbr" : $scope.transSameSourceParams2.globalSerialNumbr,
				"eventNo" : $scope.transSameSourceParams2.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010",
				"queryType" : "1"
			};
			$scope.sameSourceTransTable.params = $.extend($scope.sameSourceTransTable.params, $scope.hide_transQuery);
			$scope.sameSourceTransTable.search();
		};
		// 关联交易列表中的入账情况按钮
		$scope.queryPostingInfo2 = function(event) {
			$scope.isShowRelation = true;
			$scope.isShowSameSource = false;
			$scope.isShowPosting = true;
			$scope.transPostingParams2 = $.parseJSON(JSON
					.stringify(event));
			$scope.postingInfoTable.params = {
					"globalSerialNumbr" : $scope.transPostingParams2.globalSerialNumbr,
					"accountId" : $scope.transPostingParams2.accountId,
					"currencyCode" : $scope.transPostingParams2.currencyCode,
					"logLevel" : "T"
			};
			$scope.postingInfoTable.params = $.extend($scope.postingInfoTable.params, $scope.hide_transQuery);
			$scope.postingInfoTable.search();
		};
		// 余额单元入账情况查询
		$scope.queryBalUnitInfo = function(event) {
			$scope.balUnitPostingParams = $.parseJSON(JSON.stringify(event));
			$scope.balUnitPostingParams = $.extend($scope.balUnitPostingParams, $scope.hide_transQuery);
			$scope.modal('/cstSvc/txnInfEnqr/balUnitPostingInfo.html',
				$scope.balUnitPostingParams, {
					title : T.T('KHJ1800002'),
					buttons : [ T.T('F00012') ],
					size : [ '1100px', '550px' ],
					callbacks : []
				});
		};
		// 页面弹出框事件(弹出页面)
		$scope.checkInfo = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.transDetailInfo = $.extend($scope.transDetailInfo, $scope.hide_transQuery);
			$scope.modal(
				'/cstSvc/txnInfEnqr/finaciTransDetailInfoAcc.html',
				$scope.transDetailInfo, {
					title : T.T('KHJ1800003'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '660px' ],
					callbacks : []
				});
		};
	});
//交易分期
webApp.controller('transStageCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_deleteBlockCode');
	$translate.refresh();
	$scope.ectypeArray ={ 
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
			}
		};
		$scope.termArr ={ 
			type:"dictData", 
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_stageTerm",
				queryFlag: "children"
			},//默认查询条件 
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action 
			callback: function(data){
			}
		};
//	$scope.ectypeArray = [{name : T.T('KHJ1800017'),id : '0'},{name : T.T('KHJ1800018'),id : '1'}];
/*	  *//** 账户代码 *//*
    private String accountId;
    *//** 余额对象代码 *//*
    private String balanceObjectCode;
    *//** 入账币种 *//*
    private String postingCurrencyCode;
    *//** 入账日期 *//*
    private String occurrDate;
    *//** 入账金额 *//*
    private BigDecimal postingAmount;*/
	//获得可分期最大金额
	$scope.paramss = {
			idType: $scope.stageInf.idType,
			idNumber: $scope.stageInf.idNumber,
			externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
			accountId: $scope.stageInf.accountId,
			balanceObjectCode: $scope.stageInf.balanceObjectCode,
			postingCurrencyCode: $scope.stageInf.postingCurrencyCode,
			occurrDate: $scope.stageInf.occurrDate,
			postingAmount: $scope.stageInf.postingAmount,
			customerNo:$scope.stageInf.customerNo,
		//	businessProgramNo: $scope.stageInf.businessProgramNo,
		//	businessProgramNo: 'MODG00020',
			businessTypeCode: $scope.stageInf.businessTypeCode,
			ecommOrigGlobalSerialNumbr : $scope.stageInf.globalSerialNumbr,
	};
	//Tansun.param($scope.pDCfgInfo)
	jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.paramss).then(function(data) {
		if(data.returnCode == '000000'){
			$scope.stageInf.billAmt = data.returnData.billAmt;
		}
	});
//	$scope.termArr =[{name: T.T('KHJ1800004'),id:"3"},{name: T.T('KHJ1800005'),id:"6"},{name: T.T('KHJ1800006'),id:"9"},{name: T.T('KHJ1800007'),id:"12"},{name: T.T('KHJ1800009'),id:"24"}]
	if($scope.stageInf.currencyCode == "156"){
		$scope.stageInf.currencyCodeTrans = T.T('KHJ1800009');
	}else if($scope.stageInf.currencyCode == "840"){
		$scope.stageInf.currencyCodeTrans = T.T('KHJ1800010');
	}
	//账单分期列表
	$scope.billStageInfoList = {
		autoQuery:false,
		params : {
				"pageSize":10,
				"indexNo":0
		}, // 表格查询时的参数信息
		paging : true,// 默认true,是否分页
		resource : 'billingInfoEnqr.stageTrial',// 列表的资源
		callback : function(data) { // 表格查询后的回调函数
			console.log(data);
			if (data.returnCode == '000000') {
				$scope.isShowStageResultInfo = true; //分期试算结果
				//$scope.stageInf.accountId =  data.returnData.obj.accountId;
				$scope.stageInf.customerNo =  data.returnData.obj.ecommCustId;
				$scope.stageInf.ecommBusineseType = data.returnData.obj.ecommBusineseType;
				$scope.stageInf.loanAmt = data.returnData.obj.loanAmt;
				$scope.stageInf.feeRate = data.returnData.obj.feeRate;
				$scope.stageInf.allFeeAmt = data.returnData.obj.allFeeAmt;
				$scope.stageInf.ecommCustId =  data.returnData.obj.ecommCustId;
				$scope.stageInf.loanRate = data.returnData.obj.loanRate;
			}
		}
	};
	//分期试算
	$scope.stageTrial = function() {
		if($scope.stageInf.billAmt <  Number($scope.stageInf.loanAmt) ){
			jfLayer.alert(T.T('KHJ1800011'));
			return;
        }
        if($scope.stageInf.term  == '' || $scope.stageInf.term  == undefined || $scope.stageInf.term  == null ){
			jfLayer.alert(T.T('KHJ1800012'));
			return;
        }
        $scope.isShowStageResultInfo = true;
		$scope.trialParams= {
				idType: $scope.stageInf.idType,
				idNumber: $scope.stageInf.idNumber,
				externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
				ecommEntryId:$scope.stageInf.externalIdentificationNo,
				ecommFeeCollectType:$scope.stageInf.ecommFeeCollectType,
				ecommBusinessProgramCode: $scope.stageInf.businessProgramNo,// 业务项目
				ecommBusineseType: $scope.stageInf.businessTypeCode,
				ecommProdObjId:  $scope.stageInf.productObjectCode,
				ecommCustId: $scope.stageInf.customerNo,
				ecommTransPostingCurr: $scope.stageInf.currencyCode,//币种
				ecommInstallmentPeriod: $scope.stageInf.term,
				ecommTransAmount :$scope.stageInf.loanAmt,
				ecommInstallmentBusinessType: 'STMT',
				ecommPostingAcctNmbr :$scope.stageInf.accountId
		};
		$scope.billStageInfoList.params = $scope.trialParams;
		$scope.billStageInfoList.search();
	};
});
webApp.controller('balUnitPostingQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.balUnitInfoTable = {
			params : {
				"idType" : $scope.balUnitPostingParams.idType,
				"idNumber" : $scope.balUnitPostingParams.idNumber,
				"externalIdentificationNo" : $scope.balUnitPostingParams.externalIdentificationNo,
				"globalSerialNumbr" : $scope.balUnitPostingParams.globalSerialNumbr,
				"accountId" : $scope.balUnitPostingParams.accountId,
				"currencyCode" : $scope.balUnitPostingParams.currencyCode,
				"logLevel" : "B",
				"queryType" : "4",
				"balanceType":$scope.balUnitPostingParams.balanceType
			},
			paging : true,
			resource : 'finacialTrans.query',
			autoQuery : true,
			isTrans: true,
			transParams: ['dic_balanceType'],
			transDict: ['balanceType_balanceTypeDesc'],
			callback : function(data) {
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.checkInfoModal = function(event) {
			$scope.transDetailInfo = $.parseJSON(JSON.stringify(event));
			//不建议直接追加参数，会覆盖参数，需要谁，单独加
			//$scope.transDetailInfo = $.extend($scope.transDetailInfo, $scope.balUnitPostingParams);
			$scope.modal('/cstSvc/txnInfEnqr/finaciTransDetailInfo.html',
				$scope.transDetailInfo, {
					title : T.T('KHJ1800003'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '660px' ],
					callbacks : []
				});
		};
	});
	webApp.controller('transDetailAccCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		console.log($scope.transDetailInfo);
		$scope.ectypeArray = [{name : T.T('KHJ1800017'),id : '0'},{name : T.T('KHJ1800018'),id : '1'}];
		// 退货
		$scope.returnedPurchase = function(e) {
			var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//分期账户信息查询
		$scope.stagingAccInfoBtn = function(event){
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/stagingAccInfoLayer.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
		//部分退货按钮
		$scope.partReturnedPurchase = function(e){
			$scope.e = e;
			$scope.modal('/cstSvc/txnInfEnqr/layerPartReturned.html',
					$scope.e, {
					title :  T.T('F00191'),
					buttons : [ T.T('F00191'),T.T('F00012') ],
					size : [ '1100px', '300px' ],
					callbacks : [$scope.surePartReturned]
				});
		};
		//确定部分退货
		$scope.surePartReturned = function(result){
			var e = result.scope.e;
			//部分退货金额
			$scope.ecommTransPostingAmount = result.scope.partReturnedInf.ecommTransPostingAmount;
			//输入退货金额+已退货金额 小于等于 退货金额
			if($scope.transDetailInfo.rejectedAmount){
				$scope.transDetailInfo.rejectedAmount = $scope.transDetailInfo.rejectedAmount
			}else{
				$scope.transDetailInfo.rejectedAmount = 0;
            }
            $scope.flag = Number($scope.ecommTransPostingAmount)+Number($scope.transDetailInfo.rejectedAmount) <= $scope.transDetailInfo.actualPostingAmount ? true : false;
			if(!$scope.flag){
				jfLayer.alert(T.T('F00193'));
				return;
            }
            var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : $scope.ecommTransPostingAmount,
				"ecommTransDate" : $scope.ecommTransDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" :  e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				"ecommTransPostingAmount": $scope.ecommTransPostingAmount,
				ecommRejectStatus: 'PRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//争议登记
		$scope.disputeRegist = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommOrigTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo
			};
			jfRest.request('finacialTrans', 'disputeRegist', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800013'));
				} 
			});
		};
		//交易分期
		$scope.transStage = function(event){
			$scope.stageInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/layerTradeStage.html',
				$scope.stageInf, {
					title : T.T('KHJ1800014'),
					buttons : [ T.T('F00053'),T.T('F00012') ],
					size : [ '1100px', '550px' ],
					callbacks : [$scope.sureTransStage]
				});
		};
		//确认交易分期
		$scope.sureTransStage = function(result){
			$scope.item = result.scope.stageInf;
			$scope.params = {
					idType : $scope.item.idType,
					idNumber : $scope.item.idNumber,
					externalIdentificationNo: $scope.item.externalIdentificationNo,
					ecommEntryId:$scope.item.externalIdentificationNo,
					ecommFeeCollectType:$scope.stageInf.ecommFeeCollectType,
					ecommPostingAcctNmbr: $scope.item.accountId,
					ecommCustId: $scope.item.ecommCustId,//
					ecommTransPostingAmount: $scope.item.postingAmount,//入账金额
					ecommTransPostingCurr: $scope.item.postingCurrencyCode,//入账币种
					currBillFlag: '1',
					ecommSourceCde: 'L',
					ecommInstallmentPeriod: $scope.item.term,
					ecommOrigGlobalSerialNumbr: $scope.item.globalSerialNumbr
				};
			jfRest.request('finacialTrans', 'transStage', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ1800015'));
					$scope.safeApply();
 		  			 result.cancel();
				//	$scope.isShowBillingInfo = false;
	  		  	//	$scope.isShowbillStageInfo = false;//账单分期信息
	  		  		$scope.isShowStageResultInfo = false; //分期试算结果
				} 
			});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800019'));
				}
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank = function(e){
			$scope.params = {
					"idType" : e.idType,
					"idNumber" : e.idNumber,
					"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800020'));
				} 
			});
		};
	});
	//部分退货金额
	webApp.controller('layerPartReturnedCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.partReturnedInf = $scope.e;
	});
	//金融交易查看
	webApp.controller('transDetailCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.ectypeArray = [{name : T.T('KHJ1800017'),id : '0'},{name : T.T('KHJ1800018'),id : '1'}];
		$scope.paramsEvent = {eventId:$scope.transDetailInfo.eventNo,requestType:'1'};
		jfRest.request('evLstList', 'query', $scope.paramsEvent).then(function(data) {
			if (data.returnCode == '000000') {
				if( data.returnData){
					$scope.disputeFlagInfo = data.returnData.disputeFlag; 
				}
			} 
		});
		// 退货
		$scope.returnedPurchase = function(e) {
			console.log(e.globalSerialNumbr);
			var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//部分退货按钮
		$scope.partReturnedPurchase = function(e){
			$scope.e = e;
			$scope.modal('/cstSvc/txnInfEnqr/layerPartReturned.html',
					$scope.e, {
					title :  T.T('F00191'),
					buttons : [ T.T('F00191'),T.T('F00012') ],
					size : [ '1100px', '300px' ],
					callbacks : [$scope.surePartReturned]
				});
		};
		//确定部分退货
		$scope.surePartReturned = function(result){
			var e = result.scope.e;
			//部分退货金额
			$scope.ecommTransPostingAmount = result.scope.partReturnedInf.ecommTransPostingAmount;
			//输入退货金额+已退货金额 小于等于 退货金额
			if($scope.transDetailInfo.rejectedAmount){
				$scope.transDetailInfo.rejectedAmount = $scope.transDetailInfo.rejectedAmount
			}else{
				$scope.transDetailInfo.rejectedAmount = 0;
            }
            $scope.flag = Number($scope.ecommTransPostingAmount)+Number($scope.transDetailInfo.rejectedAmount) <= $scope.transDetailInfo.actualPostingAmount ? true : false;
			if(!$scope.flag){
				jfLayer.alert(T.T('F00193'));
				return;
            }
            var url;
			if(e.eventNo == 'ISS.PT.40.0001'){
				url = 'returnedPurchase';
			}else if(e.eventNo == 'ISS.PT.40.0002'){
				url = 'returnedPurchase2';
			}else if(e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ){
				url = 'returnedPurchase3';
            }
            $scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : $scope.ecommTransPostingAmount,
				"ecommTransDate" : $scope.ecommTransDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommTransStatus" :  e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo,
				"ecommTransPostingAmount": $scope.ecommTransPostingAmount,
				ecommRejectStatus: 'PRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			};
			jfRest.request('finacialTrans', url, $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
		  			$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('F00054'));
				} 
			});
		};
		//争议登记
		$scope.disputeRegist = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId" : e.externalIdentificationNo,
				"ecommOrigEventId" : e.eventNo,
				"ecommTransCurr" : e.transCurrCde,
				"ecommTransAmount" : e.transAmount,
				"ecommTransDate" : e.transDate,
				"ecommTransPostingCurr" : e.postingCurrencyCode,
				"ecommTransPostingAmount" : e.postingAmount,
				"ecommOrigTransStatus" : e.transState,
				"ecommOriTransDate" : e.transDate,
				"ecommClearAmount" : e.settlementAmount,
				"ecommPostingAcctNmbr": e.accountId,
				"ecommBalType": e.balanceType,
				"ecommCustId" : e.customerNo
			};
			jfRest.request('finacialTrans', 'disputeRegist', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800013'));
				}
			});
		};
		//交易分期
		$scope.transStageDetail = function(event){
			$scope.params=$scope.transDetailInfo;
			$scope.stageInf = $.parseJSON(JSON.stringify(event));
			$scope.items = {
					idType: $scope.stageInf.idType,
					idNumber: $scope.stageInf.idNumber,
					externalIdentificationNo: $scope.stageInf.externalIdentificationNo,
					accountId: $scope.stageInf.accountId,
					balanceObjectCode: $scope.stageInf.balanceObjectCode,
					postingCurrencyCode: $scope.stageInf.postingCurrencyCode,
					occurrDate: $scope.stageInf.occurrDate,
					postingAmount: $scope.stageInf.postingAmount,
					customerNo:$scope.stageInf.customerNo,
					businessTypeCode: $scope.stageInf.businessTypeCode,
					ecommOrigGlobalSerialNumbr : $scope.stageInf.globalSerialNumbr,
			};
			//获取可分期金额
			jfRest.request('billingInfoEnqr', 'queryBillAmt', $scope.items).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/txnInfEnqr/transactionDetail/layerTradeStage1.html',$scope.params, {
						title : T.T('KHJ1800014'),
						buttons : [T.T('F00012') ],
						size : [ '1100px', '550px' ],
						callbacks : []
					});
				}
			});
		};
		//争议释放有利于客户
		$scope.disputeReleaseCst = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseCst', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800019'));
				} 
			});
		};
		//争议释放有利于银行
		$scope.disputeReleaseBank = function(e){
			$scope.params = {
				"idType" : e.idType,
				"idNumber" : e.idNumber,
				"externalIdentificationNo" : e.externalIdentificationNo,
				"ecommOrigGlobalSerialNumbr" : e.globalSerialNumbr,
				"ecommEntryId": e.externalIdentificationNo
			};
			jfRest.request('finacialTrans', 'disputeReleaseBank', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					//取消弹窗
					$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
					$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
					$scope.txnCgyAvyLogEnqrTable.search();
					jfLayer.success(T.T('KHJ1800020'));
				} 
			});
		};
		//争议账户查询 弹窗
		$scope.disputeAccQuery = function(e){
			$scope.disputeItem = $.parseJSON(JSON.stringify(e));
			$scope.modal('/cstSvc/txnInfEnqr/transDisputeAccDetail.html',$scope.disputeItem, {
				title : T.T('KHJ1800024'),
				buttons : [  T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : []
			});
		};
		//分期账户信息查询
		$scope.stagingAccInfoBtn = function(event){
			$scope.itemDetailInf = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/stagingAccInfoLayer.html', $scope.itemDetailInf, {
				title : T.T('KHJ4600001'),//'信贷交易账户明细'
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '900px', '500px' ],
				callbacks : [ ]
			});
		};
	});
	//分期账户信息查询
	webApp.controller('stagingAccInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translate.refresh();
		$scope.itemInf = {};
		$scope.itemDetailInf = $scope.itemDetailInf;
		$scope.paramsObj ={
				oldGlobalSerialNumbr :$scope.itemDetailInf.globalSerialNumbr,
//				accountId: $scope.itemDetailInf.accountId,
				externalIdentificationNo: $scope.itemDetailInf.externalIdentificationNo
		};
		jfRest.request('instalments', 'queryPlan', $scope.paramsObj).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.obj){
					$scope.totalBalance = data.returnData.obj.totalBalance;
					$scope.itemInf = data.returnData.obj;
					if($scope.itemInf.status == '0'){
						$scope.statusInfo = T.T('KHJ1800045');
					}else if($scope.itemInf.status == '1'){
						$scope.statusInfo = T.T('KHJ1800046');
					}else if($scope.itemInf.status == '2'){
						$scope.statusInfo = T.T('KHJ1800047');
					}else if($scope.itemInf.status == '3'){
						$scope.statusInfo = T.T('KHJ1800048');
					}
					else if($scope.itemInf.status == '4'){
						$scope.statusInfo = T.T('KHJ1800049');
					}
					if($scope.itemInf.currencyCode == '156'){
						$scope.currencyCodeInfo = T.T('F00088');
					}else if($scope.itemInf.currencyCode == '840'){
						$scope.currencyCodeInfo = T.T('F00095');
					}else if($scope.itemInf.currencyCode == '392'){
						$scope.currencyCodeInfo = T.T('F00186');
					}else if($scope.itemInf.currencyCode == '344'){
						$scope.currencyCodeInfo = T.T('F00187');
					}
					if($scope.itemInf.repayMode == '0'){
						$scope.repayModeInfo = T.T('KHJ1800052');
					}else if($scope.itemInf.repayMode == '2'){
						$scope.repayModeInfo = T.T('KHJ1800053');
					}else if($scope.itemInf.repayMode == '3'){
						$scope.repayModeInfo = T.T('KHJ1800054');
					}else if($scope.itemInf.repayMode == '4'){
						$scope.repayModeInfo = T.T('KHJ1800055');
					}
					else if($scope.itemInf.repayMode == '5'){
						$scope.repayModeInfo = T.T('KHJ1800056');
					}
					else if($scope.itemInf.repayMode == '13'){
						$scope.repayModeInfo = T.T('KHJ1800057');
					}
					if($scope.itemInf.loanType == 'MERH'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600009');//"商户分期";
					}else if($scope.itemInf.loanType == 'TXAT'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600010');//"自动分期";
					}else if($scope.itemInf.loanType == 'CASH'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600011');//"现金分期";
					}else if($scope.itemInf.loanType == 'STMT'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600012');//"账单分期";
					}else if($scope.itemInf.loanType == 'TRAN'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600013');//"交易分期";
					}else if($scope.itemInf.loanType == 'LOAN'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600054');//"消费信贷";
					}else if($scope.itemInf.loanType == 'APAY'){
						$scope.itemInf.loanTypeTrans = T.T('KHH4600155');//"随借随还";
                    }
                }else {
					$scope.totalBalance = 0;
				}
			}
		});
		// 信贷交易账户明细
		$scope.tradeDetailList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
//				'accountId': $scope.itemDetailInf.accountId,
				oldGlobalSerialNumbr :$scope.itemDetailInf.globalSerialNumbr,
				'externalIdentificationNo' : $scope.itemDetailInf.externalIdentificationNo,
				'currencyCode':$scope.itemDetailInf.currencyCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'instalments.queryPlan',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//2020/4/26  交易分期 
	webApp.controller('layerTradeStage1Ctrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/managementByStages/i18n_stagingInfor');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.stagingInfo =$scope.params;
		//币种
		$scope.ccy = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_curreny",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//费用收取方式
		$scope.ectypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ecommFeeCollectType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分期期数
		$scope.termArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_stageTerm",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0,
				queryType:"stage",
				 stageType:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'stagTypePara.queryEvent',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(row) { // 选中后的回调函数
			}
		};
		//确认分期申请
		$scope.saveRpyTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.stagingParams = {};
			$scope.stagingParams.eventNo = $scope.itemList.checkedList().eventNo;//事件号
			$scope.stagingParams.ecommTransPostingAmount = $scope.stagingInfo.transAmount;//分期金额
			$scope.stagingParams.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;//页面输入的外部识别号
			$scope.stagingParams.currBillFlag = '1'; 
			$scope.stagingParams.ecommSourceCde = 'L';
			$scope.stagingParams.postingAmount = $scope.stagingInfo.postingAmount;//入账金额
			$scope.stagingParams.ecommTransPostingCurr = $scope.stagingInfo.transCurrCde;
			$scope.stagingParams.ecommProdObjId = $scope.stagingInfo.productObjectCode;//产品对象代码
			$scope.stagingParams.ecommCustId = $scope.stagingInfo.customerNo;//客户号码
			$scope.stagingParams.ecommPostingAcctNmbr = $scope.stagingInfo.accountId;////账户号
			$scope.stagingParams.ecommBusineseType = $scope.stagingInfo.businessTypeCode;//业务类型
		    $scope.stagingParams.installmentAmount= $scope.stagingInfo.installmentAmount;//已分期金额
			$scope.stagingParams.transState = $scope.stagingInfo.transState;
			$scope.stagingParams.ecommOrigGlobalSerialNumbr = $scope.stagingInfo.globalSerialNumbr;
			$scope.stagingParams.ecommInstallmentPeriod = $scope.stagingInfo.ecommInstallmentPeriod;//分期期数
		    $scope.stagingParams.ecommFeeCollectType = $scope.stagingInfo.ecommFeeCollectType;//费用收取方式
			$scope.stagingParams.ecommInstallmentBusinessType = $scope.stagingInfo.ecommInstallmentBusinessType;//分期业务类型
			jfRest.request('fncTxnMgt', 'trends', $scope.stagingParams,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.stagingInfo = {};
					 $scope.stagingInfor.$setPristine();
				}
			});
		};
		//交易分期试算弹框
		$scope.trialByStagesInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            $scope.params = $scope.stagingInfo;
			$scope.params.eventNo = $scope.itemList.checkedList().eventNo;
			$scope.params.ecommInstallmentBusinessType = $scope.itemList.checkedList().installType;
			$scope.params.ecommEntryId = $scope.stagingInfo.externalIdentificationNo;
			$scope.params.ecommTransAmount=$scope.stagingInfo.transAmount;
			if(!$scope.itemList.validCheck()){
				return;
            }
            if($scope.params.ecommTransAmount <=0){
				jfLayer.fail(T.T('FQJ900006'));
				return;
			}
			// 页面弹出框事件(弹出页面)分期试算弹框
			$scope.modal('/cstSvc/txnInfEnqr/transactionDetail/stagingRoundsDetail.html', $scope.params, {
				title : T.T('FQJ900004'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : []
			});
		}
	});
});