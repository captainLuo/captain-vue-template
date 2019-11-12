// 这里主要是做jssdk参数的设置,请求后端的接口，拿到相应的参数.
// import wx from 'weixin-js-sdk' //无需直接导入，根据是否微信浏览器控制

// 这里主要是做jssdk参数的设置,请求后端的接口，拿到相应的参数.
import config from './config.js'

import { Toast } from 'mint-ui'
// 检查是否微信
export const checkIsWeixn = function () {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') >= 0) {
    return true
  } else {
    return false
  }
}

// 导入微信sdk
export const importWeixinSDK = function () {
  let doc = document
  let type = 'script'
  let ele = doc.createElement(type)
  let oldScr = doc.getElementsByTagName(type)[0]
  ele.src = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
  let promise = new Promise((resolve) => {
    ele.addEventListener('load', () => {
      resolve()
    })
  })
  oldScr.parentNode.insertBefore(ele, oldScr)
  return promise
}

export const getSign = async function (url, vm, apiList) {
  const response = await vm.$api.getJsTicket({
    url: url
  })
  let jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems']
  if (apiList && apiList.length) {
    jsApiList = jsApiList.concat(apiList)
  }
  let errcode = response.errcode
  if (errcode === 0) {
    let data = response.data
    /* eslint-disable no-undef */
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.error(function (res) {
      Toast('jssdk error:' + res.errMsg)
    })
  }
}

// 设置分享信息
export const setShare = function (title, desc, link, imgUrl) {
  if (link.indexOf('http') !== 0) {
    link = config.baseUrl + link
  }
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = config.baseUrl + imgUrl
  }
  /* eslint-disable no-undef */
  wx.ready(function () {
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
        Toast('分享成功')
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        // Toast('分享取消')
      }
    })
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        Toast('分享成功')
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
    wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
    wx.onMenuShareWeibo({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
    wx.onMenuShareQZone({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  })
  /* eslint-enable no-undef */
}

// 隐藏菜单栏
export const hideMenu = function () {
  /* eslint-disable no-undef */
  wx.ready(function () {
    wx.hideMenuItems({
      menuList: ['menuItem:share:facebook', 'menuItem:originPage', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:share:brand', 'menuItem:readMode'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    })
  })
  /* eslint-enable no-undef */
}

// 设置标题，document.title不可用时使用
export const setWechatTitle = function (title) {
  document.title = title
  var iframe = document.createElement('iframe')
  iframe.style.visibility = 'hidden'
  iframe.setAttribute('src', 'https://www.baidu.com/img/baidu_jgylogo3.gif')
  var iframeCallback = function () {
    setTimeout(function () {
      iframe.removeEventListener('load', iframeCallback)
      document.body.removeChild(iframe)
    }, 0)
  }
  iframe.addEventListener('load', iframeCallback)
  document.body.appendChild(iframe)
}
