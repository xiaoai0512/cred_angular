'use strict';
define(function(require) {
	var webApp = require('app');
	//构件实例查询及维护
	webApp.controller('artifactQueryCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		 $scope.selBtnFlag = false;
		 $scope.updBtnFlag = false;
		 $scope.delBtnFlag = false;
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
		   	   		if($scope.eventList.search('COS.IQ.02.0015') != -1){    //查询
	   					$scope.selBtnFlag = true;
	   				}
	   				else{
	   					$scope.selBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0015') != -1){    //修改
	   					$scope.updBtnFlag = true;
	   				}
	   				else{
	   					$scope.updBtnFlag = false;
	   				}
			   		if($scope.eventList.search('COS.AD.02.0015') != -1){    //新增
	   					$scope.addBtnFlag = true;
	   				}
	   				else{
	   					$scope.addBtnFlag = false;
	   				}
			   	   	if($scope.eventList.search('COS.UP.02.0026') != -1){    //删除
	   					$scope.delBtnFlag = true;
	   				}
	   				else{
	   					$scope.delBtnFlag = false;
	   				}
  				}
  			});
		//构件实例列表
		$scope.artifactTable = {
			params : {
					"pageSize":10,
					"indexNo":0
			}, // 表格查询时的参数信息
			paging : true,// 默认true,是否分页
			resource : 'artifactExample.query',// 列表的资源
			callback : function(data) { // 表格查询后的回调函数
			}
		};
