import { axios } from '@/utils/request'
import message from 'ant-design-vue/es/message'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'ApiService',
  post,
  get,
  put,
  dele
}

/**
 * 通用post请求方法
 * @param {*} apiUrl
 * @param {*} parameter
 */
function post (apiUrl, parameter, success, error) {
  parameter = parameter || {};
  parameter.gid = Vue.ls.get(ACCESS_TOKEN);
  axios({
    url: apiUrl,
    method: 'post',
    data: parameter
  }).then(res => {
    if (res) {
      console.log(res);
      if (res.code === 200) {
        success && success(res || res)
      } else {
        message.error(res.message);
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('post ' + apiUrl + ', handle error', err);
    message.error('业务异常，Error:' + err);
    error && error(err)
  })
}
function get (apiUrl, parameter, success, error) {
  parameter = parameter || {};
  parameter.gid = Vue.ls.get(ACCESS_TOKEN);
  axios.get(apiUrl, { params: parameter }).then(res => {
    if (res) {
      console.log(res);
      if (res.code === 200) {
        success && success(res || res)
      } else {
        message.error(res.message);
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('get ' + apiUrl + ', handle error', err);
    message.error('业务异常，Error:' + err);
    error && error(err)
  })
}
function put (apiUrl, parameter, success, error) {
  parameter = parameter || {};
  parameter.gid = Vue.ls.get(ACCESS_TOKEN);
  axios.put(apiUrl, parameter).then(res => {
    if (res) {
      console.log(res);
      if (res.code === 200) {
        success && success(res || res)
      } else {
        message.error(res.message);
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('get ' + apiUrl + ', handle error', err);
    message.error('业务异常，Error:' + err);
    error && error(err)
  })
}
function dele (apiUrl, parameter, success, error) {
  parameter = parameter || {};
  parameter.gid = Vue.ls.get(ACCESS_TOKEN);
  axios.delete(apiUrl, { params: parameter }).then(res => {
    if (res) {
      console.log(res);
      if (res.code === 200) {
        success && success(res || res)
      } else {
        message.error(res.message);
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('get ' + apiUrl + ', handle error', err);
    message.error('业务异常，Error:' + err);
    error && error(err)
  })
}
