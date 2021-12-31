'use strict';
define(function(require) {
	var webApp = require('app');
	//卡bin查询及维护
	webApp.controller('resNumberMaintCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0045') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0042') != -1){    //修改
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
  				}
  			});
		$scope.cardScheme = [{name:"VISA",id:"V"},{name:"Mastercard",id:"M"},{name:"JCB",id:"J"},{name:"AMEX",id:"A"},{name:"CUP",id:"C"}];//
		$scope.cardType = [{name:T.T('PZJ1000001'),id:"1"},{name:T.T('PZJ1000002'),id:"2"},{name:T.T('PZJ1000003'),id:"3"},{name:T.T('PZJ1000004'),id:"4"}];//
		$scope.userName = sessionStorage.getItem("userName");   //获取登陆人员
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		$scope.organization = $scope.userInfo.organization;  //获取组织机构
		$scope.queryParam = {
				organNo : $scope.organization
		};
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
				$scope.resNumTable.params.corporationEntityNo = $scope.corporationEntityNo;
				$scope.resNumTable.search();
				$("#corporationEntityNoId").attr("readonly",true);
			}
			});
		$scope.resetChose = function(){
			if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
				$scope.resNumTable.params={"corporationEntityNo":$scope.corporationEntityNo};
			}else{
				$scope.resNumTable.params={};
			}
		};
		$scope.resNumTable = {
//				checkType : 'radio', // 当为checkbox时为多选
				params : {
						autoQuery : false,
						"corporationEntityNo":$scope.corporationEntityNo,
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'resNumber.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//卡bin列表
		 $scope.currencyArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
			        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"currency.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//删除
			$scope.deleteResNum = function(item) {
				$scope.items = $.parseJSON(JSON.stringify(item));
				jfLayer.confirm(T.T('YYJ400039'),function() {
					jfRest.request('resNumber', 'update', $scope.items).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.alert(T.T('F00037'));
							$scope.items = {};
							$scope.resNumTable.search();
						}
					});
				},function() {
				});
			};
		//修改
		$scope.updateResNum = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/resNumber/updateResNumber.html', $scope.items, {
				title : T.T('PZJ1000007'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : []
			});
		};
		//保存
		$scope.saveResNumInf = function (result){
			$scope.items.settlementCurrency = result.scope.updateSettlementCurrency;
			jfRest.request('resNumber', 'update', $scope.items)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.resNumTable.search();
				}
			});
		}
	});
	webApp.controller('updateResNumCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
	});
});
