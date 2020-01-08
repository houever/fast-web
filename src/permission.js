import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import { getRoles } from '@/utils/userinfo'
import getPageTitle from '@/utils/get-page-title'
import { setTitle } from '@/utils/util' // 设置浏览器头部标题
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 路由权限拦截
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('ROLE_ADMIN') >= 0) return true // 直接传递管理权限
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

//路由白名单
const whiteList = ['/login', '/auth-redirect', '/regist'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // 设置浏览器头部标题
    const browserHeaderTitle = to.name
    store.commit('SET_BROWSERHEADERTITLE', {
      browserHeaderTitle: browserHeaderTitle
    })
    /* 存在 token*/
    if (store.getters.isLock && to.path !== '/lock') {
      next({
        path: '/lock'
      })
      NProgress.done()
    } else if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.addRouters.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.roles // note: role must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,设置replace: true，这样导航就不会留下历史记录
          })
        }).catch((err) => {
          store.dispatch('Logout').then(() => {
            Message.error(err || '验证失败，请重新登录')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true } })
        }
      }
    }
  } else {
    // 设置浏览器头部标题
    const browserHeaderTitle = to.name
    store.commit('SET_BROWSERHEADERTITLE', {
      browserHeaderTitle: browserHeaderTitle
    })
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // // 结束 加载进度条
  NProgress.done()
  setTimeout(() => {
    const browserHeaderTitle = store.getters.browserHeaderTitle
    setTitle(browserHeaderTitle)
  }, 0)
})
