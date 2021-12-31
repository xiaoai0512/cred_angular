(function() {
	angular.module('validation', ['validation.provider', 'validation.directive'])
}).call(this); (function() {
	angular.module('validation.provider', []).provider('$validation',
	function() {
		var lang = window.localStorage['lang'];
		var $injector, $scope, $http, $q, $timeout, _this = this;
		var setup = function(injector) {
			$injector = injector;
			$scope = $injector.get('$rootScope');
			$http = $injector.get('$http');
			$q = $injector.get('$q');
			$timeout = $injector.get('$timeout')
		};
		var expression = {};
		var defaultMsg = {};
		this.setExpression = function(obj) {
			angular.extend(expression, obj);
			return _this
		};
		this.getExpression = function(exprs) {
			return expression[exprs]
		};
		this.setDefaultMsg = function(obj) {
			angular.extend(defaultMsg, obj);
			return _this
		};
		this.getDefaultMsg = function(msg) {
			return defaultMsg[msg]
		};
		this.setErrorHTML = function(func) {
			if (func.constructor !== Function) {
				return
			}
			_this.getErrorHTML = func;
			return _this
		};
		this.getErrorHTML = function(message) {
			return message;
		};
		this.setSuccessHTML = function(func) {
			if (func.constructor !== Function) {
				return
			}
			_this.getSuccessHTML = func;
			return _this
		};
		this.getSuccessHTML = function(message) {
			return message
		};
		this.showSuccessMessage = true;
		this.showErrorMessage = true;
		this.checkValid = function(form) {
			var valid = true;
			if (form.constructor === Array) {
				for (var i in form) {
					if (form[i].$valid === undefined) {
						return false
					}
					valid = (valid && form[i] && form[i].$valid === true)
				}
			} else {
				if (form.$valid === undefined) {
					return false
				}
				valid = (form && form.$valid === true)
			}
			return (valid === true)
		};
		this.validate = function(form) {
			var deferred = $q.defer(),
			idx = 0;
			if (form === undefined) {
				console.error('This is not a regular Form name scope');
				deferred.reject('This is not a regular Form name scope');
				return deferred.promise
			}
			if (form.validationId) {
				$scope.$broadcast(form.$name + 'submit-' + form.validationId, idx++)
			} else if (form.constructor === Array) {
				for (var k in form) {
					for (var i in form[k]) {
						if (i[0] !== '$' && form[k][i].hasOwnProperty('$dirty')) {
							$scope.$broadcast(i + 'submit-' + form[k][i].validationId, idx++)
						}
					}
				}
			} else {
				for (var i in form) {
					if (i[0] !== '$' && form[i].hasOwnProperty('$dirty')) {
						$scope.$broadcast(i + 'submit-' + form[i].validationId, idx++)
					}
				}
			}
			deferred.promise.success = function(fn) {
				deferred.promise.then(function(value) {
					fn(value)
				});
				return deferred.promise
			};
			deferred.promise.error = function(fn) {
				deferred.promise.then(null,
				function(value) {
					fn(value)
				});
				return deferred.promise
			};
			$timeout(function() {
				if (_this.checkValid(form)) {
					deferred.resolve('success')
				} else {
					deferred.reject('error')
				}
			});
			return deferred.promise
		};
		this.validCallback = null;
		this.invalidCallback = null;
		this.reset = function(form) {
			if (form === undefined) {
				console.error('This is not a regular Form name scope');
				return
			}
			if (form.validationId) {
				$scope.$broadcast(form.$name + 'reset-' + form.validationId)
			} else if (form.constructor === Array) {
				for (var k in form) {
					$scope.$broadcast(form[k].$name + 'reset-' + form[k].validationId)
				}
			} else {
				for (var i in form) {
					if (i[0] !== '$' && form[i].hasOwnProperty('$dirty')) {
						$scope.$broadcast(i + 'reset-' + form[i].validationId)
					}
				}
			}
		};
		this.$get = ['$injector',
		function($injector) {
			setup($injector);
			return {
				setErrorHTML: this.setErrorHTML,
				getErrorHTML: this.getErrorHTML,
				setSuccessHTML: this.setSuccessHTML,
				getSuccessHTML: this.getSuccessHTML,
				setExpression: this.setExpression,
				getExpression: this.getExpression,
				setDefaultMsg: this.setDefaultMsg,
				getDefaultMsg: this.getDefaultMsg,
				showSuccessMessage: this.showSuccessMessage,
				showErrorMessage: this.showErrorMessage,
				checkValid: this.checkValid,
				validate: this.validate,
				validCallback: this.validCallback,
				invalidCallback: this.invalidCallback,
				reset: this.reset
			}
		}]
	})
}).call(this); (function() {
	angular.module('validation.directive', ['validation.provider']).directive('validator', ['$injector',
	function($injector) {
		var lang = window.localStorage['lang'];
		var $validationProvider = $injector.get('$validation'),
		$q = $injector.get('$q'),
		$timeout = $injector.get('$timeout');
		var validFunc = function(element, validMessage, validation, scope, ctrl) {
			
			var successMsg = $validationProvider.getDefaultMsg(validation).success,
			tempArr = [],
			validArr = element.attr('validator').split(',');
			for (var i = 0; i < validArr.length; i++) {
				var a = validArr[i].indexOf('='),
				b = a === -1 ? validArr[i] : validArr[i].substr(0, a),
				c = a === -1 ? element.attr(b) : validArr[i].substr(a + 1);
				b = $.trim(b);
				if (b == validation && c) {
					c = c.replace(new RegExp("\\[\|\\]", "g"), '').split('|');
					for (var m = 0; m < c.length; m++) {
						successMsg = successMsg.replace(new RegExp("\\{" + m + "\\}", "g"),
						function() {
							return c[m]
						})
					}
				}
            }
            var messageElem, messageToShow = validMessage || successMsg;
			if (scope.messageId) messageElem = angular.element(document.querySelector('#' + scope.messageId));
			else messageElem = element.parent().find('.walltip_content');
			if ($validationProvider.showSuccessMessage) {
				element.parent().removeClass('walltip'); 
				if(element.prop("tagName")=="SELECT"|| element.attr("type")=="radio"||element.attr("type")=="checkbox" ||element.attr("type")=="hidden"){
					element.parent().removeClass('waringform');
				}else{
					element.removeClass('waringform');
				}
				messageElem.html($validationProvider.getSuccessHTML(messageToShow));
				if (scope.messageId){
					messageElem.removeClass("warninger");
				}
			}
			ctrl.$setValidity(ctrl.$name, true);
			if (scope.validCallback) scope.validCallback({
				message: messageToShow
			});
			if ($validationProvider.validCallback) $validationProvider.validCallback(element);
			return true
		};
		var invalidFunc = function(element, validMessage, validation, scope, ctrl) {
			var errorMsg = "";
			if(lang == 'cn'){
				 errorMsg = $validationProvider.getDefaultMsg(validation).errorcn;
			}else if(lang == 'en'){
				 errorMsg = $validationProvider.getDefaultMsg(validation).erroren;
			}else if(lang == 'zh-tw'){
				 errorMsg = $validationProvider.getDefaultMsg(validation).errorzhtw;
			}else{
				 errorMsg = $validationProvider.getDefaultMsg(validation).errorcn;
			}
			var tempArr = [];
			var validArr = element.attr('validator').split(',');
			for (var i = 0; i < validArr.length; i++) {
				var a = validArr[i].indexOf('='),
				b = a === -1 ? validArr[i] : validArr[i].substr(0, a),
				c = a === -1 ? element.attr(b) : validArr[i].substr(a + 1);
				b = $.trim(b);
				if (b == validation && c) {
					c = c.replace(new RegExp("\\[\|\\]", "g"), '').split('|');
					for (var m = 0; m < c.length; m++) {
						errorMsg = errorMsg.replace(new RegExp("\\{" + m + "\\}", "g"),
						function() {
							return c[m]
						})
					}
				}
            }
            var messageElem, messageToShow = validMessage || errorMsg;
			if (scope.messageId) messageElem = angular.element(document.querySelector('#' + scope.messageId));
			else messageElem = element.parent().find('.walltip_content');
			if ($validationProvider.showErrorMessage) {
				element.parent().addClass('walltip');
				if(element.prop("tagName")=="SELECT"||element.attr("type")=="radio"||element.attr("type")=="checkbox"||element.attr("type")=="hidden"){
					element.parent().addClass('waringform');
				}else{
					element.addClass('waringform');
				}
				if (scope.messageId){
					messageElem.addClass("warninger");
				}
				//同一个id显示第一次错误的信息
			//	if(!messageElem.html()){
					messageElem.html($validationProvider.getErrorHTML(messageToShow));
				//}
				
			
				
				
			}
			ctrl.$setValidity(ctrl.$name, false);
			if (scope.invalidCallback) scope.invalidCallback({
				message: messageToShow
			});
			if ($validationProvider.invalidCallback) $validationProvider.invalidCallback(element);
			return false
		};
		var focusElements = {};
		var checkValidation = function(scope, element, attrs, ctrl, validation, value) {
			/*1.获取validator
			2判断是都含有id_
			3 含有放入validationArr,validation = validationArr*/
			
			if(element.attr("validator").indexOf("id_") != -1){
				var validationArr =[];
				validationArr.push(element.attr("validator").split("_")[1]);
				validation = validationArr;
            }
            var validators = validation.slice(0),
			validatorExpr = validators[0].trim(),
			paramIndex = validatorExpr.indexOf('='),
			validator = paramIndex === -1 ? validatorExpr: validatorExpr.substr(0, paramIndex),
			validatorParam = paramIndex === -1 ? null: validatorExpr.substr(paramIndex + 1),
			leftValidation = validators.slice(1),
			successMessage = validator + 'SuccessMessage',
			errorMessage = validator + 'ErrorMessage',
			expression = $validationProvider.getExpression(validator),
			valid = {
				success: function() {
					validFunc(element, attrs[successMessage], validator, scope, ctrl);
					if (leftValidation.length) {
						return checkValidation(scope, element, attrs, ctrl, leftValidation, value)
					} else {
						return true
					}
				},
				error: function() {
					return invalidFunc(element, attrs[errorMessage], validator, scope, ctrl)
				}
			};
			
			if(validation == "" || validation == null ||validation == undefined){
				return valid.success();
            }
            validatorParam = validatorParam || attrs[validator];
			if (expression === undefined) {
				console.error('You are using undefined validator "%s"', validator);
				if (leftValidation.length) {
					return checkValidation(scope, element, attrs, ctrl, leftValidation, value)
				} else {
					return
				}
			}
			if (expression.constructor === Function) {
				return $q.all([$validationProvider.getExpression(validator)(value, scope, element, attrs, validatorParam, $injector)]).then(function(data) {
					if (data && data.length > 0 && data[0]) {
						return valid.success()
					} else {
						return valid.error()
					}
				},
				function() {
					return valid.error()
				})
			} else if (expression.constructor === RegExp) {
				if (value !== undefined && value !== null) return $validationProvider.getExpression(validator).test(value) ? valid.success() : valid.error();
				else return valid.error()
			} else {
				return valid.error()
			}
		};
		var s4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		};
		var guid = function() {
			return (s4() + s4() + s4() + s4())
		};
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				model: '=ngModel',
				initialValidity: '=initialValidity',
				validCallback: '&',
				invalidCallback: '&',
				messageId: '@'
			},
			link: function(scope, element, attrs, ctrl) {
				var watch = function() {};
				var validation = attrs.validator.split(',');
				var uid = ctrl.validationId = guid();
				var initialValidity;
				if (typeof scope.initialValidity === 'boolean') {
					initialValidity = scope.initialValidity
				} else if (initialValidity === undefined) {
					initialValidity = true
				}
				if (!scope.messageId) {
					//单选框或复选框不重复加必填提示信息的div
					if(attrs.type=="radio"||attrs.type=="checkbox"){ 
						element.parent().find(".walltip_content").remove();
					}
					element.after(angular.element('<div class="walltip_content">'))
				}
				ctrl.$setValidity(ctrl.$name, initialValidity);
				scope.$on(ctrl.$name + 'reset-' + uid,
				function() {
					watch();
					$timeout(function() {
						ctrl.$setViewValue('');
						ctrl.$setPristine();
						ctrl.$setValidity(ctrl.$name, undefined);
						ctrl.$render();
						if (scope.messageId) angular.element(document.querySelector('#' + scope.messageId)).html('');
						else element.siblings().last().html('')
					})
				}); (function() {
					scope.$on(ctrl.$name + 'submit-' + uid,
					function(event, index) {
						var value = ctrl.$viewValue;
						if (value === undefined || value === null||value === "undefined") {
							value = ''
						}
						isValid = false;
						isValid = checkValidation(scope, element, attrs, ctrl, validation, value);
						if (attrs.validMethod === 'submit') {
							watch();
							watch = scope.$watch('model',
							function(value, oldValue) {
								if (value === oldValue) {
									return
								}
								if (value === undefined || value === null) {
									value = ''
								}
								isValid = checkValidation(scope, element, attrs, ctrl, validation, value)
							})
						}
						var setFocus = function(isValid) {
							if (isValid) {
								delete focusElements[index]
							} else {
								focusElements[index] = element[0];
								$timeout(function() {
									//去掉光标自动定位到必填项里
									//focusElements[Math.min.apply(null, Object.keys(focusElements))].focus()
								},
								0)
							}
						};
						if (isValid.constructor === Object){
							isValid.then(setFocus);
						}
						else{
							setFocus(isValid)
						}
					});
					if (attrs.validMethod === 'blur') {
						element.bind('blur',
						function() {
							var value = ctrl.$viewValue;
							scope.$apply(function() {
								checkValidation(scope, element, attrs, ctrl, validation, value)
							})
						});
						return
					}
					if (attrs.validMethod === 'submit' || attrs.validMethod === 'submit-only') {
						return
					}
					scope.$watch('model',
					function(value) {
						if (ctrl.$pristine && ctrl.$viewValue) {
							ctrl.$setViewValue(ctrl.$viewValue)
						} else if (ctrl.$pristine) {
							if (scope.messageId) angular.element(document.querySelector('#' + scope.messageId)).html('');
							else element.siblings().last().html('');
							return
						}
						checkValidation(scope, element, attrs, ctrl, validation, value)
					})
				})();
				$timeout(function() {
					attrs.$observe('noValidationMessage',
					function(value) {
						var el;
						if (scope.messageId) el = angular.element(document.querySelector('#' + scope.messageId));
						else el = element.siblings().last();
						if (value == 'true' || value === true) {
							el.css('display', 'none')
						} else if (value == 'false' || value === false) {
							el.css('display', 'block')
						} else {}
					})
				})
			}
		}
	}]).directive('validationSubmit', ['$injector',
	function($injector) {
		var lang = window.localStorage['lang'];
		var $validationProvider = $injector.get('$validation'),
		$timeout = $injector.get('$timeout'),
		$parse = $injector.get('$parse');
		return {
			priority: 1,
			require: '?ngClick',
			link: function postLink(scope, element, attrs) {
				var formArr = attrs.validationSubmit.split(",");
				var forms = [];
				angular.forEach(formArr,
				function(_f, index) {
					forms[index] = $parse(_f)(scope)
				});
				$timeout(function() {
					element.off('click');
					element.on('click',
					function(e) {
						e.preventDefault();
						$validationProvider.validate(forms).success(function() {
							$parse(attrs.jfClick || attrs.ngClick)(scope)
						})
					})
				})
			}
		}
	}]).directive('validationReset', ['$injector',
	function($injector) {
		var lang = window.localStorage['lang'];
		var $validationProvider = $injector.get('$validation'),
		$timeout = $injector.get('$timeout'),
		$parse = $injector.get('$parse');
		return {
			link: function postLink(scope, element, attrs) {
				var form = $parse(attrs.validationReset)(scope);
				$timeout(function() {
					element.on('click',
					function(e) {
						e.preventDefault();
						$validationProvider.reset(form)
					})
				})
			}
		}
	}])
}).call(this);