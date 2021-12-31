'use strict';
define(function(require) {
	var webApp = require('app');
	// 活动清单
	webApp.controller('fraudListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_fraudList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
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
			if(data.value == "1"){//身份证
				$("#fraudList_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#fraudList_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#fraudList_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#fraudList_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#fraudList_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#fraudList_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.showQuotaTable = false;
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
	   	   			if($scope.eventList.search('AUS.OP.01.0006') != -1){    //授权场景新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.IQ.01.0009') != -1){    //授权场景查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.OP.01.0005') != -1){    //授权场景修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		//授权欺诈名单列表
		$scope.itemList = {
				params : $scope.queryParam = {
						authDataSynFlag:"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'fraudManage.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						$scope.showQuotaTable = false;
					}else{
						$scope.showQuotaTable = true;
					}
				}
			};
		$scope.selectList = function() {
			if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined)&&($scope.idType == "" || $scope.idType == null || $scope.idType == undefined)&&($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == null || $scope.itemList.params.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.itemList.data = [] ;
				 $scope.showQuotaTable = false;
			}else{
				if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002')); 
					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));
					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}
				else{
					$scope.itemList.params.idNumber = $scope.idNumber;
					$scope.itemList.params.idType = $scope.idType;
					$scope.itemList.search();
				}
			}
		};
		//删除事件
		$scope.delList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/customerInfo/fraudDel.html', $scope.item, {
				title : T.T('SQJ900005'),
				buttons : [ T.T('F00107'), T.T('F00108') ],
				size : [ '800px', '340px' ],
				callbacks : [$scope.delFraudInfo]
			});
		};
		//删除事件
		$scope.delFraudInfo = function(result) {
			$scope.delItem = $scope.item;
			jfLayer.confirm(T.T('SQJ900005'),function() {
				$scope.delItem.authDataSynFlag = "1";
				$scope.delItem.invalidFlag = "1";
				jfRest.request('fraudManage', 'update', $scope.delItem).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert( T.T('F00037') );
						$scope.delItem = {};
						$scope.safeApply();
						result.cancel();
						$scope.itemList.data ={};
					}
				});
			},function() {
			});
		};
		//修改事件
		$scope.updateList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/customerInfo/fraudUpdateMod.html', $scope.item, {
				title : T.T('SQJ900007'),
				buttons : [  T.T('F00107'), T.T('F00108') ],
				size : [ '800px', '340px' ],
				callbacks : [$scope.updateFraudInfo]
			});
		};
		// 修改信息事件
		$scope.updateFraudInfo = function(result) {
			$scope.fraudupdateInfo = $.parseJSON(JSON.stringify(result.scope.item));
            $scope.fraudupdateInfo.authDataSynFlag = "1";
            $scope.fraudupdateInfo.inputSource = "2";
            $scope.authRespCode = result.scope.authRespCodeU;
            delete $scope.fraudupdateInfo['invalidFlag'];
           jfRest.request('fraudManage', 'update', $scope.fraudupdateInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ900008'));
                	$scope.safeApply();
	    			result.cancel();
	    			$scope.itemList.search();
                }
                else{
                	$scope.safeApply();
	    			result.cancel();
                }
            });
		};
		//新增事件
		$scope.addFraud = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/customerInfo/fraudAddMod.html', '', {
				title : T.T('SQJ900010'),
				buttons : [  T.T('F00107'), T.T('F00108') ],
				size : [ '800px', '340px' ],
				callbacks : [$scope.saveFraudInfo ]
			});
		};
		// 保存信息事件
		$scope.saveFraudInfo = function(result) {
			$scope.fraudAddInfo = $.parseJSON(JSON.stringify(result.scope.fraud));
            $scope.fraudAddInfo.authDataSynFlag = "1";
            $scope.fraudAddInfo.inputSource = "2";
           jfRest.request('fraudManage', 'add', $scope.fraudAddInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ900011'));
                	$scope.safeApply();
	    			result.cancel();
	    			//nmb$scope.itemList.search();
                }
                else{
                	$scope.safeApply();
	    			result.cancel();
                }
            });
		};
	});
	//新增
	webApp.controller('fraudAddModCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.crpndArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_crpnd",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
	});
	//修改
	webApp.controller('fraudUpdateModCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.crpndArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_crpnd",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.authRespCodeU = $scope.item.authRespCode;
	        }
		};
	});
});
