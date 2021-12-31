'use strict';
define(function(require, exports, module) {
	var config = {
			//渠道
			channelMag : {
				save : '/betaService/MIS.AD.01.0001',//渠道建立
				query : '/betaService/MIS.IQ.01.0001',//渠道查询
				update : '/betaService/MIS.UP.01.0001',//渠道维护
				deleteMa : '/betaService/MIS.UP.01.0002',//渠道删除
			},
			//清算场景
			clearScene : {
				save : '/betaService/MIS.AD.01.0005',//清算场景建立
				query : '/betaService/MIS.IQ.01.0005',//清算场景查询
				update : '/betaService/MIS.UP.01.0005',//清算场景维护
				deleteCl : '/betaService/MIS.UP.01.0006',//清算场景删除
			},
			//清算处理结果
			clearResult : {
				query : '/clearService/MIS.IQ.02.0001',//清算处理结果查询
			},
			//异常交易管理
			clearAbnormal:{
				query:'/clearService/MIS.IQ.02.0002',//异常交易查询
				update:'/clearService/MIS.IQ.02.0002',
			},
		    //清算历史查询
            clearHistory:{
                queryVisa:'/clearService/MIS.IQ.02.0003',//Visa清算历史查询
                queryMc:'/clearService/MIS.IQ.02.0004',  //Mc清算历史查询
            }
	};
	module.exports = config;
});
