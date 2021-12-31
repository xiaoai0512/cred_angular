'use strict';
define(function(require) {
	var webApp = require('app');
	// 核算处理查询
	webApp.controller('accProcesseListCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, 
			$location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName"); 
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
		 $scope.delBtnFlag = false;
		 $scope.isShow = false;
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
			   	  /* 	if($scope.eventList.search('COS.AD.02.0060') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}*/
			   		if($scope.eventList.search('COS.IQ.01.0014') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   		/*if($scope.eventList.search('ISS.BH.10.0055') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}*/
  				}
  			});
  			$scope.reset= function(){
  				$scope.accProcesseList.params.operationMode = '';
  				$scope.accProcesseList.params.globalSerialNumber = '';
  				$scope.accProcesseList.params.idType = '';
  				$scope.accProcesseList.params.idNumber = '';
  				$scope.accProcesseList.params.externalIdentificationNo = '';
  				 $scope.isShow=false;
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
  				        	console.log(data)
  				        }
  			};
		//映射维度 MODP（产品对象）MODT（业务类型）
		$scope.instanDimenArr = [{name : 'MODP（产品对象）' ,id : 'MODP'},{name : 'MODT（业务类型）' ,id : 'MODT'}] ;
		//运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.queryMode",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//联动验证
			var form = layui.form;
			form.on('select(getIdType)',function(data){
				$scope.accProcesseList.params.idNumber = '';
				if(data.value == "1"){//身份证
					$("#accProcesse_idNumber").attr("validator","id_idcard");
				}else if(data.value == "2"){//港澳居民来往内地通行证
					$("#accProcesse_idNumber").attr("validator","id_isHKCard");
				}else if(data.value == "3"){//台湾居民来往内地通行证
					$("#accProcesse_idNumber").attr("validator","id_isTWCard");
				}else if(data.value == "4"){//中国护照
					$("#accProcesse_idNumber").attr("validator","id_passport");
				}else if(data.value == "5"){//外国护照passport
					$("#accProcesse_idNumber").attr("validator","id_passport");
				}else if(data.value == "6"){//外国人永久居留证
					$("#accProcesse_idNumber").attr("validator","id_isPermanentReside");
				}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
					$("#accProcesse_idNumber").attr("validator","noValidator");
					$scope.accProcesseForm.$setPristine();
					$("#accProcesse_idNumber").removeClass("waringform ");
                }
            });
			$scope.queryList = function(){
				if(($scope.accProcesseList.params.idType == "" || $scope.accProcesseList.params.idType == undefined)  &&
						($scope.accProcesseList.params.customerNo == "" || $scope.accProcesseList.params.customerNo == undefined)  &&
						($scope.accProcesseList.params.idNumber == "" || $scope.accProcesseList.params.idNumber == undefined)  &&
						 ($scope.accProcesseList.params.externalIdentificationNo =="" || $scope.accProcesseList.params.externalIdentificationNo ==undefined)){
					$scope.isShow = false;
					jfLayer.fail(T.T('F00076'));//"请输入查询条件"
				}
				else {
					if($scope.accProcesseList.params["idType"]){
						if($scope.accProcesseList.params["idNumber"] == null || $scope.accProcesseList.params["idNumber"] == undefined || $scope.accProcesseList.params["idNumber"] == ''){
							jfLayer.alert(T.T('F00110'));//'请核对证件号码'
							$scope.isShow = false;
						}else {
							$scope.accProcesseList.search();
						}
					}else if($scope.accProcesseList.params["idNumber"]){
						if($scope.accProcesseList.params["idType"] == null || $scope.accProcesseList.params["idType"] == undefined || $scope.accProcesseList.params["idType"] == ''){
							jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
							$scope.isShow = false;
						}else {
							$scope.accProcesseList.search();
						}
					}else {
						$scope.accProcesseList.search();
					}
				}
			};
		//核算处理查询
		$scope.accProcesseList = {
			params : {
					pageSize:10,
					indexNo:0,
					modifyType: 'PART'
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery: false,
			resource : 'accountingMag.queryAccProcesse',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.isShow = true;
				}else {
					$scope.isShow = false;
					jfLayer.alert(data.returnCode+':'+data.returnMsg);
				}
			}
		};
		// 查看
		$scope.checkAccProcesseInf = function(event) {
			$scope.accProcesseInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/accountingMag/viewAccProcesse.html',
					$scope.accProcesseInf, {
						title : T.T('YYJ5400045'),
						buttons : [ T.T('F00012') ],
						size : [ '1050px', '500px' ],
						callbacks : []
					});
		};
	});
	//详情
	webApp.controller('viewAccProcesseCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"operationMode", //下拉框显示内容，根据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.queryMode",//数据源调用的action 
		        callback: function(data){
		        	//$scope.updateOperationMode = $scope.optModeInf2.operationMode;
		        	$scope.viewOperationMode = $scope.accProcesseInf.operationMode;
		        }
		    };
		$scope.accProcesseInf = $scope.accProcesseInf;
		//'记账标识 I：内部帐 L：科目',
		if($scope.accProcesseInf.accountingFlag == 'I') {
			$scope.accProcesseInf.accountingFlagTrans = T.T('YYJ5400022');	
		}else if($scope.accProcesseInf.accountingFlag == 'L'){
			$scope.accProcesseInf.accountingFlagTrans = T.T('YYJ5400023');
		}
		 //'借贷方向 D：借方 C：贷方',
		if($scope.accProcesseInf.drcrFlag == 'D') {
			$scope.accProcesseInf.drcrFlagTrans = T.T('YYJ200034');	
		}else if($scope.accProcesseInf.drcrFlag == 'C'){
			$scope.accProcesseInf.drcrFlagTrans = T.T('YYJ200034');
		}
	})
});
