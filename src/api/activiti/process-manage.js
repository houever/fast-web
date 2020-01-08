import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { actApi } from '../../config/env'
//流程分类
export const initActCategory = (params) => {
  return getRequest(actApi + '/category/byParentId/0', params)
}
// 加载类别子级数据
export const loadActCategory = (id, params) => {
  return getRequest(actApi + `/category/byParentId/${id}`, params)
}

//流程列表
export const getProcessDataList = (param) => {
  return getRequest(actApi + `/process/page/${param.current}/${param.size}`, param)
}

export const getProcessAllDate = () => {
  return getRequest(actApi + `/process/all`)
}

//修改流程
export function updateInfo(data) {
  return postRequest(actApi + `/process/update`, data)
}

// 通过文件部署模型流程
export const deployByFile = actApi + '/model/deployByFile'

// 导出流程资源
export const exportResource = 'http://localhost:9999/' + actApi + '/process/export'

//修改流程状态为挂起，激活
export const updateStatus = (param) => {
  return postRequest(actApi + `/process/updateStatus`, param)
}

// 转化流程为模型
export const convertToModel = (id, params) => {
  return getRequest(actApi + `/process/convertToModel/${id}`, params)
}

//删除流程
export const deleteProcess = (param) => {
  return deleteRequest(actApi + `/process/del/` + param)
}

// 节点设置
export const getProcessNode = (id, params) => {
  return getRequest(actApi + `/process/getProcessNode/${id}`, params)
}
// 节点用户设置
export const editNodeUser = (params) => {
  return postRequest(actApi + '/process/editNodeUser', params)
}
