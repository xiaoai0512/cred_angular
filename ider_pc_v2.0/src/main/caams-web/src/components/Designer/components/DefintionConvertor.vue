<template>
  <div style="padding:0 20px 0 20px;margin-bottom:100px">
    <DynamicForm
      :config="dynamicFormConfig"
      :formValue="originalFormValue"
      @change="handleChange"/>
    <a-form style="margin-top:-15px" v-show="showController" layout="vertical">
      <a-form-item :label="controllerLabel">
        <a-row style="margin-bottom:10px;" v-for="(item, index) in controller" :key="index">
          <a-col :span="4">
            <a-input
              placeholder="字段值"
              :value="item.value"
              @change="(e)=>handleControllerChange('value',e.target.value,index)"/>
          </a-col>
          <a-col :span="19">
            <a-select
              mode="multiple"
              :value="item.showColumns"
              placeholder="请选择控制字段"
              @change="(value)=>handleControllerChange('column',value,index)">
              <a-select-option
                v-for="(item2, index2) in columnItems"
                :value="item2.columnName"
                :key="index2">
                {{ item2.label }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="1">
            <a-icon
              style="color:#1890ff;font-size:20px;margin:5px 0px 0px 5px;cursor:pointer"
              @click="()=>handleMinusController(index)"
              type="minus-circle" />
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>

    <a-form style="margin-top:-15px" v-show="showFormValue" layout="vertical">
      <a-form-item :label="formValueLabel">
        <a-row style="margin-bottom:10px;" v-for="(item, index) in configFormValue" :key="index">
          <a-col :span="7">
            <a-input
              placeholder="字段名称"
              :value="item.prop"
              @change="(e)=>handleFormValueChange('prop',e.target.value,index)"/>
          </a-col>
          <a-col :span="8">
            <a-select
              :value="item.valueType"
              placeholder="值获取类型"
              @change="(value)=>handleFormValueChange('valueType',value,index)">
              <a-select-option value="realValue">值等于</a-select-option>
              <a-select-option value="mapValue">映射参数字段</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8">
            <a-input
              placeholder="值或参数字段名称"
              :value="item.value"
              @change="(e)=>handleFormValueChange('value',e.target.value,index)"/>
          </a-col>
          <a-col :span="1">
            <a-icon
              style="color:#1890ff;font-size:20px;margin:5px 0px 0px 5px;cursor:pointer"
              @click="()=>handleMinusFormValue(index)"
              type="minus-circle" />
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
export default {
  name: 'DefintionConvertor',
  components: { DynamicForm },
  props: {
    configDefinition: {
      type: Object,
      default () {
        return {}
      }
    },
    formValue: {
      type: Object,
      default () {
        return {}
      }
    },
    columnItems: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dynamicFormConfig: {},
      originalFormValue: undefined,
      showController: false,
      showFormValue: false,
      controller: [],
      showFormValueTitle: undefined,
      configFormValue: []
    }
  },
  computed: {
    controllerLabel () {
      return (
        <span>
          <span>控制器</span>
          <span>
            <a-icon
              style="color:#1890ff;font-size:15px;margin-left:20px;cursor:pointer"
              type="plus-circle"
              {...{ on: { click: () => { this.handleAddController() } } }}
            />
          </span>
        </span>
      )
    },
    formValueLabel () {
      return (
        <span>
          <span>{ this.showFormValueTitle }</span>
          <span>
            <a-icon
              style="color:#1890ff;font-size:15px;margin-left:20px;cursor:pointer"
              type="plus-circle"
              {...{ on: { click: () => { this.handleAddFormValue() } } }}
            />
          </span>
        </span>
      )
    }
  },
  watch: {
    configDefinition: {
      immediate: true,
      handler (newValue) {
        // 配置转化为表单配置
        const dynamicFormConfig = {}
        dynamicFormConfig.formLayout = 'vertical'
        dynamicFormConfig.lineColumnCount = 1
        const columnItems = []
        for (const key in newValue) {
          if (key === 'controller') {
            this.showController = true
          } else if (key === 'formValue') {
            this.showFormValue = true
            this.showFormValueTitle = newValue[key].title
          } else {
            columnItems.push({
              columnName: key,
              type: newValue[key].type,
              label: newValue[key].name,
              dataItems: newValue[key].dataItems,
              dataName: newValue[key].dataName,
              controller: newValue[key].controller,
              hidden: newValue[key].hidden,
              disabled: newValue[key].disabled,
              defaultValue: newValue[key].defaultValue,
              showSearch: newValue[key].showSearch,
              selectInput: newValue[key].selectInput,
              selectMode: newValue[key].selectMode,
              displayInline: newValue[key].displayInline,
              textColumnName: newValue[key].textColumnName
            })
          }
        }
        dynamicFormConfig.columnItems = columnItems
        this.dynamicFormConfig = dynamicFormConfig
      }
    },
    formValue: {
      immediate: true,
      handler (newValue) {
        this.originalFormValue = newValue
        this.controller = newValue.controller || []
        this.configFormValue = newValue.configFormValue || []
      }
    },
    columnItems: {
      immediate: true,
      handler (newValue) {
        this.columnItems = newValue
      }
    }
  },
  methods: {
    handleChange (formItem, value, formValue) {
      if (formValue.showCondition) {
        try {
          formValue.showCondition = JSON.parse(formValue.showCondition)
        } catch (e) {
          this.$message.error('字段显示条件格式错误，必须为JSON格式')
        }
      }
      this.originalFormValue = {
        ...this.originalFormValue,
        ...formValue
      }
      // 移出undefined字段
      for (const key in this.originalFormValue) {
        if (this.originalFormValue[key] === undefined) {
          delete this.originalFormValue[key]
        }
      }
      this.$emit('change', formItem, value, this.originalFormValue)
    },
    handleAddController () {
      const controller = this.deepCopy(this.controller)
      controller.push({})
      this.controller = controller
    },
    handleMinusController (index) {
      const controller = this.deepCopy(this.controller)
      controller.splice(index, 1)
      this.controller = controller
      this.handleControllerOrFormValueChange('controller')
    },
    handleControllerChange (type, value, index) {
      const controller = this.deepCopy(this.controller)
      if (type === 'value') {
        controller[index].value = value
      } else if (type === 'column') {
        controller[index].showColumns = value
      }
      this.controller = controller
      if (this.controller[index].value && this.controller[index].showColumns) {
        this.handleControllerOrFormValueChange('controller')
      }
    },
    handleControllerOrFormValueChange (type) {
      const originalFormValue = this.deepCopy(this.originalFormValue)
      if (type === 'controller') {
        originalFormValue.controller = this.controller
          .filter(item => item.value && item.showColumns)
      } else if (type === 'formValue') {
        originalFormValue.configFormValue = this.configFormValue
          .filter(item => item.prop && item.valueType && item.value)
      }
      this.originalFormValue = originalFormValue
      // 移出undefined字段
      for (const key in this.originalFormValue) {
        if (this.originalFormValue[key] === undefined) {
          delete this.originalFormValue[key]
        }
      }
      this.$emit('change', {}, null, this.originalFormValue)
    },
    handleAddFormValue () {
      const configFormValue = this.deepCopy(this.configFormValue)
      configFormValue.push({})
      this.configFormValue = configFormValue
    },
    handleMinusFormValue (index) {
      const configFormValue = this.deepCopy(this.configFormValue)
      configFormValue.splice(index, 1)
      this.configFormValue = configFormValue
      this.handleControllerOrFormValueChange('formValue')
    },
    handleFormValueChange (type, value, index) {
      const configFormValue = this.deepCopy(this.configFormValue)
      if (type === 'prop') {
        configFormValue[index].prop = value
      } else if (type === 'valueType') {
        configFormValue[index].valueType = value
      } else if (type === 'value') {
        configFormValue[index].value = value
      }
      this.configFormValue = configFormValue
      if (this.configFormValue[index].prop &&
        this.configFormValue[index].valueType &&
        this.configFormValue[index].value) {
        this.handleControllerOrFormValueChange('formValue')
      }
    }
  }
}
</script>
