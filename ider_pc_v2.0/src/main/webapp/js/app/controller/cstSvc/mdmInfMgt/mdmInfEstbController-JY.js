'use strict';
define(function(require) {
	var webApp = require('app');
	// 30媒介信息建立mdmInfEstbCtrl-JY
webApp.controller('mdmInfEstbCtrl-JY',function($scope, $stateParams, jfRest, $http, jfGlobal, $timeout, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEstb');
	$translate.refresh();
	$scope.userName = lodinDataService.getObject("menuName");//菜单名
	console.log( lodinDataService.getObject("menuName"));
	//搜索身份证类型
	$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
	{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	{name : T.T('F00116') ,id : '4'} ,//中国护照
	{name : T.T('F00117') ,id : '5'} ,//外国护照
	{name : T.T('F00118') ,id : '6'}  ];//外国人永久居留证
	//联动验证
	var form = layui.form;
	form.on('select(getIdType)',function(data){
		$scope.csInfParams.idNumber= '';
		if(data.value == "1"){//身份证
			$("#mdmInfEstb_idNumber").attr("validator","id_idcard");
		}else if(data.value == "2"){//港澳居民来往内地通行证
			$("#mdmInfEstb_idNumber").attr("validator","id_isHKCard");
		}else if(data.value == "3"){//台湾居民来往内地通行证
			$("#mdmInfEstb_idNumber").attr("validator","id_isTWCard");
		}else if(data.value == "4"){//中国护照
			$("#mdmInfEstb_idNumber").attr("validator","id_passport");
		}else if(data.value == "5"){//外国护照passport
			$("#mdmInfEstb_idNumber").attr("validator","id_passport");
		}else if(data.value == "6"){//外国人永久居留证
			$("#mdmInfEstb_idNumber").attr("validator","id_isPermanentReside");
		}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
			$("#mdmInfEstb_idNumber").attr("validator","noValidator");
			$scope.queryInfForm.$setPristine();
			$("#mdmInfEstb_idNumber").removeClass("waringform ");
        }
    });
		//	所属机构
		 $scope.institutionIdArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"organName", //下拉框显示内容，根据需要修改字段名称 
			        value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"coreOrgan.queryCoreOrgan",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
		 //卡版代码
		 $scope.formatCodeArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"formatDescribe", //下拉框显示内容，根据需要修改字段名称 
	        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"cardLayoutMag.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
		};
		//当媒介对象代码为虚拟卡时，卡版代码不能选
		form.on('select(getMediaObj)',function(ev){
			 $scope.mdmInfEstbInfo.formatCode = '';
			if(ev.value == "MODM00010"){//虚拟卡
				$("#formatCode").attr("disabled",true);
			}else {//港澳居民来往内地通行证
				$("#formatCode").attr("disabled",false);
			}
		});
		// 主附标识
		$scope.mainAttachmentArray = [ {
			name : T.T('KHJ3900001'),//'主卡',
			id : '1'
		}, {
			name :T.T('KHJ3900002'),//'附属卡',
			id : '2'
		} ];
		$scope.mediaObjectCodeList = [ {
			name : T.T('KHJ3900003'),//'磁条卡',
			id : 'MODM00001'
		}, {
			name :T.T('KHJ3900004'),//'芯片卡',
			id : 'MODM00002'
		}, {
			name : T.T('KHJ3900005'),//'虚拟卡',
			id : 'MODM00010'
		}  ];
		$scope.cardMakingResult = [ {
			name : T.T('KHJ3900006'),//'是',
			id : '1'
		}, {
			name : T.T('KHJ3900007'),//'否',
			id : ' '
		} ];
		$scope.mdmInfEstbInfo = { };// 媒介基本信息与制卡信息
		$scope.csInf = { };// 客户基本信息对象
		$scope.csInfParams = { };// 查询基本信息对象
		$scope.showCardNo = false;// 卡号隐藏
		$scope.showMdmInfEstbInfoBtn = false;// 隐藏基本信息
		$scope.showLblInfo = false;// 隐藏新增标签信息
		$scope.showMdmInfEstbInfoBtn2 = false;// 隐藏媒介信息
		// 2选择产品对象
		$scope.selPDObjTable = {
			checkType : 'radio',
			params : {
				"selPDObjTableInd" : "0",
				"pageSize" : 10,
				"indexNo" : 0,
				idNumber : $scope.csInfParams.idNumber,
				idType : $scope.csInfParams.idType
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryCoreProductObject',// 列表的资源
			autoQuery : false,
			callback : function(data) { // 表格查询后的回调函数
			},
			checkBack:function(item){
				//卡版代码
				 $scope.formatCodeArray ={ 
			        type:"dynamic", 
			        param:{
			        	productObjectCode:item.productObjectCode,
			        	operationMode: item.operationMode,
			        },//默认查询条件 
			        text:"formatDescribe", //下拉框显示内容，根据需要修改字段名称 
			        value:"formatCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"cardLayoutMag.relatedProObjQuery",//数据源调用的action 
			        callback: function(data){
			        	
			        }
				};
			},
		};
		// 重置
		$scope.reset = function() {
			$scope.csInfParams.idType = '';
			$scope.csInfParams.idNumber = '';
			$scope.mdmInfEstbInfo = {};
			$scope.showCardNo = false;// 卡号隐藏
			$scope.showMdmInfEstbInfoBtn = false;
			$("#mdmInfEstb_idNumber").attr("validator","noValidator");
			$("#mdmInfEstb_idNumber").removeClass("waringform ");
		};
		// 查询客户基本信息查询
		$scope.searchMdmInfEstbInfo = function() {
			if(($scope.csInfParams.idNumber == "" || $scope.csInfParams.idNumber == null || $scope.csInfParams.idNumber == undefined) &&
			($scope.csInfParams.idType == "" || $scope.csInfParams.idType == null || $scope.csInfParams.idType == undefined) ){
				jfLayer.alert(T.T('F00076'));//"请输入查询条件！"
			}else {
				if($scope.csInfParams.idType){
					if($scope.csInfParams.idNumber == "" || $scope.csInfParams.idNumber == null || $scope.csInfParams.idNumber == undefined){
						jfLayer.alert(T.T('F00076'));//"请输入证件号！"
						$scope.showCardNo = false;
						return;
					}else {
						$scope.queryHandkee($scope.csInfParams);
					}
				}else if($scope.csInfParams.idNumbe){
					if($scope.csInfParams.idType == "" || $scope.csInfParams.idType == null || $scope.csInfParams.idType == undefined){
						$scope.showCardNo = false;
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						return;
					}else {
						$scope.queryHandkee($scope.csInfParams);
					}
				}else {
					$scope.queryHandkee($scope.csInfParams);
				}
			}
			$scope.selPDObjTable.params = Object.assign($scope.selPDObjTable.params, $scope.csInfParams);
		};
		$scope.queryHandkee = function (params){
			// 媒介列表查询
			jfRest.request('cstInfQuery', 'queryInf',params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showMdmInfEstbInfoBtn = true;
					$scope.csInf.customerNo = data.returnData.rows[0].customerNo;
					$scope.mdmInfEstbInfo.mainCustomerCode = data.returnData.rows[0].customerNo;
					$scope.csInf.customerName = data.returnData.rows[0].customerName;
					$scope.csInf.idNumber = data.returnData.rows[0].idNumber;
					$scope.csInf.idType = $scope.csInfParams.idType;
					// ===========================查询产品对象信息===============================
					$scope.selPDObjTable.params.selPDObjTableInd = "1";
					$scope.csInf.selPDObjTableInd = "1";
					jfRest.request('cstMediaList','queryCoreProductObject',$scope.csInf).then(function(data) {
						if (data.returnCode == '000000') {
							$scope.selPDObjTable.params.customerNo = $scope.csInf.customerNo;
							$scope.selPDObjTable.params.customerName = $scope.csInf.customerName;
							$scope.selPDObjTable.params.idNumber = $scope.csInf.idNumber;
							$scope.showMdmInfEstbInfoBtn2 = true;
							console.log($scope.selPDObjTable.params);
							$scope.selPDObjTable.search();
						}
					});
				}
			});
		};
		// 媒介对象控制制卡请求
		var form = layui.form;
		form.on(
						'select(getRiskLimits)',
						function(event) {
							if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00001") {  
								$scope.mdmInfEstbInfo.requestCardMaking = "1";
							} else if ($scope.mdmInfEstbInfo.mediaObjectCode == "MODM00002") {
								$scope.mdmInfEstbInfo.requestCardMaking = "1";
							} else {
								$scope.mdmInfEstbInfo.requestCardMaking = " ";
							}
						});
		/*
		 * //查询产品对象信息 $scope.searchTwo = function(){ }
		 */
		// 新增
		$scope.newAdrBtn = function() {
			$scope.showNewAdrInfo = !$scope.showNewAdrInfo;
		};
		// 5标签信息
		/*
		 * $scope.lblInfTable = { checkType : 'radio', params :
		 * $scope.queryParam = { 
		 * "pageSize" : 10, "indexNo" : 0 }, // 表格查询时的参数信息
		 * paging : true,// 默认true,是否分页 resource :
		 * 'evLstList.query',// 列表的资源 callback : function(data) { //
		 * 表格查询后的回调函数 } };
		 */
		$scope.lblInfTableInfo = [];
		$scope.lblInfTableInfo = {};
		// 新增客户定价标签信息按钮
		$scope.lblInfBtn = function() {
			$scope.showLblInfo = !$scope.showLblInfo;
			$timeout(function(){
				//日期控件
				layui.use('laydate', function(){
					  var laydate = layui.laydate;
					  var startDate = laydate.render({
							elem: '#mdm_mediaTagEffectiveDate_zs',
							//min:"2019-03-01",
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
							elem: '#mdm_mediaTagEffectiveDate_ze',
							//min:Date.now(),
							done: function(value, date) {
								startDate.config.max = {
									year: date.year,
									month: date.month - 1,
									date: date.date,
								}
							}
						});
				});
				//日期控件end
			},100);
		};
		$scope.coreMediaLabelInfos = [];
		// 标签信息保存
		$scope.savelblInf = function() {
			if(($scope.lblInfTableInfo.mediaTagEffectiveDate == '' || $scope.lblInfTableInfo.mediaTagEffectiveDate == null || $scope.lblInfTableInfo.mediaTagEffectiveDate == undefined) ||
			($scope.lblInfTableInfo.mediaTagEffectiveDate == '' || $scope.lblInfTableInfo.mediaTagEffectiveDate == null || $scope.lblInfTableInfo.mediaTagEffectiveDate == undefined)
			){
				jfLayer.alert("请核对标签日期！");
				return;
			}
			var lblInfTableInfoU = {};
			lblInfTableInfoU.labelNumber = $scope.lblInfTableInfo.labelNumber;
			lblInfTableInfoU.mediaTagEffectiveDate = $scope.lblInfTableInfo.mediaTagEffectiveDate;
			lblInfTableInfoU.mediaTagExpirationDate = $scope.lblInfTableInfo.mediaTagExpirationDate;
			$scope.coreMediaLabelInfos.push(lblInfTableInfoU);
			$scope.lblInfTableInfo = {};
			$scope.showLblInfo = false;
		};
		//删除标签信息
		$scope.removeLabel= function(data) {
			var checkId = data;
			$scope.coreMediaLabelInfos.splice(checkId, 1);
		};
		// 提交
		$scope.submitAll = function() {
			if ($scope.selPDObjTable.checkedList() == null) {
				jfLayer.fail(T.T('KHJ3900009'));//"请选择其中一条产品"
				return;
			}
			if ($scope.selPDObjTable.checkedList() != null) {
				$scope.mdmInfEstbInfo.productObjectCode = $scope.selPDObjTable
						.checkedList().productObjectCode;
			}
			if ($scope.coreMediaLabelInfos && $scope.coreMediaLabelInfos.length > 0) {
				$scope.mdmInfEstbInfo.coreMediaLabelInfos = $scope.coreMediaLabelInfos;
			} else {
				$scope.coreMediaLabelInfos = null;
				$scope.mdmInfEstbInfo.coreMediaLabelInfos = $scope.coreMediaLabelInfos;
			}
		//	$scope.mdmInfEstbInfo.mainCustomerNo =  $scope.csInf.customerNo;
			//$scope.mdmInfEstbInfo.operatorId = sessionStorage.getItem("userName");
			$scope.mdmInfEstbInfo = Object.assign($scope.mdmInfEstbInfo, $scope.csInf);
			jfRest.request('cstMediaList', 'submitMdmInfo',$scope.mdmInfEstbInfo).then(
			function(data) {
				if (data.returnCode == '000000') {
					$scope.externalIdentificationNo = data.returnData.rows[0].externalIdentificationNo;
					$scope.csInfParams.mediaObjectCode = data.returnData.rows[0].mediaObjectCode;
					$scope.csInfParams.mediaUnitCode = data.returnData.rows[0].mediaUnitCode;
					$scope.mdmInfEstbInfo = {};
					$scope.lblInfTable = [];
					$scope.showMdmInfEstbInfoBtn = false;// 隐藏基本信息
					$scope.showLblInfo = false;// 隐藏新增标签信息
					$scope.showMdmInfEstbInfoBtn2 = false;// 隐藏媒介信息
					$scope.showCardNo = true;
					jfLayer.success(T.T('KHJ3900010'));//"媒介信息建立成功!"
					$scope.mdmInfEstbInfo = {};
				} else {
					if (data.returnMsg) {
						jfLayer.fail(data.returnMsg);
					} else {
						jfLayer.fail(T.T('KHJ3900011'));//"媒介信息建立失败！"
					}
				}
			});
		}
	});
});
