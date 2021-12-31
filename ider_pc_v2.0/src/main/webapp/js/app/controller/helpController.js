'use strict';
define(function (require){
	var angular = require('angular') ;
	
	Tansun.controller('listDemoCtrl',function($scope,jfRest,jfLayer){
		$scope.checkedList={};
		//表格对象
		//表格初始化成功之后,$scope.grid对象中将会拥有针对表格的一系列操作方法
		//$scope.grid.search()将会执行对表格的查询
		//$scope.grid.getSelected()将会获得此时列表中被选中的数据
		//$scope.grid.data为列表中的数据集合
		//$scope.grid.page为列表的分页对象
		$scope.grid = {
			checkType : 'radio', //当为checkbox时为多选
			params : {}, //表格查询时的参数信息
			paging : true ,//默认true,是否分页
			resource : 'tableDemo.query' ,//列表的资源
			callback : function() { //表格查询后的回调函数
			}
		};
		$scope.grid2 = {
				checkType : 'checkbox', //当为checkbox时为多选
				params : {}, //表格查询时的参数信息
				paging : true ,//默认true,是否分页
				resource : 'tableDemo.query' ,//列表的资源
				callback : function() { //表格查询后的回调函数
				},
				checkBack:function(item){//行选中回调事件
				 		 //如果为单选框返回的是对象，复选框范回集合
						$scope.checkedList=$scope.grid2.checkedList(); 
				}
			};
		$scope.grid1 = {
				checkType : 'radio', //当为checkbox时为多选
				params : {}, //表格查询时的参数信息
				paging : false ,//默认true,是否分页
				resource : 'tableDemo.query' ,//列表的资源
				callback : function() { //表格查询后的回调函数
				}
			};
		$scope.democlick=function(item){
			alert(item.processTitle);
		};
		
		$scope.demo = {};
		$scope.demoArray = [{name : '全部' ,id : ''},{name : '借款企业' ,id : '1'},{name : '核心企业' ,id : '2'},{name : '监管公司' ,id : '3'},{name : '保险管理' ,id : '4'}] ;
		$scope.demoArray2 = [{cstNm : '大客户',cstId : '1'},{cstNm : '小客户',cstId : '2'}] ;
		$scope.changeOption = function() {
			$scope.dy = $scope.builder.option($scope.demoArray2,'cstId','cstNm') ;
		} ;
		
		$scope.cstSelector = {
                header: ['id', 'name'],
                body: ['activityId', 'activityName'],
                text: 'cstNm',
                api: "tableDemo",
                method: 'query',
                callback: function (item) {
                    if (!$scope.queryParam) {
                        $scope.queryParam = {};
                    }
                    $scope.queryParam.cstId = item.cstId;
                    $scope.queryParam.cstNm = item.cstNm;
                }
            };
		
		//最近按钮点击清空日期选择
		$scope.dateChange=function(){
			$scope.status="";
		};
		
		//最近按钮点击清空日期选择
		$scope.rangDate=function(status){
			$scope.queryParam.enddate="";
			$scope.queryParam.begindate="";
			var nowDate= new Date();
			$scope.queryParam.preEndDate=nowDate;
			//具体取值待实现
			if(status=="0"){//1个月
				$scope.queryParam.preStartDate='';
			}else if(status=="1"){//3个月
				
			}else if(status=="2"){//6个月
				
			}else if(status=="3"){//1年
				
			}
			return $scope.status=status;
		};
		
		$scope.dy = $scope.builder.option($scope.demoArray) ;
		$scope.cbk = function() {
			
		};
		//提交回调事件
		$scope.modalCallback = function(modal) {
			jfLayer.success('如果回调函数缺省，则默认为关闭窗体');
		};
		$scope.test = '123' ;
		$scope.updateDiaDemo=function(){
			$scope.demoData={};//创建对象
			if($scope.grid.checkedList().length <= 0){
				jfLayer.alert('请至少选中一条记录') ;
				return false ;
			}
			$scope.demoData=$scope.grid.checkedList()[0];//选中列值
			$scope.grid.modal('/help/help-demo-input.html',{title :'示例',buttons : ['提交','取消'],size : ['800px','400px'],callbacks : [$scope.modalCallback]});
		};
		$scope.queryParam = {};
		$scope.demoSelector = {
			header : ['融资人','当前所在环节'],//表格的头部
			body : ['preUserName','activityName'] ,//显示在列表中的字段名称
			alias : 'test' ,//查询条件的别名
			params : {a:1},//查询时需要附带的参数
			checkType : 'checkbox' ,//默认radio，此属性可缺省
			//resource也可以用如下方式
//			api : 'tableDemo',
//			method : 'query' ,
			resource : 'tableDemo.query' ,
			equals :function(checked,item){//如果未checkbox时，必须实现此方法，否则默认以ID进行判断，判断查询出来的数据是否在已选择的列表中
				return checked.taskId == item.taskId 
			},
			callback : function(data) {//选择后的回调
				//当checktype是checkbox时，data为数组
				//不是checkbox为对象
				$scope.queryParam.cstNm = '' ;
				angular.forEach(data,function(item){
					$scope.queryParam.cstNm += (item.preUserName + ',');
				});
				$scope.queryParam.cstNm = $scope.queryParam.cstNm.substring(0, $scope.queryParam.cstNm.length-1)
			}
		}
	}) ;
	 Tansun.controller('dictDemoCtrl',function($scope,jfRest,jfLayer){
	        //不走后台，自定义数据字典数据源
	        $scope.demoArray = [{name : '字典1' ,id : '1'},{name : '字典2' ,id : '2'}] ;
	        //按自定义字段组装数据字典
	        $scope.demoArray2 = [{cstNm : '大客户',cstId : '1'},{cstNm : '小客户',cstId : '2'}] ;

	        $scope.demo = {};
	        $scope.minDate = {
	                min : new Date(),//默认不限制，可缺省
	                format :  'yyyy-MM-dd',//默认格式化年月日，可缺省
	        	    type : 'datetime' //默认只能选年月日，datetime为年月日时分秒,可缺省
	            };
	    });

	 Tansun.controller('selectListDemoCtrl', function ($scope, jfRest, jfLayer) {
	    	$scope.demo = {};

	        $scope.demoArray = [{name : '字典1' ,id : '1'},{name : '字典2' ,id : '2'}] ;
	        $scope.demoArray2 = [{cstNm : '大客户',cstId : '1'},{cstNm : '小客户',cstId : '2'}] ;

	        $scope.dy1 ={
	            type:"dynamic", //动态查询数据
	            param:{pId:"10002"}, //默认查询条件
	            text:"name",  //下拉框显示的文本内容
	            value:"id",   //下拉框文本内容对应的值
	            resource:"province.query" //数据源调用的action
	        } ;
	        $scope.dy2 ={
	            type:"dynamic",
	            watch:"demo.dy1", //该字段值改变自动触发查询做过滤
	            text:"name",
	            value:"id",
	            resource:"city.query"
	        } ;
	        $scope.dy3 ={
	            type:"dynamic",
	            watch:"demo.dy2",
	            text:"name",
	            value:"id",
	            resource:"area.query"
	        } ;

	        //多选框树形选择器
	        $scope.demoCheckboxTreeSelector = {
	            checkType : 'checkbox' ,//默认radio，此属性可缺省
	            layout:'tree',
	            params:{a:1},
	            check:{
	                enable: true, // 显示多选框按钮
	                chkStyle:"checkbox", // 添加生效
	                chkboxType :{ "Y" : "ps", "N" : "s" }
	                },
	            resource:'roleMenu.query',
	            callback:function(data){
	                console.log(data);
	                console.log($scope.demoCheckboxTreeSelector.tree.getChecked('name'));
	                console.log($scope.demoCheckboxTreeSelector.tree.getChecked('id'));
	                $scope.checkboxTreeVals = $scope.demoCheckboxTreeSelector.tree.getChecked('name');
	            }
	        };
	        //单选框树形选择器
	        $scope.demoRadioTreeSelector = {
	            checkType : 'radio' ,//默认radio，此属性可缺省
	            layout:'tree',
	            params:{a:1},
	            resource:'roleMenu.query',
	            callback:function(data){
	                $scope.radioTreeVal = data.name;
	            }
	        };
	        $scope.checkboxSearchVals="买方付款,应收账款调整（放款前）审批";
	        //多选下拉弹出查询选择器
	        $scope.checkboxSearchSelector = {
	            header : ['流程名称'],//表格的头部
	            body : ['processDefineName'] ,//显示在列表中的字段名称
	            alias : 'test' ,//查询条件的别名
	            params : {a:1},//查询时需要附带的参数
	            checkType : 'checkbox' ,//默认radio，此属性可缺省
	            //resource也可以用如下方式
//				api : 'tableDemo',
//				method : 'query' ,
	            pageConf:{
	            	pageSize:1,
		            pageNum:1
	            },
	            resource : 'tableDemo.query' ,
	            //如果未checkbox时，必须实现此方法，否则默认以ID进行判断，判断查询出来的数据是否在已选择的列表中
	            equals :function(checked,item){
	                return checked.taskId == item.taskId
	            },
	            //设置下拉框样式，不指定默认width为400px
	            style:"width:300px",
	            //初始化选中匹配字段,可缺省
	            selectId :function(item){
	                return item.taskId;
	            },
	            //初始化选中匹配值,可缺省
	            initSelected:"1253410,1253092",
	            //选择后的回调
	            callback : function(data) {
	                //当checktype是checkbox时，data为数组
	                //不是checkbox为对象
	                $scope.checkboxSearchVals = '' ;
	                angular.forEach(data,function(item){
	                    $scope.checkboxSearchVals += (item.processDefineName + ',');
	                });
	                $scope.checkboxSearchVals = $scope.checkboxSearchVals.substring(0, $scope.checkboxSearchVals.length-1)
	            }
	        };
	        //单选下拉弹出选择器
	        $scope.radioSearchSelector = {
	            header:['用户名称'],
	            body:['preUserName'],
	            alias:'test',
	            params:{a:1},
	            search:false,
	            resource:'tableDemo.query',
	            callback:function(data){
	                $scope.radioSearchVal=data.preUserName;
	            }
	        };

	    });

	    Tansun.controller('treeDemoCtrl', function ($scope, jfRest, jfLayer) {
	        $scope.checkTreeDemo = {
	            isCheck : true,
	            resource : 'roleMenu.query',
	            nodeClick : function(treeNode) {
	                console.log(treeNode);
	                alert(treeNode.name);
	            },
	            nodeCheck : function(treeNode) {
	                console.log(this.getChecked());
	            }
	        };

	        $scope.radioTreeDemo = {
	            isCheck : false,
	            resource : 'roleMenu.query',
	            nodeClick : function(treeNode) {
	                alert(treeNode.name);
	            }
	        }
	    });
	    
	    Tansun.directive('layEncode', function ($timeout) {
	    	return {
		    	restrict: 'A',
				scope: false,
				terminal : true,
		        link: function (scope, element, attrs) {
		        	var id = Tansun.GUID('code') ;
		        	element.attr('id',id) ;
		        	$timeout(function() {
		        		layui.use('code', function() {
			        		layui.code({elem : '#' + id});
			        	});

			        	layui.use('element', function() {
			        		var element = layui.element;
			        		element.on('nav(demo)', function(elem) {
			        		});
			        	});
			        	$("#demoHelp a").click(function(){
			        		$("#tolinclude .include").css('display','none');
			        		$("#"+$(this).attr("src")).css('display','block');
			        	});
					}) ;
		        }
	    	}
	    });
	    Tansun.controller('formDemoCtrl',function($scope){
			$scope.demo = {};
			$scope.demoArray = [{name : '选项1' ,id : '1'},{name : '选项2' ,id : '2'}] ;
			$scope.demoArray2 = [{cstNm : '大客户',cstId : '1'},{cstNm : '小客户',cstId : '2'}] ;
			$scope.provice = [{name : '福建省',id : '1',parentId:""},{name : '安微省',id : '2',parentId:""}] ;
			$scope.city = [{name : '厦门市',id : '3',parentId:"1"},{name : '合肥市',id : '4',parentId:"2"}] ;
			$scope.area = [{name : '思明区',id : '5',parentId:"3"},{name : '包河区',id : '6',parentId:"4"}] ;
			$scope.changeOption = function() {
				$scope.dy = $scope.builder.option($scope.demoArray2,'cstId','cstNm') ;
			} ;
			
				$scope.dy1 ={
						type:"dynamic",
						param:{pId:"10002"},//默认查询条件
						text:"name",
						value:"id",
						resource:"roleMenu.query"//数据源调用的action
				} ;
				$scope.dy2 ={
						type:"dynamic",//动态查询数据
						watch:"demo.dy1",//改字段值改变自动触发查询做过滤
						text:"name",
						value:"id",
						resource:"roleMenu.query"
				} ;
				$scope.dy3 ={
						type:"dynamic",
						watch:"demo.dy2",
						text:"name",
						value:"id",
						resource:"roleMenu.query"
				} ;
			$scope.dy = $scope.builder.option($scope.demoArray) ;
			
			$scope.minDate = {
				max : 'demo.date',
				min : new Date() 
			} ;
		}) ;
	    
	    Tansun.controller('helpInputDemoCtrl',function($scope,$stateParams){
	    	if($stateParams.processTitle){
		    	$scope.demoData = {
		    			processTitle : $stateParams.processTitle,
		    			preEndDate : $stateParams.preEndDate,
		    			processDefineName : $stateParams.processDefineName
		    		}
	    	}
		}) ;
	    Tansun.controller('dialogDemoCtrl',function($scope,jfLayer){
	    	//提交回调事件
			$scope.callback = function() {
				jfLayer.success('确认回调函数');
			};
			//弹窗修改页面初始化
			  $scope.updateDiaDemo=function(){
					$scope.demoData={};//创建对象
					$scope.demoData.processDefineName="弹窗参数1";//传递到弹窗中的值
					$scope.demoData.processTitle="弹窗参数2";//传递到弹窗中的值
					$scope.demoData.preEndDate="2017-10-11";//传递到弹窗中的值
					$scope.modal('/help/help-demo-input.html',$scope.demoData,{title :'示例',buttons : ['提交','取消'],size : ['800px','400px'],callbacks : [$scope.callback]});
				};
		}) ;
	    
		Tansun.controller('treetapDemoCtrl',function($scope){
			  $scope.checkTreeDemo = {
			            isCheck : true,
			            resource : 'roleMenu.query',
			            nodeClick : function(treeNode) {
			                console.log(treeNode);
			                alert(treeNode.name);
			            },
			            nodeCheck : function(treeNode) {
			                console.log(this.getChecked());
			            }
			        };
			        $scope.radioTreeDemo = {
			            isCheck : false,
			            resource : 'roleMenu.query',
			            nodeClick : function(treeNode) {
			                alert(treeNode.name);
			            }
			        };
			  $scope.grid = {
						checkType : 'radio', //当为checkbox时为多选
						params : {}, //表格查询时的参数信息
						paging : true ,//默认true,是否分页
						resource : 'tableDemo.query' ,//列表的资源
						callback : function() { //表格查询后的回调函数
						}
					};
		}) ;

		Tansun.controller('formValidCtrl', function($scope, $validation, $parse) {
			$scope.validDemo = function() {
                $validation.validate($parse('demoForm')($scope)).success(function(){
                    console.log("demoForm validate success...");
                });
			}
		})
});