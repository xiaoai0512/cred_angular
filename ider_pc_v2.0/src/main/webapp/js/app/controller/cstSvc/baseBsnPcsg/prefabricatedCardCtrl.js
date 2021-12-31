'use strict';
define(function(require) {
	var webApp = require('app');
	// 30预制卡
webApp.controller('prefabricatedCardCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal,$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
	$translate.use($scope.lang);
	$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
	$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
	$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
	$translate.refresh();
	$scope.operationMode = lodinDataService.getObject("operationMode");
	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
	$scope.menuNo = lodinDataService.getObject("menuNo");
	$scope.credentialsInfoDiv = false;//证件模块
	$scope.newCustInfoDiv  = false;//新建客户信息模块
	$scope.newMediaInfoDiv  = false;//新建媒介模块
	$scope.credentialsInfo = {};//证件信息
	$scope.cstBaseInf = {};//新建客户信息对象
	$scope.newMediaCstInf = {};//新建媒介信息对象
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
		$scope.credentialsInfo.idNumber = '';
		if(data.value == "1"){//身份证
			$("#prefabricatedCard_idNumber").attr("validator","id_idcard");
		}else if(data.value == "2"){//港澳居民来往内地通行证
			$("#prefabricatedCard_idNumber").attr("validator","id_isHKCard");
		}else if(data.value == "3"){//台湾居民来往内地通行证
			$("#prefabricatedCard_idNumber").attr("validator","id_isTWCard");
		}else if(data.value == "4"){//中国护照
			$("#prefabricatedCard_idNumber").attr("validator","id_passport");
		}else if(data.value == "5"){//外国护照passport
			$("#prefabricatedCard_idNumber").attr("validator","id_passport");
		}else if(data.value == "6"){//外国人永久居留证
			$("#prefabricatedCard_idNumber").attr("validator","id_isPermanentReside")
        }
    });
	//根据菜单和当前登录者查询有权限的事件编号
	 $scope.paramsNo = {
			 menuNo:$scope.menuNo
	 };
	 $scope.eventList = "";
		jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
			if(data.returnData != null || data.returnData != ""){
				for(var i=0;i<data.returnData.length;i++){
					$scope.eventList += data.returnData[i].eventNo + ",";
				}
  	   		if($scope.eventList.search('COS.UP.02.0071') != -1){    //查询
					$scope.selBtnFlag = true;
				}
				else{
					$scope.selBtnFlag = false;
            }
                if($scope.eventList.search('COS.UP.02.0071') != -1){    //修改
					$scope.updBtnFlag = true;
				}
				else{
					$scope.updBtnFlag = false;
				}
			}
		});
	//查询法人实体
		$scope.queryCorporation = function(){
		$scope.queryParam = {
			organNo : $scope.organization
		};
		jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo='';
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			$scope.prefabricatedCardList.params.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
				$scope.corporationEntityNo = $scope.corporationEntityNo;
				$("#corporation").attr("disabled",true);
			}
		});
	};
	$scope.queryCorporation();
	//重置
	$scope.reset = function(){
		$scope.prefabricatedCardList.params.productObjectCode = '';
		$scope.prefabricatedCardList.params.flag = '';
		$scope.credentialsInfoDiv = false;
		$scope.newCustInfoDiv = false;
		$scope.newMediaInfoDiv = false;
	};
	//产品对象
	$scope.productObjectCodeArr = { 
        type:"dynamicDesc", 
        param:{},//默认查询条件 
        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
        desc:"productDesc",
        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
        resource:"proObject.query",//数据源调用的action 
        callback: function(data){
        }
	};
	//分配标识
	$scope.flagArr = { 
        type:"dictData", 
        param:{
        	"type":"DROPDOWNBOX",
        	groupsCode:"dic_distribution",
        	queryFlag: "children"
        },//默认查询条件 
        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
        resource:"paramsManage.query",//数据源调用的action 
        callback: function(data){
//			        	console.log(data)
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
	//动态请求下拉框 个人公司标识
	 $scope.personalCompanyTypeArray = { 
        type:"dictData", 
        param:{
        	"type":"DROPDOWNBOX",
        	groupsCode:"dic_personalCompanyType",
        	queryFlag: "children"
        },//默认查询条件 
        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
        resource:"paramsManage.query",//数据源调用的action 
        callback: function(data){
//		        	console.log(data)
        }
	};
	//动态请求下拉框 账单日
	 $scope.billDayArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_billDay",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框 还款选项
	 $scope.paymentMarkArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_paymentMark",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框  性别
	 $scope.genderArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_gender",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框 住宅性质
	 $scope.residencyStatusArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_residencyStatus",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框 婚姻状况
	 $scope.maritalStatusArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_maritalStatus",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框 职务级别代码
	 $scope.postRankCodeArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_postRankCode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框担保人标识
	 $scope.guarantorFlagArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_guarantorFlag",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	console.log(data)
		        }
	};
	//动态请求下拉框 主附标识
		$scope.mainAttachedFlagArray  ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_mainAttachedFlag",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	//console.log(data)
		        }
	};
	//动态请求下拉框 地址类型2
	 $scope.addressType2Array ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_addressType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        rmData:'4',
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
	};
	//动态请求下拉框 媒介对象代码
	 $scope.mediaObjectCodeArray  ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_mediaObjectCode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
