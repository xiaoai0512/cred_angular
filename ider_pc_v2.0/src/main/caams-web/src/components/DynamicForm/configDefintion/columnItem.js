export const columnItemConfigDefintion = {
  label: {
    type: 'input',
    name: '名称'
  },
  type: {
    type: 'select',
    name: '表单项类型',
    dataItems: [
      { label: '文本框', value: 'input' },
      { label: '下拉框', value: 'select' },
      { label: '多选框', value: 'checkbox' },
      { label: '单选框', value: 'radio' },
      { label: '时间选择器', value: 'datePicker' },
      { label: '文本域', value: 'textarea' },
      { label: '省市区', value: 'area' },
      { label: '机构树', value: 'org' },
      { label: '菜单树', value: 'menuSelector' },
      { label: '用户岗位组别选择器', value: 'userFormExtender' }
    ],
    controller: [
      { value: 'select', showColumns: ['dataName', 'showSearch', 'selectInput', 'selectMode', 'textColumnName'] },
      { value: ['checkbox', 'radio'], showColumns: ['dataName'] }
    ]
  },
  dataName: {
    type: 'select',
    name: '下拉选项参数名',
    dataName: 'ParamList',
    showSearch: 'T',
    hidden: true
  },
  selectMode: {
    type: 'select',
    name: '是否支持多选',
    dataItems: [
      { label: '是', value: 'multiple' },
      { label: '否', value: 'default' }
    ],
    hidden: true
  },
  showSearch: {
    type: 'select',
    name: '下拉框是否可搜索',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    hidden: true
  },
  selectInput: {
    type: 'select',
    name: '下拉框是否可自由输入',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    hidden: true
  },
  textColumnName: {
    type: 'input',
    name: '下拉框名称对应字段',
    hidden: true
  },
  columnName: {
    type: 'input',
    name: '字段名'
  },
  displayInline: {
    type: 'select',
    name: '是否单独成行',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ]
  },
  defaultValue: {
    type: 'input',
    name: '预置默认值'
  },
  disabled: {
    type: 'select',
    name: '是否禁用',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ]
  },
  hidden: {
    type: 'select',
    name: '是否默认隐藏',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    controller: [
      { value: 'T', showColumns: ['showCondition'] }
    ]
  },
  showCondition: {
    type: 'input',
    name: '默认隐藏时显示条件（组件初始化完成时处理，表单数据变更时不处理,格式为JSON列表）',
    hidden: 'T'
  },
  required: {
    type: 'select',
    name: '是否必输',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ]
  },
  min: {
    type: 'input',
    name: '最小长度'
  },
  max: {
    type: 'input',
    name: '最大长度'
  },
  pattern: {
    type: 'select',
    name: '正则表达式',
    dataName: 'RegExp'
  },
  selfValidator: {
    type: 'input',
    name: '自定义验证JAVA实现类'
  },
  controller: {
  }
};
