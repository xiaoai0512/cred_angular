'use strict';
	define(function(require) {
	var webApp = require('app');
	// 合作方信息管理
	webApp.controller('capitalAgreementCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.eventList = "";
		$scope.userInfo = lodinDataService.getObject("userInfo");
		$scope.organization = $scope.userInfo.organization;
		$scope.addBtnFlag = false;
		$scope.selBtnFlag = false;
		$scope.updBtnFlag = false;
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
                if($scope.eventList.search('FMS.AD.05.0001') != -1){    //新增
					$scope.addBtnFlag = true;
				}else{
					$scope.addBtnFlag = false;
				}
	   	   		if($scope.eventList.search('FMS.IQ.05.0001') != -1){    //查询
					$scope.selBtnFlag = true;
				} else{
					$scope.selBtnFlag = false;
                }
                if($scope.eventList.search('FMS.UP.05.0001') != -1){    //修改
					$scope.updBtnFlag = true;
				}else{
					$scope.updBtnFlag = false;
				}
            }
        });
		//合作方类型
		$scope.partnerCategoryArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_partnerCategoryTable",
				queryFlag : "children"
			},// 默认查询条件
			rmData:'0',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//生效码标识
		$scope.statusArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveStatus",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				
			}	
		};
		//资金协议创建信息管理--列表
		$scope.fundcreatioList = {
			params : {
					pageSize:10,
					indexNo:0,
					status: 1
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'fundcreation.queryList',// 列表的资源
			isTrans: true,
			transParams: ['dic_fundAgreementType','dic_ZorO','dic_ZorO','dic_typesOfContribution','dic_effectiveStatus'],
			transDict: ['trustType_trustTypeDesc','isMulitTrust_isMulitTrustDesc','isAutoTrun_isAutoTrunDesc',
			            'fundsType_fundsTypeDesc','status_statusDesc'],
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//重置
		$scope.resetChose = function() {
			$scope.fundcreatioList.params.trustNum = "";
			$scope.fundcreatioList.params.trustName = "";
			$scope.fundcreatioList.params.operationMode = "";
			$scope.fundcreatioList.params.status = "";
		};
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#effectiveDate',
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
					$scope.payProInf.effectiveDate = $("#effectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#expirationDate',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		// 查看
		$scope.capitalDetails = function(event) {
			$scope.seeInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/multiFundLoan/viewFundAgreement.html',
			$scope.seeInfo, {
				title : T.T('FQJ800014'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '590px' ],
				callbacks : []
			});
		};
		//新增
		$scope.addCapitalAgreement = function(){
			// 页面弹出框事件(弹出页面);
			$scope.modal('/cstSvc/multiFundLoan/addCapitalAgreement.html','',{
				title : T.T('FQJ800003'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1090px', '590px' ],
				callbacks : [$scope.saveCapitalAgreement]
			});
		};
		//多资方新增： 回调函数
		$scope.saveCapitalAgreement = function(result){
			$scope.capitalInfoList = {
				operationMode: result.scope.addCapitalInfo.operationMode,
				clearMode: result.scope.addCapitalInfo.clearMode,
				cooperatModel: result.scope.addCapitalInfo.cooperatModel,
				isMulitTrust: result.scope.addCapitalInfo.isMulitTrust,
				isAutoTrun: result.scope.addCapitalInfo.isAutoTrun,
				fundsType: result.scope.addCapitalInfo.fundsType,
				trustType: result.scope.addCapitalInfo.trustType,
				orgNum: result.scope.addCapitalInfo.orgNum,
				accountCcy: result.scope.addCapitalInfo.accountCcy,
				trustNum: result.scope.addCapitalInfo.trustNum,
			};
			//已关联产品额度节点
			$scope.productObjectCodeList = [];
			$scope.isHaveNode;
			for(var k = 0 ; k < $scope.addlinkedList.length; k++){
				if(!$scope.addlinkedList[k].creditNodeNoList){
					$scope.isHaveNode = false;
					break;
				}else  if($scope.addlinkedList[k].creditNodeNoList && $scope.addlinkedList[k].creditNodeNoList.length > 0){
					$scope.creditNodeNo11 = $scope.addlinkedList[k].creditNodeNoList.map(function(creditNodeNo,index){
					    return creditNodeNo.code;
					}).join(",");
					if($scope.creditNodeNo11){
						var obj = {
							productObjectCode : $scope.addlinkedList[k].productObjectCode,
							productDesc : $scope.addlinkedList[k].productDesc,
							creditNodeNo : $scope.creditNodeNo11,
						};
						$scope.productObjectCodeList.push(obj);
						$scope.isHaveNode = true;
                    }
                }
            }
            if(!$scope.isHaveNode){//新增产品没有关联额度节点
				jfLayer.alert(T.T('FQJ800018'));
				return;
            }
            $scope.capitalInfoList.productObjectCodeList = $scope.productObjectCodeList;
			jfRest.request('productquota', 'query', $scope.capitalInfoList).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.capitalInfoList = {};
					$scope.fundcreatioList.search();
					$scope.safeApply();
					result.cancel();
                }
            });
		};
		// 修改
		$scope.updateListInfo = function(event) {
			$scope.updateCapitalInfo = {};
			$scope.updateCapitalInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/multiFundLoan/updateCapital/updateCapitalAgreement.html',$scope.updateCapitalInfo, {
				title : T.T('FQJ800006'),
				buttons : [ T.T('F00107'), T.T('F00012')],
				size : [ '1050px', '590px' ],
				callbacks : [ $scope.sureUpdateAllInfo]
			});
		};
		//修改回调函数
		$scope.sureUpdateAllInfo = function(result) { 
			//传参
			$scope.paramsData=result.scope.updateInfo;
			$scope.paramsData.operationMode = result.scope.operationMode;
			$scope.paramsData.clearMode = result.scope.clearMode,
			$scope.paramsData.cooperatModel = result.scope.cooperatModel,
			$scope.paramsData.isAutoTrun = result.scope.isAutoTrun,
			$scope.paramsData.isMulitTrust = result.scope.isMulitTrust,
			$scope.paramsData.fundsType = result.scope.fundsType,
			$scope.paramsData.trustType = result.scope.trustType,
			$scope.paramsData.coreBusTrustPersonList = result.scope.updateListA;
			$scope.paramsData.accountCcy = result.scope.accountCcy;
			$scope.paramsData.operationMode = result.scope.operationMode;
			$scope.countNumber = 0;
			$scope.theSumNumber = 0; 
			$scope.ratioNumber = 0;
			for(var prop in $scope.paramsData.coreBusTrustPersonList){
				$scope.countNumber +=$scope.paramsData.coreBusTrustPersonList[prop].amount;
				$scope.theSumNumber +=$scope.paramsData.coreBusTrustPersonList[prop].interestDividendRatio;
				$scope.ratioNumber +=$scope.paramsData.coreBusTrustPersonList[prop].ratio;
            }
            //已关联产品额度节点
			$scope.productObjectCodeList = [];
			$scope.isHaveNode;
			for(var k = 0 ; k < $scope.linkedList.length; k++){
				if(!$scope.linkedList[k].creditNodeNoList){
					$scope.isHaveNode = false;
					break;
				} else if($scope.linkedList[k].creditNodeNoList && $scope.linkedList[k].creditNodeNoList.length > 0){
					$scope.creditNodeNo11 = $scope.linkedList[k].creditNodeNoList.map(function(creditNodeNo,index){
					    return creditNodeNo.code;
					}).join(",");
					if($scope.creditNodeNo11){
						var obj = {
							productObjectCode : $scope.linkedList[k].productObjectCode,
							productDesc : $scope.linkedList[k].productDesc,
							creditNodeNo : $scope.creditNodeNo11,
						};
						$scope.productObjectCodeList.push(obj);
                        $scope.isHaveNode = true;
                    }
                }
            }
            if(!$scope.isHaveNode){//修改产品没有关联额度节点
				jfLayer.alert(T.T('FQJ800018'));
				return;
            }
            $scope.paramsData.productObjectCodeList = $scope.productObjectCodeList;
			jfRest.request('fundcreation', 'update', $scope.paramsData) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.paramsData = {};
					$scope.fundcreatioList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
	});
	//新增资金协议创建 弹窗-1
	webApp.controller('addCapitalAgreementCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.addCapitalInfo = {};
		$scope.fundDiv = true;//资金方信息
		$scope.proQuoaDiv = false;//产品额度节点
		$scope.accountCcyArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_RMB",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//资金协议类型 
		$scope.fundAgreementArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_fundAgreementType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: ['0','1','2'],
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.addCapitalInfo.trustType = '3';
			}
		};
		//出资类型
		$scope.capitalContributionArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typesOfContribution",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//是否自动回转
		$scope.isAutoTranArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.addCapitalInfo.isAutoTrun = 1;
			}	
		};
		//是否多方
		$scope.isMultitrustArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//合作模式
		$scope.cooperatModelArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cooperationMode",
				queryFlag : "children"
			},// 默认查询条件
			rmData: '3',
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.addCapitalInfo.cooperatModel = 1;
			}	
		};
		//清算模式   
		$scope.liquidationModeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_liquidationMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.addCapitalInfo.clearMode = 1;
			}
		};
		//运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.coArrayList = data
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
				$scope.coArrayList = data
			}
		};
		/*------新增资金方信息------*/
		//新增资金方信息弹窗
		$scope.addFunderInfo = function(event,index){
			$scope.eventitem=event;
			$scope.addIndex=index;
			if(!$scope.eventitem.hasOwnProperty("trustNum") || !$scope.eventitem.hasOwnProperty("fundsType")){
				jfLayer.fail(T.T("FQJ800007"));

			}else{
				// 页面弹出框事件(弹出页面);
				$scope.modal('/cstSvc/multiFundLoan/addFunderInfo.html',$scope.eventitem,{
					title : T.T('FQJ800004'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '1090px', '450px' ],
					callbacks : [$scope.saveFunderInfo]
				});
			}
		};
		//新增资金方回调函数
		$scope.fatherList = [];
		$scope.saveFunderInfo = function(result){
			$scope.funderInfo = result.scope.funderInfo;
			$scope.funderInfo.trustId = $scope.addCapitalInfo.trustNum;
			$scope.fatherList.push($scope.funderInfo);
			$scope.safeApply();
			result.cancel();
		};
		//删除资金方信息
		$scope.deleteListA= function(list,index){
			$scope.fatherList.splice(index,1);
			$scope.coreTrustAccountList.splice(0,$scope.coreTrustAccountList.length);
		};
		/*------新增资金方账号信息------*/
		//资金方信息获取单选值
		$scope.selectOne = function(list,index){
			$scope.coreTrustAccountList = $scope.fatherList[index].coreTrustAccountList;
		};
		//新增资金方账号信息  
		$scope.addCapitalAccount = function(item,index){
			$scope.selectOne(item,index);
			$scope.selectItem={};
			$scope.selectItem=item;
			$scope.selectIndex= index;
			if($scope.selectItem==undefined){
				jfLayer.fail(T.T("FQJ800002"));
				return;
			}
			//暂时注释
			/*if(item.hasOwnProperty('coreTrustAccountList')){
				if(item.coreTrustAccountList.length >=4){
					jfLayer.fail(T.T("FQJ800012"));
					return;
				}
			}*/
			// 页面弹出框事件(弹出页面);
			$scope.modal('/cstSvc/multiFundLoan/addCapitalAccountInfo.html',$scope.selectItem,{
				title : T.T('FQJ800005'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1090px', '590px' ],
				callbacks : [$scope.saveCapitalAccount]
			});
		};
		//新增资金方账号信息回调
		$scope.coreTrustAccountList= [];
		$scope.saveCapitalAccount = function(result){
			$scope.accountInfo = result.scope.accountInfo;
			$scope.accountInfo.corporationEntityName = result.scope.corporationEntityName;
			$scope.accountInfo.corporationEntityNo=result.scope.corporationEntityNo;
			$scope.accountInfo.trustPersonId = result.scope.corporationEntityNo;
			if($scope.fatherList[$scope.selectIndex].hasOwnProperty("coreTrustAccountList")){
					$scope.fatherList[$scope.selectIndex].coreTrustAccountList.push($scope.accountInfo);
				}else{
					$scope.fatherList[$scope.selectIndex].coreTrustAccountList = [$scope.accountInfo];
				}
				$scope.coreTrustAccountList=$scope.fatherList[$scope.selectIndex].coreTrustAccountList;
				$scope.safeApply();
				result.cancel();
		};
		//删除资金方账号信息
		$scope.deleteListB= function(item,index){
			$scope.coreTrustAccountList.splice(index,1);
		};
		
		
		//下一步
		$rootScope.treeSelect = [];
		$rootScope.treeSelectPro = [];
		$scope.nextStep = function(){
//			$scope.queryProFund();
			$scope.capitalInfoList = {};
			$scope.capitalInfoList = {
				trustNum: $scope.addCapitalInfo.trustNum,
				trustName: $scope.addCapitalInfo.trustName,
				trustType: $scope.addCapitalInfo.trustType,
				fundsType: $scope.addCapitalInfo.fundsType,
				isAutoTrun: $scope.addCapitalInfo.isAutoTrun,
				isMulitTrust: $scope.addCapitalInfo.isMulitTrust,
				loanAmt: $scope.addCapitalInfo.loanAmt,
				cooperatModel: $scope.addCapitalInfo.cooperatModel,
				clearMode: $scope.addCapitalInfo.clearMode,
				effectiveDate: $scope.addCapitalInfo.effectiveDate,
				expireDate: $scope.addCapitalInfo.expireDate,
				operationMode: $scope.addCapitalInfo.operationMode,
				accountCcy: $scope.addCapitalInfo.accountCcy,
			};
			$scope.capitalInfoList.coreBusTrustPersonList= $scope.fatherList;
			$scope.countNum = 0;
			$scope.theSum = 0;
			$scope.ratioNum = 0;
			for(var prop in $scope.capitalInfoList.coreBusTrustPersonList){
				$scope.countNum +=$scope.capitalInfoList.coreBusTrustPersonList[prop].amount;
				$scope.theSum +=$scope.capitalInfoList.coreBusTrustPersonList[prop].interestDividendRatio;
				$scope.ratioNum +=$scope.capitalInfoList.coreBusTrustPersonList[prop].ratio;
            }
            jfRest.request('fundcreation', 'queryAdd', $scope.capitalInfoList).then(function(data) {
				if (data.returnCode == '000000') {
//						jfLayer.success(T.T('F00032'));
					$scope.capitalInfoList = {};
					/*$scope.fundcreatioList.search();
					$scope.safeApply();
					result.cancel();*/
					$scope.fundDiv = false;//资金方信息
					$scope.proQuoaDiv = true;//产品额度节点
				}
			});
		};
		//查产品
		$scope.updateQuotaNodeTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询是否有关联产品
		$scope.queryProFund = function(){
			$scope.queryParam = {
					trustNum: $scope.addCapitalInfo.trustNum
				};
				jfRest.request('productquota', 'details',$scope.queryParam).then(function(data) {
					if (data.returnCode == '000000') {
						if (!data.returnData || !data.returnData.rows) {
							$rootScope.addlinkedList = [];
						}else if(data.returnData.rows.length > 0){
							$rootScope.addlinkedList = data.returnData.rows;//赋值已关联产品
						}
                    }
                    /*if (data.returnCode == '000000') {
                        $rootScope.treeSelect = [];
                        $rootScope.treeSelectPro = [];
                        $scope.selPro = {};
                        if (data.returnData.rows == null) {
                            $rootScope.treeSelect = [];
                        }else {
                            $rootScope.treeSelect = data.returnData.rows;
                            for(var i =0; i < $rootScope.treeSelect.length; i++){
                                $scope.creditNodeNoList = $rootScope.treeSelect[i].creditNodeNoList;
                                for(var j =0; j< $scope.creditNodeNoList.length; j++){
                                    //获取接口返回的额度节点，因为接口返回的是list修改后只需传额度所以要单独获取
                                    $scope.creditNodeNo += $scope.creditNodeNoList[j].code + ",";
                                    //拼接数据训循环到页面
                                    $scope.selPro={productDesc:$rootScope.treeSelect[i].productDesc,productObjectCode:$rootScope.treeSelect[i].productObjectCode,creditNodeNo:$scope.creditNodeNoList[j].code};
                                };
                                $rootScope.treeSelectPro.push($scope.selPro);
                            };
                        }
                    }*/
				});
		};
		
		//资方协议新增：关联产品
		$rootScope.addlinkedList = [];
		$scope.saveSelect = function(event) {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.updateQuotaNodeTable.validCheck()) {
				return;
			}
			var items = $scope.updateQuotaNodeTable.checkedList();
			
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.addlinkedList.length; k++) {
					if (items[i].productObjectCode == $rootScope.addlinkedList[k].productObjectCode) { // 判断是否存在
						tipStr = tipStr + items[i].productObjectCode
								+ ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$rootScope.addlinkedList.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('PZJ100033')+ tipStr.substring(0,tipStr.length - 1)+ T.T('PZJ100032'));
			}
		};
		//删除关联
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.addlinkedList.splice(checkId, 1);
		};
		//资方协议新增：跳转额度节点弹框
		$scope.addupdateQuotaNode = function(item,index){
			if(item==''){
				jfLayer.alert(T.T('FQJ800017'));
				return;
            }
            $scope.quotaNodeInfo = item;
			$scope.quotaNodeInfo.trustNum = $scope.addCapitalInfo.trustNum;
			$scope.quotaNodeInfo.indexNo = index;
			$scope.modal('/cstSvc/multiFundLoan/productQuotaNode/newQuotaNode.html',
				$scope.quotaNodeInfo, {
				title : T.T('FQJ800015'),
				buttons : [ T.T('F00107') , T.T('F00012') ],
				size : [ '1050px', '590px' ],
				callbacks : [$scope.addQno]
			});
		};
		//资方协议新增：额度节点确定回调
		$scope.addQno = function(result){
			$scope.itemList = {};
			$scope.itemList = result.scope.quotaNodeInfo;
			var indexNo = result.scope.quotaNodeInfo.indexNo;
			$scope.creditNodeNo = "";
			$scope.selectedNodeList = [];
			$("#s56 option").each(function () {
				var vall = $(this).val();
				$scope.selectedNodeList.push(vall);
			});	
			//检查是否关联额度节点，必须关联额度节点
			if(!$scope.selectedNodeList || $scope.selectedNodeList.length == 0){
				jfLayer.alert("检查是否关联额度节点");
				return;
            }
            $scope.creditNodeNo = $scope.selectedNodeList.join(",");
			$scope.addlinkedList[indexNo].creditNodeNo = $scope.creditNodeNo;
			//给已关联产品添加已选的额度节点
			$scope.addlinkedList[indexNo].creditNodeNoList = [];
			angular.forEach($rootScope.quoteAll,function(quoteItem, m){
				if($scope.selectedNodeList && $scope.selectedNodeList.length > 0){//已选额度节点
					angular.forEach($scope.selectedNodeList,function(selectedNode, k){
						if(quoteItem.creditNodeNo == selectedNode){
							var selectedNode = {
								code: quoteItem.creditNodeNo,
								desc: quoteItem.creditDesc,
							};
							$scope.addlinkedList[indexNo].creditNodeNoList.push(selectedNode);
                        }
                    })
                }
            });
			$scope.safeApply();
			result.cancel();
			/*$scope.itemList = {};
			$scope.itemList = result.scope.quotaNodeInfo;//信息
			var indexNo =  result.scope.quotaNodeInfo.indexNo;//下标
			$scope.creditNodeNo = "";
			$scope.arr02 = [];
			$scope.isArr = false;
			$("#s56 option").each(function () {
				var vall = $(this).val();
				$scope.creditNodeNo += vall;
				$scope.arr02.push(vall);
			});	
			console.log($scope.creditNodeNo);
			for(var j=0;j<$scope.arr02.length;j++){
				$scope.creditNodeNo += $scope.arr02[j]+",";
			}
			$scope.quotaNodeInfo.creditNodeNo = $scope.creditNodeNo;
			
			
			$scope.linkedList[indexNo].creditNodeNo = $scope.creditNodeNo;
			$scope.safeApply();
			result.cancel();*/
			
			/*if($rootScope.quoteAll){
				for(var k=0;k<$rootScope.quoteAll.length;k++){
					for(var h=0;h<$scope.arr02.length;h++){
						if($rootScope.quoteAll[k].creditNodeNo == $scope.arr02[h]){
							$scope.selQuote={code:$rootScope.quoteAll[k].creditNodeNo,desc:$rootScope.quoteAll[k].creditDesc};
							$scope.selQuoteArr.push($scope.selQuote);
							$scope.selProQuote = {productObjectCode:$scope.itemList.productObjectCode,creditNodeNoList:$scope.selQuoteArr};
							if($rootScope.quoteSelected.length>0){
								for(var j=0;j<$rootScope.quoteSelected.length;j++){
									if($rootScope.quoteSelected[j].productObjectCode != $scope.itemList.productObjectCode){
										$scope.isArr = true;
									}else{
										$scope.isArr = false;
										$rootScope.quoteSelected[j].creditNodeNoList = $scope.selQuoteArr;
									}
								}
								if($scope.isArr){
									$rootScope.quoteSelected.push($scope.selProQuote);
								}
							}else{
								$rootScope.quoteSelected.push($scope.selProQuote);
							}
						}
					}
				}
			}*/
		};
	});
	//新增资金方信息
	webApp.controller('addFunderInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $timeout,
		$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.partnerItem =$scope.partnerInfo;
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.funderInfo={};
		$scope.funderInfo.fundsType = $scope.eventitem.fundsType;
		//是否本行资金
		$scope.isBankFundsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分润规则
		$scope.dividendRuleArr={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_distributionRules",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//多资金归属
		$scope.isRestIndArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//费用规则
		$scope.feeRulesArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_costRule",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//资金方编号下拉
		$scope.customerNumArr = { 
	        type:"dynamic", 
	        param:{
	        	status: '1'
	        },//默认查询条件 
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//根据选择资金方编号的条件筛选资金方名称
		var form = layui.form;
		form.on('select(getCustomerNum)',function(event){
			jfRest.request('partnersQuery', 'queryList',{}).then(function(data) {
				if (data.returnCode == '000000') {
					for(var i =0; i < data.returnData.rows.length; i++){
						if(data.returnData.rows[i]['corporationEntityNo'] == event.value){
							$scope.funderInfo.corporationEntityName = data.returnData.rows[i].corporationEntityName;
							//$scope.funderInfo.orgNum = data.returnData.rows[i].orgNum;
							$scope.funderInfo.partnerCategory = data.returnData.rows[i].partnerCategory;
							$scope.funderInfo.status = data.returnData.rows[i].status;
                        }
                    }
                }
			});
		});
	});
	//新增资金方账号信息
	webApp.controller('addCapitalAccountInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.accountInfo = {};
		//账号标志
		$scope.accountIndArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_accountMark",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//账号类型
		$scope.accountTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_accountType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//钞票标志
		$scope.cashOrRemitArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bankNote",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.accountInfo.cashOrRemit= '0';
			}	
		};
		//资金方名称下拉
		$scope.customerNameArr = { 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        desc:"corporationEntityName",  //
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        	$scope.corporationEntityNo	= $scope.selectItem.corporationEntityNo;
	        	$scope.corporationEntityName	= $scope.selectItem.corporationEntityName;
	        }
		};
		//根据选择资金方名称的条件筛选资金方编号
		var form = layui.form;
		form.on('select(getCustomerName)',function(event){
			jfRest.request('partnersQuery', 'queryList',{}).then(function(data) {
				if (data.returnCode == '000000') {
					for(var i =0; i < data.returnData.rows.length; i++){
						if(data.returnData.rows[i]['corporationEntityNo'] == event.value){
							$scope.corporationEntityName = data.returnData.rows[i].corporationEntityName;
                        }
                    }
                }
			});
		});
		//币种
		$scope.accountCcyArray = { 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"currencyDesc",
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"currency.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.accountInfo.accountCcy= '156';
	        }
		};
	});
	//资金协议 修改弹窗-2
	webApp.controller('updateCapitalAgreementCtrl', function($scope, $stateParams, jfRest,$http, $timeout,
			jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.updateInfo = $scope.updateCapitalInfo;
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationMode= $scope.updateCapitalInfo.operationMode;
	        }
	    };
		//币种
		$scope.accountCcyArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_RMB",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.accountCcy= $scope.updateCapitalInfo.currencyCode;
			}
		};
		//资金协议类型
		$scope.fundAgreementArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_fundAgreementType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: ['0','1','2'],
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.trustType= $scope.updateCapitalInfo.trustType;
			}
		};
		//出资类型
		$scope.capitalContributionArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_typesOfContribution",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.fundsType= $scope.updateCapitalInfo.fundsType;
			}	
		};
		//是否自动回转
		$scope.isAutoTranArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.isAutoTrun = $scope.updateCapitalInfo.isAutoTrun;
			}	
		};
		//是否多方
		$scope.isMultitrustArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.isMulitTrust = $scope.updateCapitalInfo.isMulitTrust;
			}	
		};
		//合作模式
		$scope.cooperatModelArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cooperationMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.cooperatModel = $scope.updateCapitalInfo.cooperatModel;
			}	
		};
		//清算模式   
		$scope.liquidationModeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_liquidationMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.clearMode = $scope.updateCapitalInfo.clearMode;
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
				//$scope.orgNum = $scope.updateCapitalInfo.orgNum;
				$scope.coArrayList = data;
	        	$timeout(function() {
            		Tansun.plugins.render('select');
				});
			}
		};
		//额度节点
		$scope.quoteArray = {
			type : "dynamic",
			param:{"authDataSynFlag":'1',
				"adjustFlag":'Y',
				"creditFlag":'Y',
				//"organNo":$scope.updateCapitalInfo.orgNum//默认查询条件 
	        },// 默认查询条件
			text : "creditDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "creditNodeNo", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "quotatree.queryList",// 数据源调用的action
			callback : function(data) {
				$scope.creditNodeNo = $scope.updateCapitalInfo.creditNodeNo;
				$timeout(function() {
            		Tansun.plugins.render('select');
				});
			}
		};
		/*------修改页--新增资金方信息------*/
		//修改页--新增资金方信息弹窗
		$scope.addFunderInfo = function(event){
			$scope.eventitem=event;
			if($scope.eventitem==undefined){
				jfLayer.fail(T.T("FQJ800007"));
			}else{
				// 页面弹出框事件(弹出页面);
				$scope.modal('/cstSvc/multiFundLoan/updateCapital/updateFunderInfo.html',$scope.eventitem,{
					title : T.T('FQJ800004'),
					buttons : [T.T('F00107'),T.T('F00012')],
					size : [ '1090px', '590px' ],
					callbacks : [$scope.saveFunderInfo]
				});
			}
		};
		//修改页--新增资金方回调函数
		$scope.updateListA = [];
		$scope.saveFunderInfo = function(result){
			$scope.updateFunderInfo = result.scope.updateFunderInfo;
			$scope.updateFunderInfo.corporationEntityName = result.scope.updateFunderInfo.corporationEntityName;
			$scope.updateFunderInfo.trustId = $scope.updateInfo.corporationEntityNo;
			$scope.updateListA.push(result.scope.updateFunderInfo);
			$scope.safeApply();
			result.cancel();
		};
		//列表信息
		$scope.updateList = function() {
			jfRest.request('fundcreation', 'details',$scope.updateCapitalInfo).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.listData = data.returnData.obj;
					$scope.updateListA = data.returnData.obj.coreBusTrustPersonList;
					$scope.selectedMonth = $scope.updateListA[0].corporationEntityNo;
					$scope.selectOne($scope.updateListA[0],0)
				} 
			});
		};
		$scope.updateList();
		//删除资金方信息
		$scope.deleteListA= function(list,index){
			$scope.updateListA.splice(index,1);
			$scope.coreTrustAccountList.splice(0,$scope.updateListB.length);
		};
		/*------修改页--新增资金方账号信息------*/
		//资金方信息获取单选值
		$scope.selectOne = function(list,index){
			$scope.coreTrustAccountList = $scope.updateListA[index].coreTrustAccountList;
		};
		//修改页--新增资金方账号信息
		$scope.updateCapitalAccount = function(item,index){
			$scope.selectOne(item,index);
			$scope.updateSelectItem={};
			$scope.updateSelectItem= item;
			$scope.updateSelectIndex=index;
			if($scope.updateSelectItem==undefined){
				jfLayer.fail(T.T("FQJ800002"));
			}
			//暂时注释
			/*if(item.hasOwnProperty('coreTrustAccountList')){
				if(item.coreTrustAccountList.length >=4){
					jfLayer.fail(T.T("FQJ800012"));
					return;
				}
			}*/
			// 页面弹出框事件(弹出页面);
			$scope.modal('/cstSvc/multiFundLoan/updateCapital/updateCapitalAccountInfo.html',$scope.updateSelectItem,{
				title : T.T('FQJ800005'),
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1090px', '590px' ],
				callbacks : [$scope.saveCapitalAccount]
			});
		};
		//修改页--新增资金方账号信息回调
		$scope.coreTrustAccountList= [];
		$scope.saveCapitalAccount = function(result){
			$scope.updateAccountInfo = result.scope.updateAccountInfo;
			$scope.updateAccountInfo.corporationEntityName = result.scope.corporationEntityName;
			$scope.updateAccountInfo.corporationEntityNo= result.scope.corporationEntityNo;
			$scope.updateAccountInfo.trustPersonId = result.scope.corporationEntityNo;
			if($scope.updateListA[$scope.updateSelectIndex].hasOwnProperty("coreTrustAccountList")){
				$scope.updateListA[$scope.updateSelectIndex].coreTrustAccountList.push(result.scope.updateAccountInfo);
			}else{
				$scope.updateListA[$scope.updateSelectIndex].coreTrustAccountList = [result.scope.updateAccountInfo];
			}
			$scope.coreTrustAccountList=$scope.updateListA[$scope.updateSelectIndex].coreTrustAccountList;
			$scope.safeApply();
			result.cancel();  
		};
		//删除资金方账号信息
		$scope.deleteListB= function(item,index){
			$scope.coreTrustAccountList.splice(index,1);
		};
		
		//===================产品额度节点
		//查询产品
		$scope.updateQuotaNodeTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//关联产品
		$scope.saveSelect = function(event) {
			var isTip = false; // 是否提示
			var tipStr = "";
			if (!$scope.updateQuotaNodeTable.validCheck()) {
				return;
            }
            var items = $scope.updateQuotaNodeTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false; // 是否存在
				for (var k = 0; k < $rootScope.linkedList.length; k++) {
					if (items[i].productObjectCode == $rootScope.linkedList[k].productObjectCode) { // 判断是否存在
						tipStr = tipStr + items[i].productObjectCode + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					$rootScope.linkedList.push(items[i]);
				}
			}
			if (isTip) {
				jfLayer.alert(T.T('PZJ100033')+ tipStr.substring(0,tipStr.length - 1)+ T.T('PZJ100032'));
			}
		};
		//删除关联
		$scope.removeSelect = function(index) {
			var checkId = index;
			$rootScope.linkedList.splice(checkId, 1);
		};
		//查询已关联产品
		$scope.querRelatedPro = function(){
			$scope.queryParam = {
				eventNo : $scope.updateCapitalInfo.eventNo,// $scope.item.eventNo,
				trustNum: $scope.updateCapitalInfo.trustNum
			};
			jfRest.request('productquota', 'details',$scope.queryParam).then( function(data) {
				if (data.returnCode == '000000') {
					if (!data.returnData || !data.returnData.rows) {
						$rootScope.linkedList = [];
					}else if(data.returnData.rows.length > 0){
						$rootScope.linkedList = data.returnData.rows;//赋值已关联产品
						console.log($rootScope.linkedList)
					}
				}
			});
		};
		$scope.querRelatedPro();
		//跳转额度节点弹框
		$scope.updateQuotaNode = function(item,index){
			if(item==''){
				jfLayer.alert(T.T('FQJ800017'));
				return;
            }
            $scope.quotaNodeInfo = item;
			$scope.quotaNodeInfo.operationMode = $scope.updateCapitalInfo.operationMode;
			$scope.quotaNodeInfo.trustNum = $scope.updateCapitalInfo.trustNum;
			$scope.quotaNodeInfo.indexNo = index;
			$scope.modal('/cstSvc/multiFundLoan/productQuotaNode/newQuotaNode.html', $scope.quotaNodeInfo, {
				title : T.T('FQJ800015'),
				buttons : [ T.T('F00107') , T.T('F00012') ],
				size : [ '1050px', '590px' ],
				callbacks : [$scope.updateQno]
			});
		};
