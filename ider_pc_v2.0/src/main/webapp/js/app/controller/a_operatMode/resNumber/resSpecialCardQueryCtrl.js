'use strict';
define(function(require) {
	var webApp = require('app');
	//预留特殊卡号查询
	webApp.controller('resSpecialCardQuery', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.menuNo = lodinDataService.getObject("menuNo");
		$scope.eventList = "";
		$scope.upBtnFlag = false;
		$scope.selBtnFlag = false;
		//根据菜单和当前登录者查询有权限的事件编号
		$scope.menuNoSel = $scope.menuNo;
		$scope.paramsNo = {
			menuNo: $scope.menuNoSel
		};
		jfRest.request('accessManage', 'selEvent', $scope.paramsNo).then(function(data) {
			if (data.returnData != null || data.returnData != "") {
				for (var i = 0; i < data.returnData.length; i++) {
					$scope.eventList += data.returnData[i].eventNo + ",";
				}
				if ($scope.eventList.search('COS.IQ.02.0057') != -1) { //查询
					$scope.selBtnFlag = true;
				} else {
					$scope.selBtnFlag = false;
				}
				if ($scope.eventList.search('COS.UP.02.0085') != -1) { //修改
					$scope.upBtnFlag = true;
				} else {
					$scope.upBtnFlag = false;
				}
			}
		});
		/*预留卡号状态
		 * N-可用卡号
		Y-已使用
		M-人工保留
		O-待使用/申请在途
		P-无效*/
		$scope.cardStatusArr = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_reservedCardNoStatus",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
			}
		};
		$scope.userName = sessionStorage.getItem("userName"); //获取登陆人员
		$scope.userInfo = lodinDataService.getObject("userInfo"); //获取登录人员信息
		$scope.adminFlag = $scope.userInfo.adminFlag; //判断是否是管理员
		$scope.organization = $scope.userInfo.organization; //获取组织机构
		$scope.queryParam = {
			organNo: $scope.organization
		};
		jfRest.request('operationOrgan', 'query', $scope.queryParam).then(function(data) {
			$scope.corporationEntityNo = data.returnData.rows[0].corporationEntityNo;
			if ($scope.adminFlag != "1" && $scope.adminFlag != "2") {
				$scope.resSpecialCardTable.params.corporationEntityNo = $scope.corporationEntityNo;
				$scope.resSpecialCardTable.search();
				$("#corporationEntityNoId").attr("readonly", true);
			}
		});
		//卡bin
		$scope.cardBinArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "binNo", //下拉框显示内容，根据需要修改字段名称 
			value: "binNo", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "productLine.queryBin", //数据源调用的action 
			callback: function(data) {}
		};
		//根据选择卡BIN的条件筛选特殊号码段
		var form = layui.form;
		form.on('select(getCardBin)', function(data) {
			//特殊号码段下拉
			$scope.detailedListArr = {
				type: "dynamic",
				param: {
					cardBin: data.value
				}, //默认查询条件 
				text: "segmentNumber", //下拉框显示内容，根据需要修改字段名称 
				value: "segmentNumber", //下拉框对应文本的值，根据需要修改字段名称 
				resource: "resSpecialNoRule.query", //数据源调用的action 
				callback: function(data) {}
			};
		});
		$scope.detailedListArr = {}; //选择卡bin后请求接口传参对象初始化，否则报错
		$scope.resSpecialCardTable = {
			autoQuery: false,
			params: {
				"corporationEntityNo": $scope.corporationEntityNo,
				"pageSize": 10,
				"indexNo": 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'resSpecialCard.query', // 列表的资源
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_reservedCardNoStatus'],//查找数据字典所需参数
			transDict : ['cardStatus_cardStatusDesc'],//翻译前后key
			callback: function(data) { // 表格查询后的回调函数
			}
		};
		$scope.resetChose = function() {
			$scope.resSpecialCardTable.params.cardBin = "";
			$scope.resSpecialCardTable.params.segmentNumber = "";
			$scope.resSpecialCardTable.params.cardNumber = "";
		};
		//修改
		$scope.checkResSpecialCard = function(item) {
			// 页面弹出框事件(弹出页面)
			$scope.resUpdateInf = {};
			$scope.resUpdateInf = $.parseJSON(JSON.stringify(item));
			 if ($scope.resUpdateInf.cardStatus == 'Y' || $scope.resUpdateInf.cardStatus == 'O') {
				jfLayer.fail(T.T("YYJ5300015"));
				return;
             }
            if ($scope.resUpdateInf.cardStatus == 'N') {
				$scope.modal('/a_operatMode/resNumber/checkResSpecialCardN.html', $scope.resUpdateInf, {
					title: T.T('PZJ1000007'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1000px', '380px'],
					callbacks: [$scope.sureUpdateRes]
				});
			} else if ($scope.resUpdateInf.cardStatus == 'M' || $scope.resUpdateInf.cardStatus == 'P' ) {
				$scope.modal('/a_operatMode/resNumber/checkResSpecialCard.html', $scope.resUpdateInf, {
					title: T.T('PZJ1000007'),
					buttons: [T.T('F00107'), T.T('F00012')],
					size: ['1000px', '380px'],
					callbacks: [$scope.sureUpdateRes]
				});
			}
		};
		//确定修改事件
		$scope.sureUpdateRes = function(result) {
			$scope.resNumUpdate = {};
			$scope.resNumUpdate = $.parseJSON(JSON.stringify(result.scope.resUpdateInf));
			$scope.resNumUpdate.cardStatus = result.scope.updatecardStatus;
			if ($scope.resNumUpdate.cardStatus != '') {
				jfRest.request('resSpecialCard', 'update', $scope.resNumUpdate).then(function(data) {
					if (data.returnMsg == 'OK') {
						jfLayer.success(T.T('F00058'));
						$scope.resNumUpdate = {};
						$scope.safeApply();
						result.cancel();
						$scope.resSpecialCardTable.search();
					} 
				});
			}
		};
	});
	//预留特殊卡号查询
	webApp.controller('checkResSpecialCardCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		/*预留卡号状态
		 * N-可用卡号
		Y-已使用
		M-人工保留
		O-待使用/申请在途
		P-无效*/
		/* $scope.cardStatusArrM = [{
			id: 'N',
			name: T.T('YYJ5300016')
		}, {
			id: 'M',
			name: T.T('YYJ5300018')
		}, {
			id: 'P',
			name: T.T('YYJ5300020')
		}]; */
		$scope.cardStatusArrM = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_reservedCardNoStatus",
				queryFlag: "children"
			}, //默认查询条件 
			rmData: ['O','Y'],//需要移除的数据
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updatecardStatus = $scope.resUpdateInf.cardStatus;
			}
		}; 
	});
	//预留特殊卡号查询
	webApp.controller('checkResSpecialCardNCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, $translatePartialLoader, T) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/a_operatMode/resNumber/i18n_resNumber');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translate.refresh();
		/*预留卡号状态
		 * N-可用卡号
		Y-已使用
		M-人工保留
		O-待使用/申请在途
		P-无效*/
		$scope.cardStatusArrN = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_reservedCardNoStatus",
				queryFlag: "children"
			}, //默认查询条件 
			rmData: 'Y',//需要移除的数据
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				$scope.updatecardStatus = $scope.resUpdateInf.cardStatus;
			}
		}; 
	});
});
