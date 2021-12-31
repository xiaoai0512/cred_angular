import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import { RouteView } from '@/layouts'
import Vue from 'vue'
import ApiService from '@/api/api-service'
import { USER_CODE } from '@/store/mutation-types'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

/**
 * 根据后端返回的菜单列表构建菜单路由
 * @param {*} menuList
 */
export const buildDynamicMenuRouter = (menuList) => {
  menuList = menuList || [];
  return menuList.map(item => {
    const menuRouter = {
      path: item.menuUrl,
      name: item.menuName,
      meta: {
        title: item.menuName,
        keepAlive: true,
        isDynamicPage: item.isDynamicPage,
        dynamicPageType: item.dynamicPageType,
        pagePk: item.pagePk
      }
    };
    if (item.parentId === '0') {
      menuRouter.component = RouteView
    } else if (item.isDynamicPage === 'T') {
      menuRouter.component = (resolve) => require([`@/views/dynamicPage/crud`], resolve)
    } else {
      let component = item.menuUrl;
      console.log(component);
      if (component.indexOf('/') === 0) {
        component = component.substring(1, component.length)
      }
      menuRouter.component = (resolve) => require([`@/views/${component}`], resolve);
      console.log(`@/views/${component}`)
    }
    if (item.menuList) {
      menuRouter.children = buildDynamicMenuRouter(item.menuList)
    }
    return menuRouter
  })
};
export const getMenuListPermiss = (routerList, menuList) => {
  return routerList.map(item => {
    menuList.map(item2 => {
      if (item2.menuName == item.name && item2.menuUrl == item.path) {
        item2.map(item3 => {
          item.meta.menuList.push({
            eleType: item3.eleType,
            operType: item3.operType,
            permName: item3.permName
          })
        })
      }
    });
    return routerList
  })
  // for (const key in routerList) {
  //   for (const key2 in menuList) {
  //     if (menuList[key2].menuName == routerList[key].name && menuList[key2].menuUrl == routerList[key].path) {
  //       for (const key3 in menuList[key2].permissionList) {
  //         routerList[key].meta.menuList.push({
  //           eleType: menuList[key2].permissionList[key3].eleType,
  //           operType: menuList[key2].permissionList[key3].operType,
  //           permName: menuList[key2].permissionList[key3].permName
  //         })
  //       }
  //     }
  //   }
  //   return routerList
  // }
};
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const userCode = Vue.ls.get(USER_CODE);
        ApiService.get('http://10.6.110.18:8088/user/queryMenuByUserCode', { userCode: userCode }, (res) => {
          const routerList = buildDynamicMenuRouter(res.data.menuList);
          // const newRouterList = getMenuListPermiss(routerList, res.data.permissionList)
          console.log(routerList);
          for (const key in routerList) {
            asyncRouterMap[0].children.push(routerList[key])
          }
          console.log(asyncRouterMap);
          // 组装动态菜单
          // asyncRouterMap[0].children = buildDynamicMenuRouter(res.data.data.menuList)
          const accessedRouters = asyncRouterMap;
          commit('SET_ROUTERS', accessedRouters);
          resolve()
        })
      })
    }
  }
};

export default permission
