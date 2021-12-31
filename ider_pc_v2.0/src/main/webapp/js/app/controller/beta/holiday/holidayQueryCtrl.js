'use strict';
define(function(require) {
	
	var webApp = require('app');
	
	//节假日查询及维护
	webApp.controller('holidayQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope,jfLayer,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/holiday/i18n_holiday');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
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
		   	   		if($scope.eventList.search('COS.IQ.02.0041') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
	   				if($scope.eventList.search('COS.UP.02.0067') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0039') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
			$scope.isShow = false;
			$scope.holidayList = {
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				autoQuery:false,
				paging : true,// 默认true,是否分页
				resource : 'holiday.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_holidayStatus'],//查找数据字典所需参数
				transDict : ['holidayStatus_holidayStatusDesc',],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		 	$scope.holidayNoArr ={ 
		        type:"dynamic", 
		        param:{
		        	"holidayNoFlag":1,
		        	"pageSize":10,
					"indexNo":0
					},//默认查询条件 
		        text:"holidayNo", //下拉框显示内容，根据需要修改字段名称 
		        value:"holidayNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"holiday.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		 	$scope.yearNoArr ={ 
		        type:"dynamic", 
		        param:{
		        	"yearFlag":1,
		        	"pageSize":10,
					"indexNo":0
					},//默认查询条件 
		        text:"month", //下拉框显示内容，根据需要修改字段名称 
		        value:"month",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"holiday.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
			var form = layui.form;
			form.on('select(getAccObject)',function(event){
				if(event.value != "" && event.value != null && event.value != undefined){
					 $scope.yearNoArr ={ 
				        type:"dynamic", 
				        param:{
				        	"holidayNo":event.value,
				        	"yearFlag":1,
				        	"pageSize":10,
							"indexNo":0
							},//默认查询条件 
				        text:"month", //下拉框显示内容，根据需要修改字段名称 
				        value:"month",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"holiday.query",//数据源调用的action 
				        callback: function(data){
				        }
				    };
				}
			});
			//删除
			$scope.deleteHoliday = function(item) {
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.items.month = $scope.items.year + $scope.items.month;
				jfLayer.confirm(T.T('YYJ400039'),function() {
					jfRest.request('holiday', 'deleteHoliday', $scope.items).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.alert(T.T('F00037'));
							$scope.items = {};
							$scope.holidayList.search();
						}
					});
				},function() {
				});
			};
		//查询按钮事件
		$scope.seachHoliday = function(){
			if(($scope.holidayList.params.holidayNo == "" || $scope.holidayList.params.holidayNo == undefined || $scope.holidayList.params.holidayNo == null) && 
					($scope.holidayList.params.queryYear == "" || $scope.holidayList.params.queryYear == undefined || $scope.holidayList.params.queryYear == null)){
				$scope.isShow = false;
				 $scope.yearNoArr ={ 
			        type:"dynamic", 
			        param:{
			        	"yearFlag":1,
			        	"pageSize":10,
						"indexNo":0
						},//默认查询条件 
			        text:"month", //下拉框显示内容，根据需要修改字段名称 
			        value:"month",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"holiday.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
				jfLayer.alert(T.T('F00076'));
			}
			else{
				$scope.holidayList.search();
				$scope.isShow = true;
			}
		};
		//查询详情
		$scope.checkHoliday = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.holidayItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/holiday/viewHoliday.html', $scope.holidayItem, {
				title : T.T('PZJ1600004'),
				buttons : [  T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//假日日期--增加
		$scope.tradList =[];
	 	$scope.tradTypeAdd = function(){
	 		if($scope.tradList.length == 30){
	 			$scope.tradBtn = false;
	 			$scope.tradList.splice($scope.tradList.length,0,{});
	 		}
	 		else{
	 			$scope.tradBtn = true;
	 			if($scope.tradList == 0){
		 			$scope.tradList = [{}];
		 		}
		 		else{
		 			$scope.tradList.splice($scope.tradList.length,0,{});
		 		}
	 		}
	 	};
	 	//删除假日日期
	 	$scope.tradDel = function(e,$index){
	 		$scope.tradList.splice($index,1);
	 	};
	 	$scope.holidayArray = [{name : T.T('PZJ1600001') ,id : 'O'},{name : T.T('PZJ1600002') ,id : 'C'}] ;
		//修改
		$scope.updateHoliday= function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.holidayItem = $.parseJSON(JSON.stringify(item));
			$scope.modal('/beta/holiday/updateHoliday.html', $scope.holidayItem, {
				title : T.T('PZJ1600005'),
				buttons : [ T.T('F00107'), T.T('F00012') ],   
				size : [ '800px', '280px' ],
				callbacks : [$scope.saveBlockCodeInf]
			});
		};
		//保存
		$scope.saveBlockCodeInf = function (result){
			jfRest.request('holiday', 'update', $scope.holidayItem)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022') );
					 $scope.safeApply();
					 result.cancel();
					 $scope.holidayList.search();
				}
			});
		}
	});
	webApp.controller('viewHolidayCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.monthArray = 
			[{name : '01' ,id : '1'},{name : '2' ,id : '2'},{name : '3' ,id : '3'},{name : '4' ,id : '4'}
			,{name : '05' ,id : '5'},{name : '6' ,id : '6'},{name : '7' ,id : '7'},{name : '8' ,id : '8'}
			,{name : '09' ,id : '9'},{name : '10' ,id : '10'},{name : '11' ,id : '11'},{name : '12' ,id : '12'}] ;
		$scope.tradList = [];
		var newList = {};
		for(var i=0;i<$scope.holidayItem.dataList.length;i++){
			newList = {"holidayDate":$scope.holidayItem.dataList[i]};
			$scope.tradList.push(newList);
		}
	});
});
