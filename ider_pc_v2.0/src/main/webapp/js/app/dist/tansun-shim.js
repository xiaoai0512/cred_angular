'use strict';
/**
 * 旧版本兼容包
 */
define(function(require) {
	var angular = require('angular');
	require('xxtea');
	require('base64');
	require('des');
	
	Tansun.factory('jfParam', [ 'jfGlobal', '$injector',
 		function(jfGlobal, $injector) {
 			// var isEntry = true ;
 			var jfParam = {};
 			var $stateParams = $injector.get('$stateParams');
 			jfParam.param = function(requestData, pageConf) {
 				if (!requestData) {
 					requestData = {};
 				}
 				requestData._ = jfGlobal._;
 				
 				if(typeof requestData['taskId'] == 'undefined' 
 					&&typeof $stateParams != 'undefined'
 					&&typeof $stateParams['taskId'] != 'undefined'){
 					requestData['taskId']=$stateParams['taskId']
 				}
 				if (pageConf) {
 					requestData.pageNum = pageConf.currentPage;
 					requestData.pageSize = pageConf.pageSize;
 				}
 				// if(!isEntry){
 				// return jfGlobal.$.param(requestData) ;
 				// }

 				var data = angular.copy(requestData);
 				for ( var key in data) {
 					var jfHelper = $injector.get('jfHelper');
 					data[key] = jfHelper.strEnc(data[key], jfGlobal.pubKey);
 					// if(data[key]){
 					// data[key] = BASE64.encoder(String(data[key]));
 					// data[key] =
 					// strEnc(String(data[key]),jfGlobal.pubKey);
 					// }
 				}

 				return jfGlobal.$.param(data);
 			};

 			return jfParam;
 		} ]);

 	Tansun.factory('jfLayer', [ 'jfGlobal', function(jfGlobal) {
 		var layerWidget = {};
 		layerWidget.alert = function(message, callback) {
 			layer.alert(message, {
 				icon: 7,
 				closeBtn : 0
 			}, callback);
 		};

 		layerWidget.success = function(message, callback) {
 			layer.msg(message, {
 				shade : 0.01, // 遮罩透明度
 				icon : 1
 			}, callback);
 		};

 		layerWidget.fail = function(message, callback) {
//	                 			layer.msg(message, {
//	                 				icon : 2
//	                 			}, callback);
 			layer.alert(message, {
 				icon: 2,
 				closeBtn : 0
 			}, callback);
 		};

 		layerWidget.confirm = function(message, yes, no) {
 			layer.confirm(message, {
 				icon : 3,
 				btn : [ '确定', '取消' ]
 			// 按钮
 			}, function(index) {
 				layer.close(index);
 				yes();
 			}, function(index) {
 				layer.close(index);
 				no();
 			});
 		};

 		layerWidget.open = function(url, callBack, area, webCtx) {
 			if (url) {
 				if (!webCtx) {
 					webCtx = ctx;
 				}
 				if (url.indexOf('http') < 0) {
 					url = webCtx + url;
 				}
 			}
 			layer.open({
 				type : 2,
 				area : area,
 				skin : 'layui-layer-rim',
 				maxmin : true,
 				cancel : callBack,
 				content : [ url, 'yes' ]
 			});

 		};

 		layerWidget.load = function() {
 			return layer.load(1, {
 				shadeClose : false
 			});
 		};

 		layerWidget.closeAll = function(type) {
 			layer.closeAll(type);
 		};

 		layerWidget.close = function(index) {
 			layer.close(index);
 		};

 		layerWidget.dialog = function(elemId, title, callBack, area, yes) {
 			if (!area) {
 				area = [ '800px', '600px' ];
 			}
 			if (!title) {
 				title = false;
 			}

 			// 捕获页
 			var newIndex = layer.open({
 				type : 1, // page层
 				area : area,
 				title : title,
 				skin : 'layui-layer-rim', // 加上边框
 				shade : 0.6, // 遮罩透明度
 				moveType : 1, // 拖拽风格，0是默认，1是传统拖动
 				shift : -1, // 0-6的动画形式，-1不开启
 				content : jfGlobal.$('#' + elemId),
 				//content : elemId,
 				cancel : function(index) {
 					layer.close(index);
 					//this.content.show();
 					callBack();
 				},
 				btn : ['确认', '取消'],
 				yes : function(index) {
 					yes(index);
 				},
 				btn2 : function(index) {
 					layer.close(index);
 				}
 			});
 			return newIndex;
 		};

 		layerWidget.dialogForView = function(elemId, title, callBack, area) {
 			if (!area) {
 				area = [ '800px', '600px' ];
 			}
 			if (!title) {
 				title = false;
 			}

 			// 捕获页
 			var newIndex = layer.open({
 				type : 1, // page层
 				area : area,
 				title : title,
 				skin : 'layui-layer-rim', // 加上边框
 				shade : 0.6, // 遮罩透明度
 				moveType : 1, // 拖拽风格，0是默认，1是传统拖动
 				shift : -1, // 0-6的动画形式，-1不开启
 				content : jfGlobal.$('#' + elemId),
 				//content : elemId,
 				cancel : function(index) {
 					layer.close(index);
 					//this.content.show();
 					callBack();
 				},
 				btn : ['取消'],
 				yes : function(index){
 					layer.close(index);
 					callBack();
 				}
 			});
 			return newIndex;
 		};
 		
 		layerWidget.dialogCustom = function(elemId, title, area, buttons, callbacks , callback) {
 			if (!area) {
 				area = [ '800px', '600px' ];
 			}
 			if (!title) {
 				title = false;
 			}

 			var callbackFuns = callbacks.split(',') ;
 			var callbackArry = {
 				type : 1, // page层
 				area : area,
 				title : title,
 				skin : 'layui-layer-rim', // 加上边框
 				shade : 0.6, // 遮罩透明度
 				moveType : 1, // 拖拽风格，0是默认，1是传统拖动
 				shift : -1, // 0-6的动画形式，-1不开启
 				content : jfGlobal.$('#' + elemId),
 				btn : buttons.split(','),
 				cancel : function(index) {
 					layer.close(index);
 				}
 			};
 			
 			angular.forEach(callbackFuns,function(data,indexNum,array){
 				var newIndex = indexNum + 1 ;
 				switch(newIndex){
 					case 1 :
 						callbackArry.yes = function(index,layero){
//	                 						  	var btn = layero.find('.layui-layer-btn');
 							callback(index,data);
 						};
 						break;
 					default : 
 						var btnStr = 'btn' + newIndex;
 						callbackArry[btnStr] = function(index){
 							callback(index,data);
 							return false ;
 						}
 				} 
 			}) ;
 			// 捕获页
 			var newIndex = layer.open(
 				callbackArry
 			);
 			return newIndex;
 		};
 		
 		return layerWidget;
 	} ]);
 	//系统配置
 	Tansun.factory('jfConfig', function(jfBaseRestAPI,$q) {
 		var defer = $q.defer() ;
 		var promise = defer.promise ;
 		  
 		jfBaseRestAPI.config.get("",function(data) {
 			defer.resolve(data) 
 		});
 		
 	    return promise ;
 	  });

 	//生成不重复随机数
 	var counter = 0 ;
 	Tansun.factory('jfGuid', function() {
 		return function( prefix ) {
             var guid = (+new Date()).toString( 32 ),
                 i = 0;

             for ( ; i < 5; i++ ) {
                 guid += Math.floor( Math.random() * 65535 ).toString( 32 );
             }

             return (prefix || 'jf_') + guid + (counter++).toString( 32 );
         };
 	  });
 	
 	
 	Tansun.factory('jfModel', function($parse) {
 		return {
 			set : function(scope,name,value) {
 				$parse(name).assign(scope,value); 
 	        },
 	        get : function(scope,name) {
 				return $parse(name)(scope);
 	        }
 		};
 		
 	});
 	
 	Tansun.factory('jfMap', function() {
 		return function() {
 			var keys = [] ;
 			var data = {} ;
 			return {
 				put : function(key,value) {
 					if(keys.indexOf(key) < 0){
 			            keys.push(key);
 			        }
 					data[key] = value ;
 				},
 				get : function(key) {
 					return data[key] ;
 				},
 				remove : function(key) {
 					var index = keys.indexOf(key) ;
 					if(index >= 0){
 						keys.splice(index, 1);
 						data[key] = null;
 					}
 				},
 				keySet : function() {
 					return keys ;
 				},
 				values : function() {
 					var items = [] ;
 					for (var idx = 0; idx < keys.length; idx++) {
 						var item = data[keys[idx]] ;
 						if(item){
 							items.push(item);
 						}
 					}
 					return items ;
 				}
 			};
 		}
 	});
 	
 	Tansun.factory('jfHelper', function($rootScope,jfGlobal) {
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
 	 * 此服务主要用于获取当前用户信息，需项目自行提供session获取方式
 	 */
 	Tansun.factory('jfSession', function($injector) {
 		var $q = $injector.get('$q');
 		var jfRest = $injector.get('jfRest');
 		var deferred = $q.defer();
 		
 		var request = jfRest.request("session","get",{}) ;
 		request.then(function(data) {
 			deferred.resolve(data);
 		},function(){
 			deferred.reject({});
 		}) ;
 		
 		return function(func) {
 			$q.all([deferred.promise]).then(function(data) {
 				func(data[0]);
 			})
 		} ;
 	});
 	
 	/**
 	 * 文件上传服务
 	 */
 	Tansun.factory('jfFileUploader', function($injector,jfGlobal) {
 		var jfLayer = $injector.get('jfLayer');
 		var $parse = $injector.get('$parse');
 		var jfSession = $injector.get('jfSession') ;
 		var jfGuid = $injector.get('jfGuid');
 		
 		var defaultConfig = {
 				queueLimit : 1, 
 				autoUpload : false,
 				url : jfGlobal.config['uploader.file.server'] + jfGlobal.config['uploader.file.upload'],
 				download : jfGlobal.config['uploader.file.server'] + jfGlobal.config['uploader.file.download'],
 				allowType : '|jpg|png|jpeg|bmp|gif|pdf|' ,
 				maxSize : '5120',
 				isMultiple : true ,
 				isDiy : false,
 				formData : {}
 		};
 		function JfFileUploader(config) {
 			var thiz = this ;
 			thiz.files = [] ;
 			thiz._init(config) ;
        }
        //初始化
 		JfFileUploader.prototype._init = function(config) {
 			var thiz = this ;
 			thiz.config = angular.copy(defaultConfig) ;
 			angular.extend(thiz.config,config) ;
 			
 			thiz.method = {} ;
 			//上传成功后
 			thiz.method.onSuccessItem = function(response, index, upload) {
 				if(!angular.isArray(response)){
 					return ;
 				}
 				angular.forEach(response,function(item){
 					var savePath = angular.fromJson(item.savePath) ;
 					var file = {
 						fileNm : item.originalFilename ,
 						fileSize : item.size ,
 						fileRte : savePath.file,
 						fileExpdNm : item.contentType,
 						mdlId : formData.mdlId ,
 						tblBlId : formData.tblBlId ,
 						suprFileId : formData.suprFileId
 					} ;
 					thiz.putFile(file) ;
 				}) ;
 			};
 			//上传完成后
 			thiz.method.onCompleteItem = function(item, response, status, headers) {
 			};
 			
 			thiz.method.onAfterAddingFile = function(item) {
 			};
 			
 			thiz.method.filters = [] ;
 		};
 		//移除已上传的文件
 		JfFileUploader.prototype.remove = function(item) {
 			var index = uploader.files.indexOf(item);
 			return index >= 0 && uploader.files.splice(index, 1) ;
 		};
 		//获取访问文件的全路径
 		JfFileUploader.prototype.getFullPath = function(item) {
 			return thiz.config.download ;
 		}; 
 		//添加一个过滤器
 		JfFileUploader.prototype.addFilters = function(filter) {
 			this.method.filters.push(filter);
 		};
 		//错误提示
 		JfFileUploader.prototype._fail = function(message) {
 			jfLayer.fail(message || '操作失败') ;
 		};
 		//获取文件类型
 		JfFileUploader.prototype._getType = function(name) {
 			return '|' + name.slice(name.lastIndexOf('.') + 1) + '|';
 		};
 		
 		JfFileUploader.prototype.getUploaded = function() {
 			return thiz.files ;
 		};
 		
 		JfFileUploader.prototype.setUploaded = function(files) {
 			if(!files)
 				return ;
 			//保证files永远指向一个引用
 			thiz.files.splice(0,thiz.files.length) ;
 			
 			angular.forEach(files,function(item){
 				thiz.putFile(item) ;
 			}) ;
 		};
 		
 		JfFileUploader.prototype.putFile = function(file) {
 			var thiz = this ;
 			//如果不需要上传多个附件，且已经存在上传的文件，则对该文件做更新
 			if(!thiz.config.isMultiple && thiz.files[0]){
 				file.id = thiz.files[0].id ;
 			}
 			
 			thiz.files.push(file) ;
 		};
 		
 		return {
 			getInstance : function(config) {
 				config = config || {} ;
 				return new JfFileUploader(config) ;
 			}
 		} ;
 	});
 	
 	/**
 	 * 业务校验服务
 	 */
 	Tansun.factory('jfBizValidator', function($injector,jfGlobal) {
 		
 		
 		var jfRest = $injector.get('jfRest');
 		var jfParam = $injector.get('jfParam');
 		var jfLayer = $injector.get('jfLayer');
 		
 		function JfBizValidator(option) {
 			this.option = option ;
        }
        JfBizValidator.prototype.isBlack = function(callback) {
 			var black = jfRest.request('checkBlackWarn','query',jfParam.param(this.option)) ;
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
 	
 	Tansun.directive('jfClick', function($injector,$rootScope) {
		var $q = $injector.get('$q') ;
		var $parse = $injector.get('$parse');
		var jfRest = $injector.get('jfRest');
		var promise = jfRest.request('permission','query');
		var button = require('./app/configuration/button-config') ;
		var jfHelper = $injector.get('jfHelper');
		var jfLayer = $injector.get('jfLayer');
		var $compile = $injector.get('$compile') ;
		var $location = $injector.get('$location');
		
		function JfClick(resId,data) {
			var thiz = this ;
			thiz.id = resId ;
			var resIdArr = resId.split('.') ;
			thiz.button = button ;
			angular.forEach(resIdArr,function(item){
				if(thiz.button){
					thiz.button = thiz.button[item] ;
				}
			}) ;
			//如果未在资源脚本中配置，未普通的按钮事件
			if(!thiz.button || thiz.button.length <= 0){
				thiz.hasButton = true ;
				return ;
			}
			
			if(thiz.button.after){
				//不考虑括号
				thiz.button.after = thiz.button.after.split('(')[0];
			}
			//所有需要权限访问的资源数组
			var permission = data.data.permission || [] ;
			//当前用户已拥有资源数组
			var permitted = data.data.permitted || [];
			//如果该按钮需要权限访问的资源为空，则默认拥有该按钮的权限
			if(!permission){
				thiz.hasButton = true ;

			}else{
				//如果用户拥有该编号的权限或者该编号未配置在权限数组中
				thiz.hasButton = permitted.indexOf(thiz.id) >= 0 || permission.indexOf(thiz.id) < 0;
			}

}
        JfClick.prototype._handler = function($scope,event) {
			var button = this.button || {} ;
			
			switch (button.type) {
			case 'restful':
				this._restful($scope) ;
				break ;
			case 'dialog':
				this._dialog($scope);
				break ;
			case 'router':
				this._jump($scope) ;
				break ;
			case 'window':
				this._window($scope);
				break ;
			case 'function' :
				var fn = $parse(this.button.target);
				fn($scope, {$event:event});
				break ;
			default:
				var fn = $parse(this.id);
				fn($scope, {$event:event});
				break;
			}
		};
		
		JfClick.prototype.excute = function($scope,event) {
			var thiz = this ;
			thiz.event = event ;
			
			if(thiz.button && thiz.button.before){
				var result = $scope.$eval(thiz.button.before) ;
				 //如果返回的是字符串
				if(typeof result === 'string'){
					if(result){
						jfLayer.alert(result);
						return ;
					}
				}
				
				if(result === true){
					thiz._handler($scope, event);
				}else{
					$q.when(result).then(function(data) {
						if(data.status == 200){
							thiz._handler($scope, event);
						}else{
							jfLayer.alert(data.description || '无法执行该操作');
						}
					});
				}
			}else{
				thiz._handler($scope, event) ;
			}
			
	//			$scope.$digest() ;
		};
		
		JfClick.prototype._restful = function($scope) {
			var thiz = this ;
			
			var buttonParam = thiz.button.param || {} ;
			var message = buttonParam.message || '您确定删除这条记录吗?' ;
			var tableName = buttonParam.table || '' ;
			
			var param = {} ;
			var urlArr = thiz.button.target.split('?') ;
			if(urlArr && urlArr.length > 1){
				if (urlArr[1] && !$rootScope.$valiCheck(tableName,'')) {
					return ;
				}
				param = jfHelper.getUrlParams(urlArr[1],tableName,thiz.event) ;
			}
			
			jfLayer.confirm(message,function(){
				var resource = urlArr[0].split('.') ;
				jfRest.request(resource[0],resource[1],Tansun.param(param)).then(function(data) {
					if(data.status == 200){
						jfLayer.success(data.description, function(){
	        				$rootScope.checkItemMap.remove(tableName); //移除选中
	        				var after = $scope.$eval(thiz.button.after || 'search') ;
							if(after && typeof after === 'function'){
								after(data) ;
							}
						});
					}else{
						jfLayer.fail(data.description);
					}
					
				})
			},function(){
				
			});
			
		};
		
		JfClick.prototype._dialog = function($scope) {
			var param = this.button.param || {} ;
			$scope.$dialog(this.event,this.button.target,param.type) ;
		};
		
		JfClick.prototype._jump = function ($scope) {
			var param = this.button.param || {} ;
			$scope.$goto(this.event,this.button.target,param.table);
		};
		
		JfClick.prototype._window = function($scope) {
			window.open(this.button.target) ;
		};
		
	    return {
	    	restrict: 'A',
	    	priority: 1,
	        link: function(scope, element, attrs){
	        	var $scope = scope.$new(false);
	        	
	        	var html = element.context.outerHTML ;
	        	var resId = attrs.jfClick ;
	        	
	        	$q.when(promise).then(function(data) {
	        		var jfClick = new JfClick(resId,data) ;
	        		if(!jfClick.hasButton){
						element.remove();
						return ;
					}
	        		
	        		var newElement = angular.element(html) ;
	        		newElement.attr('ng-click','excute($event)') ;
	        		newElement.removeAttr('jf-click') ;
	        		
	        		element.replaceWith(newElement) ;
	        		$compile(newElement)($scope);
	        		
	        		newElement.before('<!-- jfclick:' + resId + ' -->') ;
	        		
	        		$scope.excute = function(event) {
	        			jfClick.excute($scope,event);
					};
	        		
	        		$scope._back = function() {
	        			if(sessionStorage && sessionStorage.getItem('tabList')){
	        				var tabList = $rootScope.tabList || angular.fromJson(sessionStorage.getItem('tabList'));
	        				
	    					var chainKey = [] ;
	    					var chainValue = [] ;
	    					angular.forEach(tabList,function(tab){
	    						if(tab.isActive){
	    							chainKey = tab.backChainKey ;
	    							chainValue = tab.backChainValue ;
	    						}
	    					});
	    					var current = chainKey.indexOf($scope.$state.$current.name) ;
	    					if(current >= 0){
	    						chainKey.splice(current,1) ;
	    						chainValue.splice(current,1) ;
	    						sessionStorage.setItem("tabList",angular.toJson(tabList));
	    						$location.url(chainValue[current-1]).search('_',(new Date()).valueOf()) ;
	    					}
	    				}
					};
	        		
				}) ;
	        	
	        }
	    };
	});
});