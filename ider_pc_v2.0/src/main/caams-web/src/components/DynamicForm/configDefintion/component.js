export const componentConfigDefintion = {
  componentType: {
    type: 'select',
    name: '组件类型',
    defaultValue: 'form',
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
  modelName: {
    type: 'select',
    name: '实体名称',
    dataName: 'ModelList',
    showSearch: 'T'
  },
  type: {
    type: 'select',
    name: '组件类型',
    dataItems: [
      { label: '平铺类型', value: 'default' },
      { label: '弹出框类型', value: 'dialog' }
    ]
  },
  opType: {
    type: 'select',
    name: '组件业务类型',
    dataItems: [
      { label: '新增', value: 'add' },
      { label: '编辑', value: 'edit' },
      { label: '复核', value: 'check' },
      { label: '详情', value: 'detail' },
      { label: '克隆', value: 'clone' },
      { label: '其他', value: 'other' }
    ]
  },
  lineColumnCount: {
    type: 'select',
    name: '每行显示字段数',
    dataItems: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '6', value: '6' },
      { label: '12', value: '12' }
    ]
  },
  labelWidth: {
    type: 'input',
    name: '字段label显示宽度(最大值24)'
  },
  isQuery: {
    type: 'select',
    name: '是否查询表单',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ]
  },
  api: {
    type: 'input',
    name: '数据初始化api'
  },
  // 用于控制表单默认值的控制设置
  formValue: {
    title: '表单默认值'
  }
};
