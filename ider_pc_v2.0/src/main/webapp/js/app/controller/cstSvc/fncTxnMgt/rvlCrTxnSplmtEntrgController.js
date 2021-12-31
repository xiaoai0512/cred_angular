'use strict';
define(function(require) {
	var webApp = require('app');
	//循环贷记交易补录
	webApp.controller('rvlCrTxnSplmtEntrgCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rvlCrTxnSplmt');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		console.log( lodinDataService.getObject("menuName"));
		$scope.rvlCrTxnSplmtEntrgInfo = {};
		/*$scope.rvlCrTxnSplmtEntrgInfo = {
			ecommInstallmentAmount : '0'
		};*/
		/*NOR-正常
		INS-已分期
		REV-已冲正
		FRT-全额退货
		PRT-部分退货
		DIS-争议登记
		FAL-交易失败*/
		//'正常''已分期''已冲正''全额退货''部分退货''争议登记''交易失败'
		/*$scope.ecommTransStatusArray = [{name : T.T('KHJ1400003'),id : 'NOR'},{name : T.T('KHJ1400004'),id : 'INS'},{name : T.T('KHJ1400005'),id : 'REV'},
		                                {name : T.T('KHJ1400006'),id : 'FRT'},{name : T.T('KHJ1400007'),id : 'PRT'},{name : T.T('KHJ1400008'),id : 'DIS'},
		                                {name : T.T('KHJ1400009'),id : 'FAL'}];*/
		$scope.ecommTransStatusArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ecommTransStatus",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
	};
		//交易来源
		$scope.transSourcArr = { 
	        type:"dynamicDesc", 
	        param:{
	        	"flag":"Y"
	        },//默认查询条件 
	        text:"transOrigin", //下拉框显示内容，根据需要修改字段名称 
	        desc:"originDesc",
	        value:"transOrigin",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"principalDebitTrans.queryTransSource",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.currenyArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_curreny",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
	};
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					queryType : "C"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryFiniTrans',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//根据入账币种判断入账金额
		var form = layui.form;
		form.on('select(getrvlCrtCurr)',function(event){
			if(($scope.rvlCrTxnSplmtEntrgInfo.ecommTransCurr == null || $scope.rvlCrTxnSplmtEntrgInfo.ecommTransCurr == undefined || $scope.rvlCrTxnSplmtEntrgInfo.ecommTransCurr == "") ||
					($scope.rvlCrTxnSplmtEntrgInfo.ecommTransAmount == null || $scope.rvlCrTxnSplmtEntrgInfo.ecommTransAmount == undefined || $scope.rvlCrTxnSplmtEntrgInfo.ecommTransAmount =="")){
				jfLayer.fail(T.T('KHJ1400010'));
				$scope.rvlCrTxnSplmtEntrgInfo.ecommTransPostingCurr = "";
			}else{
				if($scope.rvlCrTxnSplmtEntrgInfo.ecommTransPostingCurr == $scope.rvlCrTxnSplmtEntrgInfo.ecommTransCurr){
					$scope.rvlCrTxnSplmtEntrgInfo.ecommTransPostingAmount = $scope.rvlCrTxnSplmtEntrgInfo.ecommTransAmount;
				}else{
					$scope.rvlCrTxnSplmtEntrgInfo.ecommTransPostingAmount = "";
				}
			}
		});
		//确认
		$scope.saveRvlCrTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.rvlCrTxnSplmtEntrgInfo.ecommEventId = $scope.itemList.checkedList().eventNo;
			$scope.rvlCrTxnSplmtEntrgInfo.eventId = $scope.itemList.checkedList().eventNo;
			//var str = $scope.itemList.checkedList().eventNo.split(".").join("");
			//var url = "saveRvlCrTxn"+str;
			if($scope.rvlCrTxnSplmtEntrgInfo.ecommTransCurr == $scope.rvlCrTxnSplmtEntrgInfo.ecommTransPostingCurr){
				if($scope.rvlCrTxnSplmtEntrgInfo.ecommTransAmount != $scope.rvlCrTxnSplmtEntrgInfo.ecommTransPostingAmount){
					jfLayer.fail(T.T('KHJ1400011'));
					return;
				}
			}
			jfRest.request('fncTxnMgt', 'trends', $scope.rvlCrTxnSplmtEntrgInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.rvlCrTxnSplmtEntrgInfo = {};
					 $scope.rvlCrtTxnForm.$setPristine();
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
					$scope.rvlCrTxnSplmtEntrgInfo.ecommTransDate = data.returnData.rows[0].nextProcessDate;
					$scope.rvlCrTxnSplmtEntrgInfo.ecommOriTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
	});
});
