'use strict';
define(function(require) {

	var webApp = require('app');

	// 活动清单
	webApp.controller('exceptionListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $timeout,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_exceptionList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		
		$scope.resultInfoV = false;
		$scope.resultInfoM = false;
		
		$scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 
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
	   	   			if($scope.eventList.search('AUS.VI.01.0302') != -1){    //新增 visa
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.IQ.01.0008') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.MC.01.0302') != -1){    //新增mc
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
  			
  		//动态请求下拉框 证件类型
			$scope.cardAssociationsArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_cardAssociations",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
		//授权例外名单查询列表
		$scope.selException = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.cardAssociations == "" || $scope.cardAssociations == undefined || $scope.cardAssociations == null)){
				jfLayer.fail(T.T('F00076'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}else{
				$scope.param = {
						"authDataSynFlag":'1',
						"externalIdentificationNo":$scope.externalIdentificationNo,
						"cardAssociations":$scope.cardAssociations
					};
				 jfRest.request('exceptionManage', 'query', $scope.param).then(function(data) {
		        	    
		                if (data.returnCode == '000000') {
		                	if(data.returnData){
		                		$scope.cwbZoneCodesList = [];
			                	$scope.cwbstr = "";
			                	$scope.item = data.returnData.authSpecContrlDto;
			                	$scope.cwbZoneCodes = data.returnData.authSpecContrlDto.cwbZoneCode;
			                	if($scope.cwbZoneCodes){
			                		for(var i=0;i<$scope.cwbZoneCodes.length;i++){
			                			$scope.cwbstr = {'cwbZoneCode':$scope.cwbZoneCodes.substr(i,1)};
			                			$scope.cwbZoneCodesList.push($scope.cwbstr);
			                		}
			                	}
			    				if($scope.cardAssociations == 'V'){
			    					$scope.resultInfoV = true;
				    				$scope.resultInfoM = false;
			    				}else if($scope.cardAssociations == 'M'){
			    					$scope.resultInfoM = true;
			    					$scope.resultInfoV = false;
			    				}
		                	}else{
		                		jfLayer.fail(T.T('SQJ2600001'));
		                	}
		                }
		            });
			}
		};
		$scope.closeInfoV = function(){
			$scope.resultInfoV = false;
		};
		$scope.closeInfoM = function(){
			$scope.resultInfoM = false;
		};
		
		//维护
		$scope.updateException = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.cardAssociations == "" || $scope.cardAssociations == undefined || $scope.cardAssociations == null)){
				jfLayer.fail(T.T('SQJ2600012'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}else{
				$scope.param = {
						"authDataSynFlag":'1',
						"externalIdentificationNo":$scope.externalIdentificationNo,
						"cardAssociations":$scope.cardAssociations
					};
				 jfRest.request('exceptionManage', 'query', $scope.param).then(function(data) {
		        	    
		                if (data.returnCode == '000000') {
		                	$scope.cwbstr = "";
		                	$scope.itemU = data.returnData.authSpecContrlDto;
		                	if(data.returnData){
			                	$scope.itemU.cwbZoneCodesList = [];
			                	$scope.cwbZoneCodes = data.returnData.authSpecContrlDto.cwbZoneCode;
			                	if($scope.cwbZoneCodes){
			                		for(var i=0;i<$scope.cwbZoneCodes.length;i++){
			                			$scope.cwbstr = {'cwbZoneCode':$scope.cwbZoneCodes.substr(i,1)};
			                			$scope.itemU.cwbZoneCodesList.push($scope.cwbstr);
			                		}
			                	}
			    				if($scope.cardAssociations == 'V'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionUpdateModV.html', $scope.itemU, {
			    						title : T.T('SQJ2600011'),
			    						buttons : [ T.T('F00107'), T.T('F00108') ],
			    						size : [ '900px', '580px' ],
			    						callbacks : [$scope.updateInfoV]
			    					});
			    				}else if($scope.cardAssociations == 'M'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionUpdateModM.html', $scope.itemU, {
			    						title : T.T('SQJ2600011'),
			    						buttons : [ T.T('F00107'), T.T('F00108')],
			    						size : [ '900px', '480px' ],
			    						callbacks : [$scope.updateInfoM]
			    					});
			    				}
			                }else{
		                		jfLayer.fail(T.T('SQJ2600001'));
		                	}
		                }
		            });
			}
		};
		//维护V
		$scope.updateInfoV = function(result) {
			var cwbZoneCodeStrU = "";
			$scope.itemU.authFlag = "1";
			$scope.itemU.authDataSynFlag = "1";
			$scope.flagU = true;
			if(result.scope.czcListU.length > 0){
				for(var i=0;i<result.scope.czcListU.length;i++){
					if(result.scope.czcListU[i].cwbZoneCode == "" || result.scope.czcListU[i].cwbZoneCode == null || result.scope.czcListU[i].cwbZoneCode == undefined){
						jfLayer.fail(T.T('SQJ2600024'));
						$scope.flagU = false;
						break;
					}else{
						cwbZoneCodeStrU += result.scope.czcListU[i].cwbZoneCode;
						$scope.flagU = true;
					}
				}
			}
			$scope.itemU.cwbZoneCode = cwbZoneCodeStrU;
			if($scope.flagU){
	           jfRest.request('exceptionManage', 'addexceV', $scope.itemU).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('SQJ2600009'));
	                	result.scope.mdmInfoFormV.$setPristine();
	            		$scope.safeApply();
	        			result.cancel();
	        			$scope.selException();
	                }
	            });
			}
		};
		//维护M
		$scope.updateInfoM = function(result) {
			$scope.itemU.authFlag = "1";
			$scope.itemU.authDataSynFlag = "1";
			$scope.itemU.fileId  = result.scope.fileIdU;
			$scope.itemU.contrlReason = result.scope.contrlReasonU;
           jfRest.request('exceptionManage', 'addexceM', $scope.itemU).then(function(data) {
        	    
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ2600009'));
                	result.scope.mdmInfoFormM.$setPristine();
            		$scope.safeApply();
        			result.cancel();
        			$scope.selException();
                }
            });
		};
		//新增事件
		$scope.addException = function() {
			if($scope.cardAssociations == '' || $scope.cardAssociations == null || $scope.cardAssociations == undefined){
				jfLayer.fail(T.T('SQJ2600013'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}
			else{
				$scope.itemAddM = {};
				$scope.itemAddM.externalIdentificationNo = $scope.externalIdentificationNo;
				if($scope.cardAssociations == 'V'){
					// 页面弹出框事件(弹出页面)
					$scope.modal('/authorization/customerInfo/exceptionAddModV.html', $scope.itemAddM, {
						title : T.T('SQJ2600008'),
						buttons : [ T.T('F00107'), T.T('F00108') ],
						size : [ '900px', '580px' ],
						callbacks : [$scope. saveexceVInfo]
					});
				}else if($scope.cardAssociations == 'M'){
					// 页面弹出框事件(弹出页面)
					$scope.modal('/authorization/customerInfo/exceptionAddModM.html', $scope.itemAddM, {
						title : T.T('SQJ2600008'),
						buttons : [ T.T('F00107'), T.T('F00108') ],
						size : [ '900px', '480px' ],
						callbacks : [$scope. saveexceMInfo]
					});
				}else{
					jfLayer.fail(T.T('SQJ2600007'));
				}
			}
		};
    	// 新增信息事件
		$scope.exceV = {};
		$scope.saveexceVInfo = function(result) {
			var cwbZoneCodeStr = "";
			$scope.exceV.authFlag = "0";
			$scope.exceV.authDataSynFlag = "1";
			$scope.flagD = true;
			if(result.scope.czcList.length > 0){
				for(var i=0;i<result.scope.czcList.length;i++){
					if(result.scope.czcList[i].cwbZoneCode1 == "" || result.scope.czcList[i].cwbZoneCode1 == null || result.scope.czcList[i].cwbZoneCode1 == undefined){
						jfLayer.fail(T.T('SQJ2600024'));
						$scope.flagD = false;
						break;
					}else{
						$scope.flagD = true;
						cwbZoneCodeStr += result.scope.czcList[i].cwbZoneCode1;
					}
				}
			}
			$scope.exceV.cwbZoneCode = cwbZoneCodeStr;
			if($scope.flagD){
				jfRest.request('exceptionManage', 'addexceV', $scope.exceV).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('SQJ2600005'));
	                	$scope.exceV = {};
	                	result.scope.mdmInfoFormV.$setPristine();
	            		$scope.safeApply();
	        			result.cancel();
	        			$scope.selException();
	                }
	            });
			}
		};
		
    	// 新增信息事件
		$scope.exceM = {};
		$scope.saveexceMInfo = function(result) {
			$scope.exceM.authFlag = "0";
			$scope.exceM.authDataSynFlag = "1";
			$scope.exceM.externalIdentificationNo = result.scope.externalIdentificationNo;
			$scope.exceM.cardAssociations = result.scope.cardAssociations;
           jfRest.request('exceptionManage', 'addexceM', $scope.exceM).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ2600005'));
                	$scope.exceM = {};
                	result.scope.mdmInfoFormM.$setPristine();
            		$scope.safeApply();
        			result.cancel();
        			$scope.selException();
                }
            });
		};
		
		//删除
		$scope.delException = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.cardAssociations == "" || $scope.cardAssociations == undefined || $scope.cardAssociations == null)){
				jfLayer.fail(T.T('SQJ2600004'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}else{
				$scope.param = {
						"authDataSynFlag":'1',
						"externalIdentificationNo":$scope.externalIdentificationNo,
						"cardAssociations":$scope.cardAssociations
					};
				 jfRest.request('exceptionManage', 'query', $scope.param).then(function(data) {
		        	    
		                if (data.returnCode == '000000') {
		                	$scope.cwbstr = "";
		                	$scope.item = data.returnData.authSpecContrlDto;
		                	if(data.returnData){
		                		$scope.item.cwbZoneCodesList = [];
			                	$scope.cwbZoneCodes = data.returnData.authSpecContrlDto.cwbZoneCode;
			                	if($scope.cwbZoneCodes){
			                		for(var i=0;i<$scope.cwbZoneCodes.length;i++){
			                			$scope.cwbstr = {'cwbZoneCode':$scope.cwbZoneCodes.substr(i,1)};
			                			$scope.item.cwbZoneCodesList.push($scope.cwbstr);
			                		}
			                	}
			    				if($scope.cardAssociations == 'V'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionDelModV.html', $scope.item, {
			    						title : T.T('SQJ2600003'),
			    						buttons : [ T.T('F00107'), T.T('F00108') ],
			    						size : [ '900px', '480px' ],
			    						callbacks : [$scope. delInfoV]
			    					});
			    				}else if($scope.cardAssociations == 'M'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionDelModM.html', $scope.item, {
			    						title : T.T('SQJ2600003'),
			    						buttons : [ T.T('F00107'), T.T('F00108') ],
			    						size : [ '900px', '480px' ],
			    						callbacks : [$scope. delInfoM]
			    					});
			    				}
			                }else{
		                		jfLayer.fail(T.T('SQJ2600001'));
		                	}
		                }
		            });
			}
		};
		//删除V
		$scope.delInfoV = function(result){
			jfLayer.confirm(T.T('SQJ2600002'),function() {
				$scope.param = {
					"authDataSynFlag":'1',
					"authFlag":'2',
					"externalIdentificationNo":$scope.item.externalIdentificationNo,
					"cardAssociations":$scope.item.cardAssociations
				};
			 jfRest.request('exceptionManage', 'addexceV', $scope.param).then(function(data) {
	        	    
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00037'));
	                	$scope.safeApply();
	        			result.cancel();
	        			$scope.resultInfoV = false;
	        			$scope.resultInfoM = false;
	                }
	            });
			},function() {
				
			});
		};
		//删除M
		$scope.delInfoM = function(result){
			jfLayer.confirm(T.T('SQJ2600002'),function() {
				$scope.param = {
					"authDataSynFlag":'1',
					"authFlag":'2',
					"externalIdentificationNo":$scope.item.externalIdentificationNo,
					"cardAssociations":$scope.item.cardAssociations
				};
			 jfRest.request('exceptionManage', 'addexceM', $scope.param).then(function(data) {
	        	    
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00037'));
	                	$scope.safeApply();
	        			result.cancel();
	        			$scope.resultInfoV = false;
	        			$scope.resultInfoM = false;
	                }
	            });
			},function() {
				
			});
		}
	});
	
	// 新增V
	webApp.controller('exceptionAddVCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.exceV.externalIdentificationNo = $scope.itemAddM.externalIdentificationNo;
		$scope.exceV.cardAssociations = 'V';
		$scope.addressInfo = false;
		//定义地区码--------默认值
		$scope.czcBtn = false;
		$scope.czcList = "";
		$scope.info1 = false;
		$scope.info2 = false;
		$scope.getInfo1 = function(){
			$scope.info1 = true;
			$scope.info2 = false;
		};
		$scope.closeInfo1 = function(){
			$scope.info1 = false;
			$scope.info2 = false;
		};
		$scope.getInfo2 = function(){
			$scope.info1 = false;
			$scope.info2 = true;
		};
		$scope.closeInfo2 = function(){
			$scope.info1 = false;
			$scope.info2 = false;
			$scope.actCodeInfo = $scope.exceV.actCode;
			if($scope.actCodeInfo == '04' || $scope.actCodeInfo == '07' || $scope.actCodeInfo == '41' || $scope.actCodeInfo == '43'){
				$scope.addressInfo = true;
				$scope.czcBtn = true;
			}
			else{
				$scope.addressInfo = false;
				$scope.czcBtn = false;
				$scope.czcList = "";
			}
		};
	 	//地区码--增加
	 	$scope.czcAdd = function(){
	 		if($scope.czcList.length == 8){
	 			$scope.czcBtn = false;
	 			$scope.czcList.splice($scope.czcList.length,0,{});
	 		}
	 		else{
	 			$scope.czcBtn = true;
	 			if($scope.czcList == 0){
		 			$scope.czcList = [{}];
		 		}
		 		else{
		 			$scope.czcList.splice($scope.czcList.length,0,{});
		 		}
	 		}
	 	};
	 	//删除地区码
	 	$scope.czcDel = function(e,$index){
	 		$scope.czcList.splice($index,1);
	 		if($scope.czcList.length > 8){
	 			$scope.czcBtn = false;
	 		}
	 		else{
	 			$scope.czcBtn = true;
	 		}
	 	}
	});
	// 新增M
	webApp.controller('exceptionAddMCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.externalIdentificationNo = $scope.itemAddM.externalIdentificationNo;
		$scope.cardAssociations = 'M';
		//默认管控原因的下拉菜单
		$scope.contrlRArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_contrlR",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//动态请求下拉框
		$scope.fileArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_fileType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		$scope.infoV = false;
		var form = layui.form;
		form.on('select(getInfoV)',function(){
			if($scope.exceM.contrlReason == "V"){
				$scope.infoV = true;
			}
			else{
				$scope.infoV = false;
				$scope.exceM.vipAmount = "";
			}
				
		});
	});
	// 删除V
	webApp.controller('exceptionListCtrlD', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		 
		$scope.cwbZoneCodesdList = $scope.item.cwbZoneCodesList;
	});
	// 维护V
	webApp.controller('exceptionListCtrlU', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.addressInfoU = false;
		//定义地区码--------默认值
		$scope.czcBtnU = false;
		$scope.czcListU = "";
		if($scope.itemU.actCode == '04' || $scope.itemU.actCode == '07' || $scope.itemU.actCode == '41' || $scope.itemU.actCode == '43'){
			if($scope.itemU.cwbZoneCodesList){
				$scope.addressInfoU = true;
				$scope.czcListU = $scope.itemU.cwbZoneCodesList;
				if($scope.czcListU.length == 9){
					$scope.czcBtnU = false;
				}else{
					$scope.czcBtnU = true;
				}
			}
			else{
				$scope.addressInfoU = false;
				$scope.czcListU = "";
			}
		}
		else{
			$scope.addressInfoU = false;
			$scope.czcBtnU = false;
			$scope.czcListU = "";
		}
		$scope.infoU1 = false;
		$scope.infoU2 = false;
		$scope.getInfoU1 = function(){
			$scope.infoU1 = true;
			$scope.infoU2 = false;
		};
		$scope.closeInfoU1 = function(){
			$scope.infoU1 = false;
			$scope.infoU2 = false;
		};
		$scope.getInfoU2 = function(){
			$scope.infoU1 = false;
			$scope.infoU2 = true;
		};
		$scope.closeInfoU2 = function(){
			$scope.infoU1 = false;
			$scope.infoU2 = false;
			$scope.actCodeInfoU = $scope.itemU.actCode;
			if($scope.actCodeInfoU == '04' || $scope.actCodeInfoU == '07' || $scope.actCodeInfoU == '41' || $scope.actCodeInfoU == '43'){
				$scope.addressInfoU = true;
				if($scope.czcListU.length < 9){
		 			$scope.czcBtnU = true;
		 		}
		 		else{
		 			$scope.czcBtnU = false;
		 		}
			}
			else{
				$scope.addressInfoU = false;
				$scope.czcBtnU = false;
				$scope.czcListU = "";
			}
		};
		//地区码--增加
	 	$scope.czcAddUpdate = function(){
	 		if($scope.czcListU.length == 8){
	 			$scope.czcBtnU = false;
	 			$scope.czcListU.splice($scope.czcListU.length,0,{});
	 		}
	 		else{
	 			$scope.czcBtnU = true;
	 			if($scope.czcListU == 0){
		 			$scope.czcListU = [{}];
		 		}
		 		else{
		 			$scope.czcListU.splice($scope.czcListU.length,0,{});
		 		}
	 		}
	 	};
	 	//删除地区码
	 	$scope.czcuDel = function(e,$index){
	 		$scope.czcListU.splice($index,1);
	 		if($scope.czcListU.length < 9){
	 			$scope.czcBtnU = true;
	 		}
	 		else{
	 			$scope.czcBtnU = false;
	 		}
	 	}
	});
	// 维护M
	webApp.controller('exceptionListCtrlMU', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//默认管控原因的下拉菜单
		$scope.contrlRArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_contrlR",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.contrlReasonU = $scope.itemU.contrlReason;
	        }
		};
		//动态请求下拉框
		$scope.fileArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_fileType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.fileIdU = $scope.itemU.fileId;
	        }
		};
		$scope.infoV = false;
		if($scope.itemU.contrlReason == "V"){
			$scope.infoV = true;
		}
		else{
			$scope.infoV = false;
			$scope.itemU.vipAmount = "";
		}
		var form = layui.form;
		form.on('select(getInfoU)',function(){
			if($scope.itemU.contrlReason == "V"){
				$scope.infoV = true;
			}
			else{
				$scope.infoV = false;
				$scope.itemU.vipAmount = "";
			}
				
		});
	});
});
