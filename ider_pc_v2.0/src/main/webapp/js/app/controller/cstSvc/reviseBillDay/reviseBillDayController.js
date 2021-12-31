'use strict';
define(function(require) {
	var webApp = require('app');
	//客户信息建立
	webApp.controller('reviseBillDayCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/reviseBillDay/i18n_reviseBillDay');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.isShow = false;
		//重置
		$scope.reset = function() {
			$scope.reviseBillDayList.params.idNumber= '';
			$scope.reviseBillDayList.params.externalIdentificationNo= '';
			$scope.reviseBillDayList.params.idType= '';
			$scope.reviseBillDayList.params.customerNo= '';
			$scope.isShow = false;
			$('#reviseBillDay_idNumber').attr('validator','noValidator');
			$('#reviseBillDay_idNumber').removeClass('waringform');
		};
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
		                     			{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		                     			{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		                     			{name : T.T('F00116') ,id : '4'} ,//中国护照
		                     			{name : T.T('F00117') ,id : '5'} ,//外国护照
		                     			{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
		                     		];			
 		//联动验证
 		var form = layui.form;
 		form.on('select(getIdType)',function(data){
 			$scope.reviseBillDayList.params.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#reviseBillDay_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#reviseBillDay_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#reviseBillDay_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#reviseBillDay_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#reviseBillDay_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#reviseBillDay_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.queryAccountInf = function(){
			if(($scope.reviseBillDayList.idType == null || $scope.reviseBillDayList.idType == ''|| $scope.reviseBillDayList.idType == undefined) &&
					($scope.reviseBillDayList.customerNo == null || $scope.reviseBillDayList.customerNo == ''|| $scope.reviseBillDayList.customerNo == undefined) &&
					($scope.reviseBillDayList.params.idNumber == "" || $scope.reviseBillDayList.params.idNumber == undefined )
					&&( $scope.reviseBillDayList.params.externalIdentificationNo == "" || $scope.reviseBillDayList.params.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}
			else {
				if($scope.reviseBillDayList["idType"] ){
					if($scope.reviseBillDayList["idNumber"] == null || $scope.reviseBillDayList["idNumber"] == undefined || $scope.reviseBillDayList["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.reviseBillDayList.search();
					}
				}else if($scope.reviseBillDayList["idNumber"]){
					if($scope.reviseBillDayList["idType"] == null || $scope.reviseBillDayList["idType"] == undefined || $scope.reviseBillDayList["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.reviseBillDayList.search();
					}
				}else {
					$scope.reviseBillDayList.search();
				}
			}
		};
		//修改账单日
		$scope.updateBillDay = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/reviseBillDay/checkReviseBillDay.html', $scope.item, {
				title : T.T('KHJ800002'),//'修改账单日',
				buttons : [T.T('F00107'),T.T('F00012')  ],//'确定', '关闭'
				size : [ '1050px', '400px' ],
				callbacks : [ $scope.selectCorporat ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.selectCorporat = function(result) {
			$scope.paramss = result.scope.checkReviseBillDay;
			if(result.scope.billMonthWeek){
				$scope.paramss.billDay  = result.scope.checkReviseBillDay.billDayMonth;
			}else{
				$scope.paramss.billDay  = result.scope.checkReviseBillDay.billDayWeek;
			}
			$scope.paramss.idType = $scope.reviseBillDayList.params.idType;
			$scope.paramss.idNumber = $scope.reviseBillDayList.params.idNumber;
			$scope.paramss.externalIdentificationNo = $scope.reviseBillDayList.params.externalIdentificationNo;
			console.log($scope.paramss);
			jfRest.request('updateBillDay', 'update', $scope.paramss)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					//if(data.returnData!=null){
					//	$scope.reviseBillDayList.params.customerNo = data.returnData.customerNo;
						$scope.reviseBillDayList.params.customerNo = result.scope.checkReviseBillDay.customerNo;
						jfLayer.success(T.T('F00022'));//"修改成功"
						$scope.reviseBillDayList.search();
						$scope.safeApply();
						result.cancel();
				//	}
				}
				});
		};
		//查询列表
		$scope.reviseBillDayList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'cstBsnisItem.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.isShow = true;
					}else {
						$scope.isShow = false;
					}
				}
			};
	});
	webApp.controller('checkReviseBillDayCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/reviseBillDay/i18n_reviseBillDay');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.checkReviseBillDay ={};
		$scope.checkReviseBillDay = $scope.item;
		$scope.billMonthWeek = true;
		//账单日
		$scope.statementDateArr =
									[ {name : '01', id : '1'}, {name : '02',id : '2'},{name : '03', id : '3'}, {name : '04',id : '4'},{name : '05',id : '5'},
		                            {name : '06', id : '6'}, {name : '07',id : '7'},{name : '08', id : '8'}, {name : '09',id : '9'},{name : '10',id : '10'},
		                            {name : '11', id : '11'}, {name : '12',id : '12'},{name : '13', id : '13'}, {name : '14',id : '14'},{name : '15',id : '15'},
		                            {name : '16', id : '16'}, {name : '17',id : '17'},{name : '18', id : '18'}, {name : '19',id : '19'},{name : '20',id : '20'},
		                            {name : '21', id : '21'}, {name : '22',id : '22'},{name : '23', id : '23'}, {name : '24',id : '24'},{name : '25',id : '25'},
		                            {name : '26', id : '26'}, {name : '27',id : '27'},{name : '28', id : '28'}];
    	$scope.statementDateArrWeek =
			[ {name : '01', id : '1'}, {name : '02',id : '2'},{name : '03', id : '3'}, {name : '04',id : '4'},{name : '05',id : '5'},
            {name : '06', id : '6'}, {name : '07',id : '7'}];
    	//查询构件实例
    	$scope.params ={};
		$scope.params.artifactNo = "506";
		$scope.params.operationMode = $scope.checkReviseBillDay.operationMode;
		$scope.params.instanCode = $scope.checkReviseBillDay.businessProgramNo;
		$scope.params.elementNo = "506AAA01";
		jfRest.request('artifactExample', 'query', $scope.params).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData!=null && data.returnData.rows!=null){
					if("506AAA0101"==data.returnData.rows[0].elementNo){
						$scope.billMonthWeek = false;
						$scope.checkReviseBillDay.billDayWeek = $scope.checkReviseBillDay.billDay;
					}else{
						$scope.checkReviseBillDay.billDayMonth = $scope.checkReviseBillDay.billDay;
					}
				}
			}
		});
	});
});
