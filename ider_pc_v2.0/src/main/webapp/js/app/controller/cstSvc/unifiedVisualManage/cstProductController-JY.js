'use strict';
define(function(require) {

	var webApp = require('app');

	// 客户产品视图
	webApp.controller('cstProductCtr-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstProductList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		//搜索身份证类型
				$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
				                                 {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
				                                 {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
				                                 {name : T.T('F00116') ,id : '4'} ,//中国护照
				                                 {name : T.T('F00117') ,id : '5'} ,//外国护照
				                                 {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证


             //联动验证
             var form = layui.form;
             form.on('select(getIdType)',function(data){
            	 
            	$scope.itemList.params.idNumber = ''; 
            	 
             	if(data.value == "1"){//身份证
             		$("#cstProItem_idNumber").attr("validator","id_idcard");
             	}else if(data.value == "2"){//港澳居民来往内地通行证
             		$("#cstProItem_idNumber").attr("validator","id_isHKCard");
             	}else if(data.value == "3"){//台湾居民来往内地通行证
             		$("#cstProItem_idNumber").attr("validator","id_isTWCard");

             	}else if(data.value == "4"){//中国护照
             		$("#cstProItem_idNumber").attr("validator","id_passport");

             	}else if(data.value == "5"){//外国护照passport
             		$("#cstProItem_idNumber").attr("validator","id_passport");

             	}else if(data.value == "6"){//外国人永久居留证
             		$("#cstProItem_idNumber").attr("validator","id_isPermanentReside");

             	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
             		$("#cstProItem_idNumber").attr("validator","noValidator");
             		$scope.cstProductItemForm.$setPristine();
             		
             		$("#cstProItem_idNumber").removeClass("waringform ");
                }
             });
    	
		$scope.isShow = false;
		
		//重置
		$scope.reset = function() {
			$scope.itemList.params.idNumber= '';
			$scope.itemList.params.externalIdentificationNo= '';
			$scope.itemList.params.idType= '';
			$scope.itemList.params.customerNo= '';
			
			$scope.isShow = false;

			$("#cstProItem_idNumber").attr("validator","noValidator");
			$("#cstProItem_idNumber").removeClass("waringform ");
		};
		$scope.queryProductInf = function(){
			if(($scope.itemList.params.idType == null || $scope.itemList.params.idType == ''|| $scope.itemList.params.idType == undefined) &&
					($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined )
					&&( $scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.itemList.params["idType"]) {
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == '') {
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.isShow = true;
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]) {
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
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryProduct',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							$scope.isShow = true;
						}
					}else{
						$scope.isShow = false;
					}
				}
			};
	});

});
