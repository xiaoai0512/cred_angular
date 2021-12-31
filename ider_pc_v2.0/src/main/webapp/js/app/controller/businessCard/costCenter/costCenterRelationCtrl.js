'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('costCenterRelationCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/costCenter/i18n_costCenter');
		$translate.refresh();
        $scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.menuName = lodinDataService.getObject("menuName");
        $scope.menuNo = lodinDataService.getObject("menuNo");
        $scope.showItemList = false;
        $scope.showTreeItem = false;
        $scope.eventList = "";
        //根据菜单和当前登录者查询有权限的事件编号
        $scope.menuNoSel = $scope.menuNo;
        $scope.paramsNo = {
            menuNo:$scope.menuNoSel
        };
        $scope.itemList = {
            autoQuery: false,
            params: {
                pageSize: 10,
                indexNo: 0
            }, // 表格查询时的参数信息
            paging: true, // 默认true,是否分页
            resource: 'costCenter.queryLike', // 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_institutionId','dic_status','dic_isYorN','dic_isYorN'],//查找数据字典所需参数
            transDict : ['institutionId_institutionIdDesc','statusCode_statusCodeDesc','statementFlag_statementFlagDesc','corporationVipFlag_corporationVipFlagDesc'],//翻译前后key
            callback: function(data) { // 表格查询后的回调函数
                if (data.returnCode == "000000") {
                    $scope.showItemList = true;
                    $scope.seltreeBtnFlag = true;
                    $scope.showTreeItem = false;
                } else {
                    $scope.showItemList = false;
                    $scope.showTreeItem = false;

                }
            }
        };
        // 机构号查询
        $scope.institutionIdArr = {
            type: "dynamic",
            param: {}, // 默认查询条件
            text: "organName", // 下拉框显示内容，根据需要修改字段名称
            value: "organNo", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "coreOrgan.queryCoreOrgan", // 数据源调用的action
            callback: function(data) {
                $scope.itemList.search();
            }
        };
        //保存成本中心
        $scope.savecostCenterInfo = function() {
            jfRest.request('costCenter', 'saveRelation', $scope.costCenterInf).then(function(data) {
                if (data.returnCode == '000000') {
                    jfLayer.success(T.T('F00032'));
                    $scope.costCenterInf = {};
                    $scope.showTreeItem = false;
                    $scope.showAddItem = false;
                    $scope.showItemList = true;
                }
            });
        };
        //新增
        $scope.insert = function() {
            $scope.showItemList = false;
            $scope.showAddItem = true;
            };
        //查询
        $scope.selectList = function(){
            $scope.showAddItem = false;
            if($scope.itemList.params.institutionId == '' ||$scope.itemList.params.institutionId == undefined ||
                $scope.itemList.params.institutionId == null || $scope.itemList.params.institutionId == 'null'){
                jfLayer.alert(T.T('GWJ101001'));

            }else{
                    $scope.itemList.search();
            }
        };
        //关系
        $scope.queryLower = function(item){
            // 页面弹出框事件(弹出页面)
            $scope.item = $.parseJSON(JSON.stringify(item));
            $scope.treeparamss = {
                "socialCreditCode":$scope.item.socialCreditCode,
            };
            $scope.showTreeItem = true;
            var echarts;
            //$scope.showAddRelation = true;
            $scope.closeInfo = function(){
                $scope.showTreeItem = false;
            }
            Tansun.loadScript("echarts",function(script){
                echarts = script;
                var myChart = echarts.init(document.getElementById('costTree'));//基于准备好的dom，初始化echarts图表
                myChart.showLoading();
                $scope.showTreeItem = true;
                $scope.aryparamssTable = {
                    "socialCreditCode":$scope.treeparamss.socialCreditCode,
                };
                jfRest.request('costCenter', 'queryRelation', $scope.aryparamssTable)
                    .then(function(data) {
                        if(!data.returnData.rows[0]){
                            $scope.showTreeItem = false;
                            jfLayer.fail(T.T('GWJ101007'));
                        }
                        $scope.item.costNo = data.returnData.rows[0].costNo;
                        function clickFun(param) {
                            if (typeof param.seriesIndex == 'undefined') {
                                return;
                            }
                            if (param.type == 'click') {
                                jfLayer.confirm(T.T('GWJ101004'), function () {
                                    $scope.name = {
                                        "socialCreditCode":param.name
                                    };
                                    jfRest.request('costCenter', 'delRelation', $scope.name).then(function (data) {
                                        if (data.returnMsg == 'OK') {
                                            $scope.name = {};
                                            jfLayer.success(T.T('GWJ101005'));   //"删除成功"
                                            $scope.safeApply();
                                             $scope.showTreeItem = false;
                                        }
                                    });
                                });
                            }
                        }
                        myChart.on("click", clickFun);
                        myChart.hideLoading();
                        echarts.util.each(data.children, function (datum, index) {
                            index % 2 === 0 && (datum.collapsed = true);
                        });
                        var option = {
                            tooltip: {
                                trigger: 'item',
                                triggerOn: 'mousemove'
                            },
                            series:[
                                {
                                    type: 'tree',
                                    id: 0,
                                    name: 'tree1',
                                    data: [data.returnData.rows[0]],

                                    top: '10%',
                                    left: '8%',
                                    bottom: '22%',
                                    right: '20%',

                                    symbolSize:80,

                                    edgeShape: 'polyline',//曲线默认
                                    edgeForkPosition: '63%',
                                    initialTreeDepth: 3,

                                    lineStyle: {
                                        width: 2
                                    },

                                    label: {
                                        backgroundColor: '#fff',
                                        position: 'right',
                                        verticalAlign: 'middle',
                                        align: 'right'
                                    },

                                    leaves: {
                                        label: {
                                            position: 'right',
                                            verticalAlign: 'middle',
                                            align: 'left'
                                        }
                                    },

                                    expandAndCollapse: true,
                                    animationDuration: 550,
                                    animationDurationUpdate: 750
                                }
                            ]
                        };
                        myChart.setOption(option);
                    });
            });
        };
	});
});
