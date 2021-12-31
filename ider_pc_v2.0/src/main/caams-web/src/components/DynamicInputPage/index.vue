<template>
  <div class="offline-input-page">
    <div v-for="(item, index) in pageConfig" :key="index">
      <a-card :title="item.name" style="margin-bottom:5px">
        <dynamic-form
          :disabledAll="disabledAll"
          v-if="item.componentType === 'form'"
          :formValue="pageData[item.id]"
          :ref="item.id"
          @btnClick="(btnConfig, data) => handleFormBtnClick(btnConfig, data)"
          :config="item" />
        <component
          :disabledAll="disabledAll"
          :ref="item.id"
          :config="item"
          :paramValue="pageData[item.id]"
          v-if="dynamicComponentMap && item.componentType === 'selfDefined'"
          :is="dynamicComponentMap.get(item.componentPath)"/>
      </a-card>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
import HashMap from 'hashmap'
export default {
  name: 'DynamicInputPage',
  components: { DynamicForm },
  props: {
    config: {
      type: Array,
      default: () => { return [] }
    },
    pageData: {
      type: Object,
      default: () => { return {} }
    },
    disabledAll: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      pageConfig: [],
      designerMode: 'T',
      dynamicComponentMap: undefined
    }
  },
  watch: {
    config: {
      immediate: true,
      handler (newValue) {
        this.pageConfig = newValue
        // 初始化动态组件
        const dynamicComponentMap = new HashMap()
        newValue.forEach(item => {
          if (item.componentType === 'selfDefined') {
            let componentPath = item.componentPath
            if (componentPath.substring(0, 1) === '/') {
              componentPath = componentPath.substring(1, componentPath.length)
            }
            dynamicComponentMap.set(item.componentPath, (resolve) => require([`@/views/${componentPath}`], resolve))
          }
        })
        this.dynamicComponentMap = dynamicComponentMap
      }
    }
  },
  methods: {
    async getPageData (callback, validateData = true) {
      const obj = {}
      let hasError = false
      for (let i = 0; i < this.config.length; i++) {
        const id = this.config[i].id
        if (!id) {
          this.$message.error('组件[' + this.config[i].name + ']未配置id属性')
          return
        }
        await this.getFormData(this.$refs[id][0], validateData).then(res => {
          if (!res) {
            hasError = true
          } else {
            obj[id] = res
          }
        })
      }
      if (hasError) {
        callback && callback()
      } else {
        callback && callback(obj)
      }
    },
    getFormData (form, validateData) {
      return new Promise(resolve => {
        form.getFormData(res => {
          resolve(res)
        }, validateData)
      })
    }
  }
}
</script>
<style scoped>
  .offline-input-page >>> .ant-card-body{
    padding:1px 10px 0 10px;
  }
   .offline-input-page >>> .ant-card-head{
    min-height: 40px;
    line-height: 40px;
  }
  .offline-input-page >>> .ant-card-head-wrapper{
    height: 40px;
    line-height: 40px;
  }
</style>
