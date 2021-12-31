'use strict';

define(function(require, exports, module) {
	var config_list = [
	      /*==============ider-poc===========*/
		  require('./demo/route-config-demo'),
		  require('./beta/route-config-beta'),
		  require('./cstSvc/route-config-cstSvc'),
		  require('./other/route-config-other'),
          require('./oprtCntr/route-config-oprtCntr'),
          require('./menu/route-config-menu'),
          require('./authorization/route-config-aut'),
          require('./system/route-config-system'),
          require('./businessCard/route-config-businessCard'),
          require('./stage/route-config-stage'),
          require('./clearACC/route-config-clearACC'),
          /*==============ider===========*/
          require('./AoperatMode/route-config-AoperatMode'),
          
	 ];
	/*require("../controller/publicController");
	require("../controller/commonController");
	require("../controller/sysmanage/admin/adminController");*/
	require('../router/route-service');
	var angular = require('angular');
	var injector = angular.injector([ "router-service" ]);
	var routeService = injector.get("routeService");
	var config = {
	};
	angular.forEach(config_list, function(data){
		var obj = {};
		angular.forEach(data, function(dataS,indexS,arrayS){
			obj[dataS[0].split("?")[0]] = routeService.initAdminView(dataS[0],dataS[1],dataS[2]);
		});
		config = angular.extend(config,obj);
	});
	module.exports = config;
});
