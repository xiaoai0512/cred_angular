'use strict';
define(function(require) {
	var webApp = require('app');
	// 资产证券封包
	webApp.controller('assetSecuritiesEnclosureCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/assetSecurities/i18n_assetSecurities');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_priceView');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.packetForm = {};
    	$scope.packedInf ={};
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
            		$("#packet_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#packet_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#packet_idNumber").attr("validator","id_isTWCard");
            	}else if(data.value == "4"){//中国护照
            		$("#packet_idNumber").attr("validator","id_passport");
            	}else if(data.value == "5"){//外国护照passport
            		$("#packet_idNumber").attr("validator","id_passport");
            	}else if(data.value == "6"){//外国人永久居留证
            		$("#packet_idNumber").attr("validator","id_isPermanentReside");
            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#packet_idNumber").attr("validator","noValidator");
            		$scope.packetItemForm.$setPristine();
            		$("#packet_idNumber").removeClass("waringform ");
                }
            });
		// 重置事件
		$scope.reset = function() {
			$scope.packetForm.idNumber= '';
			$scope.packetForm.externalIdentificationNo= '';
			$scope.packetForm.idType= '';
			$scope.isShow = false;
			$("#packet_idNumber").attr("validator","noValidator");
			$("#packet_idNumber").removeClass("waringform ");
		};
		//查询事件
		$scope.queryPacketInf = function(){
			if(($scope.packetForm.idType == null || $scope.packetForm.idType == ''|| $scope.packetForm.idType == undefined) &&
					($scope.packetForm.idNumber == "" || $scope.packetForm.idNumber == undefined )
					&&( $scope.packetForm.externalIdentificationNo == "" || $scope.packetForm.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.packetForm.idType){
					if($scope.packetForm.idNumber == null || $scope.packetForm.idNumber == undefined || $scope.packetForm.idNumber == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else if($scope.packetForm.externalIdentificationNo){
						jfLayer.alert('F00076');
						$scope.isShow = false;
					}else {
						$scope.itemList.params.idType = $scope.packetForm.idType;
						$scope.itemList.params.idNumber = $scope.packetForm.idNumber;
						$scope.itemList.search();
					}
				}else if($scope.packetForm.idNumber){
					if($scope.packetForm.idType == null || $scope.packetForm.idType == undefined || $scope.packetForm.idType == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else if($scope.packetForm.externalIdentificationNo){
						jfLayer.alert('F00076');
						$scope.isShow = false;
					}else {
						$scope.itemList.params.idType = $scope.packetForm.idType;
						$scope.itemList.params.idNumber = $scope.packetForm.idNumber;
						$scope.itemList.search();
					}
				}else if($scope.packetForm.externalIdentificationNo){
					$scope.itemList.params.externalIdentificationNo = $scope.packetForm.externalIdentificationNo;
					$scope.itemList.search();
				}
			}
		};
		//查询列表的接口
		$scope.itemList = {
			//checkType : 'radio',
			params : {
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery: false,
			resource : 'assetSecurities.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_assetSubTable'],//查找数据字典所需参数
			transDict : ['absStatus_absStatusDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					if(data.returnData && data.returnData.rows && data.returnData.rows.length > 0){
						for(var i = 0 ; i < data.returnData.rows.length; i++){
							if(!data.returnData.rows[i].totalBalance){
								data.returnData.rows[i].totalBalance = 0;
                            }
                        }
                    }
                    $scope.isShow = true;
				}else{
					$scope.isShow = false;
				}
			}
		};
		//封包
		$scope.ishide=true;
		$scope.editPacketInf = function(item){
			$scope.items = {};
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.items.externalIdentificationNo = $scope.packetForm.externalIdentificationNo;
			$scope.items.idType = $scope.packetForm.idType;
			$scope.items.idNumber=$scope.packetForm.idNumber;
			jfRest.request('assetSecurities', 'queryPacket', $scope.items).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ6000001'));
					$scope.itemList.params.idType= $scope.packetForm.idType;
					$scope.itemList.params.idNumber= $scope.packetForm.idNumber;
					$scope.itemList.params.externalIdentificationNo=$scope.packetForm.externalIdentificationNo;
					$scope.itemList.search();
					$scope.ishide=false;
				} 
			});
		};
	});
});
