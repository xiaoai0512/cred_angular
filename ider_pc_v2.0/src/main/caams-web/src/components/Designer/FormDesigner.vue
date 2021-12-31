<template>
  <page-view :showHeader="false">
    <a-row>
      <a-col :span="15">
        <div class="design-container">
          <DynamicForm
            :config="config"
            @itemAdd="handleItemAdd"
            @itemSelect="handleItemSelect"
            @itemDelete="hanldeItemDelete"
            @btnAdd="handleBtnAdd"
            @btnDelete="handleBtnDelete"
            @btnSelect="handleBtnSelect"
            @moveComplete="handleMoveComplete"
            @btnMoveComplete="handleBtnMoveComplete"
            :designerMode="true"/>
        </div>
      </a-col>
      <a-col :span="9">
        <div class="design-container">
          <a-tabs :activeKey="tabActiveKey" @change="(index)=>{this.tabActiveKey = index}" :animated="false">
            <a-tab-pane tab="表单属性" key="1">
              <DefintionConvertor
                :columnItems="config.columnItems"
                :formValue="designerFormValue"
                @change="handleColumnItemConfigChange"
                :configDefinition="columnItemConfigDefintion"/>
            </a-tab-pane>
            <a-tab-pane tab="按钮属性" key="2" forceRender>
              <DefintionConvertor
                :formValue="buttonFormValue"
                @change="handleButtonConfigChange"
                :configDefinition="buttonConfigDefintion"/>
            </a-tab-pane>
            <a-tab-pane tab="组件属性" key="3" forceRender>
              <DefintionConvertor
                :formValue="config"
                @change="handleComponnetConfigChange"
                :configDefinition="componentConfigDefintion"/>
            </a-tab-pane>
            <a-tab-pane tab="JSON" key="4" forceRender>
              <div class="json-container">
                <AceEditor
                  :readOnly="true"
                  ref="jsonContent"
                  :content="jsonValue"></AceEditor>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import DefintionConvertor from './components/DefintionConvertor'
