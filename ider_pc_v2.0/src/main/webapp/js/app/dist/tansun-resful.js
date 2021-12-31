'use strict';

define(function(require, exports, module) {
  
	var angular = require('angular');
	var config = {} ;
	
	Tansun.factory('jfRest',function($injector,$location,lodinDataService,$resource,$q,jfGlobal,$translate,$translatePartialLoader,T,$timeout) {
		var loginName = sessionStorage.getItem("userName");//用户名
		var jfRest = {} ;
		
		
		//截取字符串
		function replacepos(text,index,replacetext){
		   	var  mystr = text.substring(0,index)+replacetext+text.substring(index+1);
		   	 return mystr;
        }
        //登录超时，自动跳转登录
		jfRest.open = function(){
			location.href = ctx + "/pages/iderLogin.html";
		};
		jfRest.config = {} ;
		jfRest.register = function(resfulCfg) {
			angular.forEach(resfulCfg,function(resource,api){
				angular.forEach(resource,function(url,method){
					var req = url.split("|");
					var httpMethod = req[1] || "POST";
					var uri = req[0];
					//静态数据的请求转换
					var startWith = /^\/json\//ig; 
					var endWith = /\.json$/i;
					if(startWith.test(uri) && endWith.test(uri)){
						httpMethod = "GET";
					}
					if(url.indexOf("http://")<0){
						url = Tansun.getContextPath() + req[0];
					}
					
					resfulCfg[api][method] = {
						headers : {
							//'Content-Type': 'application/x-www-form-urlencoded',
							'Content-Type': 'application/json',
							'X-Requested-With' : 'XMLHttpRequest',
//							'Authorization':sessionStorage.getItem("clientToken")
						}, 
						isArray : false,
						method : httpMethod,
						url : url
					}
				}) ;
			}) ;
			
			angular.extend(config,resfulCfg) ;
		};
		
		jfRest.request = function(api,method,params,handler,eventNo) {
			var key;
			for (key in  params){
				if(params[key] == "null" || params[key] === ""){
					delete params[key];
                }
            }
            if(null!=sessionStorage.getItem("userName") && "" !=sessionStorage.getItem("userName")){
				params.operatorId = sessionStorage.getItem("userName");
				//params.institutionId = sessionStorage.getItem("institutionId") ;   //机构
				params.corporation = sessionStorage.getItem("corporation");  //法人实体ID
				params.adminFlagUser = sessionStorage.getItem("adminFlag");   //用户管理员标示
            }
            params.clientToken = sessionStorage.getItem("clientToken");
			
			//传参：语言
			if(sessionStorage.getItem("userName")){
				var userName = sessionStorage.getItem("userName");
				var langStr = userName+'_lang';
				if(!params.userLanguage){
					params.userLanguage = sessionStorage.getItem(langStr);
				}else {
					params.userLanguage = params.userLanguage;
				}
            }
            var deferred = $q.defer();
			var resrouce = $resource(api,{},config[api]);
			var jfLayer = $injector.get('jfLayer');
			
			if(handler && typeof(handler) === 'function'){
				var test = handler();
				if(!test){
					deferred.reject({error:'控制方法执行未通过'});
					return deferred.promise;
				}
			}
			
			var index;
			/*if(method == 'save'){
				index = jfLayer.load();
			}*/
			if(method == 'trends'){
				if(eventNo){
					var eventTrend = "";
					 eventTrend = eventNo;
					var configTrend = "";
					configTrend = config[api];
					 delete configTrend.trends['url'];
					 configTrend.trends.url = ctx + eventTrend;
					resrouce = "";
					resrouce = $resource(api,{},configTrend);
				}
            }
            if(method == 'changeEv'){//费用查询，事件编号改动，如传过来ISS.PT.60.0001,调用ISS.RT.61.1001
				if(eventNo){
					
					var evArr = eventNo.split('/');
					var evStr = evArr[2];
					
					var eventTrend = "", changeEvStr = '';
					
					if(evStr =='ISS.PT.60.0001'){
						changeEvStr = 'ISS.RT.61.1001';
					}else if(evStr =='ISS.PT.60.0002'){
						changeEvStr = 'ISS.RT.61.1002';
						
					}else if(evStr =='ISS.PT.12.0001'){
						changeEvStr = 'ISS.RT.13.1001';
					}else if(evStr =='ISS.PT.12.0002'){
						changeEvStr = 'ISS.RT.13.1002';
					}
					else if(evStr =='ISS.PT.60.1001'){
						changeEvStr = 'ISS.RT.61.1001';
					}else if(evStr =='ISS.PT.60.1002'){
						changeEvStr = 'ISS.RT.61.1002';
					}
					else if(evStr =='ISS.PT.12.1001'){
						changeEvStr = 'ISS.RT.13.1001';
					}else if(evStr =='ISS.PT.12.1002'){
						changeEvStr = 'ISS.RT.13.1002';
					}
					evArr[2] = changeEvStr;
					eventTrend = evArr.join('/');
					var configTrend = "";
					configTrend = config[api];
					 delete configTrend.changeEv['url'];
					 configTrend.changeEv.url = ctx + eventTrend;
					resrouce = "";
					resrouce = $resource(api,{},configTrend);
				}
            }
            if(config[api]){
			    if(config[api][method]['headers']){
			     config[api][method]['headers'].Authorization = sessionStorage.getItem("clientToken");
                }
            }
            //如果url带有流程id则默认将参数传递到后台
			if(angular.isObject(params)){
				params = JSON.stringify(params);
			}else{	
			}
			index = jfLayer.load();
			resrouce[method](params,function(data){
				if(data.status == 401){
					jfLayer.confirm(data.description,function(){
						var loginUrl = data.loginUrl ;
						if(loginUrl.indexOf('http') != 0){
							var protocol = $location.protocol();
							var host = $location.host() ;
							var port = $location.port() || '' ;
							var baseUrl = protocol + '://' + host + (port && ':' + port ) + ctx;
							loginUrl = baseUrl  + data.loginUrl;
						}
						//登录超时在当前页面刷新不打开新页签
						if(Tansun.cache._refreshTab){
							window.location.href=loginUrl;
						}else{
							window.open(loginUrl) ;
						}
					
					}) ;
					deferred.reject(data);
				}else if(data.status == 403){
					jfLayer.alert(data.description) ;
					deferred.reject(data);
					jfLayer.close(index);
				}else if(data.returnCode !="000000"){
					if(data.returnCode =="CUS-00054"){
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00161');
 	    				jfLayer.atuoCloseAlert(returnMsg,jfRest.open());
					}else if(data.returnCode =="Gns2Error"){//gns错误 183
						var buildCustomerFlag =  lodinDataService.get("buildCustomerFlag");//新建客户标记
						var suppleCardEstFlag =  lodinDataService.get("suppleCardEstFlag");//媒介建立，建立附属卡信息
						var buildFlag = lodinDataService.get("buildFlag");//新建客户，提交按钮
						if(buildCustomerFlag  == 1 || suppleCardEstFlag == 1){
							sessionStorage.removeItem("buildCustomerFlag");
							sessionStorage.removeItem("suppleCardEstFlag");
						}else if(buildFlag == 1){
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00188');  //'暂无数据！';
							jfLayer.alert(returnMsg);
							jfLayer.close(index);
							return;
						}else {
							var returnMsg = T.T('F00168');   //"您查询的号码不存在，请重新输入！";
							jfLayer.alert(returnMsg) ;
							jfLayer.close(index);
							return;
//							deferred.reject(data);
//							jfLayer.close(index);
                        }
                    }else if(data.returnCode =="CUS-00014"){//gns错误 182
						var buildCustomerFlag =  lodinDataService.get("buildCustomerFlag");//新建客户标记
						var suppleCardEstFlag =  lodinDataService.get("suppleCardEstFlag");//媒介建立，建立附属卡信息
						var buildFlag = lodinDataService.get("buildFlag");//新建客户，提交按钮
						if(buildCustomerFlag  == 1 || suppleCardEstFlag == 1){
							sessionStorage.removeItem("buildCustomerFlag");
							sessionStorage.removeItem("suppleCardEstFlag");
							sessionStorage.removeItem("buildFlag");
						}else if(buildFlag == 1){
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00188');  //'暂无数据！';
							jfLayer.alert(returnMsg);
							jfLayer.close(index);
							return;
						}else {
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00168');  //"您查询的号码不存在，请重新输入！";
							jfLayer.alert(returnMsg) ;
							jfLayer.close(index);
							return;
//							deferred.reject(data);
//							jfLayer.close(index);
                        }
                    }else if(data.returnCode =="Err999" || !data.returnCode){
						if(!data.returnMsg || data.returnMsg == 'null???'){
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00195');  //'暂无数据！';
							jfLayer.fail(returnMsg);
							jfLayer.close(index);
							return;
						}else {
							jfLayer.fail(data.returnMsg);
							jfLayer.close(index);
							return;
                        }
                    }else {//报错
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00161');  //'暂无数据！';
						jfLayer.alert(returnMsg);
						jfLayer.close(index);
						return;
					}
                }
                /*else if(data.returnCode =="CUS-00054"){
                    var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00161');
                         jfLayer.atuoCloseAlert(returnMsg,jfRest.open());
                }
                else if(data.returnCode =="Gns2Error"){//183客户快捷申请

                    //客户不存在，需要建立客户
                    if(data.returnMsg == undefined || data.returnMsg == null || data.returnMsg == '' || data.returnMsg == '客户未注册或路由顺序表配置条件不匹配。'){
                        var buildCustomerFlag =  lodinDataService.get("buildCustomerFlag");//新建客户标记
                        var suppleCardEstFlag =  lodinDataService.get("suppleCardEstFlag");//媒介建立，建立附属卡信息
                        if(buildCustomerFlag  == 1 || suppleCardEstFlag == 1){
                        }else {
                            var returnMsg = T.T('F00168');   //"您查询的号码不存在，请重新输入！";
                            jfLayer.alert(returnMsg) ;
                            deferred.reject(data);
                            jfLayer.close(index);
                        };
                    }else if(data.returnMsg == 'NullPointerException'){
                        var returnMsg = T.T('F00168');   //"您查询的号码不存在，请重新输入！";
                        jfLayer.alert(returnMsg) ;
                        deferred.reject(data);
                        jfLayer.close(index);
                    }else {//真报错
                        jfLayer.alert(data.returnMsg) ;
                        deferred.reject(data);
                        jfLayer.close(index);
                        return;
                    }
                }
                else if(data.returnCode =="CUS-00014"){//182客户快捷申请
                    var buildCustomerFlag =  lodinDataService.get("buildCustomerFlag");//新建客户标记
                    var suppleCardEstFlag =  lodinDataService.get("suppleCardEstFlag");//媒介建立，建立附属卡信息
                    if(buildCustomerFlag  == 1 || suppleCardEstFlag == 1){
                    }else {
                        var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00168');   //"您查询的号码不存在，请重新输入！";
                        jfLayer.alert(returnMsg) ;
                        deferred.reject(data);
                        jfLayer.close(index);
                    };
                }
                //此处代码不需要，因每次调用接口时都会有返回，如果此处做判断，会弹出2次错误提示
                else if(data.returnCode !="CUS-00054" && data.returnCode !="Gns2Error" &&  data.returnCode !="000000" &&  data.returnCode !="CUS-00014" ){
                    var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00161');  //'暂无数据！';
                    jfLayer.alert(returnMsg);
                }
                else if(data.returnCode !="000000"){
                    var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00161');  //'暂无数据！';
                    jfLayer.alert(returnMsg);
                };*/
				deferred.resolve(data);
				jfLayer.close(index);
			},function(data){
				deferred.reject(data);
				jfLayer.close(index);
			}) ;
			
			return deferred.promise;
		};
		
		return jfRest ;
	}) ;
	
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
});
