'use strict';
define(function(require) {

	var webApp = require('app');

	// 客户媒介视图优化
	webApp.controller('meadiaMajViewCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名

    	$scope.cstMediaForm = {};
    	$scope.mediaBindInfo = {};//媒介绑定信息

        //根据菜单和当前登录者查询有权限的事件编号
        $scope.menuNoSel = $scope.menuNo;
        $scope.paramsNo = {
            menuNo:$scope.menuNoSel
        };
        /*jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
            if(data.returnCode == '000000'){
                if(data.returnData != null || data.returnData != ""){
                    for(var i=0;i<data.returnData.length;i++){
                        $scope.eventList += data.returnData[i].eventNo + ",";
                    }
                    if($scope.eventList.search('BSS.UP.01.0011') != -1){    //修改
                        $scope.updateMeadiaFlag = true;
                    }
                    else{
                        $scope.updateMeadiaFlag = false;
                    }
                }
            }
        });*/

    	//动态请求下拉框 证件类型
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

		//动态请求下拉框 密码函领取标志
		 $scope.pinDispatchMethodArr ={
			        type:"dictData",
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_isYorN",
			        	queryFlag: "children"
			        },//默认查询条件
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action
			        callback: function(data){

			        }
		};

		//动态请求下拉框  媒介领取标志
		 $scope.mediaDispatchMethodArr ={
			        type:"dictData",
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_isYorN",
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

            	$scope.itemList.params.idNumber = '';

            	if(data.value == "1"){//身份证
            		$("#cstMediaItem_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#cstMediaItem_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#cstMediaItem_idNumber").attr("validator","id_isTWCard");

            	}else if(data.value == "4"){//中国护照
            		$("#cstMediaItem_idNumber").attr("validator","id_passport");

            	}else if(data.value == "5"){//外国护照passport
            		$("#cstMediaItem_idNumber").attr("validator","id_passport");

            	}else if(data.value == "6"){//外国人永久居留证
            		$("#cstMediaItem_idNumber").attr("validator","id_isPermanentReside");

            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#cstMediaItem_idNumber").attr("validator","noValidator");
            		$scope.cstMediaItemForm.$setPristine();

            		$("#cstMediaItem_idNumber").removeClass("waringform ");
                }
            });

		//动态请求下拉框  激活标识
		 $scope.activationFlagArr ={
			        type:"dictData",
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_activationFlag",
			        	queryFlag: "children"
			        },//默认查询条件
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action
			        callback: function(data){

			        }
		};

		//动态请求下拉框  激活方式
		 $scope.activationModeTypeArr ={
			        type:"dictData",
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_activationMode",
			        	queryFlag: "children"
			        },//默认查询条件
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action
			        callback: function(data){

			        }
		};

		$scope.isShow = false;
		$scope.isShowDetail = false;
		// 重置
		$scope.reset = function() {
			$scope.cstMediaForm.idNumber= '';
			$scope.cstMediaForm.externalIdentificationNo= '';
			$scope.cstMediaForm.idType= '';

			$scope.isShow = false;
			$scope.isShowDetail = false;
			$("#cstMediaItem_idNumber").attr("validator","noValidator");
			$("#cstMediaItem_idNumber").removeClass("waringform ");
		};


        //动态请求下拉框 申请渠道
        $scope.applicationChannelArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_applicationChannel",
                queryFlag : "children"
            },// 默认查询条件
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };
        //动态请求下拉框 申请场景
        $scope.applicationScenarioArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_applicationScenarioArr",
                queryFlag : "children"
            },// 默认查询条件
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };
		$scope.queryMediaInf = function(){
			$scope.cstMediaForm.flag="3";
			if(($scope.cstMediaForm.idType == null || $scope.cstMediaForm.idType == ''|| $scope.cstMediaForm.idType == undefined) &&
					($scope.cstMediaForm.idNumber == "" || $scope.cstMediaForm.idNumber == undefined )
					&&( $scope.cstMediaForm.externalIdentificationNo == "" || $scope.cstMediaForm.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				$scope.isShowDetail = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.cstMediaForm["idType"]){
					if($scope.cstMediaForm["idNumber"] == null || $scope.cstMediaForm["idNumber"] == undefined || $scope.cstMediaForm["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
						$scope.isShowDetail = false;
					}else {
						$scope.isShow = true;
						$scope.searchHandlee($scope.cstMediaForm);
					}
				}else if($scope.cstMediaForm["idNumber"]){
					if($scope.cstMediaForm["idType"] == null || $scope.cstMediaForm["idType"] == undefined || $scope.cstMediaForm["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
						$scope.isShowDetail = false;
					}else {
						$scope.isShow = true;
						$scope.searchHandlee($scope.cstMediaForm);
					}

				}else {
					$scope.isShow = true;
					$scope.searchHandlee($scope.cstMediaForm);
				}
			}

		};

		//查询
		$scope.itemList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMediaMaj',// 列表的资源
				autoQuery: false,
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN'],//查找数据字典所需参数
				transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc'],
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.isShow = true;
					}else{
						$scope.isShow = false;
						$scope.isShowDetail = false;
					}
				}
			};

		//查询hadle
		$scope.searchHandlee = function(params) {
			jfRest.request('cstProduct', 'viewQueryCstBaseInf', params)//Tansun.param($scope.pDCfgInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showPDInfEnqrAndMntInfoBtn = true;
					$scope.showMeadiaDiv = false;
					$scope.showMeadiaListDiv = false;

					$scope.custInf = data.returnData.rows[0];
					$scope.itemList.params.flag="3";
					$scope.itemList.params.idType = params.idType;
					$scope.itemList.params.idNumber = params.idNumber;
					$scope.itemList.params.externalIdentificationNo = params.externalIdentificationNo;
					//客户媒介列表
					$scope.itemList.search();


				}else {
					$scope.isShow = false;
					$scope.showMeadiaDiv = false;
					$scope.showMeadiaListDiv = false;
				}
			});

		};

		$scope.checkMedia = function(item) {
			$scope.item = item;
			$scope.params = {
				externalIdentificationNo: $scope.item.externalIdentificationNo,
				mediaUnitCode: $scope.item.mediaUnitCode,
			};
			//媒介基本信息
			$scope.queryMedaiBaeInf($scope.params);
			//媒介绑定信息表
			$scope.mediaBindList.autoQuery = true;
			$scope.mediaBindList.params.externalIdentificationNo = $scope.item.externalIdentificationNo;
			$scope.mediaBindList.params.mediaUnitCode = $scope.item.mediaUnitCode;
			$scope.mediaBindList.search();
			$scope.paymentList.params.flag="4";
			$scope.paymentList.params.externalIdentificationNo = $scope.item.externalIdentificationNo;
			$scope.paymentList.params.mediaUnitCode = $scope.item.mediaUnitCode;
			$scope.paymentList.search();
		};
		$scope.paymentList ={
				//checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMediaMaj',// 列表的资源
				autoQuery: false,
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN'],//查找数据字典所需参数
				transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc'],
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.isShow = true;
					}else{
						$scope.isShow = false;
						$scope.isShowDetail = false;
					}
				}
			};
		///查询媒介基本信息
		$scope.queryMedaiBaeInf = function(params){
			jfRest.request('mediaLoss', 'queryMedaiBaseInf',params).then(function(data) {
				if(data.returnCode == "000000"){
					$scope.isShowDetail = true;
					$scope.mediaDetailInfo = {};
					$scope.mediaDetailInfo = $.extend($scope.mediaDetailInfo,data.returnData.rows[0]);
					if($scope.mediaDetailInfo.invalidFlag == 'Y'){
						$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ5100009');

					}else if($scope.mediaDetailInfo.invalidFlag == 'N'){

						$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ5100010');
                    }
                    if ($scope.mediaDetailInfo.invalidFlag == 'N') {
						$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ5100010');//"无效";
						if ($scope.mediaDetailInfo.invalidReason == 'TRF') {
							$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ5100011');//"转卡";
						} else if ($scope.mediaDetailInfo.invalidReason == 'EXP') {
							$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ5100012');//"到期";
						} else if ($scope.mediaDetailInfo.invalidReason == 'BRK') {
							$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ5100019');//"毁损";
						} else if ($scope.mediaDetailInfo.invalidReason == 'CLS') {
							$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ5100014');//"关闭";
						}else if ($scope.mediaDetailInfo.invalidReason == 'PNA') {
							$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ5100015');//"提前续卡";
						}else if($scope.mediaDetailInfo.invalidReason == 'CHP'){
			    			$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ5100016');
			    		}
					} else {
						$scope.mediaDetailInfo.invalidFlagStr = T.T("KHJ5100009");//"有效";
                    }
                    if($scope.mediaDetailInfo.mainSupplyIndicator == '1'){
						$scope.mediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ5100017');
					}else if($scope.mediaDetailInfo.mainSupplyIndicator == '2'){
						$scope.mediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ5100018');

}
                    // '制卡请求 0：无请求 1：新发卡制卡 2：到期续卡制卡 3：毁损补发制卡 4：挂失换卡制卡 5：提前续卡制卡 6: 升降级制卡',
					if($scope.mediaDetailInfo.productionCode == '0'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100020');
					}else if($scope.mediaDetailInfo.productionCode == '1'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100021');
					}else if($scope.mediaDetailInfo.productionCode == '2'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100021');
					}else if($scope.mediaDetailInfo.productionCode == '3'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100022');
					}else if($scope.mediaDetailInfo.productionCode == '4'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100023');
					}else if($scope.mediaDetailInfo.productionCode == '5'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100024');
					}else if($scope.mediaDetailInfo.productionCode == '6'){
						$scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100025');
                    }
                    //媒介对象代码
					$scope.mediaDetailInfo.mediaObjectCodeTrans = $scope.mediaDetailInfo.mediaObjectCode + $scope.mediaDetailInfo.mediaObjectDesc;

					//产品对象代码
					$scope.mediaDetailInfo.productObjectCodeTrans = $scope.mediaDetailInfo.productObjectCode + $scope.mediaDetailInfo.productDesc;
                    //申请渠道
                    if($scope.mediaDetailInfo.applicationChannel == 'APP'){
                        $scope.mediaDetailInfo.applicationChannelStr = T.T('KHJ5100031');
                    }else if($scope.mediaDetailInfo.applicationChannel == 'COT'){
                        $scope.mediaDetailInfo.applicationChannelStr = T.T('KHJ5100032');
                    }else if($scope.mediaDetailInfo.applicationChannel == 'NET'){
                        $scope.mediaDetailInfo.applicationChannelStr = T.T('KHJ5100033');
                    }
                    //申请场景
                    if($scope.mediaDetailInfo.applicationScenario == 'NEW'){
                        $scope.mediaDetailInfo.applicationScenarioStr = T.T('KHJ5100034');
                    }
				}else {
					$scope.isShowDetail = false;
                }
            });


		};



		//查询媒介绑定信息表
		$scope.mediaBindList = {
				checkType : 'radio',
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMediaBind',// 列表的资源
				autoQuery: false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.isShow = true;
					}else{
						$scope.isShow = false;
						$scope.isShowDetail = false;
					}
				}
			};
        // 动态请求下拉框 地址类型2
        $scope.addressType2Array = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_addressType",
                queryFlag : "children"
            },// 默认查询条件
            rmData:'4',
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };

        // 动态请求下拉框 是否有效YN
        $scope.invalidFlagDescArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_invalidFlagYN",
                queryFlag : "children"
            },// 默认查询条件
            rmData:'4',
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };

        // 动态请求下拉框 失效原因
        $scope.invalidReasonStrArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_invalidReasonStr",
                queryFlag : "children"
            },// 默认查询条件
            rmData:'4',
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };


        // 动态请求下拉框 制卡请求
        $scope.productionCodeStrArr = {
            type : "dictData",
            param : {
                "type" : "DROPDOWNBOX",
                groupsCode : "dic_productionCodeStr",
                queryFlag : "children"
            },// 默认查询条件
            rmData:'4',
            text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
            value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
            resource : "paramsManage.query",// 数据源调用的action
            callback : function(data) {
            }
        };

        $scope.updateItem = {};
        // 页面弹出框事件(弹出页面)修改
        $scope.updateMeadiaFlag = function(item){
            $scope.UpmediaDetailInfo = $.parseJSON(JSON.stringify(item));
            $scope.updateItem = $.parseJSON(JSON.stringify(item));
            $scope.UpmediaDetailInfo.idType = $scope.itemList.params.idType;
            $scope.UpmediaDetailInfo.idNumber = $scope.itemList.params.idNumber;
            $scope.UpmediaDetailInfo.externalIdentificationNo = $scope.itemList.params.externalIdentificationNo;
            //媒介对象代码
            $scope.UpmediaDetailInfo.mediaObjectCodeTrans = $scope.UpmediaDetailInfo.mediaObjectCode + $scope.UpmediaDetailInfo.mediaObjectDesc;
            //产品对象代码
            $scope.UpmediaDetailInfo.productObjectCodeTrans = $scope.UpmediaDetailInfo.productObjectCode + $scope.UpmediaDetailInfo.productDesc;
            //主卡附属卡
            if($scope.UpmediaDetailInfo.mainSupplyIndicator == '1'){
                $scope.UpmediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ5100017');
            }else if($scope.UpmediaDetailInfo.mainSupplyIndicator == '2'){
                $scope.UpmediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ5100018');

            }
            //有效无效
            if($scope.UpmediaDetailInfo.invalidFlag == "Y"){
                $scope.UpmediaDetailInfo.invalidFlagDesc = T.T("KHJ5100009");
            }else{
                $scope.UpmediaDetailInfo.invalidFlagDesc = T.T("KHJ5100010");
            }
            //失效原因
            if ($scope.UpmediaDetailInfo.invalidFlag == 'N') {
                $scope.UpmediaDetailInfo.invalidFlagDesc = T.T('KHJ5100010');//"无效";
                if ($scope.UpmediaDetailInfo.invalidReason == 'TRF') {
                    $scope.UpmediaDetailInfo.invalidReasonStr = T.T('KHJ5100011');//"转卡";
                } else if ($scope.UpmediaDetailInfo.invalidReason == 'EXP') {
                    $scope.UpmediaDetailInfo.invalidReasonStr = T.T('KHJ5100012');//"到期";
                } else if ($scope.UpmediaDetailInfo.invalidReason == 'BRK') {
                    $scope.UpmediaDetailInfo.invalidReasonStr = T.T('KHJ5100019');//"毁损";
                } else if ($scope.UpmediaDetailInfo.invalidReason == 'CLS') {
                    $scope.UpmediaDetailInfo.invalidReasonStr = T.T('KHJ5100014');//"关闭";
                }else if ($scope.UpmediaDetailInfo.invalidReason == 'PNA') {
                    $scope.UpmediaDetailInfo.invalidReasonStr = T.T('KHJ5100015');//"提前续卡";
                }else if($scope.UpmediaDetailInfo.invalidReason == 'CHP'){
                    $scope.UpmediaDetailInfo.invalidReasonStr = T.T('KHJ5100016');
                }
            } else {
                $scope.UpmediaDetailInfo.invalidFlagDesc = T.T("KHJ5100009");//"有效";
            }
            // '制卡请求 0：无请求 1：新发卡制卡 2：到期续卡制卡 3：毁损补发制卡 4：挂失换卡制卡 5：提前续卡制卡 6: 升降级制卡',
            if($scope.UpmediaDetailInfo.productionCode == '0'){
                $scope.UpmediaDetailInfo.productionCodeStr = T.T('KHJ5100020');
            }else if($scope.UpmediaDetailInfo.productionCode == '1'){
                $scope.UpmediaDetailInfo.productionCodeStr = T.T('KHJ5100021');
            }else if($scope.UpmediaDetailInfo.productionCode == '2'){
                $scope.UpmediaDetailInfo.productionCodeStr = T.T('KHJ5100021');
            }else if($scope.UpmediaDetailInfo.productionCode == '3'){
                $scope.UpmediaDetailInfo.productionCodeStr = T.T('KHJ5100022');
            }else if($scope.UpmediaDetailInfo.productionCode == '4'){
                $scope.mediaDetailInfo.productionCodeStr = T.T('KHJ5100023');
            }else if($scope.UpmediaDetailInfo.productionCode == '5'){
                $scope.UpmediaDetailInfo.productionCodeStr = T.T('KHJ5100024');
            }else if($scope.UpmediaDetailInfo.productionCode == '6'){
                $scope.UpmediaDetailInfo.productionCodeStr = T.T('KHJ5100025');
            }
            $scope.methodShow = false;
            $scope.modal('/cstSvc/unifiedVisualManage/checkMeadiaInfo.html', $scope.UpmediaDetailInfo, {
                title :T.T('KHJ5100029'),
                buttons : [ T.T('F00107'),T.T('F00108')],//'确定','取消'
                size : [ '1200px', '650px' ],
                callbacks : [$scope.sureUpdateMeadia]
            });
        };
        // 回调函数/确认按钮事件
        $scope.sureUpdateMeadia = function(result) {
            if($scope.methodShow == false){
                $scope.UpmediaDetailInfo.invalidFlagDesc = result.scope.UpmediaDetailInfo.invalidFlagDesc;
                $scope.upMediaParams = result.scope.UpmediaDetailInfo;
                if($scope.upMediaParams.embosserName1 != $scope.updateItem.embosserName1 || $scope.upMediaParams.expirationDate != $scope.updateItem.expirationDate){
                    jfLayer.alert(T.T('KHJ5100030'));//您已修改有效期或者刻印名需要重新制卡，请选择媒介领取标志和密码函领取标志并确定卡片邮寄地址进行重新制卡！
                    $scope.methodShow = true;
                }else{
                    jfRest.request('cstMediaList', 'updateMedia', $scope.upMediaParams)
                        .then(function(data) {
                            if (data.returnCode == '000000') {
                                jfLayer.success(T.T('F00022'));//"修改成功"
                                $scope.itemList.search();
                                $scope.safeApply();
                                result.cancel();
                            }
                        });
                }
            }else{
                jfRest.request('cstMediaList', 'updateMedia', $scope.upMediaParams)
                    .then(function(data) {
                        if (data.returnCode == '000000') {
                            jfLayer.success(T.T('F00022'));//"修改成功"
                            $scope.itemList.search();
                            $scope.safeApply();
                            result.cancel();
                        }
                    });
            }
        }
	});
});
