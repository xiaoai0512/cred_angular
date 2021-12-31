<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- <notice-icon class="action"/> -->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <span class="header-icon">{{ userInfo.userName.substring(0,1).toUpperCase() }}</span>
          <span>{{ userInfo.userName.substring(1,userInfo.userName.lenth) }}-{{ userInfo.loginId }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock"/>
            <span>修改密码</span>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions } from 'vuex'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  computed: {
    userInfo () {
      return Vue.ls.get(USER_INFO)
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(USER_INFO)
          window.location.reload()
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
<style scoped>
  .header-icon{
    margin-right: 3px;
    display: inline-block;
    text-align: center;
    background: #1890ff;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
  }
</style>
