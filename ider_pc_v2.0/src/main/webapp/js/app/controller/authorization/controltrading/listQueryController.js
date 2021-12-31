'use strict';
define(function(require) {
	var webApp = require('app');
	// 交易限制维护及查询
	webApp.controller('listTradListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_list');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
			//自定义下拉框---------限制层级
		$scope.commArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_limitLevel",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//运营模式======法人实体下默认缺省运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{
	        	corporationEntityNo:$scope.corporationId,
	        	requestType:1,
	        	resultType:1,
	        	adminFlagLogin:$scope.adminFlagAuth
	        	},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//币种
		 $scope.moneyArray ={ 
		        type:"dynamic", 
		        param:{
			 corporationEntityNo:$scope.corporationId,
			 requestType:1,
			 resultType:1,
			 adminFlagLogin:$scope.adminFlagAuth
		 },//默认查询条件 
		        text:"accountCurrency", //下拉框显示内容，根据需要修改字段名称 
		        value:"accountCurrency",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"legalEntity.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 $scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
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
	   	   			if($scope.eventList.search('AUS.PM.02.0311') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.02.0312') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.02.0313') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.02.0313') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
   				}
   			});
   			$scope.isshowb = false;
   			$scope.listCodeArr ={ };
   			var form = layui.form;
  			form.on('select(getOperationMode)',function(event){
  				if(event.value){
		  		//管控场景码
				 $scope.listCodeArr ={ 
  		  		        type:"dynamicDesc", 
  		  		        param:{
  		  		        	operationMode:event.value,
  		  		        	differentType:'0',
  		  		        	},//默认查询条件 
  		  		        text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称 
  		  		        desc:"contrlSceneDesc",
  		  		        value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
  		  		        resource:"diffQueryb.query",//数据源调用的action 
  		  		        callback: function(data){
  		  		        	
  		  		        }
  		  		    };
  				}
  			});
		//清单限制查询
		$scope.itemListb = {
			params : $scope.queryParam = {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery:false,
			resource : 'listQueryb.queryList',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_limitLevel'],//查找数据字典所需参数
			transDict : ['levelFlag_levelFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询按钮事件
		$scope.seachQuota = function(){
			if($scope.operationMode){
				$scope.itemListb.params.operationMode = $scope.operationMode;
				$scope.itemListb.params.listLimitCode = $scope.listLimitCode;
				$scope.itemListb.params.levelFlag = $scope.levelFlag;
				$scope.itemListb.params.differentCode = $scope.differentCode;
				$scope.itemListb.search();
	   			$scope.isshowb = true;
			}else{
				$scope.isshowb = false;
				jfLayer.fail(T.T('SQJ2200010'));
			}
		};
		//查询详情事件
		$scope.selectList = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/listTradInfo.html', $scope.item, {
				title : T.T('SQJ1900001'),
				buttons : [ T.T('F00012')],
				size : [ '950px', '430px' ],
				callbacks : [ ]
			});
		};
		//新增事件
		$scope.addList = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/authorization/controltrading/listTradAdd.html', '', {
				title : T.T('SQJ1900002'),
				buttons : [ T.T('F00031'), T.T('F00012')],
				size : [ '970px', '430px' ],
				callbacks : [$scope.saveListInfo ]
			});
		};
    	// 保存信息事件
		$scope.saveListInfo = function(result) {
			$scope.limitAddInfo = {};
			$scope.limitAddInfo = $.parseJSON(JSON.stringify(result.scope.limit));
            $scope.limitAddInfo.limitDayTrans = '0';
            $scope.limitAddInfo.limitCycleTrans = '0';
            $scope.limitAddInfo.limitMonthTrans = '0';
            $scope.limitAddInfo.limitHalfYearTrans = '0';
            $scope.limitAddInfo.limitYearTrans = '0';
            $scope.limitAddInfo.limitLifeCycleTrans = '0';
            $scope.limitAddInfo.numberDayTrans = '0';
            $scope.limitAddInfo.numberCycleTrans = '0';
            $scope.limitAddInfo.numberMonthTrans = '0';
            $scope.limitAddInfo.numberHalfYearTrans = '0';
            $scope.limitAddInfo.numberYearTrans = '0';
            $scope.limitAddInfo.numberLifeCycleTrans = '0';
            jfRest.request('listQueryb', 'save', $scope.limitAddInfo).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('F00058'));
                	$scope.safeApply();
	    			result.cancel();
	    			//$scope.seachQuota();
                }
            });
		};
		//修改事件
		$scope.updateInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			$scope.modal('/authorization/controltrading/listTradUpdate.html', $scope.item, {
				title : T.T('SQJ1900003'),
				buttons : [T.T('F00031'), T.T('F00012')],
				size : [ '950px', '430px' ],
				callbacks : [ $scope.saveList]
			});
		};
		//删除
		$scope.delInfo = function(event) {
			// 页面弹出框事件(弹出页面)
			$scope.item = {};
			$scope.item = $.parseJSON(JSON.stringify(event));
			console.log($scope.item);
			$scope.modal('/authorization/controltrading/listTradDel.html', $scope.item, {
				title : T.T('SQJ1900004'),
				buttons : [T.T('F00016'), T.T('F00108')],
				size : [ '950px', '430px' ],
				callbacks : [ $scope.delInfoSure ]
			});
		};
		//删除事件
		$scope.delInfoSure = function(result) {
			$scope.delItem = $scope.item;
			jfLayer.confirm(T.T('SQJ1900005'),function() {
				$scope.delItem.invalidFlag = "1";
				jfRest.request('listQueryb', 'updatelimit', $scope.delItem).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.alert(T.T('F00037'));
						$scope.delItem = {};
						$scope.differentType = "";
						$scope.differentCode = "";
						$scope.safeApply();
						result.cancel();
						//$scope.seachQuota();
					}
				});
			},function() {
			});
		};
		// 修改弹出页面==============回调函数/确认按钮事件
		$scope.saveList = function(result) {
			$scope.item.limitDayTrans = '0';
            $scope.item.limitCycleTrans = '0';
            $scope.item.limitMonthTrans = '0';
            $scope.item.limitHalfYearTrans = '0';
            $scope.item.limitYearTrans = '0';
            $scope.item.limitLifeCycleTrans = '0';
            $scope.item.numberDayTrans = '0';
            $scope.item.numberCycleTrans = '0';
            $scope.item.numberMonthTrans = '0';
            $scope.item.numberHalfYearTrans = '0';
            $scope.item.numberYearTrans = '0';
            $scope.item.numberLifeCycleTrans = '0';
            delete $scope.item['invalidFlag'];
            jfRest.request('listQueryb', 'updatelimit', $scope.item).then(function(data) {
				if (data.returnMsg == 'OK') {
					jfLayer.alert(T.T('F00022'));
					$scope.item = {};
					$scope.differentType = "";
					$scope.differentCode = "";
					$scope.safeApply();
					result.cancel();
					//$scope.seachQuota();
				}
			});
		};
	});
	//新增
	webApp.controller('listTradAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
		$scope.corporationId = sessionStorage.getItem("corporation");
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{
	        	corporationEntityNo:$scope.corporationId,
	        	requestType:1,
	        	resultType:1,
	        	adminFlagLogin:$scope.adminFlagAuth
	        	},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"legalEntity.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 $scope.listCodeAddArr ={ };
		 $scope.moneyArray ={};
	        //联动验证
	        var form = layui.form;
			form.on('select(getOperationModeAdd)',function(event){
				if(event.value){
			  		//管控场景码
		  			 $scope.listCodeAddArr ={ 
		  		        type:"dynamicDesc", 
		  		        param:{
		  		        	operationMode:event.value,
		  		        	differentType:'0',
		  		        	},//默认查询条件 
		  		        text:"contrlSceneCode", //下拉框显示内容，根据需要修改字段名称 
		  		        desc:"contrlSceneDesc",
		  		        value:"contrlSceneCode",  //下拉框对应文本的值，根据需要修改字段名称 
		  		        resource:"diffQueryb.query",//数据源调用的action 
		  		        callback: function(data){
		  		        	
		  		        }
		  		    };
		  			//币种
		  			 $scope.moneyArray ={ 
		  			        type:"dynamic", 
		  			        param:{
		  				 "operationMode":event.value,
		  			 },//默认查询条件 
		  			        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		  			        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		  			        resource:"operatCurrency.query",//数据源调用的action 
		  			        callback: function(data){
		  			        	 
		  			        }
		  			    }; 
				}
			});
			//自定义下拉框---------限制层级
			$scope.commArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_limitLevel",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
			};
	});
});
