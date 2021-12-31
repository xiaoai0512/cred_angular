'use strict';
define(function(require, exports, module) {
	var config = {
			//登录菜单
			//含有权限的菜单
			menuLists: {
				query : '/betaService/COS.CS.01.0028', //COS.CS.01.0018
				exit : '/betaService/COS.CS.01.0027', //退出
			},	
			//所有菜单
			newmenu: {
				query : '/betaService/COS.CS.01.0024',
			},
			
			//快捷菜单
			quickmenu: {
				query : '/betaService/COS.CS.01.0031',//常用菜单查询 
				add :  '/betaService/COS.CS.01.0032 ',//常用菜单新增
				//根据一级菜单编号，查询其所有子菜单
				queryFirstMenu: '/betaService/COS.CS.01.0002', 
			},
	};
	module.exports = config;
});