import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'

// 分页列表查询
export function getRoleList(data) {
  return getRequest(userApi + '/role/page', data)
}
/* 角色列表*/
export function getAllRoleList() {
  return getRequest(userApi + '/role/all')
}
export function getAllPermissionList() {
  return getRequest(userApi + '/permission/menus')
}

export function initDepartment() {
  return getRequest(userApi + '/dept/0')
}

export function addRole(data) {
  return postRequest(userApi + '/role/add', data)
}

export function editRole(data) {
  return postRequest(userApi + '/role/edit', data)
}

export function deleteRole(id) {
  return getRequest(userApi + '/roles/delById/' + id)
}

export function setDefaultRole(data) {
  return postRequest(userApi + '/role/edit', data)
}

export function editRolePerm(data) {
  return postRequest(userApi + '/role/editPerm', data)
}

export function loadDepartment(data) {
  return getRequest(userApi + '/dept/' + data)
}

export function getDeptTree() {
  return getRequest(userApi + '/dept/tree')
}

export function editRoleDep(data) {
  return postRequest(userApi + '/role/editDept', data)
}
