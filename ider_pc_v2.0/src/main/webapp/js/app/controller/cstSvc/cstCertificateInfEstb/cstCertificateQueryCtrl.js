'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户证件信息查询维护
	webApp.controller('cstCertificateQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstCertificateInfEstb/i18n_cstCertificateQuery');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.updBtnFlag = false;
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
  				   	   	if($scope.eventList.search('BSS.UP.01.0131') != -1){    //修改
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
		$scope.searchcstCertificateQuery = function(){
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
        //查询客户证件资料信息
        $scope.itemList = {
//			checkType : 'radio',
            params :{
                "pageSize" : 10,
                "indexNo" : 0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            resource : 'cstCertificateQuery.queryInf',// 列表的资源
            autoQuery : false,
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_invalidFlag','dic_certificateType'],//查找数据字典所需参数
            transDict : ['idValidFlag_idValidFlagDesc','idType_certificateTypeDesc'],//翻译前后key
            callback : function(data) { // 表格查询后的回调函数
                if(data.returnCode == "000000"){
                    $scope.showItemList = true;
                }
                else{
                    $scope.showItemList = false;
                }
            }
        };
		//客户证件信息
		$scope.updateCertificate = {
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
		// 页面弹出框事件(弹出页面)修改
		$scope.updateCertificateInfo = function(item){
			$scope.csInfEstbInfo = $.parseJSON(JSON.stringify(item));
            $scope.modal('/cstSvc/cstCertificateInfEstb/checkCstCertificateQuery.html', $scope.csInfEstbInfo, {
				title :T.T('KHJ8200002'),// '详细信息',
				buttons : [ T.T('F00107'),T.T('F00108')],//'确定','取消'
				size : [ '800px', '400px' ],
				callbacks : [$scope.sureUpdateCertificate]
			});
        };
		// 回调函数/确认按钮事件
		$scope.sureUpdateCertificate = function(result) {
			$scope.updateCertificateParams =  result.scope.csInfEstbInfo;
            jfRest.request('cstCertificateQuery', 'updateCertificate', $scope.updateCertificateParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));//"修改成功"
					$scope.itemList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};

        // 页面弹出框事件(弹出页面)查看
        $scope.lookCertificateInfo = function(item){
            $scope.csInfEstbInfo = $.parseJSON(JSON.stringify(item));
            $scope.modal('/cstSvc/cstCertificateInfEstb/checkCstCertificateLook.html', $scope.csInfEstbInfo, {
                title :T.T('KHJ8200002'),// '详细信息',
                buttons : [ T.T('F00108')],//'确定','取消'
                size : [ '800px', '400px' ]
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
		$scope.newCertificateBtn = function(){
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
					$scope.CertificateInfTableInfoObj ={
                        customerNo : data.returnData.rows[0].customerNo,
                        idType : params.idType,
                        idNumber : params.idNumber,
					};
                    $scope.modal('/cstSvc/cstCertificateInfEstb/cstCertificateInfEstb.html', $scope.CertificateInfTableInfoObj,{
						title : T.T('KHJ8200003'),
						buttons : [T.T('F00107'),T.T('F00012')],
						size : [ '900px', '320px' ],
						callbacks : [$scope.newAddList]
					});
                }
            });
		};
		//新增回调函数
		$scope.newAddList = function (result){
			$scope.CertificateInfTable=[];
			$scope.cstCertificateInfEstbInfo = result.scope.cstCertificateInfEstbInfo;//弹框回调的数据cstCertificateInfEstbInfo
			var CertificateInfTableInfoU = {};
			CertificateInfTableInfoU.idType = result.scope.cstCertificateInfEstbInfo.idType;
			CertificateInfTableInfoU.idNumber = result.scope.cstCertificateInfEstbInfo.idNumber;
            CertificateInfTableInfoU.customerNo = result.scope.cstCertificateInfEstbInfo.customerNo;
			CertificateInfTableInfoU.countryId =result.scope.cstCertificateInfEstbInfo.countryId;
			CertificateInfTableInfoU.idIssueAuthority = result.scope.cstCertificateInfEstbInfo.idIssueAuthority;
			CertificateInfTableInfoU.idEffectiveDate = result.scope.cstCertificateInfEstbInfo.idEffectiveDate;
            CertificateInfTableInfoU.idExpiryDate = $scope.cstCertificateInfEstbInfo.idExpiryDate;
            CertificateInfTableInfoU.idValidFlag = $scope.cstCertificateInfEstbInfo.idValidFlag;
    		$scope.CertificateInfTable.push(CertificateInfTableInfoU);
            $scope.cstCertificateInfEstbInfo = $.extend(CertificateInfTableInfoU, $scope.params);
            jfRest.request('cstCertificateQuery', 'queryAdd', $scope.cstCertificateInfEstbInfo)
    		.then(function(data) {
						if (data.returnCode == '000000') {
							$scope.showItemList=true;
							jfLayer.success(T.T('F00032'));//"保存成功"
							result.scope.CertificateInfoForm.$setPristine();
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
                        }
                    });
		};
	});

    // /*-----更新控制器-----*/
    webApp.controller('checkCstCertificateQueryCtrl', function($scope, $stateParams, jfRest,
                                                       $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/cstSvc/cstCertificateInfEstb/i18n_cstCertificateQuery');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        //是否有效
        $scope.idValidFlag ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_invalidFlag",
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

    });
    // /*-----查看控制器-----*/
    webApp.controller('checkCstCertificateLookCtrl', function($scope, $stateParams, jfRest,
                                                               $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/cstSvc/cstCertificateInfEstb/i18n_cstCertificateQuery');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        CertificateInfTableInfoU.idType = "1";
        //是否有效
        $scope.idValidFlag ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_invalidFlag",
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

    });
    /*-----新增控制器-----*/
	webApp.controller('cstCertificateInfEstbCtrlAdd', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstCertificateInfEstb/i18n_cstCertificateQuery');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
		$scope.guarantorCertType = false;
		$scope.cstCertificateInfEstbInfo = {
			customerNo : $scope.customerNo,
		};
		$scope.eventId = "BSS.AD.01.0131",
		$scope.cstCertificateInfEstbInfo = $scope.CertificateInfTableInfoObj;//点击弹框传的参数
		$scope.cstCertificateInfEstbInfo['eventId'] = $scope.eventId;
		$scope.params = {};
		$scope.CertificateInfTable=[];
        //是否有效
        $scope.idValidFlag ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_invalidFlag",
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
	});
});
