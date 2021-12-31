import Vue from 'vue'
import axios from 'axios'
import message from 'ant-design-vue/es/message'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import router from '../router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 60000 // 请求超时时间
});
// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN);
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
}, (err) => {
  console.error(err);
  message.error('请求异常,' + err)
});

// response interceptor
service.interceptors.response.use((res) => {
  if (res.status === 200) {
    console.log(res);
    const responseData = res.data;
    if (responseData.code === 200) {
      return responseData
    } else if (responseData.code === 401) {
      Vue.ls.remove(ACCESS_TOKEN);
      router.push({ path: '/user/login' });
      message.error('登录已失效，请重新登录')
    } else {
      console.log(res.data.msg);
      const ms = responseData.message ? responseData.message : res.data.msg;
      message.error('服务器处理异常,Error:' + ms)
    }
  } else {
    message.error('服务器通信异常,Error:' + res.message)
  }
}, (err) => {
  console.error(err);
  message.error('服务器异常,' + err)
});

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
};

export {
  installer as VueAxios,
  service as axios
}
