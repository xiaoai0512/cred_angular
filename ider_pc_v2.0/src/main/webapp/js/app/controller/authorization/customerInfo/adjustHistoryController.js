'use strict';
define(function(require) {
    var webApp = require('app');
    // 活动清单
    webApp.controller('adjustHistoryCtrl', function($scope, $stateParams, jfRest,
                                                    $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_adjustHistory');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        //证件类型
        $scope.certificateTypeArray = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_certificateType",
                queryFlag : "children"
            },// 默认查询条件
            rmData: '840',
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };
        $scope.showQuotaTable = false;//额度表
        $scope.showNodeDatail = false;//应用节点表
        $scope.quotaListB = [];
        //联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
            if(data.value == "1"){//身份证
                $("#adjustHistory_idNumber").attr("validator","id_idcard");
            }else if(data.value == "2"){//港澳居民来往内地通行证
                $("#adjustHistory_idNumber").attr("validator","id_isHKCard");
            }else if(data.value == "3"){//台湾居民来往内地通行证
                $("#adjustHistory_idNumber").attr("validator","id_isTWCard");
            }else if(data.value == "4"){//中国护照
                $("#adjustHistory_idNumber").attr("validator","id_passport");
            }else if(data.value == "5"){//外国护照passport
                $("#adjustHistory_idNumber").attr("validator","id_passport");
            }else if(data.value == "6"){//外国人永久居留证
                $("#adjustHistory_idNumber").attr("validator","id_isPermanentReside");
            }else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
                $("#adjustHistory_idNumber").attr("validator","noValidator");
                $scope.queryInfForm.$setPristine();
                $("#adjustHistory_idNumber").removeClass("waringform ");
            };
        });
        $scope.checkResult = function(){
            $scope.quotaParams = {
                authDataSynFlag:"1",
                customerNo:$scope.customerNo,
                externalIdentificationNo:$scope.externalIdentificationNo,
                idType:$scope.idType,
                idNumber:$scope.idNumber,
                adjustFlag:'Y'
            }
            jfRest.request('cusInfo', 'query', $scope.quotaParams)
                .then(function(data) {
                    if(data.returnMsg == 'OK'){
                        $scope.quotaList = data.returnData.rows;
                        $scope.quotaListB = [];
                        for(var i=0; i<$scope.quotaList.length; i++){
                            if($scope.quotaList[i].creditNodeTyp == 'B' || $scope.quotaList[i].creditNodeTyp == 'BN'){
                                $scope.quotaListB.push($scope.quotaList[i]);
                            }
                        }
                        if($scope.quotaListB.length == "0"){
                            $scope.showQuotaTable = false;
                            jfLayer.alert(T.T('SQJ500002'));   //'暂无数据'
                        }else{
                            $scope.showQuotaTable = true;
                        }
                    }
                    else if(data.returnCode.search('COR-') != -1){
                        jfLayer.fail(data.returnMsg + "(" + data.returnCode + ")");
                    }
                });
        }
        //点击查询,显示额度查询表格
        $scope.queryQuota = function() {
            $scope.showNodeDatail = false;//应用节点表
            if ($scope.customerNo || $scope.externalIdentificationNo || $scope.idType || $scope.idNumber){
                if($scope.idType){
                    if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
                        jfLayer.alert(T.T('SQJ100002'));
                    }
                    else{
                        $scope.checkResult();
                    }
                }else if($scope.idNumber){
                    if(!$scope.idType){
                        jfLayer.alert(T.T('F00098'));
                    }
                    else{
                        $scope.checkResult();
                    }
                }
                else{
                    $scope.checkResult();
                }
            } else {
                jfLayer.alert(T.T('SQJ100001'));
            }
        };
        $scope.nodeTable = {
            checkType : '',
            params : {
                "authDataSynFlag":"1",
            }, // 表格查询时的参数信息
            paging : false,// 默认true,是否分页
            resource : 'cusInfo.query',// 列表的资源
            autoQuery : false,
            callback : function(data) { // 表格查询后的回调函数
                //$scope.item = data.returnData;
            }
        };
        //点击应用节点
        $scope.checkElmInfo = function(item){
            $scope.creditNodeNoInfo = angular.fromJson(item).creditDesc;
            // $scope.creditNodeTypInfo = angular.fromJson(item).creditNodeTyp;
            $scope.showNodeDatail = true;//应用节点表
            //$scope.nodeTable.params.customerNo = angular.fromJson(item).customerNo;
            $scope.nodeTable.params.externalIdentificationNo = $scope.externalIdentificationNo;
            $scope.nodeTable.params.idType = $scope.idType;
            $scope.nodeTable.params.idNumber = $scope.idNumber;
            $scope.nodeTable.params.creditNodeNo =angular.fromJson(item).creditNodeNo;
            //$scope.nodeTable.params.operationMode =angular.fromJson(item).operationMode;
            $scope.nodeTable.search();
        }
        //点击调额历史
        $scope.historyInfo = function(item){
            $scope.itemHinfo = {};
            $scope.itemHinfo = $.parseJSON(JSON.stringify(item));
//			$scope.itemHinfo.creditDesc = $scope.creditNodeNoInfo;
//			$scope.itemHinfo.creditNodeTyp = $scope.creditNodeTypInfo;
            $scope.quotaParamss = {
                "creditNodeNo":$scope.itemHinfo.creditNodeNo,
                "customerNo":$scope.itemHinfo.customerNo,
                "externalIdentificationNo":$scope.itemHinfo.externalIdentificationNo,
                "idType":$scope.itemHinfo.idType,
                "idNumber":$scope.itemHinfo.idNumber,
                "productObjectCode":$scope.itemHinfo.productObjectCode,
                "currencyCode":$scope.itemHinfo.currencyCode,
                "authDataSynFlag":"1",
                "pageSize":10,
                "indexNo":0
            }
            jfRest.request('cusInfo', 'queryHistory', $scope.quotaParamss)
                .then(function(data) {
                    if(data.returnMsg == 'OK'){                   
                        $scope.modal('/authorization/customerInfo/adjustHistoryInfo.html', $scope.itemHinfo, {
                            title : T.T('SQJ500001'),
                            buttons : [ T.T('F00012')],
                            size : [ '1100px', '590px' ],
                            callbacks : [ ]
                        });
                    }
                });
        }
    });                
    webApp.controller('adjustHistoryInfoCtrl', function($scope, $stateParams, jfRest,
                                                        $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T) {
        if($scope.itemHinfo.creditNodeTyp == 'B'){
            $scope.creditNodeTypInfo = T.T('SQH300013');
        }else if($scope.itemHinfo.creditNodeTyp == null){
            $scope.creditNodeTypInfo = T.T('SQH300020');
        }
        if($scope.itemHinfo.productObjectCode == '999999999'){
            $scope.productObjectCodeInfo = "";
        }else {
            $scope.productObjectCodeInfo = $scope.itemHinfo.productObjectCode;
        }
        $scope.itemInfoList = {
            params : $scope.queryParam = {
                "creditNodeNo":$scope.itemHinfo.creditNodeNo,
                "customerNo":$scope.itemHinfo.customerNo,
                "externalIdentificationNo":$scope.itemHinfo.externalIdentificationNo,
                "idType":$scope.itemHinfo.idType,
                "idNumber":$scope.itemHinfo.idNumber,
                "productObjectCode":$scope.itemHinfo.productObjectCode,
                "currencyCode":$scope.itemHinfo.currencyCode,
                "authDataSynFlag":"1",
                "pageSize":10,
                "indexNo":0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            resource : 'cusInfo.queryHistory',// 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_creditAdjustFlag'],//查找数据字典所需参数
            transDict : ['creditAdjustFlag_creditAdjustFlagDesc'],//翻译前后key
            callback : function(data) { // 表格查询后的回调函数
            }
        };
    });
});
