'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('individualQuotaCtr-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
		$scope.resultInfo = false;
		// 机构号查询
		$scope.institutionIdArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
			//	console.log(data);
			}
		};
		//预算管理层级
		$scope.manageLevelArray = [{
			name : "中央级",id : 'CEN'
		},{
			name : "省级",id : 'PRV'
		},{
			name : "市级",id : 'CIT'
		},{
			name : "区县级",id : 'COT'
		},{
			name : "乡镇级",id : 'TWN'
		}];
		//搜索身份证类型
		$scope.certificateTypeArray = [ {name : T.T('F00113'),id : '1'},//身份证
		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		{name : T.T('F00116') ,id : '4'} ,//中国护照
		{name : T.T('F00117') ,id : '5'} ,//外国护照
		{name : T.T('F00118') ,id : '6'},{
			name : "公务卡" ,id : '7'
		} ];
		// 公司标识
		$scope.personalCompanyType = [ {name : '个人',id : '1'}, {name : '公司',id : '2'} ,
		                               {name : '预算单位',id : '3'}];
		//重置
		$scope.reset = function(){
			$scope.externalIdentificationNo = '';
			$scope.individ = {};
			$scope.resultInfo = false;
		};
		$scope.selectList = function(){
			if($scope.externalIdentificationNo){
				$scope.params = {};
				$scope.params.externalIdentificationNo = $scope.externalIdentificationNo;
				//个人公务卡最大授信额度
				jfRest.request('quotaManage', 'indQuoQuery',$scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						$scope.individ = data.returnData.rows[0];
						$scope.resultInfo = true;
					}
				});
			}else{
				jfLayer.fail('请输入外部识别号');
			}
		};
	});
});
