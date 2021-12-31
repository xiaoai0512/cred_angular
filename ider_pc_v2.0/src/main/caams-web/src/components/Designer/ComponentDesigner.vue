<template>
  <div>
    <a-modal
      title="组件设计器"
      :visible="visible"
      :maskClosable="false"
      width="100%"
      @close="handleCancel"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div style="margin:0px 0px 0px 10px;padding-bottom:10px">
        <!-- <a-button
          type="primary"
          style="margin-right:20px;">批量字段导入</a-button> -->
        <a-button
          style="margin-right:20px;"
          v-if="paramValue.componentType === 'form'"
          @click="handleCloneColumns"
          type="primary">克隆其他组件字段</a-button>
        <a-button
          v-if="paramValue.componentType === 'form'"
          @click="handleDisabledColumns"
          type="primary">禁用全部字段</a-button>
      </div>
      <FormDesigner
        :initConfig="config"
        ref="designer"
        v-if="paramValue.componentType === 'form'"/>
      <TableDesigner
        :initConfig="config"
        ref="designer"
        v-if="paramValue.componentType === 'table'"/>
    </a-modal>
    <a-modal
      title="请选择克隆的组件"
      :visible="cloneVisible"
      :maskClosable="false"
      width="60%"
      @close="cloneVisible=false"
      @cancel="cloneVisible=false"
      @ok="handleCloneComponent"
    >
      <DynamicForm
        ref="cloneComponentForm"
        :config="cloneFormConfig"/>
    </a-modal>
  </div>
</template>
<script>
import FormDesigner from './FormDesigner'
import TableDesigner from './TableDesigner'
import ApiService from '@/api/api-service'
import DynamicForm from '../DynamicForm'
export default {
  name: 'ComponentDesigner',
  components: { FormDesigner, TableDesigner, DynamicForm },
  props: {
    paramValue: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      visible: false,
      config: {},
      originalConfig: {},
      cloneVisible: false,
      cloneFormConfig: {
        lineColumnCount: 2,
        columnItems: [
          {
            label: '请选择被克隆组件',
            columnName: 'cloneComponentPk',
            type: 'select',
            dataName: 'FormComponentList',
            showSearch: 'T',
            rules: [
              { required: true, message: '请选择被克隆组件' }
            ]
          }
        ]
      }
    }
  },
  created () {
    this.initComponnetConfig()
  },
  methods: {
    initComponnetConfig () {
      if (this.paramValue.componentType === 'selfDefined') {
        this.$message.error('自定义组件不支持组件设计')
        return
      }
      this.visible = true
      const params = {
        pk: this.paramValue.pk
      }
      ApiService.post('/api/dyComponentService/queryConfig', params, res => {
        if (res.data && res.data.componentConfig) {
          this.config = JSON.parse(res.data.componentConfig)
        }
        this.originalConfig = this.deepCopy(this.config)
      })
    },
    handleOk () {
      const config = this.$refs.designer.getConfig()
      const params = {
        pk: this.paramValue.pk,
        componentConfig: JSON.stringify(config)
      }
      ApiService.post('/api/dyComponentService/saveConfig', params, res => {
        this.$message.success('保存成功')
        this.visible = false
      })
    },
    handleCancel () {
      const config = this.$refs.designer.getConfig()
      if (JSON.stringify(config) !== JSON.stringify(this.originalConfig)) {
        this.$confirm({
          title: '您有修改尚未保存，是否保存修改?',
          onOk: () => {
            this.handleOk()
          },
          onCancel: () => {
            this.visible = false
          }
        })
      } else {
        this.visible = false
      }
    },
    handleCloneColumns () {
      if (this.config.columnItems && this.config.columnItems.length > 0) {
        this.$confirm({
          title: '当前设计器中已存在其他字段，克隆时将覆盖现有字段，是否继续？',
          onOk: () => {
            this.cloneVisible = true
          }
        })
      } else {
        this.cloneVisible = true
      }
    },
    handleCloneComponent () {
      this.$refs.cloneComponentForm.getFormData(res => {
        // 查询组件配置
        ApiService.post('/api/dyComponentService/queryConfig', { pk: res.cloneComponentPk }, res => {
          const componentConfig = JSON.parse(res.data.componentConfig)
          const config = this.deepCopy(this.config) || {}
          config.columnItems = componentConfig.columnItems
          this.config = config
          this.cloneVisible = false
        })
      })
    },
    handleDisabledColumns () {
      const config = this.deepCopy(this.config) || {}
      config.columnItems.forEach(item => {
        item.disabled = 'T'
      })
      this.config = config
    }
  }
}
</script>
