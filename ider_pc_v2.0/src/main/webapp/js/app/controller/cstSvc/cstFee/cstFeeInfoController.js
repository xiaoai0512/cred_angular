'use strict';
define(function(require) {

	var webApp = require('app');

	//客户定价标签查询
	webApp.controller('cstFeeInfoCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstFee/i18n_cstFee');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translatePartialLoader.addPart('pages/cstSvc/cstFeeWaiveList/i18n_cstFeeWaiveList');
		$translate.refresh();
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		
    	
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
			
			$scope.cstFeeInfoTable.params.idNumber = '';
			
			if(data.value == "1"){//身份证
				$("#cstFeeInfo_idNumber").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#cstFeeInfo_idNumber").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#cstFeeInfo_idNumber").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#cstFeeInfo_idNumber").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#cstFeeInfo_idNumber").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#cstFeeInfo_idNumber").attr("validator","id_isPermanentReside")
            }
        });
		$scope.productShow = false;
			//产品
		$scope.proArray ={};
		 form.on('select(getProduct)',function(event){
			 if(event.value=='P'){
				 $scope.productShow = true;
				 if( ($scope.cstFeeInfoTable.params.idType==null || $scope.cstFeeInfoTable.params.idType== "" || $scope.cstFeeInfoTable.params.idType==undefined ) && 
							($scope.cstFeeInfoTable.params.customerNo==null || $scope.cstFeeInfoTable.params.customerNo== "" || $scope.cstFeeInfoTable.params.customerNo==undefined ) && 
							($scope.cstFeeInfoTable.params.idNumber==null || $scope.cstFeeInfoTable.params.idNumber== "" || $scope.cstFeeInfoTable.params.idNumber==undefined ) && 
							($scope.cstFeeInfoTable.params.externalIdentificationNo==null || $scope.cstFeeInfoTable.params.externalIdentificationNo== "" || $scope.cstFeeInfoTable.params.externalIdentificationNo==undefined )){
						jfLayer.fail(T.T('F00076'));//"请输入任意查询条件"
						$scope.isShow = false;
					}else {
						if($scope.cstFeeInfoTable.params.idType){
							if($scope.cstFeeInfoTable.params.idNumber==null || $scope.cstFeeInfoTable.params.idNumber== "" || $scope.cstFeeInfoTable.params.idNumber==undefined ){
								jfLayer.alert(T.T('F00110'));//'请核对证件号码'
								$scope.isShow = false;
							}
						}else if($scope.cstFeeInfoTable.params.idNumber){
							if($scope.cstFeeInfoTable.params.idType==null || $scope.cstFeeInfoTable.params.idType== "" || $scope.cstFeeInfoTable.params.idType==undefined){
								jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
								$scope.isShow = false;
							}
						}
					}
					
				 $scope.proArray ={ 
					        type:"dynamicDesc", 
					        param:$scope.cstFeeInfoTable.params,//默认查询条件 
					        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
					        desc:"productDesc",
					        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
					        resource:"cstMediaList.queryProduct",//数据源调用的action 
					        callback: function(data){
					        }
					    };
			 }else{
				 $scope.productShow = false;
			 }
		 });
		
		 //查询类型下拉框
		 $scope.periodArray ={ 
			        type:"dictData", 
			        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
			        text:"codes", //下拉框显示内容，根据需要修改字段名称 
			        desc:"detailDesc",
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.cstFeeInfoTable.params.periodicFeeIdentifier = 'N'
			        }
			    };
		//查询周期费用
			$scope.cstFeeInfoTable = {
					params : $scope.queryParam = {}, // 表格查询时的参数信息
					paging : true,// 默认true,是否分页
					resource : 'cstFeeWaiveInf.query',// 列表的资源
					autoQuery:false,
					callback : function(data) { // 表格查询后的回调函数
						if(data.returnCode == '000000'){
							$scope.isShow = true;
			        	}else {
			        		$scope.isShow = false;
			        	}
					}
				};
		
		$scope.isShow = false;
		$scope.queryCstPrcgLblEnqr = function(){
			if( ($scope.cstFeeInfoTable.params.idType==null || $scope.cstFeeInfoTable.params.idType== "" || $scope.cstFeeInfoTable.params.idType==undefined ) && 
					($scope.cstFeeInfoTable.params.customerNo==null || $scope.cstFeeInfoTable.params.customerNo== "" || $scope.cstFeeInfoTable.params.customerNo==undefined ) && 
					($scope.cstFeeInfoTable.params.idNumber==null || $scope.cstFeeInfoTable.params.idNumber== "" || $scope.cstFeeInfoTable.params.idNumber==undefined ) && 
					($scope.cstFeeInfoTable.params.externalIdentificationNo==null || $scope.cstFeeInfoTable.params.externalIdentificationNo== "" || $scope.cstFeeInfoTable.params.externalIdentificationNo==undefined )){
				jfLayer.fail(T.T('F00076'));//"请输入任意查询条件"
				$scope.isShow = false;
			}
			else {
				if($scope.cstFeeInfoTable.params.idType){
					if($scope.cstFeeInfoTable.params.idNumber==null || $scope.cstFeeInfoTable.params.idNumber== "" || $scope.cstFeeInfoTable.params.idNumber==undefined ){
						jfLayer.alert(T.T('F00110'));//'请核对证件号码'
						$scope.isShow = false;
					}else {
						if($scope.cstFeeInfoTable.params.periodicFeeIdentifier){
							$scope.cstFeeInfoTable.search();
						}else{
							jfLayer.alert(T.T('KHH7000004'));//'请选择查询类型'
						}
					}
				}else if($scope.cstFeeInfoTable.params.idNumber){
					if($scope.cstFeeInfoTable.params.idType==null || $scope.cstFeeInfoTable.params.idType== "" || $scope.cstFeeInfoTable.params.idType==undefined){
						jfLayer.alert(T.T('F00109'));//"请核对证件类型！"
						$scope.isShow = false;
					}else {
						if($scope.cstFeeInfoTable.params.periodicFeeIdentifier){
							$scope.cstFeeInfoTable.search();
						}else{
							jfLayer.alert(T.T('KHH7000004'));//'请选择查询类型'
						}
					}
				}else {
					if($scope.cstFeeInfoTable.params.periodicFeeIdentifier){
						$scope.cstFeeInfoTable.search();
					}else{
						jfLayer.alert(T.T('KHH7000004'));//'请选择查询类型'
					}
				}
			}
			
		};
		
		
		//重置
		$scope.reset = function(){
			$scope.cstFeeInfoTable.params.idNumber = '';
			$scope.cstFeeInfoTable.params.externalIdentificationNo = '';
			$scope.cstFeeInfoTable.params.idType= '';
			$scope.cstFeeInfoTable.params.customerNo= '';
			$scope.cstFeeInfoTable.params ='';
			
			
			$scope.isShow = false;
			$scope.productShow = false;
			
			$('#cstFeeInfo_idNumber').attr('validator','noValidator');
			$('#cstFeeInfo_idNumber').removeClass('waringform');
		};

		//查看详细信息
		$scope.queryCustFeeInfo = function(event) {
			$scope.cusFeeInfo = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/cstFee/viewCstFeeInfo.html', $scope.cusFeeInfo, {
				title :T.T('KHH7000035'),// '客户费用收取信息'
				buttons : [ T.T('F00012')],//'关闭' 
				size : [ '1050px', '550px' ],
				callbacks : [ $scope.selectCorporat2 ]
			});
		};
		
		$scope.selectCorporat2 = function(result) {
			$scope.safeApply();
			result.cancel();
		}
		
	});
	
	webApp.controller('viewCstfeeInfoCtrl', function($scope, $stateParams,
			jfRest, $http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/cstFee/i18n_cstFee');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstPrcgLblEnqr');
		$translate.refresh();
		//查询类型下拉框
		 $scope.periodArray ={ 
			        type:"dictData", 
			        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
			        text:"codes", //下拉框显示内容，根据需要修改字段名称 
			        desc:"detailDesc",
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.periodicFeeIdentifierInfo = $scope.cusFeeInfo.periodicFeeIdentifier;
			        }
			    };
		$scope.detailView = $scope.cusFeeInfo;
		$scope.cycleFlagShow =false;
		 if($scope.cusFeeInfo.periodicFeeIdentifier =='C' || $scope.cusFeeInfo.periodicFeeIdentifier =='P'){
			 $scope.cycleFlagShow =true;
		}else{
			 $scope.cycleFlagShow =false;
		}
		 /*收取频率
		  * O-一次性收取：O,C-按周收取,y-按年收取*/
		 $scope.chargingFrequencyArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_chargingFrequency",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.chargingFrequency=$scope.cusFeeInfo.chargingFrequency;
	        }
		};
		
	});
});
