'use strict';
define(function (require, exports, module) {
    var config = [
		//渠道管理
		['/channelMag/channelList', '/clearACC/channelMag/channelList.html', '/clearACC/channelMag/channelListCtrl.js'],
		//清算场景管理
		['/clearScene/clearSceneList', '/clearACC/clearScene/clearSceneList.html', '/clearACC/clearScene/clearSceneListCtrl.js'],
		//清算处理结果
		['/clearScene/clearResultList', '/clearACC/clearResult/clearResultList.html', '/clearACC/clearResult/clearResultListCtrl.js'],
		//异常交易管理
		['/clearScene/clearAbnormalList','/clearACC/clearAbnormal/clearAbnormalList.html', '/clearACC/clearAbnormal/clearAbnormalListCtrl.js'],
        //清算历史查询
        ['/clearACC/clearHistory','/clearACC/clearHistory/clearHistoryList.html', '/clearACC/clearHistory/clearHistoryListCtrl.js'],
    ];
    module.exports = config;
});
