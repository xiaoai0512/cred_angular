'use strict';
define(function(require) {

	var webApp = require('app');

	// 客户媒介视图
	webApp.controller('cstMediaCtr', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		
    	
    	//搜索身份证类型
				$scope.certificateTypeArray1 =[ {name : T.T('F00113'),id : '1'},//身份证
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
            		$("#cstMediaItem_idNumber").attr("validator","id_idcard");
            	}else if(data.value == "2"){//港澳居民来往内地通行证
            		$("#cstMediaItem_idNumber").attr("validator","id_isHKCard");
            	}else if(data.value == "3"){//台湾居民来往内地通行证
            		$("#cstMediaItem_idNumber").attr("validator","id_isTWCard");

            	}else if(data.value == "4"){//中国护照
            		$("#cstMediaItem_idNumber").attr("validator","id_passport");

            	}else if(data.value == "5"){//外国护照passport
            		$("#cstMediaItem_idNumber").attr("validator","id_passport");

            	}else if(data.value == "6"){//外国人永久居留证
            		$("#cstMediaItem_idNumber").attr("validator","id_isPermanentReside");

            	}else if(data.value == "0" || data.value == null || data.value == undefined || data.value == ""){//其他
            		$("#cstMediaItem_idNumber").attr("validator","noValidator");
            		$scope.cstMediaItemForm.$setPristine();
            		
            		$("#cstMediaItem_idNumber").removeClass("waringform ");
                }
            });
		// 主附标识
		$scope.mainAttachmentArray = [ {
			name : '主卡',
			id : '1'
		}, {
			name : '附属卡',
			id : '2'
		} ];
		$scope.stateArray = [ {name : T.T('KHJ5100001'),id : '1'}, //'新发'
		                      {name : T.T('KHJ5100002'),id : '2'},//'活跃'
		                      {name : T.T('KHJ5100003'),id : '3'},//'非活跃'
		                      {name : T.T('KHJ5100004'),id : '4'},//'已转出'
		                      {name : T.T('KHJ5100005'),id : '5'},//'换卡未激活'
		                      {name : T.T('KHJ5100006'),id : '8'},//'关闭'
		                      {name : T.T('KHJ5100007'),id : '9'}];//'待删除'

		$scope.isShow = false;
		
		
		
		// 重置
		$scope.reset = function() {
			$scope.itemList.params.idNumber= '';
			$scope.itemList.params.externalIdentificationNo= '';
			$scope.itemList.params.idType= '';
			$scope.itemList.params.customerNo= '';
			
			$scope.isShow = false;
			$("#cstMediaItem_idNumber").attr("validator","noValidator");
			$("#cstMediaItem_idNumber").removeClass("waringform ");
		};
		
		
		
		
		$scope.queryMediaInf = function(){
			if(($scope.itemList.params.idType == null || $scope.itemList.params.idType == ''|| $scope.itemList.params.idType == undefined) &&
					($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined )
					&&( $scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined)
				){
				$scope.isShow = false;
				jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
			}else {
				if($scope.itemList.params["idType"]){
					if($scope.itemList.params["idNumber"] == null || $scope.itemList.params["idNumber"] == undefined || $scope.itemList.params["idNumber"] == ''){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						$scope.isShow = true;
						$scope.itemList.search();
					}
				}else if($scope.itemList.params["idNumber"]){
					if($scope.itemList.params["idType"] == null || $scope.itemList.params["idType"] == undefined || $scope.itemList.params["idType"] == ''){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						$scope.isShow = true;
						$scope.itemList.search();
					}
					
				}else {
					$scope.isShow = true;
					$scope.itemList.search();
				}
			}
			
		};
		
		//查询
		$scope.itemList = {
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'cstMediaList.queryMedia',// 列表的资源
				autoQuery: false,
				callback : function(data) { // 表格查询后的回调函数
					if(data.returnCode == "000000"){
						$scope.isShow = true;
					}else{
						$scope.isShow = false;
					}
				}
			};
		
		$scope.checkMedia = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
//			$scope.item = event;
			$scope.modal('/cstSvc/unifiedVisualManage/cstMediaInf.html',
					$scope.item, {
						title : T.T('KHJ5100008'),//'客户媒介详情'
						buttons : [ T.T('F00012')],//'关闭' 
						size : [ '1050px', '500px' ],
						callbacks : [ $scope.callback ]
					});
		};
		$scope.callback = function(result) {
			$scope.safeApply();
			result.cancel();
		}
	});
	webApp.controller('checkCstMediaInfCtrl-JY', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
	
		
		$scope.checkCstMediaInf = $scope.item;
		
	});
});
