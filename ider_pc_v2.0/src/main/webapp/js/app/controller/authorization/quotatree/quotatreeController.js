'use strict';
define(function(require) {
	var webApp = require('app');
	//额度树查询
	webApp.controller('quotatreeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotatree');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotaNode');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#LAYQUOTA_startDate1',
				//min:Date.now(),
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
				elem: '#LAYQUOTA_endDate1',
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
		//运营模式
		 $scope.coArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.query",//数据源调用的action
		        callback: function(data){
		        }
		    };
		//自定义下拉框---------额度共享标志
		 $scope.sharedArray ={
		        type:"dictData",
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_creditShared",
		        	queryFlag: "children"
		        },//默认查询条件
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action
		        callback: function(data){
		        }
			};
		 $scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.quotaShow = true;
		 $scope.isTime = true;
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
	   	   			if($scope.eventList.search('AUS.PM.03.0101') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.PM.03.0104') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.03.0102') != -1){    //展示树
	   					$scope.seltreeBtnFlag = true;
	   				}
	   				else{
	   					$scope.seltreeBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.PM.03.0103') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   	   /*	if($scope.eventList.search('LMS.PM.01.0001') != -1){   //新增额度节点
			   	   	    $scope.addBtnNodeFlag = true;
			   	   	}
			   	   	else{
			   	   	    $scope.addBtnNodeFlag = false;
			   	   	}
			   	 if($scope.eventList.search('LMS.PM.01.0004') != -1){   //删除额度节点
			   	   	    $scope.delBtnNodeFlag = true;
			   	   	}
			   	   	else{
			   	   	    $scope.delBtnNodeFlag = false;
			   	   	}*/
   				}
   			});
			//额度树查询
			$scope.itemList = {
					params : $scope.queryParam = {
							"authDataSynFlag":"1",
							"pageSize":10,
							"indexNo":0
					}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'quotatree.queryTree',// 列表的资源
					callback : function(data) { // 表格查询后的回调函数
					}
				};
			//查询额度树列表
			$scope.selectQuoteTreeList = function(){
				$scope.startDate = $("#LAYQUOTA_startDate1").val();
	   			$scope.endDate = $("#LAYQUOTA_endDate1").val();
	   			$scope.itemList.params.queryStartDate = $scope.startDate;
	   			$scope.itemList.params.queryEndDate = $scope.endDate;
	   			$scope.itemList.search();
			};
			//查询详情事件
			$scope.selectList = function(event) {
				// 页面弹出框事件(弹出页面)
				$scope.item = $.parseJSON(JSON.stringify(event));
				$scope.creditTreeIdSel = $scope.item.creditTreeId;
				$scope.operationModeSel = $scope.item.operationMode;
				$scope.effectiveDate = $scope.item.effectiveDate;
				$scope.aryparamss = {"authDataSynFlag":"1",
									"creditTreeId":$scope.creditTreeIdSel,
									"operationMode":$scope.operationModeSel,
									"effectiveDate":$scope.effectiveDate
									};
				jfRest.request('quotatree', 'query', $scope.aryparamss)
				.then(function(data) {
					if(data.returnData.rows.length < 0){
						jfLayer.fail(T.T('SQJ2100001'));
					}
					else{
						$scope.modal('/authorization/quotatree/quotatree.html', $scope.item, {
							title : T.T('SQJ2100002'),
							buttons : [ T.T('F00012')],
							size : [ '1170px', '680px' ],
							callbacks : [ ]
						});
					}
				});
			};
			$scope.swe=function(result){
				console.log(result);
			};


			//删除指定日期的额度网
			$scope.deleteMeshByDate = function(event){
				$scope.delItem = $.parseJSON(JSON.stringify(event));
				jfLayer.confirm(T.T('SQJ2000004'),function() {
					$scope.delParams = {
						"operationMode":$scope.delItem.operationMode,
						"creditTreeId":$scope.delItem.creditTreeId,
						"effectiveDate":$scope.delItem.effectiveDate,
						"requestType":"1",
						"resultType":"1"
					};
					jfRest.request('quotatree', 'creditMeshDel', $scope.delParams).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.alert(T.T('F00037'));
							$scope.safeApply();
							$scope.delItem = {};
							$scope.itemList.search();
						}
					});
				},function() {
				});
			};

			//维护额度树
			$scope.updateQuotaTree = function(event) {
				if($scope.itemList.params.operationMode){
					$scope.selectParamss = {"authDataSynFlag":"1",
						"operationMode":$scope.itemList.params.operationMode
					};
					jfRest.request('quotatree', 'queryTree', $scope.selectParamss).then(function(data) {
						if(data.returnData.rows.length < 0){
							jfLayer.fail(T.T('SQJ2100001'));
						}else{
							// 页面弹出框事件(弹出页面)
							$scope.itemUpdate = {};
							$scope.itemUpdate = data.returnData.rows[0];
							$scope.modal('/authorization/quotatree/quotatreeUpdate.html', $scope.itemUpdate, {
								title : T.T('SQJ2100004'),
								buttons : [ T.T('F00107'),T.T('F00012')],
								size : [ '900px', '480px' ],
								callbacks : [$scope.updateTreeSure]
							});
						}
					});
				}else{
					jfLayer.fail('请选择运营模式！');

				}
			};
			//维护额度树
			$scope.updateTreeSure = function(result){
				$scope.qtreeInfo = $.parseJSON(JSON.stringify(result.scope.itemUpdate));
				$scope.qtreeInfo.authDataSynFlag = "1";
				jfRest.request('quotatree', 'updateTree', $scope.qtreeInfo).then(function(data) {
  	                if (data.returnCode == '000000') {
  	                	jfLayer.success(T.T('SQJ2100005'));
  	                	$scope.safeApply();
						result.cancel();
						$scope.qtreeInfo={};
						$scope.itemList.search();
  	                }
  	                else{
  	                	$scope.safeApply();
						result.cancel();
  	                }
  	            });
			};
			//新增额度树
			$scope.addQuotaTree = function() {
				$scope.modal('/authorization/quotatree/quotatreeAdd.html', '', {
					title : T.T('SQJ2100007'),
					buttons : [ T.T('F00107'),T.T('F00012')],
					size : [ '900px', '480px' ],
					callbacks : [$scope.addTreeSure ]
				});
			};
			$scope.addTreeSure = function(result){
				$scope.qtreeInfo = $.parseJSON(JSON.stringify(result.scope.qtree));
				$scope.qtreeInfo.authDataSynFlag = "1";
				jfRest.request('quotatree', 'addTree', $scope.qtreeInfo).then(function(data) {
  	                if (data.returnCode == '000000') {
  	                	jfLayer.success(T.T('SQJ2100008'));
  	                	$scope.safeApply();
						result.cancel();
						$scope.qtreeInfo={};
						$scope.itemList.search();
  	                }
  	                else{
  	                	$scope.safeApply();
						result.cancel();
  	                }
  	            });
			};
	});
	//新增
	webApp.controller('quotatreeSAddCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//运营模式
		 $scope.coArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.query",//数据源调用的action
		        callback: function(data){
		        }
		    };
		 var form = layui.form;
			form.on('select(getoperation)',function(event){
				$scope.aryparamss = {"authDataSynFlag":"1","operationMode":$scope.qtree.operationMode};
				jfRest.request('quotatree', 'query', $scope.aryparamss)
				.then(function(data) {
					if(data.returnData.children.length == 0 || data.returnData.children == ""){
					}
					else{
						$scope.qtree.operationMode = "";
					}
				});
			});
	});
	//维护
	webApp.controller('quotatreeSUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//运营模式
		 $scope.coArray ={
		        type:"dynamic",
		        param:{},//默认查询条件
		        text:"modeName", //下拉框显示内容，根据需要修改字段名称
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"operationMode.query",//数据源调用的action
		        callback: function(data){
		        	$scope.operationMode = $scope.itemUpdate.operationMode;
		        }
		    };
	});
	//查询详情
	webApp.controller('quotatreeInfoCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		var echarts;
		Tansun.loadScript("echarts",function(script){
			echarts = script;
			$scope.creditTreeIdSel = $scope.item.creditTreeId;
			$scope.operationModeSel = $scope.item.operationMode;
			$scope.effectiveDate = $scope.item.effectiveDate;
			var myChart = echarts.init(document.getElementById('main'));//基于准备好的dom，初始化echarts图表
			myChart.showLoading();
			$scope.aryparamss = {"authDataSynFlag":"1",
								"creditTreeId":$scope.creditTreeIdSel,
								"operationMode":$scope.operationModeSel,
								"effectiveDate":$scope.effectiveDate
								};
			jfRest.request('quotatree', 'query', $scope.aryparamss)
			.then(function(data) {
				var linkStr = "";    //取额度节点之间的关系===links
				$scope.linkList = [];  //取额度节点之间的关系===links  ,x:100+i*100,y:200+i*100
				for(var i=0;i<data.returnData.rows[0].authCreditMeshDtoList.length;i++){
					///组合关系
					if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'R'){//汇总
						linkStr = {source:data.returnData.rows[0].authCreditMeshDtoList[i].creditDesc,
								target:data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeDesc,
								lineStyle:{width:2,curveness:0,color:'#666'}};
						$scope.linkList.push(linkStr);
					}else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'O'){//占用
						linkStr = {source:data.returnData.rows[0].authCreditMeshDtoList[i].creditDesc,
								target:data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeDesc,
								lineStyle:{width:2,curveness:0,color:'#00db00'}};
						$scope.linkList.push(linkStr);
					}else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'S'){//共享
						linkStr = {source:data.returnData.rows[0].authCreditMeshDtoList[i].creditDesc,
								target:data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeDesc,
								lineStyle:{curveness: -0.3,color:'#ec8e00'}};
						$scope.linkList.push(linkStr);
					}else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'C'){//检查
						linkStr = {source:data.returnData.rows[0].authCreditMeshDtoList[i].creditDesc,
								target:data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeDesc,
								lineStyle:{width:2,curveness:0,color:'#ff0000'}};
						$scope.linkList.push(linkStr);
					}
                }
                var creditListStr = "";
				$scope.creditList = [];
				for(var j=0;j<data.returnData.rows[0].authCreditNodeDtoList.length;j++){
					if($scope.creditList.length > 0){
						for(var k=j-1;k<$scope.creditList.length;k++){
							if($scope.creditList[k].y == data.returnData.rows[0].authCreditNodeDtoList[j].creditNodeNoLevel+1){
								creditListStr = {name:data.returnData.rows[0].authCreditNodeDtoList[j].creditDesc,x:$scope.creditList[k].x+1,y:data.returnData.rows[0].authCreditNodeDtoList[j].creditNodeNoLevel+1};
								$scope.creditList.push(creditListStr);
							}else{
								creditListStr = {name:data.returnData.rows[0].authCreditNodeDtoList[j].creditDesc,x:4,y:data.returnData.rows[0].authCreditNodeDtoList[j].creditNodeNoLevel+1};
								$scope.creditList.push(creditListStr);
							}
							break;
						}
					}else{
						creditListStr = {name:data.returnData.rows[0].authCreditNodeDtoList[j].creditDesc,x:j+6,y:data.returnData.rows[0].authCreditNodeDtoList[j].creditNodeNoLevel+1};
						$scope.creditList.push(creditListStr);
					}
				}
				myChart.hideLoading();
				var option = {
					    tooltip: {
					        trigger: 'item'
					    },
					    animationEasingUpdate: 'quinticInOut',
					    series: [
					        {
					            type: 'graph',  //关系图
					            layout: 'none', //force
					            coordinateSystem : null,//坐标系可选
					            xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
					            yAxisIndex : 0, //y轴坐标
					            focusNodeAdjacency : true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
					            roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
					            nodeScaleRatio: 0.3,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
					            symbol: "circle",
					            symbolSize: [90,90],
					            edgeSymbol: ['circle', 'arrow'],
					            edgeSymbolSize: [2, 10],
					            cursor: "pointer",
					            label: {
					                show: true
					            },
					            itemStyle: {
					              color: '#196c9e'
					            },
					            data: $scope.creditList,
					            links: $scope.linkList,
					            lineStyle: {
					                opacity: 0.9,
					                width: 2,
					                curveness: 0,
					            }
					        }
					    ]
					};
				//页面加载完毕时获取数据
				myChart.setOption(option);
			});
		});
	});
	//***************查看业务项目详情end***************
	//业务类型
	webApp.controller('choseBusinessTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		//业务类型列表
		$scope.businessTypeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessType.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//媒介对象
	webApp.controller('choseMediaObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translate.refresh();
		//媒介对象列表
		$scope.mediaObjectList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'mediaObject.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数

			}
		};
	});
	//余额对象
	webApp.controller('choseBalanceObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {}
			};
		// 余额对象列表
		$scope.balanceObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" : $rootScope.operationMods,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'balanceObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_balanceType'],//查找数据字典所需参数
			transDict : ['objectType_objectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//产品对象
	webApp.controller('choseProductObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//产品對象列表
		$scope.proObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//业务项目
	webApp.controller('choseProductLineCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//业务项目列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//事件
	webApp.controller('choseEventCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//币种
	webApp.controller('choseCurrencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		//货币列表
		$scope.currencyTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//核算状态
	webApp.controller('choseAcstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.accountStateTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'accountState.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
				}
			};
	});
	//授权场景
	webApp.controller('choseScenarioCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.scenarioList = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'authScene.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
				}
			};
	});
	//额度节点
	webApp.controller('choseQuotaTreeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.quotaTreeList = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"operationMode" :$rootScope.operationMods,
						"authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'quotaNode.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
	});
	//延滞层级
	webApp.controller('choseDelvCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.delvTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'delv.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数

				}
			};
	});
	//封锁码
	webApp.controller('choseBlockCodeCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级G:业务项目*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   			}
   		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//封锁码列表
		$scope.blockCDScnMgtTable = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCode.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_effectiveScope'],//查找数据字典所需参数
			transDict : ['effectivenessCodeScope_effectivenessCodeScopeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
	});
});
