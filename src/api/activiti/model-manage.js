import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'
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
