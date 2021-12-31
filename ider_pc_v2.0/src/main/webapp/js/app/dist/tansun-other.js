'use strict';
define(function(require) {
	var angular = require('angular');
	//计时
	Tansun.directive('jfCode', function ($interval,$injector) {
		var ATTR_PARAM = {
			text : 'text' ,//显示文本
			type : 'jfCode' ,//发送类型
			target : 'target',//接收人
			mode : 'mode',//发送方式
			captcha : 'captcha' //图形验证码
		};
	    return {
	        restrict: 'A',
	        scope: false ,
	        link: function (scope, element, attrs) {
	        	var $scope = scope.$new(false) ;
	        	
	        	var jfRest = $injector.get('jfRest');
	        	var jfLayer = $injector.get('jfLayer');
	        	var text = element.html() ;
	        	if(!text){
	        		text = '发送验证码' ;
	        	}
	        	
	        	$scope.send = function(e) {
	        		var preHanlde = scope.$eval(attrs.handle);
	        		if(preHanlde){
	        			preHanlde.success(function() {
	        				element.off('click');
	        				$scope.doSend(e) ;
						});
	        		}else{
	        			element.off('click');
	        			$scope.doSend(e) ;
	        		}
				};
				
				$scope.doSend = function(e) {
	        		$scope.param = {
		        		target : scope.$eval(attrs[ATTR_PARAM.target]),
		        		mode : attrs[ATTR_PARAM.mode],
		        		type : attrs[ATTR_PARAM.type],
		        		captcha : scope.$eval(attrs[ATTR_PARAM.captcha])
		        	} ;
	        		
					var send = jfRest.request('sendCode','get',Tansun.param($scope.param)) ;
					send.then(function(data) {
						if(data.status == 200){
							jfLayer.success('验证码发送成功');
							$scope.timing();
						}else{
							var error = scope.$eval(attrs.error) ;
							scope.$broadcast('refresh') ;
							element.click($scope.send);
							var msg = data.description ? data.description : '获取验证码失败，请重新获取';
							jfLayer.fail(msg) ;
						}
					});
				};
	        	
	        	$scope.timing = function() {
					scope.paraevent = true;
    				var second = 60 ;
	        		var timePromise = $interval(function(){ 
	        			if(second<=0){  
							scope.paraevent = false;
							$interval.cancel(timePromise);  
							element.html(text);
							element.click($scope.send);
	        			}else{  
	        				element.html(second + "s");
		                	second--;  
		                }  
		              },1000,100) ;
				};
				
				element.click($scope.send);
	        	
	        }
	    };
	});
	
	app.factory('jfHelper', function($rootScope,jfGlobal) {
		var instance = {
			getDict : function(code,group) {
				var dict = jfGlobal.dict[code] ;
				var result = [] ;
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
			getDictByKey : function(code,type) {
				var dict = jfGlobal.dict[code] ;
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
			},
			
			/**
			 * 获取该地址的下级列表
			 * @param code 地址代码
			 */
			getAddress : function(code) {
				var address = jfGlobal.address ;
				if(code){
					return address[code] ;
				}
				var addressList = [] ;
				for ( var key in address) {
					addressList = addressList.concat(address[key]) ;
				}
				
				return addressList ;
			},
			strEnc : function(value,pubKey) {
				if(!jfGlobal.isEntry){
					return value ;
				}
				if(value){
					switch (jfGlobal.algorithm) {
						case 'XXTEA':
							value = XXTEA.encryptToBase64(String(value), jfGlobal.pubKey);
							break;
						case 'des':
							value = strEnc(String(value), jfGlobal.pubKey);
							break;
						case 'base64':
							value = __BASE64.encoder(String(value));
							break;
						default:
							value = XXTEA.encryptToBase64(String(value), jfGlobal.pubKey);
					}
				}
				return value ;
			},
			isEmptyObject : function (e) {  
			    var t;  
			    for (t in e)  
			        return !1;  
			    return !0  
			},
			getUrlParams : function(paramNm, tableName, event) {
				var paramMap = {};
				tableName = tableName ? tableName : '';
				if(paramNm){
					var params = paramNm.split('&');
					for (var i = 0; i < params.length; i++) {
						if (params[i].indexOf("=") > -1) {
							var tmpVar = params[i].split("=");
							paramMap[tmpVar[0]] = jfModel.get(angular.element(event.target).scope(), tmpVar[1]);
						} else {
							if (!this.isEmptyObject($rootScope.checkItemMap.values())) { //存在选中才赋值
								var pm = $rootScope.checkItemMap.get(tableName);
								if(angular.isArray(pm) && pm.length > 0){
									var itemVal = '';
									for(var j = 0; j < pm.length; j++){
										itemVal = itemVal + "," + pm[j][params[i]];
									}
									itemVal = itemVal.substring(1);
									paramMap[params[i]] = itemVal;
								}else{
									paramMap[params[i]] = pm[params[i]];
								}
							}
						}
					}
				}
				return paramMap;
			}
		};
		return instance ;
	});
	
	/**
	 * 业务校验服务
	 */
	Tansun.factory('jfBizValidator', function($injector,jfGlobal) {
		
		
		var jfRest = $injector.get('jfRest');
		var jfLayer = $injector.get('jfLayer');
		
		function JfBizValidator(option) {
			this.option = option ;
        }
        JfBizValidator.prototype.isBlack = function(callback) {
			var black = jfRest.request('checkBlackWarn','query',Tansun.param(this.option)) ;
			black.then(function(data) {
				if(!data || !data.status || data.status == 100){
					jfLayer.fail(data.description || '操作失败');

				}else if(data.status == 200){
					callback() ;
				}else if(data.status == 300){
					jfLayer.confirm(data.description,function(){
						callback() ;
					},function(){
						
					}) ;
				}
			});
			
			return this ;
		};
		
		return {
			getInstance : function(option) {
				return new JfBizValidator(option) ;
			}
		} ;
	});
});