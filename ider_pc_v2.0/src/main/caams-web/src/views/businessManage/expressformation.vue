<template>
  <a-modal
    title="申请件信息查询"
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
// 申请件信息查询
const pageConfigPk = '05b5f38d53bc4afc9957dd1a8368955b'
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
                prop: 'cnName_Like',
                valueType: 'realValue',
                value: this.paramValue.addressName
              },
              {
                prop: 'mobile_EqualTo',
                valueType: 'realValue',
                value: this.paramValue.addressPhone
              },
              {
                prop: 'cardAccount_Like',
                valueType: 'realValue',
                value: this.paramValue.cardAcct
              }
            ]
          } else if (item.componentType === 'form') {
            debugger
            item.formValue = [
              {
                prop: 'cnName_Like',
                valueType: 'realValue',
                value: this.paramValue.addressName
              },
              {
                prop: 'mobile_EqualTo',
                valueType: 'realValue',
                value: this.paramValue.addressPhone
              },
              {
                prop: 'cardAccount_Like',
                valueType: 'realValue',
                value: this.paramValue.cardAcct
              }
            ]
          }
        })
        this.config = config
      })
    },
    handleBtnClick (btnConfig) {
      if (btnConfig.id === 'applySure') {
        this.visible = false
      }
    }
  }
}
</script>
