'use strict';
define(function(require) {

	var webApp = require('app');

	webApp.controller('activityNowCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_entryAdd');
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_tradingNow');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
        $scope.tableInfo = false;
        $scope.certificateTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_certificateType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
        //联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
        	if(data.value == "1"){//身份证
        		$("#authNo_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#authNo_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#authNo_idNumber").attr("validator","id_isTWCard");

        	}else if(data.value == "4"){//中国护照
        		$("#authNo_idNumber").attr("validator","id_passport");

        	}else if(data.value == "5"){//外国护照passport
        		$("#authNo_idNumber").attr("validator","id_passport");

        	}else if(data.value == "6"){//外国人永久居留证
        		$("#authNo_idNumber").attr("validator","id_isPermanentReside");

        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#authNo_idNumber").attr("validator","noValidator");
        		$scope.queryAuthNoForm.$setPristine();
        		$("#authNo_idNumber").removeClass("waringform ");
            }
        });
        $scope.authSceneArray ={ 
 		        type:"dynamicDesc", 
 		        param:{},//默认查询条件 
 		        text:"authSceneCode", //下拉框显示内容，根据需要修改字段名称 
 		        desc:"sceneDesc",
 		        value:"authSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
 		        resource:"scenario.scenarioQuery",//数据源调用的action 
 		        callback: function(data){
 		        }
 		};
 		// 日期控件
 		layui.use('laydate', function(){
 			  var laydate = layui.laydate;
 			  var startDate = laydate.render({
 					elem: '#LAY_start_Add',
 					min:Date.now(),
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
 					}
 				});
 				var endDate = laydate.render({
 					elem: '#LAY_end_Add',
 					done: function(value, date) {
 						startDate.config.max = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						}
 					}
 				});
 			  
 		});
		//未达授权查询列表
		$scope.itemList = {
				params : $scope.queryParam = {
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'activityNowList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_transStatus'],//查找数据字典所需参数
				transDict : ['transStatus_transStatusDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.tableInfo = true;
					}else{
						jfLayer.alert(data.returnMsg);
						$scope.tableInfo = false;
					}
				}
			};
		$scope.selectList = function() {
			$scope.itemList.params.startDate = $("#LAY_start_Add").val();
			$scope.itemList.params.endDate = $("#LAY_end_Add").val();
			if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined)&&($scope.idType == "" || $scope.idType == null || $scope.idType == undefined)&&($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == null || $scope.itemList.params.externalIdentificationNo == undefined)){
				$scope.itemList.search();
			}else{
				if($scope.idNumber && $scope.itemList.params.externalIdentificationNo){
					jfLayer.fail(T.T('SQJ600005'));
					$scope.closeInfo();

				}else if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002')); 

					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));

					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}
				else{
					$scope.itemList.params.idNumber = $scope.idNumber;
					$scope.itemList.params.idType = $scope.idType;
					$scope.itemList.search();
				}
			}
		};
	});
	
});
