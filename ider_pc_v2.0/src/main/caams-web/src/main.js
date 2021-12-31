// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import moment from 'moment'
import ApiService from '@/api/api-service'
import md5 from 'js-md5'
import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(Element)
Vue.config.productionTip = false;
Vue.prototype.$md5 = md5;
// mount axios Vue.$http and this.$http
Vue.use(VueAxios);

// 对象拷贝
Vue.prototype.deepCopy = obj => {
  return obj && JSON.parse(JSON.stringify(obj))
};
// 时间格式化
Vue.prototype.dateFormate = (value, format) => {
  format = format || 'YYYY-MM-DD';
  return moment(value).format(format)
};
Vue.prototype.post = (url, params, success, fail) => {
  ApiService.post(url, params, success, fail)
};

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app');
