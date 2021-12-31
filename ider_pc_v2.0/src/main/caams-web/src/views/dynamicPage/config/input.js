export const baseInfoFormConfig = {
  columnItems: [
    {
      label: '申请方式',
      columnName: 'mode',
      type: 'radio',
      dataName: 'FirsrOrSecondCard'
    },
    {
      label: '姓名',
      columnName: 'name',
      type: 'input'
    },
    {
      label: '证件类型',
      columnName: 'idType',
      type: 'select',
      dataName: 'IdType'
    },
    {
      label: '证件号',
      columnName: 'idNumber',
      type: 'input'
    },
    {
      label: '手机号',
      columnName: 'mobile',
      type: 'input'
    },
    {
      label: '申卡模式',
      columnName: 'applyMode',
      type: 'select',
      dataName: 'ApplyMode'
    },
    {
      label: '主卡产品',
      columnName: 'cardId',
      type: 'select'
    }
  ]
};
