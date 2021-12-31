'use strict';
define(function(require, exports, module) {
	var angular = require('angular');
	require('tansun-dependent') ;
	Tansun.factory('jfLayer',function(jfGlobal,$validation) {
		var layerWidget = {};
		layerWidget.alert = function(message, callback) {
			Tansun.plugins.layer.alert(message, {
				icon: 7,
				//time: 2000, //2秒后自动关闭
				closeBtn : 0
			}, callback);
		};

		layerWidget.success = function(message, callback) {
			Tansun.plugins.layer.msg(message, {
				shade : 0.01, // 遮罩透明度
				//time: 2000, //2秒后自动关闭
				icon : 1
			}, callback);
		};
		
		//自动退出，并执行callback
		layerWidget.atuoCloseAlert = function(message, callback) {
			Tansun.plugins.layer.msg(message, {
				shade : 0.01, // 遮罩透明度
				time: 2000, //2秒后自动关闭
				icon : 7,
			}, callback);
		};
		
		
		layerWidget.fail = function(message, callback) {
//			Tansun.plugins.layer.msg(message, {
//				icon : 2
//			}, callback);
			Tansun.plugins.layer.alert(message, {
				icon: 2,
				//time: 2000, //2秒后自动关闭
				closeBtn : 0
			}, callback);
		};

		layerWidget.confirm = function(message, yes, no) {
			Tansun.plugins.layer.confirm(message, {
				icon : 3,
				btn : [ '确定', '取消' ]
			// 按钮
			}, function(index) {
				Tansun.plugins.layer.close(index);
				yes();
			}, function(index) {
				Tansun.plugins.layer.close(index);
				if(no){
					no();
				}
				
			});
		};
		
		
		layerWidget.confirmSet = function(message, yes, no) {
			Tansun.plugins.layer.confirm(message, {
				icon : 3,
				btn : [ '设置', '跳过' ]
			// 按钮
			}, function(index) {
				Tansun.plugins.layer.close(index);
				yes();
			}, function(index) {
				Tansun.plugins.layer.close(index);
				if(no){
					no();
				}
				
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
			Tansun.plugins.layer.open({
				type : 2,
				area : area,
				skin : 'layui-Tansun.plugins.layer-rim',
				maxmin : true,
				cancel : callBack,
				content : [ url, 'yes' ]
			});

		};

		layerWidget.load = function() {
			return Tansun.plugins.layer.load(1, {
				shadeClose : false
			});
		};

		layerWidget.closeAll = function(type) {
			Tansun.plugins.layer.closeAll(type);
		};

		layerWidget.close = function(index) {
			Tansun.plugins.layer.close(index);
		};

		layerWidget.dialog = function(elemId, title, callBack, area, yes) {
			if (!area) {
				area = [ '800px', '600px' ];
			}
			if (!title) {
				title = false;
			}

			// 捕获页
			var newIndex = Tansun.plugins.layer.open({
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
					Tansun.plugins.layer.close(index);
					//this.content.show();
					callBack();
				},
				btn : ['确认', '取消'],
				yes : function(index) {
					yes(index);
				},
				btn2 : function(index) {
					Tansun.plugins.layer.close(index);
				}
			});
			return newIndex;
		};

		layerWidget.modal = function(elemId,title,area,buttons,callbacks) {
			buttons = buttons || ['确定','取消'] ;
			callbacks = callbacks || [] ;
			
			if(typeof buttons === 'string'){
				buttons = buttons.split(',');
			}
			
			var modal = {
				type : 1,
				area : area || ['700px','400px'],
				title : title || false,
				skin : 'layui-layer-rim', // 加上边框
				shade : 0.6, // 遮罩透明度
				moveType : 1, // 拖拽风格，0是默认，1是传统拖动
				shift : -1, // 0-6的动画形式，-1不开启
				content : jQuery('#' + elemId),
				btn : buttons,
				getMainContent : function() {
					var modalDiv = angular.element('#' + elemId) ;
					var result = {
					};
					
					//scope获取方式修改
					var targetElement = modalDiv.find('[ng-include]:first').find(':first') ;
					var targetScope = targetElement.scope() ;
					modalDiv.find('form').each(function(idx,obj) {
						var formName = angular.element(obj).attr('name') ;
						result.form = targetScope.$eval(formName) ;
					});
					result.scope = targetScope;
//					result.form = targetForm ;
					
					modal.scope = result.scope ;
					return result ;
				},
				cancel : function(index) {
					var cancel = callbacks[callbacks.length-1] ;
					if(angular.isFunction(cancel)){
						cancel(index) ;
					}
					if(callbacks.length == 1){
						if(angular.isFunction(cancel)){
							cancel(index) ;
						}
					}
				},
			};
			
			angular.forEach(buttons,function(button,index){
				if(index == 0){
					if(angular.isFunction(callbacks[index])){
						modal.yes = function() {
							var mainContent = modal.getMainContent() ;
							if(modal.btn.length == 1 && modal.btn[0] == '关闭'){
								callbacks[index](modal) ;
							}else{
								if(mainContent.form){
									$validation.validate(mainContent.form).success(function() {
										callbacks[index](modal) ;
									}) ;
								}else{
									callbacks[index](modal) ;
								}
							}
						} ;
					}
				}else{
					modal['btn' + (index + 1)] = function() {
						var callback = callbacks[index] || callbacks[callbacks.length - 1] ;
						callback(modal);
					};
				}
			});
			
			var index = Tansun.plugins.layer.open(modal);
			return index;
		};
		
		return layerWidget;
	});
});