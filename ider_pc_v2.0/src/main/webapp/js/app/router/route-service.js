'use strict';

define(function(require, exports, module) {
	var angular = require('angular');
	var app = angular.module('router-service', []);
    app.service('routeService', [function() {
		var tmplUrl = ctx + "/pages/";
	   	var centerTemplateUrl = "\""+ctx+"/pages/center.html\"";
	   	var publicFooterUrl = "{\"templateUrl\": \""+ctx+"/pages/template/public_footer.html\"}";
	   	var centerFooterUrl = "{\"templateUrl\": \""+ctx+"/pages/template/center_footer.html\"}";
	   	var loginFooterUrl = "{\"templateUrl\": \""+ctx+"/pages/template/login_footer.html\"}";
	   	var publicHeaderUrl = "{\"templateUrl\": \""+ctx+"/pages/template/public_header.html\"}";
	   	var centerHeaderUrl = "{\"templateUrl\": \""+ctx+"/pages/template/center_header.html\"}";
	   	var publicMenuUrl = "{\"templateUrl\": \""+ctx+"/pages/template/public_menu.html\"}";
	   	var tmpCtrl = ctx + "/js/app/controller/";
	   	//url:访问路径  templateUrl：页面模板路径 ctrl：controller路径
	  this.initPublicView = function initPublicView(url,templateUrl,ctrl){
		  var footerUrl = publicFooterUrl;
		  var headerUrl = publicHeaderUrl;
		  var turl = tmplUrl + templateUrl;
		  var content = "";
		  if(!ctrl){
			  content = "{\"url\":\""+url+"\",\"views\":{\"header\":"+headerUrl+",\"menu\":"+publicMenuUrl+",\"footer\":"+footerUrl+",\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content = "{\"url\":\""+url+"\",\"controllerUrl\":\""+ctrl+"\",\"views\":{\"header\":"+headerUrl+",\"menu\":"+publicMenuUrl+",\"footer\":"+footerUrl+",\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }
		return angular.fromJson(content);
	  };
	  //name:路由名称，保证唯一  url:访问路径  templateUrl：页面模板路径 ctrl：controller路径
	  this.initCenterView = function initCenterView(name,url,templateUrl,ctrl){
		  var footerUrl = centerFooterUrl;
		  var headerUrl = centerHeaderUrl;
		  var turl = tmplUrl + templateUrl;
		  var content = "";
		  if(!ctrl){
			  content =
				  "{\"url\":\""+url+"\",\"views\":{\"header\":"+headerUrl+",\"footer\":"+footerUrl+",\"\":{\"templateUrl\":"+centerTemplateUrl+"}" +
				  ",\"center@"+name+"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content =
				  "{\"url\":\""+url+"\",\"controllerUrl\":\""+ctrl+"\",\"views\":{\"header\":"+headerUrl+",\"footer\":"+footerUrl+",\"\":{\"templateUrl\":"+centerTemplateUrl+"}" +
				  ",\"center@"+name+"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }
		  return angular.fromJson(content);
	  };
	  
	  this.initLoginView = function initLoginView(url,templateUrl,ctrl){
		  var footerUrl = loginFooterUrl;
		  var headerUrl = publicHeaderUrl;
		  var turl = tmplUrl + templateUrl;
		  var content = "";
		  if(!ctrl){
			  content = "{\"url\":\""+url+"\",\"views\":{\"header\":"+headerUrl+",\"menu\":"+publicMenuUrl+",\"footer\":"+footerUrl+",\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content = "{\"url\":\""+url+"\",\"controllerUrl\":\""+ctrl+"\",\"views\":{\"header\":"+headerUrl+",\"menu\":"+publicMenuUrl+",\"footer\":"+footerUrl+",\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }
		return angular.fromJson(content);
	  };
	  
	  this.initRegView = function initLoginView(url,templateUrl,ctrl){
		  var footerUrl = publicFooterUrl;
		  var turl = tmplUrl + templateUrl;
		  var content = "";
		  if(!ctrl){
			  content = "{\"url\":\""+url+"\",\"views\":{\"footer\":"+footerUrl+",\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content = "{\"url\":\""+url+"\",\"controllerUrl\":\""+ctrl+"\",\"views\":{\"footer\":"+footerUrl+",\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }
		return angular.fromJson(content);
	  };
	  
	  this.initDialogView = function initDialogView(url,templateUrl,ctrl){
		  var turl = tmplUrl + templateUrl;
		  var content = "";
		  if(!ctrl){
			  content = "{\"url\":\""+url+"\",\"views\":{\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content = "{\"url\":\""+url+"\",\"controllerUrl\":\""+ctrl+"\",\"views\":{\"\":{\"templateUrl\":\""+turl+"\"}}}";
		  }
		return angular.fromJson(content);
	  };
	  
	  //此方法参数会带在链接后面(默认)
	  this.initAdminView = function initAdminView(url,templateUrl,ctrl){
		  var turl = tmplUrl + templateUrl;
		  var tarUrl = url.split("?")[0];
		  var param = url.split("?")[1];
		  var paramContent = "";
		  var tarNm = tarUrl;
		  if(param){
			  var paramArr = param.split("&");
			  for(var i = 0; i < paramArr.length; i++){
				  tarNm = tarNm + "?:" + paramArr[i];
			  }
		  }
		  tarNm = tarNm + "?:_?:taskId?:vwtp?:userDefine?:pageView?:msdpWFHideSave";
		  var content = "";
		  if(!ctrl){
			  content = "{\"url\":\""+tarNm+"\",\"views\":{\""+tarUrl+"@root\":{\"templateUrl\":\""+turl+"\"}},\"sticky\": \"true\"}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content = "{\"url\":\""+tarNm+"\",\"controllerUrl\":\""+ctrl+"\",\"views\":{\""+tarUrl+"@root\":{\"templateUrl\":\""+turl+"\"}},\"sticky\": \"true\"}";
		  }
		  
		  return angular.fromJson(content);
	  };
	  
	  //此方法参数会隐藏(根据项目需要选择)
	  this.initAdminNoParamView = function initAdminNoParamView(url,templateUrl,ctrl){
		  var turl = tmplUrl + templateUrl;
		  var tarUrl = url.split("?")[0];
		  var param = url.split("?")[1];
		  var paramContent = "";
		  if(param){
			  var paramArr = param.split("&");
			  for(var i = 0; i < paramArr.length; i++){
				  if(i == paramArr.length -1){
					  paramContent = paramContent+"\""+paramArr[i]+"\":\"\"";
				  }else{
					  paramContent = paramContent+"\""+paramArr[i]+"\":\"\",";
				  }
			  }
		  }
		  var content = "";
		  if(!ctrl){
			  content = "{\"url\":\""+tarUrl+"\",\"views\":{\""+tarUrl+"@root\":{\"templateUrl\":\""+turl+"\"}},\"sticky\": \"true\"}";
		  }else{
			  ctrl = tmpCtrl + ctrl;
			  content = "{\"url\":\""+tarUrl+"\",\"params\":{"+paramContent+"},\"controllerUrl\":\""+ctrl+"\",\"views\":{\""+tarUrl+"@root\":{\"templateUrl\":\""+turl+"\"}},\"sticky\": \"true\"}";
		  }
		  
		  return angular.fromJson(content);
	  }
	  
	  
    }]);
});
