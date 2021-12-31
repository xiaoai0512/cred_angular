'use strict';
define(function(require) {
	var webApp = require('app');
	//客户信息建立
	webApp.controller('csrUnifyInfCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		//账单日
		$scope.statementDateArr =
									[ {name : '01', id : '01'}, {name : '02',id : '02'},{name : '03', id : '03'}, {name : '04',id : '04'},{name : '05',id : '05'},
		                            {name : '06', id : '06'}, {name : '07',id : '07'},{name : '08', id : '08'}, {name : '09',id : '09'},{name : '10',id : '10'},
		                            {name : '11', id : '11'}, {name : '12',id : '12'},{name : '13', id : '13'}, {name : '14',id : '14'},{name : '15',id : '15'},
		                            {name : '16', id : '16'}, {name : '17',id : '17'},{name : '18', id : '18'}, {name : '19',id : '19'},{name : '20',id : '20'},
		                            {name : '21', id : '21'}, {name : '22',id : '22'},{name : '23', id : '23'}, {name : '24',id : '24'},{name : '25',id : '25'},
		                            {name : '26', id : '26'}, {name : '27',id : '27'},{name : '28', id : '28'}, {name : '29',id : '29'},{name : '30',id : '30'},
		                            {name : '31',id : '31'}];
		$scope.showItemList = false;
		$scope.searchCstAdrQuery = function(){
			if(($scope.csrUnifyInfList.params.idNumber == "" || $scope.csrUnifyInfList.params.idNumber == undefined ) && ( $scope.csrUnifyInfList.params.externalIdentificationNo == "" || $scope.csrUnifyInfList.params.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert("请输入证件号码或外部识别号");
			}
			else{
				$scope.csrUnifyInfList.search();
			}
		};
		//查询列表
		$scope.csrUnifyInfList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery : false,
				resource : 'csrUnifyInf.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						$scope.showItemList = false;
					}
					else{
						$scope.showItemList = true;
					}
				}
			};
		//详情
		$scope.checkCsrUnifyInf = function(item){
			$scope.csrUnifyItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/csrUnifyInf/viewCsrUnifyInf.html', $scope.csrUnifyItem, {
				title : '产品线统一日期信息',
				buttons : [ '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//新增
		$scope.newBillDate = function(){
			if(($scope.csrUnifyInfList.params.idNumber == "" || $scope.csrUnifyInfList.params.idNumber == undefined ) && ( $scope.csrUnifyInfList.params.externalIdentificationNo == "" || $scope.csrUnifyInfList.params.externalIdentificationNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert("请输入证件号码或外部识别号");
			}else{
				//先查询客户代码
				$scope.paramss = {idNumber:$scope.csrUnifyInfList.params.idNumber,
						externalIdentificationNo:$scope.csrUnifyInfList.params.externalIdentificationNo	
				};
				jfRest.request('cstInfQuery', 'queryInf', $scope.paramss)//Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						if(data.returnData.rows[0].customerNo == null ||  data.returnData.rows[0].customerNo == ''){
							jfLayer.alert("获取不到客户信息！");
						}else{
							$scope.infoAdd = {customerNo:data.returnData.rows[0].customerNo};
							$scope.modal('/cstSvc/csrUnifyInf/csrUnifyInfAdd.html', $scope.infoAdd, {
								title : '新增',
								buttons : [ '确认', '关闭' ],
								size : [ '800px', '300px' ],
								callbacks : [ $scope.selectCorporat ]
							});
						}
					}
					});
			}
	    };
		// 回调函数/确认按钮事件
		$scope.selectCorporat = function(result) {
			$scope.paramsAdd = result.scope.infoAdd;
			jfRest.request('updateBillDay', 'save', $scope.paramsAdd)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.csrUnifyInfList.params.customerNo = data.returnData.customerNo;
						jfLayer.success("修改成功");
						$scope.csrUnifyInfList.search();
						$scope.safeApply();
						result.cancel();
					}
				}
				});
		}
	});
	//新增
	webApp.controller('cusUnifyAddCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
	});
	//查询
	webApp.controller('viewProLineUnifyDateCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.proLineUnifyDateList = {
				params : $scope.queryParam = {
					"productLineCode" : $scope.csrUnifyItem.productLineCode,
					"customerNo" : $scope.csrUnifyItem.customerNo,
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'csrUnifyInf.queryProLineUnifyDate',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
});
