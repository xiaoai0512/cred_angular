'use strict';
define(function(require) {

	var webApp = require('app');

	webApp.controller('cardListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_cardInfo');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.resultInfo = false;
		//查询详情事件
		
		$scope.selectList = function() {
			$scope.statusCodeInfo = '';
			$scope.retailVerifyPswFlagInfo = '';
			$scope.mediaTypeInfo = '';
			$scope.activationFlagInfo = '';
			$scope.mainSupplyIndicatorInfo = '';
			if($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.resultInfo = false;
			}else{
				$scope.cusParams = {
					authDataSynFlag:"1",
					externalIdentificationNo:$scope.externalIdentificationNo
				};
				jfRest.request('cusInfo', 'cardQuery', $scope.cusParams)
			    .then(function(data) {
			    	$scope.item = {};
			    	if(data.returnMsg == 'OK'){
			    		$scope.resultInfo = true;
			    		$scope.item = data.returnData.rows[0];
			    		if($scope.item.invalidFlag == 'Y'){
			    			$scope.invalidFlagInfo = T.T('SQJ200001');
			    		}else if($scope.item.invalidFlag == 'N'){
			    			$scope.invalidFlagInfo = T.T('SQJ200002');
			    		}
			    		if($scope.item.invalidReason == 'TRF'){
			    			$scope.invalidReasonInfo = T.T('SQJ200003');
			    		}else if($scope.item.invalidReason == 'EXP'){
			    			$scope.invalidReasonInfo = T.T('SQJ200004');
			    		}else if($scope.item.invalidReason == 'BRK'){
			    			$scope.invalidReasonInfo = T.T('SQJ200005');
			    		}else if($scope.item.invalidReason == 'CLS'){
			    			$scope.invalidReasonInfo = T.T('F00012');
			    		}else if($scope.item.invalidReason == 'PNA'){
			    			$scope.invalidReasonInfo = T.T('SQJ200018');
			    		}else if($scope.item.invalidReason == 'CHP'){
			    			$scope.invalidReasonInfo = '产品升降级';
                        }
                        if($scope.item.statusCode == '1'){
			    			$scope.statusCodeInfo = T.T('SQJ200006');
			    		}else if($scope.item.statusCode == '2'){
			    			$scope.statusCodeInfo = T.T('SQJ200007');
			    		}else if($scope.item.statusCode == '3'){
			    			$scope.statusCodeInfo = T.T('SQJ200008');
			    		}else if($scope.item.statusCode == '4'){
			    			$scope.statusCodeInfo = T.T('SQJ200009');
			    		}else if($scope.item.statusCode == '8'){
			    			$scope.statusCodeInfo = T.T('F00012');
			    		}else if($scope.item.statusCode == '9'){
			    			$scope.statusCodeInfo = T.T('SQJ200010');
			    		}
			    		if($scope.item.retailVerifyPswFlag == '1'){
			    			$scope.retailVerifyPswFlagInfo = T.T('SQJ200011');
			    		}else if($scope.item.retailVerifyPswFlag == '2'){
			    			$scope.retailVerifyPswFlagInfo = T.T('SQJ200012');
			    		}
			    		if($scope.item.mediaType == 'M'){
			    			$scope.mediaTypeInfo = T.T('SQJ200013');
			    		}else if($scope.item.mediaType == 'C'){
			    			$scope.mediaTypeInfo = T.T('SQJ200014');
			    		}else if($scope.item.mediaType == 'V'){
			    			$scope.mediaTypeInfo = T.T('SQJ200015');
			    		}
			    		if($scope.item.activationFlag == '1'){
			    			$scope.activationFlagInfo = T.T('SQJ200016');
			    		}else if($scope.item.activationFlag == '2'){
			    			$scope.activationFlagInfo = T.T('SQJ200017');
			    		}else if($scope.item.activationFlag == '3'){
			    			$scope.activationFlagInfo = T.T('SQJ200018');
			    		}else if($scope.item.activationFlag == '4'){
			    			$scope.activationFlagInfo = T.T('SQJ200019');
			    		}else if($scope.item.activationFlag == '5'){
			    			$scope.activationFlagInfo = T.T('SQJ200022');
			    		}
			    		if($scope.item.mainSupplyIndicator == '1'){
			    			$scope.mainSupplyIndicatorInfo = T.T('SQJ200020');
			    		}else if($scope.item.mainSupplyIndicator == '2'){
			    			$scope.mainSupplyIndicatorInfo = T.T('SQJ200021');
			    		}
			    		if($scope.item.verifyPswFlag == 'Y') {
			    			$scope.verifyPswFlagInfo =T.T('SQJ200023');
			    		}else if($scope.item.verifyPswFlag == 'N') {
			    			$scope.verifyPswFlagInfo =T.T('SQJ200024');
			    		}
			    		if($scope.item.smallAvoidPswFlag == 'Y') {
			    			$scope.smallAvoidPswFlagInfo =T.T('SQJ200023');
			    		}else if($scope.item.smallAvoidPswFlag == 'N') {
			    			$scope.smallAvoidPswFlagInfo =T.T('SQJ200024');
			    		}
			    	}
	            });
			}
		};
		
		//关闭事件
		$scope.closeInfo = function(){
			$scope.resultInfo = false;
			$scope.item = "";
			$scope.externalIdentificationNo = "";
			$scope.statusCodeInfo = '';
			$scope.retailVerifyPswFlagInfo = '';
			$scope.mediaTypeInfo = '';
			$scope.activationFlagInfo = '';
			$scope.mainSupplyIndicatorInfo = '';
		}
		
	});

});
