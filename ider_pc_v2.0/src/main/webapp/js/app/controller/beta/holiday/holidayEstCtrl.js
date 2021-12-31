'use strict';
define(function(require) {
	var webApp = require('app');
	//节假日建立
	webApp.controller('holidayEstCtrl', function($scope, $stateParams, jfRest,$state,$compile,
			$http, jfGlobal, $rootScope, jfLayer,lodinDataService,$translate,$translatePartialLoader,T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/beta/holiday/i18n_holiday');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.isShow = false;
		$scope.holidayArray ={ 
		   type:"dictData", 
	       param:{
	        	"type":"DROPDOWNBOX",
	        	groupsCode:"dic_holidayStatus",
	        	queryFlag: "children"
	        },//默认查询条件 
	        text:"detailDesc", //下拉框显示内容，根据需要修改字段名称 
	        value:"codes",  //下拉框对应文本的值，根据需要修改字段名称
	        resource:"paramsManage.query",//数据源调用的action 
	        callback: function(data){
//	        	$scope.item.holidayStatus = 'O';
	        }
		}; 
		$scope.holidayNoArr ={ 
	        type:"dynamic", 
	        param:{
	        	"holidayNoFlag":1,
	        	"pageSize":10,
				"indexNo":0
				},//默认查询条件 
	        text:"holidayNo", //下拉框显示内容，根据需要修改字段名称 
	        value:"holidayNo",  //下拉框对应文本的值，根据需要修改字段名称 
	        resource:"holiday.query",//数据源调用的action 
	        callback: function(data){
	        }
	    };
		$scope.hDays = [];
		var Today = new Date();
		var tY = Today.getFullYear();
		var tM = Today.getMonth();
		var tD = Today.getDate();
		var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
		var Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
		var Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
		var solarTerm = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满",
				"芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
		var sTermInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551,
				218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795,
				462224, 483532, 504758];
		var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
		var nStr2 = ['初', '十', '廿', '卅', ' '];
		var monthName = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
		var lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
				0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
				0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
				0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
				0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
				0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
				0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
				0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
				0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
				0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
				0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
				0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
				0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
				0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
				0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
				0x14b63];
		//国历节日  *表示放假日
		var sFtv = ["0101*元旦","0214  情人节","0303  全国爱耳日","0308  妇女节","0312  植树节","0315  消费者权益保护日",
		        "0321  世界森林日","0401  愚人节","0407  世界卫生日","0501*国际劳动节","0504  中国青年节","0508  世界红十字日",
		        "0519  汶川地震哀悼日","0531  世界无烟日","0601  国际儿童节","0623  国际奥林匹克日","0626  国际反毒品日","0701  建党节 香港回归",
		        "0707  抗日战争纪念日","0711  世界人口日","0801  八一建军节","0815  日本宣布无条件投降","0909  毛泽东逝世纪念日","0910  教师节",
		        "0918  九·一八事变纪念日","0920  国际爱牙日","0928  孔子诞辰","1001*国庆节","1010  辛亥革命纪念日",	"1031  万圣节",
		        "1110  世界青年节","1117  国际大学生节","1201  世界艾滋病日","1212  西安事变纪念日","1213  南京大屠杀","1220  澳门回归纪念日",
		        "1224  平安夜","1225  圣诞节","1226  毛泽东诞辰"];
		//农历节日  *表示放假日
		var lFtv = ["0101*春节",	"0102*大年初二","0103*大年初三","0104*大年初四","0105*大年初五","0106*大年初六",
		        "0107*大年初七","0115  元宵节","0202  龙抬头","0404  寒食节","0408  佛诞节 ","0505*端午节","0606  天贶节",
		        "0707  七夕情人节","0714  鬼节(南方)","0715  中元节","0815*中秋节","0909  重阳节","1001  祭祖节","1208  腊八节",
		        "1223  过小年","1229*腊月二十九",	"0100*除夕"];
		//某月的第几个星期几; 5,6,7,8 表示到数第 1,2,3,4 个星期几
		var wFtv = ["0150  世界麻风日","0520  母亲节","0530  全国助残日","0630  父亲节","1144  感恩节"];
		//初始化日期
		$scope.global = {
		    currYear : -1, // 当前年
		    currMonth : -1, // 当前月，0-11
		    currDate : null, // 当前点选的日期
		    uid : null,
		    username : null,
		    email : null,
		    single : false
		    // 是否为独立页调用，如果是值为日历id，使用时请注意对0的判断，使用 single !== false 或者 single === false
		};
		$scope.dateSelection = {
			    currYear : -1,
			    currMonth : -1,
			    minYear : 1901,
			    maxYear : 2200,
			    beginYear : 0,
			    endYear : 0,
			    tmpYear : -1,
			    tmpMonth : -1,
			    init : function(year, month) {
			        if (typeof year == 'undefined' || typeof month == 'undefined') {
			            year = $scope.global.currYear;
			            month = $scope.global.currMonth;
			        }
			        this.tmpYear = -1;
		            this.tmpMonth = -1;
			        this.setYear(year);
			        this.setMonth(month);
			        this.showYearContent();
			        this.showMonthContent();
			    },
			    show : function() {
			        document.getElementById('dateSelectionDiv').style.display = 'block';
			    },
			    hide : function() {
			        this.rollback();
			        document.getElementById('dateSelectionDiv').style.display = 'none';
			    },
			    today : function() {
			        var today = new Date();
			        var year = today.getFullYear();
			        var month = today.getMonth();
			        if (this.currYear != year || this.currMonth != month) {
			            if (this.tmpYear == year && this.tmpMonth == month) {
			                this.rollback();
			            } else {
			                this.init(year, month);
			                this.commit();
			            }
			        }
			    },
			    go : function() {
			        if (this.currYear == this.tmpYear && this.currMonth == this.tmpMonth) {
			            this.rollback();
			        } else {
			            this.commit();
			        }
			        this.hide();
			    },
			    goToday : function() {
			        this.today();
			        this.hide();
			    },
			    goPrevMonth : function() {
			        this.prevMonth();
			        this.commit();
			    },
			    goNextMonth : function() {
			        this.nextMonth();
			        this.commit();
			    },
			    goPrevYear : function() {
			        this.prevYear();
			        this.commit();
			    },
			    goNextYear : function() {
			        this.nextYear();
			        this.commit();
			    },
			    changeView : function() {
			        $scope.global.currYear = this.currYear;
			        $scope.global.currMonth = this.currMonth;
			        $scope.clear();
			        $("#nian").html($scope.global.currYear);
			        $("#yue").html(parseInt($scope.global.currMonth) + 1);
			        $scope.drawCld($scope.global.currYear, $scope.global.currMonth);
			    },
			    commit : function() {
			        if (this.tmpYear != -1 || this.tmpMonth != -1) {
			            // 如果发生了变化
			            if (this.currYear != this.tmpYear
			                    || this.currMonth != this.tmpMonth) {
			                // 执行某操作
			                this.showYearContent();
			                this.showMonthContent();
			                this.changeView();
			            }
			            this.tmpYear = -1;
			            this.tmpMonth = -1;
			        }
			    },
			    rollback : function() {
			        if (this.tmpYear != -1) {
			            this.setYear(this.tmpYear);
			        }
			        if (this.tmpMonth != -1) {
			            this.setMonth(this.tmpMonth);
			        }
			        this.tmpYear = -1;
			        this.tmpMonth = -1;
			        this.showYearContent();
			        this.showMonthContent();
			    },
			    prevMonth : function() {
			        var month = this.currMonth - 1;
			        if (month == -1) {
			            var year = this.currYear - 1;
			            if (year >= this.minYear) {
			                month = 11;
			                this.setYear(year);
			            } else {
			                month = 0;
			            }
			        }
			        this.setMonth(month);
			    },
			    nextMonth : function() {
			        var month = this.currMonth + 1;
			        if (month == 12) {
			            var year = this.currYear + 1;
			            if (year <= this.maxYear) {
			                month = 0;
			                this.setYear(year);
			            } else {
			                month = 11;
			            }
			        }
			        this.setMonth(month);
			    },
			    prevYear : function() {
			        var year = this.currYear - 1;
			        if (year >= this.minYear) {
			            this.setYear(year);
			        }
			    },
			    nextYear : function() {
			        var year = this.currYear + 1;
			        if (year <= this.maxYear) {
			            this.setYear(year);
			        }
			    },
			    prevYearPage : function() {
			        this.endYear = this.beginYear - 1;
			        this.showYearContent(null, this.endYear);
			    },
			    nextYearPage : function() {
			        this.beginYear = this.endYear + 1;
			        this.showYearContent(this.beginYear, null);
			    },
			    setYear : function(value) {
			        if (this.tmpYear == -1 && this.currYear != -1) {
			            this.tmpYear = this.currYear;
			        }
			        $('#SY' + this.currYear).removeClass('curr');
			        this.currYear = value;
			        $('#SY' + this.currYear).addClass('curr');
			    },
			    setMonth : function(value) {
			        if (this.tmpMonth == -1 && this.currMonth != -1) {
			            this.tmpMonth = this.currMonth;
			        }
			        $('#SM' + this.currMonth).removeClass('curr');
			        this.currMonth = value;
			        $('#SM' + this.currMonth).addClass('curr');
			    },
			    showYearContent : function(beginYear, endYear) {
			        if (!beginYear) {
			            if (!endYear) {
			                endYear = this.currYear + 1;
			            }
			            this.endYear = endYear;
			            if (this.endYear > this.maxYear) {
			                this.endYear = this.maxYear;
			            }
			            this.beginYear = this.endYear - 3;
			            if (this.beginYear < this.minYear) {
			                this.beginYear = this.minYear;
			                this.endYear = this.beginYear + 3;
			            }
			        }
			        if (!endYear) {
			            if (!beginYear) {
			                beginYear = this.currYear - 2;
			            }
			            this.beginYear = beginYear;
			            if (this.beginYear < this.minYear) {
			                this.beginYear = this.minYear;
			            }
			            this.endYear = this.beginYear + 3;
			            if (this.endYear > this.maxYear) {
			                this.endYear = this.maxYear;
			                this.beginYear = this.endYear - 3;
			            }
			        }
			        var s = '';
			        $("#yearListContent").html('');
			        for (var i = this.beginYear; i <= this.endYear; i++) {
			            s += '<span id="SY' + i
			                    + '" class="year" ng-click="dateSelection.setYear(' + i
			                    + ')">' + i + '</span>';
			        }
					var $hts = $compile(s)($scope);
					$("#yearListContent").append($hts);
			        $('#SY' + this.currYear).addClass('curr');
			    },
			    showMonthContent : function() {
			        var s2 = '';
			        $("#monthListContent").html('');
			        for (var i = 0; i < 12; i++) {
			            s2 += '<span id="SM' + i
			                    + '" class="month" ng-click="dateSelection.setMonth(' + i
			                    + ')">' + (i + 1).toString() + '</span>';
			        }
			        var $hts2 = $compile(s2)($scope);
			        $("#monthListContent").append($hts2);
			        $('#SM' + this.currMonth).addClass('curr');
			    },
			    //根据节假日去相关的月份
				 goHoliday : function(N){
					this.setMonth(N);
					this.commit();
				}
			};
		var gNum;
        for (var i = 0; i < 6; i++) {
            var trEle =$( '<tr style="table-layout:fixed" align=center height="50" class="tr'+i+'" id="tt"></tr>');
            $("#calTbody").append(trEle);
            for(var j = 0; j < 7; j++){
            	gNum = i * 7 + j ;
            	var tdEle = '<td  id="GD' + gNum + '" on="0" ng-click="mOck($event)"> </td>';
            	//var tdEle = '<td  id="GD' + gNum + '" on="0"> </td>';
            	var hh =  $compile(tdEle)($scope);
            	$(".tr"+i).append(hh);
            	var fontEle1 = $('<font id="SD' + gNum + '" style="font-size:22px;"  face="Arial" TITLE=""> </font><br/>');
            	var fontEle2 = $('<font  id="LD' + gNum + '"  size=2  style="white-space:nowrap;overflow:hidden;cursor:default;">  </font>');
            	$("#GD"+gNum).append(fontEle1);
            	$("#GD"+gNum).append(fontEle2);
            	if (j == 0){
            		$("#SD"+gNum).attr('color','red');
            	}
            	else if(j == 6){
            		$("#SD"+gNum).attr('color','red');
            	}
            }
        }
		//清除数据
		$scope.clear = function() {
		    for (i = 0; i < 42; i++) {
		        $scope.sObj = $("#SD" + i)[0];
		        $scope.sObj.innerHTML = '';
		        $scope.lObj = $("#LD" + i)[0];
		        $scope.lObj.innerHTML = '';
		        $("#GD" + i).removeClass("unover");
		        $("#GD" + i).removeClass("jinri");
		        $("#GD" + i).removeClass("selday");
		    }
		};
		$scope.leapMonth = function(y) {
		    return(lunarInfo[y - 1900] & 0xf);
		};
		$scope.monthDays = function(y, m) {
			return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
		};
		//==============================返回公历 y年某m+1月的天数
		$scope.solarDays = function(y, m) {
			if (m == 1)
				return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
			else
				return (solarMonth[m]);
		};
		//============================== 传入 offset 返回干支, 0=甲子
		$scope.cyclical = function(num) {
			return (Gan[num % 10] + Zhi[num % 12]);
		};
		//===== 某年的第n个节气为几日(从0小寒起算)
		$scope.sTerm = function(y, n) {
			if (y == 2009 && n == 2) {
				sTermInfo[n] = 43467
			}
			var offDate = new Date((31556925974.7 * (y - 1900) + sTermInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
			return (offDate.getUTCDate());
		};
		$scope.leapDays = function(y) {
			if ($scope.leapMonth(y))
				return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
			else
				return (0);
		};
		$scope.lYearDays = function(y) {
			var i,
			sum = 348;
			for (i = 0x8000; i > 0x8; i >>= 1)
				sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
			return (sum + $scope.leapDays(y));
		};
		$scope.addZ = function(obj){
			 return obj<10?'0'+obj:obj;
			};
		$scope.easter = function(y) {
			var term2 = $scope.sTerm(y, 5); //取得春分日期
			var dayTerm2 = new Date(Date.UTC(y, 2, term2, 0, 0, 0, 0)); //取得春分的公历日期控件(春分一定出现在3月)
			var lDayTerm2 = new $scope.Lunar(dayTerm2); //取得取得春分农历
			if (lDayTerm2.day < 15) //取得下个月圆的相差天数
				var lMlen = 15 - lDayTerm2.day;
			else
				var lMlen = (lDayTerm2.isLeap ? $scope.leapDays(y) : $scope.monthDays(y, lDayTerm2.month)) - lDayTerm2.day + 15;
			//一天等于 1000*60*60*24 = 86400000 毫秒
			var l15 = new Date(dayTerm2.getTime() + 86400000 * lMlen); //求出第一次月圆为公历几日
			var dayEaster = new Date(l15.getTime() + 86400000 * (7 - l15.getUTCDay())); //求出下个周日
			this.m = dayEaster.getUTCMonth();
			this.d = dayEaster.getUTCDate();
		};
		//删除数组指定元素
		$scope.delArry = function(arr,obj){
			for (var i = arr.length - 1; i > -1; i--) {
		        if (arr[i].ymd == obj.ymd) { 
		            arr.splice(i, 1);//参数（删除的元素下标，从该下标起删除几个元素）
		       }
		      }
		};
		//====================== 中文日期
		$scope.cDay = function(d, m,dt) {
			var s;
			switch (d) {
			case 1:
				s = monthName[m - 1];
				if(dt){
				s = '初一';
				}
				break;
			case 10:
				s = '初十';
				break;
			case 20:
				s = '二十';
				break;
			case 30:
				s = '三十';
				break;
			default:
				s = nStr2[Math.floor(d / 10)];
				s += nStr1[d % 10];
			}
			return (s);
		};
		$scope.Lunar = function(objDate) {
			var i,
			leap = 0,
			temp = 0;
			var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
			for (i = 1900; i < 2050 && offset > 0; i++) {
				temp = $scope.lYearDays(i);
				offset -= temp;
			}
			if (offset < 0) {
				offset += temp;
				i--;
			}
			this.year = i;
			leap = $scope.leapMonth(i); //闰哪个月
			this.isLeap = false;
			for (i = 1; i < 13 && offset > 0; i++) {
				//闰月
				if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
					--i;
					this.isLeap = true;
					temp = $scope.leapDays(this.year);
				} else {
					temp = $scope.monthDays(this.year, i);
				}
				//解除闰月
				if (this.isLeap == true && i == (leap + 1))
					this.isLeap = false;
				offset -= temp;
			}
			if (offset == 0 && leap > 0 && i == leap + 1)
				if (this.isLeap) {
					this.isLeap = false;
				} else {
					this.isLeap = true;
					--i;
				}
			if (offset < 0) {
				offset += temp;
				--i;
			}
			this.month = i;
			this.day = offset + 1;
		};
		$scope.calElement = function(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {
			this.isToday = false;
			//瓣句
			this.sYear = sYear; //公元年4位数字
			this.sMonth = sMonth; //公元月数字
			this.sDay = sDay; //公元日数字
			this.week = week; //星期, 1个中文
			//农历
			this.lYear = lYear; //公元年4位数字
			this.lMonth = lMonth; //农历月数字
			this.lDay = lDay; //农历日数字
			this.isLeap = isLeap; //是否为农历闰月?
			//八字
			this.cYear = cYear; //年柱, 2个中文
			this.cMonth = cMonth; //月柱, 2个中文
			this.cDay = cDay; //日柱, 2个中文
			this.color = '';
			this.lunarFestival = ''; //农历节日
			this.solarFestival = ''; //公历节日
			this.solarTerms = ''; //节气
		};
		$scope.calendar = function(y,m) {
			var sDObj,
			lDObj,
			lY,
			lM,
			lD = 1,
			lL,
			lX = 0,
			tmp1,
			tmp2,
			tmp3;
			var cY,
			cM,
			cD; //年柱,月柱,日柱
			var lDPOS = new Array(3);
			var n = 0;
			var firstLM = 0;
			sDObj = new Date(y, m, 1, 0, 0, 0, 0); //当月一日日期
			this.length = $scope.solarDays(y, m); //公历当月天数
			this.firstWeek = sDObj.getDay(); //公历当月1日星期几
		////////年柱 1900年立春后为庚子年(60进制36)
			if (m < 2)
				cY = $scope.cyclical(y - 1900 + 36 - 1);
			else
				cY = $scope.cyclical(y - 1900 + 36);
			var term2 = $scope.sTerm(y, 2); //立春日期
			////////月柱 1900年1月小寒以前为 丙子月(60进制12)
			var firstNode = $scope.sTerm(y, m * 2); //返回当月「节」为几日开始
				cM = $scope.cyclical((y - 1900) * 12 + m + 12);
		    $scope.lM2 = (y - 1900) * 12 + m + 12;
		    //当月一日与 1900/1/1 相差天数
		    //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
		    var dayCyclical = Date.UTC(y, m, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
		    for (var i = 0; i < this.length; i++) {
		        if (lD > lX) {
		            sDObj = new Date(y, m, i + 1);    //当月一日日期
		            lDObj = new $scope.Lunar(sDObj);     //农历
		            lY = lDObj.year;           //农历年
		            lM = lDObj.month;          //农历月
		            lD = lDObj.day;            //农历日
		            lL = lDObj.isLeap;         //农历是否闰月
		            lX = lL ? $scope.leapDays(lY) : $scope.monthDays(lY, lM); //农历当月最后一天
		            if (n == 0) firstLM = lM;
		            lDPOS[n++] = i - lD + 1;
		        }
		        //依节气调整二月分的年柱, 以立春为界
		        if (m == 1 && ((i + 1) == term2 || lD == 1))
					cY = $scope.cyclical(y - 1900 + 36);
		        if (lD == 1) {
					cM = $scope.cyclical((y - 1900) * 12 + m + 13);
				}
		        //日柱
		        cD = $scope.cyclical(dayCyclical + i);
		        $scope.lD2 = (dayCyclical + i);
		        this[i] = new $scope.calElement(y, m + 1, i + 1, nStr1[(i + this.firstWeek) % 7],
		                lY, lM, lD++, lL,
		                cY, cM, cD);
		    }
		    //节气
		    tmp1 = $scope.sTerm(y, m * 2) - 1;
		    tmp2 = $scope.sTerm(y, m * 2 + 1) - 1;
		    this[tmp1].solarTerms = solarTerm[m * 2];
		    this[tmp2].solarTerms = solarTerm[m * 2 + 1];
		    if (m == 3) this[tmp1].color = 'red'; //清明颜色
		  //公历节日
			for (i in sFtv)
				if (sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
					if (Number(RegExp.$1) == (m + 1)) {
						this[Number(RegExp.$2) - 1].solarFestival += RegExp.$4 + ' ';
						if (RegExp.$3 == '*')
							this[Number(RegExp.$2) - 1].color = 'red';
					}
			//月周节日
			for (i in wFtv)
				if (wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
					if (Number(RegExp.$1) == (m + 1)) {
						tmp1 = Number(RegExp.$2);
						tmp2 = Number(RegExp.$3);
						if (tmp1 < 5)
							this[((this.firstWeek > tmp2) ? 7 : 0) + 7 * (tmp1 - 1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' ';
						else {
							tmp1 -= 5;
							tmp3 = (this.firstWeek + this.length - 1) % 7; //当月最后一天星期?
							this[this.length - tmp3 - 7 * tmp1 + tmp2 - (tmp2 > tmp3 ? 7 : 0) - 1].solarFestival += RegExp.$5 + ' ';
						}
					}
			//农历节日
			for (i in lFtv)
				if (lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
					tmp1 = Number(RegExp.$1) - firstLM;
					if (tmp1 == -11)
						tmp1 = 1;
					if (tmp1 >= 0 && tmp1 < n) {
						tmp2 = lDPOS[tmp1] + Number(RegExp.$2) - 1;
						if (tmp2 >= 0 && tmp2 < this.length && this[tmp2].isLeap != true) {
							this[tmp2].lunarFestival += RegExp.$4 + ' ';
							if (RegExp.$3 == '*')
								this[tmp2].color = 'red';
						}
					}
				}
			//复活节只出现在3或4月
			if (m == 2 || m == 3) {
				var estDay = new $scope.easter(y);
				if (m == estDay.m)
					this[estDay.d - 1].solarFestival = this[estDay.d - 1].solarFestival + ' 复活节';
			}
			//黑色星期五
			if ((this.firstWeek + 12) % 7 == 5)
				this[12].solarFestival += '黑色星期五';
			//今日
			if (y == tY && m == tM)
				this[tD - 1].isToday = true;
		};
		//存放节假日
		$scope.daycheck = [];
		$scope.drawCld = function(SY, SM) {
		    var i,sD,s,size;
		    $scope.cld = new $scope.calendar(SY, SM);
		    var rows = null;
		    $("#GZ")[0].innerHTML = '  农历' + $scope.cyclical(SY - 1900 + 36) + '年&nbsp;【' + Animals[(SY - 4) % 12] + '年】';
		    for (i = 0; i < 42; i++) {
		        $scope.sObj = $("#SD" + i)[0];
		        $scope.lObj = $("#LD" + i)[0];
		        $scope.sObj.className = '';
		        //在这里回显回来的数值，如果是工作日为淡粉红，假日为青色
		        sD = i - $scope.cld.firstWeek;
		        var type =  $("#GD" + i).attr("class"); //每次进来 都清除所有样式
		        angular.element("#GD" + i)[0].attributes["on"].value='0'; //还原on的值
				$("#GD" + i).removeClass(type);
		        if (sD > -1 && sD < $scope.cld.length) {  //日期内
		        	$scope.sObj.innerHTML = sD + 1;
					var nowDays = SY+''+$scope.addZ((SM+1))+$scope.addZ((sD+1));
					var hstr = [];
					if($scope.hDays.length > 0){
						for(var c=0;c<$scope.hDays.length;c++){
							hstr.push($scope.hDays[c].ymd);
						}
					}
					if(hstr.indexOf(nowDays)>-1){
						 $("#GD" + i).addClass("selday");
						 angular.element("#GD" + i)[0].attributes["on"].value='1'; //设置on的值
					}
					$scope.sObj.style.color = $scope.cld[sD].color;  //国定假日颜色
		            if ($scope.cld[sD].lDay == 1){  //显示农历月
		                $scope.lObj.innerHTML = '<b>' + ($scope.cld[sD].isLeap ? '闰' : '') + $scope.cld[sD].lMonth + '月' + ($scope.monthDays($scope.cld[sD].lYear, $scope.cld[sD].lMonth) == 29 ? '小' : '大') + '</b>';
		            }else{  //显示农历日
		                $scope.lObj.innerHTML = $scope.cDay($scope.cld[sD].lDay);
		            }
		            s = $scope.cld[sD].lunarFestival;
		            if (s.length > 0) {  //农历节日
		                if (s.length > 8) s = s.substr(0, 7) + '...';
		                	s = s.fontcolor('red');
		            } else {  //国历节日
		                s = $scope.cld[sD].solarFestival;
		                if (s.length > 0) {
		                    s = (s == '黑色星期五') ? s.fontcolor('black') : s.fontcolor('#0066FF');
		                }
		                else {  //廿四节气
		                    s = $scope.cld[sD].solarTerms;
		                    if (s.length > 0)  s = s.fontcolor('limegreen');
		                }
		            }
		            if ($scope.cld[sD].solarTerms == '清明') s = '清明节'.fontcolor('red');
		            if ($scope.cld[sD].solarTerms == '芒种') s = '芒种'.fontcolor('red');
		            if ($scope.cld[sD].solarTerms == '夏至') s = '夏至'.fontcolor('red');
		            if ($scope.cld[sD].solarTerms == '冬至') s = '冬至'.fontcolor('red');
		            if (s.length > 0) { $scope.lObj.innerHTML = s;}
		            // 注册点击事件
					//$("#GD" + i).unbind('click').click(function(){$scope.mOck(this);});
		        }
		        else {  //非日期
		            $("#GD" + i).addClass("unover");
		        }
		    }
		};
		//日期点击函数
		$scope.mOck = function(thisObj){
			$scope.isShow = true;
			var GdIds = thisObj.currentTarget.id;
			var onoff = thisObj.currentTarget.attributes["on"].value; //判定当前是否已经选中了，0是表示之前没有被选 现在被选， 1是表示之前已经被选择了 现在取消
			var dayContainer = thisObj.currentTarget.getElementsByTagName("font")[0]; //公历显示数据
			var nian = $('#nian').text();
			var yue = $('#yue').text();
			var day = dayContainer.innerHTML;
			var ymd = nian+$scope.addZ(yue)+$scope.addZ(day);
			if (ymd.length!=8) {
				return false;
			}
			var dayContainer2 = thisObj.currentTarget.getElementsByTagName("font")[1];
			var name = dayContainer2.innerHTML;
			if (name.indexOf("font") > 0) { //获取农历的值
				var names = name.split(">");
				var namew = names[1].split("<");
				name = namew[0];
			}
			 var ids = thisObj.currentTarget.attributes["id"].value;
			//记录是否为周末        lx = 1  是工作日   0是周六 周末 和节假日  默认的
			//type =workday 特殊工作日    holiday 特殊假日
			var lx='1';//是工作日
			//var dayF = nian+'/'+$scope.addZ(yue)+'/'+$scope.addZ(day);
			 var dayJson = ""; //添加的数据
			 dayJson = {'ymd':ymd,'name':name,'GDIdInfo':GdIds,'holidayStatus':'O'};
			//dayJson = ymd;
			// var htmls = "";
				if (onoff == "0") {
					thisObj.currentTarget.attributes["on"].value='1';
					if(lx =="1"){ //表示工作日 周一到周5 
//						htmls += "<span  class='date' id="+ymd+">"+ymd+"   "+"<img id='imgclick"+ymd+"' value='"+ymd+"' ng-click='imgonclick("+ymd+","+ids+","+lx+")' src='images/false.png'/></span>";
//						var $html = $compile(htmls)($scope);
//						$("#setholiday").append($html);
					}
					$scope.hDays.push(dayJson);//加入数组
					thisObj.currentTarget.setAttribute("class", "selday");//设定为选中样式
					//$("#imgclick"+ymd).unbind('click').click(function(){$scope.imgonclick(ymd,thisObj,lx);});
				}else if (onoff == "1"){
					thisObj.currentTarget.attributes["on"].value='0';
					if(document.getElementById(ymd)){
						$("#"+ymd).remove();
					}
					//.innerHTML = "";//删除显示框中内容
					thisObj.currentTarget.setAttribute("class", "");//还原样式
					$scope.delArry($scope.hDays,dayJson); //删除数据内容
				}
		};
		$scope.initRiliIndex = function(){
		    var dateObj = new Date();
		    $scope.global.currYear = dateObj.getFullYear();
		    $scope.global.currMonth = dateObj.getMonth();
		    $scope.dateSelection.init();
		};
		$scope.initRiliIndex();
		$scope.clear();
	    $("#nian").html(tY);
	    $("#yue").html(tM + 1);
	    $scope.drawCld(tY, tM);
		/**
		 * 图片点击X事件
		 */
		$scope.imgonclick = function(value,idss,lx){
			var ss = idss.currentTarget.attributes["on"].value;
			var type = idss.currentTarget.getAttribute("class");  //判定类型 是否是特殊工作日和假日
			idss.currentTarget.attributes["on"].value='0'; //还原on的值
			var dayContainer2 = idss.currentTarget.getElementsByTagName("font")[1];
			var name = dayContainer2.innerHTML;
			if (name.indexOf("font") > 0) { //获取农历的值
				var names = name.split(">");
				var namew = names[1].split("<");
				name = namew[0];
			}
			var dayJsons = {'ymd':value,'name':name,'holidayStatus':'O'};
			//还原样式 设置on的值
			idss.currentTarget.setAttribute("class", "");
			//清除数据数组  
			$scope.delArry($scope.hDays,dayJsons); //删除数据内容
			//清除文本框
			$("#"+value).remove();
		};
		//删除
        $scope.delInfo = function(item,$index){
        	angular.element('#'+item.GDIdInfo)[0].attributes["on"].value='0'; //还原on的值
        	angular.element('#'+item.GDIdInfo)[0].setAttribute("class", "");  //恢复未选择样式
        	$scope.hDays.splice($index,1);
        };
        $scope.isSelect = true;
        $scope.isInput = false;
        $scope.isAddBtn = true;
        $scope.isCanBtn = false;
        $scope.addHolidayInfut = function(){
        	$scope.isSelect = false;
            $scope.isInput = true;
            $scope.isAddBtn = false;
            $scope.isCanBtn = true;
            $scope.holidayNoSelect = "";
        };
        $scope.selHolidayInfut = function(){
        	$scope.isSelect = true;
            $scope.isInput = false;
            $scope.isAddBtn = true;
            $scope.isCanBtn = false;
            $scope.holidayNoInfut = "";
        };
	    //保存
        $scope.saveHoliday = function(){
        	var dayResult = ""; 
        	$scope.dayInfo = {};
        	$scope.dayInfo.dayResultList = [];
        	if($scope.hDays.length == 0){
        		jfLayer.alert(T.T('PZJ1600003')); 
        	}else{
        		for(var m=0;m<$scope.hDays.length;m++){
        			dayResult = {'holidayDate':$scope.hDays[m].ymd,'holidayStatus':$scope.hDays[m].holidayStatus};
        			$scope.dayInfo.dayResultList.push(dayResult);
        		}
        		if($scope.holidayNoInfut){
        			$scope.dayInfo.holidayNo = $scope.holidayNoInfut;
        		}else if($scope.holidayNoSelect){
        			$scope.dayInfo.holidayNo = $scope.holidayNoSelect;
        		}else{
        			jfLayer.alert(T.T('PZJ1600006')); 
        			return;
        		}
        		$scope.dayInfo.holidayNo = 
        		jfRest.request('holiday', 'save', $scope.dayInfo).then(function(data) {
	                if (data.returnMsg == 'OK') {
	                	jfLayer.success(T.T('F00058')); 
	                	$scope.hDays = [];
		    			$scope.dayInfo = {};
		    			$scope.isShow = false;
		    			$scope.initRiliIndex();
		    			$scope.dateSelection.init();
		    			$scope.clear();
		    		    $("#nian").html(tY);
		    		    $("#yue").html(tM + 1);
		    		    $scope.drawCld(tY, tM);
	                }
	            });
        	}
        }
	});
});
