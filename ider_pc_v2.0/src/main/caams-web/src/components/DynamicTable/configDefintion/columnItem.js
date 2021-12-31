export const columnItemConfigDefintion = {
  title: {
    type: 'input',
    name: '表头名称'
  },
  dataIndex: {
    type: 'input',
    name: '字段名称'
  },
  dataName: {
    type: 'select',
    name: '数据映射参数名',
    dataName: 'ParamList',
    showSearch: 'T'
  },
  width: {
    type: 'input',
    name: '字段宽度，设置时请带px(如：200px)，不设置时自适应,'
  },
  sensitiveType: {
    type: 'select',
    name: '是否脱敏及脱敏类型',
    dataItems: [
      { label: '不脱敏', value: '' },
      { label: '中文姓名', value: 'cnName' },
      { label: '手机号', value: 'mobile' },
      { label: '证件号', value: 'idNumber' },
      { label: '卡号', value: 'cardNo' },
      { label: '邮箱', value: 'email' }
    ]
  },
  sortable: {
    type: 'select',
    name: '是否可排序',
    dataItems: [
      { label: '是', value: 'T' },
      { label: '否', value: 'F' }
    ],
    controller: [
      { value: 'T', showColumns: [ 'orderByColumn' ] }
    ]
  },
  orderByColumn: {
    type: 'input',
    name: '排序字段名称(使用通用查询时直接使用数据库字段名称)',
    hidden: 'T'
  }
};
