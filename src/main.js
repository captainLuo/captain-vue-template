// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'mint-ui/lib/style.css' // 注入mint-ui样式
import api from './utils/api/index' // 重新封装axios
import AlterMsg from './components/common/AlertMsg'// 导入自定义弹窗组件作为全局组件
import { resolveScroll, setRem } from './utils/init'// 导入初始化需要的函数
import Scroll from './components/common/Scroll'
import {importWeixinSDK, getSign} from './utils/weixin'// 微信浏览器时使用

resolveScroll(Vue)// ihpone 回弹指令添加
setRem(window, document)// 设置自适应宽度，具体屏幕宽度为16rem
Vue.use(api)// 此时可以直接在 Vue 原型上调用 $api 了
Vue.component(AlterMsg.name, AlterMsg)// 注册全局组件
Vue.component(Scroll.name, Scroll)// 注册全局组件
Vue.config.productionTip = false

Vue.filter('dataFormat', function (value, fmt) {
  let getDate = new Date(value * 1000)
  let o = {
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    'S': getDate.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  created () {
    // 微信端使用jsdk
    // 当url作为参数传递时如果没有用encodeURIComponent进行编码，会造成传递时url中的特殊字符丢失。
    let that = this
    let url = encodeURIComponent(location.href.split('#')[0])
    importWeixinSDK().then(res => {
      getSign(url, that)
    })
    // this.$api.checkLogin({
    //   headers: {
    //     'page-url': location.href
    //   }
    // })
    //   .then(res => {
    //     if (res.errcode === 0) {
    //       if (res.data) {
    //         // 设置用户的状态.0 （未关注）；1 （已经关注但为绑定手机）； 2 （已经关注并且绑定）； 3（已经关注并且已经绑定但为黑名单)
    //         window.$user_status = res.data.status
    //         // 将用户的uid存入，便于pv
    //         window.$uid = res.data.uid
    //       } else {
    //         window.location.href = res.data
    //       }
    //     }
    //   })
    //   .catch(err => {
    //     console.warn('getSign-err:', err)
    //   })
  }
})
