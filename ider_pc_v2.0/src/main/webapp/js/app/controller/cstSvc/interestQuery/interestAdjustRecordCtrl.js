'use strict';
define(function(require) {
	var webApp = require('app');
	// 利息调整补录
	webApp.controller('interestAdjustRecordCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interestAdjustRecord');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},
		{name : T.T('PZJ100021'),id : '0'} ];	
		$scope.rvlDbtTxnSplmtEntrgInfo = { };
		$scope.isShow1 = true;
//		$scope.ccy = [{name : T.T('KHJ1300001'),id : '156'},{name : T.T('KHJ1300002'),id :'840'}];//'人民币' '美元'
		//动态请求下拉框 
		 $scope.currenyArr ={ 
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
		//交易模式//'普通模式''快捷支付' '手机银行' 
		$scope.posEntryModeArray = [{name : T.T('KHJ1300003'),id : '0'},{name : T.T('KHJ1300004'),id : '1'},{name : T.T('KHJ1300005'),id : '2'}] ;
		//交易输入来源V-VISA、M-MC、C-银联、L-本行 '本地''银联'
		/*$scope.associArray = [{name : 'VISA',id : 'V'},{name : 'MC',id : 'M'}
							 ,{name : T.T('KHJ1300006'),id : 'L'},{name : T.T('KHJ1300007'),id : 'C'}];*/
		/*$scope.associArray={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ecommSourceCde",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	console.log(data)
		        }
		};*/
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
//	        	console.log(data)
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
//		        	console.log(data)
		        }
			};
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0,
					queryType : "I"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.queryFiniTrans',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//根据入账币种判断入账金额
		var form = layui.form;
		form.on('select(getinterestCurr)',function(event){
			if(($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == null || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == undefined || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == "") ||
					($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount == null || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount == undefined || $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount == "")){
				jfLayer.fail(T.T('KHH3000041'));
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
            if( $scope.isShow2 && (!$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCountryCde || !$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCityCde) ){
				 jfLayer.alert(T.T('KHJ1300008'));//"请输入交易国家代码/交易城市代码/输入来源！"
				 return;
			}
			$scope.eventNoTrends = "";
			$scope.eventNoTrends = "/cardService/" + $scope.itemList.checkedList().eventNo;
			$scope.rvlDbtTxnSplmtEntrgInfo.ecommEventId = $scope.itemList.checkedList().eventNo;
			//var str = $scope.itemList.checkedList().eventNo.split(".").join("");
			//var url = "trigger"+str;
			if($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransCurr == $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingCurr){
				if($scope.rvlDbtTxnSplmtEntrgInfo.ecommTransAmount != $scope.rvlDbtTxnSplmtEntrgInfo.ecommTransPostingAmount){
					jfLayer.fail(T.T('KHH3000042'));
					return;
				}
            }
            $scope.rvlDbtTxnSplmtEntrgInfo.ecommSubAccIdentify = "P";
			jfRest.request('fncTxnMgt','trends',$scope.rvlDbtTxnSplmtEntrgInfo,'',$scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00064'));//"交易成功"
					 $scope.rvlDbtTxnSplmtEntrgInfo = {};
					 $scope.rvlDbtTxnForm.$setPristine();
					 $scope.queryDate();
					 $scope.eventNoTrends = "";
				}else{
					$scope.eventNoTrends = "";
				}
			});
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.rvlDbtTxnSplmtEntrgInfo.ecommTransDate = data.returnData.rows[0].nextProcessDate;
					$scope.rvlDbtTxnSplmtEntrgInfo.ecommOriTransDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
	});
});
