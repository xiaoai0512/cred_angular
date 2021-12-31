'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户管控视图
	webApp.controller('cstControlViewCtrl',function($scope, $stateParams, jfRest,$timeout, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_cstControlView');
	$translate.refresh();
	$scope.userName = lodinDataService.getObject("menuName");//菜单名
	$scope.queryBlockView ={};
	$scope.isShowQuery = false;
	layui.use(['laydate', 'form'], function(){
	  var  form = layui.form;
	  form.on('select(myselect)', function(data){
		//日期控件
	 var laydate = layui.laydate;
	  var startDate = laydate.render({
			elem: '#blockView_zs',
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
				$scope.queryBlockView.startDate = $("#blockView_zs").val();
			}
		});
		var endDate = laydate.render({
			elem: '#blockView_ze',
			//min:Date.now(),
			done: function(value, date) {
				startDate.config.max = {
					year: date.year,
					month: date.month - 1,
					date: date.date,
				};
				$scope.queryBlockView.endDate = $("#blockView_ze").val();
			}
		});
		//日期控件end
		if(data.value == '1'){
			$scope.isShowQuery = true;
			laydate.render();
			$timeout(function(){
				//日期控件
				 var laydate = layui.laydate;
				  var startDate = laydate.render({
						elem: '#blockView_zs',
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
							$scope.queryBlockView.startDate = $("#blockView_zs").val();
						}
					});
					var endDate = laydate.render({
						elem: '#blockView_ze',
						//min:Date.now(),
						done: function(value, date) {
							startDate.config.max = {
								year: date.year,
								month: date.month - 1,
								date: date.date,
							};
							$scope.queryBlockView.endDate = $("#blockView_ze").val();
						}
					});
					//日期控件end
			},100);
		}else if(data.value == '0'){
			$scope.isShowQuery = false;
			laydate.render();
		}
		});
	}); 
	//动态请求下拉框 证件类型
	 $scope.certificateTypeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_certificateType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
	};
             //联动验证
             var form = layui.form;
             form.on('select(getIdType)',function(data){
            	 $scope.queryBlockView.idNumber = '';
             	if(data.value == "1"){//身份证
             		$("#cstCtrlView_idNumber").attr("validator","id_idcard");
             	}else if(data.value == "2"){//港澳居民来往内地通行证
             		$("#cstCtrlView_idNumber").attr("validator","id_isHKCard");
             	}else if(data.value == "3"){//台湾居民来往内地通行证
             		$("#cstCtrlView_idNumber").attr("validator","id_isTWCard");
             	}else if(data.value == "4"){//中国护照
             		$("#cstCtrlView_idNumber").attr("validator","id_passport");
             	}else if(data.value == "5"){//外国护照passport
             		$("#cstCtrlView_idNumber").attr("validator","id_passport");
             	}else if(data.value == "6"){//外国人永久居留证
             		$("#cstCtrlView_idNumber").attr("validator","id_isPermanentReside");
             	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
             		$("#cstCtrlView_idNumber").attr("validator","noValidator");
             		$scope.queryInfForm.$setPristine();
             		$("#cstCtrlView_idNumber").removeClass("waringform ");
                }
             });
				/*$scope.queryFlagArray = [ {name : T.T('KHH5200012'),id : '0'},
				                 				{name : T.T('KHH5200013'),id : '1'} ];*/
				//查询方式
				$scope.queryFlagArray ={ 
				        type:"dictData", 
				        param:{
				        	"type":"DROPDOWNBOX",
				        	groupsCode:"dic_queryFlag",
				        	queryFlag: "children"
				        },//默认查询条件 
				        text:"codes", //下拉框显示内容，根据需要修改字段名称 
				        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
				        desc: 'detailDesc',
				        resource:"paramsManage.query",//数据源调用的action 
				        callback: function(data){
				        	$scope.queryBlockView.queryFlag = '0';
				        }
			};
	$scope.demoArray2 = [ {
			name : T.T('KHJ5200001'),//'C-客户级',
			id : 'C'
		}, {
			name : T.T('KHJ5200002'),//'A-业务类型级',
			id : 'A'
		}, {
			name : T.T('KHJ5200003'),//'P-产品级',
			id : 'P'
		}, {
			name : T.T('KHJ5200004'),//'M-媒介级',
			id : 'M'
		} ];
		$scope.reset = function() {
			$scope.queryBlockView.idNumber= '';
			$scope.queryBlockView.externalIdentificationNo= '';
			$scope.queryBlockView.idType= '';
			$scope.queryBlockView.queryFlag = '';
			$scope.queryBlockView.contrlLevel = '';
			$scope.queryBlockView.startDate = '';
			$scope.queryBlockView.endDate = '';
			$scope.isShowCstDiv = false;
			$("#cstCtrlView_idNumber").attr("validator","noValidator");
			$("#cstCtrlView_idNumber").removeClass("waringform ");
		};
		//查询执行函数
		$scope.cstInfo = {};
		$scope.searchHandlee = function(params){
		if(params.queryFlag){//查询方式
			if(params.queryFlag == '1'){
				//管控层级和日期修改为非必输
//				if((params.startDate == '' || params.startDate == null || params.startDate == undefined) || 
//					(params.endDate == '' || params.endDate == null || params.endDate == undefined) || 
//					(params.contrlLevel == '' || params.contrlLevel == null || params.contrlLevel == undefined)  ){
//					jfLayer.alert(T.T('KHJ5200006'));
//					$scope.isShowCstDiv = false;
//				}else{
					jfRest.request('cstProduct','viewQueryCstBaseInf',params).then(function(data) {
						if (data.returnCode == '000000') {
							if (data.returnData != null) {
								$scope.cstInfo.idType = data.returnData.rows[0].idType;
								$scope.cstInfo.idNumber = data.returnData.rows[0].idNumber;
								$scope.cstInfo.customerName = data.returnData.rows[0].customerName;
								$scope.cstMdmInfTable.params.customerNo = data.returnData.rows[0].customerNo;
								$scope.cstMdmInfTable.params.idNumber = data.returnData.rows[0].idNumber;
								$scope.cstMdmInfTable.params.idType = $scope.queryBlockView.idType;
								$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.queryBlockView.externalIdentificationNo;
								$scope.cstMdmInfTable.params.queryFlag = $scope.queryBlockView.queryFlag;
								$scope.cstMdmInfTable.params.contrlLevel = $scope.queryBlockView.contrlLevel;
								//开始日期
								$scope.cstMdmInfTable.params.startDate = $("#blockView_zs").val();
								//结束日期
								$scope.cstMdmInfTable.params.endDate = $("#blockView_ze").val();
								$scope.cstMdmInfTable.search();
								
								$scope.isShowCstDiv = true;
							} else {
								jfLayer .alert(T.T('KHJ5200005'));//"抱歉，不存在此客户！"
								$scope.isShowCstDiv = false;
							}
						} else {
							$scope.isShowCstDiv = false;
						}
					});
//				}
			}else {
				jfRest.request('cstInfQuery', 'queryInf',params).then(function(data) {
					if (data.returnCode == '000000') {
						if (data.returnData != null) {
							$scope.cstInfo.idType = data.returnData.rows[0].idType;
							$scope.cstInfo.idNumber = data.returnData.rows[0].idNumber;
							$scope.cstInfo.customerName = data.returnData.rows[0].customerName;
							$scope.cstMdmInfTable.params.customerNo = data.returnData.rows[0].customerNo;
							$scope.cstMdmInfTable.params.idNumber = data.returnData.rows[0].idNumber;
							$scope.cstMdmInfTable.params.idType = $scope.queryBlockView.idType;
							$scope.cstMdmInfTable.params.customerName = data.returnData.rows[0].customerName;
							$scope.cstMdmInfTable.params.externalIdentificationNo = $scope.queryBlockView.externalIdentificationNo;
							$scope.cstMdmInfTable.params.queryFlag = $scope.queryBlockView.queryFlag;
							$scope.cstMdmInfTable.params.contrlLevel = $scope.queryBlockView.contrlLevel;
							//开始日期
							$scope.cstMdmInfTable.params.startDate = $("#blockView_zs").val();
							//结束日期
							$scope.cstMdmInfTable.params.endDate = $("#blockView_ze").val();
							$scope.cstMdmInfTable.search();
							$scope.isShowCstDiv = true;
						} else {
							jfLayer .alert(T.T('KHJ5200005'));//"抱歉，不存在此客户！"
							$scope.isShowCstDiv = false;
						}
					} else {
						$scope.isShowCstDiv = false;
					}
				});
			}
		}else {
			jfLayer.alert(T.T('KHJ5200007'));
			$scope.isShowCstDiv = false;
        }
        };
		// 查询
		$scope.queryListBlockView = function() {
			$scope.queryBlockView.startDate = $("#blockView_zs").val();
			$scope.queryBlockView.endDate = $("#blockView_ze").val();
			$scope.mdmActvtInfo = $scope.queryBlockView;
			$scope.mdmActvtInfo.queryFlag = $scope.queryBlockView.queryFlag;
			/*$scope.mdmActvtInfo.idNumber = $scope.queryBlockView.idNumber;
			$scope.mdmActvtInfo.idType = $scope.queryBlockView.idType;*/
			if (($scope.queryBlockView.idType == null || $scope.queryBlockView.idType == ''|| $scope.queryBlockView.idType == undefined) &&
					($scope.queryBlockView.customerNo == null || $scope.queryBlockView.customerNo == ''|| $scope.queryBlockView.customerNo == undefined) &&
					($scope.queryBlockView.idNumber == "" || $scope.queryBlockView.idNumber == undefined || $scope.queryBlockView.idNumber == 'undefined')
					&& ($scope.queryBlockView.externalIdentificationNo == "" || $scope.queryBlockView.externalIdentificationNo == undefined)) {
				jfLayer.alert(T.T('F00076'));//"请输入身份证号外部识别号其中一个！"
			}
			else {
				if($scope.queryBlockView["idType"]){
					if($scope.queryBlockView["idNumber"] == null || $scope.queryBlockView["idNumber"] == undefined || $scope.queryBlockView["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else if($scope.queryBlockView["idNumber"]){
					if($scope.queryBlockView["idType"] == null || $scope.queryBlockView["idType"] == undefined || $scope.queryBlockView["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstDiv = false;
					}else {
						$scope.searchHandlee($scope.mdmActvtInfo);
					}
				}else {
					$scope.searchHandlee($scope.mdmActvtInfo);
				}
			}
		};
		$scope.cstMdmInfTable = {
			autoQuery : false,
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'blockCodeControlView.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_scenarioTriggerType'],//查找数据字典所需参数
			transDict : ['contrlLevel_contrlLevelDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					if (data.returnData != null) {
						$scope.isShowCstDiv = true;
					} else {
						jfLayer.alert(T.T('KHJ5200005'));//"抱歉，不存在此客户！"
						$scope.isShowCstDiv = false;
					}
				} else {
					$scope.isShowCstDiv = false;
				}
			}
		};
		//管控事件
		$scope.eventClick = function(event){
			// 页面弹出框事件(弹出页面)
			$scope.eventInfo = {};
			$scope.eventInfo = $.parseJSON(JSON.stringify(event));
			$scope.eventInfo.idNumber = $scope.queryBlockView.idNumber;
			$scope.eventInfo.idType = $scope.queryBlockView.idType;
			$scope.eventInfo.externalIdentificationNo = $scope.queryBlockView.externalIdentificationNo;
			$scope.modal('/cstSvc/baseBsnPcsg/cstControlViewEvent.html', $scope.eventInfo, {
				title : T.T('KHH5200027'),
				buttons : [T.T('F00108')],
				size : [ '1050px', '580px' ],
				callbacks : []
			});
		};
		//关联特别状况
		$scope.codeClick = function(event){
			// 页面弹出框事件(弹出页面)
			$scope.codeInfo = {};
			$scope.codeInfo = $.parseJSON(JSON.stringify(event));
			$scope.codeInfo.idNumber = $scope.queryBlockView.idNumber;
			$scope.codeInfo.idType = $scope.queryBlockView.idType;
			$scope.codeInfo.externalIdentificationNo = $scope.queryBlockView.externalIdentificationNo;
			$scope.modal('/cstSvc/baseBsnPcsg/cstControlViewCode.html', $scope.codeInfo, {
				title : T.T('KHH5200044'),
				buttons : [T.T('F00108')],
				size : [ '1200px', '580px' ],
				callbacks : []
			});
		}
		
	});
	// 客户管控视图
	webApp.controller('cstEventViewCtrl',function($scope, $stateParams, jfRest,$timeout, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.blockEventNoTable = {
				autoQuery:true,
				params : $scope.queryParam = {
						customerNo:$scope.eventInfo.customerNo,
						idNumber:$scope.eventInfo.idNumber,
						idType:$scope.eventInfo.idType,
						customerName:$scope.eventInfo.customerName,
						externalIdentificationNo:$scope.eventInfo.externalIdentificationNo,
						queryFlag:$scope.eventInfo.queryFlag,
						contrlLevel:$scope.eventInfo.contrlLevel,
						startDate:$scope.eventInfo.startDate,
						endDate:$scope.eventInfo.endDate,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'deleteBlockCode.queryEventNo',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(data.returnData){
							if(!data.returnData.rows || data.returnData.rows.length == 0){
								data.returnData.rows = [];
							}
						}else {
							data.returnData = {
									row: []
							}
						}
					}else {
					}
				}
			};
	});
	//关联特别状况
	webApp.controller('cstCodeViewCtrl',function($scope, $stateParams, jfRest,$timeout, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.blockTable = {
				autoQuery:true,
				params : $scope.queryParam = {
						customerNo:$scope.codeInfo.customerNo,
						idNumber:$scope.codeInfo.idNumber,
						idType:$scope.codeInfo.idType,
						customerName:$scope.codeInfo.customerName,
						externalIdentificationNo:$scope.codeInfo.externalIdentificationNo,
						queryFlag:$scope.codeInfo.queryFlag,
						contrlLevel:$scope.codeInfo.contrlLevel,
						startDate:$scope.codeInfo.startDate,
						endDate:$scope.codeInfo.endDate,
						queryControl:'Y',
						effectivenessCodeType:$scope.codeInfo.effectivenessCodeType,
						effectivenessCodeScene:$scope.codeInfo.effectivenessCodeScene,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'deleteBlockCode.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_scenarioTriggerType','dic_specialEventState'],//查找数据字典所需参数
				transDict : ['sceneTriggerObjectLevel_sceneTriggerObjectLevelDesc','state_stateDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}else {
					}
				}
			};
	});
});
