// 默认地，表单数据会编码为 "application/x-www-form-urlencoded"。就是说，在发送到服务器之前，所有字符都会进行编码。
// 而axios.post提交的请求头是Content-Type: application/json
// 对传输的data做转换，转成非application/json的传输，这里注意传输的类型
// 根据后端是否使用json_decode来决定是否使用
// json_encode作用例：对象、数组转成json对象
// json_decode作用例：json字符串转成json对象
// 扩展一下
// application/json和application/x-www-form-urlencoded
// application/x-www-form-urlencoded 以对象的形式发送,而get请求就是序列化后的字符串
// application/json以 序列化后的 JSON 字符串的形式发送
import axios from 'axios'
import projectConfig from '../config'
import qs from 'qs'
import { Indicator } from 'mint-ui'
/**
 * 用axios重新封装https请求
 * axios插件详情请参考https://github.com/mzabriskie/axios
 * 以下是两种封装方法,第2比较利于管理，所以暂时使用，之后优化
 * 第一种直接修改axios对象：
    const baseUrl = projectConfig.baseUrl
    // 根据测试环境与生产环境切换接口的请求地址
    axios.defaults.baseURL = baseUrl
    // 开启跨域凭证，否则不携带cookies请求
    axios.defaults.withCredentials = true
    axios.defaults.transformRequest = [(data) => {
    // qs.stringify序列化数据(查询字符串),对应方法qs.parse
    // axios的content-type会根据data自动设置
    return qs.stringify(data)
    }]
    axios.interceptors.request.use(config => {
    Indicator.open({
        text: '加载中'
    })
    return config
    }, error => {
    // 请求发生错误处理
    return Promise.reject(error)
    })

    axios.interceptors.response.use(response => {
    // response.config类似上面的config
    Indicator.close()
    return response
    }, error => {
    // 这里resolve掉服务器错误情况，省得之后catch
    return Promise.resolve(error.response)
    })
    // 注入 Vue.Prototype, 暴露在外面
    export default axios
 */
/**
 * 第二种方法重新实例化封装
 * params options {}
*/
export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: projectConfig.baseUrl,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      timeout: 30000,
      withCredentials: true
      // 这里可以对返回的数据进行处理，这里数据处理发生在返回拦截器之前
      // 如何拦截器对数据进行了处理，勿重复处理
      // transformRequest: [(data) => {
      // qs.stringify序列化数据(查询字符串),对应方法qs.parse
      // axios的content-type会根据data自动设置
      // console.log(qs.stringify(data))
      // return qs.stringify(data)
      // return data
      // }]
    })
    // 请求拦截器
    instance.interceptors.request.use(config => {
      // Tip: 1
      // 请求开始的时候可以结合 vuex 开启全屏的 loading 动画
      // Tip: 2
      // 带上 token , 可以结合 vuex 或者重 localStorage
      // if (store.getters.token) {
      //     config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      // } else {
      //     // 重定向到登录页面
      // }
      // Tip: 3
      // 根据请求方法，序列化传来的参数，根据后端需求是否序列化
      Indicator.open({text: '加载中'})
      if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put' || config.method.toLocaleLowerCase() === 'delete') {
        config.data = qs.stringify(config.data)
      }
      return config
    }, error => {
      // 请求错误时做些事(接口错误、超时等)
      // Tip: 4
      // 关闭loadding
      Indicator.close()
      console.log('error.request:', error)
      // 1.判断请求超时
      if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        // console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
        // return service.request(originalRequest);//例如再重复请求一次
      }
      //  2.需要重定向到错误页面
      const errorInfo = error.response
      if (errorInfo) {
        // error =errorInfo.data
        // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
        // const errorStatus = errorInfo.status // 404 403 500 ... 等
        // router.push({
        //   path: `/error/${errorStatus}`
        // })
      }
      return Promise.reject(error)
    })

    // 响应拦截器
    instance.interceptors.response.use(response => {
      let data
      Indicator.close()
      // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
      if (response.data === undefined) {
        data = response.request.responseText
      } else {
        data = response.data
      }
      // 根据返回的code值来做不同的处理（和后端约定）
      //   switch (data.code) {
      //     case '':
      //       break
      //     default:
      //   }
      // 若不是正确的返回code，且已经登录，就抛出错误
      // const err = new Error(data.description)

      // err.data = data
      // err.response = response

      // throw err
      return data
    }, error => {
      Indicator.close()
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '请求错误'
            break
          case 401:
            error.message = '未授权，请登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = `请求地址出错: ${error.response.config.url}`
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器内部错误'
            break
          case 501:
            error.message = '服务未实现'
            break
          case 502:
            error.message = '网关错误'
            break

          case 503:
            error.message = '服务不可用'
            break

          case 504:
            error.message = '网关超时'
            break

          case 505:
            error.message = 'HTTP版本不受支持'
            break

          default:
        }
      }
      console.log('error.response:', error)
      return Promise.reject(error) // 返回接口返回的错误信息
    })
    // 请求处理
    instance(options)
      .then((res) => {
        resolve(res)
        return false
      })
      .catch((error) => {
        reject(error)
      })
  })
}
