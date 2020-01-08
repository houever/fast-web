import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'

/********************************模型管理*****************************************/
//模型分页列表
export function getModelDataList(data) {
  return getRequest(actApi+'/model/page',data)
}
//添加一个模型
export function addModel(data) {
  return postRequest(actApi+'/model/add',data)
}
// 部署模型
export const deployModel = (params) => {
  return postRequest(actApi+`/model/deploy`, params)
}
export const exportModel = `/model/export/`;
// 删除模型
export const deleteModel = (ids, params) => {
  return deleteRequest(actApi+`/model/delByIds/${ids}`, params)
}

/********************************发布管理*****************************************/
export const getBusinessDataList = (data) =>{
  return getRequest(actApi+`/business/page/${data.current}/${data.size}`,data)
}
export const applyBusiness = (data) =>{
  return postRequest(actApi+`/business/apply`,data)
}

export const cancelApply = (data) =>{
  return postRequest(actApi+`/business/withdraw`,data)
}

export const deleteBusiness = (id) =>{
  return deleteRequest(actApi+`/business/del/${id}`)
}
/********************************我的申请*****************************************/

/********************************我的待办*****************************************/
// 获取已办列表
export const todoList = (params) => {
  return postRequest(actApi+'/task/todoList', params)
}
// 审批任务通过
export const pass = (params) => {
  return postRequest(actApi+'/task/pass', params)
}

// 委托他人代办
export const delegate = (params) => {
  return postRequest(actApi+'/task/delegate', params)
}


/********************************我的已办*****************************************/
// 获取已办列表
export const doneList = (params) => {
  return getRequest(actApi+`/task/doneList/${params.current}/${params.size}`, params)
}
// 获取流程流转历史
export const historicFlow = (id, params) => {
  return getRequest(actApi+`/task/historicFlow/${id}`, params)
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
/********************************运行中的流程*****************************************/
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
/********************************流程管理*****************************************/

//流程列表
export const getProcessDataList = (param) =>{
  return getRequest(actApi+`/process/page/${param.current}/${param.size}`,param)
}

export const getProcessAllDate = () =>{
  return getRequest(actApi+`/process/all`)
}


//修改流程
export function updateInfo(data) {
  return postRequest(actApi+`/process/update`,data)
}

// 通过文件部署模型流程
export const deployByFile = actApi+"/model/deployByFile"

// 导出流程资源
export const exportResource = "http://localhost:9999/"+actApi+"/process/export"

//修改流程状态为挂起，激活
export const updateStatus = (param) => {
  return postRequest(actApi+`/process/updateStatus`,param)
}

// 转化流程为模型
export const convertToModel = (id, params) => {
  return getRequest(actApi+`/process/convertToModel/${id}`, params)
}

//删除流程
export const deleteProcess = (param) => {
  return deleteRequest(actApi+`/process/del/`+param)
}

// 节点设置
export const getProcessNode = (id, params) => {
  return getRequest(actApi+`/process/getProcessNode/${id}`, params)
}
// 节点用户设置
export const editNodeUser = (params) => {
  return postRequest(actApi+'/process/editNodeUser', params)
}
/********************************流程分类管理*****************************************/
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
