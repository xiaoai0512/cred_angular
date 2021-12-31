'use strict';
define(function(require) {
	var webApp = require('app');
	//预留特殊号码卡量查询
	webApp.controller('resSpecialNumberListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.upBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.UP.02.0051') != -1){   //修改
	   					$scope.upBtnFlag = true;
	   				}
	   				else{
	   					$scope.upBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.AD.02.0050') != -1){   //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.IQ.02.0056') != -1){   //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
  				}
  			});
  		$scope.userName = sessionStorage.getItem("userName");   //获取登陆人员
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		$scope.organization = $scope.userInfo.organization;  //获取组织机构
		$scope.queryParam = {
				organNo : $scope.organization
		};
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			//超级管理员才能更改
			if($scope.adminFlag != "1"){
				$scope.resSpecialNumTable.params.corporationEntityNo = $scope.corporationEntityNo;
				$scope.resSpecialNumTable.search();
				$("#corporationEntityNoId").attr("readonly",true);
			}
		});
		//卡bin
		$scope.cardBinArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryBin",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//根据选择卡BIN的条件筛选特殊号码段
		var form = layui.form;
		form.on('select(getCardBin)',function(data){
			//特殊号码段下拉
			 $scope.segmentNumberArr ={ 
		        type:"dynamic", 
		        param:{cardBin: data.value},//默认查询条件 
		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"resSpecialNoRule.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		});
		$scope.segmentNumberArr={};//选择卡bin后请求接口传参对象初始化，否则报错
		$scope.resSpecialNumTable = {
		 	//checkType : 'radio', // 当为checkbox时为多选
			autoQuery : false,
			params : {
					"corporationEntityNo":$scope.corporationEntityNo,
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'resSpecialNumber.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
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
							$scope.resSpecialNumTable.search();
						}
					});
				},function() {
				});
			};
		//新增	
		$scope.addResSpecialNumTable = function(){	
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/resNumber/resSpecialNumberEst.html', '', {
				title : T.T('YYJ5300013'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '320px' ],
				callbacks : [$scope.addResSpecialNum]
			});
		};
		//新增保存预留特殊号码卡量
		$scope.addResSpecialNum = function(result){
			$scope.resSpecialNumInf = {};
			$scope.resSpecialNumInf = result.scope.resSpecialNumInf;
			var newRules = new RegExp("^[0-9]{0,8}$");
			if(!newRules.test($scope.resSpecialNumInf.calorimeterValue)){
				jfLayer.fail(T.T('YYJ5300021'));
				return;
			}
			if(!newRules.test($scope.resSpecialNumInf.createCalorimeter)){
				jfLayer.fail(T.T('YYJ5300022'));
				return;
			}
			if($scope.resSpecialNumInf.cardBin.length != 6){
				jfLayer.fail(T.T('PZJ1000006'));
				return;
            }
            jfRest.request('resSpecialNumber','save', $scope.resSpecialNumInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00058')) ;
					$scope.resSpecialNumInf = {};
					result.scope.resSpecialNumForm.$setPristine();
					 $scope.resSpecialNumTable.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//复制
		$scope.copyResSpecialNum = function(event){
			$scope.resSpecialNumInfCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/resNumber/copyResSpecialNumberEs.html', $scope.resSpecialNumInfCopy, {
				title : T.T('YYJ5300014'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '320px' ],
				callbacks : [$scope.copyResSpecialNumCallback]
			});		
		};
		//复制页面回调函数
		$scope.copyResSpecialNumCallback = function(result){
			$scope.resSpecialNumCopy = {};
			$scope.resSpecialNumCopy = result.scope.resSpecialNumInfCopy;
			if($scope.resSpecialNumCopy.cardBin.length != 6){
				jfLayer.fail(T.T('PZJ1000006'));
				return;
            }
            jfRest.request('resSpecialNumber','save', $scope.resSpecialNumCopy).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00058')) ;
					$scope.resSpecialNumCopy = {};
					result.scope.resSpecialNumForm.$setPristine();
					 $scope.resSpecialNumTable.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//修改
		$scope.updateResSpecialNum = function(item) {
			// 页面弹出框事件(弹出页面)
			//$scope.item = item;
			$scope.resSpecialNumInf = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/resNumber/updateResSpecialNumber.html', $scope.resSpecialNumInf, {
				title : T.T('PZJ1000008'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '380px' ],
				callbacks : [$scope.saveResSpecialNumInf ]
			});
		};
		//保存
		$scope.saveResSpecialNumInf = function (result){
			$scope.items = result.scope.resSpecialNumInf;
			var newRules = new RegExp("^[0-9]{0,8}$");
			if(!newRules.test($scope.items.calorimeterValue)){
				jfLayer.fail(T.T('YYJ5300021'));
				return;
			}
			if(!newRules.test($scope.items.createCalorimeter)){
				jfLayer.fail(T.T('YYJ5300022'));
				return;
			}
			jfRest.request('resSpecialNumber', 'update', $scope.items)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
					 result.cancel();
					 $scope.resSpecialNumTable.search();
				}
			});
		}
	});
	//修改
	webApp.controller('updateResSpecialNumCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.resSpecialNumInf = $scope.resSpecialNumInf;
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#lay_resSpeci_zs',
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
						$scope.resSpecialNumInf.prevDate = $("#lay_resSpeci_zs").val();
					}
				});
				var endDate = laydate.render({
					elem: '#lay_resSpeci_zn',
					//min:Date.now(),
					done: function(value, date) {
						startDate.config.max = {
							year: date.year,
							month: date.month - 1,
							date: date.date,
						};
						$scope.resSpecialNumInf.nextDate = $("#lay_resSpeci_zn").val();
					}
				});
		});
		//日期控件end
	});
	//新增
	//预留特殊号码卡量建立
	webApp.controller('resSpecialNumberEstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.resSpecialNumInf = {};
		//卡bin
		 $scope.cardBinArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryBin",//数据源调用的action 
	        callback: function(data){
	        }
	    };
	 	//根据选择卡BIN的条件筛选特殊号码段
		var form = layui.form;
		form.on('select(getCardBin)',function(data){
			//特殊号码段下拉
			 $scope.segmentNumberArr ={ 
		        type:"dynamic", 
		        param:{cardBin: data.value},//默认查询条件 
		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"resSpecialNoRule.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		});
		$scope.segmentNumberArr={};//选择卡bin后请求接口传参对象初始化，否则报错
		$scope.userName = sessionStorage.getItem("userName");   //获取登陆人员
			$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
			$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
			$scope.organization = $scope.userInfo.organization;  //获取组织机构
			$scope.queryParam = {
					organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if($scope.adminFlag != "1"){//超级管理员才能更改
					$scope.resSpecialNumInf.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporationEntityNoId").attr("readonly",true);
				}
				});
			$scope.resetChose = function(){
				if($scope.adminFlag != "1"){//超级管理员才能更改
					$scope.resSpecialNumTable.params={"corporationEntityNo":$scope.corporationEntityNo};
				}else{
					$scope.resSpecialNumTable.params={};
				}
			} 
	});
	//复制
	//预留特殊号码卡量建立复制
	webApp.controller('resSpecialNumberEstCtrlCopy', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.userName = sessionStorage.getItem("userName");
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		$scope.resSpecialNumInf = {};
		//卡bin
		$scope.cardBinArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryBin",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//根据选择卡BIN的条件筛选特殊号码段
		var form = layui.form;
		form.on('select(getCardBin)',function(data){
			//特殊号码段下拉
			 $scope.copyNumberArr ={ 
		        type:"dynamic", 
		        param:{cardBin: data.value},//默认查询条件 
		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"resSpecialNoRule.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		});
		$scope.copyNumberArr={};//选择卡bin后请求接口传参对象初始化，否则报错
		$scope.userName = sessionStorage.getItem("userName");   //获取登陆人员
			$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
			$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
			$scope.organization = $scope.userInfo.organization;  //获取组织机构
			$scope.queryParam = {
					organNo : $scope.organization
			};
			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
				if($scope.adminFlag != "1"){//超级管理员才能更改
					$scope.resSpecialNumInf.corporationEntityNo = $scope.corporationEntityNo;
					$("#corporationEntityNoId").attr("readonly",true);
				}
			});
			$scope.resetChose = function(){
				if($scope.adminFlag != "1"){//超级管理员才能更改
					$scope.resSpecialNumTable.params={"corporationEntityNo":$scope.corporationEntityNo};
				}else{
					$scope.resSpecialNumTable.params={};
				}
			} 
	});
});
