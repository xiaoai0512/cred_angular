'use strict';
define(function(require) {
	var webApp = require('app');
	// 定价标签列表查询
	webApp.controller('priceLabelQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0019') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0019') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0019') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
		//定价类型 
		$scope.pricTypeArray = {
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
			}
		};
		//定价区域
		$scope.priceAreaArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//定价对象
		$scope.priceObjArr ={ };
		//定价类型联动查询定价对象
		var form = layui.form;
		form.on('select(getPricTyp)',function(data){
			if(data.value == 'PCD'){
				$scope.priceObjArr ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
					desc:"pcdDesc",
					value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"pcd.query",//数据源调用的action 
				};
			}else if(data.value == 'FIT'){
				$scope.priceObjArr ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"feeItemNo", //下拉框显示内容，根据需要修改字段名称 
					desc:'feeDesc',
					value:"feeItemNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"feeProject.query",//数据源调用的action 
					callback: function(data){
			        	//console.log(data);
			        }
				};
            }
        });
		$scope.priceLabelList = {
				// checkType : 'radio', // 当为checkbox时为多选
				params : {
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'priceLabel.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
				transDict : ['pricingType_pricingTypeDesc','pricingMethod_pricingMethodDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			 $scope.priceObj ={ 
				 type:"dynamicDesc", 
				 param:{},//默认查询条件 
				 text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
				 desc:"pcdDesc",
				 value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称 
				 resource:"pcd.query",//数据源调用的action 
				 callback: function(data){
		        	//console.log(data);
				}
			 };
			 $scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 	//币种查询
		 	$scope.currencyArray ={ 
	 			type:"dynamicDesc", 
				param:{},//默认查询条件 
				text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
				desc:"currencyDesc",
				value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
				resource:"currency.query",//数据源调用的action 
				callback: function(data){
		        }
		 	};
			//查看还款优先级
			$scope.choseBtnPriority = function() {
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/priceLabel/viewPricePriority.html', $scope.params, {
					title : T.T('YYJ800014'),
					buttons : [ T.T('F00012') ],
					size : [ '1000px', '500px' ],
					callbacks : []
				});
			};
			// 查看
			$scope.queryPriceLabel = function(event) {
				$scope.priceLabelItem = $.parseJSON(JSON.stringify(event));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/priceLabel/viewPriceLabel.html', $scope.priceLabelItem, {
					title : T.T('YYJ800009'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '950px', '410px' ],
					callbacks : [ ]
				});
			};
		// 修改
		$scope.updatePriceLabel = function(event) {
			$scope.priceLabelItem = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/priceLabel/updatePriceLabel.html', $scope.priceLabelItem, {
				title : T.T('YYJ800010'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '950px', '410px' ],
				callbacks : [ $scope.sureUpdatePriceLabel]
			});
		};
		// 回调函数/确认按钮事件
		$scope.sureUpdatePriceLabel = function(result) {
			//取值类型为数值 ，取值必输
			if(result.scope.pcdTypeU == 'D'){
				if(!result.scope.priceLabelItem.pcdPoint){
					jfLayer.alert(T.T('YYJ800017')) ;
					return;
				}
            }
            $scope.paramss = result.scope.priceLabelItem;
			$scope.paramss.pricingCurrencyCode = result.scope.pricingCurrencyCode;
			$scope.paramss.pcdType = result.scope.pcdTypeU;
			$scope.paramss.pricingMethod = result.scope.pricingMethod;
			$scope.paramss.pricingType = result.scope.pricingType;
			$scope.paramss.pricingObject = result.scope.pricingObject;
			if($scope.paramss.pricingMethod=="null"){
				delete $scope.paramss['pricingMethod'];
			}
			jfRest.request('priceLabel', 'update', $scope.paramss)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.priceLabelList.search();
				}
			});
		};
		//新增
		$scope.priceLabelAdd = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/priceLabel/priceLabelEst.html', '', {
				title : T.T('YYJ800013'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '420px' ],
				callbacks : [$scope.savePriceLabel ]
			});
		};
		//保存
		$scope.savePriceLabel = function(result){
			//取值类型为数值 ，取值必输
			if(result.scope.priceLabelInf.pcdType == 'D'){
				if(!result.scope.priceLabelInf.pcdPoint){
					jfLayer.alert(T.T('YYJ800017'));
					return;
                }
            }
            $scope.priceLabelInf = {};
			$scope.priceLabelInf = result.scope.priceLabelInf;
			$scope.priceLabelInf.pricingTag = $scope.priceLabelInf.pricingTag1 + $scope.priceLabelInf.pricingTag2;
			jfRest.request('priceLabel', 'save', $scope.priceLabelInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.priceLabelInf = {};
					result.scope.priceTagModeInfForm.$setPristine();
					$scope.safeApply();
					result.cancel();
					$scope.priceLabelList.search();
				}
			});
		};
		//复制
		$scope.copyPriceLabel = function(event){
			$scope.priceCopyInfo = {};
			$scope.priceCopyInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/priceLabel/priceLabelCopy.html', $scope.priceCopyInfo, {
				title : T.T('YYJ800015'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '420px' ],
				callbacks : [$scope.savePriceLabelCopy ]
			});
		};
		//保存
		$scope.savePriceLabelCopy = function(result){
			//取值类型为数值 ，取值必输
			if(result.scope.pcdType == 'D'){
				if(!result.scope.priceCopy.pcdPoint){
					jfLayer.alert(T.T('YYJ800017')) ;
					return;
                }
            }
            $scope.priceLabelCopy = {};
			$scope.priceLabelCopy = result.scope.priceCopy;
			$scope.priceLabelCopy.operationMode = result.scope.operationModeView;
			$scope.priceLabelCopy.pricingCurrencyCode=result.scope.pricingCurrencyCode;
			$scope.priceLabelCopy.pricingObjectCode = result.scope.pricingObjectShow;
			$scope.priceLabelCopy.pricingTag = result.scope.pricingTag1 + result.scope.pricingTag2;
			$scope.priceLabelCopy.pcdType = result.scope.pcdType;
			$scope.priceLabelCopy.pricingMethod = result.scope.pricingMethod;
			$scope.priceLabelCopy.pricingType = result.scope.pricingType;
			$scope.priceLabelCopy.pricingObject = result.scope.pricingObject;
			jfRest.request('priceLabel', 'save', $scope.priceLabelCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.priceLabelCopy = {};
					$scope.safeApply();
					result.cancel();
					$scope.priceLabelList.search();
				}
			});
		};
	});
	//修改
	webApp.controller('updatePriceLabelCtrl', function($scope, $stateParams,$timeout,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.checkLblObjList = $scope.item;
		var form = layui.form;
	    $scope.priceObj ={};
	    //定价类型
	    $scope.tagTypeArray = {
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
				$scope.pricingObject=$scope.priceLabelItem.pricingObject;
			}
		};	
		//定价区域
		$scope.pricingTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingType=$scope.priceLabelItem.pricingType;
			}
		};
		//定价方式 
		$scope.pricingMethodArray = {
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
				$scope.pricingMethod=$scope.priceLabelItem.pricingMethod;
			}
		};
		//取值类型
		$scope.pcdTypeArray = {
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
				$scope.pcdTypeU=$scope.priceLabelItem.pcdType;
			}
		};
	    //运营模式
	    $timeout(function() {
	    	$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	//$scope.priceLabelItem.operationModeView = $scope.priceLabelItem.operationMode;
		        }
		    };
	    },500);
	    //币种查询
	 	$scope.updateCurrencyArray ={ 
 			type:"dynamicDesc", 
			param:{},//默认查询条件 
			text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
			desc:"currencyDesc",
			value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			resource:"currency.query",//数据源调用的action 
			callback: function(data){
				$scope.pricingCurrencyCode = $scope.priceLabelItem.pricingCurrencyCode;
	        }
	 	};
	    $scope.showTagType = function() {
	    	if($scope.priceLabelItem.pricingObject == "PCD"){
				$scope.showBaseFee = false;
				$scope.priceObj ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
					desc:"pcdDesc",
					value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"pcd.query",//数据源调用的action 
					callback: function(data){
						$scope.priceLabelItem.pricingObjectShow = $scope.priceLabelItem.pricingObjectCode;
			        	//console.log(data);
			        }
				};
			}else if($scope.priceLabelItem.pricingObject == "FIT"){
				$scope.showBaseFee = true;
				$scope.priceObj ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"feeItemNo", //下拉框显示内容，根据需要修改字段名称 
					desc:"feeDesc",
					value:"feeItemNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"feeProject.query",//数据源调用的action 
					callback: function(data){
						$scope.priceLabelItem.pricingObjectShow = $scope.priceLabelItem.pricingObjectCode;
			        	//console.log(data);
			        }
				};
			}
	    };
	    $scope.showTagType();
		form.on('select(gettagtype)',function(event){
			 $scope.showTagType();
		});
		var assessmentMethod="";
		//定价方式B
       $scope.pricingMethodArrayB={
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   				groupsCode : "dic_priceModelArrayB",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   				$scope.pricingMethod=$scope.priceLabelItem.pricingMethod;
   			}
   		};
		//定价方式C
		$scope.pricingMethodArrayC={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceModelArrayC",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingMethod=$scope.priceLabelItem.pricingMethod;
			}
		};
		$rootScope.isA = false;
		$rootScope.isB = false;
		$rootScope.isPcd = true;
		 $scope.showTagMethod = function() {
			 if($scope.priceLabelItem.pricingObject == "FIT"){
					$scope.queryParam ={};
					$scope.queryParam.feeItemNo=$scope.priceLabelItem.pricingObjectCode;
					jfRest.request('feeProject', 'query', $scope.queryParam).then(function(data) {
						if( data.returnData.rows!=null){
							assessmentMethod = data.returnData.rows[0].assessmentMethod;
							if(assessmentMethod == "M"){
								$rootScope.isA = false;
								$rootScope.isB = true;
								$rootScope.isPcd = false;
							}else{
								$rootScope.isA = true;
								$rootScope.isB = false;
								$rootScope.isPcd = false;
							}
						}
					});
				}else{
					$rootScope.isPcd = true;
					$rootScope.isA = false;
					$rootScope.isB = false;
				}
		 };
		 $scope.showTagMethod();
		form.on('select(getFeeMethod)',function(event){
			$scope.showTagMethod();
		});
		form.on('select(getpricingmethod)',function(event){
			if(event.value == "O" || event.value == "C" || event.value == "A"){
				$scope.pcdTypeU = 'D';
			}else{
				$scope.pcdTypeU = 'P';
			}
		});
	});
	//复制
	webApp.controller('copyPriceLabelCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.checkLblObjList = $scope.item;
		var form = layui.form;
		$scope.priceCopy = $scope.priceCopyInfo;
	    $scope.pricingTag1 = 'ITAG';
	    $scope.pricingTag2 = $scope.priceCopy.pricingTag.substring('4','9');
	    //定价类型
		$scope.tagTypeArray = {
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
				$scope.pricingObject=$scope.priceCopyInfo.pricingObject;
			}
		};
	   //定价区域
		$scope.pricingTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingType=$scope.priceCopyInfo.pricingType;
			}
		};
		//定价方式 
		$scope.pricingMethodArray = {
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
				$scope.pricingMethod=$scope.priceCopyInfo.pricingMethod;
			}
		};
	    //取值类型
		$scope.pcdTypeArray = {
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
				$scope.pcdType=$scope.priceCopyInfo.pcdType;
			}
		};
	    //运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationModeView = $scope.priceCopy.operationMode;
	        }
	    };
	 	//币种查询
	 	$scope.copyCurrencyArray ={ 
 			type:"dynamicDesc", 
			param:{},//默认查询条件 
			text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
			desc:"currencyDesc",
			value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			resource:"currency.query",//数据源调用的action 
			callback: function(data){
				$scope.pricingCurrencyCode = $scope.priceCopy.pricingCurrencyCode;
	        }
	 	};
	    $scope.showTagType = function() {
	    	if($scope.priceCopy.pricingObject == "PCD"){
				$scope.showBaseFee = false;
				$scope.priceObj ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
					desc:"pcdDesc",
					value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称  
					resource:"pcd.query",//数据源调用的action 
					callback: function(data){
						$scope.pricingObjectShow = $scope.priceCopy.pricingObjectCode;
			        }
				};
			}else if($scope.priceCopy.pricingObject == "FIT"){
				$scope.showBaseFee = true;
				$scope.priceObj ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"feeItemNo", //下拉框显示内容，根据需要修改字段名称 
					desc:'feeDesc',
					value:"feeItemNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"feeProject.query",//数据源调用的action 
					callback: function(data){
						$scope.pricingObjectShow = $scope.priceCopy.pricingObjectCode;
			        }
				};
			}
	    };
	    $scope.showTagType();
		form.on('select(gettagtype)',function(event){
			 $scope.showTagType();
		});
		var assessmentMethod="";
		//定价方式B
       $scope.pricingMethodArrayB={
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   				groupsCode : "dic_priceModelArrayB",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   				$scope.pricingMethod= $scope.priceCopyInfo.pricingMethod;	
   			}
   		};
		//定价方式C
		$scope.pricingMethodArrayC={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceModelArrayC",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingMethod= $scope.priceCopyInfo.pricingMethod;
			}
		};
		$rootScope.isAC = false;
		$rootScope.isBC = false;
		$rootScope.isPcdC = true;
		 $scope.showTagMethod = function() {
			 if($scope.priceCopy.pricingObject == "FIT"){
					$scope.queryParam ={};
					$scope.queryParam.feeItemNo=$scope.priceCopy.pricingObjectCode;
					jfRest.request('feeProject', 'query', $scope.queryParam).then(function(data) {
						if( data.returnData.rows!=null){
							assessmentMethod = data.returnData.rows[0].assessmentMethod;
							if(assessmentMethod == "M"){
								$rootScope.isAC = false;
								$rootScope.isBC = true;
								$rootScope.isPcdC = false;
							}else{
								$rootScope.isAC = true;
								$rootScope.isBC = false;
								$rootScope.isPcdC = false;
							}
						}
					});
				}else{
					$rootScope.isPcdC = true;
					$rootScope.isAC = false;
					$rootScope.isBC = false;
				}
		 };
		 $scope.showTagMethod();
		form.on('select(getFeeMethod)',function(event){
			$scope.showTagMethod();
		});
		form.on('select(getpricingmethod)',function(event){
			if(event.value == "O" || event.value == "C" || event.value == "A"){
				$scope.pcdType = 'D';
			}else{
				$scope.pcdType = 'P';
			}
		});
	});
	webApp.controller('viewPriceLabelCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//定价方式 
		$scope.pricingMethodArray = {
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
				$scope.pricingMethod=$scope.priceLabelItem.pricingMethod;
			}
		};
		//取值类型
		$scope.pcdTypeArray = {
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
				$scope.pcdType=$scope.priceLabelItem.pcdType;
			}
		};
		$scope.checkLblObjList = $scope.item;
		$scope.priceObj ={};
		//定价方式
		$scope.pricingMethodArray = {
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
				$scope.pricingMethod=$scope.priceLabelItem.pricingMethod;
			}
		};
		//定价类型
		$scope.tagTypeArray = {
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
				$scope.pricingObject=$scope.priceLabelItem.pricingObject;
			}
		};	
		//定价区域
		$scope.pricingTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.pricingType=$scope.priceLabelItem.pricingType;
			}
		};
		//运营模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.priceLabelItem.operationModeView = $scope.priceLabelItem.operationMode;
	        }
	    };
		//币种查询
	 	$scope.viewCurrencyArray ={ 
 			type:"dynamicDesc", 
			param:{},//默认查询条件 
			text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
			desc:"currencyDesc",
			value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			resource:"currency.query",//数据源调用的action 
			callback: function(data){
	        }
	 	};
		//附卡基准年费默认隐藏
		 var assessmentMethod="";
		$scope.showBaseFee = false;
		 $scope.showTagMethod = function() {
			 if($scope.priceLabelItem.pricingObject == "FIT"){
					$scope.queryParam ={};
					$scope.queryParam.feeItemNo=$scope.priceLabelItem.pricingObjectCode;
					jfRest.request('feeProject', 'query', $scope.queryParam).then(function(data) {
						if( data.returnData.rows!=null){
							assessmentMethod = data.returnData.rows[0].assessmentMethod;
							if(assessmentMethod == "M"){
								/*$rootScope.isA = false;
								$rootScope.isB = true;
								$rootScope.isPcd = false;*/
							}else{
								/*$rootScope.isA = true;
								$rootScope.isB = false;
								$rootScope.isPcd = false;*/
							}
						}
					});
				}else{
					/*$rootScope.isPcd = true;
					$rootScope.isA = false;
					$rootScope.isB = false;*/
				}
		 };
		 $scope.showTagMethod();
		 $scope.showTagType = function() {
		    	if($scope.priceLabelItem.pricingObject == "PCD"){
					$scope.showBaseFee = false;
					$scope.priceObj ={ 
						type:"dynamicDesc", 
						param:{},//默认查询条件 
						text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
						desc:"pcdDesc",
						value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称
						resource:"pcd.query",//数据源调用的action 
						callback: function(data){
							$scope.priceLabelItem.pricingObjectShow = $scope.priceLabelItem.pricingObjectCode;
				        }
					};
				}else if($scope.priceLabelItem.pricingObject == "FIT"){
					$scope.showBaseFee = true;
					$scope.priceObj ={ 
						type:"dynamicDesc", 
						param:{},//默认查询条件 
						text:"feeItemNo", //下拉框显示内容，根据需要修改字段名称 
						desc:'feeDesc',
						value:"feeItemNo",  //下拉框对应文本的值，根据需要修改字段名称 
						resource:"feeProject.query",//数据源调用的action  
						callback: function(data){
							$scope.priceLabelItem.pricingObjectShow = $scope.priceLabelItem.pricingObjectCode;
				        }
					};
				}
		    };
		    $scope.showTagType();
	});
	//定价标签新增
	webApp.controller('priceLabelEstCtrl', function($scope, $stateParams, jfRest,$timeout,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.priceLabelInf = {}; 
		$scope.priceLabelInf.pricingTag1 = 'ITAG';
		//附卡基准年费默认隐藏
		$scope.showBaseFee = false;
		//定价区域
		$scope.pricingTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceArea",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//定价方式
		$scope.pricingMethodArray = {
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
			}
		};
		//定价类型
		$scope.tagTypeArray = {
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
			}
		};	   
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//币种查询
		$scope.addCurrencyArray ={ 
 			type:"dynamicDesc", 
			param:{},//默认查询条件 
			text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
			desc:"currencyDesc",
			value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			resource:"currency.query",//数据源调用的action 
			callback: function(data){
	        }
	 	};
	 	var form = layui.form;
	    $scope.priceObj ={};
		form.on('select(gettagtype)',function(event){
			if($scope.priceLabelInf.pricingObject == "PCD"){
				$scope.showBaseFee = false;
				$scope.priceObj ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
					desc:"pcdDesc",
					value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"pcd.query",//数据源调用的action 
					callback: function(data){
			        }
				};
			}else if($scope.priceLabelInf.pricingObject == "FIT"){
				$scope.showBaseFee = true;
				$scope.priceObj ={ 
					type:"dynamicDesc", 
					param:{},//默认查询条件 
					text:"feeItemNo", //下拉框显示内容，根据需要修改字段名称 
					desc:"feeDesc",
					value:"feeItemNo",  //下拉框对应文本的值，根据需要修改字段名称 
					resource:"feeProject.query",//数据源调用的action 
					callback: function(data){
			        }
				};
			}
		});
		var assessmentMethod="";
		//定价方式B
       $scope.pricingMethodArrayB={
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   				groupsCode : "dic_priceModelArrayB",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   			}
   		};
		//定价方式C
		$scope.pricingMethodArrayC={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_priceModelArrayC",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		$rootScope.isAA = false;
		$rootScope.isBA = false;
		$rootScope.isPcdA = true;
		form.on('select(getFeeMethod)',function(event){
			if($scope.priceLabelInf.pricingObject == "FIT"){
				$scope.queryParam ={};
				$scope.queryParam.feeItemNo=$scope.priceLabelInf.pricingObjectCode;
				jfRest.request('feeProject', 'query', $scope.queryParam).then(function(data) {
					if( data.returnData.rows!=null){
						assessmentMethod = data.returnData.rows[0].assessmentMethod;
						if(assessmentMethod == "M"){
							$rootScope.isAA = false;
							$rootScope.isBA = true;
							$rootScope.isPcdA = false;
						}else{
							$rootScope.isAA = true;
							$rootScope.isBA = false;
							$rootScope.isPcdA = false;
						}
					}
				});
			}else{
				$rootScope.isPcdA = true;
				$rootScope.isAA = false;
				$rootScope.isBA = false;
			}
		});
		//取值类型
		$scope.pcdTypeArrayAll = {
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
			}
		};
		form.on('select(getpricingmethod)',function(event){
			if(event.value == "O" || event.value == "C" || event.value == "A"){
				$scope.priceLabelInf.pcdType = 'D';
			}else{
				$scope.priceLabelInf.pcdType = 'P';
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
		});
	});
	webApp.controller('viewPricePriorityCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
		$translate.refresh();
		$scope.priceLableListTable = {
//				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'priceLabel.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
});
