'use strict';
define(function(require) {

	var webApp = require('app');

	//批量异常管理
	webApp.controller('batchAbnormalMagCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		//搜索身份证类型
		$scope.certificateTypeArray1 = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_IdCardType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.eventList = "";
		 $scope.baBtnFlag = false;
		 $scope.againBtnFlag = false;
		 
		 
		//联动验证
			var form = layui.form;
			form.on('select(getIdType)',function(data){
				if(data.value == "1"){//身份证
					$("#batchQuery_idNumber").attr("validator","id_idcard");
				}else if(data.value == "2"){//港澳居民来往内地通行证
					$("#batchQuery_idNumber").attr("validator","id_isHKCard");
				}else if(data.value == "3"){//台湾居民来往内地通行证
					$("#batchQuery_idNumber").attr("validator","id_isTWCard");

				}else if(data.value == "4"){//中国护照
					$("#batchQuery_idNumber").attr("validator","id_passport");

				}else if(data.value == "5"){//外国护照passport
					$("#batchQuery_idNumber").attr("validator","id_passport");

				}else if(data.value == "6"){//外国人永久居留证
					$("#batchQuery_idNumber").attr("validator","id_isPermanentReside");

				}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
					$("#batchQuery_idNumber").attr("validator","noValidator");
					$scope.batchQueryForm.$setPristine();
					
					$("#batchQuery_idNumber").removeClass("waringform ");
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
	   	   			if($scope.eventList.search('BSS.BH.00.9010') != -1){    //备份
	   					$scope.baBtnFlag = true;
	   				}
	   				else{
	   					$scope.baBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('BSS.BH.00.9000') != -1){    //重跑
	   					$scope.againBtnFlag = true;
	   				}
	   				else{
	   					$scope.againBtnFlag = false;
	   				}
  				}
  			});
		$scope.csInfParams= {
				ecommBatchFlag : ''
		};
		
		//運營模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//重跑
		$scope.reRunBtn = function(){
			if(($scope.csInfParams.ecommCustId == null || $scope.csInfParams.ecommCustId == undefined  || $scope.csInfParams.ecommCustId == "")&&
					($scope.csInfParams.idType == null || $scope.csInfParams.idType == undefined  || $scope.csInfParams.idType == "")&&
					($scope.csInfParams.idNumber == null || $scope.csInfParams.idNumber == undefined  || $scope.csInfParams.idNumber == "")){
				jfLayer.alert(T.T('KHJ1700006'));//"请输入查询条件！"
			}else {
				if($scope.csInfParams.idType){
					if($scope.csInfParams.idNumber == null || $scope.csInfParams.idNumber == undefined  || $scope.csInfParams.idNumber == ""){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.reRunFun($scope.csInfParams);
					}
				}else if($scope.csInfParams.idNumber ){
					if($scope.csInfParams.idType == null || $scope.csInfParams.idType == undefined  || $scope.csInfParams.idType == ""){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.reRunFun($scope.csInfParams);
                    }
                }
				
			}
		};
		
	//重跑函数
	$scope.reRunFun = function(params){
			params.ecommBatchFlag = 1;
			jfRest.request('batchMag', 'reRun', params).then(function(data) {
				if(data.returnCode == '000000'){
					jfLayer.success(T.T("F00034"));
					
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg : T.T("F00035");
					jfLayer.fail(returnMsg);
				}
				
				
			});
			
			
		};	
		
		//恢复备份
		/*$scope.tt =function() {
				location.href = ctx + "/pages/iderLogin.html";
		}*/
		$scope.restoreBackupBtn = function(){
			if(($scope.csInfParams.idType == null || $scope.csInfParams.idType == undefined  || $scope.csInfParams.idType == "")&&
					($scope.csInfParams.idNumber == null || $scope.csInfParams.idNumber == undefined  || $scope.csInfParams.idNumber == "")){
				jfLayer.alert(T.T('KHJ1700006'));//"请输入查询条件！"
			}else {
				if($scope.csInfParams.idType){
					if($scope.csInfParams.idNumber == null || $scope.csInfParams.idNumber == undefined  || $scope.csInfParams.idNumber == ""){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.restoreBackupFun($scope.csInfParams);
					}
				}else if($scope.csInfParams.idNumber ){
					if($scope.csInfParams.idType == null || $scope.csInfParams.idType == undefined  || $scope.csInfParams.idType == ""){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.restoreBackupFun($scope.csInfParams);
                    }
                }
				
			}
		
		};
		
		//恢复备份函数
		$scope.restoreBackupFun = function(params){
			
			jfRest.request('batchMag', 'restoreBackup', params).then(function(data) {
				if(data.returnCode == '000000'){
					jfLayer.success(T.T("F00034"));
					
					$("#reRunBtn").attr("disabled",false);
					$("#reRunBtn").removeClass("layui-btn-disabled");
					
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg : T.T("F00035");
					jfLayer.fail(returnMsg);
				}
				
				
			});
			
		};
		
	});

});
