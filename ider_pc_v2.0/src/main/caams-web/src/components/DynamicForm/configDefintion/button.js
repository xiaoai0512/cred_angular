export const buttonConfigDefintion = {
  id: {
    type: 'input',
    name: '按钮ID'
  },
  name: {
    type: 'input',
    name: '按钮名称'
  },
  type: {
    type: 'select',
    name: '按钮类型',
    dataItems: [
      { label: 'default', value: 'default' },
      { label: 'primary', value: 'primary' },
      { label: 'dashed', value: 'dashed' },
      { label: 'danger', value: 'danger' },
      { label: 'link', value: 'link' }
    ]
  },
  action: {
    type: 'select',
    name: '操作类型',
    dataItems: [
      { label: '弹出新增弹窗', value: 'add' },
      { label: '执行查询', value: 'query' },
      { label: '重置', value: 'reset' },
      { label: '执行导入', value: 'import' },
      { label: '执行导出模板', value: 'export' },
      { label: '执行导出', value: 'exportExcel' },
      { label: '关闭弹窗', value: 'close' },
      { label: '调用后端服务', value: 'api' },
      { label: '触发自定义组件显示', value: 'selfComponent' }
    ],
    controller: [
      { value: 'selfComponent', showColumns: ['selfComponent'] },
      { value: ['delete', 'api'], showColumns: ['check'] }
    ]
  },
  triggerQuery: {
    type: 'select',
    name: '操作完成后是否触发查询',
    dataItems: [
      { label: '不触发查询', value: 'notTriggerQuery' },
      { label: '重置分页查询', value: 'resetPageQuery' },
      { label: '按当前分页查询', value: 'notResetPageQuery' }
    ]
  },
  validateFields: {
    type: 'select',
    name: '点击按钮是否需要获取表单数据',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ]
  },
  check: {
    type: 'select',
    name: '操作是否需要复核',
    hidden: 'T',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ]
  },
  api: {
    type: 'select',
    name: 'api服务地址(点击按钮时需要触发的服务)',
    showSearch: 'T',
    selectInput: 'T',
    dataItems: [
      { label: '/api/commonCrudService/commonAdd', value: '/api/commonCrudService/commonAdd' },
      { label: '/api/commonCrudService/commonPageQuery', value: '/api/commonCrudService/commonPageQuery' },
      { label: '/api/commonCrudService/commonDelete', value: '/api/commonCrudService/commonDelete' },
      { label: '/api/commonCrudService/commonUpdate', value: '/api/commonCrudService/commonUpdate' },
      { label: '/api/commonCrudService/commonQueryByPk', value: '/api/commonCrudService/commonQueryByPk' },
      { label: '/api/commonCheckService/commonCheck', value: '/api/commonCheckService/commonCheck' },
      { label: '/api/commonCheckService/queryCheckDetail', value: '/api/commonCheckService/queryCheckDetail' },
      { label: '/api/commonCheckService/queryCheckPage', value: '/api/commonCheckService/queryCheckPage' },
      { label: '/api/commonExcelService/exportTemplate', value: '/api/commonExcelService/exportTemplate' },
      { label: '/api/commonExcelService/importData', value: '/api/commonExcelService/importData' },
      { label: '/api/commonExcelService/exportExcel', value: '/api/commonExcelService/exportExcel' }
    ]
  },
  modelName: {
    type: 'input',
    name: '业务处理实体类'
  },
  selfComponent: {
    type: 'input',
    name: '自定义组件路径',
    hidden: 'T'
  }
};
