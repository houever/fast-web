import request from '@/utils/request'
import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import {actApi} from '../../config/env'

// 获取高亮实时流程图
export const getHighlightImg = "http://localhost:9999/"+actApi+"/ins/getHighlightImg/"

export const historicFlow = (id) =>{
  return getRequest(actApi+`/task/historicFlow/${id}`)
}
