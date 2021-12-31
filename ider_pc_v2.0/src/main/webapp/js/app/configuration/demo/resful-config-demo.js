'use strict';
define(function(require, exports, module) {
	var config = {
		tableDemo : {
			query : '/json/demo.json'
		},
		test : {
			query : '/json/test.json'
		},
		//如果项目中需要做按钮的权限控制，需指定此资源坐标，响应格式以permission.json文件中的格式为准
		permission : {
			query : '/json/permission.json'
		},
		loginConfig : {
			get : '/json/getLoginConfig'
		},
		roleMenu : {
			query : '/json/roleMenu.json'
		},
		leftTree : {
			query : '/json/leftTree.json'
		},
		province : {
			query : '/json/province.json'
		},
		file : {
			query : '/json/file.json'
		},
		city : {
			query : '/json/city.json'
		},
		area : {
			query : '/json/area.json'
		},
		dict : {
			list : '/json/dict.json'
		}
	};
	module.exports = config;
});