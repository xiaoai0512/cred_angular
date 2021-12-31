'use strict';
define(function(require) {

    var webApp = require('app');

    // 测试
    webApp.controller('quotaQueryCtrl', function($scope, $stateParams, jfRest,
                                                 $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaQuery');
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
        $scope.showAppQuotaTable = false;//应用节点表
        $scope.showBusAvaQuotaTable = false;//业务节点可用额度
        $scope.showAppAvaQuotaTable = false;//应用节点可用额度
        $scope.quotaListL = [];
        $scope.quotaListB = [];

        //联动验证
        var form = layui.form;
        form.on('select(getIdType)',function(data){
            if(data.value == "1"){//身份证
                $("#quotaQuery_idNumber").attr("validator","id_idcard");
            }else if(data.value == "2"){//港澳居民来往内地通行证
                $("#quotaQuery_idNumber").attr("validator","id_isHKCard");
            }else if(data.value == "3"){//台湾居民来往内地通行证
                $("#quotaQuery_idNumber").attr("validator","id_isTWCard");

            }else if(data.value == "4"){//中国护照
                $("#quotaQuery_idNumber").attr("validator","id_passport");

            }else if(data.value == "5"){//外国护照passport
                $("#quotaQuery_idNumber").attr("validator","id_passport");

            }else if(data.value == "6"){//外国人永久居留证
                $("#quotaQuery_idNumber").attr("validator","id_isPermanentReside");

            }else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
                $("#quotaQuery_idNumber").attr("validator","noValidator");
                $scope.quotaQueryForm.$setPristine();

                $("#quotaQuery_idNumber").removeClass("waringform ");
            };

        });
        $scope.checkResult = function(){
            $scope.quotaParams = {
                authDataSynFlag:"1",
                customerNo:$scope.customerNo,
                externalIdentificationNo:$scope.externalIdentificationNo,
                idType:$scope.idType,
                idNumber:$scope.idNumber
            }
            jfRest.request('cusInfo', 'query', $scope.quotaParams)
                .then(function(data) {
                    $scope.quotaList = {};
                    if(data.returnMsg == 'OK'){
                        $scope.quotaList = data.returnData.rows;
                        if($scope.quotaList.length == 0){
                            jfLayer.alert(T.T('SQJ500002'));   //'暂无数据'
                            //return;
                        }
                        $scope.quotaListL = [];
                        $scope.quotaListB = [];
                        for(var i=0; i<$scope.quotaList.length; i++){
                            if($scope.quotaList[i].creditNodeTyp == 'L'){
                                $scope.quotaListL.push($scope.quotaList[i]);
                            }
                            else{
                                $scope.quotaListB.push($scope.quotaList[i]);
                            }
                        }
                        $scope.showQuotaTable = true;
                    } else{
                        jfLayer.alert(T.T('SQJ300001') + data.returnMsg + "(" + data.returnCode + ")");
                        $scope.showQuotaTable = false;//额度表
                        $scope.showAppQuotaTable = false;//应用节点表
                        $scope.showBusAvaQuotaTable = false;//业务节点可用额度
                        $scope.showAppAvaQuotaTable = false;//应用节点可用额度

                        $scope.quotaListL = [];
                        $scope.quotaListB = [];
                    }
                });
        }
        //点击查询,显示额度查询表格
        $scope.queryQuota = function() {
            $scope.showAppQuotaTable = false;//应用节点表
            $scope.showBusAvaQuotaTable = false;//业务节点可用额度
            $scope.showAppAvaQuotaTable = false;//应用节点可用额度
            if (($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined) && ($scope.idType == "" || $scope.idType == null || $scope.idType == undefined) &&
                ($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == null || $scope.externalIdentificationNo == undefined)){
                jfLayer.alert(T.T('SQJ100001'));
            } else {
                if($scope.idType){
                    if($scope.idNumber == "" || $scope.idNumber == null || $scope.idNumber == undefined){
                        jfLayer.alert(T.T('SQJ100002'));
                    }
                    else{
                        $scope.checkResult();
                    }
                }else if($scope.idNumber){
                    if(!$scope.idType){
                        jfLayer.fail(T.T('F00098'));
                    }
                    else{
                        $scope.checkResult();
                    }
                }
                else{
                    $scope.checkResult();
                }
            }

        };

        $scope.quotaAvaList = {};
        //查询指定业务节点可用额度
        $scope.getBusAvaQuotaInfo = function(item) {
            $scope.quotaAvaParams = {
                authDataSynFlag:"1",
                /*idType:angular.fromJson(item).idType,
                idNumber:angular.fromJson(item).idNumber,
                externalIdentificationNo:angular.fromJson(item).externalIdentificationNo,*/
                idType:$scope.idType,
                idNumber:$scope.idNumber,
                externalIdentificationNo:$scope.externalIdentificationNo,
                creditNodeNo:angular.fromJson(item).creditNodeNo
            }
            jfRest.request('quotaAvailable', 'query', $scope.quotaAvaParams).then(function(data) {
                $scope.showAppQuotaTable = false;//应用节点额度
                $scope.showAppAvaQuotaTable = false;//应用节点可用额度
                if(data.returnMsg == 'OK'){
                    $scope.quotaAvaList = data.returnData.rows;
                    if($scope.quotaAvaList.length == 0){
                        jfLayer.alert(T.T('SQJ500002'));   //'暂无数据'
                    }

                    $scope.showBusAvaQuotaTable = true;
                }
            })
        }

        //指定节点 指定币种 指定产品 应用节点可用额度
        $scope.getAppAvaQuotaInfo = function(item){
            $scope.quotaAvaParamsA = {
                authDataSynFlag:"1",
                /*idType:angular.fromJson(item).idType,
                idNumber:angular.fromJson(item).idNumber,
                externalIdentificationNo:angular.fromJson(item).externalIdentificationNo,*/
                idType:$scope.idType,
                idNumber:$scope.idNumber,
                externalIdentificationNo:$scope.externalIdentificationNo,
                creditNodeNo:angular.fromJson(item).creditNodeNo,
                currencyCode:angular.fromJson(item).currencyCode,
                productObjectCode:angular.fromJson(item).productObjectCode,
                availableClass:"P"
            }
            jfRest.request('quotaAvailable', 'query', $scope.quotaAvaParamsA).then(function(data) {
                if(data.returnMsg == 'OK'){
                    $scope.quotaAppAvaList = data.returnData.rows;
                    if($scope.quotaAppAvaList.length == 0){
                        jfLayer.alert(T.T('SQJ500002'));   //'暂无数据'
                    }

                    $scope.showAppAvaQuotaTable = true;
                }
            })
        }


        $scope.nodeTable = {
            checkType : '',
            params : {
                "authDataSynFlag":"1",

            }, // 表格查询时的参数信息
            paging : false,// 默认true,是否分页
            resource : 'cusInfo.query',// 列表的资源
            autoQuery : false,
            callback : function(data) { // 表格查询后的回调函数
            }
        };
        //点击应用节点
        $scope.getAppQuotaInfo = function(item){
            $scope.showAppQuotaTable = true;//应用节点表
            $scope.showBusAvaQuotaTable = false;
            $scope.showAppAvaQuotaTable = false;
            $scope.creditNodeNoInfo = angular.fromJson(item).creditDesc;
            //$scope.nodeTable.params.customerNo = angular.fromJson(item).customerNo;
            $scope.nodeTable.params.externalIdentificationNo = $scope.externalIdentificationNo;
            $scope.nodeTable.params.idType = $scope.idType;
            $scope.nodeTable.params.idNumber = $scope.idNumber;
            $scope.nodeTable.params.creditNodeNo =angular.fromJson(item).creditNodeNo;
            $scope.nodeTable.search();
        }
        //客户个人额度关系
        $scope.queryCredit = function(){
            // 页面弹出框事件(弹出页面)
            $scope.treeparamss = {"authDataSynFlag":"1",
                "externalIdentificationNo":$scope.externalIdentificationNo,
                "idType":$scope.idType,
                "idNumber":$scope.idNumber
            };
            jfRest.request('cusInfo', 'queryTree', $scope.treeparamss)
                .then(function(data) {
                    if(data.returnData){
                        if(data.returnData.rows.length < 0){
                            jfLayer.fail(T.T('SQJ2100001'));
                        }
                        else{
                            $scope.modal('/authorization/quotatree/cusTree.html', '', {
                                title : T.T('SQJ2100002'),
                                buttons : [ T.T('F00012')],
                                size : [ '1170px', '680px' ],
                                callbacks : [ ]
                            });
                        }
                    }else{
                        jfLayer.fail(T.T('SQJ2100001'));
                    }
                });
        };

    });
    //查询客户额度网详情
    webApp.controller('quotaCustreeCtrl', function($scope, $stateParams, jfRest,
                                                   $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        var echarts;
        Tansun.loadScript("echarts",function(script){
            echarts = script;
            var myChart = echarts.init(document.getElementById('cusTree'));//基于准备好的dom，初始化echarts图表
            myChart.showLoading();
            $scope.aryparamssTable = {"authDataSynFlag":"1",
                "externalIdentificationNo":$scope.externalIdentificationNo,
                "idType":$scope.idType,
                "idNumber":$scope.idNumber
            };
            jfRest.request('cusInfo', 'queryTree', $scope.aryparamssTable)
                .then(function(data) {
                    var linkStr = "";    //取额度节点之间的关系===links
                    $scope.linkList = [];  //取额度节点之间的关系===links  ,x:100+i*100,y:200+i*100
                    for(var i=0;i<data.returnData.rows[0].authCreditUnitMeshDtoList.length;i++){
                        ///组合关系
                        if(data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'R'){//汇总
                            linkStr = {source:data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditDesc,
                                target:data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeDesc,
                                lineStyle:{width:2,curveness:0,color:'#666'}};
                            $scope.linkList.push(linkStr);
                        }else if(data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'O'){//占用
                            linkStr = {source:data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditDesc,
                                target:data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeDesc,
                                lineStyle:{width:2,curveness:0,color:'#00db00'}};
                            $scope.linkList.push(linkStr);
                        }else if(data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'S'){//共享
                            linkStr = {source:data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditDesc,
                                target:data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeDesc,
                                lineStyle:{curveness: -0.4,color:'#ec8e00'}};
                            $scope.linkList.push(linkStr);
                        }else if(data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'C'){//检查
                            linkStr = {source:data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditDesc,
                                target:data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeDesc,
                                lineStyle:{width:2,curveness:0,color:'#ff0000'}};
                            $scope.linkList.push(linkStr);
                        }
                    };
                    var creditListStr = "";
                    $scope.creditList = [];
                    for(var j=0;j<data.returnData.rows[0].authCreditNodeVoList.length;j++){
                        if($scope.creditList.length > 0){
                            for(var k=j-1;k<$scope.creditList.length;k++){
                                if($scope.creditList[k].y == data.returnData.rows[0].authCreditNodeVoList[j].creditNodeNoLevel+1){
                                    creditListStr = {name:data.returnData.rows[0].authCreditNodeVoList[j].creditDesc,x:$scope.creditList[k].x+1,y:data.returnData.rows[0].authCreditNodeVoList[j].creditNodeNoLevel+1}
                                    $scope.creditList.push(creditListStr);
                                }else{
                                    creditListStr = {name:data.returnData.rows[0].authCreditNodeVoList[j].creditDesc,x:4,y:data.returnData.rows[0].authCreditNodeVoList[j].creditNodeNoLevel+1}
                                    $scope.creditList.push(creditListStr);
                                }
                                break;
                            }
                        }else{
                            creditListStr = {name:data.returnData.rows[0].authCreditNodeVoList[j].creditDesc,x:j+6,y:data.returnData.rows[0].authCreditNodeVoList[j].creditNodeNoLevel+1}
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
});
