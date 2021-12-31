<template>
  <page-view :showHeader="false">
    <a-row>
      <a-col :span="15">
        <div class="design-container">
          <DynamicTable
            :designerMode="true"
            :config="config"
          />
          <a-card :title="headerDesignerTitle">
            <draggable
              element="ul"
              v-model="config.columnItems"
              @end="(e) => headerItemMoveEnd(e)">
              <transition-group type="transition" :name="'flip-list'">
                <span
                  :class="selectHeaderItemIndex === index ? 'item-active' : 'item'"
                  v-for="(item, index) in config.columnItems"
                  @click="()=>{handleHeaderItemSelect(index)}"
                  :key="'header_'+index">
                  {{ item.title }}
                  <span v-if="selectHeaderItemIndex === index">
                    |
                    <a-icon type="close-circle" @click="(e)=>{handleHeaderItemDelete(index, e)}"/></span>
                </span>
              </transition-group>
            </draggable>
          </a-card>
          <a-card :title="buttonDesignerTitle('line')">
            <draggable
              element="ul"
              v-model="config.buttons"
              @end="(e) => headerButtonMoveEnd(e,'line')">
              <transition-group type="transition" :name="'flip-list'">
                <span
                  :class="selectButtonItemIndex === index ? 'item-active' : 'item'"
                  v-for="(item, index) in config.buttons"
                  @click="()=>{handleButtonItemSelect(index,'line')}"
                  :key="'button_'+index">
                  <a-button :type="item.type || 'primary'">
                    {{ item.name }}
                  </a-button>
                  <span v-if="selectButtonItemIndex === index">
                    |
                    <a-icon type="close-circle" @click="(e)=>{handleButtonItemDelete(index, 'line')}"/>
                  </span>
                </span>
              </transition-group>
            </draggable>
          </a-card>
          <a-card :title="buttonDesignerTitle('top')">
            <draggable
              element="ul"
              v-model="config.topButtons"
              @end="(e) => headerButtonMoveEnd(e,'top')">
              <transition-group type="transition" :name="'flip-list'">
                <span
                  :class="selectButtonItemIndex === index ? 'item-active' : 'item'"
                  v-for="(item, index) in config.topButtons"
                  @click="()=>{handleButtonItemSelect(index,'top')}"
                  :key="'button_'+index">
                  <a-button :type="item.type || 'primary'">
                    {{ item.name }}
                  </a-button>
                  <span v-if="selectTopButtonItemIndex === index">
                    |
                    <a-icon type="close-circle" @click="(e)=>{handleButtonItemDelete(index, 'top')}"/>
                  </span>
                </span>
              </transition-group>
            </draggable>
          </a-card>
        </div>
      </a-col>
      <a-col :span="9">
        <div class="design-container">
          <a-tabs :activeKey="tabActiveKey" @change="(index)=>{this.tabActiveKey = index}" :animated="false">
            <a-tab-pane tab="表格属性" key="1">
              <DefintionConvertor
                :columnItems="config.columnItems"
                :formValue="columItemFormValue"
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
import DynamicTable from '@/components/DynamicTable'
import { componentConfigDefintion } from '@/components/DynamicTable/configDefintion/component'
import { columnItemConfigDefintion } from '@/components/DynamicTable/configDefintion/columnItem'
import { buttonConfigDefintion } from '@/components/DynamicTable/configDefintion/button'
import draggable from 'vuedraggable'
export default {
  name: 'TableDesigner',
  components: { PageView, DefintionConvertor, AceEditor, DynamicTable, draggable },
  props: {
    initConfig: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      tabActiveKey: '1',
      config: {},
      columnItemConfigDefintion: columnItemConfigDefintion,
      componentConfigDefintion: componentConfigDefintion,
      buttonConfigDefintion: buttonConfigDefintion,
      columItemFormValue: {},
      componentFormValue: {
        api: '/api/commonCrudService/commonPageQuery'
      },
      buttonFormValue: {},
      selectHeaderItemIndex: undefined,
      selectButtonItemIndex: undefined,
      selectTopButtonItemIndex: undefined,
      jsonValue: '',
      itemIndex: 0,
      buttonIndex: 0,
      buttonType: undefined
    }
  },
  watch: {
    initConfig: {
      immediate: true,
      handler (newValue) {
        this.config = newValue
        this.componentFormValue = this.config
        this.jsonValue = formatJson(this.config, null, 4)
      }
    }
  },
  computed: {
    headerDesignerTitle () {
      return (
        <div>
          <span>表头设计器</span>
          <span class="plus-container">
            <span class="plus" {...{ on: { click: () => { this.handleAddColumn() } } }}>
              <a-icon class="plus-icon" type="plus" />
            </span>
          </span></div>
      )
    },
    buttonDesignerTitle () {
      return function (type) {
        const text = type === 'line' ? '行内按钮设计器' : '顶部按钮设计器'
        return (
          <div>
            <span>{text}</span>
            <span class="plus-container">
              <span class="plus" {...{ on: { click: () => { this.handleAddButton(type) } } }}>
                <a-icon class="plus-icon" type="plus" />
              </span>
            </span></div>
        )
      }
    }
  },
  methods: {
    handleAddColumn () {
      const config = this.deepCopy(this.config)
      const columnItems = config.columnItems || []
      this.itemIndex++
      columnItems.push({
        title: '字段名' + this.itemIndex,
        dataIndex: 'column' + this.itemIndex
      })
      config.columnItems = columnItems
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
      this.handleHeaderItemSelect(columnItems.length - 1)
    },
    handleAddButton (type) {
      const config = this.deepCopy(this.config)
      this.buttonIndex++
      let buttons
      if (type === 'line') {
        buttons = config.buttons || []
      } else if (type === 'top') {
        buttons = config.topButtons || []
      }
      buttons.push({
        name: '按钮' + this.buttonIndex,
        type: 'primary'
      })
      if (type === 'line') {
        config.buttons = buttons
      } else if (type === 'top') {
        config.topButtons = buttons
      }
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
      this.handleButtonItemSelect(buttons.length - 1, type)
    },
    handleButtonItemSelect (index, type) {
      if (type === 'line') {
        this.selectButtonItemIndex = index
        this.selectTopButtonItemIndex = undefined
        this.buttonFormValue = this.config.buttons[index]
      } else if (type === 'top') {
        this.selectTopButtonItemIndex = index
        this.selectButtonItemIndex = undefined
        this.buttonFormValue = this.config.topButtons[index]
      }
      this.buttonType = type
      this.tabActiveKey = '2'
    },
    handleHeaderItemSelect (index) {
      this.selectHeaderItemIndex = index
      this.columItemFormValue = this.config.columnItems[index]
      this.tabActiveKey = '1'
    },
    handleHeaderItemDelete (index, event) {
      if (event) {
        // 阻止事件冒泡
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true
      }
      const config = this.deepCopy(this.config)
      const columnItems = config.columnItems || []
      columnItems.splice(index, 1)
      config.columnItems = columnItems
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
      if (index !== 0) {
        this.handleHeaderItemSelect(index - 1)
      }
    },
    handleButtonItemDelete (index, type) {
      if (event) {
        // 阻止事件冒泡
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true
      }
      const config = this.deepCopy(this.config)
      let buttons
      if (type === 'line') {
        buttons = config.buttons || []
      } else if (type === 'top') {
        buttons = config.topButtons || []
      }
      buttons.splice(index, 1)
      if (type === 'line') {
        config.buttons = buttons
      } else if (type === 'top') {
        config.topButtons = buttons
      }
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
      if (index !== 0) {
        this.handleButtonItemSelect(index - 1)
      }
    },
    handleColumnItemConfigChange (columnItem, value, formValue) {
      const config = this.deepCopy(this.config)
      const columnItems = config.columnItems || []
      columnItems[this.selectHeaderItemIndex] = formValue
      config.columnItems = columnItems
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
    handleButtonConfigChange (formItem, value, formValue) {
      const config = this.deepCopy(this.config)
      let buttons
      let selectedIndex
      if (this.buttonType === 'line') {
        buttons = config.buttons || []
        selectedIndex = this.selectButtonItemIndex
      } else if (this.buttonType === 'top') {
        buttons = config.topButtons || []
        selectedIndex = this.selectTopButtonItemIndex
      }
      buttons[selectedIndex] = formValue
      buttons.forEach(item => { delete item.click })
      if (this.buttonType === 'line') {
        config.buttons = buttons
      } else if (this.buttonType === 'top') {
        config.topButtons = buttons
      }
      this.config = config
      this.jsonValue = formatJson(this.config, null, 4)
    },
    headerItemMoveEnd (e) {
      this.selectHeaderItemIndex = e.newIndex
      this.handleHeaderItemSelect(this.selectHeaderItemIndex)
      this.config = this.deepCopy(this.config)
      this.jsonValue = formatJson(this.config, null, 4)
    },
    headerButtonMoveEnd (e, type) {
      this.handleButtonItemSelect(e.newIndex, type)
      this.config = this.deepCopy(this.config)
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
.plus-container{
  margin-left: 20px;
}
.plus-container .plus{
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 1px dashed #e2e2e2;
  text-align: center;
  cursor: pointer;
}
.plus-container .plus .plus-icon{
  color: #e2e2e2;
  font-size: 20px;
}
.item{
  padding: 5px 10px 5px 10px;
  display: inline-block;
  border: 1px dashed #e2e2e2;
  margin: 0 10px 5px 0;
  border-radius: 5px;
  cursor: pointer;
}

.item-active{
  padding: 5px 10px 5px 10px;
  display: inline-block;
  border: 1px dashed #1890ff;
  margin: 10px 10px 0 0;
  border-radius: 5px;
  cursor: pointer;
}
.design-container >>> .ant-card-body{
  padding: 10px 0px 0px 0px;
}
</style>
