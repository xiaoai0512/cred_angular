<template>
  <div class="main-card-info">
    <div
      v-for="(item, index) in mainCardInfoList"
      :key="index">
      <div v-if="mainCardInfoList.length > 1" class="title">卡片{{ index+1 }}</div>
      <DynamicForm
        :disabledAll="disabledAll"
        :ref="'form'+index"
        :formValue="mainCardInfoList[index]"
        :componentPk="config.componentPk"/>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
export default {
  name: 'MainCardInfo',
  components: { DynamicForm },
  props: {
    paramValue: {
      type: Array,
      default: () => { return [] }
    },
    config: {
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
      mainCardInfoList: []
    }
  },
  watch: {
    paramValue: {
      immediate: true,
      handler (newValue) {
        let extendData = this.config.extendData || '{}'
        extendData = JSON.parse(extendData)
        if (extendData.edit) {
          this.mainCardInfoList = newValue || []
        }
      }
    },
    config: {
      immediate: true,
      handler (newValue) {
        // 根据API查询数据
        const api = this.config.api
        if (api) {
          this.post(api, this.paramValue, res => {
            this.mainCardInfoList = res
          })
        }
      }
    }
  },
  methods: {
    async getFormData (callback, validateData) {
      let hasError = false
      const mainCardInfoList = []
      for (let i = 0; i < this.mainCardInfoList.length; i++) {
        await this.getSubFormData(this.$refs['form' + i][0], validateData).then(res => {
          if (!res) {
            hasError = true
          } else {
            mainCardInfoList.push(res)
          }
        })
      }
      if (!validateData || !hasError) {
        callback && callback(mainCardInfoList)
      } else {
        callback && callback()
      }
    },
    getSubFormData (form, validateData) {
      return new Promise((resolve) => {
        form.getFormData(data => {
          resolve(data)
        }, validateData)
      })
    }
  }
}
</script>
<style scoped>
  .main-card-info .title{
    margin-top: 10px;;
    border-bottom: 2px solid #1890ff;
    height: 30px;
    color: #1890ff;
    font-weight: bold;
    line-height: 30px;
  }
</style>