import AceEditor from '@/components/DynamicForm/AceEditor'
import formatJson from 'format-json-pretty'
import DynamicForm from '@/components/DynamicForm'
import { columnItemConfigDefintion } from '@/components/DynamicForm/configDefintion/columnItem'
import { buttonConfigDefintion } from '@/components/DynamicForm/configDefintion/button'
import { componentConfigDefintion } from '@/components/DynamicForm/configDefintion/component'
export default {
  name: 'FormDesigner',
  components: { PageView, DefintionConvertor, AceEditor, DynamicForm },
  props: {
    initConfig: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      config: {},
      columnItemConfigDefintion: columnItemConfigDefintion,
      buttonConfigDefintion: buttonConfigDefintion,
      componentConfigDefintion: componentConfigDefintion,
      designerFormValue: {},
      selectItemIndex: undefined,
      selectBtnIndex: undefined,
      jsonValue: '',
      itemIndex: 0,
      btnIndex: 0,
      buttonFormValue: {},
      tabActiveKey: '1'
    }
  },
  watch: {
    initConfig: {
      immediate: true,
      handler (newValue) {
        this.config = newValue
        this.jsonValue = formatJson(this.config, null, 4)
      }
    }
  },
  mounted () {
  },
  methods: {
    handleItemAdd (type) {
      const config = this.deepCopy(this.config)
      const columnItems = config.columnItems || []
      this.itemIndex++
      columnItems.push({
        type: 'input',
        label: '字段名' + this.itemIndex,
        columnName: 'column' + this.itemIndex
      })
      config.columnItems = columnItems
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
    },
    handleBtnAdd () {
      const config = this.deepCopy(this.config)
      const buttons = config.buttons || []
      this.btnIndex++
      buttons.push({
        name: '按钮' + this.btnIndex,
        type: 'primary'
      })
      config.buttons = buttons
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
      // this.handleButtonItemSelect(buttons.length - 1)
    },
    handleItemSelect (itemIndex) {
      const item = this.deepCopy(this.config.columnItems[itemIndex])
      const validateColumns = {}
      // 规则列表转换为对象
      const rules = item.rules || []
      rules.forEach(item => {
        if (item.hasOwnProperty('required')) {
          validateColumns.required = item.required ? 'T' : 'F'
        }
        if (item.hasOwnProperty('min')) {
          validateColumns.min = item.min
        }
        if (item.hasOwnProperty('max')) {
          validateColumns.max = item.max
        }
        if (item.hasOwnProperty('pattern')) {
          validateColumns.pattern = item.pattern
        }
        if (item.hasOwnProperty('selfValidator')) {
          validateColumns.selfValidator = item.selfValidator
        }
      })
      this.designerFormValue = {
        ...item,
        ...validateColumns
      }
      this.selectItemIndex = itemIndex
      this.tabActiveKey = '1'
    },
    hanldeItemDelete (itemIndex) {
      const config = this.deepCopy(this.config)
      config.columnItems.splice(itemIndex, 1)
      this.config = config
      this.selectItemIndex = undefined
      this.jsonValue = formatJson(this.config, null, 4)
    },
    handleBtnDelete (itemIndex) {
      const config = this.deepCopy(this.config)
      config.buttons.splice(itemIndex, 1)
      this.config = config
      this.selectBtnIndex = undefined
      this.jsonValue = formatJson(this.config, null, 4)
    },
    handleBtnSelect (itemIndex) {
      const item = this.deepCopy(this.config.buttons[itemIndex])
      this.buttonFormValue = item
      this.selectBtnIndex = itemIndex
      this.tabActiveKey = '2'
    },
    handleColumnItemConfigChange (columnItem, value, formValue) {
      if (this.selectItemIndex || this.selectItemIndex === 0) {
        // 移出undefined字段
        for (const key in formValue) {
          if (formValue[key] === undefined) {
            delete formValue[key]
          }
        }
        // 处理showCondition字段
        if (formValue.showCondition && typeof (formValue.showCondition) === 'object') {
          formValue.showCondition = JSON.stringify(formValue.showCondition)
        }
        const config = this.deepCopy(this.config)
        const columnItems = config.columnItems
        // 组装验证器
        formValue.required = formValue.required === 'T'
        const rules = []
        if (formValue.required !== undefined) {
          const obj = {
            required: formValue.required
          }
          if (formValue.required) {
            obj.message = `${formValue.label}不能为空`
          }
          rules.push(obj)
        }
        if (formValue.min !== undefined && /^[0-9]+$/.test(formValue.min)) {
          rules.push({
            min: parseInt(formValue.min),
            message: `${formValue.label}长度不能小于${formValue.min}`
          })
        }
        if (formValue.max !== undefined && /^[0-9]+$/.test(formValue.max)) {
          rules.push({
            max: parseInt(formValue.max),
            message: `${formValue.label}长度不能大于${formValue.max}`
          })
        }
        if (formValue.pattern !== undefined) {
          rules.push({
            pattern: formValue.pattern,
            message: `${formValue.label}不符合正则${formValue.pattern}规则`
          })
        }
        if (formValue.selfValidator !== undefined) {
          rules.push({
            selfValidator: formValue.selfValidator
          })
        }
        delete formValue.min
        delete formValue.max
        delete formValue.pattern
        delete formValue.selfValidator
        delete formValue.required
        formValue.rules = rules
        columnItems[this.selectItemIndex] = formValue
        config.columnItems = columnItems
        this.config = config
        this.jsonValue = formatJson(this.config, null, 4)
        this.handleItemSelect(this.selectItemIndex)
      }
    },
    handleButtonConfigChange (formItem, value, formValue) {
      const config = this.deepCopy(this.config)
      const buttons = config.buttons || []
      buttons[this.selectBtnIndex] = formValue
      buttons.forEach(item => { delete item.click })
      config.buttons = buttons
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
    },
    handleComponnetConfigChange (formItem, value, formValue) {
      // 移出undefined字段
      for (const key in formValue) {
        if (formValue[key] === undefined) {
          delete formValue[key]
        }
      }
      this.config = formValue
      this.jsonValue = formatJson(this.config, null, 4)
    },
    handleMoveComplete (columnItems) {
      const config = this.deepCopy(this.config)
      config.columnItems = columnItems
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
    },
    handleBtnMoveComplete (buttons) {
      const config = this.deepCopy(this.config)
      config.buttons = buttons
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
    },
    getConfig () {
      return this.config
    }
  }
}
</script>
<style scoped>
  .design-container{
    margin-top: 2px;
    border:1px solid #e2e2e2;
    height:600px;background:white;
    margin-left:10px;
    overflow: auto;
  }
  .json-container{
    height: 550px;
    border: solid 1px #e2e2e2;
    padding: 1px 1px 0 0;
  }
</style>
