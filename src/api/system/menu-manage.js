import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'

// 分页列表查询
export function getMenuTree() {
  return getRequest(userApi + '/menus/tree')
}

export function addPermission(data) {
  return postRequest(userApi + '/menus/add', data)
}
export function editPermission(data) {
  return postRequest(userApi + '/menus/edit', data)
}

export function getDictDataByType(data) {
  return getRequest(userApi + '/dictdata/all', data)
}
export function searchPermission(data) {
  return getRequest(userApi + '/menus/search', data)
}
export function deletePermission(id) {
  return deleteRequest(userApi + `/menus/del/${id}`)
}
