'use strict';
define(function(require) {
	var webApp = require('app');
	// 构建清单
	webApp.controller( 'elmListCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, 
			jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		 $scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
   			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
   				if(data.returnCode == '000000'){
   					if(data.returnData != null || data.returnData != ""){
   	   					for(var i=0;i<data.returnData.length;i++){
   	   	   					$scope.eventList += data.returnData[i].eventNo + ",";
   	   	   				}
   			   	   		if($scope.eventList.search('COS.IQ.02.0007') != -1){    //查询
   		   					$scope.selBtnFlag = true;
   		   				}
   		   				else{
   		   					$scope.selBtnFlag = false;
   		   				}
   				   	   	if($scope.eventList.search('COS.UP.02.0007') != -1){    //修改
   		   					$scope.updBtnFlag = true;
   		   				}
   		   				else{
   		   					$scope.updBtnFlag = false;
   		   				}
   				   	   	if($scope.eventList.search('COS.AD.02.0007') != -1){    //新增
   		   					$scope.addBtnFlag = true;
   		   				}
   		   				else{
   		   					$scope.addBtnFlag = false;
   		   				}
   	   				}
   				}
   			});
			$scope.artiListTable = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'elmList.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue'],//查找数据字典所需参数
				transDict : ['instanDimen1_instanDimen1Desc','instanDimen2_instanDimen2Desc','instanDimen3_instanDimen3Desc','instanDimen4_instanDimen4Desc','instanDimen5_instanDimen5Desc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			// 自定义下拉框
			$scope.artiTypeArray = [ {
				name : T.T('PZJ300001') ,
				id : 'A'
			}, {
				name : T.T('PZJ300002'),
				id : 'B'
			}, {
				name : T.T('PZJ300003'),
				id : 'T'
			}, {
				name : T.T('PZJ300004'),
				id : 'P'
			}, {
				name : T.T('PZJ300005'),
				id : 'X'
			}, {
				name : T.T('PZJ300006'),
				id : 'M'
			} ];
			/*非对象实例化维度
			 * D-核算状态,E-事件,A-授权场景,L-额度节点,B-管控码*/
			$scope.nonObjInstanDimenArray ={ 
			    type:"dictData", 
			    param:{
			    	"type":"DROPDOWNBOX",
			    	groupsCode:"dic_nonObjectInstantiation",
			    	queryFlag: "children"
			    },//默认查询条件 
			    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			    resource:"paramsManage.query",//数据源调用的action 
			    callback: function(data){
			    	
			    }
			};
			/*维度取值下拉框:  MODT-业务类型,MODP-产品对象,MODM-媒介对象,MODB-余额对象
			ACST-核算状态,EVEN-事件,BLCK-封锁码,AUTX-授权场景,LMND-额度节点,CURR-币种
			MODG-业务项目,DELQ-延滞层级*/
			$scope.instanDimen1Arr ={ 
			    type:"dictData", 
			    param:{
			    	"type":"DROPDOWNBOX",
			    	groupsCode:"dic_dimensionalValue",
			    	queryFlag: "children"
			    },//默认查询条件 
			    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			    resource:"paramsManage.query",//数据源调用的action 
			    callback: function(data){
			    	
			    }
			};
			//延迟生效标识下拉框 Y
			$scope.delEffArr ={ 
			    type:"dictData", 
			    param:{
			    	"type":"DROPDOWNBOX",
			    	groupsCode:"dic_delayIdentification",
			    	queryFlag: "children"
			    },//默认查询条件 
			    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			    resource:"paramsManage.query",//数据源调用的action 
			    callback: function(data){
			    	
			    }
			};
			// 修改
			$scope.changeElmInfo = function(event) {
				$scope.artifactInfo = $.parseJSON(JSON.stringify(event));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/beta/elmList/changeElmList.html',
				$scope.artifactInfo, {
					title : T.T('PZJ300019'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1050px', '500px' ],
					callbacks : [ $scope.selectCorporat ]
				});
			};
			// 查看
			$scope.checkElmInfo = function(event) {
				$scope.elmInfo = $.parseJSON(JSON.stringify(event));
				//$scope.elmInfo.instanDimen1 = "BLCK";
				// 页面弹出框事件(弹出页面)
				$scope.modal('/beta/elmList/checkElmList.html',
				$scope.elmInfo, {
					title : T.T('PZJ300020'),
					buttons : [ T.T('F00012')],
					size : [ '1050px', '500px' ],
					callbacks : []
				});
			};
			// 查询活动
			$scope.checkActivityInfo = function(event) {
				$scope.activityInfo = $.parseJSON(JSON.stringify(event));
				//$scope.elmInfo.instanDimen1 = "BLCK";
				// 页面弹出框事件(弹出页面)
				$scope.modal('/beta/elmList/checkActivityList.html',
				$scope.activityInfo, {
					title : T.T("PZJ300023"),
					buttons : [ T.T('F00012')],
					size : [ '1050px', '500px' ],
					callbacks : []
				});
			};
			// 查询事件
			$scope.checkEventInfo = function(event) {
				$scope.eventInfo = $.parseJSON(JSON.stringify(event));
				//$scope.elmInfo.instanDimen1 = "BLCK";
				// 页面弹出框事件(弹出页面)
				$scope.modal('/beta/elmList/checkEventList.html',
				$scope.eventInfo, {
					title : T.T("PZJ300024"),
					buttons : [ T.T('F00012')],
					size : [ '1050px', '500px' ],
					callbacks : []
				});
			};
			// 回调函数/确认按钮事件
			$scope.selectCorporat = function(result) {
		    	$scope.artifactInfo.instanDimen1=result.scope.instanDimen1;
		    	$scope.artifactInfo.instanDimen2=result.scope.instanDimen2;
		    	$scope.artifactInfo.instanDimen3=result.scope.instanDimen3;
		    	$scope.artifactInfo.instanDimen4=result.scope.instanDimen4;
		    	$scope.artifactInfo.instanDimen5=result.scope.instanDimen5;
		    	$scope.artifactInfo.delayEffectiveSign=result.scope.delayEffectiveSign;
				var key;
				var i = 0;
				for (key in  $scope.artifactInfo){
					if($scope.artifactInfo[key] == "null" ||$scope.artifactInfo[key] == null ){
						$scope.artifactInfo[key] = '';
                    }
                }
				for (key in $scope.artifactInfo){
					if(key.indexOf('instanDimen') > -1 && key.indexOf('Count') == -1){
						if($scope.artifactInfo[key] != null && $scope.artifactInfo[key] != ""){
							i++;
						}
                    }
                }
				$scope.artifactInfo.instanDimenCount = i;
				$scope.artifactInfo.elementlist = $rootScope.treeSelect;
				console.log($scope.artifactInfo);
				jfRest.request('elmList', 'updateArti', $scope.artifactInfo) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00022'));
						$scope.safeApply();
						result.cancel();
						$scope.artiListTable.search();
					}
				});
			};
			//新增
			$scope.addArtiBtn = function(){
				$scope.artifactInfo = {};
				$scope.modal('/beta/elmCfgMgt/elmCfgMgt.html', $scope.artifactInfo, {
					title : T.T('PZJ300026'),
					buttons : [ T.T('F00107'),T.T('F00012')],
					size : [ '1050px', '500px' ],
					callbacks : [$scope.sureAddArti]
				});
			};
			$scope.sureAddArti = function(result){
				//console.log($scope.artifactInfo);
				var i = 0;
				for ( var key in $scope.artifactInfo){
					if(key.indexOf('instanDimen') > -1 && key.indexOf('Count') == -1){
						if($scope.artifactInfo[key] != null && $scope.artifactInfo[key] != ""){
							i++;
						}
                    }
                }
				$scope.artifactInfo.instanDimenCount = i;
				//保存事件
				$scope.arr2 = [];
				$scope.s40List = {};
				$scope.s40ListResult = [];
				 $("#s40 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr2.push(vall);
			    });
				 if($rootScope.s40){
					 for(var w=0;w<$rootScope.s40.length;w++){
						 for(var t=0;t<$scope.arr2.length;t++){
							if($rootScope.s40[w].elementNo == $scope.arr2[t]){
								$scope.s40List = $rootScope.s40[w];
								$scope.s40ListResult.push($scope.s40List);
							}
						 }
					 }
				 }
				 $scope.artifactInfo.elementlist= $scope.s40ListResult;
				 if($scope.artifactInfo.elementlist.length==0){
					 jfLayer.fail("至少有一个基础元件");
				 }else{
					 jfRest.request('artifactConfig', 'saveArti', $scope.artifactInfo).then(function(data) {
						 if (data.returnCode == '000000') {
							 jfLayer.success(T.T('F00032'));
							 $scope.artifactInfo ="";
							 $scope.safeApply();
							result.cancel();
							$scope.artiListTable.search();
						 }
					 });
				 }
			};
});
	webApp.controller('checkEventCtrl', function($scope,$stateParams, jfRest, $http, jfGlobal,$timeout,
			$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translate.refresh();
		// 事件清单列表
		$scope.itemList = {
			params : $scope.queryParam = {
				artifactNo : $scope.eventInfo.artifactNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.queryEventList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data;
			}
		};
		/*维度取值下拉框:  MODT-业务类型,MODP-产品对象,MODM-媒介对象,MODB-余额对象
		ACST-核算状态,EVEN-事件,BLCK-封锁码,AUTX-授权场景,LMND-额度节点,CURR-币种
		MODG-业务项目,DELQ-延滞层级*/
		$scope.instanDimen1Arr ={ 
		    type:"dictData", 
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_dimensionalValue",
		    	queryFlag: "children"
		    },//默认查询条件 
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.instanDimen1=$scope.eventInfo.instanDimen1;
		    	$scope.instanDimen2=$scope.eventInfo.instanDimen2;
		    	$scope.instanDimen3=$scope.eventInfo.instanDimen3;
		    	$scope.instanDimen4=$scope.eventInfo.instanDimen4;
		    	$scope.instanDimen5=$scope.eventInfo.instanDimen5;
		    	$timeout(function() {
	        		Tansun.plugins.render('select');
				});
		    }
		};
		//延迟生效标识下拉框 Y
		$scope.delEffArr ={ 
		    type:"dictData", 
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_delayIdentification",
		    	queryFlag: "children"
		    },//默认查询条件 
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.delayEffectiveSign=$scope.eventInfo.delayEffectiveSign;
		    	$timeout(function() {
	        		Tansun.plugins.render('select');
				});
		    }
		};
	});
	webApp.controller('checkActivityCtrl', function($scope,$stateParams, jfRest, $http, jfGlobal,$timeout,
			$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translate.refresh();
		console.log($scope.activityInfo);
		// 活动清单列表
		$scope.itemList = {
			params : $scope.queryParam = {
				artifactNo : $scope.activityInfo.artifactNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'avyList.queryActivityList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				$scope.item = data;
			}
		};
		/*维度取值下拉框:  MODT-业务类型,MODP-产品对象,MODM-媒介对象,MODB-余额对象
		ACST-核算状态,EVEN-事件,BLCK-封锁码,AUTX-授权场景,LMND-额度节点,CURR-币种
		MODG-业务项目,DELQ-延滞层级*/
		$scope.instanDimen1Arr ={ 
		    type:"dictData", 
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_dimensionalValue",
		    	queryFlag: "children"
		    },//默认查询条件 
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.instanDimen1=$scope.activityInfo.instanDimen1;
		    	$scope.instanDimen2=$scope.activityInfo.instanDimen2;
		    	$scope.instanDimen3=$scope.activityInfo.instanDimen3;
		    	$scope.instanDimen4=$scope.activityInfo.instanDimen4;
		    	$scope.instanDimen5=$scope.activityInfo.instanDimen5;
		    	$timeout(function() {
	        		Tansun.plugins.render('select');
				});
		    }
		};
		//延迟生效标识下拉框 Y
		$scope.delEffArr ={ 
		    type:"dictData", 
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_delayIdentification",
		    	queryFlag: "children"
		    },//默认查询条件 
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.delayEffectiveSign=$scope.activityInfo.delayEffectiveSign;
		    	$timeout(function() {
	        		Tansun.plugins.render('select');
				});
		    }
		};
		/* 日志类型
		 * G：金融G类
		 * S：金融S类
		 * N：非金融类
		 * P：参数类
		 * A: 授权类
		 * D: 金融D类
		*/
		/* $scope.logTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logType=$scope.activityInfo.logType;
	        }
		};
		 会计用途标识 
		  * Y:是
		  * N：否
 		$scope.accountingUseFlagArr ={ 
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
	        	$scope.accountingUseFlag=$scope.activityInfo.accountingUseFlag
	        }
		};
		日志层级   
		 * C：客户级
		A：账户级
		P：产品级
		R：参数级
		D：客户业务项目级
		B：余额单元级
		O：余额对象级
		T：余额类型级
		M：媒介级
		Y:运维级
		$scope.logLevelArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_logHierarchy",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.logLevel=$scope.activityInfo.logLevel;
	       }
		};	*/
	});	
