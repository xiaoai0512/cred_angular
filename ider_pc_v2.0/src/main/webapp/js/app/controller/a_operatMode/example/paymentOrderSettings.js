'use strict';
define(function(require) {
	
	var webApp = require('app');
	
	//还款顺序设置新增、查询及维护
	webApp.controller('paymentOrderSettingsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 
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
	   	   			if($scope.eventList.search('COS.AD.02.0165') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('COS.IQ.02.0015') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0068') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
 				}
 			});
//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		 $scope.artifactNoArray = [{name : '201' ,id : '201'},{name : '202' ,id : '202'}] ;
		//事件编号
		 $scope.eventArray={ 
			        type:"dynamicDesc", 
			        param:{Flag:'Y'},//默认查询条件 
			        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
			        desc: 'accountingDesc',
			        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"accountingStatus.query",//数据源调用的action 
			        callback: function(data){
			        }
		};
		 //核算状态
		 $scope.accountingStatusArray={ 
			        type:"dynamicDesc", 
			        param:{Flag:'Y'},//默认查询条件 
			        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
			        desc: 'accountingDesc',
			        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"accountingStatus.query",//数据源调用的action 
			        callback: function(data){
			        }
		};
		$scope.paymentOrderSettingsTableShow201 = true;
		$scope.paymentOrderSettingsTableShow202 = true;
		 $scope.queryPaymentOrderSettings = function() {
			 if($scope.paymentOrderSettings != undefined){
				 /*if($scope.paymentOrderSettings.params.artifactNo == "201"){
					 $scope.paymentOrderSettingsTable201.params.artifactNo = '201';
					 $scope.paymentOrderSettingsTableShow202 = false;
					 $scope.paymentOrderSettingsTableShow201 = true;
				 }else if($scope.paymentOrderSettings.params.artifactNo == "202"){
					 $scope.paymentOrderSettingsTable202.params.artifactNo = '202';
					 $scope.paymentOrderSettingsTableShow202 = true;
					 $scope.paymentOrderSettingsTableShow201 = false;
				 }else{
					$scope.paymentOrderSettingsTableShow201 = true;
					$scope.paymentOrderSettingsTableShow202 = true;
				 };*/
				 if($scope.paymentOrderSettings.params.operationMode != undefined){
					 $scope.paymentOrderSettingsTable201.params.operationMode = $scope.paymentOrderSettings.params.operationMode;
					 $scope.paymentOrderSettingsTable202.params.operationMode = $scope.paymentOrderSettings.params.operationMode;
                 }
                 if($scope.paymentOrderSettings.params.instanCode1 != undefined){
					 $scope.paymentOrderSettingsTable201.params.instanCode1 = $scope.paymentOrderSettings.params.instanCode1;
					 $scope.paymentOrderSettingsTable202.params.instanCode1 = $scope.paymentOrderSettings.params.instanCode1;
                 }
                 if($scope.paymentOrderSettings.params.instanCode2 != undefined){
					 $scope.paymentOrderSettingsTable201.params.instanCode2 = $scope.paymentOrderSettings.params.instanCode2;
					 $scope.paymentOrderSettingsTable202.params.instanCode2 = $scope.paymentOrderSettings.params.instanCode2;
                 }
             }
			$scope.paymentOrderSettingsTable201.search();
			$scope.paymentOrderSettingsTable202.search();
		 };
			//账户间还款分配顺序
			$scope.paymentOrderSettingsTable201 = {
				params : {
						"specialArtifact":"1",
						"artifactNo":'201',
						"flag":'1',
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			//账户内还款分配顺序
			$scope.paymentOrderSettingsTable202 = {
				params : {
						"specialArtifact":"1",
						"artifactNo":'202',
						"flag":'1',
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
			// 查询统一还款分配顺序
			$scope.queryInterAccountOrder = function(item) {
				// 页面弹出框事件(弹出页面)
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/example/queryInterAccountOrder.html', $scope.items, {
					title :  T.T('YYH400048'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1150px', '580px'  ],
					callbacks : []
				});
			};
			//统一还款分配顺序
			$scope.updateInterAccountOrder = function(item) {
				// 页面弹出框事件(弹出页面)
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/example/updateInterAccountOrder.html', $scope.items, {
					title : T.T('YYH400049') ,
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1150px', '580px'  ],
					callbacks : [$scope.saveInterAccountOrder]
				});
			};
			//保存统一还款分配顺序
			$scope.saveInterAccountOrder = function (result){
				if(result.scope.paymentOrderSettingsTable201.data.length >0){
					$scope.listdata201 = result.scope.paymentOrderSettingsTable201.data;
				}else {
					$scope.listdata201 = [];
				}
				if(result.scope.paymentOrderSettingsTable282.data.length >0){
					$scope.listdata282 = result.scope.paymentOrderSettingsTable282.data;
				}else {
					$scope.listdata282 = [];
                }
                //合并
				$scope.list = $scope.listdata201.concat($scope.listdata282);
				console.log($scope.list);
				$scope.params = {
						list : $scope.list
				};
				jfRest.request('artifactExample', 'updateArtifactInstan', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00022'));
						 $scope.safeApply();
							result.cancel();
						 $scope.paymentOrderSettingsTable201.search();
					}
				});
			};
			//202 单独账户还款分配顺序 查询
			$scope.queryDistributOrder = function(item){
				// 页面弹出框事件(弹出页面)
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/example/queryDistributOrder.html', $scope.items, {
					title : T.T('YYH400050'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1050px', '500px'  ],
					callbacks : []
				});
			};
			//202 单独账户还款分配顺序
			$scope.updateDistributOrder = function(item){
				// 页面弹出框事件(弹出页面)
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/example/updateDistributOrder.html', $scope.items, {
					title : T.T('YYH400051'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1050px', '500px'  ],
					callbacks : [$scope.saveDistributOrder]
				});
			};
			//保存202分配顺序
			$scope.saveDistributOrder = function (result){
				if(result.scope.paymentOrderSettingsTable202.data.length >0){
					$scope.listdata202 = result.scope.paymentOrderSettingsTable202.data;
				}else {
					$scope.listdata202 = [];
				}
				if(result.scope.paymentOrderSettingsTable282.data.length >0){
					$scope.listdata282 = result.scope.paymentOrderSettingsTable282.data;
				}else {
					$scope.listdata282 = [];
                }
                //合并
				$scope.list = $scope.listdata202.concat($scope.listdata282);
				console.log($scope.list);
				$scope.params = {
						list : $scope.list
				};
				jfRest.request('artifactExample', 'updateArtifactInstan', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00022'));
						 $scope.safeApply();
							result.cancel();
						 $scope.paymentOrderSettingsTable201.search();
					}
				});
			};
			//维护账户内顺序
			$scope.queryInAccountOrder = function(item) {
				// 页面弹出框事件(弹出页面)
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/example/queryInAccountOrder.html', $scope.items, {
					title : T.T('YYH400052'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1050px', '500px'  ],
					callbacks : [$scope.saveInAccountOrder]
				});
			};
			//保存账户内顺序信息
			$scope.saveInAccountOrder = function (result){
				$scope.params = {
						list : result.scope.paymentOrderSettingsTable202.data
				};
				jfRest.request('artifactExample', 'updateArtifactInstan', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00022'));
						 $scope.safeApply();
							result.cancel();
						 $scope.paymentOrderSettingsTable202.search();
					}
				});
			};
			//余额类型内顺序
			$scope.queryOrderInBalanceType = function(item) {
				// 页面弹出框事件(弹出页面)
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.modal('/a_operatMode/example/queryOrderInBalanceType.html', $scope.items, {
					title :  T.T('YYH400053'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1050px', '500px'  ],
					callbacks : [$scope.saveOrderInBalanceType]
				});
			};
			//保存余额类型内顺序信息
			$scope.saveOrderInBalanceType = function (result){
				$scope.params = {
						list : result.scope.paymentOrderSettingsTable282.data
				};
				jfRest.request('artifactExample', 'updateArtifactInstan', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00022'));
						 $scope.safeApply();
						result.cancel();
					}
				});
			};
			//新增构件实例化
			$scope.paymentOrderSettingsAdd = function(){
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/paymentOrderSettingsAdd.html', '', {
					title : T.T('YYH400054'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '1050px', '500px' ],
					callbacks : [$scope.savepaymentOrderSettings ]
				});
			};
			//新增
			$scope.savepaymentOrderSettings = function(result){
				$scope.operationMode = result.scope.paymentOrderSettingsAddObj.operationMode;//运营模式
				$scope.instanCode1 = result.scope.paymentOrderSettingsAddObj.instanCode1;//事件编号
				$scope.instanCode2 = result.scope.paymentOrderSettingsAddObj.instanCode2;//核算状态
				$scope.paymentOrder201Data = result.scope.paymentOrderSettingsTable201.data;//201
				$scope.paymentOrder202Data = result.scope.paymentOrderSettingsTable202.data;//202
				$scope.paymentOrder282Data = result.scope.paymentOrderSettingsTable282.data;//282
				//201
				$scope.repaymentA = $scope.dataHaddle($scope.paymentOrder201Data,$scope.operationMode,$scope.instanCode1,$scope.instanCode2);
				//202
				$scope.repaymentB = $scope.dataHaddle($scope.paymentOrder202Data,$scope.operationMode,$scope.instanCode1,$scope.instanCode2);
				//282
				$scope.repaymentC = $scope.dataHaddle($scope.paymentOrder282Data,$scope.operationMode,$scope.instanCode1,$scope.instanCode2);
				$scope.params = {
					    eventNo: $scope.instanCode1 ,
					    repaymentA: $scope.repaymentA,
					    repaymentB: $scope.repaymentB,
					    repaymentC: $scope.repaymentC,
					};
				//统一还款分配顺序 分配顺序新增
				jfRest.request('artifactExample', 'addDistributOrder', $scope.params).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						$scope.safeApply();
						result.cancel();
						$scope.queryPaymentOrderSettings();
					}
				});
			};
			//数据处理，将数据处理成需要的格式 
			/*data:需要处理的rows
			 * operationMode：运营模式
			instanCode1：事件编号
			instanCode2：核算状态*/
			$scope.dataHaddle = function(data,operationMode,instanCode1,instanCode2){
				$scope.needData = [] ;
				for(var i = 0 ; i < data.length; i++){
					$scope.needData.push({
						operationMode : operationMode,
						artifactNo: data[i].artifactNo,
						elementNo: data[i].elementNo,
						instanCode1: instanCode1,
						instanCode2: instanCode2,
						performOrder: data[i].performOrder
					});
                }
                return $scope.needData;
			};
	});
	//统一还款分配顺序 修改
	webApp.controller('updateInterAccountOrderCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal,$timeout, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.elementStr = [];
		$scope.obj = {};
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable201 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"instanCode1" : $scope.items.instanCode1,
					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'201',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				var str = {};
				for(var i=0;i<data.returnData.rows.length;i++){
					for(var j=0;j<data.returnData.rows.length-1;j++){
//						$scope.obj["arrStr"+j] = [];
						if(data.returnData.rows[j].elementList){
							for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
								str = {
										name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
										id:data.returnData.rows[j].elementList[k].elementNo};
//								$scope.obj["arrStr"+j].push(str);
								$scope.elementStr.push(str);
//								$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
							}
                        }
                        if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
							var temp = data.returnData.rows[j];
							data.returnData.rows[j] = data.returnData.rows[j+1];
							data.returnData.rows[j+1] = temp;
						}
					}
				}
			}
		};
		// 上移
		$scope.exchangeSeqNoUp = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable201.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable201.data[i] = $scope.paymentOrderSettingsTable201.data[i-1];
					$scope.paymentOrderSettingsTable201.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable201.data[i].performOrder = $scope.paymentOrderSettingsTable201.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable201.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable201.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable201.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable201.data[i] = $scope.paymentOrderSettingsTable201.data[i+1];
					$scope.paymentOrderSettingsTable201.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable201.data[i].performOrder = $scope.paymentOrderSettingsTable201.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable201.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//201，点击替换参数的方法
		$scope.selectAUpdateBP201 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP201]
				});
		};
		$scope.choseSelectAUpdateBP201 = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable201.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable201.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================201，点击替换参数的方法  end*/
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable282 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"eventNumber" : $scope.items.instanCode1,
//					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'282',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000' ){
					if(data.returnData){
						if(data.returnData.rows && data.returnData.rows.length > 0){
							var str = {};
							for(var i=0;i<data.returnData.rows.length;i++){
								for(var j=0;j<data.returnData.rows.length-1;j++){
//									$scope.obj["arrStr"+j] = [];
									if(data.returnData.rows[j].elementList){
										for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
											str = {
													name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
													id:data.returnData.rows[j].elementList[k].elementNo};
//											$scope.obj["arrStr"+j].push(str);
											$scope.elementStr.push(str);
//											$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
										}
                                    }
                                    if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
										var temp = data.returnData.rows[j];
										data.returnData.rows[j] = data.returnData.rows[j+1];
										data.returnData.rows[j+1] = temp;
									}
								}
							}
						}else {
							data.returnData = {
									rows : []
							}
						}
					}
                }
            }
		};
		// 上移
		$scope.exchangeSeqNoUp282 = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i-1];
					$scope.paymentOrderSettingsTable282.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown282 = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable282.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i+1];
					$scope.paymentOrderSettingsTable282.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//282，点击替换参数的方法
		$scope.selectAUpdateBP282 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP282]
				});
		};
		$scope.choseSelectAUpdateBP282 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================282，点击替换参数的方法  end*/
	});
	//单独账户还款分配顺序
	webApp.controller('updateDistributOrderCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal,$timeout, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.elementStr = [];
		$scope.obj = {};
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable202 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"instanCode1" : $scope.items.instanCode1,
					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'202',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) {
				// 表格查询后的回调函数
				if(data.returnCode == '000000' ){
					if(data.returnData){
						if(data.returnData.rows && data.returnData.rows.length > 0){
							var str = {};
							for(var i=0;i<data.returnData.rows.length;i++){
								for(var j=0;j<data.returnData.rows.length-1;j++){
//									$scope.obj["arrStr"+j] = [];
									for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
										str = {
												name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
												id:data.returnData.rows[j].elementList[k].elementNo};
//										$scope.obj["arrStr"+j].push(str);
										$scope.elementStr.push(str);
//										$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
									}
									if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
										var temp = data.returnData.rows[j];
										data.returnData.rows[j] = data.returnData.rows[j+1];
										data.returnData.rows[j+1] = temp;
									}
								}
							}
						}else {
							data.returnData = {
									rows : []
							}
						}
					}
                }
            }
		};
		// 上移
		$scope.exchangeSeqNoUp = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i-1];
					$scope.paymentOrderSettingsTable202.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable202.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable202.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i+1];
					$scope.paymentOrderSettingsTable202.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable202.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//202，点击替换参数的方法
		$scope.selectAUpdateBP202 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP202]
				});
		};
		$scope.choseSelectAUpdateBP202 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable202.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable202.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================202，点击替换参数的方法  end*/
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable282 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"eventNumber" : $scope.items.instanCode1,
//					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'282',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) {// 表格查询后的回调函数
				if(data.returnCode == '000000' ){
					if(data.returnData){
						if(data.returnData.rows && data.returnData.rows.length > 0){
							var str = {};
							for(var i=0;i<data.returnData.rows.length;i++){
								for(var j=0;j<data.returnData.rows.length-1;j++){
//									$scope.obj["arrStr"+j] = [];
									if(data.returnData.rows[j].elementList){
										for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
											str = {
													name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
													id:data.returnData.rows[j].elementList[k].elementNo};
//											$scope.obj["arrStr"+j].push(str);
											$scope.elementStr.push(str);
//											$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
										}
                                    }
                                    if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
										var temp = data.returnData.rows[j];
										data.returnData.rows[j] = data.returnData.rows[j+1];
										data.returnData.rows[j+1] = temp;
									}
								}
							}
						}else {
							data.returnData = {
									rows : []
							}
						}
					}
                }
            }
		};
		// 上移
		$scope.exchangeSeqNoUp282 = function(data,$index) {
			if($index == 0){
				jfLayer.fail(T.T('F00024'));
				return;
			}else {
				for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
					if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
						var dataMap = $scope.paymentOrderSettingsTable282.data[i];
						$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i-1];
						$scope.paymentOrderSettingsTable282.data[i-1] = dataMap;
						//将执行顺序交换
						var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
						$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i-1].performOrder;
						$scope.paymentOrderSettingsTable282.data[i-1].performOrder = performOrderValue;
						break;
					}
				}
            }
        };
		// 下移
		$scope.exchangeSeqNoDown282 = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable282.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i+1];
					$scope.paymentOrderSettingsTable282.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//282，点击替换参数的方法
		$scope.selectAUpdateBP282 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP282]
				});
		};
		$scope.choseSelectAUpdateBP282 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================282，点击替换参数的方法  end*/
	});
	webApp.controller('queryInAccountOrderCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.elementStr = [];
		//账户内还款分配顺序
		$scope.paymentOrderSettingsTable202 = {
				params : {
						"operationMode" : $scope.items.operationMode,
						"instanCode1" : $scope.items.instanCode1,
						"instanCode2" : $scope.items.instanCode2,
						"artifactNo":'202',
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.query',// 列表的资源
				callback : function(data) {
					 // 表格查询后的回调函数
					if(data.returnCode == '000000' ){
						if(data.returnData){
							if(data.returnData.rows && data.returnData.rows.length > 0){
								var str = {};
								for(var i=0;i<data.returnData.rows.length;i++){
									for(var j=0;j<data.returnData.rows.length-1;j++){
//										$scope.obj["arrStr"+j] = [];
										if(data.returnData.rows[j].elementList){
											for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
												str = {
														name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
														id:data.returnData.rows[j].elementList[k].elementNo};
//												$scope.obj["arrStr"+j].push(str);
												$scope.elementStr.push(str);
//												$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
											}
                                        }
                                        if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
											var temp = data.returnData.rows[j];
											data.returnData.rows[j] = data.returnData.rows[j+1];
											data.returnData.rows[j+1] = temp;
										}
									}
								}
							}else {
								data.returnData = {
										rows : []
								}
							}
						}
                    }
                }
			};
		// 上移
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].id == data.id) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
                    }
                    var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i-1];
					$scope.paymentOrderSettingsTable202.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable202.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].performOrder == data.performOrder) {
					if (i == $scope.paymentOrderSettingsTable202.data.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i+1];
					$scope.paymentOrderSettingsTable202.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable202.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
	});
	webApp.controller('queryOrderInBalanceTypeCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//余额类型内顺序
		$scope.paymentOrderSettingsTable282 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"instanCode1" : $scope.items.instanCode1,
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query282',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				var str = {};
				for(var i=0;i<data.returnData.rows.length;i++){
					for(var j=0;j<data.returnData.rows.length-1;j++){
						if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
							var temp = data.returnData.rows[j];
							data.returnData.rows[j] = data.returnData.rows[j+1];
							data.returnData.rows[j+1] = temp;
						}
					}
				}
			}
		};
		// 上移
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].performOrder == data.performOrder) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i-1];
					$scope.paymentOrderSettingsTable282.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].performOrder == data.performOrder) {
					if (i == $scope.paymentOrderSettingsTable282.data.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i+1];
					$scope.paymentOrderSettingsTable282.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
	});
	webApp.controller('paymentOrderSettingsAddCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.paymentOrderSettingsAddObj = {};
		//核算状态
		 $scope.accountingStatusArray={ 
			        type:"dynamicDesc", 
			        param:{Flag:'Y'},//默认查询条件 
			        text:"accountingStatus", //下拉框显示内容，根据需要修改字段名称 
			        desc: 'accountingDesc',
			        value:"accountingStatus",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"accountingStatus.query",//数据源调用的action 
			        callback: function(data){
			        }
		};
		//201构件实例化
		$scope.paymentOrderSettingsTable201 = {
			params : {
					"artifactNo":'201',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'elmList.queryBaseRltvTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				for(var i=0;i<data.returnData.rows.length;i++){
					for(var j=0;j<data.returnData.rows.length-1;j++){
						if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
							var temp = data.returnData.rows[j];
							data.returnData.rows[j] = data.returnData.rows[j+1];
							data.returnData.rows[j+1] = temp;
						}
					}
				}
			}
		};
		//202构件实例化
		$scope.paymentOrderSettingsTable202 = {
			params : {
					"artifactNo":'202',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'elmList.queryBaseRltvTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				for(var i=0;i<data.returnData.rows.length;i++){
					for(var j=0;j<data.returnData.rows.length-1;j++){
						if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
							var temp = data.returnData.rows[j];
							data.returnData.rows[j] = data.returnData.rows[j+1];
							data.returnData.rows[j+1] = temp;
						}
					}
				}
			}
		};
		//282构件实例化
		$scope.paymentOrderSettingsTable282 = {
			params : {
					"artifactNo":'282',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'elmList.queryBaseRltvTable',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				for(var i=0;i<data.returnData.rows.length;i++){
					for(var j=0;j<data.returnData.rows.length-1;j++){
						if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
							var temp = data.returnData.rows[j];
							data.returnData.rows[j] = data.returnData.rows[j+1];
							data.returnData.rows[j+1] = temp;
						}
					}
				}
			}
		};
		//201，点击替换参数的方法
		$scope.selectAUpdateBP201 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP201]
				});
		};
		$scope.choseSelectAUpdateBP201 = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable201.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable201.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================201，点击替换参数的方法  end*/
		//202，点击替换参数的方法
		$scope.selectAUpdateBP202 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP202]
				});
		};
		$scope.choseSelectAUpdateBP202 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable202.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable202.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================202，点击替换参数的方法  end*/
		//282，点击替换参数的方法
		$scope.selectAUpdateBP282 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP282]
				});
		};
		$scope.choseSelectAUpdateBP282 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
            }
            $scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};
		/*============================282，点击替换参数的方法  end*/
		$scope.paymentOrderSettingsShow201 = true;
		$scope.paymentOrderSettingsShow202 = true;
		$scope.paymentOrderSettingsShow282 = true;
		// 上移
		$scope.exchangeSeqNoUp201 = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable201.data[i].performOrder == data.performOrder) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable201.data[i] = $scope.paymentOrderSettingsTable201.data[i-1];
					$scope.paymentOrderSettingsTable201.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable201.data[i].performOrder = $scope.paymentOrderSettingsTable201.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable201.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown201 = function(data,$index) {
			if ($index == ($scope.paymentOrderSettingsTable201.data.length -1 )) {
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable201.data[i].performOrder == data.performOrder) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable201.data[i] = $scope.paymentOrderSettingsTable201.data[i+1];
					$scope.paymentOrderSettingsTable201.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable201.data[i].performOrder = $scope.paymentOrderSettingsTable201.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable201.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 上移
		$scope.exchangeSeqNoUp202 = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].performOrder == data.performOrder) {
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i-1];
					$scope.paymentOrderSettingsTable202.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable202.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown202 = function(data,$index) {
			if ($index == ($scope.paymentOrderSettingsTable202.data.length -1 )) {
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].performOrder == data.performOrder) {
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i+1];
					$scope.paymentOrderSettingsTable202.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable202.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 上移
		$scope.exchangeSeqNoUp282 = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].performOrder == data.performOrder) {
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i-1];
					$scope.paymentOrderSettingsTable282.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown282 = function(data,$index) {
			if ($index == ($scope.paymentOrderSettingsTable282.data.length -1 )) {
				jfLayer.fail(T.T('F00025'));
				return;
            }
            for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].performOrder == data.performOrder) {
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i+1];
					$scope.paymentOrderSettingsTable282.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
	});
	//******************************替换参数***************
	webApp.controller('selectElementNoBTCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.artifactInfo = {};
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTableUpdate = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.itemsNo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	//统一还款分配顺序 查询
	webApp.controller('queryInterAccountOrderCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal,$timeout, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.elementStr = [];
		$scope.obj = {};
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable201 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"instanCode1" : $scope.items.instanCode1,
					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'201',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				var str = {};
				for(var i=0;i<data.returnData.rows.length;i++){
					for(var j=0;j<data.returnData.rows.length-1;j++){
//						$scope.obj["arrStr"+j] = [];
						if(data.returnData.rows[j].elementList){
							for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
								str = {
										name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
										id:data.returnData.rows[j].elementList[k].elementNo};
//								$scope.obj["arrStr"+j].push(str);
								$scope.elementStr.push(str);
//								$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
							}
                        }
                        if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
							var temp = data.returnData.rows[j];
							data.returnData.rows[j] = data.returnData.rows[j+1];
							data.returnData.rows[j+1] = temp;
						}
					}
				}
			}
		};
		// 上移
		/*$scope.exchangeSeqNoUp = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable201.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable201.data[i] = $scope.paymentOrderSettingsTable201.data[i-1];
					$scope.paymentOrderSettingsTable201.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable201.data[i].performOrder = $scope.paymentOrderSettingsTable201.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable201.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable201.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable201.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable201.data[i] = $scope.paymentOrderSettingsTable201.data[i+1];
					$scope.paymentOrderSettingsTable201.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable201.data[i].performOrder = $scope.paymentOrderSettingsTable201.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable201.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//201，点击替换参数的方法
		$scope.selectAUpdateBP201 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP201]
				});
		};
		$scope.choseSelectAUpdateBP201 = function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			};
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable201.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable201.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};*/
		/*============================201，点击替换参数的方法  end*/
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable282 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"eventNumber" : $scope.items.instanCode1,
//					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'282',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000' ){
					if(data.returnData){
						if(data.returnData.rows && data.returnData.rows.length > 0){
							var str = {};
							for(var i=0;i<data.returnData.rows.length;i++){
								for(var j=0;j<data.returnData.rows.length-1;j++){
//									$scope.obj["arrStr"+j] = [];
									if(data.returnData.rows[j].elementList){
										for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
											str = {
													name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
													id:data.returnData.rows[j].elementList[k].elementNo};
//											$scope.obj["arrStr"+j].push(str);
											$scope.elementStr.push(str);
//											$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
										}
                                    }
                                    if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
										var temp = data.returnData.rows[j];
										data.returnData.rows[j] = data.returnData.rows[j+1];
										data.returnData.rows[j+1] = temp;
									}
								}
							}
						}else {
							data.returnData = {
									rows : []
							}
						}
					}
                }
            }
		};
		// 上移
		/*$scope.exchangeSeqNoUp282 = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i-1];
					$scope.paymentOrderSettingsTable282.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown282 = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable282.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable201.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i+1];
					$scope.paymentOrderSettingsTable282.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//282，点击替换参数的方法
		$scope.selectAUpdateBP282 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP282]
				});
		};
		$scope.choseSelectAUpdateBP282 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			};
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};*/
		/*============================282，点击替换参数的方法  end*/
	});
	//单独账户还款分配顺序 查询
	webApp.controller('queryDistributOrderCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal,$timeout, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.elementStr = [];
		$scope.obj = {};
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable202 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"instanCode1" : $scope.items.instanCode1,
					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'202',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) {
 // 表格查询后的回调函数
				if(data.returnCode == '000000' ){
					if(data.returnData){
						if(data.returnData.rows && data.returnData.rows.length > 0){
							var str = {};
							for(var i=0;i<data.returnData.rows.length;i++){
								for(var j=0;j<data.returnData.rows.length-1;j++){
//									$scope.obj["arrStr"+j] = [];
									for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
										str = {
												name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
												id:data.returnData.rows[j].elementList[k].elementNo};
//										$scope.obj["arrStr"+j].push(str);
										$scope.elementStr.push(str);
//										$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
									}
									if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
										var temp = data.returnData.rows[j];
										data.returnData.rows[j] = data.returnData.rows[j+1];
										data.returnData.rows[j+1] = temp;
									}
								}
							}
						}else {
							data.returnData = {
									rows : []
							}
						}
					}
                }
            }
		};
		// 上移
		/*$scope.exchangeSeqNoUp = function(data,$index) {
			if ($index == 0) {
				jfLayer.fail(T.T('F00024'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable202.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i-1];
					$scope.paymentOrderSettingsTable202.data[i-1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i-1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i-1].performOrder = performOrderValue;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable202.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable201.data.length; i++) {
				if ($scope.paymentOrderSettingsTable202.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable202.data[i];
					$scope.paymentOrderSettingsTable202.data[i] = $scope.paymentOrderSettingsTable202.data[i+1];
					$scope.paymentOrderSettingsTable202.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable201.data[i].performOrder;
					$scope.paymentOrderSettingsTable202.data[i].performOrder = $scope.paymentOrderSettingsTable202.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable202.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//202，点击替换参数的方法
		$scope.selectAUpdateBP202 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP202]
				});
		};
		$scope.choseSelectAUpdateBP202 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			};
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable202.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable202.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};*/
		/*============================202，点击替换参数的方法  end*/
		//账户间还款分配顺序
		$scope.paymentOrderSettingsTable282 = {
			params : {
					"operationMode" : $scope.items.operationMode,
					"eventNumber" : $scope.items.instanCode1,
//					"instanCode2" : $scope.items.instanCode2,
					"artifactNo":'282',
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) {// 表格查询后的回调函数
				if(data.returnCode == '000000' ){
					if(data.returnData){
						if(data.returnData.rows && data.returnData.rows.length > 0){
							var str = {};
							for(var i=0;i<data.returnData.rows.length;i++){
								for(var j=0;j<data.returnData.rows.length-1;j++){
//									$scope.obj["arrStr"+j] = [];
									if(data.returnData.rows[j].elementList){
										for(var k=0;k<data.returnData.rows[j].elementList.length;k++){
											str = {
													name:data.returnData.rows[j].elementList[k].elementNo+" "+data.returnData.rows[j].elementList[k].elementDesc,
													id:data.returnData.rows[j].elementList[k].elementNo};
//											$scope.obj["arrStr"+j].push(str);
											$scope.elementStr.push(str);
//											$scope.aaa+j=$scope.builder.option($scope.obj["arrStr"+j]);
										}
                                    }
                                    if(data.returnData.rows[j].performOrder>data.returnData.rows[j+1].performOrder){
										var temp = data.returnData.rows[j];
										data.returnData.rows[j] = data.returnData.rows[j+1];
										data.returnData.rows[j+1] = temp;
									}
								}
							}
						}else {
							data.returnData = {
									rows : []
							}
						}
					}
                }
            }
		};
		/*// 上移
		$scope.exchangeSeqNoUp282 = function(data,$index) {
			if($index == 0){
				jfLayer.fail(T.T('F00024'));
				return;
			}else {
				for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
					if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
						var dataMap = $scope.paymentOrderSettingsTable282.data[i];
						$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i-1];
						$scope.paymentOrderSettingsTable282.data[i-1] = dataMap;
						//将执行顺序交换
						var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
						$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i-1].performOrder;
						$scope.paymentOrderSettingsTable282.data[i-1].performOrder = performOrderValue;
						break;
					}
				}
			};
		};
		// 下移
		$scope.exchangeSeqNoDown282 = function(data,$index) {
			if ($index == $scope.paymentOrderSettingsTable282.data.length - 1) {// 判断第几条数据
				jfLayer.fail(T.T('F00025'));
				return;
			};
			for (var i = 0; i < $scope.paymentOrderSettingsTable282.data.length; i++) {
				if ($scope.paymentOrderSettingsTable282.data[i].id == data.id) {
					var dataMap = $scope.paymentOrderSettingsTable282.data[i];
					$scope.paymentOrderSettingsTable282.data[i] = $scope.paymentOrderSettingsTable282.data[i+1];
					$scope.paymentOrderSettingsTable282.data[i+1] = dataMap;
					//将执行顺序交换
					var performOrderValue = $scope.paymentOrderSettingsTable282.data[i].performOrder;
					$scope.paymentOrderSettingsTable282.data[i].performOrder = $scope.paymentOrderSettingsTable282.data[i+1].performOrder;
					$scope.paymentOrderSettingsTable282.data[i+1].performOrder = performOrderValue;
					break;
				}
			}
		};
		//282，点击替换参数的方法
		$scope.selectAUpdateBP282 = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
			$scope.itemsNo.indexNo = $index;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/product/selectElementNoUpdateBT.html', $scope.itemsNo, {
					title : T.T('YYJ600015'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '320px' ],
					callbacks : [$scope.choseSelectAUpdateBP282]
				});
		};
		$scope.choseSelectAUpdateBP282 =  function(result) {
			if (!result.scope.elementNoTableUpdate.validCheck()) {
				return;
			};
			$scope.items = {};
			$scope.items = result.scope.elementNoTableUpdate.checkedList();
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.paymentOrderSettingsTable282.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.safeApply();
			result.cancel();
		};*/
		/*============================282，点击替换参数的方法  end*/
	});
});