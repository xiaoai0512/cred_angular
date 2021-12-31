'use strict';
define(function (require, exports, module) {
    var config = [
        //客户信息管理 start
        ['/tableDemo', 'demo/demo-table.html', 'demoController.js'],
        ['/chartsDemo', 'demo/demo-charts.html', 'demoController.js'],
        ['/inputDemo?test&id', 'demo/demo-input.html', 'demoController.js'],
        ['/formDemo', 'demo/demo-form.html', 'demoController.js'],
        ['/index', 'index.html', 'demoController.js'],
        ['/bigPage', 'demo/demo-bigpage.html', 'demoController.js'],
        ['/listDemo', 'help/help-demo-list.html', 'helpController.js'],
        ['/treeDemo', 'demo/demo-tree.html', 'demoController.js'],
        ['/helpDemo', 'help/help.html', 'helpController.js'],
        ['/pageList', 'help/page-list.html', 'helpController.js'],
        ['/helpInputDemo?preEndDate&processTitle&processDefineName', 'help/help-demo-input.html', 'helpController.js'],
        ['/bigPageDemo', 'bigpagedemo/user-bigpage.html', 'bigPageDemoController.js'],
        ['/authResource', 'configPage/auth-resource.html', 'helpController.js'],
    ];
    module.exports = config;
});