//		$rootScope.quoteSelected = [];//已关联的额度节点存储，关联后再次点击修改，需要展示上次关联还未入库的额度节点
		//资方协议修改：额度节点确定回调
		$scope.updateQno = function(result){
			$scope.itemList = {};
			$scope.itemList = result.scope.quotaNodeInfo;
			var indexNo = result.scope.quotaNodeInfo.indexNo;
			$scope.creditNodeNo = "";
			$scope.selectedNodeList = [];
			$("#s56 option").each(function () {
				var vall = $(this).val();
				$scope.selectedNodeList.push(vall);
			});	
			//检查是否关联额度节点，必须关联额度节点
			if(!$scope.selectedNodeList || $scope.selectedNodeList.length == 0){
				jfLayer.alert("检查是否关联额度节点");
				return;
            }
            //双击点击确定去除节点去除节点
			 if($scope.quotaNodeInfo.creditNodeNoList && $scope.quotaNodeInfo.creditNodeNoList.length > 0){
				 for(var i = 0; i < $scope.quotaNodeInfo.creditNodeNoList.length; i++){
					 if($scope.deleNodeList && $scope.deleNodeList.length > 0){
						 for(var j = 0 ; j <  $scope.deleNodeList.length; j++) {
							 if($scope.deleNodeList[j] == $scope.quotaNodeInfo.creditNodeNoList[i].code){
								 $scope.quotaNodeInfo.creditNodeNoList.splice(1,i);
							 } 
						 }
                     }
                 }
             }
            $scope.creditNodeNo = $scope.selectedNodeList.join(",");
			$scope.linkedList[indexNo].creditNodeNo = $scope.creditNodeNo;
			console.log($rootScope.quoteAll);
			//给已关联产品添加已选的额度节点
			$scope.linkedList[indexNo].creditNodeNoList = [];
			angular.forEach($rootScope.quoteAll,function(quoteItem, m){
				if($scope.selectedNodeList && $scope.selectedNodeList.length > 0){//已选额度节点
					angular.forEach($scope.selectedNodeList,function(selectedNode, k){
						if(quoteItem.creditNodeNo == selectedNode){
							var selectedNode = {
								code: quoteItem.creditNodeNo,
								desc: quoteItem.creditDesc,
							};
							$scope.linkedList[indexNo].creditNodeNoList.push(selectedNode);
                        }
                    })
                }
            });
			$scope.safeApply();
			result.cancel();
		};
	});
	//修改页--新增资金方信息
	webApp.controller('updateFunderInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.partnerItem =$scope.partnerInfo;
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.updateFunderInfo={};
		$scope.updateFunderInfo.fundsType = $scope.eventitem;
		//是否本行资金
		$scope.isBankFundsArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//分润规则
		$scope.dividendRuleArr={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_distributionRules",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//多资金归属
		$scope.isRestIndArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//费用规则
		$scope.feeRulesArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_costRule",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//资金方名称下拉
		$scope.customerNameArr = { 
	        type:"dynamic", 
	        param:{
	        	status: '1'
	        },//默认查询条件 
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        desc:"corporationEntityNo",  //
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//根据选择资金方名称的条件筛选资金方编号
		var form = layui.form;
		form.on('select(getCustomerName)',function(event){
			jfRest.request('partnersQuery', 'queryList',{}).then(function(data) {
				if (data.returnCode == '000000') {
					for(var i =0; i < data.returnData.rows.length; i++){
						if(data.returnData.rows[i]['corporationEntityNo'] == event.value){
							$scope.updateFunderInfo.corporationEntityName = data.returnData.rows[i].corporationEntityName;
							//$scope.updateFunderInfo.orgNum = data.returnData.rows[i].orgNum;
							$scope.updateFunderInfo.partnerCategory = data.returnData.rows[i].partnerCategory;
							$scope.updateFunderInfo.status = data.returnData.rows[i].status;
                        }
                    }
                }
			});
		});
	});
	//修改页--新增资金方账号信息
	webApp.controller('updateCapitalAccountInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.updateAccountInfo = {};
		//账号标志
		$scope.accountIndArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_accountMark",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//账号类型
		$scope.accountTypeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_accountType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//钞票标志
		$scope.cashOrRemitArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_bankNote",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}	
		};
		//币种
		$scope.accountCcyArray = { 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"currencyCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"currencyDesc",
	        value:"currencyCode",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"currency.query",//数据源调用的action 
	        callback: function(data){
	        }
		};
		//资金方名称下拉
		$scope.customerNameArr = { 
	        type:"dynamicDesc", 
	        param:{},//默认查询条件 
	        text:"corporationEntityNo", //下拉框显示内容，根据需要修改字段名称 
	        desc:"corporationEntityName",  //
	        value:"corporationEntityNo",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"partnersQuery.queryList",//数据源调用的action 
	        callback: function(data){
	        	$scope.corporationEntityName = $scope.updateSelectItem.corporationEntityName;
				$scope.corporationEntityNo= $scope.updateSelectItem.corporationEntityNo;
	        }
		};
		//根据选择资金方名称的条件筛选资金方编号
		var form = layui.form;
		form.on('select(getCustomerName)',function(event){
			jfRest.request('partnersQuery', 'queryList',{}).then(function(data) {
				if (data.returnCode == '000000') {
					for(var i =0; i < data.returnData.rows.length; i++){
						if(data.returnData.rows[i]['corporationEntityNo'] == event.value){
							$scope.corporationEntityName = data.returnData.rows[i].corporationEntityName;
                        }
                    }
                }
			});
		});
	});
	//查询详情-3
	webApp.controller('viewFundAgreementCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");  
		$scope.detailsList = $scope.seeInfo;
		//运营模式
		$scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"productLine.queryMode",//数据源调用的action 
	        callback: function(data){
	        	$scope.operationMode= $scope.seeInfo.operationMode;
	        }
	    };
		$scope.accountCcyArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_RMB",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.accountCcy= $scope.seeInfo.currencyCode;
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
				//$scope.orgNum = $scope.seeInfo.orgNum;
			}
		};
		//资金协议类型
		$scope.fundAgreementArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_fundAgreementType",
				queryFlag : "children"
			},// 默认查询条件
			rmData: ['0','1','2'],
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.trustType= $scope.seeInfo.trustType;
			}
		};
		//出资类型
		$scope.capitalContributionArray={
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_typesOfContribution",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {
					$scope.fundsType= $scope.seeInfo.fundsType;
				}	
			};
		//是否自动回转
		$scope.isAutoTranArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.isAutoTrun= $scope.seeInfo.isAutoTrun;
			}
		};
		//是否多方
		$scope.isMultitrustArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_ZorO",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.isMulitTrust = $scope.seeInfo.isMulitTrust;
			}	
		};
		//合作模式
		$scope.cooperatModelArray={
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_cooperationMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.cooperatModel = $scope.seeInfo.cooperatModel;
			}	
		};
		//清算模式   
		$scope.liquidationModeArray = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_liquidationMode",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
				$scope.clearMode = $scope.seeInfo.clearMode;
			}
		};
		//运营模式
		 $scope.coArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.coArrayList = data;
	        	$scope.operationMode = $scope.seeInfo.operationMode;
	       }
	    };
		//请求接口数据
		$scope.detailsList = function() {
			jfRest.request('fundcreation', 'details',$scope.seeInfo).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.detailsList = data.returnData.obj;
					$scope.isListA = data.returnData.obj.coreBusTrustPersonList;
					$scope.selectedMonth = $scope.isListA[0].corporationEntityNo;
					$scope.selectOne($scope.isListA[0],0)
				} 
			});
		};
		$scope.detailsList();
		$scope.coreTrustAccountList = [];
		$scope.selectOne = function(list,index){
			$scope.coreTrustAccountList = $scope.isListA[index].coreTrustAccountList;
		};
		
		//已关联产品
		$scope.viewQuotaNodeTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0,
					trustNum: $scope.seeInfo.trustNum,
			}, // 表格查询时的参数信息productquota.details
			paging : true,// 默认true,是否分页
			resource : 'productquota.details',// 列表的资源
			checkBack: function(row) { //点击单行执行函数
				$scope.itemsList= row.creditNodeNoList;
				$scope.showDiv =true;
			},
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					if(data.returnData!=null){
						$scope.list={};
						$scope.list=data.returnData.rows;
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
							$scope.showDiv = false;
						}
					}
				}else{
					$scope.showDiv =false;
				}
			}
		};
		
	});
	
	// 额度节点修改-3
    webApp.controller('newQuotaNodeCtrl',function($scope, $stateParams,jfRest, $http, jfGlobal, $rootScope,$timeout, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_capitalAgreement');
        $translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
        $translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
        $translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
        $translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
        $translate.refresh();
        $scope.proLineInf = {};
//        $scope.quotaNodeInfolist = $scope.quotaNodeInfo;
         //第一步
		 $("#s55 option").remove();
		 $("#s56 option").remove();
		 //渲染两侧额度节点
		 $scope.renderNodes = function(){
			$scope.setparamss = {
				operationMode: $scope.quotaNodeInfo.operationMode
			};
			jfRest.request('quotaNode', 'query', $scope.setparamss).then(function(data) {
				$scope.allNode =data.returnData.rows;//左边框展示全部用
				$rootScope.quoteAll = data.returnData.rows;//获取所有额度节点，备用
				//渲染右侧已关联的额度节点
				if($scope.quotaNodeInfo.creditNodeNoList && $scope.quotaNodeInfo.creditNodeNoList.length > 0 ){
					$scope.linkedNodeList = $scope.quotaNodeInfo.creditNodeNoList;
					angular.forEach($scope.linkedNodeList,function(linkedNode, k){
						angular.element("#s56").append(
							"<option value='"+linkedNode.code+"'>"
							+linkedNode.code +"&nbsp;&nbsp;&nbsp;&nbsp;" +linkedNode.desc
							+"</option>"
						);
					});
				}else {
					$scope.linkedNodeList = [];
                }
                //渲染左侧额度节点，且去除右侧重复节点
			    var isrep;
			    angular.forEach($scope.allNode,function(nodeItem, i){//所有额度节点
			    	isrep = false;
			    	for(var k = 0; k < $scope.linkedNodeList.length; k++){//已关联额度节点
			    		if(nodeItem.creditNodeNo == $scope.linkedNodeList[k].code ){
		    				isrep = true;
				    		break;
                        }
                    }
                    if(!isrep){
			    		angular.element("#s55").append(
		    				"<option value='"+nodeItem.creditNodeNo+"'>"
		    				+nodeItem.creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+nodeItem.creditDesc
		    				+"</option>"
			    		);

}
                });
			});
		 };
		 $scope.renderNodes();
		
		/*----根据额度节点，和额度节点描述查询----*/
	 	$scope.queryBusinessList = function(){
			 $("#s55").empty();
			 $scope.setparamss = {
				operationMode : $scope.quotaNodeInfo.operationMode,
				creditNodeNo: $scope.proLineInf.creditNodeNo,
				creditDesc: $scope.proLineInf.creditDesc
	 		};
			jfRest.request('quotaNode', 'query', $scope.setparamss).then(function(data) {
				 var a = data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s56 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				  if(n !=undefined && a !=null){
						//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].creditNodeNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
				    	}
                    }
                  }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s55").append("<option value='"+a[j].creditNodeNo+"'>"+a[j].creditNodeNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].creditDesc+"</option>"); 
					   }
			      }
			});
		};
		$("#s55").dblclick(function(){  
			 var alloptions = $("#s55 option");  
			 var so = $("#s55 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				$("#s56").append(so);  
			 }
		});  
		$scope.deleNodeList = [];//存放双击删除的节点；
		$("#s56").dblclick(function(){  
			 var alloptions = $("#s56 option");  
			 var so = $("#s56 option:selected"); 
			 var val = $(this).val();
			 $scope.deleNodeList.push(val);
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				 $("#s55").append(so);  
			 }
		});  
		$("#add55").click(function(){  
			 var alloptions = $("#s55 option");  
			 var so = $("#s55 option:selected");  
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{		
				$("#s56").append(so); 
			 }
		});  
		$("#remove55").click(function(){  
			 var alloptions = $("#s56 option");  
			 var so = $("#s56 option:selected"); 
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }else{
				$("#s55").append(so);
			 }
		}); 
		$("#s56").click(function(){  
			var so = $("#s56 option:selected");
			 if(so.length != 1){
				 jfLayer.fail(T.T('F00176'));      //'请选择一条记录');'请选择一条记录');

			 }
		});
		$("#addall55").click(function(){  
			$("#s56").append($("#s55 option").attr("selected",true));  
		});  
		$("#removeall55").click(function(){  
			$("#s55").append($("#s56 option").attr("selected",true));  
		}); 
	});	
	
});