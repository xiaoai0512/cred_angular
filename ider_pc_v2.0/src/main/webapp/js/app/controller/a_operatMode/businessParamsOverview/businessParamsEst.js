'use strict';
define(function(require) {
	var webApp = require('app');
	// 业务参数统一建立
	//产品对象建立，产品业务项目建立，产品构件实例及pcd实例
	webApp.controller('businessParamsEstCtrl', function($scope, $stateParams, jfRest,$http, $timeout,jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.corporationEntityNo = sessionStorage.getItem("corporation");
		$scope.proObjBusInsInf = {};
		$scope.proObjBusInsInf.pcdList =[];
		$scope.productShow = true;
		$rootScope.btnbusinessShow= true;  //选择业务项目按钮
		$rootScope.isbusinessProgram = false;  //选择业务项目
		$rootScope.isSelprogram = false;  //已选业务项目
		$rootScope.ischeckbusProList = false;   //选择业务项目查询列表
		$scope.segmentNumberArr = {};
		$scope.isshow88 = false;
		//查看还款优先级
		$scope.chosePriorityBtn = function() {
			$scope.params = {
				"pageSize" : 10,
				"indexNo" : 0
			};
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/viewProductObject.html', $scope.params, {
				title : T.T('YYJ100027'),
				buttons : [ T.T('F00012') ],
				size : [ '1000px', '500px' ],
				callbacks : []
			});
		};
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
		$scope.proArray ={};
		 var form = layui.form;
		form.on('select(getoperationMods)',function(event){
			$rootScope.operationMods = $scope.proObjBusInsInf.operationMode;
			if(event.value == "" || event.value == undefined){
				$("#productCodeSetId").attr("disabled",true);
				$scope.productCodeSet = "";
				$scope.proObjBusInsInfoForm.$setPristine();
			}else {
				//产品
				 $scope.proArray ={ 
					        type:"dynamicDesc", 
					        param:{operationMode:$scope.proObjBusInsInf.operationMode},//默认查询条件 
					        text:"productObjectCode", //下拉框显示内容，根据需要修改字段名称 
					        desc:"productDesc",
					        value:"productObjectCode",  //下拉框对应文本的值，根据需要修改字段名称
					        resource:"proObject.query",//数据源调用的action 
					        callback: function(data){
					        }
				};
				 $("#productCodeSetId").removeAttr("disabled");
				 $timeout(function(){
	        		Tansun.plugins.render('select');
				});
			}
		});
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
		 //点击选择业务项目
		 $scope.businessProgramShow = function(){
			 if($scope.proObjBusInsInf.operationMode){
				var adom1I = document.getElementsByClassName('step1I');
      			for(var i=0;i<adom1I.length;i++){
      				adom1I[i].setAttribute('readonly',true);
      				adom1I[i].classList.add('bnone');
      			}
      			var adom1S = document.getElementsByClassName('step1S');
      			for(var i=0;i<adom1S.length;i++){
      				adom1S[i].setAttribute('disabled','disabled');
      			}
      			$timeout(function() {
    				Tansun.plugins.render('select');
    			});
				 $scope.isshow88 = true;
				 $scope.isshow88Btn = true;
				 $scope.backTwoShow = false;
				 $rootScope.btnbusinessShow= false;  //选择业务项目按钮
				 $scope.backShow = true;
				 $("#s1 option").remove();
				 $("#s2 option").remove();
				$scope.setparamss = {
						operationMode : $rootScope.operationMods
				};
				jfRest.request('productLine', 'query', $scope.setparamss)
				.then(function(data) {
					var a =data.returnData.rows;
					$rootScope.s2 = {};
					$rootScope.s2 =data.returnData.rows;
					for(var i=0;i<a.length;i++){
						$("#s1").append("<option value='"+a[i].businessProgramNo+"'>"+a[i].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].programDesc+"</option>"); 
				   }
				});
			 }else{
				jfLayer.fail(T.T("YYJ100028"));
			}
		 };
		 //返回
		 $scope.businessProgramBack = function(){
			 $scope.isshow88 = false;
			 $rootScope.btnbusinessShow= true;  //选择业务项目按钮
			 $scope.isshow88Btn = false;
			 $scope.backShow = false;
			 var adom1I = document.getElementsByClassName('step1I');
	  			for(var i=0;i<adom1I.length;i++){
	  				adom1I[i].removeAttribute('readonly');
	  				adom1I[i].classList.remove('bnone');
	  			}
	      		var adom1S = document.getElementsByClassName('step1S');
	  			for(var i=0;i<adom1S.length;i++){
	  				adom1S[i].removeAttribute('disabled');
	  			}
	  			$timeout(function() {
					Tansun.plugins.render('select');
				});
		 };
		 //点击下一步，选择卡版面
		 $scope.nextAndBusPro = function(){
			 $scope.isshow99 = true;
			 $scope.isshow101 = true;
			 $scope.isshow100 = false;
			 $scope.backShow = false;
			 $rootScope.btnbusinessShow= false;  //选择业务项目按钮
			 $scope.isshow88Btn = false;
			 $scope.backTwoShow = true;
			 $("#s5 option").remove();
			 $("#s6 option").remove();
			 $scope.ktparamss = {
				operationMode : $rootScope.operationMods
			};
			jfRest.request('cardLayoutMag', 'query', $scope.ktparamss)
			.then(function(data) {
				var c =data.returnData.rows;
				$rootScope.s6 = {};
				$rootScope.s6 = data.returnData.rows;
				for(var i=0;i<c.length;i++){
					$("#s5").append("<option value='"+c[i].formatCode+"'>"+c[i].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+c[i].formatDescribe+"</option>"); 
			   }
			});
		 };
		 //点击下一步，选择收费项目
		 $scope.nextAndFeeItem = function(){
			 $scope.isshow99 = true;
			 $scope.isshow101 = false;
			 $scope.isshow100 = true;
			 $scope.backShow = false;
			 $rootScope.btnbusinessShow= false;  //选择业务项目按钮
			 $scope.isshow88Btn = false;
			 $scope.backTwoShow = true;
			 $("#s7 option").remove();
			 $("#s8 option").remove();
			 $scope.ktparamss = {
				operationMode : $rootScope.operationMods,
				periodicFeeIdentifier :"P"
			};
			jfRest.request('feeProject', 'query', $scope.ktparamss)
			.then(function(data) {
				var c =data.returnData.rows;
				$rootScope.s8 = {};
				$rootScope.s8 = data.returnData.rows;
				for(var i=0;i<c.length;i++){
					$("#s7").append("<option value='"+c[i].feeItemNo+"'>"+c[i].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+c[i].feeDesc+"</option>"); 
			   }
			});
		 };
		 //费用类别
		 $scope.feeTypeArr = [ {
				name : T.T('YYJ1200001'),
				id : 'ANNF'
			}, {
				name : T.T('YYJ1200002'),
				id : 'LCHG'
			}, {
				name : T.T('YYJ1200003'),
				id : 'OVRF'
			} , {
				name : T.T('YYJ1200004'),
				id : 'CSHF'
			} , {
				name : T.T('YYJ1200005'),
				id : 'TXNF'
			} , {
				name : T.T('YYJ1200006'),
				id : 'SVCF'
			}  , {
				name : T.T('YYJ1200007'),
				id : 'ISTF'
			} , {
				name : T.T("YYJ1200018"),
				id : 'ISSF'
			} ];
		//点击返回卡版面
		 $scope.formBackInfo=function(){
			 $scope.isshow99 = true;
			 $scope.backTwoShow = true;
			 $scope.isshow88Btn = false;
			 $scope.backShow = true;
			 $scope.isshow101 = true;
			 $scope.isshow100 = false;
		 };
		 //点击最后一个返回
		 $scope.backInfo=function(){
			 $scope.isshow99 = false;
			 $scope.backTwoShow = false;
			 $scope.isshow88Btn = true;
			 $scope.backShow = true;
		 };
		 //点击查询业务项目
		 $scope.selBusProList = function(){
			$scope.busProListTable.search();
			$rootScope.isbusinessProgram = true;  //选择业务项目
			$rootScope.ischeckbusProList = true;   //选择业务项目查询列表
			$rootScope.isSelprogram = false;  //已选业务项目
			$rootScope.btnbusinessShow= false;  //选择业务项目按钮
		 };
		//根据业务项目和描述查询
		$scope.querySelectList = function(){
			 $("#s1").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				businessProgramNo: $scope.proObjBusInsInf.businessProgramNo,
				programDesc: $scope.proObjBusInsInf.programDesc
			};
			jfRest.request('productLine', 'query', $scope.setparamss).then(function(data) {
				var a =data.returnData.rows;
				console.log(a);
				$scope.arr02 = [];
				$("#s2 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				//console.log(n);
				if(n !=undefined && a !=null){
					//查找重复数据
					 var isrep;
					 for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].businessProgramNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s1").append("<option value='"+a[j].businessProgramNo+"'>"+a[j].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].programDesc+"</option>"); 
				    	}
                     }
                }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
			    		 $("#s1").append("<option value='"+a[j].businessProgramNo+"'>"+a[j].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].programDesc+"</option>"); 
			    	  }
			      }
			});
		};
		 /*----根据卡板面，和描述查询----*/
	 	$scope.queryCardList = function(){
			 $("#s5").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				formatCode: $scope.proObjBusInsInf.formatCode,
				formatDescribe: $scope.proObjBusInsInf.formatDescribe
	 		};
			jfRest.request('cardLayoutMag', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s6 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				 if(n !=undefined && a !=null){
						//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].formatCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s5").append("<option value='"+a[j].formatCode+"'>"+a[j].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].formatDescribe+"</option>"); 
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s5").append("<option value='"+a[j].formatCode+"'>"+a[j].formatCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].formatDescribe+"</option>"); 
					   }
			      }
			});
		};
		/*----end卡板面，和描述查询 ----*/
		/*----根据收费项目编号，和费用类别查询----*/
	 	$scope.queryFeeItemList = function(){
			 $("#s7").empty();
			 $scope.setparamss = {
				operationMode : $rootScope.operationMods,
				feeItemNo: $scope.proObjBusInsInf.feeItemNo,
				feeType: $scope.proObjBusInsInf.feeType,
				periodicFeeIdentifier :"P"
	 		};
			jfRest.request('feeProject', 'query', $scope.setparamss).then(function(data) {
				 var a =data.returnData.rows;
				 $scope.arr02 = [];
				 $("#s8 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				 if(n !=undefined && a !=null){
						//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].formatCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s7").append("<option value='"+a[j].feeItemNo+"'>"+a[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].feeDesc+"</option>"); 
				    	}
                    }
                 }else if(a!=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s7").append("<option value='"+a[j].feeItemNo+"'>"+a[j].feeItemNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].feeDesc+"</option>"); 
					   }
			      }
			});
		};
		/*----end卡板面，和描述查询 ----*/
		 //左右下拉框对比 查重 obj:需要对比的值 ，arr对比的数组
		 $scope.isRepeat = function(obj,arr){
			var isTip = false;//是否提示
			var tipStr = "";
			var isExist = false;//是否存在
			if(typeof(obj) == 'string'){
				for (var k = 0; k < arr.length; k++) {
					if (obj == arr[k]) {    //判断是否存在
						tipStr = tipStr + obj ;
						isTip = true;
						isExist = true;
						break;
					}
				}
			}else if(typeof(obj) == 'object'){
				for (var k = 0; k < arr.length; k++) {
					if (obj[key] == arr[k]) {    //判断是否存在
						tipStr = tipStr + obj[key];
						isTip = true;
						isExist = true;
						break;
					}
				}
			}
			if(isExist){
				jfLayer.alert(tipStr + T.T('YYJ100022'));
				return false;
			}else {
				return true;
			}
		 };
		 var roomIds = [];//已选择业务项目
			//功能分配菜单
			$("#s1").dblclick(function(){  
				 var alloptions = $("#s1 option");  
				 var so = $("#s1 option:selected");
				 $("#s2").append(so); 
				 $rootScope.valueInfoPro = "";
				/*遍历S2下的option，获取option的值，放入数组中，
				 * 要放入的值和数组对比
				 */
				/* $scope.isRepeat(so.val(),roomIds); 
				 if($scope.isRepeat(so.val(),roomIds)){
					 $("#s2").append(so);   
				 }else {
					return; 
				 }
				  roomIds = $("#s2 option").map(function(){
					 return $(this).val();
				}).get();*/
			});  
			$("#s2").dblclick(function(){  
				 var alloptions = $("#s2 option");  
				 var so = $("#s2 option:selected");  
				 $("#s1").append(so);  
				 $rootScope.valueInfoPro = "";
			});  
			$("#add").click(function(){  
				 var alloptions = $("#s1 option");  
				 var so = $("#s1 option:selected");  
				 $("#s2").append(so); 
				 $rootScope.valueInfoPro = "";
			});  
			$("#remove").click(function(){  
				 var alloptions = $("#s2 option");  
				 var so = $("#s2 option:selected");  
				 $("#s1").append(so);
				 $rootScope.valueInfoPro = "";
			});  
			$("#addall").click(function(){  
				$("#s2").append($("#s1 option").attr("selected",true));  
				$rootScope.valueInfoPro = "";
			});  
			$("#removeall").click(function(){  
				$("#s1").append($("#s2 option").attr("selected",true));  
				$rootScope.valueInfoPro = "";
			});  
			$("#s1").click(function(){  
				 var valueInfoPro = $(this).val();
				 $rootScope.valueInfoPro = "";
				 if(valueInfoPro){
					 $rootScope.valueInfoPro = valueInfoPro[0];
				 }
			});  
			$("#s2").click(function(){  
				 var valueInfoPro = $(this).val();
				 $rootScope.valueInfoPro = "";
				 if(valueInfoPro){
					 $rootScope.valueInfoPro = valueInfoPro[0];
                 }
                //默认类型
				 var valueTypes = $("#s2 option:selected").val();
				 $rootScope.valueType= "";
				 if(valueTypes){
					 $rootScope.valueType = valueTypes;
				 }
			}); 
			$("#proInfoId").click(function(){ 
				 if($rootScope.valueInfoPro != "" && $rootScope.valueInfoPro != undefined && $rootScope.valueInfoPro != null){
					 $scope.soItemPro = {};
					$scope.soItemPro.operationMode = $rootScope.operationMods;
					$scope.soItemPro.businessProgramNo =  $rootScope.valueInfoPro;
					jfRest.request('productLine', 'query', $scope.soItemPro).then(function(data) {
						if (data.returnCode == '000000') {
							$scope.proLineInf = data.returnData.rows[0];
							// 页面弹出框事件(弹出页面)
							$scope.modal('/a_operatMode/businessParamsOverview/busProInfo.html', $scope.proLineInf, {
								title : T.T('YYJ300003')+$scope.proLineInf.businessProgramNo +' '+$scope.proLineInf.programDesc+T.T('YYJ100023'),
								buttons : [ T.T('F00012') ],
								size : [ '1100px', '600px' ],
								callbacks : []
							});
						}
					});
				 }else{
					 jfLayer.fail(T.T('YYJ100024'));
				 }
			});
			//设置默认业务项目
			$("#setDefaultId35").click(function(){ 
				 if($rootScope.valueType != "" && $rootScope.valueType != undefined && $rootScope.valueType != null){
					 $scope.proObjBusInsInf.defaultBusinessItem = $rootScope.valueType;
				 }else{
					 jfLayer.fail(T.T('YYJ100043'));
				 }
			});
			//选择卡版面
			$("#s5").dblclick(function(){  
				 var alloptions = $("#s5 option");  
				 var so = $("#s5 option:selected");  
				 $("#s6").append(so);  
			});  
			$("#s6").dblclick(function(){  
				 var alloptions = $("#s6 option");  
				 var so = $("#s6 option:selected");  
				 $("#s5").append(so);  
			});  
			$("#add5").click(function(){  
				 var alloptions = $("#s5 option");  
				 var so = $("#s5 option:selected");  
				 $("#s6").append(so); 
			});  
			$("#remove5").click(function(){  
				 var alloptions = $("#s6 option");  
				 var so = $("#s6 option:selected");  
				 $("#s5").append(so);
			});  
			$("#addall5").click(function(){  
				$("#s6").append($("#s5 option").attr("selected",true));  
			});  
			$("#removeall5").click(function(){  
				$("#s5").append($("#s6 option").attr("selected",true));  
			});  
			//选择收费项目
			$("#s7").dblclick(function(){  
				 var alloptions = $("#s7 option");  
				 var so = $("#s7 option:selected");  
				 $("#s8").append(so);  
			});  
			$("#s8").dblclick(function(){  
				 var alloptions = $("#s8 option");  
				 var so = $("#s8 option:selected");  
				 $("#s7").append(so);  
			});  
			$("#add7").click(function(){  
				 var alloptions = $("#s7 option");  
				 var so = $("#s7 option:selected");  
				 $("#s8").append(so); 
			});  
			$("#remove7").click(function(){  
				 var alloptions = $("#s8 option");  
				 var so = $("#s8 option:selected");  
				 $("#s7").append(so);
			});  
			$("#addall7").click(function(){  
				$("#s8").append($("#s7 option").attr("selected",true));  
			});  
			$("#removeall7").click(function(){  
				$("#s7").append($("#s8 option").attr("selected",true));  
			});  
		//***********************保存产品对象及产品业务项目start***********************
		$scope.saveProObjAndBusPro = function(){
			$scope.proObjBusInsInf.productObjectCode = 'MODP'+$scope.proObjBusInsInf.productObjectCodeHalf;
			$scope.proObjInstan = $scope.proObjBusInsInf;
			$scope.proObjBusInsInfoForm.$setPristine();
			$scope.nextInstanProObjAndBusPro();
		};
		//从实例化页面返回 基本信息页
		$scope.businessProgramBackThree = function(){
			$scope.instanProductShow = false;
			$scope.isshow99 = true;
			$scope.isshow88 = true;
			$scope.isshow100 = true;
			$scope.productShow = true;
			$scope.backTwoShow = true;
		};
		 //***********************保存产品对象及产品业务项目end***********************
		//***********************业务项目列表start***********************
		$scope.busProListTable = {
			params : $scope.queryParam = {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery :false,
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//***********************业务项目列表end***********************
		$scope.instanProductShow = false;
		//进入产品信息
		$scope.nextInstanProObjAndBusPro = function (){
			$scope.instanProductShow = true;//显示实例化
			$scope.productShow = false;
			$scope.isshow88 = false;
			$scope.isshow99 = false;
			$scope.isShowSeg = false;
			$scope.backTwoShow = false;
			$scope.isshow100 = false;
			$scope.arr2 = [];
			$scope.S2List = {};
			$scope.S2ListResult = [];
			 $("#s2 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr2.push(vall);
		    });
			 if($rootScope.s2){
				 for(var w=0;w<$rootScope.s2.length;w++){
					 for(var t=0;t<$scope.arr2.length;t++){
						if($rootScope.s2[w].businessProgramNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s2[w];
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			$scope.programTypeList = [];
			for(var p=0;p<$scope.S2ListResult.length;p++){
				$scope.programTypeList.push($scope.S2ListResult[p].programType);
			}
			console.log($scope.programTypeList);
			if($scope.programTypeList.length > 1){
				var bb = 0;
				for(var m=0;m<$scope.programTypeList.length;m++){
					if($scope.programTypeList[m] != $scope.programTypeList[0]){
						bb++;
					}
				}
				if(bb === 0){
					$scope.artifactPro = {};
					$scope.artifactPro.businessPattern = $scope.programTypeList[0];
					jfRest.request('businessRemoveArtifact', 'query', $scope.artifactPro).then(function(data) {
						console.log(data);
						if(data.returnCode == '000000'){
							if(data.returnData.totalCount > 0){
								$scope.excptArtifactList = [];
								for(var g=0;g<data.returnData.rows.length;g++){
									$scope.excptArtifactList.push(data.returnData.rows[g].artifactNo);
								}
								$scope.queryMODP.params.instanCode=$scope.proObjInstan.productObjectCode;
								$scope.queryMODP.params.excptArtifactList = $scope.excptArtifactList;
								$scope.queryMODP.search();
							}
						}
					});
				}else{
					$scope.queryMODP.params.instanCode=$scope.proObjInstan.productObjectCode;
					$scope.queryMODP.search();
				}
			}else{
				$scope.artifactPro = {};
				$scope.artifactPro.businessPattern = $scope.programTypeList[0];
				jfRest.request('businessRemoveArtifact', 'query', $scope.artifactPro).then(function(data) {
					console.log(data);
					if(data.returnCode == '000000'){
						if(data.returnData.totalCount > 0){
							$scope.excptArtifactList = [];
							for(var g=0;g<data.returnData.rows.length;g++){
								$scope.excptArtifactList.push(data.returnData.rows[g].artifactNo);
							}
							$scope.queryMODP.params.instanCode=$scope.proObjInstan.productObjectCode;
							$scope.queryMODP.params.excptArtifactList = $scope.excptArtifactList;
							$scope.queryMODP.search();
						}
					}
				});
			}
		};
		//查询产品实例构件
		$scope.queryMODP = {
				params : $scope.queryParam = {
						instanDimen1 : "MODP"
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'artifactExample.querySelectArtifact',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
		$timeout(function(){
            console.log($scope.queryMODP.data);
		},500);
		//产品实例化时，点击替换参数的方法
		$scope.updateSelectA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title : T.T('F00138'),
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
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
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
		//***************产品实例end***************
			//保存产品实例化
		$scope.saveProInstan = function(){
			 $scope.arr6 = [];
			$scope.S6List = {};
			$scope.S6ListResult = [];
			 $("#s6 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr6.push(vall);
		    });
			 if($rootScope.s6){
				 for(var w=0;w<$rootScope.s6.length;w++){
					 for(var t=0;t<$scope.arr6.length;t++){
						if($rootScope.s6[w].formatCode == $scope.arr6[t]){
							$scope.S6List = $rootScope.s6[w];
							$scope.S6ListResult.push($scope.S6List);
						}
					 }
				 }
			 }
			 $scope.proObjBusInsInf.formatlist = $scope.S6ListResult;
			 $scope.proObjBusInsInf.busProList = $scope.S2ListResult;
			 $scope.arr8 = [];
				$scope.S8List = {};
				$scope.S8ListResult = [];
				 $("#s8 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr8.push(vall);
			    });
				 if($rootScope.s8){
					 for(var w=0;w<$rootScope.s8.length;w++){
						 for(var t=0;t<$scope.arr8.length;t++){
							if($rootScope.s8[w].feeItemNo == $scope.arr8[t]){
								$scope.S8List = $rootScope.s8[w];
								$scope.S8ListResult.push($scope.S8List);
							}
						 }
					 }
				 }
			 $scope.proObjBusInsInf.feeItemlist = $scope.S8ListResult;
			$scope.proObjBusInsInf.productObjectCode = 'MODP'+$scope.proObjBusInsInf.productObjectCodeHalf;
			for (var i = 0; i < $scope.queryMODP.data.length; i++) {
				if($scope.queryMODP.data[i].pcdList==null && $scope.queryMODP.data[i].pcdInitList!=null){
					$scope.queryMODP.data[i].addPcdFlag = 	"1";
					$scope.queryMODP.data[i].pcdList = $scope.queryMODP.data[i].pcdInitList;
				}
//				if($scope.queryMODP.data[i].elementNo == '424AAA0100'){
//					if(!$scope.proObjBusInsInf.binNo){
//						jfLayer.fail("元件编号为424AAA0100必须输入发行卡BIN");
//						return;
//					}
//				}else if($scope.queryMODP.data[i].elementNo == '424AAA0200'){
//					if(!$scope.proObjBusInsInf.segmentNumber){
//						jfLayer.fail("元件编号为424AAA0200必须输入特殊号码段号");
//						return;
//					}
//				}
				$scope.queryMODP.data[i].instanCode1 = $scope.proObjBusInsInf.productObjectCode;
			}
			$scope.proObjBusInsInf.instanlist = $scope.queryMODP.data;
			$scope.proObjBusInsInf.instanCode = $scope.proObjInstan.productObjectCode;
			//新增差异化pcd实例
			$scope.proObjBusInsInf.pcdList=[];
			if($scope.queryPcdDifferentChose!=null){
				$scope.proObjBusInsInf.pcdList = $scope.queryPcdDifferentChose;
				$scope.proObjBusInsInf.addPcdFlag ="1";
//				for(var m=0 ;m<$scope.queryPcdDifferentChose.length;m++){
//					if($scope.queryPcdDifferentChose[m].pcdList!=null){
//						for(var n=0 ;n<$scope.queryPcdDifferentChose[m].pcdList.length;n++){
//							$scope.proObjBusInsInf.pcdList.push($scope.queryPcdDifferentChose[m].pcdList[n]);
//						}
//					}
//				}
			}
			//新增费用实例
			$scope.proObjBusInsInf.feeInstanList=[];
			if($scope.payProList.data!=null){
				for(var m=0 ;m<$scope.payProList.data.length;m++){
					if($scope.payProList.data[m].feeInstanList!=null){
						for(var n=0 ;n<$scope.payProList.data[m].feeInstanList.length;n++){
							$scope.proObjBusInsInf.feeInstanList.push($scope.payProList.data[m].feeInstanList[n]);
						}
					}
				}
			}
			jfRest.request('proObject', 'save', $scope.proObjBusInsInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjBusInsInf = {};
					$scope.proObjBusInsInfoForm.$setPristine();
					$scope.instanProductShow = false;//显示实例化
					$scope.productShow = true;
					$scope.btnbusinessShow = true;
					$scope.isshow88 = false;
					$scope.isshow99 = false;
					$scope.isshow77 = false ;
					$scope.isshow66 = false ;
					$scope.isShowSeg = false;
					$scope.backTwoShow = false;
					var adom1I = document.getElementsByClassName('step1I');
	      			for(var i=0;i<adom1I.length;i++){
	      				adom1I[i].setAttribute('readonly',false);
	      			}
	      			var adom1S = document.getElementsByClassName('step1S');
	      			for(var i=0;i<adom1S.length;i++){
	      				adom1S[i].setAttribute('disabled',false);
	      			}
				}
			});
		};
		//***************设置差异化参数start***************
		$scope.setDifferePcdInstan = function(){
			for (var i = 0; i < $scope.queryMODP.data.length; i++) {
				if($scope.queryMODP.data[i].elementNo == '424AAA0100'){
					if(!$scope.proObjBusInsInf.binNo){
						jfLayer.fail(T.T("YYJ100025"));
						return;
					}
				}else if($scope.queryMODP.data[i].elementNo == '424AAA0200'){
					if(!$scope.proObjBusInsInf.segmentNumber){
						jfLayer.fail(T.T("YYJ100026"));
						return;
					}
				}
			}
			$scope.isshow77 = true ;
			$scope.queryPcdDifferent.params.busProList = $scope.S2ListResult;
			$scope.queryPcdDifferent.search();
			$scope.instanProductShow = false;//显示实例化
		};
		//pcd差异列表
		$scope.queryPcdDifferent = {
				params :  {
						busProList : $scope.S2ListResult
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery :false,
				resource : 'pcdExample.queryDiff',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		//上一步
		$scope.backInstanFour = function(){
			$scope.instanProductShow = true;//显示实例化
			$scope.isshow77 = false ;
		};
		//下一步设置收费项目
		$scope.setFeeInstan = function(){
			$scope.isshow77 = false ;
			$scope.isshow66 = true ;
		};
		$scope.queryDiffentInstan = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
			$scope.itemsPCD.indexNo = $index;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/queryPCD.html', $scope.itemsPCD, {
				title : T.T('YYJ510001')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
				buttons : [   T.T('F00107'), T.T('F00012')  ],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.saveDiffPcdList]
			});
		};
		$scope.queryPcdDifferentChose=[];
		$scope.saveDiffPcdList = function(result){
			//新增差异化pcd实例
			$scope.queryPcdDifferent.data[$scope.indexNo].pcdList = result.scope.pcdInfTableDiff;
			if($scope.queryPcdDifferent.data[$scope.indexNo].pcdList!=null){
				for(var n=0 ;n<$scope.queryPcdDifferent.data[$scope.indexNo].pcdList.length;n++){
					if($scope.queryPcdDifferentChose!=null && $scope.queryPcdDifferentChose.length>0){
						$scope.deleteIndex=[];
						for(var m=0 ;m<$scope.queryPcdDifferentChose.length;m++){
							var obj2 = $scope.queryPcdDifferentChose[m];
							var obj3 = $scope.queryPcdDifferent.data[$scope.indexNo].pcdList[n];
							if(obj2.pcdNo === obj3.pcdNo && obj2.instanCode1 === obj3.instanCode1
									&& obj2.instanCode2 === obj3.instanCode2
									&& obj2.instanCode3 === obj3.instanCode3
									&& obj2.instanCode4 === obj3.instanCode4
									&& obj2.instanCode5 === obj3.instanCode5
									&& obj2.segmentSerialNum === obj3.segmentSerialNum
									&& obj2.baseInstanCode === obj3.baseInstanCode
									&& obj2.optionInstanCode === obj3.optionInstanCode){
								$scope.deleteIndex.push(m);
							}
						}
						if($scope.deleteIndex.length>0){
							for (var i = $scope.deleteIndex.length - 1; i >= 0; i--) {
								$scope.queryPcdDifferentChose.splice($scope.deleteIndex[i], 1);
								}
						}
						$scope.queryPcdDifferentChose.push($scope.queryPcdDifferent.data[$scope.indexNo].pcdList[n]);
					}else{
						$scope.queryPcdDifferentChose.push($scope.queryPcdDifferent.data[$scope.indexNo].pcdList[n]);
					}
				}
			}
			$scope.safeApply();
			result.cancel();
		};
		 //删除pcd差异实例列表某行
        $scope.deletePcdDiffInstan =  function(data){
        	var checkId = data;
			$scope.queryPcdDifferentChose.splice(checkId, 1);
        };
        $scope.pcdNoArray ={ 
		        type:"dynamicDesc", 
		        param:{"flag":"3"},//默认查询条件 
		        text:"pcdNo", //下拉框显示内容，根据需要修改字段名称 
		        desc:"pcdDesc",
		        value:"pcdNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"pcd.query",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//***************设置差异化参数end***************
		//***************设置收费项目参数start***************
		//上一步
		$scope.backDiffFive = function(){
			$scope.isshow77 = true ;
			$scope.isshow66 = false ;
		};
		//收费项目列表
		$scope.payProList = {
			params : {
					InstanCode1 : "MODP",
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'feeProject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//查询详情
		$scope.checkProCatalogue =  function(item,$index) {
			$scope.indexNo = '';
			$scope.indexNo = $index;
			$scope.proCatalogueInf = $.parseJSON(JSON.stringify(item));
			$scope.proCatalogueInf.indexNo= $index;
			$scope.proCatalogueInf.productObjectCode  = $scope.proObjBusInsInf.productObjectCode;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/viewFeeInstan.html',
					$scope.proCatalogueInf, {
						title : T.T('YYJ510002'),
						buttons : [ T.T('F00107'), T.T('F00012')],
						size : [ '1100px', '500px' ],
						callbacks : [$scope.savePayProExample]
					});
		};
		$scope.savePayProExample = function(result){
			$scope.payProList.data[$scope.indexNo].feeInstanList = result.scope.payProExaList;
			$scope.safeApply();
			result.cancel();
		};
		//***************设置收费项目参数end***************
		//***************新增业务项目start***************
		$scope.addBusPro = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/busPro.html', '', {
				title : T.T('YYJ100011'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '640px' ],
				callbacks : [ $scope.addBusProReturn ]
			});
		};
		//*****************保存业务项目及业务类型范围start*****************
		//*****************保存业务项目及业务类型范围end*****************
		// 回调函数/确认按钮事件==========业务项目实例化确认******
		$scope.addBusProReturn = function(result) {
			console.log(result);
			if(result.scope.isshow88 == false){
				 jfLayer.fail(T.T("YYJ510003"));
				 return;
			 }
			if(result.scope.isBusProEst == false){
				 jfLayer.fail(T.T("F00086"));
				 return;
			 }
			for (var i = 0; i < result.scope.queryMODG.data.length; i++) {
				if(result.scope.queryMODG.data[i].pcdList==null && result.scope.queryMODG.data[i].pcdInitList!=null){
					result.scope.queryMODG.data[i].addPcdFlag = 	"1";
					result.scope.queryMODG.data[i].pcdList = result.scope.queryMODG.data[i].pcdInitList;
				}
			}
			$scope.busProInstanEst ={};
			result.scope.busProInstan.instanlist = result.scope.queryMODG.data;
			result.scope.busProInstan.instanCode = result.scope.busProInstan.businessProgramNo;
			$scope.busProInstanEst=result.scope.busProInstan;
			if($scope.busProInstanEst.defaultBusinessType){
				jfRest.request('productLine', 'save', $scope.busProInstanEst).then(function(data) {
					if (data.returnCode == '000000') {
						jfLayer.success(T.T('F00032'));
						$scope.busProInstanEst = {};
						 $("#s1 option").remove();
						 $("#s2 option").remove();
						$scope.setparamss = {operationMode : $rootScope.operationMods};
						jfRest.request('productLine', 'query', $scope.setparamss)
						.then(function(data) {
							var a =data.returnData.rows;
							$rootScope.s2 = {};
							$rootScope.s2 = data.returnData.rows;
							for(var i=0;i<a.length;i++){
								$("#s1").append("<option value='"+a[i].businessProgramNo+"'>"+a[i].businessProgramNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].programDesc+"</option>"); 
						   }
						});
						$scope.safeApply();
						result.cancel();
					}
				});
			}else{
				jfLayer.fail(T.T("YYJ510004"));
			}
		};
		//***************新增业务项目end***************
	});
	//***************业务项目新增***************
	//业务项目建立，业务项目范围建立，业务项目构件实例及pcd实例2222222222222222222222
	webApp.controller('busProCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $timeout,$rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.busProAndInstanInf = {};
        /** 承责属性PSN/空/null:个人承责CMP:预算单位/公司承责TOG:共同承责 [3,0] */
		 $scope.responseTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_responseType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		 $scope.productTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_productType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
//		业务类型
	 $scope.busTypeArr ={ 
		        type:"dynamicDesc", 
		        param:{operationMode:$rootScope.operationMods},//默认查询条件 
		        text:"businessTypeCode", //下拉框显示内容，根据需要修改字段名称 
		        desc:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"businessType.query",//数据源调用的action 
		        callback: function(data){
		        	console.log(data);
		        }
	 };
	 $scope.isBusPro = true;
	 $scope.isBusProEst = false;
	 $scope.isshow88 = false;
	 $scope.btnbusinessTypeShow= true;  //选择业务类型按钮
	 //点击选择业务类型
	 $scope.businessTypeShow = function(){
		 $scope.isshow88 = true;
		 $scope.btnbusinessTypeShow = false;  //选择业务类型按钮
		 var adom1I = document.getElementsByClassName('step1I');
		for(var i=0;i<adom1I.length;i++){
			adom1I[i].setAttribute('readonly',true);
			adom1I[i].classList.add('bnone');
		}
		var adom1S = document.getElementsByClassName('step1S');
		for(var i=0;i<adom1S.length;i++){
			adom1S[i].setAttribute('disabled','disabled');
		}
		$timeout(function() {
			Tansun.plugins.render('select');
		});
		 $("#s3 option").remove();
		 $("#s4 option").remove();
		$scope.paramss = {};
		jfRest.request('proObject', 'queryBusScope', $scope.paramss)
		.then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s4 = {};
			$rootScope.s4 = data.returnData.rows;
			for(var i=0;i<a.length;i++){
				$("#s3").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
		   }
		});
	 };
	/*----根据新增业务项目，和描述查询----*/
 	$scope.queryAddList = function(){
		 $("#s3").empty();
		 $scope.setparamss = {
			operationMode : $rootScope.operationMods,
			businessTypeCode: $scope.busProAndInstanInf.businessTypeCode,
			businessDesc: $scope.busProAndInstanInf.businessDesc
	 	};
		 jfRest.request('proObject', 'queryBusScope', $scope.setparamss).then(function(data) {
				var a =data.returnData.rows;
			 	console.log(a);
				$scope.arr02 = [];
				 $("#s4 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				 console.log(n);
				 if(n !=undefined && a !=null){
					//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].businessTypeCode){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s3").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
				    	}
                    }
                 }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s3").append("<option value='"+a[j].businessTypeCode+"'>"+a[j].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].businessDesc+"</option>"); 
					   }
			   }
			});
 		};
		/*----end新增业务项目，和描述查询 ----*/
		/*选择项目类型排除构件,构件与构建描述查询*/
 		$scope.queryComponentList = function(){
 			 $("#s17").empty();
 			 $scope.setparamss = {
 				operationMode : $rootScope.operationMods,
 				artifactNo: $scope.busProAndInstanInf.artifactNo,
 				artifactDesc: $scope.busProAndInstanInf.artifactDesc
 		 	};
 			jfRest.request('artifactExample', 'queryArtifactNo', $scope.setparamss).then(function(data) {
 				var a =data.returnData.rows;
			 	$scope.arr02 = [];
				 $("#s18 option").each(function () {
			        var vall = $(this).val();
			        $scope.arr02.push(vall);
			    });
				var n =$scope.arr02;
				 if(n!=undefined && a !=null){
					//查找重复数据
				    var isrep;
				    for(var j =0;j<a.length;j++){
				    	isrep = false;
				    	for(var i=0;i<n.length;i++){
					    	if(n[i]==a[j].artifactNo){
					    		isrep = true;
					    		break;
					    	}
					    }
				    	if(!isrep){
				    		$("#s17").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
				    	}
                    }
                 }else if(a !=null){
			    	  for(var i=0;i<a.length;i++){
							$("#s17").append("<option value='"+a[j].artifactNo+"'>"+a[j].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[j].artifactDesc+"</option>"); 
					   }
			      }
			});
 		};
 		/*-----end选择项目类型排除构件,构件与构建描述查询-----*/
	 //上一步
	 $scope.stepBackOne = function(){
		 $scope.twoSteps = false;//选择项目类型排除构件
		 $scope.isshow88 = false;
		 $scope.btnbusinessTypeShow = true;
		 var adom1I = document.getElementsByClassName('step1I');
		for(var i=0;i<adom1I.length;i++){
			adom1I[i].removeAttribute('readonly');
			adom1I[i].classList.remove('bnone');
		}
   		var adom1S = document.getElementsByClassName('step1S');
		for(var i=0;i<adom1S.length;i++){
			adom1S[i].removeAttribute('disabled');
		}
		$timeout(function() {
			Tansun.plugins.render('select');
		});
	 };
		//功能分配菜单
		$("#s3").dblclick(function(){  
			 var alloptions = $("#s3 option");  
			 var so = $("#s3 option:selected");  
			 $("#s4").append(so);  
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
		});  
		$("#s4").dblclick(function(){  
			 var alloptions = $("#s4 option");  
			 var so = $("#s4 option:selected");  
			 $("#s3").append(so); 
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
		});  
		$("#add4").click(function(){  
			 var alloptions = $("#s3 option");  
			 var so = $("#s3 option:selected");  
			 $("#s4").append(so); 
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
		});  
		$("#remove4").click(function(){  
			 var alloptions = $("#s4 option");  
			 var so = $("#s4 option:selected");  
			 $("#s3").append(so);
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
		});  
		$("#addall4").click(function(){  
			$("#s4").append($("#s3 option")); 
			$rootScope.valueInfo = "";
			$rootScope.valueType= "";
		});  
		$("#removeall4").click(function(){  
			$("#s3").append($("#s4 option"));  
			$rootScope.valueInfo = "";
			$rootScope.valueType= "";
		});   
		$("#s3").click(function(){  
			 var valueInfo = $("#s3 option:selected").val();
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
			 if(valueInfo){
				 $rootScope.valueInfo = valueInfo;
			 }
		});  
		$("#s4").click(function(){  
			 var valueInfo = $("#s4 option:selected").val();
			 $rootScope.valueInfo = "";
			 $rootScope.valueType= "";
			 if(valueInfo){
				 $rootScope.valueInfo = valueInfo;
			 }
			 //默认类型
			 var valueTypes = $("#s4 option:selected").val();
			 $rootScope.valueType= "";
			 if(valueTypes){
				 $rootScope.valueType = valueTypes;
			 }
		}); 
		$("#transIdenty").click(function(){ 
			$rootScope.valueType= "";
			 if($rootScope.valueInfo != "" && $rootScope.valueInfo != undefined && $rootScope.valueInfo != null){
				 $scope.soItem = {};
				 $scope.soItem.businessTypeCode = $rootScope.valueInfo;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/transIdentyMode.html', $scope.soItem, {
					title : T.T('YYJ100018'),
					buttons : [ T.T('F00012') ],
					size : [ '700px', '350px' ],
					callbacks : []
				});
			 }else{
				 jfLayer.fail(T.T('YYJ100019'));
			 }
		});
		$rootScope.valueType="";
		$("#setDefaultId3").click(function(){ 
			 if($rootScope.valueType != "" && $rootScope.valueType != undefined && $rootScope.valueType != null){
				 $scope.busProAndInstanInf.defaultBusinessType = $rootScope.valueType;
			 }else{
				 jfLayer.fail(T.T('YYJ100020'));
			 }
		});
		$scope.stepBackTwo = function(){
			 $scope.isBusPro = true;
			 $scope.isBusProEst = false;
			 $scope.isshow88 = true;
			 $scope.btnbusinessTypeShow= false;  //选择业务类型按钮
			 $scope.selInfoTwos = true;
			 $scope.twoSteps = true;
			 $scope.backShow = false;
		};
		//去排除构件
		//排除构件列表
		$scope.queryArtifactList = {
			params :  {
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			autoQuery :false,
			resource : 'productLine.queryActis',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				if(data.returnCode == '000000'){
					$scope.twoSteps = true;//排除构件div
				}else {
					$scope.twoSteps = false;//排除构件div
				}
			}
		};
		$scope.stepTo2 = function(){
			//选择项目类型排除构件 列表形式 
			$scope.busi = [];//选中的业务类型
			$scope.businessPatternList = [];//传参
			var options = $("#s4").find('option');
			for(var i =0 ; i < options.length; i++){
				$scope.busi.push(options[i].value)
            }
            if(!$scope.busi || $scope.busi.length == 0){
				jfLayer.alert(T.T('YYJ100042'));
				return;
            }
            jfRest.request('proObject', 'queryBusScope', {}).then(function(data) {
				if(data.returnCode == '000000'){
					var rows = data.returnData.rows;
					angular.forEach($scope.busi,function(item,index){
						for(var m = 0 ; m < rows.length; m++){
							if(item == rows[m].businessTypeCode){
								$scope.businessPatternList.push(rows[m].businessForm);
							}
                        }
                    });
					$scope.twoSteps = true;//排除构件div
					$scope.queryArtifactList.params.businessPatternList = $scope.businessPatternList;
					$scope.queryArtifactList.search();
                }
            });
			
			/*选择项目类型排除构件  下拉框形式
			 * $("#s17 option").remove();
			$("#s18 option").remove();
			 $scope.parquery = {
					 querybusinessTypeArtifact :true
			};
			 jfRest.request('artifactExample', 'queryArtifactNo', $scope.parquery).then(function(data) {
				console.log(data);
				$scope.selInfoTwos = true;
				$scope.backShow = false;
				var b =data.returnData.rows;
				$rootScope.s10 = {};
				$rootScope.s10 =data.returnData.rows;
				for(var i=0;i<b.length;i++){
					$("#s17").append("<option value='"+b[i].artifactNo+"'>"+b[i].artifactNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+b[i].artifactDesc+"</option>"); 
			   }
			});*/
		};
		$("#s17").dblclick(function(){  
			 var alloptions = $("#s17 option");  
			 var so = $("#s17 option:selected");  
			 $("#s18").append(so);  
		});  
		$("#s18").dblclick(function(){  
			 var alloptions = $("#s18 option");  
			 var so = $("#s18 option:selected");  
			 $("#s17").append(so);  
		});  
		$("#add17").click(function(){  
			 var alloptions = $("#s17 option");  
			 var so = $("#s17 option:selected");  
			 $("#s18").append(so); 
		});  
		$("#remove17").click(function(){  
			 var alloptions = $("#s18 option");  
			 var so = $("#s18 option:selected");  
			 $("#s17").append(so);
		});  
		$("#addall17").click(function(){  
			$("#s18").append($("#s17 option").attr("selected",true)); 
		});  
		$("#removeall17").click(function(){  
			$("#s17").append($("#s18 option").attr("selected",true));  
		});
		//返回
		$scope.stepBackThree = function(){
			$scope.selInfoTwos = false;
			$scope.twoSteps = false;
			$scope.backShow = true;
		};
		$scope.saveBusProgram = function(){
			$scope.arr4 = [];
			$scope.arr8 = [];
			$scope.S4List = {};
			$scope.S4ListResult = [];
			 $("#s4 option").each(function () {
		        var vall = $(this).val();
		        $scope.arr4.push(vall);
		    });
			 if($rootScope.s4){
				 for(var w=0;w<$rootScope.s4.length;w++){
					 for(var t=0;t<$scope.arr4.length;t++){
						if($rootScope.s4[w].businessTypeCode == $scope.arr4[t]){
							$scope.S4List = $rootScope.s4[w];
							$scope.S4ListResult.push($scope.S4List);
						}
					 }
				 }
			 }
			 $("#s18 option").each(function () {
			        var excptArtifact = $(this).val();
			        $scope.arr8.push(excptArtifact);
			    });
			 if($scope.S4ListResult.length == 0){
				 jfLayer.fail(T.T("YYJ100021"));
				 return;
			 }
			$scope.busProAndInstanInf.list = $scope.S4ListResult;
			$scope.busProAndInstanInf.operationMode = $rootScope.operationMods;
			$scope.busProAndInstanInf.businessProgramNo = 'MODG'+$scope.busProAndInstanInf.businessProgramNoHalf;
			$scope.busProInstan = $scope.busProAndInstanInf;
			$scope.queryMODG.params.instanDimen1 = "MODG";
			$scope.queryMODG.params.instanCode = $scope.busProInstan.businessProgramNo;
			$scope.queryMODG.params.excptArtifactList = $scope.arr8;
			$scope.queryMODG.search();		
			$scope.isBusPro = false;
			$scope.isBusProEst = true;
		};
		//***************新增业务类型start***************
		$scope.addBusType = function() {
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/businessTypePramsMgt.html', '', {
				title : T.T('YYJ100012'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1050px', '630px' ],
				callbacks : [ $scope.saveBusinessType ]
			});
		};
		$scope.proObjInstanBusTypeInstan ={};
		$scope.saveBusinessType = function(result){
			//验证本金利息费用余额对象不能为空
			if(!result.scope.busTypeInfo.defaultPrincipalBalanceObj || result.scope.busTypeInfo.defaultPrincipalBalanceObj == 'null'){//本金余额对象
				jfLayer.fail(T.T("YYJ200036"));
				return;
            }
            if(!result.scope.busTypeInfo.defaultInterestBalanceObj || result.scope.busTypeInfo.defaultInterestBalanceObj == 'null'){//利息余额对象
				jfLayer.fail(T.T("YYJ200037"));
				return;
            }
            if(!result.scope.busTypeInfo.defaultFeeBalanceObj || result.scope.busTypeInfo.defaultFeeBalanceObj == 'null'){//费用余额对象
				jfLayer.fail(T.T("YYJ200038"));
				return;
            }
            if(!$rootScope.sure){
				jfLayer.fail(T.T('F00086'));
				return;
			}
			$scope.busTypeInfoEst = result.scope.busTypeInfo;
			$scope.busTypeInfoEst.instanlist = [];
			$scope.busTypeInfoEst.businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
			$scope.busTypeInfoEst.operationMode = $rootScope.operationMods;
			if(result.scope.queryBalanceObject.data){
				for(var i=0;i<result.scope.queryBalanceObject.data.length;i++){
					if(result.scope.queryBalanceObject.data[i].instanlist){
						for(var k=0;k<result.scope.queryBalanceObject.data[i].instanlist.length;k++){
							result.scope.queryBalanceObject.data[i].instanlist[k].businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
							result.scope.queryBalanceObject.data[i].instanlist[k].instanCode2 = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
							$scope.busTypeInfoEst.instanlist.push(result.scope.queryBalanceObject.data[i].instanlist[k]);
						}
					}else{
						for(var h=0;h<result.scope.queryBalanceObject.data[i].balanceInstanList.length;h++){
							result.scope.queryBalanceObject.data[i].balanceInstanList[h].businessTypeCode = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
							result.scope.queryBalanceObject.data[i].balanceInstanList[h].instanCode2 = 'MODT'+ result.scope.busTypeInfo.businessTypeCodeHalf;
							$scope.busTypeInfoEst.instanlist.push(result.scope.queryBalanceObject.data[i].balanceInstanList[h]);
						}
					}
				}
				for (var j = 0; j < $scope.busTypeInfoEst.instanlist.length; j++) {
					if($scope.busTypeInfoEst.instanlist[j].pcdList==null && $scope.busTypeInfoEst.instanlist[j].pcdInitList!=null){
						$scope.busTypeInfoEst.instanlist[j].addPcdFlag = "1";
						$scope.busTypeInfoEst.instanlist[j].pcdList = $scope.busTypeInfoEst.instanlist[j].pcdInitList;
					}
				}
			}
			for (var i = 0; i < result.scope.queryMODT.data.length; i++) {
				if(result.scope.queryMODT.data[i].pcdList==null && result.scope.queryMODT.data[i].pcdInitList!=null){
					result.scope.queryMODT.data[i].addPcdFlag = "1";
					result.scope.queryMODT.data[i].pcdList = result.scope.queryMODT.data[i].pcdInitList;
				}
				$scope.busTypeInfoEst.instanlist.push(result.scope.queryMODT.data[i]);
			}
			jfRest.request('businessType', 'save', $scope.busTypeInfoEst).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstanBusTypeInstan = $scope.busTypeInfoEst;
					result.scope.businessTypesFormoooo.$setPristine();
					$("#s3 option").remove();
					 $("#s4 option").remove();
					$scope.paramss = {};
					jfRest.request('proObject', 'queryBusScope', $scope.paramss)
					.then(function(data) {
						var a =data.returnData.rows;
						$rootScope.s4 = {};
						$rootScope.s4 = data.returnData.rows;
						for(var i=0;i<a.length;i++){
							$("#s3").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
					   }
					});
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		// 回调函数/确认按钮事件
		$scope.addBusTypEstReturn = function(result) {
			console.log(result);
			for (var i = 0; i < result.scope.queryMODT.data.length; i++) {
				if(result.scope.queryMODT.data[i].pcdList==null && result.scope.queryMODT.data[i].pcdInitList!=null){
					result.scope.queryMODT.data[i].addPcdFlag = "1";
					result.scope.queryMODT.data[i].pcdList = result.scope.queryMODT.data[i].pcdInitList;
				}
			}
			$scope.proObjInstanBusTypeInstanA ={};
			result.scope.proObjInstanBusTypeInstan.instanlist = result.scope.queryMODT.data;
			result.scope.proObjInstanBusTypeInstan.instanCode = result.scope.proObjInstanBusTypeInstan.businessTypeCode;
			$scope.proObjInstanBusTypeInstanA = result.scope.proObjInstanBusTypeInstan;
			jfRest.request('artifactExample', 'saveMore', $scope.proObjInstanBusTypeInstanA).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					//$scope.proObjInstanBusTypeInstanA = {};
					//$scope.treeSelectBusTypInstan = [];
					//$scope.busTypeListTable.search();
					$("#s3 option").remove();
					 $("#s4 option").remove();
					$scope.paramss = {};
					jfRest.request('proObject', 'queryBusScope', $scope.paramss)
					.then(function(data) {
						var a =data.returnData.rows;
						$rootScope.s4 = {};
						$rootScope.s4 = data.returnData.rows;
						for(var i=0;i<a.length;i++){
							$("#s3").append("<option value='"+a[i].businessTypeCode+"'>"+a[i].businessTypeCode+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].businessDesc+"</option>"); 
					   }
					});
					$scope.safeApply();
					result.cancel();
				}else{
					var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00033');
					jfLayer.fail(returnMsg);
				}
			});
		};
		//***************新增业务类型end***************
		//***************业务项目构件实例start***************
		//查询业务项目实例构件
		$scope.queryMODG = {
			params : $scope.queryParam = {
					//instanDimen1 : "MODG",
				//	instanCode:$scope.busProInstan.businessProgramNo
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			autoQuery :false,
			resource : 'artifactExample.querySelectArtifact',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		//业务项目实例化时，点击替换参数的方法
		$scope.updateBusProB = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title : T.T('F00138'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseBusPro]
				});
		};
		//新建余额对象实例化时，点击设置参数值的方法
		$scope.setBusProB = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseBusProTwo]
				});
		};
			$scope.choseBusPro = function(result) {
				if (!result.scope.elementNoTable.validCheck()) {
					return;
				}
				$scope.items = {};
				$scope.items = result.scope.elementNoTable.checkedList();
				$scope.queryMODG.data[$scope.indexNo].elementNo = $scope.items.elementNo;
				$scope.queryMODG.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
				$scope.queryMODG.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryMODG.data[$scope.indexNo].elementNo = $scope.items.elementNo;
				$scope.queryMODG.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
				if (result.scope.pcdInstanShow) {
					$scope.queryMODG.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
					$scope.queryMODG.data[$scope.indexNo].addPcdFlag = 	"1";
				} 
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseBusProTwo = function(result) {
				$scope.items = {};
				$scope.queryMODG.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryMODG.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODG.data[$scope.indexNo].addPcdFlag = 	"1";
				$scope.safeApply();
				result.cancel();
			}
		//***************构件实例end***************
	});
	//***************交易识别列表strat***************
	// 交易识别列表22222222222222
	webApp.controller('transIdentyModeCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translate.refresh();
		$rootScope.valueInfo = "";
		//交易识别列表
		$scope.tranIdentyModeList = {
				params : $scope.queryParam = {
						operationMode:$rootScope.operationMods,
						businessTypeCode:$scope.soItem.businessTypeCode
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'busTypeTransIden.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	//***************交易识别列表end***************
	//****************** 余额对象start***************
	// 余额对象列表查询66666666666666
	webApp.controller('balanceObjectOneCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_balanceType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {}
		};
		 //利息入账余额对象
		 $scope.interestPostingBalanceObjectArr ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'I',operationMode:$rootScope.operationMods},//默认查询条件 
	        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:  "objectDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        	
	        }
	    };
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  var startDate = laydate.render({
				elem: '#beginDateId',
				min:Date.now(),
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
				}
			});
			var endDate = laydate.render({
				elem: '#endDateId',
				//min:Date.now(),
				done: function(value, date) {
					startDate.config.max = {
						year: date.year,
						month: date.month - 1,
						date: date.date,
					}
				}
			});
		});
	});
	//****************** 余额对象end***************
	//****************** 余额对象实例化start***************
	// 余额对象列表查询4444444444444444
	webApp.controller('balanceObjectOneBTPMEstCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		 //利息入账余额对象
		 $scope.interestPostingBalanceObjectArr ={ 
			        type:"dynamic", 
			        param:{objectType:'I',operationMode:$rootScope.operationMods},//默认查询条件 
			        text:  "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
			        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"balanceObject.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
			//查询余额对象实例构件
		 $scope.queryMODB = {};
		 $scope.queryMODB = $scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].balanceInstanList;
		//新建余额对象实例化时，点击替换参数的方法
		$scope.updateElementABTPM = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title : T.T('F00138'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElement]
				});
		};
		//新建余额对象实例化时，点击设置参数值的方法
		$scope.setElementABTPM = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [  T.T('F00107'), T.T('F00012')  ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTwo]
				});
		};
			$scope.choseElement = function(result) {
				if (!result.scope.elementNoTable.validCheck()) {
					return;
				}
				$scope.items = {};
				$scope.items = result.scope.elementNoTable.checkedList();
				$scope.queryMODB[$scope.indexNo].elementNo = $scope.items.elementNo;
				$scope.queryMODB[$scope.indexNo].elementDesc = $scope.items.elementDesc;
				$scope.queryMODB[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].balanceInstanList[$scope.indexNo].elementNo = $scope.items.elementNo;
				$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].balanceInstanList[$scope.indexNo].elementDesc = $scope.items.elementDesc;
				$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].balanceInstanList[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				if (result.scope.pcdInstanShow) {
					$scope.queryMODB[$scope.indexNo].pcdList = result.scope.pcdInfTable;
					$scope.queryMODB[$scope.indexNo].addPcdFlag = 	"1";
					$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].pcdList = result.scope.pcdInfTable;
					$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].addPcdFlag = 	"1";
				} 
				$scope.safeApply();
				result.cancel();
			};
			$scope.choseElementTwo = function(result) {
				$scope.items = {};
				$scope.queryMODB[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryMODB[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODB[$scope.indexNo].addPcdFlag = 	"1";
				$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].performOrder = result.scope.artifactInfo.performOrder;
				$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].pcdList = result.scope.pcdInfTable;
				$scope.queryBalanceObject.data[$scope.proObjInstan.indexNum].addPcdFlag = 	"1";
				$scope.safeApply();
				result.cancel();
			}
	});
	//****************** 余额对象实例化end***************
	//****************** 业务类型建立***************
	//业务类型建立33333333333333333333333
	webApp.controller('businessTypePramsMgtCtrl', function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.businessNatureArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_businessNature",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.transIdenArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_transIden",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		 //	业务形态
		 $scope.businessFormArray ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"patternDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"businessPattern",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessForm.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //本金余额对象
		 $scope.prinBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'P',operationMode:$rootScope.operationMods},//默认查询条件 
	        text:"balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //利息余额对象
		 $scope.intBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'I',operationMode:$rootScope.operationMods},//默认查询条件 
	        text: "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		 //费用余额对象
		 $scope.feeBalanceObject ={ 
	        type:"dynamicDesc", 
	        param:{objectType:'F',operationMode:$rootScope.operationMods},//默认查询条件 
	        text: "balanceObjectCode", //下拉框显示内容，根据需要修改字段名称 
	        desc:"objectDesc",
	        value:"balanceObjectCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"balanceObject.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		//余额对象列表
		$scope.queryBalanceObject = {
			params : {
				instanFlag:1,
				operationMode:$rootScope.operationMods
			}, // 表格查询时的参数信息
			paging : false,// 默认true,是否分页
			resource : 'balanceObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_balanceType'],//查找数据字典所需参数
			transDict : ['objectType_objectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
		$scope.step1 = true;
		$scope.step2 = false;
		$scope.btnStep1 = true;
		$scope.step12 = false;
		$rootScope.sure = false;
		//点击第一步
		$scope.stepTo2BTPM = function(){
			var adom1I = document.getElementsByClassName('step1I');
  			for(var i=0;i<adom1I.length;i++){
  				adom1I[i].setAttribute('readonly',true);
  				adom1I[i].classList.add('bnone');
  			}
  			var adom1S = document.getElementsByClassName('step1S');
  			for(var i=0;i<adom1S.length;i++){
  				adom1S[i].setAttribute('disabled','disabled');
  			}
  			$timeout(function() {
				Tansun.plugins.render('select');
			});
  			$scope.btnStep1 = false;
  			$scope.step12 = true;
  			$rootScope.sure = false;
		};
		//返回第一步
		$scope.stepBack1 = function(){
			$scope.step1 = true;
			$scope.step2 = false;
			$scope.btnStep1 = true;
			$scope.step12 = false;
			$rootScope.sure = false;
			var adom1I = document.getElementsByClassName('step1I');
  			for(var i=0;i<adom1I.length;i++){
  				adom1I[i].removeAttribute('readonly');
  				adom1I[i].classList.remove('bnone');
  			}
      		var adom1S = document.getElementsByClassName('step1S');
  			for(var i=0;i<adom1S.length;i++){
  				adom1S[i].removeAttribute('disabled');
  			}
  			$timeout(function() {
				Tansun.plugins.render('select');
			});
		};
		//去往第三步
		$scope.stepTo3 = function(){
			$scope.step1 = false;
			$scope.step2 = true;
			$scope.busEstN={};
			$scope.busEstN.businessTypeCode = 'MODT'+ $scope.busTypeInfo.businessTypeCodeHalf;
			$scope.busEstN.businessDesc = $scope.busTypeInfo.businessDesc;
			$scope.queryMODT.params.instanDimen1 = "MODT";
			$scope.queryMODT.params.instanCode = $scope.busEstN.businessTypeCode;
			$scope.queryMODT.search();	
			$rootScope.sure = true;
		};
		$scope.stepBack2 = function(){
			$scope.step1 = true;
			$scope.step2 = false;
			$rootScope.sure = false;
		};
		//新建余额对象
		$scope.addBalanceObjectb = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/balanceObjectOne.html', ' ', {
				title : T.T('F00143'),
				buttons : [ T.T('F00107'), T.T('F00012')],
				size : [ '1000px', '380px' ],
				callbacks : [$scope.saveBalanceObject]
			});
		};
		$scope.balanceObjInf = {};
		$scope.saveBalanceObject = function(result){
			$scope.balanceObjInf.balanceObjectCode = "MODB"+result.scope.balanceObjInf.balanceObjectCodeHalf;
			$scope.balanceObjInf.operationMode = $rootScope.operationMods;
			$scope.balanceObjInf.beginDate = $("#beginDateId").val();
			$scope.balanceObjInf.endDate = $("#endDateId").val();
			jfRest.request('balanceObject', 'save', $scope.balanceObjInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.proObjInstan = {};
					$scope.proObjInstan = $scope.balanceObjInf;
					$scope.balanceObjInf = {};
					result.scope.balanceObjOneForm.$setPristine();
					$scope.safeApply();
					result.cancel();
					$scope.queryBalanceObject.search();
				}
			});
		};
		$scope.busTypeInfo = {};
		//点击配置参数==========余额对象实例化
		$scope.setBalanceBTPM = function(item,$index){
			if($scope.busTypeInfo.businessTypeCodeHalf){
				$scope.indexNo = '';
				$scope.indexNo = $index;
				//弹框查询列表元件
				$scope.proObjInstan = {};
				$scope.proObjInstan = $scope.queryBalanceObject.data[$scope.indexNo];
				$scope.proObjInstan.instanBCode1 = $scope.busTypeInfo.businessTypeCodeHalf;
				$scope.proObjInstan.indexNum = $scope.indexNo;
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/balanceObjectOneBTPMEst.html', $scope.proObjInstan, {
					title : T.T('YYJ200023'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.saveElementInfo]
				});
			}else{
				jfLayer.fail(T.T("YYJ200024"));
			}
		};
		//配置参数确定事件
		$scope.saveElementInfo = function(result){
			for (var i = 0; i < result.scope.queryMODB.length; i++) {
				if(result.scope.queryMODB[i].pcdList==null && result.scope.queryMODB[i].pcdInitList!=null){
					result.scope.queryMODB[i].addPcdFlag = "1";
					result.scope.queryMODB[i].pcdList = result.scope.queryMODB[i].pcdInitList;
				}
			}
			$scope.queryBalanceObject.data[$scope.indexNo].instanlist = result.scope.queryMODB;
			$scope.safeApply();
			result.cancel();
		};
		//查询业务类型实例构件
		$scope.queryMODT = {
				params : $scope.queryParam = {
						instanDimen1 : "MODT",
						instanCode:$scope.proObjInstanBusTypeInstan.businessTypeCode,
				}, // 表格查询时的参数信息
				paging : false,// 默认true,是否分页
				autoQuery :true,
				resource : 'artifactExample.querySelectArtifact',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					
				}
			};
		//替换参数
		$scope.updateTypeEstA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsNo = {};
			$scope.itemsNo = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectElementNo.html', $scope.itemsNo, {
					title : T.T('F00138'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTypeEst]
				});
		};
		//设置参数值
		$scope.setTypeEstA = function(item,$index){
			$scope.indexNo = '';
			$scope.indexNo = $index;
			//弹框查询列表元件
			$scope.itemsPCD = {};
			$scope.itemsPCD = $.parseJSON(JSON.stringify(item));
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/businessParamsOverview/selectPCD.html', $scope.itemsPCD, {
					title : T.T('F00083')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1100px', '500px' ],
					callbacks : [$scope.choseElementTypeEstTwo]
				});
		};
		$scope.choseElementTypeEst = function(result) {
			if (!result.scope.elementNoTable.validCheck()) {
				return;
			}
			$scope.items = {};
			$scope.items = result.scope.elementNoTable.checkedList();
			$scope.queryMODT.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODT.data[$scope.indexNo].elementNo = $scope.items.elementNo;
			$scope.queryMODT.data[$scope.indexNo].elementDesc = $scope.items.elementDesc;
			if (result.scope.pcdInstanShow) {
				$scope.queryMODT.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
				$scope.queryMODT.data[$scope.indexNo].addPcdFlag = 	"1";
			} 
			$scope.safeApply();
			result.cancel();
		};
		$scope.choseElementTypeEstTwo = function(result) {
			$scope.queryMODT.data[$scope.indexNo].performOrder = result.scope.artifactInfo.performOrder;
			$scope.queryMODT.data[$scope.indexNo].pcdList = result.scope.pcdInfTable;
			$scope.queryMODT.data[$scope.indexNo].addPcdFlag = 	"1";
			$scope.safeApply();
			result.cancel();
		}
	});
	//******************************替换参数55555555555555555***************
	webApp.controller('selectElementNoCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
	//******************************余额对象设置参数值pcd修改33333***************
	webApp.controller('selectDiffPCDCtrl',function($scope, $stateParams, $timeout,jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.pcdExampleInf ={};
		var count = 1;
		$scope.pcdExampleInf = $scope.itemsPCDDiff;
		$scope.artifactInfo = $scope.itemsPCDDiff;
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
					$scope.baseInstanDimenDiffu = $scope.pcdExampleInf.baseInstanDimen;
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
					$scope.optionInstanDimenDiffu = $scope.pcdExampleInf.optionInstanDimen;
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
				$scope.segmentTypeDiffu = $scope.pcdExampleInf.segmentType;
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
				$scope.pcdTypeDiffu = $scope.pcdExampleInf.pcdType;
				$timeout(function() {
					Tansun.plugins.render('select');
				});
			}
		};
		//获取修改后的取值类型
        var form = layui.form;
		 form.on('select(getPcdTypeDiff)',function(event){
			 $scope.pcdTypeDiffu = event.value;
		 });
		//新增pcd差异化不显示
		$scope.showNewPcdInfo = false;
		$scope.optionShowView = false;
		$scope.baseShowView = false;
		$scope.pcdInfTable = [];
		if($scope.artifactInfo.optionInstanCode){
			$scope.optionShowView = true;
		}
		if($scope.artifactInfo.baseInstanCode){
			$scope.baseShowView = true;
		}
		// pcd差异化实例 新增按钮
		$scope.newPcdBtn = function() {
			$scope.indexNoTemp = '';
			if($scope.pcdInfTable.length==0){
				jfLayer.fail(T.T("YYJ400052"));
				return;
			}
            $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
            if($scope.showNewPcdInfo){
            	$scope.pcdExampleInf.segmentSerialNum = count++;
            }
        };
		$scope.pcdInstanShow = true;
		$scope.pcdExampleInf.pcdNo = $scope.itemsPCDDiff.pcdNo.substring(0,8);
		if($scope.itemsPCDDiff.segmentType!=null && $scope.itemsPCDDiff.segmentType!="null"){//分段类型不为空
			$scope.segmentTypeDiffu =  $scope.itemsPCDDiff.segmentType;
			$scope.addButtonShow = true;
		}else{
			$scope.addButtonShow = false;
		}
		if($scope.itemsPCDDiff.pcdInitList!=null){
			$scope.pcdInfTable = $scope.itemsPCDDiff.pcdInitList;
		}else{
			$scope.showNewPcdInfo = true;
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
			  if(null==$scope.pcdExampleInf.pcdPoint|| ""===$scope.pcdExampleInf.pcdPoint|| null==$scope.pcdTypeDiffu 
					  || ""===$scope.pcdTypeDiffu  ||  null==$scope.pcdExampleInf.pcdValue ||  ""===$scope.pcdExampleInf.pcdValue 
	    			  ) {
	    		   jfLayer.fail(T.T('YYJ400049'));
	    		   return;
	    	   } 
				var pcdInfTableInfoU = {};
				pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
				pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
				pcdInfTableInfoU.pcdType = $scope.pcdTypeDiffu;
				pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
				pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
				pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
				pcdInfTableInfoU.optionInstanCode = $scope.pcdExampleInf.optionInstanCode;
				pcdInfTableInfoU.baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
				pcdInfTableInfoU.indexNo = $scope.pcdExampleInf.indexNo;
				if($scope.indexNoTemp!= undefined && $scope.indexNoTemp!=null){
					$scope.pcdInfTable[$scope.indexNoTemp].segmentSerialNum = 	$scope.pcdExampleInf.segmentSerialNum;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdType = 	 $scope.pcdTypeDiffu;
					$scope.pcdInfTable[$scope.indexNoTemp].segmentValue = 	 $scope.pcdExampleInf.segmentValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdValue = 	 $scope.pcdExampleInf.pcdValue;
					$scope.pcdInfTable[$scope.indexNoTemp].pcdPoint = $scope.pcdExampleInf.pcdPoint;
					$scope.pcdInfTable[$scope.indexNoTemp].optionInstanCode = 	 $scope.pcdExampleInf.optionInstanCode;
					$scope.pcdInfTable[$scope.indexNoTemp].baseInstanCode = $scope.pcdExampleInf.baseInstanCode;
					$scope.indexNo = null;
				}else{
					$scope.pcdInfTable.push(pcdInfTableInfoU);
				}
				$scope.pcdExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
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
			$scope.choseInstanCode1Btn = function() {
				$scope.checkValidate();
				//获取维度取值1的值
				dataValueCount =1;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen1);
			};
			$scope.choseInstanCode2Btn = function() {
				$scope.checkValidate();
				//获取维度取值2的值
				dataValueCount =2;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen2);
			};
			$scope.choseInstanCode3Btn = function() {
				$scope.checkValidate();
				//获取维度取值3的值
				dataValueCount =3;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen3);
			};
			$scope.choseInstanCode4Btn = function() {
				$scope.checkValidate();
				//获取维度取值4的值
				dataValueCount =4;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen4);
			};
			$scope.choseInstanCode5Btn = function() {
				$scope.checkValidate();
				//获取维度取值5的值
				dataValueCount =5;
				$scope.chosedInstanCode($scope.artifactExampleInf.instanDimen5);
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
	//***************查看业务项目详情strat555555555555***************
	webApp.controller('busProInfoCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		$rootScope.valueInfoPro = "";
		$scope.busListTableView = {
				params : $scope.queryParam = {
						businessProgramNo : $scope.soItemPro.businessProgramNo,
						operationMode : $rootScope.operationMods,
						pageSize:10,
						indexNo:0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				autoQuery:true,
				resource : 'productLineBusType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
		};
		$scope.ComArtifactView = {
			params : {instanCode:$scope.proLineInf.businessProgramNo,operationMode:$rootScope.operationMods}, // 表格查询时的参数信息
			autoQuery : true,
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				console.log(data);
			}
		};
		 $scope.responseTypeArr= {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_responseType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.responseTypeView = $scope.proLineInf.responseType;
				//针对系统目前存在的承责属性未赋值的业务项目时，系统使用时，默认此项为个人承责。所以当此项为空或null时查询/修改页面显示为“个人承责”。
				if($scope.proLineInf.responseType == null || $scope.proLineInf.responseType == 'null'){
					$scope.responseTypeView = 'PSN';
                }
            }
		};
		//		业务类型
		 $scope.busTypeArr ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessType.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.proLineInf.disputeBusinessTypeView  = $scope.proLineInf.disputeBusinessType;
	        }
	    };
