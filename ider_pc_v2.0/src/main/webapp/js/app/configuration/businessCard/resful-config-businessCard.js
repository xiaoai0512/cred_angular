'use strict';
define(function(require, exports, module) {
	var config = {
		//预算单位信息管理
		budgetUnit:{
			save : '/creditauditService/OCS.AD.01.0001', // 01 预算单位信息建立creditauditService
			query : '/nonfinanceService/OCS.IQ.01.0001', // 02 预算单位信息查询
			update : '/nonfinanceService/OCS.UP.01.0001' ,// 03预算单位信息维护
			queryMaxQuota : '/nonfinanceService/OCS.UP.01.9999' ,// 04额度查询个人预算单位最大限额

		},
		//公务卡管理
		businessManage:{
			busUnitList : '/nonfinanceService/OCS.IQ.01.0010', // 01 公务卡所属预算单位信息查询
			busAacCtrl : '/nonfinanceService/OCS.OP.01.0001', // 02 公务卡激活
			busCancel : '/nonfinanceService/OCS.OP.01.0002' ,// 03公务卡注销
			busStop : '/nonfinanceService/OCS.SP.01.3001' ,// 03公务卡停用
			queryCancelList : '/nonfinanceService/OCS.IQ.01.0010',//公务卡注销停用查询
			busfinacialTrans: '/cardService/OCS.RT.41.0001',//公务卡  退货
			isBusiCard : '/nonfinanceService/OCS.IQ.01.0014',//判断是否为公务卡
		},
		//额度管理
		quotaManage:{
			indQuoQuery : '/nonfinanceService/OCS.IQ.01.0004', // 01 个人公务卡最大授信额度查询
			unitQuoQuery : '/nonfinanceService/OCS.IQ.01.0002', // 02 单位公务卡额度管理
			nodeQuery : '/authService/LMS.IQ.01.0003',//查询额度
			creditUnit : '/nonfinanceService/OCS.RT.01.0001',//授信
			adjustUnit : '/nonfinanceService/OCS.RT.01.0002' //调额

		},
		// 账单/交易信息管理
		billManages:{
			queryFinance : '/nonfinanceService/OCS.IQ.01.0007', // 01 公务卡金融交易历史查询
			queryNum:'/nonfinanceService/OCS.IQ.01.0011',   //根据预算单位查询未出账单
			querybusOut : '/nonfinanceService/OCS.IQ.01.0008', // 02 公务卡已出账单查询
			querybusNoOut : '/nonfinanceService/OCS.IQ.01.0009', // 03根据外部识别号 公务卡未出账单查询
			querybudOut : '/nonfinanceService/OCS.IQ.01.0012' ,// 04预算的单位已出账单查询
			reimburse : '/nonfinanceService/AUS.IQ.01.0001' ,// 05公务卡报销
			reimburseBtn:'/nonfinanceService/OCS.UP.01.0002',  //公务卡金融交易查询中的报销处理
			searchBtn:'/nonfinanceService/BSS.IQ.03.0003' //预算编码查询时再次点击列表里的查询事件
		},
		//公务卡溢缴款
		businessOverpayment:{
			 businessPayment:'/nonfinanceService/BSS.IQ.01.0070', //01公务卡溢缴款查询
			 businessPaymentSure:'/cardService/OCS.RT.80.0001'  //02公务卡溢出确定按钮
		},
        //成本中心信息管理
        costCenter:{
            save : '/nonfinanceService/CCS.AD.01.0001', // 01 成本中心信息建立
            queryLike : '/nonfinanceService/CCS.IQ.01.0001', // 02 成本中心信息模糊查询
            queryOne : '/nonfinanceService/CCS.IQ.01.0002 ', // 03 成本中心信息精确查询
            update : '/nonfinanceService/CCS.UP.01.0001',// 04 成本中心信息维护
            saveRelation : '/nonfinanceService/CCS.AD.02.0001',// 05 成本中心关系建立
            queryRelation : '/nonfinanceService/CCS.IQ.02.0002',// 06 成本中心关系查询
            addRelation : '/nonfinanceService/CCS.AD.02.0003', // 07 成本中心关系新增子级
            delRelation : '/nonfinanceService/CCS.UP.02.0004', // 08 成本中心关系节点剔除
        }


	};
	module.exports = config;
});
