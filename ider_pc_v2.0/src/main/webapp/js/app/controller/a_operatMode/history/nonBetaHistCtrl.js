'use strict';
define(function(require) {
    var webApp = require('app');
    // 维护历史查询
    webApp.controller('nonBetaHistListCtrl', function($scope, $stateParams, jfRest,
                                                    $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/a_operatMode/history/i18n_history');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        $scope.menuNo = lodinDataService.getObject("menuNo");
        $scope.eventList = "";
        $scope.selBtnFlag = false;
        $scope.updBtnFlag = false;
        $scope.addBtnFlag = false;
        //根据菜单和当前登录者查询有权限的事件编号
        $scope.menuNoSel = $scope.menuNo;
        $scope.paramsNo = {
            menuNo:$scope.menuNoSel
        };
        jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
            if(data.returnCode == '000000'){
                if(data.returnData != null || data.returnData != ""){
                    for(var i=0;i<data.returnData.length;i++){
                        $scope.eventList += data.returnData[i].eventNo + ",";
                    }
                    if($scope.eventList.search('COS.IQ.02.0200') != -1){    //查询
                        $scope.selBtnFlag = true;
                    }
                    else{
                        $scope.selBtnFlag = false;
                    }
                    if($scope.eventList.search('COS.AD.02.0200') != -1){    //新增
                        $scope.addBtnFlag = true;
                    }
                    else{
                        $scope.addBtnFlag = false;
                    }
                    if($scope.eventList.search('COS.UP.02.0200') != -1){    //修改
                        $scope.updBtnFlag = true;
                    }
                    else{
                        $scope.updBtnFlag = false;
                    }
                }
            }
        });
        //运营模式
        $scope.operationModeArr ={
            type:"dynamic",
            param:{},//默认查询条件
            text:"modeName", //下拉框显示内容，根据需要修改字段名称
            value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"operationMode.queryMode",//数据源调用的action
            callback: function(data){
            }
        };
        $scope.showHistoryList = false;

        //查询 维护历史信息
        $scope.historyList = {
            params :{
                "pageSize" : 10,
                "indexNo" : 0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            resource : 'nonBetaHist.query',// 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_logHierarchy','dic_hitoryType'],//查找数据字典所需参数
            transDict : ['logLevel_logLevelDesc','type_typeDesc'],//翻译前后key
            callback : function(data) { // 表格查询后的回调函数
                if(data.returnCode == "000000"){
                    $scope.showHistoryList = true;
                }
                else{
                    $scope.showHistoryList = false;
                }
            }
        };

        //修改
        $scope.updateHistoryInfo = function(item){
            $scope.upNonBetaHistInfo = $.parseJSON(JSON.stringify(item))
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/history/updateNonBetaHistEst.html', $scope.upNonBetaHistInfo, {
                title :T.T('YYJ1800002'),// '维护历史修改',
                buttons : [ T.T('F00107'),T.T('F00108')],//'确定','取消'
                size : [ '800px', '400px' ],
                callbacks : [$scope.updateNonBetaHist]
            });
        };
        // 回调函数/确认按钮事件
        $scope.updateNonBetaHist = function(result) {
            $scope.upNonBetaHistInfo.type = result.scope.upNonBetaHistInfo.type;
            $scope.upNonBetaHistInfo.logLevel = result.scope.upNonBetaHistInfo.logLevel;
            $scope.upNonBetaHistInfo.enName = result.scope.upNonBetaHistInfo.enName;
            $scope.upNonBetaHistInfo.cnName = result.scope.upNonBetaHistInfo.cnName;
            $scope.upNonBetaHistInfo.savePeriod = result.scope.upNonBetaHistInfo.savePeriod;
            jfRest.request('nonBetaHist', 'update', $scope.upNonBetaHistInfo)
                .then(function(data) {
                    if (data.returnCode == '000000') {
                        jfLayer.success(T.T('F00022'));//"修改成功"
                        result.scope.upNonBetaHistInfoForm.$setPristine();
                        $scope.safeApply();
                        result.cancel();
                        $scope.historyList.search();
                    }
                });
        };

        //新增
       $scope.newHistBtn = function(){
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/history/nonBetaHistEst.html', '',{
                title : T.T('YYJ1800001'), //维护历史建立
                buttons : [T.T('F00107'),T.T('F00012')],
                size : [ '900px', '320px' ],
                callbacks : [$scope.saveNonBetaHist]
            });
        };
        //新增回调函数
        $scope.saveNonBetaHist = function (result){
            $scope.nonBetaHistInfoTable=[];
            $scope.nonBetaHistInfo = result.scope.nonBetaHistInfo;//弹框回调的数据
            var nonBetaHistInfoTableInfoU = {};
            nonBetaHistInfoTableInfoU.operationMode = result.scope.nonBetaHistInfo.operationMode;
            nonBetaHistInfoTableInfoU.type = result.scope.nonBetaHistInfo.type;
            nonBetaHistInfoTableInfoU.logLevel = result.scope.nonBetaHistInfo.logLevel;
            nonBetaHistInfoTableInfoU.enName = result.scope.nonBetaHistInfo.enName;
            nonBetaHistInfoTableInfoU.cnName = result.scope.nonBetaHistInfo.cnName;
            nonBetaHistInfoTableInfoU.savePeriod = result.scope.nonBetaHistInfo.savePeriod;
            $scope.nonBetaHistInfoTable.push(nonBetaHistInfoTableInfoU);
            $scope.nonBetaHistInfo.coreNonBetaHistParam = $scope.nonBetaHistInfoTable;
            $scope.nonBetaHistInfo = $.extend($scope.nonBetaHistInfo, $scope.params);
            jfRest.request('nonBetaHist', 'addQuery', $scope.nonBetaHistInfo)
                .then(function(data) {
                    if (data.returnCode == '000000') {
                        $scope.showHistoryList=true;
                        jfLayer.success(T.T('F00032'));//"保存成功"
                        result.scope.nonBetaHistInfoForm.$setPristine();
                        $scope.safeApply();
                        result.cancel();
                        $scope.nonBetaHistInfo = {};
                        $scope.historyList.search();
                    }
                });
        };
    });
    /*-----修改控制器-----*/
    webApp.controller('updateNonBetaHistEstCtrl', function($scope, $stateParams, jfRest,
                                                         $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/a_operatMode/history/i18n_history');
        $translate.refresh();
        //运营模式 下拉框
        $scope.operationModeArr ={
            type:"dynamic",
            param:{},//默认查询条件
            text:"modeName", //下拉框显示内容，根据需要修改字段名称
            value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"operationMode.queryMode",//数据源调用的action
            callback: function(data){
                $scope.operationMode = $scope.upNonBetaHistInfo.operationMode;
            }
        };
        //类型 下拉框
        $scope.typeArr  ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_historyType",
                queryFlag: "children"
            },//默认查询条件
            text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
            value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"paramsManage.query",//数据源调用的action
            callback: function(data){
            }
        };
        //日志层级 下拉框
        $scope.logLevelArr  ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_logHierarchy",
                queryFlag: "children"
            },//默认查询条件
            text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
            value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"paramsManage.query",//数据源调用的action
            callback: function(data){
            }
        };
        //$scope.menuName = lodinDataService.getObject("menuName");
        //$scope.csInfEstbInfo = $scope.csInfEstbInfo;

    });
    /*-----新增控制器-----*/
    webApp.controller('nonBetaHistEstCtrl', function($scope, $stateParams, jfRest,
                                                         $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/a_operatMode/history/i18n_history');
        $translate.refresh();
        $scope.userName = lodinDataService.getObject("menuName");//菜单名
        $scope.params = {};
        $scope.nonBetaHistInfoTable=[];
        //运营模式 下拉框
        $scope.operationModeArray ={
            type:"dynamic",
            param:{},//默认查询条件
            text:"modeName", //下拉框显示内容，根据需要修改字段名称
            value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"operationMode.queryMode",//数据源调用的action
            callback: function(data){
            }
        };
        //类型  下拉框
        $scope.typeArray  ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_historyType",
                queryFlag: "children"
            },//默认查询条件
            text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
            value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"paramsManage.query",//数据源调用的action
            callback: function(data){
            }
        };
        //日志层级
        $scope.logLevelArray  ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_logHierarchy",
                queryFlag: "children"
            },//默认查询条件
            text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
            value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"paramsManage.query",//数据源调用的action
            callback: function(data){
            }
        };
    });
});