//			业务类型
		 $scope.busTypeArrView ={ 
	        type:"dynamic", 
	        param:{},//默认查询条件 
	        text:"businessDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"businessTypeCode",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"businessType.query",//数据源调用的action 
	        callback: function(data){
	        	$scope.proLineInf.feeBusinessTypeView  = $scope.proLineInf.feeBusinessType;
	        }
	    };
		//产品构件实例====详情
		$scope.queryArtifactBP = function(item) {
			$scope.itemArtifact = {};
			// 页面弹出框事件(弹出页面)
			$scope.itemArtifact = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/businessParamsOverview/busParViewArtifact.html', $scope.itemArtifact, {
				title : T.T('F00075'),
				buttons : [  T.T('F00012')],
				size : [ '1100px', '530px'  ],
				callbacks : []
			});
		};
	});
	//***************查看业务项目详情end***************
	//业务类型
	webApp.controller('choseBusinessTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		//业务类型列表
		$scope.businessTypeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessType.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//媒介对象
	webApp.controller('choseMediaObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translate.refresh();
		//媒介对象列表
		$scope.mediaObjectList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'mediaObject.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数

			}
		};
	});
	//余额对象
	webApp.controller('choseBalanceObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translate.refresh();
		//余额类型====P本金   I利息    F费用
		$scope.objectTypeArr = {
				type : "dictData",
				param : {
					"type" : "DROPDOWNBOX",
					groupsCode : "dic_balanceType",
					queryFlag : "children"
				},// 默认查询条件
				text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
				value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
				resource : "paramsManage.query",// 数据源调用的action
				callback : function(data) {}
			};
		// 余额对象列表
		$scope.balanceObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" : $rootScope.operationMods,
				pageSize : 10,
				indexNo : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'balanceObject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_balanceType'],//查找数据字典所需参数
			transDict : ['objectType_objectTypeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//产品对象
	webApp.controller('choseProductObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//产品對象列表
		$scope.proObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//业务项目
	webApp.controller('choseProductLineCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//业务项目列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
				"operationMode" :$rootScope.operationMods,
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//事件
	webApp.controller('choseEventCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
	//币种
	webApp.controller('choseCurrencyCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		//货币列表
		$scope.currencyTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//核算状态
	webApp.controller('choseAcstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.accountStateTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'accountState.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	//授权场景
	webApp.controller('choseScenarioCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.scenarioList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'authScene.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	//额度节点
	webApp.controller('choseQuotaTreeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.quotaTreeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"operationMode" :$rootScope.operationMods,
					"authDataSynFlag":"1",
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'quotaNode.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	//延滞层级
	webApp.controller('choseDelvCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.delvTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'delv.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				
			}
		};
	});
	//封锁码
	webApp.controller('choseBlockCodeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		/*管控范围  C：客户级   A：业务类型级  P：产品级  M：媒介级G:业务项目*/
		$scope.blockCodeRangeArr = {
   			type : "dictData",
   			param : {
   				"type" : "DROPDOWNBOX",
   			    groupsCode : "dic_effectiveScope",
   				queryFlag : "children"
   			},// 默认查询条件
   			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
   			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
   			resource : "paramsManage.query",// 数据源调用的action
   			callback : function(data) {
   			}
   		};
		//管控码类别
		$scope.blockTypeArr = {
			type : "dictData",
			param : {
				"type" : "DROPDOWNBOX",
				groupsCode : "dic_effectiveCodeType",
				queryFlag : "children"
			},// 默认查询条件
			text : "detailDesc", // 下拉框显示内容，根据需要修改字段名称
			value : "codes", // 下拉框对应文本的值，根据需要修改字段名称
			resource : "paramsManage.query",// 数据源调用的action
			callback : function(data) {
			}
		};
		//封锁码列表
		$scope.blockCDScnMgtTable = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCode.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_effectiveScope'],//查找数据字典所需参数
			transDict : ['effectivenessCodeScope_effectivenessCodeScopeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
	});
	webApp.controller('viewProductObjectCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translate.refresh();
		$scope.productObjectListTable = {
			//checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//查看6666666666666
	webApp.controller('BPArtifactCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态ACT-核算状态CUR-币种
		$scope.segmentTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_segmentationType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "codes", //下拉框显示内容，根据需要修改字段名称 
			desc: "detailDesc",
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			$scope.segmentTypeInfoD = $scope.pcdExampleInf.segmentType;
			}
		};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.itemArtifact.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.segmentTypeInfoD =  data.returnData.rows[0].segmentType;
					$scope.pcdInstanList = [];
					$scope.pcdInstanList.push(data.returnData.rows[0].pcdInitList);
					$scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
      //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	 //pcd差异列表
           $scope.pcdInfTable = [];
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.itemArtifact.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.itemArtifact.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.itemArtifact.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.itemArtifact.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.itemArtifact.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.itemArtifact.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.itemArtifact.instanCode5;
    	   $scope.queryPcdExample.addPcdFlag = '2';
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }else if($scope.pcdInstanList.length > 0){
    				   $scope.pcdInfTable = $scope.pcdInstanList[0];
    			   }
    		   }
    	   });
       }
	});
	//查看888888888888
	webApp.controller('viewFeeInstanCtrl', function($scope, $stateParams,$timeout, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.methodShow = false;
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.payProExaList=[];
		$scope.feeTypeArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_costCategory",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.feeTypeInfo = $scope.proCatalogueInf.feeType;
			}
		};
		$scope.proCatalogueInf = $scope.proCatalogueInf;
		$scope.proCatalogueInf.instanDimen1 = $scope.proCatalogueInf.instanCode1;
		$scope.proCatalogueInf.instanDimen2 = $scope.proCatalogueInf.instanCode2;
		$scope.proCatalogueInf.instanDimen3 = $scope.proCatalogueInf.instanCode3;
		$scope.proCatalogueInf.instanDimen4 = $scope.proCatalogueInf.instanCode4;
		$scope.proCatalogueInf.instanDimen5 = $scope.proCatalogueInf.instanCode5;
		 $scope.proCatalogueInf.instanCode1="";
		 $scope.proCatalogueInf.instanCode2="";
		 $scope.proCatalogueInf.instanCode3="";
		 $scope.proCatalogueInf.instanCode4="";
		 $scope.proCatalogueInf.instanCode5="";
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewPayProExaOperationMode = $scope.proCatalogueInf.operationMode;
		        }
		    };
		//查询收费项目
		$scope.feeItemArr ={ 
		        type:"dynamic", 
		        param:{feeItemNo:$scope.proCatalogueInf.feeItemNo},//默认查询条件 
		        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"feeProject.query",//数据源调用的action 
		        callback: function(data){
		        	if(data!=null && data.length!=0){
		        	$scope.proCatalogueInf.feeType = data[0].feeType;
		        	$scope.proCatalogueInf.assessmentMethod = data[0].assessmentMethod;
		        	$scope.showFee();
		        	}
		        }
		    };
		//收费项目实例列表
		$scope.payProExaList =[];
		$scope.showFee = function(){
			if($scope.proCatalogueInf.assessmentMethod =="M" || $scope.proCatalogueInf.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
		if(null!=$scope.proCatalogueInf.feeInstanList && $scope.proCatalogueInf.feeInstanList.length>0){
			$scope.payProExaList = $scope.proCatalogueInf.feeInstanList;
        }
		// 查看
		$scope.checkPayProExa = function(event) {
			$scope.payProExampleInf = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/payProject/viewPayProExa.html',
			$scope.payProExampleInf, {
				title : T.T('YYJ1300032'),
				buttons : [ T.T('F00012') ],
				size : [ '1050px', '600px' ],
				callbacks : []
			});
		};
		//设置收费项目参数
		$scope.addFeeinstanCode =  function() {
			$scope.params = $.parseJSON(JSON.stringify($scope.proCatalogueInf));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/setFeeProExample.html',
			$scope.params, {
				title : T.T('YYJ1300041'),
				buttons : [  T.T('F00107'),T.T('F00012')],
				size : [ '1100px', '600px' ],
				callbacks : [$scope.savePayProExample2]
			});
		};
		$scope.savePayProExample2 = function(result){
			$scope.payProExampleInf = {};
			$scope.payProExampleInf =  Object.assign(result.scope.payProExampleInf , result.scope.payProExampleInf2);
			$scope.payProExampleInf.instanDimen1 = result.scope.instanDimenD1 ;
			$scope.payProExampleInf.instanDimen2 = result.scope.instanDimenD2 ;
			$scope.payProExampleInf.instanDimen3 = result.scope.instanDimenD3 ;
			$scope.payProExampleInf.instanDimen4 = result.scope.instanDimenD4 ;
			$scope.payProExampleInf.instanDimen5 = result.scope.instanDimenD5 ;
			$scope.payProExampleInf.assessmentMethod = result.scope.assessmentMethodDiff ;
			$scope.payProExampleInf.feeCollectType = result.scope.feeCollectTypeDiff ;
			$scope.payProExampleInf.waiveCycle = result.scope.waiveCycleDiff ;
			$scope.payProExampleInf.feeFlag = result.scope.feeFlagDiff ;
			$scope.payProExampleInf.matrixAppMode = result.scope.matrixAppModeDiff ;
			$scope.payProExampleInf.feeMatrixApplicationDimension = result.scope.feeMatrixApplicationDimensionDiff ;
			$scope.payProExampleInf.matchRelation1 = result.scope.matchRelation01d ;
			$scope.payProExampleInf.matchRelation2 = result.scope.matchRelation02d ;
			$scope.payProExampleInf.matchRelation3 = result.scope.matchRelation03d ;
			$scope.payProExampleInf.matchRelation4 = result.scope.matchRelation04d ;
			$scope.payProExampleInf.matchRelation5 = result.scope.matchRelation05d ;
			if($scope.payProExampleInf.feeItemNo == "LCHG025" && (result.scope.feeMatrixApplicationDimensionDiff == "" || 
					result.scope.feeMatrixApplicationDimensionDiff ==  undefined || result.scope.feeMatrixApplicationDimensionDiff ==  "undefined")){
				jfLayer.fail(T.T("YYJ1300042"));
				return;
            }
            if((result.scope.feeMatrixApplicationDimensionDiff != "" || result.scope.feeMatrixApplicationDimensionDiff !=  undefined ||
					result.scope.feeMatrixApplicationDimensionDiff !=  "undefined") && (result.scope.matrixAppModeDiff != "" || 
					result.scope.matrixAppModeDiff !=  undefined || result.scope.matrixAppModeDiff !=  "undefined")){
				if(result.scope.feeMatrixApplicationDimensionDiff == "2" && result.scope.matrixAppModeDiff == "P"){
					jfLayer.fail(T.T("YYJ1300043"));
					return;
				}
            }
            if(result.scope.instanDimenD1 && result.scope.instanDimenD1 !="null"){
				if($scope.payProExampleInf.instanCode1 =="" || $scope.payProExampleInf.instanCode1 ==  undefined || 
						$scope.payProExampleInf.instanCode1 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300044"));
							return;
				}
            }
            if(result.scope.instanDimenD2  && result.scope.instanDimenD2 !="null"){
				if($scope.payProExampleInf.instanCode2 =="" || $scope.payProExampleInf.instanCode2 ==  undefined || 
					$scope.payProExampleInf.instanCode2 ==  "undefined"){
						jfLayer.fail(T.T("YYJ1300045"));
						return;
				}
            }
            if(result.scope.instanDimenD3  && result.scope.instanDimenD3 !="null"){
				if($scope.payProExampleInf.instanCode3 =="" || $scope.payProExampleInf.instanCode3 ==  undefined || 
					$scope.payProExampleInf.instanCode3 ==  "undefined"){
						jfLayer.fail(T.T("YYJ1300046"));
						return;
				}
            }
            if(result.scope.instanDimenD4  && result.scope.instanDimenD4 !="null"){
				if($scope.payProExampleInf.instanCode4 =="" || $scope.payProExampleInf.instanCode4 ==  undefined || 
						$scope.payProExampleInf.instanCode4 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300047"));
							return;
				}
            }
            if(result.scope.instanDimenD5 && result.scope.instanDimenD5 !="null"){
				if($scope.payProExampleInf.instanCode5 =="" || $scope.payProExampleInf.instanCode5 ==  undefined || 
						$scope.payProExampleInf.instanCode5 ==  "undefined"){
							jfLayer.fail(T.T("YYJ1300048"));
							return;
				}
            }
            if(result.scope.instanDimenD1 == "CNMD" || result.scope.instanDimenD2 == "CNMD" || result.scope.instanDimenD3 == "CNMD"
				|| result.scope.instanDimenD4 == "CNMD" || result.scope.instanDimenD5 == "CNMD"){
				if(result.scope.feeCollectTypeDiff == "" || result.scope.feeCollectTypeDiff ==  undefined || 
						result.scope.feeCollectTypeDiff ==  "undefined"){
					jfLayer.fail(T.T("YYJ1300049"));
					return;
				}else{
					if(result.scope.instanDimenD1 == "CNMD"){
						if($scope.payProExampleInf.instanCode1 != result.scope.feeCollectTypeDiff){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if(result.scope.instanDimenD2 == "CNMD"){
						if($scope.payProExampleInf.instanCode2 != result.scope.feeCollectTypeDiff){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if(result.scope.instanDimenD3 == "CNMD"){
						if($scope.payProExampleInf.instanCode3 != result.scope.feeCollectTypeDiff){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if(result.scope.instanDimenD4 == "CNMD"){
						if($scope.payProExampleInf.instanCode4 != result.scope.feeCollectTypeDiff){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}else if(result.scope.instanDimenD5 == "CNMD"){
						if($scope.payProExampleInf.instanCode5 != result.scope.feeCollectTypeDiff){
							jfLayer.fail(T.T("YYJ1300050"));
							return;
						}
					}
				}
            }
            if($scope.payProExaList!=null){
				for(var n=0;n<$scope.payProExaList.length;n++){
					var obj = {};
					obj = $scope.payProExaList[n];
					if(obj.instanCode1==$scope.payProExampleInf.instanCode1
							&& obj.instanCode2==$scope.payProExampleInf.instanCode2
							&& obj.instanCode3==$scope.payProExampleInf.instanCode3
							&& obj.instanCode4==$scope.payProExampleInf.instanCode4
							&& obj.instanCode5==$scope.payProExampleInf.instanCode5){
						jfLayer.fail(T.T("YYJ1300051"));
						return;
					}
				}
				$scope.payProExaList.push($scope.payProExampleInf);
			}else{
				$scope.payProExaList.push($scope.payProExampleInf);
			}
			$scope.safeApply();
			result.cancel();
		};
		 //删除收费项目实例列表某行
        $scope.deleteFeeDif =  function(data){
        	var checkId = data;
			$scope.payProExaList.splice(checkId, 1);
        }
	});
	// 收费项目实例99999999999999999
	webApp.controller('setFeeProExampleCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.payProExampleInf = {};
		$scope.payProExampleInf2 = {};
		$scope.methodShow = false;
		 $scope.payProExampleInf =  $scope.params;
		if($scope.payProExampleInf.instanDimen1 =="MODP"){
			$scope.payProExampleInf.instanCode1 = $scope.payProExampleInf.productObjectCode;
		}else{
			$scope.payProExampleInf.instanCode1 ="";
		}
		if($scope.payProExampleInf.instanDimen2 =="MODP"){
			$scope.payProExampleInf.instanCode2 = $scope.payProExampleInf.productObjectCode;
		}else{
			$scope.payProExampleInf.instanCode2 ="";
		}
		if($scope.payProExampleInf.instanDimen3 =="MODP"){
			$scope.payProExampleInf.instanCode3 = $scope.payProExampleInf.productObjectCode;
		}else{
			$scope.payProExampleInf.instanCode3 ="";
		}
		if($scope.payProExampleInf.instanDimen4 =="MODP"){
			$scope.payProExampleInf.instanCode4 = $scope.payProExampleInf.productObjectCode;
		}else{
			$scope.payProExampleInf.instanCode4 ="";
		}
		if($scope.payProExampleInf.instanDimen5 =="MODP"){
			$scope.payProExampleInf.instanCode5 = $scope.payProExampleInf.productObjectCode;
		}else{
			$scope.payProExampleInf.instanCode5 ="";
		}
		//运营模式
		 $scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.payProExampleInf.operationMode = $rootScope.operationMods;
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
		        	$scope.assessmentMethodDiff = $scope.payProExampleInf.assessmentMethod;
		        }
			};
			$scope.matrixAppModeArry ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_matrixAppMode",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.matrixAppModeDiff = $scope.payProExampleInf2.matrixAppMode;
			        }
				};
		//应用维度
			$scope.feeMatrixApplicationDimensionArry  ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_feeMatrixApplicationDimension",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.feeMatrixApplicationDimensionDiff = $scope.payProExampleInf2.feeMatrixApplicationDimension;
			        }
			};
			$scope.matchRelationArr01 ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_matchRelation",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.matchRelation01d = $scope.payProExampleInf2.matchRelation1;
			        }
				};
			$scope.matchRelationArr02 ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_matchRelation",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.matchRelation02d = $scope.payProExampleInf2.matchRelation2;
			        }
				};
			$scope.matchRelationArr03 ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_matchRelation",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.matchRelation03d = $scope.payProExampleInf2.matchRelation3;
			        }
				};
			$scope.matchRelationArr04 ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_matchRelation",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.matchRelation04d = $scope.payProExampleInf2.matchRelation4;
			        }
				};
			$scope.matchRelationArr05 ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_matchRelation",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.matchRelation05d = $scope.payProExampleInf2.matchRelation5;
			        }
				};
		 $scope.feeFlagArr ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_feeFlag",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.feeFlagDiff = $scope.payProExampleInf2.feeFlag;
			        }
				};
		 $scope.instanDimenArr01 ={ 
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
	        	$scope.instanDimenD1 = $scope.payProExampleInf.instanDimen1;
	        }
		};
		 $scope.instanDimenArr02 ={ 
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
			        	$scope.instanDimenD2 = $scope.payProExampleInf.instanDimen2;
			        }
				};
		 $scope.instanDimenArr03 ={ 
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
			        	$scope.instanDimenD3 = $scope.payProExampleInf.instanDimen3;
			        }
				};
		 $scope.instanDimenArr04 ={ 
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
			        	$scope.instanDimenD4 = $scope.payProExampleInf.instanDimen4;
			        }
				};
		 $scope.instanDimenArr05 ={ 
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
			        	$scope.instanDimenD5 = $scope.payProExampleInf.instanDimen5;
			        }
				};
		//费用收取方式
			$scope.feeCollectTypeArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ecommFeeCollectType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeCollectTypeDiff = $scope.payProExampleInf.feeCollectType;
		        }
			};
			$scope.waiveCycleArr={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_waiveCycle",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.waiveCycleDiff = $scope.payProExampleInf.waiveCycle;
			        }
				};
			$scope.showFee = function(){
				if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF"){
					$scope.methodShow = true;
				}else{
					$scope.methodShow = false;
				}
			};
			$scope.showFee();
			//根据计费方式更改显示
			var form = layui.form;
			form.on('select(method)',function(event){
				if(event.value =="M" || event.value =="ANNF" ){
					$scope.methodShow = true;
				}else{
					$scope.methodShow = false;
					$scope.payProExampleInf2 ={};
				}
			});
		//选择收费项目编号
			$scope.choseBtn = function() {
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/payProject/choseFeeItem.html', $scope.params, {
					title : T.T('YYJ1300015'),
					buttons : [ T.T('F00107'), T.T('F00012')],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.chosedFeeItem]
				});
			};
			$scope.chosedFeeItem = function(result) {
				if (!result.scope.feeListTable.validCheck()) {
					return;
                }
                $scope.checkedFeeItemInf = result.scope.feeListTable.checkedList();
				$scope.payProExampleInf.feeItemNo  = $scope.checkedFeeItemInf.feeItemNo;
				$scope.payProExampleInf.instanDimen1 = $scope.checkedFeeItemInf.instanCode1;
				$scope.payProExampleInf.instanDimen2 = $scope.checkedFeeItemInf.instanCode2;
				$scope.payProExampleInf.instanDimen3 = $scope.checkedFeeItemInf.instanCode3;
				$scope.payProExampleInf.instanDimen4 = $scope.checkedFeeItemInf.instanCode4;
				$scope.payProExampleInf.instanDimen5 = $scope.checkedFeeItemInf.instanCode5;
				$scope.payProExampleInf.feeType = $scope.checkedFeeItemInf.feeType;
				$scope.payProExampleInf.assessmentMethod = $scope.checkedFeeItemInf.assessmentMethod;
				console.log($scope.payProExampleInf);
				if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF" ){
					$scope.methodShow = true;
				}else{
					$scope.methodShow = false;
					$scope.payProExampleInf2 ={};
				}
				$scope.safeApply();
				result.cancel();
				if($scope.payProExampleInf.feeItemNo == "LCHG025"){
					$("#feeMatrixApplicationDimension ").val(""); 
					$("#feeMatrixApplicationDimension").attr("disabled", false);
				}
				else{
					$("#feeMatrixApplicationDimension").attr("disabled", true);
					$("#feeMatrixApplicationDimension").val(1);
					$scope.payProExampleInf.feeMatrixApplicationDimension = "1";
				}
			};
			//验证收费项目编号
			$scope.checkValidate = function() {
//				if($scope.payProExampleInf.feeItemNo == '' || $scope.payProExampleInf.feeItemNo  == undefined){
				if(!$scope.payProExampleInf.feeItemNo ){
					jfLayer.fail(T.T('YYJ1300016'));
				}
			};
			var dataValueCount;
			$scope.choseInstanCode1Btn = function() {
				//获取维度取值1的值
				$scope.checkValidate();
				dataValueCount =1;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen1);
			};
			$scope.choseInstanCode2Btn = function() {
				$scope.checkValidate();
				//获取维度取值2的值
				dataValueCount =2;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen2);
			};
			$scope.choseInstanCode3Btn = function() {
				$scope.checkValidate();
				//获取维度取值3的值
				dataValueCount =3;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen3);
			};
			$scope.choseInstanCode4Btn = function() {
				$scope.checkValidate();
				//获取维度取值4的值
				dataValueCount =4;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen4);
			};
			$scope.choseInstanCode5Btn = function() {
				$scope.checkValidate();
				//获取维度取值5的值
				dataValueCount =5;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen5);
			};
			//分期实例代码
			$scope.choseInstanCode6Btn = function() {
				$scope.checkValidate();
				//获取维度取值6的值
				dataValueCount =6;
				$scope.chosedInstanCode($scope.payProExampleInf.instanDimen6);
			};
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $scope.payProExampleInf.operationMode,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseBusinessType.html', $scope.params, {
							title : T.T('YYJ1300017'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseBusType]
						});
				}else if(dataType=="MODM"){//媒介对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $scope.payProExampleInf.operationMode,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseMediaObject.html', $scope.params, {
							title : T.T('YYJ1300018'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseMedia]
						});
				}else if(dataType=="MODP"){//产品对象
					//弹框查询列表
					$scope.params = {
							"operationMode" : $scope.payProExampleInf.operationMode,
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseProductObject.html', $scope.params, {
							title : T.T('YYJ1300019'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductObject]
						});
				}else if(dataType=="CURR"){//币种
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseCurrency.html', $scope.params, {
							title : T.T('YYJ1300020'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseCurrency]
						});
				}else if(dataType =="CHAN"){//渠道
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseChannel.html', $scope.params, {
							title : T.T('YYJ1300021'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '600px' ],
							callbacks : [$scope.choseChannel]
						});
				}else if(dataType =="TERM"){//期数
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseTerm.html', $scope.params, {
							title : T.T('YYJ1300022'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseTerm]
						});
				}else if(dataType=="CNMD"){//收取方式
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseDelv.html', $scope.params, {
							title : T.T('YYJ1300057'),
							buttons : [ T.T('F00107'), T.T('F00012') ],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseDelv]
						});
				}else if(dataType=="MODG"){//业务项目
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseProductLine.html', $scope.params, {
							title : T.T('YYJ1300024'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseProductLine]
						});
				}else if(dataType=="INST"){//分期类型
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseStageType.html', $scope.params, {
							title : T.T('YYJ1300070'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseStageType]
						});
				}else if(dataType=="FTYP"){//费用收取方式
					//弹框查询列表
					$scope.params = {
							"pageSize" : 10,
							"indexNo" : 0
						};
						// 页面弹出框事件(弹出页面)
						$scope.modal('/a_operatMode/payProject/choseFeeType.html', $scope.params, {
							title : T.T('YYJ1300071'),
							buttons : [ T.T('F00107'), T.T('F00012')],
							size : [ '1000px', '400px' ],
							callbacks : [$scope.choseFeeType]
						});
				}
			};
			//业务类型确定
			$scope.choseBusType = function(result){
				if (!result.scope.businessTypeList.validCheck()) {
					return;
				}
				$scope.checkedBusinessType = result.scope.businessTypeList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedBusinessType.businessTypeCode);
				$scope.safeApply();
				result.cancel();
			};
			//媒介对象确定
			$scope.choseMedia = function(result){
				if (!result.scope.mediaObjectList.validCheck()) {
					return;
				}
				$scope.checkedMediaObject = result.scope.mediaObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedMediaObject.mediaObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			//产品对象确定
			$scope.choseProductObject = function(result){
				if (!result.scope.proObjectList.validCheck()) {
					return;
				}
				$scope.checkedProObject = result.scope.proObjectList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProObject.productObjectCode);
				$scope.safeApply();
				result.cancel();
			};
			//币种确实
			$scope.choseCurrency = function(result){
				if (!result.scope.currencyTable.validCheck()) {
					return;
				}
				$scope.checkedCurrency = result.scope.currencyTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedCurrency.currencyCode);
				$scope.safeApply();
				result.cancel();
			};
			//期数确定
			$scope.choseTerm = function(result){
				if (!result.scope.termTable.validCheck()) {
					return;
				}
				$scope.checkedTerm = result.scope.termTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedTerm.termNo);
				$scope.safeApply();
				result.cancel();
			};
			//延滞层级
			$scope.choseDelv = function(result){
				if (!result.scope.delvTable.validCheck()) {
					return;
				}
				$scope.checkedDelv = result.scope.delvTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedDelv.collectionValue);
				$scope.safeApply();
				result.cancel();
			};
			//业务项目
			$scope.choseProductLine = function(result){
				if (!result.scope.proLineList.validCheck()) {
					return;
				}
				$scope.checkedProLine = result.scope.proLineList.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedProLine.businessProgramNo);
				$scope.safeApply();
				result.cancel();
			};
			/*$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.payProExampleInf.instanDimen1 = code;
				}else if(dataValue=='2'){
					$scope.payProExampleInf.instanDimen2 = code;
				}else if(dataValue=='3'){
					$scope.payProExampleInf.instanDimen3 = code;
				}else if(dataValue=='4'){
					$scope.payProExampleInf.instanDimen4 = code;
				}else if(dataValue=='5'){
					$scope.payProExampleInf.instanDimen5 = code;
				}else if(dataValue=='6'){
					$scope.payProExampleInf.instanDimen6 = code;
				}
			}*/
			//渠道确定
			$scope.choseChannel= function(result){
				if (!result.scope.channelTable.validCheck()) {
					return;
				}
				$scope.checkedChannel = result.scope.channelTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedChannel.channelCode);
				$scope.safeApply();
				result.cancel();
			};
			//分期类型确定
			$scope.choseStageType= function(result){
				if (!result.scope.stageTypeTable.validCheck()) {
					return;
				}
				$scope.checkedStageType= result.scope.stageTypeTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedStageType.stageTpyeCode);
				$scope.safeApply();
				result.cancel();
			};
			//费用收取方式确定
			$scope.choseFeeType= function(result){
				if (!result.scope.feeTypeTable.validCheck()) {
					return;
				}
				$scope.checkedFeeType= result.scope.feeTypeTable.checkedList();
				$scope.InstanCodeValue(dataValueCount,$scope.checkedFeeType.feeTpyeCode);
				$scope.safeApply();
				result.cancel();
			};
			$scope.InstanCodeValue = function(dataValue,code) {
				if(dataValue=='1'){
					$scope.payProExampleInf.instanCode1 = code;
				}else if(dataValue=='2'){
					$scope.payProExampleInf.instanCode2 = code;
				}else if(dataValue=='3'){
					$scope.payProExampleInf.instanCode3 = code;
				}else if(dataValue=='4'){
					$scope.payProExampleInf.instanCode4 = code;
				}else if(dataValue=='5'){
					$scope.payProExampleInf.instanCode5 = code;
				}else if(dataValue=='6'){
					$scope.payProExampleInf.instanCode6 = code;
				}
			}
	});
	webApp.controller('choseFeeItemCtrl', function($scope, $stateParams, jfRest,
	$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translate.refresh();
		$scope.feeListTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : $scope.queryParam = {
				"pageSize" : 10,
				"indexNo" : 0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'feeProject.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory','dic_instanceDimension','dic_instanceDimension','dic_instanceDimension','dic_instanceDimension','dic_instanceDimension'],//查找数据字典所需参数
			transDict : ['feeType_feeTypeDesc','instanCode1_instanCode1Desc','instanCode2_instanCode2Desc','instanCode3_instanCode3Desc','instanCode4_instanCode4Desc','instanCode5_instanCode5Desc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//777777777777
	webApp.controller('queryPCDCtrl',function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.pcdExampleInf = $scope.itemsPCD;
		console.log($scope.itemsPCD);
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
				$scope.baseInstanDimenDiff = $scope.pcdExampleInf.baseInstanDimen;
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
					$scope.optionInstanDimenDiff = $scope.pcdExampleInf.optionInstanDimen;
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
					$scope.segmentTypeDiff = $scope.pcdExampleInf.segmentType;
				}
			};
		$scope.pcdInfTableDiff =[];
		if($scope.itemsPCD.pcdInitList!=null){
			$scope.pcdInfTableDiff = $scope.itemsPCD.pcdInitList;
		}
		if($scope.itemsPCD.pcdList!=null){
			$scope.pcdInfTableDiff = $scope.itemsPCD.pcdList;
		}
		//产品实例化时，点击设置参数值的方法
		$scope.addDiffentInstan = function(){
			//弹框查询列表元件
			if($scope.itemsPCD.baseInstanDimen=='MODP'){
				$scope.itemsPCD.baseInstanCode = $scope.proObjInstan.productObjectCode;
			}else{
				$scope.itemsPCD.baseInstanCode = null;
			}
			if($scope.itemsPCD.optionInstanDimen=='MODP'){
				$scope.itemsPCD.optionInstanCode = $scope.proObjInstan.productObjectCode;
			}else{
				$scope.itemsPCD.optionInstanCode = null;
			}
			$scope.itemsPCDDiff = $.parseJSON(JSON.stringify($scope.itemsPCD));
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/businessParamsOverview/selectDiffPCD.html', $scope.itemsPCDDiff, {
				title : T.T('YYH510024')+$scope.itemsPCD.pcdNo +':'+$scope.itemsPCD.pcdDesc +T.T('F00139'),
				buttons : [  T.T('F00107'), T.T('F00012')  ],
				size : [ '1100px', '500px' ],
				callbacks : [$scope.choseSelectThree]
			});
		};
		$scope.choseSelectThree = function(result) {
			var key;
			for (key in  result.scope.pcdExampleInf){
				if(result.scope.pcdExampleInf[key] == "null"){
					result.scope.pcdExampleInf[key] = "";
                }
            }
            if(result.scope.pcdExampleInf.baseInstanDimen){
				if(!result.scope.pcdExampleInf.baseInstanCode){
					jfLayer.fail(T.T("YYJ1300058"));
					return;
				}
			}
			if(result.scope.pcdExampleInf.optionInstanDimen){
				if(!result.scope.pcdExampleInf.optionInstanCode){
					jfLayer.fail(T.T("YYJ1300059"));
					return;
				}
			}
			if(result.scope.pcdInfTable.length==0){
				jfLayer.fail(T.T("YYJ1300060"));
				return;
			}
			if($scope.pcdInfTableDiff!=null && $scope.pcdInfTableDiff.length>0){
				for(var n=0;n<$scope.pcdInfTableDiff.length;n++){
					for(var j=0;j<result.scope.pcdInfTable.length;j++){
						result.scope.pcdInfTable[j].baseInstanCode = result.scope.pcdExampleInf.baseInstanCode;
						result.scope.pcdInfTable[j].optionInstanCode = result.scope.pcdExampleInf.optionInstanCode;
						var obj = {};
						obj = $scope.pcdInfTableDiff[n];
						var obj1 = {};
						obj1 = result.scope.pcdInfTable[j];
						if(obj.baseInstanCode==obj1.baseInstanCode
								&& obj.optionInstanCode==obj1.optionInstanCode
								&& obj.segmentSerialNum==obj1.segmentSerialNum){
							jfLayer.fail(T.T("YYJ1300051"));
							return;
						}
					}
				}
				 for(var j=0;j<result.scope.pcdInfTable.length;j++){
					result.scope.pcdInfTable[j].instanCode1 = $scope.itemsPCD.instanCode1;
		    	    result.scope.pcdInfTable[j].instanCode2 = $scope.itemsPCD.instanCode2;
		    	    result.scope.pcdInfTable[j].instanCode3 = $scope.itemsPCD.instanCode3;
		    	    result.scope.pcdInfTable[j].instanCode4 = $scope.itemsPCD.instanCode4;
		    	    result.scope.pcdInfTable[j].instanCode5 = $scope.itemsPCD.instanCode5;
					 $scope.pcdInfTableDiff.push(result.scope.pcdInfTable[j]);
				 }
			}else{
				result.scope.pcdInfTable[0].baseInstanCode = result.scope.pcdExampleInf.baseInstanCode;
				result.scope.pcdInfTable[0].optionInstanCode = result.scope.pcdExampleInf.optionInstanCode;
				for(var j=0;j<result.scope.pcdInfTable.length;j++){
					result.scope.pcdInfTable[j].instanCode1 = $scope.itemsPCD.instanCode1;
		    	    result.scope.pcdInfTable[j].instanCode2 = $scope.itemsPCD.instanCode2;
		    	    result.scope.pcdInfTable[j].instanCode3 = $scope.itemsPCD.instanCode3;
		    	    result.scope.pcdInfTable[j].instanCode4 = $scope.itemsPCD.instanCode4;
		    	    result.scope.pcdInfTable[j].instanCode5 = $scope.itemsPCD.instanCode5;
					$scope.pcdInfTableDiff.push(result.scope.pcdInfTable[j]);
				 }
			}
			$scope.safeApply();
			result.cancel();
		};
		 //删除pcd实例列表某行
        $scope.deletePcdDif =  function(data){
        	var checkId = data;
			$scope.pcdInfTableDiff.splice(checkId, 1);
        }
	});
	//业务类型
	webApp.controller('choseBusinessTypeCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translate.refresh();
		//业务类型列表
		$scope.businessTypeList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'businessType.query',// 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_businessNature'],//查找数据字典所需参数
			transDict : ['businessDebitCreditCode_businessDebitCreditCodeDesc'],//翻译前后key
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//业务项目
	webApp.controller('choseProductLineCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//业务项目列表
		$scope.proLineList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'productLine.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//媒介对象
	webApp.controller('choseMediaObjectCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translate.refresh();
		//媒介对象列表
		$scope.mediaObjectList = {
			checkType: 'radio', // 当为checkbox时为多选
			params: {
				"operationMode": $scope.params.operationMode,
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'mediaObject.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mediaType'],//查找数据字典所需参数
			transDict : ['mediaObjectType_mediaObjectTypeDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数

			}
		};
	});
	//产品对象
	webApp.controller('choseProductObjectCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//产品對象列表
		$scope.proObjectList = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					pageSize:10,
					indexNo:0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'proObject.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//币种
	webApp.controller('choseCurrencyCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translate.refresh();
		//货币列表
		$scope.currencyTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'currency.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//渠道
	webApp.controller('choseChannlCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translate.refresh();
		//货币列表
		$scope.channelTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'channel.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
				console.log(data);
			}
		};
	});
	//期数
	webApp.controller('choseTermCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translate.refresh();
		//货币列表
		$scope.termTable = {
			checkType : 'radio', // 当为checkbox时为多选
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'term.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
	});
	//延滞层级
	webApp.controller('choseDelvCtrl2', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.delvTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'delv.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
				}
			};
	});
	//分期类型
	webApp.controller('choseStageTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.stageTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'stageType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
				}
			};
	});
	//分期类型
	webApp.controller('choseFeeTypeCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.feeTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : {
						"pageSize":10,
						"indexNo":0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'feeType.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
					console.log(data);
				}
			};
	});
	//查看444444444444
	webApp.controller('viewPayProExaCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = window.localStorage['lang'];
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translate.refresh();
		$scope.methodShow = false;
		$scope.matrixAppModeArry ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matrixAppMode",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matrixAppModeInfo = $scope.payProExampleInf.matrixAppMode;
		        }
			};
		$scope.matchRelationArr01 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation1Info = $scope.payProExampleInf.matchRelation1;
		        }
			};
			 $scope.matchRelationArr02 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation2Info = $scope.payProExampleInf.matchRelation2;
		        }
			};
			 $scope.matchRelationArr03 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation3Info = $scope.payProExampleInf.matchRelation3;
		        }
			};
			 $scope.matchRelationArr04 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation4Info = $scope.payProExampleInf.matchRelation4;
		        }
			};
			 $scope.matchRelationArr05 ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_matchRelation",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.matchRelation5Info = $scope.payProExampleInf.matchRelation5;
		        }
			};
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
		        	$scope.assessmentMethodInfo = $scope.payProExampleInf.assessmentMethod;
		        }
			};
			$scope.waiveCycleArr={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_waiveCycle",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.waiveCycleInfo = $scope.payProExampleInf.waiveCycle;
		        }
			};
			 $scope.feeFlagArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_feeFlag",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeFlagInfo = $scope.payProExampleInf.feeFlag;
		        }
			};
			//费用收取方式
			$scope.feeCollectTypeArr ={ 
		        type:"dictData", 
		        param:{
		        	"type":"DROPDOWNBOX",
		        	groupsCode:"dic_ecommFeeCollectType",
		        	queryFlag: "children"
		        },//默认查询条件 
		        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
		        resource:"paramsManage.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.feeCollectTypeInfo = $scope.payProExampleInf.feeCollectType;
		        }
			};
			//应用维度
			$scope.feeMatrixApplicationDimensionArry  ={ 
			        type:"dictData", 
			        param:{
			        	"type":"DROPDOWNBOX",
			        	groupsCode:"dic_feeMatrixApplicationDimension",
			        	queryFlag: "children"
			        },//默认查询条件 
			        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
			        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
			        resource:"paramsManage.query",//数据源调用的action 
			        callback: function(data){
			        	$scope.feeMatrixApplicationDimensionInfo = $scope.payProExampleInf.feeMatrixApplicationDimension;
			        }
			};
		//运营模式
		$scope.operationModeArr ={ 
		        type:"dynamic", 
		        param:{},//默认查询条件 
		        text:"modeName", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"operationMode.query",//数据源调用的action 
		        callback: function(data){
		        	$scope.viewPayProExaOperationMode = $scope.payProExampleInf.operationMode;
		        }
		    };
		//查询收费项目
		$scope.feeItemArr ={ 
		        type:"dynamic", 
		        param:{feeItemNo:$scope.payProExampleInf.feeItemNo},//默认查询条件 
		        text:"feeItemNo", //下拉框显示内容，根payProExample据需要修改字段名称 
		        value:"feeType",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"feeProject.query",//数据源调用的action 
		        callback: function(data){
		        	if(data!=null && data.length!=0){
		        	$scope.payProExampleInf.feeType = data[0].feeType;
		        	$scope.payProExampleInf.assessmentMethod = data[0].assessmentMethod;
		        	$scope.showFee();
		        	}
		        }
		    };
		$scope.showFee = function(){
			if($scope.payProExampleInf.assessmentMethod =="M" || $scope.payProExampleInf.feeType =="ANNF"){
				$scope.methodShow = true;
			}else{
				$scope.methodShow = false;
			}
		};
		$scope.showFee();
	});
	//******************************余额对象设置参数值pcd修改33333333333333***************
	webApp.controller('selectPCDCtrl',function($scope, $stateParams,$timeout,  jfRest,$http, jfGlobal, $rootScope,jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
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
			$scope.indexNoTemp = '';
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
