'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户职业信息查询维护
	webApp.controller('cstProfessionQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstProfessionInfEstb/i18n_cstProfessionQuery');
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
  				   	   	if($scope.eventList.search('BSS.UP.01.0130') != -1){    //修改
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
		$scope.searchCstProfessionQuery = function(){
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
        //查询客户职业资料信息
        $scope.itemList = {
            params :{
                "pageSize" : 10,
                "indexNo" : 0
            }, // 表格查询时的参数信息
            paging : true,// 默认true,是否分页
            resource : 'cstProfessionQuery.queryInf',// 列表的资源
            autoQuery : false,
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_position'],//查找数据字典所需参数
            transDict : ['position_positionDesc'],//翻译前后key
            callback : function(data) { // 表格查询后的回调函数
                if(data.returnCode == "000000"){
                    $scope.showItemList = true;
                }
                else{
                    $scope.showItemList = false;
                }
            }
        };
		//客户职业信息
		$scope.updateProfession = {
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
		$scope.updateProfessionInfo = function(item){
			$scope.csInfEstbInfo = $.parseJSON(JSON.stringify(item));
			$scope.modal('/cstSvc/cstProfessionInfEstb/checkCstProfessionQuery.html', $scope.csInfEstbInfo, {
				title :T.T('KHJ8100002'),// '详细信息',
				buttons : [ T.T('F00107'),T.T('F00108')],//'确定','取消'
				size : [ '800px', '400px' ],
				callbacks : [$scope.sureUpdateProfession]
			});
		};
		// 回调函数/确认按钮事件
		$scope.sureUpdateProfession = function(result) {
			$scope.updateProfessionParams = result.scope.csInfEstbInfo;
			console.log($scope.updateProfessionParams)
;			jfRest.request('cstProfessionQuery', 'updateProfession', $scope.updateProfessionParams)
			.then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));//"修改成功"
					$scope.itemList.search();
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		//新增
		$scope.newProfessionBtn = function(){
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
			jfRest.request('cstProfessionQuery', 'queryInf',params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.professionInfTableInfoObj ={
						idType : params.idType,
						idNumber : params.idNumber,
						externalIdentificationNo : params.externalIdentificationNo,
                        position : params.position,
                        corporationName : params.corporationName,
                        department : params.department,
                        station : params.station,
                        employmentYears : params.employmentYears,
                        employmentMonths : params.employmentMonths,
					};
					$scope.modal('/cstSvc/cstProfessionInfEstb/cstProfessionInfEstb.html', $scope.professionInfTableInfoObj,{
						title : T.T('KHJ8100003'),
						buttons : [T.T('F00107'),T.T('F00012')],
						size : [ '900px', '320px' ],
						callbacks : [$scope.newAddList]
					});
                }
            });
		};
		//新增回调函数
		$scope.newAddList = function (result){
			$scope.professionInfTable=[];
			$scope.professionInfTableInfo = result.scope.professionInfTableInfo;//弹框回调的数据professionInfTableInfo
			var professionInfTableInfoU = {};
			professionInfTableInfoU.position = result.scope.professionInfTableInfo.position;
            professionInfTableInfoU.corporationName = result.scope.professionInfTableInfo.corporationName;
			professionInfTableInfoU.department =result.scope.professionInfTableInfo.department;
			professionInfTableInfoU.station = result.scope.professionInfTableInfo.station;
			professionInfTableInfoU.employmentYears = result.scope.professionInfTableInfo.employmentYears;
			professionInfTableInfoU.employmentMonths = $scope.professionInfTableInfo.employmentMonths;
    		$scope.professionInfTable.push(professionInfTableInfoU);
    		$scope.professionInfTableInfo = $.extend($scope.professionInfTableInfo, $scope.params);
    		jfRest.request('cstProfessionQuery', 'queryAdd', $scope.professionInfTableInfo)
    		.then(function(data) {
						if (data.returnCode == '000000') {
							$scope.showItemList=true;
							jfLayer.success(T.T('F00032'));//"保存成功"
							result.scope.ProfessionInfoForm.$setPristine();
							$scope.safeApply();
							result.cancel();
							$scope.itemList.search();
                        }
                    });
		};
	});

    /*-----更新控制器-----*/
    webApp.controller('checkCstProfessionQueryCtrl', function($scope, $stateParams, jfRest,
                                                       $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
        $translate.use($scope.lang);
        $translatePartialLoader.addPart('pages/cstSvc/cstProfessionInfEstb/i18n_cstProfessionQuery');
        $translate.refresh();
        $scope.menuName = lodinDataService.getObject("menuName");
        $scope.csInfEstbInfo = $scope.csInfEstbInfo;

        //动态请求下拉框 职位类型
        $scope.positionTypeList ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_position",
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
	webApp.controller('cstProfessionInfEstbCtrlAdd', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstProfessionInfEstb/i18n_cstProfessionQuery');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		$scope.guarantorCertType = false;
		$scope.eventId = "BSS.AD.01.0130",
		$scope.professionInfTableInfo = $scope.professionInfTableInfoObj;//点击弹框传的参数
		$scope.professionInfTableInfo['eventId'] = $scope.eventId;
		$scope.params = {};
		$scope.professionInfTable=[];
        //动态请求下拉框 职位类型
        $scope.positionTypeList ={
            type:"dictData",
            param:{
                "type":"DROPDOWNBOX",
                groupsCode:"dic_position",
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
			$scope.showNewProfessionInfo = false;
			 var form = layui.form;
				form.on('select(getType)',function(event){
					if($scope.professionInfTableInfoObj.type == '4'){
						$scope.guarantorCertType = true;
					}
					else{
						$scope.guarantorCertType = false;
				}
			});
	});
});
