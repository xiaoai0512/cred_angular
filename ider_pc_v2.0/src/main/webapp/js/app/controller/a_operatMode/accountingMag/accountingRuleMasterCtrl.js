'use strict';
define(function(require) {
	var webApp = require('app');
	// 记账规则主表
	webApp.controller('accountingRuleMasterCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer,
		$location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
		$scope.addBtnFlag = false;
		$scope.delBtnFlag = false;
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
				if ($scope.eventList.search('COS.AD.02.0062') != -1) { //新增
					$scope.addBtnFlag = true;
				} else {
					$scope.addBtnFlag = false;
				}
				if ($scope.eventList.search('COS.IQ.02.0115') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0100') != -1) { //修改
					$scope.updBtnFlag = true;
				} else {
					$scope.updBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0061') != -1) { //删除
					$scope.delBtnFlag = true;
				} else {
					$scope.delBtnFlag = false;
				}
			}
		});
		//运营模式
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {}
		};
		//记账规则表
		$scope.accountingRuleMasterList = {
			params: {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息  
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_accountingObject','dic_accountingSubtableType','dic_accountingBalanceProperty','dic_accountingBalanceType','dic_accountingDirection','dic_isYorN'],//查找数据字典所需参数
			transDict : ['accountingObject_accountingObjectDesc','accountingSubtableType_accountingSubtableTypeDesc','balanceProperty_balancePropertyDesc','balanceType_balanceTypeDesc','accountingDirection_accountingDirectionDesc','capitalFlag_capitalFlagDesc'],//翻译前后key
			paging: true, // 默认true,是否分页
			resource: 'accountingMag.queryAccRuleMaster', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		// 新增
		$scope.accRuleMasterAdd = function(event) {
			$scope.accRuleMasterInf = {};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/accRuleMasterEst.html', $scope.accRuleMasterInf, {
				title: T.T('YYJ5400013'),
				buttons: [T.T('F00107'), T.T('F00012')],
				size: ['1100px', '550px'],
				callbacks: [$scope.accRuleMasterSave]
			});
		};
		//保存
		$scope.accRuleMasterSave = function(result) {
			$scope.accRuleMasterInf = result.scope.accRuleMasterInf;
			/*1、记账对象为余额类时，记账子表类型必须为科目
			2、记账对象为非余额类时，其他匹配项均为灰色，不可输入
			3、记账类型为余额类时，记账子表类型、记账余额性质、记账余额类型、
			   记账发生方向为必输项。记账余额对象编号可输入“无”
			 */
			if ($scope.accRuleMasterInf.accountingObject == 'B') { //余额对象
				if (($scope.accRuleMasterInf.accountingSubtableType == null || $scope.accRuleMasterInf.accountingSubtableType ==
						'' ||
						$scope.accRuleMasterInf.accountingSubtableType == undefined || $scope.accRuleMasterInf.accountingSubtableType ==
						'null') ||
					($scope.accRuleMasterInf.balanceProperty == null || $scope.accRuleMasterInf.balanceProperty == '' ||
						$scope.accRuleMasterInf.balanceProperty == undefined || $scope.accRuleMasterInf.balanceProperty == 'null') ||
					($scope.accRuleMasterInf.balanceType == null || $scope.accRuleMasterInf.balanceType == '' ||
						$scope.accRuleMasterInf.balanceType == undefined || $scope.accRuleMasterInf.balanceType == 'null') ||
					($scope.accRuleMasterInf.accountingDirection == null || $scope.accRuleMasterInf.accountingDirection == '' ||
						$scope.accRuleMasterInf.accountingDirection == undefined || $scope.accRuleMasterInf.accountingDirection ==
						'null')) {
					jfLayer.alert(T.T('YYJ5400017'));
					return;
                }
            } else if ($scope.accRuleMasterInf.accountingObject == 'A') { //非余额对象
			}
			$scope.arr2 = [];
			 $("#s58 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 $scope.accRuleMasterInf.sceneSequence = $scope.arr2;
			 console.log($scope.accRuleMasterInf);
			jfRest.request('accountingMag', 'saveAccRuleMaster', $scope.accRuleMasterInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.accRuleMasterInf = {};
					$scope.safeApply();
					result.cancel();
					$scope.accountingRuleMasterList.search();
				} 
			});
		};
		// 查看
		$scope.checkAccRuleMasterInf = function(event) {
			$scope.accRuleMasterInf = {};
			$scope.accRuleMasterInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccRuleMaster.html',
				$scope.accRuleMasterInf, {
					title: T.T('YYJ5400014'),
					buttons: [T.T('F00012')],
					size: ['1100px', '550px'],
					callbacks: []
				});
		};
		// 修改
		$scope.updateAccRuleMasterInf = function(event) {
			$scope.accRuleMasterInf = {};
			$scope.accRuleMasterInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/updateAccRuleMaster.html',
				$scope.accRuleMasterInf, {
					title: T.T('YYJ5400015'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1100px', '550px'],
					callbacks: [$scope.updateaccRuleMaster]
				});
		};
		// 回调函数/确认按钮事件
		$scope.updateaccRuleMaster = function(result) {
			$scope.accRuleMaster = result.scope.accRuleMasterInf;
			$scope.accRuleMaster.operationMode = result.scope.updateOperationMode;
			$scope.accRuleMaster.currencyType = result.scope.updatecurrencyType;
			$scope.accRuleMaster.accountingObject = result.scope.updateaccountingObject;
			$scope.accRuleMaster.accountingSubtableType = result.scope.updateaccountingSubtableType;
			$scope.accRuleMaster.balanceChangeFlag = result.scope.updatebalanceChangeFlag;
			$scope.accRuleMaster.balanceProperty = result.scope.updatebalanceProperty;
			$scope.accRuleMaster.balanceType = result.scope.updatebalanceType;
			$scope.accRuleMaster.accountingDirection = result.scope.updateaccountingDirection;
			$scope.accRuleMaster.sendAcctnoFlag = result.scope.updatesendAcctnoFlag;
			$scope.accRuleMaster.capitalFlag = result.scope.capitalFlagU;
			$scope.arr4 = [];
			 $("#s60 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr4.push(vall);
		    });
			 $scope.accRuleMaster.sceneSequence = $scope.arr4;
			 console.log($scope.accRuleMaster);
			jfRest.request('accountingMag', 'updateAccRuleMaster', $scope.accRuleMaster).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					jfLayer.success(T.T('F00022'));
					$scope.accountingRuleMasterList.search();
				} 
			});
		};
		//删除 
		$scope.deleteAccRuleMasterInf = function(event) {
			$scope.accRuleMasterInf = {};
			$scope.accRuleMasterInf = $.parseJSON(JSON.stringify(event));
			jfLayer.confirm(T.T("YYJ5400016"), function() { //确定
				jfRest.request('accountingMag', 'deleteAccRuleMaster', $scope.accRuleMasterInf).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T("F00037"));
						$scope.accountingRuleMasterList.search();
					} 
				});
			}, function() { //取消
			})
		};
	});
	//新增记账规则主表
	webApp.controller('accRuleMasterEstCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,$timeout,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//币种指示
		$scope.currencyIndicationArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//记账对象
		$scope.accountingObjectArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingObject",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//记账子表类型
		$scope.accountingSubtableTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingSubtableType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//记账余额性质
		$scope.balancePropertyArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceProperty",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//记账余额类型
		$scope.balanceTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//记账余额对象编号：
		$scope.balanceObjectCodeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceObjectCode",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		// 记账发生方向：
		$scope.accountingDirectionArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingDirection",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//发送账号标志：
		$scope.sendAcctnoFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_sendAcctnoFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//余额变动标识
		$scope.balanceChangeFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_balanceChangeFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
			}
		};
		//多资方标识
		$scope.YorNArr = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_isYorN",
					queryFlag: "children"
				}, // 默认查询条件
				text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", // 数据源调用的action
				callback: function(data) {
				}
			};
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.accRuleMasterInf.sendAcctnoFlag = "N";
		$scope.accRuleMasterInf = $scope.accRuleMasterInf;
		$scope.viewoperationMode = $scope.accRuleMasterInf.operationMode;
		$scope.balanceObjectCodeArray = {};
		//联动验证
		/*1、记账对象为余额类时，记账子表类型必须为科目
		2、记账对象为非余额类时，记账子表类型可选，其他匹配项均为灰色，不可输入
		3、记账类型为余额类时，记账子表类型、记账余额性质、记账余额类型、
		   记账发生方向为必输项。记账余额对象编号可输入“无”
		 */
		var form = layui.form;
		form.on('select(getAccObject)', function(data) {
			if (data.value == 'B') { //余额类
				$scope.accRuleMasterInf.accountingSubtableType = 'L';
				angular.element("#accountingSubtableType").attr('disabled', 'disabled');
				angular.element("#balanceProperty").removeAttr('disabled'); //记账余额性质
				angular.element("#balanceType").removeAttr('disabled'); //记账余额类型
				angular.element("#balanceObjectCode").removeAttr('disabled'); //记账余额对象编号
				angular.element("#accountingDirection").removeAttr('disabled'); //记账发生方向
			} else if (data.value == 'A') { //非余额类
				$scope.accRuleMasterInf.accountingSubtableType = '';
				//angular.element("#accountingSubtableType").attr('disabled','disabled');//记账子表类型
				angular.element("#accountingSubtableType").removeAttr('disabled');
				angular.element("#balanceProperty").attr('disabled', 'disabled'); //记账余额性质
				angular.element("#balanceType").attr('disabled', 'disabled'); //记账余额类型
				angular.element("#balanceObjectCode").attr('disabled', 'disabled'); //记账余额对象编号
				angular.element("#accountingDirection").attr('disabled', 'disabled'); //记账发生方向
			} else {
				$scope.accRuleMasterInf.accountingSubtableType = '';
				angular.element("#accountingSubtableType").removeAttr('disabled');
				angular.element("#accountingSubtableType").removeAttr('disabled'); //记账子表类型
				angular.element("#balanceProperty").removeAttr('disabled'); //记账余额性质
				angular.element("#balanceType").removeAttr('disabled'); //记账余额类型
				angular.element("#balanceObjectCode").removeAttr('disabled'); //记账余额对象编号
				angular.element("#accountingDirection").removeAttr('disabled'); //记账发生方向
			}
		});
		form.on('select(getBalanceType)', function(data) {
			if(data.value == 'FEE'){
				$scope.objectType = 'F';
			}else if(data.value == 'INT'){
				$scope.objectType = 'I';
			}else if(data.value == 'PRI'){
				$scope.objectType = 'P';
			}else{
				$scope.objectType = '';
			}
			$scope.balanceObjectCodeArray = {
				type: "dynamic",
				param: {
					objectType: $scope.objectType,
					operationMode : $scope.accRuleMasterInf.operationMode,
				}, //默认查询条件 
				text: "objectDesc", //下拉框显示内容，根据需要修改字段名称 
				value: "balanceObjectCode", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "balanceObject.query", //数据源调用的action 
				callback: function(data) {
				}
			};
		});
		$scope.step1Btn = true;
		$scope.isM = false;
		$scope.stepToTwo = function(){
			$("#s57 option").remove();
			 $("#s58 option").remove();
			$scope.paraPrice = {
					operationMode:$scope.accRuleMasterInf.operationMode,
					requestType : 'M'
			};
			jfRest.request('accountingMag', 'queryAccMainScene', $scope.paraPrice)
			.then(function(data) {
				if(data.returnData.totalCount == 0){
					jfLayer.fail(T.T("YYJ700024"));
					return;
				}
				$scope.isM = true;  //绑定核算场景内容
				$scope.step1Btn = false;
				var adom1S = document.getElementsByClassName('step1S');
				for(var i=0;i<adom1S.length;i++){
					adom1S[i].setAttribute('disabled','disabled');
				}
				$timeout(function() {
					Tansun.plugins.render('select');
				});
				var b =data.returnData.rows;
				for(var i=0;i<b.length;i++){
					angular.element("#s57").append("<option value='"+b[i].masterSceneSequence+"'>"+b[i].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+b[i].masterSceneDesc+"</option>"); 
			   }
			});
		};
		//点击上一步  回到第一步
		$scope.stepBackOne = function(){
			$scope.isM = false;  //绑定核算场景内容
			$scope.step1Btn = true;    //第一步按钮   
      		var adom1S = document.getElementsByClassName('step1S');
  			for(var i=0;i<adom1S.length;i++){
  				adom1S[i].removeAttribute('disabled');
  			}
  			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		$scope.querySceneList = function(){
			 $("#s57").empty();
			 $scope.setparamss = {
					operationMode:$scope.accRuleMasterInf.operationMode,
					requestType : 'M',
					masterSceneSequence:$scope.masterSceneSequenceSel,
	 		};
			jfRest.request('accountingMag', 'queryAccMainScene', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s58 option").each(function () {
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
					    	if(n[i]==a[j].pricingTag){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s57").append("<option value='"+a[j].masterSceneSequence+"'>"+a[j].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].masterSceneDesc+"</option>"); 
				    	}
                    }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s57").append("<option value='"+a[j].masterSceneSequence+"'>"+a[j].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].masterSceneDesc+"</option>"); 
					   }
			      }
			});
		};
		//绑定核算场景
		$("#s57").dblclick(function(){  
			 var alloptions = $("#s57 option");  
			 var so = $("#s57 option:selected");  
			 $("#s58").append(so);  
		});  
		$("#s58").dblclick(function(){  
			 var alloptions = $("#s58 option");  
			 var so = $("#s58 option:selected");  
			 $("#s57").append(so);  
		});  
		$("#add57").click(function(){  
			 var alloptions = $("#s57 option");  
			 var so = $("#s57 option:selected");  
			 $("#s58").append(so); 
		});  
		$("#remove57").click(function(){  
			 var alloptions = $("#s58 option");  
			 var so = $("#s58 option:selected");  
			 $("#s57").append(so);
		});  
		$("#addall57").click(function(){  
			$("#s58").append($("#s57 option").attr("selected",true));  
		});  
		$("#removeall57").click(function(){  
			$("#s57").append($("#s58 option").attr("selected",true));  
		});  
	});
	//查询记账规则主表
	webApp.controller('viewAccRuleMasterCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "operationMode", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.viewOperationMode = $scope.accRuleMasterInf.operationMode;
			}
		};
		$scope.accRuleMasterInf = $scope.accRuleMasterInf;
		//多资方标识
		$scope.YorNArr = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_isYorN",
					queryFlag: "children"
				}, // 默认查询条件
				text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", // 数据源调用的action
				callback: function(data) {
					$scope.capitalFlagInfo = $scope.accRuleMasterInf.capitalFlag;
				}
			};
		//币种指示
		$scope.currencyIndicationArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwcurrencyType = $scope.accRuleMasterInf.currencyType;
			}
		};
		//记账对象
		$scope.accountingObjectArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingObject",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwaccountingObject = $scope.accRuleMasterInf.accountingObject;
			}
		};
		//记账子表类型
		$scope.accountingSubtableTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingSubtableType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwaccountingSubtableType = $scope.accRuleMasterInf.accountingSubtableType;
			}
		};
		//记账余额性质
		$scope.balancePropertyArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceProperty",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwbalanceProperty = $scope.accRuleMasterInf.balanceProperty;
			}
		};
		//记账余额类型
		$scope.balanceTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwbalanceType = $scope.accRuleMasterInf.balanceType;
			}
		};
		//记账余额对象编号：
		$scope.balanceObjectCodeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceObjectCode",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwbalanceObjectCode = $scope.accRuleMasterInf.balanceObjectCode;
			}
		};
		// 记账发生方向：
		$scope.accountingDirectionArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingDirection",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwaccountingDirection = $scope.accRuleMasterInf.accountingDirection;
			}
		};
		//发送账号标志：
		$scope.sendAcctnoFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_sendAcctnoFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwsendAcctnoFlag = $scope.accRuleMasterInf.sendAcctnoFlag;
			}
		};
		//余额变动标识
		$scope.balanceChangeFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_balanceChangeFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.vwbalanceChangeFlag = $scope.accRuleMasterInf.balanceChangeFlag;
			}
		};
		//已关联核算场景
		$scope.masterSceneSequenceList = {
			params : $scope.queryParam = {
					operationMode : $scope.accRuleMasterInf.operationMode,
					requestType : 'M',
					accountingRuleCode : $scope.accRuleMasterInf.accountingRuleCode,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountingMag.queryBindAccScene',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//修改
	webApp.controller('updateAccRuleMasterCtrl', function($scope, $stateParams, jfRest, $http, jfGlobal, $rootScope,
		jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.accRuleMasterInf = $scope.accRuleMasterInf;
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "operationMode", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.queryMode", //数据源调用的action 
			callback: function(data) {
				$scope.updateOperationMode = $scope.accRuleMasterInf.operationMode;
			}
		};
		//多资方标识
		$scope.YorNArr = {
				type: "dictData",
				param: {
					"type": "DROPDOWNBOX",
					groupsCode: "dic_isYorN",
					queryFlag: "children"
				}, // 默认查询条件
				text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource: "paramsManage.query", // 数据源调用的action
				callback: function(data) {
					$scope.capitalFlagU = $scope.accRuleMasterInf.capitalFlag;
				}
			};
		//币种指示
		$scope.currencyIndicationArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_currencyType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updatecurrencyType = $scope.accRuleMasterInf.currencyType;
			}
		};
		//记账对象
		$scope.accountingObjectArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingObject",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updateaccountingObject = $scope.accRuleMasterInf.accountingObject;
			}
		};
		//记账子表类型
		$scope.accountingSubtableTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingSubtableType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updateaccountingSubtableType = $scope.accRuleMasterInf.accountingSubtableType;
			}
		};
		//记账余额性质
		$scope.balancePropertyArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceProperty",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updatebalanceProperty = $scope.accRuleMasterInf.balanceProperty;
			}
		};
		//记账余额类型
		$scope.balanceTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceType",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updatebalanceType = $scope.accRuleMasterInf.balanceType;
			}
		};
		//记账余额对象编号：
		$scope.balanceObjectCodeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingBalanceObjectCode",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updatebalanceObjectCode = $scope.accRuleMasterInf.balanceObjectCode;
			}
		};
		// 记账发生方向：
		$scope.accountingDirectionArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_accountingDirection",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updateaccountingDirection = $scope.accRuleMasterInf.accountingDirection;
			}
		};
		//发送账号标志：
		$scope.sendAcctnoFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_sendAcctnoFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updatesendAcctnoFlag = $scope.accRuleMasterInf.sendAcctnoFlag;
			}
		};
		//余额变动标识
		$scope.balanceChangeFlagArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_balanceChangeFlag",
				queryFlag: "children"
			}, // 默认查询条件
			text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", // 数据源调用的action
			callback: function(data) {
				$scope.updatebalanceChangeFlag = $scope.accRuleMasterInf.balanceChangeFlag;
			}
		};
		//联动验证
		/*1、记账对象为余额类时，记账子表类型必须为科目
		2、记账对象为非余额类时，其他匹配项均为灰色，不可输入
		3、记账类型为余额类时，记账子表类型、记账余额性质、记账余额类型、
		   记账发生方向为必输项。记账余额对象编号可输入“无”
		 */
		var form = layui.form;
		form.on('select(getAccObject)', function(data) {
			if (data.value == 'B') { //余额类
				$scope.accRuleMasterInf.accountingSubtableType = 'L';
				angular.element("#accountingSubtableType").attr('disabled', 'disabled');
				//angular.element("#accountingSubtableType").removeAttr('disabled');//记账子表类型
				angular.element("#balanceProperty").removeAttr('disabled'); //记账余额性质
				angular.element("#balanceType").removeAttr('disabled'); //记账余额类型
				angular.element("#balanceObjectCode").removeAttr('disabled'); //记账余额对象编号
				angular.element("#accountingDirection").removeAttr('disabled'); //记账发生方向
			} else if (data.value == 'A') { //非余额类
				$scope.accRuleMasterInf.accountingSubtableType = '';
				//angular.element("#accountingSubtableType").attr('disabled','disabled');//记账子表类型
				angular.element("#accountingSubtableType").removeAttr('disabled');
				angular.element("#balanceProperty").attr('disabled', 'disabled'); //记账余额性质
				angular.element("#balanceType").attr('disabled', 'disabled'); //记账余额类型
				angular.element("#balanceObjectCode").attr('disabled', 'disabled'); //记账余额对象编号
				angular.element("#accountingDirection").attr('disabled', 'disabled'); //记账发生方向
			} else {
				$scope.accRuleMasterInf.accountingSubtableType = '';
				angular.element("#accountingSubtableType").removeAttr('disabled');
				angular.element("#accountingSubtableType").removeAttr('disabled'); //记账子表类型
				angular.element("#balanceProperty").removeAttr('disabled'); //记账余额性质
				angular.element("#balanceType").removeAttr('disabled'); //记账余额类型
				angular.element("#balanceObjectCode").removeAttr('disabled'); //记账余额对象编号
				angular.element("#accountingDirection").removeAttr('disabled'); //记账发生方向
			}
		});
		$("#s59 option").remove();
		 $("#s60 option").remove();
		$scope.setparamss = {
				operationMode : $scope.accRuleMasterInf.operationMode,
				requestType : 'M'
		};
		jfRest.request('accountingMag', 'queryAccMainScene', $scope.setparamss).then(function(data) {
			var a =data.returnData.rows;
			$scope.queryParam = {
				operationMode : $scope.accRuleMasterInf.operationMode,
				requestType : 'M',
				accountingRuleCode : $scope.accRuleMasterInf.accountingRuleCode,
			};
			jfRest.request('accountingMag', 'queryBindAccScene', $scope.queryParam)
			.then(function(data) {
				 var n =data.returnData.rows;
				 if(n!=undefined){
				    	for(var i=0;i<n.length;i++){
				    		angular.element("#s60").append("<option value='"+n[i].sceneSequence+"'>"+n[i].sceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+n[i].sceneSequenceDesc+"</option>"); 
				    	}
						//查找重复数据
					    var isrep;
					    for(var j =0;j<a.length;j++){
					    	isrep = false;
					    	for(var i=0;i<n.length;i++){
						    	if(n[i].sceneSequence==a[j].masterSceneSequence){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		angular.element("#s59").append("<option value='"+a[j].masterSceneSequence+"'>"+a[j].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].masterSceneDesc+"</option>"); 
					    	}
                        }
                 }else{
						   for(var i=0;i<a.length;i++){
							   angular.element("#s59").append("<option value='"+a[i].masterSceneSequence+"'>"+a[i].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].masterSceneDesc+"</option>"); 
					  }
				   }
			});
		});
		$scope.querySceneListU = function(){
			 $("#s59").empty();
			 $scope.setparamss = {
				operationMode : $scope.accRuleMasterInf.operationMode,
				requestType : 'M',
				masterSceneSequence : $scope.masterSceneSequenceSelU
		 	};
			 jfRest.request('accountingMag', 'queryAccMainScene', $scope.setparamss).then(function(data) {
					var a =data.returnData.rows;
					$scope.arr02 = [];
					 $("#s60 option").each(function () {
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
						    	if(n[i]==a[j].masterSceneSequence){
						    		isrep = true;
						    		break;
						    	}
						    }
					    	if(!isrep){
					    		$("#s59").append("<option value='"+a[j].masterSceneSequence+"'>"+a[j].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].masterSceneDesc+"</option>"); 
					    	}
                        }
                     }else if(a !=null){
				    	  for(var i=0;i<a.length;i++){
								$("#s59").append("<option value='"+a[j].masterSceneSequence+"'>"+a[j].masterSceneSequence+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].masterSceneDesc+"</option>"); 
						   }
				   }
				});
	 		};
	 		//绑定核算场景
			$("#s59").dblclick(function(){  
				 var alloptions = $("#s59 option");  
				 var so = $("#s59 option:selected");  
				 $("#s60").append(so);  
			});  
			$("#s60").dblclick(function(){  
				 var alloptions = $("#s60 option");  
				 var so = $("#s60 option:selected");  
				 $("#s59").append(so);  
			});  
			$("#add59").click(function(){  
				 var alloptions = $("#s59 option");  
				 var so = $("#s59 option:selected");  
				 $("#s60").append(so); 
			});  
			$("#remove59").click(function(){  
				 var alloptions = $("#s60 option");  
				 var so = $("#s60 option:selected");  
				 $("#s59").append(so);
			});  
			$("#addall59").click(function(){  
				$("#s60").append($("#s59 option").attr("selected",true));  
			});  
			$("#removeall59").click(function(){  
				$("#s59").append($("#s60 option").attr("selected",true));  
			});  
		
		
	});
});
