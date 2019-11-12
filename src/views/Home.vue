<template>
  <scroll class="wrapper" :pulldown="pulldown" @pulldown="loadData">
    <div class="page">
      <!-- <img class="page_bg" src="../assets/img/bg.png" alt=""> -->
      <div class="main_content">
          <div class="banner_box">
            <!-- <img src="../assets/img/banner.png" alt="banner"> -->
          </div>
          <div class="writing_box">
            <input type="text" id="phone" v-iosbugscroll v-model="phone" placeholder="请输入清远移动号码">
            <div class="code_box">
              <input type="text" id="code" v-iosbugscroll v-model="code" placeholder="输入验证码">
              <button id="btn_code" @click="sendCode">{{btn_code_text}}</button>
            </div>
            <Button class="submit" size="large" type="danger" @click="confirm">确认</Button>
          </div>
      </div>
      <!-- <div class="footer">
          <img src="../assets/img/footer.png" alt="">
      </div> -->
    </div>
  </scroll>
</template>

<script>
import { Toast, Picker, Popup, Button } from 'mint-ui'
// import EventBus from '@/utils/EventBus.js'
export default {
  name: 'home',
  data () {
    return {
      phone: '',
      code: '',
      btn_code_disable: false,
      pulldown: true,
      btn_code_text: '获取验证码',
      time: 60
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    loadData () {
      console.log('加载数据')
    },
    checkParams (phone, code) {
      if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
        Toast('请输入正确号码')
        return false
      }
      if (!code || !/^\d{4}$/.test(code)) {
        Toast('验证码格式错误')
        return false
      }
      return true
    },
    confirm () {
      if (this.checkParams(this.phone, this.code)) {
        let that = this
        let data = {
          phone: this.phone,
          code: this.code
        }
        this.$api.commitSms(data).then(res => {
          if (res.errcode === 0) {
            // 返回数据处理
            that.$router.replace({
              name: 'list'
            })
          } else {
            Toast(res.msg)
          }
        }).catch(err => {
          console.warn('err', err)
        })
      }
    },
    sendCode () {
      let that = this
      if (this.btn_code_disable) return false
      this.btn_code_disable = true
      // 检查号码
      let phone = this.phone
      if (!(/^1[3456789]\d{9}/.test(phone))) {
        this.btn_code_disable = false
        Toast('手机号码有误，请重填')
        return false
      }
      that.$api.sendSms({
        'phone': phone
      })
        .then(res => {
          this.btn_code_disable = false
          if (res.errcode === 1) {
            Toast(res.msg)
          } else {
            Toast('发送成功')
            that.countTime()
          }
        })
        .catch(err => {
          this.btn_code_disable = false
          console.log('send-sms-err:', err)
        })
    },
    countTime () {
      let that = this
      if (this.time-- > 0) {
        that.btn_code_text = that.time
        setTimeout(() => {
          that.countTime()
        }, 1000)
      } else {
        that.time = 60
        this.btn_code_text = '获取验证码'
        this.btn_code_disable = false
      }
    }
  },
  computed: {
  },
  components: {
    Picker,
    Popup,
    Button
  }
}
</script>

<style lang='scss' scoped>
@import '../assets/css/mixin.scss';
.page{
  min-height: 100%;
  height:auto;
  width:100%;
  .page_bg{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
  }
  .main_content{
    position: relative;
    top: 0;
    left: 5%;
    width: 90%;
    height: calc(100% - 1.5rem);
    padding-top:1px;
    min-height: 568px;
    .banner_box{
      position: relative;
      top: 0rem;
      margin-top: 1.5rem;
      padding-bottom: 56%;
      height: 0;
      overflow: hidden;
      background: transparent;
        img{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
    }
    .writing_box{
      width: 100%;
      min-height: 10rem;
      background-color: #ffffff;
      position: relative;
      top: 1rem;
      border-radius: .3rem;
      padding: 1rem .5rem;
      #phone{
        height: 1.5rem;
        line-height: 1.5rem;
        width: 100%;
        border-radius: .2rem;
        margin-bottom: .8rem;
        font-size: .6rem;
        border: 1px solid #c8ebff;
        color: #a5ceff;
        text-align: center;
      }
      .code_box{
        display: flex;
        #code{
          height: 1.5rem;
          line-height: 1.5rem;
          width: 5rem;
          border-radius: .2rem;
          margin-bottom: .8rem;
          font-size: .6rem;
          border: 1px solid #c8ebff;
          color: #a5ceff;
          text-align: center;
          flex-grow: 1;
          margin-right: .2rem;
        }
        #btn_code{
          flex-grow: 1;
          height: 1.5rem;
          line-height: 1.5rem;
          border-radius: .2rem;
          font-size: .6rem;
          color: #ffffff;
          background-color: #ef4f4f;
        }
      }
      input::input-placeholder{
        color:  #a5ceff;
      }
      ::-webkit-input-placeholder {
      color: #a5ceff;
      }
      .submit{
        margin:0 auto;
        display:block;
      }
    }
  }
  .footer{
    position: relative;
    height: 1.5rem;
    width: 100%;
    z-index: 10;
    img{
      display: block;
      margin: 0 auto;
      height: 1.5rem;
    }
  }
}
@media screen and (max-width: 450px){
  .page{
    width: 100%;
  }

}
@media screen and (min-width: 640px) {
  .page{
    width:640px;
    margin: 0 auto;
  }
}
</style>
