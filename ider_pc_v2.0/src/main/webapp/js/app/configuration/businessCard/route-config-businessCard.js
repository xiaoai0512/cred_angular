'use strict';
define(function (require, exports, module) {
    var config = [
		//预算单位信息建立
		['/busCard/budgetUnitAdd', 'businessCard/budgetManage/budgetUnitAdd.html', 'businessCard/budgetManage/budgetUnitAddCtrl.js'],
		//预算单位信息查询和维护画面
		['/busCard/budgetUnitList', 'businessCard/budgetManage/budgetUnitList.html', 'businessCard/budgetManage/budgetUnitListCtrl.js'],

		//公务卡激活
		['/busCard/businessAactivated', 'businessCard/businessManage/businessAactivated.html', 'businessCard/businessManage/businessAactivatedCtrl.js'],
		//公务卡注销
		['/busCard/businessCancel', 'businessCard/businessManage/businessCancel.html', 'businessCard/businessManage/businessCancelCtrl.js'],

		//公务卡停用
		['/busCard/businessStop', 'businessCard/businessManage/businessStop.html', 'businessCard/businessManage/businessStopCtrl.js'],

		//单位公务卡额度管理
		['/busCard/unitQuotaQuery', 'businessCard/quotaManage/unitQuotaQuery.html', 'businessCard/quotaManage/unitQuotaQueryCtrl.js'],
		//公务卡金融交易查询
		['/busCard/financeQuery', 'businessCard/billManage/financeQuery.html', 'businessCard/billManage/financeQueryCtrl.js'],
		//公务卡已出账单查询
		['/busCard/busOutBillQuery', 'businessCard/billManage/busOutBillQuery.html', 'businessCard/billManage/busOutBillQueryCtrl.js'],
		//公务卡未出账单查询
		['/busCard/busNoOutBillQuery', 'businessCard/billManage/busNoOutBillQuery.html', 'businessCard/billManage/busNoOutBillQueryCtrl.js'],
		//预算的单位已出账单查询
		['/busCard/budOutQuery', 'businessCard/billManage/budOutQuery.html', 'businessCard/billManage/budOutQueryCtrl.js'],
		//公务卡溢缴款查询
		['/busCard/businessOverpayment', 'businessCard/businessOverpayment/businessOverpayment.html', 'businessCard/businessOverpayment/businessOverpayment.js'],
        //成本中心新建
        ['/busCard/costCenterAdd', 'businessCard/costCenter/costCenterAdd.html', 'businessCard/costCenter/costCenterAddCtrl.js'],
        //成本中心查询和维护页面
        ['/busCard/costCenterList', 'businessCard/costCenter/costCenterList.html', 'businessCard/costCenter/costCenterListCtrl.js'],
        //成本中心关系查询及维护
        ['/busCard/costCenterRelation', 'businessCard/costCenter/costCenterRelation.html', 'businessCard/costCenter/costCenterRelationCtrl.js'],

        //========================================禁用菜单====================
		//公务卡所属预算单位信息查询---------------------禁用菜单
		['/busCard/businessUnitList', 'businessCard/businessManage/businessUnitList-JY.html', 'businessCard/businessManage/businessUnitListCtrl-JY.js'],
		//个人公务卡最大授信额度查询
		['/busCard/individualQuotaQuery', 'businessCard/quotaManage/individualQuotaQuery-JY.html', 'businessCard/quotaManage/individualQuotaQueryCtrl-JY.js'],





	];
    module.exports = config;
});
