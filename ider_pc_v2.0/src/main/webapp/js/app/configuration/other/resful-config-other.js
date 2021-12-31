'use strict';
define(function(require, exports, module) {
	var config = {
		//客户产品列表查询
		cstPDList : {
			query : '/json/other/cstPDList/cstPDList.json'
		},
		//发卡行列表
		newPDCfg : {
			query : '/nonfinanceService/COS.IQ.02.0011',
			queryOprtList : '/nonfinanceService/COS.IQ.02.0020',//运营列表
			queryBsnScopInfo : '/nonfinanceService/COS.IQ.02.0014',//业务范围信息
			queryPDOptElm : '/nonfinanceService/COS.IQ.02.0008',//产品可选构件
			saveNewPDCfg : '/nonfinanceService/COS.AD.02.0013',//产品对象，
			saveProBusScp : '/nonfinanceService/COS.AD.02.0014',//产品业务范围
			saveObjTag : '/nonfinanceService/COS.AD.02.0015',//对象构件实例
			saveObjPCD : '/nonfinanceService/COS.AD.02.0016',//对象pcd实例
			queryDif: '/nonfinanceService/COS.IQ.02.0030',//差异化表
			updateDif: '/nonfinanceService/COS.UP.02.0016',//差异化表修改对象pcd实例
			saveDif: '/nonfinanceService/COS.AD.02.0013',//差异化表
			queryEle: '/nonfinanceService/COS.IQ.02.0009',//可选元件
			
		},
		//标签对象订单
		lblObjList : {
			query : '/nonfinanceService/COS.IQ.02.0026',
			updatePricingLabel : '/nonfinanceService/COS.UP.02.0026'
		},
		
		//新业务类型配置
		newBsnTpCfg : {
			query : '/nonfinanceService/COS.IQ.02.0018',
			queryBsnTpTpl: '/nonfinanceService/COS.IQ.02.0020',
			queryRelElmAndYPts:'/nonfinanceService/COS.IQ.02.0008',
			saveBusinessType :'/nonfinanceService/COS.AD.02.0020',
			saveObjTag : '/nonfinanceService/COS.AD.02.0015',//对象构件实例
			saveObjPCD : '/nonfinanceService/COS.AD.02.0016',//对象pcd实例
		}
		
	};
	module.exports = config;
});