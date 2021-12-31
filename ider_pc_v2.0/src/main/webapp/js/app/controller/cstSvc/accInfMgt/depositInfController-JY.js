'use strict';
define(function(require) {

	var webApp = require('app');

	// 账户余额对象信息
	webApp.controller('depositInfCtrl-JY',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_depositInf');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShow = false;
		$scope.hide_depositInf = {};
		
		
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
        	 
        	 $scope.depositTable.params.idNumber = '';
        	 
        	 
         	if(data.value == "1"){//身份证
         		$("#depositInf_idNumber").attr("validator","id_idcard");
         	}else if(data.value == "2"){//港澳居民来往内地通行证
         		$("#depositInf_idNumber").attr("validator","id_isHKCard");
         	}else if(data.value == "3"){//台湾居民来往内地通行证
         		$("#depositInf_idNumber").attr("validator","id_isTWCard");

         	}else if(data.value == "4"){//中国护照
         		$("#depositInf_idNumber").attr("validator","id_passport");

         	}else if(data.value == "5"){//外国护照passport
         		$("#depositInf_idNumber").attr("validator","id_passport");

         	}else if(data.value == "6"){//外国人永久居留证
         		$("#depositInf_idNumber").attr("validator","id_isPermanentReside");

         	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
         		$("#depositInf_idNumber").attr("validator","noValidator");
         		$scope.depositInfForm.$setPristine();
         		
         		$("#depositInf_idNumber").removeClass("waringform ");
            }
         });
	
	// 重置
	$scope.reset = function() {
		$scope.depositTable.params.idType= '';
		$scope.depositTable.params.customerNo= '';
		$scope.depositTable.params.idNumber= '';
		$scope.depositTable.params.externalIdentificationNo= '';
		
		$scope.isShow = false;
		

		$("#depositInf_idNumber").attr("validator","noValidator");
		$("#depositInf_idNumber").removeClass("waringform ");
	};
	
	$scope.queryDepositTable = function() {
		if (($scope.depositTable.params.idType == null || $scope.depositTable.params.idType == undefined) &&
				($scope.depositTable.params.idNumber == null || $scope.depositTable.params.idNumber == undefined) &&
				 ($scope.depositTable.params.externalIdentificationNo == null || $scope.depositTable.params.externalIdentificationNo == undefined)) {
			jfLayer.fail(T.T('F00076'));//"请输入任意查询条件"
		} else{
			if($scope.depositTable.params["idType"]){
				if($scope.depositTable.params["idNumber"] == null || $scope.depositTable.params["idNumber"] == undefined || $scope.depositTable.params["idNumber"] == ''){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					$scope.isShow = false;
				}else {
					
					$scope.depositTable.search();
				}
			}else if($scope.depositTable.params["idNumber"]){
				if($scope.depositTable.params["idType"] == null || $scope.depositTable.params["idType"] == undefined || $scope.depositTable.params["idType"] == ''){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					$scope.isShow = false;
				}else {
					$scope.depositTable.search();
				}
			}else {
				$scope.depositTable.search();
			}
		}
		
		
	};
	
	$scope.depositTable = {
		params : {}, // 表格查询时的参数信息
		paging : true,// 默认true,是否分页
		resource : 'depositInf.query',// 列表的资源
		autoQuery : false,
		callback : function(data) { // 表格查询后的回调函数
			if(data.returnCode == '000000'){
				
				$scope.hide_depositInf = $scope.depositTable.params;
				
				$scope.isShow = true;
				if(!data.returnData.rows || data.returnData.rows.length == 0){
					data.returnData.rows = [];
				}
			}
		}
	};
	
	
	//查询
	$scope.checkItem = function(event) {
		$scope.itemInfo = $.parseJSON(JSON.stringify(event));
		
		$scope.itemInfo = $.extend($scope.itemInfo, $scope.hide_depositInf);
		// 页面 查询构件(弹出页面)
		$scope.modal('/cstSvc/accInfMgt/viewDepositInf.html', $scope.itemInfo, {
			title : T.T('KHJ4300001'),//'存款账户详细信息',
			buttons : [T.T('F00012')],// '关闭' 
			size : [ '1050px', '500px' ],
			callbacks : []
		});
	}
	
});
	
	
	webApp.controller('viewDepositCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_depositInf');
		$translate.refresh();
		
	});

});
