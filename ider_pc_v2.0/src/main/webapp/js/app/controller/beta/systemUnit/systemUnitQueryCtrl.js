'use strict';
define(function(require) {
	var webApp = require('app');
	//系统单元查询及维护
	webApp.controller('systemUnitQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/systemUnit/i18n_systemUnit');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0038') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0037') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0033') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
  			/*系统运行状态 NOR-日间正常状态,EOD-批量处理状态*/
  			$scope.systemOperateArr ={ 
  			   type:"dictData", 
  		       param:{
  		        	"type":"DROPDOWNBOX",
  		        	groupsCode:"dic_systemOperation",
  		        	queryFlag: "children"
  		        },//默认查询条件 
  		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  		        resource:"paramsManage.query",//数据源调用的action 
  		        callback: function(data){
  		        }
  			};     
  		   	/*当前日志标志*/
  			$scope.logFlagArr ={ 
  			   type:"dictData", 
  		       param:{
  		    	   "type":"DROPDOWNBOX",
  		    	   	groupsCode:"dic_logIdentifier",
  		        	queryFlag: "children"
  		        },//默认查询条件 
  		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  		        resource:"paramsManage.query",//数据源调用的action 
  		        callback: function(data){
  		        	//console.log(data)
  		        }
  			};
  		   /*系统环境标识  生产环境-PROD,测试环境-TEST*/
  		   $scope.systemEnvironmentFlagArr ={ 
  			   type:"dictData", 
  		       param:{
  		    	   "type":"DROPDOWNBOX",
  		    	   	groupsCode:"dic_systemIdentification",
  		        	queryFlag: "children"
  		        },//默认查询条件 
  		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  		        resource:"paramsManage.query",//数据源调用的action 
  		        callback: function(data){
  		        	//console.log(data)
  		        }
  			};
  		   /*非处理日批次标识  不执行批次-N,正常执行批次-Y*/
  		   $scope.nonProDayBatchFlagArr ={ 
  			   type:"dictData", 
  		       param:{
  		    	   "type":"DROPDOWNBOX",
  		    	   	groupsCode:"dic_batchIdentification",
  		        	queryFlag: "children"
  		        },//默认查询条件 
  		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  		        resource:"paramsManage.query",//数据源调用的action 
  		        callback: function(data){
  		        	//console.log(data)
  		        }
  			};
  		   	/*加密工具标识  1-3DES, 2-客户比*/	
  		    $scope.encryptArr ={ 
  	  		   type:"dictData", 
  	  	       param:{
  	  	    	   "type":"DROPDOWNBOX",
  	  	    	   	groupsCode:"dic_encryptionIdentifier",
  	  	        	queryFlag: "children"
  	  	        },//默认查询条件 
  	  	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  	  	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  	  	        resource:"paramsManage.query",//数据源调用的action 
  	  	        callback: function(data){
  	  	        	
  	  	        }
  	  		};
  		   	/*PAN是否加密标志  Y-是，N-否*/
  		    $scope.panEncryptArr ={ 
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
  	 	        	//console.log(data)
  	 	        }
  	 		};		
  		$scope.systemProcessDayFlagArr = [{name:T.T('PZJ1300003'),id:"O"},{name:T.T('PZJ1300004'),id:"C"}];
		$scope.systemUnitList = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'systemUnit.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkSystemUnit = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.systemUnitItem = $.parseJSON(JSON.stringify(item));
			var systemProcessDayFlag = $scope.systemUnitItem.systemProcessDayFlag;
			if(systemProcessDayFlag.length!=0 && systemProcessDayFlag.length==7){
				$scope.systemUnitItem.radio1 = systemProcessDayFlag.substring(0,1);
				$scope.systemUnitItem.radio2 = systemProcessDayFlag.substring(1,2);
				$scope.systemUnitItem.radio3 = systemProcessDayFlag.substring(2,3);
				$scope.systemUnitItem.radio4 = systemProcessDayFlag.substring(3,4);
				$scope.systemUnitItem.radio5 = systemProcessDayFlag.substring(4,5);
				$scope.systemUnitItem.radio6 = systemProcessDayFlag.substring(5,6);
				$scope.systemUnitItem.radio7 = systemProcessDayFlag.substring(6,7);
			}
			$scope.modal('/beta/systemUnit/viewSystemUnit.html', $scope.systemUnitItem, {
				title : T.T('PZJ1300012'),
				buttons : [  T.T('F00012') ],
				size : [ '970px', '510px' ],
				callbacks : []
			});
		};
		//修改
		$scope.updateSystemUnit= function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.systemUnitItem = $.parseJSON(JSON.stringify(item));
			var systemProcessDayFlag = $scope.systemUnitItem.systemProcessDayFlag;
			if(systemProcessDayFlag.length!=0 && systemProcessDayFlag.length==7){
				$scope.systemUnitItem.radio1 = systemProcessDayFlag.substring(0,1);
				$scope.systemUnitItem.radio2 = systemProcessDayFlag.substring(1,2);
				$scope.systemUnitItem.radio3 = systemProcessDayFlag.substring(2,3);
				$scope.systemUnitItem.radio4 = systemProcessDayFlag.substring(3,4);
				$scope.systemUnitItem.radio5 = systemProcessDayFlag.substring(4,5);
				$scope.systemUnitItem.radio6 = systemProcessDayFlag.substring(5,6);
				$scope.systemUnitItem.radio7 = systemProcessDayFlag.substring(6,7);
			}
			$scope.modal('/beta/systemUnit/updateSystemUnit.html', $scope.systemUnitItem, {
				title : T.T('PZJ1300013'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '970px', '510px' ],
				callbacks : [$scope.sureUpdateSystemUnit]
			});
		};
		//修改
		$scope.sureUpdateSystemUnit = function (result){
			$scope.systemUnitItem.systemOperateState=result.scope.systemOperateStateUpdate;
			$scope.systemUnitItem.systemEnvironmentFlag=result.scope.systemEnvironmentFlagUpdate;
			$scope.systemUnitItem.currLogFlag=result.scope.currLogFlagUpdate;
			$scope.systemUnitItem.systemProcessDayFlag=result.scope.systemProcessDayFlagUpdate;
			$scope.systemUnitItem.nextLogFlag=result.scope.nextLogFlagUpdate;
			$scope.systemUnitItem.nonProDayBatchFlag=result.scope.nonProDayBatchFlagUpdate;
			$scope.systemUnitItem.encryptInstrument=result.scope.encryptInstrumentUpdate;
			$scope.systemUnitItem.panEncryptFlag=result.scope.panEncryptFlagUpdate;
			$scope.systemUnitItem.systemProcessDayFlag = $scope.systemUnitItem.radio1.concat($scope.systemUnitItem.radio2,$scope.systemUnitItem.radio3,
			$scope.systemUnitItem.radio4,$scope.systemUnitItem.radio5,$scope.systemUnitItem.radio6,$scope.systemUnitItem.radio7);
			$scope.systemUnitItem.holidayNo = result.scope.holidayNoTemp;
			jfRest.request('systemUnit', 'update', $scope.systemUnitItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022') );
					 $scope.safeApply();
					 result.cancel();
					 $scope.systemUnitList.search();
				}
			});
		};
		//新增
		$scope.addSystemUnit = function(){
			$scope.sysInf = {};
			$scope.modal('/beta/systemUnit/systemUnitEst.html', $scope.legalEntityBsf, {
				title : T.T('PZJ1300015'),
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureAddSystemUnitEst]
			});
		};
		$scope.d = {};
		//确认新增
		$scope.sureAddSystemUnitEst = function(result){
			$scope.sysInf = result.scope.sysInf;
			if($scope.sysInf.lastProcessDate>$scope.sysInf.currProcessDate){
				jfLayer.fail(T.T('PZJ1300009'));
				return;
			}
			if($scope.sysInf.lastProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300010'));
				return;
			}
			if($scope.sysInf.currProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300011'));
				return;
			}
			if($scope.sysInf.panEncryptFlag == "Y"){
				if($scope.sysInf.externalHideMethod== undefined 
						||$scope.sysInf.externalHideMethod== null
						||$scope.sysInf.encryptInstrument == undefined
						||$scope.sysInf.encryptInstrument == null){
					jfLayer.fail(T.T('PZJ1300014'));
					return;
				}
			}
			$scope.sysInf.systemProcessDayFlag = $scope.d.radio1.concat($scope.d.radio2,$scope.d.radio3,$scope.d.radio4,$scope.d.radio5,$scope.d.radio6,$scope.d.radio7);
			jfRest.request('systemUnit','save', $scope.sysInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.sysInf = {};
					$scope.d.radio1 = '';
					$scope.d.radio2 = '';
					$scope.d.radio3 = '';
					$scope.d.radio4 = '';
					$scope.d.radio5 = '';
					$scope.d.radio6 = '';
					$scope.d.radio7 = '';
					$scope.safeApply();
					result.cancel();
					$scope.systemUnitList.search();
				}
			});
		};
		//复制
		$scope.copySystemUnit = function(item){
			$scope.systemUnitItem = $.parseJSON(JSON.stringify(item));
			var systemProcessDayFlag = $scope.systemUnitItem.systemProcessDayFlag;
			if(systemProcessDayFlag.length!=0 && systemProcessDayFlag.length==7){
				$scope.systemUnitItem.radio1 = systemProcessDayFlag.substring(0,1);
				$scope.systemUnitItem.radio2 = systemProcessDayFlag.substring(1,2);
				$scope.systemUnitItem.radio3 = systemProcessDayFlag.substring(2,3);
				$scope.systemUnitItem.radio4 = systemProcessDayFlag.substring(3,4);
				$scope.systemUnitItem.radio5 = systemProcessDayFlag.substring(4,5);
				$scope.systemUnitItem.radio6 = systemProcessDayFlag.substring(5,6);
				$scope.systemUnitItem.radio7 = systemProcessDayFlag.substring(6,7);
			}
			$scope.modal('/beta/systemUnit/copySystemUnit.html', $scope.systemUnitItem, {
				title : T.T('PZJ1300019'),      //"复制系统单元信息",
				buttons : [ T.T('F00107') , T.T('F00012')  ],
				size : [ '970px', '510px' ],
				callbacks : [$scope.sureCopySystemUnitrr]
			});
		};
		//确定复制
		$scope.sureCopySystemUnitrr = function (result){
			$scope.sysInf = result.scope.systemUnitItem;
			if($scope.sysInf.lastProcessDate>$scope.sysInf.currProcessDate){
				jfLayer.fail(T.T('PZJ1300009'));
				return;
			}
			if($scope.sysInf.lastProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300010'));
				return;
			}
			if($scope.sysInf.currProcessDate>$scope.sysInf.nextProcessDate){
				jfLayer.fail(T.T('PZJ1300011'));
				return;
			}
			if($scope.sysInf.panEncryptFlag == "Y"){
				if($scope.sysInf.externalHideMethod== undefined 
						||$scope.sysInf.externalHideMethod== null
						||$scope.sysInf.encryptInstrument == undefined
						||$scope.sysInf.encryptInstrument == null){
					jfLayer.fail(T.T('PZJ1300014'));
					return;
				}
			}
			$scope.sysInf.systemProcessDayFlag = $scope.sysInf.radio1.concat($scope.sysInf.radio2,$scope.sysInf.radio3,$scope.sysInf.radio4,$scope.sysInf.radio5,$scope.sysInf.radio6,$scope.sysInf.radio7);
			$scope.sysInf.holidayNo = $scope.sysInf.holidayNoTemp;
			jfRest.request('systemUnit','save', $scope.sysInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032')) ;
					$scope.sysInf = {};
					$scope.d.radio1 = '';
					$scope.d.radio2 = '';
					$scope.d.radio3 = '';
					$scope.d.radio4 = '';
					$scope.d.radio5 = '';
					$scope.d.radio6 = '';
					$scope.d.radio7 = '';
					$scope.safeApply();
					result.cancel();
					$scope.systemUnitList.search();
				}
			});
		};
	});
	webApp.controller('viewSystemUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//假日表编号
		 $scope.holidayNoArr ={ 
	        type:"dynamic", 
	        param:{HolidayNoFlag:"1"},//默认查询条件 
	        text:"holidayNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"holidayNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"holiday.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.holidayNoInfo = $scope.systemUnitItem.holidayNo;
	        }
	    };
		 /*系统运行状态 NOR-日间正常状态,EOD-批量处理状态*/
			$scope.systemOperateArr ={ 
			   type:"dictData", 
		       param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_systemOperation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	//console.log(data)		
		        	$scope.systemOperateStateUpdate=$scope.systemUnitItem.systemOperateState;
		        }
			}; 
		   /*下一日志标志*/
		   $scope.islogFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_logIdentifier",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.nextLogFlagUpdate=$scope.systemUnitItem.nextLogFlag;
		        }
			};
		   /*当前日志标志*/
		  $scope.logFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_logIdentifier",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.currLogFlagUpdate=$scope.systemUnitItem.currLogFlag;
		        }
			};
		   /*系统环境标识  生产环境-PROD,测试环境-TEST*/
		  	$scope.systemEnvironmentFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_systemIdentification",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.systemEnvironmentFlagUpdate=$scope.systemUnitItem.systemEnvironmentFlag;
		        }
			};
		   /*非处理日批次标识  不执行批次-N,正常执行批次-Y*/
		   $scope.nonProDayBatchFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_batchIdentification",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.nonProDayBatchFlagUpdate=$scope.systemUnitItem.nonProDayBatchFlag;
		        }
			};
		   	/*加密工具标识  1-3DES, 2-客户比*/	
		   	$scope.encryptArr ={ 
	  		   type:"dictData", 
	  	       param:{
	  	    	   "type":"DROPDOWNBOX",
	  	    	   	groupsCode:"dic_encryptionIdentifier",
	  	        	queryFlag: "children"
	  	        },//默认查询条件 
	  	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	  	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	  	        resource:"paramsManage.query",//数据源调用的action 
	  	        callback: function(data){
	  	        	$scope.encryptInstrumentUpdate=$scope.systemUnitItem.encryptInstrument;
	  	        }
	  		};
		   	/*PAN是否加密标志  Y-是，N-否*/
		   	$scope.panEncryptArr ={ 
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
	        		$scope.panEncryptFlagUpdate=$scope.systemUnitItem.panEncryptFlag;
	 	        }
	 		};
	});
	webApp.controller('updateSystemUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {
		//$scope.systemProcessDayArray = [{id: "O",name: "处理日"},{id: "C",name: "非处理日"}];
		//假日表编号
		 $scope.holidayNoArr ={ 
	        type:"dynamic", 
	        param:{HolidayNoFlag:"1"},//默认查询条件 
	        text:"holidayNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"holidayNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"holiday.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.holidayNoTemp = $scope.systemUnitItem.holidayNo;
	        }
	    };	
		 /*系统运行状态 NOR-日间正常状态,EOD-批量处理状态*/
			$scope.systemOperateArr ={ 
			   type:"dictData", 
		       param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_systemOperation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.systemOperateStateUpdate=$scope.systemUnitItem.systemOperateState;
		        }
			}; 
		   /*下一日志标志*/
		   $scope.islogFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_logIdentifier",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.nextLogFlagUpdate=$scope.systemUnitItem.nextLogFlag;
		        }
			};
		   /*当前日志标志*/
		  $scope.logFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_logIdentifier",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.currLogFlagUpdate=$scope.systemUnitItem.currLogFlag;
		        }
			};
		   /*系统环境标识  生产环境-PROD,测试环境-TEST*/
		   $scope.systemEnvironmentFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_systemIdentification",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.systemEnvironmentFlagUpdate=$scope.systemUnitItem.systemEnvironmentFlag;
		        }
			};
		   /*非处理日批次标识  不执行批次-N,正常执行批次-Y*/
		   $scope.nonProDayBatchFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_batchIdentification",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.nonProDayBatchFlagUpdate=$scope.systemUnitItem.nonProDayBatchFlag;
		        }
			};
		   	/*加密工具标识  1-3DES, 2-客户比*/	
		   	$scope.encryptArr ={ 
	  		   type:"dictData", 
	  	       param:{
	  	    	   "type":"DROPDOWNBOX",
	  	    	   	groupsCode:"dic_encryptionIdentifier",
	  	        	queryFlag: "children"
	  	        },//默认查询条件 
	  	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	  	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	  	        resource:"paramsManage.query",//数据源调用的action 
	  	        callback: function(data){
	  	        	$scope.encryptInstrumentUpdate=$scope.systemUnitItem.encryptInstrument;
	  	        }
	  		};
		   	/*PAN是否加密标志  Y-是，N-否*/
		   	$scope.panEncryptArr ={ 
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
 	        		$scope.panEncryptFlagUpdate=$scope.systemUnitItem.panEncryptFlag;
	 	        }
	 		};
		});
	//复制
	webApp.controller('copySystemUnitCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$timeout,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.passWohsCopy = false; 
		//假日表编号
		 $scope.holidayNoArr ={ 
	        type:"dynamic", 
	        param:{HolidayNoFlag:"1"},//默认查询条件 
	        text:"holidayNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"holidayNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"holiday.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.systemUnitItem.holidayNoTemp = $scope.systemUnitItem.holidayNo;
	        }
	    };
		 /*系统运行状态 NOR-日间正常状态,EOD-批量处理状态*/
			$scope.systemOperateArr ={ 
			   type:"dictData", 
		       param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_systemOperation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.systemOperateStateUpdate=$scope.systemUnitItem.systemOperateState;
		        }
			}; 
		   /*下一日志标志*/
		   $scope.islogFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_logIdentifier",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.nextLogFlagUpdate=$scope.systemUnitItem.nextLogFlag;
		        }
			};
		   /*当前日志标志*/
		  $scope.logFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_logIdentifier",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.currLogFlagUpdate=$scope.systemUnitItem.currLogFlag;
		        }
			};
		   /*系统环境标识  生产环境-PROD,测试环境-TEST*/
		   $scope.systemEnvironmentFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_systemIdentification",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.systemEnvironmentFlagUpdate=$scope.systemUnitItem.systemEnvironmentFlag;
		        }
			};
		   /*非处理日批次标识  不执行批次-N,正常执行批次-Y*/
		   $scope.nonProDayBatchFlagArr ={ 
			   type:"dictData", 
		       param:{
		    	   "type":"DROPDOWNBOX",
		    	   	groupsCode:"dic_batchIdentification",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.nonProDayBatchFlagUpdate=$scope.systemUnitItem.nonProDayBatchFlag;
		        }
			};
		   	/*加密工具标识  1-3DES, 2-客户比*/	
		   	$scope.encryptArr ={ 
	  		   type:"dictData", 
	  	       param:{
	  	    	   "type":"DROPDOWNBOX",
	  	    	   	groupsCode:"dic_encryptionIdentifier",
	  	        	queryFlag: "children"
	  	        },//默认查询条件 
	  	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	  	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	  	        resource:"paramsManage.query",//数据源调用的action 
	  	        callback: function(data){
	  	        	$scope.encryptInstrumentUpdate=$scope.systemUnitItem.encryptInstrument;
	  	        }
	  		};
		   	/*PAN是否加密标志  Y-是，N-否*/
		   	$scope.panEncryptArr ={ 
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
	        		$scope.panEncryptFlagUpdate=$scope.systemUnitItem.panEncryptFlag;
	        		if($scope.systemUnitItem.panEncryptFlag == 'N'){
	        			$scope.passWohsCopy = false;
	        		}else{
	        			$scope.passWohsCopy = true;
	        		}
	 	        }
	 		};
		  //是否加密事件
			 var form = layui.form;
			form.on('select(encryptFlagCopy)',function(event){
				if(event.value == "Y"){
					$scope.passWohsCopy = true;
					$scope.systemUnitItem.externalHideMethod="888888*********8888";
				}else{
					$scope.systemUnitItem.externalHideMethod="";
					$scope.systemUnitItem.encryptInstrument="";
					$scope.passWohsCopy = false;
				}
			});
	});
	//系统单元建立
	webApp.controller('systemUnitEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/systemUnit/i18n_systemUnit');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.sysInf = {};
		$scope.passWohs = false;
		/*系统运行状态 NOR-日间正常状态,EOD-批量处理状态*/
		$scope.systemOperateArr ={ 
		   type:"dictData", 
	       param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_systemOperation",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};     
	   	/*当前日志标志*/
	   $scope.logFlagArr ={ 
		   type:"dictData", 
	       param:{
	    	   "type":"DROPDOWNBOX",
	    	   	groupsCode:"dic_logIdentifier",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
	   $scope.systemProcessDayFlagArr = [{name:T.T('PZJ1300003'),id:"O"},{name:T.T('PZJ1300004'),id:"C"}];
		/*系统环境标识  生产环境-PROD,测试环境-TEST*/
	   $scope.systemEnvironmentFlagArr ={ 
		   type:"dictData", 
	       param:{
	    	   "type":"DROPDOWNBOX",
	    	   	groupsCode:"dic_systemIdentification",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
	   /*非处理日批次标识  不执行批次-N,正常执行批次-Y*/
	   $scope.nonProDayBatchFlagArr ={ 
		   type:"dictData", 
	       param:{
	    	   "type":"DROPDOWNBOX",
	    	   	groupsCode:"dic_batchIdentification",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
	   	/*加密工具标识  1-3DES, 2-客户比*/	
	   	$scope.encryptArr ={ 
  		   type:"dictData", 
  	       param:{
  	    	   "type":"DROPDOWNBOX",
  	    	   	groupsCode:"dic_encryptionIdentifier",
  	        	queryFlag: "children"
  	        },//默认查询条件 
  	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  	        resource:"paramsManage.query",//数据源调用的action 
  	        callback: function(data){
  	        }
  		};
	   	/*PAN是否加密标志  Y-是，N-否*/
	   	$scope.panEncryptArr ={ 
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
	   	//假日表编号
		 $scope.holidayNoArr ={ 
	        type:"dynamic", 
	        param:{HolidayNoFlag:"1"},//默认查询条件 
	        text:"holidayNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"holidayNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"holiday.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//是否加密事件
		 var form = layui.form;
		form.on('select(encryptFlag)',function(event){
			if(event.value == "Y"){
				$scope.passWohs = true;
				$scope.sysInf.externalHideMethod="888888*********8888";
			}else{
				$scope.sysInf.externalHideMethod="";
				$scope.sysInf.encryptInstrument="";
				$scope.passWohs = false;
			}
		});
	});
});
