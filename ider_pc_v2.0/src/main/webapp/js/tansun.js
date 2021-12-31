'use strict';
var Tansun ;
define(['jquery','angular'],function() {
	Tansun = {};
	var angular = require('angular');
	var injector = angular.injector(['ng']);
	var $http = injector.get('$http');
	var $q = injector.get('$q');
	/**
	 * 设置页面的渲染方法
	 */
	Tansun.setPlugins = function(plugins) {
		Tansun.plugins = plugins;
	};
	
	Tansun.loadScript = function(url,callback) {
		return require([url],function(script){
			if(typeof callback === 'function'){
				callback(script) ;
			}
		}) ;
	};
	
	Tansun.loadCss = function(url) {
		var link = angular.element('<link>') ;
		link.attr({
			rel: "stylesheet",
			type: "text/css",
			href: url
		});
		link.appendTo("head");
		return link ;
	};
	
	Tansun.style = function(baseUrl,styles) {
		var thiz = this ;
		thiz.loaded = thiz.loaded || [] ;
		angular.forEach(thiz.loaded,function(loaded){
			loaded.remove() ;
		}) ;
		
		angular.forEach(styles,function(style){
			thiz.loaded.push(Tansun.loadCss(baseUrl + style));
		}) ;
	};
	
	Tansun.Map = function() {
		var Map = function () {
			this._data = {} ;
		};

		Map.prototype.put = function(key,value) {
			this._data[key] = value ;
		};

		Map.prototype.get = function(key) {
			return this._data[key] ;
		};

		Map.prototype.values = function() {
			var values = [] ;

			for ( var key in this._data) {
				values.push(this._data[key]) ;
			}
			
			return values ;
		};

		Map.prototype.remove = function(key) {
			delete this._data[key] ;
		};

		Map.prototype.removeAll = function() {
			this._data = {} ;
		};

		Map.prototype.keySet = function() {
			var keySet = [] ;
			
			for ( var key in this._data) {
				keySet.push(key) ;
			}
			
			return keySet ;
		};

		Map.prototype.containsKey = function(key) {
			return this.keySet().indexOf(key) > -1;
		};

		Map.prototype.containsValue = function(value) {
			return this.values().indexOf(value) > -1 ;
		};
		
		return new Map() ;
	};
	
	Tansun.GUID = function(prefix) {
		if(!Tansun.GUID.counter){
			Tansun.GUID.counter = 0 ;
		}

		var guid = new Date().getTime();
		var pad = function (num, n) {
			return Array(n>num?(n-(''+num).length+1):0).join(0)+num;  
		};
		return (prefix || 'Tansun_') + guid + pad(Tansun.GUID.counter++,4);
	};
	
	Tansun.param = function(param) {
		param = param || {} ;
		return jQuery.param(param) ;
	};
	
	Tansun.getContextPath = function(){   
	   /* var pathName = document.location.pathname;   
	    var index = pathName.substr(1).indexOf("/");   
	    var result = pathName.substr(0,index+1);   */
	    return ctx; 
	};
	
	Tansun.getRequestURL = function() {
		var localHref = window.location.href;
		var requestURL = '' ;
		if(localHref.indexOf('#') >= 0){
			requestURL = localHref.split("#")[1];
		}else {
			requestURL = document.location.pathname ;
		}
		return requestURL ;
	};
	
	Tansun.factory = function(name,method) {
		if(this.app == null){
			throw 'app not define' ;
		}
		
		this.app.factory(name,method) ;
	};
	
	Tansun.controller = function(name,method) {
		if(this.app == null){
			throw 'app not define' ;
		}
		
		this.app.controller(name,method) ;
	};
	
	Tansun.service = function(name,method) {
		if(this.app == null){
			throw 'app not define' ;
		}
		
		this.app.service(name,method) ;
	};
	
	Tansun.directive = function(name,method) {
		if(this.app == null){
			throw 'app not define' ;
		}
		
		this.app.directive(name,method) ;
	};
	
	Tansun.filter = function(name,method) {
		if(this.app == null){
			throw 'app not define' ;
		}
		
		this.app.filter(name,method) ;
	};
	
	Tansun.Date = {
		format : function(date,fmt) {
			var o = {
		        "M+": date.getMonth() + 1, //月份 
		        "d+": date.getDate(), //日 
		        "H+": date.getHours(), //小时 
		        "m+": date.getMinutes(), //分 
		        "s+": date.getSeconds(), //秒 
		        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		        "S": date.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}
	}; 
	Tansun.resource = {} ;
	
	Tansun.cache = new Tansun.Map() ;

	Tansun.helper = {
		getDict : function(key) {
			//将数据字典集合存到缓存
			Tansun.setDictToCache();
			var dict = Tansun.cache.get('dict') || {} ;		
			return dict[key] ;
		},
		
		getDictWithGroup: function(key,group) {
			//将数据字典集合存到缓存
			Tansun.setDictToCache();
			var dicts = Tansun.cache.get('dict') || {} ;
			var dict = dicts[key]; 
			var result =[];
			if(group){
        		var groups = group.split(',') ;
        		angular.forEach(dict,function(item){
        			if(!item.group){
        				return ;
        			}
        			var itemGroup = item.group.split(',') ;
        			angular.forEach(itemGroup,function(val){
        				if(groups.indexOf(val) >= 0){
        					result.push(item) ;
        				}
        			});
	        	}) ;
        	}else{
        		result = dict ;
        	}
        	return result ;
		},
		
		getDictValueByKey : function(code,type) {
			//将数据字典集合存到缓存
			Tansun.setDictToCache();
			var dicts = Tansun.cache.get('dict') || {} ; 
			var dict = dicts[code]; 
			var result ;
        	if(type){
        		angular.forEach(dict,function(item){
        			if(!item.type){
        				return ;
        			}
        			if(type == item.type){
						result = item.value;

        			}
	        	});
        	}else{
        		result = null ;
        	}
        	return result ;
		}
	};
	
	Tansun.session = {
		setAttribute : function(key,value) {
			Tansun.cache.put(key,value);
		},
		getAttribute : function(key) {
			return Tansun.cache.get(key);
		},
		removeAttribute : function(key) {
			Tansun.cache.remove(key);
		}
	};
	
	Tansun.upload = function(option) {
		if(!option || !option.elem){
			throw '文件上传器需指定使用上传器的元素' ;
		}
		
		var scope = angular.element(option.elem).scope() ;
		
		option.url = option.url || scope.global.uploader.server + scope.global.uploader.upload ;
		option.data = option.data || {} ;
		option.accept = option.accept || 'images';
		option.exts = option.exts || 'jpg|png|gif|bmp|jpeg' ;
		option.auto = angular.isDefined(option.auto) ? option.auto : true ;
		option.size = option.size || 5120 ;
		option.drag = false ;
		
		option.download = function(url) {
			window.open(url) ;
		};
		
		layui.use(['upload'],function(){
			var uploader = layui.upload ;
			option.plugin = uploader.render(option);
		}) ;
		
		return option ;
	};
	
	//根据路由的api和method返回后台请求的action路径
	Tansun.getResful = function(api,method) {
		var resfulUrl;
		angular.forEach(resfulConfig,function(resource,restapi){
			if(restapi==api){
				angular.forEach(resource,function(url,restmethod){
					if(restmethod==method){
						resfulUrl=resfulConfig[api][method].url;
					}
				}) ;
			}
		}) ;
		return resfulUrl; 
	};

	//将数据字典集合存到缓存
	Tansun.setDictToCache = function() {
		if(!Tansun.cache.get('dict')){
			$q.when($http.get(ctx + '/json/dict.json')).then(function(data) {
				Tansun.cache.put('dict',data.data.data);
			}) ;
		}
	};
	
});
