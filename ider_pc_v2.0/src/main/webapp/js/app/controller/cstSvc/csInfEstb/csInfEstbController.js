'use strict';
define(function(require) {
	var webApp = require('app');
	// 客户信息建立
	webApp.controller('csInfEstbCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location,lodinDataService,$translate,T,$translatePartialLoader) {
		$scope.lang = sessionStorage.getItem(sessionStorage.getItem("userName")+"_lang");
		$translate.use($scope.lang);
		$translatePartialLoader.addPart('pages/cstSvc/csInfEstb/i18n_csInfEstb');
		$translate.refresh();
    	$scope.menuName = lodinDataService.getObject("menuName");//菜单名
    	console.log( lodinDataService.getObject("menuName"));
		//		运营模式
		 $scope.institutionIdArr ={ 
			        type:"dynamic", 
			        param:{},//默认查询条件 
			        text:"organName", //下拉框显示内容，根据需要修改字段名称 
			        value:"organNo",  //下拉框对应文本的值，根据需要修改字段名称 
			        resource:"coreOrgan.queryCoreOrgan",//数据源调用的action 
			        callback: function(data){
			        	
			        }
		};
    	//联动验证
		var form = layui.form;
		form.on('select(getIdType)',function(data){
			$scope.csInf.idNumber ='';
			if($scope.csInf.idType=='2' || $scope.csInf.idType=='3' ){
				$scope.showHkgMark = true;
			}else {
				$scope.showHkgMark = false;
			}
			if(data.value == "1"){//身份证
				$("#idNumberInp").attr("validator","id_idcard");
			}else if(data.value == "2"){//港澳居民来往内地通行证
				$("#idNumberInp").attr("validator","id_isHKCard");
			}else if(data.value == "3"){//台湾居民来往内地通行证
				$("#idNumberInp").attr("validator","id_isTWCard");
			}else if(data.value == "4"){//中国护照
				$("#idNumberInp").attr("validator","id_passport");
			}else if(data.value == "5"){//外国护照passport
				$("#idNumberInp").attr("validator","id_passport");
			}else if(data.value == "6"){//外国人永久居留证
				$("#idNumberInp").attr("validator","id_isPermanentReside");
            }
            if($scope.csInf.idType=='2' || $scope.csInf.idType=='3'){
				$scope.showHkgMark = true;												
			}else{
				$scope.showHkgMark = false;
			}
		});
		//港澳台通行证
		form.on('select(getIdType2)',function(data){
			$("#fastBuildCardTwo_idNumber").val("");
			$scope.cstBaseInf.idNumber = '';
			$scope.cstQueryObj.idType = $scope.cstBaseInf.idType;
			if($scope.cstQueryObj.idType=='2' || $scope.cstQueryObj.idType=='3' ){
				$scope.showHkgMark = true;												
			}else{
				$scope.showHkgMark = false;
			}
		});
        //客户基本信息
		$scope.csInf = {
				businessType : '0',
        };
		$scope.showCustomerNo = false;//隐藏客户号
        //客户地址
        $scope.cstAddrList = [];
        $scope.cstAddrObj = {};
        //备注
        $scope.cstRmrkList = [];
        $scope.cstRmrkObj = {};
        //定价标签
        $scope.cstPrcList = [];
        $scope.cstPrcObj = {};
        //自定义下拉框
		/*$scope.ResidenceeArray = [{name : '自购' ,id : '1'},{name : '借住' ,id : '2'},{name : '租用' ,id : '3'}];//住宅性质
        $scope.certificateTypeArray = [{name : '身份证' ,id : '1'}];//证件类型
        $scope.jobLevelCodeArray = [{name : '高' ,id : '1'},{name : '中' ,id : '2'},{name : '初' ,id : '3'}];//职称级别
        $scope.guarantorLogoArray = [{name : '无担保' ,id : '1'},{name : '已存在' ,id : '2'},{name : '有潜在' ,id : '3'}];//担保人标识
        $scope.maritalStatusArray = [{name : '未婚' ,id : '1'},{name : '已婚' ,id : '2'},{name : '离异' ,id : '3'},{name : '未知' ,id : '4'}];//婚姻
        $scope.genderArray = [{name : '女' ,id : '1'},{name : '男' ,id : '2'},{name : '未知' ,id : '3'}];//性别
        $scope.typeArray = [{name : '邮寄地址' ,id : '1'},{name : '家庭地址' ,id : '2'},{name : '单位地址' ,id : '3'}];//地址场景
        $scope.actionCode = [{name : '1' ,id : '1'},{name : '2' ,id : '2'},{name : '3' ,id : '3'},{name : '4' ,id : '4'}];//性别
        $scope.ccy = [{name : '人民币', id : 'CNY'}];
		$scope.fullPenaltySign = [ {name : '全额罚息', id : 'Y'}, {name : '非全额罚息',id : 'N'} ];
		$scope.personalCompanyType = [ {name : '个人客户', id : '1'}, {name : '公司客户',id : '2'} ];
		$scope.purchRemittSign = [ {name : '无购汇还款', id : 'N'}, {name : '购汇还款',id : 'Y'} ];
		$scope.achFlag = [ {name : '无约定扣款', id : '0'}, {name : '账单余额',id : '1'}, {name : '最低还款额',id : '2'} ];//约定扣款方式
		$scope.ddType = [ {name : '本行', id : '0'}, {name : '他行',id : '1'} ];//本行他行标识
		$scope.paymentMarkArray = [ {name : '统一还款', id : '1'}, {name : '单独还款',id : '2'} ];//还款选项*/		
        $scope.ResidenceeArray = [{name : T.T('KHJ3300003') ,id : '1'},{name : T.T('KHJ3300004')  ,id : '2'},{name : T.T('KHJ3300005') ,id : '3'}];//住宅性质
        $scope.certificateTypeArray = [ {name : T.T('F00113'),id : '1'},//身份证
                                		{name : T.T('F00114') ,id : '2'} ,//港澳居民来往内地通行证
                                		{name : T.T('F00115') ,id : '3'} ,//台湾居民来往内地通行证
                                		{name : T.T('F00116') ,id : '4'} ,//中国护照
                                		{name : T.T('F00117') ,id : '5'} ,//外国护照
                                		{name : T.T('F00118') ,id : '6'} ,//外国人永久居留证
                                		{name : T.T('F00119'),id : '0'}  ];	//其他
        $scope.jobLevelCodeArray = [{name : T.T('KHJ3300011')  ,id : '1'},{name :T.T('KHJ3300012') ,id : '2'},{name : T.T('KHJ3300013') ,id : '3'}];//职称级别
        $scope.guarantorLogoArray = [{name :  T.T('KHJ3300018') ,id : '1'},{name :  T.T('KHJ3300019') ,id : '2'},{name :  T.T('KHJ3300020') ,id : '3'}];//担保人标识
        $scope.maritalStatusArray = [{name :  T.T('KHJ3300025') ,id : '1'},{name : T.T('KHJ3300026') ,id : '2'},{name : T.T('KHJ3300027') ,id : '3'},{name : T.T('KHJ3300028') ,id : '4'}];//婚姻
        $scope.genderArray = [{name : T.T('KHJ3300033') ,id : '1'},{name : T.T('KHJ3300034') ,id : '2'},{name : T.T('KHJ3300028') ,id : '3'}];//性别
        $scope.typeArray = [{name : T.T('KHJ3300038') ,id : '1'},{name : T.T('KHJ3300039') ,id : '2'},{name : T.T('KHJ3300040') ,id : '3'}];//地址场景
        $scope.actionCode = [{name : '1' ,id : '1'},{name : '2' ,id : '2'},{name : '3' ,id : '3'},{name : '4' ,id : '4'}];//性别
        $scope.ccy = [{name :T.T('KHJ3300041') , id : 'CNY'}];
		$scope.fullPenaltySign = [ {name : T.T('KHJ3300045'), id : 'Y'}, {name : T.T('KHJ3300046'),id : 'N'} ];
		$scope.personalCompanyType = [ {name : T.T('KHJ3300051'), id : '1'}, {name : T.T('KHJ3300052'),id : '2'} ];
		$scope.purchRemittSign = [ {name : T.T('KHJ3300070'), id : 'N'}, {name : T.T('KHJ3300069'),id : 'Y'} ];
		$scope.achFlag = [ {name :  T.T('KHJ3300057'), id : '0'}, {name :  T.T('KHJ3300058'),id : '1'}, {name :  T.T('KHJ3300059'),id : '2'} ];//约定扣款方式
		$scope.ddType = [ {name : T.T('KHJ3300064'), id : '0'}, {name : T.T('KHJ3300065'),id : '1'} ];//本行他行标识
		$scope.paymentMarkArray = [ {name : T.T('KHJ3300075'), id : '1'}, {name : T.T('KHJ3300076'),id : '2'} ];//还款选项
		//账单日
		$scope.statementDateArr =
									[ {name : '01', id : '01'}, {name : '02',id : '02'},{name : '03', id : '03'}, {name : '04',id : '04'},{name : '05',id : '05'},
		                            {name : '06', id : '06'}, {name : '07',id : '07'},{name : '08', id : '08'}, {name : '09',id : '09'},{name : '10',id : '10'},
		                            {name : '11', id : '11'}, {name : '12',id : '12'},{name : '13', id : '13'}, {name : '14',id : '14'},{name : '15',id : '15'},
		                            {name : '16', id : '16'}, {name : '17',id : '17'},{name : '18', id : '18'}, {name : '19',id : '19'},{name : '20',id : '20'},
		                            {name : '21', id : '21'}, {name : '22',id : '22'},{name : '23', id : '23'}, {name : '24',id : '24'},{name : '25',id : '25'},
		                            {name : '26', id : '26'}, {name : '27',id : '27'},{name : '28', id : '28'}, {name : '29',id : '29'},{name : '30',id : '30'},
		                            {name : '31',id : '31'}];
       $scope.showOtherInfo = true;//基本信息保存
		$scope.showNewAdrInfo= true;//客户地址信息新增 默认显示新增地址
		$scope.showCstRmrkInfo = false;//客户备注信息新增
        $scope.showCstPrcgLblInfo = false;//客户定价标签信息新增
        //客户快捷，建立附属卡
        $scope.supplyCardInf = lodinDataService.getObject('supplyCardInf');
        if(sessionStorage.getItem("fastBuildFlag") == '1'){//由客户快捷进入页面，建立附属卡
        	/*$scope.csInf.idType = sessionStorage.getItem("subCustIdType");
        	$scope.csInf.idNumber = sessionStorage.getItem("subCustIdNumber");*/
        	$scope.csInf.idType =  $scope.supplyCardInf.idType;
        	$scope.csInf.idNumber =  $scope.supplyCardInf.idNumber;
        	if($scope.csInf.idType=='2' || $scope.csInf.idType=='3' ){
				$scope.showHkgMark = true;												
			}else{
				$scope.showHkgMark = false;
			}
        }
        // 客户信息 保存
		$scope.saveCstInf = function() {
            //$scope.showAdrDiv = true;//显示地址信息模块
            $scope.showOtherInfo = true;//基本信息保存
            $scope.csInf = $scope.csInf; //前端暂存基本信息
        };
        //客户地址信息 保存
         $scope.adrlInfTable = [];
         $scope.adrlInfTableInfoObj = {};
        $scope.saveNewAdrInfo = function() {
			var adrlInfTableInfoU = {};
			adrlInfTableInfoU.type = $scope.adrlInfTableInfoObj.type;
			adrlInfTableInfoU.contactAddress = $scope.adrlInfTableInfoObj.contactAddress;
			adrlInfTableInfoU.contactPostCode = $scope.adrlInfTableInfoObj.contactPostCode;
			adrlInfTableInfoU.contactMobilePhone = $scope.adrlInfTableInfoObj.contactMobilePhone;
			adrlInfTableInfoU.city = $scope.adrlInfTableInfoObj.city;
			$scope.adrlInfTable.push(adrlInfTableInfoU);
			$scope.adrlInfTableInfoObj = {};
			$scope.showNewAdrInfo = false;
        };
           //客户备注信息模块 保存
        	$scope.cstRmrkInfoTable = [];
        	$scope.cstRmrkInfoObj = {};
           $scope.saveCstRmk = function() {
        	var cstRmrkInfoObjU = {};
        	cstRmrkInfoObjU.remarkInfo = $scope.cstRmrkInfoObj.remarkInfo;
        	cstRmrkInfoObjU.lastUpdateUserid = $scope.cstRmrkInfoObj.lastUpdateUserid;
        	cstRmrkInfoObjU.createRemarksTime = $scope.cstRmrkInfoObj.createRemarksTime;
   			$scope.cstRmrkInfoTable.push(cstRmrkInfoObjU);
   			$scope.cstRmrkInfoObj = {};
   			$scope.showCstRmrkInfo = false;
        };
        //客户定价信息模块 保存
          $scope.cstPrcgLblTable = [];
       	$scope.cstPrcgLblInfoObj = {};
        $scope.saveCstPrice = function() {
        	var cstPrcgLblInfObjU = {};
        	cstPrcgLblInfObjU.productLineCode = $scope.cstPrcgLblInfoObj.productLineCode;
        	cstPrcgLblInfObjU.pricingObject = $scope.cstPrcgLblInfoObj.pricingObject;
        	cstPrcgLblInfObjU.pricingObjectCode = $scope.cstPrcgLblInfoObj.pricingObjectCode;
        	cstPrcgLblInfObjU.pricingTag = $scope.cstPrcgLblInfoObj.pricingTag;
        	cstPrcgLblInfObjU.custTagEffectiveDate = $scope.cstPrcgLblInfoObj.custTagEffectiveDate;
        	cstPrcgLblInfObjU.custTagExpirationDate = $scope.cstPrcgLblInfoObj.custTagExpirationDate;
   			$scope.cstPrcgLblTable.push(cstPrcgLblInfObjU);
   			$scope.cstPrcgLblInfoObj = {};
   			$scope.showCstPrcgLblInfo = false;
        };
        //提交
        $scope.csInfParams = {};
        $scope.submitInf = function() {
            if($scope.adrlInfTable.length > 0){
            	$scope.csInfParams.coreCoreCustomerAddrs = $scope.adrlInfTable;//地址信息list
                if( $scope.cstRmrkInfoTable  && $scope.cstRmrkInfoTable.length >  0){
                	$scope.csInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;//备注信息list
                }else {
                	$scope.cstRmrkInfoTable = null;
                	$scope.csInfParams.coreCustomerRemarkss = $scope.cstRmrkInfoTable;
                }
                //验证港澳通行证信息
                if($scope.csInf.idType=='2' || $scope.csInf.idType=='3' ){
                	if($scope.csInf.idNumberHmt=='' || $scope.csInf.idNumberHmt==null || $scope.csInf.idNumberHmt==undefined || $scope.csInf.idNumberHmt.length <18){
                		jfLayer.alert('请输入合法港澳台居民居住证');//'请核对证件号码'
    					return;
                    }
                }
              /*  if(  $scope.cstPrcgLblTable && $scope.cstPrcgLblTable.length >  0){
                	$scope.csInfParams.coreCustomerBusinessTypes = $scope.cstPrcgLblTable;//定价标签信息list
                }else {
                	$scope.cstPrcgLblTable = null;
                	$scope.csInfParams.coreCustomerBusinessTypes = $scope.cstPrcgLblTable;
				}*/
                $scope.csInfParams = Object.assign($scope.csInfParams , $scope.csInf);
                $scope.csInfParams.operatorId=  sessionStorage.getItem("userName");
                console.log($scope.csInfParams);
                jfRest.request('cstInfBuild', 'save', $scope.csInfParams)
    		    .then(function(data) {
                    if (data.returnCode == '000000') {
                    	if(sessionStorage.getItem("fastBuildFlag") == '1'){//快捷制卡建立 附属卡客户信息
                    		sessionStorage.setItem("subCustomerNo",data.returnData.rows[0].customerNo);
                    		sessionStorage.setItem("preCstEstFlag",'1');//跳回快捷申请 标记
                    		//清楚 快捷制卡的缓存信息
                    		sessionStorage.removeItem("fastBuildFlag");//由快捷申请进入客户信息建立的标记
                    		$scope.turn('/cstSvc/fastBuildCardTwo') ;
                    	}else {
                    		$rootScope.customerNo = data.returnData.rows[0].customerNo;//客户号
                            sessionStorage.setItem('customerNo ',$rootScope.customerNo);
                            $scope.csInf.customerNo = data.returnData.rows[0].customerNo;
                            jfLayer.success(T.T('F00032'));//"保存成功"
                    	}
                    }
                });
            }else{
            	 jfLayer.fail(T.T('KHJ3300081'));//地址必输入一条"请至少输入一种地址信息"
            }
        };
		// 地址 新增按钮
		$scope.newAdrBtn = function() {
			//alert(1);
            $scope.showNewAdrInfo = !$scope.showNewAdrInfo;
        };
        // 备注 新增按钮
		$scope.cstRmrkInfoBtn = function() {
            $scope.showCstRmrkInfo = !$scope.showCstRmrkInfo;
        };
        //  客户定价标签信息 新增按钮
		$scope.cstPrcgLblBtn = function() {
            $scope.showCstPrcgLblInfo = !$scope.showCstPrcgLblInfo;
		}
	});
});
