'use strict';
define(function(require, exports, module) {
	var config = {

		//用户管理
		userManage : {
			query : '/betaService/COS.CS.01.0010',
			add:'/betaService/COS.CS.01.0011',
			pass:'/betaService/COS.CS.01.0019',
			update:'/betaService/COS.CS.01.0012',
			updatePsd : '/betaService/COS.CS.01.0020',
			queryUserEvent:'/betaService/COS.IQ.02.0185',  //
			setUserEventList:'/betaService/COS.AD.02.0101',
            getVerifyCode: '/betaService/COS.IQ.01.0001' // 用户登录 获取验证码接口
		},
		//岗位管理
		jobManage : {
			query : '/betaService/COS.CS.01.0007',
			add:'/betaService/COS.CS.01.0008',
			update:'/betaService/COS.CS.01.0009'
		},
		//部门管理
		roleManage : {
			query : '/betaService/COS.CS.01.0004',
			add:'/betaService/COS.CS.01.0005',
			update:'/betaService/COS.CS.01.0006'
		},
		//菜单管理
		menuManage : {
			query : '/betaService/COS.CS.01.0002',
			select: '/betaService/COS.CS.01.0015',
			add:'/betaService/COS.CS.01.0001',
			update:'/betaService/COS.CS.01.0003',
			setEvent: '/betaService/COS.CS.01.0025',
			selEvent: '/betaService/COS.CS.01.0026'
		},
		//设置权限
		accessManage : {
			query : '/betaService/COS.CS.01.0013',
			queryMenuAll : '/betaService/COS.CS.01.0017',
			queryMenu : '/betaService/COS.CS.01.0016',
			addSet: '/betaService/COS.CS.01.0014',
			selAllMenu:'/betaService/COS.CS.01.0029',
			selEvent: '/betaService/COS.CS.01.0030'     //根据菜单和当前登录者查询有权限的事件编号
		},


		//法人查询
		legalPerson : {
			/*query : '/betaService/CRD.CS.01.0021',
			add : '/betaService/CRD.CS.01.0022',
			update : '/betaService/CRD.CS.01.0023',*/
			queryMode: '/betaService/COS.IQ.02.0006',
			queryLegal: '/betaService/COS.IQ.02.0037',

			queryLegalPerson : '/betaService/COS.IQ.02.0130',//运营模式管理法人查询事件号
			addLegalPerson : '/betaService/COS.AD.02.0130',//运营模式管理法人新增事件号
			updateLegalPerson : '/betaService/COS.UP.02.0120',//运营模式管理法人修改事件号
		},

		//批量
		batchMag: {
			reRun: "/cardForSomeBatch/BSS.BH.00.9000", //重跑
			restoreBackup: "/cardForSomeBatch/BSS.BH.00.9010", // 恢复备份
		},
		//系统单元
		systemUnit : {
			save : '/betaService/COS.AD.02.0033' ,
			query: '/betaService/COS.IQ.02.0038' ,
			update: '/betaService/COS.UP.02.0037'
		},
		//参数管理
		paramsManage : {
			save : '/betaService/COS.AD.02.0150' ,//多语言建立
			query: '/betaService/COS.IQ.02.0150' ,// 多语言查询
			update: '/betaService/COS.UP.02.0150',//多语言维护
			deletePa: '/betaService/COS.UP.02.0151'//多语言删除
		},
		//卡号池查询
		cardQuery : {
			query: '/betaService/COS.IQ.02.0160' ,// 多语言查询
		},
		//实时余额平衡查询
		timeBalance : {
			query: '/nonfinanceService/BSS.IQ.01.0119' ,// 查询
		},
	};
	module.exports = config;
});
