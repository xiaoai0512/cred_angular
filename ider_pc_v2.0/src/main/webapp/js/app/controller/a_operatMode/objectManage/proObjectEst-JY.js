/**
 * 
 */
'use strict';
define(function(require) {
	var webApp = require('app');
	// 产品对象建立
	webApp.controller('proObjectEstCtrl-JY', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		//产品类型
		$scope.productTypeArr = [{name : T.T('YYJ300001') ,id : 'CRD'},{name : T.T('YYJ300002') ,id : 'RLN'}] ;
		$scope.proObjInf = {};
		$scope.productShow = true;
		//	运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"productLine.queryMode",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		 //卡bin
		 $scope.cardBinArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
			        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"productLine.queryBin",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		  var form = layui.form;
	        form.on('select(getOperation)',function(event) {
	        	 if (event.value) {
	        		 $scope.busListTable.params.operationMode = event.value;
	        		 $scope.busListTable.search();
	        	 }
	        });
	    //查询法人实体
        	$scope.userInfo = lodinDataService.getObject("userInfo");
     		$scope.adminFlag = $scope.userInfo.adminFlag;
     		$scope.organization = $scope.userInfo.organization;
            $scope.queryCorEntityNo = function(){
	 			$scope.queryParam = {
	 					organNo : $scope.organization
	 			};
	 			jfRest.request('operationOrgan','query', $scope.queryParam).then(function(data) {
	 				$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
	 				if($scope.adminFlag != "1" && $scope.adminFlag != "2"){
	 					$scope.corporationEntityNo = $scope.corporationEntityNo;
	 					$("#corporationEntityNo").attr("disabled",true);
	 				}
	 			});
            };        
            $scope.queryCorEntityNo ();       
	    //
        form.on('select(getBinNo)',function(data) {
        	 if(data.value){
        		 $scope.isShowSeg = true;
        		 //特殊号码段号
        	        $scope.segmentNumberArr = {
        	    		type:"dynamic", 
        		        param:{
        		        	cardBin : data.value,
        		        	corporationEntityNo : $scope.corporationEntityNo
        		        },//默认查询条件 
        		        text:"segmentNumber", //下拉框显示内容，根据需要修改字段名称 
        		        value:"segmentNumber",  //下拉框对应文本的值，根据需要修改字段名称 
        		        resource:"resSpecialNoRule.query",//数据源调用的action 
        		        callback: function(data){
        		        }	
        	        };
        	 }else if(data.value == '' || data.value == null || data.value == undefined){
        		 $scope.isShowSeg = false;
        	 }
        });
        //特殊号码段号
        $scope.segmentNumberArr = {
    		type:"dynamic", 
	        param:{
	        	corporationEntityNo : $scope.corporationEntityNo
	        },//默认查询条件 
	        text:"binNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"binNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"resSpecialNoRule.query",//数据源调用的action 
	        callback: function(data){
	        }	
        };
		 //保存产品对象
		$scope.saveProObj = function(){
			$scope.proObjInf.list = $scope.treeSelect1;//关联业务项目
			$scope.proObjInf.formatlist = $scope.cardLayoutSelect1;//关联卡版面
			$scope.proObjInf.productObjectCode = 'MODP'+$scope.proObjInf.productObjectCodeHalf;
			jfRest.request('proObject', 'save', $scope.proObjInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstan = $scope.proObjInf;
					$scope.proObjInf = {};
					$scope.proObjInfoForm.$setPristine();
					$scope.queryMODP.params.instanCode=$scope.proObjInstan.productObjectCode;
					$scope.queryMODP.search();
					$scope.treeSelect1 = [];
					$scope.nextInstan();
					$scope.isShowSeg = false;
				}else{
					$scope.isShowSeg = false;
				}
			});
		};
		//***********************业务类型列表***********************
		$scope.busListTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery :true,
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//关联
		$scope.treeSelect1 =[];
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.busListTable.validCheck()) {
				return;
			}
			var items = $scope.busListTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect1.length; k++) {
					if (items[i].businessProgramNo  == $scope.treeSelect1[k].businessProgramNo ) {    //判断是否存在
						tipStr = tipStr + items[i].businessProgramNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.treeSelect1.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('YYJ300003') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ300004'));
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.treeSelect1.splice(checkId, 1);
		};
		//卡版面列表
		$scope.cardLayoutListTable = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery :true,
			resource : 'cardLayoutMag.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//关联卡版面
		$scope.cardLayoutSelect1 =[];
		$scope.saveCardLaySelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.cardLayoutListTable.validCheck()) {
				return;
			}
			var items = $scope.cardLayoutListTable.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.cardLayoutSelect1.length; k++) {
					if (items[i].formatCode  == $scope.cardLayoutSelect1[k].formatCode ) {    //判断是否存在
						tipStr = tipStr + items[i].formatCode + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.cardLayoutSelect1.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert(T.T('YYJ300003') + tipStr.substring(0,tipStr.length-1) + T.T('YYJ300004'));
			}
		};
		// 删除关联卡板面
		$scope.removeCardLaySelect = function(data) {
			var checkId = data;
			$scope.cardLayoutSelect1.splice(checkId, 1);
		};
		$scope.instanProductShow = false;
		//进入产品信息
		$scope.nextInstan = function (){
			$scope.instanProductShow = true;//显示实例化
			$scope.productShow = false;
			$scope.queryMODP.params.instanCode=$scope.proObjInstan.productObjectCode;
			$scope.queryMODP.search();
		};
		//查询产品实例构件
		$scope.queryMODP = {
//				checkType : 'checkbox', // 当为checkbox时为多选
				params : $scope.queryParam = {
						instanDimen1 : "MODP"
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'artifactExample.querySelectArtifact',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//产品实例化时，点击替换参数的方法
		$scope.updateSelectA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title : '选择替换参数项',
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectA]
				});
		};
		//产品实例化时，点击设置参数值的方法
		$scope.setSelectA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
					title : '设置'+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +'的参数值',
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseSelectTwo]
				});
		};
		$scope.choseSelectA = function(result) {
			if (!result.scope.elementNoTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTable.checkedList();
			$scope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			$scope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODP.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODP.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseSelectTwo = function(result) {
			$scope.items = {};
			$scope.queryMODP.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODP.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODP.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		};
		$scope.proObjInstan ={};
		$scope.saveProInstan = function(){
			for (var i = 0; i < $scope.queryMODP.data.length; i++) {
				if($scope.queryMODP.data[i].pcdList==null && $scope.queryMODP.data[i].pcdInitList!=null){
					$scope.queryMODP.data[i].addPcdFlag = 	"1";
					$scope.queryMODP.data[i].pcdList = $scope.queryMODP.data[i].pcdInitList;
				}
			}
			$scope.proObjInstan.instanlist = $scope.queryMODP.data;
			$scope.proObjInstan.instanCode = $scope.proObjInstan.productObjectCode;
			jfRest.request('artifactExample', 'saveMore', $scope.proObjInstan).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstan = {};
					$scope.queryMODP.data = {};
//					$scope.instanProductShow = false;//显示实例化
//					$scope.productShow = true;
				}
			});
		};
	});
	//******************************替换参数***************
	webApp.controller('selectElementNoCtrl-ZJY',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.artifactInfo = $scope.itemsNo;
     // 元件
		$scope.elementNoTable = {
			checkType : 'radio', //
			params : $scope.queryParam = {
				artifactNo : $scope.itemsNo.artifactNo,
				pcdNo : $scope.itemsNo.elementNo.substring(0,8),
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnData.rows != "" && data.returnData.rows != undefined && data.returnData.rows != null){
					for(var i=0;i<data.returnData.rows.length;i++){
						if(data.returnData.rows[i].elementNo == $scope.artifactInfo.elementNo){
							data.returnData.rows[i]._checked = true;
						}
					}
				}
			}
		};
	});
	//******************************替换参数end***************
	//******************************余额对象设置参数值pcd修改***************
	webApp.controller('selectPCDCtrl-ZJY',function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.pcdExampleInf ={};
		$scope.pcdDifExampleInf = {};
		var count = 1;
		$scope.artifactInfo = $scope.itemsPCD;
		$scope.businessValueArr01= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.baseInstanDimenAddD = $scope.pcdExampleInf.baseInstanDimen;
			}
		};
		$scope.businessValueArr02= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_dimensionalValue",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.optionInstanDimenAddD = $scope.pcdExampleInf.optionInstanDimen;
			}
		};
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.segmentTypeAddD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例化取值类型
		$scope.pcdtypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_valueType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.pcdTypeAdd = $scope.pcdExampleInf.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeAdd)',function(event){
			 $scope.pcdTypeAdd = event.value;
		 });
		//新增pcd差异化不显示
		$scope.showNewPcdInfo = false;
		$scope.pcdInfTable = [];
		// pcd差异化实例 新增按钮
		$scope.newPcdBtn = function() {
            $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
            if($scope.showNewPcdInfo){
            	$scope.pcdDifExampleInf.pcdDiffSerialNo = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCD.pcdNo.substring(0,8);
		if($scope.itemsPCD.segmentType!=null){//分段类型不为空
			$scope.pcdExampleInf.segmentType =  $scope.itemsPCD.segmentType;
			$scope.addButtonShow = true;
		}else{
			$scope.addButtonShow = false;
		}
		if($scope.itemsPCD.pcdInitList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdInitList;
		}else{
			$scope.showNewPcdInfo = true;
		}
		if($scope.itemsPCD.pcdList!=null){
			$scope.pcdInfTable = $scope.itemsPCD.pcdList;
		}
		 //删除pcd实例列表某行
        $scope.deletePcdDif =  function(data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
        };
        //修改pcd实例列表某行
        $scope.updateInstan = function(event,$index){
        	$scope.indexNoTemp = '';
			$scope.indexNoTemp = $index;
			$scope.showNewPcdInfo = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInf = $scope.updateInstanTemp;
		};
        //保存pcd实例============余额对象实例化设置参数值
		  $scope.saveNewAdrInfo = function() {
			  if(null== $scope.pcdExampleInf.pcdPoint|| null== $scope.pcdTypeAdd || null== $scope.pcdExampleInf.pcdValue) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeAdd;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInf.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeAdd;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInf.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInf.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInf.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
				}
				$scope.pcdDifExampleInf = {};
				$scope.pcdDifExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
				$scope.showNewPcdInfo = false;
	       };
		  //
		  var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBusinessType.html', $scope.params, {
							title : T.T('YYJ400021'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBusType]
						});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseMediaObject.html', $scope.params, {
							title : T.T('YYJ400022'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseMedia]
						});
				}else if(dataType=="MODB"){//余额对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBalanceObject.html', $scope.params, {
							title : T.T('YYJ400023'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBalanceObject]
						});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductObject.html', $scope.params, {
							title : T.T('YYJ400024'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductObject]
						});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseProductLine.html', $scope.params, {
							title : T.T('YYJ400025'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductLine]
						});
				}else if(dataType=="ACST"){//核算状态
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseAcst.html', $scope.params, {
							title : T.T('YYJ400026'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseAcst]
						});
				}else if(dataType=="EVEN"){//事件
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseEvent.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseEvent]
						});
				}else if(dataType=="BLCK"){//封锁码
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseBlockCode.html', $scope.params, {
							title : T.T('YYJ400028'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBlockCode]
						});
				}else if(dataType=="AUTX"){//授权场景
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseScenarioList.html', $scope.params, {
							title : T.T('YYJ400029'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseScenarioList]
						});
				}else if(dataType=="LMND"){//额度节点
					//弹框查询列表
					$scope.params = {
							"operationMode" : $rootScope.operationMods,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseQuotaTree.html', $scope.params, {
							title : T.T('YYJ400030'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseQuotaTree]
						});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseCurrency.html', $scope.params, {
							title : T.T('YYJ400027'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseCurrency]
						});
				}else if(dataType=="DELQ"){//延滞层级
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/example/choseDelv.html', $scope.params, {
							title : T.T('YYJ400031'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}
			};
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBlockCode = function(result){
				if (!result.scope.blockCDScnMgtTable.validCheck()) {
					return;
				}
				$scope.checkedBlockCode = result.scope.blockCDScnMgtTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBlockCode.blockCodeType+$scope.checkedBlockCode.blockCodeScene);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseEvent = function(result){
				if (!result.scope.itemList.validCheck()) {
					return;
				}
				$scope.checkedEvent = result.scope.itemList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseAcst = function(result){
				console.log(result);
				//if (!result.scope.itemList.validCheck()) {
				if (!result.scope.accountStateTable.validCheck()) {
					return;
				}
				$scope.checkedAccountState = result.scope.accountStateTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedAccountState.accountingStatus);
//				$scope.InstanCodeValue(dataValueCount,$scope.checkedEvent.eventNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBalanceObject = function(result){
				if (!result.scope.balanceObjectList.validCheck()) {
					return;
				}
				$scope.checkedBalanceObject = result.scope.balanceObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBalanceObject.balanceObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseScenarioList = function(result){
				if (!result.scope.scenarioList.validCheck()) {
					return;
				}
				$scope.checkedScenario = result.scope.scenarioList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedScenario.authSceneCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseQuotaTree = function(result){
				if (!result.scope.quotaTreeList.validCheck()) {
					return;
				}
				$scope.checkedQuotaTree = result.scope.quotaTreeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedQuotaTree.creditNodeNo);
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.delinquencyLevel);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.artifactExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.artifactExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.artifactExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.artifactExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.artifactExampleInf.instanCode5 = code;
				}else if(dataValue=='base'){
					$scope.pcdExampleInf.baseInstanCode = code;
				}else if(dataValue=='option'){
					$scope.pcdExampleInf.optionInstanCode = code;
				}
			};
			$scope.choseBaseInstanCodeBtn = function() {
				//获取基础维度的值
				dataValueCount ='base';
				$scope.chosedInstanCode($scope.pcdExampleInf.baseInstanDimen);
			};
			$scope.choseOptionInstanCodeBtn = function() {
				//获取可选维度的值
				dataValueCount ='option';
				$scope.chosedInstanCode($scope.pcdExampleInf.optionInstanDimen);
			};
	});
});
