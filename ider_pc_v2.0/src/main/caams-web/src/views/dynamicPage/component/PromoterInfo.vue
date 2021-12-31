<template>
  <div class="promoter-info">
    <div
      v-for="(promoter, index) in promoterList"
      :key="index"
      @click="selectedIndex = index"
      :class="index==selectedIndex && !disabledAll?'promoter-item-select':'promoter-item'">
      <a-form :form="formList[index]">
        <a-row>
          <a-col v-for="(item, index2) in columnItems" :key="index2" :span="12">
            <a-form-item
              :label="labelName(item.label, index)"
              :label-col="{span:10}"
              :wrapper-col="{span:14}">
              <a-input
                :disabled="disabledAll"
                v-decorator="[
                  item.columnName,
                  { rules: [
                    {required: item.required,message:`${labelName(item.label, index)}不能为空`}
                  ], initialValue: promoterList[index][item.columnName] },
                ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-icon
          v-if="index==selectedIndex && !disabledAll"
          class="delete"
          type="close-circle"
          @click="()=>handleDelete(index)"
          style="font-size:20px;color:#1890ff" />
      </a-form>
    </div>
    <div class="add-container" v-if="promoterList.length < 5 && !disabledAll">
      <a-icon type="plus-circle" @click="handleAddPromoter" style="font-size:20px;color:#1890ff" />
    </div>
  </div>
</template>
<script>
const columnItems = [
  { label: '推广人{index}工号', columnName: 'userId', required: true },
  { label: '推广人{index}姓名', columnName: 'userName', required: true },
  { label: '推广人{index}电话', columnName: 'mobile', required: false },
  { label: '推广人{index}比例(%)', columnName: 'ratio', required: true }
]
// 推广人信息
export default {
  name: 'PromoterInfo',
  props: {
    paramValue: {
      type: Array,
      default: () => { return [] }
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
      columnItems: columnItems,
      promoterList: [],
      selectedIndex: undefined,
      formList: []
    }
  },
  computed: {
    labelName () {
      return function (labelName, index) {
        return labelName.replace('{index}', (index + 1))
      }
    }
  },
  watch: {
    paramValue: {
      immediate: true,
      handler (newValue) {
        if (!newValue || newValue.length === 0) {
          this.handleAddPromoter()
        } else {
          newValue.forEach(item => {
            this.handleInitPromoterForm(item)
          })
        }
      }
    }
  },
  methods: {
    handleAddPromoter () {
      if (this.promoterList.length === 5) {
        this.$message.error('最多只能添加5个推广人')
        return
      }
      this.handleInitPromoterForm({})
    },
    handleInitPromoterForm (promoterData) {
      const promoterList = this.deepCopy(this.promoterList)
      promoterList.push(promoterData)
      this.promoterList = promoterList
      this.selectedIndex = this.promoterList.length - 1
      const formList = this.formList.map(item => { return item })
      const formIndex = this.promoterList.length - 1
      formList.push(this.$form.createForm(this, { name: `form_${formIndex}`,
        onFieldsChange: (props, fields) => {
          const promoterList = this.promoterList
          for (const key in fields) {
            promoterList[formIndex][key] = fields[key].value
          }
          this.promoterList = promoterList
        }
      }))
      this.formList = formList
    },
    handleDelete (index) {
      const promoterList = this.deepCopy(this.promoterList)
      promoterList.splice(index, 1)
      this.promoterList = promoterList
      this.selectedIndex = undefined
    },
    async getFormData (callback, validateForm = true) {
      let hasError = false
      if (validateForm) {
        for (let i = 0; i < this.formList.length; i++) {
          await this.getSubFormData(this.formList[i]).then(res => {
            hasError = res
          })
        }
        if (!hasError) {
          // 验证比列和是否正确
          callback && callback(this.promoterList)
        }
      } else {
        callback && callback(this.promoterList)
      }
    },
    getSubFormData (form) {
      return new Promise((resolve) => {
        form.validateFieldsAndScroll(errors => {
          if (errors) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    }
  }
}
</script>
<style scoped>
  .promoter-info{
    margin-top:10px
  }
  .promoter-info >>> .ant-form-item{
    margin-bottom: 0px
  }
  .promoter-info .add-container{
    text-align: center;
    margin-bottom: 10px;
  }
  .promoter-info .promoter-item{
    margin-bottom:20px;
    cursor: pointer;
  }
  .promoter-info .promoter-item-select{
    margin-bottom:20px;
    cursor: pointer;
    border: 1px dashed #1890ff;
    position: relative;
  }
  .promoter-info .delete{
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
