'use strict';
define(function (require){
	var webApp = require('app');

	//登录注册
    webApp.controller('loginResCtrl', function($scope, $stateParams, jfRest,lodinDataService,
            $http, jfGlobal, $rootScope, jfLayer, $location, $translate,T,$translatePartialLoader,$timeout,$interval) {
    	//$translate.use('cn');
        $scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName") + "_lang");
        if (!$scope.lang) {
            $scope.lang = 'cn'
        }
        $translate.use($scope.lang);
        $translatePartialLoader.addPart(ctx + '/pages/i18n/');
    	 $scope.loginInf ={};
        // 获取验证码
        $scope.timer = false;
        $scope.timeout = 60000;
        $scope.timerCount = 60;
        $scope.text = "获取验证码";
        $scope.getCode = function() {
            $scope.showTimer = true;
            $scope.timer = true;
            $scope.text = "秒后重新获取";
            var counter = $interval(function() {
                $scope.timerCount -- ;
            }, 1000);
            $timeout(function() {
                $scope.text = "重新获取验证码";
                $scope.timer = false;
                $interval.cancel(counter);
                $scope.showTimer = false;
                $scope.timerCount = 60;
            }, 60000);
            // 调获取验证码接口
            var date=new Date();
            //年
            var year=date.getFullYear();
            //月
            var month=date.getMonth()+1;
            var month1= month -3
            //日
            var day=date.getDate();
            var time = year+'-'+month1+'-'+day
            var shal_password = base64encode($scope.loginInf.password)
           // var shal_password2 = b64_sha1($scope.loginInf.password)
           //  console.log(shal_password1)
           //  console.log(shal_password2)shal_password2
           //  $scope.loginParams1 = {
           //      // 'password': $scope.loginInf.password,
           //      'password': shal_password,
           //      'loginName': $scope.loginInf.username
           //  };
           //  var req = {
           //      method: 'POST', //请求的方式
           //      url: '/ider/betaService/COS.CS.01.0018', //请求的地址
           //      headers: {
           //          'Content-Type': 'application/json',
           //          'Accept': '*/*'
           //      }, //请求的头，如果默认可以不写
           //      //       timeout:5000,//超时时间，还没有测试
           //      data: $scope.loginParams1 //message 必须是a=b&c=d的格式
           //  };
           //  $http(req).success(function(data, status, headers, config) {
           //      //成功后的数据处理
           //      if (data.returnCode == '000000') {
                    //缓存token
                //    sessionStorage.setItem("clientToken", data.returnData.clientToken);
                //     $scope.codeParams = {
                //         loginName: $scope.loginInf.username,
                //         clientToken: data.returnData.clientToken
                //     };
                    $scope.codeParams = {}
                    jfRest.request('userManage', 'getVerifyCode', $scope.codeParams).then(function(data1) {
                        if (data1.returnCode == '000000') {
                            console.log(data1)
                            layui.use('layer', function() { //独立版的layer无需执行这一句
                                var $ = layui.jquery,
                                    layer = layui.layer; //独立版的layer无需执行这一句
                                // var verifyCode = '1123456876';
                                $scope.loginInf.verificationCode = data1.returnData.verificationCode
                                layer.msg('验证码：' + data1.returnData.verificationCode, {
                                    time: 5000, //1500ms后自动关闭
                                });
                            })
                        }
                    })
            //     } else {
            //         var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00188');
            //         jfLayer.fail(returnMsg);
            //     }
            // }).error(function(data, status, headers, config) {
            //     var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00188');
            //     jfLayer.fail(returnMsg);
            // });
        };
        //去注册
        $("#goRegist").click(function(){
            $(".regist_container").show();
            $(".login_container").hide();
        });
        //去登录
        $("#goLogin").click(function(){
            $(".regist_container").hide();
            $(".login_container").show();
        });
        $scope.langArray = [{name : '简体中文' ,id : 'cn'},{name : '繁體中文' ,id : 'zh-tw'},{name : 'English' ,id : 'en'}];//证件类型
        /*    	//国际多语言
            	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
            	if(!$scope.lang){
            		$scope.cur_lang = 'cn';
            	}
            	else{
            		$scope.cur_lang = window.localStorage['lang'];
            	}*/
        /*    	var form = layui.form;
        		form.on('select(getLang)',function(lang){
        			console.log(lang.value);
        	        $translate.use(lang.value);
        	        window.localStorage.lang = lang.value;
        	        window.location.reload();
        	        $scope.cur_lang = lang.value;
        		});*/
                //Tansun.plugins.render($("#loginBtn"));
        //查询有权限菜单
        $scope.queryAuthMenu = function(loginParams){
        	//遮罩层
        	jfRest.request('menuLists','query',loginParams ).then(function(data) {
    			if (data.returnCode == '000000') {
    				console.log(data.returnData);
    				window.localStorage.lang = data.returnData.userLanguage;
    				/*sessionStorage.setItem("userName", $scope.loginInf.username );//用户名
    				sessionStorage.setItem("password", $scope.loginInf.password );//用户名
*/
    				lodinDataService.setObject("userInfo", data.returnData);//返回数据存储
    				lodinDataService.setObject("allList", data.returnData.menuList );//权限菜单
    				$scope.menuParams = {};
    				jfRest.request('newmenu','query',$scope.menuParams ).then(function(data) {
    	    			if (data.returnCode == '000000') {
    	    				if(data.returnData.menuList){
    	    					lodinDataService.setObject("menuAll", data.returnData.menuList );//所有菜单
    	        				location.href = ctx + "/pages/public.html";
    	    				}else{
    	    					jfLayer.fail(T.T('F00164') + data.returnMsg);
    	    				}
    	    			}
    	    		});
    			}
    		});
        };
        $scope.toLogin = function() {

            // var shal_password
            // Tansun.loadScript('shal', function(script) {
            //     shal_password = base64encode($scope.loginInf.password)
            // })
            var shal_password = base64encode($scope.loginInf.password); //加密密码
            console.log('shal:' + shal_password)
        	$scope.loginParams = {
        			'password': shal_password ,
                    'verificationCode':$scope.loginInf.verificationCode,
        			'loginName': $scope.loginInf.username
        	};
	        var req = {
	            method: 'POST',//请求的方式
	            url: '/ider/betaService/COS.CS.01.0018',//请求的地址
	            headers: {
	                'Content-Type': 'application/json',
	                'Accept': '*/*'
	            },//请求的头，如果默认可以不写
	     //       timeout:5000,//超时时间，还没有测试
	            data: $scope.loginParams //message 必须是a=b&c=d的格式
	        };
            $http(req).success(function (data, status, headers, config) {
                //成功后的数据处理
            	if (data.returnCode == '000000') {
            		//缓存token
            		sessionStorage.setItem("clientToken",data.returnData.clientToken);
            		sessionStorage.setItem("userName", $scope.loginInf.username );//用户名
    				sessionStorage.setItem("password", $scope.loginInf.password );//用户名
    				//sessionStorage.setItem("institutionId", data.returnData.organization );//机构
					sessionStorage.setItem("corporation", data.returnData.corporationEntityNo );//法人编号
					sessionStorage.setItem("systemUnitNo", data.returnData.systemUnitNo );//系统单元
					sessionStorage.setItem("adminFlag", data.returnData.adminFlag );//账号管理员标示
					lodinDataService.setObject("systemEnvironmentFlag",data.returnData.systemEnvironmentFlag);//环境标示
					lodinDataService.setObject("operationMode",data.returnData.operationMode);//运营模式
					sessionStorage.setItem($scope.loginInf.username+"_lang",data.returnData.userLanguage);//缓存 根据不同用户和语言
            		//查权限菜单
            		 $scope.queryAuthMenu($scope.loginParams);
            		 //这里不在调用查询全部菜单，在查询权限菜单方法中调用
            		// $scope.selMenuList();
            	}else {
            		  var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
          				jfLayer.fail(returnMsg);
            	}
            }).error(function (data, status, headers, config) {
                //失败后的提示
                console.log("error", data, status, headers, JSON.stringify(config));
            });
        };
        //查询所有菜单
        $scope.selMenuList = function() {
        	$scope.menuParams = {};
    		jfRest.request('newmenu','query',$scope.menuParams ).then(function(data) {
    			console.log(data);
    			if (data.returnCode == '000000') {
    				if(data.returnData.menuList){
    					lodinDataService.setObject("menuAll", data.returnData.menuList );//所有菜单
    				}else{
    					jfLayer.fail(T.T('F00164'));
    				}
    			}
    		});
        };
      //  $scope.selMenuList();
    });
    //头部信息
    webApp.controller('iderHeaderController', function($scope,$interval, $stateParams, jfRest,$timeout,
            $http, jfGlobal, $rootScope, jfLayer, $location,$translate,lodinDataService,$translatePartialLoader,T) {
    	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/i18n');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
		$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
		$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
		$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
		$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
		$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
		$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
		$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
		$translatePartialLoader.addPart('pages/beta/businessForm/i18n_businessForm');
		$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
		$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
		$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
		$translatePartialLoader.addPart('pages/beta/holiday/i18n_holiday');
		$translatePartialLoader.addPart('pages/beta/legalEntity/i18n_legalEntity');
		$translatePartialLoader.addPart('pages/beta/serialList/i18n_serialList');
		$translatePartialLoader.addPart('pages/a_operatMode/lifeCycleNode/i18n_lifeCycleNode');
		$translatePartialLoader.addPart('pages/beta/systemUnit/i18n_systemUnit');
		$translatePartialLoader.addPart('pages/beta/avyList/i18n_avyList');
		$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
		$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
		$translatePartialLoader.addPart('pages/authorization/scenario/i18n_scenario');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_cusInfo');
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_tradingNow');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_list');
		$translatePartialLoader.addPart('pages/authorization/network/i18n_network');
		$translatePartialLoader.addPart('pages/authorization/machineManage/i18n_encryption');
		$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
		$translatePartialLoader.addPart('pages/authorization/marketing/i18n_marketing');
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotatree');
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_linesProduct');
		$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotaNode');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_customerAdjust');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaQuery');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_adjustHistory');
		$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEnqrAndMnt');
		$translatePartialLoader.addPart('pages/cstSvc/cstBsnisItemQuery/i18n_cstBsnisItemQuery');
		$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfBind');
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rvlDbtTxnSplmt');
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
		$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
		$translatePartialLoader.addPart('pages/cstSvc/cstFeeWaiveList/i18n_cstFeeWaiveList');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockHistory');
		$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
		$translatePartialLoader.addPart('pages/cstSvc/cashStage/i18n_cashStage');
		$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
		$translatePartialLoader.addPart('pages/cstSvc/loanTrial/i18n_loanTrial');
		$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
		$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
		$translatePartialLoader.addPart('pages/clearACC/clearResult/i18n_clearResult');
		$translatePartialLoader.addPart('pages/cstSvc/applicationFormMC/i18n_applicationFormMC');
		$translatePartialLoader.addPart('pages/system/i18n_userManage');
		$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mdmActvt');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessActivated');
		$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
		$translatePartialLoader.addPart('pages/businessCard/quotaManage/i18n_unitQuotaQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
		$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busNoOutBillQuery');
		$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_budOutQuery');
		$translatePartialLoader.addPart('pages/businessCard/businessOverpayment/i18n_businessOverpayment');
		$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaLoss');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_cstControlView');
		$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
		$translatePartialLoader.addPart('pages/beta/actConfig/i18n_actConfig');
		$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
		$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
		$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_rate');
		$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
		$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optOrgan');
		$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEstb');
		$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu');
		$translatePartialLoader.addPart('pages/cstSvc/abnormalTradManage/i18n_abnormalTradManage');
		$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rpyTxnSplmt');
		$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rvlCrTxnSplmt');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_updatePass');
		$translatePartialLoader.addPart('pages/cstSvc/balnStage/i18n_balnStage');
		$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
		$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_accBscInf');
		$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
		$translatePartialLoader.addPart('pages/a_operatMode/prefabCard/i18n_prefabCard');
		$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_rltmBal');
		$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_entryAdd');
		$translatePartialLoader.addPart('pages/authorization/scenario/i18n_tradModel');
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEstb');
		$translatePartialLoader.addPart('pages/a_operatMode/stageTypePara/stagTypePara');
		$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_partnerInformation');
        $translatePartialLoader.addPart('pages/cstSvc/cstVehicleEstb/i18n_cstVehicleEstb');
        $translatePartialLoader.addPart('pages/cstSvc/cstContactInfEstb/i18n_cstContactQuery');
        $translatePartialLoader.addPart('pages/cstSvc/cstHouseInfEstb/i18n_cstHouseQuery');
        $translatePartialLoader.addPart('pages/a_operatMode/history/i18n_history');
		$translate.refresh();
    	$scope.userName = sessionStorage.getItem("userName");//用户名
    	$scope.systemEnvironmentFlag = lodinDataService.getObject("systemEnvironmentFlag");//环境标示
    	//国际多语言
