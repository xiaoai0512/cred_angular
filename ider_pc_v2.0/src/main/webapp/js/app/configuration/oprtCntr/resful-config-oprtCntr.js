'use strict';
define(function(require, exports, module) {
	var config = {
		//余额对象列表
		balObjList : {
			query : '/nonfinanceService/COS.IQ.02.0021',
			queryelmListList : '/nonfinanceService/COS.IQ.02.0015',
			queryelmAllInfoList : '/nonfinanceService/CRD.IQ.01.0016',
			queryArtAllInfoList : '/nonfinanceService/COS.IQ.02.0032',
			updatePcd : '/nonfinanceService/COS.UP.02.0016',
			updateBalance : '/nonfinanceService/COS.UP.02.0021',
			queryEle: '/nonfinanceService/COS.IQ.02.0009',//可选元件
			queryArtifactList : '/nonfinanceService/COS.IQ.02.0007',//余额对象构件
			queryPcd : '/nonfinanceService/COS.IQ.02.0010',//元件pcd
			addPcd : '/nonfinanceService/COS.AD.02.0016',//对象pcd
			delPcd : '/nonfinanceService/CRD.DL.02.0001',//对象pcd
		},
		//封锁码场景查询
		blockCDScnMgt : {
			elmBasePtsEnqr : '/nonfinanceService/COS.IQ.02.0008',														//构件基础元件查询
			addBlockCode : '/nonfinanceService/COS.AD.02.0023',															//新增封锁码
			query : '/nonfinanceService/COS.IQ.02.0023',
			queryElmList : '/nonfinanceService/COS.IQ.02.0024',
			queryNoObjPcd : '/nonfinanceService/COS.IQ.02.0025',
			updatelockCDScnMgt : '/nonfinanceService/COS.UP.02.0023',
			updateNoObjPcd : '/nonfinanceService/COS.UP.02.0025',
			updateNoObjAri: '/nonfinanceService/COS.UP.02.0024',
			queryArtEle: '/nonfinanceService/COS.IQ.02.0008'
		},
		//业务形态管理
		busPatMan : {
			query : '/nonfinanceService/COS.IQ.02.0018',
			update : '/nonfinanceService/COS.UP.02.0018',
			queryManageList : '/nonfinanceService/COS.IQ.02.0019',
			saveBusPatMan: '/nonfinanceService/COS.AD.02.0019',
			updateBusinessTypeRel : '/nonfinanceService/COS.UP.02.0019',
			queryArtEle: '/nonfinanceService/COS.IQ.02.0008',//可选元件
			queryEle: '/nonfinanceService/COS.IQ.02.0009',//可选元件
		},
		//产品对象管理
		productObj : {
			query : '/nonfinanceService/COS.IQ.02.0013',
			queryDif: '/nonfinanceService/COS.IQ.02.0016',//差异化表
			updateDif: '/nonfinanceService/COS.UP.02.0016',//差异化表修改对象pcd实例
			updateProduct : '/nonfinanceService/COS.UP.02.0013',//修改产品对象
			updateProductArt : '/nonfinanceService/COS.UP.02.0015',//修改产品对象构件
			AddProductArt : '/nonfinanceService/COS.AD.02.0015',//新增产品对象构件
			
		},
		//产品业务范围管理
		productBusinessScope : {
			query : '/nonfinanceService/COS.IQ.02.0014',
		},
		//业务类型管理
		bsnTpMgt : {
			query : '/nonfinanceService/COS.IQ.02.0020',
			updateObjAri : '/nonfinanceService/COS.UP.02.0015',
			queryEle: '/nonfinanceService/COS.IQ.02.0009',//可选元件
			update : '/nonfinanceService/COS.UP.02.0020',
		},
		//媒介对象列表
		mediaObj : {
			query : '/nonfinanceService/COS.IQ.02.0017'
			
		},
		/*//非对象管理 
		nonObj : {
			query : '/nonfinanceService/COS.IQ.02.0024',
			queryelmAllInfoList : '/nonfinanceService/COS.IQ.02.0025',
			updatePcd : '/nonfinanceService/COS.UP.02.0025'
		},*/
		//活动余额对象定位
		actiBalaPosition : {
			save : '/nonfinanceService/CRD.AD.02.0099',
			modify : '/nonfinanceService/CRD.UP.02.0099',
			query : '/nonfinanceService/CRD.IQ.02.0099'
		},
		//交易费用
		overdraftCost : {
			save : '/nonfinanceService/CRD.AD.02.0098',
			modify : '/nonfinanceService/CRD.UP.02.0098',
			query : '/nonfinanceService/CRD.IQ.02.0098'
		},

		//汇率
		newCuRt : {
			saveCurrencyRate : '/nonfinanceService/COS.AD.02.0022',
			queryCurrencyRate : '/nonfinanceService/COS.IQ.02.0022',
			updateCurrencyRate : '/nonfinanceService/COS.UP.02.0022',
		},

		//分期计划查询
		instalPlan : {
			query : '/nonfinanceService/CRD.LM.01.0003'
		},
		
		//分期计划明细查询
		instalPlanDetail : {
			query : '/nonfinanceService/CRD.LM.01.0004'
		},

		//新增定价标签
		PricingLabel : {
			addPricingLabel : '/nonfinanceService/COS.AD.02.0026',
			query : '/nonfinanceService/COS.IQ.02.0010'
		},
		
		//业务形态实例化
		businessFormInst : {
			query : '/nonfinanceService/COS.IQ.02.0007',//selAvyList业务形态构件表
			saveBusinessType:'/nonfinanceService/COS.AD.02.0018',//保存业务形态
			saveBusinessTypeRel:'/nonfinanceService/COS.AD.02.0019',//保存业务形态与构件关系
			queryOpeMode:'/nonfinanceService/COS.IQ.02.0006'//下拉框查运营模式
		},
		//余额对象例化
		balanceObjInst : {
			query : '/nonfinanceService/COS.IQ.02.0008',//构件基础元件
			saveBalObj: '/nonfinanceService/COS.AD.02.0021',// 保存余额对象
			saveObjTag: '/nonfinanceService/COS.AD.02.0015',// 保存对象构建实例
			saveObjPCD: '/nonfinanceService/COS.AD.02.0016',// 替换保存接口
			save : '/nonfinanceService/COS.AD.02.0026',//保存余额对象
			queryEle: '/nonfinanceService/COS.IQ.02.0009',//可选元件
		},
		//非对象构件管理
		noObjectComManag : {
			query : '/nonfinanceService/COS.IQ.02.0024',//非对象构件管理表
			update: '/nonfinanceService/COS.UP.02.0024',// 修改保存非对象构件表
			updatePcd: '/nonfinanceService/COS.UP.02.0025',// 修改保存非对象pcd实例表
			queryEle: '/nonfinanceService/COS.IQ.02.0009'//可选元件
		},
		//非对象实例化
		noObjectInst: {
			queryArtifactInfo : '/nonfinanceService/COS.IQ.02.0007',//查询基础构件信息
			queryArtifactEle : '/nonfinanceService/COS.IQ.02.0008',//构件基础元件查询
			saveNoObjectInst :'/nonfinanceService/COS.AD.02.0024',//非对象构件实例新建
			saveNoObjectPcd :'/nonfinanceService/COS.AD.02.0025',//非对象构件PCD实例新建
			queryElementList : '/nonfinanceService/COS.IQ.02.0031',//元件以及PCD查询
			
		},
		//运营机构
		operatMech : {
			query:'/nonfinanceService/COS.IQ.02.0005',//查询运营机构
			save: '/nonfinanceService/COS.AD.02.0005',//新增运营机构
			update:'/nonfinanceService/COS.UP.02.0005',//新增运营修改
		},
		//运营模式
		operatMode : {
			query:'/nonfinanceService/COS.IQ.02.0006',//查询运营模式
			save: '/nonfinanceService/COS.AD.02.0006',//新增运营模式
			update: '/nonfinanceService/COS.UP.02.0006',//修改运营模式
		},
		//货币
		currency : {
			query:'/nonfinanceService/COS.IQ.02.0012',//查询货币
			save: '/nonfinanceService/COS.AD.02.0012',//新增货币
			update: '/nonfinanceService/COS.UP.02.0012',//修改货币
			
			
		},
		//卡BIN
		cardBin:{
			query:'/nonfinanceService/COS.IQ.02.0011',//查询卡BIN
			save: '/nonfinanceService/COS.AD.02.0011',//新增卡BIN
			update: '/nonfinanceService/COS.UP.02.0011',//修改卡BIN
			
		},
		//媒介对象例化
		mediaObjInstant : {
			query : '/nonfinanceService/COS.IQ.02.0007',//媒介对象表
			queryMember: '/nonfinanceService/COS.IQ.02.0009',// 查询元件接口
			//saveRel: '/nonfinanceService/COS.AD.02.0015',// 替换保存接口
			save : '/nonfinanceService/COS.AD.02.0017',//保存媒介对象
			saveMediaObjectRel:'/nonfinanceService/COS.AD.02.0015',//保存业务形态与构件关系
			queryEle: '/nonfinanceService/COS.IQ.02.0009'//可选元件
		},
		
		//财务中心--会计分录查询
		accountEntry : {
			query : '/nonfinanceService/CRD.IQ.02.0052',//会计分录查询表
		},
		//财务中心--核算场景
		accountScene : {
			query : '/nonfinanceService/CRD.IQ.02.0053',//核算场景
			update : '/nonfinanceService/CRD.AD.02.0053',//核算场景
		},
		//财务中心--会计分录模板管理
		accountTemplate : {
			query : '/nonfinanceService/CRD.IQ.02.0050',//会计分录模板查询  
			update : '/nonfinanceService/CRD.UP.02.0050',//会计分录模板维护
			updateDetail : '/nonfinanceService/CRD.UP.02.0051',//会计分录模板明细维护
		},
		//财务中心--科目信息查询
		subjectConfig : {
			query : '/nonfinanceService/CRD.IQ.02.0051',//会计分录模板查询
		},
		
		
		
		//卡版面
		cardLayoutMag : {
			save : '/betaService/COS.AD.02.0046',//卡版面建立
			query : '/betaService/COS.IQ.02.0054',//卡版面查询
			update : '/betaService/COS.UP.02.0049',//卡版面维护
			relatedProObjQuery: '/betaService/COS.IQ.02.0055',//产品对象关联卡版面代码查询事件
			relatedProObjUpdate: '/betaService/COS.UP.02.0050',//产品对象关联卡版面代码维护事件
		},

		
		//交易入账查询
		transEntryInquiry : {
			query : '/nonfinanceService/BSS.IQ.03.0008',//交易入账查询
		},
		
		
	};
	module.exports = config;
});