webApp.controller('changeElmCtrl', function($scope,$stateParams, jfRest, $http, jfGlobal,$timeout,
		$rootScope, jfLayer, $location,lodinDataService,$translate,T) {
	/*$scope.delEffArr = [ {
		name : 'Y',
		id : 'Y'
	}];	*/
	$scope.searchelmList = function(){
			$scope.elmListTable.params.artifactNo = $scope.artifactInfo.artifactNo;
			$scope.elmListTable.search();
		};
		$scope.queryParam = {
				artifactNo : $scope.artifactInfo.artifactNo,
				"pageSize" : 10,
				"indexNo" : 0	
		};
		jfRest.request('elmList', 'queryBaseRltvTable', $scope.queryParam)
		.then(function(data) {
			if (data.returnCode == '000000') {
				$rootScope.treeSelect = data.returnData.rows;
				if (data.returnData.rows == null) {
					$rootScope.treeSelect = [];
				} else {
					$rootScope.treeSelect = data.returnData.rows;
				}
			}
		});
		//元件列表
		$scope.elmListTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
				artifactNo:$scope.artifactInfo.artifactNo,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.saveSelect = function(event) {
			var isTip = false;//是否提示
			var tipStr = "";
			if (!$scope.elmListTable.validCheck()) {
				return;
			}
			var items = $scope.elmListTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].elementNo == $rootScope.treeSelect[k].elementNo) {    //判断是否存在
						tipStr = tipStr + items[i].elementNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$rootScope.treeSelect.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('PZJ300021') + tipStr.substring(0,tipStr.length-1) + T.T('PZJ300022'));
			}
		};
		// 上移
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i - 1];
					$rootScope.treeSelect[i - 1] = dataMap;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == $rootScope.treeSelect.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i + 1];
					$rootScope.treeSelect[i + 1] = dataMap;
					break;
				}
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
		};
		/*维度取值下拉框:  MODT-业务类型,MODP-产品对象,MODM-媒介对象,MODB-余额对象
		ACST-核算状态,EVEN-事件,BLCK-封锁码,AUTX-授权场景,LMND-额度节点,CURR-币种
		MODG-业务项目,DELQ-延滞层级*/
		$scope.instanDimen1Arr ={ 
		    type:"dictData", 
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_dimensionalValue",
		    	queryFlag: "children"
		    },//默认查询条件 
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.instanDimen1=$scope.artifactInfo.instanDimen1;
		    	$scope.instanDimen2=$scope.artifactInfo.instanDimen2;
		    	$scope.instanDimen3=$scope.artifactInfo.instanDimen3;
		    	$scope.instanDimen4=$scope.artifactInfo.instanDimen4;
		    	$scope.instanDimen5=$scope.artifactInfo.instanDimen5;
		    	$timeout(function() {
	        		Tansun.plugins.render('select');
				});
		    }
		};
		//延迟生效标识下拉框 Y
		$scope.delEffArr ={ 
		    type:"dictData", 
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_delayIdentification",
		    	queryFlag: "children"
		    },//默认查询条件 
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action 
		    callback: function(data){
		    	$scope.delayEffectiveSign=$scope.artifactInfo.delayEffectiveSign;
		    	$timeout(function() {
	        		Tansun.plugins.render('select');
				});
		    }
		};
});
webApp.controller('checkElmCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal,$timeout,
		$rootScope, jfLayer, $location,lodinDataService,$translate,T) {
	/*维度取值下拉框:  MODT-业务类型,MODP-产品对象,MODM-媒介对象,MODB-余额对象
	ACST-核算状态,EVEN-事件,BLCK-封锁码,AUTX-授权场景,LMND-额度节点,CURR-币种
	MODG-业务项目,DELQ-延滞层级*/
	$scope.instanDimen1Arr = {};
	$scope.getinstanDimen1Arr = function(){
		$scope.instanDimen1Arr ={ 
			    type:"dictData", 
			    param:{
			    	"type":"DROPDOWNBOX",
			    	groupsCode:"dic_dimensionalValue",
			    	queryFlag: "children"
			    },//默认查询条件 
			    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			    resource:"paramsManage.query",//数据源调用的action 
			    callback: function(data){
			    	$scope.cheEl_instanDimen1=$scope.elmInfo.instanDimen1;
			    	$scope.cheEl_instanDimen2=$scope.elmInfo.instanDimen2;
			    	$scope.cheEl_instanDimen3=$scope.elmInfo.instanDimen3;
			    	$scope.cheEl_instanDimen4=$scope.elmInfo.instanDimen4;
			    	$scope.cheEl_instanDimen5=$scope.elmInfo.instanDimen5;
			    	$timeout(function() {
		        		Tansun.plugins.render('select');
					},300);
			    }
			};	
	};
	$scope.getinstanDimen1Arr();
	//延迟生效标识下拉框 Y
	$scope.delEffArr = {};
	$scope.getdelEffArr = function(){
		$scope.delEffArr ={ 
			    type:"dictData", 
			    param:{
			    	"type":"DROPDOWNBOX",
			    	groupsCode:"dic_delayIdentification",
			    	queryFlag: "children"
			    },//默认查询条件 
			    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			    resource:"paramsManage.query",//数据源调用的action 
			    callback: function(data){
			    	$scope.delayEffectiveSign = $scope.elmInfo.delayEffectiveSign;
			    	$timeout(function() {
		        		Tansun.plugins.render('select');
					});
			    }
			};
	};
	$scope.getdelEffArr();
		var elementNo_pcd = "";
		// 字段点击事件
		$scope.democlick = function(item) {
			$scope.pcdTable.params.elementNo = item.elementNo;
			$scope.pcdTable.search();
		};
		// 基础关联元件
		$scope.baseRltvTable = {
			// checkType : 'radio', //
			// 当为checkbox时为多选
			params : $scope.queryParam = {
				artifactNo : $scope.elmInfo.artifactNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryBaseRltvTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows!=null){
					for(var i=0;i<data.returnData.rows.length;i++){
						for(var j=i+1;j<data.returnData.rows.length;j++){
							if(data.returnData.rows[i].performOrder>data.returnData.rows[j].performOrder){
								var elemt = data.returnData.rows[j];
								data.returnData.rows[j] = data.returnData.rows[i];
								data.returnData.rows[i] = elemt;
							}
						}
					}
					$scope.optRltvTable.params.elementList = data.returnData.rows;
				}
				$scope.optRltvTable.search();
			}
		};
		// 可选关联元件
		$scope.optRltvTable = {
			// checkType : 'radio', //
			// 当为checkbox时为多选
			autoQuery :false,
			params : $scope.queryParam = {
				artifactNo : $scope.elmInfo.artifactNo,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				// $scope.item = data;
			}
		};
		// pcd编号查询
		$scope.pcdTable = {
			// checkType : 'radio', //
			// 当为checkbox时为多选
			autoQuery :false,
			params : $scope.queryParam = {
				// elementNo:elementNo_pcd,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryPcdTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				console.log(data);
				}
			};
		});//checkElmCtrl
