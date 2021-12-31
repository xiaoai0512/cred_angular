'use strict';
define(function(require) {
	var webApp = require('app');
	/*------统一日期修改------*/
	webApp.controller('dateModificationListCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/dateModification/i18n_dateModificationList');
		$translatePartialLoader.addPart('pages/cstSvc/cstBsnisItemQuery/i18n_cstBsnisItemQuery');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log(lodinDataService.getObject("menuName"));
    	$scope.cstBsnisForm = {};
    	$scope.modifyInfo = {};
    	$scope.modifyParams = {};
    	$scope.showItemList = false;//客户基本信息&&客户业务项目表
    	$scope.showModifyDiv = false; //统一日期修改div
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
		//账单日
		$scope.statementDateArr =[ {name : '01', id : '1'}, {name : '02',id : '2'},{name : '03', id : '3'}, {name : '04',id : '4'},{name : '05',id : '5'},
		                            {name : '06', id : '6'}, {name : '07',id : '7'},{name : '08', id : '8'}, {name : '09',id : '9'},{name : '10',id : '10'},
		                            {name : '11', id : '11'}, {name : '12',id : '12'},{name : '13', id : '13'}, {name : '14',id : '14'},{name : '15',id : '15'},
		                            {name : '16', id : '16'}, {name : '17',id : '17'},{name : '18', id : '18'}, {name : '19',id : '19'},{name : '20',id : '20'},
		                            {name : '21', id : '21'}, {name : '22',id : '22'},{name : '23', id : '23'}, {name : '24',id : '24'},{name : '25',id : '25'},
		                            {name : '26', id : '26'}, {name : '27',id : '27'},{name : '28', id : '28'}];
		//联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
        	$scope.itemList.params.idNumber = '';
        	if(data.value == "1"){//身份证
        		$("#cstBsnisItem_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#cstBsnisItem_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#cstBsnisItem_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#cstBsnisItem_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#cstBsnisItem_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#cstBsnisItem_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#cstBsnisItem_idNumber").attr("validator","noValidator");
        		$scope.cstBsnisItemForm.$setPristine();
        		$("#cstBsnisItem_idNumber").removeClass("waringform ");
            }
        });
		//重置
		$scope.reset = function() {
			$scope.cstBsnisForm.idNumber= '';
			$scope.cstBsnisForm.externalIdentificationNo= '';
			$scope.cstBsnisForm.idType= '';
			$scope.itemList.params.customerNo= '';
			$scope.showItemList = false;
			$scope.showModifyDiv = false;
			$("#cstBsnisItem_idNumber").attr("validator","noValidator");
			$("#cstBsnisItem_idNumber").removeClass("waringform ");
		};
		//验证查询条件
		$scope.searchCstBsnisItem = function(){
			if(($scope.cstBsnisForm.idType == null || $scope.cstBsnisForm.idType == ''|| $scope.cstBsnisForm.idType == undefined) &&
				($scope.cstBsnisForm.customerNo == null || $scope.cstBsnisForm.customerNo == ''|| $scope.cstBsnisForm.customerNo == undefined) &&
				($scope.cstBsnisForm.idNumber == "" || $scope.cstBsnisForm.idNumber == undefined ) && ( $scope.cstBsnisForm.externalIdentificationNo == "" || $scope.cstBsnisForm.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				$scope.showModifyDiv = false;
				jfLayer.alert(T.T('F00076'));//"请输入证件号码或外部识别号"
			}else {
				if($scope.cstBsnisForm["idType"]){
					if($scope.cstBsnisForm["idNumber"] == null || $scope.cstBsnisForm["idNumber"] == undefined || $scope.cstBsnisForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
						$scope.showModifyDiv = false;
					}else {
						$scope.searchHandlee($scope.cstBsnisForm);
					}
				}else if($scope.cstBsnisForm["idNumber"]){
					if($scope.cstBsnisForm["idType"] == null || $scope.cstBsnisForm["idType"] == undefined || $scope.cstBsnisForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
						$scope.showModifyDiv = false;
					}else {
						$scope.searchHandlee($scope.cstBsnisForm);
					}
				}else {
					$scope.searchHandlee($scope.cstBsnisForm);
				}
			}
		};
		/*---客户基本信息事件---*/
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.custInf = data.returnData.rows[0];
					$scope.itemList.params = {};
					$scope.itemList.params = $.extend($scope.itemList.params,params);
					$scope.itemList.search();
					$scope.showModifyDiv = false;
				}else {
					$scope.showItemList = false;
					$scope.showModifyDiv = false;
				}
			});
		};
		/*---列表查询---*/
		$scope.itemList = {
			params :{
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			autoQuery : false,
			paging : true,// 默认true,是否分页
			resource : 'cstBsnisItem.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_cycleModel','dic_directDebitStatus','dic_directDebitMode'],//查找数据字典所需参数
			transDict : ['cycleModel_cycleModelDesc','directDebitStatus_directDebitStatusDesc','directDebitMode_directDebitModeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showItemList = true;
				}else{
					$scope.showItemList = false;
				}
			}
		};
		/*---统一日期修改btn事件---*/
		$scope.unifiedRevision = function(item){
			$scope.items = {};
			$scope.items.cycleNumber=item.currentCycleNumber;
			$scope.items.billDay=item.billDay;
			$scope.items.customerNo=item.customerNo;
			$scope.items.directDebitAccountNo=item.directDebitAccountNo;
			$scope.items.directDebitBankNo=item.directDebitBankNo;
			$scope.items.directDebitMode=item.directDebitMode;
			$scope.items.directDebitStatus=item.directDebitStatus;
			$scope.items.exchangePaymentFlag=item.exchangePaymentFlag;
			$scope.items.nextBillDate=item.nextBillDate;
			$scope.items.operationMode=item.operationMode;
			$scope.items.programDesc=item.programDesc;
			$scope.items.idType = $scope.itemList.params.idType;
			$scope.items.idNumber = $scope.itemList.params.idNumber;
			$scope.items.externalIdentificationNo = $scope.itemList.params.externalIdentificationNo;
			$scope.items.businessProgramNo = item.businessProgramNo;
			jfRest.request('unifiedEDateQuery', 'query', $scope.items).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows){
						$scope.modifyInfo=data.returnData.rows[0];
						$scope.modifyInfo.delinquencyDate=data.returnData.rows[0].delinquencyDate;
						$scope.showModifyDiv = $scope.modifyInfo.cycleNumber=='0' ? false : true;
					}
				}
			});
		};
		//确定修改成功
		$scope.confirmRevision = function(){
			$scope.modifyParams=$scope.items;
			$scope.modifyParams.cycleNumber=$scope.modifyInfo.cycleNumber;
			$scope.modifyParams.statementDate=$scope.modifyInfo.statementDate;
			$scope.modifyParams.paymentDueDate=$scope.modifyInfo.paymentDueDate;
			$scope.modifyParams.graceDate=$scope.modifyInfo.graceDate;
			$scope.modifyParams.delinquencyDate=$scope.modifyInfo.delinquencyDate;
			$scope.modifyParams.directDebitDate=$scope.modifyInfo.directDebitDate;
			jfRest.request('unifiedEDateQuery', 'queryList', $scope.modifyParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));//"修改成功"
					$scope.itemList.params.idType = $scope.items.idType;
					$scope.itemList.params.idNumber = $scope.items.idNumber;
					$scope.itemList.params.externalIdentificationNo =$scope.items.externalIdentificationNo;
					$scope.itemList.search($scope.itemList.params);
					$scope.showModifyDiv = false;
					$scope.modifyParams='';
				}
			});
		};
		//日期控件
		/*layui.use('laydate', function(){
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#lay_statementDate',
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
					$scope.modifyInfo.statementDate = $("#lay_statementDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#lay_paymentDueDate',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
					$scope.modifyInfo.paymentDueDate = $("#lay_paymentDueDate").val();
				}
			});
		});*/
	});
});
