<template>
  <div>
    <a-tabs type="editable-card" defaultActiveKey="1">
      <a-tab-pane
        v-for="(item, index) in config.tabs"
        :key="index"
        :tab="item.tabName">
        <div class="tab-content" style="height:300px;line-height:300px">
          <span>Tab内容区域</span>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  name: 'DynamicTab',
  props: {
    config: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>
<style scoped>
  .tab-content{
    margin: 0 10px 0 10px;
    border: 1px dashed #e2e2e2;
    overflow:auto;
    border-radius: 5px;
    text-align: center;
  }
</style>
