'use strict';
define(function(require) {
	var webApp = require('app');
	//客户定价标签查询
	webApp.controller('cstPrcgLblEnqrCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	//动态请求下拉框 证件类型
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
	        	//console.log(data)
	        }
		};
    	//定价区域
    	$scope.priceAreaArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_priceArea",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
    	};
    	//定价类型
    	$scope.pricingTypeArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_pricingType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
    	};
    	//取值类型
    	$scope.valTypArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_valueType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
    	};
    	//定价方式
    	$scope.priceModelArray={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_priceModel",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
    	};
    	//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.cstPrcgLblEnqrTable.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#cstPrcgLblEnqr_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstPrcgLblEnqr_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstPrcgLblEnqr_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#cstPrcgLblEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#cstPrcgLblEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#cstPrcgLblEnqr_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		//日期控件
		layui.use('laydate', function(){
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#dateEntryEffective',
				//max:Date.now(),
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
					$scope.cstPrcgLblEnqrTable.params.custTagEffectiveDate = $("#dateEntryEffective").val();
				}
			});
			var endDate = laydate.render({
				elem: '#dateEntryFailure',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.cstPrcgLblEnqrTable.params.custTagExpirationDate = $("#dateEntryFailure").val();
				}
			});
		});
		//日期控件end
		//'D-差异化' 'P-个性化' 'A-活动' 
		/*$scope.priceAreaArray = [{name : T.T('KHJ5400001'),id : 'D'},{name : T.T('KHJ5400002'),id : 'P'},{name : T.T('KHJ5400003'),id : 'A'}] ;
		$scope.currencyTypeArray = [{name : T.T('KHJ5400004') ,id : 'CNY'},{name : T.T('KHJ5400005'),id : 'USD'}];//币种 '人民币' '美元' 
*/		
		$scope.isShow = false;
		$scope.queryCstPrcgLblEnqr = function(){
			if( ($scope.cstPrcgLblEnqrTable.params.idType==null || $scope.cstPrcgLblEnqrTable.params.idType== "" || $scope.cstPrcgLblEnqrTable.params.idType==undefined ) && 
					($scope.cstPrcgLblEnqrTable.params.customerNo==null || $scope.cstPrcgLblEnqrTable.params.customerNo== "" || $scope.cstPrcgLblEnqrTable.params.customerNo==undefined ) && 
					($scope.cstPrcgLblEnqrTable.params.idNumber==null || $scope.cstPrcgLblEnqrTable.params.idNumber== "" || $scope.cstPrcgLblEnqrTable.params.idNumber==undefined ) && 
					($scope.cstPrcgLblEnqrTable.params.externalIdentificationNo==null || $scope.cstPrcgLblEnqrTable.params.externalIdentificationNo== "" || $scope.cstPrcgLblEnqrTable.params.externalIdentificationNo==undefined )){
				jfLayer.fail(T.T('F00076'));//"请输入任意查询条件"
				$scope.isShow = false;
			}
			else {
				if($scope.cstPrcgLblEnqrTable.params.idType){
					if($scope.cstPrcgLblEnqrTable.params.idNumber==null || $scope.cstPrcgLblEnqrTable.params.idNumber== "" || $scope.cstPrcgLblEnqrTable.params.idNumber==undefined ){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.cstPrcgLblEnqrTable.search();
					}
				}else if($scope.cstPrcgLblEnqrTable.params.idNumber){
					if($scope.cstPrcgLblEnqrTable.params.idType==null || $scope.cstPrcgLblEnqrTable.params.idType== "" || $scope.cstPrcgLblEnqrTable.params.idType==undefined){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.cstPrcgLblEnqrTable.search();
					}
				}else {
					$scope.cstPrcgLblEnqrTable.search();
				}
			}
		};
		//重置
		$scope.reset = function(){
			$scope.cstPrcgLblEnqrTable.params.idNumber = '';
			$scope.cstPrcgLblEnqrTable.params.externalIdentificationNo = '';
			$scope.cstPrcgLblEnqrTable.params.idType= '';
			$scope.cstPrcgLblEnqrTable.params.customerNo= '';
			$scope.isShow = false;
			$('#cstPrcgLblEnqr_idNumber').attr('validator','noValidator');
			$('#cstPrcgLblEnqr_idNumber').removeClass('waringform');
		};
		// 客户定价标签查询
		$scope.cstPrcgLblEnqrTable = {
			params : {
					"flag":"3",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息ISS.IQ.01.0008   X5205
			paging : true,// 默认true,是否分页
			resource : 'cstPrcgLblEnqr.query',// 列表的资源
			autoQuery:false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_pricingLevel'],//查找数据字典所需参数
			transDict : ['pricingLevel_pricingLevelDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				//console.log(data);
				if(data.returnCode == "000000"){
					$scope.isShow = true;
				}
				else{
					$scope.isShow = false;
				}
			}
		};
		$scope.checkCstPrcgLblEnqr = function(event) {
			$scope.blockCDScnMgtInfo =$.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstPrcgLblEnqr/checkCstPrcgLblEnqr.html', $scope.blockCDScnMgtInfo, {
				title : T.T('KHJ5400010'),//'客户定价标签信息'
				buttons : [T.T('F00107'),T.T('F00012') ],//'确认','关闭' 
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.selectCorporat ]
			});
		};
		//查看详细信息
		$scope.viewCstPrcgLblEnqr = function(event) {
			$scope.blockCDScnMgtInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstPrcgLblEnqr/viewCstPrcgLblEnqr.html', $scope.blockCDScnMgtInfo, {
				title :T.T('KHJ5400010'),// '客户定价标签信息'
				buttons : [ T.T('F00012')],//'关闭' 
				size : [ '1050px', '550px' ],
				callbacks : [ $scope.selectCorporat2 ]
			});
		};
		$scope.selectCorporat2 = function(result) {
			$scope.safeApply();
			result.cancel();
		};
		//'全部' '本金' '利息' '费用'
		$scope.balanceTypeArray = [{name : T.T('KHJ5400011'),id : 'A'},{name : T.T('KHJ5400012'),id : 'P'},{name : T.T('KHJ5400013'),id : 'I'},{name : T.T('KHJ5400014') ,id : 'F'}];//余额类型
		//'人民币' '美元' 
		$scope.currencyList = [{name : T.T('KHJ5400004'),id : '1'},{name :T.T('KHJ5400005') ,id : '2'}] ;
		// 回调函数/确认按钮事件
		$scope.selectCorporat = function(result) {
			$scope.paramss = result.scope.blockCDScnMgtInfo;
			$scope.paramss = $.extend($scope.paramss , $scope.cstPrcgLblEnqrTable.params);
			jfRest.request('cstPrcgLblEnqr', 'updatePrcDetail', $scope.paramss)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));//"修改成功"
					$scope.safeApply();
					result.cancel();
					$scope.cstPrcgLblEnqrTable.search();
				}
			});
		};
		// 删除BSS.UP.01.0031
		$scope.deleteCstPrcgLblEnqrs = function(event) {
			$scope.deleteCstPrcgLblEnqr = {};
			$scope.deleteCstPrcgLblEnqr = $.parseJSON(JSON.stringify(event));
			$scope.deleteCstPrcgLblEnqr.idType = $scope.cstPrcgLblEnqrTable.params.idType;
			$scope.deleteCstPrcgLblEnqr.idNumber = $scope.cstPrcgLblEnqrTable.params.idNumber;
			$scope.deleteCstPrcgLblEnqr.externalIdentificationNo = $scope.cstPrcgLblEnqrTable.params.externalIdentificationNo;
			jfLayer.confirm(T.T('YYJ1300034'),function() {
				jfRest.request('cstPrcgLblEnqr', 'deleteDetail', $scope.deleteCstPrcgLblEnqr).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.items = {};
						$scope.cstPrcgLblEnqrTable.search();
					}
				});
			})
		};
		/*---新增客户定价标签设置---*/
		//新增btn验证
		$scope.addLabelInfo = function(){
			$scope.paramss = {
					"idType" : $scope.cstPrcgLblEnqrTable.params.idType,
					"idNumber" : $scope.cstPrcgLblEnqrTable.params.idNumber,
					"externalIdentificationNo" : $scope.cstPrcgLblEnqrTable.params.externalIdentificationNo
				};
			if( ($scope.cstPrcgLblEnqrTable.params.idType==null || $scope.cstPrcgLblEnqrTable.params.idType== "" || $scope.cstPrcgLblEnqrTable.params.idType==undefined ) && 
					($scope.cstPrcgLblEnqrTable.params.customerNo==null || $scope.cstPrcgLblEnqrTable.params.customerNo== "" || $scope.cstPrcgLblEnqrTable.params.customerNo==undefined ) && 
					($scope.cstPrcgLblEnqrTable.params.idNumber==null || $scope.cstPrcgLblEnqrTable.params.idNumber== "" || $scope.cstPrcgLblEnqrTable.params.idNumber==undefined ) && 
					($scope.cstPrcgLblEnqrTable.params.externalIdentificationNo==null || $scope.cstPrcgLblEnqrTable.params.externalIdentificationNo== "" || $scope.cstPrcgLblEnqrTable.params.externalIdentificationNo==undefined )){
				jfLayer.fail(T.T('F00076'));//"请输入任意查询条件"
			}else {
				if($scope.cstPrcgLblEnqrTable.params.idType){
					if($scope.cstPrcgLblEnqrTable.params.idNumber==null || $scope.cstPrcgLblEnqrTable.params.idNumber== "" || $scope.cstPrcgLblEnqrTable.params.idNumber==undefined ){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.queryCstInf($scope.paramss);
					}
				}else if($scope.cstPrcgLblEnqrTable.params.idNumber){
					if($scope.cstPrcgLblEnqrTable.params.idType==null || $scope.cstPrcgLblEnqrTable.params.idType== "" || $scope.cstPrcgLblEnqrTable.params.idType==undefined){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.queryCstInf($scope.paramss);
					}
				}else {
					$scope.queryCstInf($scope.paramss);
				}
			}
		};
		//查询客户信息，客户号，查询定价对象信息
		$scope.queryCstInf = function(params){
			//console.log(params)
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.cstPrcgLblEnqrTable.params.customerName  = data.returnData.rows[0].customerName;
						$scope.cstPrcgLblEnqrTable.params.customerNo  = data.returnData.rows[0].customerNo;
						$scope.isShowCstBsDiv = true;
						$scope.cstPrcgLblEnqrTable.params = Object.assign($scope.cstPrcgLblEnqrTable.params,params);
						$scope.labelScopeArr ={};
						$scope.newBombBox($scope.cstPrcgLblEnqrTable.params);
					}
				}else{
					$scope.isShowCstBsDiv = false;
				}
			});
		};
		// 新增页面弹出框事件(弹出页面)
		$scope.newBombBox =function(items){
			$scope.items=items;
			$scope.modal('/cstSvc/cstPrcgLblEnqr/newLabelSet.html', $scope.items, {
				title : T.T('KHJ5400018'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '990px', '500px' ],
				callbacks : [$scope.saveCstInf]
			});	
		};
		// 客户业务标签类型表
		$scope.cstBsTypeLbSetTable = {
			//checkType : 'radio',
			autoQuery: true,
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
		//确定提交按钮事件
		$scope.saveCstInf = function(result) {
			//必须选择标签对象信息
			if(result.scope.csInf.pricingTag == '' || result.scope.csInf.pricingTag == undefined || result.scope.csInf.pricingTag == null){
				jfLayer.alert(T.T('KHJ5400019'));
				return;
            }
            //日期必输
			if((result.scope.custTagEffectiveDate == '' || result.scope.custTagEffectiveDate == undefined || result.scope.custTagEffectiveDate ==null) ||
			(result.scope.custTagExpirationDate == '' || result.scope.custTagExpirationDate == undefined || result.scope.custTagExpirationDate ==null) ){
				jfLayer.alert(T.T('KHJ5400020'));
				return;
            }
            $scope.newCsInf={};
			$scope.newCsInf=result.scope.csInf;
			$scope.newCsInf.customerNo = result.scope.csInf.customerNo;
			$scope.newCsInf.custTagEffectiveDate = result.scope.custTagEffectiveDate;
			$scope.newCsInf.custTagExpirationDate = result.scope.custTagExpirationDate;
			if(!$scope.newCsInf.businessProgramNo  || $scope.newCsInf.businessProgramNo == undefined){
				$scope.newCsInf.businessProgramNo = '';
            }
            $scope.newCsInf = $.extend($scope.newCsInf, $scope.cstBsTypeLbSetTable.params);
			jfRest.request('cstBsTypeLblSet', 'savePrcDetail', $scope.newCsInf)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));//"保存成功"
					$scope.cstPrcgLblEnqrTable.search($scope.paramss);//查询
					$scope.newCsInf	 = {};
					$scope.safeApply();
					result.cancel();
				}
			});
		};	
	});
	//新增定价标签控制器
	webApp.controller('newLabelSetCtrl', function($scope, $stateParams,$timeout,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.isShowCstBsDiv=true;
    	$scope.isParameter=$scope.items;
    	$scope.operationMode = lodinDataService.getObject('operationMode'),
    	//币种
    	$scope.currencyArr = { 
	        type:"dynamic", 
	        param: {
	        	operationMode : $scope.operationMode
	        },//默认查询条件 
	        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operatCurrency.query",//数据源调用的action 
	        callback: function(data){
	        }
		}; 
		//重置方法
		$scope.resetPrice = function(){
			$scope.cstBsTypeLbSetTable.params.pricingObjectCode = '';
			$scope.cstBsTypeLbSetTable.params.pricingObject = '';
		};
		//联动验证
		var form = layui.form;
		form.on('select(pricingLev)',function(data){
			$scope.params  ={};
			$scope.params.idType = $scope.isParameter.idType;
			$scope.params.idNumber =$scope.isParameter.idNumber;
			$scope.params.externalIdentificationNo =$scope.isParameter.externalIdentificationNo;
			//$scope.changeOption = function(data) {
			$scope.labelScopeArr ={};
			//当定价层级改变，清楚上次的层级代码
			$scope.csInf.pricingLevelCode = '';
			if(data.value == "C"){
				$scope.labelScopeArr ={ 
			        type:"dynamicDesc", 
			        param:$scope.params ,//默认查询条件 
			        text:"customerNo", //下拉框显示内容，根据需要修改字段名称 
			        desc:"customerName",
			        value:"customerNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"cstInfQuery.queryCstNo",//数据源调用的action 
			        callback: function(data){
			        	if(data){
		        		}else {
			        		var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
			        			jfLayer.fail(returnMsg);
			        	}
			        }
				};
			}else if(data.value == "G"){
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
			}else if(data.value == "P"){
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
			}else if(data.value == "T"){
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
			}else if(data.value == "M"){
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
		//查询系统下一处理日
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.custTagEffectiveDate = "";
					$scope.custTagExpirationDate = "";
					$scope.custTagEffectiveDate = data.returnData.rows[0].nextProcessDate;
					$scope.custTagExpirationDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
		//日期控件
		$timeout(function() {
			layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
				elem: '#lay_custTagEffectiveDate',
				min:$scope.custTagEffectiveDate,
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
					$scope.custTagEffectiveDate = $("#lay_custTagEffectiveDate").val();
					}
			  	});
				var endDate = laydate.render({
					elem: '#lay_custTagExpirationDate',
					min:$scope.custTagEffectiveDate,
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						$scope.custTagExpirationDate = $("#lay_custTagExpirationDate").val();
					}
				});
			});
		},300);
		//业务项目
		$scope.labelScopeArr ={};
		// 客户业务标签类型表
		$scope.cstBsTypeLbSetTable = {
			//checkType : 'radio',
			autoQuery: true,
			params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					"pcdNo" : "8%,9%"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstBsTypeLblSet.queryPrcDetail',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
			transDict : ['pricingType_pricingTypeDesc','pricingMethod_pricingMethodDesc'],//翻译前后key
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
			$scope.csInf.idType = $scope.isParameter.idType;
			$scope.csInf.idNumber =$scope.isParameter.idNumber;
			$scope.csInf.pageNum=$scope.itemInfo.pageNum;
			$scope.csInf.externalIdentificationNo =$scope.isParameter.externalIdentificationNo;
			$scope.csInf.customerNo =$scope.isParameter.customerNo;
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
				$scope.priceList.push({name :T.T('KHH5300025'),id : 'G'});
				$scope.priceList.push({name :T.T('KHH5300026'),id : 'T'});
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
	});
	//定价标签详细信息
	webApp.controller('checkPrcObjInfCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translate.refresh();
//		$scope.priceAreaArray = [{name : T.T('KHJ5300007') ,id : 'D'},{name : T.T('KHJ5300008') ,id : 'P'},{name : T.T('KHJ5300009') ,id : 'A'}] ;
		//'I-继承' 'O-覆盖' 'C-取优'
	/*	$scope.priceModelArray = [{name : T.T('KHJ5300010'),id : 'I'},{name : T.T('KHJ5300011') ,id : 'O'},{name : T.T('KHJ5300015') ,id : 'C'}] ;
		//'D-数值''P-百分比'
		$scope.valTypArray = [{name : T.T('KHJ5300012') ,id : 'D'},{name : T.T('KHJ5300013') ,id : 'P'}] ;*/
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
	webApp.controller('checkcstPrcgLblEnqrCtrl', function($scope, $stateParams,$timeout,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
		$scope.blockCDScnMgtInfo = $scope.blockCDScnMgtInfo;
		$scope.operationMode = lodinDataService.getObject('operationMode');
		//币种
    	$scope.currencyArr = { 
	        type:"dynamic", 
	        param:{
	        	operationMode : $scope.operationMode
	        } ,//默认查询条件 
	        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operatCurrency.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.uppricingScope = $scope.blockCDScnMgtInfo.pricingScope;
	        }
		}; 
    	$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.systemUnitNo = sessionStorage.getItem("systemUnitNo");  //系统单元;
			jfRest.request('systemUnit', 'query', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.sDate = "";
					$scope.sDate = data.returnData.rows[0].nextProcessDate;
				}
			});
		};
		$scope.queryDate();
		//日期控件
		$timeout(function() {
			layui.use('laydate', function(){
				  var laydate = layui.laydate;
				  var startDate = laydate.render({
						elem: '#check_dateEntryEffective',
						min:$scope.sDate,
						value: $scope.sDate,
						done: function(value, date) {
							endDate.config.min = {
								year: date.year,
								month: 6,
								date: date.date,
							};
							endDate.config.start = {
								year: date.year,
								month: 6,
								date: date.date,
							};
							$scope.blockCDScnMgtInfo.custTagEffectiveDate = $("#check_dateEntryEffective").val();
						}
					});
					var endDate = laydate.render({
						elem: '#check_dateEntryFailure',
						min:$scope.sDate,
						value:$scope.sDate,
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							$scope.blockCDScnMgtInfo.custTagExpirationDate = $("#check_dateEntryFailure").val();
						}
					});
			});
		},500);
	});
	webApp.controller('viewcstPrcgLblEnqrCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
		$scope.operationMode = lodinDataService.getObject('operationMode');
		//币种
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
		//定价区域
    	$scope.priceAreaArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_priceArea",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.pricingType=$scope.blockCDScnMgtInfo.pricingType;
	        }
    	};
    	//取值类型
    	$scope.valTypArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_valueType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.pcdType=$scope.blockCDScnMgtInfo.pcdType;
	        }
    	};
    	//定价方式
    	$scope.priceModelArray={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_priceModel",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.pricingMethod=$scope.blockCDScnMgtInfo.pricingMethod;
	        }
    	};
		/*//'D-差异化''P-个性化''A-活动'
		$scope.priceAreaArray = [{name : T.T('KHJ5400001') ,id : 'D'},{name : T.T('KHJ5400002') ,id : 'P'},{name : T.T('KHJ5400003') ,id : 'A'}] ;
		//'I-继承' 'O-覆盖' 'C-取优' 
		$scope.priceModelArray = [{name : T.T('KHJ5400006'),id : 'I'},{name : T.T('KHJ5400007'),id : 'O'},{name : T.T('KHJ5400008'),id : 'C'}] ;
		//'D-数值''P-百分比'
		$scope.valTypArray = [{name : T.T('KHJ5400008') ,id : 'D'},{name : T.T('KHJ5400009') ,id : 'P'}] ;*/
		$scope.blockCDScnMgtInfo = $scope.blockCDScnMgtInfo;
		$scope.viewCorporat = function() {
			$scope.paramss = {
					pricingTag :$scope.blockCDScnMgtInfo.pricingTag,
					operationMode :$scope.blockCDScnMgtInfo.operationMode,
					pricingObject  :$scope.blockCDScnMgtInfo.pricingObject,
					pricingObjectCode :$scope.blockCDScnMgtInfo.pricingObjectCode
			};
			jfRest.request('cstPrcgLblEnqr', 'queryPrcDetail', $scope.paramss)
				.then(function(data) {
					if(data.returnCode=="000000" && data.returnData!= null )
					$scope.checkLblObjList = data.returnData.rows[0];
				});
		};
		$scope.viewCorporat();
	});
});
