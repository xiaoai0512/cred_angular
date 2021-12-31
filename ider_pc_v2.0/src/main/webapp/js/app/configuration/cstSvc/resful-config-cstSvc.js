'use strict';
define(function(require, exports, module) {
	var config = {
		// 客户延滞状况
		cstDelinquencyInfo : {
			query : '/nonfinanceService/BSS.IQ.01.0040',
			queryMain : '/nonfinanceService/BSS.IQ.01.0041',
			queryChild : '/nonfinanceService/BSS.IQ.01.0042',
			adjust: '/cardService/ISS.RT.42.0001'
		},
		// 账户周期金融信息
		accCycleFiciList : {
			query : '/nonfinanceService/BSS.IQ.01.0045'
		},
		// 客户财务信息
		cstCprsvInfEnqr : {
			query : '/json/cstSvc/cstCprsvInfEnqr/cstCprsvInfEnqr.json',
			queryTnAcList : '/json/cstSvc/cstCprsvInfEnqr/tnAcList.json',
			queryacBaList : '/json/cstSvc/cstCprsvInfEnqr/baList.json'
		},
		// 账户余额单元列表
		acbaUnitList : {
			query : '/nonfinanceService/BSS.IQ.01.0030',
			queryCurrency : '/nonfinanceService/COS.IQ.02.0012',
			queryBalance : '/authService/AUS.IQ.01.0004',
			queryBalance2 : '/nonfinanceService/ISS.IQ.01.0050',//新的账户余额汇总信息接口
		},
		// 客户定价标签查询
		cstPrcgLblEnqr : {
			query : '/nonfinanceService/BSS.IQ.01.0095',
			updatePrcDetail : '/nonfinanceService/BSS.UP.01.0030',
			queryPrcDetail : '/betaService/COS.IQ.02.0019',
			deleteDetail :'/nonfinanceService/BSS.UP.01.0031',
		},
		// 客户业务类型标签设置
		cstBsTypeLblSet : {
			queryPrcDetail : '/betaService/COS.IQ.02.0019',
			savePrcDetail : '/nonfinanceService/BSS.AD.01.0010',
		},
		// 媒介列表查询
		cstMediaList : {
			queryMedia : '/nonfinanceService/BSS.IQ.01.0007',
			queryProduct : '/nonfinanceService/BSS.IQ.01.0004',
			queryMediaBind : "/nonfinanceService/BSS.OP.01.0017",
			queryProductForm : "/nonfinanceService/BSS.IQ.01.0100",
			queryCoreProductObject : '/nonfinanceService/BSS.IQ.01.0004',// 查询产品对象信息
			// 非 gns环境
			submitMdmInfo : '/nonfinanceService/BSS.AD.01.0003',
			// gns 环境
//			submitMdmInfo : '/creditauditService/BSS.AD.01.0003',
			updateMedia : '/nonfinanceService/BSS.UP.01.0011',
			submitRlTmMkCrd : '/nonfinanceService/ISS.OP.01.0012',
			submitRlTmMkCrd1 : '/nonfinanceService/ISS.OP.01.0012',
			queryMediaMaj : '/nonfinanceService/BSS.IQ.01.0017', //媒介视图中 产品媒介
		},
		// 封锁码视图查询
		blockView : {
			queryExNo : '/nonfinanceService/BSS.OP.01.0016	',// 根据身份证号查询外部识别号
			queryCreNum : '/nonfinanceService/BSS.OP.01.0016',
			click : '',// 点击行查询
		},
		//客户产品 自动配号
		cstProductAuto: {
			querySupportMatche : '/nonfinanceService/BSS.IQ.01.0014',//查询产品是否支持自动配号
			querySegmentNum : '/betaService/COS.IQ.02.0059', //查询特殊段号
			queryCardNumber : '/betaService/COS.IQ.02.0060', //查询特殊号
		},
		// 生命周期概览
		lCOvew : {
			query : '/json/cstSvc/lCOvew/lCOvew.json',
			queryAccLC : '/json/cstSvc/lCOvew/AccLC.json',
			queryYTable : '/json/cstSvc/lCOvew/YTable.json',
			queryLCTable : '/json/cstSvc/lCOvew/LCTable.json',
			querySTable : '/json/cstSvc/lCOvew/STable.json'
		},
		// 客户信息建立
		cstInfBuild : {
			// sit 环境
//			 save : '/creditauditService/BSS.AD.01.0001',
			// 非GNS  环境
			save : '/nonfinanceService/BSS.AD.01.0001',
			saveAddr : '/nonfinanceService/BSS.AD.01.0004',
            saveVhe : '/nonfinanceService/BSS.AD.01.0134',
			queryAddr : '/nonfinanceService/BSS.IQ.01.0002',
			updateAddr : '/nonfinanceService/BSS.IQ.01.0002',
			saveRmk : '/nonfinanceService/CRD.AD.01.0007',
			queryRmk : '/nonfinanceService/CRD.IQ.01.0009',
			updateRmk : '/nonfinanceService/BSS.UP.01.0009',
			saveCstPrice : '/nonfinanceService/CRD.AD.01.0006',
			queryCstPrice : '/nonfinanceService/ISS.IQ.01.0008',
			updateCstPrice : '/nonfinanceService/CRD.AD.01.0008',
			queryIsIntBillDay: '/nonfinanceService/BSS.IQ.01.0016',//判断产品对应的业务项目是否需要输入账单日
			queryDpanMediaiObj: '/betaService/COS.IQ.02.0017',// dpan中查询媒介对象
			saveFeePro : '/nonfinanceService/BSS.AD.01.0006',//保存收费项目
			insertCstFeeItem : '/nonfinanceService/BSS.AD.01.0007',//保存收费项目
			queryHavedFeePro : '/nonfinanceService/COS.IQ.01.0085',//查询已有的收费项目
            saveContact : '/nonfinanceService/BSS.AD.01.0132',
            saveHouse : '/nonfinanceService/BSS.AD.01.0133',
		},
		// 客户信息查询及维护
		cstInfQuery : {
			queryInf : '/nonfinanceService/BSS.IQ.01.0001',//查询客户信息
			submitAll : '/nonfinanceService/BSS.UP.01.0001',
			queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
			queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
			queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
			queryCstList : '/nonfinanceService/BSS.IQ.01.0120',// 查询客户具体信息
			queryCstInfById:'/nonfinanceService/BSS.IQ.01.0121',//查询客户信息
			queryCstNo:'/nonfinanceService/BSS.IQ.01.0005',//查询客户号
		},
        // 客户车辆信息查询及维护
        cstVheQuery : {
            queryInf : '/nonfinanceService/BSS.IQ.01.0134',//查询客户车辆信息
            updateVhe : '/nonfinanceService/BSS.UP.01.0134',
            queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
        },
		//证件号码变更
		cstIdChange : {
			query:"/nonfinanceService/BSS.IQ.01.0120",
			update: '/nonfinanceService/BSS.UP.01.0014',
		},
		// 客户地址信息查询及维护
		cstAdrQuery : {
			queryInf : '/nonfinanceService/BSS.IQ.01.0002',
			updateAdr : '/nonfinanceService/BSS.UP.01.0002',
			queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
			queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
			queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
		},
        // 联络人信息查询及维护
        cstContactQuery : {
            queryInf : '/nonfinanceService/BSS.IQ.01.0132',
            updateContact : '/nonfinanceService/BSS.UP.01.0132',
            queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
        },
        // 客户房产信息查询及维护
        cstHouseQuery : {
            queryInf : '/nonfinanceService/BSS.IQ.01.0133',
            updateHouse : '/nonfinanceService/BSS.UP.01.0133',
            queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
        },
		// 客户级统一信息
		csrUnifyInf : {
			query : '/nonfinanceService/BSS.IQ.01.0015', // 产品线账单日查询
			queryProLineUnifyDate : '/nonfinanceService/CRD.IQ.01.0016' // 产品线统一日期查询
		},
		// 交易类活动日志查询
		txnCgyAvyLogEnqr : {
			query : '/nonfinanceService/CRD.OP.03.0004',
			revocationTxn : '/cardService/CRD.PT.23.0001',// 撤销
		},
		// 金融交易查询
		finacialTrans : {
			query : '/nonfinanceService/ISS.IQ.03.0010',
			returnedPurchase : '/cardService/ISS.RT.41.0001',
			returnedPurchase2 : '/cardService/ISS.RT.41.0002',
			returnedPurchase3 : '/cardService/ILS.RT.41.0001',
			transStage :  '/cardService/ILS.RT.40.0006',//交易分期AUS.IL.43.0002
			disputeRegist : '/cardService/ISS.RT.07.0001',//争议登记
			disputeReleaseCst: '/cardService/ISS.RT.05.0001', //争议释放利于客户
			disputeReleaseBank: '/cardService/ISS.RT.06.0001', //争议释放利于客户
			returnedPurchase4 : '/cardService/ILS.RT.41.0004',//分期撤销
			queryRelativeTransEvent : '/nonfinanceService/ISS.IQ.03.0110',
			accRepayAllocateOrder : '/authService/AUS.IQ.01.0003',//账户还款分配顺序
			balanceUnitAllocateOrder : '/nonfinanceService/BSS.IQ.01.0021',//余额单元分配顺序
			queryMainnAndChildAcc: '/nonfinanceService/BSS.IQ.03.0013',//查询主账户和子账户
			interestRelatedTrans: '/nonfinanceService/ISS.IQ.03.0110',//结息列表中关联交易
		},
		// 结售汇记录查询
		settleSaleRecord : {
			query : '/nonfinanceService/ISS.IQ.03.0011',
		},
		// 发生额节点交易查询
		occurrAmtTrans : {
			query : '/nonfinanceService/BSS.IQ.01.0050',
			queryInterestCtrlChain : '/nonfinanceService/BSS.IQ.01.0060',
			queryBla : '/nonfinanceService/ISS.IQ.03.0115'
		},
		// 客户费用免除信息查询
		cstFeeWaiveInf : {
			query : '/nonfinanceService/BSS.IQ.01.0065',
		},
		// 客户交易统计查询
		cstTransStatisticsInf : {
			query : '/nonfinanceService/BSS.IQ.03.0015',
		},
		// 账单查询
		billingInfoEnqr : {
			query : '/nonfinanceService/BSS.IQ.03.0003',//产品对象级别账单查询
			queryBsnisType: '/nonfinanceService/BSS.IQ.03.0004',//业务类型级别账单查询
			queryTradeDetal:'/nonfinanceService/BSS.IQ.03.0005',//交易历史查询
			queryBillAmt : '/nonfinanceService/ILS.IQ.01.0001',//获取可分期金额
			stageTrial: '/cardService/ILS.IQ.01.0005', // 分期试算CRD.AD.03.0003
			sureStage:'/cardService/ILS.RT.40.0005', //账单分期列表AUS.IS.43.0003
		},
		//信贷交易账户信息
		creditTradeAccount : {
			query : '/nonfinanceService/',//查询信贷交易账户
			queryDetail: '/nonfinanceService/' , //查询信贷交易账户明细
		},
		// 账户还款历史查询
		accRepyHistEnqr : {
			query : '/nonfinanceService/BSS.IQ.01.0055',
			revocationTxn : '/cardService/ISS.RT.27.0001',// 撤销
			tradallot : '/nonfinanceService/ISS.IQ.03.0012',//交易分配级查询
		},
		// 产品信息 pDInfEstb.query
		pDInfEstb : {
			query : '/betaService/COS.IQ.02.0013',
			queryProd: '/betaService/COS.IQ.02.0110',
		},
		// 账务基本信息
		accBscInf : {
			queryInterest : '/nonfinanceService/BSS.IQ.01.0075',//结息查询
			queryoccurrChain : '/nonfinanceService/BSS.IQ.01.0060',
			queryOccurrChainAmount : '/nonfinanceService/BSS.IQ.01.0050',
			queryRelatedPartyTransactions : '/nonfinanceService/BSS.IQ.01.0090',
			queryInterestCalculationDetailsTable : '/nonfinanceService/BSS.IQ.01.0080',
			query : '/nonfinanceService/BSS.IQ.01.0003',//利息累计，利息试算
			updateAcc : '/nonfinanceService/BSS.UP.01.0009',
			query2 : '/nonfinanceService/BSS.IQ.01.0113',//账户金融查询查询账户信息  换事件编号
			queryRevoleAccList: '/nonfinanceService/BSS.IQ.01.0113',//循环账户表查询
			queryOverdueAccList:'/nonfinanceService/BSS.IQ.01.0070',//溢缴款账户表查询
			queryTransAccList: '/nonfinanceService/ILS.IQ.01.0020',//交易账户主表查询
			queryDisputeAccList: '/nonfinanceService/ISS.IQ.01.0008',//争议账户表查询
			queryMainAndChildAccList : '/nonfinanceService/BSS.IQ.01.0118',//循环账户 主子账户查询
		},
		// 账户余额对象查询
		accBalObj : {
			query : '/nonfinanceService/BSS.IQ.01.0025',
			queryUniteRate: '/nonfinanceService/BSS.IQ.01.0068',//统一利率查询
			saveUniteRate: '/nonfinanceService/BSS.OP.01.0030',//保存统一利率
		},
		// 客户存款信息查询
		depositInf : {
			query : '/nonfinanceService/BSS.IQ.01.0070',
		},
		// 客户业务项目查询
		cstBsnisItem : {
			query : '/nonfinanceService/BSS.IQ.01.0020',
			update : '/nonfinanceService/BSS.UP.01.0025',
		},
		// 客户统一日期查询
		cstUnitDate : {
			query : '/nonfinanceService/BSS.IQ.01.0015',
		},
		//争议账户
		disputeAccount : {
			queryPoint : '/nonfinanceService/COS.IQ.02.0012',
			queryTransDate : '/nonfinanceService/COS.IQ.02.0006',
		},
		//本金借记交易补录
		principalDebitTrans: {
			queryTransSource : '/betaService/COS.IQ.02.0069',//查询交易来源
			queryTransOrgani : '/betaService/COS.IQ.02.0005',//查询交易机构
		},
		// ================================金融交易管理======================================
		fncTxnMgtTest : {
			triggerILSRT408001 : '/cardService/ILS.RT.40.8001', //主动全额提前结清
		},
		// ================================金融交易管理======================================
		fncTxnMgt : {
			trends:'',//动态配置
		},
		// ================================基础业务受理======================================
		//核算状态维护
		acctStatusMaint:{
			update:"/cardService/BSS.RT.01.0001",
		},
		//延滞冲减
		delayLag: {
			query: '/nonfinanceService/ISS.IQ.03.0015',
		},
		// 媒介激活查询
		baseBsnPcsg : {
			queryCstMdmInfTable : '/nonfinanceService/BSS.IQ.01.0007',
			activationMdm : '/nonfinanceService/BSS.OP.01.0004',
			queryCstProductInfo : '/nonfinanceService/BSS.OP.01.0004',
		},
		// 媒介挂失
		mediaLoss : {
			queryPro : "/nonfinanceService/ISS.OP.01.0001",// 弹窗查询产品对象
			queryNewMedia : "/nonfinanceService/ISS.OP.01.0001",// 查询新媒介
			queryMediaInfo : "/nonfinanceService/ISS.OP.01.0002",// 转卡媒介资料查询
			mediaLossSubmit : "/nonfinanceService/ISS.OP.01.0003",// 提交挂失
			queryMedaiBaseInf : "/nonfinanceService/BSS.IQ.01.0217",// 查询媒介基本信息
			queryIsLossFee : '/betaService/COS.IQ.02.0001 ',//查询是否收取挂失费
			queryNo : '/nonfinanceService/BSS.SP.01.9999 ',//查询是否收取挂失费
		},
		// 封锁码管理
		blockCodeMag : {
			query : '/betaService/COS.IQ.02.0023',
			queryBlock : '/betaService/COS.IQ.02.0085',
			searchBlock : '/nonfinanceService/COS.OP.01.0005',
			searchAct : '/nonfinanceService/BSS.IQ.01.0003',// A-业务类型
			searchPro : '/nonfinanceService/BSS.IQ.01.0012',// 搜索产品
			searchMedia : '/nonfinanceService/BSS.IQ.01.0013',// 搜索媒介
			eventNoQuery:'/betaService/COS.IQ.02.0085',//管控码的事件清单
			controlCode : '/betaService/COS.IQ.02.0050',//点击事件查询按钮调关联管控项目
			cusEffUp:'/nonfinanceService/customerEffectiveUpdate'//特别状况事件
		},
		// 去除封锁码
		deleteBlockCode : {
			query : '/nonfinanceService/BSS.IQ.01.0035',// 搜索所有封锁码
			queryEventNo: '/nonfinanceService/BSS.IQ.03.0011',
		},
		// 封锁码历史查询
		blockCodeHistory : {
			query : '/nonfinanceService/BSS.IQ.03.0002',
		},
		// 非金融维护历史查询
		nonFinanTenanceHist : {
			query : '/nonfinanceService/BSS.IQ.01.0009',
		},
		// 用户访问历史查询
		userAccessHist : {
			query : '/nonfinanceService/BSS.IQ.01.0010',
		},
		// 客户管控视图
		blockCodeControlView : {
			//queryCustomer : '/nonfinanceService/BSS.IQ.01.0001',
			query : '/nonfinanceService/BSS.OP.01.0010',
		},
		// 客户账户视图
		accountView : {
			queryMain : '/nonfinanceService/BSS.IQ.01.0118',
		},
		// 保存 客户产品单元新建
		cstProduct : {
			saveCstProduct : '/nonfinanceService/BSS.AD.01.0002',
			quereyProInf : '/nonfinanceService/BSS.IQ.01.0004',//查询客户已有产品
			saveProUint : '/nonfinanceService/BSS.UP.01.0010',
			queryProMaj : '/nonfinanceService/BSS.IQ.01.0114',//产品视图中 查询产品
			viewQueryCstBaseInf : '/nonfinanceService/BSS.IQ.01.0101',//客户视图中，查询客户基本信息
			lifting: '/nonfinanceService/ISS.OP.01.0006',//产品升降级
		},
		// 分期操作
		instalments : {
			query : '/nonfinanceService/ILS.IQ.01.0020',//查询分期交易账户====主账户
			queryChild : '/nonfinanceService/ILS.IQ.01.0025',//查询分期交易账户=======子账户
			queryPlan : '/nonfinanceService/ILS.IQ.01.0015',//查询还款计划
			earlySettle: '/cardService/ILS.RT.40.8001',//提前结清
			processInstal : '/cardService/ISS.PT.43.0001',
			earlyClearance : '/cardService/CRD.PT.40.0005',
			stageAjust: '/cardService/ILS.PT.61.0002', //分期调整
			normalRepayment:  '/cardService/ILS.RT.20.0011', //正常还款
			batchRepayment:  '/cardService/ILS.RT.20.0012', //提前还款
			overRepayment:  '/cardService/ILS.RT.20.0013', //逾期还款
			batchTrial:'/cardService/ILS.IQ.01.0008',   //批量提前还款试算
			overTrial:'/cardService/ILS.IQ.01.0007',   //批量逾期试算
			normalTrial:'/cardService/ILS.IQ.01.0012',   //批量正常试算
			revoke:'/cardService/ILS.RT.41.0002',   //撤销
			halfRepayment:'/cardService/ILS.RT.20.0014',   //提前部分还款
			queryCreditS2:'/nonfinanceService/ILS.IQ.01.0010',//信贷S2交易账户信息查询
			creditS2Payment:'/cardService/ILS.RT.20.0015',//信贷S2 信贷还款
			creditS2PaymentTrial:'/cardService/ILS.IQ.02.0012',   //信贷S2交易账户试算
			revokeS2Pay:'/cardService/ILS.RT.41.0003',   //S2撤销
			deferredTrail: '/cardService/ILS.IQ.01.0002', //延期分期试算
			deferredStage:'/cardService/ILS.RT.41.0005',   //延期分期
			pauseTrail:'/cardService/ILS.IQ.01.0003',   //暂停分期试算
			pauseStage:'/cardService/ILS.RT.41.0006',   //暂停分期
			queryLoanPayment:'/cardService/ILS.RT.10.0025', //贷款支付
		},
		// 信用卡分期操作
		instalmentsCard : {
			query : '/nonfinanceService/ILS.IQ.01.0020',//查询信用卡分期交易账户

		},
		// 修改账单日
		updateBillDay : {
			update : '/nonfinanceService/BSS.UP.01.0035',
			save : '/nonfinanceService/CRD.UP.01.0016',
		},
		// 毁损补发
		mediaDmgRsu : {
			save : '/nonfinanceService/ISS.OP.01.0014',
		},
		// 利息查询 试算
		interest : {
			query : '/nonfinanceService/CRD.IQ.03.0009',
			trail: "/nonfinanceService/BSS.IQ.01.0085",//利息试算
			changeEv: "/cardService/ISS.RT.13.1002",// 取现利息实时贷记调整事件
		},
		// 利息累计试算
		interestAccruedTrial : {
			trail: "/nonfinanceService/BSS.IQ.01.0105",//利息试算
		},
		// 争议账户信息
		disputeData : {
			query : '/nonfinanceService/ISS.IQ.01.0008',
		},

		// 媒介绑定
		mediaBind : {
			queryMdmInf : '/nonfinanceService/BSS.IQ.01.0007',
			saveBind : '/nonfinanceService/BSS.AD.01.0005'
		},
		// 媒介注销
		mediaCancel : {
			queryInf : '/nonfinanceService/BSS.IQ.01.0007',
			saveCanel : '/nonfinanceService/BSS.OP.01.0018',
		},
		// 产品注销
		proCancel : {
			saveCanel : '/nonfinanceService/BSS.OP.01.0019'// 产品注销
		},
		//关联套卡查询
		associatedCardQuery:{
			query: '/nonfinanceService/BSS.IQ.01.0115'
		},
		// 机构查询下拉框
		coreOrgan : {
			queryCoreOrgan : '/betaService/COS.IQ.02.0005',
		},
		//二次识别参数
		twoDisParams : {
			save : '/betaService/COS.AD.02.0037',
			query : '/betaService/COS.IQ.02.0043',
			update : '/betaService/COS.UP.02.0040',
			queryMode: '/betaService/COS.IQ.02.0043',
		},
		quickAskCard : {
			query: '/json/askInf.json',
			justChoosePro: '/json/askInf2.json'
		},
		//现金分期
		cashStage:{
			stageTrial: '/cardService/ILS.IQ.01.0005', // 分期试算
			sureStage : '/cardService/ILS.RT.40.0004',//现金分期
		},
		//专项分期
		balnStage:{
			stageTrial: '/cardService/ILS.IQ.01.0018', // 分期试算
			sureStage : '/cardService/ILS.RT.40.0003',//专项分期
		},
		//贷款试算
		loanTrail : {
			stageTrial: '/betaService/ILS.IQ.01.0006', // 分期试算
		},
		//VISA附加表信息查询
		visannexTabInf : {
			query: '/nonfinanceService/ISS.IQ.01.0180',
		},
		//MC附加表信息查询
		mcannexTabInf : {
			query: '/nonfinanceService/ISS.IQ.01.0185',
		},
		//清算历史表查询
		clearHitInf : {
			query: '/nonfinanceService/ISS.IQ.01.0190',
		},
		//VISA调单申请建立
		appVisa : {
			save : '/nonfinanceService/ISS.AD.01.0120',
			query: '/nonfinanceService/ISS.IQ.01.0160',
			update : '/nonfinanceService/ISS.IQ.01.0170',
		},
		//异常交易管理
		abnormalTrade : {
			query : '/nonfinanceService/BSS.IQ.03.0020', //查询
			update : '/nonfinanceService/BSS.UP.03.0020', // 修改
			deleteA: '/nonfinanceService/BSS.UP.03.0020', //删除
		},
		//户个性化元件
		cstComponents : {
			queryList: '/betaService/COS.IQ.02.0009', //查询所有元件
			queryHaved: '/nonfinanceService/BSS.IQ.01.0110', //查询客户已有元件
			update: '/nonfinanceService/BSS.UP.01.0040', //修改
			deleteCom: '/nonfinanceService/BSS.UP.01.0045', //删除
			save: '/nonfinanceService/BSS.AD.01.0020', //保存元件
		},
		//MC调单申请
		MCAppFormApply : {
			save: '/nonfinanceService/ISS.AD.01.0150', // MC调单申请建立
			query: '/nonfinanceService/ISS.IQ.01.0130', //MC调单申请查询
			update: '/nonfinanceService/ISS.IQ.01.0140', //MC调单申请维护
		},
		//VISA拒付管理建立
		protestVisa : {
			save : '/nonfinanceService/ISS.AD.01.0210', // Visa拒付建立
			query : '/nonfinanceService/ISS.IQ.01.0220', // Visa拒付查询
			update : '/nonfinanceService/ISS.UP.01.0230', // Visa拒付维护
		},
		//MC拒付管理建立
		protestMC : {
			save : '/nonfinanceService/ISS.AD.01.0240', // MC拒付建立
			query : '/nonfinanceService/ISS.IQ.01.0250', // MC拒付查询
			update : '/nonfinanceService/ISS.UP.01.0260', // MC拒付维护
		},
		//提前续卡
		advanceRenewCard: {
			save : '/nonfinanceService/ISS.OP.01.0004 ', // 前续卡
		},
		//未出账单
		 unsettledList: {
			 query : '/nonfinanceService/BSS.IQ.03.0006 ', // 未出账单
		},
		//查询客户定价视图
		cstPricingView: {
			 query : '/nonfinanceService/BSS.IQ.01.0096',
		},
		//费用信息管理
		 costInfMag: {
			 query : '/nonfinanceService/ISS.IQ.03.0010', // 费用信息查询
			 changeEv : '',//取现手续费实时贷调事件
		 },
		//溢缴款支取
		overPayDrawal: {
			 realTimeTransMoney : '/cardService/ISS.RT.80.0001',//实时溢缴款支取
		},
		// 资产证券化
		assetSecurities : {
			querySelect : '/nonfinanceService/BSS.IQ.01.0330',  //资产证券化资产选择  循环账户
			querySelectTrand : '/nonfinanceService/BSS.IQ.01.0335',  //资产证券化资产选择  交易账户BSS.IQ.01.0340
			queryChildTrand : '/nonfinanceService/BSS.IQ.01.0340',  //资产证券化资产选择  交易账户
			surePack : '/nonfinanceService/BSS.RT.02.0050',  //资产选择封包回购处理
			query : '/nonfinanceService/BSS.IQ.01.0300',  //资产证券化未封包查询
			queryPacket : '/nonfinanceService/BSS.RT.02.0001',//资产证券化封包
			queryAssignment : '/nonfinanceService/BSS.IQ.01.0305',//资产证券化未转让查询
			alreadyAssignmentList : '/nonfinanceService/BSS.RT.02.0002',//资产证券化转让
			queryBuyback :'/nonfinanceService/BSS.IQ.01.0310',//资产证券化未回购查询
			alreadyBuyback :'/nonfinanceService/BSS.RT.02.0003',//资产证券化回购
			queryABSPlan: '/betaService/COS.IQ.02.0180',//ABS计划查询
			addABSPlan: '/betaService/COS.IQ.02.1320',//ABS计划新增
			updateABSPlan: '/betaService/COS.IQ.02.1325',//ABS计划修改
			deleABSPlan: '/nonfinanceService/COS.IQ.02.4095',//ABS计划删除
			test:  '/cardService/COS.UP.02.0180',//ABS测试跑批
			queryABSList: '/nonfinanceService/BSS.IQ.01.0350',//资产证券化循环账户的查询
			queryTradingAccount:'/nonfinanceService/BSS.IQ.01.0355',//资产证券化交易账户的查询
			subAccount:'/nonfinanceService/BSS.IQ.01.0356',//资产证券化子账户
			detailsList: '/nonfinanceService/BSS.IQ.01.0346',//ABS子账
			logoMaintenanceQuery: '/nonfinanceService/BSS.UP.01.0019',//回购标志维护
		},
		accStatusMaint: {
			queryList : '/nonfinanceService/BSS.IQ.01.0160',//延滞状况
			queryMoney : '/nonfinanceService/BSS.IQ.01.0130',//查询费用，本金等
		},
		//统一日期修改
		unifiedEDateQuery: {
			queryList : '/nonfinanceService/BSS.UP.01.0050',//统一日期修改查询
			query:'/nonfinanceService/BSS.IQ.01.0018',
		},
		//贷款支付
		loanPayment: {
			query:'/nonfinanceService/ILS.IQ.01.0040',//查询
			queryList : '/nonfinanceService/ILS.IQ.01.0030',//查询详情
			queryPaymentInfo : '/nonfinanceService/ILS.IQ.01.0035',//贷款支付查询
			loanConfirmation : '/cardService/ILS.RT.10.0025'//贷款支付成功
		},
		//预制卡
		prefabricatedCard: {
			queryList: '/betaService/COS.IQ.02.0071',//查询
			update: '/betaService/COS.UP.02.0071',
		},
		//资金方信息管理
		partnersQuery: {
			queryList: '/betaService/FMS.IQ.04.0001',//查询
			queryAdd: '/betaService/FMS.AD.01.0001',//新增
			update: '/betaService/FMS.UP.01.0001',//修改
			querySel:'/betaService/COS.IQ.02.0037'//表内回购法人代码查询
		},
		//资金协议创建
		fundcreation: {
			queryList: '/betaService/FMS.IQ.05.0001',//查询
			queryAdd: '/betaService/FMS.AD.05.0001',//新增
			update: '/betaService/FMS.UP.05.0001',//修改
			details: '/betaService/FMS.IQ.05.0002',//详情
			querySon: '/betaService/FMS.IQ.05.0003',//详情
		},
		//产品额度节点
		productquota: {
			query: '/betaService/FMS.AD.05.0002',//确定修改
			details: '/betaService/FMS.IQ.05.0004'//
		},
        // 客户职业信息查询及维护
        cstProfessionQuery : {
            queryInf : '/nonfinanceService/BSS.IQ.01.0130',//查询
            queryAdd: '/nonfinanceService/BSS.AD.01.0130',//新增
            updateProfession : '/nonfinanceService/BSS.UP.01.0130',//修改
            queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
        },
        // 客户证件信息查询及维护
        cstCertificateQuery : {
            queryInf : '/nonfinanceService/BSS.IQ.01.0131',//查询
            queryAdd: '/nonfinanceService/BSS.AD.01.0131',//新增
            updateCertificate : '/nonfinanceService/BSS.UP.01.0131',//修改
            queryLev : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryAdr : '/json/cstSvc/cstMediaList/cstMediaList.json',
            queryRmk : '/json/cstSvc/cstMediaList/cstMediaList.json',
        }
	};
	module.exports = config;
});
