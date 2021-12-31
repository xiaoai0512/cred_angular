'use strict';
define(function(require) {
	var webApp = require('app');
	// 去除封锁码
	webApp.controller('deteleBlockCodeCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_deleteBlockCode');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		//'C-客户级''A-业务类型级''P-产品级''M-媒介级'
		$scope.demoArray2 = [{
			name: T.T('KHJ600001'),
			id: 'C'
		}, {
			name: T.T('KHJ600002'),
			id: 'A'
		}, {
			name: T.T('KHJ600003'),
			id: 'P'
		}, {
			name: T.T('KHJ600004'),
			id: 'M'
		}];
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
 			$scope.blockTable.params.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#deleteBlockCode_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#deleteBlockCode_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#deleteBlockCode_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#deleteBlockCode_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#deleteBlockCode_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#deleteBlockCode_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.showBlockDiv = false;
		//查询媒介列表
		$scope.deleParams = {};
		$scope.queryBlockInf = function(event){
			if(($scope.blockTable.params.idType == null || $scope.blockTable.params.idType == ''|| $scope.blockTable.params.idType == undefined) &&
					($scope.blockTable.params.customerNo == null || $scope.blockTable.params.customerNo == ''|| $scope.blockTable.params.customerNo == undefined) &&
					($scope.blockTable.params.idNumber == "" || $scope.blockTable.params.idNumber == undefined )
					&&( $scope.blockTable.params.externalIdentificationNo == "" || $scope.blockTable.params.externalIdentificationNo == undefined)
				){
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}
			else {
				if($scope.blockTable.params["idType"] ){
					if($scope.blockTable.params["idNumber"] == null || $scope.blockTable.params["idNumber"] == undefined || $scope.blockTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
					}else {
						$scope.showBlockDiv = true;
						$scope.blockTable.search();
					}
				}else if($scope.blockTable.params["idNumber"]){
					if($scope.blockTable.params["idType"] == null || $scope.blockTable.params["idType"] == undefined || $scope.blockTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
					}else {
						$scope.showBlockDiv = true;
						$scope.blockTable.search();
					}
				}else {
					$scope.showBlockDiv = true;
					$scope.blockTable.search();
				}
			}
		/*	
			else if(($scope.blockTable.params["idType"] != null || $scope.blockTable.params["idType"] != undefined || $scope.blockTable.params["idType"] != '') && 
        			($scope.blockTable.params["idNumber"] == null || $scope.blockTable.params["idNumber"] == undefined || $scope.blockTable.params["idNumber"] == '')){
					jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					$scope.showItemList = false;
					return;
				}else if(($scope.blockTable.params["idType"] == null || $scope.blockTable.params["idType"] == undefined || $scope.blockTable.params["idType"] == '') && 
	        			($scope.blockTable.params["idNumber"] != null || $scope.blockTable.params["idNumber"] != undefined || $scope.blockTable.params["idNumber"] != '')){
					jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					$scope.showItemList = false;
					return;
				}
			else{
				$scope.showBlockDiv = true;
				$scope.blockTable.search();
				if($scope.credentialNumber && !$scope.externalIdentificationNo){//根据身份证号查询识别号
					$scope.deleParams.flag = "C";
					$scope.deleParams.credentialNumber = $scope.credentialNumber ;
					jfRest.request('deleteBlockCode', 'query', $scope.deleParams).then(function(data) {
						if (data.returnCode == '000000') {
								$scope.itemArr = data.returnData;//外部识别号数组
								$scope.showExNoDiv = true;
						//	$scope.showBlockDiv = true;
						}else{
							jfLayer.fail(data.returnMsg);
						}
					});
				}else if($scope.externalIdentificationNo && !$scope.credentialNumber){//根据识别号直接查询封锁码
					$scope.deleParams.flag = "E";
					$scope.deleParams.externalIdentificationNo = $scope.externalIdentificationNo ;
					$scope.blockTable.params.flag = 'E';
					$scope.blockTable.params.externalIdentificationNo = $scope.externalIdentificationNo ;
					$scope.blockTable.search();
					$scope.showExNoDiv = false;
					$scope.showBlockDiv = true;
				}else if ($scope.externalIdentificationNo && $scope.credentialNumber){
					$scope.deleParams.flag = "E";
					$scope.deleParams.externalIdentificationNo = $scope.externalIdentificationNo ;
					$scope.blockTable.params.flag = 'E';
					$scope.blockTable.params.externalIdentificationNo = $scope.externalIdentificationNo ;
					$scope.blockTable.search();
					$scope.showExNoDiv = false;
					$scope.showBlockDiv = true;
				}
			}*/
		};
		$scope.blockTable = {
				//checkType : 'radio',
				autoQuery:false,
				params : $scope.queryParam = {
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'deleteBlockCode.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_scenarioTriggerType'],//查找数据字典所需参数
				transDict : ['sceneTriggerObjectLevel_sceneTriggerObjectLevelDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.choose = function(result){
			$scope.itemm = result;
			$scope.showBlockDiv = true;
			$scope.blockTable.params.flag = 'E';
			$scope.blockTable.params.externalIdentificationNo = $scope.itemm.externalIdentificationNo;
			$scope.blockTable.params.externalIdentificationNoOri = $scope.itemm.externalIdentificationNo_ori;
			$scope.blockTable.search();
		};
		//重置
		$scope.reset = function(){
			$scope.blockTable.params.externalIdentificationNo ='';
			$scope.blockTable.params.idNumber ='';
			$scope.blockTable.params.idType= '';
			$scope.blockTable.params.customerNo= '';
			$scope.showBlockDiv = false;
			$('#deleteBlockCode_idNumber').attr('validator','noValidator');
			$('#deleteBlockCode_idNumber').removeClass('waringform');
		};	
		//删除封锁码
		$scope.deletee = function(delItem){
				$scope.deleParamss={};
				$scope.deleParamss.spEventNo = delItem.eventNo;
				$scope.deleParamss.levelCode = delItem.sceneTriggerObjectCode;
				$scope.deleParamss.currencyCode = delItem.currencyCode;
				$scope.deleParamss.operationMode = delItem.operationMode;
				$scope.deleParamss.customerNo = delItem.customerNo;
				$scope.deleParamss.sceneTriggerObject = delItem.sceneTriggerObjectLevel;
				$scope.deleParamss.effectivenessCodeType = delItem.effectivenessCodeType;
				$scope.deleParamss.effectivenessCodeScene = delItem.effectivenessCodeScene;
				if($scope.blockTable.params.externalIdentificationNo){
					$scope.deleParamss.externalIdentificationNo = $scope.blockTable.params.externalIdentificationNo;
				}else if($scope.blockTable.params.idType && $scope.blockTable.params.idNumber){
					$scope.deleParamss.idType = $scope.blockTable.params.idType;
					$scope.deleParamss.idNumber = $scope.blockTable.params.idNumber;
				} 
				$scope.eventNoTrends = "";
				var eventNoStr = delItem.eventNo;
				var eventNores = eventNoStr.substring(7,9);
				var endstr = "";
				if(eventNores == '01'){
					endstr = eventNoStr.replace('.01.','.11.');
				}else if(eventNores == '80'){
					endstr = eventNoStr.replace('.80.','.81.');
				}else if(eventNores == '86'){
					endstr = eventNoStr.replace('.86.','.87.');
				}

				$scope.deleParamss.spEventNo = endstr;
				// $scope.eventNoTrends = "/nonfinanceService/" + endstr;
				jfRest.request('blockCodeMag', 'cusEffUp', $scope.deleParamss).then(function(data) {

				// $scope.eventNoTrends = "/nonfinanceService/" + endstr;
				// jfRest.request('fncTxnMgt', 'trends', $scope.deleParamss,'',$scope.eventNoTrends).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('KHJ600005'));//"删除成功！"
						$scope.blockTable.search();
					}
				});
		};
	});
});
