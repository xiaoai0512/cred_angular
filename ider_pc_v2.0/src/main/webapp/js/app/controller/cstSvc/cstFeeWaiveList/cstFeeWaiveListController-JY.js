'use strict';
define(function(require) {

	var webApp = require('app');

	// 账户基本信息
	webApp.controller('cstFeeWaiveListCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstFeeWaiveList/i18n_cstFeeWaiveList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		//核算状态码 
		$scope.isShow = false;
		
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
	                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
	                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
	                                		{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
	                                		{name : T.T('F00119'),id : '0'}  ];	//其他
		
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.itemList.params.idNumber= '';
			if(data.value == "1"){//身份证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_isTWCard");

			}else if(data.value == "4"){//中国护照
				$("#cstFeeWaiveList_idNumber").attr("validator","id_passport");

			}else if(data.value == "5"){//外国护照passport
				$("#cstFeeWaiveList_idNumber").attr("validator","id_passport");

			}else if(data.value == "6"){//外国人永久居留证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_isPermanentReside");

}
        });
		
		//重置
		$scope.reset = function() {
			$scope.itemList.params.idNumber=  '';
			$scope.itemList.params.externalIdentificationNo=  '';
			$scope.itemList.params.idType= '';
			$scope.itemList.params.customerNo= '';
			
			$scope.isShow = false;
		};
		
		$scope.queryitemList = function(){
			console.log($scope.itemList.params.credentialNumber);
			console.log($scope.itemList.params.externalIdentificationNo);
			if(($scope.itemList.params.idType == null || $scope.itemList.params.idType == ''|| $scope.itemList.params.idType == undefined) &&
					($scope.itemList.params.customerNo == null || $scope.itemList.params.customerNo == ''|| $scope.itemList.params.customerNo == undefined) &&
					
					($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined) && ($scope.itemList.params.externalIdentificationNo =="" || $scope.itemList.params.externalIdentificationNo ==undefined)){
				$scope.isShow = false;
				jfLayer.fail(T.T('KHJ2800001'));
			}else{
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else{
						$scope.itemList.search();
					}
				}else {
					
					$scope.itemList.search();
				}
			}
			
		};
		//查询
		$scope.itemList = {
				params : $scope.queryParam = {}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstFeeWaiveInf.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.isShow = true;
		        	}else {
		        		$scope.isShow = false;
		        	}
				}
			};

	});

});