//构件新增
webApp.controller('elmCfgMgtCtrl', function($scope, $stateParams, jfRest,$timeout,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/beta/elmCfgMgt/i18n_elmCfgMgt');
	$translate.refresh();
	$scope.menuName = lodinDataService.getObject("menuName");
	$scope.artifactInfo = $scope.artifactInfo;
	$scope.showNonObjInstanDimen = false;
	$scope.artifactTypeArray = [ {
		name : T.T('PZJ600001'),
		id : 'A'
	}, {
		name : T.T('PZJ600002'),
		id : 'B'
	}, {
		name : T.T('PZJ600003'),
		id : 'T'
	} , {
		name : T.T('PZJ600004'),
		id : 'P'
	} , {
		name : T.T('PZJ600005'),
		id : 'X'
	} , {
		name : T.T('PZJ600006'),
		id : 'M'
	}  ];
	/*非对象实例化维度
	 * D-核算状态,E-事件,A-授权场景,L-额度节点,B-管控码*/
	$scope.nonObjInstanDimenArray ={ 
	    type:"dictData", 
	    param:{
	    	"type":"DROPDOWNBOX",
	    	groupsCode:"dic_nonObjectInstantiation",
	    	queryFlag: "children"
	    },//默认查询条件 
	    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	    resource:"paramsManage.query",//数据源调用的action 
	    callback: function(data){
	    	console.log(data);
	    	$timeout(function() {
        		Tansun.plugins.render('select');
			});
	    }
	};
	/*维度取值下拉框:  MODT-业务类型,MODP-产品对象,MODM-媒介对象,MODB-余额对象
	ACST-核算状态,EVEN-事件,BLCK-封锁码,AUTX-授权场景,LMND-额度节点,CURR-币种
	MODG-业务项目,DELQ-延滞层级*/
	$scope.instanDimen1Arr ={ 
	    type:"dictData", 
	    param:{
	    	"type":"DROPDOWNBOX",
	    	groupsCode:"dic_dimensionalValue",
	    	queryFlag: "children"
	    },//默认查询条件 
	    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	    resource:"paramsManage.query",//数据源调用的action 
	    callback: function(data){
	    	console.log(data);
	    	$timeout(function() {
        		Tansun.plugins.render('select');
			});
	    }
	};
	//延迟生效标识下拉框 Y
	$scope.delEffArr ={ 
	    type:"dictData", 
	    param:{
	    	"type":"DROPDOWNBOX",
	    	groupsCode:"dic_delayIdentification",
	    	queryFlag: "children"
	    },//默认查询条件 
	    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	    resource:"paramsManage.query",//数据源调用的action 
	    callback: function(data){
	    	console.log(data);
	    	$timeout(function() {
        		Tansun.plugins.render('select');
			});
	    }
	};
	// 保存按钮事件
/*	$scope.saveArtiEleRel = function() {
		//console.log($scope.artifactInfo);
		var i = 0;
		for ( var key in $scope.artifactInfo){
			if(key.indexOf('instanDimen') > -1 && key.indexOf('Count') == -1){
				if($scope.artifactInfo[key] != null && $scope.artifactInfo[key] != ""){
					i++;
				}
			};
		}
		$scope.artifactInfo.instanDimenCount = i;
		//保存事件
		$scope.arr2 = [];
		$scope.s40List = {};
		$scope.s40ListResult = [];
		 $("#s40 option").each(function () {
	        var vall = $(this).val();
	        $scope.arr2.push(vall);
	    });
		 if($rootScope.s40){
			 for(var w=0;w<$rootScope.s40.length;w++){
				 for(var t=0;t<$scope.arr2.length;t++){
					if($rootScope.s40[w].elementNo == $scope.arr2[t]){
						$scope.s40List = $rootScope.s40[w];
						$scope.s40ListResult.push($scope.s40List);
					}
				 }
			 }
		 }
		 $scope.artifactInfo.elementlist= $scope.s40ListResult;
		 if($scope.artifactInfo.elementlist.length==0){
			 jfLayer.fail("至少有一个基础元件");
		 }else{
//		$scope.artifactInfo.artifactReleleList = $rootScope.treeSelect;
			 jfRest.request('artifactConfig', 'saveArti', $scope.artifactInfo).then(function(data) {
				 if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00032'));
					 $scope.artifactInfo ="";
					 $scope.cardBinForm1.$setPristine();
				 }else{
					 jfLayer.fail(data.returnCode+":"+data.returnMsg);
				 }
			 });
		 }
	};*/
	var form = layui.form;
	form.on('select(getRiskLimits)',function(event){
		if(event.value == 'X'){
			$scope.showNonObjInstanDimen = true;
		}else{
			$scope.showNonObjInstanDimen = false;
		}
	});
	// 构件配置的选择元件列表
	$("#s39 option").remove();
	 $("#s40 option").remove();
	$scope.setparamss = {};
	jfRest.request('elmList', 'queryOptRltv', $scope.setparamss)
	.then(function(data) {
		if(data.returnCode == '000000'){
			var a =data.returnData.rows;
			$rootScope.s40 = {};
			$rootScope.s40 =data.returnData.rows;
			for(var i=0;i<a.length;i++){
				$("#s39").append("<option value='"+a[i].elementNo+"'>"+a[i].elementNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].elementDesc+"</option>"); 
		   }
		}
	});
	/*-----根据元件和元件描述查询-----*/
	$scope.queryElementList = function(){
		 $("#s39").empty();
		 $scope.setparamss = {
			operationMode : $rootScope.operationMods,
			elementNo: $scope.artifactInfo.elementNo,
			elementDesc: $scope.artifactInfo.elementDesc
		};
		jfRest.request('elmList', 'queryOptRltv', $scope.setparamss).then(function(data) {
			if(data.returnCode == '000000'){
				var a =data.returnData.rows;
				$scope.arr02 = [];
				$("#s40 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				if(n !=undefined && a !=null){
					//查找重复数据
					 var isrep;
					 for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].elementNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s39").append("<option value='"+a[j].elementNo+"'>"+a[j].elementNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].elementDesc+"</option>"); 
				    	}
                     }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
			    		 $("#s39").append("<option value='"+a[j].elementNo+"'>"+a[j].elementNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].elementDesc+"</option>"); 
			    	  }
			      }
			}
		});
	};
	/*-----end 构件和构件描述查询-----*/
	$("#s39").dblclick(function(){  
		 var alloptions = $("#s39 option");  
		 var so = $("#s39 option:selected");  
		 $("#s40").append(so);  
	});  
	$("#s40").dblclick(function(){  
		 var alloptions = $("#s40 option");  
		 var so = $("#s40 option:selected");  
		 $("#s39").append(so);  
	});  
	$("#add39").click(function(){  
		 var alloptions = $("#s39 option");  
		 var so = $("#s39 option:selected");  
		 $("#s40").append(so); 
	});  
	$("#remove39").click(function(){  
		 var alloptions = $("#s40 option");  
		 var so = $("#s40 option:selected");  
		 $("#s39").append(so);
	});  
	$("#addall39").click(function(){  
		$("#s40").append($("#s39 option").attr("selected",true));  
	});  
	$("#removeall39").click(function(){  
		$("#s39").append($("#s40 option").attr("selected",true));  
	});  
