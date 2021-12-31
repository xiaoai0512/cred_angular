'use strict';
define(function(require) {
	var webApp = require('app');
	//卡号池查询
	webApp.controller('cardPoolCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		//卡bin
		 $scope.cardBinArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryBin",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		$scope.paramsNo={};
		$scope.availableCard=function(items){
			$scope.paramsNos={};
			$scope.paramsNos=items;
			if($scope.paramsNos==undefined || $scope.cardStatus=='N'){
				$scope.paramsNos={
					cardStatus:'N',
				}
			}else if((!$scope.paramsNos.hasOwnProperty("cardBin") || $scope.paramsNos.cardBin !='') 
					&& (!$scope.paramsNos.hasOwnProperty("cardStatus") || $scope.cardStatus=='')){
					$scope.paramsNos.cardStatus='N';
			}else if((!$scope.paramsNos.hasOwnProperty("cardNumber") || $scope.paramsNos.cardNumber !='') 
					&& (!$scope.paramsNos.hasOwnProperty("cardStatus") || $scope.cardStatus=='')){
					$scope.paramsNos.cardStatus='N';
			}else if($scope.cardStatus=='' || $scope.cardStatus==undefined || $scope.cardStatus==null){
				$scope.paramsNos.cardStatus='N';
			}else{
				$scope.paramsNos.cardStatus='Y';
			}
			jfRest.request('cardQuery','query',$scope.paramsNos).then(function(data) {
  				if(data.returnCode == '000000'){
  					$scope.cardPoolTable.params = {};
  					$scope.paramsNo.totalCount=data.returnData.totalCount;
  					if($scope.cardStatus=='' || $scope.cardStatus==undefined || $scope.cardStatus==null){
  						$scope.paramsNo.totalCount=data.returnData.totalCount;
						$scope.cardPoolTable.params.cardBin=$scope.paramsNos.cardBin;
						$scope.cardPoolTable.params.cardStatus='';
						$scope.cardPoolTable.params.cardNumber=$scope.paramsNos.cardNumber;
						$scope.cardPoolTable.search();
					}else{
						$scope.paramsNo.totalCount=data.returnData.totalCount;
						$scope.cardPoolTable.params.cardBin=$scope.paramsNos.cardBin;
						$scope.cardPoolTable.params.cardStatus=$scope.cardStatus;
						$scope.cardPoolTable.params.cardNumber=$scope.paramsNos.cardNumber;
						$scope.cardPoolTable.search();
					}
  					if($scope.paramsNos.cardStatus=='Y'){
  						$scope.paramsNo.totalCount='0';
  					}
					$scope.paramsNo.cardStatus='';
				}
  			})
		 };	
		$scope.availableCard();
		 //列表查询
  		$scope.cardPoolTable = {
  			autoQuery : false,
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cardQuery.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					//$scope.paramsNo.totalCount=data.returnData.totalCount;
  				}
			}
		};
		$scope.deleteCardPollTable=function(){
			cardBinTable.params.cardBin='';
			cardBinTable.params.cardNumber='';
			cardBinTable.params.cardStatus='';
		};
		//卡号状态下拉框
		 $scope.cardStatusArr ={ 
			 type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cardStatus",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	//console.log(data)
	        }
	    };
	});	 
});
