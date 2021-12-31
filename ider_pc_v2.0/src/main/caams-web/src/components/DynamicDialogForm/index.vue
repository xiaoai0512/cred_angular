<template>
  <div>
    <a-modal
      :title="config.name"
      :visible="visible"
      :maskClosable="maskClosable"
      @close="handleCancel"
      @cancel="handleCancel"
      :width="config.width || '80%'"
      :footer="footerButtons"
    >
      <dynamic-form
        v-if="formConfig"
        ref="dynamicForm"
        :config="formConfig">
      </dynamic-form>
    </a-modal>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
import ApiService from '@/api/api-service'
export default {
  name: 'DynamicDialogForm',
  components: { DynamicForm },
  props: {
    // 参数值参照DynamicForm
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    // 关闭时是否重置表单
    closeResetForm: {
      type: Boolean,
      default: () => { return false }
    }
  },
  data () {
    return {
      visible: false,
      maskClosable: false,
      formConfig: undefined,
      buttons: []
    }
  },
  watch: {
    config: {
      immediate: true,
      handler (newValue) {
        this.buttons = this.initBtnEvent(this.deepCopy(newValue.buttons))
        this.formConfig = {
          ...newValue,
          buttons: [] // 清除按钮，防止dialog中实际的form显示按钮
        }
      }
    }
  },
  computed: {
    footerButtons () {
      if (this.buttons && this.buttons.length > 0) {
        return this.buttons.map(item => {
          return (
            <a-button
              {...{ on: { click: () => { this.handleBtnClick(item) } } }}
              type={item.type || 'primary'}>{item.name}</a-button>
          )
        })
      } else {
        return null
      }
    }
  },
  methods: {
    initBtnEvent (buttons) {
      buttons = buttons || []
      buttons.forEach(item => {
        item.click = (buttonConfig, data) => {
          if (item.action === 'close') {
            this.handleCancel()
          } else if (item.action === 'api') {
            const api = item.api
            if (!api) {
              this.$message.error('请配置按钮的api属性')
              return
            }
            const params = {
              modelName: this.config.modelName,
              modelJson: JSON.stringify(data),
              check: buttonConfig.check || 'F'
            }
            ApiService.post(api, params, (res) => {
              if (buttonConfig.check === 'T') {
                this.$message.success('操作成功，将在复核完成后生效')
              } else {
                const message = '操作成功'
                this.$message.success(message)
              }
              this.resetForm()
              this.hidden()
              if (buttonConfig.triggerQuery !== 'notTriggerQuery') {
                this.$emit('btnClick', { action: 'query',
                  autoQuery: true,
                  triggerQuery: buttonConfig.triggerQuery })
              }
            })
          }
        }
      })
      return buttons
    },
    handleCancel () {
      if (this.closeResetForm) {
        // 关闭时重置表单
        this.resetForm()
      }
      this.visible = false
    },
    handleBtnClick (item) {
      if (item.validateFields === 'T') {
        this.getForm().validateFieldsAndScroll((errors, formData) => {
          if (!errors) {
            this.$refs.dynamicForm.getFormData((data) => {
              if (data) {
                item.click && item.click(item, data)
              }
            })
          }
        })
      } else {
        item.click && item.click(item)
      }
    },
    getForm () {
      return this.$refs.dynamicForm.getForm()
    },
    resetForm () {
      return this.$refs.dynamicForm.resetForm()
    },
    initFormValue (newValue) {
      window.setTimeout(() => {
        this.$refs.dynamicForm.initFormValue(newValue)
      }, 50)
    },
    show () {
      this.visible = true
    },
    hidden () {
      this.visible = false
    }
  }
}
</script>
