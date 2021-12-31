<template>
  <div class="approve-page" :style="`height:${height};overflow:auto`">
    <a-tabs
      v-if="inTabConfigList.length > 1"
      @change="handleTabChange"
      :activeKey="activeTabKey"
      type="card">
      <a-tab-pane
        v-for="(item, index) in tabNameList"
        :tab="tabTitle(item)"
        :key="index"/>
    </a-tabs>
    <div class="tab-content" v-if="inTabConfigList.length > 1">
      <div
        v-for="(item, index) in inTabComponentMap.get(tabNameList[activeTabKey])"
        :key="index">
        <!--平铺展示--->
        <div style="padding:5px">
          <dynamic-form
            :formValue="paramValue"
            v-if="item.componentType === 'form'"
            :config="item" />
          <dynamic-table
            :queryCondition="paramValue"
            v-if="item.componentType === 'table'"
            :config="item" />
          <component
            :paramValue="paramValue"
            :config="item"
            :applyId="paramValue.applyId"
            v-if="dynamicComponentMap && item.componentType === 'selfDefined'"
            :is="dynamicComponentMap.get(item.componentPath)"/>
        </div>
      </div>
      <!--弹出框展示-->
      <a-modal
        v-if="dblclickTab"
        :title="dblclickTab"
        :visible="true"
        width="99%"
        :maskClosable="false"
        @close="dblclickTab = undefined"
        @cancel="dblclickTab = undefined"
        :footer="null">
        <div
          style="padding:1px"
          v-for="(item, index) in inTabComponentMap.get(dblclickTab)"
          :key="index">
          <dynamic-form
            :formValue="paramValue"
            v-if="item.componentType === 'form'"
            :config="item" />
          <dynamic-table
            :queryCondition="paramValue"
            v-if="item.componentType === 'table'"
            :config="item" />
          <component
            :paramValue="paramValue"
            :config="item"
            :applyId="paramValue.applyId"
            v-if="dynamicComponentMap && item.componentType === 'selfDefined'"
            :is="dynamicComponentMap.get(item.componentPath)"/>
        </div>
      </a-modal>
    </div>
    <div v-for="(item, index) in notInTabConfigList" :key="index">
      <div
        :name="item.name"
        :class="designerMode?'designer-contianer':''">
        <a-card :title="item.name" style="margin-bottom:5px">
          <dynamic-form
            v-if="item.componentType === 'form'"
            :ref="item.id"
            :formValue="paramValue"
            @btnClick="(btnConfig, data) => handleFormBtnClick(btnConfig, data)"
            :config="item" />
          <dynamic-table
            :queryCondition="paramValue"
            v-if="item.componentType === 'table'"
            :config="item" />
          <component
            :ref="item.id"
            :config="item"
            :paramValue="paramValue"
            v-if="dynamicComponentMap && item.componentType === 'selfDefined'"
            :is="dynamicComponentMap.get(item.componentPath)"/>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
import DynamicTable from '@/components/DynamicTable'
import HashMap from 'hashmap'
export default {
  name: 'DynamicApprovePage',
  components: { DynamicForm, DynamicTable },
  props: {
    config: {
      type: Array,
      default: () => { return [] }
    },
    paramValue: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      activeTabKey: 0,
      height: undefined,
      tabHeight: undefined,
      pageConfig: [],
      inTabConfigList: [], // 在tab页中展示的列表
      notInTabConfigList: [], // 非tab页中展示的列表,
      tabNameList: [],
      designerMode: 'T',
      dynamicComponentMap: new HashMap(),
      inTabComponentMap: new HashMap(),
      dblclickTab: undefined
    }
  },
  computed: {
    dynamicComponent () {
      return function (componentPath) {
        if (componentPath.substring(0, 1) === '/') {
          componentPath = componentPath.substring(1, componentPath.length)
        }
        return (resolve) => require([`@/views/${componentPath}`], resolve)
      }
    },
    tabTitle () {
      return function (title) {
        return (
          <span class='tab-title'
            {...{ on: { dblclick: () => { this.handleTabDblclick(title) } } }}>{title}</span>
        )
      }
    }
  },
  watch: {
    config: {
      immediate: true,
      handler (newValue) {
        const inTabConfigList = []
        const notInTabConfigList = []
        newValue.forEach(item => {
          if (item.isInTab === 'T') {
            inTabConfigList.push(item)
          } else {
            notInTabConfigList.push(item)
          }
        })
        const inTabComponentMap = new HashMap()
        inTabConfigList.forEach(item => {
          const componentList = inTabComponentMap.get(item.tabName) || []
          componentList.push(item)
          inTabComponentMap.set(item.tabName, componentList)
        })
        this.inTabComponentMap = inTabComponentMap
        this.tabNameList = inTabComponentMap.keys()
        this.inTabConfigList = inTabConfigList
        this.notInTabConfigList = notInTabConfigList
        this.pageConfig = newValue

        // 初始化动态组件
        const dynamicComponentMap = new HashMap()
        newValue.forEach(item => {
          if (item.componentType === 'selfDefined') {
            let componentPath = item.componentPath
            if (componentPath.substring(0, 1) === '/') {
              componentPath = componentPath.substring(1, componentPath.length)
            }
            dynamicComponentMap.set(item.componentPath, (resolve) => require([`@/views/${componentPath}`], resolve))
          }
        })
        this.dynamicComponentMap = dynamicComponentMap
      }
    }
  },
  created () {
    const clientHeight = document.documentElement.clientHeight
    this.height = (clientHeight - 210) + 'px'
  },
  methods: {
    handleTabChange (key) {
      this.activeTabKey = key
    },
    handleTabDblclick (title) {
      this.dblclickTab = title
    },
    async getPageData (formIds, callback, validateData = true) {
      const obj = {}
      let hasError = false
      for (let i = 0; i < formIds.length; i++) {
        const id = formIds[i]
        await this.getFormData(this.$refs[id][0], validateData).then(res => {
          console.info(res)
          if (!res) {
            hasError = true
          } else {
            obj[id] = res
          }
        })
      }
      if (hasError) {
        callback && callback()
      } else {
        callback && callback(obj)
      }
    },
    getFormData (form, validateData) {
      return new Promise(resolve => {
        form.getFormData(res => {
          resolve(res)
        }, validateData)
      })
    }
  }
}
</script>
<style scoped>
  .approve-page .tab-content{
    height: 300px;
    overflow: auto;
    border:1px solid #e2e2e2;
    margin-bottom: 10px;
    margin-top: -20px;
    border-top: 0px;
  }
  .approve-page >>> .ant-card-body{
    padding:1px 10px 0 10px;
  }
  .approve-page >>> .ant-card-head{
    min-height: 40px;
    line-height: 40px;
  }
  .approve-page >>> .ant-card-head-wrapper{
    height: 40px;
    line-height: 40px;
  }
  .approve-page .title{
    margin-top: 10px;;
    border-bottom: 2px solid #1890ff;
    height: 30px;
    font-size: 14px;
    color: #1890ff;
    font-weight: bold;
    line-height: 30px;
  }
  .approve-page .tab-title{
    display: inline-block;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select :none;
  }
</style>
