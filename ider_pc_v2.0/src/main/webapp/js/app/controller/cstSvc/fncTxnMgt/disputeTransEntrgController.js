'use strict';
define(function(require) {
	var webApp = require('app');
	// 争议释放交易补录
	webApp.controller('disputeTransEntrgCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_disputeTrans');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.disputeTransEntrgInfo = {
		};
		//'人民币''美元'
		$scope.ccy = [{name : T.T('KHJ1600001'),id : 'CNY'},{name : T.T('KHJ1600002'),id : 'USD'}];
		//交易模式'普通模式''快捷支付' '手机银行' 
		$scope.posEntryModeArray = [{name : T.T('KHJ1600003') ,id : '0'},{name : T.T('KHJ1600004'),id : '1'},{name : T.T('KHJ1600005') ,id : '2'}] ;
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					queryType : "R"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryFiniTrans',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//根据入账币种判断入账金额
		var form = layui.form;
		form.on('select(getdisputeCurr)',function(event){
			if(($scope.disputeTransEntrgInfo.ecommTransCurr == null || $scope.disputeTransEntrgInfo.ecommTransCurr == undefined || $scope.disputeTransEntrgInfo.ecommTransCurr == "") || 
					($scope.disputeTransEntrgInfo.ecommTransAmountRE == null || $scope.disputeTransEntrgInfo.ecommTransAmountRE == undefined || $scope.disputeTransEntrgInfo.ecommTransAmountRE == "")){
				jfLayer.fail(T.T('KHJ1600006') );
				$scope.disputeTransEntrgInfo.ecommPostingCurr = "";
			}else{
				if($scope.disputeTransEntrgInfo.ecommPostingCurr == $scope.disputeTransEntrgInfo.ecommTransCurr){
					$scope.disputeTransEntrgInfo.ecommTransPostingAmountRE = $scope.disputeTransEntrgInfo.ecommTransAmountRE;
				}else{
					$scope.disputeTransEntrgInfo.ecommTransPostingAmountRE = "";
				}
			}
		});
		//确认
		$scope.saveRvlDbtTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
			}
			$scope.disputeTransEntrgInfo.ecommTransAmount = $scope.disputeTransEntrgInfo.ecommTransAmountRE;
			$scope.disputeTransEntrgInfo.ecommTransPostingAmount = $scope.disputeTransEntrgInfo.ecommTransPostingAmountRE;
			$scope.disputeTransEntrgInfo.ecommEventId = $scope.itemList.checkedList().eventNo;
			//不同的事件请求不同的接口
			//var saveDisputeTransEntrg;
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.disputeTransEntrgInfo.eventId = $scope.itemList.checkedList().eventNo;
			/*if($scope.disputeTransEntrgInfo.eventId  == "CRD.PR.02.0001"){
				saveDisputeTransEntrg = "saveDisputeTransEntrg1";
			}else if($scope.disputeTransEntrgInfo.eventId  == "CRD.PR.03.0001"){
				saveDisputeTransEntrg = "saveDisputeTransEntrg2";
			}else if($scope.disputeTransEntrgInfo.eventId  == "CRD.PR.04.0001"){
				saveDisputeTransEntrg = "saveDisputeTransEntrg3";
			}else if($scope.disputeTransEntrgInfo.eventId  == "CRD.PR.05.0001"){
				saveDisputeTransEntrg = "saveDisputeTransEntrg4";
			}else if($scope.disputeTransEntrgInfo.eventId  == "CRD.PR.06.0001"){
				saveDisputeTransEntrg = "saveDisputeTransEntrg5";
			}else if($scope.disputeTransEntrgInfo.eventId  == "CRD.PR.07.0001"){
				saveDisputeTransEntrg = "saveDisputeTransEntrg6";
			}*/
			//$scope.disputeTransEntrgInfo.ecommEventId = 'ISS.PT.40.0001';
			//jfRest.request('fncTxnMgt', 'saveRvlDbtTxnSplmtEntrg', $scope.disputeTransEntrgInfo).then(function(data) {
			if($scope.disputeTransEntrgInfo.ecommTransCurr == $scope.disputeTransEntrgInfo.ecommPostingCurr){
				if($scope.disputeTransEntrgInfo.ecommTransAmountRE != $scope.disputeTransEntrgInfo.ecommTransPostingAmountRE){
					jfLayer.fail(T.T('KHJ1600007') );
					return;
				}
			}
			jfRest.request('fncTxnMgt', 'trends', $scope.disputeTransEntrgInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.disputeTransEntrgInfo = {};
					 $scope.disputeForm.$setPristine();
					 $scope.queryDate();
				}
			});
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows!=null){
						$scope.disputeTransEntrgInfo.ecommTransDate = data.returnData.rows[0].nextProcessDate;
						$scope.disputeTransEntrgInfo.ecommOriTransDate = data.returnData.rows[0].nextProcessDate;
					}
				}
			});
		};
		$scope.queryDate();
	});
});
