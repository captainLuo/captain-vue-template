// process.env.test_production判断是否正式环境，此处未使用
// test_production環境變量配置方法
// 1.安裝cross-env
// 2.在package中"dev"中增加cross-env test_production=false
// 3.在webpack.dev.conf.js中找到new webpack.DefinePlugin
// 4.增加一行'process.env.test_production': JSON.stringify(process.env.test_production)
// 适应本地的开发配置用测试环境的地址.不然就使用服务器的origin
let origin = location.origin
let baseUrl = ''
if (origin.indexOf('http://localhost') === 0) {
  // 非正式环境
  // 跨域问题参考/config/index.js种的proxyTable配置问题解决
  baseUrl = '/api/qyyd/qumi/InriceWeixin/index_debug.php?s=/addon/'
} else {
  // 正式环境
  baseUrl = `${origin}/index.php?s=/addon/`
}
export default{
  baseUrl: baseUrl
}
