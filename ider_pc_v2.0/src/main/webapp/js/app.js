'use strict';
define(function (require, exports, module) {
	var jQuery = require('jquery');
	var angular = require('angular');
	var asyncLoader = require('angular-async-loader');
	//require('angular-translate-files');
	require('angular-ui-route');
	require('angular-resource');
	require('angular-loader');
	require('angular-sanitize');
	require('angular-progress');
	require('angular-slider');
	require('angular-validator');
	require('angular-validator-rules');
    require('angular-file-uploader');
    
	Tansun.app = angular.module('webApp',['pascalprecht.translate','ngLocale','ngSlide','ngSanitize','ngResource','ui.router','ngProgress','ct.ui.router.extras.sticky','validation.rule','angularFileUpload']);
	

	//将必须加载的JS加载完再开始angular渲染
	require(['tansun-resful','tansun-layer','app-routes','tansun-dependent','tansun-translate','tansun-table','tansun-form','tansun-charts','tansun-system','angular-translate-files','angular-translate-partial'],function(){
		require(Tansun.overallScript,function(){
			angular.element(document).ready(function () {
				var injector = angular.injector(['ng']);
				var $q = injector.get('$q') ;
				$q.all(Tansun.loadConstants()).then(function() {
					angular.bootstrap(document, ['webApp']);
					angular.element(document).find('html').addClass('ng-app');
				}) ;
			});
		}) ;
		
	}) ;
	//即将去除这个全局参数
	Tansun.app.constant('jfGlobal', {
	    version: (new Date()).valueOf(),
	    _: (new Date()).valueOf(),
	    ctx: ctx,
	    $:jQuery,
	    config:[],
	    pubKey : 'F3,wg:elY+',
	    algorithm : 'XXTEA',
	    _actionMuneId:"",
	    _currentLoaction:"",
	    isEntry : false 
	});
	
	Tansun.app.run(function($rootScope,jfGlobal,$timeout,$location,$window,$stateParams,$state,$compile,$anchorScroll,jfLayer,jfRest,$translate) {
		$anchorScroll.yOffset = 120;
		$rootScope.ctx = ctx ;
		$rootScope.global = {} ;
		
	    
		//安全执行脏值检查
		$rootScope.safeApply = function() {
			if(!this.$$phase){
				this.$apply() ;
			}
		};
		//注册resful资源
		if(resfulConfig){
			jfRest.register(resfulConfig);
		}
		//设置用户信息
		$rootScope.setUser = function(user) {
			$rootScope._user = user || {};
		};
		//获取用户信息
		$rootScope.getUser = function(){
			return $rootScope._user || {} ; 
		};
		
		//获取p7加密信息
		$rootScope.SignMsgPKCS7 = function(sourceHashData){
			return 	CryptoAgent.SignMsgPKCS7(Tansun.param(sourceHashData), "SHA-1", true);
		};
		
		//切换主题，
		$rootScope.theme = function(theme) {
			$rootScope.global.theme = theme || $rootScope.global.theme || 'default';
			var themePath = Tansun.getContextPath() + '/theme/' + $rootScope.global.theme ;
			
			$rootScope.global.imgPath = themePath + "/images"  ;
			$rootScope.global.cssPath = themePath + "/css" ;
			$rootScope.global.pagePath = ctx + '/pages' ;
			Tansun.style($rootScope.global.cssPath , Tansun.overallStyle);
			
			this.safeApply() ;
		};
		
		$rootScope.$on('$viewContentLoaded',function(event){
			angular.element('input').attr('autocomplete','off') ;
			/*if(Tansun.plugins){
				Tansun.plugins.render() ;
			}*/
//			$rootScope._loadNeedModule(event.targetScope);
//			if(typeof Tansun.plugins.render === 'function'){
//				Tansun.plugins.render() ;
//			}
		});
		
		$rootScope.$on('$stateChangeSuccess',function(ev, to, toParams, from, fromParams){
			$rootScope.previousState = from; //from为前一个页面的路由信息：url,cache,views,name  
			 if(fromParams._){//f5刷新页面时没有上一页，不处理。保持原来的记录
		         $rootScope.previousParams = fromParams; //fromParams为前一个页面的ID信息  
			 }
	         $rootScope.nowState = to; //to为当前页面的路由信息：url,cache,views,name，同样，toParams为当前页面的ID信息  
			angular.forEach($rootScope.tabList,function(tab){
				if(tab.isActive){
					tab.backChainKey = tab.backChainKey || [] ;
					tab.backChainValue = tab.backChainValue || [] ;
					
					var index = tab.backChainKey.indexOf($state.$current.name) ;
					if(index >= 0){
						tab.backChainKey.splice(index,tab.backChainKey.length - index);
						tab.backChainValue.splice(index,tab.backChainValue.length - index) ;
					}
					tab.backChainKey.push($state.$current.name) ;
					tab.backChainValue.push($location.url()) ;
				}
			}) ;
			
		}) ;
		
		$rootScope.$watch('tabList',function(newValue,oldValue){
			if(angular.equals(newValue,oldValue)){
				return ;
			}
			$rootScope.setStorege('tabList',newValue) ;
		},true);
		
		//获取选项
		$rootScope.builder = {} ;
		$rootScope.builder.option = function() {
			if(arguments.length < 0){
				throw '构建选项时首参数为必传' ;
			}
			var config = {
				options : []
			} ;
			
			if(angular.isArray(arguments[0])){
				var datas = arguments[0] ;
				var valueProperties = arguments[1] || 'id' ;
				var textProperties = arguments[2] || 'name' ;
				
				angular.forEach(datas,function(item){
					config.options.push({
						value : item[valueProperties],
						text : item[textProperties],
					}) ;
				}) ;
			}else{
				var code = arguments[0] ;
				var group = arguments[1] == undefined ? '' :  String(arguments[1]);
				
				angular.forEach(Tansun.helper.getDict(code),function(item){
					if(!group){
						config.options.push(item) ;
						return ;
					}
					if(item.group&&(item.group).indexOf(group)>-1){
						config.options.push(item) ;
					}
				});
			}
			
			return config ;
		};
		
		$rootScope.builder.grid = function() {
			
		};
		
		$rootScope.getUrlParam = function(paramNm,datas) {
			var paramMap = {};
			var scope = this ;
			if(paramNm){
				var params = paramNm.split('&');
				
				angular.forEach(params,function(param){
					if(param.indexOf('=') > -1){
						var tmpVar = param.split("=");
						if(!tmpVar[1]){
							paramMap[tmpVar[0]] =tmpVar[1];
						}
						//字符串包含运算符直接返回
						if((tmpVar[1].indexOf("-") >= 0||tmpVar[1].indexOf("+") >= 0||tmpVar[1].indexOf("*") >= 0||tmpVar[1].indexOf("/") >= 0)&&tmpVar[1].indexOf("'")>=0){
							paramMap[tmpVar[0]]=scope.$eval(tmpVar[1]);//这些符号会自动加上单引号需要去掉单引号
						
						}else if((tmpVar[1].indexOf("-") >= 0||tmpVar[1].indexOf("+") >= 0||tmpVar[1].indexOf("*") >= 0||tmpVar[1].indexOf("/") >= 0)&&tmpVar[1].indexOf("'")<0){
							paramMap[tmpVar[0]]=tmpVar[1];
						
						}else{
							if(tmpVar[1].indexOf("$scope.")>=0||tmpVar[1].indexOf("'")>=0||(scope.$eval(tmpVar[1])&&tmpVar[1].indexOf("'")<0)){
								paramMap[tmpVar[0]] = scope.$eval(tmpVar[1]);
							}else{
								paramMap[tmpVar[0]] =tmpVar[1];
							}
						}

					}else{
						var itemVal = '';
						var dataArray=[];
						//如果是对象将对象转换为数组
						if(typeof datas === 'object' && isNaN(datas.length)){
							dataArray.push(datas);
						}else{
							dataArray=datas;
						}
						angular.forEach(dataArray,function(item){
							itemVal = itemVal + "," + item[param];
						}) ;
						itemVal = itemVal.substring(1);
						paramMap[param] = itemVal;
					}
				}) ;
			}
			return paramMap;
		};
		
		$rootScope.turn = function(url,datas) {
			//http开头的url直接跳转不做处理
			if(url.substr(0,4)=="http"){
				window.location=url;
			}else{
				var targetUrl, paramNm;
				if (url.indexOf("#") > -1) {
					targetUrl = url.split('#')[0] ;
					paramNm = url.split('#')[1] ;
				} else {
					targetUrl = url.split('?')[0] ;
					paramNm = url.split('?')[1] ;
				}
				
				var search = this.getUrlParam(paramNm,datas);
				if(search){
					search._ = Tansun.GUID("V") ;
				}
				//$state.go("root."+targetUrl,search,{reload:true});
				$state.go("root."+targetUrl,search);
			}
		};
		
		$rootScope.modal = function(url,datas,option) {
			option = option || {} ;
			var targetUrl, paramNm;
			if (url.indexOf("#") > -1) {
				targetUrl = url.split('#')[0] ;
				paramNm = url.split('#')[1] ;
			} else {
				targetUrl = url.split('?')[0] ;
				paramNm = url.split('?')[1] ;
			}
			
			var $scope = this.$new(false) ;
			
			$scope._modal = {
				id : Tansun.GUID('modal'),
				url : $rootScope.global.pagePath + targetUrl ,
				param : $scope.getUrlParam(paramNm,datas),
				close : function() {
					jfLayer.close($scope._modal.index);
					angular.element('#layui-layer' + $scope._modal.index).remove();
					element.remove() ;
					$scope.$destroy() ;
					$scope.safeApply() ;
				}
			} ;
			var element = angular.element('<div>') ;
			element.attr('id' , $scope._modal.id) ;
			var include = angular.element('<div ng-include="_modal.url"><div>') ; 
			element.append(include);
			$compile(element)($scope) ;
			angular.element('body').append(element) ;
			
			var title = option.title;
			var size ;
			if(angular.isArray(option.size)){
				size = option.size ;
			}else if(angular.isDefined(option.size)){
				size = option.size.split(",") ;
			}
			
			option.callbacks = option.callbacks || [] ;
			option.callbacks.push($scope._modal.close) ; //默认最后一个函数是关闭窗体
			
			$scope._modal.index = jfLayer.modal($scope._modal.id,title,size,option.buttons,option.callbacks) ;
			return $scope._modal ;
		};
		
		$rootScope.back = function() { 
			var url;
			angular.forEach($rootScope.tabList,function(tab){
				if(tab.isActive){
					tab.backChainKey = tab.backChainKey || [] ;
					tab.backChainValue = tab.backChainValue || [] ;
					
					var index = tab.backChainKey.indexOf($state.$current.name) ;
					if(index >= 0){
						tab.backChainKey.splice(index,1);
						tab.backChainValue.splice(index,1) ;
					}
					
					url = tab.backChainValue[index-1];
					return false;
				}
			}) ;
			if(url){
				var targetUrl, paramNm;
				if (url.indexOf("#") > -1) {
					targetUrl = url.split('#')[0] ;
					paramNm = url.split('#')[1] ;
					//转成对象传递
					paramNm = this.getUrlParam(paramNm,"");
				} else {
					targetUrl = url.split('?')[0] ;
					paramNm = url.split('?')[1] ;
					//转成对象传递
					paramNm = this.getUrlParam(paramNm,"");
				}
				$state.go("root."+targetUrl,paramNm);
			}else{
				$state.go($rootScope.previousState.name, $rootScope.previousParams,{reload:true});
			}
			
		};
		
		$rootScope.getStorege = function(key) {
			if(!sessionStorage){
				return null ;
			}
			return angular.fromJson(sessionStorage.getItem(key)) ;
		};
		$rootScope.clearStore = function() {
			 sessionStorage.clear();
		};
		
		$rootScope.setStorege = function(key,value) {
			if(!sessionStorage){
				return ;
			}
			if(typeof value === 'object'){
				sessionStorage.setItem(key,angular.toJson(value));
			}else{
				sessionStorage.setItem(key,value);
			}
		};
		
		$rootScope.tabList = $rootScope.getStorege('tabList') || [];
		$rootScope.theme() ;

        Tansun.setDictToCache();
		
	});
	
	
	Tansun.app.factory('lodinDataService',['$window',function($window) {
		 return{        
			 	//存储单个属性
		        set :function(key,value){
		          $window.sessionStorage[key]=value;
		        },        
		        //读取单个属性
		        get:function(key,defaultValue){
		          return  $window.sessionStorage[key] || defaultValue;
		        },        
		        //存储对象，以JSON格式存储
		        setObject:function(key,value){
		          $window.sessionStorage[key]=JSON.stringify(value);
		        },        
		        //读取对象
		        getObject: function (key) {
		          return JSON.parse($window.sessionStorage[key] || '{}');
		        }

		      }
	}]);
	
	Tansun.app.factory('filter',['$window',function($window) {
		 return{        
			 	//过滤空值或者字符串为“null”
			 filterNull : function(obj){
		          for(var key in obj){
		        	  if(obj[key] == null || obj[key] == "null" || obj[key] == undefined || obj[key] == "undefined"){
		        		  obj[key] = "";
		        	  }
		          }
		        }  
		      }
	}]);
	Tansun.app.filter('T', ['$translate', function($translate) {
	    return function(key) {
	        if(key){
	            return $translate.instant(key);
	        }
	    };
	}]);
	Tansun.app.factory('T', ['$translate', function($translate) {
	    var T = {
	            T:function(key) {
	                if(key){
	                    return $translate.instant(key);
	                }
	                return key;
	            }
	        };
	        return T;
	    }]);
	
	asyncLoader.configure(Tansun.app);
	module.exports = Tansun.app;
	
});