// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    children: [
      // dashboard
      // {
      //   path: '/system',
      //   name: '/system',
      //   redirect: '/system/menuList',
      //   component: RouteView,
      //   meta: { title: '系统管理', keepAlive: true, icon: 'setting', permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/system/userList',
      //       name: '/system/userList',
      //       component: () => import('@/views/system/user/UserList'),
      //       meta: { title: '用户管理', keepAlive: false, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/system/paramList',
      //       name: '/system/paramList',
      //       component: () => import('@/views/system/param/ParamList'),
      //       meta: { title: '参数管理', keepAlive: false, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/system/menuList',
      //       name: '/system/menuList',
      //       component: () => import('@/views/system/menu/MenuList'),
      //       meta: { title: '菜单管理', keepAlive: false, permission: [ 'dashboard' ] }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
];
