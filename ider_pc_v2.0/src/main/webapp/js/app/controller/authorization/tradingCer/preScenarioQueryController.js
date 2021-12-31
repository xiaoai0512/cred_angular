'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('preScenariListContrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_tradingNow');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//证件类型
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
 			if(data.value == "1"){//身份证
 				$("#preScenarioList_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#preScenarioList_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#preScenarioList_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#preScenarioList_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#preScenarioList_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#preScenarioList_idNumber").attr("validator","id_isPermanentReside")
            }
        });
 	// 日期控件
 	 		layui.use('laydate', function(){
 	 			  var laydate = layui.laydate;
 	 			  var startDate = laydate.render({
 	 					elem: '#LAY_start_Add',
 	 					min:Date.now(),
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
 	 					elem: '#LAY_end_Add',
 	 					done: function(value, date) {
 	 						startDate.config.max = {
 	 							year: date.year,
 	 							month: date.month - 1,
 	 							date: date.date,
 	 						}
 	 					}
 	 				});
 	 		});
		$scope.showQuotaTable = false;
		//当日交易查询列表
		$scope.itemList = {
				params : $scope.queryParam = {
						"authDataSynFlag":"1",
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:false,
				resource : 'scenario.preScenarioQuery',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_authType'],//查找数据字典所需参数
				transDict : ['transType_transTypeDesc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode != "000000"){
						$scope.showQuotaTable = false;
					}else{
						$scope.showQuotaTable = true;
					}
				}
			};
		$scope.selectList = function() {
			$scope.itemList.params.startDate = $("#LAY_start_Add").val();
			$scope.itemList.params.endDate = $("#LAY_end_Add").val();
			if(($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined)&&($scope.idType == "" || $scope.idType == null || $scope.idType == undefined)&&($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == null || $scope.itemList.params.externalIdentificationNo == undefined)){
				 jfLayer.fail(T.T('SQJ100001'));
				 $scope.itemList.data = [] ;
				 $scope.showQuotaTable = false;

			}else{
				if($scope.idNumber && $scope.itemList.params.externalIdentificationNo){
					jfLayer.fail(T.T('SQJ600005'));
					$scope.itemList.data = [] ;
					 $scope.showQuotaTable = false;

				}else if($scope.idType){
					if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
						jfLayer.alert(T.T('SQJ100002')); 

					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}else if($scope.idNumber){
					if(!$scope.idType){
						jfLayer.fail(T.T('F00098'));

					}
					else{
						$scope.itemList.params.idNumber = $scope.idNumber;
						$scope.itemList.params.idType = $scope.idType;
						$scope.itemList.search();
					}
				}
				else{
					$scope.itemList.params.idNumber = $scope.idNumber;
					$scope.itemList.params.idType = $scope.idType;
					$scope.itemList.search();
				}
			}
		};
		//查询详情事件
		$scope.selectInfo = function(event) {
			$scope.itemList.search();
			// 页面弹出框事件(弹出页面)
			$scope.item = event;
			$scope.modal('/authorization/scenario/preScenarioList.html', $scope.item, {
				title : T.T('SQJ1100005'),
				buttons : [ T.T('F00012')],
				size : [ '950px', '520px' ],
				callbacks : [$scope.closeInfo ]
			});
		};
		$scope.closeInfo = function(result){
			$scope.itemList.search();
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('preScenarioListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		//交易处理状态
		if($scope.item.transProcessStatus == '0'){
			$scope.transProcessStatusInfo = T.T('SQJ2700007');//"未处理";
		}else if($scope.item.transProcessStatus == '1'){
			$scope.transProcessStatusInfo = T.T('SQJ2700011');//"待入帐";
		}else if($scope.item.transProcessStatus == '2'){
			$scope.transProcessStatusInfo = T.T('SQJ2700009');//"已完成";
		}else if($scope.item.transProcessStatus == '3'){
			$scope.transProcessStatusInfo = T.T('SQJ2700012');//"处理失败";
		}
		//入账标志
		if($scope.item.transPostingFlag == 'S'){
			$scope.transPostingInfo = T.T('SQJ2700005');//"实时入账";
		}else if($scope.item.transPostingFlag == 'D'){
			$scope.transPostingInfo = T.T('SQJ2700006');//"非实时入账";
		}
		//授权交易类型
		if($scope.item.transType == 'NM'){
			$scope.transTypeInfo = T.T('SQH2700011');//"正交易";
		}else if($scope.item.transType == 'FR'){
			$scope.transTypeInfo = T.T('SQH2700012');//"冲正";
		}else if($scope.item.transType == 'FV'){
			$scope.transTypeInfo = T.T('SQH2700013');//"撤销";
		}else if($scope.item.transType == 'VR'){
			$scope.transTypeInfo = T.T('SQH2700014');//"撤销冲正";
		}else if($scope.item.transType == 'PA'){
			$scope.transTypeInfo = T.T('SQH2700015');//"预授权";
		}else if($scope.item.transType == 'PR'){
			$scope.transTypeInfo = T.T('SQH2700016');//"预授权冲正";
		}else if($scope.item.transType == 'PV'){
			$scope.transTypeInfo = T.T('SQH2700017');//"预授权撤销";
		}else if($scope.item.transType == 'PW'){
			$scope.transTypeInfo = T.T('SQH2700018');//"预授权撤销冲正";
		}else if($scope.item.transType == 'PC'){
			$scope.transTypeInfo = T.T('SQH2700019');//"预授权完成";
		}else if($scope.item.transType == 'CR'){
			$scope.transTypeInfo = T.T('SQH2700020');//"预授权完成冲正";
		}else if($scope.item.transType == 'CV'){
			$scope.transTypeInfo = T.T('SQH2700021');//"预授权完成撤销";
		}else if($scope.item.transType == 'CW'){
			$scope.transTypeInfo = T.T('SQH2700022');//"预授权完成撤销冲正";
		}
		//输入来源：
		if($scope.item.inputSource == 'V'){
			$scope.inputSourceInfo = "VISA";
		}else if($scope.item.inputSource == 'M'){
			$scope.inputSourceInfo = "MC";
		}else if($scope.item.inputSource == 'C'){
			$scope.inputSourceInfo = "CUP";
		}else if($scope.item.inputSource == 'L'){
			$scope.inputSourceInfo = T.T('SQJ2700004');//"本地";
		}
		$scope.forceFlag = false;
		$scope.rvFlag = false;
		if($scope.item.forceAuthFlag == 'Y'){
			$scope.forceFlag = true;
		}else{
			$scope.forceFlag = false;
		}
		if($scope.item.rvTransFlag == 'Y'){
			$scope.rvFlag = true;
		}else{
			$scope.rvFlag = false;
		}
		$scope.forceInfo = function(){
			$scope.cusParams = {
					"authDataSynFlag":'1',
					"transMessage":$scope.item.transMessage
				};
				jfRest.request('preScenarioList', 'force', $scope.cusParams)
			    .then(function(data) {
			    	if(data.returnCode == '000000'){
			    		$('#forceInfoId').attr('disabled',"true");
						$('#forceInfoId').css('background-color','#ccdfeb');
			    		jfLayer.success(T.T('F00064'));
			    	}
	            });
		};
		$scope.rvInfo = function(){
				$scope.cusParams = {
						"authDataSynFlag":'1',
						"transMessage":$scope.item.transMessage
					};
					jfRest.request('tradingNowList', 'rvTrans', $scope.cusParams)
				    .then(function(data) {
				    	console.log(data);
				    	if(data.returnCode == '000000'){
				    		$('#rvInfoId').attr('disabled',"true");
							$('#rvInfoId').css('background-color','#ccdfeb');
				    		jfLayer.success(T.T('F00064'));
				    	}
		            });
		}
	});
});
