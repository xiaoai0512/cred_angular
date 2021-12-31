'use strict';
define(function(require) {
	var webApp = require('app');
//客户个性化元件新增
	webApp.controller('customizedComponentsAddCtrl-JY', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_customizedComponentsAdd');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.showDetail = false;
		$scope.queryParams = {};
		$scope.cstInf = {};
		$scope.reset = function(){
			$scope.queryParams.externalIdentificationNo = '';
			$scope.queryParams.idNumber = '';
			$scope.queryParams.idType= '';
			$scope.queryParams.customerNo= '';
			$scope.showDetail = false;
			$('#customized_idNumber').attr('validator','noValidator');
			$('#customized_idNumber').removeClass('waringform');
			 $rootScope.treeSelect = [];
		};
		//搜索身份证类型
		$scope.certificateTypeArray1 = [ {name : T.T('F00113'),id : '1'},//身份证
		                     			{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
		                     			{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
		                     			{name : T.T('F00116') ,id : '4'} ,//中国护照
		                     			{name : T.T('F00117') ,id : '5'} ,//外国护照
		                     			{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
		                     		];			
 		//联动验证
 		var form = layui.form;
 		form.on('select(getIdType)',function(data){
 			$scope.queryParams.idNumber = '';
 			if(data.value == "1"){//身份证
 				$("#customized_idNumber").attr("validator","id_idcard");
 			}else if(data.value == "2"){//港澳居民来往内地通行证
 				$("#customized_idNumber").attr("validator","id_isHKCard");
 			}else if(data.value == "3"){//台湾居民来往内地通行证
 				$("#customized_idNumber").attr("validator","id_isTWCard");
 			}else if(data.value == "4"){//中国护照
 				$("#customized_idNumber").attr("validator","id_passport");
 			}else if(data.value == "5"){//外国护照passport
 				$("#customized_idNumber").attr("validator","id_passport");
 			}else if(data.value == "6"){//外国人永久居留证
 				$("#customized_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		// 查询所有元件
		$scope.elmListT = {
			autoQuery: true,
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
					isSpecialFlag: 'Y'
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'cstComponents.queryList',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询执行函数
		$scope.searcheHandlee = function(params){
			jfRest.request('cstInfQuery', 'queryInf', params).then(function(data) {
				if (data.returnCode == '000000') {
					$scope.showDetail = true;
					$scope.cstInf.idType = data.returnData.rows[0].idType;
					$scope.cstInf.idNumber = data.returnData.rows[0].idNumber;
					$scope.cstInf.customerName = data.returnData.rows[0].customerName;
					$scope.cstInf.customerNo = data.returnData.rows[0].customerNo;
				}else{
					$scope.showDetail = false;
				}
			});
		};
		//查询
		$scope.searcheBtn= function(){
			if( ($scope.queryParams.idType == '' || $scope.queryParams.idType == null ||$scope.queryParams.idType == undefined) &&
					($scope.queryParams.customerNo == '' || $scope.queryParams.customerNo == null ||$scope.queryParams.customerNo == undefined) &&
					($scope.queryParams.idNumber == '' || $scope.queryParams.idNumber == null ||$scope.queryParams.idNumber == undefined) &&
				($scope.queryParams.externalIdentificationNo == '' || $scope.queryParams.externalIdentificationNo == null || $scope.queryParams.externalIdentificationNo == undefined)  ){
				jfLayer.alert(T.T('F00076'));//"请输入查询条件！"

			}else {
				if($scope.queryParams.idType){
					if($scope.queryParams.idNumber == '' || $scope.queryParams.idNumber == null ||$scope.queryParams.idNumber == undefined){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.showDetail = false;
					}else {
						$scope.searcheHandlee($scope.queryParams);
					}
				}else if($scope.queryParams.idNumber){
					if($scope.queryParams.idType == '' || $scope.queryParams.idType == null ||$scope.queryParams.idType == undefined){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.showDetail = false;
					}else {
						$scope.searcheHandlee($scope.queryParams);			
					}
				}else {
					$scope.searcheHandlee($scope.queryParams);
				}
			}
		};
		//運營模式
		 $scope.operationModeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
	        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"operationMode.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
		};
		 $scope.searchelmList = function(){
			//	$scope.elmListT.params.artifactNo = '';
			 	//$scope.elmListT.params.idNumber = $scope.queryParams.idNumber;
				$scope.elmListT.params.operationMode = $scope.cstInf.operationMode;
				$scope.elmListT.search();
			};
		// 保存按钮事件
			$scope.saveArtiEleRel = function() {
				if($rootScope.treeSelect.length == 0){
					jfLayer.alert(T.T('KHJ5500002'));//'请选择定制元件'
					return;
                }
                $scope.componentsInfo = $scope.cstInf;
				//$scope.componentsInfo =  Object.assign($scope.componentsInfo,)
				//保存事件
				$scope.componentsInfo.list = $rootScope.treeSelect;
				console.log($scope.componentsInfo);
				$scope.componentsInfo = $.extend($scope.componentsInfo , $scope.queryParams);
				jfRest.request('cstComponents', 'save', $scope.componentsInfo).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));//'保存成功'
						$scope.cstInf ="";
						$scope.showDetail = false;
					}
				});
			};
		 //关联
		 $rootScope.treeSelect = [];
			$scope.saveSelect = function(event) {
				var isTip = false;						//是否提示
				var tipStr = "";
				if (!$scope.elmListT.validCheck()) {
					return;
				}
				var items = $scope.elmListT.checkedList();
				for (var i = 0; i < items.length; i++) {
					items[i].effectDate = '';
					items[i].uneffectDate = '';
					var isExist = false;//是否存在
					for (var k = 0; k < $rootScope.treeSelect.length; k++) {
						var elementNo = items[i].elementNo.substring(0,8);
						var elementNoTree = $rootScope.treeSelect[k].elementNo.substring(0,8);
						if (elementNo == elementNoTree) {//判断是否存在
							tipStr = tipStr + elementNo + ",";
							isTip = true;
							isExist = true;
							break;
						}
					}
					if(!isExist){
						$rootScope.treeSelect.push(items[i]);	
					}
				}
				if(isTip){
					jfLayer.alert(tipStr.substring(0,tipStr.length-1) +T.T('PZJ600023'));
				}
			};
		// 上移
		$scope.exchangeSeqNoUp = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == 0) {
						jfLayer.fail(T.T('F00024'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i - 1];
					$rootScope.treeSelect[i - 1] = dataMap;
					break;
				}
			}
		};
		// 下移
		$scope.exchangeSeqNoDown = function(data) {
			for (var i = 0; i < $rootScope.treeSelect.length; i++) {
				if ($rootScope.treeSelect[i] == data) {
					if (i == $rootScope.treeSelect.length - 1) {// 判断第几条数据
						jfLayer.fail(T.T('F00025'));
						break;
					}
					var dataMap = $rootScope.treeSelect[i];
					$rootScope.treeSelect[i] = $rootScope.treeSelect[i + 1];
					$rootScope.treeSelect[i + 1] = dataMap;
					break;
				}
			}
		};
		// 删除关联元件
		$scope.removeSelect = function(data) {
			var checkId = data;
			$rootScope.treeSelect.splice(checkId, 1);
		};
		//修改关联元件
		$scope.updateSelect = function(data) {
			var checkId = data;
			console.log($rootScope.treeSelect[checkId]);
			$scope.selectInfo = $rootScope.treeSelect[checkId];
			$scope.modal('/cstSvc/cstPrcgLblEnqr/layerCstComponentsAdd.html', $scope.selectInfo, {
				title : T.T('KHJ5500001'),//'客户定制元件信息',
				buttons : [ T.T('F00107'),T.T('F00108')],//'确认','取消' 
				size : [ '700px', '250px' ],
				callbacks : [ $scope.sureCstComponent]
			});
		};
		$scope.sureCstComponent =  function(result) {
			$scope.item=result.scope.selectInfo;//选中列值
			for(var i= 0 ; i < $rootScope.treeSelect.length; i++){
				if($scope.item.elementNo == $rootScope.treeSelect[i].elementNo){
					$rootScope.treeSelect[i] = $scope.item;
				}
            }
            $scope.safeApply();
			result.cancel();
		};
	});
});
