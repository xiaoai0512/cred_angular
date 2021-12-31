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
      { label: '弹出编辑弹窗', value: 'edit' },
      { label: '执行删除', value: 'delete' },
      { label: '弹出复核弹窗', value: 'check' },
      { label: '弹出详情弹窗', value: 'detail' },
      { label: '弹出克隆弹出', value: 'clone' },
      { label: '触发自定义组件显示', value: 'selfComponent' },
      { label: '调用后端服务', value: 'api' },
      { label: '触发自定义处理', value: 'selfHandle' },
      { label: '执行导出', value: 'export' }
    ],
    controller: [
      { value: 'selfComponent', showColumns: ['selfComponent'] },
      { value: ['delete', 'edit'], showColumns: ['check'] }
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
  confirm: {
    type: 'select',
    name: '点击按钮是否弹出确认框',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    controller: [
      { value: 'T', showColumns: ['confirmText'] }
    ]
  },
  confirmText: {
    type: 'input',
    name: '确认框提示信息',
    hidden: 'T'
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
      { label: '/api/commonExcelService/exportExcel', value: '/api/commonExcelService/exportExcel' }
    ]
  },
  modelName: {
    type: 'select',
    name: '实体名称',
    dataName: 'ModelList',
    showSearch: 'T',
    selectInput: 'T'
  },
  selfComponent: {
    type: 'input',
    name: '自定义组件路径',
    hidden: 'T'
  }
};
