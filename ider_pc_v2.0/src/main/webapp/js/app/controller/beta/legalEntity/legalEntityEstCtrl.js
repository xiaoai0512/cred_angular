'use strict';
define(function(require) {
	var webApp = require('app');
	//法人实体建立
	webApp.controller('legalEntityEstCtrl2222', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/legalEntity/i18n_legalEntity');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.bsInf = {};
//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"productLine.queryMode",//数据源调用的action 
			        callback: function(data){
			        }
			    };
//		系统单元
		 $scope.systemUnitArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"systemUnitName", //下拉框显示内容，根据需要修改字段名称 
			        value:"systemUnitNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"systemUnit.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//保存
		$scope.saveBsForm = function(){
			jfRest.request('legalEntity','save', $scope.bsInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.bsInf = {};
					$scope.bsFormInfForm.$setPristine();
				}
			});
		}
	});
});