//		        	$scope.newMediaCstInf.mediaObjectCode =	$scope.prefabricatedCardList.checkedList().mediaObjectCode;
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
		        	//console.log(data)
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
		        	//console.log(data)
		        }
	};
	//动态请求下拉框 制卡请求
	$scope.requestCardMakingArray  ={ 
        type:"dictData", 
        param:{
        	"type":"DROPDOWNBOX",
        	groupsCode:"dic_requestCardMaking",
        	queryFlag: "children"
        },//默认查询条件 
        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
        resource:"paramsManage.query",//数据源调用的action 
        callback: function(data){
        	//console.log(data)
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
       	//console.log(data);
       }
	};
	// 客户地址信息 保存
	$scope.showNewAdrInfo = true;
	$scope.adrlInfTable = [];
	$scope.adrlInfTableInfoObj = {};
	$scope.saveNewAdrInfo = function() {
		var adrlInfTableInfoU = {};
		adrlInfTableInfoU.type = $scope.adrlInfTableInfoObj.type;
		adrlInfTableInfoU.contactAddress = $scope.adrlInfTableInfoObj.contactAddress;
		adrlInfTableInfoU.contactPostCode = $scope.adrlInfTableInfoObj.contactPostCode;
		adrlInfTableInfoU.contactMobilePhone = $scope.adrlInfTableInfoObj.contactMobilePhone;
		adrlInfTableInfoU.city = $scope.adrlInfTableInfoObj.city;
		// 翻译
		if (adrlInfTableInfoU.type == 1) {
			adrlInfTableInfoU.typeTrans = T.T('KHJ3200038');//"邮寄地址";
		} else if (adrlInfTableInfoU.type == 2) {
			adrlInfTableInfoU.typeTrans =T.T('KHJ3200039');// "家庭地址";
		} else if (adrlInfTableInfoU.type == 3) {
			adrlInfTableInfoU.typeTrans =T.T('KHJ3200040');// "单位地址";
		}
		$scope.adrlInfTable.push(adrlInfTableInfoU);
		$scope.adrlInfTableInfoObj = {};
		$scope.showNewAdrInfo = false;
	};
	// 客户备注信息模块 保存
	$scope.cstRmrkInfoTable = [];
	$scope.cstRmrkInfoObj = {};
	$scope.saveCstRmk = function() {
		var cstRmrkInfoObjU = {};
		cstRmrkInfoObjU.remarkInfo = $scope.cstRmrkInfoObj.remarkInfo;
		cstRmrkInfoObjU.lastUpdateUserid = $scope.cstRmrkInfoObj.lastUpdateUserid;
		cstRmrkInfoObjU.createRemarksTime = $scope.cstRmrkInfoObj.createRemarksTime;
		$scope.cstRmrkInfoTable.push(cstRmrkInfoObjU);
		$scope.cstRmrkInfoObj = {};
		$scope.showCstRmrkInfo = false;
	};
	// 地址 新增按钮
	$scope.newAdrBtn = function() {
		$scope.showNewAdrInfo = !$scope.showNewAdrInfo;
	};
	// 备注 新增按钮
	$scope.cstRmrkInfoBtn = function() {
		$scope.showCstRmrkInfo = !$scope.showCstRmrkInfo;
	};
	 //媒介刻印 小写字母转化成大写字母
	 $scope.toUpperCase = function (val){
		 var upObj = val.toUpperCase();
		 return upObj;
	 };
	$("#embosserName1").on("keyup",function(){
		console.log($scope.newMediaCstInf.embosserName1);
		if($scope.newMediaCstInf.embosserName1){
			$scope.newMediaCstInf.embosserName1 = $scope.toUpperCase($scope.newMediaCstInf.embosserName1);
		}
	});
	//查询预制卡list
	$scope.prefabricatedCardList = {
		checkType : 'radio', // 
		params : {
				pageSize:10,
				indexNo:0,
//				flag:'N'
		}, // 表格查询时的参数信息
		paging : true,// 默认true,是否分页
		resource : 'prefabricatedCard.queryList',// 列表的资源
		isTrans: true,//是否需要翻译数据字典
		transParams : ['dic_distribution'],//查找数据字典所需参数
		transDict : ['flag_flagDesc'],//翻译前后key
		checkBack: function(){
			$scope.newMediaCstInf.externalIdentificationNo = $scope.prefabricatedCardList.checkedList().externalIdentificationNo;
			$scope.newMediaCstInf.expirationDate = $scope.prefabricatedCardList.checkedList().expirationDate;
			$scope.newMediaCstInf.mediaObjectCode =	$scope.prefabricatedCardList.checkedList().mediaObjectCode;
			if($scope.mediahavedProList.data){
				for(var i=0; i< $scope.mediahavedProList.data.length;i++ ){
					if($scope.mediahavedProList.data[i].productObjectCode == $scope.prefabricatedCardList.checkedList().productObjectCode){
						$scope.mediahavedProList.data[i]._checked = true;
					}else {
						$scope.mediahavedProList.data[i]._checked = false;
					}
                }
            }
		},
		callback : function(data) { // 表格查询后的回调函数
		},
	};
	//查询客户下已有产品信息
	$scope.mediahavedProList =  {
			autoQuery: false,
			checkType : 'radio', // 
			params : {
					pageSize:10,
					indexNo:0,
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstMediaList.queryProduct',// 列表的资源
			checkBack:function(row){
				if(row.productObjectCode != $scope.prefabricatedCardList.checkedList().productObjectCode){
					row._checked = false;
					jfLayer.alert(T.T('KHJ5100027'));
					angular.forEach($scope.mediahavedProList.data,function(item ,i){
						if($scope.prefabricatedCardList.checkedList().productObjectCode == item.productObjectCode){
							item._checked = true;
						}else {
							item._checked = false;
						}
					});
				}else {
					row._checked = true;
				}
			},
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows && data.returnData.rows.length > 0){
					var rows = data.returnData.rows;
					var string = '';
					for(var i=0; i< rows.length;i++ ){//有产品
						string+= rows[i].productObjectCode;
                    }
                    //判断客户下是否有预制卡产品
					if(string.search($scope.prefabricatedCardList.checkedList().productObjectCode) != -1){
						angular.forEach(rows,function(item ,i){
							if($scope.prefabricatedCardList.checkedList().productObjectCode == item.productObjectCode){
								item._checked = true;
							}else {
								item._checked = false;
							}
						});
					}else {
						//建立产品
						$scope.submitProductInf();
					}
                }
            },
		};
	//分配
	$scope.item;
	$scope.assignation = function(event){
		//初始化
		$scope.credentialsInfo.idType = '';
		$scope.credentialsInfo.idNumber = '';
		$scope.newMediaCstInf = {};
		$scope.item =  $.parseJSON(JSON.stringify(event));
		if($scope.item.flag == 'N'){
			$scope.credentialsInfoDiv = true;//证件模块
			$scope.newCustInfoDiv  = false;//新建客户信息模块
			$scope.newMediaInfoDiv  = false;//新建媒介模块
		}else {
			$scope.credentialsInfoDiv = false;//证件模块
			$scope.newCustInfoDiv  = false;//新建客户信息模块
			$scope.newMediaInfoDiv  = false;//新建媒介模块
        }
    };
	//提交 新建客户信息
	$scope.submitCustInfo = function() {
		$scope.subCsInfParams = {};
		if ($scope.adrlInfTable && $scope.adrlInfTable.length > 0) {
			$scope.subCsInfParams.coreCoreCustomerAddrs = $scope.adrlInfTable;// 地址信息list
			if ($scope.cstRmrkInfoTable && $scope.cstRmrkInfoTable.length > 0) {
				$scope.subCsInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;// 备注信息list
			} else {
				$scope.cstRmrkInfoTable = null;
				$scope.subCsInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;
            }
            //验证港澳通行证信息
            if($scope.cstBaseInf.idType=='2' || $scope.cstBaseInf.idType=='3'){
            	if($scope.cstBaseInf.idNumberHmt=='' || $scope.cstBaseInf.idNumberHmt==null || $scope.cstBaseInf.idNumberHmt==undefined || $scope.cstBaseInf.idNumberHmt.length <18){
            		jfLayer.alert(T.T('KHJ3200153'));//'请核对证件号码'
					return;
                }
            }
            $scope.subCsInfParams = Object.assign($scope.subCsInfParams, $scope.cstBaseInf);
			$scope.subCsInfParams.operatorId = sessionStorage.getItem("userName");
			jfRest.request('cstInfBuild', 'save',$scope.subCsInfParams).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData){
						$scope.customerNo = data.returnData.rows[0].customerNo;
						$scope.credentialsInfoDiv = true;//证件模块
						$scope.newCustInfoDiv  = false;//新建客户信息模块
						$scope.newMediaInfoDiv  = true;//新建媒介模块
//						$scope.mediahavedProList.push($scope.prefabricatedCardList.checkedList());
						$scope.newMediaCstInf.customerNo = data.returnData.rows[0].customerNo;
						$scope.newMediaCstInf.idNumber = data.returnData.rows[0].idNumber;
						$scope.newMediaCstInf.customerName = $scope.cstBaseInf.customerName;
						$scope.newMediaCstInf.externalIdentificationNo = $scope.prefabricatedCardList.checkedList().externalIdentificationNo;
						$scope.newMediaCstInf.externalIdentificationNoIn = $scope.prefabricatedCardList.checkedList().externalIdentificationNo;
						$scope.newMediaCstInf.expirationDate = $scope.prefabricatedCardList.checkedList().expirationDate;
						$scope.newMediaCstInf.mainCustomerNo = data.returnData.rows[0].customerNo;
						$scope.newMediaCstInf.mediaObjectCode =  $scope.prefabricatedCardList.checkedList().mediaObjectCode;
						$scope.submitProductInf();//建立产品
					}
				} 
			});
		} else {
			jfLayer.fail(T.T('KHJ3200081'));// 地址必输入一条,请至少输入一种地址信息
        }
    };
	//查询客户信息
	$scope.searchCstInfo = function(){
		//初始化
		$scope.newMediaCstInf = {};
		$scope.cstBaseInf = {};
		$scope.adrlInfTable = [];
		$scope.cstRmrkInfoTable = [];
		lodinDataService.set("buildCustomerFlag",1);//新建客户标记
		$scope.params ={
				idType: $scope.credentialsInfo.idType,
				idNumber: $scope.credentialsInfo.idNumber,
		};
		jfRest.request('cstInfQuery', 'queryInf',$scope.params).then(function(data) {
			if (data.returnCode == '000000') {//客户存在，进入媒介建立，产品为预制卡产品
				$scope.customerNo =  data.returnData.rows[0].customerNo;
				//媒介
				$scope.newMediaCstInf.externalIdentificationNoIn = $scope.prefabricatedCardList.checkedList().externalIdentificationNo;
				$scope.newMediaCstInf.externalIdentificationNo = $scope.prefabricatedCardList.checkedList().externalIdentificationNo;
				$scope.newMediaCstInf.expirationDate = $scope.prefabricatedCardList.checkedList().expirationDate;
				$scope.newMediaCstInf.customerNo = data.returnData.rows[0].customerNo;
				$scope.newMediaCstInf.customerName = data.returnData.rows[0].customerName;
				$scope.newMediaCstInf.idNumber = data.returnData.rows[0].idNumber;
				$scope.newMediaCstInf.mainCustomerNo = data.returnData.rows[0].mainCustomerNo;
				$scope.newMediaCstInf.mainCustomerNo = data.returnData.rows[0].customerNo;
				$scope.newMediaCstInf.mediaObjectCode =	$scope.prefabricatedCardList.checkedList().mediaObjectCode;
				$scope.credentialsInfoDiv = true;//证件模块
				$scope.newCustInfoDiv  = false;//新建客户信息模块
				$scope.newMediaInfoDiv  = true;//新建媒介模块
				//查询客户已有产品
				$scope.mediahavedProList.params.idType = $scope.credentialsInfo.idType;
				$scope.mediahavedProList.params.idNumber = $scope.credentialsInfo.idNumber;
				$scope.mediahavedProList.search();
			}else if(data.returnCode == 'Gns2Error'){
				$scope.credentialsInfoDiv = true;//证件模块
				$scope.newCustInfoDiv  = true;//新建客户信息模块
				$scope.newMediaInfoDiv  = false;//新建媒介模块
				$scope.cstBaseInf.idType = $scope.credentialsInfo.idType;
				$scope.cstBaseInf.idNumber = $scope.credentialsInfo.idNumber;
			}else if(data.returnCode == 'CUS-00014'){
				$scope.cstBaseInf.idType = $scope.credentialsInfo.idType;
				$scope.cstBaseInf.idNumber = $scope.credentialsInfo.idNumber;
				$scope.credentialsInfoDiv = true;//证件模块
				$scope.newCustInfoDiv  = true;//新建客户信息模块
				$scope.newMediaInfoDiv  = false;//新建媒介模块
			}else {//客户不存在,新建客户
				$scope.cstBaseInf.idType = $scope.credentialsInfo.idType;
				$scope.cstBaseInf.idNumber = $scope.credentialsInfo.idNumber;
				$scope.credentialsInfoDiv = true;//证件模块
				$scope.newCustInfoDiv  = true;//新建客户信息模块
				$scope.newMediaInfoDiv  = false;//新建媒介模块
            }
        });
	};
	//产品建立,产品建立成功后媒介建立
	$scope.submitProductInf = function(){
		$scope.productInfo = {
			idType :  $scope.credentialsInfo.idType,
			idNumber: $scope.credentialsInfo.idNumber,	
			operationMode: $scope.operationMode,
			productObjectCode: $scope.prefabricatedCardList.checkedList().productObjectCode,
			productObjectDesc: $scope.prefabricatedCardList.checkedList().productObjectDesc,
			customerNo : $scope.customerNo
		};
		jfRest.request('cstProduct', 'saveCstProduct',$scope.productInfo).then(function(data) {
			if (data.returnCode == '000000') {
				//查询产品
				$scope.mediahavedProList.params.idType =  $scope.credentialsInfo.idType;
				$scope.mediahavedProList.params.idNumber =  $scope.credentialsInfo.idNumber;
				$scope.mediahavedProList.search();
			} 
		});
	};
	//新媒介信息提交
	$scope.submitMediaInf = function() {
		if ($scope.newMediaCstInf.mainAttachment == 2) {
			if (!$scope.newMediaCstInf.subCustomerNo) {
				jfLayer.alert(T.T('KHJ3200114'));//"请填写副客户代码！"
				return;
			}
        }
        if(!$scope.mediahavedProList.checkedList()){
			jfLayer.alert(T.T('KHJ5100028'));
			return;
        }
        $scope.havedProObj = $scope.mediahavedProList.checkedList();
		$scope.mdmInfEstbInfo = {
				idType: $scope.credentialsInfo.idType,
				idNumber: $scope.credentialsInfo.idNumber,
				productObjectCode: $scope.havedProObj.productObjectCode,
				mediaUserName: 'yuzhika',
				embosserName1: 'yuzhika'
		};
		$scope.mdmInfEstbInfo = Object.assign($scope.mdmInfEstbInfo, $scope.newMediaCstInf);
		$scope.mdmInfEstbInfo.mainCustomerNo = $scope.newMediaCstInf.customerNo;
		if($rootScope.budgetOrgCode){
			$scope.mdmInfEstbInfo.budgetOrgCode = $rootScope.budgetOrgCode;
        }
        jfRest.request('cstMediaList', 'submitMdmInfo',$scope.mdmInfEstbInfo).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ3200115'));//"媒介信息建立成功!"
					$scope.credentialsInfoDiv = false;//证件模块
					$scope.newCustInfoDiv  = false;//新建客户信息模块
					$scope.newMediaInfoDiv  = false;//新建媒介模块
					//初始化
					$scope.credentialsInfo.idType = '';
					$scope.credentialsInfo.idNumber = '';
					$scope.cstBaseInf = {};
					$scope.newMediaCstInf = {};
					$scope.adrlInfTable = [];
					$scope.lblInfTable = [];
					$scope.upPrefabricatedCardList();
				} 
			});
	}; /*媒介提交结束*/
	//更新预制卡分配信息表
	$scope.upPrefabricatedCardList = function(){
		$scope.upParams ={
			flag: 'Y',
			id: $scope.prefabricatedCardList.checkedList().id
		};
		jfRest.request('prefabricatedCard', 'update',$scope.upParams).then(function(data) {
			if (data.returnCode == '000000') {
				$scope.prefabricatedCardList.flag="N";
				$scope.prefabricatedCardList.search();
				$scope.credentialsInfoDiv = false;//证件模块
				$scope.newCustInfoDiv  = false;//新建客户信息模块
				$scope.newMediaInfoDiv  = false;//新建媒介模块
				//初始化
				$scope.credentialsInfo.idType = '';
				$scope.credentialsInfo.idNumber = '';
				$scope.cstBaseInf = {};
				$scope.newMediaCstInf = {};
				$scope.adrlInfTable = [];
				$scope.lblInfTable = [];
            }
        });
	};
	});
});
