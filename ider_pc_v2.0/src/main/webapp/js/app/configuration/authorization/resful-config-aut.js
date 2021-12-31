'use strict';
define(function(require, exports, module) {
	var config = {
		//客户管理
		cusInfo:{
			cusQuery : '/authService/AUS.IQ.01.0001', // 01 客户信息查询
			cardQuery : '/authService/AUS.IQ.01.0002', // 02 媒介信息查询
			query : '/authService/LMS.IQ.01.0001', // 额度查询
			rltmQuery : '/authService/AUS.IQ.01.0004',  //余额查询
			queryHistory : '/authService/LMS.IQ.01.0010',  //客户额度历史查询
			quotaTrad : '/authService/AUS.IQ.01.0005',   //交易累计查询
			quotaHistory:'/authService/AUS.IQ.01.0006',//交易累计历史查询
			setDensityFree:'/authService/AUS.OP.01.0008',//消费设置免密金额
			setPass : '/authService/AUS.OP.01.0007', // 客户设置密码
			queryTree : '/authService/LMS.IQ.01.0006' // 客户额度网查询
		},
		//发卡例外名单查询
		listManage : {
			query : '/authService/AUS.IQ.01.0007',
		},
		//授权欺诈名单查询
		fraudManage : {
			query : '/authService/AUS.IQ.01.0009',
			add:'/authService/AUS.OP.01.0006',
			update:'/authService/AUS.OP.01.0005'
		},
		//授权例外名单查询
		exceptionManage : {
			query : '/authService/AUS.IQ.01.0008',
			addexceV : '/authService/AUS.OP.01.0001',
			addexceM : '/authService/AUS.OP.01.0002'
		},
		//授权例外清单管理
		exceptionList : {
			query : '/betaService/AUS.PM.02.0212',
			add : '/betaService/AUS.PM.02.0211',
			update : '/betaService/AUS.PM.02.0213'
		},
		//当日交易查询
		tradingNowList : {
			query : '/authService/AUS.IQ.02.0001',
			force : '/authService/AUS.OP.02.0002',   //强制授权
			rvTrans : '/authService/AUS.OP.02.0003'   //冲正
		},
		//历史交易查询
		tradingHistoryList : {
			query : '/authService/AUS.IQ.02.0002'
		},
		//额度历史交易
		creditHistory : {
			query:'/authService/AUS.IQ.02.0005'
		},
		//异常交易日志
		activityNowList:{
			query:'/authService/AUS.IQ.02.0007'//异常交易查询
		},
		//异常交易日志
		activityHistoryList:{
			query:'/authService/AUS.IQ.02.0008'//异常交易查询
		},
		// 授权交易录入
		addEntry: {
			save: '/authService/AUS.OP.02.0001',
			aginQuery: '/authService/AUS.IQ.02.0010',   //异常交易查询
			aginSave: '/authService/AUS.OP.02.0010',   //授权交易重新录入
		},
		principalDebitTrans: {
			queryTransSource : '/betaService/COS.IQ.02.0069',//查询交易来源
			queryTransOrgani : '/betaService/COS.IQ.02.0005',//查询交易机构
		},
		//未达授权查询
		authNoList : {
			query : '/authService/AUS.IQ.02.0003'
		},
		//交易累计查询
		quotaQuery : {
			quotaQuery : '/authService/AUS.IQ.01.0005'
		},
		//实时余额查询
		rltmBalEnqr : {
			query : '/authService/AUS.IQ.01.0004'
		},
		// 额度授信调额
		quota : {
			credit : '/authService/LMS.OP.01.0001', // 额度授信
			creditCurrency : '/authService/LMS.IQ.01.0020', //授信币种
			creditNodeList : '/authService/LMS.IQ.01.0021',//授信/调额节点列表
			adjustCustomer : '/authService/LMS.OP.01.0002' // 客户额度调整
		},
		//管控场景识别表建立
		controlAdd : {
			save: '/betaService/AUS.PM.02.0001'
		},
		//管控场景识别表查询及维护
		controlQuery : {
			query : '/betaService/AUS.PM.02.0002',   //查询列表
			updateCon:'/betaService/AUS.PM.02.0003'   //维护交易管控
		},
		//差异化管控表管理
		diffQueryb : {
			save: '/betaService/AUS.PM.02.0101',  //新增  ===差异化管控表建立
			query : '/betaService/AUS.PM.02.0102',   //查询列表
			updateDiffPage:'/betaService/AUS.PM.02.0103'   //维护交易管控差异化
		},
		//管控清单
		contrlCont:{
			save:'/betaService/AUS.PM.02.0221',//管控清单建立
			query:'/betaService/AUS.PM.02.0222',//管控清单查询
			update:'/betaService/AUS.PM.02.0223'//管控清单维护
		},
		//副卡限制
		supplyControl:{
			update:'/authService/AUS.OP.01.0009'
		},
		// 正负面清单管理
		negativeSaveb : {
			save :  '/betaService/AUS.PM.02.0201',
			query :  '/betaService/AUS.PM.02.0202',
			update :  '/betaService/AUS.PM.02.0203',
		},
		//交易限制查询及维护
		limitQueryb : {
			save: '/betaService/AUS.PM.02.0301',//建立
			queryList : '/betaService/AUS.PM.02.0302',   //交易限制查询
			updatelimit:'/betaService/AUS.PM.02.0303'   //维护交易限制
		},
		//清单限制查询及维护
		listQueryb : {
			queryList : '/betaService/AUS.PM.02.0312',   //清单限制查询
			updatelimit:'/betaService/AUS.PM.02.0313',   //维护清单限制
			save: '/betaService/AUS.PM.02.0311'   //新增清单限制
		},
		//差异化管控表管理
		diffQuerya : {
			save: '/authService/AUS.PM.02.0106',  //新增  ===差异化管控表建立
			query : '/authService/AUS.PM.02.0107',   //查询列表
			updateDiffPage:'/authService/AUS.PM.02.0108'   //维护交易管控差异化
		},
		// 正负面清单管理
		negativeSavea : {
			save :  '/authService/AUS.PM.02.0206',
			query :  '/authService/AUS.PM.02.0207',
			update :  '/authService/AUS.PM.02.0208',
		},
		//交易限制查询及维护
		limitQuerya : {
			save: '/authService/AUS.PM.02.0306',//建立
			queryList : '/authService/AUS.PM.02.0307',   //交易限制查询
			updatelimit:'/authService/AUS.PM.02.0308'   //维护交易限制
		},
		//清单限制查询及维护
		listQuerya : {
			queryList : '/authService/AUS.PM.02.0317',   //清单限制查询
			updatelimit:'/authService/AUS.PM.02.0318',   //维护清单限制
			save: '/authService/AUS.PM.02.0316'   //新增清单限制
		},
		//交易模式
		tradModel : {
			save :  '/betaService/AUS.PM.01.0201',
			query :  '/betaService/AUS.PM.01.0202',
			update :  '/betaService/AUS.PM.01.0203'
		},
		//交易场景
		tradScenario : {
			save :  '/betaService/AUS.PM.01.0017',
			query :  '/betaService/AUS.PM.01.0015',
			update :  '/betaService/AUS.PM.01.0016'
		},
		// 授权场景查询及维护
		scenario : {
			scenarioQuery :  '/betaService/AUS.PM.01.0002',    //授权场景查询
			identifyQuery :  '/betaService/AUS.PM.01.0102',  //授权场景识别码查询
			//tradingCode: '/betaService/AUS.PM.01.0010', //交易识别代码 =====走beta交易识别代码查询
			preScenarioQuery:'/authService/AUS.IQ.02.0004'//预授权查询
		},
		// 授权场景建立
		scesave : {
			scenarioSave :  '/betaService/AUS.PM.01.0001',//授权场景建立
			scenarioUpdate :  '/betaService/AUS.PM.01.0003',//修改授权场景
			identifySave :  '/betaService/AUS.PM.01.0101',//建立授权场景识别码
			identifyUpdate :  '/betaService/AUS.PM.01.0103'//修改授权场景识别码

		},
		//额度树管理
		quotatree : {
			query : '/betaService/LMS.PM.01.0022', // 展示额度树
			addTree:'/betaService/LMS.PM.01.0021',  //额度树建立
			queryTree: '/betaService/LMS.PM.01.0024',    // 查询所有额度树
			updateTree:'/betaService/LMS.PM.01.0023',
			queryList: '/betaService/LMS.PM.01.0002',    // 额度节点查询
			save: '/betaService/LMS.PM.01.0001',   // 额度节点建立
			update: '/betaService/LMS.PM.01.0003',    // 额度节点维护
			del: '/betaService/LMS.PM.01.0004',    // 额度节点删除
			proPQuery : '/betaService/COS.IQ.02.0013',   //产品对象下拉框
			businessPQuery : '/betaService/COS.IQ.02.0020',  //业务类型下拉框
			linesproQuery : '/betaService/LMS.PM.01.0012',   //额度节点产品映射查询
			linesproAdd : '/betaService/LMS.PM.01.0011',   //额度节点产品映射建立
			linesproDel : '/betaService/LMS.PM.01.0014',   //额度节点产品映射删除
			linesproUpdate : '/betaService/LMS.PM.01.0013', //额度节点产品映射维护
			linesproUpd: '/betaService/LMS.PM.01.0017',//额度节点产品新增维护
			creditMeshAdd: '/betaService/LMS.PM.01.0006',//节点额度网建立
			creditMeshQuery: '/betaService/LMS.PM.01.0007',//节点额度网查询
			creditMeshUpdate: '/betaService/LMS.PM.01.0008',//节点额度网维护
			creditMeshDel: '/betaService/LMS.PM.01.0009',//节点额度网删除
			identifyList:'/betaService/LMS.PM.01.0016'//交易识别查询
		},
		//VISA参数查询及维护
		network : {
			updateNetworkV : '/authService/AUS.PM.10.0001', // VISA网络查询   执行走auth
			updateNetworkM : '/authService/AUS.PM.10.0101', // VISA网络查询
			updateNetworkC : '/authService/AUS.PM.10.0201', // VISA网络查询
			updateNetworkJ : '/authService/AUS.PM.10.0301', // VISA网络查询
			parameterSelV : '/betaService/AUS.PM.10.0002', // VISA参数维护
			parameterSelM : '/betaService/AUS.PM.10.0102', // VISA参数维护
			parameterSelC : '/betaService/AUS.PM.10.0202', // VISA参数维护
			parameterSelJ : '/betaService/AUS.PM.10.0302', // VISA参数维护
			parameterUpdateV : '/betaService/AUS.PM.10.0003', // VISA参数维护
			parameterUpdateM : '/betaService/AUS.PM.10.0103', // VISA参数维护
			parameterUpdateC : '/betaService/AUS.PM.10.0203', // VISA参数维护
			parameterUpdateJ : '/betaService/AUS.PM.10.0303',// VISA参数维护
			updateStatus:'/betaService/AUS.PM.30.0003',//网络连接状态维护
			parameterSelStatus:'/betaService/AUS.PM.30.0002',//网络连接状态查询
			addStatus:'/betaService/AUS.PM.30.0001',//网络连接状态新增
			queryV:'/gwVisa/gw.vi.00.0000',//访问VISA
		    queryM:'/gwMc/gw.mc.00.0000',//访问MC
		    queryC:'/gwCups/gw.cu.00.0000',//访问银联
		    queryJ:'/gwJcb/gw.jc.00.0000'//访问JCB
		},

		// 加密机参数管理
		encryption : {
			query :'/betaService/AUS.PM.20.0002',//加密机参数列表查询
			save :'/betaService/AUS.PM.20.0001',//加密机参数新增
			update :'/betaService/AUS.PM.20.0003'//加密机参数维护
		},
		// 密钥管理
		keymanage : {
			query :'/betaService/AUS.PM.20.0102',//加密机参数列表查询
			save :'/betaService/AUS.PM.20.0101',//加密机参数新增
			update :'/betaService/AUS.PM.20.0103'//加密机参数维护
		},
		// 授权响应码
		authmanage : {
			query :'/betaService/AUS.PM.01.0011',//授权响应码查询
			save :'/betaService/AUS.PM.01.0014',//授权响应码新增
			update :'/betaService/AUS.PM.01.0013'//授权响应码维护
		},
		//营销管理
		marketing:{
			queryScenceDistin:'/betaService/AUS.PM.04.0002',//营销场景识别表查询
			saveScenceDistin:'/betaService/AUS.PM.04.0001',//营销场景识别表建立
			updateScenceDistin:'/betaService/AUS.PM.04.0003',//营销场景识别表维护
			saveList:'/betaService/AUS.PM.04.0201',//营销清单表建立
			queryList:'/betaService/AUS.PM.04.0202',//营销清单查询
			updateList:'/betaService/AUS.PM.04.0203',//营销清单维护
			queryRule :'/betaService/AUS.PM.04.0102',//营销规则查询
			saveRule :'/betaService/AUS.PM.04.0101',//营销规则新增
			updateRule :'/betaService/AUS.PM.04.0103'//营销规则维护
		},
		//媒介可用额度查询
		quotaAvailable:{
			query:'/authService/LMS.IQ.01.0005'  //可用额度查询
		},
		//授权错误码
		errorCodeList : {
			save: '/betaService/AUS.PM.01.0023',//新增
			update: '/betaService/AUS.PM.01.0022',//修改
			query: '/betaService/AUS.PM.01.0021',//查询
		},
		//内外部授权响应
		responseRel:{
			query:'/betaService/AUS.PM.01.0024',//查询
			update:'/betaService/AUS.PM.01.0025'//修改
		}
	};
	module.exports = config;
});
