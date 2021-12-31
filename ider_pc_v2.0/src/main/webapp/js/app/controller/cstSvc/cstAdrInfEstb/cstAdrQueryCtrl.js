'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户信息查询维护
	webApp.controller('cstAdrQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstAdrInfEstb/i18n_cstAdrQuery');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.updBtnFlag = false;
		//搜索身份证类型
        $scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
										{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
										{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
										{name : T.T('F00116') ,id : '4'} ,//中国护照
										{name : T.T('F00117') ,id : '5'} ,//外国护照
										{name : T.T('F00118') ,id : '6'}  ];//外国人永久居留证
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
        	$scope.itemList.params.idNumber = '';
            if(data.value == "1"){//身份证
                $("#cstAdrQuery_idNumber").attr("validator","id_idcard");
            }else if(data.value == "2"){//港澳居民来往内地通行证
                $("#cstAdrQuery_idNumber").attr("validator","id_isHKCard");
            }else if(data.value == "3"){//台湾居民来往内地通行证
                $("#cstAdrQuery_idNumber").attr("validator","id_isTWCard");
            }else if(data.value == "4"){//中国护照
                $("#cstAdrQuery_idNumber").attr("validator","id_passport");
            }else if(data.value == "5"){//外国护照passport
                $("#cstAdrQuery_idNumber").attr("validator","id_passport");
            }else if(data.value == "6"){//外国人永久居留证
                $("#cstAdrQuery_idNumber").attr("validator","id_isPermanentReside");
            }else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#cstAdrQuery_idNumber").attr("validator","noValidator");
        		$scope.cstAdrQueryForms.$setPristine();
        		$("#cstAdrQuery_idNumber").removeClass("waringform ");
            }
        });
		 //根据菜单和当前登录者查询有权限的事件编号
		 	$scope.menuNoSel = $scope.menuNo;
			 $scope.paramsNo = {
					 menuNo:$scope.menuNoSel
			 };
  			jfRest.request('accessManage','selEvent',$scope.paramsNo).then(function(data) {
  				if(data.returnCode == '000000'){
  					if(data.returnData != null || data.returnData != ""){
  	  					for(var i=0;i<data.returnData.length;i++){
  	  	   					$scope.eventList += data.returnData[i].eventNo + ",";
  	  	   				}
  				   	   	if($scope.eventList.search('BSS.UP.01.0002') != -1){    //修改
  		   					$scope.updBtnFlag = true;
  		   				}
  		   				else{
  		   					$scope.updBtnFlag = false;
  		   				}
  	  				}
                }
            });
		$scope.showItemList = false;
		//重置
		$scope.reset = function() {
			$scope.itemList.params.idType = '';
			$scope.itemList.params.idNumber = '';
			$scope.itemList.params.externalIdentificationNo = '';
			$scope.itemList.params.customerNo = '';
			$scope.showItemList = false;
			$("#cstAdrQuery_idNumber").attr("validator","noValidator");
			$("#cstAdrQuery_idNumber").removeClass("waringform ");
		};
		$scope.searchCstAdrQuery = function(){
			if(($scope.itemList.params.idType == "" || $scope.itemList.params.idType == undefined ) &&
					($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined ) &&
				( $scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined) &&
				( $scope.itemList.params.customerNo == "" || $scope.itemList.params.customerNo == undefined)){
				$scope.showItemList = false;
				jfLayer.alert(T.T('F00076'));//请输入查询条件"
			}
			else {
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
					}else {
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
					}else {
						$scope.itemList.search();
					}
				}else {
					$scope.itemList.search();
				}
			}
		};
		//查询客户地址资料信息
		$scope.itemList = {
//			checkType : 'radio',
			params :{
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstAdrQuery.queryInf',// 列表的资源
			autoQuery : false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_addressType'],//查找数据字典所需参数
			transDict : ['type_typeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showItemList = true;
				}
				else{
					$scope.showItemList = false;
				}
			}
		};
		//客户地址信息修改
		$scope.updateCstAdr = {
			checkType : 'radio',
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstInfQuery.queryLev',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		// 页面弹出框事件(弹出页面)
		$scope.updateCstAdrInfo = function(item){
			$scope.csInfEstbInfo = $.parseJSON(JSON.stringify(item));
			if($scope.csInfEstbInfo.type == 1 || $scope.csInfEstbInfo.type == "1"){
				$scope.csInfEstbInfo.typeTrans = T.T('KHH3600009');//"邮寄地址";
			}else if($scope.csInfEstbInfo.type == 2 || $scope.csInfEstbInfo.type == "2"){
				$scope.csInfEstbInfo.typeTrans = T.T('KHH3600010');//"家庭地址";
			}else if($scope.csInfEstbInfo.type == 3 || $scope.csInfEstbInfo.type == "3"){
				$scope.csInfEstbInfo.typeTrans = T.T('KHH3600011');//"单位地址";
			}else if($scope.csInfEstbInfo.type == 4 || $scope.csInfEstbInfo.type == "4"){
				$scope.csInfEstbInfo.typeTrans = T.T('KHH3600012');//"担保人地址";
            }
            $scope.csInfEstbInfo.idType = $scope.itemList.params.idType;
			$scope.csInfEstbInfo.idNumber = $scope.itemList.params.idNumber;
			$scope.csInfEstbInfo.externalIdentificationNo = $scope.itemList.params.externalIdentificationNo;
			$scope.modal('/cstSvc/cstAdrInfEstb/checkCstAdrQuery.html', $scope.csInfEstbInfo, {
				title :T.T('KHJ3600002'),// '详细信息',
				buttons : [ T.T('F00107'),T.T('F00108')],//'确定','取消'
				size : [ '800px', '400px' ],
				callbacks : [$scope.sureUpdateAddr]
			});
		};
		// 回调函数/确认按钮事件
		$scope.sureUpdateAddr = function(result) {
			$scope.updateAdrrParams = result.scope.csInfEstbInfo;
			jfRest.request('cstAdrQuery', 'updateAdr', $scope.updateAdrrParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));//"修改成功"
					$scope.itemList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		$scope.showOtherInfo = false;//基本信息保存
		$scope.showCstRmrkInfo = false;//客户备注信息新增
		$scope.showCstPrcgLblInfo = false;//客户定价标签信息新增
		// 保存客户基本信息
		$scope.saveCsInfEstbInfo = function() {
			jfRest.request('gradeNature', 'queryExternalRating',
					Tansun.param($scope.csInfEstbInfo)).then(function(data) {
				if (data.status == 200) {
				}
			});
			$scope.showOtherInfo = true;
		};
		//新增
		$scope.newAdrBtn = function(){
			if(($scope.itemList.params.idType == "" || $scope.itemList.params.idType == undefined ) &&
				($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined ) &&
				($scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined) &&
				( $scope.itemList.params.customerNo == "" || $scope.itemList.params.customerNo == undefined)){
				jfLayer.alert(T.T('F00076'));//请输入任意查询条件"
				return false;
			}else {
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showItemList = false;
						return false;
					}else {
						$scope.isShowHandle($scope.itemList.params)
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showItemList = false;
						return false;
					}else {
						$scope.isShowHandle($scope.itemList.params)
					}
				}else {
					$scope.isShowHandle($scope.itemList.params)
				}
			}
		};
		$scope.isShowHandle = function(params){
			jfRest.request('cstInfQuery', 'queryInf',params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.adrlInfTableInfoObj ={
							idType : params.idType,
							idNumber : params.idNumber,
							externalIdentificationNo : params.externalIdentificationNo,
							customerNo:data.returnData.rows[0].customerNo
					};
					$scope.modal('/cstSvc/cstAdrInfEstb/cstAdrInfEstb.html', $scope.adrlInfTableInfoObj,{
						title : T.T('KHJ3600003'),
						buttons : [T.T('F00107'),T.T('F00012')],
						size : [ '900px', '320px' ],
						callbacks : [$scope.newAddList]
					});
                }
            });
		};
		//新增回调函数
		$scope.newAddList = function (result){
			$scope.adrlInfTable=[];
			$scope.cstAdrInfEstbInfo = result.scope.cstAdrInfEstbInfo;//弹框回调的数据cstAdrInfEstbInfo
			var adrlInfTableInfoU = {};
			adrlInfTableInfoU.type = result.scope.cstAdrInfEstbInfo.type;
			adrlInfTableInfoU.contactAddress = result.scope.cstAdrInfEstbInfo.contactAddress;
			adrlInfTableInfoU.contactPostCode =result.scope.cstAdrInfEstbInfo.contactPostCode;
			adrlInfTableInfoU.contactMobilePhone = result.scope.cstAdrInfEstbInfo.contactMobilePhone;
			adrlInfTableInfoU.city = result.scope.cstAdrInfEstbInfo.city;
			adrlInfTableInfoU.guarantorCertType = $scope.cstAdrInfEstbInfo.guarantorCertType;
			adrlInfTableInfoU.guarantorCertNo = $scope.cstAdrInfEstbInfo.guarantorCertNo;
			if($scope.cstAdrInfEstbInfo.type == "4"){
    			if(adrlInfTableInfoU.guarantorCertType == "" || adrlInfTableInfoU.guarantorCertType == undefined || adrlInfTableInfoU.guarantorCertType == "undefined"){
    				jfLayer.fail(T.T('KHJ3600004'));
    			}
    			else if(adrlInfTableInfoU.guarantorCertNo == "" || adrlInfTableInfoU.guarantorCertNo == undefined || adrlInfTableInfoU.guarantorCertNo == "undefined"){
    				jfLayer.fail(T.T('KHJ3600005'));
    			}else if(adrlInfTableInfoU.guarantorCertType != "" && adrlInfTableInfoU.guarantorCertType != undefined && adrlInfTableInfoU.guarantorCertType != "undefined" &&
    					adrlInfTableInfoU.guarantorCertNo != "" && adrlInfTableInfoU.guarantorCertNo != undefined && adrlInfTableInfoU.guarantorCertNo != "undefined"){
    				$scope.adrlInfTable.push(adrlInfTableInfoU);
    				$scope.cstAdrInfEstbInfo.coreCoreCustomerAddrs = $scope.adrlInfTable;//地址信息list
    				$scope.cstAdrInfEstbInfo = $.extend($scope.cstAdrInfEstbInfo, $scope.params);
    				jfRest.request('cstInfBuild', 'saveAddr', $scope.cstAdrInfEstbInfo)
    				.then(function(data) {
						if (data.returnCode == '000000') {
							$scope.showItemList=true;
							jfLayer.success(T.T('F00032'));//"保存成功"
							result.scope.addressInfoForm.$setPristine();
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
                        }
                    });
    			}
        	}else{
        		$scope.adrlInfTable.push(adrlInfTableInfoU);
        		$scope.cstAdrInfEstbInfo.coreCoreCustomerAddrs = $scope.adrlInfTable;//地址信息list
        		$scope.cstAdrInfEstbInfo = $.extend($scope.cstAdrInfEstbInfo, $scope.params);
        		jfRest.request('cstInfBuild', 'saveAddr', $scope.cstAdrInfEstbInfo)
				.then(function(data) {
					if (data.returnCode == '000000') {
						$scope.showItemList=true;
						jfLayer.success(T.T('F00032'));//"保存成功"
						result.scope.addressInfoForm.$setPristine();
						$scope.safeApply();
						result.cancel();
						$scope.itemList.search();
                    }
                });
        	}
		};
	});
	webApp.controller('checkCstAdrQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstAdrInfEstb/i18n_cstAdrQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.csInfEstbInfo = $scope.csInfEstbInfo;
	});
	webApp.controller('checkGuarantorCstAdrQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.csInfEstbInfo = $scope.csInfEstbInfo;
	});
	/*-----新增控制器-----*/
	webApp.controller('cstAdrInfEstbCtrlAdd', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstAdrInfEstb/i18n_cstAdrInfEstb');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.guarantorCertType = false;
		$scope.cstAdrInfEstbInfo = {
			customerNo : '',
		};
		$scope.eventId = "BSS.AD.01.0004",
		$scope.cstAdrInfEstbInfo = $scope.adrlInfTableInfoObj;//点击弹框传的参数
		$scope.cstAdrInfEstbInfo['eventId'] = $scope.eventId;
		$scope.params = {};
		$scope.adrlInfTable=[];
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
		                         		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		                        		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		                        		{name : T.T('F00116') ,id : '4'} ,//中国护照
		                        		{name : T.T('F00117') ,id : '5'} ,//外国护照
		                        		{name : T.T('F00118') ,id : '6'} ];//外国人永久居留证
