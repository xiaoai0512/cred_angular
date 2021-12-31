'use strict';
define(function(require) {

	var webApp = require('app');

	// 收费项目
	webApp.controller('payProjectCtrlOld', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.payProInf ={};
		
		//维度取值1
		/*MODT：业务类型
			MODP：产品对象
			MODM：媒介对象
			CURR：币种
			CHAN：渠道*/
		$scope.instanDimenArr = [ {
			name : T.T('PZJ1100001'),
			id : 'MODT'
		}, {
			name : T.T('PZJ1100002'),
			id : 'MODP'
		}, {
			name : T.T('PZJ1100003'),
			id : 'MODM'
		},{
			name : T.T('PZJ1100004'),
			id : 'CURR'
		},{
			name : T.T('PZJ1100005'),
			id : 'CHAN'
		} ,{
			name : T.T('PZJ1100006'),
			id : 'TERM'
		},{
			name : T.T('PZJ1100008'),
			id : 'MODG'
		},{
			name : T.T('YYJ1300039'),
			id : 'INST'
		},{
			name : T.T('YYJ1300040'),
			id : 'FTYP'
		}];
		
		
		/*ANNF-年费
		LCHG-延滞金
		OVRF-超限费
		CSHF-取现手续费
		TXNF-转账手续费
		SVCF-服务费
		ISSF-制卡费*/
		$scope.feeTypeArr = [ {
			name : T.T('PZJ1100009'),
			id : 'ANNF'
		}, {
			name : T.T('PZJ1100010'),
			id : 'LCHG'
		}, {
			name : T.T('PZJ1100011'),
			id : 'OVRF'
		} , {
			name : T.T('PZJ1100012'),
			id : 'CSHF'
		} , {
			name : T.T('PZJ1100013'),
			id : 'TXNF'
		} , {
			name : T.T('PZJ1100014'),
			id : 'SVCF'
		} , {
			name : T.T('PZJ1100015'),
			id : 'ISSF'
		} , {
			name : T.T('PZJ1100016'),
			id : 'ISTF'
		} ];
		//项目用途C: 费用计算，P:费用入账
		$scope.itemUseArr = [{name : T.T('PZJ1100026'),id : 'C'},{name : T.T('PZJ1100027'), id : 'P'}];
		//计费方式 F：固定金额 M：费用矩阵
		 $scope.assessmentMethodArr = [{name : T.T('YYJ1300001'),id : 'F'},{name : T.T('YYJ1300002'),id : 'M'}];
		
		//日期控件
			layui.use('laydate', function(){
				  var laydate = layui.laydate;
				  
				  var startDate = laydate.render({
						elem: '#effectiveDate',
						//min:"2019-03-01",
						done: function(value, date) {
							endDate.config.min = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							endDate.config.start = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							
							$scope.payProInf.effectiveDate = $("#effectiveDate").val();
						}
					});
					var endDate = laydate.render({
						elem: '#expirationDate',
						//min:Date.now(),
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							
							$scope.payProInf.expirationDate = $("#expirationDate").val();
						}
					});
				  
			});
			//日期控件end
		 
		
		$scope.choseEvent = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/payProject/choseEvent.html', $scope.params, {
					title : T.T('PZJ1100017'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.choseEventFee]
				});
		};
		$scope.choseEventFee = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.payProInf.feeEventNo  = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBusinessItems = function(){
			//弹框查询列表
			$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/payProject/choseBusinessItems.html', $scope.params, {
					title : T.T('PZJ1100018'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.choseBusinessItem]
				});
		};
		$scope.choseBusinessItem = function(result){
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.proLineList.checkedList();
			$scope.payProInf.defaultBusinessItem  = $scope.checkedEvent.businessProgramNo;
			$scope.safeApply();
			result.cancel();
		};
		$scope.savePayPro = function(){
			if($scope.payProInf.effectiveDate>$scope.payProInf.expirationDate){
				jfLayer.fail(T.T('PZJ1100019'));
				return;
			}
			for(var key in $scope.payProInf){
				if($scope.payProInf[key] == "null" || $scope.payProInf[key] == null){
					$scope.payProInf[key] = '';
				}
            }
            jfRest.request('feeProject', 'save', $scope.payProInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.payProInf = '';
					$scope.payProInfForm.$setPristine();
				}
			});
		};
	

	});
	//事件
	webApp.controller('choseEventFeeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	
	//业务项目
	webApp.controller('choseBusinessItemsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		// 事件清单列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	
	
});
