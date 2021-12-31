'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户信息查询维护
	webApp.controller('cstContactQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstContactInfEstb/i18n_cstContactQuery');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.updBtnFlag = false
         $scope.selBtnFlag = false;
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
                $("#cstContactQuery_idNumber").attr("validator","id_idcard");
            }else if(data.value == "2"){//港澳居民来往内地通行证
                $("#cstContactQuery_idNumber").attr("validator","id_isHKCard");
            }else if(data.value == "3"){//台湾居民来往内地通行证
                $("#cstContactQuery_idNumber").attr("validator","id_isTWCard");
            }else if(data.value == "4"){//中国护照
                $("#cstContactQuery_idNumber").attr("validator","id_passport");
            }else if(data.value == "5"){//外国护照passport
                $("#cstContactQuery_idNumber").attr("validator","id_passport");
            }else if(data.value == "6"){//外国人永久居留证
                $("#cstContactQuery_idNumber").attr("validator","id_isPermanentReside");
            }else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
        		$("#cstContactQuery_idNumber").attr("validator","noValidator");
        		$scope.cstContactQueryForms.$setPristine();
        		$("#cstContactQuery_idNumber").removeClass("waringform ");
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
                        if($scope.eventList.search('BSS.IQ.01.0132') != -1){    //查询
                            $scope.selBtnFlag = true;
                        }
                        else{
                            $scope.selBtnFlag = false;
                        }
  				   	   	if($scope.eventList.search('BSS.UP.01.0132') != -1){    //修改
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
			$("#cstContactQuery_idNumber").attr("validator","noValidator");
			$("#cstContactQuery_idNumber").removeClass("waringform ");
		};
		$scope.searchCstContactQuery = function(){
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
		//查询客户联络人资料信息
		$scope.itemList = {
//			checkType : 'radio',
			params :{
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstContactQuery.queryInf',// 列表的资源
			autoQuery : false,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_contactCategory','dic_validFlag'],//查找数据字典所需参数
			transDict : ['contactCategory_contactCategoryDesc','validFlag_validFlagDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == "000000"){
					$scope.showItemList = true;
				}
				else{
					$scope.showItemList = false;
				}
			}
		};
        // 查看客户联络人详细信息
        $scope.selCstContactInfo = function(event) {
            $scope.contactItem = {};
            $scope.contactItem = $.parseJSON(JSON.stringify(event));
            // 页面弹出框事件(弹出页面)
            $scope.modal('/cstSvc/cstContactInfEstb/cstContactView.html', $scope.contactItem, {
                title: T.T('KHJ6300002'),   //'客户联络人详细信息',
                buttons: [T.T('F00012')],
                size: ['800px', '320px'],
                callbacks: []
            });
        }
		//客户联络人信息修改
		$scope.updateCstContact = {
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
		$scope.updateCstContactInfo = function(item){
			$scope.csInfEstbInfo = $.parseJSON(JSON.stringify(item));
			if($scope.csInfEstbInfo.contactCategory == "DR" ){
				$scope.csInfEstbInfo.contactCategoryTrans = T.T('KHH6300013');//"直系亲属";
			}else if($scope.csInfEstbInfo.contactCategory == "OT" ) {
                $scope.csInfEstbInfo.contactCategoryTrans = T.T('KHH6300014');//"其他";
            }
           /* $scope.upContactCategoryArray  ={
                type:"dictData",
                param:{
                    "type":"DROPDOWNBOX",
                    groupsCode:"dic_contactCategory",
                    queryFlag: "children"
                },//默认查询条件
                text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
                value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
                resource:"paramsManage.query",//数据源调用的action
                callback: function(data){
                }
            };*/
			if ($scope.csInfEstbInfo.validFlag == 1 || $scope.csInfEstbInfo.validFlag == "1") {
                $scope.csInfEstbInfo.validFlagTrans = T.T('KHH6300016');//"无效";
            }else if ($scope.csInfEstbInfo.validFlag == 0 || $scope.csInfEstbInfo.validFlag == "0" ){
                $scope.csInfEstbInfo.validFlagTrans = T.T('KHH6300015');//"有效";
            }
            $scope.upValidFlagArray  ={
                type:"dictData",
                param:{
                    "type":"DROPDOWNBOX",
                    groupsCode:"dic_validFlag",
                    queryFlag: "children"
                },//默认查询条件
                text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
                value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
                resource:"paramsManage.query",//数据源调用的action
                callback: function(data){
                }
            };
            $scope.csInfEstbInfo.idType = $scope.itemList.params.idType;
			$scope.csInfEstbInfo.idNumber = $scope.itemList.params.idNumber;
			$scope.csInfEstbInfo.externalIdentificationNo = $scope.itemList.params.externalIdentificationNo;
			$scope.modal('/cstSvc/cstContactInfEstb/checkCstContactQuery.html', $scope.csInfEstbInfo, {
				title :T.T('KHJ6300004'),// '修改联络人信息',
				buttons : [ T.T('F00107'),T.T('F00108')],//'确定','取消'
				size : [ '800px', '400px' ],
				callbacks : [$scope.sureUpdateContact]
			});
		};
		// 回调函数/确认按钮事件
		$scope.sureUpdateContact = function(result) {
			$scope.updateContactParams = result.scope.csInfEstbInfo;
			jfRest.request('cstContactQuery', 'updateContact', $scope.updateContactParams)
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
		$scope.newContactBtn = function(){
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
					$scope.contactlInfTableInfoObj ={
							idType : params.idType,
							idNumber : params.idNumber,
							externalIdentificationNo : params.externalIdentificationNo,
							customerNo:data.returnData.rows[0].customerNo
					};
					$scope.modal('/cstSvc/cstContactInfEstb/cstContactInfEstb.html', $scope.contactlInfTableInfoObj,{
						title : T.T('KHJ6300003'),
						buttons : [T.T('F00107'),T.T('F00012')],
						size : [ '800px', '400px' ],
						callbacks : [$scope.newAddList]
					});
                }
            });
		};
		//新增回调函数
		$scope.newAddList = function (result){
			$scope.contactlInfTable=[];
			$scope.cstContactInfEstbInfo = result.scope.cstContactInfEstbInfo;//弹框回调的数据cstContactInfEstbInfo
			var contactlInfTableInfoU = {};
            contactlInfTableInfoU.contactCategory = result.scope.cstContactInfEstbInfo.contactCategory;
            contactlInfTableInfoU.name = result.scope.cstContactInfEstbInfo.name;
            contactlInfTableInfoU.relation =result.scope.cstContactInfEstbInfo.relation;
            contactlInfTableInfoU.handphone =result.scope.cstContactInfEstbInfo.handphone;
            contactlInfTableInfoU.telephoneCountry =result.scope.cstContactInfEstbInfo.telephoneCountry;
            contactlInfTableInfoU.telephoneZone =result.scope.cstContactInfEstbInfo.telephoneZone;
            contactlInfTableInfoU.telephoneNo =result.scope.cstContactInfEstbInfo.telephoneNo;
            contactlInfTableInfoU.telephoneNoExt =result.scope.cstContactInfEstbInfo.telephoneNoExt;
            contactlInfTableInfoU.validFlag =result.scope.cstContactInfEstbInfo.validFlag;

        	$scope.contactlInfTable.push(contactlInfTableInfoU);
        	$scope.cstContactInfEstbInfo.coreCoreCustomerContact = $scope.contactlInfTable;//地址信息list
        	$scope.cstContactInfEstbInfo = $.extend($scope.cstContactInfEstbInfo, $scope.params);
        	jfRest.request('cstInfBuild', 'saveContact', $scope.cstContactInfEstbInfo)
			.then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showItemList=true;
					jfLayer.success(T.T('F00032'));//"保存成功"
					result.scope.contactInfoForm.$setPristine();
					$scope.safeApply();
					result.cancel();
					$scope.itemList.search();
                }
            });
		};
	});
	webApp.controller('checkCstContactQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstContactInfEstb/i18n_cstContactQuery');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.csInfEstbInfo = $scope.csInfEstbInfo;
	});
    webApp.controller('cstContactViewCtrl', function($scope, $stateParams, jfRest,
            $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.contactItem = $scope.contactItem;
    });
	/*-----新增控制器-----*/
	webApp.controller('cstContactInfEstbCtrlAdd', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstContactInfEstb/i18n_cstContactQuery');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.guarantorCertType = false;
		$scope.cstContactInfEstbInfo = {
			customerNo : '',
		};
		$scope.eventId = "BSS.AD.01.0132",
		$scope.cstContactInfEstbInfo = $scope.contactlInfTableInfoObj;//点击弹框传的参数
		$scope.cstContactInfEstbInfo['eventId'] = $scope.eventId;
		$scope.params = {};
		$scope.contactlInfTable=[];
		//动态请求下拉框 联络人类别
        $scope.contactCategoryArray  ={
		    type:"dictData",
		    param:{
		    	"type":"DROPDOWNBOX",
		    	groupsCode:"dic_contactCategory",
		    	queryFlag: "children"
		    },//默认查询条件
		    text:"detailDesc", //下拉框显示内容，根据需要修改字段名称
		    value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		    resource:"paramsManage.query",//数据源调用的action
		    callback: function(data){
		    }
		};
        //动态请求下拉框 有效性标识
        $scope.validFlagArray  ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_validFlag",
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
