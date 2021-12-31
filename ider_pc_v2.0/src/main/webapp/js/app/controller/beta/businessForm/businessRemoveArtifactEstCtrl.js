'use strict';
define(function(require) {

	var webApp = require('app');

	//业务形态排除构件建立
	webApp.controller('businessRemoveArtifactEstCtrl333', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/businessForm/i18n_businessForm');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.removeArtifactInf = {};
		
		//R1、R2、S1、S2
//		$scope.businessPatternArr = [{name:"R1",id:"R1"},{name:"R2",id:"R2"},{name:"S1",id:"S1"},{name:"S2",id:"S2"}];//

		//查询业务形态
		 $scope.businessPatternArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"patternDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"businessForm.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		
		// 查询构件
		$scope.artifactList = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'elmList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		
		$scope.artifactSelect = [];
		$scope.saveSelect = function(event) {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.artifactList.validCheck()) {
				return;
			}
			var items = $scope.artifactList.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.artifactSelect.length; k++) {
					if (items[i].artifactNo == $scope.artifactSelect[k].artifactNo) {    //判断是否存在
						tipStr = tipStr + items[i].artifactNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.artifactSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('PZJ1400001')+ tipStr.substring(0,tipStr.length-1) + T.T('PZJ1400002'));
			}
		
		};

		// 上移
		$scope.exchangeSeqNoUp = function(data) {

			for (var i = 0; i < $scope.artifactSelect.length; i++) {
				if ($scope.artifactSelect[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $scope.artifactSelect[i];
					$scope.artifactSelect[i] = $scope.artifactSelect[i - 1];
					$scope.artifactSelect[i - 1] = dataMap;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $scope.artifactSelect.length; i++) {
				if ($scope.artifactSelect[i] == data) {
					if (i == $scope.artifactSelect.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $scope.artifactSelect[i];
					$scope.artifactSelect[i] = $scope.artifactSelect[i + 1];
					$scope.artifactSelect[i + 1] = dataMap;
					break;
				}
			}
		};

		// 删除关联元件
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.artifactSelect.splice(checkId, 1);
		};
		//保存
		$scope.saveBsReArt = function(){
			$scope.removeArtifactInf.artifactList = $scope.artifactSelect;
			jfRest.request('businessForm', 'save', $scope.removeArtifactInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.removeArtifactInf = {};
					$scope.artifactSelect =[];
					$scope.bsRemFormInfForm.$setPristine();
				}else{
//					jfLayer.fail("保存失败");
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033') ;
					jfLayer.fail(data.returnMsg);
				}
			});
		}
		
	});
});
