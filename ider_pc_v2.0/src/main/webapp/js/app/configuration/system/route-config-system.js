'use strict';
define(function (require, exports, module) {
    var config = [
    	
		//用户管理
		['/system/user', 'system/userManage/userList.html', 'system/userManage/userListController.js'],
		//岗位管理
		['/system/job', 'system/jobManage/jobList.html', 'system/jobManage/jobListController.js'],
		//部门管理
		['/system/role', 'system/roleManage/roleList.html', 'system/roleManage/roleListController.js'],
		//菜单管理
		['/system/menu', 'system/menuManage/menuList.html', 'system/menuManage/menuListController.js'],
		//设置权限
		['/system/access', 'system/accessManage/accessList.html', 'system/accessManage/accessListController.js'],
		//系统状态
		['/system/systemFlagList', 'system/systemFlag/systemFlagList.html', 'system/systemFlag/systemFlagListController.js'],
		//['/beta/systemUnitQuery', 'beta/systemUnit/systemUnitQuery.html', 'beta/systemUnit/systemUnitQueryCtrl.js'],
		//运营模式法人管理operateLegalManage
		['/system/operateLegalManage', 'system/operateLegalManage/operateLegalManage.html', 'system/operateLegalManage/operateLegalManageCtrl.js'],
		//上传文件
		['/system/fieldPage', 'system/batchManage/fieldPage.html', 'system/batchManage/fieldPageCtrl.js'],
		//批量异常管理
		['/system/batchAbnormalMag', 'system/batchManage/batchAbnormalMag.html', 'system/batchManage/batchAbnormalMagCtrl.js'],
		//批量调度管理
		['/system/batchDispatchMag', 'system/batchManage/batchDispatchMag.html', 'system/batchManage/batchDispatchMagCtrl.js'],
		
		//参数管理
		['/system/paramsManageList', 'system/paramsManage/paramsManageList.html', 'system/paramsManage/paramsManageListCtrl.js'],
		
		//会计引擎Accounting engine
		['/system/accountEngine', 'system/accountEngine/accountEngine.html', 'system/accountEngine/accountEngineCtrl.js'],
		//卡号池查询
		['/a_operatMode/cardBin/cardPool', 'a_operatMode/cardBin/cardPool.html', 'a_operatMode/cardBin/cardPool.js'],
		//实时余额平衡查询
		['/system/timeBalanceQuery', 'system/timeBalance/timeBalanceQuery.html', 'system/timeBalance/timeBalanceQueryCtrl.js'],
		];
    module.exports = config;
});