'use strict';
define(function(require, exports, module) {
	var config = {
			//消费信贷申请
			consumerCredit: {
				//cstBaseInf : '/nonfinanceService/BSS.IQ.01.0001', //查询客户基本信息
				queryProList: '/nonfinanceService/BSS.IQ.01.0004', //查詢產品列表
				sureApply : '/nonfinanceService/COS.CS.01.0018',
			},	
			//消费贷放款申请
			conApply : {
				queryPro: '/nonfinanceService/BSS.IQ.01.0004', //查询产品
				queryCusInfo: '/nonfinanceService/ILS.IQ.01.0009',//查询产品信息
				//queryCstInaf: '/nonfinanceService/BSS.IQ.01.0001', // 查询客户信息
				save: '/nonfinanceService/BSS.UP.03.0020', //删除  
				httpsave:'/nonfinanceService/BSS.UP.03.0020',
				tlsAjust: '/cardService/ILS.RT.40.0001', // 放款申请'
				querysTs:'/cardService/ILS.IQ.01.0011',
				queryflag:'/cardService/ILS.RT.40.0008',	  //Y时调用
				single:'/cardService/ILS.RT.40.0002',//单笔无账期交易
			},
			//信贷交易账户信息
			creditLoanInfo : {
				loanTrail: '/cardService/ILS.IQ.01.0014', //贷款变更试算
				changeLoan: '/cardService/ILS.RT.40.0000',//贷款变更
				payMoney:'/cardService/ILS.IQ.01.0016',//提前部分还款试算
				trailPrePay: '/cardService/ILS.IQ.01.0014', // 提前还款
				trailsettle: '/cardService/ILS.IQ.01.0017', // 提前结清试算
			},
			//账单分期
			billStaging : {
				query: '/nonfinanceService/ILS.IQ.03.0020', //贷款变更试算
			},
			//交易分期
			transaction : {
				query: '/nonfinanceService/ILS.IQ.03.0015', //贷款变更试算
			},
	};
	module.exports = config;
});