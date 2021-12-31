'use strict';
define(function(require) {
	var webApp = require('app');
	// 封锁码管理
	webApp.controller('blockCodeMagCtrl', function($scope, $stateParams,
		jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader
	) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
		$translate.refresh();
		$scope.userName = lodinDataService.getObject("menuName"); //菜单名
		$scope.menuName = lodinDataService.getObject("menuName");
		$scope.operationMode = lodinDataService.getObject("operationMode"); //环境标示
		$scope.custInf = {};
		//动态请求下拉框 证件类型
		$scope.certificateTypeArray = {
			type: "dictData",
			param: {
				"type": "DROPDOWNBOX",
				groupsCode: "dic_certificateType",
				queryFlag: "children"
			}, //默认查询条件 
			text: "detailDesc", //下拉框显示内容，根据需要修改字段名称 
			value: "codes", //下拉框对应文本的值，根据需要修改字段名称
			resource: "paramsManage.query", //数据源调用的action 
			callback: function(data) {
				//			        	console.log(data)
			}
		};
		//联动验证
		var form = layui.form;
		form.on('select(getIdType)', function(data) {
			$scope.custInf.idNumber = '';
			if (data.value == "1") { //身份证
				$("#blockCodeMag_idNumber").attr("validator", "id_idcard");
			} else if (data.value == "2") { //港澳居民来往内地通行证
				$("#blockCodeMag_idNumber").attr("validator", "id_isHKCard");
			} else if (data.value == "3") { //台湾居民来往内地通行证
				$("#blockCodeMag_idNumber").attr("validator", "id_isTWCard");
			} else if (data.value == "4") { //中国护照
				$("#blockCodeMag_idNumber").attr("validator", "id_passport");
			} else if (data.value == "5") { //外国护照passport
				$("#blockCodeMag_idNumber").attr("validator", "id_passport");
			} else if (data.value == "6") { //外国人永久居留证
				$("#blockCodeMag_idNumber").attr("validator", "id_isPermanentReside")
            }
        });
		//封封锁范围'C-客户级'
		/*'A-业务类型级'
		'P-产品级'
		'M-媒介级'*/
		$scope.demoArray2 = [{
			name: T.T('KHH500009'),
			id: 'C'
		}, {
			name: T.T('KHH500010'),
			id: 'A'
		}, {
			name: T.T('KHH500011'),
			id: 'P'
		}, {
			name: T.T('KHH500012'),
			id: 'M'
		}];
		//封锁码类别
		$scope.demoArray = [{
				name: 'A',
				id: 'A'
			}, {
				name: 'B',
				id: 'B'
			}, {
				name: 'C',
				id: 'C'
			}, {
				name: 'D',
				id: 'D'
			},
			{
				name: 'E',
				id: 'E'
			}, {
				name: 'F',
				id: 'F'
			}, {
				name: 'G',
				id: 'G'
			}, {
				name: 'H',
				id: 'H'
			},
			{
				name: 'I',
				id: 'I'
			}, {
				name: 'J',
				id: 'J'
			}, {
				name: 'K',
				id: 'K'
			}, {
				name: 'L',
				id: 'L'
			},
			{
				name: 'M',
				id: 'M'
			}, {
				name: 'N',
				id: 'N'
			}, {
				name: 'O',
				id: 'O'
			}, {
				name: 'P',
				id: 'P'
			},
			{
				name: 'Q',
				id: 'Q'
			}, {
				name: 'R',
				id: 'R'
			}, {
				name: 'S',
				id: 'S'
			}, {
				name: 'T',
				id: 'T'
			},
			{
				name: 'U',
				id: 'U'
			}, {
				name: 'V',
				id: 'V'
			}, {
				name: 'W',
				id: 'W'
			}, {
				name: 'X',
				id: 'X'
			},
			{
				name: 'Y',
				id: 'Y'
			}, {
				name: 'Z',
				id: 'Z'
			}
		];
		$scope.showAcctDiv = false; //业务类型
		$scope.showMediaDiv = false; //媒介
		$scope.showProDiv = false; //产品
		$scope.showCstDiv = false; //客户
		$scope.showGDiv = false; //业务项目
		//$scope.showBlockDiv = false;
		$scope.blockList = {};
		$scope.cstInfoList = {};
		// 事件清单列表
		$scope.itemEventList = {
			checkType: 'radio',
			params: $scope.queryParam = {
				operationMode: $scope.operationMode,
				queryType: "E"
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			//resource : 'evLstList.queryFiniTrans',// 列表的资源
			autoQuery: false,
			resource: 'blockCodeMag.eventNoQuery', // 列表的资源
			isTrans: true, //是否需要翻译数据字典
			transParams: ['dic_scenarioTriggerType'], //查找数据字典所需参数
			transDict: ['sceneTriggerObject_sceneTriggerObjectDesc'], //翻译前后key
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {}
			},
			checkBack: function(row) { // 选中后的回调函数
				if ((row.effectivenessCodeType == null || row.effectivenessCodeType == "" || row.effectivenessCodeType ==
						undefined) &&
					(row.effectivenessCodeScene == null || row.effectivenessCodeScene == "" || row.effectivenessCodeScene ==
						undefined) &&
					(row.sceneTriggerObject == null || row.sceneTriggerObject == "" || row.sceneTriggerObject == undefined)) {
					jfLayer.fail(T.T('KHJ500009'));

				} else {
					$scope.searchHandle(row);
				}
			}
		};
		//事件清单后的查询按钮事件
		$scope.selectCode = function(item, $event) {
			if ($event.target.nodeName.toLowerCase() == 'button' || $event.target.nodeName.toLowerCase() == 'i') {
				$event.stopPropagation();
			}
			$scope.codeItem = {};
			$scope.codeItem = $.parseJSON(JSON.stringify(item));
			if (($scope.codeItem.effectivenessCodeType == null || $scope.codeItem.effectivenessCodeType == "" || $scope.codeItem
					.effectivenessCodeType == undefined) &&
				($scope.codeItem.effectivenessCodeScene == null || $scope.codeItem.effectivenessCodeScene == "" || $scope.codeItem
					.effectivenessCodeScene == undefined) &&
				($scope.codeItem.sceneTriggerObject == null || $scope.codeItem.sceneTriggerObject == "" || $scope.codeItem.sceneTriggerObject ==
					undefined)) {
				jfLayer.fail(T.T('KHJ500009'));

			} else {
				// 页面弹出框事件(弹出页面)
				$scope.modal('/cstSvc/baseBsnPcsg/blockCodeInfo.html', $scope.codeItem, {
					title: T.T('KHJ500010'), //'封锁码码信息',
					buttons: [T.T('F00012')], //'关闭' 
					size: ['1050px', '500px'],
					callbacks: []
				});
			}
		};
		//重置	
		$scope.reset = function() {
			$scope.custInf.idNumber = '';
			$scope.custInf.externalIdentificationNo = '';
			$scope.custInf.idType = '';
			$('#blockCodeMag_idNumber').attr('validator', 'noValidator');
			$('#blockCodeMag_idNumber').removeClass('waringform');
			$scope.showCstDiv = false;
			$scope.showMediaDiv = false;
			$scope.showAcctDiv = false;
			$scope.showProDiv = false;
			$scope.showGDiv = false; //业务项目
			$scope.isNext = false;
		};
		//产品
		$scope.productList = {
			checkType: 'radio',
			autoQuery: false,
			params: $scope.queryParam = {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCodeMag.searchPro', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					angular.forEach(data.returnData.listX5120VOs, function(item, index) {
						item.customerNo = data.returnData.customerNo;
					});
					$scope.showProDiv = true;
					$scope.showMediaDiv = false;
					$scope.showCstDiv = false;
					$scope.showAcctDiv = false;
					$scope.showGDiv = false; //业务项目
				} else {
					$scope.showProDiv = false;
					$scope.showMediaDiv = false;
					$scope.showCstDiv = false;
					$scope.showAcctDiv = false;
					$scope.showGDiv = false; //业务项目
				}
			}
		};
		//媒介
		$scope.mediaList = {
			checkType: 'radio',
			params: {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			autoQuery: false,
			resource: 'blockCodeMag.searchMedia', // 列表的资源
			isTrans: true, //是否需要翻译数据字典
			transParams: ['dic_mainAttachedFlag'], //查找数据字典所需参数
			transDict: ['mainSupplyIndicator_mainSupplyIndicatorDesc'], //翻译前后key
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					$scope.showMediaDiv = true;
					$scope.showProDiv = false;
					$scope.showCstDiv = false;
					$scope.showAcctDiv = false;
					$scope.showGDiv = false; //业务项目
				} else {
					$scope.showMediaDiv = false;
					$scope.showProDiv = false;
					$scope.showCstDiv = false;
					$scope.showAcctDiv = false;
					$scope.showGDiv = false; //业务项目
				}
			}
		};
		//账户   A-业务类型
		$scope.accountTable = {
			checkType: 'radio',
			autoQuery: false,
			params: $scope.queryParam = {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCodeMag.searchAct', // 列表的资源
			isTrans: true, //是否需要翻译数据字典
			transParams: ['dic_accStatusCode', ], //查找数据字典所需参数
			transDict: ['statusCode_statusCodeDesc', ], //翻译前后key
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					//加客户号
					angular.forEach(data.returnData.listCoreAccount, function(item, index) {
						item.customerNo = data.returnData.customerNo;
					});
					$scope.showAcctDiv = true;
					$scope.showProDiv = false;
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showGDiv = false; //业务项目
				} else {
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showGDiv = false; //业务项目
				}
			}
		};
		//G-业务项目
		$scope.businessProgramTable = {
			checkType: 'radio',
			autoQuery: false,
			params: $scope.queryParam = {
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'cstBsnisItem.query', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				if (data.returnCode == '000000') {
					//加客户号
					angular.forEach(data.returnData.listCoreAccount, function(item, index) {
						item.customerNo = data.returnData.customerNo;
					});
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showGDiv = true; //业务项目
				} else {
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showGDiv = false; //业务项目
				}
			}
		};
		//查询
		$scope.searchHandle = function(params) {
			if (($scope.custInf.idType == '' || $scope.custInf.idType == null || $scope.custInf.idType == undefined) &&
				($scope.custInf.idNumber == '' || $scope.custInf.idNumber == null || $scope.custInf.idNumber == undefined) &&
				($scope.custInf.externalIdentificationNo == '' || $scope.custInf.externalIdentificationNo == null || $scope.custInf
					.externalIdentificationNo == undefined)
			) {
				jfLayer.alert(T.T('KHJ500011'));

			} else {
				if ($scope.custInf.idType) {
					if ($scope.custInf.idNumber == null || $scope.custInf.idNumber == undefined || $scope.custInf.idNumber == '') {
						jfLayer.alert(T.T('F00110')); //'请核对证件号码'
						$scope.showCstDiv = false;
						$scope.showMediaDiv = false;
						$scope.showAcctDiv = false;
						$scope.showProDiv = false;
						$scope.showGDiv = false; //业务项目

					} else {
						$scope.queryFun(params);
					}
				} else if ($scope.custInf.idNumber) {
					if ($scope.custInf.idType == null || $scope.custInf.idType == undefined || $scope.custInf.idType == '') {
						jfLayer.alert(T.T('F00109')); //"请核对证件类型！"
						$scope.showCstDiv = false;
						$scope.showMediaDiv = false;
						$scope.showAcctDiv = false;
						$scope.showProDiv = false;
						$scope.showGDiv = false; //业务项目

					} else {
						$scope.queryFun(params);
					}
				} else if ($scope.custInf.externalIdentificationNo) {
					$scope.queryFun(params);
				} else {
					jfLayer.alert(T.T('KHJ500011')); //"请核对证件类型！"
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showGDiv = false; //业务项目
				}
			}
		};
		$scope.isNext = false;
		//下一步
		$scope.nextBtn = function() {
			if (($scope.custInf.idType == '' || $scope.custInf.idType == null || $scope.custInf.idType == undefined) &&
				($scope.custInf.idNumber == '' || $scope.custInf.idNumber == null || $scope.custInf.idNumber == undefined) &&
				($scope.custInf.externalIdentificationNo == '' || $scope.custInf.externalIdentificationNo == null || $scope.custInf
					.externalIdentificationNo == undefined)
			) {
				$scope.isNext = false;
				jfLayer.alert(T.T('KHJ500011'));

			} else {
				if ($scope.custInf.idType) {
					if ($scope.custInf.idNumber == null || $scope.custInf.idNumber == undefined || $scope.custInf.idNumber == '') {
						jfLayer.alert(T.T('F00110')); //'请核对证件号码'
						$scope.showCstDiv = false;
						$scope.showMediaDiv = false;
						$scope.showAcctDiv = false;
						$scope.showProDiv = false;
						$scope.showGDiv = false; //业务项目
						$scope.isNext = false;

					} else {
						$scope.isExitFun();
					}
				} else if ($scope.custInf.idNumber) {
					if ($scope.custInf.idType == null || $scope.custInf.idType == undefined || $scope.custInf.idType == '') {
						jfLayer.alert(T.T('F00109')); //"请核对证件类型！"
						$scope.showCstDiv = false;
						$scope.showMediaDiv = false;
						$scope.showAcctDiv = false;
						$scope.showProDiv = false;
						$scope.showGDiv = false; //业务项目
						$scope.isNext = false;

					} else {
						$scope.isExitFun();
					}
				} else if ($scope.custInf.externalIdentificationNo) {
					$scope.isExitFun();
				} else {
					jfLayer.alert(T.T('KHJ500011')); //"请核对证件类型！"
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showGDiv = false; //业务项目
					$scope.isNext = false;
				}
			}
		};
		//判断客户是否存在，点击下一步，展示 可选特别状况列表
		$scope.isExitFun = function() {
			$scope.params = {
				idType: $scope.custInf.idType,
				idNumber: $scope.custInf.idNumber,
				externalIdentificationNo: $scope.custInf.externalIdentificationNo,
			};
			jfRest.request('cstInfQuery', 'queryInf', $scope.params).then(function(data) {
				if (data.returnMsg == 'OK') {
					$scope.isNext = true;
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showGDiv = false; //业务项目
					$scope.itemEventList.search();
				} else {
					$scope.isNext = false;
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showGDiv = false; //业务项目
				}
			});
		};
		$scope.queryFun = function(event) {
			if (event.sceneTriggerObject == "C") { //客户级showCstDiv
				$scope.paramsC = {
					externalIdentificationNo: $scope.custInf.externalIdentificationNo,
					idType: $scope.custInf.idType,
					idNumber: $scope.custInf.idNumber
				};
				jfRest.request('cstInfQuery', 'queryInf', $scope.paramsC).then(function(data) {
					if (data.returnMsg == 'OK') {
						$scope.cstInfoList.customerNo = data.returnData.rows[0].customerNo;
						$scope.cstInfoList.institutionId = data.returnData.rows[0].institutionId;
						$scope.cstInfoList.operationMode = data.returnData.rows[0].operationMode;
						$scope.cstInfoList.customerName = data.returnData.rows[0].customerName;
						if (data.returnData.idType == '1') {
							$scope.cstInfoList.idTypeTrans = T.T('F00113'); //'身份证';
						}
						$scope.cstInfoList.idNumber = data.returnData.rows[0].idNumber;
						$scope.showCstDiv = true;
						$scope.showMediaDiv = false;
						$scope.showAcctDiv = false;
						$scope.showProDiv = false;
						$scope.showGDiv = false; //业务项目
					}
				});
			} else if (event.sceneTriggerObject == "A") { //A-业务类型showAcctDiv
				$scope.accountTable.params.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
				$scope.accountTable.params.idType = $scope.custInf.idType;
				$scope.accountTable.params.idNumber = $scope.custInf.idNumber;
				$scope.accountTable.search();
			} else if (event.sceneTriggerObject == "P") { //P-产品showProDiv  
				$scope.productList.params.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
				$scope.productList.params.idType = $scope.custInf.idType;
				$scope.productList.params.idNumber = $scope.custInf.idNumber;
				$scope.productList.params.sceneTriggerObject = event.sceneTriggerObject;
				$scope.productList.search();
			} else if (event.sceneTriggerObject == "M") { //M-媒介showMediaDiv
				$scope.mediaList.params.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
				$scope.mediaList.params.idType = $scope.custInf.idType;
				$scope.mediaList.params.idNumber = $scope.custInf.idNumber;
				$scope.mediaList.params.sceneTriggerObject = event.sceneTriggerObject;
				$scope.mediaList.search();
			} else if (event.sceneTriggerObject == "G") { //G-业务项目
				$scope.businessProgramTable.params.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
				$scope.businessProgramTable.params.idType = $scope.custInf.idType;
				$scope.businessProgramTable.params.idNumber = $scope.custInf.idNumber;
				$scope.businessProgramTable.search();
			}
		};
		//确定
		$scope.sureParams = {};
		$scope.sure = function() {
			$scope.sureParams.operatorId = sessionStorage.getItem("userName"); //用户名
			if (!$scope.itemEventList.validCheck()) { //选择事件
				jfLayer.fail(T.T('KHJ500012'));
				return;
            }
            $scope.sureParams.externalIdentificationNo = $scope.custInf.externalIdentificationNo;
			$scope.sureParams.idType = $scope.custInf.idType;
			$scope.sureParams.idNumber = $scope.custInf.idNumber;
			$scope.sureParams.spEventNo = $scope.itemEventList.checkedList().eventNo;
			if ($scope.itemEventList.checkedList().sceneTriggerObject == 'C') { //客户
				$scope.sureParams.levelCode = $scope.cstInfoList.customerNo;
				$scope.sureParams.customerNo = $scope.cstInfoList.customerNo;
				$scope.sureParams.operationMode = $scope.cstInfoList.operationMode;
				$scope.sureParams.sceneTriggerObject = $scope.itemEventList.checkedList().sceneTriggerObject;
				$scope.sureParams.currencyCode = "";
			}
			if ($scope.itemEventList.checkedList().sceneTriggerObject == 'A') { //账户
				if (!$scope.accountTable.validCheck()) {
					jfLayer.fail(T.T('KHJ500013'));
					return;
                }
                $scope.sureParams.levelCode = $scope.accountTable.checkedList().businessTypeCode;
				$scope.sureParams.currencyCode = $scope.accountTable.checkedList().currencyCode;
				$scope.sureParams.operationMode = $scope.accountTable.checkedList().operationMode;
				$scope.sureParams.customerNo = $scope.accountTable.checkedList().customerNo;
				$scope.sureParams.sceneTriggerObject = $scope.itemEventList.checkedList().sceneTriggerObject;
			}
			if ($scope.itemEventList.checkedList().sceneTriggerObject == 'G') { //G业务项目
				if (!$scope.businessProgramTable.validCheck()) {
					jfLayer.fail(T.T('KHJ500014'));
					return;
                }
                $scope.sureParams.levelCode = $scope.businessProgramTable.checkedList().businessProgramNo;
				$scope.sureParams.operationMode = $scope.businessProgramTable.checkedList().operationMode;
				$scope.sureParams.customerNo = $scope.businessProgramTable.checkedList().customerNo;
				$scope.sureParams.sceneTriggerObject = $scope.itemEventList.checkedList().sceneTriggerObject;
			}
			if ($scope.itemEventList.checkedList().sceneTriggerObject == 'M') { //媒介
				if (!$scope.mediaList.validCheck()) {
					jfLayer.fail(T.T('KHJ500015'));
					return;
                }
                $scope.sureParams.levelCode = $scope.mediaList.checkedList().mediaUnitCode;
				$scope.sureParams.operationMode = $scope.mediaList.checkedList().operationMode;
				$scope.sureParams.customerNo = $scope.mediaList.checkedList().mainCustomerNo;
				$scope.sureParams.sceneTriggerObject = $scope.itemEventList.checkedList().sceneTriggerObject;
				$scope.sureParams.currencyCode = "";
			}
			if ($scope.itemEventList.checkedList().sceneTriggerObject == 'P') { //产品
				if (!$scope.productList.validCheck()) {
					jfLayer.fail(T.T('KHJ500016'));
					return;
                }
                $scope.sureParams.levelCode = $scope.productList.checkedList().productObjectCode;
				$scope.sureParams.operationMode = $scope.productList.checkedList().operationMode;
				$scope.sureParams.customerNo = $scope.productList.checkedList().customerNo;
				$scope.sureParams.sceneTriggerObject = $scope.itemEventList.checkedList().sceneTriggerObject;
				$scope.sureParams.currencyCode = "";
            }
            $scope.eventNoTrends = "";
			$scope.eventNoTrends = "/nonfinanceService/" + $scope.itemEventList.checkedList().eventNo;
			jfRest.request('blockCodeMag', 'cusEffUp', $scope.sureParams).then(function(data) {
			// jfRest.request('fncTxnMgt', 'trends', $scope.sureParams, '', $scope.eventNoTrends).then(function(data) {
				if (data.returnCode == '000000') {
					jfLayer.success(T.T('KHJ500017')); //"操作成功！"
					$scope.showCstDiv = false;
					$scope.showMediaDiv = false;
					$scope.showAcctDiv = false;
					$scope.showProDiv = false;
					$scope.showGDiv = false; //业务项目
					$scope.itemEventList.search();
				}
			});
		};
		//查询媒介列表
		/*		$scope.queryMediaInf = function(){
					if(($scope.itemList.params.idNumber == "" || $scope.itemList.params.idNumber == undefined )
							&&( $scope.itemList.params.externalIdentificationNo == "" || $scope.itemList.params.externalIdentificationNo == undefined)
						){
						jfLayer.alert(T.T('F00076'));//"请输入任意条件进行查询"
					}else{
						$scope.itemList.search();
					}
				};*/
		//查询媒介详情
		$scope.checkMedia = function(event) {
			$scope.item = $.parseJSON(JSON.stringify(event));
			// 页面弹出框事件(弹出页面)
			//			$scope.item = event;
			$scope.modal('/cstSvc/baseBsnPcsg/mediaDetailLayer.html',
				$scope.item, {
					title: T.T('KHJ500007'), //'客户媒介详情',
					buttons: [T.T('F00012')], //'关闭'
					size: ['1050px', '500px'],
					callbacks: []
				});
		};
		//查询弹窗 
		$scope.queryBlockCodeMag = function(event) {
			$scope.blockCDScnMgtInfo = $.parseJSON(JSON.stringify(event));
			//$scope.blockCDScnMgtInfo = event;
			$scope.instanCode = $scope.blockCDScnMgtInfo.blockType + $scope.blockCDScnMgtInfo.sceneSerialNo;
			// 页面弹出框事件(弹出页面)
			$scope.modal('/cstSvc/baseBsnPcsg/blockCodeMagLayer.html', $scope.blockCDScnMgtInfo, {
				title: T.T('KHJ500008'), //'封锁码码信息',
				buttons: [T.T('F00012')], //'关闭' 
				size: ['1050px', '500px'],
				callbacks: []
			});
		};
	});
	//封锁码查询
	webApp.controller('blockCodeMagLayerCtrl', function($scope, $stateParams, jfRest,
		$http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader) {
		//***********************查询已关联非对象构件实例***********************
		/*	$scope.relationTable = {
				params : $scope.queryParam = {
						operationMode:$scope.blockCDScnMgtInfo.operationMode,
						instanCode:$scope.instanCode,
						instanDimen: "B",
						"pageSize" : 10,
						"indexNo" : 0	
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'blockCodeMag.queryElmList',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};*/
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
		$translate.refresh();
		//運營模式
		$scope.operationModeArr = {
			type: "dynamic",
			param: {}, //默认查询条件 
			text: "modeName", //下拉框显示内容，根据需要修改字段名称 
			value: "operationMode", //下拉框对应文本的值，根据需要修改字段名称 
			resource: "operationMode.query", //数据源调用的action 
			callback: function(data) {
				$scope.layerOperationMode = $scope.blockCDScnMgtInfo.operationMode;
			}
		};
	});
	//媒介查询
	webApp.controller('mediaDetailLayerCtrl', function($scope, $stateParams,
		jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader
	) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
		$translate.refresh();
		$scope.checkCstMediaInf = $scope.item;
	});
	//管控码关联的管控项目、定价标签
	webApp.controller('codeControlCtrl', function($scope, $stateParams,
		jfRest, $http, jfGlobal, $rootScope, jfLayer, $location, lodinDataService, $translate, T, $translatePartialLoader
	) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
		$translate.use($scope.lang);
		//$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockCodeMag');
		$translate.refresh();
		// 事件清单列表
		$scope.itemControlList = {
			params: $scope.queryParam = {
				effectivenessCodeType: $scope.codeItem.effectivenessCodeType,
				effectivenessCodeScene: $scope.codeItem.effectivenessCodeScene,
				projectType: '0'
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCodeMag.controlCode', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				//				console.log(data);
			},
		};
		//已关联的定价标签
		$scope.controlBlockList = {
			params: $scope.queryParam = {
				operationMode: $scope.codeItem.operationMode,
				effectivenessCodeType: $scope.codeItem.effectivenessCodeType,
				effectivenessCodeScene: $scope.codeItem.effectivenessCodeScene,
				projectType: 1,
				pageSize: 10,
				indexNo: 0
			}, // 表格查询时的参数信息
			paging: true, // 默认true,是否分页
			resource: 'blockCode.queryRelateControlItem', // 列表的资源
			callback: function(data) { // 表格查询后的回调函数
				//				console.log(data)
			}
		};
	});
});
