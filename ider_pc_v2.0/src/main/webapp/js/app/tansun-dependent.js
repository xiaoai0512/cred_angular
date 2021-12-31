'use strict';
define(function (require, exports, module) {
	var angular = require('angular');
	var option = require('./app/custom/custom-dependent') ;
	
	var quene = [] ;
	var injector = angular.injector(['ng']);
	var $http = injector.get('$http');
	var $q = injector.get('$q');
	
	var plugins = option.plugin || {} ;
	if(!option.plugin){
		Tansun.loadScript('layui',function(layui){
			layui.config({
				dir: ctx + '/js/libs/layui/'
			}); 
			var autoLoadLayuiCss =angular.isDefined(option.autoLoadLayuiCss)?option.autoLoadLayuiCss:true;
			if(autoLoadLayuiCss){
				Tansun.loadCss(Tansun.getContextPath() + '/js/libs/layui/css/layui.css') ;
				Tansun.loadCss(Tansun.getContextPath() + '/js/libs/layui/css/modify_layui.css') ;
			}
			layui.use(['form'],function(){
				plugins.render = layui.form.render ;
				
				layui.form.on('select',function(data){
					var element = angular.element(data.elem) ;
					var scope = element.scope();
					var ngModel = element.attr('ng-model') ;
					scope.$eval(ngModel + '="' + data.value + '"') ;
					scope.safeApply() ;
				});
				
				
				layui.form.on('radio',function(data){
					var element = angular.element(data.elem) ;
					var scope = element.scope();
					var ngModel = element.attr('ng-model') ;
					if(ngModel){
						scope.$eval(ngModel + '="' + data.value + '"') ;
						scope.safeApply() ;	
					}
				});
			}) ;
			
			layui.use(['laydate'],function(){
				plugins.date = layui.laydate.render ;
			}) ;
			
			var deferred = $q.defer();
			quene.push(deferred);
			layui.use(['layer'],function(){
				deferred.resolve(true);
				plugins.layer = layui.layer ;
			}) ;
			
			//layui扩展
			layui.extend({
				tableChild: ctx + '/js/libs/ext/tableChild',
				treeTable: ctx + '/js/libs/treeTable/treeTable', // {/}的意思即代表采用自有路径，即不跟随 base 路径
			});
		}) ;
	}
	
	//定义全局样式
	Tansun.overallStyle = option.overallStyle || ['/web_blue.css','/datacss/calendarAll.css','/datacss/skin.css','/datacss/fontSize12.css','/datacss/calendar.css'];
	//定义全局脚本
	Tansun.overallScript = option.overallScript || ['./app/common','./app/devCommon','./app/configuration/resful-config'] ;
	
	Tansun.setPlugins(plugins) ;
	//获取权限的资源坐标
	Tansun.resource.permission = Tansun.resource.permission || 'permission.query' ;
	//获取系统常量的坐标
	Tansun.resource.config = Tansun.resource.config || '/config' ;
	//获取数据字典的坐标
	Tansun.resource.dict = Tansun.resource.dict || '/dict' ;
	
	Tansun.loadConstants = function() {
	/*	quene.push($q.when($http.post(ctx + Tansun.resource.dict)).then(function(data) {
			Tansun.cache.put('dict',data.data.data);
		})) ;*/
		
//		quene.push($q.when($http.post(ctx + Tansun.resource.dict)).then(function(data) {
//			Tansun.cache.put('dict',data.data);
//		})) ;
		
		return quene ;
	};
	
	Tansun.getWrap = function() {
		var isCSS1 = /CSS1Compat/.test( document.compatMode );
	    var isWebkit = /webkit/ig.test( navigator.userAgent );
	    var wrap = isCSS1 && !isWebkit  ? document.documentElement : document.body ;
	    return wrap ;
	};
});