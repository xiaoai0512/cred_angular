/**
 *
 */
'use strict';
define(function(require) {
    var webApp = require('app');
    // 产品對象查询
    webApp.controller('proHistoryQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
        $translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
        $translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        $scope.menuNo = lodinDataService.getObject("menuNo");
        $scope.userName = "";
        $scope.userName = sessionStorage.getItem("userName");//用户名
        $scope.eventList = "";
        $scope.selBtnFlag = false;
        $scope.updBtnFlag = false;
        //	运营模式
        $scope.operationModeArr ={
            type:"dynamic",
            param:{},//默认查询条件
            text:"modeName", //下拉框显示内容，根据需要修改字段名称
            value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"productLine.queryMode",//数据源调用的action
            callback: function(data){
            }
        };
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
                if($scope.eventList.search('COS.IQ.02.0013') != -1){    //查询
                    $scope.selBtnFlag = true;
                }
                else{
                    $scope.selBtnFlag = false;
                }
                if($scope.eventList.search('COS.UP.02.0013') != -1){    //修改
                    $scope.updBtnFlag = true;
                }
                else{
                    $scope.updBtnFlag = false;
                }
            }
        });
        //产品對象列表
        $scope.proHistoryList = {
            params : {
                pageSize:10,
                indexNo:0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            resource : 'proObject.query',// 列表的资源
            callback : function(data) { // 表格查询后的回调函数
            }
        };
        //查看优先级
        $scope.choseBtnPriority = function() {
            $scope.params = {
                "pageSize" : 10,
                "indexNo" : 0
            };
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/product/viewProductObject.html', $scope.params, {
                title : T.T('YYJ300019'),
                buttons : [ T.T('F00012') ],
                size : [ '1000px', '500px' ],
                callbacks : []
            });
        };
        //查询法人实体
        $scope.userInfo = lodinDataService.getObject("userInfo");
        $scope.adminFlag = $scope.userInfo.adminFlag;
        $scope.organization = $scope.userInfo.organization;
        $scope.queryCorEntityNo = function(){
            $scope.queryParam = {
                organNo : $scope.organization
            };
            jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
                $scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
                if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
                    $scope.corporationEntityNo = $scope.corporationEntityNo;
                    $("#corporationEntityNo").attr("disabled",true);
                }
            });
        };
        $scope.queryCorEntityNo ();
        // 查看
        $scope.checkProObjectInf = function(event) {
            $scope.proObjectInf = $.parseJSON(JSON.stringify(event));
            $scope.proObjectInf.corporationEntityNo  = $scope.corporationEntityNo;
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/product/viewProHistory.html',$scope.proObjectInf, {
                title : T.T('YYJ300023'),
                buttons : [ T.T('F00012')  ],
                size : [ '1050px', '600px' ],
                callbacks : []
            });
        };
        // 修改
        $scope.updateProObjectInf = function(event) {
            $scope.proObjectInf = $.parseJSON(JSON.stringify(event));
            $scope.proObjectInf.corporationEntityNo  = $scope.corporationEntityNo;
            $rootScope.deletePcdInstanIdList = [];
            // 页面弹出框事件(弹出页面)
            $scope.modal('/a_operatMode/product/updateProObject.html',$scope.proObjectInf, {
                title : T.T('YYJ300020'),
                buttons : [ T.T('F00107'), T.T('F00012') ],
                size : [ '1050px', '600px' ],
                callbacks : [ $scope.updateProObject ]
            });
        };
        //放 pcd删除id
        $rootScope.deletePcdInstanIdList = [];
        // 回调函数/确认按钮事件
        $scope.updateProObject = function(result) {
            $scope.params = {
                busProList : $rootScope.S71ListResult,    //关联业务项目信息
                list : $rootScope.S6ListResult,      //关联卡版面信息
                artifactInstanList : $rootScope.queryMODP.data, //$rootScope.queryMODP.data
                deletePcdInstanIdList: $rootScope.deletePcdInstanIdList
            };
            $scope.proObjectInf.binNo= $scope.proObjectInf.binNoUpdate;
            $scope.proObjectInf.segmentNumber = result.scope.segmentNumber;
            $scope.params = Object.assign($scope.params , $scope.proObjectInf);
            $scope.params.productCodeSet = result.scope.productCodeSetUpdate;
            $scope.params.feeItemlist = [];
            if(result.scope.arr12){
                if(result.scope.arr12.length > 0){
                    for(var i=0;i<result.scope.arr12.length;i++){
                        $scope.feeItemNovar = {'feeItemNo':result.scope.arr12[i]};
                        $scope.params.feeItemlist.push($scope.feeItemNovar);
                    }
                }
            }
            jfRest.request('proObject', 'update', $scope.params) .then(function(data) {
                if (data.returnCode == '000000') {
                    jfLayer.success(T.T('F00022'));
                    $scope.safeApply();
                    result.cancel();
                    $scope.proHistoryList.search();
                }
            });
        };
    });
    //查看弹框
    webApp.controller('viewProHistoryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
        $translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
        $translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
        $translate.refresh();
        $scope.proParamerList = {
            params : $scope.queryParam = {
                productObjectCode : $scope.proObjectInf.productObjectCode,
                pageSize:10,
                indexNo:0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            resource : 'proHistory.query',// 列表的资源
            callback : function(data) { // 表格查询后的回调函数
                console.log($scope.proObjectInf.productObjectCode);

            }
        };
        //构件实例列表
        $scope.artifactView = {
            params : {
                operationMode:$scope.proObjectInf.operationMode,
                productObjectCode:$scope.proObjectInf.productObjectCode,
                flagId:1,
                pageSize:10,
                indexNo:0
            }, // 表格查询时的参数信息
            autoQuery : true,
            paging : true,// 默认true,是否分页
            resource : 'proHistory.query',// 列表的资源
            callback : function(data) { // 表格查询后的回调函数
                console.log($scope.proObjectInf.productObjectCode);
            }
        };
//		运营模式
        $scope.operationModeArr ={
            type:"dynamic",
            param:{},//默认查询条件
            text:"modeName", //下拉框显示内容，根据需要修改字段名称
            value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"productLine.queryMode",//数据源调用的action
            callback: function(data){
                $scope.operationModeInfo = $scope.proObjectInf.operationMode;
            }
        };
        //产品
        $scope.proArray ={
            type:"dynamicDesc",
            param:{operationMode:$scope.proObjectInf.operationMode},//默认查询条件
            text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称
            desc:"productDesc",
            value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
            resource:"proObject.query",//数据源调用的action
            callback: function(data){
                $scope.productCodeSetInfo = $scope.proObjectInf.productCodeSet;
            }
        };
        $scope.segmentNumberArr = {};
        //查询特殊段号
        if($scope.proObjectInf.binNo){
            $scope.isShowSeg = true;
            //特殊号码段号
            $scope.segmentNumberArr = {
                type:"dynamic",
                param:{
                    cardBin :  $scope.proObjectInf.binNo,
                    corporationEntityNo : $scope.proObjectInf.corporationEntityNo
                },//默认查询条件
                text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称
                value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称
                resource:"resSpecialNoRule.query",//数据源调用的action
                callback: function(data){
                    $scope.segmentNumberInfo = $scope.proObjectInf.segmentNumber;
                }
            };
        }

        //产品构件实例====详情
        $scope.queryArtifactBP = function(item) {
            $scope.itemArtifact = {};
            // 页面弹出框事件(弹出页面)
            $scope.itemArtifact = $.parseJSON(JSON.stringify(item));
            $scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
                title : T.T('F00041')+$scope.itemArtifact.pcdNo +':'+$scope.itemArtifact.pcdDesc +T.T('F00156'),
                buttons : [  T.T('F00012')],
                size : [ '1100px', '530px'  ],
                callbacks : []
            });
        };
    });
});
