(function() {
    angular.module('validation.rule', ['validation'])
        .config(['$validationProvider',
            function($validationProvider) {
                var expression = {
                	// 必填
                    required: function(value, scope, element, attrs, param) {
                        var value = $.isArray(value) ? value.length : $.trim(value);
                        return !!value;
                    },
                    // 最小值
                    min: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	value = String(value).replace(/[,]/g, "");
                        return parseFloat(value) >= parseFloat(param);
                    },
                    // 最大值
                    max: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        /*if (parseInt(param) === 0) {
                            return true;
                        } else {
                            return parseFloat(value) <= parseFloat(param);
                        }*/
                    	value = String(value).replace(/[,]/g, "");
                        return parseFloat(value) <= parseFloat(param);
                    },
                    // 最小长度
                    minlength: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        return value.length >= param;
                    },
                    // 最大长度
                    maxlength: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        return value.length <= param;
                    },
                    // 最小字节长度
                    minlengthByte: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	 var len = 0;
                    	  for (var i = 0; i < value.length; i++) {
                    	    if (value[i].match(/[^\x00-\xff]/ig) != null) //全角
                    	        len += 2;
                    	    else
                    	        len += 1;
                    	  }
                        return len >= parseInt(attrs.minlengthbyte);
                    },
                    // 最大字节长度
                    maxlengthByte: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	 var len = 0;
                    	  for (var i = 0; i < value.length; i++) {
                    	    if (value[i].match(/[^\x00-\xff]/ig) != null) //全角
                    	        len += 2;
                    	    else
                    	        len += 1;
                    	  }
                        return len <= parseInt(attrs.maxlengthbyte);
                    },
                 // 外部识别号设置隐藏
                    exShow: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        var pattern = /^[8,\*]{6}\*{9}[8,\*]{4}$/;
                        return pattern.test(value);
                    },
                    // 只能输入Y或者N
                    rangeyn: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        var param = param.replace(new RegExp("\\[\|\\]", "g"), '').split('|'),
                            value = value;
                        return value == param[0] || value == param[1];
                    },
                    // 范围值
                    range: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        var param = param.replace(new RegExp("\\[\|\\]", "g"), '').split('|'),
                            value = parseFloat(value);
                        return value >= parseFloat(param[0]) && value <= parseFloat(param[1]);
                    },
                    // 范围长度
                    rangelength: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        var param = param.replace(new RegExp("\\[\|\\]", "g"), '').split('|');
                        return value.length >= param[0] && value.length <= param[1];
                    },

                    //为方便测试环境，身份证验证 只验证18位，
                    idcard: function(value, scope, element, attrs, param) {
                    		if(!value){
                        		return true ;
                        	}
                            var pattern = /^\d{17}(\d|x|X)$/;
                            return pattern.test(value);
                    },

                    //生产环境 正确的身份证验证
                    idcardPro: function(value) {
                        // 构造函数，变量为15位或者18位的身份证号码
                        function clsIDCard(CardNo) {
                            this.Valid = false;
                            this.ID15 = '';
                            this.ID18 = '';
                            this.Local = '';
                            if (CardNo != null) this.SetCardNo(CardNo);
                        }
                        // 设置身份证号码，15位或者18位
                        clsIDCard.prototype.SetCardNo = function(CardNo) {
                                this.ID15 = '';
                                this.ID18 = '';
                                this.Local = '';
                                CardNo = CardNo.replace(" ", "");
                                var strCardNo;
                                if (CardNo.length == 18) {
                                    pattern = /^\d{17}(\d|x|X)$/;
                                    if (pattern.exec(CardNo) == null) return;
                                    strCardNo = CardNo.toUpperCase();
                                } else {
                                    pattern = /^\d{15}$/;
                                    if (pattern.exec(CardNo) == null) return;
                                    strCardNo = CardNo.substr(0, 6) + '19' + CardNo.substr(6, 9);
                                    strCardNo += this.GetVCode(strCardNo);
                                }
                                this.Valid = this.CheckValid(strCardNo);
                            };
                            // 校验身份证有效性
                        clsIDCard.prototype.IsValid = function() {
                                return this.Valid;
                            };
                            // 返回生日字符串，格式如下，1981-10-10
                        clsIDCard.prototype.GetBirthDate = function() {
                                var BirthDate = '';
                                if (this.Valid) BirthDate = this.GetBirthYear() + '-' + this.GetBirthMonth() + '-' + this.GetBirthDay();
                                return BirthDate;
                            };
                            // 返回生日中的年，格式如下，1981
                        clsIDCard.prototype.GetBirthYear = function() {
                                var BirthYear = '';
                                if (this.Valid) BirthYear = this.ID18.substr(6, 4);
                                return BirthYear;
                            };
                            // 返回生日中的月，格式如下，10
                        clsIDCard.prototype.GetBirthMonth = function() {
                                var BirthMonth = '';
                                if (this.Valid) BirthMonth = this.ID18.substr(10, 2);
                                if (BirthMonth.charAt(0) == '0') BirthMonth = BirthMonth.charAt(1);
                                return BirthMonth;
                            };
                            // 返回生日中的日，格式如下，10
                        clsIDCard.prototype.GetBirthDay = function() {
                                var BirthDay = '';
                                if (this.Valid) BirthDay = this.ID18.substr(12, 2);
                                return BirthDay;
                            };
                            // 返回性别，1：男，0：女
                        clsIDCard.prototype.GetSex = function() {
                                var Sex = '';
                                if (this.Valid) Sex = this.ID18.charAt(16) % 2;
                                return Sex;
                            };
                            // 返回15位身份证号码
                        clsIDCard.prototype.Get15 = function() {
                                var ID15 = '';
                                if (this.Valid) ID15 = this.ID15;
                                return ID15;
                            };
                            // 返回18位身份证号码
                        clsIDCard.prototype.Get18 = function() {
                                var ID18 = '';
                                if (this.Valid) ID18 = this.ID18;
                                return ID18;
                            };
                            // 返回所在省，例如：上海市、浙江省
                        clsIDCard.prototype.GetLocal = function() {
                            var Local = '';
                            if (this.Valid) Local = this.Local;
                            return Local;
                        };
                        clsIDCard.prototype.GetVCode = function(CardNo17) {
                            var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
                            var Ai = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                            var cardNoSum = 0;
                            for (var i = 0; i < CardNo17.length; i++) cardNoSum += CardNo17.charAt(i) * Wi[i];
                            var seq = cardNoSum % 11;
                            return Ai[seq];
                        };
                        clsIDCard.prototype.CheckValid = function(CardNo18) {
                            if (this.GetVCode(CardNo18.substr(0, 17)) != CardNo18.charAt(17)) return false;
                            if (!this.IsDate(CardNo18.substr(6, 8))) return false;
                            var aCity = {
                                11: "北京",
                                12: "天津",
                                13: "河北",
                                14: "山西",
                                15: "内蒙古",
                                21: "辽宁",
                                22: "吉林",
                                23: "黑龙江 ",
                                31: "上海",
                                32: "江苏",
                                33: "浙江",
                                34: "安徽",
                                35: "福建",
                                36: "江西",
                                37: "山东",
                                41: "河南",
                                42: "湖北 ",
                                43: "湖南",
                                44: "广东",
                                45: "广西",
                                46: "海南",
                                50: "重庆",
                                51: "四川",
                                52: "贵州",
                                53: "云南",
                                54: "西藏 ",
                                61: "陕西",
                                62: "甘肃",
                                63: "青海",
                                64: "宁夏",
                                65: "新疆",
                                71: "台湾",
                                81: "香港",
                                82: "澳门",
                                91: "国外"
                            };
                            if (aCity[parseInt(CardNo18.substr(0, 2))] == null) return false;
                            this.ID18 = CardNo18;
                            this.ID15 = CardNo18.substr(0, 6) + CardNo18.substr(8, 9);
                            this.Local = aCity[parseInt(CardNo18.substr(0, 2))];
                            return true;
                        };
                        clsIDCard.prototype.IsDate = function(strDate) {
                            var r = strDate.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
                            if (r == null) return false;
                            var d = new Date(r[1], r[2] - 1, r[3]);
                            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[2] && d.getDate() == r[3]);
                        };
                        var checkFlag = new clsIDCard(value);
                        if (!checkFlag.IsValid()) {
                            return false;
                        } else {
                            return true;
                        }
                    },

                    //重置后，validator为空，则不验证
                    noValidator :function(value, scope, element, attrs, param) {
                    		return true ;
                    },
                    //港澳居民来往内地通行证
                    isHKCard: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	/*长11位，以HM开头+10位数字*/
                        var pattern = /^([HMhm]\d{10}(\(\w{1}\))?)$/;
                        return pattern.test(value);
                    },
                    //台湾居民来往内地通行证
                    isTWCard: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	/*/^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;*/
                    /*	第一位字母或数字+8位数字*/
                        var pattern =  /^([a-zA-Z0-9]|[0-9]){8}$/;

                        return pattern.test(value);
                    },
                    //外国人永久居留证
                    isPermanentReside: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	/*前3位字母+12位数字*/
                        var pattern = /^[a-zA-Z]{3}\d{12}$/;
                        return pattern.test(value);
                    },

                  //护照
					passport : function(value) {
						if(!value){
                    		return true ;
                    	}
                    	//var pattern = new RegExp("/^((1[45]\d{7})|(G\d{8})|(P\d{7})|(S\d{7,8}))?$/");
						//// 规则： 字母开头+8位数字
						var pattern = /^([a-zA-Z]|[0-9]){9}$/;
                    	return pattern.test(value) ;
					},
					// 军官证号码
					militaryCard : function(value) {
						if(!value){
                    		return true ;
                    	}
                    	var pattern = new RegExp("^([\u4e00-\u9fa5]{1,}[\u4e00-\u9fa50-9()()-]{5,})$");
                    	return pattern.test(value) ;
					},

                    // 判断是否与另一个元素的值相等 必须一致
                    equals: function(value, scope, element, attrs, param) {
                        var val = document.getElementsByName(param)[0].value;
                        return !val || value === val;
                    },
                    // 判断是否与另一个元素的值相等 不能一致
                    nosame: function(value, scope, element, attrs, param) {
                        var val = document.getElementsByName(param)[0].value;
                        //if(value == val){
//                        	return false
//                        }
                        return value != val;
                    },
                    // 是否为参数的整倍数
                    mul: function (value, scope, element, attrs, param) {
                        return value % param == 0;
                    },
                    // 是否包含特殊符号
                    noSpecialStr: function(value, scope, element, attrs, param) {
                        var pattern = new RegExp("[%`~!@#$^&*()=|{}':;',\\[\\].<> /?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？\"\\\\+-]");
                        return !(pattern.test(value));
                    },
                    // 中文姓名
                    name: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        var pattern = /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/;
                        return pattern.test(value);
                    },
                    // 只能输入中文和小括号
                    chinese: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                        var pattern = /^[\u4E00-\u9FA5()$^]*$/;
                        return pattern.test(value);
                    },
                    // url地址
                    url: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	var pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ ;
                    	return pattern.test(value);
					},
                    // 电子邮箱
                    email: function(value, scope, element, attrs, param) {
                    	if(!value){
                    		return true ;
                    	}
                    	var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/ ;
                    	return pattern.test(value) ;
                    },
                    // 正整数
                    number: function(value) {
                    	if(!value){
                    		return true ;
                    	}
                    	var pattern = /^\d+$/ ;
                    	value = String(value).replace(/[,]/g, "");
                    	return pattern.test(value) ;
					},
					// 4位正整数
                    number4: function(value) {
                    	if(!value){
                    		return true ;
                    	}
                    	var pattern = /^[0-9]{4}$/ ;
                    	value = String(value).replace(/[,]/g, "");
                    	return pattern.test(value) ;
					},
					//非负数/^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,2})$/
					positiveNumber: function(value) {
                    	if(!value){
                    		return true ;
                        }
                        var pattern = /^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,})$/ ;
                    	value = String(value).replace(/[,]/g, "");
                    	return pattern.test(value) ;
					},

                    // 手机号码
                    phone: function(value) {
                    	if(!value){
                    		return true ;
                    	}
                    	var pattern = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/ ;
                    	return pattern.test(value) ;
					},

					//大写字母和数字
					upperNumber: function(value) {
	                    	if(!value){
	                    		return true ;
	                    	}
//	                    	var pattern = /^[A-Z0-9]+$/; //olde正则，不支持空格
	                    	var pattern = /^[A-Z0-9 ]*[A-Z0-9+[A-Z0-9 ]*$/;

	                    	return pattern.test(value) ;
						},
                    // 小数点两位数字
                    decimals: function(value) {
                    	if(!value){
                    		return true ;
                    	}
                    	value = String(value).replace(/[,]/g, "");
                    	var pattern = /^\d+(\.\d{1,2})?$/ ;
                    	return pattern.test(value) ;
					},
					// 大于0小于1小数点4位数字
                    zt_decimals: function(value) {
                    	if(!value){
                    		return true ;
                    	}
                    	value = String(value).replace(/[,]/g, "");
                    	var pattern = /^[0-1](\.\d{1,4})?$/ ;
                    	return pattern.test(value) ;
					},
                    // 大于0的小数点两位数字
                    gt_decimals: function(value) {
						if(!value){
							return true ;
						}
						value = String(value).replace(/[,]/g, "");
						var pattern = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,2})?$/ ;
						return pattern.test(value) ;
					},
					// 大于0的小数点4位数字
                    gt_four_decimals: function(value) {
						if(!value){
							return true ;
						}
						value = String(value).replace(/[,]/g, "");
						var pattern = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,4})?$/ ;
						return pattern.test(value) ;
					},
					// 大于0的小数点5位数字
                    gt_five_decimals: function(value) {
						if(!value){
							return true ;
						}
						value = String(value).replace(/[,]/g, "");
						var pattern = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,5})?$/ ;
						return pattern.test(value) ;
					},
					// 大于0的小数点6位数字
                    gt_six_decimals: function(value) {
						if(!value){
							return true ;
						}
						value = String(value).replace(/[,]/g, "");
						var pattern = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,6})?$/ ;
						return pattern.test(value) ;
					},
					// 大于0的小数点9位数字
                    gt_nine_decimals: function(value) {
						if(!value){
							return true ;
						}
						value = String(value).replace(/[,]/g, "");
						var pattern = /^(?!0(\d|\.0+$|$))\d+(\.\d{1,9})?$/ ;
						return pattern.test(value) ;
					},

					//小数且小数点7位数字
					sevenDecimals: function(value) {
						if(!value){
							return true ;
						}
						value = String(value).replace(/[,]/g, "");
						var pattern = /^(?!0(\.0+$|$))\d+(\.\d{1,7})?$/ ;
						return pattern.test(value) ;
					},

					//小数点可以，千分符逗号不可以
					decimalNoComma: function(value) {
						if(!value){
							return true ;
                        }
                        var pattern = /^\d+$|^\d*\.\d+$/g ;
						return pattern.test(value) ;
					},
                    // QQ号码
                    qq: function(value) {
                    	if(!value){
							return true ;
						}
                    	var pattern = /^[1-9][0-9]{4,}$/ ;
                    	return pattern.test(value) ;
					},
                    // 用户名
                    username: function(value) {
						if(!value){
							return true ;
						}
						//var pattern = /^[a-zA-Z][a-zA-Z0-9]{5,19}$/ ;  // z英文和数字组合正则
						var pattern = /^[a-zA-Z]{5,19}$/ ;  //全英文正则
						return pattern.test(value) ;
					},
                    // 密码
                    password: function(value) {
                    	//if(!value){
//							return true ;
//						}
//                    	var r = /^[0-9a-zA-Z`~!@#$%^&*()_+<>?:"{},.\/;'[\]]{6,20}$/;// 特殊字符可以补充，与后续校验同步即可
//                        if(r.test(value)){
//                            var a = /[0-9]/.exec(value)!=null ? 1:0;
//                            var b = /[a-z]/.exec(value)!=null ? 1:0;
//                            var c = /[A-Z]/.exec(value)!=null ? 1:0;
//                            var d = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.exec(value)!=null ? 1:0;
//                            return a + b + c + d >= 2;// 至少2种
//                        }
//                        return false;


						//密码规则：至少八个字符，至少一个字母和一个数字
						// var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/ ;
						// if (value == null || value.length < 8) {
					    //     return false;
					    // }
						// var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
                        var reg = new RegExp(/(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,16}/i)
					    if (reg.test(value))
					        return true;
					},
                    // 电话号码
                    tel: function(value) {
                    	if(!value){
							return true ;
						}
                    	var pattern = /^(0[1-9]{1}[0-9]{1,2})?[1-9][0-9]{6,15}$/ ;
                    	return pattern.test(value) ;
					},
					// 手机号或者电子邮箱
					mobileOrEmail:function(value) {
						if(!value) {
							return true;
						}
						var mobilePattern = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
						var emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/ ;
                    	return mobilePattern.test(value) || emailPattern.test(value);
					},
                    // 电话号码或者手机号
                    telephone: function(value, element) {
                    	if(!value){
                    		return true ;
                    	}
                       /* function tel(val) {
                            return /^(0[1-9]{1}[0-9]{1,2})?[1-9][0-9]{6,7}$/.test(val);
                        }*/
                    	function gdtel(val) {
                            return /[0-9]{11}$/.test(val);
                        }
                        function _tel(val) {
                            return /[0-9]{2,5}-[0-9]{7,8}$/.test(val);
                        }

                        function mobile(val) {
                            return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(val);
                        }

                        function telTodo(val) {
                            if (gdtel(val) || mobile(val) || _tel(val)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return telTodo(value);
                    },
                    noreqcode:function(value,element){
                    	var pattern = /^[0-9]\d{5}(?!\d)$/;
	                    var length = $.isArray(value) ? value.length : $.trim(value).length;
	                    if (!pattern.exec(value) && length) {
	                        return false;
	                    } else {
	                        return true;
	                    }
                    },
                    remote : function(value, scope, element, attrs, param, $injector) {
                    	var $q = $injector.get('$q') ;
                    	var jfParam = $injector.get('jfParam') ;
                    	var jfHelper = $injector.get('jfHelper') ;
                    	var $http = $injector.get('$http') ;
                    	var deferred = $q.defer();

                    	$http.post(param, {value : value}).success(function(data) {
                    		if(data.status == 200){
                    			deferred.resolve(true) ;
							}else{
								deferred.reject(false);
							}
						}).error(function() {
							deferred.reject(false);
						}) ;

                    	return deferred.promise;
					},
					//数字或英文
					intOrEng : function(value, scope, element, attrs) {
						if(!value){
                    		return true ;
                    	}
                    	var pattern = /^[A-Za-z0-9]+$/ ;
                    	return pattern.test(value) ;
					},
					//英文
					english : function(value, scope, element, attrs) {
						if(!value){
                    		return true ;
                    	}
                    	var pattern = /^[A-Za-z]+$/ ;
                    	return pattern.test(value) ;
					},
					//大写英文
					upperLetter : function(value, scope, element, attrs) {
						if(!value){
                    		return true ;
                    	}
                    	var pattern = /^[A-Z]+$/ ;
                    	return pattern.test(value) ;
					},
					//大写英文---地区码
					upperLetterCode : function(value, scope, element, attrs) {
						if(!value){
                    		return true ;
                    	}
                    	var pattern = /^[A,B,C,D,E,F,Y,Z,0]+$/ ;
                    	return pattern.test(value) ;
					},
					//小写英文
					lowerLetter : function(value, scope, element, attrs) {
						if(!value){
                    		return true ;
                    	}
                    	var pattern = /^[a-z]+$/ ;
                    	return pattern.test(value) ;
					},
					//社会信用社代码或营业执照
					creditCode : function(value, scope, element, attrs) {
						function creditCode(value) {
							var patrn = /^[0-9A-Z]+$/;
							if(!value){
	                    		return true ;
	                    	}
							// 18位校验及大写校验
							if ((value.length != 18) || (patrn.test(value) == false)){
								return false ;
						 	}else{
						 		var Ancode;// 统一社会信用代码的每一个值
						 		var Ancodevalue;// 统一社会信用代码每一个值的权重
						 		var total = 0;
						 		var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];// 加权因子
						 		var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
							 		// 不用I、O、S、V、Z
						 		for (var i = 0; i < value.length - 1; i++)
						 		{
						 			Ancode = value.substring(i, i + 1);
						 			Ancodevalue = str.indexOf(Ancode);
						 			total = total + Ancodevalue * weightedfactors[i];
						 			// 权重与加权因子相乘之和
						 		}
						 		var logiccheckcode = 31 - total % 31;
						 		if (logiccheckcode == 31)
						 		{
						 			logiccheckcode = 0;
						 		}
						 		var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
						 		var Array_Str = Str.split(',');
						 		logiccheckcode = Array_Str[logiccheckcode];

						 		var checkcode = value.substring(17, 18);
						 		if (logiccheckcode != checkcode){
						 			return false ;
						 		}
						 		return true ;
						 	}
						}

					    function busCode(value){
					        if(!value){
	                    		return true ;
	                    	}
					        if(value.length==15){
					            var sum=0;
					            var s=[];
					            var p=[];
					            var a=[];
					            var m=10;
					            p[0]=m;
					            for(var i=0;i<value.length;i++){
					               a[i]=parseInt(value.substring(i,i+1),m);
					               s[i]=(p[i]%(m+1))+a[i];
					               if(0==s[i]%m){
					                 p[i+1]=10*2;
					               }else{
					                 p[i+1]=(s[i]%m)*2;
					                }
					            }
					            if(1==(s[14]%m)){
					               //营业执照编号正确!
					                return true;
					            }else{
					               //营业执照编号错误!
					                return false;
					             }
					        }
					        return false;
					    }

						return creditCode(value) || busCode(value) ;
					},
					//社会信用社代码
					socialCreditCode : function(value, scope, element, attrs) {
						function creditCode(value) {
							var patrn = /^[0-9A-Z]+$/;
							if(!value){
	                    		return true ;
	                    	}
							// 18位校验及大写校验
							if ((value.length != 18) || (patrn.test(value) == false)){
								return false ;
						 	}else{
						 		var Ancode;// 统一社会信用代码的每一个值
						 		var Ancodevalue;// 统一社会信用代码每一个值的权重
						 		var total = 0;
						 		var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];// 加权因子
						 		var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
							 		// 不用I、O、S、V、Z
						 		for (var i = 0; i < value.length - 1; i++)
						 		{
						 			Ancode = value.substring(i, i + 1);
						 			Ancodevalue = str.indexOf(Ancode);
						 			total = total + Ancodevalue * weightedfactors[i];
						 			// 权重与加权因子相乘之和
						 		}
						 		var logiccheckcode = 31 - total % 31;
						 		if (logiccheckcode == 31)
						 		{
						 			logiccheckcode = 0;
						 		}
						 		var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
						 		var Array_Str = Str.split(',');
						 		logiccheckcode = Array_Str[logiccheckcode];

						 		var checkcode = value.substring(17, 18);
						 		if (logiccheckcode != checkcode){
						 			return false ;
						 		}
						 		return true ;
						 	}
						}

						return creditCode(value);
					}

                };

                var defaultMsg = {
                    required: {
                        errorcn: '不能为空',
                        erroren: 'Not NULL',
                        errorzhtw: '不能為空',
                        success: ''
                    },
                    min: {
                        errorcn: '输入值不能小于{0}',
                        erroren: 'Input value cannot be less than {0}',
                        errorzhtw: '輸入值不能小於{0}',
                        success: ''
                    },
                    max: {
                        errorcn: '输入值不能大于{0}',
                        erroren: 'Input value cannot be greater than {0}',
                        errorzhtw: '輸入值不能大於{0}',
                        success: ''
                    },
                    minlength: {
                        errorcn: '输入长度不能小于{0}字符',
                        erroren: 'Input length must not be less than {0} characters',
                        errorzhtw: '輸入長度不能小於{0}字符',
                        success: ''
                    },
                    maxlength: {
                        errorcn: '输入长度不能大于{0}字符',
                        erroren: 'Input length cannot be greater than {0} characters',
                        errorzhtw: '輸入長度不能大於{0}字符',
                        success: ''
                    },
                    maxlengthByte: {
                        errorcn: '输入长度不能大于{0}字节',
                        erroren: 'Input length cannot be greater than {0} bytes',
                        errorzhtw: '輸入長度不能大於{0}字节',
                        success: ''
                    },
                    minlengthByte: {
                        errorcn: '输入长度不能小于{0}字节',
                        erroren: 'Input length cannot be less than {0} bytes',
                        errorzhtw: '輸入長度不能小於{0}字节',
                        success: ''
                    },
                    rangeyn: {
                        errorcn: '请输入{0}或{1}',
                        erroren: 'Please enter {0} or {1}',
                        errorzhtw: '請輸入{0}或{1}',
                        success: ''
                    },
                    exShow:{
                    	 errorcn: '必须19位，中间9位必须是*，前6位和后4位可以是*或者8',
                         erroren: '必须19位，中间9位必须是*，前6位和后4位可以是*或者8',
                         errorzhtw: '必须19位，中间9位必须是*，前6位和后4位可以是*或者8',
                         success: ''
                    },
                    range: {
                        errorcn: '请输入{0}~{1}之间值',
                        erroren: 'Please enter a value between {0} and {1}',
                        errorzhtw: '請輸入{0}~{1}之間值',
                        success: ''
                    },
                    rangelength: {
                        errorcn: '请输入{0}~{1}之间字符长度',
                        erroren: 'Please enter the character length between {0} and {1}',
                        errorzhtw: '請輸入{0}~{1}之間字符長度',
                        success: ''
                    },
                   /* 测试环境*/
                    idcard: {
                        errorcn: '请输入有效身份证号码',
                        erroren: 'Please enter your valid id card number',
                        errorzhtw: '請輸入有效身份證號碼',
                        success: ''
                    },
                  /*  生产环境*/
                    idcardPro : {
                    	errorcn: '请输入有效身份证号码',
                        erroren: 'Please enter your valid id card number',
                        errorzhtw: '請輸入有效身份證號碼',
                        success: ''
                    },
                    noValidator: {
                        errorcn: '',
                        erroren: '',
                        errorzhtw: '',
                        success: ''
                    },

                    isHKCard: {
                    	errorcn: '请输入有效港澳通行证号码',
                        erroren: 'Please enter your valid id card number',
                        errorzhtw: '請輸入有效港澳通行證號碼',
                        success: ''
                    },
                    isTWCard: {
                    	errorcn: '请输入有效台湾通行证号码',
                        erroren: 'Please enter your valid id card number',
                        errorzhtw: '請輸入有效台灣通行證號碼',
                        success: ''
                    },
                    isPermanentReside: {
                    	errorcn: '请输入有效外国人永久居留证号码',
                        erroren: 'Please enter your valid id card number',
                        errorzhtw: '請輸入有效外國人永久居留證號碼',
                        success: ''
                    },
                    equals: {
                        errorcn: '两次输入不一致',
                        erroren: 'The two inputs do not agree',
                        errorzhtw: '兩次輸入不一致',
                        success: ''
                    },
                    nosame: {
                    	errorcn: '两次输入一致',
                        erroren: 'The two inputs do not agree',
                        errorzhtw: '兩次輸入一致',
                        success: ''
                    },
                    mul: {
                        errorcn: '请输入{0}的倍数',
                        erroren: 'Please enter a multiple of {0}',
                        errorzhtw: '請輸入{0}的倍數',
                        success: ''
                    },
                    noSpecialStr: {
                        errorcn: '不能含有特殊字符',
                        erroren: 'No special characters are allowed',
                        errorzhtw: '不能含有特殊字符',
                        success: ''
                    },
                    name: {
                        errorcn: '输入姓名格式有误',
                        erroren: 'The input name was incorrectly formatted',
                        errorzhtw: '輸入姓名格式有誤',
                        success: ''
                    },
                    url: {
                        errorcn: '请输入正确的url地址',
                        erroren: 'Please enter the correct url address',
                        errorzhtw: '請輸入正確的url地址',
                        success: ''
                    },
                    email: {
                        errorcn: '请输入正确的邮箱地址',
                        erroren: 'Please enter the correct email address',
                        errorzhtw: '請輸入正確的郵箱地址',
                        success: ''
                    },
                    number: {
                        errorcn: '请输入整数格式',
                        erroren: 'Please enter integer format',
                        errorzhtw: '請輸入整數格式',
                        success: ''
                    },
                    number4: {
                        errorcn: '请输入4位整数',
                        erroren: 'Please enter 4 integer format',
                        errorzhtw: '請輸入4位整數',
                        success: ''
                    },
                    positiveNumber: {
                    	errorcn: '请输入正数格式',
                        erroren: 'Please enter integer format',
                        errorzhtw: '請輸入正數格式',
                        success: ''
                    },
                    phone: {
                        errorcn: '请输入正确手机格式',
                        erroren: 'Please input the correct mobile phone format',
                        errorzhtw: '請輸入正確手機格式',
                        success: ''
                    },
                    upperNumber: {
                        errorcn: '请输入大写字母和数字格式',
                        erroren: 'Please enter uppercase letters and numbers format',
                        errorzhtw: '請輸入大寫字母和數字格式',
                        success: ''
                    },
                    decimals: {
                        errorcn: '请输入整数或最多保留两位小数格式',
                        erroren: 'Please enter an integer or at most two decimal places',
                        errorzhtw: '請輸入整數或最多保留兩位小數',
                        success: ''
                    },
                    zt_decimals: {
                        errorcn: '请输入大于0小于1的数值及最多保留四位小数格式',
                        erroren: 'Please enter a value greater than 0 and less than 1 and reserve a maximum of four decimal formats',
                        errorzhtw: '请输入大于0小于1的数值及最多保留四位小数格式',
                        success: ''
                    },
                    gt_decimals: {
                        errorcn: '请输入大于0的数值或最多保留两位小数格式',
                        erroren: 'Please enter a value greater than 0 or keep a maximum of two decimal places',
                        errorzhtw: '請輸入大於0的數值或最多保留兩位小數格式',
                        success: ''
                    },
                    gt_four_decimals: {
                        errorcn: '请输入大于0的数值或最多保留四位小数格式',
                        erroren: 'Please enter a value greater than 0 or keep a maximum of four decimal places',
                        errorzhtw: '請輸入大於0的數值或最多保留四位小數格式',
                        success: ''
                    },
                    gt_five_decimals: {
                        errorcn: '请输入大于0的数值或最多保留五位小数格式',
                        erroren: 'Please enter a value greater than 0 or keep a maximum of five decimal places',
                        errorzhtw: '請輸入大於0的數值或最多保留五位小數格式',
                        success: ''
                    },
                    gt_six_decimals: {
                        errorcn: '请输入大于0的数值或最多保留六位小数格式',
                        erroren: 'Please enter a value greater than 0 or keep a maximum of six decimal places',
                        errorzhtw: '請輸入大於0的數值或最多保留六位小數格式',
                        success: ''
                    },
                    gt_nine_decimals: {
                        errorcn: '请输入大于0的数值或最多保留九位小数格式',
                        erroren: 'Please enter a value greater than 0 or keep a maximum of nine decimal places',
                        errorzhtw: '請輸入大於0的數值或最多保留九位小數格式',
                        success: ''
                    },
                    sevenDecimals: {
                    	 errorcn: '最多保留7位小数',
                         erroren: 'Keep up to 7 decimal places',
                         errorzhtw: '最多保留七位小數',
                         success: ''
                    },
                    decimalNoComma : {
                    	errorcn: '输入金额格式不正确',
                        erroren: 'Keep up to 7 decimal places',
                        errorzhtw: '输入金额格式不正确',
                        success: ''
                    },
                    qq: {
                        errorcn: '请输入正确QQ格式',
                        erroren: 'Please enter the correct QQ format',
                        errorzhtw: '請輸入正確QQ格式',
                        success: ''
                    },
                    username: {
                       // error: '请输入以字母开头6-20位的字母、数字或组合',
                    	 errorcn: '请输入6-20位的字母，不区分大小写',
                    	 erroren: 'Please enter 6-20 - bit letters, case - insensitive',
                    	 error: '請輸入6-20位的字母，不區分大小寫',
                        success: ''
                    },
                    password: {
                        //errorcn: '请输入6-20位的字母、数字和符号两种及以上的组合',
                        //erroren: 'Please enter 6-20 - digit letters, Numbers and symbols in two or more combinations',
                        //errorzhtw: '請輸入6-20位的字母、數字和符號兩種及以上的組合',
                        errorcn: '长度8-16位，必须包含数字字母特殊符号',
                        erroren: 'Please enter an 8-digit password with at least two combinations of numbers and letters',
                        errorzhtw: '长度8-16位，必须包含数字字母特殊符号',
                        success: ''
                    },
                    tel: {
                        errorcn: '电话格式有误',
                        erroren: 'Wrong phone format',
                        errorzhtw: '電話格式有誤',
                        success: ''
                    },
                    mobileOrEmail : {
                    	errorcn: '请输入正确的手机号码/邮箱',
                    	erroren: 'Please enter the correct mobile phone number/email address',
                    	errorzhtw: '請輸入正確的手機號碼/郵箱',
                    	success: ''
                    },
                    telephone: {
                        errorcn: '电话格式有误',
                        erroren: 'Wrong phone format',
                        errorzhtw: '電話格式有誤',
                        success: ''
                    },
                    noreqcode:{
                    	errorcn: '邮编格式有误',
                    	erroren: 'The postcode was misformatted',
                    	errorzhtw: '郵編格式有誤',
                        success: ''
                    },
                    remote : {
                    	errorcn: '远程控制器返回错误结果',
                    	erroren: 'The remote controller returns an error result',
                    	errorzhtw: '遠程控制器返回錯誤結果',
                    	success:''
                    },
                    intOrEng : {
                    	errorcn: '请输入数字或字母',
                    	erroren: 'Please enter a number or letter',
                    	errorzhtw: '請輸入數字或字母',
                    	success:''
                    },
                    creditCode : {
                    	errorcn: '不是有效的统一社会信用编码',
                    	erroren: 'Is not an effective unified social credit code',
                    	errorzhtw: '不是有效的統一社會信用編碼',
                    	success:''
                    },
                    socialCreditCode : {
                    	errorcn: '不是有效的统一社会信用编码',
                    	erroren: 'Is not an effective unified social credit code',
                    	errorzhtw: '不是有效的統一社會信用編碼',
                    	success:''
                    },
                    passport: {
                        errorcn: '请输入有效护照号',
                        erroren: 'Please enter your valid passport number',
                        errorzhtw: '請輸入有效護照號',
                        success: ''
                    },
                    militaryCard: {
                        errorcn: '请输入有效军官证号码',
                        erroren: 'Please enter your valid military id number',
                        errorzhtw: '請輸入有效軍官證號碼',
                        success: ''
                    },
                    english : {
                    	errorcn: '格式错误，只能输入字母',
                    	erroren: 'error. Type only letters',
                    	errorzhtw: '格式錯誤，只能輸入字母',
                    	success:''
                    },
                    upperLetter : {
                    	errorcn: '格式错误，只能输入大写英文',
                    	erroren: 'error. Only upper case English is allowed',
                    	errorzhtw: '格式錯誤，只能輸入大寫英文',
                    	success:''
                    },
                    upperLetterCode : {
                    	errorcn: '输入错误，有效值为0、A、B、C、D、E、F、Y、Z',
                    	erroren: '输入错误，有效值为0、A、B、C、D、E、F、Y、Z',
                    	errorzhtw: '输入错误，有效值为0、A、B、C、D、E、F、Y、Z',
                    	success:''
                    },
                    lowerLetter : {
                    	errorcn: '格式错误，只能输入小写英文',
                    	erroren: 'error, only lowercase English is allowed',
                    	errorzhtw: '格式錯誤，只能輸入小寫英文',
                    	success:''
                    },
                    chinese : {
                    	errorcn: '格式错误，只能输入中文和小括号',
                    	erroren: 'error. Only Chinese and parentheses are allowed',
                    	errorzhtw: '格式錯誤，只能輸入中文和小括號',
                    	success:''
                    }
                };

                $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);

            }
        ]);

}).call(this);