//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//删除
			$scope.deleteArtifactInstan = function(item) {
				$scope.items = $.parseJSON(JSON.stringify(item));
				$scope.items.artifactInstanId = $scope.items.id;
				jfLayer.confirm(T.T('YYJ400039'),function() {
					jfRest.request('artifactExample', 'deleteArtifact', $scope.items).then(function(data) {
						if (data.returnMsg == 'OK') {
							jfLayer.alert(T.T('F00037'));
							$scope.items = {};
							$scope.artifactTable.search();
						}
					});
				},function() {
				});
			};
		//查询
		$scope.queryArtifactInstan = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/example/queryArtifact.html', $scope.items, {
				title : T.T('YYJ400040'),
				buttons : [  T.T('F00012')],
				size : [ '1150px', '400px'  ],
				callbacks : []
			});
		};
		//修改
		$scope.updateArtifactInstan = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.items = $.parseJSON(JSON.stringify(item));
			$scope.modal('/a_operatMode/example/updateArtifact.html', $scope.items, {
				title : T.T('YYJ400041'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '1150px', '400px'  ],
				callbacks : [$scope.saveArtifact]
			});
		};
		//保存
		$scope.saveArtifact = function (result){
			if(result.scope.pcdInstanShow){
				$scope.pcdExampleInf ={};
				$scope.pcdExampleInf = result.scope.pcdExampleInf;
				$scope.pcdExampleInf.addPcdFlag ="1";
				$scope.pcdExampleInf.pcdList = result.scope.pcdInfTable;
				$scope.items = Object.assign($scope.items , $scope.pcdExampleInf);
			}
	        if($scope.items.elementNo != null && $scope.items.elementDesc != null){
	        	$scope.items.elementNo = $scope.items.elementNo.substring(0,$scope.items.elementNo.length-$scope.items.elementDesc.length);
	        }
	        if($scope.items.instanCode1 != null && $scope.items.instanDesc1 != null){
	        	$scope.items.instanCode1 = $scope.items.instanCode1.substring(0,$scope.items.instanCode1.length-$scope.items.instanDesc1.length);
	        }
	        if($scope.items.instanCode2 != null && $scope.items.instanDesc2 != null){
	        	$scope.items.instanCode2 = $scope.items.instanCode2.substring(0,$scope.items.instanCode2.length-$scope.items.instanDesc2.length);
	        }
	        if($scope.items.instanCode3 != null && $scope.items.instanDesc3 != null){
	        	$scope.items.instanCode3 = $scope.items.instanCode3.substring(0,$scope.items.instanCode3.length-$scope.items.instanDesc3.length);
	        }
	        if($scope.items.instanCode4 != null && $scope.items.instanDesc4 != null){
	        	$scope.items.instanCode4 = $scope.items.instanCode4.substring(0,$scope.items.instanCode4.length-$scope.items.instanDesc4.length);
	        }
	        if($scope.items.instanCode5 != null && $scope.items.instanDesc5 != null){
	        	$scope.items.instanCode5 = $scope.items.instanCode5.substring(0,$scope.items.instanCode5.length-$scope.items.instanDesc5.length);
	        }
			jfRest.request('artifactExample', 'update', $scope.items)
			.then(function(data) {
				if (data.returnCode == '000000') {
					 jfLayer.success(T.T('F00022'));
					 $scope.safeApply();
						result.cancel();
					 $scope.artifactTable.search();
				}
			});
		};
		//新增
		$scope.artifactAdd = function(){
			// 页面弹出框事件(弹出页面)
			$scope.modal('/a_operatMode/example/artifactExampleEst.html', '', {
				title : '特殊实例化建立',
				buttons : [T.T('F00107'),T.T('F00012')],
				size : [ '1000px', '500px' ],
				callbacks : [$scope.saveArtifactAdd ]
			});
		};
	       //保存构件实例
		$scope.saveArtifactAdd = function(result){
			$scope.artifactExampleInf = {};
			$scope.artifactExampleInf = result.scope.artifactExampleInf;
			//是否新增pcd实例
			if(result.scope.pcdInstanShow && result.scope.pcdInfTable.length ==0){
				jfLayer.fail(T.T('YYJ400048'));
        		return;
			} 
			if($scope.artifactExampleInf.instanDimen1 && $scope.artifactExampleInf.instanDimen1 !="null"){
				if($scope.artifactExampleInf.instanCode1 ==null){
					jfLayer.fail(T.T('YYJ400053'));//实例代码为空
	        		return;
				}		
			}
			if($scope.artifactExampleInf.instanDimen2 && $scope.artifactExampleInf.instanDimen2 !="null"){
				if($scope.artifactExampleInf.instanCode2 ==null){
					jfLayer.fail(T.T('YYJ400054'));//实例代码为空
	        		return;
				}
			}
			if($scope.artifactExampleInf.instanDimen3 && $scope.artifactExampleInf.instanDimen3 !="null"){
				if($scope.artifactExampleInf.instanCode3 ==null){
					jfLayer.fail(T.T('YYJ400055'));//实例代码为空
	        		return;
				}
			}
			if($scope.artifactExampleInf.instanDimen4 && $scope.artifactExampleInf.instanDimen4 !="null"){
				if($scope.artifactExampleInf.instanCode4 ==null){
					jfLayer.fail(T.T('YYJ400056'));//实例代码为空
	        		return;
				}
			}
			if($scope.artifactExampleInf.instanDimen5 && $scope.artifactExampleInf.instanDimen5 !="null"){
				if($scope.artifactExampleInf.instanCode5 ==null){
					jfLayer.fail(T.T('YYJ400057'));//实例代码为空
	        		return;
				}
			}
			if(result.scope.pcdInstanShow	&& result.scope.pcdInfTable.length >0 ){
				$scope.pcdExampleInf.addPcdFlag ="1";
				$scope.pcdExampleInf.pcdList = $scope.pcdInfTable;
				$scope.artifactExampleInf = Object.assign($scope.artifactExampleInf , $scope.pcdExampleInf);
			}
			jfRest.request('artifactExample', 'save', $scope.artifactExampleInf).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('F00032'));
					$scope.artifactExampleInf ={};
					$scope.safeApply();
					result.cancel();
					$scope.artifactTable.search();
					result.scope.artifactExampleInfForm.$setPristine();
				}
			});
		};
	});
	webApp.controller('artifactUpdateCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.items.artifactInstanId = $scope.items.id;
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
		//新增按钮默认不显示
		$scope.addButtonShow = false;
		var count ;
		//pcd实例化取值类型
		$scope.pcdtypeArray = [{name : T.T('YYJ400013') ,id : 'D'}
							,{name : T.T('YYJ400014'),id : 'P'}
							,{name : T.T('YYJ400043'),id : 'O'}] ;
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态
		$scope.segmentTypeArray = [{name : T.T('YYJ400044'),id : 'DAY'}
								,{name : T.T('YYJ400045'),id : 'MTH'}
								,{name : T.T('YYJ400046'),id : 'CYC'}
								,{name : T.T('YYJ400047'),id : 'DLQ'}
								,{name : T.T('YYJ400050'),id : 'ACT'}
								,{name : T.T('YYJ400051'),id : 'CUR'}] ;
		$scope.newPcdBtn = function() {
            $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
            if($scope.showNewPcdInfo){
            	$scope.pcdExampleInf.segmentSerialNum = ++count;
            }
        };
        if($scope.items.elementNo != null && $scope.items.elementDesc != null){
        	$scope.items.elementNo = $scope.items.elementNo + $scope.items.elementDesc;
        }
        if($scope.items.instanCode1 != null && $scope.items.instanDesc1 != null){
        	$scope.items.instanCode1 = $scope.items.instanCode1 + $scope.items.instanDesc1;
        }
        if($scope.items.instanCode2 != null && $scope.items.instanDesc2 != null){
        	$scope.items.instanCode2 = $scope.items.instanCode2 + $scope.items.instanDesc2;
        }
        if($scope.items.instanCode3 != null && $scope.items.instanDesc3 != null){
        	$scope.items.instanCode3 = $scope.items.instanCode3 + $scope.items.instanDesc3;
        }
        if($scope.items.instanCode4 != null && $scope.items.instanDesc4 != null){
        	$scope.items.instanCode4 = $scope.items.instanCode4 + $scope.items.instanDesc4;
        }
        if($scope.items.instanCode5 != null && $scope.items.instanDesc5 != null){
        	$scope.items.instanCode5 = $scope.items.instanCode5 + $scope.items.instanDesc5;
        }
        //pcd实例列表
        $scope.pcdInfTable = [];
        //删除pcd实例列表某行
        $scope.deletePcdDif =  function(data){
        	if($scope.pcdInfTable.length==1){
        		jfLayer.fail(T.T('YYJ400048'));
        		return;
        	}
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
        };
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.items.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					if(data.returnData.rows[0].segmentType!=null){//分段类型不为空
						$scope.pcdExampleInf.segmentType =  data.returnData.rows[0].segmentType;
						$scope.addButtonShow = true;
					}else{
						$scope.addButtonShow = false;
					}
					$scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
		 //pcd差异化实例信息 保存
        $scope.pcdExampleInf = {};
        var count = 0;
       $scope.saveNewAdrInfo = function() {
    	   if(null== $scope.pcdExampleInf.pcdPoint  || null== $scope.pcdExampleInf.pcdType 
    			  ||  null== $scope.pcdExampleInf.pcdValue ) {
    		   jfLayer.fail(T.T('YYJ400049'));
    		   return;
    	   }  
			var pcdInfTableInfoU = {};
			pcdInfTableInfoU.instanCode1 = $scope.items.instanCode1;
			pcdInfTableInfoU.instanCode2 = $scope.items.instanCode2;
			pcdInfTableInfoU.instanCode3 = $scope.items.instanCode3;
			pcdInfTableInfoU.instanCode4 = $scope.items.instanCode4;
			pcdInfTableInfoU.instanCode5 = $scope.items.instanCode5;
			pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
			pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInf.pcdPoint;
			pcdInfTableInfoU.pcdType = $scope.pcdExampleInf.pcdType;
			pcdInfTableInfoU.pcdValue = $scope.pcdExampleInf.pcdValue;
			pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInf.segmentSerialNum;
			pcdInfTableInfoU.segmentValue = $scope.pcdExampleInf.segmentValue;
			if($scope.pcdInfTable==null){
				$scope.pcdInfTable = [];
			}
			if($scope.indexNo!= undefined && $scope.indexNo!=null){
				$scope.pcdInfTable[$scope.indexNo].segmentSerialNum = 	$scope.pcdExampleInf.segmentSerialNum;
				$scope.pcdInfTable[$scope.indexNo].pcdType = 	 $scope.pcdExampleInf.pcdType;
				$scope.pcdInfTable[$scope.indexNo].segmentValue = 	 $scope.pcdExampleInf.segmentValue;
				$scope.pcdInfTable[$scope.indexNo].pcdValue = 	 $scope.pcdExampleInf.pcdValue;
				$scope.pcdInfTable[$scope.indexNo].pcdPoint = $scope.pcdExampleInf.pcdPoint;
				$scope.indexNo = null;
			}else{
				$scope.pcdInfTable.push(pcdInfTableInfoU);
			}
			$scope.pcdExampleInf = {};
			$scope.pcdExampleInf.pcdNo= pcdInfTableInfoU.pcdNo;
			$scope.showNewPcdInfo = false;
       };
       $scope.pcdExampleInf ={};
       $scope.pcdExampleInf.pcdNo = $scope.items.elementNo.substring(0,8);
       //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.items.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.items.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.items.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.items.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.items.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.items.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.items.instanCode5;
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
        			   count = data.returnData.rows[0].segmentSerialNum;
    			   }else{
    				   count = 0;
    			   }
    		   }
    	   });
       };
       $scope.updateInstan = function(event,$index){
			$scope.indexNo = $index;
			$scope.showNewPcdInfo = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInf = $scope.updateInstanTemp;
		}
	});
	webApp.controller('queryArtifactCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态
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
					$scope.segmentTypeInfo = $scope.pcdExampleInf.segmentType;
				}
			};
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
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
				$scope.pcdTypeInfo = $scope.pcdExampleInf.pcdType;
			}
		};
        //pcd差异列表
        $scope.pcdInfTable = [];
        //删除pcd差异列表某行
        $scope.deletePcdDif =  function(data){
        	var checkId = data;
			$scope.pcdInfTable.splice(checkId, 1);
        };
        $scope.pcdExampleInf ={};
        $scope.pcdExampleInf.pcdNo = $scope.items.elementNo.substring(0,8);
        if($scope.items.elementNo != null && $scope.items.elementDesc != null){
        	$scope.items.elementInfo = $scope.items.elementNo + $scope.items.elementDesc;
        }
        if($scope.items.instanCode1 != null && $scope.items.instanDesc1 != null){
        	$scope.items.instanCode1Info = $scope.items.instanCode1 + $scope.items.instanDesc1;
        }
        if($scope.items.instanCode2 != null && $scope.items.instanDesc2 != null){
        	$scope.items.instanCode2Info = $scope.items.instanCode2 + $scope.items.instanDesc2;
        }
        if($scope.items.instanCode3 != null && $scope.items.instanDesc3 != null){
        	$scope.items.instanCode3Info = $scope.items.instanCode3 + $scope.items.instanDesc3;
        }
        if($scope.items.instanCode4 != null && $scope.items.instanDesc4 != null){
        	$scope.items.instanCode4Info = $scope.items.instanCode4 + $scope.items.instanDesc4;
        }
        if($scope.items.instanCode5 != null && $scope.items.instanDesc5 != null){
        	$scope.items.instanCode5Info = $scope.items.instanCode5 + $scope.items.instanDesc5;
        }
		//置空
		$scope.queryPcdParam = {};
		$scope.queryPcdParam.elementNo = $scope.items.elementNo;
		jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
			if (data.returnCode == '000000') {
				if(data.returnData.rows!=null){
					//pcd实例显示
					$scope.pcdInstanShow = true;
					$scope.pcdExampleInf.segmentType =  data.returnData.rows[0].segmentType;
					 $scope.queryPcdInstan();
				}else{
					//不显示
					$scope.pcdInstanShow = false;
				}
			}
		});
      //查询pcd实例信息
       $scope.queryPcdInstan  = function(){
    	   $scope.queryPcdExample ={};
    	   $scope.queryPcdExample.operationMode = $scope.items.operationMode;
    	   $scope.queryPcdExample.pcdNo = $scope.items.elementNo.substring(0,8);
    	   $scope.queryPcdExample.instanCode1 = $scope.items.instanCode1;
    	   $scope.queryPcdExample.instanCode2 = $scope.items.instanCode2;
    	   $scope.queryPcdExample.instanCode3 = $scope.items.instanCode3;
    	   $scope.queryPcdExample.instanCode4 = $scope.items.instanCode4;
    	   $scope.queryPcdExample.instanCode5 = $scope.items.instanCode5;
    	   //此处键值基础实例可选实例。无处获取。
    	   jfRest.request('pcdExample', 'query', $scope.queryPcdExample).then(function(data) {
    		   if (data.returnCode == '000000') {
    			   if(data.returnData.rows!=null){
    				   $scope.pcdInfTable  = data.returnData.rows;
    			   }
    		   }
    	   });
       }
	});
	// 构件实例查询
	webApp.controller('artifactExampleExtCtrl', function($scope, $stateParams, jfRest,$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) { 
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.artifactExampleInf = {};
		$scope.businessValueArr = [ {name : T.T('YYJ400001'), id : 'MODT'}, {name : T.T('YYJ400002'),id : 'MODM'}, {name : T.T('YYJ400003'),id : 'MODB'}, 
		                             {name : T.T('YYJ400004'), id : 'MODG'}, {name : T.T('YYJ400005'),id : 'ACST'}, {name : T.T('YYJ400006'),id : 'EVEN'},
		                             {name : T.T('YYJ400008'),id : 'AUTX'}, {name : T.T('YYJ400009'),id : 'LMND'},
		                             {name : T.T('YYJ400011'),id : 'MODP'}];//业务性质
		//pcd实例化取值类型
		$scope.pcdtypeArray = [{name : T.T('YYJ400013') ,id : 'D'}
								,{name : T.T('YYJ400014'),id : 'P'}
								,{name : T.T('YYJ400043'),id : 'O'}] ;
		//分段类型空-无分段，DAY-天数 MTH-自然月 CYC-账单周期 DLQ-逾期状态 ACT-核算状态 CUR-币种
		$scope.segmentTypeArray = [{name : T.T('YYJ400044'),id : 'DAY'}
								,{name : T.T('YYJ400045'),id : 'MTH'}
								,{name : T.T('YYJ400046'),id : 'CYC'}
								,{name : T.T('YYJ400047'),id : 'DLQ'}
								,{name : T.T('YYJ400047'),id : 'ACT'}
								,{name : T.T('YYJ400047'),id : 'CUR'}] ;
		//pcd差异实例化取值类型
		$scope.pcdDifArray = [{name : T.T('YYJ400015') ,id : 'DELQ'},{name : T.T('YYJ400010') ,id : 'CURR'},{name : T.T('YYJ400017') ,id : 'TRAN'},{name : T.T('YYJ400018') ,id : 'AMOM'}] ;
		//pcd实例默认不显示
		$scope.pcdInstanShow = false;
		//新增按钮默认不显示
		$scope.addButtonShow = false;
		//新增pcd差异化不显示
		$scope.showNewPcdInfo = false;
		// pcd差异化实例 新增按钮
		var count =1;
		$scope.pcdExampleInfList ={};
		$scope.newPcdBtn = function() {
            $scope.showNewPcdInfo = !$scope.showNewPcdInfo;
            if($scope.showNewPcdInfo){
            	$scope.pcdExampleInfList.segmentSerialNum = count++;
            }
        };
        //pcd差异化实例信息 保存
        $scope.pcdInfTable = [];
        $scope.pcdExampleInf = {};
       $scope.saveNewAdrInfo = function() {
			var pcdInfTableInfoU = {};
			pcdInfTableInfoU.operationMode = $scope.artifactExampleInf.operationMode;
			pcdInfTableInfoU.instanCode1 = $scope.artifactExampleInf.instanCode1;
			pcdInfTableInfoU.instanCode2 = $scope.artifactExampleInf.instanCode2;
			pcdInfTableInfoU.instanCode3 = $scope.artifactExampleInf.instanCode3;
			pcdInfTableInfoU.instanCode4 = $scope.artifactExampleInf.instanCode4;
			pcdInfTableInfoU.instanCode5 = $scope.artifactExampleInf.instanCode5;
			pcdInfTableInfoU.pcdNo = $scope.pcdExampleInf.pcdNo;
			pcdInfTableInfoU.pcdPoint = $scope.pcdExampleInfList.pcdPoint;
			pcdInfTableInfoU.pcdType = $scope.pcdExampleInfList.pcdType;
			pcdInfTableInfoU.pcdValue = $scope.pcdExampleInfList.pcdValue;
			pcdInfTableInfoU.segmentSerialNum = $scope.pcdExampleInfList.segmentSerialNum;
			pcdInfTableInfoU.segmentValue = $scope.pcdExampleInfList.segmentValue;
			if($scope.indexNo!= undefined && $scope.indexNo!=null){
				$scope.pcdInfTable[$scope.indexNo].segmentSerialNum = 	$scope.pcdExampleInfList.segmentSerialNum;
				$scope.pcdInfTable[$scope.indexNo].pcdType = 	 $scope.pcdExampleInfList.pcdType;
				$scope.pcdInfTable[$scope.indexNo].segmentValue = 	 $scope.pcdExampleInfList.segmentValue;
				$scope.pcdInfTable[$scope.indexNo].pcdValue = 	 $scope.pcdExampleInfList.pcdValue;
				$scope.pcdInfTable[$scope.indexNo].pcdPoint = $scope.pcdExampleInfList.pcdPoint;
				$scope.indexNo = null;
			}else{
				$scope.pcdInfTable.push(pcdInfTableInfoU);
			}
			$scope.pcdExampleInfList = {};
			$scope.showNewPcdInfo = false;
       };
//		运营模式
		 $scope.operationModeArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"modeName", //下拉框显示内容，根据需要修改字段名称 
			        value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"operationMode.query",//数据源调用的action 
			        callback: function(data){
			        }
			    };
		//元件编号
		 $scope.elementNoArr ={ 
		        type:"dynamicDesc", 
		        param:{},//默认查询条件 
		        text:"elementNo", //下拉框显示内容，根据需要修改字段名称 
		        desc:"elementDesc", //下拉框显示内容，根据需要修改字段名称 
		        value:"elementNo",  //下拉框对应文本的值，根据需要修改字段名称 
		        resource:"artifactExample.queryElementNo",//数据源调用的action 
		        callback: function(data){
		        }
		    };
		//构件编号
		 $scope.artifactNoArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"artifactNo", //下拉框显示内容，根据需要修改字段名称 
			        value:"artifactNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"artifactExample.queryNo",//数据源调用的action 
			        callback: function(data){
			        }
			    };
			//列表
			$scope.artifactNo = {
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
			//选择构件
			$scope.choseBtn = function() {
				$scope.params = {
					"pageSize" : 10,
					"indexNo" : 0
				};
				// 页面弹出框事件(弹出页面)
				$scope.modal('/a_operatMode/example/choseArtifact.html', $scope.params, {
					title : T.T('YYJ400019') ,
					buttons : [ T.T('F00107'), T.T('F00012') ],
					size : [ '1000px', '400px' ],
					callbacks : [$scope.chosedArtifact]
				});
			};
			 //删除pcd实例列表某行
	        $scope.deletePcdDif =  function(data){
	        	if($scope.pcdInfTable.length==1){
	        		jfLayer.fail(T.T('YYJ400048'));
	        		return;
	        	}
	        	var checkId = data;
				$scope.pcdInfTable.splice(checkId, 1);
	        };
			$scope.chosedArtifact = function (result){
				if (!result.scope.artiListTable.validCheck()) {
					return;
				}
				$scope.checkedArtifactInf = result.scope.artiListTable.checkedList();
				$scope.artifactExampleInf.artifactNo = $scope.checkedArtifactInf.artifactNo;
				$scope.artifactExampleInf.instanDimen1 = $scope.checkedArtifactInf.instanDimen1;
				$scope.artifactExampleInf.instanDimen2 = $scope.checkedArtifactInf.instanDimen2;
				$scope.artifactExampleInf.instanDimen3 = $scope.checkedArtifactInf.instanDimen3;
				$scope.artifactExampleInf.instanDimen4 = $scope.checkedArtifactInf.instanDimen4;
				$scope.artifactExampleInf.instanDimen5 = $scope.checkedArtifactInf.instanDimen5;
				//根据构件编号查元件编号
				 $scope.elementNoArr ={ 
				        type:"dynamicDesc", 
				        param:{ artifactNo: $scope.checkedArtifactInf.artifactNo},//默认查询条件 
				        text:"elementNo", //下拉框显示内容，根据需要修改字段名称 
				        desc:"elementDesc", //下拉框显示内容，根据需要修改字段名称 
				        value:"elementNo",  //下拉框对应文本的值，根据需要修改字段名称 
				        resource:"artifactExample.queryElementNo",//数据源调用的action 
				        callback: function(data){
				        }
				    };
				 $scope.safeApply();
				result.cancel();
			};
			//验证构件编号
			$scope.checkValidate = function() {
//				if($scope.payProExampleInf.feeItemNo == '' || $scope.payProExampleInf.feeItemNo  == undefined){
				if(!$scope.artifactExampleInf.artifactNo ){
					jfLayer.fail(T.T('YYJ400020'));
				}
			};
			var dataValueCount ;
			//dataType维度取值，dataValue第几个实例代码
			$scope.chosedInstanCode = function(dataType) {
				if(dataType=="MODT"){//业务类型
					//弹框查询列表
					$scope.params = {
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
							"operationMode" : $scope.artifactExampleInf.operationMode,
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
		 var form = layui.form;
	        form.on('select(queryPcd)',
	        function(event) {
	        	$scope.queryPcd(event.value);
	        });
		$scope.queryPcd = function(dataValue){
			//置空
			$scope.pcdExampleInf = {};
			$scope.queryPcdParam = {};
			$scope.queryPcdParam.elementNo = dataValue;
			jfRest.request('pcd', 'query', $scope.queryPcdParam).then(function(data) {
				if (data.returnCode == '000000') {
					if(data.returnData.rows!=null){
						//pcd实例显示
						$scope.pcdInstanShow = true;
						$scope.pcdExampleInf.pcdNo = dataValue.substring(0,8);
						if(data.returnData.rows[0].segmentType){//分段类型不为空
							$scope.pcdExampleInf.segmentType =  data.returnData.rows[0].segmentType;
							$scope.addButtonShow = true;
						}else{
							$scope.addButtonShow = false;
						}
						if(data.returnData.rows[0].pcdInitList!=null){
							$scope.pcdInfTable = data.returnData.rows[0].pcdInitList;
						}else{
							$scope.showNewPcdInfo = true;
						}
					}else{
						//不显示
						$scope.pcdInstanShow = false;
					}
				}
			});
		};
		$scope.updateInstan = function(event,$index){
			$scope.indexNo = $index;
			$scope.showNewPcdInfo = true;
			$scope.updateInstanTemp = $.parseJSON(JSON.stringify(event));
			$scope.pcdExampleInfList = $scope.updateInstanTemp;
		}
	});
	webApp.controller('choseArtifactCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.artiListTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.queryArtifactNo',// 列表的资源
				isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue'],//查找数据字典所需参数
				transDict : ['instanDimen1_instanDimen1Desc','instanDimen2_instanDimen2Desc','instanDimen3_instanDimen3Desc','instanDimen4_instanDimen4Desc','instanDimen5_instanDimen5Desc'],//翻译前后key
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
	webApp.controller('choseInstanceCode1Ctrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.businessTypeTable = {
				checkType : 'radio', // 当为checkbox时为多选
				params : $scope.queryParam = {
					"operationMode" :$scope.params.operationMode,
					"pageSize" : 10,
					"indexNo" : 0
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'artifactExample.queryBusinessType',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
	});
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
				"operationMode" :$scope.params.operationMode,
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
				"operationMode" :$scope.params.operationMode,
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
						"operationMode" :$scope.params.operationMode,
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
});
