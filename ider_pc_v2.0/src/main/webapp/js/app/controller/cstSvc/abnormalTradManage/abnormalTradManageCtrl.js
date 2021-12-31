'use strict';
define(function(require) {
	var webApp = require('app');
	// 异常交易管理
webApp.controller('abnormalTradManageCtrl',function($scope, $stateParams,
		jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/abnormalTradManage/i18n_abnormalTradManage');
	$translate.refresh();
	$scope.userName = lodinDataService.getObject("menuName");//菜单名
	console.log( lodinDataService.getObject("menuName"));
	$scope.hide_abnormalTrad = {};
//	$scope.isShowDetail = false;
	//交易状态 N-未处理 Y-重入账成功 P-交易删除
	$scope.transBillingStateArr  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_transBillingState",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	};
		$scope.queryHandle= function() {
			if(($scope.abnormalTradList.params.idNumber == "" || $scope.abnormalTradList.params.idNumber == null || $scope.abnormalTradList.params.idNumber == undefined) 
					&& ($scope.abnormalTradList.params.idType == "" || $scope.abnormalTradList.params.idType == null || $scope.abnormalTradList.params.idType == undefined) && 
					($scope.abnormalTradList.params.externalIdentificationNo == "" || $scope.abnormalTradList.params.externalIdentificationNo == null || $scope.abnormalTradList.params.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('F00076'));
			}else{
				if($scope.abnormalTradList.params.idType){
					if($scope.abnormalTradList.params.idNumber == "" || $scope.abnormalTradList.params.idNumber == null || $scope.abnormalTradList.params.idNumber == undefined){
						jfLayer.fail(T.T('F00110'));

					}
					else{
						$scope.abnormalTradList.params.startDate = $("#abnormalTradList_zs").val();
						$scope.abnormalTradList.params.endDate = $("#abnormalTradList_ze").val();
						$scope.abnormalTradList.search();
					}
				}else if($scope.abnormalTradList.params.idNumber){
					if(!$scope.abnormalTradList.params.idType){
						jfLayer.fail(T.T('F00109'));

					}
					else{
						$scope.abnormalTradList.params.startDate = $("#abnormalTradList_zs").val();
						$scope.abnormalTradList.params.endDate = $("#abnormalTradList_ze").val();
						$scope.abnormalTradList.search();
					}
				}
				else{
					$scope.abnormalTradList.params.startDate = $("#abnormalTradList_zs").val();
					$scope.abnormalTradList.params.endDate = $("#abnormalTradList_ze").val();
					$scope.abnormalTradList.search();
				}
			}
		};
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#abnormalTradList_zs',
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
					elem: '#abnormalTradList_ze',
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
		/*$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
                            		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
                            		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
                            		{name : T.T('F00116') ,id : '4'} ,//中国护照
                            		{name : T.T('F00117') ,id : '5'} ,//外国护照
                            		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
*/		
		//动态请求身份证下拉框
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
			$scope.abnormalTradList.params.idNumber= '';
			if(data.value == "1"){//身份证
				$("#abnormalTradManage_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#abnormalTradManage_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#abnormalTradManage_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#abnormalTradManage_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#abnormalTradManage_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#abnormalTradManage_idNumber").attr("validator","id_isPermanentReside");
			}
		});
		//重置
		$scope.reset = function(){
			$scope.abnormalTradList.params.idNumber = '';
			$scope.abnormalTradList.params.idType = '';
			$scope.abnormalTradList.params.externalIdentificationNo = '';
			$scope.abnormalTradList.params.startDate = '';
			$scope.abnormalTradList.params.endDate = '';
			$scope.abnormalTradList.params.transBillingState = '';
			$scope.abnormalTradList.params.failureReason = '';
//		/$scope.isShowDetail = false;
		};
		//列表
		$scope.abnormalTradList = {
			checkType : 'radio',
			autoQuery:true,
			params : {
				"_CART":"A"
			},
			paging : true,
			resource : 'abnormalTrade.query',
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_transBillingState'],//查找数据字典所需参数
			transDict : ['transBillingState_transBillingStateDesc'],//翻译前后key
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.hide_abnormalTrad = $scope.abnormalTradList.params;
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		// 重入账
		$scope.reEntry = function(event) {
			$scope.abnorItem = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/abnormalTradManage/layerReEntery.html',
				$scope.abnorItem, {
					title : T.T('KHJ1700007'),
					buttons : [T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '350px' ],
					callbacks : [$scope.sureCall]
				});
		};
		//确定重入账
		$scope.sureCall = function(result){
			$scope.item = result.scope.upAbnorItem;
			console.log($scope.item);
			$scope.upParams = {
					transId: $scope.item.id,
					newExternalIdentificationNo:$scope.item.newExternalIdentificationNo,
					externalIdentificationNo: $scope.item.externalIdentificationNo,
					transDate: $scope.item.newTransDate,
					type: "Y",
					transFlag:'R',
					idType: $scope.item.idType,
					idNumber: $scope.item.idNumber
			};
			jfRest.request('abnormalTrade', 'update', $scope.upParams)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.abnormalTradList.search();
				}
			});
		};
		//强制入帐
		$scope.forceEntry = function(event){
			$scope.fItem = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T('KHJ1700011'),function() {
				$scope.fItem.transFlag = 'F';
				$scope.fItem.type = 'Y';
				$scope.fItem.transId = $scope.fItem.id;
				jfRest.request('abnormalTrade', 'update', $scope.fItem).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00064'));
						$scope.fItem = {};
						 $scope.abnormalTradList.search();
					}
				});
			},function() {
			});
		};
		//删除
		$scope.deleteItem = function(event) {
			$scope.deleParams = {
					transId : event.id,
					externalIdentificationNo: event.externalIdentificationNo,
					externalIdentificationNoOri: event.externalIdentificationNo_ori,
					type: "P",
					idType: event.idType,
					idNumber: event.idNumber,
					externalIdentificationNo: event.externalIdentificationNo
			};
			jfLayer.confirm(T.T('KHJ1700008'),function(){//确认删除
				jfRest.request('abnormalTrade', 'deleteA', $scope.deleParams).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('KHJ1700010'));
						$scope.abnormalTradList.search();
					} 
				});
			},function(){//取消
			});
		};
		//查看
		$scope.checkInfo = function(event){
			$scope.abnorItem = $.parseJSON(JSON.stringify(event));
			$scope.modal('/cstSvc/abnormalTradManage/viewAbnormal.html',
					$scope.abnorItem, {
					title : T.T('KHJ1700009'),
					buttons : [ T.T('F00012') ],
					size : [ '1100px', '550px' ],
					callbacks : []
			});
		};
	});
//重入账
webApp.controller('reEnteryDetailCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/abnormalTradManage/i18n_abnormalTradManage');
	$translate.refresh();
	$scope.upAbnorItem = $scope.abnorItem;
});
//查看
webApp.controller('viewAbnormalCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/abnormalTradManage/i18n_abnormalTradManage');
	$translate.refresh();
	//交易状态 N-未处理 Y-重入账成功 P-交易删除
	$scope.transBillingStateArr  ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_transBillingState",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewtransBillingState = $scope.abnorItem.transBillingState;
	        }
	};
	//拒绝来源 O-交易入账登记 B-请款文件
	$scope.refuseSourceArr={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_refuseSource",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.viewrefuseSource = $scope.abnorItem.refuseSource;
	        }
	};
	$scope.abnorItem = $scope.abnorItem;
});
});