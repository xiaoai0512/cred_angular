'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易累计查询
	webApp.controller('quotaHistoryListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope,$timeout, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaTrad');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
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
		     $scope.showQuotaTable = false;
		     $scope.differentTypeArray = {};
		    //管控场景代码
			$scope.getCreditNodeList = function (event){
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
				if($scope.externalIdentificationNo != "" && $scope.externalIdentificationNo != null && $scope.externalIdentificationNo != undefined){
				   $scope.idExter = $scope.externalIdentificationNo;
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
			    				"operationMode":$scope.operationMode,
							    "differentType":"0"
			    		};		
			    		jfRest.request('diffQueryb','query',$scope.params).then(function(data1) {
			    			if(data1.returnCode == "000000"){
			    				if(data1.returnData.rows.length >0){
					        		$scope.differentTypeArray = $scope.builder.option(data1.returnData.rows, 'contrlSceneCode','contrlSceneDesc');
					        		$timeout(function(){
					        			Tansun.plugins.render('select');
									});				        		
					        	}

}
                        });
			    	}else{
			    		$scope.showQuotaTable = false;//额度表
			    	}
			    });
			};	
			// 日期控件
	 		layui.use('laydate', function(){
	 			  var laydate = layui.laydate;
	 			  var startDate = laydate.render({
	 					elem: '#LAY_start_Add'
	 				});
	 				var endDate = laydate.render({
	 					elem: '#LAY_end_Add',
	 					done: function(value, date) {
	 						startDate.config.max = {
	 							year: date.year,
	 							month: date.month - 1,
	 							date: date.date,
	 						}
	 					}
	 				});
	 		});
		//交易累计查询
		$scope.itemList = {
			params : $scope.queryParam = {
					authDataSynFlag:"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery: false,
			resource : 'cusInfo.quotaHistory',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_leveList'],//查找数据字典所需参数
			transDict : ['accumultTyp_accumultTypDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode != "000000"){
					$scope.showQuotaTable = false;
				}else{
					$scope.showQuotaTable = true;
				}
			}
		};
		$scope.selectList = function() {
			$scope.itemList.params.transLimitCode = $scope.differentType;
			$scope.itemList.params.startDate = $("#LAY_start_Add").val();
			$scope.itemList.params.endDate = $("#LAY_end_Add").val();
			$scope.itemList.params.externalIdentificationNo = $scope.externalIdentificationNo;
			if(($scope.itemList.params.accumultTyp == "" || $scope.itemList.params.accumultTyp == null || $scope.itemList.params.accumultTyp == undefined) 
					&& ($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined)&&($scope.idType == "" || $scope.idType == null || $scope.idType == undefined)
					&& ($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.itemList.data = [];
				 $scope.showQuotaTable = false;
			}else{
				if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002')); 
					}
					else{
						if($scope.idNumber && $scope.externalIdentificationNo){
							jfLayer.alert(T.T('SQJ1100006'));

						}else{
							$scope.itemList.params.idNumber = $scope.idNumber;
							$scope.itemList.params.idType = $scope.idType;
							$scope.itemList.search();
						}
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));
					}
					else{
						if($scope.idNumber && $scope.externalIdentificationNo){
							jfLayer.alert(T.T('SQJ1100006'));

						}else{
							$scope.itemList.params.idNumber = $scope.idNumber;
							$scope.itemList.params.idType = $scope.idType;
							$scope.itemList.search();
						}
					}
				}
				else if($scope.externalIdentificationNo){
					if($scope.idNumber && $scope.externalIdentificationNo){
						jfLayer.alert(T.T('SQJ1100006'));

					}else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}else{
					jfLayer.fail(T.T('SQJ1100006'));
				}
			}
		};
	});
});
