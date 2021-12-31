'use strict';
	define(function(require) {
	var webApp = require('app');
	// 交易来源
	webApp.controller('tradingSourceCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
		 $scope.delBtnFlag = false;
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
	   	   		if($scope.eventList.search('COS.IQ.02.0069') != -1){    //查询
   					$scope.selBtnFlag = true;
   				}
   				else{
   					$scope.selBtnFlag = false;
   				}
			   	if($scope.eventList.search('COS.AD.02.0166') != -1){    //新增
					$scope.addBtnFlag = true;
					}
				else{
					$scope.addBtnFlag = false;
				}
		   	   	if($scope.eventList.search('COS.UP.02.0152') != -1){    //修改
   					$scope.updBtnFlag = true;
   				}
   				else{
   					$scope.updBtnFlag = false;
   				}
		   	   	if($scope.eventList.search('COS.UP.02.0153') != -1){    //删除
					$scope.delBtnFlag = true;
				}
				else{
					$scope.delBtnFlag = false;
				}
			}
		});
  		//查询法人实体
  		$scope.queryCorporation = function(){
			$scope.queryParam = {
				organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo='';
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			});
		};
		$scope.queryCorporation();
		$scope.redOriginFlag ={ 
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
		//交易来源下拉框,根据
		$scope.transOriginArr ={ 
	        type:"dynamic", 
	        param:{
	        	organNo : $scope.corporationEntityNo
	        },//默认查询条件 
	        text:"transOrigin", //下拉框显示内容，根据需要修改字段名称 
	        value:"transOrigin",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"tradingSourceInterface.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//交易来源列表
		$scope.tradingSourceList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'tradingSourceInterface.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_redOriginFlag'],//查找数据字典所需参数
			transDict : ['originFlag_originFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 查看
		$scope.transactionDetails = function(event) {
			$scope.seeInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/transactionList/viewTradingSource.html',
			$scope.seeInfo, {
				title : T.T('YYJ1600002'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '320px' ],
				callbacks : []
			});
		};
		//新增
		$scope.addTransactionInfo = function(event){
			// 页面弹出框事件(弹出页面);
			$scope.events = event;
			$scope.modal('/a_operatMode/optcenter/transactionList/addTransactionSource.html', $scope.events, {
				title : T.T('YYJ1600001'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '420px' ],
				callbacks : [$scope.saveTransaction]
			});
		};
		//新增回调函数
		$scope.saveTransaction = function(result){
			$scope.transIdentyInfoAdd = {};
			$scope.transIdentyInfoAdd = result.scope.addInfo;
			$scope.transIdentyInfoAdd.originList = result.scope.addInfo.originList;
			jfRest.request('tradingSourceInterface', 'addQuery', $scope.transIdentyInfoAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.transIdentyInfoAdd = {};
					result.scope.transIdentyAddForm.$setPristine();
					$scope.tradingSourceList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 修改
		$scope.updateTransactionSource = function(event) {
			$scope.transactionInfo = {};
			$scope.transactionInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/optcenter/transactionList/updateTradingSource.html',$scope.transactionInfo, {
				title : T.T('YYJ1600003'),
				buttons : [ T.T('F00107'), T.T('F00012')  ],
				size : [ '1050px', '420px' ],
				callbacks : [ $scope.updateTransIdenty]
			});
		};
		$scope.updateTransIdenty = function(result) {  
			$scope.updateTransIdentyInf = {};
			$scope.updateTransIdentyInf.originList =result.scope.originListUpdate;
			$scope.updateTransIdentyInf.originDesc = result.scope.transIdentyInf.originDesc;
			$scope.updateTransIdentyInf.transOrigin = result.scope.transIdentyInf.transOrigin;
			$scope.updateTransIdentyInf.corporationEntityNo = result.scope.transIdentyInf.corporationEntityNo;
			$scope.updateTransIdentyInf.id = result.scope.transIdentyInf.id;
			jfRest.request('tradingSourceInterface', 'update', $scope.updateTransIdentyInf	) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.tradingSourceList.search();
				}
			});
		};
		//删除
		$scope.deleteArtifactInstan =  function(event) {
			$scope.accRuleSubSubjectInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ1600009"),function(){//确定
				jfRest.request('tradingSourceInterface', 'deleteInfo', $scope.accRuleSubSubjectInf) .then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.tradingSourceList.search();
					}
				});
			},function(){//取消
			})
		};
	});
	//查看
	webApp.controller('viewTransIdentyCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.seeInfos=$scope.seeInfo;
		$scope.seeInfos.originFlag=$scope.seeInfo.originFlag;
		 $scope.redOriginFlag ={ 
	       type:"dynamic", 
	        param:{
	        	"corporationEntityNo": $scope.paramsNo.corporation,
	        },//默认查询条件 
	        text:"listDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"originList",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"SourceDirectoryEvent.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.listDescInfo = $scope.seeInfo.originList;
	        }
		};
	});
	//修改
	webApp.controller('updateTransIdentyCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal,$timeout, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
		$translate.refresh();
		$scope.transIdentyInf ={};
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.transIdentyInf=$scope.transactionInfo;
		$scope.transIdentyInf.originFlag=$scope.transactionInfo.originFlag;
		$scope.transIdentyInf.adminFlag=$scope.adminFlag;
		//查询法人实体
  		$scope.queryCorporation = function(){
			$scope.queryParam = {
				organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			});
		};
		$scope.queryCorporation();
		
		$scope.redOriginFlag ={};
		$scope.queryRedOriginFlagU = function(){
			$timeout(function(){
        		Tansun.plugins.render('select');
        		$scope.redOriginFlag ={ 
			       type:"dynamic", 
			        param:{
			        	"corporationEntityNo": $scope.corporationEntityNo,
			        },//默认查询条件 
			        text:"listDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"originList",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"SourceDirectoryEvent.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.originListUpdate = $scope.transactionInfo.originList;
			        }
				};
			});
		};
		$scope.queryRedOriginFlagU();
		//新增来源目录
		$scope.updateSourceDirectory = function(event){
			// 页面弹出框事件(弹出页面);
			$scope.events = event;
			$scope.modal('/a_operatMode/optcenter/SourceDirectory/addSourceDirectory.html', $scope.events, {
				title : T.T('YYJ1600012'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [$scope.saveSourceDirectoryU]
			});
		};
		//新增回调函数
		$scope.saveSourceDirectoryU = function(result){
			$scope.sourceDirectoryAdd = {};
			$scope.sourceDirectoryAdd = result.scope.addInfo;
			$scope.sourceDirectoryAdd.corporationEntityNo = $scope.corporationEntityNo;
			jfRest.request('SourceDirectoryEvent', 'addQuery', $scope.sourceDirectoryAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.sourceDirectoryAdd = {};
					$scope.redOriginFlag ={};
					$scope.queryRedOriginFlagU();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//新增交易来源
	webApp.controller('addTransactionSourceCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer,$timeout, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.addInfo = {};
		$scope.addInfo.corporationEntityNo=$scope.events;//法人编号
		$scope.redOriginFlag ={};
		$scope.queryRedOriginFlag = function(){
			$timeout(function(){
        		Tansun.plugins.render('select');
        		$scope.redOriginFlag ={ 
    				type:"dynamic", 
    		        param:{
    		        	"corporationEntityNo": $scope.addInfo.corporationEntityNo,
    		        },//默认查询条件 
    		        text:"listDesc", //下拉框显示内容，根据需要修改字段名称 
    		        value:"originList",  //下拉框对应文本的值，根据需要修改字段名称 
    		        resource:"SourceDirectoryEvent.query",//数据源调用的action 
    		        callback: function(data){
    		        }
    			};
			});
		};
		$scope.queryRedOriginFlag();
	 	//新增来源目录
		$scope.addSourceDirectory = function(event){
			// 页面弹出框事件(弹出页面);
			$scope.events = event;
			$scope.modal('/a_operatMode/optcenter/SourceDirectory/addSourceDirectory.html', $scope.events, {
				title : T.T('YYJ1600012'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '900px', '320px' ],
				callbacks : [$scope.saveSourceDirectory]
			});
		};
		//新增回调函数
		$scope.saveSourceDirectory = function(result){
			$scope.sourceDirectoryAdd = {};
			$scope.sourceDirectoryAdd = result.scope.addInfo;
			$scope.sourceDirectoryAdd.corporationEntityNo = $scope.addInfo.corporationEntityNo;
			jfRest.request('SourceDirectoryEvent', 'addQuery', $scope.sourceDirectoryAdd).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.sourceDirectoryAdd = {};
					$scope.redOriginFlag ={};
					$scope.queryRedOriginFlag();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//新增来源目录
	webApp.controller('addSourceDirectoryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
	});
});