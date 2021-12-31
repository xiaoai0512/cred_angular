'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户信息查询维护
	webApp.controller('cstInfoMaintCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, filter,
							$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEnqrAndMnt');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	$scope.menuNo = lodinDataService.getObject("menuNo");
    	console.log( lodinDataService.getObject("menuName"));
		$scope.csInfParams = {};
		$scope.csInf = {};
		$scope.isShowCstIngDiv = false;
		//自定义下拉框
		//搜索身份证类型
		$scope.certificateTypeArray =  [ {name : T.T('F00113'),id : '1'},//身份证
	                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
	                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
	                                		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		$scope.genderArray = [ {name : T.T('KHJ3500001'), id : '2'}, {name : T.T('KHJ3500002'),id : '1'} ];
		$scope.fullPenaltySign = [ {name : T.T('KHJ3500003'), id : 'Y'}, {name : T.T('KHJ3500004'),id : 'N'} ];
		$scope.ResidenceeArray = [{name : T.T('KHJ3500005')  ,id : '1'},{name : T.T('KHJ3500006'),id : '2'},{name : T.T('KHJ3500007'),id : '3'}];//住宅性质
        $scope.jobLevelCodeArray = [{name : T.T('KHJ3500009')  ,id : '1'},{name : T.T('KHJ35000010'),id : '2'},{name : T.T('KHJ3500011'),id : '3'}];//职称级别
        $scope.guarantorLogoArray = [{name : T.T('KHJ3500012') ,id : '1'},{name : T.T('KHJ3500013'),id : '2'},{name : T.T('KHJ3500014'),id : '3'}];//担保人标识
        $scope.maritalStatusArray = [{name : T.T('KHJ3500015')  ,id : '1'},{name : T.T('KHJ3500016'),id : '2'},{name : T.T('KHJ3500017'),id : '3'},{name : T.T('KHJ3500018'),id : '4'}];//婚姻
        $scope.typeArray = [{name : T.T('KHJ3500019'),id : '1'},{name : T.T('KHJ3500020'),id : '2'},{name : T.T('KHJ3500021'),id : '3'}];//地址场景
        $scope.actionCode = [{name : '1' ,id : '1'},{name : '2' ,id : '2'},{name : '3' ,id : '3'},{name : '4' ,id : '4'}];//性别
        $scope.ccy = [{name : T.T('KHJ3500022'), id : 'CNY'}];
		$scope.personalCompanyType = [ {name : T.T('KHJ3500023'), id : '1'}, {name : T.T('KHJ3500024'),id : '2'} ];
		$scope.purchRemittSign = [ {name : T.T('KHJ3500025'), id : 'N'}, {name : T.T('KHJ3500026'),id : 'Y'} ];
		$scope.achFlag = [ {name : T.T('KHJ3500027'), id : '0'}, {name : T.T('KHJ3500028'),id : '1'}, {name : T.T('KHJ3500029'),id : '2'} ];//约定扣款方式
		$scope.ddType = [ {name : T.T('KHJ3500030'), id : '0'}, {name : T.T('KHJ3500031') ,id : '1'} ];//本行他行标识
		$scope.personCustomerStatus = [ {name : T.T('KHJ3500032'), id : '0'}, {name : T.T('KHJ3500033'),id : '1'} ];
		$scope.paymentMarkArray = [ {name : T.T('KHJ3500034'), id : '1'}, {name : T.T('KHJ3500035'),id : '2'} ];//还款选项
		//账单日
		$scope.statementDateArr =
									[ {name : '01', id : '01'}, {name : '02',id : '02'},{name : '03', id : '03'}, {name : '04',id : '04'},{name : '05',id : '05'},
		                            {name : '06', id : '06'}, {name : '07',id : '07'},{name : '08', id : '08'}, {name : '09',id : '09'},{name : '10',id : '10'},
		                            {name : '11', id : '11'}, {name : '12',id : '12'},{name : '13', id : '13'}, {name : '14',id : '14'},{name : '15',id : '15'},
		                            {name : '16', id : '16'}, {name : '17',id : '17'},{name : '18', id : '18'}, {name : '19',id : '19'},{name : '20',id : '20'},
		                            {name : '21', id : '21'}, {name : '22',id : '22'},{name : '23', id : '23'}, {name : '24',id : '24'},{name : '25',id : '25'},
		                            {name : '26', id : '26'}, {name : '27',id : '27'},{name : '28', id : '28'}];
		$scope.csInfEstbInfo = function() {
		};
		$scope.customerLevelTable = [];
		$scope.cstAdrInfoTable = [];
		$scope.cstRemarksTable = [];
		$scope.resultSel = false;
		//重置
		$scope.reset = function() {
			$scope.csInfParams.idType = '';
			$scope.csInfParams.idNumber = '';
			$scope.csInfParams.externalIdentificationNo = '';
			$scope.csInfParams.customerNo = '';
			$scope.resultSel = false;
			$("#csInfEnqr_idNumber").attr("validator","noValidator");
			$("#csInfEnqr_idNumber").removeClass("waringform ");
		};
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
	                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
	                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
	                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
	                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
	                                		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
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
		   	   		if($scope.eventList.search('BSS.IQ.01.0120') != -1){    //查询
	   					$scope.queryBtn = true;
	   				}
	   				else{
	   					$scope.queryBtn = false;
	   				}
				}
			});
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.csInfParams.idNumber = '';
			if(data.value == "1"){//身份证
				$("#csInfEnqr_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#csInfEnqr_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#csInfEnqr_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#csInfEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#csInfEnqr_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#csInfEnqr_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#csInfEnqr_idNumber").attr("validator","noValidator");
				$scope.cstInfMntQueryForm.$setPristine();
				$("#csInfEnqr_idNumber").removeClass("waringform ");
            }
        });
		// 查询客户基本信息
		$scope.queryCstInfo = function() {
			if(($scope.csInfParams.customerNo ==null || $scope.csInfParams.customerNo== undefined || $scope.csInfParams.customerNo== '')&&
					($scope.csInfParams.idType ==null || $scope.csInfParams.idType== undefined || $scope.csInfParams.idType== '')&&
					($scope.csInfParams.idNumber ==null || $scope.csInfParams.idNumber== undefined || $scope.csInfParams.idNumber== '')&&
					($scope.csInfParams.externalIdentificationNo ==null || $scope.csInfParams.externalIdentificationNo== undefined || $scope.csInfParams.externalIdentificationNo== '')){
				jfLayer.alert(T.T('KHJ3500036'));//"请输入查询条件！"
				return;
				$scope.resultSel = false;
			}else {
				if($scope.csInfParams["idType"]){
					if($scope.csInfParams["idNumber"] == null || $scope.csInfParams["idNumber"] == undefined || $scope.csInfParams["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
					}else {
						$scope.searchCstList($scope.csInfParams);
					}
				}else if($scope.csInfParams["idNumber"]){
					if($scope.csInfParams["idType"] == null || $scope.csInfParams["idType"] == undefined || $scope.csInfParams["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
					}else {
						$scope.searchCstList($scope.csInfParams);
					}
				}else {
					$scope.searchCstList($scope.csInfParams);
				}
			}
		};
		//查询客户信息表 弹窗
		$scope.searchCstList = function(params){
			//根据输入查询条件，判断是否弹窗：输入证件类型，查询有一条数据，不弹窗，多条，弹窗；  输入外部识别号不弹窗
			if($scope.csInfParams.externalIdentificationNo){
				$scope.searchCstInfByExterna(params);
			}else {
				jfRest.request('cstInfQuery', 'queryCstList',params).then(function(data) {
					if (data.returnCode == '000000') {
						if(data.returnData){
							if(data.returnData.rows && data.returnData.rows.length > 1){
								$scope.modal('/cstSvc/csInfEstb/layerCstInfList.html', params, {
									title : '客户信息表',
									buttons : ['确认','取消' ],
									size : [ '1100px', '500px' ],
									callbacks : [ $scope.cstInfoSure ]
								});
							}else if(data.returnData.rows && data.returnData.rows.length == 1){
								//根据证件号 查询出只有一条数据，则直接根据客户号显示客户信息
								$scope.item = data.returnData.rows[0];
								$scope.params = {
										idType: $scope.item.idType,
										idNumber: $scope.item.idNumber,
										customerName: $scope.item.customerName,
										customerNo: $scope.item.customerNo
								};
								$scope.searchCstInfById($scope.params);
							}
                        }
                    }
                });
			}
			/*jfRest.request('cstInfQuery', 'queryInf',params).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows[0].customerNo == null ||  data.returnData.rows[0].customerNo == ''){
						jfLayer.alert(T.T('KHJ3500037'));//"抱歉，没有此用户！"
						$scope.resultSel = false;
						$scope.csInf = {};
						$scope.cstRemarksTable = [];
						$scope.cstAdrInfoTable = [];
						$scope.customerLevelTable = [];
						$scope.listcoreCustomerRemarks = "";
					}else {
						$scope.safeApply();
						result.cancel();
						$scope.resultSel = true;
						$scope.csInf = data.returnData.rows[0];
						if(data.returnData.rows[0].listcoreCustomerRemarks){
							$scope.cstRemarksTable = data.returnData.rows[0].listcoreCustomerRemarks;
						}else {
							$scope.cstRemarksTable = [];
						};
						if(data.returnData.rows[0].coreCustomerAddrs){
							$scope.cstAdrInfoTable = data.returnData.rows[0].coreCustomerAddrs;
						}else {
							$scope.cstAdrInfoTable = [];
						};
						if(data.returnData.rows[0].coreCustomerUnifyInfos){
							$scope.customerLevelTable = data.returnData.rows[0].coreCustomerUnifyInfos;
						}else {
							$scope.customerLevelTable = [];
						};
						if(data.returnData.rows[0].coreCustomerAddrs){
							$scope.cstAdrInfoTable = data.returnData.rows[0].coreCustomerAddrs;
						}else {
							$scope.cstAdrInfoTable = [];
						};
						if(data.returnData.rows[0].listcoreCustomerRemarks){
							$scope.listcoreCustomerRemarks = data.returnData.rows[0].listcoreCustomerRemarks;
						}else {
							$scope.listcoreCustomerRemarks = [];
						};
					}
				}else{
					$scope.resultSel = false;
				}
			});*/
		};
		//确认客户信息
		$scope.cstInfoSure = function(result){
			 $scope.cstInfo = result.scope.cstInfoList.checkedList();
			 $scope.queryParams = {
				 idType: $scope.cstInfo.idType,
				 idNumber: $scope.cstInfo.idNumber,
				 customerName: $scope.cstInfo.customerName,
				customerNo: $scope.cstInfo.customerNo
			 };
			 $scope.searchCstInfById($scope.queryParams,result);
		 };
		 //根据外部识别号 查询客户信息
		 $scope.searchCstInfByExterna = function(params){
			 jfRest.request('cstInfQuery', 'queryInf',params).then(function(data) {
					if (data.returnCode == '000000') {
						if(data.returnData.rows[0].customerNo == null ||  data.returnData.rows[0].customerNo == ''){
							jfLayer.alert("抱歉，没有此用户！");//"抱歉，没有此用户！"
							$scope.resultSel = false;
							$scope.csInf = {};
							$scope.cstRemarksTable = [];
							$scope.cstAdrInfoTable = [];
							$scope.customerLevelTable = [];
							$scope.listcoreCustomerRemarks = "";
						}else {
							$scope.resultSel = true;
							$scope.csInf = data.returnData.rows[0];
							if(data.returnData.rows[0].listcoreCustomerRemarks){
								$scope.cstRemarksTable = data.returnData.rows[0].listcoreCustomerRemarks;
							}else {
								$scope.cstRemarksTable = [];
                            }
                            if(data.returnData.rows[0].coreCustomerAddrs){
								$scope.cstAdrInfoTable = data.returnData.rows[0].coreCustomerAddrs;
							}else {
								$scope.cstAdrInfoTable = [];
                            }
                            if(data.returnData.rows[0].coreCustomerUnifyInfos){
								$scope.customerLevelTable = data.returnData.rows[0].coreCustomerUnifyInfos;
							}else {
								$scope.customerLevelTable = [];
                            }
                            if(data.returnData.rows[0].coreCustomerAddrs){
								$scope.cstAdrInfoTable = data.returnData.rows[0].coreCustomerAddrs;
							}else {
								$scope.cstAdrInfoTable = [];
                            }
                            if(data.returnData.rows[0].listcoreCustomerRemarks){
								$scope.listcoreCustomerRemarks = data.returnData.rows[0].listcoreCustomerRemarks;
							}else {
								$scope.listcoreCustomerRemarks = [];
                            }
                        }
					}else{
						$scope.resultSel = false;
					}
				});
		 };
		 //根据证件类型和证件号码 查询客户基本信息
		 $scope.searchCstInfById = function(params,result){
			 jfRest.request('cstInfQuery', 'queryCstInfById',params).then(function(data) {
					if (data.returnCode == '000000') {
						if(data.returnData == null ||  data.returnData == '' || data.returnData== undefined){
							jfLayer.alert('抱歉，没有用户信息！');//"抱歉，没有此用户！"
							$scope.resultSel = false;
							$scope.csInf = {};
							$scope.cstRemarksTable = [];
							$scope.cstAdrInfoTable = [];
							$scope.customerLevelTable = [];
							$scope.listcoreCustomerRemarks = "";
						}else {
							if(result){
								$scope.safeApply();
								result.cancel();
                            }
                            $scope.resultSel = true;
							$scope.csInf = data.returnData;
							if(data.returnData.listcoreCustomerRemarks){
								$scope.cstRemarksTable = data.returnData.listcoreCustomerRemarks;
							}else {
								$scope.cstRemarksTable = [];
                            }
                            if(data.returnData.coreCustomerAddrs){
								$scope.cstAdrInfoTable = data.returnData.coreCustomerAddrs;
							}else {
								$scope.cstAdrInfoTable = [];
                            }
                            if(data.returnData.coreCustomerUnifyInfos){
								$scope.customerLevelTable = data.returnData.coreCustomerUnifyInfos;
							}else {
								$scope.customerLevelTable = [];
                            }
                            if(data.returnData.coreCustomerAddrs){
								$scope.cstAdrInfoTable = data.returnData.coreCustomerAddrs;
							}else {
								$scope.cstAdrInfoTable = [];
                            }
                            if(data.returnData.listcoreCustomerRemarks){
								$scope.listcoreCustomerRemarks = data.returnData.listcoreCustomerRemarks;
							}else {
								$scope.listcoreCustomerRemarks = [];
                            }
                        }
					}else{
						$scope.resultSel = false;
					}
				});
		 };
		// 客户级统一信息
		/*$scope.customerLevelTable = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstInfQuery.queryLev',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};*/
		$scope.showOtherInfo = false;// 基本信息保存
		$scope.showCstRmrkInfo = false;// 客户备注信息新增
		$scope.showCstPrcgLblInfo = false;// 客户定价标签信息新增
		// 保存客户基本信息
		$scope.saveCsInfEstbInfo = function() {
			/*
			 * jfRest.request('gradeNature',
			 * 'queryExternalRating',
			 * Tansun.param($scope.csInfEstbInfo)).then(function(data) {
			 * if (data.status == 200) { } });
			 */
			$scope.showOtherInfo = true;
		};
		/*// 4客户地址信息
		$scope.cstAdrInfoTable = {
			checkType : 'radio',
			params : {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstInfQuery.queryAdr',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};*/
		// 5 客户备注信息
		/*$scope.cstRemarksTable = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstInfQuery.queryRmk',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};*/
		// 新增标签信息
		$scope.cstRmrkInfoBtn = function() {
			$scope.showCstRmrkInfo = !$scope.showCstRmrkInfo;
		};
		// 客户备注信息模块 保存
		$scope.cstRmrkInfoObj = {};
		$scope.saveCstRmk = function() {
			var cstRmrkInfoObjU = {};
			cstRmrkInfoObjU.remarkInfo = $scope.cstRmrkInfoObj.remarkInfo;
			cstRmrkInfoObjU.lastUpdateUserid = $scope.cstRmrkInfoObj.lastUpdateUserid;
			cstRmrkInfoObjU.createRemarksTime = $scope.cstRmrkInfoObj.createRemarksTime;
			$scope.cstRemarksTable.push(cstRmrkInfoObjU);
			$scope.cstRmrkInfoObj = {};
			$scope.showCstRmrkInfo = false;
		};
		$scope.params = {};
		//提交
		$scope.submitAll = function(){
			// 去除对象中的coreCustomerAddrs 属性
			for(var key in $scope.csInf) {
				if(key = "coreCustomerAddrs"){
					delete($scope.csInf["coreCustomerAddrs"]);
				}
            }
            for(var key in $scope.csInf) {
				if(key = "coreCustomerUnifyInfos"){
					delete($scope.csInf["coreCustomerUnifyInfos"]);
				}
            }
            $scope.params = $scope.csInf;
			if ($scope.cstRmrkInfoTable && $scope.cstRemarksTable.length > 0) {
				$scope.params.coreCustomerRemarkss = $scope.cstRemarksTable;// 备注信息list
			} else {
				$scope.cstRmrkInfoTable = null;
				$scope.params.coreCustomerRemarkss = $scope.cstRemarksTable;
			}
			jfRest.request('cstInfQuery', 'submitAll', $scope.params).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00073'));//"提交成功"
					$scope.resultSel = false;
					$scope.csInf = {};
					$scope.cstRemarksTable = [];
					$scope.cstAdrInfoTable = [];
					$scope.customerLevelTable = [];
					$scope.listcoreCustomerRemarks = "";
				}
			});
		}
	});
	//客户信息表
	webApp.controller('layerCstInfListCtrl',function($scope, $stateParams, jfRest, $http, jfGlobal, filter,
			$rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEnqrAndMnt');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName");//菜单名
		console.log( lodinDataService.getObject("menuName"));
		$scope.csInfParams = $scope.csInfParams;
		$scope.cstInfoList = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0,
				idType : $scope.csInfParams.idType,
				idNumber : $scope.csInfParams.idNumber,
				externalIdentificationNo : $scope.csInfParams.externalIdentificationNo,
			},
			paging : true,
			resource : 'cstInfQuery.queryCstList',
			callback : function(data) {
				if(data.returnCode == '000000'){
					$scope.isShowAccountList = true;//账户信息表
				}else {
					$scope.isShowAccountList = false;//账户信息表
				}
			}
		};
	});
});
