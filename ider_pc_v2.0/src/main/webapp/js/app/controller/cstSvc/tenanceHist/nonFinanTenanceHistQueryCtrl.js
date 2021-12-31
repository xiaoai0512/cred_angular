'use strict';
define(function(require) {
	var webApp = require('app');
	// 非金融维护历史查询
	webApp.controller('nonFinanTenanceHistQueryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer,$location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/tenanceHist/i18n_nonFinanTenanceHist');
		$translatePartialLoader.addPart('pages/cstSvc/accountHist/i18n_accRepyHistEnqr');
		$translate.refresh();
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.queryParam = {
				organNo : $scope.organization
		};
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#nonFinanTenanceList_zs',
					//min:"2019-03-01",
					done: function(value, date) {
						endDate.config.min = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						endDate.config.start = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
					}
				});
				var endDate = laydate.render({
					elem: '#nonFinanTenanceList_ze',
					//min:Date.now(),
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						}
					}
				});
		});
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
 			$scope.nonFinanTenanceList.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#nonFinanTenanceHistQuery_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#nonFinanTenanceHistQuery_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#nonFinanTenanceHistQuery_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#nonFinanTenanceHistQuery_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#nonFinanTenanceHistQuery_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#nonFinanTenanceHistQuery_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			console.log($scope.corporationEntityNo);
			if($scope.adminFlag && $scope.adminFlag != "1" && $scope.adminFlag != "2"){
				$scope.cardBin.corporationEntityNo = $scope.corporationEntityNo;
			}
			});
		$scope.showCNonFinanTenanceHistDiv =false;
		$scope.showANonFinanTenanceHistDiv =false;
		$scope.showPNonFinanTenanceHistDiv =false;
		$scope.showMNonFinanTenanceHistDiv =false;
		$scope.showDNonFinanTenanceHistDiv =false;
		//'客户级''账户级''产品级''媒介级''客户业务项目级''激活''制卡'
		/*$scope.demoArray2 = [ {
			name : T.T('KHJ1100001'),
			id : 'C'
		}, {
			name : T.T('KHJ1100002'),
			id : 'A'
		}, {
			name : T.T('KHJ1100003'),
			id : 'P'
		}, {
			name : T.T('KHJ1100004'),
			id : 'M'
		}, {
			name : T.T('KHJ1100005'),
			id : 'D'
		}, {
			name : T.T('KHJ1100006'),
			id : 'M1'
		}, {
			name : T.T('KHJ1100007'),
			id : 'M2'
		}];*/
		$scope.demoArray2 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_logLevel",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	
		        }
	};
		$scope.reset = function() {
			$scope.nonFinanTenanceList = {};
			$scope.nonFinanTenanceList.startDate = "";
			$scope.nonFinanTenanceList.endDate = "";
			$scope.nonFinanTenanceList.idType= '';
			$scope.nonFinanTenanceList.customerNo= '';
			$scope.showCNonFinanTenanceHistDiv =false;
			$scope.showANonFinanTenanceHistDiv =false;
			$scope.showPNonFinanTenanceHistDiv =false;
			$scope.showMNonFinanTenanceHistDiv =false;
			$scope.showDNonFinanTenanceHistDiv =false;
			$('#nonFinanTenanceHistQuery_idNumber').attr('validator','noValidator');
			$('#nonFinanTenanceHistQuery_idNumber').removeClass('waringform');
		};
		$scope.relationTable = {
				autoQuery:false,
				params : $scope.queryParam = {
						"pageSize" : 10,
						"indexNo" : 0	
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'nonFinanTenanceHist.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						var aa = data.returnData.rows;
						if(data.returnData.rows == null || data.returnData.rows.length == 0){
							if($scope.nonFinanTenanceList.logLevel == "C"){
								$scope.showCNonFinanTenanceHistDiv =true;
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if($scope.nonFinanTenanceList.logLevel == "A"){
								$scope.showANonFinanTenanceHistDiv =true;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if($scope.nonFinanTenanceList.logLevel == "P"){
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =true;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if($scope.nonFinanTenanceList.logLevel == "M"){
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =true;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if($scope.nonFinanTenanceList.logLevel == "D"){
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =true;
							}else{
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =true;
								$scope.showDNonFinanTenanceHistDiv =false;
							}
						}else{
							if(data.returnData.rows[0].logLevel == "C"){
								$scope.showCNonFinanTenanceHistDiv =true;
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if(data.returnData.rows[0].logLevel == "A"){
								$scope.showANonFinanTenanceHistDiv =true;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if(data.returnData.rows[0].logLevel == "P"){
								$scope.showPNonFinanTenanceHistDiv =true;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if(data.returnData.rows[0].logLevel == "M"){
								$scope.showMNonFinanTenanceHistDiv =true;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}else if(data.returnData.rows[0].logLevel == "D"){
								$scope.showDNonFinanTenanceHistDiv =true;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showMNonFinanTenanceHistDiv =false;
							}else{
								$scope.showMNonFinanTenanceHistDiv =true;
								$scope.showCNonFinanTenanceHistDiv =false;
								$scope.showANonFinanTenanceHistDiv =false;
								$scope.showPNonFinanTenanceHistDiv =false;
								$scope.showDNonFinanTenanceHistDiv =false;
							}
						}
					}
				}
			};
		//查询
		$scope.nonFinanTenanceList = {};
		$scope.queryNonFinanTenanceHistHistory = function () {
			if(($scope.nonFinanTenanceList.idType == null || $scope.nonFinanTenanceList.idType == ''|| $scope.nonFinanTenanceList.idType == undefined) &&
					($scope.nonFinanTenanceList.customerNo == null || $scope.nonFinanTenanceList.customerNo == ''|| $scope.nonFinanTenanceList.customerNo == undefined) &&
					($scope.nonFinanTenanceList.idNumber == "" || $scope.nonFinanTenanceList.idNumber== undefined)
					&& ($scope.nonFinanTenanceList.externalIdentificationNo == "" || $scope.nonFinanTenanceList.externalIdentificationNo== undefined) ){
				jfLayer.alert(T.T('KHJ1100008'));//"请输入身份证号外部识别号其中一个！"
			}else if($scope.nonFinanTenanceList.logLevel == undefined || $scope.nonFinanTenanceList.logLevel ==""){
				jfLayer.alert(T.T('KHJ1100012'));//"请选择维护历史类型！"
			}else if($scope.nonFinanTenanceList.startDate>$scope.nonFinanTenanceList.endDate){
				jfLayer.alert(T.T('KHJ1100010'));//"开始时间应小于结束时间！"
			}
			else {
				if($scope.nonFinanTenanceList["idType"] ){
					if($scope.nonFinanTenanceList["idNumber"] == null || $scope.nonFinanTenanceList["idNumber"] == undefined || $scope.nonFinanTenanceList["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showCNonFinanTenanceHistDiv =false;
						$scope.showANonFinanTenanceHistDiv =false;
						$scope.showPNonFinanTenanceHistDiv =false;
						$scope.showMNonFinanTenanceHistDiv =false;
						$scope.showDNonFinanTenanceHistDiv =false;
					}else {
						$scope.relationTable.params.organNo = $scope.organization;
						$scope.relationTable.params.adminFlag = $scope.adminFlag;
						$scope.relationTable.params = Object.assign($scope.relationTable.params ,$scope.nonFinanTenanceList);
						$scope.relationTable.idNumber = $scope.nonFinanTenanceList.idNumber;
						$scope.relationTable.externalIdentificationNo =  $scope.nonFinanTenanceList.externalIdentificationNo;
						$scope.relationTable.search();
					}
				}else if($scope.nonFinanTenanceList["idNumber"]){
					if($scope.nonFinanTenanceList["idType"] == null || $scope.nonFinanTenanceList["idType"] == undefined || $scope.nonFinanTenanceList["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showCNonFinanTenanceHistDiv =false;
						$scope.showANonFinanTenanceHistDiv =false;
						$scope.showPNonFinanTenanceHistDiv =false;
						$scope.showMNonFinanTenanceHistDiv =false;
						$scope.showDNonFinanTenanceHistDiv =false;
					}else {
						$scope.relationTable.params.organNo = $scope.organization;
						$scope.relationTable.params.adminFlag = $scope.adminFlag;
						$scope.relationTable.params = Object.assign($scope.relationTable.params ,$scope.nonFinanTenanceList);
						$scope.relationTable.idNumber = $scope.nonFinanTenanceList.idNumber;
						$scope.relationTable.externalIdentificationNo =  $scope.nonFinanTenanceList.externalIdentificationNo;
						$scope.relationTable.search();
					}
				}else {
					$scope.relationTable.params.organNo = $scope.organization;
					$scope.relationTable.params.adminFlag = $scope.adminFlag;
					$scope.relationTable.params = Object.assign($scope.relationTable.params ,$scope.nonFinanTenanceList);
					$scope.relationTable.idNumber = $scope.nonFinanTenanceList.idNumber;
					$scope.relationTable.externalIdentificationNo =  $scope.nonFinanTenanceList.externalIdentificationNo;
					$scope.relationTable.search();
				}
			}
		};
		//查询详情
		$scope.checkNonFinanTenanceInf = function(event) {
			$scope.nonFinanTenancInf = $.parseJSON(JSON.stringify(event));
			console.log(event.logLevel);
			var logLevel = event.logLevel;
			$scope.nonFinanTenancInf.relativeTableName = event.relativeTableName;
			var relativeTableName = event.relativeTableName;
			if(null != relativeTableName){
				var relativeTableNameList = relativeTableName.split(".");
				$scope.nonFinanTenancInf.relativeTableName = relativeTableNameList[relativeTableNameList.length-1];
			}
			$scope.item =$.extend($scope.item , $scope.nonFinanTenanceList);
			if(logLevel == "C"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/tenanceHist/cNonFinanTenanceHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1100011'),//'非金融维护历史详情',
							buttons : [ T.T('F00012')],//'关闭' 
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
			}else if(logLevel == "A"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/tenanceHist/aNonFinanTenanceHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1100011'),//'非金融维护历史详情',
							buttons : [ T.T('F00012')],//'关闭' 
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
			}else if(logLevel == "P"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/tenanceHist/pNonFinanTenanceHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1100011'),//'非金融维护历史详情',
							buttons : [ T.T('F00012')],//'关闭' 
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
			}else if(logLevel == "M"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/tenanceHist/mNonFinanTenanceHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1100011'),// '非金融维护历史详情'
							buttons : [ T.T('F00012')],//'关闭' 
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
			}else if(logLevel == "D"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/tenanceHist/dNonFinanTenanceHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1100011'),//'非金融维护历史详情',
							buttons : [ T.T('F00012')],//'关闭' 
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
			}else{
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/tenanceHist/mNonFinanTenanceHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1100011'),//'非金融维护历史详情',
							buttons : [ T.T('F00012')],//'关闭' 
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
			}
		};
	});
	//非金融维护历史查询
	webApp.controller('cNonFinanTenanceHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/tenanceHist/i18n_nonFinanTenanceHist');
		$translate.refresh();
	});
	webApp.controller('aNonFinanTenanceHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/tenanceHist/i18n_nonFinanTenanceHist');
		$translate.refresh();
	});
	webApp.controller('pNonFinanTenanceHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/tenanceHist/i18n_nonFinanTenanceHist');
		$translate.refresh();
	});
	webApp.controller('mNonFinanTenanceHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/tenanceHist/i18n_nonFinanTenanceHist');
		$translate.refresh();
	});
	webApp.controller('dNonFinanTenanceHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/tenanceHist/i18n_nonFinanTenanceHist');
		$translate.refresh();
	});
});