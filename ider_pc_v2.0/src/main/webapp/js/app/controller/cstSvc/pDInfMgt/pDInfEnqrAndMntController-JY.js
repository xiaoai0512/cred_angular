'use strict';
define(function(require) {
	var webApp = require('app');
	//29产品信息查询及维护
	webApp.controller('pDInfEnqrAndMntCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEnqrAndMnt');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.updBtnFlag = false;
		//搜索身份证类型
		$scope.certificateTypeArray1 = 
			[ {name : T.T('F00113'),id : '1'},//身份证
			  {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
			  {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
			  {name : T.T('F00116') ,id : '4'} ,//中国护照
			  {name : T.T('F00117') ,id : '5'} ,//外国护照
			  {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.pDInfEnqrAndMntInfo.idNumber = '';
			if(data.value == "1"){//身份证
				$("#pDInfMnt_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#pDInfMnt_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#pDInfMnt_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#pDInfMnt_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#pDInfMnt_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#pDInfMnt_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#pDInfMnt_idNumber").attr("validator","noValidator");
				$scope.queryInfForm.$setPristine();
				$("#pDInfMnt_idNumber").removeClass("waringform ");
            }
        });
		 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
  			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnData != null || data.returnData != ""){
  					for(var i=0;i<data.returnData.length;i++){
  	   					$scope.eventList += data.returnData[i].eventNo + ",";
  	   				}
			   	   	if($scope.eventList.search('BSS.UP.01.0010') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		$scope.pDInfEnqrAndMntInfo = {
		};
		//ng-if属性
		$scope.showPDInfEnqrAndMntInfoBtn = false;
		//客户产品信息
		$scope.cstPDInfTable = {
//			checkType : 'radio',
			params :  {
					"pageSize":10,
					"indexNo":0,
					idNumber : $scope.pDInfEnqrAndMntInfo.idNumber,
					idType : $scope.pDInfEnqrAndMntInfo.idType,
					externalIdentificationNo : $scope.pDInfEnqrAndMntInfo.externalIdentificationNo
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstProduct.quereyProInf',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.reset = function() {
			$scope.pDInfEnqrAndMntInfo.idType= '';
			$scope.pDInfEnqrAndMntInfo.idNumber= '';
			$scope.pDInfEnqrAndMntInfo.externalIdentificationNo= '';
			$scope.pDInfEnqrAndMntInfo.customerNo= '';
			$scope.showPDInfEnqrAndMntInfoBtn = false;
			$("#pDInfMnt_idNumber").attr("validator","noValidator");
			$("#pDInfMnt_idNumber").removeClass("waringform ");
		};
		//查询客户基本资料
		$scope.searchPDInfEnqrAndMntInfo = function(){
			//参数
			$scope.paramss = {
					idNumber:$scope.pDInfEnqrAndMntInfo.idNumber,
					externalIdentificationNo:$scope.pDInfEnqrAndMntInfo.externalIdentificationNo,
					idType:$scope.pDInfEnqrAndMntInfo.idType,
					customerNo:$scope.pDInfEnqrAndMntInfo.customerNo,
			};
			if(($scope.pDInfEnqrAndMntInfo.idType == "" || $scope.pDInfEnqrAndMntInfo.idType == undefined ) &&
				($scope.pDInfEnqrAndMntInfo.idNumber == "" || $scope.pDInfEnqrAndMntInfo.idNumber == undefined ) &&
				($scope.pDInfEnqrAndMntInfo.externalIdentificationNo == "" || $scope.pDInfEnqrAndMntInfo.externalIdentificationNo == undefined ) ){
				$scope.showPDInfEnqrAndMntInfoBtn = false;
				jfLayer.alert(T.T('F00076'));//"请输入查询条件"
			}
			else {
				if($scope.pDInfEnqrAndMntInfo["idType"]){
					if($scope.pDInfEnqrAndMntInfo["idNumber"] == null || $scope.pDInfEnqrAndMntInfo["idNumber"] == undefined || $scope.pDInfEnqrAndMntInfo["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showPDInfEnqrAndMntInfoBtn = false;
					}else {
						$scope.searchHandlee($scope.paramss);
					}
				}else if($scope.pDInfEnqrAndMntInfo["idNumber"]){
					if($scope.pDInfEnqrAndMntInfo["idType"] == null || $scope.pDInfEnqrAndMntInfo["idType"] == undefined || $scope.pDInfEnqrAndMntInfo["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showPDInfEnqrAndMntInfoBtn = false;
					}else {
						$scope.searchHandlee($scope.paramss);
					}
				}else {
					$scope.searchHandlee($scope.paramss);
				}
			}
		};
		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showPDInfEnqrAndMntInfoBtn = true;
					$scope.idNumber=data.returnData.rows[0].idNumber;
					$scope.mobilePhone=data.returnData.rows[0].mobilePhone;
					$scope.customerName=data.returnData.rows[0].customerName;
					$scope.operationMode=data.returnData.rows[0].operationMode;
					$scope.customerNo2=data.returnData.rows[0].customerNo;
					//客户产品信息
					$scope.cstPDInfTable.params = Object.assign($scope.cstPDInfTable.params, params);
					//客户产品信息
					$scope.cstPDInfTable = {
//						checkType : 'radio',
						params :  {
								"pageSize":10,
								"indexNo":0,
								externalIdentificationNo : $scope.pDInfEnqrAndMntInfo.externalIdentificationNo,
								idNumber : $scope.pDInfEnqrAndMntInfo.idNumber,
								idType : $scope.pDInfEnqrAndMntInfo.idType
						}, // 表格查询时的参数信息
						paging : true,// 默认true,是否分页
						resource : 'cstProduct.quereyProInf',// 列表的资源
						callback : function(data) { // 表格查询后的回调函数
						}
					};
				}else {
					$scope.showPDInfEnqrAndMntInfoBtn = false;
				}
			});
		};
		//修改
		$scope.updateProInf = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.item.customerNo = $scope.customerNo;
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/pDInfMgt/pDinfMod.html', $scope.item, {
				title : T.T('KHJ3800002'),//'客户产品信息'
				buttons : [ T.T('F00107'),T.T('F00012')],//'确定', '关闭' 
				size : [ '800px', '300px' ],
				callbacks : [$scope.saveProInf]
			});
		};
		//保存
		$scope.saveProInf = function (result){
			$scope.saveParam = {
					customerNo : $scope.item.customerNo,
					productObjectCode : $scope.item.productObjectCode,
					coBrandedNo :  $scope.item.coBrandedNo,
				};
			if($scope.pDInfEnqrAndMntInfo.externalIdentificationNo){
				$scope.saveParam.externalIdentificationNo =$scope.pDInfEnqrAndMntInfo.externalIdentificationNo;
            }
            if($scope.pDInfEnqrAndMntInfo.idNumber){
				$scope.saveParam.idType =$scope.pDInfEnqrAndMntInfo.idType;
				$scope.saveParam.idNumber =$scope.pDInfEnqrAndMntInfo.idNumber;
			}
			jfRest.request('cstProduct', 'saveProUint', $scope.saveParam)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));//"修改成功！"
					 $scope.safeApply();
					 result.cancel();
					 $scope.cstPDInfTable.search();
				}
			});
		}
	});
	//
	webApp.controller('pDinfModCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEnqrAndMnt');
		$translate.refresh();
	});
});
