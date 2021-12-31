import Vue from 'vue'
import { ACCESS_TOKEN, USER_INFO, USER_CODE, USER_NAME } from '@/store/mutation-types'
import ApiService from '@/api/api-service'

const user = {
  state: {
    token: '',
    userInfo: {},
    menuList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // ApiService.post('http://10.6.110.18:8080/login', userInfo, (res) => {
        ApiService.post('/ider/betaService/COS.CS.01.0018', userInfo, (res) => {
          Vue.ls.set(ACCESS_TOKEN, res.data.token);
          // eslint-disable-next-line no-undef
          Vue.ls.set(USER_CODE, res.data.userCode);
          // eslint-disable-next-line no-undef
          Vue.ls.set(USER_NAME, res.data.userName);
          commit('SET_TOKEN', res.data);
          resolve()
        }, (err) => {
          reject(err)
        })
      })
    },
    GetCurrentUser ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const token = Vue.ls.get(ACCESS_TOKEN);
        ApiService.post('/api/userTrade/getCurrentUser', { token: token }, (res) => {
          const userInfo = { userName: res.userName, loginId: res.userId };
          Vue.ls.set(USER_INFO, userInfo);
          commit('SET_USER_INFO', userInfo);
          resolve()
        }, (err) => {
          reject(err)
        })
      })
    }
  }
};
export default user
