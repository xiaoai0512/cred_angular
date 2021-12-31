﻿ 'use strict';
define(function(require) {
	var angular = require('angular');
	require('tansun-dependent') ;
	
	Tansun.directive('jfFormatInput', function (jfGlobal,$injector,$compile) {
		var ATTR_TYPE = "jfFormatInput" ;
		var hanlder = {
			format : function(value,type,length) {
				var typeArr;
				if (type) {
				    typeArr = type.split(":")[0];
				} else {
					typeArr = type
				}
				switch (typeArr) {
				case 'money':
					return this.money(value,length);
				case 'bankCard' :
					return this.bankCard(value) ;
				case 'percentage':
					return this.percentage(value) ;
				default:
					return this.money(value);
				}
			},
			money :function(value,length) {
                if (value || value == 0) {
                   var temp;
                    
//                    if(/.+(\..*\.|\-).*/.test(value)){
//                        return value;
//                    }
                    value = this.restore(value);
                    var values = value.split(".") ;
                    var left = values[0].split("").reverse();
                    var right = values[1];
                    var temp = "";
                    for(var i = 0; i < left.length; i ++ ) {
                    	temp += left[i] ;
                    	//判断是否该补逗号
                    	if((i + 1) % 3 == 0 && (i + 1) != left.length && (left[i+1]!='-')){
                    		temp += "," ;
                    	}
                    }
                    value = temp.split("").reverse().join("");
                    //如果输入了小数点
                    if(right || right === ''){
                    	if(!length){
                    		length=2;
                    	}
                    	right=right.substring(0,length);
                    	value = value + "." + right;
                    }
                    return value;
                }
			},
			bankCard : function(value) {
				if (value) {
					value = value.trim() ;
					value = value.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
				}
	            return value ;
			},
			percentage : function(value) {
				if (value) {
					value = Number(value*100).toFixed(0);
				}
	            return value ;
			},
			
			restore : function(value,type) {
				var typeArr;
				if (type) {
				    typeArr = type.split(":")[0];
				} else {
					typeArr = type
				}
				switch (typeArr) {
				case 'money':
					return String(value).replace(/[^\d\.-]/g, "") ;
					break;
				case 'bankCard' :
					return value.replace(/\ +/g,"") ;
					break ;
				case 'percentage' :
					return value*0.01 ;
					break ;	
				default:
					return String(value).replace(/[^\d\.-]/g, "") ; 
					break;
				}
			}
		};
		
	    return {
	    	restrict: 'A',
	    	require: 'ngModel',
			scope: false,//独立作用域，防止污染父级作用域
	        link: function (scope, element, attrs, ngModel) {
	        	var type,foramt,reuslt ; //标签属性
				type =  attrs[ATTR_TYPE] || 'money' ;
				
				ngModel.$parsers.push(function(value) {
					if(value){
						//金额前几位不能为0，自动截取掉
						if(value.length>1&&value.substring(0,2)!="0."&&value.substring(0,1)=="0"){
							value=value.replace(/\b(0+)/gi,"");
						}
						if(value.length>1&&value.lastIndexOf('-')>0){
							var subVaule=value.substring(1,value.length);
							value=value.substring(0,1)+subVaule.replace('-',"");
						}
						value = value.replace('.00','');
						return hanlder.restore(value,type,attrs.length) ;
					}
					
				});
	        	ngModel.$formatters.push(function(value) {
	        		if(value||value==0){
		        		if(type == 'money' && String(value).indexOf('.') < 0){
		        			value += '.00' ;
		        		}
						return hanlder.format(value,type,attrs.length) ;
	        		}
				}) ;
	        	
	        	ngModel.$viewChangeListeners.push(function(value) {
	        		element.val(hanlder.format(ngModel.$modelValue,type,attrs.length));
				}) ;
				
	        	if(type == 'money'){
	        		element.on('blur',function(){
		        		var value = ngModel.$modelValue ;
		        		if(value&&value!="-"){
			        		if(String(value).indexOf('.') < 0){
			        			value += '.00' ;
			        		}
			        		element.val(hanlder.format(value,type,attrs.length));
		        		}else{
		        			element.val('0.00');
		        		}
		        	});
        		}
	        }
	    };
	});
	
	Tansun.directive('jfCheckbox', function ($injector,jfGlobal,$timeout) {
		return {
			restrict: 'EA',
			replace: true,
			scope: false,
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				var $scope = scope.$new(false);
				
	        	var $compile = $injector.get('$compile') ;
            	var callback = null ;
            	var checkArrs = ngModel.$viewValue;
            	if (checkArrs) {
            		$scope.selection = checkArrs.split(",");
				}
            	if (!$scope.selection) {
            		$scope.selection = [];
            	} 
            	var html = element.context.outerHTML ;
	        	var hideHtml= angular.element(html).attr("type","hidden");
	        	hideHtml.removeAttr('jf-checkbox');
	        	//是否每个复选框单独显示一行showtype= list为显示一行，其余属性都是平铺
	        	var showtype=attrs.showtype;
	        	var liHtml='';
	        	if(showtype=="list"){
	        		liHtml="<li>";
	        		html+="</ul>"
	        	}
				var disabled = attrs.disabled != undefined ? 'disabled' : '';
	        	var $span = angular.element('<span ng-repeat="item in options"></span>');
	        	var input = disabled ? '' : liHtml+'<a href="javascript:void(0);" ng-click="toggleSelection(item.value)" >';
	        		input += '<input title="{{item.text}}" type="checkbox"'; 
	        		input += ' ng-model="' + attrs.ngModel + '" ' + disabled + ' value="{{item.value}}" ng-checked="selection.indexOf(item.value) > -1"  lay-skin="primary" />';
	        		input += disabled ? '' : '</a>';
	        		if(showtype=="list"){
		        		input+="</li>"
		        	}	
	        	var $checkbox = angular.element(input);
	        	$span.append($checkbox);
	        	element.replaceWith($span);
	        	if(showtype=="list"){
	        		var beHtml=angular.element("<ul class='row'>");
	        		$span.before(beHtml);
		        	$compile(beHtml)($scope) ;
	        	}
	        	$span.after(hideHtml);
	        	$scope.toggleSelection = function toggleSelection(fruitName) {
	        		
	        	    var idx = $scope.selection.indexOf(fruitName);
	        	    if (idx > -1) {
	        	      $scope.selection.splice(idx, 1);
	        	    } else {
	        	      $scope.selection.push(fruitName);
	        	    }
	        	    ngModel.$setViewValue($scope.selection.join(",")) ;
	        	    var jfCheckbox= $scope.$eval(attrs.jfCheckbox)|| {};
	        	    if (jfCheckbox.callback && typeof(jfCheckbox.callback) === 'function' ) {
	        	    	jfCheckbox.callback($scope.selection);
					}
	        	};
	        	
	        	$scope._setOptions = function(jfCheckbox) {
	        		jfCheckbox = jfCheckbox || {} ;
	        		$scope.options = jfCheckbox.options;
	        		$timeout(function(){
		        		Tansun.plugins.render('checkbox');
					});
	        		if(jfCheckbox.callback){
	            		jfCheckbox.callback($scope.selection);
	            	}
				};
	        	
	        	$scope.$watch(attrs.ngModel, function(newValue, oldValue) {
	        		if (newValue) {
    					if (!angular.isArray(newValue)) {
    						newValue = newValue.split(",");
    					}
	        			$scope.selection = newValue;
						$timeout(function(){
							Tansun.plugins.render('checkbox');
						});
					}else{
						$scope.selection = [];
						$timeout(function(){
							Tansun.plugins.render('checkbox');
						});
					}
	        	});
                if(attrs.jfCheckbox.indexOf('(') <= 0){
                	$scope.$watch(attrs.jfCheckbox,function(newCheckbox,oldCheckbox){
                		if(angular.equals(newCheckbox,oldCheckbox)){
                			return ;
                		}
                		$scope._setOptions(newCheckbox) ;
            		}) ;
                	$scope._setOptions($scope.$eval(attrs.jfCheckbox)) ;
                }else{
                	//如果jfCheckbox是个方法，监听该属性值的变化
                	attrs.$observe('jfCheckbox',function(attr) {
                		$scope._setOptions($scope.$eval(attr)) ;
                    })
                }
	        	
	        	$compile($span)($scope) ;
	        	$compile(hideHtml)($scope) ;
			}
		};
	});
	
	/**
	 * jf-radio
	 * 单选框组组件
	 */
	Tansun.directive('jfRadio', function ($injector,jfGlobal,$timeout) {
		return {
	        restrict: 'EA',
            replace: true,
            template: 
            	'<div></div>',
            scope: false,
	        require: 'ngModel',
	        link: function (scope, element, attrs,ngModel) {

	        	var $scope = scope.$new(false);
	        	var $compile = $injector.get('$compile') ;
	        	var radio = angular.element(element.context.outerHTML); 
	           	radio.attr("type","radio");
	         	radio.attr("title","{{item.text}}");
	         	radio.attr("value","{{item.value}}");
	        	radio.attr("ng-repeat","item in options");
	        	radio.removeAttr('jf-radio'); 
	        	element.replaceWith(radio) ;
	        	$scope._setOptions = function(jfRadio) {
	        		jfRadio = jfRadio || {} ;
	        		$scope.options = jfRadio.options;
	        		$timeout(function(){
		        		Tansun.plugins.render('radio');
					});
				};
	        	 if(attrs.jfRadio.indexOf('(') <= 0){
	                	$scope.$watch(attrs.jfRadio,function(newValue,oldValue){
	                		if(angular.equals(newValue,oldValue)){
	                			return ;
	                		}
	                		$scope._setOptions(newValue) ;
	            		}) ;
	                	$scope._setOptions($scope.$eval(attrs.jfRadio)) ;
	                }else{
	                	//如果jfRadio是个方法，监听该属性值的变化
	                	attrs.$observe('jfRadio',function(attr) {
	                		$scope._setOptions($scope.$eval(attr)) ;
	                    })
	                }
	        	 $compile(radio)($scope);

	        	//值改变监控
	        	$scope.$watch(attrs.ngModel, function(newValue, oldValue) {
        			if(angular.isObject(newValue)){
            		} else {
            			newValue = String(newValue);
            		}
            		ngModel.$setViewValue(newValue) ;
					$timeout(function(){
						Tansun.plugins.render('radio');
					});
				
        	});
	        }
	    };
	});
	
	Tansun.directive('jfDateInput', function ($injector,$compile,$timeout) {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	        link: function (scope, element, attrs, ngModel) {
	        	var id = attrs.id || Tansun.GUID('date') ;
	        	element.attr('readonly','readonly') ;
	        	var html = element.context.outerHTML ;
	        	
	            var jfDateInput = scope.$eval(attrs.jfDateInput) || {} ;
	            var plugins = {
	            	elem : '#' + id ,
	            	format : jfDateInput.format || 'yyyy-MM-dd',
	            	type : jfDateInput.type || 'date' ,//设置日期弹出框可选类型，默认只能选年月日，datetime为年月日时分秒
	            	btns: ['clear', 'confirm'],
	            	done : function(value) {
	            		ngModel.$setViewValue(value) ;
	            		scope.safeApply() ;
					}
	            } ;
	            //初始化默认格式化
	            ngModel.$formatters.push(function(value) {
	            	$timeout(function() {
	            		if(value){
	            			if(typeof value=='string'){
	            				value=new Date(Date.parse(value.replace(/-/g, "/")));
	            			}
	            			ngModel.$setViewValue(Tansun.Date.format(value,plugins.format)) ;
	            		}
	    			});
				}) ;
	            
	            
	            var open = function() {
            		var max = scope.$eval(jfDateInput.max) || jfDateInput.max;
            		var min = scope.$eval(jfDateInput.min) || jfDateInput.min;
            		
            		if(angular.isObject(max)){
            			plugins.max = Tansun.Date.format(max,plugins.format) ;
            		}else if(angular.isDefined(max)){
            			plugins.max = max ;
            		}
            		
            		if(angular.isObject(min)){
            			plugins.min = Tansun.Date.format(min,plugins.format) ;
            		}else if(angular.isDefined(min)){
            			plugins.min = min ;
            		}
            		
            		//插件不支持动态最大值最小值，每次移除掉原来的元素并重新渲染
            		var dateElem = angular.element(html) ;
            		dateElem.attr('id', id);
            		element.replaceWith(dateElem);
            		element = dateElem ;
            		dateElem.removeAttr('jf-date-input');
            		$compile(dateElem)(scope) ;
            		Tansun.plugins.date(plugins);
				};
	            if(jfDateInput.min){
        			scope.$watch(jfDateInput.min,function(newValue,oldValue){
        				if(newValue == oldValue){
        					return ;
        				}
        				open() ;
        			}) ;
        		}
        		if(jfDateInput.max){
        			scope.$watch(jfDateInput.max,function(newValue,oldValue){
        				if(newValue == oldValue){
        					return ;
        				}
        				open() ;
        			}) ;
        		}
	            
            	open() ;
	        }
	    };
	});
	
	Tansun.directive('jfSelect', function ($injector,$compile,$timeout,$q,$translate,T) {
        var jfRest = $injector.get('jfRest');
        
        //缓存类
        var Session = {
			set : function(key, value) {
				  window.sessionStorage.setItem(key, value);
			 },
			 get : function(key) {
			  return window.sessionStorage.getItem(key);
			 },
			 remove : function(key) {
			  sessionStorage.removeItem(key);
			 },
			 removeAll : function() {
			  var len = sessionStorage.length, i = len - 1;
			  for (; i >= 0; i--) {
			   var key = sessionStorage.key(i);
			   sessionStorage.removeItem(key);
			  }
			 },
			 hasStorage : function(key) {
			  if (null == key) {
			   return false;
			  }
			  if (this.isSessionStorage) {
			   if (sessionStorage.getItem(key) == null) {
			    return false;
			   }
			  }
			  return true;
			 }
        		
        };
        
        function JfSelect(option,defoption) {
        	var thiz = this ;
			thiz.option = angular.copy(option);
			thiz.option.type = option.type || 'array' ;
			thiz.option.param = thiz.option.param || {} ;
			thiz.option.defoption = defoption;

			switch (thiz.option.type) {
			case 'dynamic':
				thiz.getOptions = function() {
					var deferred = $q.defer();
					var resources = thiz.option.resource.split('.') ;
					var param = Tansun.param(thiz.option.param) ;
					param= {};
					var resource = jfRest.request(resources[0],resources[1],thiz.option.param) ;
					resource.then(function(data) {
						if(data.returnData){
							data = data.returnData.rows || {} ;
						}else {
							data = {}
						}
						var options = [] ;
						angular.forEach(data,function(obj) {
							options.push({
								text : obj[thiz.option.text],
								value : obj[thiz.option.value]
							}) ;
							layui.use(['form'],function () {
								layui.form.render('select');
							});
						}) ;
						
						layui.use(['form'],function () {
							layui.form.render('select');
						});
						deferred.resolve(options);
						if(angular.isFunction(thiz.option.callback)){
							thiz.option.callback(data) ;

							layui.use(['form'],function () {
								layui.form.render('select');
							});
							$timeout(function() {
			            		Tansun.plugins.render('select');
							});
		        		}
						
						$timeout(function() {
		            		Tansun.plugins.render('select');
						});
						
					}) ;
					return deferred.promise ;
				};
				break ;
			case 'dynamicDesc':
				thiz.getOptions = function() {
					var deferred = $q.defer();
					var resources = thiz.option.resource.split('.') ;
					var param = Tansun.param(thiz.option.param) ;
					param= {};
					var resource = jfRest.request(resources[0],resources[1],thiz.option.param) ;
					resource.then(function(data) {
						if(data.returnData){
							data = data.returnData.rows || {} ;
						}else {
							data = {}
                        }
                        var options = [] ;
						if(thiz.option.descThree){
							angular.forEach(data,function(obj) {
								options.push({
									text : obj[thiz.option.text] +"-"+ obj[thiz.option.desc] +"-"+ obj[thiz.option.descThree],
									value : obj[thiz.option.text] +"-"+ obj[thiz.option.desc]
								}) ;
							}) ;
						}else{
							angular.forEach(data,function(obj) {
								options.push({
									text : obj[thiz.option.text] +" "+ obj[thiz.option.desc],
									value : obj[thiz.option.value]
								}) ;
							}) ;
						}
						deferred.resolve(options);
						if(angular.isFunction(thiz.option.callback)){
							thiz.option.callback(data) ;
		        		}
					}) ;
					return deferred.promise ;
				};
				break ;
				
			case 'dictData':
				thiz.getOptions = function() {
					
					//判断是否有缓存数据字典
					var data = JSON.parse(Session.get(thiz.option.param.groupsCode));
					if( data != null ){

						var options = [] ;
						
						if(thiz.option.desc){
							angular.forEach(data,function(obj) {
								options.push({
									text : obj[thiz.option.text] +" "+ obj[thiz.option.desc],
									value : obj[thiz.option.value]
								}) ;
							}) ;
						}else {
							angular.forEach(data,function(obj) {
								options.push({
									text : obj[thiz.option.text],
									value : obj[thiz.option.value]
								}) ;
							}) ;
                        }
                        //移除不需要的展示的下拉框参数
						if(thiz.option.rmData && typeof(thiz.option.rmData) == 'string'){//移除一个
							angular.forEach(options,function(obj,i) {
								if(obj.value == thiz.option.rmData){
									delete  options[i];
                                }
                            }) ;
						}else if(thiz.option.rmData && typeof(thiz.option.rmData) == 'object'){//移除多个
							for(var i =0; i < thiz.option.rmData.length; i++){
								for(var k = 0 ; k < options.length; k++){
									if(options[k]){//有可能已删除，为unfettered，需要判断
										if(options[k].value == thiz.option.rmData[i] ){
											delete  options[k];
										}	
									}

}
                            }
                        }
                        //查询下拉框选中
						if(angular.isFunction(thiz.option.callback)){
							thiz.option.callback(data) ;
                        }
                        $timeout(function() {
		            		Tansun.plugins.render('select');
						});
						
						return options ;
						
					}else {
						
						var deferred = $q.defer();
						var resources = thiz.option.resource.split('.') ;
						var param = Tansun.param(thiz.option.param) ;
						param= {};
						var resource = jfRest.request(resources[0],resources[1],thiz.option.param) ;
						resource.then(function(data) {
							if(data.returnData){
								data = data.returnData.rows || {} ;
							}else {
								data = {}
							}
							var options = [] ;
							if(thiz.option.desc){
								angular.forEach(data,function(obj) {
									options.push({
										text : obj[thiz.option.text] +" "+ obj[thiz.option.desc],
										value : obj[thiz.option.value]
									}) ;
								}) ;
							}else {
								angular.forEach(data,function(obj) {
									options.push({
										text : obj[thiz.option.text],
										value : obj[thiz.option.value]
									}) ;
								}) ;
                            }
                            //移除不需要的展示的下拉框参数
							if(thiz.option.rmData && typeof(thiz.option.rmData) == 'string'){//移除一个
								angular.forEach(options,function(obj,i) {
									if(obj.value == thiz.option.rmData){
										delete  options[i];
                                    }
                                }) ;
							}else if(thiz.option.rmData && typeof(thiz.option.rmData) == 'object'){//移除多个
								for(var i =0; i < thiz.option.rmData.length; i++){
									for(var k = 0 ; k < options.length; k++){
										if(options[k]){//有可能已删除，为unfettered，需要判断
											if(options[k].value == thiz.option.rmData[i] ){
												delete  options[k];
											}	
										}

}
                                }
                            }
                            //缓存数据 判断是否属于数据字典
							if(data.length > 0 && thiz.option.param.groupsCode.search('dic_') != -1){
								Session.set(thiz.option.param.groupsCode, JSON.stringify(data));
                            }
                            deferred.resolve(options);
							if(angular.isFunction(thiz.option.callback)){
								thiz.option.callback(data) ;
			        		}
						}) ;
						return deferred.promise ;

}
                };
				break ;	
			default:
				thiz.getOptions = function() {
					var deferred = $q.defer();
					deferred.resolve(thiz.option.options);
	            	return deferred.promise ;
				};
			}
			
			$timeout(function() {
				if(thiz.option.watch){
					thiz.scope.$watch(thiz.option.watch,function(newValue,oldValue){
						if(typeof newValue=='object'){
							thiz.option.param = newValue ;
						}else{
							thiz.option.param.pId = newValue ;
						}
						thiz.generatorOptions() ;
					},true) ;
				}
				Tansun.plugins.render('select');
			});
        }
        JfSelect.prototype.generatorOptions = function() {
        	var thiz = this ;
        	$q.when(thiz.getOptions()).then(function(data) {
        		thiz.scope.options = [];
            	var selectTxt =T.T('F00001');
        		if(thiz.option.defoption==true){
            		thiz.scope.options.push({text : " ",value : ''});
        		}
        		else if(thiz.option.placeholder){
            		thiz.scope.options.push({text : thiz.option.placeholder,value : ''});
            	}else{
            		thiz.scope.options.push({text : selectTxt , value : ''});
            	}
            	
            	angular.forEach(data,function(obj){
            		thiz.scope.options.push(obj) ;
            	}) ;
            	
            	//如果是通过监听某个数据再渲染的下拉框，先将选项的选中，等下拉框渲染完成后再选中该选项
            	if(thiz.option.watch){
            		var selected = thiz.ngModel.$modelValue ;
                	/*if(selected || selected == 0){
                		thiz.ngModel.$setViewValue(undefined) ;
                	}
                	$timeout(function() {
                		if(selected || selected == 0){
                			thiz.ngModel.$setViewValue(selected) ;
                		}
    				});*/
                    if(selected || selected == 0){
                        angular.forEach(thiz.scope.options,function(item){
                            if(item.value == selected){
                                item.checked = true ;
                            }else{
                                item.checked = false ;
                            }
                            
                            $timeout(function() {
    	            			Tansun.plugins.render('select');
    	            		});
                            
                        }) ;
                    }

            	}
            	
            	$timeout(function() {
            		Tansun.plugins.render('select');
				});
			});
		};
		
		JfSelect.prototype.builder = function(scope,element) {
			this.scope = scope ;
			this.element = element ;
			
			this.generatorOptions() ;
			var option = angular.element('<option>') ;
			option.attr('ng-repeat','item in options') ;
			option.attr('ng-value','item.value') ;
			option.attr('ng-bind','item.text') ;
			option.attr('ng-selected','item.checked') ;
			this.element.empty() ;
			this.element.append(option) ;
			$compile(option)(scope) ;
			
//			var targetElement = angular.element(this.element.context.outerHTML);
//			targetElement.attr('ng-options','item.value as item.text for item in options') ;
//			targetElement.removeAttr('jf-select');
//        	element.replaceWith(targetElement);  
//			$compile(targetElement)(this.scope);
		};
		
	    return {
	    	restrict: 'A',
            scope: false,
	        require: 'ngModel',
	        link: function (scope, element, attrs, ngModel) {
            	var $scope = scope.$new(false) ;
            	$scope.jfSelect = new JfSelect(scope.$eval(attrs.jfSelect),attrs.defoption!=undefined) ;
            	$scope.jfSelect.builder($scope,element) ;
            	$scope.jfSelect.ngModel = ngModel ;
            	ngModel.$formatters.push(function(value) {
            		//下拉框数据初始化结束后再赋值
            		$timeout(function() {
	            		if(angular.isUndefined(value)){
	            	//		value = '' ;
	            		} else {
	            			value = String(value);
	            		}
	            		ngModel.$setViewValue(value) ;
	            		
	            		angular.forEach($scope.options,function(item){
	            			if(item.value == value){
	            				item.checked = true ;
	            			}else{
	            				item.checked = false ;
	            			}
	            		}) ;
	            		
	            		$timeout(function() {
	            			Tansun.plugins.render('select');
	            		});
						return value ;
            		});
				}) ;
            	
            	if(attrs.jfSelect.indexOf('(') <= 0){
            		scope.$watch(attrs.jfSelect,function(newSelect,oldSelect){
            			if(angular.equals(newSelect,oldSelect)){
            				$timeout(function() {
    	            			Tansun.plugins.render('select');
    	            		});
            				return ;
            			}
            			$scope.jfSelect = new JfSelect(scope.$eval(attrs.jfSelect),attrs.defoption!=undefined) ;
            			$scope.jfSelect.builder($scope,element) ;
            		}) ;
            	}
	        }
	    };
	});
	
	Tansun.directive('selector', function ($injector,$compile,$timeout) {
    	var jfRest = $injector.get('jfRest') ;
		
    	var treeSelector = {
			rander : function() {
			},
			checked : function(row) {
				var thiz = this ;
				switch (thiz.checkType) {
				case 'checkbox':
					if(angular.isFunction(thiz.callback)){
						thiz.callback(thiz.tree.getChecked()) ;
	        		}
					break;
				case 'radio' :
					if(angular.isFunction(thiz.callback)){
						thiz.callback(row) ;
	        		}
					break ;
				}
			},
			query : function() {
			}
    	};
    	
    	var tableSelector = {
			rander : function() {
				var thiz = this ;
	        	if(thiz.checkType === 'checkbox'){
	        		$timeout(function(){
	        			Tansun.plugins.render(thiz.checkType);
	        		});
	        	}
			},
			checked : function(row) {
				var thiz = this ;
				switch (thiz.checkType) {
				case 'checkbox':
					row._checked = !row._checked ;
					angular.forEach(thiz.checkeds,function(item,index){
						//如果已选择的再进行点击，则移除掉这一条信息
						if(thiz.equals(item,row)){
							thiz.checkeds.splice(index,1) ;
						}
					});
					//如果是选中，则将本行加入已选
					if(row._checked){
						thiz.checkeds.push(row) ;
					}
					
					if(angular.isFunction(thiz.callback)){
						thiz.callback(thiz.checkedList()) ;
	        		}
					thiz.rander();
					break ;
				case 'radio' :
					angular.forEach(thiz.data,function(item){
						item._checked = false ;
					}) ;
					row._checked = true ;
					if(angular.isFunction(thiz.callback)){
						thiz.callback(row) ;
                    }
                    thiz.close() ;
					break ;
				}
			},
			nextPage : function() {
				var thiz = this ;
				if(thiz.pageConf.pageNum >= thiz.pageConf.pages){
					return ;
				}
				thiz.pageConf.pageNum ++ ;
				thiz.query() ;
			},
			prePage : function() {
				var thiz = this ;
				if(thiz.pageConf.pageNum <= 1){
					return ;
				}
				thiz.pageConf.pageNum -- ;
				thiz.query() ;
			},
			query : function() {
				var thiz = this ;
				var params = {} ;
				params[thiz.alias] = thiz.searchParam || '' ;
				if(thiz.params){
					angular.extend(params,thiz.params);
				}
				angular.extend(params,thiz.pageConf);
				jfRest.request(thiz.api,thiz.method,Tansun.param(params)).then(function(data) {
					if(data.status == 200){
						if(angular.isArray(data.data)){
							thiz.data = data.data ;
						}else if(!angular.isObject(data.data)){
							return ;
						}else if(angular.isArray(data.data.grid)){
							thiz.data = data.data.grid ;
						}else if(!angular.isObject(data.data.grid)){
							return ;
						}else if(angular.isArray(data.data.grid.list)){
							thiz.pageConf.pages = data.data.grid.pages ;
							thiz.data = data.data.grid.list ;
						}
						//判断数据是否存在已选列表
						if(thiz.checkType === 'checkbox'){
							angular.forEach(thiz.checkedList(),function(checked){
								angular.forEach(thiz.data,function(item){
									if(thiz.equals(checked,item)){
										item._checked=true ;
									}
								});
							}) ;
						}
						//初始化默认选中事件
						if(thiz.initSelected){
							var list=thiz.initSelected.split(",");
							angular.forEach(list,function(checked){
								angular.forEach(thiz.data,function(item){
									if(checked==thiz.selectId(item)){
										item._checked=true ;//选中可选信息
										thiz.checkeds.push(item) ;//选中已选信息
									}
								});
							});
							if(!list||list.length<=0){
								//移除所有选中可选信息
								angular.forEach(thiz.data,function(item){
										item._checked=false ;
								});
								//移除所有选中已选信息
								angular.forEach(thiz.checkeds,function(item,index){
									thiz.checkeds.splice(index,1) ;
								});
							}
						}
						
						thiz.rander() ;
						//渲染完后自动加载样式单行和双行底色不一样
						 $timeout(function(){
					 	    	$('.footable tbody tr:odd').addClass('zebra');
					 	        // $('table .footable').footable().find('> tbody > tr:not(.footable-row-detail):nth-child(even)').addClass('zebra');
					 	   	  	$('.footable').find('> tbody > tr').hover(
					 	             function () {
					 	                  $(this).addClass("footable_trhover");
					 	              },
					 	             function () {
					 	                  $(this).removeClass("footable_trhover");
					 	             }
					 	         );
					 		});
					}
				});
				
			}
    	};
    	
	    return {
	        restrict: 'A',
	        scope: false,
	        require: 'ngModel',
	        link: function ($scope, element, attrs, ngModel) {
	        	var scope = $scope.$new(false) ;
	        	scope.addon = $scope.global.pagePath + '/addon/addon-selector.html' ;
	        	var selector = $scope.$eval(attrs.selector) ;
	        	scope.selector = selector ;
	        	selector.checkeds = [] ;
	        	//设置默认参数
	        	selector.id = selector.id || Tansun.GUID('selector') ;
	        	//设置默认宽度
	        	selector.style=selector.style||"width:400px";
	        	selector.layout = selector.layout || 'table'; 
	        	selector.params = selector.params || {} ;
	        	if(selector.resource){
	        		selector.api = selector.resource.split('.')[0];
	        		selector.method = selector.resource.split('.')[1];
	        	}else{
	        		selector.resource = selector.api + '.' + selector.method ;
	        	}
	        	selector.checkType = selector.checkType || 'radio' ;
	        	
	        	switch (selector.layout) {
				case 'table'://表格布局
					angular.extend(selector,tableSelector);
					if(!selector.alias){
		        		var modelArr = attrs.ngModel.split('.') ;
		        		angular.forEach(modelArr,function(item){
		        			selector.alias = item ;
		        		});
		        	}
					selector.search = angular.isDefined(selector.search) ? selector.search : true ;
					selector.pageConf = selector.pageConf || {pageNum : 1 ,pageSize : 7 } ;
					//获取已选列表
					selector.checkedList = function() {
						return selector.checkeds ;
					};
					//由使用者重写本方法,对比两个对象是否为已选，返回布尔值,默认以ID进行判断
					selector.equals = selector.equals || function(checked,item) {
						return checked.id = item.id ;
					};
					
					if(selector.search){
						scope.$watch('selector.searchParam',function(newValue,oldValue){
							if(oldValue == newValue)
								return ;
							selector.pageNum = 1;
							selector.query() ;
						}) ;
						scope.$watch('selector.params',function(newValue,oldValue){
							if(oldValue == newValue)
								return ;
							selector.pageNum = 1;
							selector.query() ;
						}) ;
					}
					
					if(selector.checkType === 'checkbox'){
						scope.$watch('tab',function(newValue,oldValue){
							if(newValue == oldValue){
								return ;
							}
							selector.rander() ;
						},true) ;
					}
					break;
				case 'tree': //树形布局
					selector.search = angular.isDefined(selector.search) ? selector.search : true ;
					angular.extend(selector,treeSelector);
					var isCheck = selector.checkType === 'checkbox' ;
					selector.tree = {
						isCheck : isCheck,
		        		check:selector.check,
		        		disableParent:angular.isDefined(selector.disableParent) ? selector.disableParent : false ,
		        		initSelected :selector.initSelected,
						resource : selector.resource,
						nodeCheck : function(treeNode) {
							selector.checked(treeNode);
						},
						nodeClick : function(treeNode) {
							selector.checked(treeNode);
						},
						params : selector.params
					};
					
					if(selector.search){
						scope.$watch('selector.searchParam',function(newValue,oldValue){
							if(oldValue == newValue)
								return ;
							selector.tree.findNodes(newValue);
						}) ;
						scope.$watch('selector.params',function(newValue,oldValue){
							if(oldValue == newValue)
								return ;
							selector.tree.reload(newValue);
						}) ;
						scope.$watch('selector.initSelected',function(newValue,oldValue){
							if(oldValue == newValue)
								return ;
							selector.tree.reload(selector.params,newValue);
						}) ;
					}
					
					break;
				}
	        	
	        	//弹出事件
				selector.pop = function() {
					angular.element('body').click(function(event) {
						selector.close(event) ;
					}) ;
					//关闭其他打开的弹窗
					angular.element('body').find('.search_tooptip').parent().addClass('ng-hide');
					scope.show = true ;
					if(!selector.data){
						selector.query() ;
					}else{
						selector.rander() ;
					}
					scope.safeApply() ;
				};
				
				//关闭事件
				selector.close = function(event) {
//	        		if(event){
//	        			event.stopPropagation();
//	        		}
	        		angular.element('body').unbind(event);
	        		scope.show = false ;
	        		scope.safeApply() ;
				};
				
				selector.popDiv = angular.element('<div ng-include="addon" ng-show="show" ng-click="stopPropagation($event)">');
				scope.stopPropagation = function(event) {
					event.stopPropagation();
				};
				$compile(selector.popDiv)(scope) ;
				
				//给文本框添加聚焦弹出事件
//				element.focus(function(event) {
//					selector.pop() ;
//					event.stopPropagation();
//				}) ;
				//给文本框添加点击弹出事件
				element.click(function(event) {
					selector.pop() ;
					event.stopPropagation();
				}) ;
				element.after(selector.popDiv) ;
				element.attr('readonly','readonly') ;
	        }
	    };
	});
	
	Tansun.directive('address', function ($injector,jfGlobal,$timeout,$rootScope) {
		return {
	        restrict: 'EA',
	        template: 
	        '<div></div>' ,
            replace: true,
	        scope: false,
	        link: function (scope, element, attrs) {
				var jfRest = $injector.get('jfRest') ;
				var param = {};
			    //地址列表
				var address=$rootScope.getStorege("_address");
				//对应的Model
	        	var model = {
	        		province : attrs.province, 
	        		city : attrs.city, 
	        		county : attrs.county
	        	} ;
	        	//下拉选项在作用域中的model
	        	var optionItem = {
	        		province : Tansun.GUID('a'),
	        		city : Tansun.GUID('b'),
	        		county : Tansun.GUID('c')
	        	} ;
				//angular提供的服务
	        	var $compile = $injector.get('$compile') ;
	        	var $parse = $injector.get('$parse');
	        	//校验规则
	        	var validator = attrs.validator ;

	        	var $select = {
	        		province : angular.element('<div class="wd190 float_left"><select ng-model="' + model.province + '" ><option value={{item.cityCode}} ng-repeat="item in ' + optionItem.province + '" ng-bind="item.areaName"></option></select></div>'),
	        		city : angular.element('<div class="wd190 float_left"><select  ng-model="' + model.city + '" > <option value={{item.cityCode}} ng-repeat="item in ' + optionItem.city + '" ng-bind="item.areaName"></option></select></div>'),
	        		county : angular.element('<div class="wd190 float_left"><select  ng-model="' + model.county + '"> <option value={{item.cityCode}} ng-repeat="item in ' + optionItem.county + '" ng-bind="item.areaName"></option></select></div>')
	        	} ;
	        	//方法
	        	var func = {
	        		//构建下拉列表
	        		buildOption : function(value,defaultOption) {
	        			var options = [] ;
		            	if(defaultOption){
		            		options.push({areaName : defaultOption});
		            	}
		            	
		            	angular.forEach(address[value],function(obj){
		            		options.push(obj);
		            	});
						return options ;
					},
					//初始化下拉列表
					initOption : function(elem,options) {
//						elem.find("option").remove();
//						angular.forEach(options,function(option){
//							var $option = angular.element('<option></option>').text(option.name).val(option.id);
//							elem.append($option);
//						}) ;
						func.setter(elem,options) ;
						Tansun.plugins.render('select');
					},
					//设置model的值
					setter : function(name,value) {
						$parse(name).assign(scope,value); 
					},
					//获取model的值
					getter : function(name) {
						return $parse(name)(scope);
					},
					//启动监听事件
					startWatch : function() {
						//监听省
						scope.$watch(model.province,function(newValue,oldValue,scope){
							if(newValue == oldValue){
								return ;
							}
							var items = func.buildOption(newValue,'请选择城市');
							func.initOption(optionItem.city,items);
							$timeout(function() {
									Tansun.plugins.render('select');
							});
							for (var int = 0; int < items.length; int++) {
								if(func.getter(model.city) === items[int].cityCode){
									$timeout(function() {
						  			if(model.city){
										func.setter(model.city,null);
									}
									scope.$apply();
									Tansun.plugins.render('select');	
										});
								$timeout(function() {
								if(model.city){
										func.setter(model.city,items[int].cityCode);
								}
									scope.$apply();
									Tansun.plugins.render('select');	
										},100);
									return ;
								}
							}
							if(model.city){
								func.setter(model.city,items[0].cityCode);
							}

						});
						//监听市
						scope.$watch(model.city,function(newValue,oldValue, scope){
							if(newValue == oldValue){
								return ;
							}
							var items = func.buildOption(newValue,'请选择区县');
							func.initOption(optionItem.county,items);
							$timeout(function() {
								Tansun.plugins.render('select');
							});
							for (var int = 0; int < items.length; int++) {
								if(func.getter(model.county) === items[int].cityCode){
									$timeout(function() {
										scope.county=null;
										if(model.county){
											func.setter(model.county,null);
										}
										scope.$apply();
										Tansun.plugins.render('select');
										});
									$timeout(function() {
									if(model.county){
											func.setter(model.county,items[int].cityCode);
										}
	
										scope.$apply();
										Tansun.plugins.render('select');
										},100);
									return ;
								}
							}
							if(model.county){
								func.setter(model.county,items[0].cityCode);
							}
						});
					},
					//初始化地址选择器
					initAddress : function() {
						if(model.province){
							var items = func.buildOption('0','请选择省份');
							func.initOption(optionItem.province,items);
							if(!func.getter(model.province)){
								func.setter(model.province,items[0].cityCode);
							}
						}
			        	
			        	if(model.city){
			        		items = func.buildOption(func.getter(model.province),'请选择城市');
			        		func.initOption(optionItem.city,items);
			        		if(!func.getter(model.city)){
			        			func.setter(model.city,items[0].cityCode);
			        		}
			        	}
			        	
			        	if(model.county){
			        		items = func.buildOption(func.getter(model.city),'请选择区县');
			        		func.initOption(optionItem.county,items);
			        		if(!func.getter(model.county)){
			        			func.setter(model.county,items[0].cityCode);
			        		}
			        	}
			        	
			        	if(validator){
			        		$select.province.attr("validator",validator);
			        		$select.city.attr("validator",validator);
			        		$select.county.attr("validator",validator);
			        	}
			        	if(attrs.province){
							$compile($select.province)(scope);
			        		element.append($select.province) ;
			        	}
			        	if(attrs.city){
			        		$compile($select.city)(scope);
			        		element.append($select.city);
			        	}
			        	if(attrs.county){
			        		$compile($select.county)(scope);
			        		element.append($select.county);
			        	}
					}
	        	};
	        	
				var init=function(data){
				func.initAddress();
				func.startWatch() ;
		    	$timeout(function() {
					Tansun.plugins.render('select');
				});
				};
				if(address){
				init(address);}else{
				var resource = jfRest.request("area","query",param);
				resource.then(function(data){
				$rootScope.setStorege("_address",data.data.address);
				address=$rootScope.getStorege("_address");
				init(data);
				});
				}
		   }
	    };
	});
	
	//富文本框指令
	Tansun.directive('jfEditor', function ($injector) {
	    return {
	        restrict: 'EA',
	        require: 'ngModel',
	        scope: false,//独立作用域，防止污染父级作用域
	        link: function (scope, element, attrs, ngModel) {
	        	var $scope = scope.$new(false);
	        	var $parse = $injector.get('$parse');
	        	var $compile = $injector.get('$compile');
	        	var jfModel = $injector.get('jfModel');
	        	layui.use(['layedit'], function(){
	      		 var layedit = layui.layedit;
	      		  layedit.set({
	      			  uploadImage: {
	      			    url: $scope.global.uploader.filePath ,//接口url
	      			    type: 'post' //默认post
	      			  }
	      			});
	      		$scope.editor = scope.$eval(attrs.jfEditor) || {};
	      		//默认属性
	      		$scope.config={
	      				tool:['strong', 'italic','underline','del','|','left','center','right','|','link','unlink','face','image','|','code'],
	      				height:"150px",
	      				fileSize:5* 1024 * 1024
	      		};
	      		angular.extend($scope.config,$scope.editor);
	      	    //创建一个编辑器
	          	var index = layedit.build(attrs.id,$scope.config);
	          	//初始化往文本框赋值
	            ngModel.$formatters.push(function(value) {
						$("#"+attrs.id).parent().find("iframe").contents().find("body").html(value);

	            });
	          	scope.$watch(attrs.ngModel,  function(newValue, oldValue) {
					if(!newValue){
						newValue = '' ;
					}
					ngModel.$setViewValue(newValue) ;
					//$("#"+attrs.id).parent().find("iframe").contents().find("body").html(newValue);
				});
	          	//设置文本编辑器只读
	          	if(attrs.contenteditable=='false'||$scope.editor.contenteditable=='false'){
					$("#"+attrs.id).parent().find("iframe").contents().find("body").attr('contenteditable',false);
					$("#"+attrs.id).parent().find(".layui-layedit-tool").css('display','none')
				}
	          	 //富文本框鼠标移开触发事件
	          	$("#"+attrs.id).parent().find("iframe").contents().find("body").blur(function(){ 
	          		 ngModel.$setViewValue(layedit.getContent(index)) ;
	          	});
	        	
	        	});
	        }
	    };
	});
	
	
	
	
	
	
	/*重写下拉框指令 测试*/
	Tansun.directive('appnameSelect', function () {
	    return {
	        restrict:"EA",//E:元素  A:属性 C:样式类  M:注释
	        replace: true,
	        scope:{//@：从父级获取值后便只在本地作用域生效  = ：同父级controller中的指定对象双向绑定  &：从父级获取一个变量的引用，常用作方法调用
	            serviceName:'@',//service bean  后端根据这个值获取下拉数据 
	            disabledType:'@',//是否可点击  true:是  false:否
	            selectData:'=',//选中的值
	            selectChange:"&",//选择事件
	        },
	        //模板 --模板代码多的情况下用templateUrl吧
	        template:'<select ng-disabled="{{disabledType}}" ng-model=selectData class="layui-input" ng-options="o.id as o.appName for o in appDatas"></select>',
	        controller:['$scope','$http','$filter',function (scope,$http,$filter) {
	        	//获取下拉选择数据
	            $http({
	                method:'POST',
	                url:'http://10.6.90.183:8080/betaService/COS.CS.01.0010'
	            }).success(function (response) {
	                scope.appDatas = response;
	                //设置下拉框初始值
	                if(scope.disabledType=='false' && response.length>0){
	                    scope.selectData = response[0].id;
	                }
	            });
	       }],
	        link:function (scope,elements,attrs,controller) {
	            //监听选择事件并交给父级处理（也可以在指令中处理，看具体使用场景）  
	            scope.$watch('selectData',function () {
	                scope.selectChange();
	            })
	        }
	    }
	})
});