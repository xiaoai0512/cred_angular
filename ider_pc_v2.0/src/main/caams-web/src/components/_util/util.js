
import moment from 'moment'

/**
 * components util
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 获取uuid
 */
export function getUUID () {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join('');
  return uuid
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0);

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
};

/**
 * 判断是否是json
 */
export function isJson (str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

/**
 * 处理表单特殊值
 */
export function handleFormValue (columnItems, formValue) {
  columnItems = columnItems || [];
  formValue = formValue || {};
  if (columnItems) {
    // 处理时间格式化
    const dataPickerList = columnItems.filter(item => item.type === 'datePicker');
    dataPickerList.map(item => {
      const date = formValue[item.columnName];
      if (date) {
        formValue[item.columnName] = moment(date).format('YYYY-MM-DD')
      }
    });
    // 处理jsonInput，将jsonInput提交前去格式化，减少服务端存储大小
    const jsonInputList = columnItems.filter(item => item.type === 'jsonInput');
    jsonInputList.map(item => {
      const jsonValue = formValue[item.columnName];
      if (jsonValue) {
        formValue[item.columnName] = JSON.stringify(JSON.parse(jsonValue))
      }
    });
    // 处理数组字段
    columnItems.forEach(item => {
      if (Array.isArray(formValue[item.columnName])) {
        const value = arrayToString(formValue[item.columnName]);
        formValue[item.columnName] = value
      }
    });
    // 同步columnItems在formValue中无属性的字段为undefined，防止将之前的值提交
    columnItems.forEach(item => {
      if (!formValue[item.columnName]) {
        formValue[item.columnName] = undefined
      }
    })
  }
  return formValue
}
export function arrayToString (arrayData) {
  if (arrayData && arrayData.length === 0) {
    return ''
  }
  let value = '';
  arrayData.forEach(item => {
    value += item + ','
  });
  if (value !== '') {
    value = value.substring(0, value.length - 1)
  }
  return value
}
/**
 * 处理配置引用
 */
function getDynamicConfigRefObj (config, refName) {
  if (!refName) {
    return {}
  }
  const refPaths = refName.split('.');
  let refObj = config || {};
  refPaths.forEach(item => {
    refObj = refObj[item] || {}
  });
  return refObj
}

/**
 * 处理JS对象中的引用关系
 * 主要是对属性valueRef进行处理
 * {
 *   valueRef:{
 *      propsName：'', //需要设置的属性名称
 *      refName:'' // 引用当前对象值的路径
 *   }
 * }
 */
export function handleRefObj (config, curObj) {
  for (const key in curObj) {
    if (key === 'valueRef') {
      const valueRef = curObj[key];
      // 当前属性无ref中propsName对象的属性时，直接使用refName对象的值设置该属性
      if (!curObj[valueRef.propsName]) {
        curObj[valueRef.propsName] = JSON.parse(JSON.stringify(getDynamicConfigRefObj(config, valueRef.refName)))
      }
    } else if (typeof (curObj[key]) === 'object') {
      handleRefObj(config, curObj[key])
    }
  }
}

/**
 * disabled全部的表单项
 */
export function disabledAllColumnItems (columnItems) {
  columnItems && columnItems.forEach(item => {
    item.extraProps = {
      ...item.extraProps,
      disabled: true
    }
  })
}

export function getBase64 (file, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file)
}

/**
 * 敏感数据处理器
 */
export const sensitiveHandler = {
  cnName: (value) => {
    if (!value || value.length === 1) {
      return value
    }
    if (value.length === 2) {
      return '*' + value.substring(1, 2)
    } else {
      return value.substring(0, 1) + '*' + value.substring(value.length - 1, value.length)
    }
  },
  mobile: (value) => {
    if (value.length >= 7) {
      return value.substring(0, 3) + '****' + value.substring(value.length - 4, value.length)
    } else {
      return value
    }
  },
  cardNo: (value) => {
    if (value.length >= 8) {
      return value.substring(0, 4) + '****' + value.substring(value.length - 4, value.length)
    } else {
      return value
    }
  },
  idNumber: (value) => {
    if (value.length >= 10) {
      return value.substring(0, 6) + '****' + value.substring(value.length - 4, value.length)
    } else {
      return value
    }
  },
  email: (value) => {
    if (value.indexOf('@') !== -1) {
      const emailPrefix = value.substring(0, value.indexOf('@'));
      if (value.length > 2) {
        return emailPrefix.substring(0, 1) + '****' +
        emailPrefix.substring(emailPrefix.length - 1, emailPrefix.length) +
        value.substring(value.indexOf('@'), value.length)
      } else {
        return emailPrefix.substring(0, 1) + '****' +
        value.substring(value.indexOf('@'), value.length)
      }
    } else {
      return value
    }
  }
};
