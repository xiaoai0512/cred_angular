'use strict';
define(function(require) {
	var webApp = require('app');
	webApp.controller('elmCfgMgtCtrl666', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/elmCfgMgt/i18n_elmCfgMgt');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.artifactInfo = {
				//这个对象不能删，否则报错
		};
		$scope.showNonObjInstanDimen = false;
		$scope.artifactTypeArray = [ {
			name : T.T('PZJ600001'),
			id : 'A'
		}, {
			name : T.T('PZJ600002'),
			id : 'B'
		}, {
			name : T.T('PZJ600003'),
			id : 'T'
		} , {
			name : T.T('PZJ600004'),
			id : 'P'
		} , {
			name : T.T('PZJ600005'),
			id : 'X'
		} , {
			name : T.T('PZJ600006'),
			id : 'M'
		}  ];
		$scope.nonObjInstanDimenArray = [ {
			name : T.T('PZJ600007'),
			id : 'D'
		}, {
			name : T.T('PZJ600008'),
			id : 'E'
		},{
			name : T.T('PZJ600009'),
			id : 'A'
		},  {
			name : T.T('PZJ600010'),
			id : 'L'
		},  {
			name : T.T('PZJ600011'),
			id : 'B'
		}];
		//维度取值1
		/*MODT-业务类型
		MODP-产品对象
		MODM-媒介对象
		MODB-余额对象
		ACST-核算状态
		EVEN-事件
		BLCK-封锁码
		AUTX-授权场景
		LMND-额度节点
		CURR-币种*/
		$scope.instanDimen1Arr = [ {
			name : T.T('PZJ600012'),
			id : 'MODT'
		}, {
			name : T.T('PZJ600013'),
			id : 'MODP'
		}, {
			name : T.T('PZJ600014'),
			id : 'MODM'
		} , {
			name : T.T('PZJ600015'),
			id : 'MODB'
		} ,{
			name : T.T('PZJ600016'),
			id : 'MODG'
		} ,{
			name : T.T('PZJ600007'),
			id : 'ACST'
		} , {
			name : T.T('PZJ600008'),
			id : 'EVEN'
		} ,
		{
			name : T.T('PZJ600011'),
			id : 'BLCK'
		},
		{
			name : T.T('PZJ600009'),
			id : 'AUTX'
		} ,
		{
			name : T.T('PZJ600010'),
			id : 'LMND'
		}  ,
		{
			name : T.T('PZJ600017'),
			id : 'CURR'
		} ,
		{
			name : T.T('PZJ600018'),
			id : 'DELQ'
		}  ];
		$scope.nonObjInstanDimenArray = [ {
			name : T.T('PZJ600007'),
			id : 'D'
		}, {
			name : T.T('PZJ600008'),
			id : 'E'
		},{
			name : T.T('PZJ600009'),
			id : 'A'
		},  {
			name : T.T('PZJ600010'),
			id : 'L'
		},  {
			name : T.T('PZJ600011'),
			id : 'B'
		}];
		$scope.delEffArr = [ {
			name : 'Y',
			id : 'Y'
		}];
		// 保存按钮事件
		$scope.saveArtiEleRel = function() {
			//console.log($scope.artifactInfo);
			var i = 0;
			for ( var key in $scope.artifactInfo){
				if(key.indexOf('instanDimen') > -1 && key.indexOf('Count') == -1){
					if($scope.artifactInfo[key] != null && $scope.artifactInfo[key] != ""){
						i++;
					}
                }
            }
			$scope.artifactInfo.instanDimenCount = i;
			//保存事件
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
						if($rootScope.s2[w].elementNo == $scope.arr2[t]){
							$scope.S2List = $rootScope.s2[w];
							$scope.S2ListResult.push($scope.S2List);
						}
					 }
				 }
			 }
			 $scope.artifactInfo.elementlist= $scope.S2ListResult;
			 if($scope.artifactInfo.elementlist.length==0){
				 jfLayer.fail("至少有一个基础元件");
			 }else{
//			$scope.artifactInfo.artifactReleleList = $rootScope.treeSelect;
				 jfRest.request('artifactConfig', 'saveArti', $scope.artifactInfo).then(function(data) {
					 if (data.returnCode == '000000') {
						 jfLayer.success(T.T('F00032'));
						 $scope.artifactInfo ="";
						 $scope.cardBinForm1.$setPristine();
					 }
				 });
			 }
		};
		var form = layui.form;
		form.on('select(getRiskLimits)',function(event){
			if(event.value == 'X'){
				$scope.showNonObjInstanDimen = true;
			}else{
				$scope.showNonObjInstanDimen = false;
			}
		});
		// 构件配置的选择元件列表
		$("#s1 option").remove();
		 $("#s2 option").remove();
		$scope.setparamss = {};
		jfRest.request('elmList', 'queryOptRltv', $scope.setparamss)
		.then(function(data) {
			var a =data.returnData.rows;
			$rootScope.s2 = {};
			$rootScope.s2 =data.returnData.rows;
			for(var i=0;i<a.length;i++){
				$("#s1").append("<option value='"+a[i].elementNo+"'>"+a[i].elementNo+"&nbsp;&nbsp;&nbsp;&nbsp;"+a[i].elementDesc+"</option>"); 
		   }
		});
		$("#s1").dblclick(function(){  
			 var alloptions = $("#s1 option");  
			 var so = $("#s1 option:selected");  
			 $("#s2").append(so);  
			 $rootScope.valueInfoPro = "";
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
		$scope.elmListTableCfg = {
			checkType : 'checkbox', // 当为checkbox时为多选
			params : $scope.queryParam = {
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'elmList.queryOptRltv',// 列表的资源
			autoQuery: false,
			callback : function(data) { // 表格查询后的回调函数
				//console.log($scope.artifactInfo.artifactNo);
			}
		};
		$scope.searchelmList = function(){
			$scope.elmListTableCfg.params.artifactNo = $scope.artifactInfo.artifactNo;
			$scope.elmListTableCfg.search();
		};
		$rootScope.treeSelect = [];
		$scope.saveSelect = function(event) {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.elmListTableCfg.validCheck()) {
				return;
			}
			var items = $scope.elmListTableCfg.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $rootScope.treeSelect.length; k++) {
					if (items[i].elementNo == $rootScope.treeSelect[k].elementNo) {    //判断是否存在
						tipStr = tipStr + items[i].elementNo + ",";
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
				jfLayer.alert(T.T('PZH600022') + tipStr.substring(0,tipStr.length-1) +T.T('PZJ600023'));
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
		}
	});
});
