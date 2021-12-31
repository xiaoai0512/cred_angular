'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('mdmInfEnqrAndMntCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
    	$scope.queryProductForm = {};
    	$scope.queryProductForm1 = {};
    	//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
			  {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
			  {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
			  {name : T.T('F00116') ,id : '4'} ,//中国护照
			  {name : T.T('F00117') ,id : '5'} ,//外国护照
			  {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		$scope.stateArray = [ {
			name : T.T('KHJ4000001'),//'新发',
			id : '1'
		}, {
			name : T.T('KHJ4000002'),//'活跃',
			id : '2'
		}, {
			name : T.T('KHJ4000003'),//'非活跃',
			id : '3'
		}, {
			name : T.T('KHJ4000004'),//'已转出',
			id : '4'
		}, {
			name : T.T('KHJ4000005'),//'换卡未激活',
			id : '5'
		}, {
			name : T.T('KHJ4000006'),//'关闭',
			id : '8'
		}, {
			name : T.T('KHJ4000007'),//'待删除',
			id : '9'
		} ];
		$scope.activationFlag = [ {
			name : T.T('KHJ4000008'),//'已激活',
			id : '1'
		}, {
			name : T.T('KHJ4000009'),//'新发卡未激活',
			id : '2'
		}, {
			name : T.T('KHJ4000010'),//'毁卡补发/续卡未激活',
			id : '3'
		}, {
			name : T.T('KHJ4000011'),//'转卡未激活',
			id : '4'
		}, {
			name : T.T('KHJ4000012'),//'无需激活',
			id : '5'
		},{
			name : "提前续卡未激活",//'提前续卡未激活',
			id : '6'
		} ];
		$scope.activationModeType = [ {
			name : T.T('KHJ4000013'),//'人工激活',
			id : '1'
		}, {
			name : T.T('KHJ4000014'),//'无须激活',
			id : '2'
		} ];
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.queryProductForm.idNumber = '';
			if(data.value == "1"){//身份证
				$("#mdmMnt_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#mdmMnt_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#mdmMnt_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#mdmMnt_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#mdmMnt_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#mdmMnt_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#mdmMnt_idNumber").attr("validator","noValidator");
				$scope.mdmMntForm.$setPristine();
				$("#mdmMnt_idNumber").removeClass("waringform ");
            }
        });
		//联动验证
		var form = layui.form;
		form.on('select(getIdType2)',function(data){
			$scope.queryProductForm1.idNumber = '';
			if(data.value == "1"){//身份证
				$("#mdmMnt2_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#mdmMnt2_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#mdmMnt2_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#mdmMnt2_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#mdmMnt2_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#mdmMnt2_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#mdmMnt2_idNumber").attr("validator","noValidator");
				$scope.mdmMntForm2.$setPristine();
				$("#mdmMnt2_idNumber").removeClass("waringform ");
            }
        });
		// 输入外部识别号，查询媒介详细信息
		$scope.searchMediaDetail = function() {
			if($scope.queryProductForm.externalIdentificationNo == '' || $scope.queryProductForm.externalIdentificationNo == null || $scope.queryProductForm.externalIdentificationNo == undefined){
				jfLayer.alert(T.T('F00076'));//"请输入查询条件"
				return;
			}
			$scope.queryParam = {
				'externalIdentificationNo' : $scope.queryProductForm.externalIdentificationNo
			};
			jfRest.request('cstMediaList', 'queryMedia',$scope.queryParam).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows) {
						$scope.showMdmInfEstbInfoBtn = true;
						$scope.mediaDetailInfo = data.returnData.rows[0];
						if ($scope.mediaDetailInfo.mainSupplyIndicator == 1) {
							$scope.mediaDetailInfo.mainAttachmentDesc = T.T('KHJ4000015');//'主卡';
						} else {
							$scope.mediaDetailInfo.mainAttachmentDesc = T.T('KHJ4000016');//'附卡';
						}
						if ($scope.mediaDetailInfo.invalidFlag == 'N') {
							$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000017');//"无效";
							if ($scope.mediaDetailInfo.invalidReason == 'TRF') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000018');//"转卡";
							} else if ($scope.mediaDetailInfo.invalidReason == 'EXP') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000019');//"到期";
							} else if ($scope.mediaDetailInfo.invalidReason == 'BRK') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000020');//"毁损";
							} else if ($scope.mediaDetailInfo.invalidReason == 'CLS') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000021');//"关闭";
							}else if ($scope.mediaDetailInfo.invalidReason == 'PNA') {
								$scope.mediaDetailInfo.invalidReasonStr = "提前续卡";//"关闭";
							}
						} else {
							$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000022');//"有效";
						}
					} else {
						jfLayer
								.alert(T.T('KHJ4000023'));//"没有相应的数据！"
					}
				}else {
					$scope.showMdmInfEstbInfoBtn = false;
				}
			});
		};
		$scope.searchProduct = function() {
			if ( ($scope.queryProductForm.idType == "" || $scope.queryProductForm.idType == undefined) &&
					($scope.queryProductForm.idNumber == "" || $scope.queryProductForm.idNumber == undefined)) {
				jfLayer.alert(T.T('F00076'));//"请输入查询条件"
			} 
			else {
				if($scope.queryProductForm["idType"]){
					if($scope.queryProductForm["idNumber"] == null || $scope.queryProductForm["idNumber"] == undefined || $scope.queryProductForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.isProShowWindow($scope.queryProductForm);
					}
				}else if($scope.queryProductForm["idNumber"]){
					if($scope.queryProductForm["idType"] == null || $scope.queryProductForm["idType"] == undefined || $scope.queryProductForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.isProShowWindow($scope.queryProductForm);
					}
				}else {
					$scope.isProShowWindow($scope.queryProductForm);
				}
			}
		};
		//产品弹窗，根据查询正确在弹窗
		$scope.isProShowWindow = function(params){
			jfRest.request('cstMediaList', 'queryProduct',params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal(
							'/cstSvc/mdmInfMgt/searchProduct.html',
							$scope.queryProductForm,
							{
								title : T.T('KHJ4000024'),//'客户产品基本信息',
								buttons : [ T.T('F00107'),T.T('F00108')],//'确认', '关闭' 
								size : [ '1100px', '500px' ],
								callbacks : [ $scope.callbackquery ]
						});
				} 
			});
		};
		$scope.queryProductForm1 = {};
		$scope.searchMediaList = function() {
			if (	($scope.queryProductForm1.idType == "" || $scope.queryProductForm1.idType == undefined) &&
					 ($scope.queryProductForm1.idNumber == "" || $scope.queryProductForm1.idNumber == undefined)) {
				jfLayer.alert(T.T('F00076'));//"请输入证件号码或产品对象代码!" + ""

			} 
			else {
				if($scope.queryProductForm1["idType"]){
					if($scope.queryProductForm1["idNumber"] == null || $scope.queryProductForm1["idNumber"] == undefined || $scope.queryProductForm1["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.isMdmShowWindow($scope.queryProductForm1);
					}
				}else if($scope.queryProductForm1["idNumber"]){
					if($scope.queryProductForm1["idType"] == null || $scope.queryProductForm1["idType"] == undefined || $scope.queryProductForm1["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.isMdmShowWindow($scope.queryProductForm1);
					}
				}else {
					$scope.isMdmShowWindow($scope.queryProductForm1);
				}
			}
		};
	//弹窗
		$scope.isMdmShowWindow = function(params){
			jfRest.request('cstMediaList', 'queryMedia',params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal('/cstSvc/mdmInfMgt/searchMediaList.html',params,{
								title : T.T('KHJ4000026'),//'客户媒介基本信息',
								buttons : [ T.T('F00107'),T.T('F00108') ],//'确认', '关闭'
								size : [ '1100px', '500px' ],
								callbacks : [ $scope.callbackquery ]
						});
				} 
			});
		};
		$scope.productFormTable = {
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryProductForm',// 列表的资源
			autoQuery : false,
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.mediaBindInfoTable = {
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryMediaBind',// 列表的资源
			autoQuery : false,
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 重置方法1
		$scope.resultInfoOne = function() {
			$scope.queryProductForm.idType = "";
			$scope.queryProductForm.idNumber = "";
			$scope.queryProductForm.phoneNumber = "";
			$scope.queryProductForm.customerNo = "";
			$scope.showMdmInfEstbInfoBtn = false;
			$("#mdmMnt_idNumber").attr("validator","noValidator");
			$("#mdmMnt_idNumber").removeClass("waringform ");
		};
		// 重置方法2
		$scope.resultInfoTwo = function() {
			$scope.queryProductForm1.idType = "";
			$scope.queryProductForm1.idNumber = "";
			$scope.queryProductForm1.productObjectCode = "";
			$scope.showMdmInfEstbInfoBtn = false;
			$("#mdmMnt_idNumber").attr("validator","noValidator");
			$("#mdmMnt_idNumber").removeClass("waringform ");
		};
		// 重置方法3
		$scope.resultInfoThree = function() {
			$scope.queryProductForm.externalIdentificationNo = "";
			$scope.showMdmInfEstbInfoBtn = false;
		};
		$scope.callbackquery = function(result) {
			if(!result.scope.cstMediaTable.validCheck()){
				return;
			}
			$scope.mediaDetailInfo = result.scope.cstMediaTable
					.checkedList();
			if ($scope.mediaDetailInfo.mainSupplyIndicator == 1) {
				$scope.mediaDetailInfo.mainAttachmentDesc = T.T('KHJ4000015');//'主卡';
			} else {
				$scope.mediaDetailInfo.mainAttachmentDesc = T.T('KHJ4000016');//'附属卡';
			}
			if ($scope.mediaDetailInfo.invalidFlag == 'N') {
				$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000017');//"无效";
				if ($scope.mediaDetailInfo.invalidReason == 'TRF') {
					$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000018');//"转卡";
				} else if ($scope.mediaDetailInfo.invalidReason == 'EXP') {
					$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000019');//"到期";
				} else if ($scope.mediaDetailInfo.invalidReason == 'BRK') {
					$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000020');//"毁损";
				} else if ($scope.mediaDetailInfo.invalidReason == 'CLS') {
					$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000021');//"关闭";
				} else if ($scope.mediaDetailInfo.invalidReason == 'RAN') {
					$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000027');//"续卡未激活";
				} else if ($scope.mediaDetailInfo.invalidReason == 'PNA') {
					$scope.mediaDetailInfo.invalidReasonStr = "提前续卡未激活";//"提前续卡未激活";
				}
			} else {
				$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000022');//"有效";
			}			
			$scope.showMdmInfEstbInfoBtn = true;
			// 查询产品形式
			$scope.safeApply();
			result.cancel();
		};
		$scope.saveMediaInfo = function() {
			/*
			 * $scope.queryParam = { evnetId:'BSS.UP.01.0011',
			 * 'productObjectCode':$scope.queryProductForm.productObjectCode }
			 */
			for(var key in $scope.mediaDetailInfo){
				if($scope.mediaDetailInfo[key] == '' || $scope.mediaDetailInfo[key] == 'null'  || $scope.mediaDetailInfo[key] == null || $scope.mediaDetailInfo[key] == undefined){
					$scope.mediaDetailInfo[key] = null;
				}
			}
			jfRest
					.request('cstMediaList', 'updateMedia',
							$scope.mediaDetailInfo)
					.then(
							function(data) {
								if (data.returnCode == '000000') {
									jfLayer.success(T.T('F00032'));//"保存成功"
									$scope.showMdmInfEstbInfoBtn = false;
									$scope.mediaDetailInfo = {};
								} else {
									jfLayer.fail(T.T('KHJ4000028')
											+ data.returnMsg);//"保存失败，失败原因："
								}
							});
		}
	});
	webApp.controller('searchMediaListCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translate.refresh();
		// 客户媒介信息
		$scope.cstMediaTable = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				"idType" : $scope.queryProductForm1.idType,
				"idNumber" : $scope.queryProductForm1.idNumber,
				"productObjectCode" : $scope.queryProductForm1.productObjectCode
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryMedia',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		}
	});
	webApp.controller('searchProductCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translate.refresh();				
		$scope.isShow = false;
		$scope.cstProductTable = {
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				"idType" : $scope.queryProductForm.idType,
				"idNumber" : $scope.queryProductForm.idNumber,
				"mobilePhone" : $scope.queryProductForm.mobilePhone,
				"mainCustomerCode" : $scope.queryProductForm.customerNo
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryProduct',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
			$scope.selectMediaList = function(e) {
				$scope.isShow = true;
				$scope.cstMediaTable.params.productObjectCode = e.productObjectCode;
				$scope.cstMediaTable.params.customerNo = e.customerNo;
				$scope.cstMediaTable.search();
			};
				$scope.cstMediaTable = {
					checkType : 'radio',
					params : $scope.queryParam = {
						"pageSize" : 10,
						"indexNo" : 0,
						"idType" : $scope.queryProductForm.idType,
						"idNumber" : $scope.queryProductForm.idNumber
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'cstMediaList.queryMedia',// 列表的资源
					autoQuery : false,
					callback : function(data) { // 表格查询后的回调函数
					}
				}
			});
});
