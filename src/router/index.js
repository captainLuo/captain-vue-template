import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
// 异步加载路由第三种
// const Home = (resolve) => {
//   import('@/components/Home').then((module) => {
//     resolve(module)
//   })
// }

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      // 异步加载路由第一种
      // component: resolve=>require(["@/components/Home"],resolve)
      // 异步加载路由第二种
      // component: ()=>import("@/components/Home")
      component: resolve => require(['../views/Home.vue'], resolve),
      meta: {
        title: '登陆'
      }
    },
    {
      path: '/list',
      name: 'list',
      component: resolve => require(['../views/List.vue'], resolve),
      meta: {
        title: '列表'
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
