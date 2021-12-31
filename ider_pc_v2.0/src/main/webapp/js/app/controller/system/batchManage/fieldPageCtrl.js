'use strict';
define(function(require) {

	var webApp = require('app');

	//批量异常管理
	webApp.controller('fieldPageCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.getRequestURL = function() {
			   var localHref = window.location.href;
			   var pathName = document.location.pathname;
			   $scope.requestURL = '' ;
			   if(localHref.indexOf('#') >= 0){
			    $scope.requestURL = localHref.split("#")[0];
			   }else {
			    $scope.requestURL = document.location.pathname ;
			   }
			   $scope.requestURL = $scope.requestURL.replace(pathName,""); 
			   $scope.requestURL= $scope.requestURL.substring(0,$scope.requestURL.length - 4);
			   console.log($scope.requestURL);
			  };
			  $scope.getRequestURL();
		layui.use('upload', function(){
		  var $ = layui.jquery;
		  var upload = layui.upload;
		  upload.render({
		    elem: '#testVISA',
		    url: $scope.requestURL+'8085/upload/visa',
		    accept: 'file',
		    done: function(data){
		    	if(data.returnCode == '000000'){
					jfLayer.success(T.T("YWH5500066"));
					
				}else {
					var returnMsg = data.returnMsg ? data.returnMsg : T.T("YWH5500067");
					jfLayer.fail(returnMsg);
				}
		    }
		  });
		  
		  upload.render({
			    elem: '#testMC',
		    	url: $scope.requestURL+'8085/upload/mc',
			    accept: 'file',
			    done: function(data){
			    	if(data.returnCode == '000000'){
						jfLayer.success(T.T("YWH5500066"));
						
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T("YWH5500067");
						jfLayer.fail(returnMsg);
					}
			    }
			  });
		  
		  upload.render({
			    elem: '#testOther',
			    url: $scope.requestURL+'8085/upload/other',
			    accept: 'file',
			    done: function(data){
			    	if(data.returnCode == '000000'){
						jfLayer.success(T.T("YWH5500066"));
						
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T("YWH5500067");
						jfLayer.fail(returnMsg);
					}
			    }
			  });
		});
		
	});
});
