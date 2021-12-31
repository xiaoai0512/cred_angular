'use strict';
define(function(require) {
	
	var webApp = require('app');
	
	// 非金融维护历史查询
	webApp.controller('userAccessHistQueryCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer,$location,$timeout,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = sessionStorage.getItem("adminFlag");
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
		
		
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  
			  var startDate = laydate.render({
					elem: '#userAccessHistList_zs',
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
					elem: '#userAccessHistList_ze',
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
		//日期控件end
		
		
		$scope.organization = $scope.userInfo.organization;
		$scope.queryParam = {
				organNo : $scope.organization
		};
		
		$scope.customerNoArr ={};
		
		if($scope.adminFlag == "1"){
			//获取所属法人
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				//用户查询
				 $scope.customerNoArr ={
					        type:"dynamic", 
					        param:{"corporationEntityNo":$scope.corporationEntityNo},//默认查询条件 
					        text:"loginName", //下拉框显示内容，根据需要修改字段名称 
					        value:"loginName",  //下拉框对应文本的值，根据需要修改字段名称 
					        resource:"corporateUser.query",//数据源调用的action 
					        callback: function(data1){
					        	
					        }
					    };
			});
		}else{
			//用户查询
			 $scope.customerNoArr ={
				        type:"dynamic", 
				        param:{},//默认查询条件 
				        text:"loginName", //下拉框显示内容，根据需要修改字段名称 
				        value:"loginName",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"userManage.query",//数据源调用的action 
				        callback: function(data2){
				        	
				        }
				    };
        }
        $scope.userAccessHistList = {};
		
		$scope.showCUserAccessHistDiv =false;
		$scope.showAUserAccessHistDiv =false;
		$scope.showPUserAccessHistDiv =false;
		$scope.showMUserAccessHistDiv =false;
		$scope.showDUserAccessHistDiv =false;
		$scope.showRUserAccessHistDiv =false;
		
		//'新增''更新''查询''删除'
		$scope.demoArray1 = [ {
			name : T.T('F00010'),
			id : 'ADD'
		}, {
			name : T.T('F00067'),
			id : 'UPD'
		}, {
			name : T.T('F00009'),
			id : 'INQ'
		}, {
			name : T.T('F00016'),
			id : 'DEL'
		}];
		
		//'客户级''账户级''产品级''媒介级''参数级''客户业务项目级'
		$scope.demoArray2 = [ {
			name : T.T('KHJ1200001'),
			id : 'C'
		}, {
			name : T.T('KHJ1200002'),
			id : 'A'
		}, {
			name : T.T('KHJ1200003'),
			id : 'P'
		}, {
			name : T.T('KHJ1200004'),
			id : 'M'
		}, {
			name : T.T('KHJ1200005'),
			id : 'R'
		}, {
			name : T.T('KHJ1200006'),
			id : 'D'
		}];
		
		
		$scope.reset = function() {
			$scope.userAccessHistList = {};
			$scope.userAccessHistList.startDate = "";
			$scope.userAccessHistList.endDate = "";
		};
		
		$scope.relationTable = {
				autoQuery:false,
				params : $scope.queryParam = {
						"":$scope.userLists,
						"pageSize" : 10,
						"indexNo" : 0	
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'userAccessHist.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						var aa = data.returnData.rows;
						if(data.returnData.rows == null || data.returnData.rows.length == 0){
							if($scope.userAccessHistList.logLevel == "C"){
								$scope.showCUserAccessHistDiv =true;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if($scope.userAccessHistList.logLevel == "A"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =true;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if($scope.userAccessHistList.logLevel == "P"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =true;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if($scope.userAccessHistList.logLevel == "M"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =true;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if($scope.userAccessHistList.logLevel == "D"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =true;
								$scope.showRUserAccessHistDiv=false;
							}else{
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=true;
							}
							
						}else{
							for(var i=0;i<data.returnData.rows.length;i++){
								var relativeTableName = data.returnData.rows[i].relativeTableName.split(".");
								 data.returnData.rows[i].relativeTableName = relativeTableName[relativeTableName.length-1];
							}
							if(data.returnData.rows[0].logLevel == "C"){
								$scope.showCUserAccessHistDiv =true;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if(data.returnData.rows[0].logLevel == "A"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =true;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if(data.returnData.rows[0].logLevel == "P"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =true;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if(data.returnData.rows[0].logLevel == "M"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =true;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=false;
							}else if(data.returnData.rows[0].logLevel == "D"){
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =true;
								$scope.showRUserAccessHistDiv=false;
							}else{
								$scope.showCUserAccessHistDiv =false;
								$scope.showAUserAccessHistDiv =false;
								$scope.showPUserAccessHistDiv =false;
								$scope.showMUserAccessHistDiv =false;
								$scope.showDUserAccessHistDiv =false;
								$scope.showRUserAccessHistDiv=true;
							}
						}
					}
				}
			};
		
		
		//查询
		$scope.queryUserAccessHistQuery = function () {
			if($scope.userAccessHistList.customerNo == undefined || $scope.userAccessHistList.customerNo ==""){
				jfLayer.alert(T.T('KHJ1200007'));//"请选择用户！"
			}else if($scope.userAccessHistList.modifyType == undefined || $scope.userAccessHistList.modifyType ==""){
				jfLayer.alert(T.T('KHJ1200008'));//"请选择访问类别！"
			}else if($scope.userAccessHistList.logLevel == undefined || $scope.userAccessHistList.logLevel ==""){
				jfLayer.alert(T.T('KHJ1200009'));//"请选择访问层级！"
			}else if($scope.userAccessHistList.startDate>$scope.userAccessHistList.endDate){
				jfLayer.alert(T.T('KHJ1200010'));//"开始时间应小于结束时间！"
			}else{
				
				$scope.relationTable.params = Object.assign($scope.relationTable.params ,$scope.userAccessHistList);
				$scope.relationTable.customerNo = $scope.customerNo;
				$scope.relationTable.logLevel = $scope.userAccessHistList.logLevel;
				$scope.relationTable.modifyType = $scope.userAccessHistList.modifyType;
				console.log($scope.relationTable.customerNo);
				$scope.relationTable.search();
				
			}
		};
		
		
		//查询详情
		$scope.checkuserAccessHistInf = function(event) {
			$scope.userAccessHistInf = $.parseJSON(JSON.stringify(event));
			var logLevel = event.logLevel;
			$scope.userAccessHistInf.relativeTableName = event.relativeTableName;
			var relativeTableName = event.relativeTableName;
			
			if(logLevel == "C"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/userAccessHist/cUserAccessHistDetail.html',
						$scope.item, {
							title : T.T('KHJ1200011'),//'用户访问历史详情',
							buttons : [ T.T('F00012') ],//'关闭'
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
				
			}else if(logLevel == "A"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/userAccessHist/aUserAccessHistDetail-JY.html',
						$scope.item, {
							title : T.T('KHJ1200011'),//'用户访问历史详情',
							buttons : [ T.T('F00012') ],//'关闭'
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
				
			}else if(logLevel == "P"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/userAccessHist/pUserAccessHistDetail-JY.html',
						$scope.item, {
							title : T.T('KHJ1200011'),//'用户访问历史详情',
							buttons : [ T.T('F00012') ],//'关闭'
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
				
			}else if(logLevel == "M"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/userAccessHist/mUserAccessHistDetail-JY.html',
						$scope.item, {
							title : T.T('KHJ1200011'),//'用户访问历史详情',
							buttons : [ T.T('F00012') ],//'关闭'
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
				
			}else if(logLevel == "D"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/userAccessHist/dUserAccessHistDetail.html-JY',
						$scope.item, {
							title : T.T('KHJ1200011'),//'用户访问历史详情',
							buttons : [ T.T('F00012') ],//'关闭'
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
				
			}else if(logLevel == "R"){
				// 页面弹出框事件(弹出页面)
//				$scope.item = event;
				$scope.modal('/cstSvc/userAccessHist/rUserAccessHistDetail-JY.html',
						$scope.item, {
							title : T.T('KHJ1200011'),//'用户访问历史详情',
							buttons : [ T.T('F00012') ],//'关闭'
							size : [ '1050px', '500px' ],
							callbacks : [  ]
						});
				
			}
			
		};
		
		});
	
	//用户访问历史查询
	webApp.controller('cUserAccessHistDetailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
	});
	//用户访问历史查询
	webApp.controller('aUserAccessHistDetailCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
	});
	//用户访问历史查询
	webApp.controller('pUserAccessHistDetailCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
	});
	//用户访问历史查询
	webApp.controller('mUserAccessHistDetailCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
	});
	//用户访问历史查询
	webApp.controller('rUserAccessHistDetailCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
	});
	//用户访问历史查询
	webApp.controller('dUserAccessHistDetailCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/userAccessHist/i18n_userAccessHist');
		$translate.refresh();
	});
	
	
});