'use strict';
define(function(require) {

	var webApp = require('app');

	webApp.controller('uPassCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_updatePass');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//动态请求下拉框
		$scope.typeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_passType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.algorithmTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_algorithmType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		
		$scope.resultInfo = false;
		$scope.isUpdate = true;
		//查询详情事件
		$scope.selectList = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.expirationDate == "" || $scope.expirationDate == undefined || $scope.expirationDate == null) || 
					($scope.type == "" || $scope.type == undefined || $scope.type == null)){
				jfLayer.fail(T.T('SQJ1200003'));
			}
			else{
				$scope.resultInfo = true;
			}
			
		};
		var form = layui.form;
		form.on('select(gettype)',function(event){
			if($scope.type == '1'){
				$scope.isUpdate = true;
			}else{
				$scope.isUpdate = false;
				$scope.previousPssOff = ""
			}
		});
		//确认保存密码事件
		$scope.sureInfo = function(){
			$scope.pass = {};
			if($scope.type == '1'){
				if($scope.previousPssOff == "" || $scope.previousPssOff == undefined || $scope.previousPssOff == null){
					jfLayer.fail(T.T('SQJ1200004'));
				}else{
					if($scope.pssOff == $scope.pssOffConfirm){
						$scope.pass.authDataSynFlag = "1";
						$scope.pass.externalIdentificationNo = $scope.externalIdentificationNo;
						$scope.pass.expirationDate = $scope.expirationDate;
						$scope.pass.type = $scope.type;
						$scope.pass.previousPssOff = $scope.previousPssOff;
						$scope.pass.pssOff = $scope.pssOff;
						$scope.pass.pssOffConfirm = $scope.pssOffConfirm;
						$scope.pass.algorithmType = $scope.algorithmType;
						 jfRest.request('cusInfo', 'setPass', $scope.pass).then(function(data) {
		      	                if (data.returnMsg == 'OK') {
		      	                	jfLayer.success(T.T('SQJ1200005'));
		      	                }
		      	                else{
		      	                	jfLayer.fail(T.T('SQJ1200006') + data.returnMsg + "(" + data.returnCode + ")");
		      	                }
		      	            });
					}
					else{
						jfLayer.fail(T.T('SQJ1200007'));
					}
				}
			}else{
				if($scope.pssOff == $scope.pssOffConfirm){
					$scope.pass.authDataSynFlag = "1";
					$scope.pass.externalIdentificationNo = $scope.externalIdentificationNo;
					$scope.pass.expirationDate = $scope.expirationDate;
					$scope.pass.type = $scope.type;
					$scope.pass.previousPssOff = $scope.previousPssOff;
					$scope.pass.pssOff = $scope.pssOff;
					$scope.pass.pssOffConfirm = $scope.pssOffConfirm;
					$scope.pass.algorithmType = $scope.algorithmType;
					 jfRest.request('cusInfo', 'setPass', $scope.pass).then(function(data) {
	      	                if (data.returnMsg == 'OK') {
	      	                	jfLayer.success(T.T('SQJ1200005'));
	      	                	$scope.externalIdentificationNo = "";
	    						$scope.expirationDate = "";
	    						$scope.type = "";
	    						$scope.previousPssOff = "";
	    						$scope.pssOff = "";
	    						$scope.pssOffConfirm = "";
	    						$scope.resultInfo = false;
	    						$scope.passName.$setPristine();
	    						$scope.passUpdate.$setPristine();
	      	                }
	      	                else{
	      	                	jfLayer.fail(T.T('SQJ1200006') + data.returnMsg + "(" + data.returnCode + ")");
	      	                }
	      	            });
				}
				else{
					jfLayer.fail(T.T('SQJ1200007'));
				}
			}
		};
		//关闭事件
		$scope.closeInfo = function(){
			$scope.resultInfo = false;
			$scope.externalIdentificationNo = "";
			$scope.expirationDate = "";
			$scope.type = "";
			$scope.previousPssOff = "";
			$scope.pssOff = "";
			$scope.pssOffConfirm = "";
			$scope.algorithmType = "";
			$scope.passName.$setPristine();
			$scope.passUpdate.$setPristine();
		}
	});

});
