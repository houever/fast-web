import { constantRouterMap ,otherRouter} from '@/router'
import {getMenus} from "@/utils/userinfo";
//Layout 是架构组件，不在后台返回，在文件里单独引入
import lazyLoading from "@/utils/lazyLoading";
import Layout from '@/layout'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 按递归筛选异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    //route.component = lazyLoading('/errorLog/errorLog')
    if (route.component) {
      //**加粗文字**
      if (route.component === '/Layout') {//Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = lazyLoading(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    RESET_ROUTERS:(state, routers) => {
      state.addRouters = []
      state.routers = constantRouterMap.concat(routers)
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        //动态权限菜单
        let accessedRouters = getMenus()
        let otherRoutes = otherRouter;
        otherRoutes.forEach(o=>{
          accessedRouters.push(o);
        })
        let permissions = filterAsyncRouter(accessedRouters)
        commit('SET_ROUTERS', permissions)
        resolve()
      })
    },
    resetRouter({ commit }, data) {
      return new Promise(resolve => {
        commit('RESET_ROUTERS',[])
        resolve()
      })
    }
  }
}

export default permission
