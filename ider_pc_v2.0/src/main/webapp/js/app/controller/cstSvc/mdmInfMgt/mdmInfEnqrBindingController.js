'use strict';
define(function(require) {

	var webApp = require('app');

	// 30媒介信息建立
	webApp.controller('mdmInfEstbCtrlBinding', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		//查询产品媒介
		$scope.searchMdmInfEstbInfo = function(){
			if(($scope.searchParams.idNumber == "" || $scope.searchParams.idNumber== undefined)
					&& ($scope.searchParams.externalIdentificationNo == "" || $scope.searchParams.externalIdentificationNo== undefined) ){
				jfLayer.alert("请输入身份证号或者识别号！");
			}
			else{
				$scope.modal('/cstSvc/baseBsnPcsg/layerSearchProBinding.html', $scope.searchParams, {
					title : '媒介挂失',
					buttons : [ '确认','关闭' ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.callbackquery]
				});
			}
		};
		
		
	});

});
