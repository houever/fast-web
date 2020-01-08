import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { actApi } from '../../config/env'
//模型分页列表

// 获取已办列表
export const todoList = (params) => {
  return getRequest(actApi + `/task/todoList/${params.current}/${params.size}`, params)
}
// 审批任务通过
export const pass = (params) => {
  return postRequest(actApi + '/task/pass', params)
}
// 审批任务驳回
export const back = (params) => {
  return postRequest(actApi + '/task/back', params)
}
// 委托他人代办
export const delegate = (params) => {
  return postRequest(actApi + '/task/delegate', params)
}
// 删除任务
export const deleteTask = (ids, params) => {
  return deleteRequest(actApi + `/task/delete/${ids}`, params)
}
