'use strict';
define(function (require, exports, module) {
    var config = [

        //=================================客户信息管理===============================
      //一键建卡
      /*   ['/cstSvc/fastBuildCard', 'cstSvc/fastBuildCard/fastBuildCard.html', 'cstSvc/fastBuildCard/fastBuildCardCtrl.js'],*/


      //一键办卡],根据身份证查询，分为申请产品和申请附属卡
        ['/cstSvc/fastBuildCardTwo', 'cstSvc/fastBuildCard/fastBuildCardTwo.html', 'cstSvc/fastBuildCard/fastBuildCardTwoCtrl.js'],
		//25客户地址信息建立
		['/cstSvc/cstAdrInfEstb', 'cstSvc/cstAdrInfEstb/cstAdrInfEstb.html', 'cstSvc/cstAdrInfEstb/cstAdrInfEstbController.js'],
		//26客户信息查询及维护
		['/cstSvc/csInfEnqrAndMnt', 'cstSvc/csInfEstb/csInfEnqrAndMnt.html', 'cstSvc/csInfEstb/csInfEnqrAndMntController.js'],
		//客户信息查询及维护poc
		['/cstSvc/cstInfoMaint', 'cstSvc/csInfEstb/cstInfoMaint.html', 'cstSvc/csInfEstb/cstInfoMaintCtrl.js'],

		//客户证件号码变更
		['/cstSvc/cstIDNoChange', 'cstSvc/csInfEstb/cstIDNoChange.html', 'cstSvc/csInfEstb/cstIDNoChangeCtrl.js'],


		//27客户地址信息查询及维护
		['/cstSvc/cstAdrQuery', 'cstSvc/cstAdrInfEstb/cstAdrQuery.html', 'cstSvc/cstAdrInfEstb/cstAdrQueryCtrl.js'],
		//客户级统一信息
		['/cstSvc/csrUnifyInf', 'cstSvc/csrUnifyInf/csrUnifyInf.html', 'cstSvc/csrUnifyInf/csrUnifyInfController.js'],

		//客户业务项目查询
		['/cstSvc/cstBsnisItemQuery', 'cstSvc/cstBsnisItemQuery/cstBsnisItemQuery.html', 'cstSvc/cstBsnisItemQuery/cstBsnisItemQueryCtrl.js'],

		//29产品信息查询及维护
		['/cstSvc/pDInfEnqrAndMnt', 'cstSvc/pDInfMgt/pDInfEnqrAndMnt.html', 'cstSvc/pDInfMgt/pDInfEnqrAndMntController.js'],
		//客户产品注销
		['/cstSvc/proCancel', 'cstSvc/pDInfMgt/proCancel.html', 'cstSvc/pDInfMgt/proCancelCtrl.js'],

		//客户车辆信息查询及维护
        ['/cstSvc/cstVehicleQuery', 'cstSvc/cstVehicleEstb/cstVehicleQuery.html', 'cstSvc/cstVehicleEstb/cstVehicleQueryCtrl.js'],

        //客户房产信息查询及维护
        ['/cstSvc/cstHouseQuery', 'cstSvc/cstHouseInfEstb/cstHouseQuery.html', 'cstSvc/cstHouseInfEstb/cstHouseQueryCtrl.js'],

        //联络人信息查询及维护
        ['/cstSvc/cstContactQuery', 'cstSvc/cstContactInfEstb/cstContactQuery.html', 'cstSvc/cstContactInfEstb/cstContactCtrl.js'],

        //=================================媒介信息管理===============================
		//31媒介信息查询及维护
		['/cstSvc/mdmInfEnqrAndMnt', 'cstSvc/mdmInfMgt/mdmInfEnqrAndMnt.html', 'cstSvc/mdmInfMgt/mdmInfEnqrAndMntController.js'],
		//媒介信息绑定
		['/cstSvc/mdmInfBind', 'cstSvc/mdmInfMgt/mdmInfBind.html', 'cstSvc/mdmInfMgt/mdmInfBindController.js'],

		//媒介注销
		['/cstSvc/mdmCancel', 'cstSvc/mdmInfMgt/mdmCancel.html', 'cstSvc/mdmInfMgt/mdmCancelController.js'],


		//=================================账户信息管理(accInfMgt)===============================
		//客户延滞状况
		['/cstSvc/cstDelinquencyInf', 'cstSvc/cstDelinquencyList/cstDelinquencyList.html', 'cstSvc/cstDelinquencyList/cstDelinquencyController.js'],
		//未出账单查询
		['/cstSvc/accMoneySearch', 'cstSvc/accMoneySearch/accMoneySearch.html', 'cstSvc/accMoneySearch/accMoneySearch.js'],

		//账户金融信息查询
		['/cstSvc/accFinancialInf', 'cstSvc/acbaUnitList/accFinancialInf.html', 'cstSvc/accCyleleFiciList/accFinancialInfController.js'],
		['/cstSvc/accFinancialInfNew', 'cstSvc/acbaUnitList/accFinancialInfNew.html', 'cstSvc/accCyleleFiciList/accFinancialInfNewController.js'],
		['/cstSvc/accFinancialInfThree', 'cstSvc/acbaUnitList/accFinancialInfThree.html', 'cstSvc/accCyleleFiciList/accFinancialInfThreeController.js'],
		//=================================统一视角管理===============================
		//客户管控视角

		//32客户账户列表
		['/cstSvc/unifiedVisualManage/cstAccountList', 'cstSvc/unifiedVisualManage/cstAccountList.html', 'cstSvc/unifiedVisualManage/cstAccountController.js'],
		//产品优化视图
		['/cstSvc/productMajView', 'cstSvc/unifiedVisualManage/productMajView.html', 'cstSvc/unifiedVisualManage/productMajViewCtrl.js'],

		//媒介优化视图
		['/cstSvc/meadiaMajView', 'cstSvc/unifiedVisualManage/meadiaMajView.html', 'cstSvc/unifiedVisualManage/meadiaMajViewCtrl.js'],
		//客户定价视图
		['/cstSvc/priceView', 'cstSvc/unifiedVisualManage/priceView.html', 'cstSvc/unifiedVisualManage/priceViewCtrl.js'],
		//客户定价标签查询
		['/cstSvc/cstPrcgLblEnqr', 'cstSvc/cstPrcgLblEnqr/cstPrcgLblEnqr.html', 'cstSvc/cstPrcgLblEnqr/cstPrcgLblEnqrController.js'],
		//=================================基础业务受理(baseBsnPcsg)===============================
		//32媒介激活
		['/cstSvc/mdmActvt', 'cstSvc/baseBsnPcsg/mdmActvt.html', 'cstSvc/baseBsnPcsg/mdmActvtController.js'],
		//媒介挂失
		['/cstSvc/mediaLoss', 'cstSvc/baseBsnPcsg/mediaLoss.html', 'cstSvc/baseBsnPcsg/mediaLossCtrl.js'],
		//媒介毁损补发
		['/cstSvc/mediaDmgRsu', 'cstSvc/baseBsnPcsg/mediaDmgRsu.html', 'cstSvc/baseBsnPcsg/mediaDmgRsuCtrl.js'],
		//提前续卡
		['/cstSvc/advanceRenewCard', 'cstSvc/baseBsnPcsg/advanceRenewCard.html', 'cstSvc/baseBsnPcsg/advanceRenewCardCtrl.js'],
		//统一利率
		['/cstSvc/uniteRate', 'cstSvc/baseBsnPcsg/uniteRate.html', 'cstSvc/baseBsnPcsg/uniteRateCtrl.js'],
		//产品升降级
		['/cstSvc/proLifting', 'cstSvc/baseBsnPcsg/proLifting.html', 'cstSvc/baseBsnPcsg/proLiftingCtrl.js'],


		//封锁码管理
		['/cstSvc/blockCodeMag', 'cstSvc/baseBsnPcsg/blockCodeMag.html','cstSvc/blockCode/blockCodeMagCtrl.js'],
		//去除封锁码
		['/cstSvc/deleteBlockCode', 'cstSvc/baseBsnPcsg/deleteBlockCode.html','cstSvc/blockCode/deleteBlockCodeCtrl.js'],
		//封锁码历史查询
		['/cstSvc/blockHistory', 'cstSvc/baseBsnPcsg/blockHistory.html','cstSvc/blockCode/blockHistoryCtrl.js'],
		//客户管控视图
		['/cstSvc/cstControlView', 'cstSvc/baseBsnPcsg/cstControlView.html','cstSvc/blockCode/cstControlViewCtrl.js'],

		//约定扣款设置
		['/cstSvc/agreedDeducteSet', 'cstSvc/deducte/agreedDeducteSet.html','cstSvc/deducte/agreedDeducteSetCtrl.js'],
		//非金融维护历史查询
		['/cstSvc/nonFinanTenanceHistQuery', 'cstSvc/tenanceHist/nonFinanTenanceHistQuery.html','cstSvc/tenanceHist/nonFinanTenanceHistQueryCtrl.js'],
		//实时制卡
		['/cstSvc/rlTmMkCrd', 'cstSvc/baseBsnPcsg/rlTmMkCrd.html', 'cstSvc/baseBsnPcsg/rlTmMkCrdController.js'],
		//33修改账单日
		['/cstSvc/reviseBillDay', 'cstSvc/reviseBillDay/reviseBillDay.html', 'cstSvc/reviseBillDay/reviseBillDayController.js'],

		// 关联套卡查询
		['/cstSvc/associatedCardQuery', 'cstSvc/baseBsnPcsg/associatedCardQuery.html', 'cstSvc/baseBsnPcsg/associatedCardQueryCtrl.js'],

		// 核算状态维护
		['/cstSvc/acctStatusMaint', 'cstSvc/baseBsnPcsg/acctStatusMaint.html', 'cstSvc/baseBsnPcsg/acctStatusMaintCtrl.js'],

		// 统一日期修改
		['/cstSvc/dateModification', 'cstSvc/dateModification/dateModificationList.html', 'cstSvc/dateModification/dateModificationListController.js'],
		// 预制卡
		['/cstSvc/prefabricatedCard', 'cstSvc/baseBsnPcsg/prefabricatedCard.html', 'cstSvc/baseBsnPcsg/prefabricatedCardCtrl.js'],




		//=================================金融交易管理(fncTxnMgt)===========================================

		//循环借记交易补录
		['/cstSvc/rvlDbtTxnSplmtEntrg', 'cstSvc/fncTxnMgt/rvlDbtTxnSplmtEntrg.html', 'cstSvc/fncTxnMgt/rvlDbtTxnSplmtEntrgController.js'],
		//循环贷记交易补录
		['/cstSvc/rvlCrTxnSplmtEntrg', 'cstSvc/fncTxnMgt/rvlCrTxnSplmtEntrg.html', 'cstSvc/fncTxnMgt/rvlCrTxnSplmtEntrgController.js'],
		//还款交易补录
		['/cstSvc/rpyTxnSplmtEntrg', 'cstSvc/fncTxnMgt/rpyTxnSplmtEntrg.html', 'cstSvc/fncTxnMgt/rpyTxnSplmtEntrgController.js'],
		//争议交易补录
		['/cstSvc/disputeTransEntrg', 'cstSvc/fncTxnMgt/disputeTransEntrg.html', 'cstSvc/fncTxnMgt/disputeTransEntrgController.js'],
		//分期交易补录
		['/cstSvc/periodTransEntrg', 'cstSvc/fncTxnMgt/periodTransEntrg.html', 'cstSvc/fncTxnMgt/periodTransEntrgController.js'],
		//异常交易管理
		['/cstSvc/abnormalTradManage', 'cstSvc/abnormalTradManage/abnormalTradManage.html', 'cstSvc/abnormalTradManage/abnormalTradManageCtrl.js'],




		//=================================交易信息查询(txnInfEnqr)===============================
		//已出账单查询
		['/cstSvc/billEnqr', 'cstSvc/txnInfEnqr/billEnqr.html', 'cstSvc/txnInfEnqr/billEnqrController.js'],


		//已出账单查询优化版
		['/cstSvc/billEnqrTwo', 'cstSvc/txnInfEnqr/billEnqr2.html', 'cstSvc/txnInfEnqr/billEnqrController2.js'],


		//账户还款历史查询
		['/cstSvc/accRepyHistEnqr', 'cstSvc/accountHist/accRepyHistEnqr.html', 'cstSvc/accountHist/accRepyHistEnqr.js'],

		//交易类拒绝交易查询
		['/cstSvc/refuseTrade', 'cstSvc/txnInfEnqr/refuseTrade.html', 'cstSvc/txnInfEnqr/refuseTradeCtrl.js'],


		//信贷交易账户信息
		['/cstSvc/instalQuery', 'cstSvc/instalmentsQuery/instalQuery.html', 'cstSvc/instalmentsQuery/instalQueryController.js'],

		//金融交易查询
		['/cstSvc/transQuery', 'cstSvc/txnInfEnqr/transQuery.html', 'cstSvc/txnInfEnqr/transQueryController.js'],
		//结售汇记录查询
		['cstSvc/settleSaleRecordQuery', 'cstSvc/txnInfEnqr/settleSaleRecordQuery.html', 'cstSvc/txnInfEnqr/settleSaleRecordQueryController.js'],

		//利息查询
		['/cstSvc/interestQuery', 'cstSvc/interestQuery/interestQuery.html', 'cstSvc/interestQuery/interestQueryController.js'],

		//利息查询
		['/cstSvc/interestQueryNew', 'cstSvc/interestQuery/interestQueryNew.html', 'cstSvc/interestQuery/interestQueryNewController.js'],

		//客户费用配置
		['/cstSvc/cstFeeAdd', 'cstSvc/cstFee/cstFeeAdd.html', 'cstSvc/cstFee/cstFeeAddController.js'],
		//客户费用查询维护
		['/cstSvc/cstFeeInfo', 'cstSvc/cstFee/cstFeeInfo.html', 'cstSvc/cstFee/cstFeeInfoController.js'],
		//客户交易统计查询
		['/cstSvc/cstTransStatisticsList', 'cstSvc/cstTransStatisticsList/cstTransStatisticsList.html', 'cstSvc/cstTransStatisticsList/cstTransStatisticsListController.js'],

		//账单分期
		['/cstSvc/billStage', 'cstSvc/txnInfEnqr/billStage.html', 'cstSvc/txnInfEnqr/billStageController.js'],

		//信贷交易账户信息
		['/cstSvc/creditTradeAccount', 'cstSvc/txnInfEnqr/creditTradeAccount.html', 'cstSvc/txnInfEnqr/creditTradeAccountCtrl.js'],

    	//账户列表查询
		//['/cstSvc/cstCprsvInfEnqr', 'cstSvc/cstCprsvInfEnqr/cstCprsvInfEnqr.html', 'cstSvc/cstCprsvInfEnqrController.js'],
		//账户列表查询跳转大页面
		//['/cstSvc/checkCstCprsvInfEnqr', 'cstSvc/cstCprsvInfEnqr/checkCstCprsvInfEnqr.html', 'cstSvc/checkCstCprsvInfEnqrController.js'],
		//客户媒介列表查询
		//['/cstSvc/cstMediaList', 'cstSvc/cstMediaList/cstMediaList.html', 'cstSvc/cstMediaListController.js'],
		// 客户管控视角查询
		//['/cstSvc/cstMgtandcntlViewEnqr', 'cstSvc/cstMgtandcntlViewEnqr/cstMgtandcntlViewEnqr.html', 'cstSvc/cstMgtandcntlViewEnqrController.js'],
		//生命周期概览
		//['/cstSvc/lCOvew', 'cstSvc/lCOvew/lCOvew.html', 'cstSvc/lCOvew/lCOvewController.js'],
		//账户生命周期
		//['/lCOvew/accLC?str&ccy', 'cstSvc/lCOvew/accLC.html', 'cstSvc/lCOvew/lCOvewController.js'],
		//账户生命周期
		//['/lCOvew/pDLC?str&ccy', 'cstSvc/lCOvew/pDLC.html', 'cstSvc/lCOvew/lCOvewController.js'],

		//=================================利息信息管理===============================
		//利息试算
		['/cstSvc/interestTrial', 'cstSvc/interestQuery/interestTrial.html', 'cstSvc/interestQuery/interestTrialCtrl.js'],
		//利息调整补录
		['/cstSvc/interestAdjustRecord', 'cstSvc/interestQuery/interestAdjustRecord.html', 'cstSvc/interestQuery/interestAdjustRecordCtrl.js'],
		//利息累计试算
		['/cstSvc/interestAccruedTrial', 'cstSvc/interestQuery/interestAccruedTrial.html', 'cstSvc/interestQuery/interestAccruedTrialCtrl.js'],
		//利息贷调
		['/cstSvc/interestCredit', 'cstSvc/interestQuery/interestCredit.html', 'cstSvc/interestQuery/interestCreditCtrl.js'],

		//交易单元查询
		['/cstSvc/occurrAmtTransQuery', 'cstSvc/txnInfEnqr/occurrAmtTransQuery.html', 'cstSvc/txnInfEnqr/occurrAmtTransQueryController.js'],



		//=================================费用信息管理===============================
		//费用调整补录
		['/cstSvc/feeAdjustRecord', 'cstSvc/cstFeeWaiveList/feeAdjustRecord.html', 'cstSvc/cstFeeWaiveList/feeAdjustRecordCtrl.js'],
		//费用贷调
		['/cstSvc/costInfQuery', 'cstSvc/costInfMage/costInfQuery.html', 'cstSvc/costInfMage/costInfQueryCtrl.js'],
		//=================================二次参数识别===============================
		//二次参数识别查询
		['/cstSvc/twoDisParamsQuery', 'cstSvc/twoDisParams/twoDisParamsQuery.html', 'cstSvc/twoDisParams/twoDisParamsQueryCtrl.js'],


		//现金分期
		['/cstSvc/cashStage', 'cstSvc/cashStage/cashStage.html', 'cstSvc/cashStage/cashStageCtrl.js'],

		//专项分期
		['/cstSvc/balnStage', 'cstSvc/balnStage/balnStage.html', 'cstSvc/balnStage/balnStageCtrl.js'],

		//贷款试算
		['/cstSvc/loanTrial', 'cstSvc/loanTrial/loanTrial.html', 'cstSvc/loanTrial/loanTrialCtrl.js'],

		//贷款支付信息
		['/cstSvc/loanPayment', 'cstSvc/loanPayment/loanPaymentInfo.html', 'cstSvc/loanPayment/loanPaymentInfoCtrl.js'],

		//客户定制元件查询维护
		['/cstSvc/customizedComponentsList', 'cstSvc/cstPrcgLblEnqr/customizedComponentsList.html','cstSvc/cstPrcgLblEnqr/customizedComponentsQueryCtrl.js'],


		//MC调单申请查询
		['/cstSvc/applicationFormMC', 'cstSvc/applicationFormMC/applicationFormMCQuery.html', 'cstSvc/applicationFormMC/applicationFormMCQueryCtrl.js'],


		//=================================调单申请管理===============================
		//VISA调单申请管理及维护
		['/cstSvc/applicationFormVisa', 'cstSvc/applicationFormVisa/applicationFormVisaQuery.html', 'cstSvc/applicationFormVisa/applicationFormVisaQueryCtrl.js'],

		//VISA拒付管理及维护
		['/cstSvc/protestFormVisa', 'cstSvc/protestFormVisa/protestFormVisaQuery.html', 'cstSvc/protestFormVisa/protestFormVisaQueryCtrl.js'],

		//MC拒付管理及维护
		['/cstSvc/protestFormMC', 'cstSvc/protestFormMC/protestFormMCQuery.html', 'cstSvc/protestFormMC/protestFormMCQueryCtrl.js'],

		//=================================资产证券化===============================
		//ABS计划管理
		['/cstSvc/ABSplanManage', 'cstSvc/assetSecurities/ABSplanManage.html', 'cstSvc/assetSecurities/ABSplanManageCtrl.js'],
		//资产证券化转让
		['/cstSvc/securitiesRepurchase', 'cstSvc/assetSecurities/securitiesRepurchase.html', 'cstSvc/assetSecurities/securitiesRepurchaseCtrl.js'],
		//资产证券化查询
		['/cstSvc/assetSecuritiesQuery', 'cstSvc/assetSecurities/assetSecuritiesQuery.html', 'cstSvc/assetSecurities/assetSecuritiesQueryCtrl.js'],
		//回购法人标志维护
		['/cstSvc/repurchaseCorporation', 'cstSvc/assetSecurities/repurchaseCorporation.html', 'cstSvc/assetSecurities/repurchaseCorporationCtrl.js'],

		//=================================多资方贷款===============================
		//合作方信息管理
		['/cstSvc/partnerInformation', 'cstSvc/multiFundLoan/partnerInformation.html', 'cstSvc/multiFundLoan/partnerInformationCtrl.js'],
		//资金协议创建
		['/cstSvc/capitalAgreement', 'cstSvc/multiFundLoan/capitalAgreement.html', 'cstSvc/multiFundLoan/capitalAgreementCtrl.js'],
		//产品额度节点
		['/cstSvc/proQuotaNode', 'cstSvc/multiFundLoan/productQuotaNode/proQuotaNode.html', 'cstSvc/multiFundLoan/proQuotaNodeCtrl.js'],
		//分期管理
		['/cstSvc/stagingInfor', 'cstSvc/managementByStages/stagingInfor.html', 'cstSvc/managementByStages/stagingInforCtrl.js'],

		//========================================================禁用菜单=================================
		//账户基本信息=========禁用菜单
		['/cstSvc/accBscInf', 'cstSvc/accInfMgt/accBscInf-JY.html', 'cstSvc/accInfMgt/accBscInfController-JY.js'],

		//单笔无账期账户查询          -------------（菜单禁用）
		['/cstSvc/instalQueryS2', 'cstSvc/instalmentsQuery/instalQueryS2-JY.html', 'cstSvc/instalmentsQuery/instalQueryS2Controller-JY.js'],
		//信用卡分期账户查询    -------------（菜单禁用）
		['/cstSvc/instalCardQuery', 'cstSvc/instalmentsCardQuery/instalCardQuery-JY.html', 'cstSvc/instalmentsCardQuery/instalCardQueryController-JY.js'],
		//客户统一日期查询----------(菜单禁用)
		['/cstSvc/cstUnitDateQuery', 'cstSvc/cstBsnisItemQuery/cstUnitDateQuery-JY.html', 'cstSvc/cstBsnisItemQuery/cstUnitDateQueryCtrl-JY.js'],
		//28产品信息建立----------(菜单禁用)
		['/cstSvc/pDInfEstb', 'cstSvc/pDInfMgt/pDInfEstb-JY.html', 'cstSvc/pDInfMgt/pDInfEstbController-JY.js'],
		//客户费用免除信息查询---------------禁用菜单
		['/cstSvc/cstFeeWaiveList', 'cstSvc/cstFeeWaiveList/cstFeeWaiveList-JY.html', 'cstSvc/cstFeeWaiveList/cstFeeWaiveListController-JY.js'],
		//30媒介信息建立-----------禁用
		['/cstSvc/mdmInfEstb', 'cstSvc/mdmInfMgt/mdmInfEstb-JY.html', 'cstSvc/mdmInfMgt/mdmInfEstbController-JY.js'],
		//24客户信息建立----------禁用
		['/cstSvc/csInfEstb', 'cstSvc/csInfEstb/csInfEstb.html', 'cstSvc/csInfEstb/csInfEstbController.js'],
		//交易类活动日志查询-------------禁用
		['/cstSvc/activityLog', 'cstSvc/txnInfEnqr/activityLog-JY.html', 'cstSvc/txnInfEnqr/activityLogController-JY.js'],
		//用户访问历史查询---------------（用户访问历史查询）菜单禁用
		['/cstSvc/userAccessHistQuery', 'cstSvc/userAccessHist/userAccessHistQuery-JY.html','cstSvc/userAccessHist/userAccessHistQueryCtrl-JY.js'],
		//争议数据查询-------------禁用
		['/cstSvc/disputeQuery', 'cstSvc/disputeAccontInfo/disputeAccontInfo-JY.html', 'cstSvc/disputeAccontInfo/disputeAccontInfoController-JY.js'],
		//交易类争议交易查询-------------禁用
		['/cstSvc/disputedTradeQuery', 'cstSvc/txnInfEnqr/disputedTradeQuery-JY.html', 'cstSvc/txnInfEnqr/disputedTradeQueryCtrl-JY.js'],
		//客户存款信息-------------禁用
		['/cstSvc/depositInf', 'cstSvc/accInfMgt/depositInf-JY.html', 'cstSvc/accInfMgt/depositInfController-JY.js'],
		//账户余额单元列表-------------禁用
		['/cstSvc/acbaUnitList', 'cstSvc/acbaUnitList/acbaUnitList-JY.html', 'cstSvc/acbaUnitListController-JY.js'],
		//32客户产品列表-------------禁用
		['/cstSvc/unifiedVisualManage/cstProductList', 'cstSvc/unifiedVisualManage/cstProductList-JY.html', 'cstSvc/unifiedVisualManage/cstProductController-JY.js'],
		//客户定制元件新增-------------禁用
		['/cstSvc/customizedComponentsAdd', 'cstSvc/cstPrcgLblEnqr/customizedComponentsAdd-JY.html', 'cstSvc/cstPrcgLblEnqr/customizedComponentsAddCtrl-JY.js'],
		//客户业务类型标签设置-------------禁用
		['/cstSvc/cstBsTypeLbSet', 'cstSvc/cstPrcgLblEnqr/cstBsTypeLbSet-JY.html', 'cstSvc/cstPrcgLblEnqr/cstBsTypeLbSetCtrl-JY.js'],
		//32客户媒介列表---------（客户媒介优化）菜单禁用
		['/cstSvc/unifiedVisualManage/cstMediaList', 'cstSvc/unifiedVisualManage/cstMediaList-JY.html', 'cstSvc/unifiedVisualManage/cstMediaController-JY.js'],
		//账户余额对象信息
		['/cstSvc/acBaObjInf', 'cstSvc/accInfMgt/acBaObjInf-JY.html', 'cstSvc/accInfMgt/acBaObjInfController-JY.js'],
		//账户周期金融信息
		['/cstSvc/accCycleFiciList', 'cstSvc/accCycleFiciList/accCycleFiciList-JY.html', 'cstSvc/accCyleleFiciList/accCycleFiciController-JY.js'],
        //客户证件信息
        ['/cstSvc/cstCertificateQuery', 'cstSvc/cstCertificateInfEstb/cstCertificateQuery.html', 'cstSvc/cstCertificateInfEstb/cstCertificateQueryCtrl.js'],
        //客户职业信息
        ['/cstSvc/cstProfessionQuery', 'cstSvc/cstProfessionInfEstb/cstProfessionQuery.html', 'cstSvc/cstProfessionInfEstb/cstProfessionQueryCtrl.js'],





		];
    module.exports = config;
});
