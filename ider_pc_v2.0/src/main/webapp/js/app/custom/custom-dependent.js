'use strict';
define(function (require, exports, module) {
	var path=document.location.pathname;
	if(path.indexOf("login")>-1){//登录页面
		module.exports = {
				overallStyle:['/web_login.css']
		};
	}else{
		module.exports = {};
	}
});