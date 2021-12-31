'use strict';
define(function (require) {
    var webApp = require('app');
    // 交易场景查询
    webApp.controller('tradScenarioCtrl', function ($scope, $stateParams, jfRest,
                                                    $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/authorization/scenario/i18n_tradScenario');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        $scope.menuNo = lodinDataService.getObject("menuNo");
        $scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
        $scope.corporationId = sessionStorage.getItem("corporation");
        $scope.tableInfo = false;
        // 运营模式下拉框-法人实体下默认缺省运营模式
        $scope.coArray = {
            type: "dynamic",
            param: {
                corporationEntityNo: $scope.corporationId,
                requestType: 1,
                resultType: 1,
                adminFlagLogin: $scope.adminFlagAuth
            },//默认查询条件
            text: "modeName", //下拉框显示内容，根据需要修改字段名称
            value: "operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource: "legalEntity.query",//数据源调用的action
            callback: function (data) {
            }
        };
        // 交易模式下拉框
        $scope.transSceneArray = {};
        var form = layui.form;
        form.on('select(getTradScenario)', function (event) {
            if (event.value) {
                $scope.transSceneArray = {
                    type: "dynamicDesc",
                    param: {operationMode: event.value},//默认查询条件
                    text: "transSceneCode", //下拉框显示内容，根据需要修改字段名称
                    desc: "transSceneDesc",
                    value: "transSceneCode",  //下拉框对应文本的值，根据需要修改字段名称
                    resource: "tradScenario.query",//数据源调用的action
                    callback: function (data) {
                    }
                };
            } else {
                jfLayer.fail(T.T('SQH9100007'));  //"请选择运营模式！"
            }
        });
        $scope.isShow = false;
        $scope.eventList = "";
        $scope.addBtnFlag = false;
        $scope.selBtnFlag = false;
        $scope.updBtnFlag = false;
        //根据菜单和当前登录者查询有权限的事件编号
        $scope.menuNoSel = $scope.menuNo;
        $scope.paramsNo = {
            menuNo: $scope.menuNoSel
        };
        // 根据事件显示按钮
        jfRest.request('accessManage', 'selEvent', $scope.paramsNo).then(function (data) {
            if (data.returnData != null || data.returnData != "") {
                for (var i = 0; i < data.returnData.length; i++) {
                    $scope.eventList += data.returnData[i].eventNo + ",";
                }
                if ($scope.eventList.search('AUS.PM.01.0017') != -1) {    //交易场景新增
                    $scope.addBtnFlag = true;
                } else {
                    $scope.addBtnFlag = false;
                }
                if ($scope.eventList.search('AUS.PM.01.0015') != -1) {    //交易场景查询
                    $scope.selBtnFlag = true;
                } else {
                    $scope.selBtnFlag = false;
                }
                if ($scope.eventList.search('AUS.PM.01.0016') != -1) {    //交易场景修改
                    $scope.updBtnFlag = true;
                } else {
                    $scope.updBtnFlag = false;
                }
            }
        });
        // 交易场景查询
        $scope.itemList = {
            params: $scope.queryParam = {
                //"authDataSynFlag":"1",
                "operationMode": $scope.operationMode,
                "transSceneCode": $scope.transSceneCode,
                "pageSize": 10,
                "indexNo": 0
            }, // 表格查询时的参数信息
            paging: true,// 默认true,是否分页
            autoQuery: false,
            resource: 'tradScenario.query',// 列表的资源
            callback: function (data) { // 表格查询后的回调函数
            }
        };
        // 查询事件
        $scope.selTradList = function (event) {
            if ($scope.operationMode) {
                $scope.isShow = true;
                $scope.itemList.params.operationMode = $scope.operationMode;
                $scope.itemList.params.transSceneCode = $scope.transSceneCode;
                $scope.itemList.search();
            } else {
                $scope.isShow = false;
                jfLayer.fail(T.T('SQH9100007'));  //"请选择运营模式！"
            }
        };
        // 新增弹出页面
        $scope.addScenarioAdd = function () {
            // 页面弹出框事件(弹出页面)
            $scope.modal('/authorization/scenario/tradScenarioAdd.html', '', {
                title: T.T('SQH9100009'),
                buttons: [T.T('F00031'), T.T('F00012')],  //'确定','关闭'
                size: ['550px', '250px'],
                callbacks: [$scope.savekey]
            });
        };
        // 保存信息事件
        $scope.savekey = function (result) {
            $scope.tardAdd = $.parseJSON(JSON.stringify(result.scope.tardadd));
            jfRest.request('tradScenario', 'save', $scope.tardAdd).then(function (data) {
                if (data.returnMsg == 'OK') {
                    jfLayer.success(T.T('F00058'));  //建立成功
                    $scope.safeApply();
                    result.cancel();
                    $scope.tardAdd = {};
                    $scope.selTradList();
                }
            });
        };
        // 修改弹出页面
        $scope.updateInfo = function (event) {
            // 页面弹出框事件(弹出页面)
            // $scope.tradScenarioUpdate = {};
            $scope.tradScenarioUpdate = $.parseJSON(JSON.stringify(event));
            $scope.modal('/authorization/scenario/tradScenarioUpdate.html', $scope.tradScenarioUpdate, {
                title: T.T('SQH9100010'),
                buttons: [T.T('F00031'), T.T('F00012')],
                size: ['550px', '250px'],
                callbacks: [$scope.updateKey]
            });
        };
        // 修改事件
        $scope.updateKey = function (result) {
            $scope.tradScenarioUpdate.operationMode = result.scope.operationModeInfo;
            $scope.tradScenarioUpdate.transSceneCode = result.scope.tradScenarioUpdate.transSceneCode;
            $scope.tradScenarioUpdate.transSceneDesc = result.scope.tradScenarioUpdate.transSceneDesc;
            console.log($scope.tradScenarioUpdate);
            delete $scope.tradScenarioUpdate['invalidFlag'];
            jfRest.request('tradScenario', 'update', $scope.tradScenarioUpdate).then(function (data) {
                if (data.returnMsg == 'OK') {
                    jfLayer.success(T.T('F00022'));
                    $scope.tradScenarioUpdate = {};
                    $scope.safeApply();
                    result.cancel();
                    $scope.selTradList();
                }
            });
        };
        // 删除弹出页面
        $scope.delInfo = function (event) {
            // 页面弹出框事件(弹出页面)
            $scope.itemDel = {};
            $scope.itemDel = $.parseJSON(JSON.stringify(event));
            $scope.modal('/authorization/scenario/tradScenarioDel.html', $scope.itemDel, {
                title: T.T('SQH9100011'),   //'删除确认信息'
                buttons: [T.T('SQH9100011'), T.T('F00046')],   //'确定删除','取消'
                size: ['550px', '250px'],
                callbacks: [$scope.delList]
            });
        };
        // 删除
        $scope.delList = function (result) {
            jfLayer.confirm(T.T('SQH9100011'), function () {    //"确定是否删除"
                // $scope.itemDel.authDataSynFlag = "1";
                $scope.itemDel.invalidFlag = "1";
                $scope.itemDel.operationMode = result.scope.operationModeInfo;
                $scope.itemDel.id = result.scope.id;
                jfRest.request('tradScenario', 'update', $scope.itemDel).then(function (data) {
                    if (data.returnMsg == 'OK') {
                        $scope.itemDel = {};
                        jfLayer.success(T.T('SQH9100012'));   //"删除成功"
                        $scope.safeApply();
                        result.cancel();
                        $scope.selTradList();
                    }
                });
            }, function () {
            });
        };
    });

    //修改
    webApp.controller('tradScenarioUpdateCtrl', function ($scope, $stateParams, jfRest,
                                                          $http, jfGlobal, $rootScope, jfLayer, $location, $translate, $translatePartialLoader, T) {
        $scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
        $scope.corporationId = sessionStorage.getItem("corporation");
        //运营模式======法人实体下默认缺省运营模式
        $scope.coArray = {
            type: "dynamic",
            param: {
                corporationEntityNo: $scope.corporationId,
                requestType: 1,
                resultType: 1,
                adminFlagLogin: $scope.adminFlagAuth
            },//默认查询条件
            text: "modeName", //下拉框显示内容，根据需要修改字段名称
            value: "operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource: "legalEntity.query",//数据源调用的action
            callback: function (data) {
                $scope.operationModeInfo = $scope.tradScenarioUpdate.operationMode;
            }
        };
    });
    //删除
    webApp.controller('tradScenarioDelCtrl', function ($scope, $stateParams, jfRest,
                                                       $http, jfGlobal, $rootScope, jfLayer, $location, $translate, $translatePartialLoader, T) {
        $scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
        $scope.corporationId = sessionStorage.getItem("corporation");
        //运营模式======法人实体下默认缺省运营模式
        $scope.coArray = {
            type: "dynamic",
            param: {
                corporationEntityNo: $scope.corporationId,
                requestType: 1,
                resultType: 1,
                adminFlagLogin: $scope.adminFlagAuth
            },//默认查询条件
            text: "modeName", //下拉框显示内容，根据需要修改字段名称
            value: "operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource: "legalEntity.query",//数据源调用的action
            callback: function (data) {
                $scope.operationModeInfo = $scope.itemDel.operationMode;
            }
        };
    });
    //新增
    webApp.controller('tradScenarioAddCtrl', function ($scope, $stateParams, jfRest,
                                                       $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
        $scope.adminFlagAuth = sessionStorage.getItem("adminFlag");
        $scope.corporationId = sessionStorage.getItem("corporation");
        //运营模式======法人实体下默认缺省运营模式
        $scope.coArray = {
            type: "dynamic",
            param: {
                corporationEntityNo: $scope.corporationId,
                requestType: 1,
                resultType: 1,
                adminFlagLogin: $scope.adminFlagAuth
            },//默认查询条件
            text: "modeName", //下拉框显示内容，根据需要修改字段名称
            value: "operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource: "legalEntity.query",//数据源调用的action
            callback: function (data) {
                console.log(data);
                $scope.operationModeFlag = data[0].operationMode;
            }
        };
    });
});
