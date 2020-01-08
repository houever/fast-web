import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'ios-desktop-outline', affix: true }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // 锁屏
  {
    path: '/lock',
    hidden: true,
    name: '锁屏页',
    component: () => import('@/views/common/lock')
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/regist',
    component: () => import('@/views/login/regist/regist'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/server-error',
    component: () => import('@/views/error-page/server-error'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]


export const otherRouter = [
  {
    path: '/other',
    name: 'otherRouter',
    component: '/Layout',
    hidden: true,
    children: [
      // { path: 'home', title: { i18n: 'home' }, name: 'home_index', component: () => import('@/views/home/home.vue') },
      // { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
      // { path: 'ownspace-old', title: '个人中心(旧)', name: 'ownspace_old', component: () => import('@/views/own-space/own-space-old.vue') },
      // { path: 'change-pass', title: '修改密码', name: 'change_pass', component: () => import('@/views/change-pass/change-pass.vue') },
      // { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
      // { path: 'add', title: '添加', name: 'add', component: () => import('@/views/xboot-vue-template/new-window/add.vue') },
      // { path: 'edit', title: '编辑', name: 'edit', component: () => import('@/views/xboot-vue-template/new-window/edit.vue') },
      // { path: 'add-edit-message', title: '消息详情', name: 'add_edit_message', component: () => import('@/views/sys/message-manage/addOrEditMessage.vue') },
      // { path: 'message-send-detail', title: '消息发送详情', name: 'message_send_detail', component: () => import('@/views/sys/message-manage/messageSendDetail.vue') },
      // { path: 'process-node-edit', title: '流程节点设置', name: 'process_node_edit', component: () => import('@/views/activiti/process-manage/processNodeEdit.vue') },
      { path: 'leave', title: '请假申请', name: 'leave', component: '/activiti/business/leave',meta:{title:'请假申请'} },
      { path: 'historic-detail', title: '流程进度历史详情', name: 'historic_detail', component: '/activiti/hostoric-detail/hostoricDetail',meta:{title:'流程进度历史详情'}},
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history', //需要后端支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
