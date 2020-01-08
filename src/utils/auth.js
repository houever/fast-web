
const TokenKey = 'accesstoken'

export function getToken() {
  return JSON.parse(window.sessionStorage.getItem(TokenKey))
}

export function setToken(token) {
  window.sessionStorage.setItem(TokenKey,JSON.stringify(token));
}

export function removeToken() {
  return window.sessionStorage.removeItem(TokenKey)
}
