'use strict';
define(function(require, exports, module) {
	var config = {
		//事件清单
		evLstList : {
			query : '/betaService/COS.IQ.02.0001',//后台Mapper路径(/comCust/findComCustRating)
			queryEvRelAvy : '/betaService/COS.IQ.02.0002',
			updateEvent:'/betaService/COS.UP.02.0001',
			updateEventActRel:'/betaService/COS.UP.02.0002',
			queryBalanceObject: '/betaService/COS.IQ.02.0021',//查询余额对象下拉框
			queryFiniTrans : '/betaService/COS.IQ.02.0039',
		},
		//活动清单
		avyList : {
			query : '/betaService/COS.IQ.02.0003',
			queryEvLstList : '/betaService/COS.IQ.02.0002',
			queryActArtiRel : '/betaService/COS.IQ.02.0004',
			updateAct : '/betaService/COS.UP.02.0003',
			updateActArtiRel : '/betaService/COS.UP.02.0004',
			queryEventList : '/betaService/COS.IQ.02.0075',
			queryActivityList : '/betaService/COS.IQ.02.0070'
		},
		//构建清单
		elmList : {
			query : '/betaService/COS.IQ.02.0007',
			queryBaseRltvTable : '/betaService/COS.IQ.02.0008',
			queryOptRltv : '/betaService/COS.IQ.02.0009',
			queryPcdTable : '/betaService/COS.IQ.02.0010',
			updateArti:'/betaService/COS.UP.02.0007',
			updateArtiEleRel:'/betaService/COS.UP.02.0008'
		},
		//元件清单
		elementList : {
			save : '/betaService/COS.AD.02.0009',
			query : '/betaService/COS.IQ.02.0009',
			update : '/betaService/COS.UP.02.0009'
		},
		
		//pcd及pcd初始值
		pcdAndPcdInitValue : {
			save : '/betaService/COS.AD.02.0051',
			update : '/betaService/COS.UP.02.0052'
		},
		
		//事件配置管理
		eventConfig : {
			saveEvent : '/betaService/COS.AD.02.0001',
			saveEventActRel : '/betaService/COS.AD.02.0002'
		},
		//活动配置管理
		actConfig : {
			saveAct : '/betaService/COS.AD.02.0003',
			saveActArtiRel : '/betaService/COS.AD.02.0004',
			queryLifecycleNode: '/betaService/COS.IQ.02.0024'
		},
		//构件配置管理
		artifactConfig : {
			saveArti : '/betaService/COS.AD.02.0007',
			saveArtiEleRel : '/betaService/COS.AD.02.0008'
		},
		//序号清单
		serialList : {
			query : '/betaService/COS.IQ.02.0029'
		},
		
		//业务形态
		businessForm : {
			save : '/betaService/COS.AD.02.0030' ,
			query: '/betaService/COS.IQ.02.0035' ,
			update: '/betaService/COS.UP.02.0034'
		},
		//项目类型
		projectType : {
			influence: '/betaService/COS.IQ.02.0018' ,
			update: '/betaService/COS.UP.02.0035',
			bsquery: '/betaService/COS.IQ.02.0036',
		},
		
		//业务形态排除构件
		businessRemoveArtifact : {
			save : '/betaService/COS.AD.02.0031' ,
			query: '/betaService/COS.IQ.02.0036' ,
			update: '/betaService/COS.UP.02.0035',
			queryBsForm: '/betaService/COS.IQ.02.0035' ,//查询业务形态
		},
		
		//运营模式入账币种
		operatCurrency : {
			save : '/betaService/COS.AD.02.0029' ,
			query: '/betaService/COS.IQ.02.0034' ,
			update: '/betaService/COS.UP.02.0033',
			queryCurrency : '/betaService/COS.IQ.02.0012',//交易币种
		},
		//法人实体
		legalEntity : {
			save : '/betaService/COS.AD.02.0032' ,
			query: '/betaService/COS.IQ.02.0037' ,
			update: '/betaService/COS.UP.02.0036'
		},
		//系统单元
		systemUnit : {
			save : '/betaService/COS.AD.02.0033' ,
			query: '/betaService/COS.IQ.02.0038' ,
			update: '/betaService/COS.UP.02.0037'
		},
		//活动触发事件
		activityEvent : {
			save : '/betaService/COS.AD.02.0034' ,
			query: '/betaService/COS.IQ.02.0040' ,
			update: '/betaService/COS.UP.02.0038'
		},
		//节假日
		holiday : {
			save : '/betaService/COS.AD.02.0035' ,
			query: '/betaService/COS.IQ.02.0041' ,
			update: '/betaService/COS.UP.02.0039',
			deleteHoliday:'/betaService/COS.UP.02.0067'
		},
		
		
	};
	module.exports = config;
});