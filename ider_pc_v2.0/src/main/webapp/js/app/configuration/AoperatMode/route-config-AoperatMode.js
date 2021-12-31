'use strict';
define(function (require, exports, module) {
    var config = [
        //产品线/ider_pc/src/main/webapp/pages/a_operatMode/product/proLineEst.html
        // ['/product/proLineEst', 'a_operatMode/product/proLineEst.html', 'a_operatMode/product/proLineEst.js'],
        ['/product/proLineQuery', 'a_operatMode/product/proLineQuery.html', 'a_operatMode/product/proLineQuery.js'],

        ['/product/proObjectQuery', 'a_operatMode/product/proObjectQuery.html', 'a_operatMode/objectManage/proObjectQuery.js'],
        //产品参数历史维护
        ['/product/proHistoryQuery', 'a_operatMode/product/proHistoryQuery.html', 'a_operatMode/objectManage/proHistoryQuery.js'],
        //运营模式
        ['/optcenter/optModeQuery', 'a_operatMode/optcenter/optModeQuery.html', 'a_operatMode/operatManage/optModeQuery.js'],
        //运营机构
        ['/optcenter/optOrganQuery', 'a_operatMode/optcenter/optOrganQuery.html', 'a_operatMode/operatManage/optOrganeQuery.js'],
        //货币
        ['/currency/currencyQuery', 'a_operatMode/currency/currencyQuery.html', 'a_operatMode/currency/currencyQuery.js'],
        //汇率
        ['/currency/rateQuery', 'a_operatMode/currency/rateQuery.html', 'a_operatMode/currency/rateQuery.js'],
        //卡bin
        ['/cardBin/a_cardBinQuery', 'a_operatMode/cardBin/cardBinQuery.html', 'a_operatMode/cardBin/cardBinQuery.js'],

        //收费项目payProExampleQuery
        //['/payProject/payProject', 'a_operatMode/payProject/payProject.html', 'a_operatMode/payProject/payProject.js'],
        ['/payProject/payProjectQuery', 'a_operatMode/payProject/payProjectQuery.html', 'a_operatMode/payProject/payProjectQuery.js'],
        ['/payProject/payProjectCatalogue', 'a_operatMode/payProject/payProjectCatalogue.html', 'a_operatMode/payProject/payProjectCatalogue.js'],

      //利率变更
        ['/object/interestRate', 'a_operatMode/interestRate/interestRate.html', 'a_operatMode/interestRate/interestRate.js'],
        //媒介对象
        ['/media/mediaObjectQuery', 'a_operatMode/object/mediaObjectQuery.html', 'a_operatMode/objectManage/mediaObjectQuery.js'],
        //余额对象
        ['/object/balanceObjectQuery', 'a_operatMode/object/balanceObjectQuery.html', 'a_operatMode/objectManage/balanceObjectQuery.js'],
        //业务类型
        ['/business/businessTypeQuery', 'a_operatMode/business/businessTypeQuery.html', 'a_operatMode/business/businessTypeQuery.js'],
        //交易识别
        ['/trans/transIdentyMgt','a_operatMode/trans/transIdentyMgt.html','a_operatMode/trans/transIdentyMgtController.js'],
        ['/trans/transIdentyQuery','a_operatMode/trans/transIdentyQuery.html','a_operatMode/trans/transIdentyQuery.js'],
        //封锁码
        ['/blockCode/blockCodeQuery', 'a_operatMode/blockCode/blockCodeQuery.html', 'a_operatMode/blockCode/blockCodeQuery.js'],

        //定价标签
        ['/priceLabel/priceLabelEst', 'a_operatMode/priceLabel/priceLabelEst.html', 'a_operatMode/priceLabel/priceLabelEst.js'],
        ['/priceLabel/priceLabelQuery', 'a_operatMode/priceLabel/priceLabelQuery.html', 'a_operatMode/priceLabel/priceLabelQuery.js'],

        //构件，pcd，pcd差异实例
        ['/example/artifactExampleQuery', 'a_operatMode/example/artifactExampleQuery.html', 'a_operatMode/example/artifactExampleQuery.js'],
        ['/example/specialQuery', 'a_operatMode/example/specialQuery.html', 'a_operatMode/example/specialQuery.js'],
        //还款顺序设置
        ['/example/paymentOrderSettings', 'a_operatMode/example/paymentOrderSettings.html', 'a_operatMode/example/paymentOrderSettings.js'],
        //预留号规则
        ['/resNumber/resNumberQuery', 'a_operatMode/resNumber/resNumberQuery.html', 'a_operatMode/resNumber/resNumberQuery.js'],

		//预留特殊号码卡量查询
		['/resNumber/resSpecialNumberList', '/a_operatMode/resNumber/resSpecialNumberList.html', '/a_operatMode/resNumber/resSpecialNumberListCtrl.js'],

		//预留特殊卡号查询
		['/resNumber/resSpecialCardQuery', '/a_operatMode/resNumber/resSpecialCardQuery.html', 'a_operatMode/resNumber/resSpecialCardQueryCtrl.js'],

		//特殊号码规则查询
		['/resNumber/specialNumberRuleQuery', '/a_operatMode/resNumber/specialNumberRuleQuery.html', 'a_operatMode/resNumber/specialNumberRuleQueryCtrl.js'],

        //管控管理
        ['/manageControl/controlProjectQuery', 'a_operatMode/manageControl/controlProjectQuery.html', 'a_operatMode/manageControl/controlProjectQuery.js'],

        //新产品发布
        ['/busParOverview/businessParamsEst', 'a_operatMode/businessParamsOverview/businessParamsEst.html', 'a_operatMode/businessParamsOverview/businessParamsEst.js'],
        //产品参数一览
        ['/busParOverview/businessParamsViewQuery', 'a_operatMode/businessParamsOverview/businessParamsViewQuery.html', 'a_operatMode/businessParamsOverview/businessParamsViewQuery.js'],

        //核算状态管理
        // ['/accountingStatus/accountingStatusEst','a_operatMode/accountingStatus/accountingStatusEst.html','a_operatMode/accountingStatus/accountingStatusEst.js'],
        ['/accountingStatus/accountingStatusQuery','a_operatMode/accountingStatus/accountingStatusQuery.html','a_operatMode/accountingStatus/accountingStatusQuery.js'],

        //核算类型定义
        ['/accountingMag/accTypeDefy','a_operatMode/accountingMag/accTypeDefy.html','a_operatMode/accountingMag/accTypeDefyCtrl.js'],
        //核算类型映射维度实例化
        ['/accountingMag/accTypemMapDimInstan','a_operatMode/accountingMag/accTypemMapDimInstan.html','a_operatMode/accountingMag/accTypemMapDimInstanCtrl.js'],
        //记账规则主表
        ['/accountingMag/accountingRuleMaster','a_operatMode/accountingMag/accountingRuleMaster.html','a_operatMode/accountingMag/accountingRuleMasterCtrl.js'],
        //记账规则子表（科目类）
        ['/accountingMag/accRuleSubSubjectList','a_operatMode/accountingMag/accRuleSubSubjectList.html','a_operatMode/accountingMag/accRuleSubSubjectListCtrl.js'],
        //记账规则子表（内部帐类）
        ['/accountingMag/accRuleSubInterAccountList','a_operatMode/accountingMag/accRuleSubInterAccountList.html','a_operatMode/accountingMag/accRuleSubInterAccountListCtrl.js'],
        //核算主场景表
        ['/accountingMag/accMainSceneList','a_operatMode/accountingMag/accMainSceneList.html','a_operatMode/accountingMag/accMainSceneListCtrl.js'],
        //核算子场景表
        ['/accountingMag/accSubSceneList','a_operatMode/accountingMag/accSubSceneList.html','a_operatMode/accountingMag/accSubSceneListCtrl.js'],
        //绑定核算场景
        ['/accountingMag/bindAccSceneList','a_operatMode/accountingMag/bindAccSceneList.html','a_operatMode/accountingMag/bindAccSceneListCtrl.js'],
        //核算处理查询
        ['/accountingMag/accProcesseList','a_operatMode/accountingMag/accProcesseList.html','a_operatMode/accountingMag/accProcesseListCtrl.js'],

        //特别状况事件
        ['/optcenter/specialSitEvent','a_operatMode/optcenter/specialSitEvent.html','a_operatMode/operatManage/specialSitEvent.js'],
        //交易来源
        ['/optcenter/transactionList/tradingSource','a_operatMode/optcenter/transactionList/tradingSource.html','a_operatMode/operatManage/tradingSource.js'],
        //来源目录
        ['/optcenter/SourceDirectory/SourceDirectoryList','a_operatMode/optcenter/SourceDirectory/SourceDirectoryList.html','a_operatMode/operatManage/SourceDirectoryList.js'],
        //维护历史
        ['/history/nonBetaHist', 'a_operatMode/history/nonBetaHistList.html', 'a_operatMode/history/nonBetaHistCtrl.js'],
        //产品参数历史
        ['/historyParam/productHistoryParam', 'a_operatMode/historyParam/productHistoryParamList.html', 'a_operatMode/historyParam/productHistoryParamCtrl.js'],

        //预制卡
        ['/prefabCard/prefabCardList','a_operatMode/prefabCard/prefabCardList.html','a_operatMode/prefabCard/prefabCardListCtrl.js'],
        //卡号池请求
        ['/cardNoPoolAsk/cardNoPoolAskList','a_operatMode/cardNoPoolAsk/cardNoPoolAskList.html','a_operatMode/cardNoPoolAsk/cardNoPoolAskListCtrl.js'],
        //技术参数
        ['/technicalParams/technicalParamsList','a_operatMode/technicalParams/technicalParamsList.html','a_operatMode/technicalParams/technicalParamsListCtrl.js'],
        //债券代码
        ['/optcenter/bondCode/bondCodeList','a_operatMode/optcenter/bondCode/bondCodeList.html','a_operatMode/bondCodeList/bondCodeListCtrl.js'],

        //分期类型参数
        ['/stageTypePara/stagTypeParaList','a_operatMode/stageTypePara/stagTypeParaList.html','a_operatMode/stageTypePara/stagTypeParaListCtrl.js'],


        //=================================================禁用菜单=================================================

        //生命周期节点==========菜单禁用
        ['/lifeCycleNode/lifeCycleNodeQuery', 'a_operatMode/lifeCycleNode/lifeCycleNodeQuery.html', 'a_operatMode/lifeCycleNode/lifeCycleNodeQuery.js'],
        ['/resNumber/resNumberEst', 'a_operatMode/resNumber/resNumberEst-JY.html', 'a_operatMode/resNumber/resNumberEst-JY.js'],
        //产品对象
        ['/product/proObjectEst', 'a_operatMode/product/proObjectEst-JY.html', 'a_operatMode/objectManage/proObjectEst-JY.js'],
        ['/payProject/payProExampleQuery', 'a_operatMode/payProject/payProExampleQuery-JY.html', 'a_operatMode/payProject/payProExampleQuery-JY.js'],


        ];
    module.exports = config;
});
