const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  browserHeaderTitle: state => state.user.browserHeaderTitle,
  errorLogs: state => state.errorLog.logs,
  bgVideo: state => state.loginBg.bgVideo,
  bgWebm: state => state.loginBg.bgWebm,
  bgImg: state => state.loginBg.bgImg
}
export default getters
