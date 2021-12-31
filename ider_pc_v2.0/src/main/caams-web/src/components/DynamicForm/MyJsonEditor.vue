<template>
  <a-modal
    title="JSON编辑器"
    :visible="visible"
    :maskClosable="false"
    @close="visible=false"
    width="95%"
    @cancel="visible=false"
    cancelText="取消"
    okText="确定"
    @ok="handleOk"
  >
    <a-row>
      <a-col :span="11">
        <div class="json-tree-container">
          <JsonEditor
            :options="{
              confirmText: '保存',
              cancelText: '取消',
            }"
            :objData="jsonData"
            v-model="jsonData" >
          </JsonEditor>
        </div>
      </a-col>
      <a-col :span="13">
        <div class="json-container">
          <AceEditor
            ref="jsonContent"
            @change="handleJsonChange"
            :content="jsonValue"></AceEditor>
        </div>
        <span v-if="error" style="color:red">JSON格式不正确</span>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import formatJson from 'format-json-pretty'
import AceEditor from './AceEditor'
export default {
  components: { AceEditor },
  props: {
    initData: {
      type: Object,
      default () {
        return {
          columnName: '',
          jsonData: {}
        }
      }
    }
  },
  data () {
    return {
      visible: false,
      jsonData: {},
      jsonValue: '',
      error: false
    }
  },
  watch: {
    initData: {
      immediate: true,
      handler (newValue, oldValue) {
        this.jsonData = newValue.jsonData || {}
      }
    },
    jsonData: {
      immediate: true,
      handler (newValue, oldValue) {
        this.jsonValue = formatJson(newValue)
      }
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handleOk () {
      if (!this.error) {
        this.$emit('handleOk', this.initData.columnName, this.jsonValue)
        this.visible = false
      }
    },
    handleJsonChange (jsonValue) {
      this.jsonValue = jsonValue
      try {
        this.jsonData = JSON.parse(jsonValue)
        this.error = false
      } catch (e) {
        this.error = true
      }
    }
  }
}
</script>
<style scoped>
  .json-tree-container{
    height: 600px;
    overflow: auto;
  }
  .json-container{
    height: 600px;
    border: solid 1px #e2e2e2;
    padding: 1px 1px 0 0;
    margin-left: 10px;
  }
</style>
