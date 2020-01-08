import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'
//
// initActCategory,
// loadActCategory,
// addActCategory,
// editActCategory,
// deleteActCategory,
// searchActCategory

// 获取一级类别
export const initActCategory = (params) => {
  return getRequest(actApi+'/category/byParentId/0', params)
}
// 加载类别子级数据
export const loadActCategory = (id, params) => {
  return getRequest(actApi+`/category/byParentId/${id}`, params)
}

// 添加类别
export const addActCategory = (params) => {
  return postRequest(actApi+'/category/add', params)
}
// 编辑类别
export const editActCategory = (params) => {
  return postRequest(actApi+'/category/update', params)
}
// 删除类别
export const deleteActCategory = (ids, params) => {
  return deleteRequest(actApi+`/category/del/${ids}`, params)
}
// 搜索类别
export const searchActCategory = (params) => {
  return getRequest(actApi+'/category/search', params)
}
