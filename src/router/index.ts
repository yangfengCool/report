import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

declare const _hmt: any

if (process.env.NODE_DEV !== 'production') {
  Vue.use(VueRouter)
}

let routes = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: {
      title: '404'
    }
  }
]

const routerContext = require.context('./modules', true, /\.ts$/)
routerContext.keys().forEach(route => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  routes = routes.concat(routerModule.default || routerModule)
})

const tempObj: any = {
  path: '*',
  redirect: {
    name: '404'
  }
}
routes = routes.concat(tempObj)

const myRouter = new VueRouter({
  mode: 'history', // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})

const history = window.sessionStorage
const tempHist: any = history.getItem('count')
let historyCount: any = (tempHist * 1) || 0
history.setItem('/', String(0))

myRouter.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title
  store.commit('updatePageTitle', to.meta.title)
  try {
    ;(_hmt as any).push(['_trackPageview', to.fullPath])
  } catch (error) {
    console.log(error)
  }
  // 页面切换动画
  if (to.params.direction) {
    store.commit('updateDirection', to.params.direction)
  } else {
    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)
    // 判断并记录跳转页面是否访问过，以此判断跳转过渡方式
    if (toIndex) {
      if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
        store.commit('updateDirection', 'forward')
      } else {
        store.commit('updateDirection', 'back')
      }
    } else {
      ++historyCount
      history.setItem('count', String(historyCount))
      to.path !== '/' && history.setItem(to.path, String(historyCount))
      store.commit('updateDirection', 'forward')
    }
  }
  next()
})

myRouter.afterEach((to, from) => {
  // 全局路由守卫
})

export default myRouter
