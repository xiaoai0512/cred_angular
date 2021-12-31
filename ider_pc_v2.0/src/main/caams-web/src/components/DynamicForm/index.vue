<template>
  <div class="dynamic-form">
    <div :class="designerMode?'form-container':''">
      <a-form :form="dynamicForm" :key="formKey" :layout="formLayout" :selfUpdate="true">
        <a-row>
          <draggable
            element="ul"
            v-model="columnItems"
            :options="dragOptions"
            @end="(e) => moveEnd(e)">
            <transition-group type="transition" :name="'flip-list'">
              <a-col
                v-for="(item, index) in columnItems"
                :span="item.displayInline == 'T'?24:24/lineColumnCount"
                :key="'column-'+index">
                <div
                  @click="()=>{handleItemSelect(index)}"
                  :class="designerMode?designerModelSelectedItem == index?'form-item-designer-active':'form-item-designer':''">
                  <span @click="(e)=>{handleItemDelete(index, e)}" v-if="designerMode && designerModelSelectedItem == index" class="form-item-delete"><a-icon type="close-circle" /></span>
                  <a-form-item
                    :style="formItemStyle(item,index)"
                    :label="item.label"
                    :label-col="formItemLayout(item).labelCol"
                    :wrapper-col="formItemLayout(item).wrapperCol">
                    <a-input
                      v-if="item.type == 'input' || item.type == 'number'"
                      :type="item.type"
                      :title="tempFormValue[item.columnName]"
                      :placeHolder="item.placeHolder"
                      :disabled="item.disabled === 'T'?true:false"
                      @blur="(e) => handleFormValueChange(item, e.target.value)"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] , initialValue: tempFormValue[item.columnName]}
                      ]"
                      v-bind="item.extraProps"
                    />
                    <a-select
                      :showSearch="item.showSearch == 'T' || item.selectInput === 'T'?true:false"
                      optionFilterProp="children"
                      :title="tempFormValue[item.columnName]"
                      :mode="item.selectMode || 'default'"
                      :placeHolder="item.placeHolder"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, value)"
                      @blur="(value) => handleSelectSearchBlur(item, value)"
                      @search="(value) => handleSelectSearch(item, value)"
                      v-if="item.type == 'select'"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] ,
                          initialValue: item.selectMode === 'multiple'?(typeof(tempFormValue[item.columnName]) === 'string'
                            ?tempFormValue[item.columnName].split(',')
                            :tempFormValue[item.columnName]?tempFormValue[item.columnName]:[]):tempFormValue[item.columnName]}
                      ]"
                      v-bind="item.extraProps">
                      <a-select-option
                        v-for="option in (item.searchDataItems || item.dataItems || dataItems[item.dataName])"
                        :key="option.value"
                        :value="option.value">{{ option.label }}</a-select-option>
                    </a-select>
                    <a-date-picker
                      style="width:100%"
                      v-if="item.type == 'datePicker'"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, dateFormate(value, item.extraProps && item.extraProps.format))"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] , initialValue: formatDate(tempFormValue[item.columnName])},
                      ]"
                      v-bind="item.extraProps"/>
                    <a-checkbox-group
                      v-if="item.type == 'checkbox'"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, value)"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] ,
                          initialValue: typeof(tempFormValue[item.columnName]) === 'string'
                            ?tempFormValue[item.columnName].split(',')
                            :tempFormValue[item.columnName]?tempFormValue[item.columnName]:[]}
                      ]"
                      v-bind="item.extraProps">
                      <a-checkbox
                        v-for="option in item.dataItems || dataItems[item.dataName]"
                        :key="option.value"
                        :value="option.value">{{ option.label }}</a-checkbox>
                    </a-checkbox-group>
                    <a-radio-group
                      v-if="item.type == 'radio'"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, value)"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] , initialValue: tempFormValue[item.columnName]},
                      ]"
                      v-bind="item.extraProps">
                      <a-radio
                        v-for="option in item.dataItems || dataItems[item.dataName]"
                        :key="option.value"
                        :value="option.value">{{ option.label }}</a-radio>
                    </a-radio-group>
                    <a-textarea
                      v-if="item.type == 'textarea'"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, value)"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] , initialValue: tempFormValue[item.columnName]},
                      ]"
                      v-bind="item.extraProps">
                    </a-textarea>
                    <a-tree-select
                      v-if="item.type == 'area'"
                      treeNodeFilterProp="title"
                      treeNodeLabelProp="label"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, value)"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] , initialValue: tempFormValue[item.columnName]},
                      ]"
                      showSearch
                      :placeHolder="item.placeHolder"
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeData="areaTreeData"
                    />
                    <a-tree-select
                      v-if="item.type === 'org'"
                      treeNodeFilterProp="title"
                      treeNodeLabelProp="title"
                      :disabled="item.disabled === 'T'?true:false"
                      @change="(value) => handleFormValueChange(item, value)"
                      v-decorator="[
                        item.columnName,
                        { rules: item.rules || [] , initialValue: tempFormValue[item.columnName]},
                      ]"
                      showSearch
                      :placeHolder="item.placeHolder"
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeData="orgTreeData"
                    />
                    <MenuSelector
                      v-if="item.type == 'menuSelector'"
                      :columnItem="item"
                      @change="handleExtenderComponentChange"
                      :tempFormValue="tempFormValue"
                    />
                    <UserFormExtender
                      v-if="item.type == 'userFormExtender'"
                      :columnItem="item"
                      @change="handleExtenderComponentChange"
                      :tempFormValue="tempFormValue"
                    />
                  </a-form-item>
                </div>
              </a-col>
            </transition-group>
          </draggable>
        </a-row>
      </a-form>
    </div>
    <div v-if="designerMode" class="plus-container">
      <span class="plus" @click="handleItemAdd">
        <a-icon class="plus-icon" type="plus" />
      </span>
    </div>
    <a-row>
      <div :class="designerMode?'buttons-container':''">
        <div class="buttons" v-if="buttons && buttons.length > 0">
          <draggable
            element="ul"
            v-model="buttons"
            :options="dragOptions"
            @end="(e) => btnMoveEnd(e)">
            <transition-group type="transition" :name="'flip-list'">
              <span
                :class="designerMode && designerModelSelectedBtn === index?'btn-designer':''"
                v-for="(item, index) in buttons"
                @click="() => handleBtnSelect(index)"
                :key="'button'+index">
                <a-upload
                  v-if="item.action === 'import'"
                  accept=".xlsx"
                  :showUploadList="false"
                  :multiple="false"
                  :customRequest="(fileInfo)=>handleImport(fileInfo,item)"
                >
                  <a-button
                    class="button-item"
                    @click="()=>handleBtnClick(item)"
                    :type="item.type || 'primary'">{{ item.name }}</a-button>
                </a-upload>
                <a-button
                  v-if="item.action !== 'import'"
                  class="button-item"
                  @click="()=>handleBtnClick(item)"
                  :type="item.type || 'primary'">{{ item.name }}</a-button>
                <span v-if="designerMode && designerModelSelectedBtn === index">
                  |
                  <a-icon type="close-circle" @click="(e)=>{handleBtnDelete(index, e)}"/>
                </span>
              </span>
            </transition-group>
          </draggable>
        </div>
      </div>
      <div v-if="designerMode" class="plus-container">
        <span class="plus" @click="handleBtnAdd">
          <a-icon class="plus-icon" type="plus" />
        </span>
      </div>
    </a-row>
    <component
      v-show="dynamicComponent"
      :paramValue="dynamicComponentParamValue"
      :is="dynamicComponent"/>
    <a href="#" id="download" style="display:none;"></a>
  </div>
