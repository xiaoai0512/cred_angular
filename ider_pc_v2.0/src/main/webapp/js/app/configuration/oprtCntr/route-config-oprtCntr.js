'use strict';
define(function (require, exports, module) {
    var config = [
    	
		//===============================产品发布中心(pDAncCntr)=================================
		//业务形态实例化
		['/proPubCnter/businessFormInst', 'oprtCntr/proPublishCenter/businessFormInstantiation.html', 'oprtCntr/proPublishCenter/businessFormInstantiation.js'],
		
		//余额对象例化
		['/proPublishCenter/balanceObjInst', 'oprtCntr/proPublishCenter/balanceObjInstantiation.html', 'oprtCntr/proPublishCenter/balanceObjInstantiation.js'],
		
		//媒介对象实例化
		['/proPublishCenter/mediaObjInstant', 'oprtCntr/proPublishCenter/mediaObjInstant.html', 'oprtCntr/proPublishCenter/mediaObjInstant.js'],
		
		//===============================产品管理中心(pDMgtCntr)=================================
		 //业务类型管理
		['/oprtCntr/bsnTpMgt', 'oprtCntr/pDMgtCntr/bsnTpMgt.html', 'oprtCntr/pDMgtCntr/bsnTpMgtController.js'],
		
		 //业务形态管理
		['/oprtCntr/busPatMan', 'oprtCntr/busPatMan/busPatMan.html', 'oprtCntr/busPatMan/busPatManController.js'],
		
		 //余额对象管理
		['/oprtCntr/balObjList', 'oprtCntr/balObjList.html', 'oprtCntr/balObjListController.js'],
		
		 //产品对象管理
		['/oprtCntr/productObject', 'oprtCntr/productObject/productObjectList.html', 'oprtCntr/productObject/productObjectController.js'],
		
		//产品业务范围管理
		['/oprtCntr/productBusinessScope', 'oprtCntr/productBusinessScope/productBusinessScope.html', 'oprtCntr/productBusinessScope/productBusinessScopeController.js'],
		
		 //媒介对象管理
		['/oprtCntr/mediaObject', 'oprtCntr/mediaObject/mediaObjectList.html', 'oprtCntr/mediaObject/mediaObjectController.js'],
		//===============================汇率管理(exRtMgt)=================================
		 //新增汇率
		['/oprtCntr/newExRt', 'oprtCntr/exRtMgt/newExRt.html', 'oprtCntr/exRtMgt/newExRtController.js'],
		
		 //查询维护汇率
		['/oprtCntr/enqrMntExRt', 'oprtCntr/exRtMgt/enqrMntExRt.html', 'oprtCntr/exRtMgt/enqrMntExRtController.js'],
		
		//===============================定价标签设置=================================
		 //定价标签设置
		['/oprtCntr/lblObjExmp', 'oprtCntr/pDAncCntr/lblObjExmp.html', 'oprtCntr/pDAncCntr/lblObjExmpController.js'],
		
		//===============================分期计划设置=================================
		//分期计划查询
		['/oprtCntr/instalmentsPlan', 'oprtCntr/instalments/instalmentsPlan.html', 'oprtCntr/instalments/instalmentsPlanController.js'],
		
		
		//===============================运营管理start=================================
		//交易费用设置
		['/overdraftCost/setting', 'oprtCntr/overdraftCost/overdraftCostSetting.html', 'oprtCntr/overdraftCost/overdraftCost.js'],
		//交易费用管理
		['/overdraftCost/management', 'oprtCntr/overdraftCost/overdraftCostMgt.html', 'oprtCntr/overdraftCost/overdraftCost.js'],
		//运营机构建立
		['/operatMech/operatMech', 'oprtCntr/operatMech/operatMech.html', 'oprtCntr/operatMech/operatMechCtrl.js'],
		//运营机构查询及维护
		['/operatMech/oprtInstEnqrAndMnt', 'oprtCntr/operatMech/oprtInstEnqrAndMnt.html', 'oprtCntr/operatMech/oprtInstEnqrAndMntCtrl.js'],
		//运营模式建立
		['/operatMech/operationMode', '/oprtCntr/operatMech/operationMode.html', 'oprtCntr/operatMech/operatModeCtrl.js'],
		//运营模式查询及维护
		['/operatMech/oprtModeEnqrAndMnt', '/oprtCntr/operatMech/oprtModeEnqrAndMnt.html', 'oprtCntr/operatMech/oprtModeEnqrAndMntCtrl.js'],
		
		
		
		//===============================货币表=================================
		//货币维护及查询
		['/currency/currencyMaintQuery', '/oprtCntr/currency/currencyMaintQuery.html', '/oprtCntr/currency/currencyCtrl.js'],
		
		//===============================卡BIN表=================================
		//卡BIN建立
		['/cardBin/cardBinEst', '/oprtCntr/cardBin/cardBinEst.html', '/oprtCntr/cardBin/cardBinCtrl.js'],
		//卡BIN维护及查询
		['/cardBin/cardBinMaintQuery', '/oprtCntr/cardBin/cardBinMaintQuery.html', '/oprtCntr/cardBin/cardBinCtrl.js'],
		
		//===============================财务中心=================================
		//会计分录查询
		['/financeCenter/accountEntryQuery', '/oprtCntr/financeCenter/accountEntryQuery.html', '/oprtCntr/financeCenter/accountEntryQueryCtrl.js'],
		//核算场景
		['/financeCenter/accountScene', '/oprtCntr/financeCenter/accountScene.html', '/oprtCntr/financeCenter/accountSceneCtrl.js'],
		//科目配置查询
		['/financeCenter/subjectConfigQuery', '/oprtCntr/financeCenter/subjectConfigQuery.html', '/oprtCntr/financeCenter/subjectConfigCtrl.js'],
		//会计分录模板管理
		['/financeCenter/accountTemplate', '/oprtCntr/financeCenter/accountTemplate.html', '/oprtCntr/financeCenter/accountTemplateCtrl.js'],

		//会计分录模板建立
		['/financeCenter/accountTemplateAdd', '/oprtCntr/financeCenter/accountTemplateAdd.html', '/oprtCntr/financeCenter/accountTemplateAddCtrl.js'],

		//科目配置建立
		['/financeCenter/subjectConfigAdd', '/oprtCntr/financeCenter/subjectConfigAdd.html', '/oprtCntr/financeCenter/subjectConfigAddCtrl.js'],

		//核算场景建立
		['/financeCenter/accountSceneAdd', '/oprtCntr/financeCenter/accountSceneAdd.html', '/oprtCntr/financeCenter/accountSceneCtrlAdd.js'],
		
		//卡版面管理
		//卡版面维护
		['/cardLayoutMag/cardLayoutList', '/oprtCntr/cardLayoutMag/cardLayoutList.html', '/oprtCntr/cardLayoutMag/cardLayoutListCtrl.js'],
		
		//交易入账查询
		['/transEntryInquiry/transEntryInquiry', '/oprtCntr/transEntryInquiry/transEntryInquiry.html', '/oprtCntr/transEntryInquiry/transEntryInquiryCtrl.js'],
		
		
		
		
		
		//==================================================禁用菜单===================================
		//货币建立
		['/currency/currencyEst', '/oprtCntr/currency/currencyEst-JY.html', '/oprtCntr/currency/currencyCtrl.js'],
    ];
    module.exports = config;
});