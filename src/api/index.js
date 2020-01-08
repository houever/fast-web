import { getRequest, postRequest } from '../utils/request'
import { baseUrl,userApi } from '@/config/env'
//ping 后端
export function serverAttach() {
  return getRequest('route/test')
}

//登录页背景壁纸
export function getLoginBg(){
  return getRequest(`auth/sys/bg`);
}

//添加路由
export const addRouter = (param) => {
  return postRequest('route/add',param)
}
//路由列表
export const getRouters = (param) => {
  return getRequest(userApi+'/system/routers',param)
}
//部门父级
export function initDepts(token) {
  return getRequest(userApi + '/dept/0')
}
//根据id查询部门
export function loadDepts(id) {
  return getRequest(userApi + '/dept/' + id)
}
//搜索部门
export function searchDept(deptName) {
  return postRequest(userApi + '/dept/search', deptName)
}
export const uploadFileAction = 'http://10.1.79.82:9008/upload/file'
export const verifyCaptchaUrl = baseUrl+'auth/verify/captcha'
