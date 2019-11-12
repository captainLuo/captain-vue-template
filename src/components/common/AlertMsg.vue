<template>
    <div class="dialog">
    <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
    <div class="dialog-cover" v-if="current_is_show" @click="closeMyself"></div>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
        <!--style 通过props 控制内容的样式 -->
        <div class="dialog-content" :style="{textAlign:textAlign,top:topDistance+'%',width:widNum+'%',left:leftSite+'%'}" v-if="current_is_show">
            <div class="dialog_head">
                <!--弹窗头部 title-->
                <!-- <slot name="header">提示信息</slot> -->
                <img :src="headerHtml" alt="">
                <!-- <div v-html="headerHtml"></div> -->
            </div>
            <div class="dialog_main" :style="{paddingTop:pdt+'px',paddingBottom:pdb+'px'}">
                <!--弹窗的内容-->
                <!-- <slot name="main">弹窗内容</slot> -->
                <div v-html="mainHTml"></div>
            </div>
            <!--弹窗关闭按钮-->
            <div class="foot_close" @click="closeMyself">
                <div class="close"></div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>

export default {
  name: 'alert-msg',
  data () {
    return {
      current_is_show: this.isShow,
      headerHtml: '',
      mainHtml: ''

    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    textAlign: {
      type: String,
      default: 'center'
    },
    widNum: {
      type: Number,
      default: 86.5
    },
    leftSite: {
      type: Number,
      default: 6.5
    },
    topDistance: {
      type: Number,
      default: 35
    },
    pdt: {
      type: Number,
      default: 10
    },
    pdb: {
      type: Number,
      default: 10
    }
  },
  mounted () {
    this.overbody(this.current_is_show, this)
  },
  methods: {
    closeMyself () {
      this.current_is_show = false
      this.overbody(this.current_is_show, this)
    },
    isShowAlert (headerHtml, mainHTml) {
      this.current_is_show = true
      this.headerHtml = headerHtml
      this.mainHTml = mainHTml
    },
    /**
   * 弹窗滚动穿透
   * @param {Boolean} state [弹窗状态]
   */
    overbody (state, _this) {
      if (state) {
        // 记录此时滚动条位置
        _this.scrollTop = getScrollTop()
        // 使body固定定位，脱离文档流
        document.body.classList.add('mask-open')

        // 把脱离文档流的body拉上去！否则页面会回到顶部！
        document.body.style.top = -_this.scrollTop + 'px'
      } else {
        // body去除固定定位，回到了文档流中
        document.body.classList.remove('mask-open')
        // 回打开前滚动条位置
        goScrollTop(_this.scrollTop)
        _this.scrollTop = 0
      }
      function goScrollTop (scrollTop) {
        document.body.scrollTop = document.documentElement.scrollTop = scrollTop
      }
      function getScrollTop () {
        return document.body.scrollTop || document.documentElement.scrollTop
      }
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.dialog{
    position: relative;
    color: #2e2c2d;
    font-size: 16px;
    .dialog-cover{
        background-color: rgba(0,0,0,.8);
        position:fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }
    .dialog-content{
        position: fixed;
        top:35%;
        display:flex;
        padding:10px 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 300;
        background-color: #ffffff;
        border-radius: 5px;
        border: 2px solid #4a98fb;
        color: #4a98fb;
        .dialog_head{
          min-width: 25%;
        }
    }
    .foot_close{
      .close {
        position: absolute;
        left: 50%;
        bottom: -50px;
        transform: translateX(-25px);
        width: 40px;
        height: 40px;
        background-color: transparent;
        border-radius: 20px;
        box-shadow: 2px 2px 5px 0px black;
        border: 1px solid #ffffff;
        cursor: pointer;
        &:before {
          position: absolute;
          content: '';
          width: 25px;
          height: 2px;
          background: white;
          transform: rotate(45deg);
          top: 17px;
          left: 7px;
        }
        &:after{
          content: '';
          position: absolute;
          width: 25px;
          height: 2px;
          background: white;
          transform: rotate(-45deg);
          top: 17px;
          left: 7px;
        }
    }
  }
}
</style>
<style>
/*上升全局可使用*/
.mask-open{
  position: fixed;
  width: 100%;
}
.dialog_head img{
    width:100%;
  }
</style>
