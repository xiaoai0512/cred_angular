'use strict';
define(function(require) {
	var webApp = require('app');
	// 媒介对象查询
	webApp.controller('mediaObjectQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false;
		// 根据菜单和当前登录者查询有权限的事件编号
		$scope.menuNoSel = $scope.menuNo;
		$scope.paramsNo = {
			menuNo : $scope.menuNoSel
		};
		jfRest.request('accessManage', 'selEvent',$scope.paramsNo).then(function(data) {
			if (data.returnData != null || data.returnData != "") {
				for (var i = 0; i < data.returnData.length; i++) {
					$scope.eventList += data.returnData[i].eventNo + ",";
				}
				if ($scope.eventList.search('COS.IQ.02.0017') != -1) { // 查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.AD.02.0017') != -1) { // 新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0017') != -1) { // 修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
			}
		});
		$scope.userName = "";
		$scope.userName = sessionStorage.getItem("userName");// 用户名
		$scope.operationModeArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "operationMode.queryMode",// 数据源调用的action
			callback : function(data) {
			}
		};
		// 媒介对象列表
		$scope.mediaObjectList = {
			params : {
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checkMediaObjectInf = function(event) {
			$scope.mediaObjectInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/viewMediaObject.html',$scope.mediaObjectInf, {
				title : T.T('YYJ500013'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '520px' ],
				callbacks : []
			});
		};
		// 新增
		$scope.mediaObjectAdd = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/mediaObjectEst.html','', {
				title : T.T('YYJ500016'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.saveMediaObject ]
			});
		};
		$scope.saveMediaObject = function(result) {
			if (!$rootScope.nextBtn) {
				jfLayer.fail(T.T('F00086'));
				return;
			}
			$scope.proObjInstan = {};
			$scope.proObjInstan = result.scope.mediaObjInf;
			for (var i = 0; i < result.scope.queryMODM.data.length; i++) {
				if (result.scope.queryMODM.data[i].pcdList == null && result.scope.queryMODM.data[i].pcdInitList != null) {
					result.scope.queryMODM.data[i].addPcdFlag = "1";
					result.scope.queryMODM.data[i].pcdList = result.scope.queryMODM.data[i].pcdInitList;
				}
			}
			$scope.proObjInstan.instanlist = result.scope.queryMODM.data;
			$scope.proObjInstan.instanCode = result.scope.mediaObjInf.mediaObjectCode;
			jfRest.request('mediaObject', 'save',$scope.proObjInstan).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstan = {};
					$scope.mediaObjectList.search();
					$rootScope.treeSelectA = [];
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 修改
		$scope.updateMediaObjectInf = function(event) {
			$scope.mediaObjectInf = $.parseJSON(JSON.stringify(event));
			$scope.mediaObjectInf.deletePcdInstanIdList = [];
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/updateMediaObject.html',$scope.mediaObjectInf,{
				title : T.T('YYJ500015'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1050px', '520px' ],
				callbacks : [ $scope.updateMediaObject ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateMediaObject = function(result) {
			var key;
			for (key in $scope.mediaObjectInf) {
				if ($scope.mediaObjectInf[key] == "null" || $scope.mediaObjectInf[key] == null) {
					$scope.mediaObjectInf[key] = '';
                }
            }
            $scope.mediaObjectInf.artifactInstanList = result.scope.queryUpdateMODM.data;
			$scope.mediaObjectInf.mediaObjectForm = result.scope.updateMediaObjectForm;
			jfRest.request('mediaObject', 'update',$scope.mediaObjectInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.mediaObjectList.search();
				} 
			});
		};
	});
	// 查看
	webApp.controller('viewMediaObjectCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translate.refresh();
		$scope.mediaType = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mediaType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.viewMediaObjectType = $scope.mediaObjectInf.mediaObjectType;
			}
		};
		$scope.mediaForm = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mediaForm",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.ViewMediaObjectForm = $scope.mediaObjectInf.mediaObjectForm;
			}
		};
		// 查询产品实例构件
		$scope.queryViewMODM = {
			params : $scope.queryParam = {
				instanCode : $scope.mediaObjectInf.mediaObjectCode,
				operationMode : $scope.mediaObjectInf.operationMode,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					if (data.returnData.rows == undefined
							|| data.returnData.rows == null
							|| data.returnData.rows == '') {
						data.returnData.rows = [];
					}
				}
			}
		};
		// 产品实例化时，点击替换参数的方法
		$scope.updateSelectAView = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectElementNoView.html',$scope.itemsNo, {
				title : T.T('YYJ100030'),
				buttons : [ T.T('F00012') ],
				size : [ '1100px', '520px' ],
				callbacks : []
			});
		};
	});
	// 修改
	webApp.controller('updateMediaObjectCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, $timeout, jfLayer, $location,lodinDataService, $translate,$translatePartialLoader, T) {
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.mediaType = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mediaType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updateMediaObjectType = $scope.mediaObjectInf.mediaObjectType;
			}
		};
		$scope.mediaForm = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_mediaForm",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updateMediaObjectForm = $scope.mediaObjectInf.mediaObjectForm;
			}
		};
		// 查询产品实例构件
		$scope.queryUpdateMODM = {
			params : $scope.queryParam = {
				instanCode : $scope.mediaObjectInf.mediaObjectCode,
				operationMode : $scope.mediaObjectInf.operationMode
			}, // 表格查询时的参数信息
			// autoQuery: false,
			paging : false,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == "000000") {
					if (data.returnData.rows == undefined || data.returnData.rows == null || data.returnData.rows == '') {
						data.returnData.rows = [];
					}
				} 
			}
		};
		// 产品实例化时，点击设置参数值的方法
		$scope.setSelectAUpdate = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectPCDUpdateMedia.html',$scope.itemsPCD,
			{
				title : T.T('F00083')+ $scope.itemsPCD.pcdNo+ ':'+ $scope.itemsPCD.pcdDesc+ T.T('F00139'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.choseSelectTwoUpdate ]
			});
		};
		$scope.choseSelectTwoUpdate = function(result) {
			$scope.items = {};
			$scope.queryUpdateMODM.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryUpdateMODM.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.queryUpdateMODM.data[$scope.indexNo].addPcdFlag = "1";
			$scope.safeApply();
			result.cancel();
		};
		// 产品实例化时，点击替换参数的方法
		$scope.updateSelectAUpdate = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/product/selectElementNoUpdateMedia.html',$scope.itemsNo,
				{
					title : T.T('F00138'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1100px', '320px' ],
					callbacks : [ $scope.choseSelectAUpdate ]
				});
		};
		$scope.choseSelectAUpdate = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.queryUpdateMODM.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryUpdateMODM.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		}
	});
	// 媒介对象建立
	webApp.controller('mediaObjectEstCtrl',function($scope, $stateParams, jfRest, $http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate,$translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.mediaObjInf = {};
		$scope.mediaType = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_mediaType",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
				}
			};
		$scope.mediaForm = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_mediaForm",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
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
			}
		};
		$scope.step1Btn = true;
		$rootScope.nextBtn = false;
		$scope.nextStep1 = function() {
			$scope.mediaObjInf.mediaObjectCode = 'MODM'+ $scope.mediaObjInf.mediaObjectCodeHalf;
			$scope.proObjInstan = $scope.mediaObjInf;
			$scope.mediaObjInfoForm.$setPristine();
			$scope.nextInstan();
			$scope.step1Btn = false;
			var adom1I = document.getElementsByClassName('step1I');
			for (var i = 0; i < adom1I.length; i++) {
				adom1I[i].setAttribute('readonly', true);
				adom1I[i].classList.add('bnone');
			}
			var adom1S = document.getElementsByClassName('step1S');
			for (var i = 0; i < adom1S.length; i++) {
				adom1S[i].setAttribute('disabled', 'disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$rootScope.nextBtn = true;
		};
		// 返回上一步
		$scope.stepBackOne = function() {
			$scope.step1Btn = true;
			$scope.instanCodeShow = false;
			var adom1I = document
					.getElementsByClassName('step1I');
			for (var i = 0; i < adom1I.length; i++) {
				adom1I[i].removeAttribute('readonly');
				adom1I[i].classList.remove('bnone');
			}
			var adom1S = document
					.getElementsByClassName('step1S');
			for (var i = 0; i < adom1S.length; i++) {
				adom1S[i].removeAttribute('disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$rootScope.nextBtn = false;
		};
		// 构件实例--------------start
		$scope.newCodeShow = true;
		$scope.instanCodeShow = false;
		// 进入产品信息
		$scope.nextInstan = function() {
			$scope.instanCodeShow = true;// 显示实例化
			$scope.newCodeShow = true;
			$scope.queryMODM.params.instanCode = $scope.proObjInstan.mediaObjectCode;
			$scope.queryMODM.search();
		};
		// 查询媒介对象实例构件
		$scope.queryMODM = {
			params : $scope.queryParam = {
				instanDimen1 : "MODM"
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			autoQuery : true,
			resource : 'artifactExample.querySelectArtifact',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 产品实例化时，点击替换参数的方法
		$scope.updateSelectA = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.items = {};
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/product/selectElement.html',$scope.items, {
				title : T.T('YYJ500006'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.choseSelectA ]
			});
		};
		// 产品实例化时，点击设置参数值的方法
		$scope.setSelectA = function(item, $index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			// 弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html',$scope.itemsPCD,{
				title : T.T('F00083')+ $scope.itemsPCD.pcdNo + ' ' + $scope.itemsPCD.pcdDesc + T.T('F00139'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.choseSelectTwo ]});
		};
		$scope.choseSelectA = function(result) {
			if (!result.scope.elementTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementTable.checkedList();
			$scope.queryMODM.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODM.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODM.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODM.data[$scope.indexNo].addPcdFlag = "1";
			}
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseSelectTwo = function(result) {
			$scope.items = {};
			$scope.queryMODM.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODM.data[$scope.indexNo].addPcdFlag = "1";
			$scope.safeApply();
			result.cancel();
		}
		// 构件实例--------------end
	});
	webApp.controller('selectElementCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		// 元件
		$scope.elementTable = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.items.artifactNo,
				pcdNo : $scope.items.elementNo.substring(0, 8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnData.rows != ""
						&& data.returnData.rows != undefined
						&& data.returnData.rows != null) {
					for (var i = 0; i < data.returnData.rows.length; i++) {
						if (data.returnData.rows[i].elementNo == $scope.items.elementNo) {
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	// ******************************余额对象设置参数值pcd修改***************
	webApp.controller('selectPCDCtrl',function($scope, $stateParams,$timeout, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.pcdExampleInf = {};
		$scope.pcdDifExampleInf = {};
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
		$scope.businessValueArr01= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.baseInstanDimenAddD = $scope.pcdExampleInf.baseInstanDimen;
			}
		};
		$scope.businessValueArr02= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.optionInstanDimenAddD = $scope.pcdExampleInf.optionInstanDimen;
			}
		};
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
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
				$scope.segmentTypeAddD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.pcdTypeAdd = $scope.pcdExampleInf.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeAdd)',function(event){
			 $scope.pcdTypeAdd = event.value;
		 });
		// 新增pcd差异化不显示
		$scope.showNewPcdInfo = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtn = function() {
			$scope.showNewPcdInfo = !$scope.showNewPcdInfo;
			if ($scope.showNewPcdInfo) {
				$scope.pcdDifExampleInf.pcdDiffSerialNo = count++;
			}
		};
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0, 8);
		if ($scope.itemsPCD.segmentType != null) {// 分段类型不为空
			$scope.pcdExampleInf.segmentType = $scope.itemsPCD.segmentType;
			$scope.addButtonShow = true;
		} else {
			$scope.addButtonShow = false;
		}
		if ($scope.itemsPCD.pcdInitList != null) {
			$scope.pcdInfTable = $scope.itemsPCD.pcdInitList;
		} else {
			$scope.showNewPcdInfo = true;
		}
		if ($scope.itemsPCD.pcdList != null) {
			$scope.pcdInfTable = $scope.itemsPCD.pcdList;
		}
		// 删除pcd实例列表某行
		$scope.deletePcdDif = function(data) {
			if ($scope.pcdInfTable.length == 1) {
				jfLayer.fail(T.T('YYJ400048'));
				return;
			}
			var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
		};
		// 修改pcd实例列表某行
		$scope.updateInstan = function(event, $index) {
			$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfo = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInf = $scope.updateInstanTemp;
		};
		// 保存pcd实例============余额对象实例化设置参数值
		$scope.saveNewAdrInfo = function() {
			if (null == $scope.pcdExampleInf.pcdPoint|| null == $scope.pcdTypeAdd || null == $scope.pcdExampleInf.pcdValue) {
				jfLayer.fail(T.T('YYJ400049'));
				return;
			}
			var pcdInfTableInfoU = {};
			pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
			pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
			pcdInfTableInfoU.pcdType = $scope.pcdTypeAdd;
			pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
			pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
			pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
			pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
			pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
			if ($scope.indexNoTemp != undefined && $scope.indexNoTemp != null) {
				$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
				$scope.pcdInfTable[$scope.indexNoTemp].pcdType = $scope.pcdTypeAdd;
				$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = $scope.pcdExampleInf.segmentValue;
				$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = $scope.pcdExampleInf.pcdValue;
				$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInf.pcdPoint;
				$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				$scope.indexNo = null;
			} else {
				$scope.pcdInfTable.push(pcdInfTableInfoU);
			}
			$scope.pcdDifExampleInf = {};
			$scope.pcdDifExampleInf.pcdNo = pcdInfTableInfoU.pcdNo;
			$scope.showNewPcdInfo = false;
		};
		//
		var dataValueCount;
		// dataType维度取值，dataValue第几个实例代码
		$scope.chosedInstanCode = function(dataType) {
			if (dataType == "MODT") {// 业务类型
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseBusinessType.html',$scope.params,{
					title : T.T('YYJ400021'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseBusType ]
				});
			} else if (dataType == "MODM") {// 媒介对象
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseMediaObject.html',$scope.params,{
					title : T.T('YYJ400022'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseMedia ]
				});
			} else if (dataType == "MODB") {// 余额对象
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseBalanceObject.html',$scope.params,{
					title : T.T('YYJ400023'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseBalanceObject ]
				});
			} else if (dataType == "MODP") {// 产品对象
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseProductObject.html',$scope.params,{
					title : T.T('YYJ400024'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseProductObject ]
				});
			} else if (dataType == "MODG") {// 业务项目
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseProductLine.html',$scope.params,{
					title : T.T('YYJ400025'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseProductLine ]
				});
			} else if (dataType == "ACST") {// 核算状态
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseAcst.html',$scope.params, {
					title : T.T('YYJ400026'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseAcst ]
				});
			} else if (dataType == "EVEN") {// 事件
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseEvent.html',$scope.params,{
					title : T.T('YYJ400027'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseEvent ]
				});
			} else if (dataType == "BLCK") {// 封锁码
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseBlockCode.html',$scope.params,{
					title : T.T('YYJ400028'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseBlockCode ]
				});
			} else if (dataType == "AUTX") {// 授权场景
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseScenarioList.html',$scope.params,{
					title : T.T('YYJ400029'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseScenarioList ]
				});
			} else if (dataType == "LMND") {// 额度节点
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseQuotaTree.html',$scope.params,{
					title : T.T('YYJ400030'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseQuotaTree ]
				});
			} else if (dataType == "CURR") {// 币种
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseCurrency.html',$scope.params,{
					title : T.T('YYJ400027'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseCurrency ]
				});
			} else if (dataType == "DELQ") {// 延滞层级
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseDelv.html',$scope.params, {
					title : T.T('YYJ400031'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseDelv ]
				});
			}
		};
		$scope.choseCurrency = function(result) {
			if (!result.scope.currencyTable.validCheck()) {
				return;
			}
			$scope.checkedCurrency = result.scope.currencyTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBlockCode = function(result) {
			if (!result.scope.blockCDScnMgtTable.validCheck()) {
				return;
			}
			$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType + $scope.checkedBlockCode.blockCodeScene);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseEvent = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBusType = function(result) {
			if (!result.scope.businessTypeList.validCheck()) {
				return;
			}
			$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseAcst = function(result) {
			// if (!result.scope.itemList.validCheck()) {
			if (!result.scope.accountStateTable.validCheck()) {
				return;
			}
			$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
			// $scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseProductLine = function(result) {
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedProLine = result.scope.proLineList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseMedia = function(result) {
			if (!result.scope.mediaObjectList.validCheck()) {
				return;
			}
			$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBalanceObject = function(result) {
			if (!result.scope.balanceObjectList.validCheck()) {
				return;
			}
			$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseProductObject = function(result) {
			if (!result.scope.proObjectList.validCheck()) {
				return;
			}
			$scope.checkedProObject = result.scope.proObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseScenarioList = function(result) {
			if (!result.scope.scenarioList.validCheck()) {
				return;
			}
			$scope.checkedScenario = result.scope.scenarioList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseQuotaTree = function(result) {
			if (!result.scope.quotaTreeList.validCheck()) {
				return;
			}
			$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseDelv = function(result) {
			if (!result.scope.delvTable.validCheck()) {
				return;
			}
			$scope.checkedDelv = result.scope.delvTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
			$scope.safeApply();
			result.cancel();
		};
		$scope.InstanCodeValue = function(dataValue, code) {
			if (dataValue == '1') {
				$scope.artifactExampleInf.instanCode1 = code;
			} else if (dataValue == '2') {
				$scope.artifactExampleInf.instanCode2 = code;
			} else if (dataValue == '3') {
				$scope.artifactExampleInf.instanCode3 = code;
			} else if (dataValue == '4') {
				$scope.artifactExampleInf.instanCode4 = code;
			} else if (dataValue == '5') {
				$scope.artifactExampleInf.instanCode5 = code;
			} else if (dataValue == 'base') {
				$scope.pcdExampleInf.baseInstanCode = code;
			} else if (dataValue == 'option') {
				$scope.pcdExampleInf.optionInstanCode = code;
			}
		};
		$scope.choseBaseInstanCodeBtn = function() {
			// 获取基础维度的值
			dataValueCount = 'base';
			$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
		};
		$scope.choseOptionInstanCodeBtn = function() {
			// 获取可选维度的值
			dataValueCount = 'option';
			$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
		};
	});
	// ******************************余额对象设置参数值pcd修改222***************
	webApp.controller('selectPCDMediaCtrl',function($scope, $stateParams,$timeout, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdExampleInf = {};
		$scope.pcdDifExampleInf = {};
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.pcdTypeUpdate = $scope.pcdExampleInfUpdate.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdate)',function(event){
			 $scope.pcdTypeUpdate = event.value;
		 });
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
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
				$scope.segmentTypeUpdateD = $scope.pcdExampleInf.segmentType;
			}
		};
		// 新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.pcdExampleInfUpdate = {};
			$scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
			if ($scope.showNewPcdInfoUpdate) {
				$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
			}
		};
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0, 8);
		if ($scope.itemsPCD.segmentType != null) {// 分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType = $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		} else {
			$scope.addButtonShowUpdate = false;
		}
		if ($scope.itemsPCD.pcdInstanList != null) {
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
		} else {
			$scope.showNewPcdInfoUpdate = true;
		}
		$scope.mediaObjectInf.deletePcdInstanIdList = [];
		// 删除pcd实例列表某行
		$scope.deletePcdDifUpdate = function(item, data) {
			if ($scope.pcdInfTable.length == 1) {
				jfLayer.fail(T.T('YYJ400048'));
				return;
			}
			var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
			if (item.id != null && item.id != undefined&& item.id != '' && item.id) {
				$scope.mediaObjectInf.deletePcdInstanIdList.push(item.id);
			}
        };
		// 修改pcd实例列表某行
		$scope.updateInstanUpdate = function(event, $index) {
			$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON
					.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
		};
		// 保存pcd实例============余额对象实例化设置参数值
		$scope.saveNewAdrInfoUpdate = function() {
			if (null == $scope.pcdExampleInfUpdate.pcdPoint|| null == $scope.pcdTypeUpdate || null == $scope.pcdExampleInfUpdate.pcdValue) {
				jfLayer.fail(T.T('YYJ400049'));
				return;
			}
			var pcdInfTableInfoU = {};
			pcdInfTableInfoU.instanCode1 = $scope.itemsPCD.instanCode1;
			pcdInfTableInfoU.instanCode2 = $scope.itemsPCD.instanCode2;
			pcdInfTableInfoU.instanCode3 = $scope.itemsPCD.instanCode3;
			pcdInfTableInfoU.instanCode4 = $scope.itemsPCD.instanCode4;
			pcdInfTableInfoU.instanCode5 = $scope.itemsPCD.instanCode5;
			pcdInfTableInfoU.operationMode = $scope.itemsPCD.operationMode;
			pcdInfTableInfoU.pcdNo = $scope.itemsPCD.pcdNo;
			pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
			pcdInfTableInfoU.pcdType = $scope.pcdTypeUpdate;
			pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
			pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
			pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
			pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
			pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
			if ($scope.indexNoTemp != undefined&& $scope.indexNoTemp != null) {
				$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = $scope.pcdExampleInfUpdate.segmentSerialNum;
				$scope.pcdInfTable[$scope.indexNoTemp].pcdType = $scope.pcdTypeUpdate;
				$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = $scope.pcdExampleInfUpdate.segmentValue;
				$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = $scope.pcdExampleInfUpdate.pcdValue;
				$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
				$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				$scope.indexNo = null;
			} else {
				$scope.pcdInfTable.push(pcdInfTableInfoU);
				$scope.pcdExampleInfUpdate = {};
			}
			$scope.pcdDifExampleInf.pcdNo = pcdInfTableInfoU.pcdNo;
			$scope.showNewPcdInfoUpdate = false;
		};
		var dataValueCount;
		// dataType维度取值，dataValue第几个实例代码
		$scope.chosedInstanCode = function(dataType) {
			if (dataType == "MODT") {// 业务类型
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseBusinessType.html',$scope.params,{
					title : T.T('YYJ400021'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseBusType ]
				});
			} else if (dataType == "MODM") {// 媒介对象
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseMediaObject.html',$scope.params,{
					title : T.T('YYJ400022'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseMedia ]
				});
			} else if (dataType == "MODB") {// 余额对象
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseBalanceObject.html',$scope.params,{
					title : T.T('YYJ400023'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseBalanceObject ]
				});
			} else if (dataType == "MODP") {// 产品对象
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseProductObject.html',$scope.params,{
					title : T.T('YYJ400024'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseProductObject ]
				});
			} else if (dataType == "MODG") {// 业务项目
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseProductLine.html',$scope.params,{
					title : T.T('YYJ400025'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseProductLine ]
				});
			} else if (dataType == "ACST") {// 核算状态
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseAcst.html',$scope.params, {
					title : T.T('YYJ400026'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseAcst ]
				});
			} else if (dataType == "EVEN") {// 事件
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseEvent.html',$scope.params,{
					title : T.T('YYJ400027'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseEvent ]
				});
			} else if (dataType == "BLCK") {// 封锁码
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseBlockCode.html',$scope.params,{
					title : T.T('YYJ400028'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseBlockCode ]
				});
			} else if (dataType == "AUTX") {// 授权场景
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseScenarioList.html',$scope.params,{
					title : T.T('YYJ400029'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseScenarioList ]
				});
			} else if (dataType == "LMND") {// 额度节点
				// 弹框查询列表
				$scope.params = {
					"operationMode" : $rootScope.operationMods,
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseQuotaTree.html',$scope.params,{
					title : T.T('YYJ400030'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseQuotaTree ]
				});
			} else if (dataType == "CURR") {// 币种
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseCurrency.html',$scope.params,{
					title : T.T('YYJ400027'),
					buttons : [ T.T('F00107'),T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseCurrency ]
				});
			} else if (dataType == "DELQ") {// 延滞层级
				// 弹框查询列表
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseDelv.html',$scope.params, {
					title : T.T('YYJ400031'),
					buttons : [ T.T('F00107'),
							T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [ $scope.choseDelv ]
				});
			}
		};
		$scope.choseCurrency = function(result) {
			if (!result.scope.currencyTable.validCheck()) {
				return;
			}
			$scope.checkedCurrency = result.scope.currencyTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBlockCode = function(result) {
			if (!result.scope.blockCDScnMgtTable.validCheck()) {
				return;
			}
			$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType + $scope.checkedBlockCode.blockCodeScene);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseEvent = function(result) {
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBusType = function(result) {
			if (!result.scope.businessTypeList.validCheck()) {
				return;
			}
			$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseAcst = function(result) {
			if (!result.scope.accountStateTable.validCheck()) {
				return;
			}
			$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseProductLine = function(result) {
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedProLine = result.scope.proLineList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseMedia = function(result) {
			if (!result.scope.mediaObjectList.validCheck()) {
				return;
			}
			$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseBalanceObject = function(result) {
			if (!result.scope.balanceObjectList.validCheck()) {
				return;
			}
			$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseProductObject = function(result) {
			if (!result.scope.proObjectList.validCheck()) {
				return;
			}
			$scope.checkedProObject = result.scope.proObjectList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseScenarioList = function(result) {
			if (!result.scope.scenarioList.validCheck()) {
				return;
			}
			$scope.checkedScenario = result.scope.scenarioList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseQuotaTree = function(result) {
			if (!result.scope.quotaTreeList.validCheck()) {
				return;
			}
			$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseDelv = function(result) {
			if (!result.scope.delvTable.validCheck()) {
				return;
			}
			$scope.checkedDelv = result.scope.delvTable.checkedList();
			$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
			$scope.safeApply();
			result.cancel();
		};
		$scope.InstanCodeValue = function(dataValue, code) {
			if (dataValue == '1') {
				$scope.artifactExampleInf.instanCode1 = code;
			} else if (dataValue == '2') {
				$scope.artifactExampleInf.instanCode2 = code;
			} else if (dataValue == '3') {
				$scope.artifactExampleInf.instanCode3 = code;
			} else if (dataValue == '4') {
				$scope.artifactExampleInf.instanCode4 = code;
			} else if (dataValue == '5') {
				$scope.artifactExampleInf.instanCode5 = code;
			} else if (dataValue == 'base') {
				$scope.pcdExampleInf.baseInstanCode = code;
			} else if (dataValue == 'option') {
				$scope.pcdExampleInf.optionInstanCode = code;
			}
		};
		$scope.choseBaseInstanCodeBtnUpdate = function() {
			// 获取基础维度的值
			dataValueCount = 'base';
			$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
		};
		$scope.choseOptionInstanCodeBtnUpdate = function() {
			// 获取可选维度的值
			dataValueCount = 'option';
			$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
		};
	});
	// ******************************替换参数1111***************
	webApp.controller('selectElementNoMediaCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.artifactInfo = {};
		$scope.artifactInfo = $scope.itemsNo;
		// 元件
		$scope.elementNoTableUpdate = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo
						.substring(0, 8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnData.rows != ""
						&& data.returnData.rows != undefined
						&& data.returnData.rows != null) {
					for (var i = 0; i < data.returnData.rows.length; i++) {
						if (data.returnData.rows[i].elementNo == $scope.itemsNo.elementNo) {
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	// ******************************替换参数***************
	webApp.controller('selectElementNoViewCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdInstanShow = false;
		$scope.pcdExampleInf = {};
		$scope.pcdDifExampleInf = {};
		$scope.artifactInfoShow = false;
		var count = 1;
		$scope.artifactInfo = $scope.itemsNo;
		$scope.businessValueArr01= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.baseInstanDimenViewD = $scope.pcdExampleInf.baseInstanDimen;
				}
			};
			$scope.businessValueArr02= {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_dimensionalValue",
					queryFlag: "children"
				}, //默认查询条件 
				text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "codes", //下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", //数据源调用的action 
				callback: function(data) {
					$scope.optionInstanDimenViewD = $scope.pcdExampleInf.optionInstanDimen;
				}
			};
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
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
				$scope.segmentTypeViewD = $scope.pcdExampleInf.segmentType;
			}
		};
		$scope.pcdInfTable = [];
		if (null != $scope.itemsNo.pcdNo) {
			$scope.pcdInstanShow = true;
			$scope.pcdExampleInf.pcdNo = $scope.itemsNo.pcdNo
					.substring(0, 8);
			if ($scope.itemsNo.segmentType != null) {// 分段类型不为空
				$scope.pcdExampleInf.segmentType = $scope.itemsNo.segmentType;
				$scope.addButtonShow = true;
			} else {
				$scope.addButtonShow = false;
			}
			if ($scope.itemsNo.pcdInstanList != null) {
				$scope.pcdInfTable = $scope.itemsNo.pcdInstanList;
			} else {
				$scope.showNewPcdInfo = true;
			}
		} else {
			$scope.pcdInstanShow = false;
		}
	});
});
