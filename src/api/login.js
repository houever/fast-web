// eslint-disable-next-line no-unused-vars
import { loginRequest, postRequest } from '../utils/request'

export function login(username, password) {
  const data = {
    username,
    password
  }
  return loginRequest('auth/login','post', data)
}

export function getInfo(data) {
  return loginRequest('auth/info','get', data)
}

export function logout() {
  return loginRequest('auth/logout','post')
}
