'use strict';
define(function(require) {

	var webApp = require('app');
	
	//系统单元查询及维护
	webApp.controller('systemFlagListController', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");

		$scope.systemOperateArr = [{name:T.T('PZJ1300001'),id:"NOR"},{name:T.T('PZJ1300002'),id:"EOD"}];
		$scope.logFlagArr = [{name:"A ",id:"A"},{name:"B",id:"B"}];		
		$scope.systemProcessDayFlagArr = [{name:T.T('PZJ1300003'),id:"O"},{name:T.T('PZJ1300004'),id:"C"}];
		$scope.systemEnvironmentFlagArr = [{name:T.T('PZJ1300005'),id:"PROD"},{name:T.T('PZJ1300006'),id:"TEST"}];
		$scope.nonProDayBatchFlagArr = [{name:T.T('PZJ1300007'),id:"N"},{name:T.T('PZJ1300008'),id:"Y"}];
		$scope.encryptArr = [{name:"3DES",id:"1"},{name:T.T("YWJ5500064"),id:"2"}];
		$scope.panEncryptArr = [{name:T.T("F00028"),id:"Y"},{name:T.T("F00029"),id:"N"}];
		
		$scope.systemUnitList = {
          //checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'systemUnit.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_systemOperation'],//查找数据字典所需参数
			transDict : ['systemOperateState_systemOperateStateDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};

		
		
		//查询详情
		$scope.checkSystemUnit = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.systemUnitItem = $.parseJSON(JSON.stringify(item));
			var systemProcessDayFlag = $scope.systemUnitItem.systemProcessDayFlag;
			if(systemProcessDayFlag.length!=0 && systemProcessDayFlag.length==7){
				$scope.systemUnitItem.radio1 = systemProcessDayFlag.substring(0,1);
				$scope.systemUnitItem.radio2 = systemProcessDayFlag.substring(1,2);
				$scope.systemUnitItem.radio3 = systemProcessDayFlag.substring(2,3);
				$scope.systemUnitItem.radio4 = systemProcessDayFlag.substring(3,4);
				$scope.systemUnitItem.radio5 = systemProcessDayFlag.substring(4,5);
				$scope.systemUnitItem.radio6 = systemProcessDayFlag.substring(5,6);
				$scope.systemUnitItem.radio7 = systemProcessDayFlag.substring(6,7);
				
			}
			$scope.modal('/beta/systemUnit/viewSystemUnit.html', $scope.systemUnitItem, {
				title : T.T('PZJ1300012'),
				buttons : [  T.T('F00012') ],
				size : [ '970px', '510px' ],
				callbacks : []
			});
		};
		
		
	
		/*
		//修改
		$scope.updateSystemUnit= function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.systemUnitItem = $.parseJSON(JSON.stringify(item));
			var systemProcessDayFlag = $scope.systemUnitItem.systemProcessDayFlag;
			if(systemProcessDayFlag.length!=0 && systemProcessDayFlag.length==7){
				$scope.systemUnitItem.radio1 = systemProcessDayFlag.substring(0,1);
				$scope.systemUnitItem.radio2 = systemProcessDayFlag.substring(1,2);
				$scope.systemUnitItem.radio3 = systemProcessDayFlag.substring(2,3);
				$scope.systemUnitItem.radio4 = systemProcessDayFlag.substring(3,4);
				$scope.systemUnitItem.radio5 = systemProcessDayFlag.substring(4,5);
				$scope.systemUnitItem.radio6 = systemProcessDayFlag.substring(5,6);
				$scope.systemUnitItem.radio7 = systemProcessDayFlag.substring(6,7);
				
			}
			$scope.modal('/beta/systemUnit/updateSystemUnit.html', $scope.systemUnitItem, {
				title : T.T('PZJ1300013'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '970px', '510px' ],
				callbacks : [$scope.sureUpdateSystemUnit]
			});
		};
		//修改
		$scope.sureUpdateSystemUnit = function (result){
			$scope.systemUnitItem.systemProcessDayFlag = $scope.systemUnitItem.radio1.concat($scope.systemUnitItem.radio2,$scope.systemUnitItem.radio3,
					$scope.systemUnitItem.radio4,$scope.systemUnitItem.radio5,$scope.systemUnitItem.radio6,$scope.systemUnitItem.radio7);
			jfRest.request('systemUnit', 'update', $scope.systemUnitItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022') );
					 $scope.safeApply();
					 result.cancel();
					 $scope.systemUnitList.search();
					
				}else {
//					var returnMsg = data.returnMsg ? data.returnMsg : '保存失败' ;
//					jfLayer.fail(data.returnMsg);
					 jfLayer.fail(T.T('F00023') );
				}
				
			});
		};
		*/
		
		/*
		//新增
		$scope.addSystemUnit = function(){
			$scope.sysInf = {};
			$scope.modal('/beta/systemUnit/systemUnitEst.html', $scope.legalEntityBsf, {
				title : "新增系统单元",
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureAddSystemUnitEst]
			});
			
		};
		
		$scope.d = {};
		
		//确认新增
		$scope.sureAddSystemUnitEst = function(result){
			
			$scope.sysInf = result.scope.sysInf;
			if($scope.sysInf.lastProcessDate>$scope.sysInf.currProcessDate){
				jfLayer.fail(T.T('PZJ1300009'));
				return;
			}
			if($scope.sysInf.lastProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300010'));
				return;
			}
			if($scope.sysInf.currProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300011'));
				return;
			}
			if($scope.sysInf.panEncryptFlag == "Y"){
				if($scope.sysInf.externalHideMethod== undefined 
						||$scope.sysInf.externalHideMethod== null
						||$scope.sysInf.encryptInstrument == undefined
						||$scope.sysInf.encryptInstrument == null){
					jfLayer.fail(T.T('PZJ1300014'));
					return;
				}
			}
			$scope.sysInf.systemProcessDayFlag = $scope.d.radio1.concat($scope.d.radio2,$scope.d.radio3,$scope.d.radio4,$scope.d.radio5,$scope.d.radio6,$scope.d.radio7);
			jfRest.request('systemUnit','save', $scope.sysInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.sysInf = {};
					$scope.d.radio1 = '';
					$scope.d.radio2 = '';
					$scope.d.radio3 = '';
					$scope.d.radio4 = '';
					$scope.d.radio5 = '';
					$scope.d.radio6 = '';
					$scope.d.radio7 = '';

					 $scope.safeApply();
					 result.cancel();
					 $scope.systemUnitList.search();
					
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033') ;
					jfLayer.fail(returnMsg);
				}
			});
			
		};
		*/
		
		/*
		//复制
		$scope.copySystemUnit = function(item){
			
			$scope.systemUnitItem = $.parseJSON(JSON.stringify(item));
			var systemProcessDayFlag = $scope.systemUnitItem.systemProcessDayFlag;
			if(systemProcessDayFlag.length!=0 && systemProcessDayFlag.length==7){
				$scope.systemUnitItem.radio1 = systemProcessDayFlag.substring(0,1);
				$scope.systemUnitItem.radio2 = systemProcessDayFlag.substring(1,2);
				$scope.systemUnitItem.radio3 = systemProcessDayFlag.substring(2,3);
				$scope.systemUnitItem.radio4 = systemProcessDayFlag.substring(3,4);
				$scope.systemUnitItem.radio5 = systemProcessDayFlag.substring(4,5);
				$scope.systemUnitItem.radio6 = systemProcessDayFlag.substring(5,6);
				$scope.systemUnitItem.radio7 = systemProcessDayFlag.substring(6,7);
				
			}
			$scope.modal('/beta/systemUnit/copySystemUnit.html', $scope.systemUnitItem, {
				title : "复制系统单元信息",
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '970px', '510px' ],
				callbacks : [$scope.sureCopySystemUnit]
			});
			
		};
		*/
		/*
		//确定复制
		$scope.sureCopySystemUnit = function (result){
			
			$scope.sysInf = result.scope.systemUnitItem;
			if($scope.sysInf.lastProcessDate>$scope.sysInf.currProcessDate){
				jfLayer.fail(T.T('PZJ1300009'));
				return;
			}
			if($scope.sysInf.lastProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300010'));
				return;
			}
			if($scope.sysInf.currProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300011'));
				return;
			}
			if($scope.sysInf.panEncryptFlag == "Y"){
				if($scope.sysInf.externalHideMethod== undefined 
						||$scope.sysInf.externalHideMethod== null
						||$scope.sysInf.encryptInstrument == undefined
						||$scope.sysInf.encryptInstrument == null){
					jfLayer.fail(T.T('PZJ1300014'));
					return;
				}
			}
			$scope.sysInf.systemProcessDayFlag = $scope.sysInf.radio1.concat($scope.sysInf.radio2,$scope.sysInf.radio3,$scope.sysInf.radio4,$scope.sysInf.radio5,$scope.sysInf.radio6,$scope.sysInf.radio7);
			jfRest.request('systemUnit','save', $scope.sysInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.sysInf = {};
					$scope.d.radio1 = '';
					$scope.d.radio2 = '';
					$scope.d.radio3 = '';
					$scope.d.radio4 = '';
					$scope.d.radio5 = '';
					$scope.d.radio6 = '';
					$scope.d.radio7 = '';

					 $scope.safeApply();
					 result.cancel();
					 $scope.systemUnitList.search();
					
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033') ;
					jfLayer.fail(returnMsg);
				}
			});
		};
		*/
		
		
		
	});
	/*
	webApp.controller('viewSystemUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	
	});
	
	webApp.controller('updateSystemUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {

		//$scope.systemProcessDayArray = [{id: "O",name: "处理日"},{id: "C",name: "非处理日"}];
	});
	
	//复制
	webApp.controller('copySystemUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {

		//$scope.systemProcessDayArray = [{id: "O",name: "处理日"},{id: "C",name: "非处理日"}];
	});
	*/

	//系统单元建立
	webApp.controller('systemUnitEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/systemUnit/i18n_systemUnit');
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.sysInf = {};
		$scope.passWohs = false;
		$scope.systemOperateArr = [{name:T.T('PZJ1300001'),id:"NOR"},{name:T.T('PZJ1300002'),id:"EOD"}];
		$scope.logFlagArr = [{name:"A ",id:"A"},{name:"B",id:"B"}];
		$scope.systemProcessDayFlagArr = [{name:T.T('PZJ1300003'),id:"O"},{name:T.T('PZJ1300004'),id:"C"}];
		$scope.systemEnvironmentFlagArr = [{name:T.T('PZJ1300005'),id:"PROD"},{name:T.T('PZJ1300006'),id:"TEST"}];
		$scope.nonProDayBatchFlagArr = [{name:T.T('PZJ1300007'),id:"N"},{name:T.T('PZJ1300008'),id:"Y"}];
		$scope.encryptArr = [{name:"3DES",id:"1"},{name:T.T("YWJ5500064"),id:"2"}];
		$scope.panEncryptArr = [{name:T.T("F00028"),id:"Y"},{name:T.T("F00029"),id:"N"}];
		
		//是否加密事件
		 var form = layui.form;
		form.on('select(encryptFlag)',function(event){
			if(event.value == "Y"){
				$scope.passWohs = true;
				$scope.sysInf.externalHideMethod="888888*********8888";
			}else{
				$scope.sysInf.externalHideMethod="";
				$scope.sysInf.encryptInstrument="";
				$scope.passWohs = false;
			}
		});
	});
});
