'use strict';
define(function(require) {

	var webApp = require('app');

	// 封锁码历史查询
	webApp.controller('blockHistoryCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockHistory');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		
		$scope.blockList = {};
		$scope.isShowCstDiv =false;
    	
	
		
		//日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  
			  var startDate = laydate.render({
					elem: '#blockStartDate',
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
					}
				});
				var endDate = laydate.render({
					elem: '#blockEndDate',
					//min:Date.now(),
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
 			
 			$scope.blockList.idNumber ='';
 			if(data.value == "1"){//身份证
 				$("#blockHistory_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#blockHistory_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#blockHistory_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#blockHistory_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#blockHistory_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#blockHistory_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		//'C-客户级''A-业务类型级''P-产品级''M-媒介级'
		$scope.demoArray2 = [ {
			name : T.T('KHJ700001'),
			id : 'C'
		}, {
			name : T.T('KHJ700002'),
			id : 'A'
		}, {
			name : T.T('KHJ700003'),
			id : 'P'
		}, {
			name : T.T('KHJ700004'),
			id : 'M'
		} ];

		$scope.reset = function() {
			$scope.blockList.idNumber = '';
			$scope.blockList.externalIdentificationNo = '';
			
			$scope.blockList.idType= '';
			$scope.blockList.customerNo= '';
			
			$('#blockHistory_idNumber').attr('validator','noValidator');
			$('#blockHistory_idNumber').removeClass('waringform');
		};
		
		
		$scope.relationTable = {
				autoQuery:false,
				params : $scope.queryParam = {
						"pageSize" : 10,
						"indexNo" : 0	
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'blockCodeHistory.query',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_specialEventState'],//查找数据字典所需参数
				transDict : ['state_stateDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
							$scope.isShowCstDiv =true;
						}else {
							$scope.isShowCstDiv =true;
						}
					}else {
						$scope.isShowCstDiv =false;
					}
				}
			};
		
		//查询
		$scope.queryBlockHistory = function () {
			$scope.startDate = $("#blockStartDate").val();
			$scope.endDate = $("#blockEndDate").val();
			if(($scope.blockList["idType"] == null || $scope.blockList["idType"] == ''|| $scope.blockList["idType"] == undefined) &&
					($scope.blockList.customerNo == null || $scope.blockList.customerNo == ''|| $scope.blockList.customerNo == undefined) &&
					($scope.blockList.idNumber == "" || $scope.blockList.idNumber== undefined) &&
					 ($scope.blockList.externalIdentificationNo == "" || $scope.blockList.externalIdentificationNo== undefined) ){
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}
			else {
				if($scope.blockList["idType"]){
					if($scope.blockList["idNumber"] == null || $scope.blockList["idNumber"] == undefined || $scope.blockList["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShowCstDiv = false;
					}else {
						$scope.relationTable.params.idType = $scope.blockList.idType;
						$scope.relationTable.params.idNumber = $scope.blockList.idNumber;
						$scope.relationTable.params.externalIdentificationNo =  $scope.blockList.externalIdentificationNo;
						$scope.relationTable.params.startDate = $scope.startDate;
						$scope.relationTable.params.endDate = $scope.endDate;
						$scope.relationTable.search();
					}
				}else if($scope.blockList["idNumber"]){
					if($scope.blockList["idType"] == null || $scope.blockList["idType"] == undefined || $scope.blockList["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShowCstDiv = false;
					}else {
						$scope.relationTable.params.idType = $scope.blockList.idType;
						$scope.relationTable.params.idNumber = $scope.blockList.idNumber;
						$scope.relationTable.params.externalIdentificationNo =  $scope.blockList.externalIdentificationNo;
						$scope.relationTable.params.startDate = $scope.startDate;
						$scope.relationTable.params.endDate = $scope.endDate;
						$scope.relationTable.search();
					}
				}else {
					$scope.relationTable.params.idType = $scope.blockList.idType;
					$scope.relationTable.params.idNumber = $scope.blockList.idNumber;
					$scope.relationTable.params.externalIdentificationNo =  $scope.blockList.externalIdentificationNo;
					$scope.relationTable.params.startDate = $scope.startDate;
					$scope.relationTable.params.endDate = $scope.endDate;
					$scope.relationTable.search();
				}
			}
			
		};
		
		//查询详情按钮
		$scope.selectCodeInfo = function(item,$event){
			$scope.codeItem = {};
			$scope.codeItem = $.parseJSON(JSON.stringify(item));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/baseBsnPcsg/blockCodeHistoryInfo.html', $scope.codeItem, {
				title : T.T('KHJ700011'),//'封锁码码信息',
				buttons : [T.T('F00012')],//'关闭' 
				size : [ '1050px', '500px' ],
				callbacks : [ ]
			});
		};
	});
	
	
	//查询
	webApp.controller('blockCodeHistoryInfoCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockHistory');
		$translate.refresh();
	
		
		//C/G/A/P/M C-客户级/G-业务项目级/A-业务类型级/P-产品级/M-媒介级',
		if($scope.codeItem.sceneTriggerObjectLevel == 'C'){
			$scope.codeItem.sceneTriggerObjectLevelTrans = T.T('KHJ700006');
		}else if($scope.codeItem.sceneTriggerObjectLevel == 'G'){
			$scope.codeItem.sceneTriggerObjectLevelTrans = T.T('KHJ700007');
		}else if($scope.codeItem.sceneTriggerObjectLevel == 'A'){
			$scope.codeItem.sceneTriggerObjectLevelTrans = T.T('KHJ700008');
		}else if($scope.codeItem.sceneTriggerObjectLevel == 'P'){
			$scope.codeItem.sceneTriggerObjectLevelTrans = T.T('KHJ700009');
		}else if($scope.codeItem.sceneTriggerObjectLevel == 'M'){
			$scope.codeItem.sceneTriggerObjectLevelTrans = T.T('KHJ700010');
        }
        //Y-有效 D-已解除
		if($scope.codeItem.state == 'Y'){
			$scope.codeItem.stateTrans = T.T('KHH700018');
		}else if($scope.codeItem.state == 'D'){
			$scope.codeItem.stateTrans =T.T('KHH700019');
        }
    });
});