import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false });

const whiteList = ['login'];
const defaultRoutePath = '/';

router.beforeEach((to, from, next) => {
  NProgress.start();
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`));
  if (Vue.ls.get(ACCESS_TOKEN)) {
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath });
      NProgress.done()
    } else {
      if (store.getters.addRouters.length === 0) {
        // 动态添加可访问路由表
        store.dispatch('GenerateRoutes', {}).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(store.getters.addRouters);
          const redirect = decodeURIComponent(from.query.redirect || to.path);
          if (to.path === redirect) {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          } else {
            // 跳转到目的路由
            next({ path: redirect })
          }
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } });
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done()
});