/*	$scope.elmListTableCfg = {
		checkType : 'checkbox', // 当为checkbox时为多选
		params : $scope.queryParam = {
		}, // 表格查询时的参数信息
		paging : true,// 默认true,是否分页
		resource : 'elmList.queryOptRltv',// 列表的资源
		autoQuery: false,
		callback : function(data) { // 表格查询后的回调函数
			//console.log($scope.artifactInfo.artifactNo);
		}
	};
	$scope.searchelmList = function(){
		$scope.elmListTableCfg.params.artifactNo = $scope.artifactInfo.artifactNo;
		$scope.elmListTableCfg.search();
	}
	$rootScope.treeSelect = [];
	$scope.saveSelect = function(event) {
		var isTip = false;						//是否提示
		var tipStr = "";
		if (!$scope.elmListTableCfg.validCheck()) {
			return;
		}
		var items = $scope.elmListTableCfg.checkedList();
		for (var i = 0; i < items.length; i++) {
			var isExist = false;						//是否存在
			for (var k = 0; k < $rootScope.treeSelect.length; k++) {
				if (items[i].elementNo == $rootScope.treeSelect[k].elementNo) {    //判断是否存在
					tipStr = tipStr + items[i].elementNo + ",";
					isTip = true;
					isExist = true;
					break;
				}
			}
			if(!isExist){
				$rootScope.treeSelect.push(items[i]);	
			}
		}
		if(isTip){
			jfLayer.alert(T.T('PZH600022') + tipStr.substring(0,tipStr.length-1) +T.T('PZJ600023'));
		}
	}
	// 上移
	$scope.exchangeSeqNoUp = function(data) {
		for (var i = 0; i < $rootScope.treeSelect.length; i++) {
			if ($rootScope.treeSelect[i] == data) {
				if (i == 0) {
					jfLayer.fail(T.T('F00024'));
					break;
				}
				var dataMap = $rootScope.treeSelect[i];
				$rootScope.treeSelect[i] = $rootScope.treeSelect[i - 1];
				$rootScope.treeSelect[i - 1] = dataMap;
				break;
			}
		}
	}
	// 下移
	$scope.exchangeSeqNoDown = function(data) {
		for (var i = 0; i < $rootScope.treeSelect.length; i++) {
			if ($rootScope.treeSelect[i] == data) {
				if (i == $rootScope.treeSelect.length - 1) {// 判断第几条数据
					jfLayer.fail(T.T('F00025'));
					break;
				}
				var dataMap = $rootScope.treeSelect[i];
				$rootScope.treeSelect[i] = $rootScope.treeSelect[i + 1];
				$rootScope.treeSelect[i + 1] = dataMap;
				break;
			}
		}
	}
	// 删除关联元件
	$scope.removeSelect = function(data) {
		var checkId = data;
		$rootScope.treeSelect.splice(checkId, 1);
	}*/
});
});
