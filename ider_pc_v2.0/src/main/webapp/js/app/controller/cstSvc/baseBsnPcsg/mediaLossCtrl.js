'use strict';
define(function(require) {
	var webApp = require('app');
	// 媒介挂失
	webApp.controller('mediaLossCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaLoss');
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	$scope.operationMode = lodinDataService.getObject("operationMode");//運營模式
    	console.log( lodinDataService.getObject("menuName"));
		$scope.newMediaInfTable = false;
		$scope.methodShow = false;
	/*	$scope.convertibleCardArr = [ {
			name : T.T('KHH5800037'),//"是",
			id : "Y"
		}, {
			name : T.T('KHH5800038'),//"否",
			id : "N"
		} ];*/
		//动态请求下拉框 
		 $scope.convertibleCardArr ={ 
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
		//媒介领取标志
//		$scope.mediaDispatchMethodArr = [{name :T.T('F00159'),id : 'Y'},{name : T.T('F00160') ,id : 'N'}];
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
		//密码函领取标志
//		$scope.pinDispatchMethodArr = [{name :T.T('F00159'),id : 'Y'},{name :  T.T('F00160'),id : 'N'}];
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
 		//联动验证
 		var form = layui.form;
 		form.on('select(getIdType)',function(data){
 			$scope.searchParams.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#mediaLoss_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#mediaLoss_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#mediaLoss_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#mediaLoss_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#mediaLoss_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#mediaLoss_idNumber").attr("validator","id_isPermanentReside")
            }
        });
 		// 主附标识
		$scope.mainAttachmentArray = [ {
			name : '主卡',
			id : '1'
		}, {
			name : '附属卡',
			id : '2'
		} ];
		$scope.stateArray = [ {name : T.T('KHJ4000001'),id : '1'}, //'新发'
		                      {name : T.T('KHJ4000002'),id : '2'},//'活跃'
		                      {name : T.T('KHJ4000003'),id : '3'},//'非活跃'
		                      {name : T.T('KHJ4000004'),id : '4'},//'已转出'
		                      {name : T.T('KHJ4000005'),id : '5'},//'换卡未激活'
		                      {name : T.T('KHJ4000006'),id : '8'},//'关闭'
		                      {name : T.T('KHJ4000007'),id : '9'}];//'待删除'
		//激活标识
		/*$scope.activationFlag = [ {
			name : T.T('KHJ4000008'),//'已激活',
			id : '1'
		}, {
			name : T.T('KHJ4000009'),//'新发卡未激活',
			id : '2'
		}, {
			name : T.T('KHJ4000010'),//'毁卡补发/续卡未激活',
			id : '3'
		}, {
			name : T.T('KHJ4000011'),//'转卡未激活',
			id : '4'
		}, {
			name : T.T('KHJ4000012'),//'无需激活',
			id : '5'
		},{
			name : T.T('KHJ4000029'),//'提前续卡未激活',
			id : '6'
		} ];*/
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
/*		//激活方式
		$scope.activationModeType = [ {
			name : T.T('KHJ4000013'),//'人工激活'
			id : '1'
		}, {
			name : T.T('KHJ4000014'),//'无须激活',
			id : '2'
		} ]*/
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
 		//查询法人实体
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.adminFlag = $scope.userInfo.adminFlag;
		$scope.organization = $scope.userInfo.organization;
		//查询法人实体
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
		$scope.queryCorEntityNo();
		$scope.searchParams = {};// 刚开始查询参数，身份证，识别号
		$scope.mediaDetailInfo = {};// 媒介信息对象
		// 查询产品媒介
		$scope.searchProduct1 = function() {
			$scope.newMediaListDiv = false;
			$scope.newMediaDetailDiv = false;
			$scope.newMediaList = [];
			if (($scope.searchParams.idType == null || $scope.searchParams.idType == ''|| $scope.searchParams.idType == undefined) &&
					($scope.searchParams.customerNo == null || $scope.searchParams.customerNo == ''|| $scope.searchParams.customerNo == undefined) &&
					($scope.searchParams.idNumber == "" || $scope.searchParams.idNumber == undefined)
					&& ($scope.searchParams.externalIdentificationNo == "" || $scope.searchParams.externalIdentificationNo == undefined)) {
				jfLayer.alert(T.T('F00076'));//"请输入身份证号或者识别号！"
			} else {
				if($scope.searchParams["idType"]){
					if($scope.searchParams["idNumber"] == null || $scope.searchParams["idNumber"] == undefined || $scope.searchParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.newMediaInfTable = false;
						$scope.methodShow = false;
						$scope.custNicknameDiv= false;
						$scope.isSupportDiv = false;
					}else {
						$scope.isShowWindow($scope.searchParams);
					}
				}else if($scope.searchParams["idNumber"]){
					if($scope.searchParams["idType"] == null || $scope.searchParams["idType"] == undefined || $scope.searchParams["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.newMediaInfTable = false;
						$scope.methodShow = false;
						$scope.custNicknameDiv= false;
						$scope.isSupportDiv = false;
					}else {
						$scope.isShowWindow($scope.searchParams);
					}
				}else {
					$scope.isShowWindow($scope.searchParams);
				}
			}
		};
		//客户媒介信息
		$scope.cstMediaTable = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				"flag" : '1',
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaLoss.queryPro',// 列表的资源
			autoQuery: false,
			callback : function(data) { // 表格查询后的回调函数
				//console.log(data);
				if (data.returnCode == '000000') {
					if (!data.returnData.rows
							|| data.returnData.rows.length == 0) {
						data.returnData.rows = [];
					}
                }
            },
			checkBack: function(row){
				$scope.viewMediaInf(row);
			}
		};
		//点击查询，根据返回结果，弹窗他、，然后弹窗中，再正常调取
		$scope.isShowWindow = function(params){
			$scope.customerInfo = {};
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.isShowMediaList = true;//媒介列表
					$scope.showMdmInfEstbInfoBtn = false;//媒介详情
					$scope.isShowMedaiDetail = false;
					if(data.returnData!=null){
						$scope.customerInfo.idType = data.returnData.rows[0].idType;
						$scope.customerInfo.idNumber = data.returnData.rows[0].idNumber;
						$scope.customerInfo.customerName = data.returnData.rows[0].customerName;
						$scope.cstMediaTable.params.idType = $scope.searchParams.idType;
						$scope.cstMediaTable.params.idNumber = $scope.searchParams.idNumber;
						$scope.cstMediaTable.params.externalIdentificationNo = $scope.searchParams.externalIdentificationNo;
						$scope.cstMediaTable.search();
					}
				}else {
					$scope.isShowMediaList = false;//媒介列表
					$scope.showMdmInfEstbInfoBtn = false;//媒介详情
					$scope.isShowMedaiDetail = false;
				}
			});
			/*jfRest.request('mediaLoss', 'queryPro', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.modal( '/cstSvc/baseBsnPcsg/layerSearchPro.html', params, {
						title : T.T('KHJ5800001'),//'媒介挂失',
						buttons : [ T.T('F00107'),T.T('F00012')],//'确认', '关闭' 
						size : [ '1100px', '500px' ],
						callbacks : [ $scope.callbackquery ]
					});
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033');//"保存失败"
					jfLayer.fail(returnMsg);//"保存失败，失败原因："
				}
			});*/
		};
		$scope.newMediaInfTable = {};
		$scope.queryNewMediaInfTable = function() {
			$scope.newMediaInfTable = $scope.searchParams.credentialNumber;
			$scope.externalIdentificationNo = $scope.searchParams.externalIdentificationNo;
			jfRest.request('mediaLoss', 'queryNewMedia',$scope.paramss).then(
			function(data) {
				if (data.returnCode == '000000') {
					if (data.returnData.rows[0]) {
						$scope.showNewMediaDiv = true;
						$scope.newMediaDetailInfo = data.returnData.rows[0].coreMediaBasicInformationStr;
					} else {
						$scope.showNewMediaDiv = false;
						$scope.custNicknameDiv= false;
						$scope.isSupportDiv = false;
					}
				} else {
					$scope.showNewMediaDiv = false;
					$scope.custNicknameDiv= false;
					$scope.isSupportDiv = false;
					var returnMsg = data.returnMsg ? data.returnMsg
							: T.T('F00035');//'操作失败！';
					jfLayer.fail(returnMsg);
				}
			});
		};
		// 封锁码管理列表查询
		$scope.blockCDScnMgtTable = {
			checkType : 'radio',
			autoQuery: false,
			params : $scope.queryParam = {
				//blockCodeScope : "M",
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'blockCodeMag.queryBlock',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_scenarioTriggerType'],//查找数据字典所需参数
			transDict : ['sceneTriggerObject_sceneTriggerObjectDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 是否转卡显示
		var form = layui.form;
		form.on('select(getisTransferCard)',function(event) {
			if (event.value == "N") {
				$scope.methodShow = true;
				//$scope.blockCDScnMgtTable.params.blockCodeScope = "E";
				$scope.blockCDScnMgtTable.params.queryType = "E";
				$scope.blockCDScnMgtTable.params.operationMode = $scope.operationMode;
				$scope.blockCDScnMgtTable.search();
				$scope.isSupportDiv = false;//是否支持靓号
				$scope.custNicknameDiv = false;//客户靓号
			} else {
				$scope.methodShow = false;
				$scope.isSupportDiv =true;
			}
		});
		// 确认
		//$scope.callbackquery = function(result) {
		$scope.viewMediaInf = function(item) {
			$scope.item = $.parseJSON(JSON.stringify(item));
			$scope.mediaDetailInfo = $scope.item;
			
//			console.log('VItem: ' )
//			console.log($scope.mediaDetailInfo)
			$rootScope.productObject =  $scope.item;
			if ($scope.mediaDetailInfo.transferCard == 'N') {// 不可转卡
//				jfLayer.alert(T.T('KHJ5800002'));//"当前状态不可转卡！"
//				$scope.showMdmInfEstbInfoBtn = false;
				$("#sureLossBtn").attr('disabled','disabled');
				$("#sureLossBtn").addClass('layui-btn-disabled');

			} else if ($scope.mediaDetailInfo.transferCard == 'Y') {// 可转卡
				$("#sureLossBtn").removeAttr('disabled');
				$("#sureLossBtn").removeClass('layui-btn-disabled');
				if($scope.mediaDetailInfo.invalidFlag== 'N' ){
					if ($scope.mediaDetailInfo.invalidReason == "TRF") {
						jfLayer.fail(T.T('KHJ5800003'));//"该卡已经转卡!"
					}else if ($scope.mediaDetailInfo.invalidReason == "EXP") {
						jfLayer.fail(T.T('KHJ5800004'));//"该卡已经到期!"
					}else if ($scope.mediaDetailInfo.invalidReason == "BRK") {
						jfLayer.fail(T.T('KHJ5800005'));//"该卡已经毁损!"
					}else if ($scope.mediaDetailInfo.invalidReason == "CLS") {
						jfLayer.fail(T.T('KHJ5800006'));//"该卡已经关闭!"
					}
				}else {
				$scope.paramss = {};
				$scope.paramss.externalIdentificationNo = $scope.mediaDetailInfo.externalIdentificationNo;
				$scope.paramss.mediaObjectCode = $scope.mediaDetailInfo.mediaObjectCode;
				$scope.methodShow = false;
				//转卡媒介资料查询
				jfRest.request('mediaLoss','queryMediaInfo',$scope.paramss).then(function(data) {
					if (data.returnCode == '000000') {
						if (data.returnData && data.returnData.rows && data.returnData.rows.length > 0 ) {
							$scope.mediaDetailInfo =  $.extend($scope.mediaDetailInfo,data.returnData.rows[0]);
//							$scope.mediaDetailInfo =  data.returnData.rows[0];
//							console.log("viewMediaInf: "+ $scope.mediaDetailInfo)
//							console.log($scope.mediaDetailInfo)
							if(data.returnData.rows[0].subCustomerNo){
								$scope.mediaDetailInfo.subCustomerNo = data.returnData.rows[0].subCustomerNo;
							}
							//关联客户靓号
							$scope.matcheParams = {
								productObjectCode : $scope.mediaDetailInfo.productObjectCode,
								externalIdentificationNo : $scope.mediaDetailInfo.externalIdentificationNo,
								operationMode :  $scope.mediaDetailInfo.operationMode,
							};
							$scope.relatedCutNickName($scope.matcheParams);
							//查询媒介基本信息
							$scope.queryMedaiBaeParams={
								idType:	$scope.searchParams.idType,	
								idNumber: $scope.searchParams.idNumber,
								externalIdentificationNo:$scope.searchParams.externalIdentificationNo,
								mediaUnitCode: $scope.item.mediaUnitCode,
							};
							//查詢媒介基本信息
							$scope.queryMedaiBaeInf($scope.queryMedaiBaeParams);
							// 查询新媒介
							if ($scope.mediaDetailInfo.invalidFlag == "N"
									&& $scope.mediaDetailInfo.invalidReason == "TRF") {
								$("#isTransferCard").attr('disabled','disabled');
								$("#sureLossBtn").attr('disabled','disabled');
								$("#sureLossBtn").addClass('layui-btn-disabled');
								$scope.showNewMediaDiv = true;
								$scope.methodShow = false;
							} else {
								$("#isTransferCard").removeAttr('disabled','disabled');
								$("#sureLossBtn").removeAttr('disabled');
								$("#sureLossBtn").removeClass('layui-btn-disabled');
								$scope.showNewMediaDiv = false;
								$scope.methodShow = false;
							}
							$scope.showMdmInfEstbInfoBtn = true;
							//result.cancel();
							$scope.methodShow = false;
						}
					}
				});
				}
			}
		};
		//运营模式
		 $scope.operationModeArr = { 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		// 机构号查询
		$scope.institutionIdArr = {
			type : "dynamic",
			param : {},// 默认查询条件
			text : "organName", // 下拉框显示内容，根据需要修改字段名称
			value : "organNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "coreOrgan.queryCoreOrgan",// 数据源调用的action
			callback : function(data) {
			//	console.log(data);
			}
		};
		//查询媒介基本信息
		$scope.queryMedaiBaeInf = function(params){
			jfRest.request('mediaLoss', 'queryMedaiBaseInf',params).then(function(data) {
				if(data.returnCode == "000000"){
					if (data.returnData.rows && data.returnData.rows.length > 0 ) {
						$scope.showMdmInfEstbInfoBtn = true;
						$scope.mediaDetailInfo = $.extend($scope.mediaDetailInfo,data.returnData.rows[0]);
//						console.log($scope.mediaDetailInfo)
						if($scope.mediaDetailInfo.invalidFlag == 'Y'){
							$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000022');
						}else if($scope.mediaDetailInfo.invalidFlag == 'N'){
							$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000017');
                        }
                        if ($scope.mediaDetailInfo.invalidFlag == 'N') {
							$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000017');//"无效";
							if ($scope.mediaDetailInfo.invalidReason == 'TRF') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000018');//"转卡";
							} else if ($scope.mediaDetailInfo.invalidReason == 'EXP') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000019');//"到期";
							} else if ($scope.mediaDetailInfo.invalidReason == 'BRK') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000020');//"毁损";
							} else if ($scope.mediaDetailInfo.invalidReason == 'CLS') {
								$scope.mediaDetailInfo.invalidReasonStr = T.T('KHJ4000021');//"关闭";
							}else if ($scope.mediaDetailInfo.invalidReason == 'PNA') {
								$scope.mediaDetailInfo.invalidReasonStr =T.T('KHH4000047');//"提前续卡";
							}
						} else {
							$scope.mediaDetailInfo.invalidFlagStr = T.T('KHJ4000022');//"有效";
                        }
                        if($scope.mediaDetailInfo.mainSupplyIndicator == '1'){
							$scope.mediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ4000015');
						}else if($scope.mediaDetailInfo.mainSupplyIndicator == '2'){
							$scope.mediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ4000016');
                        }
                        //媒介对象代码
						$scope.mediaDetailInfo.mediaObjectCodeTrans = $scope.mediaDetailInfo.mediaObjectCode + $scope.mediaDetailInfo.mediaObjectDesc;
						//产品对象代码
						$scope.mediaDetailInfo.productObjectCodeTrans = $scope.mediaDetailInfo.productObjectCode + $scope.mediaDetailInfo.productDesc;
					} 
				}else {
					$scope.showMdmInfEstbInfoBtn = false;
                }
            });
		};
		//关联客户靓号
		$scope.custNicknameDiv = false;
		$scope.relatedCutNickName = function(params){
			//查询是否支持自动配号
			jfRest.request('cstProductAuto', 'querySupportMatche',params).then(function(data) {
				if(data.returnCode == "000000"){
					if (data.returnData.rows && data.returnData.rows.length > 0) {
						if(data.returnData.rows[0].flagl){
							$scope.isSupportDiv = true;
							$rootScope.matcheFlag = data.returnData.rows[0].flagl;
							if(data.returnData.rows[0].flagl == '1'){
								$scope.isSupportDiv = true;
								$scope.mediaDetailInfo.isSupport = '1';
							}else if(data.returnData.rows[0].flagl == '2'){
								$scope.isSupportDiv = false ;
								$scope.mediaDetailInfo.isSupport = '2';
							}else if(data.returnData.rows[0].flagl == '3'){
								$scope.mediaDetailInfo.isSupport = '';
								$scope.isSupportDiv = true;
                            }
                        }else {
							$scope.isSupportDiv = false;
                        }
                        /*$rootScope.productObj = item;*/
					}
				}else {
					$scope.custNicknameDiv = false;
					$scope.isSupportDiv = false;
                }
            });
		};
		//是否支持自动配号 单选值
		$scope.matchFlagArray = [{
			id : '1',
			name : '是'
		},{
			id : '2',
			name : '否'
		}];
		//动态请求下拉框 是否配置靓号
		 $scope.isConfNicknameArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_isOorT",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
		//点击是否配置靓号，特殊段号查询,特殊号查询
		form.on('radio(getIsSupport)', function(event){
			if($rootScope.matcheFlag == '1'){//支持配置靓号
				if(event.value == '1'){//必须选择支持配置靓号
					$scope.atuoMatcheFun($rootScope.productObject);
				}else {
					jfLayer.alert(T.T('KHJ5800008'));
				}
			}else if($rootScope.matcheFlag == '2'){//不显示弹窗,自动配号
				$scope.custNicknameDiv = false;
				if(event.value == '1'){
					$scope.atuoHandkle= function(index){
						$scope.mediaDetailInfo.isSupport = '2';
					};
					jfLayer.atuoCloseAlert(T.T('KHJ5800009'),$scope.atuoHandkle);
				}
			}else if($rootScope.matcheFlag == '3'){
				if(event.value == '1'){//必须选择支持配置靓号
					$scope.atuoMatcheFun($rootScope.productObject);
				}else if(event.value == '2'){
					$scope.custNicknameDiv = false;
					return;
				}
            }
        });
		//点击是否配置靓号，特殊段号查询,特殊号查询
		$scope.atuoMatcheFun = function(event){
			$scope.queryAutoMatcheInf = $.parseJSON(JSON.stringify(event));
			$scope.queryAutoMatcheInf.corporationEntityNo = $scope.corporationEntityNo;
			$scope.modal('/cstSvc/baseBsnPcsg/mediaLossAutoMatcheLayer.html', $scope.queryAutoMatcheInf, {
				title : T.T('KHJ5800010'),//账务选择
				buttons : [T.T('F00107'),T.T('F00108')],//'确定''取消' 
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.sureMatche ]
			});
		};
		//确定自动配号
		$scope.sureMatche = function(result) {
			if(!result.scope.segmentNumberList.validCheck()){
				return;
            }
            if(!result.scope.cardNumberList.validCheck()){
				return;
            }
            //特殊段号，特殊号
			$scope.segmentNumberInfo = result.scope.segmentNumberList.checkedList();
			$scope.cardNumberInfo = result.scope.cardNumberList.checkedList();
			$scope.queryAutoMatcheInfo = result.scope.queryAutoMatcheInf;
			$scope.custNicknameDiv = true;
			//靓号 = 卡BIN+特殊段号+特殊号
			$scope.mediaDetailInfo.externalIdentificationNoIn = $scope.cardNumberInfo.cardNumber;
			//移除支持替换中的新卡有效期
			if($scope.mediaDetailInfo.newExpirationDate){
				for(var key in $scope.mediaDetailInfo){
					if(key == 'newExpirationDate'){
						delete $scope.mediaDetailInfo.newExpirationDate;
					}
				}
			}
			$scope.safeApply();
			result.cancel();
		};
		//是否支持紧急替代卡
		form.on('radio(getIsSupportReplace)', function(event){
			if(event.value == '1'){//支持紧急替代卡
				$scope.isReplaceFun()
			}else if(event.value == '2'){//不支持紧急替代卡
			}
		});
		//是否支持替换 弹窗
		$scope.isReplaceFun = function(){
			$scope.isReplaceInf = {};
			$scope.isReplaceInf.corporationEntityNo = $scope.corporationEntityNo;
			$scope.isReplaceInf.externalIdentificationNo = $scope.mediaDetailInfo.externalIdentificationNo;
			$scope.modal('/cstSvc/baseBsnPcsg/mediaLossIsReplaceLayer.html', $scope.isReplaceInf, {
				title : "支持紧急替代卡详情",
				buttons : [T.T('F00107'),T.T('F00108')],//'确定''取消' 
				size : [ '1100px', '500px' ],
				callbacks : [ $scope.sureReplace ]
			});
		};
		//确定是否支持替代
		$scope.sureReplace = function(result){
			if(!result.scope.segmentNumberList.validCheck()){
				return;
            }
            if(!result.scope.cardNumberList.validCheck()){
				return;
            }
            //特殊段号，特殊号
			$scope.segmentNumberInfo = result.scope.segmentNumberList.checkedList();
			$scope.cardNumberInfo = result.scope.cardNumberList.checkedList();
			$scope.isReplaceInf = result.scope.isReplaceInf;
			//判断新卡有效期是否有值
			if($scope.isReplaceInf.newExpirationDate == '' || $scope.isReplaceInf.newExpirationDate == undefined || 
			$scope.isReplaceInf.newExpirationDate == null){
				jfLayer.fail('请输入新卡有效期！');
				return;
            }
            $scope.custNicknameDiv = true;
			//靓号 = 卡BIN+特殊段号+特殊号
			$scope.mediaDetailInfo.externalIdentificationNoIn = $scope.cardNumberInfo.cardNumber;
			//新卡有效期
			$scope.mediaDetailInfo.newExpirationDate = $scope.isReplaceInf.newExpirationDate;
			$scope.safeApply();
			result.cancel();
		};
		// 重置
		$scope.reset = function() {
			$scope.searchParams.idType= '';
			$scope.searchParams.idNumber = '';
			$scope.searchParams.externalIdentificationNo = '';
			$scope.mediaDetailInfo = {};
			$scope.blockCodeInfoTable = [];
			$scope.isShowMediaList = false;
			$scope.showMdmInfEstbInfoBtn = false;
			$('#mediaLoss_idNumber').attr('validator','noValidator');
			$('#mediaLoss_idNumber').removeClass('waringform');
		};
		// 封锁码 新增按钮
		$scope.newBlockCodeInfoBtn = function() {
			$scope.showBlockCodeInfo = !$scope.showBlockCodeInfo;
		};
		// 封锁码保存
		$scope.blockCodeInfoTable = [];
		$scope.blockCodeInfoObj = {};
		$scope.saveBlockCodeInfo = function() {
			var blockCodeInfoObjU = {};
			blockCodeInfoObjU.blockType = $scope.blockCodeInfoObj.blockType;
			blockCodeInfoObjU.scene = $scope.blockCodeInfoObj.scene;
			blockCodeInfoObjU.gmtCreate = $scope.blockCodeInfoObj.gmtCreate;
			blockCodeInfoObjU.creator = $scope.blockCodeInfoObj.creator;
			$scope.blockCodeInfoTable.push(blockCodeInfoObjU);
			$scope.blockCodeInfoObj = {};
			$scope.showBlockCodeInfo = false;
		};
		//事件清单后的查询按钮事件
		$scope.selectCode = function(item,$event){
			console.log($event.target.nodeName.toLowerCase());
			if($event.target.nodeName.toLowerCase() == 'button' || $event.target.nodeName.toLowerCase() == 'i'){
				$event.stopPropagation();
			}
			$scope.codeItem = {};
			$scope.codeItem = $.parseJSON(JSON.stringify(item));
			if(($scope.codeItem.effectivenessCodeType == null || $scope.codeItem.effectivenessCodeType == "" || $scope.codeItem.effectivenessCodeType == undefined) 
					&& ($scope.codeItem.effectivenessCodeScene == null || $scope.codeItem.effectivenessCodeScene == "" || $scope.codeItem.effectivenessCodeScene == undefined) 
					&& ($scope.codeItem.sceneTriggerObject == null || $scope.codeItem.sceneTriggerObject == "" || $scope.codeItem.sceneTriggerObject == undefined)){
				jfLayer.fail(T.T('KHJ5800012'));

			}else{
				// 页面弹出框事件(弹出页面)
				$scope.modal('/cstSvc/baseBsnPcsg/blockCodeInfo.html', $scope.codeItem, {
					title : T.T('KHJ5800011'),//'封锁码码信息',
					buttons : [T.T('F00012')],//'关闭' 
					size : [ '1050px', '500px' ],
					callbacks : [ ]
				});
			}
		};
		// 媒介挂失提交
		$scope.mediaLossParams = {
		};
		$scope.sureParams = {};
		$scope.saveMediaLoss = function() {
			$scope.mediaLossParams = $.extend($scope.mediaLossParams,$scope.mediaDetailInfo);
			$scope.mediaLossParams.externalIdentificationNo = $scope.mediaDetailInfo.externalIdentificationNo;
			$scope.mediaLossParams.idType = $scope.customerInfo.idType;
			$scope.mediaLossParams.idNumber = $scope.customerInfo.idNumber;
			if ($scope.mediaDetailInfo.isTransferCard == 'N') { // 不可转卡
			// jfLayer.alert("当前状态不可转卡！");
			// return;
				if (!$scope.blockCDScnMgtTable.validCheck()) {// 封锁码
					return;
                }
                $scope.sureParams = $.extend($scope.sureParams,$scope.blockCDScnMgtTable.checkedList());
				$scope.sureParams2 = {
						flag: '2',	
						operatorId:sessionStorage.getItem("userName"),// 用户名
						operationMode: lodinDataService.getObject("operationMode"),
						contrlLevel:'M',
						levelCode: $scope.mediaDetailInfo.mediaUnitCode,
						customerNo: $scope.mediaDetailInfo.mainCustomerNo,
						idType:$scope.customerInfo.idType,
						idNumber: $scope.customerInfo.idNumber,
						externalIdentificationNo: $scope.searchParams.externalIdentificationNo,
						spEventNo : $scope.blockCDScnMgtTable.checkedList().eventNo
				};
				$scope.sureParams = $.extend($scope.sureParams,$scope.sureParams2);
				$scope.eventNoTrends = "";
				$scope.eventNoTrends = "/nonfinanceService/" + $scope.blockCDScnMgtTable.checkedList().eventNo;
				jfRest.request('mediaLoss', 'queryNo', $scope.sureParams).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00034'));//"操作成功！"
						$scope.methodShow = true;
						$scope.showMdmInfEstbInfoBtn = true;
						$scope.reset();
					} 
				});
			} else if ($scope.mediaDetailInfo.isTransferCard == 'Y') {//可转卡
				console.log($scope.mediaLossParams);
				/*jfRest.request('mediaLoss','mediaLossSubmit',$scope.mediaLossParams).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('KHJ5800007'));//"挂失成功"
						$scope.showMdmInfEstbInfoBtn = true;
						$scope.reset();
						//将新卡信息 放入表格
						$scope.putNewMediaInfo(data.returnData);
						//查询新卡详情， 取新卡卡组织 新卡卡号
						//记录旧卡
						$scope.oldMediaInf = {
							idType: $scope.customerInfo.idType,
							idNumber: $scope.customerInfo.idNumber,
							mediaUnitCode:	$scope.mediaDetailInfo.mediaUnitCode,
							externalIdentificationNo: $scope.mediaDetailInfo.externalIdentificationNo,
						};
						$scope.getCardOrg($scope.oldMediaInf);
					} else {
						var returnMsg = data.returnMsg ? data.returnMsg	: T.T('F00035');//'操作失败！';
						jfLayer.fail(returnMsg);
					}
				});*/
				//判断是否收取挂失费，然后在进行挂失
				$scope.isGetLossFeeFun($scope.mediaLossParams);
			}
		};
		//媒介挂失函数
		$scope.mediaLossFun = function(objParams){
			jfRest.request('mediaLoss','mediaLossSubmit', objParams).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ5800007'));//"挂失成功"
					$scope.showMdmInfEstbInfoBtn = true;
					$scope.reset();
					//将新卡信息 放入表格
					$scope.putNewMediaInfo(data.returnData.rows[0]);
					//用旧卡信息 判断是否显示 授权例外名单
					if(objParams.isSyncCardOrg == '1' &&( objParams.cardScheme == 'V' || objParams.cardScheme == 'M')){
						$scope.isShowExcepBtn = true;//授权例外名单按钮 
					}else{
						$scope.isShowExcepBtn = false;//授权例外名单按钮 

                    }
                    //旧卡信息，用于授权例外名单查询
					$scope.oldMediaInf = {
							externalIdentificationNo : objParams.externalIdentificationNo,
							cardScheme : objParams.cardScheme,
							mediaUnitCode : objParams.mediaUnitCode,
					};
//					$scope.getCardOrg(objParams);
				} 
			});
		};
		//新媒介信息 将新卡信息放入表格
		$scope.newMediaList = [];
		$scope.putNewMediaInfo = function(dataRows){
			$scope.newMediaListDiv = true;
			$scope.newMediaList.push(dataRows);
			console.log($scope.newMediaList);
			$scope.isShowBtn = true;//详情按钮
		};
		//用旧卡 查询卡组织
		$scope.getCardOrg = function(params){
			//用旧卡 查询卡组织
			//是否展示授权例外名单 
			//是否同步卡组织： 是：展示授权例外名单按钮 否：不展示 
			if($scope.mediaDetailInfo.isSyncCardOrg == '1' &&( data.returnData.cardScheme == 'V' || data.cardScheme == 'M')){
				$scope.isShowExcepBtn = true;//授权例外名单按钮 
			}else{
				$scope.isShowExcepBtn = false;//授权例外名单按钮 

            }
        };
		// 展示 新卡的详情
		$scope.queryNewMeadiaDetail = function(item){
			$scope.params = {
					externalIdentificationNo : item.externalIdentificationNo,
					mediaUnitCode : item.mediaUnitCode,
			};
			jfRest.request('mediaLoss', 'queryMedaiBaseInf',$scope.params).then(function(data) {
				if(data.returnCode == "000000"){
					if (data.returnData.rows && data.returnData.rows.length > 0 ) {
						$scope.isShowBtn = false;//详情按钮
						$scope.newMediaDetailDiv = true;
						$scope.newMediaDetailInfo = $.extend($scope.newMediaDetailInfo,data.returnData.rows[0]);
						if($scope.newMediaDetailInfo.invalidFlag == 'Y'){
							$scope.newMediaDetailInfo.invalidFlagStr = T.T('KHJ4000022');
						}else if($scope.newMediaDetailInfo.invalidFlag == 'N'){
							$scope.newMediaDetailInfo.invalidFlagStr = T.T('KHJ4000017');
                        }
                        if ($scope.newMediaDetailInfo.invalidFlag == 'N') {
							$scope.newMediaDetailInfo.invalidFlagStr = T.T('KHJ4000017');//"无效";
							if ($scope.newMediaDetailInfo.invalidReason == 'TRF') {
								$scope.newMediaDetailInfo.invalidReasonStr = T.T('KHJ4000018');//"转卡";
							} else if ($scope.newMediaDetailInfo.invalidReason == 'EXP') {
								$scope.newMediaDetailInfo.invalidReasonStr = T.T('KHJ4000019');//"到期";
							} else if ($scope.newMediaDetailInfo.invalidReason == 'BRK') {
								$scope.newMediaDetailInfo.invalidReasonStr = T.T('KHJ4000020');//"毁损";
							} else if ($scope.newMediaDetailInfo.invalidReason == 'CLS') {
								$scope.newMediaDetailInfo.invalidReasonStr = T.T('KHJ4000021');//"关闭";
							}else if ($scope.newMediaDetailInfo.invalidReason == 'PNA') {
								$scope.newMediaDetailInfo.invalidReasonStr = T.T('KHH4000047');//"提前续卡";
							}else if($scope.newMediaDetailInfo.invalidReason == 'CHP'){
				    			$scope.newMediaDetailInfo.invalidReasonStr = T.T('KHH4000055');//'产品升降级'
				    		}
						} else {
							$scope.newMediaDetailInfo.invalidFlagStr = T.T('KHJ4000022');//"有效";
                        }
                        if($scope.newMediaDetailInfo.mainSupplyIndicator == '1'){
							$scope.newMediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ4000015');
						}else if($scope.newMediaDetailInfo.mainSupplyIndicator == '2'){
							$scope.newMediaDetailInfo.mainSupplyIndicatorStr = T.T('KHJ4000016');
                        }
                        //媒介对象代码
						$scope.newMediaDetailInfo.mediaObjectCodeTrans = $scope.newMediaDetailInfo.mediaObjectCode + $scope.newMediaDetailInfo.mediaObjectDesc;
						//产品对象代码
						$scope.newMediaDetailInfo.productObjectCodeTrans = $scope.newMediaDetailInfo.productObjectCode + $scope.newMediaDetailInfo.productDesc;
					}
				}else {
					$scope.showMdmInfEstbInfoBtn = false;
                }
            });
		};
		//收起新卡详情
		$scope.closeBtn = function(){
			$scope.isShowBtn = true;
			$scope.newMediaDetailDiv = false;//详情
		};
		//授权例外名单 弹窗
		$scope.queryException = function(){
			console.log($scope.oldMediaInf);
			$scope.modal( '/cstSvc/baseBsnPcsg/layerExceptionList.html', $scope.oldMediaInf, {
				title : T.T('KHJ5800001'),//
				buttons : [T.T('F00012')],//'确认', '关闭' 
				size : [ '1100px', '500px' ],
				callbacks : [  ]
			});
		};
		//是否收取挂失费
		/*挂失前要  弹窗 是否收取挂失费，
		 * 是： 
		 * 
		 * */
		$scope.isGetLossFeeFun = function(objParams){
			$scope.params = {
				eventId:'ISS.OP.01.0003',
			};
			$scope.params = $.extend($scope.params, objParams);
			jfRest.request('mediaLoss', 'queryIsLossFee',$scope.params).then(function(data) {
				if(data.returnCode == "000000"){
					//有收费项目编号
					if(data.returnData.rows[0].feeItemNo != undefined || data.returnData.rows[0].feeItemNo !='undefined' ||
					data.returnData.rows[0].feeItemNo != null ||data.returnData.rows[0].feeItemNo != ''|| data.returnData.rows[0].feeItemNo != 'null' ){
						jfLayer.confirm("是否收取挂失费?",function(){//是
//							$scope.mediaDetailInfo.isGetLossFee = 'Y';
							objParams.isGetLossFee = 'Y';
							$scope.mediaLossFun(objParams);
						},function(){//否
//							$scope.mediaDetailInfo.isGetLossFee = 'N';
							objParams.isGetLossFee = 'N';
							$scope.mediaLossFun(objParams);
						});
					}
				}
			});
		};
	});
	//产品媒介信息查询弹窗
	webApp.controller('layerSearchProCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaLoss');
		$translate.refresh();
		//客户媒介信息
		$scope.cstMediaTable = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"idNumber" : $scope.searchParams.idNumber,
				"externalIdentificationNo" : $scope.searchParams.externalIdentificationNo,
				"idType" : $scope.searchParams.idType,
				"flag" : '1',
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'mediaLoss.queryPro',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainAttachedFlag','dic_invalidFlagYN','dic_invalidReason','dic_isYorN'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator_mainSupplyIndicatorDesc','invalidFlag_invalidFlagDesc','invalidReason_invalidReasonDesc','transferCard_transferCardDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				//console.log(data);
				if (data.returnCode == '000000') {
					if (!data.returnData.rows
							|| data.returnData.rows.length == 0) {
						data.returnData.rows = [];
					}
                }
            }
		}
	});
	//自动配号弹窗queryAutoMatcheCtrl
	webApp.controller('mediaLossAutoMatcheLayerCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaLoss');
		$translate.refresh();
		$scope.queryAutoMatcheInf = $scope.queryAutoMatcheInf;
		$scope.queryAutoMatcheInf.cardBin = $scope.queryAutoMatcheInf.externalIdentificationNo.substr(0,6);
		$scope.isShow = false;
		//根据选择卡BIN的条件筛选特殊号码段
		 $scope.segmentNumberArr ={ 
		    type:"dynamic", 
		    param:{
				cardBin: $scope.queryAutoMatcheInf.cardBin,
				criticalFlag : 'N'
				},//默认查询条件 
		    text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		    value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		    resource:"resSpecialNoRule.query",//数据源调用的action 
		    callback: function(data){
				console.log(data);
		    }
		};
		// 查询按钮
		$scope.searchFun = function(){
			$scope.segmentNumberList.search();
		};
		// 特殊段号查询
		$scope.segmentNumberList = {
			checkType : 'radio',
			params : $scope.queryParam = {
					cardBin: $scope.queryAutoMatcheInf.cardBin,
					corporationEntityNo: $scope.queryAutoMatcheInf.corporationEntityNo
			},
			autoQuery:false,
			paging : true,
			resource : 'cstProductAuto.querySegmentNum',
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShow = true;
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		// 特殊号查询
		$scope.cardNumberList = {};
		$scope.cardNumberList = {
			checkType : 'radio',
			autoQuery: false,
			params : $scope.queryParam = {
					cardBin: $scope.queryAutoMatcheInf.cardBin,
					corporationEntityNo: $scope.queryAutoMatcheInf.corporationEntityNo,
					//segmentNumber: $scope.segmentNumberList.checkedList().segmentNumber*/
			},
			paging : true,
			resource : 'cstProductAuto.queryCardNumber',
			callback : function(data) {
				console.log(data);
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
                    }
                    angular.forEach(data.returnData.rows,function(item,i){
						item.cardNumberStr = '*********'+item.cardNumber.substr(9,item.cardNumber.split('').length);
					});
				}
			}
		};
		//查询特殊号
		$scope.checkCardNumInf = function(item){
			$scope.cardNumberList.params.segmentNumber = item.segmentNumber;
			$scope.isShowCardNumDiv = true;
			$scope.cardNumberList.search();
		};
		//重置
		$scope.resetSegmentNum = function(){
			$scope.segmentNumberList.params.segmentNumber = '';
			$scope.isShowCardNumDiv = false;
		};
	});
	//管控码关联的管控项目、定价标签
	webApp.controller('codeControlCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
		$translate.refresh();
    	console.log($scope.codeItem);
		// 事件清单列表
		$scope.itemControlList = {
			params : $scope.queryParam = {
				effectivenessCodeType:$scope.codeItem.effectivenessCodeType,
				effectivenessCodeScene:$scope.codeItem.effectivenessCodeScene,
				projectType:'0'
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'blockCodeMag.controlCode',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			},
		};
	});
	//是否支持替换
	webApp.controller('mediaLossIsReplaceLayerCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translate.refresh();
		$scope.isReplaceInf = $scope.isReplaceInf;
		$scope.isReplaceInf.cardBin = $scope.isReplaceInf.externalIdentificationNo.substr(0,6);
		$scope.isShow = false;
		//根据选择卡BIN的条件筛选特殊号码段
		 $scope.segmentNumberArr ={ 
		    type:"dynamic", 
		    param:{
				cardBin: $scope.isReplaceInf.cardBin,
				criticalFlag : 'Y'
				},//默认查询条件 
		    text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
		    value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
		    resource:"resSpecialNoRule.query",//数据源调用的action 
		    callback: function(data){
				
		    }
		};
		// 查询按钮
		$scope.searchFun = function(){
			$scope.segmentNumberList.search();
		};
		// 特殊段号查询
		$scope.segmentNumberList = {
			checkType : 'radio',
			params : $scope.queryParam = {
					cardBin: $scope.isReplaceInf.cardBin,
					corporationEntityNo: $scope.isReplaceInf.corporationEntityNo
			},
			autoQuery:false,
			paging : true,
			resource : 'cstProductAuto.querySegmentNum',
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShow = true;
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
					}
				}
			}
		};
		// 特殊号查询
		$scope.cardNumberList = {};
		$scope.cardNumberList = {
			checkType : 'radio',
			autoQuery: false,
			params : $scope.queryParam = {
					cardBin: $scope.isReplaceInf.cardBin,
					corporationEntityNo: $scope.isReplaceInf.corporationEntityNo,
					//segmentNumber: $scope.segmentNumberList.checkedList().segmentNumber*/
			},
			paging : true,
			resource : 'cstProductAuto.queryCardNumber',
			callback : function(data) {
				if(data.returnCode == '000000'){
					if(!data.returnData.rows || data.returnData.rows.length == 0){
						data.returnData.rows = [];
                    }
                    angular.forEach(data.returnData.rows,function(item,i){
						item.cardNumberStr = '*********'+item.cardNumber.substr(9,item.cardNumber.split('').length);
					});
				}
			}
		};
		//查询特殊号
		$scope.checkCardNumInf = function(item){
			$scope.cardNumberList.params.segmentNumber = item.segmentNumber;
			$scope.isShowCardNumDiv = true;
			$scope.cardNumberList.search();
		};
		//重置
		$scope.resetSegmentNum = function(){
			$scope.segmentNumberList.params.segmentNumber = '';
			$scope.isShowCardNumDiv = false;
		};
	});
	// 授权例外名单
	webApp.controller('layerExceptionListCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $timeout,$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_exceptionList');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.resultInfoV = false;
		$scope.resultInfoM = false;
		$scope.eventList = "";
		 $scope.addBtnFlag = false;
		 $scope.selBtnFlag = false;
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
	   	   			if($scope.eventList.search('AUS.VI.01.0302') != -1){    //新增 visa
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
		   	   		if($scope.eventList.search('AUS.IQ.01.0008') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('AUS.MC.01.0302') != -1){    //新增mc
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
  				}
  			});
  		/*V：VISA 
  			M：Mastercard 
  			J:JCB
  			C:CUP 
  			A:AMEX*/
		$scope.cardAssociationsArray = [{name:'VISA',id:'V'},{name:'MC',id:'M'}];
		//弹窗 携带新卡卡号和卡组织
		$scope.item = $scope.oldMediaInf;
		$scope.externalIdentificationNo = $scope.item.externalIdentificationNo;
		$scope.cardAssociations = $scope.item.cardScheme;
		//授权例外名单查询列表
		$scope.selException = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.cardAssociations == "" || $scope.cardAssociations == undefined || $scope.cardAssociations == null)){
				jfLayer.fail(T.T('F00076'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}else{
				$scope.param = {
						"authDataSynFlag":'1',
						"externalIdentificationNo":$scope.externalIdentificationNo,
						"cardAssociations":$scope.cardAssociations
					};
				 jfRest.request('exceptionManage', 'query', $scope.param).then(function(data) {
		                if (data.returnCode == '000000') {
		                	console.log(data.returnData);
		                	if(data.returnData){
		                		$scope.cwbZoneCodesList = [];
			                	$scope.cwbstr = "";
			                	$scope.item = data.returnData;
			                	$scope.cwbZoneCodes = data.returnData.cwbZoneCode;
			                	if($scope.cwbZoneCodes){
			                		for(var i=0;i<$scope.cwbZoneCodes.length;i++){
			                			$scope.cwbstr = {'cwbZoneCode':$scope.cwbZoneCodes.substr(i,1)};
			                			$scope.cwbZoneCodesList.push($scope.cwbstr);
			                		}
			                	}
			    				if($scope.cardAssociations == 'V'){
			    					$scope.resultInfoV = true;
				    				$scope.resultInfoM = false;
			    				}else if($scope.cardAssociations == 'M'){
			    					$scope.resultInfoM = true;
			    					$scope.resultInfoV = false;
			    				}
		                	}else{
		                		jfLayer.fail(T.T('SQJ2600001'));
		                	}
		                }
		            });
			}
		};
		$scope.closeInfoV = function(){
			$scope.resultInfoV = false;
		};
		$scope.closeInfoM = function(){
			$scope.resultInfoM = false;
		};
		//维护
		$scope.updateException = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.cardAssociations == "" || $scope.cardAssociations == undefined || $scope.cardAssociations == null)){
				jfLayer.fail(T.T('SQJ2600012'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}else{
				$scope.param = {
						"authDataSynFlag":'1',
						"externalIdentificationNo":$scope.externalIdentificationNo,
						"cardAssociations":$scope.cardAssociations
					};
				 jfRest.request('exceptionManage', 'query', $scope.param).then(function(data) {
		                if (data.returnCode == '000000') {
		                	$scope.cwbstr = "";
		                	$scope.itemU = data.returnData;
		                	if(data.returnData){
			                	$scope.itemU.cwbZoneCodesList = [];
			                	$scope.cwbZoneCodes = data.returnData.cwbZoneCode;
			                	if($scope.cwbZoneCodes){
			                		for(var i=0;i<$scope.cwbZoneCodes.length;i++){
			                			$scope.cwbstr = {'cwbZoneCode':$scope.cwbZoneCodes.substr(i,1)};
			                			$scope.itemU.cwbZoneCodesList.push($scope.cwbstr);
			                		}
			                	}
			    				if($scope.cardAssociations == 'V'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionUpdateModV.html', $scope.itemU, {
			    						title : T.T('SQJ2600011'),
			    						buttons : [ T.T('F00107'), T.T('F00108') ],
			    						size : [ '900px', '580px' ],
			    						callbacks : [$scope.updateInfoV]
			    					});
			    				}else if($scope.cardAssociations == 'M'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionUpdateModM.html', $scope.itemU, {
			    						title : T.T('SQJ2600011'),
			    						buttons : [ T.T('F00107'), T.T('F00108')],
			    						size : [ '900px', '480px' ],
			    						callbacks : [$scope.updateInfoM]
			    					});
			    				}
			                }else{
		                		jfLayer.fail(T.T('SQJ2600001'));
		                	}
		                }
		            });
			}
		};
		//维护V
		$scope.updateInfoV = function(result) {
			var cwbZoneCodeStrU = "";
			$scope.itemU.authFlag = "1";
			$scope.itemU.authDataSynFlag = "1";
			if(result.scope.czcListU.length > 0){
				for(var i=0;i<result.scope.czcListU.length;i++){
					cwbZoneCodeStrU += result.scope.czcListU[i].cwbZoneCode;
				}
			}
			$scope.itemU.cwbZoneCode = cwbZoneCodeStrU;
           jfRest.request('exceptionManage', 'addexceV', $scope.itemU).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ2600009'));
                	result.scope.mdmInfoFormV.$setPristine();
            		$scope.safeApply();
        			result.cancel();
        			$scope.selException();
                }
            });
		};
		//维护M
		$scope.updateInfoM = function(result) {
			$scope.itemU.authFlag = "1";
			$scope.itemU.authDataSynFlag = "1";
           jfRest.request('exceptionManage', 'addexceM', $scope.itemU).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ2600009'));
                	result.scope.mdmInfoFormM.$setPristine();
            		$scope.safeApply();
        			result.cancel();
        			$scope.selException();
                }
            });
		};
		//新增事件
		$scope.addException = function() {
			if($scope.cardAssociations == '' || $scope.cardAssociations == null || $scope.cardAssociations == undefined){
				jfLayer.fail(T.T('SQJ2600013'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}
			else{
				$scope.itemAddM = {};
				$scope.itemAddM.externalIdentificationNo = $scope.externalIdentificationNo;
				if($scope.cardAssociations == 'V'){
					// 页面弹出框事件(弹出页面)
					$scope.modal('/authorization/customerInfo/exceptionAddModV.html', $scope.itemAddM, {
						title : T.T('SQJ2600008'),
						buttons : [ T.T('F00107'), T.T('F00108') ],
						size : [ '900px', '580px' ],
						callbacks : [$scope. saveexceVInfo]
					});
				}else if($scope.cardAssociations == 'M'){
					// 页面弹出框事件(弹出页面)
					$scope.modal('/authorization/customerInfo/exceptionAddModM.html', $scope.itemAddM, {
						title : T.T('SQJ2600008'),
						buttons : [ T.T('F00107'), T.T('F00108') ],
						size : [ '900px', '480px' ],
						callbacks : [$scope. saveexceMInfo]
					});
				}else{
					jfLayer.fail(T.T('SQJ2600007'));
				}
			}
		};
    	// 新增信息事件
		$scope.exceV = {};
		$scope.saveexceVInfo = function(result) {
			console.log(result);
			var cwbZoneCodeStr = "";
			$scope.exceV.authFlag = "0";
			$scope.exceV.authDataSynFlag = "1";
			if(result.scope.czcList.length > 0){
				for(var i=0;i<result.scope.czcList.length;i++){
					cwbZoneCodeStr += result.scope.czcList[i].cwbZoneCode1;
				}
			}
			//$scope.exceV.cwbZoneCode = cwbZoneCodeStr.slice(0,-1);
			$scope.exceV.cwbZoneCode = cwbZoneCodeStr;
           jfRest.request('exceptionManage', 'addexceV', $scope.exceV).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ2600005'));
                	$scope.exceV = {};
                	result.scope.mdmInfoFormV.$setPristine();
            		$scope.safeApply();
        			result.cancel();
        			$scope.selException();
                }
            });
		};
    	// 新增信息事件
		$scope.exceM = {};
		$scope.saveexceMInfo = function(result) {
			$scope.exceM.authFlag = "0";
			$scope.exceM.authDataSynFlag = "1";
			$scope.exceM.externalIdentificationNo = result.scope.externalIdentificationNo;
			$scope.exceM.cardAssociations = result.scope.cardAssociations;
           jfRest.request('exceptionManage', 'addexceM', $scope.exceM).then(function(data) {
                if (data.returnCode == '000000') {
                	jfLayer.success(T.T('SQJ2600005'));
                	$scope.exceM = {};
                	result.scope.mdmInfoFormM.$setPristine();
            		$scope.safeApply();
        			result.cancel();
        			$scope.selException();
                }
            });
		};
		//删除
		$scope.delException = function() {
			if(($scope.externalIdentificationNo == "" || $scope.externalIdentificationNo == undefined || $scope.externalIdentificationNo == null) || 
					($scope.cardAssociations == "" || $scope.cardAssociations == undefined || $scope.cardAssociations == null)){
				jfLayer.fail(T.T('SQJ2600004'));
				$scope.resultInfoV = false;
				$scope.resultInfoM = false;
			}else{
				$scope.param = {
						"authDataSynFlag":'1',
						"externalIdentificationNo":$scope.externalIdentificationNo,
						"cardAssociations":$scope.cardAssociations
					};
				 jfRest.request('exceptionManage', 'query', $scope.param).then(function(data) {
		                if (data.returnCode == '000000') {
		                	$scope.cwbstr = "";
		                	$scope.item = data.returnData;
		                	if(data.returnData){
		                		$scope.item.cwbZoneCodesList = [];
			                	$scope.cwbZoneCodes = data.returnData.cwbZoneCode;
			                	if($scope.cwbZoneCodes){
			                		for(var i=0;i<$scope.cwbZoneCodes.length;i++){
			                			$scope.cwbstr = {'cwbZoneCode':$scope.cwbZoneCodes.substr(i,1)};
			                			$scope.item.cwbZoneCodesList.push($scope.cwbstr);
			                		}
			                	}
			    				if($scope.cardAssociations == 'V'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionDelModV.html', $scope.item, {
			    						title : T.T('SQJ2600003'),
			    						buttons : [ T.T('F00107'), T.T('F00108') ],
			    						size : [ '900px', '480px' ],
			    						callbacks : [$scope. delInfoV]
			    					});
			    				}else if($scope.cardAssociations == 'M'){
			    					// 页面弹出框事件(弹出页面)
			    					$scope.modal('/authorization/customerInfo/exceptionDelModM.html', $scope.item, {
			    						title : T.T('SQJ2600003'),
			    						buttons : [ T.T('F00107'), T.T('F00108') ],
			    						size : [ '900px', '480px' ],
			    						callbacks : [$scope. delInfoM]
			    					});
			    				}
			                }else{
		                		jfLayer.fail(T.T('SQJ2600001'));
		                	}
		                }
		            });
			}
		};
		//删除V
		$scope.delInfoV = function(result){
			jfLayer.confirm(T.T('SQJ2600002'),function() {
				$scope.param = {
					"authDataSynFlag":'1',
					"authFlag":'2',
					"externalIdentificationNo":$scope.item.externalIdentificationNo,
					"cardAssociations":$scope.item.cardAssociations
				};
			 jfRest.request('exceptionManage', 'addexceV', $scope.param).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00037'));
	                	$scope.safeApply();
	        			result.cancel();
	        			$scope.resultInfoV = false;
	        			$scope.resultInfoM = false;
	                }
	            });
			},function() {
			});
		};
		//删除M
		$scope.delInfoM = function(result){
			jfLayer.confirm(T.T('SQJ2600002'),function() {
				$scope.param = {
					"authDataSynFlag":'1',
					"authFlag":'2',
					"externalIdentificationNo":$scope.item.externalIdentificationNo,
					"cardAssociations":$scope.item.cardAssociations
				};
			 jfRest.request('exceptionManage', 'addexceM', $scope.param).then(function(data) {
	                if (data.returnCode == '000000') {
	                	jfLayer.success(T.T('F00037'));
	                	$scope.safeApply();
	        			result.cancel();
	        			$scope.resultInfoV = false;
	        			$scope.resultInfoM = false;
	                }
	            });
			},function() {
			});
		}
	});
	// 新增V
	webApp.controller('exceptionAddVCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.exceV.externalIdentificationNo = $scope.itemAddM.externalIdentificationNo;
		$scope.exceV.cardAssociations = 'V';
		$scope.addressInfo = false;
		//定义地区码--------默认值
		$scope.czcBtn = false;
		$scope.czcList = "";
		$scope.info1 = false;
		$scope.info2 = false;
		$scope.getInfo1 = function(){
			$scope.info1 = true;
			$scope.info2 = false;
		};
		$scope.closeInfo1 = function(){
			$scope.info1 = false;
			$scope.info2 = false;
		};
		$scope.getInfo2 = function(){
			$scope.info1 = false;
			$scope.info2 = true;
		};
		$scope.closeInfo2 = function(){
			$scope.info1 = false;
			$scope.info2 = false;
			$scope.actCodeInfo = $scope.exceV.actCode;
			if($scope.actCodeInfo == '04' || $scope.actCodeInfo == '07' || $scope.actCodeInfo == '41' || $scope.actCodeInfo == '43'){
				$scope.addressInfo = true;
				$scope.czcBtn = true;
			}
			else{
				$scope.addressInfo = false;
				$scope.czcBtn = false;
				$scope.czcList = "";
			}
		};
	 	//地区码--增加
	 	$scope.czcAdd = function(){
	 		if($scope.czcList.length == 8){
	 			$scope.czcBtn = false;
	 			$scope.czcList.splice($scope.czcList.length,0,{});
	 		}
	 		else{
	 			$scope.czcBtn = true;
	 			if($scope.czcList == 0){
		 			$scope.czcList = [{}];
		 		}
		 		else{
		 			$scope.czcList.splice($scope.czcList.length,0,{});
		 		}
	 		}
	 	};
	 	//删除地区码
	 	$scope.czcDel = function(e,$index){
	 		$scope.czcList.splice($index,1);
	 		if($scope.czcList.length > 8){
	 			$scope.czcBtn = false;
	 		}
	 		else{
	 			$scope.czcBtn = true;
	 		}
	 	}
	});
	// 新增M
	webApp.controller('exceptionAddMCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.externalIdentificationNo = $scope.itemAddM.externalIdentificationNo;
		$scope.cardAssociations = 'M';
		//默认管控原因的下拉菜单
		$scope.contrlRArray = [{name :T.T('SQJ2600014'),id : 'L'},
		                       {name :T.T('SQJ2600015'),id : 'S'},
		                       {name :T.T('SQJ2600016'),id : 'F'},
		                       {name :T.T('SQJ2600017'),id : 'X'},
		                       {name :'VIP',id : 'V'},
		                       {name :T.T('SQJ2600018'),id : 'C'},
		                       {name :T.T('SQJ2600019'),id : 'U'},
		                       {name :T.T('SQJ2600020'),id : 'P'},
		                       {name :T.T('SQJ2600021'),id : 'O'}];
		$scope.fileArray = [{name:T.T('SQJ2600022'),id:'1'},{name:T.T('SQJ2600023'),id:'2'}];
		$scope.infoV = false;
		//调额币种
/*		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{"authDataSynFlag":'1',"externalIdentificationNo":$scope.externalIdentificationNo},//默认查询条件 
		        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"quota.creditCurrency",//数据源调用的action 
		        callback: function(data){
		        }
		    };*/
		var form = layui.form;
		form.on('select(getInfoV)',function(event){
			if(event.value == "V"){
				$scope.infoV = true;
			}
			else{
				$scope.infoV = false;
				$scope.exceM.vipAmount = "";
			}
		});
	});
	// 删除V
	webApp.controller('exceptionListCtrlD', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.cwbZoneCodesdList = $scope.item.cwbZoneCodesList;
	});
	// 维护V
	webApp.controller('exceptionListCtrlU', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.addressInfoU = false;
		//定义地区码--------默认值
		$scope.czcBtnU = false;
		$scope.czcListU = "";
		if($scope.itemU.cwbZoneCodesList){
			$scope.addressInfoU = true;
			$scope.czcListU = $scope.itemU.cwbZoneCodesList;
			if($scope.czcListU.length == 9){
				$scope.czcBtnU = false;
			}else{
				$scope.czcBtnU = true;
			}
		}
		else{
			$scope.addressInfoU = false;
			$scope.czcListU = "";
		}
		$scope.infoU1 = false;
		$scope.infoU2 = false;
		$scope.getInfoU1 = function(){
			$scope.infoU1 = true;
			$scope.infoU2 = false;
		};
		$scope.closeInfoU1 = function(){
			$scope.infoU1 = false;
			$scope.infoU2 = false;
		};
		$scope.getInfoU2 = function(){
			$scope.infoU1 = false;
			$scope.infoU2 = true;
		};
		$scope.closeInfoU2 = function(){
			$scope.infoU1 = false;
			$scope.infoU2 = false;
			$scope.actCodeInfoU = $scope.itemU.actCode;
			if($scope.actCodeInfoU == '04' || $scope.actCodeInfoU == '07' || $scope.actCodeInfoU == '41' || $scope.actCodeInfoU == '43'){
				$scope.addressInfoU = true;
				if($scope.czcListU.length < 9){
		 			$scope.czcBtnU = true;
		 		}
		 		else{
		 			$scope.czcBtnU = false;
		 		}
			}
			else{
				$scope.addressInfoU = false;
				$scope.czcBtnU = false;
				$scope.czcListU = "";
			}
		};
		//地区码--增加
	 	$scope.czcAddUpdate = function(){
	 		if($scope.czcListU.length == 8){
	 			$scope.czcBtnU = false;
	 			$scope.czcListU.splice($scope.czcListU.length,0,{});
	 		}
	 		else{
	 			$scope.czcBtnU = true;
	 			if($scope.czcListU == 0){
		 			$scope.czcListU = [{}];
		 		}
		 		else{
		 			$scope.czcListU.splice($scope.czcListU.length,0,{});
		 		}
	 		}
	 	};
	 	//删除地区码
	 	$scope.czcuDel = function(e,$index){
	 		$scope.czcListU.splice($index,1);
	 		if($scope.czcListU.length < 9){
	 			$scope.czcBtnU = true;
	 		}
	 		else{
	 			$scope.czcBtnU = false;
	 		}
	 	}
	});
	// 维护M
	webApp.controller('exceptionListCtrlMU', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//默认管控原因的下拉菜单
		$scope.contrlRArray = [{name :T.T('SQJ2600014'),id : 'L'},
		                       {name :T.T('SQJ2600015'),id : 'S'},
		                       {name :T.T('SQJ2600016'),id : 'F'},
		                       {name :T.T('SQJ2600017'),id : 'X'},
		                       {name :'VIP',id : 'V'},
		                       {name :T.T('SQJ2600018'),id : 'C'},
		                       {name :T.T('SQJ2600019'),id : 'U'},
		                       {name :T.T('SQJ2600020'),id : 'P'},
		                       {name :T.T('SQJ2600021'),id : 'O'}];
		$scope.fileArray = [{name:T.T('SQJ2600022'),id:'1'},{name:T.T('SQJ2600023'),id:'2'}];
		$scope.infoV = false;
		if($scope.itemU.contrlReason == "V"){
			$scope.infoV = true;
		}
		else{
			$scope.infoV = false;
			$scope.itemU.vipAmount = "";
		}
/*		//调额币种
		 $scope.coArray ={ 
		        type:"dynamic", 
		        param:{"authDataSynFlag":'1',"externalIdentificationNo":$scope.externalIdentificationNo},//默认查询条件 
		        text:"currencyDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"quota.creditCurrency",//数据源调用的action 
		        callback: function(data){
		        }
		    };*/
		var form = layui.form;
		form.on('select(getInfoU)',function(event){
			if(event.value == "V"){
				$scope.infoV = true;
			}
			else{
				$scope.infoV = false;
				$scope.itemU.vipAmount = "";
			}
		});
	});
});
