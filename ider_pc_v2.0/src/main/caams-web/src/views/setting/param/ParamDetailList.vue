<template>
  <a-modal
    title="参数详情"
    :visible="visible"
    :maskClosable="false"
    width="80%"
    @cancel="visible = false"
    :footer="null"
  >
    <DynamicCrudPage
      :showPageHeader="false"
      :config="config"
    />
  </a-modal>
</template>
<script>
import DynamicCrudPage from '@/components/DynamicCrudPage'
import ApiService from '@/api/api-service'
// 参数详情页面配置ID
const pageConfigPk = '21bea4dec2764ee889058cbaed46d604'
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
                prop: 'groupPk_EqualTo',
                valueType: 'realValue',
                value: this.paramValue.pk
              }
            ]
          } else if (item.componentType === 'form') {
            item.configFormValue = [
              {
                prop: 'groupPk',
                valueType: 'realValue',
                value: this.paramValue.pk
              }
            ]
          }
        })
        this.config = config
      })
    }
  }
}
</script>
