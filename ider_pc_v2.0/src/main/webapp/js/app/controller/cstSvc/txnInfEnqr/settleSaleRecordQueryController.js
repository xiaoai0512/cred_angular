'use strict';
define(function(require) {

	var webApp = require('app');

	// 交易历史表查询
	webApp.controller('settleSaleRecordQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		
		$scope.hide_settleSaleRecordQuery ={};
		$scope.	isShowDetail = false;
		
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  
			  var startDate = laydate.render({
					elem: '#LAY_demorange_zss',
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
					elem: '#LAY_demorange_zee',
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
			
			$scope.transHistTable.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#settleSaleRecordQuery_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#settleSaleRecordQuery_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#settleSaleRecordQuery_idNumber").attr("validator","id_isTWCard");
	
			}else if(data.value == "4"){//中国护照
				$("#settleSaleRecordQuery_idNumber").attr("validator","id_passport");
	
			}else if(data.value == "5"){//外国护照passport
				$("#settleSaleRecordQuery_idNumber").attr("validator","id_passport");
	
			}else if(data.value == "6"){//外国人永久居留证
				$("#settleSaleRecordQuery_idNumber").attr("validator","id_isPermanentReside");

}
        });
		
		$scope.reset = function(){
			$scope.transHistTable.params.idNumber = '';
			$scope.transHistTable.params.externalIdentificationNo = '';
			$scope.transHistTable.params.startDate = '';
			$scope.transHistTable.params.endDate = '';
			$scope.transHistTable.params.idType= '';
			$scope.transHistTable.params.customerNo= '';
			
			$scope.	isShowDetail = false;
			
		};
		
		$scope.queryAccountInf = function() {
			
			$scope.transHistTable.params.startDate = $("#LAY_demorange_zss").val();
			$scope.transHistTable.params.endDate = $("#LAY_demorange_zee").val();
			
			if (($scope.transHistTable.params.idType == null || $scope.transHistTable.params.idType == ''|| $scope.transHistTable.params.idType == undefined) &&
					($scope.transHistTable.params.customerNo == null || $scope.transHistTable.params.customerNo == ''|| $scope.transHistTable.params.customerNo == undefined) &&
					($scope.transHistTable.params.idNumber == "" || $scope.transHistTable.params.idNumber == undefined)
					&& ($scope.transHistTable.params.externalIdentificationNo == "" || $scope.transHistTable.params.externalIdentificationNo == undefined)) {
				jfLayer.alert(T.T('KHJ900001'));//"请输入任意查询条件！"
			} 
			else {
				if($scope.transHistTable.params["idType"]){
					if($scope.transHistTable.params["idNumber"] == null || $scope.transHistTable.params["idNumber"] == undefined || $scope.transHistTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.	isShowDetail = false;
					}else {
						$scope.transHistTable.search();
					}
				}else if($scope.transHistTable.params["idNumber"]){
					if($scope.transHistTable.params["idType"] == null || $scope.transHistTable.params["idType"] == undefined || $scope.transHistTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.	isShowDetail = false;
					}else {
						$scope.transHistTable.search();
					}
				}else {
					console.log($scope.transHistTable.params.startDate);
					$scope.transHistTable.search();
				}
			}
			
		};
		
		$scope.transHistTable = {
				params : {
					"activityNo" : "X8010",
					"logLevel" : "A",
				},
				paging : true,
				resource : 'settleSaleRecord.query',
				autoQuery : false,
				callback : function(data) {
					if(data.returnCode == '000000'){
						$scope.hide_settleSaleRecordQuery.idType = $scope.transHistTable.idType;
						$scope.hide_settleSaleRecordQuery.idNumber = $scope.transHistTable.idNumber;
						$scope.hide_settleSaleRecordQuery.externalIdentificationNo = $scope.transHistTable.externalIdentificationNo;
						
						$scope.isShowDetail = true;
					}else {
						$scope.isShowDetail = false;
					}
				}
			};
		
		// 页面弹出框事件(弹出页面)
		$scope.checkInfo = function(event) {
			$scope.transHistDetailInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/txnInfEnqr/transHistDetailInfo.html',
			$scope.transHistDetailInfo, {
				title : T.T('KHH1800096'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '660px' ],
				callbacks : []
			});
		};
		
	});
	
	webApp.controller('transHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		
	});
	
});