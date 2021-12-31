'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户媒介视图优化
	webApp.controller('priceViewCtr', function($scope, $stateParams, $timeout, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_priceView');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockHistory');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName"); //菜单名
		$scope.priceFormInf = {};
		//动态请求下拉框 证件类型
		$scope.certificateTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_certificateType",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {}
		};
		//定价类型
		$scope.pricingTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_pricingType",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {}
		};
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)', function(data) {
			$scope.priceFormInf.idNumber = '';
			if (data.value == "1") { //身份证
				$("#priceView_idNumber").attr("validator", "id_idcard");
			} else if (data.value == "2") { //港澳居民来往内地通行证
				$("#priceView_idNumber").attr("validator", "id_isHKCard");
			} else if (data.value == "3") { //台湾居民来往内地通行证
				$("#priceView_idNumber").attr("validator", "id_isTWCard");
			} else if (data.value == "4") { //中国护照
				$("#priceView_idNumber").attr("validator", "id_passport");
			} else if (data.value == "5") { //外国护照passport
				$("#priceView_idNumber").attr("validator", "id_passport");
			} else if (data.value == "6") { //外国人永久居留证
				$("#priceView_idNumber").attr("validator", "id_isPermanentReside");
			} else if (data.value == "0" || data.value == null || data.value == undefined || data.value == "") { //其他
				$("#priceView_idNumber").attr("validator", "noValidator");
				$scope.priceForm.$setPristine();
				$("#priceView_idNumber").removeClass("waringform ");
            }
        });
		// 重置事件
		$scope.reset = function() {
			$scope.priceFormInf.idNumber = '';
			$scope.priceFormInf.externalIdentificationNo = '';
			$scope.priceFormInf.idType = '';
			$scope.isShow = false;
			$scope.priceShow = false;
			$scope.costShow = false;
			$scope.pcdShow = false;
			$("#priceView_idNumber").attr("validator", "noValidator");
			$("#priceView_idNumber").removeClass("waringform ");
		};
		//重置方法
		$scope.resetPrice = function() {
			$scope.itemList.params.pricingObjectCode = '';
			$scope.itemList.params.pricingObject = '';
		};
		//查询事件
		$scope.querypriceInf = function() {
			if (($scope.priceFormInf.idType == null || $scope.priceFormInf.idType == '' || $scope.priceFormInf.idType ==
					undefined) &&
				($scope.priceFormInf.idNumber == "" || $scope.priceFormInf.idNumber == undefined) &&
				($scope.priceFormInf.externalIdentificationNo == "" || $scope.priceFormInf.externalIdentificationNo ==
					undefined)
			) {
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076')); //"请输入任意条件进行查询"
			} else {
				if ($scope.priceFormInf.idType) {
					if ($scope.priceFormInf.idNumber == null || $scope.priceFormInf.idNumber == undefined || $scope.priceFormInf.idNumber ==
						'') {
						jfLayer.alert(T.T('F00110')); //'请核对证件号码'
						$scope.isShow = false;
					} else if ($scope.priceFormInf.externalIdentificationNo) {
						jfLayer.alert(T.T('F00076'));
						$scope.isShow = false;
					} else {
						$scope.searchHandlee($scope.priceFormInf);
					}
				} else if ($scope.priceFormInf.idNumber) {
					if ($scope.priceFormInf.idType == null || $scope.priceFormInf.idType == undefined || $scope.priceFormInf.idType ==
						'') {
						jfLayer.alert(T.T('F00109')); //"请核对证件类型！"
						$scope.isShow = false;
					} else if ($scope.priceFormInf.externalIdentificationNo) {
						jfLayer.alert(T.T('F00076'));
						$scope.isShow = false;
					} else {
						$scope.searchHandlee($scope.priceFormInf);
					}
				} else if ($scope.priceFormInf.externalIdentificationNo) {
					$scope.searchHandlee($scope.priceFormInf);
				}
			}
		};
		$scope.listSearch = function() {
			$scope.itemList.params.idNumber = $scope.priceFormInf.idNumber;
			$scope.itemList.params.externalIdentificationNo = $scope.priceFormInf.externalIdentificationNo;
			$scope.itemList.params.idType = $scope.priceFormInf.idType;
			$scope.itemList.search();
		};
		//查询
		$scope.itemList = {
			params: {
				pageSize: 10,
				indexNo: 0,
				flag: 1
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'feeProExample.queryPrice', // 列表的资源
			autoQuery: false,
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					$scope.isShow = true;
				} else {
					$scope.isShow = false;
				}
			}
		};
		$scope.costShow = false;
		$scope.pcdShow = false;
		$scope.instantiationInfo = function(event) {
			$scope.params = {};
			$scope.params = $.parseJSON(JSON.stringify(event));
			if ($scope.priceShow) {
				$scope.count = "4";
			} else {
				$scope.count = "3";
			}
			if ("PCD" == $scope.params.pricingObject) {
				$scope.costShow = false;
				$scope.pcdShow = true;
				$scope.artifactTable.params = $scope.params;
				$scope.artifactTable.search();
			} else {
				$scope.costShow = true;
				$scope.pcdShow = false;
				$scope.payProExaList.params = $scope.params;
				$scope.payProExaList.search();
			}
		};
		//构件实例列表
		$scope.artifactTable = {
			params: {
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			autoQuery: false,
			resource: 'feeProExample.queryPrice', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		//查询
		$scope.queryArtifactInstan = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/example/querySpecial.html', $scope.items, {
				title: T.T('YYJ400040'),
				buttons: [T.T('F00012')],
				size: ['1050px', '400px'],
				callbacks: []
			});
		};
		//收费项目实例查询
		$scope.payProExaList = {
			params: {}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			autoQuery: false,
			resource: 'feeProExample.queryPrice', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checkPayProExa = function(event) {
			$scope.payProExampleInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewPayProExa.html', $scope.payProExampleInf, {
				title: T.T('YYJ1200016'),
				buttons: [T.T('F00012')],
				size: ['1050px', '520px'],
				callbacks: []
			});
		};
		// 客户定价标签查询
		$scope.cstPrcgLblEnqrTable = {
			params: {
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息ISS.IQ.01.0008   X5205
			autoQuery: false,
			paging: true, // 默认true,是否分页
			resource: 'cstPricingView.query', // 列表的资源
			isTrans: true,
			transParams: ['dic_pricingLevel', 'dic_specialEventState'],
			transDict: ['pricingLevel_pricingLevelDesc', 'state_stateDesc'],
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					$scope.isShow = true;
				} else {
					$scope.isShow = false;
				}
			}
		};
		$scope.count = "3";
		$scope.priceShow = false;
		$scope.cusPriceTag = function(item) {
			item.idNumber = $scope.priceFormInf.idNumber,
				item.externalIdentificationNo = $scope.priceFormInf.externalIdentificationNo,
				item.idType = $scope.priceFormInf.idType,
				$scope.cstPrcgLblEnqrTable.params = item;
			$scope.cstPrcgLblEnqrTable.search();
			$scope.priceShow = true;
			if ($scope.costShow || $scope.pcdShow) {
				$scope.count = "4";
			}
		};
		//查看详细信息
		$scope.viewCstPrcgLblEnqr = function(event) {
			$scope.blockCDScnMgtInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstPrcgLblEnqr/viewCstPrcgLblEnqr.html', $scope.blockCDScnMgtInfo, {
				title: T.T('KHJ5400010'), // '客户定价标签信息'
				buttons: [T.T('F00012')], //'关闭'
				size: ['1050px', '550px'],
				callbacks: [$scope.selectCorporat2]
			});
		};
		$scope.selectCorporat2 = function(result) {
			$scope.safeApply();
			result.cancel();
		};
		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstProduct', 'viewQueryCstBaseInf', params) //Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						$scope.isShow = true;
						$scope.custInf = data.returnData.rows[0];
						$scope.itemList.params.operationMode = $scope.custInf.operationMode;
						//查询客户实例代码
						params.queryFlag = "1";
						jfRest.request('cstPricingView', 'query', params)
							.then(function(data) {
								$scope.itemList.params.pricingLevelCodeList = data.returnData.rows;
								//客户产品信息
								$timeout(function() {
									$scope.itemList.params.idNumber = params.idNumber;
									$scope.itemList.params.externalIdentificationNo = params.externalIdentificationNo;
									$scope.itemList.params.idType = params.idType;
									$scope.itemList.search();
								}, 300);
							});
					} else {
						$scope.isShow = false;
					}
				});
		};
	});
	webApp.controller('viewcstPrcgLblEnqrCtrl', function($scope, $stateParams,
		jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader
	) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
		//'D-差异化''P-个性化''A-活动'
		//		$scope.priceAreaArray = [{name : T.T('KHJ5400001') ,id : 'D'},{name : T.T('KHJ5400002') ,id : 'P'},{name : T.T('KHJ5400003') ,id : 'A'}] ;
		//'I-继承' 'O-覆盖' 'C-取优'
		//		$scope.priceModelArray = [{name : T.T('KHJ5400006'),id : 'I'},{name : T.T('KHJ5400007'),id : 'O'},{name : T.T('KHJ5400008'),id : 'C'}] ;
		//'D-数值''P-百分比'
		//		$scope.valTypArray = [{name : T.T('KHJ5400008') ,id : 'D'},{name : T.T('KHJ5400009') ,id : 'P'}] ;
		//取值类型
		$scope.valTypArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {}
		};
		//定价区域
		$scope.priceAreaArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_priceArea",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {}
		};
		//定价方式
		$scope.priceModelArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_priceModel",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {}
		};
		//币种
		$scope.operationMode = lodinDataService.getObject('operationMode');
		$scope.currencyArr = { 
		    type:"dynamic", 
		    param:{
		    	operationMode : $scope.operationMode
		    } ,//默认查询条件 
		    text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		    resource:"operatCurrency.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.pricingScope = $scope.blockCDScnMgtInfo.pricingScope;
		    }
		}; 
		$scope.blockCDScnMgtInfo = $scope.blockCDScnMgtInfo;
		$scope.viewCorporat = function() {
			$scope.paramss = {
				pricingTag: $scope.blockCDScnMgtInfo.pricingTag,
				operationMode: $scope.blockCDScnMgtInfo.operationMode,
				pricingObject: $scope.blockCDScnMgtInfo.pricingObject,
				pricingObjectCode: $scope.blockCDScnMgtInfo.pricingObjectCode
			};
			jfRest.request('cstPrcgLblEnqr', 'queryPrcDetail', $scope.paramss)
				.then(function(data) {
					if (data.returnCode == "000000" && data.returnData != null)
						$scope.checkLblObjList = data.returnData.rows[0];
				});
		};
		$scope.viewCorporat();
	});
	webApp.controller('queryspecialCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.segmentTypeInfoS = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
		//pcd差异列表
		$scope.pcdInfTable = [];
		//删除pcd差异列表某行
		$scope.deletePcdDif = function(data) {
			var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
		};
		$scope.pcdExampleInf = {};
		$scope.pcdExampleInf.pcdNo = $scope.items.elementNo.substring(0, 8);
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.items.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if (data.returnData.rows != null) {
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.pcdExampleInf.segmentType = data.returnData.rows[0].segmentType;
					$scope.queryPcdInstan();
				} else {
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
		//查询pcd实例信息
		$scope.queryPcdInstan = function() {
			$scope.queryPcdExample = {};
			$scope.queryPcdExample.operationMode = $scope.items.operationMode;
			$scope.queryPcdExample.pcdNo = $scope.items.elementNo.substring(0, 8);
			$scope.queryPcdExample.instanCode1 = $scope.items.instanCode1;
			$scope.queryPcdExample.instanCode2 = $scope.items.instanCode2;
			$scope.queryPcdExample.instanCode3 = $scope.items.instanCode3;
			$scope.queryPcdExample.instanCode4 = $scope.items.instanCode4;
			$scope.queryPcdExample.instanCode5 = $scope.items.instanCode5;
			//此处键值基础实例可选实例。无处获取。
			jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows != null) {
						$scope.pcdInfTable = data.returnData.rows;
					}
				}
			});
		}
	});
	//查看
	webApp.controller('viewPayProExaCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.methodShow = false;
		$scope.matrixAppModeArry = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_matrixAppMode",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.matrixAppModeInfo = $scope.payProExampleInf.matrixAppMode;
			}
		};
		$scope.matchRelationArr01 = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_matchRelation",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.matchRelation1Info = $scope.payProExampleInf.matchRelation1;
			}
		};
		$scope.matchRelationArr02 = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_matchRelation",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.matchRelation2Info = $scope.payProExampleInf.matchRelation2;
			}
		};
		$scope.matchRelationArr03 = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_matchRelation",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.matchRelation3Info = $scope.payProExampleInf.matchRelation3;
			}
		};
		$scope.matchRelationArr04 = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_matchRelation",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.matchRelation4Info = $scope.payProExampleInf.matchRelation4;
			}
		};
		$scope.matchRelationArr05 = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_matchRelation",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.matchRelation5Info = $scope.payProExampleInf.matchRelation5;
			}
		};
		$scope.assessmentMethodArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_billingMethod",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.assessmentMethodInfo = $scope.payProExampleInf.assessmentMethod;
			}
		};
		$scope.waiveCycleArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_waiveCycle",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.waiveCycleInfo = $scope.payProExampleInf.waiveCycle;
			}
		};
		$scope.feeFlagArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_feeFlag",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.feeFlagInfo = $scope.payProExampleInf.feeFlag;
			}
		};
		//费用收取方式
		$scope.feeCollectTypeArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_ecommFeeCollectType",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.feeCollectTypeInfo = $scope.payProExampleInf.feeCollectType;
			}
		};
		//应用维度
		$scope.feeMatrixApplicationDimensionArry = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_feeMatrixApplicationDimension",
				queryFlag: "children"
			}, //默认查询条件
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action
			callback: function(data) {
				$scope.feeMatrixApplicationDimensionInfo = $scope.payProExampleInf.feeMatrixApplicationDimension;
			}
		};
		//运营模式
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件
			text: "modeName", //下拉框显示内容，根payProExample据需要修改字段名称
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称
			resource: "operationMode.query", //数据源调用的action
			callback: function(data) {
				$scope.viewPayProExaOperationMode = $scope.payProExampleInf.operationMode;
			}
		};
		//查询收费项目
		$scope.feeItemArr = {
			type: "dynamic",
			param: {
				feeItemNo: $scope.payProExampleInf.feeItemNo
			}, //默认查询条件
			text: "feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称
			value: "feeType", //下拉框对应文本的值，根据需要修改字段名称
			resource: "feeProject.query", //数据源调用的action
			callback: function(data) {
				if (data != null && data.length != 0) {
					$scope.payProExampleInf.feeType = data[0].feeType;
					$scope.payProExampleInf.assessmentMethod = data[0].assessmentMethod;
					$scope.showFee();
				}
			}
		};
		$scope.showFee = function() {
			if ($scope.payProExampleInf.assessmentMethod == "M" || $scope.payProExampleInf.feeType == "ANNF") {
				$scope.methodShow = true;
			} else {
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
	});
});
