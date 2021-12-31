'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('uFreeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_updatePass');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//验密开关
		$scope.typeVerifyArray ={};
		//小额免密开关
		$scope.typeSmallArray ={ };
		$scope.resultInfo = false;
		$scope.isUpdate = true;
		//查询详情事件
		$scope.selectList = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null)){
				jfLayer.fail(T.T('SQJ1200003'));
			}
			else{
				$scope.constomerInfo = {
						authDataSynFlag:"1",
						externalIdentificationNo:$scope.externalIdentificationNo //外部识别号
				};
				jfRest.request('cusInfo', 'cardQuery', $scope.constomerInfo).then(function(data) {
					$scope.resultInfo = true;
			    	$scope.item = data.returnData;
			    	//小额免密开关
					$scope.typeSmallArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_isYorN",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.smallAvoidPswFlag = $scope.item.smallAvoidPswFlag;
				        }
					};
					$scope.typeVerifyArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_isYorN",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.verifyPswFlag = $scope.item.verifyPswFlag;
				        }
					};
				});
			}
		};
		//确认保存密码事件
		$scope.sureInfo = function(){
			$scope.pass = {};
			$scope.pass = $scope.item;
			$scope.pass.authDataSynFlag = "1";
			$scope.pass.externalIdentificationNo = $scope.externalIdentificationNo;
			$scope.pass.smallAvoidPswFlag = $scope.smallAvoidPswFlag;
			$scope.pass.verifyPswFlag = $scope.verifyPswFlag;
			 jfRest.request('cusInfo', 'setDensityFree', $scope.pass).then(function(data) {
  	                if (data.returnMsg == 'OK') {
  	                	jfLayer.success(T.T('SQJ1200008'));
  	                	$scope.resultInfo = false;
  	      			    $scope.externalIdentificationNo = "";
  	                }
  	            });
		};
		//关闭事件
		$scope.closeInfo = function(){
			$scope.resultInfo = false;
			$scope.externalIdentificationNo = "";
		}
	});
});
