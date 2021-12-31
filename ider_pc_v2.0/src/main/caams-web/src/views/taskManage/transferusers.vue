<template>
  <div>
    <a-modal
      title="申请件转派"
      :visible="visible"
      :maskClosable="false"
      width="80%"
      @cancel="visible = false"
      :footer="null"
    >
      <DynamicForm
        ref="transferRemarkForm"
        :config="transferRemarkFormConifg"/>
      <DynamicCrudPage
        :showPageHeader="false"
        :config="config"
        @btnClick="handleBtnClick"
      />
    </a-modal>
  </div>
</template>
<script>
import DynamicCrudPage from '@/components/DynamicCrudPage'
import DynamicForm from '@/components/DynamicForm'
import ApiService from '@/api/api-service'
// 转派人员选择
const pageConfigPk = '19ce4d7df6e54d40839193a4df8c33b1'
export default {
  name: 'ParamDetailList',
  components: { DynamicCrudPage, DynamicForm },
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
      config: undefined,
      transferRemarkFormConifg: {
        lineColumnCount: 2,
        labelWidth: 4,
        columnItems: [
          { label: '转派备注',
            columnName: 'remark',
            type: 'textarea',
            rules: [
              { required: true, message: '请输入转派备注' }
            ] }
        ]
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
                prop: 'postId_EqualTo',
                valueType: 'realValue',
                value: this.paramValue[0].taskPost
              },
              {
                prop: 'groupId_EqualTo',
                valueType: 'realValue',
                value: this.paramValue[0].taskGroup
              },
              {
                prop: 'userId_NotEqualTo',
                valueType: 'realValue',
                value: this.paramValue[0].taskUser
              }
            ]
          } else if (item.componentType === 'form') {
          }
        })
        this.config = config
      })
    },
    handleBtnClick (btnConfig, data) {
      if (btnConfig.id === 'tranferTaskSubmit') {
        this.$refs.transferRemarkForm.getFormData(formData => {
          if (formData) {
            this.$confirm({
              title: '确认转派吗?',
              onOk: () => {
                const applyIdList = []
                this.paramValue && this.paramValue.forEach(item => {
                  applyIdList.push(item.applyId)
                })
                const userId = data[0].userId
                const remark = formData.remark
                const params = {
                  applyIdList: applyIdList,
                  transUserId: userId,
                  remark: remark
                }
                ApiService.post('/api/applyTransferService/transfer', params, (res) => {
                  this.$message.success('转派完成')
                  this.visible = false
                  this.$store.commit('PUT_EXTEND_DATA', { action: 'refresh', handler: 'applyTransfer' })
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>
