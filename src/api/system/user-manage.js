// eslint-disable-next-line no-unused-vars
import request from '@/utils/request'
// eslint-disable-next-line no-unused-vars
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'

// 分页列表查询
export function getUserListPage(current,size,param) {
  return getRequest(userApi + `/account/pages/${current}/${size}`, param)
}

// 获取用户列表数据
export function getUserListData(data) {
  return postRequest(userApi + '/account/all', data)
}

/* 导出全部数据*/
export function getAll() {
  return postRequest(userApi + '/account/all')
}

// 编辑用户
export function editUser(data) {
  return postRequest(userApi + '/account/edit', data)
}

// 新增用户
export function addUser(params) {
  return postRequest(userApi + '/account/add', params)
}

/* 禁用，启用用户*/
export function disableUser(param) {
  return postRequest(userApi + '/account/disable', param)
}

// 删除
export function delUser(id) {
  return deleteRequest(userApi + '/account/' + id)
}
