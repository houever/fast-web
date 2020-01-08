import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'

// 部门树列表
export function initDepartment() {
  return getRequest(userApi + '/dept/tree')
}

export function initDeptByNode(id) {
  return getRequest(userApi + `/dept/node/${id}`)
}

// 加载部门
export function loadDepartment(data) {
  return getRequest(userApi + '/dept/' + data)
}
// 添加部门
export function addDepartment(data) {
  return postRequest(userApi + '/dept/add', data)
}
// 修改部门
export function editDepartment(data) {
  return postRequest(userApi + '/dept/edit', data)
}
// 删除部门
export function deleteDepartment(data) {
  return deleteRequest(userApi + '/dept/del/' + data)
}
// 查询部门
export function searchDepartment(data) {
  return postRequest(userApi + '/dept/search', data)
}
// 根据部门id查询用户
export function getUserByDepartmentId(data) {
  return getRequest(userApi + '/dept/users/' + data)
}