</template>
<script>
import ApiService from '@/api/api-service'
import md5 from 'md5'
import draggable from 'vuedraggable'
import { handleFormValue } from '@/components/_util/util'
import MenuSelector from './MenuSelector'
import UserFormExtender from './UserFormExtender'
import moment from 'moment'
import { getBlob } from '../_util/base64ToFile'
import { getBase64 } from '../_util/util'
export default {
  name: 'DynamicForm',
  components: { draggable, MenuSelector, UserFormExtender },
  props: {
    config: {
      type: Object,
      default () {
        return {
          // 表单字段列表
          columnItems: [],
          // 每行显示的字段数，默认3个
          lineColumnCount: 3,
          // 下拉框、多选、单选数据值
          dataItems: [],
          // 按钮集合
          buttons: [],
          isQuery: 'F', // 是否是查询类表单，查询类表单下拉选项会增加一个全部的选项
          formLayout: 'horizontal' // 表单布局模式 支持horizontal、vertical、inline
        }
      }
    },
    formValue: {
      type: Object,
      default () {
        return {}
      }
    },
    // 是否是表单设计模式
    designerMode: {
      type: Boolean,
      default () {
        return false
      }
    },
    componentPk: {
      type: String,
      default () {
        return undefined
      }
    },
    disabledAll: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  created () {
    // alert(this.$route.name)
  },
  computed: {
    formItemLayout () {
      const { formLayout } = this
      return function (item) {
        if (formLayout !== 'horizontal') {
          return {}
        }
        let labelCol = parseInt(this.formConfig.labelWidth || 12)
        let wrapperCol = 24 - labelCol
        if (item.displayInline === 'T') {
          labelCol = Math.floor(((24 / this.lineColumnCount) / 24) * labelCol)
          wrapperCol = 24 - labelCol
        }
        return {
          labelCol: { span: labelCol },
          wrapperCol: { span: wrapperCol }
        }
      }
    },
    formItemStyle () {
      return function (item, index) {
        if (item.hidden === 'T') {
          return 'background:#e2e2e2'
        }
        return ''
      }
    },
    formatDate () {
      return function (value) {
        return value ? moment(value) : undefined
      }
    }
  },
  data () {
    return {
      formKey: '',
      dynamicForm: this.createForm(),
      columnItems: [],
      columnItemsTemp: [], // 在值改变过程中临时的列表
      columnItemsCopy: [], // 最原始的表单项列表，方便重置表单时使用
      lineColumnCount: 3,
      dataItems: {},
      buttons: [],
      tempFormValue: {}, // 临时表单值，防止在控制影藏显示时原有数据丢失
      formLayout: 'horizontal', // 表单项布局模式,
      designerModelFormItemClass: 'form-item-designer', // 设计模式下表单项样式
      designerModelSelectedItem: undefined, // 设计模式下被选中项
      designerModelSelectedBtn: undefined, // 设计模式下被选择的按钮
      dragOptions: { disabled: true },
      dynamicComponent: undefined,
      dynamicComponentParamValue: undefined,
      defaultFormValue: {}, // 在配置中设置的表单项默认值
      areaTreeData: [], // 区域信息treeData,
      orgTreeData: [], // 机构信息treeData
      hasInitApiData: false
    }
  },
  watch: {
    config: {
      immediate: true,
      handler (newValue, oldValue) {
        this.initConfig(newValue)
      }
    },
    formValue: {
      immediate: true,
      handler (newValue, oldValue) {
        this.initFormValue(newValue)
      }
    },
    designerMode: {
      immediate: true,
      handler (newValue) {
        this.dragOptions = {
          disabled: !newValue
        }
      }
    },
    componentPk: {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          // 查询组件信息
          ApiService.post('/api/dyComponentService/queryConfig', { pk: newValue }, res => {
            const componentConfig = JSON.parse(res.componentConfig)
            this.initConfig(componentConfig)
            this.initFormValue(this.tempFormValue)
          })
        }
      }
    }
  },
  methods: {
    createForm () {
      this.dynamicForm = this.$form.createForm(this, { name: 'dynamicForm' })
    },
    initAreaTreeData () {
      const hasAreaTree = this.columnItemsCopy.filter(item => item.type === 'area').length > 0
      if (hasAreaTree) {
        ApiService.post('/api/areaTrade/queryAreaTree', {}, res => {
          this.areaTreeData = res
        })
      }
    },
    initOrgTreeData (orgLevel) {
      const hasOrgTree = this.columnItemsCopy.filter(item => item.type === 'org').length > 0
      if (hasOrgTree) {
        ApiService.post('/api/orgTrade/queryOrgTree', { orgLevel: orgLevel }, res => {
          this.orgTreeData = res
        })
      }
    },
    initConfig (newValue) {
      this.tempFormValue = {}
      this.formConfig = newValue
      this.columnItemsCopy = this.deepCopy(newValue.columnItems || [])
      this.columnItemsTemp = this.deepCopy(this.columnItemsCopy)
      this.lineColumnCount = newValue.lineColumnCount || 3
      this.dataItems = newValue.dataItems || []
      this.buttons = this.initButtonEvent(newValue.buttons)
      this.formLayout = newValue.formLayout || this.formLayout
      // 从后端参数列表中初始化下拉选项值列表
      this.initDataItems(this.columnItemsCopy)
      // 初始化省市区下拉框
      this.initAreaTreeData(this.tempFormValue.areaLevel)
      this.initOrgTreeData(this.tempFormValue.orgLevel)
      this.handleColumnItems()
      // 表单默认值优先级 formConfig.formValue > 组件的defaultValue > formConfig.configFormValue
      let defaultFormValue = {}
      // 处理表单配置的默认值
      const configFormValue = this.formConfig.configFormValue || []
      // 处理真实值
      configFormValue.filter(item => item.valueType === 'realValue').forEach(item => {
        defaultFormValue[item.prop] = item.value
      })
      // 处理映射值
      configFormValue.filter(item => item.valueType === 'mapValue').forEach(item => {
        defaultFormValue[item.prop] = this.formConfig.formValue[item.value]
      })
      // 处理组件配置默认值
      this.columnItemsTemp.forEach(item => {
        if (item.defaultValue) {
          defaultFormValue[item.columnName] = item.defaultValue
        }
      })
      // 处理通过配置传入的formValue
      defaultFormValue = {
        ...defaultFormValue,
        ...this.formConfig.formValue
      }
      this.defaultFormValue = defaultFormValue
      this.tempFormValue = {
        ...this.defaultFormValue,
        ...this.tempFormValue
      }
    },
    initFormValue (newValue) {
      this.tempFormValue = {
        ...this.defaultFormValue,
        ...newValue
      }
      // 重置columnItemsTemp便于处理字段显示控制器
      this.columnItemsTemp = this.deepCopy(this.columnItemsCopy)
      // 当初始值改变时，处理字段显示控制器
      const columnItems = this.deepCopy(this.columnItemsCopy)
      for (let i = 0; i < columnItems.length; i++) {
        const item = columnItems[i]
        if (this.tempFormValue[item.columnName]) {
          this.handleFormValueChange(item, this.tempFormValue[item.columnName], false, false, true)
        }
      }
      // 处理showCondition
      this.columnItemsTemp.map(item => {
        if (item.showCondition) {
          const showCondition = JSON.parse(item.showCondition)
          for (const key in showCondition) {
            if (this.tempFormValue[key] === showCondition[key]) {
              item.hidden = 'F'
            }
          }
        }
      })
      this.handleColumnItems(this.columnItemsTemp)
      // 修改formKey,当数据改变时强制重新渲染form表单，防止各种意想不到的情况
      this.formKey = md5(JSON.stringify(this.tempFormValue))
      this.createForm()
      // 初始化省市区下拉框
      this.initAreaTreeData(this.tempFormValue.areaLevel)
      this.initOrgTreeData(this.tempFormValue.orgLevel)
      // 初始化后端数据
      if (this.formConfig.api && !this.designerMode && !this.hasInitApiData) {
        this.hasInitApiData = true
        ApiService.post(this.formConfig.api, this.tempFormValue, res => {
          this.initFormValue(res)
        })
      }
    },
    initButtonEvent (buttons) {
      buttons && buttons.forEach(item => {
        item.click = (btnConfig, data) => {
          if (item.action === 'add') {
            this.$emit('btnClick', btnConfig)
          } else if (item.action === 'query') {
            this.$emit('btnClick', btnConfig, data)
          } else if (item.action === 'reset') {
            btnConfig = this.deepCopy(btnConfig)
            btnConfig.action = 'query'
            this.$emit('btnClick', btnConfig, data)
          } else if (item.action === 'export') {
            const api = btnConfig.api
            if (!api) {
              this.$message.error('请配置按钮的api属性')
              return
            }
            if (!btnConfig.modelName) {
              this.$message.error('请配置导出数据的实体类')
              return
            }
            const params = {
              modelName: btnConfig.modelName
            }
            ApiService.post(api, params, (res) => {
              const blob = getBlob(res.base64Data)
              const download = document.createElement('a')
              download.download = res.fileName
              download.href = URL.createObjectURL(blob)
              download.click()
            })
          } else if (item.action === 'selfComponent') {
            if (!item.selfComponent) {
              this.$message.error('请配置自定义组件路径')
              return
            }
            let selfComponent = item.selfComponent
            if (selfComponent.charAt(0) === '/') {
              selfComponent = selfComponent.substring(1)
            }
            this.dynamicComponent = (resolve) => require([`@/${selfComponent}`], resolve)
          }
        }
      })
      return buttons
    },
    initDataItems (columnItems) {
      if (columnItems && columnItems.length > 0) {
        const groupCodeList = columnItems.filter(item => item.dataName).map(item => {
          return item.dataName
        })
        ApiService.post('/api/paramTrade/paramData', { groupCodeList: groupCodeList }, (res) => {
          console.log('11111')
          if (res.data && res.data.length > 0) {
            const dataItems = {}
            res.data.forEach(item => {
              dataItems[item.groupCode] = item.paramList.map(item2 => {
                return {
                  label: item2.paramName,
                  value: item2.paramCode
                }
              })
            })
            this.dataItems = {
              ...dataItems,
              ...this.dataItems
            }
            // 查询条件类表单在下拉选项第一个位置添加一个空的选项，方便查询条件还原到全查询
            if (this.formConfig.isQuery === 'T') {
              for (const key in dataItems) {
                if (dataItems[key] && dataItems[key].length > 0) {
                  dataItems[key] = dataItems[key].splice(0, 0, {
                    label: '全部',
                    value: ''
                  })
                }
              }
            }
            // 处理下拉框非可输入时值不在数据列表时将值置空
            this.columnItems.forEach(item => {
              if (item.type === 'select' && item.selectInput !== 'T' && item.selectMode !== 'multiple') {
                if (this.dataItems[item.dataName] && this.dataItems[item.dataName].filter(data =>
                  data.value === this.tempFormValue[item.columnName]).length === 0) {
                  this.tempFormValue[item.columnName] = undefined
                }
              }
            })
          }
        })
      }
    },
    handleColumnItems (columnItems) {
      columnItems = columnItems || this.deepCopy(this.columnItemsCopy)
      // 非设计模式下移出默认隐藏的项
      if (!this.designerMode) {
        columnItems = columnItems.filter(item => item.hidden !== 'T')
      }
      // 处理全部影像
      if (this.disabledAll) {
        columnItems.forEach(item => {
          item.disabled = 'T'
        })
      }
      this.columnItems = columnItems
      // 处理下拉框非可输入时值不在数据列表时将值置空
      this.columnItems.forEach(item => {
        if (item.type === 'select' && item.selectInput !== 'T' && item.selectMode !== 'multiple') {
          if (this.dataItems[item.dataName] && this.dataItems[item.dataName].filter(data =>
            data.value === this.tempFormValue[item.columnName]).length === 0) {
            this.tempFormValue[item.columnName] = undefined
          }
        }
      })
    },
    getForm () {
      return this.dynamicForm
    },
    resetForm () {
      this.dynamicForm.resetFields()
      this.tempFormValue = this.deepCopy(this.defaultFormValue)
      this.handleColumnItems()
    },
    handleSelectSearchBlur (item, value) {
      if (item.selectInput === 'T') {
        const formValue = this.dynamicForm.getFieldsValue(
          this.columnItemsCopy.map(item => { return item.columnName })
        )
        formValue[item.columnName] = this.tempFormValue[item.columnName]
        this.$emit('change', item, value, formValue)
      }
    },
    handleSelectSearch (item, value) {
      if (item.selectInput === 'T') {
        const obj = {}
        obj[item.columnName] = this.tempFormValue[item.columnName]
        this.dynamicForm.setFieldsValue(obj)
        this.tempFormValue[item.columnName] = value
      }
    },
    handleFormValueChange (formItem, value, updateForm = true, forceHidden = false, secondHandle = false) {
      if (!secondHandle) {
        this.tempFormValue[formItem.columnName] = value
        // 非递归调用时，处理值改变事件
        const formValue = this.dynamicForm.getFieldsValue(
          this.columnItemsCopy.map(item => { return item.columnName })
        )
        formValue[formItem.columnName] = value
        this.$emit('change', formItem, value, formValue)
        // 处理机构级别改变时，刷新机构树
        if (formItem.columnName === 'orgLevel') {
          this.initOrgTreeData(value)
        }
        // 处理下拉框文本对应字段
        if (formItem.type === 'select' && formItem.textColumnName) {
          const dataItems = formItem.searchDataItems || formItem.dataItems || this.dataItems[formItem.dataName]
          this.tempFormValue[formItem.textColumnName] = dataItems.filter(item => item.value === value)[0].label
        }
      }
      const columnItems = this.columnItemsTemp
      if (!secondHandle) {
        // 第一次进入方法时，将isHandleToShow全部设置为false,在后续处理为显示时，标记该值为T
        // 在后续处理中，如果需要隐藏组件，但是在前次处理过程中标记了该值已经需要显示，就忽略本次影藏操作
        // 主要为了解决controller中两个不同的值需要控制同一个组件的问题
        columnItems.forEach(item => { item.isHandleToShow = 'F' })
      }
      // 根据控制器隐藏或显示字段
      formItem.controller && formItem.controller.forEach(item => {
        columnItems.forEach(columnItem => {
          if (item.showColumns && item.showColumns.indexOf(columnItem.columnName) !== -1) {
            if (!forceHidden && (item.value === value ||
                Array.isArray(item.value) && item.value.indexOf(value) !== -1)) {
              // 非强制隐藏，且达到当前显示条件
              columnItem.hidden = 'F'
              columnItem.isHandleToShow = 'T'
              // 递归处理当前被隐藏或显示的项的控制项的隐藏或显示
              if (columnItem.controller && columnItem.controller.length > 0) {
                this.handleFormValueChange(columnItem, this.tempFormValue[columnItem.columnName], false, false, true)
              }
            } else {
              if (columnItem.isHandleToShow !== 'T') {
                columnItem.hidden = 'T'
                // 递归处理当前被隐藏或显示的项的控制项的隐藏或显示
                if (columnItem.controller && columnItem.controller.length > 0) {
                  this.handleFormValueChange(columnItem, this.tempFormValue[columnItem.columnName], false, true, true)
                }
              }
            }
          }
        })
      })
      if (updateForm) {
        this.columnItemsTemp = columnItems
        this.handleColumnItems(columnItems)
      }
    },
    handleItemAdd () {
      this.$emit('itemAdd')
      window.setTimeout(() => {
        this.handleItemSelect(this.columnItems.length - 1)
      }, 50)
    },
    handleBtnAdd () {
      this.$emit('btnAdd')
      window.setTimeout(() => {
        this.handleBtnSelect(this.buttons.length - 1)
      }, 50)
    },
    handleBtnDelete (index) {
      if (event) {
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true
      }
      this.designerModelSelectedBtn = index - 1
      this.$emit('btnDelete', index)
      if (this.designerModelSelectedBtn >= 0) {
        this.$emit('btnSelect', this.designerModelSelectedBtn)
      }
    },
    handleItemSelect (index) {
      this.designerModelSelectedItem = index
      this.$emit('itemSelect', index)
    },
    handleBtnSelect (index) {
      this.designerModelSelectedBtn = index
      this.$emit('btnSelect', index)
    },
    handleItemDelete (index, event) {
      if (event) {
        // 阻止事件冒泡触发了handleItemSelect
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true
      }
      this.designerModelSelectedItem = index - 1
      this.$emit('itemDelete', index)
      // 手动调用handleSelect
      if (this.designerModelSelectedItem >= 0) {
        this.$emit('itemSelect', this.designerModelSelectedItem)
      }
    },
    handleBtnClick (item) {
      if (this.designerMode) {
        // 设计模式下禁用按钮
        return
      }
      if (item.action === 'reset') {
        // 重置表单字段
        const tempFormValue = this.deepCopy(this.tempFormValue)
        const columnItems = this.deepCopy(this.columnItems).filter(item => item.hidden !== 'T')
        columnItems.forEach(item => {
          tempFormValue[item.columnName] = undefined
        })
        this.dynamicForm.setFieldsValue(tempFormValue)
        this.tempFormValue = tempFormValue
      }
      if (item.validateFields === 'T') {
        this.getFormData((data) => {
          item.click && item.click(item, data)
        })
      } else {
        item.click && item.click(item)
      }
    },
    getFormData (callback, validateFields = true) {
      if (validateFields) {
        this.dynamicForm.validateFieldsAndScroll((errors, formData) => {
          if (!errors) {
          // 处理表单特殊数据格式化
            formData = handleFormValue(this.formConfig.columnItems, formData)
            const data = {
              ...this.tempFormValue,
              ...formData
            }
            // 处理扩展组件的值,扩展组件的值因为在formData中显示为undefined，会覆盖真实值，因此此处重新设置
            this.columnItems.forEach(item => {
              if (['menuSelector', 'userFormExtender'].indexOf(item.type) !== -1) {
                data[item.columnName] = this.tempFormValue[item.columnName]
              }
            })
            callback && callback(data)
          } else {
            callback && callback()
          }
        })
      } else {
        // 不需要验证时，直接将已有数据传出
        callback && callback(this.deepCopy(this.tempFormValue))
      }
    },
    moveEnd (e) {
      this.designerModelSelectedItem = e.newIndex
      this.$emit('moveComplete', this.columnItems)
      this.$emit('itemSelect', this.designerModelSelectedItem)
    },
    btnMoveEnd (e) {
      this.designerModelSelectedBtn = e.newIndex
      this.$emit('btnMoveComplete', this.buttons)
      this.$emit('btnSelect', this.designerModelSelectedBtn)
    },
    handleExtenderComponentChange (columnName, data) {
      this.tempFormValue[columnName] = data
    },
    handleImport (fileInfo, btnConfig) {
      getBase64(fileInfo.file, dataBase64 => {
        dataBase64 = dataBase64.split('base64,')[1]
        const api = btnConfig.api
        if (!api) {
          this.$message.error('请配置按钮的api属性')
          return
        }
        if (!btnConfig.modelName) {
          this.$message.error('请配置导出数据的实体类')
          return
        }
        const params = {
          modelName: btnConfig.modelName,
          base64Data: dataBase64
        }
        ApiService.post(api, params, (res) => {
          if (!res.success) {
            this.$message.error('数据导入失败')
          } else {
            this.$message.success('数据导入成功')
          }
        })
      })
    }
  }
}
</script>
<style scoped>
  .dynamic-form{
    background: #fff;
    border-radius: 5px;
    padding: 10px 10px 0 0;
    margin: 0 0 20px 0;
  }
  .dynamic-form .form-container{
    width: 98%;
    margin: 10px;
    min-height: 200px;
    padding: 10px;
    border: 1px dashed #e2e2e2;
  }
  .dynamic-form .ant-form-item{
    margin-bottom: 0px
  }

  .plus-container{
   text-align: center;
  }
  .plus-container .plus{
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    border: 1px dashed #e2e2e2;
    text-align: center;
    cursor: pointer;
  }
  .plus-container .plus .plus-icon{
    color: #e2e2e2;
    font-size: 40px;
  }
  .buttons-container{
    width: 98%;
    margin: 10px;
    height: 75px;
    min-height: 75px;
    padding-top:10px;
    border: 1px dashed #e2e2e2;
  }
  .buttons {
    height: 50px;
    line-height: 50px;
    float: right;
  }
  .buttons .button-item{
    margin-left: 10px;
  }
  .form-item-designer{
    border: 1px dashed #e2e2e2;
    padding-right: 25px;
    cursor: pointer;
    margin: 5px 5px 0 0;
    position: relative;
  }
  .form-item-designer-active{
    border: 1px dashed #1890ff;
    padding-right: 25px;
    cursor: pointer;
    margin: 5px 5px 0 0;
    position: relative;
  }
  .form-item-delete{
    color: #1890ff;
    font-size: 18px;
    position: absolute;
    right: 3px;
    top: 5px;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .btn-designer{
    padding: 0 10px 0 10px;
    display: inline-block;
    border: 1px dashed #1890ff;
    margin-left: 10px;
  }
ul{
  padding-inline-start: 0px;
}
</style>
