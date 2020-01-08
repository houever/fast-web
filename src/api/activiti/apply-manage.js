import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'

// getProcessDataList,
// getFirstNode,
// getBusinessDataList,
// applyBusiness,
// deleteBusiness,
// cancelApply

export const getBusinessDataList = (data) =>{
  return postRequest(actApi+`/business/page`,data)
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
