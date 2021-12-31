<template>
  <div>
    <a-modal
      title="进件录入(基本信息)"
      :visible="basicInfoVisible"
      width="80%"
      :maskClosable="false"
      @cancel="handleClose"
      @close="handleClose"
      @ok="handleBasicInfoNext"
      okText="下一步"
      cancelText="关闭">
      <DynamicForm
        ref="basicForm"
        componentPk="93ac8aafdd644c6bb398b0abd250e915"
        :formValue="basicFormValue"
        :config="basicConfig"/>
    </a-modal>
    <a-modal
      title="进件录入(详细信息)"
      :visible="detailInfoVisible"
      width="99%"
      :maskClosable="false"
      @cancel="handleClose"
      @close="handleClose"
      :footer="footerButtons">
      <a-row>
        <a-col :span="14">
          <ImageData :edit="!disabledAll" :paramValue="applyInfo"/>
        </a-col>
        <a-col :span="10">
          <div class="input-container" :style="`height:${height};overflow:auto`">
            <DynamicInputPage :disabledAll="disabledAll" :pageData="detailInfo" ref="inputPage" :config="config"/>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
import ImageData from './component/ImageData'
import DynamicInputPage from '@/components/DynamicInputPage'
import ApiService from '@/api/api-service'
export default {
  name: 'DynamicInput',
  components: { DynamicForm, ImageData, DynamicInputPage },
  props: {
    paramValue: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      height: undefined,
      basicFormValue: {},
      flowId: undefined,
      basicInfoVisible: true,
      detailInfoVisible: false,
      basicConfig: undefined,
      config: [],
      pageType: undefined,
      applyInfo: {
        bizScene: 1
      },
      detailInfo: {
      },
      disabledAll: false
    }
  },
  computed: {
    footerButtons () {
      return (
        <div>
          <a-button type="primary"
            {...{ on: { click: () => { this.handleSaveOrSubmit('submit') } } }}>提交</a-button>
          <a-button type="primary"
            {...{ on: { click: () => { this.handleSaveOrSubmit('save') } } }}>保存</a-button>
        </div>
      )
    }
  },
  watch: {
    paramValue: {
      immediate: true,
      handler (newValue) {
        this.flowId = newValue.flowId
        if (this.flowId) {
          const params = {
            flowId: newValue.flowId
          }
          ApiService.post('/api/inputService/queryApplyBasicInfo', params, res => {
            this.basicFormValue = this.deepCopy(res)
          })
        } else {
          this.basicFormValue = {}
        }
      }
    }
  },
  created () {
    const clientHeight = document.documentElement.clientHeight
    this.height = (clientHeight - 210) + 'px'
    this.queryPageConfig()
    // 处理已录入和已作废时查看操作
    if (this.paramValue.flowState === '05' || this.paramValue.flowState === '06') {
      this.detailInfoVisible = true
      this.basicInfoVisible = false
      this.disabledAll = true
    }
  },
  methods: {
    handleBasicInfoNext () {
      this.$refs.basicForm.getFormData((formData) => {
        if (formData) {
          formData.flowId = this.flowId
          ApiService.post('/api/inputService/saveBasicInfo', formData, res => {
            this.flowId = res.flowId
            // 保存完成触发查询页面刷新
            this.$store.commit('PUT_EXTEND_DATA', { action: 'refresh', handler: 'dynamicTable' })
            // 查询信息
            ApiService.post('/api/inputService/queryApplyDetailInfo', { flowId: this.flowId }, res => {
              if (res && !res.mainCardPersonBasicInfo) {
                res.mainCardPersonBasicInfo = {
                  cnName: formData.custName,
                  idNumber: formData.idNo,
                  idType: formData.idType
                }
              }
              this.detailInfo = res
              this.basicInfoVisible = false
              this.detailInfoVisible = true
              // 将基础信息放入VUEX
              this.$store.commit('PUT_EXTEND_DATA', formData)
            })
          })
        }
      })
    },
    queryPageConfig (pagePk) {
      pagePk = 'c8c96881b3f643f197a704b51925514f'
      ApiService.post('/api/dyPageService/queryPageConfig', { pagePk: pagePk }, (res) => {
        let pageConfig = res.pageConfig || '[]'
        pageConfig = JSON.parse(pageConfig)
        this.config = pageConfig.map(item => JSON.parse(item))
        this.pageType = res.pageType
      })
    },
    handleClose () {
      this.basicInfoVisible = false
      this.detailInfoVisible = false
    },
    handleSaveOrSubmit (operateType) {
      // 设置是否验证数据，保存时不验证数据
      let validateData = false
      if (operateType === 'submit') {
        validateData = true
      }
      this.$refs.inputPage.getPageData((pageData) => {
        if (pageData) {
          pageData.flowId = this.flowId
          pageData.operateType = operateType
          ApiService.post('/api/inputService/saveDetailInfo', pageData, (res) => {
            if (operateType === 'submit') {
              this.$message.success('提交成功')
              this.detailInfoVisible = false
            } else {
              this.$message.success('保存成功')
            }
          })
        }
      }, validateData)
    }
  }
}
</script>
<style scoped>
  .input-container{
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-left: 0px;
  }
</style>
