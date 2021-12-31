'use strict';
define(function(require) {
	var webApp = require('app');
	// 业务形态实例化
	webApp.controller('businessFormInstCtrl', function($scope, $stateParams, jfRest,
			$http, jfGlobal, $rootScope, jfLayer, $location) {
		$scope.operationMode1 = [ {name : 'A01', id : 'A01'}, {name : 'A02', id : 'A02'} ];//账户组织形式
		$scope.businessNatureArr = [ {name : '贷记', id : 'C'}, {name : '借记',id : 'D'} ];//账户组织形式
		$scope.accountOrgArr = [ {name : '循环', id : 'R'}, {name : '交易',id : 'T'} ];//账户组织形式
		//
		   $scope.busForm ={ 
		           type:"dynamic", 
		           param:{},//默认查询条件 
		           text:"modeName", //下拉框显示内容，根据需要修改字段名称 
		           value:"operationMode",  //下拉框对应文本的值，根据需要修改字段名称 
		           resource:"businessFormInst.queryOpeMode"//数据源调用的action 
		      };
		//选择业务形态构件
		$scope.selAvyList = {
				checkType : 'checkbox', // 当为checkbox时为多选
				params : $scope.queryParam = {
						"pageSize":10,
						"indexNo":0,
						artifactType : "A"
				}, // 表格查询时的参数信息
				paging : true,// 默认true,是否分页
				resource : 'businessFormInst.query',// 列表的资源
				callback : function(data) { // 表格查询后的回调函数
				}
			};
		$scope.treeSelect1 =[];
		// 关联活动
		$scope.saveSelect = function() {
			var isTip = false;						//是否提示
			var tipStr = "";
			if (!$scope.selAvyList.validCheck()) {
				return;
			}
			var items = $scope.selAvyList.checkedList();
			for (var i = 0; i < items.length; i++) {
				var isExist = false;						//是否存在
				for (var k = 0; k < $scope.treeSelect1.length; k++) {
					if (items[i].artifactNo == $scope.treeSelect1[k].artifactNo) {    //判断是否存在
						tipStr = tipStr + items[i].artifactNo + ",";
						isTip = true;
						isExist = true;
						break;
					}
				}
				if(!isExist){
					$scope.treeSelect1.push(items[i]);	
				}
			}
			if(isTip){
				jfLayer.alert("事件编号【" + tipStr.substring(0,tipStr.length-1) + "】已存在，不在添加！");
			}
		};
		// 删除关联活动
		$scope.removeSelect = function(data) {
			var checkId = data;
			$scope.treeSelect1.splice(checkId, 1);
		};
		$scope.saveBusinessTypeRel = function(id) {
			$scope.paramssRel = {
					operationMode : $scope.operationMode,
					list : $scope.treeSelect1,
					businessPattern:id
				};
				$scope.safeApply();
				jfRest.request('businessFormInst', 'saveBusinessTypeRel', $scope.paramssRel)
				.then(function(data) {
						if (data.returnCode == '000000') {
							jfLayer.success('保存成功!');
						}
				});
		};
		// 保存业务形态，关联构件
		$scope.saveBusinessType = function() {
			$scope.paramss = {
					operationMode : $scope.operationMode,
					//artifactList : $scope.relElmAndYPtsList.checkedList(),
					businessPattern:$scope.businessPattern,
					accountOrganizeTyp:$scope.accountOrganizeTyp,
					accountBookKeepingDirec:$scope.accountBookKeepingDirec,
					description:$scope.description
				};
				$scope.safeApply();
				jfRest.request('businessFormInst', 'saveBusinessType', $scope.paramss)
				.then(function(data) {
						if (data.returnCode == '000000') {
							//插入关系表，调用COS.AD.02.0019
							var id = JSON.parse(data.returnData).id;
							$scope.saveBusinessTypeRel(id);
						}
				});
		}
	});
});
