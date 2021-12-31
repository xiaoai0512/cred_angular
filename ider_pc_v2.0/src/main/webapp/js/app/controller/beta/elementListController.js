'use strict';
define(function(require) {
	var webApp = require('app');
	// 元件清单
	webApp.controller( 'elementListCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope, 
			jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addTwoBtnFlag = false;
		 $scope.updateTwoBtnFlag = false;
		 
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
	   	   			if($scope.eventList.search('COS.AD.02.0009') != -1){    //元件建立
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.IQ.02.0009') != -1){    //元件查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0009') != -1){    //元件维护
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.AD.02.0051') != -1){    //新增PCD
	   					$scope.addTwoBtnFlag = true;
	   				}
	   				else{
	   					$scope.addTwoBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0052') != -1){    //维护PCD
	   					$scope.updateTwoBtnFlag = true;
	   				}
	   				else{
	   					$scope.updateTwoBtnFlag = false;
	   				}
  				}
  			});
		$scope.elementListTable = {
				params : {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'elementList.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//新增
		$scope.elementAdd = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/elementEst.html', '', {
				title : T.T('PZJ410050'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '590px' ],
				callbacks : [$scope.saveElementPcdValue]
			});
		};
		//新增元件、pcd及pcd初始值
		$scope.saveElementPcdValue = function(result){
			$scope.elementInfo = result.scope.elementInfo;
			$scope.elementInfo1 = result.scope.elementInfo1;
			$scope.elementInfo2 = result.scope.elementInfo2;
			if($scope.elementInfo.elementNo == null || $scope.elementInfo.elementNo == "undefined" || $scope.elementInfo.elementNo == undefined || 
					$scope.elementInfo.elementNo == "" || $scope.elementInfo.elementDesc == null || $scope.elementInfo.elementDesc == "undefined" || 
					$scope.elementInfo.elementDesc == undefined || $scope.elementInfo.elementDesc == "" || $scope.elementInfo.supportPersonal == null || 
					$scope.elementInfo.supportPersonal == "undefined" || $scope.elementInfo.supportPersonal == undefined|| 
					$scope.elementInfo.supportPersonal == ""){
				jfLayer.fail(T.T('PZJ410026'));
				return;
			}
			if($scope.elementInfo1.pcdNo == null || $scope.elementInfo1.pcdNo == "undefined" || $scope.elementInfo1.pcdNo == undefined ||
					$scope.elementInfo1.pcdNo == "" || $scope.elementInfo1.pcdDesc == null || $scope.elementInfo1.pcdDesc == "undefined" || 
					$scope.elementInfo1.pcdDesc == undefined || $scope.elementInfo1.pcdDesc == ""){
				jfLayer.fail(T.T('PZJ410027'));
				return;
			}
			if($scope.elementInfo2.pcdNo == null || $scope.elementInfo2.pcdNo == "undefined" || $scope.elementInfo2.pcdNo == undefined ||
					$scope.elementInfo2.pcdNo == "" || $scope.elementInfo2.pcdType == null || $scope.elementInfo2.pcdType == "undefined" || 
					$scope.elementInfo2.pcdType == undefined || $scope.elementInfo2.pcdType == ""){
				jfLayer.fail(T.T('PZJ410028'));
				return;
			}
			$scope.parm = {
					pcdNo : $scope.elementInfo1.pcdNo,
					pcdDesc : $scope.elementInfo1.pcdDesc,
					baseInstanDimen : $scope.elementInfo1.baseInstanDimen,
					optionInstanDimen : $scope.elementInfo1.optionInstanDimen,
					activityTagValidFlag : $scope.elementInfo1.activityTagValidFlag,
					segmentType : $scope.elementInfo1.segmentType,
					segmentSerialNum : $scope.elementInfo2.segmentSerialNum,
					pcdType : $scope.elementInfo2.pcdType,
					pcdPoint : $scope.elementInfo2.pcdPoint,
					segmentValue : $scope.elementInfo2.segmentValue,
					pcdValue : $scope.elementInfo2.pcdValue
			};
			if($scope.elementInfo1.isExist != "true"){
				jfRest.request('pcdAndPcdInitValue', 'save', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success('F00032');
						 $scope.safeApply();
						 result.cancel();
						 $scope.elementListTable.search();
					}
				});
			}else{
				jfRest.request('pcdAndPcdInitValue', 'update', $scope.parm).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						 $scope.safeApply();
						 result.cancel();
						 $scope.elementListTable.search();
					}
				});
			}
		};
		//元件维护
		$scope.updateElement = function(event) {
			$scope.updateElementInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/updateElement.html',
					$scope.updateElementInfo, {
						title : T.T('PZJ410052'),
						buttons : [ T.T('F00107'), T.T('F00012') ],
						size : [ '1150px', '350px' ],
						callbacks : [$scope.saveElement]
					});
		};
		$scope.saveElement = function(result){
			$scope.updateElementInfo.supportPersonal = result.scope.supportPersonalU;
			$scope.updateElementInfo.supportPcd = result.scope.supportPcdU;
			jfRest.request('elementList', 'update', $scope.updateElementInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					 $scope.safeApply();
					 result.cancel();
					$scope.elementListTable.search();
				}
			});
		};
		// 新增
		$scope.addElement = function(event) {
			$scope.addPcdDefaultValueInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/addPcdDefaultValue.html',
			$scope.addPcdDefaultValueInf, {
				title : T.T('PZJ400030'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '350px' ],
				callbacks : [$scope.savePcdDefValue]
			});
		};
		$scope.savePcdDefValue = function(result){
			jfRest.request('pcdDefValue', 'save', $scope.addPcdDefaultValueInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					 $scope.safeApply();
					 result.cancel();
					$scope.elementListTable.search();
				}
			});
		};
		// 查看
		$scope.checkElementInfo = function(event) {
			$scope.checkPcdDefaultValueInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/checkPcdDefaultValue.html',
			$scope.checkPcdDefaultValueInf, {
				title : T.T('PZJ410031'),
				buttons : [ T.T('F00012')],
				size : [ '1150px', '350px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateElementInfo = function(event) {
			$scope.updatePcdDefaultValueInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/updatePcdDefaultValue.html',
			$scope.updatePcdDefaultValueInf, {
				title : T.T('PZJ410032'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '350px' ],
				callbacks : [$scope.savePcdDefValue1]
			});
		};
		$scope.savePcdDefValue1 = function(result){
			jfRest.request('pcdDefValue', 'update', $scope.updatePcdDefaultValueInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					 $scope.safeApply();
					 result.cancel();
					$scope.elementListTable.search();
				}
			});
		};
		//pcd及pcd初始值新增
		$scope.addPcdAndPcdInitValue = function(event) {
			$scope.addPcdAndPcdInitValueInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/addPcdAndPcdInitValue.html',
			$scope.addPcdAndPcdInitValueInfo, {
				title : T.T('PZJ410051'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '400px' ],
				callbacks : [$scope.savePcdAndPcdInitValue]
			});
		};
		//pcd及pcd初始值新增
		$scope.savePcdAndPcdInitValue = function(result){
			$scope.addPcdAndPcdInitValueInfo = result.scope.addPcdAndPcdInitValueInfo;
			$scope.addPcdAndPcdInitValueInfo1 = result.scope.addPcdAndPcdInitValueInfo1;
			if($scope.addPcdAndPcdInitValueInfo.pcdNo == null || $scope.addPcdAndPcdInitValueInfo.pcdNo == "undefined" || $scope.addPcdAndPcdInitValueInfo.pcdNo == undefined ||
					$scope.addPcdAndPcdInitValueInfo.pcdNo == "" || $scope.addPcdAndPcdInitValueInfo.pcdDesc == null || $scope.addPcdAndPcdInitValueInfo.pcdDesc == "undefined" || 
					$scope.addPcdAndPcdInitValueInfo.pcdDesc == undefined || $scope.addPcdAndPcdInitValueInfo.pcdDesc == ""){
				jfLayer.fail(T.T('PZJ410027'));
				return;
			}
			if($scope.addPcdAndPcdInitValueInfo1.pcdNo == null || $scope.addPcdAndPcdInitValueInfo1.pcdNo == "undefined" || $scope.addPcdAndPcdInitValueInfo1.pcdNo == undefined ||
					$scope.addPcdAndPcdInitValueInfo1.pcdNo == "" || $scope.addPcdAndPcdInitValueInfo1.pcdType == null || $scope.addPcdAndPcdInitValueInfo1.pcdType == "undefined" || 
					$scope.addPcdAndPcdInitValueInfo1.pcdType == undefined || $scope.addPcdAndPcdInitValueInfo1.pcdType == ""){
				jfLayer.fail(T.T('PZJ410028'));
				return;
			}
			$scope.parm = {
					pcdNo : $scope.addPcdAndPcdInitValueInfo.pcdNo,
					pcdDesc : $scope.addPcdAndPcdInitValueInfo.pcdDesc,
					baseInstanDimen : $scope.addPcdAndPcdInitValueInfo.baseInstanDimen,
					optionInstanDimen : $scope.addPcdAndPcdInitValueInfo.optionInstanDimen,
					activityTagValidFlag : $scope.addPcdAndPcdInitValueInfo.activityTagValidFlag,
					segmentType : $scope.addPcdAndPcdInitValueInfo.segmentType,
					segmentSerialNum : $scope.addPcdAndPcdInitValueInfo1.segmentSerialNum,
					pcdType : $scope.addPcdAndPcdInitValueInfo1.pcdType,
					pcdPoint : $scope.addPcdAndPcdInitValueInfo1.pcdPoint,
					segmentValue : $scope.addPcdAndPcdInitValueInfo1.segmentValue,
					pcdValue : $scope.addPcdAndPcdInitValueInfo1.pcdValue
			};
			jfRest.request('pcdAndPcdInitValue', 'save', $scope.parm).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.elementListTable.search();
				}
			});
		};
		//pcd及pcd初始值维护
		$scope.updatePcdAndPcdInitValue = function(event) {
			$scope.updatePcdAndPcdInitValueInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/beta/elementList/updatePcdAndPcdInitValue.html',
			$scope.updatePcdAndPcdInitValueInfo, {
				title : T.T('PZJ410034'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '400px' ],
				callbacks : [$scope.savePcdAndPcdInitValue1]
			});
		};
		$scope.savePcdAndPcdInitValue1 = function(result){
			jfRest.request('pcdAndPcdInitValue', 'update', $scope.updatePcdAndPcdInitValueInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					 $scope.safeApply();
					 result.cancel();
					$scope.elementListTable.search();
				}
			});
		};
	});
	//新增元件及pcd
	webApp.controller('elementEstCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
		/*是否支持个性化下拉框 
		 * Y-支持， N-不支持 */
		 $scope.supportPersonalArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_standByType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};	  
		 /*活动标签生效下拉框 */
		 $scope.activityTagValidFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_activityTagTakesEffect",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		 /*分段类型下拉框 
		  * DAY-天数,MTH-自然月,CYC-账单周期,DLQ-逾期状态,
		  * ACT-核算状态,CUR-币种*/
		 $scope.segmentTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_segmentationType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		}; 		
		/* 取值类型
		 * D-数值,P-百分比,O-其他*/
		 $scope.pcdTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_valueType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		}; 	
		$scope.instanCodeShow = false;
		$scope.instanCodeShow1 = false;
		$scope.step2Btn = false;
		$scope.step3Btn = false;
		$scope.step4Btn = false;
		$scope.authBusTransShow = false;
		$scope.authBusTransShow1 = false;
		$scope.elementInfo = {};
		$scope.elementInfo1 = {};
		$scope.elementInfo2 = {};
		$scope.stepBtn = true;
		$scope.step1Btn = true;
		$scope.nextStep1 = function(){
			jfRest.request('elementList', 'save', $scope.elementInfo).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.elementInfo.pcdNo = $scope.elementInfo.elementNo.substring(0,8);
					if($scope.elementInfo.supportPcd == 'Y'){
						jfRest.request('elmList', 'queryPcdTable', $scope.elementInfo).then(function(data) {
							if (data.returnCode == '000000') {
								if(data.returnData.totalCount != 0){
									$scope.instanCodeShow1 = true;
									$scope.elementInfo1 = data.returnData.rows[0];
									$scope.elementInfo1.isExist = "true";
									jfLayer.success(T.T('PZJ410048'));
								}else{
									$scope.instanCodeShow = true;
									jfLayer.success(T.T('PZJ410049'));
								}
							}
						});
						 $scope.elementEstForm.$setPristine();
						var adom1I = document.getElementsByClassName('step1I');
			  			for(var i=0;i<adom1I.length;i++){
			  				adom1I[i].setAttribute('readonly',true);
			  			}
			  			var adom1S = document.getElementsByClassName('step1S');
						for(var i=0;i<adom1S.length;i++){
							adom1S[i].setAttribute('disabled','disabled');
						}
						$timeout(function() {
							Tansun.plugins.render('select');
						});
						$scope.stepBtn = false;
						$scope.step1Btn = false;
						$scope.step2Btn = true;
						$scope.step3Btn = true;
						$scope.elementInfo1.pcdNo = $scope.elementInfo.elementNo.substring(0,8);
					}
					else if($scope.elementInfo.supportPcd == 'N'){
						//取消弹窗
						$('.layui-layer').css({"display" : 'none'});//隐藏弹窗
						$(".layui-layer-shade").css({"display" : 'none'});//去掉遮罩层
						jfLayer.success(T.T('F00032'));
						$scope.elementListTable.search();
					 }
				}
			});
		};
		$scope.stepBackOne = function(){
			var adom1I = document.getElementsByClassName('step1I');
  			for(var i=0;i<adom1I.length;i++){
  				adom1I[i].removeAttribute('readonly');
  			}
  			var adom1S = document.getElementsByClassName('step1S');
  			var adomList = $(".step1S");
			for(var i=0;i<adom1S.length;i++){
				adom1S[i].removeAttribute('disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.elementInfo1 = {};
			$scope.pcdEstForm.$setPristine();
			$scope.stepBtn = true;
			$scope.step1Btn = true;
			$scope.instanCodeShow = false;
			$scope.instanCodeShow1 = false;
			$scope.step2Btn = false;
			$scope.step3Btn = false;
		};
		$scope.saveProLine = function(){
			var adom2I = document.getElementsByClassName('step2I');
  			for(var i=0;i<adom2I.length;i++){
  				adom2I[i].setAttribute('readonly',true);
  			}
  			var adom2S = document.getElementsByClassName('step2S');
			for(var i=0;i<adom2S.length;i++){
				adom2S[i].setAttribute('disabled','disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.elementInfo2.segmentSerialNum = 0;
			$scope.step2Btn = false;
			$scope.step3Btn = false;
			$scope.elementInfo.pcdNo = $scope.elementInfo.elementNo.substring(0,8);
			jfRest.request('pcdDefValue', 'query', $scope.elementInfo).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.totalCount != 0){
						$scope.authBusTransShow1 = true;
						$scope.elementInfo2 = data.returnData.rows[0];
					}else{
						$scope.authBusTransShow = true;
					}
				}
			});
			$scope.step4Btn = true;
			$scope.elementInfo2.pcdNo = $scope.elementInfo1.pcdNo;
		};
		$scope.stepBackTwo = function(){
			var adom2I = document.getElementsByClassName('step2I');
  			for(var i=0;i<adom2I.length;i++){
  				adom2I[i].removeAttribute('readonly');
  			}
  			var adom2S = document.getElementsByClassName('step2S');
			for(var i=0;i<adom2S.length;i++){
				adom2S[i].removeAttribute('disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.elementInfo2 = {};
			$scope.step2Btn = true;
			$scope.authBusTransShow = false;
			$scope.authBusTransShow1 = false;
			$scope.step3Btn = true;
			$scope.step4Btn = false;
		}
	});
	//元件维护
	webApp.controller('updateElementCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
		/*是否支持个性化下拉框 
		 * Y-支持， N-不支持 */
		 $scope.supportPersonalArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_standByType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.supportPersonalU=$scope.updateElementInfo.supportPersonal;
	        }
		};	
		 $scope.supportPcdArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_standByType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.supportPcdU = $scope.updateElementInfo.supportPcd;
	        }
		};
	});
	//pcd及pcd初始值新增
	webApp.controller('addPcdAndPcdInitValueCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
		/*活动标签生效下拉框 */
		 $scope.activityTagValidFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_activityTagTakesEffect",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		 /*分段类型下拉框 
		  * DAY-天数,MTH-自然月,CYC-账单周期,DLQ-逾期状态,
		  * ACT-核算状态,CUR-币种*/
		 $scope.segmentTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_segmentationType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		}; 		
		/* 取值类型
		 * D-数值,P-百分比,O-其他*/
		 $scope.pcdTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_valueType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		}; 
		$scope.step1Btn = true;
		$scope.addPcdAndPcdInitValueInfo1 = {};
		$scope.addPcdAndPcdInitValueInfo.pcdNo = $scope.addPcdAndPcdInitValueInfo.elementNo.substring(0,8);
		$scope.saveProLine = function(){
			var adom1I = document.getElementsByClassName('step1I');
  			for(var i=0;i<adom1I.length;i++){
  				adom1I[i].setAttribute('readonly',true);
  			}
  			var adom1S = document.getElementsByClassName('step1S');
			for(var i=0;i<adom1S.length;i++){
				adom1S[i].setAttribute('disabled','disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.authBusTransShow = true;
			$scope.addPcdAndPcdInitValueInfo1.segmentSerialNum = 0;
			$scope.step1Btn = false;
			$scope.step2Btn = true;
			$scope.addPcdAndPcdInitValueInfo1.pcdNo = $scope.addPcdAndPcdInitValueInfo.pcdNo;
		};
		$scope.stepBackTwo = function(){
			var adom1I = document.getElementsByClassName('step1I');
  			for(var i=0;i<adom1I.length;i++){
  				adom1I[i].removeAttribute('readonly');
  			}
  			var adom1S = document.getElementsByClassName('step1S');
			for(var i=0;i<adom1S.length;i++){
				adom1S[i].removeAttribute('disabled');
			}
			$timeout(function() {
				Tansun.plugins.render('select');
			});
			$scope.addPcdAndPcdInitValueInfo1 = {};
			$scope.step1Btn = true;
			$scope.authBusTransShow = false;
			$scope.step2Btn = false;
		}
	});
	//pcd及pcd初始值维护
	webApp.controller('updatePcdAndPcdInitValueCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
		/*活动标签生效下拉框 */
		 $scope.activityTagValidFlagArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_activityTagTakesEffect",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		 /*分段类型下拉框 
		  * DAY-天数,MTH-自然月,CYC-账单周期,DLQ-逾期状态,
		  * ACT-核算状态,CUR-币种*/
		 $scope.segmentTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_segmentationType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		}; 		
		/* 取值类型
		 * D-数值,P-百分比,O-其他*/
		 $scope.pcdTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_valueType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		}; 
		$scope.updatePcdAndPcdInitValueInfo.pcdNo = $scope.updatePcdAndPcdInitValueInfo.elementNo.substring(0,8);
		$scope.updatePcdAndPcdInitValueInfo.segmentSerialNum ='0';
		$scope.param = {
				pcdNo: $scope.updatePcdAndPcdInitValueInfo.pcdNo,
	       };
		jfRest.request('pcd', 'query', $scope.param).then(function(data) {
			if(data.returnCode == '000000'){
				if(data.returnData.totalCount != 0){
					if(data.returnData.rows.length){
						$scope.updatePcdAndPcdInitValueInfo.pcdDesc = data.returnData.rows[0].pcdDesc;
						$scope.updatePcdAndPcdInitValueInfo.baseInstanDimen = data.returnData.rows[0].baseInstanDimen;
						$scope.updatePcdAndPcdInitValueInfo.optionInstanDimen = data.returnData.rows[0].optionInstanDimen;
						$scope.updatePcdAndPcdInitValueInfo.activityTagValidFlag = data.returnData.rows[0].activityTagValidFlag;
						$scope.updatePcdAndPcdInitValueInfo.segmentType = data.returnData.rows[0].segmentType;
					}
				}
			}
		});
		jfRest.request('pcdDefValue', 'query', $scope.param).then(function(data) {
			if(data.returnCode == '000000'){
				if(data.returnData.totalCount != 0){
					if(data.returnData.rows.length){
						$scope.updatePcdAndPcdInitValueInfo.segmentSerialNum = data.returnData.rows[0].segmentSerialNum;
						$scope.updatePcdAndPcdInitValueInfo.pcdType = data.returnData.rows[0].pcdType;
						$scope.updatePcdAndPcdInitValueInfo.pcdPoint = data.returnData.rows[0].pcdPoint;
						$scope.updatePcdAndPcdInitValueInfo.pcdValue = data.returnData.rows[0].pcdValue;
						$scope.updatePcdAndPcdInitValueInfo.segmentValue = data.returnData.rows[0].segmentValue;
					}
				}
			}
		});
	});
	/*以下控制器js暂时不需要，HTML已注释'新增','查询','修改'*/
	//新增
	webApp.controller('addPcdDefaultValueCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
		$scope.addPcdDefaultValueInf.pcdNo = $scope.addPcdDefaultValueInf.elementNo.substring(0,8);
		$scope.addPcdDefaultValueInf.segmentSerialNum ='0';
		$scope.pcdtypeArray = [{name : T.T('PZJ410035'),id : 'D'}
		,{name : T.T('PZJ410036'),id : 'P'}
		,{name : T.T('PZJ410037'),id : 'O'}];
		$scope.param = {
				pcdNo: $scope.addPcdDefaultValueInf.pcdNo,
           };
		jfRest.request('pcd', 'query', $scope.param).then(function(data) {
			if(data.returnCode == '000000'){
				if(data.returnData.totalCount != 0){
					if(data.returnData.rows.length){
						$scope.addPcdDefaultValueInf.segmentType = data.returnData.rows[0].segmentType;
					}
				}
			}
		});
	});
	//查询
	webApp.controller('checkPcdDefaultValueCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
	$scope.checkPcdDefaultValueInf.pcdNo = $scope.checkPcdDefaultValueInf.elementNo.substring(0,8);
	$scope.checkPcdDefaultValueInf.segmentSerialNum ='0';
	$scope.pcdtypeArray = [{name : T.T('PZJ410035'),id : 'D'}
	,{name : T.T('PZJ410036'),id : 'P'}
	,{name : T.T('PZJ410037'),id : 'O'}] ;
	$scope.param = {
			pcdNo: $scope.checkPcdDefaultValueInf.pcdNo,
       };
	jfRest.request('pcdDefValue', 'query', $scope.param).then(function(data) {
		if(data.returnCode == '000000'){
			if(data.returnData.totalCount != 0){
				if(data.returnData.rows.length != 0){
					$scope.checkPcdDefaultValueInf.segmentType = data.returnData.rows[0].segmentType;
					$scope.checkPcdDefaultValueInf.pcdType = data.returnData.rows[0].pcdType;
					$scope.checkPcdDefaultValueInf.pcdPoint = data.returnData.rows[0].pcdPoint;
					$scope.checkPcdDefaultValueInf.pcdValue = data.returnData.rows[0].pcdValue;
				}
			}
		}
	});
	});
	//修改
	webApp.controller('updatePcdDefaultValueCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translate.refresh();
	$scope.updatePcdDefaultValueInf.pcdNo = $scope.updatePcdDefaultValueInf.elementNo.substring(0,8);
	$scope.updatePcdDefaultValueInf.segmentSerialNum ='0';
	$scope.pcdtypeArray = [{name : T.T('PZJ410035'),id : 'D'}
	,{name : T.T('PZJ410036'),id : 'P'}
	,{name : T.T('PZJ410037'),id : 'O'}];
	$scope.param = {
			pcdNo: $scope.updatePcdDefaultValueInf.pcdNo,
       };
	jfRest.request('pcdDefValue', 'query', $scope.param).then(function(data) {
		if(data.returnCode == '000000'){
			if(data.returnData.totalCount != 0){
				if(data.returnData.rows.length){
					$scope.updatePcdDefaultValueInf.segmentType = data.returnData.rows[0].segmentType;
					$scope.updatePcdDefaultValueInf.pcdType = data.returnData.rows[0].pcdType;
					$scope.updatePcdDefaultValueInf.pcdPoint = data.returnData.rows[0].pcdPoint;
					$scope.updatePcdDefaultValueInf.pcdValue = data.returnData.rows[0].pcdValue;
				}
			}
		}
	});
	});
});
