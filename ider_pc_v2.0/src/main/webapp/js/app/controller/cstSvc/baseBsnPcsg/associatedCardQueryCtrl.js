'use strict';
define(function(require) {
	var webApp = require('app');
	// 关联套卡查询
	webApp.controller('associatedCardQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_rlTmMkCrd');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
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
    	//媒介领取标志
//		$scope.mediaDispatchMethodArr = [{name :'已领取',id : 'Y'},{name : '未领取' ,id : 'N'}];
		//密码函领取标志
//		$scope.pinDispatchMethodArr = [{name :'已领取',id : 'Y'},{name : '未领取' ,id : 'N'}];
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
		// 主附标识
		$scope.mainAttachmentArray = [ {
			name : '主卡',
			id : '1'
		}, {
			name : '附属卡',
			id : '2'
		} ];
		$scope.stateArray = [ {name : T.T('KHJ5100001'),id : '1'}, //'新发'
		                      {name : T.T('KHJ5100002'),id : '2'},//'活跃'
		                      {name : T.T('KHJ5100003'),id : '3'},//'非活跃'
		                      {name : T.T('KHJ5100004'),id : '4'},//'已转出'
		                      {name : T.T('KHJ5100005'),id : '5'},//'换卡未激活'
		                      {name : T.T('KHJ5100006'),id : '8'},//'关闭'
		                      {name : T.T('KHJ5100007'),id : '9'}];//'待删除'
		//激活标识
		/*$scope.activationFlag = [ {
			name : '已激活',//'已激活',
			id : '1'
		}, {
			name : '新发卡未激活',//'新发卡未激活',
			id : '2'
		}, {
			name : '毁卡补发/续卡未激活',//'毁卡补发/续卡未激活',
			id : '3'
		}, {
			name : '转卡未激活',//'转卡未激活',
			id : '4'
		}, {
			name : '无需激活',//'无需激活',
			id : '5'
		},{
			name : "提前续卡未激活",//'提前续卡未激活',
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
			name : '人工激活',//'人工激活',
			id : '1'
		}, {
			name : '无须激活',//'无须激活',
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
		//客户信息
		$scope.rlTmMkCrdInfo = { };
		//查询参数
		$scope.searchParams = {};
		$scope.showAssociatedCardDiv = false;//隐藏媒介列表
		$scope.cstProductTable = {
			params : {
				"pageSize" : 10,
				"indexNo" : 0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryProduct',// 列表的资源
			autoQuery:false,
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 客户媒介信息
		$scope.associatedCardList = {
			checkType : 'radio',
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'associatedCardQuery.query',// 列表的资源
			autoQuery : false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainAttachedFlag','dic_invalidFlagYN'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.showAssociatedCardDiv = true;
					if(data.returnData){
						if(data.returnData.rows == null || data.returnData.rows == undefined ){
							data.returnData.rows = [];
						}
					}else {
						jfLayer.alert('暂无数据！');
					}
				}else {
					$scope.showAssociatedCardDiv = false;
				}
			},
			checkBack: function(row){
				$scope.queryMedaiBaeParams={
						externalIdentificationNo:$scope.searchParams.externalIdentificationNo,
						mediaUnitCode: row.mediaUnitCode,
				};
				//查詢媒介基本信息
				$scope.queryMedaiBaeInf($scope.queryMedaiBaeParams);
			}
		};
		//查询执行函数
		$scope.searchHandlee = function(){
			$scope.params = {
					externalIdentificationNo:$scope.searchParams.externalIdentificationNo
			};
			jfRest.request('cstInfQuery', 'queryInf', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows[0].customerNo){
						$scope.rlTmMkCrdInfo = data.returnData.rows[0];
						$scope.associatedCardList.params.externalIdentificationNo = $scope.searchParams.externalIdentificationNo;
						$scope.associatedCardList.search();
					}else {
						jfLayer.alert(T.T('KHJ900002'));//"抱歉，没有此用户！"
						$scope.showAssociatedCardDiv = false;
					}
				}else{
					$scope.showAssociatedCardDiv = false;
				}
			});
		};
		//查询媒介基本信息
		$scope.queryMedaiBaeInf = function(params){
			jfRest.request('mediaLoss', 'queryMedaiBaseInf',params).then(function(data) {
				if(data.returnCode == "000000"){
					$scope.isShowMediaInfDiv = true;
					$scope.mediaDetailInfo = data.returnData.rows[0];
					if($scope.mediaDetailInfo.invalidFlag == 'Y'){
						$scope.mediaDetailInfo.invalidFlagStr = '有效';
					}else if($scope.mediaDetailInfo.invalidFlag == 'N'){
						$scope.mediaDetailInfo.invalidFlagStr = '无效';
                    }
                    if ($scope.mediaDetailInfo.invalidFlag == 'N') {
						$scope.mediaDetailInfo.invalidFlagStr = "无效";//"无效";
						if ($scope.mediaDetailInfo.invalidReason == 'TRF') {
							$scope.mediaDetailInfo.invalidReasonStr = "转卡";//"转卡";
						} else if ($scope.mediaDetailInfo.invalidReason == 'EXP') {
							$scope.mediaDetailInfo.invalidReasonStr = "到期";//"到期";
						} else if ($scope.mediaDetailInfo.invalidReason == 'BRK') {
							$scope.mediaDetailInfo.invalidReasonStr = "毁损";//"毁损";
						} else if ($scope.mediaDetailInfo.invalidReason == 'CLS') {
							$scope.mediaDetailInfo.invalidReasonStr = "关闭";//"关闭";
						}else if ($scope.mediaDetailInfo.invalidReason == 'PNA') {
							$scope.mediaDetailInfo.invalidReasonStr = "提前续卡";//"提前续卡";
						}
					} else {
						$scope.mediaDetailInfo.invalidFlagStr = "有效";//"有效";
                    }
                    if($scope.mediaDetailInfo.mainSupplyIndicator == '1'){
						$scope.mediaDetailInfo.mainSupplyIndicatorStr = '主卡';
					}else if($scope.mediaDetailInfo.mainSupplyIndicator == '2'){
						$scope.mediaDetailInfo.mainSupplyIndicatorStr = '附属卡';
                    }
                    //媒介对象代码
					$scope.mediaDetailInfo.mediaObjectCodeTrans = $scope.mediaDetailInfo.mediaObjectCode + $scope.mediaDetailInfo.mediaObjectDesc;
					//产品对象代码
					$scope.mediaDetailInfo.productObjectCodeTrans = $scope.mediaDetailInfo.productObjectCode + $scope.mediaDetailInfo.productDesc;
				}else {
					$scope.isShowMediaInfDiv = false;
                }
            });
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
		//重置
		$scope.reset = function(){
			$scope.searchParams.idNumber = '';
			$scope.searchParams.externalIdentificationNo = '';
			$scope.searchParams.idType= '';
			$('#rlTmMkCrd_idNumber').attr('validator','noValidator');
			$('#rlTmMkCrd_idNumber').removeClass('waringform');
			$scope.showAssociatedCardDiv = false;
		}
	});
});
