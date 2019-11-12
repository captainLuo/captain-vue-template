// 最简单粗暴的方法，就是禁止掉浏览器整个页面的滑动
// 一般不建议使用，除非整个页面都不可以滚动时
// document.body.addEventListener('touchmove', function (evt) {
//   if (!evt._isScroller) {
//     evt.preventDefault()
//   }
// })
// 另一种方法
// 完美解决safari、微信浏览器下拉回弹效果和上拉空白的bug
// 除了需要滚动的部分，禁止掉浏览器滚动的默认事件
/**
 * 使用方法
 * 注意：this.hiddenPrevent必须要写成一个方法，在监听事件事调用，如果写到监听中，移除时不会起作用，
 * 是由于在添加监听和移除监听中写的函数不是同一个内存地址了，所以移除监听会失效
  mounted () {
    this.overscroll(document.querySelector('#app')) // 让id为app的部分有默认滚动事件
    document.body.addEventListener('touchmove', this.hiddenPrevent, {passive: false})
  },
  destroyed () {
    // 销毁时移除监听
    document.body.removeEventListener('touchstart', this.hiddenPrevent, {passive: false})
    document.body.removeEventListener('touchmove', this.hiddenPrevent, {passive: false})
  },
 */
function overscroll (el) {
  el.addEventListener('touchstart', function () {
    let top = el.scrollTop
    let totalScroll = el.scrollHeight
    let currentScroll = top + el.offsetHeight
    // 滚动条在最顶部，阻止冒泡行为
    if (top === 0) {
      el.scrollTop = 1
    } else if (currentScroll === totalScroll) {
      // 滚动条在最底部，阻止冒泡行为
      el.scrollTop = top - 1
    }
  })

  el.addEventListener('touchmove', function (evt) {
    // 元素的可滚动高度大于元素的大度设置事件的_isScroller
    if (el.offsetHeight < el.scrollHeight) { evt._isScroller = true }
    // 留意上面的注意，这样写可能销毁不了
    document.body.addEventListener('touchmove', hiddenPrevent, {passive: false})
  })
}

// 监听事件方法
function hiddenPrevent (evt) {
  if (!evt._isScroller) {
    evt.preventDefault()
  }
}

// 解决ios微信端失焦键盘隐藏后，被顶起的页面不回弹问题
function resolveScroll (vue) {
  let checkWxScroll = function () {
    let currentPosition, timer
    let speed = 1
    timer = setInterval(function () {
      currentPosition = document.documentElement.scrollTop || document.body.scrollTop
      currentPosition -= speed
      window.scrollTo(0, currentPosition)
      currentPosition += speed
      window.scrollTo(0, currentPosition)
      clearInterval(timer)
    }, 1)
  }
  // 添加指令iphone输入框失焦回弹
  vue.directive('iosbugscroll', {
    inserted: function (el, binding, vnode) {
      var ua = navigator.userAgent.toLowerCase()
      if (/micromessenger/.test(ua)) {
        if (/iphone|ipad|ipod/.test(ua)) {
          // input、textarea被组件包装的场景
          const childInput = el.getElementsByTagName('input')
          const childTextarea = el.getElementsByTagName('textarea')
          for (let i = 0; i < childInput.length; i++) {
            childInput[i].onblur = function temporaryRepair () {
              setTimeout(function () {
                checkWxScroll()
              }, 200)
            }
          }

          for (let i = 0; i < childTextarea.length; i++) {
            childTextarea[i].onblur = function temporaryRepair () {
              setTimeout(function () {
                checkWxScroll()
              }, 200)
            }
          }
          // input、textarea中的场景
          el.onblur = function temporaryRepair () {
            setTimeout(function () {
              checkWxScroll()
            }, 200)
          }
        }
      }
    }
  })
}

// 腾讯mta浏览记录
function recordView (name, sid) {
  /*eslint-disable */
    let _mtac = {}
    let mta = document.createElement('script')
    mta.src = 'http://pingjs.qq.com/h5/stats.js?v2.0.2'
    mta.setAttribute('name', name)
    mta.setAttribute('sid', sid)
    let s = document.getElementsByTagName('body')[0]
    s.parentNode.insertBefore(mta, s)
  }
  
  /*
   * base on clientWidth,then transform to rem,default 320px == 20rem
   * this way in lifecycle 'mounted' in App.vue is ok
   */
  function setRem (win, doc) {
      let docEl = doc.documentElement
      let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
      let reCaculate = () => {
        let clientWidth = docEl.clientWidth
        if (!clientWidth) return
        docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
      }
      if (!doc.addEventListener) return
      win.addEventListener(resizeEvt, reCaculate, false)
      doc.addEventListener('DOMContentLoaded', reCaculate, false)
    }
  
  export {
    overscroll,
    hiddenPrevent,
    resolveScroll,
    recordView,
    setRem
  }
  