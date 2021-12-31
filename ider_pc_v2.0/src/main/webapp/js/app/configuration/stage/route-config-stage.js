'use strict';
define(function (require, exports, module) {
    var config = [
        //消费信贷申请
        ['/stage/consumerCreditApply', 'stage/consumerCreditApply.html', 'stage/consumerCreditApplyCtrl.js'],
        //消费贷放款申请
  		['/stage/consumerLoanApply', 'stage/consumerLoanApply/consumerLoanApply.html', 'stage/consumerLoanApply/consumerLoanApplyCtrl.js'], 
  		//单笔无账期交易
  		['/stage/singleApply', 'stage/consumerLoanApply/singleApply.html', 'stage/consumerLoanApply/singleApplyCtrl.js'],
  		//账单分期
		['/stage/stagingBills', 'stage/stagingBills/stagingBills.html', 'stage/stagingBills/stagingBillsController.js'],
		//交易分期
		['/stage/transactionStaging', 'stage/transactionStaging/transactionList.html', 'stage/transactionStaging/transactionListController.js'],
	];
    module.exports = config;
});