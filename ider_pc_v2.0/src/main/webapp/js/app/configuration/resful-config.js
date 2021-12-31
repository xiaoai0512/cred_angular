'use strict';
var resfulConfig = {};
define(function(require) {
	var config_list = [
	      /*==============ider-poc===========*/
		  require('./demo/resful-config-demo'),
		  require('./beta/resful-config-beta'),
		  require('./cstSvc/resful-config-cstSvc'),
		  require('./other/resful-config-other'),
          require('./oprtCntr/resful-config-oprtCntr'),
          require('./menu/resful-config-menu'),
          require('./authorization/resful-config-aut'), 
          require('./system/resful-config-system'), 
          require('./businessCard/resful-config-businessCard'), 
          require('./stage/resful-config-stage'), 
          require('./clearACC/resful-config-clearACC'), 
          /*==============ider===========*/
          require('./AoperatMode/resful-config-AoperatMode'), 
	];
	var angular = require('angular');
	
	angular.forEach(config_list,function(config){
		angular.extend(resfulConfig,config) ;
	});
});
