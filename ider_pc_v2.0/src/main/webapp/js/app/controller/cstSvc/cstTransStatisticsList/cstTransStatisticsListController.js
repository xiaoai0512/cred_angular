'use strict';
define(function(require) {

	var webApp = require('app');

	// 账户基本信息
	webApp.controller('cstTransStatisticsController', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstTransStatisticsList/i18n_cstTransStatisticsList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		//核算状态码 
		$scope.isShow = false;
		
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
			$scope.itemList.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#cstTransStatis_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstTransStatis_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstTransStatis_idNumber").attr("validator","id_isTWCard");

			}else if(data.value == "4"){//中国护照
				$("#cstTransStatis_idNumber").attr("validator","id_passport");

			}else if(data.value == "5"){//外国护照passport
				$("#cstTransStatis_idNumber").attr("validator","id_passport");

			}else if(data.value == "6"){//外国人永久居留证
				$("#cstTransStatis_idNumber").attr("validator","id_isPermanentReside");

			}else if(data.value == "0" || data.value == "" || data.value == undefined || data.value == null){//请选择
				$("#cstTransStatis_idNumber").attr("validator","");
				$scope.cstTransStatisForm.$setPristine();
			}
			
		});
		
		//重置
		$scope.reset = function() {
			$scope.itemList.params.idNumber = '';
			$scope.itemList.params.externalIdentificationNo = '';
			$scope.itemList.params.idType= '';
			$scope.itemList.params.customerNo= '';
			
			$("#cstTransStatis_idNumber").attr("validator","");
			$scope.cstTransStatisForm.$setPristine();
			
			$scope.isShow = false;
		};
		
		$scope.queryitemList = function(){
			if(($scope.itemList.params.idType == null || $scope.itemList.params.idType == ''|| $scope.itemList.params.idType == undefined) &&
					($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined) && 
					($scope.itemList.params.externalIdentificationNo =="" || $scope.itemList.params.externalIdentificationNo ==undefined)){
				$scope.isShow = false;
				jfLayer.fail(T.T('KHJ2100001'));
			}else {
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.isShow = true;
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.isShow = true;
						$scope.itemList.search();
					}
				}else {
					$scope.isShow = true;
					$scope.itemList.search();
				}
			}
			
			
		};
		//查询
		$scope.itemList = {
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstTransStatisticsInf.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}else{
						var returnMsg = data.returnMsg ? data.returnMsg :  T.T('F00035');
								jfLayer.fail(data.returnCode+':'+data.returnMsg);
					}
				}
			};
		

	});

});
