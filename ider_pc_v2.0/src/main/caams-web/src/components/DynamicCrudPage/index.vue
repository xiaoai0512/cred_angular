<template>
  <page-view :showHeader="showHeader">
    <div v-for="(item, index) in pageConfig" :key="index">
      <div
        :class="designerMode?'designer-contianer':''"
        v-if="item.componentType === 'form' && (item.type === 'default' || designerMode)">
        <dynamic-form
          :ref="item.id || getFormId()"
          @btnClick="(btnConfig, data) => handleFormBtnClick(btnConfig, data)"
          :config="item" />
      </div>
      <div
        :class="designerMode?'designer-contianer':''"
        v-if="item.componentType === 'form' && item.type === 'dialog' && !designerMode">
        <dynamic-dialog-form
          :ref="item.opType"
          @btnClick="(btnConfig, data) => handleFormBtnClick(btnConfig, data)"
          :config="item" />
      </div>
    </div>
    <div
      :class="designerMode?'designer-contianer':''">
      <a-tabs
        v-if="multiTableConfig.length > 1"
        :activeKey="tabActiveKey"
        @change="(activeKey)=> tabActiveKey = activeKey"
        type="card">
        <a-tab-pane
          v-for="(tableConfig, tabIndex) in multiTableConfig"
          :tab="tableConfig.name"
          :key="tabIndex"></a-tab-pane>
      </a-tabs>
      <dynamic-table
        v-if="multiTableConfig.length > 0"
        @getQueryFormData="getQueryFormData"
        :queryCondition="queryCondition"
        :designerMode="designerMode"
        :ref="multiTableConfig[tabActiveKey].id"
        @btnClick="(btnConfig, data) => handleTableBtnClick(btnConfig, data)"
        :config="multiTableConfig[tabActiveKey]" />
    </div>
  </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import DynamicForm from '@/components/DynamicForm'
import DynamicDialogForm from '@/components/DynamicDialogForm'
import DynamicTable from '@/components/DynamicTable'
import { getUUID } from '../_util/util'
// 查询条件存储KEY
const QUERY_CONDITION_KEY = 'QUERY_CONDITION_KEY_'
// import ApiService from '@/api/api-service'
// import { handleFormValue, handleRefObj, disabledAllColumnItems } from '@/components/_util/util'
export default {
  name: 'DynamicCrudPage',
  components: { PageView, DynamicForm, DynamicDialogForm, DynamicTable },
  props: {
    config: {
      type: Array,
      default () {
        return []
      }
    },
    designerMode: {
      type: Boolean,
      default () {
        return false
      }
    },
    showPageHeader: {
      type: Boolean,
      default () {
        return true
      }
    },
    pagePk: {
      type: String,
      default () {
        return undefined
      }
    }
  },
  data () {
    return {
      queryCondition: {},
      pageConfig: [],
      showHeader: true,
      multiTableConfig: [],
      tabActiveKey: 0
    }
  },
  watch: {
    config: {
      immediate: true,
      handler (newValue, oldValue) {
        this.initConfig(newValue)
      }
    },
    showPageHeader: {
      immediate: true,
      handler (newValue) {
        this.showHeader = newValue
      }
    },
    pagePk: {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          this.post('/api/dyPageService/queryPageConfig', { pagePk: newValue }, (res) => {
            let pageConfig = res.pageConfig || '[]'
            pageConfig = JSON.parse(pageConfig)
            this.config = pageConfig
          })
        }
      }
    },
    '$route': {
      immediate: true,
      handler (newValue) {
        const queryConditionKey = QUERY_CONDITION_KEY + this.$route.name
        let queryCondition = sessionStorage.getItem(queryConditionKey)
        // 当路由变化触发时，为打开该页面，设置打开页面标识
        queryCondition = JSON.parse(queryCondition) || {}
        queryCondition.openPage = 'T'
        this.queryCondition = queryCondition
        this.tabActiveKey = 0
        console.info(queryConditionKey, this.queryCondition)
      }
    },
    queryCondition: {
      immediate: true,
      handler (newValue) {
        // 将查询条件放入session中
        const queryConditionKey = QUERY_CONDITION_KEY + this.$route.name
        sessionStorage.setItem(queryConditionKey, JSON.stringify(this.queryCondition))
      }
    }
  },
  methods: {
    initConfig (newValue) {
      if (newValue.length === 0) {
        return
      }
      newValue.forEach(item => {
        // 查询表单设置原查询值
        if (item.componentType === 'form' && item.isQuery === 'T') {
          item.formValue = this.queryCondition
        }
      })
      // 处理多表格自动组合成Tab页
      const multiTableConfig = []
      newValue.forEach((item, index) => {
        if (item.componentType === 'table') {
          multiTableConfig.push(item)
        }
      })
      this.multiTableConfig = multiTableConfig
      this.pageConfig = newValue
    },
    handleFormBtnClick (btnConfig, data) {
      if (['add'].indexOf(btnConfig.action) !== -1) {
        this.$refs[btnConfig.action][0].show()
      } else if (btnConfig.action === 'query') {
        let queryCondition = this.deepCopy(data) || {}
        if (btnConfig.autoQuery) {
          // 当需要在其他操作完成后自动执行查询，重置查询条件引用
          queryCondition = this.deepCopy(this.queryCondition)
        }
        queryCondition.triggerQuery = btnConfig.triggerQuery
        queryCondition.openPage = 'F'
        this.queryCondition = queryCondition
      }
      this.$emit('btnClick', btnConfig, data)
    },
    handleTableBtnClick (btnConfig, data) {
      if (['edit', 'detail', 'check', 'clone'].indexOf(btnConfig.action) !== -1) {
        this.$refs[btnConfig.action][0].show()
        this.$refs[btnConfig.action][0].initFormValue(data)
      }
      this.$emit('btnClick', btnConfig, data)
    },
    query () {
      // 触发查询，重置查询条件变量，会触发表格重新查询
      this.queryCondition = this.deepCopy(this.queryCondition)
    },
    getQueryFormData (callback) {
      // 获取查询表单数据
      const queryFormConfig = this.config.filter(item => item.isQuery === 'T')[0]
      if (queryFormConfig) {
        this.$refs[queryFormConfig.id][0].getFormData(res => {
          callback && callback(res)
        })
      }
    },
    getFormId () {
      // 当formId为空时，获取formId
      return getUUID()
    }
  }
}
</script>
<style scoped>
  .designer-contianer{
    border: 1px dashed #1890ff;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
  }
</style>
