export const componentConfigDefintion = {
  componentType: {
    type: 'select',
    name: '组件类型',
    defaultValue: 'table',
    disabled: 'T',
    dataItems: [
      { label: '表单', value: 'form' },
      { label: '表格', value: 'table' }
    ]
  },
  isInTab: {
    type: 'select',
    name: '是否在tab页中展示（审批页组件使用）',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    controller: [
      { value: 'T', showColumns: ['tabName'] }
    ]
  },
  tabName: {
    type: 'input',
    name: 'Tab页名称(相同的名称会展示一个Tab页中)',
    hidden: 'T'
  },
  name: {
    type: 'input',
    name: '组件名称'
  },
  id: {
    type: 'input',
    name: '组件ID'
  },
  pageQuery: {
    type: 'select',
    name: '是否分页查询',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    defaultValue: 'T'
  },
  queryOnOpenPage: {
    type: 'select',
    name: '页面打开时是否自动查询数据',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    defaultValue: 'T'
  },
  operationWidth: {
    type: 'input',
    name: '操作区宽度'
  },
  rowSelectionType: {
    type: 'select',
    name: '表格第一列是否显示选择项及类型',
    dataItems: [
      { label: '不显示', value: '' },
      { label: '单选框', value: 'radio' },
      { label: '多选框', value: 'checkbox' }
    ],
    defaultValue: ''
  },
  api: {
    type: 'select',
    name: '后端查询接口地址',
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
      { label: '/api/commonCheckService/queryCheckPage', value: '/api/commonCheckService/queryCheckPage' }
    ]
  },
  checkQuery: {
    type: 'select',
    name: '是否复核查询',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    controller: [
      { value: 'T', showColumns: [ 'checkStatus' ] }
    ]
  },
  checkStatus: {
    type: 'select',
    name: '复核状态(可多选)',
    selectMode: 'multiple',
    dataName: 'CheckStatus',
    hidden: 'T'
  },
  modelName: {
    showSearch: 'T',
    selectInput: 'T',
    type: 'select',
    name: '实体名称(复核查询时选择复核的业务实体类)',
    dataName: 'ModelList'
  },
  orderBy: {
    type: 'input',
    name: '排序方式'
  },
  // 用于控制表单默认值的控制设置
  formValue: {
    title: '默认查询条件'
  }
};
