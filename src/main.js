import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import hasPermission from './libs/hasPermission';
import * as filters from './filters' // global filters
// eslint-disable-next-line no-unused-vars
import iView from 'iview'
import 'iview/dist/styles/iview.css'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
Vue.use(iView)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(hasPermission);
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// Vue.prototype.$Message.config({
//   top: 120,                                      //设置高度
//   duration:3                                   //设置3秒后消失
// });
Vue.config.productionTip = false
import captcha from 'vue-social-captcha'
Vue.use(captcha)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
