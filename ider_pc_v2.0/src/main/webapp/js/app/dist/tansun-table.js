'use strict';
define(function(require) {
	var angular = require('angular');
	require('tansun-dependent') ;
	
	Tansun.directive('jfPage',function(){
	    return {
	        restrict: 'EA',	        
	        template:
	        	'<div ng-include="addon" class="page l-row tablepage"></div>' ,
	        replace: true,
	        scope: {
	        	jfPage: '='
	        },
	        link: function(scope, element, attrs){
	        	scope.pageConf = scope.jfPage ;
	        	scope.addon = ctx + '/pages/addon/addon-paging.html' ;
	            // 变更当前页
	            scope.changePageNum = function(item) {
	                if(item == '...'){

	                }else{
	                    scope.pageConf.pageNum = item;
	                    if(scope.pageConf.onChange){
	                    	scope.pageConf.onChange();
    	                }
	                }
	            };

	            // 定义分页的长度必须为奇数 (default:9)
	            scope.pageConf.pagesLength = parseInt(scope.pageConf.pagesLength) ? parseInt(scope.pageConf.pagesLength) : 13 ;
	            if(scope.pageConf.pagesLength % 2 === 0){
	                // 如果不是奇数的时候处理一下
	                scope.pageConf.pagesLength = scope.pageConf.pagesLength -1;
	            }

	            // conf.erPageOptions
	            if(!scope.pageConf.perPageOptions){
	                scope.pageConf.perPageOptions = [10, 15, 20, 30, 50];
	            }

	            // pageList数组
	            function getPagination(newValue, oldValue) {
	                
	                // conf.pageNum
	                scope.pageConf.pageNum = parseInt(scope.pageConf.pageNum) ? parseInt(scope.pageConf.pageNum) : 1;
	                
	                // conf.totalItems
	                scope.pageConf.totalItems = parseInt(scope.pageConf.totalItems) ? parseInt(scope.pageConf.totalItems) : 0;

	                // conf.pageSize (default:15)
	                scope.pageConf.pageSize = parseInt(scope.pageConf.pageSize) ? parseInt(scope.pageConf.pageSize) : 10;

	                // numberOfPages
	                scope.pageConf.numberOfPages = Math.ceil(scope.pageConf.totalItems/scope.pageConf.pageSize);

	                // judge pageNum > scope.numberOfPages
	                if(scope.pageConf.pageNum < 1){
	                    scope.pageConf.pageNum = 1;
	                }

	                // 如果分页总数>0，并且当前页大于分页总数
	                if(scope.pageConf.numberOfPages > 0 && scope.pageConf.pageNum > scope.pageConf.numberOfPages){
	                    scope.pageConf.pageNum = scope.pageConf.numberOfPages;
	                }

	                // jumpPageNum
	                scope.pageConf.jumpPageNum = scope.pageConf.pageNum;

	                // 如果pageSize在不在perPageOptions数组中，就把pageSize加入这个数组中
	                var perPageOptionsLength = scope.pageConf.perPageOptions.length;
	                // 定义状态
	                var perPageOptionsStatus;
	                for(var i = 0; i < perPageOptionsLength; i++){
	                    if(scope.pageConf.perPageOptions[i] == scope.pageConf.pageSize){
	                        perPageOptionsStatus = true;
	                    }
	                }
	                // 如果pageSize在不在perPageOptions数组中，就把pageSize加入这个数组中
	                if(!perPageOptionsStatus){
	                    scope.pageConf.perPageOptions.push(scope.pageConf.pageSize);
	                }

	                // 对选项进行sort
	                scope.pageConf.perPageOptions.sort(function(a, b){return a-b});

	                scope.pageList = [];
	                if(scope.pageConf.numberOfPages <= scope.pageConf.pagesLength){
	                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
	                    for(i =1; i <= scope.pageConf.numberOfPages; i++){
	                        scope.pageList.push(i);
	                    }
	                }else{
	                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
	                    // 计算中心偏移量
	                    var offset = (scope.pageConf.pagesLength - 1)/2;
	                    if(scope.pageConf.pageNum <= offset){
	                        // 左边没有...
	                        for(i =1; i <= offset +1; i++){
	                            scope.pageList.push(i);
	                        }
	                        scope.pageList.push('...');
	                        scope.pageList.push(scope.pageConf.numberOfPages);
	                    }else if(scope.pageConf.pageNum > scope.pageConf.numberOfPages - offset){
	                        scope.pageList.push(1);
	                        scope.pageList.push('...');
	                        for(i = offset + 1; i >= 1; i--){
	                            scope.pageList.push(scope.pageConf.numberOfPages - i);
	                        }
	                        scope.pageList.push(scope.pageConf.numberOfPages);
	                    }else{
	                        // 最后一种情况，两边都有...
	                        scope.pageList.push(1);
	                        scope.pageList.push('...');

	                        for(i = Math.ceil(offset/2) ; i >= 1; i--){
	                            scope.pageList.push(scope.pageConf.pageNum - i);
	                        }
	                        scope.pageList.push(scope.pageConf.pageNum);
	                        for(i = 1; i <= offset/2; i++){
	                            scope.pageList.push(scope.pageConf.pageNum + i);
	                        }

	                        scope.pageList.push('...');
	                        scope.pageList.push(scope.pageConf.numberOfPages);
	                    }
	                }

	                /*if(scope.pageConf.onChange){

	                    // 防止初始化两次请求问题
	                    if(!(oldValue != newValue && oldValue[0] == 0)) {
	                        scope.pageConf.onChange();
	                    }
	                    
	                }*/
	                scope.$parent.pageConf = scope.pageConf;
	            }

	            // prevPage
	            scope.prevPage = function(){
	                if(scope.pageConf.pageNum > 1){
	                    scope.pageConf.pageNum -= 1;
	                    if(scope.pageConf.onChange){
	                    	scope.pageConf.onChange();
    	                }
	                }
	            };
	            // nextPage
	            scope.nextPage = function(){
	                if(scope.pageConf.pageNum < scope.pageConf.numberOfPages){
	                    scope.pageConf.pageNum += 1;
	                    if(scope.pageConf.onChange){
	                    	scope.pageConf.onChange();
    	                }
	                }
	            };

	            // 跳转页
	            scope.jumpToPage = function(){
	            	if(!scope.pageConf.jumpPageNum){
	            		scope.pageConf.jumpPageNum = 1 ;
	            	}
	            	scope.pageConf.jumpPageNum = scope.pageConf.jumpPageNum + '' ;
	                scope.pageConf.jumpPageNum = scope.pageConf.jumpPageNum.replace(/[^0-9]/g,'');
	                if(scope.pageConf.jumpPageNum !== ''){
	                    scope.pageConf.pageNum = Number(scope.pageConf.jumpPageNum);
	                    if(scope.pageConf.onChange){
	                    	scope.pageConf.onChange();
    	                }
	                }
	            };

	            

	            scope.$watch(function() {

	                if(!scope.pageConf.totalItems) {
	                    scope.pageConf.totalItems = 0;
	                }
	                //没有数据时显示暂无数据
	                if(scope.pageConf.totalItems == 0){
	                	scope.description = "暂无数据" ;
	                }
	                var newValue = scope.pageConf.totalItems + ' ' +  scope.pageConf.pageNum + ' ' + scope.pageConf.pageSize;
    	                return newValue;

    	            }, getPagination);

    	        }
    	    }
    	}
    );
	
	Tansun.directive('jfGrid', function (jfGlobal,$injector,$compile,$timeout,$parse,jfLayer,$translate,$translatePartialLoader,T) {
	    return {
	    	restrict: 'A',
			scope: false,
//			priority: 1,
			terminal : true,
	        link: function (scope, element, attrs) {
	        	var $scope = scope.$new(false) ;
	        	$scope.grid = scope.$eval(attrs.jfGrid) || {};
	        	$scope.grid.id = $scope.grid.id || Tansun.GUID('grid');
	        	$scope.grid.autoQuery = angular.isDefined($scope.grid.autoQuery) ? $scope.grid.autoQuery : true ;
	        	//是否自定义点击事件（选择属性及事件要自己写）
	        	$scope.grid.autoClick = angular.isDefined($scope.grid.autoClick) ? $scope.grid.autoClick : false ;

	        	//处理排序
	        	element.find('[order]').each(function(index,item) {
	        		var order = angular.element(item) ;
	        		var orderBy = order.attr('order') ;
	        		var orderByDesc = orderBy + ' desc' ;
	        		
	        		order.attr('ng-click','grid.sort("' + orderBy + '")');
	        		order.addClass('sorting') ;
				}) ;
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
	        	
	        	var jfRest = $injector.get('jfRest');
	        	var jfLayer = $injector.get('jfLayer');
	        	var template = angular.element('<div ng-include="addon"></div>') ;
	        	var header = element.find('thead>tr');
				$scope.gridHeader = header.html() ;
	        	var body = element.find('tbody>tr') ;
	        	//modify time 2017-12-19 yuyq
	        	//字段字数过多显示...   
	        	body.find('td').addClass('intercept');
	        	//在td里面加上ignClass就不会自动帮你加intercept（文字过多会变成。。。）
	        	var ignClass=body.find('td[ignClass]');
	        	if(ignClass){
	        		ignClass.removeClass('intercept');
	        	}
	        	//列表字段超过7个时，隐藏列表的td不加intercept样式。避免样式被覆盖
	        	var messages=body.find('div[class="title_messages"]');
	        	if(messages){
	        		messages.parent().removeClass('intercept');
	        	}
	        	var select=body.find('select');
	        	if(select){
	        		select.parent().removeClass('intercept');
	        	}
	        	// end time 2017-12-19 yuyq
	        	var bottons = element.find('div[name="buttons"]');
				$scope.gridBody = body.html();
				$scope.addon = jfGlobal.ctx + '/pages/addon/addon-list.html' ;
				$scope.listName = $scope.grid.title || '列表';
				$scope.colNum = header[0].cells.length ;
				if($scope.grid.checkType){
					$scope.colNum=$scope.colNum+1;
				}
				$scope.gridMessage = '加载中...' ;
				$scope.buttons = bottons.html() ;
	        	
	        	if(!$scope.grid.resource){
	        		return ;
	        	}
	        	var resouces = $scope.grid.resource.split(".");
	        	$scope.search = function() {
	        		var index = jfLayer.load();
	        		$timeout(function(){
	        			jfLayer.close(index);
					},1000);
	        		if(!$scope.grid.params){
	        			$scope.grid.params = {} ;
	        		}
	        		if ($scope.grid.page) {
        				$scope.grid.params.pageNum = $scope.grid.page.pageNum;
	        			$scope.grid.params.pageSize = $scope.grid.page.pageSize;
					}
	        		//判断是否触发查询
	        		//var request = jfRest.request(resouces[0], resouces[1], Tansun.param($scope.grid.params)) ;
	        		var request = jfRest.request(resouces[0], resouces[1], $scope.grid.params) ;
	        		request.then(function (data) {
	        			$scope.grid.data = [] ;
	        			if($scope.grid.callback && typeof $scope.grid.callback  === 'function'){
	        				$scope.grid.callback(data) ;
	        			}
		                if(data && (data.status == 200 || data.returnCode == '000000')  ){
		                	
		                	//table中数据字典翻译 
		                	/*isTrans： true/false,
		                	 * transParams: [查找对应数据参数]，
		                	transDict:[{翻译前key值_翻译后key}] 如'feeType_feeTypeDesc'*/
		                	if(data.returnData){
		                		if($scope.grid.isTrans && $scope.grid.transDict && data.returnData.rows){
			                		var rows = data.returnData.rows;
			                		angular.forEach($scope.grid.transParams,function(transParamsi,i){
			                			//先查缓存是否有，没有再请求参数表
			                			var transData = JSON.parse(Session.get(transParamsi));
				                		if(transData){
				                			if(rows && rows.length>0 && transData){
		        								angular.forEach(rows,function(item,m){
		        									if(item[$scope.grid.transDict[i].split('_')[0]]){
		        										angular.forEach(transData,function(transItem,n){
		        											if(item[$scope.grid.transDict[i].split('_')[0]] == transItem['codes']){
		        												item[$scope.grid.transDict[i].split('_')[1]] = transItem['detailDesc'];
		        											}
		        										});
		        									}else{
		    		        							item[$scope.grid.transDict[i].split('_')[1]] = '';
		    		        						}
		        								})
		        							}
				                		}else {
				                			$scope.dictParams = {
						        					type:"DROPDOWNBOX",
						        					queryFlag:"children",
						        					groupsCode: transParamsi,
							        			};
					                			jfRest.request('paramsManage', 'query', $scope.dictParams) .then(function(resData) {
					                				if (resData.returnCode == '000000') {
					        							var transRows = resData.returnData.rows;
					        							if(rows && rows.length>0 && transRows){
					        								
					        								Session.set(transParamsi,JSON.stringify(transRows));
					        								
					        								angular.forEach(rows,function(item,m){
					        									if(item[$scope.grid.transDict[i].split('_')[0]]){
					        										angular.forEach(transRows,function(transItem,n){
					        											if(item[$scope.grid.transDict[i].split('_')[0]] == transItem['codes']){
					        												item[$scope.grid.transDict[i].split('_')[1]] = transItem['detailDesc'];
					        											}
					        										});
					        									}else{
					    		        							item[$scope.grid.transDict[i].split('_')[1]] = '';
					    		        						}
					        								})
					        							}
					        						}
					                			});
                                        }
                                    });
                                }
                            }
		                	
		                	if(data.returnData){
		        				if($scope.grid.paging && data.returnData.rows){
		        					$scope.grid.data = data.returnData.rows ;
		        					$scope.grid.page.totalItems = data.returnData.totalCount;
		        				}else if($scope.grid.paging && data.returnData){
		        					//对应封锁码管理范围
		        					if(data.returnData.sceneTriggerObject == 'P'){//listX5120VOs
		        						$scope.grid.data = data.returnData.listX5120VOs;
		        						$scope.grid.page.totalItems = data.returnData.listX5120VOs.length;
		        					}else if(data.returnData.sceneTriggerObject == 'M'){ //listcoreMediaBasicInfo
		        						$scope.grid.data = data.returnData.listcoreMediaBasicInfo;
		        						$scope.grid.page.totalItems = data.returnData.listcoreMediaBasicInfo.length;
		        					}
		        				}else{
		        					if(angular.isArray(data.returnData.rows)){
		        						$scope.grid.data = data.returnData.rows ;
		        					}else{
		        						$scope.grid.data = data.returnData.rows ;
		        						if(data.returnData.totalCount == 0)
		        							data.returnData.rows =[];
		        					}
                                }
                                if(!$scope.grid.data || $scope.grid.data.length <= 0){
		        					$scope.grid.message = T.T('F00161') ;
                                }
                            }else {
		                		data.returnData = {
		                				rows : []
		                		};
		                		$scope.grid.message = T.T('F00161') ;

}
                        }
		                
	        			else if(data.returnCode != '000000'|| data.returnData == undefined || data.returnData == null || data == undefined || data == null ){
	        				if($scope.grid.paging){
	        					$scope.grid.page.totalItems = 0;
	        				}
	        				
	        				$scope.grid.mssage = data.returnMsg ? data.returnCode +":"+data.returnMsg : T.T('F00188');
//	        				jfLayer.alert($scope.grid.mssage);
	        			}
	        		
		                jfLayer.close(index);
		                $timeout(function(){
		                	Tansun.plugins.render();
						});
		            });
				};
				
				$scope.grid.search = function(){
					if(!$scope.grid.page){
						$scope.grid.page={};
					}
					$scope.grid.page.pageNum = 1 ;
					//判断是否加载数据
					$scope.search() ;
				};
				
				//选择某一条数据时将该数据设置为选中的效果
				$scope.checked = function(row) {
					switch ($scope.grid.checkType) {
					case 'checkbox':
						row._checked = !row._checked ;
						break ;
					case 'radio' :
						angular.forEach($scope.grid.data,function(item){
							item._checked = false ;
						}) ;
						row._checked = true ;
						break ;
					}
					//行选中事件回调
					if($scope.grid.checkBack){
						$scope.grid.checkBack(row);
					}
					$timeout(function(){
						Tansun.plugins.render();
					});
				};
				//全选
				$scope.checkedAll = function() {
					var isSelect=$('[check_id='+$scope.grid.id+"]").is(':checked');
					angular.forEach($scope.grid.data,function(item){
							item._checked = isSelect ;
					}) ;
					//全选事件回调
					if($scope.grid.checkAllBack){
						$scope.grid.checkAllBack($scope.grid.data);
					}
					$timeout(function(){
						Tansun.plugins.render();
					});
				};
				
				$scope.grid.checkedList = function() {
					var checkeds = [] ;
					angular.forEach($scope.grid.data,function(item){
						if(item._checked){
							checkeds.push(item) ;
						}
					}) ;
					//如果是单选直接返回
					if(this.checkType=='radio'){
						return checkeds[0] ;
					}
					return checkeds ;
				};
				
				$scope.grid.validCheck = function() {
					var checkedList = $scope.grid.checkedList() ;
					var message = this.checkType == 'checkbox' ? '请至少选中一条记录' : '请选中一条记录' ;
					if((this.checkType=='radio'&&!checkedList)||(this.checkType=='checkbox'&&checkedList.length <= 0)){
						jfLayer.alert(message) ;
						return false ;
					}
					return true ;
				};
				//通过表格执行请求操作，参数1代表资源目标，参数2如果是方法则是回调函数，否则默认为操作提示，当参数2为方法时才需要传入参数3。代表操作提示
				$scope.grid.request = function() {
					var target = arguments[0] ;
					var callback = $scope.grid.search ;
					var message = arguments[1] || '您确定删除这条记录吗?' ;
					if(angular.isFunction(arguments[1])){
						message = arguments[2] || '您确定删除这条记录吗?' ;
						callback = arguments[1] ;
					}
					
					if(!target){
						return ;
					}
					
					var targets = target.split('?') ;
					if(!targets[0]){
						throw 'grid异步请求资源未定义' ;
					}
					var resource = targets[0].split('.') ;
					
					if(!this.validCheck()){
						return ;
					}
					
					var params = $scope.getUrlParam(targets[1],this.checkedList()) || {};
					
					jfLayer.confirm(message,function(){
						jfRest.request(resource[0],resource[1],Tansun.param(params)).then(function(data) {
							if(data.status == 200){
								jfLayer.success(data.description, function(){
//			        				$rootScope.checkItemMap.remove(tableName); //移除选中
			        				callback(data) ;
								});
							}else{
								jfLayer.fail(data.description);
							}
							
						})
					}) ;
				};
				
				$scope.grid.sort = function(orderBy) {
					var gridElem = angular.element('#' + $scope.grid.id) ;
					var orderElem = gridElem.find('[order="' + orderBy + '"]') ;
					$scope.grid.params = $scope.grid.params || {} ;
					
					if(orderElem.hasClass('sorting')){
						var orderElems = gridElem.find('[order]') ;
						orderElems.removeClass('sorting_desc');
						orderElems.removeClass('sorting_asc');
						orderElems.addClass('sorting');
						orderElem.removeClass('sorting');
						orderElem.addClass('sorting_desc') ;
						$scope.grid.params.orderBy = orderBy + ' desc' ;
					}else if(orderElem.hasClass('sorting_desc')){
						orderElem.removeClass('sorting_desc');
						orderElem.addClass('sorting_asc') ;
						$scope.grid.params.orderBy = orderBy ;
					}else if(orderElem.hasClass('sorting_asc')){
						orderElem.removeClass('sorting_asc');
						orderElem.addClass('sorting_desc') ;
						$scope.grid.params.orderBy = orderBy + ' desc' ;
					}
					$scope.grid.search() ;
				};
				
				$scope.grid.turn = function(url) {
					if(!angular.isDefined(url)){
						return ;
					}
					//新增也可能默认传参，如果不是从选中对象取值的话就无需做选中校验
					var paramNm = url.split('?')[1] ;
					var isEdit=false;
					if(paramNm){
						var params = paramNm.split('&');
						angular.forEach(params,function(param){
							if(param.indexOf('=') > -1){
							}else{
								isEdit=true;
							}
						}) ;
					}
					if (isEdit && !$scope.grid.validCheck()) {
						return ;
					}
					$scope.turn(url,this.checkedList()) ;
				};
				
				$scope.grid.modal = function(url,option) {
					if (url.indexOf("?") > 0 && !$scope.grid.validCheck()) {
						return ;
					}
					var modal = $scope.modal(url,this.checkedList(),option) ;
					return modal;
				};
				
				if($scope.grid.paging){
					$scope.grid.page = {
						onChange : function(){
							$scope.search();
						},
						onChangeaPage : function(){
							$scope.grid.page.pageNum = 1;
							var index = jfLayer.load();
			        		$timeout(function(){
			        			jfLayer.close(index);
							},1000);
			        		if(!$scope.grid.params){
			        			$scope.grid.params = {} ;
			        		}
			        		if ($scope.grid.page) {
		        				$scope.grid.params.pageNum = 1;
			        			$scope.grid.params.pageSize = $scope.grid.page.pageSize;
							}
			        		//判断是否触发查询
			        		//var request = jfRest.request(resouces[0], resouces[1], Tansun.param($scope.grid.params)) ;
			        		var request = jfRest.request(resouces[0], resouces[1], $scope.grid.params) ;
			        		request.then(function (data) {
			        			$scope.grid.data = [] ;
			        			if($scope.grid.callback && typeof $scope.grid.callback  === 'function'){
			        				$scope.grid.callback(data) ;
			        			}
				                //&& (data.returnData.rows)
				                if(data && (data.status == 200 || data.returnCode == '000000')  ){
				                	
				                	//table中数据字典翻译 
				                	/*isTrans： true/false,
				                	 * transParams: [查找对应数据参数]，
				                	transDict:[{翻译前key值_翻译后key}] 如'feeType_feeTypeDesc'*/
				                	if(data.returnData){
				                		if($scope.grid.isTrans && $scope.grid.transDict && data.returnData.rows){
					                		var rows = data.returnData.rows;
					                		angular.forEach($scope.grid.transParams,function(transParamsi,i){
					                			//先查缓存是否有，没有再请求参数表
					                			var transData = JSON.parse(Session.get(transParamsi));
						                		if(transData){
						                			if(rows && rows.length>0 && transData){
				        								angular.forEach(rows,function(item,m){
				        									if(item[$scope.grid.transDict[i].split('_')[0]]){
				        										angular.forEach(transData,function(transItem,n){
				        											if(item[$scope.grid.transDict[i].split('_')[0]] == transItem['codes']){
				        												item[$scope.grid.transDict[i].split('_')[1]] = transItem['detailDesc'];
				        											}
				        										});
				        									}else{
				    		        							item[$scope.grid.transDict[i].split('_')[1]] = '';
				    		        						}
				        								})
				        							}
						                		}else {
						                			$scope.dictParams = {
								        					type:"DROPDOWNBOX",
								        					queryFlag:"children",
								        					groupsCode: transParamsi,
									        			};
							                			jfRest.request('paramsManage', 'query', $scope.dictParams) .then(function(resData) {
							                				if (resData.returnCode == '000000') {
							        							var transRows = resData.returnData.rows;
							        							if(rows && rows.length>0 && transRows){
							        								
							        								Session.set(transParamsi,JSON.stringify(transRows));
							        								
							        								angular.forEach(rows,function(item,m){
							        									if(item[$scope.grid.transDict[i].split('_')[0]]){
							        										angular.forEach(transRows,function(transItem,n){
							        											if(item[$scope.grid.transDict[i].split('_')[0]] == transItem['codes']){
							        												item[$scope.grid.transDict[i].split('_')[1]] = transItem['detailDesc'];
							        											}
							        										});
							        									}else{
							    		        							item[$scope.grid.transDict[i].split('_')[1]] = '';
							    		        						}
							        								})
							        							}
							        						}
							                			});
                                                }
                                            });
                                        }
                                    }
				                	
				                	
				                	if(data.returnData){
				        				if($scope.grid.paging && data.returnData.rows){
				        					$scope.grid.data = data.returnData.rows ;
				        					$scope.grid.page.totalItems = data.returnData.totalCount;
				        				}else if($scope.grid.paging && data.returnData){
				        					//对应封锁码管理范围
				        					if(data.returnData.sceneTriggerObject == 'P'){//listX5120VOs
				        						$scope.grid.data = data.returnData.listX5120VOs;
				        						$scope.grid.page.totalItems = data.returnData.listX5120VOs.length;
				        					}else if(data.returnData.sceneTriggerObject == 'M'){ //listcoreMediaBasicInfo
				        						$scope.grid.data = data.returnData.listcoreMediaBasicInfo;
				        						$scope.grid.page.totalItems = data.returnData.listcoreMediaBasicInfo.length;
				        					}
				        				}else{
				        					if(angular.isArray(data.returnData.rows)){
				        						$scope.grid.data = data.returnData.rows ;
				        					}else{
				        						$scope.grid.data = data.returnData.rows ;
				        						if(data.returnData.totalCount == 0)
				        							data.returnData.rows =[];
				        					}
				        				}
				        				if(!$scope.grid.data || $scope.grid.data.length <= 0){
				        					$scope.grid.message = T.T('F00161') ;
					        			}
				                	}else {
				                		
				                		data.returnData = {
				                				rows : []
				                		};
				                		$scope.grid.message = T.T('F00161') ;

}
                                }
				                
			        			else if(data.returnCode != '000000'|| data.returnData == undefined || data.returnData == null || data == undefined || data == null ){
			        				if($scope.grid.paging){
			        					$scope.grid.page.totalItems = 0;
			        				}
			        				
			        				$scope.grid.mssage = data.returnCode +":"+data.returnMsg;
			        				jfLayer.alert($scope.grid.mssage);
			        			}
			        		
				                jfLayer.close(index);
				                $timeout(function(){
				                	Tansun.plugins.render();
								});
				            });
						},
						
						pageNum : 1 ,
						pageSize : 10 
					};
				}
	        	
				element.replaceWith(template);  
				$compile(template)($scope) ;
				
				if($scope.grid.autoQuery){
					$scope.grid.search() ;
				}
				
				$timeout(function(){
					Tansun.plugins.render();
				});
	        }
	    };
	});
	
	/**
	 * 导航条组件
	 */
	Tansun.directive('jfNav', function($injector,$compile,$anchorScroll,$location,$window,$rootScope,$timeout,$translate,$translatePartialLoader,T) {
		return {
	        restrict: 'A',
	        scope: false ,
	        link: function (scope, element, attrs) {
	        	var $scope = scope.$new(false) ;
	        	$scope.addon = $scope.global.pagePath + '/addon/addon-nav.html';
	        	var template = angular.element('<div ng-include="addon">') ;
	        	
	        	$scope.nav = scope.$eval(attrs.jfNav) || {} ;
	        	$scope.nav.id = $scope.nav.id || Tansun.GUID('jfNav') ;
	        	$scope.nav.mode = $scope.nav.mode || 'toggle' ;
	        	$scope.nav.navs = [] ;
	        	element.children().each(function(index,item) {
	        		var nav = {};
	        		var child = angular.element(item) ;
	        		nav.id = Tansun.GUID('nav') ;
	        		nav.url = $scope.global.pagePath + child.attr('url') ;
	        		nav.title = child.attr('title') ;
	        		nav.sortid = child.attr('sortid') ;//顺序标示
	        		nav.valiParam = child.attr('valiParam') || '';
	        		nav.load = typeof(child.attr('load')) !="undefined" ;
	        		nav.show = true ;
	        		$scope.nav.navs.push(nav) ;
				}) ;
	        	
	        	//激活Nav
				$scope.active = function(nav) {
					angular.forEach($scope.nav.navs,function(item){
						item.active = false ;
					}) ;
					
					var valiFunc = $scope.$eval('onNavChange');
	        		if(angular.isFunction(valiFunc) && !valiFunc(nav)){
	        			return ;
	        		}
					$scope.nav.loadContent(nav);
					nav.active = true ;
				};
				//初始化选中导航
				$scope.initNav = function() {
					$scope.active($scope.nav.navs[0]) ;
				};
				//根据当前的页面默认激活导航高亮
				$scope.defaultActive = function() {
					$timeout(function() {
						var parentElem = angular.element('#' + $scope.nav.id) ;
						//避免空值报错
						if(!parentElem.offset()){
							return ;
						}
						var parentOffSetTop = parentElem.offset().top ; 
						var activeNav =  $scope.nav.navs[0] ;
						
						switch ($scope.nav.mode) {
						case 'toggle' :
							break ;
						case 'scroll':
							var scrollTop = angular.element(document).scrollTop() ;
							var navs = $scope.nav.getShowNav() ;
							angular.forEach(navs,function(item){
								//避免空值报错
								if(angular.element('#' + item.id).offset()){
									var offsetTop = angular.element('#' + item.id).offset().top ;
									//如果标签距离顶部的距离已经小于父节点与页面顶部的距离
									if(offsetTop - scrollTop - 120 <= parentOffSetTop){
										activeNav = item ;
									}
								}
							}) ;
							if (scrollTop >= angular.element(document).height() - angular.element(window).height()) {
								activeNav = navs[navs.length - 1] ;
						    }
							
							break;
						}
						
						$scope.active(activeNav) ;
					});
				};
	        	
	        	//切换导航
	        	$scope.nav.changeNav = function(item) {
					switch ($scope.nav.mode) {
					case 'scroll':
						var offset = angular.element('#' + item.id).offset() ;
						
						if(offset){
							angular.element("html, body").animate({
								scrollTop : offset.top - 120 + "px"
							}, {
								duration: 500,
								easing: "swing"
							});
						}
						break;
					case 'toggle' :
		        		$scope.active(item) ;
						break ;
					default:
						break;
					}
				};
				//判断导航的模式，如果滚动条锚点的则监听滚动条
				if($scope.nav.mode == 'scroll'){
					angular.element($window).on("scroll", function(event) {
						$scope.defaultActive();
					});
                }
                //隐藏导航
				$scope.nav.hideNav = function(hideNavs) {
					hideNavs = hideNavs || [] ;
					if(angular.isArray(hideNavs)){
						angular.forEach($scope.nav.navs,function(nav,idx){
							if(hideNavs.indexOf(idx+1) >= 0 && hideNavs.length > 0){
								nav.show = false ;
							}else{
								nav.show = true ;
							}
						}) ;
					}
					
					$scope.defaultActive() ;
				};
				//显示导航
				$scope.nav.showNav = function(showNavs) {
					showNavs = showNavs || [] ;
					if(angular.isArray(showNavs)){
						angular.forEach($scope.nav.navs,function(nav,idx){
							if(showNavs.indexOf(idx+1) >= 0 || showNavs.length <= 0){
								nav.show = true ;
							}else{
								nav.show = false ;
							}
						}) ;
					}
					
					$scope.defaultActive() ;
				};
				//获取当前显示的导航
				$scope.nav.getShowNav = function() {
					var showNavs = [] ;
					angular.forEach($scope.nav.navs,function(nav){
						if(nav.show){
							showNavs.push(nav) ;
						}
					}) ;
					return showNavs ;
				};
				
				$scope.nav.loadContent = function(nav) {
					angular.element('#' + nav.id).find('.jfGrid').each(function(idx,obj) {
						var targetGrid = angular.element(obj).scope().grid ;
						if(targetGrid&& !targetGrid.autoQuery&&targetGrid.fileSearch!=false){ 
							targetGrid.autoQuery = true ;
							targetGrid.search();
						}
					}) ;
				};
				
				
				element.replaceWith(template);  
				$compile(template)($scope);
				
	        }
	    };
	});
	
	Tansun.directive('jfTree', function ($injector,$compile,$timeout,$rootScope,$resource,$translate,$translatePartialLoader,T) {
		var jfRest =  $injector.get('jfRest');
		
		return {
	    	restrict: 'A',
			scope: false,
	        link: function (scope, element, attrs) {
	        	Tansun.loadCss($rootScope.global.cssPath + '/zTreeStyle/zTreeStyle.css') ;
	        	
	        	var $scope = scope.$new(false);
	        	var id = Tansun.GUID('jftree') ;
	        	
	        	var defaultOption = {
                	reload : function(value,initSelected) {
                		var thiz = this ;
                		if(value){
                			thiz.params=value;
                		}
                		if(initSelected){
                			thiz.initSelected=initSelected;
                		}
                		if(thiz.async){
                			var resources = thiz.resource.split('.') ;
                			thiz.setting.async={
            					enable: true,
            					url: Tansun.getResful(resources[0],resources[1]),
            					autoParam: ["id","pId"],
            					otherParam:Tansun.param(thiz.params || {}),
            					dataFilter: function(treeId, parentNode, childNodes) {
            						if (!childNodes) return null; 
            						for (var i=0, l=childNodes.data.length; i<l; i++) {
            							childNodes.data[i].name = childNodes.data[i].name.replace(/\.n/g, '.'); 
            						}
            						return childNodes.data; 
            					}
            				}
                		}
        				
                		var resources = thiz.resource.split('.') ;
    					Tansun.loadScript('jquery-ztree', function(ztree) {
    						jfRest.request(resources[0], resources[1], Tansun.param(thiz.params || {})).then(function(treedata){
        						if(treedata.status == 200){
        							jQuery.fn.zTree.init(jQuery("#" + thiz.id), thiz.setting , treedata.data);
        							var tree=jQuery.fn.zTree.getZTreeObj(thiz.id);
        							//初始化选中对应的id
        							if(thiz.initSelected){
        								var list=thiz.initSelected.split(",");
        								angular.forEach(list,function(checked){
        									tree.checkNode(tree.getNodeByParam("id",checked),true);
        								});
        							}
        							//是否设置父节点不可点击
        							if(thiz.disableParent){
        								var nodes = tree.transformToArray(tree.getNodes());
           							 	for (var i=0, l=nodes.length; i < l; i++) {
           			                      if (nodes[i].isParent){
           			                    	  tree.setChkDisabled(nodes[i], true);
           			                      }
           			                    }
        							}
       						
        							jQuery.fn.zTree.getZTreeObj(thiz.id).refresh();
        						} else {
        							$scope.message = T.T('F00161') ;
        						}
        					});
    					}) ;
        			},
        			getChecked : function(properties) {
        				var thiz = this ;
        				var tree = jQuery.fn.zTree.getZTreeObj(thiz.id) ;
        				var checkedNodes = tree.getCheckedNodes(true); 
        				if(properties){
        					var checkeds = [] ;
        					angular.forEach(checkedNodes,function(item){
        						checkeds.push(item[properties]) ;
        					}) ;
        					return checkeds.toString() ;
        				}else{
        					return checkedNodes ;
        				}
					},
					findNodes : function(value) {
						var tree = jQuery.fn.zTree.getZTreeObj(this.id) ;
						tree.expandAll(false);
						angular.forEach(tree.transformToArray(tree.getNodes()),function(node){
							node.highlight = false ;
							tree.updateNode(node) ;
						}) ;
						if(!value){
							return ;
						}
						var matchNodes = tree.getNodesByParamFuzzy('name',value) ;
						angular.forEach(matchNodes,function(node){
							node.highlight = true ;
							angular.forEach(node.getPath(),function(path){
								if(path == node){
									return ;
								}
								tree.expandNode(path,true,false,false) ;
							}) ;
							tree.updateNode(node) ;
						});
						return matchNodes;
					},
        			setting : {
        				data: {
        					simpleData: {
        						enable: true
        					}
        				},
        				view: {
        					fontCss : function(treeId,treeNode){
        						return (!!treeNode.highlight) ? {"font-weight":"bold"} : {"font-weight":"normal"};
        					},
        					showLine: false
        				},
        				callback:{
        					onClick:function(event, treeId, treeNode, clickFlag){
        						if(angular.isFunction($scope.jfTree.nodeClick)){
        							$scope.jfTree.nodeClick(treeNode) ;
        						}
        						$scope.safeApply();
        					},
        					onCheck:function(event, treeId, treeNode, clickFlag){
        						if(angular.isFunction($scope.jfTree.nodeCheck)){
        							$scope.jfTree.nodeCheck(treeNode) ;
        						}
        						$scope.safeApply() ;
        					}
        				}
        			}
            	};
	        	
	        	var init = function(option) {
	        		angular.extend(option,defaultOption);
	        		if($scope.jfTree != option){
	        			$scope.jfTree = option ;
	        		}
	        		option.id = id;
	        		option.resource = option.resource || '' ;
	        		if(option.check){
		        		option.setting.check = option.check;
	        		}else{
		        		option.setting.check = {enable: option.isCheck} ;
	        		}
	        		option.reload() ;
				};
				
				var panel = angular.element('<ul>');
				panel.addClass('ztree') ;
				panel.attr('id',id) ;
				panel.css({overflow:'auto'}) ;
				element.append(panel) ;
				
	        	if(!attrs.jfTree){
	        		throw 'jfTree参数不能为空' ;
	        	}else if(attrs.jfTree.indexOf('(') > -1){
	        		init($scope.$eval(attrs.jfTree)) ;
	        	}else{
	        		scope.$watch(attrs.jfTree,function(newValue,oldValue){
//	        			if(angular.equals(newValue,oldValue)){
//	        				return ;
//	        			}
	        			init(newValue) ;
		        	});
	        	}
	        	
	        }
	    };
	});
});