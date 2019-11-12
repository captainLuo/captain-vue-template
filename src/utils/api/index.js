// 导入所有接口
import apList from './interface'

const install = Vue => {
  if (install.installed) return
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    $api: {
      get () {
        return apList
      }
    }
  })
}

export default install
