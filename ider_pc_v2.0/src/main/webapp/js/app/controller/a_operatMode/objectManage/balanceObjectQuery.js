'use strict';
define(function(require) {
	var webApp = require('app');
	// 余额对象查询
	webApp.controller('balanceObjectQueryCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
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
				if ($scope.eventList.search('COS.IQ.02.0021') != -1) { // 查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.AD.02.0021') != -1) { // 新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0021') != -1) { // 修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
			}
		});
		$scope.balanceObjInf = {};
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {}
			};
		$scope.operationModeArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "operationMode.queryMode",// 数据源调用的action
			callback : function(data) {}
		};
		// 余额对象列表
		$scope.balanceObjectList = {
			params : {
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'balanceObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_balanceType'],//查找数据字典所需参数
			transDict : ['objectType_objectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.checkBalanceObj = function(event) {
			$scope.balanceObjInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/viewBalanceObject.html',$scope.balanceObjInf, {
				title : T.T('YYJ600011'),
				buttons : [ T.T('F00012') ],
				size : [ '1200px', '560px' ],
				callbacks : []
			});
		};
		// 新增=====（单纯的余额对象，不包含实例化信息）
		$scope.balanceObjectAdd = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/balanceObjectEst.html','',{
				title : T.T('YYJ200032'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.saveBalanceObject ]
			});
		};
		$scope.balanceObjInfEst = {};
		// 新增
		$scope.saveBalanceObject = function(result) {
			$scope.balanceObjInfEst = result.scope.balanceObjInf;
			$scope.balanceObjInfEst.balanceObjectCode = 'MODB' + result.scope.balanceObjInf.balanceObjectCodeHalf;
			$scope.balanceObjInfEst.instanlist = [];
			$scope.balanceObjInfEst.beginDate = $("#LAY_start_Obj").val();
		    $scope.balanceObjInfEst.endDate = $("#LAY_end_Obj").val();
			jfRest.request('balanceObject', 'save',$scope.balanceObjInfEst).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					result.scope.balanceObjInf = {};
					result.scope.balanceObjForm.$setPristine();
					$scope.safeApply();
					result.cancel();
					$scope.balanceObjectList.search();
				} 
			});
		};
		// 修改
		$scope.updateBalanceObj = function(event) {
			$scope.upbalanceObjInf = $.parseJSON(JSON.stringify(event));
			$scope.upbalanceObjInf.beginDate = event.beginDate;
			$scope.upbalanceObjInf.endDate = event.endDate;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/object/updateBalanceObject.html',$scope.upbalanceObjInf,{
				title : T.T('YYJ600012'),
				buttons : [ T.T('F00107'),T.T('F00012') ],
				size : [ '1200px', '620px' ],
				callbacks : [ $scope.updateBalanceObject ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updateBalanceObject = function(result) {
			$scope.upbalanceObj = {};
			$scope.upbalanceObj = result.scope.upbalanceObjInf;
			$scope.upbalanceObj.objectType = result.scope.objectTypeUpdate;
			$scope.upbalanceObj.interestPostingBalanceObject = result.scope.interestPostingBalanceObjectUpdate;
			$scope.upbalanceObj.artifactInstanList=[];
			var key;
			for (key in $scope.balanceObjInf) {
				if ($scope.balanceObjInf[key] == "null"
						|| $scope.balanceObjInf[key] == null) {
					$scope.balanceObjInf[key] = '';
                }
            }
            for (var i = 0; i < result.scope.BPUpdateChose.length; i++) {
				$scope.upbalanceObj.artifactInstanList.push(result.scope.BPUpdateChose[i]);
			}
			jfRest.request('balanceObject', 'update',$scope.upbalanceObj).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.balanceObjectList.search();
				}
			});
		};
	});
	// 查看========查看余额对象详情页面========11
	webApp.controller('viewBalanceObjectCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.operationModeArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "operationMode.queryMode",// 数据源调用的action
			callback : function(data) {
				$scope.viewOperationMode = $scope.balanceObjInf.operationMode;
			}
		};
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.viewObjectType = $scope.balanceObjInf.objectType;
				}
			};
		$scope.PostingBalanceObjectArr = {
				type : "dynamicDesc",
				param : {
					operationMode : $scope.balanceObjInf.operationMode
				},// 默认查询条件
				text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
				desc : "objectDesc",
				value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "balanceObject.query",// 数据源调用的action
				callback : function(data) {
					$scope.interestPostingBalanceObjectInfo = $scope.balanceObjInf.interestPostingBalanceObject;
				}
			};
		 //余额对象参数选项
		$scope.balanceObjectView = {
			params : {
				instanCode:$scope.balanceObjInf.balanceObjectCode,
				operationMode:$scope.balanceObjInf.operationMode,
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//余额对象构件实例====详情
		$scope.queryArtifactBP = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
				title : '查看'+$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +'的参数信息',
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};
	});
	// 修改=============4444
	webApp.controller('updateBalanceObjectCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.operationModeArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "modeName", // 下拉框显示内容，根据需要修改字段名称
			value : "operationMode", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "operationMode.queryMode",// 数据源调用的action
			callback : function(data) {
				$scope.updateOperationMode = $scope.upbalanceObjInf.operationMode;
			}
		};
		$scope.PostingBalanceObjectArr = {
				type : "dynamicDesc",
				param : {
					operationMode : $scope.balanceObjInf.operationMode
				},// 默认查询条件
				text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
				desc : "objectDesc",
				value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "balanceObject.query",// 数据源调用的action
				callback : function(data) {
					$scope.interestPostingBalanceObjectUpdate = $scope.upbalanceObjInf.interestPostingBalanceObject;
				}
			};
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.objectTypeUpdate = $scope.upbalanceObjInf.objectType;
				}
			};
		//查询余额对象实例构件
		$scope.queryUpdateMODB = {
				params : $scope.queryParam = {
						instanCode:$scope.upbalanceObjInf.balanceObjectCode,
						operationMode : $scope.upbalanceObjInf.operationMode
				}, // 表格查询时的参数信息
				autoQuery: true,
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						if(data.returnData.rows == undefined ||  data.returnData.rows == null  ||data.returnData.rows == ''){
							data.returnData.rows =[];
						}
					}else {
						var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
						jfLayer.fail(returnMsg);
					}
				}
			};
		//余额对象实例化时，点击替换参数的方法
		$scope.selectAUpdateBP = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP]
				});
		};
		$scope.isChoseBP = false;
		$scope.BPUpdateChose = [];
		$scope.choseSelectAUpdateBP = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.queryUpdateMODB.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryUpdateMODB.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if($scope.BPUpdateChose.length > 0 ){
				var isExist = false;						//是否存在
				for(var i=0;i<$scope.BPUpdateChose.length;i++){
					if($scope.BPUpdateChose[i].artifactNo === $scope.queryUpdateMODB.data[$scope.indexNo].artifactNo && 
					$scope.BPUpdateChose[i].instanCode1 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode1 && 
					$scope.BPUpdateChose[i].instanCode2 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode2 && 
					$scope.BPUpdateChose[i].instanCode3 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode3 && 
					$scope.BPUpdateChose[i].instanCode4 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode4 && 
					$scope.BPUpdateChose[i].instanCode5 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode5){
						$scope.BPUpdateChose.splice(i,1);
						$scope.BPUpdateChose.push($scope.queryUpdateMODB.data[$scope.indexNo]);
						isExist = true;						//是否存在
						break;
					}else{
						isExist = false;						//是否存在
					}
				}
				if(!isExist){
					$scope.BPUpdateChose.push($scope.queryUpdateMODB.data[$scope.indexNo]);
					$scope.isChoseBP = true;
				}
			}else{
				$scope.BPUpdateChose.push($scope.queryUpdateMODB.data[$scope.indexNo]);
				$scope.isChoseBP = true;
			}
			$scope.safeApply();
			result.cancel();
		};
		//余额对象实例化时，点击设置参数值的方法
		$scope.setSelectAUpdateBP = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateBP.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdateBP]
				}); 
		};
		$scope.choseSelectTwoUpdateBP = function(result) {
			$scope.items = {};
			$scope.queryUpdateMODB.data[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.queryUpdateMODB.data[$scope.indexNo].addPcdFlag = 	"1";
			if($scope.BPUpdateChose.length > 0 ){
				var isExist = false;						//是否存在
				for(var i=0;i<$scope.BPUpdateChose.length;i++){
					if($scope.BPUpdateChose[i].artifactNo === $scope.queryUpdateMODB.data[$scope.indexNo].artifactNo && 
					$scope.BPUpdateChose[i].instanCode1 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode1 && 
					$scope.BPUpdateChose[i].instanCode2 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode2 && 
					$scope.BPUpdateChose[i].instanCode3 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode3 && 
					$scope.BPUpdateChose[i].instanCode4 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode4 && 
					$scope.BPUpdateChose[i].instanCode5 === $scope.queryUpdateMODB.data[$scope.indexNo].instanCode5){
						$scope.BPUpdateChose.splice(i,1);
						$scope.BPUpdateChose.push($scope.queryUpdateMODB.data[$scope.indexNo]);
						isExist = true;						//是否存在
						break;
					}else{
						isExist = false;						//是否存在
					}
				}
				if(!isExist){
					$scope.BPUpdateChose.push($scope.queryUpdateMODB.data[$scope.indexNo]);
					$scope.isChoseBP = true;
				}
			}else{
				$scope.BPUpdateChose.push($scope.queryUpdateMODB.data[$scope.indexNo]);
				$scope.isChoseBP = true;
			}
			$scope.safeApply();
			result.cancel();
		};
		//余额对象实例化时，点击替换参数的方法
		$scope.selectAUpdateBPchose = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBPchose]
				});
		};
		$scope.choseSelectAUpdateBPchose = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.BPUpdateChose[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.BPUpdateChose[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		//余额对象实例化时，点击设置参数值的方法
		$scope.setSelectAUpdateBPchose = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectPCDUpdateBP.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwoUpdateBPchose]
				}); 
		};
		$scope.choseSelectTwoUpdateBPchose = function(result) {
			$scope.items = {};
			$scope.BPUpdateChose[$scope.indexNo].pcdInstanList = result.scope.pcdInfTable;
			$scope.BPUpdateChose[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		 //删除余额对象已修改的信息
        $scope.deleteTypeBPUpdate =  function(data){
        	var checkId = data;
			$scope.BPUpdateChose.splice(checkId, 1);
        }
	});
	// 余额对象新增=========3333
	webApp.controller('balanceObjectEstCtrl',function($scope, $stateParams, jfRest, $http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService, $translate,$translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.balanceObjInf = {};
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {}
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
		//利息入账余额对象 
		$scope.PostingBalanceObjectArr = {};
		var form = layui.form;
		form.on('select(getOperationModeBOEAdd)',function(event){
			//查询运营模式下的余额对象
			 //利息入账余额对象 
			$scope.PostingBalanceObjectArr = {
				type : "dynamicDesc",
				param : {
					operationMode : event.value
				},// 默认查询条件
				text : "balanceObjectCode", // 下拉框显示内容，根据需要修改字段名称
				desc : "objectDesc",
				value : "balanceObjectCode", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "balanceObject.query",// 数据源调用的action
				callback : function(data) {
				}
			};
		});
		// 日期控件
		layui.use('laydate', function() {
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem : '#LAY_start_Obj',
				min : Date.now(),
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
				elem : '#LAY_end_Obj',
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
	});
	//******************************替换参数元件44444***************
	webApp.controller('selectElementNoBTCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.itemsNo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	//****************** 替换参数元件end555555555555***************
	//设置pcd参数
	webApp.controller('selectPCDUpdateBPCtrl',function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.pcdExampleInf ={};
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
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeUpdateD = $scope.pcdExampleInf.segmentType;
			}
		};
		//新增pcd差异化不显示
		$scope.showNewPcdInfoUpdate = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtnUpdate = function() {
			$scope.pcdExampleInfUpdate = {};
            $scope.showNewPcdInfoUpdate = !$scope.showNewPcdInfoUpdate;
            if($scope.showNewPcdInfoUpdate){
            	$scope.pcdExampleInfUpdate.segmentSerialNum = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.addButtonShowUpdate = false;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null && $scope.itemsPCD.segmentType!=""){//分段类型不为空segmentNumber
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShowUpdate = true;
		}else{
			$scope.addButtonShowUpdate = false;
		}
		if($scope.itemsPCD.pcdInstanList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInstanList;
		}else{
			$scope.showNewPcdInfoUpdate = true;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDifUpdate =  function(item,data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
        };
        //获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeUpdate)',function(event){
			 $scope.pcdTypeUpdate = event.value;
		 });
        //修改pcd实例列表某行
        $scope.updateInstanUpdate = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfoUpdate = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfUpdate = $scope.updateInstanTemp;
		};
        //保存pcd实例============余额对象实例化设置参数值=============需要修改类型参数
		  $scope.saveNewAdrInfoUpdate = function() {
			  if(null== $scope.pcdExampleInfUpdate.pcdPoint|| null== $scope.pcdTypeUpdate
	    			 || null== $scope.pcdExampleInfUpdate.pcdValue 
	    			  ) {
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
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInfUpdate.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeUpdate;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInfUpdate.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInfUpdate.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInfUpdate.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
					$scope.pcdExampleInfUpdate = {};
				}
				$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
				$scope.showNewPcdInfoUpdate = false;
	       };
		  var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
							title : T.T('YYJ400021'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBusType]
						});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
							title : T.T('YYJ400022'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseMedia]
						});
				}else if(dataType=="MODB"){//余额对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
							title : T.T('YYJ400023'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBalanceObject]
						});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
							title : T.T('YYJ400024'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductObject]
						});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
							title : T.T('YYJ400025'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductLine]
						});
				}else if(dataType=="ACST"){//核算状态
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
							title : T.T('YYJ400026'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseAcst]
						});
				}else if(dataType=="EVEN"){//事件
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseEvent]
						});
				}else if(dataType=="BLCK"){//封锁码
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
							title : T.T('YYJ400028'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBlockCode]
						});
				}else if(dataType=="AUTX"){//授权场景
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
							title : T.T('YYJ400029'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseScenarioList]
						});
				}else if(dataType=="LMND"){//额度节点
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
							title : T.T('YYJ400030'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseQuotaTree]
						});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseCurrency]
						});
				}else if(dataType=="DELQ"){//延滞层级
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
							title : T.T('YYJ400031'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				//if (!result.scope.itemList.validCheck()) {
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
//				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.artifactExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.artifactExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.artifactExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.artifactExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.artifactExampleInf.instanCode5 = code;
				}else if(dataValue=='base'){
					$scope.pcdExampleInf.baseInstanCode = code;
				}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseBaseInstanCodeBtnUpdate = function() {
				//获取基础维度的值
				dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtnUpdate = function() {
				//获取可选维度的值
				dataValueCount ='option';
				$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
			};
	});