//		 $scope.typeArray = [{name : T.T('KHH3400009') ,id : '1'},{name : T.T('KHH3400010') ,id : '2'},{name : T.T('KHH3400011') ,id : '3'},{name : T.T('KHH3400012') ,id : '4'}];//地址场景
		 //动态请求下拉框 地址类型
		 $scope.addressTypeArray  ={
			        type:"dictData",
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_addressType",
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
				$scope.params.idNumber = '';
				if(data.value == "1"){//身份证
					$("#cstAdr_idNumber").attr("validator","id_idcard");
				}else if(data.value == "2"){//港澳居民来往内地通行证
					$("#cstAdr_idNumber").attr("validator","id_isHKCard");
				}else if(data.value == "3"){//台湾居民来往内地通行证
					$("#cstAdr_idNumber").attr("validator","id_isTWCard");
				}else if(data.value == "4"){//中国护照
					$("#cstAdr_idNumber").attr("validator","id_passport");
				}else if(data.value == "5"){//外国护照passport
					$("#cstAdr_idNumber").attr("validator","id_passport");
				}else if(data.value == "6"){//外国人永久居留证
					$("#cstAdr_idNumber").attr("validator","id_isPermanentReside");
				}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
					$("#cstAdr_idNumber").attr("validator","noValidator");
					$scope.cstAdrQueryForm.$setPristine();
					$("#cstAdr_idNumber").removeClass("waringform ");
                }
            });
			$scope.showNewAdrInfo = false;
			 var form = layui.form;
				form.on('select(getType)',function(event){
					if($scope.adrlInfTableInfoObj.type == '4'){
						$scope.guarantorCertType = true;
					}
					else{
						$scope.guarantorCertType = false;
				}
			});
	});
});
