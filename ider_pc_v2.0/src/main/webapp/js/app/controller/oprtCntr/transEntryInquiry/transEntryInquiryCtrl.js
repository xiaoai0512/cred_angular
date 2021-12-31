'use strict';
define(function(require) {
	var webApp = require('app');
	//交易入账查询
	webApp.controller('transEntryInquiryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.upBtnFlag = false;
		$scope.selBtnFlag = false;
		//搜索身份证类型
		$scope.certificateTypeArray1 = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_IdCardType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
        	$scope.transEntryInquiryTable.params.idNumber = '';
        	if(data.value == "1"){//身份证
        		$("#transEntryInquiry_idNumber").attr("validator","id_idcard");
        	}else if(data.value == "2"){//港澳居民来往内地通行证
        		$("#transEntryInquiry_idNumber").attr("validator","id_isHKCard");
        	}else if(data.value == "3"){//台湾居民来往内地通行证
        		$("#transEntryInquiry_idNumber").attr("validator","id_isTWCard");
        	}else if(data.value == "4"){//中国护照
        		$("#transEntryInquiry_idNumber").attr("validator","id_passport");
        	}else if(data.value == "5"){//外国护照passport
        		$("#transEntryInquiry_idNumber").attr("validator","id_passport");
        	}else if(data.value == "6"){//外国人永久居留证
        		$("#transEntryInquiry_idNumber").attr("validator","id_isPermanentReside");
        	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#transEntryInquiry_idNumber").attr("validator","noValidator");
        		$scope.transEntryInquiryForm.$setPristine();
        		$("#transEntryInquiry_idNumber").removeClass("waringform ");
            }
        });
        //交易入账状态 
        $scope.transEntryStatusArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_transactionEntryStatus",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '840',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
        //日期控件
		layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  var startDate = laydate.render({
					elem: '#transEntry_zs',
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
					elem: '#transEntry_ze',
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
			   	   	if($scope.eventList.search('BSS.IQ.03.0008') != -1){   //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
  				}
  			});
		$scope.transEntryInquiryTable = {
			//checkType : 'radio', // 当为checkbox时为多选
			autoQuery : true,
			params : {
					"pageSize":10,
					"indexNo":0,
					"_CART":"A"
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'transEntryInquiry.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
				}
			}
		};
		$scope.resetChose = function(){
			$scope.transEntryInquiryTable.params.idType = "";
			$scope.transEntryInquiryTable.params.idNumber = "";
			$scope.transEntryInquiryTable.params.externalIdentificationNo = "";
			$scope.transEntryInquiryTable.params.transEntryStatus = "";
			$scope.transEntryInquiryTable.params.idNumber = "";
			$scope.transEntryInquiryTable.params.idNumber = "";
		};
		//查询
		$scope.queryitemList = function() {
			$scope.transEntryInquiryTable.params.startDate = $("#transEntry_zs").val();
			$scope.transEntryInquiryTable.params.endDate = $("#transEntry_ze").val();
//			if (($scope.transEntryInquiryTable.params.idType == null || $scope.transEntryInquiryTable.params.idType == ''|| $scope.transEntryInquiryTable.params.idType == undefined) &&
//					($scope.transEntryInquiryTable.params.idNumber == "" || $scope.transEntryInquiryTable.params.idNumber == undefined)
//					&& ($scope.transEntryInquiryTable.params.externalIdentificationNo == "" || $scope.transEntryInquiryTable.params.externalIdentificationNo == undefined)) {
//				jfLayer.fail(T.T('KHJ2500001'));
//			} 
//			else {
				if($scope.transEntryInquiryTable.params["idType"]){
					if($scope.transEntryInquiryTable.params["idNumber"] == null || $scope.transEntryInquiryTable.params["idNumber"] == undefined || $scope.transEntryInquiryTable.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.transEntryInquiryTable.search();
					}
				}else if($scope.transEntryInquiryTable.params["idNumber"]){
					if($scope.transEntryInquiryTable["idType"] == null || $scope.transEntryInquiryTable.params["idType"] == undefined || $scope.transEntryInquiryTable.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.transEntryInquiryTable.search();
					}
				}else {
					$scope.transEntryInquiryTable.search();
				}
		//	}
		};
		//查询
		$scope.viewTransEntryDeatail = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.transEntryInf = $.parseJSON(JSON.stringify(item));
			$scope.modal('/oprtCntr/transEntryInquiry/viewTransEntryDeatail.html', $scope.transEntryInf, {
				title : T.T('YWJ5500065'),
				buttons : [T.T('F00012') ],
				size : [ '1000px', '600px' ],
				callbacks : []
			});
		};
	});
	//查询
	webApp.controller('viewTransEntryDeatailCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translate.refresh();
		$scope.transEntryInf = $scope.transEntryInf;
		//交易入账状态 
        $scope.transEntryStatusArr = [{id:'N',name:T.T('YWJ5500066')},{id:'F',name:T.T('YWJ5500067')},
                                      {id:'R',name:T.T('YWJ5500068')},{id:'Y',name:T.T('YWJ5500069')},];
        $scope.viewTransStatus = $scope.transEntryInf.transBillingState;
        //借贷记标识 C:贷记 D：借记',
        if($scope.transEntryInf.debitCreditFlag == 'C'){
        	$scope.transEntryInf.debitCreditFlagTrans = T.T('YWJ5500070');
        }else if($scope.transEntryInf.debitCreditFlag == 'D'){
        	$scope.transEntryInf.debitCreditFlagTrans = T.T('YWJ5500071');
        }
        //余额类型P-本金 I-利息 F-费用',
        if($scope.transEntryInf.balanceType == 'P'){
        	$scope.transEntryInf.balanceTypeTrans = T.T('YWJ5500072');
        }else if($scope.transEntryInf.balanceType == 'I'){
        	$scope.transEntryInf.balanceTypeTrans = T.T('YWJ5500073');
        }else if($scope.transEntryInf.balanceType == 'F'){
        	$scope.transEntryInf.balanceTypeTrans = T.T('YWJ5500074');
        }
        //'费用收取方式，0-一次性收取，1-分期收取',feeCollectType
        if($scope.transEntryInf.feeCollectType == '0'){
        	$scope.transEntryInf.feeCollectTypeTrans = T.T('YWJ5500075');
        }else if($scope.transEntryInf.feeCollectType == '1'){
        	$scope.transEntryInf.feeCollectTypeTrans = T.T('YWJ5500076');
        }
    });
});
