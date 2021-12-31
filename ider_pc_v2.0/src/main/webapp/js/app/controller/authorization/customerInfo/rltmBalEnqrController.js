'use strict';
define(function(require) {
	var webApp = require('app');
	// 活动清单
	webApp.controller('rltmBalEnqrCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer,$timeout, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_rltmBal');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
	      $scope.tableInfo = false;
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
		        }
			};
	    //联动验证
	      var form = layui.form;
	      form.on('select(getIdType)',function(data){
	      	if(data.value == "1"){//身份证
	      		$("#rltmBalEnqr_idNumber").attr("validator","id_idcard");
	      	}else if(data.value == "2"){//港澳居民来往内地通行证
	      		$("#rltmBalEnqr_idNumber").attr("validator","id_isHKCard");
	      	}else if(data.value == "3"){//台湾居民来往内地通行证
	      		$("#rltmBalEnqr_idNumber").attr("validator","id_isTWCard");
	      	}else if(data.value == "4"){//中国护照
	      		$("#rltmBalEnqr_idNumber").attr("validator","id_passport");
	      	}else if(data.value == "5"){//外国护照passport
	      		$("#rltmBalEnqr_idNumber").attr("validator","id_passport");
	      	}else if(data.value == "6"){//外国人永久居留证
	      		$("#rltmBalEnqr_idNumber").attr("validator","id_isPermanentReside");
	      	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
	      		$("#rltmBalEnqr_idNumber").attr("validator","noValidator");
	      		$scope.queryInfForm.$setPristine();
	      		$("#rltmBalEnqr_idNumber").removeClass("waringform ");
            }
          });
	      $scope.creditNodeNoArray = {};
	      //管控场景代码
			$scope.getCreditNodeList = function (event){
				$scope.externalIdentificationNo = $scope.itemList.params.externalIdentificationNo;
				$scope.idNo = "";
				$scope.idTyp = "";
				$scope.idExter = "";
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
				$("#search_width").attr("style","display: block;");
				//查询客户运营模式
				$scope.opParams = {
						"authDataSynFlag":"1",
					    "idType" : $scope.idType,
			    	   "idNumber" : $scope.idNumber,
			    	   "externalIdentificationNo" : $scope.externalIdentificationNo
				};
				jfRest.request('cusInfo', 'cusQuery', $scope.opParams)
			    .then(function(data) {
			    	if(data.returnMsg == 'OK'){
			    		$scope.operationMode = data.returnData.rows[0].operationMode;
			    		//根据 运营模式查询 额度节点列表
			    		$scope.params ={
			    				"authDataSynFlag":'1',
			    				"operationMode":$scope.operationMode	
			    		};		
			    		jfRest.request('quotatree','queryList',$scope.params).then(function(data1) {
			    			if(data1.returnCode == "000000"){
			    				if(data1.returnData.rows.length >0){
					        		$scope.creditNodeNoArray = $scope.builder.option(data1.returnData.rows, 'creditNodeNo','creditDesc');
					        		$timeout(function(){
					        			Tansun.plugins.render('select');
									});				        		
					        	}

}
                        });
			    	}else{
			    		$scope.tableInfo = false;//额度表
			    	}
			    });
			};	
		//实时余额查询列表
		$scope.itemList = {
				params : $scope.queryParam = {
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : false,
				resource : 'cusInfo.rltmQuery',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						$scope.tableInfo = false;
					}else{
						$scope.tableInfo = true;
					}
				}
			};
		//查询方法
		$scope.selNega = function(){
			$scope.itemList.params.creditNodeNo = $scope.creditNodeNoType;
			if(($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined || $scope.itemList.params.externalIdentificationNo == null)
					&&( $scope.itemList.params.idType == "" || $scope.itemList.params.idType == undefined || $scope.itemList.params.idType == null) 
					&&( $scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined || $scope.itemList.params.idNumber == null)){
				$scope.tableInfo = false;
				jfLayer.alert(T.T('SQJ100001'));
			}
			else{
				if($scope.itemList.params.idType){
					if($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined || $scope.itemList.params.idNumber == null){
						jfLayer.alert(T.T('SQJ100002'));
					}
					else{
						$scope.cusParams = {
								authDataSynFlag:"1",
								externalIdentificationNo:$scope.itemList.params.externalIdentificationNo,
								idNumber:$scope.itemList.params.idNumber,
								idType:$scope.itemList.params.idType
							};
							jfRest.request('cusInfo', 'cusQuery', $scope.cusParams)
						    .then(function(data) {
						    	if(data.returnMsg == 'OK'){
						    		$scope.operationModeInfo = data.returnData.rows[0].operationMode;
						    		$scope.operationParams = {
						    				operationMode:$scope.operationModeInfo
										};
										jfRest.request('operationMode', 'query', $scope.operationParams)
									    .then(function(data) {
									    	$scope.overpayBusinessTypeInfo = data.returnData.rows[0].overpayBusinessType;
											$scope.itemList.search();
							            });
						    	}
				            });
					}
				}else if($scope.itemList.params.idNumber){
					if(!$scope.itemList.params.idType){
						jfLayer.fail(T.T('F00098'));
					}
					else{
						$scope.cusParams = {
								authDataSynFlag:"1",
								externalIdentificationNo:$scope.itemList.params.externalIdentificationNo,
								idNumber:$scope.itemList.params.idNumber,
								idType:$scope.itemList.params.idType
							};
							jfRest.request('cusInfo', 'cusQuery', $scope.cusParams)
						    .then(function(data) {
						    	if(data.returnMsg == 'OK'){
						    		$scope.operationModeInfo = data.returnData.rows[0].operationMode;
						    		$scope.operationParams = {
						    				operationMode:$scope.operationModeInfo
										};
										jfRest.request('operationMode', 'query', $scope.operationParams)
									    .then(function(data) {
									    	$scope.overpayBusinessTypeInfo = data.returnData.rows[0].overpayBusinessType;
											$scope.itemList.search();
							            });
						    	}
				            });
					}
				}
				else{
					$scope.cusParams = {
							authDataSynFlag:"1",
							externalIdentificationNo:$scope.itemList.params.externalIdentificationNo,
							idNumber:$scope.itemList.params.idNumber,
							idType:$scope.itemList.params.idType
						};
						jfRest.request('cusInfo', 'cusQuery', $scope.cusParams)
					    .then(function(data) {
					    	if(data.returnMsg == 'OK'){
					    		$scope.operationModeInfo = data.returnData.rows[0].operationMode;
					    		$scope.operationParams = {
					    				operationMode:$scope.operationModeInfo
									};
									jfRest.request('operationMode', 'query', $scope.operationParams)
								    .then(function(data) {
								    	$scope.overpayBusinessTypeInfo = data.returnData.rows[0].overpayBusinessType;
										$scope.itemList.search();
						            });
					    	}
			            });
				}
			}
		}
	});
});
