'use strict';
define(function(require) {

	var webApp = require('app');

	//货币建立
	webApp.controller('resNumEstCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.queryParam = {
				organNo : $scope.organization
		};
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
				$scope.resNum.corporationEntityNo = $scope.corporationEntityNo;
				$("#corporationEntityNo").attr("disabled",true);
			}
			});
		
		
		 //卡bin
		 $scope.cardBinArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
			        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"productLine.queryBin",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		 
		
		$scope.chosecorporation = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/resNumber/chosecorporation.html', $scope.params, {
					title : T.T('PZJ1000005'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.chosecorpEntityNo]
				});
		};
		$scope.chosecorpEntityNo = function(result){
			if (!result.scope.legalEntityList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.legalEntityList.checkedList();
			$scope.resNum.corporationEntityNo  = $scope.checkedEvent.corporationEntityNo;
			$scope.safeApply();
			result.cancel();
		};
		$scope.resNum ={};
		//保存预留号规则
		$scope.saveResNum = function(){
			console.log($scope.resNum);
			if($scope.resNum.binNo.length != 6){
				jfLayer.fail(T.T('PZJ1000006'));
				return;
			}
			$scope.resNum.reserveNumRule = '000'+$scope.resNum.binNo+$scope.resNum.reserveNumRuleHalf;
			jfRest.request('resNumber','save', $scope.resNum).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.resNum = {};
					$scope.resNumForm.$setPristine();
				}
			});
		}
		
	});
	
	//选择法人实体
//	webApp.controller('resLegalEntityQueryCtrl', function($scope, $stateParams, jfRest,
//			$http, jfGlobal, $rootScope, jfLayer, $location) {
//		// 事件清单列表
//		$scope.legalEntityList = {
//			checkType : 'radio', // 当为checkbox时为多选
//			params : $scope.queryParam = {
//				"pageSize" : 10,
//				"indexNo" : 0
//			}, // 表格查询时的参数信息
//			paging : true,// 默认true,是否分页
//			resource : 'legalEntity.query',// 列表的资源
//			callback : function(data) { // 表格查询后的回调函数
//			}
//		};
//	});

});
