import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'
// 字典类型列表
export function getAllDictList() {
  return getRequest(userApi + '/dict/all')
}

export function searchDict(data) {
  return getRequest(userApi + '/dict/search')
}

// 添加字典类型
export function addDict(data) {
  return postRequest(userApi + '/dict/add', data)
}
// 编辑字典类型
export function editDict(data) {
  return postRequest(userApi + '/dict/edit', data)
}
// 编辑字典类型
export function deleteDict(data) {
  return postRequest(userApi + '/dict/del/' + data)
}

// 根据字典类型加载数据
export function getAllDictDataList(data) {
  return getRequest(userApi + '/dictdata/page', data)
}

// 添加字典数据
export function addDictData(data) {
  return postRequest(userApi + '/dictdata/add', data)
}
// 编辑字典数据
export function editDictData(data) {
  return postRequest(userApi + '/dictdata/update', data)
}
// 删除字典数据
export function deleteData(data) {
  return deleteRequest(userApi + '/dictdata/del/' + data)
}
// 根据字典类型加载数据
export function getDictDataByType(param) {
  return getRequest(userApi + `/dictdata/byType/${param}`)
}
