'use strict';
define(function (require){
	var webApp = require('app'); 
	
    //登录注册
    webApp.controller('loginResCtrl', function($scope, $stateParams, jfRest,
        $http, jfGlobal, $rootScope, jfLayer, $location) {
        //console.log('loginResCtrl');
        //去注册
        $("#goRegist").click(function(){
            $(".regist_container").show();
            $(".login_container").hide();
        });
        //去登录
        $("#goLogin").click(function(){
            $(".regist_container").hide();
            $(".login_container").show();
           
        });
        
        Tansun.plugins.render($("#loginBtn"));
        
        
        
       /* $("#loginBtn").click(function(){
        	$scope.toLogin();
           
        });*/
      
        $scope.toLogin = function() {
        	
    	/*	location.href = ctx + "/pages/public.html";
    		$scope.turn(item.url) ;*/
        	
        	
    		
    		//请求用户数据
    		  jfRest.register({user : {
    				query : '/json/user.json'
    			}}) ;
    		jfRest.request('user','query',{}).then(function(data) {
    			if (data.returnMsg == 'OK') {
    				//$rootScope.mainMenuList=data.data;
    				
    				for(var i =0 ; i < data.returnData.rows.length; i++){
    					$scope.loginFlag = false;
    					if($scope.username == data.returnData.rows[i].userName &&
    							$scope.password == data.returnData.rows[i].password){
    						sessionStorage.setItem("userName", data.returnData.rows[i].userName);//用户名
    						$scope.loginFlag = true;
    						break;
    					}

}
                    if($scope.loginFlag){
    					location.href = ctx + "/pages/public.html";
    				}else {
    					jfLayer.fail("用户名错误！")
    				}

}
            });
    		
        };
    	
    });

    
    //home
    webApp.controller('homePageCtrl', function($scope, $stateParams, jfRest,
    $http, jfGlobal, $rootScope, jfLayer, $location) {
        
        $scope.userName = sessionStorage.getItem("userName");//用户名
        
        /*if($scope.userName == null ||$scope.userName == undefined){
    		location.href = ctx + "/pages/iderLogin.html";
    	}*/
    	
    	$scope.exit = function() {
    		sessionStorage.clear();
    		location.href = ctx + "/pages/iderLogin.html";
    	};
    	
    	//清掉菜单栏
		if(sessionStorage 
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
	    
	    jfRest.register({menu : {
			query : '/json/menu.json'
		}}) ;
	
		jfRest.request('menu','query',{}).then(function(data) {
			if (data.status == 200) {
				$rootScope.mainMenuList=data.data;
				//console.log(data.data);
				//点击首页菜单
				$scope.goMenu = function(mainmenuid,submenuid,url,flag,text){
					localStorage.setItem("mainMenuId", mainmenuid);//主菜单id
					localStorage.setItem("subMenuId", submenuid);//二级菜单id
					localStorage.setItem("subUrl", url);//二级菜单id
					localStorage.setItem("submenuFlag", flag);//是否有三级菜单flag
					localStorage.setItem("submenuText", text);//二级菜单名字
					
				};
			}
		});	
        
        
    });
    
    
    
    //头部信息
    webApp.controller('iderHeaderController', function($scope, $stateParams, jfRest,
            $http, jfGlobal, $rootScope, jfLayer, $location) {
    	//console.log('iderHeaderController');
    	$scope.userName = sessionStorage.getItem("userName");//用户名
    	
    	$scope.exit = function() {
    		sessionStorage.clear();
    		location.href = ctx + "/pages/iderLogin.html";
    	}
    });
    
    
    //index页面菜单$rootScope,$scope,$state,jfRest,$timeout,$window
    webApp.controller('mainMenuCtrl', function($rootScope,$scope,$state, $stateParams, jfRest, $timeout,
	    $http, jfGlobal, $window, jfLayer, $location) {
    
    	//请求菜单
    	$scope.queryMenu = function(menuId){
    		jfRest.request('menu','query',{}).then(function(data) {
				console.log(data);
    			if (data.status == 200) {
    				
    				$scope.menuDataList = data.data;
    				angular.forEach($scope.menuDataList,function(item,index){
    					if(item.img == menuId ){
    						$scope.menuData = item;
    						
    					}
    					
    				}) ;
    				
    				
    			}
    		});	
    	};
    	//默认显示BETA
    	$timeout(function(){
    		$scope.layerHandle("iconmenu01");
    	},200);
    	$scope.layerHandle = function(menuId) {
    		/*layer.open({
    	    	  type: 2,//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
    	    	  title: 'layer mobile页',
    	    	  anim: 5,
    	    	  shadeClose: true,
    	    	  shade: 0,
    	    	  offset:"r",
    	    	  area: ['380px', '90%'],
    	    	  content: 'pages/layer/index.html' //iframe的url
    	    	}); */
    		
    		if(menuId == "iconmenu01"){
    			
    			$scope.queryMenu("iconmenu01");
    			
    		}else if(menuId== "iconmenu02"){
    		
    			$scope.queryMenu("iconmenu02");
    			
    		}else if(menuId== "iconmenu03"){
    			
    			$scope.queryMenu("iconmenu03");
    			
    		}else if(menuId== "iconmenu04"){
    			
    			$scope.queryMenu("iconmenu04");
    			
    		}else if(menuId== "iconmenu05"){
    			
    			$scope.queryMenu("iconmenu05");
    			
    		}else if(menuId== "iconmenu06"){
    			
    			$scope.queryMenu("iconmenu06");
    			
    		}else if(menuId== "iconmenu07"){
    			
    			$scope.queryMenu("iconmenu07");
    			
    		}else if(menuId== "iconmenu08"){
    			
    			$scope.queryMenu("iconmenu08");
    		}else if(menuId== "iconmenu09"){
    			
    			$scope.queryMenu("iconmenu09");
    		}else if(menuId== "iconmenu10"){
    			
    			$scope.queryMenu("iconmenu10");
    		}

    		
    	};
    	
    	//点击首页菜单
		$scope.goMenu2=function(mainmenuid,submenuid,url,flag,text){
			localStorage.setItem("mainMenuId", mainmenuid);//主菜单id
			localStorage.setItem("subMenuId", submenuid);//二级菜单id
			localStorage.setItem("subUrl", url);//二级菜单id
			localStorage.setItem("submenuFlag", flag);//是否有三级菜单flag
			localStorage.setItem("submenuText", text);//二级菜单名字
			
		};
    	
    	
    	
    	
    	
    	//鼠标滑过
    	$scope.enterHandle = function(event) {
    		event.preventDefault(); 
    		$(".guide ").removeClass("on");
    		$(event.currentTarget).addClass("on").siblings().removeClass("on");
    	};
    	//鼠标移除
    	$scope.leaveHandle = function(event) {
    		event.preventDefault(); 
    		$(".guide ").removeClass("on");
    	};
    	$scope.userName = sessionStorage.getItem("userName");//用户名
    	
    	if($scope.userName == null ||$scope.userName == undefined){
    		location.href = ctx + "/pages/iderLogin.html";
    	}
    	
	  //清掉菜单栏
		if(sessionStorage 
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
	    
	    jfRest.register({menu : {
			query : '/json/menu.json'
		}}) ;
	
		jfRest.request('menu','query',{}).then(function(data) {
			if (data.status == 200) {
				$rootScope.mainMenuList=data.data;
				console.log(data.data);
				//点击首页菜单
				$scope.goMenu=function(mainmenuid,submenuid,url,flag,text){
					localStorage.setItem("mainMenuId", mainmenuid);//主菜单id
					localStorage.setItem("subMenuId", submenuid);//二级菜单id
					localStorage.setItem("subUrl", url);//二级菜单id
					localStorage.setItem("submenuFlag", flag);//是否有三级菜单flag
					localStorage.setItem("submenuText", text);//二级菜单名字
					
				};
			}
		});	
		
    });
	
    
	// 面板页
	webApp.controller('panelCtrl', function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$stateParams,$location,jfLayer,$timeout) {
		$scope.userName = sessionStorage.getItem("userName");//用户名
    	
    	if($scope.userName == null ||$scope.userName == undefined){
    		location.href = ctx + "/pages/iderLogin.html";
    	}
		
		
		$(function(){
		 $timeout(function(){
				var liList = $("#leftUL").find("li");
				
				for(var j =0 ; j < liList.length; j++){
					if(subMenuId == liList[j].getAttribute("submenuid")){
						liList[j].setAttribute("class","layui-nav-item  ng-scope layui-nav-itemed");
						var dd = liList[j].getElementsByTagName("dd")[0];
						if(dd){
							dd.setAttribute("class","ng-scope layui-this");
						}
						
					}
                }
         },1000);
			
		});
		
		 //清掉菜单栏
		if(sessionStorage 
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
		
		//左侧菜单点击需依赖element
		layui.use('element', function(){
		  var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
		});
		
		var mainMenuId = localStorage.getItem("mainMenuId");
		var subMenuId = localStorage.getItem("subMenuId");
		var subUrl = localStorage.getItem("subUrl");
		var submenuText = localStorage.getItem("submenuText");//二级菜单名字
		$scope.submenuFlag = localStorage.getItem("submenuFlag");//是否有三级菜单flag
		
		
		$scope.isActive = true;
		
		jfRest.register({menu : {
			query : '/json/menu.json'
		}}) ;
		
		//首页菜单，面板左侧显示不同菜单
		jfRest.request('menu','query',{}).then(function(data) {
			if (data.status == 200) {
				$rootScope.mainMenuList=data.data;
				
				for(var i =0; i < data.data.length; i++){
					if(data.data[i].id == mainMenuId){
						$scope.menuList = data.data[i];
						console.log($scope.menuList);
					}
                }
                //从首页点击菜单跳转，二级菜单显示二级菜单，有三级菜单显示对应二级菜单下首个三级菜单
				if($scope.submenuFlag == false || $scope.submenuFlag == "false"){//没有三级菜单
					$scope.addTab({
						id : subMenuId,
						text : submenuText ,
						url : subUrl,
						submenuFlag:false,
						isActive:true,
						img:""
					}) ;
				}else if($scope.submenuFlag == true || $scope.submenuFlag == "true"){//有三级菜单
					if(subUrl == "#" || subUrl == ""){
						
						for(var i= 0; i < $scope.menuList.menu.length;i++ ){
							if(subMenuId == $scope.menuList.menu[i].id){
								var submenuList  = $scope.menuList.menu[i];
								$scope.item = submenuList.menu[0];
							}
                        }
                        $scope.addTab($scope.item);
						
					}
				}
			}
		});	
		
		//点击含有三级菜单的二级菜单
		$scope.clickSub = function(item){
			if(item.submenuFlag == false || item.submenuFlag == "false"){//没有三级菜单
				$scope.addTab(item);
			}else if(item.submenuFlag == true || item.submenuFlag == "true"){//有三级菜单

			}
		};
		
		//点击菜单
		$scope.addTab = function(item){
			//console.log(item);
			if(item.url == "#"){
				return;
			}
			
			angular.forEach($rootScope.tabList,function(tab,index){
				if(tab.id == item.id){
					$rootScope.tabList[index] = item ;
				}else{
					$rootScope.tabList[index].isActive = false ;
				}
			}) ;
			//console.log($rootScope.tabList);
			item.isActive = true ;  
			if($rootScope.tabList.indexOf(item) < 0){
				$rootScope.tabList.push(item);
			}
			$scope.turn(item.url) ;
		};
		
		$scope.changeTab = function(tab) {
			angular.forEach($rootScope.tabList,function(item){
				item.isActive = false ;
			}) ;
			tab.isActive = true ;
			$location.url(tab.backChainValue[tab.backChainValue.length - 1]) ;
		};
		
		//关闭当前
		$scope.removeTab = function(index){
			var closeTab = $rootScope.tabList[index] ;
			var activeTab = null ;
			if(closeTab.isActive){
				activeTab = $rootScope.tabList[index-1] ;
				activeTab.isActive = true ;
			}
			$rootScope.tabList.splice(index,1) ;
			//未选中当前页签做关闭时不处理
			if(activeTab){
				$location.url(activeTab.backChainValue[activeTab.backChainValue.length - 1]) ;
			}
		};
		
		
		
		
	});
	
	

	
	/*webApp.controller('defaultLoginCtrl',  function($scope,$window,jfRest,jfLayer,$rootScope,$stateParams,$validation,$parse,jfGlobal) {
		$(document).ready(function(){				
			 $("#webbtn").click(function(){
				  $('#web_login').hide();
				  $('#webcat_login').show();
		     });
			 $("#webcatbtn").click(function(){
				  $('#web_login').show();
				  $('#webcat_login').hide();
		     });
		});	
		layui.use(['form'], function(){
       var form = layui.form
       });
	   $(function(){
	      function placeholder(target){
	               $(target).val($(target).attr("datavalue")).addClass("textcolor");
	               $(target).focus(function() {
	                   if($(this).val() == $(this).attr("datavalue")) {
	                       $(this).val("").removeClass("textcolor");
	                   } 
	               
	               })
	               $(target).blur(function(){
	                   if($(this).val() == "" || $(this).val() == $(this).attr("datavalue")) {
	                       $(this).val($(target).attr("datavalue")).addClass("textcolor");
	                   }
	               })
	           }
	        placeholder(".inputtype")
			 placeholder(".inputuser")
			 placeholder(".inputpasswod")
	   })
		$scope.loginConfig={};
		$scope.user={};
		//
		function getQueryString($window,name)
	    {
	        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	        var r = $window.location.search.substr(1).match(reg);
	        if(r!=null)return  unescape(r[2]); return null;
	    }
		var error = getQueryString($window,"error");
		var showError = false;
		if (error !== null && error !== undefined && error !== '') {
			showError=true;
			var errMsg="";
			switch (error) {
			case '10001': 
				errMsg="用户名密码错误";
				break;
			case '10002': 
				errMsg="用户已被锁定，无法登录";
				break;
			case '10003': 
				errMsg="验证码为空或者不正确";
				break;
			case '10099': 
				errMsg="请登录";
				break;
			default : 
			    errMsg=error;
			} 
		}
		 // 找回密码
	    $scope.findPwd = function() {
	    		location.href = jfGlobal.ctx + "/sys/forgotPwd?username="+$scope.user.username;
	    };
	    $scope.toLogin = function() {
    		location.href = ctx +"/"+ $scope.loginConfig.loginSubmitUrl;
    	}
		//清掉菜单栏
		if(sessionStorage 
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
		
		var pathName = document.location.pathname;
		var loginUri = jfGlobal.ctx + "/login";
		var loginUriSuffix = pathName.length>loginUri.length?pathName.substring(loginUri.length+1):"";
		$scope.change = function() {
			$scope.captcha = $scope.loginConfig.captchaUrl + '/login?v=' + (new Date()).valueOf() ;
		};
		$scope.params={loginUriSuffix:loginUriSuffix};
		jfRest.request('loginConfig','get',Tansun.param($scope.params)).then(function(data) {
			if(data.status == 200){
				$scope.loginConfig=data.data;
				$scope.loginConfig.showError=showError;
				$scope.loginConfig.errMsg=errMsg;
				$scope.loginConfig.loginUriSuffix=loginUriSuffix;
				$scope.user.tenantName=data.data.tenantName;
				if(loginUriSuffix!=null && loginUriSuffix!=''){
					$scope.loginConfig.showTenantName='none';
				}else{
					$scope.loginConfig.showTenantName='display';
				}
				$scope.change();
				$scope.$on("refresh",function(){
					$scope.change();
				});
				
			}
    	});
		
		
		
	});*/
	
	 // 找回密码-身份认证
    webApp.controller('forgotPwdCtrl', function ($scope, $stateParams, jfRest, jfLayer, $validation, $interval) {
    	$scope.pwd = {};
    	$scope.pwd.flag = "";
    	if($stateParams.username) {
    		$scope.pwd.loginName = $stateParams.username;
    	}
    	$scope.preHandle = function () {
    		// 校验用户名和手机号/邮箱
    		var preHandle = $validation.validate($scope.pwdForm.loginName) && $validation.validate($scope.pwdForm.mobileOrEmail);
    		var captchaType = $scope.getCaptchaType(); // 发送类型
        	angular.element(".btn-getcode").attr("mode", captchaType);
        	
    		preHandle.success(function() {
    			var params = {
	        		loginName : $scope.pwd.loginName,
	        		mobileOrEmail : $scope.pwd.mobileOrEmail,
	        		captchaType : captchaType
	        	};
	        	jfRest.request('forgotPwd','query', Tansun.param(params)).then(function(data) {
					if (data.status == 200) {
						$scope.pwd.flag = "1";
					} else {
						jfLayer.fail(data.description);
	                }
				});
    		});
    		return  $validation.validate($scope.pwdForm.flag);
        };
    	// 获取发送类型
    	$scope.getCaptchaType = function() {
    		var captchaType = ''; // 获取验证码类型
    		var mobileOrEmail = $scope.pwd.mobileOrEmail; // 手机号或邮箱
        	var pattern = /^1[3|4|5|7|8][0-9]\d{8}$/;
        	if (pattern.test(mobileOrEmail)) { // 手机号
        		captchaType = 'SMS'
        	} else {
        		captchaType = 'EMAIL'
        	}
        	return captchaType;
    	};
    	// 提交修改
    	$scope.save = function() {
    			var params = {
            		mobileOrEmail : $scope.pwd.mobileOrEmail,
            		code : $scope.pwd.code,
            		jfCode : 'pwd'
            	};
    			
    	    	jfRest.request('forgotPwd','get', Tansun.param(params)).then(function(data) {
    				if (data.status == 200) {
    					var captchaType = $scope.getCaptchaType(); // 发送类型
    		    		var param = {
    		    			loginName : $scope.pwd.loginName,
    		            	mobileOrEmail : $scope.pwd.mobileOrEmail,
    		        		newPswd : $scope.pwd.newPswd,
    		        		captchaType : captchaType
    		        	};
    		        	// 保存用户信息
    		        	jfRest.request('forgotPwd','save', Tansun.param(param)).then(function(data) {
    		    			if (data.status == 200) {
    		    				location.href = ctx + "/login";
    		    			} else {
    		                    jfLayer.fail(data.description);
    		                }
    		    		});
    				} else {
    					jfLayer.fail(data.description);
                        return false;
                    }
    			});
    			
    	};
        $scope.toLogin = function() {
    		location.href = ctx + "/login";
    	}
    });
	webApp.controller('headerCtrl',  function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$stateParams,$location,jfLayer) {
		$scope.isActive = true;
		
		$scope.login = function() {
			location.href = jfGlobal.ctx + "/login" ;
		};
		
		$scope.reg = function() {
			location.href = jfGlobal.config.website + "/reg" ;
		};
		
		$scope.logout = function() {
			location.href = jfGlobal.ctx + "/logout" ;
		};
		$scope.updatePswd = function() {
			location.href = jfGlobal.ctx + "#/updatePswd" ;
		};
		
		//添加页签
		$scope.addTab = function(item){
			if(item.url == "#"){
				return;
			}
			
			angular.forEach($rootScope.tabList,function(tab,index){
				if(tab.id == item.id){
					$rootScope.tabList[index] = item ;
				}else{i;
					$rootScope.tabList[index].isActive = false ;
				}
			}) ;
			
			item.isActive = true ;  
			if($rootScope.tabList.indexOf(item) < 0){
				$rootScope.tabList.push(item);
			}
			$scope.turn(item.url) ;
		};
		
		$scope.changeTab = function(tab) {
			angular.forEach($rootScope.tabList,function(item){
				item.isActive = false ;
			}) ;
			tab.isActive = true ;
			$location.url(tab.backChainValue[tab.backChainValue.length - 1]) ;
		};
		
		//关闭当前
		$scope.removeTab = function(index){
			var closeTab = $rootScope.tabList[index] ;
			var activeTab = null ;
			if(closeTab.isActive){
				activeTab = $rootScope.tabList[index-1] ;
				activeTab.isActive = true ;
			}
			$rootScope.tabList.splice(index,1) ;
			//未选中当前页签做关闭时不处理
			if(activeTab){
				$location.url(activeTab.backChainValue[activeTab.backChainValue.length - 1]) ;
			}
		};
		
		//关闭其他页签
		$scope.removeOtherTab = function(tab) {
			$rootScope.tabList.splice(1,$rootScope.tabList.length-1);
			$rootScope.tabList.push(tab);
			if(tab.isActive){
				return ;
			}
			tab.isActive = true ;
			//从页签中取出所有
			$location.url(tab.backChainValue[tab.backChainValue.length - 1]) ;
		};
		
		$scope.removeAllTab = function() {
			$rootScope.tabList.splice(1,$rootScope.tabList.length-1) ;
			var indexTab = $rootScope.tabList[0] ;
			indexTab.isActive = true ;
			
			$location.url(indexTab.backChainValue[indexTab.backChainValue.length - 1]) ;
		};
		
		//如果页签是空的，将首页添加进去
		if($rootScope.tabList.length <= 0){
			$scope.addTab({
				id : 'index',
				text : '首页' ,
				url : '/index',
				close : false
			}) ;
        }
        //获取当前激活的标签
		$rootScope.getActiveTab = function() {
			var activeTab = {text : '首页'} ;
			angular.forEach($rootScope.tabList,function(tab){
				if(tab.isActive){
					activeTab = tab ;
				}
			}) ;
			return activeTab ;
		};
		//获取当前位置
		$rootScope.getCurrentLoaction = function(text) {

			var currentTab = $rootScope.getActiveTab() ;
			
			if(!$rootScope.menuList || $rootScope.menuList.length <= 0){
				return '' ;
			}
			
			var parentText = '' ;
			
			var currentTab = $rootScope.getActiveTab() ;
			var getChildText = function (menu) {
				if(!menu){
					return '' ;
				}
				var childText = '' ;
				angular.forEach(menu.menu,function(item){
					//如果已查找到子菜单，则不继续迭代
					if(childText){
						return ;
					}
					//如果还有子菜单，则继续递归
					if(item.menu && item.menu.length > 0){
						//获取子菜单文本
						childText = getChildText(item) ;
						//如果子菜单文本是有值的，代表当前菜单是被激活的页签的父级菜单，拼上自己的文本
						if(childText){
							childText = item.text + ' > ' + childText ;
						}
					}else{//如果是根菜单，则判断与当前页签是否同一个，如果是的话返回当前菜单名称
						if(menu && item.id == currentTab.id){
							childText = item.text ;
						}
					}
				}) ;
				return childText ;
			};
			
			angular.forEach($rootScope.menuList,function(item){
				var childText = getChildText(item) ;
				if(childText){
					parentText = item.text + ' > ' + childText ;
				}
			});
			
			var currentLoaction = '<i class="position_icon"></i>当前位置：' + parentText ;
			
			if(text){
				currentLoaction += ' > ';
				currentLoaction += text ;
			}
			
			if(parent){
				currentLoaction = currentLoaction ;
			}
			
			return currentLoaction ;
		};
	});
	webApp.controller('menuCtrl',  function($rootScope,$scope,$state,jfRest,$timeout,$window) {
		$scope.left=function(index){
			$scope.nub=(-140)*(index);
			return {
				"left" : $scope.nub+'px'
			}
		};
		
		// if(!Tansun.cache.get('dict')){
		// 	jfRest.request("dict","list",{}).then(function(data) {
		// 		Tansun.cache.put('dict',data.data.data);
		// 	});
		// }
		
		jfRest.register({menu : {
			query : '/json/menu.json'
		}}) ;

		jfRest.request('menu','query',{}).then(function(data) {
			if (data.status == 200) {
				$rootScope.menuList=data.data;
				$timeout(function(){
					angular.element('.drop-menu-effect').each(function(){
			            var thiz = angular.element(this);
			            var theMenu = thiz.find(".submenu");
			            var tarHeight = theMenu.height();
			            theMenu.css({height:0});
			            thiz.hover(
				            function(){
				            	angular.element(this).addClass("hover_menu");
					            theMenu.stop().show().animate({height:tarHeight},400);
				            },
				            function(){
				            	angular.element(this).removeClass("hover_menu");
					            theMenu.stop().animate({height:0},400,function(){
					            	angular.element(this).css({display:"none"});
					            });
				            }
			            );
			        });

					var webMenu = angular.element('.web_menu') ;
					
					angular.element($window).on("scroll", function() {
						var scrolTop = angular.element(document).scrollTop() ;
						var scrollTop = webMenu[0].scrollTop || scrolTop;
						if(scrollTop <= webMenu[0].offsetTop){
							webMenu.css({position : 'relative'}) ;
						} else {
							webMenu.css({position : 'fixed'}) ;
						}
			        });
				});
			}
		});	
	});
	webApp.controller('parentCtrl',  function($stateParams,$scope, $location, jfRest, $http, jfGlobal, $rootScope, jfLayer,$timeout) {
		$scope.commonData={};
		$scope.tabAuthObj = {}; //保存子页面页签权限对象
		$scope.pageNum = '1'; //默认显示第一个页签基础信息
		var shadeHtml='<div class="maskshade"></div>';//遮罩层样式
		$scope.onNavChange = function(nav){
			if($scope.parentNav.mode == 'scroll'){
				if($stateParams.pageView=="view"){//表示页面只能查看
					return true;
				}
				if(!nav.valiParam){
					//没有设置valiParam属性机表示默认可编辑
					angular.element('#' + nav.id).find(".maskshade").remove();
					return true ;
				}
				
				var params = nav.valiParam.split(':')[0] || '';
				var id = params.split("&")[0];
				var bsnId = params.split("&")[1];
				if ($scope.tabAuthObj && $scope.tabAuthObj[id]) {
					if(!$scope.queryParam){
						$scope.queryParam = {};
					}
					if(bsnId && $scope.tabAuthObj[bsnId]){
						$scope.tblBlId = $scope.tabAuthObj[bsnId]; //必须字段传入，查询文档
					}
					angular.element('#' + nav.id).find(".maskshade").remove();
				} else {
					//遮罩样式步不存在是添加，已存在则不处理
					if(angular.element('#' + nav.id).find(".maskshade").length<=0){
						angular.element('#' + nav.id).append(shadeHtml);
					}
				}
				return true ;
			}else{
				if(!nav.valiParam){
					return true ;
				}
				
				var params = nav.valiParam.split(':')[0] || '';
				var message = nav.valiParam.split(':')[1] || '请先填写基本信息' ;
				
				var id = params.split("&")[0];
				var bsnId = params.split("&")[1];
				if ($scope.tabAuthObj && $scope.tabAuthObj[id]) {
					if(!$scope.queryParam){
						$scope.queryParam = {};
					}
					if(bsnId && $scope.tabAuthObj[bsnId]){
						$scope.tblBlId = $scope.tabAuthObj[bsnId]; //必须字段传入，查询文档
					}
					return true ;
				} else {
					jfLayer.alert(message);
					return false;
				}
			}
		};
		
		$scope.parentNav = {
			mode : 'scroll'
		} ;
		//页面引入后做遮罩处理
		$scope.$on('$includeContentLoaded',function(event){
			$.each($scope.parentNav.navs, function(index,nav){ 
				//遮罩
				if(angular.element('#' + nav.id).find(".maskshade").length<=0){
					angular.element('#' + nav.id).append(shadeHtml);
					angular.element('#' + nav.id).addClass('section');//控制遮罩的大小在指定div里面
					angular.element('#' + nav.id).addClass('maskbox');//控制遮罩的大小在指定div里面
				}
				if($stateParams.pageView=="view"){//表示页面只能查看
					return true;
				}
				if(!nav.valiParam){
					//没有设置valiParam属性机表示默认可编辑
					angular.element('#' + nav.id).find(".maskshade").remove();
					return true ;
				}
				var params = nav.valiParam.split(':')[0] || '';
				var id = params.split("&")[0]; 
				if ($scope.tabAuthObj && $scope.tabAuthObj[id]) {
					angular.element('#' + nav.id).find(".maskshade").remove();
				} else {
					//遮罩样式步不存在是添加，已存在则不处理
					if(angular.element('#' + nav.id).find(".maskshade").length<=0){
						angular.element('#' + nav.id).append(shadeHtml);
					}
				}
		    });
			
		});
		$scope.$on('to-parent', function (event, data) {
			$scope.tabAuthObj = data;
			$scope.commonData = data;
			
        });
		//根据页签下标获取对应的scope(下标从0开始算)var scope=$scope.getScope(1);//1代表第二个页签
		$scope.getScope = function(i) {
			if(i){
				var i=parseInt(i);
				var nav=$scope.parentNav.navs[i];
				if(nav){
					var element = angular.element('#' +nav.id).find('div[ng-controller]');
					var scope = element.scope();
					return scope;
				}
			}
			
		};
		$scope.toParent = function(data) {
			$scope.tabAuthObj = data;
			$scope.commonData = data;
		};
		
		$scope.showPageManager = [];
		$scope.$on('to-parent-pages', function (event, data) {
			$scope.showPageManager = data;
        });
		
		$scope.toParentPages = function(data) {
			$scope.showPageManager = data;
		};
		
		$scope.showTab = function (tab, addNavRule) {
			return addNavRule ? $scope.showPageManager.indexOf(tab) > -1 : true;
		}
		
	});
	
	 
	 webApp.controller('docAtchListCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope) {
		 
		 	$scope.queryParam = {
	 			mdlId : $scope.mdlId,
	 			tblBlId : $scope.tblBlId
		 	};
		 	$scope.$download = function (tableName) {
				if (!$rootScope.$valiCheck(tableName,'radio')) {
					return;
				}
				$scope.doc = {};
				$scope.doc.fileId = $rootScope.getCheckItem(tableName).fileId;
				jfRest.request('file','get', Tansun.param($scope.doc)).then(function(data) {
					if (data.status == 200) {
						var path = data.data.fileRte;
						if(path){
							var fileServer = jfGlobal.config["uploader.file.server"];
							var fileDownload = jfGlobal.config["uploader.file.download"];
							window.open(fileServer + fileDownload + path);
						}
					}else{
						jfLayer.alert("下载失败");
					} 
				});
	        };
	        
	        $scope.back = function() {
	        	history.back();
	        }
	        
	    });
	 
	//上传附件对话框
    webApp.controller('docAtchCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$validation,$parse) {
        //确认选择
        $scope.confirm = function () {
        	//手动校验
        	$validation.validate($parse('atchForm')($scope)).success(function() {
	        	if(!$scope.atch){
	        		$scope.atch = {};
	        	}
	        	var formData = [];
	        	if($scope.atch.atchInf && $scope.atch.atchInf.length > 0){
	        		angular.forEach(angular.fromJson($scope.atch.atchInf), function(data){
	        			var atchInf = data;
	        			var params = {
        					mdlId : $scope.mdlId,
        					tblBlId : $scope.tblBlId,
        					fileNm : atchInf.originalFilename,
        					fileExpdNm : atchInf.contentType,
        					fileSize : atchInf.size,
        					fileRte : angular.fromJson(atchInf.savePath).file,
        					atchNm : atchInf.originalFilename
	        			};
	        			if($scope.$$childTail.atchIf){
	        				params.fileTpCd = $scope.$$childTail.atchIf.fileTpCd;
	    	        	}
	        			formData.push(params);
	        	   	});
	        		$scope.saveData = {
	        			atchList : angular.toJson(formData)
	        		}
	        	}
	        	jfRest.request('file','save', Tansun.param($scope.saveData)).then(function(data) {
					if (data.status == 200) {
						jfLayer.success(data.description,function(){
							$scope.$parent.search();
//							$rootScope.clearChecked();//在弹出框保存后，清除选中的记录
							jfLayer.closeAll();
						});
					} else {
						jfLayer.fail(data.description);
					}
				});
            });
        	
        };

        $scope.uploadAtch = {
            // 允许上传的文件后缀
            extensions: "bmp,jpg,jpeg,png,doc,docx,xlsx,xls,pdf,rar,zip,tar",
            // 单个文件大小，单位MB，不传默认5MB
            fileSize: 5,
            // 可上传2个文件,不传默认5个
            fileCount: 999,
            // 文件所属APP
            app: "scf-pc",
            // 文件所属模块
            module: "doc",
            userSource:"user.query"
        };
        
    });
    
    Tansun.directive('moreclick',function(){
    	return {
    		restrict: 'A',
			scope: false,//独立作用域，防止污染父级作用域
	        link: function (scope, element, attrs, ngModel) {
	        	var show = false ;
	        	element.click(function(event) {
	        		show = !show ;
	        		if(show){
	        			element.parents('.search_mian').find('.search_width').show() ;
	        			element.find('i').html('&#xe619;');
	        		}else{
	        			element.parents('.search_mian').find('.search_width').hide() ;
	        			element.find('i').html('&#xe61a;');
	        		}
				}) ;
	        }
    	}
    }) ;
    webApp.controller('adminChangeCtrl',  function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$stateParams,jfLayer,$compile,$validation,$parse) {
    	var request = jfRest.request("session","get",{}) ;
 		request.then(function(data) {
 			//设置全局用户信息，只需要设置一次即可
 			$scope.setUser(data.data);
 			//获取全局当前登录用户信息
 			$scope.loginUser=$scope.getUser();
			$scope.roleList=$scope.getUser().roleInfList;
//			$scope.orgList=data.data.instInfList;
			$scope.deptList=$scope.getUser().deptInfList;
 		});
		//修改密码
		$scope.updatePW = function(event) {
			$scope.user={};
			$scope.user.id=$scope.loginUser.id;
			$scope.modal('/template/admin_pw.html',{},{title :'修改密码',buttons : ['提交','取消'],size : ['450px','300px'],callbacks : [$scope.savePW]});
		};
		$scope.savePW=function(){
			if(!$scope.user.password){
				jfLayer.fail("原密码不能为空，请重新输入！");
				return false;
			}
			if(!$scope.user.newPswd){
				jfLayer.fail("新密码不能为空，请重新输入！");
				return false;
			}
			if($scope.user.newPswd!==$scope.user.renewPswd){
				jfLayer.fail("两次密码输入不一致，请重新输入！");
				return false;
			}
			jfRest.request('sysUser1','updatePswd',Tansun.param($scope.user)).then(function(data) {
				if (data.status == 200) {
					jfLayer.success(data.description,function(index){
						jfLayer.closeAll();
					}); 
				} else {
					jfLayer.fail(data.description);
				}
			});
		};
		//弹出角色列表
		$scope.changeRole = function(event) {
			$scope.modal('/template/admin_role.html',{},{title :'角色切换',buttons : ['提交','取消'],size : ['500px','300px']});

		};
		//弹出机构列表
		$scope.changeOrg = function(event) { 
			var param={};
			jfRest.request('admin', 'query', param).then(function(data){
				if(data.status == 200){
					$scope.orgList=data.data;
				}
				else{
					jfLayer.fail(data.description);
				}
			}); 
			$scope.modal('/template/admin_org.html',$scope.orgList,{title :'机构切换',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//弹出部门列表
		$scope.changeDept = function(event) { 
			$scope.modal('/template/admin_dept.html',{},{title :'部门切换',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//切换
		$scope.changer = function(param,type) {
			param.type=type;
			var param = Tansun.param(param) ;
			jfRest.request('admin', 'changer', param).then(function(data){
				if(data.status == 200){
					var url=window.location.origin + ctx;
					window.location=url;
				}else{
					jfLayer.fail(data.description);
				}
			});
		}
	});
	
	//快捷键
	webApp.controller('shortMenuCtrl',  function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$stateParams,jfLayer,$compile) {
		
		$scope.queryList();
		
		//查询所有快捷菜单
		$scope.queryList=function(){
			jfRest.request('quickMenu','query', Tansun.param({})).then(function(data){
				if(data.status == 200){
					$scope.quickMenuList=data.data.grid;
				}
			});
		};
		
		//添加
		$scope.clickAddMenu=function(){
			$scope.modal('/template/quick_,menu.html',{},{title :'添加快捷键',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//打开菜单
		$scope.openMenu=function(menu){
			$scope.$turn(menu.url,menu.menuName);
		};
		
		
		//菜单树点击事件
		$scope.nodeClick = function(treeNode) {
			if(treeNode.level!=2) return null;
			jfRest.request('quickMenu','save', Tansun.param({'menuCode' : treeNode.id})).then(function(data){
				if(data.status == 200){
					$scope.menuSearch();
					$scope.queryList();
				}else{
					jfLayer.fail(data.description);
				}
			});
		};
		//删除菜单
		$scope.delMenu = function(id) { 
			jfRest.request('quickMenu','delete', Tansun.param({'id' : id})).then(function(data){
				if(data.status == 200){
					$scope.menuSearch();
				}else{
					jfLayer.fail(data.description);
				}
			});
		}
		
	});
    Tansun.controller('chartsCtrl',function($scope){
		$scope.charts = {
			 data : [{date : '融资到期预警',value : 10, user : '融资到期预警'},
					 {date : '预合同到期预警',value : 15, user : '预合同到期预警'},
					 {date : '池模式融资水位预警',value : 11, user : '池模式融资水位预警'},
					 {date : '融资到期预警',value : 5, user : '融资到期预警'},
					 {date : '融资到期预警',value : 12, user : '融资到期预警'},
					 {date : '预合同到期预警',value : 7, user : '预合同到期预警'},
					 {date : '预合同到期预警',value : 4, user : '预合同到期预警'},
					 {date : '池模式融资水位预警',value : 18, user : '池模式融资水位预警'}],
			 type : 'pie', //折线图
			 label : 'date', //月份为X轴
			 value : 'value', //value为数值
			 group : 'user', //以用户为统计角度
			 title : '' //标题
		}
	}) ;
    webApp.controller('docAtchListCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$timeout) {
		
		 $scope.fileList = {
					checkType : 'radio', //当为checkbox时为多选
					params : {}, //表格查询时的参数信息
					paging : true ,//默认true,是否分页
					resource : 'file.query' ,//列表的资源
					callback : function() { //表格查询后的回调函数
					}
			  };  
			 $scope.fileList.params = {
	 	 			mdlId : $scope.mdlId,
	 	 			tblBlId : $scope.tblBlId
	 		};
			 if($scope.mdlId&&!$scope.tblBlId){
				 $scope.fileList.autoQuery=false;
				 $scope.fileList.fileSearch=false;
			 }
		 	  $scope.$watch("tblBlId",function(newValue,oldValue){
		 		  if(newValue){
				 		 $scope.fileList.autoQuery=true;
		 		  }
	            if(oldValue == newValue)
	                return ;
	            $scope.fileList.params = {
	    	 			mdlId : $scope.mdlId,
	    	 			tblBlId : $scope.tblBlId
	    		};
	            $timeout(function(){
	            	$scope.fileList.search();
	            });
	        });
		 	
		 	$scope.download = function () {
				if (!$scope.fileList.validCheck()) {
					return;
				}
				$scope.doc = {};
				$scope.doc.fileId = $scope.fileList.checkedList().fileId;
				jfRest.request('file','get', Tansun.param($scope.doc)).then(function(data) {
					if (data.status == 200) {
						var path = data.data.fileRte;
						if(path){
							var fileServer = jfGlobal.config["uploader.file.server"];
							var fileDownload = jfGlobal.config["uploader.file.download"];
							var realName="/"+data.data.fileNm;
							window.open(fileServer + fileDownload + path+realName);
						}
					}else{
						jfLayer.alert("下载失败");
					} 
				});
	        };
	        $scope.onlinePreview = function () {
				window.open($scope.global.uploader.filePreviewPath+$scope.fileList.checkedList().fileRte);
	        };
	        //确认选择
	        $scope.confirm = function (result) {
	        	result.scope.saveFile(result);
	        };
	        $scope.back = function() {
	        	history.back();
	        }
	        
	    });
	 
	//上传附件对话框
   webApp.controller('docAtchCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$validation,$parse) {
   		//确认选择
	        $scope.saveFile = function (result) {
	        	if(!result.scope.atch){
	        		result.scope.atch = {};
	        	}
	        	var formData = [];
	        	if(result.scope.atch.atchInf && result.scope.atch.atchInf.length > 0){
	        		angular.forEach(angular.fromJson(result.scope.atch.atchInf), function(data){
	        			var atchInf = data;
	        			var params = {
	    					mdlId : $scope.mdlId,
	    					tblBlId : $scope.tblBlId,
	    					fileNm : atchInf.originalFilename,
	    					fileExpdNm : atchInf.contentType,
	    					fileSize : atchInf.size,
	    					fileRte : angular.fromJson(atchInf.savePath).file,
	    					atchNm : atchInf.originalFilename
	        			};
	    				if(result.scope.atchIf){
	    				params.fileTpCd = result.scope.atchIf.fileTpCd;
		        		}
	        			formData.push(params);
	        	   	});
	        		$scope.saveData = {
	        			atchList : angular.toJson(formData)
	        		}
	        	}
	        	jfRest.request('file','save', Tansun.param($scope.saveData)).then(function(data) {
					if (data.status == 200) {
						jfLayer.success("保存成功",function(){
							$scope.fileList.search();
							result.cancel();
						});
					} else {
						jfLayer.fail(data.description);
					}
				});
	        
	        	
	        };
	       $scope.uploadAtch = {
           // 允许上传的文件后缀
           extensions: "bmp,jpg,jpeg,png,doc,docx,xlsx,xls,pdf,rar,zip,tar",
           // 单个文件大小，单位MB，不传默认5MB
           fileSize: 5,
           // 可上传2个文件,不传默认5个
           fileCount: 999,
           // 文件所属APP
           app: "admin-pc",
           // 文件所属模块
           module: "doc",
           userSource:"user.query"
       };
       
   });
});
	