'use strict';
define(function(require) {

	var webApp = require('app');

	//产品升降级
	webApp.controller('proLiftingCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmCancel');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.menuNo = lodinDataService.getObject("menuNo");
    	console.log( lodinDataService.getObject("menuName"));
		
		$scope.isShowCstDiv = false;
    	
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
			        	
			        }
		};
 
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
	   	   		if($scope.eventList.search('ISS.OP.01.0006') != -1){    //查询
   					$scope.selBtnFlag = true;
   				}
   				else{
   					$scope.selBtnFlag = false;
   				}
		   	 	
				}
			});

    	//联动验证
 		var form = layui.form;
 		form.on('select(getIdType)',function(data){
 			
 			$scope.mediaCancelParams.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#mdmCancel_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#mdmCancel_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#mdmCancel_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#mdmCancel_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#mdmCancel_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#mdmCancel_idNumber").attr("validator","id_isPermanentReside")
            }
        });
    	
		$scope.mediaCancelParams ={
				idNumber :"",
				externalIdentificationNo :"",
				idType:''
		};
		
		$scope.customerInfo = {
				mainCustomerCode :"",
				customerName :"",
				credentialNumber:""
		};
		//重置
		$scope.reset  = function() {
			$scope.mediaCancelParams.idNumber = '';
			$scope.mediaCancelParams.externalIdentificationNo = '';
			$scope.mediaCancelParams.idType= '';
			$scope.mediaCancelParams.customerNo= '';
			
			$scope.isShowCstDiv = false;
			$('#mdmCancel_idNumber').attr('validator','noValidator');
			$('#mdmCancel_idNumber').removeClass('waringform');			
		};
		
		
		//查询客户信息
		$scope.queryCstInf  = function(transData) {
			
		};
		//客户媒介列表
		$scope.cstMdmInfTable = {
			autoQuery:false,
			checkType : 'radio',
			params : {
					"pageSize":10,
					"indexNo":0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstProduct.quereyProInf',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_productType','dic_proState'],//查找数据字典所需参数
			transDict : ['productType_productTypeDesc','statusCode_statusCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};

		//查询执行函数
	
		$scope.searchHandlee = function(params) {
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
						$scope.customerInfo.mainCustomerCode = data.returnData.rows[0].customerNo;
						$scope.customerInfo.idType = data.returnData.rows[0].idType;
						$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
						$scope.customerInfo.customerNo = data.returnData.rows[0].customerNo;
						
						$scope.cstMdmInfTable.params.idNumber = $scope.mdmActvtInfo.idNumber;
						$scope.cstMdmInfTable.params.idType = $scope.mdmActvtInfo.idType;
						$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.mdmActvtInfo.externalIdentificationNo;
						$scope.cstMdmInfTable.params.flag = "2";
						$scope.cstMdmInfTable.search();
						$scope.isShowCstDiv = true;
					}else {
						jfLayer.alert(T.T('KHJ400002'));//"抱歉，不存在此客户！"
						$scope.isShowCstDiv = false;
					}
				}else {
					$scope.isShowCstDiv = false;
					
				}
			});
			
			
		};
		
		
		//查询媒介
		$scope.queryMedia = function() {
			$scope.mdmActvtInfo = {
					idNumber :$scope.mediaCancelParams.idNumber,
					externalIdentificationNo :$scope.mediaCancelParams.externalIdentificationNo,
					idType:$scope.mediaCancelParams.idType,
					falg :"2"
			};
			
			if( ($scope.mediaCancelParams.idType == null || $scope.mediaCancelParams.idType == ''|| $scope.mediaCancelParams.idType == undefined) &&
					($scope.mediaCancelParams.customerNo == null || $scope.mediaCancelParams.customerNo == ''|| $scope.mediaCancelParams.customerNo == undefined) &&
					($scope.mediaCancelParams["idNumber"] == null || $scope.mediaCancelParams["idNumber"] == undefined || $scope.mediaCancelParams["idNumber"] == '')&&
				($scope.mediaCancelParams.externalIdentificationNo=="" ||  $scope.mediaCancelParams.externalIdentificationNo == undefined)){
				jfLayer.alert(T.T('F00076'));//"请输入身份证号外部识别号其中一个！"
			}else {
				if($scope.mediaCancelParams["idType"]){
					if($scope.mediaCancelParams["idNumber"] == null || $scope.mediaCancelParams["idNumber"] == undefined || $scope.mediaCancelParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else if($scope.mediaCancelParams["idNumber"]){
					if($scope.mediaCancelParams["idType"] != null || $scope.mediaCancelParams["idType"] != undefined || $scope.mediaCancelParams["idType"] != ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else {
					$scope.searchHandlee($scope.mdmActvtInfo);
				}
			}
			
		};
		
		
		
		//产品升降级
		$scope.proLiftingBtn = function(item){
			// 页面弹出框事件(弹出页面)
			$scope.proLiftingInf = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/baseBsnPcsg/layerproLifting.html', $scope.proLiftingInf, {
				title :T.T('KHJ400005'),
				buttons : [ T.T('F00107'),T.T('F00012')],
				size : [ '1050px', '400px'  ],
				callbacks : [$scope.proLiftingSure]
			});
		};
		
		
		//确定产品升降
		$scope.proLiftingSure = function(result){
			
			$scope.proLiftingInf = result.scope.proLiftingInf;
			$scope.proLiftingInf.invalidDateOldCard = $('#invalidDateOldCardId').val();
			
			if($scope.proLiftingInf.productObjectCode != $scope.proLiftingInf.productObjectCode){
				jfLayer.alert(T.T("KHJ400006"));
				return;
            }
            if($scope.proLiftingInf.productObjectCode == $scope.proLiftingInf.productObjectCodeNew){
				jfLayer.alert(T.T("KHJ400007"));
				return;
            }
            $scope.params = {
					customerNo: $scope.proLiftingInf.customerNo,
					productObjectCode: $scope.proLiftingInf.productObjectCode,
					idType: $scope.customerInfo.idType,
					idNumber: $scope.customerInfo.idNumber,
					productObjectCodeNew: $scope.proLiftingInf.productObjectCodeNew,
					operationMode: $scope.proLiftingInf.viewoperationMode,
					invalidDateOldCard: $scope.proLiftingInf.invalidDateOldCard
			};
			
			jfRest.request('cstProduct', 'lifting', $scope.params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				
				if (data.returnCode == '000000') {
					
					jfLayer.success(T.T("KHJ400008"));
					
					$scope.safeApply();
					result.cancel();
					
					
					$scope.cstMdmInfTable.idType = $scope.mediaCancelParams.idType;
					$scope.cstMdmInfTable.idNumber = $scope.mediaCancelParams.idNumber;
					$scope.cstMdmInfTable.externalIdentificationNo = $scope.mediaCancelParams.externalIdentificationNo;
					
					$scope.cstMdmInfTable.search();

}
            });
			
			
		};
		
		
		
		
		
		
		
		
	});
	
	
	//产品升降级详情
	webApp.controller('layerproLiftingCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	
		$scope.proLiftingInf = $scope.proLiftingInf;
		
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.proLiftingInf.viewoperationMode = $scope.proLiftingInf.operationMode;
		        }
		    };
		
		
		//产品对象代码
		 $scope.proArray ={ 
	        type:"dynamicDesc", 
	        param:{operationMode:$scope.proLiftingInf.operationMode},//默认查询条件 
	        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"productDesc",
	        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"proObject.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		 
		 var form = layui.form;
	 		form.on('select(getProObjCodeNew)',function(event){
	 			jfRest.request('proObject', 'query', {operationMode:$scope.proLiftingInf.operationMode})//Tansun.param($scope.pDCfgInfo)
				.then(function(data) {
					
					if (data.returnCode == '000000') {
						if(data.returnData){
							if(data.returnData.rows){
								
								for(var i = 0; i < data.returnData.rows.length ; i++){
									
									if(event.value == data.returnData.rows[i].productObjectCode){
										 $scope.proLiftingInf.binNoNew = data.returnData.rows[i].binNo;
										
									}

}
                            }
						}
						
					}
					
				});
	 			
	 		});
		});
});
