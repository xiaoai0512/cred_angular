'use strict';
define(function(require) {
	var webApp = require('app');
	// 收费项目查询
	webApp.controller('payProjectQueryCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) { 
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.addBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0031') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0029') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
                    }
                    if($scope.eventList.search('COS.AD.02.0026') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
	   				
 				}
 			});
  			/*费用类别下拉框 :ANNF-年费,LCHG-延滞金,OVRF-超限费,CSHF-取现手续费,
  			 * TXNF-转账手续费,SVCF-服务费,ISSF-制卡费,CAMF-销户账户管理费*/
  			$scope.feeTypeArr ={ 
  		        type:"dictData", 
  		        param:{
  		        	"type":"DROPDOWNBOX",
  		        	groupsCode:"dic_costCategory",
  		        	queryFlag: "children"
  		        },//默认查询条件 
  		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
  		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
  		        resource:"paramsManage.query",//数据源调用的action 
  		        callback: function(data){
  		        }
  			};
		//收费项目列表
		$scope.payProList = {
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'feeProject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//日期控件
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#effectiveDate',
				//min:"2019-03-01",
				done: function(value, date) {
					endDate.config.min = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					endDate.config.start = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.effectiveDate = $("#effectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#expirationDate',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		//日期控件end
		// 查看
		$scope.checkPayPro = function(event) {
			$scope.payProInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewPayProject.html',
			$scope.payProInf, {
				title : T.T('PZJ1100020'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : []
			});
		};
		// 修改
		$scope.updateOptModeInf = function(event) {
			$scope.payProInf2 = $.parseJSON(JSON.stringify(event));
			for(var key in $scope.payProInf2){
				if($scope.payProInf2[key] == "null" ){
					$scope.payProInf2[key] = '';
				}
            }
            // 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/updatePayProject.html',
			$scope.payProInf2, {
				title : T.T('PZJ1100021'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.updatePayProject ]
			});
		};
		// 回调函数/确认按钮事件
		$scope.updatePayProject = function(result) {
			$scope.payProInf2.feeType=result.scope.feeType;
			$scope.payProInf2.triggerEventInteractMode=result.scope.triggerEventInteractMode;
			$scope.payProInf2.instanCode1=result.scope.instanCode1;
        	$scope.payProInf2.instanCode2=result.scope.instanCode2;
        	$scope.payProInf2.instanCode3=result.scope.instanCode3;
        	$scope.payProInf2.instanCode4=result.scope.instanCode4;
        	$scope.payProInf2.instanCode5=result.scope.instanCode5;
        	$scope.payProInf2.itemUse=result.scope.itemUse;
        	$scope.payProInf2.assessmentMethod=result.scope.assessmentMethod;
        	$scope.payProInf2.periodicFeeIdentifier=result.scope.periodicFeeIdentifier;
        	$scope.payProInf2.chargingFrequency=result.scope.chargingFrequency;
			jfRest.request('feeProject', 'update', $scope.payProInf2) .then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
					$scope.payProList.search();
				}
			});
		};
		//新增
		$scope.addpayPro = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/payProject.html','', {
				title : T.T('PZJ1100025'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.sureAddPayProject ]
			});
		};
		//新增业务项目
		$scope.sureAddPayProject  = function(result){
			$scope.payProInf = result.scope.payProInf;
			if($scope.payProInf.effectiveDate>$scope.payProInf.expirationDate){
				jfLayer.fail(T.T('PZJ1100019'));
				return;
			}
			for(var key in $scope.payProInf){
				if($scope.payProInf[key] == "null" || $scope.payProInf[key] == null){
					$scope.payProInf[key] = '';
				}
            }
            $scope.payProInf.feeItemNo = result.scope.feeItem + result.scope.feeItemNoHalf;
			console.log($scope.payProInf);
			jfRest.request('feeProject', 'save', $scope.payProInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.payProInf = '';
					$scope.safeApply();
					result.cancel();
					$scope.payProList.search();
				}
			});
		};
		//复制
		$scope.copyPayPro = function(event){
			$scope.payProInfCopy = {};
			$scope.payProInfCopy = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/copyPayProject.html',
			$scope.payProInfCopy, {
				title : T.T('PZJ1100029'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '500px' ],
				callbacks : [ $scope.sureCopyPayProject ]
			});
		};
		$scope.sureCopyPayProject = function(result){
			$scope.payProInf = {};
			$scope.payProInf = result.scope.payProInfCopy;
			$scope.payProInf.triggerEventInteractMode=result.scope.triggerEventInteractMode;
			$scope.payProInf.instanCode1=result.scope.instanCode1;
        	$scope.payProInf.instanCode2=result.scope.instanCode2;
        	$scope.payProInf.instanCode3=result.scope.instanCode3;
        	$scope.payProInf.instanCode4=result.scope.instanCode4;
        	$scope.payProInf.instanCode5=result.scope.instanCode5;
        	$scope.payProInf.itemUse=result.scope.itemUse;
        	$scope.payProInf.assessmentMethod=result.scope.assessmentMethod;
        	$scope.payProInf.periodicFeeIdentifier=result.scope.periodicFeeIdentifier;
        	$scope.payProInf.chargingFrequency=result.scope.chargingFrequency;
			$scope.payProInf.feeItemNo = result.scope.feeItemCopy + result.scope.feeItemNoCopyHalf;
			jfRest.request('feeProject', 'save', $scope.payProInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.safeApply();
					result.cancel();
					$scope.payProList.search();
				}
			});
		};
		//周期类费用标识
		 $scope.feeIdentifierArr = [{name : 'Y',id : 'Y'},{name : 'N', id : 'N'}];
		 /*收取频率
		  * O-一次性收取：O,C-按CYCLE收取,Y-按年收取*/
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
	        }
		};
		 /*实例化维度(1,2,3,4,5) MODT：业务类型,MODP：产品对象,MODM：媒介对象,CURR：币种,
		 * CHAN：渠道,TERM：期数,MODG:业务项目,INST:分期类型,FTYP:费用收取方式*/
		$scope.instanDimenArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_instanceDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.instanCode1=$scope.payProInf.instanCode1;
	        	$scope.instanCode2=$scope.payProInf.instanCode2;
	        	$scope.instanCode3=$scope.payProInf.instanCode3;
	        	$scope.instanCode4=$scope.payProInf.instanCode4;
	        	$scope.instanCode5=$scope.payProInf.instanCode5;
	        }
		};
		//项目用途C: 费用计算，P:费用入账
		 $scope.itemUseArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_projectUse",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.itemUse=$scope.payProInf.itemUse;
	        }
		};
	});
	//查询
	webApp.controller('viewPayProjectCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		//$scope.viewOperationDate = $scope.optModeInf1.operationDate;
		//$scope.viewLastProcessDate = $scope.optModeInf1.lastProcessDate;
		//查询类型下拉框
		 $scope.periodArray ={ 
		        type:"dictData", 
		        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
		        text:"codes", //下拉框显示内容，根据需要修改字段名称 
		        desc:"detailDesc",
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		$scope.chargingFrequencyShow =false;
		 if($scope.payProInf.periodicFeeIdentifier =='C' || $scope.payProInf.periodicFeeIdentifier =='P'){
			 $scope.chargingFrequencyShow =true;
		}else{
			 $scope.chargingFrequencyShow =false;
		}
		 /*费用类别下拉框 :ANNF-年费,LCHG-延滞金,OVRF-超限费,CSHF-取现手续费,
			 * TXNF-转账手续费,SVCF-服务费,ISSF-制卡费,CAMF-销户账户管理费*/
			$scope.feeTypeArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_costCategory",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeType=$scope.payProInf.feeType;
		        }
			};
			//触发方式
			$scope.wayArray ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ interactionType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.triggerEventInteractMode=$scope.payProInf.triggerEventInteractMode;
		        }
			};
			/*实例化维度(1,2,3,4,5) MODT：业务类型,MODP：产品对象,MODM：媒介对象,CURR：币种,
			 * CHAN：渠道,TERM：期数,MODG:业务项目,INST:分期类型,FTYP:费用收取方式*/
			$scope.instanDimenArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_instanceDimension",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.instanCode1=$scope.payProInf.instanCode1;
		        	$scope.instanCode2=$scope.payProInf.instanCode2;
		        	$scope.instanCode3=$scope.payProInf.instanCode3;
		        	$scope.instanCode4=$scope.payProInf.instanCode4;
		        	$scope.instanCode5=$scope.payProInf.instanCode5;
		        }
			};
			//项目用途C: 费用计算，P:费用入账
			 $scope.itemUseArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_projectUse",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.itemUse=$scope.payProInf.itemUse;
		        }
			};
			//计费方式 F：固定金额 M：费用矩阵
			$scope.assessmentMethodArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_billingMethod",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.assessmentMethod=$scope.payProInf.assessmentMethod;
		        }
			};
			//查询类型下拉框
			 $scope.periodArray ={ 
		        type:"dictData", 
		        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
		        text:"codes", //下拉框显示内容，根据需要修改字段名称 
		        desc:"detailDesc",
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.periodicFeeIdentifier=$scope.payProInf.periodicFeeIdentifier;
		        }
		    };
			 /*收取频率
			  * O-一次性收取：O,C-按CYCLE收取,Y-按年收取*/
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
		        	$scope.chargingFrequency=$scope.payProInf.chargingFrequency;
		        }
			};
			
	});
	//修改
	webApp.controller('updatePayProjectCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		 /*费用类别下拉框 :ANNF-年费,LCHG-延滞金,OVRF-超限费,CSHF-取现手续费,
		 * TXNF-转账手续费,SVCF-服务费,ISSF-制卡费,CAMF-销户账户管理费*/
		$scope.feeTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_costCategory",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeType=$scope.payProInf2.feeType;
	        }
		};
		//触发方式
		$scope.wayArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ interactionType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.triggerEventInteractMode=$scope.payProInf2.triggerEventInteractMode;
	        }
		};
		/*实例化维度(1,2,3,4,5) MODT：业务类型,MODP：产品对象,MODM：媒介对象,CURR：币种,
		 * CHAN：渠道,TERM：期数,MODG:业务项目,INST:分期类型,FTYP:费用收取方式*/
		$scope.instanDimenArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_instanceDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.instanCode1=$scope.payProInf2.instanCode1;
	        	$scope.instanCode2=$scope.payProInf2.instanCode2;
	        	$scope.instanCode3=$scope.payProInf2.instanCode3;
	        	$scope.instanCode4=$scope.payProInf2.instanCode4;
	        	$scope.instanCode5=$scope.payProInf2.instanCode5;
	        }
		};
		//项目用途C: 费用计算，P:费用入账
		 $scope.itemUseArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_projectUse",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.itemUse=$scope.payProInf2.itemUse;
	        }
		};
		//计费方式 F：固定金额 M：费用矩阵
		$scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.assessmentMethod=$scope.payProInf2.assessmentMethod;
	        }
		};
		//查询类型下拉框
		$scope.periodArray ={ 
	        type:"dictData", 
	        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
	        text:"codes", //下拉框显示内容，根据需要修改字段名称 
	        desc:"detailDesc",
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.periodicFeeIdentifier=$scope.payProInf2.periodicFeeIdentifier;
	        }
	    };
		 /*收取频率
		  * O-一次性收取：O,C-按CYCLE收取,Y-按年收取*/
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
	        	$scope.chargingFrequency=$scope.payProInf2.chargingFrequency;
	        }
		};
		$scope.choseEvent = function(){
			//弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/choseEvent.html', $scope.params, {
				title : T.T('PZJ1100022'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseEventFee]
			});
		};
		$scope.choseEventFee = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.payProInf2.feeEventNo  = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		/*$scope.choseBusinessItems = function(){
			//弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			}
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/choseBusinessItems.html', $scope.params, {
				title : T.T('PZJ1100023'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseBusinessItem]
			});
		}*/
		$scope.choseBusinessItem = function(result){
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.proLineList.checkedList();
			$scope.payProInf2.defaultBusinessItem  = $scope.checkedEvent.businessProgramNo;
			$scope.safeApply();
			result.cancel();
		};
		var form = layui.form;
        $scope.chargingFrequencyShow =false;
        if($scope.payProInf2.periodicFeeIdentifier =='C' || $scope.payProInf2.periodicFeeIdentifier =='P'){
        	$scope.chargingFrequencyShow =true;
        }else{
        	$scope.chargingFrequencyShow =false;
        	$scope.payProInf2.chargingFrequency=null;
        }
        form.on('select(getFeeIdentifierUpdate)',function(event) {
    		if(event.value =='C' || event.value =='P'){
    			 $scope.chargingFrequencyShow =true;
    		}else{
    			 $scope.chargingFrequencyShow =false;
    			 $scope.payProInf2.chargingFrequency=null;
    		}
        });
	});
	//事件
	webApp.controller('choseEventFeeCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location) {
		// 事件清单列表
		$scope.itemList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'evLstList.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//业务项目
	/*webApp.controller('choseBusinessItemsCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		// 事件清单列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});*/
	//复制
	webApp.controller('copyPayProjectCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		 /*费用类别下拉框 :ANNF-年费,LCHG-延滞金,OVRF-超限费,CSHF-取现手续费,
		 * TXNF-转账手续费,SVCF-服务费,ISSF-制卡费,CAMF-销户账户管理费*/
		$scope.feeTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_costCategory",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.feeType=$scope.payProInfCopy.feeType;
	        }
		};
		//触发方式
		$scope.wayArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ interactionType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.triggerEventInteractMode=$scope.payProInfCopy.triggerEventInteractMode;
	        }
		};
		/*实例化维度(1,2,3,4,5) MODT：业务类型,MODP：产品对象,MODM：媒介对象,CURR：币种,
		 * CHAN：渠道,TERM：期数,MODG:业务项目,INST:分期类型,FTYP:费用收取方式*/
		$scope.instanDimenArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_instanceDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.instanCode1=$scope.payProInfCopy.instanCode1;
	        	$scope.instanCode2=$scope.payProInfCopy.instanCode2;
	        	$scope.instanCode3=$scope.payProInfCopy.instanCode3;
	        	$scope.instanCode4=$scope.payProInfCopy.instanCode4;
	        	$scope.instanCode5=$scope.payProInfCopy.instanCode5;
	        }
		};
		//项目用途C: 费用计算，P:费用入账
		 $scope.itemUseArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_projectUse",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.itemUse=$scope.payProInfCopy.itemUse;
	        }
		};
		//计费方式 F：固定金额 M：费用矩阵
		$scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.assessmentMethod=$scope.payProInfCopy.assessmentMethod;
	        }
		};
		//查询类型下拉框
		$scope.periodArray ={ 
	        type:"dictData", 
	        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
	        text:"codes", //下拉框显示内容，根据需要修改字段名称 
	        desc:"detailDesc",
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.periodicFeeIdentifier=$scope.payProInfCopy.periodicFeeIdentifier;
	        }
	    };
		 /*收取频率
		  * O-一次性收取：O,C-按CYCLE收取,Y-按年收取*/
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
	        	$scope.chargingFrequency=$scope.payProInfCopy.chargingFrequency;
	        }
		};
		$scope.payProInfCopy = $scope.payProInfCopy;
		$scope.feeItemCopy = $scope.payProInfCopy.feeType;
		$scope.feeItemNoCopyHalf = $scope.payProInfCopy.feeItemNo.substring(4,8);
		var form = layui.form;
        form.on('select(getFeeTypeCopy)',function(event) {
    		$scope.feeItemCopy = $scope.payProInfCopy.feeType;
        });
        $scope.chargingFrequencyShow =false;
        console.log($scope.payProInfCopy.periodicFeeIdentifier);
        if($scope.payProInfCopy.periodicFeeIdentifier =='C' || $scope.payProInfCopy.periodicFeeIdentifier =='P'){
        	$scope.chargingFrequencyShow =true;
        }else{
        	$scope.chargingFrequencyShow =false;
        	$scope.payProInfCopy.chargingFrequency=null;
        }
        form.on('select(getFeeIdentifierUpdate)',function(event) {
    		if(event.value !='N'){
    			 $scope.chargingFrequencyShow =true;
    		}else{
    			 $scope.chargingFrequencyShow =false;
    			 $scope.payProInfCopy.chargingFrequency=null;
    		}
        });
	});
	// 收费项目新增
	webApp.controller('payProjectCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.payProInf ={};
		/*实例化维度(1,2,3,4,5) MODT：业务类型,MODP：产品对象,MODM：媒介对象,CURR：币种,
		 * CHAN：渠道,TERM：期数,MODG:业务项目,INST:分期类型,FTYP:费用收取方式*/
		$scope.instanDimenArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_instanceDimension",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		/*费用类别下拉框 :ANNF-年费,LCHG-延滞金,OVRF-超限费,CSHF-取现手续费,
		 * TXNF-转账手续费,SVCF-服务费,ISSF-制卡费,CAMF-销户账户管理费*/
		$scope.feeTypeArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_costCategory",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//触发方式
		$scope.wayArray ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_ interactionType",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//项目用途C: 费用计算，P:费用入账
		$scope.itemUseArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_projectUse",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//计费方式 F：固定金额 M：费用矩阵
		$scope.assessmentMethodArr ={ 
	        type:"dictData", 
	        param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_billingMethod",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        	//console.log(data)
	        }
		};
		//收取频率
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
	        }
		};
		//查询类型下拉框
		 $scope.periodArray ={ 
	        type:"dictData", 
	        param:{"type":"DROPDOWNBOX","groupsCode":"dic_periodArray","queryFlag":"children"},//默认查询条件 
	        text:"codes", //下拉框显示内容，根据需要修改字段名称 
	        desc:"detailDesc",
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//日期控件
		layui.use('laydate', function(){
			var laydate = layui.laydate;
			var startDate = laydate.render({
				elem: '#effectiveDate',
				  //min:"2019-03-01",
				done: function(value, date) {
					endDate.config.min = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					endDate.config.start = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.effectiveDate = $("#effectiveDate").val();
				}
			});
			var endDate = laydate.render({
				elem: '#expirationDate',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					};
					$scope.payProInf.expirationDate = $("#expirationDate").val();
				}
			});
		});
		//日期控件end
		var form = layui.form;
        form.on('select(getFeeType)',function(event) {
    		$scope.feeItem = $scope.payProInf.feeType;
        });
        $scope.chargingFrequencyShow =false;
        form.on('select(getFeeIdentifier)',function(event) {
    		if($scope.payProInf.periodicFeeIdentifier =='C' || $scope.payProInf.periodicFeeIdentifier =='P'){
    			 $scope.chargingFrequencyShow =true;
    		}else{
    			 $scope.chargingFrequencyShow =false;
    			 $scope.payProInf.chargingFrequency=null;
    		}
        });
		$scope.choseEvent = function(){
			//弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/choseEvent.html', $scope.params, {
				title : T.T('PZJ1100017'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseEventFee]
			});
		};
		$scope.choseEventFee = function(result){
			if (!result.scope.itemList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.itemList.checkedList();
			$scope.payProInf.feeEventNo  = $scope.checkedEvent.eventNo;
			$scope.safeApply();
			result.cancel();
		};
		//默认业务项目
	/*	$scope.choseBusinessItems = function(){
			//弹框查询列表
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			}
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/choseBusinessItems.html', $scope.params, {
				title : T.T('PZJ1100018'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1000px', '400px' ],
				callbacks : [$scope.choseBusinessItem]
			});
		}*/
		$scope.choseBusinessItem = function(result){
			if (!result.scope.proLineList.validCheck()) {
				return;
			}
			$scope.checkedEvent = result.scope.proLineList.checkedList();
			$scope.payProInf.defaultBusinessItem  = $scope.checkedEvent.businessProgramNo;
			$scope.safeApply();
			result.cancel();
		}
	});
});
