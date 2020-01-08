import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'
//模型分页列表

// 获取流程数据
export const getRunningProcess = (params) => {
  return getRequest(actApi+'/ins/getRunningProcess', params)
}
// 通过流程定义id获取第一个任务节点
export const getFirstNode = (id, params) => {
  return getRequest(actApi+`/ins/getFirstNode/${id}`, params)
}
// 通过流程实例id获取下一个任务节点
export const getNextNode = (id, params) => {
  return getRequest(actApi+`/ins/getNextNode/${id}`, params)
}
// 修改流程状态 激活/挂起
export const updateInsStatus = (params) => {
  return postRequest(actApi+'/ins/updateInsStatus', params)
}
// 删除流程运行实例
export const deleteProcessIns = (ids, params) => {
  return deleteRequest(actApi+`/ins/delInsByIds/${ids}`, params)
}
