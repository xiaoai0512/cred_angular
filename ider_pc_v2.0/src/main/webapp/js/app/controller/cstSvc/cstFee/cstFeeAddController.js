'use strict';
define(function(require) {
	var webApp = require('app');
	// 账户基本信息
	webApp.controller('cstFeeAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstFee/i18n_cstFee');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.isShow = false;
		$scope.cstFeeShow = false;
		$scope.productShow = false;
		$scope.count = 2;
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
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.mediaActivatyParams.idNumber= '';
			if(data.value == "1"){//身份证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#cstFeeWaiveList_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#cstFeeWaiveList_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#cstFeeWaiveList_idNumber").attr("validator","id_isPermanentReside");
            }
        });
		//查询类型下拉框
		 $scope.periodArray ={ 
			        type:"dictData", 
			        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray2","queryFlag":"1"},//默认查询条件 
			        text:"codes", //下拉框显示内容，根据需要修改字段名称 
			        desc:"detailDesc",
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"dropDownBox.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//重置
		$scope.reset = function() {
			$scope.mediaActivatyParams ={};
			$scope.addedServiceFeeInf ={};
			$scope.isShow = false;
			$scope.productShow = false;
		};
		$scope.chargingFrequencyShow =false;
		form.on('select(getProduct)',function(data){
			$scope.isShow = false;
			$scope.productShow = false;
			if($scope.mediaActivatyParams.periodicFeeIdentifier =='C' || $scope.mediaActivatyParams.periodicFeeIdentifier =='P'){
   			 $scope.chargingFrequencyShow =true;
	   		}else{
	   			 $scope.chargingFrequencyShow =false;
	   			 $scope.payProInf.chargingFrequency=null;
	   		}
		});
		$scope.queryitemList = function(){
			$scope.mdmActvtInfo = {
					idType :$scope.mediaActivatyParams.idType,
					idNumber :$scope.mediaActivatyParams.idNumber,
					externalIdentificationNo :$scope.mediaActivatyParams.externalIdentificationNo,
					periodicFeeIdentifier :$scope.mediaActivatyParams.periodicFeeIdentifier,
					falg :"2"
			};
			if(($scope.mediaActivatyParams.idType == null || $scope.mediaActivatyParams.idType == ''|| $scope.mediaActivatyParams.idType == undefined) &&
					($scope.mediaActivatyParams.idNumber== null ||$scope.mediaActivatyParams.idNumber=="" || $scope.mediaActivatyParams.idNumber== undefined ) &&
					($scope.mediaActivatyParams.externalIdentificationNo== null || $scope.mediaActivatyParams.externalIdentificationNo=="" || $scope.mediaActivatyParams.externalIdentificationNo== undefined )){
				jfLayer.alert(T.T('F00076'));//"请输入身份证号外部识别号其中一个！"
			}else {
				if($scope.mediaActivatyParams["idType"]){
					if($scope.mediaActivatyParams["idNumber"] == null || $scope.mediaActivatyParams["idNumber"] == undefined || $scope.mediaActivatyParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else if($scope.mediaActivatyParams["idNumber"]){
					if($scope.mediaActivatyParams["idType"] == null || $scope.mediaActivatyParams["idType"] == undefined || $scope.mediaActivatyParams["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else{
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else {
					$scope.searchHandlee($scope.mdmActvtInfo);
				}
			}
		};
		$scope.addedServiceFeeInf ={};
		//搜索执行函数
		$scope.searchHandlee = function(params){
			if(!params.periodicFeeIdentifier){
				jfLayer.alert(T.T('KHH7000004'));//'请选择查询类型'
				return;
            }
            jfRest.request('cstMediaList', 'queryProduct', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(!data.returnData || !data.returnData.rows || data.returnData.rows.length==0){//客户下没有产品
						$scope.queryFun(params);
					}else if(data.returnData.rows.length > 0){//客户有产品
						$scope.modal('/cstSvc/cstFee/layerProQuery.html', $scope.mediaActivatyParams, {
							title : T.T('KHH7000034'),//'客户定价标签信息'
							buttons : [T.T('F00107'),T.T('F00012') ],//'确认','关闭' 
							size : [ '1050px', '300px' ],
							callbacks : [ $scope.selectPro]
						});
						$scope.isShow = false;
                    }
                }else {
					$scope.isShow = false;
				}
			});
		};
		//选择产品
		$scope.selectPro =  function(result){
			if(!result.scope.chooseProTable.validCheck()){

			}else {
				$scope.addedServiceFeeInf.productObjectCode = result.scope.chooseProTable.checkedList().productObjectCode;//
				$scope.safeApply();
				result.cancel();
				$scope.productShow = true;
				$scope.queryFun($scope.mdmActvtInfo);
				if($scope.mediaActivatyParams.periodicFeeIdentifier=='C'){ 
					 $scope.cstFeeShow = true;
					 $scope.chooseFeePro.search();
					 $scope.count = 3;
				 }else{
					 $scope.cstFeeShow = false;
					 $scope.count = 2;
				 }
			}
		};
		//客户产品 查询
		$scope.queryFun = function(params){
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData!=null){
						$scope.addedServiceFeeInf.customerNo  = data.returnData.rows[0].customerNo;
						$scope.addedServiceFeeInf.customerName  = data.returnData.rows[0].customerName;
						$scope.addedServiceFeeInf.idNumber  = data.returnData.rows[0].idNumber;
						$scope.addedServiceFeeInf.operationMode  = data.returnData.rows[0].operationMode;
//						$scope.selPDObjTable.idType  = data.returnData.idType;
						//查询客户收费项目
						$scope.getFeeItem(params);
						$scope.isShow = true;
					}else {
						jfLayer.alert(T.T('KHJ5700001'));//"抱歉，不存在此客户！"
						$scope.isShow = false;
					}
				}else {
					$scope.isShow = false;
				}
			});
		};
		//选择收费项目
		$scope.chooseFeePro = {
			checkType : 'checkbox', // 
			autoQuery:false,
			params : {
					periodicFeeIdentifier:'C',
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'feeProject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory','dic_instanceDimension','dic_instanceDimension'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc','instanCode1_instanCode1Desc','instanCode2_instanCode2Desc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			},
		};
		//关联
		$scope.saveSelect = function(event) {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.chooseFeePro.validCheck()) {
				return;
			}
			var items = $scope.chooseFeePro.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].feeItemNo == $rootScope.treeSelect[k].feeItemNo && !$rootScope.treeSelect[k].expirationDate) {    //判断是否存在
						tipStr = tipStr + items[i].feeItemNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.infoIsShow = false;
					$scope.antiInfoIsShow = true;
					items[i].expirationDate = null;
					$rootScope.treeSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('KHH7000005') + tipStr.substring(0,tipStr.length-1) + T.T('PZJ100032'));
			}
		};
		//查询客户已关联收费项目
		$scope.infoIsShow = false;
		$scope.antiInfoIsShow = false;
		$scope.getFeeItem = function(params){
			jfRest.request('cstFeeWaiveInf', 'query', params)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$rootScope.treeSelect = data.returnData.rows;
					if (data.returnData.rows == null) {
						$rootScope.treeSelect = [];
					} else {
						$rootScope.treeSelect = data.returnData.rows;
					}
					if(null==$rootScope.treeSelect ||$rootScope.treeSelect.length==0){
						$scope.infoIsShow = true;
						$scope.antiInfoIsShow = false;
					}else{
						$scope.infoIsShow = false;
						$scope.antiInfoIsShow = true;
					}
				}
			});
		};
		// 删除关联收费项目
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
		};
		$scope.addFeeItem = function() {
			$scope.feeProparams = {
					customerNo : $scope.addedServiceFeeInf.customerNo,
					operationMode : $scope.addedServiceFeeInf.operationMode,
					idType :$scope.mediaActivatyParams.idType,
					idNumber :$scope.mediaActivatyParams.idNumber,
					externalIdentificationNo :$scope.mediaActivatyParams.externalIdentificationNo,
					productObjectCode : $scope.addedServiceFeeInf.productObjectCode
				};
				$scope.feeProparams.coreFeeItemList = $rootScope.treeSelect;
				jfRest.request('cstInfBuild', 'insertCstFeeItem',$scope.feeProparams).then(function(data) { 
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));//"保存成功"
						$scope.reset();
						$scope.addedServiceFeeInf = {};
						$rootScope.treeSelect= [];
					}
				});
			};
		//查看详细信息
		$scope.queryCustFeeInfo = function(event) {
			$scope.cusFeeInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstFee/viewCstFeeInfo.html', $scope.cusFeeInfo, {
				title :T.T('KHH6000003'),// '客户费用收取信息'
				buttons : [ T.T('F00012')],//'关闭' 
				size : [ '1050px', '550px' ],
				callbacks : [ $scope.selectCorporat2 ]
			});
		};
		$scope.selectCorporat2 = function(result) {
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('viewCstfeeInfoCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstFee/i18n_cstFee');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
		$scope.detailView = $scope.cusFeeInfo;
		//查询类型下拉框
		 $scope.periodArray ={ 
			        type:"dictData", 
			        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"1"},//默认查询条件 
			        text:"codes", //下拉框显示内容，根据需要修改字段名称 
			        desc:"detailDesc",
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"dropDownBox.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
	});
	//产品信息
	webApp.controller('layerProQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstFee/i18n_cstFee');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
		//查询类型下拉框
		 $scope.chooseProTable ={
				checkType : 'radio', // 
				params : {
						pageSize:10,
						indexNo:0,
						idType : $scope.mediaActivatyParams.idType,
						idNumber : $scope.mediaActivatyParams.idNumber,
						externalIdentificationNo :$scope.mediaActivatyParams.externalIdentificationNo
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryProduct',// 列表的资源.
				callback : function(data) { // 表格查询后的回调函数
				}
		 };
		 $scope.chargingFrequencyShow =false;
		 if($scope.mediaActivatyParams.periodicFeeIdentifier =='C' || $scope.mediaActivatyParams.periodicFeeIdentifier =='P'){
			 $scope.chargingFrequencyShow =true;
		}else{
			 $scope.chargingFrequencyShow =false;
		}
		 /*收取频率
		  * O-一次性收取：O,C-按CYCLE收取,Y-按年收取*/
		 $scope.chargingFrequencyArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_chargingFrequency",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.chargingFrequency=$scope.mediaActivatyParams.chargingFrequency;
	        }
		};
	});
});
