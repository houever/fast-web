/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 老项目域名地址
 * khglUrl: 客户管理域名地址
 * dicUrl : 字典服务器地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * welUrl :默认欢迎页
 *
 */

let baseUrl = ''
const iconfontVersion = ['567566_r22zi6t8noas8aor']
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`
const codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV === 'development') {
  baseUrl = `http://localhost:8443/` // 开发环境地址
} else if (env.NODE_ENV === 'production') {
  baseUrl = `http://192.168.11.16:8080` // 生产环境地址
} else if (env.NODE_ENV === 'test') {
  baseUrl = `http://localhost:8080` // 测试环境地址
}
//用户管理服务
const userApi = 'fast-admin';
//工作流服务
const actApi = '';
const uploadFileAction = "http://10.1.70.39:9008/upload/file"
export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  userApi,
  actApi,
  env
}
