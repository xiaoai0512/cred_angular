'use strict';
define(function (require, exports, module) {
    var config = [
    	 //客户产品列表查询
		['/other/cstPDList', 'other/cstPDList/cstPDList.html', 'other/otherController.js'],
		//产品对象实例化
		['/other/newPDCfg', 'other/newPDCfg/newPDCfg.html', 'other/newPDCfg/newPDCfgController.js'],
		 //标签对象清单
		['/other/lblObjList', 'other/lblObjList/lblObjList.html', 'other/lblObjListController.js'],
		//业务类型实例化
		['/other/newBsnTpCfg', 'other/newBsnTpCfg/newBsnTpCfg.html', 'other/newBsnTpCfgController.js'],
		
    ];
    module.exports = config;
});