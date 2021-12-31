<template>
  <div class="att-card-person-info">
    <div
      v-for="(item, index) in attCardPersonInfoList"
      :key="index">
      <div v-if="attCardPersonInfoList.length > 1" class="title">附属卡申请人{{ index+1 }}</div>
      <DynamicForm
        :disabledAll="disabledAll"
        :ref="'form'+index"
        :formValue="attCardPersonInfoList[index]"
        :componentPk="config.componentPk"/>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm'
export default {
  name: 'AttCardPersonInfo',
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
      attCardPersonInfoList: []
    }
  },
  watch: {
    paramValue: {
      immediate: true,
      handler (newValue) {
        let extendData = this.config.extendData || '{}'
        extendData = JSON.parse(extendData)
        if (extendData.edit) {
          this.attCardPersonInfoList = newValue || []
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
            this.attCardPersonInfoList = res
          })
        }
      }
    }
  },
  methods: {
    async getFormData (callback, validateData) {
      let hasError = false
      const attCardPersonInfoList = []
      for (let i = 0; i < this.attCardPersonInfoList.length; i++) {
        await this.getSubFormData(this.$refs['form' + i][0], validateData).then(res => {
          if (!res) {
            hasError = true
          } else {
            attCardPersonInfoList.push(res)
          }
        })
      }
      if (!validateData || !hasError) {
        callback && callback(attCardPersonInfoList)
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
  .att-card-person-info .title{
    margin-top: 10px;;
    border-bottom: 2px solid #1890ff;
    height: 30px;
    /* font-size: 14px; */
    color: #1890ff;
    font-weight: bold;
    line-height: 30px;
  }
</style>
