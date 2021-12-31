<template>
  <page-view>
    <a-row>
      <a-col :span="15">
        <div class="design-container">
          <DynamicTab
            :config="config"
            :designerMode="true"/>
        </div>
      </a-col>
      <a-col :span="9">
        <div class="design-container">
          <a-tabs defaultActiveKey="1" :animated="false">
            <a-tab-pane tab="组件属性" key="2" forceRender>
              <DefintionConvertor
                :formValue="componentFormValue"
                @change="handleComponnetConfigChange"
                :configDefinition="componentConfigDefintion"/>
            </a-tab-pane>
            <a-tab-pane tab="JSON" key="3" forceRender>
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
import DynamicTab from '@/components/DynamicTab'
// import formatJson from 'format-json-pretty'
export default {
  name: 'TabDesigner',
  components: { PageView, DefintionConvertor, AceEditor, DynamicTab },
  data () {
    return {
      componentFormValue: {},
      componentConfigDefintion: undefined,
      jsonValue: '',
      config: {
        tabs: [
          {
            tabName: '11111'
          },
          {
            tabName: '22222'
          }
        ]
      }
    }
  },
  methods: {
    handleComponnetConfigChange () {

    }
  }
}
</script>
<style scoped>
  .design-container{
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
