'use strict';
define(function(require) {
	var angular = require('angular');
	require('tansun-dependent') ;
    Tansun.directive('jfCharts', function($injector,$rootScope) {
    	var echarts = {} ;
        function Plugin(option,element) {

            if(!this.charts){
                this.charts = echarts.init(element.context);
            }
            this.option = option ;
            this.builder() ;
        }
        Plugin.prototype.builder = function(){
            var thiz = this;

            var map = Tansun.Map() ;
            angular.forEach(thiz.option.data,function(item){
                var groupInd = item[thiz.option.group] || 'simple';
                var group = map.get(groupInd) || Tansun.Map() ;
                //以X轴为坐标存入分组
                group.put(item[thiz.option.label],item[thiz.option.value]) ;
                //以分组标识将分组存入Map
                map.put(groupInd,group) ;
            }) ;
            var option = {
            	color: ['#7cb5ec','#90ed7d','#917cec','#d162fa','#ff5ea6','#67e5fc','#f6c84a'],
                title: {
                    text: thiz.option.title,
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend : {
                    data : map.keySet()
                }
            };
            switch (thiz.option.type) {
                case 'line':
                    var xData = thiz._xData() ;

                    option.xAxis = {
                        type: 'category',
                        boundaryGap: false,
                        data: xData
                    } ;
                    option.yAxis = {
                        type: 'value',
                    } ;
                    option.series = [] ;
                    var keySet = map.keySet() ;
                    //便利所有分组
                    angular.forEach(keySet,function(key){
                        var series = {
                            name:key,
                            type:'line',
                            data:[]
                        };
                        var group = map.get(key) ;
                        //设置每个分组的X轴的值
                        angular.forEach(xData,function(item){
                            series.data.push(group.get(item) || 0) ;
                        });

                        option.series.push(series) ;
                    }) ;

                    break;
                case 'pie':
                    option.series = {
                        name : thiz.option.title,
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data : [] ,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    };

                    option.tooltip = {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    };

                    angular.forEach(thiz.option.data,function(item){
                        option.series.data.push({
                            value:item[thiz.option.value] || 0, name:item[thiz.option.group]
                        }) ;
                    });

                    break ;
                case 'bar' :
                    var xData = thiz._xData() ;
                    option.xAxis = {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: xData
                    } ;
                    option.yAxis = {
                        type: 'value',
                    } ;
                    option.grid = {
                        x:40,y:60
                    };
                    option.series = [] ;
                    var keySet = map.keySet() ;
                    //便利所有分组
                    angular.forEach(keySet,function(key){
                        var series = {
                            name:key,
                            type:'bar',
                            data:[]
                        };
                        var group = map.get(key) ;
                        //设置每个分组的X轴的值
                        angular.forEach(xData,function(item){
                            series.data.push(group.get(item) || 0) ;
                        });
                        option.series.push(series) ;
                    }) ;
                    break;
            }

            this.charts.setOption(option) ;
        };

        Plugin.prototype._xData = function() {
            var thiz = this ;
            var map = Tansun.Map() ;
            angular.forEach(thiz.option.data,function(item){
                map.put(item[thiz.option.label],'') ;
            }) ;

            var keySet = map.keySet() ;
            var xAxis = [] ;
            //对x轴进行排序
            angular.forEach(keySet,function(value,i){
                if(!value){
                    return ;
                }
                xAxis[i] = value ;
                angular.forEach(keySet,function(value,j){
                    if(j < i){
                        return;
                    }

                    if(xAxis[i] > value){
                        xAxis[i] = value ;
                    }
                })
            }) ;

            return xAxis ;
        };

        return {
            restrict: 'A',
            link: function(scope, element, attrs){
            	var $scope = scope.$new(false) ;
            	Tansun.loadScript('echarts',function(script){
            		echarts = script ;
            		$scope.$watch(function() {
                        return $scope.$eval(attrs.jfCharts) ;
                    },function(newValue, oldValue){
                        if(!newValue){
                            return ;
                        }
                        $scope.plugin = new Plugin(newValue,element) ;
                    },true) ;
            		$scope.safeApply() ;
            	});
            }
        };
    });
});