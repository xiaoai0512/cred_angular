'use strict';
define(function(require, exports, module) {
	var config = {
		//业务项目
		productLine : {
			save : '/betaService/COS.AD.02.0018',
			query : '/betaService/COS.IQ.02.0018',
			update : '/betaService/COS.UP.02.0018',
			queryMode : '/betaService/COS.IQ.02.0006',
			queryBin : '/betaService/COS.IQ.02.0011',
			influence : '/betaService/COS.IQ.02.0014',
			queryActis: '/betaService/COS.IQ.02.0036',//业务项目 查询项目类型排除构件
		},
		//业务项目范围
		productLineBusType : {
			save : '/betaService/COS.AD.02.0028',
			query : '/betaService/COS.IQ.02.0033',
			update : '/betaService/COS.UP.02.0032',
			queryBP: '/betaService/COS.IQ.02.0135',
			queryBalanceP: '/betaService/COS.IQ.02.0136'
		},
		//产品对象
		proObject : {
			save : '/betaService/COS.AD.02.0013',
			query : '/betaService/COS.IQ.02.0013',
			update : '/betaService/COS.UP.02.0013',
			queryBusScope : '/betaService/COS.IQ.02.0020',
			queryProBusScope : '/betaService/COS.IQ.02.0014',
		},
        //产品对象
        proHistory : {
            query : '/betaService/COS.IQ.02.0210',
        },
		//产品线业务范围
		proBusinessRange : {
			save : '/betaService/COS.AD.02.0014',
			query : '/betaService/COS.IQ.02.0014',
			update : '/betaService/COS.UP.02.0014'
		},
		//利率变更
		interestRate : {
			query : '/betaService/COS.IQ.02.0160',
			queryInterest : '/betaService/COS.IQ.02.0162',
			update : '/betaService/COS.AD.02.0160'
		},
		//运营模式
		operationMode: {
			save : '/betaService/COS.AD.02.0006',
			query : '/betaService/COS.IQ.02.0006',
			update : '/betaService/COS.UP.02.0006',
			queryMode: '/betaService/COS.IQ.02.0006',
		},

		//运营机构
		operationOrgan: {
			save : '/betaService/COS.AD.02.0005',
			query : '/betaService/COS.IQ.02.0005',
			update : '/betaService/COS.UP.02.0005'
		},

		//货币表
		currency: {
			save : '/betaService/COS.AD.02.0012',
			query : '/betaService/COS.IQ.02.0012',
			update : '/betaService/COS.UP.02.0012',
		},

		//汇率
		rate: {
			save : '/betaService/COS.AD.02.0022',
			query : '/betaService/COS.IQ.02.0022',
			update : '/betaService/COS.UP.02.0022',
		},

		//卡BIN
		cardBin: {
			save : '/betaService/COS.AD.02.0011',
			query : '/betaService/COS.IQ.02.0011',
			update : '/betaService/COS.UP.02.0011',
		},
		//媒介对象
		mediaObject : {
			save : '/betaService/COS.AD.02.0017',
			query : '/betaService/COS.IQ.02.0017',
			update : '/betaService/COS.UP.02.0017',
		},
		//余额对象
		balanceObject : {
			save : '/betaService/COS.AD.02.0021',
			query : '/betaService/COS.IQ.02.0021',
			update : '/betaService/COS.UP.02.0021',
		},
		//业务类型
		businessType : {
			save : '/betaService/COS.AD.02.0020',
			query : '/betaService/COS.IQ.02.0020',
			update : '/betaService/COS.UP.02.0020',
		},
		//交易识别
		transIdenty : {
			save : '/betaService/COS.AD.02.0038',
			query : '/betaService/COS.IQ.02.0044',
			update : '/betaService/COS.UP.02.0041',
		},
		//构件实例
		artifactExample : {
			save : '/betaService/COS.AD.02.0015',
			query : '/betaService/COS.IQ.02.0015',
			update : '/betaService/COS.UP.02.0015',
			deleteArtifact : '/betaService/COS.UP.02.0026',
			queryArtifactNo: '/betaService/COS.IQ.02.0007',
			queryElementNo: '/betaService/COS.IQ.02.0009',
			queryBusinessType: '/betaService/COS.IQ.02.0020',
			querySelectArtifact: '/betaService/COS.IQ.02.0042',
			saveMore : '/betaService/COS.AD.02.0036',
			query282 : '/betaService/COS.IQ.02.0061',
			updateArtifactInstan : '/betaService/COS.UP.02.0068',
			addDistributOrder:'/betaService/COS.AD.02.0165',

		},
		//核算状态
		accountState : {
			query : '/betaService/COS.IQ.02.0051',
		},
		//延滞层级
		delv : {
			query : '/json/delvState.json',
		},
		//延滞状况
		delayState : {
			query : '/json/delayState.json',
		},
		//元件编号
		elementDimen : {
			query : '/json/elementDimen.json',
		},
		//pcd实例
		pcdExample : {
			save : '/betaService/COS.AD.02.0016',
			query : '/betaService/COS.IQ.02.0016',
			update : '/betaService/COS.UP.02.0016',
			queryDiff :'/betaService/COS.IQ.02.0065',
			pcdDiff :'/betaService/COS.IQ.02.0068',
		},
		//pcd差异实例
		pcdDifExample : {
			save : '/betaService/COS.AD.02.0025',
			query : '/betaService/COS.IQ.02.0030',
			update : '/betaService/COS.UP.02.0027',
		},
		//封锁码
		blockCode : {
			save : '/betaService/COS.AD.02.0023',
			query : '/betaService/COS.IQ.02.0023',
			update : '/betaService/COS.UP.02.0023',
			queryRelateControlItem : '/betaService/COS.IQ.02.0050',
		},
		//定价标签
		priceLabel : {
			save : '/betaService/COS.AD.02.0019',
			query : '/betaService/COS.IQ.02.0019',
			update : '/betaService/COS.UP.02.0019',
		},
		//生命周期节点
		lifeCycleNode : {
			save : '/betaService/COS.AD.02.0024',
			query : '/betaService/COS.IQ.02.0024',
			update : '/betaService/COS.UP.02.0024',
		},

		//pcd
		pcd : {
			save : '/betaService/COS.AD.02.0010',
			query : '/betaService/COS.IQ.02.0010',
			update : '/betaService/COS.UP.02.0010',
		},

		//收费项目
		feeProject : {
			save : '/betaService/COS.AD.02.0026',
			query : '/betaService/COS.IQ.02.0031',
			update : '/betaService/COS.UP.02.0029',
			relatedProObjQuery: '/betaService/COS.IQ.02.0151',//产品对象关联收费项目代码查询事件
			relatedProObjUpdate: '/betaService/COS.UP.02.0050',//产品对象关联收费项目代码维护事件
		},
		//收费项目实例
		feeProExample : {
			save : '/betaService/COS.AD.02.0027',
			query : '/betaService/COS.IQ.02.0032',
			update : '/betaService/COS.UP.02.0030',
			delelte :'/betaService/COS.UP.02.0031',
			queryPrice :'/betaService/COS.IQ.02.0067',
		},

		//渠道
		channel : {
			query : '/json/channels.json',
		},
		//期数
		term : {
			query : '/json/terms.json',
		},
		//分期类型
		stageType : {
			query : '/json/stageType.json',
		},
		//费用收取方式
		feeType : {
			query : '/json/feeType.json',
		},
		//授权场景
		authScene : {
			query : '/betaService/AUS.PM.01.0002',
		},
		//额度节点
		quotaNode : {
			query : '/betaService/LMS.PM.01.0002',
		},

		//查询法人实体下的用户
		corporateUser : {
			query : '/betaService/BSS.IQ.01.0011',
		},

		//预留号规则
		resNumber : {
			save : '/betaService/COS.AD.02.0039',
			query : '/betaService/COS.IQ.02.0045',
			update : '/betaService/COS.UP.02.0042',
		},

		//预留特殊卡号卡量表查询
		resSpecialNumber : {
			save : '/betaService/COS.AD.02.0050',//预留特殊号码新增
			query : '/betaService/COS.IQ.02.0056',//预留特殊号码查询
			update : '/betaService/COS.UP.02.0051',//预留特殊号码维护
		},
		//预留特殊卡号查询
		resSpecialCard : {
			query : '/betaService/COS.IQ.02.0057',//预留特殊号码查询
			update : '/betaService/COS.UP.02.0085',//预留特殊号码维护
		},


		//预留号规则查询
		resSpecialNoRule : {
			save : '/betaService/COS.AD.02.0039',//预留号规则新增
			query : '/betaService/COS.IQ.02.0045',//预留号规则查询
			update : '/betaService/COS.UP.02.0042',//预留号规则维护
			queryInfo : '/betaService/COS.IQ.02.0058',//查询预留号规则下的号码
			queryUpdate : '/betaService/COS.UP.02.0042',//维护预留号规则下的特殊号码
		},


		//pcd初始值
		pcdDefValue : {
			save : '/betaService/COS.AD.02.0040',
			query : '/betaService/COS.IQ.02.0046',
			update : '/betaService/COS.UP.02.0043',
		},

		//管控项目
		controlProject : {
			save : '/betaService/COS.AD.02.0041',
			query : '/betaService/COS.IQ.02.0047',
			update : '/betaService/COS.UP.02.0044',
		},

		//限制清单
		limitList : {
			save : '/betaService/COS.AD.02.0042',
			query : '/betaService/COS.IQ.02.0048',
			update : '/betaService/COS.UP.02.0045',
		},

		//用户查询
		userList : {
			query : '/betaService/COS.CS.01.0010',
		},

		//核算状态管理
		accountingStatus : {
			save : '/betaService/COS.AD.02.0043',
			query : '/betaService/COS.IQ.02.0051',
			update : '/betaService/COS.UP.02.0046',
		},


		//业务识别
		busTypeTransIden : {
			save : '/betaService/COS.AD.02.0044',
			query : '/betaService/COS.IQ.02.0052',
			update : '/betaService/COS.UP.02.0047',
		},

		//核算管理
		accountingMag: {
			saveAccTypeDefy : '/betaService/COS.AD.02.0060',//保存核算类型定义
			queryAccTypeDefy : '/betaService/COS.IQ.02.0066',//查询核算类型定义
			updateAccTypeDefy : '/betaService/COS.UP.02.0053',//维护核算类型定义
			deleteAccTypeDefy: '/betaService/COS.UP.02.0060', //删除核算类型定义

			saveAccTypeMapIntans : '/betaService/COS.AD.02.0061',//新建核算类型映射维度实例化
			queryAccTypeMapIntans : '/betaService/COS.IQ.02.0062',//核算类型映射维度实例化查询
			updateAccTypeMapIntans : '/betaService/COS.UP.02.0054',//核算类型映射维度实例化维护
			deleteAccTypeMapIntans: '/betaService/COS.UP.02.0066', //删除核算类型映射维度实例化维护

			saveAccRuleMaster : '/betaService/COS.AD.02.0062',//保存记账规则主表
			queryAccRuleMaster : '/betaService/COS.IQ.02.0115',//查询记账规则主表
			updateAccRuleMaster : '/betaService/COS.UP.02.0100',//维护记账规则主表
			deleteAccRuleMaster: '/betaService/COS.UP.02.0061', //删除记账规则

			saveAccRuleSubSubject : '/betaService/COS.AD.02.0105',//保存记账规则子表-科目类
			queryAccRuleSubSubject : '/betaService/COS.IQ.02.0120',//查询记账规则子表-科目类
			updateAccRuleSubSubject : '/betaService/COS.UP.02.0105',//维护记账规则子表-科目类
			deleteAccRuleSubSubject: '/betaService/COS.UP.02.0063', //删除记账规则子表-科目类

			saveAccRuleSubInterAccount : '/betaService/COS.AD.02.0085',//保存记账规则子表（内部帐类）
			queryAccRuleSubInterAccount : '/betaService/COS.IQ.02.0080',//查询记账规则子表（内部帐类）
			updateAccRuleSubInterAccount : '/betaService/COS.UP.02.0090',//维护记账规则子表（内部帐类）
			deleteAccRuleSubInterAccount: '/betaService/COS.UP.02.0062', //删除记账规则子表（内部帐类）

			saveAccMainScene : '/betaService/COS.AD.02.0066',//保存核算主场景表
			queryAccMainScene : '/betaService/COS.IQ.02.0063',//查询核算主场景表
			updateAccMainScene : '/betaService/COS.UP.02.0055',//维护核算主场景表
			deleteAccMainScene: '/betaService/COS.UP.02.0064', //删除核算主场景表

			saveAccSubScene : '/betaService/COS.AD.02.0100',//保存核算子场景表
			queryAccSubScene : '/betaService/COS.IQ.02.0095',//查询核算子场景表
			updateAccSubScene : '/betaService/COS.UP.02.0095',//维护核算子场景表
			deleteAccSubScene: '/betaService/COS.UP.02.0065', //删除核算子场景表

			queryAccProcesse : '/nonfinanceService/COS.IQ.01.0014',//查询核算处理查询

			saveBindAccScene : '/betaService/COS.AD.02.0170',//保存绑定核算场景
			queryBindAccScene : '/betaService/COS.IQ.02.0170',//查询绑定核算场景
			updateBindAccScene : '/betaService/COS.UP.02.0170',//维护绑定核算场景
			deleteBindAccScene: '/betaService/COS.UP.02.0170', //删除绑定核算场景
			queryAccEvent: '/betaService/COS.IQ.02.0001', //查询核算事件
		},

		//特别状况事件
		specialSitEvent : {
			queryEvent:'/betaService/COS.IQ.02.0140',//查询事件
			saveEvent: '/betaService/COS.AD.02.0140',//保存
		},
		//下拉框查询
		dropDownBox :{
			query :'/betaService/COS.IQ.02.0150',//查询下拉框事件
		},
		//交易来源
		tradingSourceInterface :{
			query:'/betaService/COS.IQ.02.0069',//交易来源列表
			addQuery :'/betaService/COS.AD.02.0166',//新增交易来源
			update:'/betaService/COS.UP.02.0152',//修改交易来源
			deleteInfo: '/betaService/COS.UP.02.0153' //删除交易来源
		},
		//来源目录
		SourceDirectoryEvent :{
			query:'/betaService/COS.IQ.02.0072',//来源目录列表
			addQuery :'/betaService/COS.AD.02.0169',//新增来源来源目录
			update:'/betaService/COS.UP.02.0155',//修改来源目录
			deleteInfo: '/betaService/COS.UP.02.0156' //删除来源目录
		},
        //维护历史
        nonBetaHist :{
            query:'/betaService/COS.IQ.02.0200',//维护历史列表
            addQuery :'/betaService/COS.AD.02.0200',//新增维护历史
            update:'/betaService/COS.UP.02.0200',//修改维护历史
        },
		//预制卡
		prefabCard :{
			query:'/betaService/COS.IQ.02.0163',//预制卡列表
			save :'/betaService/COS.AD.02.0167',//新增预制卡
			update:'/betaService/COS.UP.02.0154',//修改预制卡
		},
		//卡号池请求
		cardNoPoolAskList : {
			query:'/betaService/COS.IQ.02.0121',//卡号池请求列表
			save :'/betaService/COS.AD.02.0106',//新增卡号池请求
			update:'/betaService/COS.UP.02.0106',//修改卡号池请求
		},
		//技术参数
		technicalParams :{
			query:'/betaService/COS.IQ.02.0078',//技术参数列表
		},
		//分期类型参数
		stagTypePara :{
			query:'/betaService/COS.IQ.02.0175',//分期类型参数列表
			save:'/betaService/COS.AD.02.0175',//新建
			update:'/betaService/COS.UP.02.0175',//修改
			queryEvent: '/betaService/COS.IQ.02.0001',//查询事件
		},


	};
	module.exports = config;
});
