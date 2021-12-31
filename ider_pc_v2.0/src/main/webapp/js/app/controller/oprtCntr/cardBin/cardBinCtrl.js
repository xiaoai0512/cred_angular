'use strict';
define(function(require) {
	var webApp = require('app');
	//货币建立
	webApp.controller('cardBinEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//V：VISA M：Mastercard J:JCB C:CUP A:AMEX
		$scope.organizeType = [{name:"CUP",id:"C"},{name:"VISA",id:"V"},{name:"Mastercard",id:"M"},{name:"JCB",id:"J"},{name:"AMEX",id:"A"}];//
		$scope.cardType = [{name:"信用卡",id:"1"},{name:"贷记卡",id:"2"},{name:"准贷记卡",id:"3"},{name:"借记卡",id:"4"}];//
		$scope.resolutionCurr = [{name:"人民币",id:"156"},{name:"美元",id:"840"},{name:"欧元",id:"978"}];//
		//默认值
		$scope.tradBtn3 = true;
		$scope.tradBtn4 = false;
		$scope.tradBtn5 = false;
		$scope.tradBtn6 = false;
		$scope.tradBtn7 = false;
		$scope.tradBtn8 = false;
		$scope.tradBtn9 = false;
		$scope.tradBtn10 = false;
		$scope.tradBtn11 = false;
		$scope.tradBtn12 = false;
		$scope.tradBtn13 = false;
		$scope.tradBtn14 = false;
		$scope.tradBtn15 = false;
		$scope.tradSel3 = false;
		$scope.tradSel4 = false;
		$scope.tradSel5 = false;
		$scope.tradSel6 = false;
		$scope.tradSel7 = false;
		$scope.tradSel8 = false;
		$scope.tradSel9 = false;
		$scope.tradSel10 = false;
		$scope.tradSel11 = false;
		$scope.tradSel12 = false;
		$scope.tradSel13 = false;
		$scope.tradSel14 = false;
		$scope.tradSel15 = false;
		//新增3
		$scope.tradTypeSel3 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = true;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = false;
			$scope.tradSel5 = false;
			$scope.tradSel6 = false;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增4
		$scope.tradTypeSel4 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = true;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = false;
			$scope.tradSel6 = false;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增5
		$scope.tradTypeSel5 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = true;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = false;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增6
		$scope.tradTypeSel6 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = true;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增7
		$scope.tradTypeSel7 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = true;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增8
		$scope.tradTypeSel8 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = true;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增9
		$scope.tradTypeSel9 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = true;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增10
		$scope.tradTypeSel10 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = true;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增11
		$scope.tradTypeSel11 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = true;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增12
		$scope.tradTypeSel12 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = true;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增13
		$scope.tradTypeSel13 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = true;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = true;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增14
		$scope.tradTypeSel14 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = true;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = true;
			$scope.tradSel14 = true;
			$scope.tradSel15 = false;
		};
		//新增15
		$scope.tradTypeSel15 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = true;
			$scope.tradSel14 = true;
			$scope.tradSel15 = true;
		};
		$scope.cardBin ={};
		$scope.updateCardBinRequired = function(){
			$scope.cardBin.bin = document.getElementById("binId").value;
			if($scope.cardBin.bin.substring(0,1)=="6"){
				$scope.cardBin.resolutionCurr2 ="000";
			}
		};
		//保存货币
		$scope.saveCardBin = function(){
			console.log($scope.cardBin);
			$scope.cardBinParams=$scope.cardBin;
			jfRest.request('cardBin','save', $scope.cardBinParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success("保存成功") ;
					$scope.cardBin = {};
					$scope.balanceForm.$setPristine();
				}
			});
		}
	});
	//货币查询及维护
	webApp.controller('cardBinMaintCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		//默认值
		$scope.tradBtn3 = true;
		$scope.tradBtn4 = false;
		$scope.tradBtn5 = false;
		$scope.tradBtn6 = false;
		$scope.tradBtn7 = false;
		$scope.tradBtn8 = false;
		$scope.tradBtn9 = false;
		$scope.tradBtn10 = false;
		$scope.tradBtn11 = false;
		$scope.tradBtn12 = false;
		$scope.tradBtn13 = false;
		$scope.tradBtn14 = false;
		$scope.tradBtn15 = false;
		$scope.tradSel3 = false;
		$scope.tradSel4 = false;
		$scope.tradSel5 = false;
		$scope.tradSel6 = false;
		$scope.tradSel7 = false;
		$scope.tradSel8 = false;
		$scope.tradSel9 = false;
		$scope.tradSel10 = false;
		$scope.tradSel11 = false;
		$scope.tradSel12 = false;
		$scope.tradSel13 = false;
		$scope.tradSel14 = false;
		$scope.tradSel15 = false;
		//新增3
		$scope.tradTypeSel3 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = true;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = false;
			$scope.tradSel5 = false;
			$scope.tradSel6 = false;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增4
		$scope.tradTypeSel4 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = true;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = false;
			$scope.tradSel6 = false;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增5
		$scope.tradTypeSel5 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = true;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = false;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增6
		$scope.tradTypeSel6 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = true;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = false;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增7
		$scope.tradTypeSel7 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = true;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = false;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增8
		$scope.tradTypeSel8 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = true;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = false;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增9
		$scope.tradTypeSel9 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = true;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = false;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增10
		$scope.tradTypeSel10 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = true;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = false;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增11
		$scope.tradTypeSel11 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = true;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = false;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增12
		$scope.tradTypeSel12 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = true;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = false;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增13
		$scope.tradTypeSel13 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = true;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = true;
			$scope.tradSel14 = false;
			$scope.tradSel15 = false;
		};
		//新增14
		$scope.tradTypeSel14 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = true;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = true;
			$scope.tradSel14 = true;
			$scope.tradSel15 = false;
		};
		//新增15
		$scope.tradTypeSel15 = function(){
			$scope.tradBtn3 = false;
			$scope.tradBtn4 = false;
			$scope.tradBtn5 = false;
			$scope.tradBtn6 = false;
			$scope.tradBtn7 = false;
			$scope.tradBtn8 = false;
			$scope.tradBtn9 = false;
			$scope.tradBtn10 = false;
			$scope.tradBtn11 = false;
			$scope.tradBtn12 = false;
			$scope.tradBtn13 = false;
			$scope.tradBtn14 = false;
			$scope.tradBtn15 = false;
			$scope.tradSel3 = true;
			$scope.tradSel4 = true;
			$scope.tradSel5 = true;
			$scope.tradSel6 = true;
			$scope.tradSel7 = true;
			$scope.tradSel8 = true;
			$scope.tradSel9 = true;
			$scope.tradSel10 = true;
			$scope.tradSel11 = true;
			$scope.tradSel12 = true;
			$scope.tradSel13 = true;
			$scope.tradSel14 = true;
			$scope.tradSel15 = true;
		};
		$scope.organizeType = [{name:"VISA",id:"V"},{name:"Mastercard",id:"M"},{name:"JCB",id:"J"},{name:"AMEX",id:"A"},{name:"CUP",id:"C"}];//
		$scope.cardType = [{name:"信用卡",id:"1"},{name:"贷记卡",id:"2"},{name:"准贷记卡",id:"3"},{name:"借记卡",id:"4"}];//
		$scope.resolutionCurr = [{name:"人民币",id:"156"},{name:"美元",id:"840"},{name:"欧元",id:"978"}];//
		//货币列表
		$scope.cardBinTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cardBin.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//修改
		$scope.updateCardBin = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.items = $.parseJSON(JSON.stringify(item));
			if ($scope.items.organizeTyp == "V") {
				$scope.items.organizeTypeTran = "VISA";
			} else if ($scope.items.organizeTyp == "M") {
				$scope.items.organizeTypeTran = "Mastercard";
			}else if ($scope.items.organizeTyp == "J") {
				$scope.items.organizeTypeTran = "JCB";
			}else if ($scope.items.organizeTyp == "A") {
				$scope.items.organizeTypeTran = "AMEX";
			} else if ($scope.items.organizeTyp == "C") {
				$scope.items.organizeTypeTran = "CUP";
			}
			$scope.modal('/oprtCntr/cardBin/cardBinMod.html', $scope.items, {
				title : 'BIN信息',
				buttons : [ '确定', '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.saveProInf]
			});
		};
		//保存
		$scope.saveProInf = function (result){
			jfRest.request('cardBin', 'update', $scope.items)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					console.log(data.returnData);
					 jfLayer.success("修改成功！");
					 $scope.safeApply();
					 result.cancel();
					 $scope.cardBinTable.search();
				}
			});
		}
	});
});
