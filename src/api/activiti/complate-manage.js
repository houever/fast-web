import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'
//模型分页列表

// 获取已办列表
export const doneList = (params) => {
  return postRequest(actApi+'/task/doneList', params)
}
// 获取流程流转历史
export const historicFlow = (id, params) => {
  return getRequest(actApi+`/task/historicFlow/${id}`, params)
}
// 委托他人代办
export const delegate = (params) => {
  return postRequest(actApi+'/task/delegate', params)
}
// 审批任务通过
export const pass = (params) => {
  return postRequest(actApi+'/task/pass', params)
}
// 审批任务驳回
export const back = (params) => {
  return postRequest(actApi+'/task/back', params)
}
// 删除任务
export const deleteTask = (ids, params) => {
  return deleteRequest(actApi+`/task/delete/${ids}`, params)
}
// 删除历史任务
export const deleteHistoricTask = (ids, params) => {
  return deleteRequest(actApi+`/task/deleteHistoric/${ids}`, params)
}
