'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('manageListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_manageList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.showQuotaTable = false;
		//动态请求下拉框 证件类型
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
				$("#manage_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#manage_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#manage_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#manage_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#manage_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#manage_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#manage_idNumber").attr("validator","noValidator");
				$scope.manageForm.$setPristine();
				$("#manage_idNumber").removeClass("waringform ");
            }
        });
		//发卡例外名单查询列表
		$scope.itemList = {
				params : $scope.queryParam = {
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				}, //表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'listManage.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_crpnd'],//查找数据字典所需参数
				transDict : ['authResp_authRespDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						$scope.showQuotaTable = false;
					}else{
						$scope.showQuotaTable = true;
					}
				}
			};
		$scope.selectList = function() {
			if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined)&&($scope.idType == "" || $scope.idType == null || $scope.idType == undefined)&&($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == null || $scope.itemList.params.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.itemList.data = [] ;
				 $scope.showQuotaTable = false;

			}else{
				if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002')); 

					}
					else{
						if($scope.idNumber && $scope.itemList.params.externalIdentificationNo){
							jfLayer.alert(T.T('SQJ800004'));

						}else{
							$scope.itemList.params.idNumber = $scope.idNumber;
							$scope.itemList.params.idType = $scope.idType;
							$scope.itemList.search();
						}
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));

					}
					else{
						if($scope.idNumber && $scope.itemList.params.externalIdentificationNo){
							jfLayer.alert(T.T('SQJ800004')); 

						}else{
							$scope.itemList.params.idNumber = $scope.idNumber;
							$scope.itemList.params.idType = $scope.idType;
							$scope.itemList.search();
						}
					}
				}
				else{
					if($scope.idNumber && $scope.itemList.params.externalIdentificationNo){
						jfLayer.alert(T.T('SQJ800004')); 

					}else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}
			}
		};
		//修改事件
		$scope.updateList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/customerInfo/manageUpdateMod.html', $scope.item, {
				title : T.T('SQJ800003'),
				buttons : [T.T('F00107'),T.T('F00108')  ],
				size : [ '800px', '340px' ],
				callbacks : [$scope.saveManage]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveManage = function(result) {
			$scope.item.authDataSynFlag = "1";
			jfRest.request('listManage', 'updateList', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.success(T.T('F00022') );
					$scope.item = {};
					$scope.safeApply();
					result.cancel();
					$scope.itemList.search();
				}
			});
		};
	});
});
