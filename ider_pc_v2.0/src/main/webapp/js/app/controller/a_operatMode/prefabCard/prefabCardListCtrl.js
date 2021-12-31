'use strict';
define(function(require) {
	var webApp = require('app');
	//预制卡查询及维护
	webApp.controller('prefabCardListCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/prefabCard/i18n_prefabCard');
		$translate.refresh();
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		$scope.organization = $scope.userInfo.organization;  //获取组织机构
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false;
		 //根据菜单和当前登录者查询有权限的事件编号
			 $scope.paramsNo = {
					 menuNo:$scope.menuNo
			 };
  			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnData != null || data.returnData != ""){
  					for(var i=0;i<data.returnData.length;i++){
  	   					$scope.eventList += data.returnData[i].eventNo + ",";
  	   				}
		   	   		if($scope.eventList.search('COS.IQ.02.0163') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0167') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0154') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
  		//产品对象
			$scope.productObjectCodeArr = { 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"productDesc",
		        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"proObject.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//媒介对象
			$scope.mediaObjectCodeArr = { 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"mediaObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"mediaObjectDesc",
		        value:"mediaObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"mediaObject.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
			//卡板代码
			 $scope.formatCodeArr ={ 
		        type:"dynamicDesc", 
		        param:{
		        },//默认查询条件 
		        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"formatDescribe",
		        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"cardLayoutMag.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
		 var form = layui.form;
			form.on('select(getFormatCode)',function(data){
				if(data.value == "" || data.value == undefined){
					$("#formatCode1").attr("disabled",true);
					$scope.prefabCardTable.params.formatCode = "";
					$scope.prefabCardTable.params.productObjectCode = "";
					$scope.queryForm.$setPristine();
				}else {
					//卡板代码
					 $scope.formatCodeArr ={ 
						        type:"dynamicDesc", 
						        param:{
						        	productObjectCode:$scope.prefabCardTable.params.productObjectCode
						        },//默认查询条件 
						        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
						        desc:"formatDescribe",
						        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
						        resource:"cardLayoutMag.query",//数据源调用的action 
						        callback: function(data){
						        }
					};
					 $("#formatCode1").removeAttr("disabled");
					 $timeout(function(){
		        		Tansun.plugins.render('select');
					});
				}
			});
  		//查询法人实体
  		$scope.queryCorporation = function(){
			$scope.queryParam = {
				organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo='';
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				$scope.prefabCardTable.params.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
					$scope.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporation").attr("disabled",true);
				}
			});
		};
		$scope.queryCorporation();
		//预制卡信息表
		$scope.prefabCardTable = {
			params : {
					autoQuery : false,
					"corporationEntityNo":$scope.corporationEntityNo,
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'prefabCard.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_prefabCardFlag'],//查找数据字典所需参数
			transDict : ['applyFlag_applyFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//新增 
		$scope.addPrefabCardTable = function(event){	
			// 页面弹出框事件(弹出页面)
			$scope.corporationEntityNo = event;
			$scope.modal('/a_operatMode/prefabCard/prefabCardEst.html', $scope.corporationEntityNo, {
				title : T.T('PZJ170001'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [$scope.saveAddPrefabCard]
			});
		};
		//新增回调函数
		$scope.saveAddPrefabCard = function(result){
				$scope.prefabCardEstInf=result.scope.prefabCardEstInf;
				jfRest.request('prefabCard','save', $scope.prefabCardEstInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032')) ;
						$scope.cardBin = {};
						$scope.prefabCardTable.search();
						result.scope.prefabCardForm.$setPristine();
						$scope.safeApply();
						result.cancel();
					}
				});
		};
		//查询预制卡详情
		$scope.viewPrefabCard = function(event){	
			$scope.item =  $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/prefabCard/viewPrefabCard.html', $scope.item, {
				title : T.T('PZJ170002'),
				buttons : [T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [ ]				
			});
		};
		//修改
		$scope.updatePrefabCard = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/prefabCard/updatePrefabCard.html', $scope.item, {
				title : T.T('PZJ170003'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.saveUpPrefabCard]
			});
		};
		//保存
		$scope.saveUpPrefabCard = function (result){
			$scope.items = {
					corporationEntityNo: result.scope.prefabCardInf.corporationEntityNo,
					productObjectCode: result.scope.prefabCardInf.upproductObjectCode,
					mediaObjectCode: result.scope.prefabCardInf.upmediaObjectCode,
					formatCode: result.scope.prefabCardInf.upformatCode,
					applyNumber: result.scope.prefabCardInf.applyNumber,
					id:result.scope.prefabCardInf.id,
					applyFlag: result.scope.prefabCardInf.applyFlag,
			};
			jfRest.request('prefabCard', 'update', $scope.items) .then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.prefabCardTable.search();
				}
			});
		}
	});
	//查询预制卡
	webApp.controller('viewPrefabCardCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.prefabCardInf = $scope.item;
		//产品对象
			$scope.productObjectCodeArr = { 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"productDesc",
		        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"proObject.query",//数据源调用的action 
		        callback: function(data){
		        	 $scope.prefabCardInf.vwproductObjectCode = $scope.item.productObjectCode;
		        }
			};
			//媒介对象
			$scope.mediaObjectCodeArr = { 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"mediaObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"mediaObjectDesc",
		        value:"mediaObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"mediaObject.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.prefabCardInf.vwmediaObjectCode = $scope.item.mediaObjectCode;
		        }
			};
			//卡板代码
			 $scope.formatCodeArr ={ 
				        type:"dynamicDesc", 
				        param:{
				        	productObjectCode:$scope.prefabCardInf.productObjectCode
				        },//默认查询条件 
				        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
				        desc:"formatDescribe",
				        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"cardLayoutMag.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.prefabCardInf.vwformatCode = $scope.item.formatCode;
				        }
			};
			var form = layui.form;
			form.on('select(getFormatCode)',function(data){
				if(data.value == "" || data.value == undefined){
					$("#formatCode").attr("disabled",true);
					$scope.prefabCardEstInf.formatCode = "";
					$scope.prefabCardEstInf.productObjectCode = "";
					$scope.prefabCardForm.$setPristine();
				}else {
					//卡板代码
					 $scope.formatCodeArr ={ 
						        type:"dynamicDesc", 
						        param:{
						        	productObjectCode:$scope.prefabCardInf.productObjectCode
						        },//默认查询条件 
						        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
						        desc:"formatDescribe",
						        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
						        resource:"cardLayoutMag.query",//数据源调用的action 
						        callback: function(data){
						        }
					};
					 $("#formatCode").removeAttr("disabled");
					 $timeout(function(){
		        		Tansun.plugins.render('select');
					});
				}
			});
	});
	//修改预制卡
	webApp.controller('updatePrefabCardCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		$scope.organization = $scope.userInfo.organization;  //获取组织机构
		$scope.prefabCardInf = $scope.item;
		//查询法人实体
  		$scope.queryCorporation = function(){
			$scope.queryParam = {
				organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
					$scope.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporation").attr("disabled",true);
				}
			});
		};
		$scope.queryCorporation();
		//产品对象
			$scope.productObjectCodeArr = { 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"productDesc",
		        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"proObject.query",//数据源调用的action 
		        callback: function(data){
		        	 $scope.prefabCardInf.upproductObjectCode = $scope.item.productObjectCode;
		        }
			};
			//媒介对象
			$scope.mediaObjectCodeArr = { 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"mediaObjectCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"mediaObjectDesc",
		        value:"mediaObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"mediaObject.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.prefabCardInf.upmediaObjectCode = $scope.item.mediaObjectCode;
		        }
			};
			//卡板代码
			 $scope.formatCodeArr ={ 
				        type:"dynamicDesc", 
				        param:{
				        	productObjectCode:$scope.prefabCardInf.productObjectCode
				        },//默认查询条件 
				        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
				        desc:"formatDescribe",
				        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
				        resource:"cardLayoutMag.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.prefabCardInf.upformatCode = $scope.item.formatCode;
				        }
			};
			var form = layui.form;
			form.on('select(getFormatCode)',function(data){
				if(data.value == "" || data.value == undefined){
					$("#formatCode").attr("disabled",true);
					$scope.prefabCardEstInf.formatCode = "";
					$scope.prefabCardEstInf.productObjectCode = "";
					$scope.prefabCardForm.$setPristine();
				}else {
					//卡板代码
					 $scope.formatCodeArr ={ 
						        type:"dynamicDesc", 
						        param:{
						        	productObjectCode:$scope.prefabCardInf.productObjectCode
						        },//默认查询条件 
						        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
						        desc:"formatDescribe",
						        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
						        resource:"cardLayoutMag.query",//数据源调用的action 
						        callback: function(data){
						        }
					};
					 $("#formatCode").removeAttr("disabled");
					 $timeout(function(){
		        		Tansun.plugins.render('select');
					});
				}
			});
	});
	//新增预制卡
	webApp.controller('prefabCardEstCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.prefabCardEstInf ={};
		$scope.prefabCardEstInf.corporationEntityNo= $scope.corporationEntityNo ;//法人编号
		//产品对象
		$scope.productObjectCodeArr = { 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"productDesc",
	        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"proObject.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//媒介对象
		$scope.mediaObjectCodeArr = { 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"mediaObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"mediaObjectDesc",
	        value:"mediaObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"mediaObject.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//卡板代码
		$scope.formatCodeArr = {};
		var form = layui.form;
		form.on('select(getFormatCode)',function(data){
			if(data.value == "" || data.value == undefined){
				$("#formatCode").attr("disabled",true);
				$scope.prefabCardEstInf.formatCode = "";
				$scope.prefabCardEstInf.productObjectCode = "";
				$scope.prefabCardForm.$setPristine();
			}else {
				//卡板代码
				 $scope.formatCodeArr ={ 
					        type:"dynamicDesc", 
					        param:{
					        	productObjectCode:$scope.prefabCardEstInf.productObjectCode
					        },//默认查询条件 
					        text:"formatCode", //下拉框显示内容，根据需要修改字段名称 
					        desc:"formatDescribe",
					        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"cardLayoutMag.query",//数据源调用的action 
					        callback: function(data){
					        }
				};
				 $("#formatCode").removeAttr("disabled");
				 $timeout(function(){
	        		Tansun.plugins.render('select');
				});
			}
		});
		//法人实体编号
		$scope.chosecorporation = function(){
			//弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/prefabCard/prefabCardChoseCorporation.html', $scope.params, {
				title : T.T('PZJ1000005'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.chosecorpEntityNo]
			});
		};
		$scope.chosecorpEntityNo = function(result){
			if (!result.scope.legalEntityList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.legalEntityList.checkedList();
			$scope.prefabCardEstInf.corporationEntityNo  = $scope.checkedEvent.corporationEntityNo;
			$scope.safeApply();
			result.cancel();
		}
	});
	//预制卡选择法人实体
	webApp.controller('prefabCardChoseCorporationCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translate.refresh();
		// 事件清单列表
		$scope.legalEntityList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'legalEntity.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
});
