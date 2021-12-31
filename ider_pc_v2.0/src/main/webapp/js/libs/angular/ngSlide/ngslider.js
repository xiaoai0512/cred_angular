'use strict'; 
define(function(require){
	var angular = require("angular");
	require("jquery.SuperSlide");
	angular.module("ngSlide",[])
        .directive("slider",['global','$timeout',function(global,$timeout){
            return{
                restrict: 'A',
                replace: true,
                scope:{
                    id: '@id',
                    effect: '@effect',
                    delayTime: "@delaytime",
                    interTime: '@intertime',
                    defaultIndex: '@defaultindex',
                    titCell: '@titcell',
                    trigger: '@trigger',
                    scroll: '@scroll',
                    vis: '@vis',
                    titOnClassName: '@titonclassname',
                    autoPage: '@autopage',
                    prevCell: '@prevcell',
                    nextCell: '@nextcell',
                    tplUrl:'@tplurl'
                },
                transclude:false,
                //template: '<div ng-include="getContentUrl()"></div>',
                templateUrl: function(elem,attrs) {
                	return global.ctx+"/tpl/"+attrs.tplurl+".tpl";
                },
                link:function(scope,elem,attrs){
	                	/*scope.getContentUrl = function() {
	                        return global.ctx+"/tpl/"+scope.tplUrl+".tpl";
	                    }*/
                		scope.ctx = global.ctx;
                        scope.sliderId = scope.id + "main";
                        var id = "#" + scope.id;
                        var op = {
                        		mainCell : id + "main",
                                autoPlay : scope.autoPlay || true,
                                effect : scope.effect || "fade",
                                delayTime : scope.delayTime || 500,
                                interTime :scope.interTime || 2500,
                                defaultIndex :scope.defaultIndex || 0,
                                titCell :scope.titCell || ".hd li",
                                trigger :scope.trigger || "mouseover",
                                scroll :scope.scroll || 1,
                                vis :scope.vis || 1,
                                titOnClassName :scope.titOnClassName || "on",
                                autoPage :scope.autoPage || false,
                                prevCell : ".prev",
                                nextCell : ".next"
                        };
                        $timeout(function(){
                            $(id).slide(op);
                            $timeout.cancel();
                        },500);
                }
            }
        }])

});

