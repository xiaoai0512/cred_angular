'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户证件号码变更
	webApp.controller('cstIDNoChangeCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, filter,
							$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEnqrAndMnt');
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEstb');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.csInfParams = {};
		$scope.csInf = {};
		$scope.isShowCstIngDiv = false;
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
		$scope.csInfEstbInfo = function() {
		};
		$scope.customerLevelTable = [];
		$scope.cstAdrInfoTable = [];
		$scope.cstRemarksTable = [];
		$scope.resultSel = false;
		//重置
		$scope.reset = function() {
			$scope.csInfParams.idType = '';
			$scope.csInfParams.idNumber = '';
			$scope.csInfParams.externalIdentificationNo = '';
			$scope.csInfParams.customerNo = '';
			$scope.resultSel = false;
			$("#csInfEnqr_idNumber").attr("validator","noValidator");
			$("#csInfEnqr_idNumber").removeClass("waringform ");
		};
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
	                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
	                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
	                                		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		 //根据菜单和当前登录者查询有权限的事件编号
	 	$scope.menuNoSel = $scope.menuNo;
		 $scope.paramsNo = {
				 menuNo:$scope.menuNoSel
		 };
			/*jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
				if(data.returnData != null || data.returnData != ""){
					for(var i=0;i<data.returnData.length;i++){
	   					$scope.eventList += data.returnData[i].eventNo + ",";
	   				}
		   	   	if($scope.eventList.search('BSS.UP.01.0014') != -1){    //维护
   					$scope.updBtnFlag = true;
   				}
   				else{
   					$scope.updBtnFlag = false;
   				}
				}
			});*/
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.csInfParams.idNumber = '';
			if(data.value == "1"){//身份证
				$("#csInfEnqr_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#csInfEnqr_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#csInfEnqr_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#csInfEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#csInfEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#csInfEnqr_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#csInfEnqr_idNumber").attr("validator","noValidator");
				$scope.cstInfMntQueryForm.$setPristine();
				$("#csInfEnqr_idNumber").removeClass("waringform ");
            }
        });
		// 查询客户基本信息
		$scope.queryCstInfo = function() {
			console.log($scope.csInfParams["idType"]);
			if(($scope.csInfParams.customerNo ==null || $scope.csInfParams.customerNo== undefined || $scope.csInfParams.customerNo== '')&&
					($scope.csInfParams.idType ==null || $scope.csInfParams.idType== undefined || $scope.csInfParams.idType== '')&&
					($scope.csInfParams.idNumber ==null || $scope.csInfParams.idNumber== undefined || $scope.csInfParams.idNumber== '')&&
					($scope.csInfParams.externalIdentificationNo ==null || $scope.csInfParams.externalIdentificationNo== undefined || $scope.csInfParams.externalIdentificationNo== '')){
				jfLayer.alert(T.T('KHJ3500036'));//"请输入查询条件！"
				return;
				$scope.resultSel = false;
			}else {
				if($scope.csInfParams["idType"]){
					if($scope.csInfParams["idNumber"] == null || $scope.csInfParams["idNumber"] == undefined || $scope.csInfParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.searchCstBaseInf($scope.csInfParams);
					}
				}else if($scope.csInfParams["idNumber"]){
					if($scope.csInfParams["idType"] == null || $scope.csInfParams["idType"] == undefined || $scope.csInfParams["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.searchCstBaseInf($scope.csInfParams);
					}
				}else {
					$scope.searchCstBaseInf($scope.csInfParams);
				}
			}
		};
		//查询客户信息
		$scope.searchCstBaseInf = function(){
				$scope.itemList.params.idType = $scope.csInfParams.idType;
				$scope.itemList.params.idNumber = $scope.csInfParams.idNumber;
				$scope.itemList.params.externalIdentificationNo = $scope.csInfParams.externalIdentificationNo;
				$scope.itemList.search();
		};
		$scope.showOtherInfo = false;// 基本信息保存
		$scope.showCstRmrkInfo = false;// 客户备注信息新增
		$scope.showCstPrcgLblInfo = false;// 客户定价标签信息新增
		//查询客户证件信息
		$scope.itemList = {
//				checkType : 'radio',
				params :{
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				autoQuery : false,
				paging : true,// 默认true,是否分页
				resource : 'cstIdChange.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_IdCardType','dic_IdCardType'],//查找数据字典所需参数
				transDict : ['idType_idTypeDesc','previousIdType_previousIdTypeDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.resultSel = true;
						if(data.returnData){
						}else {
							$scope.resultSel = false;
						}
					}
					else{
						$scope.resultSel = false;
						$scope.showItemList = false;
					}
				}
			};
		$scope.updateCstID = function(item){
			$scope.cstItemInfo = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/csInfEstb/updateCstID.html', $scope.cstItemInfo, {
				title : T.T('KHJ3500038'),
				buttons : [T.T('F00125'),T.T('F00046') ],
				size : [ '800px', '400px' ],
				callbacks : [$scope.sureUpCstID]
			});
		};
		//确定修改
		$scope.sureUpCstID = function(result){
			$scope.cstInfoParams = result.scope.cstItemInfo;
			$scope.upIDParams = {
					oldIdType : $scope.cstInfoParams.idType,
					oldIdNumber	: $scope.cstInfoParams.idNumber,
					idType : $scope.cstInfoParams.updateIdType,
					idNumber: $scope.cstInfoParams.updateIdNumber,
					customerNo: $scope.cstInfoParams.customerNo,
					customerName:$scope.cstInfoParams.customerName
			};
			jfRest.request('cstIdChange', 'update', $scope.upIDParams)
					.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success(T.T('F00022'));
							$scope.safeApply();
							result.cancel();
							$scope.resultSel = false;
						}
			});
		};
	});
	//修改证件号码变更
	webApp.controller('updateCstIDCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEnqrAndMnt');
		$translate.refresh();
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.cstItemInfo.updateIdNumber = '';
			if(data.value == "1"){//身份证
				$("#csInfEnqr_upidNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#csInfEnqr_upidNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#csInfEnqr_upidNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#csInfEnqr_upidNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#csInfEnqr_upidNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#csInfEnqr_upidNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#csInfEnqr_upidNumber").attr("validator","noValidator");
//				$scope.updateCstIDForm.$setPristine();
				$("#csInfEnqr_upidNumber").removeClass("waringform ");
            }
        });
		$scope.cstItemInfo = $scope.cstItemInfo;
		$scope.cstItemInfo.updateIdType = $scope.cstItemInfo.idType;
		$scope.cstItemInfo.updateIdNumber = $scope.cstItemInfo.idNumber;
	});
});
