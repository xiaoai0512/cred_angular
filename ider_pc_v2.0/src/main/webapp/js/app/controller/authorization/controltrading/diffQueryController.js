'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易管控查询
	webApp.controller('controlDiffListCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaTrad');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.eventList = "";
		$scope.addBtnFlag = false;
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.delBtnFlag = false;
		$scope.selTwoBtnFlag = false;
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
   	   			if($scope.eventList.search('AUS.PM.02.0101') != -1){    //授权场景新增
   					$scope.addBtnFlag = true;
   				}
   				else{
   					$scope.addBtnFlag = false;
   				}
	   	   		if($scope.eventList.search('AUS.PM.02.0102') != -1){    //授权场景查询
   					$scope.selBtnFlag = true;
   				}
   				else{
   					$scope.selBtnFlag = false;
   				}
		   	   	if($scope.eventList.search('AUS.PM.02.0103') != -1){    //授权场景修改
   					$scope.updBtnFlag = true;
   				}
   				else{
   					$scope.updBtnFlag = false;
   				}
	   	   		if($scope.eventList.search('AUS.PM.02.0103') != -1){    //授权场景删除
   					$scope.delBtnFlag = true;
   				}
   				else{
   					$scope.delBtnFlag = false;
   				}
		   	   	if($scope.eventList.search('AUS.PM.02.0002') != -1){    //授权场景-场景识别查询
   					$scope.selTwoBtnFlag = true;
   				}
   				else{
   					$scope.selTwoBtnFlag = false;
   				}
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
		 $scope.contrlSceneArray = {};
			$scope.getCreditNodeList1 = function (event){
				if($scope.operationMode){
					if($scope.differentType){
						//根据 运营模式查询 额度节点列表
			    		$scope.params ={
			    				"authDataSynFlag":'1',
			    				"operationMode":$scope.operationMode,
						        "differentType":$scope.differentType
			    		};		
			    		jfRest.request('diffQueryb','query',$scope.params).then(function(data1) {
			    			if(data1.returnCode == "000000"){
			    				if(data1.returnData.rows.length >0){
			    					$("#search_width1").attr("style","display: block;");
					        		$scope.contrlSceneArray = $scope.builder.option(data1.returnData.rows, 'contrlSceneCode','contrlSceneDesc');
					        		$timeout(function(){
					        			Tansun.plugins.render('select');
									});				        		
					        	}		    				
			    			};    					    			
			    		});
					}else{
						//根据 运营模式查询 额度节点列表
			    		$scope.params ={
			    				"authDataSynFlag":'1',
			    				"operationMode":$scope.operationMode,
						        "differentType":"0"
			    		};		
			    		jfRest.request('diffQueryb','query',$scope.params).then(function(data1) {
			    			if(data1.returnCode == "000000"){
			    				if(data1.returnData.rows.length >0){
			    					$("#search_width1").attr("style","display: block;");
					        		$scope.contrlSceneArray = $scope.builder.option(data1.returnData.rows, 'contrlSceneCode','contrlSceneDesc');
					        		$timeout(function(){
					        			Tansun.plugins.render('select');
									});				        		
					        	}		    				
			    			};    					    			
			    		});
					}
				}else{
					jfLayer.alert(T.T('SQH1700121'));
					return;
				}
			};
		 //联动验证
		 $scope.creditNodeNoArrayAdd = {};
		 var form = layui.form;
		 form.on('select(operationModeNe)',function(event){
				if(event.value){	
				 //额度节点下拉列表框
				 $scope.creditNodeNoArrayAdd = {
						 type:"dynamicDesc", 
						 param:{
					       "creditNodeTyp":"B",
					       "authDataSynFlag":"1",
					       operationMode:event.value
				        },
				        text:"creditNodeNo",
				        desc:"creditDesc",
				        value:"creditNodeNo",
				        resource : 'quotatree.queryList',
				        callback:function(data){
			        }
		       }
		}
		 });
		//证件类型
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
		//产品
		 $scope.proArray ={ 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"productDesc",
		        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"proObject.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		$scope.isCusListNo = false;
		$scope.isExtListNo = false;
		$scope.isrisListNo = false;
		$scope.isProNo = false;
		var form = layui.form;
		form.on('select(getDifferentType)',function(event){
			if($scope.differentType == "1"){
				$scope.isCusListNo = false;
	  			$scope.isExtListNo = false;
	  			$scope.isrisListNo = true;
	  			$scope.isProNo = false;
	  			$scope.idTypeList = "";
	  			$scope.idNumberList = "";
	  			$scope.externalIdentificationNoList = "";
	  			$scope.projectCode = "";
			}
			else if($scope.differentType == "2"){
				$scope.isCusListNo = true;
	  			$scope.isExtListNo = false;
	  			$scope.isrisListNo = false;
	  			$scope.isProNo = false;
	  			$scope.riskLevelList = "";
	  			$scope.externalIdentificationNoList = "";
	  			$scope.projectCode = "";
			}else if($scope.differentType == "3"){
				$scope.isCusListNo = false;
	  			$scope.isExtListNo = true;
	  			$scope.isrisListNo = false;
	  			$scope.isProNo = false;
	  			$scope.idTypeList = "";
	  			$scope.idNumberList = "";
	  			$scope.riskLevelList = "";
	  			$scope.projectCode = "";
			}else if($scope.differentType == "4"){
				$scope.isCusListNo = false;
	  			$scope.isExtListNo = false;
	  			$scope.isrisListNo = false;
	  			$scope.isProNo = true;
	  			$scope.idTypeList = "";
	  			$scope.idNumberList = "";
	  			$scope.riskLevelList = "";
	  			$scope.externalIdentificationNoList = "";
			}else{
				$scope.isCusListNo = false;
	  			$scope.isExtListNo = false;
	  			$scope.isrisListNo = false;
	  			$scope.isProNo = false;
	  			$scope.idTypeList = "";
	  			$scope.idNumberList = "";
	  			$scope.riskLevelList = "";
	  			$scope.projectCode = "";
	  			$scope.externalIdentificationNoList = "";
			}
		});
		$scope.isShowa = false;
		$scope.isShowb = false;
   		//交易管控查询
		$scope.itemLista = {
			params : $scope.queryParam = {
				authDataSynFlag:"1",
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery:false,
			resource : 'diffQuerya.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_differentType','dic_ZorO'],//查找数据字典所需参数
			transDict : ['differentType_differentTypeDesc','independentFlag_independentFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//交易管控查询
		$scope.itemListb = {
			params : $scope.queryParam = {
				pageSize:10,
				indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery:false,
			resource : 'diffQueryb.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_differentType','dic_ZorO'],//查找数据字典所需参数
			transDict : ['differentType_differentTypeDesc','independentFlag_independentFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$rootScope.selIdType = "";
		$rootScope.selIdNum = "";
		$rootScope.selDifferentCode = "";
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.operationMode){
				if(!$scope.differentType){
					$scope.differentType = '0';
				}
				if($scope.differentType == '1'){
						$rootScope.selIdType = "";
						$rootScope.selIdNum = "";
						$rootScope.selDifferentCode = "";
						$scope.itemListb.params.differentType = $scope.differentType;
						$scope.itemListb.params.differentCode = $scope.riskLevelList;
						$scope.itemListb.params.operationMode = $scope.operationMode;
						$scope.itemListb.params.creditNodeNo = $scope.creditNodeNo;
						$scope.itemListb.params.contrlSceneCode = $scope.contrlSceneType;
						delete $scope.itemListb.params['idNumber'];
						delete $scope.itemListb.params['idType'];
						$scope.itemListb.search();
						$scope.isShowa = false;
			   			$scope.isShowb = true;
				}else if($scope.differentType == '4'){
						$rootScope.selIdType = "";
						$rootScope.selIdNum = "";
						$rootScope.selDifferentCode = "";
						$scope.itemListb.params.differentType = $scope.differentType;
						$scope.itemListb.params.differentCode = $scope.projectCode;
						$scope.itemListb.params.operationMode = $scope.operationMode;
						$scope.itemListb.params.creditNodeNo = $scope.creditNodeNo;
						$scope.itemListb.params.contrlSceneCode = $scope.contrlSceneType;
						delete $scope.itemListb.params['idNumber'];
						delete $scope.itemListb.params['idType'];
						$scope.itemListb.search();
						$scope.isShowa = false;
			   			$scope.isShowb = true;
				}else if($scope.differentType == '2'){
					if($scope.idNumberList && $scope.idTypeList){
						$rootScope.selIdType = $scope.idTypeList;
						$rootScope.selIdNum = $scope.idNumberList;
						$rootScope.selDifferentCode = "";
						$scope.itemLista.params.differentType = $scope.differentType;
						$scope.itemLista.params.idType = $scope.idTypeList;
						$scope.itemLista.params.idNumber = $scope.idNumberList;
						$scope.itemLista.params.operationMode = $scope.operationMode;
						$scope.itemLista.params.creditNodeNo = $scope.creditNodeNo;
						$scope.itemLista.params.contrlSceneCode = $scope.contrlSceneType;
						$scope.itemLista.params.differentCode = '';
						$scope.itemLista.search();
						$scope.isShowa = true;
			   			$scope.isShowb = false;
					}else{
						jfLayer.alert(T.T('SQJ1700031'));//T.T('SQJ1700030')"请输入差异化证件类型及证件号"
					}
				}else if($scope.differentType == '3'){
					if($scope.externalIdentificationNoList){
						$rootScope.selIdType = "";
						$rootScope.selIdNum = "";
						$rootScope.selDifferentCode = $scope.externalIdentificationNoList;
						$scope.itemLista.params.differentType = $scope.differentType;
						$scope.itemLista.params.differentCode = $scope.externalIdentificationNoList;
						$scope.itemLista.params.externalIdentificationNo = $scope.externalIdentificationNoList;
						$scope.itemLista.params.operationMode = $scope.operationMode;
						$scope.itemLista.params.creditNodeNo = $scope.creditNodeNo;
						$scope.itemLista.params.contrlSceneCode = $scope.contrlSceneType;
						delete $scope.itemLista.params['idNumber'];
						delete $scope.itemLista.params['idType'];
						$scope.itemLista.search();
						$scope.isShowa = true;
			   			$scope.isShowb = false;
					}else{
						jfLayer.alert(T.T('SQJ1700032'));   //"请输入差异化外部识别号"
					}
				}else if($scope.differentType == '0'){
					$rootScope.selIdType = "";
					$rootScope.selIdNum = "";
					$rootScope.selDifferentCode = "";
					$scope.itemListb.params.differentType = $scope.differentType;
					$scope.itemListb.params.differentCode = '';
					$scope.itemListb.params.operationMode = $scope.operationMode;
					$scope.itemListb.params.creditNodeNo = $scope.creditNodeNo;
					$scope.itemListb.params.contrlSceneCode = $scope.contrlSceneType;
					delete $scope.itemListb.params['idNumber'];
					delete $scope.itemListb.params['idType'];
					$scope.itemListb.search();
					$scope.isShowa = false;
		   			$scope.isShowb = true;
				}
			}else{
				$scope.isShow = false;
				jfLayer.fail(T.T('SQJ1700033')); //SQJ1700033 "请选择营运模式！"
			}
		}
		//查询详情事件
		$scope.selectList = function(event) {
			$scope.infoitem = {};
			// 页面弹出框事件(弹出页面)
			$scope.infoitem = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/controlDiffInfo.html', $scope.infoitem, {
				title : T.T('SQJ1700012'),
				buttons : [ T.T('F00012')],
				size : [ '1050px', '580px' ],
				callbacks : [ ]
			});
		};
		//复制事件
		$scope.copyListCon = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.copyitem = {};
			$scope.copyitem = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/controlDiffCopy.html', $scope.copyitem, {
				title : T.T('SQJ1700013'),
				buttons : [T.T('F00107'),T.T('F00108')],
				size : [ '1050px', '580px' ],
				callbacks : [$scope.saveDiffCopy]
			});
		};
		//复制交易管控
		$scope.saveDiffCopy = function(result){
			$scope.diffCopy = {};
			$scope.diffCopy = $.parseJSON(JSON.stringify(result.scope.copyList));
			$scope.diffCopy.startDate = $("#DIFF_start_Copy").val();
			$scope.diffCopy.endDate = $("#DIFF_end_Copy").val();
			$scope.diffCopy.startTime = $("#DIFF_startTime_Copy").val();
			$scope.diffCopy.endTime = $("#DIFF_endTime_Copy").val();
			$scope.diffCopy.flag = '2';
			$scope.diffCopy.differentType = result.scope.differentTypeC;
			$scope.diffCopy.pnListCheckFlag = result.scope.pnListCheckFlagC; 
			$scope.diffCopy.transLimitLev = result.scope.transLimitLevC;
			$scope.diffCopy.transLimitCurrCode = result.scope.transLimitCurrCodeC;
			$scope.diffCopy.listDifferentFlag = result.scope.listDifferentFlagC;
			$scope.diffCopy.transDifferentFlag = result.scope.transDifferentFlagC;
			$scope.diffCopy.overpayContrlFlag = result.scope.overpayContrlFlagC;
			if($scope.diffCopy.differentType == '0'){
				if($scope.diffCopy.pnListCheckFlag){
					if($scope.diffCopy.pnListCheckFlag == "P" || $scope.diffCopy.pnListCheckFlag == "N"){
						if(!$scope.diffCopy.listCheckType){
							jfLayer.fail(T.T('SQJ1700035'));
							return;
						}
					}
				}else{
					jfLayer.fail(T.T('SQJ1700058'));
					return;
				}
			}
			if($scope.diffCopy.differentType == '0'){
				if($scope.diffCopy.transLimitLev){
					if($scope.diffCopy.transLimitLev != "N"){
						if(!$scope.diffCopy.transLimitCurrCode){
							jfLayer.fail(T.T('SQJ1700037'));
							return;
						}
					}
				}else{
					jfLayer.fail(T.T('SQJ1700059'));
					return;
				}
			};
			if($scope.diffCopy.differentType == '1' || $scope.diffCopy.differentType == '2' || $scope.diffCopy.differentType == '3' || $scope.diffCopy.differentType == '4'){
				if($scope.diffCopy.listDifferentFlag){
					if($scope.diffCopy.listDifferentFlag == 'Y'){
						if($scope.diffCopy.pnListCheckFlag){
							if($scope.diffCopy.pnListCheckFlag == "P" || $scope.diffCopy.pnListCheckFlag == "N"){
								if(!$scope.diffCopy.listCheckType){
									jfLayer.fail(T.T('SQJ1700035'));
									return;
								}
							}
						}else{
							jfLayer.fail(T.T('SQJ1700058'));
							return;
						}
					}
				}else{
					jfLayer.fail(T.T('SQJ1700062'));
					return;
				}
			}
			if($scope.diffCopy.differentType == '1' || $scope.diffCopy.differentType == '2' || $scope.diffCopy.differentType == '3' || $scope.diffCopy.differentType == '4'){
				if($scope.diffCopy.transDifferentFlag){
					if($scope.diffCopy.transDifferentFlag == 'Y'){
						if($scope.diffCopy.transLimitLev){
							if($scope.diffCopy.transLimitLev != "N"){
								if(!$scope.diffCopy.transLimitCurrCode){
									jfLayer.fail(T.T('SQJ1700037'));
									return;
								}
							}
						}else{
							jfLayer.fail(T.T('SQJ1700059'));
							return;
						}
					}
				}else{
					jfLayer.fail(T.T('SQJ1700062'));
					return;
				}
			};
			//产品层必须有值
			if(result.scope.isPEmptyCopy){
				if($scope.diffCopy.transLimitLev == 'P'){
					if(!$rootScope.pcopyListTwo || $rootScope.pcopyListTwo.length > 0){
						for(var i=0;i<$rootScope.pcopyListTwo.length;i++){
							if($rootScope.pcopyListTwo[i].limitSingleTransFlag == undefined || $rootScope.pcopyListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700068'));
								return;
							}
						}
						for(var y=0;y<$rootScope.pcopyListTwo.length;y++){
							$rootScope.pcopyListTwo[y].transLimitCode = $scope.diffCopy.contrlSceneCode;
						}
						$scope.diffCopy.productLimitList = $rootScope.pcopyListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700068'));
						return;
					}
				}else{
					$scope.diffCopy.productLimitList = [];
				}
			}else{
				$scope.diffCopy.productLimitList = [];
			}
			//媒介层必须有值
			if(result.scope.isExceEmptyCopy){
				if($scope.diffCopy.transLimitLev == 'B'){
					if(!$rootScope.extercopyListTwo || $rootScope.extercopyListTwo.length > 0){
						for(var i=0;i<$rootScope.extercopyListTwo.length;i++){
							if($rootScope.extercopyListTwo[i].limitSingleTransFlag == undefined || $rootScope.extercopyListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700038'));  //'请设置完整媒介层的交易限制'  SQJ1700038
								return;
							}
						}
						for(var y=0;y<$rootScope.extercopyListTwo.length;y++){
							$rootScope.extercopyListTwo[y].transLimitCode = $scope.diffCopy.contrlSceneCode;
						}
						$scope.diffCopy.mediaLimitList = $rootScope.extercopyListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700038'));
						return;
					}
				}else if($scope.diffCopy.transLimitLev == 'M'){
					if(!$rootScope.extercopyListTwo || $rootScope.extercopyListTwo.length > 0){
						for(var i=0;i<$rootScope.extercopyListTwo.length;i++){
							if($rootScope.extercopyListTwo[i].limitSingleTransFlag == undefined || $rootScope.extercopyListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700038'));
								return;
							}
						}
						for(var y=0;y<$rootScope.extercopyListTwo.length;y++){
							$rootScope.extercopyListTwo[y].transLimitCode = $scope.diffCopy.contrlSceneCode;
						}
						$scope.diffCopy.mediaLimitList = $rootScope.extercopyListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700038'));
						return;
					}
				}else{
					$scope.diffCopy.mediaLimitList = [];
				}
			}else{
				$scope.diffCopy.mediaLimitList = [];
			}
			if(result.scope.isCusEmptyCopy){
				if($scope.diffCopy.transLimitLev == 'B'){
					if(!$rootScope.cuscopyListTwo || $rootScope.cuscopyListTwo.length > 0){
						for(var i=0;i<$rootScope.cuscopyListTwo.length;i++){
							if($rootScope.cuscopyListTwo[i].limitSingleTransFlag == undefined || $rootScope.cuscopyListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700040'));   //'请设置完整客户层的交易限制'
								return;
							}
						}
						for(var y=0;y<$rootScope.cuscopyListTwo.length;y++){
							$rootScope.cuscopyListTwo[y].transLimitCode = $scope.diffCopy.contrlSceneCode;
						}
						$scope.diffCopy.customerLimitList = $rootScope.cuscopyListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700040'));
						return;
					}
				}else if($scope.diffCopy.transLimitLev == 'C'){
					if(!$rootScope.cuscopyListTwo || $rootScope.cuscopyListTwo.length > 0){
						for(var i=0;i<$rootScope.cuscopyListTwo.length;i++){
							if($rootScope.cuscopyListTwo[i].limitSingleTransFlag == undefined || $rootScope.cuscopyListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700040'));
								return;
							}
						}
						for(var y=0;y<$rootScope.cuscopyListTwo.length;y++){
							$rootScope.cuscopyListTwo[y].transLimitCode = $scope.diffCopy.contrlSceneCode;
						}
						$scope.diffCopy.customerLimitList = $rootScope.cuscopyListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700040'));
						return;
					}
				}else{
					$scope.diffCopy.customerLimitList = [];
				}
			}else{
				$scope.diffCopy.customerLimitList = [];
			}
			delete $scope.diffCopy['listDifferentType'];
			delete $scope.diffCopy['transDifferentType'];
			if($scope.diffCopy.differentType == '1'){
				var reg = /^\d{2}$/;
				if (reg.test(result.scope.riskLevelCopy)) {
					$scope.diffCopy.differentCode = result.scope.riskLevelCopy;
					$scope.diffCopy.excpListCode = "";
					delete $scope.diffCopy['idNumber'];
					delete $scope.diffCopy['idType'];
					jfRest.request('diffQueryb', 'save', $scope.diffCopy).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00064'));
		                	$scope.diffCopy = {};
		            		$rootScope.extercopyListTwo = [];
		            		$rootScope.cuscopyListTwo = [];
		            		$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700030'));
					return;
				}
			}else if($scope.diffCopy.differentType == '4'){
				if (result.scope.projectCodeCopy) {
					$scope.diffCopy.differentCode = result.scope.projectCodeCopy;
					$scope.diffCopy.excpListCode = "";
					delete $scope.diffCopy['idNumber'];
					delete $scope.diffCopy['idType'];
					jfRest.request('diffQueryb', 'save', $scope.diffCopy).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00064'));
		                	$scope.diffCopy = {};
		            		$rootScope.extercopyListTwo = [];
		            		$rootScope.cuscopyListTwo = [];
		            		$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert('请选择产品代码');
					return;
				}
			}else if($scope.diffCopy.differentType == '2'){
				if(result.scope.idNumberCopy && result.scope.idTypeCopy){
					$scope.diffCopy.authDataSynFlag = "1";
					$scope.diffCopy.differentCode = '';
					$scope.diffCopy.idNumber = result.scope.idNumberCopy;
					$scope.diffCopy.idType = result.scope.idTypeCopy;
					$scope.diffCopy.excpListCode = "";
					jfRest.request('diffQuerya', 'save', $scope.diffCopy).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00064'));
		                	$scope.diffCopy = {};
		            		$rootScope.extercopyListTwo = [];
		            		$rootScope.cuscopyListTwo = [];
		            		$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700031'));
					return;
				}
			}else if($scope.diffCopy.differentType == '3'){
				if(result.scope.externalIdentificationNoCopy){
					$scope.diffCopy.authDataSynFlag = "1";
					$scope.diffCopy.differentCode = result.scope.externalIdentificationNoCopy;
					$scope.diffCopy.externalIdentificationNo = result.scope.externalIdentificationNoCopy;
					$scope.diffCopy.excpListCode = "";
					delete $scope.diffCopy['idNumber'];
					delete $scope.diffCopy['idType'];
					jfRest.request('diffQuerya', 'save', $scope.diffCopy).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00064'));
		                	$scope.diffCopy = {};
		            		$rootScope.extercopyListTwo = [];
		            		$rootScope.cuscopyListTwo = [];
		            		$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700032'));
					return;
				}
			}else if($scope.diffCopy.differentType == '0'){
				$scope.diffCopy.differentCode = '';
				$scope.diffCopy.excpListCode = $scope.diffCopy.contrlSceneCode;
				delete $scope.diffCopy['idNumber'];
				delete $scope.diffCopy['idType'];
				jfRest.request('diffQueryb', 'save', $scope.diffCopy).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00064'));
	                	$scope.diffCopy = {};
	            		$rootScope.extercopyListTwo = [];
	            		$rootScope.cuscopyListTwo = [];
	            		$scope.seachQuota();
	                	$scope.safeApply();
		    			result.cancel();
	                }
	            });
			}
		};
		//新增事件==========交易管控
		$scope.difftradAdd = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/controlDiffAdd.html', '', {
				title : T.T('SQJ1700016'),
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1050px', '620px' ],
				callbacks : [$scope.saveDiffInfo ]
			});
		};
		//新增交易管控
		$scope.saveDiffInfo = function(result){
			$scope.diffInfoAdd = {};
			$scope.diffInfoAdd = $.parseJSON(JSON.stringify(result.scope.diff));
			$scope.diffInfoAdd.differentType = 0;
			//产品层必须有值
			if($rootScope.isPEmpty){
				if($scope.diffInfoAdd.transLimitLev == 'P'){
					if(!$rootScope.pListTwo || $rootScope.pListTwo.length > 0){
						for(var i=0;i<$rootScope.pListTwo.length;i++){
							if(!$rootScope.pListTwo[i].limitSingleTransFlag == undefined || $rootScope.pListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700068'));
								return;
							}
						}
					}else if(!$rootScope.pListTwo || $rootScope.pListTwo.length == 0){
						jfLayer.fail(T.T('SQJ1700068'));
						return;
					}else{
						$scope.diffInfoAdd.productLimitList = [];
						$scope.diffInfoAdd.productLimitList = $rootScope.pListTwo;
					}
					$scope.diffInfoAdd.productLimitList = [];
					$scope.diffInfoAdd.productLimitList = $rootScope.pListTwo;
				}else{
					$scope.diffInfoAdd.productLimitList = [];
				}
			}
			//媒介层必须有值
			if($rootScope.isExceEmpty){
				if($scope.diffInfoAdd.transLimitLev == 'B'){
					if(!$rootScope.exterListTwo || $rootScope.exterListTwo.length > 0){
						for(var i=0;i<$rootScope.exterListTwo.length;i++){
							if(!$rootScope.exterListTwo[i].limitSingleTransFlag == undefined || $rootScope.exterListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700038'));
								return;
							}
						}
					}else if(!$rootScope.exterListTwo || $rootScope.exterListTwo.length == 0){
						jfLayer.fail(T.T('SQJ1700038'));
						return;
					}else{
						$scope.diffInfoAdd.mediaLimitList = [];
						$scope.diffInfoAdd.mediaLimitList = $rootScope.exterListTwo;
					}
					$scope.diffInfoAdd.mediaLimitList = [];
					$scope.diffInfoAdd.mediaLimitList = $rootScope.exterListTwo;
				}else if($scope.diffInfoAdd.transLimitLev == 'M'){
					if(!$rootScope.exterListTwo || $rootScope.exterListTwo.length > 0){
						for(var i=0;i<$rootScope.exterListTwo.length;i++){
							if(!$rootScope.exterListTwo[i].limitSingleTransFlag == undefined || $rootScope.exterListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700038'));
								return;
							}
						}
					}else if(!$rootScope.exterListTwo || $rootScope.exterListTwo.length == 0){
						jfLayer.fail(T.T('SQJ1700038'));
						return;
					}else{
						$scope.diffInfoAdd.mediaLimitList = [];
						$scope.diffInfoAdd.mediaLimitList = $rootScope.exterListTwo;
					}
					$scope.diffInfoAdd.mediaLimitList = [];
					$scope.diffInfoAdd.mediaLimitList = $rootScope.exterListTwo;
				}else{
					$scope.diffInfoAdd.mediaLimitList = [];
				}
			}else{
				$scope.diffInfoAdd.mediaLimitList = [];
			}
			if($rootScope.isCusEmpty){
				if($scope.diffInfoAdd.transLimitLev == 'B'){
					if(!$rootScope.cusListTwo || $rootScope.cusListTwo.length > 0){
						for(var i=0;i<$rootScope.cusListTwo.length;i++){
							if(!$rootScope.cusListTwo[i].limitSingleTransFlag == undefined || $rootScope.cusListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700041'));
								return;
							}
						}
					}else if(!$rootScope.cusListTwo || $rootScope.cusListTwo.length == 0){
						jfLayer.fail(T.T('SQJ1700041'));
						return;
					}else{
						$scope.diffInfoAdd.customerLimitList = [];
						$scope.diffInfoAdd.customerLimitList = $rootScope.cusListTwo;
					}
					$scope.diffInfoAdd.customerLimitList = [];
					$scope.diffInfoAdd.customerLimitList = $rootScope.cusListTwo;
				}else if($scope.diffInfoAdd.transLimitLev == 'C'){
					if(!$rootScope.cusListTwo || $rootScope.cusListTwo.length > 0){
						for(var i=0;i<$rootScope.cusListTwo.length;i++){
							if(!$rootScope.cusListTwo[i].limitSingleTransFlag == undefined || $rootScope.cusListTwo[i].limitSingleTransFlag == null)
							{
								jfLayer.fail(T.T('SQJ1700041'));
								return;
							}
						}
					}else if(!$rootScope.cusListTwo || $rootScope.cusListTwo.length == 0){
						jfLayer.fail(T.T('SQJ1700041'));
						return;
					}else{
						$scope.diffInfoAdd.customerLimitList = [];
						$scope.diffInfoAdd.customerLimitList = $rootScope.cusListTwo;
					}
					$scope.diffInfoAdd.customerLimitList = [];
					$scope.diffInfoAdd.customerLimitList = $rootScope.cusListTwo;
				}else{
					$scope.diffInfoAdd.customerLimitList = [];
				}
			}else{
				$scope.diffInfoAdd.customerLimitList = [];
			}
			$scope.diffInfoAdd.excpListCode = $scope.diffInfoAdd.contrlSceneCode;
			$scope.diffInfoAdd.differentCode = '';
			delete $scope.diffInfoAdd['idNumber'];
			delete $scope.diffInfoAdd['idType'];
			$scope.diffInfoAdd.listDifferentFlag = 'N';
			$scope.diffInfoAdd.transDifferentFlag = 'N';
			if($scope.diffInfoAdd.transLimitLev){
				jfRest.request('diffQueryb', 'save', $scope.diffInfoAdd).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00058'));
	                	$scope.diffInfoAdd = {};
	                	$scope.seachQuota();
	                	$scope.safeApply();
		    			result.cancel();
	                }
	            });
			}else{
				jfLayer.alert(T.T('SQJ1700059'));
			}
		}
		//修改事件==========交易管控
		$scope.updateDiff = function(event) {
			$scope.updateitem = {};
			$scope.updateitem = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/controlDiffUpdate.html', $scope.updateitem, {
				title : T.T('F00087'),   //维护信息  
				buttons : [ T.T('F00031'),T.T('F00012')],
				size : [ '1000px', '580px' ],
				callbacks : [$scope.sureUpdateInfo ]
			});
		};
		//维护交易管控
		$scope.sureUpdateInfo = function(result){
			$scope.diffInfoUpdate = {};
			$scope.diffInfoUpdate = $.parseJSON(JSON.stringify(result.scope.updateList));
			$scope.diffInfoUpdate.startDate = $("#DIFF_start_Update").val();
			$scope.diffInfoUpdate.endDate = $("#DIFF_end_Update").val();
			$scope.diffInfoUpdate.startTime = $("#DIFF_startTime_Update").val();
			$scope.diffInfoUpdate.endTime = $("#DIFF_endTime_Update").val();
			$scope.diffInfoUpdate.flag = '2';
			$scope.diffInfoUpdate.differentType = result.scope.differentTypeU;
			$scope.diffInfoUpdate.pnListCheckFlag = result.scope.pnListCheckFlagU; 
			$scope.diffInfoUpdate.transLimitLev = result.scope.transLimitLevU;
			$scope.diffInfoUpdate.transLimitCurrCode = result.scope.transLimitCurrCodeU;
			$scope.diffInfoUpdate.listDifferentFlag = result.scope.listDifferentFlagU;
			$scope.diffInfoUpdate.transDifferentFlag = result.scope.transDifferentFlagU;
			$scope.diffInfoUpdate.overpayContrlFlag = result.scope.overpayContrlFlagU;
			$scope.diffInfoUpdate.independentFlag = result.scope.independentFlagU;
			$scope.diffInfoUpdate.contRelFlag = result.scope.contRelFlagU;
			$scope.diffInfoUpdate.controlSceneCodeRel = result.scope.controlSceneCodeRelU;
			$scope.diffInfoUpdate.differentFlag = result.scope.differentFlagU;
			if($scope.diffInfoUpdate.differentType == '0'){
				if($scope.diffInfoUpdate.pnListCheckFlag){
					if($scope.diffInfoUpdate.pnListCheckFlag == "P" || $scope.diffInfoUpdate.pnListCheckFlag == "N"){
						if(!$scope.diffInfoUpdate.listCheckType){
							jfLayer.fail(T.T('SQJ1700035'));
							return;
						}
					}
				}else{
					jfLayer.fail(T.T('SQJ1700058'));
					return;
				}
			}
			if($scope.diffInfoUpdate.differentType == '0'){
				if($scope.diffInfoUpdate.transLimitLev){
					if($scope.diffInfoUpdate.transLimitLev != "N"){
						if(!$scope.diffInfoUpdate.transLimitCurrCode){
							jfLayer.fail(T.T('SQJ1700037'));
							return;
						}
					}
				}else{
					jfLayer.fail(T.T('SQJ1700059'));
					return;
				}
			};
			if($scope.diffInfoUpdate.differentType == '1' || $scope.diffInfoUpdate.differentType == '2' || $scope.diffInfoUpdate.differentType == '3' || $scope.diffInfoUpdate.differentType == '4'){
				if($scope.diffInfoUpdate.listDifferentFlag == 'Y'){
					if($scope.diffInfoUpdate.pnListCheckFlag){
						if($scope.diffInfoUpdate.pnListCheckFlag == "P" || $scope.diffInfoUpdate.pnListCheckFlag == "N"){
							if(!$scope.diffInfoUpdate.listCheckType){
								jfLayer.fail(T.T('SQJ1700035'));
								return;
							}
						}
					}else{
						jfLayer.fail(T.T('SQJ1700058'));
						return;
					}
				}
			}
			if($scope.diffInfoUpdate.differentType == '1' || $scope.diffInfoUpdate.differentType == '2' || $scope.diffInfoUpdate.differentType == '3' || $scope.diffInfoUpdate.differentType == '4'){
				if($scope.diffInfoUpdate.transDifferentFlag == 'Y'){
					if($scope.diffInfoUpdate.transLimitLev){
						if($scope.diffInfoUpdate.transLimitLev != "N"){
							if(!$scope.diffInfoUpdate.transLimitCurrCode){
								jfLayer.fail(T.T('SQJ1700037'));
								return;
							}
						}
					}else{
						jfLayer.fail(T.T('SQJ1700059'));
						return;
					}
				}
			};
			//产品层必须有值
			if(result.scope.isPEmptyUpdate){
				if($scope.diffInfoUpdate.transLimitLev == 'P'){
					if(!$rootScope.pUpdateListTwo || $rootScope.pUpdateListTwo.length > 0){
						for(var i=0;i<$rootScope.pUpdateListTwo.length;i++){
							if($rootScope.pUpdateListTwo[i].limitSingleTransFlag == undefined || $rootScope.pUpdateListTwo[i].limitSingleTransFlag == null){
								jfLayer.fail(T.T('SQJ1700068'));
								return;
							}
						}
						for(var y=0;y<$rootScope.pUpdateListTwo.length;y++){
							$rootScope.pUpdateListTwo[y].transLimitCode = $scope.diffInfoUpdate.contrlSceneCode;
						}
						$scope.diffInfoUpdate.productLimitList = $rootScope.pUpdateListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700068'));
						return;
					}
				}else{
					$scope.diffInfoUpdate.productLimitList = [];
				}
			}else{
				$scope.diffInfoUpdate.productLimitList = [];
			}
			//媒介层必须有值
			if(result.scope.isExceEmptyUpdate){
				if($scope.diffInfoUpdate.transLimitLev == 'B' || $scope.diffInfoUpdate.transLimitLev == 'M'){
					if(!$rootScope.exterUpdateListTwo || $rootScope.exterUpdateListTwo.length > 0){
						for(var i=0;i<$rootScope.exterUpdateListTwo.length;i++){
							if($rootScope.exterUpdateListTwo[i].limitSingleTransFlag == undefined || $rootScope.exterUpdateListTwo[i].limitSingleTransFlag == null){
								jfLayer.fail(T.T('SQJ1700038'));
								return;
							}
						}
						for(var y=0;y<$rootScope.exterUpdateListTwo.length;y++){
							$rootScope.exterUpdateListTwo[y].transLimitCode = $scope.diffInfoUpdate.contrlSceneCode;
						}
						$scope.diffInfoUpdate.mediaLimitList = $rootScope.exterUpdateListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700038'));
						return;
					}
				}else{
					$scope.diffInfoUpdate.mediaLimitList = [];
				}
			}else{
				$scope.diffInfoUpdate.mediaLimitList = [];
			}
			if(result.scope.isCusEmptyUpdate){
				if($scope.diffInfoUpdate.transLimitLev == 'B' || $scope.diffInfoUpdate.transLimitLev == 'C'){
					if(!$rootScope.cusUpdateListTwo || $rootScope.cusUpdateListTwo.length > 0){
						for(var i=0;i<$rootScope.cusUpdateListTwo.length;i++){
							if($rootScope.cusUpdateListTwo[i].limitSingleTransFlag == undefined || $rootScope.cusUpdateListTwo[i].limitSingleTransFlag == null){
								jfLayer.fail(T.T('SQJ1700040'));
								return;
							}
						}
						for(var y=0;y<$rootScope.cusUpdateListTwo.length;y++){
							$rootScope.cusUpdateListTwo[y].transLimitCode = $scope.diffInfoUpdate.contrlSceneCode;
						}
						$scope.diffInfoUpdate.customerLimitList = $rootScope.cusUpdateListTwo;
					}else{
						jfLayer.fail(T.T('SQJ1700040'));
						return;
					}
				}else{
					$scope.diffInfoUpdate.customerLimitList = [];
				}
			}else{
				$scope.diffInfoUpdate.customerLimitList = [];
			}
			delete $scope.diffInfoUpdate['listDifferentType'];
			delete $scope.diffInfoUpdate['transDifferentType'];
			if($scope.diffInfoUpdate.differentType == '1'){
				var reg = /^\d{2}$/;
				if (reg.test(result.scope.riskLevelUpdate)) {
					$scope.diffInfoUpdate.differentCode = result.scope.riskLevelUpdate;
					$scope.diffInfoUpdate.excpListCode = "";
					delete $scope.diffInfoUpdate['idNumber'];
					delete $scope.diffInfoUpdate['idType'];
					jfRest.request('diffQueryb', 'updateDiffPage', $scope.diffInfoUpdate).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00022'));
		                	$scope.diffInfoUpdate = {};
		                	$rootScope.exterUpdateListTwo = [];
		                	$rootScope.cusUpdateListTwo = [];
		                	$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700030'));
					return;
				}
			}else if($scope.diffInfoUpdate.differentType == '4'){
				if (result.scope.projectCodeUpdate) {
					$scope.diffInfoUpdate.differentCode = result.scope.projectCodeUpdate;
					$scope.diffInfoUpdate.excpListCode = "";
					delete $scope.diffInfoUpdate['idNumber'];
					delete $scope.diffInfoUpdate['idType'];
					jfRest.request('diffQueryb', 'updateDiffPage', $scope.diffInfoUpdate).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00022'));
		                	$scope.diffInfoUpdate = {};
		                	$rootScope.exterUpdateListTwo = [];
		                	$rootScope.cusUpdateListTwo = [];
		                	$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700055'));
					return;
				}
			}else if($scope.diffInfoUpdate.differentType == '2'){
				if(result.scope.idNumberUpdate && result.scope.idTypeUpdate){
					$scope.diffInfoUpdate.authDataSynFlag = "1";
					$scope.diffInfoUpdate.differentCode = '';
					$scope.diffInfoUpdate.idNumber = $rootScope.selIdNum;
					$scope.diffInfoUpdate.idType = $rootScope.selIdType;
					$scope.diffInfoUpdate.excpListCode = "";
					$scope.diffInfoUpdate.differentCode = result.scope.updateList.differentCode;
					jfRest.request('diffQuerya', 'updateDiffPage', $scope.diffInfoUpdate).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00022'));
		                	$scope.diffInfoUpdate = {};
		                	$rootScope.exterUpdateListTwo = [];
		                	$rootScope.cusUpdateListTwo = [];
		                	$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700031'));
					return;
				}
			}else if($scope.diffInfoUpdate.differentType == '3'){
				if(result.scope.externalIdentificationNoUpdate){
					$scope.diffInfoUpdate.authDataSynFlag = "1";
					$scope.diffInfoUpdate.excpListCode = "";
					$scope.diffInfoUpdate.differentCode = result.scope.updateList.differentCode;
					$scope.diffInfoUpdate.externalIdentificationNo = $rootScope.selDifferentCode;
					delete $scope.diffInfoUpdate['idNumber'];
					delete $scope.diffInfoUpdate['idType'];
					jfRest.request('diffQuerya', 'updateDiffPage', $scope.diffInfoUpdate).then(function(data) {
		                if (data.returnCode == '000000') {
		                	jfLayer.success(T.T('F00022'));
		                	$scope.diffInfoUpdate = {};
		                	$rootScope.exterUpdateListTwo = [];
		                	$rootScope.cusUpdateListTwo = [];
		                	$scope.seachQuota();
		                	$scope.safeApply();
			    			result.cancel();
		                }
		            });
				}else{
					jfLayer.alert(T.T('SQJ1700032'));
					return;
				}
			}else if($scope.diffInfoUpdate.differentType == '0'){
				$scope.diffInfoUpdate.differentCode = '';
				$scope.diffInfoUpdate.excpListCode = $scope.diffInfoUpdate.contrlSceneCode;
				delete $scope.diffInfoUpdate['idNumber'];
				delete $scope.diffInfoUpdate['idType'];
				jfRest.request('diffQueryb', 'updateDiffPage', $scope.diffInfoUpdate).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00022'));
	                	$scope.diffInfoUpdate = {};
	                	$rootScope.exterUpdateListTwo = [];
	                	$rootScope.cusUpdateListTwo = [];
	                	$scope.seachQuota();
	                	$scope.safeApply();
		    			result.cancel();
	                }
	            });
			}
		};
		//删除事件
		$scope.delDiff = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.infoitem = {};
			$scope.infoitem = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/controlDiffInfo.html', $scope.infoitem, {
				title : T.T('SQJ1700018'),
				buttons : [T.T('F00016'), T.T('F00108')],
				size : [ '1000px', '580px' ],
				callbacks : [$scope.delDiffSure ]
			});
		};
		//删除事件
		$scope.delDiffSure = function(result) {
			$scope.delItem = {};
			$scope.delItem = result.scope.infoitem;
			jfLayer.confirm(T.T('SQJ1700020'),function() {
				$scope.delItem.flag = "1";
				delete $scope.delItem['listDifferentType'];
				delete $scope.delItem['transDifferentType'];
				if($scope.delItem.differentType == '1'){
 					jfRest.request('diffQueryb', 'updateDiffPage', $scope.delItem).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.alert(T.T('F00037'));
							$scope.delItem = {};
							$scope.safeApply();
							result.cancel();
							$scope.seachQuota();
						}
					});
				}else if($scope.delItem.differentType == '4'){
 					jfRest.request('diffQueryb', 'updateDiffPage', $scope.delItem).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.alert(T.T('F00037'));
							$scope.delItem = {};
							$scope.safeApply();
							result.cancel();
							$scope.seachQuota();
						}
						else{
							var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00038');
							jfLayer.fail(returnMsg);
		                }
					});
				}else if($scope.delItem.differentType == '2'){
 					$scope.delItem.authDataSynFlag = "1";
 					$scope.delItem.idType = $rootScope.selIdType;
 					$scope.delItem.idNumber = $rootScope.selIdNum;
	 				jfRest.request('diffQuerya', 'updateDiffPage', $scope.delItem).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.alert(T.T('F00037'));
							$scope.delItem = {};
							$scope.safeApply();
							result.cancel();
							$scope.seachQuota();
						}
					});
				}else if($scope.delItem.differentType == '3'){
					$scope.delItem.externalIdentificationNo = $rootScope.selDifferentCode;
 					$scope.delItem.authDataSynFlag = "1";
	 				jfRest.request('diffQuerya', 'updateDiffPage', $scope.delItem).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.alert(T.T('F00037'));
							$scope.delItem = {};
							$scope.safeApply();
							result.cancel();
							$scope.seachQuota();
						}
					});
				}else if($scope.delItem.differentType == '0'){
					$scope.paramsId = {
							 contrlSceneCode:$scope.delItem.contrlSceneCode
					 };
 					jfRest.request('diffQueryb', 'updateDiffPage', $scope.delItem).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.alert(T.T('F00037'));
							$scope.delItem = {};
							$scope.safeApply();
							result.cancel();
							$scope.seachQuota();
						}
					});
				}
			},function() {});
		};
		//场景识别查询
		$scope.authTradInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.itemscen = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/controlTradList.html', $scope.itemscen, {
				title : T.T('SQJ1700021'),
				buttons : [ T.T('F00012')],
				size : [ '1000px', '580px' ],
				callbacks : []
			});
		};
	});
	//查询详情
	webApp.controller('controlDiffViewCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.infoList = {};
		$scope.infoList = $scope.infoitem;
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArrayInfo ={ 
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
	        	$scope.operationModeUInfo = $scope.infoitem.operationMode;
	        }
	    };
		//允许差异化
		 $scope.OCFalgArray05 ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.differentFlagI = $scope.infoitem.differentFlag;
	        }
		};
		//差异化类型
	        $scope.difFlagTypeArray = [{name : T.T('SQH1700115') ,id : 'C'},
	                                   {name : T.T('SQH1700116') ,id : 'M'},
	                                   {name : T.T('SQH1700117') ,id : 'P'},
	                                   {name : T.T('SQH1700118') ,id : 'R'}];
		 //额度节点代码下拉框
		 $scope.creditNodeNoArrayInfo = {
				 type:"dynamicDesc",
				 param:{
			      "operationMode":$scope.infoitem.operationMode,
			      "creditNodeTyp":"B",
			       "authDataSynFlag":"1"
		         },
				 text:"creditNodeNo",
			     desc:"creditDesc",
			     value:"creditNodeNo",
			     resource : 'quotatree.queryList',
			     callback:function(data){
		        	 $scope.creditNodeNoUInfo =$scope.infoitem.creditNodeNo;
		       }
		 };
			//自定义下拉框--------限制币种======只有人民币
			$scope.cur156Array = {};
			 $scope.params = {
				 corporationEntityNo:$scope.corporationId,
				 requestType:"1",
				 resultType:"1"
			 };
			 jfRest.request('legalEntity', 'query', $scope.params).then(function(data) {
				 $scope.cur156Array = data.returnData.rows;
			 });
			//自定义下拉框--------独立 标识
			 $scope.independentArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_ZorO",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.independentFlagInfo = $scope.infoList.independentFlag;
				        }
					};
			//自定义下拉框--------关联管控标识
			 $scope.OCFalgArraycr ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_isYorN",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.contRelFlagInfo = $scope.infoList.contRelFlag;
				        }
					};
			 $scope.isControlSceneInfo = false;
			 $scope.controlSceneInfoArr = {};
			 if($scope.infoList.contRelFlag == 'Y'){
				 $scope.isControlSceneInfo = true;
				//管控场景下拉列表框
				 $scope.controlSceneInfoArr = {
						 type:"dynamicDesc", 
						 param:{
					       authDataSynFlag:"1",
					       differentType:'0',
					       operationMode:$scope.infoitem.operationMode
				        },
				        text:"contrlSceneCode",
				        desc:"contrlSceneDesc",
				        value:"contrlSceneCode",
				        resource : 'diffQueryb.query',
				        callback:function(data){
				        	$scope.controlSceneCodeRelInfo = $scope.infoList.controlSceneCodeRel;
			        }
		       }
			 }else{
				 $scope.isControlSceneInfo = false;
				 $scope.controlSceneAddArr = {};
			 }
			 $scope.isDifferentFlagI = false;
			 if($scope.infoList.differentFlag == 'Y'){
				 $scope.isDifferentFlagI = true;
			 }else{
				 $scope.isDifferentFlagI = false;
			 }
			//自定义下拉框--------溢缴款 标识
			 $scope.OCFalgArray01 ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_isYorN",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.overpayContrlFlagInfo = $scope.infoList.overpayContrlFlag;
				        }
					};
			//自定义下拉框--------检查标志
				$scope.checkArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_checkList",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.pnListCheckFlagInfo = $scope.infoList.pnListCheckFlag;
				        }
					};
				//正负面清单层级限制-----复选框
				$scope.negArray = [{name : T.T('SQJ1700008') ,id : 'CN'},
				                   {name : T.T('SQJ1700009') ,id : 'MH'},
				                   {name : T.T('SQH1700080') ,id : 'TM'},
				                   {name : T.T('SQH1700102') ,id : 'MN'},
				                   {name : T.T('SQH1700108') ,id : 'MC'}];
			//自定义下拉框--------限制币种
			$scope.currcyArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_currcyType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLimitCurrCodeInfo = $scope.infoList.transLimitCurrCode;
			        }
				};
		 //证件类型
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
			        	$scope.idTypeInfo = $rootScope.selIdType;
			        }
				};
		//产品
		 $scope.proArray = {};
		//自定义下拉框--------交易层级限制
		 $scope.leveArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_leveList",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLimitLevInfo = $scope.infoList.transLimitLev;
			        }
				};
		//差异化类型
        $scope.difTypeInfoArray ={ 
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
    	        	$scope.differentTypeInfo = $scope.infoList.differentType;
    	        }
    		};
            $scope.difTypeInfoArray02 ={ 
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
        	        	$scope.transDifferentTypeInfo = $scope.infoList.transDifferentType;
        	        }
        		};
            $scope.difTypeInfoArray03 ={ 
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
        	        	$scope.listDifferentTypeInfo = $scope.infoList.listDifferentType;
        	        }
        		};
		$scope.isTimeInfo = false;
		$scope.isCustomerNoInfo = false;
		$scope.isExterNoInfo = false;
		$scope.isriskLevelNoInfo = false;
		$scope.isProNoInfo = false;
		$scope.isCheckInfo = false;
		$scope.transCheckInfo = false;
		$scope.isBInfo = false;
		$scope.isDiffType = false;
		$scope.isControlSceneInfo = false;
		$scope.isDifferentFlagI = false;
		if($scope.infoList.differentType == "1"){
			$scope.isCustomerNoInfo = false;
  			$scope.isExterNoInfo = false;
  			$scope.isriskLevelNoInfo = true;
  			$scope.isTimeInfo = false;
  			$scope.isProNoInfo = false;
  			$scope.isDiffType = false;
  			$scope.isControlSceneInfo = false;
  			$scope.isDifferentFlagI = false;
  			$scope.riskLevelInfo = $scope.infoList.differentCode;
  			$scope.idTypeInfo = "";
  			$scope.idNumberInfo = "";
  			$scope.externalIdentificationNoInfo = "";
  			$scope.projectCodeInfo = "";
  			$scope.infoList.startDate = "";
  			$scope.infoList.endDate = "";
		}else if($scope.infoList.differentType == "4"){
			$scope.isCustomerNoInfo = false;
  			$scope.isExterNoInfo = false;
  			$scope.isriskLevelNoInfo = false;
  			$scope.isTimeInfo = false;
  			$scope.isProNoInfo = true;
  			$scope.isDiffType = false;
  			$scope.isControlSceneInfo = false;
  			$scope.isDifferentFlagI = false;
  			$scope.idTypeInfo = "";
  			$scope.idNumberInfo = "";
  			$scope.riskLevelInfo = "";
  			$scope.externalIdentificationNoInfo = "";
  			$scope.infoList.startDate = "";
  			$scope.infoList.endDate = "";
  		//产品
  			 $scope.proArray ={ 
  			        type:"dynamicDesc", 
  			        param:{},//默认查询条件 
  			        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
  			        desc:"productDesc",
  			        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
  			        resource:"proObject.query",//数据源调用的action 
  			        callback: function(data){
  			        	$scope.projectCodeInfo = $scope.infoitem.differentCode;
  			        }
  			    };
		}
		else if($scope.infoList.differentType == "2"){
			$scope.isCustomerNoInfo = true;
  			$scope.isExterNoInfo = false;
  			$scope.isTimeInfo = true;
  			$scope.isProNoInfo = false;
  			$scope.isriskLevelNoInfo = false;
  			$scope.isDiffType = false;
  			$scope.isControlSceneInfo = false;
  			$scope.isDifferentFlagI = false;
  			$scope.idTypeInfo = $rootScope.selIdType;
  			$scope.idNumberInfo = $rootScope.selIdNum;
  			$scope.isCustomerNoInfo = $scope.infoitem.differentCode;
  			$scope.riskLevelInfo = "";
  			$scope.projectCodeInfo = "";
  			$scope.externalIdentificationNoInfo = "";
		}else if($scope.infoList.differentType == "3"){
			$scope.isCustomerNoInfo = false;
  			$scope.isExterNoInfo = true;
  			$scope.isTimeInfo = true;
  			$scope.isProNoInfo = false;
  			$scope.isriskLevelNoInfo = false;
  			$scope.isDiffType = false;
  			$scope.isControlSceneInfo = false;
  			$scope.isDifferentFlagI = false;
  			$scope.idTypeInfo = "";
  			$scope.idNumberInfo = "";
  			$scope.riskLevelInfo = "";
  			$scope.projectCodeInfo = "";
  			$scope.externalIdentificationNoInfo = $rootScope.selDifferentCode;
		}else if($scope.infoList.differentType == "0"){
			$scope.isCustomerNoInfo = false;
  			$scope.isExterNoInfo = false;
  			$scope.isTimeInfo = false;
  			$scope.isProNoInfo = false;
  			$scope.isriskLevelNoInfo = false;
  			$scope.isCheckInfo = true;
  			$scope.isDiffType = true;
  			if($scope.infoList.contRelFlag == 'Y'){
  				$scope.isControlSceneInfo = true;
  			}else{
  				$scope.isControlSceneInfo = false;
  			}
  			if($scope.infoList.differentFlag == 'Y'){
  				$scope.isDifferentFlagI = true;
  			}else{
  				$scope.isDifferentFlagI = false;
  			}
  			$scope.idTypeInfo = "";
  			$scope.idNumberInfo = "";
  			$scope.riskLevelInfo = "";
  			$scope.projectCodeInfo = "";
  			$scope.infoList.startDate = "";
  			$scope.infoList.endDate = "";
  			$scope.externalIdentificationNoInfo = "";
		}
		$scope.isNInfo = false;
		$scope.isTwoCInfo = false;//第5步内容
		$scope.isTwoEInfo = false;//第5步内容
		$scope.isTwoPInfo = false;
		$rootScope.customerLimitListInfo = [];
		$rootScope.mediaLimitListInfo = [];
		$rootScope.productLimitListInfo = [];
		$rootScope.customerLimitListInfo = $scope.infoList.customerLimitList;
		$rootScope.mediaLimitListInfo = $scope.infoList.mediaLimitList;
		$rootScope.productLimitListInfo = $scope.infoList.productLimitList;
		if($scope.infoList.listDifferentType == '0' || $scope.infoList.listDifferentType == null || $scope.infoList.listDifferentType == ""){
			$scope.isCheckInfo = true;
			$scope.isBInfo = false;
			if($scope.infoList.pnListCheckFlag == null || $scope.infoList.pnListCheckFlag == "" || $scope.infoList.pnListCheckFlag == undefined){
				$scope.transSel = {};
				$scope.transSel.authDataSynFlag = "1";
				$scope.transSel.operationMode = $scope.infoList.operationMode;   //运营模式
				$scope.transSel.differentType = '0';   //差异类型
				$scope.transSel.contrlSceneCode = $scope.infoList.contrlSceneCode;
				$scope.transSel.creditNodeNo = $scope.infoList.creditNodeNo;
				jfRest.request('diffQueryb', 'query', $scope.transSel).then(function(data) {
					$scope.infoList.pnListCheckFlag = data.returnData.rows[0].pnListCheckFlag;
					$scope.infoList.listCheckType = data.returnData.rows[0].listCheckType;
					if($scope.infoList.pnListCheckFlag == "B" || $scope.infoList.pnListCheckFlag == null || $scope.infoList.pnListCheckFlag == ""){
						$scope.infoList.listCheckType = "";
						$scope.isBInfo = false;
					}
					else{
						$scope.isBInfo = true;
					}
					$scope.pnListCheckFlagInfo = data.returnData.rows[0].pnListCheckFlag;
					$timeout(function() {
						Tansun.plugins.render('select');
					});
				});
			}
		}else if($scope.infoList.listDifferentType == '1' || $scope.infoList.listDifferentType == '2' || $scope.infoList.listDifferentType == '3' || $scope.infoList.listDifferentType == '4'){
			$scope.isCheckInfo = true;
			$scope.isBInfo = false;
		}
		if($scope.infoList.transDifferentType == '0' || $scope.infoList.transDifferentType == null || $scope.infoList.transDifferentType == ""){
			$scope.transCheckInfo = true;
			$scope.isNInfo = false;
			if($scope.infoList.transLimitLev == null || $scope.infoList.transLimitLev == "" || $scope.infoList.transLimitLev == undefined){
				$scope.transSel = {};
				$scope.transSel.authDataSynFlag = "1";
				$scope.transSel.operationMode = $scope.infoList.operationMode;   //运营模式
				$scope.transSel.differentType = '0';   //差异类型
				$scope.transSel.contrlSceneCode = $scope.infoList.contrlSceneCode;
				$scope.transSel.creditNodeNo = $scope.infoList.creditNodeNo;
				jfRest.request('diffQueryb', 'query', $scope.transSel).then(function(data) {
					$scope.infoList.transLimitLev = data.returnData.rows[0].transLimitLev;
					$scope.infoList.transLimitCurrCode = data.returnData.rows[0].transLimitCurrCode;
					$scope.transLimitLevInfo = data.returnData.rows[0].transLimitLev;
					$scope.transLimitCurrCodeInfo = data.returnData.rows[0].transLimitCurrCode;
					$rootScope.customerLimitListInfo = [];
					$rootScope.mediaLimitListInfo = [];
					$rootScope.productLimitListInfo = [];
					$rootScope.customerLimitListInfo = data.returnData.rows[0].customerLimitList;
					$rootScope.mediaLimitListInfo = data.returnData.rows[0].mediaLimitList;
					$rootScope.productLimitListInfo = data.returnData.rows[0].productLimitList; 
					$scope.checkInfoShow();
				});
			}
		}else if($scope.infoList.transDifferentType == '1' || $scope.infoList.transDifferentType == '2' || $scope.infoList.transDifferentType == '3' || $scope.infoList.transDifferentType == '4'){
			$scope.transCheckInfo = true;
			$scope.isNInfo = false;
		}
		if($scope.infoList.pnListCheckFlag == "B" || $scope.infoList.pnListCheckFlag == null || $scope.infoList.pnListCheckFlag == ""){
			$scope.infoList.listCheckType = "";
			$scope.isBInfo = false;
		}
		else{
			$scope.isBInfo = true;
		}
		//要修改的地方
		 $scope.crrysInfoArray = {};
		 $scope.params = {
				 "operationMode":$scope.infoitem.operationMode,
		};
		 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
			 $scope.crrysInfoArray = data.returnData.rows;
		 });
		$scope.checkInfoShow = function(){
			if($scope.infoList.transLimitLev == 'M'){
				$scope.isTwoCInfo = false;
				$scope.isTwoEInfo = true;
				$scope.isTwoPInfo = false;
				$scope.isNInfo = true;
			}else if($scope.infoList.transLimitLev == 'P'){
				$scope.isTwoCInfo = false;
				$scope.isTwoEInfo = false;
				$scope.isTwoPInfo = true;
				$scope.isNInfo = true;
			}else if($scope.infoList.transLimitLev == 'C'){
				$scope.isTwoCInfo = true;
				$scope.isTwoEInfo = false;
				$scope.isTwoPInfo = false;
				$scope.isNInfo = true;
			}else if($scope.infoList.transLimitLev == 'B'){
				$scope.isTwoCInfo = true;
				$scope.isTwoEInfo = true;
				$scope.isTwoPInfo = false;
				$scope.isNInfo = true;
			}else{
				$scope.infoList.transLimitCurrCode = "";
				$scope.isNInfo = false;
				$scope.isTwoCInfo = false;
				$scope.isTwoEInfo = false;
				$scope.isTwoPInfo = false;
			}
		}
		$scope.checkInfoShow();
		//查询限制详细===公共方法
		$scope.limitListInfo = function(result){
			$scope.conlimitSel.supplyControlFlag = result[0].supplyControlFlag;
    		$scope.conlimitSel.limitCycleTrans = result[0].limitCycleTrans;
    		$scope.conlimitSel.limitDayTrans = result[0].limitDayTrans;		                		
    		$scope.conlimitSel.limitHalfYearTrans = result[0].limitHalfYearTrans;		                		
    		$scope.conlimitSel.limitLifeCycleTrans = result[0].limitLifeCycleTrans;		                		
    		$scope.conlimitSel.limitMonthTrans = result[0].limitMonthTrans;		                		
    		$scope.conlimitSel.limitSingleTrans = result[0].limitSingleTrans;		                	
    		$scope.conlimitSel.limitYearTrans = result[0].limitYearTrans;
    		$scope.conlimitSel.numberCycleTrans = result[0].numberCycleTrans;
    		$scope.conlimitSel.numberDayTrans = result[0].numberDayTrans;
    		$scope.conlimitSel.numberHalfYearTrans = result[0].numberHalfYearTrans;
    		$scope.conlimitSel.numberLifeCycleTrans = result[0].numberLifeCycleTrans;
    		$scope.conlimitSel.numberMonthTrans = result[0].numberMonthTrans;
    		$scope.conlimitSel.numberYearTrans = result[0].numberYearTrans;
    		$scope.conlimitSel.limitCycleTransFlag = result[0].limitCycleTransFlag;
    		$scope.conlimitSel.limitDayTransFlag = result[0].limitDayTransFlag;		                		
    		$scope.conlimitSel.limitHalfYearTransFlag = result[0].limitHalfYearTransFlag;		                		
    		$scope.conlimitSel.limitLifeCycleTransFlag = result[0].limitLifeCycleTransFlag;		                		
    		$scope.conlimitSel.limitMonthTransFlag = result[0].limitMonthTransFlag;		                		
    		$scope.conlimitSel.limitSingleTransFlag = result[0].limitSingleTransFlag;		                	
    		$scope.conlimitSel.limitYearTransFlag = result[0].limitYearTransFlag;
    		$scope.conlimitSel.numberCycleTransFlag = result[0].numberCycleTransFlag;
    		$scope.conlimitSel.numberDayTransFlag = result[0].numberDayTransFlag;
    		$scope.conlimitSel.numberHalfYearTransFlag = result[0].numberHalfYearTransFlag;
    		$scope.conlimitSel.numberLifeCycleTransFlag = result[0].numberLifeCycleTransFlag;
    		$scope.conlimitSel.numberMonthTransFlag = result[0].numberMonthTransFlag;
    		$scope.conlimitSel.numberYearTransFlag = result[0].numberYearTransFlag;
    		$scope.modal('/authorization/controltrading/controllimitInfo.html', $scope.conlimitSel, {
	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				buttons : [T.T('F00012')],
				size : [ '970px', '530px' ],
				callbacks : []
			});
		}
		//查看交易限制详细信息公共方法
		$scope.allLimitListInfo = function(index,itemU){
			$scope.conlimitSel.authDataSynFlag = "1";
	 		$scope.conlimitSel.operationMode = $scope.infoList.operationMode;   //运营模式
	 		$scope.conlimitSel.transLimitCode = $scope.infoList.contrlSceneCode;    //交易限制码
	 		$scope.conlimitSel.currencyCode = itemU.currencyCode;
	 		if($scope.infoList.transDifferentType == '1' || $scope.infoList.transDifferentType == '2' ||  $scope.infoList.transDifferentType == '3' ||  $scope.infoList.transDifferentType == '4'){
	 			$scope.conlimitSel.differentType = $scope.infoList.differentType;   //差异类型
	 			if($scope.infoList.differentType == "1" || $scope.infoList.differentType == "4" || $scope.infoList.differentType == "0"){
		 			if($scope.infoList.differentType == "1"){
		 				$scope.conlimitSel.differentCode = $scope.riskLevelInfo;
		 			}else if($scope.infoList.differentType == "4"){
		 				$scope.conlimitSel.differentCode = $scope.projectCodeInfo;
		 			}else if($scope.infoList.differentType == "0"){
		 				$scope.conlimitSel.differentCode = "";
		 			}
		 			jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
		                if (data.returnCode == '000000') {
		                	if(data.returnData.totalCount == 0){
		                		jfLayer.fail(T.T('SQJ1700043'));
		                	}else{
		                		if($scope.conlimitSel.supplyControlFlag == 'Y'){
		                			$scope.supplyControlFlagInfo = T.T('F00028');
		                		}else{
		                			$scope.supplyControlFlagInfo = T.T('F00029');
		                		}
		                		//查询限制详细===公共方法
		                		$scope.limitListInfo(data.returnData.rows);
		                	}
		                }
		            });
				}else if($scope.infoList.differentType == "2" || $scope.infoList.differentType == "3"){
					if($scope.infoList.differentType == "2"){
						$scope.conlimitSel.idType = $rootScope.selIdType;
						$scope.conlimitSel.idNumber = $rootScope.selIdNum;
					}else if($scope.infoList.differentType == "3"){
						$scope.conlimitSel.differentCode = $rootScope.selDifferentCode;
			  			$scope.conlimitSel.externalIdentificationNo = $rootScope.selDifferentCode;
					}
					jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
		                if (data.returnCode == '000000') {
		                	if(data.returnData.totalCount == 0){
		                		jfLayer.fail(T.T('SQJ1700043'));
		                	}else{
		                		if($scope.conlimitSel.supplyControlFlag == 'Y'){
		                			$scope.supplyControlFlagInfo = T.T('F00028');
		                		}else{
		                			$scope.supplyControlFlagInfo = T.T('F00029');
		                		}
		                		//查询限制详细===公共方法
		                		$scope.limitListInfo(data.returnData.rows);
		                	}
		                }
		            });
				}
	 		}else if($scope.infoList.transDifferentType == '0'){
	 			$scope.conlimitSel.differentType = "";   //差异类型
	 			$scope.conlimitSel.differentCode = "";
	 			jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
	                if (data.returnCode == '000000') {
	                	if(data.returnData.totalCount == 0){
	                		jfLayer.fail(T.T('SQJ1700043'));
	                	}else{
	                		if($scope.conlimitSel.supplyControlFlag == 'Y'){
	                			$scope.supplyControlFlagInfo = T.T('F00028');
	                		}else{
	                			$scope.supplyControlFlagInfo = T.T('F00029');
	                		}
	                		//查询限制详细===公共方法
	                		$scope.limitListInfo(data.returnData.rows);
	                	}
	                }
	            });
	 		}
		}
	 	//产品详情======增加交易限制  =============多个
	 	$scope.pSel = function(index,itemUp){
	 		$scope.conlimitSel = {};
	 		$scope.conlimitSel.levelFlag = 'P';   //限制层级  客户层C  媒介层M   产品层P
	 		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
	 		//查看交易限制详细信息公共方法
			$scope.allLimitListInfo(index,itemUp);
	 	};
	 	//客户详情======增加交易限制  =============多个
	 	$scope.cusTypeSelTwoInfo = function(index,itemUCus){
	 		$scope.conlimitSel = {};
	 		$scope.conlimitSel.levelFlag = 'C';   //限制层级  客户层C  媒介层M   产品层P
	 		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
	 		//查看交易限制详细信息公共方法
			$scope.allLimitListInfo(index,itemUCus);
	 	};
		//媒介层限制详情======增加交易限制=========多个
		$scope.exceSel = function(index,itemExceU){
			$scope.conlimitSel = {};
			$scope.conlimitSel.levelFlag = 'M';   //限制层级  客户层C  媒介层M
			$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			//查看交易限制详细信息公共方法
			$scope.allLimitListInfo(index,itemExceU);
		};
	});
	//修改
	webApp.controller('controlDiffUpdateCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.updateList = {};
		$scope.updateList = $scope.updateitem;
		$scope.proArrayUpdate = {};
		$scope.updateOneCurr = false;   //限制币种为运营币种显示
		$scope.updateTwoCurr = false;   //限制币种为入账币种显示
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArrayUpdate ={ 
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
	        	$scope.operationModeUInfo = $scope.updateitem.operationMode;
	        }
	    };
		 //额度节点代码下拉框
		 $scope.creditNodeNoArrayUpdate = {
				 type:"dynamicDesc",
				 param:{
			      "operationMode":$scope.updateitem.operationMode,
			      "creditNodeTyp":"B",
			       "authDataSynFlag":"1"
		         },
				 text:"creditNodeNo",
			     desc:"creditDesc",
			     value:"creditNodeNo",
			     resource : 'quotatree.queryList',
			     callback:function(data){
		        	 $scope.creditNodeNoUInfo =$scope.updateitem.creditNodeNo;
		       }
		 };
			//日期控件
			layui.use('laydate', function(){
				  var laydate = layui.laydate;
				  var startDate = laydate.render({
						elem: '#DIFF_start_Update',
						min:Date.now(),
						done: function(value, date) {
							endDate.config.min = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							endDate.config.start = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
						}
					});
					var endDate = laydate.render({
						elem: '#DIFF_end_Update',
						//min:Date.now(),
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							}
						}
					});
					//生效时间，失效时间
					var startTime = laydate.render({
						elem: '#DIFF_startTime_Update',
						type: 'time',
					    format: 'HH:mm',
					});
					var endTime = laydate.render({
						elem: '#DIFF_endTime_Update',
						type: 'time',
						/*min:  "9:00:00",
						max: '17:30:00',*/
					    format: 'HH:mm'
					});
			});
			//日期控件end
			//自定义下拉框--------限制币种======只有人民币
			$scope.cur156Array = {};
			 $scope.params = {
				 corporationEntityNo:$scope.corporationId,
				 requestType:"1",
				 resultType:"1"
			 };
			 jfRest.request('legalEntity', 'query', $scope.params).then(function(data) {
				 $scope.cur156Array = data.returnData.rows;
			 });
			 $scope.isControlSceneU = false;
			 if($scope.updateList.contRelFlag == 'Y'){
				 $scope.isControlSceneU = true;
			 }else{
				 $scope.isControlSceneU = false;
			 }
			//自定义下拉框--------关联管控标识
			 $scope.OCFalgArray02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.contRelFlagU = $scope.updateList.contRelFlag;
		        }
			};
			 $scope.isDifferentFlagU = false;
			 //允许差异化
			 $scope.OCFalgArray05 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.differentFlagU = $scope.updateList.differentFlag;
		        }
			};
			//管控场景下拉列表框
			 $scope.controlSceneUArr = {
					 type:"dynamicDesc", 
					 param:{
				       authDataSynFlag:"1",
				       differentType:'0',
				       operationMode:$scope.updateitem.operationMode,
			        },
			        text:"contrlSceneCode",
			        desc:"contrlSceneDesc",
			        value:"contrlSceneCode",
			        resource : 'diffQueryb.query',
			        callback:function(data){
			        	$scope.controlSceneCodeRelU = $scope.updateList.controlSceneCodeRel;
		        }
	       }
			//自定义下拉框--------独立 标识
			 $scope.independentArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_ZorO",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.independentFlagU = $scope.updateList.independentFlag;
				        }
					};
			//自定义下拉框--------溢缴款 标识
			 $scope.OCFalgArray01 ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_isYorN",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.overpayContrlFlagU = $scope.updateList.overpayContrlFlag;
				        }
					};
					$scope.OCFalgArray03={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_isYorN",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.listDifferentFlagU = $scope.updateList.listDifferentFlag;
					        }
						};
					$scope.OCFalgArray04={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_isYorN",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.transDifferentFlagU = $scope.updateList.transDifferentFlag;
					        }
						};
			//自定义下拉框--------检查标志
					$scope.checkArray ={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_checkList",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.pnListCheckFlagU = $scope.updateList.pnListCheckFlag;
					        }
						};
			//正负面清单层级限制-----复选框
			$scope.negArray = [{name : T.T('SQJ1700008') ,id : 'CN'},
			                   {name : T.T('SQJ1700009') ,id : 'MH'},
			                   {name : T.T('SQH1700080') ,id : 'TM'},
			                   {name : T.T('SQH1700102') ,id : 'MN'},
			                   {name : T.T('SQH1700108') ,id : 'MC'}];
			//自定义下拉框--------限制币种
			$scope.currcyArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_currcyType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLimitCurrCodeU = $scope.updateList.transLimitCurrCode;
			        }
				};
		 //证件类型
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
			        	$scope.idTypeUpdate = $rootScope.selIdType;
			        }
				};
		//产品
		 $scope.proArrayUpdate ={ 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"productDesc",
		        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"proObject.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.projectCodeUpdate = $scope.updateitem.differentCode;
		        }
		    };
		//自定义下拉框--------交易层级限制
		 $scope.leveArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_leveList",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLimitLevU = $scope.updateList.transLimitLev;
			        }
				};
        //联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
        	if(data.value == "1"){//身份证
        		$("#conUpdate_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#conUpdate_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#conUpdate_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#conUpdate_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#conUpdate_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#conUpdate_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#conUpdate_idNumber").attr("validator","noValidator");
        		$scope.mdmInfoForm.$setPristine();
        		$("#conUpdate_idNumber").removeClass("waringform ");
        	};
        });
        //管控标识为Y显示场景信息
        form.on('select(getContRelFlagU)',function(data){
        	if(data.value){
        		if(data.value == 'Y'){
        			$scope.isControlSceneU = true;
        		}else{
        			$scope.isControlSceneU = false;
        			$scope.controlSceneCodeRelU = "";
        		}
        	}
        });
        //允许差异化为Y显示差异化类型
        form.on('select(getDifferentFlagU)',function(data){
        	if(data.value){
        		if(data.value == 'Y'){
        			$scope.isDifferentFlagU = true;
        		}else{
        			$scope.isDifferentFlagU = false;
        			$scope.updateList.differentFlagType = "";
        		}
        	}
        });
        //差异化类型
        $scope.difFlagTypeArray = [{name : T.T('SQH1700115') ,id : 'C'},
                                   {name : T.T('SQH1700116') ,id : 'M'},
                                   {name : T.T('SQH1700117') ,id : 'P'},
                                   {name : T.T('SQH1700118') ,id : 'R'}];
        //循环展示，所以不做动态获取
        $scope.YNArray = [{name : T.T('SQJ1700010') ,id : 'Y'},{name : T.T('SQJ1700011') ,id : 'N'}];
		//差异化类型
        $scope.difTypeUpdateArray ={ 
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
    	        	$scope.differentTypeU = $scope.updateList.differentType;
    	        }
    		};
		$scope.isTimeUpdate = false;
		$scope.isCustomerNoUpdate = false;
		$scope.isExterNoUpdate = false;
		$scope.isProNoUpdate = false;
		$scope.isriskLevelNoUpdate = false;
		$scope.inF = true;
		$scope.isNUpdate = false;
		$scope.isBUpdate = false;
		$scope.isFlagUpdate = false;
		$scope.isUpdateCusType = false;
		$scope.isUpdateExceType = false;
		$scope.isListFlagUpdate = false;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
		$scope.isCheckUpdate = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
		$scope.isTransFlagUpdate = false;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
		$scope.transCheckUpdate = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
		$scope.isControl = false;
		$rootScope.isExceEmptyUpdate = false;//媒介必须有值
		$rootScope.isPEmptyUpdate = false;//产品必须有值
		$rootScope.isCusEmptyUpdate = false;//客户必须有值
		if($scope.updateList.differentType == "1"){
			$scope.isCustomerNoUpdate = false;
  			$scope.isExterNoUpdate = false;
  			$scope.isriskLevelNoUpdate = true;
  			$scope.isProNoUpdate = false;
  			$scope.isTimeUpdate = false;
  			$scope.isControl = false;
  			$scope.isDifferentFlagU = false;
			$scope.isControlSceneU = false;
  			$scope.riskLevelUpdate = $scope.updateList.differentCode;
  			$scope.idTypeUpdate = "";
  			$scope.idNumberUpdate = "";
  			$scope.externalIdentificationNoUpdate = "";
  			$scope.updateList.startDate = "";
  			$scope.updateList.endDate = "";
  			$scope.projectCodeUpdate = "";
  			$scope.inF = false;
  			$scope.isListFlagUpdate = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckUpdate = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagUpdate = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckUpdate = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.updateList.listDifferentFlag == 'Y'){
  				$scope.isCheckUpdate = true;
  				if($scope.updateList.pnListCheckFlag == "B" || $scope.updateList.pnListCheckFlag == "" || $scope.updateList.pnListCheckFlag == null){
  					$scope.isBUpdate = false;
  				}
  				else{
  					$scope.isBUpdate = true;
  				}
  			}else if($scope.updateList.listDifferentFlag == 'N'){
  				$scope.isCheckUpdate = false;
  				$scope.isBUpdate = false;
  			}
  			if($scope.updateList.transDifferentFlag == 'Y'){
  				$scope.transCheckUpdate = true;
  			}else if($scope.updateList.transDifferentFlag == 'N'){
  				$scope.transCheckUpdate = false;
  			}
		}else if($scope.updateList.differentType == "4"){
			$scope.isCustomerNoUpdate = false;
  			$scope.isExterNoUpdate = false;
  			$scope.isriskLevelNoUpdate = false;
  			$scope.isProNoUpdate = true;
  			$scope.isTimeUpdate = false;
  			$scope.isControl = false;
  			$scope.isDifferentFlagU = false;
			 $scope.isControlSceneU = false;
  			$scope.idTypeUpdate = "";
  			$scope.riskLevelUpdate = "";
  			$scope.idNumberUpdate = "";
  			$scope.externalIdentificationNoUpdate = "";
  			$scope.updateList.startDate = "";
  			$scope.updateList.endDate = "";
  			$scope.inF = false;
  			$scope.isListFlagUpdate = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckUpdate = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagUpdate = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckUpdate = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.updateList.listDifferentFlag == 'Y'){
  				$scope.isCheckUpdate = true;
  				if($scope.updateList.pnListCheckFlag == "B" || $scope.updateList.pnListCheckFlag == "" || $scope.updateList.pnListCheckFlag == null){
  					$scope.isBUpdate = false;
  				}
  				else{
  					$scope.isBUpdate = true;
  				}
  			}else if($scope.updateList.listDifferentFlag == 'N'){
  				$scope.isCheckUpdate = false;
  				$scope.isBUpdate = false;
  			}
  			if($scope.updateList.transDifferentFlag == 'Y'){
  				$scope.transCheckUpdate = true;
  			}else if($scope.updateList.transDifferentFlag == 'N'){
  				$scope.transCheckUpdate = false;
  			}
  		//产品
 			 $scope.proArrayUpdate ={ 
 			        type:"dynamicDesc", 
 			        param:{},//默认查询条件 
 			        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
 			        desc:"productDesc",
 			        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
 			        resource:"proObject.query",//数据源调用的action 
 			        callback: function(data){
 			        	$scope.projectCodeUpdate = $scope.updateitem.differentCode;
 			        }
 			    };
		}
		else if($scope.updateList.differentType == "2"){
			$scope.isCustomerNoUpdate = true;
  			$scope.isExterNoUpdate = false;
  			$scope.isProNoUpdate = false;
  			$scope.isTimeUpdate = true;
  			$scope.isriskLevelNoUpdate = false;
  			$scope.isControl = false;
  			$scope.isDifferentFlagU = false;
			 $scope.isControlSceneU = false;
  			$scope.idTypeUpdate = $rootScope.selIdType;
  			$scope.idNumberUpdate = $rootScope.selIdNum;
  			$scope.riskLevelUpdate = "";
  			$scope.projectCodeUpdate = "";
  			$scope.externalIdentificationNoUpdate = "";
  			$scope.inF = false;
  			$scope.isListFlagUpdate = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckUpdate = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagUpdate = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckUpdate = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.updateList.listDifferentFlag == 'Y'){
  				$scope.isCheckUpdate = true;
  				if($scope.updateList.pnListCheckFlag == "B" || $scope.updateList.pnListCheckFlag == "" || $scope.updateList.pnListCheckFlag == null){
  					$scope.isBUpdate = false;
  				}
  				else{
  					$scope.isBUpdate = true;
  				}
  			}else if($scope.updateList.listDifferentFlag == 'N'){
  				$scope.isCheckUpdate = false;
  				$scope.isBUpdate = false;
  			}
  			if($scope.updateList.transDifferentFlag == 'Y'){
  				$scope.transCheckUpdate = true;
  			}else if($scope.updateList.transDifferentFlag == 'N'){
  				$scope.transCheckUpdate = false;
  			}
		}else if($scope.updateList.differentType == "3"){
			$scope.isCustomerNoUpdate = false;
  			$scope.isExterNoUpdate = true;
  			$scope.isTimeUpdate = true;
  			$scope.isProNoUpdate = false;
  			$scope.isriskLevelNoUpdate = false;
  			$scope.isControl = false;
  			$scope.isDifferentFlagU = false;
			 $scope.isControlSceneU = false;
  			$scope.idTypeUpdate = "";
  			$scope.projectCodeUpdate = "";
  			$scope.idNumberUpdate = "";
  			$scope.riskLevelUpdate = "";
  			$scope.externalIdentificationNoUpdate = $rootScope.selDifferentCode;
  			$scope.inF = false;
  			$scope.isListFlagUpdate = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckUpdate = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagUpdate = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckUpdate = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.updateList.listDifferentFlag == 'Y'){
  				$scope.isCheckUpdate = true;
  				if($scope.updateList.pnListCheckFlag == "B" || $scope.updateList.pnListCheckFlag == "" || $scope.updateList.pnListCheckFlag == null){
  					$scope.isBUpdate = false;
  				}
  				else{
  					$scope.isBUpdate = true;
  				}
  			}else if($scope.updateList.listDifferentFlag == 'N'){
  				$scope.isCheckUpdate = false;
  				$scope.isBUpdate = false;
  			}
  			if($scope.updateList.transDifferentFlag == 'Y'){
  				$scope.transCheckUpdate = true;
  			}else if($scope.updateList.transDifferentFlag == 'N'){
  				$scope.transCheckUpdate = false;
  			}
		}else if($scope.updateList.differentType == "0"){
			$scope.isCustomerNoUpdate = false;
  			$scope.isExterNoUpdate = false;
  			$scope.isTimeUpdate = false;
  			$scope.isProNoUpdate = false;
  			$scope.isriskLevelNoUpdate = false;
  			$scope.isControl = true;
  			$scope.idTypeUpdate = "";
  			$scope.idNumberUpdate = "";
  			$scope.riskLevelUpdate = "";
  			$scope.projectCodeUpdate = "";
  			$scope.updateList.startDate = "";
  			$scope.updateList.endDate = "";
  			$scope.externalIdentificationNoUpdate = "";
  			$scope.inF = true;
  			$scope.isListFlagUpdate = false;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckUpdate = true;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagUpdate = false;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckUpdate = true;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.updateList.pnListCheckFlag == "B" || $scope.updateList.pnListCheckFlag == "" || $scope.updateList.pnListCheckFlag == null){
				$scope.isBUpdate = false;
			}
			else{
				$scope.isBUpdate = true;
			}
			 if($scope.updateList.differentFlag == 'Y'){
				 $scope.isDifferentFlagU = true;
			 }else{
				 $scope.isDifferentFlagU = false;
			 }
			 if($scope.updateList.contRelFlag == 'Y'){
				 $scope.isControlSceneU = true;
			 }else{
				 $scope.isControlSceneU = false;
			 }
		}
		$rootScope.exterUpdateListTwo = [];
		$rootScope.pUpdateListTwo = [];
		$rootScope.cusUpdateListTwo = [];
		$scope.cusUpdateListTwoCur = [];
		if($scope.updateList.customerLimitList.length>0){
			for(var i=0;i<$scope.updateList.customerLimitList.length;i++){
				$rootScope.cusUpdateListTwo.push($scope.updateList.customerLimitList[i]);
				$scope.cusUpdateListTwoCur.push($scope.updateList.customerLimitList[i].currencyCode);
			}
			$rootScope.isCusEmptyUpdate = true;//客户必须有值
		}else{
			$rootScope.cusUpdateListTwo = [{}];
			$scope.cusUpdateListTwoCur = [];
		}
		$scope.exterUpdateListTwoCur = [];
		if($scope.updateList.mediaLimitList.length>0){
			for(var i=0;i<$scope.updateList.mediaLimitList.length;i++){
				$rootScope.exterUpdateListTwo.push($scope.updateList.mediaLimitList[i]);
				$scope.exterUpdateListTwoCur.push($scope.updateList.mediaLimitList[i].currencyCode);
			}
			$rootScope.isExceEmptyUpdate = true;//媒介必须有值
		}else{
			$rootScope.exterUpdateListTwo = [{}];
			$scope.exterUpdateListTwoCur = [];
		}
		$scope.pUpdateListTwoCur = [];
		if($scope.updateList.productLimitList.length>0){
			for(var i=0;i<$scope.updateList.productLimitList.length;i++){
				$rootScope.pUpdateListTwo.push($scope.updateList.productLimitList[i]);
				$scope.pUpdateListTwoCur.push($scope.updateList.productLimitList[i].currencyCode);
			}
			$rootScope.isPEmptyUpdate = true;//产品必须有值
		}else{
			$rootScope.pUpdateListTwo = [{}];
			$scope.pUpdateListTwoCur = [];
		}
		 $scope.crrysUpdateArray = {};
		 $scope.params = {
				 "operationMode":$scope.updateitem.operationMode,
		 };
		 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
			 $scope.crrysUpdateArray = data.returnData.rows;
		 });
		$scope.isTwoCUpdate = false;//第5步内容
		$scope.isTwoEUpdate = false;//第5步内容
		$scope.isTwoPUpdate = false;//第5步内容
		if($scope.updateList.transLimitLev == 'M'){
			$scope.isTwoCUpdate = false;
			$scope.isTwoEUpdate = true;
			$scope.isTwoPUpdate = false;
			$scope.isNUpdate = true;
			$rootScope.isExceEmptyUpdate = true;//媒介必须有值
			$rootScope.isPEmptyUpdate = false;//产品必须有值
			$rootScope.isCusEmptyUpdate = false;//客户必须有值
			if($scope.updateList.transLimitCurrCode == '1'){
				$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
				$scope.params = {
						 "operationMode":$scope.updateitem.operationMode,
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crrysUpdateArray = {};
					 $scope.crrysUpdateArray = data.returnData.rows;
					 if($scope.updateList.mediaLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateExceType = false;
					}else{
						$scope.isUpdateExceType = true;
					}
				 });
			}else if($scope.updateList.transLimitCurrCode == '0'){
				$scope.isUpdateExceType = false;
				$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			}
		}else if($scope.updateList.transLimitLev == 'P'){
			$scope.isTwoCUpdate = false;
			$scope.isTwoEUpdate = false;
			$scope.isTwoPUpdate = true;
			$scope.isNUpdate = true;
			$rootScope.isExceEmptyUpdate = false;//媒介必须有值
			$rootScope.isPEmptyUpdate = true;//产品必须有值
			$rootScope.isCusEmptyUpdate = false;//客户必须有值
			if($scope.updateList.transLimitCurrCode == '1'){
				$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
				$scope.params = {
						 "operationMode":$scope.updateitem.operationMode,
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crrysUpdateArray = {};
					 $scope.crrysUpdateArray = data.returnData.rows;
					 if($scope.updateList.productLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdatePType = false;
					}else{
						$scope.isUpdatePType = true;
					}
				 });
			}else if($scope.updateList.transLimitCurrCode == '0'){
				$scope.isUpdatePType = false;
				$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			}
		}else if($scope.updateList.transLimitLev == 'C'){
			$scope.isTwoCUpdate = true;
			$scope.isTwoEUpdate = false;
			$scope.isTwoPUpdate = false;
			$scope.isNUpdate = true;
			$rootScope.isExceEmptyUpdate = false;//媒介必须有值
			$rootScope.isPEmptyUpdate = false;//产品必须有值
			$rootScope.isCusEmptyUpdate = true;//客户必须有值
			if($scope.updateList.transLimitCurrCode == '1'){
				$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
				$scope.params = {
						 "operationMode":$scope.updateitem.operationMode,
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crrysUpdateArray = {};
					 $scope.crrysUpdateArray = data.returnData.rows;
					 if($scope.updateList.customerLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateCusType = false;
					}else{
						$scope.isUpdateCusType = true;
					}
				 });
			}else if($scope.updateList.transLimitCurrCode == '0'){
				$scope.isUpdateCusType = false;
				$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			}
		}else if($scope.updateList.transLimitLev == 'B'){
			$scope.isTwoCUpdate = true;
			$scope.isTwoEUpdate = true;
			$scope.isTwoPUpdate = false;
			$scope.isNUpdate = true;
			$rootScope.isExceEmptyUpdate = true;//媒介必须有值
			$rootScope.isPEmptyUpdate = false;//产品必须有值
			$rootScope.isCusEmptyUpdate = true;//客户必须有值
			if($scope.updateList.transLimitCurrCode == '1'){
				$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
				$scope.params = {
						 "operationMode":$scope.updateitem.operationMode,
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crrysUpdateArray = {};
					 $scope.crrysUpdateArray = data.returnData.rows;
					 if($scope.updateList.customerLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateCusType = false;
					}else{
						$scope.isUpdateCusType = true;
					}
					if($scope.updateList.mediaLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateExceType = false;
					}else{
						$scope.isUpdateExceType = true;
					}
				 });
			}else if($scope.updateList.transLimitCurrCode == '0'){
				$scope.isUpdateCusType = false;
				$scope.isUpdateExceType = false;
				$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
				$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			}
		}else{
			$scope.updateList.transLimitCurrCode = "";
			$scope.isNUpdate = false;
			$scope.isTwoCUpdate = false;
			$scope.isTwoEUpdate = false;
			$scope.isTwoPUpdate = false;
			$scope.isUpdateCusType = false;
			$scope.isUpdateExceType = false;
			$scope.isUpdatePType = false;
			$rootScope.isExceEmptyUpdate = false;//媒介必须有值
			$rootScope.isPEmptyUpdate = false;//产品必须有值
			$rootScope.isCusEmptyUpdate = false;//客户必须有值
		}
		var form = layui.form;
		form.on('select(getListDifferentFlagUpdate)',function(event){
			if(event.value == 'Y'){
	  			$scope.isCheckUpdate = true;   //正负面清单检查标志
			}else{
				$scope.isCheckUpdate = false;   //正负面清单检查标志
				$scope.isBUpdate = false;
				$scope.pnListCheckFlagU = "";
				$scope.updateList.listCheckType = "";
			}
		});
		form.on('select(getRiskLimitUpdate)',function(event){
			if(event.value == "B"){
				$scope.updateList.listCheckType = "";
				$scope.isBUpdate = false;
			}
			else{
				$scope.isBUpdate = true;
			}
		});
		form.on('select(gettransLimitDifferentTypeUpdate)',function(event){
			if(event.value == 'Y'){
	  			$scope.transCheckUpdate = true;   //交易限制层级限制
			}else{
				$scope.transCheckUpdate = false;   //交易限制层级限制
				$scope.transLimitCurrCodeU = "";
				$scope.transLimitLevU = "";
				$scope.isNUpdate = false;
				$scope.isTwoCUpdate = false;
				$scope.isTwoEUpdate = false;
				$scope.isTwoPUpdate = false;
				$rootScope.exterUpdateListTwo = [];
				$rootScope.pUpdateListTwo = [];
				$rootScope.cusUpdateListTwo = [];
			}
		});
		//修改时根据限制币种和限制层级显示产品限制信息====全部
		$scope.updatePAllShow = function(){
			$scope.isNUpdate = true;
    		$rootScope.isExceEmptyUpdate = false;
    		$rootScope.isPEmptyUpdate = true;
    		$rootScope.isCusEmptyUpdate = false;
    		$scope.isTwoCUpdate = false;
    		$scope.isTwoEUpdate = false;
    		$scope.isTwoPUpdate = true;
    		$scope.isUpdateExceType = false;
			$scope.isUpdateCusType = false;
		}
		//修改时根据限制币种和限制层级显示产品限制信息====入账币种
		$scope.updatePOneShow = function(){
			$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
			$scope.pUpdateListTwoCur = [];
			if($scope.updateList.productLimitList.length>0){
				for(var i=0;i<$scope.updateList.productLimitList.length;i++){
					$rootScope.pUpdateListTwo.push($scope.updateList.productLimitList[i]);
					$scope.pUpdateListTwoCur.push($scope.updateList.productLimitList[i].currencyCode);
				}
			}else{
				$rootScope.pUpdateListTwo = [{}];
				$scope.pUpdateListTwoCur = [];
			}
			 $timeout(function() {
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.updateitem.operationMode,
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysUpdateArray = {};
						 $scope.crrysUpdateArray = data.returnData.rows;
						if($scope.updateList.productLimitList.length >= $scope.crrysUpdateArray.length){
							$scope.isUpdatePType = false;
						}else{
							$scope.isUpdatePType = true;
						}
					 });
				},300);
		}
		//修改时根据限制币种和限制层级显示产品限制信息====运营币种
		$scope.updatePZeroShow = function(){
			$scope.isUpdatePType = false;
			$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			if($scope.updateList.productLimitList.length == 0){
				$rootScope.pUpdateListTwo = [{}];
			}else if($scope.updateList.productLimitList.length == 1){
				if($scope.updateList.productLimitList[0].currencyCode == '156'){
					$rootScope.pUpdateListTwo = $scope.updateList.productLimitList;
				}else{
					$rootScope.pUpdateListTwo = [{}];
				}
			}else if($scope.updateList.productLimitList.length > 1){
				for(var i=0;i<$scope.updateList.productLimitList.length;i++){
					if($scope.updateList.productLimitList[i].currencyCode == '156'){
						$rootScope.pUpdateListTwo.push($scope.updateList.productLimitList[i]);
						break;
					}else{
						$rootScope.pUpdateListTwo = [];
					}
				}
			}
			if($rootScope.pUpdateListTwo.length == 0){
				$rootScope.pUpdateListTwo = [{}];
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		}
		//修改时根据限制币种和限制层级显示客户限制信息====全部
		$scope.updateCAllShow = function(){
			$rootScope.isCusEmptyUpdate = true;
			$rootScope.isPEmptyUpdate = false;
			$rootScope.isExceEmptyUpdate = false;
			$scope.isTwoCUpdate = true;
			$scope.isTwoEUpdate = false;
			$scope.isTwoPUpdate = false;
			$scope.isNUpdate = true;
			$scope.isUpdateExceType = false;
			$scope.isUpdatePType = false;
			$rootScope.pUpdateListTwo = [];
			$rootScope.exterUpdateListTwo = [];
		}
		//修改时根据限制币种和限制层级显示客户限制信息====入账币种
		$scope.updateCOneShow = function(){
			$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
			$scope.cusUpdateListTwoCur = [];
			if($scope.updateList.customerLimitList.length>0){
				for(var i=0;i<$scope.updateList.customerLimitList.length;i++){
					$rootScope.cusUpdateListTwo.push($scope.updateList.customerLimitList[i]);
					$scope.cusUpdateListTwoCur.push($scope.updateList.customerLimitList[i].currencyCode);
				}
			}else{
				$rootScope.cusUpdateListTwo = [{}];
				$scope.cusUpdateListTwoCur = [];
			}
			 $timeout(function() {
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
				$scope.params = {
						 "operationMode":$scope.updateitem.operationMode,
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crrysUpdateArray = {};
					 $scope.crrysUpdateArray = data.returnData.rows;
					 if($scope.updateList.customerLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateCusType = false;
					}else{
						$scope.isUpdateCusType = true;
					}
				 });
			},300);
		}
		//修改时根据限制币种和限制层级显示客户限制信息====运营币种
		$scope.updateCZeroShow = function(){
			$scope.isUpdateCusType = false;
			$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			$rootScope.cusUpdateListTwo = [];
			if($scope.updateList.customerLimitList.length == 0){
				$rootScope.cusUpdateListTwo = [{}];
			}else if($scope.updateList.customerLimitList.length == 1){
				if($scope.updateList.customerLimitList[0].currencyCode == '156'){
					$rootScope.cusUpdateListTwo = $scope.updateList.customerLimitList;
				}else{
					$rootScope.cusUpdateListTwo = [{}];
				}
			}else if($scope.updateList.customerLimitList.length > 1){
				for(var i=0;i<$scope.updateList.customerLimitList.length;i++){
					if($scope.updateList.customerLimitList[i].currencyCode == '156'){
						$rootScope.cusUpdateListTwo.push($scope.updateList.customerLimitList[i]);
						break;
					}else{
						$rootScope.cusUpdateListTwo = [];
					}
				}
			}
			if($rootScope.cusUpdateListTwo.length == 0){
				$rootScope.cusUpdateListTwo = [{}];
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		}
		//修改时根据限制币种和限制层级显示媒介限制信息====全部
		$scope.updateEAllShow = function(){
			$rootScope.isExceEmptyUpdate = true;
			$rootScope.isPEmptyUpdate = false;
			$rootScope.isCusEmptyUpdate = false;
			$scope.isTwoCUpdate = false;
			$scope.isTwoEUpdate = true;
			$scope.isTwoPUpdate = false;
			$scope.isNUpdate = true;
			$scope.isUpdateCusType = false;
			$scope.isUpdatePType = false;
		}
		//修改时根据限制币种和限制层级显示媒介限制信息====入账币种
		$scope.updateEOneShow = function(){
			$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
			$scope.exterUpdateListTwoCur = [];
			if($scope.updateList.mediaLimitList.length>0){
				for(var i=0;i<$scope.updateList.mediaLimitList.length;i++){
					$rootScope.exterUpdateListTwo.push($scope.updateList.mediaLimitList[i]);
					$scope.exterUpdateListTwoCur.push($scope.updateList.mediaLimitList[i].currencyCode);
				}
			}else{
				$rootScope.exterUpdateListTwo = [{}];
				$scope.exterUpdateListTwoCur = [];
			}
			 $timeout(function() {
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.updateitem.operationMode,
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysUpdateArray = {};
						 $scope.crrysUpdateArray = data.returnData.rows;
						if($scope.updateList.mediaLimitList.length >= $scope.crrysUpdateArray.length){
							$scope.isUpdateExceType = false;
						}else{
							$scope.isUpdateExceType = true;
						}
					 });
				},300);
		}
		//修改时根据限制币种和限制层级显示媒介限制信息====运营币种
		$scope.updateEZeroShow = function(){
			$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			$scope.isUpdateExceType = false;
			if($scope.updateList.mediaLimitList.length == 0){
				$rootScope.exterUpdateListTwo = [{}];
			}else if($scope.updateList.mediaLimitList.length == 1){
				if($scope.updateList.mediaLimitList[0].currencyCode == '156'){
					$rootScope.exterUpdateListTwo = $scope.updateList.mediaLimitList;
				}else{
					$rootScope.exterUpdateListTwo = [{}];
				}
			}else if($scope.updateList.mediaLimitList.length > 1){
				for(var i=0;i<$scope.updateList.mediaLimitList.length;i++){
					if($scope.updateList.mediaLimitList[i].currencyCode == '156'){
						$rootScope.exterUpdateListTwo.push($scope.updateList.mediaLimitList[i]);
						break;
					}else{
						$rootScope.exterUpdateListTwo = [];
					}
				}
			}
			if($rootScope.exterUpdateListTwo.length == 0){
				$rootScope.exterUpdateListTwo = [{}];
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		}
		//修改时根据限制币种和限制层级显示两层限制信息====全部
		$scope.updateBAllShow = function(){
			$rootScope.isCusEmptyUpdate = true;
			$rootScope.isExceEmptyUpdate = true;
			$rootScope.isPEmptyUpdate = false;
			$scope.isTwoCUpdate = true;
			$scope.isTwoEUpdate = true;
			$scope.isTwoPUpdate = false;
			$scope.isNUpdate = true;
			$scope.isUpdatePType = false;
		}
		//修改时根据限制币种和限制层级显示两层限制信息====入账
		$scope.updateBOneShow = function(){
			$scope.updateOneCurr = false;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = true;   //限制币种为入账币种==1==显示
			$scope.cusUpdateListTwoCur = [];
			if($scope.updateList.customerLimitList.length>0){
				for(var i=0;i<$scope.updateList.customerLimitList.length;i++){
					$rootScope.cusUpdateListTwo.push($scope.updateList.customerLimitList[i]);
					$scope.cusUpdateListTwoCur.push($scope.updateList.customerLimitList[i].currencyCode);
				}
			}else{
				$rootScope.cusUpdateListTwo = [{}];
				$scope.cusUpdateListTwoCur = [];
			}
			$scope.exterUpdateListTwoCur = [];
			if($scope.updateList.mediaLimitList.length>0){
				for(var i=0;i<$scope.updateList.mediaLimitList.length;i++){
					$rootScope.exterUpdateListTwo.push($scope.updateList.mediaLimitList[i]);
					$scope.exterUpdateListTwoCur.push($scope.updateList.mediaLimitList[i].currencyCode);
				}
			}else{
				$rootScope.exterUpdateListTwo = [{}];
				$scope.exterUpdateListTwoCur = [];
			}
			$timeout(function() {
				//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
				$scope.params = {
						 "operationMode":$scope.updateitem.operationMode,
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crrysUpdateArray = {};
					 $scope.crrysUpdateArray = data.returnData.rows;
					 if($scope.updateList.customerLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateCusType = false;
					}else{
						$scope.isUpdateCusType = true;
					}
					if($scope.updateList.mediaLimitList.length >= $scope.crrysUpdateArray.length){
						$scope.isUpdateExceType = false;
					}else{
						$scope.isUpdateExceType = true;
					}
				 });
			},300);
		}
		//修改时根据限制币种和限制层级显示两层限制信息====运营
		$scope.updateBZeroShow = function(){
			$scope.isUpdateExceType = false;
			$scope.isUpdateCusType = false;
			$scope.updateOneCurr = true;   //限制币种为运营币种==0==显示
			$scope.updateTwoCurr = false;   //限制币种为入账币种==1==显示
			$rootScope.exterUpdateListTwo = [];
			$rootScope.cusUpdateListTwo = [];
        	if($scope.updateList.customerLimitList.length == 0){
				$rootScope.cusUpdateListTwo = [{}];
			}else if($scope.updateList.customerLimitList.length == 1){
				if($scope.updateList.customerLimitList[0].currencyCode == '156'){
					$rootScope.cusUpdateListTwo = $scope.updateList.customerLimitList;
				}else{
					$rootScope.cusUpdateListTwo = [{}];
				}
			}else if($scope.updateList.customerLimitList.length > 1){
				for(var i=0;i<$scope.updateList.customerLimitList.length;i++){
					if($scope.updateList.customerLimitList[i].currencyCode == '156'){
						$rootScope.cusUpdateListTwo.push($scope.updateList.customerLimitList[i]);
						break;
					}else{
						$rootScope.cusUpdateListTwo = [];
					}
				}
			}
        	if($rootScope.cusUpdateListTwo.length == 0){
        		$rootScope.cusUpdateListTwo = [{}];
        	}
        	$timeout(function() {
				Tansun.plugins.render('select');
			});
        	if($scope.updateList.mediaLimitList.length == 0){
				$rootScope.exterUpdateListTwo = [{}];
			}else if($scope.updateList.mediaLimitList.length == 1){
				if($scope.updateList.mediaLimitList[0].currencyCode == '156'){
					$rootScope.exterUpdateListTwo = $scope.updateList.mediaLimitList;
				}else{
					$rootScope.exterUpdateListTwo = [{}];
				}
			}else if($scope.updateList.mediaLimitList.length > 1){
				for(var i=0;i<$scope.updateList.mediaLimitList.length;i++){
					if($scope.updateList.mediaLimitList[i].currencyCode == '156'){
						$rootScope.exterUpdateListTwo.push($scope.updateList.mediaLimitList[i]);
						break;
					}else{
						$rootScope.exterUpdateListTwo = [];
					}
				}
			}
        	if($rootScope.exterUpdateListTwo.length == 0){
        		$rootScope.exterUpdateListTwo = [{}];
        	}
        	$timeout(function() {
				Tansun.plugins.render('select');
			});
		}
		//修改时根据限制币种和限制层级显示====不限制信息
		$scope.updateNShow = function(){
			$scope.isUpdateExceType = false;
			$scope.isUpdateCusType = false;
			$scope.isUpdatePType = false;
			$rootScope.isCusEmptyUpdate = false;
			$rootScope.isExceEmptyUpdate = false;
			$rootScope.isPEmptyUpdate = false;
			$scope.transLimitCurrCodeU = "";
			$scope.isNUpdate = false;
			$scope.isTwoCUpdate = false;
			$scope.isTwoEUpdate = false;
			$scope.isTwoPUpdate = false;
			$rootScope.exterUpdateListTwo = [];
			$rootScope.cusUpdateListTwo = [];
        	$rootScope.pUpdateListTwo = [];
		}
		//层级限制===修改时
		form.on('select(getLimitLevUpdate)',function(event){
        	$rootScope.exterUpdateListTwo = [];
        	$rootScope.pUpdateListTwo = [];
        	$rootScope.cusUpdateListTwo = [];
			if(event.value == 'P'){
				//修改时根据限制币种和限制层级显示产品限制信息====全部
	    		$scope.updatePAllShow();
				if($scope.transLimitCurrCodeU == '1'){
					//修改时根据限制币种和限制层级显示产品限制信息====入账
	        		$scope.updatePOneShow();
				}else if($scope.transLimitCurrCodeU == '0'){
					//修改时根据限制币种和限制层级显示产品限制信息====运营
	        		$scope.updatePZeroShow();
				}
			}else if(event.value == 'M'){
				//修改时根据限制币种和限制层级显示媒介限制信息====全部
				$scope.updateEAllShow();
					if($scope.transLimitCurrCodeU == '1'){
						//修改时根据限制币种和限制层级显示媒介限制信息====入账币种
						$scope.updateEOneShow();
					}else if($scope.transLimitCurrCodeU == '0'){
						//修改时根据限制币种和限制层级显示媒介限制信息====运营币种
						$scope.updateEZeroShow();
					}
			}else if(event.value == 'C'){
				//修改时根据限制币种和限制层级显示客户限制信息====全部
				$scope.updateCAllShow();
					if($scope.transLimitCurrCodeU == '1'){
						//修改时根据限制币种和限制层级显示客户限制信息====入账币种
						$scope.updateCOneShow();
					}else if($scope.transLimitCurrCodeU == '0'){
						//修改时根据限制币种和限制层级显示客户限制信息====运营币种
						$scope.updateCZeroShow();
					}
			}else if(event.value == 'B'){
				//修改时根据限制币种和限制层级显示两层限制信息====全部
				$scope.updateBAllShow();
				if($scope.transLimitCurrCodeU == '1'){
					//修改时根据限制币种和限制层级显示两层限制信息====入账
					$scope.updateBOneShow();
				}else if($scope.transLimitCurrCodeU == '0'){
					//修改时根据限制币种和限制层级显示两层限制信息====运营
					$scope.updateBZeroShow();
				}
			}else if(event.value == 'N'){
				//修改时根据限制币种和限制层级显示====不限制信息
				$scope.updateNShow();
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		});
		//限制币种=====修改时
		form.on('select(getLimitCurUpdate)',function(event){
        	$rootScope.pUpdateListTwo = [];
        	$rootScope.exterUpdateListTwo = [];
        	$rootScope.cusUpdateListTwo = [];
        	if($scope.transLimitLevU == 'P'){
        		//修改时根据限制币种和限制层级显示产品限制信息====全部
        		$scope.updatePAllShow();
        		if(event.value == '1'){
        			//修改时根据限制币种和限制层级显示产品限制信息====入账
            		$scope.updatePOneShow();
        		}else if(event.value == '0'){
        			//修改时根据限制币种和限制层级显示产品限制信息====运营
            		$scope.updatePZeroShow();
        		}
			}else if($scope.transLimitLevU == 'M'){
				//修改时根据限制币种和限制层级显示媒介限制信息====全部
				$scope.updateEAllShow();
				if(event.value == '1'){
					//修改时根据限制币种和限制层级显示媒介限制信息====入账币种
					$scope.updateEOneShow();
				}else if(event.value == '0'){
					//修改时根据限制币种和限制层级显示媒介限制信息====运营币种
					$scope.updateEZeroShow();
				}
			}else if($scope.transLimitLevU == 'C'){
				//修改时根据限制币种和限制层级显示客户限制信息====全部
				$scope.updateCAllShow();
				if(event.value == '1'){
					//修改时根据限制币种和限制层级显示客户限制信息====入账币种
					$scope.updateCOneShow();
				}else if(event.value == '0'){
					//修改时根据限制币种和限制层级显示客户限制信息====运营币种
					$scope.updateCZeroShow();
				}
			}else if($scope.transLimitLevU == 'B'){
				//修改时根据限制币种和限制层级显示两层限制信息====全部
				$scope.updateBAllShow();
				if(event.value == '1'){
					//修改时根据限制币种和限制层级显示两层限制信息====入账
					$scope.updateBOneShow();
				}else if(event.value == '0'){
					//修改时根据限制币种和限制层级显示两层限制信息====运营
					$scope.updateBZeroShow();
				}
			}else if(event.value == ""){
				$scope.isUpdateExceType = false;
				$scope.isUpdateCusType = false;
				$scope.isUpdatePType = false;
				$scope.transLimitCurrCodeU = "";
			}else{
				//修改时根据限制币种和限制层级显示====不限制信息
				$scope.updateNShow();
			}
		});
		//产品层交易限制--增加======维护
	 	$scope.listTypeUpdateP = function(){
	 		if($scope.transLimitCurrCodeU == 1){
	 			if($rootScope.pUpdateListTwo == 0 || $rootScope.pUpdateListTwo == null){
	 				$rootScope.pUpdateListTwo = [{}];
		 		}
		 		else{
		 			$rootScope.pUpdateListTwo.splice($rootScope.pUpdateListTwo.length,0,{});
		 		}
	 			if($rootScope.pUpdateListTwo.length >= $scope.crrysUpdateArray.length){
	 				$scope.isUpdatePType = false;
	 			}else{
	 				$scope.isUpdatePType = true;
	 			}
	 		}else if($scope.transLimitCurrCodeU == 0){
	 			if($rootScope.pUpdateListTwo == 0 || $rootScope.pUpdateListTwo == null){
	 				$rootScope.pUpdateListTwo = [{}];
	 				$scope.isUpdatePType = false;
		 		}
	 		}
 			$timeout(function() {
				Tansun.plugins.render('select');
			});
	 	};
	 	//产品层交易限制-----删除======维护
	 	$scope.pUpdateDel = function(e,$index){
	 		$rootScope.pUpdateListTwo.splice(e,1);
	 		$scope.pUpdateListTwoCur.splice(e,1);
	 		if($rootScope.pUpdateListTwo.length >= $scope.crrysUpdateArray.length){
 				$scope.isUpdatePType = false;
 			}else{
 				$scope.isUpdatePType = true;
 			}
	 	};
		 	//媒介层交易限制--增加======维护
		 	$scope.listTypeUpdate = function(){
		 		if($scope.transLimitCurrCodeU == 1){
		 			if($rootScope.exterUpdateListTwo == 0 || $rootScope.exterUpdateListTwo == null){
		 				$rootScope.exterUpdateListTwo = [{}];
			 		}
			 		else{
			 			$rootScope.exterUpdateListTwo.splice($rootScope.exterUpdateListTwo.length,0,{});
			 		}
		 			if($rootScope.exterUpdateListTwo.length >= $scope.crrysUpdateArray.length){
		 				$scope.isUpdateExceType = false;
		 			}else{
		 				$scope.isUpdateExceType = true;
		 			}
		 		}else if($scope.transLimitCurrCodeU == 0){
		 			if($rootScope.exterUpdateListTwo == 0 || $rootScope.exterUpdateListTwo == null){
		 				$rootScope.exterUpdateListTwo = [{}];
		 				$scope.isUpdateExceType = false;
			 		}
		 		}
	 			$timeout(function() {
    				Tansun.plugins.render('select');
    			});
		 	};
		 	//媒介层交易限制-----删除======维护
		 	$scope.exceUpdateDel = function(e,$index){
		 		$rootScope.exterUpdateListTwo.splice(e,1);
		 		$scope.exterUpdateListTwoCur.splice(e,1);
		 		if($rootScope.exterUpdateListTwo.length >= $scope.crrysUpdateArray.length){
	 				$scope.isUpdateExceType = false;
	 			}else{
	 				$scope.isUpdateExceType = true;
	 			}
		 	};
		 	//客户层交易限制--增加======维护
		 	$scope.listTypeCusUpdate = function(){
		 		if($scope.transLimitCurrCodeU == 1){
		 			if($rootScope.cusUpdateListTwo == 0 || $rootScope.cusUpdateListTwo == null){
		 				$rootScope.cusUpdateListTwo = [{}];
			 		}
			 		else{
			 			$rootScope.cusUpdateListTwo.splice($rootScope.cusUpdateListTwo.length,0,{});
			 		}
		 			if($rootScope.cusUpdateListTwo.length >= $scope.crrysUpdateArray.length){
		 				$scope.isUpdateCusType = false;
		 			}else{
		 				$scope.isUpdateCusType = true;
		 			}
		 		}else if($scope.transLimitCurrCodeU == 0){
		 			if($rootScope.cusUpdateListTwo == 0 || $rootScope.cusUpdateListTwo == null){
		 				$rootScope.cusUpdateListTwo = [{}];
		 				$scope.isUpdateCusType = false;
			 		}
		 		}
	 			
	 			$timeout(function() {
	 		       Tansun.plugins.render('select');
	 		    });
		 	};
		 	//客户层交易限制-----删除======维护
		 	$scope.cusTypeDelUpdate = function(e,$index){
		 		$rootScope.cusUpdateListTwo.splice(e,1);
		 		$scope.cusUpdateListTwoCur.splice(e,1);
		 		if($rootScope.cusUpdateListTwo.length >= $scope.crrysUpdateArray.length){
	 				$scope.isUpdateCusType = false;
	 			}else{
	 				$scope.isUpdateCusType = true;
	 			}
		 	};
		 	//修改限制===页面无值 取数据库=====客户，媒介，产品共用
		 	$scope.limitListUpdateSql = function(result){
		 		$scope.conlimitSel.supplyControlFlag = result[0].supplyControlFlag;
	    		$scope.conlimitSel.limitCycleTrans = result[0].limitCycleTrans;
	    		$scope.conlimitSel.limitDayTrans = result[0].limitDayTrans;		                		
	    		$scope.conlimitSel.limitHalfYearTrans = result[0].limitHalfYearTrans;		                		
	    		$scope.conlimitSel.limitLifeCycleTrans = result[0].limitLifeCycleTrans;		                		
	    		$scope.conlimitSel.limitMonthTrans = result[0].limitMonthTrans;		                		
	    		$scope.conlimitSel.limitSingleTrans = result[0].limitSingleTrans;		                	
	    		$scope.conlimitSel.limitYearTrans = result[0].limitYearTrans;
	    		$scope.conlimitSel.numberCycleTrans = result[0].numberCycleTrans;
	    		$scope.conlimitSel.numberDayTrans = result[0].numberDayTrans;
	    		$scope.conlimitSel.numberHalfYearTrans = result[0].numberHalfYearTrans;
	    		$scope.conlimitSel.numberLifeCycleTrans = result[0].numberLifeCycleTrans;
	    		$scope.conlimitSel.numberMonthTrans = result[0].numberMonthTrans;
	    		$scope.conlimitSel.numberYearTrans = result[0].numberYearTrans;
	    		$scope.conlimitSel.version = result[0].version;
	    		$scope.conlimitSel.id = result[0].id;
	    		$scope.conlimitSel.limitCycleTransFlag = result[0].limitCycleTransFlag;
	    		$scope.conlimitSel.limitDayTransFlag = result[0].limitDayTransFlag;		                		
	    		$scope.conlimitSel.limitHalfYearTransFlag = result[0].limitHalfYearTransFlag;		                		
	    		$scope.conlimitSel.limitLifeCycleTransFlag = result[0].limitLifeCycleTransFlag;		                		
	    		$scope.conlimitSel.limitMonthTransFlag = result[0].limitMonthTransFlag;		                		
	    		$scope.conlimitSel.limitSingleTransFlag = result[0].limitSingleTransFlag;		                	
	    		$scope.conlimitSel.limitYearTransFlag = result[0].limitYearTransFlag;
	    		$scope.conlimitSel.numberCycleTransFlag = result[0].numberCycleTransFlag;
	    		$scope.conlimitSel.numberDayTransFlag = result[0].numberDayTransFlag;
	    		$scope.conlimitSel.numberHalfYearTransFlag = result[0].numberHalfYearTransFlag;
	    		$scope.conlimitSel.numberLifeCycleTransFlag = result[0].numberLifeCycleTransFlag;
	    		$scope.conlimitSel.numberMonthTransFlag = result[0].numberMonthTransFlag;
	    		$scope.conlimitSel.numberYearTransFlag = result[0].numberYearTransFlag;
	    		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
		 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					buttons : [ T.T('F00031'), T.T('F00012')],
					size : [ '970px', '530px' ],
					callbacks : [$scope.updatelimitList]
				});
		 	}
		 	//修改产品限制信息===页面有值 取页面
		 	$scope.proUpdateLimitList = function(index){
				$scope.conlimitSel.supplyControlFlag = $rootScope.pUpdateListTwo[index].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = $rootScope.pUpdateListTwo[index].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = $rootScope.pUpdateListTwo[index].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = $rootScope.pUpdateListTwo[index].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.pUpdateListTwo[index].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = $rootScope.pUpdateListTwo[index].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = $rootScope.pUpdateListTwo[index].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = $rootScope.pUpdateListTwo[index].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = $rootScope.pUpdateListTwo[index].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = $rootScope.pUpdateListTwo[index].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = $rootScope.pUpdateListTwo[index].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.pUpdateListTwo[index].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = $rootScope.pUpdateListTwo[index].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = $rootScope.pUpdateListTwo[index].numberYearTrans;
        		$scope.conlimitSel.version = $rootScope.pUpdateListTwo[index].version;
        		$scope.conlimitSel.id = $rootScope.pUpdateListTwo[index].id;
        		$scope.conlimitSel.limitCycleTransFlag = $rootScope.pUpdateListTwo[index].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = $rootScope.pUpdateListTwo[index].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.pUpdateListTwo[index].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.pUpdateListTwo[index].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = $rootScope.pUpdateListTwo[index].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = $rootScope.pUpdateListTwo[index].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = $rootScope.pUpdateListTwo[index].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = $rootScope.pUpdateListTwo[index].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = $rootScope.pUpdateListTwo[index].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.pUpdateListTwo[index].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.pUpdateListTwo[index].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = $rootScope.pUpdateListTwo[index].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = $rootScope.pUpdateListTwo[index].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [ T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updatelimitList]
    			});
		 	}
		 	//产品详情======增加交易限制  =============多个
		 	$scope.pUpdateAdd = function(index,itemUP){
		 		if($rootScope.pUpdateListTwo.length>0){
					for(var i=0;i<$rootScope.pUpdateListTwo.length;i++){
						if($rootScope.pUpdateListTwo[i].currencyCode != $scope.pUpdateListTwoCur[i]){
							$scope.pUpdateListTwoCur.push($rootScope.pUpdateListTwo[i].currencyCode);
						}
					}
				}
		 		$scope.currencyCodeOld = "";
		 		if($scope.updateList.productLimitList.length >index){
		 			$scope.currencyCodeOld = $scope.pUpdateListTwoCur[index];
		 		}else{
		 			if($rootScope.pUpdateListTwo.length > 0){
		 				$scope.currencyCodeOld = $rootScope.pUpdateListTwo[index].currencyCode;
		 			}else{
		 				$scope.currencyCodeOld = "";
		 			}
		 		}
		 		if(itemUP.currencyCode){
		 			if(itemUP.mandatoryInspectionFlag){
		 				$rootScope.isPEmptyUpdate = false;
						$scope.conlimitSel = {};
						$scope.conlimitSel.authDataSynFlag = "1";
				 		$scope.conlimitSel.operationMode = $scope.updateList.operationMode;   //运营模式
				 		$scope.conlimitSel.levelFlag = 'P';   //限制层级  客户层C  媒介层M
				 		$scope.conlimitSel.differentType = $scope.updateList.differentType;   //差异类型
				 		$scope.conlimitSel.transLimitCode = $scope.updateList.contrlSceneCode;    //交易限制码
				 		$scope.conlimitSel.currencyCode = itemUP.currencyCode;
				 		$scope.conlimitSel.mandatoryInspectionFlag = itemUP.mandatoryInspectionFlag;
				 		if($scope.updateList.differentType == "1" || $scope.updateList.differentType == "4"){
				 			if($scope.updateList.differentType == "1"){
				 				$scope.conlimitSel.differentCode = $scope.riskLevelUpdate;
				 			}else if($scope.updateList.differentType == "4"){
				 				$scope.conlimitSel.differentCode = $scope.projectCodeUpdate;
				 			}
				 			jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyUpdate = true;
			                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.pUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUP.currencyCode){
			                				//修改产品限制信息===页面有值 取页面
			                			 	$scope.proUpdateLimitList(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
			                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
			                    				buttons : [ T.T('F00031'), T.T('F00012')],
			                    				size : [ '970px', '530px' ],
			                    				callbacks : [$scope.updateLimitInfoAdd ]
			                    			});
			                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.pUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUP.currencyCode){
			                				//修改产品限制信息===页面有值 取页面
			                			 	$scope.proUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}else if($scope.updateList.differentType == "2" || $scope.updateList.differentType == "3"){
							if($scope.updateList.differentType == "2"){
								$scope.conlimitSel.idType = $rootScope.selIdType;
								$scope.conlimitSel.idNumber = $rootScope.selIdNum;
							}else if($scope.updateList.differentType == "3"){
								$scope.conlimitSel.differentCode = $rootScope.selDifferentCode;
					  			$scope.conlimitSel.externalIdentificationNo = $rootScope.selDifferentCode;
							}
							jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	$scope.conlimitSel.differentCode = $scope.updateList.differentCode;
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyUpdate = true;
			                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.pUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUP.currencyCode){
			                				//修改产品限制信息===页面有值 取页面
			                			 	$scope.proUpdateLimitList(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
			                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
			                    				buttons : [ T.T('F00031'), T.T('F00012')],
			                    				size : [ '970px', '530px' ],
			                    				callbacks : [$scope.updateLimitInfoAdd ]
			                    			});
			                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.pUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUP.currencyCode){
			                				//修改产品限制信息===页面有值 取页面
			                			 	$scope.proUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}else if($scope.updateList.differentType == "0"){
							$scope.conlimitSel.differentCode = "";
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
				                			$rootScope.isPEmptyUpdate = true;
				                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改客户限制多条时入账币种
				                			if($rootScope.pUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUP.currencyCode){
				                				//修改产品限制信息===页面有值 取页面
				                			 	$scope.proUpdateLimitList(index);
				                			}else{
				                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				                    				buttons : [ T.T('F00031'), T.T('F00012')],
				                    				size : [ '970px', '530px' ],
				                    				callbacks : [$scope.updateLimitInfoAdd ]
				                    			});
				                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.pUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUP.currencyCode){
			                				//修改产品限制信息===页面有值 取页面
			                			 	$scope.proUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}
		 			}else{
		 				jfLayer.fail(T.T('SQJ1700060'));
		 			}
		 		}else{
		 			jfLayer.fail(T.T('SQJ1700067'));
		 		}
		 	};
			// 保存信息事件======限制信息========新增 ==============多个
			$scope.updateLimitInfoAdd = function(result) {
				$scope.controllimitUpdatePInfo = {};
				$scope.controllimitUpdatePInfo = $.parseJSON(JSON.stringify(result.scope.conlimitSel));
				if($scope.controllimitUpdatePInfo.limitSingleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitSingleTrans){
						jfLayer.alert(T.T('SQJ1700070'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.limitDayTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitDayTrans){
						jfLayer.alert(T.T('SQJ1700071'));
						return;
					}
				};	                		
				if($scope.controllimitUpdatePInfo.limitCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitCycleTrans){
						jfLayer.alert(T.T('SQJ1700072'));
						return;
					}
				};	                		
				if($scope.controllimitUpdatePInfo.limitMonthTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitMonthTrans){
						jfLayer.alert(T.T('SQJ1700073'));
						return;
					}
				};		                		
				if($scope.controllimitUpdatePInfo.limitHalfYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700074'));
						return;
					}
				};	                		
	    		if($scope.controllimitUpdatePInfo.limitYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitYearTrans){
						jfLayer.alert(T.T('SQJ1700075'));
						return;
					}
				};		                	
				if($scope.controllimitUpdatePInfo.limitLifeCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700076'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberDayTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberDayTrans){
						jfLayer.alert(T.T('SQJ1700077'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberCycleTrans){
						jfLayer.alert(T.T('SQJ1700078'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberMonthTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberMonthTrans){
						jfLayer.alert(T.T('SQJ1700079'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberHalfYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700080'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberYearTrans){
						jfLayer.alert(T.T('SQJ1700081'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberLifeCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700082'));
						return;
					}
				};
				$scope.controllimitUpdatePInfo.operationMode = $scope.conlimitSel.operationMode;
				$scope.controllimitUpdatePInfo.transLimitCode = $scope.conlimitSel.transLimitCode;
				$scope.controllimitUpdatePInfo.levelFlag = $scope.conlimitSel.levelFlag;
				$scope.controllimitUpdatePInfo.currencyCode = $scope.conlimitSel.currencyCode;
				$scope.controllimitUpdatePInfo.mandatoryInspectionFlag = $scope.conlimitSel.mandatoryInspectionFlag;
				$scope.controllimitUpdatePInfo.differentType = $scope.conlimitSel.differentType;
				$scope.controllimitUpdatePInfo.differentCode = $scope.conlimitSel.differentCode;
				$scope.controllimitUpdatePInfo.supplyControlFlag = result.scope.supplyControlFlagA;
				if($scope.controllimitUpdatePInfo.levelFlag == 'P'){
					if($rootScope.pUpdateListTwo == null){
	    				$rootScope.pUpdateListTwo = [];
	    			}
					if($rootScope.pUpdateListTwo.length > 0){
						for(var n=0;n<$rootScope.pUpdateListTwo.length;n++){
							if($scope.controllimitUpdatePInfo.currencyCode == $rootScope.pUpdateListTwo[n].currencyCode){
								$rootScope.pUpdateListTwo.splice(n, 1);
							}
						}
					}
					$rootScope.pUpdateListTwo.push($scope.controllimitUpdatePInfo);
				}else if($scope.controllimitUpdatePInfo.levelFlag == 'M'){
					if($rootScope.exterUpdateListTwo == null){
	    				$rootScope.exterUpdateListTwo = [];
	    			}
					if($rootScope.exterUpdateListTwo.length > 0){
						for(var m=0;m<$rootScope.exterUpdateListTwo.length;m++){
							if($scope.controllimitUpdatePInfo.currencyCode == $rootScope.exterUpdateListTwo[m].currencyCode){
								$rootScope.exterUpdateListTwo.splice(m, 1);
							}
						}
					}
					$rootScope.exterUpdateListTwo.push($scope.controllimitUpdatePInfo);
				}else if($scope.controllimitUpdatePInfo.levelFlag == 'C'){
					if($rootScope.cusUpdateListTwo == null){
	    				$rootScope.cusUpdateListTwo = [];
	    			}
					if($rootScope.cusUpdateListTwo.length > 0){
						for(var n=0;n<$rootScope.cusUpdateListTwo.length;n++){
							if($scope.controllimitUpdatePInfo.currencyCode == $rootScope.cusUpdateListTwo[n].currencyCode){
								$rootScope.cusUpdateListTwo.splice(n, 1);
							}
						}
					}
					$rootScope.cusUpdateListTwo.push($scope.controllimitUpdatePInfo);
				}
				$timeout(function() {
    				Tansun.plugins.render('select');
    			});
				$scope.safeApply();
				result.cancel();
			};
			// 保存信息事件======客户层限制信息========维护===========多个
			$scope.updatelimitList = function(result) {
				$scope.controllimitUpdatePInfo = {};
				$scope.controllimitUpdatePInfo = $.parseJSON(JSON.stringify(result.scope.conlimitSel));
				$scope.controllimitUpdatePInfo.limitSingleTransFlag = result.scope.limitSingleTransFlagU;
				$scope.controllimitUpdatePInfo.limitDayTransFlag = result.scope.limitDayTransFlagU;
				$scope.controllimitUpdatePInfo.limitCycleTransFlag = result.scope.limitCycleTransFlagU;
				$scope.controllimitUpdatePInfo.limitMonthTransFlag = result.scope.limitMonthTransFlagU;
				$scope.controllimitUpdatePInfo.limitHalfYearTransFlag = result.scope.limitHalfYearTransFlagU;
				$scope.controllimitUpdatePInfo.limitYearTransFlag = result.scope.limitYearTransFlagU;
				$scope.controllimitUpdatePInfo.limitLifeCycleTransFlag = result.scope.limitLifeCycleTransFlagU;
				$scope.controllimitUpdatePInfo.numberDayTransFlag = result.scope.numberDayTransFlagU;
				$scope.controllimitUpdatePInfo.numberCycleTransFlag = result.scope.numberCycleTransFlagU;
				$scope.controllimitUpdatePInfo.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
				$scope.controllimitUpdatePInfo.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
				$scope.controllimitUpdatePInfo.numberHalfYearTransFlag = result.scope.numberHalfYearTransFlagU;
				$scope.controllimitUpdatePInfo.numberLifeCycleTransFlag = result.scope.numberLifeCycleTransFlagU;
				console.log($scope.controllimitUpdatePInfo);
				if($scope.controllimitUpdatePInfo.limitSingleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitSingleTrans){
						jfLayer.alert(T.T('SQJ1700070'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.limitDayTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitDayTrans){
						jfLayer.alert(T.T('SQJ1700071'));
						return;
					}
				};	                		
				if($scope.controllimitUpdatePInfo.limitCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitCycleTrans){
						jfLayer.alert(T.T('SQJ1700072'));
						return;
					}
				};	                		
				if($scope.controllimitUpdatePInfo.limitMonthTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitMonthTrans){
						jfLayer.alert(T.T('SQJ1700073'));
						return;
					}
				};		                		
				if($scope.controllimitUpdatePInfo.limitHalfYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700074'));
						return;
					}
				};	                		
	    		if($scope.controllimitUpdatePInfo.limitYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitYearTrans){
						jfLayer.alert(T.T('SQJ1700075'));
						return;
					}
				};		                	
				if($scope.controllimitUpdatePInfo.limitLifeCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.limitLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700076'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberDayTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberDayTrans){
						jfLayer.alert(T.T('SQJ1700077'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberCycleTrans){
						jfLayer.alert(T.T('SQJ1700078'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberMonthTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberMonthTrans){
						jfLayer.alert(T.T('SQJ1700079'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberHalfYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700080'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberYearTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberYearTrans){
						jfLayer.alert(T.T('SQJ1700081'));
						return;
					}
				};
				if($scope.controllimitUpdatePInfo.numberLifeCycleTransFlag == 'Y'){
					if(!$scope.controllimitUpdatePInfo.numberLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700082'));
						return;
					}
				};
				$scope.controllimitUpdatePInfo.supplyControlFlag = result.scope.supplyControlFlagA;
				if($scope.controllimitUpdatePInfo.levelFlag == 'P'){
					if($rootScope.pUpdateListTwo == null){
	    				$rootScope.pUpdateListTwo = [];
	    			}
					if($rootScope.pUpdateListTwo.length > 0){
						for(var m=0;m<$rootScope.pUpdateListTwo.length;m++){
							if($scope.controllimitUpdatePInfo.currencyCode == $rootScope.pUpdateListTwo[m].currencyCode){
								$rootScope.pUpdateListTwo.splice(m, 1);
							}
						}
					}
					$rootScope.pUpdateListTwo.push($scope.controllimitUpdatePInfo);
				}else if($scope.controllimitUpdatePInfo.levelFlag == 'M'){
					if($rootScope.exterUpdateListTwo == null){
	    				$rootScope.exterUpdateListTwo = [];
	    			}
					if($rootScope.exterUpdateListTwo.length > 0){
						for(var n=0;n<$rootScope.exterUpdateListTwo.length;n++){
							if($scope.controllimitUpdatePInfo.currencyCode == $rootScope.exterUpdateListTwo[n].currencyCode){
								$rootScope.exterUpdateListTwo.splice(n, 1);
							}
						}
					}
					$rootScope.exterUpdateListTwo.push($scope.controllimitUpdatePInfo);
				}else if($scope.controllimitUpdatePInfo.levelFlag == 'C'){
					if($rootScope.cusUpdateListTwo == null){
	    				$rootScope.cusUpdateListTwo = [];
	    			}
					if($rootScope.cusUpdateListTwo.length > 0){
						for(var m=0;m<$rootScope.cusUpdateListTwo.length;m++){
							if($scope.controllimitUpdatePInfo.currencyCode == $rootScope.cusUpdateListTwo[m].currencyCode){
								$rootScope.cusUpdateListTwo.splice(m, 1);
							}
						}
					}
					$rootScope.cusUpdateListTwo.push($scope.controllimitUpdatePInfo);
				}
				$timeout(function() {
    				Tansun.plugins.render('select');
    			});
				$scope.safeApply();
				result.cancel();
			};
			//修改客户限制信息===页面有值 取页面
			$scope.cusUpdateLimitList = function(index){
				$scope.conlimitSel.supplyControlFlag = $rootScope.cusUpdateListTwo[index].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = $rootScope.cusUpdateListTwo[index].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = $rootScope.cusUpdateListTwo[index].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = $rootScope.cusUpdateListTwo[index].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.cusUpdateListTwo[index].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = $rootScope.cusUpdateListTwo[index].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = $rootScope.cusUpdateListTwo[index].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = $rootScope.cusUpdateListTwo[index].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = $rootScope.cusUpdateListTwo[index].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = $rootScope.cusUpdateListTwo[index].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = $rootScope.cusUpdateListTwo[index].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.cusUpdateListTwo[index].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = $rootScope.cusUpdateListTwo[index].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = $rootScope.cusUpdateListTwo[index].numberYearTrans;
        		$scope.conlimitSel.version = $rootScope.cusUpdateListTwo[index].version;
        		$scope.conlimitSel.id = $rootScope.cusUpdateListTwo[index].id;
        		$scope.conlimitSel.limitCycleTransFlag = $rootScope.cusUpdateListTwo[index].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = $rootScope.cusUpdateListTwo[index].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.cusUpdateListTwo[index].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.cusUpdateListTwo[index].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = $rootScope.cusUpdateListTwo[index].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = $rootScope.cusUpdateListTwo[index].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = $rootScope.cusUpdateListTwo[index].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = $rootScope.cusUpdateListTwo[index].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = $rootScope.cusUpdateListTwo[index].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.cusUpdateListTwo[index].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.cusUpdateListTwo[index].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = $rootScope.cusUpdateListTwo[index].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = $rootScope.cusUpdateListTwo[index].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [ T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updatelimitList]
    			});
			}
		 	//客户详情======增加交易限制  =============多个
		 	$scope.cusTypeAddUpdate = function(index,itemUCus){
		 		if($rootScope.cusUpdateListTwo.length>0){
					for(var i=0;i<$rootScope.cusUpdateListTwo.length;i++){
						if($rootScope.cusUpdateListTwo[i].currencyCode != $scope.cusUpdateListTwoCur[i]){
							$scope.cusUpdateListTwoCur.push($rootScope.cusUpdateListTwo[i].currencyCode);
						}
					}
				}
		 		$scope.currencyCodeOld = "";
		 		if($scope.updateList.customerLimitList.length >index){
		 			$scope.currencyCodeOld = $scope.cusUpdateListTwoCur[index];
		 		}else{
		 			if($rootScope.cusUpdateListTwo.length > 0){
		 				$scope.currencyCodeOld = $rootScope.cusUpdateListTwo[index].currencyCode;
		 			}else{
		 				$scope.currencyCodeOld = "";
		 			}
		 		}
		 		if(itemUCus.currencyCode){
		 			if(itemUCus.mandatoryInspectionFlag){
		 				$rootScope.isCusEmptyUpdate = false;
						$scope.conlimitSel = {};
						$scope.conlimitSel.authDataSynFlag = "1";
				 		$scope.conlimitSel.operationMode = $scope.updateList.operationMode;   //运营模式
				 		$scope.conlimitSel.levelFlag = 'C';   //限制层级  客户层C  媒介层M
				 		$scope.conlimitSel.differentType = $scope.updateList.differentType;   //差异类型
				 		$scope.conlimitSel.transLimitCode = $scope.updateList.contrlSceneCode;    //交易限制码
				 		$scope.conlimitSel.currencyCode = itemUCus.currencyCode;
				 		$scope.conlimitSel.mandatoryInspectionFlag = itemUCus.mandatoryInspectionFlag;
				 		if($scope.updateList.differentType == "1" || $scope.updateList.differentType == "4"){
				 			if($scope.updateList.differentType == "1"){
				 				$scope.conlimitSel.differentCode = $scope.riskLevelUpdate;
				 			}else if($scope.updateList.differentType == "4"){
				 				$scope.conlimitSel.differentCode = $scope.projectCodeUpdate;
				 			}
				 			jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyUpdate = true;
			                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.cusUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUCus.currencyCode){
			                				//修改客户限制信息===页面有值 取页面
			                				$scope.cusUpdateLimitList(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
			                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
			                    				buttons : [ T.T('F00031'), T.T('F00012')],
			                    				size : [ '970px', '530px' ],
			                    				callbacks : [$scope.updateLimitInfoAdd ]
			                    			});
			                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
				                			$rootScope.isCusEmptyUpdate = true;
				                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改客户限制多条时入账币种
				                			if($rootScope.cusUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUCus.currencyCode){
				                				//修改客户限制信息===页面有值 取页面
				                				$scope.cusUpdateLimitList(index);
				                			}else{
				                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
				                			 	$scope.limitListUpdateSql(data.returnData.rows);
				                			}
				                	}
				                }
				            });
						}else if($scope.updateList.differentType == "2" || $scope.updateList.differentType == "3"){
							if($scope.updateList.differentType == "2"){
								$scope.conlimitSel.idType = $rootScope.selIdType;
								$scope.conlimitSel.idNumber = $rootScope.selIdNum;
							}else if($scope.updateList.differentType == "3"){
								$scope.conlimitSel.differentCode = $rootScope.selDifferentCode;
					  			$scope.conlimitSel.externalIdentificationNo = $rootScope.selDifferentCode;
							}
							jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	$scope.conlimitSel.differentCode = $scope.updateList.differentCode;
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyUpdate = true;
			                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.cusUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUCus.currencyCode){
			                				//修改客户限制信息===页面有值 取页面
			                				$scope.cusUpdateLimitList(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
			                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
			                    				buttons : [ T.T('F00031'), T.T('F00012')],
			                    				size : [ '970px', '530px' ],
			                    				callbacks : [$scope.updateLimitInfoAdd ]
			                    			});
			                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.cusUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUCus.currencyCode){
			                				//修改客户限制信息===页面有值 取页面
			                				$scope.cusUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}else if($scope.updateList.differentType == "0"){
							$scope.conlimitSel.differentCode = "";
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
				                			$rootScope.isCusEmptyUpdate = true;
				                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改客户限制多条时入账币种
				                			if($rootScope.cusUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUCus.currencyCode){
				                				//修改客户限制信息===页面有值 取页面
				                				$scope.cusUpdateLimitList(index);
				                			}else{
				                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				                    				buttons : [ T.T('F00031'), T.T('F00012')],
				                    				size : [ '970px', '530px' ],
				                    				callbacks : [$scope.updateLimitInfoAdd ]
				                    			});
				                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改客户限制多条时入账币种
			                			if($rootScope.cusUpdateListTwo[index].limitSingleTransFlag && $scope.currencyCodeOld == itemUCus.currencyCode){
			                				//修改客户限制信息===页面有值 取页面
			                				$scope.cusUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}
		 			}else{
		 				jfLayer.fail(T.T('SQJ1700060'));
		 			}
		 		}else{
		 			jfLayer.fail(T.T('SQJ1700050'));
		 		}
		 	};
		 	//修改媒介限制信息===页面有值 取页面
		 	$scope.exterUpdateLimitList = function(index){
		 		$scope.conlimitSel.supplyControlFlag = $rootScope.exterUpdateListTwo[index].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = $rootScope.exterUpdateListTwo[index].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = $rootScope.exterUpdateListTwo[index].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = $rootScope.exterUpdateListTwo[index].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.exterUpdateListTwo[index].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = $rootScope.exterUpdateListTwo[index].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = $rootScope.exterUpdateListTwo[index].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = $rootScope.exterUpdateListTwo[index].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = $rootScope.exterUpdateListTwo[index].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = $rootScope.exterUpdateListTwo[index].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = $rootScope.exterUpdateListTwo[index].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.exterUpdateListTwo[index].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = $rootScope.exterUpdateListTwo[index].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = $rootScope.exterUpdateListTwo[index].numberYearTrans;
        		$scope.conlimitSel.version = $rootScope.exterUpdateListTwo[index].version;
        		$scope.conlimitSel.id = $rootScope.exterUpdateListTwo[index].id;
        		$scope.conlimitSel.limitCycleTransFlag = $rootScope.exterUpdateListTwo[index].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = $rootScope.exterUpdateListTwo[index].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.exterUpdateListTwo[index].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.exterUpdateListTwo[index].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = $rootScope.exterUpdateListTwo[index].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = $rootScope.exterUpdateListTwo[index].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = $rootScope.exterUpdateListTwo[index].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = $rootScope.exterUpdateListTwo[index].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = $rootScope.exterUpdateListTwo[index].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.exterUpdateListTwo[index].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.exterUpdateListTwo[index].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = $rootScope.exterUpdateListTwo[index].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = $rootScope.exterUpdateListTwo[index].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updatelimitList]
    			});
		 	}
			//媒介层限制详情======增加交易限制=========多个
			$scope.exceUpdateAdd = function(index,itemExceU){
				if($rootScope.exterUpdateListTwo.length>0){
					for(var i=0;i<$rootScope.exterUpdateListTwo.length;i++){
						if($rootScope.exterUpdateListTwo[i].currencyCode != $scope.exterUpdateListTwoCur[i]){
							$scope.exterUpdateListTwoCur.push($rootScope.exterUpdateListTwo[i].currencyCode);
						}
					}
				}
				var currencyCodeOld = "";
				if($scope.updateList.mediaLimitList.length >index){
					currencyCodeOld = $scope.exterUpdateListTwoCur[index];
		 		}else{
		 			if($rootScope.exterUpdateListTwo.length > 0){
		 				currencyCodeOld = $rootScope.exterUpdateListTwo[index].currencyCode;
		 			}else{
		 				currencyCodeOld = "";
		 			}
		 		}
				if(itemExceU.currencyCode){
					if(itemExceU.mandatoryInspectionFlag){
						$rootScope.isExceEmptyUpdate = false;
						$scope.conlimitSel = {};
						$scope.conlimitSel.authDataSynFlag = "1";
						$scope.conlimitSel.operationMode = $scope.updateList.operationMode;   //运营模式
						$scope.conlimitSel.levelFlag = 'M';   //限制层级  客户层C  媒介层M
						$scope.conlimitSel.differentType = $scope.updateList.differentType;   //差异类型
						$scope.conlimitSel.transLimitCode = $scope.updateList.contrlSceneCode;    //交易限制码
						$scope.conlimitSel.currencyCode = itemExceU.currencyCode;
						$scope.conlimitSel.mandatoryInspectionFlag = itemExceU.mandatoryInspectionFlag;
						if($scope.updateList.differentType == "1" || $scope.updateList.differentType == "4"){
							if($scope.updateList.differentType == "1"){
								$scope.conlimitSel.differentCode = $scope.riskLevelUpdate;
							}else if($scope.updateList.differentType == "4"){
								$scope.conlimitSel.differentCode = $scope.projectCodeUpdate;
							}
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
				            			$rootScope.isExceEmptyUpdate = true;
				            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改媒介限制多条时入账币种
				            			if($rootScope.exterUpdateListTwo[index].limitSingleTransFlag && currencyCodeOld == itemExceU.currencyCode){
				            				//修改媒介限制信息===页面有值 取页面
				            			 	$scope.exterUpdateLimitList(index);
				            			}else{
				            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				        	        	 			title : T.T('SQJ1700047'),
				        	        				buttons : [ T.T('F00031'), T.T('F00012')],
				        	        				size : [ '970px', '530px' ],
				        	        				callbacks : [$scope.updateLimitInfoAdd ]
				        	        			});
				            			}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			                			$rootScope.isExceEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改媒介限制多条时入账币种
			                			if($rootScope.exterUpdateListTwo[index].limitSingleTransFlag && currencyCodeOld == itemExceU.currencyCode){
			                				//修改媒介限制信息===页面有值 取页面
				            			 	$scope.exterUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}else if($scope.updateList.differentType == "2" || $scope.updateList.differentType == "3"){
							if($scope.updateList.differentType == "2"){
								$scope.conlimitSel.idType = $rootScope.selIdType;
								$scope.conlimitSel.idNumber = $rootScope.selIdNum;
							}else if($scope.updateList.differentType == "3"){
								$scope.conlimitSel.differentCode = $rootScope.selDifferentCode;
								$scope.conlimitSel.externalIdentificationNo = $rootScope.selDifferentCode;
							}
							jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	$scope.conlimitSel.differentCode = $scope.updateList.differentCode;
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
				            			$rootScope.isExceEmptyUpdate = true;
				            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改媒介限制多条时入账币种
				            			if($rootScope.exterUpdateListTwo[index].limitSingleTransFlag && currencyCodeOld == itemExceU.currencyCode){
				            				//修改媒介限制信息===页面有值 取页面
				            			 	$scope.exterUpdateLimitList(index);
				            			}else{
				            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				        	        	 			title : T.T('SQJ1700047'),
				        	        				buttons : [ T.T('F00031'), T.T('F00012')],
				        	        				size : [ '970px', '530px' ],
				        	        				callbacks : [$scope.updateLimitInfoAdd ]
				        	        			});
				            			}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			                			$rootScope.isExceEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改媒介限制多条时入账币种
			                			if($rootScope.exterUpdateListTwo[index].limitSingleTransFlag && currencyCodeOld == itemExceU.currencyCode){
			                				//修改媒介限制信息===页面有值 取页面
				            			 	$scope.exterUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}else if($scope.updateList.differentType == "0"){
							$scope.conlimitSel.differentCode = "";
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
					            			$rootScope.isExceEmptyUpdate = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========修改媒介限制多条时入账币种
					            			if($rootScope.exterUpdateListTwo[index].limitSingleTransFlag && currencyCodeOld == itemExceU.currencyCode){
					            				//修改媒介限制信息===页面有值 取页面
					            			 	$scope.exterUpdateLimitList(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				        	        	 			title : T.T('SQJ1700047'),
				        	        				buttons : [ T.T('F00031'), T.T('F00012')],
				        	        				size : [ '970px', '530px' ],
				        	        				callbacks : [$scope.updateLimitInfoAdd ]
				        	        			});
					            			}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			                			$rootScope.isExceEmptyUpdate = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的数据供修改，提取公共方法=========修改媒介限制多条时入账币种
			                			if($rootScope.exterUpdateListTwo[index].limitSingleTransFlag && currencyCodeOld == itemExceU.currencyCode){
			                				//修改媒介限制信息===页面有值 取页面
				            			 	$scope.exterUpdateLimitList(index);
			                			}else{
			                				//修改限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListUpdateSql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}
					}else{
						jfLayer.fail(T.T('SQJ1700060'));   //"请设置强制检查标志！");
					}
				}else{
					jfLayer.fail(T.T('SQJ1700052'));   //"请选择媒介层交易的对应限制币种！");
				}
			};
	});
	// 交易管控建立
	webApp.controller('controlDiffAddCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.diff = {};
		$scope.differentTypeAdd = '无';   //建立时默认为基准，固定值0无
		$scope.isControlScene = false;  //如果设置关联管控标识为Y，关联管控场景显示并必填，如果为N，不显示不填
		$scope.isDifferentFlagA = false;  //如果设置允许差异化为Y，差异化类型显示并必填，如果为N，不显示不填
		$scope.isB = false;        //正负面清单检查标志为Y时显示
		$scope.isN = false;        //交易限制检查标志为Y时显示
		 $scope.crryArray = {};
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArrayAdd ={ 
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
		 //联动验证=====额度节点
		 $scope.creditNodeNoArrayAdd = {};
		 //管控场景代码
		 $scope.controlSceneAddArr = {};
		 var form = layui.form;
		 //根据运营模式得额度节点及管控场景
		 form.on('select(operationModeAdd)',function(event){
			if(event.value){	
				 //额度节点下拉列表框
				 $scope.creditNodeNoArrayAdd = {
						 type:"dynamicDesc", 
						 param:{
					       creditNodeTyp:"B",
					       authDataSynFlag:"1",
					       operationMode:event.value
				        },
				        text:"creditNodeNo",
				        desc:"creditDesc",
				        value:"creditNodeNo",
				        resource : 'quotatree.queryList',
				        callback:function(data){
			        }
		       }
				//管控场景下拉列表框
				 $scope.controlSceneAddArr = {
						 type:"dynamicDesc", 
						 param:{
					       authDataSynFlag:'1',
					       differentType:'0',
					       operationMode:event.value
				        },
				        text:"contrlSceneCode",
				        desc:"contrlSceneDesc",
				        value:"contrlSceneCode",
				        resource : 'diffQueryb.query',
				        callback:function(data){
			        }
		       }
				 //根据运营模式得运营币种
				 $scope.params = {
						 "operationMode":$scope.diff.operationMode, 
				 };
				 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
					 $scope.crryArray = data.returnData.rows;
				 });
			}
		 });
		 //根据管控标识得管控场景
		 form.on('select(getContRelFlag)',function(event){
			if(event.value){	
				 if(event.value == 'Y'){
					 $scope.isControlScene = true;  //如果设置关联管控标识为Y，关联管控场景显示并必填，如果为N，不显示不填
				 }else if(event.value == 'N'){
					 $scope.isControlScene = false;  //如果设置关联管控标识为Y，关联管控场景显示并必填，如果为N，不显示不填
					 $scope.diff.controlSceneCodeRel = "";
				 }
			}
		 });
		//根据允许差异化类型得差异化类型
		 form.on('select(getDifferentFlagA)',function(event){
			if(event.value){	
				 if(event.value == 'Y'){
					 $scope.isDifferentFlagA = true;  //如果设置关联管控标识为Y，关联管控场景显示并必填，如果为N，不显示不填
				 }else if(event.value == 'N'){
					 $scope.isDifferentFlagA = false;  //如果设置关联管控标识为Y，关联管控场景显示并必填，如果为N，不显示不填
					 $scope.diff.differentFlagType = "";
				 }
			}
		 });
		 //根据正负面清单检查标志得是否检查信息
		 form.on('select(getRiskLimits)',function(event){
			if(event.value == "B"){
				$scope.diff.listCheckType = "";
				$scope.isB = false;
			}
			else{
				$scope.isB = true;
			}
		});
		//封装显示客户媒介产品限制信息
		$scope.defaultN = function(){
			$scope.isStepCus = false;
			$scope.isAddCusType = false;
			$scope.isTwo = false;
			$scope.isOne = false;
			$scope.isStepExce = false;
			$scope.isAddExceType = false;
			$scope.isStepPro = false;
			$scope.isAddPType = false;
			$rootScope.isCusEmpty = false;
		    $rootScope.isExceEmpty = false;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [];
			$rootScope.cusListTwo = [];
			$rootScope.pListTwo = [];
		};
		$scope.zeroM = function(){
			$scope.isStepExce = true;
			$scope.isAddExceType = false;
			$scope.isOne = true;
			$scope.isTwo = false;
			$scope.isStepCus = false;
			$scope.isAddCusType = false;
			$scope.isStepPro = false;
			$scope.isAddPType = false;
			$rootScope.isCusEmpty = false;
		    $rootScope.isExceEmpty = true;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [{}];
			$rootScope.cusListTwo = [];
			$rootScope.pListTwo = [];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.zeroC = function(){
			$scope.isStepCus = true;
			$scope.isStepExce = false;
			$scope.isStepPro = false;
			$scope.isAddCusType = false;
			$scope.isOne = true;
			$scope.isTwo = false;
			$rootScope.isCusEmpty = true;
		    $rootScope.isExceEmpty = false;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [];
			$rootScope.cusListTwo = [{}];
			$rootScope.pListTwo = [];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.zeroP = function(){
			$scope.isStepPro = true;
			$scope.isAddPType = false;
			$scope.isStepCus = false;
			$scope.isAddCusType = false;
			$scope.isTwo = false;
			$scope.isOne = true;
			$scope.isStepExce = false;
			$scope.isAddExceType = false;
			$rootScope.isCusEmpty = false;
		    $rootScope.isExceEmpty = false;
		    $rootScope.isPEmpty = true;
		    $rootScope.exterListTwo = [];
			$rootScope.cusListTwo = [];
			$rootScope.pListTwo = [{}];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.zeroB = function(){
			$scope.isStepCus = true;
			$scope.isStepExce = true;
			$scope.isStepPro = false;
			$scope.isAddCusType = false;
			$scope.isOne = true;
			$scope.isTwo = false;
			$scope.isAddExceType = false;
			$scope.isAddCusType = false;
			$scope.isAddPType = false;
			$rootScope.isCusEmpty = true;
		    $rootScope.isExceEmpty = true;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [{}];
			$rootScope.cusListTwo = [{}];
			$rootScope.pListTwo = [];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.oneM = function(){
			$scope.isStepExce = true;
			$scope.isAddExceType = true;
			$scope.isTwo = true;
			$scope.isOne = false;
			$scope.isStepCus = false;
			$scope.isAddCusType = false;
			$scope.isStepPro = false;
			$scope.isAddPType = false;
			$rootScope.isCusEmpty = false;
		    $rootScope.isExceEmpty = true;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [{}];
			$rootScope.cusListTwo = [];
			$rootScope.pListTwo = [];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.oneC = function(){
			$scope.isStepCus = true;
			$scope.isAddCusType = true;
			$scope.isTwo = true;
			$scope.isOne = false;
			$scope.isStepExce = false;
			$scope.isAddExceType = false;
			$scope.isStepPro = false;
			$scope.isAddPType = false;
			$rootScope.isCusEmpty = true;
		    $rootScope.isExceEmpty = false;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [];
			$rootScope.cusListTwo = [{}];
			$rootScope.pListTwo = [];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.oneP = function(){
			$scope.isStepPro = true;
			$scope.isStepCus = false;
			$scope.isStepExce = false;
			$scope.isAddPType = true;
			$scope.isAddCusType = false;
			$scope.isAddExceType = false;
			$scope.isTwo = true;
			$scope.isOne = false;
			$rootScope.isCusEmpty = false;
		    $rootScope.isExceEmpty = false;
		    $rootScope.isPEmpty = true;
		    $rootScope.exterListTwo = [];
			$rootScope.cusListTwo = [];
			$rootScope.pListTwo = [{}];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.oneB = function(){
			$scope.isStepCus = true;
			$scope.isStepExce = true;
			$scope.isStepPro = false;
			$scope.isTwo = true;
			$scope.isOne = false;
			$scope.isAddCusType = true;
			$scope.isAddExceType = true;
			$scope.isAddPType = false;
			$rootScope.isCusEmpty = true;
		    $rootScope.isExceEmpty = true;
		    $rootScope.isPEmpty = false;
		    $rootScope.exterListTwo = [{}];
			$rootScope.cusListTwo = [{}];
			$rootScope.pListTwo = [];
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.defaultN();
		 //根据交易限制检查标志得限制信息
		form.on('select(getTransLimitLev)',function(event){
			if(event.value == "N"){
				$scope.diff.transLimitCurrCode = "";
				$scope.isN = false;
				$scope.defaultN();
			}
			else{
				$scope.isN = true;
				if($scope.diff.transLimitCurrCode){
					if($scope.diff.transLimitCurrCode == '0'){//运营币种
						if(event.value == 'M'){
							$scope.zeroM();
						}else if(event.value == 'C'){
							$scope.zeroC();
						}else if(event.value == 'P'){
							$scope.zeroP();
						}else if(event.value == 'B'){
							$scope.zeroB();
						}
					}else if($scope.diff.transLimitCurrCode == '1'){ //入账币种
						if($scope.diff.transLimitLev == 'M'){
							$scope.oneM();
						}else if($scope.diff.transLimitLev == 'C'){
							$scope.oneC();
						}else if($scope.diff.transLimitLev == 'P'){
							$scope.oneP();
						}else if($scope.diff.transLimitLev == 'B'){
							$scope.oneB();
						}
					}
				}
			}
		});
		 //根据限制币种及限制层级显示限制信息
		form.on('select(getTransLimitCurr)',function(event){
			if(event.value == "0"){  //运营币种====1个
				if($scope.diff.transLimitLev == 'M'){
					$scope.zeroM();
				}else if($scope.diff.transLimitLev == 'C'){
					$scope.zeroC();
				}else if($scope.diff.transLimitLev == 'P'){
					$scope.zeroP();
				}else if($scope.diff.transLimitLev == 'B'){
					$scope.zeroB();
				}else if($scope.diff.transLimitLev == 'N'){
					$scope.defaultN();
				}
			}else if(event.value == "1"){  //入账币种 =======   多个
				if($scope.diff.transLimitLev == 'M'){
					$scope.oneM();
				}else if($scope.diff.transLimitLev == 'C'){
					$scope.oneC();
				}else if($scope.diff.transLimitLev == 'P'){
					$scope.oneP();
				}else if($scope.diff.transLimitLev == 'B'){
					$scope.oneB();
				}else if($scope.diff.transLimitLev == 'N'){
					$scope.defaultN();
				}
			}
		});
		//自定义下拉框--------缺省 标识0/1
			$scope.independentArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ZorO",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//自定义下拉框--------溢缴款 标识  交易累计标识   关联管控标识  Y/N
			$scope.OCFalgArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//自定义下拉框--------正负面清单检查标志
			$scope.checkArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_checkList",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        }
				};
			//正负面清单层级限制-----复选框
			$scope.negArray = [{name : T.T('SQJ1700008') ,id : 'CN'},
			                   {name : T.T('SQJ1700009') ,id : 'MH'},
			                   {name : T.T('SQH1700080') ,id : 'TM'},
			                   {name : T.T('SQH1700102') ,id : 'MN'},
			                   {name : T.T('SQH1700108') ,id : 'MC'}];
			//自定义下拉框--------交易限制层级限制
			$scope.leveArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_leveList",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        }
				};
			//自定义下拉框--------限制币种
			$scope.currcyArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_currcyType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        }
				};
			//因是循环里的特殊处理，所以此处不动态获取
			$scope.YNArray = [{name : T.T('SQJ1700010') ,id : 'Y'},{name : T.T('SQJ1700011') ,id : 'N'}];
			//差异化类型
	        $scope.difFlagTypeArray = [{name : T.T('SQH1700115') ,id : 'C'},
	                                   {name : T.T('SQH1700116') ,id : 'M'},
	                                   {name : T.T('SQH1700117') ,id : 'P'},
	                                   {name : T.T('SQH1700118') ,id : 'R'}];
			//自定义下拉框--------限制币种======只有人民币
			$scope.cur156Array = {};
			 $scope.params = {
				 corporationEntityNo:$scope.corporationId,
				 requestType:"1",
				 resultType:"1"
			 };
			 jfRest.request('legalEntity', 'query', $scope.params).then(function(data) {
				 $scope.cur156Array = data.returnData.rows;
			 });
		//产品层交易限制--增加
	 	$scope.listTypePAdd = function(){
 			if($rootScope.pListTwo == []){
 				$rootScope.pListTwo = [{}];
	 		}
	 		else{
	 			$rootScope.pListTwo.splice($rootScope.pListTwo.length,0,{});
	 		}
 			if($rootScope.pListTwo.length >= $scope.crryArray.length){
 				$scope.isAddPType = false;
 			}else{
 				$scope.isAddPType = true;
 			}
 			$timeout(function() {
				Tansun.plugins.render('select');
			});
	 	};
	 	//产品层交易限制-----删除
	 	$scope.pTypeTwoDel = function(e,$index){
	 		$rootScope.pListTwo.splice(e,1);
	 		if($rootScope.pListTwo.length >= $scope.crryArray.length){
 				$scope.isAddPType = false;
 			}else{
 				$scope.isAddPType = true;
 			}
	 	}
	 	//媒介层交易限制--增加
	 	$scope.listTypeAdd = function(){
 			if($rootScope.exterListTwo == []){
 				$rootScope.exterListTwo = [{}];
	 		}
	 		else{
	 			$rootScope.exterListTwo.splice($rootScope.exterListTwo.length,0,{});
	 		}
 			if($rootScope.exterListTwo.length >= $scope.crryArray.length){
 				$scope.isAddExceType = false;
 			}else{
 				$scope.isAddExceType = true;
 			}
 			$timeout(function() {
				Tansun.plugins.render('select');
			});
	 	};
	 	//媒介层交易限制-----删除
	 	$scope.exceTypeDel = function(e,$index){
	 		$rootScope.exterListTwo.splice(e,1);
	 		if($rootScope.exterListTwo.length >= $scope.crryArray.length){
 				$scope.isAddExceType = false;
 			}else{
 				$scope.isAddExceType = true;
 			}
	 	}
	 	//客户层交易限制--增加
	 	$scope.listTypeCusAdd = function(){
 			if($rootScope.cusListTwo == []){
 				$rootScope.cusListTwo = [{}];
	 		}
	 		else{
	 			$rootScope.cusListTwo.splice($rootScope.cusListTwo.length,0,{});
	 		}
 			if($rootScope.cusListTwo.length >= $scope.crryArray.length){
 				$scope.isAddCusType = false;
 			}else{
 				$scope.isAddCusType = true;
 			}
 			$timeout(function() {
 				Tansun.plugins.render('select');
 			});
	 	};
	 	//客户层交易限制-----删除
	 	$scope.cusTypeDelTwo = function(e,$index){
	 		$rootScope.cusListTwo.splice(e,1);
	 		if($rootScope.cusListTwo.length >= $scope.crryArray.length){
 				$scope.isAddCusType = false;
 			}else{
 				$scope.isAddCusType = true;
 			}
	 	}
		// 保存信息事件======产品层限制信息========新增 ==============多个
		$scope.updateLimitListAdd = function(result) {
			$scope.controllimitPAddInfo = {};
			$scope.controllimitPAddInfo = $.parseJSON(JSON.stringify(result.scope.conlimitSel));
			$scope.controllimitPAddInfo.limitSingleTransFlag = result.scope.limitSingleTransFlagU;
			$scope.controllimitPAddInfo.limitDayTransFlag = result.scope.limitDayTransFlagU;
			$scope.controllimitPAddInfo.limitCycleTransFlag = result.scope.limitCycleTransFlagU;
			$scope.controllimitPAddInfo.limitMonthTransFlag = result.scope.limitMonthTransFlagU;
			$scope.controllimitPAddInfo.limitHalfYearTransFlag = result.scope.limitHalfYearTransFlagU;
			$scope.controllimitPAddInfo.limitYearTransFlag = result.scope.limitYearTransFlagU;
			$scope.controllimitPAddInfo.limitLifeCycleTransFlag = result.scope.limitLifeCycleTransFlagU;
			$scope.controllimitPAddInfo.numberDayTransFlag = result.scope.numberDayTransFlagU;
			$scope.controllimitPAddInfo.numberCycleTransFlag = result.scope.numberCycleTransFlagU;
			$scope.controllimitPAddInfo.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
			$scope.controllimitPAddInfo.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
			$scope.controllimitPAddInfo.numberHalfYearTransFlag = result.scope.numberHalfYearTransFlagU;
			$scope.controllimitPAddInfo.numberLifeCycleTransFlag = result.scope.numberLifeCycleTransFlagU;
			if($scope.controllimitPAddInfo.limitSingleTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitSingleTrans){
					jfLayer.alert(T.T('SQJ1700070'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.limitDayTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitDayTrans){
					jfLayer.alert(T.T('SQJ1700071'));
					return;
				}
			};	                		
			if($scope.controllimitPAddInfo.limitCycleTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitCycleTrans){
					jfLayer.alert(T.T('SQJ1700072'));
					return;
				}
			};	                		
			if($scope.controllimitPAddInfo.limitMonthTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitMonthTrans){
					jfLayer.alert(T.T('SQJ1700073'));
					return;
				}
			};		                		
			if($scope.controllimitPAddInfo.limitHalfYearTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitHalfYearTrans){
					jfLayer.alert(T.T('SQJ1700074'));
					return;
				}
			};	                		
    		if($scope.controllimitPAddInfo.limitYearTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitYearTrans){
					jfLayer.alert(T.T('SQJ1700075'));
					return;
				}
			};		                	
			if($scope.controllimitPAddInfo.limitLifeCycleTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.limitLifeCycleTrans){
					jfLayer.alert(T.T('SQJ1700076'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.numberDayTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.numberDayTrans){
					jfLayer.alert(T.T('SQJ1700077'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.numberCycleTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.numberCycleTrans){
					jfLayer.alert(T.T('SQJ1700078'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.numberMonthTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.numberMonthTrans){
					jfLayer.alert(T.T('SQJ1700079'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.numberHalfYearTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.numberHalfYearTrans){
					jfLayer.alert(T.T('SQJ1700080'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.numberYearTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.numberYearTrans){
					jfLayer.alert(T.T('SQJ1700081'));
					return;
				}
			};
			if($scope.controllimitPAddInfo.numberLifeCycleTransFlag == 'Y'){
				if(!$scope.controllimitPAddInfo.numberLifeCycleTrans){
					jfLayer.alert(T.T('SQJ1700082'));
					return;
				}
			};
			$scope.controllimitPAddInfo.operationMode = $scope.conlimitSel.operationMode;
			$scope.controllimitPAddInfo.transLimitCode = $scope.conlimitSel.transLimitCode;
			$scope.controllimitPAddInfo.levelFlag = $scope.conlimitSel.levelFlag;
			$scope.controllimitPAddInfo.currencyCode = $scope.conlimitSel.currencyCode;
			$scope.controllimitPAddInfo.mandatoryInspectionFlag = $scope.conlimitSel.mandatoryInspectionFlag;
			$scope.controllimitPAddInfo.differentType = $scope.conlimitSel.differentType;
			if($scope.controllimitPAddInfo.levelFlag == 'P'){
				if($rootScope.pListTwo.length > 0){
					for(var n=0;n<$rootScope.pListTwo.length;n++){
						if($scope.controllimitPAddInfo.currencyCode == $rootScope.pListTwo[n].currencyCode){
							$rootScope.pListTwo.splice(n, 1);
						}
					}
				}
				$rootScope.pListTwo.push($scope.controllimitPAddInfo);
			}else if($scope.controllimitPAddInfo.levelFlag == 'C'){
				if($rootScope.cusListTwo.length > 0){
					for(var n=0;n<$rootScope.cusListTwo.length;n++){
						if($scope.controllimitPAddInfo.currencyCode == $rootScope.cusListTwo[n].currencyCode){
							$rootScope.cusListTwo.splice(n, 1);
						}
					}
				}
				$rootScope.cusListTwo.push($scope.controllimitPAddInfo);
			}else if($scope.controllimitPAddInfo.levelFlag == 'M'){
				if($rootScope.exterListTwo.length > 0){
					for(var n=0;n<$rootScope.exterListTwo.length;n++){
						if($scope.controllimitPAddInfo.currencyCode == $rootScope.exterListTwo[n].currencyCode){
							$rootScope.exterListTwo.splice(n, 1);
						}
					}
				}
				$rootScope.exterListTwo.push($scope.controllimitPAddInfo)
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.safeApply();
			result.cancel();
		};
		// 保存信息事件======产品层限制信息========新增===========多个
		$scope.addLimitInfoAdd = function(result) {
			$scope.limitAddList = {};
			$scope.limitAddList = $.parseJSON(JSON.stringify(result.scope.conlimitSel));
			if($scope.limitAddList.limitSingleTransFlag == 'Y'){
				if(!$scope.limitAddList.limitSingleTrans){
					jfLayer.alert(T.T('SQJ1700070'));
					return;
				}
			};
			if($scope.limitAddList.limitDayTransFlag == 'Y'){
				if(!$scope.limitAddList.limitDayTrans){
					jfLayer.alert(T.T('SQJ1700071'));
					return;
				}
			};	                		
			if($scope.limitAddList.limitCycleTransFlag == 'Y'){
				if(!$scope.limitAddList.limitCycleTrans){
					jfLayer.alert(T.T('SQJ1700072'));
					return;
				}
			};	                		
			if($scope.limitAddList.limitMonthTransFlag == 'Y'){
				if(!$scope.limitAddList.limitMonthTrans){
					jfLayer.alert(T.T('SQJ1700073'));
					return;
				}
			};		                		
			if($scope.limitAddList.limitHalfYearTransFlag == 'Y'){
				if(!$scope.limitAddList.limitHalfYearTrans){
					jfLayer.alert(T.T('SQJ1700074'));
					return;
				}
			};	                		
    		if($scope.limitAddList.limitYearTransFlag == 'Y'){
				if(!$scope.limitAddList.limitYearTrans){
					jfLayer.alert(T.T('SQJ1700075'));
					return;
				}
			};		                	
			if($scope.limitAddList.limitLifeCycleTransFlag == 'Y'){
				if(!$scope.limitAddList.limitLifeCycleTrans){
					jfLayer.alert(T.T('SQJ1700076'));
					return;
				}
			};
			if($scope.limitAddList.numberDayTransFlag == 'Y'){
				if(!$scope.limitAddList.numberDayTrans){
					jfLayer.alert(T.T('SQJ1700077'));
					return;
				}
			};
			if($scope.limitAddList.numberCycleTransFlag == 'Y'){
				if(!$scope.limitAddList.numberCycleTrans){
					jfLayer.alert(T.T('SQJ1700078'));
					return;
				}
			};
			if($scope.limitAddList.numberMonthTransFlag == 'Y'){
				if(!$scope.limitAddList.numberMonthTrans){
					jfLayer.alert(T.T('SQJ1700079'));
					return;
				}
			};
			if($scope.limitAddList.numberHalfYearTransFlag == 'Y'){
				if(!$scope.limitAddList.numberHalfYearTrans){
					jfLayer.alert(T.T('SQJ1700080'));
					return;
				}
			};
			if($scope.limitAddList.numberYearTransFlag == 'Y'){
				if(!$scope.limitAddList.numberYearTrans){
					jfLayer.alert(T.T('SQJ1700081'));
					return;
				}
			};
			if($scope.limitAddList.numberLifeCycleTransFlag == 'Y'){
				if(!$scope.limitAddList.numberLifeCycleTrans){
					jfLayer.alert(T.T('SQJ1700082'));
					return;
				}
			};
			if($scope.limitAddList.levelFlag == 'P'){
				if($rootScope.pListTwo.length > 0){
					for(var n=0;n<$rootScope.pListTwo.length;n++){
						if($scope.limitAddList.currencyCode == $rootScope.pListTwo[n].currencyCode){
							$rootScope.pListTwo.splice(n, 1);
						}
					}
				}
				$rootScope.pListTwo.push($scope.limitAddList);
			}else if($scope.limitAddList.levelFlag == 'C'){
				if($rootScope.cusListTwo.length > 0){
					for(var n=0;n<$rootScope.cusListTwo.length;n++){
						if($scope.limitAddList.currencyCode == $rootScope.cusListTwo[n].currencyCode){
							$rootScope.cusListTwo.splice(n, 1);
						}
					}
				}
				$rootScope.cusListTwo.push($scope.limitAddList);
			}else if($scope.limitAddList.levelFlag == 'M'){
				if($rootScope.exterListTwo.length > 0){
					for(var n=0;n<$rootScope.exterListTwo.length;n++){
						if($scope.limitAddList.currencyCode == $rootScope.exterListTwo[n].currencyCode){
							$rootScope.exterListTwo.splice(n, 1);
						}
					}
				}
				$rootScope.exterListTwo.push($scope.limitAddList);
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.safeApply();
			result.cancel();
		};
	 	//新增限制===页面无值 取数据库=====客户，媒介，产品共用
	 	$scope.limitListAddSql = function(result){
	 		$scope.conlimitSel.supplyControlFlag = result[0].supplyControlFlag;
    		$scope.conlimitSel.limitCycleTrans = result[0].limitCycleTrans;
    		$scope.conlimitSel.limitDayTrans = result[0].limitDayTrans;		                		
    		$scope.conlimitSel.limitHalfYearTrans = result[0].limitHalfYearTrans;		                		
    		$scope.conlimitSel.limitLifeCycleTrans = result[0].limitLifeCycleTrans;		                		
    		$scope.conlimitSel.limitMonthTrans = result[0].limitMonthTrans;		                		
    		$scope.conlimitSel.limitSingleTrans = result[0].limitSingleTrans;		                	
    		$scope.conlimitSel.limitYearTrans = result[0].limitYearTrans;
    		$scope.conlimitSel.numberCycleTrans = result[0].numberCycleTrans;
    		$scope.conlimitSel.numberDayTrans = result[0].numberDayTrans;
    		$scope.conlimitSel.numberHalfYearTrans = result[0].numberHalfYearTrans;
    		$scope.conlimitSel.numberLifeCycleTrans = result[0].numberLifeCycleTrans;
    		$scope.conlimitSel.numberMonthTrans = result[0].numberMonthTrans;
    		$scope.conlimitSel.numberYearTrans = result[0].numberYearTrans;
    		$scope.conlimitSel.limitCycleTransFlag = result[0].limitCycleTransFlag;
    		$scope.conlimitSel.limitDayTransFlag = result[0].limitDayTransFlag;		                		
    		$scope.conlimitSel.limitHalfYearTransFlag = result[0].limitHalfYearTransFlag;		                		
    		$scope.conlimitSel.limitLifeCycleTransFlag = result[0].limitLifeCycleTransFlag;		                		
    		$scope.conlimitSel.limitMonthTransFlag = result[0].limitMonthTransFlag;		                		
    		$scope.conlimitSel.limitSingleTransFlag = result[0].limitSingleTransFlag;		                	
    		$scope.conlimitSel.limitYearTransFlag = result[0].limitYearTransFlag;
    		$scope.conlimitSel.numberCycleTransFlag = result[0].numberCycleTransFlag;
    		$scope.conlimitSel.numberDayTransFlag = result[0].numberDayTransFlag;
    		$scope.conlimitSel.numberHalfYearTransFlag = result[0].numberHalfYearTransFlag;
    		$scope.conlimitSel.numberLifeCycleTransFlag = result[0].numberLifeCycleTransFlag;
    		$scope.conlimitSel.numberMonthTransFlag = result[0].numberMonthTransFlag;
    		$scope.conlimitSel.numberYearTransFlag = result[0].numberYearTransFlag;
    		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				buttons : [ T.T('F00031'), T.T('F00012')],
				size : [ '970px', '530px' ],
				callbacks : [$scope.updateLimitListAdd]
			});
	 	};
	 	//提取产品修改页面缓存限制信息方法
		$scope.cusAddProListUpdate = function(index){
	 		$scope.conlimitSel.supplyControlFlag = $rootScope.pListTwo[index].supplyControlFlag;
    		$scope.conlimitSel.limitCycleTrans = $rootScope.pListTwo[index].limitCycleTrans;
    		$scope.conlimitSel.limitDayTrans = $rootScope.pListTwo[index].limitDayTrans;		                		
    		$scope.conlimitSel.limitHalfYearTrans = $rootScope.pListTwo[index].limitHalfYearTrans;		                		
    		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.pListTwo[index].limitLifeCycleTrans;		                		
    		$scope.conlimitSel.limitMonthTrans = $rootScope.pListTwo[index].limitMonthTrans;		                		
    		$scope.conlimitSel.limitSingleTrans = $rootScope.pListTwo[index].limitSingleTrans;		                	
    		$scope.conlimitSel.limitYearTrans = $rootScope.pListTwo[index].limitYearTrans;
    		$scope.conlimitSel.numberCycleTrans = $rootScope.pListTwo[index].numberCycleTrans;
    		$scope.conlimitSel.numberDayTrans = $rootScope.pListTwo[index].numberDayTrans;
    		$scope.conlimitSel.numberHalfYearTrans = $rootScope.pListTwo[index].numberHalfYearTrans;
    		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.pListTwo[index].numberLifeCycleTrans;
    		$scope.conlimitSel.numberMonthTrans = $rootScope.pListTwo[index].numberMonthTrans;
    		$scope.conlimitSel.numberYearTrans = $rootScope.pListTwo[index].numberYearTrans;
    		$scope.conlimitSel.limitCycleTransFlag = $rootScope.pListTwo[index].limitCycleTransFlag;
    		$scope.conlimitSel.limitDayTransFlag = $rootScope.pListTwo[index].limitDayTransFlag;		                		
    		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.pListTwo[index].limitHalfYearTransFlag;		                		
    		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.pListTwo[index].limitLifeCycleTransFlag;		                		
    		$scope.conlimitSel.limitMonthTransFlag = $rootScope.pListTwo[index].limitMonthTransFlag;		                		
    		$scope.conlimitSel.limitSingleTransFlag = $rootScope.pListTwo[index].limitSingleTransFlag;		                	
    		$scope.conlimitSel.limitYearTransFlag = $rootScope.pListTwo[index].limitYearTransFlag;
    		$scope.conlimitSel.numberCycleTransFlag = $rootScope.pListTwo[index].numberCycleTransFlag;
    		$scope.conlimitSel.numberDayTransFlag = $rootScope.pListTwo[index].numberDayTransFlag;
    		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.pListTwo[index].numberHalfYearTransFlag;
    		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.pListTwo[index].numberLifeCycleTransFlag;
    		$scope.conlimitSel.numberMonthTransFlag = $rootScope.pListTwo[index].numberMonthTransFlag;
    		$scope.conlimitSel.numberYearTransFlag = $rootScope.pListTwo[index].numberYearTransFlag;
    		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				buttons : [ T.T('F00031'), T.T('F00012')],
				size : [ '970px', '530px' ],
				callbacks : [$scope.updateLimitListAdd]
			});
	 	}
	 	//产品详情======增加交易限制  =============多个
	 	$scope.pTypeTwoAdd = function(index,itemP){
	 		if(itemP.currencyCode){
	 			if(itemP.mandatoryInspectionFlag){
	 				$scope.conlimitSel = {};
					$rootScope.isPEmpty = false;
					$scope.conlimitSel.authDataSynFlag = "1";
			 		$scope.conlimitSel.operationMode = $scope.diff.operationMode;   //运营模式
			 		$scope.conlimitSel.levelFlag = 'P';   //限制层级  客户层C  媒介层M
			 		$scope.conlimitSel.differentType = 0;   //差异类型
			 		$scope.conlimitSel.transLimitCode = $scope.diff.contrlSceneCode;    //交易限制码
			 		$scope.conlimitSel.currencyCode = itemP.currencyCode;
			 		$scope.conlimitSel.mandatoryInspectionFlag = itemP.mandatoryInspectionFlag;
						$scope.conlimitSel.differentCode = "";
						jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
			                if (data.returnCode == '000000') {
			                	if(data.returnData.totalCount == 0){
			                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmpty = true;
			                			if($rootScope.pListTwo[index].limitCycleTransFlag){
			                				//提取产品修改页面缓存限制信息方法
			                				$scope.cusAddProListUpdate(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
						        	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
						        				buttons : [ T.T('F00031'), T.T('F00012')],
						        				size : [ '970px', '530px' ],
						        				callbacks : [$scope.addLimitInfoAdd ]
						        			});
			                			}
			                	}else{
			                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmpty = true;
			                			if($rootScope.pListTwo[index].limitCycleTransFlag){
			                				//提取产品修改页面缓存限制信息方法
			                				$scope.cusAddProListUpdate(index);
			                			}else{
			                				//新增限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListAddSql(data.returnData.rows);
			                			}
			                	}
			                }
			            });
	 			}else{
	 				jfLayer.fail(T.T('SQJ1700060'));
	 			}
	 		}else{
	 			jfLayer.fail(T.T('SQJ1700067'));
	 		}
	 	};
		//提取客户修改页面缓存限制信息方法
		$scope.cusAddCusListUpdate = function(index){
			$scope.conlimitSel.supplyControlFlag = $rootScope.cusListTwo[index].supplyControlFlag;
    		$scope.conlimitSel.limitCycleTrans = $rootScope.cusListTwo[index].limitCycleTrans;
    		$scope.conlimitSel.limitDayTrans = $rootScope.cusListTwo[index].limitDayTrans;		                		
    		$scope.conlimitSel.limitHalfYearTrans = $rootScope.cusListTwo[index].limitHalfYearTrans;		                		
    		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.cusListTwo[index].limitLifeCycleTrans;		                		
    		$scope.conlimitSel.limitMonthTrans = $rootScope.cusListTwo[index].limitMonthTrans;		                		
    		$scope.conlimitSel.limitSingleTrans = $rootScope.cusListTwo[index].limitSingleTrans;		                	
    		$scope.conlimitSel.limitYearTrans = $rootScope.cusListTwo[index].limitYearTrans;
    		$scope.conlimitSel.numberCycleTrans = $rootScope.cusListTwo[index].numberCycleTrans;
    		$scope.conlimitSel.numberDayTrans = $rootScope.cusListTwo[index].numberDayTrans;
    		$scope.conlimitSel.numberHalfYearTrans = $rootScope.cusListTwo[index].numberHalfYearTrans;
    		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.cusListTwo[index].numberLifeCycleTrans;
    		$scope.conlimitSel.numberMonthTrans = $rootScope.cusListTwo[index].numberMonthTrans;
    		$scope.conlimitSel.numberYearTrans = $rootScope.cusListTwo[index].numberYearTrans;
    		$scope.conlimitSel.limitCycleTransFlag = $rootScope.cusListTwo[index].limitCycleTransFlag;
    		$scope.conlimitSel.limitDayTransFlag = $rootScope.cusListTwo[index].limitDayTransFlag;		                		
    		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.cusListTwo[index].limitHalfYearTransFlag;		                		
    		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.cusListTwo[index].limitLifeCycleTransFlag;		                		
    		$scope.conlimitSel.limitMonthTransFlag = $rootScope.cusListTwo[index].limitMonthTransFlag;		                		
    		$scope.conlimitSel.limitSingleTransFlag = $rootScope.cusListTwo[index].limitSingleTransFlag;		                	
    		$scope.conlimitSel.limitYearTransFlag = $rootScope.cusListTwo[index].limitYearTransFlag;
    		$scope.conlimitSel.numberCycleTransFlag = $rootScope.cusListTwo[index].numberCycleTransFlag;
    		$scope.conlimitSel.numberDayTransFlag = $rootScope.cusListTwo[index].numberDayTransFlag;
    		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.cusListTwo[index].numberHalfYearTransFlag;
    		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.cusListTwo[index].numberLifeCycleTransFlag;
    		$scope.conlimitSel.numberMonthTransFlag = $rootScope.cusListTwo[index].numberMonthTransFlag;
    		$scope.conlimitSel.numberYearTransFlag = $rootScope.cusListTwo[index].numberYearTransFlag;
			$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				buttons : [ T.T('F00031'), T.T('F00012')],
				size : [ '970px', '530px' ],
				callbacks : [$scope.updateLimitListAdd]
			});
		}
	 	//客户详情======增加交易限制  =============多个
	 	$scope.cusTypeAddTwo = function(index,itemCus){
	 		if(itemCus.currencyCode){
	 			if(itemCus.mandatoryInspectionFlag){
	 				$scope.conlimitSel = {};
					$rootScope.isCusEmpty = false;
					$scope.conlimitSel.authDataSynFlag = "1";
			 		$scope.conlimitSel.operationMode = $scope.diff.operationMode;   //运营模式
			 		$scope.conlimitSel.levelFlag = 'C';   //限制层级  客户层C  媒介层M
			 		$scope.conlimitSel.differentType = 0;   //差异类型
			 		$scope.conlimitSel.transLimitCode = $scope.diff.contrlSceneCode;    //交易限制码
			 		$scope.conlimitSel.currencyCode = itemCus.currencyCode;
			 		$scope.conlimitSel.mandatoryInspectionFlag = itemCus.mandatoryInspectionFlag;
						$scope.conlimitSel.differentCode = "";
						jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
			                if (data.returnCode == '000000') {
			                	if(data.returnData.totalCount == 0){
			                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmpty = true;
			                			if($rootScope.cusListTwo[index].limitCycleTransFlag){
			                				//提取客户修改页面缓存限制信息方法
			                				$scope.cusAddCusListUpdate(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
						        	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
						        				buttons : [ T.T('F00031'), T.T('F00012')],
						        				size : [ '970px', '530px' ],
						        				callbacks : [$scope.addLimitInfoAdd ]
						        			});
			                			}
			                	}else{
			                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmpty = true;
			                			if($rootScope.cusListTwo[index].limitCycleTransFlag){
			                				//提取客户修改页面缓存限制信息方法
			                				$scope.cusAddCusListUpdate(index);
			                			}else{
			                				//新增限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListAddSql(data.returnData.rows);
			                			}
			                	}
			                }
			            });
	 			}else{
	 				jfLayer.fail(T.T('SQJ1700060'));
	 			}
	 		}else{
	 			jfLayer.fail(T.T('SQJ1700050'));
	 		}
	 	};
	 	//提取媒介修改页面缓存限制信息方法
	 	$scope.cusAddExterListUpdate = function(index){
	 		$scope.conlimitSel.supplyControlFlag = $rootScope.exterListTwo[index].supplyControlFlag;
     		$scope.conlimitSel.limitCycleTrans = $rootScope.exterListTwo[index].limitCycleTrans;
     		$scope.conlimitSel.limitDayTrans = $rootScope.exterListTwo[index].limitDayTrans;		                		
     		$scope.conlimitSel.limitHalfYearTrans = $rootScope.exterListTwo[index].limitHalfYearTrans;		                		
     		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.exterListTwo[index].limitLifeCycleTrans;		                		
     		$scope.conlimitSel.limitMonthTrans = $rootScope.exterListTwo[index].limitMonthTrans;		                		
     		$scope.conlimitSel.limitSingleTrans = $rootScope.exterListTwo[index].limitSingleTrans;		                	
     		$scope.conlimitSel.limitYearTrans = $rootScope.exterListTwo[index].limitYearTrans;
     		$scope.conlimitSel.numberCycleTrans = $rootScope.exterListTwo[index].numberCycleTrans;
     		$scope.conlimitSel.numberDayTrans = $rootScope.exterListTwo[index].numberDayTrans;
     		$scope.conlimitSel.numberHalfYearTrans = $rootScope.exterListTwo[index].numberHalfYearTrans;
     		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.exterListTwo[index].numberLifeCycleTrans;
     		$scope.conlimitSel.numberMonthTrans = $rootScope.exterListTwo[index].numberMonthTrans;
     		$scope.conlimitSel.numberYearTrans = $rootScope.exterListTwo[index].numberYearTrans;
     		$scope.conlimitSel.limitCycleTransFlag = $rootScope.exterListTwo[index].limitCycleTransFlag;
    		$scope.conlimitSel.limitDayTransFlag = $rootScope.exterListTwo[index].limitDayTransFlag;		                		
    		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.exterListTwo[index].limitHalfYearTransFlag;		                		
    		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.exterListTwo[index].limitLifeCycleTransFlag;		                		
    		$scope.conlimitSel.limitMonthTransFlag = $rootScope.exterListTwo[index].limitMonthTransFlag;		                		
    		$scope.conlimitSel.limitSingleTransFlag = $rootScope.exterListTwo[index].limitSingleTransFlag;		                	
    		$scope.conlimitSel.limitYearTransFlag = $rootScope.exterListTwo[index].limitYearTransFlag;
    		$scope.conlimitSel.numberCycleTransFlag = $rootScope.exterListTwo[index].numberCycleTransFlag;
    		$scope.conlimitSel.numberDayTransFlag = $rootScope.exterListTwo[index].numberDayTransFlag;
    		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.exterListTwo[index].numberHalfYearTransFlag;
    		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.exterListTwo[index].numberLifeCycleTransFlag;
    		$scope.conlimitSel.numberMonthTransFlag = $rootScope.exterListTwo[index].numberMonthTransFlag;
    		$scope.conlimitSel.numberYearTransFlag = $rootScope.exterListTwo[index].numberYearTransFlag;
    		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
	 			title : $scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				buttons : [T.T('F00031'), T.T('F00012')],
				size : [ '970px', '530px' ],
				callbacks : [$scope.updateLimitListAdd]
			});
	 	}
		//媒介层限制详情======增加交易限制=========多个
		$scope.exceTypeAdd = function(index,itemExce){
			if(itemExce.currencyCode){
				if(itemExce.mandatoryInspectionFlag){
					$scope.conlimitSel = {};
					$rootScope.isExceEmpty = false;
					$scope.conlimitSel.authDataSynFlag = "1";
					$scope.conlimitSel.operationMode = $scope.diff.operationMode;   //运营模式
					$scope.conlimitSel.levelFlag = 'M';   //限制层级  客户层C  媒介层M
					$scope.conlimitSel.differentType = 0;   //差异类型
					$scope.conlimitSel.transLimitCode = $scope.diff.contrlSceneCode;    //交易限制码
					$scope.conlimitSel.currencyCode = itemExce.currencyCode;
					$scope.conlimitSel.mandatoryInspectionFlag = itemExce.mandatoryInspectionFlag;
						$scope.conlimitSel.differentCode = "";
						jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				            if (data.returnCode == '000000') {
				            	if(data.returnData.totalCount == 0){
				            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
				            			$rootScope.isExceEmpty = true;
				            			if($rootScope.exterListTwo[index].limitCycleTransFlag){
				            				//提取媒介修改页面缓存限制信息方法
				            			 	$scope.cusAddExterListUpdate(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				 		        	 			title : T.T('SQJ1700047'),
				 		        				buttons : [ T.T('F00031'), T.T('F00012')],
				 		        				size : [ '970px', '530px' ],
				 		        				callbacks : [$scope.addLimitInfoAdd ]
				 		        			});
			                			}
				            	}else{
				            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			                			$rootScope.isExceEmpty = true;
				            			if($rootScope.exterListTwo[index].limitCycleTransFlag){
				            				//提取媒介修改页面缓存限制信息方法
				            			 	$scope.cusAddExterListUpdate(index);
			                			}else{
			                				//新增限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListAddSql(data.returnData.rows);
			                			}
			                	}
				            }
				        });
				}else{
					jfLayer.fail(T.T('SQJ1700060'));
				}
			}else{
				jfLayer.fail(T.T('SQJ1700052'));
			}
		};
	});
	//复制
	webApp.controller('controlDiffCopyCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.copyList = {};
		$scope.copyList = $scope.copyitem;
		$scope.proArrayCopy = {};
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArrayCopy ={ 
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
	        	$scope.operationModeCopy = $scope.copyitem.operationMode;
	        }
	    };
		 //额度节点代码下拉框
		 $scope.creditNodeNoArrayCopy = {
				 type:"dynamicDesc",
				 param:{
			      "operationMode":$scope.copyitem.operationMode,
			      "creditNodeTyp":"B",
			       "authDataSynFlag":"1"
		         },
				 text:"creditNodeNo",
			     desc:"creditDesc",
			     value:"creditNodeNo",
			     resource : 'quotatree.queryList',
			     callback:function(data){
		        	 $scope.creditNodeNoCopy = $scope.copyitem.creditNodeNo;
		       }
		 };
			//日期控件
			layui.use('laydate', function(){
				  var laydate = layui.laydate;
				  var startDate = laydate.render({
						elem: '#DIFF_start_Copy',
						min:Date.now(),
						done: function(value, date) {
							endDate.config.min = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							endDate.config.start = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
						}
					});
					var endDate = laydate.render({
						elem: '#DIFF_end_Copy',
						//min:Date.now(),
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							}
						}
					});
					//生效时间，失效时间
					var startTime = laydate.render({
						elem: '#DIFF_startTime_Copy',
						type: 'time',
					    format: 'HH:mm',
					});
					var endTime = laydate.render({
						elem: '#DIFF_endTime_Copy',
						type: 'time',
						/*min:  "9:00:00",
						max: '17:30:00',*/
					    format: 'HH:mm'
					});
			});
			//日期控件end
			//自定义下拉框--------限制币种======只有人民币
			$scope.cur156Array = {};
			 $scope.params = {
				 corporationEntityNo:$scope.corporationId,
				 requestType:"1",
				 resultType:"1"
			 };
			 jfRest.request('legalEntity', 'query', $scope.params).then(function(data) {
				 $scope.cur156Array = data.returnData.rows;
			 });
			//自定义下拉框--------溢缴款 标识
			 $scope.OCFalgArray01 ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_isYorN",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.overpayContrlFlagC = $scope.copyList.overpayContrlFlag;
				        }
					};
					$scope.OCFalgArray03={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_isYorN",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.listDifferentFlagC = $scope.copyList.listDifferentFlag;
					        }
						};
					$scope.OCFalgArray04={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_isYorN",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.transDifferentFlagC = $scope.copyList.transDifferentFlag;
					        }
						};
			//自定义下拉框--------检查标志
					$scope.checkArray ={ 
					        type:"dictData", 
					        param:{
					        	"type":"DROPDOWNBOX",
					        	groupsCode:"dic_checkList",
					        	queryFlag: "children"
					        },//默认查询条件 
					        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
					        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"paramsManage.query",//数据源调用的action 
					        callback: function(data){
					        	$scope.pnListCheckFlagC = $scope.copyList.pnListCheckFlag;
					        }
						};
			//正负面清单层级限制-------------复选框
				$scope.negArray = [{name : T.T('SQJ1700008') ,id : 'CN'},
				                   {name : T.T('SQJ1700009') ,id : 'MH'},
				                   {name : T.T('SQH1700080') ,id : 'TM'},
				                   {name : T.T('SQH1700102') ,id : 'MN'},
				                   {name : T.T('SQH1700108') ,id : 'MC'}];
			//自定义下拉框--------限制币种
			$scope.currcyArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_currcyType",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLimitCurrCodeC = $scope.copyList.transLimitCurrCode;
			        }
				};
		 //证件类型
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
			        	$scope.idTypeCopy = $rootScope.selIdType;
			        }
				};
		//产品
		$scope.proArrayCopy ={ 
				    type:"dynamicDesc", 
				    param:{},//默认查询条件 
				    text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
				    desc:"productDesc",
				    value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
				    resource:"proObject.query",//数据源调用的action 
				    callback: function(data){
				      }
				    };
		//自定义下拉框--------交易层级限制
		 $scope.leveArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_leveList",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLimitLevC = $scope.copyList.transLimitLev;
			        }
				};
        //联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
        	if(data.value == "1"){//身份证
        		$("#conCopy_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#conCopy_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#conCopy_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#conCopy_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#conCopy_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#conCopy_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#conCopy_idNumber").attr("validator","noValidator");
        		$scope.mdmInfoForm.$setPristine();
        		$("#conCopy_idNumber").removeClass("waringform ");
        	};
        });
		//标志------------循环中  不做动态处理
        $scope.YNArray = [{name : T.T('SQJ1700010') ,id : 'Y'},{name : T.T('SQJ1700011') ,id : 'N'}];
		//差异化类型
        $scope.difTypeCopyArray ={ 
    	        type:"dictData", 
    	        param:{
    	        	"type":"DROPDOWNBOX",
    	        	groupsCode:"dic_differentType",
    	        	queryFlag: "children"
    	        },//默认查询条件 
    	        rmData:'0',
    	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
    	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
    	        resource:"paramsManage.query",//数据源调用的action 
    	        callback: function(data){
    	        	$scope.differentTypeC = $scope.copyList.differentType;
    	        }
    		};
		 $scope.crrysCopyArray = {};
		 $scope.params = {
				 "operationMode":$scope.copyitem.operationMode
		 };
		 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
			 $scope.crrysCopyArray = data.returnData.rows;
		 });
		$scope.isTwoCCopy = false;
		$scope.isTwoECopy = false;
		$scope.isTwoPCopy = false;
		$scope.isNCopy = false;
		$scope.isTimeCopy = false;
		$scope.isCustomerNoCopy = false;
		$scope.isExterNoCopy = false;
		$scope.isriskLevelNoCopy = false;
		$scope.isProNoCopy = false;
		$scope.isBCopy = false;
		$scope.isCopyCusType = false;//客户层入账币种新增多个限制信息的按钮
		$scope.isCopyExceType = false;//媒介层入账币种新增多个限制信息的按钮
		$scope.isCopyPType = false;
		$scope.isListFlagCopy = false;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
		$scope.isCheckCopy = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
		$scope.isTransFlagCopy = false;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
		$scope.transCheckCopy = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
		//公共方法类型为1
		$scope.difOnePublic = function(){
			$scope.isCustomerNoCopy = false;
  			$scope.isExterNoCopy = false;
  			$scope.isriskLevelNoCopy = true;
  			$scope.isTimeCopy = false;
  			$scope.isProNoCopy = false;
  			$scope.idTypeCopy = "";
  			$scope.idNumberCopy = "";
  			$scope.externalIdentificationNoCopy = "";
  			$scope.copyList.startDate = "";
  			$scope.copyList.endDate = "";
  			$scope.projectCodeCopy = "";
		}
		//公共方法类型为4
		$scope.difFourPublic = function(){
			$scope.isCustomerNoCopy = false;
  			$scope.isExterNoCopy = false;
  			$scope.isriskLevelNoCopy = false;
  			$scope.isTimeCopy = false;
  			$scope.isProNoCopy = true;
  			$scope.idTypeCopy = "";
  			$scope.idNumberCopy = "";
  			$scope.externalIdentificationNoCopy = "";
  			$scope.copyList.startDate = "";
  			$scope.copyList.endDate = "";
  			$scope.riskLevelCopy = "";
		}
		//公共方法类型为2
		$scope.difTwoPublic = function(){
			$scope.isCustomerNoCopy = true;
  			$scope.isExterNoCopy = false;
  			$scope.isTimeCopy = true;
  			$scope.isProNoCopy = false;
  			$scope.isriskLevelNoCopy = false;
  			$scope.riskLevelCopy = "";
  			$scope.projectCodeCopy = "";
  			$scope.externalIdentificationNoCopy = "";
		}
		//公共方法类型为3
		$scope.difThreePublic = function(){
			$scope.isCustomerNoCopy = false;
			$scope.isExterNoCopy = true;
			$scope.isTimeCopy = true;
			$scope.isProNoCopy = false;
			$scope.isriskLevelNoCopy = false;
			$scope.idTypeCopy = "";
			$scope.idNumberCopy = "";
			$scope.riskLevelCopy = "";
			$scope.projectCodeCopy = "";
		}
		if($scope.copyList.differentType == "1"){
			//公共方法类型为1
			$scope.difOnePublic();
			$scope.riskLevelCopy = $scope.copyList.differentCode;
  			$scope.isListFlagCopy = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckCopy = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagCopy = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckCopy = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.copyList.listDifferentFlag == 'Y'){
  				$scope.isCheckCopy = true;
  				if($scope.copyList.pnListCheckFlag == "B" || $scope.copyList.pnListCheckFlag == "" || $scope.copyList.pnListCheckFlag == null){
  					$scope.copyList.listCheckType = "";
  					$scope.isBCopy = false;
  				}
  				else{
  					$scope.isBCopy = true;
  				}
  			}else if($scope.copyList.listDifferentFlag == 'N'){
  				$scope.isCheckCopy = false;
  				$scope.isBCopy = false;
  			}
  			if($scope.copyList.transDifferentFlag == 'Y'){
  				$scope.transCheckCopy = true;
  			}else if($scope.copyList.transDifferentFlag == 'N'){
  				$scope.transCheckCopy = false;
  			}
		}else if($scope.copyList.differentType == "4"){
			//公共方法类型为4
			$scope.difFourPublic();
  			$scope.isListFlagCopy = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckCopy = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagCopy = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckCopy = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.copyList.listDifferentFlag == 'Y'){
  				$scope.isCheckCopy = true;
  				if($scope.copyList.pnListCheckFlag == "B" || $scope.copyList.pnListCheckFlag == "" || $scope.copyList.pnListCheckFlag == null){
  					$scope.copyList.listCheckType = "";
  					$scope.isBCopy = false;
  				}
  				else{
  					$scope.isBCopy = true;
  				}
  			}else if($scope.copyList.listDifferentFlag == 'N'){
  				$scope.isCheckCopy = false;
  				$scope.isBCopy = false;
  			}
  			if($scope.copyList.transDifferentFlag == 'Y'){
  				$scope.transCheckCopy = true;
  			}else if($scope.copyList.transDifferentFlag == 'N'){
  				$scope.transCheckCopy = false;
  			}
  		//产品
			 $scope.proArrayCopy ={ 
			        type:"dynamicDesc", 
			        param:{},//默认查询条件 
			        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
			        desc:"productDesc",
			        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"proObject.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.projectCodeCopy = $scope.copyitem.differentCode;
			        }
			    };
		}
		else if($scope.copyList.differentType == "2"){
			//公共方法类型为2
			$scope.difTwoPublic();
			$scope.idTypeCopy = $rootScope.selIdType;
  			$scope.idNumberCopy = $rootScope.selIdNum;
  			$scope.isListFlagCopy = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckCopy = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagCopy = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckCopy = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.copyList.listDifferentFlag == 'Y'){
  				$scope.isCheckCopy = true;
  				if($scope.copyList.pnListCheckFlag == "B" || $scope.copyList.pnListCheckFlag == "" || $scope.copyList.pnListCheckFlag == null){
  					$scope.copyList.listCheckType = "";
  					$scope.isBCopy = false;
  				}
  				else{
  					$scope.isBCopy = true;
  				}
  			}else if($scope.copyList.listDifferentFlag == 'N'){
  				$scope.isCheckCopy = false;
  				$scope.isBCopy = false;
  			}
  			if($scope.copyList.transDifferentFlag == 'Y'){
  				$scope.transCheckCopy = true;
  			}else if($scope.copyList.transDifferentFlag == 'N'){
  				$scope.transCheckCopy = false;
  			}
		}else if($scope.copyList.differentType == "3"){
			//公共方法类型为3
			$scope.difThreePublic();
  			$scope.externalIdentificationNoCopy = $rootScope.selDifferentCode;
  			$scope.isListFlagCopy = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckCopy = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagCopy = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckCopy = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.copyList.listDifferentFlag == 'Y'){
  				$scope.isCheckCopy = true;
  				if($scope.copyList.pnListCheckFlag == "B" || $scope.copyList.pnListCheckFlag == "" || $scope.copyList.pnListCheckFlag == null){
  					$scope.copyList.listCheckType = "";
  					$scope.isBCopy = false;
  				}
  				else{
  					$scope.isBCopy = true;
  				}
  			}else if($scope.copyList.listDifferentFlag == 'N'){
  				$scope.isCheckCopy = false;
  				$scope.isBCopy = false;
  			}
  			if($scope.copyList.transDifferentFlag == 'Y'){
  				$scope.transCheckCopy = true;
  			}else if($scope.copyList.transDifferentFlag == 'N'){
  				$scope.transCheckCopy = false;
  			}
		}else if($scope.copyList.differentType == "0"){
			$scope.isCustomerNoCopy = false;
  			$scope.isExterNoCopy = false;
  			$scope.isTimeCopy = false;
  			$scope.isProNoCopy = false;
  			$scope.isriskLevelNoCopy = false;
  			$scope.idTypeCopy = "";
  			$scope.idNumberCopy = "";
  			$scope.riskLevelCopy = "";
  			$scope.copyList.startDate = "";
  			$scope.copyList.endDate = "";
  			$scope.externalIdentificationNoCopy = "";
  			$scope.projectCodeCopy = "";
  			$scope.isListFlagCopy = false;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isCheckCopy = true;   //正负面清单检查标志=========基准差异化类型是无时直接显示
  			$scope.isTransFlagCopy = false;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.transCheckCopy = true;   //交易限制的限制层级=========基准差异化类型是无时直接显示
  			if($scope.copyList.pnListCheckFlag == "B" || $scope.copyList.pnListCheckFlag == "" || $scope.copyList.pnListCheckFlag == null){
				$scope.copyList.listCheckType = "";
				$scope.isBCopy = false;
			}
			else{
				$scope.isBCopy = true;
			}
		}
			$scope.copyOne = false;
			$scope.copyTwo = false;
			$rootScope.extercopyListTwo = [];
			$rootScope.pcopyListTwo = [];
			$rootScope.cuscopyListTwo = [];
			//复制时，根据层级限制及限制币种显示产品的各种限制信息
			$scope.pAllShow = function(){
				$scope.isNCopy = true;
				$rootScope.isExceEmptyCopy = false;
				$rootScope.isCusEmptyCopy = false;
				$rootScope.isPEmptyCopy = true;
				$scope.isTwoCCopy = false;
				$scope.isTwoECopy = false;
				$scope.isTwoPCopy = true;
				$scope.isCopyExceType = false;
				$scope.isCopyCusType = false;//客户层入账币种新增多个限制信息的按钮
			}
			//复制时，根据层级限制及限制币种显示产品的各种限制信息====    入账币种
			$scope.pOneShow = function(){
				$scope.copyTwo = true;
				$scope.copyOne = false;
				$scope.pcopyListTwoCur = [];
				if($scope.copyList.productLimitList.length>0){
					for(var i=0;i<$scope.copyList.productLimitList.length;i++){
						$rootScope.pcopyListTwo.push($scope.copyList.productLimitList[i]);
						$scope.pcopyListTwoCur.push($scope.copyList.productLimitList[i].currencyCode);
					}
				}else{
					$rootScope.pcopyListTwo = [{}];
					$scope.pcopyListTwoCur = [];
				}
				$timeout(function() {
					//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.copyitem.operationMode
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysCopyArray = {};
						 $scope.crrysCopyArray = data.returnData.rows;
						if($scope.copyList.productLimitList.length >= $scope.crrysCopyArray.length){
							$scope.isCopyPType = false;
						}else{
							$scope.isCopyPType = true;
						}
					 });
				},300);
			}
			//复制时，根据层级限制及限制币种显示产品的各种限制信息====    运营币种
			$scope.pZeroShow = function(){
				$scope.copyTwo = false;
				$scope.copyOne = true;
				$scope.isCopyPType = false;
				$scope.pcopyListTwoCur = [];
				if($scope.copyList.productLimitList.length == 0){
					$rootScope.pcopyListTwo = [{}];
					$scope.pcopyListTwoCur = [];
				}else if($scope.copyList.productLimitList.length == 1){
					if($scope.copyList.productLimitList[0].currencyCode == '156'){
						$rootScope.pcopyListTwo = $scope.copyList.productLimitList;
						$scope.pcopyListTwoCur.push($scope.copyList.productLimitList[0].currencyCode);
					}else{
						$rootScope.pcopyListTwo = [{}];
						$scope.pcopyListTwoCur = [];
					}
				}else if($scope.copyList.productLimitList.length > 1){
					for(var i=0;i<$scope.copyList.productLimitList.length;i++){
						if($scope.copyList.productLimitList[i].currencyCode == '156'){
							$rootScope.pcopyListTwo.push($scope.copyList.productLimitList[i]);
							$scope.pcopyListTwoCur.push($scope.copyList.productLimitList[i].currencyCode);
							break;
						}else{
							$rootScope.pcopyListTwo = [];
							$scope.pcopyListTwoCur = [];
						}
					}
				}
				if($rootScope.pcopyListTwo.length == 0){
					$rootScope.pcopyListTwo = [{}];
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			};
			//复制时，根据层级限制及限制币种显示媒介的各种限制信息
			$scope.mAllShow = function(){
				$scope.isNCopy = true;
				$rootScope.isCusEmptyCopy = false;
				$rootScope.isPEmptyCopy = false;
				$rootScope.isExceEmptyCopy = true;
				$scope.isTwoCCopy = false;
				$scope.isTwoECopy = true;
				$scope.isTwoPCopy = false;
				$scope.isCopyPType = false;
				$scope.isCopyCusType = false;//客户层入账币种新增多个限制信息的按钮
			}
			//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    入账币种
			$scope.mOneShow = function(){
				$scope.copyTwo = true;
				$scope.copyOne = false;
				$scope.extercopyListTwoCur = [];
				if($scope.copyList.mediaLimitList.length>0){
					for(var i=0;i<$scope.copyList.mediaLimitList.length;i++){
						$rootScope.extercopyListTwo.push($scope.copyList.mediaLimitList[i]);
						$scope.extercopyListTwoCur.push($scope.copyList.mediaLimitList[i].currencyCode);
					}
				}else{
					$rootScope.extercopyListTwo = [{}];
					$scope.extercopyListTwoCur = [];
				}
				$timeout(function() {
					//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.copyitem.operationMode
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysCopyArray = {};
						 $scope.crrysCopyArray = data.returnData.rows;
						if($scope.copyList.mediaLimitList.length >= $scope.crrysCopyArray.length){
							$scope.isCopyExceType = false;
						}else{
							$scope.isCopyExceType = true;
						}
					 });
				},300);
			}
			////复制时，根据层级限制及限制币种显示媒介的各种限制信息====    运营币种
			$scope.mZeroShow = function(){
				$scope.copyTwo = false;
				$scope.copyOne = true;
				$scope.isCopyExceType = false;//媒介层入账币种新增多个限制信息的按钮
				$scope.extercopyListTwoCur = [];
				if($scope.copyList.mediaLimitList.length == 0){
					$rootScope.extercopyListTwo = [{}];
					$scope.extercopyListTwoCur = [];
				}else if($scope.copyList.mediaLimitList.length == 1){
					if($scope.copyList.mediaLimitList[0].currencyCode == '156'){
						$rootScope.extercopyListTwo = $scope.copyList.mediaLimitList;
						$scope.extercopyListTwoCur.push($scope.copyList.mediaLimitList[0].currencyCode);
					}else{
						$rootScope.extercopyListTwo = [{}];
						$scope.extercopyListTwoCur = [];
					}
				}else if($scope.copyList.mediaLimitList.length > 1){
					for(var i=0;i<$scope.copyList.mediaLimitList.length;i++){
						if($scope.copyList.mediaLimitList[i].currencyCode == '156'){
							$rootScope.extercopyListTwo.push($scope.copyList.mediaLimitList[i]);
							$scope.extercopyListTwoCur.push($scope.copyList.mediaLimitList[i].currencyCode);
							break;
						}else{
							$rootScope.extercopyListTwo = [{}];
							$scope.extercopyListTwoCur = [];
						}
					}
				}
				if($rootScope.extercopyListTwo.length == 0){
					$rootScope.extercopyListTwo = [{}];
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
			//复制时，根据层级限制及限制币种显示客户的各种限制信息
			$scope.cAllShow = function(){
				$rootScope.isCusEmptyCopy = true;
				$rootScope.isExceEmptyCopy = false;
				$rootScope.isPEmptyCopy = false;
				$scope.isNCopy = true;
				$scope.isTwoCCopy = true;
				$scope.isTwoECopy = false;
				$scope.isTwoPCopy = false;
				$scope.isCopyPType = false;
				$scope.isCopyExceType = false;//媒介层入账币种新增多个限制信息的按钮
			}
			//复制时，根据层级限制及限制币种显示客户的各种限制信息=======入账币种
			$scope.cOneShow = function(){
				$scope.copyTwo = true;
				$scope.copyOne = false;
				$scope.cuscopyListTwoCur = [];
				if($scope.copyList.customerLimitList.length>0){
					for(var i=0;i<$scope.copyList.customerLimitList.length;i++){
						$rootScope.cuscopyListTwo.push($scope.copyList.customerLimitList[i]);
						$scope.cuscopyListTwoCur.push($scope.copyList.customerLimitList[i].currencyCode);
					}
				}else{
					$rootScope.cuscopyListTwo = [{}];
					$scope.cuscopyListTwoCur = [];
				}
				$timeout(function() {
					//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.copyitem.operationMode
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysCopyArray = {};
						 $scope.crrysCopyArray = data.returnData.rows;
						 if($scope.copyList.customerLimitList.length >= $scope.crrysCopyArray.length){
							$scope.isCopyCusType = false;
						}else{
							$scope.isCopyCusType = true;
						}
					 });
				},300);
			}
			//复制时，根据层级限制及限制币种显示客户的各种限制信息======运营币种
			$scope.cZeroShow = function(){
				$scope.copyTwo = false;
				$scope.copyOne = true;
				$scope.isCopyCusType = false;//客户层入账币种新增多个限制信息的按钮
				$scope.cuscopyListTwoCur = [];
				if($scope.copyList.customerLimitList.length == 0){
					$rootScope.cuscopyListTwo = [{}];
					$scope.cuscopyListTwoCur = [];
				}else if($scope.copyList.customerLimitList.length == 1){
					if($scope.copyList.customerLimitList[0].currencyCode == '156'){
						$rootScope.cuscopyListTwo = $scope.copyList.customerLimitList;
						$scope.cuscopyListTwoCur.push($scope.copyList.customerLimitList[0].currencyCode);
					}else{
						$rootScope.cuscopyListTwo = [{}];
						$scope.cuscopyListTwoCur = [];
					}
				}else if($scope.copyList.customerLimitList.length > 1){
					for(var i=0;i<$scope.copyList.customerLimitList.length;i++){
						if($scope.copyList.customerLimitList[i].currencyCode == '156'){
							$rootScope.cuscopyListTwo.push($scope.copyList.customerLimitList[i]);
							$scope.cuscopyListTwoCur.push($scope.copyList.customerLimitList[i].currencyCode);
							break;
						}else{
							$rootScope.cuscopyListTwo = [];
							$scope.cuscopyListTwoCur = [];
						}
					}
				}
				if($rootScope.cuscopyListTwo.length == 0){
					$rootScope.cuscopyListTwo = [{}];
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
			//复制时，根据层级限制及限制币种显示两层的各种限制信息
			$scope.bAllShow = function(){
				$rootScope.isExceEmptyCopy = true;
				$rootScope.isCusEmptyCopy = true;
				$rootScope.isPEmptyCopy = false;
				$scope.isTwoCCopy = true;
				$scope.isTwoECopy = true;
				$scope.isTwoPCopy = false;
				$scope.copyTwo = false;
				$scope.copyOne = false;
				$scope.isNCopy = true;
				$scope.isCopyPType = false;
			}
			//复制时，根据层级限制及限制币种显示两层的各种限制信息=======入账币种
			$scope.bOneShow = function(){
				$scope.copyOne = false;
				$scope.copyTwo = true;
				$scope.isCopyExceType = true;
				$scope.isCopyCusType = true;
				$scope.cuscopyListTwoCur = [];
				if($scope.copyList.customerLimitList.length>0){
					for(var i=0;i<$scope.copyList.customerLimitList.length;i++){
						$rootScope.cuscopyListTwo.push($scope.copyList.customerLimitList[i]);
						$scope.cuscopyListTwoCur.push($scope.copyList.customerLimitList[i].currencyCode);
					}
				}else{
					$rootScope.cuscopyListTwo = [{}];
					$scope.cuscopyListTwoCur = [];
				}
				$timeout(function() {
					//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.copyitem.operationMode
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysCopyArray = {};
						 $scope.crrysCopyArray = data.returnData.rows;
						 if($scope.copyList.customerLimitList.length >= $scope.crrysCopyArray.length){
							$scope.isCopyCusType = false;
						}else{
							$scope.isCopyCusType = true;
						}
					 });
				},300);
				$scope.extercopyListTwoCur = [];
				if($scope.copyList.mediaLimitList.length>0){
					for(var i=0;i<$scope.copyList.mediaLimitList.length;i++){
						$rootScope.extercopyListTwo.push($scope.copyList.mediaLimitList[i]);
						$scope.extercopyListTwoCur.push($scope.copyList.mediaLimitList[i].currencyCode);
					}
				}else{
					$rootScope.extercopyListTwo = [{}];
					$scope.extercopyListTwoCur = [];
				}
				$timeout(function() {
					//页面加载时判断多少条限制信息，如果等于币种条数，则不显示新增按钮。媒介和客户
					$scope.params = {
							 "operationMode":$scope.copyitem.operationMode
					 };
					 jfRest.request('operatCurrency', 'query', $scope.params).then(function(data) {
						 $scope.crrysCopyArray = {};
						 $scope.crrysCopyArray = data.returnData.rows;
						if($scope.copyList.mediaLimitList.length >= $scope.crrysCopyArray.length){
							$scope.isCopyExceType = false;
						}else{
							$scope.isCopyExceType = true;
						}
					 });
				},300);
			}
			//复制时，根据层级限制及限制币种显示两层的各种限制信息=======运营币种
			$scope.bZeroShow = function(){
				$scope.copyTwo = false;
				$scope.copyOne = true;
				$scope.isCopyCusType = false;//客户层入账币种新增多个限制信息的按钮
				$scope.isCopyExceType = false;//媒介层入账币种新增多个限制信息的按钮
				$rootScope.extercopyListTwo = $scope.copyList.mediaLimitList;
				$rootScope.cuscopyListTwo = $scope.copyList.customerLimitList;
				$scope.cuscopyListTwoCur = [];
				$scope.extercopyListTwoCur = [];
				if($scope.copyList.mediaLimitList.length == 0){
					$rootScope.extercopyListTwo = [{}];
					$scope.extercopyListTwoCur = [];
				}else if($scope.copyList.mediaLimitList.length == 1){
					if($scope.copyList.mediaLimitList[0].currencyCode == '156'){
						$rootScope.extercopyListTwo = $scope.copyList.mediaLimitList;
						$scope.extercopyListTwoCur.push($scope.copyList.mediaLimitList[0].currencyCode);
					}else{
						$rootScope.extercopyListTwo = [{}];
						$scope.extercopyListTwoCur = [];
					}
				}else if($scope.copyList.mediaLimitList.length > 1){
					for(var i=0;i<$scope.copyList.mediaLimitList.length;i++){
						if($scope.copyList.mediaLimitList[i].currencyCode == '156'){
							$rootScope.extercopyListTwo.push($scope.copyList.mediaLimitList[i]);
							$scope.extercopyListTwoCur.push($scope.copyList.mediaLimitList[i].currencyCode);
							break;
						}else{
							$rootScope.extercopyListTwo = [];
							$scope.extercopyListTwoCur = [];
						}
					}
				}
				if($rootScope.extercopyListTwo.length == 0){
					$rootScope.extercopyListTwo = [{}];
				}
				if($scope.copyList.customerLimitList.length == 0){
					$rootScope.cuscopyListTwo = [{}];
					$scope.cuscopyListTwoCur = [];
				}else if($scope.copyList.customerLimitList.length == 1){
					if($scope.copyList.customerLimitList[0].currencyCode == '156'){
						$rootScope.cuscopyListTwo = $scope.copyList.customerLimitList;
						$scope.cuscopyListTwoCur.push($scope.copyList.customerLimitList[0].currencyCode);
					}else{
						$rootScope.cuscopyListTwo = [{}];
						$scope.cuscopyListTwoCur = [];
					}
				}else if($scope.copyList.customerLimitList.length > 1){
					for(var i=0;i<$scope.copyList.customerLimitList.length;i++){
						if($scope.copyList.customerLimitList[i].currencyCode == '156'){
							$rootScope.cuscopyListTwo.push($scope.copyList.customerLimitList[i]);
							$scope.cuscopyListTwoCur.push($scope.copyList.customerLimitList[i].currencyCode);
							break;
						}else{
							$rootScope.cuscopyListTwo = [];
							$scope.cuscopyListTwoCur = [];
						}
					}
				}
				if($rootScope.cuscopyListTwo.length == 0){
					$rootScope.cuscopyListTwo = [{}];
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
			//复制时，不限制
			$scope.nShow = function(){
				$rootScope.isExceEmptyCopy = false;
				$rootScope.isCusEmptyCopy = false;
				$rootScope.isPEmptyCopy = false;
				$scope.transLimitCurrCodeC = "";
				$scope.isNCopy = false;
				$scope.isTwoCCopy = false;
				$scope.isTwoECopy = false;
				$scope.isTwoPCopy = false;
				$scope.isCopyCusType = false;
				$scope.isCopyExceType = false;
				$scope.isCopyPType = false;
				$rootScope.extercopyListTwo = [];
				$rootScope.pcopyListTwo = [];
				$rootScope.cuscopyListTwo = [];
			}
			if($scope.copyList.transLimitLev == 'P'){
				//复制时，根据层级限制及限制币种显示产品的各种限制信息
				$scope.pAllShow();
				if($scope.copyList.transLimitCurrCode == '1'){
					//复制时，根据层级限制及限制币种显示产品的各种限制信息====    入账币种
					$scope.pOneShow();
				}else if($scope.copyList.transLimitCurrCode == '0'){
					//复制时，根据层级限制及限制币种显示产品的各种限制信息====    运营币种
					$scope.pZeroShow();
				}
			}else if($scope.copyList.transLimitLev == 'M'){
				//复制时，根据层级限制及限制币种显示媒介的各种限制信息
				$scope.mAllShow();
				if($scope.copyList.transLimitCurrCode == '1'){
					//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    入账币种
					$scope.mOneShow();
				}else if($scope.copyList.transLimitCurrCode == '0'){
					//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    运营币种
					$scope.mZeroShow();
				}
			}else if($scope.copyList.transLimitLev == 'C'){
				//复制时，根据层级限制及限制币种显示客户的各种限制信息
				$scope.cAllShow();
				if($scope.copyList.transLimitCurrCode == '1'){
					//复制时，根据层级限制及限制币种显示客户的各种限制信息=======入账币种
					$scope.cOneShow();
				}else if($scope.copyList.transLimitCurrCode == '0'){
					//复制时，根据层级限制及限制币种显示客户的各种限制信息======运营币种
					$scope.cZeroShow();
				}
			}else if($scope.copyList.transLimitLev == 'B'){
				//复制时，根据层级限制及限制币种显示两层的各种限制信息
				$scope.bAllShow();
				if($scope.copyList.transLimitCurrCode == '1'){
					//复制时，根据层级限制及限制币种显示两层的各种限制信息=======入账币种
					$scope.bOneShow();
				}else if($scope.copyList.transLimitCurrCode == '0'){
					//复制时，根据层级限制及限制币种显示两层的各种限制信息=======运营币种
					$scope.bZeroShow();
				}
			}else{
				//复制时，不限制
				$scope.nShow();
			}
			//复制时，原差异化是无，现改为其他时，需要重新设置差异化信息，正负面及交易限制信息公共方法
			$scope.differentTypeCopyHave = function(){
	  			$scope.isCheckCopy = false;   //正负面清单检查标志=========基准差异化类型是无时直接显示
	  			$scope.transCheckCopy = false;   //交易限制的限制层级=========基准差异化类型是无时直接显示
	  			$scope.isListFlagCopy = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
	  			$scope.isTransFlagCopy = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
	  			$scope.isNCopy = false;
	  			$scope.isBCopy = false;
	  			$scope.copyList.excpListCheckType = "";
	  			$scope.pnListCheckFlagC = "";
	  			$scope.copyList.listCheckType = "";
	  			$scope.transLimitLevC = "";
	  			$scope.transLimitCurrCodeC = "";
				$rootScope.extercopyListTwo = [];
				$rootScope.pcopyListTwo = [];
				$rootScope.cuscopyListTwo = [];
				$scope.isTwoCCopy = false;
				$scope.copyOne = false;
				$scope.copyTwo = false;
				$scope.isTwoECopy = false;
				$scope.isTwoPCopy = false;
			}
		var form = layui.form;
		form.on('select(getDifferentTypeCopy)',function(event){
			$scope.isListFlagCopy = true;   //正负面清单差异化标志=====基准差异化类型是无时不显示，
  			$scope.isTransFlagCopy = true;   //交易限制差异化标志 ==========基准差异化类型是无时不显示，
  			$scope.listDifferentFlagC = "";
  			$scope.transDifferentFlagC = "";
			if(event.value == "1"){
				//公共方法类型为1
				$scope.difOnePublic();
			}else if(event.value == "4"){
				//公共方法类型为4
				$scope.difFourPublic();
			}
			else if(event.value == "2"){
				//公共方法类型为2
				$scope.difTwoPublic();
			}else if(event.value == "3"){
				//公共方法类型为3
				$scope.difThreePublic();
			}
		});
		//正负面清单====差异化标志
		form.on('select(getListDifferentFlagCopy)',function(event){
			if(event.value == 'Y'){
				$scope.isCheckCopy = true;
				if($scope.pnListCheckFlagC == 'N' || $scope.pnListCheckFlagC == 'P'){
					$scope.isBCopy = true;
				}else{
					$scope.isBCopy = false;
				}
			}else if(event.value == 'N'){
				$scope.isCheckCopy = false;
				$scope.isBCopy = false;
				$scope.pnListCheckFlagC = "";
				$scope.copyList.listCheckType = "";
			}else{
				$scope.isCheckCopy = false;
				$scope.isBCopy = false;
				$scope.pnListCheckFlagC = "";
				$scope.copyList.listCheckType = "";
			}
		});
		//正负面清单====检查标志
		form.on('select(getRiskLimitCopy)',function(event){
			if(event.value == "B" || event.value == ""){
				$scope.copyList.listCheckType = "";
				$scope.isBCopy = false;
			}
			else{
				$scope.isBCopy = true;
			}
		});
		//交易限制===差异化标志
		form.on('select(gettransLimitDifferentTypeCopy)',function(event){
			if(event.value == 'N'){
				$scope.transLimitCurrCodeC = "";
				$scope.isNCopy = false;
				$scope.isTwoCCopy = false;
				$scope.isTwoECopy = false;
				$scope.isTwoPCopy = false;
				$scope.transCheckCopy = false;
				$rootScope.extercopyListTwo = [];
				$rootScope.pcopyListTwo = [];
				$rootScope.cuscopyListTwo = [];
				$scope.transLimitLevC = "";
			}else if(event.value == 'Y'){
				$scope.transCheckCopy = true;
			}
		});
		//交易限制===层级限制=====复制222
		form.on('select(getLimitLevCopy)',function(event){
			$rootScope.extercopyListTwo = [];
			$rootScope.pcopyListTwo = [];
			$rootScope.cuscopyListTwo = [];
			if(event.value == 'N'){
				//复制时，不限制
				$scope.nShow();
			}else if(event.value == 'P'){
				//复制时，根据层级限制及限制币种显示产品的各种限制信息
				$scope.pAllShow();
				if($scope.transLimitCurrCodeC == '1'){
					//复制时，根据层级限制及限制币种显示产品的各种限制信息====    入账币种
					$scope.pOneShow();
				}else if($scope.transLimitCurrCodeC == '0'){
					//复制时，根据层级限制及限制币种显示产品的各种限制信息====    运营币种
					$scope.pZeroShow();
				}
			}else if(event.value == 'M'){
				//复制时，根据层级限制及限制币种显示媒介的各种限制信息
				$scope.mAllShow();
				if($scope.transLimitCurrCodeC == '1'){
					//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    入账币种
					$scope.mOneShow();
				}else if($scope.transLimitCurrCodeC == '0'){
					//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    运营币种
					$scope.mZeroShow();
				}
			}else if(event.value == 'C'){
				//复制时，根据层级限制及限制币种显示客户的各种限制信息
				$scope.cAllShow();
				if($scope.transLimitCurrCodeC == '1'){
					//复制时，根据层级限制及限制币种显示客户的各种限制信息=======入账币种
					$scope.cOneShow();
				}else if($scope.transLimitCurrCodeC == '0'){
					//复制时，根据层级限制及限制币种显示客户的各种限制信息======运营币种
					$scope.cZeroShow();
				}
			}else if(event.value == 'B'){
				//复制时，根据层级限制及限制币种显示两层的各种限制信息
				$scope.bAllShow();
				if($scope.transLimitCurrCodeC == '1'){
					//复制时，根据层级限制及限制币种显示两层的各种限制信息=======入账币种
					$scope.bOneShow();
				}else if($scope.transLimitCurrCodeC == '0'){
					//复制时，根据层级限制及限制币种显示两层的各种限制信息=======运营币种
					$scope.bZeroShow();
				}
			}
		});
		//交易限制====限制币种=====复制111
		form.on('select(getLimitCurCopy)',function(event){
			$rootScope.extercopyListTwo = [];
			$rootScope.pcopyListTwo = [];
			$rootScope.cuscopyListTwo = [];
			if($scope.transLimitLevC == 'P'){ 
				//复制时，根据层级限制及限制币种显示产品的各种限制信息
				$scope.pAllShow();
				if(event.value == '1'){
					//复制时，根据层级限制及限制币种显示产品的各种限制信息====    入账币种
					$scope.pOneShow();
				}else if(event.value == '0'){
					//复制时，根据层级限制及限制币种显示产品的各种限制信息====    运营币种
					$scope.pZeroShow();
				}
			}else if($scope.transLimitLevC == 'M'){
				//复制时，根据层级限制及限制币种显示媒介的各种限制信息
				$scope.mAllShow();
				if(event.value == '1'){
					//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    入账币种
					$scope.mOneShow();
				}else if(event.value == '0'){
				//复制时，根据层级限制及限制币种显示媒介的各种限制信息====    运营币种
					$scope.mZeroShow();
				}
			}else if($scope.transLimitLevC == 'C'){
				//复制时，根据层级限制及限制币种显示客户的各种限制信息
				$scope.cAllShow();
				if(event.value == '1'){
					//复制时，根据层级限制及限制币种显示客户的各种限制信息=======入账币种
					$scope.cOneShow();
				}else if(event.value == '0'){
					//复制时，根据层级限制及限制币种显示客户的各种限制信息======运营币种
					$scope.cZeroShow();
				}
			}else if($scope.transLimitLevC == 'B'){
				//复制时，根据层级限制及限制币种显示两层的各种限制信息
				$scope.bAllShow();
				if(event.value == '1'){
					//复制时，根据层级限制及限制币种显示两层的各种限制信息=======入账币种
					$scope.bOneShow();
				}else if(event.value == '0'){
					//复制时，根据层级限制及限制币种显示两层的各种限制信息=======运营币种
					$scope.bZeroShow();
				}
			}else if(event.value == ""){
				$scope.transLimitCurrCodeC = "";
			}else{
				//复制时，不限制
				$scope.nShow();
			}
		});
		//产品层交易限制--增加======维护
	 	$scope.listTypeCopyP = function(){
	 		if($scope.transLimitCurrCodeC == 1){
	 			if($rootScope.pcopyListTwo == 0 || $rootScope.pcopyListTwo == null){
	 				$rootScope.pcopyListTwo = [{}];
		 		}
		 		else{
		 			$rootScope.pcopyListTwo.splice($rootScope.pcopyListTwo.length,0,{});
		 		}
	 			if($rootScope.pcopyListTwo.length >= $scope.crrysCopyArray.length){
	 				$scope.isCopyPType = false;
	 			}else{
	 				$scope.isCopyPType = true;
	 			}
	 		}else if($scope.transLimitCurrCodeC == 0){
	 			if($rootScope.pcopyListTwo == 0 || $rootScope.pcopyListTwo == null){
	 				$rootScope.pcopyListTwo = [{}];
	 				$scope.isCopyPType = false;
		 		}
	 		}
 			$timeout(function() {
				Tansun.plugins.render('select');
			});
	 	};
	 	//产品层交易限制-----删除======维护
	 	$scope.pCopyDel = function(e,$index){
	 		$rootScope.pcopyListTwo.splice(e,1);
	 		$scope.pcopyListTwoCur.splice(e,1);
	 		if($rootScope.pcopyListTwo.length >= $scope.crrysCopyArray.length){
 				$scope.isCopyPType = false;
 			}else{
 				$scope.isCopyPType = true;
 			}
	 	};
		 	//媒介层交易限制--增加======维护
		 	$scope.listTypeCopy = function(){
		 		if($scope.transLimitCurrCodeC == 1){
		 			if($rootScope.extercopyListTwo == 0 || $rootScope.extercopyListTwo == null){
		 				$rootScope.extercopyListTwo = [{}];
			 		}
			 		else{
			 			$rootScope.extercopyListTwo.splice($rootScope.extercopyListTwo.length,0,{});
			 		}
		 			if($rootScope.extercopyListTwo.length >= $scope.crrysCopyArray.length){
		 				$scope.isCopyExceType = false;
		 			}else{
		 				$scope.isCopyExceType = true;
		 			}
		 		}else if($scope.transLimitCurrCodeC == 0){
		 			if($rootScope.extercopyListTwo == 0 || $rootScope.extercopyListTwo == null){
		 				$rootScope.extercopyListTwo = [{}];
		 				$scope.isCopyExceType = false;
			 		}
		 		}
	 			$timeout(function() {
    				Tansun.plugins.render('select');
    			});
		 	};
		 	//媒介层交易限制-----删除======维护
		 	$scope.exceCopyDel = function(e,$index){
		 		$rootScope.extercopyListTwo.splice(e,1);
		 		$scope.extercopyListTwoCur.splice(e,1);
		 		if($rootScope.extercopyListTwo.length >= $scope.crrysCopyArray.length){
	 				$scope.isCopyExceType = false;
	 			}else{
	 				$scope.isCopyExceType = true;
	 			}
		 	};
		 	//客户层交易限制--增加======维护
		 	$scope.listTypeCusCopy = function(){
		 		if($scope.transLimitCurrCodeC == 1){
		 			if($rootScope.cuscopyListTwo == 0 || $rootScope.cuscopyListTwo == null){
		 				$rootScope.cuscopyListTwo = [{}];
			 		}
			 		else{
			 			$rootScope.cuscopyListTwo.splice($rootScope.cuscopyListTwo.length,0,{});
			 		}
		 			if($rootScope.cuscopyListTwo.length >= $scope.crrysCopyArray.length){
		 				$scope.isCopyCusType = false;
		 			}else{
		 				$scope.isCopyCusType = true;
		 			}
		 		}else if($scope.transLimitCurrCodeC == 0){
		 			if($rootScope.cuscopyListTwo == 0 || $rootScope.cuscopyListTwo == null){
		 				$rootScope.cuscopyListTwo = [{}];
		 				$scope.isCopyCusType = false;
			 		}
		 		}
	 			$timeout(function() {
	 		       Tansun.plugins.render('select');
	 		      });
		 	};
		 	//客户层交易限制-----删除======维护
		 	$scope.cusTypeDelCopy = function(e,$index){
		 		$rootScope.cuscopyListTwo.splice(e,1);
		 		$scope.cuscopyListTwoCur.splice(e,1);
		 		if($rootScope.cuscopyListTwo.length >= $scope.crrysCopyArray.length){
	 				$scope.isCopyCusType = false;
	 			}else{
	 				$scope.isCopyCusType = true;
	 			}
		 	};
			// 保存信息事件==========媒介层交易限制信息建立==========多个
			$scope.saveCopyCallBack = function(result) {
				$scope.addListInfo = {};
				$scope.addListInfo = $.parseJSON(JSON.stringify(result.scope.conlimitSel));
				if($scope.addListInfo.limitSingleTransFlag == 'Y'){
					if(!$scope.addListInfo.limitSingleTrans){
						jfLayer.alert(T.T('SQJ1700070'));
						return;
					}
				};
				if($scope.addListInfo.limitDayTransFlag == 'Y'){
					if(!$scope.addListInfo.limitDayTrans){
						jfLayer.alert(T.T('SQJ1700071'));
						return;
					}
				};	                		
				if($scope.addListInfo.limitCycleTransFlag == 'Y'){
					if(!$scope.addListInfo.limitCycleTrans){
						jfLayer.alert(T.T('SQJ1700072'));
						return;
					}
				};	                		
				if($scope.addListInfo.limitMonthTransFlag == 'Y'){
					if(!$scope.addListInfo.limitMonthTrans){
						jfLayer.alert(T.T('SQJ1700073'));
						return;
					}
				};		                		
				if($scope.addListInfo.limitHalfYearTransFlag == 'Y'){
					if(!$scope.addListInfo.limitHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700074'));
						return;
					}
				};	                		
	    		if($scope.addListInfo.limitYearTransFlag == 'Y'){
					if(!$scope.addListInfo.limitYearTrans){
						jfLayer.alert(T.T('SQJ1700075'));
						return;
					}
				};		                	
				if($scope.addListInfo.limitLifeCycleTransFlag == 'Y'){
					if(!$scope.addListInfo.limitLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700076'));
						return;
					}
				};
				if($scope.addListInfo.numberDayTransFlag == 'Y'){
					if(!$scope.addListInfo.numberDayTrans){
						jfLayer.alert(T.T('SQJ1700077'));
						return;
					}
				};
				if($scope.addListInfo.numberCycleTransFlag == 'Y'){
					if(!$scope.addListInfo.numberCycleTrans){
						jfLayer.alert(T.T('SQJ1700078'));
						return;
					}
				};
				if($scope.addListInfo.numberMonthTransFlag == 'Y'){
					if(!$scope.addListInfo.numberMonthTrans){
						jfLayer.alert(T.T('SQJ1700079'));
						return;
					}
				};
				if($scope.addListInfo.numberHalfYearTransFlag == 'Y'){
					if(!$scope.addListInfo.numberHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700080'));
						return;
					}
				};
				if($scope.addListInfo.numberYearTransFlag == 'Y'){
					if(!$scope.addListInfo.numberYearTrans){
						jfLayer.alert(T.T('SQJ1700081'));
						return;
					}
				};
				if($scope.addListInfo.numberLifeCycleTransFlag == 'Y'){
					if(!$scope.addListInfo.numberLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700082'));
						return;
					}
				};
				$scope.addListInfo.operationMode = $scope.conlimitSel.operationMode;
				$scope.addListInfo.transLimitCode = $scope.conlimitSel.transLimitCode;
				$scope.addListInfo.levelFlag = $scope.conlimitSel.levelFlag;
				$scope.addListInfo.currencyCode = $scope.conlimitSel.currencyCode;
				$scope.addListInfo.mandatoryInspectionFlag = $scope.conlimitSel.mandatoryInspectionFlag;
				$scope.addListInfo.differentType = $scope.conlimitSel.differentType;
				$scope.addListInfo.supplyControlFlag = result.scope.supplyControlFlagA;
				if($scope.addListInfo.levelFlag == 'P'){
					if($rootScope.pcopyListTwo == null){
	    				$rootScope.pcopyListTwo = [];
	    			}
					if($rootScope.pcopyListTwo.length > 0){
						for(var m=0;m<$rootScope.pcopyListTwo.length;m++){
							if($scope.addListInfo.currencyCode == $rootScope.pcopyListTwo[m].currencyCode){
								$rootScope.pcopyListTwo.splice(m, 1);
							}
						}
					}
					$rootScope.pcopyListTwo.push($scope.addListInfo);
				}else if($scope.addListInfo.levelFlag == 'C'){
					if($rootScope.cuscopyListTwo == null){
	    				$rootScope.cuscopyListTwo = [];
	    			}
					if($rootScope.cuscopyListTwo.length > 0){
						for(var n=0;n<$rootScope.cuscopyListTwo.length;n++){
							if($scope.addListInfo.currencyCode == $rootScope.cuscopyListTwo[n].currencyCode){
								$rootScope.cuscopyListTwo.splice(n, 1);
							}
						}
					}
					$rootScope.cuscopyListTwo.push($scope.addListInfo);
				}else if($scope.addListInfo.levelFlag == 'M'){
					if($rootScope.extercopyListTwo == null){
	    				$rootScope.extercopyListTwo = [];
	    			}
					if($rootScope.extercopyListTwo.length > 0){
						for(var m=0;m<$rootScope.extercopyListTwo.length;m++){
							if($scope.addListInfo.currencyCode == $rootScope.extercopyListTwo[m].currencyCode){
								$rootScope.extercopyListTwo.splice(m, 1);
							}
						}
					}
					$rootScope.extercopyListTwo.push($scope.addListInfo);
				}
				$timeout(function() {
    				Tansun.plugins.render('select');
    			});
				$scope.idTypeCopy = result.scope.idTypeAdd;
				$scope.safeApply();
				result.cancel();
			};
			// 保存信息事件======媒介层限制信息========维护=====多个
			$scope.updateCopyCallBack = function(result) {
				$scope.updateListInfo = {};
				$scope.updateListInfo = $.parseJSON(JSON.stringify(result.scope.conlimitSel));
				$scope.updateListInfo.limitSingleTransFlag = result.scope.limitSingleTransFlagU;
				$scope.updateListInfo.limitDayTransFlag = result.scope.limitDayTransFlagU;
				$scope.updateListInfo.limitCycleTransFlag = result.scope.limitCycleTransFlagU;
				$scope.updateListInfo.limitMonthTransFlag = result.scope.limitMonthTransFlagU;
				$scope.updateListInfo.limitHalfYearTransFlag = result.scope.limitHalfYearTransFlagU;
				$scope.updateListInfo.limitYearTransFlag = result.scope.limitYearTransFlagU;
				$scope.updateListInfo.limitLifeCycleTransFlag = result.scope.limitLifeCycleTransFlagU;
				$scope.updateListInfo.numberDayTransFlag = result.scope.numberDayTransFlagU;
				$scope.updateListInfo.numberCycleTransFlag = result.scope.numberCycleTransFlagU;
				$scope.updateListInfo.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
				$scope.updateListInfo.numberMonthTransFlag = result.scope.numberMonthTransFlagU;
				$scope.updateListInfo.numberHalfYearTransFlag = result.scope.numberHalfYearTransFlagU;
				$scope.updateListInfo.numberLifeCycleTransFlag = result.scope.numberLifeCycleTransFlagU;
				if($scope.updateListInfo.limitSingleTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitSingleTrans){
						jfLayer.alert(T.T('SQJ1700070'));
						return;
					}
				};
				if($scope.updateListInfo.limitDayTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitDayTrans){
						jfLayer.alert(T.T('SQJ1700071'));
						return;
					}
				};	                		
				if($scope.updateListInfo.limitCycleTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitCycleTrans){
						jfLayer.alert(T.T('SQJ1700072'));
						return;
					}
				};	                		
				if($scope.updateListInfo.limitMonthTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitMonthTrans){
						jfLayer.alert(T.T('SQJ1700073'));
						return;
					}
				};		                		
				if($scope.updateListInfo.limitHalfYearTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700074'));
						return;
					}
				};	                		
	    		if($scope.updateListInfo.limitYearTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitYearTrans){
						jfLayer.alert(T.T('SQJ1700075'));
						return;
					}
				};		                	
				if($scope.updateListInfo.limitLifeCycleTransFlag == 'Y'){
					if(!$scope.updateListInfo.limitLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700076'));
						return;
					}
				};
				if($scope.updateListInfo.numberDayTransFlag == 'Y'){
					if(!$scope.updateListInfo.numberDayTrans){
						jfLayer.alert(T.T('SQJ1700077'));
						return;
					}
				};
				if($scope.updateListInfo.numberCycleTransFlag == 'Y'){
					if(!$scope.updateListInfo.numberCycleTrans){
						jfLayer.alert(T.T('SQJ1700078'));
						return;
					}
				};
				if($scope.updateListInfo.numberMonthTransFlag == 'Y'){
					if(!$scope.updateListInfo.numberMonthTrans){
						jfLayer.alert(T.T('SQJ1700079'));
						return;
					}
				};
				if($scope.updateListInfo.numberHalfYearTransFlag == 'Y'){
					if(!$scope.updateListInfo.numberHalfYearTrans){
						jfLayer.alert(T.T('SQJ1700080'));
						return;
					}
				};
				if($scope.updateListInfo.numberYearTransFlag == 'Y'){
					if(!$scope.updateListInfo.numberYearTrans){
						jfLayer.alert(T.T('SQJ1700081'));
						return;
					}
				};
				if($scope.updateListInfo.numberLifeCycleTransFlag == 'Y'){
					if(!$scope.updateListInfo.numberLifeCycleTrans){
						jfLayer.alert(T.T('SQJ1700082'));
						return;
					}
				};
				$scope.updateListInfo.supplyControlFlag = result.scope.supplyControlFlagA;
				if($scope.updateListInfo.levelFlag == 'P'){
					if($rootScope.pcopyListTwo == null){
	    				$rootScope.pcopyListTwo = [];
	    			}
					if($rootScope.pcopyListTwo.length > 0){
						for(var n=0;n<$rootScope.pcopyListTwo.length;n++){
							if($scope.updateListInfo.currencyCode == $rootScope.pcopyListTwo[n].currencyCode){
								$rootScope.pcopyListTwo.splice(n, 1);
							}
						}
					}
					$rootScope.pcopyListTwo.push($scope.updateListInfo);
				}else if($scope.updateListInfo.levelFlag == 'C'){
					if($rootScope.cuscopyListTwo == null){
	    				$rootScope.cuscopyListTwo = [];
	    			}
					if($rootScope.cuscopyListTwo.length > 0){
						for(var m=0;m<$rootScope.cuscopyListTwo.length;m++){
							if($scope.updateListInfo.currencyCode == $rootScope.cuscopyListTwo[m].currencyCode){
								$rootScope.cuscopyListTwo.splice(m, 1);
							}
						}
					}
					$rootScope.cuscopyListTwo.push($scope.updateListInfo);
				}else if($scope.updateListInfo.levelFlag == 'M'){
					if($rootScope.extercopyListTwo == null){
	    				$rootScope.extercopyListTwo = [];
	    			}
					if($rootScope.extercopyListTwo.length > 0){
						for(var n=0;n<$rootScope.extercopyListTwo.length;n++){
							if($scope.updateListInfo.currencyCode == $rootScope.extercopyListTwo[n].currencyCode){
								$rootScope.extercopyListTwo.splice(n, 1);
							}
						}
					}
					$rootScope.extercopyListTwo.push($scope.updateListInfo);
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
				$scope.idTypeCopy = result.scope.idTypeAdd;
				$scope.safeApply();
				result.cancel();
			};
		 	//复制限制===页面无值 取数据库=====客户，媒介，产品共用
		 	$scope.limitListCopySql = function(result){
		 		$scope.conlimitSel.supplyControlFlag = result[0].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = result[0].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = result[0].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = result[0].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = result[0].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = result[0].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = result[0].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = result[0].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = result[0].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = result[0].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = result[0].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = result[0].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = result[0].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = result[0].numberYearTrans;
        		$scope.conlimitSel.version = result[0].version;
        		$scope.conlimitSel.id = result[0].id;
        		$scope.conlimitSel.limitCycleTransFlag = result[0].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = result[0].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = result[0].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = result[0].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = result[0].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = result[0].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = result[0].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = result[0].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = result[0].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = result[0].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = result[0].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = result[0].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = result[0].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updateCopyCallBack]
    			});
		 	}
		 	//提取产品修改页面缓存限制信息方法===复制
		 	$scope.proCopyListUpdate = function(index){
		 		$scope.conlimitSel.supplyControlFlag = $rootScope.pcopyListTwo[index].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = $rootScope.pcopyListTwo[index].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = $rootScope.pcopyListTwo[index].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = $rootScope.pcopyListTwo[index].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.pcopyListTwo[index].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = $rootScope.pcopyListTwo[index].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = $rootScope.pcopyListTwo[index].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = $rootScope.pcopyListTwo[index].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = $rootScope.pcopyListTwo[index].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = $rootScope.pcopyListTwo[index].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = $rootScope.pcopyListTwo[index].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.pcopyListTwo[index].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = $rootScope.pcopyListTwo[index].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = $rootScope.pcopyListTwo[index].numberYearTrans;
        		$scope.conlimitSel.version = $rootScope.pcopyListTwo[index].version;
        		$scope.conlimitSel.id = $rootScope.pcopyListTwo[index].id;
        		$scope.conlimitSel.limitCycleTransFlag = $rootScope.pcopyListTwo[index].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = $rootScope.pcopyListTwo[index].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.pcopyListTwo[index].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.pcopyListTwo[index].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = $rootScope.pcopyListTwo[index].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = $rootScope.pcopyListTwo[index].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = $rootScope.pcopyListTwo[index].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = $rootScope.pcopyListTwo[index].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = $rootScope.pcopyListTwo[index].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.pcopyListTwo[index].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.pcopyListTwo[index].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = $rootScope.pcopyListTwo[index].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = $rootScope.pcopyListTwo[index].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updateCopyCallBack]
    			});
		 	}
			//产品层限制详情======增加交易限制=========多个
			$scope.pCopyAdd = function(index,itemPTU){
				if($rootScope.pcopyListTwo.length>0){
					for(var i=0;i<$rootScope.pcopyListTwo.length;i++){
						if($rootScope.pcopyListTwo[i].currencyCode != $scope.pcopyListTwoCur[i]){
							$scope.pcopyListTwoCur.push($rootScope.pcopyListTwo[i].currencyCode);
						}
					}
				}
				var currencyCodeOldCopy = "";
		 		if($scope.copyList.productLimitList.length >index){
		 			currencyCodeOldCopy = $scope.pcopyListTwoCur[index];
		 		}else{
		 			if($rootScope.pcopyListTwo.length > 0){
		 				currencyCodeOldCopy = $rootScope.pcopyListTwo[index].currencyCode;
		 			}else{
		 				currencyCodeOldCopy = "";
		 			}
		 		}
				if(itemPTU.currencyCode){
					if(itemPTU.mandatoryInspectionFlag){
						$rootScope.isPEmptyCopy = false;
						$scope.conlimitSel = {};
						$scope.conlimitSel.authDataSynFlag = "1";
						$scope.conlimitSel.operationMode = $scope.copyList.operationMode;   //运营模式
						$scope.conlimitSel.levelFlag = 'P';   //限制层级  客户层C  媒介层M
						$scope.conlimitSel.differentType = $scope.differentTypeC;   //差异类型
						$scope.conlimitSel.transLimitCode = $scope.copyList.contrlSceneCode;    //交易限制码
						$scope.conlimitSel.currencyCode = itemPTU.currencyCode;
						$scope.conlimitSel.mandatoryInspectionFlag = itemPTU.mandatoryInspectionFlag;
						if($scope.conlimitSel.differentType == "1" || $scope.conlimitSel.differentType == "4"){
							if($scope.conlimitSel.differentType == "1"){
								$scope.conlimitSel.differentCode = $scope.riskLevelCopy;
							}else if($scope.conlimitSel.differentType == "4"){
								$scope.conlimitSel.differentCode = $scope.projectCodeCopy;
							}
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
					            		if($scope.transDifferentFlagC == 'Y'){
					            			$rootScope.isPEmptyCopy = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面
					            			if($rootScope.pcopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemPTU.currencyCode){
					            				//提取产品修改页面缓存限制信息方法===复制
					            			 	$scope.proCopyListUpdate(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
					            					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					        	        				buttons : [ T.T('F00031'), T.T('F00012')],
					        	        				size : [ '970px', '530px' ],
					        	        				callbacks : [$scope.saveCopyCallBack ]
					        	        			});
					            			}
				                		}else{
				                			$rootScope.isPEmptyCopy = false;
				                			jfLayer.fail(T.T('SQJ1700043'));
				                		}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制媒介限制多条时入账币种
			                			if($rootScope.pcopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemPTU.currencyCode){
			                				//提取产品修改页面缓存限制信息方法===复制
				            			 	$scope.proCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}else if($scope.conlimitSel.differentType == "2" || $scope.conlimitSel.differentType == "3"){
							if($scope.conlimitSel.differentType == "2"){
								$scope.conlimitSel.idType = $scope.idTypeCopy;
								$scope.conlimitSel.idNumber = $scope.idNumberCopy;
							}else if($scope.conlimitSel.differentType == "3"){
								$scope.conlimitSel.differentCode = $scope.externalIdentificationNoCopy;
								$scope.conlimitSel.externalIdentificationNo = $scope.externalIdentificationNoCopy;
							}
							jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
					            		if($scope.transDifferentFlagC == 'Y'){
					            			$rootScope.isPEmptyCopy = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面
					            			if($rootScope.pcopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemPTU.currencyCode){
					            				//提取产品修改页面缓存限制信息方法===复制
					            			 	$scope.proCopyListUpdate(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
					            					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					        	        				buttons : [ T.T('F00031'), T.T('F00012')],
					        	        				size : [ '970px', '530px' ],
					        	        				callbacks : [$scope.saveCopyCallBack ]
					        	        			});
					            			}
				                		}else{
				                			$rootScope.isPEmptyCopy = false;
				                			jfLayer.fail(T.T('SQJ1700043'));
				                		}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
			                			$rootScope.isPEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制媒介限制多条时入账币种
			                			if($rootScope.pcopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemPTU.currencyCode){
			                				//提取产品修改页面缓存限制信息方法===复制
				            			 	$scope.proCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}else if($scope.conlimitSel.differentType == "0"){
							$scope.conlimitSel.differentCode = "";
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
					            			$rootScope.isPEmptyCopy = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面
					            			if($rootScope.pcopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemPTU.currencyCode){
					            				//提取产品修改页面缓存限制信息方法===复制
					            			 	$scope.proCopyListUpdate(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
					            					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					        	        				buttons : [ T.T('F00031'), T.T('F00012')],
					        	        				size : [ '970px', '530px' ],
					        	        				callbacks : [$scope.saveCopyCallBack ]
					        	        			});
					            			}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700065');
				                			$rootScope.isPEmptyCopy = true;
				                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制媒介限制多条时入账币种
				                			if($rootScope.pcopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemPTU.currencyCode){
				                				//提取产品修改页面缓存限制信息方法===复制
					            			 	$scope.proCopyListUpdate(index);
				                			}else{
				                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
				                			 	$scope.limitListCopySql(data.returnData.rows);
				                			}
				                	}
					            }
					        });
						}
					}else{
						jfLayer.fail(T.T('SQJ1700060'));
					}
				}else{
					jfLayer.fail(T.T('SQJ1700067'));
				}
			};
			//提取客户修改页面缓存限制信息方法===复制
		 	$scope.cusCopyListUpdate = function(index){
		 		$scope.conlimitSel.supplyControlFlag = $rootScope.cuscopyListTwo[index].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = $rootScope.cuscopyListTwo[index].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = $rootScope.cuscopyListTwo[index].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = $rootScope.cuscopyListTwo[index].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.cuscopyListTwo[index].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = $rootScope.cuscopyListTwo[index].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = $rootScope.cuscopyListTwo[index].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = $rootScope.cuscopyListTwo[index].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = $rootScope.cuscopyListTwo[index].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = $rootScope.cuscopyListTwo[index].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = $rootScope.cuscopyListTwo[index].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.cuscopyListTwo[index].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = $rootScope.cuscopyListTwo[index].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = $rootScope.cuscopyListTwo[index].numberYearTrans;
        		$scope.conlimitSel.version = $rootScope.cuscopyListTwo[index].version;
        		$scope.conlimitSel.id = $rootScope.cuscopyListTwo[index].id;
        		$scope.conlimitSel.limitCycleTransFlag = $rootScope.cuscopyListTwo[index].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = $rootScope.cuscopyListTwo[index].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.cuscopyListTwo[index].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.cuscopyListTwo[index].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = $rootScope.cuscopyListTwo[index].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = $rootScope.cuscopyListTwo[index].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = $rootScope.cuscopyListTwo[index].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = $rootScope.cuscopyListTwo[index].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = $rootScope.cuscopyListTwo[index].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.cuscopyListTwo[index].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.cuscopyListTwo[index].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = $rootScope.cuscopyListTwo[index].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = $rootScope.cuscopyListTwo[index].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [ T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updateCopyCallBack]
    			});
		 	}
		 	//客户详情======增加交易限制  =============多个
		 	$scope.cusTypeAddCopy = function(index,itemUCus){
		 		if($rootScope.cuscopyListTwo.length>0){
					for(var i=0;i<$rootScope.cuscopyListTwo.length;i++){
						if($rootScope.cuscopyListTwo[i].currencyCode != $scope.cuscopyListTwoCur[i]){
							$scope.cuscopyListTwoCur.push($rootScope.cuscopyListTwo[i].currencyCode);
						}
					}
				}
		 		var currencyCodeOldCopy = "";
		 		if($scope.copyList.customerLimitList.length >index){
		 			currencyCodeOldCopy = $scope.cuscopyListTwoCur[index];
		 		}else{
		 			if($rootScope.cuscopyListTwo.length > 0){
		 				currencyCodeOldCopy = $rootScope.cuscopyListTwo[index].currencyCode;
		 			}else{
		 				currencyCodeOldCopy = "";
		 			}
		 		}
		 		if(itemUCus.currencyCode){
		 			if(itemUCus.mandatoryInspectionFlag){
			 			$rootScope.isCusEmptyCopy = false;
						$scope.conlimitSel = {};
						$scope.conlimitSel.authDataSynFlag = "1";
				 		$scope.conlimitSel.operationMode = $scope.copyList.operationMode;   //运营模式
				 		$scope.conlimitSel.levelFlag = 'C';   //限制层级  客户层C  媒介层M
				 		$scope.conlimitSel.differentType = $scope.differentTypeC;   //差异类型
				 		$scope.conlimitSel.transLimitCode = $scope.copyList.contrlSceneCode;    //交易限制码
				 		$scope.conlimitSel.currencyCode = itemUCus.currencyCode;
				 		$scope.conlimitSel.mandatoryInspectionFlag = itemUCus.mandatoryInspectionFlag;
				 		if($scope.conlimitSel.differentType == "1" || $scope.conlimitSel.differentType == "4"){
				 			if($scope.conlimitSel.differentType == "1"){
				 				$scope.conlimitSel.differentCode = $scope.riskLevelCopy;
				 			}else if($scope.conlimitSel.differentType == "4"){
				 				$scope.conlimitSel.differentCode = $scope.projectCodeCopy;
				 			}
				 			jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
				                		if($scope.transDifferentFlagC == 'Y'){
				                			$rootScope.isCusEmptyCopy = true;
				                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========复制客户限制多条时入账币种
				                			if($rootScope.cuscopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemUCus.currencyCode){
				                				//提取客户修改页面缓存限制信息方法===复制
				                			 	$scope.cusCopyListUpdate(index);
				                			}else{
				                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				                    				buttons : [ T.T('F00031'), T.T('F00012')],
				                    				size : [ '970px', '530px' ],
				                    				callbacks : [$scope.saveCopyCallBack ]
				                    			});
				                			}
				                		}else{
				                			$rootScope.isCusEmptyCopy = false;
				                			jfLayer.fail(T.T('SQJ1700043'));
				                		}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制客户限制单条时运营币种
			                			if($rootScope.cuscopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemUCus.currencyCode){
			                				//提取客户修改页面缓存限制信息方法===复制
			                			 	$scope.cusCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}else if($scope.conlimitSel.differentType == "2" || $scope.conlimitSel.differentType == "3"){
							if($scope.conlimitSel.differentType == "2"){
								$scope.conlimitSel.idType = $scope.idTypeCopy;
								$scope.conlimitSel.idNumber = $scope.idNumberCopy;
							}else if($scope.conlimitSel.differentType == "3"){
								$scope.conlimitSel.differentCode = $scope.externalIdentificationNoCopy;
					  			$scope.conlimitSel.externalIdentificationNo = $scope.externalIdentificationNoCopy;
							}
							jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
				                		if($scope.transDifferentFlagC == 'Y'){
				                			$rootScope.isCusEmptyCopy = true;
				                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========复制客户限制多条时入账币种
				                			if($rootScope.cuscopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemUCus.currencyCode){
				                				//提取客户修改页面缓存限制信息方法===复制
				                			 	$scope.cusCopyListUpdate(index);
				                			}else{
				                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
				                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
				                    				buttons : [ T.T('F00031'), T.T('F00012')],
				                    				size : [ '970px', '530px' ],
				                    				callbacks : [$scope.saveCopyCallBack ]
				                    			});
				                			}
				                		}else{
				                			$rootScope.isCusEmptyCopy = false;
				                			jfLayer.fail(T.T('SQJ1700043'));
				                		}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制客户限制单条时运营币种
			                			if($rootScope.cuscopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemUCus.currencyCode){
			                				//提取客户修改页面缓存限制信息方法===复制
			                			 	$scope.cusCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
				                }
				            });
						}else if($scope.conlimitSel.differentType == "0"){
							$scope.conlimitSel.differentCode = "";
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
				                if (data.returnCode == '000000') {
				                	if(data.returnData.totalCount == 0){
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyCopy = true;
			                			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面，提取公共方法=========复制客户限制多条时入账币种
			                			if($rootScope.cuscopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemUCus.currencyCode){
			                				//提取客户修改页面缓存限制信息方法===复制
			                			 	$scope.cusCopyListUpdate(index);
			                			}else{
			                				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
			                					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
			                    				buttons : [ T.T('F00031'), T.T('F00012')],
			                    				size : [ '970px', '530px' ],
			                    				callbacks : [$scope.saveCopyCallBack ]
			                    			});
			                			}
				                	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700044');
			                			$rootScope.isCusEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制客户限制单条时运营币种
			                			if($rootScope.cuscopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemUCus.currencyCode){
			                				//提取客户修改页面缓存限制信息方法===复制
			                			 	$scope.cusCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
				                }
				                else{
				                	var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
									jfLayer.fail(returnMsg);
				                }
				            });
						}
		 			}else{
		 				jfLayer.fail(T.T('SQJ1700060'));
		 			}
		 		}else{
		 			jfLayer.fail(T.T('SQJ1700050'));
		 		}
		 	};
		 	//提取媒介修改页面缓存限制信息方法===复制
		 	$scope.exceCopyListUpdate = function(index){
		 		$scope.conlimitSel.supplyControlFlag = $rootScope.extercopyListTwo[index].supplyControlFlag;
        		$scope.conlimitSel.limitCycleTrans = $rootScope.extercopyListTwo[index].limitCycleTrans;
        		$scope.conlimitSel.limitDayTrans = $rootScope.extercopyListTwo[index].limitDayTrans;		                		
        		$scope.conlimitSel.limitHalfYearTrans = $rootScope.extercopyListTwo[index].limitHalfYearTrans;		                		
        		$scope.conlimitSel.limitLifeCycleTrans = $rootScope.extercopyListTwo[index].limitLifeCycleTrans;		                		
        		$scope.conlimitSel.limitMonthTrans = $rootScope.extercopyListTwo[index].limitMonthTrans;		                		
        		$scope.conlimitSel.limitSingleTrans = $rootScope.extercopyListTwo[index].limitSingleTrans;		                	
        		$scope.conlimitSel.limitYearTrans = $rootScope.extercopyListTwo[index].limitYearTrans;
        		$scope.conlimitSel.numberCycleTrans = $rootScope.extercopyListTwo[index].numberCycleTrans;
        		$scope.conlimitSel.numberDayTrans = $rootScope.extercopyListTwo[index].numberDayTrans;
        		$scope.conlimitSel.numberHalfYearTrans = $rootScope.extercopyListTwo[index].numberHalfYearTrans;
        		$scope.conlimitSel.numberLifeCycleTrans = $rootScope.extercopyListTwo[index].numberLifeCycleTrans;
        		$scope.conlimitSel.numberMonthTrans = $rootScope.extercopyListTwo[index].numberMonthTrans;
        		$scope.conlimitSel.numberYearTrans = $rootScope.extercopyListTwo[index].numberYearTrans;
        		$scope.conlimitSel.version = $rootScope.extercopyListTwo[index].version;
        		$scope.conlimitSel.id = $rootScope.extercopyListTwo[index].id;
        		$scope.conlimitSel.limitCycleTransFlag = $rootScope.extercopyListTwo[index].limitCycleTransFlag;
        		$scope.conlimitSel.limitDayTransFlag = $rootScope.extercopyListTwo[index].limitDayTransFlag;		                		
        		$scope.conlimitSel.limitHalfYearTransFlag = $rootScope.extercopyListTwo[index].limitHalfYearTransFlag;		                		
        		$scope.conlimitSel.limitLifeCycleTransFlag = $rootScope.extercopyListTwo[index].limitLifeCycleTransFlag;		                		
        		$scope.conlimitSel.limitMonthTransFlag = $rootScope.extercopyListTwo[index].limitMonthTransFlag;		                		
        		$scope.conlimitSel.limitSingleTransFlag = $rootScope.extercopyListTwo[index].limitSingleTransFlag;		                	
        		$scope.conlimitSel.limitYearTransFlag = $rootScope.extercopyListTwo[index].limitYearTransFlag;
        		$scope.conlimitSel.numberCycleTransFlag = $rootScope.extercopyListTwo[index].numberCycleTransFlag;
        		$scope.conlimitSel.numberDayTransFlag = $rootScope.extercopyListTwo[index].numberDayTransFlag;
        		$scope.conlimitSel.numberHalfYearTransFlag = $rootScope.extercopyListTwo[index].numberHalfYearTransFlag;
        		$scope.conlimitSel.numberLifeCycleTransFlag = $rootScope.extercopyListTwo[index].numberLifeCycleTransFlag;
        		$scope.conlimitSel.numberMonthTransFlag = $rootScope.extercopyListTwo[index].numberMonthTransFlag;
        		$scope.conlimitSel.numberYearTransFlag = $rootScope.extercopyListTwo[index].numberYearTransFlag;
        		$scope.modal('/authorization/controltrading/controllimitUpdate.html', $scope.conlimitSel, {
    	 			title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
    				buttons : [T.T('F00031'), T.T('F00012')],
    				size : [ '970px', '530px' ],
    				callbacks : [$scope.updateCopyCallBack]
    			});
		 	}
			//媒介层限制详情======增加交易限制=========多个
			$scope.exceCopyAdd = function(index,itemExceU){
				if($rootScope.extercopyListTwo.length>0){
					for(var i=0;i<$rootScope.extercopyListTwo.length;i++){
						if($rootScope.extercopyListTwo[i].currencyCode != $scope.extercopyListTwoCur[i]){
							$scope.extercopyListTwoCur.push($rootScope.extercopyListTwo[i].currencyCode);
						}
					}
				}
				var currencyCodeOldCopy = "";
		 		if($scope.copyList.mediaLimitList.length >index){
		 			currencyCodeOldCopy = $scope.extercopyListTwoCur[index];
		 		}else{
		 			if($rootScope.extercopyListTwo.length > 0){
		 				currencyCodeOldCopy = $rootScope.extercopyListTwo[index].currencyCode;
		 			}else{
		 				currencyCodeOldCopy = "";
		 			}
		 		}
				if(itemExceU.currencyCode){
					if(itemExceU.mandatoryInspectionFlag){
						$rootScope.isExceEmptyCopy = false;
						$scope.conlimitSel = {};
						$scope.conlimitSel.authDataSynFlag = "1";
						$scope.conlimitSel.operationMode = $scope.copyList.operationMode;   //运营模式
						$scope.conlimitSel.levelFlag = 'M';   //限制层级  客户层C  媒介层M
						$scope.conlimitSel.differentType = $scope.differentTypeC;   //差异类型
						$scope.conlimitSel.transLimitCode = $scope.copyList.contrlSceneCode;    //交易限制码
						$scope.conlimitSel.currencyCode = itemExceU.currencyCode;
						$scope.conlimitSel.mandatoryInspectionFlag = itemExceU.mandatoryInspectionFlag;
						if($scope.conlimitSel.differentType == "1" || $scope.conlimitSel.differentType == "4"){
							if($scope.conlimitSel.differentType == "1"){
								$scope.conlimitSel.differentCode = $scope.riskLevelCopy;
							}else if($scope.conlimitSel.differentType == "4"){
								$scope.conlimitSel.differentCode = $scope.projectCodeCopy;
							}
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
					            		if($scope.transDifferentFlagC == 'Y'){
					            			$rootScope.isExceEmptyCopy = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面
					            			if($rootScope.extercopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemExceU.currencyCode){
					            				//提取媒介修改页面缓存限制信息方法===复制
					            			 	$scope.exceCopyListUpdate(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
					            					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					        	        				buttons : [ T.T('F00031'), T.T('F00012')],
					        	        				size : [ '970px', '530px' ],
					        	        				callbacks : [$scope.saveCopyCallBack ]
					        	        			});
					            			}
				                		}else{
				                			$rootScope.isExceEmptyCopy = false;
				                			jfLayer.fail(T.T('SQJ1700043'));
				                		}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			                			$rootScope.isExceEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制媒介限制多条时入账币种
			                			if($rootScope.extercopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemExceU.currencyCode){
			                				//提取媒介修改页面缓存限制信息方法===复制
				            			 	$scope.exceCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}else if($scope.conlimitSel.differentType == "2" || $scope.conlimitSel.differentType == "3"){
							if($scope.conlimitSel.differentType == "2"){
								$scope.conlimitSel.idType = $scope.idTypeCopy;
								$scope.conlimitSel.idNumber = $scope.idNumberCopy;
							}else if($scope.conlimitSel.differentType == "3"){
								$scope.conlimitSel.differentCode = $scope.externalIdentificationNoCopy;
								$scope.conlimitSel.externalIdentificationNo = $scope.externalIdentificationNoCopy;
							}
							jfRest.request('limitQuerya', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
					            		if($scope.transDifferentFlagC == 'Y'){
					            			$rootScope.isExceEmptyCopy = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面
					            			if($rootScope.extercopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemExceU.currencyCode){
					            				//提取媒介修改页面缓存限制信息方法===复制
					            			 	$scope.exceCopyListUpdate(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
					            					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					        	        				buttons : [ T.T('F00031'), T.T('F00012')],
					        	        				size : [ '970px', '530px' ],
					        	        				callbacks : [$scope.saveCopyCallBack ]
					        	        			});
					            			}
				                		}else{
				                			$rootScope.isExceEmptyCopy = false;
				                			jfLayer.fail(T.T('SQJ1700043'));
				                		}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
			                			$rootScope.isExceEmptyCopy = true;
			                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制媒介限制多条时入账币种
			                			if($rootScope.extercopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemExceU.currencyCode){
			                				//提取媒介修改页面缓存限制信息方法===复制
				            			 	$scope.exceCopyListUpdate(index);
			                			}else{
			                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
			                			 	$scope.limitListCopySql(data.returnData.rows);
			                			}
				                	}
					            }
					        });
						}else if($scope.conlimitSel.differentType == "0"){
							$scope.conlimitSel.differentCode = "";
							jfRest.request('limitQueryb', 'queryList', $scope.conlimitSel).then(function(data) {
					            if (data.returnCode == '000000') {
					            	if(data.returnData.totalCount == 0){
					            		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
					            			$rootScope.isExceEmptyCopy = true;
					            			//从数据库中未查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，弹出新增页面
					            			if($rootScope.extercopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemExceU.currencyCode){
					            				//提取媒介修改页面缓存限制信息方法===复制
					            			 	$scope.exceCopyListUpdate(index);
					            			}else{
					            				$scope.modal('/authorization/controltrading/controllimitAdd.html', $scope.conlimitSel, {
					            					title :$scope.conlimitSel.levelFlagInfo + T.T('SQJ1700066'),
					        	        				buttons : [ T.T('F00031'), T.T('F00012')],
					        	        				size : [ '970px', '530px' ],
					        	        				callbacks : [$scope.saveCopyCallBack ]
					        	        			});
					            			}
					            	}else{
				                		$scope.conlimitSel.levelFlagInfo = T.T('SQJ1700046');
				                			$rootScope.isExceEmptyCopy = true;
				                			//从数据库中查询到数据，先查看页面是否有值，如果页面有值，直接返显，页面没有值，直接返显数据库查询出来的供修改，提取公共方法=========复制媒介限制多条时入账币种
				                			if($rootScope.extercopyListTwo[index].limitSingleTransFlag && currencyCodeOldCopy == itemExceU.currencyCode){
				                				//提取媒介修改页面缓存限制信息方法===复制
					            			 	$scope.exceCopyListUpdate(index);
				                			}else{
				                				//复制限制===页面无值 取数据库=====客户，媒介，产品共用
				                			 	$scope.limitListCopySql(data.returnData.rows);
				                			}
				                	}
					            }
					        });
						}
					}else{
						jfLayer.fail(T.T('SQJ1700060'));
					}
				}else{
					jfLayer.fail(T.T('SQJ1700052'));
				}
			};
	});
	// 场景识别
	webApp.controller('controlTradListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.menuNo = lodinDataService.getObject("menuNo");
		// $scope.eventTwoList = "";
		 $scope.twoBtnUpdFlag = false;
		 $scope.isY = false;
		 if($scope.itemscen.differentType == '0'){
				$scope.twoBtnUpdFlag = true;
			}else{
				$scope.twoBtnUpdFlag = false;
			}
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
		        	$scope.operationModeFlag = data[0].operationMode;
		        }
		    };
			//交易管控查询
			$scope.itemListTwo = {
					params : $scope.queryParam = {
							operationMode:$scope.itemscen.operationMode,
							contrlSceneCode:$scope.itemscen.contrlSceneCode,
							pageSize:10,
							indexNo:0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'controlQuery.query',// 列表的资源
					isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_invalidFlag'],//查找数据字典所需参数
					transDict : ['invalidFlag_invalidFlagDesc'],//翻译前后key
					callback : function(data) { // 表格查询后的回调函数
						if(data.returnData.rows == null || data.returnData.rows == ""){
							if($scope.itemscen.differentType == '0'){
								$scope.isY = true;
							}else{
								$scope.isY = false;
							}
						}
						else{
							$scope.isY = false;
						}
					}
				};
			//管控场景建立
			$scope.addSceneInfo = function(event) {
				$scope.itemCode = $.parseJSON(JSON.stringify(event));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/authorization/controltrading/controlTradingAdd.html', $scope.itemCode, {
					title : T.T('SQJ1700027'),
					buttons : [ T.T('F00031'),T.T('F00012')],
					size : [ '1100px', '620px' ],
					callbacks : [$scope.saveControlInfo]
				});
			};
       	// 保存信息事件
			$scope.saveControlInfo = function(result) {
				$scope.conaddInfo = {};
				$scope.conaddInfo = $.parseJSON(JSON.stringify(result.scope.conadd));
				$scope.conaddInfo.operationMode = $scope.itemCode.operationMode;
				$scope.conaddInfo.contrlSceneCode = $scope.itemCode.contrlSceneCode;
				$scope.conaddInfo.startDate = $("#LAY_start_Add").val();
				$scope.conaddInfo.endDate = $("#LAY_end_Add").val();
				if($scope.conaddInfo.excpListFlag == 'Y'){
					if($scope.conaddInfo.excpListType == undefined || $scope.conaddInfo.excpListType == null || $scope.conaddInfo.excpListType == ""){
						jfLayer.fail(T.T('SQH1700109'));
						return;
					}
				}
				if($scope.conaddInfo.contListFlag == 'Y'){
					if($scope.conaddInfo.contListType == undefined || $scope.conaddInfo.contListType == null || $scope.conaddInfo.contListType == ""){
						jfLayer.fail(T.T('SQH1700110'));
						return;
					}
				}
				if(result.scope.cardList) {
					for(var i = 0; i <result.scope.cardList.length-1; i ++) {
						if(result.scope.cardList[i].cardAssociations == result.scope.cardList[i+1].cardAssociations) {
							jfLayer.fail(T.T('SQJ1700056'));
							return;
						}
					}
				}
				if(result.scope.tradList) {
					for(var i = 0; i <result.scope.tradList.length-1; i ++) {
						if(result.scope.tradList[i].transScene == result.scope.tradList[i+1].transScene) {
							jfLayer.alert(T.T('SQJ1700057'));
							return;
						}
					}
				}
		 		if(!result.scope.tradList){
		 			$scope.conaddInfo.transScene = [];
		 		}else {
		 			$scope.conaddInfo.transScene = result.scope.tradList;
		 		}
		 		if(!result.scope.cardList){
		 			$scope.conaddInfo.cardAssociations = [];
		 		}else {
		 			$scope.conaddInfo.cardAssociations = result.scope.cardList;
		 		}
	            	  jfRest.request('controlAdd', 'save', $scope.conaddInfo).then(function(data) {
	      	                if (data.returnCode == '000000') {
	      	                	jfLayer.success(T.T('F00058'));
		      	  				$scope.tradBtn = true;
		      	  				$scope.cardBtn = true;
		      	  				$scope.tradList = "";
		      	  				$scope.cardList = "";
			      	  			$scope.safeApply();
								result.cancel();
								$scope.itemListTwo.search();
	      	                }
	      	                else if(data.returnCode == 'AUTH-00012'){
	      	                	jfLayer.fail(T.T('SQJ1700028'));
	      	                }
	      	            });
			};
			//查询详情事件
			$scope.selectListTrad = function(event) {
				// 页面弹出框事件(弹出页面)
				$scope.item = {};
				$scope.item = $.parseJSON(JSON.stringify(event));
				$scope.modal('/authorization/controltrading/controlTradInfo.html', $scope.item, {
					title : T.T('SQJ1700012'),
					buttons : [ T.T('F00012')],
					size : [ '1100px', '620px' ],
					callbacks : [ ]
				});
			};
			//交易识别事件
			$scope.delControl = function(event) {
				// 页面弹出框事件(弹出页面)
				$scope.item = $.parseJSON(JSON.stringify(event));
				$scope.modal('/authorization/controltrading/controlTradInfo.html', $scope.item, {
					title : T.T('SQJ1700018'),
					buttons : [ T.T('F00016'),T.T('F00108')],
					size : [ '1100px', '620px' ],
					callbacks : [ $scope.delControlSure ]
				});
			};
			//修改弹出页面
			$scope.updateControl = function(event) {
				// 页面弹出框事件(弹出页面)
				$scope.item = $.parseJSON(JSON.stringify(event));
				$scope.modal('/authorization/controltrading/controlTradUpdate.html', $scope.item, {
					title : T.T('SQJ1700017'),
					buttons : [ T.T('F00031'),T.T('F00012')],
					size : [ '1100px', '620px' ],
					callbacks : [$scope.saveConTrad1]
				});
			};
			// 修改弹出页面==============回调函数/确认按钮事件
			$scope.saveConTrad1 = function(result) {
				$scope.item.startDate = $("#LAY_start_Update").val();
			    $scope.item.endDate = $("#LAY_end_Update").val();
			    $scope.item.invalidFlag = result.scope.invalidFlagU;
			    $scope.item.transLocation = result.scope.transLocationUpdate;
			    $scope.item.excpListFlag = result.scope.excpListFlagU;
			    $scope.item.contListFlag = result.scope.contListFlagU;
			    if($scope.item.excpListFlag == 'Y'){
					if($scope.item.excpListType == undefined || $scope.item.excpListType == null || $scope.item.excpListType == ""){
						jfLayer.fail(T.T('SQH1700109'));
						return;
					}
				}
				if($scope.item.contListFlag == 'Y'){
					if($scope.item.contListType == undefined || $scope.item.contListType == null || $scope.item.contListType == ""){
						jfLayer.fail(T.T('SQH1700110'));
						return;
					}
				}
			    if(result.scope.cardUpdateList) {
					for(var i = 0; i <result.scope.cardUpdateList.length-1; i ++) {
						if(result.scope.cardUpdateList[i].cardAssociations == result.scope.cardUpdateList[i+1].cardAssociations) {
							jfLayer.fail(T.T('SQJ1700056'));
							return;
						}
					}
				}
				if(result.scope.tradUpdateList) {
					for(var i = 0; i <result.scope.tradUpdateList.length-1; i ++) {
						if(result.scope.tradUpdateList[i].transScene == result.scope.tradUpdateList[i+1].transScene) {
							jfLayer.fail(T.T('SQJ1700057'));
							return;
						}
					}
				}
				$scope.item.cardAssociations = result.scope.cardUpdateList;
				$scope.item.transScene = result.scope.tradUpdateList;
			    if($scope.item.transLocation == "null"){
			    	delete $scope.item['transLocation'];
			    }
				jfRest.request('controlQuery', 'updateCon', $scope.item).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						 $scope.item = {};
						$scope.safeApply();
						result.cancel();
						$scope.itemListTwo.search();
					}
				});
			};
			//删除
			$scope.delControlSure = function(result){
				$scope.delItem = $scope.item;
				jfLayer.confirm(T.T('SQJ1700020'),function() {
					$scope.delItem.flag = "1";
					jfRest.request('controlQuery', 'updateCon', $scope.delItem).then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.alert(T.T('F00037'));
							$scope.safeApply();
							result.cancel();
							$scope.itemListTwo.search();
						}
					});
				},function() {
				});
			}
	});
	//场景识别 ======查询详情
	webApp.controller('controlTradViewCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		console.log($scope.item);
		//自定义下拉框--------清单检查标志
		 $scope.listFlagArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.excpListFlagInfo = $scope.item.excpListFlag;
	        }
		};
		 //自定义下拉框--------管控检查标志
		 $scope.contFlagArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.contListFlagInfo = $scope.item.contListFlag;
		        }
			};
		//管控清单层级限制-----复选框
			$scope.contListArray = [{name : T.T('SQJ1700008'),id : 'CN'},
			                        {name : T.T('SQJ1700009') ,id : 'MH'},
			                        {name : T.T('SQH1700080') ,id : 'TM'},
			                        {name : T.T('SQH1700102') ,id : 'MN'},
			                        {name : T.T('SQH1700108') ,id : 'MC'}];
			$scope.isEFlagI = false;
			$scope.isCFlagI = false;
			if($scope.item.contListFlag == 'Y'){
				$scope.isCFlagI = true;
			}else{
				$scope.isCFlagI = false;
			}
			if($scope.item.excpListFlag == 'Y'){
				$scope.isEFlagI = true;
			}else{
				$scope.isEFlagI = false;
			}
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
	        	$scope.operationModeInfo = $scope.item.operationMode;
	        }
	    };
		 $scope.countriesArrayI ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_countries",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.transLocationInfo = $scope.item.transLocation;
			        }
				};
		 $scope.invalidFlagInfo ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_invalidFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.invalidFlagInfos = $scope.item.invalidFlag;
	        }
		};
		$scope.tradSelinfoY = true;
		$scope.tradSelinfoN = false;
		$scope.cardSelinfoY = true;
		$scope.cardSelinfoN = false;
		 $scope.tradArray =[];
		$scope.mccinfoY = true;
		$scope.mccinfoN = false;
		$scope.tradInfoList = $scope.item.transScene;
		$scope.cardList = $scope.item.cardAssociations;
		$scope.mccInfoList = $scope.item.mcc;
		if($scope.tradInfoList.length == 0){
			$scope.tradSelinfoY = false;
			$scope.tradSelinfoN = true;
		}
		else{
			//交易模式
			 $scope.tradArray =[];
				//交易模式
			 $scope.paramTrad = {
		     	operationMode : $scope.item.operationMode,
				applicationRange: 'C',
		     	pageSize:10,
				indexNo:0
		     },
			jfRest.request('tradModel', 'query', $scope.paramTrad).then(function(data) {
				if(data.returnData.rows.length>0){
						 $scope.tradArray = data.returnData.rows;
						 $timeout(function() {
							Tansun.plugins.render('select');
						});
		     	}else{
		     		$scope.tradArray = [];
		     	}
			 });
			$scope.tradSelinfoY = true;
			$scope.tradSelinfoN = false;
		}
		if($scope.cardList.length == 0){
			$scope.cardSelinfoY = false;
			$scope.cardSelinfoN = true;
		}
		else{
			$scope.cardSelinfoY = true;
			$scope.cardSelinfoN = false;
		}
		//卡组标识
		$scope.cardArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_recordType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
	});
	//场景识别  ======修改
	webApp.controller('controlTradUpdateCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		 $scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		 $scope.corporationId = sessionStorage.getItem("corporation");
		//管控清单层级限制-----复选框
			$scope.contListArray = [{name : T.T('SQJ1700008'),id : 'CN'},
			                        {name : T.T('SQJ1700009') ,id : 'MH'},
			                        {name : T.T('SQH1700080') ,id : 'TM'},
			                        {name : T.T('SQH1700102') ,id : 'MN'},
			                        {name : T.T('SQH1700108') ,id : 'MC'}];
			$scope.isEFlagU = false;
			$scope.isCFlagU = false;
			if($scope.item.excpListFlag == 'Y'){
				$scope.isEFlagU = true;
			}else if($scope.item.excpListFlag == 'N'){
				$scope.isEFlagU = false;
			}
			if($scope.item.contListFlag == 'Y'){
				$scope.isCFlagU = true;
			}else if($scope.item.contListFlag == 'N'){
				$scope.isCFlagU = false;
			}
			//自定义下拉框--------清单检查标志
			 $scope.listFlagArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_isYorN",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.excpListFlagU = $scope.item.excpListFlag;
		        }
			};
			 //自定义下拉框--------管控检查标志
			 $scope.contFlagArray ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_isYorN",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.contListFlagU = $scope.item.contListFlag;
			        }
				};
		 $scope.cardAssociationsArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 $scope.countriesArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_countries",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.transLocationUpdate = $scope.item.transLocation;
	        }
		};
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
	        	$scope.operationModeUpdate = $scope.item.operationMode;
	        }
	    };
			//日期控件
			layui.use('laydate', function(){
				  var laydate = layui.laydate;
				  var startDate = laydate.render({
						elem: '#LAY_start_Update',
						min:Date.now(),
						done: function(value, date) {
							endDate.config.min = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							endDate.config.start = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
						}
					});
					var endDate = laydate.render({
						elem: '#LAY_end_Update',
						//min:Date.now(),
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							}
						}
					});
					 $("#LAY_start_Update").val($scope.item.startDate);
					 $("#LAY_end_Update").val($scope.item.endDate);
			});
			//日期控件end
		$scope.tradBtn = true;
		$scope.invalidFlag ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_invalidFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.invalidFlagU = $scope.item.invalidFlag;
	        }
		};
		//交易模式
		 $scope.tradArrayUList =[];
			//交易模式
		 $scope.paramTrad = {
	     	operationMode : $scope.item.operationMode, 
			applicationRange: 'C', 
	     	pageSize:10,
			indexNo:0
	     },
		jfRest.request('tradModel', 'query', $scope.paramTrad).then(function(data) {
			if(data.returnData.rows.length>0){
					 $scope.tradArrayUList = data.returnData.rows;
					 $timeout(function() {
						Tansun.plugins.render('select');
					});
	     	}else{
	     		$scope.tradBtn = false;
	     		$scope.tradUpdateList = [];
	     	}
		 });
		 //卡组织
		 $scope.cardArrayUList = [];
		 $scope.paramCard = {
			"type":"DROPDOWNBOX",
        	groupsCode:"dic_recordType",
        	queryFlag: "children"
	     },
		jfRest.request('paramsManage', 'query', $scope.paramCard).then(function(data) {
			if(data.returnData.rows.length>0){
					 $scope.cardArrayUList = data.returnData.rows;
					 $timeout(function() {
						Tansun.plugins.render('select');
					});
	     	}else{
	     		$scope.cardBtn = false;
	     		$scope.cardArrayUList = [];
	     	}
		 });
		$scope.tradUpdateList = $scope.item.transScene;
		$scope.cardUpdateList = $scope.item.cardAssociations;
		//交易模式
		if($scope.cardUpdateList.length == 5){
			$scope.cardBtn = false;
		}
		else{
			$scope.cardBtn = true;
		}
		//卡组织标识
		if($scope.cardUpdateList.length == 5){
			$scope.cardBtn = false;
		}
		else{
			$scope.cardBtn = true;
		}
	    //删除卡组织标识
		$scope.cardDel = function(e,$index){
	 		$scope.cardUpdateList.splice($index,1);
	 		if($scope.cardUpdateList.length == 5){
				$scope.cardBtn = false;
			}
			else{
				$scope.cardBtn = true;
			}
	 		$scope.item.cardAssociations = $scope.cardUpdateList;
	 	}
	 	//卡组织--增加
	 	$scope.cardTypeAdd = function(){
	 		 $timeout(function() {
					Tansun.plugins.render('select');
				});
	 		if($scope.cardUpdateList.length == 4){
	 			$scope.cardBtn = false;
	 			$scope.cardUpdateList.splice($scope.cardUpdateList.length,0,{});
	 		}
	 		else{
	 			$scope.cardBtn = true;
	 			if($scope.cardUpdateList == 0){
		 			$scope.cardUpdateList = [{}];
		 		}
		 		else{
		 			$scope.cardUpdateList.splice($scope.tradUpdateList.length,0,{});
		 		}
	 		}
	 		$scope.item.cardAssociations = $scope.cardUpdateList;
	 	};
	 	//删除交易模式
	 	$scope.tradDel = function(e,$index){
	 		$scope.tradUpdateList.splice($index,1);
	 		if($scope.tradUpdateList.length == 5){
	 			$scope.tradBtn = false;
	 		}
	 		else{
	 			$scope.tradBtn = true;
	 		}
	 		$scope.item.transScene = $scope.tradUpdateList;
	 	}
	 	//交易模式--增加
	 	$scope.tradTypeAdd = function(){
	 		 $timeout(function() {
					Tansun.plugins.render('select');
				});
	 		if($scope.tradUpdateList.length == 4){
	 			$scope.tradBtn = false;
	 			$scope.tradUpdateList.splice($scope.tradUpdateList.length,0,{});
	 		}
	 		else{
	 			$scope.tradBtn = true;
	 			if($scope.tradUpdateList == 0){
		 			$scope.tradUpdateList = [{}];
		 		}
		 		else{
		 			$scope.tradUpdateList.splice($scope.tradUpdateList.length,0,{});
		 		}
	 		}
	 		$scope.item.transScene = $scope.tradUpdateList;
	 	};
		 var form = layui.form;
		form.on('select(getExcpListFlagU)',function(event){
			if(event.value){
				if(event.value == 'Y'){
					$scope.isEFlagU = true;
				}else if(event.value == 'N'){
					$scope.isEFlagU = false;
					$scope.item.excpListType = "";
				}
			}
		});
		form.on('select(getContListFlagU)',function(event){
			if(event.value){
				if(event.value == 'Y'){
					$scope.isCFlagU = true;
				}else if(event.value == 'N'){
					$scope.isCFlagU = false;
					$scope.item.contListType = "";
				}
			}
		});
	});
	// 场景识别  =========建立
	webApp.controller('controlTradAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {
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
	        	$scope.operationModeFlag = data[0].operationMode;
	        }
	    };
		//管控清单层级限制-----复选框
		$scope.contListArray = [{name : T.T('SQJ1700008'),id : 'CN'},
		                        {name : T.T('SQJ1700009') ,id : 'MH'},
		                        {name : T.T('SQH1700080') ,id : 'TM'},
		                        {name : T.T('SQH1700102') ,id : 'MN'},
		                        {name : T.T('SQH1700108') ,id : 'MC'}];
		//自定义下拉框--------清单检查标志
		 $scope.listFlagArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_isYorN",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 $scope.cardAssociationsArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_recordType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.authArrays  = "";
		var addmccNew = "";
		$scope.conadd = {};
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#LAY_start_Add',
					min:Date.now(),
					done: function(value, date) {
						endDate.config.min = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						endDate.config.start = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
					}
				});
				var endDate = laydate.render({
					elem: '#LAY_end_Add',
					//min:Date.now(),
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						}
					}
				});
		});
		//日期控件end
		//交易模式
		 $scope.tradArray ={ 
	        type:"dynamic", 
	        param:{
	        	operationMode : $scope.itemscen.operationMode,
				applicationRange: 'C',
	        	pageSize:10,
				indexNo:0
	        },//默认查询条件 
	        text:"transSceneDesc", //下拉框显示内容，根据需要修改字段名称
	        value:"transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"tradModel.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 $scope.isCFlag = false;
		var form = layui.form;
		form.on('select(getContListFlag)',function(event){
			if(event.value){
				if(event.value == 'Y'){
					$scope.isCFlag = true;
				}else if(event.value == 'N'){
					$scope.isCFlag = false;
				}
			}
		});
		$scope.isEFlag = false;
		form.on('select(getExcpListFlag)',function(event){
			if(event.value){
				if(event.value == 'Y'){
					$scope.isEFlag = true;
				}else if(event.value == 'N'){
					$scope.isEFlag = false;
				}
			}
		});
		//自定义下拉框---------交易地点
		$scope.countriesArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_countries",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//定义卡组织模式
		$scope.cardBtn = true;
		$scope.cardList = "";
		//卡组织标识新增
		$scope.cardTypeAdd = function(){
	 		if($scope.cardList.length == 4){
	 			$scope.cardBtn = false;
	 			$scope.cardList.splice($scope.cardList.length,0,{});
	 		}
	 		else{
	 			$scope.cardBtn = true;
	 			if($scope.cardList == 0){
		 			$scope.cardList = [{}];
		 		}
		 		else{
		 			$scope.cardList.splice($scope.cardList.length,0,{});
		 		}
	 			if($scope.cardList.length >= 5){
		 			$scope.cardBtn = false;
		 		}
		 		else{
		 			$scope.cardBtn = true;
		 		}
	 		}
	 	};
	 	//卡组织标识删除
	 	$scope.cardDel = function(e,$index){
	 		$scope.cardList.splice($index,1);
	 		if($scope.cardList.length >= 5){
	 			$scope.cardBtn = false;
	 		}
	 		else{
	 			$scope.cardBtn = true;
	 		}
	 	}
		//定义交易模式信息--------默认值
		$scope.tradBtn = true;
		$scope.tradList = "";
	 	//交易模式--增加
	 	$scope.tradTypeAdd = function(){
	 		$scope.tradBtn = true;
 			if($scope.tradList == 0){
	 			$scope.tradList = [{}];
	 		}
	 		else{
	 			$scope.tradList.splice($scope.tradList.length,0,{});
	 		}
	 		if($scope.tradList.length >= 5){
	 			$scope.tradBtn = false;
	 		}
	 		else{
	 			$scope.tradBtn = true;
	 		}
	 	};
	 	//删除交易模式
	 	$scope.tradDel = function(e,$index){
	 		$scope.tradList.splice($index,1);
	 		if($scope.tradList.length >= 5){
	 			$scope.tradBtn = false;
	 		}
	 		else{
	 			$scope.tradBtn = true;
	 		}
	 	}
	});
	//交易管控建立   客户限制新增===========新增，修改，详情共用
	webApp.controller('limitCusAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_limit');
		$translate.refresh();
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		$scope.listlimitC = {};
		//自定义下拉框--------限制币种======只有人民币
		$scope.cur156Array = {};
		 $scope.params = {
			 corporationEntityNo:$scope.corporationId,
			 requestType:"1",
			 resultType:"1"
		 };
		 jfRest.request('legalEntity', 'query', $scope.params).then(function(data) {
			 $scope.cur156Array = data.returnData.rows;
		 });
		$scope.crrysArray ={ 
		        type:"dynamic", 
		        param:{
			"operationMode":$scope.operationMode,
		},//默认查询条件 
		        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operatCurrency.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.currencyCodeInfo = $scope.conlimitSel.currencyCode;
		        }
		    };
		$scope.supplyControlFlagAdd ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_YorNy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.supplyControlFlagA= $scope.conlimitSel.supplyControlFlag;
	        }
		};
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
				$scope.conlimitSel.limitSingleTransFlag = 'N';
				$scope.conlimitSel.limitDayTransFlag = 'N';
				$scope.conlimitSel.limitCycleTransFlag = 'N';
				$scope.conlimitSel.limitMonthTransFlag = 'N';
				$scope.conlimitSel.limitHalfYearTransFlag = 'N';
				$scope.conlimitSel.limitYearTransFlag = 'N';
				$scope.conlimitSel.limitLifeCycleTransFlag = 'N';
				$scope.conlimitSel.numberDayTransFlag = 'N';
				$scope.conlimitSel.numberCycleTransFlag = 'N';
				$scope.conlimitSel.numberMonthTransFlag = 'N';
				$scope.conlimitSel.numberHalfYearTransFlag = 'N';
				$scope.conlimitSel.numberYearTransFlag = 'N';
				$scope.conlimitSel.numberLifeCycleTransFlag = 'N';
			}
		};
		var form = layui.form;
		 form.on('select(getFlag1Add)',function(event){
			if(event.value){	
				if(event.value == 'Y'){
					$('#limitSingleTransId').removeAttr('readonly');
					$('#limitSingleTransId').removeClass('bnone');
				}else if(event.value == 'N'){
					$('#limitSingleTransId').attr('readonly',true);
					$('#limitSingleTransId').addClass('bnone');
					$scope.listlimitC.limitSingleTrans = "";
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
					$scope.listlimitC.limitDayTrans = "";
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
						$scope.listlimitC.limitCycleTrans = "";
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
						$scope.listlimitC.limitMonthTrans = "";
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
						$scope.listlimitC.limitHalfYearTrans = "";
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
						$scope.listlimitC.limitYearTrans = "";
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
						$scope.listlimitC.limitLifeCycleTrans = "";
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
						$scope.listlimitC.numberDayTrans = "";
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
						$scope.listlimitC.numberCycleTrans = "";
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
						$scope.listlimitC.numberMonthTrans = "";
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
						$scope.listlimitC.numberHalfYearTrans = "";
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
						$scope.listlimitC.numberYearTrans = "";
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
						$scope.listlimitC.numberLifeCycleTrans = "";
					}
				}
			 });
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
					$scope.limitSingleTransFlagU = $scope.conlimitSel.limitSingleTransFlag;
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
					$scope.limitDayTransFlagU = $scope.conlimitSel.limitDayTransFlag;
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
					$scope.limitCycleTransFlagU = $scope.conlimitSel.limitCycleTransFlag;
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
					$scope.limitMonthTransFlagU = $scope.conlimitSel.limitMonthTransFlag;
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
					$scope.limitHalfYearTransFlagU = $scope.conlimitSel.limitHalfYearTransFlag;
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
					$scope.limitYearTransFlagU = $scope.conlimitSel.limitYearTransFlag;
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
					$scope.limitLifeCycleTransFlagU = $scope.conlimitSel.limitLifeCycleTransFlag;
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
					$scope.numberDayTransFlagU = $scope.conlimitSel.numberDayTransFlag;
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
					$scope.numberCycleTransFlagU = $scope.conlimitSel.numberCycleTransFlag;
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
					$scope.numberMonthTransFlagU = $scope.conlimitSel.numberMonthTransFlag;
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
					$scope.numberHalfYearTransFlagU = $scope.conlimitSel.numberHalfYearTransFlag;
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
					$scope.numberYearTransFlagU = $scope.conlimitSel.numberYearTransFlag;
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
					$scope.numberLifeCycleTransFlagU = $scope.conlimitSel.numberLifeCycleTransFlag;
				}
			};
		 if($scope.conlimitSel.limitSingleTransFlag == 'Y'){
				$('#flagInpt1').removeAttr('readonly');
				$('#flagInpt1').removeClass('bnone');
			}else if($scope.conlimitSel.limitSingleTransFlag == 'N'){
				$('#flagInpt1').attr('readonly',true);
				$('#flagInpt1').addClass('bnone');
			};
			if($scope.conlimitSel.limitDayTransFlag == 'Y'){
				$('#flagInpt2').removeAttr('readonly');
				$('#flagInpt2').removeClass('bnone');
			}else if($scope.conlimitSel.limitDayTransFlag == 'N'){
				$('#flagInpt2').attr('readonly',true);
				$('#flagInpt2').addClass('bnone');
			};
			if($scope.conlimitSel.limitCycleTransFlag == 'Y'){
				$('#flagInpt3').removeAttr('readonly');
				$('#flagInpt3').removeClass('bnone');
			}else if($scope.conlimitSel.limitCycleTransFlag == 'N'){
				$('#flagInpt3').attr('readonly',true);
				$('#flagInpt3').addClass('bnone');
			};
			if($scope.conlimitSel.limitMonthTransFlag == 'Y'){
				$('#flagInpt4').removeAttr('readonly');
				$('#flagInpt4').removeClass('bnone');
			}else if($scope.conlimitSel.limitMonthTransFlag == 'N'){
				$('#flagInpt4').attr('readonly',true);
				$('#flagInpt4').addClass('bnone');
			};
			if($scope.conlimitSel.limitHalfYearTransFlag == 'Y'){
				$('#flagInpt5').removeAttr('readonly');
				$('#flagInpt5').removeClass('bnone');
			}else if($scope.conlimitSel.limitHalfYearTransFlag == 'N'){
				$('#flagInpt5').attr('readonly',true);
				$('#flagInpt5').addClass('bnone');
			};
			if($scope.conlimitSel.limitYearTransFlag == 'Y'){
				$('#flagInpt6').removeAttr('readonly');
				$('#flagInpt6').removeClass('bnone');
			}else if($scope.conlimitSel.limitYearTransFlag == 'N'){
				$('#flagInpt6').attr('readonly',true);
				$('#flagInpt6').addClass('bnone');
			};
			if($scope.conlimitSel.limitLifeCycleTransFlag == 'Y'){
				$('#flagInpt7').removeAttr('readonly');
				$('#flagInpt7').removeClass('bnone');
			}else if($scope.conlimitSel.limitLifeCycleTransFlag == 'N'){
				$('#flagInpt7').attr('readonly',true);
				$('#flagInpt7').addClass('bnone');
			};
			if($scope.conlimitSel.numberDayTransFlag == 'Y'){
				$('#flagInpt8').removeAttr('readonly');
				$('#flagInpt8').removeClass('bnone');
			}else if($scope.conlimitSel.numberDayTransFlag == 'N'){
				$('#flagInpt8').attr('readonly',true);
				$('#flagInpt8').addClass('bnone');
			};
			if($scope.conlimitSel.numberCycleTransFlag == 'Y'){
				$('#flagInpt9').removeAttr('readonly');
				$('#flagInpt9').removeClass('bnone');
			}else if($scope.conlimitSel.numberCycleTransFlag == 'N'){
				$('#flagInpt9').attr('readonly',true);
				$('#flagInpt9').addClass('bnone');
			};
			if($scope.conlimitSel.numberMonthTransFlag == 'Y'){
				$('#flagInpt10').removeAttr('readonly');
				$('#flagInpt10').removeClass('bnone');
			}else if($scope.conlimitSel.numberMonthTransFlag == 'N'){
				$('#flagInpt10').attr('readonly',true);
				$('#flagInpt10').addClass('bnone');
			};
			if($scope.conlimitSel.numberHalfYearTransFlag == 'Y'){
				$('#flagInpt11').removeAttr('readonly');
				$('#flagInpt11').removeClass('bnone');
			}else if($scope.conlimitSel.numberHalfYearTransFlag == 'N'){
				$('#flagInpt11').attr('readonly',true);
				$('#flagInpt11').addClass('bnone');
			};
			if($scope.conlimitSel.numberYearTransFlag == 'Y'){
				$('#flagInpt12').removeAttr('readonly');
				$('#flagInpt12').removeClass('bnone');
			}else if($scope.conlimitSel.numberYearTransFlag == 'N'){
				$('#flagInpt12').attr('readonly',true);
				$('#flagInpt12').addClass('bnone');
			};
			if($scope.conlimitSel.numberLifeCycleTransFlag == 'Y'){
				$('#flagInpt13').removeAttr('readonly');
				$('#flagInpt13').removeClass('bnone');
			}else if($scope.conlimitSel.numberLifeCycleTransFlag == 'N'){
				$('#flagInpt13').attr('readonly',true);
				$('#flagInpt13').addClass('bnone');
			};
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
						$scope.conlimitSel.limitSingleTrans = "";
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
						$scope.conlimitSel.limitDayTrans = "";
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
							$scope.conlimitSel.limitCycleTrans = "";
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
							$scope.conlimitSel.limitMonthTrans = "";
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
							$scope.conlimitSel.limitHalfYearTrans = "";
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
							$scope.conlimitSel.limitYearTrans = "";
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
							$scope.conlimitSel.limitLifeCycleTrans = "";
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
							$scope.conlimitSel.numberDayTrans = "";
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
							$scope.conlimitSel.numberCycleTrans = "";
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
							$scope.conlimitSel.numberMonthTrans = "";
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
							$scope.conlimitSel.numberHalfYearTrans = "";
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
							$scope.conlimitSel.numberYearTrans = "";
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
							$scope.conlimitSel.numberLifeCycleTrans = "";
						}
					}
				 });
		$scope.isCustomerNoAdd = false;
		$scope.isExterNoAdd = false;
		$scope.isriskLevelNoAdd = false;
		$scope.isSupplyControlFlagAdd = false;
		$scope.isProNoAdd = false;
		if($scope.conlimitSel.differentType == "1"){
			$scope.differentTypeCusInfo = T.T('SQH1700085');
			$scope.isCustomerNoAdd = false;
			$scope.isExterNoAdd = false;
			$scope.isriskLevelNoAdd = true;
			$scope.isSupplyControlFlagAdd = false;
			$scope.isProNoAdd = false;
			$scope.riskLevelAdd = $scope.conlimitSel.differentCode;
  			$scope.idTypeAdd = "";
  			$scope.idNumberAdd = "";
  			$scope.proNoAdd = "";
  			$scope.externalIdentificationNoAdd = "";
  			$scope.listlimitC.supplyControlFlag = "";
		}else if($scope.conlimitSel.differentType == "4"){
			$scope.differentTypeCusInfo = T.T('SQJ1700029');
			$scope.isCustomerNoAdd = false;
			$scope.isExterNoAdd = false;
			$scope.isriskLevelNoAdd = false;
			$scope.isSupplyControlFlagAdd = false;
			$scope.isProNoAdd = true;
			$scope.proNoAdd = $scope.conlimitSel.differentCode;
  			$scope.idTypeAdd = "";
  			$scope.idNumberAdd = "";
  			$scope.externalIdentificationNoAdd = "";
  			$scope.riskLevelAdd = '';
  			$scope.listlimitC.supplyControlFlag = "";
		}
		else if($scope.conlimitSel.differentType == "2"){
			$scope.differentTypeCusInfo = T.T('SQH1700086');
			$scope.isCustomerNoAdd = true;
			$scope.isExterNoAdd = false;
			$scope.isriskLevelNoAdd = false;
			$scope.isSupplyControlFlagAdd = false;
			$scope.isProNoAdd = false;
			$scope.idTypeAdd = $scope.conlimitSel.idType;
  			$scope.idNumberAdd = $scope.conlimitSel.idNumber;
  			$scope.riskLevelAdd = '';
  			$scope.externalIdentificationNoAdd = "";
  			$scope.listlimitC.supplyControlFlag = "";
  			$scope.proNoAdd = "";
		}else if($scope.conlimitSel.differentType == "3"){
			$scope.differentTypeCusInfo = T.T('SQH1700087');
			$scope.isCustomerNoAdd = false;
			$scope.isExterNoAdd = true;
			$scope.isriskLevelNoAdd = false;
			$scope.isSupplyControlFlagAdd = true;
			$scope.isProNoAdd = false;
			$scope.externalIdentificationNoAdd = $scope.conlimitSel.externalIdentificationNo;
  			$scope.idTypeAdd = "";
  			$scope.idNumberAdd = "";
  			$scope.riskLevelAdd = "";
  			$scope.proNoAdd = "";
		}else{
			$scope.differentTypeCusInfo = T.T('SQH1700084');
			$scope.isCustomerNoAdd = false;
			$scope.isExterNoAdd = false;
			$scope.isriskLevelNoAdd = false;
			$scope.isSupplyControlFlagAdd = false;
			$scope.isProNoAdd = false;
  			$scope.idTypeAdd = "";
  			$scope.idNumberAdd = "";
  			$scope.riskLevelAdd = "";
  			$scope.externalIdentificationNoAdd = "";
  			$scope.listlimitC.supplyControlFlag = "";
  			$scope.proNoAdd = "";
		}
	});
});