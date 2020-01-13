import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'

// 分页列表查询
export function getMenuTree(data) {
  return getRequest(userApi + '/permission/tree',data)
}

export function addPermission(data) {
  return postRequest(userApi + '/permission/add', data)
}
export function editPermission(data) {
  return postRequest(userApi + '/permission/edit', data)
}

export function getDictDataByType(data) {
  return getRequest(userApi + `/dictdata/byType/${data}`)
}
export function searchPermission(data) {
  return getRequest(userApi + '/permission/search', data)
}
export function deletePermission(id) {
  return deleteRequest(userApi + `/permission/del/${id}`)
}
