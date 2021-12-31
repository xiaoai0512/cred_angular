<template>
  <a-modal
    :title="`${postName}-审批页`"
    :visible="visible"
    width="99%"
    @close="visible = false"
    @cancel="visible = false"
    :maskClosable="false"
    :footer="footerButtons">
    <DynamicApprovePage ref="approvePage" :paramValue="paramValue" :config="config" />
  </a-modal>
</template>
<script>
import DynamicApprovePage from '@/components/DynamicApprovePage'
export default {
  name: 'Approve',
  components: { DynamicApprovePage },
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
      config: [],
      visible: true,
      postName: undefined
    }
  },
  computed: {
    footerButtons () {
      return (
        <div>
          <a-button type="primary"
            {...{ on: { click: () => { this.handleSubmit() } } }}>提交</a-button>
          <a-button type="primary">保存</a-button>
          <a-button type="primary">挂起</a-button>
          <a-button type="primary"
            {...{ on: { click: () => { this.handleClose() } } }}>关闭</a-button>
        </div>
      )
    }
  },
  created () {
    this.queryPageConfig()
  },
  methods: {
    queryPageConfig () {
      // 查询当前岗位
      this.post('/api/postService/queryPost', { postId: this.paramValue.taskPost }, res => {
        const pagePk = res[0].dyPagePk
        this.postName = res[0].postName
        this.post('/api/dyPageService/queryPageConfig', { pagePk: pagePk }, (res) => {
          let pageConfig = res.pageConfig || '[]'
          pageConfig = JSON.parse(pageConfig)
          this.config = pageConfig.map(item => JSON.parse(item))
          this.pageType = res.pageType
        })
      })
    },
    handleSubmit () {
      this.$refs.approvePage.getPageData(['approveResult'], pageData => {
        if (!pageData) {
          return
        }
        this.post('/api/approveService/handleApprove', pageData.approveResult, (res) => {
          this.visible = false
        })
      }, true)
    },
    handleClose () {
      this.visible = false
    }
  }
}
</script>
