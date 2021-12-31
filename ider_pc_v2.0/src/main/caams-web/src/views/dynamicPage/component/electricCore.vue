<template>
  <div class="electric-core">
    <div class="title">电核记录</div>
    <DynamicTable
      :queryCondition="paramValue"
      componentPk="e07e848030524644a233e96a705966f9"/>
    <div class="title">申请信息修改记录</div>
    <DynamicTable
      :queryCondition="paramValue"
      componentPk="9bbb0a172a7c40f7a69e00f583027a1f"/>
  </div>
</template>
<script>
import DynamicTable from '@/components/DynamicTable'
// 电核历史和修改记录信息
export default {
  name: 'ParamDetailList',
  components: { DynamicTable },
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
  created () {

  },
  methods: {
    handleBtnClick (btnConfig) {
    }
  }
}
</script>
<style scoped>
  .electric-core .title{
    margin-top: 10px;;
    border-bottom: 2px solid #e2e2e2;
    font-size: 14px;
    /* color: #1890ff; */
    padding-bottom: 10px;
    font-weight: bold;
    margin-left: 10px;
  }
</style>
