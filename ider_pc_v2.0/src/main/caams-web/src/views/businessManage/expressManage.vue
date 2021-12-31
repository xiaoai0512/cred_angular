<template>
  <a-modal
    title="快递列表详情"
    :visible="visible"
    :maskClosable="false"
    width="80%"
    @cancel="visible = false"
    :footer="null"
  >
    <DynamicCrudPage
      :showPageHeader="false"
      :config="config"
      @btnClick="handleBtnClick"
    />
  </a-modal>
</template>
<script>
import DynamicCrudPage from '@/components/DynamicCrudPage'
import ApiService from '@/api/api-service'
// 快递列表详情
const pageConfigPk = '29af877fe02244ecaaeb1bb28c658f3b'
export default {
  name: 'ParamDetailList',
  components: { DynamicCrudPage },
  props: {
    paramValue: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      visible: true,
      config: undefined
    }
  },
  created () {
    this.queryPageConfig(pageConfigPk)
  },
  methods: {
    queryPageConfig (pagePk) {
      ApiService.post('/api/dyPageService/queryPageConfig', { pagePk: pagePk }, (res) => {
        let pageConfig = res.pageConfig || '[]'
        pageConfig = JSON.parse(pageConfig)
        const config = pageConfig.map(item => JSON.parse(item))
        // 增加默认表单属性或查询属性
        config.forEach(item => {
          if (item.componentType === 'table') {
            item.configFormValue = [
              {
                prop: 'batchPk_EqualTo',
                valueType: 'realValue',
                value: this.paramValue.batchId
              }
            ]
          } else if (item.componentType === 'form') {
            item.formValue = this.paramValue
          }
        })
        this.config = config
      })
    },
    handleBtnClick (btnConfig) {
      // alert(btnConfig.name)
      // this.visible = false
    }
  }
}
</script>
