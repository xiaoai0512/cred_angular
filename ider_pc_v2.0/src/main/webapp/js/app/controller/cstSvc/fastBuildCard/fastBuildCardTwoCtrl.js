'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户一键制卡,根据身份证查询，分为申请产品和申请附属卡
	webApp.controller('fastCardTwoCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $timeout, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');// 收费项目
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");// 菜单名
		$scope.systemEnvironmentFlag = lodinDataService.getObject("systemEnvironmentFlag");// 环境标示
		$scope.searchDiv = true;
		$scope.custBaseInfDiv = false;
		$scope.proInfDiv = false;
		$scope.mediaInfDiv = false;
		$scope.overShowBaseInfDiv = false;// 一键制卡成功后，显示的基本信息模块
		$scope.isShowBudge = false;
		// 上一步按钮
		$scope.preBtn = true;
		$scope.pre2Btn = true;
		$scope.cstQueryObj = {};
		$scope.hideObj = {};// 隐藏域
		$scope.isSupportDiv = false;
		$scope.custNicknameDiv = false;
		$scope.isShowFormatCode = true; // 默认显示卡版代码
		// 联动验证
		var form = layui.form;
		form.on('select(getIdType)', function(data) {
			$("#fastBuildCardTwo_idNumber").val("");
			$scope.cstBaseInf.idNumber = '';
			$scope.custBaseInfDiv = false;
			$scope.cstBaseInf.idType = $scope.cstQueryObj.idType;
			if ($scope.cstBaseInf.idType == '2' || $scope.cstBaseInf.idType == '3') {
				$scope.showHkgMark = true;
			} else {
				$scope.showHkgMark = false;
			}
			if ($scope.systemEnvironmentFlag == 'TEST') {
				if (data.value == "1") {// 身份证
					$scope.cstQueryObj.idNumber = '';
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_idcard");
				} else if (data.value == "2") {// 港澳居民来往内地通行证
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_isHKCard");
				} else if (data.value == "3") {// 台湾居民来往内地通行证
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_isTWCard");
				} else if (data.value == "4") {// 中国护照
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_passport");
				} else if (data.value == "5") {// 外国护照passport
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_passport");
				} else if (data.value == "6") {// 外国人永久居留证
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_isPermanentReside");
				} else if (data.value == "0" || data.value == null || data.value == undefined || data.value == "") {// 其他
					$("#fastBuildCardTwo_idNumber").attr("validator", "noValidator");
					$scope.searchInfForm.$setPristine();
					$("#fastBuildCardTwo_idNumber").removeClass("waringform ");
				}
            } else if ($scope.systemEnvironmentFlag == 'PROD') {
				if (data.value == "1") {// 身份证
					$scope.cstQueryObj.idNumber = '';
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_idcardPro");
				} else if (data.value == "2") {// 港澳居民来往内地通行证
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_isHKCard");
				} else if (data.value == "3") {// 台湾居民来往内地通行证
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_isTWCard");
				} else if (data.value == "4") {// 中国护照
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_passport");
				} else if (data.value == "5") {// 外国护照passport
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_passport");
				} else if (data.value == "6") {// 外国人永久居留证
					$("#fastBuildCardTwo_idNumber").attr("validator", "id_isPermanentReside");
				} else if (data.value == "0" || data.value == null || data.value == undefined || data.value == "") {// 其他
					$("#fastBuildCardTwo_idNumber").attr("validator", "noValidator");
					$scope.searchInfForm.$setPristine();
					$("#fastBuildCardTwo_idNumber").removeClass("waringform ");
				}
            }
		});
		form.on('select(getIdType2)', function(data) {
			$("#fastBuildCardTwo_idNumber").val("");
			$scope.cstBaseInf.idNumber = '';
			$scope.cstQueryObj.idType = $scope.cstBaseInf.idType;
			if ($scope.cstQueryObj.idType == '2' || $scope.cstQueryObj.idType == '3') {
				$scope.showHkgMark = true;
			} else {
				$scope.showHkgMark = false;
			}
		});
		// 定价层级
		/*
		 * $scope.labelScopeArr ={};
		 * form.on('select(pricingLev)',function(data){ $scope.params ={};
		 * $scope.params.idType = $scope.cstQueryObj.idType;
		 * $scope.params.idNumber = $scope.cstQueryObj.idNumber;
		 * //$scope.changeOption = function(data) { $scope.labelScopeArr ={};
		 * if(data.value == "C"){ $scope.labelScopeArr ={ type:"dynamicDesc",
		 * param:$scope.params ,//默认查询条件 text:"customerNo", //下拉框显示内容，根据需要修改字段名称
		 * desc:"customerName", value:"customerNo", //下拉框对应文本的值，根据需要修改字段名称
		 * resource:"cstInfQuery.queryCstNo",//数据源调用的action callback:
		 * function(data){ if(data){
		 *
		 * }else { var returnMsg = data.returnMsg ? data.returnMsg :
		 * T.T('F00035'); jfLayer.fail(returnMsg); } } }; }else if(data.value ==
		 * "G"){ $scope.labelScopeArr ={ type:"dynamicDesc", param:$scope.params
		 * ,//默认查询条件 text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称
		 * desc:"programDesc", //下拉框显示内容，根据需要修改字段名称 value:"businessProgramNo",
		 * //下拉框对应文本的值，根据需要修改字段名称 resource:"cstBsnisItem.query",//数据源调用的action
		 * callback: function(data){ if(data){
		 *
		 * }else { var returnMsg = data.returnMsg ? data.returnMsg :
		 * T.T('F00035'); jfLayer.fail(returnMsg); } } }; }else if(data.value ==
		 * "P"){ $scope.labelScopeArr ={ type:"dynamicDesc", param:$scope.params
		 * ,//默认查询条件 text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称
		 * desc:"productDesc", //下拉框显示内容，根据需要修改字段名称 value:"productObjectCode",
		 * //下拉框对应文本的值，根据需要修改字段名称
		 * resource:"cstProduct.queryProMaj",//数据源调用的action callback:
		 * function(data){ if(data){
		 *
		 * }else { var returnMsg = data.returnMsg ? data.returnMsg :
		 * T.T('F00035'); jfLayer.fail(returnMsg); } } }; }else if(data.value ==
		 * "T"){ $scope.busArray=[]; $scope.operationMode ="";
		 * $scope.labelScopeArr ={ type:"dynamic", param:$scope.params ,//默认查询条件
		 * text:"programDesc", //下拉框显示内容，根据需要修改字段名称 value:"businessProgramNo",
		 * //下拉框对应文本的值，根据需要修改字段名称 resource:"cstBsnisItem.query",//数据源调用的action
		 * callback: function(data){ if(data && data.length!=0){ for(var i=0;i<data.length;i++){
		 * $scope.operationMode = data[i].operationMode;
		 * $scope.busArray.push(data[i].businessProgramNo); }
		 * $scope.labelScopeArr ={ type:"dynamicDesc",
		 * param:{"operationMode":$scope.operationMode,"busList":$scope.busArray}
		 * ,//默认查询条件 text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称
		 * desc:"businessDesc", //下拉框显示内容，根据需要修改字段名称 value:"businessTypeCode",
		 * //下拉框对应文本的值，根据需要修改字段名称
		 * resource:"productLineBusType.query",//数据源调用的action callback:
		 * function(data){ if(data){
		 *
		 * }else { var returnMsg = data.returnMsg ? data.returnMsg :
		 * T.T('F00035'); jfLayer.fail(returnMsg); } } }; } } };
		 * //$scope.labelScopeArr = {};
		 *
		 * }else if(data.value == "M"){ $scope.params.flag="3";
		 * $scope.labelScopeArr ={ type:"dynamic", param:$scope.params ,//默认查询条件
		 * text:"externalIdentificationNo", //下拉框显示内容，根据需要修改字段名称
		 * value:"mediaUnitCode", //下拉框对应文本的值，根据需要修改字段名称
		 * resource:"cstMediaList.queryMediaMaj",//数据源调用的action callback:
		 * function(data){ if(data){
		 *
		 * }else { var returnMsg = data.returnMsg ? data.returnMsg :
		 * T.T('F00035'); jfLayer.fail(returnMsg); } } }; } });
		 */
		// 小tips
		$("#fastBuildCardTwo_idNumber").click(function() {
			if ($scope.cstQueryObj.idType == '1') {// 身份证
				if ($scope.systemEnvironmentFlag == 'TEST') {
					layer.tips(T.T('KHJ3200117'), '#fastBuildCardTwo_idNumber', {
						tips : [ 1, '#3595CC' ],
						time : 4000
					});
				} else if ($scope.systemEnvironmentFlag == 'PROD') {
					layer.tips(T.T('KHJ3200118'), '#fastBuildCardTwo_idNumber', {
						tips : [ 1, '#3595CC' ],
						time : 4000
					});
				}
            } else if ($scope.cstQueryObj.idType == '2') {// 港澳居民来往内地通行证
				layer.tips(T.T('KHJ3200119'), '#fastBuildCardTwo_idNumber', {
					tips : [ 1, '#3595CC' ],
					time : 4000
				});
			} else if ($scope.cstQueryObj.idType == '3') {// 台湾居民来往内地通行证
				layer.tips(T.T('KHJ3200120'), '#fastBuildCardTwo_idNumber', {
					tips : [ 1, '#3595CC' ],
					time : 4000
				});
			} else if ($scope.cstQueryObj.idType == '4') {// 中国护照
				layer.tips(T.T('KHJ3200121'), '#fastBuildCardTwo_idNumber', {
					tips : [ 1, '#3595CC' ],
					time : 4000
				});
			} else if ($scope.cstQueryObj.idType == '5') {// 外国护照passport
				layer.tips(T.T('KHJ3200122'), '#fastBuildCardTwo_idNumber', {
					tips : [ 1, '#3595CC' ],
					time : 4000
				});
			} else if ($scope.cstQueryObj.idType == '6') {// 外国人永久居留证
				layer.tips(T.T('KHJ3200123'), '#fastBuildCardTwo_idNumber', {
					tips : [ 1, '#3595CC' ],
					time : 4000
				});
			} else if ($scope.cstQueryObj.idType == '0') {//
			}
		});
		// 指定电话提示
		$scope.getTelTips = function() {
			layer.tips(T.T('KHJ3200124'), '#contactMobilePhone', {
				tips : [ 1, '#3595CC' ],
				time : 4000
			});
		};
		// 动态请求下拉框 是否设置定价标签
		$scope.isSetPriceArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.proInf.isSetPrice = '0';
			}
		};
		// 弹窗，是否设置定价标签函数
		$scope.isSetPrcieFun = function() {
			if ($scope.proInf.isSetPrice == '1') {// 设置定价标签
				$scope.proInfDiv = false;// 产品信息建立
				$scope.labelInfDiv = true;// 定价标签设置
				$scope.cstBsTypeLbSetTable.search();
				$scope.searchMdmInfEstbInfo($scope.hideObj);
				// 查询客户已有定价标签
				$scope.cstHavedLableTable.params.idType = $scope.hideObj.idType;
				$scope.cstHavedLableTable.params.idNumber = $scope.hideObj.idNumber;
				$scope.cstHavedLableTable.search();
			} else if ($scope.proInf.isSetPrice == '0') { // 不设置定价标签
				$scope.proInfDiv = false;// 产品信息建立
				$scope.mediaInfDiv = true;// 媒介信息建立
				$scope.searchMdmInfEstbInfo($scope.hideObj);
				// 是否设置客户定制标签
				/*
				 * jfLayer.confirmSet(T.T('KHJ3200139'),function(){
				 * $scope.proInfDiv = false;// 产品信息建立 $scope.labelInfDiv =
				 * true;// 定价标签设置
				 *
				 * $scope.cstBsTypeLbSetTable.search();
				 *
				 * $scope.searchMdmInfEstbInfo($scope.hideObj);
				 *
				 * },function(){ $scope.proInfDiv = false;// 产品信息建立
				 * $scope.mediaInfDiv = true;// 媒介信息建立
				 *
				 * $scope.searchMdmInfEstbInfo($scope.hideObj);
				 *
				 * });
				 */
			}
        };
		// 查询法人实体
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		// 查询法人实体
		$scope.queryCorEntityNo = function() {
			$scope.queryParam = {
				organNo : $scope.organization
			};
			jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows && data.returnData.rows.length > 0) {
							$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
							if ($scope.adminFlag != "1" && $scope.adminFlag != "2") {
								$scope.corporationEntityNo = $scope.corporationEntityNo;
								$("#corporationEntityNo").attr("disabled", true);
							}
						}
					}
                }
            });
		};
		$scope.queryCorEntityNo();
		$scope.searchCustBtn = function() {
			$scope.cstBaseInf = {};
			$scope.mediaInfDiv = false;// 媒介信息建立，再次建立客户时隐藏
			if (($scope.cstQueryObj.idNumber == "" || $scope.cstQueryObj.idNumber == undefined) && ($scope.cstQueryObj.idType == "" || $scope.cstQueryObj.idType == undefined)) {
				jfLayer.alert(T.T('KHJ3200001'));// 输入查询条件
				return;
			} else {
				if ($scope.cstQueryObj.idType) {
					if ($scope.cstQueryObj.idNumber == '' || $scope.cstQueryObj.idNumber == undefined || $scope.cstQueryObj.idNumber == null) {
						jfLayer.alert(T.T('F00110'));// '请核对证件号码'
					} else {
						$scope.hideObj.idNumber = $scope.cstQueryObj.idNumber;
						$scope.hideObj.idType = $scope.cstQueryObj.idType;
						if ($scope.hideObj.idType == '2' || $scope.hideObj.idType == '3') {
							$scope.showHkgMark = true;
						} else {
							$scope.showHkgMark = false;
						}
						$scope.overShowBaseInfDiv = false;
						$scope.searchHandlees($scope.cstQueryObj);
					}
				} else if ($scope.cstQueryObj.idNumber) {
					if ($scope.cstQueryObj.idType == '' || $scope.cstQueryObj.idType == undefined || $scope.cstQueryObj.idType == null) {
						jfLayer.alert(T.T('F00109'));// "请核对证件类型！"
					} else {
						$scope.hideObj.idNumber = $scope.cstQueryObj.idNumber;
						$scope.hideObj.idType = $scope.cstQueryObj.idType;
						$scope.overShowBaseInfDiv = false;
						$scope.searchHandlees($scope.cstQueryObj);
					}
				} else {
					$scope.hideObj.idNumber = $scope.cstQueryObj.idNumber;
					$scope.hideObj.idType = $scope.cstQueryObj.idType;
					$scope.overShowBaseInfDiv = false;
					$scope.searchHandlees($scope.cstQueryObj);
				}
			}
        };
		// 查询函数
		$scope.searchHandlees = function(params) {
			// 新建客户标记
			lodinDataService.set("buildCustomerFlag", '1');// 菜单名
			jfRest.request('cstInfQuery', 'queryInf', params).then(
					function(data) {
						if (data.returnCode == '000000') {// 客户存在
							$rootScope.customerNo = data.returnData.rows[0].customerNo;
							$rootScope.customerName = data.returnData.rows[0].customerName;
							$rootScope.idNumber = data.returnData.rows[0].idNumber;
							$rootScope.idType = data.returnData.rows[0].idType;
							// 客户存在，判断客户是否有产品
							jfRest.request('cstProduct', 'quereyProInf', params).then(
									function(data) {
										if (data.returnCode == '000000') {
											$scope.custBaseInfDiv = false;
											if (data.returnData.rows == null || data.returnData.rows == undefined || data.returnData.rows == '' || data.returnData.rows == 'null'
													|| data.returnData.rows.length == 0) {
												// 没有产品
												$scope.modal('/cstSvc/fastBuildCard/layerChoosePro.html', $scope.queryAccountForm, {
													title : T.T('KHJ3200002'),//
													buttons : [ T.T('F00107'), T.T('F00108') ],// '确定''取消'
													size : [ '1100px', '350px' ],
													callbacks : [ $scope.sureAskCallPro ]
												});
											} else {
												$scope.modal('/cstSvc/fastBuildCard/layerChoose.html', $scope.queryAccountForm, {
													title : T.T('KHJ3200002'),//
													buttons : [ T.T('F00107'), T.T('F00108') ],// '确定''取消'
													size : [ '1100px', '350px' ],
													callbacks : [ $scope.sureAskCall ]
												});
											}
										}
									});
							$scope.cstBaseInf = {};
							$scope.proInf = {};
							$scope.mdmInfEstbInfo = {};
						} else if (data.returnCode == 'Gns2Error') { // 158 // 客户不存在
							$scope.searchDiv = true;
							$scope.custBaseInfDiv = true;
							$scope.proInfDiv = false;
							$scope.mediaInfDiv = false;
							$scope.dpanInfDiv = false;
							$scope.cstBaseInf.idType = $scope.cstQueryObj.idType;
							$scope.cstBaseInf.idNumber = $scope.cstQueryObj.idNumber;
							$scope.adrlInfTable = [];
						} else if (data.returnCode == 'CUS-00014') { // 98
																		// 客户不存在
							$scope.searchDiv = true;
							$scope.custBaseInfDiv = true;
							$scope.proInfDiv = false;
							$scope.mediaInfDiv = false;
							$scope.dpanInfDiv = false;
							$scope.cstBaseInf.idType = $scope.cstQueryObj.idType;
							$scope.cstBaseInf.idNumber = $scope.cstQueryObj.idNumber;
							$scope.adrlInfTable = [];
						} else {
							$scope.searchDiv = false;
							$scope.custBaseInfDiv = false;
							$scope.proInfDiv = false;
							$scope.mediaInfDiv = false;
							$scope.dpanInfDiv = false;
							$scope.adrlInfTable = [];
						}
					});
		};
		// 重置
		$scope.reset = function() {
			$scope.searchDiv = true; // 查询条件模块
			$scope.custBaseInfDiv = false; // 基本信息建立
			$scope.proInfDiv = false; // 产品信息建立
			$scope.mediaInfDiv = false; // 媒介信息建立
			$scope.overShowBaseInfDiv = false; // 媒介建立成功后显示客户基本信息
			$scope.labelInfDiv = false; // 定价标签
			$scope.cstQueryObj = {};
			$scope.overShowBaseInf = {};
			$scope.searchInfForm.$setPristine();
			$("#fastBuildCardTwo_idNumber").attr("validator", "noValidator");
			$("#fastBuildCardTwo_idNumber").removeClass("waringform ");
		};
		// 选择申请
		$scope.sureAskCall = function(result) {
			$scope.checkedInfo = result.scope.itemList.checkedList();
			$scope.safeApply();
			result.cancel();
			if ($scope.checkedInfo.askFlag == 1) {// 申请产品
				$scope.custBaseInfDiv = false;
				$scope.mediaInfDiv = false;
				$scope.labelInfDiv = false;
				$scope.proInfDiv = true;
				$scope.dpanInfDiv = false;
				// 隐藏上一步按钮
				$scope.preBtn = false;
				$scope.searchProCstInfo($scope.hideObj);
				// $scope.proInf = {};
			} else if ($scope.checkedInfo.askFlag == 2) {// 申请附属卡
				$scope.custBaseInfDiv = false;
				$scope.proInfDiv = false;
				$scope.mediaInfDiv = true;
				$scope.dpanInfDiv = false;
				// 隐藏上一步按钮
				$scope.pre2Btn = false;
				// $scope.mediaOtherDiv = true;
				// $scope.proInf = {};
				$scope.searchMdmInfEstbInfo($scope.hideObj);
			} else if ($scope.checkedInfo.askFlag == 3) {// 申请已有媒介DPAN
				$scope.dpanInf.customerNo = $rootScope.customerNo;
				$scope.dpanInf.customerName = $rootScope.customerName;
				$scope.dpanInf.idNumber = $rootScope.idNumber;
				$scope.dpanInf.idType = $rootScope.idType;
				$scope.dpanMediaDetailDiv = false;
				$scope.queryParams = {
					idType : $scope.cstQueryObj.idType,
					idNumber : $scope.cstQueryObj.idNumber,
					flag : '3'
				};
				$scope.havedMediaList.params = $scope.queryParams;
				$scope.havedMediaList.search();
			}
        };
		// 只能选择申请产品
		$scope.sureAskCallPro = function(result) {
			$scope.checkedInfo = result.scope.itemList.checkedList();
			$scope.safeApply();
			result.cancel();
			if ($scope.checkedInfo.askFlag == 1) {// 申请产品
				$scope.custBaseInfDiv = false;
				$scope.mediaInfDiv = false;
				$scope.proInfDiv = true;
				$scope.searchProCstInfo($scope.hideObj);
			}
		};
		// 机构号查询
		$scope.institutionIdArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
				// console.log(data);
			}
		};
		// 运营模式
		$scope.operationModeArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "operationMode.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data);
			}
		};
		// 搜索身份证类型
		/*
		 * $scope.certificateTypeArray1 = [ {name : T.T('F00113'),id :
		 * '1'},//身份证 {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证 {name :
		 * T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证 {name : T.T('F00116') ,id :
		 * '4'} ,//中国护照 {name : T.T('F00117') ,id : '5'} ,//外国护照 {name :
		 * T.T('F00118') ,id : '6'} ]; //外国人永久居留证
		 */
		// 住宅性质
		// $scope.residenceeArray = [ {name : T.T('KHJ3200003'),id : '1'}, {name
		// : T.T('KHJ3200004'),id : '2'}, {name : T.T('KHJ3200005'),id : '3'} ];
		// 职称级别
		// $scope.jobLevelCodeArray = [ {name : T.T('KHJ3200011'),id : '1'},
		// {name : T.T('KHJ3200012'),id : '2'}, {name : T.T('KHJ3200013'),id :
		// '3'} ];
		// 担保人标识
		// $scope.guarantorLogoArray = [ {name : '无担保',id : '1'}, {name :
		// '已存在',id : '2'}, {name : '有潜在',id : '3'} ];
		// $scope.guarantorLogoArray = [ {name : T.T('KHJ3200018'),id : '1'},
		// {name : T.T('KHJ3200019'),id : '2'}, {name : T.T('KHJ3200020'),id :
		// '3'} ];
		// 婚姻
		// $scope.maritalStatusArray = [ {name : '未婚',id : '1'}, {name : '已婚',id
		// : '2'}, {name : '离异',id : '3'}, {name : '未知',id : '4'} ];
		// $scope.maritalStatusArray = [ {name : T.T('KHJ3200025'),id : '1'},
		// {name : T.T('KHJ3200026'),id : '2'}, {name : T.T('KHJ3200027'),id :
		// '3'}, {name : T.T('KHJ3200028'),id : '4'} ];
		// 性别
		// $scope.genderArray = [ {name : '女',id : '1'}, {name : '男',id : '2'},
		// {name : '未知',id : '3'} ];
		// $scope.genderArray = [ {name : T.T('KHJ3200033'),id : '1'}, {name
		// :T.T('KHJ3200034'),id : '2'}, {name : T.T('KHJ3200028'),id : '3'} ];
		// 地址场景
		// $scope.typeArray = [ {name : '邮寄地址',id : '1'}, {name : '家庭地址',id :
		// '2'}, {name : '单位地址',id : '3'} ];
		// $scope.typeArray = [ {name : T.T('KHJ3200038'),id : '1'}, {name :
		// T.T('KHJ3200039'),id : '2'}, {name : T.T('KHJ3200040'),id : '3'} ];
		// 全额罚息标志
		// $scope.fullPenaltySign = [ {name : '全额罚息',id : 'Y'}, {name :
		// '非全额罚息',id : 'N'} ];
		$scope.fullPenaltySign = [ {
			name : T.T('KHJ3200045'),
			id : 'Y'
		}, {
			name : T.T('KHJ3200046'),
			id : 'N'
		} ];
		// 个人公司标识
		// $scope.personalCompanyType = [ {name : '个人客户',id : '1'}, {name :
		// '公司客户',id : '2'} ];
		// $scope.personalCompanyType = [ {name : T.T('KHJ3200051'),id : '1'},
		// {name : T.T('KHJ3200052'),id : '2'} ];
		// 购汇还款标志
		// $scope.purchRemittSign = [ {name : '无购汇还款',id : 'N'}, {name :
		// '购汇还款',id : 'Y'} ];
		// 约定扣款方式
		// $scope.achFlag = [ {name : '无约定扣款',id : '0'}, {name : '账单余额',id :
		// '1'}, {name : '最低还款额',id : '2'} ];
		$scope.achFlag = [ {
			name : T.T('KHJ3200057'),
			id : '0'
		}, {
			name : T.T('KHJ3200058'),
			id : '1'
		}, {
			name : T.T('KHJ3200059'),
			id : '2'
		} ];
		// 本行他行标识
		// $scope.ddType = [ {name : '本行',id : '0'}, {name : '他行',id : '1'} ];
		$scope.ddType = [ {
			name : T.T('KHJ3200064'),
			id : '0'
		}, {
			name : T.T('KHJ3200065'),
			id : '1'
		} ];
		// 购汇还款标志
		// $scope.exchangePaymentFlagArray = [ {name : '购汇还款',id : 'Y'}, {name :
		// '无购汇还款',id : 'N'} ];
		// $scope.exchangePaymentFlagArray = [ {name : T.T('KHJ3200069'),id :
		// 'Y'}, {name : T.T('KHJ3200070'),id : 'N'} ];
		// 还款选项
		// $scope.paymentMarkArray = [ {name : '统一还款',id : '1'}, {name :
		// '单独还款',id : '2'} ];
		// $scope.paymentMarkArray = [ {name : T.T('KHJ3200075'),id : '1'},
		// {name : T.T('KHJ3200076'),id : '2'} ];
		// 账单日
		/*
		 * $scope.statementDateArr = [ { name : '01',id : '01'}, {name : '02',id :
		 * '02'},{name : '03',id : '03'}, {name : '04',id : '04'}, {name :
		 * '05',id : '05'}, {name : '06',id : '06'}, {name : '07',id : '07'},
		 * {name : '08',id : '08'}, {name : '09',id : '09'}, {name : '10',id :
		 * '10'}, {name : '11',id : '11'}, {name : '12',id : '12'}, {name :
		 * '13',id : '13'}, {name : '14',id : '14'}, {name : '15',id : '15'},
		 * {name : '16',id : '16'}, {name : '17',id : '17'}, {name : '18',id :
		 * '18'}, {name : '19',id : '19'}, {name : '20',id : '20'}, {name :
		 * '21',id : '21'}, {name : '22',id : '22'}, {name : '23',id : '23'},
		 * {name : '24',id : '24'}, {name : '25',id : '25'}, {name : '26',id :
		 * '26'}, {name : '27',id : '27'}, {name : '28',id : '28'}];
		 */
		// 按月
		/*
		 * $scope.cycleFrequencyMonth = [{ name : '01',id : '01'}, {name :
		 * '02',id : '02'},{name : '03',id : '03'}, {name : '04',id : '04'},
		 * {name : '05',id : '05'}, {name : '06',id : '06'}, {name : '07',id :
		 * '07'}, {name : '08',id : '08'}, {name : '09',id : '09'}, {name :
		 * '10',id : '10'}, {name : '11',id : '11'}, {name : '12',id : '12'},
		 * {name : '13',id : '13'}, {name : '14',id : '14'}, {name : '15',id :
		 * '15'}, {name : '16',id : '16'}, {name : '17',id : '17'}, {name :
		 * '18',id : '18'}, {name : '19',id : '19'}, {name : '20',id : '20'},
		 * {name : '21',id : '21'}, {name : '22',id : '22'}, {name : '23',id :
		 * '23'}, {name : '24',id : '24'}, {name : '25',id : '25'}, {name :
		 * '26',id : '26'}, {name : '27',id : '27'}, {name : '28',id : '28'}];
		 *
		 * //按周 $scope.cycleFrequencyWeek = [{ name : '01',id : '01'}, {name :
		 * '02',id : '02'},{name : '03',id : '03'}, {name : '04',id : '04'},
		 * {name : '05',id : '05'}, {name : '06',id : '06'}, {name : '07',id :
		 * '07'}];
		 */
		// '全部''本金''利息''费用'
		$scope.balanceTypeArray = [ {
			name : T.T('KHJ3200125'),
			id : 'A'
		}, {
			name : T.T('KHJ3200126'),
			id : 'P'
		}, {
			name : T.T('KHJ3200127'),
			id : 'I'
		}, {
			name : '费用',
			id : 'F'
		} ];// 余额类型
		// '人民币' '美元'
		$scope.currencyTypeArray = [ {
			name : T.T('KHJ3200128'),
			id : 'CNY'
		}, {
			name : T.T('KHJ3200129'),
			id : 'USD'
		} ];// 币种
		// 'D-差异化''P-个性化' 'A-活动'
		// $scope.priceAreaArray = [{name :T.T('KHJ3200130'),id : 'D'},{name :
		// T.T('KHJ3200131'),id : 'P'},{name : T.T('KHJ3200132'),id : 'A'}] ;
		// 'I-继承''O-覆盖'
		$scope.priceModelArray = [ {
			name : T.T('KHJ3200133'),
			id : 'I'
		}, {
			name : T.T('KHJ3200134'),
			id : 'O'
		} ];
		// 'D-数值' 'P-百分比'
		$scope.valTypArray = [ {
			name : T.T('KHJ3200135'),
			id : 'D'
		}, {
			name : T.T('KHJ3200136'),
			id : 'P'
		} ];
		// 媒介领取标志
		// $scope.mediaDispatchMethodArr = [{name : T.T('KHJ3200137'),id :
		// 'Y'},{name : T.T('KHJ3200138') ,id : 'N'}];
		// 密码函领取标志
		// $scope.pinDispatchMethodArr = [{name : T.T('KHJ3200137'),id :
		// 'Y'},{name : T.T('KHJ3200138') ,id : 'N'}];
		// 定价类型
		/*
		 * $scope.pricingTypeArray = [{ id : 'PCD', name: 'PCD' },{ id : 'FIT',
		 * name: 'FIT' }];
		 */
		// 动态请求下拉框 定价类型
		$scope.pricingTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_pricingType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 证件类型
		$scope.certificateTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_certificateType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 住宅性质
		$scope.residencyStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_residencyStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 婚姻状况
		$scope.maritalStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_maritalStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 职务级别代码
		$scope.postRankCodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_postRankCode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框担保人标识
		$scope.guarantorFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_guarantorFlag",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 地址类型2
		$scope.addressType2Array = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_addressType",
				queryFlag : "children"
			},// 默认查询条件
			rmData:'4',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 动态请求下拉框 性别
		$scope.genderArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_gender",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 个人公司标识
		$scope.personalCompanyTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_personalCompanyType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 购汇还款标志
		$scope.exchangePaymentFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_exchangePaymentFlag",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 还款选项
		$scope.paymentMarkArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_paymentMark",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 账单日
		$scope.billDayArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_billDay",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 账单日按月
		$scope.cycleFrequencyMonth = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_billDay",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 账单日按周
		$scope.cycleFrequencyWeek = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cycleFrequencyWeek",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 定价区域
		$scope.priceAreaArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "codes", // 下拉框显示内容，根据需要修改字段名称
			desc : 'detailDesc',
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 密码函领取标志
		$scope.pinDispatchMethodArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 媒介领取标志
		$scope.mediaDispatchMethodArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isYorN",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 客户地址信息 保存
		$scope.showNewAdrInfo = true;
		$scope.adrlInfTable = [];
		$scope.adrlInfTableInfoObj = {};
		$scope.saveNewAdrInfo = function() {
			var adrlInfTableInfoU = {};
			adrlInfTableInfoU.type = $scope.adrlInfTableInfoObj.type;
			adrlInfTableInfoU.contactAddress = $scope.adrlInfTableInfoObj.contactAddress;
			adrlInfTableInfoU.contactPostCode = $scope.adrlInfTableInfoObj.contactPostCode;
			adrlInfTableInfoU.contactMobilePhone = $scope.adrlInfTableInfoObj.contactMobilePhone;
			adrlInfTableInfoU.city = $scope.adrlInfTableInfoObj.city;
			// 翻译
			if (adrlInfTableInfoU.type == 1) {
				adrlInfTableInfoU.typeTrans = T.T('KHJ3200038');// "邮寄地址";
			} else if (adrlInfTableInfoU.type == 2) {
				adrlInfTableInfoU.typeTrans = T.T('KHJ3200039');// "家庭地址";
			} else if (adrlInfTableInfoU.type == 3) {
				adrlInfTableInfoU.typeTrans = T.T('KHJ3200040');// "单位地址";
			}
			$scope.adrlInfTable.push(adrlInfTableInfoU);
			$scope.adrlInfTableInfoObj = {};
			$scope.showNewAdrInfo = false;
		};
		// 客户备注信息模块 保存
		$scope.cstRmrkInfoTable = [];
		$scope.cstRmrkInfoObj = {};
		$scope.saveCstRmk = function() {
			var cstRmrkInfoObjU = {};
			cstRmrkInfoObjU.remarkInfo = $scope.cstRmrkInfoObj.remarkInfo;
			cstRmrkInfoObjU.lastUpdateUserid = $scope.cstRmrkInfoObj.lastUpdateUserid;
			cstRmrkInfoObjU.createRemarksTime = $scope.cstRmrkInfoObj.createRemarksTime;
			$scope.cstRmrkInfoTable.push(cstRmrkInfoObjU);
			$scope.cstRmrkInfoObj = {};
			$scope.showCstRmrkInfo = false;
		};
		// 提交;
		// 业务类型
		$scope.cstBaseInf = {
			businessType : '0'
		};
		$scope.subCsInfParams = {};
		$scope.showHkgMark = false;// 定义港澳台显示星号的标识位
		$scope.submitHandle = function() {
			if ($scope.adrlInfTable && $scope.adrlInfTable.length > 0) {
				$scope.subCsInfParams.coreCoreCustomerAddrs = $scope.adrlInfTable;// 地址信息list
				if ($scope.cstRmrkInfoTable && $scope.cstRmrkInfoTable.length > 0) {
					$scope.subCsInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;// 备注信息list
				} else {
					$scope.cstRmrkInfoTable = null;
					$scope.subCsInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;
				}
				// 验证港澳通行证信息
				if ($scope.hideObj.idType == '2' || $scope.hideObj.idType == '3') {
					if ($scope.cstBaseInf.idNumberHmt == '' || $scope.cstBaseInf.idNumberHmt == null || $scope.cstBaseInf.idNumberHmt == undefined
							|| $scope.cstBaseInf.idNumberHmt.length < 18) {
						jfLayer.alert(T.T('KHJ3200153'));// '请核对证件号码'
						return;
					}
                }
                /*
                 * if ($scope.cstPrcgLblTable && $scope.cstPrcgLblTable.length >
                 * 0) { $scope.subCsInfParams.coreCustomerBusinessType =
                 * $scope.cstPrcgLblTable;// 定价标签信息list } else {
                 * $scope.cstPrcgLblTable = null;
                 * $scope.subCsInfParams.coreCustomerBusinessTypes =
                 * $scope.cstPrcgLblTable; }
                 */
				lodinDataService.set("buildFlag",1);//新建客户信息 按钮
				$scope.subCsInfParams = Object.assign($scope.subCsInfParams, $scope.cstBaseInf);
				$scope.subCsInfParams.operatorId = sessionStorage.getItem("userName");
				jfRest.request('cstInfBuild', 'save', $scope.subCsInfParams).then(function(data) {
					if (data.returnCode == '000000') {
						$rootScope.idType = data.returnData.rows[0].idType;
						$rootScope.idNumber = data.returnData.rows[0].idNumber;
						$rootScope.customerNo = data.returnData.rows[0].customerNo;
						$scope.hideObj.customerNo = data.returnData.rows[0].customerNo;
						$scope.hideObj.idNumber = data.returnData.rows[0].idNumber;
						$scope.hideObj.idType = data.returnData.rows[0].idType;
						$scope.hideObj.customeName = data.returnData.rows[0].customeName;
						// $rootScope.custmoerBaseInfo = $scope.hideObj;
						jfLayer.success(T.T('F00032'));
						// 按钮样式
						/*
						 * $("#nextBtn1").css({backgroundColor : "#2998DC"});
						 * $('#nextBtn1').attr("disabled",false);
						 */
						// 上一步按钮 进入产品信息建立
						/*
						 * $scope.preBtn =true; $scope.custBaseInfDiv = false;//
						 * 客户信息建立 $scope.proInfDiv = true;// 产品信息建立
						 *
						 * $scope.searchProCstInfo($scope.hideObj);
						 */
						// 进入收费项目
						$scope.goAddedServiceFee($scope.hideObj);
					}
				});
			} else {
				jfLayer.fail(T.T('KHJ3200081'));// 地址必输入一条,请至少输入一种地址信息
			}
        };
		// 地址 新增按钮
		$scope.newAdrBtn = function() {
			$scope.showNewAdrInfo = !$scope.showNewAdrInfo;
		};
		// 备注 新增按钮
		$scope.cstRmrkInfoBtn = function() {
			$scope.showCstRmrkInfo = !$scope.showCstRmrkInfo;
		};
		/* 产品建立中 上一步，下一步 */
		// 进入增值服务费
		$scope.pre = function() {
			$scope.custBaseInfDiv = false;// 客户基本信息建立
			$scope.addedServiceFeeDiv = true;// 增值服务费
			$scope.proInfDiv = false;// 产品建立
			$scope.labelInfDiv = false;// 客户定价标签设置
			$scope.mediaInfDiv = false;// 客户媒介细腻建立
			$scope.dpanInfDiv = false;// 客户dpan信息建立
			$scope.preBtn = false;
			// 收费项目模块客户基本信息
			$scope.addedServiceFeeInf.customerNo = $scope.hideObj.customerNo;
			$scope.addedServiceFeeInf.customerName = $scope.hideObj.customerName;
			$scope.addedServiceFeeInf.idNumber = $scope.hideObj.idNumber;
			// 查询已有的收费项目
			/*
			 * $scope.havedFeePro.params.idNumber = $scope.hideObj.idNumber;
			 * $scope.havedFeePro.params.idType = $scope.hideObj.idType;
			 * $scope.havedFeePro.search();
			 */
			$scope.havedFeePro();// 查询已有的收费项目
			// 查询所有收费项目
			$scope.chooseFeePro.params.idNumber = $scope.hideObj.idNumber;
			$scope.chooseFeePro.params.idType = $scope.hideObj.idType;
			$scope.chooseFeePro.search();
			/*
			 * $scope.custBaseInfDiv = true;// 客户信息建立 $scope.proInfDiv =
			 * false;// 产品信息建立
			 *
			 * $scope.chooseProList.params.customerNo = $rootScope.customerNo;
			 *
			 * $scope.chooseProList.params.customerNo = $rootScope.customerNo;
			 * $scope.chooseProList.search();// 查询所有产品
			 *
			 * $scope.hideObj.step = '1';
			 *
			 * $scope.searchProCstInfo($scope.hideObj);// 查询客户信息
			 *
			 * $("#nextBtn1").css({ backgroundColor : "#2998DC" });
			 * $('#nextBtn1').attr("disabled", false);
			 */
		};
		// 上一步 进入产品信息
		$scope.pre2 = function() {
			$scope.proInfDiv = true;// 产品信息建立
			$scope.mediaInfDiv = false;// 媒介信息建立
			$scope.searchMdmInfEstbInfo($scope.hideObj);
			$scope.chooseProList.params.customerNo = $rootScope.customerNo;
			$scope.chooseProList.search();// 查询所有产品
			$("#nextBtn2").css({
				backgroundColor : "#2998DC"
			});
			$('#nextBtn2').attr("disabled", false);
		};
		// 进入产品信息
		/*
		 * $scope.next = function() { $scope.custBaseInfDiv = false;// 客户信息建立
		 * $scope.proInfDiv = true;// 产品信息建立
		 * $scope.searchProCstInfo($scope.hideObj); };
		 */
		// 进入媒介信息
		$scope.next2 = function() {
			$scope.havedProQueryParams = {
				idNumber : $scope.hideObj.idNumber,
				idType : $scope.hideObj.idType
			};
			$scope.havedProQueryParams = $.extend($scope.havedProQueryParams, $scope.havedProList.params);
			/*
			 * 判断客户下是否有产品 ， 无：初次建立产品未选择产品提示必须选择一条， 有产品：没有选产品，默认选中已有第一条产品；
			 * 选择了产品，默认选中所选产品
			 */
			jfRest.request('cstProduct', 'quereyProInf', $scope.havedProList.params).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData != null || data.returnData != undefined || data.returnData != '') {
						if (data.returnData.rows && data.returnData.rows.length > 0) {// 客户下有产品
							// if(!$scope.chooseProList.validCheck()){//没选择，媒介页面默认选中所有产品第一条
							if ($scope.chooseProList.checkedList() == undefined || $scope.chooseProList.checkedList() == 'undefined') {// 没选择，媒介页面默认选中所有产品第一条
								// 无需走后台接口
								$rootScope.prodEstedObjCode = data.returnData.rows[0].productObjectCode;
								// 是否设置客户定制标签
								$scope.isSetPrcieFun();
							} else {// 选择了产品，媒介页面默认选中选择的
								$scope.saveProFun($scope.chooseProList.checkedList());
							}
                        } else {// 无产品,提示至少选择一条产品，
							if (!$scope.chooseProList.validCheck()) {
								return;
							} else {
								// 保存产品
								$scope.saveProFun($scope.chooseProList.checkedList());
								$scope.prodEstedObjCode = $scope.chooseProList.checkedList().productObjectCode;
							}
						}
                    } else {
						data.returnData.rows = [];// 暂无数据
					}
				}
			});
		};
		/*
		 * 保存产品函数 传入媒介中需要默认的产品
		 */
		$scope.saveProFun = function(proPbj) {
			if ($scope.proInf.directDebitStatus == "1") {
				if (($scope.proInf.directDebitStatus == "" || $scope.proInf.directDebitStatus == undefined || $scope.proInf.directDebitStatus == null)
						|| ($scope.proInf.directDebitMode == "" || $scope.proInf.directDebitMode == undefined || $scope.proInf.directDebitMode == null)
						|| ($scope.proInf.directDebitBankNo == "" || $scope.proInf.directDebitBankNo == undefined || $scope.proInf.directDebitBankNo == null)
						|| ($scope.proInf.directDebitAccountNo == "" || $scope.proInf.directDebitAccountNo == undefined || $scope.proInf.directDebitAccountNo == null)
						|| ($scope.proInf.exchangePaymentFlag == "" || $scope.proInf.exchangePaymentFlag == undefined || $scope.proInf.exchangePaymentFlag == null)) {
					jfLayer.alert(T.T('KHJ3700008'));// "请填写还款信息！"
					return;
				}
			}
            $scope.proInf.idNumber = $scope.hideObj.idNumber;
			$scope.proInf.idType = $scope.hideObj.idType;
			// var checkedItem = $scope.chooseProList.checkedList();
			if ($scope.budgetInf.budgetOrgCode) {
				$rootScope.budgetOrgCode = $scope.budgetInf.budgetOrgCode;
			} else {
				$scope.budgetInf.budgetOrgCode = '';
			}
            $scope.saveparamss = {
				budgetOrgCode : $scope.budgetInf.budgetOrgCode,
				businessProgramNoCycleDaysList : $scope.intBillDayList,
			};
			$scope.saveparamss = $.extend($scope.saveparamss, $scope.proInf);// 合并产品基本信息
			$scope.saveparamss = $.extend($scope.saveparamss, proPbj);// 合并选择产品
			jfRest.request('cstProduct', 'saveCstProduct', $scope.saveparamss).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));// "保存成功"
					$scope.havedProList.search();// 产品信息建立中，查询已有产品
					$rootScope.prodEstedObjCode = data.returnData.rows[0].productObjectCode;
					// 是否设置客户定制标签
					$scope.isSetPrcieFun();
					/*
					 * $("#nextBtn2").css({backgroundColor : "#2998DC"});
					 * $('#nextBtn2').attr("disabled", false);
					 */
				}
			});
		};
		// 日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem : '#lay_cstApp_effectiveDate',
				// min:"2019-03-01",
				done : function(value, date) {
					endDate.config.min = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					endDate.config.start = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					$scope.csInf.custTagEffectiveDate = $("#lay_cstApp_effectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem : '#lay_cstApp_expirationDate',
				// min:Date.now(),
				done : function(value, date) {
					startDate.config.max = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					$scope.csInf.custTagExpirationDate = $("#lay_cstApp_expirationDate").val();
				}
			});
		});
		// 进入定价标签设置
		$scope.goLabelSet = function() {
			$scope.proInfDiv = false;// 产品信息建立
			$scope.labelInfDiv = true;// 定价标签设置
		};
		// 直接进入媒介建立
		$scope.goMediaSet = function() {
			$scope.proInfDiv = false;// 产品信息建立
			$scope.mediaInfDiv = true;// 媒介信息建立
			$scope.searchMdmInfEstbInfo($scope.hideObj);
		};
		/* =========================增值服务费========================= */
		/* 先查询客户基本信息，再选择费用项目表，点击下一步，进入产品信息建立页面 */
		$scope.addedServiceFeeInf = {};
		$scope.goAddedServiceFee = function(obj) {
			$scope.paramss = {
				idNumber : obj.idNumber,
				idType : obj.idType
			};
			// 查询客户信息
			jfRest.request('cstInfQuery', 'queryInf', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows[0].customerNo == null || data.returnData.rows[0].customerNo == undefined) {
						jfLayer.alert(T.T('KHJ3200094'));// "抱歉，用户创建失败！"
					} else {
						$scope.addedServiceFeeInf.idType = data.returnData.rows[0].idType;
						$scope.addedServiceFeeInf.idNumber = data.returnData.rows[0].idNumber;
						$scope.addedServiceFeeInf.customerName = data.returnData.rows[0].customerName;
						$scope.addedServiceFeeInf.customerNo = data.returnData.rows[0].customerNo;
						$scope.addedServiceFeeInf.operationMode = data.returnData.rows[0].operationMode;
						$scope.chooseFeePro.search();// 查询收费项目
						$scope.havedFeePro();// 查询已有的收费项目
						$scope.custBaseInfDiv = false;// 客户基本信息建立
						$scope.addedServiceFeeDiv = true;// 增值服务费
						$scope.proInfDiv = false;// 产品建立
						$scope.labelInfDiv = false;// 客户定价标签设置
						$scope.mediaInfDiv = false;// 客户媒介细腻建立
						$scope.dpanInfDiv = false;// 客户dpan信息建立
					}
				}
			});
		};
		// 已经选择收费项目
		$scope.havedFeePro = function() {
			$scope.queryParam = {
				idType : $scope.addedServiceFeeInf.idType,
				idNumber : $scope.addedServiceFeeInf.idNumber
			};
			jfRest.request('cstInfBuild', 'queryHavedFeePro', $scope.queryParam).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows == null) {
						$rootScope.treeSelect = [];
					} else {
						$rootScope.treeSelect = data.returnData.rows;
					}
				}
			});
		};
		// $scope.havedFeePro();
		// 选择收费项目
		$scope.chooseFeePro = {
			checkType : 'checkbox', //
			autoQuery : false,
			params : {
				pageSize : 10,
				indexNo : 0,
				periodicFeeIdentifier : "C"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'feeProject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory','dic_instanceDimension','dic_instanceDimension'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc','instanCode1_instanCode1Desc','instanCode2_instanCode2Desc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			},
		};
		// 下一步
		$scope.feeProNext = function() {
			$scope.feeProparams = {
				customerNo : $scope.addedServiceFeeInf.customerNo,
				operationMode : $scope.addedServiceFeeInf.operationMode,
				idNumber : $scope.addedServiceFeeInf.idNumber,
				idType : $scope.addedServiceFeeInf.idType
			};
			if ($scope.chooseFeePro.checkedList()) {
				$scope.feeProparams.coreFeeItemList = $scope.chooseFeePro.checkedList();
			}
            jfRest.request('cstInfBuild', 'saveFeePro', $scope.feeProparams).then(function(data) {
				if (data.returnCode == '000000') {
					// 进入产品信息建立
					$scope.preBtn = true;// 上一步按钮
					$scope.custBaseInfDiv = false;// 客户基本信息建立
					$scope.addedServiceFeeDiv = false;// 增值服务费
					$scope.proInfDiv = true;// 产品建立
					$scope.labelInfDiv = false;// 客户定价标签设置
					$scope.mediaInfDiv = false;// 客户媒介细腻建立
					$scope.dpanInfDiv = false;// 客户dpan信息建立
					$scope.searchProCstInfo($scope.hideObj);
					// 缓存选择的收费项目，以便点击上一步的时候取
					lodinDataService.setObject("choosedFeeProList", $scope.chooseFeePro.checkedList());
					// 查询已有的收费项目
					/*
					 * $scope.havedFeePro.params.idNumber =
					 * $scope.hideObj.idNumber; $scope.havedFeePro.params.idType =
					 * $scope.hideObj.idType; $scope.havedFeePro.search();
					 */
					$scope.havedFeePro();// 查询已有的收费项目
				} else if (data.returnMsg != "OK") {
					$scope.preBtn = true;// 上一步按钮
					$scope.custBaseInfDiv = false;// 客户基本信息建立
					$scope.addedServiceFeeDiv = true;// 增值服务费
					$scope.proInfDiv = false;// 产品建立
					$scope.labelInfDiv = false;// 客户定价标签设置
					$scope.mediaInfDiv = false;// 客户媒介细腻建立
					$scope.dpanInfDiv = false;// 客户dpan信息建立
				}
			});
		};
		// 增值业务费 上一步
		$scope.feeProPre = function() {
			$scope.custBaseInfDiv = true;// 客户基本信息建立
			$scope.addedServiceFeeDiv = false;// 增值服务费
			$scope.proInfDiv = false;// 产品建立
			$scope.labelInfDiv = false;// 客户定价标签设置
			$scope.mediaInfDiv = false;// 客户媒介细腻建立
			$scope.dpanInfDiv = false;// 客户dpan信息建立
			$scope.preBtn = false;
			$scope.chooseProList.params.customerNo = $rootScope.customerNo;
			$scope.chooseProList.params.customerNo = $rootScope.customerNo;
			$scope.chooseProList.search();// 查询所有产品
			$scope.hideObj.step = '1';// 第二步
			$scope.searchProCstInfo($scope.hideObj);// 查询客户信息
		};
		// 关联
		$scope.saveSelect = function() {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.chooseFeePro.validCheck()) {
				return;
			}
			var items = $scope.chooseFeePro.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].feeItemNo == $rootScope.treeSelect[k].feeItemNo && !$rootScope.treeSelect[k].expirationDate) { // 判断是否存在
						tipStr = tipStr + items[i].feeItemNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$scope.infoIsShow = false;
					$scope.antiInfoIsShow = true;
					items[i].expirationDate = null;
					$rootScope.treeSelect.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('KHH3200177') + ":" + tipStr.substring(0, tipStr.length - 1) + T.T('PZJ100032'));
			}
		};
		// 删除关联收费项目
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
		};
		/* ===================================增值服务费end============================ */
		/* =========================产品信息建立============== */
		// 动态请求下拉框 约定还款状态
		$scope.directDebitStatusArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_directDebitStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 约定还款方式
		$scope.directDebitModeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_directDebitMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 自定义下拉框
		// $scope.directDebitStatusArray = [ {name : T.T('KHJ3200082'),id :
		// '0'}, {name : T.T('KHJ3200083'),id : '1'} ];// 约定扣款状态
		// $scope.directDebitModeArray = [ {name : T.T('KHJ3200088'),id : '0'},
		// {name : T.T('KHJ3200089'),id : '1'} ];// 约定扣款方式
		// 客户已有产品信息
		$scope.havedProList = {
			autoQuery : false,
			checkType : 'radio', //
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
				idNumber : $scope.hideObj.idNumber,
				idType : $scope.hideObj.idType
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstProduct.quereyProInf',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				// console.log(data);
				if ($rootScope.prodEstedObjCode != null || $rootScope.prodEstedObjCode != '' || $rootScope.prodEstedObjCode != undefined) {
					angular.forEach(data.returnData.rows, function(item, index) {
						if ($rootScope.prodEstedObjCode == item.productObjectCode) {
							item._checked = true;
						}
                    });
				}
            }
		};
		// 产品中选择产品对象
		$scope.chooseProList = {
			autoQuery : false,
			checkType : 'radio', //
			params : {
				pageSize : 10,
				indexNo : 0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'pDInfEstb.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				// console.log(data);
			},
			checkBack : function(item) {
				$scope.queryIsIntBillDayParams = {
					operationMode : item.operationMode,
					productObjectCode : item.productObjectCode,
					idType : $scope.hideObj.idType,
					idNumber : $scope.hideObj.idNumber
				};
				// 判断产品对应的业务项目是否需要输入账单日
				jfRest.request('cstInfBuild', 'queryIsIntBillDay', $scope.queryIsIntBillDayParams).then(function(data) {
					if (data.returnCode == '000000') {
						if (data.returnData) {
							if (data.returnData.rows.length > 0) {// rows不为空，产品对应业务项目需要输入账单日期
								$scope.proItem = item;
								$scope.proItem.idType = $scope.hideObj.idType;
								$scope.proItem.idNumber = $scope.hideObj.idNumber;
								$scope.modal('/cstSvc/fastBuildCard/layerIntBillDay.html', $scope.proItem, {
									title : T.T('KHJ3200140'),//
									buttons : [ T.T('F00107'), T.T('F00108') ],// '确定''取消'
									size : [ '1100px', '400px' ],
									callbacks : [ $scope.sureIntBillDay ]
								});
							} else if (data.returnData.rows == 0 || data.returnData.rows == null || data.returnData.rows == undefined) {
								return;
							}
						}
                    }
				});
				// 判断产品是否属于公务卡，决定是否显示公务卡预算单位编码
				console.log(item.productObjectCode.substr(0, 6));
				if (item.productObjectCode.substr(0, 6) == 'MODP40') {
					$scope.isShowbudgetOrg = true;
				} else {
					$scope.isShowbudgetOrg = false;
				}
			},
		};
		// 判断产品对应的业务项目是否需要输入账单日
		$scope.sureIntBillDay = function(result) {
			$scope.intBillDayInf = result.scope.dataList;
			angular.forEach($scope.intBillDayInf, function(item, i) {
				if (item.cycleFrequencyDay == '' || item.cycleFrequencyDay == null || item.cycleFrequencyDay == undefined) {
					jfLayer.alert(T.T('KHJ3200141'));
					return;
				}
            });
			$scope.intBillDayList = $scope.intBillDayInf;
			$scope.safeApply();
			result.cancel();
		};
		// 约定还款状态选择
		var form = layui.form;
		form.on('select(getdDebitStatus)', function(event) {
			$scope.debitStatus = event.value;
			if ($scope.debitStatus == "0") {// 未设置
				$(".repayDiv").find('.red').removeClass("disB").addClass("disN");
			} else if ($scope.debitStatus == "1") { // 已设置
				$(".repayDiv").find('.red').removeClass("disN").addClass("disB")
			}
		});
		// 查询预算单位
		$scope.budgetInf = {};
		$scope.searBudgetOrg = function() {
			if ($scope.budgetInf.budgetOrgCode == '' || $scope.budgetInf.budgetOrgCode == undefined) {
				jfLayer.fail(T.T('KHJ3200142'));
				return;
			}
            $scope.paramss = {
				idType : '7',
				idNumber : $scope.budgetInf.budgetOrgCode
			};
			jfRest.request('budgetUnit', 'query', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowBudge = true;
					$scope.budgetInf.budgetOrgName = data.returnData.rows[0].customerName;
					$scope.budgetInf.billDay = data.returnData.rows[0].billDay;
				}
			});
		};
		// 重置预算单位
		$scope.resetBudgetOrg = function() {
			$scope.budgetInf.budgetOrgCode = '';
			$scope.budgetInf.budgetOrgName = '';
			$scope.budgetInf.billDay = '';
			$scope.isShowBudge = false;
		};
		// 媒介中已有产品对象
		$scope.mediahavedProList = {
			autoQuery : false,
			checkType : 'radio', //
			params : {
				pageSize : 10,
				indexNo : 0,
				idNumber : $rootScope.idNumber,
				idType : $rootScope.idType
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryProduct',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					if (data.returnData != null && data.returnData != undefined && data.returnData != '') {
						if (data.returnData.rows != null && data.returnData.rows != undefined && data.returnData.rows != '' && data.returnData.rows != 'null') {
							if (data.returnData.rows.length > 0) {
								if ($rootScope.prodEstedObjCode != null && $rootScope.prodEstedObjCode != 'null' && $rootScope.prodEstedObjCode != undefined
										&& $rootScope.prodEstedObjCode != '') {
									angular.forEach(data.returnData.rows, function(item, index) {
										if ($rootScope.prodEstedObjCode == item.productObjectCode) {
											item._checked = true;
											$rootScope.prodEstedObjCode = '';
											// 查询默认选中产品下的卡板面
											$scope.formatCodeArray = {
												type : "dynamic",
												param : {
													productObjectCode : item.productObjectCode,
													operationMode : item.operationMode,
												},// 默认查询条件
												text : "formatDescribe", // 下拉框显示内容，根据需要修改字段名称
												value : "formatCode", // 下拉框对应文本的值，根据需要修改字段名称
												resource : "cardLayoutMag.relatedProObjQuery",// 数据源调用的action
												callback : function(data) {
													// console.log(data);
												}
											};
										}
                                    });
								}
                            } else {
								data.returnData.rows = [];
							}
						} else {
							data.returnData.rows = [];
						}
					}
				}
			},
			checkBack : function(item) {
				console.log(item);
				// 查询卡版代码
				$scope.formatCodeArray = {
					type : "dynamic",
					param : {
						productObjectCode : item.productObjectCode,
						operationMode : item.operationMode,
					},// 默认查询条件
					text : "formatDescribe", // 下拉框显示内容，根据需要修改字段名称
					value : "formatCode", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "cardLayoutMag.relatedProObjQuery",// 数据源调用的action
					callback : function(data) {
						// console.log(data);
					}
				};
				$scope.matcheParams = {
					productObjectCode : item.productObjectCode,
					operationMode : item.operationMode,
					idNumber : $rootScope.idNumber,
					idType : $rootScope.idType
				};
				$scope.custNicknameDiv = false;
				$scope.inputDiv = false;
				// 查询是否支持自动配号
				jfRest.request('cstProductAuto', 'querySupportMatche', $scope.matcheParams).then(function(data) {
					if (data.returnCode == "000000") {
						if (data.returnData.rows[0].flagl) {
							$scope.isSupportDiv = true;
							$rootScope.matcheFlag = data.returnData.rows[0].flagl;
							if (data.returnData.rows[0].flagl == '1') {
								$scope.isSupportDiv = true;
								$scope.mdmInfEstbInfo.isSupport = '1';
							} else if (data.returnData.rows[0].flagl == '2') {
								$scope.isSupportDiv = false;
								$scope.mdmInfEstbInfo.isSupport = '2';
							} else if (data.returnData.rows[0].flagl == '3') {
								$scope.mdmInfEstbInfo.isSupport = '';
								$scope.isSupportDiv = true;
							}
                        } else {
							$scope.isSupportDiv = false;
						}
                        $rootScope.productObj = item;
					} else {
						$scope.custNicknameDiv = false;
						$scope.isSupportDiv = false;
					}
                });
			},
		};
		// 是否支持自动配号 单选值
		$scope.matchFlagArray = [ {
			id : '1',
			name : T.T('KHJ3200155')
		}, {
			id : '2',
			name : T.T('KHJ3200156')
		}, {
			id : '3',
			name : T.T('KHJ3200157')
		} ];
		// 动态请求下拉框 是否配置靓号
		$scope.isConfNicknameArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_isConfNickname",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 点击是否配置靓号，特殊段号查询,特殊号查询
		form.on('radio(getIsSupport)', function(data) {
			$scope.mdmInfEstbInfo.externalIdentificationNoIn = '';
			if ($rootScope.matcheFlag == '1') {// 支持配置靓号
				if ($scope.mdmInfEstbInfo.isSupport == '1') {// 必须选择支持配置靓号
					$scope.atuoMatcheFun($rootScope.productObj);
				} else {
					jfLayer.alert(T.T('KHJ3200143'));
				}
			} else if ($rootScope.matcheFlag == '2') {// 不显示弹窗,自动配号
				$scope.custNicknameDiv = false;
				$scope.inputDiv = false;
				if ($scope.mdmInfEstbInfo.isSupport == '1') {
					$scope.atuoHandkle = function(index) {
						$scope.mdmInfEstbInfo.isSupport = '2';
					};
					jfLayer.atuoCloseAlert(T.T('KHJ3200144'), $scope.atuoHandkle);
				}
			} else if ($rootScope.matcheFlag == '3') {// 可以选择
				if ($scope.mdmInfEstbInfo.isSupport == '1') {// 配置靓号
					$scope.atuoMatcheFun($rootScope.productObj);
					$scope.inputDiv = false;
				} else if ($scope.mdmInfEstbInfo.isSupport == '2') {// 随机生成
					$scope.custNicknameDiv = false;// 客户靓号div
					$scope.inputDiv = false;
					return;
				} else if ($scope.mdmInfEstbInfo.isSupport == '3') {// 手工输入
					$scope.custNicknameDiv = false;// 客户靓号div
					$scope.inputDiv = true;
				}
			}
        });
		$scope.atuoMatcheFun = function(event) {
			$scope.queryAutoMatcheInf = $.parseJSON(JSON.stringify(event));
			$scope.queryAutoMatcheInf.corporationEntityNo = $scope.corporationEntityNo;
			$scope.modal('/cstSvc/fastBuildCard/queryAutoMatche.html', $scope.queryAutoMatcheInf, {
				title : T.T('KHJ3200145'),// 账务选择
				buttons : [ T.T('F00107'), T.T('F00108') ],// '确定''取消'
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.sureMatche ]
			});
		};
		// 确定自动配号
		$scope.sureMatche = function(result) {
			if (!result.scope.segmentNumberList.validCheck()) {
				return;
			}
            if (!result.scope.cardNumberList.validCheck()) {
				return;
			}
            // 特殊段号，特殊号
			$scope.segmentNumberInfo = result.scope.segmentNumberList.checkedList();
			$scope.cardNumberInfo = result.scope.cardNumberList.checkedList();
			$scope.queryAutoMatcheInfo = result.scope.queryAutoMatcheInf;
			$scope.custNicknameDiv = true;
			$scope.inputDiv = false;
			// 靓号 = 卡BIN+特殊段号+特殊号
			$scope.mdmInfEstbInfo.externalIdentificationNoIn = $scope.cardNumberInfo.cardNumber;
			$scope.safeApply();
			result.cancel();
		};
		// 进入产品建立页面，先查询客户基本信息，然后客户已有产品，然后再建立新产品
		$scope.searchProCstInfo = function(obj) {
			$scope.paramss = {
				idNumber : obj.idNumber,
				idType : obj.idType
			};
			// 查询客户信息
			jfRest.request('cstInfQuery', 'queryInf', $scope.paramss).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows[0].customerNo == null || data.returnData.rows[0].customerNo == undefined) {
						jfLayer.alert(T.T('KHJ3200094'));// "抱歉，用户创建失败！"
					} else {
						$scope.proInf.idNumber = data.returnData.rows[0].idNumber;
						$scope.proInf.mobilePhone = data.returnData.rows[0].mobilePhone;
						$scope.proInf.customerName = data.returnData.rows[0].customerName;
						$scope.proInf.operationMode = data.returnData.rows[0].operationMode;
						$scope.proInf.customerNo = data.returnData.rows[0].customerNo;
						if (obj.step == '1') {
							$scope.cstBaseInf = data.returnData.rows[0];
                        }
                        $scope.havedProList.params.idNumber = data.returnData.rows[0].idNumber;
						$scope.havedProList.params.idType = data.returnData.rows[0].idType;
						$scope.havedProList.search();// 查询已有产品
						$scope.chooseProList.params.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
						$scope.chooseProList.params.idNumber = data.returnData.rows[0].idNumber;
						$scope.chooseProList.params.idType = data.returnData.rows[0].idType;
						$scope.chooseProList.search();// 查询所有产品
					}
				}
			});
		};
		// 保存 客户产品单元新建
		$scope.proInf = {
			directDebitStatus : "",
			directDebitMode : "",
			exchangePaymentFlag : "",
			directDebitBankNo : "",
			directDebitAccountNo : "",
			coBrandedNo : ""
		};
		// 保存产品信息
		$scope.saveCustomerProduct = function() {
			if ($scope.proInf.directDebitStatus == "1") {
				if (($scope.proInf.directDebitStatus == "" || $scope.proInf.directDebitStatus == undefined || $scope.proInf.directDebitStatus == null)
						|| ($scope.proInf.directDebitMode == "" || $scope.proInf.directDebitMode == undefined || $scope.proInf.directDebitMode == null)
						|| ($scope.proInf.directDebitBankNo == "" || $scope.proInf.directDebitBankNo == undefined || $scope.proInf.directDebitBankNo == null)
						|| ($scope.proInf.directDebitAccountNo == "" || $scope.proInf.directDebitAccountNo == undefined || $scope.proInf.directDebitAccountNo == null)
						|| ($scope.proInf.exchangePaymentFlag == "" || $scope.proInf.exchangePaymentFlag == undefined || $scope.proInf.exchangePaymentFlag == null)) {
					jfLayer.alert(T.T('KHJ3700008'));// "请填写还款信息！"
					return;
				}
			}
            var jointNameCode = document.getElementById('coBrandedNo').value;
			$scope.proInf.idNumber = $scope.hideObj.idNumber;
			$scope.proInf.idType = $scope.hideObj.idType;
			$scope.sparamss = $scope.proInf;
			var checkedItem = $scope.chooseProList.checkedList();
			$scope.saveparamss = Object.assign($scope.sparamss, checkedItem);
			$scope.saveparamss.operatorId = sessionStorage.getItem("userName");
			$scope.saveparamss.budgetOrgCode = $scope.budgetInf.budgetOrgCode;
			$scope.saveparamss.businessProgramNoCycleDaysList = $scope.intBillDayList;// 产品对应的业务项目的账单日
			$rootScope.budgetOrgCode = '';
			if ($scope.saveparamss.budgetOrgCode) {
				$rootScope.budgetOrgCode = $scope.saveparamss.budgetOrgCode;
			}
			jfRest.request('cstProduct', 'saveCstProduct', $scope.saveparamss).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));// "保存成功"
					$scope.havedProList.search();// 产品信息建立中，查询已有产品
					$rootScope.prodEstedObjCode = data.returnData.rows[0].productObjectCode;
					$("#nextBtn2").css({
						backgroundColor : "#2998DC"
					});
					$('#nextBtn2').attr("disabled", false);
				}
			});
		};
		/* =============================客户定价标签设置========================== */
		$scope.csInf = {};
		$scope.labelScopeArr = {};
		// 客户已有定价标签
		$scope.cstHavedLableTable = {
			// checkType : 'radio',
			autoQuery : false,
			params : $scope.queryParam = {
				pageSize : 10,
				indexNo : 0,
				flag : "3",
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstPrcgLblEnqr.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
			transDict : ['pricingType_pricingTypeDesc','pricingMethod_pricingMethodDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 客户业务标签类型表
		$scope.cstBsTypeLbSetTable = {
			checkType : 'checkbox',
			autoQuery : false,
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				"pcdNo" : "8%,9%",
				idType : $scope.hideObj.idType,
				idNumber : $scope.hideObj.idNumber
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstBsTypeLblSet.queryPrcDetail',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
			transDict : ['pricingType_pricingTypeDesc','pricingMethod_pricingMethodDesc'],//翻译前后key
			checkBack : function(row) {
				angular.forEach($scope.cstHavedLableTable.data, function(item, i) {
					if (row.pricingTag == item.pricingTag) {
						row._checked = false;
						jfLayer.alert(T.T('KHJ3200158'));

					}
				});
			},
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					// 业务项目代码
					$scope.labelScopeArr = {
						type : "dynamic",
						param : {
							idType : $scope.hideObj.idType,
							idNumber : $scope.hideObj.idNumber
						},// 默认查询条件
						text : "programDesc", // 下拉框显示内容，根据需要修改字段名称
						value : "businessProgramNo", // 下拉框对应文本的值，根据需要修改字段名称
						resource : "cstBsnisItem.query",// 数据源调用的action
						callback : function(data) {
							if (data) {
							} else {
								var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
								jfLayer.fail(returnMsg);
							}
						}
					};
				}
			},
		};
		// 关联定价标签
		$rootScope.treeSelectPrice = [];
		$scope.saveSelectPrice = function() {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.cstBsTypeLbSetTable.validCheck()) {
				return;
			}
			var items = $scope.cstBsTypeLbSetTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.treeSelectPrice.length; k++) {
					if (items[i].pricingTag == $rootScope.treeSelectPrice[k].pricingTag) { // 判断是否存在
						tipStr = tipStr + items[i].pricingTag + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$rootScope.treeSelectPrice.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('KHJ3200159') + tipStr.substring(0, tipStr.length - 1) + T.T('PZJ100032'));
			}
		};
		// 修改关联定价标签
		$scope.setDate = function(event, $index) {
			$scope.indexNo = $index;
			// 页面弹出框事件(弹出页面)
			$scope.priceInf = $.parseJSON(JSON.stringify(event));
			$scope.priceInf.idNumber = $scope.hideObj.idNumber;
			$scope.priceInf.idType = $scope.hideObj.idType;
			$scope.modal('/cstSvc/fastBuildCard/setPriceLabel.html', $scope.priceInf, {
				title : T.T('KHJ3200160'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '350px' ],
				callbacks : [ $scope.sureSetPriceLabel ]
			});
		};
		$scope.sureSetPriceLabel = function(result) {
			$scope.setPriceInf = result.scope.setPriceInf;
			$rootScope.treeSelectPrice[$scope.indexNo].custTagEffectiveDate = $scope.setPriceInf.custTagEffectiveDate;
			$rootScope.treeSelectPrice[$scope.indexNo].custTagExpirationDate = $scope.setPriceInf.custTagExpirationDate;
			$rootScope.treeSelectPrice[$scope.indexNo].pricingLevel = $scope.setPriceInf.pricingLevel;
			$rootScope.treeSelectPrice[$scope.indexNo].pricingLevelCode = $scope.setPriceInf.pricingLevelCode;
			$scope.safeApply();
			result.cancel();
		};
		// 删除定价标签
		$scope.deletePrice = function(index) {
			var checkId = index;
			$rootScope.treeSelectPrice.splice(checkId, 1);
		};
		// 定价标签详情
		$scope.checkPrcObjDetail = function(event) {
			$scope.blockCDScnMgtInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/fastBuildCard/viewLabelDetail.html', $scope.blockCDScnMgtInfo, {
				title : T.T('KHJ5300016'),// '定价标签详细信息'
				buttons : [ T.T('F00012') ],// '关闭'
				size : [ '1050px', '400px' ],
				callbacks : []
			});
		};
		// 选择定价标签
		// 选择
		/*
		 * $scope.priceList = []; $scope.priceArr =
		 * $scope.builder.option($scope.priceList) ; $scope.choseLabelInf =
		 * function(event){ $scope.itemInfo =
		 * $.parseJSON(JSON.stringify(event));
		 *
		 * $scope.csInf.pricingTag = $scope.itemInfo.pricingTag;
		 * $scope.csInf.pricingDesc = $scope.itemInfo.pricingDesc;
		 * $scope.csInf.pricingObjectCode = $scope.itemInfo.pricingObjectCode;
		 * $scope.csInf.pricingObject = $scope.itemInfo.pricingObject;
		 * $scope.csInf.pricingType = $scope.itemInfo.pricingType;
		 *
		 *
		 *
		 * $scope.itemInfo = $.parseJSON(JSON.stringify(event));
		 *
		 * $scope.csInf.pricingTag = $scope.itemInfo.pricingTag;
		 * $scope.csInf.pricingDesc = $scope.itemInfo.pricingDesc;
		 * $scope.csInf.pricingObjectCode = $scope.itemInfo.pricingObjectCode;
		 * $scope.csInf.pricingObjectCodeTrans =
		 * $scope.itemInfo.pricingObjectCode +'-'+
		 * $scope.itemInfo.pricingObjectDesc; $scope.csInf.pricingObject =
		 * $scope.itemInfo.pricingObject; $scope.csInf.pricingType =
		 * $scope.itemInfo.pricingType;
		 *
		 * $scope.priceList = [{name :T.T('KHH3200171'),id : 'C'}];
		 * $scope.priceArr = $scope.builder.option($scope.priceList) ;
		 * if($scope.itemInfo.instanDimen1=='MODG'||
		 * $scope.itemInfo.instanDimen2=='MODG'||
		 * $scope.itemInfo.instanDimen3=='MODG'||
		 * $scope.itemInfo.instanDimen4=='MODG'||
		 * $scope.itemInfo.instanDimen5=='MODG' ){ $scope.priceList.push({name
		 * :T.T('KHH3200172'),id : 'G'}); $scope.priceArr =
		 * $scope.builder.option($scope.priceList) ; }
		 * if($scope.itemInfo.instanDimen1=='MODT'||
		 * $scope.itemInfo.instanDimen2=='MODT'||
		 * $scope.itemInfo.instanDimen3=='MODT'||
		 * $scope.itemInfo.instanDimen4=='MODT'||
		 * $scope.itemInfo.instanDimen5=='MODT' ){ $scope.priceList.push({name
		 * :T.T('KHH3200173'),id : 'T'}); $scope.priceArr =
		 * $scope.builder.option($scope.priceList) ; }
		 * if($scope.itemInfo.instanDimen1=='MODP'||
		 * $scope.itemInfo.instanDimen2=='MODP'||
		 * $scope.itemInfo.instanDimen3=='MODP'||
		 * $scope.itemInfo.instanDimen4=='MODP'||
		 * $scope.itemInfo.instanDimen5=='MODP' ){ $scope.priceList.push({name
		 * :T.T('KHH3200174'),id : 'P'}); $scope.priceArr =
		 * $scope.builder.option($scope.priceList) ; }
		 * if($scope.itemInfo.instanDimen1=='MODM'||
		 * $scope.itemInfo.instanDimen2=='MODM'||
		 * $scope.itemInfo.instanDimen3=='MODM'||
		 * $scope.itemInfo.instanDimen4=='MODM'||
		 * $scope.itemInfo.instanDimen5=='MODM' ){ $scope.priceList.push({name
		 * :T.T('KHH3200175'),id : 'M'}); $scope.priceArr =
		 * $scope.builder.option($scope.priceList) ; }
		 *  };
		 */
		// 保存按钮事件定价标签
		$scope.saveLabelInf = function() {
			//关联的定价标签 日期必输
			$scope.flag = true;
			for(var i = 0 ;i < $rootScope.treeSelectPrice.length; i++){
				if(!$rootScope.treeSelectPrice[i].custTagEffectiveDate || !$rootScope.treeSelectPrice[i].custTagExpirationDate){
					jfLayer.alert(T.T('KHJ3200161'));
					$scope.flag = false;
					break;
				}
            }
            if(!$scope.flag){
				return;
            }
            $scope.csInf.customerNo = $rootScope.customerNo;
			$scope.safeApply();
			if (!$scope.csInf.businessProgramNo || $scope.csInf.businessProgramNo == undefined) {
				$scope.csInf.businessProgramNo = '';
			}
            $scope.csInf.idNumber = $scope.hideObj.idNumber;
			$scope.csInf.idType = $scope.hideObj.idType;
			$scope.csInf.pcdNo = "8%,9%";
			$scope.csInf.coreCustomerBusinessTypeList = $rootScope.treeSelectPrice;
			$scope.csInf.addFlag = 2;
			jfRest.request('cstBsTypeLblSet', 'savePrcDetail', $scope.csInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ3200146'));// "保存成功"
					$scope.csInf = {};
					$scope.credentialNumber = "";
					$scope.phoneNumber = "";
					$scope.customerNo = "";
					$scope.customerName = "";
					$rootScope.treeSelectPrice = [];
					$scope.labelInfDiv = false;
					$scope.mediaInfDiv = true;
				}
			});
		};
		// 定价标签 上一步
		$scope.labelPre = function() {
			$scope.proInfDiv = true;
			$scope.labelInfDiv = false;
			$scope.havedProList.params.idType = $rootScope.idType;
			$scope.havedProList.params.idNumber = $rootScope.idNumber;
			$scope.havedProList.search();// 已有产品
			$scope.chooseProList.params.idType = $rootScope.idType;
			$scope.chooseProList.params.idNumber = $rootScope.idNumber;
			$scope.chooseProList.search();// 所有产品
		};
		/* ===================================客户定价标签设置end================================= */
		/* ============================媒介信息建立========================= */
		// $scope.mediaOtherDiv = true;// 媒介建立中，基本信息以外内容
		// 主附标识
		// $scope.mainAttachmentArray = [ {name : '主卡',id : '1'}, {name :
		// '附属卡',id : '2'} ];
		// $scope.mainAttachmentArray = [ {name : T.T('KHJ3200095'),id : '1'},
		// {name : T.T('KHJ3200096'),id : '2'} ];
		// $scope.mediaObjectCodeList = [ {name : '磁条卡',id : 'MODM00001'}, {name
		// : '芯片卡',id : 'MODM00002'}, {name : '虚拟卡',id : 'MODM00010'} ];
		// $scope.mediaObjectCodeList = [ {name : T.T('KHJ3200101'),id :
		// 'MODM00001'}, {name : T.T('KHJ3200102'),id : 'MODM00002'}, {name :
		// T.T('KHJ3200103'),id : 'MODM00010'} ];
		// $scope.cardMakingResult = [ {name : '是',id : '1'}, {name : '否',id : '
		// '} ];
		// $scope.cardMakingResult = [ {name : T.T('KHJ3200108'),id : '1'},
		// {name : T.T('KHJ3200109'),id : ''} ];
		// 动态请求下拉框 主附标识
		$scope.mainAttachedFlagArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_mainAttachedFlag",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 媒介对象代码
		$scope.mediaObjectCodeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_mediaObjectCode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		// 动态请求下拉框 制卡请求
		$scope.requestCardMakingArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_requestCardMaking",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data)
			}
		};
		//动态请求下拉框 申请渠道
        $scope.applicationChannelArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_applicationChannel",
                queryFlag : "children"
            },// 默认查询条件
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };
        //动态请求下拉框 申请场景
        $scope.applicationScenarioArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_applicationScenarioArr",
                queryFlag : "children"
            },// 默认查询条件
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };
		// 媒介基本信息与制卡信息
		$scope.mdmInfEstbInfo = {};
		// 客户基本信息对象
		$scope.csInf = {};
		// 基本信息对象上传参数对象
		$scope.csInfParams = {};
		$scope.existProParams = {};
		$scope.showCardNo = false;// 卡号隐藏
		$scope.showLblInfo = false;// 隐藏新增标签信息
		$scope.isShowsubCustomerNoDiv = false;// 副客户代码
		// 附属卡，增加副客户代码
		form.on('select(getMainSupply)', function(data) {
			if (data.value == '2') {// 附属卡
				$scope.isShowsubCustomerNoDiv = true;
				$scope.modal('/cstSvc/fastBuildCard/addSupplyCstCode.html', {}, {
					title : '选择主卡信息',//T.T('KHJ3200147')
					buttons : [ T.T('F00107'), T.T('F00108') ],// '确定''取消'
					size : [ '1100px', '350px' ],
					callbacks : [ $scope.sureAddSupplyCstCode ]
				});
			} else if (data.value == '1') {// 主卡
				$scope.isShowsubCustomerNoDiv = false;
				$scope.mdmInfEstbInfo.subCustomerNo = '';
				return;
			}
        });
		// 确认附属卡信息建立
		$scope.sureAddSupplyCstCode = function(result) {
			if (!$scope.mediahavedProList.validCheck()) {// 如果客户已有产品没有选择
				jfLayer.alert(T.T('KHJ3200148'));
				return;
			}
            $scope.supplyCstCodeInf = result.scope.supplyCstCodeInf;
			$scope.supplyCstCodeParams = result.scope.supplyCstCodeParams;// 参数
			if ($scope.supplyCstCodeInf.isHaveCstFlag == '0') {
				$scope.safeApply();
				result.cancel();
				// 跳转客户信息建立页面，并记录附属卡 证件类型和证件号码
				lodinDataService.setObject('mediaCstInf', $scope.mediaCstInf);// 客户基本信息
																				// 证件类型，证件号码，客户名称
				lodinDataService.setObject('mdmInfEstbInfo', $scope.mdmInfEstbInfo);// 媒介建立基本信息
				if ($scope.mediahavedProList.checkedList()) {
					lodinDataService.setObject('choosedPro', $scope.mediahavedProList.checkedList());// 媒介建立选择的产品
				}
                lodinDataService.setObject('supplyCardInf', $scope.supplyCstCodeParams);// 附属卡基本信息
																						// 证件类型，证件号码
				lodinDataService.set("fastBuildFlag", '1');// 跳转客户信息建立 标记
				$scope.turn('/cstSvc/csInfEstb');
			} else {
			    //赋值主客户号和附属客户号
				$scope.mdmInfEstbInfo.subCustomerNo = $scope.mediaCstInf.customerNo
                $scope.mdmInfEstbInfo.mainCustomerNo = $scope.supplyCstCodeInf.customerNo;
				$scope.safeApply();
				result.cancel();
			}
        };
		// 卡版代码
		$scope.formatCodeArray = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "formatDescribe", // 下拉框显示内容，根据需要修改字段名称
			value : "formatCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "cardLayoutMag.query",// 数据源调用的action
			callback : function(data) {
				// console.log(data);
			}
		};
		// 媒介刻印 小写字母转化成大写字母
		$scope.toUpperCase = function(val) {
			var upObj = val.toUpperCase();
			return upObj;
		};
		$("#embosserName1").on("keyup", function() {
			if ($scope.mdmInfEstbInfo.embosserName1) {
				$scope.mdmInfEstbInfo.embosserName1 = $scope.toUpperCase($scope.mdmInfEstbInfo.embosserName1);
			}
		});
		$("#dpanInfEmbosserName1").on("keyup", function() {
			if ($scope.dpanInf.embosserName1) {
				$scope.dpanInf.embosserName1 = $scope.toUpperCase($scope.dpanInf.embosserName1);
			}
		});
		// 查询客户基本信息查询
		$scope.mediaCstInf = {};
		$scope.searchMdmInfEstbInfo = function(obj) {
			$scope.csInfParams = {
				idNumber : obj.idNumber,
				idType : obj.idType
			};
			// 媒介列表查询客户基本信息
			jfRest.request('cstInfQuery', 'queryInf', $scope.csInfParams).then(function(data) {
				if (data.returnCode == '000000') {
					// 附属卡信息建立成功跳转的标记
					if (sessionStorage.getItem("preCstEstFlag") == '1') {// 附属卡跳转过来
						$scope.cstQueryObj.idNumber = data.returnData.rows[0].idNumber;
						$scope.cstQueryObj.idType = data.returnData.rows[0].idType;
						// 默认选中的产品
						if (lodinDataService.getObject('choosedPro').productObjectCode) {
							$rootScope.prodEstedObjCode = lodinDataService.getObject('choosedPro').productObjectCode;
							// 查询默认选中产品下的卡板面
							$scope.formatCodeArray = {
								type : "dynamic",
								param : {
									productObjectCode : $rootScope.prodEstedObjCode.productObjectCode,
									operationMode : $rootScope.prodEstedObjCode.operationMode,
								},// 默认查询条件
								text : "formatDescribe", // 下拉框显示内容，根据需要修改字段名称
								value : "formatCode", // 下拉框对应文本的值，根据需要修改字段名称
								resource : "cardLayoutMag.relatedProObjQuery",// 数据源调用的action
								callback : function(data) {
								}
							};
                        }
                        $scope.mdmInfEstbInfo = lodinDataService.getObject('mdmInfEstbInfo');// 媒介建立基本信息
						$scope.isShowsubCustomerNoDiv = true;
						$scope.mdmInfEstbInfo.mainSupplyIndicator = '2';
						$scope.mdmInfEstbInfo.subCustomerNo = lodinDataService.get("subCustomerNo");
                    }
                    $scope.mediaCstInf.customerNo = data.returnData.rows[0].customerNo;
					$scope.mediaCstInf.customerName = data.returnData.rows[0].customerName;
					$scope.mediaCstInf.idNumber = data.returnData.rows[0].idNumber;
					$scope.mediaCstInf.idType = data.returnData.rows[0].idType;
					$scope.mdmInfEstbInfo.mainCustomerCode = data.returnData.rows[0].customerNo;
					$scope.mdmInfEstbInfo.mainCustomerNo = data.returnData.rows[0].customerNo;
					// 一键制卡成功后，客户基本信息
					$scope.overShowBaseInf.customerNo = data.returnData.rows[0].customerNo;
					$scope.overShowBaseInf.customerName = data.returnData.rows[0].customerName;
					$scope.overShowBaseInf.idNumber = data.returnData.rows[0].idNumber;
					// 媒介信息中，查询已有产品
					$scope.mediahavedProList.params.idNumber = data.returnData.rows[0].idNumber;
					$scope.mediahavedProList.params.idType = data.returnData.rows[0].idType;
					$scope.mediahavedProList.search();
					sessionStorage.removeItem("preCstEstFlag");// 附属卡信息建立传过来的标记
				}
			});
		};
		// 媒介对象控制制卡请求
		$scope.isShowFormatCode = true;
		layui.form.on('select(getRiskLimits)', function(event) {
			if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00001") {
				$scope.mdmInfEstbInfo.requestCardMaking = "1";
				$('#formatCode').attr("disabled", false);
				$scope.isShowFormatCode = true;
			} else if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00002") {
				$scope.mdmInfEstbInfo.requestCardMaking = "1";
				$('#formatCode').attr("disabled", false);
				$scope.isShowFormatCode = true;
			} else if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00003") {
				$scope.mdmInfEstbInfo.requestCardMaking = "1";
				$('#formatCode').attr("disabled", false);
				$scope.isShowFormatCode = true;
			} else if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00010") { // 虚拟卡时
				$scope.mdmInfEstbInfo.requestCardMaking = "";
				$scope.mdmInfEstbInfo.formatCode = '';
				// $('#formatCode').attr("disabled", true);
				$scope.isShowFormatCode = false;
			} else {
				$scope.mdmInfEstbInfo.requestCardMaking = "";
			}
		});
		// 新增
		$scope.newAdrBtn = function() {
			$scope.showNewAdrInfo = !$scope.showNewAdrInfo;
		};
		// 新增客户定价标签信息按钮
		$scope.lblInfBtn = function() {
			$scope.showLblInfo = !$scope.showLblInfo;
			$timeout(function() {
				// 日期控件
				layui.use('laydate', function() {
					var laydate = layui.laydate;
					var startDate = laydate.render({
						elem : '#fa_mediaTagEffectiveDate_zs',
						// min:"2019-03-01",
						done : function(value, date) {
							endDate.config.min = {
								year : date.year,
								month : date.month - 1,
								date : date.date,
							};
							endDate.config.start = {
								year : date.year,
								month : date.month - 1,
								date : date.date,
							};
						}
					});
					var endDate = laydate.render({
						elem : '#fa_mediaTagEffectiveDate_ze',
						// min:Date.now(),
						done : function(value, date) {
							startDate.config.max = {
								year : date.year,
								month : date.month - 1,
								date : date.date,
							}
						}
					});
				});
				// 日期控件end
			}, 100);
		};
		/*
		 * $scope.lblInfTable = new Array(); $scope.lblInfTableInfo = {};
		 * $scope.coreMediaLabelInfos = new Array(); //标签信息保存 $scope.savelblInf =
		 * function() { var lblInfTableInfo = new Object();
		 * lblInfTableInfo.labelNumber = $scope.lblInfTableInfo.labelNumber;
		 * lblInfTableInfo.mediaTagEffectiveDate =
		 * $scope.lblInfTableInfo.mediaTagEffectiveDate;
		 * lblInfTableInfo.mediaTagEffectiveDate =
		 * $scope.lblInfTableInfo.mediaTagEffectiveDate;
		 * $scope.coreMediaLabelInfos.push(lblInfTableInfo);
		 * $scope.lblInfTableInfo = {}; $scope.showLblInfo = false; };
		 *
		 * //删除标签信息 $scope.removeLabel= function(index) {
		 * $scope.coreMediaLabelInfos.splice(index, 1); };
		 */
		// 客户一键制卡成功后，显示的客户基本信息对象
		$scope.overShowBaseInf = {};
		// 媒介提交
		$scope.submitMediaInf = function() {
			// 是否支持自动配号
			if ($rootScope.matcheFlag == '1') {// 支持配置靓号
				if ($scope.mdmInfEstbInfo.isSupport == '2') {
					jfLayer.alert(T.T('KHJ3200149'));
					return;
                }
            }
            if ($rootScope.matcheFlag == '2') {// 自动配号
				if ($scope.mdmInfEstbInfo.isSupport == '1') {
					jfLayer.alert(T.T('KHJ3200150'));
					return;
                }
            }
            if ($scope.matcheFlag == '3') {// 自己选
				/*
				 * if($scope.mdmInfEstbInfo.isSupport == '2'){//否
				 * $scope.mdmInfEstbInfo.externalIdentificationNoIn = ''; }else
				 * if($scope.mdmInfEstbInfo.isSupport == '1'){//是
				 *  };
				 */
            }
            if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00001" || $scope.mdmInfEstbInfo.mediaObjectCode == "MODM00002") {
				if ($scope.mdmInfEstbInfo.formatCode == '' || $scope.mdmInfEstbInfo.formatCode == undefined || $scope.mdmInfEstbInfo.formatCode == null) {
					jfLayer.alert(T.T('KHJ3200151'));
					return;
				}
            }
            if ($scope.mdmInfEstbInfo.mainAttachment == 2) {
				if (!$scope.mdmInfEstbInfo.subCustomerNo) {
					jfLayer.alert(T.T('KHJ3200114'));// "请填写副客户代码！"
					return;
				}
            }
            if (!$scope.mediahavedProList.validCheck()) {
				return;
            }
            //标签信息
			/*if ($scope.lblInfTable.length != 0) {
				$scope.mdmInfEstbInfo.CoreMediaLabelInformations = $scope.lblInfTable;
			};*/
			$scope.havedProObj = $scope.mediahavedProList.checkedList();
			$scope.mdmInfEstbInfo = Object.assign($scope.mdmInfEstbInfo, $scope.mediaCstInf);
			$scope.mdmInfEstbInfo = Object.assign($scope.mdmInfEstbInfo, $scope.havedProObj);
			if ($rootScope.budgetOrgCode) {
				$scope.mdmInfEstbInfo.budgetOrgCode = $rootScope.budgetOrgCode;
			}
            jfRest.request('cstMediaList', 'submitMdmInfo', $scope.mdmInfEstbInfo).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.csInfParams.externalIdentificationNo = data.returnData.rows[0].externalIdentificationNo;
					//$scope.csInfParams.mediaObjectCode = data.returnData.rows[0].mediaObjectCode;
					//$scope.csInfParams.mediaUnitCode = data.returnData.rows[0].mediaUnitCode;
					// 制卡成功，显示客户基本信息
					$scope.overShowBaseInf.externalIdentificationNo = data.returnData.rows[0].externalIdentificationNo;// 外部识别号
					$scope.overShowBaseInfDiv = true;
					$scope.mediaInfDiv = false;
					jfLayer.success(T.T('KHJ3200115'));// "媒介信息建立成功!"
					$scope.showLblInfo = false;// 隐藏新增标签信息
					// $scope.mediaOtherDiv = false;//媒介建立中，基本信息以外内容
					$scope.showCardNo = true; // 外部识别号
					// 初始化
					$scope.adrlInfTable = [];
					$scope.lblInfTable = [];
					$scope.mdmInfEstbInfo = {};
					$scope.mdmInfEstbInfo = {};
					$scope.cstBaseInf = {};
					$scope.proInf = {};
					$rootScope.prodEstedObjCode = '';
				}
			});
		}; /* 媒介提交结束 */
		// 进入媒介页面，默认查询客户基本信息
		if (sessionStorage.getItem("preCstEstFlag") == '1') {
			$scope.custBaseInfDiv = false;// 客户基本信息建立
			$scope.proInfDiv = false;// 产品信息建立
			$scope.mediaInfDiv = true;// 媒介信息建立
			$scope.subCstEstParams = {
				idType : lodinDataService.getObject('mediaCstInf').idType,
				idNumber : lodinDataService.getObject('mediaCstInf').idNumber
			};
			$scope.searchMdmInfEstbInfo($scope.subCstEstParams);
		}
        /*
         * ================================== dpan
         * =============================================
         */
		$scope.dpanInf = {};
		// 客户已有媒介
		$scope.havedMediaList = {
			checkType : 'radio',
			autoQuery : false,
			params : $scope.queryParam = {},
			paging : true,
			resource : 'cstMediaList.queryMediaMaj',
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc'],//翻译前后key
			callback : function(data) {
				// console.log(data);
				if (data.returnCode == '000000') {
					if (data.returnData) {
						$scope.custBaseInfDiv = false;
						$scope.proInfDiv = false;
						$scope.mediaInfDiv = false;
						$scope.dpanInfDiv = true;
						if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows.length == '') {
							data.returnData.rows = [];
						}
					} else {
						data.returnData = {
							rows : []
						};
					}
				} else {
					jfLayer.fail(data.returnMsg);
				}
			},
			checkBack : function(row) {
				if ($scope.havedMediaList.validCheck()) {
					$scope.dpanMediaDetailDiv = true;
					$scope.dpanInf = row;
					$scope.dpanInf.customerNo = $rootScope.customerNo;
					$scope.dpanInf.customerName = $rootScope.customerName;
					$scope.dpanInf.idNumber = $rootScope.idNumber;
					$scope.dpanInf.idType = $rootScope.idType;
					if ($scope.dpanInf.embosserName1) {
						$scope.dpanInf.embosserName1 = $scope.dpanInf.embosserName1.toUpperCase();
					}
				} else {
					$scope.dpanMediaDetailDiv = false;
				}
			}
		};
		// 查询媒介对象代码
		$scope.mediaObjectCodeArr2 = {
			type : "dynamic",
			param : {
				mediaObjectType : "T",
				mediaObjectForm : "T"
			},// 默认查询条件
			text : "mediaObjectDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "mediaObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "cstInfBuild.queryDpanMediaiObj",// 数据源调用的action
			callback : function(data) {
				// console.log(data);
			}
		};
		form.on('select(getMediaObjectCode)', function(data1) {
			$scope.param = {
				mediaObjectType : "T",
				mediaObjectForm : "T"
			};
			jfRest.request('cstInfBuild', 'queryDpanMediaiObj', $scope.param).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows) {
							for (var i = 0; i < data.returnData.rows.length; i++) {
								if (data1.value == data.returnData.rows[i].mediaObjectCode) {
									$scope.dpanInf.mediaObjectDesc = data.returnData.rows[i].mediaObjectDesc;
								}
							}
						}
					}
				}
			});
		});
		// 保存dpan媒介
		$scope.submitDpanMediaInf = function() {
			if (!$scope.havedMediaList.validCheck()) {
				return;
			}
            $scope.dapnMediaObj = $scope.dpanInf;
			$scope.dapnMediaObj.idType = $scope.dpanInf.idType;
			$scope.dapnMediaObj.idNumber = $scope.dpanInf.idNumber;
			$scope.dapnMediaObj.deviceNumber = $scope.dpanInf.deviceNumber;// 设备号
			$scope.dapnMediaObj.invalidReason = 'DPAN';
			jfRest.request('cstMediaList', 'submitMdmInfo', $scope.dapnMediaObj).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ3200154'));// "dpan媒介信息建立成功!"
					$scope.dpanInfDiv = false;// 隐藏新增标签信息
					// dpan建立成功后，显示
					$scope.overShowBaseInfDiv = true;
					$scope.overShowBaseInf.customerNo = data.returnData.rows[0].customerNo;
					$scope.overShowBaseInf.customerName = $rootScope.customerName;
					$scope.overShowBaseInf.idNumber = data.returnData.rows[0].idNumber;
					$scope.overShowBaseInf.externalIdentificationNo = data.returnData.rows[0].externalIdentificationNo;
					// 初始化
					$scope.adrlInfTable = [];
					$scope.lblInfTable = [];
					$scope.mdmInfEstbInfo = {};
					$scope.mdmInfEstbInfo = {};
					$scope.cstBaseInf = {};
					$rootScope.prodEstedObjCode = '';
				}
			});
		};
	});
	// 弹窗，选择产品或附属卡
	webApp.controller('layerChooseCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {},
			paging : true,
			resource : 'quickAskCard.query',
			callback : function(data) {
				// console.log(data);
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows.length == '') {
							data.returnData.rows = [];
						}
					} else {
						data.returnData = {
							rows : []
						};
					}
				}
			}
		};
	});
	// 弹窗，只能选择产品
	webApp.controller('layerChooseProCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		$scope.itemList = {
			checkType : 'radio',
			params : $scope.queryParam = {},
			paging : true,
			resource : 'quickAskCard.justChoosePro',
			callback : function(data) {
				// console.log(data);
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows.length == '') {
							data.returnData.rows = [];
						}
					} else {
						data.returnData = {
							rows : []
						};
					}
				}
			}
		};
	});
	// 自动配号弹窗queryAutoMatcheCtrl
	webApp.controller('queryAutoMatcheCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
		$translate.refresh();
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		$scope.queryAutoMatcheInf = $scope.queryAutoMatcheInf;
		$scope.queryAutoMatcheInf.cardBin = $scope.queryAutoMatcheInf.binNo;
		// 特殊段号查询
		$scope.segmentNumberList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				cardBin : $scope.queryAutoMatcheInf.cardBin,
				corporationEntityNo : $scope.queryAutoMatcheInf.corporationEntityNo
			},
			paging : true,
			resource : 'cstProductAuto.querySegmentNum',
			callback : function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows.length == '') {
							data.returnData.rows = [];
						}
					} else {
						data.returnData = {
							rows : []
						};
					}
				}
			}
		};
		// 特殊号查询
		$scope.cardNumberList = {};
		$scope.cardNumberList = {
			checkType : 'radio',
			autoQuery : false,
			params : $scope.queryParam = {
				cardBin : $scope.queryAutoMatcheInf.cardBin,
				corporationEntityNo : $scope.queryAutoMatcheInf.corporationEntityNo,
			// segmentNumber:
			// $scope.segmentNumberList.checkedList().segmentNumber*/
			},
			paging : true,
			resource : 'cstProductAuto.queryCardNumber',
			callback : function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows.length == '') {
							data.returnData.rows = [];
						}
					} else {
						data.returnData = {
							rows : []
						};
					}
					angular.forEach(data.returnData.rows, function(item, i) {
						item.cardNumberStr = '*********' + item.cardNumber.substr(9, item.cardNumber.split('').length);
					});
				}
			}
		};
		// 查询特殊号
		$scope.checkCardNumInf = function(item) {
			$scope.cardNumberList.params.segmentNumber = item.segmentNumber;
			$scope.isShowCardNumDiv = true;
			$scope.cardNumberList.search();
		};
		// 重置
		$scope.resetSegmentNum = function() {
			$scope.segmentNumberList.params.segmentNumber = '';
			$scope.isShowCardNumDiv = false;
		};
	});
	// 弹窗，判断对应产品是否需要输入账单日
	webApp.controller('layerIntBillDayCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
		$translate.refresh();
		$scope.dataList = [];
		// 选择产品，对应业务项目需要输入账单日
		$scope.queryIsIntBillDay = function() {
			$scope.queryIsIntBillDayParamss = {
				operationMode : $scope.proItem.operationMode,
				productObjectCode : $scope.proItem.productObjectCode,
				idType : $scope.proItem.idType,
				idNumber : $scope.proItem.idNumber,
			};
			jfRest.request('cstInfBuild', 'queryIsIntBillDay', $scope.queryIsIntBillDayParamss).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData) {
						if (data.returnData.rows.length > 0) {// rows不为空，产品对应业务项目需要输入账单日期
							$scope.dataList = data.returnData.rows;
						} else if (data.returnData.rows == 0 || data.returnData.rows == null || data.returnData.rows == undefined) {
							return;
						}
					}
                }
			});
		};
		$scope.queryIsIntBillDay();
	});
	// 查看客户定价标签设置
	webApp.controller('viewLabelDetailCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $timeout, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translate.refresh();
		$scope.priceModelArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceModel",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingMethod = $scope.blockCDScnMgtInfo.pricingMethod;
			}
		};
		$scope.valTypArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_valueType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pcdType = $scope.blockCDScnMgtInfo.pcdType;
			}
		};
		// 动态请求下拉框 定价区域
		$scope.priceAreaArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "codes", // 下拉框显示内容，根据需要修改字段名称
			desc : 'detailDesc',
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingType = $scope.blockCDScnMgtInfo.pricingType;
			}
		};
		$scope.isShowPrcDetailDiv = false;
		// 客户业务标签类型表
		$scope.prcLbInfTable = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"operationMode" : $scope.blockCDScnMgtInfo.operationMode,
				"pricingObject" : $scope.blockCDScnMgtInfo.pricingObject,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstBsTypeLblSet.queryPrcDetail',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 新增附属卡
	webApp.controller('addSupplyCstCodeCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $timeout, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
		$translate.refresh();
		$scope.supplyCstCodeParams = {};
		$scope.supplyCstCodeInf = {};
		$scope.supplyCstCodeDiv = false;
		// 联动验证
		var form = layui.form;
		form.on('select(getSupplyIdType)', function(data) {
			$("#supply_idNumber").val("");
			$scope.supplyCstCodeInf.idNumber = '';
			if (data.value == "1") {// 身份证
				$("#supply_idNumber").attr("validator", "id_idcard");
			} else if (data.value == "2") {// 港澳居民来往内地通行证
				$("#supply_idNumber").attr("validator", "id_isHKCard");
			} else if (data.value == "3") {// 台湾居民来往内地通行证
				$("#supply_idNumber").attr("validator", "id_isTWCard");
			} else if (data.value == "4") {// 中国护照
				$("#supply_idNumber").attr("validator", "id_passport");
			} else if (data.value == "5") {// 外国护照passport
				$("#supply_idNumber").attr("validator", "id_passport");
			} else if (data.value == "6") {// 外国人永久居留证
				$("#supply_idNumber").attr("validator", "id_isPermanentReside");
			} else if (data.value == "0" || data.value == null || data.value == undefined || data.value == "") {// 其他
				$("#supply_idNumber").attr("validator", "noValidator");
				$scope.searchInfForm.$setPristine();
				$("#supply_idNumber").removeClass("waringform ");
			}
        });
		// 客户存在，查询客户代码，不存在则 客户信息建立
		$scope.queryHaveCst = function() {
			lodinDataService.set('suppleCardEstFlag', 1);
			jfRest.request('cstInfQuery', 'queryInf', $scope.supplyCstCodeParams).then(function(data) {
				if (data.returnCode == '000000') {// 客户存在
					$scope.supplyCstCodeDiv = true;
					$scope.supplyCstCodeInf = data.returnData.rows[0];
				} else if (data.returnCode == "Gns2Error") {
					$scope.supplyCstCodeInf.isHaveCstFlag = '0';
					$scope.supplyCstCodeDiv = false;
					jfLayer.atuoCloseAlert(T.T('KHJ3200152'));
				} else if (data.returnCode == "CUS-00014") {
					$scope.supplyCstCodeInf.isHaveCstFlag = '0';
					$scope.supplyCstCodeDiv = false;
					jfLayer.atuoCloseAlert(T.T('KHJ3200152'));
				}
			});
		};
	});
	// 设置定价标签
	webApp.controller('setPriceLabelCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer, $timeout, $location, lodinDataService, $translate, T,
			$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translate.refresh();
		$scope.setPriceInf = {};
		$scope.itemInfo = $scope.priceInf;
		// 日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem : '#custTagEffectiveDate',
				// min:"2019-03-01",
				done : function(value, date) {
					endDate.config.min = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					endDate.config.start = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					$scope.setPriceInf.custTagEffectiveDate = $("#custTagEffectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem : '#custTagExpirationDate',
				// min:Date.now(),
				done : function(value, date) {
					startDate.config.max = {
						year : date.year,
						month : date.month - 1,
						date : date.date,
					};
					$scope.setPriceInf.custTagExpirationDate = $("#custTagExpirationDate").val();
				}
			});
		});
		// 日期控件end
		// 选择定价标签
		$scope.priceList = [ {
			name : T.T('KHH3200171'),
			id : 'C'
		} ];
		$scope.priceArr = $scope.builder.option($scope.priceList);
		$scope.priceArr = $scope.builder.option($scope.priceList);
		if ($scope.itemInfo.instanDimen1 == 'MODG' || $scope.itemInfo.instanDimen2 == 'MODG' || $scope.itemInfo.instanDimen3 == 'MODG' || $scope.itemInfo.instanDimen4 == 'MODG'
				|| $scope.itemInfo.instanDimen5 == 'MODG') {
			$scope.priceList.push({
				name : T.T('KHH3200172'),
				id : 'G'
			});
			$scope.priceArr = $scope.builder.option($scope.priceList);
		}
		if ($scope.itemInfo.instanDimen1 == 'MODT' || $scope.itemInfo.instanDimen2 == 'MODT' || $scope.itemInfo.instanDimen3 == 'MODT' || $scope.itemInfo.instanDimen4 == 'MODT'
				|| $scope.itemInfo.instanDimen5 == 'MODT') {
			$scope.priceList.push({
				name : T.T('KHH3200173'),
				id : 'T'
			});
			$scope.priceArr = $scope.builder.option($scope.priceList);
		}
		if ($scope.itemInfo.instanDimen1 == 'MODP' || $scope.itemInfo.instanDimen2 == 'MODP' || $scope.itemInfo.instanDimen3 == 'MODP' || $scope.itemInfo.instanDimen4 == 'MODP'
				|| $scope.itemInfo.instanDimen5 == 'MODP') {
			$scope.priceList.push({
				name : T.T('KHH3200174'),
				id : 'P'
			});
			$scope.priceArr = $scope.builder.option($scope.priceList);
		}
		if ($scope.itemInfo.instanDimen1 == 'MODM' || $scope.itemInfo.instanDimen2 == 'MODM' || $scope.itemInfo.instanDimen3 == 'MODM' || $scope.itemInfo.instanDimen4 == 'MODM'
				|| $scope.itemInfo.instanDimen5 == 'MODM') {
			$scope.priceList.push({
				name : T.T('KHH3200175'),
				id : 'M'
			});
			$scope.priceArr = $scope.builder.option($scope.priceList);
		}
        // 定价层级
		var form = layui.form;
		$scope.labelScopeArr = {};
		form.on('select(pricingLev)', function(data) {
			$scope.params = {};
			$scope.params.idType = $scope.priceInf.idType;
			$scope.params.idNumber = $scope.priceInf.idNumber;
			$scope.labelScopeArr = {};
			if (data.value == "C") {
				$scope.labelScopeArr = {
					type : "dynamicDesc",
					param : $scope.params,// 默认查询条件
					text : "customerNo", // 下拉框显示内容，根据需要修改字段名称
					desc : "customerName",
					value : "customerNo", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "cstInfQuery.queryCstNo",// 数据源调用的action
					callback : function(data) {
						if (data) {
						} else {
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
							jfLayer.fail(returnMsg);
						}
					}
				};
			} else if (data.value == "G") {
				$scope.labelScopeArr = {
					type : "dynamicDesc",
					param : $scope.params,// 默认查询条件
					text : "businessProgramNo", // 下拉框显示内容，根据需要修改字段名称
					desc : "programDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "businessProgramNo", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "cstBsnisItem.query",// 数据源调用的action
					callback : function(data) {
						if (data) {
						} else {
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
							jfLayer.fail(returnMsg);
						}
					}
				};
			} else if (data.value == "P") {
				$scope.labelScopeArr = {
					type : "dynamicDesc",
					param : $scope.params,// 默认查询条件
					text : "productObjectCode", // 下拉框显示内容，根据需要修改字段名称
					desc : "productDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "productObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "cstProduct.queryProMaj",// 数据源调用的action
					callback : function(data) {
						if (data) {
						} else {
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
							jfLayer.fail(returnMsg);
						}
					}
				};
			} else if (data.value == "T") {
				$scope.busArray = [];
				$scope.operationMode = "";
				$scope.labelScopeArr = {
					type : "dynamic",
					param : $scope.params,// 默认查询条件
					text : "programDesc", // 下拉框显示内容，根据需要修改字段名称
					value : "businessProgramNo", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "cstBsnisItem.query",// 数据源调用的action
					callback : function(data) {
						if (data && data.length != 0) {
							for (var i = 0; i < data.length; i++) {
								$scope.operationMode = data[i].operationMode;
								$scope.busArray.push(data[i].businessProgramNo);
							}
							$scope.labelScopeArr = {
								type : "dynamicDesc",
								param : {
									"operationMode" : $scope.operationMode,
									"busList" : $scope.busArray
								},// 默认查询条件
								text : "businessTypeCode", // 下拉框显示内容，根据需要修改字段名称
								desc : "businessDesc", // 下拉框显示内容，根据需要修改字段名称
								value : "businessTypeCode", // 下拉框对应文本的值，根据需要修改字段名称
								resource : "productLineBusType.query",// 数据源调用的action
								callback : function(data) {
									if (data) {
									} else {
										var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
										jfLayer.fail(returnMsg);
									}
								}
							};
						}
					}
				};
			} else if (data.value == "M") {
				$scope.params.flag = "3";
				$scope.labelScopeArr = {
					type : "dynamic",
					param : $scope.params,// 默认查询条件
					text : "externalIdentificationNo", // 下拉框显示内容，根据需要修改字段名称
					value : "mediaUnitCode", // 下拉框对应文本的值，根据需要修改字段名称
					resource : "cstMediaList.queryMediaMaj",// 数据源调用的action
					callback : function(data) {
						if (data) {
						} else {
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
							jfLayer.fail(returnMsg);
						}
					}
				};
			}
		});
	});
});
