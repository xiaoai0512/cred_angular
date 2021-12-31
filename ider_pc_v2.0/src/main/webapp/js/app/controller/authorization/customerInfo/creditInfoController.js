'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('creditInfoCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_cusInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//授信额度类型   P： 永久额度   T：临时额度*/
		//$scope.creditTypeArray =[{name:T.T('SQJ600001'),id:'P'},{name:T.T('SQJ600002'),id:'T'}];
		//证件类型
		$scope.certificateTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_certificateType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.userName = sessionStorage.getItem("userName");//用户名
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			if(data.value == "1"){//身份证
				$("#creditInfo_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#creditInfo_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#creditInfo_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#creditInfo_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#creditInfo_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#creditInfo_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#creditInfo_idNumber").attr("validator","noValidator");
				$scope.creditInfoForm.$setPristine();
				$("#creditInfo_idNumber").removeClass("waringform ");
            }
        });
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYCI_startDate',
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
				elem: '#LAYCI_endDate',
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
		//运营模式
		 /*$scope.coArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.coArrayList = data
	        }
	    };*/
		$scope.isT = false;
		//额度节点
		/* $scope.quoteArray ={};
		 var form = layui.form;
			form.on('select(getoperation)',function(event){
				 $scope.quoteArray ={ 
				        type:"dynamic", 
				        param:{"authDataSynFlag":'1',"creditFlag":'Y',"operationMode":$scope.operationMode},//默认查询条件
				        text:"creditDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"creditNodeNo",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"quotatree.queryList",//数据源调用的action 
				        callback: function(data){
				        	console.log(data);
				        	//$scope.quoteArrayList = data;
				        }
				    };
				 for(var i=0;i< $scope.coArrayList.length;i++){
						if($scope.operationMode == $scope.coArrayList[i].operationMode){
							$scope.operationModeInfo = $scope.coArrayList[i].modeName;
						}
					}
			});*/
		
		//额度节点  列表查询
		$scope.getCreditNode = function (event){
			$scope.idNo = "";
			$scope.idTyp = "";
			$scope.idExter = "";
			$scope.quotaAvailableArr = {};
			if (($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) && ($scope.idType == "" || $scope.idType == null || $scope.idType == undefined) && 
					($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined)){
				jfLayer.alert(T.T('SQJ100001'));
				return;
			}
			if(($scope.idNumber != "" && $scope.idNumber != null && $scope.idNumber != undefined) && ($scope.idType == "" || $scope.idType == null || $scope.idType == undefined) ){
				jfLayer.alert(T.T('SQJ410002')); 
				return;
			}
			if(($scope.idType != "" && $scope.idType != null && $scope.idType != undefined)){
				$scope.idTyp = $scope.idType;
				if($scope.idNumber != "" && $scope.idNumber != null && $scope.idNumber != undefined){	
					$scope.idNo = $scope.idNumber;
				}else{
					jfLayer.alert(T.T('SQJ410003')); 
					return;
				}
			}
			if($scope.externalIdentificationNo != "" && $scope.externalIdentificationNo != null && $scope.externalIdentificationNo != undefined){
			   $scope.idExter = $scope.externalIdentificationNo;
            }
            if(event.target.tagName == "BUTTON"){
				if(!($("#search_width222").attr("style") == "display: none;")){//展开状态
					$scope.creditNodeNo = '';
					return;
				}				
			}else if(event.target.tagName == "I"){
				if(!($("#search_width222").attr("style") == "display: none;")){//展开状态
					$scope.creditNodeNo = '';
					return;
				}
			}
			//查询客户运营模式
			$scope.opParams = {
					"authDataSynFlag":"1",
				    "idType" : $scope.idTyp,
		    	   "idNumber" : $scope.idNo,
		    	   "externalIdentificationNo" : $scope.idExter
			};
			jfRest.request('cusInfo', 'cusQuery', $scope.opParams).then(function(data) {
		    	if(data.returnMsg == 'OK'){
		    		$scope.operationMode = data.returnData.rows[0].operationMode;
		    		//根据 运营模式查询 额度节点列表
		    		$scope.params ={
		    				"authDataSynFlag":'1',
		    				"operationMode":$scope.operationMode,
		    				"creditFlag":"Y",
							"idType" : $scope.idTyp,
							"idNumber" : $scope.idNo,
							"externalIdentificationNo" : $scope.idExter
		    		};
		    		jfRest.request('quota','creditNodeList',$scope.params).then(function(data1) {
		    			if(data1.returnCode == "000000"){
		    				if(data1.returnData.rows.length >0){
				        		for(var i=0;i<data1.returnData.rows.length;i++){
				        			if(data1.returnData.rows[i].creditNodeTyp == 'L'){
				        				data1.returnData.rows.splice(i,1);
				        				i--;
				        			}
                                }
                                $scope.quotaAvailableArr = $scope.builder.option(data1.returnData.rows, 'creditNodeNo','creditNodeDesc');
				        		$timeout(function(){
				        			Tansun.plugins.render('select');
								});				        		
				        	}

}
                    });
		    	}else{
		    		$scope.resultTwoInfo = false;//额度表
		    	}
		    });
		};
		$scope.quotaAvailableArr = $scope.builder.option({});