//	// ***************查看业务项目详情strat***************
//	webApp.controller('busProInfoCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location, lodinDataService,$translate, $translatePartialLoader, T) {
//		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
//		$translate.use($scope.lang);
//		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
//		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
//		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
//		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
//		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
//		$translate.refresh();
//		$rootScope.valueInfoPro = "";
//		$scope.busListTableView = {
//			params : $scope.queryParam = {
//				businessProgramNo : $scope.soItemPro.businessProgramNo,
//				operationMode : $rootScope.operationMods,
//				pageSize : 10,
//				indexNo : 0
//			}, // 表格查询时的参数信息
//			paging : true,// 默认true,是否分页
//			autoQuery : true,
//			resource : 'productLineBusType.query',// 列表的资源
//			callback : function(data) { // 表格查询后的回调函数
//			}
//		};
//		$scope.ComArtifactView = {
//			params : {
//				instanCode : $scope.proLineInf.businessProgramNo,
//				operationMode : $rootScope.operationMods
//			}, // 表格查询时的参数信息
//			autoQuery : true,
//			paging : true,// 默认true,是否分页
//			resource : 'artifactExample.query',// 列表的资源
//			callback : function(data) { // 表格查询后的回调函数
//				console.log(data);
//			}
//		};
//		/** 承责属性PSN/空/null:个人承责CMP:预算单位/公司承责TOG:共同承责 [3,0] */
//		$scope.responseTypeArr = [ {
//			id : "PSN",
//			name : T.T("YYJ100015")
//		}, {
//			id : "CMP",
//			name : T.T("YYJ100016")
//		}, {
//			id : "TOG",
//			name : T.T("YYJ100017")
//		} ];
//		// 针对系统目前存在的承责属性未赋值的业务项目时，系统使用时，默认此项为个人承责。所以当此项为空或null时查询/修改页面显示为“个人承责”。
//		if ($scope.proLineInf.responseType == null
//				|| $scope.proLineInf.responseType == 'null') {
//			$scope.proLineInf.responseType = 'PSN';
//		}
//		;
//
//		// 业务类型
//		$scope.busTypeArr = {
//			type : "dynamic",
//			param : {},// 默认查询条件
//			text : "businessDesc", // 下拉框显示内容，根据需要修改字段名称
//			value : "businessTypeCode", // 下拉框对应文本的值，根据需要修改字段名称
//			resource : "businessType.query",// 数据源调用的action
//			callback : function(data) {
//				$scope.proLineInf.disputeBusinessTypeView = $scope.proLineInf.disputeBusinessType;
//			}
//		};
//		// 业务类型
//		$scope.busTypeArrView = {
//			type : "dynamic",
//			param : {},// 默认查询条件
//			text : "businessDesc", // 下拉框显示内容，根据需要修改字段名称
//			value : "businessTypeCode", // 下拉框对应文本的值，根据需要修改字段名称
//			resource : "businessType.query",// 数据源调用的action
//			callback : function(data) {
//				$scope.proLineInf.feeBusinessTypeView = $scope.proLineInf.feeBusinessType;
//			}
//		};
//		// 产品构件实例====详情
//		$scope.queryArtifactBP = function(item) {
//			$scope.itemArtifact = {};
//			// 页面弹出框事件(弹出页面)
//			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
//			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html',$scope.itemArtifact, {
//				title : T.T('YYH500008'),
//				buttons : [ T.T('F00012') ],
//				size : [ '1100px', '530px' ],
//				callbacks : []
//			});
//		};
//	});
//	// ***************查看业务项目详情end***************
	// 业务类型
	webApp.controller('choseBusinessTypeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		//业务类型列表
		$scope.businessTypeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessType.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 媒介对象
	webApp.controller('choseMediaObjectCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translate.refresh();
		//媒介对象列表
		$scope.mediaObjectList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'mediaObject.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数

			}
		};
	});
	// 余额对象
	webApp.controller('choseBalanceObjectCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {}
			};
		// 余额对象列表
		$scope.balanceObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" : $rootScope.operationMods,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'balanceObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_balanceType'],//查找数据字典所需参数
			transDict : ['objectType_objectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 产品对象
	webApp.controller('choseProductObjectCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		// 产品對象列表
		$scope.proObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" : $rootScope.operationMods,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 业务项目
	webApp.controller('choseProductLineCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		// 业务项目列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" : $rootScope.operationMods,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 事件
	webApp.controller('choseEventCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService,
			$translate, $translatePartialLoader, T) {
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 币种
	webApp.controller('choseCurrencyCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		// 货币列表
		$scope.currencyTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	// 核算状态
	webApp.controller('choseAcstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService,
			$translate, $translatePartialLoader, T) {
		$scope.accountStateTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountState.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	// 授权场景
	webApp.controller('choseScenarioCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.scenarioList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"authDataSynFlag" : "1",
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'authScene.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	// 额度节点
	webApp.controller('choseQuotaTreeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.quotaTreeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" : $rootScope.operationMods,
				"authDataSynFlag" : "1",
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'quotaNode.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	// 延滞层级
	webApp.controller('choseDelvCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService,
			$translate, $translatePartialLoader, T) {
		$scope.delvTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'delv.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	// 封锁码
	webApp.controller('choseBlockCodeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,
			lodinDataService, $translate, $translatePartialLoader, T) {
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级G:业务项目*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   			}
   		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//封锁码列表
		$scope.blockCDScnMgtTable = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCode.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_effectiveScope'],//查找数据字典所需参数
			transDict : ['effectivenessCodeScope_effectivenessCodeScopeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('viewBalancePriorityCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.balanceObjectListTable = {
//				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'balanceObject.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//查看中 查看业务类型得参数详情===============22
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeInfoD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.itemArtifact.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.segmentTypeInfoD =  data.returnData.rows[0].segmentType;
					$scope.pcdInstanList = [];
					$scope.pcdInstanList.push(data.returnData.rows[0].pcdInitList);
					$scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
      //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	 //pcd差异列表
           $scope.pcdInfTable = [];
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.itemArtifact.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.itemArtifact.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.itemArtifact.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.itemArtifact.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.itemArtifact.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.itemArtifact.instanCode5;
    	   $scope.queryPcdExample.addPcdFlag = '2';
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }else if($scope.pcdInstanList.length > 0){
    				   $scope.pcdInfTable = $scope.pcdInstanList[0];
    			   }
    		   }
    	   });
       }
	});
});
