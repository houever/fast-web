import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'
//模型分页列表
// getLeaveData,
// addLeave,
// updateLeave,
// applyLeave

//根据id查询请假申请
export const getLeaveData = (id)=>{
  return getRequest(actApi+`/leave/${id}`)
}
//添加请假申请
export const addLeave = (data) =>{
  return postRequest(actApi+`/leave/add`,data)
}
//修改请假申请
export const updateLeave = (data) =>{
  return postRequest(actApi+`/leave/update`,data)
}
//发布请假申请
export const applyLeave = (id) =>{
  return postRequest(actApi+`/leave/apply/${id}`)
}
