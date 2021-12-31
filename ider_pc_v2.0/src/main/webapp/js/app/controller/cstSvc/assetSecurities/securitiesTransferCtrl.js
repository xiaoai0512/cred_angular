'use strict';
define(function(require) {
	var webApp = require('app');
	// 资产证券回购
	webApp.controller('securitiesTransferCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_priceView');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.packetForm = {};
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
            	$scope.idNumber = '';
            	if(data.value == "1"){//身份证
            		$("#buyBack_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#buyBack_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#buyBack_idNumber").attr("validator","id_isTWCard");
            	}else if(data.value == "4"){//中国护照
            		$("#buyBack_idNumber").attr("validator","id_passport");
            	}else if(data.value == "5"){//外国护照passport
            		$("#buyBack_idNumber").attr("validator","id_passport");
            	}else if(data.value == "6"){//外国人永久居留证
            		$("#buyBack_idNumber").attr("validator","id_isPermanentReside");
            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#buyBack_idNumber").attr("validator","noValidator");
            		$scope.buyBackItemForm.$setPristine();
            		$("#buyBack_idNumber").removeClass("waringform ");
                }
            });
		// 重置事件
		$scope.reset = function() {
			$scope.packetForm.idNumber= '';
			$scope.packetForm.externalIdentificationNo= '';
			$scope.packetForm.idType= '';
			$scope.isShow = false;
			$("#buyBack_idNumber").attr("validator","noValidator");
			$("#buyBack_idNumber").removeClass("waringform ");
		};
		//查询事件
		$scope.querybuyBackInf = function(){
			if(($scope.buyBackForm.idType == null || $scope.buyBackForm.idType == ''|| $scope.buyBackForm.idType == undefined) &&
					($scope.buyBackForm.idNumber == "" || $scope.buyBackForm.idNumber == undefined )
					&&( $scope.buyBackForm.externalIdentificationNo == "" || $scope.buyBackForm.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.buyBackForm.idType){
					if($scope.buyBackForm.idNumber == null || $scope.buyBackForm.idNumber == undefined || $scope.buyBackForm.idNumber == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else if($scope.buyBackForm.externalIdentificationNo){
						jfLayer.alert(T.T('F00076'));
						$scope.isShow = false;
					}else {
						$scope.itemList.params.idType = $scope.buyBackForm.idType;
						$scope.itemList.params.idNumber = $scope.buyBackForm.idNumber;
						$scope.itemList.search();
					}
				}else if($scope.buyBackForm.idNumber){
					if($scope.buyBackForm.idType == null || $scope.buyBackForm.idType == undefined || $scope.buyBackForm.idType == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else if($scope.packetForm.externalIdentificationNo){
						jfLayer.alert('F00076');
						$scope.isShow = false;
					}else {
						$scope.itemList.params.idType = $scope.buyBackForm.idType;
						$scope.itemList.params.idNumber = $scope.buyBackForm.idNumber;
						$scope.itemList.search();
					}
				}else if($scope.buyBackForm.externalIdentificationNo){
					$scope.itemList.params.externalIdentificationNo = $scope.buyBackForm.externalIdentificationNo;
					$scope.itemList.search();
				}
			}
		};
		//查询
		$scope.itemList = {
			//checkType : 'radio',
			params : {
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'assetSecurities.queryBuyback',// 列表的资源
			autoQuery: false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_assetSubTable','dic_capitalStage'],//查找数据字典所需参数
			transDict : ['absStatus_absStatusDesc','capitalStage_capitalStageDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.isShow = true;
					if(!data.returnData.rows ){
						data.returnData.rows = [];
					}
				}else{
					$scope.isShow = false;
				}
			}
		};
		//回购
		$scope.ishide=true;
		$scope.buyBackInf = function(item,type){
			$scope.items = {};
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.items.externalIdentificationNo = $scope.buyBackForm.externalIdentificationNo;
			$scope.items.idType = $scope.buyBackForm.idType;
			$scope.items.idNumber=$scope.buyBackForm.idNumber;
			$scope.items.type=type;
			jfRest.request('assetSecurities', 'alreadyBuyback', $scope.items).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ6000005'));
					$scope.itemList.params.idType= $scope.buyBackForm.idType;
					$scope.itemList.params.idNumber= $scope.buyBackForm.idNumber;
					$scope.itemList.params.externalIdentificationNo=$scope.buyBackForm.externalIdentificationNo;
					$scope.itemList.search();
					$scope.ishide=false;
				} 
			});
		};
	});
});