//			form.on('select(getcreditType)',function(event){
//				if($scope.creditTwoType == "P"){
//					$scope.isT = false;
//					$scope.startDate = "";
//					$scope.endDate = "";
//				}else if($scope.creditTwoType == "T"){
//					$scope.isT = true;
//				}
//			});
		// 授信类型默认为P
		$scope.creditTwoType = 'P';
		$scope.resultTwoInfo = false;
		$scope.creditcurrencyArray = {};
		//查询详情事件
		$scope.selectList = function() {
			if(($scope.operationMode == "" || $scope.operationMode == null || $scope.operationMode == undefined) || 
					($scope.creditNodeNo == "" || $scope.creditNodeNo == null || $scope.creditNodeNo == undefined)){
					jfLayer.alert(T.T('SQJ100001'));  //
			}else{
				if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) && ($scope.idType == "" || $scope.idType == null || $scope.idType == undefined) && ($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined)){
					jfLayer.alert(T.T('SQJ600004'));  //"请输入证件号或者外部识别号！"
				}else if(($scope.idNumber) &&($scope.externalIdentificationNo))
					jfLayer.alert(T.T('SQJ600005'));   //"证件号和外部识别号只能选择输入一种！"
				else{
					if($scope.idType){
						if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
							jfLayer.alert(T.T('SQJ100002'));
						}
						else{
							$scope.cusParams = {
									"authDataSynFlag":'1',
									"idNumber":$scope.idNumber,
									"idType":$scope.idType,
									"operationMode":$scope.operationMode,
									"creditNodeNo":$scope.creditNodeNo,
									"grantAdjustFlag":'G'
								};
								jfRest.request('quota', 'creditCurrency', $scope.cusParams)
							    .then(function(data) {
							    	if(data.returnMsg == 'OK'){
							    		if(data.returnData.rows.length == 0){
							    			jfLayer.fail(T.T('SQJ600006'));  //"该账户不存在授信币种，请核实客户信息！"
							    		}else{
							    		//授信币种
										 $scope.creditcurrencyArray ={ 
										        type:"dynamic", 
										        param:{"authDataSynFlag":'1',"idNumber":$scope.idNumber,"idType":$scope.idType,"operationMode":$scope.operationMode,"creditNodeNo":$scope.creditNodeNo,"grantAdjustFlag":'G'},//默认查询条件 
										        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
										        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
										        resource:"quota.creditCurrency",//数据源调用的action 
										        callback: function(data){
										        }
										    };
											$scope.resultTwoInfo = true;
											$scope.resultTwocustomerNo = data.returnData.rows[0].customerNo;
											$scope.resultTwoaccountId = "";
											if (null != data.returnData.rows[0]) {
												if (data.returnData.rows[0].creditType == "P") {
													$scope.isT = false;
													$scope.startDate = "";
													$scope.endDate = "";
													$scope.creditTwoType = 'P';
												}else if(data.returnData.rows[0].creditType == "T"){
													$scope.isT = true;
													$scope.creditTwoType = 'T';
												}
											}
							    		}
							    	}
					            });
						}
					}else if($scope.idNumber){
						if(!$scope.idType){
							jfLayer.alert(T.T('F00098'));
						}
						else{
							$scope.cusParams = {
									"authDataSynFlag":'1',
									"idNumber":$scope.idNumber,
									"idType":$scope.idType,
									"operationMode":$scope.operationMode,
									"creditNodeNo":$scope.creditNodeNo,
									"grantAdjustFlag":'G'
								};
								jfRest.request('quota', 'creditCurrency', $scope.cusParams)
							    .then(function(data) {
							    	if(data.returnMsg == 'OK'){
							    		if(data.returnData.rows.length == 0){
							    			jfLayer.fail(T.T('SQJ600006'));
							    		}else{
							    			//授信币种
											 $scope.creditcurrencyArray ={ 
											        type:"dynamic", 
											        param:{"authDataSynFlag":'1',"idNumber":$scope.idNumber,"idType":$scope.idType,"operationMode":$scope.operationMode,"creditNodeNo":$scope.creditNodeNo,"grantAdjustFlag":'G'},//默认查询条件 
											        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
											        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
											        resource:"quota.creditCurrency",//数据源调用的action 
											        callback: function(data){
											        }
											    };
												$scope.resultTwoInfo = true;
												$scope.resultTwocustomerNo = data.returnData.rows[0].customerNo;
												$scope.resultTwoaccountId = "";
												if (null != data.returnData.rows[0]) {
													if (data.returnData.rows[0].creditType == "P") {
														$scope.isT = false;
														$scope.startDate = "";
														$scope.endDate = "";
														$scope.creditTwoType = 'P';
													}else if(data.returnData.rows[0].creditType == "T"){
														$scope.isT = true;
														$scope.creditTwoType = 'T';
													}
												}
							    		}
							    	}
					            });
						}
					}
					else{
						$scope.cusParams = {
								"authDataSynFlag":'1',
								"externalIdentificationNo":$scope.externalIdentificationNo,
								"operationMode":$scope.operationMode,
								"creditNodeNo":$scope.creditNodeNo,
								"grantAdjustFlag":'G'
							};
							jfRest.request('quota', 'creditCurrency', $scope.cusParams)
						    .then(function(data) {
						    	if(data.returnMsg == 'OK'){
						    		if(data.returnData.rows.length == 0){
						    			jfLayer.fail(T.T('SQJ600006'));
						    		}else{
						    		//授信币种
									 $scope.creditcurrencyArray ={ 
									        type:"dynamic", 
									        param:{"authDataSynFlag":'1',"externalIdentificationNo":$scope.externalIdentificationNo,"operationMode":$scope.operationMode,"creditNodeNo":$scope.creditNodeNo,"grantAdjustFlag":'G'},//默认查询条件 
									        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
									        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
									        resource:"quota.creditCurrency",//数据源调用的action 
									        callback: function(data){
									        }
									    };
										$scope.resultTwoInfo = true;
										$scope.resultTwocustomerNo = data.returnData.rows[0].customerNo;
										$scope.resultTwoaccountId = data.returnData.rows[0].externalIdentificationNo;
										if (null != data.returnData.rows[0]) {
											if (data.returnData.rows[0].creditType == "P") {
												$scope.isT = false;
												$scope.startDate = "";
												$scope.endDate = "";
												$scope.creditTwoType = 'P';
											}else if(data.returnData.rows[0].creditType == "T"){
												$scope.isT = true;
												$scope.creditTwoType = 'T';
											}
										}
						    		}
						    	}
				            });
					}
				}
			}
		};
		//专项授信确定
		$scope.sureTwoInfo = function(){
			$scope.resTwoInfo = {};
			if($scope.creditTwoType == 'P'){   //永久
				$scope.resTwoInfo.operationMode = $scope.operationModeInfo;
				$scope.resTwoInfo.externalIdentificationNo = $scope.resultTwoaccountId;
				$scope.resTwoInfo.customerNo = $scope.resultTwocustomerNo;
				$scope.resTwoInfo.idNumber = $scope.idNumber;
				$scope.resTwoInfo.idType = $scope.idType;
				$scope.resTwoInfo.creditNodeNo = $scope.creditNodeNo,
				$scope.resTwoInfo.creditLimit = $scope.creditTwoquota;
				if($scope.creditTwocurrency == '156'){
					$scope.resTwoInfo.currencyCodeInfo = T.T('F00088');
				}else if($scope.creditTwocurrency == '840'){
					$scope.resTwoInfo.currencyCodeInfo = T.T('F00095');
				}
				if($scope.creditTwoType == 'P'){
					$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600001');
				}else if($scope.creditTwoType == 'T'){
					$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600002');
				}
				$scope.cusParams = {
						authDataSynFlag:"1",
						operationMode:$scope.operationMode,
						externalIdentificationNo:$scope.resultTwoaccountId,
						customerNo:$scope.resultTwocustomerNo,
						idNumber:$scope.idNumber,
						idType:$scope.idType,
						creditType:$scope.creditTwoType,
						currencyCode:$scope.creditTwocurrency,
						creditNodeNo:$scope.creditNodeNo,
						creditLimit:$scope.creditTwoquota
					};
					jfRest.request('quota', 'credit', $scope.cusParams)
				    .then(function(data) {
				    	if(data.returnMsg == 'OK'){
				    		$scope.resTwoInfo.returnCodeInfo = T.T('SQJ600007');
				    	}else{
				    		$scope.resTwoInfo.returnCodeInfo = T.T('SQJ600008');
				    		$scope.resTwoInfo.returnMsgInfo = data.returnMsg;
				    	}
				    	$scope.modal('/authorization/customerInfo/creditResultInfo.html', $scope.resTwoInfo, {
			    			title : T.T('SQJ600009'), //'授信结果信息'
			    			buttons : [ T.T('F00012')],
			    			size : [ '1100px', '450px' ],
			    			callbacks : [$scope.closeTan]
			    		});
		            });
			}else if($scope.creditTwoType == 'T'){    //临时
				$scope.startDate = $("#LAYCI_startDate").val();
				$scope.endDate = $("#LAYCI_endDate").val();
				if($scope.startDate && $scope.endDate){
					$scope.resTwoInfo.operationMode = $scope.operationModeInfo;
					$scope.resTwoInfo.externalIdentificationNo = $scope.resultTwoaccountId;
					$scope.resTwoInfo.customerNo = $scope.resultTwocustomerNo;
					$scope.resTwoInfo.idNumber = $scope.idNumber;
					$scope.resTwoInfo.idType = $scope.idType;
					$scope.resTwoInfo.creditLimit = $scope.creditTwoquota;
					$scope.resTwoInfo.creditNodeNo = $scope.creditNodeNo,
					$scope.resTwoInfo.startDateInfo = $scope.startDate;
					$scope.resTwoInfo.endDataInfo = $scope.endDate;
					if($scope.creditTwocurrency == '156'){
						$scope.resTwoInfo.currencyCodeInfo = T.T('F00088');
					}else if($scope.creditTwocurrency == '840'){
						$scope.resTwoInfo.currencyCodeInfo = T.T('F00095');
					}
					if($scope.creditTwoType == 'P'){
						$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600001');
					}else if($scope.creditTwoType == 'T'){
						$scope.resTwoInfo.creditTwoTypeInfo = T.T('SQJ600002');
					}
					$scope.cusParams = {
							authDataSynFlag:"1",
							operationMode:$scope.operationMode,
							externalIdentificationNo:$scope.resultTwoaccountId,
							customerNo:$scope.resultTwocustomerNo,
							idNumber:$scope.idNumber,
							idType:$scope.idType,
							creditType:$scope.creditTwoType,
							currencyCode:$scope.creditTwocurrency,
							creditLimit:$scope.creditTwoquota,
							creditNodeNo:$scope.creditNodeNo,
							limitEffectvDate:$scope.startDate,
							limitExpireDate:$scope.endDate
						};
						jfRest.request('quota', 'credit', $scope.cusParams)
					    .then(function(data) {
					    	if(data.returnMsg == 'OK'){
					    		$scope.resTwoInfo.returnCodeInfo = T.T('SQJ600007');
					    	}else{
					    		$scope.resTwoInfo.returnCodeInfo = T.T('SQJ600008');
					    		$scope.resTwoInfo.returnMsgInfo = data.returnMsg;
					    	}
				    		$scope.modal('/authorization/customerInfo/creditResultTwoInfo.html', $scope.resTwoInfo, {
								title : T.T('SQJ600009'),
								buttons : [ T.T('F00012')],
								size : [ '1100px', '450px' ],
								callbacks : [$scope.closeTan]
							});
			            });
				}else{
					jfLayer.alert(T.T('SQJ600010'));  //请输入生效日期和失效日期！
				}
			}
		};
		//关闭弹窗
		$scope.closeTan = function(result){
			$scope.safeApply();
			result.cancel();
			$scope.resultTwoInfo = false;
			$scope.creditTwocurrency = "";
			$scope.creditTwoquota = "";
		};
		//关闭事件====专项授信
		$scope.closeTwoInfo = function(){
			$scope.resultTwoInfo = false;
			$scope.resultTwocustomerNo = "";
			$scope.resultTwoaccountId = "";
			$scope.creditTwoType = "";
			$scope.creditTwocurrency = "";
			$scope.creditTwoquota = "";
			$scope.startDate = "";
			$scope.endDate = "";
		}
	});
	webApp.controller('creditResultInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T) {
		$scope.isNO = false;
		if($scope.resTwoInfo.returnCodeInfo == '失败'){
			$scope.isNO = true;
		}else{
			$scope.isNO = false;
		}
	});
	webApp.controller('creditResultTwoInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T) {
		$scope.isNO = false;
		if($scope.resTwoInfo.returnCodeInfo == '失败'){
			$scope.isNO = true;
		}else{
			$scope.isNO = false;
		}
	});
});
