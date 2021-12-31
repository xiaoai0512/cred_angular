'use strict';
define(function(require) {
	var webApp = require('app');
	// 循环借记交易补录
	webApp.controller('rvlDbtTxnSplmtEntrgCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rvlDbtTxnSplmt');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	$scope.operationMode = lodinDataService.getObject("operationMode");//
		$scope.rvlDbtTxnSplmtEntrgInfo = { };
		$scope.ccy = [{name : T.T('KHJ1300001'),id : '156'},{name : T.T('KHJ1300002'),id :'840'}];//'人民币' '美元'
		//交易币种
		var list = [];
		list[0]="156";
		list[1]="840";
		list[2]="978";
		list[3]="392";
		list[4]="344";
		$scope.billingCurrency = { 
		        type:"dynamic", 
		        param:{
		        	"priorityCurrencyList":list 
	        	} ,//默认查询条件 
		        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operatCurrency.queryCurrency",//数据源调用的action 
		        callback: function(data){
		        		
		        }
		};
		//入账币种
		$scope.billingFigure = { 
		        type:"dynamic", 
		        param:{
		        	"queryCurrencyDesc":true,
			        "operationMode" : $scope.operationMode
		        	} ,//默认查询条件 
		        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operatCurrency.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
		};
		//交易模式//'普通模式''快捷支付' '手机银行' 
		$scope.posEntryModeArray = [{name : T.T('KHJ1300003'),id : '0'},{name : T.T('KHJ1300004'),id : '1'},{name : T.T('KHJ1300005'),id : '2'}] ;
		//交易输入来源V-VISA、M-MC、C-银联、L-本行 '本地''银联'
		/*$scope.associArray = [{name : 'VISA',id : 'V'},{name : 'MC',id : 'M'}
							 ,{name : T.T('KHJ1300006'),id : 'L'},{name : T.T('KHJ1300007'),id : 'C'}];*/
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
		//交易机构
		$scope.transOrganiArr = { 
		        type:"dynamic", 
		        param:{
		        },//默认查询条件 
		        text:"organName", //下拉框显示内容，根据需要修改字段名称 
		        value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"principalDebitTrans.queryTransOrgani",//数据源调用的action 
		        callback: function(data){
		        }
			};
		// 交易场景下拉框
		$scope.transSceneArray = {
			type: "dynamicDesc",
			param: {
				operationMode: $scope.operationMode,
				applicationRange: 'A',
				pageSize:10,
				indexNo:0
			},
			text:"transSceneCode", //下拉框显示内容，根据需要修改字段名称
			desc: "transSceneDesc",
			value:"transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
			resource: "tradModel.query",//数据源调用的action
			callback: function (data) {
				$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransSceneCode = 'NORM';
			}
		};
		$scope.isX = false;
		$scope.isQ = false;
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0,
					queryType : "D"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryFiniTrans',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				console.log(data);
			},
			checkBack : function(data){
				if(data.eventDesc.search('消费') != -1){
					$scope.isX = true;
					$scope.isQ = false;
				}else if(data.eventDesc.search('取现') != -1){
					$scope.isX = false;
					$scope.isQ = true;
                }
            },
		};
		$scope.rvlDbtTxnSplmtEntrgInfo = {};
		//根据入账币种判断入账金额
		var form = layui.form;
		form.on('select(getrvlDbtCurr)',function(event){
			if(($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == null || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == undefined || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == "") || 
					($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount == null || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount == undefined || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount == "")){
				jfLayer.fail(T.T('KHJ1300010'));
				$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingCurr = "";
			}else{
				if($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingCurr == $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr){
					$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingAmount = $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount;
				}else{
					$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingAmount = "";
				}
			}
		});
		//确认
		$scope.saveRvlDbtTxnSplmtEntrgInfo = function(){
			if (!$scope.itemList.validCheck()) {
				return;
            }
            //交易来源=====取现时必输，消费不必输
			if($scope.itemList.checkedList().eventDesc.search('取现') != -1 ){
				if(!$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransSource){
					jfLayer.fail(T.T('KHJ1300008'));
					return;
				}
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.rvlDbtTxnSplmtEntrgInfo.ecommEventId = $scope.itemList.checkedList().eventNo;
			if($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingCurr){
				if($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount != $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingAmount){
					jfLayer.fail(T.T('KHJ1300011'));
					return;
				}
			}
			jfRest.request('fncTxnMgt','trends',$scope.rvlDbtTxnSplmtEntrgInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.rvlDbtTxnSplmtEntrgInfo = {};
					 $scope.rvlDbtTxnForm.$setPristine();
					 $scope.queryDate();
					 $scope.eventNoTrends = "";
					 $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransSceneCode = 'NORM';
				}else{
					$scope.eventNoTrends = "";
				}
			});
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
	});
	//入账金额
//	$scope.billingFigure = { 
//	        type:"dynamic", 
//	        param:{
//	        	  "queryCurrencyDesc":true
//		        
//	        	} ,//默认查询条件 
//	        text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称 
//	        value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称 
//	        resource:"billingCurrency.Figure",//数据源调用的action 
//	        callback: function(data){
//	        		
//	        }
//	};
});
