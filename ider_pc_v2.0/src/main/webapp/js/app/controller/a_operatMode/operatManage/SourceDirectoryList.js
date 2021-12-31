'use strict';
	define(function(require) {
	var webApp = require('app');
	// 交易来源
	webApp.controller('SourceDirectoryListCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.organization = $scope.userInfo.organization;
		
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		//根据菜单和当前登录者查询有权限的事件编号
			$scope.menuNoSel = $scope.menuNo;
			$scope.paramsNo = {
				menuNo: $scope.menuNoSel
			};
			jfRest.request('accessManage', 'selEvent', $scope.paramsNo).then(function(data) {
				if (data.returnData != null || data.returnData != "") {
					for (var i = 0; i < data.returnData.length; i++) {
						$scope.eventList += data.returnData[i].eventNo + ",";
					}
					if ($scope.eventList.search('COS.IQ.02.0011') != -1) { //查询
						$scope.selBtnFlag = true;
					} else {
						$scope.selBtnFlag = false;
					}
					if ($scope.eventList.search('COS.AD.02.0011') != -1) { //新增
						$scope.addBtnFlag = true;
					} else {
						$scope.addBtnFlag = false;
					}
					if ($scope.eventList.search('COS.UP.02.0011') != -1) { //修改
						$scope.updBtnFlag = true;
					} else {
						$scope.updBtnFlag = false;
					}
				}
			});
			$scope.userName = sessionStorage.getItem("userName"); //获取登陆人员
			$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
			$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
			$scope.organization = $scope.userInfo.organization; //获取组织机构
	  		//查询法人实体
	  		$scope.queryCorporationS = function(){
				$scope.queryParam = {
					organNo : $scope.organization
				};
				jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
					$scope.corporationEntityNo='';
					$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				});
			};
			$scope.queryCorporationS();
			//来源目录列表
			$scope.sourceDirectoryQuery = {
				params : {
					"corporationEntityNo": $scope.paramsNo.corporation,
					"pageSize": 10,
					"indexNo": 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'SourceDirectoryEvent.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_redOriginFlag'],//查找数据字典所需参数
				transDict : ['originFlag_originFlagDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			//来源目录下拉框,根据
			$scope.sourceDirectoryQueryArr ={ 
		        type:"dynamic", 
		        param:{
		        	"corporationEntityNo": $scope.paramsNo.corporation,
		        },//默认查询条件 
		        text:"listDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"originList",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"SourceDirectoryEvent.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		
			// 查看
			$scope.sourceDirectoryDetails = function(event) {
				$scope.seeInfo = $.parseJSON(JSON.stringify(event));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/optcenter/SourceDirectory/viewSourceDirectory.html',
				$scope.seeInfo, {
					title : T.T('YYJ1600011'),
					buttons : [ T.T('F00012') ],
					size : [ '1050px', '320px' ],
					callbacks : []
				});
			};
			//新增
			$scope.addSourceDirectoryInfo = function(event){
				// 页面弹出框事件(弹出页面);
				$scope.events = {};
				$scope.events = event;
				$scope.modal('/a_operatMode/optcenter/SourceDirectory/addSourceDirectory.html', $scope.events, {
					title : T.T('YYJ1600012'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '900px', '320px' ],
					callbacks : [$scope.saveTransaction]
				});
			};
		//新增回调函数
		$scope.saveTransaction = function(result){
			$scope.sourceDirectoryAdd = {};
			$scope.sourceDirectoryAdd = result.scope.addInfo;
			$scope.sourceDirectoryAdd.corporationEntityNo = result.scope.corporationEntityNo;
			jfRest.request('SourceDirectoryEvent', 'addQuery', $scope.sourceDirectoryAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.sourceDirectoryAdd = {};
					$scope.sourceDirectoryQuery.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 修改
		$scope.updateSourceDirectory = function(event) {
			$scope.sourceDirectoryInfo = {};
			$scope.sourceDirectoryInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/SourceDirectory/updateSourceDirectory.html',$scope.sourceDirectoryInfo, {
				title : T.T('YYJ1600013'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '1050px', '320px' ],
				callbacks : [ $scope.updateSourceDirectoryInfo]
			});
		};
		$scope.updateSourceDirectoryInfo = function(result) {  
			$scope.updateInfo = result.scope.sourceDirectoryInf;
			jfRest.request('SourceDirectoryEvent', 'update', $scope.updateInfo) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.sourceDirectoryQuery.search();
				}
			});
		};
		//删除
		$scope.deleteSourceDirectory =  function(event) {
			$scope.accRuleSubSubjectInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ1600014"),function(){//确定
				jfRest.request('SourceDirectoryEvent', 'deleteInfo', $scope.accRuleSubSubjectInf) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.sourceDirectoryQuery.search();
					}
				});
			},function(){//取消
			})
		};
	});
	//查看
	webApp.controller('viewSourceDirectoryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.seeInfos=$scope.seeInfo;
		$scope.seeInfos.originFlag=$scope.seeInfo.originFlag;
		$scope.redOriginFlag ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_redOriginFlag",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.originFlagInfo = $scope.seeInfo.originFlag;
	        }
		};
	});
	//修改
	webApp.controller('updateSourceDirectory', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
		$translate.refresh();
		$scope.sourceDirectoryInf ={};
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.sourceDirectoryInf=$scope.sourceDirectoryInfo;
		//$scope.sourceDirectoryInf.originFlag=$scope.sourceDirectoryInfo.originFlag;
		$scope.sourceDirectoryInf.adminFlag=$scope.adminFlag;
		//查询法人实体
  		$scope.queryCorporation = function(){
			$scope.queryParam = {
				organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
					$scope.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporation").attr("disabled",true);
				}
			});
		};
		$scope.queryCorporation();
	});
	//新增来源目录
	webApp.controller('addSourceDirectoryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.addInfo = {};
		$scope.corporationEntityNo=$scope.events;//法人编号
	});
});