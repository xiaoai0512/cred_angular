'use strict';
define(function(require) {
	var webApp = require('app');
	// 账户基本信息
	webApp.controller('accBscInfCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_accBscInf');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.updBtnFlag = false;
		 $scope.hide_accBscInf = {};
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
		                                 {name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		                                 {name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		                                 {name : T.T('F00116') ,id : '4'} ,//中国护照
		                                 {name : T.T('F00117') ,id : '5'} ,//外国护照
		                                 {name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.itemList.params.idNumber = '';
			if(data.value == "1"){//身份证
				$("#accBscInf_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#accBscInf_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#accBscInf_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#accBscInf_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#accBscInf_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#accBscInf_idNumber").attr("validator","id_isPermanentReside");
			}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
				$("#accBscInf_idNumber").attr("validator","noValidator");
				$scope.accBscInfForm.$setPristine();
				$("#accBscInf_idNumber").removeClass("waringform ");
            }
        });
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
			   	   	if($scope.eventList.search('BSS.UP.01.0009') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
  				}
  			});
		//核算状态码 
		$scope.checkStatusCodeArr = [{name:T.T('KHJ4200001'),id:"0"},{name:T.T('KHJ4200002'),id:"1"},{name:T.T('KHJ4200003'),id:"2"}];
		$scope.deductWayArr = [{name:T.T('KHJ4200004'),id:"0"},{name:T.T('KHJ4200005'),id:"1"},{name:T.T('KHJ4200006'),id:"2"}];
		$scope.isShow = false;
		// 重置
		$scope.reset = function() {
			$scope.itemList.params.idType= '';
			$scope.itemList.params.customerNo= '';
			$scope.itemList.params.idNumber= '';
			$scope.itemList.params.externalIdentificationNo= '';
			$scope.isShow = false;
			$("#accBscInf_idNumber").attr("validator","noValidator");
			$("#accBscInf_idNumber").removeClass("waringform ");
		};
		$scope.queryitemList = function(){
			if(($scope.itemList.params.idType == "" || $scope.itemList.params["idType"] == null || $scope.itemList.params.idType == undefined) &&
					($scope.itemList.params.idNumber == "" || $scope.itemList.params["idNumber"] == null || $scope.itemList.params.idNumber == undefined) &&
					($scope.itemList.params.externalIdentificationNo =="" || $scope.itemList.params["externalIdentificationNo"] == null ||  $scope.itemList.params.externalIdentificationNo ==undefined)){
				$scope.isShow = false;
				jfLayer.fail(T.T('F00076'));//"输入查询条件"
			}
			else {
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.itemList.search();
					}
				}else {
					$scope.itemList.search();
				}
			}
		};
		//查询
		$scope.itemList = {
				params : $scope.queryParam = {
						"pageSize" : 10,
						"indexNo" : 0,
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'accBscInf.query',// 列表的资源
				autoQuery:false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == '000000'){
						//隐藏域赋值
						$scope.hide_accBscInf = $scope.itemList.params;
						$scope.isShow = true;
						if(!data.returnData.rows || data.returnData.rows.length == 0){
							data.returnData.rows = [];
						}
					}
				}
			};
		$scope.viewDetail = function(e){
			$scope.accBscInfInfoView = e;
			$scope.accBscInfInfoView = $.extend($scope.accBscInfInfoView, $scope.hide_accBscInf);
			//核算状态码
			if($scope.accBscInfInfoView.accountingStatusCode == 0){
				$scope.accBscInfInfoView.checkStatusCodeTrans =T.T('KHJ4200001');//"正常";
			}else if($scope.accBscInfInfoView.accountingStatusCode == 1){
				$scope.accBscInfInfoView.checkStatusCodeTrans =T.T('KHJ4200002');//"非应计";
			}else if($scope.accBscInfInfoView.accountingStatusCode == 2){
				$scope.accBscInfInfoView.checkStatusCodeTrans =T.T('KHJ4200003');//"核销";
            }
            //上一核算状态码
			if($scope.accBscInfInfoView.prevAccountingStatusCode == 0){
				$scope.accBscInfInfoView.prevCheckStatusCodeTrans =T.T('KHJ4200001');//"正常";
			}else if($scope.accBscInfInfoView.prevAccountingStatusCode == 1){
				$scope.accBscInfInfoView.prevCheckStatusCodeTrans =T.T('KHJ4200002');//"非应计";
			}else if($scope.accBscInfInfoView.prevAccountingStatusCode == 2){
				$scope.accBscInfInfoView.prevCheckStatusCodeTrans =T.T('KHJ4200003');//"核销";
            }
            //账户组织形式
			if($scope.accBscInfInfoView.accountOrganForm == "R"){
				$scope.accBscInfInfoView.accountOrganFormTrans =T.T('KHH4200010');//"循环";
			}else if($scope.accBscInfInfoView.accountOrganForm == "T"){
				$scope.accBscInfInfoView.accountOrganFormTrans =T.T('KHH4200011');//"交易";
            }
            //账户性质
			if($scope.accBscInfInfoView.businessDebitCreditCode=='C'){
				$scope.accBscInfInfoView.businessDebitCreditCodeTrans =T.T('KHJ4200004');//"贷记";
			}else if($scope.accBscInfInfoView.businessDebitCreditCode=='D'){
				$scope.accBscInfInfoView.businessDebitCreditCodeTrans =T.T('KHJ4200005');//"借记";
            }
            //账户状态
			if($scope.accBscInfInfoView.statusCode==1){
				$scope.accBscInfInfoView.statusCodeTrans =T.T('KHH4200014');//"活跃账户";
			}else if($scope.accBscInfInfoView.statusCode==2){
				$scope.accBscInfInfoView.statusCodeTrans =T.T('KHH4200015');//"非活跃账户";
			}else if($scope.accBscInfInfoView.statusCode==3){
				$scope.accBscInfInfoView.statusCodeTrans =T.T('KHH4200016');//"冻结账户";
			}else if($scope.accBscInfInfoView.statusCode==8){
				$scope.accBscInfInfoView.statusCodeTrans =T.T('KHH4200017');//"关闭账户";
			}else if($scope.accBscInfInfoView.statusCode==9){
				$scope.accBscInfInfoView.statusCodeTrans =T.T('KHH4200018');//"待删除账户";
            }
            $scope.modal('/cstSvc/accInfMgt/viewAccDetail-JY.html', $scope.accBscInfInfoView, {
				title : T.T('KHJ4200008'),//'账户基本信息',
				buttons : [ T.T('F00012') ],//'关闭'
				size : [ '800px', '620px' ],
				callbacks : []
			});
		};
		$scope.updateAccountInfo = function(e){
			$scope.accBscInfEdit = e;
			$scope.modal('/cstSvc/accInfMgt/editAccInfo.html-JY', $scope.accBscInfEdit, {
				title : T.T('KHJ4200007'),//'修改账户信息',
				buttons : [T.T('F00107'),T.T('F00108')  ],//'确定','取消'
				size : [ '800px', '300px' ],
				callbacks : [$scope.saveAcc]
			});
		};
		$scope.saveAcc = function(result){
			$scope.accBscInfEditInf = result.scope.accBscInfEdit;
			$scope.accBscInfEditInf = Object.assign($scope.accBscInfEditInf, $scope.hide_accBscInf);
			jfRest.request('accBscInf', 'updateAcc', $scope.accBscInfEditInf)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));//"修改成功"
					$scope.itemList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		}
	});
	//查询
	webApp.controller('viewAccDetailCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_accBscInf');
		$translate.refresh();
	});
	//修改
	webApp.controller('layerEditAccInfoCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_accBscInf');
		$translate.refresh();
		$scope.accBscInfEdit = $scope.accBscInfEdit;
	});
});
