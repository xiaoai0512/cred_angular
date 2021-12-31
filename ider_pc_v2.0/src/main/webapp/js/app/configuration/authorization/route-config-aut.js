'use strict';
define(function (require, exports, module) {
    var config = [
		//客户信息查询
		['/auth/cusInfo', 'authorization/customerInfo/cusInfo.html', 'authorization/customerInfo/cusInfoController.js'],
		// 媒介信息查询
		['/auth/cardInfo', 'authorization/customerInfo/cardInfo.html', 'authorization/customerInfo/cardInfoController.js'],
		//实时余额查询
		['/auth/rltmBalEnqr', 'authorization/customerInfo/rltmBalEnqr.html', 'authorization/customerInfo/rltmBalEnqrController.js'],
		//发卡例外名单
		['/auth/manageList', 'authorization/customerInfo/manageList.html', 'authorization/customerInfo/manageListController.js'],
		// 授权欺诈名单
		['/auth/fraudList', 'authorization/customerInfo/fraudList.html', 'authorization/customerInfo/fraudListController.js'],
		//交易累计查询
		['/auth/quotaTradQuery', 'authorization/customerInfo/quotaTradQuery.html', 'authorization/customerInfo/quotaTradQueryController.js'],
		// 客户设置密码
		['/auth/uPass', 'authorization/customerInfo/uPass.html', 'authorization/customerInfo/uPassController.js'],
		//授权例外名单
		['/auth/exceptionList', 'authorization/customerInfo/exceptionList.html', 'authorization/customerInfo/exceptionListController.js'],
		//免密金额设置
		['/auth/densityFree','authorization/customerInfo/densityFree.html','authorization/customerInfo/densityFree.js'],
		//当日交易查询
		['/auth/tradingNowP', 'authorization/tradingList/tradingNowP.html', 'authorization/tradingCer/tradingNowPController.js'],
		//历史交易查询
		['/auth/tradingHistoryP', 'authorization/tradingList/tradingHistoryP.html', 'authorization/tradingCer/tradingHistoryPController.js'],
		// 授权交易录入
		['/auth/authEntry', 'authorization/tradingList/authEntry.html', 'authorization/tradingCer/authEntryController.js'],
		//预授权场景查询
		['/auth/preScenarioQuery','authorization/tradingList/preScenarioQuery.html','authorization/tradingCer/preScenarioQueryController.js'],
		//未达授权查询
		['/auth/authNo', 'authorization/tradingList/authNo.html', 'authorization/tradingCer/authNoController.js'],
		//异常交易查询
		['/auth/activityHistoryP','authorization/tradingList/activityHistory.html', 'authorization/tradingCer/activityHistoryController.js'],
		//异常交易历史查询
		['/auth/activityNowP','authorization/tradingList/activityNowP.html', 'authorization/tradingCer/activityNowPController.js'],
		// 授权场景
		['/auth/scenarioQuery', 'authorization/scenario/scenarioQuery.html', 'authorization/scenario/scenarioQueryController.js'],
		//交易模式查询与维护
		['/auth/tradModelQuery', 'authorization/scenario/tradModelQuery.html', 'authorization/scenario/tradModelQueryController.js'],
		//交易场景查询与维护
		['/auth/tradScenarioQuery', 'authorization/scenario/tradScenarioQuery.html', 'authorization/scenario/tradScenarioController.js'],
		//授权响应码
		['/auth/authCode', 'authorization/scenario/authCodeList.html', 'authorization/scenario/authCodeController.js'],
		//营销清单
		['/auth/marketingList','authorization/marketing/marketingList.html','authorization/marketing/marketingListController.js'],
		//营销场景
		['/auth/marketingScene','authorization/marketing/marketingScene.html','authorization/marketing/marketingSceneController.js'],
	//  国际组织网络管理
		['/auth/networkManage', 'authorization/network/networkManage.html', 'authorization/network/networkManageController.js'],
	//  国际组织参数管理
		['/auth/parameterManage', 'authorization/network/parameterManagement.html', 'authorization/network/parameterManageController.js'],
		//网络连接状态
		['/auth/parameterStatus', 'authorization/network/parameterStatus.html', 'authorization/network/parameterStatusController.js'],
		// 例外清单查询及维护
		['/auth/exceptionManage', 'authorization/controltrading/exceptionManage.html', 'authorization/controltrading/exceptionManageController.js'],
		//清单限制查询及维护
		['/auth/listQuery', 'authorization/controltrading/listQuery.html', 'authorization/controltrading/listQueryController.js'],
		// 正负面清单查询及维护
		['/auth/negativeQuery', 'authorization/controltrading/negativeQuery.html', 'authorization/controltrading/negativeQueryController.js'],
		//交易管控差异化查询及维护
		['/auth/diffQuery', 'authorization/controltrading/diffQuery.html', 'authorization/controltrading/diffQueryController.js'],
		//交易累计历史查询
	    ['/auth/quotaHistory', 'authorization/customerInfo/quotaHistory.html', 'authorization/customerInfo/quotaHistoryController.js'],
	    //授权错误码
		['/auth/errorCodeList','authorization/scenario/errorCodeList.html','authorization/scenario/errorCodeListCtrl.js'],
		// 加密机参数管理
		['/auth/encryptionM', 'authorization/machineManage/encryptionM.html', 'authorization/machineManage/encryptionMController.js'],
		//密钥管理
		['/auth/keyM', 'authorization/machineManage/keyM.html', 'authorization/machineManage/keyMController.js'],
		//管控清单限制
		['/auth/contrlCont', 'authorization/controltrading/contrlCont.html','authorization/controltrading/contrlCont.js'],
		//副卡限制
		['/auth/supplyControl','authorization/controltrading/supplyControl.html','authorization/controltrading/supplyControl.js'],
		
		
		// 客户额度授信
		['/auth/creditInfo', 'authorization/customerInfo/creditInfo.html', 'authorization/customerInfo/creditInfoController.js'],
		//客户额度调整
		['/auth/adjustCustomer', 'authorization/customerInfo/adjustCustomer.html', 'authorization/customerInfo/adjustCustomerCtrl.js'],
		//客户额度查询
		['/auth/quotaQuery', 'authorization/customerInfo/quotaQuery.html', 'authorization/customerInfo/quotaQueryCtrl.js'],
		//客户可用额度查询
		['/auth/quotaAvailableQuery', 'authorization/customerInfo/quotaAvailableQuery.html', 'authorization/customerInfo/quotaAvailableQueryCtrl.js'],
		//调额历史查询
		['/auth/adjustHistory', 'authorization/customerInfo/adjustHistory.html', 'authorization/customerInfo/adjustHistoryController.js'],
		// 额度节点查询及维护
		['/auth/quotaNode', 'authorization/quotatree/quotaNode.html', 'authorization/quotatree/quotaNodeController.js'],
		// 额度树查询
		['/auth/quotaTree', 'authorization/quotatree/quotatreeAll.html', 'authorization/quotatree/quotatreeController.js'],
	];
    module.exports = config;
});