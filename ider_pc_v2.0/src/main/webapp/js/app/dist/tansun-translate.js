 'use strict';

define(function(require) {
	/**
	 * angular内置过滤器
	 * currency:金额格式化,默认为美元符号 格式currency : '¥'
	 * number：可以指定小float类型保留几位小数 格式number : 2
	 * date : "myDate | date:'yyyy-MM-dd'"
	 */
	var angular = require('angular');

	Tansun.directive('jfCompile', function (jfGlobal,$injector,$compile) {
		return {  
            replace: true,  
            restrict: 'A',  
            link: function(scope, element, attrs) {  
                var DUMMY_SCOPE = {  
                        $destroy: angular.noop  
                    },  
                    root = element,  
                    childScope,  
                    destroyChildScope = function() {  
                        (childScope || DUMMY_SCOPE).$destroy();  
                    };  
  
                    attrs.$observe("jfCompile", function(html) {  
	                    if (html) {  
	                        destroyChildScope();  
	                        childScope = scope.$new(false);  
	                        var content = $compile(html)(childScope);  
	                        root.replaceWith(content);  
	                        root = content;  
	                    }  
	  
	                    scope.$on("$destroy", destroyChildScope);  
	                });  
            }  
        };
	});
	
	/**
	 * 大写金额
	 * 将传入的金额转换为大写金额
	 */
	Tansun.filter('jfBigAmt', function(jfGlobal) {
		return function(input,param){
			if(!input) {
				input = "";
			}
			var n = input;
			if(!isNaN(n)) {
				var fraction = ['角', '分'];
				var digit = [
					'零', '壹', '贰', '叁', '肆',
					'伍', '陆', '柒', '捌', '玖'
				];
				var unit = [
					['元', '万', '亿'],
					['', '拾', '佰', '仟']
				];
				var head = n < 0 ? '欠' : '';
				n = Math.abs(n);
				var s = '';
				for (var i = 0; i < fraction.length; i++) {
					s += (digit[Math.floor(parseFloat(n * 10).toFixed(2) * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
				}
				s = s || '整';
				n = Math.floor(n);
				for (var i = 0; i < unit[0].length && n > 0; i++) {
					var p = '';
					for (var j = 0; j < unit[1].length && n > 0; j++) {
						p = digit[n % 10] + unit[1][j] + p;
						n = Math.floor(n / 10);
					}
					s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
				}
				return head + s.replace(/(零.)*零元/, '元')
						.replace(/(零.)+/g, '零')
						.replace(/^整$/, '零元整');
			}
		};
	});

	/**
	 * 金额格式化
	 * 可传入保留小数点位数，默认保留两位小数
	 */
	Tansun.filter('jfMoney', function(jfGlobal) {  
		return function(input,param,unit){
			if(!input){
				input = "0" ;
			}
			var n = param > 0 && param <= 20 ? param : 2;   
			var s = parseFloat((input + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
			var t = "";   
			var q="";
			if(s.substring(0,1)=="-"){
				q="-";
				s=s.substring(1,s.length); 
			}
			var l = s.split(".")[0].split("").reverse(),   
				r = s.split(".")[1];  
			for(var i = 0; i < l.length; i ++ ){   
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
			}   
			if(q){
				t+=q;
			}
			var result = t.split("").reverse().join("") + "." + r ;
			if(unit){
				result += unit
			}
			return result; 
	   };  
	});
	/**
	 * 内容长度截取
	 */
	Tansun.filter('jfTruncate', function() {
        return function(text, leng, end) {
            if (text != undefined) {
                if (isNaN(leng))
                    leng = 10;
                if (end === undefined)
                    end = '...';
                if (text.length <= leng) {
                    return text;
                } else {
                    return String(text).substring(0, leng) + end;
                }
            }
        };
    });
	
	/**
	 * 加密信息
	 */
	Tansun.filter('jfEncryption', function() {
        return function(text, type) {
            if (text != undefined) {
                if("telephone"==type){
                	var myphone = text.substr(3, 4);  
                    var lphone = text.replace(myphone, "****");  
                    return lphone;
                }
                if ("idCard" == type) {
                	var myIdCard = text.substr(6, 8);  
                    var lIdCard = text.replace(myIdCard, "****");  
                    return lIdCard;
                } else {
                    return text;
                }
            }
        };
    });
	
	

	Tansun.filter('jfTrusted', ['$sce', function ($sce) {
		return function (text) {
		    return $sce.trustAsHtml(text);
		};
	}]);
	
	Tansun.filter('jfDate',function(){
		return function(text,format) {
			if(!text){
				return '' ;
			}
			text = text.replace(/-/g,"/");
			var date = new Date(text);
			if(!format){
				format = 'yyyy-MM-dd'
			}
			
			return Tansun.Date.format(date,format)
		}
	});
	
	/**
	 * 转换过滤器
	 * @param input 输入值，如"0"或"0,1"
	 * @param type 类型,address将为地址转换器,dict将为数据字典转换器，可传入自定义数据源
	 * @param param3 当值为数据字典时,该参数为数据字典代码,当自定义数据源时，该参数表示实体中与input匹配的字段名(如cstId)
	 * @param param4 自定义数据源时表示要展示的字段名(如cstNm),如果是数据字典则该参数代表分隔符
	 */
	Tansun.filter('jfConvert',function($injector,$rootScope){
		return function (input,type) {
			if(angular.isUndefined(input)){
				return '' ;
			}
			input = String(input);
			type = type || 'dict' ;
			var result = [] ;
			switch (type) {
			case 'dict':
				var code = arguments[2] ;
				var split = arguments[3] || ',';
				var dicts = Tansun.helper.getDict(code) ;
				if(!dicts || dicts.length <= 0){
					break ;
				}
				angular.forEach(input.split(split),function(item){
					var text = '' ;
					angular.forEach(dicts,function(dict) {
						if(dict.value == item)
							text = dict.text ;
					}) ;
					result.push(text);
				}) ;
				break;
			default:
				break;
			}
			
			return result.toString() ;
		};
	});
 });