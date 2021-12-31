'use strict';
define(function(require) {
	var webApp = require('app');
	//媒介毁损补发
	webApp.controller('mediaDmgRsuCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu');
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.mediaSearch = {};
		$scope.showProductInfo = false;  // 设置默认不显示
		//媒介领取标志
//		$scope.mediaDispatchMethodArr = [{name :T.T('F00159'),id : 'Y'},{name :  T.T('F00160'),id : 'N'}];
		//密码函领取标志
//		$scope.pinDispatchMethodArr = [{name :T.T('F00159'),id : 'Y'},{name : T.T('F00160') ,id : 'N'}];
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
		//动态请求下拉框 密码函领取标志
		 $scope.pinDispatchMethodArr ={ 
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
		//动态请求下拉框  媒介领取标志
		 $scope.mediaDispatchMethodArr ={ 
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
 		//联动验证
 		var form = layui.form;
 		form.on('select(getIdType)',function(data){
 			$scope.mediaSearch.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#mediaDmgRsu_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#mediaDmgRsu_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#mediaDmgRsu_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#mediaDmgRsu_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#mediaDmgRsu_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#mediaDmgRsu_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		//自定义下拉框---------制卡请求
		//'毁损补发制卡''新发卡制卡' '到期续卡制卡' '毁损补发制卡''挂失换卡制卡'
		$scope.coArray = [{name : T.T('KHJ300001') ,id : '3'}] ;
		$scope.coArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_productionCode1",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
	};
		$scope.coArray2 = [{name : T.T('KHJ300002'),id : '1'},
		                  {name : T.T('KHJ300003'),id : '2'},
		                  {name : T.T('KHJ300001') ,id : '3'},
		                  {name : T.T('KHJ300004')  ,id : '4'},
		                  {name : "提前续卡制卡"  ,id : '5'}] ;
		$scope.coArray2  ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_productionCode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
	};
		//主附标识'主卡''附属卡'
		$scope.mainAttachmentArray = [{name : T.T('KHJ300005') ,id : '1'},{name : T.T('KHJ300006') ,id : '2'}];
		//卡状态'新发' '活跃' '非活跃' '已转出' '关闭' '待删除'
		$scope.cardState = [{name : T.T('KHJ300007'),id : '1'},
		                    {name : T.T('KHJ300008'),id : '2'},
		                    {name : T.T('KHJ300009'),id : '3'},
		                    {name : T.T('KHJ300010'),id : '4'},
		                    {name : T.T('KHH300030'),id : '8'},
		                    {name : T.T('KHJ300012') ,id : '9'}];
		//激活状态'已激活' '新发卡未激活''续卡未激活'  '转卡未激活' 
		$scope.activeState = [{name : T.T('KHJ300012'),id : '1'},
		                      {name : T.T('KHJ300013') ,id : '2'},
		                      {name : T.T('KHJ300014'),id : '3'},
		                      {name : T.T('KHJ300015'),id : '4'},
		                      {name : T.T('KHH300033'),id : '6'}];
		//激活标识
	/*	$scope.activationFlag = [ {
			name : T.T('KHJ300012'),//'已激活',
			id : '1'
		}, {
			name : T.T('KHJ300013'),//'新发卡未激活',
			id : '2'
		}, {
			name : T.T('KHH300041'),//'毁卡补发/续卡未激活',
			id : '3'
		}, {
			name : T.T('KHJ300015'),//'转卡未激活',
			id : '4'
		}, {
			name : T.T('KHH300042'),//'无需激活',
			id : '5'
		},{
			name : T.T('KHH300033'),//'提前续卡未激活',
			id : '6'
		} ];*/
		//动态请求下拉框  激活标识
		 $scope.activationFlagArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_activationFlag",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        }
		};
		//激活方式
		/*$scope.activationModeType = [ {
			name : T.T('KHH300043'),//'人工激活',
			id : '1'
		}, {
			name : T.T('KHH300044'),//'无须激活',
			id : '2'
		} ];*/
		//动态请求下拉框  激活方式
		 $scope.activationModeTypeArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_activationMode",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        }
		};
		//查询媒介信息
		$scope.itemList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					'flag' : 1,
					idType: $scope.mediaSearch.idType,
					idNumber: $scope.mediaSearch.idNumber, 
					externalIdentificationNo: $scope.mediaSearch.externalIdentificationNo
				
				}, // 表格查询时的参数信息
				checkType : 'radio', // 当为checkbox时为多选
				autoQuery: false,
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMedia',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_mainAttachedFlag','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
				transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc', 'invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
					if(data.returnCode == "000000"){
						if(data.returnData.rows!=null){
							$scope.itemList.params.idNumber = data.returnData.rows[0].idNumber;
						}
					}
				},
				checkBack: function(row){
					$scope.viewMediaInf(row);
				}
			};
		//查询
		$scope.mediaSearch = {};
		$scope.searchCstProductTableInfo = function(){
			$scope.showProductInfo = false;
			$scope.mInfo = {};
			$scope.mediaSave = {};
			$scope.productionCode = "";
			$scope.mediaSearch.flag = "1";
			if(($scope.mediaSearch.idType == null || $scope.mediaSearch.idType == ''|| $scope.mediaSearch.idType == undefined) &&
					($scope.mediaSearch.customerNo == null || $scope.mediaSearch.customerNo == ''|| $scope.mediaSearch.customerNo == undefined) &&
					($scope.mediaSearch.idNumber == "" || $scope.mediaSearch.idNumber == undefined )
					&&( $scope.mediaSearch.externalIdentificationNo == "" || $scope.mediaSearch.externalIdentificationNo == undefined)
				){
				jfLayer.alert(T.T('F00076'));//"请输入任意查询条件！"
			}
			else {
				if($scope.mediaSearch["idType"]){
					if($scope.mediaSearch["idNumber"] == null || $scope.mediaSearch["idNumber"] == undefined || $scope.mediaSearch["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showProductInfo = false;
					}else {
						$scope.isShowWindow($scope.mediaSearch);
					}
				}else if($scope.mediaSearch["idNumber"]){
					if($scope.mediaSearch["idType"] == null || $scope.mediaSearch["idType"] == undefined || $scope.mediaSearch["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showProductInfo = false;
					}else {
						$scope.isShowWindow($scope.mediaSearch);
					}
				}else {
					$scope.isShowWindow($scope.mediaSearch);
				}
			}
		};
		//点击查询，根据返回结果，弹窗他、，然后弹窗中，再正常调取
		$scope.isShowWindow = function(params){
			$scope.customerInfo = {};
			params.externalIdentificationNoOri = params.externalIdentificationNo;
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowMediaList = true;//媒介列表
					$scope.isShowMedaiDetail = false;//媒介详情
					if(data.returnData!=null){
						$scope.customerInfo.idType = data.returnData.rows[0].idType;
						$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
						$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
						$scope.itemList.params.idType = $scope.mediaSearch.idType;
						$scope.itemList.params.idNumber = $scope.mediaSearch.idNumber;
						$scope.itemList.params.externalIdentificationNo = $scope.mediaSearch.externalIdentificationNo;
						$scope.itemList.search();
					}
				}else {
					$scope.isShowMediaList = false;//媒介列表
					$scope.isShowMedaiDetail = false;//媒介详情
				}
			});
		};
		//查询
		$scope.viewMediaInf = function(item){
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.mInfo = $scope.item;
			$scope.isShowMedaiDetail = true;
			$scope.isShowBtn = true;//确定按钮
			$scope.queryMedaiBaseParams={
					idType:	$scope.customerInfo.idType,	
					idNumber: $scope.customerInfo.idNumber,
					externalIdentificationNo:$scope.mediaSearch.externalIdentificationNo,
					mediaUnitCode: $scope.item.mediaUnitCode,
			};
			$scope.queryMedaiBaseInf($scope.queryMedaiBaseParams);
		};
		//运营模式
		 $scope.operationModeArr = { 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		// 机构号查询
		$scope.institutionIdArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
			//	console.log(data);
			}
		};
		//查询媒介基本信息
		$scope.queryMedaiBaseInf = function(params){
			jfRest.request('mediaLoss', 'queryMedaiBaseInf',params).then(function(data) {
				if(data.returnCode == "000000"){
					if (data.returnData.rows && data.returnData.rows.length > 0) {
						$scope.mInfo = data.returnData.rows[0];
						$scope.mInfo.productionCode = '3';//毁损补发制卡
						$("#productionCode").attr("disabled","disabled");
						//上一次制卡请求 码值翻译
						if($scope.mInfo.previousProductionCode==1){
							$scope.mInfo.firstCardRequestTran = T.T('KHJ300002');//"新发卡制卡";
						}else if($scope.mInfo.previousProductionCode==2){
							$scope.mInfo.firstCardRequestTran = T.T('KHJ300003');//"到期续卡制卡";
						}else if($scope.mInfo.previousProductionCode==3){
							$scope.mInfo.firstCardRequestTran = T.T('KHJ300001');//"毁损补发制卡";
						}else if($scope.mInfo.previousProductionCode==4){
							$scope.mInfo.firstCardRequestTran = T.T('KHJ300004');//"挂失换卡制卡";
						}else {
							$scope.mInfo.firstCardRequestTran = '';
                        }
                        if($scope.mInfo.invalidFlag == 'Y'){
							$scope.mInfo.invalidFlagStr = T.T('KHH300025');
						}else if($scope.mInfo.invalidFlag == 'N'){
							$scope.mInfo.invalidFlagStr = T.T('KHH300026');
                        }
                        if ($scope.mInfo.invalidFlag == 'N') {
							$scope.mInfo.invalidFlagStr = T.T('KHH300026');//"无效";
							if($scope.mInfo.invalidReason == "DPAN") {
								jfLayer.fail(T.T('KHJ300025'));//电子绑定卡
							}else if($scope.mInfo.invalidReason == "TRF") {
								jfLayer.fail(T.T('KHJ300018'));//"该卡已经转卡!"
							}else if($scope.mInfo.invalidReason == "EXP") {
								jfLayer.fail(T.T('KHJ300019'));//"该卡已经到期!"
							}else if($scope.mInfo.invalidReason == "BRK") {
								jfLayer.fail(T.T('KHJ300020'));//"该卡已经毁损!"
							}else if($scope.mInfo.invalidReason == "RNA") {
								jfLayer.fail(T.T('KHJ300014'));//续卡未激活
							}else if ($scope.mInfo.invalidReason == "CLS") {
								jfLayer.fail(T.T('KHJ300021'));//"该卡已经关闭!"
							}else if($scope.mInfo.invalidReason == "PNA") {
								jfLayer.fail(T.T('KHJ300026'));//提前续卡未激活
							}else if($scope.mInfo.invalidReason == "CHP") {
								jfLayer.fail(T.T('KHJ300027'));//产品升降级
							}
						} else {
							$scope.mInfo.invalidFlagStr = T.T('KHH300025');//"有效";
                        }
                        if($scope.mInfo.mainSupplyIndicator == '1'){
							$scope.mInfo.mainSupplyIndicatorStr = T.T('KHJ300005');
						}else if($scope.mInfo.mainSupplyIndicator == '2'){
							$scope.mInfo.mainSupplyIndicatorStr = T.T('KHJ300006');
                        }
                        //媒介对象代码
						$scope.mInfo.mediaObjectCodeTrans = $scope.mInfo.mediaObjectCode + $scope.mInfo.mediaObjectDesc;
						//产品对象代码
						$scope.mInfo.productObjectCodeTrans = $scope.mInfo.productObjectCode + $scope.mInfo.productDesc;
					}
				}
			});
		};
		//毁损补发
		$scope.submitRlTmMkCrd = function(){
			if($scope.mInfo.invalidFlag== 'N' ){
				if($scope.mInfo.invalidReason == "DPAN") {
					jfLayer.fail(T.T('KHJ300025'));//电子绑定卡
				}else if($scope.mInfo.invalidReason == "TRF") {
					jfLayer.fail(T.T('KHJ300018'));//"该卡已经转卡!"
				}else if($scope.mInfo.invalidReason == "EXP") {
					jfLayer.fail(T.T('KHJ300019'));//"该卡已经到期!"
				}else if($scope.mInfo.invalidReason == "BRK") {
					jfLayer.fail(T.T('KHJ300020'));//"该卡已经毁损!"
				}else if($scope.mInfo.invalidReason == "RNA") {
					jfLayer.fail(T.T('KHJ300014'));//续卡未激活
				}else if ($scope.mInfo.invalidReason == "CLS") {
					jfLayer.fail(T.T('KHJ300021'));//"该卡已经关闭!"
				}else if($scope.mInfo.invalidReason == "PNA") {
					jfLayer.fail(T.T('KHJ300026'));//提前续卡未激活
				}else if($scope.mInfo.invalidReason == "CHP") {
					jfLayer.fail(T.T('KHJ300027'));//产品升降级
				}
				return;
            }
            $scope.mediaSave = $scope.mInfo;
			$scope.mediaSave.invalidReason = "BRK";
			$scope.mediaSave.operatorId = sessionStorage.getItem("userName");
			$scope.mediaSave = $.extend($scope.mediaSave , $scope.mediaSearch);
			jfRest.request('mediaDmgRsu', 'save', $scope.mediaSave)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ300022'));
					$scope.reset();
				}
	});
	};
		//重置
		$scope.reset = function(){
			$scope.mInfo = {};
			$scope.mediaSearch.externalIdentificationNo = "";
			$scope.mediaSearch.idNumber ="";
			$scope.mediaSearch.idType = '';
			$scope.isShowMediaList = false;//媒介列表
			$scope.isShowMedaiDetail = false;//媒介详情
			$scope.isShowBtn = false;//确定按钮
			$('#mediaDmgRsu_idNumber').attr('validator','noValidator');
			$('#mediaDmgRsu_idNumber').removeClass('waringform');
		};
		//查询运营日期即交易日期，因poc环境日期与自然日期相差太远
		$scope.queryDate =function(){
			$scope.params ={};
			$scope.params.operationMode = "A01";
			jfRest.request('disputeAccount', 'queryTransDate', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows!=null){
						$scope.mInfo.dateproductionCode = data.returnData.rows[0].nextProcessDate;
					}
				}
			});
		}
	});
	//原来的弹窗
	webApp.controller('layerMediaDmgRsuCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu');
		$translate.refresh();
		//查询媒介信息
		$scope.itemList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0,
					'flag' : 1,
					"idType":$scope.mediaSearch.idType,
					"idNumber":$scope.mediaSearch.idNumber,
					"externalIdentificationNo":$scope.mediaSearch.externalIdentificationNo
				}, // 表格查询时的参数信息
				checkType : 'radio', // 当为checkbox时为多选
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMedia',// 列表的资源
				//autoQuery: false,
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_mainAttachedFlag','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
				transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc', 'invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
					if(data.returnCode == "000000"){
						if(data.returnData.rows!=null){
							$scope.itemList.params.idNumber = data.returnData.rows[0].idNumber;
						}
					}
				}
			};
		});
});
