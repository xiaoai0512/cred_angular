'use strict';
define(function (require, exports, module) {
    var config = [
        //url:访问路径  templateUrl：页面模板路径 ctrl：controller路径
    	 //事件清单
		['/beta/evLstList', 'beta/evList/evLstList.html', 'beta/evLstListController.js'],
		//活动清单  
		['/beta/avyList', 'beta/avyList/avyList.html', 'beta/avyListController.js'],
		//构建清单
		['/beta/elmList', 'beta/elmList/elmList.html', 'beta/elmListController.js'],
		//元件清单
		['/beta/elementList', 'beta/elementList/elementList.html', 'beta/elementListController.js'],
		//构建配置管理
		['/beta/elmCfgMgt', 'beta/elmCfgMgt/elmCfgMgt.html', 'beta/elmCfgMgtController.js'],
		//序号清单  
		['/beta/serialList', 'beta/serialList/serialList.html', 'beta/serialListController.js'],
		//业务形态
//		['/beta/businessFormEst', 'beta/businessForm/businessFormEst.html', 'beta/businessForm/businessFormEstCtrl.js'],
		['/beta/businessFormQuery', 'beta/businessForm/businessFormQuery.html', 'beta/businessForm/businessFormQueryCtrl.js'],
		//项目类型
		['/beta/projectType', 'beta/projectType/projectTypeList.html', 'beta/projectType/projectTypeListCtrl.js'],
		
		//业务形态排除构件
		['/beta/businessRemoveArtifactEst', 'beta/businessForm/businessRemoveArtifactEst.html', 'beta/businessForm/businessRemoveArtifactEstCtrl.js'],
		['/beta/businessRemoveArtifactQuery', 'beta/businessForm/businessRemoveArtifactQuery.html', 'beta/businessForm/businessRemoveArtifactQueryCtrl.js'],
		
		//运营模式入账币种
		['/beta/operatCurrencyEst', 'beta/operatCurrency/operatCurrencyEst.html', 'beta/operatCurrency/operatCurrencyEstCtrl.js'],
		['/beta/operatCurrencyQuery', 'beta/operatCurrency/operatCurrencyQuery.html', 'beta/operatCurrency/operatCurrencyQueryCtrl.js'],
		
		//法人实体
		['/beta/legalEntityEst', 'beta/legalEntity/legalEntityEst.html', 'beta/legalEntity/legalEntityEstCtrl.js'],
		['/beta/legalEntityQuery', 'beta/legalEntity/legalEntityQuery.html', 'beta/legalEntity/legalEntityQueryCtrl.js'],
		
		//系统单元
		['/beta/systemUnitQuery', 'beta/systemUnit/systemUnitQuery.html', 'beta/systemUnit/systemUnitQueryCtrl.js'],
		
		//假日
		['/beta/holidayEst', 'beta/holiday/holidayEst.html', 'beta/holiday/holidayEstCtrl.js'],
		['/beta/holidayQuery', 'beta/holiday/holidayQuery.html', 'beta/holiday/holidayQueryCtrl.js'],
    ];
    module.exports = config;
});