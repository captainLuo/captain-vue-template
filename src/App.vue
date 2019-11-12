<template>
  <div id="app">
    <!-- alert-msg自制弹窗组件 -->
    <alert-msg ref="alertMsg" :is-show="is_show_publish" :top-distance="top_num" @on-close="closeDialog">
        <!-- <div slot="header">
            <img :src="img_path" alt="">
        </div>
        <div slot="main">
            <div v-html="mainDiv"></div>
        </div> -->
    </alert-msg>
    <transition :name="direction" >
      <router-view class="appView"></router-view>
    </transition>
  </div>
</template>

<script>
// import scss
import './assets/css/index.scss'
// 用于运送事件，主要子组件调用父组件的方法
import EventBus from './utils/EventBus.js'
// 引入图片，此方法可以解决路径问题
import clickYesImg from './assets/img/click_yes.png'
import clickNoImg from './assets/img/click_no.png'
export default {
  name: 'App',
  data () {
    return {
      is_show_publish: false,
      top_num: 30,
      img_path: '',
      mainDiv: '',
      direction: 'slide-right'
    }
  },
  components: {
    scroll
  },
  created () {
    EventBus.$on('showAlertMsg', data => {
      let self = this
      if (data === 'yes') {
        self.mainDiv = `
        <p>感谢您的支持</p>
        <p>如有其他疑问请致电3110086</p>
        `
        self.img_path = clickYesImg
      }
      if (data === 'no') {
        self.mainDiv = `
        <p>5阿哥已查收您的宽带故障，</p>
        <p>将安排专人与您联系！</p>
        `
        self.img_path = clickNoImg
      }
      self.$refs['alertMsg'].isShowAlert(self.img_path, self.mainDiv)
    })
  },
  methods: {
    closeDialog () {
      this.is_show_publish = false
    }
  },
  watch: {
    // 根据路由控制动画
    $route (to, from) {
      const toDepth = to.path.split('/').lenth
      const fromDepth = from.path.split('/'.length)
      if (to.path === '/') {
        this.direction = 'slide-right'
      } else if (from.path === '/') {
        this.direction = 'slide-left'
      } else {
        this.direction = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app{
  width: 100%;
  height: 100%;
  background-color:rgba(121,207,255,1);
}
.wrapper{
  width: 100%;
  height: 100%;
}
.appView {
  position: absolute;
  width:100%;
  transition: transform .3s ease-out;
}
.slide-left-enter{
  transform: translate(100%, 0);
}
.slide-left-leave-active{
  transform: translate(-50%, 0);
}
.slide-right-enter {
  transform: translate(-50%, 0);
}
.slide-right-leave-active{
  transform: translate(100%, 0);
}
</style>
