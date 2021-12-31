'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('costCenterListCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/businessCard/costCenter/i18n_costCenter');
		$translate.refresh();
		$scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.menuName = lodinDataService.getObject("menuName");
        $scope.menuNo = lodinDataService.getObject("menuNo");
        $scope.showItemList = false;
        $scope.eventList = "";
        //根据菜单和当前登录者查询有权限的事件编号
        $scope.menuNoSel = $scope.menuNo;
        $scope.paramsNo = {
            menuNo:$scope.menuNoSel
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
        $scope.itemList = {
            autoQuery: false,
            params: {
                pageSize: 10,
                indexNo: 0
            }, // 表格查询时的参数信息
            paging: true, // 默认true,是否分页
            resource: 'costCenter.queryLike', // 列表的资源
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_status','dic_isYorN','dic_isYorN'],//查找数据字典所需参数
            transDict : ['statusCode_statusCodeDesc','statementFlag_statementFlagDesc','corporationVipFlag_corporationVipFlagDesc'],//翻译前后key
            callback: function(data) { // 表格查询后的回调函数
                if (data.returnCode == "000000") {
                    $scope.showItemList = true;
                } else {
                    $scope.showItemList = false;
                }
            }
        };
        // jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
        //     if(data.returnCode == '000000'){
        //         console.log(data);
        //         if(data.returnData != null || data.returnData != ""){
        //             for(var i=0;i<data.returnData.length;i++){
        //                 $scope.eventList += data.returnData[i].eventNo + ",";
        //             }
        //             console.log($scope.eventList);
        //             if($scope.eventList.search('CCS.UP.01.0001') != -1){    //修改
        //                 $scope.updBtnFlag = true;
        //             }
        //             else{
        //                 $scope.updBtnFlag = false;
        //             }
        //             if($scope.eventList.search('CCS.IQ.01.0002') != -1){    //修改
        //                 $scope.seltreeBtnFlag = true;
        //             }
        //             else{
        //                 $scope.seltreeBtnFlag = false;
        //             }
        //         }
        //     }
        // });
        $scope.seltreeBtnFlag = true;
        $scope.updBtnFlag = true;

        //重置
		$scope.reset = function(){
            $scope.itemList.params.institutionId = '';
            $scope.itemList.params.socialCreditCode = '';
			$scope.showItemList = false;
		};
        //查询
        $scope.selectList = function(){
            if($scope.itemList.params.institutionId == '' ||$scope.itemList.params.institutionId == undefined ||
                $scope.itemList.params.institutionId == null || $scope.itemList.params.institutionId == 'null'){
                jfLayer.alert(T.T('GWJ101001'));

            }else{
                $scope.itemList.search();
            }
        };
        // 回调函数/确认按钮事件
        $scope.updateCostCenter = function(result) {
            $scope.updateCostCenterParams =  result.scope.costCenter;
            jfRest.request('costCenter', 'update', $scope.updateCostCenterParams)
                .then(function(data) {
                    if (data.returnCode == '000000') {
                        jfLayer.success(T.T('F00022'));//"修改成功"
                        $scope.itemList.search();
                        $scope.safeApply();
                        result.cancel();
                    }
                });
        };
        //查询详情事件
        $scope.costCenterInfo = function(item) {
            // 页面弹出框事件(弹出页面)
            //$scope.item = $.parseJSON(JSON.stringify(item));
            $scope.paramsNo = {
                item:$.parseJSON(JSON.stringify(item)),
                costNo:$.parseJSON(JSON.stringify(item)).costNo
            };
            jfRest.request('costCenter', 'queryOne', $scope.paramsNo).then(
                    function(data) {
                        if(data.returnCode == '000000'){
                            $scope.costCenter = data.returnData.rows[0];
                            $scope.modal('/businessCard/costCenter/costCenterDetail.html', $scope.costCenter, {
                                title : T.T('SQJ2200001'),
                                buttons : [ T.T('F00012')],
                                size : [ '1000px', '440px' ],
                                callbacks : [ ]//$scope.selectOne
                            });
                        }else{
                            jfLayer.fail(T.T('GWJ101006'));
                        }
                }
                );
        };
        // $scope.selectOne = function(result) {
        //     $scope.updateCertificateParams =  result.scope.item;
        //     jfRest.request('costCenter', 'queryOne', $scope.updateCertificateParams)
        //         .then(function(data) {
        //             if (data.returnCode == '000000') {
        //                 jfLayer.success(T.T('F00022'));//"修改成功"
        //                 $scope.itemList.search();
        //                 $scope.safeApply();
        //                 result.cancel();
        //             }
        //         });
        // };
        //修改事件
        $scope.costCenterUpdate = function(item) {
            // 页面弹出框事件(弹出页面)
            $scope.paramsNo = {
                item:$.parseJSON(JSON.stringify(item)),
                costNo:$.parseJSON(JSON.stringify(item)).costNo
            };
            jfRest.request('costCenter', 'queryOne', $scope.paramsNo).then(
                function(data) {
                        if(data.returnCode == '000000'){
                            $scope.costCenter = data.returnData.rows[0];
                            $scope.modal('/businessCard/costCenter/costCenterUpd.html', $scope.costCenter, {
                                title : T.T('SQJ2200008'),
                                buttons : [ T.T('F00031'),T.T('F00012')],
                                size : [ '1000px', '550px' ],
                                callbacks : [
                                    $scope.updateCostCenter ]
                            });
                        }else{
                            jfLayer.fail(T.T('GWJ101006'));
                        }
                }
            );

        };

	});
    webApp.controller('costCenterDetailCtr', function($scope, $stateParams, jfRest,
                                                    $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/businessCard/costCenter/i18n_costCenter');
        $translate.refresh();
        $scope.userName = sessionStorage.getItem("userName");//用户名
        $scope.menuName = lodinDataService.getObject("menuName");
        //公司证件类型
        $scope.certificateTypeArray = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_compaIdType",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //公司种类
        $scope.TypeOfCompany = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_corporationCategory",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        // 公司状态
        $scope.companyStatus = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_status",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //是否
        $scope.yesOrNo = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_isYorN",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //行业
        $scope.ndustryList = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_industry",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
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
            }
        };
        // 账单日
        $scope.billDayArray = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_billDay",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
    });
    //更新控制器
    webApp.controller('costCenterUpdCtr', function($scope, $stateParams, jfRest,
                                                    $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/businessCard/costCenter/i18n_costCenter');
        $translate.refresh();
        $scope.userName = sessionStorage.getItem("userName");//用户名
        $scope.menuName = lodinDataService.getObject("menuName");
        //公司证件类型
        $scope.certificateTypeArray = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_compaIdType",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //公司种类
        $scope.TypeOfCompany = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_corporationCategory",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        // 公司状态
        $scope.companyStatus = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_status",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //是否
        $scope.yesOrNo = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_isYorN",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        //行业
        $scope.ndustryList = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_industry",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
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
            }
        };
        // 账单日
        $scope.billDayArray = {
            type: "dictData",
            param: {
                "type": "DROPDOWNBOX",
                groupsCode: "dic_billDay",
                queryFlag: "children"
            }, // 默认查询条件
            text: "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value: "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource: "paramsManage.query", // 数据源调用的action
            callback: function(data) {
            }
        };
        if($scope.costCenter.billDay == "1"){
            $scope.costCenter.billDay = "01"
        } else if($scope.costCenter.billDay == "2"){
            $scope.costCenter.billDay = "02"
        } else if($scope.costCenter.billDay == "3"){
            $scope.costCenter.billDay = "03"
        } else if($scope.costCenter.billDay == "4"){
            $scope.costCenter.billDay = "04"
        } else if($scope.costCenter.billDay == "5"){
            $scope.costCenter.billDay = "05"
        } else if($scope.costCenter.billDay == "6"){
            $scope.costCenter.billDay = "06"
        } else if($scope.costCenter.billDay == "7"){
            $scope.costCenter.billDay = "07"
        } else if($scope.costCenter.billDay == "8"){
            $scope.costCenter.billDay = "08"
        } else if($scope.costCenter.billDay == "9"){
            $scope.costCenter.billDay = "09"
        }else{
            $scope.costCenter.billDay = $scope.costCenter.billDay ;
        }
        //重置
        $scope.reset = function(){
            $scope.topParams1.socialCreditCode = '';
            $scope.itemList = false;
        };

    });
});
