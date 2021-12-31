'use strict';
define(function(require) {
	var webApp = require('app');
	// 正负面清单查询及维护
	webApp.controller('negativeListCtrl', function($scope, $stateParams, jfRest,
												   $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$rootScope.isCustomerNo = false;
		$rootScope.isExterNo = false;
		$rootScope.isriskLevelNo = false;
		$rootScope.productDimensionNoAdd = false;
		//运营模式======法人实体下默认缺省运营模式
		$scope.coArray ={
			type:"dynamic",
			param:{
				corporationEntityNo:$scope.corporationId,
				requestType:1,
				resultType:1,
				adminFlagLogin:$scope.adminFlagAuth
			},//默认查询条件
			text:"modeName", //下拉框显示内容，根据需要修改字段名称
			value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"legalEntity.query",//数据源调用的action
			callback: function(data){
			}
		};
		$scope.listCodeArr ={};
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
		//差异化类型 
		$scope.differentTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_differentType",
				queryFlag: "children"
			},//默认查询条件
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
			}
		};
		$scope.eventList = "";
		$scope.addBtnFlag = false;
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		//根据菜单和当前登录者查询有权限的事件编号
		$scope.menuNoSel = $scope.menuNo;
		$scope.paramsNo = {
			menuNo:$scope.menuNoSel
		};
		jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
			if(data.returnData != null || data.returnData != ""){
				for(var i=0;i<data.returnData.length;i++){
					$scope.eventList += data.returnData[i].eventNo + ",";
				}
				if($scope.eventList.search('AUS.PM.02.0201') != -1){    //授权场景新增
					$scope.addBtnFlag = true;
				}
				else{
					$scope.addBtnFlag = false;
				}
				if($scope.eventList.search('AUS.PM.02.0202') != -1){    //授权场景查询
					$scope.selBtnFlag = true;
				}
				else{
					$scope.selBtnFlag = false;
				}
				if($scope.eventList.search('AUS.PM.02.0203') != -1){    //授权场景修改
					$scope.updBtnFlag = true;
				}
				else{
					$scope.updBtnFlag = false;
				}
			}
		});
		$scope.isshowa = false;
		$scope.isshowb = false;
		var form = layui.form;
		form.on('select(getOperationMode)',function(event){
			if(event.value){
				//管控场景码
				$scope.listCodeArr ={
					type:"dynamicDesc",
					param:{
						operationMode:event.value,
						differentType:'0',
					},//默认查询条件
					text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称
					desc:"contrlSceneDesc",
					value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
					resource:"diffQueryb.query",//数据源调用的action
					callback: function(data){

					}
				};
			}
		});
		form.on('select(getDifferentType)',function(event){
			if($scope.differentType == "1"){
				$rootScope.isCustomerNo = false;
				$rootScope.isExterNo = false;
				$rootScope.isriskLevelNo = true;
				$rootScope.productDimensionNoAdd = false;
				$scope.idType = "";
				$scope.idNumber = "";
				$scope.externalIdentificationNo = "";
			}
			else if($scope.differentType == "2"){
				$rootScope.isCustomerNo = true;
				$rootScope.isExterNo = false;
				$rootScope.isriskLevelNo = false;
				$rootScope.productDimensionNoAdd = false;
				$scope.riskLevel = "";
				$scope.externalIdentificationNo = "";
			}else if($scope.differentType == "3"){
				$rootScope.isCustomerNo = false;
				$rootScope.isExterNo = true;
				$rootScope.isriskLevelNo = false;
				$rootScope.productDimensionNoAdd = false;
				$scope.idType = "";
				$scope.idNumber = "";
				$scope.riskLevel = "";
			}else if($scope.differentType == "0"){
				$rootScope.isCustomerNo = false;
				$rootScope.isExterNo = false;
				$rootScope.isriskLevelNo = false;
				$rootScope.productDimensionNoAdd = false;
				$scope.idType = "";
				$scope.idNumber = "";
				$scope.riskLevel = "";
				$scope.externalIdentificationNo = "";
			}else if($scope.differentType == "4") {
				$rootScope.isCustomerNo = false;
				$rootScope.isExterNo = false;
				$rootScope.isriskLevelNo = false;
				$rootScope.productDimensionNoAdd = true;
				$scope.idType = "";
				$scope.idNumber = "";
				$scope.riskLevel = "";
				$scope.externalIdentificationNo = "";
			}
		});
		//正负面清单查询
		$scope.itemListb = {
			params : $scope.queryParam = {
				"flag":true,
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery:false,
			resource : 'negativeSaveb.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
			transDict : ['differentType_differentTypeDesc','listTyp_listTypDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//正负面清单查询
		$scope.itemLista = {
			params : $scope.queryParam = {
				"flag":true,
				"authDataSynFlag":"1",
				"pageSize":10,
				"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery:false,
			resource : 'negativeSavea.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
			transDict : ['differentType_differentTypeDesc','listTyp_listTypDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数

			}
		};
		$scope.selIdType = "";
		$scope.selIdNum = "";
		$scope.selDifferentCode = "";
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.operationMode){
				if(!$scope.differentType){
					$scope.differentType = '0';
				}
				if($scope.differentType == '1'){
					var reg = /^\d{2}$/;
					if (reg.test($scope.riskLevel)) {
						$scope.selIdType = "";
						$scope.selIdNum = "";
						$scope.selDifferentCode = "";
						$scope.itemListb.params.differentType = $scope.differentType;
						$scope.itemListb.params.differentCode = $scope.riskLevel;
						$scope.itemListb.params.operationMode = $scope.operationMode;
						$scope.itemListb.params.listCode = $scope.listCode;
//						$scope.itemListb.params.idType = '';
//						$scope.itemListb.params.idNumber = '';
						delete $scope.itemListb.params['idNumber'];
						delete $scope.itemListb.params['idType'];
						$scope.itemListb.search();
						$scope.isshowa = false;
						$scope.isshowb = true;
					}else{
						jfLayer.alert(T.T('SQJ1700030'));
					}
				}else if($scope.differentType == '2'){
					$scope.selIdType = $scope.idType;
					$scope.selIdNum = $scope.idNumber;
					$scope.selDifferentCode = "";
					if($scope.idNumber && $scope.idType){
						$scope.itemLista.params.differentType = $scope.differentType;
						$scope.itemLista.params.idType = $scope.idType;
						$scope.itemLista.params.idNumber = $scope.idNumber;
						$scope.itemLista.params.operationMode = $scope.operationMode;
						$scope.itemLista.params.listCode = $scope.listCode;
						$scope.itemLista.params.differentCode = '';
						$scope.itemLista.search();
						$scope.isshowa = true;
						$scope.isshowb = false;
					}else{
						jfLayer.alert(T.T('SQJ1700031'));  //请输入差异化证件类型及证件号
					}
				}else if($scope.differentType == '3'){
					if($scope.externalIdentificationNo){
						$scope.selIdType = "";
						$scope.selIdNum = "";
						$scope.selDifferentCode = $scope.externalIdentificationNo;
						$scope.itemLista.params.differentType = $scope.differentType;
						$scope.itemLista.params.differentCode = $scope.externalIdentificationNo;
						$scope.itemLista.params.externalIdentificationNo = $scope.externalIdentificationNo;
						$scope.itemLista.params.operationMode = $scope.operationMode;
						$scope.itemLista.params.listCode = $scope.listCode;
//						$scope.itemLista.params.idType = '';
//						$scope.itemLista.params.idNumber = '';
						delete $scope.itemLista.params['idNumber'];
						delete $scope.itemLista.params['idType'];
						$scope.itemLista.search();
						$scope.isshowa = true;
						$scope.isshowb = false;
					}else{
						jfLayer.alert(T.T('SQJ1700032'));  //请输入差异化外部识别号
					}
				}else if($scope.differentType == '0'){
					$scope.selIdType = "";
					$scope.selIdNum = "";
					$scope.selDifferentCode = "";
					$scope.itemListb.params.operationMode = $scope.operationMode;
					$scope.itemListb.params.listCode = $scope.listCode;
//					$scope.itemListb.params.idType = '';
//					$scope.itemListb.params.idNumber = '';
					delete $scope.itemListb.params['idNumber'];
					delete $scope.itemListb.params['idType'];
					$scope.itemListb.params.differentCode = '';
					$scope.itemListb.params.differentType = $scope.differentType;
					$scope.itemListb.search();
					$scope.isshowa = false;
					$scope.isshowb = true;
				}  else if($scope.differentType == '4'){
					$scope.selIdType = "";
					$scope.selIdNum = "";
					$scope.selDifferentCode = "";
					$scope.itemListb.params.operationMode = $scope.operationMode;
					$scope.itemListb.params.listCode = $scope.listCode;
					$scope.itemListb.params.productDimension = $scope.productDimensionAdd;
//					$scope.itemListb.params.idType = '';
//					$scope.itemListb.params.idNumber = '';
					delete $scope.itemListb.params['idNumber'];
					delete $scope.itemListb.params['idType'];
					$scope.itemListb.params.differentType = $scope.differentType;
					$scope.itemListb.search();
					$scope.isshowa = false;
					$scope.isshowb = true;
				}
			}else{
				$scope.isshowb = false;
				jfLayer.fail(T.T('SQJ2200010'));  //"请选择营运模式进行查询！"
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			$scope.item = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/negativeInfo.html', $scope.item, {
				title : T.T('SQJ2200001'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '440px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addNegative = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/negativeListAdd.html', '', {
				title : T.T('SQJ2200002'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '600px' ],
				callbacks : [$scope.saveNegaInfo ]
			});
		};
		// 保存信息事件
		$scope.saveNegaInfo = function(result) {
			$scope.negInfoAdd = $.parseJSON(JSON.stringify(result.scope.negadd));
			$scope.negListAddNew = result.scope.negasAddList;
			$scope.negInfoAdd.authPositivNegativListDtos = [];
			var addnegNew = "";
			if($scope.negListAddNew.length == 0){
				$scope.negInfoAdd.authPositivNegativListDtos = [{}];
			}
			else{
				for (var i = 0; i < $scope.negListAddNew.length; i++) {
					addnegNew ={listProject1:$scope.negListAddNew[i].listProject1,listProject2:$scope.negListAddNew[i].listProject2,listProject3:$scope.negListAddNew[i].listProject3,listProject4:$scope.negListAddNew[i].listProject4,listProject5:$scope.negListAddNew[i].listProject5,listProject6:$scope.negListAddNew[i].listProject6,listProject7:$scope.negListAddNew[i].listProject7,listProject8:$scope.negListAddNew[i].listProject8,listProject9:$scope.negListAddNew[i].listProject9,listProject10:$scope.negListAddNew[i].listProject10};
					$scope.negInfoAdd.authPositivNegativListDtos.push(addnegNew);
				}
			}
			$scope.negInfoAdd.listTyp = result.scope.listTypInfo;
			if($scope.negInfoAdd.differentCode == ""){
				delete $scope.negInfoAdd['differentCode'];
			}
			if(result.scope.differentTypeAdd == '1'){
				var reg = /^\d{2}$/;
				if (reg.test(result.scope.riskLevelAdd)) {
					$scope.negInfoAdd.differentCode = result.scope.riskLevelAdd;
					$scope.negInfoAdd.differentType = result.scope.differentTypeAdd;
					delete $scope.negInfoAdd['idNumber'];
					delete $scope.negInfoAdd['idType'];
					jfRest.request('negativeSaveb', 'save', $scope.negInfoAdd).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.success(T.T('F00058'));
							$scope.safeApply();
							result.cancel();
							$scope.negInfoAdd = {};
							//$scope.seachQuota();
						}
					});
				}else{
					jfLayer.alert(T.T('SQJ1700030'));
				}
			}else if(result.scope.differentTypeAdd == '2'){
				if(result.scope.idNumberAdd && result.scope.idTypeAdd){
					$scope.negInfoAdd.differentCode = '';
					$scope.negInfoAdd.idNumber = result.scope.idNumberAdd;
					$scope.negInfoAdd.idType = result.scope.idTypeAdd;
					$scope.negInfoAdd.differentType = result.scope.differentTypeAdd;
					$scope.negInfoAdd.authDataSynFlag = "1";
					jfRest.request('negativeSavea', 'save', $scope.negInfoAdd).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.success(T.T('F00058'));
							$scope.safeApply();
							result.cancel();
							$scope.negInfoAdd = {};
							//$scope.seachQuota();
						}
					});
				}else{
					jfLayer.alert(T.T('SQJ1700031'));
				}
			}else if(result.scope.differentTypeAdd == '3'){
				if(result.scope.externalIdentificationNoAdd){
					$scope.negInfoAdd.externalIdentificationNo = result.scope.externalIdentificationNoAdd;
					delete $scope.negInfoAdd['idNumber'];
					delete $scope.negInfoAdd['idType'];
					$scope.negInfoAdd.differentType = result.scope.differentTypeAdd;
					$scope.negInfoAdd.authDataSynFlag = "1";
					jfRest.request('negativeSavea', 'save', $scope.negInfoAdd).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.success(T.T('F00058'));
							$scope.safeApply();
							result.cancel();
							$scope.negInfoAdd = {};
							//$scope.seachQuota();
						}
					});
				}else{
					jfLayer.alert(T.T('SQJ1700032'));
				}
			}else if(result.scope.differentTypeAdd == '0'){
				delete $scope.negInfoAdd['idNumber'];
				delete $scope.negInfoAdd['idType'];
				$scope.negInfoAdd.differentType = result.scope.differentTypeAdd;
				jfRest.request('negativeSaveb', 'save', $scope.negInfoAdd).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.success(T.T('F00058'));
						$scope.safeApply();
						result.cancel();
						$scope.negInfoAdd = {};
						//$scope.seachQuota();
					}
				});
			}else if(result.scope.differentTypeAdd == '4') {
				$scope.negInfoAdd.differentCode = result.scope.productDimensionAdd;
				$scope.negInfoAdd.differentType = result.scope.differentTypeAdd;
				delete $scope.negInfoAdd['idNumber'];
				delete $scope.negInfoAdd['idType'];
				jfRest.request('negativeSaveb', 'save', $scope.negInfoAdd).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.success(T.T('F00058'));
						$scope.safeApply();
						result.cancel();
						$scope.negInfoAdd = {};
						//$scope.seachQuota();
					}
				});
			}
		};
		//清单类型
		$scope.listTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_listTypeFive",
				queryFlag: "children"
			},//默认查询条件
			rmData:['PD','CH'],
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
			}
		};
		//修改事件
		$scope.updateInfo = function(event) {
			$scope.item = {};
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/negativeListUpdate.html', $scope.item, {
				title : T.T('SQJ2200008'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1000px', '550px' ],
				callbacks : [$scope.saveNega ]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveNega = function(result) {
			delete $scope.item['invalidFlag'];
			$scope.item.authPositivNegativListDtos = [];
			var updatenegNew = "";
			$scope.negasList = result.scope.negasList;
			if($scope.negasList){
				for (var i = 0; i < $scope.negasList.length; i++) {
					updatenegNew ={id:$scope.negasList[i].id,listSerialNumbr:$scope.negasList[i].listSerialNumbr,listProject1:$scope.negasList[i].listProject1,listProject2:$scope.negasList[i].listProject2,listProject3:$scope.negasList[i].listProject3,listProject4:$scope.negasList[i].listProject4,listProject5:$scope.negasList[i].listProject5,listProject6:$scope.negasList[i].listProject6,listProject7:$scope.negasList[i].listProject7,listProject8:$scope.negasList[i].listProject8,listProject9:$scope.negasList[i].listProject9,listProject10:$scope.negasList[i].listProject10};
					$scope.item.authPositivNegativListDtos.push(updatenegNew);
				}
			}else{
				$scope.item.authPositivNegativListDtos = [];
			}
			if($scope.item.differentCode == "" || $scope.item.differentCode == null){
				delete $scope.item['differentCode'];
			}
			if($scope.item.differentType == '1'){
				jfRest.request('negativeSaveb', 'update', $scope.item).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
			}else if($scope.item.differentType == '2'){
				$scope.item.authDataSynFlag = "1";
				$scope.item.idType = $scope.selIdType;
				$scope.item.idNumber = $scope.selIdNum;
				$scope.item.externalIdentificationNo = "";
				jfRest.request('negativeSavea', 'update', $scope.item).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
			}else if($scope.item.differentType == '3'){
				$scope.item.idType = "";
				$scope.item.idNumber = "";
				$scope.item.externalIdentificationNo = $scope.externalIdentificationNo;
				$scope.item.authDataSynFlag = "1";
				jfRest.request('negativeSavea', 'update', $scope.item).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
			}else  if($scope.item.differentType == '0'){
				jfRest.request('negativeSaveb', 'update', $scope.item).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
			} else if($scope.item.differentType == '4') {
				jfRest.request('negativeSaveb', 'update', $scope.item).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00022'));
						$scope.item = {};
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
            }
        };
	});
	// 正负面清单查询
	webApp.controller('negativeListInfoCtrl', function($scope, $stateParams, jfRest,
													   $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		if($scope.item.differentType == '1'){
			$scope.itemInfoList = {
				params : $scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					"differentCode":$scope.item.differentCode,
					"differentType":$scope.item.differentType,
					"flag":false,
					"listCode":$scope.item.listCode,
					"listTyp": $scope.item.listTyp,
					"listProperties": $scope.item.listProperties,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'negativeSaveb.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
		}else if($scope.item.differentType == '2'){
			//正负面清单详情查询
			$scope.itemInfoList = {
				params : $scope.queryParam = {
					"idType":$scope.selIdType,
					"idNumber":$scope.selIdNum,
					"operationMode":$scope.item.operationMode,
					"differentType":$scope.item.differentType,
					"differentCode":$scope.item.differentCode,
					"flag":false,
					"customerNo":$scope.item.differentCode,
					"listCode":$scope.item.listCode,
					"listTyp": $scope.item.listTyp,
					"listProperties": $scope.item.listProperties,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'negativeSavea.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
		}else if($scope.item.differentType == '3'){
			//正负面清单详情查询
			$scope.itemInfoList = {
				params : $scope.queryParam = {
					"externalIdentificationNo":$scope.externalIdentificationNo,
					"operationMode":$scope.item.operationMode,
					"differentType":$scope.item.differentType,
					"differentCode":$scope.item.differentCode,
					"flag":false,
					"listCode":$scope.item.listCode,
					"listTyp": $scope.item.listTyp,
					"listProperties": $scope.item.listProperties,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'negativeSavea.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
		}else  if($scope.item.differentType == '0'){
			$scope.itemInfoList = {
				params : $scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					"differentCode":$scope.item.differentCode,
					"differentType":$scope.item.differentType,
					"flag":false,
					"listCode":$scope.item.listCode,
					"listTyp": $scope.item.listTyp,
					"listProperties": $scope.item.listProperties,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'negativeSaveb.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
		} else if($scope.item.differentType == '4') {
			$scope.itemInfoList = {
				params : $scope.queryParam = {
					"operationMode":$scope.item.operationMode,
					"differentCode":$scope.item.differentCode,
					"differentType":$scope.item.differentType,
					"flag":false,
					"listCode":$scope.item.listCode,
					"listTyp": $scope.item.listTyp,
					"listProperties": $scope.item.listProperties,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'negativeSaveb.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
		}
	});
	// 正负面清单新增
	webApp.controller('negativeAddCtrl', function($scope, $stateParams, jfRest,
												  $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		//证件
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
		//差异化类型 
		$scope.differentTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_differentType",
				queryFlag: "children"
			},//默认查询条件
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
			}
		};
		//清单类型
		$scope.listTypeArray ={
			type:"dictData",
			param:{
				"type":"DROPDOWNBOX",
				groupsCode:"dic_listTypeFive",
				queryFlag: "children"
			},//默认查询条件
			rmData:['PD','CH'],
			text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"paramsManage.query",//数据源调用的action
			callback: function(data){
			}
		};
		$scope.listCodeAddArr ={ };
		//联动验证
		var form = layui.form;
		form.on('select(getOperationModeAdd)',function(event){
			if(event.value){
				//管控场景码
				$scope.listCodeAddArr ={
					type:"dynamicDesc",
					param:{
						operationMode:event.value,
						differentType:'0',
					},//默认查询条件
					text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称
					desc:"contrlSceneDesc",
					value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
					resource:"diffQueryb.query",//数据源调用的action
					callback: function(data){

					}
				};
			}
		});
		form.on('select(getIdType)',function(data){
			if(data.value == "1"){//身份证
				$("#neg_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#neg_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#neg_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#neg_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#neg_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#neg_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#neg_idNumber").attr("validator","noValidator");
				$scope.mdmInfoForm.$setPristine();
				$("#neg_idNumber").removeClass("waringform ");
            }
        });
		//运营模式======法人实体下默认缺省运营模式
		$scope.coArray ={
			type:"dynamic",
			param:{
				corporationEntityNo:$scope.corporationId,
				requestType:1,
				resultType:1,
				adminFlagLogin:$scope.adminFlagAuth
			},//默认查询条件
			text:"modeName", //下拉框显示内容，根据需要修改字段名称
			value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"legalEntity.query",//数据源调用的action
			callback: function(data){
			}
		};
		$scope.negasAddList = [];
		//特店ID--增加
		$scope.addNegaAdd = function(){
			if($scope.negasAddList == 0){
				$scope.negasAddList = [{}];
			}
			else{
				$scope.negasAddList.splice($scope.negasAddList.length,0,{});
			}
		};
		//删除
		$scope.delNegasAdd = function(e,$index){
			$scope.negasAddList.splice($index,1);
		};
		$rootScope.isCustomerNoAdd = false;
		$rootScope.isExterNoAdd = false;
		$rootScope.isriskLevelNoAdd = false;
		$rootScope.productDimensionNoAdd = false;
		var form = layui.form;
		form.on('select(getDifferentTypeAdd)',function(event){
			if($scope.differentTypeAdd == "1"){
				$rootScope.isCustomerNoAdd = false;
				$rootScope.isExterNoAdd = false;
				$rootScope.isriskLevelNoAdd = true;
				$rootScope.productDimensionNoAdd = false;
				$scope.idTypeAdd = "";
				$scope.idNumberAdd = "";
				$scope.externalIdentificationNoAdd = "";
			}
			else if($scope.differentTypeAdd == "2"){
				$rootScope.isCustomerNoAdd = true;
				$rootScope.isExterNoAdd = false;
				$rootScope.isriskLevelNoAdd = false;
				$rootScope.productDimensionNoAdd = false;
				$scope.riskLevelAdd = "";
				$scope.externalIdentificationNoAdd = "";
			}else if($scope.differentTypeAdd == "3"){
				$rootScope.isCustomerNoAdd = false;
				$rootScope.isExterNoAdd = true;
				$rootScope.isriskLevelNoAdd = false;
				$rootScope.productDimensionNoAdd = false;
				$scope.idTypeAdd = "";
				$scope.idNumberAdd = "";
				$scope.riskLevelAdd = "";
			}else if($scope.differentTypeAdd == "4"){
				$rootScope.isCustomerNoAdd = false;
				$rootScope.isExterNoAdd = false;
				$rootScope.isriskLevelNoAdd = false;
				$rootScope.productDimensionNoAdd = true;
				$scope.idTypeAdd = "";
				$scope.idNumberAdd = "";
				$scope.externalIdentificationNoAdd = "";
				$scope.productDimensionAdd ="";
			}
		});
	});
	// 正负面清单维护
	webApp.controller('negativeUpdateCtrl', function($scope, $stateParams, jfRest,
													 $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		//运营模式======法人实体下默认缺省运营模式
		$scope.coArray ={
			type:"dynamic",
			param:{
				corporationEntityNo:$scope.corporationId,
				requestType:1,
				resultType:1,
				adminFlagLogin:$scope.adminFlagAuth
			},//默认查询条件
			text:"modeName", //下拉框显示内容，根据需要修改字段名称
			value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
			resource:"legalEntity.query",//数据源调用的action
			callback: function(data){
			}
		};
		if($scope.item.differentType == '1'){
			$scope.queryParam = {
				"operationMode":$scope.item.operationMode,
				"differentCode":$scope.item.differentCode,
				"flag":false,
				"differentType":$scope.item.differentType,
				"listCode":$scope.item.listCode,
				"listTyp": $scope.item.listTyp,
				"listProperties": $scope.item.listProperties,
				"authDataSynFlag":"1",
				"pageSize":10,
				"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('negativeSaveb', 'query', $scope.queryParam).then(function(data) {
				$scope.negasList = data.returnData.rows;
			});
		}else if($scope.item.differentType == '2'){
			//正负面清单详情查询
			$scope.queryParam = {
				"idType":$scope.selIdType,
				"idNumber":$scope.selIdNum,
				"operationMode":$scope.item.operationMode,
				"differentCode":$scope.item.differentCode,
				"flag":false,
				"differentType":$scope.item.differentType,
				"customerNo":$scope.item.differentCode,
				"listCode":$scope.item.listCode,
				"listTyp": $scope.item.listTyp,
				"listProperties": $scope.item.listProperties,
				"authDataSynFlag":"1",
				"pageSize":10,
				"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('negativeSavea', 'query', $scope.queryParam).then(function(data) {
				$scope.negasList = data.returnData.rows;
			});
		}else if($scope.item.differentType == '3'){
			//正负面清单详情查询
			$scope.queryParam = {
				"externalIdentificationNo":$scope.externalIdentificationNo,
				"operationMode":$scope.item.operationMode,
				"differentCode":$scope.item.differentCode,
				"flag":false,
				"differentType":$scope.item.differentType,
				"listCode":$scope.item.listCode,
				"listTyp": $scope.item.listTyp,
				"listProperties": $scope.item.listProperties,
				"authDataSynFlag":"1",
				"pageSize":10,
				"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('negativeSavea', 'query', $scope.queryParam).then(function(data) {
				$scope.negasList = data.returnData.rows;
			});
		}else  if($scope.item.differentType == '0'){
			$scope.queryParam = {
				"operationMode":$scope.item.operationMode,
				"differentCode":$scope.item.differentCode,
				"flag":false,
				"differentType":$scope.item.differentType,
				"listCode":$scope.item.listCode,
				"listTyp": $scope.item.listTyp,
				"listProperties": $scope.item.listProperties,
				"authDataSynFlag":"1",
				"pageSize":10,
				"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('negativeSaveb', 'query', $scope.queryParam).then(function(data) {
				$scope.negasList = data.returnData.rows;
			});
		}else if($scope.item.differentType == '4'){
			$scope.queryParam = {
				"operationMode":$scope.item.operationMode,
				"differentCode":$scope.item.differentCode,
				"flag":false,
				"differentType":$scope.item.differentType,
				"listCode":$scope.item.listCode,
				"listTyp": $scope.item.listTyp,
				"listProperties": $scope.item.listProperties,
				"authDataSynFlag":"1",
				"pageSize":10,
				"indexNo":0
			}; // 表格查询时的参数信息
			jfRest.request('negativeSaveb', 'query', $scope.queryParam).then(function(data) {
				$scope.negasList = data.returnData.rows;
			});
		}
		$scope.addNega = function(){
			if($scope.negasList == 0 || $scope.negasList == "" || $scope.negasList == null){
				$scope.negasList = [{}];
			}
			else{
				$scope.negasList.splice($scope.negasList.length,0,{});
			}
		};
		//删除
		$scope.delList = function(e,$index){
			$scope.itemd = {};
			$scope.itemd.authPositivNegativListDtos = [];
			var delnegNew = "";
			jfLayer.confirm(T.T('SQJ2200009'),function() {
				for (var i = 0; i < $scope.negasList.length; i++) {
					if(i == $index){
						$scope.itemd.id = $scope.negasList[i].id;
						delnegNew ={id:$scope.negasList[i].id,invalidFlag:"1",listSerialNumbr:$scope.negasList[i].listSerialNumbr,listProject1:$scope.negasList[i].listProject1,listProject2:$scope.negasList[i].listProject2,listProject3:$scope.negasList[i].listProject3,listProject4:$scope.negasList[i].listProject4,listProject5:$scope.negasList[i].listProject5,listProject6:$scope.negasList[i].listProject6,listProject7:$scope.negasList[i].listProject7,listProject8:$scope.negasList[i].listProject8,listProject9:$scope.negasList[i].listProject9,listProject10:$scope.negasList[i].listProject10};
						$scope.itemd.authPositivNegativListDtos.push(delnegNew);
						break;
					}
				}
				$scope.itemd.operationMode = e.operationMode;
				$scope.itemd.differentCode = e.differentCode;
				$scope.itemd.listCode = e.listCode;
				$scope.itemd.listDesc = e.listDesc;
				$scope.itemd.listTyp = e.listTyp;
				$scope.itemd.listProperties = e.listProperties;
				$scope.itemd.differentType = e.differentType;
				if($scope.itemd.id == undefined){
					$scope.negasList.splice($index,1);
					jfLayer.alert(T.T('F00037'));
				}
				else{
					if($scope.itemd.differentCode == ""){
						delete $scope.itemd['differentCode'];
					}
					if($scope.itemd.differentType == '1'){
						jfRest.request('negativeSaveb', 'update', $scope.itemd).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.itemd = {};
								$scope.negasList.splice($index,1);
								jfLayer.alert(T.T('F00037'));
								/*if($scope.negasList.length == 0){
									//$(".layui-layer-page").css("display","none");
									//$(".layui-layer-shade").css("z-index","-1");
									$scope.turn("/auth/negativeQuery");
								}*/
							}
						});
					}else if($scope.itemd.differentType == '2'){
						$scope.itemd.authDataSynFlag = "1";
						$scope.itemd.idType = $scope.selIdType;
						$scope.itemd.idNumber = $scope.selIdNum;
						$scope.itemd.externalIdentificationNo = "";
						jfRest.request('negativeSavea', 'update', $scope.itemd).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.itemd = {};
								$scope.negasList.splice($index,1);
								jfLayer.alert(T.T('F00037'));
								/*if($scope.negasList.length == 0){
									//$(".layui-layer-page").css("display","none");
									//$(".layui-layer-shade").css("z-index","-1");
									$scope.turn("/auth/negativeQuery");
								}*/
							}
						});
					}else if($scope.itemd.differentType == '3'){
						$scope.itemd.authDataSynFlag = "1";
						$scope.itemd.idType = "";
						$scope.itemd.idNumber = "";
						$scope.itemd.externalIdentificationNo = $scope.externalIdentificationNo;
						jfRest.request('negativeSavea', 'update', $scope.itemd).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.itemd = {};
								$scope.negasList.splice($index,1);
								jfLayer.alert(T.T('F00037'));
								/*if($scope.negasList.length == 0){
									//$(".layui-layer-page").css("display","none");
									//$(".layui-layer-shade").css("z-index","-1");
									$scope.turn("/auth/negativeQuery");
								}*/
							}
						});
					}else  if($scope.itemd.differentType == '0'){
						jfRest.request('negativeSaveb', 'update', $scope.itemd).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.itemd = {};
								$scope.negasList.splice($index,1);
								jfLayer.alert(T.T('F00037'));
								/*if($scope.negasList.length == 0){
									//$(".layui-layer-page").css("display","none");
									//$(".layui-layer-shade").css("z-index","-1");
									$scope.turn("/auth/negativeQuery");
								}*/
							}
						});
					}else  if($scope.itemd.differentType == '4'){
						jfRest.request('negativeSaveb', 'update', $scope.itemd).then(function(data) {
							if (data.returnMsg == 'OK') {
								$scope.itemd = {};
								$scope.negasList.splice($index,1);
								jfLayer.alert(T.T('F00037'));
								/*if($scope.negasList.length == 0){
									//$(".layui-layer-page").css("display","none");
									//$(".layui-layer-shade").css("z-index","-1");
									$scope.turn("/auth/negativeQuery");
								}*/
							}
						});
					}
				}
			},function() {
			});
		};
		//全部删除
		$scope.delAllNeg =  function(){
			$scope.delitem = {};
			$scope.delitem.operationMode = $scope.item.operationMode;
			$scope.delitem.differentType = $scope.item.differentType;
			$scope.delitem.differentCode = $scope.item.differentCode;
			$scope.delitem.listCode = $scope.item.listCode;
			$scope.delitem.listDesc = $scope.item.listDesc;
			$scope.delitem.listTyp = $scope.item.listTyp;
			$scope.delitem.listProperties = $scope.item.listProperties;
			$scope.delitem.invalidFlag = "1";
			jfLayer.confirm(T.T('SQJ2200009'),function() {
				if($scope.delitem.differentCode == ""){
					delete $scope.delitem['differentCode'];
				}
				if($scope.delitem.differentType == '1'){
					jfRest.request('negativeSaveb', 'update', $scope.delitem).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.delitem = {};
							$scope.negasList = "";
							jfLayer.alert(T.T('F00037'));
							/*$(".layui-layer-page").css("display","none");
							$(".layui-layer-shade").css("z-index","-1");
							$scope.turn("/auth/negativeQuery");*/
						}
					});
				}else if($scope.delitem.differentType == '2'){
					$scope.delitem.authDataSynFlag = "1";
					$scope.delitem.idType = $scope.selIdType;
					$scope.delitem.idNumber = $scope.selIdNum;
					$scope.delitem.externalIdentificationNo = "";
					jfRest.request('negativeSavea', 'update', $scope.delitem).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.delitem = {};
							$scope.negasList = "";
							jfLayer.alert(T.T('F00037'));
							/*$(".layui-layer-page").css("display","none");
							$(".layui-layer-shade").css("z-index","-1");
							$scope.turn("/auth/negativeQuery");*/
						}
					});
				}else if($scope.delitem.differentType == '3'){
					$scope.delitem.authDataSynFlag = "1";
					$scope.delitem.idType = "";
					$scope.delitem.idNumber = "";
					$scope.delitem.externalIdentificationNo = $scope.externalIdentificationNo;
					jfRest.request('negativeSavea', 'update', $scope.delitem).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.delitem = {};
							$scope.negasList = "";
							jfLayer.alert(T.T('F00037'));
							/*$(".layui-layer-page").css("display","none");
							$(".layui-layer-shade").css("z-index","-1");
							$scope.turn("/auth/negativeQuery");*/
						}
					});
				}else  if($scope.delitem.differentType == '0'){
					jfRest.request('negativeSaveb', 'update', $scope.delitem).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.delitem = {};
							$scope.negasList = "";
							jfLayer.alert(T.T('F00037'));
							/*$(".layui-layer-page").css("display","none");
							$(".layui-layer-shade").css("z-index","-1");
							$scope.turn("/auth/negativeQuery");*/
						}
					});
				}else  if($scope.delitem.differentType == '4'){
					jfRest.request('negativeSaveb', 'update', $scope.delitem).then(function(data) {
						if (data.returnMsg == 'OK') {
							$scope.delitem = {};
							$scope.negasList = "";
							jfLayer.alert(T.T('F00037'));
							/*$(".layui-layer-page").css("display","none");
							$(".layui-layer-shade").css("z-index","-1");
							$scope.turn("/auth/negativeQuery");*/
						}
					});
				}
			},function() {
			});
		};
	});
});
