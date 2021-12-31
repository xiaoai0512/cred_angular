'use strict';
define(function(require) {
	var webApp = require('app');
	// 清算场景列表
	webApp.controller('clearHistoryListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translatePartialLoader.addPart('pages/clearACC/clearHistory/i18n_clearHistory');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 $scope.delBtnFlag = false;
  		$scope.cScene = {};
  		$scope.eventValue = "";  //渠道类型判断
        $scope.dataValue = "";  //交易类型判断
        $scope.dataValuePash = "";  //交易类型过去值
        //VISA MC 显示判断
        var form = layui.form;
        form.on('select(getAssociationsVal)',function(event){
            if($scope.itemList.params.card_associations == "1"){
                $scope.VisamethodShow = true;
                $scope.McmethodShow = false;
            }else if($scope.itemList.params.card_associations == "2"){
                $scope.McmethodShow = true;
                $scope.VisamethodShow = false;
            }
        });
        //获取交易类型Value值
        var forms = layui.form;
        forms.on('select(getpresentVal)',function(data){
             $scope.dataValue = $scope.itemList.params.mvCode3;
        });

		// 日期控件
 		layui.use('laydate', function(){
 			  var laydate = layui.laydate;
 			  var startDate = laydate.render({
 					elem: '#LAY_start_CAdd',
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
 					elem: '#LAY_end_CAdd',
 					done: function(value, date) {
 						startDate.config.max = {
 							year: date.year,
 							month: date.month - 1,
 							date: date.date,
 						}
 					}
 				});
 		});
        //动态请求下拉框 渠道
        $scope.cardIdArr ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_cardAssociationsType",
                queryFlag: "children"
            },//默认查询条件
            text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
            value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"paramsManage.query",//数据源调用的action
            callback: function(data){

            }
        };
        //动态请求下拉框 交易类型
        $scope.presentIdArr ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_presentType",
                queryFlag: "children"
            },//默认查询条件
            text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
            value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"paramsManage.query",//数据源调用的action
            callback: function(data){

            }
        };

        //VISA历史表查询
        $scope.clearVisaHistoryList = {
            params : {
                pageSize:10,
                indexNo:0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            autoQuery: false,
            resource : 'clearHistory.queryVisa',// 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_presentType'],//查找数据字典所需参数
            transDict : ['transactionType_transactionTypeDesc'],//翻译前后key
            callback : function(data) { // 表格查询后的回调函数
                //console.log(data)
                var datarows = data.returnData.rows;
                Tansun.plugins.render('select');
                datarows.forEach(function (item) {
                   item.transactionType = $scope.itemList.params.mvCode3;
                })
            }
        };

        //Mc历史表查询
        $scope.clearMcHistoryList = {
            params : {
                pageSize:10,
                indexNo:0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            autoQuery: false,
            resource : 'clearHistory.queryMc',// 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_presentType'],//查找数据字典所需参数
            transDict : ['pds57TransCategoryInd_pds57TransCategoryIndDesc'],//翻译前后key
            callback : function(data) { // 表格查询后的回调函数
                //console.log(data)
                var datarows = data.returnData.rows;
                //var dataValue = $scope.dataValue;
                datarows.forEach(function (item) {
                    item.pds57TransCategoryInd = $scope.itemList.params.mvCode3;
                })
            }
        };

        //查询按钮
		$scope.queryList = function() {
            var info = $scope.itemList.params.mvCode3;
            var ations = $scope.itemList.params.card_associations;
            if(ations == "1"){ //VISA
                $scope.clearVisaHistoryList.params.accountNumber = $scope.itemList.params.mvCode1;
                $scope.clearVisaHistoryList.params.acquirerReferenceNumber = $scope.itemList.params.mvCode2;
                $scope.clearVisaHistoryList.params.processingDate = $("#LAY_start_CAdd").val();
                $scope.clearVisaHistoryList.params.processingDate1 = $("#LAY_end_CAdd").val();
                if(info == "0" || info == null || info == undefined || info == ""){  //其他
                    jfLayer.alert(T.T('QFH500160'));//"请选择交易类型！"
                }else{
                    if(info == "1"){
                        $scope.clearVisaHistoryList.params.transactionType = "1";
                    } else if(info == "2") {
                        $scope.clearVisaHistoryList.params.transactionType = "2";
                    } else if(info == "3") {
                        $scope.clearVisaHistoryList.params.transactionType = "3";
                    } else if(info == "4") {
                        $scope.clearVisaHistoryList.params.transactionType = "4";
                    } else if(info == "5"){
                        $scope.clearVisaHistoryList.params.transactionType = "5";
                    }
                    $scope.clearVisaHistoryList.search();
                }
            }else if(ations == "2") { //MC
                $scope.VisamethodShow = false;
                $scope.clearMcHistoryList.params.de2PrimaryAccountNumber = $scope.itemList.params.mvCode1;
                $scope.clearMcHistoryList.params.de31AcquirerReferenceData = $scope.itemList.params.mvCode2;
                $scope.clearMcHistoryList.params.processingDate = $("#LAY_start_CAdd").val();
                $scope.clearMcHistoryList.params.processingDate1 = $("#LAY_end_CAdd").val();
                if(info == "0" || info == null || info == undefined || info == ""){  //其他
                    jfLayer.alert(T.T('QFH500160'));//"请选择交易类型！"
                }else {
                    if (info == "1") {
                        $scope.clearMcHistoryList.params.pds57TransCategoryInd = "1";
                    } else if (info == "2") {
                        $scope.clearMcHistoryList.params.pds57TransCategoryInd = "2";
                    } else if (info == "3") {
                        $scope.clearMcHistoryList.params.pds57TransCategoryInd = "3";
                    } else if (info == "4") {
                        $scope.clearMcHistoryList.params.pds57TransCategoryInd = "4";
                    } else if (info == "5") {
                        $scope.clearMcHistoryList.params.pds57TransCategoryInd = "5";
                    }
                    $scope.clearMcHistoryList.search();
                    $("#Mcbox").show();
                }
            }else{
                jfLayer.alert(T.T('QFH500159'));//'请选择交易渠道'
            }
		};
        //Visa查询详情事件
        $scope.queryVisaList = function(event) {
           $scope.queryVisaAll = {};
           // 页面弹出框事件(弹出页面)
           $scope.queryVisaAll = $.parseJSON(JSON.stringify(event));
            if($scope.queryVisaAll.transactionType == "1"){
              $scope.modal('/clearACC/clearHistory/viewVisa1All.html', $scope.queryVisaAll, {
                 title : T.T('SQJ1700012'),
                 buttons : [ T.T('F00012')],
                 size : [ '1200px', '600px' ],
                 callbacks : [ ]
              });
            }else if($scope.queryVisaAll.transactionType == "2"){
                $scope.modal('/clearACC/clearHistory/viewVisa2All.html', $scope.queryVisaAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1200px', '600px' ],
                    callbacks : [ ]
                });
            }else if($scope.queryVisaAll.transactionType == "3" || $scope.queryVisaAll.transactionType == "4"){
                $scope.modal('/clearACC/clearHistory/viewVisa34All.html', $scope.queryVisaAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1050px', '580px' ],
                    callbacks : [ ]
                });
            }else{
                $scope.modal('/clearACC/clearHistory/viewVisa5All.html', $scope.queryVisaAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1050px', '385px' ],
                    callbacks : [ ]
                });
            }
        };
        //Mc查询详情事件
        $scope.queryMcList = function(event) {
            $scope.queryMcAll = {};
            // 页面弹出框事件(弹出页面)
            $scope.queryMcAll = $.parseJSON(JSON.stringify(event));
            if($scope.queryMcAll.pds57TransCategoryInd == "1"){
                $scope.modal('/clearACC/clearHistory/viewMc1All.html', $scope.queryMcAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1050px', '580px' ],
                    callbacks : [ ]
                });
            }else if($scope.queryMcAll.pds57TransCategoryInd == "2"){
                $scope.modal('/clearACC/clearHistory/viewMc2All.html', $scope.queryMcAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1050px', '480px' ],
                    callbacks : [ ]
                });
            }else if($scope.queryMcAll.pds57TransCategoryInd == "3" || $scope.queryMcAll.pds57TransCategoryInd == "4"){
                $scope.modal('/clearACC/clearHistory/viewMc34All.html', $scope.queryMcAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1050px', '480px' ],
                    callbacks : [ ]
                });
            }else{
                $scope.modal('/clearACC/clearHistory/viewMc5All.html', $scope.queryMcAll, {
                    title : T.T('SQJ1700012'),
                    buttons : [ T.T('F00012')],
                    size : [ '1050px', '480px' ],
                    callbacks : [ ]
                });
            }
        };
	});
});
