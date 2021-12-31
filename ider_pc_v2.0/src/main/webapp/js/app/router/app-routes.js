'use strict';
define(function(require, exports, module) {
	var webApp = require('app');
	var config = require('./app/configuration/route-config');
	
	webApp.config([
	   			'jfGlobal',
	   			'$stateProvider',
	   			'$urlRouterProvider',
	   			'$locationProvider',
	   			function(jfGlobal,$stateProvider, $urlRouterProvider,$locationProvider) {
	   				var template = '';						
					angular.forEach(config, function(data,index,array){
						var uiView = data.url.split("?")[0];
						var indexArr = data.url.split("?")[0].split("/");
						var indexId = "";
						
						angular.forEach(indexArr, function(data){
							indexId = indexId + data;
						});
						
						template = template + ' <div id=\"'+indexId+'\" ui-view=\"'+uiView+'\" ng-show="$state.includes(\'root.'+uiView+'\')"></div>';
					});
					
					$stateProvider.state('root', {
						url: '',
						template: template
					  });
					
					angular.forEach(config, function(data){
						$stateProvider.state("root."+data.url.split("?")[0],data);
					});
					$urlRouterProvider.otherwise('/index');
					//$locationProvider.html5Mode(true);						
			}]).config(function($stickyStateProvider) {
				  $stickyStateProvider.enableDebug(true);
			})
			.config(['$translateProvider','$translatePartialLoaderProvider',function($translateProvider,$translatePartialLoaderProvider){
		       // $translatePartialLoaderProvider.addPart('i18n');
		        $translateProvider.useLoader('$translatePartialLoader', {
		            urlTemplate: '{part}/{lang}.json'
		        });
		        //$translateProvider.preferredLanguage('en');
		    }])
			/*.config(['$translateProvider',function($translateProvider){
				//var lang = window.localStorage['lang'] || 'cn';
				var lang = 'cn';
				$translateProvider
					.preferredLanguage(lang)
					.useStaticFilesLoader({
						prefix: ctx+'/json/i18n/',
						suffix: '.json'
					})
					//$translateProvider.fallbackLanguage('en');//默认加载语言包
			}])*/
			.run(function ($rootScope, $state) {
			  $rootScope.$state = $state;
			});
			
	
});
