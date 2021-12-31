'use strict';
define(function(require) {

	var webApp = require('app');

	// 正负面清单查询及维护
	webApp.controller('supplyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_limit');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
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
	   	   			if($scope.eventList.search('AUS.OP.01.0009') != -1){    //副卡管控限制新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.OP.01.0009') != -1){    //副卡管控限制查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.OP.01.0009') != -1){    //副卡管控限制修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
   				}
   			});
   			$scope.isshowC = false;
		//管控清单查询
		$scope.itemListc = {
				params : $scope.queryParam = {
						"flag":'0',
						"pageSize":10,
						"indexNo":0,
						"authDataSynFlag":'1'
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'supplyControl.update',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						$scope.isshowc = true;
					}else{
						$scope.isshowc = false;
					}
				}
			};
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.externalIdentificationNoSel){
				$scope.itemListc.params.externalIdentificationNo = $scope.externalIdentificationNoSel;
				$scope.itemListc.search();
			}else{
				jfLayer.fail(T.T('F00194'));  //"请输入附属卡外部识别号！"
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			$scope.sInfo = {};
			// 页面弹出框事件(弹出页面)
			$scope.sInfo = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/supplyControlInfo.html', $scope.sInfo, {
				title : T.T('SQJ2200001'),
				buttons : [ T.T('F00012')],
				size : [ '1100px', '620px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addSupply = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/supplyControlAdd.html', '', {
				title : T.T('SQJ2200014'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '620px' ],
				callbacks : [$scope.saveSupplyInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveSupplyInfo = function(result) {
			$scope.sAddInfo = $.parseJSON(JSON.stringify(result.scope.sAdd));
			$scope.sAddInfo.operationMode = result.scope.operationMode;
			$scope.sAddInfo.authDataSynFlag = "1";
			$scope.sAddInfo.flag = "1";
	 		$scope.sAddInfo.externalIdentificationNo = result.scope.externalIdentificationNo;
				jfRest.request('supplyControl', 'update', $scope.sAddInfo).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00058'));
	                	$scope.safeApply();
		    			result.cancel();
		    			$scope.sAddInfo = {};
		    			$scope.externalIdentificationNoSel = result.scope.externalIdentificationNo;
		    			$scope.itemListc.params.externalIdentificationNo = result.scope.externalIdentificationNo;
						$scope.itemListc.search();
			   			$scope.isshowc = true;
	                }
	            });
		};
		//删除事件
		$scope.delInfo = function(result) {
			$scope.delItem = $.parseJSON(JSON.stringify(result));
			jfLayer.confirm(T.T('SQJ1900005'),function() {
				$scope.delItem.invalidFlag = "1";
				$scope.delItem.authDataSynFlag = "1";
				jfRest.request('supplyControl', 'update', $scope.delItem).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.alert(T.T('F00037'));
						$scope.delItem = {};
						$scope.itemListc.search();
			   			$scope.isshowc = true;
					}
				});
			},function() {
				
			});
		};
		//修改事件
		$scope.updateInfo = function(event) {
			$scope.itemUpdate = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemUpdate = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/supplyControlUpdate.html', $scope.itemUpdate, {
				title : T.T('SQJ2200008'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1100px', '620px' ],
				callbacks : [$scope.saveSupUpdate ]
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveSupUpdate = function(result) {
			$scope.itemU = {};
			$scope.itemU = $.parseJSON(JSON.stringify(result.scope.itemUpdate));
			$scope.itemU.limitSingleTransFlag = result.scope.limitSingleTransFlagU;
			$scope.itemU.limitDayTransFlag = result.scope.limitDayTransFlagU;
			$scope.itemU.limitCycleTransFlag = result.scope.limitCycleTransFlagU;
			$scope.itemU.limitMonthTransFlag = result.scope.limitMonthTransFlagU;
			$scope.itemU.limitHalfYearTransFlag = result.scope.limitHalfYearTransFlagU;
			$scope.itemU.limitYearTransFlag = result.scope.limitYearTransFlagU;
			$scope.itemU.limitLifeCycleTransFlag = result.scope.limitLifeCycleTransFlagU;
			$scope.itemU.numberDayTransFlag = result.scope.numberDayTransFlagU;
			$scope.itemU.numberCycleTransFlag = result.scope.numberCycleTransFlagU;
			$scope.itemU.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
			$scope.itemU.numberHalfYearTransFlag = result.scope.numberHalfYearTransFlagU;
			$scope.itemU.numberYearTransFlag = result.scope.numberYearTransFlagU;
			$scope.itemU.numberLifeCycleTransFlag = result.scope.numberLifeCycleTransFlagU;
			$scope.itemU.authDataSynFlag = "1";
			$scope.itemU.flag = "2";
 			jfRest.request('supplyControl', 'update', $scope.itemU).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.alert(T.T('F00022'));
					$scope.itemU = {};
					$scope.safeApply();
					result.cancel();
					$scope.itemListc.search();
		   			$scope.isshowc = true;
				}
			});
		};
	});


	// 管控清单查询
	webApp.controller('supplyViewCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_limit');
		$translate.refresh();
		$scope.currencyCodeArray = {};
		$scope.listCodeAddArr = {};
		//是否标识
		$scope.defaultFlagArray1 = {
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
				$scope.limitSingleTransFlagInfo = $scope.sInfo.limitSingleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray2 = {
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
				$scope.limitDayTransFlagInfo = $scope.sInfo.limitDayTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray3 = {
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
				$scope.limitCycleTransFlagInfo = $scope.sInfo.limitCycleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray4 = {
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
				$scope.limitMonthTransFlagInfo = $scope.sInfo.limitMonthTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray5 = {
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
				$scope.limitHalfYearTransFlagInfo = $scope.sInfo.limitHalfYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray6 = {
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
				$scope.limitYearTransFlagInfo = $scope.sInfo.limitYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray7 = {
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
				$scope.limitLifeCycleTransFlagInfo = $scope.sInfo.limitLifeCycleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray8 = {
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
				$scope.numberDayTransFlagInfo = $scope.sInfo.numberDayTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray9 = {
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
				$scope.numberCycleTransFlagInfo = $scope.sInfo.numberCycleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray10 = {
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
				$scope.numberMonthTransFlagInfo = $scope.sInfo.numberMonthTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray11 = {
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
				$scope.numberHalfYearTransFlagInfo = $scope.sInfo.numberHalfYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray12 = {
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
				$scope.numberYearTransFlagInfo = $scope.sInfo.numberYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray13 = {
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
				$scope.numberLifeCycleTransFlagInfo = $scope.sInfo.numberLifeCycleTransFlag;
			}
		};
		//根据 运营模式查询 币种
		$scope.params = {
				"operationMode":$scope.sInfo.operationMode,
   		};
		jfRest.request('operatCurrency','query',$scope.params).then(function(data1) {
			if(data1.returnCode == "000000"){
				if(data1.returnData.rows.length >0){
	        		$scope.currencyCodeArray = $scope.builder.option(data1.returnData.rows, 'currencyCode','currencyDesc');
	        		$timeout(function(){
	        			Tansun.plugins.render('select');
	        			$scope.currencyCodeInfo = $scope.sInfo.currencyCode;
					});				        		
	        	}

}
        });
		//根据 运营模式查询 管控场景代码列表
		$scope.params ={
				authDataSynFlag:'1',
				differentType:'0',
				operationMode:$scope.sInfo.operationMode	
		};		
		jfRest.request('diffQueryb','query',$scope.params).then(function(data2) {
			if(data2.returnCode == "000000"){
				if(data2.returnData.rows.length >0){
	        		$scope.listCodeAddArr = $scope.builder.option(data2.returnData.rows, 'contrlSceneCode','contrlSceneDesc');
	        		$timeout(function(){
	        			Tansun.plugins.render('select');
	        			$scope.transLimitCodeInfo = $scope.sInfo.transLimitCode;
					});				        		
	        	}

}
        });
	});
	
	// 管控清单新增
	webApp.controller('supplyAddCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_limit');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.sAdd = {};
		//是否标识
		$scope.defaultFlagArray = {
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
				$scope.sAdd.limitSingleTransFlag = 'N';
				$scope.sAdd.limitDayTransFlag = 'N';
				$scope.sAdd.limitCycleTransFlag = 'N';
				$scope.sAdd.limitMonthTransFlag = 'N';
				$scope.sAdd.limitHalfYearTransFlag = 'N';
				$scope.sAdd.limitYearTransFlag = 'N';
				$scope.sAdd.limitLifeCycleTransFlag = 'N';
				$scope.sAdd.numberDayTransFlag = 'N';
				$scope.sAdd.numberCycleTransFlag = 'N';
				$scope.sAdd.numberMonthTransFlag = 'N';
				$scope.sAdd.numberHalfYearTransFlag = 'N';
				$scope.sAdd.numberYearTransFlag = 'N';
				$scope.sAdd.numberLifeCycleTransFlag = 'N';
			}
		};
		$scope.currencyCodeArray = {};
		$scope.listCodeAddArr = {};
		$scope.isBtnSure = true;
		$scope.isBtnResult = false;
		$scope.stepOne = function(){
			if($scope.externalIdentificationNo){
				//查询客户运营模式
				$scope.opParams = {
						"authDataSynFlag":"1",
					    "idType" : $scope.idType,
			    	   "idNumber" : $scope.idNumber,
			    	   "externalIdentificationNo" : $scope.externalIdentificationNo
				};
				jfRest.request('cusInfo', 'cusQuery', $scope.opParams)
			    .then(function(data) {
			    	if(data.returnMsg == 'OK'){
			    		$scope.isBtnSure = false;
			    		$scope.isBtnResult = true;
			    		var adom1I = document.getElementsByClassName('step1I');
			    		for(var i=0;i<adom1I.length;i++){
	  	      				adom1I[i].setAttribute('readonly',true);
	  	      				adom1I[i].classList.add('bnone');
	  	      			}
			    		$scope.operationMode = data.returnData.rows[0].operationMode;
			    		//根据 运营模式查询 币种
			    		$scope.params = {
			    				"operationMode":$scope.operationMode,
				   		};
			    		jfRest.request('operatCurrency','query',$scope.params).then(function(data1) {
			    			if(data1.returnCode == "000000"){
			    				if(data1.returnData.rows.length >0){
					        		$scope.currencyCodeArray = $scope.builder.option(data1.returnData.rows, 'currencyCode','currencyDesc');
					        		$timeout(function(){
					        			Tansun.plugins.render('select');
									});				        		
					        	}

}
                        });
			    		//根据 运营模式查询 管控场景代码列表
			    		$scope.params ={
			    				authDataSynFlag:'1',
			    				differentType:'0',
			    				operationMode:$scope.operationMode	
			    		};		
			    		jfRest.request('diffQueryb','query',$scope.params).then(function(data2) {
			    			if(data2.returnCode == "000000"){
			    				if(data2.returnData.rows.length >0){
					        		$scope.listCodeAddArr = $scope.builder.option(data2.returnData.rows, 'contrlSceneCode','contrlSceneDesc');
					        		$timeout(function(){
					        			Tansun.plugins.render('select');
									});				        		
					        	}

}
                        });
			    	}else{
			    		$scope.isBtnSure = true;
			    		$scope.isBtnResult = false;
			    	}
			    });
			}else{
				jfLayer.fail(T.T('F00194'));  //"请输入附属卡外部识别号！"
			}
		};
		 var form = layui.form;
		 form.on('select(getFlag1Add)',function(event){
			if(event.value){	
			 //额度节点下拉列表框
				if(event.value == 'Y'){
					$('#limitSingleTransId').removeAttr('readonly');
					$('#limitSingleTransId').removeClass('bnone');
				}else if(event.value == 'N'){
					$('#limitSingleTransId').attr('readonly',true);
					$('#limitSingleTransId').addClass('bnone');
					$scope.sAdd.limitSingleTrans = "";
				}
			}
		 });
		 form.on('select(getFlag2Add)',function(event){
			if(event.value){	
			 //额度节点下拉列表框
				if(event.value == 'Y'){
					$('#limitDayTransId').removeAttr('readonly');
					$('#limitDayTransId').removeClass('bnone');
				}else if(event.value == 'N'){
					$('#limitDayTransId').attr('readonly',true);
					$('#limitDayTransId').addClass('bnone');
					$scope.sAdd.limitDayTrans = "";
				}
			}
		 });
		 form.on('select(getFlag3Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#limitCycleTransId').removeAttr('readonly');
						$('#limitCycleTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#limitCycleTransId').attr('readonly',true);
						$('#limitCycleTransId').addClass('bnone');
						$scope.sAdd.limitCycleTrans = "";
					}
				}
			 });
		 form.on('select(getFlag4Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#limitMonthTransId').removeAttr('readonly');
						$('#limitMonthTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#limitMonthTransId').attr('readonly',true);
						$('#limitMonthTransId').addClass('bnone');
						$scope.sAdd.limitMonthTrans = "";
					}
				}
			 });
		 form.on('select(getFlag5Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#limitHalfYearTransId').removeAttr('readonly');
						$('#limitHalfYearTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#limitHalfYearTransId').attr('readonly',true);
						$('#limitHalfYearTransId').addClass('bnone');
						$scope.sAdd.limitHalfYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag6Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#limitYearTransId').removeAttr('readonly');
						$('#limitYearTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#limitYearTransId').attr('readonly',true);
						$('#limitYearTransId').addClass('bnone');
						$scope.sAdd.limitYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag7Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#limitLifeCycleTransId').removeAttr('readonly');
						$('#limitLifeCycleTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#limitLifeCycleTransId').attr('readonly',true);
						$('#limitLifeCycleTransId').addClass('bnone');
						$scope.sAdd.limitLifeCycleTrans = "";
					}
				}
			 });
		 form.on('select(getFlag8Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#numberDayTransId').removeAttr('readonly');
						$('#numberDayTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#numberDayTransId').attr('readonly',true);
						$('#numberDayTransId').addClass('bnone');
						$scope.sAdd.numberDayTrans = "";
					}
				}
			 });
		 form.on('select(getFlag9Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#numberCycleTransId').removeAttr('readonly');
						$('#numberCycleTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#numberCycleTransId').attr('readonly',true);
						$('#numberCycleTransId').addClass('bnone');
						$scope.sAdd.numberCycleTrans = "";
					}
				}
			 });
		 form.on('select(getFlag10Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#numberMonthTransId').removeAttr('readonly');
						$('#numberMonthTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#numberMonthTransId').attr('readonly',true);
						$('#numberMonthTransId').addClass('bnone');
						$scope.sAdd.numberMonthTrans = "";
					}
				}
			 });
		 form.on('select(getFlag11Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#numberHalfYearTransId').removeAttr('readonly');
						$('#numberHalfYearTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#numberHalfYearTransId').attr('readonly',true);
						$('#numberHalfYearTransId').addClass('bnone');
						$scope.sAdd.numberHalfYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag12Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#numberYearTransId').removeAttr('readonly');
						$('#numberYearTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#numberYearTransId').attr('readonly',true);
						$('#numberYearTransId').addClass('bnone');
						$scope.sAdd.numberYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag13Add)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#numberLifeCycleTransId').removeAttr('readonly');
						$('#numberLifeCycleTransId').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#numberLifeCycleTransId').attr('readonly',true);
						$('#numberLifeCycleTransId').addClass('bnone');
						$scope.sAdd.numberLifeCycleTrans = "";
					}
				}
			 });
	});
	// 正负面清单维护
	webApp.controller('supplyUpdateCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_limit');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.currencyCodeArray = {};
		$scope.listCodeAddArr = {};
		//是否标识
		$scope.defaultFlagArray1 = {
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
				$scope.limitSingleTransFlagU = $scope.itemUpdate.limitSingleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray2 = {
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
				$scope.limitDayTransFlagU = $scope.itemUpdate.limitDayTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray3 = {
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
				$scope.limitCycleTransFlagU = $scope.itemUpdate.limitCycleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray4 = {
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
				$scope.limitMonthTransFlagU = $scope.itemUpdate.limitMonthTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray5 = {
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
				$scope.limitHalfYearTransFlagU = $scope.itemUpdate.limitHalfYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray6 = {
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
				$scope.limitYearTransFlagU = $scope.itemUpdate.limitYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray7 = {
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
				$scope.limitLifeCycleTransFlagU = $scope.itemUpdate.limitLifeCycleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray8 = {
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
				$scope.numberDayTransFlagU = $scope.itemUpdate.numberDayTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray9 = {
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
				$scope.numberCycleTransFlagU = $scope.itemUpdate.numberCycleTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray10 = {
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
				$scope.numberMonthTransFlagU = $scope.itemUpdate.numberMonthTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray11 = {
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
				$scope.numberHalfYearTransFlagU = $scope.itemUpdate.numberHalfYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray12 = {
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
				$scope.numberYearTransFlagU = $scope.itemUpdate.numberYearTransFlag;
			}
		};
		//是否标识
		$scope.defaultFlagArray13 = {
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
				$scope.numberLifeCycleTransFlagU = $scope.itemUpdate.numberLifeCycleTransFlag;
			}
		};
		//根据 运营模式查询 币种
		$scope.params = {
				"operationMode":$scope.itemUpdate.operationMode,
   		};
		jfRest.request('operatCurrency','query',$scope.params).then(function(data1) {
			if(data1.returnCode == "000000"){
				if(data1.returnData.rows.length >0){
	        		$scope.currencyCodeArray = $scope.builder.option(data1.returnData.rows, 'currencyCode','currencyDesc');
	        		$timeout(function(){
	        			Tansun.plugins.render('select');
	        			$scope.currencyCodeU = $scope.itemUpdate.currencyCode;
					});				        		
	        	}

}
        });
		//根据 运营模式查询 管控场景代码列表
		$scope.params ={
				authDataSynFlag:'1',
				differentType:'0',
				operationMode:$scope.itemUpdate.operationMode	
		};		
		jfRest.request('diffQueryb','query',$scope.params).then(function(data2) {
			if(data2.returnCode == "000000"){
				if(data2.returnData.rows.length >0){
	        		$scope.listCodeAddArr = $scope.builder.option(data2.returnData.rows, 'contrlSceneCode','contrlSceneDesc');
	        		$timeout(function(){
	        			Tansun.plugins.render('select');
	        			$scope.transLimitCodeU = $scope.itemUpdate.transLimitCode;
					});				        		
	        	}

}
        });
		console.log($scope.itemUpdate);
		if($scope.itemUpdate.limitSingleTransFlag == 'Y'){
			$('#flagInpt1').removeAttr('readonly');
			$('#flagInpt1').removeClass('bnone');
		}else if($scope.itemUpdate.limitSingleTransFlag == 'N'){
			$('#flagInpt1').attr('readonly',true);
			$('#flagInpt1').addClass('bnone');
        }
        if($scope.itemUpdate.limitDayTransFlag == 'Y'){
			$('#flagInpt2').removeAttr('readonly');
			$('#flagInpt2').removeClass('bnone');
		}else if($scope.itemUpdate.limitDayTransFlag == 'N'){
			$('#flagInpt2').attr('readonly',true);
			$('#flagInpt2').addClass('bnone');
        }
        if($scope.itemUpdate.limitCycleTransFlag == 'Y'){
			$('#flagInpt3').removeAttr('readonly');
			$('#flagInpt3').removeClass('bnone');
		}else if($scope.itemUpdate.limitCycleTransFlag == 'N'){
			$('#flagInpt3').attr('readonly',true);
			$('#flagInpt3').addClass('bnone');
        }
        if($scope.itemUpdate.limitMonthTransFlag == 'Y'){
			$('#flagInpt4').removeAttr('readonly');
			$('#flagInpt4').removeClass('bnone');
		}else if($scope.itemUpdate.limitMonthTransFlag == 'N'){
			$('#flagInpt4').attr('readonly',true);
			$('#flagInpt4').addClass('bnone');
        }
        if($scope.itemUpdate.limitHalfYearTransFlag == 'Y'){
			$('#flagInpt5').removeAttr('readonly');
			$('#flagInpt5').removeClass('bnone');
		}else if($scope.itemUpdate.limitHalfYearTransFlag == 'N'){
			$('#flagInpt5').attr('readonly',true);
			$('#flagInpt5').addClass('bnone');
        }
        if($scope.itemUpdate.limitYearTransFlag == 'Y'){
			$('#flagInpt6').removeAttr('readonly');
			$('#flagInpt6').removeClass('bnone');
		}else if($scope.itemUpdate.limitYearTransFlag == 'N'){
			$('#flagInpt6').attr('readonly',true);
			$('#flagInpt6').addClass('bnone');
        }
        if($scope.itemUpdate.limitLifeCycleTransFlag == 'Y'){
			$('#flagInpt7').removeAttr('readonly');
			$('#flagInpt7').removeClass('bnone');
		}else if($scope.itemUpdate.limitLifeCycleTransFlag == 'N'){
			$('#flagInpt7').attr('readonly',true);
			$('#flagInpt7').addClass('bnone');
        }
        if($scope.itemUpdate.numberDayTransFlag == 'Y'){
			$('#flagInpt8').removeAttr('readonly');
			$('#flagInpt8').removeClass('bnone');
		}else if($scope.itemUpdate.numberDayTransFlag == 'N'){
			$('#flagInpt8').attr('readonly',true);
			$('#flagInpt8').addClass('bnone');
        }
        if($scope.itemUpdate.numberCycleTransFlag == 'Y'){
			$('#flagInpt9').removeAttr('readonly');
			$('#flagInpt9').removeClass('bnone');
		}else if($scope.itemUpdate.numberCycleTransFlag == 'N'){
			$('#flagInpt9').attr('readonly',true);
			$('#flagInpt9').addClass('bnone');
        }
        if($scope.itemUpdate.numberMonthTransFlag == 'Y'){
			$('#flagInpt10').removeAttr('readonly');
			$('#flagInpt10').removeClass('bnone');
		}else if($scope.itemUpdate.numberMonthTransFlag == 'N'){
			$('#flagInpt10').attr('readonly',true);
			$('#flagInpt10').addClass('bnone');
        }
        if($scope.itemUpdate.numberHalfYearTransFlag == 'Y'){
			$('#flagInpt11').removeAttr('readonly');
			$('#flagInpt11').removeClass('bnone');
		}else if($scope.itemUpdate.numberHalfYearTransFlag == 'N'){
			$('#flagInpt11').attr('readonly',true);
			$('#flagInpt11').addClass('bnone');
        }
        if($scope.itemUpdate.numberYearTransFlag == 'Y'){
			$('#flagInpt12').removeAttr('readonly');
			$('#flagInpt12').removeClass('bnone');
		}else if($scope.itemUpdate.numberYearTransFlag == 'N'){
			$('#flagInpt12').attr('readonly',true);
			$('#flagInpt12').addClass('bnone');
        }
        if($scope.itemUpdate.numberLifeCycleTransFlag == 'Y'){
			$('#flagInpt13').removeAttr('readonly');
			$('#flagInpt13').removeClass('bnone');
		}else if($scope.itemUpdate.numberLifeCycleTransFlag == 'N'){
			$('#flagInpt13').attr('readonly',true);
			$('#flagInpt13').addClass('bnone');
        }
        var form = layui.form;
		 form.on('select(getFlag1Update)',function(event){
			if(event.value){	
			 //额度节点下拉列表框
				if(event.value == 'Y'){
					$('#flagInpt1').removeAttr('readonly');
					$('#flagInpt1').removeClass('bnone');
				}else if(event.value == 'N'){
					$('#flagInpt1').attr('readonly',true);
					$('#flagInpt1').addClass('bnone');
					$scope.itemUpdate.limitSingleTrans = "";
				}
			}
		 });
		 form.on('select(getFlag2Update)',function(event){
			if(event.value){	
			 //额度节点下拉列表框
				if(event.value == 'Y'){
					$('#flagInpt2').removeAttr('readonly');
					$('#flagInpt2').removeClass('bnone');
				}else if(event.value == 'N'){
					$('#flagInpt2').attr('readonly',true);
					$('#flagInpt2').addClass('bnone');
					$scope.itemUpdate.limitDayTrans = "";
				}
			}
		 });
		 form.on('select(getFlag3Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt3').removeAttr('readonly');
						$('#flagInpt3').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt3').attr('readonly',true);
						$('#flagInpt3').addClass('bnone');
						$scope.itemUpdate.limitCycleTrans = "";
					}
				}
			 });
		 form.on('select(getFlag4Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt4').removeAttr('readonly');
						$('#flagInpt4').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt4').attr('readonly',true);
						$('#flagInpt4').addClass('bnone');
						$scope.itemUpdate.limitMonthTrans = "";
					}
				}
			 });
		 form.on('select(getFlag5Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt5').removeAttr('readonly');
						$('#flagInpt5').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt5').attr('readonly',true);
						$('#flagInpt5').addClass('bnone');
						$scope.itemUpdate.limitHalfYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag6Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt6').removeAttr('readonly');
						$('#flagInpt6').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt6').attr('readonly',true);
						$('#flagInpt6').addClass('bnone');
						$scope.itemUpdate.limitYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag7Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt7').removeAttr('readonly');
						$('#flagInpt7').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt7').attr('readonly',true);
						$('#flagInpt7').addClass('bnone');
						$scope.itemUpdate.limitLifeCycleTrans = "";
					}
				}
			 });
		 form.on('select(getFlag8Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt8').removeAttr('readonly');
						$('#flagInpt8').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt8').attr('readonly',true);
						$('#flagInpt8').addClass('bnone');
						$scope.itemUpdate.numberDayTrans = "";
					}
				}
			 });
		 form.on('select(getFlag9Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt9').removeAttr('readonly');
						$('#flagInpt9').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt9').attr('readonly',true);
						$('#flagInpt9').addClass('bnone');
						$scope.itemUpdate.numberCycleTrans = "";
					}
				}
			 });
		 form.on('select(getFlag10Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt10').removeAttr('readonly');
						$('#flagInpt10').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt10').attr('readonly',true);
						$('#flagInpt10').addClass('bnone');
						$scope.itemUpdate.numberMonthTrans = "";
					}
				}
			 });
		 form.on('select(getFlag11Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt11').removeAttr('readonly');
						$('#flagInpt11').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt11').attr('readonly',true);
						$('#flagInpt11').addClass('bnone');
						$scope.itemUpdate.numberHalfYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag12Update)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
					if(event.value == 'Y'){
						$('#flagInpt12').removeAttr('readonly');
						$('#flagInpt12').removeClass('bnone');
					}else if(event.value == 'N'){
						$('#flagInpt12').attr('readonly',true);
						$('#flagInpt12').addClass('bnone');
						$scope.itemUpdate.numberYearTrans = "";
					}
				}
			 });
		 form.on('select(getFlag13Update)',function(event){
			if(event.value){	
			 //额度节点下拉列表框
				if(event.value == 'Y'){
					$('#flagInpt13').removeAttr('readonly');
					$('#flagInpt13').removeClass('bnone');
				}else if(event.value == 'N'){
					$('#flagInpt13').attr('readonly',true);
					$('#flagInpt13').addClass('bnone');
					$scope.itemUpdate.numberLifeCycleTrans = "";
				}
			}
		 });
	});
});
