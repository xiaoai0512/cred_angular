<template>
  <a-modal
    title="申请件转派"
    :visible="visible"
    :maskClosable="false"
    width="80%"
    @cancel="visible = false"
    :footer="null"
  >
    <DynamicCrudPage
      ref="crudPage"
      :showPageHeader="false"
      :config="config"
      @btnClick="handleBtnClick"
    />
  </a-modal>
</template>
<script>
import DynamicCrudPage from '@/components/DynamicCrudPage'
import ApiService from '@/api/api-service'
// 申请件转派页面
const pageConfigPk = '8af411ff8b824406803de81737cddb6e'
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
  watch: {
    '$store.getters.extendData': {
      immediate: true,
      handler (newValue) {
        if (newValue.handler === 'applyTransfer' && newValue.action === 'refresh') {
          this.$refs.crudPage.query()
          // 触发查询页面刷新
          this.$store.commit('PUT_EXTEND_DATA', { action: 'refresh', handler: 'dynamicTable' })
        }
      }
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
        // alert(JSON.stringify(this.paramValue))
        // 增加默认表单属性或查询属性
        config.forEach(item => {
          if (item.componentType === 'table') {
            item.configFormValue = [
              {
                prop: 'taskUser_EqualTo',
                valueType: 'realValue',
                value: this.paramValue.userId
              },
              {
                prop: 'taskPost_EqualTo',
                valueType: 'realValue',
                value: this.paramValue.postId
              }
            ]
          } else if (item.componentType === 'form') {
          }
        })
        this.config = config
      })
    },
    handleBtnClick (btnConfig, data) {
    }
  }
}
</script>