//    	$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
//    	if($scope.lang == undefined || $scope.lang == null || $scope.lang == "" || $scope.lang == "null"){
//    		$scope.cur_lang = 'cn';
//    	}
//    	else{
//    		$scope.cur_lang = window.localStorage['lang'];
//    	}
    	//window.location.reload();
/*		 $scope.switchLanguage = function(lang){
	        $translate.use(lang);
	        window.localStorage.lang = lang;
	        window.location.reload();
	        $scope.cur_lang = lang;
	    };*/
    	//当前环境
    	$scope.showCurHuanjing = true;
		var url = window.location.hostname;
		if(url=='10.6.90.182'){
			$scope.curHuanjing ="开发环境";
		}
		else if(url=='10.6.70.168'){
			$scope.curHuanjing ="sit环境";
		}else if(url=='10.6.70.117'){
			$scope.curHuanjing ="生产环境";
		}else if(url=='10.6.70.119'){
			$scope.curHuanjing ="生产环境英文版";
		}else if(url=='10.6.70.110'){
			$scope.curHuanjing ="POC环境";
		}else if(url=='localhost'){
			$scope.curHuanjing ="本地环境";
		}else{
			$scope.curHuanjing ="";
		}
    	//修改密码updatePsd
    	$scope.updatePsdBtn = function() {
    		$scope.userInf = {
    				userName: $scope.userName
    		};
    		console.log($scope.userInf);
			$scope.modal('/system/password/updatePsd.html' ,$scope.userInf, {
				title : T.T('F00006'),
				buttons : [ T.T('F00107'), T.T('F00012') ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureUpPsd]
			});
    	};
    	//确认密码
		$scope.sureUpPsd = function (result) {
			$scope.upPsdPrams = result.scope.upPsdInf;
			if($scope.upPsdPrams.password  == $scope.upPsdPrams.passwordConfirm){
				jfLayer.alert(T.T('F00165'));
				return;
            }
            $scope.upPsdPrams.password = base64encode(result.scope.upPsdInf.password)
            $scope.upPsdPrams.passwordNew = base64encode(result.scope.upPsdInf.passwordNew)
            $scope.upPsdPrams.passwordConfirm = base64encode(result.scope.upPsdInf.passwordConfirm)
            jfRest.request('userManage','updatePsd',$scope.upPsdPrams).then(function(data) {
				if(data.returnCode == '000000'){
					jfLayer.success(T.T('F00022'));
					$scope.safeApply();
					result.cancel();
				}
			});
		};
		$scope.openLogin = function(){
			location.href = ctx + "/pages/iderLogin.html";
		};
    	//退出
    	$scope.exit = function() {
    		 var req = {
    		            method: 'POST',//请求的方式
    		            url: '/ider/betaService/COS.CS.01.0027',//请求的地址
    		            headers: {
    		                'Content-Type': 'application/json',
    		                'Accept': '*/*'
    		            },//请求的头，如果默认可以不写
    		          //  timeout:5000,//超时时间，还没有测试
    		            data: {
    		            	"clientToken" : sessionStorage.getItem("clientToken")
    		            } //message 必须是a=b&c=d的格式
    		        };
    	            $http(req).success(function (data, status, headers, config) {
    	                //成功后的数据处理
    	            	if (data.returnCode == '000000') {
    	            		sessionStorage.clear();
    	        	    	localStorage.clear();
    	        	    	$scope.openLogin();
    	            	}else if(data.returnCode =="CUS-00054"){
    	            		sessionStorage.clear();
    	        	    	localStorage.clear();
    	            		 var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
         	    				jfLayer.atuoCloseAlert(returnMsg,$scope.openLogin());
    	            	}
    	            	else {
        	                //失败后的提示
        	                var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
        	    				jfLayer.fail(returnMsg);
    	            	}
    	            }).error(function (data, status, headers, config) {
    	                //失败后的提示
    	                console.log("error", data, status, headers, JSON.stringify(config));
    	            });
    	/*	jfRest.request('menuLists','exit',{}).then(function(data) {
    			if(data.returnCode == '000000'){
    				console.log(data)
    			//	sessionStorage.clear();
    	    	//	localStorage.clear();
    	    	//	location.href = ctx + "/pages/iderLogin.html";
				}else {
					var returnMsg =  data.returnMsg ? data.returnMsg : T.T('F00035');
					jfLayer.fail(returnMsg);
				}
    		});
    		*/
    	};
    	//panelCtrl获取当前时间
    	$scope.timer = $interval( function(){
    		var date = new Date();
	   		 var sign1 = "-";
	   		 var sign2 = ":";
	   		 var year = date.getFullYear(); // 年
	   		 var month = date.getMonth() + 1; // 月
	   		 var day  = date.getDate(); // 日
	   		 var hour = date.getHours(); // 时
	   		 var minutes = date.getMinutes(); // 分
	   		 var seconds = date.getSeconds(); //秒
	   		/* var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
	   		 var week = weekArr[date.getDay()];*/
	   		 // 给一位数数据前面加 “0”
	   		 if (month >= 1 && month <= 9) {
	   		  month = "0" + month;
	   		 }
	   		 if (day >= 0 && day <= 9) {
	   		  day = "0" + day;
	   		 }
	   		 if (hour >= 0 && hour <= 9) {
	   		  hour = "0" + hour;
	   		 }
	   		 if (minutes >= 0 && minutes <= 9) {
	   		  minutes = "0" + minutes;
	   		 }
	   		 if (seconds >= 0 && seconds <= 9) {
	   		  seconds = "0" + seconds;
	   		 }
	   		 var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
	   		 $scope.currentdate = currentdate;
    	  }, 300);
    });
    //修改密码
    webApp.controller('updatePsdCtrl', function($rootScope,$scope,$state, $stateParams, jfRest, $timeout, lodinDataService,
    	    $http, jfGlobal, $window, jfLayer, $location,$translate,T,$translatePartialLoader) {
    	$scope.upPsdInf = {};
    	$scope.upPsdInf.loginName = $scope.userInf.userName;
    });
    //个人中心
    webApp.controller('personCenterCtrl', function($rootScope,$scope,$state, $stateParams, jfRest, $interval,$timeout, lodinDataService,
    	    $http, jfGlobal, $window, jfLayer, $location,$translate,T,$translatePartialLoader) {
    	$scope.userName = lodinDataService.getObject("menuName");//菜单名
    	/*//调用天气预报
    	var appkey = ""
    	var url = "http://localhost:8080/ider/pages/personCenter.html";
    	var paramUrl = "http://api.k780.com:88/?app=weather.future&weaid=" + url + "&appkey=" + appkey + "&sign=27c89ecea48a0e28f9c25f23be6a4e40&format=json";
        $.ajax({
            url: paramUrl,
            type: "get",
            dataType: "jsonp",
            jsonp: 'jsoncallback',
            async: false,
            data: "",
           // success: eval(funback)   封装成方法时，这里是回调参数名称
             success:function(data){
                //这里处理返回的结果  json格式的
              }
        });
        //调用日历
*/
        //遍历快捷菜单
        //模拟
       /* jfRest.register({quickMenu : {
			query : '/json/person/personCenter.json'
		}}) ;*/
    	/*公告*/
    	$scope.noticeUp = function () {
    			$(".noticee ul").animate({
    				marginTop:'-35px'
    			}, 500, function() {
    				$(this).css({
    					marginTop: "0"
    				}).find(":first").appendTo(this);
    			})
    	};
		// 调用 公告滚动函数
		$scope.	timerr = $interval($scope.noticeUp, 2000);
		$(".noticee ul").mouseover(function(){
			$scope.	stopScroll ();
		}).mouseleave(function(){
			$scope.	timerr = $interval($scope.noticeUp, 2000);
		});
		$scope.	stopScroll = function(){
			$interval.cancel($scope.timerr);
		};
      //点击快捷菜单时需要传入二级菜单，然后判断二级菜单是否有下级菜单再进行跳转
        $scope.clickQuickMenuList = [];
        //查询已有的快捷菜单
        $scope.queryQuick = function(){
      	  jfRest.request('quickmenu','query',{}).then(function(data) {//查询已有的快捷菜单
    			if(data.returnCode == '000000'){
    				console.log(data);
    				if(data.returnData && data.returnData.length > 0){
    					$scope.quickMenuListArr = [];
    					var menuData = data.returnData;
    					//快捷菜单关联图标
    					for(var i = 0; i < menuData.length; i++){//将末级菜单放入数组
    						if(menuData[i].lowerMenuFlag == 0){
    							$scope.quickMenuListArr.push(menuData[i]);
    						}
                        }
                        angular.forEach($scope.quickMenuListArr,function(item,index){
							item.menuNoTopStr = item.menuNo.substring(0,9);
    						if(item.topMenuNo == 'RES101666'){//配置中心
    							item.iconOrder = 'iconmenu01';
    						}else if(item.topMenuNo == 'RES101667'){//运营中心
    							item.iconOrder = 'iconmenu02';
    						}else if(item.topMenuNo == 'RES101668'){//客户服务
    							item.iconOrder = 'iconmenu03';
    						}else if(item.topMenuNo == 'RES101669'){//授权服务
    							item.iconOrder = 'iconmenu04';
    						}else if(item.topMenuNo == 'RES101674'){//额度服务
    							item.iconOrder = 'iconmenu09';
    						}else if(item.topMenuNo == 'RES101673'){//分期及消费贷
    							item.iconOrder = 'iconmenu06';
    						}else if(item.topMenuNo == 'RES101672'){//清分清算
    							item.iconOrder = 'iconmenu07';
    						}else if(item.topMenuNo == 'RES101670'){//争议服务
    							item.iconOrder = 'iconmenu08';
    						}else if(item.topMenuNo == 'RES101678'){//公务卡服务
    							item.iconOrder = 'iconmenu05';
    						}else if(item.topMenuNo == 'RES101671'){//运维服务
    							item.iconOrder = 'iconmenu10';
                            }
                        });
    					//添加末级菜单
    					$scope.quickMenuList = $scope.quickMenuListArr;
    				}else {
    					$scope.quickMenuList  = [];
    				}
    			}
    		});
      };
      $scope.queryQuick();
      //查询所有菜单
      $scope.queryAllQuick = function(){
    	  jfRest.request('newmenu','query',{} ).then(function(data) {//查询所有菜单
    		  if(data.returnCode == '000000'){
    			  $scope.quickAllMenu = {
    					  menuList: data.returnData.menuList
    			  };
    			  $scope.quickAllMenu.quickFlag = '1';
    		  }
    	  });
      };
      $scope.queryAllQuick();
      //查询权限菜单
      $scope.queryAuthQuick = function(){
    	  jfRest.request('quickmenu','queryAuthMenu',{} ).then(function(data) {//查询权限菜单
    		  if(data.returnCode == '000000'){
    			  $scope.quickAuthMenu = {
    					  menuList: data.returnData.menuList
    			  };
    			  $scope.quickAuthMenu.quickFlag = '1';
    		  }
    	  });
      };
      $scope.queryAuthQuick();
        //点击快捷菜单 跳转页面
        $scope.clickQuickMenu = function(menu){
        	console.log(menu);//末级菜单
        	lodinDataService.setObject("quickAllMenu",$scope.quickAllMenu);//所有菜单
        	lodinDataService.setObject("quickAuthMenu",$scope.quickAuthMenu);//权限菜单
        	//根据一级菜单编号，查询其所有菜单含一级
         	// jfRest.request('quickmenu','queryFirstMenu', $scope.params ).then(function(data) {
         	jfRest.request('newmenu','query',{} ).then(function(data) {
         		 if(data.returnCode == '000000'){
         			 if(menu.menuLevel == 2 && menu.lowerMenuFlag == 0){//快捷菜单为2级菜单
             			 angular.forEach(data.returnData.menuList,function(itemOne,index){
             				 angular.forEach(itemOne.childMenus,function(itemTwo,index){
             					 if(menu.menuNo  == itemTwo.menuNo){
             						lodinDataService.setObject("mainMenu",itemOne);//单个一级菜单
             						 lodinDataService.setObject("subMenu",itemTwo);//单个er级菜单
             						 location.href = ctx + "/pages/panel/panelPage.html";
             					 }
             				 });
             			 });
             		 }else if(menu.menuLevel == 3  && menu.lowerMenuFlag == 0){//快捷菜单为3级菜单
             			 angular.forEach(data.returnData.menuList,function(itemOne,index){
             				 angular.forEach(itemOne.childMenus,function(itemTwo,index){
                 				 angular.forEach(itemTwo.childMenus,function(itemThree,index){
                 					 if(menu.menuNo  == itemThree.menuNo){
                 						lodinDataService.setObject("mainMenu",itemOne);//单个一级菜单
                 						 itemTwo.quickFlag = '1';//快捷菜单标记
                 						 lodinDataService.setObject("subMenu",itemTwo);//单个二级菜单
                 						 itemThree.quickFlag = '1';//快捷菜单标记
                 						 lodinDataService.setObject("threeMenu",itemThree);//三级菜单
         								 location.href = ctx + "/pages/panel/panelPage.html";
                 					 }
                 				 });
             				 });
             			 });
                     }
                 }
         	 });
        };
        //按钮快捷方式
        $scope.quickMenuBtn = function() {
        	$scope.modal('/personCenter/layerAddQuickMenu.html' ,{}, {
				title : '添加快捷菜单',
				buttons : [ '确定', '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.addQuickMenu]
			});
        };
        //确认添加快捷方式
        $scope.addQuickMenu = function (result) {
        	$scope.nodes  = result.scope.nodes;
        	$scope.addQuickMenuParams = {};
        	$scope.addQuickMenuParams.coreCommonMenuList = [];
        	var iconOrder;
        	angular.forEach($scope.nodes,function(item,index){
    			//console.log(item.menuName);
        		//将一级菜单的图标顺序放入item中，以展示图标信息
        		if(item.menuLevel == 1){
        			iconOrder = item.icon;
                }
                if(item.menuLevel == 1 && item.lowerMenuFlag == 0){//一级菜单 无下级菜单
        			item.iconOrder = iconOrder;
        			//$scope.menuListArr.push(item);
        		}else if(item.menuLevel == 2 && item.lowerMenuFlag == 0){//二级菜单 无下级菜单
        			item.iconOrder = iconOrder;
        			//$scope.menuListArr.push(item);
        		}else if(item.menuLevel == 3 && item.lowerMenuFlag == 0){//三级菜单 无下级菜单
        			item.iconOrder = iconOrder;
        		//	$scope.menuListArr.push(item);
        		}
			});
        	for( var i = 0; i < $scope.nodes.length; i++){
				if($scope.nodes[i].id != "" || $scope.nodes[i].id != undefined || $scope.nodes[i].id != null){
					$scope.addQuickMenuParams.coreCommonMenuList.push({
						'id':$scope.nodes[i].id,
						'link': $scope.nodes[i].link,
						'menuLevel':$scope.nodes[i].menuLevel,
						'menuNo':$scope.nodes[i].menuNo,
						'menuName':$scope.nodes[i].menuName,
						'upperMenuNo':$scope.nodes[i].upperMenuNo,
					});
				}
            }
            console.log($scope.addQuickMenuParams);
        	  jfRest.request('quickmenu','add',$scope.addQuickMenuParams ).then(function(data) {
        		  if(data.returnCode == '000000'){
        			  jfLayer.success('快捷菜单新增成功');
        			  $scope.safeApply();
  						result.cancel();
  				  $scope.queryQuick();//查询已有快捷菜单
        		  }
        	  });
        };
    });
    //快捷方式
    webApp.controller('addQuickMenuCtrl', function($rootScope,$scope,$state, $stateParams, jfRest, $timeout, lodinDataService,
    	    $http, jfGlobal, $window, jfLayer, $location,$translate,T,$translatePartialLoader ) {
    	$scope.username = sessionStorage.getItem("userName" );//用户名
    	$scope.password = sessionStorage.getItem("password" );//用户名
		var zTree;
    	   //引用树插件
    	Tansun.loadCss($rootScope.global.cssPath + '/zTreeStyle/zTreeStyle.css') ;
		Tansun.loadScript('jquery-ztree', function(script) {
    		zTree = script;
    		   // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    		   var setting = {
    				   data : {
    					   key: {
    						   name: 'menuName',//节点名称
    						   children: 'childMenus'//子节点名
    					   },
    					   simpleData: {
    						   idKey: 'menuNo',//节点id
    						   pIdKey: 'pid'
    					   }
    				   },
    				   check : {
    			            enable : true,
    			           /* chkboxType : {
    			                "Y" : "ps",//节点的对号
    			                "N" : "ps"
    			            }*/
    			        },
    				   callback: {
    					   onCheck: zTreeOnCheck //点击选中调用函数
    				   }
    		   };
    			//勾选已有的快捷菜单
    	        $scope.checkedQucikMenu = function(){
					 jfRest.request('quickmenu','query',$scope.params).then(function(data) {//查所有菜单
						 if(data.returnCode == '000000'){
							 $scope.getzTree  = $.fn.zTree.getZTreeObj("treeDemo");
							 $scope.getMenuListArr = data.returnData;
							 angular.forEach($scope.getMenuListArr ,function(item,index){
								 $scope.getzTree.checkNode($scope.getzTree .getNodeByParam("menuNo" ,item.menuNo), true);//反选
								 $scope.getzTree.expandNode($scope.getzTree .getNodeByParam("menuNo" ,item.menuNo), true);  //展开已勾选
		       				 });
		        			}
					 });
	        };
    		   $scope.params = {
    	    			password: $scope.password ,
    	    			loginName: $scope.username,
    	    			flag:1
    	    	};
    		jfRest.request('menuLists','query',$scope.params).then(function(data) {//查询所有菜单
				if(data.returnCode == '000000'){
					console.log(data);
					$scope.checkedQucikMenu();
					$.fn.zTree.init($("#treeDemo"), setting, data.returnData.menuList);
				}
			});
    		//Check  Function
 		   function zTreeOnCheck(event, treeId, treeNode) {
					$scope.treeObj = $.fn.zTree.getZTreeObj("treeDemo");
					$scope.nodes = $scope.treeObj.getCheckedNodes(true);
           }
        });
    });
    //index页面菜单$rootScope,$scope,$state,jfRest,$timeout,$window
    webApp.controller('mainMenuCtrl', function($rootScope,$scope,$state, $stateParams, jfRest, $timeout, lodinDataService,
	    $http, jfGlobal, $window, jfLayer, $location,$translate,$translatePartialLoader,T) {
    	//缓存用户名和密码
    	$scope.userName = sessionStorage.getItem("userName");//用户名
    	$scope.psd = sessionStorage.getItem("password");//密码
    	$rootScope.allMenuList  = lodinDataService.getObject("allList" );//权限菜单
    	$rootScope.newAllMenuList  = lodinDataService.getObject("menuAll" );//所有菜单
    //	console.log($rootScope.allMenuList);
    	$scope.clientToken = sessionStorage.getItem("clientToken");
    	if($scope.clientToken == null || $scope.clientToken == undefined){
    		location.href = ctx + "/pages/iderLogin.html";
        }
        //清掉菜单栏$rootScope.tabList是panel页面中面板标题的list
		if(sessionStorage
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
		//请求一级菜单
		$scope.queryMainMenu = function() {
			$rootScope.mainMenuList= $scope.allMenuList;
			$scope.newmainMenuList = $scope.newAllMenuList;
/*
			angular.forEach($scope.allMenuList,function(item,index){
    			//console.log(item.menuName);
			});*/
		//右侧默认显示第一个一级菜单下的二级
		$scope.clickapp = true;
		$scope.menuData = $scope.allMenuList[0];
		$scope.newmenuData = $scope.newAllMenuList[0];
		$scope.newList = "";
		if($scope.allMenuList.length == 0){
			jfLayer.fail("请联系管理员配置权限");
			$scope.newList = "";
		}else{
			for(var i=0; i< $scope.menuData.childMenus.length;i++){
    			for(var j=0;j<$scope.newmenuData.childMenus.length;j++){
    				if($scope.menuData.childMenus[i].menuNo == $scope.newmenuData.childMenus[j].menuNo){
    					$scope.newList += $scope.menuData.childMenus[i].menuNo + " ";
    				}
    			}
    		}
		}
	};
		$scope.queryMainMenu();
    	//点击一级菜单请求右侧的二级菜单
    	$scope.queryMenu = function(menuIcon){
    		//console.log(menuIcon)
    		$scope.menuDataList = $scope.allMenuList;
    		$scope.newmenuDataList = $scope.newAllMenuList;
    		$scope.newList = "";
    		for(var i=0; i< $scope.menuDataList.length;i++){
    			for(var j=0;j<$scope.newmenuDataList.length;j++){
    				if($scope.menuDataList[i].menuNo == $scope.newmenuDataList[j].menuNo){
    					for(var k=0;k<$scope.menuDataList[i].childMenus.length;k++){
    						for(var h=0;h<$scope.newmenuDataList[j].childMenus.length;h++){
    		    				if($scope.menuDataList[i].childMenus[k].menuNo == $scope.newmenuDataList[j].childMenus[h].menuNo){
    		    					$scope.newList += $scope.menuDataList[i].childMenus[k].menuNo + " ";
    		    				}
    						}
    					}
    				}
    			}
    		}
    		angular.forEach($scope.newmenuDataList,function(item,index){
				if(item.icon == menuIcon ){
					$scope.menuData = item;
					$scope.newmenuData = item;
				}
			}) ;
    	};
    	$scope.layerHandle = function(menuId) {
    		if(menuId == "iconmenu01"){
    			$scope.queryMenu("iconmenu01");
    		}else if(menuId== "iconmenu02"){
    			$scope.queryMenu("iconmenu02");
    		}else if(menuId== "iconmenu03"){
    			$scope.queryMenu("iconmenu03");
    		}else if(menuId== "iconmenu04"){
    			$scope.queryMenu("iconmenu04");
    		}else if(menuId== "iconmenu05"){
    			$scope.queryMenu("iconmenu05");
    		}else if(menuId== "iconmenu06"){
    			$scope.queryMenu("iconmenu06");
    		}else if(menuId== "iconmenu07"){
    			$scope.queryMenu("iconmenu07");
    		}else if(menuId== "iconmenu08"){
    			$scope.queryMenu("iconmenu08");
    		}else if(menuId== "iconmenu09"){
    			$scope.queryMenu("iconmenu09");
    		}else if(menuId== "iconmenu10"){
    			$scope.queryMenu("iconmenu10");
    		}
    	};
    	//点击首页菜单
		//$scope.goMenu2=function(mainmenuid,submenuid,url,flag,text){
		$scope.goMenu2=function(mainMenu,subMenu){
			lodinDataService.setObject("mainMenu",mainMenu);
			lodinDataService.setObject("subMenu",subMenu);
			sessionStorage.setItem("mainMenuId", mainMenu.id);//主菜单id
			sessionStorage.setItem("subMenuId", subMenu.id);//二级菜单id
			sessionStorage.setItem("subUrl", subMenu.url);//二级菜单id
			sessionStorage.setItem("lowerMenuFlag", subMenu.flag);//是否有三级菜单flag
			sessionStorage.setItem("submenuText", subMenu.menuName);//二级菜单名字
			if($scope.newList.search(subMenu.menuNo) != -1){
				location.href = ctx + "/pages/panel/panelPage.html";
			}
			else{
				jfLayer.alert("没有此权限");
			}
		};
    });
	// 面板页
	webApp.controller('panelCtrl', function($scope,$window,$rootScope,$interval, jfRest,$http,jfGlobal,$state,$stateParams,lodinDataService,
			$location,jfLayer,$timeout,$translate,$translatePartialLoader,T) {
    	//window.location.reload();
/*		 $scope.switchLanguage = function(lang){
	        $translate.use(lang);
	        window.localStorage.lang = lang;
	        window.location.reload();
	        $scope.cur_lang = lang;
	    };*/
		//获取当前主机地址和端口号
		//退出
    	$scope.exit = function() {
    		 var req = {
    		            method: 'POST',//请求的方式
    		            url: '/ider/betaService/COS.CS.01.0027',//请求的地址
    		            headers: {
    		                'Content-Type': 'application/json',
    		                'Accept': '*/*'
    		            },//请求的头，如果默认可以不写
    		          //  timeout:5000,//超时时间，还没有测试
    		            data: {
    		            	"clientToken" : sessionStorage.getItem("clientToken")
    		            } //message 必须是a=b&c=d的格式
    		        };
    	            $http(req).success(function (data, status, headers, config) {
    	                //成功后的数据处理
    	            	if (data.returnCode == '000000') {
    	            		sessionStorage.clear();
    	        	    	localStorage.clear();
    	        	    	$scope.openLogin();
    	            	}else if(data.returnCode =="CUS-00054"){
    	            		sessionStorage.clear();
    	        	    	localStorage.clear();
    	            		 var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
         	    				jfLayer.atuoCloseAlert(returnMsg,$scope.openLogin());
    	            	}
    	            	else {
        	                //失败后的提示
        	                var returnMsg = data.returnMsg ? data.returnMsg : T.T('F00035');
        	    				jfLayer.fail(returnMsg);
    	            	}
    	            }).error(function (data, status, headers, config) {
    	                //失败后的提示
    	                console.log("error", data, status, headers, JSON.stringify(config));
    	            });
    	/*	jfRest.request('menuLists','exit',{}).then(function(data) {
    			if(data.returnCode == '000000'){
    				console.log(data)
    			//	sessionStorage.clear();
    	    	//	localStorage.clear();
    	    	//	location.href = ctx + "/pages/iderLogin.html";
				}else {
					var returnMsg =  data.returnMsg ? data.returnMsg : T.T('F00035');
					jfLayer.fail(returnMsg);
				}
    		});
    		*/
    	};
		$scope.showCurHuanjing = true;
		var url = window.location.hostname;
		if(url=='10.6.90.182'){
			$scope.curHuanjing ="开发环境";
		}
		else if(url=='10.6.70.168'){
			$scope.curHuanjing ="sit环境";
		}else if(url=='10.6.70.117'){
			$scope.curHuanjing ="生产环境";
		}else if(url=='10.6.70.119'){
			$scope.curHuanjing ="生产环境英文版";
		}else if(url=='10.6.70.110'){
			$scope.curHuanjing ="POC环境";
		}else if(url=='localhost'){
			$scope.curHuanjing ="本地环境";
		}else{
			$scope.curHuanjing ="";
		}
		//修改密码updatePsd
    	$scope.updatePsdBtn = function() {
    		//location.href = ctx + "/pages/template/updatePsd.html";
    		$scope.userInf = {
    				userName: $scope.userName
    		};
    		$scope.modal('/system/password/updatePsd.html' ,$scope.userInf, {
				title : '修改密码',
				buttons : [ '确定', '关闭' ],
				size : [ '850px', '380px' ],
				callbacks : [$scope.sureUpPsd]
			});
    	};
    	$scope.sureUpPsd = function(result) {
			$scope.upPsdPrams = result.scope.upPsdInf;
			if($scope.upPsdPrams.password  == $scope.upPsdPrams.passwordConfirm){
				jfLayer.alert("新密码与旧密码相同!");
				return;
            }
            $scope.upPsdPrams.password = base64encode(result.scope.upPsdInf.password)
            $scope.upPsdPrams.passwordNew = base64encode(result.scope.upPsdInf.passwordNew)
            $scope.upPsdPrams.passwordConfirm = base64encode(result.scope.upPsdInf.passwordConfirm)
            jfRest.request('userManage','updatePsd',$scope.upPsdPrams).then(function(data) {
				if(data.returnCode == '000000'){
					jfLayer.success("修改成功");
					$scope.safeApply();
					result.cancel();
				}
			});
    	};
    	//panelCtrl获取当前时间
    	$scope.timer = $interval( function(){
    		var date = new Date();
	   		 var sign1 = "-";
	   		 var sign2 = ":";
	   		 var year = date.getFullYear(); // 年
	   		 var month = date.getMonth() + 1; // 月
	   		 var day  = date.getDate(); // 日
	   		 var hour = date.getHours(); // 时
	   		 var minutes = date.getMinutes(); // 分
	   		 var seconds = date.getSeconds(); //秒
	   		/* var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
	   		 var week = weekArr[date.getDay()];*/
	   		 // 给一位数数据前面加 “0”
	   		 if (month >= 1 && month <= 9) {
	   		  month = "0" + month;
	   		 }
	   		 if (day >= 0 && day <= 9) {
	   		  day = "0" + day;
	   		 }
	   		 if (hour >= 0 && hour <= 9) {
	   		  hour = "0" + hour;
	   		 }
	   		 if (minutes >= 0 && minutes <= 9) {
	   		  minutes = "0" + minutes;
	   		 }
	   		 if (seconds >= 0 && seconds <= 9) {
	   		  seconds = "0" + seconds;
	   		 }
	   		 var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
	   		 $scope.currentdate = currentdate;
    	  }, 300);
		 //清掉菜单栏
		if(sessionStorage
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
		//点击左侧菜单
		$scope.addTab = function(item){
			//左侧菜单字体颜色
			$scope.order = Number($rootScope.oneMenuOrder)+1;
			if(item.lowerMenuFlag == 0){//二级菜单 无三级
				angular.forEach($scope.menuList.childMenus,function(it,i){
					if(it.link == item.link){
						$("#leftUL").find('li').removeClass('layui-nav-itemed layui-this');
						$("#leftUL").find('li').find('a').removeClass();//
						$("#leftUL").find('li').eq(i).addClass('layui-nav-itemed layui-this');
						$("#leftUL").find('li').eq(i).find('a').addClass('checkdColor'+$scope.order);
                    }
                });
			}else if(item.lowerMenuFlag == 1){//二级菜单 有三级
            }
            if($scope.newMenuClick.search(item.menuNo) != -1){
				if(item.link == "#" || item.link == "" || item.link == null  || item.link == undefined ){
					return;
                }
                item.isActive = true;
				if($rootScope.tabList.indexOf(item)<0){
					$rootScope.tabList.unshift(item);
                }
                if($rootScope.tabList.length > 1){
					var arr = [];
					angular.forEach($rootScope.tabList,function(tab,index){
						if(tab.menuName == item.menuName){
							arr.push(item);
						}
					});
					if(arr.length == 2){
						$rootScope.tabList.splice(0,1);
                    }
                }
                /**/
				angular.forEach($rootScope.tabList,function(tab,index){
					if(tab.id == item.id){
						$rootScope.tabList[index] = item;
					}else{
						$rootScope.tabList[index].isActive = false ;
					}
				}) ;
				//获取导航tab,ul>li宽度，超出显示下拉
				$scope.liAllWidth = 0;//li总宽度
				$scope.isShow=false;//显示下拉箭头
				$scope.isShowUl=false;
				$timeout(function(){
					$scope.ulnum = document.getElementById("tabTitle");
					$scope.linum =$scope.ulnum.getElementsByTagName("li");
					$scope.tabContent =document.getElementsByClassName("layui-tab-content")[0].offsetWidth-20;
					for(var i=0;i<$scope.linum.length;i++){
						$scope.liAllWidth+= parseInt($scope.linum[i].offsetWidth);
                    }
                    if($scope.liAllWidth>$scope.tabContent){
						$scope.isShowUl=false;
						$scope.isShow=true;
					}
				},300);
				$scope.isShowScreen=false;//tab多个展示的下拉div
				$scope.iconTop=false;
				$scope.iconDow=true;
				$scope.screenTap=function(){//点击箭头，显示隐藏下拉div方法
			    	$scope.isShowScreen=!$scope.isShowScreen;
			    	if(!$scope.isShowScreen){
			    		$scope.iconTop=false;
			    		$scope.iconDow=true;
			    	}else{
			    		$scope.iconTop=true;
			    		$scope.iconDow=false;
			    	}
			    };
				lodinDataService.setObject("menuName",item.menuName);
				lodinDataService.setObject("menuNo",item.menuNo);
				$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
				$translate.use($scope.lang);
				$translatePartialLoader.addPart('pages/i18n');
				$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProjectCatalogue');
				$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payPro');
				$translatePartialLoader.addPart('pages/a_operatMode/businessParamsOverview/i18n_busParOverview');
				$translatePartialLoader.addPart('pages/a_operatMode/example/i18n_artifact');
				$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proLine');
				$translatePartialLoader.addPart('pages/a_operatMode/product/i18n_proObject');
				$translatePartialLoader.addPart('pages/a_operatMode/business/i18n_business');
				$translatePartialLoader.addPart('pages/a_operatMode/priceLabel/i18n_priceLabel');
				$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optMode');
				$translatePartialLoader.addPart('pages/a_operatMode/cardBin/i18n_cardBin');
				$translatePartialLoader.addPart('pages/a_operatMode/accountingMag/i18n_accountingMag');
				$translatePartialLoader.addPart('pages/beta/businessForm/i18n_businessForm');
				$translatePartialLoader.addPart('pages/beta/elmList/i18n_elmList');
				$translatePartialLoader.addPart('pages/beta/elementList/i18n_elementList');
				$translatePartialLoader.addPart('pages/beta/evList/i18n_evList');
				$translatePartialLoader.addPart('pages/beta/holiday/i18n_holiday');
				$translatePartialLoader.addPart('pages/beta/legalEntity/i18n_legalEntity');
				$translatePartialLoader.addPart('pages/beta/serialList/i18n_serialList');
				$translatePartialLoader.addPart('pages/a_operatMode/lifeCycleNode/i18n_lifeCycleNode');
				$translatePartialLoader.addPart('pages/beta/systemUnit/i18n_systemUnit');
				$translatePartialLoader.addPart('pages/beta/avyList/i18n_avyList');
				$translatePartialLoader.addPart('pages/beta/eventConfig/i18n_eventConfig');
				$translatePartialLoader.addPart('pages/a_operatMode/payProject/i18n_payProject');
				$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_currency');
				$translatePartialLoader.addPart('pages/authorization/scenario/i18n_scenario');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_cusInfo');
				$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_tradingNow');
				$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_controlDiff');
				$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_list');
				$translatePartialLoader.addPart('pages/authorization/network/i18n_network');
				$translatePartialLoader.addPart('pages/authorization/machineManage/i18n_encryption');
				$translatePartialLoader.addPart('pages/authorization/controltrading/i18n_negative');
				$translatePartialLoader.addPart('pages/authorization/marketing/i18n_marketing');
				$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotatree');
				$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_linesProduct');
				$translatePartialLoader.addPart('pages/authorization/quotatree/i18n_quotaNode');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_customerAdjust');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_creditInfo');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_quotaQuery');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_adjustHistory');
				$translatePartialLoader.addPart('pages/cstSvc/fastBuildCard/i18n_fastBuildCard');
				$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEnqrAndMnt');
				$translatePartialLoader.addPart('pages/cstSvc/cstBsnisItemQuery/i18n_cstBsnisItemQuery');
				$translatePartialLoader.addPart('pages/cstSvc/cstPrcgLblEnqr/i18n_cstBsTypeLbSet');
				$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfBind');
				$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rvlDbtTxnSplmt');
				$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_trans');
				$translatePartialLoader.addPart('pages/cstSvc/interestQuery/i18n_interest');
				$translatePartialLoader.addPart('pages/cstSvc/cstFeeWaiveList/i18n_cstFeeWaiveList');
				$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_blockHistory');
				$translatePartialLoader.addPart('pages/cstSvc/instalmentsQuery/i18n_instalQuery');
				$translatePartialLoader.addPart('pages/cstSvc/cashStage/i18n_cashStage');
				$translatePartialLoader.addPart('pages/stage/consumerLoanApply/i18n_consumerLoanApply');
				$translatePartialLoader.addPart('pages/cstSvc/loanTrial/i18n_loanTrial');
				$translatePartialLoader.addPart('pages/clearACC/channelMag/i18n_channel');
				$translatePartialLoader.addPart('pages/clearACC/clearScene/i18n_clearScene');
				$translatePartialLoader.addPart('pages/clearACC/clearResult/i18n_clearResult');
				$translatePartialLoader.addPart('pages/cstSvc/applicationFormMC/i18n_applicationFormMC');
				$translatePartialLoader.addPart('pages/system/i18n_userManage');
				$translatePartialLoader.addPart('pages/businessCard/budgetManage/i18n_budgetUnit');
				$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mdmActvt');
				$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessActivated');
				$translatePartialLoader.addPart('pages/businessCard/businessManage/i18n_businessCancel');
				$translatePartialLoader.addPart('pages/businessCard/quotaManage/i18n_unitQuotaQuery');
				$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_financeQuery');
				$translatePartialLoader.addPart('pages/cstSvc/txnInfEnqr/i18n_billEnqr');
				$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busOutBillQuery');
				$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_busNoOutBillQuery');
				$translatePartialLoader.addPart('pages/businessCard/billManage/i18n_budOutQuery');
				$translatePartialLoader.addPart('pages/businessCard/businessOverpayment/i18n_businessOverpayment');
				$translatePartialLoader.addPart('pages/cstSvc/mdmInfMgt/i18n_mdmInfEnqrAndMnt');
				$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaLoss');
				$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_cstControlView');
				$translatePartialLoader.addPart('pages/a_operatMode/blockCode/i18n_blockCode');
				$translatePartialLoader.addPart('pages/beta/actConfig/i18n_actConfig');
				$translatePartialLoader.addPart('pages/a_operatMode/accountingStatus/i18n_accountingStatus');
				$translatePartialLoader.addPart('pages/a_operatMode/trans/i18n_transIdenty');
				$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_balance');
				$translatePartialLoader.addPart('pages/a_operatMode/currency/i18n_rate');
				$translatePartialLoader.addPart('pages/a_operatMode/manageControl/i18n_controlProject');
				$translatePartialLoader.addPart('pages/a_operatMode/object/i18n_mediaObject');
				$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_optOrgan');
				$translatePartialLoader.addPart('pages/cstSvc/pDInfMgt/i18n_pDInfEstb');
				$translatePartialLoader.addPart('pages/cstSvc/baseBsnPcsg/i18n_mediaDmgRsu');
				$translatePartialLoader.addPart('pages/cstSvc/abnormalTradManage/i18n_abnormalTradManage');
				$translatePartialLoader.addPart('pages/cstSvc/acbaUnitList/i18n_accFinancialInf');
				$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rpyTxnSplmt');
				$translatePartialLoader.addPart('pages/cstSvc/fncTxnMgt/i18n_rvlCrTxnSplmt');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_updatePass');
				$translatePartialLoader.addPart('pages/cstSvc/balnStage/i18n_balnStage');
				$translatePartialLoader.addPart('pages/a_operatMode/optcenter/i18n_tradingSource');
				$translatePartialLoader.addPart('pages/cstSvc/accInfMgt/i18n_accBscInf');
				$translatePartialLoader.addPart('pages/cstSvc/unifiedVisualManage/i18n_cstMediaList');
				$translatePartialLoader.addPart('pages/a_operatMode/prefabCard/i18n_prefabCard');
				$translatePartialLoader.addPart('pages/authorization/customerInfo/i18n_rltmBal');
				$translatePartialLoader.addPart('pages/authorization/tradingList/i18n_entryAdd');
				$translatePartialLoader.addPart('pages/authorization/scenario/i18n_tradModel');
				$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEstb');
				$translatePartialLoader.addPart('pages/a_operatMode/stageTypePara/stagTypePara');
				$translatePartialLoader.addPart('pages/cstSvc/multiFundLoan/i18n_partnerInformation');
                $translatePartialLoader.addPart('pages/clearACC/clearHistory/i18n_clearHistory');
				$translate.refresh();
				$scope.turn(item.link) ;
			}
			else{
				jfLayer.alert("没有此权限");
			}
		};
		//获取缓存数据
		$scope.userName = sessionStorage.getItem("userName");//用户名
		$scope.allMenuList = lodinDataService.getObject("allList" );//权限菜单
		$scope.newAllMenuList = lodinDataService.getObject("menuAll" );//所有菜单
		$scope.mainMenu = lodinDataService.getObject("mainMenu");//单个一级菜单
		$scope.subMenu = lodinDataService.getObject("subMenu");//单个二级菜单
		$scope.clientToken = sessionStorage.getItem("clientToken");
    	if($scope.clientToken == null ||$scope.clientToken == undefined){
    		location.href = ctx + "/pages/iderLogin.html";
    	}
    	var mainMenuId = $scope.mainMenu.id;//单个一级菜单id，如客户服务id
		var subMenuId = $scope.subMenu.id;// 单个二级菜单id,
		//由快捷菜单点击进来
		$scope.threeMenu = lodinDataService.getObject("threeMenu");
		if($scope.subMenu.quickFlag == 1 || $scope.threeMenu.quickFlag == 1 ){
			//所有菜单
			$scope.newAllMenuList = lodinDataService.getObject("quickAllMenu").menuList;
			//权限菜单
			$scope.allMenuList = lodinDataService.getObject("quickAuthMenu").menuList;
        }
        $scope.isActive = true;
		var order;//用于标记是第几个一级菜单
		//panel左侧菜单，默认显示二级菜单下的菜单页面
		$scope.queryLeftMenu = function() {
				angular.forEach($scope.allMenuList,function(item,index){
	    			if(item.id == mainMenuId){
	    				$scope.menuList = item;//单个一级菜单,如BETA
	    				order = index;
	    				$rootScope.oneMenuOrder = order;
	    			}
				}) ;
				angular.forEach($scope.newAllMenuList,function(item,index){
	    			if(item.id == mainMenuId){
	    				$scope.newmenuList = item;//单个一级菜单,如BETA
	    				order = index;
	    				$rootScope.oneMenuOrder = order;
	    			}
				}) ;
				$scope.newMenuClick = "";
				for(var i=0; i< $scope.menuList.childMenus.length;i++){
	    			for(var j=0;j<$scope.newmenuList.childMenus.length;j++){
	    				if($scope.menuList.childMenus[i].lowerMenuFlag == '0'){
	    					if($scope.menuList.childMenus[i].menuNo == $scope.newmenuList.childMenus[j].menuNo){
		    					$scope.newMenuClick += $scope.menuList.childMenus[i].menuNo + " ";
		    				}
	    				}else if($scope.newmenuList.childMenus[j].lowerMenuFlag == '0'){
    						if($scope.menuList.childMenus[i].menuNo == $scope.newmenuList.childMenus[j].menuNo){
		    					$scope.newMenuClick += $scope.menuList.childMenus[i].menuNo + " ";
		    				}
    					}else{
    						if($scope.menuList.childMenus[i].childMenus){
    							for(var k=0;k<$scope.menuList.childMenus[i].childMenus.length;k++){
		    						for(var h=0;h<$scope.newmenuList.childMenus[j].childMenus.length;h++){
		    		    				if($scope.menuList.childMenus[i].childMenus[k].menuNo == $scope.newmenuList.childMenus[j].childMenus[h].menuNo){
		    		    					$scope.newMenuClick += $scope.menuList.childMenus[i].childMenus[k].menuNo + " ";
		    		    				}
		    						}
		    					}
                            }
                        }
	    				}
	    			}
				$rootScope.newMenuClick = $scope.newMenuClick;
		};
		$scope.queryLeftMenu();
		//渲染二级菜单前的图标
		angular.forEach($scope.newmenuList.childMenus,function(item,index){
			item.icon = "submenu_bg_"+index;
		});
		//从首页点击菜单跳转，二级菜单显示二级菜单，有三级菜单显示对应二级菜单下首个三级菜单
		if($scope.subMenu.lowerMenuFlag == false || $scope.subMenu.lowerMenuFlag == "false" || $scope.subMenu == 0){//没有三级菜单
			$scope.subMenu.isActive = true;
			if($scope.subMenu.link == "/ider/pages/panel/panelPage.html"){
				$scope.subMenu.link = "#"
			}
			var subItemNoThree = $scope.subMenu;
			$scope.addTab(subItemNoThree);
		}else if($scope.subMenu.lowerMenuFlag == true || $scope.subMenu.lowerMenuFlag == "true"){//有三级菜单
			//由快捷菜单 默认打开指定的 三级菜单
			if($scope.subMenu.quickFlag){
				$scope.subMenu.isActive = true;
				//找三级菜单 并加样式
				$timeout(function(){
					var ulEle = document.getElementById("leftUL");
					var twoliEles = ulEle.querySelectorAll('li.layui-nav-item'), twoliEle;
					for(var k = 0; k < twoliEles.length; k++){
						if($scope.subMenu.id  == twoliEles[k].getAttribute("submenuid")){
							twoliEle = twoliEles[k];
						}
                    }
                    var ddEles = ulEle.querySelectorAll('dd'),ddEle;
					for(var  m = 0; m < ddEles.length; m++ ){
						ddEles[m].classList.remove('layui-this');
						if($scope.threeMenu.id == ddEles[m].getAttribute("threemenuid")){
							//console.log(ddEles[m].getAttribute("threemenuid"));
							ddEle = ddEles[m];
							ddEle.classList.add('layui-this');
							return;
                        }
                    }
                },300);
				if($scope.threeMenu.quickFlag){
					angular.forEach($scope.subMenu.childMenus,function(item,index){
						if($scope.threeMenu.id == item.id){
							$scope.addTab($scope.threeMenu);
						}
					}) ;
				}
			}else {
				$scope.subMenu.lowerMenuFlag = true;
				if($scope.subMenu.link == "#" || $scope.subMenu.link == "" || $scope.subMenu.link == null  ){
					var firstThree;
					angular.forEach($scope.menuList.childMenus,function(item,index){
						if(subMenuId == item.id){
							var submenuList  = item;
							//二级菜单有无页面
							$scope.item = item.childMenus[0];
							firstThree = item.childMenus[0];
						}
					}) ;
					$scope.addTab(firstThree);
				}
			}
        }
        $(function(){
		 $timeout(function(){
			 	//左侧菜单默认选择二级菜单下的第一个
				var liList = angular.element("#leftUL").find("li");
				//console.log($scope.subMenu);
				for(var j =0 ; j < liList.length; j++){
					if($scope.subMenu.id == liList[j].getAttribute("submenuid") && $scope.subMenu.lowerMenuFlag == 1){//有三级菜单，默认打开第一个三级菜单
						liList[j].setAttribute("class", "layui-nav-item ng-scope layui-nav-itemed");
						var dd = liList[j].getElementsByTagName("dd")[0];
						if(dd){
							dd.setAttribute("class","layui-this");
						}
					}else if($scope.subMenu.id == liList[j].getAttribute("submenuid") && $scope.subMenu.lowerMenuFlag == 0){//无三级菜单，打开二级菜单
						var className = "checkdColor" + (order+1);
						liList[j].setAttribute("class", 'layui-nav-item ng-scope nosubmenu layui-nav-itemed layui-this ' +className);
						liList[j].children[1].setAttribute("class","ng-binding "+className );
					}
                }
         },200);
		});
		//左侧菜单点击需依赖element
		layui.use('element', function(){
		  var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
		});
		//点击含有三级菜单的二级菜单
		$scope.clickSub = function(item){
			if(item.lowerMenuFlag == false || item.lowerMenuFlag == "false"){//没有三级菜单
				$scope.addTab(item);
			}else if(item.lowerMenuFlag == true || item.lowerMenuFlag == "true"){//有三级菜单

			}
		};
		$scope.changeTab = function(tab) {
			lodinDataService.setObject("menuNo",tab.menuNo);
			angular.forEach($rootScope.tabList,function(item){
				item.isActive = false ;
			});
			tab.isActive = true ;
			$location.url(tab.backChainValue[tab.backChainValue.length - 1]) ;
			//右侧菜单和左侧样式联动
			$scope.tablink = tab.link;
			$scope.tablevel = tab.menuLevel;
			$scope.order = Number($rootScope.oneMenuOrder)+1;//记录第几个一级菜单，用来分辨菜单字体颜色
			if($scope.tablevel == 2){//二级菜单
				angular.forEach($scope.menuList.childMenus,function(itab,i){
					if($scope.tablink == itab.link){
						$("#leftUL").find('li').removeClass('layui-nav-itemed layui-this');
						$("#leftUL").find('li').find('a').removeClass();//
						$("#leftUL").find('li').eq(i).addClass('layui-nav-itemed layui-this');
						$("#leftUL").find('li').eq(i).children('a').addClass('checkdColor'+$scope.order);
                    }
                });
			}else if($scope.tablevel == 3){//三级菜单
				$scope.tablinkString = $scope.tablink.split('/').join('');
				$scope.ddEleLists = $("#leftUL").find('dd');
				angular.forEach($scope.ddEleLists,function(ithree,i){
					if(ithree.getAttribute('threemenulink') == $scope.tablinkString){
						//移除其他二级菜单样式
						$("#leftUL").find('li').removeClass('layui-nav-itemed layui-this');
						$("#leftUL").find('a').removeClass('checkdColor'+$scope.order);
						//当前菜单添加样式
						$("#leftUL").find('dd').removeClass('layui-nav-itemed layui-this');
						$scope.ddEleLists.eq(i).parent().parent().addClass('layui-nav-itemed');
						$scope.ddEleLists.eq(i).addClass('layui-nav-itemed layui-this');
                    }
                });
            }
        };
		//关闭当前
		$scope.removeTab = function(index){
			//总的li宽度减当前点击关闭li宽度，等于的剩下li宽度
			$scope.liAllWidth=$scope.liAllWidth-$scope.linum[index].offsetWidth;
			//剩下li宽度小于内容能够宽度隐藏下拉
			if($scope.liAllWidth<$scope.tabContent){
				$scope.isShowScreen=false;
				$scope.isShow=false;
			}
			var closeTab = $rootScope.tabList[index];
			var activeTab = null ;
			if(closeTab.isActive){
				activeTab = $rootScope.tabList[index-1];
				activeTab.isActive = true ;
			}
			$rootScope.tabList.splice(index,1);
			//未选中当前页签做关闭时不处理
			if(activeTab){
				$location.url(activeTab.backChainValue[activeTab.backChainValue.length - 1]);
			}
		};
	});
	/*webApp.controller('defaultLoginCtrl',  function($scope,$window,jfRest,jfLayer,$rootScope,$stateParams,$validation,$parse,jfGlobal) {
		$(document).ready(function(){
			 $("#webbtn").click(function(){
				  $('#web_login').hide();
				  $('#webcat_login').show();
		     });
			 $("#webcatbtn").click(function(){
				  $('#web_login').show();
				  $('#webcat_login').hide();
		     });
		});
		layui.use(['form'], function(){
       var form = layui.form
       });
	   $(function(){
	      function placeholder(target){
	               $(target).val($(target).attr("datavalue")).addClass("textcolor");
	               $(target).focus(function() {
	                   if($(this).val() == $(this).attr("datavalue")) {
	                       $(this).val("").removeClass("textcolor");
	                   }
	               })
	               $(target).blur(function(){
	                   if($(this).val() == "" || $(this).val() == $(this).attr("datavalue")) {
	                       $(this).val($(target).attr("datavalue")).addClass("textcolor");
	                   }
	               })
	           }
	        placeholder(".inputtype")
			 placeholder(".inputuser")
			 placeholder(".inputpasswod")
	   })
		$scope.loginConfig={};
		$scope.user={};
		//
		function getQueryString($window,name)
	    {
	        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	        var r = $window.location.search.substr(1).match(reg);
	        if(r!=null)return  unescape(r[2]); return null;
	    }
		var error = getQueryString($window,"error");
		var showError = false;
		if (error !== null && error !== undefined && error !== '') {
			showError=true;
			var errMsg="";
			switch (error) {
			case '10001':
				errMsg="用户名密码错误";
				break;
			case '10002':
				errMsg="用户已被锁定，无法登录";
				break;
			case '10003':
				errMsg="验证码为空或者不正确";
				break;
			case '10099':
				errMsg="请登录";
				break;
			default :
			    errMsg=error;
			}
		}
		 // 找回密码
	    $scope.findPwd = function() {
	    		location.href = jfGlobal.ctx + "/sys/forgotPwd?username="+$scope.user.username;
	    };
	    $scope.toLogin = function() {
    		location.href = ctx +"/"+ $scope.loginConfig.loginSubmitUrl;
    	}
		//清掉菜单栏
		if(sessionStorage
				&& sessionStorage.getItem('tabList')){
			$rootScope.tabList = [];
			sessionStorage.setItem('tabList',angular.toJson($rootScope.tabList));
		}
		var pathName = document.location.pathname;
		var loginUri = jfGlobal.ctx + "/login";
		var loginUriSuffix = pathName.length>loginUri.length?pathName.substring(loginUri.length+1):"";
		$scope.change = function() {
			$scope.captcha = $scope.loginConfig.captchaUrl + '/login?v=' + (new Date()).valueOf() ;
		};
		$scope.params={loginUriSuffix:loginUriSuffix};
		jfRest.request('loginConfig','get',Tansun.param($scope.params)).then(function(data) {
			if(data.status == 200){
				$scope.loginConfig=data.data;
				$scope.loginConfig.showError=showError;
				$scope.loginConfig.errMsg=errMsg;
				$scope.loginConfig.loginUriSuffix=loginUriSuffix;
				$scope.user.tenantName=data.data.tenantName;
				if(loginUriSuffix!=null && loginUriSuffix!=''){
					$scope.loginConfig.showTenantName='none';
				}else{
					$scope.loginConfig.showTenantName='display';
				}
				$scope.change();
				$scope.$on("refresh",function(){
					$scope.change();
				});
			}
    	});
	});*/
	 // 找回密码-身份认
    webApp.controller('forgotPwdCtrl', function ($scope, $stateParams, jfRest, jfLayer, $timeout,$validation, $interval) {
    	$scope.pwd = {};
    	$scope.pwd.flag = "";
    	if($stateParams.username) {
    		$scope.pwd.loginName = $stateParams.username;
    	}
    	$scope.preHandle = function () {
    		// 校验用户名和手机号/邮箱
    		var preHandle = $validation.validate($scope.pwdForm.loginName) && $validation.validate($scope.pwdForm.mobileOrEmail);
    		var captchaType = $scope.getCaptchaType(); // 发送类型
        	angular.element(".btn-getcode").attr("mode", captchaType);
    		preHandle.success(function() {
    			var params = {
	        		loginName : $scope.pwd.loginName,
	        		mobileOrEmail : $scope.pwd.mobileOrEmail,
	        		captchaType : captchaType
	        	};
	        	jfRest.request('forgotPwd','query', Tansun.param(params)).then(function(data) {
					if (data.status == 200) {
						$scope.pwd.flag = "1";
					} else {
						jfLayer.fail(data.description);
	                }
				});
    		});
    		return  $validation.validate($scope.pwdForm.flag);
        };
    	// 获取发送类型
    	$scope.getCaptchaType = function() {
    		var captchaType = ''; // 获取验证码类型
    		var mobileOrEmail = $scope.pwd.mobileOrEmail; // 手机号或邮箱
        	var pattern = /^1[3|4|5|7|8][0-9]\d{8}$/;
        	if (pattern.test(mobileOrEmail)) { // 手机号
        		captchaType = 'SMS'
        	} else {
        		captchaType = 'EMAIL'
        	}
        	return captchaType;
    	};
    	// 提交修改
    	$scope.save = function() {
    			var params = {
            		mobileOrEmail : $scope.pwd.mobileOrEmail,
            		code : $scope.pwd.code,
            		jfCode : 'pwd'
            	};
    	    	jfRest.request('forgotPwd','get', Tansun.param(params)).then(function(data) {
    				if (data.status == 200) {
    					var captchaType = $scope.getCaptchaType(); // 发送类型
    		    		var param = {
    		    			loginName : $scope.pwd.loginName,
    		            	mobileOrEmail : $scope.pwd.mobileOrEmail,
    		        		newPswd : $scope.pwd.newPswd,
    		        		captchaType : captchaType
    		        	};
    		        	// 保存用户信息
    		        	jfRest.request('forgotPwd','save', Tansun.param(param)).then(function(data) {
    		    			if (data.status == 200) {
    		    				location.href = ctx + "/login";
    		    			} else {
    		                    jfLayer.fail(data.description);
    		                }
    		    		});
    				} else {
    					jfLayer.fail(data.description);
                        return false;
                    }
    			});
    	};
        $scope.toLogin = function() {
    		location.href = ctx + "/login";
    	}
    });
	webApp.controller('headerCtrl',  function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$timeout,$stateParams,$location,jfLayer) {
		$scope.isActive = true;
		$scope.login = function() {
			location.href = jfGlobal.ctx + "/login" ;
		};
		$scope.reg = function() {
			location.href = jfGlobal.config.website + "/reg" ;
		};
		$scope.logout = function() {
			location.href = jfGlobal.ctx + "/logout" ;
		};
		$scope.updatePswd = function() {
			location.href = jfGlobal.ctx + "#/updatePswd" ;
		};
		//添加页签
		$scope.addTab = function(item){
/*			if($scope.newMenuClick.search(subMenu.menuNo) != -1){
				if(item.url == "#"){
					return;
				}
				angular.forEach($rootScope.tabList,function(tab,index){
					if(tab.id == item.id){
						$rootScope.tabList[index] = item ;
					}else{i
						$rootScope.tabList[index].isActive = false ;
					}
				}) ;
				item.isActive = true ;
				if($rootScope.tabList.indexOf(item) < 0){
					$rootScope.tabList.push(item);
				}
				$scope.turn(item.link) ;
			}
			else{
				jfLayer.alert("没有此权限");
			}*/
		};
		$scope.changeTab = function(tab) {
			angular.forEach($rootScope.tabList,function(item){
				item.isActive = false ;
			}) ;
			tab.isActive = true ;
			$location.url(tab.backChainValue[tab.backChainValue.length - 1]) ;
		};
		//关闭当前
		$scope.removeTab = function(index){
			var closeTab = $rootScope.tabList[index] ;
			var activeTab = null ;
			if(closeTab.isActive){
				activeTab = $rootScope.tabList[index-1] ;
				activeTab.isActive = true ;
			}
			$rootScope.tabList.splice(index,1) ;
			//未选中当前页签做关闭时不处理
			if(activeTab){
				$location.url(activeTab.backChainValue[activeTab.backChainValue.length - 1]) ;
			}
		};
		//关闭其他页签
		$scope.removeOtherTab = function(tab) {
			$rootScope.tabList.splice(1,$rootScope.tabList.length-1);
			$rootScope.tabList.push(tab);
			if(tab.isActive){
				return ;
			}
			tab.isActive = true ;
			//从页签中取出所有
			$location.url(tab.backChainValue[tab.backChainValue.length - 1]) ;
		};
		$scope.removeAllTab = function() {
			$rootScope.tabList.splice(1,$rootScope.tabList.length-1) ;
			var indexTab = $rootScope.tabList[0] ;
			indexTab.isActive = true ;
			$location.url(indexTab.backChainValue[indexTab.backChainValue.length - 1]) ;
		};
		//如果页签是空的，将首页添加进去
		if($rootScope.tabList.length <= 0){
			$scope.addTab({
				id : 'index',
				text : '首页' ,
				url : '/index',
				close : false
			}) ;
        }
        //获取当前激活的标签
		$rootScope.getActiveTab = function() {
			var activeTab = {text : '首页'} ;
			angular.forEach($rootScope.tabList,function(tab){
				if(tab.isActive){
					activeTab = tab ;
				}
			}) ;
			return activeTab ;
		};
		//获取当前位置
		$rootScope.getCurrentLoaction = function(text) {
			var currentTab = $rootScope.getActiveTab() ;
			if(!$rootScope.menuList || $rootScope.menuList.length <= 0){
				return '' ;
			}
			var parentText = '' ;
			var currentTab = $rootScope.getActiveTab() ;
			var getChildText = function (menu) {
				if(!menu){
					return '' ;
				}
				var childText = '' ;
				angular.forEach(menu.menu,function(item){
					//如果已查找到子菜单，则不继续迭代
					if(childText){
						return ;
					}
					//如果还有子菜单，则继续递归
					if(item.menu && item.menu.length > 0){
						//获取子菜单文本
						childText = getChildText(item) ;
						//如果子菜单文本是有值的，代表当前菜单是被激活的页签的父级菜单，拼上自己的文本
						if(childText){
							childText = item.text + ' > ' + childText ;
						}
					}else{//如果是根菜单，则判断与当前页签是否同一个，如果是的话返回当前菜单名称
						if(menu && item.id == currentTab.id){
							childText = item.text ;
						}
					}
				}) ;
				return childText ;
			};
			angular.forEach($rootScope.menuList,function(item){
				var childText = getChildText(item) ;
				if(childText){
					parentText = item.text + ' > ' + childText ;
				}
			});
			var currentLoaction = '<i class="position_icon"></i>当前位置：' + parentText ;
			if(text){
				currentLoaction += ' > ';
				currentLoaction += text ;
			}
			if(parent){
				currentLoaction = currentLoaction ;
			}
			return currentLoaction ;
		};
	});
	webApp.controller('menuCtrl',  function($rootScope,$scope,$state,jfRest,$timeout,$window) {
		$scope.left=function(index){
			$scope.nub=(-140)*(index);
			return {
				"left" : $scope.nub+'px'
			}
		};
		// if(!Tansun.cache.get('dict')){
		// 	jfRest.request("dict","list",{}).then(function(data) {
		// 		Tansun.cache.put('dict',data.data.data);
		// 	});
		// }
		jfRest.register({menu : {
			query : '/json/menu.json'
		}}) ;
		jfRest.request('menu','query',{}).then(function(data) {
			if (data.status == 200) {
				$rootScope.menuList=data.data;
				$timeout(function(){
					angular.element('.drop-menu-effect').each(function(){
			            var thiz = angular.element(this);
			            var theMenu = thiz.find(".submenu");
			            var tarHeight = theMenu.height();
			            theMenu.css({height:0});
			            thiz.hover(
				            function(){
				            	angular.element(this).addClass("hover_menu");
					            theMenu.stop().show().animate({height:tarHeight},400);
				            },
				            function(){
				            	angular.element(this).removeClass("hover_menu");
					            theMenu.stop().animate({height:0},400,function(){
					            	angular.element(this).css({display:"none"});
					            });
				            }
			            );
			        });
					var webMenu = angular.element('.web_menu') ;
					angular.element($window).on("scroll", function() {
						var scrolTop = angular.element(document).scrollTop() ;
						var scrollTop = webMenu[0].scrollTop || scrolTop;
						if(scrollTop <= webMenu[0].offsetTop){
							webMenu.css({position : 'relative'}) ;
						} else {
							webMenu.css({position : 'fixed'}) ;
						}
			        });
				});
			}
		});
	});
	webApp.controller('parentCtrl',  function($stateParams,$scope, $location, jfRest, $http, jfGlobal, $rootScope, jfLayer,$timeout) {
		$scope.commonData={};
		$scope.tabAuthObj = {}; //保存子页面页签权限对象
		$scope.pageNum = '1'; //默认显示第一个页签基础信息
		var shadeHtml='<div class="maskshade"></div>';//遮罩层样式
		$scope.onNavChange = function(nav){
			if($scope.parentNav.mode == 'scroll'){
				if($stateParams.pageView=="view"){//表示页面只能查看
					return true;
				}
				if(!nav.valiParam){
					//没有设置valiParam属性机表示默认可编辑
					angular.element('#' + nav.id).find(".maskshade").remove();
					return true ;
				}
				var params = nav.valiParam.split(':')[0] || '';
				var id = params.split("&")[0];
				var bsnId = params.split("&")[1];
				if ($scope.tabAuthObj && $scope.tabAuthObj[id]) {
					if(!$scope.queryParam){
						$scope.queryParam = {};
					}
					if(bsnId && $scope.tabAuthObj[bsnId]){
						$scope.tblBlId = $scope.tabAuthObj[bsnId]; //必须字段传入，查询文档
					}
					angular.element('#' + nav.id).find(".maskshade").remove();
				} else {
					//遮罩样式步不存在是添加，已存在则不处理
					if(angular.element('#' + nav.id).find(".maskshade").length<=0){
						angular.element('#' + nav.id).append(shadeHtml);
					}
				}
				return true ;
			}else{
				if(!nav.valiParam){
					return true ;
				}
				var params = nav.valiParam.split(':')[0] || '';
				var message = nav.valiParam.split(':')[1] || '请先填写基本信息' ;
				var id = params.split("&")[0];
				var bsnId = params.split("&")[1];
				if ($scope.tabAuthObj && $scope.tabAuthObj[id]) {
					if(!$scope.queryParam){
						$scope.queryParam = {};
					}
					if(bsnId && $scope.tabAuthObj[bsnId]){
						$scope.tblBlId = $scope.tabAuthObj[bsnId]; //必须字段传入，查询文档
					}
					return true ;
				} else {
					jfLayer.alert(message);
					return false;
				}
			}
		};
		$scope.parentNav = {
			mode : 'scroll'
		} ;
		//页面引入后做遮罩处理
		$scope.$on('$includeContentLoaded',function(event){
			$.each($scope.parentNav.navs, function(index,nav){
				//遮罩
				if(angular.element('#' + nav.id).find(".maskshade").length<=0){
					angular.element('#' + nav.id).append(shadeHtml);
					angular.element('#' + nav.id).addClass('section');//控制遮罩的大小在指定div里面
					angular.element('#' + nav.id).addClass('maskbox');//控制遮罩的大小在指定div里面
				}
				if($stateParams.pageView=="view"){//表示页面只能查看
					return true;
				}
				if(!nav.valiParam){
					//没有设置valiParam属性机表示默认可编辑
					angular.element('#' + nav.id).find(".maskshade").remove();
					return true ;
				}
				var params = nav.valiParam.split(':')[0] || '';
				var id = params.split("&")[0];
				if ($scope.tabAuthObj && $scope.tabAuthObj[id]) {
					angular.element('#' + nav.id).find(".maskshade").remove();
				} else {
					//遮罩样式步不存在是添加，已存在则不处理
					if(angular.element('#' + nav.id).find(".maskshade").length<=0){
						angular.element('#' + nav.id).append(shadeHtml);
					}
				}
		    });
		});
		$scope.$on('to-parent', function (event, data) {
			$scope.tabAuthObj = data;
			$scope.commonData = data;
        });
		//根据页签下标获取对应的scope(下标从0开始算)var scope=$scope.getScope(1);//1代表第二个页签
		$scope.getScope = function(i) {
			if(i){
				var i=parseInt(i);
				var nav=$scope.parentNav.navs[i];
				if(nav){
					var element = angular.element('#' +nav.id).find('div[ng-controller]');
					var scope = element.scope();
					return scope;
				}
			}
		};
		$scope.toParent = function(data) {
			$scope.tabAuthObj = data;
			$scope.commonData = data;
		};
		$scope.showPageManager = [];
		$scope.$on('to-parent-pages', function (event, data) {
			$scope.showPageManager = data;
        });
		$scope.toParentPages = function(data) {
			$scope.showPageManager = data;
		};
		$scope.showTab = function (tab, addNavRule) {
			return addNavRule ? $scope.showPageManager.indexOf(tab) > -1 : true;
		}
	});
	 webApp.controller('docAtchListCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$timeout) {
		 	$scope.queryParam = {
	 			mdlId : $scope.mdlId,
	 			tblBlId : $scope.tblBlId
		 	};
		 	$scope.$download = function (tableName) {
				if (!$rootScope.$valiCheck(tableName,'radio')) {
					return;
				}
				$scope.doc = {};
				$scope.doc.fileId = $rootScope.getCheckItem(tableName).fileId;
				jfRest.request('file','get', Tansun.param($scope.doc)).then(function(data) {
					if (data.status == 200) {
						var path = data.data.fileRte;
						if(path){
							var fileServer = jfGlobal.config["uploader.file.server"];
							var fileDownload = jfGlobal.config["uploader.file.download"];
							window.open(fileServer + fileDownload + path);
						}
					}else{
						jfLayer.alert("下载失败");
					}
				});
	        };
	        $scope.back = function() {
	        	history.back();
	        }
	    });
	//上传附件对话框
    webApp.controller('docAtchCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$validation,$parse,$timeout) {
        //确认选择
        $scope.confirm = function () {
        	//手动校验
        	$validation.validate($parse('atchForm')($scope)).success(function() {
	        	if(!$scope.atch){
	        		$scope.atch = {};
	        	}
	        	var formData = [];
	        	if($scope.atch.atchInf && $scope.atch.atchInf.length > 0){
	        		angular.forEach(angular.fromJson($scope.atch.atchInf), function(data){
	        			var atchInf = data;
	        			var params = {
        					mdlId : $scope.mdlId,
        					tblBlId : $scope.tblBlId,
        					fileNm : atchInf.originalFilename,
        					fileExpdNm : atchInf.contentType,
        					fileSize : atchInf.size,
        					fileRte : angular.fromJson(atchInf.savePath).file,
        					atchNm : atchInf.originalFilename
	        			};
	        			if($scope.$$childTail.atchIf){
	        				params.fileTpCd = $scope.$$childTail.atchIf.fileTpCd;
	    	        	}
	        			formData.push(params);
	        	   	});
	        		$scope.saveData = {
	        			atchList : angular.toJson(formData)
	        		}
	        	}
	        	jfRest.request('file','save', Tansun.param($scope.saveData)).then(function(data) {
					if (data.status == 200) {
						jfLayer.success(data.description,function(){
							$scope.$parent.search();
//							$rootScope.clearChecked();//在弹出框保存后，清除选中的记录
							jfLayer.closeAll();
						});
					} else {
						jfLayer.fail(data.description);
					}
				});
            });
        };
        $scope.uploadAtch = {
            // 允许上传的文件后缀
            extensions: "bmp,jpg,jpeg,png,doc,docx,xlsx,xls,pdf,rar,zip,tar",
            // 单个文件大小，单位MB，不传默认5MB
            fileSize: 5,
            // 可上传2个文件,不传默认5个
            fileCount: 999,
            // 文件所属APP
            app: "scf-pc",
            // 文件所属模块
            module: "doc",
            userSource:"user.query"
        };
    });
    Tansun.directive('moreclick',function(){
    	return {
    		restrict: 'A',
			scope: false,//独立作用域，防止污染父级作用域
	        link: function (scope, element, attrs, ngModel) {
	        	var show = false ;
	        	element.click(function(event) {
	        		show = !show ;
	        		if(show){
	        			element.parents('.search_mian').find('.search_width').show() ;
	        			element.find('i').html('&#xe619;');
	        		}else{
	        			element.parents('.search_mian').find('.search_width').hide() ;
	        			element.find('i').html('&#xe61a;');
	        		}
				}) ;
	        }
    	}
    }) ;
    webApp.controller('adminChangeCtrl',  function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$stateParams,jfLayer,$compile,$validation,$parse,$timeout) {
    	var request = jfRest.request("session","get",{}) ;
 		request.then(function(data) {
 			//设置全局用户信息，只需要设置一次即可
 			$scope.setUser(data.data);
 			//获取全局当前登录用户信息
 			$scope.loginUser=$scope.getUser();
			$scope.roleList=$scope.getUser().roleInfList;
//			$scope.orgList=data.data.instInfList;
			$scope.deptList=$scope.getUser().deptInfList;
 		});
		//修改密码
		$scope.updatePW = function(event) {
			$scope.user={};
			$scope.user.id=$scope.loginUser.id;
			$scope.modal('/template/admin_pw.html',{},{title :'修改密码',buttons : ['提交','取消'],size : ['450px','300px'],callbacks : [$scope.savePW]});
		};
		$scope.savePW=function(){
			if(!$scope.user.password){
				jfLayer.fail("原密码不能为空，请重新输入！");
				return false;
			}
			if(!$scope.user.newPswd){
				jfLayer.fail("新密码不能为空，请重新输入！");
				return false;
			}
			if($scope.user.newPswd!==$scope.user.renewPswd){
				jfLayer.fail("两次密码输入不一致，请重新输入！");
				return false;
			}
			jfRest.request('sysUser1','updatePswd',Tansun.param($scope.user)).then(function(data) {
				if (data.status == 200) {
					jfLayer.success(data.description,function(index){
						jfLayer.closeAll();
					});
				} else {
					jfLayer.fail(data.description);
				}
			});
		};
		//弹出角色列表
		$scope.changeRole = function(event) {
			$scope.modal('/template/admin_role.html',{},{title :'角色切换',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//弹出机构列表
		$scope.changeOrg = function(event) {
			var param={};
			jfRest.request('admin', 'query', param).then(function(data){
				if(data.status == 200){
					$scope.orgList=data.data;
				}
				else{
					jfLayer.fail(data.description);
				}
			});
			$scope.modal('/template/admin_org.html',$scope.orgList,{title :'机构切换',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//弹出部门列表
		$scope.changeDept = function(event) {
			$scope.modal('/template/admin_dept.html',{},{title :'部门切换',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//切换
		$scope.changer = function(param,type) {
			param.type=type;
			var param = Tansun.param(param) ;
			jfRest.request('admin', 'changer', param).then(function(data){
				if(data.status == 200){
					var url=window.location.origin + ctx;
					window.location=url;
				}else{
					jfLayer.fail(data.description);
				}
			});
		}
	});
	//快捷键
	webApp.controller('shortMenuCtrl',  function($scope,$window,$rootScope,jfRest,$http,jfGlobal,$state,$stateParams,jfLayer,$compile) {
		$scope.queryList();
		//查询所有快捷菜单
		$scope.queryList=function(){
			jfRest.request('quickMenu','query', Tansun.param({})).then(function(data){
				if(data.status == 200){
					$scope.quickMenuList=data.data.grid;
				}
			});
		};
		//添加
		$scope.clickAddMenu=function(){
			$scope.modal('/template/quick_,menu.html',{},{title :'添加快捷键',buttons : ['提交','取消'],size : ['500px','300px']});
		};
		//打开菜单
		$scope.openMenu=function(menu){
			$scope.$turn(menu.link,menu.menuName);
		};
		//菜单树点击事件
		$scope.nodeClick = function(treeNode) {
			if(treeNode.menuLevel!=2) return null;
			jfRest.request('quickMenu','save', Tansun.param({'menuCode' : treeNode.id})).then(function(data){
				if(data.status == 200){
					$scope.menuSearch();
					$scope.queryList();
				}else{
					jfLayer.fail(data.description);
				}
			});
		};
		//删除菜单
		$scope.delMenu = function(id) {
			jfRest.request('quickMenu','delete', Tansun.param({'id' : id})).then(function(data){
				if(data.status == 200){
					$scope.menuSearch();
				}else{
					jfLayer.fail(data.description);
				}
			});
		}
	});
    Tansun.controller('chartsCtrl',function($scope){
		$scope.charts = {
			 data : [{date : '融资到期预警',value : 10, user : '融资到期预警'},
					 {date : '预合同到期预警',value : 15, user : '预合同到期预警'},
					 {date : '池模式融资水位预警',value : 11, user : '池模式融资水位预警'},
					 {date : '融资到期预警',value : 5, user : '融资到期预警'},
					 {date : '融资到期预警',value : 12, user : '融资到期预警'},
					 {date : '预合同到期预警',value : 7, user : '预合同到期预警'},
					 {date : '预合同到期预警',value : 4, user : '预合同到期预警'},
					 {date : '池模式融资水位预警',value : 18, user : '池模式融资水位预警'}],
			 type : 'pie', //折线图
			 label : 'date', //月份为X轴
			 value : 'value', //value为数值
			 group : 'user', //以用户为统计角度
			 title : '' //标题
		}
	}) ;
    webApp.controller('docAtchListCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$timeout) {
		 $scope.fileList = {
					checkType : 'radio', //当为checkbox时为多选
					params : {}, //表格查询时的参数信息
					paging : true ,//默认true,是否分页
					resource : 'file.query' ,//列表的资源
					callback : function() { //表格查询后的回调函数
					}
			  };
			 $scope.fileList.params = {
	 	 			mdlId : $scope.mdlId,
	 	 			tblBlId : $scope.tblBlId
	 		};
			 if($scope.mdlId&&!$scope.tblBlId){
				 $scope.fileList.autoQuery=false;
				 $scope.fileList.fileSearch=false;
			 }
		 	  $scope.$watch("tblBlId",function(newValue,oldValue){
		 		  if(newValue){
				 		 $scope.fileList.autoQuery=true;
		 		  }
	            if(oldValue == newValue)
	                return ;
	            $scope.fileList.params = {
	    	 			mdlId : $scope.mdlId,
	    	 			tblBlId : $scope.tblBlId
	    		};
	            $timeout(function(){
	            	$scope.fileList.search();
	            });
	        });
		 	$scope.download = function () {
				if (!$scope.fileList.validCheck()) {
					return;
				}
				$scope.doc = {};
				$scope.doc.fileId = $scope.fileList.checkedList().fileId;
				jfRest.request('file','get', Tansun.param($scope.doc)).then(function(data) {
					if (data.status == 200) {
						var path = data.data.fileRte;
						if(path){
							var fileServer = jfGlobal.config["uploader.file.server"];
							var fileDownload = jfGlobal.config["uploader.file.download"];
							var realName="/"+data.data.fileNm;
							window.open(fileServer + fileDownload + path+realName);
						}
					}else{
						jfLayer.alert("下载失败");
					}
				});
	        };
	        $scope.onlinePreview = function () {
				window.open($scope.global.uploader.filePreviewPath+$scope.fileList.checkedList().fileRte);
	        };
	        //确认选择
	        $scope.confirm = function (result) {
	        	result.scope.saveFile(result);
	        };
	        $scope.back = function() {
	        	history.back();
	        }
	    });
	//上传附件对话框
   webApp.controller('docAtchCtrl', function ($scope,jfGlobal, jfRest, jfLayer,$rootScope,$validation,$parse) {
   		//确认选择
	        $scope.saveFile = function (result) {
	        	if(!result.scope.atch){
	        		result.scope.atch = {};
	        	}
	        	var formData = [];
	        	if(result.scope.atch.atchInf && result.scope.atch.atchInf.length > 0){
	        		angular.forEach(angular.fromJson(result.scope.atch.atchInf), function(data){
	        			var atchInf = data;
	        			var params = {
	    					mdlId : $scope.mdlId,
	    					tblBlId : $scope.tblBlId,
	    					fileNm : atchInf.originalFilename,
	    					fileExpdNm : atchInf.contentType,
	    					fileSize : atchInf.size,
	    					fileRte : angular.fromJson(atchInf.savePath).file,
	    					atchNm : atchInf.originalFilename
	        			};
	    				if(result.scope.atchIf){
	    				params.fileTpCd = result.scope.atchIf.fileTpCd;
		        		}
	        			formData.push(params);
	        	   	});
	        		$scope.saveData = {
	        			atchList : angular.toJson(formData)
	        		}
	        	}
	        	jfRest.request('file','save', Tansun.param($scope.saveData)).then(function(data) {
					if (data.status == 200) {
						jfLayer.success("保存成功",function(){
							$scope.fileList.search();
							result.cancel();
						});
					} else {
						jfLayer.fail(data.description);
					}
				});
	        };
	       $scope.uploadAtch = {
           // 允许上传的文件后缀
           extensions: "bmp,jpg,jpeg,png,doc,docx,xlsx,xls,pdf,rar,zip,tar",
           // 单个文件大小，单位MB，不传默认5MB
           fileSize: 5,
           // 可上传2个文件,不传默认5个
           fileCount: 999,
           // 文件所属APP
           app: "admin-pc",
           // 文件所属模块
           module: "doc",
           userSource:"user.query"
       };
   });
});
