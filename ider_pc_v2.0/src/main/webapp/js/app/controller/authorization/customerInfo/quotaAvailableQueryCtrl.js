'use strict';
define(function(require) {
	var webApp = require('app');
	// 测试
	webApp.controller('quotaAvailableQueryCtrl', function($scope, $stateParams, jfRest,
														  $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T,$timeout) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaAvailableQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//证件类型
		$scope.certificateTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_certificateType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//可用额度查询类别
		$scope.availableClassArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_availableClass",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$scope.showQuotaTable = false;//额度表
		$scope.quotaListL = [];
		$scope.quotaListB = [];
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			if(data.value == "1"){//身份证
				$("#quotaQuery_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#quotaQuery_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#quotaQuery_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#quotaQuery_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#quotaQuery_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#quotaQuery_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#quotaQuery_idNumber").attr("validator","noValidator");
				$scope.quotaAvailableQueryForm.$setPristine();
				$("#quotaQuery_idNumber").removeClass("waringform ");
            }
        });

		//点击查询,显示额度查询表格
		$scope.queryAvailableQuota = function() {
			if (($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) && ($scope.idType == "" || $scope.idType == null || $scope.idType == undefined) &&
				($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined)){
				jfLayer.alert(T.T('SQJ100001'));
			} else {
				if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002'));
					}
					else{
						$scope.quotaResult();
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));
					}
					else{
						$scope.quotaResult();
					}
				}
				else{
					$scope.quotaResult();
				}
			}
		};

		$scope.quotaAvailableArray = $scope.builder.option({});
		//$scope.isDateList = false;
		$scope.isDateList2 = false;
		$scope.quotaResult = function(){
			$scope.quotaParams = {
				authDataSynFlag:"1",
				availableClass:"P",
				externalIdentificationNo:$scope.externalIdentificationNo,
			};
			jfRest.request('quotaAvailable', 'query', $scope.quotaParams).then(function(data) {
				$scope.quotaList = {};
				if(data.returnMsg == 'OK'){
					if(data.returnData == null || data.returnData.rows.length == 0){
						jfLayer.alert(T.T('SQJ500002'));   //'暂无数据'
						$scope.showQuotaTable = false;
						$scope.itemListb.params = $scope.quotaParams;
					}else {
						$scope.showQuotaTable = true;
						$scope.productObjectCodeNG = "";
						if(data.returnData.rows.length>0 &&data.returnData.rows[0].productObjectCode){
							$scope.productObjectCodeNG = data.returnData.rows[0].productObjectCode;
						}
						var creditNodeDescNG = "";
						var productObjectCodeNG = "";
						for(var i=0;i<data.returnData.rows.length;i++){
							if(data.returnData.rows[i].creditNodeDesc == creditNodeDescNG){
								data.returnData.rows[i].creditNodeDesc = "";
							}else{
								creditNodeDescNG = data.returnData.rows[i].creditNodeDesc;
							}
						}
						$scope.quotaList = [];
						$scope.quotaList = data.returnData.rows;
						if($scope.quotaList.length > 0){
							$scope.isDateList2 = false;
						}else{
							$scope.isDateList2 = true;
						}
                    }
                } else {
					$scope.quotaList = [];
					$scope.showQuotaTable = false;//额度表
				}
			});
		};
		$scope.itemListb = {
			autoQuery:false,
			resource : 'quotaAvailable.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){

				}else{
					jfLayer.alert(data.returnMsg);
				}
			}
		};

	});
});
