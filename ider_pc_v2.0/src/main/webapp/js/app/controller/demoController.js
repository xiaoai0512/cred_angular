'use strict';
define(function (require){
	var angular = require('angular') ;
	Tansun.controller('chartsDemoCtrl',function($scope){
		$scope.charts = {
			 data : [{date : '2017/06',value : 10, user : 'test1'},
					 {date : '2017/07',value : 15, user : 'test1'},
					 {date : '2017/08',value : 11, user : 'test1'},
					 {date : '2017/06',value : 5, user : 'test2'},
					 {date : '2017/07',value : 12, user : 'test2'},
					 {date : '2017/08',value : 7, user : 'test2'},
					 {date : '2017/06',value : 4, user : 'test3'},
					 {date : '2017/08',value : 18, user : 'test3'}],
			 type : 'line', //折线图
			 label : 'date', //月份为X轴
			 value : 'value', //value为数值
			 group : 'user', //以用户为统计角度
			 title : '测试' //标题
		}
	}) ;
	
	Tansun.controller('tableDemoCtrl',function($scope,jfRest,jfLayer){
		
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
		$scope.demo = {};
		$scope.demoArray = [{name : '选项1' ,id : '1'},{name : '选项2' ,id : '2'}] ;
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
		
		$scope.dy = $scope.builder.option($scope.demoArray) ;
		$scope.cbk = function() {
			alert(1);
		};
		
		$scope.modalCallback = function(modal) {
			jfLayer.success('如果回调函数缺省，则默认为关闭窗体');
			modal.cancel(); //关闭当前弹出的窗体
		};
		$scope.test = '123' ;
		
		$scope.queryParam = {};
		$scope.demoSelector = {
			header : ['流程名称'],//表格的头部
			body : ['processDefineName'] ,//显示在列表中的字段名称
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
		};
		$scope.demoSelectorSec = {
				header:['用户名称'],
				body:['preUserName'],
				alias:'test',
				params:{a:1},
				search:false,
				resource:'tableDemo.query',
				callback:function(data){
					$scope.queryParam.cstNmNew=data.preUserName;
				}
		};
		$scope.demoTreeSelector = {
			checkType : 'checkbox' ,//默认radio，此属性可缺省
			layout:'tree',
			params:{a:1},
			resource:'roleMenu.query',
			callback:function(data){
				
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
	
	Tansun.controller('page1Ctrl',function($scope){
		$scope.hideNav = function() {
			$scope.parentNav.hideNav([1,3]) ;
		};
		$scope.showNav = function() {
			$scope.parentNav.showNav([1,2]) ;
		};
		
		$scope.showAllNav = function() {
			$scope.parentNav.showNav() ;
		};
		$scope.demoArray2=[{prdId:1,prdNm:'选项01'},{prdId:2,prdNm:'选项02'}];

		$scope.infoData={};
		$scope.editInfo=function(){
			var params=$scope.infoData;
			$scope.toParent(params) ;
		}
		
	}) ;
	Tansun.controller('page2Ctrl',function($scope,jfRest){
		
			$scope.mparams={};
			
			$scope.$watch('commonData',function(newValue){
				$scope.mparams=newValue;
			}) ;
		
	}) ;
	
	Tansun.controller('treeDemoCtrl',function($scope){
		$scope.treeDemo = {
			isCheck : true,
			resource : 'roleMenu.query',
			nodeClick : function() {
				
			},
			nodeCheck : function() {
				
			}
		};
		
		$scope.getChecked = function() {
			
		};
	}) ;
	
	Tansun.controller('treeDemoCtrl',function($scope){
		$scope.treeDemo = {
			isCheck : true,
			resource : 'roleMenu.query',
			nodeClick : function() {
				
			},
			nodeCheck : function() {
				
			}
		};
		
		$scope.getChecked = function() {
			console.log($scope.treeDemo.getChecked());
		};
	}) ;
	Tansun.controller('treetapDemoCtrl',function($scope){
		$scope.treeDemo = {
			isCheck : true,
			resource : 'roleMenu.query',
			nodeClick : function() {
				
			},
			nodeCheck : function() {
				
			}
		};
		$scope.getChecked = function() {
			
		};
	}) ;
	
});