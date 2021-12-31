'use strict';
define(function(require) {
	var webApp = require('app');
	//客户业务类型标签设置
	webApp.controller('cstBsTypeLbSetCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		//自定义下拉156人民币840美元
		//'全部''本金''利息''费用'
		$scope.balanceTypeArray = [{name : T.T('KHJ5300001') ,id : 'A'},{name : T.T('KHJ5300002') ,id : 'P'},{name : T.T('KHJ5300003') ,id : 'I'},{name : T.T('KHJ5300004') ,id : 'F'}];//余额类型
		//'人民币' '美元'
		$scope.currencyTypeArray = [{name : T.T('KHJ5300005'),id : 'CNY'},{name : T.T('KHJ5300006') ,id : 'USD'}];//币种
		//'D-差异化''P-个性化' 'A-活动' 
		$scope.priceAreaArray = [{name :	T.T('KHJ5300007')  ,id : 'D'},{name : T.T('KHJ5300008'),id : 'P'},{name : T.T('KHJ5300009'),id : 'A'}] ;
		//'I-继承''O-覆盖'
		$scope.priceModelArray = [{name : T.T('KHJ5300010') ,id : 'I'},{name : T.T('KHJ5300011') ,id : 'O'}] ;
		//'D-数值' 'P-百分比'
		$scope.valTypArray = [{name : T.T('KHJ5300012'),id : 'D'},{name : T.T('KHJ5300013') ,id : 'P'}] ;
		//定价类型
		$scope.pricingTypeArray = [{
			id : 'PCD',
			name: 'PCD'
		},{
			id : 'FIT',
			name: 'FIT'
		}];
		$scope.isShowCstBsDiv = false;//
		//搜索身份证类型	
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
			{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
			{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
			{name : T.T('F00116') ,id : '4'} ,//中国护照
			{name : T.T('F00117') ,id : '5'} ,//外国护照
			{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
		];	
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.cstBsTypeLbSetTable.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#cstBsTypeLbSet_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstBsTypeLbSet_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstBsTypeLbSet_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#cstBsTypeLbSet_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#cstBsTypeLbSet_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#cstBsTypeLbSet_idNumber").attr("validator","id_isPermanentReside")
            }
        });
//		$scope.changeOption = function() {
//			console.log(dd);
//		} ;
		form.on('select(pricingLev)',function(ev){
			$scope.params  ={};
			$scope.params.idType = $scope.cstBsTypeLbSetTable.params.idType;
			$scope.params.idNumber = $scope.cstBsTypeLbSetTable.params.idNumber;
			$scope.params.externalIdentificationNo = $scope.cstBsTypeLbSetTable.params.externalIdentificationNo;
		//$scope.changeOption = function(data) {
			$scope.labelScopeArr ={};
			if(ev.value == "C"){
				$scope.labelScopeArr ={ 
				        type:"dynamicDesc", 
				        param:$scope.params ,//默认查询条件 
				        text:"customerNo", //下拉框显示内容，根据需要修改字段名称 
				        desc:"customerName",
				        value:"customerNo",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"cstInfQuery.queryCstList",//数据源调用的action 
				        callback: function(data){
				        	if(data){
				        	}else {
				        		var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
				        			jfLayer.fail(returnMsg);
				        	}
				        }
				};
			}else if(ev.value == "G"){
				$scope.labelScopeArr ={ 
				        type:"dynamicDesc", 
				        param:$scope.params ,//默认查询条件 
				        text:"businessProgramNo", //下拉框显示内容，根据需要修改字段名称 
				        desc:"programDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"cstBsnisItem.query",//数据源调用的action 
				        callback: function(data){
				        	if(data){
				        	}else {
				        		var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
				        			jfLayer.fail(returnMsg);
				        	}
				        }
				};
			}else if(ev.value == "P"){
				$scope.labelScopeArr ={ 
				        type:"dynamicDesc", 
				        param:$scope.params ,//默认查询条件 
				        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
				        desc:"productDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"cstProduct.queryProMaj",//数据源调用的action 
				        callback: function(data){
				        	if(data){
				        	}else {
				        		var returnMsg = data.returnMsg ? data.returnMsg :T.T('F00035');
				        			jfLayer.fail(returnMsg);
				        	}
				        }
				};
			}else if(ev.value == "T"){
				$scope.busArray=[]; 
				$scope.operationMode ="";
				$scope.labelScopeArr ={ 
				        type:"dynamic", 
				        param:$scope.params ,//默认查询条件 
				        text:"programDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"businessProgramNo",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"cstBsnisItem.query",//数据源调用的action 
				        callback: function(data){
				        	if(data && data.length!=0){
			        			for(var i=0;i<data.length;i++){
			        				$scope.operationMode = data[i].operationMode;
			        				$scope.busArray.push(data[i].businessProgramNo);
			        			}
			        			$scope.labelScopeArr ={ 
			    				        type:"dynamicDesc", 
			    				        param:{"operationMode":$scope.operationMode,"busList":$scope.busArray} ,//默认查询条件 
			    				        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
			    				        desc:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
			    				        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
			    				        resource:"productLineBusType.query",//数据源调用的action 
			    				        callback: function(data){
			    				        	if(data){
			    				        	}else {
			    				        		var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
			    				        			jfLayer.fail(returnMsg);
			    				        	}
			    				        }
			    				};
				        	}
				        }
				};
				//$scope.labelScopeArr = {};
			}else if(ev.value == "M"){
				$scope.params.flag="3";
				$scope.labelScopeArr ={ 
				        type:"dynamic", 
				        param:$scope.params ,//默认查询条件 
				        text:"externalIdentificationNo", //下拉框显示内容，根据需要修改字段名称 
				        value:"mediaUnitCode",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"cstMediaList.queryMediaMaj",//数据源调用的action 
				        callback: function(data){
				        	if(data){
				        	}else {
				        		var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
				        			jfLayer.fail(returnMsg);
				        	}
				        }
				};
			}
		});
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#lay_custTagEffectiveDate',
					//min:"2019-03-01",
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
						$scope.csInf.custTagEffectiveDate = $("#lay_custTagEffectiveDate").val();
					}
				});
				var endDate = laydate.render({
					elem: '#lay_custTagExpirationDate',
					//min:Date.now(),
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						$scope.csInf.custTagExpirationDate = $("#lay_custTagExpirationDate").val();
					}
				});
		});
		//点击查询客户信息
		$scope.searchCstBsTypeLb = function() {
			$scope.paramss = {
					"idType" : $scope.cstBsTypeLbSetTable.params.idType,
					"idNumber" : $scope.cstBsTypeLbSetTable.params.idNumber,
					"externalIdentificationNo" : $scope.cstBsTypeLbSetTable.params.externalIdentificationNo
				};
			if(($scope.cstBsTypeLbSetTable.params.idType==""  || $scope.cstBsTypeLbSetTable.params.idType==null || $scope.cstBsTypeLbSetTable.params.idType== undefined )&& 
					($scope.cstBsTypeLbSetTable.params.customerNo==""  || $scope.cstBsTypeLbSetTable.params.customerNo==null || $scope.cstBsTypeLbSetTable.params.customerNo== undefined )&& 
					($scope.cstBsTypeLbSetTable.params.idNumber==""  || $scope.cstBsTypeLbSetTable.params.idNumber==null || $scope.cstBsTypeLbSetTable.params.idNumber== undefined )&& 
					( $scope.cstBsTypeLbSetTable.params.externalIdentificationNo=="" || $scope.cstBsTypeLbSetTable.params.externalIdentificationNo==null ||  $scope.cstBsTypeLbSetTable.params.externalIdentificationNo== undefined ) ){
				jfLayer.fail(T.T('F00076'));//"请输入任意查询条件"
			}
			else {
				if($scope.cstBsTypeLbSetTable.params.idType){
					if($scope.cstBsTypeLbSetTable.params.idNumber==""  || $scope.cstBsTypeLbSetTable.params.idNumber==null || $scope.cstBsTypeLbSetTable.params.idNumber== undefined){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstBsDiv = false;
					}else {
						$scope.queryCstInf($scope.paramss);
					}
				}else if($scope.cstBsTypeLbSetTable.params.idNumber){
					if($scope.cstBsTypeLbSetTable.params.idType==""  || $scope.cstBsTypeLbSetTable.params.idType==null || $scope.cstBsTypeLbSetTable.params.idType== undefined){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstBsDiv = false;
					}else {
						$scope.queryCstInf($scope.paramss);
					}
				}else {
					$scope.queryCstInf($scope.paramss);
				}
			}
		} ;
		//查询客户信息，客户号，查询定价对象信息
		$scope.queryCstInf = function(params){
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.customerName  = data.returnData.rows[0].customerName;
						$scope.customerNo  = data.returnData.rows[0].customerNo;
						$scope.isShowCstBsDiv = true;
						$scope.cstBsTypeLbSetTable.params = Object.assign($scope.cstBsTypeLbSetTable.params,params);
						$scope.cstBsTypeLbSetTable.search();
						$scope.labelScopeArr ={};
					}
				}else{
					$scope.isShowCstBsDiv = false;
				}
			});
	};
	 //业务项目
	$scope.labelScopeArr ={};
		//重置方法
		$scope.resetCustmer = function(){
			$scope.cstBsTypeLbSetTable.params.idNumber = '';
			$scope.cstBsTypeLbSetTable.params.externalIdentificationNo = '';
			$scope.cstBsTypeLbSetTable.params.idType= '';
			$scope.cstBsTypeLbSetTable.params.customerNo= '';
			$scope.isShowCstBsDiv = false;
			$('#cstBsTypeLbSet_idNumber').attr('validator','noValidator');
			$('#cstBsTypeLbSet_idNumber').removeClass('waringform');
		};
		//重置方法
		$scope.resetPrice = function(){
			$scope.cstBsTypeLbSetTable.params.pricingObjectCode = '';
			$scope.cstBsTypeLbSetTable.params.pricingObject = '';
		};
		// 客户业务标签类型表
		$scope.cstBsTypeLbSetTable = {
			//checkType : 'radio',
			autoQuery: false,
			params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					"pcdNo" : "8%,9%"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstBsTypeLblSet.queryPrcDetail',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
		};
		$scope.checkPrcObjDetail = function(event) {
			$scope.blockCDScnMgtInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstPrcgLblEnqr/checkPrcLblObjDtlInf.html', $scope.blockCDScnMgtInfo, {
				title : T.T('KHJ5300016'),//'定价标签详细信息'
				buttons : [ T.T('F00012')],//'关闭' 
				size : [ '1050px', '400px' ],
				callbacks : [ ]
			});
		};
		$scope.csInf ={};
		//定价层级C/G/P/T/M
		//选择
		$scope.priceList = [];
		$scope.priceArr = $scope.builder.option($scope.priceList) ;
		$scope.choseCstInf = function(event){
			$scope.itemInfo = $.parseJSON(JSON.stringify(event));
			$scope.csInf.pricingTag = $scope.itemInfo.pricingTag;
			$scope.csInf.pricingDesc = $scope.itemInfo.pricingDesc;
			$scope.csInf.pricingObjectCode = $scope.itemInfo.pricingObjectCode; 
			$scope.csInf.pricingObjectCodeTrans = $scope.itemInfo.pricingObjectCode +'-'+ $scope.itemInfo.pricingObjectDesc; 
			$scope.csInf.pricingObject = $scope.itemInfo.pricingObject;
			$scope.csInf.pricingType = $scope.itemInfo.pricingType;
			$scope.priceList = [{name :T.T('KHH5300024'),id : 'C'}];
			$scope.priceArr = $scope.builder.option($scope.priceList) ;
			if($scope.itemInfo.instanDimen1=='MODG'||
					$scope.itemInfo.instanDimen2=='MODG'||
					$scope.itemInfo.instanDimen3=='MODG'||
					$scope.itemInfo.instanDimen4=='MODG'||
					$scope.itemInfo.instanDimen5=='MODG'
				){
				$scope.priceList.push({name :T.T('KHH5300025'),id : 'G'});
				$scope.priceArr = $scope.builder.option($scope.priceList) ;
			}
			if($scope.itemInfo.instanDimen1=='MODT'||
					$scope.itemInfo.instanDimen2=='MODT'||
					$scope.itemInfo.instanDimen3=='MODT'||
					$scope.itemInfo.instanDimen4=='MODT'||
					$scope.itemInfo.instanDimen5=='MODT'
				){
				$scope.priceList.push({name :T.T('KHH5300026'),id : 'T'});
				$scope.priceList.push({name :T.T('KHH5300025'),id : 'G'});
				$scope.priceArr = $scope.builder.option($scope.priceList) ;
			}
			if($scope.itemInfo.instanDimen1=='MODP'||
					$scope.itemInfo.instanDimen2=='MODP'||
					$scope.itemInfo.instanDimen3=='MODP'||
					$scope.itemInfo.instanDimen4=='MODP'||
					$scope.itemInfo.instanDimen5=='MODP'
				){
				$scope.priceList.push({name :T.T('KHH5300027'),id : 'P'});
				$scope.priceArr = $scope.builder.option($scope.priceList) ;
			}
			if($scope.itemInfo.instanDimen1=='MODM'||
					$scope.itemInfo.instanDimen2=='MODM'||
					$scope.itemInfo.instanDimen3=='MODM'||
					$scope.itemInfo.instanDimen4=='MODM'||
					$scope.itemInfo.instanDimen5=='MODM'
				){
				$scope.priceList.push({name :T.T('KHH5300028'),id : 'M'});
				$scope.priceArr = $scope.builder.option($scope.priceList) ;
			}
		};
		// 保存按钮事件coreCustomerBusinessTypes
		$scope.saveCstInf = function() {
				$scope.csInf.customerNo = $scope.customerNo;
				$scope.safeApply();
				if(!$scope.csInf.businessProgramNo  || $scope.csInf.businessProgramNo == undefined){
					$scope.csInf.businessProgramNo = '';
                }
            $scope.csInf = $.extend($scope.csInf , $scope.cstBsTypeLbSetTable.params);
				jfRest.request('cstBsTypeLblSet', 'savePrcDetail', $scope.csInf)
						.then(function(data) {
							if (data.returnCode == '000000') {
								jfLayer.success(T.T('F00032'));//"保存成功"
								$scope.csInf = {};
								$scope.isShowCstBsDiv = false;
								$scope.credentialNumber = "";
								$scope.phoneNumber = "";
								$scope.customerNo = "";
								$scope.customerName = "";
							}
				});
		};
	});
});
