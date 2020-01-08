//封装storage的文件  模块化的文件
const RoleKey = 'roles'

const BtnKey = 'btns'

const Menukey = 'menus'


export function getRoles() {
  return JSON.parse(window.localStorage.getItem(RoleKey))
}

export function setRoles(roles) {
  window.localStorage.setItem(RoleKey,JSON.stringify(roles));
}

export function removeRoles() {
  return window.localStorage.removeItem(RoleKey)
}


export function getBtns() {
  return JSON.parse(window.localStorage.getItem(BtnKey))
}

export function setBtns(btns) {
  window.localStorage.setItem(BtnKey,JSON.stringify(btns));
}

export function removeBtns() {
  return window.localStorage.removeItem(BtnKey)
}


export function getMenus() {
  return JSON.parse(window.localStorage.getItem(Menukey))
}

export function setMenus(menus) {
  window.localStorage.setItem(Menukey,JSON.stringify(menus));
}

export function removeMenus() {
  return window.localStorage.removeItem(Menukey)
}

export function removeUserInfo() {
  window.localStorage.clear()
}
