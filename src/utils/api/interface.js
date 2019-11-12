import axios from './api' // 导入api
/**
 * 将所有接口统一起来便于维护。
 * 如果项目很大可以将url独立成文件，接口分成不同的模块。
 * 在使用axios时，注意到配置选项中包含params和data两者，以为他们是相同的，实则不然。
 * 因为params是添加到url的请求字符串中的，用于get请求。
 * 而data是添加到请求体（body）中的， 用于post请求。
 * 所以下面的parmas会在url出现而不在data中出现
 * 使用了param就算method是post也会以get的方式提交，如下，php要用get方法获取
 */
// 验证验证码
export const commitSms = data => {
  return axios({
    url: 'Server/ReportObstacleApi/commitSms',
    method: 'post',
    data
  })
}

// 发信验证码
export const sendSms = data => {
  return axios({
    url: 'Server/ReportObstacleApi/send_sms',
    method: 'post',
    data
  })
}

// 获取微信接口参数
export const getJsTicket = data => {
  return axios({
    url: 'Server/ReportObstacleApi/getJsTicket',
    method: 'post',
    data
  })
}

// 检查微信登陆接口
export const checkLogin = data => {
  let options = {
    url: 'Server/weixinApi/checklogin',
    method: 'post'
  }
  let obj = {}
  Object.assign(obj, data, options)
  return axios(obj)
}

// 导出数据
export const exportData = data => {
  let options = {
    url: 'Server/ReportObstacleApi/exportData',
    method: 'post',
    data
  }
  return axios(options)
}

// 查询数据
export const getData = data => {
  let options = {
    url: 'Server/ReportObstacleApi/getData',
    method: 'post',
    data
  }
  return axios(options)
}

// 默认全部导出
export default {
  commitSms,
  sendSms,
  getJsTicket,
  checkLogin,
  exportData,
  getData
}
