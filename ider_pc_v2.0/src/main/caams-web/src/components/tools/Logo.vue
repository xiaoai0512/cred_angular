<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img src="~@/assets/images/logo.png" style="margin-left:0px;width:165px" class="logo" alt="logo">
      <!-- <h1 v-if="showTitle">{{ title }}</h1> -->
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '信用卡自动化审批管理系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
