'use strict';
define(function(require) {

	var webApp = require('app');

	//会计引擎
	webApp.controller('accountEngineCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");

		
		console.log("accountEngineCtrl");
//		window.location.href = 'http://10.6.90.183:9301/aes/';
		
		
	});

});
