import request from '@/utils/request'
import {loginRequest} from '../utils/request'
import axios from 'axios'
import { baseUrl } from '../config/env'

export function login(data) {
  return axios({
    method: 'post',
    url: `localhost:9001/auth/login`,
    data: data,
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getInfo(token) {
  return axios({
    method: 'post',
    url: `localhost:9001/auth/info`,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
